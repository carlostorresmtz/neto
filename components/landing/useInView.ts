"use client";

import { useEffect, useRef, useState } from "react";

/**
 * Observa cuándo un elemento entra al viewport (una sola vez).
 * Si el usuario prefiere reduced-motion, devuelve `true` de inmediato
 * para que el contenido aparezca sin animación.
 *
 * Uso:
 *   const { ref, inView } = useInView<HTMLDivElement>();
 *   <div ref={ref}>{inView && ...}</div>
 */
export function useInView<T extends Element = HTMLDivElement>(
  options?: { threshold?: number; rootMargin?: string }
) {
  const ref = useRef<T>(null);
  const [inView, setInView] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (
      typeof window !== "undefined" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches
    ) {
      setInView(true);
      return;
    }
    const obs = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setInView(true);
          obs.disconnect();
        }
      },
      {
        threshold: options?.threshold ?? 0,
        rootMargin: options?.rootMargin ?? "0px 0px -40px 0px",
      }
    );
    obs.observe(el);
    return () => obs.disconnect();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return { ref, inView };
}
