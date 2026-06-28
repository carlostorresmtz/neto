// ─────────────────────────────────────────────────────────────────────────────
// Tarjetas — recomendación y catálogo de tarjetas de crédito.
//
// Modelo de afiliación: Neto puede recibir una comisión cuando un usuario
// solicita una tarjeta a través de la plataforma. Las recomendaciones se hacen
// según el perfil financiero del usuario, NO según quién paga más comisión.
//
// Por ahora usa datos demo (igual que el resto de páginas con fallback).
// TODO(fase posterior): construir el PerfilFinanciero desde los datos reales de
// Gmail / Sheets del usuario en lugar de PERFIL_DEMO.
// ─────────────────────────────────────────────────────────────────────────────

export type CategoriaTarjeta = "sin_anualidad" | "cashback" | "viajes" | "historial";

export interface Tarjeta {
  id: string;
  nombre: string;
  banco: string;
  anualidad: number;          // 0 = sin anualidad
  recompensa: string;         // texto para mostrar (cashback o puntos)
  cashbackPct: number;        // 0 si no aplica (esquema de puntos)
  categoriaCashback?: string; // "Restaurantes", "Global", etc.
  cat: number;                // CAT % (Costo Anual Total)
  beneficio: string;          // beneficio principal
  detalles: string[];         // para "Ver detalles"
  categorias: CategoriaTarjeta[];
  color: string;              // color de acento del banco
  badge?: "Sin anualidad" | "Recomendada";
}

export interface PerfilFinanciero {
  gastoMensual: number;
  anualidadesPagadas: number;       // al año
  categoriaTop: string;             // categoría donde más gasta
  gastoCategoriaTopMensual: number; // gasto mensual en esa categoría
  nivelDeuda: number;
  historialLimitado: boolean;
}

export interface Recomendacion {
  tarjeta: Tarjeta;
  razon: string;
  ahorroEstimado: number;
}

/** Disclaimer de transparencia de comisión. Fuente única. */
export const DISCLAIMER_TARJETAS =
  "Neto puede recibir una comisión si solicitas una tarjeta a través de la plataforma, sin ningún costo adicional para ti. Recomendamos según tu perfil financiero, no según quién nos paga más.";

/**
 * Perfil financiero demo. En producción se construirá a partir de los datos que
 * Neto ya lee del usuario (Gmail + Sheets + CFDIs).
 * TODO(fase posterior): reemplazar por el perfil real del usuario.
 */
export const PERFIL_DEMO: PerfilFinanciero = {
  gastoMensual: 23450,
  anualidadesPagadas: 1240,
  categoriaTop: "Restaurantes",
  gastoCategoriaTopMensual: 5000,
  nivelDeuda: 18640,
  historialLimitado: false,
};

