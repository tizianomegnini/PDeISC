let animales = ["Perro", "Gato", "Conejo"];
let productos = ["Pan", "Leche", "Huevos"];
let numeros = [1,2,3,4,5];

const resultado = document.getElementById("resultado");

// BOTÓN 1
document.getElementById("btnAnimal").onclick = () => {
    const eliminado = animales.pop();
    mostrar(`Animal eliminado: ${eliminado}`);
};

// BOTÓN 2
document.getElementById("btnProducto").onclick = () => {
    const eliminado = productos.pop();
    mostrar(`Producto eliminado: ${eliminado}`);
};

// BOTÓN 3
document.getElementById("btnVaciar").onclick = () => {
    let eliminados = [];

    while(numeros.length > 0){
        eliminados.push(numeros.pop());
    }

    mostrar(`Array vaciado: ${eliminados.join(", ")}`);
};

function mostrar(texto){
    resultado.innerHTML = `
        <div class="card bg-secondary p-3">
            <p>${texto}</p>
            <p><strong>Animales:</strong> ${animales.join(", ")}</p>
            <p><strong>Productos:</strong> ${productos.join(", ")}</p>
            <p><strong>Números:</strong> ${numeros.join(", ")}</p>
        </div>
    `;
}

mostrar("Estado inicial");