const form = document.getElementById("form");

// Inputs
const soloTexto = ["nombre", "apellido"];
const soloNumeros = ["dni", "telefono", "cbu"];

function bloquearTexto(e) {
  const tecla = e.key;
  const especiales = ["Backspace", "ArrowLeft", "ArrowRight", "Delete", "Tab"];

  if (especiales.includes(tecla)) return;

  if (!/^[A-Za-zÁÉÍÓÚáéíóúñÑ ]$/.test(tecla)) {
    e.preventDefault();
  }
}

function bloquearNumero(e) {
  const tecla = e.key;
  const especiales = ["Backspace", "ArrowLeft", "ArrowRight", "Delete", "Tab"];

  if (especiales.includes(tecla)) return;

  if (!/^[0-9]$/.test(tecla)) {
    e.preventDefault();
  }
}

// Aplicar
soloTexto.forEach(id => {
  document.getElementById(id).addEventListener("keydown", bloquearTexto);
});

soloNumeros.forEach(id => {
  document.getElementById(id).addEventListener("keydown", bloquearNumero);
});

document.querySelectorAll("input").forEach(input => {
  input.addEventListener("paste", e => {
    const texto = (e.clipboardData || window.clipboardData).getData("text");

    if (["nombre", "apellido"].includes(input.id)) {
      if (!/^[A-Za-zÁÉÍÓÚáéíóúñÑ ]+$/.test(texto)) e.preventDefault();
    }

    if (["dni", "telefono", "cbu"].includes(input.id)) {
      if (!/^[0-9]+$/.test(texto)) e.preventDefault();
    }

    // email permitido libremente
  });
});

const emailInput = document.getElementById("email");

emailInput.addEventListener("input", () => {
  const regex = /^[a-zA-Z0-9._%+-]+@(gmail|hotmail)\.com$/;

  if (regex.test(emailInput.value)) {
    emailInput.setCustomValidity("");
  } else {
    emailInput.setCustomValidity("Email inválido");
  }
});

// VALIDACIÓN VISUAL
form.querySelectorAll("input, select").forEach(input => {
  input.addEventListener("input", () => {
    if (input.checkValidity()) {
      input.classList.add("is-valid");
      input.classList.remove("is-invalid");
    } else {
      input.classList.add("is-invalid");
      input.classList.remove("is-valid");
    }
  });
});

// SUBMIT
form.addEventListener("submit", async (e) => {
  e.preventDefault();

  if (!form.checkValidity()) {
    form.classList.add("was-validated");
    return;
  }

  // 🔥 3 FORMAS
  const nombre = document.getElementById("nombre").value;
  const data = new FormData(form);
  const apellido = data.get("apellido");
  const email = document.querySelector("#email").value;

  // 🔥 evitar duplicado CBU
  const resCheck = await fetch("/usuarios");
  const usuarios = await resCheck.json();

  if (usuarios.some(u => u.cbu === data.get("cbu"))) {
    alert("Ese CBU ya está registrado");
    return;
  }

  const usuario = {
    nombre: nombre.trim(),
    apellido: apellido.trim(),
    dni: data.get("dni"),
    email: email.trim(),
    telefono: data.get("telefono"),
    tipo: data.get("tipo"),
    cbu: data.get("cbu"),
    monto: data.get("monto")
  };

  await fetch("/agregar", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(usuario)
  });

  form.reset();
  form.querySelectorAll("input, select").forEach(i => i.classList.remove("is-valid"));

  cargarUsuarios();
});

// MOSTRAR
async function cargarUsuarios() {
  const res = await fetch("/usuarios");
  const data = await res.json();

  const lista = document.getElementById("lista");
  lista.innerHTML = "";

  data.forEach(u => {
    const montoFormateado = Number(u.monto).toLocaleString("es-AR");

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

cargarUsuarios();