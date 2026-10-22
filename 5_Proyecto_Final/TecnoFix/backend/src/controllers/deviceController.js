import { pool } from '../config/db.js';
import { httpError, requiredText } from '../utils/validation.js';

export async function listDevices(req,res,next) {
  try {
    const isAdmin=req.user.role==='admin';
    const [rows]=await pool.execute(
      `SELECT d.*,u.name AS client_name FROM devices d JOIN users u ON u.id=d.user_id
       ${isAdmin ? '' : 'WHERE d.user_id=?'} ORDER BY d.created_at DESC`,
      isAdmin ? [] : [req.user.sub]);
    res.json({devices:rows});
  } catch(e){next(e);}
}
export async function createDevice(req,res,next) {
  try {
    const {type,brand,model,serial_number,notes}=req.body||{};
    if(!requiredText(brand,100)||!requiredText(model,120)) throw httpError(400,'Marca y modelo son obligatorios.');
    const [result]=await pool.execute('INSERT INTO devices (user_id,type,brand,model,serial_number,notes) VALUES (?,?,?,?,?,?)',
      [req.user.sub,requiredText(type,60)?type.trim():'PC',brand.trim(),model.trim(),serial_number||null,notes||null]);
    res.status(201).json({id:result.insertId,message:'Dispositivo registrado.'});
  }catch(e){next(e);}
}
