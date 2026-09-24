# Portfolio personal — React + Vite + Node/Express + MySQL

Portfolio de una sola página con **React** y **Vite**, conectado a un
backend propio en **Node.js + Express** que guarda todo en **MySQL**.
Incluye modo claro/oscuro, animaciones al hacer scroll, botón "volver
arriba", hooks personalizados, manejo de eventos, y **edición inline**:
un botón "✎ Editar" en cada sección para modificar el contenido sin
tocar código, protegido con una contraseña que solo vos conocés.

## Estructura general

```
/                  -> frontend (React + Vite) — esto es lo que ves en el navegador
backend/           -> API en Node + Express + MySQL — ver backend/README.md
```

Son dos proyectos separados que se despliegan por separado (el frontend
en un host como Vercel, el backend en un host como Railway), y se
comunican por HTTP.

## Contenido del sitio

- **Hero**, **Sobre mí**, **Habilidades** (barras animadas), **Experiencia**
  (línea de tiempo), **Logros**, **Proyectos** (con filtro por categoría) y
  **Contacto** (enlaces directos a mail, GitHub y LinkedIn — sin formulario).
- Botón flotante para volver al inicio de la página.
- **Edición inline**: cada sección tiene un botón "✎ Editar" que abre un
  modal para modificar esa sección directamente en la misma página. La
  primera vez que se usa cualquiera de esos botones pide una contraseña
  (definida en el backend, ver más abajo); una vez ingresada, queda
  desbloqueado en ese navegador. El candado flotante (esquina inferior
  izquierda) permite volver a bloquear la edición.

## Estructura del frontend

```
src/
  components/          -> un componente por sección + Modal, EditModeButton, SectionEditButton
  components/editors/  -> ProfileEditor y ApiListEditor (usados dentro de los modales)
  context/             -> ThemeContext (modo claro/oscuro) y EditModeContext (edición inline)
  hooks/                -> useReveal, useScrollInfo, usePortfolioData
  lib/                  -> apiClient.js (cliente HTTP hacia el backend)
  data/                 -> datos de respaldo (fallbackData.js), se usan si el backend no está configurado
  styles/               -> CSS por sección
```

## 1. Correr el frontend localmente

Requisitos: [Node.js](https://nodejs.org) 18 o superior.

```bash
npm install
npm run dev
```

Abrí `http://localhost:5173`. Así, sin backend conectado, el sitio ya
funciona completo usando `src/data/fallbackData.js`. Editá ese archivo
con tus datos reales para empezar.

## 2. Levantar el backend + MySQL (necesario para poder editar desde el sitio)

Todos los pasos detallados (crear la base, generar tu contraseña,
correr el servidor, conectar el frontend) están en
**`backend/README.md`**. Resumen rápido:

```bash
cd backend
npm install
cp .env.example .env
# completá .env con tus datos de MySQL
npm run hash-password   # genera tu ADMIN_PASSWORD_HASH (elegís vos la contraseña)
npm start
```

Y en el `.env` de la raíz del proyecto (frontend):

```
VITE_API_URL=http://localhost:4000/api
```

## 3. Subir el proyecto a GitHub

```bash
git init
git add .
git commit -m "Portfolio inicial"
git branch -M main
git remote add origin https://github.com/TU-USUARIO/TU-REPO.git
git push -u origin main
```

> Los archivos `.env` (tanto el de la raíz como el de `/backend`) están
> en `.gitignore` y no se suben al repositorio, porque tienen tus
> contraseñas y claves. Esas variables se configuran directamente en el
> panel de cada host de despliegue.

## 4. Desplegar

### Frontend → Vercel

1. [vercel.com](https://vercel.com) → **Add New → Project** → elegí tu repo.
   - Si tu proyecto no está en la raíz del repo, indicá el **Root
     Directory** correcto (con `/`, no `\`).
2. Variable de entorno: `VITE_API_URL` = la URL de tu backend + `/api`
   (por ejemplo `https://tu-backend.up.railway.app/api`).
3. **Deploy**.

### Backend + MySQL → Railway

Instrucciones completas y detalladas en **`backend/README.md`**.

## Tecnologías usadas

- **Frontend**: React 18 + Vite, CSS con variables (tema claro/oscuro)
  sin frameworks de CSS, IntersectionObserver para animaciones de scroll.
- **Backend**: Node.js + Express, JWT (jsonwebtoken) + bcrypt para
  proteger la edición con una única contraseña.
- **Base de datos**: MySQL.
