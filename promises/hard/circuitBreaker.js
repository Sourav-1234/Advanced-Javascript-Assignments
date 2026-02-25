
// Problem Description – Circuit Breaker Promise Wrapper
//
// You are given an async function fn that may fail.
// Your task is to implement circuitBreaker(fn, failureThreshold, resetTimeout).
//
// The circuit breaker must track consecutive failures and manage states:
//
// 1. CLOSED: calls execute normally
// 2. OPEN: after failureThreshold failures, reject immediately without calling fn
// 3. HALF-OPEN: after resetTimeout, allow one trial call to check recovery
//
// If the trial succeeds, reset to CLOSED.
// If it fails, return to OPEN.
<<<<<<< HEAD
function circuitBreaker(fn, failureThreshold, resetTimeout) {
  let failureCount = 0;
  let state = "CLOSED";
  let lastFailureTime = null;
  let halfOpenInProgress = false;

  return async function () {
    const now = Date.now();

    // OPEN → check if we can move to HALF-OPEN
    if (state === "OPEN") {
      if (now - lastFailureTime >= resetTimeout) {
        state = "HALF_OPEN";
      } else {
        throw new Error("Circuit is OPEN");
      }
    }

    // HALF-OPEN → allow only ONE trial call
    if (state === "HALF_OPEN") {
      if (halfOpenInProgress) {
        throw new Error("Circuit is OPEN");
      }
      halfOpenInProgress = true;
    }

    try {
      const result = await fn();

      // Success → reset everything
      failureCount = 0;
      state = "CLOSED";
      halfOpenInProgress = false;

      return result;
    } catch (err) {
      failureCount++;
      lastFailureTime = now;

      if (failureCount >= failureThreshold) {
        state = "OPEN";
      }

      halfOpenInProgress = false;

      throw err;
    }
  };
}
=======
function circuitBreaker(fn, failureThreshold, resetTimeout) { }
>>>>>>> 503324ff797fa1fc9e35ec3d9a6fd4f67a90c954

module.exports = circuitBreaker;
