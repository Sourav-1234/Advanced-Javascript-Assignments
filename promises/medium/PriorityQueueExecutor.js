
// Problem Description – Priority Task Queue
//
// You are required to implement a PriorityQueueExecutor that runs async tasks sequentially.
//
// The executor must support push(task, priority), where higher priority runs first.
// If tasks are waiting, newly added high-priority tasks should jump ahead of lower-priority ones.
class PriorityQueueExecutor {

  constructor() {
    this.queue = [];
    this.running = false;
    this.counter = 0; // preserves FIFO for same priority
  }

  push(task, priority = 0) {
    this.queue.push({
      task,
      priority,
      order: this.counter++
    });

    // Sort by priority (DESC), then FIFO
    this.queue.sort((a, b) => {
      if (b.priority !== a.priority) {
        return b.priority - a.priority;
      }
      return a.order - b.order;
    });

    if (!this.running) {
      this._run();
    }
  }

  async _run() {
    if (this.running) return;
    this.running = true;

    while (this.queue.length) {
      const { task } = this.queue.shift();
      await task(); // sequential execution
    }

    this.running = false;
  }

}

module.exports = PriorityQueueExecutor;
