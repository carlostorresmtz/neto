"use client";
import { useEffect, useRef, useState } from "react";
import SectionHeading from "./SectionHeading";

const BADGE_STYLES: Record<string, React.CSSProperties> = {
  "En vivo":      { background: "#DCFCE7",  color: "#16A34A", border: "1px solid #BBF7D0" },
  "Beta":         { background: "#FEF9C3",  color: "#854D0E", border: "1px solid #FEF08A" },
  "Próximamente": { background: "#F1F5F9",  color: "#64748B", border: "1px solid #E2E8F0" },
  "Business":     { background: "#DBEAFE",  color: "#1E40AF", border: "1px solid #BFDBFE" },
};

type AgentData = {
  badge: "En vivo" | "Beta" | "Próximamente" | "Business";
  prefix: string;
  desc: string;
  cons?: string[];
  pros?: string[];
  steps?: string[];
  brief?: true;
  cta?: true;
};

const AGENTS: AgentData[] = [
  {
    badge: "En vivo",
    prefix: "Alertas",
    desc: "Monitorea tus correos bancarios en tiempo real y te avisa antes de que sea tarde. Sin configuración, sin reglas manuales.",
    cons: [
      "Revisas manualmente cada app bancaria",
      "Te enteras del vencimiento cuando ya pasó",
      "Descubres cargos raros semanas después",
      "No sabes cuánto debes hasta el corte",
      "Las suscripciones se renuevan sin avisar",
      "Las sorpresas llegan al estado de cuenta",
    ],
    pros: [
      "Detecta automáticamente cada correo bancario",
      "Avisa 4 días antes del vencimiento de tu tarjeta",
      "Detecta cargos inusuales en menos de 2 horas",
      "Calcula tu deuda actual en tiempo real",
      "Avisa cuando una suscripción está por renovarse",
      "Cero sorpresas al final del mes",
    ],
    steps: [
      "Llega correo bancario → Detectado",
      "Neto extrae monto, comercio y fecha → Procesado",
      "Evalúa si requiere alerta → Analizado",
      "Genera mensaje en español → Redactado",
      "Envía notificación al usuario → Enviado",
      "Registra en historial → Listo ✓",
    ],
  },
  {
    badge: "En vivo",
    prefix: "Cierre",
    desc: "El día 1 de cada mes, CierreAgent genera tu resumen financiero completo, sin que tengas que pedirlo.",
    cons: [
      "Calculas tus gastos a mano al final del mes",
      "No sabes en qué categoría gastaste más",
      "Comparas con el mes anterior a ojo",
      "Tu contador te pide info que no tienes organizada",
      "Descubres suscripciones olvidadas en el estado de cuenta",
      "El resumen te lleva medio día",
    ],
    pros: [
      "Resumen automático el día 1 de cada mes",
      "Top 5 categorías de gasto con variación vs mes anterior",
      "Comparativa automática mes a mes",
      "Reporte listo para tu contador en PDF",
      "Lista de suscripciones activas con costo anual",
      "Todo en menos de 30 segundos",
    ],
    steps: [
      "Día 1 del mes → Activado automáticamente",
      "Recopila todos los correos del mes → Consolidado",
      "Categoriza y calcula totales → Analizado",
      "Genera resumen con comparativas → Redactado",
      "Entrega reporte al usuario → Listo ✓",
    ],
  },
  {
    badge: "Beta",
    prefix: "Comparador",
    desc: "Analiza tus gastos reales y calcula qué tarjeta de crédito mexicana te conviene más, con números exactos, no estimaciones genéricas.",
    cons: [
      "Comparas tarjetas con datos genéricos de internet",
      "No sabes cuánto cashback ganarías realmente",
      "Calculas intereses a mano con tu estado de cuenta",
      "Eliges tarjeta por instinto o por publicidad",
      "Pagas anualidad sin saber si vale la pena",
      "Tu perfil de gasto no encaja con ningún comparador genérico",
    ],
    pros: [
      "Analiza tus gastos reales de los últimos 3 meses",
      "Calcula cashback exacto con cada tarjeta del mercado",
      "Compara tu tasa de interés actual vs alternativas",
      "Recomienda la tarjeta ideal para tu perfil de gasto",
      "Calcula si la anualidad se paga sola con los beneficios",
      "Personalizado 100% con tus datos reales",
    ],
    steps: [
      "Analiza historial de gastos → Procesado",
      "Cruza con beneficios de 20+ tarjetas mexicanas → Comparado",
      "Calcula cashback y ahorro en intereses → Calculado",
      "Recomienda tu tarjeta ideal con números → Listo ✓",
    ],
  },
  {
    badge: "Beta",
    prefix: "Deducibles",
    desc: "Clasifica automáticamente tus gastos deducibles y genera el reporte que tu contador necesita, cada mes, sin pedirlo.",
    cons: [
      "Guardas tickets en una carpeta sin organizar",
      "Pierdes tiempo buscando gastos deducibles",
      "Tu contador te pide info que no tienes lista",
      "Pagas más ISR del que deberías",
      "No sabes qué gastos son deducibles",
      "El cierre fiscal es estresante cada año",
    ],
    pros: [
      "Detecta gastos deducibles automáticamente",
      "Los clasifica por categoría SAT (honorarios, arrendamiento, etc.)",
      "Genera reporte mensual listo para tu contador",
      "Calcula tu ISR estimado en tiempo real",
      "Te avisa cuando un gasto podría ser deducible",
      "Cierre fiscal sin sorpresas",
    ],
    steps: [
      "Detecta gasto con RFC o factura → Identificado",
      "Clasifica según catálogo SAT → Categorizado",
      "Acumula en reporte mensual → Registrado",
      "Genera PDF para contador → Listo ✓",
    ],
  },
  {
    badge: "Próximamente",
    prefix: "Fraude",
    desc: "Detecta cargos duplicados, montos inusuales y patrones sospechosos antes de que llegue tu estado de cuenta.",
    brief: true,
  },
  {
    badge: "Business",
    prefix: "Agente",
    desc: "¿Tu empresa tiene un flujo financiero único? Construimos agentes a medida integrados con tu operación.",
    cta: true,
  },
];

