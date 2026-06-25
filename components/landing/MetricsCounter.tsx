"use client";

import { useEffect, useRef, useState } from "react";

const METRICS = [
  { staticVal: null,    prefix: "",  value: 8,   suffix: "",  label: "bancos conectados",  sub: "BBVA, Amex, Nu, Banamex y más" },
  { staticVal: "$0",    prefix: "$", value: 0,   suffix: "",  label: "costo para empezar", sub: "Detecta tus gastos automáticamente" },
  { staticVal: "< 2 s", prefix: "", value: 0,   suffix: "",  label: "tiempo de respuesta", sub: "Análisis instantáneo de tus correos" },
  { staticVal: "100%",  prefix: "", value: 100, suffix: "%", label: "solo lectura",        sub: "Nunca escribe ni mueve dinero" },
];

function useCountUp(target: number, duration: number, started: boolean) {
  const [count, setCount] = useState(0);
  useEffect(() => {
    if (!started) return;
    if (target === 0) { setCount(0); return; }
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

function MetricCard({ staticVal, prefix, value, suffix, label, sub, started, delay }: {
  staticVal: string | null; prefix: string; value: number; suffix: string;
  label: string; sub: string; started: boolean; delay: number;
}) {
  const count = useCountUp(value, 1200, started && !staticVal);
  const displayValue = staticVal ?? `${prefix}${count}${suffix}`;
  const [done, setDone] = useState(false);

  useEffect(() => {
    if (!staticVal && value > 0 && count >= value && !done) setDone(true);
  }, [count, value, done, staticVal]);

  return (
    <div style={{
      background: "var(--card)", border: "1px solid var(--border)",
      borderRadius: 16, padding: "28px 24px",
      opacity: started ? 1 : 0,
      transform: started ? "translateY(0)" : "translateY(16px)",
      transition: `opacity 0.5s ease ${delay}ms, transform 0.5s ease ${delay}ms`,
    }}>
      <div
        className={done ? "metric-flip" : ""}
        style={{
          fontSize: 44, lineHeight: 1, color: "var(--accent)",
          marginBottom: 10, letterSpacing: "-0.03em", fontWeight: 600,
          animationDelay: done ? `${delay}ms` : undefined,
        }}
      >
        {displayValue}
      </div>
      <div style={{ fontSize: 14, fontWeight: 500, color: "var(--text)", marginBottom: 6 }}>
        {label}
      </div>
      <div style={{ fontSize: 12, color: "var(--text3)", lineHeight: 1.6 }}>
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
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) { setStarted(true); observer.disconnect(); } },
      { threshold: 0, rootMargin: "0px 0px -50px 0px" }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <section ref={ref} style={{ padding: "0 24px 96px", maxWidth: 960, margin: "0 auto" }}>
      <div style={{ textAlign: "center", marginBottom: 48 }}>
        <p style={{ fontSize: 11, color: "var(--text3)", letterSpacing: "0.1em", textTransform: "uppercase", marginBottom: 12, fontWeight: 500 }}>
          En números
        </p>
        <h2 style={{
          fontSize: "clamp(32px, 4vw, 52px)", fontWeight: 500,
          color: "var(--text)", lineHeight: 1.15, margin: 0,
          letterSpacing: "-0.02em",
        }}>
          Diseñado para México,<br />desde el primer correo
        </h2>
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: 16 }}>
        {METRICS.map((m, i) => (
          <MetricCard key={m.label} {...m} started={started} delay={i * 80} />
        ))}
      </div>
    </section>
  );
}
