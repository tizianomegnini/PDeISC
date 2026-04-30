let numeros = [10, 20, 30, 40];
let mensajes = ["Hola", "¿Cómo estás?", "Nos vemos"];
let cola = ["Cliente1", "Cliente2"];

const resultado = document.getElementById("resultado");
const inputCliente = document.getElementById("cliente");

// Quitar primer número
document.getElementById("btnNumero").onclick = () => {
    const eliminado = numeros.shift();
    mostrar(`Número eliminado: ${eliminado}`);
};

// Eliminar primer mensaje
document.getElementById("btnMensaje").onclick = () => {
    const eliminado = mensajes.shift();
    mostrar(`Mensaje eliminado: ${eliminado}`);
};

// Agregar cliente a la cola
document.getElementById("btnAgregar").onclick = () => {
    if (inputCliente.value !== "") {
        cola.push(inputCliente.value);
        inputCliente.value = "";
        mostrar("Cliente agregado a la cola");
    }
};

// Atender cliente (FIFO)
document.getElementById("btnAtender").onclick = () => {
    if (cola.length > 0) {
        const atendido = cola.shift();
        mostrar(`Cliente atendido: ${atendido}`);
    } else {
        mostrar("No hay clientes en la cola");
    }
};

// Mostrar estado

function mostrar(mensaje) {
    resultado.innerHTML = `
        <div class="card bg-secondary p-3">
            <p>${mensaje}</p>
            <p><strong>Números:</strong> ${numeros.join(", ")}</p>
            <p><strong>Mensajes:</strong> ${mensajes.join(", ")}</p>
            <p><strong>Cola:</strong> ${cola.join(" → ")}</p>
        </div>
    `;
}

mostrar("Estado inicial");