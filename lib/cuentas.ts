// ─────────────────────────────────────────────────────────────────────────────
// Cuentas — estructura de datos para Estados de cuenta y las páginas por banco.
//
// REGLA DE ORO (confianza financiera): nunca mostrar un saldo / límite / fecha de
// corte dudoso como si fuera un hecho. Cada dato de encabezado lleva un `estado`:
//   - "ejemplo"   → dato demo (no proviene de los correos del usuario)
//   - "estimado"  → inferido de correos reales, pero NO confirmado con exactitud
// Los movimientos extraídos de notificaciones reales se consideran confirmados
// (sin marca). Solo los saldos/encabezados se marcan.
//
// Patrón de fallback igual que analisis/alertas/chat: sin ANTHROPIC_API_KEY o si
// la extracción falla, se devuelve DEMO_CUENTAS en 200 (nunca 500).
// ─────────────────────────────────────────────────────────────────────────────

import { bbvaTransactions, amexTransactions, nuTransactions } from "@/lib/data";
import type { Transaction } from "@/lib/types";

export type EstadoDato = "estimado" | "ejemplo";
export type CuentaId = "bbva" | "amex" | "nu";
export type SaldoColor = "good" | "danger" | "warn";

/** Un valor de encabezado con su nivel de confianza. */
export interface Dato {
  valor: string;
  estado: EstadoDato;
}

export interface MovimientoCuenta {
  fecha: string;
  nombre: string;
  categoria: string;
  monto: number;
}

export interface MovimientoConsolidado {
  fecha: string;
  desc: string;
  cuenta: string;
  categoria: string;
  fuente: "gmail" | "sheets";
  monto: number;
}

// ── Estructura "cruda" (lo que devuelve la IA o el demo, con valores planos) ──

interface CuentaDetalleRaw {
  id: CuentaId;
  nombre: string;
  tarjeta: string;
  saldoTexto: string;
  saldoColor: SaldoColor;
  stats: { label: string; valor: string }[];
  alerta?: { tipo: "danger" | "warn"; texto: string } | null;
  movimientos: MovimientoCuenta[];
}

interface CuentaResumenRaw {
  id: string;
  nombre: string;
  saldoTexto: string;
  estado: "good" | "danger" | "warn" | "info";
  badgeText: string;
  meta: string;
}

export interface CuentasRaw {
  resumen: CuentaResumenRaw[];
  cuentas: CuentaDetalleRaw[];
  movimientosConsolidados: MovimientoConsolidado[];
}

// ── Estructura procesada (cada dato de encabezado lleva su `estado`) ──

export interface CuentaDetalle {
  id: CuentaId;
  nombre: string;
  tarjeta: Dato;
  saldoTexto: Dato;
  saldoColor: SaldoColor;
  stats: { label: string; dato: Dato }[];
  alerta?: { tipo: "danger" | "warn"; texto: string; estado: EstadoDato } | null;
  movimientos: MovimientoCuenta[];
}

export interface CuentaResumen {
  id: string;
  nombre: string;
  saldo: Dato;
  estado: "good" | "danger" | "warn" | "info";
  badgeText: string;
  meta: string;
}

export interface CuentasData {
  origen: "real" | "demo";
  cuentasResumen: CuentaResumen[];
  movimientosConsolidados: MovimientoConsolidado[];
  detalle: CuentaDetalle[];
}

/**
 * Convierte la estructura cruda en la final, estampando el nivel de confianza:
 * demo → "ejemplo"; real → "estimado" (conservador: no afirmamos saldos exactos
 * que no podemos confirmar desde la metadata de los correos).
 */
export function construirCuentasData(raw: CuentasRaw, origen: "real" | "demo"): CuentasData {
  const estado: EstadoDato = origen === "demo" ? "ejemplo" : "estimado";
  const dato = (valor: string): Dato => ({ valor, estado });

  return {
    origen,
    cuentasResumen: raw.resumen.map(r => ({
      id: r.id,
      nombre: r.nombre,
      saldo: dato(r.saldoTexto),
      estado: r.estado,
      badgeText: r.badgeText,
      meta: r.meta,
    })),
    movimientosConsolidados: raw.movimientosConsolidados,
    detalle: raw.cuentas.map(c => ({
      id: c.id,
      nombre: c.nombre,
      tarjeta: dato(c.tarjeta),
      saldoTexto: dato(c.saldoTexto),
      saldoColor: c.saldoColor,
      stats: c.stats.map(s => ({ label: s.label, dato: dato(s.valor) })),
      alerta: c.alerta ? { ...c.alerta, estado } : null,
      movimientos: c.movimientos,
    })),
  };
}

