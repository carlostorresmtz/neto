"use client";

import { useInView } from "../useInView";
import type { CSSProperties, ReactNode } from "react";

/**
 * Lienzo SVG para ilustraciones de líneas finas estilo Handle.
 * Cuando entra al viewport agrega la clase `is-drawn`, que dispara la
 * animación de "dibujado" (stroke-dashoffset) de todos los hijos con
 * clase .draw-line y el fade de los .draw-fade. Una sola vez.
 *
 * Cada hijo <path/line/circle> debe llevar pathLength={1} y className
 * "draw-line" (para trazos) o "draw-fade" (para nodos/rellenos), y puede
 * escalonarse con transitionDelay inline.
 */
export default function LineArt({
  width,
  height,
  viewBox,
  children,
  style,
}: {
  width: number;
  height: number;
  viewBox: string;
  children: ReactNode;
  style?: CSSProperties;
}) {
  const { ref, inView } = useInView<SVGSVGElement>({ rootMargin: "0px 0px -30px 0px" });
  return (
    <svg
      ref={ref}
      className={inView ? "is-drawn" : ""}
      width={width}
      height={height}
      viewBox={viewBox}
      fill="none"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
      style={{ maxWidth: "100%", height: "auto", display: "block", ...style }}
    >
      {children}
    </svg>
  );
}

/** Color de trazo y acento compartidos. */
export const STROKE = "var(--illus-stroke)";
export const ACCENT = "var(--accent)";
