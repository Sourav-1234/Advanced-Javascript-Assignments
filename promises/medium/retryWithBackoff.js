// Problem Description – retryWithBackoff(fn, retries, delay)

// You are required to write a function named retryWithBackoff that attempts to execute an asynchronous function fn. 
// If the execution fails, the function should wait for a specified delay in milliseconds before retrying. 
// This retry process should continue until the function succeeds or the maximum number of retries is reached.
async function retryWithBackoff(fn, retries = 3, delay = 1000) {
  let lastError;

  for (let attempt = 0; attempt <= retries; attempt++) {
    try {
      
      return await fn();
    } catch (err) {
      lastError = err;

      
      if (attempt === retries) {
        throw lastError;
      }

      
      await new Promise(resolve => setTimeout(resolve, delay));
    }
  }
}

module.exports = retryWithBackoff;
