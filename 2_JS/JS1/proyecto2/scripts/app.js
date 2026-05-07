const form = document.getElementById("form");
const contenedor = document.getElementById("contenedor");
const totalMsg = document.getElementById("totalMsg");

// 1. EL ARRAY (Almacenaje principal solicitado)
let productos = JSON.parse(localStorage.getItem("db_sport")) || [];

// 🔥 VALIDACIÓN EN TIEMPO REAL
form.querySelectorAll("input, textarea").forEach(input => {
    input.addEventListener("input", () => {
        if (input.checkValidity()) {
            input.classList.remove("is-invalid");
            input.classList.add("is-valid");
        } else {
            input.classList.remove("is-valid");
            input.classList.add("is-invalid");
        }
    });
});

// Manejo del envío
form.addEventListener("submit", async (e) => {
    e.preventDefault();

    if (!form.checkValidity()) {
        form.classList.add("was-validated");
        return;
    }

    const data = new FormData(form);
    const nuevoProducto = Object.fromEntries(data.entries());
    nuevoProducto.codigo = nuevoProducto.codigo.toUpperCase();

    // Evitar duplicados por SKU
    if (productos.some(p => p.codigo === nuevoProducto.codigo)) {
        alert("⚠️ Este código ya está registrado.");
        return;
    }

    // --- MÉTODOS DE ALMACENAJE ---
    
    // A. Agregar al Array (Memoria volátil)
    productos.push(nuevoProducto);
    
    // B. LocalStorage (Persistencia en el navegador)
    localStorage.setItem("db_sport", JSON.stringify(productos));

    // C. Envío al Servidor (Persistencia remota)
    try {
        await fetch("/api/guardar", {
            method: "POST",
            body: JSON.stringify(nuevoProducto)
        });
    } catch (err) {
        console.warn("Servidor no disponible, guardado solo localmente.");
    }

    // Resetear formulario y estilos de validación
    form.reset();
    form.classList.remove("was-validated");
    form.querySelectorAll(".is-valid").forEach(i => i.classList.remove("is-valid"));
    
    render();
});

// Función para mostrar los datos del Array en el HTML
function render() {
    contenedor.innerHTML = "";
    totalMsg.innerText = `${productos.length} Items`;

    productos.forEach(p => {
        contenedor.innerHTML += `
            <div class="col-md-6">
                <div class="card prod-card h-100 bg-dark shadow-sm border-secondary">
                    <div class="card-body">
                        <div class="d-flex justify-content-between align-items-center mb-2">
                            <h6 class="m-0 fw-bold text-white">${p.nombre}</h6>
                            <span class="badge bg-dark-subtle text-success border border-success small">${p.codigo}</span>
                        </div>
                        <p class="text-secondary mb-3" style="font-size: 0.85rem;">${p.marca} | ${p.categoria}</p>
                        <div class="d-flex justify-content-between align-items-end">
                            <div>
                                <span class="text-white fw-bold fs-5">$${Number(p.precio).toLocaleString()}</span>
                                <div class="text-secondary small mt-1">Stock: ${p.stock} un.</div>
                            </div>
                            <small class="text-muted" style="font-size: 0.7rem;">${p.fecha}</small>
                        </div>
                        <hr class="text-secondary opacity-25">
                        <p class="small text-secondary mb-0 text-truncate">${p.descripcion}</p>
                    </div>
                </div>
            </div>`;
    });
}

// Carga inicial al abrir la página
render();