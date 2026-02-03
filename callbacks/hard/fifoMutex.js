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

  
  lock(task, onComplete) {
    const wrappedTask = () => {
     
      try {
        task((err, result) => {
          if (onComplete) onComplete(err, result);
          this._release();
        });
      } catch (err) {
        if (onComplete) onComplete(err);
        this._release();
      }
    };

    if (!this.locked) {
      this.locked = true;
      wrappedTask(); 
    } else {
      this.queue.push(wrappedTask); 
    }
  }

  _release() {
    if (this.queue.length > 0) {
      const nextTask = this.queue.shift(); 
      nextTask();                           
    } else {
      this.locked = false;                  
    }
  }
}

module.exports = Mutex;
