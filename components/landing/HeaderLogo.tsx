"use client";

/**
 * Logo de Neto en el header de la landing. Al hacer clic hace scroll suave
 * hasta el inicio de la página (el hero). Es un <button> sin estilos de caja
 * para mantener el look del logo, con cursor pointer.
 */
export default function HeaderLogo() {
  return (
    <button
      type="button"
      onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
      aria-label="Ir al inicio"
      style={{
        display: "flex", alignItems: "center", gap: 10,
        background: "none", border: "none", padding: 0,
        cursor: "pointer", fontFamily: "inherit",
      }}
    >
      <div style={{
        width: 30, height: 30, background: "var(--accent)", borderRadius: 8,
        display: "flex", alignItems: "center", justifyContent: "center",
      }}>
        <svg width="13" height="13" viewBox="0 0 16 16" fill="none" stroke="#FFFFFF" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round">
          <polyline points="1,11 4,6 7,9 11,3 15,5" />
        </svg>
      </div>
      <span style={{ fontSize: 19, lineHeight: 1, color: "#0F172A", fontWeight: 500, letterSpacing: "-0.02em" }}>
        Neto
      </span>
    </button>
  );
}
