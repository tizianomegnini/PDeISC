
import mysql from "mysql2/promise";

const requiredVariables = [
  "MYSQLHOST",
  "MYSQLPORT",
  "MYSQLUSER",
  "MYSQLPASSWORD",
  "MYSQLDATABASE",
];

for (const variable of requiredVariables) {
  if (!process.env[variable]) {
    throw new Error(`Falta configurar la variable ${variable}`);
  }
}

export const pool = mysql.createPool({
  host: process.env.MYSQLHOST,
  port: Number(process.env.MYSQLPORT),
  user: process.env.MYSQLUSER,
  password: process.env.MYSQLPASSWORD,
  database: process.env.MYSQLDATABASE,
  waitForConnections: true,
  connectionLimit: 5,
  connectTimeout: 10000,
  ssl: { rejectUnauthorized: true },
});

export async function ensureSchema() {
  await pool.execute(`
    CREATE TABLE IF NOT EXISTS portfolio_content (
      id VARCHAR(32) PRIMARY KEY,
      content JSON NOT NULL,
      updated_at TIMESTAMP NOT NULL
        DEFAULT CURRENT_TIMESTAMP
        ON UPDATE CURRENT_TIMESTAMP
    )
  `);
}
