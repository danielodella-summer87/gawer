export type RiskLevel = "Bajo" | "Medio" | "Alto" | "Crítico";

export type ProposalStatus =
  | "Nueva propuesta recibida"
  | "Revisión comercial inicial"
  | "Solicitud de CIS"
  | "Solicitud de documentación específica"
  | "Análisis documental preliminar"
  | "Revisión de acceso al principal"
  | "Revisión ejecutiva Fernando/Liliana"
  | "Estructuración / negociación"
  | "Ganado"
  | "Perdido"
  | "Descartado";

export type CapacidadNivel = "Demostrada" | "Parcial" | "No demostrada";
export type AccesoPrincipal = "Confirmado" | "No confirmado" | "Desconocido";
export type NivelIntermediacion = "Baja" | "Media" | "Alta" | "Crítica";
export type CisEstado = "Recibido" | "Pendiente";

export type DocumentStatus =
  | "Recibido"
  | "Pendiente"
  | "Incompleto"
  | "Inconsistente"
  | "Requiere revisión humana"
  | "Validado preliminarmente"
  | "No suficiente por sí solo";

export type KnowledgeStatus = "Validado por Fernando" | "En revisión" | "Borrador";
export type EngineStatus = "activo" | "en prueba" | "pausado";
export type TicketStatus =
  | "Nuevo"
  | "En análisis"
  | "Aprobado"
  | "En desarrollo"
  | "Resuelto"
  | "Rechazado"
  | "Pausado";

export interface Proposal {
  id: string;
  proponente: string;
  empresa: string;
  email: string;
  telefono: string;
  pais: string;
  rol: string;
  areaNegocio: string;
  areaOficialId: string;
  montoEstimado: number;
  moneda: string;
  descripcion: string;

  // Documentación y evidencia objetiva (criterio central de Fernando)
  cis: CisEstado;
  documentosRecibidos: string[];
  documentosFaltantes: string[];
  inconsistenciasDetectadas: string[];

  // Capacidad demostrada
  capacidadJuridica: CapacidadNivel;
  capacidadFinanciera: CapacidadNivel;
  capacidadOperativa: CapacidadNivel;

  // Intermediación (causa del ~90% de descartes)
  accesoDirectoPrincipal: AccesoPrincipal;
  cadenaIntermediacion: NivelIntermediacion;

  // Alerta crítica validada por Fernando (MTN HSBC / LTN brasileras)
  alertaCritica: boolean;
  alertaCriticaMotivo?: string;

  urgencia: string;
  necesitaDeGawer: string;

  // Dimensiones de ranking (0-100, a mayor valor mejor condición)
  score: number;
  gradoPreparacion: number;
  calidadDocumental: number;
  riesgoDocumental: number;
  probabilidadCierre: number;

  riesgo: RiskLevel;
  estado: ProposalStatus;
  proximaAccion: string;

  recomendacionIA: string;
  decisionSugerida: string;

  requiereRevisionFernandoLiliana: boolean;
  motivoRevisionFernandoLiliana?: string;

  remuneracionPercibida?: boolean;

  resumenEjecutivo: string;
  comentariosEjecutivos: { autor: string; fecha: string; texto: string }[];
  historial: { fecha: string; evento: string; responsable: string }[];
  fechaRecepcion: string;
}

export interface BusinessAreaOficial {
  id: string;
  nombre: string;
  descripcion: string;
}

export interface BusinessSubArea {
  id: string;
  areaOficialId: string;
  nombre: string;
  descripcion: string;
  documentosComunes: string[];
  documentosEspecificos: string[];
  senalesOportunidadReal: string[];
  senalesAlerta: string[];
  criterioAvance: string;
  estado: "activa" | "en definición";
}

export interface AIEngine {
  id: string;
  nombre: string;
  etapa: string;
  queSugiere: string;
  queNoPuedeDecidir: string;
  informacionQueUsa: string;
  salidaEsperada: string;
  responsableAprobacion: string;
  estado: EngineStatus;
  promptMock: string;
}

export interface Document {
  id: string;
  nombre: string;
  tipo: string;
  obligatorio: boolean;
  propuestaId: string;
  propuestaNombre: string;
  estado: DocumentStatus;
  fechaRecepcion: string;
}

export interface Ticket {
  id: string;
  titulo: string;
  tipo: string;
  moduloAfectado: string;
  importancia: "Alta" | "Media" | "Baja";
  urgencia: "Alta" | "Media" | "Baja";
  estado: TicketStatus;
  responsable: string;
  fecha: string;
}

export interface KnowledgeItem {
  id: string;
  titulo: string;
  categoria: string;
  estado: KnowledgeStatus;
  responsable: string;
  ultimaActualizacion: string;
  resumen: string;
}

export const dashboardStats = {
  propuestasRecibidas: 58,
  propuestasDescartadasIntermediacion: 41,
  oportunidadesConCIS: 19,
  oportunidadesAccesoDirectoConfirmado: 14,
  riesgoDocumentalAlto: 9,
  casosListosRevisionFernandoLiliana: 4,
  alertasCriticasMTN: 2,
  tiempoEjecutivoAhorrado: "142 horas",
};

export const commercialStates: ProposalStatus[] = [
  "Nueva propuesta recibida",
  "Revisión comercial inicial",
  "Solicitud de CIS",
  "Solicitud de documentación específica",
  "Análisis documental preliminar",
  "Revisión de acceso al principal",
  "Revisión ejecutiva Fernando/Liliana",
  "Estructuración / negociación",
  "Ganado",
  "Perdido",
  "Descartado",
];

// Formulario público de ingreso de propuestas (/propuesta) — datos mock, sin persistencia real
export const proposerTypeOptions = [
  "Titular directo de la operación",
  "Representante autorizado",
  "Intermediario con mandato",
  "Intermediario sin mandato",
  "Consultor / broker",
  "Otro",
];

export const accessDirectoOptions = ["Sí", "No", "Parcial", "No lo sé"];
export const mandateOptions = ["Sí", "No", "En proceso"];
export const intermediaryCountOptions = ["Ninguno", "1", "2", "3 o más", "Desconocido"];

export const publicFormAreaOptions = [
  "Monetización de garantías financieras",
  "Compra de oro doré",
  "Compra, venta o intercambio de criptomonedas",
  "Gestión de garantías financieras",
  "Estructuración financiera",
  "Intermediación en negocio comercial o financiero",
  "Otro",
];

export const urgencyOptions = ["Baja", "Media", "Alta", "Crítica"];

export const documentChecklistOptions = [
  "CIS / Corporate Information Sheet / Hoja de Información Corporativa",
  "LOI / Carta de intención",
  "Evidencia bancaria",
  "Evidencia de disponibilidad de fondos",
  "Mandato o autorización de representación",
  "Documentación de garantía financiera",
  "Documentación de oro / producto",
  "Documentación cripto / trazabilidad de fondos",
  "Otro",
];

export const mtnHsbcLtnOptions = ["Sí", "No", "No lo sé"];

