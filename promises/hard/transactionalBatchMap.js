
// Problem Description – Resilient Snapshot Parallel Batcher
//
// You are given a list of items to process in batches with a concurrency limit.
// Your task is to implement transactionalBatchMap(items, limit, uploadFn, deleteFn).
//
// The function should upload items with at most limit concurrent uploads.
//
// Requirements:
// 1. Upload items in parallel with concurrency limit
// 2. If any upload fails, stop scheduling new uploads
// 3. Abort/stop the current batch as soon as possible
// 4. Rollback by calling deleteFn on all successfully uploaded items
// 5. Resolve only if all uploads succeed, otherwise reject after cleanup

<<<<<<< HEAD

async function transactionalBatchMap(items, limit, uploadFn, deleteFn) {
  const results = new Array(items.length);
  const uploadedItems = [];

  let index = 0;
  let activeCount = 0;
  let aborted = false;

  return new Promise((resolve, reject) => {

    function schedule() {
      if (aborted) return;

      while (activeCount < limit && index < items.length && !aborted) {
        const currentIndex = index++;
        const item = items[currentIndex];

        activeCount++;

        // ✅ TRACK IMMEDIATELY (CRITICAL FIX)
        uploadedItems.push(item);

        Promise.resolve()
          .then(() => uploadFn(item))
          .then(result => {
            if (aborted) return;

            results[currentIndex] = result;

            activeCount--;
            checkCompletion();
            schedule();
          })
          .catch(async (err) => {
            if (aborted) return;

            aborted = true;

            try {
              await Promise.all(
                uploadedItems.map(item => deleteFn(item))
              );
            } catch (cleanupErr) {
              return reject(cleanupErr);
            }

            reject(err);
          });
      }
    }

    function checkCompletion() {
      if (!aborted && activeCount === 0 && index >= items.length) {
        resolve(results);
      }
    }

    schedule();
  });
}

module.exports = transactionalBatchMap;
=======
async function transactionalBatchMap(items, limit, uploadFn, deleteFn) { }

module.exports = transactionalBatchMap;
>>>>>>> 503324ff797fa1fc9e35ec3d9a6fd4f67a90c954
