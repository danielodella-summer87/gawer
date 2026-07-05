-- OPERATIVO-REAL-1 — Persistencia real de propuestas en Supabase
--
-- IMPORTANTE: este archivo NO se ejecuta automáticamente. Debe aplicarse manualmente
-- (SQL editor de Supabase o `supabase db push` / CLI) cuando Fernando decida activar el
-- modo Supabase. Mientras no se aplique, GAWER Intelligence sigue funcionando 100% en modo
-- local (.local-data/gawer/proposals.json), sin ningún cambio de comportamiento.
--
-- Diseño: una única tabla, public.gawer_proposals, que espeja el shape de LocalProposal
-- (lib/local/proposalsStore.ts) — análoga a proposals.json. input/assessment/seguimiento/
-- documentChecklist/historial quedan como JSONB para no requerir un rediseño relacional en
-- esta fase. Se agregan algunas columnas generadas (estado_comercial, area_negocio, riesgo,
-- mtn_hsbc_ltn) para poder filtrar/ordenar sin parsear JSONB desde reportes/bandeja.
--
-- Seguridad: Row Level Security queda habilitado SIN policies. En esta fase no hay
-- autenticación ni acceso directo desde el navegador a esta tabla — todo el acceso pasa por
-- las API routes de Next.js usando la service role key (server-only), que bypassea RLS. Si en
-- una fase futura se necesita acceso directo desde el cliente (anon key), ahí habrá que sumar
-- policies explícitas.

create extension if not exists "pgcrypto"; -- necesaria para gen_random_uuid()

create table if not exists public.gawer_proposals (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  source text not null default 'supabase_public_form',

  input jsonb not null,
  assessment jsonb not null,
  seguimiento jsonb not null default '{
    "estadoComercial": "Nueva propuesta recibida",
    "responsableInterno": "",
    "proximaAccion": "",
    "fechaProximaAccion": "",
    "notaInterna": ""
  }'::jsonb,
  document_checklist jsonb not null default '[]'::jsonb,
  historial jsonb not null default '[]'::jsonb,

  -- Columnas generadas de solo lectura, derivadas de los JSONB de arriba.
  estado_comercial text generated always as (seguimiento ->> 'estadoComercial') stored,
  area_negocio text generated always as (input ->> 'areaNegocio') stored,
  riesgo text generated always as (assessment ->> 'riesgo') stored,
  mtn_hsbc_ltn text generated always as (input ->> 'mtnHsbcLtn') stored
);

comment on table public.gawer_proposals is
  'Propuestas ingresadas desde el formulario público (/propuesta). Mismo shape que LocalProposal '
  '(lib/local/proposalsStore.ts): input + assessment + seguimiento + documentChecklist + historial. '
  'Tabla análoga a .local-data/gawer/proposals.json en modo local.';

create index if not exists gawer_proposals_created_at_idx
  on public.gawer_proposals (created_at desc);
create index if not exists gawer_proposals_estado_comercial_idx
  on public.gawer_proposals (estado_comercial);
create index if not exists gawer_proposals_area_negocio_idx
  on public.gawer_proposals (area_negocio);
create index if not exists gawer_proposals_riesgo_idx
  on public.gawer_proposals (riesgo);
create index if not exists gawer_proposals_mtn_hsbc_ltn_idx
  on public.gawer_proposals (mtn_hsbc_ltn);
create index if not exists gawer_proposals_source_idx
  on public.gawer_proposals (source);

-- Mantiene updated_at al día en cada UPDATE.
create or replace function public.gawer_proposals_set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists gawer_proposals_updated_at on public.gawer_proposals;
create trigger gawer_proposals_updated_at
  before update on public.gawer_proposals
  for each row
  execute function public.gawer_proposals_set_updated_at();

-- RLS habilitado, sin policies: nada de anon/authenticated puede leer ni escribir esta tabla
-- todavía. Solo la service role key (usada exclusivamente server-side, en las API routes de
-- Next.js) puede acceder, porque bypassea RLS.
alter table public.gawer_proposals enable row level security;
