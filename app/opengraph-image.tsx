import { ImageResponse } from "next/og";

export const alt = "Neto — Tu asistente financiero personal";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          width: 1200,
          height: 630,
          background: "#0d0f0e",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          fontFamily: "sans-serif",
          position: "relative",
        }}
      >
        {/* Subtle glow */}
        <div
          style={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            width: 700,
            height: 700,
            borderRadius: "50%",
            background:
              "radial-gradient(circle, rgba(184,245,102,0.07) 0%, transparent 65%)",
            display: "flex",
          }}
        />

        {/* Logo mark */}
        <div
          style={{
            width: 72,
            height: 72,
            borderRadius: 18,
            background: "#b8f566",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            marginBottom: 36,
          }}
        >
          {/* Chart icon approximated with border */}
          <div
            style={{
              width: 36,
              height: 28,
              borderLeft: "3px solid #0d0f0e",
              borderBottom: "3px solid #0d0f0e",
              display: "flex",
            }}
          />
        </div>

        {/* Wordmark */}
        <div
          style={{
            fontSize: 52,
            color: "#e8ebe9",
            letterSpacing: "-0.02em",
            marginBottom: 20,
            display: "flex",
          }}
        >
          Neto
        </div>

        {/* Tagline */}
        <div
          style={{
            fontSize: 28,
            color: "rgba(232,235,233,0.55)",
            letterSpacing: "-0.01em",
            display: "flex",
          }}
        >
          Tu asistente financiero personal
        </div>

        {/* Pill badges */}
        <div
          style={{
            display: "flex",
            gap: 14,
            marginTop: 44,
          }}
        >
          {["📧 Conecta Gmail", "💳 Analiza gastos", "🔒 Solo lectura"].map(
            (label) => (
              <div
                key={label}
                style={{
                  background: "rgba(184,245,102,0.09)",
                  border: "1px solid rgba(184,245,102,0.22)",
                  borderRadius: 100,
                  padding: "10px 22px",
                  fontSize: 18,
                  color: "#b8f566",
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
            color: "rgba(232,235,233,0.25)",
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
