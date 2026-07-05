// Persistencia local de desarrollo. No usar como almacenamiento productivo.
//
// Endpoint interno, solo para localhost, sin autenticación (fase OPERATIVO-LOCAL-2).
// Actualiza únicamente los campos de seguimiento interno de una propuesta local
// (estado comercial, responsable, próxima acción, nota) y registra el evento en su historial.
// No afecta propuestas mock ni requiere base de datos.

import { NextResponse } from "next/server";
import {
  updateLocalProposalSeguimiento,
  type LocalProposalSeguimientoPatch,
} from "@/lib/local/proposalsStore";

interface RouteContext {
  params: Promise<{ id: string }>;
}

export async function PATCH(request: Request, { params }: RouteContext) {
  const { id } = await params;

  let body: LocalProposalSeguimientoPatch | null = null;
  try {
    body = await request.json();
  } catch {
    body = null;
  }

  if (!body) {
    return NextResponse.json({ error: "Payload inválido." }, { status: 400 });
  }

  const updated = await updateLocalProposalSeguimiento(id, body);

  if (!updated) {
    return NextResponse.json({ error: "Propuesta local no encontrada." }, { status: 404 });
  }

  return NextResponse.json({ proposal: updated });
}
