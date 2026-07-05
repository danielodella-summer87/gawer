// Persistencia local de desarrollo. No usar como almacenamiento productivo.
//
// Reportes operativos locales — 100% cálculo determinístico sobre propuestas guardadas en
// .local-data/gawer/proposals.json. NO es IA. No se mezcla con datos mock ni productivos.

import type { LocalProposal } from "./proposalsStore";
import { publicFormAreaOptions, commercialStates } from "@/lib/mock/gawerData";
import { summarizeChecklist } from "./documentChecklist";
import {
  buildOperationalInboxRow,
  type OperationalInboxRow,
} from "./operationalInbox";

function faltaCis(p: LocalProposal): boolean {
  const cisItem = p.documentChecklist?.find((i) => i.id === "cis");
  return !cisItem || cisItem.estado === "Pendiente";
}
function faltaAccesoDirecto(p: LocalProposal): boolean {
  return p.input.accesoDirecto !== "Sí";
}
function faltaMandato(p: LocalProposal): boolean {
  return p.input.mandato !== "Sí";
}
function esRiesgoCritico(p: LocalProposal): boolean {
  return p.assessment.riesgo === "Crítico";
}
function esMtnCritico(p: LocalProposal): boolean {
  return p.input.mtnHsbcLtn === "Sí";
}
function esCadenaAlta(p: LocalProposal): boolean {
  return p.input.cantidadIntermediarios === "3 o más" || p.input.cantidadIntermediarios === "Desconocido";
}
function esDocumentacionInsuficiente(p: LocalProposal): boolean {
  return summarizeChecklist(p.documentChecklist ?? []).nivelPreparacion !== "Alto";
}
function esInformacionEsencialIncompleta(p: LocalProposal): boolean {
  return (
    !p.input.montoEstimado ||
    !p.input.jurisdiccionPrincipal?.trim() ||
    !p.input.descripcionOperacion?.trim()
  );
}

export interface LocalReportsKpis {
  totalPropuestasLocales: number;
  listasFernandoLiliana: number;
  enPreparacion: number;
  noListas: number;
  pendientesCis: number;
  conAccesoDirectoConfirmado: number;
  sinAccesoNiMandato: number;
  riesgoCritico: number;
  documentacionBaja: number;
  documentacionMedia: number;
  documentacionAlta: number;
  respuestasSugeridasCopiadas: number;
  conProximaAccion: number;
  sinResponsable: number;
  marcadasRevisionEjecutiva: number;
}

export interface BlockingReasonsCount {
  faltaCis: number;
  faltaAccesoDirecto: number;
  faltaMandato: number;
  documentacionInsuficiente: number;
  riesgoCritico: number;
  mtnHsbcLtn: number;
  cadenaIntermediacionAlta: number;
  informacionEsencialIncompleta: number;
}

export interface AreaCount {
  area: string;
  count: number;
}

export interface EstadoCount {
  estado: string;
  count: number;
}

export interface ExecutiveTimeSavedEstimate {
  minutosTotales: number;
  horasTotales: number;
  detalle: string[];
}

export interface AttentionItem extends OperationalInboxRow {
  motivos: string[];
}

export interface LocalReports {
  kpis: LocalReportsKpis;
  blockingReasons: BlockingReasonsCount;
  byArea: AreaCount[];
  byEstado: EstadoCount[];
  timeSaved: ExecutiveTimeSavedEstimate;
  attentionItems: AttentionItem[];
}

export function countByBusinessArea(proposals: LocalProposal[]): AreaCount[] {
  return publicFormAreaOptions.map((area) => ({
    area,
    count: proposals.filter((p) => p.input.areaNegocio === area).length,
  }));
}

export function countByCommercialState(proposals: LocalProposal[]): EstadoCount[] {
  return commercialStates.map((estado) => ({
    estado,
    count: proposals.filter((p) => p.seguimiento.estadoComercial === estado).length,
  }));
}

export function getBlockingReasons(proposals: LocalProposal[]): BlockingReasonsCount {
  return {
    faltaCis: proposals.filter(faltaCis).length,
    faltaAccesoDirecto: proposals.filter(faltaAccesoDirecto).length,
    faltaMandato: proposals.filter(faltaMandato).length,
    documentacionInsuficiente: proposals.filter(esDocumentacionInsuficiente).length,
    riesgoCritico: proposals.filter(esRiesgoCritico).length,
    mtnHsbcLtn: proposals.filter(esMtnCritico).length,
    cadenaIntermediacionAlta: proposals.filter(esCadenaAlta).length,
    informacionEsencialIncompleta: proposals.filter(esInformacionEsencialIncompleta).length,
  };
}

