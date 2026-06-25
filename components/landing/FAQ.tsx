"use client";

import { useEffect, useRef, useState } from "react";
import SectionHeading from "./SectionHeading";

const ITEMS = [
  {
    q: "¿Neto puede mover mi dinero o hacer pagos?",
    a: "No. Neto tiene acceso de solo lectura a tu Gmail. Nunca puede escribir correos, mover dinero, ni hacer ninguna acción en tu nombre.",
  },
  {
    q: "¿Qué correos lee exactamente?",
    a: "Solo los correos de notificación de tus bancos: cargos, pagos y estados de cuenta. No lee correos personales, de trabajo ni ningún otro tipo.",
  },
  {
    q: "¿Puedo desconectar mi cuenta de Google?",
    a: "Sí, en cualquier momento desde la sección Conexiones. Al desconectar, Neto pierde acceso inmediatamente y no guarda ningún dato.",
  },
  {
    q: "¿Neto guarda mis correos o mis datos bancarios?",
    a: "No almacenamos tus correos. Los leemos en el momento en que haces una pregunta y no guardamos copias.",
  },
  {
    q: "¿Funciona con todos los bancos mexicanos?",
    a: "Actualmente soporta BBVA, Amex, Nu, Banamex, HSBC, Santander, Scotiabank e Inbursa. Si tu banco no está en la lista, escríbenos.",
  },
  {
    q: "¿Cuánto cuesta?",
    a: "La versión básica es gratis. El plan Pro ($149 MXN/mes) incluye historial ilimitado, alertas proactivas y conexión a Google Sheets.",
  },
];

function FAQItem({ q, a, open, onToggle }: { q: string; a: string; open: boolean; onToggle: () => void }) {
  return (
    <div style={{
      background: "var(--card)",
      border: `1px solid ${open ? "#1E40AF" : "var(--border)"}`,
      borderRadius: 14,
      overflow: "hidden",
      transition: "border-color 0.2s ease",
    }}>
      <button
        onClick={onToggle}
        style={{
          width: "100%", display: "flex", alignItems: "center", justifyContent: "space-between",
          gap: 16, padding: "20px 22px",
          background: open ? "#EFF6FF" : "none",
          border: "none", cursor: "pointer",
          fontFamily: "inherit", textAlign: "left",
          transition: "background 0.2s ease",
        }}
      >
        <span style={{ fontSize: 14, fontWeight: 500, color: "var(--text)", lineHeight: 1.5 }}>
          {q}
        </span>
        <span style={{
          display: "flex", alignItems: "center", justifyContent: "center",
          width: 24, height: 24, flexShrink: 0,
          color: open ? "#1E40AF" : "#64748B",
          transform: open ? "rotate(180deg)" : "rotate(0deg)",
          transition: "transform 0.28s ease, color 0.2s ease",
        }}>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="6 9 12 15 18 9"/>
          </svg>
        </span>
      </button>

      {/* grid-template-rows trick: animates height without JS measurement */}
      <div style={{
        display: "grid",
        gridTemplateRows: open ? "1fr" : "0fr",
        transition: "grid-template-rows 0.3s ease",
      }}>
        <div style={{ overflow: "hidden" }}>
          <p style={{
            margin: 0, padding: "0 22px 20px",
            fontSize: 13, color: "var(--text2)", lineHeight: 1.75,
          }}>
            {a}
          </p>
        </div>
      </div>
    </div>
  );
}

export default function FAQ() {
  const [openIdx, setOpenIdx] = useState<number | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) { setVisible(true); return; }
    const obs = new IntersectionObserver(
      ([e]) => { if (e.isIntersecting) { setVisible(true); obs.disconnect(); } },
      { threshold: 0.1 }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  function toggle(i: number) {
    setOpenIdx(prev => (prev === i ? null : i));
  }

  return (
    <section style={{ padding: "0 24px 96px", maxWidth: 720, margin: "0 auto" }}>
      <div style={{ marginBottom: 48 }}>
        <SectionHeading
          badge="Preguntas frecuentes"
          line1="Todo lo que"
          line2="necesitas saber"
        />
      </div>

      <div ref={containerRef} style={{ display: "flex", flexDirection: "column", gap: 10 }}>
        {ITEMS.map((item, i) => (
          <div key={i} style={{
            opacity: visible ? 1 : 0,
            transform: visible ? "translateX(0)" : "translateX(20px)",
            transition: `opacity 0.4s ease ${i * 80}ms, transform 0.4s ease ${i * 80}ms`,
          }}>
            <FAQItem
              q={item.q}
              a={item.a}
              open={openIdx === i}
              onToggle={() => toggle(i)}
            />
          </div>
        ))}
      </div>
    </section>
  );
}
