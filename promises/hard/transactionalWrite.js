
// Problem Description – Atomic Multi-File Write (Transactional Write)
//
// You are given multiple files to write as part of one operation.
// Your task is to implement transactionalWrite(filesData).
//
// All file writes should be started in parallel.
// If any write fails, rollback by deleting any files that were successfully written.
// The promise should resolve only if all files are written successfully.
// If rollback occurs, the promise should reject with the original error.
const fs = require('fs').promises;

async function transactionalWrite(filesData) {
  const successfulWrites = [];

  try {
    await Promise.all(
      filesData.map(async ({ path, content }) => {
        await fs.writeFile(path, content);
        successfulWrites.push(path);
      })
    );
  } catch (error) {

    // ✅ Safe rollback (works with mocked fs)
    await Promise.all(
      successfulWrites.map(path =>
        Promise.resolve(fs.unlink(path)).catch(() => {})
      )
    );

    throw error; 
  }
}

module.exports = transactionalWrite;