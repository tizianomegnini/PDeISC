import seed from "../data/seed.json";

const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL?.replace(/\/$/, "");
const SUPABASE_KEY = import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY;
const ADMIN_EMAIL = import.meta.env.VITE_SUPABASE_ADMIN_EMAIL?.trim().toLowerCase();
const SESSION_KEY = "portfolio-supabase-session";
const DOCUMENT_ID = "main";

export const isApiConfigured = Boolean(SUPABASE_URL && SUPABASE_KEY);

const clone = (value) => JSON.parse(JSON.stringify(value));

function requireConfiguration() {
  if (!isApiConfigured) {
    throw new Error("Falta configurar Supabase. Revisá las variables de entorno del proyecto.");
  }
}

function readStoredSession() {
  try {
    return JSON.parse(localStorage.getItem(SESSION_KEY) || "null");
  } catch {
    return null;
  }
}

function saveSession(session) {
  try {
    localStorage.setItem(SESSION_KEY, JSON.stringify(session));
  } catch {
    throw new Error("No se pudo guardar la sesión en este navegador.");
  }
}

function clearStoredSession() {
  try {
    localStorage.removeItem(SESSION_KEY);
  } catch {
    // La sesión del servidor sigue siendo la autoridad.
  }
}

async function request(path, { method = "GET", body, accessToken, prefer } = {}) {
  requireConfiguration();
  const response = await fetch(`${SUPABASE_URL}${path}`, {
    method,
    headers: {
      apikey: SUPABASE_KEY,
      ...(accessToken ? { Authorization: `Bearer ${accessToken}` } : {}),
      ...(body === undefined ? {} : { "Content-Type": "application/json" }),
      ...(prefer ? { Prefer: prefer } : {}),
    },
    ...(body === undefined ? {} : { body: JSON.stringify(body) }),
  });

  const text = await response.text();
  let result = null;
  try {
    result = text ? JSON.parse(text) : null;
  } catch {
    result = text;
  }
  if (!response.ok) {
    throw new Error(result?.msg || result?.message || result?.error_description || result?.error || `Supabase respondió ${response.status}.`);
  }
  return result;
}

async function getSession() {
  requireConfiguration();
  let session = readStoredSession();
  if (!session?.access_token) return null;

  if (session.expires_at && session.expires_at * 1000 < Date.now() + 60_000) {
    try {
      session = await request("/auth/v1/token?grant_type=refresh_token", {
        method: "POST",
        body: { refresh_token: session.refresh_token },
      });
      session.expires_at = Math.floor(Date.now() / 1000) + (session.expires_in || 3600);
      saveSession(session);
    } catch {
      clearStoredSession();
      return null;
    }
  }
  return session;
}

async function getDocument(accessToken) {
  const rows = await request(`/rest/v1/portfolio_content?id=eq.${DOCUMENT_ID}&select=content`, { accessToken });
  return rows?.[0]?.content ?? null;
}

async function saveDocument(content, accessToken) {
  await request("/rest/v1/portfolio_content?on_conflict=id", {
    method: "POST",
    body: { id: DOCUMENT_ID, content },
    accessToken,
    prefer: "resolution=merge-duplicates,return=minimal",
  });
}

function mergedSeed(data) {
  return { ...clone(seed), ...(data || {}) };
}

const RESOURCES = {
  skills: { columns: ["group_name", "name", "level", "sort_order"], json: [], order: "sort" },
  experience: { columns: ["role", "org", "period", "description", "tags"], json: ["tags"], order: "idDesc" },
  achievements: { columns: ["value", "label", "detail"], json: [], order: "idDesc" },
  projects: { columns: ["title", "description", "category", "tags", "repo_url", "demo_url"], json: ["tags"], order: "idDesc" },
};
const PROFILE_COLUMNS = ["name", "role", "location", "summary", "bio", "email", "github", "linkedin", "facts"];

function sorted(name, rows) {
  const copy = [...rows];
  return RESOURCES[name].order === "sort"
    ? copy.sort((a, b) => (a.sort_order ?? 0) - (b.sort_order ?? 0) || a.id - b.id)
    : copy.sort((a, b) => b.id - a.id);
}

