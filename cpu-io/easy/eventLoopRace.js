// Problem Description – Event Loop Execution Order
//
// You are given a script that mixes synchronous code, Promises (microtasks),
// and timers (macrotasks).
//
// Your task is to understand and predict the order in which the logs
// are printed to the console.
//


function eventLoopRace() {
  // Synchronous log
  console.log("1: Synchronous");

  // Macrotask (setTimeout)
  setTimeout(() => {
    console.log("2: Macrotask (I/O)");
  }, 0);

  // Microtask (Promise)
  Promise.resolve()
    .then(() => {
      console.log("3: Microtask (Promise)");
    });

  // Another synchronous log
  console.log("4: Synchronous");
}

module.exports = eventLoopRace;
