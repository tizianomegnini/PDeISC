// array de operaciones
const operaciones = [
    { op: "4 + 5", res: 4 + 5 },
    { op: "3 - 6", res: 3 - 6 },
    { op: "2 * 7", res: 2 * 7 },
    { op: "20 / 4", res: 20 / 4 }
];

// traigo tabla
const tabla = document.getElementById("tabla");

// render
operaciones.forEach(item => {
    const fila = document.createElement("tr");

    fila.innerHTML = `
        <td>${item.op}</td>
        <td>${item.res}</td>
    `;

    tabla.appendChild(fila);
});