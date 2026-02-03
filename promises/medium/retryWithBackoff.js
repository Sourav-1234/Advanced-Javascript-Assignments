// Problem Description – retryWithBackoff(fn, retries, delay)

// You are required to write a function named retryWithBackoff that attempts to execute an asynchronous function fn. 
// If the execution fails, the function should wait for a specified delay in milliseconds before retrying. 
// This retry process should continue until the function succeeds or the maximum number of retries is reached.
async function retryWithBackoff(fn, retries = 3, delay = 1000) {
  let lastError;

  for (let attempt = 0; attempt <= retries; attempt++) {
    try {
      // Attempt to execute the function
      return await fn();
    } catch (err) {
      lastError = err;

      // If max retries reached, throw the last error
      if (attempt === retries) {
        throw lastError;
      }

      // Wait for the backoff delay before retrying
      await new Promise(resolve => setTimeout(resolve, delay));
    }
  }
}

module.exports = retryWithBackoff;
