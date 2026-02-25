// Problem Description – retryOnce(fn)
//
// You are given a function `fn` that returns a Promise.
// Your task is to return a new function that calls `fn` and retries it once
// if the first attempt rejects.
// If the second attempt also rejects, the error should be propagated.


function retryOnce(fn) {
  return function callbackWrapper(...args) {
    const cb = args.pop(); 
    let called = false;

    const attempt = (attemptsLeft) => {
      fn(...args, (err, result) => {
        if (!err || attemptsLeft === 0) {
          if (!called) {
            called = true;
            cb(err, result);
          }
        } else {
         
          attempt(attemptsLeft - 1);
        }
      });
    };

    attempt(1); 
  };
}

module.exports = retryOnce;
