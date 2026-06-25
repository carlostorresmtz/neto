"use client";

import { useEffect, useRef, useState } from "react";
import SectionHeading from "./SectionHeading";

const METRICS = [
  { staticVal: "100", prefix: "", suffix: "%", target: 100, label: "automático", sub: "Lee tus correos sin que muevas un dedo" },
  { staticVal: null,  prefix: "", suffix: "",  target: 8,   label: "bancos mexicanos", sub: "BBVA, Amex, Nu, Banamex y más" },
  { staticVal: "<2s", prefix: "", suffix: "",  target: 0,   label: "de respuesta", sub: "Análisis instantáneo de tus movimientos" },
  { staticVal: "0",   prefix: "", suffix: "",  target: 0,   label: "configuración", sub: "Conecta Gmail y listo, sin reglas" },
];

function useCountUp(target: number, duration: number, started: boolean) {
  const [count, setCount] = useState(0);
  useEffect(() => {
    if (!started || target === 0) { setCount(0); return; }
    // Bajo prefers-reduced-motion mostramos el valor final sin animar.
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setCount(target);
      return;
    }
    const startTime = performance.now();
    const frame = (now: number) => {
      const t = Math.min((now - startTime) / duration, 1);
      const eased = 1 - Math.pow(1 - t, 3);
      setCount(Math.round(eased * target));
      if (t < 1) requestAnimationFrame(frame);
    };
    requestAnimationFrame(frame);
  }, [started, target, duration]);
  return count;
}

function ImpactNumber({
  staticVal, prefix, suffix, target, label, sub, started, delay,
}: {
  staticVal: string | null; prefix: string; suffix: string; target: number;
  label: string; sub: string; started: boolean; delay: number;
}) {
  // Cuenta hacia arriba solo si hay target > 0; si no, muestra el valor estático.
  const count = useCountUp(target, 1300, started && target > 0);
  const display = target > 0 ? `${prefix}${count}${suffix}` : (staticVal ?? "0");

  return (
    <div
      className="land-col"
      style={{
        textAlign: "center",
        opacity: started ? 1 : 0,
        transform: started ? "translateY(0)" : "translateY(16px)",
        transition: `opacity 0.55s ease ${delay}ms, transform 0.55s ease ${delay}ms`,
        willChange: "opacity, transform",
      }}
    >
      <div className="impact-num">{display}</div>
      <div style={{ fontSize: 14, fontWeight: 600, color: "var(--text)", margin: "14px 0 4px" }}>
        {label}
      </div>
      <div style={{ fontSize: 12.5, color: "var(--text3)", lineHeight: 1.6, maxWidth: 200, marginInline: "auto" }}>
        {sub}
      </div>
    </div>
  );
}

export default function MetricsCounter() {
  const ref = useRef<HTMLDivElement>(null);
  const [started, setStarted] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) { setStarted(true); return; }
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) { setStarted(true); observer.disconnect(); } },
      { threshold: 0, rootMargin: "0px 0px -60px 0px" }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <section style={{ padding: "0 24px 100px", maxWidth: 1000, margin: "0 auto" }}>
      <div style={{ marginBottom: 56 }}>
        <SectionHeading
          badge="El impacto"
          line1="Menos trabajo manual,"
          line2="más control real"
        />
      </div>
      <div ref={ref} className="land-cols land-cols--4">
        {METRICS.map((m, i) => (
          <ImpactNumber key={m.label} {...m} started={started} delay={i * 90} />
        ))}
      </div>
    </section>
  );
}
