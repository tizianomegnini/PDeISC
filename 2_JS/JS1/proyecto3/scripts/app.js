/**
 * APP DE GESTIÓN INTERNA - EMPRESA X
 * Lógica responsiva y validaciones estrictas.
 */

const DB_KEY = "db_empresa_x_final";
let empleados = JSON.parse(localStorage.getItem(DB_KEY)) || [];

const form = document.getElementById("formEmpresa");
const lista = document.getElementById("listaEmpleados");
const totalDisplay = document.getElementById("total");

/**
 * Filtra la entrada del teclado según una expresión regular.
 */
const setFilter = (id, regex) => {
    document.getElementById(id)?.addEventListener("keypress", (e) => {
        if (!regex.test(e.key)) e.preventDefault();
    });
};

// Configuración de bloqueos (Letras en nombres, Números en DNI/CUIT)
setFilter("nombre", /^[a-zA-ZñÑáéíóúÁÉÍÓÚ ]+$/);
setFilter("apellido", /^[a-zA-ZñÑáéíóúÁÉÍÓÚ ]+$/);
setFilter("dni", /^[0-9]+$/);
setFilter("cuit", /^[0-9]+$/);
setFilter("tel", /^[0-9+ ]+$/);
setFilter("edad", /^[0-9]+$/);
setFilter("cantHijos", /^[0-9]+$/);

/**
 * Controla la aparición del campo de cantidad de hijos.
 */
form.addEventListener("change", () => {
    const show = document.getElementById("h-si").checked;
    document.getElementById("inputCantHijos").style.display = show ? "block" : "none";
});

/**
 * Valida formato de e-mail.
 */
const validateEmail = (mail) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(mail);

/**
 * Procesa el envío del formulario con validación visual Bootstrap.
 */
form.addEventListener("submit", async (e) => {
    e.preventDefault();
    
    const mailField = document.getElementById("mail");
    const mailValido = validateEmail(mailField.value);
    
    mailField.classList.toggle("is-invalid", !mailValido);

    if (!form.checkValidity() || !mailValido) {
        form.classList.add("was-validated");
        return;
    }

    const data = Object.fromEntries(new FormData(form).entries());
    
    // Persistencia
    empleados.push(data);
    localStorage.setItem(DB_KEY, JSON.stringify(empleados));

    // Reset y actualización
    form.reset();
    form.classList.remove("was-validated");
    document.getElementById("inputCantHijos").style.display = "none";
    render();
});

/**
 * Renderiza los empleados en formato de tarjeta adaptable.
 */
function render() {
    lista.innerHTML = "";
    totalDisplay.innerText = empleados.length;

    empleados.forEach(emp => {
        // En móvil (col-12) y en PC (col-md-6)
        lista.innerHTML += `
            <div class="col-12 col-md-6">
                <div class="card employee-card p-3 shadow-sm border-secondary h-100">
                    <div class="d-flex justify-content-between border-bottom border-secondary pb-2 mb-2">
                        <h6 class="fw-bold m-0 text-white small">${emp.nombre.toUpperCase()} ${emp.apellido.toUpperCase()}</h6>
                        <i class="bi bi-person-badge text-primary"></i>
                    </div>
                    
                    <div class="row g-2">
                        <div class="col-6">
                            <label class="data-label d-block">Documento / CUIT</label>
                            <span class="d-block">${emp.documento}</span>
                            <span class="d-block text-info" style="font-size:0.75rem">${emp.cuit}</span>
                        </div>
                        <div class="col-6">
                            <label class="data-label d-block">Edad / Nac.</label>
                            <span>${emp.edad} (${emp.nacimiento})</span>
                        </div>
                        <div class="col-6">
                            <label class="data-label d-block">Civil / Sexo</label>
                            <span class="text-capitalize">${emp.estadocivil} / ${emp.sexo}</span>
                        </div>
                        <div class="col-6">
                            <label class="data-label d-block">Nacionalidad</label>
                            <span>${emp.nacionalidad}</span>
                        </div>
                        <div class="col-12">
                            <label class="data-label d-block">Contacto</label>
                            <span class="d-block"><i class="bi bi-telephone"></i> ${emp.telefono}</span>
                            <span class="d-block"><i class="bi bi-envelope"></i> ${emp.mail}</span>
                        </div>
                        <div class="col-12 mt-1">
                            <span class="badge ${emp.hijos === 'Si' ? 'bg-primary' : 'bg-dark border border-secondary text-secondary'} w-100">
                                HIJOS: ${emp.hijos === 'Si' ? emp.cantidadHijos : 'NINGUNO'}
                            </span>
                        </div>
                    </div>
                </div>
            </div>`;
    });
}

render();