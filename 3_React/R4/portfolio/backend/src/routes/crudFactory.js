import { Router } from "express";
import { pool } from "../db.js";
import { requireAuth } from "../auth.js";

/**
 * createCrudRouter
 * -----------------
 * Genera un router de Express con las 4 operaciones básicas (listar, crear,
 * actualizar, borrar) para una tabla dada, evitando repetir el mismo código
 * para skills, experience, achievements y projects.
 *
 * @param {string} table - nombre de la tabla en MySQL.
 * @param {string[]} columns - columnas editables de la tabla (sin "id").
 * @param {string[]} jsonColumns - subconjunto de "columns" que son de tipo JSON
 *        (por ejemplo "tags"), para serializarlas antes de guardarlas.
 * @param {string} orderBy - cláusula ORDER BY usada al listar.
 */
export function createCrudRouter({ table, columns, jsonColumns = [], orderBy = "id DESC" }) {
  const router = Router();

  function toDbRow(body) {
    const row = {};
    columns.forEach((col) => {
      const value = body[col];
      row[col] = jsonColumns.includes(col) ? JSON.stringify(value ?? []) : value ?? null;
    });
    return row;
  }

  // Lectura: pública, la necesita cualquier visitante del portfolio.
  router.get("/", async (req, res) => {
    const [rows] = await pool.query(`SELECT * FROM ${table} ORDER BY ${orderBy}`);
    res.json(rows);
  });

  // Escritura: protegida con JWT (ver src/auth.js).
  router.post("/", requireAuth, async (req, res) => {
    const row = toDbRow(req.body);
    const fields = Object.keys(row);
    const placeholders = fields.map(() => "?").join(", ");
    const [result] = await pool.query(
      `INSERT INTO ${table} (${fields.join(", ")}) VALUES (${placeholders})`,
      fields.map((f) => row[f])
    );
    res.status(201).json({ id: result.insertId });
  });

  router.put("/:id", requireAuth, async (req, res) => {
    const row = toDbRow(req.body);
    const fields = Object.keys(row);
    const assignments = fields.map((f) => `${f} = ?`).join(", ");
    await pool.query(`UPDATE ${table} SET ${assignments} WHERE id = ?`, [
      ...fields.map((f) => row[f]),
      req.params.id,
    ]);
    res.json({ ok: true });
  });

  router.delete("/:id", requireAuth, async (req, res) => {
    await pool.query(`DELETE FROM ${table} WHERE id = ?`, [req.params.id]);
    res.json({ ok: true });
  });

  return router;
}
