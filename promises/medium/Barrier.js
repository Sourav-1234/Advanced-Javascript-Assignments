// Problem Description – Async Gate (Barrier Synchronization)
//
// You are required to implement a Barrier that blocks async execution
// until it is opened.
//
// The Barrier must provide:
// 1. wait(): returns a Promise that stays pending until the barrier is opened
// 2. open(): resolves all waiting Promises and opens the barrier
//
// If wait() is called after the barrier is already open,
// it should resolve immediately.

class Barrier {
  constructor() {
    this.isOpen = false;
    this.waiters = [];
  }

  wait() {
    if (this.isOpen) {
      return Promise.resolve();
    }

    return new Promise(resolve => {
      this.waiters.push(resolve);
    });
  }

  open() {
    if (this.isOpen) return;

    this.isOpen = true;

    for (const resolve of this.waiters) {
      resolve();
    }

    this.waiters = [];
  }
}

module.exports = Barrier;
