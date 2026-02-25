
// Problem Description – Stale-While-Revalidate Flight Tracker
//
// You are required to implement createSWRManager(fetcherFn, ttl).
//
// The manager should return cached data immediately for fast responses,
// but refresh stale data in the background.
//
// Requirements:
// 1. If cached value exists, return it immediately
// 2. If cache age exceeds ttl, trigger a background refresh
// 3. If refresh fails, keep stale cached data (do not crash)
// 4. If multiple calls happen during refresh, deduplicate and share one refresh promise
//

function createSWRManager(fetcherFn, ttl) {
  const cache = new Map();

  async function refresh(key, entry) {
    if (entry.refreshPromise) return entry.refreshPromise;

    entry.refreshPromise = (async () => {
      try {
        const data = await fetcherFn(key);
        cache.set(key, {
          value: data,
          timestamp: Date.now(),
          refreshPromise: null
        });
      } catch (err) {
        // Keep stale data, swallow errors
        entry.refreshPromise = null;
      }
    })();

    return entry.refreshPromise;
  }

  return {
    async get(key) {
      const now = Date.now();
      const entry = cache.get(key);

      // No cache → fetch immediately
      if (!entry) {
        const data = await fetcherFn(key);
        cache.set(key, {
          value: data,
          timestamp: now,
          refreshPromise: null
        });
        return data;
      }

      const age = now - entry.timestamp;

      // Stale → trigger background refresh
      if (age > ttl) {
        refresh(key, entry);
      }

      // Always return cached value immediately
      return entry.value;
    }
  };
}


module.exports = createSWRManager;
