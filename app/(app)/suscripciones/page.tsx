import { subscriptions } from "@/lib/data";

export default function SuscripcionesPage() {
  const total = subscriptions.reduce((s, i) => s + i.amount, 0);

  return (
    <div className="page">
      <div style={{ fontFamily: "var(--font-geist-sans), sans-serif", fontSize: 21, marginBottom: 3 }}>
        Suscripciones activas
      </div>
      <div style={{ fontSize: 12, color: "var(--text2)", marginBottom: 18 }}>
        Detectadas en tus correos bancarios de Gmail
      </div>

      <div className="totals-row">
        <div style={{ flex: 1, textAlign: "center" }}>
          <div style={{ fontSize: 15, fontFamily: "var(--font-geist-sans), sans-serif", marginBottom: 1 }}>${total.toLocaleString("es-MX")}</div>
          <div style={{ fontSize: 10, color: "var(--text3)" }}>Total mensual</div>
        </div>
        <div style={{ flex: 1, textAlign: "center" }}>
          <div style={{ fontSize: 15, fontFamily: "var(--font-geist-sans), sans-serif", marginBottom: 1, color: "var(--danger)" }}>
            ${(total * 12).toLocaleString("es-MX")}
          </div>
          <div style={{ fontSize: 10, color: "var(--text3)" }}>Total anual</div>
        </div>
        <div style={{ flex: 1, textAlign: "center" }}>
          <div style={{ fontSize: 15, fontFamily: "var(--font-geist-sans), sans-serif", marginBottom: 1 }}>{subscriptions.length}</div>
          <div style={{ fontSize: 10, color: "var(--text3)" }}>Servicios activos</div>
        </div>
      </div>

      {subscriptions.map((sub, i) => (
        <div key={sub.id} className="sub-item" style={i === subscriptions.length - 1 ? { borderBottom: "none" } : {}}>
          <div
            className="sub-icon"
            style={{ color: sub.color, borderColor: sub.borderColor, background: sub.bgColor }}
          >
            {sub.initials}
          </div>
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: 13, fontWeight: 500, color: "var(--text)" }}>{sub.name}</div>
            <div style={{ fontSize: 11, color: "var(--text3)", marginTop: 1 }}>
              {sub.nextDate}
              {sub.warning && <span style={{ color: "var(--warn)" }}> · {sub.warning}</span>}
            </div>
          </div>
          <div>
            <div style={{
              fontSize: 14,
              fontFamily: "var(--font-geist-sans), sans-serif",
              textAlign: "right",
              color: sub.amount >= 200 ? "var(--warn)" : "var(--text)",
            }}>
              ${sub.amount}/mes
            </div>
            <div style={{ fontSize: 10, color: "var(--danger)", cursor: "pointer", marginTop: 2, textAlign: "right" }}>
              Cancelar
            </div>
          </div>
        </div>
      ))}

      <div className="alert-bubble" style={{ marginTop: 14 }}>
        <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="var(--warn)" strokeWidth="2" style={{ flexShrink: 0, marginTop: 2 }}>
          <circle cx="12" cy="12" r="10"/>
          <line x1="12" y1="8" x2="12" y2="12"/>
          <line x1="12" y1="16" x2="12.01" y2="16"/>
        </svg>
        Adobe CC + ChatGPT = 45% de tus suscripciones. Si ya tienes Canva, cancelar Adobe ahorra $289/mes.
      </div>
    </div>
  );
}
