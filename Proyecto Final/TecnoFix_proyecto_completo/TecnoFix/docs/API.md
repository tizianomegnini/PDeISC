# API REST

Base local: `http://localhost:4000/api`. Excepto autenticación y health, enviar `Authorization: Bearer <accessToken>`.

| Método | Ruta | Acceso | Función |
|---|---|---|---|
| GET | `/health` | Público | Verificar API |
| POST | `/auth/register` | Público | Registrar cliente |
| POST | `/auth/login` | Público | Iniciar sesión |
| POST | `/auth/refresh` | Público | Rotar refresh token |
| POST | `/auth/logout` | Público | Revocar refresh token |
| GET | `/users/me` | Autenticado | Perfil actual |
| GET | `/users` | Admin | Listar usuarios |
| POST | `/users` | Admin | Crear usuario |
| GET | `/devices` | Autenticado | Listar dispositivos visibles por rol |
| POST | `/devices` | Cliente | Crear dispositivo |
| GET | `/repairs` | Autenticado | Listar órdenes visibles por rol |
| POST | `/repairs` | Cliente | Solicitar reparación |
| PATCH | `/repairs/:id` | Admin/Técnico asignado | Editar estado y datos de orden |
| GET | `/repairs/:id/history` | Usuario autorizado | Historial |
| GET | `/repairs/stats` | Admin | Estadísticas |

Los cuerpos y respuestas usan JSON. Errores devuelven `{ "error": "..." }` con códigos HTTP adecuados.
