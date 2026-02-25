// Problem Description – callbackify(fn)
//
// You are required to write a function named callbackify that takes a function
// which returns a Promise.
// The function should return a new function that accepts a callback as its
// last argument.
// When the Promise resolves, the callback should be called with `(null, data)`.
// When the Promise rejects, the callback should be called with the error.

// You are required to write a function named promisify that takes a function following the callback pattern (error, data) => void. 
// The goal is to convert this function into one that returns a Promise. 
// The Promise should resolve with the data when no error occurs and reject when an error is provided.
// Converts a promise-returning function into a callback-style function
function callbackify(fn) {
  return function (...args) {
    
    const callback = args.pop();

    
    fn(...args)
      .then((result) => callback(null, result))
      .catch((err) => callback(err));
  };
}

module.exports = callbackify;
