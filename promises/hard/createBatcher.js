// Problem Description – Request Batcher
//
// You are required to implement a batcher that groups multiple requests
// within a short time window into a single bulk request.
//
// Requirements:
// 1. Requests added within the batch window must be sent together
// 2. Each caller must receive only its own result
// 3. Only one network call should be made per batch window

function createBatcher(fetchBulk, delayMs = 50) {
  let queue = [];
  let timer = null;

  return function batchedRequest(request) {
    return new Promise((resolve, reject) => {
      // Add request to queue
      queue.push({ request, resolve, reject });

      // Start batch timer if not already started
      if (!timer) {
        timer = setTimeout(async () => {
          const batch = queue;
          queue = [];
          timer = null;

          try {
            // Collect all requests in this batch
            const requests = batch.map(item => item.request);

            // Call the bulk fetcher
            const results = await fetchBulk(requests);

            // Resolve each promise using its request key
            batch.forEach(item => {
              if (item.request in results) {
                item.resolve(results[item.request]);
              } else {
                item.reject(new Error(`No result for request: ${item.request}`));
              }
            });
          } catch (err) {
            // Reject all promises in case of error
            batch.forEach(item => item.reject(err));
          }
        }, delayMs);
      }
    });
  };
}

module.exports = createBatcher;
