// Problem Description – Async Semaphore (Concurrency Guard)
//
// You are required to implement an async Semaphore that controls
// access to a limited resource.
//
// The semaphore has a fixed number of permits.
// Tasks must acquire a permit before executing and release it after finishing.
//
// Requirements:
// 1. Only N tasks may run concurrently
// 2. Excess tasks must wait (not reject)
// 3. Permits must be released even if a task throws
// 4. Execution order must be fair (FIFO)
//
// This pattern is widely used in databases, connection pools,
// and file system access control.

class Semaphore {
  /**
   * @param {number} max - Maximum concurrent permits
   */
  constructor(max) {
    this.max = max;       // Maximum concurrent tasks
    this.current = 0;     // Currently running tasks
    this.queue = [];      // Waiting tasks
  }

  /**
   * Acquire a permit
   * @returns {Promise<void>}
   */
  acquire() {
    return new Promise((resolve) => {
      if (this.current < this.max) {
        this.current++;
        resolve();
      } else {
        // Queue if no permit available
        this.queue.push(resolve);
      }
    });
  }

  /**
   * Release a permit and process the next task in queue
   */
  release() {
    this.current--;
    if (this.queue.length > 0) {
      const next = this.queue.shift();
      this.current++;
      next();
    }
  }

  /**
   * Run a task within the semaphore
   * @param {Function} task - Async function to run
   * @returns {Promise<any>} - Resolves with task result
   */
  async run(task) {
    await this.acquire();
    try {
      return await task();
    } finally {
      this.release(); // Ensure permit is always released
    }
  }
}

module.exports = Semaphore;
