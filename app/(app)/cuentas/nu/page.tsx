import { nuTransactions, fmtMXN } from "@/lib/data";

export default function NuPage() {
  return (
    <div className="page">
      <div className="account-header">
        <div style={{ fontSize: 17, fontFamily: "var(--font-geist-sans), sans-serif", marginBottom: 3 }}>
          Nu Crédito
        </div>
        <div style={{ fontSize: 11, color: "var(--text3)", marginBottom: 14, display: "flex", alignItems: "center", gap: 8 }}>
          **** **** **** 2210 <span className="src-icon src-gmail">Gmail</span>
        </div>
        <div style={{ fontSize: 28, fontFamily: "var(--font-geist-sans), sans-serif", color: "var(--danger)" }}>
          $6,240 adeudo
        </div>
        <div style={{ display: "flex", gap: 14, marginTop: 10, flexWrap: "wrap" }}>
          {[
            { label: "Corte",        val: "20 mayo",  danger: false },
            { label: "Pago mínimo",  val: "$460",     warn: true },
            { label: "Pago total",   val: "$6,240",   good: true },
          ].map(m => (
            <div key={m.label} style={{ fontSize: 10, color: "var(--text3)" }}>
              {m.label}
              <span style={{
                display: "block", fontSize: 12, marginTop: 1,
                color: (m as {warn?: boolean}).warn ? "var(--warn)" : (m as {good?: boolean}).good ? "var(--accent2)" : "var(--text)",
              }}>
                {m.val}
              </span>
            </div>
          ))}
        </div>
      </div>

      <div className="alert-bubble" style={{ marginBottom: 14 }}>
        <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="var(--warn)" strokeWidth="2" style={{ flexShrink: 0, marginTop: 2 }}>
          <circle cx="12" cy="12" r="10"/>
          <line x1="12" y1="8" x2="12" y2="12"/>
          <line x1="12" y1="16" x2="12.01" y2="16"/>
        </svg>
        3 meses pagando mínimo = $800/mes en intereses. Pagar el total ahorra $9,600 al año.
      </div>

      <table className="data-table">
        <thead><tr><th>Fecha</th><th>Descripción</th><th>Categoría</th><th>Monto</th></tr></thead>
        <tbody>
          {nuTransactions.map(tx => (
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
