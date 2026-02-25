function createBatcher(processorFn, maxWaitMs = 0, maxBatchSize = Infinity) {
  let buffer = [];
  let pending = [];
  let timer = null;

  function flush() {
    if (buffer.length === 0) return;

    const batch = buffer;
    const waiters = pending;

    buffer = [];
    pending = [];

    if (timer) {
      clearTimeout(timer);
      timer = null;
    }

    Promise.resolve(processorFn(batch))
      .then(results => {
        waiters.forEach(({ item, resolve, reject }, index) => {
          try {
            if (Array.isArray(results)) {
              resolve(results[index]);      // positional mapping
            } else {
              resolve(results[item]);       // keyed mapping
            }
          } catch (err) {
            reject(err);
          }
        });
      })
      .catch(error => {
        waiters.forEach(({ reject }) => reject(error));
      });
  }

  return function batcher(item) {
    return new Promise((resolve, reject) => {
      buffer.push(item);
      pending.push({ item, resolve, reject });

      if (buffer.length === 1 && maxWaitMs > 0) {
        timer = setTimeout(flush, maxWaitMs);
      }

      if (buffer.length >= maxBatchSize) {
        flush();
      }
    });
  };
}

module.exports = createBatcher;