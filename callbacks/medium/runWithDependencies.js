// Problem Description – Task Execution with Dependencies

// You are given a set of asynchronous tasks where some tasks depend on the completion of others. 
// Your goal is to execute each task only after all of its dependencies have been successfully fulfilled. 
// The solution should ensure correct execution order and handle dependency relationships properly
function runWithDependencies(tasks, finalCallback) {
  const completed = new Set();
  const running = new Set();
  const results = {};
  let hasError = false;

  // Map tasks by ID for easy lookup
  const taskMap = {};
  for (const task of tasks) {
    taskMap[task.id] = task;
  }

  function canRun(task) {
    return task.deps.every(dep => completed.has(dep));
  }

  function tryRunTasks() {
    // All tasks done
    if (completed.size === tasks.length) {
      return finalCallback(null, results);
    }

    for (const task of tasks) {
      if (
        !completed.has(task.id) &&
        !running.has(task.id) &&
        canRun(task)
      ) {
        runTask(task);
      }
    }
  }

  function runTask(task) {
    running.add(task.id);

    task.run((err, result) => {
      running.delete(task.id);

      if (hasError) return;

      if (err) {
        hasError = true;
        return finalCallback(err);
      }

      completed.add(task.id);
      results[task.id] = result;

      tryRunTasks();
    });
  }

  // Edge case: no tasks
  if (tasks.length === 0) {
    return finalCallback(null, {});
  }

  tryRunTasks();
}

module.exports = runWithDependencies;
