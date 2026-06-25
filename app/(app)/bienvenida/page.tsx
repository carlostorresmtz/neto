"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useSession, signIn } from "next-auth/react";

const TOTAL_STEPS = 4;

function NetoLogo({ size = 44 }: { size?: number }) {
  return (
    <div style={{
      width: size, height: size, background: "var(--accent)", borderRadius: size * 0.3,
      display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0,
      boxShadow: "0 0 32px rgba(30,64,175,0.18)",
    }}>
      <svg width={size * 0.45} height={size * 0.45} viewBox="0 0 16 16" fill="none" stroke="#FFFFFF" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round">
        <polyline points="1,11 4,6 7,9 11,3 15,5" />
      </svg>
    </div>
  );
}

export default function BienvenidaPage() {
  const router = useRouter();
  const { data: session } = useSession();
  const [step, setStep] = useState(1);
  const [checkoutLoading, setCheckoutLoading] = useState(false);
  const [checkoutMsg, setCheckoutMsg] = useState<string | null>(null);
  const [trialOk, setTrialOk] = useState(false);

  // Al volver de Stripe Checkout (success_url / cancel_url) avanzamos el wizard.
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const r = params.get("checkout");
    if (r === "success") {
      setTrialOk(true);
      setStep(4);
    } else if (r === "cancel") {
      setStep(3);
      setCheckoutMsg("No se completó el registro de la tarjeta. Puedes intentarlo de nuevo.");
    }
    if (r) {
      // Limpia el query param para que no se vuelva a disparar al refrescar.
      window.history.replaceState({}, "", "/bienvenida");
    }
  }, []);

  function complete() {
    try { localStorage.setItem("neto_onboarding_completed", "true"); } catch {}
    router.push("/chat");
  }

  function next() {
    if (step < TOTAL_STEPS) setStep(s => s + 1);
    else complete();
  }
  function back() {
    if (step > 1) setStep(s => s - 1);
  }

  async function startTrial() {
    setCheckoutLoading(true);
    setCheckoutMsg(null);
    try {
      const res = await fetch("/api/stripe/checkout", { method: "POST" });
      const data = await res.json().catch(() => ({}));
      if (res.ok && data.url) {
        window.location.href = data.url; // Redirige al checkout hospedado por Stripe
        return;
      }
      // Stripe aún no configurado u otro error: permitimos continuar.
      setCheckoutMsg(
        data.mensaje ?? "El cobro estará disponible muy pronto. Puedes continuar por ahora."
      );
    } catch {
      setCheckoutMsg("No se pudo conectar con el checkout. Intenta de nuevo.");
    } finally {
      setCheckoutLoading(false);
    }
  }

  return (
    <div style={{
      minHeight: "100vh", width: "100%",
      background: "var(--bg)",
      display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center",
      padding: "32px 24px",
    }}>
      <div style={{ width: "100%", maxWidth: 460 }}>

        {/* Progress indicator */}
        <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 36 }}>
          <div style={{ display: "flex", gap: 6, flex: 1 }}>
            {Array.from({ length: TOTAL_STEPS }).map((_, i) => (
              <div key={i} style={{
                flex: 1, height: 4, borderRadius: 2,
                background: i < step ? "var(--accent)" : "var(--border)",
                transition: "background 0.3s ease",
              }} />
            ))}
          </div>
          <span style={{ fontSize: 12, color: "var(--text3)", fontWeight: 500, flexShrink: 0 }}>
            {step}/{TOTAL_STEPS}
          </span>
        </div>

        {/* Card */}
        <div style={{
          background: "var(--card)", border: "1px solid var(--border)",
          borderRadius: 20, padding: "40px 32px",
          boxShadow: "0 4px 24px rgba(15,23,42,0.06)",
          textAlign: "center",
          animation: "obFade 0.35s ease",
        }}>

          {/* ── PASO 1 ── */}
          {step === 1 && (
            <>
              <div style={{ display: "flex", justifyContent: "center", marginBottom: 24 }}>
                <NetoLogo size={56} />
              </div>
              <h1 style={{ fontSize: 26, fontWeight: 500, color: "var(--text)", letterSpacing: "-0.02em", margin: "0 0 12px" }}>
                Bienvenido a Neto
              </h1>
              <p style={{ fontSize: 15, color: "var(--text2)", lineHeight: 1.7, margin: 0 }}>
                Tu asistente financiero personal con inteligencia artificial. Neto lee tus
                correos bancarios y responde en español cualquier pregunta sobre tu dinero —
                sin hojas de cálculo ni apps extra.
              </p>
            </>
          )}

          {/* ── PASO 2 ── */}
          {step === 2 && (
            <>
              <div style={{ display: "flex", justifyContent: "center", marginBottom: 24 }}>
                <div style={{
                  width: 56, height: 56, borderRadius: 12,
                  background: "rgba(30,64,175,0.08)", border: "1px solid rgba(30,64,175,0.18)",
                  display: "flex", alignItems: "center", justifyContent: "center",
                }}>
                  <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="var(--accent)" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                    <rect x="2" y="4" width="20" height="16" rx="2" />
                    <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
                  </svg>
                </div>
              </div>
              <h1 style={{ fontSize: 24, fontWeight: 500, color: "var(--text)", letterSpacing: "-0.02em", margin: "0 0 12px" }}>
                Conecta tu Gmail
              </h1>
              <p style={{ fontSize: 15, color: "var(--text2)", lineHeight: 1.7, margin: "0 0 24px" }}>
                {session
                  ? "Tu Gmail ya está conectado. Neto usará tus correos bancarios reales para darte respuestas personalizadas."
                  : "Da acceso de solo lectura a tus correos bancarios. Neto nunca escribe, borra ni mueve dinero — solo analiza. Puedes desconectarlo cuando quieras."}
              </p>
              {!session && (
                <button
                  onClick={() => signIn("google", { callbackUrl: "/bienvenida" })}
                  style={{
                    display: "inline-flex", alignItems: "center", justifyContent: "center", gap: 10,
                    width: "100%", padding: "12px 20px",
                    background: "#fff", color: "#1F2937",
                    border: "1px solid var(--border)", borderRadius: 10,
                    fontSize: 14, fontWeight: 500, cursor: "pointer", fontFamily: "inherit",
                    transition: "background 0.2s ease, border-color 0.2s ease",
                  }}
                  onMouseEnter={e => { e.currentTarget.style.background = "#F8FAFC"; e.currentTarget.style.borderColor = "#CBD5E1"; }}
                  onMouseLeave={e => { e.currentTarget.style.background = "#fff"; e.currentTarget.style.borderColor = "var(--border)"; }}
                >
                  <svg width="18" height="18" viewBox="0 0 24 24">
                    <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                    <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                    <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                    <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                  </svg>
                  Conectar Gmail con Google
                </button>
              )}
            </>
          )}

          {/* ── PASO 3 — PRUEBA GRATIS + TARJETA ── */}
          {step === 3 && (
            <>
              <div style={{ display: "flex", justifyContent: "center", marginBottom: 24 }}>
                <div style={{
                  width: 56, height: 56, borderRadius: 12,
                  background: "rgba(30,64,175,0.08)", border: "1px solid rgba(30,64,175,0.18)",
                  display: "flex", alignItems: "center", justifyContent: "center",
                }}>
                  <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="var(--accent)" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                    <rect x="1" y="4" width="22" height="16" rx="2" />
                    <line x1="1" y1="10" x2="23" y2="10" />
                  </svg>
                </div>
              </div>
              <h1 style={{ fontSize: 24, fontWeight: 500, color: "var(--text)", letterSpacing: "-0.02em", margin: "0 0 12px" }}>
                Activa tus 2 meses gratis
              </h1>
              <p style={{ fontSize: 15, color: "var(--text2)", lineHeight: 1.7, margin: "0 0 20px" }}>
                Agrega una tarjeta para empezar. No te cobramos nada durante 2 meses y
                puedes cancelar cuando quieras.
              </p>

              {/* Bullets */}
              <div style={{ textAlign: "left", display: "flex", flexDirection: "column", gap: 10, marginBottom: 24 }}>
                {[
                  "2 meses completamente gratis",
                  "Sin cobro hasta el mes 3",
                  "Cancela en un clic, sin preguntas",
                ].map(b => (
                  <div key={b} style={{ display: "flex", alignItems: "center", gap: 10 }}>
                    <span style={{
                      width: 20, height: 20, borderRadius: "50%", flexShrink: 0,
                      background: "rgba(22,163,74,0.1)", border: "1px solid rgba(22,163,74,0.25)",
                      display: "flex", alignItems: "center", justifyContent: "center",
                    }}>
                      <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="#16a34a" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                        <polyline points="20 6 9 17 4 12" />
                      </svg>
                    </span>
                    <span style={{ fontSize: 13.5, color: "var(--text2)" }}>{b}</span>
                  </div>
                ))}
              </div>

              <button
                onClick={startTrial}
                disabled={checkoutLoading}
                className="land-btn-primary"
                style={{ width: "100%", padding: "13px 20px", fontSize: 15, opacity: checkoutLoading ? 0.7 : 1 }}
              >
                {checkoutLoading ? "Abriendo checkout…" : "Activar 2 meses gratis →"}
              </button>

              <p style={{ fontSize: 11, color: "var(--text3)", margin: "12px 0 0", lineHeight: 1.5 }}>
                Pago seguro con Stripe · Tu tarjeta no se cobra hasta el mes 3
              </p>

              {checkoutMsg && (
                <p style={{ fontSize: 12, color: "var(--warn)", margin: "12px 0 0", lineHeight: 1.5 }}>
                  {checkoutMsg}
                </p>
              )}
            </>
          )}

          {/* ── PASO 4 — LISTO ── */}
          {step === 4 && (
            <>
              <div style={{ display: "flex", justifyContent: "center", marginBottom: 24 }}>
                <div style={{
                  width: 56, height: 56, borderRadius: "50%",
                  background: "rgba(22,163,74,0.1)", border: "1px solid rgba(22,163,74,0.25)",
                  display: "flex", alignItems: "center", justifyContent: "center",
                }}>
                  <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#16a34a" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="20 6 9 17 4 12" />
                  </svg>
                </div>
              </div>
              <h1 style={{ fontSize: 24, fontWeight: 500, color: "var(--text)", letterSpacing: "-0.02em", margin: "0 0 12px" }}>
                {trialOk ? "¡Tu prueba está activa!" : "Listo para empezar"}
              </h1>
              <p style={{ fontSize: 15, color: "var(--text2)", lineHeight: 1.7, margin: "0 0 24px" }}>
                {trialOk
                  ? "Tienes 2 meses gratis. Te avisaremos antes del primer cobro. Ahora pregúntale a Neto lo que quieras sobre tus finanzas."
                  : "Ya puedes preguntarle a Neto lo que quieras sobre tus finanzas: gastos por categoría, suscripciones, deuda de tarjetas y más."}
              </p>
              <button
                onClick={complete}
                className="land-btn-primary"
                style={{ width: "100%", padding: "13px 20px", fontSize: 15 }}
              >
                Ir al chat →
              </button>
            </>
          )}
        </div>

        {/* Navigation */}
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginTop: 24 }}>
          <button
            onClick={back}
            disabled={step === 1}
            style={{
              fontSize: 14, color: step === 1 ? "var(--text3)" : "var(--text2)",
              background: "none", border: "none", cursor: step === 1 ? "default" : "pointer",
              opacity: step === 1 ? 0.4 : 1, fontFamily: "inherit", padding: "8px 4px",
            }}
          >
            ← Atrás
          </button>

          <button
            onClick={complete}
            style={{
              fontSize: 13, color: "var(--text3)", background: "none", border: "none",
              cursor: "pointer", fontFamily: "inherit", padding: "8px 4px",
            }}
          >
            {step === 3 ? "Decidir más tarde" : "Saltar"}
          </button>

          {step < TOTAL_STEPS ? (
            <button
              onClick={next}
              className="land-btn-primary"
              style={{ padding: "9px 22px", fontSize: 14 }}
            >
              Siguiente
            </button>
          ) : (
            <span style={{ width: 90 }} />
          )}
        </div>
      </div>

      <style>{`
        @keyframes obFade {
          from { opacity: 0; transform: translateY(10px); }
          to   { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </div>
  );
}
