"use client";

import { useState, useEffect, useCallback } from "react";
import { useSession, signIn } from "next-auth/react";
import type { GmailMessage } from "@/app/api/gmail/messages/route";

/* ── Types ── */
type AgentState = "idle" | "loading" | "done" | "error";
type AlertTipo = "URGENTE" | "IMPORTANTE" | "INFORMATIVO";

interface Alerta {
  tipo: AlertTipo;
  titulo: string;
  mensaje: string;
  accion?: string | null;
  monto?: number | null;
  fecha?: string | null;
}
interface AlertasResult   { alertas: Alerta[]; resumen: string; }

interface CierreResult {
  periodo: string;
  total_gastos: number;
  total_ingresos: number;
  ahorro_neto: number;
  top_categorias: { nombre: string; monto: number; variacion: number; emoji: string }[];
  vs_mes_anterior: { gastos_anterior: number; diferencia: number; porcentaje: number };
  suscripciones: { total_mensual: number; total_anual: number; cantidad: number };
  destacado: string;
  recomendacion: string;
  resumen: string;
}

interface ComparadorResult {
  gastoMensual: number;
  topCategorias: { categoria: string; monto: number }[];
  tarjetaActual?: string;
  recomendacion: { tarjeta: string; cashbackPotencial: number; ahorroAnual: number; razon: string };
  comparativa: { tarjeta: string; cashbackMensual: number; color?: string }[];
  resumen?: string;
}

interface DeduciblesResult {
  totalDeducible: number;
  gastosDeducibles: {
    fecha: string; monto: number; comercio: string;
    categoria: string; esDeducible: boolean; requiereFactura: boolean; nota?: string;
  }[];
  isrEstimado: number;
  recomendaciones: string[];
  resumen?: string;
}

interface FraudeAlerta {
  tipo: string;
  fecha: string;
  monto: number;
  comercio: string;
  banco: string;
  nivelRiesgo: "alto" | "medio" | "bajo";
  recomendacion: string;
}
interface FraudeResult { alertasFraude: FraudeAlerta[]; totalAlertas: number; resumen: string; }

type IngresoTipo = "transferencia" | "efectivo" | "nomina" | "devolucion";
interface Ingreso {
  fecha: string;
  monto: number;
  origen: string;
  tipo: IngresoTipo;
  banco: string;
}
interface DepositosResult {
  ingresos: Ingreso[];
  totalIngresos: number;
  ingresoMasReciente: { monto: number; origen: string; fecha: string } | null;
  resumen?: string;
}

/* ── Helpers ── */
function fmtMXN(n: number) {
  return "$" + Math.abs(n).toLocaleString("es-MX", { maximumFractionDigits: 0 });
}
function timeAgo(ts: number): string {
  const s = Math.floor((Date.now() - ts) / 1000);
  if (s < 60) return "hace un momento";
  const m = Math.floor(s / 60);
  if (m < 60) return `hace ${m} min`;
  return `hace ${Math.floor(m / 60)}h`;
}

/* ── Shared atoms ── */
function LoadingDots() {
  return (
    <span style={{ display: "inline-flex", gap: 3, alignItems: "center", marginLeft: 6 }}>
      {[0, 1, 2].map(i => (
        <span key={i} style={{
          width: 4, height: 4, borderRadius: "50%", background: "var(--accent)",
          animation: "dotPulse 1.2s ease infinite", animationDelay: `${i * 0.2}s`,
        }} />
      ))}
    </span>
  );
}

type ErrorKind = "rate" | "generic";

function ErrorMsg({ kind = "generic" }: { kind?: ErrorKind }) {
  const title = kind === "rate"
    ? "Alcanzaste el límite de ejecuciones de este agente."
    : "No se pudo completar el análisis.";
  const sub = kind === "rate"
    ? "Espera unos minutos e intenta de nuevo."
    : "Espera unos segundos e intenta de nuevo.";
  return (
    <div style={{ textAlign: "center", padding: "24px 0" }}>
      <p style={{ fontSize: 13, color: "var(--text2)", margin: "0 0 4px", fontWeight: 500 }}>{title}</p>
      <p style={{ fontSize: 12, color: "var(--text3)", margin: 0 }}>{sub}</p>
    </div>
  );
}

function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <p style={{ fontSize: 11, fontWeight: 600, color: "var(--text3)", textTransform: "uppercase", letterSpacing: "0.08em", margin: "0 0 10px" }}>
      {children}
    </p>
  );
}

/* ══ ALERTAS display ══ */
const TIPO_CONFIG: Record<AlertTipo, { border: string; bg: string; color: string; label: string; emoji: string; order: number }> = {
  URGENTE:     { border: "#DC2626", bg: "rgba(220,38,38,0.04)",    color: "#DC2626", label: "Urgente",     emoji: "🔴", order: 0 },
  IMPORTANTE:  { border: "#D97706", bg: "rgba(217,119,6,0.04)",    color: "#D97706", label: "Importante",  emoji: "🟡", order: 1 },
  INFORMATIVO: { border: "#1E40AF", bg: "rgba(30,64,175,0.04)",    color: "#1E40AF", label: "Informativo", emoji: "🔵", order: 2 },
};

