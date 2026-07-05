// Persistencia local de desarrollo. No usar como almacenamiento productivo.
//
// Endpoint interno, solo para localhost, sin autenticación (fase OPERATIVO-LOCAL-2/3/4/5).
// Actualiza campos de seguimiento interno (estado comercial, responsable, próxima acción, nota),
// el checklist documental, marca la propuesta para revisión Fernando/Liliana (briefing
// ejecutivo), o registra que se copió un borrador de respuesta al proponente. Registra el
// evento correspondiente en el historial. No afecta propuestas mock ni requiere base de datos.
// No envía mensajes reales ni se conecta con servicios externos.

import { NextResponse } from "next/server";
import {
  updateLocalProposalSeguimiento,
  updateLocalProposalDocumentChecklist,
  markLocalProposalForExecutiveReview,
  logResponseDraftCopy,
  type LocalProposalSeguimientoPatch,
} from "@/lib/local/proposalsStore";
import type { DocumentChecklistItem } from "@/lib/local/documentChecklist";

interface RouteContext {
  params: Promise<{ id: string }>;
}

interface DocumentChecklistPatchBody {
  documentChecklist: DocumentChecklistItem[];
}

interface EscalatePatchBody {
  action: "mark_for_executive_review";
}

interface LogResponseDraftPatchBody {
  action: "log_response_draft_copy";
  draftTitle: string;
}

type ActionPatchBody = EscalatePatchBody | LogResponseDraftPatchBody;

type PatchBody = ActionPatchBody | DocumentChecklistPatchBody | LocalProposalSeguimientoPatch;

function isEscalatePatch(body: unknown): body is EscalatePatchBody {
  return (
    !!body && typeof body === "object" && (body as EscalatePatchBody).action === "mark_for_executive_review"
  );
}

function isLogResponseDraftPatch(body: unknown): body is LogResponseDraftPatchBody {
  return (
    !!body &&
    typeof body === "object" &&
    (body as LogResponseDraftPatchBody).action === "log_response_draft_copy" &&
    typeof (body as LogResponseDraftPatchBody).draftTitle === "string"
  );
}

function isDocumentChecklistPatch(body: unknown): body is DocumentChecklistPatchBody {
  return (
    !!body &&
    typeof body === "object" &&
    Array.isArray((body as DocumentChecklistPatchBody).documentChecklist)
  );
}

export async function PATCH(request: Request, { params }: RouteContext) {
  const { id } = await params;

  let body: PatchBody | null = null;
  try {
    body = await request.json();
  } catch {
    body = null;
  }

  if (!body) {
    return NextResponse.json({ error: "Payload inválido." }, { status: 400 });
  }

  if (isEscalatePatch(body)) {
    const updated = await markLocalProposalForExecutiveReview(id);
    if (!updated) {
      return NextResponse.json({ error: "Propuesta local no encontrada." }, { status: 404 });
    }
    return NextResponse.json({ proposal: updated });
  }

  if (isLogResponseDraftPatch(body)) {
    const updated = await logResponseDraftCopy(id, body.draftTitle);
    if (!updated) {
      return NextResponse.json({ error: "Propuesta local no encontrada." }, { status: 404 });
    }
    return NextResponse.json({ proposal: updated });
  }

  if (isDocumentChecklistPatch(body)) {
    const updated = await updateLocalProposalDocumentChecklist(id, body.documentChecklist);
    if (!updated) {
      return NextResponse.json({ error: "Propuesta local no encontrada." }, { status: 404 });
    }
    return NextResponse.json({ proposal: updated });
  }

  const updated = await updateLocalProposalSeguimiento(id, body as LocalProposalSeguimientoPatch);
  if (!updated) {
    return NextResponse.json({ error: "Propuesta local no encontrada." }, { status: 404 });
  }
  return NextResponse.json({ proposal: updated });
}
