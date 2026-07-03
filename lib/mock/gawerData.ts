export type RiskLevel = "Bajo" | "Medio" | "Alto" | "Crítico";
export type ProposalStatus =
  | "Nueva propuesta recibida"
  | "Precalificación automática"
  | "Solicitud de información adicional"
  | "Revisión ejecutiva"
  | "Validación documental / compliance"
  | "Negociación / estructuración"
  | "Ganado"
  | "Perdido"
  | "Descartado";

export type DocumentStatus =
  | "recibido"
  | "pendiente"
  | "incompleto"
  | "inconsistente"
  | "requiere revisión humana";

export type KnowledgeStatus = "borrador" | "en revisión" | "validado" | "obsoleto";
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
  montoEstimado: number;
  moneda: string;
  descripcion: string;
  documentosDisponibles: string[];
  urgencia: string;
  necesitaDeGawer: string;
  score: number;
  scoreComercial: number;
  scoreDocumental: number;
  scoreRiesgo: number;
  scoreViabilidad: number;
  riesgo: RiskLevel;
  estado: ProposalStatus;
  proximaAccion: string;
  recomendacionIA: string;
  decisionRecomendada: string;
  resumenEjecutivo: string;
  comentariosEjecutivos: { autor: string; fecha: string; texto: string }[];
  historial: { fecha: string; evento: string; responsable: string }[];
  fechaRecepcion: string;
}

export interface BusinessArea {
  id: string;
  nombre: string;
  descripcion: string;
  criteriosMinimos: string[];
  documentosEsperados: string[];
  senalesAlerta: string[];
  estado: "activa" | "en definición";
}

export interface AIEngine {
  id: string;
  nombre: string;
  etapa: string;
  objetivo: string;
  estado: EngineStatus;
  salidaEsperada: string;
  promptMock: string;
}

export interface Document {
  id: string;
  nombre: string;
  tipo: string;
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
}

export const dashboardStats = {
  propuestasRecibidas: 47,
  propuestasEnRevision: 12,
  oportunidadesPrioritarias: 5,
  propuestasDescartadas: 28,
  riesgoAltoDetectado: 8,
  tiempoEjecutivoAhorrado: "142 horas",
};

export const commercialStates: ProposalStatus[] = [
  "Nueva propuesta recibida",
  "Precalificación automática",
  "Solicitud de información adicional",
  "Revisión ejecutiva",
  "Validación documental / compliance",
  "Negociación / estructuración",
  "Ganado",
  "Perdido",
  "Descartado",
];

