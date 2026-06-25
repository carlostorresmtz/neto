"use client";

import { useEffect, useRef, useState } from "react";

const MSGS: { role: "user" | "neto"; text: string }[] = [
  { role: "user", text: "¿Cuánto gasté en restaurantes este mes?" },
  { role: "neto", text: "Gastaste $4,230 en restaurantes, 23% más que abril. Top: Tacos El Franc $890, Starbucks $640, Uber Eats $1,200." },
  { role: "user", text: "¿Y en suscripciones?" },
  { role: "neto", text: "7 suscripciones activas por $1,094/mes: Netflix, Spotify, iCloud, ChatGPT, Adobe, HBO Max, Duolingo Plus." },
];

const SPEED   = 22;   // ms per character
const BETWEEN = 600;  // ms pause after each full message
const LOOP_PAUSE = 3500; // ms before restarting loop

function sleep(ms: number) {
  return new Promise<void>(resolve => setTimeout(resolve, ms));
}

function Avatar() {
  return (
    <div style={{
      width: 26, height: 26, borderRadius: 8, background: "var(--accent)",
      display: "flex", alignItems: "center", justifyContent: "center",
      fontSize: 10, fontWeight: 700, color: "#0d0f0e", flexShrink: 0,
    }}>N</div>
  );
}

function Bubble({ role, text, cursor }: { role: "user" | "neto"; text: string; cursor: boolean }) {
  const content = <>{text}{cursor && <span className="tw-cursor" />}</>;
  if (role === "user") {
    return (
      <div style={{ display: "flex", justifyContent: "flex-end" }}>
        <div style={{
          background: "rgba(184,245,102,0.12)", border: "1px solid rgba(184,245,102,0.2)",
          borderRadius: "12px 4px 12px 12px", padding: "9px 13px",
          fontSize: 13, color: "rgba(255,255,255,0.88)", lineHeight: 1.55, maxWidth: "80%",
        }}>
          {content}
        </div>
      </div>
    );
  }
  return (
    <div style={{ display: "flex", gap: 10, alignItems: "flex-start" }}>
      <Avatar />
      <div style={{
        background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.07)",
        borderRadius: "4px 12px 12px 12px", padding: "9px 13px",
        fontSize: 13, color: "rgba(255,255,255,0.7)", lineHeight: 1.55, maxWidth: "82%",
      }}>
        {content}
      </div>
    </div>
  );
}

export default function ChatMockup() {
  // slots[i] = null (hidden) | string (visible, partial or full)
  const [slots, setSlots] = useState<(string | null)[]>([null, null, null, null]);
  const stoppedRef = useRef(false);
  const msgRef = useRef<HTMLDivElement>(null);

  // Scroll to bottom whenever messages update
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
        await sleep(300);

        for (let i = 0; i < MSGS.length; i++) {
          if (stoppedRef.current) return;
          const text = MSGS[i].text;

          // Type character by character
          for (let c = 1; c <= text.length; c++) {
            if (stoppedRef.current) return;
            const partial = text.slice(0, c);
            setSlots(prev => {
              const next = [...prev];
              next[i] = partial;
              return next;
            });
            await sleep(SPEED);
          }

          // Pause before next message (or before loop)
          await sleep(BETWEEN);
        }

        // All messages visible — hold before restarting
        await sleep(LOOP_PAUSE);
      }
    }

    animate();
    return () => { stoppedRef.current = true; };
  }, []);

  return (
    <div style={{ marginTop: 56 }}>
      {/* Live badge */}
      <div style={{ display: "flex", justifyContent: "center", marginBottom: 14 }}>
        <div style={{
          display: "inline-flex", alignItems: "center", gap: 7,
          background: "rgba(184,245,102,0.08)", border: "1px solid rgba(184,245,102,0.22)",
          borderRadius: 100, padding: "5px 14px",
        }}>
          <span className="live-dot" style={{ width: 7, height: 7, borderRadius: "50%", background: "var(--accent)", display: "block", flexShrink: 0 }} />
          <span style={{ fontSize: 12, color: "var(--accent2)", fontWeight: 500 }}>En vivo</span>
        </div>
      </div>

      {/* Window — dimensiones completamente fijas */}
      <div style={{
        maxWidth: 560, margin: "0 auto", textAlign: "left",
        background: "#111312",
        border: "1px solid rgba(184,245,102,0.14)",
        borderRadius: 18,
        boxShadow: "0 0 0 1px rgba(255,255,255,0.04), 0 40px 100px rgba(0,0,0,0.55), 0 0 100px rgba(184,245,102,0.07)",
        overflow: "hidden",
        height: 340, minHeight: 340, maxHeight: 340,
        display: "flex", flexDirection: "column",
      }}>
        {/* Top bar */}
        <div style={{
          display: "flex", alignItems: "center", gap: 10,
          padding: "13px 18px",
          background: "rgba(0,0,0,0.25)",
          borderBottom: "1px solid rgba(255,255,255,0.06)",
        }}>
          <div style={{ width: 26, height: 26, background: "var(--accent)", borderRadius: 8, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
            <svg width="11" height="11" viewBox="0 0 16 16" fill="none" stroke="#0d0f0e" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="1,11 4,6 7,9 11,3 15,5"/>
            </svg>
          </div>
          <span style={{ fontSize: 15, color: "#e8ebe9", lineHeight: 1, fontWeight: 500, letterSpacing: "-0.01em" }}>Neto</span>
          <span style={{ marginLeft: "auto", fontSize: 10, color: "rgba(255,255,255,0.25)" }}>Datos de ejemplo</span>
        </div>

        {/* Messages — ocupa el espacio restante, scroll interno */}
        <div ref={msgRef} style={{
          padding: "18px 18px 20px",
          display: "flex", flexDirection: "column", gap: 14,
          flex: 1, overflowY: "auto",
        }}>
          {/* Static intro */}
          <div style={{ display: "flex", gap: 10, alignItems: "flex-start" }}>
            <Avatar />
            <div style={{
              background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.07)",
              borderRadius: "4px 12px 12px 12px", padding: "9px 13px",
              fontSize: 13, color: "rgba(255,255,255,0.7)", lineHeight: 1.55,
            }}>
              ¿En qué te ayudo hoy?
            </div>
          </div>

          {/* Animated messages */}
          {MSGS.map((msg, i) => {
            if (slots[i] === null) return null;
            const isTyping = slots[i] !== msg.text;
            return (
              <Bubble key={i} role={msg.role} text={slots[i]!} cursor={isTyping} />
            );
          })}
        </div>
      </div>
    </div>
  );
}
