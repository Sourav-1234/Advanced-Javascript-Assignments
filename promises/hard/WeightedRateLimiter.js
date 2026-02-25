
// Problem Description – Sliding Window Weighted Rate Limiter
//
// You are required to implement a WeightedRateLimiter for API traffic control.
//
// Each request has a weight, and the system allows only a maximum total weight
// within a sliding time window (example: 100 points per 60 seconds).
//
// Implement request(fn, weight):
// 1. If current window usage + weight <= limit, execute fn immediately
// 2. Otherwise, queue the request (FIFO fairness)
// 3. As time passes and old weights expire from the window, queued requests
//    should automatically execute when allowed
//



class WeightedRateLimiter {
  constructor(limit, windowMs) {
    this.limit = limit;
    this.windowMs = windowMs;

    this.events = [];      // { time, weight }
    this.currentWeight = 0;

    this.queue = [];
    this.timer = null;
  }

  _prune() {
    const now = Date.now();

    while (this.events.length > 0) {
      const oldest = this.events[0];

      if (now - oldest.time >= this.windowMs) {
        this.currentWeight -= oldest.weight;
        this.events.shift();
      } else {
        break;
      }
    }
  }

  _scheduleNext() {
    if (this.timer || this.events.length === 0) return;

    const now = Date.now();
    const nextExpiry = this.windowMs - (now - this.events[0].time);

    this.timer = setTimeout(() => {
      this.timer = null;
      this._processQueue();
    }, nextExpiry);
  }

  _processQueue() {
    this._prune();

    while (this.queue.length > 0) {
      const next = this.queue[0];

      if (this.currentWeight + next.weight <= this.limit) {
        this.queue.shift();
        this._execute(next);
      } else {
        break; // FIFO fairness — do NOT skip
      }
    }

    this._scheduleNext();
  }

  async _execute({ fn, weight, resolve, reject }) {
    const now = Date.now();

    this.events.push({ time: now, weight });
    this.currentWeight += weight;

    try {
      const result = await fn();
      resolve(result);
    } catch (err) {
      reject(err);
    } finally {
      this._processQueue();
    }
  }

  request(fn, weight) {
    return new Promise((resolve, reject) => {
      const req = { fn, weight, resolve, reject };

      this._prune();

      if (this.currentWeight + weight <= this.limit) {
        this._execute(req);
      } else {
        this.queue.push(req);
        this._scheduleNext();
      }
    });
  }
}

module.exports = WeightedRateLimiter;
