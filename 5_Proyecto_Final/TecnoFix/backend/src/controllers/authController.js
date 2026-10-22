import bcrypt from 'bcryptjs';
import { pool } from '../config/db.js';
import { signAccessToken, createRefreshToken, hashToken } from '../utils/tokens.js';
import { emailOk, requiredText, httpError } from '../utils/validation.js';

async function findUserByEmail(email) {
  const [rows] = await pool.execute(
    `SELECT u.id,u.name,u.email,u.password_hash,u.active,r.name AS role
     FROM users u JOIN roles r ON r.id=u.role_id WHERE u.email=? LIMIT 1`, [email]);
  return rows[0];
}
export async function register(req, res, next) {
  try {
    const { name, email, password, phone } = req.body || {};
    if (!requiredText(name,120) || !emailOk(email) || typeof password !== 'string' || password.length < 8) {
      throw httpError(400, 'Ingresá nombre, email válido y contraseña de al menos 8 caracteres.');
    }
    const normalized = email.trim().toLowerCase();
    if (await findUserByEmail(normalized)) throw httpError(409, 'Ese email ya está registrado.');
    const [roles] = await pool.execute('SELECT id FROM roles WHERE name=?', ['cliente']);
    const hash = await bcrypt.hash(password, 12);
    const [result] = await pool.execute(
      'INSERT INTO users (role_id,name,email,password_hash,phone) VALUES (?,?,?,?,?)',
      [roles[0].id, name.trim(), normalized, hash, typeof phone === 'string' ? phone.trim() : null]);
    const user = { id: result.insertId, name: name.trim(), email: normalized, role: 'cliente' };
    res.status(201).json({ user, accessToken: signAccessToken(user) });
  } catch (e) { next(e); }
}
export async function login(req, res, next) {
  try {
    const { email, password } = req.body || {};
    if (!emailOk(email) || typeof password !== 'string') throw httpError(400, 'Email y contraseña son obligatorios.');
    const user = await findUserByEmail(email.trim().toLowerCase());
    if (!user || !user.active || !(await bcrypt.compare(password, user.password_hash))) {
      throw httpError(401, 'Email o contraseña incorrectos.');
    }
    const safe = { id:user.id, name:user.name, email:user.email, role:user.role };
    const accessToken = signAccessToken(safe);
    const refreshToken = createRefreshToken();
    const days = Number(process.env.REFRESH_TOKEN_DAYS || 14);
    const expiry = new Date(Date.now() + days * 86400000);
    await pool.execute('INSERT INTO sessions (user_id,refresh_token_hash,expires_at) VALUES (?,?,?)',
      [user.id, hashToken(refreshToken), expiry]);
    res.json({ user:safe, accessToken, refreshToken });
  } catch (e) { next(e); }
}
export async function refresh(req, res, next) {
  let conn;
  try {
    conn = await pool.getConnection();
    const { refreshToken } = req.body || {};
    if (typeof refreshToken !== 'string') throw httpError(400, 'Falta refreshToken.');
    await conn.beginTransaction();
    const [rows] = await conn.execute(
      `SELECT s.id,s.user_id,u.name,u.email,u.active,r.name AS role
       FROM sessions s JOIN users u ON u.id=s.user_id JOIN roles r ON r.id=u.role_id
       WHERE s.refresh_token_hash=? AND s.revoked_at IS NULL AND s.expires_at>NOW() FOR UPDATE`,
      [hashToken(refreshToken)]);
    if (!rows.length || !rows[0].active) throw httpError(401, 'Refresh token inválido o vencido.');
    const row = rows[0];
    const newRefresh = createRefreshToken();
    await conn.execute('UPDATE sessions SET revoked_at=NOW() WHERE id=?', [row.id]);
    await conn.execute('INSERT INTO sessions (user_id,refresh_token_hash,expires_at) VALUES (?,?,DATE_ADD(NOW(), INTERVAL ? DAY))',
      [row.user_id, hashToken(newRefresh), Number(process.env.REFRESH_TOKEN_DAYS || 14)]);
    await conn.commit();
    const user = { id:row.user_id, name:row.name, email:row.email, role:row.role };
    res.json({ user, accessToken:signAccessToken(user), refreshToken:newRefresh });
  } catch (e) { if(conn) await conn.rollback(); next(e); }
  finally { conn?.release(); }
}
export async function logout(req, res, next) {
  try {
    const { refreshToken } = req.body || {};
    if (typeof refreshToken === 'string') {
      await pool.execute('UPDATE sessions SET revoked_at=NOW() WHERE refresh_token_hash=? AND revoked_at IS NULL', [hashToken(refreshToken)]);
    }
    res.json({ message:'Sesión cerrada.' });
  } catch (e) { next(e); }
}
