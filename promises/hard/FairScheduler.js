// Problem Description – Fair Priority Task Scheduler (Starvation-Free)
//
// You are required to implement a task scheduler that supports priorities
// while ensuring fairness.
//
// Each task has a priority (higher number = higher priority).
// Normally, higher-priority tasks should run first.
//
// However, low-priority tasks must not starve forever.
// If a task waits too long, its effective priority should increase over time
// (priority aging).
//
// Requirements:
// 1. Higher-priority tasks should be preferred
// 2. Tasks must execute one at a time
// 3. Starvation must be prevented using priority aging
// 4. Tasks must execute asynchronously

class FairScheduler {
  constructor(agingFactor = 1) {
    this.agingFactor = agingFactor; // Amount priority increases per millisecond
    this.queue = [];
    this.running = false;
  }

  schedule(task, priority = 0) {
    this.queue.push({
      task,
      basePriority: priority,
      enqueuedAt: Date.now()
    });
  }

  async run() {
    if (this.running) return;
    this.running = true;

    while (this.queue.length > 0) {
      const now = Date.now();

      // Compute effective priority with aging
      this.queue.forEach(item => {
        const waitTime = now - item.enqueuedAt; // milliseconds
        item.effectivePriority =
          item.basePriority + waitTime * this.agingFactor;
      });

      // Sort by effective priority (descending), FIFO for ties
      this.queue.sort((a, b) => {
        const diff = b.effectivePriority - a.effectivePriority;
        if (diff === 0) return a.enqueuedAt - b.enqueuedAt;
        return diff;
      });

      const next = this.queue.shift();

      try {
        await next.task();
      } catch (err) {
        console.error("Task failed:", err);
      }
    }

    this.running = false;
  }
}

module.exports = FairScheduler;
