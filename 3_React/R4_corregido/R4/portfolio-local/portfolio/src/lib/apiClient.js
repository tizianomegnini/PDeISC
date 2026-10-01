/**
 * Base de datos local del portfolio (sin backend, sin MySQL, sin puertos).
 *
 * Todo el contenido vive en el navegador (localStorage) y arranca desde
 * src/data/seed.json. Mantiene la misma interfaz que tenía el cliente HTTP
 * (apiGet / apiAuthed / apiLogin) para que los editores y el hook
 * usePortfolioData sigan funcionando igual.
 *
 * Cómo se publican los cambios:
 *  1. Editás el contenido desde el sitio (botones "✎ Editar").
 *  2. Abrís el panel "Datos" (botón flotante) y hacés "Exportar".
 *  3. Reemplazás src/data/seed.json con el archivo exportado y hacés push:
 *     Vercel vuelve a desplegar y todos los visitantes ven lo nuevo.
 *
 * IMPORTANTE: la contraseña se verifica en el navegador, así que es solo un
 * candado "suave". Los cambios hechos desde el sitio solo se guardan en el
 * navegador de quien edita; no afectan a los demás visitantes.
 */
import seed from "../data/seed.json";

export const isApiConfigured = true;

const DATA_KEY = "portfolio-data-v1";
const TOKEN_KEY = "portfolio-admin-token";
const SESSION_VALUE = "local-session";

// SHA-256 de la contraseña de edición. Por defecto corresponde a "Admin123!".
// Para cambiarla: `npm run hash-password` y poné el resultado en
// VITE_ADMIN_PASSWORD_HASH (archivo .env y variables de entorno de Vercel).
const DEFAULT_PASSWORD_HASH = "3eb3fe66b31e3b4d10fa70b5cad49c7112294af6ae4e476a1c405155d45aa121";
const PASSWORD_HASH = (import.meta.env.VITE_ADMIN_PASSWORD_HASH || DEFAULT_PASSWORD_HASH).toLowerCase();

// Recursos con CRUD estándar: columnas editables, columnas de tipo lista y orden al listar.
const RESOURCES = {
  skills: { columns: ["group_name", "name", "level", "sort_order"], json: [], order: "sort" },
  experience: { columns: ["role", "org", "period", "description", "tags"], json: ["tags"], order: "idDesc" },
  achievements: { columns: ["value", "label", "detail"], json: [], order: "idDesc" },
  projects: { columns: ["title", "description", "category", "tags", "repo_url", "demo_url"], json: ["tags"], order: "idDesc" },
};

const PROFILE_COLUMNS = ["name", "role", "location", "summary", "bio", "email", "github", "linkedin", "facts"];

const clone = (value) => JSON.parse(JSON.stringify(value));

/* ------------------------------ almacenamiento ------------------------------ */

function loadStore() {
  try {
    const raw = localStorage.getItem(DATA_KEY);
    if (raw) {
      const saved = JSON.parse(raw);
      // Completa con el seed cualquier clave que falte.
      return { ...clone(seed), ...saved };
    }
  } catch {
    // localStorage bloqueado o JSON dañado: se vuelve al seed.
  }
  return clone(seed);
}

function saveStore(store) {
  try {
    localStorage.setItem(DATA_KEY, JSON.stringify(store));
  } catch {
    throw new Error("No se pudo guardar en el navegador (¿almacenamiento bloqueado o lleno?).");
  }
}

/* ---------------------------------- helpers --------------------------------- */

function sortRows(name, rows) {
  const order = RESOURCES[name].order;
  const copy = [...rows];
  if (order === "sort") {
    return copy.sort((a, b) => (a.sort_order ?? 0) - (b.sort_order ?? 0) || a.id - b.id);
  }
  return copy.sort((a, b) => b.id - a.id);
}

function pickColumns(resource, body = {}) {
  const row = {};
  resource.columns.forEach((col) => {
    const value = body[col];
    row[col] = resource.json.includes(col) ? (Array.isArray(value) ? value : []) : value ?? null;
  });
  return row;
}

