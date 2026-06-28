"use client";

import { useMemo, useState } from "react";
import {
  calcularDeclaracion,
  fmtMXN,
  DISCLAIMER_FISCAL,
  PERIODOS,
  TIPO_CONTRIBUYENTE_LABEL,
  type TipoContribuyente,
  type TipoDeclaracion,
  type ResultadoDeclaracion,
} from "@/lib/declaraciones";

const TIPOS: TipoContribuyente[] = ["fisica", "fisica_actividad", "moral"];

// ── Disclaimer legal, siempre visible ──
function Disclaimer() {
  return (
    <div
      style={{
        display: "flex", alignItems: "flex-start", gap: 10,
        background: "var(--accent3)", border: "1px solid #BFDBFE",
        borderRadius: 10, padding: "12px 14px", marginBottom: 18,
      }}
    >
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="var(--accent)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0, marginTop: 1 }}>
        <circle cx="12" cy="12" r="10" /><line x1="12" y1="8" x2="12" y2="12" /><line x1="12" y1="16" x2="12.01" y2="16" />
      </svg>
      <div style={{ fontSize: 12, color: "var(--accent)", lineHeight: 1.55 }}>{DISCLAIMER_FISCAL}</div>
    </div>
  );
}

// ── Selector segmentado (azul/blanco) ──
function Segmented<T extends string>({ value, options, onChange }: {
  value: T;
  options: { id: T; label: string }[];
  onChange: (v: T) => void;
}) {
  return (
    <div style={{ display: "inline-flex", flexWrap: "wrap", gap: 6, background: "var(--bg2)", border: "1px solid var(--border)", borderRadius: 10, padding: 4 }}>
      {options.map(o => {
        const active = o.id === value;
        return (
          <button
            key={o.id}
            type="button"
            onClick={() => onChange(o.id)}
            style={{
              padding: "7px 14px", borderRadius: 7, fontSize: 13, fontWeight: 500, cursor: "pointer", fontFamily: "inherit",
              background: active ? "var(--accent)" : "transparent",
              color: active ? "#FFFFFF" : "var(--text2)",
              border: active ? "none" : "1px solid transparent",
              transition: "all 0.15s ease",
            }}
          >
            {o.label}
          </button>
        );
      })}
    </div>
  );
}

function SummaryCard({ label, value, sub, accent }: { label: string; value: string; sub?: string; accent?: string }) {
  return (
    <div style={{ background: "var(--card)", border: "1px solid var(--border)", borderRadius: 12, padding: "16px 18px" }}>
      <div style={{ fontSize: 12, color: "var(--text3)", marginBottom: 8 }}>{label}</div>
      <div style={{ fontSize: 20, fontWeight: 600, letterSpacing: "-0.02em", color: accent ?? "var(--text)" }}>{value}</div>
      {sub && <div style={{ fontSize: 11, color: "var(--text3)", marginTop: 4 }}>{sub}</div>}
    </div>
  );
}

function FuenteBadge({ fuente }: { fuente: string }) {
  return (
    <span style={{
      fontSize: 10, fontWeight: 600, color: "var(--text3)",
      background: "var(--bg3)", border: "1px solid var(--border)",
      borderRadius: 5, padding: "1px 6px", whiteSpace: "nowrap",
    }}>
      {fuente}
    </span>
  );
}

