// Documentos reales de propuestas — Supabase Storage + metadata (OPERATIVO-REAL-2).
//
// Requiere que la migración SQL haya sido aplicada manualmente de antemano
// (docs/supabase/OPERATIVO-REAL-2-documents-storage-schema.sql) y que el bucket
// gawer-proposal-documents exista (privado, no público). Si algo de esto no está listo, las
// funciones de este archivo lanzan un error explícito en vez de fallar de forma opaca.
//
// No hay modo local equivalente para documentos: esta funcionalidad solo existe cuando
// Supabase está configurado. Las API routes que consumen este módulo deben manejar el caso
// "Supabase no configurado" mostrando un mensaje claro, no un fallback silencioso.

import { randomUUID } from "crypto";
import { getSupabaseAdminClient } from "./client";

const BUCKET = "gawer-proposal-documents";
const TABLE = "gawer_proposal_documents";

export interface ProposalDocumentMeta {
  id: string;
  proposalId: string;
  createdAt: string;
  updatedAt: string;
  documentType: string;
  originalFilename: string;
  storageBucket: string;
  storagePath: string;
  mimeType: string | null;
  fileSizeBytes: number | null;
  uploadedBy: string | null;
  uploadedFrom: string;
  status: string;
  internalObservation: string | null;
  isRequired: boolean;
  source: string;
  metadata: Record<string, unknown>;
}

interface ProposalDocumentRow {
  id: string;
  proposal_id: string;
  created_at: string;
  updated_at: string;
  document_type: string;
  original_filename: string;
  storage_bucket: string;
  storage_path: string;
  mime_type: string | null;
  file_size_bytes: number | null;
  uploaded_by: string | null;
  uploaded_from: string;
  status: string;
  internal_observation: string | null;
  is_required: boolean;
  source: string;
  metadata: Record<string, unknown>;
}

function requireClient() {
  const client = getSupabaseAdminClient();
  if (!client) {
    throw new Error(
      "Supabase no está configurado (faltan NEXT_PUBLIC_SUPABASE_URL / SUPABASE_SERVICE_ROLE_KEY)."
    );
  }
  return client;
}

function tableAccessError(error: { message: string }): Error {
  return new Error(
    `No se pudo acceder a public.gawer_proposal_documents. ¿Se aplicó la migración SQL ` +
      `(docs/supabase/OPERATIVO-REAL-2-documents-storage-schema.sql) y existe el bucket ` +
      `"${BUCKET}"? Detalle: ${error.message}`
  );
}

function rowToMeta(row: ProposalDocumentRow): ProposalDocumentMeta {
  return {
    id: row.id,
    proposalId: row.proposal_id,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
    documentType: row.document_type,
    originalFilename: row.original_filename,
    storageBucket: row.storage_bucket,
    storagePath: row.storage_path,
    mimeType: row.mime_type,
    fileSizeBytes: row.file_size_bytes,
    uploadedBy: row.uploaded_by,
    uploadedFrom: row.uploaded_from,
    status: row.status,
    internalObservation: row.internal_observation,
    isRequired: row.is_required,
    source: row.source,
    metadata: row.metadata,
  };
}

// Evita path traversal y caracteres problemáticos en Storage; conserva la extensión.
function sanitizeFilename(name: string): string {
  const base = name.split(/[/\\]/).pop() || "documento";
  const cleaned = base.replace(/[^a-zA-Z0-9._-]/g, "_").replace(/_{2,}/g, "_");
  return cleaned.slice(-150) || "documento";
}

export async function listProposalDocuments(proposalId: string): Promise<ProposalDocumentMeta[]> {
  const client = requireClient();
  const { data, error } = await client
    .from(TABLE)
    .select("*")
    .eq("proposal_id", proposalId)
    .order("created_at", { ascending: false });
  if (error) throw tableAccessError(error);
  return ((data ?? []) as ProposalDocumentRow[]).map(rowToMeta);
}

// Busca un documento por id, validando que pertenezca a proposalId (evita acceder a
// documentos de otra propuesta a través de un documentId de otra ficha).
export async function getProposalDocumentForProposal(
  proposalId: string,
  documentId: string
): Promise<ProposalDocumentMeta | null> {
  const client = requireClient();
  const { data, error } = await client
    .from(TABLE)
    .select("*")
    .eq("id", documentId)
    .eq("proposal_id", proposalId)
    .maybeSingle();
  if (error) throw tableAccessError(error);
  return data ? rowToMeta(data as ProposalDocumentRow) : null;
}

