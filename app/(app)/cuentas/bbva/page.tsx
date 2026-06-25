import { bbvaTransactions, fmtMXN } from "@/lib/data";

export default function BBVAPage() {
  return (
    <div className="page">
      <div className="account-header">
        <div style={{ fontSize: 17, fontFamily: "var(--font-geist-sans), sans-serif", marginBottom: 3 }}>
          BBVA Débito
        </div>
        <div style={{ fontSize: 11, color: "var(--text3)", marginBottom: 14, display: "flex", alignItems: "center", gap: 8 }}>
          **** **** **** 4821 <span className="src-icon src-gmail">Gmail</span>
        </div>
        <div style={{ fontSize: 28, fontFamily: "var(--font-geist-sans), sans-serif", color: "var(--accent2)" }}>
          $23,740.50
        </div>
        <div style={{ display: "flex", gap: 14, marginTop: 10, flexWrap: "wrap" }}>
          {[
            { label: "Actualizado", val: "Hoy 8:32 am" },
            { label: "Corte",       val: "31 mayo 2025" },
            { label: "Movimientos", val: "34 este mes" },
          ].map(m => (
            <div key={m.label} style={{ fontSize: 10, color: "var(--text3)" }}>
              {m.label}<span style={{ display: "block", fontSize: 12, color: "var(--text)", marginTop: 1 }}>{m.val}</span>
            </div>
          ))}
        </div>
      </div>

      <table className="data-table">
        <thead><tr><th>Fecha</th><th>Descripción</th><th>Categoría</th><th>Monto</th></tr></thead>
        <tbody>
          {bbvaTransactions.map(tx => (
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
