// Problem Description – rejectAfter(ms, callback)
//
// You are required to create a function named rejectAfter that accepts a time
// duration in milliseconds and a callback function.
// The function should wait for the specified time and then invoke the callback
// with an error.

function rejectAfter(ms, callback) {
  const promise = new Promise((_, reject) => {
    setTimeout(() => {
      const err = new Error(`Rejected after ${ms}ms`);
      reject(err);
    }, ms);
  });

  if (typeof callback === "function") {
    promise
      .then((res) => callback(null, res))
      .catch((err) => callback(err, null));
  }

  return promise;
}

module.exports = rejectAfter;
