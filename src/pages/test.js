const a = [
  ["h", "47"],
  ["a.0", 1],
  ["a.1", 2],
  // ["a.c.d", 5],
  // ["a.c.e", 6],
  // ["a.f", 2],
  ["i.0.name.0.f", "test"],
  ["i.0.name.1", "test2"],
  ["i.0.age", 10],
  ["i.1.name", "test2"],
  ["i.1.age", 20],
];

console.log(a);
// const newa = { a: { c: { d: 5, e: 6 } } }; console.log(newa);

let o = a.reduce((acc, [key, value]) => {
  const keys = key.split(".");
  const lastKey = keys.pop();
  const lastObj = keys.reduce((obj, key, i) => {
    // if (!Number.isNaN(parseInt(lastKey))) {
    //   return obj[key] = obj[key] || [];
    // }
    if (!Number.isNaN(parseInt(keys[i + 1]))) {
      return obj[key] = obj[key] || [];
    }
    return obj[key] = obj[key] || !Number.isNaN(parseInt(lastKey)) ? [] : {};
  }, acc);
  // }
  lastObj[lastKey] = value;
  return acc;
}, {});
console.log(o);
