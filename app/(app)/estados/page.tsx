export default function EstadosPage() {
  const accounts = [
    { name: "BBVA Débito",        badge: "badge-green", badgeText: "Leído",         val: "$23,740", valCls: "good",   meta: "Saldo disponible · Mayo 2025" },
    { name: "Amex Gold",          badge: "badge-red",   badgeText: "Vence en 4 días", val: "$12,400", valCls: "danger", meta: "Saldo a pagar · Corte 15 mayo" },
    { name: "Nu Crédito",         badge: "badge-warn",  badgeText: "Pago mínimo",   val: "$6,240",  valCls: "danger", meta: "Saldo actual · Corte 20 mayo" },
    { name: "Sheets — Presupuesto", badge: "badge-info", badgeText: "Sheets",        val: "$20,000", valCls: "",       meta: "Presupuesto mensual definido" },
  ];

  const movements = [
    { date: "26 may", desc: "Uber Eats",        account: "Amex Gold",    cat: "Restaurantes",   src: "gmail",  amount: "-$340",   neg: true },
    { date: "25 may", desc: "OXXO San Pedro",   account: "BBVA",         cat: "Supermercado",   src: "gmail",  amount: "-$180",   neg: true },
    { date: "24 may", desc: "Netflix",           account: "Nu",           cat: "Suscripción",    src: "gmail",  amount: "-$179",   neg: true },
    { date: "23 may", desc: "PEMEX",             account: "BBVA",         cat: "Gasolina",       src: "gmail",  amount: "-$850",   neg: true },
    { date: "20 may", desc: "Presupuesto mayo",  account: "Sheets",       cat: "Planificación",  src: "sheets", amount: "$20,000", neg: false },
    { date: "20 may", desc: "Depósito nómina",   account: "BBVA Nómina",  cat: "Ingreso",        src: "gmail",  amount: "+$18,640",neg: false },
    { date: "15 may", desc: "Adobe CC",          account: "Nu",           cat: "Suscripción",    src: "gmail",  amount: "-$289",   neg: true },
  ];

  return (
    <div className="page">
      <div style={{ fontFamily: "var(--font-geist-sans), sans-serif", fontSize: 21, marginBottom: 3 }}>
        Estados de cuenta
      </div>
      <div style={{ fontSize: 12, color: "var(--text2)", marginBottom: 18 }}>
        4 estados leídos automáticamente de tu Gmail este mes
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))", gap: 10, marginBottom: 14 }}>
        {accounts.map(a => (
          <div key={a.name} className="data-card">
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 10 }}>
              <span style={{ fontSize: 12, fontWeight: 500, color: "var(--text)" }}>{a.name}</span>
              <span className={`badge ${a.badge}`}>{a.badgeText}</span>
            </div>
            <div style={{
              fontSize: 22,
              fontFamily: "var(--font-geist-sans), sans-serif",
              marginBottom: 3,
              color: a.valCls === "good" ? "var(--accent2)" : a.valCls === "danger" ? "var(--danger)" : "var(--text)",
            }}>
              {a.val}
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
          {movements.map((m, i) => (
            <tr key={i}>
              <td>{m.date}</td>
              <td>{m.desc}</td>
              <td>{m.account}</td>
              <td className="cat-pill"><span>{m.cat}</span></td>
              <td><span className={`src-icon src-${m.src}`}>{m.src === "gmail" ? "Gmail" : "Sheets"}</span></td>
              <td className={`amount ${m.neg ? "neg" : "pos"}`}>{m.amount}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
