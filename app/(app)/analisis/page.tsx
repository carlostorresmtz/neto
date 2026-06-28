"use client";

import { useEffect, useState, useCallback } from "react";
import { useSession } from "next-auth/react";
import { usePlan } from "@/components/PlanContext";
import PaywallBlock from "@/components/PaywallBlock";

interface GmailMessage { from: string; subject: string; date: string; snippet?: string; }

interface Categoria { categoria: string; monto: number; porcentaje: number; color: string; }
interface MesData { mes: string; total: number; }
interface TopComercio { nombre: string; monto: number; visitas: number; }
interface AnalisisData {
  gastosPorCategoria: Categoria[];
  gastosPorMes: MesData[];
  totalMesActual: number;
  promedioMensual: number;
  variacionVsMesAnterior: number;
  tendencia: "subiendo" | "bajando" | "estable";
  topComercio: TopComercio | null;
}

type LoadState = "idle" | "loading" | "done" | "error";

function fmt(n: number) {
  return "$" + Math.round(n).toLocaleString("es-MX");
}

function SkeletonBar() {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 8 }}>
      <div style={{ width: 100, height: 12, borderRadius: 6, background: "var(--bg3)", animation: "skPulse 1.4s ease infinite" }} />
      <div style={{ flex: 1, height: 7, borderRadius: 3, background: "var(--bg3)", animation: "skPulse 1.4s ease infinite" }} />
      <div style={{ width: 60, height: 12, borderRadius: 6, background: "var(--bg3)", animation: "skPulse 1.4s ease infinite" }} />
    </div>
  );
}

function SkeletonCard() {
  return (
    <div style={{ background: "var(--card)", border: "1px solid var(--border)", borderRadius: 12, padding: "16px 18px" }}>
      <div style={{ width: "60%", height: 12, borderRadius: 6, background: "var(--bg3)", animation: "skPulse 1.4s ease infinite", marginBottom: 14 }} />
      <div style={{ width: "40%", height: 24, borderRadius: 6, background: "var(--bg3)", animation: "skPulse 1.4s ease infinite" }} />
    </div>
  );
}

