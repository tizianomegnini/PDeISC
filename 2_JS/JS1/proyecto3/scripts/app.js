// Clave utilizada para guardar y recuperar los datos en localStorage
const DB_KEY = "db_empresa_x_final";

// Se obtienen los empleados guardados en localStorage (si no hay, inicia array vacío)
let empleados = JSON.parse(localStorage.getItem(DB_KEY)) || [];

// Referencias a elementos del DOM
const form = document.getElementById("formEmpresa"); // Formulario principal
const lista = document.getElementById("listaEmpleados"); // Contenedor donde se renderizan empleados
const totalDisplay = document.getElementById("total"); // Muestra cantidad total de empleados

/* =========================
   UTILIDADES
========================= */

// Elimina espacios al inicio y al final de un texto
const cleanText = (txt) => txt.trim();

// Valida formato de email usando expresión regular
const validateEmail = (mail) =>
  /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(mail);

// Calcula la edad real a partir de una fecha de nacimiento (YYYY-MM-DD)
const calcularEdad = (fechaNac) => {
  const hoy = new Date(); // Fecha actual
  const nac = new Date(fechaNac); // Fecha de nacimiento
  let edad = hoy.getFullYear() - nac.getFullYear(); // Diferencia de años
  const m = hoy.getMonth() - nac.getMonth(); // Diferencia de meses

  // Si todavía no cumplió años este año, se resta 1
  if (m < 0 || (m === 0 && hoy.getDate() < nac.getDate())) edad--;

  return edad; // Retorna edad calculada
};

/* =========================
   SISTEMA DE ERRORES INLINE
========================= */

// Muestra un mensaje de error debajo del campo indicado
const showError = (fieldId, msg) => {
  clearError(fieldId); // Primero limpia error previo si existe

  const field = document.getElementById(fieldId); // Campo del formulario
  if (!field) return; // Si no existe, termina

  field.classList.add("is-invalid"); // Marca el campo como inválido (Bootstrap)

  // Crea el mensaje de error
  const div = document.createElement("div");
  div.className = "invalid-feedback d-block"; // Clase de Bootstrap para feedback
  div.id = `error-${fieldId}`; // ID único para el error
  div.textContent = msg; // Texto del error

  // Inserta el error debajo del campo
  field.parentElement.appendChild(div);
};

// Elimina el error de un campo
const clearError = (fieldId) => {
  const field = document.getElementById(fieldId);

  // Quita clase de error
  if (field) field.classList.remove("is-invalid");

  // Elimina el mensaje si existe
  const prev = document.getElementById(`error-${fieldId}`);
  if (prev) prev.remove();
};

// Limpia todos los errores del formulario
const clearAllErrors = () => {
  // Quita clase de error de todos los campos
  form.querySelectorAll(".is-invalid").forEach(el => el.classList.remove("is-invalid"));

  // Elimina todos los mensajes de error
  form.querySelectorAll(".invalid-feedback").forEach(el => el.remove());
};

/* =========================
   FILTROS VISUALES
========================= */

// Aplica un filtro a un input para permitir solo ciertos caracteres
const setFilter = (id, regex) => {
  document.getElementById(id)?.addEventListener("keypress", (e) => {
    if (!regex.test(e.key)) e.preventDefault(); // Bloquea tecla si no cumple regex
  });
};

// Filtros aplicados a cada campo
setFilter("nombre",       /^[a-zA-ZñÑáéíóúÁÉÍÓÚ ]+$/);
setFilter("apellido",     /^[a-zA-ZñÑáéíóúÁÉÍÓÚ ]+$/);
setFilter("nacionalidad", /^[a-zA-ZñÑáéíóúÁÉÍÓÚ ]+$/);
setFilter("dni",          /^[0-9]+$/);
setFilter("cuit",         /^[0-9]+$/);
setFilter("tel",          /^[0-9+ ]+$/);
setFilter("edad",         /^[0-9]+$/);
setFilter("cantHijos",    /^[0-9]+$/);

/* =========================
   VALIDACIÓN CRUZADA EDAD / NACIMIENTO
========================= */

// Verifica que la edad coincida con la fecha de nacimiento
const validarEdadNacimiento = () => {
  const edadInput = document.getElementById("edad");
  const nacInput  = document.querySelector("[name='nacimiento']");

  // Si alguno está vacío, no valida
  if (!edadInput.value || !nacInput.value) return;

  const edadIngresada = parseInt(edadInput.value);
  const edadReal      = calcularEdad(nacInput.value);

  // Si no coinciden, muestra error
  if (edadIngresada !== edadReal) {
    showError("edad", `La edad no coincide con la fecha de nacimiento (debería ser ${edadReal}).`);
  } else {
    clearError("edad"); // Si coincide, limpia error
  }
};

// Se ejecuta cuando cambia la edad
document.getElementById("edad")
  ?.addEventListener("change", validarEdadNacimiento);

// Se ejecuta cuando cambia la fecha de nacimiento
document.querySelector("[name='nacimiento']")
  ?.addEventListener("change", validarEdadNacimiento);

/* =========================
   MOSTRAR INPUT HIJOS
========================= */

// Detecta cambios en el formulario
form.addEventListener("change", (e) => {
  if (e.target.name === "hijos") {
    const mostrar = e.target.value === "Si";

    // Muestra u oculta el input de cantidad de hijos
    document.getElementById("inputCantHijos").style.display = mostrar ? "block" : "none";

    // Si no tiene hijos, resetea valor
    if (!mostrar) {
      document.getElementById("cantHijos").value = "0";
      clearError("cantHijos");
    }
  }
});

