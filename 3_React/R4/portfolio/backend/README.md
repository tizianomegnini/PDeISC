# Backend del portfolio — Node.js + Express + MySQL

API REST que conecta el portfolio a una base de datos **MySQL**. Expone
lectura pública (para que cualquier visitante vea tu portfolio) y
escritura protegida con una única contraseña + JWT (para los botones
"✎ Editar" del sitio).

## Endpoints

| Método | Ruta                  | Protegido | Descripción                          |
|--------|-----------------------|-----------|---------------------------------------|
| POST   | `/api/admin/login`    | No        | Recibe `{ password }`, devuelve un token si es correcta |
| GET    | `/api/admin/me`       | Sí        | Verifica que el token siga siendo válido |
| GET    | `/api/profile`        | No        | Trae el perfil                       |
| PUT    | `/api/profile`        | Sí        | Actualiza el perfil                  |
| GET    | `/api/skills`         | No        | Lista habilidades                    |
| POST   | `/api/skills`         | Sí        | Crea una habilidad                   |
| PUT    | `/api/skills/:id`     | Sí        | Edita una habilidad                  |
| DELETE | `/api/skills/:id`     | Sí        | Borra una habilidad                  |
| ...    | `/api/experience`, `/api/achievements`, `/api/projects` | igual patrón que `/api/skills` |

No hay usuarios ni email: es una sola contraseña que solo vos conocés
(`ADMIN_PASSWORD_HASH`, ver más abajo).

## 1. Crear la base de datos MySQL

Necesitás acceso a un servidor MySQL. Opciones:

- **Local** (para probar en tu compu): instalá [XAMPP](https://www.apachefriends.org/)
  (incluye MySQL + phpMyAdmin) o [MySQL Community Server](https://dev.mysql.com/downloads/mysql/).
- **En la nube** (para el despliegue final, gratis): [Railway](https://railway.app)
  o [Clever Cloud](https://www.clever-cloud.com/).

Corré el contenido de `schema.sql` contra esa base — por ejemplo:

```bash
mysql -h TU_HOST -u TU_USUARIO -p < schema.sql
```

O pegá el contenido de `schema.sql` en la consola SQL que te da tu proveedor
(phpMyAdmin, Railway "Data" tab, MySQL Workbench, etc).

## 2. Configurar y correr el backend localmente

```bash
cd backend
npm install
cp .env.example .env
```

Completá `.env` con los datos de tu base (`DB_HOST`, `DB_USER`, `DB_PASSWORD`,
`DB_NAME`) y un `JWT_SECRET` cualquiera (una frase larga al azar).

Generá el hash de la contraseña que vas a usar para editar el sitio:

```bash
npm run hash-password
```

Te va a pedir que escribas una contraseña y te devuelve una línea como:

```
ADMIN_PASSWORD_HASH=$2a$10$abc123...
```

Pegá esa línea completa en tu `.env` (reemplazando la que estaba vacía).

Corré el servidor:

```bash
npm start
```

Deberías ver `API escuchando en http://localhost:4000`. Probalo abriendo
`http://localhost:4000/api/profile` en el navegador: debería devolver el
perfil de ejemplo que cargó `schema.sql`.

## 3. Conectar el frontend a este backend

En la carpeta raíz del proyecto (no en `/backend`), en tu archivo `.env`
del frontend, poné:

```
VITE_API_URL=http://localhost:4000/api
```

Reiniciá `npm run dev` del frontend. Ya debería mostrar los datos desde
MySQL, y cada botón "✎ Editar" del sitio debería pedirte esa contraseña
la primera vez.

## 4. Desplegar el backend (para que funcione en internet, no solo en tu compu)

### Opción recomendada: Railway

Railway te permite tener el backend de Node y la base MySQL en el mismo lugar.

1. Entrá a [railway.app](https://railway.app) e iniciá sesión con GitHub.
2. **New Project → Provision MySQL** para crear la base de datos.
3. Andá a la pestaña de esa base de datos → **Data** (o conectate con
   las credenciales que te muestra en **Variables**) y corré `schema.sql` ahí.
4. En el mismo proyecto, **New → GitHub Repo** y elegí el repositorio de
   tu backend (o el mismo repo del portfolio, indicando `backend` como
   Root Directory).
5. En **Variables** de ese servicio, cargá las mismas variables de tu
   `.env` (`DB_HOST`, `DB_USER`, etc., Railway te las muestra en la base
   que creaste en el paso 2) más `ADMIN_PASSWORD_HASH`, `JWT_SECRET` y
   `FRONTEND_URL` (la URL de tu sitio en Vercel).
6. Railway te da una URL pública tipo `https://tu-backend.up.railway.app`.
   Esa URL + `/api` es lo que va en `VITE_API_URL` del frontend.

### Alternativa: Render + Railway (solo la base)

[Render](https://render.com) para el servicio Node (gratis) + Railway
solo para la base MySQL, si preferís separarlos.

## Seguridad: cómo funciona la protección de edición

MySQL no tiene un sistema de permisos por fila como Supabase (RLS), así
que toda la protección vive en este backend:

- Las rutas `GET` son públicas a propósito (las necesita cualquier
  visitante del portfolio).
- Las rutas `POST` / `PUT` / `DELETE` exigen un header
  `Authorization: Bearer <token>` con un JWT válido, emitido solo si la
  contraseña enviada coincide con `ADMIN_PASSWORD_HASH` (ver `src/auth.js`).
- No hay contraseñas en texto plano en ningún lado: se compara un hash
  con `bcrypt`.
- El token dura 30 días guardado en el navegador; para "cerrar sesión"
  manualmente, usá el botón de candado flotante del sitio.
