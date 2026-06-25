"use client";

import LineArt, { STROKE, ACCENT } from "./LineArt";

/**
 * Historia de Neto: correos bancarios dispersos (izquierda) que convergen
 * en un hub central (Neto) y se transforman en un dashboard limpio (derecha).
 * Líneas finas monocromáticas con un único acento azul. Se dibuja al entrar.
 */
const HUB = { x: 258, y: 100 };

const EMAILS = [
  { x: 26, y: 44 },
  { x: 14, y: 92 },
  { x: 30, y: 140 },
  { x: 70, y: 68 },
  { x: 64, y: 124 },
];

export default function IllustrationHero() {
  const s = { stroke: STROKE, strokeWidth: 1.5, strokeLinecap: "round" as const, strokeLinejoin: "round" as const };
  return (
    <LineArt width={520} height={200} viewBox="0 0 520 200" style={{ margin: "0 auto" }}>
      {/* convergence lines: each email → hub */}
      {EMAILS.map((e, i) => (
        <path
          key={i}
          className="draw-line"
          pathLength={1}
          d={`M ${e.x + 34} ${e.y + 9} Q ${(e.x + HUB.x) / 2} ${e.y + 9}, ${HUB.x - 22} ${HUB.y}`}
          stroke={STROKE}
          strokeWidth="1.5"
          fill="none"
          style={{ transitionDelay: `${0.5 + i * 0.08}s`, opacity: 0.35 }}
        />
      ))}

      {/* scattered bank-email cards (wireframe) */}
      {EMAILS.map((e, i) => (
        <g key={i}>
          <rect className="draw-line" pathLength={1} x={e.x} y={e.y} width="34" height="18" rx="3" {...s} style={{ transitionDelay: `${i * 0.1}s` }} />
          <line className="draw-line" pathLength={1} x1={e.x + 5} y1={e.y + 7} x2={e.x + 29} y2={e.y + 7} stroke={STROKE} strokeWidth="1.5" strokeLinecap="round" style={{ transitionDelay: `${0.25 + i * 0.1}s`, opacity: 0.5 }} />
          <line className="draw-line" pathLength={1} x1={e.x + 5} y1={e.y + 12} x2={e.x + 20} y2={e.y + 12} stroke={STROKE} strokeWidth="1.5" strokeLinecap="round" style={{ transitionDelay: `${0.32 + i * 0.1}s`, opacity: 0.5 }} />
        </g>
      ))}

      {/* central hub (Neto) */}
      <circle className="draw-line" pathLength={1} cx={HUB.x} cy={HUB.y} r="22" stroke={ACCENT} strokeWidth="1.5" fill="none" style={{ transitionDelay: "1s" }} />
      <polyline className="draw-line" pathLength={1} points={`${HUB.x - 9},${HUB.y + 1} ${HUB.x - 3},${HUB.y + 7} ${HUB.x + 9},${HUB.y - 7}`} stroke={ACCENT} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" fill="none" style={{ transitionDelay: "1.25s" }} />

      {/* hub → dashboard connector */}
      <line className="draw-line" pathLength={1} x1={HUB.x + 22} y1={HUB.y} x2="346" y2={HUB.y} stroke={STROKE} strokeWidth="1.5" strokeDasharray="0.05 0.05" style={{ transitionDelay: "1.35s", opacity: 0.5 }} />

      {/* dashboard panel (clean output) */}
      <rect className="draw-line" pathLength={1} x="350" y="44" width="156" height="112" rx="10" {...s} style={{ transitionDelay: "1.45s" }} />
      {/* panel header line */}
      <line className="draw-line" pathLength={1} x1="366" y1="62" x2="430" y2="62" stroke={STROKE} strokeWidth="1.5" strokeLinecap="round" style={{ transitionDelay: "1.65s", opacity: 0.6 }} />
      {/* rising line chart inside */}
      <polyline className="draw-line" pathLength={1} points="366,120 392,104 416,110 442,86 470,78 490,70" stroke={ACCENT} strokeWidth="1.5" fill="none" strokeLinecap="round" strokeLinejoin="round" style={{ transitionDelay: "1.75s" }} />
      {/* mini bars */}
      {[372, 390, 408].map((x, i) => (
        <line key={i} className="draw-line" pathLength={1} x1={x} y1="142" x2={x} y2={134 - i * 4} stroke={STROKE} strokeWidth="1.5" strokeLinecap="round" style={{ transitionDelay: `${2 + i * 0.08}s`, opacity: 0.5 }} />
      ))}
      <circle className="draw-fade" cx="490" cy="70" r="2.6" fill={ACCENT} style={{ transitionDelay: "2.3s" }} />
    </LineArt>
  );
}
