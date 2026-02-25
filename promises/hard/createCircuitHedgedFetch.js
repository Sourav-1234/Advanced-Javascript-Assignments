
// Problem Description – Hedged Circuit Breaker
//
// You are required to implement circuitHedgedFetch(url, options).
//
// The function should perform a hedged request:
// start a primary fetch immediately, and if it does not respond within 200ms,
// start a backup fetch in parallel.
//
// Additionally, the function must include a circuit breaker mechanism.
// If the API fails repeatedly, the circuit breaker should open and future calls
// must fail fast without making network requests.
//
// While the circuit is OPEN, the function should immediately return a cached value
// instead of attempting the hedged network logic.
//
// This combines hedged requests with circuit breaker state management.
// State persisted outside the function call
function createCircuitHedgedFetch() {
  const FAILURE_THRESHOLD = 3;
  const RESET_TIMEOUT = 1000;     // 1 second
  const HEDGE_DELAY = 200;        // 200ms hedge

  let cbState = "CLOSED";
  let failureCount = 0;
  let lastFailureTime = null;
  let lastKnownGoodValue = null;

  return async function circuitHedgedFetch(url, options = {}) {
    const now = Date.now();

    // OPEN → fail fast + return cached value
    if (cbState === "OPEN") {
      if (now - lastFailureTime >= RESET_TIMEOUT) {
        cbState = "HALF_OPEN";  // recovery trial
      } else {
        if (lastKnownGoodValue !== null) {
          return lastKnownGoodValue;
        }
        throw new Error("Circuit is OPEN");
      }
    }

    try {
      const primaryFetch = fetch(url, options);

      // Hedge timer
      const hedgeTrigger = new Promise(resolve =>
        setTimeout(() => resolve("HEDGE"), HEDGE_DELAY)
      );

      const firstResult = await Promise.race([
        primaryFetch,
        hedgeTrigger,
      ]);

      let finalResult;

      if (firstResult === "HEDGE") {
        // Start backup request
        const backupFetch = fetch(url, options);

        finalResult = await Promise.race([
          primaryFetch,
          backupFetch,
        ]);
      } else {
        finalResult = firstResult;
      }

      // Success → reset breaker
      failureCount = 0;
      cbState = "CLOSED";

      lastKnownGoodValue = finalResult;

      return finalResult;

    } catch (err) {
      failureCount++;
      lastFailureTime = now;

      if (failureCount >= FAILURE_THRESHOLD) {
        cbState = "OPEN";
      }

      throw err;
    }
  };
}

// Create a persistent instance
const circuitHedgedFetch = createCircuitHedgedFetch();

module.exports = circuitHedgedFetch;
