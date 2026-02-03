// Problem Description – Leaky Bucket Rate Limiter
//
// You are required to implement a RateLimiter based on the Leaky Bucket algorithm.
//
// The rate limiter has a fixed capacity and processes tasks at a constant rate.
// Tasks are executed in the exact order they are received.
//
// Requirements:
// 1. The bucket has a maximum capacity
// 2. Tasks are processed at a fixed interval (leak rate)
// 3. If the bucket is full, new tasks must be rejected immediately
// 4. Fairness must be preserved (FIFO execution)

// callbacks/hard/LeakyBucket.js

// callbacks/hard/LeakyBucket.js

// callbacks/hard/LeakyBucket.js

class LeakyBucket {
  constructor(capacity, leakRateMs) {
    this.capacity = capacity;       
    this.leakRateMs = leakRateMs;   
    this.queue = [];                
    this.running = 0;               
    this.timer = null;            
  }

  add(task, onComplete) {
   
    if (this.queue.length + this.running >= this.capacity) {
      if (onComplete) onComplete(new Error("Rate Limit Exceeded"));
      return;
    }

    this.queue.push({ task, onComplete });

    if (!this.timer) {
      this._process();
    }
  }

  _process() {
    if (this.queue.length === 0) {
      this.timer = null;
      return;
    }

    const { task, onComplete } = this.queue.shift();
    this.running++;

   
    try {
      task((err, result) => {
        this.running--;
        if (onComplete) onComplete(err, result);
      });
    } catch (err) {
      this.running--;
      if (onComplete) onComplete(err);
    }

   
    this.timer = setTimeout(() => this._process(), this.leakRateMs);
  }
}

module.exports = LeakyBucket;