function pickColumns(resource, body = {}) {
  const row = {};
  resource.columns.forEach((col) => {
    const value = body[col];
    row[col] = resource.json.includes(col) ? (Array.isArray(value) ? value : []) : value ?? null;
  });
  return row;
}

export function getToken() {
  return readStoredSession()?.access_token || null;
}

export function setToken() {
  // apiLogin persists the complete Supabase session, including its refresh token.
}

export function clearToken() {
  const session = readStoredSession();
  clearStoredSession();
  if (session?.access_token && isApiConfigured) {
    void request("/auth/v1/logout", { method: "POST", accessToken: session.access_token }).catch(() => {});
  }
}

export async function apiGet(path) {
  const name = path.replace(/^\//, "");
  if (name !== "profile" && !RESOURCES[name]) throw new Error(`Recurso desconocido: ${path}`);
  const data = mergedSeed(await getDocument());
  if (name === "profile") return clone(data.profile ?? null);
  return clone(sorted(name, data[name] ?? []));
}

export async function apiAuthed(path, method, body) {
  const session = await getSession();
  if (!session) throw new Error("La sesión venció. Volvé a ingresar.");
  if (ADMIN_EMAIL && session.user?.email?.toLowerCase() !== ADMIN_EMAIL) {
    clearToken();
    throw new Error("La cuenta autenticada no es el administrador configurado.");
  }
  if (path === "/admin/me" && method === "GET") return { ok: true };

  const [name, id] = path.replace(/^\//, "").split("/");
  const document = mergedSeed(await getDocument(session.access_token));
  if (name === "profile") {
    if (method !== "PUT") throw new Error(`Método no soportado: ${method}`);
    const profile = {};
    PROFILE_COLUMNS.forEach((col) => {
      const value = body?.[col];
      profile[col] = col === "bio" || col === "facts" ? (Array.isArray(value) ? value : []) : value ?? "";
    });
    document.profile = { id: 1, ...profile };
  } else {
    const resource = RESOURCES[name];
    if (!resource) throw new Error(`Recurso desconocido: ${path}`);
    const rows = document[name] ?? [];
    if (method === "POST") {
      const newId = rows.reduce((max, row) => Math.max(max, row.id), 0) + 1;
      document[name] = [...rows, { id: newId, ...pickColumns(resource, body) }];
      await saveDocument(document, session.access_token);
      return { id: newId };
    }
    const numericId = Number(id);
    if (method === "PUT") document[name] = rows.map((row) => row.id === numericId ? { id: row.id, ...pickColumns(resource, body) } : row);
    else if (method === "DELETE") document[name] = rows.filter((row) => row.id !== numericId);
    else throw new Error(`Método no soportado: ${method}`);
  }
  await saveDocument(document, session.access_token);
  return { ok: true };
}

export async function apiLogin(password) {
  if (!password) throw new Error("Falta la contraseña.");
  if (!ADMIN_EMAIL) throw new Error("Falta VITE_SUPABASE_ADMIN_EMAIL en la configuración.");
  const session = await request("/auth/v1/token?grant_type=password", {
    method: "POST",
    body: { email: ADMIN_EMAIL, password },
  });
  if (session.user?.email?.toLowerCase() !== ADMIN_EMAIL) {
    await request("/auth/v1/logout", { method: "POST", accessToken: session.access_token }).catch(() => {});
    throw new Error("La cuenta autenticada no coincide con el administrador configurado.");
  }
  session.expires_at = Math.floor(Date.now() / 1000) + (session.expires_in || 3600);
  saveSession(session);
  return session.access_token;
}

export async function exportData() {
  return mergedSeed(await getDocument());
}

export async function importData(data) {
  if (!data || typeof data !== "object" || typeof data.profile !== "object") {
    throw new Error("El archivo no tiene el formato esperado.");
  }
  const next = { profile: data.profile };
  for (const name of Object.keys(RESOURCES)) {
    if (!Array.isArray(data[name])) throw new Error(`Falta la lista "${name}" en el archivo.`);
    next[name] = data[name];
  }
  const session = await getSession();
  if (!session) throw new Error("La sesión venció. Volvé a ingresar.");
  await saveDocument(next, session.access_token);
}

export async function resetData() {
  const session = await getSession();
  if (!session) throw new Error("La sesión venció. Volvé a ingresar.");
  await saveDocument(clone(seed), session.access_token);
}
