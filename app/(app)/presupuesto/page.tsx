"use client";

import { useCallback, useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import {
  THRESHOLD_LEVELS, type Threshold, type Thresholds, type Budget,
  loadBudget, saveBudget, loadThresholds, saveThresholds,
  publishBudgetState, demoSpent, colorForPct, formatMXN, NOTIFIED_KEY,
} from "@/lib/budget";
import {
  getNotificationPermission, requestNotificationPermission, sendNotification,
  type PermissionState,
} from "@/lib/notifications";

interface GmailMessage { from: string; subject: string; date: string; snippet?: string; }

const PRESET_CATEGORIES = ["Restaurantes", "Transporte", "Supermercado", "Suscripciones", "Entretenimiento"];

/* ── Toggle switch ── */
function Toggle({ on, onChange }: { on: boolean; onChange: () => void }) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={on}
      onClick={onChange}
      style={{
        width: 42, height: 24, borderRadius: 12, flexShrink: 0, cursor: "pointer",
        border: "1px solid var(--border)",
        background: on ? "var(--accent)" : "var(--bg3)",
        position: "relative", transition: "background 0.2s ease",
        padding: 0,
      }}
    >
      <span style={{
        position: "absolute", top: 2, left: on ? 20 : 2,
        width: 18, height: 18, borderRadius: "50%", background: "#fff",
        boxShadow: "0 1px 3px rgba(0,0,0,0.25)", transition: "left 0.2s ease",
      }} />
    </button>
  );
}

const THRESHOLD_LABELS: Record<number, string> = {
  20: "Has gastado el 20% de tu presupuesto",
  50: "Vas a la mitad de tu presupuesto",
  80: "Te queda el 20% de tu presupuesto",
  100: "Alcanzaste tu límite mensual",
};

