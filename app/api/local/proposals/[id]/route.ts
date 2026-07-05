// Persistencia local de desarrollo. No usar como almacenamiento productivo.
//
// Endpoint interno, solo para localhost, sin autenticación (fase OPERATIVO-LOCAL-2/3).
// Actualiza campos de seguimiento interno (estado comercial, responsable, próxima acción, nota)
// o el checklist documental de una propuesta local, y registra el evento correspondiente en su
// historial. No afecta propuestas mock ni requiere base de datos.

import { NextResponse } from "next/server";
import {
  updateLocalProposalSeguimiento,
  updateLocalProposalDocumentChecklist,
  type LocalProposalSeguimientoPatch,
} from "@/lib/local/proposalsStore";
import type { DocumentChecklistItem } from "@/lib/local/documentChecklist";

interface RouteContext {
  params: Promise<{ id: string }>;
}

interface DocumentChecklistPatchBody {
  documentChecklist: DocumentChecklistItem[];
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

  let body: DocumentChecklistPatchBody | LocalProposalSeguimientoPatch | null = null;
  try {
    body = await request.json();
  } catch {
    body = null;
  }

  if (!body) {
    return NextResponse.json({ error: "Payload inválido." }, { status: 400 });
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
