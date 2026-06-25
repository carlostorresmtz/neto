"use client";

import { useEffect, useRef, useState } from "react";

const W = 640;
const PH = 260;

// Layer Y positions (bottom to top)
const LAYERS = [
  { y: 185, label: "Correos bancarios", color: "rgba(0,0,0,0.12)", accent: "rgba(59,130,246,0.6)"  },
  { y: 110, label: "Neto AI",            color: "rgba(0,0,0,0.15)", accent: "rgba(30,64,175,0.7)"  },
  { y:  35, label: "Tu dashboard",       color: "rgba(0,0,0,0.1)", accent: "rgba(217,119,6,0.6)"  },
];

const LW = 320;  // layer width
const LH = 40;   // layer height (3D depth look)
const LX = (W - LW) / 2;

export default function IllustrationHero() {
  const ref = useRef<SVGSVGElement>(null);
  const [on, setOn] = useState(false);

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) { setOn(true); return; }
    const obs = new IntersectionObserver(
      ([e]) => { if (e.isIntersecting) { setOn(true); obs.disconnect(); } },
      { threshold: 0, rootMargin: "0px 0px -60px 0px" }
    );
    if (ref.current) obs.observe(ref.current);
    return () => obs.disconnect();
  }, []);

  return (
    <svg ref={ref} width={W} height={PH} viewBox={`0 0 ${W} ${PH}`} fill="none"
      style={{ maxWidth: "100%", height: "auto", display: "block", margin: "0 auto" }} aria-hidden>

      {/* Vertical connector lines between layers */}
      {[0, 1].map(i => {
        const topY = LAYERS[i + 1].y + LH;
        const botY = LAYERS[i].y;
        return (
          <g key={i}>
            <line x1={LX + 24} y1={topY} x2={LX + 24} y2={botY}
              stroke="rgba(0,0,0,0.08)" strokeWidth="1" strokeDasharray="3 3"
              strokeDashoffset={on ? 0 : 100} pathLength="100"
              style={{ transition: `stroke-dashoffset 0.7s ease ${0.6 + i * 0.2}s` }}
            />
            <line x1={LX + LW - 24} y1={topY} x2={LX + LW - 24} y2={botY}
              stroke="rgba(0,0,0,0.08)" strokeWidth="1" strokeDasharray="3 3"
              strokeDashoffset={on ? 0 : 100} pathLength="100"
              style={{ transition: `stroke-dashoffset 0.7s ease ${0.7 + i * 0.2}s` }}
            />
            {/* Arrow indicating flow up */}
            <polyline
              points={`${LX + LW / 2 - 5},${topY + 10} ${LX + LW / 2},${topY + 4} ${LX + LW / 2 + 5},${topY + 10}`}
              stroke={LAYERS[i + 1].accent} strokeWidth="1.2" fill="none"
              strokeLinecap="round" strokeLinejoin="round"
              opacity={on ? 1 : 0}
              style={{ transition: `opacity 0.4s ease ${0.9 + i * 0.2}s` }}
            />
          </g>
        );
      })}

      {/* Layers (rendered bottom to top so top draws over bottom) */}
      {LAYERS.map((layer, i) => (
        <g key={i}
          opacity={on ? 1 : 0}
          style={{ transition: `opacity 0.55s ease ${i * 0.15}s` }}>

          {/* Platform top face */}
          <rect x={LX} y={layer.y} width={LW} height={LH} rx="8"
            fill="rgba(0,0,0,0.02)"
            stroke={layer.color}
            strokeWidth="1.2"
          />

          {/* Accent left border */}
          <line x1={LX} y1={layer.y + 8} x2={LX} y2={layer.y + LH - 8}
            stroke={layer.accent} strokeWidth="2" strokeLinecap="round"
          />

          {/* Dots inside the platform */}
          {[0, 1, 2, 3].map(j => (
            <circle key={j}
              cx={LX + 28 + j * ((LW - 56) / 3)} cy={layer.y + LH / 2}
              r={j === 2 ? 3 : 2}
              fill={j === 2 ? layer.accent : "rgba(0,0,0,0.1)"}
            />
          ))}
          {/* Connecting line between dots */}
          <line x1={LX + 28} y1={layer.y + LH / 2} x2={LX + LW - 28} y2={layer.y + LH / 2}
            stroke="rgba(0,0,0,0.06)" strokeWidth="0.8" strokeDasharray="2 2"
          />

          {/* Label outside (right side) */}
          <text x={LX + LW + 14} y={layer.y + LH / 2 + 4}
            fill={layer.accent} fontSize="11" fontWeight="500" fontFamily="inherit">
            {layer.label}
          </text>
        </g>
      ))}

      {/* Floating accent nodes in the background */}
      {[
        { cx: LX - 40, cy: 110, r: 3, c: "rgba(30,64,175,0.3)" },
        { cx: LX - 20, cy: 155, r: 2, c: "rgba(59,130,246,0.3)" },
        { cx: LX + LW + 50, cy: 80, r: 2.5, c: "rgba(217,119,6,0.25)" },
      ].map((dot, i) => (
        <circle key={i} cx={dot.cx} cy={dot.cy} r={dot.r} fill={dot.c}
          opacity={on ? 1 : 0}
          style={{ transition: `opacity 0.5s ease ${0.8 + i * 0.1}s` }}
        />
      ))}
    </svg>
  );
}
