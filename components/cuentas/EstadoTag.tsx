"use client";

import type { EstadoDato } from "@/lib/cuentas";

/**
 * Marca sutil de confianza para datos NO confirmados (saldos, límites, cortes).
 * "ejemplo" = dato demo; "estimado" = inferido de correos reales, no exacto.
 * Nunca presentamos un saldo dudoso como un hecho.
 */
export function EstadoTag({ estado }: { estado: EstadoDato }) {
  const ejemplo = estado === "ejemplo";
  return (
    <span
      title={ejemplo ? "Dato de ejemplo, no proviene de tus correos" : "Estimado de tus correos, no confirmado"}
      style={{
        fontSize: 9, fontWeight: 700, letterSpacing: "0.04em", textTransform: "uppercase",
        color: ejemplo ? "var(--text3)" : "#B45309",
        background: ejemplo ? "var(--bg3)" : "#FEF3C7",
        border: `1px solid ${ejemplo ? "var(--border)" : "#FDE68A"}`,
        borderRadius: 4, padding: "1px 5px", marginLeft: 6,
        verticalAlign: "middle", whiteSpace: "nowrap",
      }}
    >
      {ejemplo ? "ejemplo" : "estimado"}
    </span>
  );
}

/** Banner discreto de modo demo (mismo patrón que análisis/alertas). */
export function DemoBanner() {
  return (
    <div style={{
      fontSize: 11, color: "var(--text3)", background: "var(--bg3)",
      border: "1px solid var(--border)", borderRadius: 8, padding: "7px 12px",
      marginBottom: 16, display: "flex", alignItems: "center", gap: 6,
    }}>
      <span style={{ opacity: 0.7 }}>ℹ</span>
      Datos de ejemplo — conecta Gmail para ver tus cuentas reales. Los saldos mostrados no son tuyos.
    </div>
  );
}
