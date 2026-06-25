"use client";

import LineArt, { STROKE, ACCENT } from "./LineArt";

/** Intereses y deuda que se acumulan: curva ascendente con flecha. */
export default function IllustrationPainPoint4() {
  const s = { stroke: STROKE, strokeWidth: 1.5, strokeLinecap: "round" as const, strokeLinejoin: "round" as const };
  return (
    <LineArt width={140} height={92} viewBox="0 0 140 92">
      {/* axis */}
      <line className="draw-line" pathLength={1} x1="18" y1="78" x2="122" y2="78" stroke={STROKE} strokeWidth="1" strokeLinecap="round" style={{ transitionDelay: "0s", opacity: 0.4 }} />
      <line className="draw-line" pathLength={1} x1="18" y1="14" x2="18" y2="78" stroke={STROKE} strokeWidth="1" strokeLinecap="round" style={{ transitionDelay: "0.05s", opacity: 0.4 }} />
      {/* dotted reference (flat budget) */}
      <line className="draw-line" pathLength={1} x1="18" y1="60" x2="118" y2="60" stroke={STROKE} strokeWidth="1" strokeDasharray="0.04 0.04" style={{ transitionDelay: "0.15s", opacity: 0.35 }} />
      {/* accelerating upward curve */}
      <path className="draw-line" pathLength={1} d="M18 70 C 52 68, 76 56, 92 40 S 112 20, 118 16" stroke={ACCENT} strokeWidth="2" fill="none" strokeLinecap="round" style={{ transitionDelay: "0.3s" }} />
      {/* arrow head */}
      <polyline className="draw-line" pathLength={1} points="112,16 118,16 118,22" {...s} stroke={ACCENT} style={{ transitionDelay: "1.2s" }} />
      {/* node at the bottom start */}
      <circle className="draw-fade" cx="18" cy="70" r="2.2" fill={STROKE} style={{ transitionDelay: "1.1s" }} />
    </LineArt>
  );
}
