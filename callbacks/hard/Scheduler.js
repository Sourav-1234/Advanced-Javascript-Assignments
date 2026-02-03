// Problem Description – Preemptive Priority Task Scheduler
//
// You are required to build a scheduler that executes async tasks
// based on priority.
//
// Higher-priority tasks should be executed before lower-priority ones.
// Long-running tasks must periodically yield control back to the scheduler
// so that newly arrived high-priority tasks can be processed.
//
// True preemption is not possible in JavaScript, so tasks must cooperate
// by yielding execution voluntarily.

// callbacks/hard/Scheduler.js

class Scheduler {
  constructor() {
    this.queue = []; // Array of {task, priority}
    this.running = false;
  }

  // Schedule a task with optional priority (higher number = higher priority)
  schedule(task, priority = 0) {
    this.queue.push({ task, priority });
    // Keep queue sorted by priority (highest first)
    this.queue.sort((a, b) => b.priority - a.priority);
  }

  // Run all tasks in priority order and call onAllFinished when done
  run(onAllFinished) {
    if (this.running) return; // Prevent multiple runs
    this.running = true;

    const processNext = () => {
      if (this.queue.length === 0) {
        this.running = false;
        return onAllFinished && onAllFinished(null);
      }

      const { task } = this.queue.shift();

      // Execute task, providing a callback
      try {
        task((err) => {
          if (err) {
            // Log error but continue with next tasks
            console.error("Task error:", err);
          }
          // Yield to event loop before next task
          setTimeout(processNext, 0);
        });
      } catch (err) {
        console.error("Task threw an error:", err);
        setTimeout(processNext, 0);
      }
    };

    processNext();
  }
}

module.exports = Scheduler;
