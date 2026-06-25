"use client";

import LineArt, { STROKE, ACCENT } from "./LineArt";

/** Gastos difíciles de entender: línea zigzag volátil con nodos. */
export default function IllustrationPainPoint2() {
  const s = { stroke: STROKE, strokeWidth: 1.5, strokeLinecap: "round" as const, strokeLinejoin: "round" as const };
  return (
    <LineArt width={140} height={92} viewBox="0 0 140 92">
      {/* axis */}
      <line className="draw-line" pathLength={1} x1="18" y1="78" x2="122" y2="78" stroke={STROKE} strokeWidth="1" strokeLinecap="round" style={{ transitionDelay: "0s", opacity: 0.4 }} />
      <line className="draw-line" pathLength={1} x1="18" y1="14" x2="18" y2="78" stroke={STROKE} strokeWidth="1" strokeLinecap="round" style={{ transitionDelay: "0.05s", opacity: 0.4 }} />
      {/* volatile zigzag */}
      <polyline className="draw-line" pathLength={1}
        points="18,58 34,34 50,64 66,28 82,52 98,22 114,46"
        {...s} style={{ transitionDelay: "0.2s" }} />
      {/* vertices */}
      {[[34, 34], [66, 28], [98, 22]].map(([x, y], i) => (
        <circle key={i} className="draw-fade" cx={x} cy={y} r="2.2" fill={STROKE} style={{ transitionDelay: `${0.9 + i * 0.08}s` }} />
      ))}
      {/* accent peak */}
      <circle className="draw-fade" cx="114" cy="46" r="3" fill={ACCENT} style={{ transitionDelay: "1.15s" }} />
    </LineArt>
  );
}
