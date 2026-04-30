let usuarios = ["admin", "user", "guest"];
let colores = ["rojo", "azul", "amarillo"];
let numeros = [10, 20, 30];

const resultado = document.getElementById("resultado");
const inputNumero = document.getElementById("numero");

// 1️⃣ Verificar "admin"
document.getElementById("btnAdmin").onclick = () => {
    if (usuarios.includes("admin")) {
        mostrar('"admin" existe en el array');
    } else {
        mostrar('"admin" NO existe');
    }
};

// 2️⃣ Verificar "verde"
document.getElementById("btnColor").onclick = () => {
    if (colores.includes("verde")) {
        mostrar('"verde" está en el array');
    } else {
        mostrar('"verde" NO está en el array');
    }
};

// 3️⃣ Agregar número si no existe
document.getElementById("btnNumero").onclick = () => {
    const num = Number(inputNumero.value);

    if (!numeros.includes(num)) {
        numeros.push(num);
        mostrar(`Número ${num} agregado`);
    } else {
        mostrar(`El número ${num} ya existe`);
    }

    inputNumero.value = "";
};

// Mostrar estado

function mostrar(mensaje) {
    resultado.innerHTML = `
        <div class="card bg-secondary p-3">
            <p>${mensaje}</p>
            <p><strong>Usuarios:</strong> ${usuarios.join(", ")}</p>
            <p><strong>Colores:</strong> ${colores.join(", ")}</p>
            <p><strong>Números:</strong> ${numeros.join(", ")}</p>
        </div>
    `;
}

mostrar("Estado inicial");