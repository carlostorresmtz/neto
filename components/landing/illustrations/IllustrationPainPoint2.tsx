"use client";

import { useEffect, useRef, useState } from "react";

export default function IllustrationPainPoint2() {
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

  const t = "stroke-dashoffset 0.9s ease, opacity 0.6s ease";

  return (
    <svg ref={ref} width="120" height="80" viewBox="0 0 120 80" fill="none" aria-hidden>
      {/* Outer ring */}
      <circle cx="60" cy="40" r="28"
        stroke="rgba(0,0,0,0.06)" strokeWidth="1" strokeDasharray="4 3"
        opacity={on ? 1 : 0} style={{ transition: "opacity 0.5s ease 0.7s" }}
      />
      {/* Clock face */}
      <circle cx="60" cy="40" r="22"
        stroke="rgba(0,0,0,0.2)" strokeWidth="1.3"
        strokeDasharray="100" pathLength="100"
        strokeDashoffset={on ? 0 : 100}
        style={{ transition: t }}
      />
      {/* Tick marks at 12, 3, 6, 9 */}
      {[
        { x1: 60, y1: 19, x2: 60, y2: 23 },
        { x1: 81, y1: 40, x2: 77, y2: 40 },
        { x1: 60, y1: 61, x2: 60, y2: 57 },
        { x1: 39, y1: 40, x2: 43, y2: 40 },
      ].map((l, i) => (
        <line key={i} {...l}
          stroke="rgba(0,0,0,0.25)" strokeWidth="1.3"
          opacity={on ? 1 : 0} style={{ transition: `opacity 0.3s ease ${0.2 + i * 0.07}s` }}
        />
      ))}
      {/* Hour hand (pointing ~5) */}
      <line x1="60" y1="40" x2="72" y2="52"
        stroke="rgba(0,0,0,0.4)" strokeWidth="1.8" strokeLinecap="round"
        strokeDasharray="100" pathLength="100"
        strokeDashoffset={on ? 0 : 100}
        style={{ transition: t, transitionDelay: "0.35s" }}
      />
      {/* Minute hand (pointing ~10) */}
      <line x1="60" y1="40" x2="48" y2="25"
        stroke="rgba(0,0,0,0.55)" strokeWidth="1.5" strokeLinecap="round"
        strokeDasharray="100" pathLength="100"
        strokeDashoffset={on ? 0 : 100}
        style={{ transition: t, transitionDelay: "0.5s" }}
      />
      {/* Center dot */}
      <circle cx="60" cy="40" r="2.2" fill="rgba(0,0,0,0.6)"
        opacity={on ? 1 : 0} style={{ transition: "opacity 0.3s ease 0.6s" }}
      />
      {/* Radiating accent dots */}
      <circle cx="60" cy="5" r="2" fill="rgba(30,64,175,0.45)"
        opacity={on ? 1 : 0} style={{ transition: "opacity 0.4s ease 0.8s" }}
      />
      <circle cx="100" cy="14" r="1.4" fill="rgba(30,64,175,0.3)"
        opacity={on ? 1 : 0} style={{ transition: "opacity 0.4s ease 0.9s" }}
      />
      <circle cx="110" cy="42" r="1.8" fill="rgba(30,64,175,0.35)"
        opacity={on ? 1 : 0} style={{ transition: "opacity 0.4s ease 1s" }}
      />
    </svg>
  );
}
