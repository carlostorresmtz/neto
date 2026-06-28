"use client";

import { useEffect } from "react";
import { PLANS, type PlanId } from "@/lib/plans";

interface UpgradeModalProps {
  open: boolean;
  onClose: () => void;
  /** Plan actualmente activo, para marcar la tarjeta correspondiente. */
  currentPlan: PlanId;
  /** Se invoca al elegir un plan en una tarjeta. */
  onSelectPlan: (plan: PlanId) => void;
}

/**
 * Modal de selección/upgrade de plan. Reusa PLANS (lib/plans.ts) como fuente
 * única, así que precios y features quedan sincronizados con la landing.
 *
 * Pro destaca con "Más popular" + banner "Primer mes gratis · Sin tarjeta".
 * En móvil el contenido hace scroll interno si no cabe en la pantalla.
 */
export default function UpgradeModal({ open, onClose, currentPlan, onSelectPlan }: UpgradeModalProps) {
  // Cerrar con Esc.
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => { if (e.key === "Escape") onClose(); };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label="Elegir plan"
      onClick={onClose}
      style={{
        position: "fixed", inset: 0, zIndex: 1000,
        background: "rgba(15,23,42,0.55)",
        display: "flex", alignItems: "center", justifyContent: "center",
        padding: 20, overflowY: "auto",
      }}
    >
      <div
        onClick={e => e.stopPropagation()}
        style={{
          position: "relative",
          width: "100%", maxWidth: 920,
          maxHeight: "calc(100vh - 40px)", overflowY: "auto",
          background: "var(--bg)", borderRadius: 16,
          border: "1px solid var(--border)",
          boxShadow: "0 24px 60px rgba(15,23,42,0.30)",
          padding: "28px 24px 24px",
        }}
      >
        {/* Cerrar */}
        <button
          type="button"
          onClick={onClose}
          aria-label="Cerrar"
          style={{
            position: "absolute", top: 14, right: 14,
            width: 32, height: 32, borderRadius: 8,
            border: "1px solid var(--border)", background: "var(--bg2)",
            display: "flex", alignItems: "center", justifyContent: "center",
            cursor: "pointer", color: "var(--text3)",
          }}
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
          </svg>
        </button>

        {/* Encabezado */}
        <div style={{ textAlign: "center", marginBottom: 24, paddingRight: 24 }}>
          <h2 style={{ fontSize: 22, fontWeight: 600, letterSpacing: "-0.02em", color: "var(--text)", margin: 0 }}>
            Elige tu plan
          </h2>
          <p style={{ fontSize: 13, color: "var(--text3)", marginTop: 6 }}>
            Cambia de plan cuando quieras. Sin compromisos.
          </p>
        </div>

        {/* Tarjetas */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: 14 }}>
          {PLANS.map(plan => {
            const isCurrent = plan.id === currentPlan;
            return (
              <div
                key={plan.id}
                style={{
                  position: "relative",
                  background: plan.bg, border: plan.border, borderRadius: 12,
                  padding: "26px 22px 22px", display: "flex", flexDirection: "column",
                }}
              >
                {plan.popular && (
                  <div style={{
                    position: "absolute", top: -1, right: 18,
                    background: "var(--accent)", color: "#FFFFFF",
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
                  <span style={{ fontSize: 36, lineHeight: 1, color: "var(--text)", fontWeight: 600, letterSpacing: "-0.02em" }}>
                    {plan.monthlyPrice}
                  </span>
                  {plan.period !== "para siempre" && (
                    <span style={{ fontSize: 13, color: "var(--text3)" }}>{plan.period}</span>
                  )}
                </div>
                <div style={{ fontSize: 12, color: "var(--text3)", marginBottom: 18 }}>
                  {plan.period === "para siempre" ? "para siempre" : "facturado mensualmente"}
                </div>

                {/* Banner solo para Pro */}
                {plan.popular && (
                  <div style={{
                    display: "flex", alignItems: "center", gap: 6,
                    background: "var(--accent3)", border: "1px solid #BFDBFE",
                    color: "var(--accent)", borderRadius: 8,
                    padding: "7px 10px", fontSize: 11, fontWeight: 600, marginBottom: 18,
                  }}>
                    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0 }}>
                      <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" />
                    </svg>
                    Primer mes gratis · Sin tarjeta
                  </div>
                )}

                <div style={{ flex: 1, marginBottom: 18 }}>
                  {plan.features.map(f => (
                    <div key={f} style={{ display: "flex", alignItems: "flex-start", gap: 9, marginBottom: 9, fontSize: 13, color: "var(--text2)", lineHeight: 1.5 }}>
                      <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="var(--accent)" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0, marginTop: 1 }}>
                        <polyline points="20 6 9 17 4 12" />
                      </svg>
                      {f}
                    </div>
                  ))}
                </div>

                <button
                  type="button"
                  disabled={isCurrent}
                  onClick={() => onSelectPlan(plan.id)}
                  style={{
                    width: "100%", padding: "12px", fontSize: 14, fontWeight: 500,
                    borderRadius: 10, fontFamily: "inherit",
                    cursor: isCurrent ? "default" : "pointer",
                    background: isCurrent ? "var(--bg3)" : plan.ctaAccent ? "var(--accent)" : "transparent",
                    color: isCurrent ? "var(--text3)" : plan.ctaAccent ? "#FFFFFF" : "var(--text2)",
                    border: isCurrent ? "1px solid var(--border)" : plan.ctaAccent ? "none" : "1px solid var(--border2)",
                  }}
                >
                  {isCurrent ? "Plan actual" : plan.cta}
                </button>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
