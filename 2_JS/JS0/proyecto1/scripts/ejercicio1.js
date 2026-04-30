let frutas = [];
let amigos = ["Juan", "Pedro"];
let numeros = [5, 10, 15];

const inputFruta = document.getElementById("fruta");
const btnFruta = document.getElementById("btnFruta");

const inputAmigo = document.getElementById("amigo");
const btnAmigo = document.getElementById("btnAmigo");

const inputNumero = document.getElementById("numero");
const btnNumero = document.getElementById("btnNumero");

const lista = document.getElementById("lista");

// Eventos

btnFruta.onclick = () => {
    if (inputFruta.value !== "") {
        frutas.push(inputFruta.value);
        inputFruta.value = "";
        mostrar();
    }
};

btnAmigo.onclick = () => {
    if (inputAmigo.value !== "") {
        amigos.push(inputAmigo.value);
        inputAmigo.value = "";
        mostrar();
    }
};

btnNumero.onclick = () => {
    const num = Number(inputNumero.value);

    if (num > numeros[numeros.length - 1]) {
        numeros.push(num);
    } else {
        alert("El número debe ser mayor al último");
    }

    inputNumero.value = "";
    mostrar();
};

// Mostrar resultados

function mostrar() {
    lista.innerHTML = `
        <p>Frutas: ${frutas.join(", ")}</p>
        <p>Amigos: ${amigos.join(", ")}</p>
        <p>Números: ${numeros.join(", ")}</p>
    `;
}

mostrar();