export const proposals: Proposal[] = [
  {
    id: "prop-001",
    proponente: "Marco Salvatierra",
    empresa: "Andes Bullion Trading S.A.",
    email: "m.salvatierra@andesbullion.com",
    telefono: "+51 1 555 2210",
    pais: "Perú",
    rol: "Director general (titular)",
    areaNegocio: "Compra de oro doré",
    areaOficialId: "area-oficial-002",
    montoEstimado: 9800000,
    moneda: "USD",
    descripcion:
      "Compra de oro doré con LOI presentada por el titular y evidencia bancaria parcial. Falta acreditar capacidad de emisión de bloqueo de fondos, SBLC o RWA bancaria para completar el criterio documental de la operación.",
    cis: "Recibido",
    documentosRecibidos: ["CIS", "LOI"],
    documentosFaltantes: ["Evidencia bancaria completa (bloqueo de fondos, SBLC o RWA)"],
    inconsistenciasDetectadas: [],
    capacidadJuridica: "Demostrada",
    capacidadFinanciera: "Parcial",
    capacidadOperativa: "Demostrada",
    accesoDirectoPrincipal: "Confirmado",
    cadenaIntermediacion: "Baja",
    alertaCritica: false,
    urgencia: "Media",
    necesitaDeGawer: "Completar evidencia bancaria de capacidad de bloqueo de fondos",
    score: 78,
    gradoPreparacion: 80,
    calidadDocumental: 70,
    riesgoDocumental: 74,
    probabilidadCierre: 76,
    riesgo: "Medio",
    estado: "Solicitud de documentación específica",
    proximaAccion: "Solicitar evidencia bancaria (bloqueo de fondos, SBLC o RWA)",
    recomendacionIA:
      "Titular con acceso directo confirmado y CIS recibido. Documentación de capacidad financiera aún parcial. Sugerido: solicitar evidencia bancaria antes de avanzar.",
    decisionSugerida:
      "Sugerido — solicitar evidencia bancaria específica. Pendiente de validación GAWER.",
    requiereRevisionFernandoLiliana: false,
    resumenEjecutivo:
      "Compra de oro doré por USD 9.8M. Titular con acceso directo y CIS completo. Falta evidencia bancaria de capacidad de bloqueo de fondos, SBLC o RWA.",
    comentariosEjecutivos: [],
    historial: [
      { fecha: "2026-06-24", evento: "Propuesta recibida", responsable: "Equipo comercial" },
      { fecha: "2026-06-25", evento: "CIS recibido y validado preliminarmente", responsable: "Equipo comercial" },
      { fecha: "2026-06-27", evento: "Solicitud de evidencia bancaria específica", responsable: "Motor IA (sugerido)" },
    ],
    fechaRecepcion: "2026-06-24",
  },
  {
    id: "prop-002",
    proponente: "Robert Klein",
    empresa: "Meridian Structured Finance Ltd.",
    email: "r.klein@meridianstructured.co.uk",
    telefono: "+44 20 7946 0958",
    pais: "Reino Unido",
    rol: "CFO (titular)",
    areaNegocio: "Monetización de garantías financieras",
    areaOficialId: "area-oficial-001",
    montoEstimado: 15000000,
    moneda: "EUR",
    descripcion:
      "Monetización de garantía financiera. CIS y LOI presentados directamente por el titular, pero el banco emisor de la garantía aún no fue confirmado de forma independiente.",
    cis: "Recibido",
    documentosRecibidos: ["CIS", "LOI"],
    documentosFaltantes: ["Confirmación independiente del banco emisor", "Documentación específica de la garantía"],
    inconsistenciasDetectadas: [],
    capacidadJuridica: "Demostrada",
    capacidadFinanciera: "Parcial",
    capacidadOperativa: "Parcial",
    accesoDirectoPrincipal: "Confirmado",
    cadenaIntermediacion: "Baja",
    alertaCritica: false,
    urgencia: "Media",
    necesitaDeGawer: "Confirmación de banco emisor y documentación específica de la garantía",
    score: 71,
    gradoPreparacion: 72,
    calidadDocumental: 64,
    riesgoDocumental: 60,
    probabilidadCierre: 68,
    riesgo: "Medio",
    estado: "Solicitud de documentación específica",
    proximaAccion: "Confirmar banco emisor de forma independiente",
    recomendacionIA:
      "CIS y LOI completos, acceso directo al titular confirmado. Banco emisor pendiente de confirmación — condición necesaria antes de continuar según criterio documental de garantías.",
    decisionSugerida:
      "Sugerido — no avanzar hasta confirmar banco emisor. Pendiente de validación GAWER.",
    requiereRevisionFernandoLiliana: false,
    resumenEjecutivo:
      "Monetización de garantía por EUR 15M. Documentación inicial completa (CIS + LOI); pendiente confirmar banco emisor.",
    comentariosEjecutivos: [],
    historial: [
      { fecha: "2026-06-18", evento: "Propuesta recibida", responsable: "Equipo comercial" },
      { fecha: "2026-06-19", evento: "CIS y LOI recibidos", responsable: "Equipo comercial" },
      { fecha: "2026-06-22", evento: "Solicitud de confirmación de banco emisor", responsable: "Motor IA (sugerido)" },
    ],
    fechaRecepcion: "2026-06-18",
  },
  {
    id: "prop-003",
    proponente: "Alex Rivera",
    empresa: "Nexus Digital Assets OTC",
    email: "alex@nexusdigitalotc.io",
    telefono: "+1 305 555 0199",
    pais: "Estados Unidos",
    rol: "CEO (titular)",
    areaNegocio: "Operaciones con criptomonedas",
    areaOficialId: "area-oficial-002",
    montoEstimado: 2000000,
    moneda: "USD",
    descripcion:
      "Compra de criptomonedas por cliente institucional con acceso directo confirmado. Falta evidencia verificable de disponibilidad de fondos para continuar la evaluación.",
    cis: "Recibido",
    documentosRecibidos: ["CIS"],
    documentosFaltantes: ["Evidencia verificable de disponibilidad de fondos"],
    inconsistenciasDetectadas: ["Wallet statement presentado sin verificación de origen"],
    capacidadJuridica: "Demostrada",
    capacidadFinanciera: "No demostrada",
    capacidadOperativa: "Parcial",
    accesoDirectoPrincipal: "Confirmado",
    cadenaIntermediacion: "Baja",
    alertaCritica: false,
    urgencia: "Media",
    necesitaDeGawer: "Evidencia verificable de disponibilidad de fondos",
    score: 58,
    gradoPreparacion: 55,
    calidadDocumental: 48,
    riesgoDocumental: 52,
    probabilidadCierre: 50,
    riesgo: "Medio",
    estado: "Solicitud de documentación específica",
    proximaAccion: "Solicitar evidencia verificable de fondos",
    recomendacionIA:
      "Acceso directo confirmado, pero sin evidencia verificable de fondos la operación no reúne condiciones mínimas. Sugerido: no continuar sin esa evidencia.",
    decisionSugerida:
      "Sugerido — solicitar evidencia verificable de fondos antes de continuar. Pendiente de validación GAWER.",
    requiereRevisionFernandoLiliana: false,
    resumenEjecutivo:
      "Operación cripto OTC por USD 2M. Cliente con acceso directo pero sin evidencia verificable de fondos.",
    comentariosEjecutivos: [],
    historial: [
      { fecha: "2026-06-20", evento: "Propuesta recibida", responsable: "Equipo comercial" },
      { fecha: "2026-06-21", evento: "Inconsistencia detectada en wallet statement", responsable: "Motor IA (sugerido)" },
    ],
    fechaRecepcion: "2026-06-20",
  },
  {
    id: "prop-004",
    proponente: "Sin identificar",
    empresa: "Broker independiente sin mandato",
    email: "info@brokerintermediario.net",
    telefono: "No proporcionado",
    pais: "Desconocido",
    rol: "Intermediario",
    areaNegocio: "Servicios de estructuración e intermediación",
    areaOficialId: "area-oficial-001",
    montoEstimado: 40000000,
    moneda: "USD",
    descripcion:
      "Intermediario que busca obtener una oferta de GAWER para presentarla luego a un cliente no identificado. Sin mandato verificable ni acceso directo al titular del negocio — patrón que explica la mayoría de los descartes de GAWER.",
    cis: "Pendiente",
    documentosRecibidos: ["Correo con términos generales"],
    documentosFaltantes: ["CIS", "Mandato / autorización de representación", "Identificación del titular"],
    inconsistenciasDetectadas: ["Sin información esencial sobre la operación", "Cadena de intermediación sin acceso directo al titular"],
    capacidadJuridica: "No demostrada",
    capacidadFinanciera: "No demostrada",
    capacidadOperativa: "No demostrada",
    accesoDirectoPrincipal: "Desconocido",
    cadenaIntermediacion: "Crítica",
    alertaCritica: false,
    urgencia: "Alta",
    necesitaDeGawer: "No aplicable — sin capacidad real de concretar",
    score: 18,
    gradoPreparacion: 12,
    calidadDocumental: 8,
    riesgoDocumental: 15,
    probabilidadCierre: 10,
    riesgo: "Crítico",
    estado: "Descartado",
    proximaAccion: "No avanzar — responder con cortesía estándar",
    recomendacionIA:
      "Patrón típico de intermediación sin acceso directo al titular: sin CIS, sin mandato, sin información esencial. Descarte sugerido según criterio de intermediación de GAWER.",
    decisionSugerida: "Descarte sugerido. Pendiente de validación GAWER.",
    requiereRevisionFernandoLiliana: false,
    resumenEjecutivo:
      "Propuesta de intermediario sin mandato por USD 40M. Sin acceso directo al titular ni documentación mínima. Descarte sugerido.",
    comentariosEjecutivos: [
      {
        autor: "Sistema IA",
        fecha: "2026-06-18",
        texto: "Descarte sugerido por patrón de intermediación sin acceso directo — no vinculante, requiere confirmación del equipo comercial.",
      },
    ],
    historial: [
      { fecha: "2026-06-18", evento: "Propuesta recibida", responsable: "Sistema" },
      { fecha: "2026-06-18", evento: "Descarte sugerido por intermediación sin acceso directo", responsable: "Motor IA (sugerido)" },
    ],
    fechaRecepcion: "2026-06-18",
  },
  {
    id: "prop-005",
    proponente: "Anders Voss",
    empresa: "Voss Capital Instruments GmbH",
    email: "a.voss@vosscapital.eu",
    telefono: "+49 69 555 4410",
    pais: "Alemania",
    rol: "Representante (mandato no verificado)",
    areaNegocio: "Gestión de garantías financieras",
    areaOficialId: "area-oficial-001",
    montoEstimado: 100000000,
    moneda: "USD",
    descripcion:
      "Operación estructurada sobre MTNs del HSBC respaldadas en LTNs brasileras. GAWER no acepta este tipo de instrumento: se trata de una regla crítica validada por Fernando, ya que este tipo de operación se ha verificado como falsa de forma consistente.",
    cis: "Pendiente",
    documentosRecibidos: ["Draft de términos", "Presentación del instrumento"],
    documentosFaltantes: ["CIS", "Verificación bancaria independiente"],
    inconsistenciasDetectadas: ["Instrumento del tipo MTN HSBC / LTN brasilera — regla crítica de descarte"],
    capacidadJuridica: "No demostrada",
    capacidadFinanciera: "No demostrada",
    capacidadOperativa: "No demostrada",
    accesoDirectoPrincipal: "No confirmado",
    cadenaIntermediacion: "Alta",
    alertaCritica: true,
    alertaCriticaMotivo:
      "MTNs del HSBC respaldadas en LTNs brasileras — GAWER no opera este instrumento; Fernando indica que estas operaciones son todas falsas.",
    urgencia: "Alta",
    necesitaDeGawer: "No aplicable — instrumento excluido por regla crítica",
    score: 4,
    gradoPreparacion: 5,
    calidadDocumental: 5,
    riesgoDocumental: 2,
    probabilidadCierre: 2,
    riesgo: "Crítico",
    estado: "Descartado",
    proximaAccion: "No avanzar — aplica regla crítica MTN HSBC / LTN brasilera",
    recomendacionIA:
      "Alerta crítica: instrumento MTN HSBC respaldado en LTN brasilera. Regla validada por Fernando — descarte sugerido de forma automática. Requiere confirmación humana antes de cerrar el caso.",
    decisionSugerida: "Descarte sugerido — alerta crítica. Pendiente de validación GAWER.",
    requiereRevisionFernandoLiliana: false,
    resumenEjecutivo:
      "Propuesta de USD 100M sobre MTN HSBC / LTN brasilera. Alerta crítica activada según regla validada por Fernando.",
    comentariosEjecutivos: [
      {
        autor: "Sistema IA",
        fecha: "2026-06-16",
        texto: "Alerta crítica activada: MTN HSBC / LTN brasilera. Regla validada por Fernando — descarte sugerido, no automático.",
      },
    ],
    historial: [
      { fecha: "2026-06-16", evento: "Propuesta recibida", responsable: "Sistema" },
      { fecha: "2026-06-16", evento: "Alerta crítica MTN HSBC / LTN brasilera activada", responsable: "Motor IA (sugerido)" },
    ],
    fechaRecepcion: "2026-06-16",
  },
  {
    id: "prop-006",
    proponente: "Elena Marchetti",
    empresa: "Marchetti Industrial Holdings S.p.A.",
    email: "e.marchetti@marchettiholdings.it",
    telefono: "+39 02 555 8890",
    pais: "Italia",
    rol: "Presidenta (titular)",
    areaNegocio: "Servicios de estructuración e intermediación",
    areaOficialId: "area-oficial-001",
    montoEstimado: 22000000,
    moneda: "EUR",
    descripcion:
      "Estructuración de operación financiera con documentación sólida y acceso directo al principal. CIS, LOI, evidencia bancaria y capacidad jurídica, financiera y operativa demostradas. Sin inconsistencias detectadas.",
    cis: "Recibido",
    documentosRecibidos: ["CIS", "LOI", "Evidencia bancaria", "Referencias corporativas"],
    documentosFaltantes: [],
    inconsistenciasDetectadas: [],
    capacidadJuridica: "Demostrada",
    capacidadFinanciera: "Demostrada",
    capacidadOperativa: "Demostrada",
    accesoDirectoPrincipal: "Confirmado",
    cadenaIntermediacion: "Baja",
    alertaCritica: false,
    urgencia: "Media",
    necesitaDeGawer: "Estructuración y cierre",
    score: 94,
    gradoPreparacion: 95,
    calidadDocumental: 96,
    riesgoDocumental: 92,
    probabilidadCierre: 93,
    riesgo: "Bajo",
    estado: "Revisión ejecutiva Fernando/Liliana",
    proximaAccion: "Preparar briefing ejecutivo y plan de estructuración",
    recomendacionIA:
      "Documentación completa, titular con acceso directo confirmado y capacidades demostradas. Indicios razonables de viabilidad — sugerido escalar a revisión ejecutiva Fernando/Liliana.",
    decisionSugerida: "Sugerido — avanzar a revisión ejecutiva. Pendiente de validación GAWER.",
    requiereRevisionFernandoLiliana: true,
    motivoRevisionFernandoLiliana:
      "Cliente cumplió requisitos básicos y la operación muestra indicios razonables de viabilidad.",
    resumenEjecutivo:
      "Estructuración financiera por EUR 22M. Documentación completa y acceso directo confirmado. Lista para revisión ejecutiva.",
    comentariosEjecutivos: [
      {
        autor: "Fernando G.",
        fecha: "2026-07-02",
        texto: "Caso prioritario para esta semana. Preparar briefing con plan de estructuración y plazos.",
      },
    ],
    historial: [
      { fecha: "2026-06-10", evento: "Propuesta recibida", responsable: "Equipo comercial" },
      { fecha: "2026-06-25", evento: "Documentación validada preliminarmente", responsable: "Motor IA (sugerido)" },
      { fecha: "2026-07-02", evento: "Escalado a revisión ejecutiva Fernando/Liliana", responsable: "Equipo comercial" },
    ],
    fechaRecepcion: "2026-06-10",
  },
  {
    id: "prop-007",
    proponente: "Robert Klein",
    empresa: "EuroTrade Finance GmbH",
    email: "r.klein@eurotradefin.de",
    telefono: "+49 30 555 7890",
    pais: "Alemania",
    rol: "CFO (titular)",
    areaNegocio: "Monetización de garantías financieras",
    areaOficialId: "area-oficial-001",
    montoEstimado: 15000000,
    moneda: "EUR",
    descripcion:
      "Monetización de garantía bancaria confirmada. Operación formalmente cerrada, con remuneración acordada percibida por GAWER.",
    cis: "Recibido",
    documentosRecibidos: ["CIS", "LOI", "Evidencia bancaria", "Confirmación bancaria del emisor"],
    documentosFaltantes: [],
    inconsistenciasDetectadas: [],
    capacidadJuridica: "Demostrada",
    capacidadFinanciera: "Demostrada",
    capacidadOperativa: "Demostrada",
    accesoDirectoPrincipal: "Confirmado",
    cadenaIntermediacion: "Baja",
    alertaCritica: false,
    urgencia: "Baja",
    necesitaDeGawer: "Cierre administrativo",
    score: 97,
    gradoPreparacion: 97,
    calidadDocumental: 98,
    riesgoDocumental: 96,
    probabilidadCierre: 100,
    riesgo: "Bajo",
    estado: "Ganado",
    proximaAccion: "Sin acción pendiente — caso cerrado",
    recomendacionIA: "Operación cerrada formalmente con remuneración percibida por GAWER.",
    decisionSugerida: "Cerrado — Ganado.",
    requiereRevisionFernandoLiliana: false,
    remuneracionPercibida: true,
    resumenEjecutivo:
      "Monetización LC por EUR 15M. Operación ganada: cerrada formalmente y con remuneración percibida por GAWER.",
    comentariosEjecutivos: [
      { autor: "Fernando G.", fecha: "2026-06-30", texto: "Cierre exitoso. Remuneración acordada percibida." },
    ],
    historial: [
      { fecha: "2026-05-10", evento: "Propuesta recibida", responsable: "Equipo comercial" },
      { fecha: "2026-06-20", evento: "Revisión ejecutiva Fernando/Liliana", responsable: "Fernando G." },
      { fecha: "2026-06-30", evento: "Cierre formal y remuneración percibida", responsable: "Fernando G." },
    ],
    fechaRecepcion: "2026-05-10",
  },
  {
    id: "prop-008",
    proponente: "Priya Nair",
    empresa: "Sterling Commodities Partners",
    email: "p.nair@sterlingcommodities.sg",
    telefono: "+65 6555 0143",
    pais: "Singapur",
    rol: "Directora comercial",
    areaNegocio: "Compra de oro doré",
    areaOficialId: "area-oficial-002",
    montoEstimado: 6000000,
    moneda: "USD",
    descripcion:
      "Operación de compra de oro doré. El proponente no logró aportar la evidencia bancaria mínima requerida ni acreditar capacidad financiera pese a múltiples solicitudes.",
    cis: "Recibido",
    documentosRecibidos: ["CIS"],
    documentosFaltantes: ["LOI", "Evidencia bancaria de capacidad de bloqueo de fondos"],
    inconsistenciasDetectadas: [],
    capacidadJuridica: "Parcial",
    capacidadFinanciera: "No demostrada",
    capacidadOperativa: "No demostrada",
    accesoDirectoPrincipal: "Confirmado",
    cadenaIntermediacion: "Baja",
    alertaCritica: false,
    urgencia: "Baja",
    necesitaDeGawer: "No aplicable — no demuestra requisitos mínimos",
    score: 34,
    gradoPreparacion: 30,
    calidadDocumental: 32,
    riesgoDocumental: 40,
    probabilidadCierre: 20,
    riesgo: "Alto",
    estado: "Perdido",
    proximaAccion: "Sin acción pendiente — caso cerrado",
    recomendacionIA:
      "El proponente no acreditó capacidad financiera mínima pese a solicitudes reiteradas. Caso cerrado como perdido.",
    decisionSugerida: "Cerrado — Perdido.",
    requiereRevisionFernandoLiliana: false,
    resumenEjecutivo:
      "Compra de oro doré por USD 6M. Perdida por no acreditar requisitos mínimos de capacidad financiera.",
    comentariosEjecutivos: [],
    historial: [
      { fecha: "2026-05-20", evento: "Propuesta recibida", responsable: "Equipo comercial" },
      { fecha: "2026-06-05", evento: "Solicitud reiterada de evidencia bancaria", responsable: "Equipo comercial" },
      { fecha: "2026-06-26", evento: "Caso cerrado como perdido", responsable: "Equipo comercial" },
    ],
    fechaRecepcion: "2026-05-20",
  },
];

