"use client";

import { useEffect, useState } from "react";
import IllustrationComparator from "@/components/landing/illustrations/IllustrationComparator";

const FEATURES = [
  {
    emoji: "💳",
    title: "¿Qué tarjeta te da más cashback?",
    desc: "Neto analiza tus gastos reales y calcula cuánto ganarías con cada tarjeta del mercado mexicano.",
  },
  {
    emoji: "📉",
    title: "¿Cuánto pagas de intereses?",
    desc: "Compara tu tasa actual vs alternativas y calcula cuánto ahorrarías al año cambiando de tarjeta.",
  },
  {
    emoji: "🎯",
    title: "Tu perfil, tu tarjeta ideal",
    desc: "Basado en dónde gastas (restaurantes, viajes, gasolina), te recomienda la tarjeta que más te conviene contratar.",
  },
];

const LS_KEY = "neto_waitlist_registered";

export default function ComingSoon() {
  const [email, setEmail]   = useState("");
  const [done,  setDone]    = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError]   = useState("");

  // Hydrate from localStorage on mount
  useEffect(() => {
    if (localStorage.getItem(LS_KEY)) setDone(true);
  }, []);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    if (!email.trim() || loading) return;
    setLoading(true);
    setError("");

    try {
      const res = await fetch("/api/waitlist", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: email.trim() }),
      });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        setError(data.error ?? "Algo salió mal, intenta de nuevo.");
        return;
      }
      localStorage.setItem(LS_KEY, "1");
      setDone(true);
    } catch {
      setError("Sin conexión. Intenta de nuevo.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <section style={{ padding: "0 24px 96px", maxWidth: 960, margin: "0 auto" }}>
      <div style={{
        border: "1.5px dashed #FDE68A",
        borderRadius: 20,
        padding: "52px 40px",
        background: "#FFFBEB",
        position: "relative",
      }}>
        {/* Top badge */}
        <div style={{ textAlign: "center", marginBottom: 32 }}>
          <div style={{
            display: "inline-flex", alignItems: "center", gap: 7,
            background: "#FEF9C3", border: "1px solid #FDE68A",
            borderRadius: 100, padding: "5px 14px", marginBottom: 24,
          }}>
            <span style={{ fontSize: 11, color: "#92400E", letterSpacing: "0.08em", textTransform: "uppercase", fontWeight: 600 }}>
              Próximamente
            </span>
          </div>

          <h2 style={{
            fontSize: "clamp(28px, 4vw, 44px)", fontWeight: 500,
            color: "var(--text)", lineHeight: 1.15, margin: "0 auto 14px", maxWidth: 540,
            letterSpacing: "-0.02em",
          }}>
            La tarjeta correcta para{" "}
            <span style={{ color: "#B45309" }}>cómo tú gastas</span>
          </h2>
          <p style={{ fontSize: 14, color: "var(--text2)", maxWidth: 480, margin: "0 auto", lineHeight: 1.7 }}>
            Comparador de tarjetas de crédito mexicanas, personalizado con tus datos reales.
          </p>
        </div>

        {/* Comparator illustration */}
        <div style={{ display: "flex", justifyContent: "center", marginBottom: 36 }}>
          <IllustrationComparator />
        </div>

        {/* Feature cards */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))", gap: 14, marginBottom: 44 }}>
          {FEATURES.map((f) => (
            <div key={f.title} style={{
              background: "var(--card)", border: "1px solid #E2E8F0",
              borderRadius: 14, padding: "22px 20px",
              opacity: 0.85,
            }}>
              <div style={{ fontSize: 28, marginBottom: 12, lineHeight: 1 }}>{f.emoji}</div>
              <h3 style={{ fontSize: 14, fontWeight: 500, color: "var(--text)", marginBottom: 8, lineHeight: 1.4 }}>
                {f.title}
              </h3>
              <p style={{ fontSize: 13, color: "var(--text2)", lineHeight: 1.65, margin: 0 }}>
                {f.desc}
              </p>
            </div>
          ))}
        </div>

        {/* Waitlist form */}
        <div style={{ textAlign: "center" }}>
          <p style={{ fontSize: 13, color: "var(--text3)", marginBottom: 16 }}>
            Únete a la lista de espera →
          </p>
          {done ? (
            <div style={{
              display: "inline-flex", alignItems: "center", gap: 8,
              background: "#DCFCE7", border: "1px solid #BBF7D0",
              borderRadius: 10, padding: "12px 24px", fontSize: 14, color: "#16A34A",
            }}>
              ✓ ¡Listo! Te avisamos cuando esté disponible.
            </div>
          ) : (
            <form onSubmit={submit}>
              <div style={{ display: "flex", gap: 8, justifyContent: "center", flexWrap: "wrap" }}>
                <input
                  type="email"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  placeholder="tu@email.com"
                  required
                  disabled={loading}
                  style={{
                    background: "var(--card)", border: "1px solid #E2E8F0",
                    borderRadius: 10, padding: "11px 16px",
                    fontSize: 14, color: "var(--text)", fontFamily: "inherit",
                    outline: "none", minWidth: 220,
                    opacity: loading ? 0.6 : 1,
                  }}
                />
                <button
                  type="submit"
                  disabled={loading}
                  style={{
                    background: "#FEF9C3", border: "1px solid #FDE68A",
                    borderRadius: 10, padding: "11px 22px",
                    fontSize: 14, fontWeight: 500, color: "#92400E",
                    cursor: loading ? "not-allowed" : "pointer",
                    fontFamily: "inherit",
                    opacity: loading ? 0.6 : 1,
                  }}
                >
                  {loading ? "Enviando…" : "Avisarme"}
                </button>
              </div>
              {error && (
                <p style={{ marginTop: 10, fontSize: 13, color: "var(--danger)" }}>{error}</p>
              )}
            </form>
          )}
        </div>
      </div>
    </section>
  );
}