/* =========================
   SUBMIT + VALIDACIÓN
========================= */

// Evento al enviar formulario
form.addEventListener("submit", (e) => {
  e.preventDefault(); // Evita recarga de página

  clearAllErrors(); // Limpia errores previos

  // Convierte los datos del form en objeto
  const data = Object.fromEntries(new FormData(form).entries());

  // Sanitizar datos (limpiar espacios)
  data.nombre       = cleanText(data.nombre);
  data.apellido     = cleanText(data.apellido);
  data.mail         = cleanText(data.mail).toLowerCase();
  data.dni          = cleanText(data.dni);
  data.cuit         = cleanText(data.cuit);
  data.nacionalidad = cleanText(data.nacionalidad);

  const edad      = parseInt(data.edad);
  const cantHijos = parseInt(data.cantidadHijos) || 0;
  let hayError    = false;

  // VALIDACIONES

  if (!data.nombre) {
    showError("nombre", "El nombre es obligatorio.");
    hayError = true;
  }

  if (!data.apellido) {
    showError("apellido", "El apellido es obligatorio.");
    hayError = true;
  }

  if (!data.edad || isNaN(edad) || edad < 18 || edad > 80) {
    showError("edad", "La edad debe estar entre 18 y 80 años.");
    hayError = true;
  } else if (data.nacimiento) {
    const edadReal = calcularEdad(data.nacimiento);
    if (edad !== edadReal) {
      showError("edad", `La edad no coincide con la fecha de nacimiento (debería ser ${edadReal}).`);
      hayError = true;
    }
  }

  if (!data.nacimiento) {
    showError("nacimiento", "La fecha de nacimiento es obligatoria.");
    hayError = true;
  }

  if (!data.dni || data.dni.length !== 8) {
    showError("dni", "El DNI debe tener exactamente 8 dígitos.");
    hayError = true;
  }

  if (!data.cuit || data.cuit.length !== 11) {
    showError("cuit", "El CUIT debe tener exactamente 11 dígitos.");
    hayError = true;
  }

  if (!data.mail || !validateEmail(data.mail)) {
    showError("mail", "Ingresá un email válido.");
    hayError = true;
  }

  if (!data.telefono) {
    showError("tel", "El teléfono es obligatorio.");
    hayError = true;
  }

  if (!data.nacionalidad) {
    showError("nacionalidad", "La nacionalidad es obligatoria.");
    hayError = true;
  }

  if (data.hijos === "Si" && cantHijos < 1) {
    showError("cantHijos", "Indicá al menos 1 hijo.");
    hayError = true;
  }

  // VALIDACIÓN DE DUPLICADOS

  if (data.dni && data.dni.length === 8 && empleados.some(emp => emp.dni === data.dni)) {
    showError("dni", "Ya existe un empleado con ese DNI.");
    hayError = true;
  }

  if (data.mail && validateEmail(data.mail) && empleados.some(emp => emp.mail === data.mail)) {
    showError("mail", "Ese email ya está registrado.");
    hayError = true;
  }

  if (data.cuit && data.cuit.length === 11 && empleados.some(emp => emp.cuit === data.cuit)) {
    showError("cuit", "Ese CUIT ya existe.");
    hayError = true;
  }

  // Si hay errores, corta ejecución
  if (hayError) return;

  // Normaliza cantidad de hijos
  data.cantidadHijos = data.hijos === "Si" ? cantHijos : 0;

  // Guarda en array
  empleados.push(data);

  // Guarda en localStorage
  localStorage.setItem(DB_KEY, JSON.stringify(empleados));

  // Resetea formulario
  form.reset();
  clearAllErrors();
  document.getElementById("inputCantHijos").style.display = "none";

  render(); // Vuelve a renderizar lista
});

/* =========================
   RENDER
========================= */

// Muestra todos los empleados en pantalla
function render() {
  lista.innerHTML = ""; // Limpia lista
  totalDisplay.innerText = empleados.length; // Actualiza contador

  empleados.forEach(emp => {
    // Inserta cada tarjeta de empleado
    lista.innerHTML += `
    <div class="col-12 col-md-6">
      <div class="card employee-card p-3 shadow-sm border-secondary h-100">
        <div class="d-flex justify-content-between border-bottom border-secondary pb-2 mb-2">
          <h6 class="fw-bold m-0 text-white small">
            ${emp.nombre.toUpperCase()} ${emp.apellido.toUpperCase()}
          </h6>
          <i class="bi bi-person-badge text-primary"></i>
        </div>

        <div class="row g-2">
          <div class="col-6">
            <label class="data-label d-block">Documento / CUIT</label>
            <span>${emp.dni}</span>
            <span class="text-info d-block" style="font-size:0.75rem">${emp.cuit}</span>
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
            <span class="badge ${emp.hijos === 'Si'
              ? 'bg-primary'
              : 'bg-dark border border-secondary text-secondary'} w-100">
              HIJOS: ${emp.hijos === 'Si' ? emp.cantidadHijos : 'NINGUNO'}
            </span>
          </div>
        </div>
      </div>
    </div>
    `;
  });
}

// Ejecuta render al cargar la página
render();