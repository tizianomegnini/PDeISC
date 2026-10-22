import { pool } from '../config/db.js';
import { httpError, emailOk, requiredText } from '../utils/validation.js';
import bcrypt from 'bcryptjs';

export async function me(req,res,next) {
  try {
    const [rows] = await pool.execute('SELECT id,name,email,phone,created_at FROM users WHERE id=?', [req.user.sub]);
    if (!rows.length) throw httpError(404,'Usuario no encontrado.');
    res.json({ user: rows[0] });
  } catch(e) { next(e); }
}
export async function listUsers(req,res,next) {
  try {
    const [rows] = await pool.execute(
      `SELECT u.id,u.name,u.email,u.phone,u.active,r.name AS role,u.created_at
       FROM users u JOIN roles r ON r.id=u.role_id ORDER BY u.created_at DESC LIMIT 200`);
    res.json({ users:rows });
  } catch(e) { next(e); }
}
export async function createUser(req,res,next) {
  try {
    const {name,email,password,role,phone} = req.body || {};
    if (!requiredText(name,120) || !emailOk(email) || typeof password!=='string' || password.length<8 ||
        !['admin','tecnico','cliente'].includes(role)) throw httpError(400,'Datos inválidos; revisá nombre, email, contraseña y rol.');
    const [existing] = await pool.execute('SELECT id FROM users WHERE email=?',[email.trim().toLowerCase()]);
    if (existing.length) throw httpError(409,'Email ya registrado.');
    const [roles] = await pool.execute('SELECT id FROM roles WHERE name=?',[role]);
    const hash=await bcrypt.hash(password,12);
    const [result] = await pool.execute('INSERT INTO users (role_id,name,email,password_hash,phone) VALUES (?,?,?,?,?)',
      [roles[0].id,name.trim(),email.trim().toLowerCase(),hash,phone||null]);
    res.status(201).json({id:result.insertId,name:name.trim(),email:email.trim().toLowerCase(),role});
  } catch(e) { next(e); }
}
