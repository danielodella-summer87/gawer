// Persistencia local de desarrollo. No usar como almacenamiento productivo.
//
// Bandeja operativa — clasificación 100% determinística de propuestas locales para
// gestión del día a día. NO es IA: son reglas explícitas sobre datos ya calculados
// (seguimiento, checklist documental, briefing ejecutivo).

import type { LocalProposal } from "./proposalsStore";
import type { RiskLevel } from "@/lib/mock/gawerData";
import { summarizeChecklist } from "./documentChecklist";
import { generateExecutiveBriefing, type ReadinessLevel } from "./executiveBriefing";
import { generateProposalResponseDrafts } from "./proposalResponseDrafts";

export type OperationalBucket =
  | "listas_fernando_liliana"
  | "requieren_accion_comercial"
  | "pendientes_documentacion"
  | "bloqueadas_no_listas"
  | "sin_responsable";

export type NextActionStatus = "Vencida" | "Hoy" | "Programada" | "Sin fecha";

const ESTADOS_CERRADOS = ["Ganado", "Perdido", "Descartado"];

export function getNextActionStatus(fechaProximaAccion: string): NextActionStatus {
  if (!fechaProximaAccion) return "Sin fecha";
  const fecha = new Date(`${fechaProximaAccion}T00:00:00`);
  if (isNaN(fecha.getTime())) return "Sin fecha";

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  if (fecha.getTime() < today.getTime()) return "Vencida";
  if (fecha.getTime() === today.getTime()) return "Hoy";
  return "Programada";
}

export interface OperationalInboxRow {
  id: string;
  empresa: string;
  proponente: string;
  areaNegocio: string;
  score: number;
  riesgo: RiskLevel;
  estadoComercial: string;
  recomendacionPreliminar: string;
  briefingReadiness: ReadinessLevel;
  nivelDocumental: "Bajo" | "Medio" | "Alto";
  responsable: string;
  proximaAccion: string;
  fechaProximaAccion: string;
  nextActionStatus: NextActionStatus;
  buckets: OperationalBucket[];
  recommendedDraftTitle: string;
  recommendedDraftSubject: string;
  recommendedDraftBody: string;
}

export function classifyOperationalBucket(proposal: LocalProposal): OperationalBucket[] {
  const { input, assessment, seguimiento } = proposal;
  const checklist = proposal.documentChecklist ?? [];
  const briefing = generateExecutiveBriefing(proposal);
  const checklistSummary = summarizeChecklist(checklist);

  const cisItem = checklist.find((i) => i.id === "cis");
  const cisPendiente = !cisItem || cisItem.estado === "Pendiente";
  const accesoConfirmado = input.accesoDirecto === "Sí";
  const mandatoOk = input.mandato === "Sí";
  const accesoORepresentacion = accesoConfirmado || mandatoOk;
  const cadenaAlta = input.cantidadIntermediarios === "3 o más" || input.cantidadIntermediarios === "Desconocido";
  const revisionHumanaAbierta = checklist.some((i) => i.estado === "Requiere revisión humana");
  const requeridosPendientes = checklist.some((i) => i.requerido && i.estado === "Pendiente");

  const buckets: OperationalBucket[] = [];

  if (
    briefing.readinessLevel === "Lista para revisión ejecutiva" ||
    seguimiento.estadoComercial === "Revisión ejecutiva Fernando/Liliana"
  ) {
    buckets.push("listas_fernando_liliana");
  }

  if (
    seguimiento.proximaAccion.trim() &&
    seguimiento.fechaProximaAccion.trim() &&
    seguimiento.responsableInterno.trim() &&
    !ESTADOS_CERRADOS.includes(seguimiento.estadoComercial)
  ) {
    buckets.push("requieren_accion_comercial");
  }

  if (
    cisPendiente ||
    requeridosPendientes ||
    checklistSummary.nivelPreparacion === "Bajo" ||
    checklistSummary.nivelPreparacion === "Medio" ||
    revisionHumanaAbierta
  ) {
    buckets.push("pendientes_documentacion");
  }

  if (
    assessment.riesgo === "Crítico" ||
    input.mtnHsbcLtn === "Sí" ||
    !accesoORepresentacion ||
    cadenaAlta ||
    briefing.readinessLevel === "No lista"
  ) {
    buckets.push("bloqueadas_no_listas");
  }

  if (!seguimiento.responsableInterno.trim()) {
    buckets.push("sin_responsable");
  }

  return buckets;
}

export function buildOperationalInboxRow(proposal: LocalProposal): OperationalInboxRow {
  const { input, assessment, seguimiento } = proposal;
  const checklistSummary = summarizeChecklist(proposal.documentChecklist ?? []);
  const briefing = generateExecutiveBriefing(proposal);
  const drafts = generateProposalResponseDrafts(proposal);
  const recommended = drafts.find((d) => d.recommended) ?? drafts[0];

  return {
    id: proposal.id,
    empresa: input.empresa?.trim() || input.nombreCompleto || "Sin empresa",
    proponente: input.nombreCompleto || "Sin nombre",
    areaNegocio: input.areaNegocio || "Sin especificar",
    score: assessment.score,
    riesgo: assessment.riesgo,
    estadoComercial: seguimiento.estadoComercial,
    recomendacionPreliminar: assessment.estadoSugerido,
    briefingReadiness: briefing.readinessLevel,
    nivelDocumental: checklistSummary.nivelPreparacion,
    responsable: seguimiento.responsableInterno,
    proximaAccion: seguimiento.proximaAccion,
    fechaProximaAccion: seguimiento.fechaProximaAccion,
    nextActionStatus: getNextActionStatus(seguimiento.fechaProximaAccion),
    buckets: classifyOperationalBucket(proposal),
    recommendedDraftTitle: recommended.title,
    recommendedDraftSubject: recommended.subject,
    recommendedDraftBody: recommended.body,
  };
}

export interface OperationalInboxSummary {
  totalPropuestasLocales: number;
  listasFernandoLiliana: number;
  pendientesDocumentacion: number;
  riesgoCritico: number;
  sinResponsable: number;
  proximasAccionesVencidasOPendientes: number;
}

export function getOperationalInboxSummary(rows: OperationalInboxRow[]): OperationalInboxSummary {
  return {
    totalPropuestasLocales: rows.length,
    listasFernandoLiliana: rows.filter((r) => r.buckets.includes("listas_fernando_liliana")).length,
    pendientesDocumentacion: rows.filter((r) => r.buckets.includes("pendientes_documentacion")).length,
    riesgoCritico: rows.filter((r) => r.riesgo === "Crítico").length,
    sinResponsable: rows.filter((r) => r.buckets.includes("sin_responsable")).length,
    proximasAccionesVencidasOPendientes: rows.filter(
      (r) => r.nextActionStatus === "Vencida" || r.nextActionStatus === "Hoy"
    ).length,
  };
}
