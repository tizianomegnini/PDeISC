let nums = [1, 2, 3];
let suma = nums.reduce((acc, n) => acc + n, 0);
console.log("Suma:", suma);

let mult = nums.reduce((acc, n) => acc * n, 1);
console.log("Multiplicación:", mult);

let productos = [
  {precio: 100},
  {precio: 200}
];

let total = productos.reduce((acc, p) => acc + p.precio, 0);
console.log("Total:", total);