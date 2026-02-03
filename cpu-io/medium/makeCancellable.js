/**
 * Wraps a Promise so it can be cancelled via an AbortSignal
 * @param {Promise} promise - The original Promise
 * @param {AbortSignal} signal - The signal to listen for cancellation
 * @returns {Promise} - A new Promise that rejects on abort
 */
function makeCancellable(promise, signal) {
  return new Promise((resolve, reject) => {
    if (signal.aborted) {
      return reject(new Error("Aborted"));
    }

    const onAbort = () => {
      reject(new Error("Aborted"));
    };

    signal.addEventListener("abort", onAbort);

    promise
      .then(value => {
        signal.removeEventListener("abort", onAbort);
        resolve(value);
      })
      .catch(err => {
        signal.removeEventListener("abort", onAbort);
        reject(err);
      });
  });
}

module.exports = makeCancellable;