function AlertCard({ alerta }: { alerta: Alerta }) {
  const s = TIPO_CONFIG[alerta.tipo] ?? TIPO_CONFIG.INFORMATIVO;
  return (
    <div style={{
      borderLeft: `3px solid ${s.border}`,
      border: `1px solid ${s.border}22`,
      background: s.bg, borderRadius: "0 10px 10px 0",
      padding: "14px 16px",
      boxShadow: "0 1px 3px rgba(0,0,0,0.06)",
      animation: "fadeIn 0.3s ease",
    }}>
      <div style={{ display: "flex", alignItems: "flex-start", gap: 10 }}>
        <span style={{ fontSize: 16, flexShrink: 0, marginTop: 1 }}>{s.emoji}</span>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 6, flexWrap: "wrap" }}>
            <span style={{ fontSize: 10, fontWeight: 700, color: s.color, letterSpacing: "0.07em", textTransform: "uppercase", background: `${s.border}18`, borderRadius: 4, padding: "2px 7px" }}>
              {s.label}
            </span>
            {alerta.monto != null && (
              <span style={{ fontSize: 12, fontWeight: 600, color: alerta.monto > 0 ? "#16a34a" : s.color, background: alerta.monto > 0 ? "rgba(22,163,74,0.08)" : `${s.border}10`, borderRadius: 4, padding: "2px 8px" }}>
                {fmtMXN(alerta.monto)}
              </span>
            )}
            {alerta.fecha && <span style={{ fontSize: 11, color: "var(--text3)" }}>{alerta.fecha}</span>}
          </div>
          <p style={{ fontSize: 15, fontWeight: 600, color: "var(--text)", margin: "0 0 4px", lineHeight: 1.3 }}>{alerta.titulo}</p>
          <p style={{ fontSize: 13, color: "var(--text2)", margin: 0, lineHeight: 1.6 }}>{alerta.mensaje}</p>
          {alerta.accion && (
            <button style={{ marginTop: 8, fontSize: 12, fontWeight: 500, color: s.color, background: "transparent", border: `1px solid ${s.border}55`, borderRadius: 6, padding: "4px 12px", cursor: "pointer", fontFamily: "inherit" }}>
              {alerta.accion}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

function AlertasDisplay({ data }: { data: AlertasResult }) {
  const sorted = [...(data.alertas ?? [])].sort((a, b) =>
    (TIPO_CONFIG[a.tipo]?.order ?? 3) - (TIPO_CONFIG[b.tipo]?.order ?? 3)
  );
  return (
    <div style={{ animation: "fadeIn 0.3s ease" }}>
      <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 16, padding: "10px 14px", background: "var(--bg3)", border: "1px solid var(--border)", borderRadius: 10 }}>
        <span style={{ fontSize: 18 }}>🔔</span>
        <div>
          <p style={{ fontSize: 14, fontWeight: 600, color: "var(--text)", margin: "0 0 2px" }}>{sorted.length} alerta{sorted.length !== 1 ? "s" : ""} encontrada{sorted.length !== 1 ? "s" : ""}</p>
          {data.resumen && <p style={{ fontSize: 12, color: "var(--text3)", margin: 0, lineHeight: 1.4 }}>{data.resumen}</p>}
        </div>
      </div>
      <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
        {sorted.map((a, i) => <AlertCard key={i} alerta={a} />)}
      </div>
    </div>
  );
}

