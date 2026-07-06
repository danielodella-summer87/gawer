// Persistencia real en Supabase (OPERATIVO-REAL-1).
//
// Espeja la superficie de lib/local/proposalsStore.ts pero contra la tabla
// public.gawer_proposals (ver docs/supabase/OPERATIVO-REAL-1-proposals-schema.sql). Solo se
// usa cuando isSupabaseConfigured() es true; ver lib/data/proposalsRepository.ts para el
// switch entre modo local y modo Supabase.
//
// Requiere que la migración SQL haya sido aplicada manualmente de antemano. Si la tabla no
// existe todavía, las funciones de este archivo lanzan un error explícito en vez de fallar de
// forma opaca.

import { getSupabaseAdminClient } from "./client";
import type { LocalProposalInput, LocalProposalAssessment } from "@/lib/local/proposalAssessment";
import {
  createDefaultSeguimiento,
  type LocalProposal,
  type LocalProposalSeguimiento,
  type LocalProposalSeguimientoPatch,
  type LocalProposalHistorialEvento,
} from "@/lib/local/proposalsStore";
import { generateDocumentChecklist, type DocumentChecklistItem } from "@/lib/local/documentChecklist";

const TABLE = "gawer_proposals";

interface GawerProposalRow {
  id: string;
  created_at: string;
  source: string;
  input: LocalProposalInput;
  assessment: LocalProposalAssessment;
  seguimiento: LocalProposalSeguimiento;
  document_checklist: DocumentChecklistItem[];
  historial: LocalProposalHistorialEvento[];
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
    `No se pudo acceder a public.gawer_proposals. ¿Se aplicó la migración SQL ` +
      `(docs/supabase/OPERATIVO-REAL-1-proposals-schema.sql)? Detalle: ${error.message}`
  );
}

function rowToProposal(row: GawerProposalRow): LocalProposal {
  return {
    id: row.id,
    createdAt: row.created_at,
    source: row.source as LocalProposal["source"],
    input: row.input,
    assessment: row.assessment,
    seguimiento: row.seguimiento,
    documentChecklist: row.document_checklist,
    historial: row.historial,
  };
}

export async function readSupabaseProposals(): Promise<LocalProposal[]> {
  const client = requireClient();
  const { data, error } = await client
    .from(TABLE)
    .select("*")
    .order("created_at", { ascending: false });
  if (error) throw tableAccessError(error);
  return ((data ?? []) as GawerProposalRow[]).map(rowToProposal);
}

export async function getSupabaseProposalById(id: string): Promise<LocalProposal | undefined> {
  const client = requireClient();
  const { data, error } = await client.from(TABLE).select("*").eq("id", id).maybeSingle();
  if (error) throw tableAccessError(error);
  return data ? rowToProposal(data as GawerProposalRow) : undefined;
}

export async function createSupabaseProposal(
  input: LocalProposalInput,
  assessment: LocalProposalAssessment
): Promise<LocalProposal> {
  const client = requireClient();
  const now = new Date().toISOString();
  const historial: LocalProposalHistorialEvento[] = [
    {
      id: `hist-${Date.now()}-creacion`,
      at: now,
      type: "creacion",
      label: "Propuesta recibida desde formulario público (Supabase)",
    },
  ];

  const { data, error } = await client
    .from(TABLE)
    .insert({
      source: "supabase_public_form",
      input,
      assessment,
      seguimiento: createDefaultSeguimiento(),
      document_checklist: generateDocumentChecklist(input),
      historial,
    })
    .select("*")
    .single();

  if (error) throw tableAccessError(error);
  return rowToProposal(data as GawerProposalRow);
}

export async function clearSupabaseProposals(): Promise<void> {
  const client = requireClient();
  // Borra todas las filas — mismo alcance que clearLocalProposals() en modo local, solo
  // pensado para uso de desarrollo/QA. Supabase exige un WHERE explícito en los DELETE.
  const { error } = await client
    .from(TABLE)
    .delete()
    .neq("id", "00000000-0000-0000-0000-000000000000");
  if (error) throw tableAccessError(error);
}

export async function updateSupabaseProposalSeguimiento(
  id: string,
  patch: LocalProposalSeguimientoPatch
): Promise<LocalProposal | null> {
  const proposal = await getSupabaseProposalById(id);
  if (!proposal) return null;

  const seguimientoActual = proposal.seguimiento;
  const now = new Date().toISOString();
  const eventos: LocalProposalHistorialEvento[] = [];

  if (
    patch.estadoComercial !== undefined &&
    patch.estadoComercial !== seguimientoActual.estadoComercial
  ) {
    eventos.push({
      id: `hist-${Date.now()}-estado`,
      at: now,
      type: "estado",
      label: `Estado actualizado a ${patch.estadoComercial}`,
    });
  }

  if (
    patch.responsableInterno !== undefined &&
    patch.responsableInterno.trim() &&
    patch.responsableInterno !== seguimientoActual.responsableInterno
  ) {
    eventos.push({
      id: `hist-${Date.now()}-responsable`,
      at: now,
      type: "responsable",
      label: `Responsable asignado: ${patch.responsableInterno}`,
    });
  }

  const accionCambio =
    patch.proximaAccion !== undefined && patch.proximaAccion !== seguimientoActual.proximaAccion;
  const fechaCambio =
    patch.fechaProximaAccion !== undefined &&
    patch.fechaProximaAccion !== seguimientoActual.fechaProximaAccion;
  if ((accionCambio || fechaCambio) && patch.proximaAccion?.trim()) {
    eventos.push({
      id: `hist-${Date.now()}-accion`,
      at: now,
      type: "proxima_accion",
      label: `Próxima acción definida: ${patch.proximaAccion}`,
      details: patch.fechaProximaAccion ? `Fecha objetivo: ${patch.fechaProximaAccion}` : undefined,
    });
  }

  if (
    patch.notaInterna !== undefined &&
    patch.notaInterna.trim() &&
    patch.notaInterna !== seguimientoActual.notaInterna
  ) {
    eventos.push({
      id: `hist-${Date.now()}-nota`,
      at: now,
      type: "nota",
      label: "Nota interna agregada",
      details: patch.notaInterna,
    });
  }

  const updated: LocalProposal = {
    ...proposal,
    seguimiento: { ...seguimientoActual, ...patch },
    historial: [...proposal.historial, ...eventos],
  };

  const client = requireClient();
  const { error } = await client
    .from(TABLE)
    .update({ seguimiento: updated.seguimiento, historial: updated.historial })
    .eq("id", id);
  if (error) throw tableAccessError(error);
  return updated;
}

