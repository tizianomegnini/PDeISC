const form = document.getElementById("form");
const cbuInput = document.getElementById("cbu");
const cbuFeedback = document.getElementById("cbuFeedback");
const emailInput = document.getElementById("email");
const fechaInput = document.getElementById("fechaNacimiento");
const dateFeedback = document.getElementById("dateFeedback");

// Añadimos 'cuil' a las restricciones por teclado
const soloTexto = ["nombre", "apellido"];
const soloNumeros = ["dni", "telefono", "cbu", "cuil"];

function bloquearTexto(e) {
  if (["Backspace", "ArrowLeft", "ArrowRight", "Delete", "Tab"].includes(e.key)) return;
  if (!/^[A-Za-zÁÉÍÓÚáéíóúñÑ ]$/.test(e.key)) e.preventDefault();
}

function bloquearNumero(e) {
  if (["Backspace", "ArrowLeft", "ArrowRight", "Delete", "Tab"].includes(e.key)) return;
  if (!/^[0-9]$/.test(e.key)) e.preventDefault();
}

soloTexto.forEach(id => document.getElementById(id).addEventListener("keydown", bloquearTexto));
soloNumeros.forEach(id => document.getElementById(id).addEventListener("keydown", bloquearNumero));

// --- VALIDACIONES DE EMAIL Y FECHA EN TIEMPO REAL ---
const validarEmailYEdad = () => {
  // Corregido: Expresión regular robusta con flag 'i' (Case Insensitive)
  const emailRegex = /^[a-zA-Z0-9._%+-]+@(gmail|hotmail)\.com$/i;
  
  if (emailRegex.test(emailInput.value)) {
    emailInput.setCustomValidity("");
  } else {
    emailInput.setCustomValidity("Email inválido");
  }

  // Validación de edad (+18) obligatoria en bancos
  if (fechaInput.value) {
    const nacimiento = new Date(fechaInput.value);
    const hoy = new Date();
    let edad = hoy.getFullYear() - nacimiento.getFullYear();
    const mes = hoy.getMonth() - nacimiento.getMonth();
    if (mes < 0 || (mes === 0 && hoy.getDate() < nacimiento.getDate())) {
      edad--;
    }

    if (edad >= 18) {
      fechaInput.setCustomValidity("");
    } else {
      fechaInput.setCustomValidity("Menor de edad");
      dateFeedback.textContent = `Posee ${edad} años. Regulación exige mayoría de edad (+18).`;
    }
  }
};

emailInput.addEventListener("input", validarEmailYEdad);
fechaInput.addEventListener("input", validarEmailYEdad);

// Monitoreo visual de clases Bootstrap
form.querySelectorAll("input, select").forEach(input => {
  input.addEventListener("input", () => {
    if (input.id === "cbu") {
      cbuInput.setCustomValidity("");
      cbuFeedback.textContent = "Debe poseer exactamente 22 dígitos.";
    }
    if (input.checkValidity()) {
      input.classList.add("is-valid");
      input.classList.remove("is-invalid");
    } else {
      input.classList.add("is-invalid");
      input.classList.remove("is-valid");
    }
  });
});

// --- SUBMIT DEL FORMULARIO ---
form.addEventListener("submit", async (e) => {
  e.preventDefault();
  
  validarEmailYEdad();

  // Control asíncrono anti-duplicado sin ALERTS molestos
  const resCheck = await fetch("/usuarios");
  const usuarios = await resCheck.json();
  const currentCbu = cbuInput.value.trim();

  if (usuarios.some(u => u.cbu === currentCbu)) {
    cbuInput.setCustomValidity("CBU duplicado");
    cbuInput.classList.add("is-invalid");
    cbuInput.classList.remove("is-valid");
    cbuFeedback.textContent = "❌ Alerta de riesgo: CBU ya asignado a otra cuenta.";
    form.classList.add("was-validated");
    return;
  }

  if (!form.checkValidity()) {
    form.classList.add("was-validated");
    return;
  }

  // =========================================================================
  // 🔥 CONSIGNAS: DEMOSTRACIÓN EXPLÍCITA DE LAS 3 FORMAS DE LECTURA DE DATOS
  // =========================================================================
  
  // FORMA 1: Acceso directo utilizando la propiedad del DOM por su ID único
  const valorNombre = document.getElementById("nombre").value;
  const valorDni = document.getElementById("dni").value;
  const valorCuil = document.getElementById("cuil").value;

  // FORMA 2: Instanciación de la API FormData (Especializada en procesamiento de formularios)
  const fd = new FormData(form);
  const valorApellido = fd.get("apellido");
  const valorFechaNacimiento = fd.get("fechaNacimiento");
  const valorTipo = fd.get("tipo");
  const valorOrigen = fd.get("origenFondos");

  // FORMA 3: QuerySelector avanzado con sintaxis de selectores CSS
  const valorEmail = document.querySelector("#email").value;
  const valorTelefono = document.querySelector("#telefono").value;
  const valorMonto = document.querySelector("#monto").value;

  // =========================================================================

  const payload = {
    nombre: valorNombre.trim(),
    apellido: valorApellido.trim(),
    dni: valorDni.trim(),
    cuil: valorCuil.trim(),
    fechaNacimiento: valorFechaNacimiento,
    email: valorEmail.trim(),
    telefono: valorTelefono.trim(),
    tipo: valorTipo,
    origenFondos: valorOrigen,
    cbu: currentCbu,
    monto: valorMonto
  };

  await fetch("/agregar", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload)
  });

  form.reset();
  form.classList.remove("was-validated");
  form.querySelectorAll("input, select").forEach(i => i.classList.remove("is-valid", "is-invalid"));

  cargarUsuarios();
});

