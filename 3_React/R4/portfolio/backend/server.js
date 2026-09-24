import express from "express";
import cors from "cors";
import "dotenv/config";

import { handleLogin, handleMe, requireAuth } from "./src/auth.js";
import { createCrudRouter } from "./src/routes/crudFactory.js";
import profileRouter from "./src/routes/profile.js";

const app = express();

app.use(cors({ origin: process.env.FRONTEND_URL || "*" }));
app.use(express.json());

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

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => console.log(`API escuchando en http://localhost:${PORT}`));
