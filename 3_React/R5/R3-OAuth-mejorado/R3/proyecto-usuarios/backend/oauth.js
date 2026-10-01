import crypto from 'crypto';
import { URLSearchParams } from 'url';
import pool from './db.js';
import { FRONTEND_URL } from './config.js';
import { firmarToken } from './routes/auth.js';

const CALLBACK_BASE = process.env.OAUTH_CALLBACK_BASE || `http://localhost:${process.env.PORT || 4000}/api/auth/oauth`;
const estados = new Map();
const intercambios = new Map();

function aleatorio(bytes = 32) {
  return crypto.randomBytes(bytes).toString('hex');
}

function base64url(buffer) {
  return buffer.toString('base64').replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/g, '');
}

function pkceChallenge(verifier) {
  return base64url(crypto.createHash('sha256').update(verifier).digest());
}

const proveedores = {
  google: {
    label: 'Google',
    color: '#4285F4',
    clientId: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    authorize: 'https://accounts.google.com/o/oauth2/v2/auth',
    token: 'https://oauth2.googleapis.com/token',
    userinfo: 'https://openidconnect.googleapis.com/v1/userinfo',
    scope: 'openid email profile',
    pkce: true,
    map: (u) => ({ id: u.sub, nombre: u.name || u.email?.split('@')[0], email: u.email, emailVerificado: u.email_verified === true }),
  },
  github: {
    label: 'GitHub',
    clientId: process.env.GITHUB_CLIENT_ID,
    clientSecret: process.env.GITHUB_CLIENT_SECRET,
    authorize: 'https://github.com/login/oauth/authorize',
    token: 'https://github.com/login/oauth/access_token',
    userinfo: 'https://api.github.com/user',
    scope: 'read:user user:email',
    pkce: true,
    map: (u) => ({ id: String(u.id), nombre: u.name || u.login, email: u.email, emailVerificado: Boolean(u.email) }),
    extra: async (accessToken, user) => {
      if (user.email) return user;
      const r = await fetch('https://api.github.com/user/emails', { headers: { Authorization: `Bearer ${accessToken}`, Accept: 'application/vnd.github+json', 'X-GitHub-Api-Version': '2026-03-10' } });
      if (!r.ok) throw new Error('GitHub no pudo devolver tus emails.');
      const emails = await r.json();
      const principal = emails.find((e) => e.primary && e.verified) || emails.find((e) => e.verified);
      return { ...user, email: principal?.email || user.email, email_verified: Boolean(principal?.verified) };
    },
  },
  facebook: {
    label: 'Facebook / Meta',
    clientId: process.env.FACEBOOK_CLIENT_ID,
    clientSecret: process.env.FACEBOOK_CLIENT_SECRET,
    authorize: 'https://www.facebook.com/v24.0/dialog/oauth',
    token: 'https://graph.facebook.com/v24.0/oauth/access_token',
    userinfo: 'https://graph.facebook.com/me?fields=id,name,email',
    scope: 'email,public_profile',
    map: (u) => ({ id: String(u.id), nombre: u.name, email: u.email, emailVerificado: Boolean(u.email) }),
  },
  discord: {
    label: 'Discord',
    clientId: process.env.DISCORD_CLIENT_ID,
    clientSecret: process.env.DISCORD_CLIENT_SECRET,
    authorize: 'https://discord.com/oauth2/authorize',
    token: 'https://discord.com/api/oauth2/token',
    userinfo: 'https://discord.com/api/users/@me',
    scope: 'identify email',
    map: (u) => ({ id: String(u.id), nombre: u.global_name || u.username, email: u.email, emailVerificado: u.verified === true }),
  },
  twitch: {
    label: 'Twitch',
    clientId: process.env.TWITCH_CLIENT_ID,
    clientSecret: process.env.TWITCH_CLIENT_SECRET,
    authorize: 'https://id.twitch.tv/oauth2/authorize',
    token: 'https://id.twitch.tv/oauth2/token',
    userinfo: 'https://api.twitch.tv/helix/users',
    scope: 'user:read:email',
    map: (u) => ({ id: String(u.id), nombre: u.display_name || u.login, email: u.email, emailVerificado: Boolean(u.email) }),
    headers: (token) => ({ Authorization: `Bearer ${token}`, 'Client-Id': process.env.TWITCH_CLIENT_ID }),
    extract: (body) => body.data?.[0] || {},
  },
  x: {
    label: 'X',
    clientId: process.env.X_CLIENT_ID,
    clientSecret: process.env.X_CLIENT_SECRET,
    authorize: 'https://twitter.com/i/oauth2/authorize',
    token: 'https://api.twitter.com/2/oauth2/token',
    userinfo: 'https://api.twitter.com/2/users/me?user.fields=id,name,username',
    scope: 'users.read tweet.read offline.access',
    pkce: true,
    basicTokenAuth: true,
    map: (u) => ({ id: String(u.id), nombre: u.name || u.username, email: null, emailVerificado: false }),
  },
  microsoft: {
    label: 'Microsoft',
    clientId: process.env.MICROSOFT_CLIENT_ID,
    clientSecret: process.env.MICROSOFT_CLIENT_SECRET,
    authorize: `https://login.microsoftonline.com/${process.env.MICROSOFT_TENANT_ID || 'common'}/oauth2/v2.0/authorize`,
    token: `https://login.microsoftonline.com/${process.env.MICROSOFT_TENANT_ID || 'common'}/oauth2/v2.0/token`,
    userinfo: 'https://graph.microsoft.com/oidc/userinfo',
    scope: 'openid profile email User.Read',
    pkce: true,
    map: (u) => ({ id: u.sub, nombre: u.name || u.email?.split('@')[0], email: u.email, emailVerificado: Boolean(u.email) }),
  },
  linkedin: {
    label: 'LinkedIn',
    clientId: process.env.LINKEDIN_CLIENT_ID,
    clientSecret: process.env.LINKEDIN_CLIENT_SECRET,
    authorize: 'https://www.linkedin.com/oauth/v2/authorization',
    token: 'https://www.linkedin.com/oauth/v2/accessToken',
    userinfo: 'https://api.linkedin.com/v2/userinfo',
    scope: 'openid profile email',
    pkce: true,
    map: (u) => ({ id: u.sub, nombre: u.name || u.email?.split('@')[0], email: u.email, emailVerificado: u.email_verified === true }),
  },
  spotify: {
    label: 'Spotify',
    clientId: process.env.SPOTIFY_CLIENT_ID,
    clientSecret: process.env.SPOTIFY_CLIENT_SECRET,
    authorize: 'https://accounts.spotify.com/authorize',
    token: 'https://accounts.spotify.com/api/token',
    userinfo: 'https://api.spotify.com/v1/me',
    scope: 'user-read-email user-read-private',
    map: (u) => ({ id: String(u.id), nombre: u.display_name || u.id, email: u.email, emailVerificado: Boolean(u.email) }),
  },
  gitlab: {
    label: 'GitLab',
    clientId: process.env.GITLAB_CLIENT_ID,
    clientSecret: process.env.GITLAB_CLIENT_SECRET,
    authorize: 'https://gitlab.com/oauth/authorize',
    token: 'https://gitlab.com/oauth/token',
    userinfo: 'https://gitlab.com/api/v4/user',
    scope: 'read_user',
    map: (u) => ({ id: String(u.id), nombre: u.name || u.username, email: u.email, emailVerificado: Boolean(u.confirmed_at || u.email) }),
  },
};

