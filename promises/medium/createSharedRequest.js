
// Problem Description – Promise Shared Cache (Thundering Herd Prevention)
//
// You are given an async function apiCallFn.
// Your task is to implement createSharedRequest(apiCallFn).
//
// The first call should trigger apiCallFn.
// If called again while the request is still pending, return the same promise.
// Once it resolves or rejects, the next call should start a new request.

function createSharedRequest(apiCallFn) {
  let inFlightPromise = null;

  return function sharedRequest(...args) {
    if (!inFlightPromise) {
      inFlightPromise = Promise.resolve(apiCallFn(...args))
        .finally(() => {
          // Reset after resolve OR reject
          inFlightPromise = null;
        });
    }

    return inFlightPromise;
  };
}


module.exports = createSharedRequest;