export const businessAreasOficiales: BusinessAreaOficial[] = [
  {
    id: "area-oficial-001",
    nombre: "Estructuración de operaciones financieras",
    descripcion:
      "Diseño y estructuración de operaciones financieras complejas, incluyendo garantías y monetización de instrumentos.",
  },
  {
    id: "area-oficial-002",
    nombre: "Intermediación en negocios financieros y comerciales",
    descripcion:
      "Intermediación entre partes en operaciones comerciales y financieras, incluyendo commodities y criptoactivos.",
  },
];

export const businessSubAreas: BusinessSubArea[] = [
  {
    id: "sub-001",
    areaOficialId: "area-oficial-001",
    nombre: "Monetización de garantías financieras",
    descripcion:
      "Conversión de instrumentos bancarios (garantías, LC) en liquidez mediante estructuras verificadas.",
    documentosComunes: ["CIS / Corporate Information Sheet"],
    documentosEspecificos: ["LOI", "Documentación específica de la operación"],
    senalesOportunidadReal: [
      "Titular con acceso directo confirmado",
      "CIS completo desde el primer contacto",
      "Banco emisor identificable y dispuesto a confirmar",
    ],
    senalesAlerta: [
      "Cadena de intermediación sin acceso directo al titular",
      "Banco emisor no verificable",
      "Ausencia de información esencial sobre la operación",
    ],
    criterioAvance: "Avanza cuando el titular demuestra capacidad jurídica, financiera y operativa con documentación de respaldo.",
    estado: "activa",
  },
  {
    id: "sub-002",
    areaOficialId: "area-oficial-002",
    nombre: "Compra de oro doré",
    descripcion: "Compra de oro doré con validación de capacidad bancaria del comprador.",
    documentosComunes: ["CIS / Corporate Information Sheet"],
    documentosEspecificos: [
      "LOI",
      "Evidencia bancaria de capacidad de emitir bloqueo de fondos, SBLC o RWA bancaria",
    ],
    senalesOportunidadReal: [
      "LOI emitida directamente por el titular",
      "Evidencia bancaria verificable de capacidad de bloqueo de fondos",
    ],
    senalesAlerta: [
      "Intermediarios sin mandato ni acceso directo al titular",
      "Ausencia de evidencia bancaria",
    ],
    criterioAvance: "Avanza cuando existe LOI y evidencia bancaria que demuestre capacidad real de emitir bloqueo de fondos, SBLC o RWA.",
    estado: "activa",
  },
  {
    id: "sub-003",
    areaOficialId: "area-oficial-002",
    nombre: "Compra, venta e intercambio de criptomonedas",
    descripcion: "Operaciones de compra, venta e intercambio de criptoactivos con evidencia verificable de fondos.",
    documentosComunes: ["CIS / Corporate Information Sheet"],
    documentosEspecificos: ["Evidencia verificable de disponibilidad de fondos"],
    senalesOportunidadReal: [
      "Evidencia verificable de fondos desde el inicio",
      "Acceso directo al titular de la operación",
    ],
    senalesAlerta: [
      "Evidencia de fondos no verificable",
      "Cadena de intermediación sin acceso directo",
    ],
    criterioAvance: "Avanza cuando el proponente presenta evidencia verificable de disponibilidad de fondos.",
    estado: "activa",
  },
  {
    id: "sub-004",
    areaOficialId: "area-oficial-001",
    nombre: "Gestión de garantías financieras",
    descripcion: "Gestión y administración de garantías financieras para operaciones comerciales.",
    documentosComunes: ["CIS / Corporate Information Sheet"],
    documentosEspecificos: ["LOI", "Documentación específica de la garantía"],
    senalesOportunidadReal: [
      "Documentación específica de la garantía completa",
      "Titular con capacidad jurídica y financiera demostrada",
    ],
    senalesAlerta: [
      "Instrumentos del tipo MTN HSBC respaldados en LTN brasilera — regla crítica de descarte",
      "Documentos bancarios alterados o inconsistentes",
    ],
    criterioAvance: "Avanza cuando la documentación específica de la garantía es consistente y no activa ninguna regla crítica de descarte.",
    estado: "activa",
  },
  {
    id: "sub-005",
    areaOficialId: "area-oficial-001",
    nombre: "Servicios de estructuración e intermediación",
    descripcion: "Servicios generales de estructuración e intermediación financiera y comercial.",
    documentosComunes: ["CIS / Corporate Information Sheet"],
    documentosEspecificos: ["LOI", "Documentación de respaldo según la operación específica"],
    senalesOportunidadReal: [
      "Acceso directo al principal",
      "Documentación jurídica, financiera y operativa consistente",
    ],
    senalesAlerta: [
      "Cadena excesiva de intermediación",
      "Falta de información esencial sobre la operación",
    ],
    criterioAvance: "Avanza cuando el conjunto documental demuestra capacidad real de ejecución, evaluado en contexto y no de forma aislada.",
    estado: "activa",
  },
];