export const proposals: Proposal[] = [
  {
    id: "prop-001",
    proponente: "James Whitfield",
    empresa: "Global Gold Trading Ltd.",
    email: "j.whitfield@globalgoldtrading.com",
    telefono: "+971 50 123 4567",
    pais: "Emiratos Árabes Unidos",
    rol: "Director comercial",
    areaNegocio: "Operaciones de venta de oro",
    montoEstimado: 12500000,
    moneda: "USD",
    descripcion:
      "Operación de venta de oro refinado con entrega FOB Dubai. Vendedor con historial en mercado secundario. Requiere validación de origen y cadena de custodia.",
    documentosDisponibles: ["LOI", "CIS", "Proof of Product"],
    urgencia: "Media",
    necesitaDeGawer: "Validación de origen y estructura de cierre",
    score: 86,
    scoreComercial: 88,
    scoreDocumental: 82,
    scoreRiesgo: 78,
    scoreViabilidad: 90,
    riesgo: "Medio",
    estado: "Revisión ejecutiva",
    proximaAccion: "Validar documentación de origen",
    recomendacionIA:
      "Oportunidad prioritaria. Perfil comercial sólido con documentación parcial. Recomendar avance a validación documental tras confirmar origen.",
    decisionRecomendada: "Avanzar con precaución — solicitar certificación de refinadora",
    resumenEjecutivo:
      "Propuesta de venta de oro por USD 12.5M con entregables documentados parcialmente. Score elevado por viabilidad comercial y perfil del proponente.",
    comentariosEjecutivos: [
      {
        autor: "Fernando G.",
        fecha: "2026-06-28",
        texto: "Interesante volumen. Priorizar validación de origen antes de cualquier LOI vinculante.",
      },
    ],
    historial: [
      { fecha: "2026-06-25", evento: "Propuesta recibida", responsable: "Sistema" },
      { fecha: "2026-06-26", evento: "Precalificación automática completada", responsable: "Motor IA" },
      { fecha: "2026-06-28", evento: "Escalada a revisión ejecutiva", responsable: "Fernando G." },
    ],
    fechaRecepcion: "2026-06-25",
  },
  {
    id: "prop-002",
    proponente: "Michael Chen",
    empresa: "Capital Bridge Partners",
    email: "m.chen@capitalbridge.io",
    telefono: "+44 20 7946 0958",
    pais: "Reino Unido",
    rol: "Managing Partner",
    areaNegocio: "Monetización de garantías bancarias",
    montoEstimado: 50000000,
    moneda: "USD",
    descripcion:
      "Monetización de BG emitida por banco de segunda línea. Intermediario con mandato aparente pero sin verificación independiente del banco emisor.",
    documentosDisponibles: ["LOI", "CIS", "Draft BG"],
    urgencia: "Alta",
    necesitaDeGawer: "Verificación de banco emisor y mandato del intermediario",
    score: 74,
    scoreComercial: 80,
    scoreDocumental: 65,
    scoreRiesgo: 55,
    scoreViabilidad: 72,
    riesgo: "Alto",
    estado: "Solicitud de información adicional",
    proximaAccion: "Confirmar banco emisor y mandato",
    recomendacionIA:
      "Oportunidad interesante con riesgo elevado. No avanzar sin confirmación directa del banco emisor y verificación de mandato.",
    decisionRecomendada: "Solicitar información adicional — no avanzar sin verificación bancaria",
    resumenEjecutivo:
      "Operación de monetización BG por USD 50M. Monto significativo pero riesgo alto por falta de verificación del emisor.",
    comentariosEjecutivos: [],
    historial: [
      { fecha: "2026-06-20", evento: "Propuesta recibida", responsable: "Sistema" },
      { fecha: "2026-06-21", evento: "Alerta de riesgo alto generada", responsable: "Motor IA" },
    ],
    fechaRecepcion: "2026-06-20",
  },
  {
    id: "prop-003",
    proponente: "Alex Rivera",
    empresa: "Crypto OTC Desk",
    email: "alex@cryptootc.io",
    telefono: "+1 305 555 0199",
    pais: "Estados Unidos",
    rol: "CEO",
    areaNegocio: "Compra, venta y cambio de criptomonedas",
    montoEstimado: 2000000,
    moneda: "USD",
    descripcion:
      "Compra de BTC por cliente institucional. Falta trazabilidad completa de fondos y wallet verification.",
    documentosDisponibles: ["CIS", "Wallet statement parcial"],
    urgencia: "Media",
    necesitaDeGawer: "Estructura de compliance y trazabilidad",
    score: 62,
    scoreComercial: 70,
    scoreDocumental: 45,
    scoreRiesgo: 60,
    scoreViabilidad: 68,
    riesgo: "Medio",
    estado: "Solicitud de información adicional",
    proximaAccion: "Solicitar trazabilidad de fondos",
    recomendacionIA:
      "Requiere más información. Documentación insuficiente para evaluar riesgo de compliance.",
    decisionRecomendada: "Solicitar trazabilidad completa antes de continuar",
    resumenEjecutivo:
      "Operación crypto OTC por USD 2M. Información incompleta en documentación de origen de fondos.",
    comentariosEjecutivos: [],
    historial: [
      { fecha: "2026-06-22", evento: "Propuesta recibida", responsable: "Sistema" },
    ],
    fechaRecepcion: "2026-06-22",
  },
  {
    id: "prop-004",
    proponente: "Sin identificar",
    empresa: "Broker independiente sin mandato",
    email: "info@unknownbroker.net",
    telefono: "No proporcionado",
    pais: "Desconocido",
    rol: "Intermediario",
    areaNegocio: "Emisión de garantías frescas",
    montoEstimado: 100000000,
    moneda: "USD",
    descripcion:
      "Oferta de SBLC fresh cut sin mandato verificable. Múltiples señales de alerta detectadas por motor de riesgo.",
    documentosDisponibles: ["Email con términos genéricos"],
    urgencia: "Alta",
    necesitaDeGawer: "No aplicable — propuesta no calificada",
    score: 24,
    scoreComercial: 15,
    scoreDocumental: 10,
    scoreRiesgo: 5,
    scoreViabilidad: 20,
    riesgo: "Crítico",
    estado: "Descartado",
    proximaAccion: "No avanzar sin mandato verificable",
    recomendacionIA:
      "Descartar sugerido. Patrón consistente con operaciones no verificables. Sin mandato, sin CIS, sin banco identificado.",
    decisionRecomendada: "Descartar — no responder",
    resumenEjecutivo:
      "Propuesta de SBLC por USD 100M sin documentación mínima. Score crítico. Descarte automático recomendado.",
    comentariosEjecutivos: [
      {
        autor: "Sistema IA",
        fecha: "2026-06-18",
        texto: "Descarte automático sugerido por motor de riesgo. Patrón de fraude conocido.",
      },
    ],
    historial: [
      { fecha: "2026-06-18", evento: "Propuesta recibida", responsable: "Sistema" },
      { fecha: "2026-06-18", evento: "Descarte sugerido automáticamente", responsable: "Motor IA" },
    ],
    fechaRecepcion: "2026-06-18",
  },
  {
    id: "prop-005",
    proponente: "Elena Vasquez",
    empresa: "Swiss Paymaster AG",
    email: "e.vasquez@swisspaymaster.ch",
    telefono: "+41 44 555 0123",
    pais: "Suiza",
    rol: "Directora de operaciones",
    areaNegocio: "Servicios de paymaster",
    montoEstimado: 8500000,
    moneda: "USD",
    descripcion:
      "Servicio de paymaster para operación de commodities. Entidad suiza con referencias verificables parcialmente.",
    documentosDisponibles: ["CIS", "Licencia", "Referencias bancarias"],
    urgencia: "Baja",
    necesitaDeGawer: "Due diligence de entidad paymaster",
    score: 79,
    scoreComercial: 82,
    scoreDocumental: 78,
    scoreRiesgo: 72,
    scoreViabilidad: 80,
    riesgo: "Medio",
    estado: "Validación documental / compliance",
    proximaAccion: "Completar due diligence de entidad",
    recomendacionIA: "Oportunidad interesante. Avanzar con due diligence estándar.",
    decisionRecomendada: "Continuar validación documental",
    resumenEjecutivo:
      "Servicio paymaster por USD 8.5M. Documentación razonable. En fase de compliance.",
    comentariosEjecutivos: [],
    historial: [
      { fecha: "2026-06-15", evento: "Propuesta recibida", responsable: "Sistema" },
      { fecha: "2026-06-20", evento: "Avance a validación documental", responsable: "Compliance" },
    ],
    fechaRecepcion: "2026-06-15",
  },
  {
    id: "prop-006",
    proponente: "Robert Klein",
    empresa: "EuroTrade Finance GmbH",
    email: "r.klein@eurotradefin.de",
    telefono: "+49 30 555 7890",
    pais: "Alemania",
    rol: "CFO",
    areaNegocio: "Monetización de garantías bancarias",
    montoEstimado: 15000000,
    moneda: "EUR",
    descripcion:
      "Monetización de LC confirmada. Documentación completa con verificación bancaria preliminar positiva.",
    documentosDisponibles: ["LOI", "CIS", "LC", "Swift copy", "Proof of funds"],
    urgencia: "Media",
    necesitaDeGawer: "Estructuración y cierre",
    score: 91,
    scoreComercial: 92,
    scoreDocumental: 95,
    scoreRiesgo: 85,
    scoreViabilidad: 93,
    riesgo: "Bajo",
    estado: "Negociación / estructuración",
    proximaAccion: "Preparar term sheet de cierre",
    recomendacionIA:
      "Oportunidad prioritaria. Documentación sólida. Recomendar avance a negociación.",
    decisionRecomendada: "Avanzar a estructuración",
    resumenEjecutivo:
      "Monetización LC por EUR 15M. Mejor propuesta del pipeline actual. Documentación verificada.",
    comentariosEjecutivos: [
      {
        autor: "Fernando G.",
        fecha: "2026-07-01",
        texto: "Prioridad máxima. Preparar term sheet esta semana.",
      },
    ],
    historial: [
      { fecha: "2026-05-10", evento: "Propuesta recibida", responsable: "Sistema" },
      { fecha: "2026-06-30", evento: "Avance a negociación", responsable: "Fernando G." },
    ],
    fechaRecepcion: "2026-05-10",
  },
];

