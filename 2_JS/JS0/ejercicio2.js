let animales = ["perro", "gato", "conejo"];
animales.pop();
console.log("Animales:", animales);

let compras = ["pan", "leche", "huevos"];
let eliminado = compras.pop();
console.log("Eliminado:", eliminado);
console.log("Compras:", compras);

let datos = [1, 2, 3, 4];
while (datos.length > 0) {
  console.log("Eliminando:", datos.pop());
}
console.log("Array vacío:", datos);