// ─────────────────────────────────────────────────────────────────────────────
// Declaraciones SAT — cálculo PRELIMINAR de declaraciones fiscales.
//
// IMPORTANTE: Neto NUNCA presenta declaraciones ante el SAT ni usa la e.firma del
// usuario. Esto solo PREPARA un borrador de cálculo para revisión del usuario o su
// contador. No constituye asesoría fiscal.
//
// Por ahora usa datos demo realistas (igual que el fallback de las otras páginas).
// TODO(fase posterior): alimentar `movimientos` desde los CFDIs / Gmail / Sheets
// reales del usuario en lugar de los datasets demo de este archivo.
// ─────────────────────────────────────────────────────────────────────────────

export type TipoContribuyente = "fisica" | "fisica_actividad" | "moral";
export type TipoDeclaracion = "mensual" | "anual";
export type FuenteDato = "Gmail" | "CFDI" | "Sheets";

export interface Movimiento {
  fecha: string;
  concepto: string;
  monto: number; // subtotal sin IVA
  iva: number;   // IVA del movimiento (0 si no aplica)
  clase: "ingreso" | "deduccion";
  fuente: FuenteDato;
  /** true = deducción personal (solo afecta ISR anual de persona física, no el IVA). */
  personal?: boolean;
}

export interface ResultadoDeclaracion {
  regimenLabel: string;
  periodoLabel: string;
  tipoContribuyente: TipoContribuyente;
  tipoDeclaracion: TipoDeclaracion;
  ingresosAcumulados: number;
  deduccionesAutorizadas: number;
  deduccionesPersonales: number;
  deduccionesTotal: number;
  baseGravable: number;
  isrCausado: number;
  retenciones: number;
  pagosProvisionales: number;
  isrResultado: number; // a cargo si > 0, a favor si < 0
  ivaAplica: boolean;   // el IVA se declara mensual; en la anual no aplica
  ivaTrasladado: number;
  ivaAcreditable: number;
  ivaResultado: number; // a cargo si > 0, a favor si < 0
  totalResultado: number; // ISR + IVA del periodo; a cargo si > 0
  movimientos: Movimiento[];
}

/** Disclaimer legal. Fuente única: se muestra en pantalla y se embebe en el PDF. */
export const DISCLAIMER_FISCAL =
  "Este es un cálculo preliminar para tu revisión. No constituye asesoría fiscal ni sustituye a un contador. Verifica con un profesional antes de presentar ante el SAT.";

export const TIPO_CONTRIBUYENTE_LABEL: Record<TipoContribuyente, string> = {
  fisica: "Persona Física",
  fisica_actividad: "Física con Actividad Empresarial",
  moral: "Persona Moral",
};

export const IVA_TASA = 0.16;

// Tarifa ISR (LISR art. 96 mensual / art. 152 anual). Valores vigentes usados como
// referencia para el cálculo demo: límite inferior, cuota fija y % sobre excedente.
type Tramo = { li: number; cuota: number; tasa: number };

const TARIFA_MENSUAL: Tramo[] = [
  { li: 0.01, cuota: 0, tasa: 0.0192 },
  { li: 746.05, cuota: 14.32, tasa: 0.064 },
  { li: 6332.06, cuota: 371.83, tasa: 0.1088 },
  { li: 11128.02, cuota: 893.63, tasa: 0.16 },
  { li: 12935.83, cuota: 1182.88, tasa: 0.1792 },
  { li: 15487.72, cuota: 1640.18, tasa: 0.2136 },
  { li: 31236.5, cuota: 5004.12, tasa: 0.2352 },
  { li: 49233.01, cuota: 9236.89, tasa: 0.3 },
  { li: 93993.91, cuota: 22665.17, tasa: 0.32 },
  { li: 125325.21, cuota: 32691.18, tasa: 0.34 },
  { li: 375975.62, cuota: 117912.32, tasa: 0.35 },
];

const TARIFA_ANUAL: Tramo[] = [
  { li: 0.01, cuota: 0, tasa: 0.0192 },
  { li: 8952.5, cuota: 171.88, tasa: 0.064 },
  { li: 75984.56, cuota: 4461.94, tasa: 0.1088 },
  { li: 133536.08, cuota: 10723.55, tasa: 0.16 },
  { li: 155229.81, cuota: 14194.54, tasa: 0.1792 },
  { li: 185852.58, cuota: 19682.13, tasa: 0.2136 },
  { li: 374837.89, cuota: 60049.4, tasa: 0.2352 },
  { li: 590796.0, cuota: 110842.74, tasa: 0.3 },
  { li: 1127926.85, cuota: 271981.99, tasa: 0.32 },
  { li: 1503902.47, cuota: 392294.17, tasa: 0.34 },
  { li: 3759756.14, cuota: 1414947.85, tasa: 0.35 },
];

