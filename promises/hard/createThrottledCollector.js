
// Problem Description – Sliding Window Rate Limited Collector
//
// You are required to implement createThrottledCollector(batchFn, batchSize, msLimit).
//
// The collector receives high-frequency data and processes it in batches.
//
// Requirements:
// 1. Collect incoming items into batches of size batchSize
// 2. Process each batch using batchFn(batch)
// 3. Enforce rate limiting: no more than 2 batches per second (msLimit based)
// 4. add(item) must return a Promise that resolves with the result of the batch
//    that item was processed in
//

<<<<<<< HEAD
function createThrottledCollector(batchFn, batchSize, msLimit) {
  const queue = [];
  let processing = false;
  let lastBatchTime = 0;

  function schedule() {
    if (processing || queue.length < batchSize) return;

    const now = Date.now();
    const waitTime = Math.max(0, msLimit - (now - lastBatchTime));

    processing = true;

    setTimeout(async () => {
      const batchEntries = queue.splice(0, batchSize);
      const batchItems = batchEntries.map(e => e.item);

      try {
        const result = await batchFn(batchItems);

        batchEntries.forEach(e => e.resolve(result));
      } catch (err) {
        batchEntries.forEach(e => e.reject(err));
      }

      lastBatchTime = Date.now();
      processing = false;

      // Try processing next batch if available
      schedule();
    }, waitTime);
  }

  return {
    add(item) {
      return new Promise((resolve, reject) => {
        queue.push({ item, resolve, reject });
        schedule();
      });
    }
  };
}
=======
function createThrottledCollector(batchFn, batchSize, msLimit) { }
>>>>>>> 503324ff797fa1fc9e35ec3d9a6fd4f67a90c954

module.exports = createThrottledCollector;
