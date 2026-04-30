let letras = ["A", "B", "C", "D"];
let numeros = [1, 2, 3, 4, 5];

const resultado = document.getElementById("resultado");
const inputTexto = document.getElementById("texto");

// 1️⃣ Invertir letras
document.getElementById("btnLetras").onclick = () => {
    letras.reverse();
    mostrar(`Letras invertidas: ${letras.join(", ")}`);
};

// 2️⃣ Invertir números
document.getElementById("btnNumeros").onclick = () => {
    numeros.reverse();
    mostrar(`Números invertidos: ${numeros.join(", ")}`);
};

// 3️⃣ Invertir texto
document.getElementById("btnTexto").onclick = () => {
    const texto = inputTexto.value;

    const invertido = texto
        .split("")      // string → array
        .reverse()      // invertir
        .join("");      // array → string

    mostrar(`Texto invertido: ${invertido}`);
};

// Mostrar

function mostrar(texto) {
    resultado.innerHTML = `
        <div class="card bg-secondary p-3">
            <p>${texto}</p>
            <p><strong>Letras:</strong> ${letras.join(", ")}</p>
            <p><strong>Números:</strong> ${numeros.join(", ")}</p>
        </div>
    `;
}

mostrar("Estado inicial");