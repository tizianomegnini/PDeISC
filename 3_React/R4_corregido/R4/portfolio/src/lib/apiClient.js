/**
 * Cliente de la API del backend (Node + Express + MySQL).
 *
 * El proyecto funciona SIN backend configurado (usa src/data/fallbackData.js),
 * pero si completás VITE_API_URL en un archivo .env (ver .env.example), el
 * sitio público y el panel /admin van a leer y escribir en tu base MySQL
 * a través de ese backend (ver la carpeta /backend).
 */
const API_URL = (import.meta.env.VITE_API_URL || "").replace(/\/$/, "");

export const isApiConfigured = Boolean(API_URL);

const TOKEN_KEY = "portfolio-admin-token";

export function getToken() {
  return localStorage.getItem(TOKEN_KEY);
}

export function setToken(token) {
  localStorage.setItem(TOKEN_KEY, token);
}

export function clearToken() {
  localStorage.removeItem(TOKEN_KEY);
}

/** GET público, sin autenticación. Devuelve null si la petición falla. */
export async function apiGet(path) {
  if (!API_URL) throw new Error("La API no está configurada.");
  const res = await fetch(`${API_URL}${path}`);
  const data = await res.json().catch(() => null);
  if (!res.ok) {
    throw new Error(data?.error || `GET ${path} → ${res.status}`);
  }
  return data;
}

/** POST / PUT / DELETE protegidos: agregan el token de admin automáticamente. */
export async function apiAuthed(path, method, body) {
  if (!API_URL) throw new Error("La API no está configurada.");
  const res = await fetch(`${API_URL}${path}`, {
    method,
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${getToken()}`,
    },
    body: body ? JSON.stringify(body) : undefined,
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(data.error || `${method} ${path} → ${res.status}`);
  return data;
}

/** Login de edición: solo requiere la contraseña. */
export async function apiLogin(password) {
  if (!API_URL) throw new Error("La API no está configurada.");
  const res = await fetch(`${API_URL}/admin/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ password }),
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(data.error || "No se pudo desbloquear la edición.");
  return data.token;
}
