"use client";

import { fmtMXN } from "@/lib/data";
import { useCuentasData } from "@/lib/useCuentasData";
import { EstadoTag, DemoBanner } from "@/components/cuentas/EstadoTag";

const BADGE_CLASS: Record<string, string> = {
  good: "badge-green",
  danger: "badge-red",
  warn: "badge-warn",
  info: "badge-info",
};

const SALDO_COLOR: Record<string, string> = {
  good: "var(--accent2)",
  danger: "var(--danger)",
  warn: "var(--warn)",
  info: "var(--text)",
};

export default function EstadosPage() {
  const { state, data, isDemo } = useCuentasData();

  return (
    <div className="page">
      <style>{`@keyframes skPulse { 0%,100%{opacity:1} 50%{opacity:0.4} }`}</style>

      <div style={{ fontFamily: "var(--font-geist-sans), sans-serif", fontSize: 21, marginBottom: 3 }}>
        Estados de cuenta
      </div>
      <div style={{ fontSize: 12, color: "var(--text2)", marginBottom: 18 }}>
        {state === "loading"
          ? "Leyendo tus estados de cuenta…"
          : isDemo
            ? "Vista de ejemplo — conecta Gmail para tus estados reales"
            : "Estados leídos automáticamente de tu Gmail"}
      </div>

      {isDemo && state === "done" && <DemoBanner />}

      {state === "loading" && (
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))", gap: 10, marginBottom: 14 }}>
          {[1, 2, 3, 4].map(i => (
            <div key={i} style={{ height: 92, borderRadius: 12, background: "var(--bg3)", animation: "skPulse 1.4s ease infinite" }} />
          ))}
        </div>
      )}

      {state === "error" && (
        <div style={{ textAlign: "center", padding: "40px 20px", color: "var(--text3)" }}>
          <div style={{ fontSize: 32, marginBottom: 8 }}>⚠</div>
          <div style={{ fontSize: 14 }}>No se pudieron cargar tus estados</div>
        </div>
      )}

      {state === "done" && data && (
        <>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))", gap: 10, marginBottom: 14 }}>
            {data.cuentasResumen.map(a => (
              <div key={a.id} className="data-card">
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 10 }}>
                  <span style={{ fontSize: 12, fontWeight: 500, color: "var(--text)" }}>{a.nombre}</span>
                  <span className={`badge ${BADGE_CLASS[a.estado] ?? "badge-info"}`}>{a.badgeText}</span>
                </div>
                <div style={{
                  fontSize: 22, fontFamily: "var(--font-geist-sans), sans-serif", marginBottom: 3,
                  color: SALDO_COLOR[a.estado] ?? "var(--text)",
                  display: "flex", alignItems: "center",
                }}>
                  {a.saldo.valor}
                  <EstadoTag estado={a.saldo.estado} />
                </div>
                <div style={{ fontSize: 10, color: "var(--text3)" }}>{a.meta}</div>
              </div>
            ))}
          </div>

          <div className="section-title">Movimientos consolidados</div>
          <table className="data-table">
            <thead>
              <tr>
                <th>Fecha</th><th>Descripción</th><th>Cuenta</th><th>Categoría</th><th>Fuente</th><th>Monto</th>
              </tr>
            </thead>
            <tbody>
              {data.movimientosConsolidados.map((m, i) => (
                <tr key={i}>
                  <td>{m.fecha}</td>
                  <td>{m.desc}</td>
                  <td>{m.cuenta}</td>
                  <td className="cat-pill"><span>{m.categoria}</span></td>
                  <td><span className={`src-icon src-${m.fuente}`}>{m.fuente === "gmail" ? "Gmail" : "Sheets"}</span></td>
                  <td className={`amount ${m.monto < 0 ? "neg" : "pos"}`}>
                    {m.monto > 0 ? "+" : "-"}{fmtMXN(m.monto)}
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
