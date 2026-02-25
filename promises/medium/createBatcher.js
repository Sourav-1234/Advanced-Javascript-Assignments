
// Problem Description – Async Batch Processor (Time or Count)
//
// You are required to implement createBatcher(processorFn, maxBatchSize, maxWaitMs).
//
// The batcher should collect incoming items and process them in batches.
//
// It must return add(item):
// 1. Add items into a buffer
// 2. If buffer reaches maxBatchSize, call processorFn(batch) immediately
// 3. If maxWaitMs passes before reaching maxBatchSize, call processorFn with the partial batch
// 4. After processing, reset the buffer and timer so no items remain stuck

function createBatcher(processorFn, maxBatchSize, maxWaitMs = 0) {
  let buffer = [];
  let pending = [];
  let timer = null;

  function flush() {
    if (buffer.length === 0) return;

    const items = buffer;
    const waiters = pending;

    buffer = [];
    pending = [];

    if (timer) {
      clearTimeout(timer);
      timer = null;
    }

    Promise.resolve(processorFn(items))
      .then(() => {
        // ✅ Simply resolve all callers
        waiters.forEach(({ resolve }) => resolve());
      })
      .catch(error => {
        waiters.forEach(({ reject }) => reject(error));
      });
  }

  function add(item) {
    return new Promise((resolve, reject) => {
      buffer.push(item);
      pending.push({ resolve, reject });

      if (buffer.length === 1 && maxWaitMs > 0) {
        timer = setTimeout(flush, maxWaitMs);
      }

      if (buffer.length >= maxBatchSize) {
        flush();
      }
    });
  }

  return { add };
}

module.exports = createBatcher;