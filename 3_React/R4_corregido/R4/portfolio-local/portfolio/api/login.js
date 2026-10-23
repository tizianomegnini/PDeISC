
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    res.setHeader("Allow", "POST");
    return res.status(405).json({
      error: "Método no permitido",
    });
  }

  const { password } = req.body ?? {};
  const adminEmail = process.env.ADMIN_EMAIL?.trim().toLowerCase();
  const passwordHash = process.env.ADMIN_PASSWORD_HASH;
  const jwtSecret = process.env.JWT_SECRET;

  if (!adminEmail || !passwordHash || !jwtSecret) {
    return res.status(500).json({
      error: "Falta configurar la autenticación",
    });
  }

  if (
    typeof password !== "string" ||
    password.length === 0 ||
    password.length > 1024
  ) {
    return res.status(401).json({
      error: "Credenciales incorrectas",
    });
  }

  try {
    const valid = await bcrypt.compare(
      password,
      passwordHash
    );

    if (!valid) {
      return res.status(401).json({
        error: "Credenciales incorrectas",
      });
    }

    const token = jwt.sign(
      { sub: adminEmail, role: "admin" },
      jwtSecret,
      { expiresIn: "2h", issuer: "portfolio-api" }
    );

    return res.status(200).json({
      access_token: token,
      expires_in: 7200,
    });
  } catch (error) {
    console.error("Error de autenticación:", error.message);

    return res.status(500).json({
      error: "No se pudo completar el inicio de sesión",
    });
  }
}
