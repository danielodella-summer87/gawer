// Documentos reales de una propuesta — Supabase Storage + metadata (OPERATIVO-REAL-2).
//
// No hay modo local equivalente: esta funcionalidad requiere Supabase configurado y la
// migración de docs/supabase/OPERATIVO-REAL-2-documents-storage-schema.sql ya aplicada
// manualmente. Si Supabase no está configurado, GET devuelve una lista vacía con
// `configured: false`; las mutaciones (POST) devuelven un error claro en vez de intentar nada.

import { NextResponse } from "next/server";
import { isSupabaseConfigured } from "@/lib/supabase/client";
import { listProposalDocuments, uploadProposalDocument } from "@/lib/supabase/proposalDocuments";
import { appendSupabaseProposalHistorialEvent } from "@/lib/supabase/proposalsStore";
import { getProposalById } from "@/lib/data/proposalsRepository";
import { documentChecklistStatusOptions } from "@/lib/local/documentChecklist";

interface RouteContext {
  params: Promise<{ id: string }>;
}

function errorResponse(err: unknown, fallback: string, status = 500) {
  const message = err instanceof Error ? err.message : fallback;
  return NextResponse.json({ error: message }, { status });
}

export async function GET(_request: Request, { params }: RouteContext) {
  const { id } = await params;

  if (!isSupabaseConfigured()) {
    return NextResponse.json({ documents: [], configured: false });
  }

  try {
    const documents = await listProposalDocuments(id);
    return NextResponse.json({ documents, configured: true });
  } catch (err) {
    return errorResponse(err, "No se pudieron leer los documentos de la propuesta.");
  }
}

export async function POST(request: Request, { params }: RouteContext) {
  const { id } = await params;

  if (!isSupabaseConfigured()) {
    return NextResponse.json(
      { error: "Los documentos reales requieren Supabase configurado. No disponible en modo local." },
      { status: 409 }
    );
  }

  const proposal = await getProposalById(id);
  if (!proposal) {
    return NextResponse.json({ error: "Propuesta no encontrada." }, { status: 404 });
  }

  let formData: FormData;
  try {
    formData = await request.formData();
  } catch {
    return NextResponse.json(
      { error: "Payload inválido. Se espera multipart/form-data." },
      { status: 400 }
    );
  }

  const file = formData.get("file");
  const documentType = formData.get("documentType");
  const statusRaw = formData.get("status");
  const internalObservationRaw = formData.get("internalObservation");
  const isRequiredRaw = formData.get("isRequired");

  if (!(file instanceof File)) {
    return NextResponse.json({ error: "Falta el archivo a subir." }, { status: 400 });
  }
  if (typeof documentType !== "string" || !documentType.trim()) {
    return NextResponse.json({ error: "Falta el tipo de documento (documentType)." }, { status: 400 });
  }

  const status =
    typeof statusRaw === "string" && (documentChecklistStatusOptions as string[]).includes(statusRaw)
      ? statusRaw
      : undefined;
  const internalObservation =
    typeof internalObservationRaw === "string" ? internalObservationRaw : undefined;
  const isRequired = isRequiredRaw === "true";

  try {
    const fileBuffer = Buffer.from(await file.arrayBuffer());

    const document = await uploadProposalDocument({
      proposalId: id,
      documentType,
      fileBuffer,
      originalFilename: file.name,
      mimeType: file.type || undefined,
      status,
      internalObservation,
      isRequired,
    });

    await appendSupabaseProposalHistorialEvent(id, {
      type: "documento",
      label: `Documento cargado: ${documentType}`,
    });

    return NextResponse.json({ document }, { status: 201 });
  } catch (err) {
    return errorResponse(err, "No se pudo subir el documento.");
  }
}
