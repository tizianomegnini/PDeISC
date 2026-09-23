import { useEffect, useState } from "react";
import { supabase, isSupabaseConfigured } from "../lib/supabaseClient";
import {
  profile as fallbackProfile,
  skillGroups as fallbackSkillGroups,
  achievements as fallbackAchievements,
  experience as fallbackExperience,
  projects as fallbackProjects,
} from "../data/fallbackData";

/**
 * usePortfolioData
 * -----------------
 * Centraliza la carga de TODA la información del portfolio (perfil,
 * habilidades, logros, experiencia y proyectos).
 *
 * Comportamiento:
 *  - Si Supabase está configurado (ver src/lib/supabaseClient.js), intenta
 *    traer cada tabla ("projects", "achievements", "experience", "skills").
 *  - Si Supabase NO está configurado, o si alguna consulta falla, usa
 *    automáticamente los datos de src/data/fallbackData.js, así el sitio
 *    nunca se rompe por falta de base de datos.
 *
 * @returns {{ data: object, loading: boolean, source: "supabase"|"fallback" }}
 */
export function usePortfolioData() {
  const [state, setState] = useState({
    loading: true,
    source: "fallback",
    data: {
      profile: fallbackProfile,
      skillGroups: fallbackSkillGroups,
      achievements: fallbackAchievements,
      experience: fallbackExperience,
      projects: fallbackProjects,
    },
  });

  useEffect(() => {
    let cancelled = false;

    async function load() {
      if (!isSupabaseConfigured) {
        // Sin credenciales: nos quedamos con el estado inicial (fallback).
        setState((prev) => ({ ...prev, loading: false }));
        return;
      }

      try {
        const [{ data: projects, error: e1 }, { data: achievements, error: e2 }, { data: experience, error: e3 }] =
          await Promise.all([
            supabase.from("projects").select("*").order("created_at", { ascending: false }),
            supabase.from("achievements").select("*"),
            supabase.from("experience").select("*").order("start_date", { ascending: false }),
          ]);

        if (e1 || e2 || e3) throw e1 || e2 || e3;
        if (cancelled) return;

        setState({
          loading: false,
          source: "supabase",
          data: {
            profile: fallbackProfile, // el perfil personal se mantiene estático a propósito
            skillGroups: fallbackSkillGroups,
            achievements: achievements?.length ? achievements : fallbackAchievements,
            experience: experience?.length ? experience : fallbackExperience,
            projects: projects?.length ? projects : fallbackProjects,
          },
        });
      } catch (error) {
        console.warn("No se pudo leer Supabase, se usan datos locales:", error.message);
        if (!cancelled) setState((prev) => ({ ...prev, loading: false }));
      }
    }

    load();
    return () => {
      cancelled = true;
    };
  }, []);

  return state;
}
