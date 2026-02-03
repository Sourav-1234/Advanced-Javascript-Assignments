// Problem Description – Sum of Two Promises

// You are given two Promises that each resolve to numeric values. 
// Your task is to return a new Promise that resolves to the sum of these two numbers. 
// Both Promises should be executed in parallel using Promise.all to avoid unnecessary waiting.
// sumPromises.js
async function sumPromises(p1, p2) {
  // Wait for both promises to resolve in parallel
  const [a, b] = await Promise.all([p1, p2]);
  return a + b; // Return the sum
}

module.exports = sumPromises;
