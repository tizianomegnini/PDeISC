let letras = ["A", "B", "C", "D"];
let nombres = ["Juan", "Pedro", "Luis"];
let numeros = [1, 2, 3, 4, 5];

const resultado = document.getElementById("resultado");
const inputNombre = document.getElementById("nuevoNombre");

// 1️⃣ Eliminar 2 elementos desde posición 1
document.getElementById("btnEliminar").onclick = () => {
    const eliminados = letras.splice(1, 2);
    mostrar(`Eliminados: ${eliminados.join(", ")}`);
};

// 2️⃣ Insertar en segunda posición (índice 1)
document.getElementById("btnInsertar").onclick = () => {
    if (inputNombre.value !== "") {
        nombres.splice(1, 0, inputNombre.value);
        inputNombre.value = "";
        mostrar("Nombre insertado en segunda posición");
    }
};

// 3️⃣ Reemplazar 2 elementos
document.getElementById("btnReemplazar").onclick = () => {
    const reemplazados = numeros.splice(2, 2, 99, 100);
    mostrar(`Reemplazados: ${reemplazados.join(", ")}`);
};

// Mostrar estado

function mostrar(mensaje) {
    resultado.innerHTML = `
        <div class="card bg-secondary p-3">
            <p>${mensaje}</p>
            <p><strong>Letras:</strong> ${letras.join(", ")}</p>
            <p><strong>Nombres:</strong> ${nombres.join(", ")}</p>
            <p><strong>Números:</strong> ${numeros.join(", ")}</p>
        </div>
    `;
}

mostrar("Estado inicial");