import { pool } from '../config/db.js';
import { httpError, requiredText } from '../utils/validation.js';

const statuses=['Solicitud recibida','Pendiente de diagnóstico','En diagnóstico','Presupuestada','En reparación','Esperando repuestos','Lista para entregar','Entregada','Cancelada'];
export async function listRepairs(req,res,next) {
  try {
    const role=req.user.role, id=Number(req.user.sub);
    let where='',params=[];
    if(role==='cliente'){where='WHERE r.client_id=?';params=[id];}
    else if(role==='tecnico'){where='WHERE r.technician_id=?';params=[id];}
    const [rows]=await pool.execute(
      `SELECT r.*,cu.name AS client_name,cu.email AS client_email,d.type,d.brand,d.model,d.serial_number,
       tu.name AS technician_name FROM repair_orders r
       JOIN users cu ON cu.id=r.client_id JOIN devices d ON d.id=r.device_id
       LEFT JOIN users tu ON tu.id=r.technician_id ${where} ORDER BY r.created_at DESC LIMIT 200`,params);
    res.json({repairs:rows});
  }catch(e){next(e);}
}
export async function createRepair(req,res,next) {
  try {
    const {device_id,problem}=req.body||{};
    if(!Number.isInteger(Number(device_id))||!requiredText(problem,4000)) throw httpError(400,'Elegí un dispositivo y describí el problema.');
    const [devices]=await pool.execute('SELECT id FROM devices WHERE id=? AND user_id=?',[device_id,req.user.sub]);
    if(!devices.length) throw httpError(404,'Dispositivo no encontrado.');
    const [result]=await pool.execute('INSERT INTO repair_orders (client_id,device_id,problem,status) VALUES (?,?,?,?)',
      [req.user.sub,device_id,problem.trim(),statuses[0]]);
    await pool.execute('INSERT INTO repair_history (repair_id,actor_id,old_status,new_status,comment) VALUES (?,?,?,?,?)',
      [result.insertId,req.user.sub,null,statuses[0],'Solicitud creada por el cliente.']);
    res.status(201).json({id:result.insertId,message:'Solicitud creada.'});
  }catch(e){next(e);}
}
export async function updateRepair(req,res,next) {
  const conn=await pool.getConnection();
  try {
    const id=Number(req.params.id), {status,diagnosis,budget,notes,technician_id,comment}=req.body||{};
    await conn.beginTransaction();
    const [rows]=await conn.execute('SELECT * FROM repair_orders WHERE id=? FOR UPDATE',[id]);
    if(!rows.length) throw httpError(404,'Orden no encontrada.');
    const repair=rows[0];
    if(req.user.role==='tecnico' && Number(repair.technician_id)!==Number(req.user.sub)) throw httpError(403,'La orden no está asignada a tu usuario.');
    if(req.user.role==='cliente') throw httpError(403,'El cliente no puede editar la orden.');
    if(status && !statuses.includes(status)) throw httpError(400,'Estado inválido.');
    const oldStatus=repair.status, newStatus=status||oldStatus;
    const nextTech=technician_id===undefined?repair.technician_id:(technician_id===null?null:Number(technician_id));
    if(technician_id!==undefined && req.user.role!=='admin') throw httpError(403,'Solo administración puede asignar técnicos.');
    if(nextTech!==null && technician_id!==undefined){
      const [tech]=await conn.execute(`SELECT u.id FROM users u JOIN roles r ON r.id=u.role_id WHERE u.id=? AND r.name='tecnico' AND u.active=1`,[nextTech]);
      if(!tech.length) throw httpError(400,'El usuario asignado no es un técnico activo.');
    }
    const nextDiagnosis=diagnosis===undefined?repair.diagnosis:diagnosis;
    const nextBudget=budget===undefined?repair.budget:(budget===null?null:Number(budget));
    if(nextBudget!==null && (!Number.isFinite(Number(nextBudget))||Number(nextBudget)<0)) throw httpError(400,'Presupuesto inválido.');
    const nextNotes=notes===undefined?repair.notes:notes;
    await conn.execute('UPDATE repair_orders SET status=?,diagnosis=?,budget=?,notes=?,technician_id=? WHERE id=?',
      [newStatus,nextDiagnosis,nextBudget,nextNotes,nextTech,id]);
    if(newStatus!==oldStatus || comment || diagnosis!==undefined || budget!==undefined || technician_id!==undefined){
      await conn.execute('INSERT INTO repair_history (repair_id,actor_id,old_status,new_status,comment) VALUES (?,?,?,?,?)',
        [id,req.user.sub,oldStatus,newStatus,comment||null]);
    }
    await conn.commit();
    res.json({message:'Orden actualizada.',id,status:newStatus});
  }catch(e){await conn.rollback();next(e);}finally{conn.release();}
}
export async function repairHistory(req,res,next) {
  try {
    const id=Number(req.params.id);
    const [orders]=await pool.execute('SELECT client_id,technician_id FROM repair_orders WHERE id=?',[id]);
    if(!orders.length) throw httpError(404,'Orden no encontrada.');
    const o=orders[0];
    if(req.user.role==='cliente' && Number(o.client_id)!==Number(req.user.sub)) throw httpError(403,'Sin acceso a esta orden.');
    if(req.user.role==='tecnico' && Number(o.technician_id)!==Number(req.user.sub)) throw httpError(403,'Sin acceso a esta orden.');
    const [rows]=await pool.execute(`SELECT h.*,u.name AS actor_name FROM repair_history h JOIN users u ON u.id=h.actor_id WHERE h.repair_id=? ORDER BY h.created_at ASC`,[id]);
    res.json({history:rows});
  }catch(e){next(e);}
}
export async function stats(req,res,next) {
  try{
    const [counts]=await pool.execute('SELECT status,COUNT(*) AS total FROM repair_orders GROUP BY status');
    const [users]=await pool.execute(`SELECT r.name AS role,COUNT(*) AS total FROM users u JOIN roles r ON r.id=u.role_id GROUP BY r.name`);
    res.json({repairsByStatus:counts,usersByRole:users});
  }catch(e){next(e);}
}
