import { amexTransactions, fmtMXN } from "@/lib/data";

export default function AmexPage() {
  return (
    <div className="page">
      <div className="account-header">
        <div style={{ fontSize: 17, fontFamily: "var(--font-geist-sans), sans-serif", marginBottom: 3 }}>
          American Express Gold
        </div>
        <div style={{ fontSize: 11, color: "var(--text3)", marginBottom: 14, display: "flex", alignItems: "center", gap: 8 }}>
          **** **** **** 9034 <span className="src-icon src-gmail">Gmail</span>
        </div>
        <div style={{ fontSize: 28, fontFamily: "var(--font-geist-sans), sans-serif", color: "var(--danger)" }}>
          $12,400 por pagar
        </div>
        <div style={{ display: "flex", gap: 14, marginTop: 10, flexWrap: "wrap" }}>
          {[
            { label: "Fecha límite", val: "31 mayo — 4 días", danger: true },
            { label: "Límite",       val: "$40,000" },
            { label: "Disponible",   val: "$27,600" },
          ].map(m => (
            <div key={m.label} style={{ fontSize: 10, color: "var(--text3)" }}>
              {m.label}
              <span style={{ display: "block", fontSize: 12, color: m.danger ? "var(--danger)" : "var(--text)", marginTop: 1 }}>
                {m.val}
              </span>
            </div>
          ))}
        </div>
      </div>

      <div className="alert-bubble" style={{ marginBottom: 14 }}>
        <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="var(--danger)" strokeWidth="2" style={{ flexShrink: 0, marginTop: 2 }}>
          <circle cx="12" cy="12" r="10"/>
          <line x1="12" y1="8" x2="12" y2="12"/>
          <line x1="12" y1="16" x2="12.01" y2="16"/>
        </svg>
        <span style={{ color: "var(--danger)" }}>Vence en 4 días. Pagar antes del 31 mayo evita $620 en mora.</span>
      </div>

      <table className="data-table">
        <thead><tr><th>Fecha</th><th>Descripción</th><th>Categoría</th><th>Monto</th></tr></thead>
        <tbody>
          {amexTransactions.map(tx => (
            <tr key={tx.id}>
              <td>{tx.date}</td>
              <td>{tx.name}</td>
              <td className="cat-pill"><span>{tx.cat}</span></td>
              <td className={`amount ${tx.amount < 0 ? "neg" : "pos"}`}>
                {tx.amount > 0 ? "+" : ""}{fmtMXN(tx.amount)}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
