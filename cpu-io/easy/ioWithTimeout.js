// Problem Description – I/O Operation With Timeout
//
// You are given an asynchronous function that represents an I/O-bound task
// (such as a network request or database call).
//
// Your task is to execute this function, but enforce a time limit.
// If the I/O operation does not complete within the specified number
// of milliseconds, the returned promise should reject with a "Timeout" error.

async function ioWithTimeout(fn, ms) {
  return new Promise((resolve, reject) => {
    // Set up the timeout
    const timeoutId = setTimeout(() => {
      reject("Timeout"); // reject with string "Timeout" as per your test
    }, ms);

    // Run the async function
    fn()
      .then((result) => {
        clearTimeout(timeoutId); // clear timeout if done
        resolve(result);
      })
      .catch((err) => {
        clearTimeout(timeoutId);
        reject(err); // propagate errors from the function
      });
  });
}

module.exports = ioWithTimeout;