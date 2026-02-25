
// Problem Description – Deep Clone with Circular References
//
// You are required to implement deepClone(obj).
//
// Standard JSON cloning fails for circular references and complex objects.
// Your clone must correctly handle circular dependencies (e.g. obj.self = obj).
//
// Requirements:
// 1. Deeply clone objects and arrays
// 2. Preserve nested structures
// 3. Detect and handle circular references using a WeakMap
//
function deepClone(value, map = new WeakMap()) {
  // Handle primitives & functions
  if (value === null || typeof value !== "object") {
    return value;
  }

  // Handle circular references
  if (map.has(value)) {
    return map.get(value);
  }

  // Handle arrays
  if (Array.isArray(value)) {
    const arrClone = [];
    map.set(value, arrClone);

    for (let item of value) {
      arrClone.push(deepClone(item, map));
    }

    return arrClone;
  }

  // Handle objects
  const objClone = {};
  map.set(value, objClone);

  for (let key of Object.keys(value)) {
    objClone[key] = deepClone(value[key], map);
  }

  return objClone;
}

module.exports = deepClone;
