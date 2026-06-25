"use client";

import LineArt, { STROKE, ACCENT } from "./LineArt";

/** Pipeline: correo bancario → Neto lo procesa → datos organizados. */
export default function IllustrationFlow() {
  const s = { stroke: STROKE, strokeWidth: 1.5, strokeLinecap: "round" as const, strokeLinejoin: "round" as const };
  return (
    <LineArt width={420} height={120} viewBox="0 0 420 120">
      {/* ── envelope (entrada) ── */}
      <rect className="draw-line" pathLength={1} x="28" y="40" width="64" height="44" rx="5" {...s} style={{ transitionDelay: "0s" }} />
      <polyline className="draw-line" pathLength={1} points="28,46 60,66 92,46" {...s} style={{ transitionDelay: "0.25s" }} />

      {/* connector → hub */}
      <line className="draw-line" pathLength={1} x1="98" y1="62" x2="158" y2="62" stroke={STROKE} strokeWidth="1.2" strokeDasharray="0.06 0.06" style={{ transitionDelay: "0.5s", opacity: 0.5 }} />
      <polyline className="draw-line" pathLength={1} points="152,57 158,62 152,67" {...s} style={{ transitionDelay: "0.6s" }} />

      {/* ── hub Neto ── */}
      <circle className="draw-line" pathLength={1} cx="210" cy="62" r="26" stroke={ACCENT} strokeWidth="1.8" fill="none" style={{ transitionDelay: "0.7s" }} />
      <polyline className="draw-line" pathLength={1} points="199,63 206,70 221,53" stroke={ACCENT} strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" fill="none" style={{ transitionDelay: "0.95s" }} />

      {/* connector → output */}
      <line className="draw-line" pathLength={1} x1="238" y1="62" x2="298" y2="62" stroke={STROKE} strokeWidth="1.2" strokeDasharray="0.06 0.06" style={{ transitionDelay: "1.05s", opacity: 0.5 }} />
      <polyline className="draw-line" pathLength={1} points="292,57 298,62 292,67" {...s} style={{ transitionDelay: "1.15s" }} />

      {/* ── organized output (lista categorizada) ── */}
      <rect className="draw-line" pathLength={1} x="304" y="34" width="88" height="56" rx="6" {...s} style={{ transitionDelay: "1.25s" }} />
      {[46, 56, 66, 76].map((y, i) => (
        <g key={y}>
          <circle className="draw-fade" cx="316" cy={y} r="2" fill={i === 0 ? ACCENT : STROKE} style={{ transitionDelay: `${1.5 + i * 0.1}s`, opacity: i === 0 ? 1 : 0.55 }} />
          <line className="draw-line" pathLength={1} x1="324" y1={y} x2={i % 2 === 0 ? 380 : 368} y2={y} stroke={STROKE} strokeWidth="1" strokeLinecap="round" style={{ transitionDelay: `${1.55 + i * 0.1}s`, opacity: 0.5 }} />
        </g>
      ))}
    </LineArt>
  );
}
