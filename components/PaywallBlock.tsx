"use client";

import type { CSSProperties } from "react";

interface PaywallBlockProps {
  title: string;
  description?: string;
  ctaLabel: string;
  onUpgrade: () => void;
  /** Texto pequeño sobre el título (p. ej. "Disponible en Pro"). */
  eyebrow?: string;
  style?: CSSProperties;
}

/**
 * Bloque de paywall reutilizable, en azul/blanco de marca: candado, título,
 * descripción y CTA que abre el modal de upgrade. Presentacional — el padre
 * decide cuándo mostrarlo y qué hace `onUpgrade`.
 */
export default function PaywallBlock({ title, description, ctaLabel, onUpgrade, eyebrow, style }: PaywallBlockProps) {
  return (
    <div
      style={{
        display: "flex", flexDirection: "column", alignItems: "center", textAlign: "center",
        gap: 10, padding: "26px 24px",
        background: "var(--bg2)", border: "1px solid var(--border)", borderRadius: 12,
        ...style,
      }}
    >
      <div
        style={{
          width: 40, height: 40, borderRadius: "50%",
          background: "var(--accent3)", color: "var(--accent)",
          display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0,
        }}
      >
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <rect x="3" y="11" width="18" height="11" rx="2" /><path d="M7 11V7a5 5 0 0 1 10 0v4" />
        </svg>
      </div>

      {eyebrow && (
        <span style={{ fontSize: 11, fontWeight: 700, letterSpacing: "0.06em", textTransform: "uppercase", color: "var(--accent)" }}>
          {eyebrow}
        </span>
      )}

      <div style={{ fontSize: 15, fontWeight: 600, color: "var(--text)" }}>{title}</div>

      {description && (
        <div style={{ fontSize: 12, color: "var(--text3)", maxWidth: 340, lineHeight: 1.6 }}>{description}</div>
      )}

      <button
        type="button"
        onClick={onUpgrade}
        style={{
          marginTop: 2, padding: "9px 18px", fontSize: 13, fontWeight: 500,
          background: "var(--accent)", color: "#FFFFFF",
          border: "none", borderRadius: 10, cursor: "pointer", fontFamily: "inherit",
        }}
      >
        {ctaLabel}
      </button>
    </div>
  );
}
