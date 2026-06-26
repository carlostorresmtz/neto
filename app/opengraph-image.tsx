import { ImageResponse } from "next/og";

export const alt = "Neto — Asistente financiero personal para México";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          width: 1200,
          height: 630,
          background: "#FFFFFF",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          fontFamily: "sans-serif",
          position: "relative",
        }}
      >
        {/* Subtle blue glow (paleta actual) */}
        <div
          style={{
            position: "absolute",
            top: "42%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            width: 760,
            height: 760,
            borderRadius: "50%",
            background:
              "radial-gradient(circle, rgba(59,130,246,0.10) 0%, transparent 65%)",
            display: "flex",
          }}
        />

        {/* Logo mark — cuadro azul con el mini-gráfico en blanco */}
        <div
          style={{
            width: 88,
            height: 88,
            borderRadius: 22,
            background: "#1E40AF",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            marginBottom: 34,
            boxShadow: "0 18px 40px rgba(30,64,175,0.28)",
          }}
        >
          <svg
            width="46"
            height="46"
            viewBox="0 0 16 16"
            fill="none"
            stroke="#FFFFFF"
            strokeWidth="2.4"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <polyline points="1,11 4,6 7,9 11,3 15,5" />
          </svg>
        </div>

        {/* Wordmark */}
        <div
          style={{
            fontSize: 60,
            fontWeight: 600,
            color: "#0F172A",
            letterSpacing: "-0.03em",
            marginBottom: 18,
            display: "flex",
          }}
        >
          Neto
        </div>

        {/* Tagline — headline de la landing */}
        <div
          style={{
            fontSize: 32,
            fontWeight: 500,
            color: "#334155",
            letterSpacing: "-0.01em",
            display: "flex",
          }}
        >
          Tus finanzas, en piloto automático
        </div>

        {/* Pill badges (azul corporativo) */}
        <div
          style={{
            display: "flex",
            gap: 14,
            marginTop: 46,
          }}
        >
          {["📧 Conecta tu Gmail", "💳 Analiza tus gastos", "🔒 Solo lectura"].map(
            (label) => (
              <div
                key={label}
                style={{
                  background: "#EFF6FF",
                  border: "1px solid #BFDBFE",
                  borderRadius: 100,
                  padding: "10px 22px",
                  fontSize: 18,
                  color: "#1E40AF",
                  display: "flex",
                }}
              >
                {label}
              </div>
            )
          )}
        </div>

        {/* Domain */}
        <div
          style={{
            position: "absolute",
            bottom: 40,
            fontSize: 16,
            color: "#64748B",
            display: "flex",
          }}
        >
          useneto.com.mx
        </div>
      </div>
    ),
    size
  );
}
