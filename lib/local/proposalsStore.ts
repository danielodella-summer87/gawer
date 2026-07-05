// Persistencia local de desarrollo. No usar como almacenamiento productivo.
//
// Guarda propuestas del formulario público en un archivo JSON dentro de .local-data/,
// carpeta ignorada por Git. No hay base de datos, no hay Supabase, no hay servicios externos.
// Pensado únicamente para validar el flujo end-to-end en localhost antes de una fase con
// persistencia real. No es seguro para concurrencia ni para producción.

import { promises as fs } from "fs";
import path from "path";
import type { LocalProposalInput, LocalProposalAssessment } from "./proposalAssessment";

export interface LocalProposal {
  id: string;
  createdAt: string;
  source: "local_public_form";
  input: LocalProposalInput;
  assessment: LocalProposalAssessment;
}

const DATA_DIR = path.join(process.cwd(), ".local-data", "gawer");
const DATA_FILE = path.join(DATA_DIR, "proposals.json");

export async function readLocalProposals(): Promise<LocalProposal[]> {
  try {
    const raw = await fs.readFile(DATA_FILE, "utf-8");
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
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