const ISR_MORAL_TASA = 0.3;

function isrPorTarifa(base: number, tabla: Tramo[]): number {
  if (base <= 0) return 0;
  let tramo = tabla[0];
  for (const t of tabla) {
    if (base >= t.li) tramo = t;
    else break;
  }
  return tramo.cuota + (base - tramo.li) * tramo.tasa;
}

// ── Datasets demo por tipo de contribuyente ──

interface RegimenConfig {
  regimenLabel: string;
  retISR: number;          // tasa de retención de ISR aplicada por los clientes
  pagosProvAnual: number;  // pagos provisionales ya enterados (para la anual)
  pagosProvMensual: number;
  mensual: Movimiento[];
  anual: Movimiento[];
}

const CONFIG: Record<TipoContribuyente, RegimenConfig> = {
  fisica: {
    regimenLabel: "Sueldos y honorarios (régimen general)",
    retISR: 0.1,
    pagosProvAnual: 24000,
    pagosProvMensual: 0,
    mensual: [
      { fecha: "2025-03-05", concepto: "Honorarios médicos — Clínica Santa Fe", monto: 38000, iva: 6080, clase: "ingreso", fuente: "CFDI" },
      { fecha: "2025-03-18", concepto: "Consultoría — ACME S.A. de C.V.", monto: 22000, iva: 3520, clase: "ingreso", fuente: "CFDI" },
      { fecha: "2025-03-01", concepto: "Renta de consultorio", monto: 9000, iva: 1440, clase: "deduccion", fuente: "CFDI" },
      { fecha: "2025-03-12", concepto: "Papelería y material de oficina", monto: 2500, iva: 400, clase: "deduccion", fuente: "Gmail" },
    ],
    anual: [
      { fecha: "2024", concepto: "Honorarios acumulados (Ene–Dic 2024)", monto: 720000, iva: 0, clase: "ingreso", fuente: "CFDI" },
      { fecha: "2024", concepto: "Renta de consultorio (anual)", monto: 108000, iva: 0, clase: "deduccion", fuente: "CFDI" },
      { fecha: "2024", concepto: "Gastos de operación (anual)", monto: 30000, iva: 0, clase: "deduccion", fuente: "CFDI" },
      { fecha: "2024", concepto: "Gastos médicos y hospitalarios", monto: 18000, iva: 0, clase: "deduccion", fuente: "CFDI", personal: true },
      { fecha: "2024", concepto: "Colegiatura (nivel profesional)", monto: 12000, iva: 0, clase: "deduccion", fuente: "CFDI", personal: true },
    ],
  },
  fisica_actividad: {
    regimenLabel: "Actividad empresarial y profesional",
    retISR: 0,
    pagosProvAnual: 120000,
    pagosProvMensual: 0,
    mensual: [
      { fecha: "2025-03-08", concepto: "Ventas — mostrador y e-commerce", monto: 72000, iva: 11520, clase: "ingreso", fuente: "CFDI" },
      { fecha: "2025-03-22", concepto: "Servicios a clientes", monto: 23000, iva: 3680, clase: "ingreso", fuente: "CFDI" },
      { fecha: "2025-03-03", concepto: "Compra de mercancía", monto: 31000, iva: 4960, clase: "deduccion", fuente: "CFDI" },
      { fecha: "2025-03-15", concepto: "Renta de local", monto: 8000, iva: 1280, clase: "deduccion", fuente: "CFDI" },
      { fecha: "2025-03-20", concepto: "Servicios (luz, internet)", monto: 2000, iva: 320, clase: "deduccion", fuente: "Gmail" },
    ],
    anual: [
      { fecha: "2024", concepto: "Ingresos acumulados por actividad (2024)", monto: 1140000, iva: 0, clase: "ingreso", fuente: "CFDI" },
      { fecha: "2024", concepto: "Costo de mercancía (anual)", monto: 372000, iva: 0, clase: "deduccion", fuente: "CFDI" },
      { fecha: "2024", concepto: "Renta de local (anual)", monto: 96000, iva: 0, clase: "deduccion", fuente: "CFDI" },
      { fecha: "2024", concepto: "Servicios y operación (anual)", monto: 24000, iva: 0, clase: "deduccion", fuente: "Sheets" },
    ],
  },
  moral: {
    regimenLabel: "Régimen general de ley (Personas Morales)",
    retISR: 0,
    pagosProvAnual: 1450000,
    pagosProvMensual: 0,
    mensual: [
      { fecha: "2025-03-31", concepto: "Ingresos por ventas (marzo)", monto: 1200000, iva: 192000, clase: "ingreso", fuente: "CFDI" },
      { fecha: "2025-03-28", concepto: "Compras y costo de ventas", monto: 620000, iva: 99200, clase: "deduccion", fuente: "CFDI" },
      { fecha: "2025-03-30", concepto: "Nómina y honorarios", monto: 120000, iva: 0, clase: "deduccion", fuente: "Sheets" },
      { fecha: "2025-03-25", concepto: "Gastos de operación", monto: 40000, iva: 6400, clase: "deduccion", fuente: "CFDI" },
    ],
    anual: [
      { fecha: "2024", concepto: "Ingresos acumulados del ejercicio (2024)", monto: 14400000, iva: 0, clase: "ingreso", fuente: "CFDI" },
      { fecha: "2024", concepto: "Costo de lo vendido (anual)", monto: 7440000, iva: 0, clase: "deduccion", fuente: "CFDI" },
      { fecha: "2024", concepto: "Nómina (anual)", monto: 1440000, iva: 0, clase: "deduccion", fuente: "Sheets" },
      { fecha: "2024", concepto: "Gastos de operación (anual)", monto: 480000, iva: 0, clase: "deduccion", fuente: "CFDI" },
    ],
  },
};

