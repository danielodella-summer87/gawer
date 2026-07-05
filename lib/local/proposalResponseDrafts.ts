// Persistencia local de desarrollo. No usar como almacenamiento productivo.
//
// Borradores de respuesta al proponente — 100% plantillas determinísticas, NO es IA real.
// Ningún texto se envía: son borradores para copiar y enviar manualmente (email/WhatsApp)
// desde fuera del sistema. Tono validado por Fernando: cordial, profesional, claro e
// instructivo, sin generar expectativas que GAWER no pueda cumplir.

import type { LocalProposal } from "./proposalsStore";
import { generateExecutiveBriefing } from "./executiveBriefing";

export type ResponseDraftType =
  | "solicitud_cis"
  | "solicitud_documentacion_especifica"
  | "solicitud_acceso_mandato"
  | "solicitud_aclaracion_operacion"
  | "aviso_revision_preliminar"
  | "no_avance_informacion_insuficiente"
  | "no_avance_alerta_critica"
  | "invitacion_siguiente_paso";

export interface ProposalResponseDraft {
  id: string;
  type: ResponseDraftType;
  title: string;
  recommended: boolean;
  subject: string;
  body: string;
  reason: string;
  tone: string;
  missingItems: string[];
  nextInternalAction: string;
}

const TONE = "Cordial, profesional, claro e instructivo — sin generar expectativas que GAWER no pueda cumplir.";

function firma(nombre: string): string {
  return `Estimado/a ${nombre || "proponente"}:`;
}

function cierre(): string {
  return "Saludos,\nEquipo GAWER";
}

