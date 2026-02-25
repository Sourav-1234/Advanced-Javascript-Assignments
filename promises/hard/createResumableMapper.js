
// Problem Description – Resumable Async Map
//
// You are given an array of async tasks and a concurrency limit.
// Your task is to implement createResumableMapper(tasks, limit).
//
// The function must return an object with:
// 1. start(): starts/resumes processing and resolves when all tasks complete
// 2. pause(): stops scheduling new tasks (running tasks may finish)
// 3. getStatus(): returns progress info (completed, pending, running)
//
// When resumed, processing must continue from where it paused
// without re-running already completed tasks.
<<<<<<< HEAD


function createResumableMapper(tasks, limit) {
  let completed = 0;
  let running = 0;
  let nextIndex = 0;
  let paused = false;

  const results = new Array(tasks.length);

  let resolveFinal;
  let finalPromise = null;

  function schedule() {
    if (paused) return;

    while (running < limit && nextIndex < tasks.length) {
      const currentIndex = nextIndex++;
      running++;

      tasks[currentIndex]()
        .then(result => {
          results[currentIndex] = result;
          completed++;
        })
        .catch(err => {
          // Fail fast (optional design choice)
          if (resolveFinal) {
            resolveFinal(Promise.reject(err));
          }
        })
        .finally(() => {
          running--;

          if (!paused) {
            schedule();
          }

          if (completed === tasks.length && running === 0) {
            resolveFinal(results);
          }
        });
    }
  }

  return {
    start() {
      paused = false;

      if (!finalPromise) {
        finalPromise = new Promise(resolve => {
          resolveFinal = resolve;
        });
      }

      schedule();
      return finalPromise;
    },

    pause() {
      paused = true;
    },

    getStatus() {
      return {
        completed,
        running,
        pending: tasks.length - completed - running,
      };
    },
  };
}
=======
function createResumableMapper(tasks, limit) { }
>>>>>>> 503324ff797fa1fc9e35ec3d9a6fd4f67a90c954

module.exports = createResumableMapper;
