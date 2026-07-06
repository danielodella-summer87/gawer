-- OPERATIVO-REAL-2 — Documentos reales con Supabase Storage
--
-- IMPORTANTE: este archivo NO se ejecuta automáticamente. Debe aplicarse manualmente (SQL
-- editor de Supabase o CLI) cuando se decida activar la carga de documentos reales. Mientras
-- no se aplique, la funcionalidad de documentos queda simplemente inactiva (la app maneja el
-- caso "tabla no existe todavía" de forma controlada, igual que en OPERATIVO-REAL-1).
--
-- Diseño: una tabla de metadata, public.gawer_proposal_documents, referenciando
-- public.gawer_proposals(id). El archivo en sí se guarda en Supabase Storage (bucket privado
-- gawer-proposal-documents); esta tabla solo guarda la referencia (storage_bucket +
-- storage_path) y los datos descriptivos del documento.
--
-- Tipos de documento contemplados (texto libre, no se fuerza con CHECK para no romper si se
-- agregan nuevos tipos — espeja documentChecklistOptions en lib/mock/gawerData.ts):
--   CIS / Corporate Information Sheet / Hoja de Información Corporativa
--   LOI / Carta de intención
--   Mandato o autorización de representación
--   Evidencia bancaria
--   Evidencia de disponibilidad de fondos
--   SBLC
--   RWA
--   Documentación de garantía financiera
--   Documentación de oro / producto
--   Documentación cripto / trazabilidad de fondos
--   Otro

create extension if not exists "pgcrypto"; -- necesaria para gen_random_uuid() (ya puede existir de OPERATIVO-REAL-1)

create table if not exists public.gawer_proposal_documents (
  id uuid primary key default gen_random_uuid(),
  proposal_id uuid not null references public.gawer_proposals(id) on delete cascade,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),

  -- Metadata del documento
  document_type text not null,
  original_filename text not null,
  storage_bucket text not null default 'gawer-proposal-documents',
  storage_path text not null,
  mime_type text,
  file_size_bytes bigint,
  uploaded_by text,
  uploaded_from text not null default 'internal',
  status text not null default 'Recibido',
  internal_observation text,
  is_required boolean not null default false,

  -- Seguridad / trazabilidad
  source text not null default 'proposal_file_upload',
  metadata jsonb not null default '{}'::jsonb
);

comment on table public.gawer_proposal_documents is
  'Metadata de documentos reales asociados a una propuesta (public.gawer_proposals). El archivo '
  'físico vive en Supabase Storage (bucket gawer-proposal-documents); esta tabla solo referencia '
  'storage_bucket + storage_path. No hay autenticación en esta fase — todo el acceso pasa por '
  'las API routes de Next.js con la service role key (server-only).';

-- Mantiene updated_at al día en cada UPDATE.
create or replace function public.gawer_proposal_documents_set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists gawer_proposal_documents_updated_at on public.gawer_proposal_documents;
create trigger gawer_proposal_documents_updated_at
  before update on public.gawer_proposal_documents
  for each row
  execute function public.gawer_proposal_documents_set_updated_at();

create index if not exists gawer_proposal_documents_proposal_id_idx
  on public.gawer_proposal_documents (proposal_id);
create index if not exists gawer_proposal_documents_document_type_idx
  on public.gawer_proposal_documents (document_type);
create index if not exists gawer_proposal_documents_status_idx
  on public.gawer_proposal_documents (status);
create index if not exists gawer_proposal_documents_created_at_idx
  on public.gawer_proposal_documents (created_at desc);
create index if not exists gawer_proposal_documents_storage_idx
  on public.gawer_proposal_documents (storage_bucket, storage_path);

-- RLS habilitado, sin policies: igual que public.gawer_proposals, nada de anon/authenticated
-- puede leer ni escribir esta tabla todavía. Solo la service role key (usada exclusivamente
-- server-side, en las API routes de Next.js bajo app/api/proposals/[id]/documents/*) puede
-- acceder, porque bypassea RLS. El acceso directo con la anon key NO está habilitado en esta
-- fase — si en el futuro se necesita lectura/escritura directa desde el cliente, ahí habrá que
-- sumar policies explícitas (por ejemplo, atadas a un sistema de autenticación que hoy no existe).
alter table public.gawer_proposal_documents enable row level security;


-- ─────────────────────────────────────────────────────────────────────────────────────────
-- Bucket de Storage — gawer-proposal-documents (PRIVADO, no público)
-- ─────────────────────────────────────────────────────────────────────────────────────────
--
-- Forma recomendada (manual, sin ambigüedad de RLS de Storage): crear el bucket desde el
-- Dashboard de Supabase:
--   Storage → New bucket → nombre: gawer-proposal-documents → Public bucket: DESACTIVADO.
--
-- Alternativa por SQL (equivalente, pero requiere revisión antes de ejecutar: Storage tiene su
-- propio esquema `storage.buckets` / `storage.objects` con RLS propio; insertar el bucket por
-- SQL no configura por sí solo ninguna policy de acceso — el acceso seguirá pasando
-- exclusivamente por la service role key desde las API routes, igual que con la tabla de
-- metadata). Descomentar solo si se decide aplicar por SQL en lugar de por Dashboard:
--
-- insert into storage.buckets (id, name, public)
-- values ('gawer-proposal-documents', 'gawer-proposal-documents', false)
-- on conflict (id) do nothing;
--
-- No se necesitan policies adicionales de storage.objects mientras el único acceso sea server-side
-- con la service role key (que bypassea RLS de Storage también). Si en el futuro se agrega acceso
-- directo desde el cliente (anon key) para subir o leer archivos, ahí habrá que sumar policies
-- explícitas sobre storage.objects.
