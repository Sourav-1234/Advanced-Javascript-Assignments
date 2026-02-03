// Problem Description – Ordered Parallel Batcher
//
// You need to process many items in parallel, but with a fixed
// concurrency limit to avoid resource exhaustion.
//
// Tasks should start as soon as a slot is free, and the final
// results must preserve the original input order.
//
// Requirements:
// - Run at most `limit` workers in parallel.
// - Preserve the original order of results.
// - Start new work as soon as one finishes.
// - Stop and return an error if any task fails.

// callbacks/medium/batchProcess.js

function batchProcess(items, limit, worker, onComplete) {
  const results = new Array(items.length);
  let inFlight = 0;      // currently running tasks
  let index = 0;         // next item to start
  let completed = 0;     // completed tasks
  let hasError = false;  // flag if any task failed

  function next() {
    if (hasError) return;

   
    if (completed === items.length) {
      return onComplete(null, results);
    }

    while (inFlight < limit && index < items.length) {
      const currentIndex = index++;
      inFlight++;

      worker(items[currentIndex], (err, result) => {
        inFlight--;

        if (hasError) return;

        if (err) {
          hasError = true;
          return onComplete(err);
        }

        results[currentIndex] = result;
        completed++;

        next();
      });
    }
  }


  if (items.length === 0) {
    return onComplete(null, []);
  }

  next();
}

module.exports = batchProcess;
