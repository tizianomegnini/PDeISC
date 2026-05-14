/**
 * Lógica Completa: Validación, Límites, Enter, Borrado y Descarga.
 */
let lista = [];
let editIdx = null;

const input = document.getElementById('inputNum');
const btnAdd = document.getElementById('addBtn');
const display = document.getElementById('display');
const feedback = document.getElementById('liveVal');
const contadorText = document.getElementById('contador');
/**
 * Lógica para el botón "Ir arriba"
 */
const btnTop = document.getElementById('scrollToTop');
// Detectar el desplazamiento del usuario
window.onscroll = () => {
    // Si baja más de 300px, mostrar botón
    if (document.body.scrollTop > 300 || document.documentElement.scrollTop > 300) {
        btnTop.style.display = "block";
    } else {
        btnTop.style.display = "none";
    }
};

// Al hacer click, subir suavemente
btnTop.addEventListener('click', () => {
    window.scrollTo({
        top: 0,
        behavior: 'smooth' // Efecto de desplazamiento suave
    });
});

const updateUI = () => {
    display.innerHTML = '';
    const total = lista.length;
    contadorText.textContent = total;

    lista.forEach((item, i) => {
        const chip = document.createElement('div');
        chip.className = 'numero-badge d-flex align-items-center gap-2 mb-2 p-2 border rounded';
        chip.innerHTML = `
            <div class="flex-grow-1">
                <strong>${item.valor}</strong><br>
                <small style="font-size:0.6rem; opacity: 0.7;">${item.fecha.split(', ')[1]}</small>
            </div>
            <button class="btn btn-sm btn-outline-warning" onclick="window.edit(${i})">✏️</button>
            <button class="btn btn-sm btn-outline-danger" onclick="window.del(${i})">🗑️</button>
        `;
        display.appendChild(chip);
    });

    // Mostrar panel de guardado solo si hay entre 10 y 20 números
    document.getElementById('actionBox').classList.toggle('show', total >= 10);
    btnAdd.disabled = (total >= 20 && editIdx === null);
};
input.addEventListener('keydown', (e) => {
    // Definimos los caracteres prohibidos
    const prohibidos = ['e', 'E', '.', '-', '+', '=',','];
    
    // Si la tecla presionada está en la lista, cancelamos el evento
    if (prohibidos.includes(e.key)) {
        e.preventDefault();
        feedback.textContent = `El carácter "${e.key}" no está permitido`;
        return;
    }

    // Permitir que la función procesar se dispare con Enter
    if (e.key === 'Enter') {
        procesar();
    }
});
const procesar = () => {
    const val = input.value;
    
    // 1. Validar que no esté vacío
    if (val === "" || isNaN(parseFloat(val))) {
        feedback.textContent = "Ingrese un número válido";
        return;
    }

    /**
     * CORRECCIÓN DEL LÍMITE:
     * Solo bloqueamos si la lista tiene 20 elementos Y NO estamos en modo edición.
     */
    if (lista.length >= 20 && editIdx === null) {
        feedback.textContent = "Límite máximo (20) alcanzado";
        return;
    }

    const ahora = new Date().toLocaleString();

    if (editIdx !== null) {
        // MODO EDICIÓN: Actualizamos el objeto en la posición guardada
        lista[editIdx] = { valor: val, fecha: ahora + " (editado)" };
        editIdx = null; // Resetear el índice de edición
        btnAdd.textContent = "Agregar";
        btnAdd.className = "btn btn-primary btn-lg";
    } else {
        // MODO NUEVO: Concatenamos al array
        lista = [...lista, { valor: val, fecha: ahora }];
    }

    // Limpieza y actualización
    input.value = '';
    feedback.textContent = '';
    updateUI();
};

// Eventos de teclado y click
btnAdd.addEventListener('click', procesar);
input.addEventListener('keydown', (e) => { if (e.key === 'Enter') procesar();});

// Globales para botones dinámicos
window.del = (i) => { lista.splice(i, 1); updateUI(); };
window.edit = (i) => {
    editIdx = i;
    input.value = lista[i].valor;
    btnAdd.textContent = "Actualizar";
    btnAdd.className = "btn btn-warning";
    input.focus();
};

// --- PERSISTENCIA Y DESCARGA ---
document.getElementById('saveBtn').addEventListener('click', async () => {
    const msg = document.getElementById('msg');
    msg.textContent = "Procesando descarga...";
    
    try {
        const res = await fetch('/guardar', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ datos: lista })
        });

        if (!res.ok) throw new Error("Error en el servidor");

        // Recibimos la respuesta como un BLOB (archivo binario)
        const blob = await res.blob();
        
        // Creamos un link invisible para forzar la descarga
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = "datos.txt"; // Nombre del archivo que verá el usuario
        document.body.appendChild(a);
        a.click(); // Simula el click
        
        // Limpieza
        window.URL.revokeObjectURL(url);
        document.body.removeChild(a);

        msg.className = "text-success fw-bold mt-2";
        msg.textContent = "✅ Archivo descargado con éxito";
    } catch (err) {
        msg.className = "text-danger mt-2";
        msg.textContent = "❌ Error al generar el archivo";
        console.error(err);
    }
});

// Tema Claro/Oscuro
document.getElementById('themeBtn').addEventListener('click', () => {
    const html = document.documentElement;
    const current = html.getAttribute('data-theme');
    html.setAttribute('data-theme', current === 'dark' ? 'light' : 'dark');
});

// Inicialización
updateUI();