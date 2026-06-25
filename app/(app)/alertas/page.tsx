"use client";

import { useCallback, useEffect, useState } from "react";
import { useSession } from "next-auth/react";

interface GmailMessage { from: string; subject: string; date: string; snippet?: string; }

interface Alerta {
  tipo: "URGENTE" | "IMPORTANTE" | "INFORMATIVO";
  titulo: string;
  mensaje: string;
  accion: string | null;
  monto: number;
  fecha: string | null;
}

interface AlertasResult {
  alertas: Alerta[];
  resumen: string;
}

type LoadState = "idle" | "loading" | "done" | "error";

const TIPO_ORDER = { URGENTE: 0, IMPORTANTE: 1, INFORMATIVO: 2 };

const TIPO_STYLE: Record<string, { border: string; bg: string; iconColor: string }> = {
  URGENTE:     { border: "#ef4444", bg: "rgba(239,68,68,0.05)",   iconColor: "#ef4444" },
  IMPORTANTE:  { border: "#f59e0b", bg: "rgba(245,158,11,0.05)",  iconColor: "#f59e0b" },
  INFORMATIVO: { border: "#3b82f6", bg: "rgba(59,130,246,0.05)",  iconColor: "#3b82f6" },
};

function TipoIcon({ tipo, size = 14 }: { tipo: string; size?: number }) {
  const color = TIPO_STYLE[tipo]?.iconColor ?? "var(--text3)";
  const s = { stroke: color, fill: "none", strokeWidth: 2, strokeLinecap: "round" as const, strokeLinejoin: "round" as const };
  if (tipo === "URGENTE") return (
    <svg width={size} height={size} viewBox="0 0 24 24" {...s}>
      <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/>
      <line x1="12" y1="9" x2="12" y2="13"/>
      <line x1="12" y1="17" x2="12.01" y2="17"/>
    </svg>
  );
  if (tipo === "IMPORTANTE") return (
    <svg width={size} height={size} viewBox="0 0 24 24" {...s}>
      <circle cx="12" cy="12" r="10"/>
      <line x1="12" y1="8" x2="12" y2="12"/>
      <line x1="12" y1="16" x2="12.01" y2="16"/>
    </svg>
  );
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" {...s}>
      <circle cx="12" cy="12" r="10"/>
      <line x1="12" y1="16" x2="12" y2="12"/>
      <line x1="12" y1="8" x2="12.01" y2="8"/>
    </svg>
  );
}

function AlertaCard({ alerta }: { alerta: Alerta }) {
  const st = TIPO_STYLE[alerta.tipo] ?? TIPO_STYLE.INFORMATIVO;
  return (
    <div style={{
      background: st.bg,
      borderRadius: 10,
      borderLeft: `3px solid ${st.border}`,
      borderTop: `1px solid ${st.border}33`,
      borderRight: `1px solid ${st.border}33`,
      borderBottom: `1px solid ${st.border}33`,
      padding: "14px 16px",
      display: "flex",
      flexDirection: "column",
      gap: 4,
    }}>
      <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
        <TipoIcon tipo={alerta.tipo} />
        <span style={{ fontSize: 13, fontWeight: 600, color: "var(--text)" }}>{alerta.titulo}</span>
        {alerta.monto > 0 && (
          <span style={{ marginLeft: "auto", fontSize: 12, fontWeight: 600, color: st.iconColor, background: `${st.border}18`, border: `1px solid ${st.border}33`, borderRadius: 20, padding: "2px 8px", flexShrink: 0 }}>
            ${alerta.monto.toLocaleString("es-MX")}
          </span>
        )}
      </div>
      <div style={{ fontSize: 12, color: "var(--text2)", lineHeight: 1.5 }}>{alerta.mensaje}</div>
      {alerta.accion && (
        <div style={{ fontSize: 11, color: st.iconColor, display: "flex", alignItems: "center", gap: 4, marginTop: 2 }}>
          <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/>
          </svg>
          {alerta.accion}
        </div>
      )}
      {alerta.fecha && (
        <div style={{ fontSize: 10, color: "var(--text3)", marginTop: 1 }}>{alerta.fecha}</div>
      )}
    </div>
  );
}

function timeAgo(ts: number) {
  const diff = Math.floor((Date.now() - ts) / 1000);
  if (diff < 60) return "hace un momento";
  if (diff < 3600) return `hace ${Math.floor(diff / 60)} min`;
  return `hace ${Math.floor(diff / 3600)} h`;
}