export default function PresupuestoPage() {
  const { data: session } = useSession();

  const [monthly, setMonthly] = useState("");
  const [cats, setCats] = useState<Record<string, string>>({});
  const [thresholds, setThresholds] = useState<Thresholds>({});
  const [spent, setSpent] = useState<number | null>(null);
  const [isDemo, setIsDemo] = useState(false);
  const [savedFlash, setSavedFlash] = useState(false);
  const [permission, setPermission] = useState<PermissionState>("default");

  const monthlyNum = Number(monthly) || 0;
  const pct = monthlyNum > 0 && spent !== null ? (spent / monthlyNum) * 100 : 0;

  /* ── Evalúa umbrales cruzados y notifica (dedupe por mes) ── */
  const checkAndNotify = useCallback((monthlyVal: number, spentVal: number, th: Thresholds) => {
    publishBudgetState(monthlyVal, spentVal);
    if (monthlyVal <= 0 || getNotificationPermission() !== "granted") return;

    const p = (spentVal / monthlyVal) * 100;
    let notified: number[] = [];
    try { notified = JSON.parse(localStorage.getItem(NOTIFIED_KEY()) ?? "[]"); } catch {}

    const restante = Math.max(monthlyVal - spentVal, 0);
    for (const level of THRESHOLD_LEVELS) {
      if (th[String(level)] && p >= level && !notified.includes(level)) {
        const msg =
          level === 20 ? `Has gastado el 20% de tu presupuesto mensual (${formatMXN(spentVal)} de ${formatMXN(monthlyVal)})`
          : level === 50 ? `Vas a la mitad de tu presupuesto. Has gastado ${formatMXN(spentVal)} de ${formatMXN(monthlyVal)}`
          : level === 80 ? `Atención: has gastado el 80% de tu presupuesto. Te quedan ${formatMXN(restante)}`
          : `Alcanzaste tu límite de presupuesto mensual de ${formatMXN(monthlyVal)}`;
        sendNotification("Neto · Presupuesto", msg);
        notified.push(level);
      }
    }
    try { localStorage.setItem(NOTIFIED_KEY(), JSON.stringify(notified)); } catch {}
  }, []);

  /* ── Carga el gasto actual (Gmail vía análisis, o datos de ejemplo) ── */
  const loadSpent = useCallback(async (th: Thresholds, monthlyVal: number) => {
    if (!session?.accessToken) {
      const s = demoSpent();
      setSpent(s); setIsDemo(true);
      checkAndNotify(monthlyVal, s, th);
      return;
    }
    try {
      let gmailMessages: GmailMessage[] | null = null;
      const r = await fetch("/api/gmail/messages");
      if (r.ok) {
        const d = await r.json();
        if (d?.messages?.length) gmailMessages = d.messages;
      }
      const body = gmailMessages ? JSON.stringify({ gmailContext: gmailMessages }) : JSON.stringify({});
      const res = await fetch("/api/analisis/data", {
        method: "POST", headers: { "Content-Type": "application/json" }, body,
      });
      const data = await res.json();
      const s = typeof data.totalMesActual === "number" && data.totalMesActual > 0
        ? data.totalMesActual : demoSpent();
      setSpent(s); setIsDemo(!gmailMessages);
      checkAndNotify(monthlyVal, s, th);
    } catch {
      const s = demoSpent();
      setSpent(s); setIsDemo(true);
      checkAndNotify(monthlyVal, s, th);
    }
  }, [session?.accessToken, checkAndNotify]);

  /* ── Init ── */
  useEffect(() => {
    const b = loadBudget();
    const th = loadThresholds();
    setThresholds(th);
    if (b) {
      setMonthly(String(b.monthly || ""));
      const cmap: Record<string, string> = {};
      b.categories.forEach(c => { cmap[c.name] = String(c.amount); });
      setCats(cmap);
    }
    setPermission(getNotificationPermission());
    loadSpent(th, b?.monthly ?? 0);
  }, [loadSpent]);

  function handleSave() {
    const budget: Budget = {
      monthly: monthlyNum,
      categories: PRESET_CATEGORIES
        .map(name => ({ name, amount: Number(cats[name]) || 0 }))
        .filter(c => c.amount > 0),
    };
    saveBudget(budget);
    setSavedFlash(true);
    setTimeout(() => setSavedFlash(false), 2000);
    if (spent !== null) checkAndNotify(budget.monthly, spent, thresholds);
  }

  function toggleThreshold(level: Threshold) {
    setThresholds(prev => {
      const next = { ...prev, [String(level)]: !prev[String(level)] };
      saveThresholds(next);
      if (spent !== null) checkAndNotify(monthlyNum, spent, next);
      return next;
    });
  }

  async function enableNotifications() {
    const res = await requestNotificationPermission();
    setPermission(res);
    if (res === "granted" && spent !== null) {
      checkAndNotify(monthlyNum, spent, thresholds);
    }
  }

  const barColor = colorForPct(pct);
  const configured = monthlyNum > 0;

  return (
    <div className="page">
      <div style={{ fontFamily: "var(--font-geist-sans), sans-serif", fontSize: 21, marginBottom: 3 }}>
        Presupuesto
      </div>
      <div style={{ fontSize: 12, color: "var(--text2)", marginBottom: 20 }}>
        Define tu presupuesto mensual y recibe alertas cuando te acerques a tu límite.
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: 14, maxWidth: 640 }}>

        {/* ── BARRA DE PROGRESO ── */}
        {configured && spent !== null && (
          <div style={{ background: "var(--card)", border: "1px solid var(--border)", borderRadius: 12, padding: "20px 22px" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", marginBottom: 12, flexWrap: "wrap", gap: 6 }}>
              <div>
                <span style={{ fontSize: 22, fontWeight: 600, color: "var(--text)", letterSpacing: "-0.02em" }}>{formatMXN(spent)}</span>
                <span style={{ fontSize: 14, color: "var(--text3)" }}> de {formatMXN(monthlyNum)}</span>
              </div>
              <span style={{ fontSize: 15, fontWeight: 600, color: barColor }}>{Math.round(pct)}%</span>
            </div>

            {/* track + fill + markers */}
            <div style={{ position: "relative", height: 12, borderRadius: 6, background: "var(--bg3)", overflow: "hidden" }}>
              <div style={{
                width: `${Math.min(pct, 100)}%`, height: "100%", background: barColor,
                borderRadius: 6, transition: "width 0.6s ease, background 0.3s ease",
              }} />
            </div>
            {/* threshold markers */}
            <div style={{ position: "relative", height: 16, marginTop: 4 }}>
              {THRESHOLD_LEVELS.map(level => (
                <div key={level} style={{ position: "absolute", left: `${level}%`, transform: "translateX(-50%)", textAlign: "center" }}>
                  <div style={{
                    width: 2, height: 6, margin: "0 auto",
                    background: thresholds[String(level)] ? barColor : "var(--border2)",
                    opacity: thresholds[String(level)] ? 1 : 0.5,
                  }} />
                  <span style={{ fontSize: 9, color: thresholds[String(level)] ? "var(--text2)" : "var(--text3)", fontWeight: thresholds[String(level)] ? 600 : 400 }}>
                    {level}%
                  </span>
                </div>
              ))}
            </div>

            {pct >= 100 ? (
              <div style={{ fontSize: 12, color: "#ef4444", marginTop: 10, fontWeight: 500 }}>
                Superaste tu presupuesto por {formatMXN(spent - monthlyNum)}.
              </div>
            ) : (
              <div style={{ fontSize: 12, color: "var(--text3)", marginTop: 10 }}>
                Te quedan {formatMXN(monthlyNum - spent)} este mes.
              </div>
            )}
            {isDemo && (
              <div style={{ fontSize: 11, color: "var(--text3)", marginTop: 8, opacity: 0.8 }}>
                ℹ Gasto basado en datos de ejemplo. Conecta Gmail para usar tus movimientos reales.
              </div>
            )}
          </div>
        )}

        {/* ── ENTRADA DE PRESUPUESTO ── */}
        <div style={{ background: "var(--card)", border: "1px solid var(--border)", borderRadius: 12, padding: "20px 22px" }}>
          <div style={{ fontSize: 15, fontWeight: 600, color: "var(--text)", marginBottom: 16 }}>Tu presupuesto</div>

          <label style={{ display: "block", fontSize: 13, color: "var(--text2)", marginBottom: 6 }}>Presupuesto mensual (MXN)</label>
          <div style={{ position: "relative", marginBottom: 18 }}>
            <span style={{ position: "absolute", left: 12, top: "50%", transform: "translateY(-50%)", color: "var(--text3)", fontSize: 14 }}>$</span>
            <input
              type="number" inputMode="numeric" min={0}
              value={monthly}
              onChange={e => setMonthly(e.target.value)}
              placeholder="20,000"
              style={{
                width: "100%", padding: "10px 12px 10px 24px", fontSize: 14,
                background: "var(--bg3)", border: "1px solid var(--border)", borderRadius: 12,
                color: "var(--text)", fontFamily: "inherit", outline: "none",
              }}
            />
          </div>

          <div style={{ fontSize: 12, color: "var(--text3)", marginBottom: 10 }}>Por categoría (opcional)</div>
          <div style={{ display: "flex", flexDirection: "column", gap: 8, marginBottom: 18 }}>
            {PRESET_CATEGORIES.map(name => (
              <div key={name} style={{ display: "flex", alignItems: "center", gap: 10 }}>
                <span style={{ fontSize: 13, color: "var(--text2)", flex: 1 }}>{name}</span>
                <div style={{ position: "relative", width: 130 }}>
                  <span style={{ position: "absolute", left: 10, top: "50%", transform: "translateY(-50%)", color: "var(--text3)", fontSize: 13 }}>$</span>
                  <input
                    type="number" inputMode="numeric" min={0}
                    value={cats[name] ?? ""}
                    onChange={e => setCats(prev => ({ ...prev, [name]: e.target.value }))}
                    placeholder="0"
                    style={{
                      width: "100%", padding: "7px 10px 7px 20px", fontSize: 13,
                      background: "var(--bg3)", border: "1px solid var(--border)", borderRadius: 12,
                      color: "var(--text)", fontFamily: "inherit", outline: "none",
                    }}
                  />
                </div>
              </div>
            ))}
          </div>

          <button
            onClick={handleSave}
            className="land-btn-primary"
            style={{ padding: "10px 20px", fontSize: 14 }}
          >
            {savedFlash ? "✓ Guardado" : "Guardar presupuesto"}
          </button>
        </div>

        {/* ── ALERTAS CONFIGURABLES ── */}
        <div style={{ background: "var(--card)", border: "1px solid var(--border)", borderRadius: 12, padding: "20px 22px" }}>
          <div style={{ fontSize: 15, fontWeight: 600, color: "var(--text)", marginBottom: 4 }}>Alertas</div>
          <div style={{ fontSize: 12, color: "var(--text3)", marginBottom: 16 }}>
            Elige en qué porcentajes quieres que Neto te avise.
          </div>
          <div style={{ display: "flex", flexDirection: "column" }}>
            {THRESHOLD_LEVELS.map((level, i) => (
              <div key={level} style={{
                display: "flex", alignItems: "center", justifyContent: "space-between", gap: 12,
                padding: "12px 0", borderTop: i === 0 ? "none" : "1px solid var(--border)",
              }}>
                <div>
                  <div style={{ fontSize: 14, fontWeight: 500, color: "var(--text)" }}>{level}% del presupuesto</div>
                  <div style={{ fontSize: 12, color: "var(--text3)" }}>{THRESHOLD_LABELS[level]}</div>
                </div>
                <Toggle on={!!thresholds[String(level)]} onChange={() => toggleThreshold(level)} />
              </div>
            ))}
          </div>
        </div>

        {/* ── NOTIFICACIONES ── */}
        <div style={{ background: "var(--card)", border: "1px solid var(--border)", borderRadius: 12, padding: "20px 22px" }}>
          <div style={{ fontSize: 15, fontWeight: 600, color: "var(--text)", marginBottom: 4 }}>Notificaciones</div>
          <div style={{ fontSize: 12, color: "var(--text3)", marginBottom: 16, lineHeight: 1.6 }}>
            Recibirás una notificación push del navegador cuando alcances los umbrales que activaste.
            En el celular funcionan si instalas Neto como app (PWA) o la tienes abierta.
          </div>

          {permission === "granted" ? (
            <div style={{ display: "inline-flex", alignItems: "center", gap: 8, fontSize: 13, color: "#16a34a", background: "rgba(22,163,74,0.08)", border: "1px solid rgba(22,163,74,0.25)", borderRadius: 8, padding: "8px 14px" }}>
              <span style={{ width: 7, height: 7, borderRadius: "50%", background: "#16a34a" }} />
              Notificaciones activadas
            </div>
          ) : permission === "unsupported" ? (
            <div style={{ fontSize: 13, color: "var(--text3)" }}>
              Tu navegador no soporta notificaciones push.
            </div>
          ) : permission === "denied" ? (
            <div style={{ fontSize: 13, color: "var(--warn)" }}>
              Notificaciones bloqueadas. Actívalas desde la configuración de tu navegador para este sitio.
            </div>
          ) : (
            <button
              onClick={enableNotifications}
              className="land-btn-primary"
              style={{ padding: "10px 20px", fontSize: 14 }}
            >
              Activar notificaciones
            </button>
          )}
        </div>

      </div>
    </div>
  );
}
