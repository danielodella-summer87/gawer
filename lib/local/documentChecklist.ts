// Persistencia local de desarrollo. No usar como almacenamiento productivo.
//
// Checklist documental operativo por tipo de operación. Reglas explícitas y determinísticas
// basadas en los criterios de Fernando (CIS obligatorio + documentación específica por subárea).
// No es IA: es una tabla de reglas fija, transparente y editable por el equipo.

import { documentChecklistOptions } from "@/lib/mock/gawerData";
import type { LocalProposalInput } from "./proposalAssessment";

export type DocumentChecklistStatus =
  | "Pendiente"
  | "Recibido"
  | "Incompleto"
  | "Inconsistente"
  | "Requiere revisión humana"
  | "Validado preliminarmente"
  | "No suficiente por sí solo"
  | "No aplica";

export const documentChecklistStatusOptions: DocumentChecklistStatus[] = [
  "Pendiente",
  "Recibido",
  "Incompleto",
  "Inconsistente",
  "Requiere revisión humana",
  "Validado preliminarmente",
  "No suficiente por sí solo",
  "No aplica",
];

export interface DocumentChecklistItem {
  id: string;
  nombre: string;
  requerido: boolean;
  estado: DocumentChecklistStatus;
  observacion: string;
  actualizadoAt?: string;
}

interface ChecklistDef {
  id: string;
  nombre: string;
  requerido: boolean;
  formKey?: string;
}

const CIS_FORM_KEY = documentChecklistOptions[0];

const CIS_DEF: ChecklistDef = {
  id: "cis",
  nombre: "CIS / Corporate Information Sheet / Hoja de Información Corporativa",
  requerido: true,
  formKey: CIS_FORM_KEY,
};

const COMUNES_OPCIONALES: ChecklistDef[] = [
  { id: "mandato", nombre: "Mandato o autorización de representación", requerido: false, formKey: "Mandato o autorización de representación" },
  { id: "loi", nombre: "LOI / Carta de intención", requerido: false, formKey: "LOI / Carta de intención" },
  { id: "evidencia-bancaria", nombre: "Evidencia bancaria", requerido: false, formKey: "Evidencia bancaria" },
  { id: "evidencia-fondos", nombre: "Evidencia verificable de fondos", requerido: false, formKey: "Evidencia de disponibilidad de fondos" },
];

