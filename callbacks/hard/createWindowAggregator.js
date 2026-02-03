// Problem Description – Sliding Window (Moving Average) Aggregator
//
// You are receiving a stream of numeric values asynchronously
// (e.g., sensor readings).
//
// Your task is to maintain a sliding window of the last N values
// and compute the moving average whenever a new value arrives.
//
// This problem tests state management and async data handling.
//
// Requirements:
// - Maintain only the last N values (fixed-size window).
// - Accept values asynchronously via a callback-style input.
// - On each new value, compute and emit the current average.
// - Before N values are received, compute the average
//   using only the available values.
/**
 * Creates a sliding window aggregator that computes the moving average.
 * @param {number} windowSize - Maximum number of elements to consider in the window
 * @param {function} onWindowReady - Callback called with the current average after each new value
 * @returns {function} addValue - Function to add a new value to the window
 */
function createWindowAggregator(windowSize, onWindowReady) {
  const window = [];

  return function addValue(value) {
    // Add new value
    window.push(value);

    // Maintain fixed window size
    if (window.length > windowSize) {
      window.shift();
    }

    // Compute average
    const sum = window.reduce((acc, v) => acc + v, 0);
    const average = sum / window.length;

    // Emit average
    onWindowReady(average);
  };
}

module.exports = createWindowAggregator;
