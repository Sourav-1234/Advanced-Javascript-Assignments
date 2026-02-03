// Problem Description – Asynchronous Map with Concurrency Limit

// You are required to implement an asynchronous version of Array.map that processes items using an async callback function. 
// Unlike the standard map, this version should only process a limited number of items concurrently. 
// As soon as one operation finishes, the next should begin.
// The final result must preserve the original order of the input array.
async function mapAsyncLimit(array, limit, asyncFn) {
  const results = new Array(array.length);
  let nextIndex = 0;


  async function worker() {
    while (true) {
      const currentIndex = nextIndex++;
      if (currentIndex >= array.length) break;

      results[currentIndex] = await asyncFn(array[currentIndex], currentIndex, array);
    }
  }

  
  const workers = [];
  const concurrency = Math.min(limit, array.length);
  for (let i = 0; i < concurrency; i++) {
    workers.push(worker());
  }

  
  await Promise.all(workers);

  return results;
}

module.exports = mapAsyncLimit;
