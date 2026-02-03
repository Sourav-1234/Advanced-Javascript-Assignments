// Problem Description – Concurrent Cache with Deduplication and TTL
//
// You are required to implement a cache for async data fetching.
//
// The cache must:
// 1. Deduplicate concurrent requests for the same key
// 2. Cache resolved values with a time-to-live (TTL)
// 3. Return cached values if they are still valid
//
// If a cached value is close to expiry, return the current value
// but trigger a background refresh for future requests.
class Cache {
  constructor(ttl = 5000) {
    this.ttl = ttl;
    this.cache = new Map();        
    this.inFlight = new Map();     
    this.refreshThreshold = ttl * 0.2; 
  }

  get(key, fetcher) {
    const now = Date.now();
    const cached = this.cache.get(key);

   
    if (cached && cached.expiry > now) {
      
      if (cached.expiry - now <= this.refreshThreshold) {
        this._backgroundRefresh(key, fetcher);
      }
      return Promise.resolve(cached.value);
    }

   
    if (this.inFlight.has(key)) {
      return this.inFlight.get(key);
    }

    const promise = Promise.resolve()
      .then(fetcher)
      .then(value => {
        this.cache.set(key, {
          value,
          expiry: Date.now() + this.ttl
        });
        this.inFlight.delete(key);
        return value;
      })
      .catch(err => {
        this.inFlight.delete(key);
        throw err;
      });

    this.inFlight.set(key, promise);
    return promise;
  }

  _backgroundRefresh(key, fetcher) {
    if (this.inFlight.has(key)) return;

    const refreshPromise = Promise.resolve()
      .then(fetcher)
      .then(value => {
        this.cache.set(key, {
          value,
          expiry: Date.now() + this.ttl
        });
        this.inFlight.delete(key);
      })
      .catch(() => {
       
        this.inFlight.delete(key);
      });

    this.inFlight.set(key, refreshPromise);
  }
}

module.exports = Cache;
