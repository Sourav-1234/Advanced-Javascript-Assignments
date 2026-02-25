
// Problem Description – Dependency Resolver (Simple DAG)
//
// You are given an object of tasks where each task may depend on other tasks.
// Your task is to implement resolveDependencies(tasks).
//
// Tasks without dependencies should start immediately in parallel.
// Tasks with dependencies must wait until all required parent tasks finish.
//
// Input example:
// { A: { fn }, B: { fn }, C: { fn, deps: ['A','B'] } }
<<<<<<< HEAD
async function resolveDependencies(tasks) {
  const taskPromises = {};
  const results = {};

  const runTask = (taskName) => {
    if (taskPromises[taskName]) {
      return taskPromises[taskName];
    }

    const { fn, deps = [] } = tasks[taskName];

    taskPromises[taskName] = Promise
      .all(deps.map(runTask))          // wait for dependencies
      .then(() => fn())                // then execute task
      .then(result => {
        results[taskName] = result;    // store result
        return result;
      });

    return taskPromises[taskName];
  };

  await Promise.all(Object.keys(tasks).map(runTask));

  return results;
}

module.exports = resolveDependencies;
=======
async function resolveDependencies(tasks) { }

module.exports = resolveDependencies;
``
>>>>>>> 503324ff797fa1fc9e35ec3d9a6fd4f67a90c954
