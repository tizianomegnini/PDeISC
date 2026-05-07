// Obtiene el formulario por su ID
const form = document.getElementById("form");

// Arrays con IDs de inputs que solo permiten texto o números
const soloTexto = ["nombre", "apellido"];
const soloNumeros = ["dni", "telefono", "cbu"];

// Función que bloquea cualquier tecla que no sea letra
function bloquearTexto(e) {
  const tecla = e.key;

  // Teclas especiales permitidas (para borrar o moverse)
  const especiales = ["Backspace", "ArrowLeft", "ArrowRight", "Delete", "Tab"];

  // Si es una tecla especial, se permite
  if (especiales.includes(tecla)) return;

  // Si no es una letra (incluye acentos y espacio), se bloquea
  if (!/^[A-Za-zÁÉÍÓÚáéíóúñÑ ]$/.test(tecla)) {
    e.preventDefault();
  }
}

// Función que bloquea cualquier tecla que no sea número
function bloquearNumero(e) {
  const tecla = e.key;

  // Teclas especiales permitidas
  const especiales = ["Backspace", "ArrowLeft", "ArrowRight", "Delete", "Tab"];

  // Si es especial, se permite
  if (especiales.includes(tecla)) return;

  // Si no es un número, se bloquea
  if (!/^[0-9]$/.test(tecla)) {
    e.preventDefault();
  }
}

// Aplica la función de solo texto a los inputs correspondientes
soloTexto.forEach(id => {
  document.getElementById(id).addEventListener("keydown", bloquearTexto);
});

// Aplica la función de solo números a los inputs correspondientes
soloNumeros.forEach(id => {
  document.getElementById(id).addEventListener("keydown", bloquearNumero);
});

// Evita pegar contenido inválido en los inputs
document.querySelectorAll("input").forEach(input => {
  input.addEventListener("paste", e => {
    // Obtiene el texto pegado
    const texto = (e.clipboardData || window.clipboardData).getData("text");

    // Validación para nombre y apellido (solo letras)
    if (["nombre", "apellido"].includes(input.id)) {
      if (!/^[A-Za-zÁÉÍÓÚáéíóúñÑ ]+$/.test(texto)) e.preventDefault();
    }

    // Validación para dni, telefono y cbu (solo números)
    if (["dni", "telefono", "cbu"].includes(input.id)) {
      if (!/^[0-9]+$/.test(texto)) e.preventDefault();
    }

    // email permitido libremente (sin bloqueo al pegar)
  });
});

// Obtiene el input de email
const emailInput = document.getElementById("email");

// Valida el email en tiempo real
emailInput.addEventListener("input", () => {
  // Solo permite correos de gmail o hotmail terminados en .com
  const regex = /^[a-zA-Z0-9._%+-]+@(gmail|hotmail)\.com$/;

  // Si cumple, elimina el mensaje de error
  if (regex.test(emailInput.value)) {
    emailInput.setCustomValidity("");
  } else {
    // Si no cumple, muestra error personalizado
    emailInput.setCustomValidity("Email inválido");
  }
});

// VALIDACIÓN VISUAL (clases de Bootstrap)
form.querySelectorAll("input, select").forEach(input => {
  input.addEventListener("input", () => {
    // Si el campo es válido
    if (input.checkValidity()) {
      input.classList.add("is-valid");
      input.classList.remove("is-invalid");
    } else {
      // Si es inválido
      input.classList.add("is-invalid");
      input.classList.remove("is-valid");
    }
  });
});

// Evento al enviar el formulario
form.addEventListener("submit", async (e) => {
  e.preventDefault(); // evita recargar la página

  // Si el formulario no es válido, muestra validaciones
  if (!form.checkValidity()) {
    form.classList.add("was-validated");
    return;
  }

  // 🔥 3 FORMAS DE OBTENER DATOS

  // 1. Acceso directo por ID
  const nombre = document.getElementById("nombre").value;

  // 2. Usando FormData (forma más práctica)
  const data = new FormData(form);
  const apellido = data.get("apellido");

  // 3. Usando querySelector
  const email = document.querySelector("#email").value;

  // evitar duplicado de CBU

  // Pide la lista de usuarios al servidor
  const resCheck = await fetch("/usuarios");
  const usuarios = await resCheck.json();

  // Verifica si ya existe un usuario con ese CBU
  if (usuarios.some(u => u.cbu === data.get("cbu"))) {
    alert("Ese CBU ya está registrado");
    return;
  }

  // Crea el objeto usuario con los datos del formulario
  const usuario = {
    nombre: nombre.trim(),       // elimina espacios extra
    apellido: apellido.trim(),
    dni: data.get("dni"),
    email: email.trim(),
    telefono: data.get("telefono"),
    tipo: data.get("tipo"),
    cbu: data.get("cbu"),
    monto: data.get("monto")
  };

  // Envía el usuario al servidor
  await fetch("/agregar", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(usuario)
  });

  // Limpia el formulario
  form.reset();

  // Quita estilos de validación
  form.querySelectorAll("input, select").forEach(i => i.classList.remove("is-valid"));

  // Recarga la lista de usuarios
  cargarUsuarios();
});

// Función que trae y muestra los usuarios en pantalla
async function cargarUsuarios() {
  const res = await fetch("/usuarios");
  const data = await res.json();

  const lista = document.getElementById("lista");

  // Limpia la lista antes de volver a cargarla
  lista.innerHTML = "";

  // Recorre los usuarios y los muestra
  data.forEach(u => {
    // Formatea el monto con separadores de miles (formato argentino)
    const montoFormateado = Number(u.monto).toLocaleString("es-AR");

    // Agrega cada usuario como un item de lista
    lista.innerHTML += `
      <li class="list-group-item">
        <strong>${u.nombre} ${u.apellido}</strong><br>
        DNI: ${u.dni} | Tipo: ${u.tipo}<br>
        $${montoFormateado} | Tel: ${u.telefono}<br>
        Mail: ${u.email} <br>
        CBU: ${u.cbu}
      </li>
    `;
  });
}

// Ejecuta la función al cargar la página
cargarUsuarios();