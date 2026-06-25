"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { loadBudget, loadBudgetState, colorForPct, formatMXN, BUDGET_EVENT } from "@/lib/budget";

/**
 * Widget compacto del estado del presupuesto. Se muestra solo si el usuario ya
 * configuró un presupuesto (lee neto_budget + neto_budget_state de localStorage).
 * Se actualiza al recibir el evento neto-budget-update.
 */
export default function BudgetWidget() {
  const [data, setData] = useState<{ monthly: number; spent: number; pct: number } | null>(null);

  useEffect(() => {
    const read = () => {
      const b = loadBudget();
      const s = loadBudgetState();
      if (b && b.monthly > 0 && s) setData({ monthly: b.monthly, spent: s.spent, pct: s.pct });
      else setData(null);
    };
    read();
    window.addEventListener(BUDGET_EVENT, read);
    return () => window.removeEventListener(BUDGET_EVENT, read);
  }, []);

  if (!data) return null;
  const color = colorForPct(data.pct);

  return (
    <Link href="/presupuesto" style={{ textDecoration: "none" }}>
      <div style={{
        display: "flex", alignItems: "center", gap: 12,
        padding: "8px 16px", flexShrink: 0,
        background: "var(--bg2)", borderBottom: "1px solid var(--border)",
        cursor: "pointer",
      }}>
        <span style={{ fontSize: 11, color: "var(--text3)", fontWeight: 500, flexShrink: 0 }}>Presupuesto</span>
        <div style={{ flex: 1, height: 6, borderRadius: 3, background: "var(--bg3)", overflow: "hidden", minWidth: 60 }}>
          <div style={{ width: `${Math.min(data.pct, 100)}%`, height: "100%", background: color, borderRadius: 3, transition: "width 0.5s ease" }} />
        </div>
        <span style={{ fontSize: 11, color: "var(--text2)", flexShrink: 0 }}>
          {formatMXN(data.spent)} / {formatMXN(data.monthly)}
        </span>
        <span style={{ fontSize: 11, fontWeight: 600, color, flexShrink: 0, minWidth: 34, textAlign: "right" }}>
          {Math.round(data.pct)}%
        </span>
      </div>
    </Link>
  );
}
