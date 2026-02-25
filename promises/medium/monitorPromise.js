
// Problem Description – Hanging Promise Detector
//
// You are given a promise, a threshold time in milliseconds, and a callback onHang.
// Your task is to implement monitorPromise(promise, onHang, thresholdMs).
//
// If the promise does not settle within thresholdMs, call onHang().
// The original promise should continue normally (do not cancel it).
// If the promise settles before thresholdMs, onHang must not be called.

<<<<<<< HEAD
function monitorPromise(promise, onHang, thresholdMs) {
  let timer;

  const hangPromise = new Promise((resolve, reject) => {
    timer = setTimeout(() => {
      onHang();
    }, thresholdMs);

    promise
      .then((value) => {
        clearTimeout(timer);
        resolve(value);
      })
      .catch((error) => {
        clearTimeout(timer);
        reject(error);
      });
  });

  return hangPromise;
}
=======
function monitorPromise(promise, onHang, thresholdMs) { }
>>>>>>> 503324ff797fa1fc9e35ec3d9a6fd4f67a90c954

module.exports = monitorPromise;