export default function AnalisisPage() {
  const { data: session } = useSession();
  const { userPlan, openUpgrade } = usePlan();
  const [state, setState] = useState<LoadState>("idle");
  const [data, setData] = useState<AnalisisData | null>(null);
  const [isDemo, setIsDemo] = useState(false);

  const load = useCallback(async () => {
    setState("loading");
    let gmailMessages: GmailMessage[] | null = null;

    if (session?.accessToken) {
      try {
        const r = await fetch("/api/gmail/messages");
        if (r.ok) {
          const d = await r.json();
          if (d?.messages?.length) gmailMessages = d.messages;
        }
      } catch {}
    }

    setIsDemo(!gmailMessages);

    try {
      const body = gmailMessages
        ? JSON.stringify({ gmailContext: gmailMessages })
        : JSON.stringify({});
      const r = await fetch("/api/analisis/data", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body,
      });
      if (!r.ok) throw new Error();
      const d: AnalisisData = await r.json();
      setData(d);
      setState("done");
    } catch {
      setState("error");
    }
  }, [session?.accessToken]);

  useEffect(() => { load(); }, [load]);

  const maxMonto = data?.gastosPorCategoria?.length
    ? Math.max(...data.gastosPorCategoria.map(c => c.monto))
    : 1;

  const maxMes = data?.gastosPorMes?.length
    ? Math.max(...data.gastosPorMes.map(m => m.total))
    : 1;

  const tendenciaIcon = data?.tendencia === "subiendo"
    ? { arrow: "↑", color: "#ef4444" }
    : data?.tendencia === "bajando"
      ? { arrow: "↓", color: "#10b981" }
      : { arrow: "→", color: "#f59e0b" };

  const varColor = (data?.variacionVsMesAnterior ?? 0) > 0 ? "#ef4444" : "#10b981";
  const varSign = (data?.variacionVsMesAnterior ?? 0) > 0 ? "+" : "";

  return (
    <div className="page">
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 3 }}>
        <div style={{ fontFamily: "var(--font-geist-sans), sans-serif", fontSize: 21 }}>
          Análisis financiero
        </div>
        {state === "done" && (
          <button
            onClick={load}
            style={{ fontSize: 12, color: "var(--text3)", background: "none", border: "1px solid var(--border)", borderRadius: 8, padding: "4px 10px", cursor: "pointer" }}
          >
            Actualizar
          </button>
        )}
      </div>
      <div style={{ fontSize: 12, color: "var(--text2)", marginBottom: isDemo ? 8 : 18 }}>
        {state === "loading" ? "Analizando tus finanzas..." : "Basado en tus correos bancarios"}
      </div>

      {isDemo && state === "done" && (
        <div style={{ fontSize: 11, color: "var(--text3)", background: "var(--bg3)", border: "1px solid var(--border)", borderRadius: 8, padding: "7px 12px", marginBottom: 16, display: "flex", alignItems: "center", gap: 6 }}>
          <span style={{ opacity: 0.7 }}>ℹ</span>
          Datos de ejemplo — conecta Gmail para ver tu análisis real
        </div>
      )}

      {/* ── CATEGORÍAS ── */}
      <div className="section-title">Gasto por categoría</div>

      {state === "loading" && (
        <div style={{ marginBottom: 18 }}>
          {[1,2,3,4,5].map(i => <SkeletonBar key={i} />)}
        </div>
      )}

      {state === "done" && data && (
        <div style={{ display: "flex", flexDirection: "column", gap: 8, marginBottom: 18 }}>
          {data.gastosPorCategoria.map((c, i) => (
            <div key={i} style={{ display: "flex", alignItems: "center", gap: 10 }}>
              <span style={{ width: 110, fontSize: 12, color: "var(--text2)", flexShrink: 0, textAlign: "right" }}>
                {c.categoria}
              </span>
              <div style={{ flex: 1, height: 7, borderRadius: 3, background: "var(--bg3)", overflow: "hidden" }}>
                <div style={{
                  width: `${(c.monto / maxMonto) * 100}%`,
                  height: "100%",
                  background: c.color || "var(--accent)",
                  borderRadius: 3,
                  transition: "width 0.6s ease",
                }} />
              </div>
              <span style={{ fontSize: 12, color: "var(--text)", width: 70, textAlign: "right", flexShrink: 0 }}>
                {fmt(c.monto)}
              </span>
              <span style={{ fontSize: 11, color: "var(--text3)", width: 34, textAlign: "right", flexShrink: 0 }}>
                {Math.round(c.porcentaje)}%
              </span>
            </div>
          ))}
        </div>
      )}

      {/* ── TENDENCIA MENSUAL ── */}
      <div className="section-title">Tendencia mensual</div>

      {state === "loading" && (
        <div style={{ display: "flex", alignItems: "flex-end", gap: 8, height: 100, marginBottom: 18 }}>
          {[58, 70, 50, 65, 80].map((h, i) => (
            <div key={i} style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", gap: 3 }}>
              <div style={{ width: "100%", height: h, borderRadius: "3px 3px 0 0", background: "var(--bg3)", animation: "skPulse 1.4s ease infinite" }} />
              <div style={{ width: 20, height: 8, borderRadius: 3, background: "var(--bg3)", animation: "skPulse 1.4s ease infinite" }} />
            </div>
          ))}
        </div>
      )}

      {state === "done" && data && data.gastosPorMes.length > 0 && (
        <div style={{ position: "relative", marginBottom: 18, minHeight: userPlan === "free" ? 210 : undefined }}>
          <div style={{
            display: "flex", alignItems: "flex-end", gap: 8, height: 100,
            ...(userPlan === "free" ? { filter: "blur(3px)", opacity: 0.5, pointerEvents: "none", userSelect: "none" } : null),
          }}>
            {data.gastosPorMes.map((m, i) => {
              const isLast = i === data.gastosPorMes.length - 1;
              const h = Math.max(12, Math.round((m.total / maxMes) * 80));
              return (
                <div key={i} style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", gap: 3 }}>
                  <span style={{ fontSize: 9, color: isLast ? "var(--warn)" : "var(--text3)" }}>
                    {fmt(m.total)}
                  </span>
                  <div style={{
                    width: "100%", height: h,
                    background: isLast ? "rgba(245,193,102,0.15)" : "var(--bg3)",
                    border: isLast ? "1px solid rgba(245,193,102,0.4)" : "1px solid var(--border)",
                    borderRadius: "3px 3px 0 0",
                  }} />
                  <span style={{ fontSize: 9, color: isLast ? "var(--warn)" : "var(--text3)" }}>
                    {m.mes}{isLast ? "▲" : ""}
                  </span>
                </div>
              );
            })}
          </div>

          {userPlan === "free" && (
            <div style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center", padding: 12 }}>
              <PaywallBlock
                eyebrow="Disponible en Pro"
                title="Ver los últimos 12 meses"
                ctaLabel="Desbloquear con Pro →"
                onUpgrade={openUpgrade}
                style={{ background: "var(--bg)", boxShadow: "0 8px 28px rgba(15,23,42,0.12)", maxWidth: 360 }}
              />
            </div>
          )}
        </div>
      )}

      {/* ── CARDS KPI ── */}
      {state === "loading" && (
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))", gap: 10, marginBottom: 14 }}>
          {[1,2,3].map(i => <SkeletonCard key={i} />)}
        </div>
      )}

      {state === "done" && data && (
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(170px, 1fr))", gap: 10, marginBottom: 14 }}>
          {/* Total mes actual */}
          <div className="data-card">
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 10 }}>
              <span style={{ fontSize: 12, fontWeight: 500, color: "var(--text)" }}>Total este mes</span>
              <span style={{ fontSize: 11, color: varColor, fontWeight: 600 }}>
                {varSign}{Math.round(data.variacionVsMesAnterior)}%
              </span>
            </div>
            <div style={{ fontSize: 22, fontFamily: "var(--font-geist-sans), sans-serif", marginBottom: 3, color: "var(--text)" }}>
              {fmt(data.totalMesActual)}
            </div>
            <div style={{ fontSize: 10, color: "var(--text3)" }}>vs mes anterior</div>
          </div>

          {/* Promedio mensual */}
          <div className="data-card">
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 10 }}>
              <span style={{ fontSize: 12, fontWeight: 500, color: "var(--text)" }}>Promedio mensual</span>
            </div>
            <div style={{ fontSize: 22, fontFamily: "var(--font-geist-sans), sans-serif", marginBottom: 3, color: "var(--text)" }}>
              {fmt(data.promedioMensual)}
            </div>
            <div style={{ fontSize: 10, color: "var(--text3)" }}>últimos meses</div>
          </div>

          {/* Tendencia */}
          <div className="data-card">
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 10 }}>
              <span style={{ fontSize: 12, fontWeight: 500, color: "var(--text)" }}>Tendencia</span>
              <span style={{ fontSize: 18, color: tendenciaIcon.color, lineHeight: 1 }}>{tendenciaIcon.arrow}</span>
            </div>
            <div style={{ fontSize: 22, fontFamily: "var(--font-geist-sans), sans-serif", marginBottom: 3, color: tendenciaIcon.color, textTransform: "capitalize" }}>
              {data.tendencia}
            </div>
            <div style={{ fontSize: 10, color: "var(--text3)" }}>vs mes anterior</div>
          </div>

          {/* Top comercio */}
          {data.topComercio && (
            <div className="data-card">
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 10 }}>
                <span style={{ fontSize: 12, fontWeight: 500, color: "var(--text)" }}>Top comercio</span>
                <span style={{ fontSize: 10, color: "var(--text3)" }}>{data.topComercio.visitas} visitas</span>
              </div>
              <div style={{ fontSize: 15, fontFamily: "var(--font-geist-sans), sans-serif", marginBottom: 3, color: "var(--text)", fontWeight: 500 }}>
                {data.topComercio.nombre}
              </div>
              <div style={{ fontSize: 10, color: "var(--text3)" }}>{fmt(data.topComercio.monto)} gastados</div>
            </div>
          )}
        </div>
      )}

      {state === "error" && (
        <div style={{ textAlign: "center", padding: "40px 20px", color: "var(--text3)" }}>
          <div style={{ fontSize: 32, marginBottom: 8 }}>⚠</div>
          <div style={{ fontSize: 14, marginBottom: 12 }}>No se pudo cargar el análisis</div>
          <button onClick={load} style={{ fontSize: 13, color: "var(--text2)", background: "none", border: "1px solid var(--border)", borderRadius: 8, padding: "6px 16px", cursor: "pointer" }}>
            Reintentar
          </button>
        </div>
      )}

      <style>{`
        @keyframes skPulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.4; }
        }
      `}</style>
    </div>
  );
}