function AgentSteps({ steps }: { steps: string[] }) {
  const [visible, setVisible] = useState(0);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setVisible(steps.length);
      return;
    }
    const obs = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting) {
          obs.disconnect();
          let count = 0;
          const next = () => {
            count++;
            setVisible(count);
            if (count < steps.length) setTimeout(next, 300);
          };
          setTimeout(next, 200);
        }
      },
      { threshold: 0, rootMargin: "0px 0px -60px 0px" }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, [steps.length]);

  return (
    <div ref={ref} style={{ marginTop: 36 }}>
      <p style={{
        fontSize: 11, color: "var(--text3)", letterSpacing: "0.1em",
        textTransform: "uppercase", marginBottom: 20, fontWeight: 500,
      }}>
        Cómo funciona
      </p>
      <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
        {steps.map((step, i) => {
          const arrowIdx = step.indexOf(" → ");
          const left  = arrowIdx >= 0 ? step.slice(0, arrowIdx) : step;
          const right = arrowIdx >= 0 ? step.slice(arrowIdx + 3) : null;
          const isActive = i < visible;
          const isDone   = right?.includes("✓");
          return (
            <div key={i} style={{
              display: "flex", alignItems: "center", gap: 16,
              opacity: isActive ? 1 : 0.18,
              transform: isActive ? "none" : "translateY(5px)",
              transition: "opacity 0.35s ease, transform 0.35s ease",
            }}>
              <span style={{
                fontSize: 11, fontWeight: 700, minWidth: 24, letterSpacing: "0.05em",
                color: isActive ? "#1E40AF" : "#CBD5E1",
                transition: "color 0.35s ease",
              }}>
                {String(i + 1).padStart(2, "0")}
              </span>
              <div style={{
                flex: 1, display: "flex", alignItems: "center", justifyContent: "space-between",
                background: isActive ? "rgba(30,64,175,0.04)" : "transparent",
                border: `1px solid ${isActive ? "rgba(30,64,175,0.15)" : "transparent"}`,
                borderRadius: 8, padding: "10px 16px",
                transition: "background 0.35s ease, border-color 0.35s ease",
              }}>
                <span style={{ fontSize: 13, color: "var(--text2)" }}>{left}</span>
                {right && (
                  <span style={{
                    fontSize: 11, fontWeight: 600, flexShrink: 0, marginLeft: 12,
                    color: isDone ? "#16A34A" : "var(--text3)",
                    background: isDone ? "#DCFCE7" : "#F1F5F9",
                    border: `1px solid ${isDone ? "#BBF7D0" : "#E2E8F0"}`,
                    borderRadius: 6, padding: "3px 10px",
                  }}>
                    {right}
                  </span>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

function AgentBlock({ agent, isLast }: { agent: AgentData; isLast: boolean }) {
  const bs = BADGE_STYLES[agent.badge];

  if (agent.cta) {
    return (
      <div style={{
        border: "1.5px dashed #BFDBFE", borderRadius: 12, padding: "48px 40px",
        background: "#EFF6FF", textAlign: "center",
      }}>
        <div style={{ display: "inline-flex", ...bs, borderRadius: 100, padding: "4px 14px", fontSize: 11, fontWeight: 600, marginBottom: 24, letterSpacing: "0.08em", textTransform: "uppercase" }}>
          {agent.badge}
        </div>
        <h3 style={{ fontSize: "clamp(24px, 3vw, 36px)", fontWeight: 500, color: "var(--text)", marginBottom: 16, letterSpacing: "-0.02em", lineHeight: 1.15 }}>
          Agente <span style={{ color: "#1E40AF" }}>Personalizado</span>
        </h3>
        <p style={{ fontSize: 15, color: "var(--text2)", lineHeight: 1.7, maxWidth: 440, margin: "0 auto 32px" }}>
          {agent.desc}
        </p>
        <a href="mailto:hola@useneto.com.mx" style={{ textDecoration: "none" }}>
          <button style={{
            background: "#DBEAFE", border: "1px solid #BFDBFE",
            borderRadius: 8, padding: "12px 28px", fontSize: 14, fontWeight: 500,
            color: "#1E40AF", cursor: "pointer", fontFamily: "inherit",
          }}>
            Contactar →
          </button>
        </a>
      </div>
    );
  }

  if (agent.brief) {
    return (
      <div style={{ display: "flex", alignItems: "center", gap: 28, padding: "36px 0", opacity: 0.65 }}>
        <div style={{ display: "inline-flex", ...bs, borderRadius: 100, padding: "4px 14px", fontSize: 11, fontWeight: 600, letterSpacing: "0.08em", textTransform: "uppercase", flexShrink: 0 }}>
          {agent.badge}
        </div>
        <div>
          <h3 style={{ fontSize: 20, fontWeight: 500, color: "var(--text)", marginBottom: 6, letterSpacing: "-0.02em" }}>
            {agent.prefix}<span style={{ color: "var(--text3)" }}>Agent</span>
          </h3>
          <p style={{ fontSize: 13, color: "var(--text2)", margin: 0, lineHeight: 1.6 }}>{agent.desc}</p>
        </div>
      </div>
    );
  }

  return (
    <div style={{ paddingBottom: isLast ? 0 : 80 }}>
      <div style={{ marginBottom: 32 }}>
        <div style={{ display: "inline-flex", ...bs, borderRadius: 100, padding: "4px 14px", fontSize: 11, fontWeight: 600, marginBottom: 20, letterSpacing: "0.08em", textTransform: "uppercase" }}>
          {agent.badge}
        </div>
        <h3 style={{ fontSize: "clamp(28px, 4vw, 48px)", fontWeight: 500, color: "var(--text)", marginBottom: 14, letterSpacing: "-0.02em", lineHeight: 1.1 }}>
          {agent.prefix}<span style={{ color: "var(--accent)" }}>Agent</span>
        </h3>
        <p style={{ fontSize: 15, color: "var(--text2)", lineHeight: 1.7, maxWidth: 560, margin: 0 }}>
          {agent.desc}
        </p>
      </div>

      {agent.cons && agent.pros && (
        <div style={{ borderRadius: 12, overflow: "hidden", border: "1px solid #E2E8F0" }}>
          <div className="agents-compare-grid">
            <div style={{ padding: "14px 22px", borderBottom: "1px solid #E2E8F0", borderRight: "1px solid #E2E8F0", display: "flex", alignItems: "center" }}>
              <div style={{ background: "rgba(220,38,38,0.08)", border: "1px solid rgba(220,38,38,0.2)", borderRadius: 6, padding: "3px 10px", fontSize: 11, fontWeight: 600, color: "var(--danger)", letterSpacing: "0.06em", textTransform: "uppercase" }}>
                Sin Neto
              </div>
            </div>
            <div style={{ padding: "14px 22px", borderBottom: "1px solid #E2E8F0", background: "#EFF6FF", borderLeft: "2px solid #1E40AF", display: "flex", alignItems: "center" }}>
              <div style={{ background: "#DBEAFE", border: "1px solid #BFDBFE", borderRadius: 6, padding: "3px 10px", fontSize: 11, fontWeight: 600, color: "var(--accent)", letterSpacing: "0.06em", textTransform: "uppercase" }}>
                Con Neto
              </div>
            </div>
          </div>
          {agent.cons.map((con, i) => (
            <div key={i} className="agents-compare-grid" style={{ borderBottom: i < agent.cons!.length - 1 ? "1px solid #F1F5F9" : "none" }}>
              <div style={{ display: "flex", alignItems: "center", gap: 12, padding: "16px 22px", borderRight: "1px solid #F1F5F9" }}>
                <span style={{ color: "var(--danger)", fontSize: 18, flexShrink: 0, lineHeight: 1 }}>✗</span>
                <span style={{ fontSize: 13, color: "var(--text3)", lineHeight: 1.5 }}>{con}</span>
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: 12, padding: "16px 22px", background: "#F0FDF4", borderLeft: "2px solid #86EFAC" }}>
                <span style={{ color: "#16A34A", fontSize: 18, flexShrink: 0, lineHeight: 1 }}>✓</span>
                <span style={{ fontSize: 13, color: "var(--text)", lineHeight: 1.5 }}>{agent.pros![i]}</span>
              </div>
            </div>
          ))}
        </div>
      )}

      {agent.steps && <AgentSteps steps={agent.steps} />}
    </div>
  );
}

export default function AgentsSection() {
  return (
    <section id="agentes" style={{ scrollMarginTop: 72, padding: "100px 24px", maxWidth: 960, margin: "0 auto" }}>
      <div style={{ marginBottom: 80 }}>
        <SectionHeading
          badge="Agentes"
          line1="Tu operación financiera,"
          line2="en piloto automático"
          desc="Agentes de IA que trabajan en segundo plano, sin que tengas que hacer nada."
        />
      </div>

      {AGENTS.map((agent, i) => (
        <div key={i}>
          <AgentBlock agent={agent} isLast={i === AGENTS.length - 1} />
          {i < AGENTS.length - 1 && !agent.cta && (
            <div style={{ height: 1, background: "linear-gradient(90deg, transparent, #E2E8F0, transparent)", margin: "0 0 80px" }} />
          )}
        </div>
      ))}
    </section>
  );
}
