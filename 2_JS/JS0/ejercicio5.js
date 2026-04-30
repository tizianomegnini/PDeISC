let letras = ["a", "b", "c", "d"];
letras.splice(1, 2);
console.log("Letras:", letras);

let nombres = ["Ana", "Luis"];
nombres.splice(1, 0, "Carlos");
console.log("Nombres:", nombres);

let nums = [1, 2, 3, 4];
nums.splice(1, 2, 8, 9);
console.log("Reemplazado:", nums);