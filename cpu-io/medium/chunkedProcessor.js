// Problem Description – Smart Progress Bar (CPU Yielding)
//
// You need to process a large list of items without blocking
// the event loop.
//
// Process the items in small chunks and yield control back
// to the event loop after each chunk so the system stays responsive.
//
// Requirements:
// - Implement chunkedProcessor(items, processFn, onComplete).
// - Process items in fixed-size chunks.
// - Yield using setImmediate after each chunk.
// - Call onComplete after all items are processed.
function chunkedProcessor(items, processFn, onComplete, chunkSize = 100) {
  let index = 0;

  function processChunk() {
    const end = Math.min(index + chunkSize, items.length);

    // Process current chunk
    for (; index < end; index++) {
      processFn(items[index], index);
    }

    if (index < items.length) {
      // Yield back to event loop
      setImmediate(processChunk);
    } else {
      // All items processed
      if (typeof onComplete === "function") onComplete();
    }
  }

  // Start processing
  processChunk();
}

module.exports = chunkedProcessor;
