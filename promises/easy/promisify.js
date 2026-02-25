function promisify(fn) {
  return function (...args) {
    return new Promise((resolve, reject) => {

      function callback(err, result) {
        if (err) {
          reject(err);
        } else {
          resolve(result);
        }
      }

      try {
        fn(...args, callback);
      } catch (error) {
        reject(error);
      }
    });
  };
}

module.exports = promisify;