export const businessAreas: BusinessArea[] = [
  {
    id: "area-001",
    nombre: "Operaciones de venta de oro",
    descripcion:
      "Compra y venta de oro físico con validación de origen, refinadora y cadena de custodia.",
    criteriosMinimos: [
      "Refinadora acreditada (LBMA o equivalente)",
      "Proof of Product verificable",
      "Cadena de custodia documentada",
      "KYC completo del vendedor",
    ],
    documentosEsperados: ["LOI", "CIS", "POP", "Assay report", "KYC"],
    senalesAlerta: [
      "Origen no verificable",
      "Precio significativamente bajo mercado",
      "Intermediarios múltiples sin mandato",
    ],
    estado: "activa",
  },
  {
    id: "area-002",
    nombre: "Monetización de garantías bancarias",
    descripcion:
      "Conversión de instrumentos bancarios (BG, SBLC, LC) en liquidez mediante estructuras verificadas.",
    criteriosMinimos: [
      "Banco emisor verificable (Tier 1 o 2)",
      "Instrumento auténtico confirmado",
      "Mandato del intermediario verificado",
      "MT760 o equivalente disponible",
    ],
    documentosEsperados: ["LOI", "CIS", "Draft instrument", "Bank confirmation", "Mandate letter"],
    senalesAlerta: [
      "Fresh cut / season cut",
      "Banco emisor no verificable",
      "Sin MT760 previo al cierre",
      "Upfront fees exigidos",
    ],
    estado: "activa",
  },
  {
    id: "area-003",
    nombre: "Emisión de garantías frescas",
    descripcion:
      "Estructuración y emisión de garantías bancarias nuevas para operaciones comerciales.",
    criteriosMinimos: [
      "Beneficiario identificado y verificado",
      "Operación subyacente real",
      "Capacidad bancaria confirmada",
      "Compliance jurisdiccional aprobado",
    ],
    documentosEsperados: ["Application form", "CIS", "Operación subyacente", "KYC"],
    senalesAlerta: [
      "Sin operación subyacente",
      "Beneficiario no identificable",
      "Jurisdicción de alto riesgo sin justificación",
    ],
    estado: "activa",
  },
  {
    id: "area-004",
    nombre: "Servicios de paymaster",
    descripcion:
      "Administración de fondos en operaciones complejas con custodia independiente y trazabilidad.",
    criteriosMinimos: [
      "Entidad paymaster licenciada",
      "Referencias bancarias verificables",
      "Estructura legal clara",
      "Segregación de fondos garantizada",
    ],
    documentosEsperados: ["Licencia", "CIS", "Referencias", "Estructura legal"],
    senalesAlerta: [
      "Entidad sin licencia verificable",
      "Cuentas en jurisdicciones opacas",
      "Sin segregación de fondos",
    ],
    estado: "activa",
  },
  {
    id: "area-005",
    nombre: "Compra, venta y cambio de criptomonedas",
    descripcion:
      "Operaciones OTC de criptoactivos con compliance AML/KYC y trazabilidad de fondos.",
    criteriosMinimos: [
      "Wallet verification completa",
      "Trazabilidad de fondos (origen limpio)",
      "KYC/AML del contraparte",
      "Límites jurisdiccionales respetados",
    ],
    documentosEsperados: ["KYC", "Wallet proof", "Source of funds", "Transaction history"],
    senalesAlerta: [
      "Fondos sin origen identificable",
      "Mixers o tumblers detectados",
      "Jurisdicción sancionada",
    ],
    estado: "en definición",
  },
];

