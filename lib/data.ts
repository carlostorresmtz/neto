import type { Transaction, Subscription, Alert, CategoryRule } from "./types";

export const categoryRules: Record<string, CategoryRule> = {
  "Restaurantes y delivery": { emoji: "🍽️", color: "#f56666" },
  Supermercado: { emoji: "🛒", color: "#f5c166" },
  Gasolina: { emoji: "⛽", color: "#66c4f5" },
  Suscripciones: { emoji: "📱", color: "#b8f566" },
  Transporte: { emoji: "🚗", color: "#7ed957" },
  "Ropa y moda": { emoji: "👔", color: "#afa9ec" },
  Entretenimiento: { emoji: "🎬", color: "#f5c166" },
  Salud: { emoji: "💊", color: "#66c4f5" },
  Ingreso: { emoji: "💰", color: "#b8f566" },
};

export const transactions: Record<string, Transaction[]> = {
  mayo: [
    { id: 1,  name: "Uber Eats",            date: "26 may", amount: -340,  account: "amex", cat: "Restaurantes y delivery" },
    { id: 2,  name: "OXXO San Pedro",        date: "25 may", amount: -180,  account: "bbva", cat: "Supermercado" },
    { id: 3,  name: "Netflix",               date: "24 may", amount: -179,  account: "nu",   cat: "Suscripciones" },
    { id: 4,  name: "PEMEX Constitución",    date: "23 may", amount: -850,  account: "bbva", cat: "Gasolina" },
    { id: 5,  name: "Walmart Monterrey",     date: "22 may", amount: -1240, account: "amex", cat: "Supermercado" },
    { id: 6,  name: "Depósito nómina",       date: "20 may", amount: 18640, account: "bbva", cat: "Ingreso" },
    { id: 7,  name: "DiDi Food",             date: "19 may", amount: -290,  account: "amex", cat: "Restaurantes y delivery" },
    { id: 8,  name: "Adobe CC",              date: "15 may", amount: -289,  account: "nu",   cat: "Suscripciones" },
    { id: 9,  name: "Liverpool San Agustín", date: "17 may", amount: -1900, account: "amex", cat: "Ropa y moda" },
    { id: 10, name: "Cinépolis VIP",         date: "14 may", amount: -480,  account: "amex", cat: "Entretenimiento" },
    { id: 11, name: "Restaurante Lampuga",   date: "10 may", amount: -1200, account: "amex", cat: "Restaurantes y delivery" },
    { id: 12, name: "ChatGPT Plus",          date: "7 may",  amount: -220,  account: "amex", cat: "Suscripciones" },
    { id: 13, name: "HBO Max",               date: "3 may",  amount: -159,  account: "amex", cat: "Suscripciones" },
    { id: 14, name: "Uber",                  date: "12 may", amount: -340,  account: "nu",   cat: "Transporte" },
    { id: 15, name: "Spotify",               date: "5 may",  amount: -99,   account: "nu",   cat: "Suscripciones" },
    { id: 16, name: "iCloud 200GB",          date: "9 may",  amount: -29,   account: "bbva", cat: "Suscripciones" },
    { id: 17, name: "PEMEX Garza Sada",      date: "12 may", amount: -760,  account: "bbva", cat: "Gasolina" },
    { id: 18, name: "Starbucks Santa Fe",    date: "8 may",  amount: -210,  account: "amex", cat: "Restaurantes y delivery" },
    { id: 19, name: "YouTube Premium",       date: "8 may",  amount: -119,  account: "bbva", cat: "Suscripciones" },
    { id: 20, name: "SmartFit San Pedro",    date: "1 may",  amount: -499,  account: "bbva", cat: "Salud" },
    { id: 21, name: "Depósito nómina",       date: "1 may",  amount: 18640, account: "bbva", cat: "Ingreso" },
    { id: 22, name: "Farmacias Guadalajara", date: "6 may",  amount: -340,  account: "bbva", cat: "Salud" },
    { id: 23, name: "Taxi aeropuerto",       date: "3 may",  amount: -280,  account: "amex", cat: "Transporte" },
    { id: 24, name: "Taco Inn Obispado",     date: "16 may", amount: -180,  account: "amex", cat: "Restaurantes y delivery" },
    { id: 25, name: "Soriana Cumbres",       date: "11 may", amount: -890,  account: "bbva", cat: "Supermercado" },
  ],
  abril: [
    { id: 30, name: "Uber Eats",          date: "28 abr", amount: -310,  account: "amex", cat: "Restaurantes y delivery" },
    { id: 31, name: "Walmart Valle",       date: "25 abr", amount: -1100, account: "bbva", cat: "Supermercado" },
    { id: 32, name: "Netflix",             date: "24 abr", amount: -179,  account: "nu",   cat: "Suscripciones" },
    { id: 33, name: "PEMEX Constitución",  date: "20 abr", amount: -740,  account: "bbva", cat: "Gasolina" },
    { id: 34, name: "Uber",               date: "18 abr", amount: -290,  account: "nu",   cat: "Transporte" },
    { id: 35, name: "Depósito nómina",    date: "15 abr", amount: 18640, account: "bbva", cat: "Ingreso" },
    { id: 36, name: "Spotify",            date: "5 abr",  amount: -99,   account: "nu",   cat: "Suscripciones" },
    { id: 37, name: "Restaurante El Tío", date: "12 abr", amount: -860,  account: "amex", cat: "Restaurantes y delivery" },
    { id: 38, name: "Depósito nómina",    date: "1 abr",  amount: 18640, account: "bbva", cat: "Ingreso" },
  ],
  marzo: [
    { id: 40, name: "Uber Eats",       date: "30 mar", amount: -290,  account: "amex", cat: "Restaurantes y delivery" },
    { id: 41, name: "PEMEX",           date: "25 mar", amount: -820,  account: "bbva", cat: "Gasolina" },
    { id: 42, name: "Netflix",         date: "24 mar", amount: -179,  account: "nu",   cat: "Suscripciones" },
    { id: 43, name: "Walmart",         date: "20 mar", amount: -950,  account: "bbva", cat: "Supermercado" },
    { id: 44, name: "Depósito nómina", date: "15 mar", amount: 18640, account: "bbva", cat: "Ingreso" },
    { id: 45, name: "Cinépolis",       date: "10 mar", amount: -440,  account: "amex", cat: "Entretenimiento" },
    { id: 46, name: "Depósito nómina", date: "1 mar",  amount: 18640, account: "bbva", cat: "Ingreso" },
  ],
};

