import { createClient } from "@supabase/supabase-js";

/**
 * Cliente de Supabase.
 *
 * El proyecto funciona SIN base de datos (usa src/data/fallbackData.js),
 * pero si completás VITE_SUPABASE_URL y VITE_SUPABASE_ANON_KEY en un
 * archivo .env (ver .env.example), los componentes Skills, Experience,
 * Achievements y Projects van a traer la información desde las tablas
 * de Supabase automáticamente (ver supabase/schema.sql).
 */
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

export const isSupabaseConfigured = Boolean(supabaseUrl && supabaseAnonKey);

export const supabase = isSupabaseConfigured ? createClient(supabaseUrl, supabaseAnonKey) : null;
