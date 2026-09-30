import mysql from "mysql2/promise";
import "dotenv/config";

/**
 * Pool de conexiones a MySQL. Se reutiliza en toda la app en vez de abrir
 * una conexión nueva por request (más eficiente y evita agotar conexiones).
 */
export const pool = mysql.createPool({
  host: process.env.DB_HOST,
  port: Number(process.env.DB_PORT || 3306),
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  waitForConnections: true,
  connectionLimit: 10,
});