export default function AlertasPage() {
  const { data: session } = useSession();
  const [state, setState] = useState<LoadState>("idle");
  const [result, setResult] = useState<AlertasResult | null>(null);
  const [lastTs, setLastTs] = useState<number | null>(null);
  const [isDemo, setIsDemo] = useState(false);
  const [, setTick] = useState(0);

  // Re-render every 30s to update "hace X min"
  useEffect(() => {
    const id = setInterval(() => setTick(t => t + 1), 30000);
    return () => clearInterval(id);
  }, []);

  const run = useCallback(async () => {
    setState("loading");
    setResult(null);

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
      const r = await fetch("/api/agentes/alertas", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body,
      });
      if (!r.ok) throw new Error();
      const d: AlertasResult = await r.json();

      // Sort alertas by urgency
      const sorted = [...(d.alertas ?? [])].sort(
        (a, b) => (TIPO_ORDER[a.tipo] ?? 3) - (TIPO_ORDER[b.tipo] ?? 3)
      );
      const finalResult = { ...d, alertas: sorted };
      setResult(finalResult);
      setState("done");
      setLastTs(Date.now());

      // Update sidebar badge
      const urgentes   = sorted.filter(a => a.tipo === "URGENTE").length;
      const importantes = sorted.filter(a => a.tipo === "IMPORTANTE").length;
      const count = urgentes + importantes;
      const level = urgentes > 0 ? "urgent" : importantes > 0 ? "important" : "info";
      localStorage.setItem("neto_alert_count", JSON.stringify({ count, level: count > 0 ? level : null }));
      window.dispatchEvent(new Event("neto-alertas-update"));
    } catch {
      setState("error");
    }
  }, [session?.accessToken]);

  useEffect(() => { run(); }, [run]);

  const urgentes    = result?.alertas.filter(a => a.tipo === "URGENTE") ?? [];
  const importantes  = result?.alertas.filter(a => a.tipo === "IMPORTANTE") ?? [];
  const informativas = result?.alertas.filter(a => a.tipo === "INFORMATIVO") ?? [];

  return (
    <div className="page">
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 3 }}>
        <div style={{ fontFamily: "var(--font-geist-sans), sans-serif", fontSize: 21 }}>Alertas</div>
        {state === "done" && (
          <button
            onClick={run}
            style={{ fontSize: 12, color: "var(--text3)", background: "none", border: "1px solid var(--border)", borderRadius: 8, padding: "4px 10px", cursor: "pointer", display: "flex", alignItems: "center", gap: 5 }}
          >
            <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="23 4 23 10 17 10"/><path d="M20.49 15a9 9 0 1 1-2.12-9.36L23 10"/>
            </svg>
            Actualizar
          </button>
        )}
      </div>

      {state === "loading" && (
        <div style={{ fontSize: 12, color: "var(--text3)", marginBottom: 18, display: "flex", alignItems: "center", gap: 6 }}>
          <svg style={{ animation: "spin 1s linear infinite" }} width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
            <path d="M21 12a9 9 0 1 1-6.219-8.56"/>
          </svg>
          AlertasAgent escaneando tus finanzas...
        </div>
      )}

      {state === "done" && result && (
        <div style={{ fontSize: 12, color: "var(--text2)", marginBottom: isDemo ? 8 : 18, display: "flex", alignItems: "center", gap: 8 }}>
          <span style={{
            display: "inline-flex", alignItems: "center", justifyContent: "center",
            width: 20, height: 20, borderRadius: "50%", background: "var(--accent)", color: "#000",
            fontSize: 11, fontWeight: 700, flexShrink: 0,
          }}>
            {result.alertas.length}
          </span>
          alertas detectadas
          {lastTs && (
            <span style={{ color: "var(--text3)", fontSize: 11 }}>· Actualizado {timeAgo(lastTs)}</span>
          )}
        </div>
      )}

      {state === "error" && (
        <div style={{ fontSize: 12, color: "var(--text3)", marginBottom: 18 }}>No se pudo obtener alertas</div>
      )}

      {isDemo && state === "done" && (
        <div style={{ fontSize: 11, color: "var(--text3)", background: "var(--bg3)", border: "1px solid var(--border)", borderRadius: 8, padding: "7px 12px", marginBottom: 16, display: "flex", alignItems: "center", gap: 6 }}>
          <span style={{ opacity: 0.7 }}>ℹ</span>
          Conecta Gmail para alertas personalizadas basadas en tus movimientos reales
        </div>
      )}

      {state === "done" && result && (
        <>
          {result.resumen && (
            <div style={{ fontSize: 12, color: "var(--text2)", background: "var(--bg3)", border: "1px solid var(--border)", borderRadius: 8, padding: "8px 12px", marginBottom: 20, lineHeight: 1.5 }}>
              {result.resumen}
            </div>
          )}

          {urgentes.length > 0 && (
            <>
              <div className="section-title">Urgentes</div>
              <div style={{ display: "flex", flexDirection: "column", gap: 8, marginBottom: 18 }}>
                {urgentes.map((a, i) => <AlertaCard key={i} alerta={a} />)}
              </div>
            </>
          )}

          {importantes.length > 0 && (
            <>
              <div className="section-title">Importantes</div>
              <div style={{ display: "flex", flexDirection: "column", gap: 8, marginBottom: 18 }}>
                {importantes.map((a, i) => <AlertaCard key={i} alerta={a} />)}
              </div>
            </>
          )}

          {informativas.length > 0 && (
            <>
              <div className="section-title">Informativas</div>
              <div style={{ display: "flex", flexDirection: "column", gap: 8, marginBottom: 18 }}>
                {informativas.map((a, i) => <AlertaCard key={i} alerta={a} />)}
              </div>
            </>
          )}

          {result.alertas.length === 0 && (
            <div style={{ textAlign: "center", padding: "40px 20px", color: "var(--text3)" }}>
              <div style={{ fontSize: 32, marginBottom: 8 }}>✓</div>
              <div style={{ fontSize: 14 }}>Sin alertas activas</div>
            </div>
          )}
        </>
      )}

      {state === "error" && (
        <div style={{ textAlign: "center", padding: "40px 20px", color: "var(--text3)" }}>
          <div style={{ fontSize: 32, marginBottom: 8 }}>⚠</div>
          <div style={{ fontSize: 14, marginBottom: 12 }}>No se pudo obtener alertas</div>
          <button onClick={run} style={{ fontSize: 13, color: "var(--text2)", background: "none", border: "1px solid var(--border)", borderRadius: 8, padding: "6px 16px", cursor: "pointer" }}>
            Reintentar
          </button>
        </div>
      )}

      <style>{`
        @keyframes spin { to { transform: rotate(360deg); } }
      `}</style>
    </div>
  );
}
