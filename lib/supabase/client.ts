// Capa de conexión a Supabase (OPERATIVO-REAL-1).
//
// No se conecta a nada mientras las variables de entorno no estén configuradas: las funciones
// de este archivo devuelven `null` en ese caso, y el resto de la app cae de vuelta al modo
// local (.local-data/gawer/proposals.json). Ver lib/data/proposalsRepository.ts para el switch.

import { createClient, type SupabaseClient } from "@supabase/supabase-js";

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
const SUPABASE_ANON_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;

// El modo Supabase requiere, como mínimo, URL + service role key (usada server-side en las
// API routes). La anon key no es necesaria para que el modo Supabase funcione en esta fase.
export function isSupabaseConfigured(): boolean {
  return Boolean(SUPABASE_URL && SUPABASE_SERVICE_ROLE_KEY);
}

let adminClient: SupabaseClient | null = null;

// Cliente server-only con la service role key: bypassea Row Level Security. Nunca importar
// este módulo desde un Client Component ni exponer su resultado al navegador.
export function getSupabaseAdminClient(): SupabaseClient | null {
  if (!SUPABASE_URL || !SUPABASE_SERVICE_ROLE_KEY) return null;
  if (!adminClient) {
    adminClient = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY, {
      auth: { persistSession: false },
    });
  }
  return adminClient;
}

let publicClient: SupabaseClient | null = null;

// Cliente con la anon key, apto para uso en el navegador. No se usa todavía en esta fase (la
// tabla gawer_proposals tiene RLS habilitado sin policies, así que el anon key no puede leer ni
// escribir nada); queda preparado para una fase futura que necesite acceso directo del cliente.
export function getSupabasePublicClient(): SupabaseClient | null {
  if (!SUPABASE_URL || !SUPABASE_ANON_KEY) return null;
  if (!publicClient) {
    publicClient = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
  }
  return publicClient;
}