// ── Datos demo (reutilizan lib/data.ts; reflejan el contenido actual de las páginas) ──

function aMov(txs: Transaction[]): MovimientoCuenta[] {
  return txs.map(t => ({ fecha: t.date, nombre: t.name, categoria: t.cat, monto: t.amount }));
}

const DEMO_RAW: CuentasRaw = {
  resumen: [
    { id: "bbva", nombre: "BBVA Débito", saldoTexto: "$23,740", estado: "good", badgeText: "Leído", meta: "Saldo disponible · Mayo 2025" },
    { id: "amex", nombre: "Amex Gold", saldoTexto: "$12,400", estado: "danger", badgeText: "Vence en 4 días", meta: "Saldo a pagar · Corte 15 mayo" },
    { id: "nu", nombre: "Nu Crédito", saldoTexto: "$6,240", estado: "danger", badgeText: "Pago mínimo", meta: "Saldo actual · Corte 20 mayo" },
    { id: "sheets", nombre: "Sheets — Presupuesto", saldoTexto: "$20,000", estado: "info", badgeText: "Sheets", meta: "Presupuesto mensual definido" },
  ],
  cuentas: [
    {
      id: "bbva",
      nombre: "BBVA Débito",
      tarjeta: "**** **** **** 4821",
      saldoTexto: "$23,740.50",
      saldoColor: "good",
      stats: [
        { label: "Actualizado", valor: "Hoy 8:32 am" },
        { label: "Corte", valor: "31 mayo 2025" },
        { label: "Movimientos", valor: "34 este mes" },
      ],
      alerta: null,
      movimientos: aMov(bbvaTransactions),
    },
    {
      id: "amex",
      nombre: "American Express Gold",
      tarjeta: "**** **** **** 9034",
      saldoTexto: "$12,400 por pagar",
      saldoColor: "danger",
      stats: [
        { label: "Fecha límite", valor: "31 mayo — 4 días" },
        { label: "Límite", valor: "$40,000" },
        { label: "Disponible", valor: "$27,600" },
      ],
      alerta: { tipo: "danger", texto: "Vence en 4 días. Pagar antes del 31 mayo evita $620 en mora." },
      movimientos: aMov(amexTransactions),
    },
    {
      id: "nu",
      nombre: "Nu Crédito",
      tarjeta: "**** **** **** 2210",
      saldoTexto: "$6,240 adeudo",
      saldoColor: "danger",
      stats: [
        { label: "Corte", valor: "20 mayo" },
        { label: "Pago mínimo", valor: "$460" },
        { label: "Pago total", valor: "$6,240" },
      ],
      alerta: { tipo: "warn", texto: "3 meses pagando mínimo = $800/mes en intereses. Pagar el total ahorra $9,600 al año." },
      movimientos: aMov(nuTransactions),
    },
  ],
  movimientosConsolidados: [
    { fecha: "26 may", desc: "Uber Eats", cuenta: "Amex Gold", categoria: "Restaurantes", fuente: "gmail", monto: -340 },
    { fecha: "25 may", desc: "OXXO San Pedro", cuenta: "BBVA", categoria: "Supermercado", fuente: "gmail", monto: -180 },
    { fecha: "24 may", desc: "Netflix", cuenta: "Nu", categoria: "Suscripción", fuente: "gmail", monto: -179 },
    { fecha: "23 may", desc: "PEMEX", cuenta: "BBVA", categoria: "Gasolina", fuente: "gmail", monto: -850 },
    { fecha: "20 may", desc: "Presupuesto mayo", cuenta: "Sheets", categoria: "Planificación", fuente: "sheets", monto: 20000 },
    { fecha: "20 may", desc: "Depósito nómina", cuenta: "BBVA Nómina", categoria: "Ingreso", fuente: "gmail", monto: 18640 },
    { fecha: "15 may", desc: "Adobe CC", cuenta: "Nu", categoria: "Suscripción", fuente: "gmail", monto: -289 },
  ],
};

/** Datos demo ya procesados (todo marcado como "ejemplo"). */
export const DEMO_CUENTAS: CuentasData = construirCuentasData(DEMO_RAW, "demo");

/** Para el endpoint: la estructura cruda demo (por si necesita el raw). */
export const DEMO_CUENTAS_RAW = DEMO_RAW;
