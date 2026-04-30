let numeros = [1, 2, 3, 4, 5, 6];
let peliculas = ["Matrix", "Avatar", "Titanic", "Batman", "Joker"];

const resultado = document.getElementById("resultado");

// 1️⃣ Primeros 3
document.getElementById("btnPrimeros").onclick = () => {
    const copia = numeros.slice(0, 3);
    mostrar("Primeros 3 números", copia);
};

// 2️⃣ Películas de posición 2 a 4
document.getElementById("btnPeliculas").onclick = () => {
    const copia = peliculas.slice(2, 5);
    mostrar("Películas (posición 2 a 4)", copia);
};

// 3️⃣ Últimos 3 elementos
document.getElementById("btnUltimos").onclick = () => {
    const copia = numeros.slice(-3);
    mostrar("Últimos 3 números", copia);
};

// Mostrar resultados

function mostrar(titulo, copia) {
    resultado.innerHTML = `
        <div class="card bg-secondary p-3">
            <p><strong>${titulo}:</strong> ${copia.join(", ")}</p>
            <hr>
            <p><strong>Array original números:</strong> ${numeros.join(", ")}</p>
            <p><strong>Array original películas:</strong> ${peliculas.join(", ")}</p>
        </div>
    `;
}

mostrar("Estado inicial", []);