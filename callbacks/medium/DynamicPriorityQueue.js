// Problem Description – Priority Task Queue with Dynamic Concurrency

// You are required to implement a task queue that executes asynchronous tasks based on priority. 
// Higher-priority tasks should be executed before lower-priority ones. 
// The queue must enforce a concurrency limit, ensuring only a fixed number of tasks run at the same time, and allow this limit to be updated dynamically while the system is running.
// callbacks/medium/DynamicPriorityQueue.js

// callbacks/medium/DynamicPriorityQueue.js

class DynamicPriorityQueue {
  constructor(concurrency = 1) {
    this.concurrency = concurrency;
    this.running = 0;
    this.queue = [];
  }

  // Optionally adjust concurrency limit dynamically
  setLimit(newLimit) {
    this.concurrency = newLimit;
    this._runNext();
  }

  // Add a task with priority and callback
  add(task, priority = 0, onComplete) {
    this.queue.push({ task, priority, onComplete });
    // Sort queue: higher priority first
    this.queue.sort((a, b) => b.priority - a.priority);
    this._runNext();
  }

  _runNext() {
    while (this.running < this.concurrency && this.queue.length > 0) {
      const { task, onComplete } = this.queue.shift();
      this.running++;

      // Support Node-style callback tasks
      let called = false;
      const cb = (err, result) => {
        if (called) return; // prevent multiple calls
        called = true;
        if (onComplete) onComplete(err, result);
        this.running--;
        this._runNext();
      };

      try {
        const result = task(cb);
        // If task returns a Promise, resolve it
        if (result && typeof result.then === "function") {
          result.then((res) => cb(null, res)).catch((err) => cb(err));
        }
      } catch (err) {
        cb(err);
      }
    }
  }
}

module.exports = DynamicPriorityQueue;