// Estimación local orientativa, no un compromiso de resultados: cada regla suma minutos de
// forma independiente y aditiva (una misma propuesta puede aportar a más de una regla).
export function estimateExecutiveTimeSaved(
  rows: OperationalInboxRow[],
  proposals: LocalProposal[]
): ExecutiveTimeSavedEstimate {
  let minutos = 0;
  const detalle: string[] = [];

  const bloqueadas = rows.filter((r) => r.buckets.includes("bloqueadas_no_listas"));
  if (bloqueadas.length > 0) {
    const subtotal = bloqueadas.length * 30;
    minutos += subtotal;
    detalle.push(`${bloqueadas.length} propuesta(s) bloqueada(s) / no lista(s) × 30 min = ${subtotal} min`);
  }

  const riesgoCritico = proposals.filter(esRiesgoCritico);
  if (riesgoCritico.length > 0) {
    const subtotal = riesgoCritico.length * 60;
    minutos += subtotal;
    detalle.push(`${riesgoCritico.length} propuesta(s) de riesgo crítico × 60 min = ${subtotal} min`);
  }

  const faltaCisOAcceso = proposals.filter((p) => faltaCis(p) || faltaAccesoDirecto(p));
  if (faltaCisOAcceso.length > 0) {
    const subtotal = faltaCisOAcceso.length * 20;
    minutos += subtotal;
    detalle.push(`${faltaCisOAcceso.length} propuesta(s) con falta de CIS o sin acceso directo × 20 min = ${subtotal} min`);
  }

  return {
    minutosTotales: minutos,
    horasTotales: Math.round((minutos / 60) * 10) / 10,
    detalle,
  };
}

export function getAttentionItems(
  rows: OperationalInboxRow[],
  proposals: LocalProposal[]
): AttentionItem[] {
  const proposalById = new Map(proposals.map((p) => [p.id, p]));

  return rows
    .map((row) => {
      const proposal = proposalById.get(row.id);
      const motivos: string[] = [];

      if (row.buckets.includes("listas_fernando_liliana")) motivos.push("Lista para revisión ejecutiva");
      if (row.nextActionStatus === "Vencida") motivos.push("Próxima acción vencida");
      if (row.nextActionStatus === "Hoy") motivos.push("Próxima acción para hoy");
      if (row.riesgo === "Crítico") motivos.push("Riesgo crítico");
      if (row.buckets.includes("sin_responsable")) motivos.push("Sin responsable asignado");
      if (proposal && faltaCis(proposal)) motivos.push("CIS pendiente");

      return { ...row, motivos };
    })
    .filter((item) => item.motivos.length > 0);
}

export function buildLocalReports(proposals: LocalProposal[]): LocalReports {
  const rows = proposals.map(buildOperationalInboxRow);

  const kpis: LocalReportsKpis = {
    totalPropuestasLocales: proposals.length,
    listasFernandoLiliana: rows.filter((r) => r.buckets.includes("listas_fernando_liliana")).length,
    enPreparacion: rows.filter((r) => r.briefingReadiness === "En preparación").length,
    noListas: rows.filter((r) => r.briefingReadiness === "No lista").length,
    pendientesCis: proposals.filter(faltaCis).length,
    conAccesoDirectoConfirmado: proposals.filter((p) => p.input.accesoDirecto === "Sí").length,
    sinAccesoNiMandato: proposals.filter((p) => faltaAccesoDirecto(p) && faltaMandato(p)).length,
    riesgoCritico: proposals.filter(esRiesgoCritico).length,
    documentacionBaja: rows.filter((r) => r.nivelDocumental === "Bajo").length,
    documentacionMedia: rows.filter((r) => r.nivelDocumental === "Medio").length,
    documentacionAlta: rows.filter((r) => r.nivelDocumental === "Alto").length,
    respuestasSugeridasCopiadas: proposals.reduce(
      (acc, p) => acc + (p.historial?.filter((h) => h.type === "respuesta_copiada").length ?? 0),
      0
    ),
    conProximaAccion: rows.filter((r) => r.proximaAccion.trim() !== "").length,
    sinResponsable: rows.filter((r) => r.buckets.includes("sin_responsable")).length,
    marcadasRevisionEjecutiva: proposals.filter(
      (p) => p.seguimiento.estadoComercial === "Revisión ejecutiva Fernando/Liliana"
    ).length,
  };

  return {
    kpis,
    blockingReasons: getBlockingReasons(proposals),
    byArea: countByBusinessArea(proposals),
    byEstado: countByCommercialState(proposals),
    timeSaved: estimateExecutiveTimeSaved(rows, proposals),
    attentionItems: getAttentionItems(rows, proposals),
  };
}
