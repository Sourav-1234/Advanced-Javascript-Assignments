// Problem Description – Fair FIFO Mutex
//
// Implement a Mutex to control access to an async resource.
//
// Only one task may run at a time. Extra tasks must wait in a queue
// and be executed in FIFO order.
//
// When a task finishes, the lock should be released automatically
// and the next queued task should start.
//
// Requirements:
// - Run immediately if free.
// - Queue when locked (FIFO).
// - Auto-release on task completion.
// callbacks/hard/fifoMutex.js

class Mutex {
  constructor() {
    this.locked = false;
    this.queue = [];
  }

  /**
   * Lock the mutex and run a task.
   * @param {function(cb: function)} task - Node-style task accepting a callback.
   * @param {function} onComplete - Callback called when task finishes (err, result).
   */
  lock(task, onComplete) {
    const wrappedTask = () => {
      // Wrap task in try/catch and ensure next task runs
      try {
        task((err, result) => {
          if (onComplete) onComplete(err, result);
          this._release(); // Always release mutex after task finishes
        });
      } catch (err) {
        if (onComplete) onComplete(err);
        this._release();
      }
    };

    if (!this.locked) {
      this.locked = true;
      wrappedTask(); // Run immediately
    } else {
      this.queue.push(wrappedTask); // Queue for FIFO
    }
  }

  _release() {
    if (this.queue.length > 0) {
      const nextTask = this.queue.shift(); // FIFO
      nextTask();                           // Run next task
    } else {
      this.locked = false;                  // No tasks left, unlock
    }
  }
}

module.exports = Mutex;