// --- RENDER DE TARJETAS DE CRÉDITO / CUENTAS ---
async function cargarUsuarios() {
  const res = await fetch("/usuarios");
  const data = await res.json();
  const lista = document.getElementById("lista");

  lista.innerHTML = "";

  if (data.length === 0) {
    lista.innerHTML = `
      <div class="col-12 text-center py-5">
        <p class="text-muted fst-italic">No se registran solicitudes aprobadas en este lote de cumplimiento.</p>
      </div>`;
    return;
  }

  data.forEach(u => {
    const montoFormateado = Number(u.monto).toLocaleString("es-AR", { minimumFractionDigits: 2 });
    
    lista.innerHTML += `
      <div class="col-12 col-xl-6">
        <div class="account-card">
          <div class="d-flex justify-content-between align-items-start mb-2">
            <div>
              <h5 class="fw-bold mb-0 text-success">${u.apellido}, ${u.nombre}</h5>
              <small class="text-muted d-block">DNI: ${u.dni} | CUIL: ${u.cuil}</small>
              <small class="text-muted">Nacido el: ${u.fechaNacimiento}</small>
            </div>
            <span class="badge ${u.tipo === 'Ahorro' ? 'bg-success-subtle text-success' : 'bg-info-subtle text-info'} px-2 py-1">
              ${u.tipo}
            </span>
          </div>
          <hr class="my-2" style="opacity:0.1; color:var(--text);">
          <div class="small mb-3">
            <div class="text-truncate"><b>CBU:</b> <span class="font-monospace text-warning">${u.cbu}</span></div>
            <div class="text-muted text-truncate"><b>Fondos:</b> ${u.origenFondos} | <b>Mail:</b> ${u.email}</div>
          </div>
          <div class="text-end">
            <small class="text-muted d-block" style="font-size:0.75rem;">SALDO DISPONIBLE</small>
            <span class="h4 fw-bold text-success">$ ${montoFormateado}</span>
          </div>
        </div>
      </div>
    `;
  });
}

document.getElementById('themeBtn').addEventListener('click', () => {
  const html = document.documentElement;
  html.setAttribute('data-theme', html.getAttribute('data-theme') === 'dark' ? 'light' : 'dark');
});

// Inicialización asíncrona pura
cargarUsuarios();
// --- CONTROL DEL BOTÓN SCROLL TO TOP (HÍBRIDO PC/MOBILE) ---
const scrollTopBtn = document.getElementById("scrollTopBtn");
const mainContentPanel = document.querySelector(".main-content");

const controlarScroll = () => {
  // Detecta el scroll en .main-content (PC) o en el window (Mobile)
  const scrollInyectado = mainContentPanel.scrollTop;
  const scrollNativo = window.scrollY;

  if (scrollInyectado > 300 || scrollNativo > 300) {
    scrollTopBtn.classList.add("show");
  } else {
    scrollTopBtn.classList.remove("show");
  }
};

// Escuchamos los dos entornos para asegurar que funcione en cualquier dispositivo
mainContentPanel.addEventListener("scroll", controlarScroll);
window.addEventListener("scroll", controlarScroll);

// Comportamiento de subida suave (Smooth)
scrollTopBtn.addEventListener("click", () => {
  // Resetea el scroll de PC
  mainContentPanel.scrollTo({ top: 0, behavior: "smooth" });
  // Resetea el scroll de Celular
  window.scrollTo({ top: 0, behavior: "smooth" });
});