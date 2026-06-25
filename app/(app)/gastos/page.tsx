"use client";

import { useState } from "react";
import { transactions, categoryRules, fmtMXN, accountColor, accountLabel } from "@/lib/data";
import type { Transaction } from "@/lib/types";

type Mes = "mayo" | "abril" | "marzo" | "todos";
type Cuenta = "todas" | "bbva" | "amex" | "nu";

export default function GastosPage() {
  const [mes, setMes] = useState<Mes>("mayo");
  const [cuenta, setCuenta] = useState<Cuenta>("todas");
  const [openCats, setOpenCats] = useState<Set<string>>(new Set());
  const [corrections, setCorrections] = useState<Record<number, string>>({});
  const [openMenu, setOpenMenu] = useState<number | null>(null);

  function getFiltered(): Transaction[] {
    const pool: Transaction[] =
      mes === "todos"
        ? [...transactions.mayo, ...transactions.abril, ...transactions.marzo]
        : transactions[mes] ?? [];
    return cuenta === "todas" ? pool : pool.filter(t => t.account === cuenta);
  }

  const filtered = getFiltered();
  const spending = filtered.filter(t => t.amount < 0);
  const totalGasto = spending.reduce((s, t) => s + Math.abs(t.amount), 0);

  function getCat(tx: Transaction) {
    return corrections[tx.id] ?? tx.cat;
  }

  const groups: Record<string, Transaction[]> = {};
  filtered.forEach(tx => {
    const cat = getCat(tx);
    if (!groups[cat]) groups[cat] = [];
    groups[cat].push(tx);
  });

  const sorted = Object.entries(groups).sort((a, b) => {
    const sumA = a[1].filter(t => t.amount < 0).reduce((s, t) => s + Math.abs(t.amount), 0);
    const sumB = b[1].filter(t => t.amount < 0).reduce((s, t) => s + Math.abs(t.amount), 0);
    return sumB - sumA;
  });

  const spendCats = sorted.filter(([cat]) => cat !== "Ingreso");

  function toggleCat(cat: string) {
    setOpenCats(prev => {
      const next = new Set(prev);
      if (next.has(cat)) next.delete(cat);
      else next.add(cat);
      return next;
    });
  }

  function reassign(txId: number, newCat: string) {
    setCorrections(prev => ({ ...prev, [txId]: newCat }));
    setOpenMenu(null);
  }

  const mesBtns: { label: string; val: Mes }[] = [
    { label: "Mayo 2025", val: "mayo" },
    { label: "Abril 2025", val: "abril" },
    { label: "Marzo 2025", val: "marzo" },
    { label: "Histórico", val: "todos" },
  ];
  const cuentaBtns: { label: string; val: Cuenta }[] = [
    { label: "Todas", val: "todas" },
    { label: "BBVA", val: "bbva" },
    { label: "Amex", val: "amex" },
    { label: "Nu", val: "nu" },
  ];

  return (
    <div style={{ flex: 1, overflowY: "auto", padding: 22 }} onClick={() => setOpenMenu(null)}>
      <div style={{ fontFamily: "var(--font-geist-sans), sans-serif", fontSize: 21, marginBottom: 3 }}>
        Mis gastos
      </div>
      <div style={{ fontSize: 12, color: "var(--text2)", marginBottom: 18 }}>
        Compras agrupadas por categoría — detectadas automáticamente
      </div>

      {/* Filters */}
      <div style={{ display: "flex", gap: 8, marginBottom: 20, flexWrap: "wrap" }}>
        {mesBtns.map(b => (
          <button key={b.val} className={`filter-btn ${mes === b.val ? "active" : ""}`} onClick={() => setMes(b.val)}>
            {b.label}
          </button>
        ))}
        <div style={{ width: 1, background: "var(--border)", margin: "0 4px" }} />
        {cuentaBtns.map(b => (
          <button key={b.val} className={`filter-btn ${cuenta === b.val ? "active" : ""}`} onClick={() => setCuenta(b.val)}>
            {b.label}
          </button>
        ))}
      </div>

      {/* Summary */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 10, marginBottom: 22 }}>
        <div style={{ background: "var(--card)", border: "1px solid var(--border)", borderRadius: "var(--radius-sm)", padding: 14 }}>
          <div style={{ fontSize: 20, fontFamily: "var(--font-geist-sans), sans-serif", marginBottom: 2, color: "var(--danger)" }}>
            {fmtMXN(-totalGasto)}
          </div>
          <div style={{ fontSize: 10, color: "var(--text3)" }}>Gasto total del mes</div>
        </div>
        <div style={{ background: "var(--card)", border: "1px solid var(--border)", borderRadius: "var(--radius-sm)", padding: 14 }}>
          <div style={{ fontSize: 20, fontFamily: "var(--font-geist-sans), sans-serif", marginBottom: 2 }}>
            {spending.length}
          </div>
          <div style={{ fontSize: 10, color: "var(--text3)" }}>Transacciones</div>
        </div>
        <div style={{ background: "var(--card)", border: "1px solid var(--border)", borderRadius: "var(--radius-sm)", padding: 14 }}>
          <div style={{ fontSize: 20, fontFamily: "var(--font-geist-sans), sans-serif", marginBottom: 2 }}>
            {spendCats.length}
          </div>
          <div style={{ fontSize: 10, color: "var(--text3)" }}>Categorías</div>
        </div>
      </div>

      {/* Categories */}
      {sorted.map(([catName, catTxs]) => {
        const rule = categoryRules[catName] ?? { emoji: "📦", color: "var(--text3)" };
        const catSpend = catTxs.filter(t => t.amount < 0).reduce((s, t) => s + Math.abs(t.amount), 0);
        const catIncome = catTxs.filter(t => t.amount > 0).reduce((s, t) => s + t.amount, 0);
        const pct = totalGasto > 0 ? Math.round((catSpend / totalGasto) * 100) : 0;
        const isIncome = catName === "Ingreso";
        const isOpen = openCats.has(catName);
        const otherCats = Object.keys(categoryRules).filter(c => c !== catName);

        return (
          <div key={catName} className={`cat-card ${isOpen ? "open" : ""}`}>
            <div className="cat-header" onClick={() => toggleCat(catName)}>
              <div className="cat-emoji" style={{ borderColor: rule.color + "22" }}>
                {rule.emoji}
              </div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontSize: 13, fontWeight: 500, color: "var(--text)", marginBottom: 3 }}>{catName}</div>
                <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                  <div className="cat-bar-track">
                    <div
                      className="cat-bar-fill"
                      style={{ width: isIncome ? "0%" : `${pct}%`, background: rule.color }}
                    />
                  </div>
                  <span style={{ fontSize: 10, color: "var(--text3)", minWidth: 28, textAlign: "right" }}>
                    {isIncome ? "" : `${pct}%`}
                  </span>
                </div>
              </div>
              <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-end", gap: 2, flexShrink: 0 }}>
                <span style={{ fontSize: 15, fontFamily: "var(--font-geist-sans), sans-serif", color: isIncome ? "var(--accent2)" : "var(--text)" }}>
                  {isIncome ? "+" + fmtMXN(catIncome) : fmtMXN(-catSpend)}
                </span>
                <span style={{ fontSize: 10, color: "var(--text3)" }}>
                  {catTxs.length} {catTxs.length === 1 ? "movimiento" : "movimientos"}
                </span>
              </div>
              <svg className="cat-chevron" viewBox="0 0 24 24"><polyline points="6 9 12 15 18 9"/></svg>
            </div>

            <div className="cat-transactions">
              {catTxs.map(tx => {
                const isPos = tx.amount > 0;
                return (
                  <div key={tx.id} className="cat-tx" onClick={e => e.stopPropagation()}>
                    <span style={{ width: 5, height: 5, borderRadius: "50%", background: accountColor(tx.account), flexShrink: 0 }} />
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ color: "var(--text)", fontSize: 12, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{tx.name}</div>
                      <div style={{ color: "var(--text3)", fontSize: 10, marginTop: 1, display: "flex", alignItems: "center", gap: 6 }}>
                        {tx.date}
                        <span style={{ color: "var(--border2)" }}>·</span>
                        <span style={{ color: accountColor(tx.account) }}>{accountLabel(tx.account)}</span>
                      </div>
                    </div>
                    <div style={{ display: "flex", alignItems: "center", gap: 4 }}>
                      <span style={{ fontSize: 13, fontWeight: 500, color: isPos ? "var(--accent2)" : "var(--danger)", flexShrink: 0 }}>
                        {isPos ? "+" : ""}{fmtMXN(tx.amount)}
                      </span>
                      <div style={{ position: "relative" }}>
                        <button
                          className="reassign-btn"
                          onClick={e => { e.stopPropagation(); setOpenMenu(openMenu === tx.id ? null : tx.id); }}
                          style={{ background: "none", border: "none", cursor: "pointer", color: "var(--text3)", fontSize: 10, padding: "2px 6px", borderRadius: 4, fontFamily: "inherit" }}
                        >
                          Mover ▾
                        </button>
                        {openMenu === tx.id && (
                          <div style={{ position: "absolute", right: 0, top: "100%", background: "var(--card)", border: "1px solid var(--border2)", borderRadius: "var(--radius-sm)", zIndex: 20, minWidth: 160, boxShadow: "0 8px 24px rgba(0,0,0,.4)" }}>
                            {otherCats.map(c => (
                              <button
                                key={c}
                                onClick={e => { e.stopPropagation(); reassign(tx.id, c); }}
                                style={{ display: "block", width: "100%", textAlign: "left", padding: "8px 12px", fontSize: 12, color: "var(--text2)", background: "none", border: "none", cursor: "pointer", fontFamily: "inherit" }}
                                onMouseEnter={e => (e.currentTarget.style.background = "var(--bg3)")}
                                onMouseLeave={e => (e.currentTarget.style.background = "none")}
                              >
                                {categoryRules[c]?.emoji} {c}
                              </button>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        );
      })}
    </div>
  );
}