export const CATALOGO: Tarjeta[] = [
  {
    id: "santander-likeu",
    nombre: "LikeU",
    banco: "Santander",
    anualidad: 0,
    recompensa: "5% de cashback en restaurantes",
    cashbackPct: 5,
    categoriaCashback: "Restaurantes",
    cat: 55.2,
    beneficio: "Hasta 5% de bonificación en restaurantes, cine y entretenimiento.",
    detalles: ["Sin anualidad el primer año y de por vida cumpliendo compras mínimas", "Bonificación en streaming y comida", "Meses sin intereses en comercios participantes"],
    categorias: ["cashback", "sin_anualidad"],
    color: "#ec0000",
    badge: "Recomendada",
  },
  {
    id: "nu",
    nombre: "Tarjeta de Crédito Nu",
    banco: "Nu",
    anualidad: 0,
    recompensa: "Sin anualidad de por vida",
    cashbackPct: 0,
    cat: 60.4,
    beneficio: "Control total desde la app y sin anualidad para siempre.",
    detalles: ["Sin anualidad de por vida", "Adelanta tu fecha de pago y ajusta tu límite desde la app", "Ideal para construir o mejorar historial"],
    categorias: ["sin_anualidad", "historial"],
    color: "#820ad1",
    badge: "Sin anualidad",
  },
  {
    id: "hey-banregio",
    nombre: "Hey, Tarjeta de Crédito",
    banco: "Banregio",
    anualidad: 0,
    recompensa: "2% de cashback global",
    cashbackPct: 2,
    categoriaCashback: "Global",
    cat: 42.8,
    beneficio: "Cashback en todas tus compras, sin anualidad.",
    detalles: ["Sin anualidad", "2% de cashback en compras seleccionadas", "Rendimiento sobre tu saldo en la cuenta Hey"],
    categorias: ["sin_anualidad", "cashback"],
    color: "#00c389",
    badge: "Sin anualidad",
  },
  {
    id: "hsbc-2now",
    nombre: "HSBC 2Now",
    banco: "HSBC",
    anualidad: 0,
    recompensa: "2% de cashback global",
    cashbackPct: 2,
    categoriaCashback: "Global",
    cat: 45.1,
    beneficio: "2% de cashback en todas tus compras, sin complicaciones.",
    detalles: ["Sin anualidad", "2% de cashback directo en tu estado de cuenta", "Sin categorías ni registros"],
    categorias: ["sin_anualidad", "cashback"],
    color: "#db0011",
  },
  {
    id: "bbva-azul",
    nombre: "BBVA Azul",
    banco: "BBVA",
    anualidad: 0,
    recompensa: "Puntos BBVA",
    cashbackPct: 0,
    cat: 49.9,
    beneficio: "Tu primera tarjeta: sin anualidad e ideal para historial.",
    detalles: ["Sin anualidad", "Acumula Puntos BBVA en tus compras", "Aprobación ágil para quienes empiezan"],
    categorias: ["sin_anualidad", "historial"],
    color: "#004481",
    badge: "Sin anualidad",
  },
  {
    id: "bancoppel-start",
    nombre: "BanCoppel Tarjeta",
    banco: "BanCoppel",
    anualidad: 0,
    recompensa: "Sin anualidad",
    cashbackPct: 0,
    cat: 75.0,
    beneficio: "Pensada para empezar tu historial crediticio desde cero.",
    detalles: ["Sin anualidad", "Requisitos mínimos de ingreso", "Aceptada donde recibas Visa"],
    categorias: ["historial", "sin_anualidad"],
    color: "#ffd400",
  },
  {
    id: "banregio-mas-viajes",
    nombre: "Más by Banregio",
    banco: "Banregio",
    anualidad: 1200,
    recompensa: "Puntos para viajes",
    cashbackPct: 0,
    cat: 38.4,
    beneficio: "Acumula puntos para vuelos y hospedaje + acceso a salas VIP.",
    detalles: ["Acceso a salas VIP en aeropuertos", "Puntos transferibles a aerolíneas", "Seguros de viaje incluidos"],
    categorias: ["viajes"],
    color: "#ff6600",
  },
  {
    id: "santander-aeromexico",
    nombre: "Santander Aeroméxico",
    banco: "Santander",
    anualidad: 1500,
    recompensa: "Puntos Premier",
    cashbackPct: 0,
    cat: 51.7,
    beneficio: "Acumula Puntos Premier canjeables por vuelos de Aeroméxico.",
    detalles: ["Puntos Premier en cada compra", "Documentación de equipaje sin costo", "Bonos de bienvenida en puntos"],
    categorias: ["viajes"],
    color: "#0b2343",
  },
];

/** Formatea pesos sin decimales. */
function fmtPesos(n: number): string {
  return "$" + Math.round(n).toLocaleString("es-MX");
}

/**
 * Elige la tarjeta que más conviene al perfil y construye una razón explicable
 * y un ahorro estimado. Puntuación simple y transparente:
 *  - sin anualidad cuando el usuario hoy paga anualidades
 *  - cashback que coincide con su categoría de mayor gasto
 *  - opción para construir historial si lo tiene limitado
 */
