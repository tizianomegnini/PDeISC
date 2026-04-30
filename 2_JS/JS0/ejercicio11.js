let nums = [5, 15, 20];
let mayores = nums.filter(n => n > 10);
console.log("Mayores a 10:", mayores);

let palabras = ["hola", "javascript", "sol"];
let largas = palabras.filter(p => p.length > 5);
console.log("Palabras largas:", largas);

let users = [
  {nombre: "Ana", activo: true},
  {nombre: "Luis", activo: false}
];

let activos = users.filter(u => u.activo);
console.log("Activos:", activos);