export const aiEngines: AIEngine[] = [
  {
    id: "engine-001",
    nombre: "Clasificador de tipo de negocio",
    etapa: "Recepción",
    objetivo: "Identificar automáticamente el área de negocio de cada propuesta entrante",
    estado: "activo",
    salidaEsperada: "Categoría de negocio + nivel de confianza",
    promptMock:
      "Analiza la propuesta y clasifica en: oro, garantías, paymaster, crypto u otro. Indica confianza 0-100.",
  },
  {
    id: "engine-002",
    nombre: "Evaluador de completitud",
    etapa: "Precalificación",
    objetivo: "Verificar que la propuesta incluya campos y documentos mínimos requeridos",
    estado: "activo",
    salidaEsperada: "Lista de campos faltantes + score de completitud",
    promptMock:
      "Evalúa completitud vs criterios del área. Lista campos y documentos ausentes.",
  },
  {
    id: "engine-003",
    nombre: "Evaluador comercial",
    etapa: "Precalificación",
    objetivo: "Evaluar viabilidad comercial y alineación con capacidades de GAWER",
    estado: "activo",
    salidaEsperada: "Score comercial 0-100 + observaciones",
    promptMock:
      "Evalúa viabilidad comercial considerando monto, área, perfil del proponente y alineación estratégica.",
  },
  {
    id: "engine-004",
    nombre: "Evaluador de riesgo",
    etapa: "Precalificación",
    objetivo: "Detectar señales de alerta y asignar nivel de riesgo",
    estado: "activo",
    salidaEsperada: "Nivel de riesgo + señales detectadas",
    promptMock:
      "Identifica señales de alerta según base de conocimiento validada. Asigna riesgo: bajo, medio, alto, crítico.",
  },
  {
    id: "engine-005",
    nombre: "Verificador documental inicial",
    etapa: "Validación documental",
    objetivo: "Revisión preliminar de consistencia y completitud documental",
    estado: "en prueba",
    salidaEsperada: "Estado por documento + inconsistencias detectadas",
    promptMock:
      "Revisa documentos adjuntos. Identifica inconsistencias, campos vacíos y documentos faltantes.",
  },
  {
    id: "engine-006",
    nombre: "Motor de ranking general",
    etapa: "Ranking",
    objetivo: "Calcular score GAWER consolidado a partir de sub-scores",
    estado: "activo",
    salidaEsperada: "Score total + desglose por dimensión",
    promptMock:
      "Consolida scores comercial, documental, riesgo y viabilidad en score GAWER 0-100.",
  },
  {
    id: "engine-007",
    nombre: "Generador de briefing ejecutivo",
    etapa: "Revisión ejecutiva",
    objetivo: "Generar resumen ejecutivo para decisión de Fernando",
    estado: "activo",
    salidaEsperada: "Briefing de 1 página con recomendación",
    promptMock:
      "Genera briefing ejecutivo: resumen, riesgos, oportunidad, recomendación y próxima acción.",
  },
  {
    id: "engine-008",
    nombre: "Redactor de respuesta automática",
    etapa: "Comunicación",
    objetivo: "Redactar respuestas estándar según estado de la propuesta",
    estado: "en prueba",
    salidaEsperada: "Borrador de email de respuesta",
    promptMock:
      "Redacta respuesta profesional según estado: solicitud info, descarte cordial, avance a siguiente etapa.",
  },
  {
    id: "engine-009",
    nombre: "Curador de base de conocimiento",
    etapa: "Mantenimiento",
    objetivo: "Sugerir actualizaciones a la base de conocimiento basándose en casos recientes",
    estado: "pausado",
    salidaEsperada: "Sugerencias de actualización + borradores",
    promptMock:
      "Analiza casos recientes y sugiere actualizaciones a criterios, glosario y procedimientos.",
  },
];

