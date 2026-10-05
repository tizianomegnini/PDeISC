-- Ejecutar en phpMyAdmin (XAMPP/WAMP/LAMP) o con el cliente mysql
CREATE DATABASE IF NOT EXISTS login_db
  CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

USE login_db;

CREATE TABLE IF NOT EXISTS usuarios (
  id        INT AUTO_INCREMENT PRIMARY KEY,
  nombre    VARCHAR(100) NOT NULL,
  email     VARCHAR(150) NOT NULL UNIQUE,
  password  VARCHAR(255) NOT NULL,          -- hash bcrypt, nunca texto plano
  creado_en TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