export const subscriptions: Subscription[] = [
  { id: "adobe",   name: "Adobe Creative Cloud", amount: 289, nextDate: "15 jun · Nu Crédito",    account: "nu",   color: "#ff0000", bgColor: "#1f1212", borderColor: "#3d1a1a", initials: "Cc", warning: "⚠ el más caro" },
  { id: "chatgpt", name: "ChatGPT Plus",          amount: 220, nextDate: "18 jun · Amex Gold",     account: "amex", color: "#19c37d", bgColor: "#121f1a", borderColor: "#1a3d2e", initials: "Gp" },
  { id: "netflix", name: "Netflix",               amount: 179, nextDate: "1 jun · Nu Crédito",     account: "nu",   color: "#e50914", bgColor: "#1f1212", borderColor: "#3d1a1a", initials: "N" },
  { id: "hbo",     name: "HBO Max",               amount: 159, nextDate: "22 jun · Amex Gold",     account: "amex", color: "#b146e5", bgColor: "#1a121f", borderColor: "#2e1a3d", initials: "Hb" },
  { id: "youtube", name: "YouTube Premium",       amount: 119, nextDate: "8 jun · BBVA",           account: "bbva", color: "#ff0000", bgColor: "#1f1212", borderColor: "#3d1a1a", initials: "Yt" },
  { id: "spotify", name: "Spotify",               amount: 99,  nextDate: "5 jun · Nu Crédito",     account: "nu",   color: "#1db954", bgColor: "#121f14", borderColor: "#1a3d22", initials: "S" },
  { id: "icloud",  name: "iCloud 200GB",          amount: 29,  nextDate: "28 jun · BBVA",          account: "bbva", color: "#e8ece4", bgColor: "#1c1f1c", borderColor: "#2a2e2a", initials: "iC" },
];