export const documents: Document[] = [
  { id: "doc-001", nombre: "KYC - Global Gold Trading", tipo: "KYC", propuestaId: "prop-001", propuestaNombre: "Global Gold Trading Ltd.", estado: "recibido", fechaRecepcion: "2026-06-25" },
  { id: "doc-002", nombre: "LOI - Global Gold Trading", tipo: "LOI", propuestaId: "prop-001", propuestaNombre: "Global Gold Trading Ltd.", estado: "recibido", fechaRecepcion: "2026-06-25" },
  { id: "doc-003", nombre: "CIS - Capital Bridge", tipo: "CIS", propuestaId: "prop-002", propuestaNombre: "Capital Bridge Partners", estado: "incompleto", fechaRecepcion: "2026-06-20" },
  { id: "doc-004", nombre: "Draft BG - Capital Bridge", tipo: "documentos bancarios", propuestaId: "prop-002", propuestaNombre: "Capital Bridge Partners", estado: "requiere revisión humana", fechaRecepcion: "2026-06-21" },
  { id: "doc-005", nombre: "Mandato - Capital Bridge", tipo: "mandato", propuestaId: "prop-002", propuestaNombre: "Capital Bridge Partners", estado: "pendiente", fechaRecepcion: "" },
  { id: "doc-006", nombre: "Wallet Statement - Crypto OTC", tipo: "wallet/trazabilidad cripto", propuestaId: "prop-003", propuestaNombre: "Crypto OTC Desk", estado: "inconsistente", fechaRecepcion: "2026-06-22" },
  { id: "doc-007", nombre: "Proof of Funds - EuroTrade", tipo: "proof of funds", propuestaId: "prop-006", propuestaNombre: "EuroTrade Finance GmbH", estado: "recibido", fechaRecepcion: "2026-05-12" },
  { id: "doc-008", nombre: "LC - EuroTrade Finance", tipo: "documentos bancarios", propuestaId: "prop-006", propuestaNombre: "EuroTrade Finance GmbH", estado: "recibido", fechaRecepcion: "2026-05-15" },
  { id: "doc-009", nombre: "POP - Global Gold Trading", tipo: "proof of product", propuestaId: "prop-001", propuestaNombre: "Global Gold Trading Ltd.", estado: "requiere revisión humana", fechaRecepcion: "2026-06-26" },
  { id: "doc-010", nombre: "Licencia - Swiss Paymaster", tipo: "KYC", propuestaId: "prop-005", propuestaNombre: "Swiss Paymaster AG", estado: "recibido", fechaRecepcion: "2026-06-15" },
];

