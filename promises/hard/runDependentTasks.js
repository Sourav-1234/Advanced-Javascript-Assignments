
// Problem Description – Topological Task Runner (Kahn’s Algorithm)
//
// You are given a list of tasks and a dependency list where some tasks depend on others.
// Your task is to implement runDependentTasks(tasks, dependencies).
//
// Requirements:
// 1. Use Topological Sort (Kahn’s Algorithm) to resolve dependency order
// 2. Execute tasks with no remaining dependencies in parallel
// 3. Ensure no task starts before all its dependencies are completed
// 4. Throw an error if a cycle exists (invalid dependency graph)
//
<<<<<<< HEAD
async function runDependentTasks(tasks, dependencies) {
  const inDegree = {};
  const graph = {};
  const results = {};

  // Initialize
  for (const taskId of Object.keys(tasks)) {
    inDegree[taskId] = 0;
    graph[taskId] = [];
  }

  // Build graph
  for (const [task, dep] of dependencies) {
    graph[dep].push(task);
    inDegree[task]++;
  }

  // Queue of ready tasks
  const queue = [];

  for (const taskId of Object.keys(inDegree)) {
    if (inDegree[taskId] === 0) {
      queue.push(taskId);
    }
  }

  let processedCount = 0;

  while (queue.length > 0) {
    // Run all currently ready tasks in parallel
    const batch = [...queue];
    queue.length = 0;

    const batchResults = await Promise.all(
      batch.map(taskId => Promise.resolve(tasks[taskId]()))
    );

    for (let i = 0; i < batch.length; i++) {
      const taskId = batch[i];
      results[taskId] = batchResults[i];
      processedCount++;

      for (const neighbor of graph[taskId]) {
        inDegree[neighbor]--;

        if (inDegree[neighbor] === 0) {
          queue.push(neighbor);
        }
      }
    }
  }

  // Cycle detection
  if (processedCount !== Object.keys(tasks).length) {
    throw new Error("Cycle detected in dependencies");
  }

  return results;
}
=======
async function runDependentTasks(tasks, dependencies) { }
>>>>>>> 503324ff797fa1fc9e35ec3d9a6fd4f67a90c954

module.exports = runDependentTasks;
