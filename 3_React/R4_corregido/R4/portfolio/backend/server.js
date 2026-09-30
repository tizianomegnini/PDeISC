import express from "express";
import cors from "cors";
import "dotenv/config";

import { handleLogin, handleMe, requireAuth } from "./src/auth.js";
import { createCrudRouter } from "./src/routes/crudFactory.js";
import profileRouter from "./src/routes/profile.js";

const app = express();

app.use(cors({ origin: process.env.FRONTEND_URL || "*" }));
app.use(express.json({ limit: "1mb" }));

// --- Autenticación del panel /admin ---
app.post("/api/admin/login", handleLogin);
app.get("/api/admin/me", requireAuth, handleMe);

// --- Perfil (fila única) ---
app.use("/api/profile", profileRouter);

// --- Recursos con CRUD estándar ---
app.use(
  "/api/skills",
  createCrudRouter({ table: "skills", columns: ["group_name", "name", "level", "sort_order"], orderBy: "sort_order ASC" })
);

app.use(
  "/api/experience",
  createCrudRouter({
    table: "experience",
    columns: ["role", "org", "period", "description", "tags"],
    jsonColumns: ["tags"],
    orderBy: "id DESC",
  })
);

app.use(
  "/api/achievements",
  createCrudRouter({ table: "achievements", columns: ["value", "label", "detail"], orderBy: "id DESC" })
);

app.use(
  "/api/projects",
  createCrudRouter({
    table: "projects",
    columns: ["title", "description", "category", "tags", "repo_url", "demo_url"],
    jsonColumns: ["tags"],
    orderBy: "id DESC",
  })
);

app.get("/", (req, res) => res.json({ status: "ok", service: "portfolio-backend" }));

// Manejo centralizado de errores de las rutas async.
app.use((err, req, res, next) => {
  console.error("API error:", err);
  if (res.headersSent) return next(err);
  res.status(500).json({ error: "Error interno del servidor." });
});

const PORT = Number(process.env.PORT || 4000);

if (!process.env.JWT_SECRET) {
  console.warn("⚠️ JWT_SECRET no está configurado. El login de admin no funcionará.");
}

if (!process.env.ADMIN_PASSWORD_HASH) {
  console.warn("⚠️ ADMIN_PASSWORD_HASH no está configurado. El login de admin no funcionará.");
}

app.listen(PORT, () => console.log(`API escuchando en http://localhost:${PORT}`));
