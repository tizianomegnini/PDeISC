let colores = [];
let tareas = ["Estudiar", "Entrenar"];
let usuarios = ["Admin", "Invitado"];

const resultado = document.getElementById("resultado");

const inputTarea = document.getElementById("tarea");
const inputUsuario = document.getElementById("usuario");

// BOTÓN 1: colores
document.getElementById("btnColores").onclick = () => {
    colores.unshift("Rojo", "Verde", "Azul");
    mostrar("Se agregaron 3 colores al inicio");
};

// BOTÓN 2: tarea urgente
document.getElementById("btnTarea").onclick = () => {
    if (inputTarea.value !== "") {
        tareas.unshift(inputTarea.value);
        inputTarea.value = "";
        mostrar("Tarea urgente agregada");
    }
};

// BOTÓN 3: usuario
document.getElementById("btnUsuario").onclick = () => {
    if (inputUsuario.value !== "") {
        usuarios.unshift(inputUsuario.value);
        inputUsuario.value = "";
        mostrar("Usuario agregado al inicio");
    }
};

// Mostrar estado

function mostrar(mensaje) {
    resultado.innerHTML = `
        <div class="card bg-secondary p-3">
            <p>${mensaje}</p>
            <p><strong>Colores:</strong> ${colores.join(", ")}</p>
            <p><strong>Tareas:</strong> ${tareas.join(", ")}</p>
            <p><strong>Usuarios:</strong> ${usuarios.join(", ")}</p>
        </div>
    `;
}

mostrar("Estado inicial");