/* ══ CIERRE modal ══ */
function CierreModal({ onClose, gmailMessages }: { onClose: () => void; gmailMessages: GmailMessage[] | null }) {
  const [data, setData]       = useState<CierreResult | null>(null);
  const [loading, setLoading] = useState(true);
  const [errKind, setErrKind] = useState<ErrorKind | null>(null);

  useEffect(() => {
    const body = gmailMessages && gmailMessages.length > 0
      ? JSON.stringify({ gmailContext: gmailMessages }) : JSON.stringify({});
    fetch("/api/agentes/cierre", { method: "POST", headers: { "Content-Type": "application/json" }, body })
      .then(async r => {
        if (r.status === 429) { setErrKind("rate"); setLoading(false); return; }
        if (!r.ok) throw new Error();
        const d = await r.json(); setData(d); setLoading(false);
      })
      .catch(() => { setErrKind("generic"); setLoading(false); });
  }, [gmailMessages]);

  const maxCat = Math.max(...(data?.top_categorias?.map(c => c.monto) ?? [1]), 1);

  return (
    <div style={{ position: "fixed", inset: 0, zIndex: 100, background: "rgba(0,0,0,0.65)", backdropFilter: "blur(6px)", display: "flex", alignItems: "center", justifyContent: "center", padding: 20 }} onClick={onClose}>
      <div style={{ background: "var(--card)", border: "1px solid var(--border)", borderRadius: 12, padding: "32px 28px", maxWidth: 560, width: "100%", maxHeight: "88vh", overflowY: "auto", animation: "fadeIn 0.2s ease" }} onClick={e => e.stopPropagation()}>
        {/* Header */}
        <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", marginBottom: 24 }}>
          <div>
            <p style={{ fontSize: 11, color: "#f5c166", letterSpacing: "0.1em", textTransform: "uppercase", margin: "0 0 4px", fontWeight: 600 }}>CierreAgent · Beta</p>
            <h2 style={{ fontSize: 21, fontWeight: 600, color: "var(--text)", letterSpacing: "-0.02em", margin: 0 }}>
              Resumen {data?.periodo ?? "del mes"}
            </h2>
            {data?.resumen && <p style={{ fontSize: 13, color: "var(--text3)", margin: "6px 0 0", lineHeight: 1.5 }}>{data.resumen}</p>}
          </div>
          <button onClick={onClose} style={{ background: "none", border: "none", cursor: "pointer", color: "var(--text3)", padding: 6, flexShrink: 0 }}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
          </button>
        </div>

        {loading && (
          <div style={{ textAlign: "center", padding: "48px 0" }}>
            <p style={{ fontSize: 14, color: "var(--text2)", display: "flex", alignItems: "center", justifyContent: "center" }}>
              CierreAgent generando tu reporte<LoadingDots />
            </p>
          </div>
        )}
        {errKind && <ErrorMsg kind={errKind} />}

        {data && !loading && (
          <div style={{ display: "flex", flexDirection: "column", gap: 22 }}>
            {/* 2x2 KPI grid */}
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
              {[
                { label: "Total gastado",     value: fmtMXN(data.total_gastos),   color: "#DC2626" },
                { label: "Ingresos",          value: fmtMXN(data.total_ingresos),  color: "#16a34a" },
                {
                  label: "vs mes anterior",
                  value: data.vs_mes_anterior
                    ? `${data.vs_mes_anterior.diferencia >= 0 ? "+" : "-"}${fmtMXN(Math.abs(data.vs_mes_anterior.diferencia))}`
                    : fmtMXN(data.ahorro_neto),
                  color: (data.vs_mes_anterior?.diferencia ?? data.ahorro_neto) >= 0 ? "#DC2626" : "#16a34a",
                },
                {
                  label: "Suscripciones",
                  value: data.suscripciones ? `${fmtMXN(data.suscripciones.total_mensual)}/mes` : "—",
                  color: "var(--text)",
                  sub: data.suscripciones ? `${data.suscripciones.cantidad} activas` : undefined,
                },
              ].map((kpi, i) => (
                <div key={i} style={{ background: "var(--bg3)", border: "1px solid var(--border)", borderRadius: 10, padding: "14px 16px", boxShadow: "0 1px 3px rgba(0,0,0,0.06)" }}>
                  <p style={{ fontSize: 11, color: "var(--text3)", margin: "0 0 4px" }}>{kpi.label}</p>
                  <p style={{ fontSize: 20, fontWeight: 600, color: kpi.color, margin: 0, letterSpacing: "-0.02em" }}>{kpi.value}</p>
                  {(kpi as { sub?: string }).sub && <p style={{ fontSize: 11, color: "var(--text3)", margin: "2px 0 0" }}>{(kpi as { sub?: string }).sub}</p>}
                </div>
              ))}
            </div>

            {/* Top categorías */}
            {data.top_categorias?.length > 0 && (
              <div>
                <SectionLabel>Top categorías</SectionLabel>
                <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                  {data.top_categorias.map((cat, i) => {
                    const pct = Math.round((cat.monto / maxCat) * 100);
                    return (
                      <div key={i}>
                        <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 4 }}>
                          <span style={{ fontSize: 13, color: "var(--text)", display: "flex", alignItems: "center", gap: 6 }}>
                            <span>{cat.emoji}</span>{cat.nombre}
                          </span>
                          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                            <span style={{ fontSize: 12, fontWeight: 600, color: "var(--text)" }}>{fmtMXN(cat.monto)}</span>
                            {cat.variacion !== 0 && (
                              <span style={{ fontSize: 11, color: cat.variacion > 0 ? "#DC2626" : "#16a34a", fontWeight: 500 }}>
                                {cat.variacion > 0 ? "+" : ""}{cat.variacion}%
                              </span>
                            )}
                          </div>
                        </div>
                        <div style={{ height: 6, background: "var(--bg3)", borderRadius: 3, overflow: "hidden" }}>
                          <div style={{ width: `${pct}%`, height: "100%", background: "var(--accent)", borderRadius: 3, transition: "width 0.6s ease" }} />
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Destacado + Recomendación */}
            {(data.destacado || data.recomendacion) && (
              <div>
                <SectionLabel>Recomendaciones</SectionLabel>
                <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                  {data.destacado && (
                    <div style={{ display: "flex", gap: 10, alignItems: "flex-start" }}>
                      <span style={{ fontSize: 15, flexShrink: 0 }}>→</span>
                      <p style={{ fontSize: 13, color: "var(--text)", margin: 0, lineHeight: 1.5, fontWeight: 500 }}>{data.destacado}</p>
                    </div>
                  )}
                  {data.recomendacion && (
                    <div style={{ display: "flex", gap: 10, alignItems: "flex-start" }}>
                      <span style={{ fontSize: 15, flexShrink: 0 }}>→</span>
                      <p style={{ fontSize: 13, color: "var(--text2)", margin: 0, lineHeight: 1.5 }}>{data.recomendacion}</p>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

/* ══ COMPARADOR display ══ */
function ComparadorDisplay({ data }: { data: ComparadorResult }) {
  const maxCashback = Math.max(...(data.comparativa?.map(c => c.cashbackMensual) ?? [1]), 1);
  const maxCat = Math.max(...(data.topCategorias?.map(c => c.monto) ?? [1]), 1);

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 18, animation: "fadeIn 0.3s ease" }}>
      {/* Gasto mensual + categorías como pills */}
      <div style={{ background: "var(--bg3)", border: "1px solid var(--border)", borderRadius: 12, padding: "16px 18px", boxShadow: "0 1px 3px rgba(0,0,0,0.06)" }}>
        <div style={{ display: "flex", alignItems: "baseline", gap: 10, marginBottom: 12 }}>
          <span style={{ fontSize: 11, color: "var(--text3)", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.08em" }}>Gasto mensual analizado</span>
          <span style={{ fontSize: 24, fontWeight: 600, color: "var(--text)", letterSpacing: "-0.02em" }}>{fmtMXN(data.gastoMensual)}</span>
        </div>
        {data.topCategorias?.length > 0 && (
          <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
            {data.topCategorias.slice(0, 4).map((cat, i) => (
              <span key={i} style={{ fontSize: 12, color: "var(--text2)", background: "var(--card)", border: "1px solid var(--border)", borderRadius: 100, padding: "3px 12px", display: "flex", alignItems: "center", gap: 5 }}>
                {cat.categoria}
                <span style={{ fontWeight: 600, color: "var(--text)" }}>{fmtMXN(cat.monto)}</span>
              </span>
            ))}
          </div>
        )}
      </div>

      {/* Tarjeta recomendada - destacada */}
      {data.recomendacion && (
        <div style={{ background: "rgba(30,64,175,0.04)", border: "2px solid rgba(30,64,175,0.25)", borderRadius: 12, padding: "18px 20px", boxShadow: "0 1px 3px rgba(0,0,0,0.06)" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 10 }}>
            <span style={{ fontSize: 11, fontWeight: 700, color: "var(--accent)", letterSpacing: "0.08em", textTransform: "uppercase" }}>Tarjeta recomendada</span>
            <span style={{ fontSize: 11, background: "rgba(30,64,175,0.1)", color: "var(--accent)", borderRadius: 4, padding: "2px 8px", fontWeight: 600 }}>Mayor cashback</span>
          </div>
          <p style={{ fontSize: 20, fontWeight: 600, color: "var(--text)", margin: "0 0 8px", letterSpacing: "-0.01em" }}>{data.recomendacion.tarjeta}</p>
          <div style={{ display: "flex", alignItems: "baseline", gap: 6, marginBottom: 10 }}>
            <span style={{ fontSize: 28, fontWeight: 600, color: "#16a34a", letterSpacing: "-0.02em" }}>{fmtMXN(data.recomendacion.cashbackPotencial)}</span>
            <span style={{ fontSize: 13, color: "var(--text3)" }}>cashback/mes</span>
            <span style={{ fontSize: 13, color: "var(--text3)", marginLeft: 8 }}>·</span>
            <span style={{ fontSize: 15, fontWeight: 600, color: "var(--accent)", marginLeft: 4 }}>{fmtMXN(data.recomendacion.ahorroAnual)}/año</span>
          </div>
          <p style={{ fontSize: 13, color: "var(--text2)", margin: 0, lineHeight: 1.5 }}>{data.recomendacion.razon}</p>
        </div>
      )}

      {/* Comparativa barras */}
      {data.comparativa?.length > 0 && (
        <div>
          <SectionLabel>Comparativa de tarjetas</SectionLabel>
          <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            {data.comparativa.slice(0, 5).map((c, i) => {
              const pct = (c.cashbackMensual / maxCashback) * 100;
              const isWinner = i === 0;
              return (
                <div key={i} style={{ display: "flex", alignItems: "center", gap: 12 }}>
                  <span style={{ fontSize: 12, minWidth: 130, color: isWinner ? "var(--accent)" : "var(--text2)", fontWeight: isWinner ? 600 : 400 }}>{c.tarjeta}</span>
                  <div style={{ flex: 1, height: 8, background: "var(--bg3)", borderRadius: 4, overflow: "hidden" }}>
                    <div style={{ width: `${pct}%`, height: "100%", background: isWinner ? "var(--accent)" : "rgba(100,116,139,0.35)", borderRadius: 4, transition: "width 0.7s ease" }} />
                  </div>
                  <span style={{ fontSize: 12, minWidth: 68, textAlign: "right", fontWeight: isWinner ? 600 : 400, color: isWinner ? "var(--accent)" : "var(--text2)" }}>
                    {fmtMXN(c.cashbackMensual)}/mes
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Categorías detalle */}
      {data.topCategorias?.length > 0 && (
        <div>
          <SectionLabel>Distribución de gastos</SectionLabel>
          {data.topCategorias.map((cat, i) => {
            const pct = Math.round((cat.monto / maxCat) * 100);
            return (
              <div key={i} style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 8 }}>
                <span style={{ fontSize: 12, color: "var(--text2)", minWidth: 140 }}>{cat.categoria}</span>
                <div style={{ flex: 1, height: 6, background: "var(--bg3)", borderRadius: 3 }}>
                  <div style={{ width: `${pct}%`, height: "100%", background: "var(--accent)", borderRadius: 3 }} />
                </div>
                <span style={{ fontSize: 12, fontWeight: 600, color: "var(--text)", minWidth: 72, textAlign: "right" }}>{fmtMXN(cat.monto)}</span>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

/* ══ DEDUCIBLES display ══ */
function DeduciblesDisplay({ data }: { data: DeduciblesResult }) {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 18, animation: "fadeIn 0.3s ease" }}>
      {/* KPI header */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
        <div style={{ background: "rgba(22,163,74,0.05)", border: "1px solid rgba(22,163,74,0.2)", borderRadius: 12, padding: "16px 18px", boxShadow: "0 1px 3px rgba(0,0,0,0.06)" }}>
          <p style={{ fontSize: 11, color: "#16a34a", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.08em", margin: "0 0 4px" }}>Total deducible</p>
          <p style={{ fontSize: 26, fontWeight: 600, color: "var(--text)", margin: 0, letterSpacing: "-0.02em" }}>{fmtMXN(data.totalDeducible)}</p>
          <p style={{ fontSize: 12, color: "var(--text3)", margin: "4px 0 0" }}>este mes</p>
        </div>
        <div style={{ background: "var(--bg3)", border: "1px solid var(--border)", borderRadius: 12, padding: "16px 18px", boxShadow: "0 1px 3px rgba(0,0,0,0.06)" }}>
          <p style={{ fontSize: 11, color: "var(--text3)", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.08em", margin: "0 0 4px" }}>Ahorro ISR estimado</p>
          <p style={{ fontSize: 26, fontWeight: 600, color: "var(--accent)", margin: 0, letterSpacing: "-0.02em" }}>{fmtMXN(data.isrEstimado)}</p>
          <p style={{ fontSize: 12, color: "var(--text3)", margin: "4px 0 0" }}>tasa marginal 30%</p>
        </div>
      </div>

      {/* Tabla de gastos */}
      {data.gastosDeducibles?.length > 0 && (
        <div>
          <SectionLabel>Gastos analizados</SectionLabel>
          <div style={{ border: "1px solid var(--border)", borderRadius: 10, overflowX: "auto", boxShadow: "0 1px 3px rgba(0,0,0,0.06)" }}>
            <table style={{ width: "100%", minWidth: 460, borderCollapse: "collapse", fontSize: 13 }}>
              <thead>
                <tr style={{ background: "var(--bg3)" }}>
                  {["Fecha", "Comercio", "Monto", "Categoría", "Deducible"].map(h => (
                    <th key={h} style={{ padding: "9px 12px", textAlign: "left", fontSize: 10, fontWeight: 700, color: "var(--text3)", textTransform: "uppercase", letterSpacing: "0.07em", borderBottom: "1px solid var(--border)", whiteSpace: "nowrap" }}>
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {data.gastosDeducibles.map((g, i) => (
                  <tr key={i} style={{ borderBottom: i < data.gastosDeducibles.length - 1 ? "1px solid var(--border)" : "none", background: i % 2 === 0 ? "transparent" : "rgba(0,0,0,0.015)" }}>
                    <td style={{ padding: "10px 12px", color: "var(--text3)", whiteSpace: "nowrap" }}>{g.fecha}</td>
                    <td style={{ padding: "10px 12px", color: "var(--text)", fontWeight: 500 }}>{g.comercio}</td>
                    <td style={{ padding: "10px 12px", fontWeight: 600, color: g.esDeducible ? "#16a34a" : "var(--text)", whiteSpace: "nowrap" }}>
                      {fmtMXN(g.monto)}
                    </td>
                    <td style={{ padding: "10px 12px" }}>
                      <div style={{ display: "flex", alignItems: "center", gap: 6, flexWrap: "wrap" }}>
                        <span style={{ fontSize: 11, background: "var(--bg3)", border: "1px solid var(--border)", borderRadius: 4, padding: "2px 7px", color: "var(--text2)" }}>{g.categoria}</span>
                        {g.requiereFactura && (
                          <span style={{ fontSize: 10, background: "rgba(217,119,6,0.08)", color: "#D97706", border: "1px solid rgba(217,119,6,0.2)", borderRadius: 4, padding: "2px 6px", fontWeight: 600 }}>Factura</span>
                        )}
                      </div>
                    </td>
                    <td style={{ padding: "10px 12px", textAlign: "center" }}>
                      <span style={{ fontSize: 16, color: g.esDeducible ? "#16a34a" : "rgba(100,116,139,0.5)" }}>
                        {g.esDeducible ? "✓" : "✗"}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Recomendaciones */}
      {data.recomendaciones?.length > 0 && (
        <div>
          <SectionLabel>Recomendaciones</SectionLabel>
          <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
            {data.recomendaciones.map((r, i) => (
              <div key={i} style={{ display: "flex", gap: 10, alignItems: "flex-start" }}>
                <span style={{ fontSize: 15, flexShrink: 0 }}>💡</span>
                <p style={{ fontSize: 13, color: "var(--text2)", margin: 0, lineHeight: 1.5 }}>{r}</p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

/* ══ FRAUDE display ══ */
function FraudeDisplay({ data }: { data: FraudeResult }) {
  const RIESGO: Record<string, { bg: string; border: string; color: string; label: string }> = {
    alto:  { bg: "rgba(220,38,38,0.04)",   border: "#DC2626", color: "#DC2626", label: "Riesgo alto"  },
    medio: { bg: "rgba(217,119,6,0.04)",   border: "#D97706", color: "#D97706", label: "Riesgo medio" },
    bajo:  { bg: "rgba(22,163,74,0.04)",   border: "#16a34a", color: "#16a34a", label: "Riesgo bajo"  },
  };

  if (data.totalAlertas === 0 || !data.alertasFraude?.length) {
    return (
      <div style={{ background: "rgba(22,163,74,0.05)", border: "1px solid rgba(22,163,74,0.2)", borderRadius: 12, padding: "24px 20px", textAlign: "center", animation: "fadeIn 0.3s ease", boxShadow: "0 1px 3px rgba(0,0,0,0.06)" }}>
        <div style={{ fontSize: 40, marginBottom: 8 }}>✓</div>
        <p style={{ fontSize: 15, fontWeight: 600, color: "#16a34a", margin: "0 0 6px" }}>Sin actividad sospechosa detectada</p>
        <p style={{ fontSize: 13, color: "var(--text3)", margin: 0, lineHeight: 1.5, maxWidth: 340, marginInline: "auto" }}>{data.resumen}</p>
      </div>
    );
  }

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 12, animation: "fadeIn 0.3s ease" }}>
      <div style={{ display: "flex", alignItems: "center", gap: 10, padding: "10px 14px", background: "rgba(220,38,38,0.04)", border: "1px solid rgba(220,38,38,0.2)", borderRadius: 10 }}>
        <span style={{ fontSize: 18 }}>⚠️</span>
        <div>
          <p style={{ fontSize: 14, fontWeight: 600, color: "#DC2626", margin: "0 0 2px" }}>{data.totalAlertas} alerta{data.totalAlertas !== 1 ? "s" : ""} detectada{data.totalAlertas !== 1 ? "s" : ""}</p>
          {data.resumen && <p style={{ fontSize: 12, color: "var(--text3)", margin: 0 }}>{data.resumen}</p>}
        </div>
      </div>

      {data.alertasFraude.map((a, i) => {
        const s = RIESGO[a.nivelRiesgo?.toLowerCase()] ?? RIESGO.medio;
        return (
          <div key={i} style={{ borderLeft: `3px solid ${s.border}`, border: `1px solid ${s.border}22`, background: s.bg, borderRadius: "0 10px 10px 0", padding: "14px 16px", boxShadow: "0 1px 3px rgba(0,0,0,0.06)" }}>
            <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: 12, marginBottom: 8 }}>
              <div style={{ display: "flex", gap: 8, flexWrap: "wrap", alignItems: "center" }}>
                <span style={{ fontSize: 10, fontWeight: 700, color: s.color, textTransform: "uppercase", letterSpacing: "0.07em", background: `${s.border}18`, borderRadius: 4, padding: "2px 7px" }}>
                  {s.label}
                </span>
                <span style={{ fontSize: 11, background: "var(--bg3)", border: "1px solid var(--border)", borderRadius: 4, padding: "2px 8px", color: "var(--text2)" }}>{a.tipo}</span>
              </div>
              <span style={{ fontSize: 14, fontWeight: 600, color: s.color, flexShrink: 0 }}>{fmtMXN(a.monto)}</span>
            </div>
            <div style={{ display: "flex", gap: 12, marginBottom: 6, flexWrap: "wrap" }}>
              <span style={{ fontSize: 13, color: "var(--text)", fontWeight: 500 }}>{a.comercio}</span>
              <span style={{ fontSize: 12, color: "var(--text3)" }}>{a.banco}</span>
              {a.fecha && <span style={{ fontSize: 12, color: "var(--text3)" }}>{a.fecha}</span>}
            </div>
            <p style={{ fontSize: 12, color: s.color, margin: 0, lineHeight: 1.4 }}>→ {a.recomendacion}</p>
          </div>
        );
      })}
    </div>
  );
}

/* ══ DEPOSITOS display ══ */
const INGRESO_TIPO: Record<string, { label: string; color: string; border: string }> = {
  transferencia: { label: "Transferencia", color: "#1E40AF", border: "#1E40AF" },
  efectivo:      { label: "Efectivo",      color: "#16a34a", border: "#16a34a" },
  nomina:        { label: "Nómina",        color: "#7c3aed", border: "#7c3aed" },
  devolucion:    { label: "Devolución",    color: "#D97706", border: "#D97706" },
};

function DepositosDisplay({ data }: { data: DepositosResult }) {
  const ingresos = data.ingresos ?? [];

  if (ingresos.length === 0) {
    return (
      <div style={{ background: "var(--bg3)", border: "1px solid var(--border)", borderRadius: 12, padding: "24px 20px", textAlign: "center", animation: "fadeIn 0.3s ease" }}>
        <div style={{ fontSize: 40, marginBottom: 8 }}>💸</div>
        <p style={{ fontSize: 15, fontWeight: 600, color: "var(--text)", margin: "0 0 6px" }}>Sin ingresos detectados</p>
        <p style={{ fontSize: 13, color: "var(--text3)", margin: 0, lineHeight: 1.5, maxWidth: 340, marginInline: "auto" }}>
          {data.resumen ?? "No encontramos depósitos ni transferencias entrantes en este periodo."}
        </p>
      </div>
    );
  }

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 16, animation: "fadeIn 0.3s ease" }}>
      {/* Total de ingresos */}
      <div style={{ background: "rgba(22,163,74,0.05)", border: "1px solid rgba(22,163,74,0.2)", borderRadius: 12, padding: "18px 20px", boxShadow: "0 1px 3px rgba(0,0,0,0.06)" }}>
        <p style={{ fontSize: 11, color: "#16a34a", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.08em", margin: "0 0 4px" }}>Total de ingresos</p>
        <p style={{ fontSize: 32, fontWeight: 600, color: "#16a34a", margin: 0, letterSpacing: "-0.02em" }}>+{fmtMXN(data.totalIngresos)}</p>
        <p style={{ fontSize: 12, color: "var(--text3)", margin: "4px 0 0" }}>{ingresos.length} ingreso{ingresos.length !== 1 ? "s" : ""} detectado{ingresos.length !== 1 ? "s" : ""}{data.resumen ? ` · ${data.resumen}` : ""}</p>
      </div>

      {/* Ingreso más reciente destacado */}
      {data.ingresoMasReciente && (
        <div style={{ border: "2px solid rgba(22,163,74,0.25)", background: "rgba(22,163,74,0.03)", borderRadius: 12, padding: "16px 18px" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 8 }}>
            <span style={{ fontSize: 11, fontWeight: 700, color: "#16a34a", letterSpacing: "0.08em", textTransform: "uppercase" }}>Más reciente</span>
          </div>
          <div style={{ display: "flex", alignItems: "baseline", gap: 10, flexWrap: "wrap" }}>
            <span style={{ fontSize: 24, fontWeight: 600, color: "#16a34a", letterSpacing: "-0.02em" }}>+{fmtMXN(data.ingresoMasReciente.monto)}</span>
            <span style={{ fontSize: 14, color: "var(--text)", fontWeight: 500 }}>{data.ingresoMasReciente.origen}</span>
            <span style={{ fontSize: 12, color: "var(--text3)" }}>{data.ingresoMasReciente.fecha}</span>
          </div>
        </div>
      )}

      {/* Lista de ingresos */}
      <div>
        <SectionLabel>Todos los ingresos</SectionLabel>
        <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
          {ingresos.map((ing, i) => {
            const s = INGRESO_TIPO[ing.tipo] ?? INGRESO_TIPO.transferencia;
            return (
              <div key={i} style={{ borderLeft: `3px solid ${s.border}`, border: `1px solid ${s.border}22`, background: "var(--card)", borderRadius: "0 10px 10px 0", padding: "14px 16px", boxShadow: "0 1px 3px rgba(0,0,0,0.06)" }}>
                <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: 12 }}>
                  <div style={{ minWidth: 0, flex: 1 }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 4, flexWrap: "wrap" }}>
                      <span style={{ fontSize: 10, fontWeight: 700, color: s.color, textTransform: "uppercase", letterSpacing: "0.07em", background: `${s.border}18`, borderRadius: 4, padding: "2px 7px" }}>{s.label}</span>
                      <span style={{ fontSize: 11, color: "var(--text3)" }}>{ing.banco}</span>
                    </div>
                    <p style={{ fontSize: 14, color: "var(--text)", fontWeight: 500, margin: 0 }}>{ing.origen}</p>
                    <p style={{ fontSize: 12, color: "var(--text3)", margin: "2px 0 0" }}>{ing.fecha}</p>
                  </div>
                  <span style={{ fontSize: 16, fontWeight: 600, color: "#16a34a", flexShrink: 0, whiteSpace: "nowrap" }}>+{fmtMXN(ing.monto)}</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

/* ── Badge styles ── */
const BADGE_STYLE: Record<string, React.CSSProperties> = {
  "En vivo":      { background: "rgba(184,245,102,0.1)",  color: "#b8f566", border: "1px solid rgba(184,245,102,0.25)" },
  "Beta":         { background: "rgba(245,193,102,0.1)",  color: "#f5c166", border: "1px solid rgba(245,193,102,0.25)" },
  "Próximamente": { background: "rgba(148,163,184,0.08)", color: "var(--text3)", border: "1px solid var(--border)" },
};

/* ── AgentBody ── */
function AgentBody({ state, agentName, loadingText, errorKind, children }: { state: AgentState; agentName: string; loadingText?: string; errorKind?: ErrorKind; children?: React.ReactNode }) {
  if (state === "idle") return (
    <div style={{ textAlign: "center", padding: "28px 0" }}>
      <p style={{ fontSize: 13, color: "var(--text3)", margin: 0 }}>Presiona el botón para analizar tus datos.</p>
    </div>
  );
  if (state === "loading") return (
    <div style={{ textAlign: "center", padding: "32px 0" }}>
      <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 10 }}>
        <div style={{ width: 32, height: 32, border: "2px solid var(--border)", borderTop: "2px solid var(--accent)", borderRadius: "50%", animation: "spin 0.8s linear infinite" }} />
        <p style={{ fontSize: 14, color: "var(--text2)", margin: 0 }}>
          {loadingText ?? `${agentName} analizando tus finanzas…`}
        </p>
      </div>
    </div>
  );
  if (state === "error") return <ErrorMsg kind={errorKind} />;
  return <>{children}</>;
}

/* ── RunButton ── */
function RunButton({ state, onRun, label, color }: { state: AgentState; onRun: () => void; label?: string; color?: string }) {
  return (
    <button
      onClick={state === "loading" ? undefined : onRun}
      disabled={state === "loading"}
      style={{
        flexShrink: 0, background: state === "loading" ? "var(--bg3)" : (color ?? "var(--accent)"),
        color: state === "loading" ? "var(--text3)" : "#fff",
        border: state === "loading" ? "1px solid var(--border)" : "none",
        borderRadius: 8, padding: "8px 16px", fontSize: 13, fontWeight: 500,
        cursor: state === "loading" ? "not-allowed" : "pointer",
        fontFamily: "inherit", whiteSpace: "nowrap",
        transition: "opacity 0.15s ease",
      }}>
      {state === "loading" ? "Ejecutando…" : state === "done" ? "Ejecutar de nuevo" : (label ?? "Ejecutar ahora")}
    </button>
  );
}

/* ── Agent card header ── */
function AgentCardHeader({
  badge, name, accent, desc, icon, state, lastRunTs, children,
}: {
  badge: string; name: string; accent: string; desc: string;
  icon: React.ReactNode; state: AgentState; lastRunTs: number | null; children?: React.ReactNode;
}) {
  return (
    <div style={{ padding: "22px 24px", borderBottom: "1px solid var(--border)" }}>
      <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: 16 }}>
        <div style={{ display: "flex", alignItems: "flex-start", gap: 14 }}>
          <div style={{ width: 40, height: 40, borderRadius: 10, background: `${accent}15`, border: `1px solid ${accent}30`, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
            {icon}
          </div>
          <div>
            <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 4, flexWrap: "wrap" }}>
              <div style={{ display: "inline-flex", ...BADGE_STYLE[badge], borderRadius: 100, padding: "2px 10px", fontSize: 10, fontWeight: 600, letterSpacing: "0.08em", textTransform: "uppercase" as const }}>
                {badge}
              </div>
              {lastRunTs && <span style={{ fontSize: 11, color: "var(--text3)" }}>Última ejecución: {timeAgo(lastRunTs)}</span>}
            </div>
            <h2 style={{ fontSize: 17, fontWeight: 600, color: "var(--text)", margin: "0 0 3px", letterSpacing: "-0.01em" }}>
              {name}<span style={{ color: "var(--accent)" }}>Agent</span>
            </h2>
            <p style={{ fontSize: 13, color: "var(--text2)", margin: 0, lineHeight: 1.5 }}>{desc}</p>
          </div>
        </div>
        {children}
      </div>
    </div>
  );
}

/* ══ Main page ══ */
export default function AgentesPage() {
  const { data: session } = useSession();
  const [gmailMessages, setGmailMessages] = useState<GmailMessage[] | null>(null);
  const [gmailLoaded,   setGmailLoaded]   = useState(false);

  const [alertasState, setAlertasState] = useState<AgentState>("idle");
  const [alertasData,  setAlertasData]  = useState<AlertasResult | null>(null);
  const [alertasTs,    setAlertasTs]    = useState<number | null>(null);

  const [showCierre,   setShowCierre]   = useState(false);

  const [compState,    setCompState]    = useState<AgentState>("idle");
  const [compData,     setCompData]     = useState<ComparadorResult | null>(null);
  const [compTs,       setCompTs]       = useState<number | null>(null);

  const [dedState,     setDedState]     = useState<AgentState>("idle");
  const [dedData,      setDedData]      = useState<DeduciblesResult | null>(null);
  const [dedTs,        setDedTs]        = useState<number | null>(null);

  const [fraudeState,  setFraudeState]  = useState<AgentState>("idle");
  const [fraudeData,   setFraudeData]   = useState<FraudeResult | null>(null);
  const [fraudeTs,     setFraudeTs]     = useState<number | null>(null);

  const [depState,     setDepState]     = useState<AgentState>("idle");
  const [depData,      setDepData]      = useState<DepositosResult | null>(null);
  const [depTs,        setDepTs]        = useState<number | null>(null);

  // Tipo de error por agente (para distinguir rate-limit de error transitorio).
  const [agentErr, setAgentErr] = useState<Record<string, ErrorKind | undefined>>({});

  useEffect(() => {
    if (!session?.accessToken) return;
    fetch("/api/gmail/messages")
      .then(r => { if (!r.ok) return null; return r.json(); })
      .then(d => {
        if (d?.messages?.length) setGmailMessages(d.messages);
        setGmailLoaded(true);
      })
      .catch(() => setGmailLoaded(true));
  }, [session?.accessToken]);

  const gmailBody = useCallback(() =>
    gmailMessages && gmailMessages.length > 0
      ? JSON.stringify({ gmailContext: gmailMessages })
      : JSON.stringify({}),
  [gmailMessages]);

  const runAlertas = useCallback(async () => {
    setAlertasState("loading"); setAlertasData(null); setAgentErr(p => ({ ...p, alertas: undefined }));
    try {
      const r = await fetch("/api/agentes/alertas", { method: "POST", headers: { "Content-Type": "application/json" }, body: gmailBody() });
      if (r.status === 429) { setAgentErr(p => ({ ...p, alertas: "rate" })); setAlertasState("error"); return; }
      if (!r.ok) throw new Error();
      const d: AlertasResult = await r.json();
      setAlertasData(d); setAlertasState("done"); setAlertasTs(Date.now());
      const sorted2 = d.alertas ?? [];
      const urgentes2 = sorted2.filter((a: Alerta) => a.tipo === "URGENTE").length;
      const importantes2 = sorted2.filter((a: Alerta) => a.tipo === "IMPORTANTE").length;
      const count2 = urgentes2 + importantes2;
      const level2 = urgentes2 > 0 ? "urgent" : importantes2 > 0 ? "important" : "info";
      localStorage.setItem("neto_alert_count", JSON.stringify({ count: count2, level: count2 > 0 ? level2 : null }));
      window.dispatchEvent(new Event("neto-alertas-update"));
    } catch { setAgentErr(p => ({ ...p, alertas: "generic" })); setAlertasState("error"); }
  }, [gmailBody]);

  const runComparador = useCallback(async () => {
    setCompState("loading"); setCompData(null); setAgentErr(p => ({ ...p, comparador: undefined }));
    try {
      const r = await fetch("/api/agentes/comparador", { method: "POST", headers: { "Content-Type": "application/json" }, body: gmailBody() });
      if (r.status === 429) { setAgentErr(p => ({ ...p, comparador: "rate" })); setCompState("error"); return; }
      if (!r.ok) throw new Error();
      setCompData(await r.json()); setCompState("done"); setCompTs(Date.now());
    } catch { setAgentErr(p => ({ ...p, comparador: "generic" })); setCompState("error"); }
  }, [gmailBody]);

  const runDeducibles = useCallback(async () => {
    setDedState("loading"); setDedData(null); setAgentErr(p => ({ ...p, deducibles: undefined }));
    try {
      const r = await fetch("/api/agentes/deducibles", { method: "POST", headers: { "Content-Type": "application/json" }, body: gmailBody() });
      if (r.status === 429) { setAgentErr(p => ({ ...p, deducibles: "rate" })); setDedState("error"); return; }
      if (!r.ok) throw new Error();
      setDedData(await r.json()); setDedState("done"); setDedTs(Date.now());
    } catch { setAgentErr(p => ({ ...p, deducibles: "generic" })); setDedState("error"); }
  }, [gmailBody]);

  const runFraude = useCallback(async () => {
    setFraudeState("loading"); setFraudeData(null); setAgentErr(p => ({ ...p, fraude: undefined }));
    try {
      const r = await fetch("/api/agentes/fraude", { method: "POST", headers: { "Content-Type": "application/json" }, body: gmailBody() });
      if (r.status === 429) { setAgentErr(p => ({ ...p, fraude: "rate" })); setFraudeState("error"); return; }
      if (!r.ok) throw new Error();
      setFraudeData(await r.json()); setFraudeState("done"); setFraudeTs(Date.now());
    } catch { setAgentErr(p => ({ ...p, fraude: "generic" })); setFraudeState("error"); }
  }, [gmailBody]);

  const runDepositos = useCallback(async () => {
    setDepState("loading"); setDepData(null); setAgentErr(p => ({ ...p, depositos: undefined }));
    try {
      const r = await fetch("/api/agentes/depositos", { method: "POST", headers: { "Content-Type": "application/json" }, body: gmailBody() });
      if (r.status === 429) { setAgentErr(p => ({ ...p, depositos: "rate" })); setDepState("error"); return; }
      if (!r.ok) throw new Error();
      setDepData(await r.json()); setDepState("done"); setDepTs(Date.now());
    } catch { setAgentErr(p => ({ ...p, depositos: "generic" })); setDepState("error"); }
  }, [gmailBody]);

  const isLoadingGmail = !!session?.accessToken && !gmailLoaded;

  return (
    <div style={{ height: "100%", overflowY: "auto" }}>
      <style>{`
        @keyframes dotPulse {
          0%, 60%, 100% { opacity: 0.2; transform: scale(0.8); }
          30% { opacity: 1; transform: scale(1); }
        }
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(8px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>

      {showCierre && <CierreModal onClose={() => setShowCierre(false)} gmailMessages={gmailMessages} />}

      {/* Page header */}
      <div style={{ padding: "32px 28px 24px", borderBottom: "1px solid var(--border)" }}>
        <h1 style={{ fontSize: 22, fontWeight: 600, color: "var(--text)", margin: "0 0 4px", letterSpacing: "-0.02em" }}>Agentes</h1>
        <p style={{ fontSize: 13, color: "var(--text3)", margin: 0 }}>Trabajando en segundo plano por ti</p>
      </div>

      {/* Gmail banner — never shows an error, always falls back to demo data silently */}
      {isLoadingGmail ? (
        <div style={{ padding: "10px 28px", background: "var(--bg3)", borderBottom: "1px solid var(--border)", fontSize: 12, color: "var(--text3)", display: "flex", alignItems: "center", gap: 6 }}>
          Cargando correos bancarios<LoadingDots />
        </div>
      ) : gmailMessages && gmailMessages.length > 0 ? (
        <div style={{ padding: "10px 28px", background: "rgba(22,163,74,0.04)", borderBottom: "1px solid rgba(22,163,74,0.15)", fontSize: 12, color: "#16a34a" }}>
          ✓ Gmail conectado · {gmailMessages.length} correos bancarios cargados · Los agentes usarán tus datos reales
        </div>
      ) : gmailLoaded && session?.accessToken ? (
        <div style={{ padding: "10px 28px", background: "var(--bg3)", borderBottom: "1px solid var(--border)", fontSize: 12, color: "var(--text3)" }}>
          Sin correos bancarios detectados · Los agentes usarán datos de demostración
        </div>
      ) : !session?.accessToken ? (
        <div style={{ padding: "10px 28px", background: "var(--bg3)", borderBottom: "1px solid var(--border)", display: "flex", alignItems: "center", gap: 8, fontSize: 12, color: "var(--text3)" }}>
          <span>Los agentes funcionan con datos de demostración.</span>
          <button onClick={() => signIn("google", { callbackUrl: "/agentes" })} style={{ padding: "2px 10px", fontSize: 11, fontWeight: 500, background: "var(--accent)", color: "#fff", border: "none", borderRadius: 4, cursor: "pointer", fontFamily: "inherit" }}>
            Conectar Gmail para usar datos reales
          </button>
        </div>
      ) : null}

      <div style={{ padding: "24px 28px 48px", display: "flex", flexDirection: "column", gap: 16 }}>

        {/* ══ ALERTAS ══ */}
        <div id="alertas" style={{ background: "var(--card)", border: "1px solid var(--border)", borderRadius: 12, overflow: "hidden", boxShadow: "0 1px 3px rgba(0,0,0,0.06)", scrollMarginTop: 80 }}>
          <AgentCardHeader
            badge="En vivo" name="Alertas" accent="#b8f566"
            desc="Detecta situaciones urgentes en tus finanzas que requieren atención inmediata."
            state={alertasState} lastRunTs={alertasTs}
            icon={<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#b8f566" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.73 21a2 2 0 0 1-3.46 0"/></svg>}>
            <RunButton state={alertasState} onRun={runAlertas} />
          </AgentCardHeader>
          <div style={{ padding: "20px 24px" }}>
            <AgentBody state={alertasState} agentName="AlertasAgent" errorKind={agentErr.alertas}>
              {alertasData && <AlertasDisplay data={alertasData} />}
            </AgentBody>
          </div>
        </div>

        {/* ══ CIERRE ══ */}
        <div id="cierre" style={{ background: "var(--card)", border: "1px solid var(--border)", borderRadius: 12, boxShadow: "0 1px 3px rgba(0,0,0,0.06)", overflow: "hidden", scrollMarginTop: 80 }}>
          <AgentCardHeader
            badge="Beta" name="Cierre" accent="#f5c166"
            desc="Genera tu resumen financiero mensual con categorías, KPIs y recomendaciones."
            state="idle" lastRunTs={null}
            icon={<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#f5c166" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>}>
            <button
              onClick={() => setShowCierre(true)}
              style={{ flexShrink: 0, background: "rgba(245,193,102,0.1)", border: "1px solid rgba(245,193,102,0.3)", borderRadius: 8, padding: "8px 16px", fontSize: 13, fontWeight: 500, color: "#f5c166", cursor: "pointer", fontFamily: "inherit", whiteSpace: "nowrap" }}>
              Ver resumen
            </button>
          </AgentCardHeader>
        </div>

        {/* ══ COMPARADOR ══ */}
        <div id="comparador" style={{ background: "var(--card)", border: "1px solid var(--border)", borderRadius: 12, overflow: "hidden", boxShadow: "0 1px 3px rgba(0,0,0,0.06)", scrollMarginTop: 80 }}>
          <AgentCardHeader
            badge="Beta" name="Comparador" accent="#f5c166"
            desc="Analiza tus patrones de gasto y calcula qué tarjeta de crédito mexicana te da más cashback."
            state={compState} lastRunTs={compTs}
            icon={<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#f5c166" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><rect x="1" y="4" width="22" height="16" rx="2"/><line x1="1" y1="10" x2="23" y2="10"/></svg>}>
            <RunButton state={compState} onRun={runComparador} label="Analizar mis gastos" />
          </AgentCardHeader>
          <div style={{ padding: "20px 24px" }}>
            <AgentBody state={compState} agentName="ComparadorAgent" errorKind={agentErr.comparador}>
              {compData && <ComparadorDisplay data={compData} />}
            </AgentBody>
          </div>
        </div>

        {/* ══ DEDUCIBLES ══ */}
        <div id="deducibles" style={{ background: "var(--card)", border: "1px solid var(--border)", borderRadius: 12, overflow: "hidden", boxShadow: "0 1px 3px rgba(0,0,0,0.06)", scrollMarginTop: 80 }}>
          <AgentCardHeader
            badge="Beta" name="Deducibles" accent="#f5c166"
            desc="Detecta gastos deducibles de ISR y genera el reporte fiscal para tu contador."
            state={dedState} lastRunTs={dedTs}
            icon={<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#f5c166" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/></svg>}>
            <RunButton state={dedState} onRun={runDeducibles} label="Generar reporte" />
          </AgentCardHeader>
          <div style={{ padding: "20px 24px" }}>
            <AgentBody state={dedState} agentName="DeduciblesAgent" errorKind={agentErr.deducibles}>
              {dedData && <DeduciblesDisplay data={dedData} />}
            </AgentBody>
          </div>
        </div>

        {/* ══ FRAUDE ══ */}
        <div id="fraude" style={{ background: "var(--card)", border: "1px solid var(--border)", borderRadius: 12, overflow: "hidden", boxShadow: "0 1px 3px rgba(0,0,0,0.06)", scrollMarginTop: 80 }}>
          <AgentCardHeader
            badge="Beta" name="Fraude" accent="#66c4f5"
            desc="Detecta cargos duplicados, montos inusuales y patrones sospechosos en tus movimientos."
            state={fraudeState} lastRunTs={fraudeTs}
            icon={<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#66c4f5" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>}>
            <RunButton state={fraudeState} onRun={runFraude} label="Escanear movimientos" />
          </AgentCardHeader>
          <div style={{ padding: "20px 24px" }}>
            <AgentBody state={fraudeState} agentName="FraudeAgent" errorKind={agentErr.fraude}>
              {fraudeData && <FraudeDisplay data={fraudeData} />}
            </AgentBody>
          </div>
        </div>

        {/* ══ DEPOSITOS ══ */}
        <div id="depositos" style={{ background: "var(--card)", border: "1px solid var(--border)", borderRadius: 12, overflow: "hidden", boxShadow: "0 1px 3px rgba(0,0,0,0.06)", scrollMarginTop: 80 }}>
          <AgentCardHeader
            badge="En vivo" name="Depositos" accent="#16a34a"
            desc="Detecta depósitos en efectivo y transferencias que recibiste."
            state={depState} lastRunTs={depTs}
            icon={<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#16a34a" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><polyline points="8 12 12 16 16 12"/><line x1="12" y1="8" x2="12" y2="16"/></svg>}>
            <RunButton state={depState} onRun={runDepositos} label="Buscar mis ingresos" color="#16a34a" />
          </AgentCardHeader>
          <div style={{ padding: "20px 24px" }}>
            <AgentBody state={depState} agentName="DepositosAgent" loadingText="DepositosAgent buscando tus ingresos…" errorKind={agentErr.depositos}>
              {depData && <DepositosDisplay data={depData} />}
            </AgentBody>
          </div>
        </div>

      </div>
    </div>
  );
}
