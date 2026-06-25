"use client";

import { useEffect, useRef, useState } from "react";

export default function IllustrationPainPoint1() {
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
      {/* Back doc */}
      <rect x="28" y="6" width="64" height="50" rx="3"
        stroke="rgba(0,0,0,0.08)" strokeWidth="1.2"
        strokeDasharray="100" pathLength="100"
        strokeDashoffset={on ? 0 : 100}
        style={{ transition: t }}
      />
      {/* Mid doc */}
      <rect x="22" y="12" width="64" height="50" rx="3"
        stroke="rgba(0,0,0,0.12)" strokeWidth="1.2" fill="rgba(0,0,0,0.01)"
        strokeDasharray="100" pathLength="100"
        strokeDashoffset={on ? 0 : 100}
        style={{ transition: t, transitionDelay: "0.15s" }}
      />
      {/* Front doc */}
      <rect x="16" y="18" width="64" height="50" rx="3"
        stroke="rgba(0,0,0,0.2)" strokeWidth="1.2" fill="rgba(248,250,252,0.95)"
        strokeDasharray="100" pathLength="100"
        strokeDashoffset={on ? 0 : 100}
        style={{ transition: t, transitionDelay: "0.3s" }}
      />
      {/* Header bar */}
      <rect x="16" y="18" width="64" height="9" rx="2" fill="rgba(0,0,0,0.03)"
        opacity={on ? 1 : 0} style={{ transition: "opacity 0.5s ease 0.4s" }}
      />
      {/* Text lines */}
      {[30, 38, 46].map((y, i) => (
        <line key={y} x1="24" y1={y} x2={i === 1 ? 65 : 72} y2={y}
          stroke="rgba(0,0,0,0.1)" strokeWidth="1"
          strokeDasharray="100" pathLength="100"
          strokeDashoffset={on ? 0 : 100}
          style={{ transition: t, transitionDelay: `${0.45 + i * 0.1}s` }}
        />
      ))}
      {/* Accent line */}
      <line x1="24" y1="54" x2="50" y2="54"
        stroke="rgba(30,64,175,0.65)" strokeWidth="1.5"
        strokeDasharray="100" pathLength="100"
        strokeDashoffset={on ? 0 : 100}
        style={{ transition: t, transitionDelay: "0.75s" }}
      />
      {/* Accent node */}
      <circle cx="50" cy="54" r="2.5" fill="rgba(30,64,175,0.8)"
        opacity={on ? 1 : 0} style={{ transition: "opacity 0.4s ease 0.85s" }}
      />
    </svg>
  );
}
