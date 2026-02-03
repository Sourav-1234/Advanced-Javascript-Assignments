// Problem Description – Parallel Execution of Async Functions
//
// You are given an array of asynchronous functions. Your task is to execute
// all of them at the same time (in parallel).
//
// The function should return a promise that resolves to an array of
// resolved values in the same order as the input functions.
//
// If any of the asynchronous functions reject, the returned promise
// should immediately reject with that error.

async function runParallel(functions) {
  // Map each function to a Promise, ensuring both sync and async functions are handled
  const promises = functions.map(fn => {
    try {
      return Promise.resolve(fn()); // Wrap synchronous return values in Promise
    } catch (err) {
      return Promise.reject(err); // Handle synchronous throw
    }
  });

  // Wait for all promises to resolve, or reject if any fail
  return Promise.all(promises);
}

module.exports = runParallel;