export const alerts: Alert[] = [
  {
    id: "amex-vence",
    type: "danger",
    title: "Amex Gold vence en 4 días",
    desc: "$12,400 pendientes. Sin pago antes del 31 mayo generarás $620 en intereses.",
    date: "Gmail · Detectado hoy",
  },
  {
    id: "presupuesto",
    type: "warn",
    title: "Excediste tu presupuesto de Sheets en $3,450",
    desc: "Definiste $20,000/mes en tu hoja. Llevas $23,450 gastados en mayo.",
    date: "Sheets + Gmail · Detectado ayer",
  },
  {
    id: "saldo-minimo",
    type: "warn",
    title: "Saldo combinado en mínimo histórico",
    desc: "Saldo libre: $23,740 — el más bajo en 6 meses. Promedio histórico: $31,200.",
    date: "Gmail · Detectado hoy",
  },
  {
    id: "nu-minimo",
    type: "info",
    title: "3 meses pagando mínimo en Nu Crédito",
    desc: "Generando $800/mes en intereses innecesarios. Ya pagaste $2,400 extra sin bajar el capital.",
    date: "Gmail · 24 mayo",
  },
];

export const bbvaTransactions: Transaction[] = [
  { id: 101, name: "OXXO San Pedro",       date: "25 may", amount: -180,  account: "bbva", cat: "Supermercado" },
  { id: 102, name: "PEMEX Constitución",   date: "23 may", amount: -850,  account: "bbva", cat: "Gasolina" },
  { id: 103, name: "Depósito nómina",      date: "20 may", amount: 18640, account: "bbva", cat: "Ingreso" },
  { id: 104, name: "Walmart Valle",        date: "15 may", amount: -1480, account: "bbva", cat: "Supermercado" },
  { id: 105, name: "PEMEX Garza Sada",     date: "12 may", amount: -760,  account: "bbva", cat: "Gasolina" },
  { id: 106, name: "YouTube Premium",      date: "8 may",  amount: -119,  account: "bbva", cat: "Suscripciones" },
  { id: 107, name: "Depósito nómina",      date: "1 may",  amount: 18640, account: "bbva", cat: "Ingreso" },
];

export const amexTransactions: Transaction[] = [
  { id: 201, name: "Uber Eats",            date: "26 may", amount: -340,  account: "amex", cat: "Restaurantes y delivery" },
  { id: 202, name: "Walmart Monterrey",    date: "22 may", amount: -1240, account: "amex", cat: "Supermercado" },
  { id: 203, name: "Liverpool San Agustín",date: "17 may", amount: -1900, account: "amex", cat: "Ropa y moda" },
  { id: 204, name: "Cinépolis VIP",        date: "14 may", amount: -480,  account: "amex", cat: "Entretenimiento" },
  { id: 205, name: "Restaurante Lampuga",  date: "10 may", amount: -1200, account: "amex", cat: "Restaurantes y delivery" },
  { id: 206, name: "ChatGPT Plus",         date: "7 may",  amount: -220,  account: "amex", cat: "Suscripciones" },
];

export const nuTransactions: Transaction[] = [
  { id: 301, name: "Netflix",              date: "24 may", amount: -179, account: "nu", cat: "Suscripciones" },
  { id: 302, name: "Spotify",              date: "18 may", amount: -99,  account: "nu", cat: "Suscripciones" },
  { id: 303, name: "Adobe Creative Cloud", date: "15 may", amount: -289, account: "nu", cat: "Suscripciones" },
  { id: 304, name: "Uber",                 date: "12 may", amount: -340, account: "nu", cat: "Transporte" },
  { id: 305, name: "Pago mínimo recibido", date: "2 may",  amount: 460,  account: "nu", cat: "Ingreso" },
  { id: 306, name: "Intereses generados",  date: "1 may",  amount: -798, account: "nu", cat: "Salud" },
];