export const tickets: Ticket[] = [
  { id: "ticket-001", titulo: "Score de riesgo incorrecto para prop-003", tipo: "Problema de IA", moduloAfectado: "Evaluador de riesgo", importancia: "Alta", urgencia: "Media", estado: "En análisis", responsable: "Equipo IA", fecha: "2026-06-28" },
  { id: "ticket-002", titulo: "Agregar campo 'Banco emisor' en formulario", tipo: "Solicitud de nuevos campos", moduloAfectado: "Propuestas", importancia: "Media", urgencia: "Baja", estado: "Aprobado", responsable: "Producto", fecha: "2026-06-25" },
  { id: "ticket-003", titulo: "Actualizar criterios de descarte para SBLC", tipo: "Cambios en base de conocimiento", moduloAfectado: "Base de conocimiento", importancia: "Alta", urgencia: "Alta", estado: "En desarrollo", responsable: "Compliance", fecha: "2026-06-20" },
  { id: "ticket-004", titulo: "Error al cargar documentos PDF grandes", tipo: "Error", moduloAfectado: "Documentos", importancia: "Media", urgencia: "Media", estado: "Nuevo", responsable: "Desarrollo", fecha: "2026-07-01" },
  { id: "ticket-005", titulo: "Ajustar peso del score documental en ranking", tipo: "Ajustes de scoring", moduloAfectado: "Ranking", importancia: "Alta", urgencia: "Media", estado: "En análisis", responsable: "Fernando G.", fecha: "2026-06-30" },
  { id: "ticket-006", titulo: "Mejorar filtros en listado de propuestas", tipo: "Mejora", moduloAfectado: "Propuestas", importancia: "Baja", urgencia: "Baja", estado: "Resuelto", responsable: "Desarrollo", fecha: "2026-06-15" },
  { id: "ticket-007", titulo: "Motor de briefing genera textos demasiado largos", tipo: "Problema de IA", moduloAfectado: "IA", importancia: "Media", urgencia: "Baja", estado: "Pausado", responsable: "Equipo IA", fecha: "2026-06-22" },
];

