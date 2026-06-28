"use client";

import { useSession, signIn, signOut } from "next-auth/react";
import { useEffect, useState } from "react";
import GoogleIcon from "@/components/ui/GoogleIcon";
import { usePlan } from "@/components/PlanContext";
import PaywallBlock from "@/components/PaywallBlock";

export default function ConexionesPage() {
  const { data: session, status } = useSession();
  const { userPlan, openUpgrade } = usePlan();
  const [emailCount, setEmailCount] = useState<number | null>(null);
  const [countLoading, setCountLoading] = useState(false);

  useEffect(() => {
    if (!session?.accessToken) return;
    setCountLoading(true);
    fetch("/api/gmail/messages")
      .then(r => r.ok ? r.json() : null)
      .then(d => {
        if (d?.messages) setEmailCount(d.messages.length);
      })
      .catch(() => {})
      .finally(() => setCountLoading(false));
  }, [session?.accessToken]);

  const connected = status === "authenticated" && !!session?.user;

  return (
    <div className="page">
      <div style={{ fontFamily: "var(--font-geist-sans), sans-serif", fontSize: 21, marginBottom: 3 }}>
        Conexiones
      </div>
      <div style={{ fontSize: 12, color: "var(--text2)", marginBottom: 18 }}>
        Conecta tus fuentes de datos. La app carga siempre — esto es opcional.
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
        {/* Gmail */}
        <div className="conn-card">
          <div style={{ display: "flex", alignItems: "center", gap: 14, padding: 18 }}>
            <div className="conn-service-icon gmail">✉</div>
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: 15, fontWeight: 500, color: "var(--text)", marginBottom: 2 }}>Gmail</div>
              {connected ? (
                <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                  <span style={{
                    display: "inline-flex", alignItems: "center", gap: 5,
                    fontSize: 11, color: "#4ade80", background: "rgba(74,222,128,0.1)",
                    border: "1px solid rgba(74,222,128,0.3)", borderRadius: 20, padding: "2px 8px"
                  }}>
                    <span style={{
                      width: 6, height: 6, borderRadius: "50%", background: "#4ade80",
                      animation: "dotPulse 1.5s ease-in-out infinite"
                    }} />
                    Conectado
                  </span>
                </div>
              ) : (
                <div style={{ fontSize: 12, color: "var(--text3)" }}>No conectado</div>
              )}
            </div>
            {connected && session.user?.image && (
              <img
                src={session.user.image}
                alt="foto de perfil"
                style={{ width: 40, height: 40, borderRadius: "50%", border: "2px solid var(--border)" }}
              />
            )}
          </div>

          <div style={{ padding: "0 18px 18px", display: "flex", flexDirection: "column", gap: 10 }}>
            {connected ? (
              <>
                <div style={{
                  fontSize: 13, color: "var(--text2)", background: "var(--bg3)",
                  border: "1px solid var(--border)", borderRadius: "var(--radius-sm)",
                  padding: "10px 14px", display: "flex", flexDirection: "column", gap: 4
                }}>
                  <div style={{ fontWeight: 500, color: "var(--text)" }}>{session.user?.email}</div>
                  <div style={{ fontSize: 11, color: "var(--text3)" }}>
                    {countLoading
                      ? "Contando correos bancarios..."
                      : emailCount !== null
                        ? `${emailCount} correo${emailCount !== 1 ? "s" : ""} bancario${emailCount !== 1 ? "s" : ""} disponible${emailCount !== 1 ? "s" : ""}`
                        : "Correos disponibles al usar los agentes"}
                  </div>
                </div>
                <div style={{ display: "flex", gap: 8 }}>
                  <button
                    onClick={() => signOut({ callbackUrl: "/conexiones" })}
                    style={{
                      fontSize: 13, fontWeight: 500, padding: "7px 14px", borderRadius: "var(--radius-sm)",
                      border: "1px solid rgba(245,102,102,0.5)", background: "transparent",
                      color: "var(--danger)", cursor: "pointer"
                    }}
                  >
                    Desconectar
                  </button>
                </div>
              </>
            ) : (
              <>
                <div style={{ fontSize: 11, color: "var(--text3)", background: "var(--bg3)", border: "1px solid var(--border)", borderRadius: "var(--radius-sm)", padding: "10px 12px", lineHeight: 1.7 }}>
                  <strong style={{ color: "var(--text2)" }}>Qué leerá Neto:</strong><br />
                  Correos de BBVA, Amex, Nu, Banamex, HSBC y otros bancos mexicanos. Detecta estados de cuenta,
                  notificaciones de cargos y resúmenes mensuales.
                </div>
                <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
                  <button
                    className="btn-google"
                    onClick={() => signIn("google", { callbackUrl: "/conexiones" })}
                  >
                    <GoogleIcon />
                    Conectar Gmail con Google
                  </button>
                </div>
                <div style={{ fontSize: 11, color: "var(--text3)", marginTop: 2 }}>
                  Scope: gmail.readonly — solo lectura, nunca escribimos en tu correo
                </div>
              </>
            )}
          </div>
        </div>

        {/* Google Sheets */}
        <div className="conn-card">
          <div style={{ display: "flex", alignItems: "center", gap: 14, padding: 18 }}>
            <div className="conn-service-icon sheets" style={{ fontSize: 18 }}>⊞</div>
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: 15, fontWeight: 500, color: "var(--text)", marginBottom: 2 }}>Google Sheets</div>
              <div style={{ fontSize: 12, color: "var(--text3)" }}>
                {userPlan === "free" ? "Exclusivo de Pro" : "Próximamente"}
              </div>
            </div>
          </div>
          <div style={{ padding: "0 18px 18px", display: "flex", flexDirection: "column", gap: 10 }}>
            {userPlan === "free" ? (
              <PaywallBlock
                title="Google Sheets es exclusivo de Pro"
                description="Conecta tu presupuesto y cruza datos con tus gastos reales de Gmail."
                ctaLabel="Desbloquear con Pro →"
                onUpgrade={openUpgrade}
              />
            ) : (
              <>
                <div style={{ fontSize: 11, color: "var(--text3)", background: "var(--bg3)", border: "1px solid var(--border)", borderRadius: "var(--radius-sm)", padding: "10px 12px", lineHeight: 1.7 }}>
                  <strong style={{ color: "var(--text2)" }}>Qué leerá Neto:</strong><br />
                  La hoja de cálculo que tú elijas — puede ser tu registro manual de gastos, presupuesto mensual,
                  ingresos o cualquier tabla financiera.
                </div>
                <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
                  <button className="btn-google" disabled style={{ opacity: 0.45, cursor: "not-allowed" }}>
                    <GoogleIcon />
                    Conectar Sheets con Google
                  </button>
                </div>
                <div style={{ fontSize: 11, color: "var(--text3)", marginTop: 2 }}>
                  Scope: spreadsheets.readonly — solo lectura, nunca modificamos tu hoja
                </div>
              </>
            )}
          </div>
        </div>

        {/* Privacidad */}
        <div className="privacy-card">
          <strong style={{ color: "var(--text)" }}>🔒 Solo lectura — siempre.</strong>{" "}
          Neto nunca escribe, modifica ni elimina nada en tu Gmail ni en tu Google Sheets. Los tokens OAuth
          están cifrados y guardados asociados a tu sesión. Puedes revocar el acceso en cualquier momento desde
          esta pantalla o directamente desde{" "}
          <a
            href="https://myaccount.google.com/permissions"
            target="_blank"
            rel="noopener noreferrer"
            style={{ color: "var(--accent2)", cursor: "pointer" }}
          >
            myaccount.google.com/permissions
          </a>.
          Usamos los scopes mínimos necesarios:{" "}
          <strong style={{ color: "var(--text2)" }}>gmail.readonly</strong> y{" "}
          <strong style={{ color: "var(--text2)" }}>spreadsheets.readonly</strong>.
        </div>
      </div>

      <style>{`
        @keyframes dotPulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.3; }
        }
      `}</style>
    </div>
  );
}