export function generateProposalResponseDrafts(proposal: LocalProposal): ProposalResponseDraft[] {
  const { input } = proposal;
  const checklist = proposal.documentChecklist ?? [];
  const briefing = generateExecutiveBriefing(proposal);
  const nombre = input.nombreCompleto || "proponente";

  const cisItem = checklist.find((i) => i.id === "cis");
  const cisPendiente = !cisItem || cisItem.estado === "Pendiente";
  const accesoConfirmado = input.accesoDirecto === "Sí";
  const mandatoOk = input.mandato === "Sí";
  const accesoORepresentacion = accesoConfirmado || mandatoOk;

  const documentosEspecificosFaltantes = checklist
    .filter((i) => i.id !== "cis" && i.requerido && i.estado === "Pendiente")
    .map((i) => i.nombre);

  const datosEsencialesFaltantes: string[] = [];
  if (!input.descripcionOperacion?.trim()) datosEsencialesFaltantes.push("Descripción de la operación");
  if (!input.montoEstimado) datosEsencialesFaltantes.push("Monto estimado");
  if (!input.jurisdiccionPrincipal?.trim()) datosEsencialesFaltantes.push("Jurisdicción principal");

  // --- A. Solicitud de CIS ---
  const draftCis: ProposalResponseDraft = {
    id: "solicitud_cis",
    type: "solicitud_cis",
    title: "Solicitud de CIS",
    recommended: false,
    subject: "Información necesaria para evaluación preliminar de su propuesta",
    body: [
      firma(nombre),
      "",
      "Gracias por compartir su propuesta con GAWER.",
      "",
      "Para poder iniciar una evaluación preliminar, necesitamos contar con la Hoja de Información " +
        "Corporativa (CIS / Corporate Information Sheet) del proponente o de la entidad titular de la operación.",
      "",
      "Este documento es necesario para realizar una primera revisión de debida diligencia y verificar " +
        "si la operación reúne las condiciones mínimas para avanzar.",
      "",
      "El envío de esta información no implica aceptación, aprobación ni compromiso comercial por parte " +
        "de GAWER. Toda propuesta queda sujeta a revisión del equipo.",
      "",
      "Quedamos atentos a la documentación solicitada.",
      "",
      cierre(),
    ].join("\n"),
    reason: "El CIS / Hoja de Información Corporativa aún no fue recibido.",
    tone: TONE,
    missingItems: ["CIS / Corporate Information Sheet / Hoja de Información Corporativa"],
    nextInternalAction: "Esperar el CIS y actualizar el checklist documental al recibirlo.",
  };

  // --- B. Solicitud de documentación específica ---
  const draftDocEspecifica: ProposalResponseDraft = {
    id: "solicitud_documentacion_especifica",
    type: "solicitud_documentacion_especifica",
    title: "Solicitud de documentación específica",
    recommended: false,
    subject: "Documentación adicional necesaria para continuar la evaluación",
    body: [
      firma(nombre),
      "",
      "Gracias por el material enviado hasta el momento.",
      "",
      "Para continuar con la evaluación de su propuesta, según el tipo de operación informado, necesitamos " +
        "recibir además la siguiente documentación:",
      "",
      ...(documentosEspecificosFaltantes.length > 0
        ? documentosEspecificosFaltantes.map((d) => `- ${d}`)
        : ["- Documentación específica correspondiente al tipo de operación."]),
      "",
      "Esta documentación nos permite avanzar en la debida diligencia y evaluar de forma objetiva la " +
        "capacidad jurídica, financiera y operativa de la operación propuesta.",
      "",
      "El envío de esta información no implica aceptación, aprobación ni compromiso comercial por parte " +
        "de GAWER. Toda propuesta queda sujeta a revisión del equipo.",
      "",
      "Quedamos atentos a la documentación solicitada.",
      "",
      cierre(),
    ].join("\n"),
    reason: "Faltan documentos específicos requeridos para el tipo de operación informado.",
    tone: TONE,
    missingItems: documentosEspecificosFaltantes,
    nextInternalAction: "Actualizar el checklist documental a medida que se reciba cada documento.",
  };

  // --- C. Solicitud de acceso al principal / mandato ---
  const draftAcceso: ProposalResponseDraft = {
    id: "solicitud_acceso_mandato",
    type: "solicitud_acceso_mandato",
    title: "Solicitud de acceso al principal / mandato",
    recommended: false,
    subject: "Aclaración sobre representación y acceso al titular de la operación",
    body: [
      firma(nombre),
      "",
      "Gracias por presentar su propuesta a GAWER.",
      "",
      "Para continuar con la evaluación, necesitamos confirmar la relación entre usted y el titular de la " +
        "operación. Le pedimos que nos indique si cuenta con acceso directo al titular principal o, en su " +
        "defecto, que nos envíe el mandato o autorización de representación correspondiente.",
      "",
      "Esta confirmación es una condición necesaria en todas las propuestas que evalúa GAWER, dado que la " +
        "principal causa de descarte es la intermediación sin relación directa con el titular del negocio.",
      "",
      "El envío de esta información no implica aceptación, aprobación ni compromiso comercial por parte " +
        "de GAWER. Toda propuesta queda sujeta a revisión del equipo.",
      "",
      "Quedamos atentos a su respuesta.",
      "",
      cierre(),
    ].join("\n"),
    reason: "No hay acceso directo confirmado al titular ni mandato o autorización acreditada.",
    tone: TONE,
    missingItems: ["Acceso directo al titular o mandato/autorización de representación"],
    nextInternalAction: "Validar la respuesta y actualizar el campo de acceso directo / mandato.",
  };

  // --- D. Solicitud de aclaración de operación ---
  const draftAclaracion: ProposalResponseDraft = {
    id: "solicitud_aclaracion_operacion",
    type: "solicitud_aclaracion_operacion",
    title: "Solicitud de aclaración de operación",
    recommended: false,
    subject: "Información adicional sobre la operación propuesta",
    body: [
      firma(nombre),
      "",
      "Gracias por su propuesta.",
      "",
      "Para completar la evaluación preliminar, necesitamos que nos amplíe la siguiente información sobre " +
        "la operación:",
      "",
      ...(datosEsencialesFaltantes.length > 0
        ? datosEsencialesFaltantes.map((d) => `- ${d}`)
        : ["- Datos adicionales sobre la operación propuesta."]),
      "",
      "Esta información nos permite entender con claridad el alcance de la operación antes de continuar " +
        "con los siguientes pasos.",
      "",
      "El envío de esta información no implica aceptación, aprobación ni compromiso comercial por parte " +
        "de GAWER. Toda propuesta queda sujeta a revisión del equipo.",
      "",
      "Quedamos atentos a su respuesta.",
      "",
      cierre(),
    ].join("\n"),
    reason: "Faltan datos esenciales para caracterizar la operación propuesta.",
    tone: TONE,
    missingItems: datosEsencialesFaltantes,
    nextInternalAction: "Completar los campos de la operación al recibir la aclaración.",
  };

  // --- E. Aviso de revisión preliminar ---
  const draftAvisoRevision: ProposalResponseDraft = {
    id: "aviso_revision_preliminar",
    type: "aviso_revision_preliminar",
    title: "Aviso de revisión preliminar",
    recommended: false,
    subject: "Su propuesta se encuentra en evaluación",
    body: [
      firma(nombre),
      "",
      "Gracias por su propuesta y por la documentación compartida hasta el momento.",
      "",
      "Le confirmamos que su propuesta se encuentra en proceso de evaluación preliminar por parte del " +
        "equipo comercial de GAWER.",
      "",
      "Nos pondremos en contacto a la brevedad en caso de necesitar información adicional, o para " +
        "informarle los próximos pasos.",
      "",
      "Esta comunicación no implica aceptación, aprobación ni compromiso comercial por parte de GAWER. " +
        "Toda propuesta queda sujeta a revisión del equipo.",
      "",
      "Saludos,",
      "Equipo GAWER",
    ].join("\n"),
    reason: "La propuesta está en análisis y aún no reúne todas las condiciones para avanzar o descartarse.",
    tone: TONE,
    missingItems: [],
    nextInternalAction: "Continuar el seguimiento comercial y completar la documentación pendiente.",
  };

  // --- F. No avance por información insuficiente ---
  const draftNoAvanceInfo: ProposalResponseDraft = {
    id: "no_avance_informacion_insuficiente",
    type: "no_avance_informacion_insuficiente",
    title: "No avance por información insuficiente",
    recommended: false,
    subject: "Resultado de evaluación preliminar",
    body: [
      firma(nombre),
      "",
      "Gracias por presentar su propuesta a GAWER.",
      "",
      "Luego de una revisión preliminar, no contamos con la información y documentación mínimas necesarias " +
        "para continuar con la evaluación de esta operación en esta instancia.",
      "",
      "Quedamos a disposición para reconsiderar la propuesta en caso de contar en el futuro con la " +
        "documentación y evidencias objetivas necesarias.",
      "",
      "Esta comunicación no constituye una evaluación legal, financiera ni documental definitiva, sino una " +
        "decisión preliminar basada en los criterios internos de GAWER.",
      "",
      cierre(),
    ].join("\n"),
    reason: "No se reúnen los requisitos mínimos de información o documentación, sin alerta crítica asociada.",
    tone: TONE,
    missingItems: briefing.missingInformation,
    nextInternalAction: "Registrar el descarte en el checklist y en el estado comercial.",
  };

  // --- G. No avance por alerta crítica ---
  const draftNoAvanceCritico: ProposalResponseDraft = {
    id: "no_avance_alerta_critica",
    type: "no_avance_alerta_critica",
    title: "No avance por alerta crítica",
    recommended: false,
    subject: "Resultado de evaluación preliminar",
    body: [
      firma(nombre),
      "",
      "Gracias por presentar su propuesta a GAWER.",
      "",
      "Luego de una revisión preliminar, identificamos que la operación informada se encuentra dentro de " +
        "una categoría que GAWER no considera viable para avanzar.",
      "",
      "Por este motivo, no continuaremos con el análisis de esta propuesta en esta instancia.",
      "",
      "Esta comunicación no constituye una evaluación legal, financiera ni documental definitiva, sino una " +
        "decisión preliminar basada en los criterios internos de GAWER.",
      "",
      cierre(),
    ].join("\n"),
    reason: "La operación involucra un instrumento o condición marcada como regla crítica interna de GAWER.",
    tone: TONE,
    missingItems: [],
    nextInternalAction: "Registrar el descarte. No requiere más contacto salvo excepción validada por Fernando.",
  };

  // --- H. Invitación a siguiente paso ---
  const draftInvitacion: ProposalResponseDraft = {
    id: "invitacion_siguiente_paso",
    type: "invitacion_siguiente_paso",
    title: "Invitación a siguiente paso",
    recommended: false,
    subject: "Próximos pasos para su propuesta",
    body: [
      firma(nombre),
      "",
      "Gracias por la documentación e información compartida.",
      "",
      "Su propuesta superó la revisión preliminar y será elevada al equipo directivo de GAWER para su " +
        "revisión ejecutiva.",
      "",
      "Nos pondremos en contacto a la brevedad para coordinar los siguientes pasos.",
      "",
      "Esta comunicación no implica aceptación, aprobación ni compromiso comercial definitivo por parte de " +
        "GAWER. Toda propuesta queda sujeta a revisión ejecutiva final del equipo.",
      "",
      cierre(),
    ].join("\n"),
    reason: "La propuesta reúne los requisitos mínimos y está lista para revisión ejecutiva.",
    tone: TONE,
    missingItems: [],
    nextInternalAction: "Coordinar la revisión ejecutiva con Fernando/Liliana.",
  };

  const drafts = [
    draftCis,
    draftDocEspecifica,
    draftAcceso,
    draftAclaracion,
    draftAvisoRevision,
    draftNoAvanceInfo,
    draftNoAvanceCritico,
    draftInvitacion,
  ];

  // --- Cascada de recomendación (determinística, reutiliza el briefing ejecutivo) ---
  let recommendedId: ResponseDraftType;
  if (input.mtnHsbcLtn === "Sí") {
    recommendedId = "no_avance_alerta_critica";
  } else if (briefing.readinessLevel === "No lista") {
    if (cisPendiente) recommendedId = "solicitud_cis";
    else if (!accesoORepresentacion) recommendedId = "solicitud_acceso_mandato";
    else recommendedId = "no_avance_informacion_insuficiente";
  } else if (briefing.readinessLevel === "En preparación") {
    if (cisPendiente) recommendedId = "solicitud_cis";
    else if (!accesoConfirmado && !mandatoOk) recommendedId = "solicitud_acceso_mandato";
    else if (documentosEspecificosFaltantes.length > 0) recommendedId = "solicitud_documentacion_especifica";
    else if (datosEsencialesFaltantes.length > 0) recommendedId = "solicitud_aclaracion_operacion";
    else recommendedId = "aviso_revision_preliminar";
  } else {
    recommendedId = "invitacion_siguiente_paso";
  }

  return drafts.map((d) => ({ ...d, recommended: d.id === recommendedId }));
}
