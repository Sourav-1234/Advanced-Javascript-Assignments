// Problem Description – Async Cache with Time-to-Live (TTL)

// You are required to create an asynchronous cache utility that exposes a get(key, fetcher) method. 
// If the requested key already exists in the cache, the cached value should be returned immediately. 
// If the key does not exist, the fetcher function should be executed to retrieve the value, 
// store it in the cache, and automatically remove the entry after a fixed Time-to-Live (TTL) of 5 seconds.
class AsyncCache {
  /**
   * @param {number} ttl - Time-to-Live in milliseconds
   */
  constructor(ttl = 5000) {
    this.ttl = ttl;
    this.cache = new Map(); // Map<key, { value, timeoutId }>
  }

  /**
   * Get a cached value or fetch it if missing/expired
   * @param {string} key
   * @param {Function} fetcher - async function that returns the value
   * @returns {Promise<any>}
   */
  async get(key, fetcher) {
    // If already cached, return the value immediately
    if (this.cache.has(key)) {
      return this.cache.get(key).value;
    }

    try {
      // Fetch the value
      const value = await fetcher();

      // Set a TTL to auto-remove from cache
      const timeoutId = setTimeout(() => {
        this.cache.delete(key);
      }, this.ttl);

      // Store in cache
      this.cache.set(key, { value, timeoutId });

      return value;
    } catch (err) {
      // Do not cache failed fetches
      throw err;
    }
  }
}

module.exports = AsyncCache;