/** Periodos disponibles en el selector, según el tipo de declaración. */
export const PERIODOS: Record<TipoDeclaracion, string[]> = {
  mensual: ["Marzo 2025", "Febrero 2025", "Enero 2025"],
  anual: ["Ejercicio 2024", "Ejercicio 2023"],
};

/**
 * Calcula una declaración preliminar a partir de los datos demo del régimen.
 * El `periodoLabel` es solo informativo (los datos demo son fijos); cuando se
 * conecten los CFDIs reales, el periodo filtrará los movimientos.
 */
export function calcularDeclaracion(
  tipo: TipoContribuyente,
  decl: TipoDeclaracion,
  periodoLabel: string
): ResultadoDeclaracion {
  const cfg = CONFIG[tipo];
  const movimientos = decl === "mensual" ? cfg.mensual : cfg.anual;

  const ingresos = movimientos.filter(m => m.clase === "ingreso");
  const deducciones = movimientos.filter(m => m.clase === "deduccion");

  const ingresosAcumulados = ingresos.reduce((s, m) => s + m.monto, 0);
  const ivaTrasladado = ingresos.reduce((s, m) => s + m.iva, 0);

  const deduccionesAutorizadas = deducciones.filter(m => !m.personal).reduce((s, m) => s + m.monto, 0);
  const deduccionesPersonales = deducciones.filter(m => m.personal).reduce((s, m) => s + m.monto, 0);
  const ivaAcreditable = deducciones.filter(m => !m.personal).reduce((s, m) => s + m.iva, 0);
  const deduccionesTotal = deduccionesAutorizadas + deduccionesPersonales;

  const ivaAplica = decl === "mensual";

  let baseGravable: number;
  let isrCausado: number;
  if (tipo === "moral") {
    // Utilidad fiscal = ingresos − deducciones autorizadas (sin deducciones personales).
    baseGravable = Math.max(0, ingresosAcumulados - deduccionesAutorizadas);
    isrCausado = baseGravable * ISR_MORAL_TASA;
  } else {
    baseGravable = Math.max(0, ingresosAcumulados - deduccionesTotal);
    isrCausado = isrPorTarifa(baseGravable, decl === "mensual" ? TARIFA_MENSUAL : TARIFA_ANUAL);
  }

  const retenciones = cfg.retISR * ingresosAcumulados;
  const pagosProvisionales = decl === "anual" ? cfg.pagosProvAnual : cfg.pagosProvMensual;
  const isrResultado = isrCausado - retenciones - pagosProvisionales;

  const ivaResultado = ivaAplica ? ivaTrasladado - ivaAcreditable : 0;
  const totalResultado = isrResultado + ivaResultado;

  return {
    regimenLabel: cfg.regimenLabel,
    periodoLabel,
    tipoContribuyente: tipo,
    tipoDeclaracion: decl,
    ingresosAcumulados,
    deduccionesAutorizadas,
    deduccionesPersonales,
    deduccionesTotal,
    baseGravable,
    isrCausado,
    retenciones,
    pagosProvisionales,
    isrResultado,
    ivaAplica,
    ivaTrasladado,
    ivaAcreditable,
    ivaResultado,
    totalResultado,
    movimientos,
  };
}

/** Formatea un monto en pesos mexicanos con 2 decimales. */
export function fmtMXN(n: number): string {
  return "$" + n.toLocaleString("es-MX", { minimumFractionDigits: 2, maximumFractionDigits: 2 });
}
