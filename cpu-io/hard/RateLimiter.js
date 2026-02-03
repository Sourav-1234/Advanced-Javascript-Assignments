// Problem Description – Rate Limiter (Token Bucket / Sliding Window)
//
// You are required to implement a `RateLimiter` class that restricts the
// number of executions of a given task within a specific time window.
//
// The limiter should ensure that no more than `limit` tasks are executed
// in any given `windowMs` period.
//
// Requirements:
// 1. The constructor should accept `limit` (max tasks) and `windowMs` (time window).
// 2. The `throttle(task)` method should return a Promise that resolves when the task
//    can be executed.
// 3. If the limit is reached, subsequent tasks must wait until the window allows
//    another execution.
// 4. Tasks should be executed in the order they were submitted (FIFO).
//
// This is a common pattern for API rate limiting and resource management.

class RateLimiter {
  /**
   * @param {number} limit - Max tasks per window
   * @param {number} windowMs - Time window in milliseconds
   */
  constructor(limit, windowMs) {
    this.limit = limit;
    this.windowMs = windowMs;
    this.queue = [];      // Queue of pending tasks
    this.timestamps = []; // Timestamps of executed tasks
    this.running = false; // Is the queue being processed
  }

  /**
   * Enqueue a task and execute when allowed
   * @param {Function} task - Async function to execute
   * @returns {Promise} - Resolves with task result
   */
  async throttle(task) {
    return new Promise((resolve, reject) => {
      this.queue.push({ task, resolve, reject });
      this._run();
    });
  }

  /**
   * Internal method to process the queue
   */
  _run() {
    if (this.running) return;
    this.running = true;

    const processNext = () => {
      const now = Date.now();

      // Remove timestamps outside the current window
      while (this.timestamps.length && now - this.timestamps[0] >= this.windowMs) {
        this.timestamps.shift();
      }

      // Execute tasks while under the limit
      while (this.queue.length && this.timestamps.length < this.limit) {
        const { task, resolve, reject } = this.queue.shift();
        this.timestamps.push(Date.now());

        Promise.resolve()
          .then(task)
          .then(resolve)
          .catch(reject);
      }

      // If tasks remain, schedule next check
      if (this.queue.length) {
        const waitTime =
          this.timestamps.length < this.limit
            ? 0
            : this.windowMs - (now - this.timestamps[0]);
        setTimeout(processNext, waitTime);
      } else {
        this.running = false;
      }
    };

    processNext();
  }
}

module.exports = RateLimiter;