const CHECKLISTS_POR_AREA: Record<string, ChecklistDef[]> = {
  "Compra de oro doré": [
    CIS_DEF,
    { id: "loi", nombre: "LOI / Carta de intención", requerido: true, formKey: "LOI / Carta de intención" },
    { id: "evidencia-bancaria", nombre: "Evidencia bancaria", requerido: true, formKey: "Evidencia bancaria" },
    { id: "bloqueo-fondos", nombre: "Capacidad de emitir bloqueo de fondos", requerido: true },
    { id: "sblc", nombre: "SBLC", requerido: false, formKey: "SBLC" },
    { id: "rwa", nombre: "RWA bancaria", requerido: false, formKey: "RWA" },
    { id: "doc-oro", nombre: "Documentación de oro / producto", requerido: true, formKey: "Documentación de oro / producto" },
    { id: "titularidad-producto", nombre: "Evidencia de titularidad o disponibilidad del producto", requerido: true },
    { id: "mandato", nombre: "Mandato o autorización, si actúa un intermediario", requerido: false, formKey: "Mandato o autorización de representación" },
  ],
  "Monetización de garantías financieras": [
    CIS_DEF,
    { id: "loi", nombre: "LOI / Carta de intención", requerido: true, formKey: "LOI / Carta de intención" },
    { id: "doc-garantia", nombre: "Documentación específica de la garantía", requerido: true, formKey: "Documentación de garantía financiera" },
    { id: "banco-emisor", nombre: "Banco emisor", requerido: true },
    { id: "datos-instrumento", nombre: "Datos del instrumento", requerido: true },
    { id: "titularidad-autorizacion", nombre: "Evidencia de titularidad o autorización", requerido: true },
    { id: "mandato", nombre: "Mandato o autorización, si corresponde", requerido: false, formKey: "Mandato o autorización de representación" },
  ],
  "Gestión de garantías financieras": [
    CIS_DEF,
    { id: "loi", nombre: "LOI / Carta de intención", requerido: true, formKey: "LOI / Carta de intención" },
    { id: "doc-operacion", nombre: "Documentación específica de la operación", requerido: true, formKey: "Documentación de garantía financiera" },
    { id: "datos-instrumento", nombre: "Datos del instrumento", requerido: true },
    { id: "banco-entidad", nombre: "Banco emisor o entidad involucrada", requerido: true },
    { id: "titularidad-autorizacion", nombre: "Evidencia de titularidad o autorización", requerido: true },
  ],
  "Compra, venta o intercambio de criptomonedas": [
    CIS_DEF,
    { id: "evidencia-fondos", nombre: "Evidencia verificable de disponibilidad de fondos", requerido: true, formKey: "Evidencia de disponibilidad de fondos" },
    { id: "trazabilidad", nombre: "Documentación de trazabilidad de fondos", requerido: true, formKey: "Documentación cripto / trazabilidad de fondos" },
    { id: "wallet", nombre: "Wallet / datos operativos relevantes", requerido: true },
    { id: "mandato", nombre: "Mandato o autorización, si corresponde", requerido: false, formKey: "Mandato o autorización de representación" },
  ],
  "Estructuración financiera": [
    CIS_DEF,
    { id: "descripcion-operacion", nombre: "Descripción de la operación", requerido: true },
    { id: "loi", nombre: "LOI, si aplica", requerido: false, formKey: "LOI / Carta de intención" },
    { id: "capacidad-financiera", nombre: "Evidencia de capacidad financiera u operativa", requerido: true },
    { id: "mandato", nombre: "Mandato o autorización, si corresponde", requerido: false, formKey: "Mandato o autorización de representación" },
    { id: "docs-especificos", nombre: "Documentos específicos definidos por el equipo", requerido: false },
  ],
};
CHECKLISTS_POR_AREA["Intermediación en negocio comercial o financiero"] =
  CHECKLISTS_POR_AREA["Estructuración financiera"];

function getChecklistDefsForArea(areaNegocio: string): ChecklistDef[] {
  return CHECKLISTS_POR_AREA[areaNegocio] ?? [CIS_DEF, ...COMUNES_OPCIONALES];
}

export function generateDocumentChecklist(input: LocalProposalInput): DocumentChecklistItem[] {
  const defs = getChecklistDefsForArea(input.areaNegocio);
  return defs.map((d) => ({
    id: d.id,
    nombre: d.nombre,
    requerido: d.requerido,
    estado: d.formKey && input.documentos?.[d.formKey] ? "Recibido" : "Pendiente",
    observacion: "",
  }));
}

export interface DocumentChecklistSummary {
  totalRequeridos: number;
  recibidos: number;
  pendientes: number;
  conInconsistencia: number;
  nivelPreparacion: "Bajo" | "Medio" | "Alto";
}

export function summarizeChecklist(items: DocumentChecklistItem[]): DocumentChecklistSummary {
  const requeridos = items.filter((i) => i.requerido);
  const totalRequeridos = requeridos.length;
  const recibidos = requeridos.filter(
    (i) => i.estado === "Recibido" || i.estado === "Validado preliminarmente"
  ).length;
  const pendientes = requeridos.filter((i) => i.estado === "Pendiente").length;
  const conInconsistencia = items.filter(
    (i) =>
      i.estado === "Inconsistente" ||
      i.estado === "Requiere revisión humana" ||
      i.estado === "No suficiente por sí solo"
  ).length;

  const ratio = totalRequeridos > 0 ? recibidos / totalRequeridos : 0;
  let nivelPreparacion: "Bajo" | "Medio" | "Alto";
  if (ratio >= 0.75 && conInconsistencia === 0) nivelPreparacion = "Alto";
  else if (ratio >= 0.4) nivelPreparacion = "Medio";
  else nivelPreparacion = "Bajo";

  return { totalRequeridos, recibidos, pendientes, conInconsistencia, nivelPreparacion };
}
