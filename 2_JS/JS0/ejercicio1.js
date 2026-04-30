let frutas = [];
frutas.push("manzana", "banana", "pera");
console.log("Frutas:", frutas);

let amigos = ["Juan", "Pedro"];
amigos.push("Lucas", "Martina", "Sofia");
console.log("Amigos:", amigos);

let numeros = [10, 20, 30];
let nuevo = 40;

if (nuevo > numeros[numeros.length - 1]) {
  numeros.push(nuevo);
}
console.log("Numeros:", numeros);