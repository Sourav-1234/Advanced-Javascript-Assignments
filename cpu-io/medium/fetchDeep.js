
// Problem Description – Recursive Fetch with Redirect Handling

// You are required to fetch data for a given set of IDs. 
// Each response may contain a redirectId, indicating that the data should be fetched again using the new ID. 
// The process must continue until the final data is reached. 
// Your implementation should also detect and prevent infinite redirect loops.

/**
 * Fetch data for a set of IDs, following redirects if necessary
 * @param {Array} ids - Array of initial IDs
 * @param {Function} fetcher - Async function that takes an ID and returns { data, redirectId? }
 * @param {number} maxDepth - Maximum number of redirects allowed to prevent infinite loops
 * @returns {Promise<Array>} - Resolves to an array of final data objects
 */
// fetchDeep.js

async function fetchDeep(ids, fetcher, maxDepth = 5) {
  
  async function fetchSingle(id, depth = 0) {
    if (depth > maxDepth) {
      throw new Error("Max redirect depth exceeded");
    }

    const result = await fetcher(id);

    if (result.redirectId) {
      return fetchSingle(result.redirectId, depth + 1);
    }

    return result;
  }

  
  const entries = await Promise.all(
    Object.entries(ids).map(async ([key, id]) => {
      const value = await fetchSingle(id, 0);
      return [key, value];
    })
  );

  return Object.fromEntries(entries);
}

module.exports = fetchDeep;
