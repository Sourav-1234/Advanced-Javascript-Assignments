// Problem Description – Deduplicated Network Request Utility

// You are required to build a utility that prevents multiple identical network requests from executing simultaneously. 
// If the same request (for example, getData('id-1')) is called multiple times at the same moment, only one network request should be triggered. 
// All callers must receive the same Promise result once the request completes.

const pendingRequests = new Map();

/**
 * Prevents duplicate network calls for the same id.
 * @param {string} id - Unique identifier for the request
 * @param {Function} apiCall - Function that returns a Promise (network call)
 * @returns {Promise} - Resolves with the result of apiCall
 */
function deduplicatedFetch(id, apiCall) {
  if (pendingRequests.has(id)) {
    return pendingRequests.get(id);
  }

  // Call the API with the ID
  const promise = apiCall(id)
    .then(result => {
      pendingRequests.delete(id); // Clean up after success
      return result;
    })
    .catch(err => {
      pendingRequests.delete(id); // Clean up after failure
      throw err;
    });

  pendingRequests.set(id, promise);
  return promise;
}

module.exports = deduplicatedFetch;