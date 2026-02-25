
// Problem Description – Preemptive Priority Mutex
//
// You are required to implement a PriorityMutex that allows only one async task
// to hold a lock at a time.
//
// Each lock request includes a priority (higher is better).
// High-priority tasks should jump ahead of lower-priority tasks.
//
// To prevent starvation, tasks waiting longer than 5 seconds must gain priority
// (priority aging) and eventually move ahead in the queue.
//
// Implement a class PriorityMutex with:
// lock(task, priority): runs the task when it acquires the lock and returns a Promise.
//
// Tasks must execute one at a time, in the correct order based on aged priority.


class PriorityMutex {
  constructor() {
    this.locked = false;
    this.queue = [];
    this.AGING_THRESHOLD = 5000; // 5 seconds
  }

  _getAgedPriority(waiter) {
    const waitTime = Date.now() - waiter.enqueuedAt;

    // Priority aging boost
    const agingBonus =
      waitTime > this.AGING_THRESHOLD
        ? Math.floor(waitTime / this.AGING_THRESHOLD) + 1
        : 0;

    return waiter.basePriority + agingBonus;
  }

  async lock(task, basePriority) {
    return new Promise((resolve, reject) => {
      const waiter = {
        task,
        basePriority,
        enqueuedAt: Date.now(),
        resolve,
        reject
      };

      this.queue.push(waiter);
      this._next();
    });
  }

  async _execute(task, resolve, reject) {
    try {
      const result = await task();
      resolve(result);
    } catch (err) {
      reject(err);
    } finally {
      this.locked = false;
      this._next();
    }
  }

  _next() {
    if (this.locked || this.queue.length === 0) return;

    // Select highest aged priority
    let bestIndex = 0;
    let bestPriority = this._getAgedPriority(this.queue[0]);

    for (let i = 1; i < this.queue.length; i++) {
      const agedPriority = this._getAgedPriority(this.queue[i]);

      if (agedPriority > bestPriority) {
        bestPriority = agedPriority;
        bestIndex = i;
      }
    }

    const [nextWaiter] = this.queue.splice(bestIndex, 1);

    this.locked = true;
    this._execute(
      nextWaiter.task,
      nextWaiter.resolve,
      nextWaiter.reject
    );
  }
}

module.exports = PriorityMutex;
