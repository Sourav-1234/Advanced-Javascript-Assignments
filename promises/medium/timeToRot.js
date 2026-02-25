
// Problem Description – Rotting Oranges Grid Monitor (BFS + Async)
//
// You are given a grid where:
// 2 = rotten orange, 1 = fresh orange, 0 = empty cell.
//
// Rot spreads to adjacent fresh oranges (up, down, left, right) every minute.
// Your task is to implement timeToRot(grid).
//
// Requirements:
// 1. Use BFS level-by-level traversal
// 2. Each BFS level (minute) must be processed as an async step using await
// 3. Return the minimum time required to rot all oranges, or -1 if impossible
//


async function timeToRot(grid) {
  const rows = grid.length;
  const cols = grid[0].length;

  const queue = [];
  let fresh = 0;

  // Initialize queue & count fresh oranges
  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      if (grid[r][c] === 2) queue.push([r, c]);
      if (grid[r][c] === 1) fresh++;
    }
  }

  if (fresh === 0) return 0;

  let minutes = 0;
  const directions = [[1,0],[-1,0],[0,1],[0,-1]];

  while (queue.length > 0) {
    const size = queue.length;
    let rottedThisMinute = false;

    // ✅ Async level processing (simulate "minute")
    await Promise.resolve();

    for (let i = 0; i < size; i++) {
      const [r, c] = queue.shift();

      for (const [dr, dc] of directions) {
        const nr = r + dr;
        const nc = c + dc;

        if (
          nr >= 0 && nr < rows &&
          nc >= 0 && nc < cols &&
          grid[nr][nc] === 1
        ) {
          grid[nr][nc] = 2;
          fresh--;
          queue.push([nr, nc]);
          rottedThisMinute = true;
        }
      }
    }

    if (rottedThisMinute) minutes++;
  }

  return fresh === 0 ? minutes : -1;
}


module.exports = timeToRot;
