// Problem Description – Async Mutex with Timeout
//
// You need to acquire a lock before running an async task.
// If the lock cannot be acquired within a given time limit,
// the operation should fail.
//
// This problem tests concurrency control and timeout handling.
//

class TimedMutex {
  constructor() {
    this.locked = false;
    this.queue = [];
  }

  acquire(timeoutMs) {
    return new Promise((resolve, reject) => {
      // Fast path: lock is free
      if (!this.locked) {
        this.locked = true;
        return resolve(this._release.bind(this));
      }

      // Otherwise, enqueue the request
      const waiter = { resolve, reject };
      this.queue.push(waiter);

      // Handle timeout if specified
      let timer;
      if (timeoutMs != null) {
        timer = setTimeout(() => {
          const index = this.queue.indexOf(waiter);
          if (index !== -1) {
            this.queue.splice(index, 1);
            reject("Lock Timeout"); // match test expectation
          }
        }, timeoutMs);
      }

      // Wrap resolve to clear timeout when lock is granted
      waiter.resolve = (releaseFn) => {
        if (timer) clearTimeout(timer);
        resolve(releaseFn);
      };
    });
  }

  _release() {
    if (this.queue.length > 0) {
      const next = this.queue.shift();
      next.resolve(this._release.bind(this));
    } else {
      this.locked = false;
    }
  }
}

module.exports = TimedMutex;
