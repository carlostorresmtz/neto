"use client";

import { useEffect, useRef, useState } from "react";
import SectionHeading from "./SectionHeading";

const STEPS = [
  {
    num: "01",
    desc: "Llega correo de BBVA",
    detail: "Cargo en OXXO por $142.00",
    status: "Detectado",
    statusColor: "#0EA5E9",
    statusBg: "rgba(14,165,233,0.1)",
  },
  {
    num: "02",
    desc: "Neto lee monto y comercio",
    detail: "$142.00 · OXXO Convenio · BBVA Débito",
    status: "Extraído",
    statusColor: "#3B82F6",
    statusBg: "rgba(59,130,246,0.1)",
  },
  {
    num: "03",
    desc: "Categoriza automáticamente",
    detail: "Tipo de establecimiento: tienda de conveniencia",
    status: "Abarrotes",
    statusColor: "#D97706",
    statusBg: "rgba(217,119,6,0.1)",
  },
  {
    num: "04",
    desc: "Disponible para preguntas",
    detail: "\"¿Cuánto gasté en OXXO este mes?\" → listo",
    status: "Listo ✓",
    statusColor: "#16A34A",
    statusBg: "rgba(22,163,74,0.1)",
  },
];

export default function ProcessingSteps() {
  const ref = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) { setActive(true); observer.disconnect(); } },
      { threshold: 0.25 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <section style={{ padding: "100px 24px", maxWidth: 800, margin: "0 auto" }}>
      <div style={{ marginBottom: 48 }}>
        <SectionHeading
          badge="Cómo funciona"
          line1="De correo bancario"
          line2="a respuesta en segundos"
        />
      </div>

      {/* Mock email card */}
      <div style={{
        background: "#F8FAFC", border: "1px solid #E2E8F0",
        borderRadius: 12, padding: "16px 20px", marginBottom: 12,
        display: "flex", alignItems: "center", gap: 14,
      }}>
        <div style={{
          width: 38, height: 38, borderRadius: 10, flexShrink: 0,
          background: "#1565C0", display: "flex", alignItems: "center", justifyContent: "center",
          fontSize: 10, fontWeight: 800, color: "#fff", letterSpacing: "0.04em",
        }}>
          BB
        </div>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ fontSize: 12, color: "var(--text2)", marginBottom: 3 }}>
            <strong style={{ color: "var(--text)" }}>BBVA México</strong>
            <span style={{ color: "var(--text3)", marginLeft: 8 }}>no-reply@bbva.com</span>
          </div>
          <div style={{ fontSize: 13, color: "var(--text)", fontWeight: 500, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
            Cargo en tu cuenta: $142.00 en OXXO Convenio
          </div>
        </div>
        <div style={{ fontSize: 11, color: "var(--text3)", flexShrink: 0 }}>ahora</div>
      </div>

      {/* Steps */}
      <div
        ref={ref}
        className={active ? "steps-active" : ""}
        style={{ display: "flex", flexDirection: "column", gap: 0 }}
      >
        {STEPS.map((step, i) => (
          <div key={step.num}>
            <div className="step-item" style={{
              background: "#F8FAFC", border: "1px solid #E2E8F0",
              borderRadius: 12, padding: "16px 20px",
              display: "flex", alignItems: "center", gap: 16,
            }}>
              {/* Step number */}
              <div style={{
                width: 32, height: 32, borderRadius: 9, flexShrink: 0,
                background: "var(--bg3)", border: "1px solid var(--border2)",
                display: "flex", alignItems: "center", justifyContent: "center",
                fontSize: 10, fontWeight: 700, color: "#1E40AF",
                letterSpacing: "0.04em", fontVariantNumeric: "tabular-nums",
              }}>
                {step.num}
              </div>

              {/* Content */}
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontSize: 13, fontWeight: 500, color: "var(--text)", marginBottom: 3 }}>
                  {step.desc}
                </div>
                <div style={{ fontSize: 11, color: "var(--text3)", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
                  {step.detail}
                </div>
              </div>

              {/* Connector arrow */}
              <div style={{ color: "var(--border2)", fontSize: 14, flexShrink: 0 }}>→</div>

              {/* Status badge */}
              <div className="step-status" style={{
                padding: "4px 12px", borderRadius: 100, flexShrink: 0,
                background: step.statusBg,
                color: step.statusColor,
                fontSize: 12, fontWeight: 500,
                border: `1px solid ${step.statusColor}33`,
                transitionDelay: `${i * 400 + 200}ms`,
              }}>
                {step.status}
              </div>
            </div>

            {/* Animated connector between steps */}
            {i < STEPS.length - 1 && (
              <div style={{ height: 8, display: "flex", alignItems: "center", paddingLeft: 36 }}>
                <div
                  className={`step-connector${active ? " step-connector--active" : ""}`}
                  style={{ animationDelay: `${(i + 1) * 400}ms` }}
                />
              </div>
            )}
          </div>
        ))}
      </div>
    </section>
  );
}
