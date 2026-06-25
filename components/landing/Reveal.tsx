"use client";

import { useInView } from "./useInView";
import type { CSSProperties, ReactNode } from "react";

/**
 * Scroll reveal sutil: fade-in (opacity 0→1) + slide-up (translateY 16px→0)
 * cuando el elemento entra al viewport, una sola vez. Usa solo transform y
 * opacity para correr a 60fps. Respeta prefers-reduced-motion (vía useInView).
 *
 * `delay` en ms permite escalonar (stagger) elementos hermanos.
 */
export default function Reveal({
  children,
  delay = 0,
  className,
  style,
}: {
  children: ReactNode;
  delay?: number;
  className?: string;
  style?: CSSProperties;
}) {
  const { ref, inView } = useInView<HTMLDivElement>();

  return (
    <div
      ref={ref}
      className={className}
      style={{
        opacity: inView ? 1 : 0,
        transform: inView ? "translateY(0)" : "translateY(16px)",
        transition: `opacity 0.55s ease ${delay}ms, transform 0.55s ease ${delay}ms`,
        willChange: "opacity, transform",
        ...style,
      }}
    >
      {children}
    </div>
  );
}
