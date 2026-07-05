// Repositorio unificado de propuestas (OPERATIVO-REAL-1).
//
// Punto único de acceso a datos para las API routes y las páginas que leen propuestas reales
// (no mock). En cada llamada decide si usa el modo Supabase o el modo local según
// isSupabaseConfigured(): mientras las variables de entorno de Supabase no estén configuradas,
// todo funciona exactamente igual que antes (modo local, sin cambios de comportamiento). El
// modo Supabase además requiere haber aplicado manualmente la migración SQL
// (docs/supabase/OPERATIVO-REAL-1-proposals-schema.sql), que no se ejecuta automáticamente.

import { isSupabaseConfigured } from "@/lib/supabase/client";
import {
  readLocalProposals,
  getLocalProposalById,
  appendLocalProposal,
  clearLocalProposals,
  updateLocalProposalSeguimiento,
  updateLocalProposalDocumentChecklist,
  markLocalProposalForExecutiveReview,
  logResponseDraftCopy as logLocalResponseDraftCopy,
  createDefaultSeguimiento,
  type LocalProposal,
  type LocalProposalSeguimientoPatch,
} from "@/lib/local/proposalsStore";
import {
  readSupabaseProposals,
  getSupabaseProposalById,
  createSupabaseProposal,
  clearSupabaseProposals,
  updateSupabaseProposalSeguimiento,
  updateSupabaseProposalDocumentChecklist,
  markSupabaseProposalForExecutiveReview,
  logSupabaseResponseDraftCopy,
} from "@/lib/supabase/proposalsStore";
import {
  calculateLocalProposalAssessment,
  type LocalProposalInput,
} from "@/lib/local/proposalAssessment";
import { generateDocumentChecklist, type DocumentChecklistItem } from "@/lib/local/documentChecklist";

export { isSupabaseConfigured };

export async function readAllProposals(): Promise<LocalProposal[]> {
  return isSupabaseConfigured() ? readSupabaseProposals() : readLocalProposals();
}

export async function getProposalById(id: string): Promise<LocalProposal | undefined> {
  return isSupabaseConfigured() ? getSupabaseProposalById(id) : getLocalProposalById(id);
}

export async function createProposal(input: LocalProposalInput): Promise<LocalProposal> {
  const assessment = calculateLocalProposalAssessment(input);

  if (isSupabaseConfigured()) {
    return createSupabaseProposal(input, assessment);
  }

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
  return proposal;
}

export async function clearAllProposals(): Promise<void> {
  return isSupabaseConfigured() ? clearSupabaseProposals() : clearLocalProposals();
}

export async function updateProposalSeguimiento(
  id: string,
  patch: LocalProposalSeguimientoPatch
): Promise<LocalProposal | null> {
  return isSupabaseConfigured()
    ? updateSupabaseProposalSeguimiento(id, patch)
    : updateLocalProposalSeguimiento(id, patch);
}

export async function updateProposalDocumentChecklist(
  id: string,
  items: DocumentChecklistItem[]
): Promise<LocalProposal | null> {
  return isSupabaseConfigured()
    ? updateSupabaseProposalDocumentChecklist(id, items)
    : updateLocalProposalDocumentChecklist(id, items);
}

export async function markProposalForExecutiveReview(id: string): Promise<LocalProposal | null> {
  return isSupabaseConfigured()
    ? markSupabaseProposalForExecutiveReview(id)
    : markLocalProposalForExecutiveReview(id);
}

export async function logProposalResponseDraftCopy(
  id: string,
  draftTitle: string
): Promise<LocalProposal | null> {
  return isSupabaseConfigured()
    ? logSupabaseResponseDraftCopy(id, draftTitle)
    : logLocalResponseDraftCopy(id, draftTitle);
}
