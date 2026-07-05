// Persistencia local de desarrollo. No usar como almacenamiento productivo.
//
// Briefing ejecutivo 100% determinístico — NO es IA real. Es una función pura que arma
// texto y un nivel de preparación a partir de reglas explícitas sobre los datos ya
// cargados (formulario, checklist documental, seguimiento). Es una síntesis operativa
// local para ayudar a decidir el pase a Fernando/Liliana; nunca reemplaza esa decisión.

import type { LocalProposal } from "./proposalsStore";
import { formatCurrency } from "@/lib/mock/gawerData";

export type ReadinessLevel = "No lista" | "En preparación" | "Lista para revisión ejecutiva";

export interface ExecutiveBriefingClientProfile {
  nombre: string;
  empresa: string;
  pais: string;
  rol: string;
  accesoPrincipal: string;
  mandato: string;
  cadenaIntermediacion: string;
}

export interface ExecutiveBriefingDocumentationSummary {
  cis: string;
  documentosRecibidos: string[];
  documentosPendientes: string[];
  documentosRevisionHumana: string[];
  documentosInconsistentes: string[];
  nivelPreparacionDocumental: "Bajo" | "Medio" | "Alto";
}

export interface ExecutiveBriefing {
  readinessLevel: ReadinessLevel;
  summary: string;
  clientProfile: ExecutiveBriefingClientProfile;
  operationSummary: string;
  documentationSummary: ExecutiveBriefingDocumentationSummary;
  riskSummary: string[];
  missingInformation: string[];
  suggestedQuestions: string[];
  viableStructuringOptions: string[];
  suggestedWorkPlan: string[];
  suggestedResponsibilities: string[];
  escalationRecommendation: string;
  blockingReasons: string[];
  positiveSignals: string[];
  cautionSignals: string[];
}

const EVIDENCIA_FINANCIERA_IDS = ["evidencia-bancaria", "evidencia-fondos", "bloqueo-fondos", "trazabilidad"];

