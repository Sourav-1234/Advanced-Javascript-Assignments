
// Problem Description – Cancellable Dependency Graph (Abort Signal)
//
// You are given a DAG of async tasks where tasks may depend on other tasks.
// Your task is to implement runAbortableGraph(tasks, signal).
//
// Tasks should run with maximum possible concurrency while respecting dependencies.
//
// Requirements:
// 1. Start tasks as soon as their dependencies are resolved
// 2. Support cancellation using an AbortSignal
// 3. If aborted, stop scheduling new tasks immediately
// 4. Any downstream tasks not yet started must never run and should reject immediately
// 5. The function should reject with an AbortError when cancelled


async function runAbortableGraph(tasks, signal) {
  return new Promise((resolve, reject) => {
    const results = {};
    const state = {}; // pending | running | done
    const remainingDeps = {};
    const dependents = {};

    const abortError = new Error("AbortError");

    // Abort handling
    const onAbort = () => {
      reject(abortError);
    };

    if (signal?.aborted) return reject(abortError);
    signal?.addEventListener("abort", onAbort);

    // Build dependency graph
    for (const [taskId, task] of Object.entries(tasks)) {
      state[taskId] = "pending";
      remainingDeps[taskId] = task.deps.length;

      for (const dep of task.deps) {
        if (!dependents[dep]) dependents[dep] = [];
        dependents[dep].push(taskId);
      }
    }

    function trySchedule(taskId) {
      if (signal?.aborted) return;
      if (state[taskId] !== "pending") return;
      if (remainingDeps[taskId] !== 0) return;

      state[taskId] = "running";

      Promise.resolve()
        .then(() => tasks[taskId].fn(signal))
        .then(result => {
          if (signal?.aborted) return;

          state[taskId] = "done";
          results[taskId] = result;

          const deps = dependents[taskId] || [];
          for (const nextTask of deps) {
            remainingDeps[nextTask]--;
            trySchedule(nextTask);
          }

          checkCompletion();
        })
        .catch(err => {
          reject(err);
        });
    }

    function checkCompletion() {
      if (signal?.aborted) return;

      const allDone = Object.values(state).every(s => s === "done");
      if (allDone) resolve(results);
    }

    // Initial scheduling (max concurrency)
    for (const taskId of Object.keys(tasks)) {
      trySchedule(taskId);
    }
  });
}

module.exports = runAbortableGraph;


