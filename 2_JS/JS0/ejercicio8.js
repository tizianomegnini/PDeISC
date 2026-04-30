let roles = ["user", "admin"];
console.log("Tiene admin:", roles.includes("admin"));

let colores = ["rojo", "azul"];
console.log("Tiene verde:", colores.includes("verde"));

let numeros = [1, 2, 3];
let num = 4;

if (!numeros.includes(num)) {
  numeros.push(num);
}
console.log("Numeros:", numeros);