export function fmtMXN(n: number): string {
  const abs = Math.abs(n);
  return "$" + abs.toLocaleString("es-MX");
}

export function accountColor(acc: string): string {
  return acc === "bbva" ? "#4285f4" : acc === "amex" ? "#ea4335" : "#9c5eed";
}

export function accountLabel(acc: string): string {
  return acc === "bbva" ? "BBVA" : acc === "amex" ? "Amex" : "Nu";
}

export const FINANCIAL_CONTEXT = `
Datos financieros del usuario (mayo 2025):

CUENTAS:
- BBVA Débito (*4821): Saldo $23,740. Última actualización: hoy.
- Amex Gold (*9034): Saldo a pagar $12,400. Vence en 4 días (31 mayo). Límite $40,000.
- Nu Crédito (*2210): Adeudo $6,240. Pago mínimo $460. Intereses: $798/mes.

RESUMEN FINANCIERO MAYO 2025:
- Saldo total combinado: $42,380
- Deuda total tarjetas: $18,640
- Gasto total mes: $23,450
- Presupuesto mensual (Sheets): $20,000
- Excedido: +$3,450

GASTOS POR CATEGORÍA (mayo):
- Restaurantes y delivery: $6,240 (Uber Eats $340, DiDi Food $290, Lampuga $1,200, Starbucks $210, Taco Inn $180)
- Supermercado: $4,180 (Walmart $1,240, Soriana $890, OXXO $180)
- Ropa y moda: $1,900 (Liverpool)
- Suscripciones: $1,094 (Adobe $289, ChatGPT $220, Netflix $179, HBO $159, YouTube $119, Spotify $99, iCloud $29)
- Gasolina: $1,610 (PEMEX $850, PEMEX $760)
- Transporte: $620 (Uber $340, Taxi $280)
- Salud: $839 (SmartFit $499, Farmacias $340)
- Entretenimiento: $480 (Cinépolis)
- Ingreso: +$37,280 (2 nóminas de $18,640)

SUSCRIPCIONES ACTIVAS (7):
- Adobe Creative Cloud: $289/mes (Nu, corte 15 jun)
- ChatGPT Plus: $220/mes (Amex, corte 18 jun)
- Netflix: $179/mes (Nu, corte 1 jun)
- HBO Max: $159/mes (Amex, corte 22 jun)
- YouTube Premium: $119/mes (BBVA, corte 8 jun)
- Spotify: $99/mes (Nu, corte 5 jun)
- iCloud 200GB: $29/mes (BBVA, corte 28 jun)
- Total mensual: $1,094 · Total anual: $13,128

ALERTAS ACTIVAS:
1. URGENTE: Amex Gold vence en 4 días. Pagar $12,400 antes del 31 mayo o generas $620 en mora.
2. Excediste presupuesto de Sheets en $3,450 (23,450 vs 20,000).
3. Saldo combinado en mínimo histórico: $23,740 libre (promedio histórico $31,200).
4. 3 meses pagando mínimo en Nu = $800/mes en intereses innecesarios.

TENDENCIA MENSUAL (gastos):
- Enero: $19,200
- Febrero: $21,800
- Marzo: $18,400
- Abril: $20,100
- Mayo: $23,450 (máximo del año, +17% vs presupuesto)

ANÁLISIS DE DEUDA:
- Pagando solo mínimos, intereses anuales estimados: $14,880
- Nu tasa efectiva anual: ~56%
- Amex tasa efectiva anual: ~42%
- Si aumentas pago Amex a $4,000/mes: liquidarías en 9 meses y ahorrarías $8,400 en intereses.
`;
