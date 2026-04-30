let nombres = ["Ana", "Luis"];
nombres.forEach(n => console.log("Hola " + n));

let nums = [1, 2, 3];
nums.forEach(n => console.log("Doble:", n * 2));

let personas = [
  {nombre: "Ana", edad: 20},
  {nombre: "Luis", edad: 25}
];

personas.forEach(p => console.log(p.nombre + " tiene " + p.edad));