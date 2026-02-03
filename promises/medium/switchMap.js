// Problem Description – switchMap(apiCall)

// You are required to implement a utility function named switchMap to handle rapidly triggered asynchronous requests, such as those from a search input.
// When multiple calls are made in quick succession, only the result of the most recent call should be used. 
// If an earlier request resolves after a later one, its result must be ignored

function switchMap(apiCall) {
  let latestCallId = 0; 

  return function (...args) {
    const callId = ++latestCallId;

    return new Promise((resolve, reject) => {
      
      Promise.resolve()
        .then(() => apiCall(...args))
        .then(result => {
         
          if (callId === latestCallId) {
            resolve(result);
          } else {
            
            resolve(undefined);
          }
        })
        .catch(error => {
          
          if (callId === latestCallId) {
            reject(error);
          } else {
            
            resolve(undefined);
          }
        });
    });
  };
}

module.exports = switchMap;
