"use client";
import { signIn } from "next-auth/react";
import { useState } from "react";

export default function ConectarPage() {
  const [loading, setLoading] = useState(false);

  async function handleConnect() {
    setLoading(true);
    await signIn("google", { callbackUrl: "/chat" });
  }

  return (
    <div style={{
      minHeight: "100vh",
      background: "#F8FAFC",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      padding: "24px",
    }}>
      <div style={{
        width: "100%", maxWidth: 400, textAlign: "center",
        background: "#FFFFFF", borderRadius: 20, padding: "40px 36px",
        boxShadow: "0 1px 3px rgba(0,0,0,0.1), 0 1px 2px rgba(0,0,0,0.06)",
      }}>

        {/* Logo */}
        <div style={{
          width: 52, height: 52,
          background: "#1E40AF",
          borderRadius: 14,
          display: "flex", alignItems: "center", justifyContent: "center",
          margin: "0 auto 28px",
          boxShadow: "0 0 40px rgba(30,64,175,0.15)",
        }}>
          <svg width="22" height="22" viewBox="0 0 16 16" fill="none" stroke="#FFFFFF" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="1,11 4,6 7,9 11,3 15,5"/>
          </svg>
        </div>

        <h1 style={{ fontSize: 26, fontWeight: 500, color: "#0F172A", marginBottom: 10, letterSpacing: "-0.02em" }}>
          Conecta tu Gmail
        </h1>
        <p style={{ fontSize: 14, color: "#64748B", lineHeight: 1.7, marginBottom: 36, maxWidth: 320, margin: "0 auto 36px" }}>
          Neto leerá solo tus correos bancarios. Solo lectura, nunca escribe nada.
        </p>

        {/* Google button */}
        <button
          onClick={handleConnect}
          disabled={loading}
          style={{
            display: "flex", alignItems: "center", justifyContent: "center", gap: 12,
            width: "100%", padding: "13px 20px",
            background: "#FFFFFF", color: "#0F172A",
            border: "1px solid #E2E8F0", borderRadius: 10,
            fontSize: 15, fontWeight: 500,
            cursor: loading ? "not-allowed" : "pointer",
            fontFamily: "inherit",
            opacity: loading ? 0.7 : 1,
            transition: "opacity 0.15s, transform 0.12s",
            marginBottom: 32,
            boxShadow: "0 1px 2px rgba(0,0,0,0.05)",
          }}
          onMouseEnter={e => { if (!loading) e.currentTarget.style.transform = "scale(1.01)"; }}
          onMouseLeave={e => { e.currentTarget.style.transform = "scale(1)"; }}
        >
          {/* Google logo SVG */}
          <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
            <path d="M17.64 9.2c0-.637-.057-1.251-.164-1.84H9v3.481h4.844c-.209 1.125-.843 2.078-1.796 2.717v2.258h2.908c1.702-1.567 2.684-3.875 2.684-6.615z" fill="#4285F4"/>
            <path d="M9 18c2.43 0 4.467-.806 5.956-2.18l-2.908-2.259c-.806.54-1.837.86-3.048.86-2.344 0-4.328-1.584-5.036-3.711H.957v2.332A8.997 8.997 0 0 0 9 18z" fill="#34A853"/>
            <path d="M3.964 10.71A5.41 5.41 0 0 1 3.682 9c0-.593.102-1.17.282-1.71V4.958H.957A8.996 8.996 0 0 0 0 9c0 1.452.348 2.827.957 4.042l3.007-2.332z" fill="#FBBC05"/>
            <path d="M9 3.58c1.321 0 2.508.454 3.44 1.345l2.582-2.58C13.463.891 11.426 0 9 0A8.997 8.997 0 0 0 .957 4.958L3.964 7.29C4.672 5.163 6.656 3.58 9 3.58z" fill="#EA4335"/>
          </svg>
          {loading ? "Conectando…" : "Conectar con Google"}
        </button>

        {/* Security points */}
        <div style={{ display: "flex", flexDirection: "column", gap: 12, textAlign: "left" }}>
          {[
            "Solo lectura — nunca enviamos correos",
            "Acceso revocable en cualquier momento",
            "No almacenamos tus correos",
          ].map(point => (
            <div key={point} style={{ display: "flex", alignItems: "center", gap: 10 }}>
              <div style={{
                width: 18, height: 18, borderRadius: "50%",
                background: "rgba(22,163,74,0.1)", border: "1px solid rgba(22,163,74,0.25)",
                display: "flex", alignItems: "center", justifyContent: "center",
                flexShrink: 0,
              }}>
                <svg width="9" height="9" viewBox="0 0 12 12" fill="none" stroke="#16A34A" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="2,6 5,9 10,3"/>
                </svg>
              </div>
              <span style={{ fontSize: 13, color: "#64748B" }}>{point}</span>
            </div>
          ))}
        </div>

        <p style={{ marginTop: 32, fontSize: 11, color: "#94A3B8" }}>
          Al conectar aceptas nuestros{" "}
          <a href="/terminos" style={{ color: "#64748B", textDecoration: "none" }}>Términos de uso</a>
          {" "}y{" "}
          <a href="/privacidad" style={{ color: "#64748B", textDecoration: "none" }}>Política de privacidad</a>
        </p>
      </div>
    </div>
  );
}
