"use client";

import LineArt, { STROKE, ACCENT } from "./LineArt";

/** Privacidad: escudo wireframe con candado + ondas concéntricas. */
export default function IllustrationSecurity() {
  return (
    <LineArt width={240} height={150} viewBox="0 0 240 150">
      {/* concentric protective waves */}
      {[44, 60, 76].map((r, i) => (
        <circle key={i} className="draw-line" pathLength={1} cx="120" cy="76" r={r}
          stroke={STROKE} strokeWidth="1.5" fill="none"
          style={{ transitionDelay: `${0.1 + i * 0.12}s`, opacity: 0.18 - i * 0.04 }} />
      ))}

      {/* shield */}
      <path className="draw-line" pathLength={1}
        d="M120 30 L150 42 V74 C150 96 136 110 120 118 C104 110 90 96 90 74 V42 Z"
        stroke={ACCENT} strokeWidth="1.5" fill="none" strokeLinejoin="round"
        style={{ transitionDelay: "0.45s" }} />

      {/* lock body */}
      <rect className="draw-line" pathLength={1} x="108" y="68" width="24" height="20" rx="3"
        stroke={STROKE} strokeWidth="1.5" fill="none"
        style={{ transitionDelay: "0.85s" }} />
      {/* lock shackle */}
      <path className="draw-line" pathLength={1} d="M112 68 V62 a8 8 0 0 1 16 0 V68"
        stroke={STROKE} strokeWidth="1.5" fill="none" strokeLinecap="round"
        style={{ transitionDelay: "1.05s" }} />
      {/* keyhole */}
      <circle className="draw-fade" cx="120" cy="77" r="2.2" fill={ACCENT} style={{ transitionDelay: "1.3s" }} />
    </LineArt>
  );
}
