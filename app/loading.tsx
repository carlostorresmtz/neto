export default function Loading() {
  return (
    <div style={{
      background: "var(--bg)", minHeight: "100vh",
      display: "flex", flexDirection: "column",
      alignItems: "center", justifyContent: "center", gap: 24,
    }}>
      {/* Logo */}
      <div style={{
        width: 48, height: 48, borderRadius: 13, background: "var(--accent)",
        display: "flex", alignItems: "center", justifyContent: "center",
      }}>
        <svg width="22" height="22" viewBox="0 0 16 16" fill="none" stroke="#0d0f0e" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round">
          <polyline points="1,11 4,6 7,9 11,3 15,5" />
        </svg>
      </div>

      {/* Spinner ring */}
      <div style={{
        width: 36, height: 36,
        border: "3px solid rgba(184,245,102,0.15)",
        borderTopColor: "var(--accent)",
        borderRadius: "50%",
        animation: "neto-spin 0.75s linear infinite",
      }} />

      <style>{`
        @keyframes neto-spin { to { transform: rotate(360deg); } }
      `}</style>
    </div>
  );
}
