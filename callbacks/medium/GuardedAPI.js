// Problem Description – Async Initialization Gate

// You are required to design a mechanism for APIs that depend on an asynchronous initialization step. 
// Any calls made before initialization completes should wait and execute only after the initialization finishes. 
// Calls made after initialization should run immediately without waiting.
class GuardedAPI {
  constructor() {
    this.initialized = false;
    this.initializing = false;
    this.queue = [];
    this.initPromise = null;
  }

  // Initialize the API, accepts a callback-style initTask(cb)
  init(initTask) {
    if (this.initialized || this.initializing) {
      return this.initPromise;
    }

    this.initializing = true;

    // Wrap initTask in a Promise
    this.initPromise = new Promise((resolve, reject) => {
      initTask((err) => {
        if (err) return reject(err);
        resolve();
      });
    })
      .then(() => {
        this.initialized = true;
        this.initializing = false;
        this._flush(); // Execute queued calls
      })
      .catch((err) => {
        this.initializing = false;
        this.queue = [];
        throw err;
      });

    return this.initPromise;
  }

  // Call an API function (callback-style)
  call(apiFn, onComplete) {
    if (this.initialized) {
      return this._execute(apiFn, onComplete);
    }

    // Queue the call if initialization is not done
    this.queue.push({ apiFn, onComplete });
  }

  // Execute a callback-style API function
  _execute(apiFn, onComplete) {
    try {
      apiFn((err, result) => {
        if (onComplete) onComplete(err, result);
      });
    } catch (err) {
      if (onComplete) onComplete(err);
    }
  }

  // Flush queued calls after initialization
  _flush() {
    while (this.queue.length > 0) {
      const { apiFn, onComplete } = this.queue.shift();
      this._execute(apiFn, onComplete);
    }
  }
}

module.exports = GuardedAPI;