function disponible(provider) {
  return Boolean(provider.clientId && provider.clientSecret);
}

export function listaProveedores() {
  return Object.entries(proveedores).map(([id, p]) => ({ id, label: p.label, configurado: disponible(p) }));
}

function limpiarMapas() {
  const ahora = Date.now();
  for (const [k, v] of estados) if (v.expira < ahora) estados.delete(k);
  for (const [k, v] of intercambios) if (v.expira < ahora) intercambios.delete(k);
}

export function iniciarOAuth(providerId, req, res) {
  limpiarMapas();
  const p = proveedores[providerId];
  if (!p) return res.status(404).json({ error: 'Proveedor no soportado' });
  if (!disponible(p)) return res.status(503).json({ error: `${p.label} todavía no está configurado en backend/.env` });

  const state = aleatorio(24);
  const verifier = p.pkce ? aleatorio(48) : null;
  estados.set(state, { providerId, verifier, expira: Date.now() + 10 * 60 * 1000 });

  const params = new URLSearchParams({ client_id: p.clientId, redirect_uri: `${CALLBACK_BASE}/${providerId}/callback`, response_type: 'code', scope: p.scope, state });
  if (verifier) params.set('code_challenge', pkceChallenge(verifier)), params.set('code_challenge_method', 'S256');
  res.redirect(`${p.authorize}?${params}`);
}

