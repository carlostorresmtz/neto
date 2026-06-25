"use client";

import LineArt, { STROKE, ACCENT } from "./LineArt";

/** Sorpresas al corte: barras con un pico inesperado + nodo de alerta. */
export default function IllustrationPainPoint3() {
  const bars = [
    { x: 26, h: 20 },
    { x: 46, h: 28 },
    { x: 66, h: 24 },
    { x: 86, h: 56, accent: true }, // pico sorpresa
    { x: 106, h: 18 },
  ];
  const base = 78;
  return (
    <LineArt width={140} height={92} viewBox="0 0 140 92">
      {/* baseline */}
      <line className="draw-line" pathLength={1} x1="16" y1={base} x2="124" y2={base} stroke={STROKE} strokeWidth="1.5" strokeLinecap="round" style={{ transitionDelay: "0s", opacity: 0.4 }} />
      {bars.map((b, i) => (
        <line
          key={i}
          className="draw-line"
          pathLength={1}
          x1={b.x}
          y1={base}
          x2={b.x}
          y2={base - b.h}
          stroke={b.accent ? ACCENT : STROKE}
          strokeWidth={b.accent ? 2.5 : 2}
          strokeLinecap="round"
          style={{ transitionDelay: `${0.15 + i * 0.12}s`, opacity: b.accent ? 1 : 0.75 }}
        />
      ))}
    </LineArt>
  );
}