// Construye el HTML del borrador y lo abre en una ventana nueva para imprimir /
// guardar como PDF. Sin dependencias: usa el diálogo nativo del navegador.
function descargarBorrador(r: ResultadoDeclaracion) {
  const filas = r.movimientos
    .map(m => `<tr>
      <td>${m.concepto}${m.personal ? " <em>(personal)</em>" : ""}</td>
      <td>${m.fuente}</td>
      <td class="r">${m.clase === "ingreso" ? "Ingreso" : "Deducción"}</td>
      <td class="r">${fmtMXN(m.monto)}</td>
      <td class="r">${fmtMXN(m.iva)}</td>
    </tr>`)
    .join("");

  const resultadoLabel = r.totalResultado >= 0 ? "A cargo" : "A favor";
  const html = `<!doctype html><html lang="es"><head><meta charset="utf-8">
  <title>Borrador declaración — Neto</title>
  <style>
    *{box-sizing:border-box} body{font-family:-apple-system,Segoe UI,Roboto,sans-serif;color:#0F172A;margin:40px;font-size:13px}
    h1{font-size:20px;margin:0 0 4px} .muted{color:#64748B}
    .disc{background:#EFF6FF;border:1px solid #BFDBFE;color:#1E40AF;border-radius:8px;padding:12px 14px;margin:18px 0;line-height:1.5}
    table{width:100%;border-collapse:collapse;margin-top:10px} th,td{text-align:left;padding:7px 8px;border-bottom:1px solid #E2E8F0}
    th{font-size:11px;color:#64748B;text-transform:uppercase;letter-spacing:.04em} .r{text-align:right}
    .grid{display:grid;grid-template-columns:1fr 1fr;gap:8px;margin-top:14px}
    .kv{border:1px solid #E2E8F0;border-radius:8px;padding:10px 12px} .kv b{display:block;font-size:16px;margin-top:2px}
    .total{font-size:16px;font-weight:700;margin-top:16px}
  </style></head><body>
  <h1>Borrador de declaración — ${r.tipoDeclaracion === "mensual" ? "Mensual" : "Anual"}</h1>
  <div class="muted">${TIPO_CONTRIBUYENTE_LABEL[r.tipoContribuyente]} · ${r.regimenLabel} · ${r.periodoLabel}</div>
  <div class="disc"><strong>Aviso:</strong> ${DISCLAIMER_FISCAL}</div>
  <div class="grid">
    <div class="kv">Ingresos del periodo <b>${fmtMXN(r.ingresosAcumulados)}</b></div>
    <div class="kv">Deducciones <b>${fmtMXN(r.deduccionesTotal)}</b></div>
    <div class="kv">Base gravable <b>${fmtMXN(r.baseGravable)}</b></div>
    <div class="kv">ISR estimado <b>${fmtMXN(r.isrResultado)}</b></div>
    <div class="kv">IVA estimado <b>${r.ivaAplica ? fmtMXN(r.ivaResultado) : "No aplica en anual"}</b></div>
    <div class="kv">Resultado (${resultadoLabel}) <b>${fmtMXN(Math.abs(r.totalResultado))}</b></div>
  </div>
  <h3 style="margin-top:22px">Movimientos considerados</h3>
  <table><thead><tr><th>Concepto</th><th>Fuente</th><th class="r">Tipo</th><th class="r">Monto</th><th class="r">IVA</th></tr></thead>
  <tbody>${filas}</tbody></table>
  <p class="muted" style="margin-top:24px">Generado por Neto — cálculo preliminar. Neto no presenta declaraciones ante el SAT.</p>
  </body></html>`;

  const w = window.open("", "_blank", "width=900,height=700");
  if (!w) return;
  w.document.write(html);
  w.document.close();
  w.focus();
  // Pequeño retardo para que el contenido renderice antes de abrir el diálogo.
  setTimeout(() => w.print(), 350);
}

export default function DeclaracionTool() {
  const [tipo, setTipo] = useState<TipoContribuyente>("fisica");
  const [decl, setDecl] = useState<TipoDeclaracion>("mensual");
  const [periodo, setPeriodo] = useState<string>(PERIODOS.mensual[0]);

  const resultado = useMemo(() => calcularDeclaracion(tipo, decl, periodo), [tipo, decl, periodo]);

  function cambiarDecl(d: TipoDeclaracion) {
    setDecl(d);
    setPeriodo(PERIODOS[d][0]); // resetea el periodo a uno válido para el tipo
  }

  const aCargo = resultado.totalResultado >= 0;
  const resultadoColor = aCargo ? "#D97706" : "#10b981"; // ámbar (a cargo) / verde (a favor)
  const ingresos = resultado.movimientos.filter(m => m.clase === "ingreso");
  const deducciones = resultado.movimientos.filter(m => m.clase === "deduccion");

  return (
    <div className="page">
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 3, flexWrap: "wrap", gap: 8 }}>
        <div style={{ fontFamily: "var(--font-geist-sans), sans-serif", fontSize: 21 }}>Declaraciones SAT</div>
        <span style={{ fontSize: 11, fontWeight: 700, letterSpacing: "0.04em", textTransform: "uppercase", color: "#B45309", background: "#FEF3C7", border: "1px solid #FDE68A", borderRadius: 6, padding: "3px 8px" }}>
          Business
        </span>
      </div>
      <div style={{ fontSize: 12, color: "var(--text2)", marginBottom: 16 }}>
        Prepara un borrador de cálculo a partir de tus datos. Tú o tu contador lo revisan y lo presentan.
      </div>

      <Disclaimer />

      {/* Selectores */}
      <div style={{ display: "flex", flexWrap: "wrap", gap: 18, marginBottom: 20 }}>
        <div>
          <div className="section-title">Tipo de contribuyente</div>
          <Segmented
            value={tipo}
            onChange={setTipo}
            options={TIPOS.map(t => ({ id: t, label: TIPO_CONTRIBUYENTE_LABEL[t] }))}
          />
        </div>
        <div>
          <div className="section-title">Declaración</div>
          <Segmented
            value={decl}
            onChange={cambiarDecl}
            options={[{ id: "mensual" as TipoDeclaracion, label: "Mensual (IVA e ISR)" }, { id: "anual" as TipoDeclaracion, label: "Anual" }]}
          />
        </div>
        <div>
          <div className="section-title">Periodo</div>
          <select
            value={periodo}
            onChange={e => setPeriodo(e.target.value)}
            style={{ fontFamily: "inherit", fontSize: 13, color: "var(--text)", background: "var(--bg2)", border: "1px solid var(--border)", borderRadius: 10, padding: "9px 12px", cursor: "pointer" }}
          >
            {PERIODOS[decl].map(p => <option key={p} value={p}>{p}</option>)}
          </select>
        </div>
      </div>

      <div style={{ fontSize: 12, color: "var(--text3)", marginBottom: 12 }}>
        {resultado.regimenLabel} · {resultado.periodoLabel}
      </div>

      {/* Tarjetas de resumen */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))", gap: 10, marginBottom: 14 }}>
        <SummaryCard label="Ingresos del periodo" value={fmtMXN(resultado.ingresosAcumulados)} sub="acumulados" />
        <SummaryCard label="Deducciones" value={fmtMXN(resultado.deduccionesTotal)} sub={resultado.deduccionesPersonales > 0 ? "incluye personales" : "autorizadas"} />
        <SummaryCard label="Base gravable" value={fmtMXN(resultado.baseGravable)} sub={resultado.tipoContribuyente === "moral" ? "utilidad fiscal" : undefined} />
        <SummaryCard label="ISR estimado" value={fmtMXN(resultado.isrResultado)} sub={resultado.retenciones > 0 || resultado.pagosProvisionales > 0 ? "neto de retenciones/pagos" : undefined} />
        <SummaryCard
          label="IVA estimado"
          value={resultado.ivaAplica ? fmtMXN(resultado.ivaResultado) : "—"}
          sub={resultado.ivaAplica ? undefined : "se declara mensual"}
        />
        <SummaryCard
          label={`Resultado (${aCargo ? "a cargo" : "a favor"})`}
          value={fmtMXN(Math.abs(resultado.totalResultado))}
          accent={resultadoColor}
          sub={aCargo ? "a pagar al SAT" : "saldo a tu favor"}
        />
      </div>

      <div style={{ marginBottom: 22 }}>
        <button
          type="button"
          onClick={() => descargarBorrador(resultado)}
          style={{
            display: "inline-flex", alignItems: "center", gap: 8,
            padding: "10px 18px", fontSize: 14, fontWeight: 500,
            background: "var(--accent)", color: "#FFFFFF",
            border: "none", borderRadius: 10, cursor: "pointer", fontFamily: "inherit",
          }}
        >
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" /><polyline points="7 10 12 15 17 10" /><line x1="12" y1="15" x2="12" y2="3" />
          </svg>
          Descargar borrador PDF
        </button>
      </div>

      {/* Desglose de movimientos */}
      <div className="section-title">De dónde salió cada cifra</div>
      <DesgloseTabla titulo="Ingresos" movimientos={ingresos} />
      <DesgloseTabla titulo="Deducciones" movimientos={deducciones} />
    </div>
  );
}

