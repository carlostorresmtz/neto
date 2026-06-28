"use client";

import { useState } from "react";
import { fmtAnualidad, type Tarjeta } from "@/lib/tarjetas";

interface TarjetaCardProps {
  tarjeta: Tarjeta;
  onSolicitar: (t: Tarjeta) => void;
}

function Badge({ texto }: { texto: string }) {
  const recomendada = texto === "Recomendada";
  return (
    <span
      style={{
        fontSize: 10, fontWeight: 700, letterSpacing: "0.04em", textTransform: "uppercase",
        padding: "3px 8px", borderRadius: 6,
        color: recomendada ? "var(--accent)" : "#16A34A",
        background: recomendada ? "var(--accent3)" : "rgba(22,163,74,0.1)",
        border: recomendada ? "1px solid #BFDBFE" : "1px solid rgba(22,163,74,0.25)",
      }}
    >
      {texto}
    </span>
  );
}

export default function TarjetaCard({ tarjeta, onSolicitar }: TarjetaCardProps) {
  const [detalles, setDetalles] = useState(false);

  return (
    <div
      style={{
        background: "var(--card)", border: "1px solid var(--border)", borderRadius: 12,
        padding: "18px", display: "flex", flexDirection: "column",
      }}
    >
      {/* Encabezado: banco + badge */}
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 12 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 9 }}>
          <span
            style={{
              width: 30, height: 22, borderRadius: 5, background: tarjeta.color,
              display: "inline-flex", alignItems: "center", justifyContent: "center",
              color: "#FFFFFF", fontSize: 9, fontWeight: 700, flexShrink: 0,
            }}
          >
            {tarjeta.banco.slice(0, 2).toUpperCase()}
          </span>
          <span style={{ fontSize: 11, color: "var(--text3)" }}>{tarjeta.banco}</span>
        </div>
        {tarjeta.badge && <Badge texto={tarjeta.badge} />}
      </div>

      <div style={{ fontSize: 16, fontWeight: 600, color: "var(--text)", marginBottom: 2 }}>{tarjeta.nombre}</div>
      <div style={{ fontSize: 12, color: "var(--accent2)", marginBottom: 12 }}>{tarjeta.recompensa}</div>

      {/* Datos clave */}
      <div style={{ display: "flex", flexWrap: "wrap", gap: "6px 16px", marginBottom: 12 }}>
        <div>
          <div style={{ fontSize: 10, color: "var(--text3)" }}>Anualidad</div>
          <div style={{ fontSize: 13, color: "var(--text)", fontWeight: 500 }}>{fmtAnualidad(tarjeta.anualidad)}</div>
        </div>
        <div>
          <div style={{ fontSize: 10, color: "var(--text3)" }}>CAT</div>
          <div style={{ fontSize: 13, color: "var(--text)", fontWeight: 500 }}>{tarjeta.cat}%</div>
        </div>
      </div>

      <div style={{ fontSize: 12, color: "var(--text2)", lineHeight: 1.5, marginBottom: 14, flex: 1 }}>
        {tarjeta.beneficio}
      </div>

      {detalles && (
        <div style={{ borderTop: "1px solid var(--border)", paddingTop: 12, marginBottom: 14 }}>
          {tarjeta.detalles.map((d, i) => (
            <div key={i} style={{ display: "flex", alignItems: "flex-start", gap: 8, fontSize: 12, color: "var(--text2)", marginBottom: 7, lineHeight: 1.45 }}>
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="var(--accent)" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0, marginTop: 1 }}>
                <polyline points="20 6 9 17 4 12" />
              </svg>
              {d}
            </div>
          ))}
        </div>
      )}

      <div style={{ display: "flex", gap: 8 }}>
        <button
          type="button"
          onClick={() => onSolicitar(tarjeta)}
          style={{
            flex: 1, padding: "9px", fontSize: 13, fontWeight: 500,
            background: "var(--accent)", color: "#FFFFFF",
            border: "none", borderRadius: 9, cursor: "pointer", fontFamily: "inherit",
          }}
        >
          Solicitar
        </button>
        <button
          type="button"
          onClick={() => setDetalles(v => !v)}
          style={{
            padding: "9px 14px", fontSize: 13, fontWeight: 500,
            background: "transparent", color: "var(--text2)",
            border: "1px solid var(--border2)", borderRadius: 9, cursor: "pointer", fontFamily: "inherit",
          }}
        >
          {detalles ? "Ocultar" : "Ver detalles"}
        </button>
      </div>
    </div>
  );
}
