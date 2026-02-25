
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
  let cbState = "CLOSED";
  let failureCount = 0;
<<<<<<< HEAD
=======
  let lastFailureTime = null;
>>>>>>> 503324ff797fa1fc9e35ec3d9a6fd4f67a90c954
  let lastKnownGoodValue = null;

  return async function circuitHedgedFetch(url, options = {}) {

<<<<<<< HEAD
   
    if (cbState === "OPEN") {
      return lastKnownGoodValue;
    }

    const attemptFetch = () =>
      fetch(url, options).then(res => {
        if (!res.ok) throw new Error("Request failed");
        return res.json();
      });

    try {
      const primary = attemptFetch();

      const backup = new Promise((resolve, reject) => {
        setTimeout(() => {
          attemptFetch().then(resolve).catch(reject);
        }, 200);
      });

     
      const result = await Promise.any([primary, backup]);

     
      failureCount = 0;
      cbState = "CLOSED";
      lastKnownGoodValue = result;

      return result;

    } catch (error) {
      failureCount++;

     
      if (failureCount >= 3) {
        cbState = "OPEN";
      }

      throw error;
    }
  };
}

const circuitHedgedFetch = createCircuitHedgedFetch();
=======
  };
}

>>>>>>> 503324ff797fa1fc9e35ec3d9a6fd4f67a90c954

module.exports = circuitHedgedFetch;