// Problem Description – Time-Sliced Task Scheduler
//
// You are required to build a scheduler that prevents long-running tasks
// from blocking the event loop.
//
// Tasks must periodically yield control back to the scheduler so that
// higher-priority or newly arrived tasks can execute.
//
// This simulates cooperative multitasking used in UI frameworks.

// Problem Description – Time-Sliced Task Scheduler
//
// You are required to build a scheduler that prevents long-running tasks
// from blocking the event loop.
//
// Tasks must periodically yield control back to the scheduler so that
// higher-priority or newly arrived tasks can execute.
//
// This simulates cooperative multitasking used in UI frameworks.

// callbacks/hard/TimeSlicedScheduler.js

class TimeSlicedScheduler {
  constructor() {
    this.tasks = [];
  }

  // Schedule a task (async function)
  schedule(task) {
    this.tasks.push(task);
  }

  // Run all tasks sequentially, yielding to the event loop between tasks
  async run() {
    for (const task of this.tasks) {
      // Await the task (handles async tasks)
      await task();

      // Yield control to event loop to prevent blocking
      await new Promise(resolve => setTimeout(resolve, 0));
    }
  }
}

module.exports = TimeSlicedScheduler;
