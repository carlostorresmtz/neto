"use client";

import { useEffect, useRef, useState } from "react";

export default function IllustrationPainPoint3() {
  const ref = useRef<SVGSVGElement>(null);
  const [on, setOn] = useState(false);

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) { setOn(true); return; }
    const obs = new IntersectionObserver(
      ([e]) => { if (e.isIntersecting) { setOn(true); obs.disconnect(); } },
      { threshold: 0, rootMargin: "0px 0px -30px 0px" }
    );
    if (ref.current) obs.observe(ref.current);
    return () => obs.disconnect();
  }, []);

  const t = "stroke-dashoffset 1s ease, opacity 0.6s ease";

  return (
    <svg ref={ref} width="120" height="80" viewBox="0 0 120 80" fill="none" aria-hidden>
      {/* Axis lines */}
      <line x1="18" y1="16" x2="18" y2="67"
        stroke="rgba(0,0,0,0.1)" strokeWidth="1"
        strokeDasharray="100" pathLength="100"
        strokeDashoffset={on ? 0 : 100}
        style={{ transition: t }}
      />
      <line x1="18" y1="67" x2="108" y2="67"
        stroke="rgba(0,0,0,0.1)" strokeWidth="1"
        strokeDasharray="100" pathLength="100"
        strokeDashoffset={on ? 0 : 100}
        style={{ transition: t }}
      />
      {/* Horizontal guide lines */}
      {[35, 51].map((y, i) => (
        <line key={y} x1="18" y1={y} x2="108" y2={y}
          stroke="rgba(0,0,0,0.05)" strokeWidth="0.8" strokeDasharray="3 3"
          opacity={on ? 1 : 0} style={{ transition: `opacity 0.4s ease ${0.2 + i * 0.1}s` }}
        />
      ))}
      {/* Area fill */}
      <path d="M22,24 40,28 56,34 70,44 84,55 100,62 V67 H22 Z"
        fill="rgba(220,38,38,0.06)"
        opacity={on ? 1 : 0} style={{ transition: "opacity 0.8s ease 0.3s" }}
      />
      {/* Trend line */}
      <polyline points="22,24 40,28 56,34 70,44 84,55 100,62"
        stroke="rgba(220,38,38,0.75)" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"
        strokeDasharray="100" pathLength="100"
        strokeDashoffset={on ? 0 : 100}
        style={{ transition: t, transitionDelay: "0.15s" }}
      />
      {/* End node */}
      <circle cx="100" cy="62" r="3.5"
        fill="rgba(220,38,38,0.85)" stroke="rgba(220,38,38,0.35)" strokeWidth="2.5"
        opacity={on ? 1 : 0} style={{ transition: "opacity 0.4s ease 0.7s" }}
      />
      {/* Alert indicator */}
      <circle cx="84" cy="10" r="5"
        fill="rgba(30,64,175,0.1)" stroke="rgba(30,64,175,0.5)" strokeWidth="1.2"
        opacity={on ? 1 : 0} style={{ transition: "opacity 0.4s ease 0.85s" }}
      />
      {/* Exclamation mark as two lines */}
      <line x1="84" y1="7" x2="84" y2="11.5"
        stroke="rgba(30,64,175,0.85)" strokeWidth="1.3" strokeLinecap="round"
        opacity={on ? 1 : 0} style={{ transition: "opacity 0.3s ease 0.95s" }}
      />
      <circle cx="84" cy="13.5" r="0.8" fill="rgba(30,64,175,0.85)"
        opacity={on ? 1 : 0} style={{ transition: "opacity 0.3s ease 0.95s" }}
      />
    </svg>
  );
}
