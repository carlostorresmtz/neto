"use client";

import { useEffect, useRef, useState } from "react";

const W = 400;
const H = 200;
const CX = 200;
const CY = 100;
const ORBIT_R = 55;
const LABEL_R = 85;

// Cardinal positions: top / right / bottom / left
const SATELLITES = [
  { angle: 270, label: "Solo lectura",       color: "#1E40AF" },
  { angle:   0, label: "OAuth oficial",      color: "#3B82F6" },
  { angle:  90, label: "Sin datos guardados", color: "#D97706" },
  { angle: 180, label: "Revocable",          color: "#16A34A" },
];

function toRad(deg: number) { return (deg * Math.PI) / 180; }

export default function IllustrationSecurity() {
  const ref = useRef<SVGSVGElement>(null);
  const [on, setOn] = useState(false);

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) { setOn(true); return; }
    const obs = new IntersectionObserver(
      ([e]) => { if (e.isIntersecting) { setOn(true); obs.disconnect(); } },
      { threshold: 0, rootMargin: "0px 0px -50px 0px" }
    );
    if (ref.current) obs.observe(ref.current);
    return () => obs.disconnect();
  }, []);

  return (
    <svg ref={ref} width={W} height={H} viewBox={`0 0 ${W} ${H}`} fill="none"
      style={{ maxWidth: "100%", height: "auto", display: "block", margin: "0 auto" }} aria-hidden>

      {/* Orbit ring */}
      <circle cx={CX} cy={CY} r={ORBIT_R}
        stroke="rgba(0,0,0,0.07)" strokeWidth="1" strokeDasharray="3 4"
        opacity={on ? 1 : 0}
        style={{ transition: "opacity 0.6s ease 0.3s" }}
      />

      {SATELLITES.map((s, i) => {
        const rad = toRad(s.angle);
        const sx = CX + ORBIT_R * Math.cos(rad);
        const sy = CY + ORBIT_R * Math.sin(rad);
        const lx = CX + LABEL_R * Math.cos(rad);
        const ly = CY + LABEL_R * Math.sin(rad);
        const anchor =
          Math.abs(Math.cos(rad)) < 0.1 ? "middle"
          : Math.cos(rad) > 0 ? "start"
          : "end";

        return (
          <g key={i}>
            {/* Line from center to satellite */}
            <line x1={CX} y1={CY} x2={sx} y2={sy}
              stroke="rgba(0,0,0,0.1)" strokeWidth="1" strokeDasharray="3 3"
              strokeDashoffset={on ? 0 : 100} pathLength="100"
              style={{ transition: `stroke-dashoffset 0.7s ease ${0.1 + i * 0.1}s` }}
            />

            {/* Satellite dot */}
            <circle cx={sx} cy={sy} r={5}
              fill={`${s.color}22`} stroke={s.color} strokeWidth="1.5"
              opacity={on ? 1 : 0}
              style={{ transition: `opacity 0.4s ease ${0.3 + i * 0.1}s` }}
            />

            {/* Label */}
            <text
              x={lx}
              y={ly + 4}
              textAnchor={anchor}
              fill="rgba(15,23,42,0.55)"
              fontSize="10"
              fontFamily="inherit"
              fontWeight="500"
              opacity={on ? 1 : 0}
              style={{ transition: `opacity 0.4s ease ${0.45 + i * 0.1}s` }}
            >
              {s.label}
            </text>
          </g>
        );
      })}

      {/* Padlock body */}
      <rect x={CX - 14} y={CY - 6} width="28" height="22" rx="4"
        fill="rgba(30,64,175,0.06)" stroke="rgba(30,64,175,0.4)" strokeWidth="1.5"
        strokeDashoffset={on ? 0 : 100} pathLength="100"
        style={{ transition: "stroke-dashoffset 0.6s ease" }}
      />

      {/* Padlock shackle */}
      <path d={`M${CX - 9},${CY - 6} v-8 a9,9 0 0 1 18,0 v8`}
        stroke="rgba(30,64,175,0.5)" strokeWidth="1.5" fill="none" strokeLinecap="round"
        strokeDashoffset={on ? 0 : 100} pathLength="100"
        style={{ transition: "stroke-dashoffset 0.6s ease 0.15s" }}
      />

      {/* Keyhole circle */}
      <circle cx={CX} cy={CY + 5} r="3.5"
        stroke="rgba(30,64,175,0.7)" strokeWidth="1.2" fill="none"
        opacity={on ? 1 : 0}
        style={{ transition: "opacity 0.4s ease 0.5s" }}
      />

      {/* Keyhole slot */}
      <line x1={CX} y1={CY + 8.5} x2={CX} y2={CY + 13}
        stroke="rgba(30,64,175,0.7)" strokeWidth="1.2" strokeLinecap="round"
        opacity={on ? 1 : 0}
        style={{ transition: "opacity 0.4s ease 0.55s" }}
      />
    </svg>
  );
}
