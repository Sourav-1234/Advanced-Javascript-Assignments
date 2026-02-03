// Problem Description – Idempotent Async Execution
//
// You need to ensure that an asynchronous task identified by a key
// runs only once. If the same task is triggered again while it is
// still running, all callers should receive the same result.
//
// This problem tests deduplication and state synchronization.
//

function createIdempotentExecutor() {
  
  const inFlight = new Map();

  return function run(key, task) {
   
    if (inFlight.has(key)) {
      return inFlight.get(key);
    }

    const promise = (async () => {
      try {
        return await task();
      } finally {
        
        inFlight.delete(key);
      }
    })();

    inFlight.set(key, promise);
    return promise;
  };
}

module.exports = createIdempotentExecutor;