export const aiEngines: AIEngine[] = [
  {
    id: "engine-001",
    nombre: "Motor de análisis documental inicial",
    etapa: "Recepción",
    queSugiere: "Un resumen inicial de la documentación recibida y su relación con los requisitos de la subárea correspondiente.",
    queNoPuedeDecidir: "No aprueba, rechaza ni descarta la propuesta.",
    informacionQueUsa: "Documentos adjuntos por el proponente y checklist documental de la subárea.",
    salidaEsperada: "Resumen de documentos recibidos, tipo y relación con requisitos mínimos.",
    responsableAprobacion: "Equipo comercial",
    estado: "activo",
    promptMock:
      "Analiza los documentos adjuntos y resume su relación con los requisitos documentales de la subárea. No emitas una decisión final.",
  },
  {
    id: "engine-002",
    nombre: "Motor de investigación pública del cliente",
    etapa: "Recepción",
    queSugiere: "Información pública disponible sobre el proponente y su empresa (registros, prensa, referencias).",
    queNoPuedeDecidir: "No determina si el cliente es apto para operar con GAWER.",
    informacionQueUsa: "Nombre, empresa y datos de contacto declarados por el proponente; fuentes públicas.",
    salidaEsperada: "Ficha de antecedentes públicos con nivel de confianza de la información hallada.",
    responsableAprobacion: "Equipo comercial",
    estado: "en prueba",
    promptMock:
      "Recopila información pública verificable sobre el proponente y su empresa. Indica el nivel de confianza de cada fuente.",
  },
  {
    id: "engine-003",
    nombre: "Motor de verificación preliminar documental",
    etapa: "Precalificación",
    queSugiere: "Una verificación preliminar de autenticidad y formato de los documentos presentados.",
    queNoPuedeDecidir: "No certifica la autenticidad final de un documento ni valida una operación por sí solo.",
    informacionQueUsa: "Documentos recibidos y formatos oficiales de referencia de la base de conocimiento.",
    salidaEsperada: "Estado preliminar por documento: validado preliminarmente, inconsistente o no suficiente por sí solo.",
    responsableAprobacion: "Equipo de compliance / equipo comercial",
    estado: "en prueba",
    promptMock:
      "Compara cada documento contra los formatos oficiales conocidos. Señala inconsistencias sin certificar autenticidad final.",
  },
  {
    id: "engine-004",
    nombre: "Motor de detección de inconsistencias",
    etapa: "Precalificación",
    queSugiere: "Inconsistencias entre documentos, datos declarados y el contexto de la operación.",
    queNoPuedeDecidir: "No descarta la propuesta de forma autónoma ante una inconsistencia detectada.",
    informacionQueUsa: "Conjunto documental completo y datos declarados por el proponente.",
    salidaEsperada: "Listado de inconsistencias detectadas con nivel de severidad.",
    responsableAprobacion: "Equipo comercial / Fernando o Liliana en casos críticos",
    estado: "activo",
    promptMock:
      "Evalúa el conjunto documental y el contexto de la operación. Lista inconsistencias, nunca un documento aislado.",
  },
  {
    id: "engine-005",
    nombre: "Motor de evaluación de acceso directo al principal",
    etapa: "Precalificación",
    queSugiere: "Un nivel de confianza sobre si el proponente tiene acceso directo al titular del negocio.",
    queNoPuedeDecidir: "No descarta automáticamente a un intermediario sin acceso directo confirmado.",
    informacionQueUsa: "Rol declarado, mandato presentado y relación documental con el titular.",
    salidaEsperada: "Clasificación: acceso directo confirmado, no confirmado o desconocido.",
    responsableAprobacion: "Equipo comercial",
    estado: "activo",
    promptMock:
      "Evalúa si el proponente demuestra acceso directo al titular del negocio. Clasifica como confirmado, no confirmado o desconocido.",
  },
  {
    id: "engine-006",
    nombre: "Motor de evaluación de cadena de intermediación",
    etapa: "Precalificación",
    queSugiere: "El nivel de intermediación de la propuesta (baja, media, alta o crítica).",
    queNoPuedeDecidir: "No descarta la propuesta automáticamente por tener intermediación alta.",
    informacionQueUsa: "Cantidad de intermediarios declarados, mandatos presentados y trazabilidad hacia el titular.",
    salidaEsperada: "Nivel de intermediación con justificación.",
    responsableAprobacion: "Equipo comercial",
    estado: "activo",
    promptMock:
      "Determina el nivel de intermediación de la propuesta según cantidad de intermediarios y trazabilidad hacia el titular.",
  },
  {
    id: "engine-007",
    nombre: "Motor de ranking por preparación, calidad, riesgo y probabilidad",
    etapa: "Ranking",
    queSugiere: "Un score por dimensión (preparación, calidad documental, riesgo documental, probabilidad de cierre) y un score consolidado.",
    queNoPuedeDecidir: "El score no constituye una decisión final ni reemplaza la revisión humana.",
    informacionQueUsa: "Resultados de los motores documentales, de intermediación y de acceso directo.",
    salidaEsperada: "Score por dimensión + score consolidado + categoría sugerida.",
    responsableAprobacion: "Equipo comercial / Fernando o Liliana",
    estado: "activo",
    promptMock:
      "Consolida grado de preparación, calidad documental, riesgo documental y probabilidad de cierre en un score sugerido, no vinculante.",
  },
  {
    id: "engine-008",
    nombre: "Motor de briefing ejecutivo",
    etapa: "Revisión ejecutiva",
    queSugiere: "Un briefing con antecedentes, perfil comercial, documentación, riesgos, preguntas de debida diligencia, alternativas de estructuración, plan de trabajo y responsabilidades sugeridas.",
    queNoPuedeDecidir: "No define la decisión final ni compromete a GAWER frente al cliente.",
    informacionQueUsa: "Toda la ficha de oportunidad y el historial de la propuesta.",
    salidaEsperada: "Briefing ejecutivo de una página para Fernando y Liliana.",
    responsableAprobacion: "Fernando / Liliana",
    estado: "activo",
    promptMock:
      "Genera un briefing ejecutivo con antecedentes, perfil comercial, documentación, riesgos, preguntas de debida diligencia, alternativas, plan de trabajo y responsabilidades sugeridas.",
  },
  {
    id: "engine-009",
    nombre: "Motor de oportunidades comerciales adicionales",
    etapa: "Revisión ejecutiva",
    queSugiere: "Posibles oportunidades comerciales adicionales relacionadas con el cliente o su operación.",
    queNoPuedeDecidir: "No inicia contacto comercial de forma autónoma.",
    informacionQueUsa: "Perfil del cliente, área de negocio y antecedentes públicos.",
    salidaEsperada: "Listado de oportunidades adicionales sugeridas para evaluación del equipo comercial.",
    responsableAprobacion: "Equipo comercial",
    estado: "en prueba",
    promptMock:
      "A partir del perfil del cliente, sugiere oportunidades comerciales adicionales dentro de las áreas de especialización de GAWER.",
  },
  {
    id: "engine-010",
    nombre: "Motor de respuestas automáticas",
    etapa: "Comunicación",
    queSugiere: "Un borrador de respuesta con tono cordial, profesional, claro e instructivo según el estado de la propuesta.",
    queNoPuedeDecidir: "No envía comunicaciones sin revisión humana ni genera expectativas que GAWER no pueda cumplir.",
    informacionQueUsa: "Estado comercial de la propuesta y checklist documental pendiente.",
    salidaEsperada: "Borrador de email para revisión y envío por el equipo comercial.",
    responsableAprobacion: "Equipo comercial",
    estado: "en prueba",
    promptMock:
      "Redacta una respuesta cordial, profesional, clara e instructiva según el estado de la propuesta, sin generar expectativas incumplibles.",
  },
  {
    id: "engine-011",
    nombre: "Curador de base de conocimiento",
    etapa: "Mantenimiento",
    queSugiere: "Actualizaciones sugeridas a criterios, reglas y procedimientos a partir de casos recientes.",
    queNoPuedeDecidir: "No modifica reglas, prompts ni criterios sin aprobación de Fernando y consenso del equipo.",
    informacionQueUsa: "Casos recientes, tickets de mesa de ayuda y decisiones ejecutivas registradas.",
    salidaEsperada: "Borradores de actualización para revisión y aprobación.",
    responsableAprobacion: "Fernando, con consenso del equipo GAWER",
    estado: "pausado",
    promptMock:
      "Analiza casos recientes y sugiere borradores de actualización a la base de conocimiento. Ninguna sugerencia se aplica sin aprobación de Fernando.",
  },
];

