// datos
const resultados = [
    { operacion: "4 + 5", resultado: 4 + 5 },
    { operacion: "3 - 6", resultado: 3 - 6 },
    { operacion: "2 * 7", resultado: 2 * 7 },
    { operacion: "20 / 4", resultado: 20 / 4 }
];

// render
const tbody = document.getElementById("tabla-body");

resultados.forEach(item => {
    const fila = document.createElement("tr");

    fila.innerHTML = `
        <td>${item.operacion}</td>
        <td>${item.resultado}</td>
    `;

    tbody.appendChild(fila);
});