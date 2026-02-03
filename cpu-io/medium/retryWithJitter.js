/**
 * Retry an async function with exponential backoff and jitter
 * @param {Function} fn - Async function to execute
 * @param {number} retries - Maximum number of retries (default 3)
 * @param {number} baseDelay - Initial delay in ms (default 1000)
 * @returns {Promise<*>} - Resolves with the function result or rejects after max retries
 */
// retryWithJitter.js

async function retryWithJitter(fn, retries = 3, baseDelay = 1000) {
  for (let attempt = 0; attempt <= retries; attempt++) {
    try {
      return await fn(); // Try executing the function
    } catch (err) {
      if (attempt === retries) {
        // Max retries exhausted
        throw err;
      }

      // Exponential backoff: baseDelay * 2^attempt
      const delay = baseDelay * Math.pow(2, attempt);

      // Add jitter: random 0-20% of delay
      const jitter = Math.random() * 0.2 * delay;

      const totalDelay = delay + jitter;

      await new Promise(res => setTimeout(res, totalDelay));
    }
  }
}

module.exports = retryWithJitter;
