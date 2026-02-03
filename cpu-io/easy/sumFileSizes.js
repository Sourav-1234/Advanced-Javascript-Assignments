// Problem Description – Sum File Sizes
//
// You are given an array of file paths. Your task is to implement a function
// that returns the total size of all these files in bytes.
//
// Requirements:
// 1. Use fs.promises.stat() to get file information.
// 2. Return the sum of `size` property of all files.
// 3. Handle cases where a file might not exist (optional: you can let it throw or return 0).
// 4. Tasks should ideally be performed in parallel for efficiency.

const fs = require("fs").promises;

async function sumFileSizes(filePaths) {
  if (!Array.isArray(filePaths)) {
    throw new TypeError("filePaths must be an array");
  }

  const sizePromises = filePaths.map(async (filePath) => {
    try {
      const stats = await fs.stat(filePath);
      return stats.size;
    } catch (err) {
      
      throw new Error(`Cannot read file: ${filePath}`);
    }
  });

  const sizes = await Promise.all(sizePromises);
  return sizes.reduce((total, size) => total + size, 0);
}

module.exports = sumFileSizes;
