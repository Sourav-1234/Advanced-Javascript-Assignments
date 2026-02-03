// Problem Description – Asynchronous Worker Pool

// You are required to create a worker pool that manages the execution of asynchronous tasks. 
// The pool should ensure that no more than N tasks are running concurrently, while any additional tasks are queued. 
// As tasks complete, queued tasks should start automatically.
// Each task must resolve with its own result.

// callbacks/medium/CallbackPool.js

class CallbackPool {
  constructor(limit) {
    this.limit = limit;      // concurrency limit
    this.running = 0;        // currently running tasks
    this.queue = [];         // queued tasks
  }

  // Run a task with optional Node-style callback
  run(task, onComplete) {
    this.queue.push({ task, onComplete });
    this._next();
  }

  _next() {
    while (this.running < this.limit && this.queue.length > 0) {
      const { task, onComplete } = this.queue.shift();
      this.running++;

      // Wrap Node-style callback task in a Promise
      let called = false;
      const cb = (err, result) => {
        if (called) return;
        called = true;
        if (onComplete) onComplete(err, result);
        this.running--;
        this._next();
      };

      try {
        const result = task(cb); // call task with Node-style callback
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

module.exports = CallbackPool;
