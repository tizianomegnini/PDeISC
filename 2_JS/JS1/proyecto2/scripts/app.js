const form = document.getElementById("form");
const contenedor = document.getElementById("contenedor");
const totalMsg = document.getElementById("totalMsg");

let productos = JSON.parse(localStorage.getItem("db_sport")) || [];

// --- VALIDACIÓN Y LIMPIEZA EN TIEMPO REAL ---
form.querySelectorAll("input, textarea, select").forEach(el => {
    el.addEventListener("input", () => {
        // Limpiamos el error personalizado apenas el usuario escribe
        el.setCustomValidity("");
        el.classList.remove("is-invalid");
        
        // Damos feedback visual de que el campo está ok
        if (el.checkValidity()) {
            el.classList.add("is-valid");
        } else {
            el.classList.remove("is-valid");
        }
    });
});

// --- MANEJO DEL ENVÍO ---
form.addEventListener("submit", async (e) => {
    e.preventDefault();

    // 1. Validar campos vacíos (Nativo)
    if (!form.checkValidity()) {
        form.classList.add("was-validated");
        // El navegador mostrará automáticamente el mensaje de "Completa este campo" 
        // en el primer campo que falle gracias al comportamiento nativo de HTML5
        return;
    }

    // 2. Procesar datos
    const data = new FormData(form);
    const nuevoProducto = Object.fromEntries(data.entries());
    nuevoProducto.codigo = nuevoProducto.codigo.toUpperCase().trim();

    // 3. Validar Duplicados
    const codigoInput = document.getElementById("codigo");
    if (productos.some(p => p.codigo === nuevoProducto.codigo)) {
        codigoInput.setCustomValidity("El código ya existe.");
        codigoInput.classList.add("is-invalid");
        form.classList.add("was-validated");
        
        // Mostrar mensaje específico en el feedback
        const feedback = codigoInput.nextElementSibling;
        if (feedback) feedback.textContent = "❌ Este código ya está registrado en el inventario.";
        return;
    }

    // 4. Guardado
    productos.push(nuevoProducto);
    localStorage.setItem("db_sport", JSON.stringify(productos));

    try {
        await fetch("/api/guardar", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(nuevoProducto)
        });
    } catch (err) {
        console.warn("Servidor no disponible, guardado localmente.");
    }

    form.reset();
    form.classList.remove("was-validated");
    form.querySelectorAll(".is-valid").forEach(i => i.classList.remove("is-valid"));
    
    render();
});

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

render();