export async function updateSupabaseProposalDocumentChecklist(
  id: string,
  items: DocumentChecklistItem[]
): Promise<LocalProposal | null> {
  const proposal = await getSupabaseProposalById(id);
  if (!proposal) return null;

  const anterior = proposal.documentChecklist;
  const now = new Date().toISOString();

  const cambios: { nombre: string; estado: string }[] = [];
  const itemsActualizados = items.map((item) => {
    const prev = anterior.find((a) => a.id === item.id);
    const estadoCambio = !prev || prev.estado !== item.estado;
    const observacionCambio = !prev || prev.observacion !== item.observacion;
    if (estadoCambio) {
      cambios.push({ nombre: item.nombre, estado: item.estado });
    }
    return {
      ...item,
      actualizadoAt: estadoCambio || observacionCambio ? now : item.actualizadoAt,
    };
  });

  const eventos: LocalProposalHistorialEvento[] = [];
  if (cambios.length > 0 && cambios.length <= 3) {
    cambios.forEach((c, i) => {
      eventos.push({
        id: `hist-${Date.now()}-doc-${i}`,
        at: now,
        type: "documento",
        label: `${c.nombre} marcado como ${c.estado}`,
      });
    });
  } else if (cambios.length > 3) {
    eventos.push({
      id: `hist-${Date.now()}-doc-resumen`,
      at: now,
      type: "documento",
      label: `Checklist documental actualizado (${cambios.length} documentos)`,
    });
  }

  const updated: LocalProposal = {
    ...proposal,
    documentChecklist: itemsActualizados,
    historial: [...proposal.historial, ...eventos],
  };

  const client = requireClient();
  const { error } = await client
    .from(TABLE)
    .update({ document_checklist: updated.documentChecklist, historial: updated.historial })
    .eq("id", id);
  if (error) throw tableAccessError(error);
  return updated;
}

export async function markSupabaseProposalForExecutiveReview(
  id: string
): Promise<LocalProposal | null> {
  const proposal = await getSupabaseProposalById(id);
  if (!proposal) return null;

  const now = new Date().toISOString();
  const updated: LocalProposal = {
    ...proposal,
    seguimiento: { ...proposal.seguimiento, estadoComercial: "Revisión ejecutiva Fernando/Liliana" },
    historial: [
      ...proposal.historial,
      {
        id: `hist-${Date.now()}-escalamiento`,
        at: now,
        type: "escalamiento",
        label: "Propuesta marcada para revisión Fernando/Liliana",
      },
    ],
  };

  const client = requireClient();
  const { error } = await client
    .from(TABLE)
    .update({ seguimiento: updated.seguimiento, historial: updated.historial })
    .eq("id", id);
  if (error) throw tableAccessError(error);
  return updated;
}

// Agrega un evento genérico al historial de una propuesta (OPERATIVO-REAL-2). Usado por el
// flujo de documentos reales (carga, actualización, eliminación) para dejar constancia sin
// necesitar una función dedicada por cada acción, como sí existen para seguimiento/checklist.
export async function appendSupabaseProposalHistorialEvent(
  id: string,
  event: Pick<LocalProposalHistorialEvento, "type" | "label" | "details">
): Promise<LocalProposal | null> {
  const proposal = await getSupabaseProposalById(id);
  if (!proposal) return null;

  const now = new Date().toISOString();
  const updated: LocalProposal = {
    ...proposal,
    historial: [
      ...proposal.historial,
      {
        id: `hist-${Date.now()}-${event.type}`,
        at: now,
        ...event,
      },
    ],
  };

  const client = requireClient();
  const { error } = await client.from(TABLE).update({ historial: updated.historial }).eq("id", id);
  if (error) throw tableAccessError(error);
  return updated;
}

export async function logSupabaseResponseDraftCopy(
  id: string,
  draftTitle: string
): Promise<LocalProposal | null> {
  const proposal = await getSupabaseProposalById(id);
  if (!proposal) return null;

  const now = new Date().toISOString();
  const updated: LocalProposal = {
    ...proposal,
    historial: [
      ...proposal.historial,
      {
        id: `hist-${Date.now()}-respuesta`,
        at: now,
        type: "respuesta_copiada",
        label: `Borrador de respuesta copiado: ${draftTitle}`,
      },
    ],
  };

  const client = requireClient();
  const { error } = await client.from(TABLE).update({ historial: updated.historial }).eq("id", id);
  if (error) throw tableAccessError(error);
  return updated;
}