function DesgloseTabla({ titulo, movimientos }: { titulo: string; movimientos: ResultadoDeclaracion["movimientos"] }) {
  const totalMonto = movimientos.reduce((s, m) => s + m.monto, 0);
  const totalIva = movimientos.reduce((s, m) => s + m.iva, 0);
  return (
    <div style={{ marginBottom: 16 }}>
      <div style={{ fontSize: 12, fontWeight: 600, color: "var(--text2)", margin: "10px 0 6px" }}>{titulo}</div>
      <div style={{ border: "1px solid var(--border)", borderRadius: 10, overflow: "hidden" }}>
        {movimientos.map((m, i) => (
          <div
            key={i}
            style={{
              display: "grid", gridTemplateColumns: "1fr auto auto", gap: 10, alignItems: "center",
              padding: "10px 14px", borderBottom: i < movimientos.length - 1 ? "1px solid var(--border)" : "none",
            }}
          >
            <div style={{ minWidth: 0 }}>
              <div style={{ fontSize: 13, color: "var(--text)", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                {m.concepto}{m.personal && <span style={{ color: "var(--text3)" }}> · personal</span>}
              </div>
              <div style={{ fontSize: 11, color: "var(--text3)", marginTop: 2 }}>{m.fecha}</div>
            </div>
            <FuenteBadge fuente={m.fuente} />
            <div style={{ textAlign: "right", minWidth: 90 }}>
              <div style={{ fontSize: 13, color: "var(--text)" }}>{fmtMXN(m.monto)}</div>
              {m.iva > 0 && <div style={{ fontSize: 11, color: "var(--text3)" }}>IVA {fmtMXN(m.iva)}</div>}
            </div>
          </div>
        ))}
        <div style={{ display: "grid", gridTemplateColumns: "1fr auto", gap: 10, padding: "10px 14px", background: "var(--bg2)", borderTop: "1px solid var(--border)" }}>
          <div style={{ fontSize: 12, fontWeight: 600, color: "var(--text2)" }}>Total {titulo.toLowerCase()}</div>
          <div style={{ textAlign: "right" }}>
            <div style={{ fontSize: 13, fontWeight: 600, color: "var(--text)" }}>{fmtMXN(totalMonto)}</div>
            {totalIva > 0 && <div style={{ fontSize: 11, color: "var(--text3)" }}>IVA {fmtMXN(totalIva)}</div>}
          </div>
        </div>
      </div>
    </div>
  );
}
