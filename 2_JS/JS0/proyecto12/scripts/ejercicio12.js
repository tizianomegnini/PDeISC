let numeros = [1, 2, 3, 4];
let precios = [
    { precio: 100 },
    { precio: 200 },
    { precio: 50 }
];

const resultado = document.getElementById("resultado");

// 1️⃣ Suma
document.getElementById("btnSuma").onclick = () => {
    const suma = numeros.reduce((acum, num) => acum + num, 0);

    mostrar(`Suma total: ${suma}`);
};

// 2️⃣ Multiplicación
document.getElementById("btnMulti").onclick = () => {
    const multi = numeros.reduce((acum, num) => acum * num, 1);

    mostrar(`Multiplicación total: ${multi}`);
};

// 3️⃣ Total precios
document.getElementById("btnTotal").onclick = () => {
    const total = precios.reduce((acum, item) => acum + item.precio, 0);

    mostrar(`Total de precios: $${total}`);
};

// Mostrar

function mostrar(texto) {
    resultado.innerHTML = `
        <div class="card bg-secondary p-3">
            <p>${texto}</p>
            <p><strong>Números:</strong> ${numeros.join(", ")}</p>
            <p><strong>Precios:</strong> ${precios.map(p => p.precio).join(", ")}</p>
        </div>
    `;
}

mostrar("Estado inicial");