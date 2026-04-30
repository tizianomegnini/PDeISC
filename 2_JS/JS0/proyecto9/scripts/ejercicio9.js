let nombres = ["Juan", "Ana", "Carlos"];
let numeros = [2, 4, 6];
let personas = [
    { nombre: "Luis", edad: 20 },
    { nombre: "María", edad: 25 },
    { nombre: "Pedro", edad: 30 }
];

const resultado = document.getElementById("resultado");

// 1️⃣ Saludos
document.getElementById("btnSaludo").onclick = () => {
    let salida = "";

    nombres.forEach(nombre => {
        salida += `<p>Hola ${nombre} 👋</p>`;
    });

    mostrar(salida);
};

// 2️⃣ Dobles
document.getElementById("btnDobles").onclick = () => {
    let salida = "";

    numeros.forEach(num => {
        salida += `<p>${num} x 2 = ${num * 2}</p>`;
    });

    mostrar(salida);
};

// 3️⃣ Personas
document.getElementById("btnPersonas").onclick = () => {
    let salida = "";

    personas.forEach(p => {
        salida += `<p>${p.nombre} tiene ${p.edad} años</p>`;
    });

    mostrar(salida);
};

// Mostrar

function mostrar(contenido) {
    resultado.innerHTML = `
        <div class="card bg-secondary p-3">
            ${contenido}
        </div>
    `;
}

mostrar("<p>Estado inicial</p>");