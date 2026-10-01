# Portfolio personal — React + Vite (sin backend)

Portfolio de una sola página con **React** y **Vite**. No necesita MySQL,
ni servidor, ni puertos extra: todo corre en el navegador, así que se
despliega en **Vercel** tal cual.

Incluye modo claro/oscuro, animaciones al hacer scroll, botón "volver
arriba" y **edición inline** (botón "✎ Editar" en cada sección) protegida
con una contraseña.

## Cómo funcionan los datos

- El contenido inicial está en **`src/data/seed.json`**.
- Cuando editás algo desde el sitio, se guarda en el **localStorage de tu
  navegador** (`src/lib/apiClient.js`). Los demás visitantes no ven esos
  cambios.
- Para **publicar** tus cambios:
  1. Desbloqueá la edición (candado, abajo a la izquierda).
  2. Tocá el botón de descarga que aparece arriba del candado → **Exportar contenido**.
  3. Reemplazá `src/data/seed.json` con el archivo descargado.
  4. `git add . && git commit -m "Actualizo contenido" && git push` → Vercel despliega solo.
- Ese mismo panel permite **importar** un archivo y **restablecer** (descartar lo editado en tu navegador).

> La contraseña se verifica en el navegador, así que es un candado "suave":
> evita ediciones accidentales, pero no es seguridad real. Como las
> ediciones nunca llegan a otros visitantes, no hay nada que proteger en un servidor.

### Contraseña de edición

Por defecto es `Admin123!`. Para cambiarla:

```bash
npm run hash-password
```

Copiá la línea `VITE_ADMIN_PASSWORD_HASH=...` en tu `.env` (local) y en
**Vercel → Settings → Environment Variables**.

## Correr localmente

Requisitos: [Node.js](https://nodejs.org) 18 o superior.

```bash
npm install
npm run dev
```

Abrí `http://localhost:5173`.

## Desplegar en Vercel

1. Subí el proyecto a GitHub.
2. [vercel.com](https://vercel.com) → **Add New → Project** → elegí el repo
   (Vercel detecta Vite: `npm run build` → `dist`).
3. (Opcional) Agregá `VITE_ADMIN_PASSWORD_HASH` en las variables de entorno.
4. **Deploy**.

## Estructura

```
src/
  components/          -> una sección por componente + Modal, EditModeButton, SectionEditButton
  components/editors/  -> ProfileEditor, ApiListEditor y DataEditor (exportar/importar)
  context/             -> ThemeContext y EditModeContext
  hooks/               -> useReveal, useScrollInfo, usePortfolioData
  lib/apiClient.js     -> base local (localStorage) con la misma interfaz que tenía la API
  data/seed.json       -> contenido publicado del portfolio
  data/fallbackData.js -> respaldo si alguna lista queda vacía
  styles/              -> CSS por sección
scripts/hash-password.js
```

## ¿Y si quiero que las ediciones las vean todos sin hacer push?

Hace falta una base de datos en la nube (por ejemplo Supabase, Turso o
Vercel KV/Blob), porque Vercel no permite guardar archivos ni correr un
servidor MySQL propio. Se puede cambiar solo `src/lib/apiClient.js` y el
resto de la app queda igual.
