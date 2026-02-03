// Problem Description – Dependency-Aware Task Scheduler
//
// You are required to write an async function that executes a set of tasks.
// Each task has a unique id, an async action, and a list of dependency task IDs.
//
// A task can only execute after all of its dependencies have completed.
// Tasks with no dependencies should start immediately and may run in parallel.
//
// The function must:
// 1. Execute tasks as soon as their dependencies are resolved
// 2. Detect circular dependencies and throw an error
// 3. Throw an error if a task depends on a missing task
//
// The function should return a map of taskId → result.



async function runTaskGraph(tasks) {
  if (!Array.isArray(tasks)) {
    throw new TypeError("tasks must be an array");
  }

  
  const taskMap = new Map();
  for (const task of tasks) {
    if (!task.id || typeof task.action !== "function") {
      throw new Error('Each task must have an id and an async "action" function');
    }
    taskMap.set(task.id, task);
  }

  for (const task of tasks) {
    for (const dep of task.dependencies || []) {
      if (!taskMap.has(dep)) {
        throw new Error(`Task "${task.id}" depends on missing task "${dep}"`);
      }
    }
  }

  const results = new Map();
  const executing = new Map(); 

  
  async function execute(taskId, path = new Set()) {
    if (results.has(taskId)) return results.get(taskId); 

    if (path.has(taskId)) {
      throw new Error(`Circular dependency detected at task "${taskId}"`);
    }

    
    if (executing.has(taskId)) return executing.get(taskId);

    path.add(taskId);

    const task = taskMap.get(taskId);
    const promise = (async () => {
      const depResults = [];
      for (const dep of task.dependencies || []) {
        depResults.push(await execute(dep, path));
      }
      const result = await task.action(...depResults);
      results.set(taskId, result);
      return result;
    })();

    executing.set(taskId, promise);

    try {
      return await promise;
    } finally {
      path.delete(taskId);
    }
  }

  
  await Promise.all(tasks.map(t => execute(t.id)));

  return results;
}

module.exports = runTaskGraph;

