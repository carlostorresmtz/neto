"use client";

import { useEffect, useState } from "react";

export default function ScrollProgress() {
  const [pct, setPct] = useState(0);

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const onScroll = () => {
      const h = document.documentElement.scrollHeight - window.innerHeight;
      setPct(h > 0 ? (window.scrollY / h) * 100 : 0);
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <div className="scroll-progress-track" style={{ position: "fixed", left: 0, top: 0, width: 2, height: "100vh", zIndex: 100, pointerEvents: "none" }}>
      <div style={{
        width: "100%",
        height: `${pct}%`,
        background: "linear-gradient(to bottom, #1E40AF, rgba(30,64,175,0.15))",
        transition: "height 0.1s linear",
      }} />
    </div>
  );
}
