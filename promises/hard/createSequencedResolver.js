
// Problem Description – Ordered Event Emitter Bridge (Sequenced Resolver)
//
// You are required to implement createSequencedResolver() to handle out-of-order events.
//
// The resolver must support:
// 1. push(id, data): provides data for a given id
// 2. waitFor(id): returns a Promise that resolves when data for id is available
//
// Even if data arrives out of order, promises must resolve in strict order.
// Example: waitFor(2) must not resolve until id 1 has been pushed and resolved.
function createSequencedResolver() {
  let nextToResolve = 1;

  const dataStore = new Map();     // id → data
  const waiters = new Map();       // id → resolve function

  function tryResolve() {
    // Resolve in strict sequence
    while (dataStore.has(nextToResolve)) {
      const data = dataStore.get(nextToResolve);
      dataStore.delete(nextToResolve);

      if (waiters.has(nextToResolve)) {
        const resolve = waiters.get(nextToResolve);
        waiters.delete(nextToResolve);

        resolve(data);
      }

      nextToResolve++;
    }
  }

  return {
    push(id, data) {
      dataStore.set(id, data);
      tryResolve();
    },

    waitFor(id) {
      return new Promise(resolve => {
        waiters.set(id, resolve);
        tryResolve();   // In case data already exists
      });
    },
  };
}

module.exports = createSequencedResolver;
