// Problem Description – once(fn)

// You are required to implement a wrapper function named once that accepts an asynchronous function fn.
// The wrapper should ensure that fn is executed only on the first call.
// Any subsequent calls must not re-execute fn and should instead return the same Promise or resolved result from the first invocation.


function once(fn) {
  let called = false;
  let result;
  let error;
  let pending = [];

  return function (...args) {
    const cb = args[args.length - 1]; 
    if (typeof cb !== "function") throw new Error("Callback required");

    if (called) {
     
      return setTimeout(() => cb(error, result), 0);
    }

    pending.push(cb);

    if (!called) {
      called = true;
      fn(...args.slice(0, -1), (err, res) => {
        error = err;
        result = res;
        
        pending.forEach((c) => c(err, res));
        pending = [];
      });
    }
  };
}

module.exports = once;