export const documents: Document[] = [
  { id: "doc-001", nombre: "CIS - Andes Bullion Trading", tipo: "CIS", obligatorio: true, propuestaId: "prop-001", propuestaNombre: "Andes Bullion Trading S.A.", estado: "Recibido", fechaRecepcion: "2026-06-25" },
  { id: "doc-002", nombre: "LOI - Andes Bullion Trading", tipo: "LOI", obligatorio: false, propuestaId: "prop-001", propuestaNombre: "Andes Bullion Trading S.A.", estado: "Recibido", fechaRecepcion: "2026-06-25" },
  { id: "doc-003", nombre: "Evidencia bancaria - Andes Bullion Trading", tipo: "Evidencia bancaria", obligatorio: false, propuestaId: "prop-001", propuestaNombre: "Andes Bullion Trading S.A.", estado: "Incompleto", fechaRecepcion: "2026-06-27" },
  { id: "doc-004", nombre: "CIS - Meridian Structured Finance", tipo: "CIS", obligatorio: true, propuestaId: "prop-002", propuestaNombre: "Meridian Structured Finance Ltd.", estado: "Recibido", fechaRecepcion: "2026-06-19" },
  { id: "doc-005", nombre: "LOI - Meridian Structured Finance", tipo: "LOI", obligatorio: false, propuestaId: "prop-002", propuestaNombre: "Meridian Structured Finance Ltd.", estado: "Recibido", fechaRecepcion: "2026-06-19" },
  { id: "doc-006", nombre: "Confirmación banco emisor - Meridian", tipo: "Evidencia bancaria", obligatorio: false, propuestaId: "prop-002", propuestaNombre: "Meridian Structured Finance Ltd.", estado: "Pendiente", fechaRecepcion: "" },
  { id: "doc-007", nombre: "CIS - Nexus Digital Assets OTC", tipo: "CIS", obligatorio: true, propuestaId: "prop-003", propuestaNombre: "Nexus Digital Assets OTC", estado: "Recibido", fechaRecepcion: "2026-06-20" },
  { id: "doc-008", nombre: "Wallet statement - Nexus Digital Assets", tipo: "Evidencia verificable de fondos", obligatorio: false, propuestaId: "prop-003", propuestaNombre: "Nexus Digital Assets OTC", estado: "Inconsistente", fechaRecepcion: "2026-06-21" },
  { id: "doc-009", nombre: "Correo con términos generales - Broker sin mandato", tipo: "Mandato / autorización de representación", obligatorio: false, propuestaId: "prop-004", propuestaNombre: "Broker independiente sin mandato", estado: "No suficiente por sí solo", fechaRecepcion: "2026-06-18" },
  { id: "doc-010", nombre: "Draft de términos - Voss Capital (MTN HSBC/LTN)", tipo: "Documentos bancarios inconsistentes", obligatorio: false, propuestaId: "prop-005", propuestaNombre: "Voss Capital Instruments GmbH", estado: "Requiere revisión humana", fechaRecepcion: "2026-06-16" },
  { id: "doc-011", nombre: "Presentación del instrumento - Voss Capital", tipo: "Documentos alterados", obligatorio: false, propuestaId: "prop-005", propuestaNombre: "Voss Capital Instruments GmbH", estado: "Requiere revisión humana", fechaRecepcion: "2026-06-16" },
  { id: "doc-012", nombre: "CIS - Marchetti Industrial Holdings", tipo: "CIS", obligatorio: true, propuestaId: "prop-006", propuestaNombre: "Marchetti Industrial Holdings S.p.A.", estado: "Validado preliminarmente", fechaRecepcion: "2026-06-12" },
  { id: "doc-013", nombre: "LOI - Marchetti Industrial Holdings", tipo: "LOI", obligatorio: false, propuestaId: "prop-006", propuestaNombre: "Marchetti Industrial Holdings S.p.A.", estado: "Validado preliminarmente", fechaRecepcion: "2026-06-13" },
  { id: "doc-014", nombre: "Evidencia bancaria - Marchetti Industrial Holdings", tipo: "Evidencia bancaria", obligatorio: false, propuestaId: "prop-006", propuestaNombre: "Marchetti Industrial Holdings S.p.A.", estado: "Validado preliminarmente", fechaRecepcion: "2026-06-15" },
  { id: "doc-015", nombre: "CIS - EuroTrade Finance", tipo: "CIS", obligatorio: true, propuestaId: "prop-007", propuestaNombre: "EuroTrade Finance GmbH", estado: "Validado preliminarmente", fechaRecepcion: "2026-05-12" },
  { id: "doc-016", nombre: "Confirmación bancaria del emisor - EuroTrade Finance", tipo: "Evidencia bancaria", obligatorio: false, propuestaId: "prop-007", propuestaNombre: "EuroTrade Finance GmbH", estado: "Validado preliminarmente", fechaRecepcion: "2026-06-01" },
  { id: "doc-017", nombre: "CIS - Sterling Commodities Partners", tipo: "CIS", obligatorio: true, propuestaId: "prop-008", propuestaNombre: "Sterling Commodities Partners", estado: "Recibido", fechaRecepcion: "2026-05-22" },
  { id: "doc-018", nombre: "Evidencia bancaria - Sterling Commodities Partners", tipo: "Evidencia bancaria", obligatorio: false, propuestaId: "prop-008", propuestaNombre: "Sterling Commodities Partners", estado: "Incompleto", fechaRecepcion: "" },
];

