
// Problem Description – Stale-While-Revalidate Cache
//
// You are required to implement swrCache(key, fetchFn).
//
// The cache should return data immediately if available, but also refresh
// the cache in the background.
//
// Requirements:
// 1. If key exists in cache, resolve immediately with cached value
// 2. Always trigger fetchFn() to refresh and update the cache
// 3. If cache is empty, wait for fetchFn() and return its result


async function swrCache(key, fetchFn) {
  // initialize cache if not present
  if (!swrCache.cache) {
    swrCache.cache = new Map();
  }

  const cache = swrCache.cache;

 
  if (cache.has(key)) {
    const cachedValue = cache.get(key);

    // 🔥 Background revalidation (never block / never throw)
    fetchFn()
      .then(freshValue => {
        cache.set(key, freshValue);
      })
      .catch(() => {
        // swallow errors → SWR must never crash
      });

    return cachedValue;
  }

  const freshValue = await fetchFn();
  cache.set(key, freshValue);

  return freshValue;
}


module.exports = swrCache;