async function sha256Hex(text) {
  if (!globalThis.crypto?.subtle) {
    throw new Error("Este navegador no permite verificar la contraseña (hace falta HTTPS o localhost).");
  }
  const bytes = new TextEncoder().encode(text);
  const digest = await crypto.subtle.digest("SHA-256", bytes);
  return Array.from(new Uint8Array(digest))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
}

/* ----------------------------------- sesión ---------------------------------- */

export function getToken() {
  try {
    return localStorage.getItem(TOKEN_KEY);
  } catch {
    return null;
  }
}

export function setToken(token) {
  try {
    localStorage.setItem(TOKEN_KEY, token);
  } catch {
    // Sin storage la sesión dura hasta recargar; no es un error crítico.
  }
}

export function clearToken() {
  try {
    localStorage.removeItem(TOKEN_KEY);
  } catch {
    // nada que limpiar
  }
}

/* ------------------------------------ API ------------------------------------ */

/** Lectura pública. Paths: "/profile", "/skills", "/experience", "/achievements", "/projects". */
export async function apiGet(path) {
  const store = loadStore();
  const name = path.replace(/^\//, "");

  if (name === "profile") return clone(store.profile ?? null);
  if (RESOURCES[name]) return clone(sortRows(name, store[name] ?? []));

  throw new Error(`Recurso desconocido: ${path}`);
}

/** Escritura (POST / PUT / DELETE) y GET /admin/me. Exige haber desbloqueado la edición. */
export async function apiAuthed(path, method, body) {
  if (getToken() !== SESSION_VALUE) throw new Error("No autenticado.");

  const [name, id] = path.replace(/^\//, "").split("/");

  if (name === "admin" && id === "me") return { ok: true };

  const store = loadStore();

  if (name === "profile") {
    if (method !== "PUT") throw new Error(`Método no soportado: ${method}`);
    const next = {};
    PROFILE_COLUMNS.forEach((col) => {
      const value = body?.[col];
      next[col] = col === "bio" || col === "facts" ? (Array.isArray(value) ? value : []) : value ?? "";
    });
    store.profile = { id: 1, ...next };
    saveStore(store);
    return { ok: true };
  }

  const resource = RESOURCES[name];
  if (!resource) throw new Error(`Recurso desconocido: ${path}`);

  const rows = store[name] ?? [];

  if (method === "POST") {
    const newId = rows.reduce((max, r) => Math.max(max, r.id), 0) + 1;
    store[name] = [...rows, { id: newId, ...pickColumns(resource, body) }];
    saveStore(store);
    return { id: newId };
  }

  const numericId = Number(id);

  if (method === "PUT") {
    store[name] = rows.map((r) => (r.id === numericId ? { id: r.id, ...pickColumns(resource, body) } : r));
    saveStore(store);
    return { ok: true };
  }

  if (method === "DELETE") {
    store[name] = rows.filter((r) => r.id !== numericId);
    saveStore(store);
    return { ok: true };
  }

  throw new Error(`Método no soportado: ${method}`);
}

/** Login de edición: compara el SHA-256 de la contraseña con el configurado. */
export async function apiLogin(password) {
  if (!password) throw new Error("Falta la contraseña.");
  const hash = await sha256Hex(password);
  if (hash !== PASSWORD_HASH) throw new Error("Contraseña incorrecta.");
  return SESSION_VALUE;
}

/* ------------------------- exportar / importar / reset ------------------------ */

/** Devuelve todo el contenido actual (mismo formato que src/data/seed.json). */
export function exportData() {
  return clone(loadStore());
}

/** Reemplaza el contenido por el de un JSON exportado. Valida la estructura básica. */
export function importData(data) {
  if (!data || typeof data !== "object" || typeof data.profile !== "object") {
    throw new Error("El archivo no tiene el formato esperado.");
  }
  const next = { profile: data.profile };
  for (const name of Object.keys(RESOURCES)) {
    if (!Array.isArray(data[name])) throw new Error(`Falta la lista "${name}" en el archivo.`);
    next[name] = data[name];
  }
  saveStore(next);
}

/** Descarta los cambios hechos en este navegador y vuelve a src/data/seed.json. */
export function resetData() {
  try {
    localStorage.removeItem(DATA_KEY);
  } catch {
    // nada que limpiar
  }
}