export const tickets: Ticket[] = [
  { id: "ticket-001", titulo: "Ajustar scoring para intermediarios sin acceso directo al principal", tipo: "Ajustes de scoring", moduloAfectado: "Ranking", importancia: "Alta", urgencia: "Alta", estado: "En desarrollo", responsable: "Fernando G.", fecha: "2026-06-30" },
  { id: "ticket-002", titulo: "Agregar regla crítica: MTNs del HSBC respaldadas en LTNs brasileras", tipo: "Cambios en base de conocimiento", moduloAfectado: "Base de conocimiento", importancia: "Alta", urgencia: "Alta", estado: "Aprobado", responsable: "Fernando G.", fecha: "2026-06-16" },
  { id: "ticket-003", titulo: "Mejorar checklist de CIS en el formulario de propuestas", tipo: "Solicitud de nuevos campos", moduloAfectado: "Propuestas", importancia: "Media", urgencia: "Media", estado: "En análisis", responsable: "Equipo comercial", fecha: "2026-06-27" },
  { id: "ticket-004", titulo: "Crear preguntas automáticas para completar debida diligencia", tipo: "Problema de IA", moduloAfectado: "IA", importancia: "Alta", urgencia: "Media", estado: "Nuevo", responsable: "Equipo IA", fecha: "2026-07-01" },
  { id: "ticket-005", titulo: "Revisar tono de las respuestas automáticas generadas", tipo: "Problema de IA", moduloAfectado: "IA", importancia: "Media", urgencia: "Baja", estado: "En análisis", responsable: "Equipo IA", fecha: "2026-06-22" },
  { id: "ticket-006", titulo: "Agregar campo 'Requiere revisión Fernando/Liliana' en ficha de oportunidad", tipo: "Solicitud de nuevos campos", moduloAfectado: "Propuestas", importancia: "Media", urgencia: "Media", estado: "Aprobado", responsable: "Producto", fecha: "2026-06-25" },
  { id: "ticket-007", titulo: "Error al cargar documentos PDF grandes", tipo: "Error", moduloAfectado: "Documentos", importancia: "Media", urgencia: "Media", estado: "Nuevo", responsable: "Desarrollo", fecha: "2026-07-01" },
  { id: "ticket-008", titulo: "Mejorar filtros en listado de propuestas", tipo: "Mejora", moduloAfectado: "Propuestas", importancia: "Baja", urgencia: "Baja", estado: "Resuelto", responsable: "Desarrollo", fecha: "2026-06-15" },
];

