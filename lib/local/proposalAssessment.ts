// Persistencia local de desarrollo. No usar como almacenamiento productivo.
//
// Motor de evaluación preliminar 100% determinístico — NO es IA real. Es una función pura
// que aplica reglas explícitas y documentadas. Su salida es siempre una sugerencia sujeta
// a revisión humana, nunca una decisión final (ver "Política de uso de IA" en /base-conocimiento).

import { documentChecklistOptions } from "@/lib/mock/gawerData";

export interface LocalProposalInput {
  nombreCompleto: string;
  empresa: string;
  cargo: string;
  pais: string;
  ciudad: string;
  email: string;
  telefono: string;
  sitioWeb: string;
  linkedin: string;
  tipoProponente: string;
  accesoDirecto: string;
  mandato: string;
  relacionTitular: string;
  cantidadIntermediarios: string;
  areaNegocio: string;
  descripcionOperacion: string;
  montoEstimado: string;
  moneda: string;
  jurisdiccionPrincipal: string;
  paisOrigen: string;
  paisDestino: string;
  urgencia: string;
  necesitaDeGawer: string;
  documentos: Record<string, boolean>;
  mtnHsbcLtn: string;
  declaracionVeracidad: boolean;
  declaracionSinCompromiso: boolean;
}

export type LocalRiskLevel = "Bajo" | "Medio" | "Alto" | "Crítico";

export interface LocalProposalAssessment {
  score: number;
  riesgo: LocalRiskLevel;
  estadoSugerido: string;
  razones: string[];
}

const CIS_KEY = documentChecklistOptions[0];
const EVIDENCIA_KEYS = ["Evidencia bancaria", "Evidencia de disponibilidad de fondos"];

function clampScore(score: number): number {
  return Math.max(0, Math.min(100, Math.round(score)));
}

/**
 * calculateLocalProposalAssessment
 *
 * Regla explicada paso a paso (sin IA, sin llamadas externas):
 * 1. Si involucra MTN HSBC / LTN brasilera -> corta corto: riesgo crítico, score bajo, descarte sugerido.
 * 2. CIS disponible suma puntos; ausente resta.
 * 3. Acceso directo al principal suma; sin acceso resta.
 * 4. Mandato/autorización acreditada suma; ausencia resta.
 * 5. 3 o más intermediarios resta puntos y empuja el riesgo a Alto.
 * 6. Documentación inicial suficiente (mitad o más del checklist) suma.
 * 7. Evidencia bancaria / de fondos disponible suma.
 * Cada regla aplicada queda registrada en `razones` para que el resultado sea explicable.
 */
export function calculateLocalProposalAssessment(
  input: LocalProposalInput
): LocalProposalAssessment {
  const razones: string[] = [];
  const documentos = input.documentos ?? {};
  const cisDisponible = !!documentos[CIS_KEY];

  if (input.mtnHsbcLtn === "Sí") {
    return {
      score: 15,
      riesgo: "Crítico",
      estadoSugerido: "Descarte sugerido",
      razones: [
        "Instrumento MTN HSBC / LTN brasilera — regla crítica validada por GAWER. GAWER no opera este instrumento.",
      ],
    };
  }

  let score = 50;
  let intermediacionAlta = false;

  if (cisDisponible) {
    score += 15;
    razones.push("CIS disponible (+15)");
  } else {
    score -= 15;
    razones.push("CIS no disponible (-15)");
  }

  if (input.accesoDirecto === "Sí") {
    score += 20;
    razones.push("Acceso directo confirmado al principal (+20)");
  } else if (input.accesoDirecto === "Parcial") {
    score += 5;
    razones.push("Acceso parcial al principal (+5)");
  } else if (input.accesoDirecto === "No" || input.accesoDirecto === "No lo sé") {
    score -= 20;
    razones.push("Sin acceso directo confirmado al principal (-20)");
  }

  if (input.mandato === "Sí") {
    score += 10;
    razones.push("Mandato o autorización de representación acreditada (+10)");
  } else if (input.mandato === "No") {
    score -= 10;
    razones.push("Sin mandato ni autorización acreditada (-10)");
  }

  if (input.cantidadIntermediarios === "3 o más") {
    score -= 20;
    intermediacionAlta = true;
    razones.push("Cadena de intermediación de 3 o más eslabones (-20)");
  } else if (input.cantidadIntermediarios === "2") {
    score -= 10;
    razones.push("Cadena de intermediación de 2 eslabones (-10)");
  } else if (input.cantidadIntermediarios === "Ninguno") {
    score += 10;
    razones.push("Sin intermediarios entre el proponente y el titular (+10)");
  } else if (input.cantidadIntermediarios === "Desconocido") {
    score -= 10;
    intermediacionAlta = true;
    razones.push("Cantidad de intermediarios desconocida (-10)");
  }

  const documentosDisponibles = Object.values(documentos).filter(Boolean).length;
  const totalDocumentos = documentChecklistOptions.length;
  if (documentosDisponibles >= Math.ceil(totalDocumentos / 2)) {
    score += 10;
    razones.push(`Documentación inicial suficiente (${documentosDisponibles} de ${totalDocumentos} ítems) (+10)`);
  } else {
    score -= 5;
    razones.push(`Documentación inicial incompleta (${documentosDisponibles} de ${totalDocumentos} ítems) (-5)`);
  }

  const tieneEvidencia = EVIDENCIA_KEYS.some((k) => documentos[k]);
  if (tieneEvidencia) {
    score += 10;
    razones.push("Evidencia bancaria o de disponibilidad de fondos aportada (+10)");
  }

  score = clampScore(score);

  let riesgo: LocalRiskLevel;
  if (intermediacionAlta && score < 70) riesgo = "Alto";
  else if (score >= 70) riesgo = "Bajo";
  else if (score >= 50) riesgo = "Medio";
  else if (score >= 30) riesgo = "Alto";
  else riesgo = "Crítico";

  let estadoSugerido = "Revisión comercial inicial";
  if (riesgo === "Crítico") estadoSugerido = "Descarte sugerido";
  else if (!cisDisponible) estadoSugerido = "Solicitud de CIS";
  else if (input.accesoDirecto !== "Sí") estadoSugerido = "Revisión de acceso al principal";
  else if (score >= 70) estadoSugerido = "Análisis documental preliminar";

  return { score, riesgo, estadoSugerido, razones };
}
