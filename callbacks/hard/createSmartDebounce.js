// Problem Description – Debounced Search with Result Guard
//
// You are building a search bar that should not call the API
// on every keystroke, so the request must be debounced.
//
// If an older request finishes after a newer one, its result
// must be ignored to prevent stale UI updates.
//
// Requirements:
// - Delay execution by waitMs.
// - Reset the timer on repeated calls.
// - Only the latest request may trigger the callback.

function createSmartDebounce(worker, wait) {
  let lastCallId = 0; // Tracks the latest call
  let timeout = null;

  return function(input, cb) {
    lastCallId++;
    const callId = lastCallId;

    // Clear any existing debounce timer
    if (timeout) clearTimeout(timeout);

    // Schedule worker after debounce delay
    timeout = setTimeout(() => {
      worker(input, (err, result) => {
        // Only invoke callback if this is the latest call
        if (callId === lastCallId) {
          cb(err, result);
        }
      });
    }, wait);
  };
}

module.exports = createSmartDebounce;