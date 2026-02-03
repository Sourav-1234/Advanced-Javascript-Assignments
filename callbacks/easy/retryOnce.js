// Problem Description – Retry Async Function Once

// You are given an asynchronous function fn. Your task is to return a new function that calls fn and retries it once if the first attempt fails. 
// If the second attempt also fails, the error should be properly propagated. 

function retryOnce(fn) {
  return function callbackWrapper(...args) {
    const cb = args.pop(); // extract the callback

    let called = false;

    const attempt = (attemptsLeft) => {
      fn(...args, (err, result) => {
        if (!err || attemptsLeft === 0) {
          if (!called) {
            called = true;
            cb(err, result);
          }
        } else {
          // retry once
          attempt(attemptsLeft - 1);
        }
      });
    };

    attempt(1); // allow 1 retry
  };
}

module.exports = retryOnce;
