// Descarga de un documento real (OPERATIVO-REAL-2): genera una signed URL de corta duración
// contra Supabase Storage y redirige a ella. Nunca expone storage_path ni el nombre del bucket
// directamente al cliente — solo la URL firmada temporal. Valida que documentId pertenezca a
// la propuesta `id` de la URL antes de generar la URL, para que no se pueda descargar un
// documento de otra propuesta usando su documentId.

import { NextResponse } from "next/server";
import { isSupabaseConfigured } from "@/lib/supabase/client";
import { getProposalDocumentSignedUrl } from "@/lib/supabase/proposalDocuments";

interface RouteContext {
  params: Promise<{ id: string; documentId: string }>;
}

export async function GET(_request: Request, { params }: RouteContext) {
  const { id, documentId } = await params;

  if (!isSupabaseConfigured()) {
    return NextResponse.json(
      { error: "Los documentos reales requieren Supabase configurado. No disponible en modo local." },
      { status: 409 }
    );
  }

  try {
    const signed = await getProposalDocumentSignedUrl(id, documentId);
    if (!signed) {
      return NextResponse.json({ error: "Documento no encontrado para esta propuesta." }, { status: 404 });
    }
    return NextResponse.redirect(signed.url);
  } catch (err) {
    const message = err instanceof Error ? err.message : "No se pudo generar el enlace de descarga.";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
