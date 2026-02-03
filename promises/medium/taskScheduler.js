// Problem Description – Concurrency-Limited Task Executor

// You are given an array of asynchronous tasks and a number maxConcurrent. 
// Your task is to execute the tasks while ensuring that no more than maxConcurrent tasks run at the same time. 
// As soon as one task completes, the next pending task should start. 
// The final output must preserve the original task order.

async function taskScheduler(tasks, maxConcurrent) {
  const results = new Array(tasks.length);
  let currentIndex = 0;
  let rejectMain;
  let resolved = false;

  const mainPromise = new Promise((resolve, reject) => {
    rejectMain = reject;

    async function worker() {
      while (true) {
        let taskIndex;

        // Get next task atomically
        if (currentIndex >= tasks.length) return;
        taskIndex = currentIndex++;
        
        try {
          results[taskIndex] = await tasks[taskIndex]();
        } catch (err) {
          // Reject immediately on first failure
          if (!resolved) {
            resolved = true;
            reject(err);
          }
          return;
        }
      }
    }

    const workerCount = Math.min(maxConcurrent, tasks.length);
    const workers = Array.from({ length: workerCount }, () => worker());
    
    Promise.all(workers).then(() => {
      if (!resolved) {
        resolved = true;
        mainPromiseResolve(resolve, results);
      }
    }).catch(err => {
      if (!resolved) {
        resolved = true;
        reject(err);
      }
    });

    function mainPromiseResolve(resolveFn, value) {
      // Ensure we only resolve once
      resolveFn(value);
    }
  });

  return mainPromise;
}

module.exports = taskScheduler;