export function generateExecutiveBriefing(proposal: LocalProposal): ExecutiveBriefing {
  const { input, assessment, seguimiento } = proposal;
  const checklist = proposal.documentChecklist ?? [];

  const cisItem = checklist.find((i) => i.id === "cis");
  const cisOk = cisItem?.estado === "Recibido" || cisItem?.estado === "Validado preliminarmente";
  const cisPendiente = !cisItem || cisItem.estado === "Pendiente";

  const accesoConfirmado = input.accesoDirecto === "Sí";
  const accesoParcialODesconocido = input.accesoDirecto === "Parcial" || input.accesoDirecto === "No lo sé" || !input.accesoDirecto;
  const mandatoOk = input.mandato === "Sí";
  const accesoORepresentacion = accesoConfirmado || mandatoOk;

  const mtnCritico = input.mtnHsbcLtn === "Sí";
  const cadenaAlta = input.cantidadIntermediarios === "3 o más" || input.cantidadIntermediarios === "Desconocido";

  const requeridos = checklist.filter((i) => i.requerido);
  const requeridosOk = requeridos.filter((i) => i.estado === "Recibido" || i.estado === "Validado preliminarmente");
  const ratioRequeridos = requeridos.length > 0 ? requeridosOk.length / requeridos.length : 1;
  const documentacionCriticaMinima = ratioRequeridos >= 0.6;

  const inconsistentes = checklist.filter(
    (i) => i.estado === "Inconsistente" || i.estado === "No suficiente por sí solo"
  );
  const inconsistenciaCritica = inconsistentes.length > 0;
  const revisionHumanaItems = checklist.filter((i) => i.estado === "Requiere revisión humana");
  const revisionHumanaAbierta = revisionHumanaItems.length > 0;
  const riesgoCritico = assessment.riesgo === "Crítico";

  const evidenciaFinancieraPendiente = checklist.some(
    (i) =>
      EVIDENCIA_FINANCIERA_IDS.includes(i.id) &&
      i.estado !== "Recibido" &&
      i.estado !== "Validado preliminarmente" &&
      i.estado !== "No aplica"
  );

  // --- Cascada de reglas: bloqueo duro > listo > en preparación ---
  const blockingReasons: string[] = [];
  if (mtnCritico) {
    blockingReasons.push("Instrumento MTN HSBC / LTN brasilera — regla crítica validada por GAWER.");
  }
  if (cadenaAlta && !accesoORepresentacion) {
    blockingReasons.push("Cadena de intermediación alta o desconocida sin acceso directo ni mandato acreditado.");
  }
  if (inconsistenciaCritica) {
    blockingReasons.push(
      `Documentación con inconsistencia crítica abierta (${inconsistentes.map((i) => i.nombre).join(", ")}).`
    );
  }
  if (cisPendiente && !accesoORepresentacion) {
    blockingReasons.push("Sin CIS y sin acceso directo ni mandato — no reúne condiciones mínimas.");
  }

  const positiveSignals: string[] = [];
  const cautionSignals: string[] = [];

  if (cisOk) positiveSignals.push("CIS recibido o validado preliminarmente.");
  else cautionSignals.push("CIS pendiente de recepción.");

  if (accesoConfirmado) positiveSignals.push("Acceso directo al principal confirmado.");
  else if (mandatoOk) positiveSignals.push("Mandato o autorización de representación acreditada.");
  else if (accesoParcialODesconocido) cautionSignals.push("Acceso al principal parcial o no confirmado.");

  if (documentacionCriticaMinima) positiveSignals.push("Documentación crítica mínima recibida para el tipo de operación.");
  else cautionSignals.push(`Documentación incompleta (${requeridosOk.length} de ${requeridos.length} documentos requeridos recibidos).`);

  if (revisionHumanaAbierta) {
    cautionSignals.push(
      `Documentos con revisión humana pendiente (${revisionHumanaItems.map((i) => i.nombre).join(", ")}).`
    );
  }

  if (!riesgoCritico) positiveSignals.push(`Riesgo preliminar no crítico (${assessment.riesgo}).`);
  if (evidenciaFinancieraPendiente) cautionSignals.push("Evidencia bancaria o de fondos aún no verificada.");

  let readinessLevel: ReadinessLevel;
  if (blockingReasons.length > 0) {
    readinessLevel = "No lista";
  } else {
    const readyForExecutive =
      cisOk && accesoORepresentacion && documentacionCriticaMinima && !riesgoCritico && !inconsistenciaCritica;
    readinessLevel = readyForExecutive ? "Lista para revisión ejecutiva" : "En preparación";
  }

  const escalationRecommendation =
    readinessLevel === "Lista para revisión ejecutiva"
      ? "Recomendado escalar a revisión ejecutiva Fernando/Liliana."
      : readinessLevel === "No lista"
      ? "No recomendado escalar — resolver los bloqueos críticos antes de continuar."
      : "Aún no recomendado escalar — completar los requisitos mínimos antes de la revisión ejecutiva.";

  // --- Perfil del proponente ---
  const clientProfile: ExecutiveBriefingClientProfile = {
    nombre: input.nombreCompleto || "No informado",
    empresa: input.empresa?.trim() || "No informada",
    pais: input.pais || "No informado",
    rol: input.tipoProponente || "No informado",
    accesoPrincipal: input.accesoDirecto || "No informado",
    mandato: input.mandato || "No informado",
    cadenaIntermediacion: input.cantidadIntermediarios || "No informada",
  };

  // --- Documentación y evidencias ---
  const documentationSummary: ExecutiveBriefingDocumentationSummary = {
    cis: cisItem?.estado ?? "Pendiente",
    documentosRecibidos: checklist
      .filter((i) => i.estado === "Recibido" || i.estado === "Validado preliminarmente")
      .map((i) => i.nombre),
    documentosPendientes: checklist.filter((i) => i.estado === "Pendiente").map((i) => i.nombre),
    documentosRevisionHumana: revisionHumanaItems.map((i) => i.nombre),
    documentosInconsistentes: inconsistentes.map((i) => i.nombre),
    nivelPreparacionDocumental: documentacionCriticaMinima
      ? ratioRequeridos >= 0.85 && !inconsistenciaCritica
        ? "Alto"
        : "Medio"
      : "Bajo",
  };

  // --- Riesgos y alertas ---
  const riskSummary: string[] = [];
  if (mtnCritico) riskSummary.push("Alerta crítica: MTNs del HSBC respaldadas en LTNs brasileras.");
  if (cadenaAlta) riskSummary.push("Cadena de intermediación alta o desconocida.");
  if (documentationSummary.documentosPendientes.length > 0) {
    riskSummary.push(`${documentationSummary.documentosPendientes.length} documento(s) pendiente(s).`);
  }
  if (inconsistenciaCritica) riskSummary.push("Inconsistencias documentales abiertas.");
  if (!accesoORepresentacion) riskSummary.push("Sin acceso directo confirmado ni mandato acreditado.");
  if (evidenciaFinancieraPendiente) riskSummary.push("Falta evidencia objetiva de capacidad financiera.");
  if (riskSummary.length === 0) riskSummary.push("Sin alertas relevantes detectadas con la información actual.");

  // --- Información faltante ---
  const missingInformation: string[] = [];
  if (cisPendiente) missingInformation.push("CIS / Hoja de Información Corporativa");
  if (!accesoConfirmado) missingInformation.push("Confirmación de acceso directo al titular principal");
  if (!mandatoOk && !accesoConfirmado) missingInformation.push("Mandato o autorización de representación");
  documentationSummary.documentosPendientes.forEach((d) => missingInformation.push(d));
  if (!input.montoEstimado) missingInformation.push("Monto estimado de la operación");
  if (!input.jurisdiccionPrincipal) missingInformation.push("Jurisdicción principal");

  // --- Preguntas sugeridas ---
  const suggestedQuestions: string[] = [];
  if (!accesoConfirmado) suggestedQuestions.push("¿Puede acreditar acceso directo al titular principal?");
  if (!cisOk) suggestedQuestions.push("¿Puede enviar CIS actualizado?");
  if (!mandatoOk && !accesoConfirmado) {
    suggestedQuestions.push("¿Puede demostrar titularidad o autorización sobre la operación?");
  }
  if (evidenciaFinancieraPendiente) suggestedQuestions.push("¿Puede aportar evidencia bancaria verificable?");
  if (cadenaAlta) suggestedQuestions.push("¿Quién es la contraparte final?");
  suggestedQuestions.push("¿Cuál es el procedimiento operativo propuesto?");

  // --- Alternativas de estructuración (genéricas y prudentes) ---
  const viableStructuringOptions: string[] = [];
  if (!accesoORepresentacion) viableStructuringOptions.push("No escalar hasta contar con acceso al principal.");
  if (cadenaAlta) viableStructuringOptions.push("Derivar a revisión documental antes de avanzar.");
  if (!documentacionCriticaMinima) viableStructuringOptions.push("Avanzar solo con debida diligencia documental completa.");
  if (readinessLevel !== "Lista para revisión ejecutiva") {
    viableStructuringOptions.push("Solicitar documentación mínima antes de reunión ejecutiva.");
    viableStructuringOptions.push("Mantener en revisión comercial inicial hasta acreditar capacidad.");
  }
  if (viableStructuringOptions.length === 0) {
    viableStructuringOptions.push("Avanzar a estructuración una vez confirmada la revisión ejecutiva.");
  }

  // --- Plan de trabajo sugerido ---
  const suggestedWorkPlan = [
    "Completar CIS.",
    "Validar acceso al principal o mandato.",
    "Revisar documentación específica.",
    "Resolver inconsistencias.",
    "Definir si corresponde revisión Fernando/Liliana.",
  ];

  // --- Responsabilidades sugeridas ---
  const suggestedResponsibilities = [
    "Equipo comercial: completar información inicial.",
    "Backoffice/documental: revisar documentación.",
    "Responsable del área: validar viabilidad operativa.",
    "Fernando/Liliana: intervenir solo si se cumplen requisitos básicos.",
  ];

  // --- Resúmenes de texto ---
  const monto = input.montoEstimado
    ? formatCurrency(Number(input.montoEstimado) || 0, input.moneda || "USD")
    : "no informado";

  const operationSummary = `${input.areaNegocio || "Área no especificada"} — ${
    input.descripcionOperacion || "sin descripción"
  }. Monto estimado: ${monto}. Urgencia: ${input.urgencia || "no informada"}.`;

  const summary =
    `${input.nombreCompleto || "El proponente"} (${input.empresa?.trim() || "empresa no informada"}) presenta una propuesta de ` +
    `${input.areaNegocio || "área no especificada"} por ${monto}. ` +
    `Situación documental: CIS ${cisItem?.estado?.toLowerCase() ?? "pendiente"}, ${requeridosOk.length} de ${requeridos.length} ` +
    `documentos requeridos recibidos. Riesgo preliminar: ${assessment.riesgo}. Estado comercial actual: ${seguimiento.estadoComercial}. ` +
    `${escalationRecommendation}`;

  return {
    readinessLevel,
    summary,
    clientProfile,
    operationSummary,
    documentationSummary,
    riskSummary,
    missingInformation,
    suggestedQuestions,
    viableStructuringOptions,
    suggestedWorkPlan,
    suggestedResponsibilities,
    escalationRecommendation,
    blockingReasons,
    positiveSignals,
    cautionSignals,
  };
}
