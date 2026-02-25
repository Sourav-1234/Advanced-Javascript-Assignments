
// Problem Description – Dependency-Aware Stream Merger
//
// You are required to implement streamMergeGraph(taskGraph, limit).
//
// You are given a set of file merge tasks where each task may depend on other tasks.
// Some files must be processed before others (dependency graph / DAG).
//
// Requirements:
// 1. Tasks must execute only after all dependencies are completed
// 2. Tasks should start as soon as dependencies are satisfied
// 3. Enforce a concurrency limit (max limit tasks running at once)
// 4. Use streaming-style processing to avoid high memory usage
//
async function streamMergeGraph(taskGraph, limit) {
  const results = {};
  const indegree = {};
  const dependents = {};

  // Build graph metadata
  for (const task in taskGraph) {
    indegree[task] = taskGraph[task].deps.length;

    for (const dep of taskGraph[task].deps) {
      if (!dependents[dep]) dependents[dep] = [];
      dependents[dep].push(task);
    }
  }

  const readyQueue = Object.keys(taskGraph).filter(t => indegree[t] === 0);

  let activeCount = 0;

  return new Promise((resolve, reject) => {
    function schedule() {
      // Start tasks while capacity exists
      while (activeCount < limit && readyQueue.length > 0) {
        const taskId = readyQueue.shift();
        const task = taskGraph[taskId];

        activeCount++;

        Promise.resolve()
          .then(() => task.action())
          .then(result => {
            results[taskId] = result;
            activeCount--;

            // Unlock dependents
            if (dependents[taskId]) {
              for (const next of dependents[taskId]) {
                indegree[next]--;
                if (indegree[next] === 0) {
                  readyQueue.push(next);
                }
              }
            }

            checkCompletion();
            schedule();
          })
          .catch(err => reject(err));
      }
    }

    function checkCompletion() {
      if (
        activeCount === 0 &&
        readyQueue.length === 0 &&
        Object.keys(results).length === Object.keys(taskGraph).length
      ) {
        resolve(results);
      }
    }

    schedule();
  });
}

module.exports = streamMergeGraph;
