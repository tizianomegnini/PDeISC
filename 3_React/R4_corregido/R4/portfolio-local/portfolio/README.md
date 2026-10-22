# Portfolio personal — React + Vite + Supabase

Portfolio de una sola página con React y Vite. El sitio puede desplegarse en Vercel y el contenido se guarda en una base de datos PostgreSQL alojada en Supabase.

Incluye modo claro/oscuro, animaciones al hacer scroll y edición inline del perfil, habilidades, logros, experiencia y proyectos. Los cambios guardados en Supabase se comparten con todas las visitas.

## Configurar Supabase

1. Creá un proyecto en [Supabase](https://supabase.com/) y copiá la Project URL y la publishable key desde **Project Settings → API Keys**.
2. En **SQL Editor**, ejecutá [`supabase/setup.sql`](supabase/setup.sql). Antes de ejecutarlo, reemplazá `admin@tudominio.com` en la política RLS por el email que usarás como administrador.
3. En **Authentication → Users**, creá el usuario administrador con ese email y una contraseña segura. Desactivá el registro público si no necesitás que otras personas creen cuentas.
4. Copiá `.env.example` a `.env` y completa:

   ```env
   VITE_SUPABASE_URL=https://tu-proyecto.supabase.co
   VITE_SUPABASE_PUBLISHABLE_KEY=sb_publishable_tu_clave
   VITE_SUPABASE_ADMIN_EMAIL=admin@tudominio.com
   ```

5. Ejecutá `npm install` y `npm run dev`. En Vercel, cargá las mismas tres variables en **Settings → Environment Variables** y volvé a desplegar.
6. Abrí el portfolio, ingresá al modo de edición con la contraseña del usuario administrador y usá **Importar archivo** para importar `src/data/seed.json` como contenido inicial.

La publishable key se usa en el frontend y está protegida por RLS. Nunca pongas una secret key en variables `VITE_*` ni en el navegador.

## Editar el contenido

Desbloqueá la edición y usá los botones **Editar** de cada sección. Los cambios se escriben en Supabase y se reflejan para todos los visitantes. El panel **Datos** permite exportar el contenido a JSON, importar un JSON con la estructura de `src/data/seed.json` y restablecer los datos iniciales.

La tabla contiene un único documento JSON (`portfolio_content`, id `main`). Las lecturas son públicas; las escrituras requieren una sesión autenticada cuyo email coincida con el administrador configurado en la política RLS.

## Correr localmente

Requisitos: Node.js 18 o superior.

```bash
npm install
npm run dev
```

Abrí `http://localhost:5173`.

## Desplegar en Vercel

Vercel detecta Vite y ejecuta `npm run build`. Añadí las variables de entorno de Supabase indicadas arriba en el proyecto de Vercel y desplegá nuevamente.
