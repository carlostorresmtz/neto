export type PlanId = "free" | "pro" | "business";

export interface Plan {
  id: PlanId;
  name: string;
  monthlyPrice: string;
  annualPrice: string;
  period: string;
  /** Color del nombre del plan en la tarjeta de precios (estilo landing). */
  nameColor: string;
  bg: string;
  border: string;
  features: string[];
  cta: string;
  ctaAccent: boolean;
  popular: boolean;
  /**
   * Aclaración opcional del precio (p. ej. "por cada 10 usuarios"). Se antepone
   * al texto de facturación en la landing y el modal. Si no se define, no se
   * muestra nada extra.
   */
  seatNote?: string;
}

/**
 * Límite de preguntas al chat para el plan Free.
 *
 * Prototipo sin DB: hoy solo alimenta el estado del cliente (PlanContext) para
 * validar la experiencia. El enforcement real sobre el envío del chat se
 * conectará en una fase posterior.
 */
export const FREE_QUESTION_LIMIT = 10;

/**
 * Fuente única de verdad de los planes. La usa tanto la landing
 * (components/landing/PricingSection.tsx) como el resto de la app, para que
 * precios y features no se desincronicen.
 */
export const PLANS: Plan[] = [
  {
    id: "free",
    name: "Gratis",
    monthlyPrice: "$0",
    annualPrice: "$0",
    period: "para siempre",
    nameColor: "#16A34A",
    bg: "#F8FAFC",
    border: "1px solid #E2E8F0",
    features: ["Historial de 3 meses", "10 preguntas/mes", "1 banco conectado"],
    cta: "Empezar gratis",
    ctaAccent: false,
    popular: false,
  },
  {
    id: "pro",
    name: "Pro",
    monthlyPrice: "$249",
    annualPrice: "$199",
    period: "MXN / mes",
    nameColor: "#1E40AF",
    bg: "#EFF6FF",
    border: "1px solid #1E40AF",
    features: ["Historial ilimitado", "Todos los bancos soportados", "Alertas proactivas", "Conexión a Google Sheets"],
    cta: "Empezar Pro",
    ctaAccent: true,
    popular: true,
  },
  {
    id: "business",
    name: "Business",
    monthlyPrice: "$649",
    annualPrice: "$519",
    period: "MXN / mes",
    nameColor: "#64748B",
    bg: "#F8FAFC",
    border: "1px solid #E2E8F0",
    features: ["Múltiples usuarios", "Exportación CSV", "Soporte prioritario", "API access"],
    cta: "Contactar",
    ctaAccent: false,
    popular: false,
    seatNote: "por cada 10 usuarios",
  },
];
