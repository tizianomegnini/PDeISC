# Portfolio personal — React + Vite

Portfolio de una sola página construido con **React** y **Vite**. Incluye modo
claro/oscuro, animaciones al hacer scroll, hooks personalizados, manejo de
eventos y carga de datos opcional desde **Supabase** (base de datos Postgres).

## Contenido del sitio

- **Hero**: presentación principal, con animación de entrada.
- **Sobre mí**: biografía y datos clave.
- **Habilidades**: barras de progreso animadas, agrupadas por categoría.
- **Experiencia**: línea de tiempo laboral.
- **Logros**: certificaciones, premios y métricas destacadas.
- **Proyectos**: grilla filtrable por categoría.
- **Contacto**: formulario que guarda mensajes en Supabase (si está configurado).

## Estructura del proyecto

```
src/
  components/     -> un componente por sección (Hero, Skills, Projects, etc.)
  context/        -> ThemeContext (modo claro/oscuro)
  hooks/          -> useReveal, useScrollInfo, usePortfolioData
  lib/            -> cliente de Supabase
  data/           -> datos de respaldo (fallbackData.js)
  styles/         -> CSS por sección
supabase/
  schema.sql      -> tablas y políticas de seguridad para Supabase
```

## 1. Correr el proyecto localmente

Requisitos: [Node.js](https://nodejs.org) 18 o superior.

```bash
npm install
npm run dev
```

Abrí `http://localhost:5173`.

## 2. Personalizar tu información

Editá `src/data/fallbackData.js` con tus datos reales (nombre, bio, redes,
habilidades, experiencia, logros y proyectos). El sitio funciona perfecto
sin base de datos usando solo este archivo — el paso de Supabase (abajo)
es opcional, para que puedas administrar proyectos/experiencia/logros/
mensajes de contacto desde una base de datos real en vez de editar código.

## 3. (Opcional) Conectar una base de datos con Supabase

1. Creá una cuenta gratuita en [supabase.com](https://supabase.com) y un
   proyecto nuevo.
2. En **SQL Editor**, pegá y ejecutá el contenido de `supabase/schema.sql`
   (crea las tablas `projects`, `experience`, `achievements` y `messages`,
   con las políticas de seguridad correspondientes).
3. Cargá algunas filas de ejemplo en `projects`, `experience` y
   `achievements` desde **Table Editor**.
4. En **Project Settings → API**, copiá `Project URL` y `anon public key`.
5. Copiá `.env.example` a `.env` y completá:
   ```
   VITE_SUPABASE_URL=https://tu-proyecto.supabase.co
   VITE_SUPABASE_ANON_KEY=tu-clave-anonima-publica
   ```
6. Reiniciá `npm run dev`. El hook `usePortfolioData` va a detectar las
   variables y traer los datos desde Supabase automáticamente; si algo
   falla, vuelve a usar `fallbackData.js` sin romper el sitio.

## 4. Subir el proyecto a GitHub

```bash
git init
git add .
git commit -m "Portfolio inicial"
git branch -M main
git remote add origin https://github.com/TU-USUARIO/TU-REPO.git
git push -u origin main
```

> Importante: el archivo `.env` está en `.gitignore` y **no** se sube al
> repositorio (contiene tus claves). Configurá esas variables directamente
> en el panel del host de despliegue (paso siguiente).

## 5. Desplegar en un host web

### Opción recomendada: Vercel (gratis, detecta Vite automáticamente)

1. Entrá a [vercel.com](https://vercel.com) e iniciá sesión con tu cuenta
   de GitHub.
2. **Add New → Project** y elegí el repositorio que acabás de subir.
3. Vercel detecta automáticamente `npm run build` y la carpeta `dist`.
4. Si usás Supabase, agregá las variables de entorno en
   **Settings → Environment Variables**:
   - `VITE_SUPABASE_URL`
   - `VITE_SUPABASE_ANON_KEY`
5. **Deploy**. Vercel te da una URL pública (`https://tu-portfolio.vercel.app`).

### Alternativa: Netlify

1. [netlify.com](https://netlify.com) → **Add new site → Import an existing project**.
2. Conectá el repo de GitHub.
3. Build command: `npm run build` — Publish directory: `dist`.
4. Agregá las mismas variables de entorno en **Site settings → Environment variables**.
5. **Deploy site**.

Cualquiera de las dos opciones actualiza el sitio automáticamente cada vez
que hacés `git push` a la rama principal.

## Tecnologías usadas

- React 18 + Vite
- CSS con variables (tema claro/oscuro), sin frameworks de CSS
- Supabase (Postgres + API) como base de datos opcional
- IntersectionObserver API para animaciones de scroll
