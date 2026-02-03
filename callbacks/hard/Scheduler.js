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
    this.queue = []; 
    this.running = false;
  }

  
  schedule(task, priority = 0) {
    this.queue.push({ task, priority });
   
    this.queue.sort((a, b) => b.priority - a.priority);
  }

  
  run(onAllFinished) {
    if (this.running) return; 
    this.running = true;

    const processNext = () => {
      if (this.queue.length === 0) {
        this.running = false;
        return onAllFinished && onAllFinished(null);
      }

      const { task } = this.queue.shift();

    
      try {
        task((err) => {
          if (err) {
           
            console.error("Task error:", err);
          }
          
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
