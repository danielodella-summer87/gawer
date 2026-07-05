// Persistencia local de desarrollo. No usar como almacenamiento productivo.
//
// Guarda propuestas del formulario público en un archivo JSON dentro de .local-data/,
// carpeta ignorada por Git. No hay base de datos, no hay Supabase, no hay servicios externos.
// Pensado únicamente para validar el flujo end-to-end en localhost antes de una fase con
// persistencia real. No es seguro para concurrencia ni para producción.

import { promises as fs } from "fs";
import path from "path";
import type { LocalProposalInput, LocalProposalAssessment } from "./proposalAssessment";
import type { ProposalStatus } from "@/lib/mock/gawerData";

export interface LocalProposalHistorialEvento {
  id: string;
  at: string;
  type: "creacion" | "estado" | "responsable" | "proxima_accion" | "nota";
  label: string;
  details?: string;
}

// Seguimiento = estado comercial oficial gestionado por el equipo GAWER.
// Distinto de `assessment` (recomendación preliminar del sistema, nunca vinculante).
export interface LocalProposalSeguimiento {
  estadoComercial: ProposalStatus;
  responsableInterno: string;
  proximaAccion: string;
  fechaProximaAccion: string;
  notaInterna: string;
}

export interface LocalProposalSeguimientoPatch {
  estadoComercial?: ProposalStatus;
  responsableInterno?: string;
  proximaAccion?: string;
  fechaProximaAccion?: string;
  notaInterna?: string;
}

export interface LocalProposal {
  id: string;
  createdAt: string;
  source: "local_public_form";
  input: LocalProposalInput;
  assessment: LocalProposalAssessment;
  seguimiento: LocalProposalSeguimiento;
  historial: LocalProposalHistorialEvento[];
}

export function createDefaultSeguimiento(): LocalProposalSeguimiento {
  return {
    estadoComercial: "Nueva propuesta recibida",
    responsableInterno: "",
    proximaAccion: "",
    fechaProximaAccion: "",
    notaInterna: "",
  };
}

const DATA_DIR = path.join(process.cwd(), ".local-data", "gawer");
const DATA_FILE = path.join(DATA_DIR, "proposals.json");

// Normaliza registros guardados antes de agregar seguimiento/historial (fase OPERATIVO-LOCAL-2),
// para no romper si el archivo local ya tenía propuestas de una fase anterior.
function normalize(raw: unknown): LocalProposal[] {
  if (!Array.isArray(raw)) return [];
  return (raw as Partial<LocalProposal>[]).map((p) => ({
    ...(p as LocalProposal),
    seguimiento: p.seguimiento ?? createDefaultSeguimiento(),
    historial: Array.isArray(p.historial) ? p.historial : [],
  }));
}

export async function readLocalProposals(): Promise<LocalProposal[]> {
  try {
    const raw = await fs.readFile(DATA_FILE, "utf-8");
    return normalize(JSON.parse(raw));
  } catch (err: unknown) {
    if ((err as NodeJS.ErrnoException)?.code === "ENOENT") return [];
    throw err;
  }
}

export async function getLocalProposalById(id: string): Promise<LocalProposal | undefined> {
  const proposals = await readLocalProposals();
  return proposals.find((p) => p.id === id);
}

async function writeLocalProposals(proposals: LocalProposal[]): Promise<void> {
  await fs.mkdir(DATA_DIR, { recursive: true });
  await fs.writeFile(DATA_FILE, JSON.stringify(proposals, null, 2), "utf-8");
}

export async function appendLocalProposal(proposal: LocalProposal): Promise<LocalProposal> {
  const proposals = await readLocalProposals();
  proposals.unshift(proposal);
  await writeLocalProposals(proposals);
  return proposal;
}

export async function clearLocalProposals(): Promise<void> {
  await writeLocalProposals([]);
}

export async function updateLocalProposalSeguimiento(
  id: string,
  patch: LocalProposalSeguimientoPatch
): Promise<LocalProposal | null> {
  const proposals = await readLocalProposals();
  const index = proposals.findIndex((p) => p.id === id);
  if (index === -1) return null;

  const proposal = proposals[index];
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

  proposals[index] = updated;
  await writeLocalProposals(proposals);
  return updated;
}
