// Problem Description – Asynchronous Worker Pool

// You are required to create a worker pool that manages the execution of asynchronous tasks. 
// The pool should ensure that no more than N tasks are running concurrently, while any additional tasks are queued. 
// As tasks complete, queued tasks should start automatically.
// Each task must resolve with its own result.

// callbacks/medium/CallbackPool.js

class CallbackPool {
  constructor(limit) {
    this.limit = limit;      
    this.running = 0;       
    this.queue = [];        

  
  run(task, onComplete) {
    this.queue.push({ task, onComplete });
    this._next();
  }

  _next() {
    while (this.running < this.limit && this.queue.length > 0) {
      const { task, onComplete } = this.queue.shift();
      this.running++;

      
      let called = false;
      const cb = (err, result) => {
        if (called) return;
        called = true;
        if (onComplete) onComplete(err, result);
        this.running--;
        this._next();
      };

      try {
        const result = task(cb); 

        if (result && typeof result.then === "function") {
          result.then((res) => cb(null, res)).catch((err) => cb(err));
        }
      } catch (err) {
        cb(err);
      }
    }
  }
}

module.exports = CallbackPool;
