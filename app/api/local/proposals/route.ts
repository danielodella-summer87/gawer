// Persistencia local de desarrollo. No usar como almacenamiento productivo.
//
// Endpoint interno, solo para localhost, sin autenticación (fase OPERATIVO-LOCAL-1/2).
// No hay base de datos ni servicios externos: lee y escribe .local-data/gawer/proposals.json.

import { NextResponse } from "next/server";
import {
  readAllProposals,
  createProposal,
  clearAllProposals,
  isSupabaseConfigured,
} from "@/lib/data/proposalsRepository";
import type { LocalProposalInput } from "@/lib/local/proposalAssessment";

export async function GET() {
  const proposals = await readAllProposals();
  return NextResponse.json({ proposals, mode: isSupabaseConfigured() ? "supabase" : "local" });
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
  const proposal = await createProposal(input);
  const mode = isSupabaseConfigured() ? "supabase" : "local";

  return NextResponse.json(
    { proposal, mode, source: proposal.source, id: proposal.id },
    { status: 201 }
  );
}

// La limpieza masiva está deshabilitada en modo Supabase: este endpoint no debe poder borrar
// propuestas reales. No hay ningún mecanismo de confirmación técnica adicional implementado a
// propósito — reactivar esto requeriría una decisión explícita, no solo llamar al endpoint.
export async function DELETE() {
  if (isSupabaseConfigured()) {
    return NextResponse.json(
      {
        error:
          "La limpieza masiva está deshabilitada en modo Supabase para proteger propuestas reales.",
      },
      { status: 403 }
    );
  }
  await clearAllProposals();
  return NextResponse.json({ ok: true });
}
