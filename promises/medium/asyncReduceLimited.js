// Problem Description – Parallel Chunked Async Reducer

// You are required to process an array using a reducer function where the reduction happens in sequence, but the data fetching or processing for items is performed in parallel chunks. 
// Each chunk should be processed concurrently, then reduced before moving to the next chunk. 
// The final reduced result must be correct and deterministic.
async function mapAsyncLimit(array, limit, asyncFn) {
  const results = new Array(array.length);
  let nextIndex = 0;

  async function worker() {
    while (nextIndex < array.length) {
      const currentIndex = nextIndex++;
      results[currentIndex] = await asyncFn(array[currentIndex], currentIndex, array);
    }
  }

  const workers = [];
  for (let i = 0; i < Math.min(limit, array.length); i++) {
    workers.push(worker());
  }

  await Promise.all(workers);
  return results;
}

async function asyncReduceLimited(array, limit, asyncProcessFn, reducer, initialValue) {
  let accumulator = initialValue;

  for (let i = 0; i < array.length; i += limit) {
    const chunk = array.slice(i, i + limit);

    // Process chunk concurrently
    const processedChunk = await mapAsyncLimit(chunk, limit, asyncProcessFn);

    // Reduce sequentially
    for (const item of processedChunk) {
      accumulator = reducer(accumulator, item);
    }
  }

  return accumulator;
}

module.exports = asyncReduceLimited;
