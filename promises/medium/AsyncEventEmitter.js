
// Problem Description – Async Observer Event Emitter
//
// You are required to implement an AsyncEventEmitter that supports async listeners.
//
// The emitter must provide:
// 1. on(event, listener): register an async listener for an event
// 2. emit(event, data): trigger all listeners for that event
//
// The emit() method must return a Promise that resolves only after all listeners
// have finished execution (use Promise.allSettled).


class AsyncEventEmitter {
<<<<<<< HEAD
  constructor() {
    this.listeners = new Map(); // event → [listeners]
  }

  on(event, listener) {
    if (!this.listeners.has(event)) {
      this.listeners.set(event, []);
    }

    this.listeners.get(event).push(listener);
  }

  async emit(event, data) {
    const handlers = this.listeners.get(event);

    if (!handlers || handlers.length === 0) {
      return [];
    }

    const executions = handlers.map(listener =>
      Promise.resolve().then(() => listener(data))
    );

    return Promise.allSettled(executions);
  }
}

module.exports = AsyncEventEmitter;

=======
  constructor() { }
}

module.exports = AsyncEventEmitter;
>>>>>>> 503324ff797fa1fc9e35ec3d9a6fd4f67a90c954
