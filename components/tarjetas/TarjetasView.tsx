"use client";

import { useMemo, useState } from "react";
import {
  CATALOGO,
  recomendarTarjeta,
  registrarSolicitud,
  fmtAnualidad,
  PERFIL_DEMO,
  DISCLAIMER_TARJETAS,
  type CategoriaTarjeta,
  type Tarjeta,
} from "@/lib/tarjetas";
import TarjetaCard from "./TarjetaCard";
import SolicitudModal from "./SolicitudModal";

type FiltroId = "todas" | CategoriaTarjeta;

const FILTROS: { id: FiltroId; label: string }[] = [
  { id: "todas", label: "Todas" },
  { id: "sin_anualidad", label: "Sin anualidad" },
  { id: "cashback", label: "Cashback" },
  { id: "viajes", label: "Viajes" },
  { id: "historial", label: "Para empezar historial" },
];

function Disclaimer({ style }: { style?: React.CSSProperties }) {
  return (
    <div style={{ display: "flex", alignItems: "flex-start", gap: 7, fontSize: 11, color: "var(--text3)", lineHeight: 1.5, ...style }}>
      <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0, marginTop: 1 }}>
        <circle cx="12" cy="12" r="10" /><line x1="12" y1="16" x2="12" y2="12" /><line x1="12" y1="8" x2="12.01" y2="8" />
      </svg>
      <span>{DISCLAIMER_TARJETAS}</span>
    </div>
  );
}

export default function TarjetasView() {
  const [filtro, setFiltro] = useState<FiltroId>("todas");
  const [solicitada, setSolicitada] = useState<Tarjeta | null>(null);

  const rec = useMemo(() => recomendarTarjeta(PERFIL_DEMO), []);
  const catalogo = useMemo(
    () => (filtro === "todas" ? CATALOGO : CATALOGO.filter(t => t.categorias.includes(filtro))),
    [filtro]
  );

  function solicitar(t: Tarjeta) {
    registrarSolicitud(t.id);
    setSolicitada(t);
  }

  return (
    <div className="page">
      <div style={{ fontFamily: "var(--font-geist-sans), sans-serif", fontSize: 21, marginBottom: 3 }}>Tarjetas</div>
      <div style={{ fontSize: 12, color: "var(--text2)", marginBottom: 18 }}>
        Lo que te conviene según tus finanzas — Neto compara y te sugiere, tú decides.
      </div>

      {/* ── PARTE 1 — Tu mejor match ── */}
      <div
        style={{
          position: "relative", overflow: "hidden",
          background: "var(--accent3)", border: "1px solid #BFDBFE", borderRadius: 14,
          padding: "22px 22px 20px", marginBottom: 12,
        }}
      >
        <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: "0.06em", textTransform: "uppercase", color: "var(--accent)", marginBottom: 10 }}>
          Tu mejor match
        </div>
        <div style={{ display: "flex", flexWrap: "wrap", alignItems: "baseline", gap: "2px 10px", marginBottom: 8 }}>
          <span style={{ fontSize: 22, fontWeight: 600, letterSpacing: "-0.02em", color: "var(--text)" }}>{rec.tarjeta.nombre}</span>
          <span style={{ fontSize: 13, color: "var(--text3)" }}>· {rec.tarjeta.banco} · {fmtAnualidad(rec.tarjeta.anualidad)}</span>
        </div>
        <p style={{ fontSize: 14, color: "var(--text)", lineHeight: 1.6, margin: "0 0 16px", maxWidth: 620 }}>
          {rec.razon}
        </p>
        <div style={{ display: "flex", flexWrap: "wrap", alignItems: "center", gap: 12 }}>
          <button
            type="button"
            onClick={() => solicitar(rec.tarjeta)}
            style={{
              padding: "10px 20px", fontSize: 14, fontWeight: 500,
              background: "var(--accent)", color: "#FFFFFF",
              border: "none", borderRadius: 10, cursor: "pointer", fontFamily: "inherit",
            }}
          >
            Solicitar
          </button>
          {rec.ahorroEstimado > 0 && (
            <span style={{ fontSize: 12, color: "var(--accent2)" }}>
              Ahorro estimado ~${Math.round(rec.ahorroEstimado).toLocaleString("es-MX")}/año
            </span>
          )}
        </div>
      </div>

      <Disclaimer style={{ marginBottom: 26 }} />

      {/* ── PARTE 2 — Catálogo ── */}
      <div className="section-title">Explora más opciones</div>

      {/* Filtros (selección única) */}
      <div style={{ display: "flex", flexWrap: "wrap", gap: 8, margin: "4px 0 18px" }}>
        {FILTROS.map(f => {
          const active = f.id === filtro;
          return (
            <button
              key={f.id}
              type="button"
              onClick={() => setFiltro(f.id)}
              style={{
                padding: "7px 14px", fontSize: 12.5, fontWeight: 500, cursor: "pointer", fontFamily: "inherit",
                borderRadius: 20,
                background: active ? "var(--accent)" : "var(--bg2)",
                color: active ? "#FFFFFF" : "var(--text2)",
                border: active ? "1px solid var(--accent)" : "1px solid var(--border)",
                transition: "all 0.15s ease",
              }}
            >
              {f.label}
            </button>
          );
        })}
      </div>

      {/* Grid */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(250px, 1fr))", gap: 12 }}>
        {catalogo.map(t => (
          <TarjetaCard key={t.id} tarjeta={t} onSolicitar={solicitar} />
        ))}
      </div>

      {catalogo.length === 0 && (
        <div style={{ textAlign: "center", padding: "30px 20px", color: "var(--text3)", fontSize: 13 }}>
          No hay tarjetas en esta categoría por ahora.
        </div>
      )}

      <Disclaimer style={{ marginTop: 24 }} />

      <SolicitudModal tarjeta={solicitada} onClose={() => setSolicitada(null)} />
    </div>
  );
}
