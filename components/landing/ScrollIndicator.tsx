"use client";

import { useEffect, useState } from "react";

export default function ScrollIndicator() {
  const [hidden, setHidden] = useState(false);

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setHidden(true);
      return;
    }
    const onScroll = () => { if (window.scrollY > 100) setHidden(true); };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  if (hidden) return null;

  return (
    <div style={{
      display: "flex", justifyContent: "center", marginTop: 32,
      opacity: 0,
      animation: "fadeIn 0.6s ease 1.5s both",
    }}>
      <div style={{
        animation: "scrollBounce 2s ease-in-out infinite",
        color: "rgba(30,64,175,0.4)",
      }}>
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
          <polyline points="6 9 12 15 18 9"/>
        </svg>
      </div>
    </div>
  );
}
