let animales = ["gato", "perro", "conejo"];
let numeros = [10, 20, 30, 40];
let ciudades = ["Buenos Aires", "París", "Roma"];

const resultado = document.getElementById("resultado");

// 1️⃣ Buscar "perro"
document.getElementById("btnPerro").onclick = () => {
    const index = animales.indexOf("perro");

    if (index !== -1) {
        mostrar(`"perro" está en la posición ${index}`);
    } else {
        mostrar('"perro" no encontrado');
    }
};

// 2️⃣ Buscar número 50
document.getElementById("btnNumero").onclick = () => {
    const index = numeros.indexOf(50);

    if (index !== -1) {
        mostrar(`50 está en la posición ${index}`);
    } else {
        mostrar("El número 50 no está en el array");
    }
};

// 3️⃣ Buscar "Madrid"
document.getElementById("btnCiudad").onclick = () => {
    const index = ciudades.indexOf("Madrid");

    if (index !== -1) {
        mostrar(`Madrid está en la posición ${index}`);
    } else {
        mostrar("Madrid no está en el array");
    }
};

// Mostrar

function mostrar(texto) {
    resultado.innerHTML = `
        <div class="card bg-secondary p-3">
            <p>${texto}</p>
            <p><strong>Animales:</strong> ${animales.join(", ")}</p>
            <p><strong>Números:</strong> ${numeros.join(", ")}</p>
            <p><strong>Ciudades:</strong> ${ciudades.join(", ")}</p>
        </div>
    `;
}

mostrar("Estado inicial");