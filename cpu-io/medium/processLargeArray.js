/**
 * Processes a large array in chunks to avoid blocking the event loop
 * @param {Array} items - The large array of items
 * @param {Function} processFn - Function to process each item (can be async)
 * @param {number} chunkSize - Number of items to process per batch (default 100)
 * @returns {Promise<void>}
 */
async function processLargeArray(items, processFn, chunkSize = 100) {
  let index = 0;

  return new Promise(resolve => {
    function processChunk() {
      const end = Math.min(index + chunkSize, items.length);

      for (; index < end; index++) {
        processFn(items[index], index);
      }

      if (index < items.length) {
        // Yield to the event loop and continue processing the next chunk
        setTimeout(processChunk, 0);
      } else {
        resolve(); // All items processed
      }
    }

    processChunk(); // Start processing
  });
}

module.exports = processLargeArray;