export const knowledgeItems: KnowledgeItem[] = [
  {
    id: "kb-001",
    titulo: "Criterio de oportunidad real",
    categoria: "Comercial",
    estado: "Validado por Fernando",
    responsable: "Fernando G.",
    ultimaActualizacion: "2026-07-01",
    resumen: "GAWER define una oportunidad real cuando el potencial cliente demuestra, mediante documentación y evidencias objetivas, que reúne las condiciones necesarias para concretar la operación propuesta.",
  },
  {
    id: "kb-002",
    titulo: "Regla de descarte por intermediación sin acceso directo",
    categoria: "Comercial",
    estado: "Validado por Fernando",
    responsable: "Fernando G.",
    ultimaActualizacion: "2026-07-01",
    resumen: "La principal causa de descarte (~90% de las propuestas) es la intermediación sin relación directa con el titular del negocio, cuando el intermediario busca solo obtener una oferta de GAWER sin capacidad real de concretar.",
  },
  {
    id: "kb-003",
    titulo: "Documento obligatorio: CIS / Corporate Information Sheet",
    categoria: "Documentación",
    estado: "Validado por Fernando",
    responsable: "Fernando G.",
    ultimaActualizacion: "2026-06-28",
    resumen: "Toda operación comienza con requisitos documentales comunes, principalmente el CIS / Corporate Information Sheet / Hoja de Información Corporativa, para la debida diligencia del cliente.",
  },
  {
    id: "kb-004",
    titulo: "Criterios documentales por tipo de operación",
    categoria: "Documentación",
    estado: "Validado por Fernando",
    responsable: "Fernando G.",
    ultimaActualizacion: "2026-06-28",
    resumen: "Compra de oro: LOI y evidencia bancaria de capacidad de bloqueo de fondos, SBLC o RWA. Criptomonedas: evidencia verificable de fondos. Gestión de garantías: LOI y documentación específica de la operación.",
  },
  {
    id: "kb-005",
    titulo: "Regla crítica: MTNs del HSBC respaldadas en LTNs brasileras",
    categoria: "Compliance",
    estado: "Validado por Fernando",
    responsable: "Fernando G.",
    ultimaActualizacion: "2026-06-16",
    resumen: "GAWER no opera transacciones que involucren MTNs del HSBC respaldadas en LTNs brasileras. Fernando indica que este tipo de operación se ha verificado como falsa de forma consistente.",
  },
  {
    id: "kb-006",
    titulo: "Proceso de intervención de Fernando/Liliana",
    categoria: "Operaciones",
    estado: "Validado por Fernando",
    responsable: "Fernando G.",
    ultimaActualizacion: "2026-06-20",
    resumen: "Fernando o Liliana intervienen cuando el cliente cumplió requisitos básicos y la operación muestra indicios razonables de viabilidad. La primera consulta la recibe siempre el equipo comercial.",
  },
  {
    id: "kb-007",
    titulo: "Definición de operación ganada, perdida y descartada",
    categoria: "Comercial",
    estado: "Validado por Fernando",
    responsable: "Fernando G.",
    ultimaActualizacion: "2026-06-30",
    resumen: "Ganada: cerrada formalmente y con remuneración percibida. Perdida: el cliente no demuestra requisitos mínimos. Descartada: documentación falsa, falta de información o inconsistencias que impiden continuar.",
  },
  {
    id: "kb-008",
    titulo: "Política de uso de IA: sin decisión autónoma",
    categoria: "Gobierno IA",
    estado: "Validado por Fernando",
    responsable: "Fernando G.",
    ultimaActualizacion: "2026-06-30",
    resumen: "La IA asiste con análisis documental, investigación pública, verificación preliminar, detección de inconsistencias e identificación de oportunidades. Nunca aprueba, rechaza ni descarta una negociación de forma autónoma.",
  },
  {
    id: "kb-009",
    titulo: "Tono de las respuestas automáticas",
    categoria: "Comunicación",
    estado: "Validado por Fernando",
    responsable: "Fernando G.",
    ultimaActualizacion: "2026-06-22",
    resumen: "Las respuestas automáticas deben tener un tono cordial, profesional, claro e instructivo, transmitiendo confianza sin generar expectativas que no puedan cumplirse.",
  },
  {
    id: "kb-010",
    titulo: "Documentos requeridos por subárea — checklist operativo",
    categoria: "Documentación",
    estado: "En revisión",
    responsable: "Equipo comercial",
    ultimaActualizacion: "2026-06-29",
    resumen: "Checklist operativo en revisión que traduce los criterios documentales validados por Fernando a listas específicas por subárea de negocio.",
  },
  {
    id: "kb-011",
    titulo: "Glosario de instrumentos financieros",
    categoria: "Referencia",
    estado: "Borrador",
    responsable: "Equipo comercial",
    ultimaActualizacion: "2026-06-30",
    resumen: "Borrador de glosario de instrumentos (LOI, SBLC, RWA, MT760, entre otros) para uso interno del equipo comercial.",
  },
];

