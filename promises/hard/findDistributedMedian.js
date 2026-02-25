
// Problem Description – Distributed Median Finder (Binary Search + Promises)
//
// You are required to find the median of two sorted arrays stored on remote servers.
// Accessing elements requires asynchronous API calls.
//
// Requirements:
// 1. Compute the median using binary search logic
// 2. Minimize network calls (avoid fetching full arrays)
// 3. Use Promise-based parallel requests when possible, with controlled execution
//

async function findDistributedMedian(serverA, serverB) {
  const [lenA, lenB] = await Promise.all([
    serverA.length(),
    serverB.length()
  ]);

  const cacheA = new Map();
  const cacheB = new Map();

  const getA = async (i) => {
    if (i < 0) return -Infinity;
    if (i >= lenA) return Infinity;
    if (!cacheA.has(i)) cacheA.set(i, serverA.get(i));
    return cacheA.get(i);
  };

  const getB = async (i) => {
    if (i < 0) return -Infinity;
    if (i >= lenB) return Infinity;
    if (!cacheB.has(i)) cacheB.set(i, serverB.get(i));
    return cacheB.get(i);
  };

  async function findKth(k) {
    let indexA = 0;
    let indexB = 0;

    while (true) {

      if (indexA >= lenA) return getB(indexB + k - 1);
      if (indexB >= lenB) return getA(indexA + k - 1);

      if (k === 1) {
        const [a, b] = await Promise.all([
          getA(indexA),
          getB(indexB)
        ]);
        return Math.min(a, b);
      }

      const half = Math.floor(k / 2);

      const newIndexA = Math.min(indexA + half, lenA) - 1;
      const newIndexB = Math.min(indexB + half, lenB) - 1;

      const [pivotA, pivotB] = await Promise.all([
        getA(newIndexA),
        getB(newIndexB)
      ]);

      if (pivotA <= pivotB) {
        k -= (newIndexA - indexA + 1);
        indexA = newIndexA + 1;
      } else {
        k -= (newIndexB - indexB + 1);
        indexB = newIndexB + 1;
      }
    }
  }

  const total = lenA + lenB;

  if (total % 2 === 1) {
    return findKth(Math.floor(total / 2) + 1);
  }

  const [left, right] = await Promise.all([
    findKth(total / 2),
    findKth(total / 2 + 1)
  ]);

  return (left + right) / 2;
}

module.exports = findDistributedMedian;
