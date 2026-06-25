import Link from "next/link";

export default function NotFound() {
  return (
    <div style={{
      background: "var(--bg)", minHeight: "100vh", color: "var(--text)",
      display: "flex", flexDirection: "column", alignItems: "center",
      justifyContent: "center", textAlign: "center", padding: "40px 24px",
    }}>
      {/* Logo */}
      <Link href="/" style={{ display: "inline-flex", alignItems: "center", gap: 10, textDecoration: "none", marginBottom: 56 }}>
        <div style={{
          width: 36, height: 36, borderRadius: 10, background: "var(--accent)",
          display: "flex", alignItems: "center", justifyContent: "center",
        }}>
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="#0d0f0e" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="1,11 4,6 7,9 11,3 15,5" />
          </svg>
        </div>
        <span style={{ fontFamily: "var(--font-geist-sans), sans-serif", fontSize: 24, color: "var(--text)", lineHeight: 1 }}>
          Neto
        </span>
      </Link>

      {/* 404 */}
      <p style={{
        fontFamily: "var(--font-geist-sans), sans-serif",
        fontSize: "clamp(80px, 18vw, 140px)", fontWeight: 400,
        color: "var(--accent)", lineHeight: 1, margin: "0 0 16px",
        letterSpacing: "-0.04em",
      }}>
        404
      </p>

      <h1 style={{
        fontFamily: "var(--font-geist-sans), sans-serif",
        fontSize: "clamp(22px, 4vw, 32px)", fontWeight: 400,
        color: "var(--text)", margin: "0 0 14px", lineHeight: 1.3,
      }}>
        Esta página no existe
      </h1>

      <p style={{ fontSize: 15, color: "var(--text2)", maxWidth: 380, lineHeight: 1.7, margin: "0 0 44px" }}>
        Quizás el enlace está roto o la página fue movida.
        Mientras tanto, puedes volver al inicio.
      </p>

      <Link href="/" style={{
        display: "inline-block",
        background: "var(--accent)", color: "#0d0f0e",
        borderRadius: 12, padding: "13px 28px",
        fontSize: 15, fontWeight: 500, textDecoration: "none",
      }}>
        Volver al inicio
      </Link>
    </div>
  );
}
