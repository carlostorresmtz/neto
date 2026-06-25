"use client";

import { useState } from "react";
import Link from "next/link";
import Reveal from "@/components/landing/Reveal";

const PRICING = [
  {
    name: "Gratis",
    monthlyPrice: "$0",
    annualPrice: "$0",
    period: "para siempre",
    nameColor: "#16A34A",
    bg: "#F8FAFC",
    border: "1px solid #E2E8F0",
    features: ["Historial de 3 meses", "Preguntas ilimitadas", "1 banco conectado"],
    cta: "Empezar gratis",
    ctaAccent: false,
    popular: false,
  },
  {
    name: "Pro",
    monthlyPrice: "$149",
    annualPrice: "$119",
    period: "MXN / mes",
    nameColor: "#1E40AF",
    bg: "#EFF6FF",
    border: "1px solid #1E40AF",
    features: ["Historial ilimitado", "Todos los bancos soportados", "Alertas proactivas", "Conexión a Google Sheets"],
    cta: "Empezar Pro",
    ctaAccent: true,
    popular: true,
  },
  {
    name: "Business",
    monthlyPrice: "$499",
    annualPrice: "$399",
    period: "MXN / mes",
    nameColor: "#64748B",
    bg: "#F8FAFC",
    border: "1px solid #E2E8F0",
    features: ["Múltiples usuarios", "Exportación CSV", "Soporte prioritario", "API access"],
    cta: "Contactar",
    ctaAccent: false,
    popular: false,
  },
];

export default function PricingSection() {
  const [annual, setAnnual] = useState(false);

  return (
    <>
      {/* Toggle */}
      <div style={{ display: "flex", justifyContent: "center", marginBottom: 40 }}>
        <div style={{
          display: "inline-flex", alignItems: "center",
          background: "#F8FAFC",
          border: "1px solid #E2E8F0",
          borderRadius: 10, padding: 4, gap: 2,
        }}>
          <button
            onClick={() => setAnnual(false)}
            style={{
              padding: "8px 20px", borderRadius: 7, fontSize: 13, fontWeight: 500,
              background: annual ? "transparent" : "#FFFFFF",
              color: annual ? "var(--text3)" : "var(--text)",
              border: annual ? "none" : "1px solid #E2E8F0",
              cursor: "pointer", fontFamily: "inherit",
              transition: "all 0.2s ease",
            }}
          >
            Mensual
          </button>
          <button
            onClick={() => setAnnual(true)}
            style={{
              padding: "8px 20px", borderRadius: 7, fontSize: 13, fontWeight: 500,
              background: annual ? "#DBEAFE" : "transparent",
              color: annual ? "#1E40AF" : "var(--text3)",
              border: annual ? "1px solid #BFDBFE" : "1px solid transparent",
              cursor: "pointer", fontFamily: "inherit",
              transition: "all 0.2s ease",
              display: "flex", alignItems: "center", gap: 8,
            }}
          >
            Anual
            <span style={{
              background: annual ? "#BFDBFE" : "#F1F5F9",
              border: annual ? "1px solid #93C5FD" : "1px solid #E2E8F0",
              borderRadius: 4, padding: "2px 6px", fontSize: 10, fontWeight: 700,
              color: annual ? "#1E40AF" : "var(--text3)", letterSpacing: "0.04em",
            }}>
              -20%
            </span>
          </button>
        </div>
      </div>

      {/* Cards */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))", gap: 16 }}>
        {PRICING.map((plan, i) => {
          const price = annual ? plan.annualPrice : plan.monthlyPrice;
          return (
            <Reveal key={plan.name} delay={i * 100} style={{ height: "100%" }}>
              <div className="card-hover-line" style={{
                background: plan.bg, border: plan.border,
                borderRadius: 12, padding: "28px 24px",
                display: "flex", flexDirection: "column", position: "relative",
              }}>
                {plan.popular && (
                  <div style={{
                    position: "absolute", top: -1, right: 20,
                    background: "#1E40AF", color: "#FFFFFF",
                    fontSize: 10, fontWeight: 700, letterSpacing: "0.06em", textTransform: "uppercase",
                    padding: "4px 12px", borderRadius: "0 0 8px 8px",
                  }}>
                    Más popular
                  </div>
                )}
                <div style={{ fontSize: 12, color: plan.nameColor, textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: 12 }}>
                  {plan.name}
                </div>
                <div style={{ display: "flex", alignItems: "baseline", gap: 6, marginBottom: 4 }}>
                  <span style={{
                    fontSize: 40, lineHeight: 1, color: "var(--text)",
                    fontWeight: 600, letterSpacing: "-0.02em",
                    transition: "all 0.2s ease",
                  }}>
                    {price}
                  </span>
                  {plan.period !== "para siempre" && (
                    <span style={{ fontSize: 13, color: "var(--text3)" }}>{plan.period}</span>
                  )}
                </div>
                <div style={{ fontSize: 12, color: "var(--text3)", marginBottom: 28 }}>
                  {plan.period === "para siempre"
                    ? "para siempre"
                    : annual ? "facturado anualmente" : "facturado mensualmente"}
                </div>
                <div style={{ flex: 1 }}>
                  {plan.features.map(f => (
                    <div key={f} className="price-check">{f}</div>
                  ))}
                </div>
                <Link href="/chat" style={{ textDecoration: "none", marginTop: 28 }}>
                  <button style={{
                    width: "100%", padding: "12px", fontSize: 14, fontWeight: 500,
                    background: plan.ctaAccent ? "#1E40AF" : "transparent",
                    color: plan.ctaAccent ? "#FFFFFF" : "var(--text2)",
                    border: plan.ctaAccent ? "none" : "1px solid #E2E8F0",
                    borderRadius: 10, cursor: "pointer", fontFamily: "inherit",
                  }}>
                    {plan.cta}
                  </button>
                </Link>
              </div>
            </Reveal>
          );
        })}
      </div>
    </>
  );
}
