"use client";

import { useEffect, useRef, useState } from "react";

const MSGS = [
  { role: "user" as const, text: "¿Cuánto gasté en restaurantes este mes?" },
  { role: "neto" as const, text: "Gastaste $4,230 en restaurantes, 23% más que abril. Top: Tacos El Franc $890, Starbucks $640, Uber Eats $1,200." },
  { role: "user" as const, text: "¿Y en suscripciones?" },
  { role: "neto" as const, text: "7 suscripciones activas por $1,094/mes: Netflix $229, Spotify $99, ChatGPT $249 y 4 más." },
];

const SPEED = 18;
const BETWEEN = 500;
const LOOP_PAUSE = 4000;

function sleep(ms: number) { return new Promise<void>(r => setTimeout(r, ms)); }

const NAV_ITEMS = [
  { icon: "💬", label: "Chat" },
  { icon: "📊", label: "Gastos" },
  { icon: "💳", label: "Tarjetas" },
  { icon: "🔔", label: "Alertas" },
];

const KPIS = [
  { val: "$42,380", label: "Saldo",   color: "var(--accent)" },
  { val: "$18,640", label: "Deuda",   color: "var(--danger)" },
  { val: "$23,450", label: "Gastado", color: "var(--warn)" },
];

export default function AppMockup() {
  const [slots, setSlots] = useState<(string | null)[]>([null, null, null, null]);
  const stoppedRef = useRef(false);
  const msgRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = msgRef.current;
    if (el) el.scrollTop = el.scrollHeight;
  }, [slots]);

  useEffect(() => {
    stoppedRef.current = false;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setSlots(MSGS.map(m => m.text));
      return;
    }
    async function animate() {
      while (!stoppedRef.current) {
        setSlots([null, null, null, null]);
        await sleep(400);
        for (let i = 0; i < MSGS.length; i++) {
          if (stoppedRef.current) return;
          const text = MSGS[i].text;
          for (let c = 1; c <= text.length; c++) {
            if (stoppedRef.current) return;
            setSlots(prev => { const n = [...prev]; n[i] = text.slice(0, c); return n; });
            await sleep(SPEED);
          }
          await sleep(BETWEEN);
        }
        await sleep(LOOP_PAUSE);
      }
    }
    animate();
    return () => { stoppedRef.current = true; };
  }, []);

  return (
    <div style={{ marginTop: 64 }}>
      {/* Live badge */}
      <div style={{ display: "flex", justifyContent: "center", marginBottom: 16 }}>
        <div style={{
          display: "inline-flex", alignItems: "center", gap: 7,
          background: "rgba(184,245,102,0.08)", border: "1px solid rgba(184,245,102,0.22)",
          borderRadius: 100, padding: "5px 14px",
        }}>
          <span className="live-dot" style={{ width: 7, height: 7, borderRadius: "50%", background: "var(--accent)", display: "block" }} />
          <span style={{ fontSize: 12, color: "var(--accent2)", fontWeight: 500 }}>Demo en vivo</span>
        </div>
      </div>

      {/* App window */}
      <div style={{
        maxWidth: 720, margin: "0 auto",
        background: "#0d0f0e",
        border: "1px solid rgba(184,245,102,0.12)",
        borderRadius: 12,
        boxShadow: "0 0 0 1px rgba(255,255,255,0.04), 0 32px 80px rgba(0,0,0,0.6), 0 0 120px rgba(184,245,102,0.06)",
        overflow: "hidden",
        height: 440,
        display: "flex", flexDirection: "column",
      }}>
        {/* Topbar */}
        <div style={{
          display: "flex", alignItems: "center", justifyContent: "space-between",
          padding: "0 16px", height: 48, flexShrink: 0,
          background: "#0a0a0a", borderBottom: "1px solid rgba(255,255,255,0.06)",
        }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <div style={{ width: 22, height: 22, background: "var(--accent)", borderRadius: 6, display: "flex", alignItems: "center", justifyContent: "center" }}>
              <svg width="10" height="10" viewBox="0 0 16 16" fill="none" stroke="#0d0f0e" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="1,11 4,6 7,9 11,3 15,5"/>
              </svg>
            </div>
            <span style={{ fontSize: 14, fontWeight: 500, letterSpacing: "-0.01em", color: "#fff" }}>Neto</span>
          </div>
          <div style={{ display: "flex", gap: 20 }}>
            {KPIS.map(k => (
              <div key={k.label} style={{ textAlign: "center" }}>
                <div style={{ fontSize: 12, fontWeight: 600, color: k.color, letterSpacing: "-0.01em" }}>{k.val}</div>
                <div style={{ fontSize: 9, color: "rgba(255,255,255,0.3)", marginTop: 1 }}>{k.label}</div>
              </div>
            ))}
          </div>
          <div style={{
            width: 26, height: 26, borderRadius: "50%",
            background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.08)",
            display: "flex", alignItems: "center", justifyContent: "center",
            fontSize: 9, color: "rgba(255,255,255,0.5)", fontWeight: 600,
          }}>CT</div>
        </div>

        {/* Body: sidebar + chat */}
        <div style={{ display: "flex", flex: 1, overflow: "hidden" }}>
          {/* Sidebar */}
          <div style={{
            width: 120, flexShrink: 0, background: "#0a0a0a",
            borderRight: "1px solid rgba(255,255,255,0.05)",
            padding: "12px 0", display: "flex", flexDirection: "column", gap: 2,
          }}>
            {NAV_ITEMS.map((item, i) => (
              <div key={item.label} style={{
                display: "flex", alignItems: "center", gap: 8,
                padding: "7px 14px", margin: "0 6px", borderRadius: 6,
                background: i === 0 ? "rgba(184,245,102,0.08)" : "transparent",
                borderLeft: i === 0 ? "2px solid var(--accent)" : "2px solid transparent",
                cursor: "default",
              }}>
                <span style={{ fontSize: 12 }}>{item.icon}</span>
                <span style={{
                  fontSize: 11,
                  color: i === 0 ? "var(--accent)" : "rgba(255,255,255,0.35)",
                  fontWeight: i === 0 ? 500 : 400,
                }}>
                  {item.label}
                </span>
              </div>
            ))}
          </div>

          {/* Chat area */}
          <div style={{ flex: 1, display: "flex", flexDirection: "column", overflow: "hidden" }}>
            <div ref={msgRef} style={{
              flex: 1, overflowY: "auto", padding: "16px",
              display: "flex", flexDirection: "column", gap: 12,
            }}>
              {/* Static greeting */}
              <div style={{ display: "flex", gap: 8, alignItems: "flex-start" }}>
                <div style={{
                  width: 22, height: 22, borderRadius: 6, background: "var(--accent)",
                  display: "flex", alignItems: "center", justifyContent: "center",
                  fontSize: 9, fontWeight: 700, color: "#0d0f0e", flexShrink: 0,
                }}>N</div>
                <div style={{
                  background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.07)",
                  borderRadius: "4px 10px 10px 10px", padding: "8px 12px",
                  fontSize: 12, color: "rgba(255,255,255,0.7)", lineHeight: 1.5, maxWidth: "80%",
                }}>
                  ¿En qué te ayudo hoy?
                </div>
              </div>

              {/* Animated messages */}
              {MSGS.map((msg, i) => {
                if (slots[i] === null) return null;
                const isTyping = slots[i] !== msg.text;
                if (msg.role === "user") {
                  return (
                    <div key={i} style={{ display: "flex", justifyContent: "flex-end" }}>
                      <div style={{
                        background: "rgba(184,245,102,0.1)", border: "1px solid rgba(184,245,102,0.18)",
                        borderRadius: "10px 4px 10px 10px", padding: "8px 12px",
                        fontSize: 12, color: "rgba(255,255,255,0.85)", lineHeight: 1.5, maxWidth: "80%",
                      }}>
                        {slots[i]}{isTyping && <span className="tw-cursor" />}
                      </div>
                    </div>
                  );
                }
                return (
                  <div key={i} style={{ display: "flex", gap: 8, alignItems: "flex-start" }}>
                    <div style={{
                      width: 22, height: 22, borderRadius: 6, background: "var(--accent)",
                      display: "flex", alignItems: "center", justifyContent: "center",
                      fontSize: 9, fontWeight: 700, color: "#0d0f0e", flexShrink: 0,
                    }}>N</div>
                    <div style={{
                      background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.07)",
                      borderRadius: "4px 10px 10px 10px", padding: "8px 12px",
                      fontSize: 12, color: "rgba(255,255,255,0.7)", lineHeight: 1.5, maxWidth: "80%",
                    }}>
                      {slots[i]}{isTyping && <span className="tw-cursor" />}
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Input bar */}
            <div style={{ padding: "10px 16px", borderTop: "1px solid rgba(255,255,255,0.06)", flexShrink: 0 }}>
              <div style={{
                background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)",
                borderRadius: 8, padding: "8px 12px",
                fontSize: 12, color: "rgba(255,255,255,0.25)",
              }}>
                Pregúntale a Neto sobre tus finanzas…
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
