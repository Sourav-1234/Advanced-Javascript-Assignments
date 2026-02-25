
// Problem Description – Non-Blocking Heavy Reducer (Chunked Async Reduce)
//
// You are given a very large array of numbers and a hash function.
// Your task is to implement chunkedAsyncReduce(data, hashFn, chunkSize).
//
// The function must process the array in chunks of size chunkSize to avoid blocking
// the event loop.
//
// Requirements:
// 1. Compute the final reduced/hash result across all elements
// 2. Break computation into chunks and yield between chunks
// 3. Return a single Promise that resolves with the final result
// 4. Use setImmediate or MessageChannel for yielding (not setTimeout)
//

async function chunkedAsyncReduce(data, hashFn, chunkSize) {
  if (!Array.isArray(data) || data.length === 0) {
    return undefined;
  }

  // Yield helper (IMPORTANT: not setTimeout)
  const yieldToEventLoop = () =>
    new Promise(resolve => setImmediate(resolve));

  let acc = data[0];
  let i = 1;

  while (i < data.length) {
    const end = Math.min(i + chunkSize, data.length);

    for (; i < end; i++) {
      acc = hashFn(acc, data[i]);
    }

    // Yield ONLY if more work remains
    if (i < data.length) {
      await yieldToEventLoop();
    }
  }

  return acc;
}

module.exports = chunkedAsyncReduce;

