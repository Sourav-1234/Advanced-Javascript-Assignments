function hedgedRequest(primary, secondary, timeoutMs, onComplete) {
  let finished = false;
  let primaryDone = false;
  let secondaryDone = false;
  let primaryError = null;
  let secondaryError = null;

  function done(err, result) {
    if (finished) return;
    finished = true;
    onComplete(err, result);
  }

  
  function promisifyFn(fn) {
    return new Promise((resolve, reject) => {
      fn((err, data) => {
        if (err) reject(err);
        else resolve(data);
      });
    });
  }

  // Start PRIMARY immediately
  promisifyFn(primary)
    .then(result => {
      primaryDone = true;
      done(null, result);
    })
    .catch(err => {
      primaryDone = true;
      primaryError = err;
      if (secondaryDone && secondaryError) {
        done(secondaryError);
      }
    });

  // Start SECONDARY after timeout
  setTimeout(() => {
    promisifyFn(secondary)
      .then(result => {
        secondaryDone = true;
        done(null, result);
      })
      .catch(err => {
        secondaryDone = true;
        secondaryError = err;
        if (primaryDone && primaryError) {
          done(err);
        }
      });
  }, timeoutMs);
}

module.exports = hedgedRequest;
