let numeros = [30, 5, 20, 100, 1];
let palabras = ["banana", "manzana", "pera", "kiwi"];
let personas = [
    { nombre: "Juan", edad: 30 },
    { nombre: "Ana", edad: 20 },
    { nombre: "Carlos", edad: 25 }
];

const resultado = document.getElementById("resultado");

// 1️⃣ Ordenar números correctamente
document.getElementById("btnNumeros").onclick = () => {
    numeros.sort((a, b) => a - b);
    mostrar("Números ordenados", numeros);
};

// 2️⃣ Ordenar palabras
document.getElementById("btnPalabras").onclick = () => {
    palabras.sort();
    mostrar("Palabras ordenadas", palabras);
};

// 3️⃣ Ordenar por edad
document.getElementById("btnPersonas").onclick = () => {
    personas.sort((a, b) => a.edad - b.edad);

    let salida = personas.map(p => `<p>${p.nombre} - ${p.edad} años</p>`).join("");

    resultado.innerHTML = `
        <div class="card bg-secondary p-3">
            <p><strong>Personas ordenadas por edad:</strong></p>
            ${salida}
        </div>
    `;
};

// Mostrar

function mostrar(titulo, array) {
    resultado.innerHTML = `
        <div class="card bg-secondary p-3">
            <p><strong>${titulo}:</strong></p>
            <p>${array.join(", ")}</p>
        </div>
    `;
}

mostrar("Estado inicial", []);