
// // Problem Description – Promise Timeout (Race Against Time)
// //
// // You are given a promise and a timeout duration in milliseconds.
// // Your task is to implement withTimeout(promise, ms).
// //
// // The returned promise should:
// // 1. Resolve/reject if the original promise settles within ms
// // 2. Reject with "Request Timed Out" if it takes longer than ms

<<<<<<< HEAD

function withTimeoutPromise(promise, ms) {
  const timeoutPromise = new Promise((_, reject) => {
    setTimeout(() => {
      reject(new Error("Request Timed Out")); // ✅ FIXED
    }, ms);
  });

  return Promise.race([promise, timeoutPromise]);
=======
function withTimeoutPromise(promise, ms) {

>>>>>>> 503324ff797fa1fc9e35ec3d9a6fd4f67a90c954
}

module.exports = withTimeoutPromise;