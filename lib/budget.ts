import { transactions } from "@/lib/data";

/**
 * Lógica y tipos del presupuesto manual con alertas configurables.
 *
 * TODO(producción): hoy todo vive en localStorage del navegador. Para que el
 * presupuesto y las alertas sean consistentes entre dispositivos hay que migrar
 * a Supabase (tabla budgets + alert_thresholds por usuario).
 */

export const BUDGET_KEY = "neto_budget";
export const THRESHOLDS_KEY = "neto_alert_thresholds";
export const STATE_KEY = "neto_budget_state";
export const ALERT_KEY = "neto_budget_alert";
export const BUDGET_EVENT = "neto-budget-update";

export const THRESHOLD_LEVELS = [20, 50, 80, 100] as const;
export type Threshold = (typeof THRESHOLD_LEVELS)[number];

export interface CategoryBudget {
  name: string;
  amount: number;
}
export interface Budget {
  monthly: number;
  categories: CategoryBudget[];
}
export type Thresholds = Record<string, boolean>;

export interface BudgetState {
  monthly: number;
  spent: number;
  pct: number;
  ts: number;
}
export interface BudgetAlert {
  level: "ok" | "warn" | "over";
  pct: number;
}

/** Llave del mes actual para deduplicar notificaciones (ej: 2026-06). */
export function monthKey(d = new Date()): string {
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`;
}

export const NOTIFIED_KEY = (month = monthKey()) => `neto_notified_thresholds_${month}`;

/** Color de la barra/indicador según el porcentaje gastado. */
export function colorForPct(pct: number): string {
  if (pct >= 100) return "#ef4444"; // rojo
  if (pct >= 80) return "#f97316";  // naranja
  if (pct >= 50) return "#f59e0b";  // amarillo
  return "#16a34a";                 // verde
}

/** Nivel para el badge del sidebar. */
export function alertLevelForPct(pct: number): BudgetAlert["level"] {
  if (pct >= 100) return "over";
  if (pct >= 80) return "warn";
  return "ok";
}

/** Gasto del mes a partir de los datos de ejemplo (suma de cargos). */
export function demoSpent(): number {
  const mayo = transactions.mayo ?? [];
  return mayo
    .filter((t) => t.amount < 0)
    .reduce((sum, t) => sum + Math.abs(t.amount), 0);
}

export function formatMXN(n: number): string {
  return "$" + Math.round(n).toLocaleString("es-MX");
}

/* ── localStorage helpers (client-only, todo guardado) ── */

export function loadBudget(): Budget | null {
  try {
    const raw = localStorage.getItem(BUDGET_KEY);
    if (!raw) return null;
    const b = JSON.parse(raw) as Budget;
    if (typeof b.monthly !== "number") return null;
    return { monthly: b.monthly, categories: Array.isArray(b.categories) ? b.categories : [] };
  } catch {
    return null;
  }
}

export function saveBudget(b: Budget) {
  try { localStorage.setItem(BUDGET_KEY, JSON.stringify(b)); } catch {}
}

export function loadThresholds(): Thresholds {
  try {
    const raw = localStorage.getItem(THRESHOLDS_KEY);
    if (raw) return JSON.parse(raw) as Thresholds;
  } catch {}
  // Por defecto: 80% y 100% activados (los más útiles).
  return { "20": false, "50": false, "80": true, "100": true };
}

export function saveThresholds(t: Thresholds) {
  try { localStorage.setItem(THRESHOLDS_KEY, JSON.stringify(t)); } catch {}
}

/**
 * Publica el estado del presupuesto para que el widget del chat y el badge del
 * sidebar lo lean, y dispara el evento de actualización.
 */
export function publishBudgetState(monthly: number, spent: number) {
  const pct = monthly > 0 ? (spent / monthly) * 100 : 0;
  const state: BudgetState = { monthly, spent, pct, ts: Date.now() };
  const alert: BudgetAlert = { level: alertLevelForPct(pct), pct };
  try {
    localStorage.setItem(STATE_KEY, JSON.stringify(state));
    localStorage.setItem(ALERT_KEY, JSON.stringify(alert));
    window.dispatchEvent(new Event(BUDGET_EVENT));
  } catch {}
  return { state, alert };
}

export function loadBudgetState(): BudgetState | null {
  try {
    const raw = localStorage.getItem(STATE_KEY);
    return raw ? (JSON.parse(raw) as BudgetState) : null;
  } catch {
    return null;
  }
}

export function loadBudgetAlert(): BudgetAlert | null {
  try {
    const raw = localStorage.getItem(ALERT_KEY);
    return raw ? (JSON.parse(raw) as BudgetAlert) : null;
  } catch {
    return null;
  }
}
