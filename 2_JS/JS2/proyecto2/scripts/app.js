/**
 * PROYECTO: ANALIZADOR DE DATOS PRO (VERSIÓN FINAL)
 * ------------------------------------------------
 * FUNCIONALIDADES:
 * 1. Validación estricta de archivos .txt (sin alertas).
 * 2. Filtro Espejo: Soporta enteros y decimales con un solo punto (inicio == fin).
 * 3. Validación de Precisión: Comas prohibidas y máximo un punto intermedio.
 * 4. Galería Global de Factoriales: Solo para números enteros válidos.
 * 5. UX: Modo oscuro persistente, bloqueo de carga única y scroll dinámico.
 */

// --- SELECTORES DEL DOM ---
const fileInput = document.getElementById('fileInput');
const dropZone = document.getElementById('dropZone');
const errorFeedback = document.getElementById('errorFeedback');
const errorText = document.getElementById('errorText');
const resultados = document.getElementById('resultados');
const resetBtn = document.getElementById('resetBtn');
const themeBtn = document.getElementById('themeBtn');
const btnTop = document.getElementById('scrollToTop');

// --- VARIABLES GLOBALES DE ESTADO ---
window.reporteFinal = ""; 

// --- FUNCIONES DE VALIDACIÓN Y MATEMÁTICAS ---

/**
 * Valida el formato del número según las nuevas reglas:
 * - Prohibido el uso de comas.
 * - Máximo un punto y debe estar entre dígitos.
 * @param {string} s - Cadena a evaluar.
 * @returns {boolean}
 */
const esFormatoValido = (s) => {
    // Si contiene comas, es inválido inmediatamente
    if (s.includes(',')) return false;
    // Regex: Solo dígitos o dígitos con un único punto decimal intermedio
    return /^\d+(\.\d+)?$/.test(s);
};

/**
 * Determina si un número es un factorial perfecto (n!).
 * Solo aplica a números enteros.
 * @param {number} num - El número a evaluar.
 * @returns {boolean}
 */
const esFactorial = (num) => {
    if (num < 1 || !Number.isInteger(num)) return false;
    let res = 1, i = 1;
    while (res < num) {
        i++;
        res *= i;
    }
    return res === num;
};

/**
 * Obtiene la raíz de un factorial (ej. 120 -> 5!).
 * @param {number} n - El número factorial.
 * @returns {string}
 */
const obtenerRaizFactorial = (n) => {
    let res = 1, i = 1;
    while (res < n) { i++; res *= i; }
    return `${i}!`;
};

// --- FUNCIONES DE INTERFAZ (UI) ---

/**
 * Muestra un mensaje de error dinámico en la interfaz.
 */
const gestionarError = (mensaje) => {
    errorText.textContent = mensaje;
    errorFeedback.classList.remove('d-none');
    fileInput.value = ""; 
    setTimeout(() => {
        errorFeedback.classList.add('d-none');
    }, 5000);
};

/**
 * Renderiza los resultados procesados en las galerías.
 */
