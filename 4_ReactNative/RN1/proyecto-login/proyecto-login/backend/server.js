require('dotenv').config();
const express = require('express');
const cors = require('cors');
const bcrypt = require('bcryptjs');
const pool = require('./db');

const app = express();
app.use(cors());
app.use(express.json());

// Ruta de prueba
app.get('/api/health', (_req, res) => res.json({ ok: true }));

// Login: busca el usuario por email y compara la contraseña
app.post('/api/login', async (req, res) => {
  const { email, password } = req.body ?? {};

  if (!email || !password) {
    return res.status(400).json({ ok: false, message: 'Email y contraseña son obligatorios' });
  }

  try {
    const [rows] = await pool.query(
      'SELECT id, nombre, email, password FROM usuarios WHERE email = ? LIMIT 1',
      [String(email).trim().toLowerCase()]
    );

    if (rows.length === 0) {
      return res.status(404).json({ ok: false, message: 'El usuario no existe' });
    }

    const user = rows[0];
    const match = await bcrypt.compare(String(password), user.password);

    if (!match) {
      return res.status(401).json({ ok: false, message: 'Contraseña incorrecta' });
    }

    // Nunca devolvemos el hash
    return res.json({
      ok: true,
      user: { id: user.id, nombre: user.nombre, email: user.email },
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ ok: false, message: 'Error interno del servidor' });
  }
});

const PORT = process.env.PORT || 3000;
// 0.0.0.0 para que el celular (Expo Go) pueda conectarse desde la red local
app.listen(PORT, '0.0.0.0', () => console.log(`API lista en http://0.0.0.0:${PORT}`));
