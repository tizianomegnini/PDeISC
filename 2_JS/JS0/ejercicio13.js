let nums = [30, 10, 20];
nums.sort((a, b) => a - b);
console.log("Ordenados:", nums);

let palabras = ["banana", "manzana", "pera"];
palabras.sort();
console.log("Palabras:", palabras);

let personas = [
  {nombre: "Ana", edad: 25},
  {nombre: "Luis", edad: 20}
];

personas.sort((a, b) => a.edad - b.edad);
console.log("Por edad:", personas);