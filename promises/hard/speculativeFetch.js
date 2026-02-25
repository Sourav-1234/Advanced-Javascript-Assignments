
// Problem Description – Speculative Cache Warm-up
//
// You are required to implement speculativeFetch(key, apiFn, diskFn).
//
// The function should fetch data using a fast API, but fall back to disk if the API is slow.
//
// Requirements:
// 1. Start apiFn immediately
// 2. If apiFn has not resolved within 200ms, start diskFn
// 3. Resolve with whichever succeeds first
// 4. Even if diskFn resolves first, apiFn must continue in background and update the cache



async function speculativeFetch(key, apiFn, diskFn) {
  if (!speculativeFetch.cache) {
    speculativeFetch.cache = new Map();
  }

  let apiSettled = false;

  const apiPromise = Promise.resolve()
    .then(() => apiFn(key))
    .then((result) => {
      apiSettled = true;

      // Background cache update (always)
      speculativeFetch.cache.set(key, result);

      return result;
    })
    .catch((err) => {
      apiSettled = true;
      throw err;
    });

  const diskFallbackPromise = new Promise((resolve, reject) => {
    setTimeout(() => {
      if (apiSettled) return;

      Promise.resolve()
        .then(() => diskFn(key))
        .then(resolve)
        .catch(reject);
    }, 200);
  });

  return Promise.race([apiPromise, diskFallbackPromise]);
}



module.exports = speculativeFetch;
