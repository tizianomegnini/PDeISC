let numeros = [5, 12, 8, 20, 3];
let palabras = ["sol", "computadora", "mesa", "programacion", "luz"];
let usuarios = [
    { nombre: "Juan", activo: true },
    { nombre: "Ana", activo: false },
    { nombre: "Carlos", activo: true }
];

const resultado = document.getElementById("resultado");

// 1️⃣ Números > 10
document.getElementById("btnNumeros").onclick = () => {
    const filtrados = numeros.filter(num => num > 10);
    mostrar("Números mayores a 10", filtrados);
};

// 2️⃣ Palabras > 5 letras
document.getElementById("btnPalabras").onclick = () => {
    const filtradas = palabras.filter(p => p.length > 5);
    mostrar("Palabras con más de 5 letras", filtradas);
};

// 3️⃣ Usuarios activos
document.getElementById("btnUsuarios").onclick = () => {
    const activos = usuarios.filter(u => u.activo);

    let salida = activos.map(u => `<p>${u.nombre}</p>`).join("");

    resultado.innerHTML = `
        <div class="card bg-secondary p-3">
            <p><strong>Usuarios activos:</strong></p>
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