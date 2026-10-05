// Crea un usuario de prueba con la contraseña encriptada.
// Uso: npm run seed
const bcrypt = require('bcryptjs');
const pool = require('./db');

(async () => {
  try {
    const hash = await bcrypt.hash('123456', 10);
    await pool.query(
      'INSERT IGNORE INTO usuarios (nombre, email, password) VALUES (?, ?, ?)',
      ['Usuario Demo', 'demo@correo.com', hash]
    );
    console.log('Usuario creado -> demo@correo.com / 123456');
  } catch (err) {
    console.error('Error en seed:', err.message);
  } finally {
    await pool.end();
  }
})();
