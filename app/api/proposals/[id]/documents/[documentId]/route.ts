// Actualización/eliminación de un documento real de una propuesta (OPERATIVO-REAL-2).
//
// Ambos handlers validan que documentId pertenezca a la propuesta `id` de la URL antes de
// tocar nada (vía updateProposalDocument/deleteProposalDocument, que hacen esa verificación),
// para evitar que un documentId de otra propuesta pueda modificarse o borrarse desde acá.

import { NextResponse } from "next/server";
import { isSupabaseConfigured } from "@/lib/supabase/client";
import { updateProposalDocument, deleteProposalDocument } from "@/lib/supabase/proposalDocuments";
import { appendSupabaseProposalHistorialEvent } from "@/lib/supabase/proposalsStore";
import { documentChecklistStatusOptions } from "@/lib/local/documentChecklist";

interface RouteContext {
  params: Promise<{ id: string; documentId: string }>;
}

interface PatchBody {
  status?: string;
  internalObservation?: string;
}

function errorResponse(err: unknown, fallback: string, status = 500) {
  const message = err instanceof Error ? err.message : fallback;
  return NextResponse.json({ error: message }, { status });
}

function unconfiguredResponse() {
  return NextResponse.json(
    { error: "Los documentos reales requieren Supabase configurado. No disponible en modo local." },
    { status: 409 }
  );
}

export async function PATCH(request: Request, { params }: RouteContext) {
  const { id, documentId } = await params;

  if (!isSupabaseConfigured()) return unconfiguredResponse();

  let body: PatchBody | null = null;
  try {
    body = await request.json();
  } catch {
    body = null;
  }
  if (!body) {
    return NextResponse.json({ error: "Payload inválido." }, { status: 400 });
  }

  if (body.status !== undefined && !(documentChecklistStatusOptions as string[]).includes(body.status)) {
    return NextResponse.json({ error: `Estado de documento inválido: ${body.status}.` }, { status: 400 });
  }

  try {
    const updated = await updateProposalDocument(id, documentId, {
      status: body.status,
      internalObservation: body.internalObservation,
    });
    if (!updated) {
      return NextResponse.json({ error: "Documento no encontrado para esta propuesta." }, { status: 404 });
    }

    const detailParts: string[] = [];
    if (body.status !== undefined) detailParts.push(`estado: ${body.status}`);
    if (body.internalObservation !== undefined) detailParts.push("observación actualizada");
    await appendSupabaseProposalHistorialEvent(id, {
      type: "documento",
      label: `Documento actualizado: ${updated.documentType}`,
      details: detailParts.length > 0 ? detailParts.join(" · ") : undefined,
    });

    return NextResponse.json({ document: updated });
  } catch (err) {
    return errorResponse(err, "No se pudo actualizar el documento.");
  }
}

export async function DELETE(_request: Request, { params }: RouteContext) {
  const { id, documentId } = await params;

  if (!isSupabaseConfigured()) return unconfiguredResponse();

  try {
    const deleted = await deleteProposalDocument(id, documentId);
    if (!deleted) {
      return NextResponse.json({ error: "Documento no encontrado para esta propuesta." }, { status: 404 });
    }

    await appendSupabaseProposalHistorialEvent(id, {
      type: "documento",
      label: `Documento eliminado: ${deleted.documentType}`,
      details: deleted.originalFilename,
    });

    return NextResponse.json({ ok: true });
  } catch (err) {
    return errorResponse(err, "No se pudo eliminar el documento.");
  }
}
