"use client";

import { useEffect, useState } from "react";

/**
 * Barra de progreso de scroll: línea fina (2px) en la parte superior de la
 * página que se llena de izquierda a derecha con el avance del scroll.
 * Usa transform: scaleX (GPU, 60fps), no width. Respeta reduced-motion.
 */
export default function ScrollProgress() {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const onScroll = () => {
      const h = document.documentElement.scrollHeight - window.innerHeight;
      setProgress(h > 0 ? Math.min(window.scrollY / h, 1) : 0);
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, []);

  return (
    <div
      className="scroll-progress-top"
      style={{
        width: "100%",
        transform: `scaleX(${progress})`,
        transition: "transform 0.1s linear",
      }}
    />
  );
}
