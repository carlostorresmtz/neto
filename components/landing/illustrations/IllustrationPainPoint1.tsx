"use client";

import LineArt, { STROKE, ACCENT } from "./LineArt";

/** Estados de cuenta revisados a mano: documentos apilados/dispersos. */
export default function IllustrationPainPoint1() {
  const s = { stroke: STROKE, strokeWidth: 1.5, strokeLinecap: "round" as const, strokeLinejoin: "round" as const };
  return (
    <LineArt width={140} height={92} viewBox="0 0 140 92">
      {/* back doc */}
      <rect className="draw-line" pathLength={1} x="50" y="12" width="56" height="64" rx="4" {...s} style={{ transitionDelay: "0s" }} />
      {/* mid doc */}
      <rect className="draw-line" pathLength={1} x="42" y="18" width="56" height="64" rx="4" {...s} style={{ transitionDelay: "0.12s" }} />
      {/* front doc */}
      <rect className="draw-line" pathLength={1} x="34" y="24" width="56" height="64" rx="4" {...s} style={{ transitionDelay: "0.24s" }} />
      {/* header + text lines on front doc */}
      <line className="draw-line" pathLength={1} x1="42" y1="36" x2="74" y2="36" {...s} style={{ transitionDelay: "0.5s" }} />
      <line className="draw-line" pathLength={1} x1="42" y1="46" x2="82" y2="46" stroke={STROKE} strokeWidth="1.5" strokeLinecap="round" style={{ transitionDelay: "0.58s", opacity: 0.5 }} />
      <line className="draw-line" pathLength={1} x1="42" y1="54" x2="78" y2="54" stroke={STROKE} strokeWidth="1.5" strokeLinecap="round" style={{ transitionDelay: "0.66s", opacity: 0.5 }} />
      {/* accent line being hand-traced */}
      <line className="draw-line" pathLength={1} x1="42" y1="64" x2="64" y2="64" stroke={ACCENT} strokeWidth="1.5" strokeLinecap="round" style={{ transitionDelay: "0.8s" }} />
      <circle className="draw-fade" cx="64" cy="64" r="2.5" fill={ACCENT} style={{ transitionDelay: "0.95s" }} />
    </LineArt>
  );
}
