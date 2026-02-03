// Problem Description – Custom Implementation of Promise.all

// You are required to implement your own version of Promise.all without using the built-in method. 
// The function should accept an array of values that may include Promises or plain constants. 
// It must resolve with an array of results in the same order once all inputs resolve, or reject immediately if any input rejects.
function promiseAll(promises) {
  return new Promise((resolve, reject) => {
    
    if (!Array.isArray(promises)) {
      return reject(new TypeError("Argument must be an array"));
    }

    const results = [];
    let completed = 0;
    const total = promises.length;

   
    if (total === 0) {
      return resolve([]);
    }

    promises.forEach((item, index) => {
      Promise.resolve(item)
        .then(value => {
          results[index] = value;
          completed++;

          if (completed === total) {
            resolve(results);
          }
        })
        .catch(err => {
          
          reject(err);
        });
    });
  });
}

module.exports = promiseAll;
