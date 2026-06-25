"use client";

import { useInView } from "./useInView";
import type { ReactNode } from "react";

/**
 * Encabezado de sección con el lenguaje visual de Handle:
 *  - Badge en MAYÚSCULAS dentro de un pill con borde fino (.land-badge)
 *  - Headline grande de DOS TONOS: line1 en oscuro sólido, line2 en gris medio
 *  - Línea de acento azul que se "dibuja" de izquierda a derecha (scaleX) al
 *    entrar al viewport
 *
 * Todo el reveal es opacity + transform → 60fps, y respeta reduced-motion.
 */
export default function SectionHeading({
  badge,
  line1,
  line2,
  desc,
  align = "center",
  accentLine = true,
  maxWidth = 640,
}: {
  badge?: string;
  line1: ReactNode;
  line2?: ReactNode;
  desc?: ReactNode;
  align?: "center" | "left";
  accentLine?: boolean;
  maxWidth?: number;
}) {
  const { ref, inView } = useInView<HTMLDivElement>();
  const centered = align === "center";

  return (
    <div
      ref={ref}
      style={{
        textAlign: centered ? "center" : "left",
        opacity: inView ? 1 : 0,
        transform: inView ? "translateY(0)" : "translateY(16px)",
        transition: "opacity 0.55s ease, transform 0.55s ease",
        willChange: "opacity, transform",
      }}
    >
      {badge && (
        <div style={{ display: "flex", justifyContent: centered ? "center" : "flex-start", marginBottom: 22 }}>
          <span className="land-badge">{badge}</span>
        </div>
      )}

      <h2 className="land-headline" style={{ margin: 0, maxWidth, marginInline: centered ? "auto" : 0 }}>
        <span style={{ display: "block", color: "var(--text)" }}>{line1}</span>
        {line2 && <span style={{ display: "block", color: "var(--headline-muted)" }}>{line2}</span>}
      </h2>

      {accentLine && (
        <div
          aria-hidden
          style={{
            height: 2,
            width: 56,
            background: "var(--accent)",
            borderRadius: 2,
            marginTop: 22,
            marginInline: centered ? "auto" : 0,
            transformOrigin: "left center",
            transform: inView ? "scaleX(1)" : "scaleX(0)",
            transition: "transform 0.6s ease 0.15s",
            willChange: "transform",
          }}
        />
      )}

      {desc && (
        <p
          className="land-headline-desc"
          style={{ maxWidth: 520, marginInline: centered ? "auto" : 0 }}
        >
          {desc}
        </p>
      )}
    </div>
  );
}
