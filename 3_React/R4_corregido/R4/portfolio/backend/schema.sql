-- ============================================================
-- Esquema de base de datos MySQL para el portfolio.
-- Ejecutar contra tu base (por consola mysql, MySQL Workbench,
-- phpMyAdmin, o el panel SQL de tu host).
-- ============================================================

CREATE DATABASE IF NOT EXISTS portfolio;
USE portfolio;

-- Perfil: una única fila (id = 1) con los datos personales.
CREATE TABLE IF NOT EXISTS profile (
  id INT PRIMARY KEY,
  name VARCHAR(255) DEFAULT '',
  role VARCHAR(255) DEFAULT '',
  location VARCHAR(255) DEFAULT '',
  summary TEXT,
  bio JSON,
  email VARCHAR(255) DEFAULT '',
  github VARCHAR(255) DEFAULT '',
  linkedin VARCHAR(255) DEFAULT '',
  facts JSON
);

-- Fila inicial: reemplazá estos valores por los tuyos, o editalos
-- después desde el panel /admin una vez que hayas iniciado sesión.
INSERT INTO profile (id, name, role, location, summary, bio, email, github, linkedin, facts)
VALUES (
  1,
  'Tu nombre',
  'Tu rol (ej: Desarrollador/a Frontend)',
  'Tu ciudad, país',
  'Un resumen corto de una o dos líneas para el Hero.',
  JSON_ARRAY('Primer párrafo de tu biografía.', 'Segundo párrafo, si querés.'),
  'tu-email@ejemplo.com',
  'https://github.com/tu-usuario',
  'https://linkedin.com/in/tu-usuario',
  JSON_ARRAY(
    JSON_OBJECT('label', 'Años programando', 'value', '3+'),
    JSON_OBJECT('label', 'Proyectos entregados', 'value', '12')
  )
)
ON DUPLICATE KEY UPDATE id = id;

-- Habilidades (tabla plana: cada fila es una habilidad dentro de una categoría)
CREATE TABLE IF NOT EXISTS skills (
  id INT AUTO_INCREMENT PRIMARY KEY,
  group_name VARCHAR(255) NOT NULL,
  name VARCHAR(255) NOT NULL,
  level INT NOT NULL DEFAULT 50,
  sort_order INT DEFAULT 0
);

-- Experiencia laboral mostrada en la línea de tiempo
CREATE TABLE IF NOT EXISTS experience (
  id INT AUTO_INCREMENT PRIMARY KEY,
  role VARCHAR(255) NOT NULL,
  org VARCHAR(255) NOT NULL,
  period VARCHAR(255) NOT NULL,
  description TEXT,
  tags JSON,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Logros / certificaciones / métricas destacadas
CREATE TABLE IF NOT EXISTS achievements (
  id INT AUTO_INCREMENT PRIMARY KEY,
  value VARCHAR(255) NOT NULL,
  label VARCHAR(255) NOT NULL,
  detail TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Proyectos mostrados en la sección "Proyectos"
CREATE TABLE IF NOT EXISTS projects (
  id INT AUTO_INCREMENT PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  description TEXT NOT NULL,
  category VARCHAR(255),
  tags JSON,
  repo_url VARCHAR(500),
  demo_url VARCHAR(500),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Nota de seguridad: a diferencia de Supabase, MySQL no tiene "Row Level
-- Security" ni autenticación integrada. Por eso toda la protección de
-- escritura (crear/editar/borrar) vive en el backend (ver backend/src/auth.js
-- y backend/src/routes/crudFactory.js), que exige un token válido (JWT)
-- antes de ejecutar cualquier INSERT/UPDATE/DELETE. La lectura es pública
-- a propósito, porque la necesita cualquier visitante del portfolio.
