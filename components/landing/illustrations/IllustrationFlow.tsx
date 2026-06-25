"use client";

import { useEffect, useRef, useState } from "react";

const CY = 80;
const R  = 26;
const NODES = [
  { x: 80,  label: "Gmail",     sub: "Correos" },
  { x: 220, label: "Parser",    sub: "Extrae"  },
  { x: 360, label: "Neto AI",   sub: "Analiza" },
  { x: 500, label: "Respuesta", sub: "Instant."},
];

const ICONS: Record<number, React.ReactNode> = {
  0: <><path d="M-7-5h14c.8 0 1.4.6 1.4 1.4v7.2c0 .8-.6 1.4-1.4 1.4h-14c-.8 0-1.4-.6-1.4-1.4V-3.6c0-.8.6-1.4 1.4-1.4z" strokeWidth="1.4"/><polyline points="-7,-3.6 0,1.8 7,-3.6" strokeWidth="1.4"/></>,
  1: <><polyline points="-5,5 1,0 -5,-5" strokeWidth="1.8"/><polyline points="1,5 7,0 1,-5" strokeWidth="1.8"/></>,
  2: <><circle cx="0" cy="0" r="2.5" strokeWidth="1.4"/><line x1="0" y1="-7" x2="0" y2="-4.5" strokeWidth="1.2"/><line x1="0" y1="4.5" x2="0" y2="7" strokeWidth="1.2"/><line x1="-7" y1="0" x2="-4.5" y2="0" strokeWidth="1.2"/><line x1="4.5" y1="0" x2="7" y2="0" strokeWidth="1.2"/><line x1="-5" y1="-5" x2="-3.5" y2="-3.5" strokeWidth="1.2"/><line x1="3.5" y1="3.5" x2="5" y2="5" strokeWidth="1.2"/></>,
  3: <><path d="M-6-7h10a1.4 1.4 0 0 1 1.4 1.4v8.4c0 .8-.6 1.4-1.4 1.4h-10l-3 3V-5.6c0-.8.6-1.4 1.4-1.4h1.6" strokeWidth="1.4"/></>,
};

export default function IllustrationFlow() {
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

  const connectors = [
    { x1: NODES[0].x + R, x2: NODES[1].x - R },
    { x1: NODES[1].x + R, x2: NODES[2].x - R },
    { x1: NODES[2].x + R, x2: NODES[3].x - R },
  ];

  return (
    <svg ref={ref} width="580" height="160" viewBox="0 0 580 160" fill="none"
      style={{ maxWidth: "100%", height: "auto" }} aria-hidden>
      <style>{`
        @keyframes neto-flowDash { to { stroke-dashoffset: -8; } }
        .neto-flow { animation: ${on ? "neto-flowDash 1.2s linear infinite" : "none"}; }
      `}</style>

      {/* Connectors */}
      {connectors.map((c, i) => (
        <line key={i} className="neto-flow"
          x1={c.x1} y1={CY} x2={c.x2} y2={CY}
          stroke={on ? "rgba(30,64,175,0.4)" : "rgba(30,64,175,0.1)"}
          strokeWidth="1.5" strokeDasharray="4 4"
          style={{ transition: "stroke 0.6s ease", animationDelay: `${i * 0.3}s` }}
        />
      ))}

      {/* Arrow heads */}
      {connectors.map((c, i) => (
        <polyline key={i}
          points={`${c.x2 - 6},${CY - 4} ${c.x2},${CY} ${c.x2 - 6},${CY + 4}`}
          stroke="rgba(30,64,175,0.5)" strokeWidth="1.2" fill="none"
          strokeLinecap="round" strokeLinejoin="round"
          opacity={on ? 1 : 0}
          style={{ transition: `opacity 0.4s ease ${0.5 + i * 0.15}s` }}
        />
      ))}

      {/* Nodes */}
      {NODES.map((n, i) => (
        <g key={n.x} opacity={on ? 1 : 0}
          style={{ transition: `opacity 0.5s ease ${i * 0.18}s` }}>
          <circle cx={n.x} cy={CY} r={R + 7}
            stroke="rgba(30,64,175,0.07)" strokeWidth="1" fill="none"
            strokeDasharray="3 3"
          />
          <circle cx={n.x} cy={CY} r={R}
            fill="rgba(0,0,0,0.02)" stroke="rgba(0,0,0,0.15)" strokeWidth="1.3"
          />
          <g transform={`translate(${n.x}, ${CY})`}
            stroke="rgba(30,64,175,0.85)" fill="none"
            strokeLinecap="round" strokeLinejoin="round">
            {ICONS[i]}
          </g>
          <text x={n.x} y={CY + R + 18} textAnchor="middle"
            fill="rgba(15,23,42,0.75)" fontSize="12" fontWeight="500"
            fontFamily="inherit">
            {n.label}
          </text>
          <text x={n.x} y={CY + R + 32} textAnchor="middle"
            fill="rgba(15,23,42,0.4)" fontSize="10"
            fontFamily="inherit">
            {n.sub}
          </text>
        </g>
      ))}
    </svg>
  );
}
