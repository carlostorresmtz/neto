"use client";

import LineArt, { ACCENT } from "@/components/landing/illustrations/LineArt";

// El estado vacío del chat tiene fondo adaptable al tema (no una card gris fija
// como la landing), así que usamos un trazo basado en --text2/--text3 para que
// la ilustración se vea bien en claro Y en oscuro. El acento sigue siendo --accent.
const INK = "var(--text2)";
const INK_FAINT = "var(--text3)";

/**
 * Ilustración thin-line para el estado vacío del chat: una burbuja de
 * conversación con una mini-gráfica financiera ascendente dentro.
 * Mismo lenguaje que las ilustraciones de la landing (stroke 1.5, draw-on).
 */
export default function IllustrationChat() {
  return (
    <LineArt width={132} height={104} viewBox="0 0 132 104">
      {/* burbuja */}
      <path
        className="draw-line"
        pathLength={1}
        d="M22 20 H110 a8 8 0 0 1 8 8 V64 a8 8 0 0 1 -8 8 H54 l-16 14 v-14 H22 a8 8 0 0 1 -8 -8 V28 a8 8 0 0 1 8 -8 Z"
        stroke={INK}
        strokeWidth="1.5"
        fill="none"
        style={{ transitionDelay: "0s" }}
      />
      {/* mini-gráfica ascendente (acento) */}
      <polyline
        className="draw-line"
        pathLength={1}
        points="30,56 48,48 64,52 82,38 100,32"
        stroke={ACCENT}
        strokeWidth="1.5"
        fill="none"
        style={{ transitionDelay: "0.5s" }}
      />
      {/* nodo al final de la gráfica */}
      <circle className="draw-fade" cx="100" cy="32" r="2.6" fill={ACCENT} style={{ transitionDelay: "1.1s" }} />
      {/* línea base tenue */}
      <line
        className="draw-line"
        pathLength={1}
        x1="30" y1="62" x2="100" y2="62"
        stroke={INK_FAINT}
        strokeWidth="1.5"
        style={{ transitionDelay: "0.35s", opacity: 0.5 }}
      />
    </LineArt>
  );
}
