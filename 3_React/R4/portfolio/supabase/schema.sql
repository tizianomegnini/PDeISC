-- ============================================================
-- Esquema de base de datos para el portfolio.
-- Ejecutar en: Supabase -> tu proyecto -> SQL Editor -> New query
-- ============================================================

-- Proyectos mostrados en la sección "Proyectos"
create table if not exists projects (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  description text not null,
  category text,
  tags text[] default '{}',
  repo_url text,
  demo_url text,
  created_at timestamptz default now()
);

-- Experiencia laboral mostrada en la línea de tiempo
create table if not exists experience (
  id uuid primary key default gen_random_uuid(),
  role text not null,
  org text not null,
  period text not null,
  start_date date,
  description text,
  tags text[] default '{}'
);

-- Logros / certificaciones / métricas destacadas
create table if not exists achievements (
  id uuid primary key default gen_random_uuid(),
  value text not null,
  label text not null,
  detail text
);

-- Mensajes enviados desde el formulario de contacto
create table if not exists messages (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  email text not null,
  message text not null,
  created_at timestamptz default now()
);

-- ============================================================
-- Seguridad: habilitar Row Level Security y permitir lectura
-- pública de contenido del portfolio, pero NO lectura pública
-- de los mensajes de contacto (solo inserción).
-- ============================================================

alter table projects enable row level security;
alter table experience enable row level security;
alter table achievements enable row level security;
alter table messages enable row level security;

create policy "Lectura pública de proyectos" on projects
  for select using (true);

create policy "Lectura pública de experiencia" on experience
  for select using (true);

create policy "Lectura pública de logros" on achievements
  for select using (true);

create policy "Cualquiera puede escribir un mensaje" on messages
  for insert with check (true);

-- (No se crea policy de "select" en messages: solo vos, con la
-- clave de servicio o desde el panel de Supabase, podés leerlos)
