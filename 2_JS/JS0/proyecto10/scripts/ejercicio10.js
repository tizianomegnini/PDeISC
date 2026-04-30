let numeros = [1, 2, 3, 4];
let nombres = ["juan", "ana", "carlos"];
let precios = [100, 200, 300];

const resultado = document.getElementById("resultado");

// 1️⃣ Multiplicar x3
document.getElementById("btnTriple").onclick = () => {
    const nuevos = numeros.map(num => num * 3);

    mostrar("Números x3", nuevos);
};

// 2️⃣ Mayúsculas
document.getElementById("btnMayus").onclick = () => {
    const nuevos = nombres.map(nombre => nombre.toUpperCase());

    mostrar("Nombres en mayúsculas", nuevos);
};

// 3️⃣ IVA 21%
document.getElementById("btnIVA").onclick = () => {
    const nuevos = precios.map(precio => precio * 1.21);

    mostrar("Precios con IVA", nuevos);
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