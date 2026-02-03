// Problem Description – sleep(ms)

// You are required to write a function named sleep that accepts a time duration in milliseconds. 
// The function should return a Promise that pauses execution for the given amount of time and then resolves.
function sleep(millis, callback) {
  const promise = new Promise((resolve) => {
    setTimeout(resolve, millis);
  });

  if (typeof callback === "function") {
    promise.then(() => callback(null));
  }

  return promise;
}

module.exports = sleep;

