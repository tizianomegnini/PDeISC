import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import "dotenv/config";

const TOKEN_EXPIRY = "30d";

/**
 * handleLogin
 * -----------
 * Valida la contraseña de edición contra ADMIN_PASSWORD_HASH (variable de
 * entorno del backend). No hay usuarios ni email: es una única contraseña
 * que solo vos conocés. Si es correcta, devuelve un JWT que el frontend
 * guarda y reenvía en cada pedido protegido (crear/editar/borrar contenido).
 */
export async function handleLogin(req, res) {
  const { password } = req.body ?? {};

  if (!password) {
    return res.status(400).json({ error: "Falta la contraseña." });
  }

  const hash = process.env.ADMIN_PASSWORD_HASH || "";
  const secret = process.env.JWT_SECRET || "";

  if (!hash || !secret) {
    return res.status(500).json({
      error: "El backend no está configurado: faltan ADMIN_PASSWORD_HASH o JWT_SECRET.",
    });
  }

  const matches = await bcrypt.compare(password, hash);

  if (!matches) {
    return res.status(401).json({ error: "Contraseña incorrecta." });
  }

  const token = jwt.sign({ role: "admin" }, secret, { expiresIn: TOKEN_EXPIRY });
  res.json({ token });
}

/** GET /api/admin/me — usado por el frontend para confirmar que el token sigue siendo válido. */
export function handleMe(req, res) {
  res.json({ ok: true });
}

/**
 * requireAuth
 * -----------
 * Middleware de Express que exige un JWT válido en el header Authorization.
 * Se usa en todas las rutas de escritura (crear/editar/borrar) para que
 * solo quien conoce la contraseña pueda modificar el contenido del portfolio.
 */
export function requireAuth(req, res, next) {
  const header = req.headers.authorization || "";
  const token = header.startsWith("Bearer ") ? header.slice(7) : null;

  if (!token) return res.status(401).json({ error: "No autenticado." });

  const secret = process.env.JWT_SECRET || "";
  if (!secret) return res.status(500).json({ error: "JWT_SECRET no está configurado." });

  try {
    req.admin = jwt.verify(token, secret);
    next();
  } catch {
    res.status(401).json({ error: "Sesión inválida o vencida." });
  }
}