export function recomendarTarjeta(perfil: PerfilFinanciero): Recomendacion {
  function ahorroDe(t: Tarjeta): number {
    let ahorro = 0;
    if (t.anualidad === 0 && perfil.anualidadesPagadas > 0) ahorro += perfil.anualidadesPagadas;
    if (t.cashbackPct > 0) {
      const baseAnual =
        t.categoriaCashback === perfil.categoriaTop
          ? perfil.gastoCategoriaTopMensual * 12
          : t.categoriaCashback === "Global"
            ? perfil.gastoMensual * 12
            : 0;
      ahorro += baseAnual * (t.cashbackPct / 100);
    }
    return ahorro;
  }

  function score(t: Tarjeta): number {
    let s = 0;
    if (t.anualidad === 0 && perfil.anualidadesPagadas > 0) s += 40;
    if (t.cashbackPct > 0 && t.categoriaCashback === perfil.categoriaTop) s += 35;
    else if (t.cashbackPct > 0 && t.categoriaCashback === "Global") s += 15;
    if (perfil.historialLimitado && t.categorias.includes("historial")) s += 25;
    s += t.cashbackPct; // desempate
    return s;
  }

  const tarjeta = [...CATALOGO].sort((a, b) => score(b) - score(a))[0];
  const ahorroEstimado = ahorroDe(tarjeta);

  // Construcción de la razón personalizada.
  const motivos: string[] = [];
  if (tarjeta.anualidad === 0 && perfil.anualidadesPagadas > 0) {
    motivos.push(`pagas ${fmtPesos(perfil.anualidadesPagadas)} al año en anualidades`);
  }
  if (tarjeta.cashbackPct > 0 && tarjeta.categoriaCashback === perfil.categoriaTop) {
    motivos.push(`gastas mucho en ${perfil.categoriaTop}`);
  }
  if (perfil.historialLimitado && tarjeta.categorias.includes("historial")) {
    motivos.push("estás construyendo tu historial crediticio");
  }

  const ventaja =
    tarjeta.cashbackPct > 0
      ? `${tarjeta.anualidad === 0 ? "sin anualidad " : ""}con ${tarjeta.cashbackPct}% de cashback${tarjeta.categoriaCashback && tarjeta.categoriaCashback !== "Global" ? ` en ${tarjeta.categoriaCashback.toLowerCase()}` : ""}`
      : tarjeta.anualidad === 0
        ? "sin anualidad"
        : tarjeta.recompensa.toLowerCase();

  const inicio = motivos.length > 0 ? `Como ${motivos.join(" y ")}, ` : "Según tu perfil, ";
  const cierre = ahorroEstimado > 0 ? ` te ahorraría ~${fmtPesos(ahorroEstimado)} al año.` : " es la que mejor se ajusta a tu forma de gastar.";
  const razon = `${inicio}esta tarjeta ${ventaja}${cierre}`;

  return { tarjeta, razon, ahorroEstimado };
}

/**
 * Registra una solicitud de tarjeta (lead).
 * TODO(comisiones): conectar a un sistema real de tracking de leads/afiliación
 * con bancos. Por ahora solo registra localmente para la demo.
 */
export function registrarSolicitud(tarjetaId: string): void {
  try {
    const key = "neto_solicitudes_tarjeta";
    const prev = JSON.parse(localStorage.getItem(key) ?? "[]") as { tarjetaId: string; ts: number }[];
    prev.push({ tarjetaId, ts: Date.now() });
    localStorage.setItem(key, JSON.stringify(prev));
  } catch {}
  // eslint-disable-next-line no-console
  console.log("[Neto][lead] Solicitud de tarjeta registrada:", tarjetaId);
}

export function fmtAnualidad(n: number): string {
  return n === 0 ? "Sin anualidad" : `${fmtPesos(n)}/año`;
}