export interface UploadProposalDocumentInput {
  proposalId: string;
  documentType: string;
  fileBuffer: Buffer;
  originalFilename: string;
  mimeType?: string;
  status?: string;
  internalObservation?: string;
  isRequired?: boolean;
}

export async function uploadProposalDocument(
  input: UploadProposalDocumentInput
): Promise<ProposalDocumentMeta> {
  const client = requireClient();
  const documentId = randomUUID();
  const safeFilename = sanitizeFilename(input.originalFilename);
  const storagePath = `proposals/${input.proposalId}/${documentId}-${safeFilename}`;

  const { error: uploadError } = await client.storage.from(BUCKET).upload(storagePath, input.fileBuffer, {
    contentType: input.mimeType || undefined,
    upsert: false,
  });
  if (uploadError) {
    throw new Error(
      `No se pudo subir el archivo a Supabase Storage (bucket "${BUCKET}"). ¿Existe el bucket ` +
        `y es privado? Detalle: ${uploadError.message}`
    );
  }

  const { data, error: insertError } = await client
    .from(TABLE)
    .insert({
      id: documentId,
      proposal_id: input.proposalId,
      document_type: input.documentType,
      original_filename: input.originalFilename,
      storage_bucket: BUCKET,
      storage_path: storagePath,
      mime_type: input.mimeType ?? null,
      file_size_bytes: input.fileBuffer.length,
      uploaded_from: "internal",
      status: input.status || "Recibido",
      internal_observation: input.internalObservation ?? null,
      is_required: input.isRequired ?? false,
    })
    .select("*")
    .single();

  if (insertError) {
    // El archivo ya se subió a Storage pero la fila de metadata falló: intentamos limpiar el
    // objeto huérfano en Storage (best-effort, no bloquea el error que se reporta).
    await client.storage.from(BUCKET).remove([storagePath]).catch(() => {});
    throw tableAccessError(insertError);
  }

  return rowToMeta(data as ProposalDocumentRow);
}

export async function updateProposalDocument(
  proposalId: string,
  documentId: string,
  patch: { status?: string; internalObservation?: string }
): Promise<ProposalDocumentMeta | null> {
  const existing = await getProposalDocumentForProposal(proposalId, documentId);
  if (!existing) return null;

  const client = requireClient();
  const updatePayload: Record<string, unknown> = {};
  if (patch.status !== undefined) updatePayload.status = patch.status;
  if (patch.internalObservation !== undefined) updatePayload.internal_observation = patch.internalObservation;

  const { data, error } = await client
    .from(TABLE)
    .update(updatePayload)
    .eq("id", documentId)
    .eq("proposal_id", proposalId)
    .select("*")
    .single();
  if (error) throw tableAccessError(error);
  return rowToMeta(data as ProposalDocumentRow);
}

export async function deleteProposalDocument(
  proposalId: string,
  documentId: string
): Promise<ProposalDocumentMeta | null> {
  const existing = await getProposalDocumentForProposal(proposalId, documentId);
  if (!existing) return null;

  const client = requireClient();
  // Best-effort: si falla el borrado en Storage, igual borramos la metadata para no dejar un
  // registro fantasma que el usuario no pueda quitar de la ficha.
  await client.storage.from(existing.storageBucket).remove([existing.storagePath]).catch(() => {});

  const { error } = await client.from(TABLE).delete().eq("id", documentId).eq("proposal_id", proposalId);
  if (error) throw tableAccessError(error);
  return existing;
}

export interface ProposalDocumentSignedUrl {
  url: string;
  originalFilename: string;
}

// Genera una signed URL de corta duración para ver/descargar el documento. Valida que el
// documentId pertenezca a proposalId antes de generar la URL (evita descargar documentos de
// otra propuesta a través de un documentId ajeno).
export async function getProposalDocumentSignedUrl(
  proposalId: string,
  documentId: string,
  expiresInSeconds = 60
): Promise<ProposalDocumentSignedUrl | null> {
  const existing = await getProposalDocumentForProposal(proposalId, documentId);
  if (!existing) return null;

  const client = requireClient();
  const { data, error } = await client.storage
    .from(existing.storageBucket)
    .createSignedUrl(existing.storagePath, expiresInSeconds, {
      download: existing.originalFilename,
    });
  if (error || !data) {
    throw new Error(
      `No se pudo generar la URL firmada para el documento. Detalle: ${error?.message ?? "desconocido"}`
    );
  }
  return { url: data.signedUrl, originalFilename: existing.originalFilename };
}
