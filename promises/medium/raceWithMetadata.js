
// Problem Description – Race with Winner Information
//
// You are given an object where keys are labels and values are Promises.
// Your task is to implement raceWithMetadata(promiseMap).
//
// The function should behave like Promise.race, but also return which promise won.
//
// It must resolve with an object:
// { winner: <key>, value: <resolved value> }
async function raceWithMetadata(promiseMap) {
  return new Promise((resolve, reject) => {
    for (const [key, promise] of Object.entries(promiseMap)) {
      Promise.resolve(promise)
        .then(value => resolve({ winner: key, value }))
        .catch(reject);
    }
  });
}

module.exports = raceWithMetadata;
