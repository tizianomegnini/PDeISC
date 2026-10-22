USE tecnofix;
-- Contraseña común de demostración: password
-- Hash bcrypt compatible con bcryptjs para el usuario demo.
INSERT IGNORE INTO users (role_id, name, email, password_hash, phone)
SELECT r.id, 'Administrador Demo', 'admin@tecnofix.local', '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy', '000000000'
FROM roles r WHERE r.name='admin';
INSERT IGNORE INTO users (role_id, name, email, password_hash, phone)
SELECT r.id, 'Técnico Demo', 'tecnico@tecnofix.local', '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy', '000000001'
FROM roles r WHERE r.name='tecnico';
INSERT IGNORE INTO users (role_id, name, email, password_hash, phone)
SELECT r.id, 'Cliente Demo', 'cliente@tecnofix.local', '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy', '000000002'
FROM roles r WHERE r.name='cliente';
-- Si la contraseña del seed no funciona en tu entorno, registrá un usuario desde la app
-- o usá POST /api/auth/register. No uses estos datos en producción.
