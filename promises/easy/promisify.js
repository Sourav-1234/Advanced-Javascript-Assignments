<<<<<<< HEAD
function promisify(fn) {
  return function (...args) {
    return new Promise((resolve, reject) => {

      function callback(err, result) {
        if (err) {
          reject(err);
        } else {
          resolve(result);
        }
      }

      try {
        fn(...args, callback);
      } catch (error) {
        reject(error);
      }
    });
  };
=======

// // Problem Description – Promisify Utility
// //
// // You are given a legacy function that uses Node.js callback style:
// // (err, result) => { ... }.
// //
// // Your task is to implement promisify(fn) that converts it into a Promise-based function.
// //
// // The returned function must:
// // 1. Resolve with result if callback gets (null, result)
// // 2. Reject if callback gets an error

function promisify(fn) {

>>>>>>> 503324ff797fa1fc9e35ec3d9a6fd4f67a90c954
}

module.exports = promisify;