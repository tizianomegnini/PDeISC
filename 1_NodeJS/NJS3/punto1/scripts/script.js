let imagenActual = null;
let estadoTexto = true;

// 🎨 colores posibles
const colores = ["red", "blue", "green", "yellow", "purple", "orange"];

// 🖼️ imágenes aleatorias
function imagenRandom() {
    return `https://picsum.photos/200?random=${Math.floor(Math.random() * 1000)}`;
}

function agregarH1() {
    document.getElementById("titulo").innerText = "Hola DOM";
}

function cambiarTexto() {
    const titulo = document.getElementById("titulo");

    estadoTexto = !estadoTexto;
    titulo.innerText = estadoTexto ? "Hola DOM" : "Chau DOM";
}

function cambiarColor() {
    const titulo = document.getElementById("titulo");
    const color = colores[Math.floor(Math.random() * colores.length)];

    titulo.style.color = color;
}

function agregarImagen() {
    const contenedor = document.getElementById("contenedorImagen");

    if (!imagenActual) {
        imagenActual = document.createElement("img");
        imagenActual.src = imagenRandom();
        imagenActual.classList.add("img-fluid", "rounded");
        contenedor.appendChild(imagenActual);
    }
}

function cambiarImagen() {
    if (imagenActual) {
        imagenActual.src = imagenRandom();
    }
}

function cambiarTamano() {
    if (imagenActual) {
        const size = Math.floor(Math.random() * 200) + 100;
        imagenActual.style.width = size + "px";
    }
}