export const reportData = {
  propuestasPorArea: [
    { area: "Monetización de garantías financieras", count: 16 },
    { area: "Compra de oro doré", count: 13 },
    { area: "Gestión de garantías financieras", count: 9 },
    { area: "Operaciones con criptomonedas", count: 8 },
    { area: "Servicios de estructuración e intermediación", count: 12 },
  ],
  motivosDescarte: [
    { motivo: "Intermediación sin acceso directo al titular", count: 41 },
    { motivo: "Falta de información esencial de la operación", count: 9 },
    { motivo: "Documentación falsa o alterada", count: 6 },
    { motivo: "Alerta crítica MTN HSBC / LTN brasilera", count: 2 },
  ],
  scorePromedio: 58,
  riesgosDetectados: { bajo: 9, medio: 22, alto: 17, critico: 10 },
  tiempoAhorradoEstimado: "142 horas",
  oportunidadesPorEstado: [
    { estado: "Revisión ejecutiva Fernando/Liliana", count: 4 },
    { estado: "Solicitud de documentación específica", count: 11 },
    { estado: "Análisis documental preliminar", count: 6 },
    { estado: "Estructuración / negociación", count: 3 },
    { estado: "Descartado", count: 43 },
    { estado: "Ganado", count: 3 },
    { estado: "Perdido", count: 4 },
  ],
  indicadoresClave: {
    descartesPorIntermediacionSinAcceso: 41,
    propuestasSinCIS: 14,
    propuestasConDocumentacionIncompleta: 22,
    propuestasConInconsistenciasDocumentales: 9,
    oportunidadesListasParaFernandoLiliana: 4,
    operacionesGanadasConRemuneracionPercibida: 3,
    operacionesPerdidasPorRequisitosMinimos: 4,
    operacionesDescartadasPorFalsedadOFaltaInfo: 47,
  },
};

// Discovery GAWER (/discovery) — trazabilidad entre respuestas de Fernando y su implementación en la maqueta
export interface DiscoveryTraceItem {
  id: string;
  tema: string;
  criterio: string;
  aplicacion: string;
  pantallas: string[];
  estado: string;
}

export const discoveryStats = {
  respuestasAnalizadas: 30,
  reglasIncorporadas: 10,
  modulosImpactados: 8,
  reglasCriticasValidadas: 1,
  decisionesAutonomasIA: 0,
};

export const discoveryTraceability: DiscoveryTraceItem[] = [
  {
    id: "trace-a",
    tema: "Oportunidad real",
    criterio:
      "Una oportunidad real requiere documentación y evidencias objetivas que demuestren capacidad jurídica, financiera y operativa.",
    aplicacion:
      "Ranking, ficha de oportunidad y dashboard evalúan preparación, calidad documental, capacidad demostrada y probabilidad de cierre.",
    pantallas: ["Dashboard", "Ranking", "Propuestas", "Ficha"],
    estado: "Implementado en maqueta",
  },
  {
    id: "trace-b",
    tema: "Descarte por intermediación",
    criterio:
      "El 90% de las propuestas se descarta por intermediarios sin relación directa con el titular del negocio.",
    aplicacion:
      "Se incorporaron filtros de acceso directo al principal, cadena de intermediación y riesgo por intermediación no verificable.",
    pantallas: ["Propuestas", "Ranking", "Formulario público"],
    estado: "Implementado en maqueta",
  },
  {
    id: "trace-c",
    tema: "CIS obligatorio",
    criterio:
      "Toda operación comienza con CIS / Corporate Information Sheet / Hoja de Información Corporativa.",
    aplicacion:
      "El formulario público pregunta por CIS, el listado muestra estado CIS y Documentos lo trata como documento obligatorio.",
    pantallas: ["Formulario público", "Propuestas", "Documentos", "Base de conocimiento"],
    estado: "Implementado en maqueta",
  },
  {
    id: "trace-d",
    tema: "Documentación por tipo de operación",
    criterio:
      "Compra de oro requiere LOI y evidencia bancaria; cripto requiere evidencia verificable de fondos; garantías requieren LOI y documentación específica.",
    aplicacion:
      "Áreas de negocio y Documentos muestran requisitos comunes y específicos por subárea.",
    pantallas: ["Áreas de negocio", "Documentos", "Formulario público"],
    estado: "Implementado en maqueta",
  },
  {
    id: "trace-e",
    tema: "Regla crítica MTN/LTN",
    criterio:
      "Transacciones con MTNs del HSBC respaldadas en LTNs brasileras no deben recibirse, porque Fernando indica que son falsas.",
    aplicacion:
      "Se incorporó alerta crítica, descarte sugerido y caso mock prop-005. El formulario público activa alerta si se marca esa opción.",
    pantallas: ["Formulario público", "Ranking", "Propuestas", "Ficha prop-005", "Base de conocimiento"],
    estado: "Regla crítica implementada",
  },
  {
    id: "trace-f",
    tema: "IA no autónoma",
    criterio: "La IA nunca debe aprobar, rechazar ni descartar una negociación de forma autónoma.",
    aplicacion:
      "Todas las salidas IA se muestran como sugeridas/no vinculantes y requieren revisión humana.",
    pantallas: ["IA", "Ranking", "Ficha", "Formulario público"],
    estado: "Implementado en maqueta",
  },
  {
    id: "trace-g",
    tema: "Intervención Fernando/Liliana",
    criterio:
      "Fernando o Liliana intervienen cuando el cliente cumplió requisitos básicos y hay indicios razonables de viabilidad.",
    aplicacion:
      "Se creó estado/referencia de revisión ejecutiva Fernando/Liliana y se muestra en criterios de avance.",
    pantallas: ["Propuestas", "Ficha", "Reportes", "Configuración"],
    estado: "Implementado en maqueta",
  },
  {
    id: "trace-h",
    tema: "Definición de ganado",
    criterio:
      "Una operación se considera ganada solo cuando fue formalmente cerrada y GAWER percibió la remuneración acordada.",
    aplicacion: "Estados comerciales y reportes usan esta definición.",
    pantallas: ["Reportes", "Configuración", "Ranking"],
    estado: "Implementado en maqueta",
  },
  {
    id: "trace-i",
    tema: "Definición de perdido/descarte",
    criterio:
      "Perdida cuando el cliente no demuestra requisitos mínimos. Descartada cuando hay documentación falsa, falta de información o inconsistencia crítica.",
    aplicacion: "Se incorporaron estados comerciales y motivos de descarte.",
    pantallas: ["Propuestas", "Reportes", "Configuración"],
    estado: "Implementado en maqueta",
  },
  {
    id: "trace-j",
    tema: "Gobierno IA",
    criterio:
      "Los cambios en prompts, reglas o criterios de IA los aprueba Fernando, con consenso del equipo GAWER.",
    aplicacion:
      "Se incorporó el bloque \"Gobierno IA\" en la pantalla de IA y una sección dedicada de reglas críticas validadas en Configuración.",
    pantallas: ["IA", "Configuración", "Base de conocimiento"],
    estado: "Implementado en maqueta",
  },
];

export function getScoreCategory(score: number): string {
  if (score >= 85) return "Lista para revisión ejecutiva";
  if (score >= 65) return "Requiere documentación adicional";
  if (score >= 40) return "Riesgo documental elevado";
  if (score >= 20) return "Intermediación no verificable";
  return "Descarte sugerido por inconsistencia crítica";
}

export function getRankingCategory(p: Proposal): string {
  if (p.alertaCritica) return "Descarte sugerido por inconsistencia crítica";
  if (p.accesoDirectoPrincipal === "Desconocido" || p.cadenaIntermediacion === "Crítica") {
    return "Intermediación no verificable";
  }
  if (p.riesgo === "Alto" || p.riesgo === "Crítico") return "Riesgo documental elevado";
  if (p.requiereRevisionFernandoLiliana) return "Lista para revisión ejecutiva";
  if (p.cis === "Pendiente" || p.documentosFaltantes.length > 0) return "Requiere documentación adicional";
  return "Requiere documentación adicional";
}

export function formatCurrency(amount: number, currency: string): string {
  return new Intl.NumberFormat("es-AR", {
    style: "currency",
    currency,
    maximumFractionDigits: 0,
  }).format(amount);
}

export function getProposalById(id: string): Proposal | undefined {
  return proposals.find((p) => p.id === id);
}
