
// Problem Description – Sliding Window Aggregator
//
// You are required to implement createWindowAggregator(batchProcessFn, size, windowMs).
//
// The aggregator collects items into a batch and processes them together.
//
// It must provide add(item):
// 1. Add item to the current batch
// 2. If batch size reaches size, immediately call batchProcessFn(batch)
// 3. If windowMs expires before reaching size, call batchProcessFn with the partial batch
// 4. After processing, reset the batch and start a new window

function createWindowAggregatorPromise(batchProcessFn, size, windowMs) {
  let batch = [];
  let timer = null;

  const flush = async () => {
    if (batch.length === 0) return;

    const currentBatch = batch;
    batch = [];

    if (timer) {
      clearTimeout(timer);
      timer = null;
    }

    await batchProcessFn(currentBatch);
  };

  const startTimer = () => {
    if (timer) return;

    timer = setTimeout(() => {
      flush();
    }, windowMs);
  };

  const add = (item) => {
    batch.push(item);

    // Size-based trigger (immediate flush)
    if (batch.length >= size) {
      flush();
      return;
    }

    // Time-based trigger
    startTimer();
  };

  return { add };
}

module.exports = createWindowAggregatorPromise;