const renderizarResultados = (utiles, noUtil, facts, total) => {
    dropZone.classList.add('disabled');
    document.getElementById('uploadUI').classList.add('d-none');
    document.getElementById('successUI').classList.remove('d-none');
    resetBtn.classList.remove('d-none');
    resultados.classList.remove('d-none');

    document.getElementById('contUtil').textContent = utiles.length;
    document.getElementById('contNoUtil').textContent = noUtil;
    
    // Cálculo de porcentaje sobre el total procesado (válidos + inválidos)
    const totalReal = total || 1;
    document.getElementById('percUtil').textContent = ((utiles.length / totalReal) * 100).toFixed(1) + "%";
    document.getElementById('contFact').textContent = facts.length;

    // Galería 1: Números Útiles (Espejos)
    utiles.sort((a, b) => parseFloat(a) - parseFloat(b));
    const listaUtiles = document.getElementById('listaFiltrada');
    listaUtiles.innerHTML = utiles.map((n, idx) => {
        const valorNumerico = parseFloat(n);
        const isFact = !n.includes('.') && facts.includes(valorNumerico);
        return `
            <span class="badge ${isFact ? 'bg-success' : 'bg-primary'} p-2 border shadow-sm badge-anim" 
                  style="animation-delay: ${idx * 0.05}s">
                ${n} ${isFact ? '⭐' : ''}
            </span>
        `;
    }).join('') || '<small class="text-muted">No hay números espejo válidos.</small>';

    // Galería 2: Factoriales (Solo enteros)
    const factsUnicos = [...new Set(facts)].sort((a, b) => a - b);
    const listaFacts = document.getElementById('listaFactoriales');
    listaFacts.innerHTML = factsUnicos.map(n => `
        <span class="badge bg-dark text-success border border-success p-2 badge-anim">
            ${n} <small class="text-white-50">(${obtenerRaizFactorial(n)})</small>
        </span>
    `).join('') || '<small class="text-muted">No se hallaron factoriales enteros.</small>';

    window.reporteFinal = `REPORTE DE ANÁLISIS DE PRECISIÓN\n` +
        `Total procesados: ${totalReal}\n` +
        `Útiles (Espejo): ${utiles.join(', ')}\n` +
        `Factoriales: ${factsUnicos.join(', ')}`;
};

// --- LÓGICA DE PROCESAMIENTO ---

const procesarArchivo = (archivo) => {
    if (!archivo.name.toLowerCase().endsWith('.txt')) {
        gestionarError(`El archivo "${archivo.name}" no es un .txt válido.`);
        return;
    }

    const lector = new FileReader();
    lector.onload = (e) => {
        const tokens = e.target.result.split(/\s+/);
        
        let utiles = [];
        let noUtiles = 0;
        let factoriales = [];
        let contadorTotal = 0;

        tokens.forEach(t => {
            const token = t.trim();
            if (token === "") return;

            contadorTotal++;

            // Validar formato (Puntos sí, Comas no)
            if (esFormatoValido(token)) {
                // Regla Espejo: primer carácter igual al último (ej: 1.231)
                if (token.length >= 2 && token[0] === token[token.length - 1]) {
                    utiles.push(token);
                } else {
                    noUtiles++;
                }

                // Factoriales: solo si es un número entero (sin punto)
                if (!token.includes('.')) {
                    const n = parseInt(token);
                    if (esFactorial(n)) factoriales.push(n);
                }
            } else {
                // Si tiene comas o puntos mal puestos, es inútil
                noUtiles++;
            }
        });

        if (contadorTotal === 0) {
            gestionarError("El archivo está vacío o no contiene datos.");
            return;
        }

        renderizarResultados(utiles, noUtiles, factoriales, contadorTotal);
    };
    lector.readAsText(archivo);
};

// --- EVENTOS ---

dropZone.addEventListener('click', () => fileInput.click());

fileInput.addEventListener('change', (e) => {
    const file = e.target.files[0];
    if (file) procesarArchivo(file);
});

resetBtn.addEventListener('click', () => location.reload());

document.getElementById('btnExportar').addEventListener('click', async () => {
    if (!window.reporteFinal) return;
    try {
        const res = await fetch('/exportar-filtrado', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ reporte: window.reporteFinal })
        });
        const blob = await res.blob();
        const a = document.createElement('a');
        a.href = URL.createObjectURL(blob);
        a.download = "analisis_precision.txt";
        a.click();
    } catch (err) {
        console.error("Error al exportar:", err);
    }
});

// --- PERSISTENCIA Y UI EXTRA ---

const temaGuardado = localStorage.getItem('theme') || 'light';
document.documentElement.setAttribute('data-theme', temaGuardado);

themeBtn.addEventListener('click', () => {
    const actual = document.documentElement.getAttribute('data-theme');
    const nuevo = actual === 'dark' ? 'light' : 'dark';
    document.documentElement.setAttribute('data-theme', nuevo);
    localStorage.setItem('theme', nuevo);
});

window.addEventListener('scroll', () => {
    btnTop.style.display = window.scrollY > 400 ? 'block' : 'none';
});

btnTop.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
});