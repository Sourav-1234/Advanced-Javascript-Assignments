// Problem Description – rejectAfter(ms)

// You are required to create a function named rejectAfter that accepts a time duration in milliseconds. 
// The function should return a Promise that waits for the specified time and then rejects.

function rejectAfter(ms, callback) {
  const promise = new Promise((_, reject) => {
    setTimeout(() => {
      const err = new Error(`Rejected after ${ms}ms`);
      reject(err);
    }, ms);
  });

  // Support optional Node-style callback
  if (typeof callback === "function") {
    promise
      .then((res) => callback(null, res))
      .catch((err) => callback(err, null));
  }

  return promise;
}

module.exports = rejectAfter;
