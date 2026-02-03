// Problem Description – batchAll(tasks, batchSize)

// You are required to implement a function named batchAll that processes an array of asynchronous tasks in fixed-size batches. 
// Each batch should execute its tasks concurrently, but the next batch must not start until all tasks in the current batch have completed.
async function batchAll(tasks, batchSize) {
  if (!Array.isArray(tasks)) {
    throw new TypeError("tasks must be an array of functions");
  }
  if (typeof batchSize !== "number" || batchSize <= 0) {
    throw new TypeError("batchSize must be a positive number");
  }

  const results = [];

  for (let i = 0; i < tasks.length; i += batchSize) {
    const batch = tasks.slice(i, i + batchSize);

    
    const batchResults = await Promise.all(batch.map(task => task()));
    results.push(...batchResults);
  }

  return results;
}

module.exports = batchAll;
