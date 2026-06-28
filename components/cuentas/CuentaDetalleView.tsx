"use client";

import { fmtMXN } from "@/lib/data";
import { useCuentasData } from "@/lib/useCuentasData";
import type { CuentaId } from "@/lib/cuentas";
import { EstadoTag, DemoBanner } from "./EstadoTag";

const SALDO_COLOR: Record<string, string> = {
  good: "var(--accent2)",
  danger: "var(--danger)",
  warn: "var(--warn)",
};

export default function CuentaDetalleView({ cuentaId, titulo }: { cuentaId: CuentaId; titulo: string }) {
  const { state, data, isDemo } = useCuentasData();
  const cuenta = data?.detalle.find(c => c.id === cuentaId) ?? null;

  return (
    <div className="page">
      <style>{`@keyframes skPulse { 0%,100%{opacity:1} 50%{opacity:0.4} }`}</style>
      {state === "loading" && (
        <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
          <div style={{ width: 200, height: 28, borderRadius: 8, background: "var(--bg3)", animation: "skPulse 1.4s ease infinite" }} />
          <div style={{ width: 140, height: 36, borderRadius: 8, background: "var(--bg3)", animation: "skPulse 1.4s ease infinite", marginBottom: 6 }} />
          {[1, 2, 3, 4].map(i => (
            <div key={i} style={{ height: 38, borderRadius: 8, background: "var(--bg3)", animation: "skPulse 1.4s ease infinite" }} />
          ))}
        </div>
      )}

      {state === "error" && (
        <div style={{ textAlign: "center", padding: "40px 20px", color: "var(--text3)" }}>
          <div style={{ fontSize: 32, marginBottom: 8 }}>⚠</div>
          <div style={{ fontSize: 14 }}>No se pudo cargar la cuenta</div>
        </div>
      )}

      {state === "done" && cuenta && (
        <>
          {isDemo && <DemoBanner />}

          <div className="account-header">
            <div style={{ fontSize: 17, fontFamily: "var(--font-geist-sans), sans-serif", marginBottom: 3 }}>
              {titulo}
            </div>
            <div style={{ fontSize: 11, color: "var(--text3)", marginBottom: 14, display: "flex", alignItems: "center", gap: 8 }}>
              {cuenta.tarjeta.valor}
              <span className="src-icon src-gmail">Gmail</span>
              <EstadoTag estado={cuenta.tarjeta.estado} />
            </div>
            <div style={{ fontSize: 28, fontFamily: "var(--font-geist-sans), sans-serif", color: SALDO_COLOR[cuenta.saldoColor], display: "inline-flex", alignItems: "center" }}>
              {cuenta.saldoTexto.valor}
              <EstadoTag estado={cuenta.saldoTexto.estado} />
            </div>
            <div style={{ display: "flex", gap: 14, marginTop: 10, flexWrap: "wrap" }}>
              {cuenta.stats.map(s => (
                <div key={s.label} style={{ fontSize: 10, color: "var(--text3)" }}>
                  {s.label}
                  <span style={{ display: "flex", alignItems: "center", fontSize: 12, color: "var(--text)", marginTop: 1 }}>
                    {s.dato.valor}
                    <EstadoTag estado={s.dato.estado} />
                  </span>
                </div>
              ))}
            </div>
          </div>

          {cuenta.alerta && (
            <div className="alert-bubble" style={{ marginBottom: 14 }}>
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke={cuenta.alerta.tipo === "danger" ? "var(--danger)" : "var(--warn)"} strokeWidth="2" style={{ flexShrink: 0, marginTop: 2 }}>
                <circle cx="12" cy="12" r="10" /><line x1="12" y1="8" x2="12" y2="12" /><line x1="12" y1="16" x2="12.01" y2="16" />
              </svg>
              <span style={{ color: cuenta.alerta.tipo === "danger" ? "var(--danger)" : "inherit" }}>{cuenta.alerta.texto}</span>
            </div>
          )}

          <div className="section-title">Movimientos</div>
          <table className="data-table">
            <thead><tr><th>Fecha</th><th>Descripción</th><th>Categoría</th><th>Monto</th></tr></thead>
            <tbody>
              {cuenta.movimientos.map((tx, i) => (
                <tr key={i}>
                  <td>{tx.fecha}</td>
                  <td>{tx.nombre}</td>
                  <td className="cat-pill"><span>{tx.categoria}</span></td>
                  <td className={`amount ${tx.monto < 0 ? "neg" : "pos"}`}>
                    {tx.monto > 0 ? "+" : ""}{fmtMXN(tx.monto)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </>
      )}
    </div>
  );
}
