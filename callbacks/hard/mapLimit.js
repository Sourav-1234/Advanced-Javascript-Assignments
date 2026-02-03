// Problem Description – Parallel Execution with Concurrency Limit
//
// You need to execute many asynchronous tasks (e.g., image downloads),
// but only a fixed number are allowed to run at the same time to avoid
// resource exhaustion.
//
// This problem tests concurrency control and result ordering.
//
// Requirements:
// - Accept an array of tasks and a concurrency limit.
// - Run at most `limit` tasks in parallel until all are completed.
// - Return results in the original task order via onAllFinished.

// callbacks/hard/mapLimit.js

function mapLimit(tasks, limit, onAllFinished) {
  const results = new Array(tasks.length);
  let inFlight = 0;
  let index = 0;
  let completed = 0;
  let hasError = false;

  function next() {
    // All tasks done
    if (completed === tasks.length) {
      return onAllFinished(null, results);
    }

    // Start tasks while under concurrency limit
    while (inFlight < limit && index < tasks.length) {
      const currentIndex = index++;
      const task = tasks[currentIndex];
      inFlight++;

      try {
        task((err, result) => {
          inFlight--;
          if (hasError) return;

          if (err) {
            hasError = true;
            return onAllFinished(err);
          }

          results[currentIndex] = result;
          completed++;
          next(); // Start next task if available
        });
      } catch (err) {
        inFlight--;
        if (!hasError) {
          hasError = true;
          return onAllFinished(err);
        }
      }
    }
  }

  // Edge case: empty tasks array
  if (tasks.length === 0) {
    return onAllFinished(null, []);
  }

  next();
}

module.exports = mapLimit;