export const knowledgeItems: KnowledgeItem[] = [
  { id: "kb-001", titulo: "Historia y trayectoria de GAWER", categoria: "Institucional", estado: "validado", responsable: "Fernando G.", ultimaActualizacion: "2026-01-15" },
  { id: "kb-002", titulo: "Reglas comerciales", categoria: "Comercial", estado: "validado", responsable: "Fernando G.", ultimaActualizacion: "2026-03-10" },
  { id: "kb-003", titulo: "Criterios de descarte", categoria: "Operaciones", estado: "validado", responsable: "Compliance", ultimaActualizacion: "2026-05-20" },
  { id: "kb-004", titulo: "Documentos requeridos por área", categoria: "Operaciones", estado: "en revisión", responsable: "Compliance", ultimaActualizacion: "2026-06-28" },
  { id: "kb-005", titulo: "Glosario de instrumentos financieros", categoria: "Referencia", estado: "validado", responsable: "Legal", ultimaActualizacion: "2026-02-01" },
  { id: "kb-006", titulo: "Casos exitosos", categoria: "Referencia", estado: "validado", responsable: "Fernando G.", ultimaActualizacion: "2026-04-15" },
  { id: "kb-007", titulo: "Casos rechazados", categoria: "Referencia", estado: "en revisión", responsable: "Compliance", ultimaActualizacion: "2026-06-25" },
  { id: "kb-008", titulo: "Jurisdicciones y riesgos", categoria: "Compliance", estado: "validado", responsable: "Legal", ultimaActualizacion: "2026-05-01" },
  { id: "kb-009", titulo: "Procedimientos internos", categoria: "Operaciones", estado: "borrador", responsable: "Operaciones", ultimaActualizacion: "2026-06-30" },
];

export const reportData = {
  propuestasPorArea: [
    { area: "Monetización BG", count: 14 },
    { area: "Venta de oro", count: 11 },
    { area: "SBLC / Garantías", count: 9 },
    { area: "Paymaster", count: 6 },
    { area: "Crypto OTC", count: 7 },
  ],
  motivosDescarte: [
    { motivo: "Sin mandato verificable", count: 12 },
    { motivo: "Documentación insuficiente", count: 8 },
    { motivo: "Riesgo crítico detectado", count: 5 },
    { motivo: "Fuera de áreas activas", count: 3 },
  ],
  scorePromedio: 58,
  riesgosDetectados: { bajo: 8, medio: 18, alto: 14, critico: 7 },
  tiempoAhorradoEstimado: "142 horas",
  oportunidadesPorEstado: [
    { estado: "Revisión ejecutiva", count: 4 },
    { estado: "Solicitud de info", count: 8 },
    { estado: "Validación documental", count: 3 },
    { estado: "Negociación", count: 2 },
    { estado: "Descartado", count: 28 },
    { estado: "Ganado", count: 2 },
  ],
};

export function getScoreCategory(score: number): string {
  if (score >= 85) return "Oportunidad prioritaria";
  if (score >= 70) return "Oportunidad interesante";
  if (score >= 50) return "Requiere más información";
  if (score >= 30) return "Débil";
  return "Descartar sugerido";
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
