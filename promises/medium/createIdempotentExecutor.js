// Problem Description – Idempotent Async Execution
//
// You need to ensure that an asynchronous task identified by a key
// runs only once. If the same task is triggered again while it is
// still running, all callers should receive the same result.
//
// This problem tests deduplication and state synchronization.
//

function createIdempotentExecutor() {
  // Map to store currently running tasks by key
  const inFlight = new Map();

  return function run(key, task) {
    // If there is already a task running for this key, return its Promise
    if (inFlight.has(key)) {
      return inFlight.get(key);
    }

    // Run the task and store the Promise in inFlight
    const promise = (async () => {
      try {
        return await task();
      } finally {
        // Ensure cleanup after task finishes, whether it succeeds or fails
        inFlight.delete(key);
      }
    })();

    inFlight.set(key, promise);
    return promise;
  };
}

module.exports = createIdempotentExecutor;