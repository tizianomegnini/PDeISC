CREATE TABLE IF NOT EXISTS adjuntos (
  id INT UNSIGNED NOT NULL AUTO_INCREMENT PRIMARY KEY,
  mensaje_id INT UNSIGNED NOT NULL,
  consulta_id INT UNSIGNED NOT NULL,
  storage_key CHAR(36) CHARACTER SET ascii COLLATE ascii_bin NOT NULL,
  nombre_original VARCHAR(255) NOT NULL,
  mime_type VARCHAR(100) NOT NULL,
  tamanio INT UNSIGNED NOT NULL,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  UNIQUE KEY uq_adjuntos_storage_key (storage_key),
  KEY idx_adjuntos_mensaje (mensaje_id),
  KEY idx_adjuntos_consulta (consulta_id),
  CONSTRAINT fk_adjuntos_mensaje FOREIGN KEY (mensaje_id) REFERENCES mensajes(id) ON DELETE CASCADE,
  CONSTRAINT fk_adjuntos_consulta FOREIGN KEY (consulta_id) REFERENCES consultas(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
