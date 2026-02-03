// Problem Description – Blocking CPU-Intensive Task
//
// You are given a function that performs a large number of calculations
// synchronously using a loop.
//
// Your task is to observe and understand how a CPU-heavy synchronous
// operation blocks the JavaScript event loop, preventing other code
// (such as timers or async callbacks) from running until it completes.





function heavyCPU(iterations) {
  console.log("Heavy CPU task started");

  let sum = 0;
  for (let i = 0; i < iterations; i++) {
    sum += i; 
  }

  console.log("Heavy CPU task finished. Result:", sum);
  return sum;
}

module.exports = heavyCPU;
