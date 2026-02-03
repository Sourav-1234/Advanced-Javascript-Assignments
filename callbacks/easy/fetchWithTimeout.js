// Problem Description – fetchWithTimeout(url, ms)

// You are required to write a function named fetchWithTimeout that accepts a URL and a time limit in milliseconds. 
// The function must return a Promise that attempts to fetch data from the given URL.
// If the request completes within the specified time, the Promise resolves with the fetched data. 
// If the operation exceeds the time limit, the Promise rejects with the message "Request Timed Out".

function fetchWithTimeout(url, ms, callback) {
  let finished = false;

  const timer = setTimeout(() => {
    if (finished) return;
    finished = true;
    callback(new Error("Request Timed Out"));
  }, ms);

  // Node-style fetch: fetch(url, cb)
  fetch(url, (err, data) => {
    if (finished) return;

    finished = true;
    clearTimeout(timer);
    callback(err, data);
  });
}

module.exports = fetchWithTimeout;
