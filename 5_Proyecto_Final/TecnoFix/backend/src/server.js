import dotenv from 'dotenv';
dotenv.config();
import app from './app.js';
import { pool } from './config/db.js';
const port=Number(process.env.PORT||4000);
try {
  await pool.query('SELECT 1');
  console.log('MySQL conectado.');
} catch(e) {
  console.error('No se pudo conectar a MySQL. Revisá backend/.env y database/schema.sql.',e.message);
  process.exit(1);
}
app.listen(port,'0.0.0.0',()=>console.log(`TecnoFix API escuchando en http://0.0.0.0:${port}/api`));
