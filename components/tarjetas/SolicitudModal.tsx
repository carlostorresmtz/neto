"use client";

import { useEffect } from "react";
import type { Tarjeta } from "@/lib/tarjetas";

interface SolicitudModalProps {
  tarjeta: Tarjeta | null;
  onClose: () => void;
}

/**
 * Modal demo de "Solicitud enviada". Por ahora no envía nada real; el lead se
 * registra en lib/tarjetas.ts (registrarSolicitud) con un TODO para el sistema
 * real de comisiones.
 */
export default function SolicitudModal({ tarjeta, onClose }: SolicitudModalProps) {
  useEffect(() => {
    if (!tarjeta) return;
    const onKey = (e: KeyboardEvent) => { if (e.key === "Escape") onClose(); };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [tarjeta, onClose]);

  if (!tarjeta) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label="Solicitud enviada"
      onClick={onClose}
      style={{
        position: "fixed", inset: 0, zIndex: 1000,
        background: "rgba(15,23,42,0.55)",
        display: "flex", alignItems: "center", justifyContent: "center", padding: 20,
      }}
    >
      <div
        onClick={e => e.stopPropagation()}
        style={{
          width: "100%", maxWidth: 380, background: "var(--bg)",
          border: "1px solid var(--border)", borderRadius: 16,
          boxShadow: "0 24px 60px rgba(15,23,42,0.30)",
          padding: "28px 24px", textAlign: "center",
        }}
      >
        <div
          style={{
            width: 48, height: 48, borderRadius: "50%", margin: "0 auto 14px",
            background: "var(--accent3)", color: "var(--accent)",
            display: "flex", alignItems: "center", justifyContent: "center",
          }}
        >
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="20 6 9 17 4 12" />
          </svg>
        </div>
        <h2 style={{ fontSize: 18, fontWeight: 600, color: "var(--text)", margin: "0 0 6px" }}>Solicitud enviada</h2>
        <p style={{ fontSize: 13, color: "var(--text2)", lineHeight: 1.5, margin: "0 0 4px" }}>
          Recibimos tu interés en <strong style={{ color: "var(--text)" }}>{tarjeta.nombre}</strong> de {tarjeta.banco}.
        </p>
        <p style={{ fontSize: 12, color: "var(--text3)", lineHeight: 1.5, margin: "0 0 20px" }}>
          Es una demostración: aún no se envía nada al banco. Pronto podrás continuar tu solicitud aquí mismo.
        </p>
        <button
          type="button"
          onClick={onClose}
          style={{
            width: "100%", padding: "11px", fontSize: 14, fontWeight: 500,
            background: "var(--accent)", color: "#FFFFFF",
            border: "none", borderRadius: 10, cursor: "pointer", fontFamily: "inherit",
          }}
        >
          Entendido
        </button>
      </div>
    </div>
  );
}
