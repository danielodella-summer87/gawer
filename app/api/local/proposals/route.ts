// Persistencia local de desarrollo. No usar como almacenamiento productivo.
//
// Endpoint interno, solo para localhost, sin autenticación (fase OPERATIVO-LOCAL-1/2).
// No hay base de datos ni servicios externos: lee y escribe .local-data/gawer/proposals.json.

import { NextResponse } from "next/server";
import {
  readLocalProposals,
  appendLocalProposal,
  clearLocalProposals,
  createDefaultSeguimiento,
  type LocalProposal,
} from "@/lib/local/proposalsStore";
import {
  calculateLocalProposalAssessment,
  type LocalProposalInput,
} from "@/lib/local/proposalAssessment";
import { generateDocumentChecklist } from "@/lib/local/documentChecklist";

export async function GET() {
  const proposals = await readLocalProposals();
  return NextResponse.json({ proposals });
}

export async function POST(request: Request) {
  let body: Partial<LocalProposalInput> | null = null;
  try {
    body = await request.json();
  } catch {
    body = null;
  }

  if (!body) {
    return NextResponse.json({ error: "Payload inválido." }, { status: 400 });
  }

  const missing: string[] = [];
  if (!body.nombreCompleto?.trim()) missing.push("nombre completo");
  if (!body.email?.trim()) missing.push("email");
  if (!body.areaNegocio?.trim()) missing.push("área de negocio");
  if (!body.descripcionOperacion?.trim()) missing.push("descripción de la operación");
  if (!body.declaracionVeracidad || !body.declaracionSinCompromiso) {
    missing.push("aceptación de la declaración");
  }

  if (missing.length > 0) {
    return NextResponse.json(
      { error: `Faltan campos obligatorios: ${missing.join(", ")}.` },
      { status: 400 }
    );
  }

  const input = body as LocalProposalInput;
  const assessment = calculateLocalProposalAssessment(input);
  const createdAt = new Date().toISOString();

  const proposal: LocalProposal = {
    id: `local-prop-${Date.now()}`,
    createdAt,
    source: "local_public_form",
    input,
    assessment,
    seguimiento: createDefaultSeguimiento(),
    historial: [
      {
        id: `hist-${Date.now()}-creacion`,
        at: createdAt,
        type: "creacion",
        label: "Propuesta recibida desde formulario público local",
      },
    ],
    documentChecklist: generateDocumentChecklist(input),
  };

  await appendLocalProposal(proposal);

  return NextResponse.json({ proposal }, { status: 201 });
}

export async function DELETE() {
  await clearLocalProposals();
  return NextResponse.json({ ok: true });
}
