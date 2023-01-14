const a = [
  ["h", 7],
  ["a.b", 1],
  ["a.c.d", 5],
  ["a.c.e", 6],
  ["a.f", 2],
  ["i.0.name", "test"],
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
    if (!Number.isNaN(parseInt(keys[i + 1]))) {
      obj[key] = obj[key] || [];
    }
    return obj[key] = obj[key] || {};
  }, acc);
  lastObj[lastKey] = value;
  return acc;
}, {});
console.log(o);