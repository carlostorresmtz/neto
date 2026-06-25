"use client";

import { useEffect, useRef, useState } from "react";

const W = 400;
const H = 175;

// Proportions relative to max cashback (3.5%)
const CARDS = [
  { label: "BBVA",      color: "#004481", pct: 0.5 / 3.5, cashback: "0.5%" },
  { label: "Amex Gold", color: "#016FD0", pct: 2.0 / 3.5, cashback: "2.0%" },
  { label: "Nu",        color: "#820ad1", pct: 1.00,       cashback: "3.5%" },
];

const BAR_W   = 52;
const BAR_GAP = 32;
const MAX_H   = 100;
const BASE_Y  = 148;
// Center bars: total width = 3*BAR_W + 2*BAR_GAP = 220; start = (400-220)/2 = 90
const START_X = 90;

export default function IllustrationComparator() {
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

      {/* Y-axis label */}
      <text x={START_X - 4} y={22} textAnchor="start"
        fill="rgba(15,23,42,0.4)" fontSize="10" fontFamily="inherit" fontWeight="500">
        Cashback %
      </text>

      {/* Horizontal guide lines */}
      {[0.33, 0.66, 1.0].map((frac, i) => (
        <line key={i}
          x1={START_X - 4} y1={BASE_Y - frac * MAX_H}
          x2={START_X + 3 * BAR_W + 2 * BAR_GAP + 4} y2={BASE_Y - frac * MAX_H}
          stroke="rgba(0,0,0,0.07)" strokeWidth="0.8" strokeDasharray="3 3"
        />
      ))}

      {/* Baseline */}
      <line
        x1={START_X - 4} y1={BASE_Y}
        x2={START_X + 3 * BAR_W + 2 * BAR_GAP + 4} y2={BASE_Y}
        stroke="rgba(0,0,0,0.15)" strokeWidth="1"
      />

      {/* Bars */}
      {CARDS.map((card, i) => {
        const bx = START_X + i * (BAR_W + BAR_GAP);
        const barH = card.pct * MAX_H;
        const by   = on ? BASE_Y - barH : BASE_Y;
        const h    = on ? barH : 0;
        const isWinner = i === CARDS.length - 1;

        return (
          <g key={card.label}>
            {/* Bar — solid fill using bank color */}
            <rect
              x={bx} y={by} width={BAR_W} height={h} rx="4"
              fill={isWinner ? card.color : `${card.color}CC`}
              style={{
                transition: `y 0.8s cubic-bezier(0.22,1,0.36,1) ${i * 0.12}s,
                             height 0.8s cubic-bezier(0.22,1,0.36,1) ${i * 0.12}s`,
              }}
            />

            {/* Cashback % label above bar */}
            <text
              x={bx + BAR_W / 2}
              y={on ? BASE_Y - barH - 10 : BASE_Y - 10}
              textAnchor="middle"
              fill={isWinner ? card.color : "rgba(15,23,42,0.55)"}
              fontSize="11"
              fontWeight={isWinner ? "700" : "500"}
              fontFamily="inherit"
              opacity={on ? 1 : 0}
              style={{
                transition: `opacity 0.4s ease ${0.5 + i * 0.12}s,
                             y 0.8s cubic-bezier(0.22,1,0.36,1) ${i * 0.12}s`,
              }}
            >
              {card.cashback}
            </text>

            {/* Bank name below baseline */}
            <text
              x={bx + BAR_W / 2} y={BASE_Y + 16}
              textAnchor="middle"
              fill="rgba(15,23,42,0.5)" fontSize="10" fontFamily="inherit"
              opacity={on ? 1 : 0}
              style={{ transition: `opacity 0.4s ease ${0.35 + i * 0.12}s` }}
            >
              {card.label}
            </text>

            {/* Winner accent node: fixed at bar top, fades in after bar rises */}
            {isWinner && (
              <circle
                cx={bx + BAR_W / 2}
                cy={BASE_Y - barH}
                r="5"
                fill="#1E40AF"
                stroke="rgba(255,255,255,0.9)" strokeWidth="2"
                opacity={on ? 1 : 0}
                style={{ transition: "opacity 0.4s ease 0.9s" }}
              />
            )}
          </g>
        );
      })}
    </svg>
  );
}
