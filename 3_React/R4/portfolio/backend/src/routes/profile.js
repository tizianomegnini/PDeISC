import { Router } from "express";
import { pool } from "../db.js";
import { requireAuth } from "../auth.js";

const router = Router();

// Lectura pública del perfil (fila única, id = 1).
router.get("/", async (req, res) => {
  const [rows] = await pool.query("SELECT * FROM profile WHERE id = 1");
  res.json(rows[0] ?? null);
});

// Actualización protegida: siempre sobre la fila id = 1 (upsert).
router.put("/", requireAuth, async (req, res) => {
  const { name, role, location, summary, bio, email, github, linkedin, facts } = req.body;

  await pool.query(
    `INSERT INTO profile (id, name, role, location, summary, bio, email, github, linkedin, facts)
     VALUES (1, ?, ?, ?, ?, ?, ?, ?, ?, ?)
     ON DUPLICATE KEY UPDATE
       name = VALUES(name), role = VALUES(role), location = VALUES(location),
       summary = VALUES(summary), bio = VALUES(bio), email = VALUES(email),
       github = VALUES(github), linkedin = VALUES(linkedin), facts = VALUES(facts)`,
    [
      name,
      role,
      location,
      summary,
      JSON.stringify(bio ?? []),
      email,
      github,
      linkedin,
      JSON.stringify(facts ?? []),
    ]
  );

  res.json({ ok: true });
});

export default router;
