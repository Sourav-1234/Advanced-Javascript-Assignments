// Problem Description – Abortable Async Pipeline
//
// You are required to implement an async pipeline that executes
// an array of async functions sequentially (waterfall execution).
//
// The pipeline must support cancellation using AbortController.
// If the abort signal is triggered:
// 1. Execution must stop immediately
// 2. Any pending async operation should be aborted
// 3. The pipeline must throw an AbortError
//
async function runPipeline(fns, signal) {
  if (!Array.isArray(fns)) {
    throw new TypeError("fns must be an array");
  }

  if (signal?.aborted) {
    throw createAbortError();
  }

  let result;

  for (const fn of fns) {
    if (signal?.aborted) {
      throw createAbortError();
    }

    // Pass signal so inner async ops (fetch, etc.) can abort
    result = await fn(result, signal);
  }

  return result;
}

function createAbortError() {
  const err = new Error("Aborted");
  err.name = "AbortError";
  return err;
}

module.exports = runPipeline;

  