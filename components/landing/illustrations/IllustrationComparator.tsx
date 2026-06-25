"use client";

import LineArt, { STROKE, ACCENT } from "./LineArt";

/** Comparador de tarjetas: barras de cashback con la ganadora destacada. */
export default function IllustrationComparator() {
  const base = 110;
  const bars = [
    { x: 60, h: 34 },
    { x: 110, h: 50 },
    { x: 160, h: 42 },
    { x: 210, h: 78, accent: true }, // tarjeta recomendada
    { x: 260, h: 30 },
  ];
  return (
    <LineArt width={340} height={140} viewBox="0 0 340 140">
      {/* axis */}
      <line className="draw-line" pathLength={1} x1="40" y1={base} x2="300" y2={base} stroke={STROKE} strokeWidth="1.5" strokeLinecap="round" style={{ transitionDelay: "0s", opacity: 0.4 }} />
      <line className="draw-line" pathLength={1} x1="40" y1="24" x2="40" y2={base} stroke={STROKE} strokeWidth="1.5" strokeLinecap="round" style={{ transitionDelay: "0.05s", opacity: 0.4 }} />

      {/* dotted target line */}
      <line className="draw-line" pathLength={1} x1="40" y1={base - 62} x2="296" y2={base - 62} stroke={STROKE} strokeWidth="1.5" strokeDasharray="0.05 0.05" style={{ transitionDelay: "0.2s", opacity: 0.3 }} />

      {/* bars (drawn vertically) */}
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
          strokeWidth={b.accent ? 10 : 9}
          strokeLinecap="round"
          style={{ transitionDelay: `${0.35 + i * 0.13}s`, opacity: b.accent ? 1 : 0.4 }}
        />
      ))}
    </LineArt>
  );
}