async function intercambiarCodigo(p, code, redirectUri, verifier) {
  const body = new URLSearchParams({ grant_type: 'authorization_code', code, redirect_uri: redirectUri, client_id: p.clientId });
  if (verifier) body.set('code_verifier', verifier);
  const headers = { 'Content-Type': 'application/x-www-form-urlencoded', Accept: 'application/json' };
  if (p.basicTokenAuth) {
    headers.Authorization = `Basic ${Buffer.from(`${p.clientId}:${p.clientSecret}`).toString('base64')}`;
  } else {
    body.set('client_secret', p.clientSecret);
  }
  const r = await fetch(p.token, { method: 'POST', headers, body });
  const text = await r.text();
  if (!r.ok) throw new Error(`El proveedor rechazó el intercambio de código (${r.status}).`);
  const data = new URLSearchParams(text);
  if (text.trim().startsWith('{')) return JSON.parse(text);
  return Object.fromEntries(data.entries());
}

async function obtenerUsuario(p, token) {
  const headers = { Accept: 'application/json', ...(p.headers ? p.headers(token) : { Authorization: `Bearer ${token}` }) };
  const r = await fetch(p.userinfo, { headers });
  if (!r.ok) throw new Error(`No se pudo obtener el perfil del proveedor (${r.status}).`);
  const body = await r.json();
  return p.extract ? p.extract(body) : body;
}

async function autenticarUsuario(providerId, externo) {
  if (!externo.id) throw new Error('El proveedor no devolvió un identificador de usuario.');
  let email = externo.email?.trim().toLowerCase() || null;
  const nombre = (externo.nombre || `Usuario ${providerId}`).trim().slice(0, 100);

  const [identidades] = await pool.query('SELECT usuario_id FROM identidades_oauth WHERE proveedor = ? AND proveedor_id = ?', [providerId, externo.id]);
  let usuarioId = identidades[0]?.usuario_id;

  if (!usuarioId && email && externo.emailVerificado) {
    const [usuarios] = await pool.query('SELECT id FROM usuarios WHERE email = ?', [email]);
    usuarioId = usuarios[0]?.id;
  }

  if (!usuarioId) {
    // Algunos proveedores, como X, no entregan email mediante su flujo OAuth.
    // En ese caso la identidad externa sigue siendo suficiente para entrar;
    // el email del perfil queda NULL y la cuenta se puede completar después.
    const [r] = await pool.query('INSERT INTO usuarios (nombre, email, password_hash) VALUES (?, ?, NULL)', [nombre, email]);
    usuarioId = r.insertId;
  }

  await pool.query(
    `INSERT INTO identidades_oauth (usuario_id, proveedor, proveedor_id, email_proveedor, nombre_proveedor)
     VALUES (?, ?, ?, ?, ?)
     ON DUPLICATE KEY UPDATE email_proveedor = VALUES(email_proveedor), nombre_proveedor = VALUES(nombre_proveedor)`,
    [usuarioId, providerId, externo.id, email, nombre]
  );

  const [filas] = await pool.query('SELECT id, nombre, email, creado_en FROM usuarios WHERE id = ?', [usuarioId]);
  return filas[0];
}

export async function callbackOAuth(providerId, req, res) {
  limpiarMapas();
  const p = proveedores[providerId];
  const registro = estados.get(req.query.state);
  estados.delete(req.query.state);
  if (!p || !registro || registro.providerId !== providerId) return res.status(400).send('Solicitud OAuth inválida o vencida.');
  if (req.query.error) return res.redirect(`${FRONTEND_URL}/login?oauth_error=${encodeURIComponent(req.query.error_description || req.query.error)}`);

  try {
    const redirectUri = `${CALLBACK_BASE}/${providerId}/callback`;
    const tokens = await intercambiarCodigo(p, req.query.code, redirectUri, registro.verifier);
    let externo = await obtenerUsuario(p, tokens.access_token);
    if (p.extra) externo = await p.extra(tokens.access_token, externo);
    const datos = p.map(externo);
    const usuario = await autenticarUsuario(providerId, datos);
    const codigo = aleatorio(32);
    intercambios.set(codigo, { token: firmarToken(usuario.id), expira: Date.now() + 2 * 60 * 1000 });
    res.redirect(`${FRONTEND_URL}/oauth/callback?code=${codigo}`);
  } catch (err) {
    console.error(`[OAuth:${providerId}]`, err.message);
    res.redirect(`${FRONTEND_URL}/login?oauth_error=${encodeURIComponent(err.message || 'No se pudo iniciar sesión')}`);
  }
}

export function intercambiar(codigo) {
  limpiarMapas();
  const item = intercambios.get(codigo);
  if (!item) return null;
  intercambios.delete(codigo);
  return item.token;
}
