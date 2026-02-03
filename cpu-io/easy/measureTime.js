// Problem Description – Measure Async Execution Time
//
// Your task is to implement a function that takes an asynchronous function `fn`
// and returns the time it took to execute in milliseconds.
//
// Requirements:
// 1. The function should return the duration in ms (rounded to nearest integer or float)
// 2. The function should handle errors (if fn throws, you should still catch the time or rethrow)
// 3. Use performance.now() or Date.now() for timing.

/**
 * Measures the execution time of an async function in milliseconds.
 * Works with both synchronous and asynchronous functions.
 * @param {Function} fn - The async function to measure
 * @returns {Promise<number>} - The time taken in milliseconds
 */
async function measureTime(fn) {
  // Use performance.now() if available for higher precision
  const now =
    typeof performance !== "undefined" && performance.now
      ? () => performance.now()
      : () => Date.now();

  const start = now();

  try {
    await fn(); // Execute the async function
  } catch (err) {
    const end = now();
    console.log(`Execution time: ${end - start} ms`);
    throw err; // Rethrow the error to propagate it
  }

  const end = now();
  return end - start;
}

module.exports = measureTime;
