import Link from "next/link";
import MetricsCounter from "@/components/landing/MetricsCounter";
import ProcessingSteps from "@/components/landing/ProcessingSteps";
import FAQ from "@/components/landing/FAQ";
import AppMockup from "@/components/landing/AppMockup";
import ComingSoon from "@/components/landing/ComingSoon";
import ScrollReveal from "@/components/landing/ScrollReveal";
import PricingSection from "@/components/landing/PricingSection";
import IllustrationPainPoint1 from "@/components/landing/illustrations/IllustrationPainPoint1";
import IllustrationPainPoint2 from "@/components/landing/illustrations/IllustrationPainPoint2";
import IllustrationPainPoint3 from "@/components/landing/illustrations/IllustrationPainPoint3";
import IllustrationFlow from "@/components/landing/illustrations/IllustrationFlow";
import IllustrationSecurity from "@/components/landing/illustrations/IllustrationSecurity";
import IllustrationHero from "@/components/landing/illustrations/IllustrationHero";
import AgentsSection from "@/components/landing/AgentsSection";
import WordReveal from "@/components/landing/WordReveal";
import ScrollIndicator from "@/components/landing/ScrollIndicator";
import TypingBadge from "@/components/landing/TypingBadge";
import ScrollProgress from "@/components/landing/ScrollProgress";

const BANKS = [
  {
    name: "BBVA",
    logo: (
      <div style={{ height: 48, background: "#004481", borderRadius: 8, padding: "0 16px", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
        <span style={{ color: "#fff", fontWeight: 900, fontSize: 15, letterSpacing: "0.03em" }}>BBVA</span>
      </div>
    ),
  },
  {
    name: "Nu",
    logo: (
      <div style={{ height: 48, background: "#820ad1", borderRadius: 8, padding: "0 18px", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
        <span style={{ color: "#fff", fontWeight: 700, fontSize: 17, letterSpacing: "-0.01em" }}>nu</span>
      </div>
    ),
  },
  {
    name: "Amex",
    logo: (
      <div style={{ height: 48, background: "#016FD0", borderRadius: 8, padding: "0 14px", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
        <span style={{ color: "#fff", fontWeight: 800, fontSize: 12, letterSpacing: "0.1em" }}>AMEX</span>
      </div>
    ),
  },
  {
    name: "Banamex",
    logo: (
      <div style={{ height: 48, background: "#fff", borderRadius: 8, padding: "0 14px", display: "flex", alignItems: "center", gap: 6, flexShrink: 0, border: "1px solid #E2E8F0" }}>
        <div style={{ width: 10, height: 10, borderRadius: "50%", background: "#CC0000", flexShrink: 0 }} />
        <span style={{ color: "#CC0000", fontWeight: 800, fontSize: 13, letterSpacing: "0.01em" }}>Banamex</span>
      </div>
    ),
  },
  {
    name: "HSBC",
    logo: (
      <div style={{ height: 48, background: "#DB0011", borderRadius: 8, padding: "0 16px", display: "flex", alignItems: "center", gap: 8, flexShrink: 0 }}>
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
          <polygon points="12,2 22,7 22,17 12,22 2,17 2,7" fill="rgba(255,255,255,0.25)" stroke="#fff" strokeWidth="1.5"/>
        </svg>
        <span style={{ color: "#fff", fontWeight: 800, fontSize: 13, letterSpacing: "0.04em" }}>HSBC</span>
      </div>
    ),
  },
  {
    name: "Santander",
    logo: (
      <div style={{ height: 48, background: "#EC0000", borderRadius: 8, padding: "0 14px", display: "flex", alignItems: "center", gap: 7, flexShrink: 0 }}>
        <div style={{ width: 18, height: 18, borderRadius: "50%", border: "2px solid rgba(255,255,255,0.6)", flexShrink: 0 }} />
        <span style={{ color: "#fff", fontWeight: 700, fontSize: 12 }}>Santander</span>
      </div>
    ),
  },
  {
    name: "Scotiabank",
    logo: (
      <div style={{ height: 48, background: "#c41e3a", borderRadius: 8, padding: "0 14px", display: "flex", alignItems: "center", flexShrink: 0 }}>
        <span style={{ color: "#ffd700", fontWeight: 800, fontSize: 12 }}>Scotiabank</span>
      </div>
    ),
  },
  {
    name: "Inbursa",
    logo: (
      <div style={{ height: 48, background: "#003478", borderRadius: 8, padding: "0 14px", display: "flex", alignItems: "center", flexShrink: 0 }}>
        <span style={{ color: "#fff", fontWeight: 700, fontSize: 13 }}>Inbursa</span>
      </div>
    ),
  },
];

const PAIN_POINTS = [
  {
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
        <polyline points="14 2 14 8 20 8"/>
        <line x1="16" y1="13" x2="8" y2="13"/>
        <line x1="16" y1="17" x2="8" y2="17"/>
        <polyline points="10 9 9 9 8 9"/>
      </svg>
    ),
    title: "Revisas estados de cuenta manualmente",
    desc: "Cada fin de mes abres 3 apps bancarias distintas, exportas PDFs y copias números a una hoja de cálculo. Tarde o temprano algo falla.",
  },
  {
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="10"/>
        <polyline points="12 6 12 12 16 14"/>
      </svg>
    ),
    title: "Tardas horas en entender tus gastos",
    desc: "¿Cuánto gasté en comida el mes pasado? ¿Cuál tarjeta me conviene liquidar primero? Preguntas simples que te cuestan una tarde entera.",
  },
  {
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/>
        <line x1="12" y1="9" x2="12" y2="13"/>
        <line x1="12" y1="17" x2="12.01" y2="17"/>
      </svg>
    ),
    title: "Las sorpresas llegan al corte",
    desc: "Cargos que olvidaste, suscripciones activas que no usas, intereses acumulados. Te enteras cuando ya es tarde para reaccionar.",
  },
];

const SECURITY_CARDS = [
  {
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
      </svg>
    ),
    title: "Solo lectura",
    desc: "Neto nunca escribe, borra ni mueve dinero. Solo analiza. Acceso estrictamente de lectura a tus correos.",
  },
  {
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <polyline points="17 1 21 5 17 9"/><path d="M3 11V9a4 4 0 0 1 4-4h14"/>
        <polyline points="7 23 3 19 7 15"/><path d="M21 13v2a4 4 0 0 1-4 4H3"/>
      </svg>
    ),
    title: "Acceso revocable",
    desc: "Desconecta Gmail con un solo clic, en cualquier momento. Sin trámites ni formularios.",
  },
  {
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <rect x="3" y="11" width="18" height="11" rx="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/>
      </svg>
    ),
    title: "Sin contraseñas",
    desc: "Usamos Google OAuth oficial. Nunca vemos ni almacenamos tu contraseña de Gmail.",
  },
  {
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <ellipse cx="12" cy="5" rx="9" ry="3"/><path d="M21 12c0 1.66-4 3-9 3s-9-1.34-9-3"/>
        <path d="M3 5v14c0 1.66 4 3 9 3s9-1.34 9-3V5"/>
      </svg>
    ),
    title: "Datos encriptados",
    desc: "Nunca almacenamos tus correos. Solo extraemos los montos y comercios necesarios para responder.",
  },
];


const BEFORE_AFTER = [
  { before: "Abrir 3 apps bancarias distintas",     after: "Todo en un solo lugar, automático" },
  { before: "Exportar PDFs y copiar a Sheets",       after: "Tus movimientos listos al instante" },
  { before: "Buscar el gasto entre cientos",         after: "Pregúntalo en lenguaje natural" },
  { before: "Calcular intereses a mano",             after: "Análisis de deuda en segundos" },
  { before: "Descubrir suscripciones olvidadas",     after: "Alertas antes del cargo" },
  { before: "Fin de mes lleno de sorpresas",         after: "Control en tiempo real" },
];

export default function LandingPage() {
  return (
    <div className="dot-grid" style={{ backgroundColor: "var(--bg)", color: "var(--text)", minHeight: "100vh" }}>
      <ScrollProgress />

      {/* ── HEADER ── */}
      <header style={{
        position: "sticky", top: 0, zIndex: 50,
        display: "flex", alignItems: "center", justifyContent: "space-between",
        padding: "0 32px", height: 60,
        background: "rgba(255,255,255,0.95)",
        backdropFilter: "blur(12px)",
        borderBottom: "1px solid #E2E8F0",
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <div style={{
            width: 30, height: 30, background: "var(--accent)", borderRadius: 8,
            display: "flex", alignItems: "center", justifyContent: "center",
          }}>
            <svg width="13" height="13" viewBox="0 0 16 16" fill="none" stroke="#FFFFFF" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="1,11 4,6 7,9 11,3 15,5"/>
            </svg>
          </div>
          <span style={{ fontSize: 19, lineHeight: 1, color: "#0F172A", fontWeight: 500, letterSpacing: "-0.02em" }}>
            Neto
          </span>
        </div>

        <nav className="land-nav">
          <a href="#como-funciona" className="land-nav-link">Cómo funciona</a>
          <a href="#seguridad"     className="land-nav-link">Seguridad</a>
          <a href="#precios"       className="land-nav-link">Precios</a>
          <a href="#faq"           className="land-nav-link">FAQ</a>
        </nav>

        <Link href="/chat" style={{ textDecoration: "none" }}>
          <button style={{
            background: "#1E40AF", color: "#FFFFFF",
            border: "none", borderRadius: 6, cursor: "pointer",
            padding: "9px 18px", fontSize: 14, fontWeight: 500,
            fontFamily: "inherit",
          }}>
            Conectar Gmail
          </button>
        </Link>
      </header>

      {/* ── HERO ── */}
      <section className="land-hero" style={{ position: "relative", textAlign: "center", padding: "96px 24px 80px", overflow: "hidden" }}>
        {/* Decorative radial blobs */}
        <div aria-hidden style={{ position: "absolute", inset: 0, pointerEvents: "none" }}>
          <div style={{ position: "absolute", top: "-15%", left: "50%", transform: "translateX(-50%)", width: 800, height: 800, borderRadius: "50%", background: "radial-gradient(circle, rgba(30,64,175,0.06) 0%, transparent 60%)" }} />
          <div style={{ position: "absolute", top: "8%", left: "-6%", width: 480, height: 480, borderRadius: "50%", background: "radial-gradient(circle, rgba(30,64,175,0.04) 0%, transparent 60%)" }} />
          <div style={{ position: "absolute", top: "2%", right: "-6%", width: 420, height: 420, borderRadius: "50%", background: "radial-gradient(circle, rgba(30,64,175,0.03) 0%, transparent 60%)" }} />
        </div>
        <div style={{ position: "relative", zIndex: 1 }}>
        <div className="land-fade" style={{
          display: "inline-flex", alignItems: "center", gap: 7,
          background: "#DBEAFE", border: "1px solid #BFDBFE",
          borderRadius: 100, padding: "5px 14px", marginBottom: 16,
        }}>
          <span style={{ width: 6, height: 6, borderRadius: "50%", background: "var(--accent)", display: "block", flexShrink: 0 }} />
          <span style={{ fontSize: 12, color: "#1E40AF", letterSpacing: "0.06em", textTransform: "uppercase", fontWeight: 500 }}>
            <TypingBadge text="Asistente financiero personal" />
          </span>
        </div>
        <div style={{
          height: 1, width: 0, background: "#1E40AF", borderRadius: 1,
          margin: "0 auto 16px", animation: "heroLineGrow 1.2s ease-out 0.3s both",
          maxWidth: 120,
        }} />

        <h1 className="land-fade-2" style={{
          fontSize: "clamp(48px, 6vw, 80px)",
          fontWeight: 500, lineHeight: 1.1,
          letterSpacing: "-0.03em",
          color: "var(--text)",
          maxWidth: 760, margin: "0 auto 24px",
        }}>
          <span style={{ display: "block" }}>Tus finanzas,</span>
          <span className="land-accent-reveal" style={{ color: "var(--accent)", display: "block" }}>
            en piloto automático
          </span>
        </h1>

        <WordReveal
          text="Neto lee tus correos bancarios y responde en español cualquier pregunta sobre tu dinero. Sin hojas de cálculo, sin apps extra."
          style={{ fontSize: 17, color: "var(--text2)", lineHeight: 1.7, maxWidth: 520, margin: "0 auto 44px" }}
        />

        <div className="land-fade-4" style={{ display: "flex", gap: 12, justifyContent: "center", flexWrap: "wrap", marginBottom: 18 }}>
          <Link href="/chat" style={{ textDecoration: "none" }}>
            <button style={{
              background: "#1E40AF", color: "#FFFFFF",
              border: "none", borderRadius: 6, cursor: "pointer",
              padding: "10px 22px", fontSize: 14, fontWeight: 500,
              fontFamily: "inherit",
            }}>
              Empieza gratis
            </button>
          </Link>
          <a href="#como-funciona" style={{
            display: "inline-block", textDecoration: "none",
            background: "transparent", color: "#1E40AF",
            border: "1px solid #BFDBFE", borderRadius: 6,
            padding: "10px 22px", fontSize: 14, fontFamily: "inherit",
          }}>
            Ver cómo funciona →
          </a>
        </div>
        <p className="land-fade-4" style={{ fontSize: 12, color: "var(--text3)" }}>
          Gratis · Solo lectura · Sin compartir contraseñas
        </p>

        <ScrollIndicator />

        <div className="land-fade-5" style={{ marginTop: 32, display: "flex", justifyContent: "center", alignItems: "center", width: "100%" }}>
          <IllustrationHero />
        </div>
        </div>
      </section>

      {/* ── METRICS ── */}
      <MetricsCounter />

      {/* ── BANK CAROUSEL ── */}
      <section style={{ paddingBottom: 100 }}>
        <p style={{ textAlign: "center", fontSize: 11, color: "var(--text3)", letterSpacing: "0.1em", textTransform: "uppercase", marginBottom: 24, fontWeight: 500 }}>
          Compatible con los bancos mexicanos
        </p>
        <div className="carousel-outer">
          <div className="carousel-track">
            {[...BANKS, ...BANKS, ...BANKS].map((bank, i) => (
              <div key={i} style={{ flexShrink: 0, minWidth: 120, height: 48, display: "flex", alignItems: "center", justifyContent: "center" }}>
                {bank.logo}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CREDIBILITY ── */}
      <section style={{ padding: "0 24px 72px", textAlign: "center" }}>
        <p style={{ fontSize: 12, color: "var(--text3)", marginBottom: 20 }}>
          Construido en Monterrey, México 🇲🇽
        </p>
        <div style={{ display: "flex", flexWrap: "wrap", gap: 10, justifyContent: "center" }}>
          {[
            "🔒 OAuth 2.0 de Google",
            "🤖 Powered by Claude AI de Anthropic",
            "⚡ Desplegado en Vercel · 99.9% uptime",
          ].map(badge => (
            <div key={badge} style={{
              background: "var(--card)", border: "1px solid var(--border)",
              borderRadius: 100, padding: "7px 18px",
              fontSize: 12, color: "var(--text2)",
            }}>
              {badge}
            </div>
          ))}
        </div>
      </section>

      <div className="land-sep" />

      {/* ── PAIN POINTS ── */}
      <section style={{ padding: "100px 24px", maxWidth: 960, margin: "0 auto" }}>
        <div style={{ textAlign: "center", marginBottom: 56 }}>
          <p style={{ fontSize: 11, color: "var(--text3)", letterSpacing: "0.1em", textTransform: "uppercase", marginBottom: 14, fontWeight: 500 }}>
            La realidad actual
          </p>
          <h2 style={{
            fontSize: "clamp(32px, 4vw, 52px)", fontWeight: 500,
            color: "var(--text)", lineHeight: 1.15, margin: 0,
            letterSpacing: "-0.02em",
          }}>
            Administrar tu dinero no debería<br />ser un trabajo de medio tiempo
          </h2>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))", gap: 16 }}>
          {PAIN_POINTS.map((p, i) => (
            <ScrollReveal key={i} delay={i * 110}>
              <div className="pain-card" style={{
                background: "#F8FAFC", border: "1px solid #E2E8F0",
                borderRadius: 16, padding: "28px 24px",
              }}>
                <div style={{ marginBottom: 16, display: "flex", justifyContent: "flex-start" }}>
                  {i === 0 && <IllustrationPainPoint1 />}
                  {i === 1 && <IllustrationPainPoint2 />}
                  {i === 2 && <IllustrationPainPoint3 />}
                </div>
                <h3 style={{ fontSize: 15, fontWeight: 500, color: "var(--text)", marginBottom: 10, lineHeight: 1.4 }}>
                  {p.title}
                </h3>
                <p style={{ fontSize: 13, color: "var(--text2)", lineHeight: 1.7, margin: 0 }}>
                  {p.desc}
                </p>
              </div>
            </ScrollReveal>
          ))}
        </div>
      </section>

      <div className="land-sep" />

      {/* ── PROCESSING STEPS ── */}
      <div id="como-funciona" style={{ scrollMarginTop: 72 }}>
        <div style={{ display: "flex", justifyContent: "center", paddingTop: 56, paddingBottom: 8 }}>
          <IllustrationFlow />
        </div>
        <ProcessingSteps />
      </div>

      <div className="land-sep" />

      {/* ── BEFORE / AFTER ── */}
      <section style={{ padding: "100px 24px", maxWidth: 800, margin: "0 auto" }}>
        <div style={{ textAlign: "center", marginBottom: 48 }}>
          <p style={{ fontSize: 11, color: "var(--text3)", letterSpacing: "0.1em", textTransform: "uppercase", marginBottom: 14, fontWeight: 500 }}>
            La diferencia
          </p>
          <h2 style={{
            fontSize: "clamp(32px, 4vw, 52px)", fontWeight: 500,
            color: "var(--text)", lineHeight: 1.15, margin: 0,
            letterSpacing: "-0.02em",
          }}>
            Antes y <span style={{ color: "var(--accent)" }}>después</span> de Neto
          </h2>
        </div>

        <div style={{ borderRadius: 16, overflow: "hidden", border: "1px solid #E2E8F0" }}>
          {/* Column headers */}
          <div className="land-ba-header" style={{ display: "grid", gridTemplateColumns: "1fr 1fr" }}>
            <div style={{
              padding: "16px 24px",
              borderBottom: "1px solid #E2E8F0",
              borderRight: "1px solid #E2E8F0",
              display: "flex", alignItems: "center", gap: 10,
            }}>
              <div style={{
                background: "rgba(220,38,38,0.08)", border: "1px solid rgba(220,38,38,0.2)",
                borderRadius: 6, padding: "3px 10px", fontSize: 11, fontWeight: 600,
                color: "var(--danger)", letterSpacing: "0.06em", textTransform: "uppercase",
              }}>Sin Neto</div>
            </div>
            <div style={{
              padding: "16px 24px",
              borderBottom: "1px solid #E2E8F0",
              background: "#EFF6FF",
              borderLeft: "2px solid #1E40AF",
              display: "flex", alignItems: "center", gap: 10,
            }}>
              <div style={{
                background: "#DBEAFE", border: "1px solid #BFDBFE",
                borderRadius: 6, padding: "3px 10px", fontSize: 11, fontWeight: 600,
                color: "var(--accent)", letterSpacing: "0.06em", textTransform: "uppercase",
              }}>Con Neto</div>
            </div>
          </div>

          {/* Rows */}
          {BEFORE_AFTER.map((row, i) => (
            <div key={i} className="land-ba-row" style={{
              display: "grid", gridTemplateColumns: "1fr 1fr",
              borderBottom: i < BEFORE_AFTER.length - 1 ? "1px solid #E2E8F0" : "none",
            }}>
              <div style={{
                display: "flex", alignItems: "center", gap: 14, padding: "18px 24px",
                borderRight: "1px solid #E2E8F0",
              }}>
                <span style={{ color: "var(--danger)", fontSize: 20, flexShrink: 0, lineHeight: 1 }}>✗</span>
                <span style={{ fontSize: 13, color: "var(--text3)", lineHeight: 1.5 }}>{row.before}</span>
              </div>
              <div style={{
                display: "flex", alignItems: "center", gap: 14, padding: "18px 24px",
                background: "#EFF6FF",
                borderLeft: "2px solid #BFDBFE",
              }}>
                <span style={{ color: "var(--accent)", fontSize: 20, flexShrink: 0, lineHeight: 1 }}>✓</span>
                <span style={{ fontSize: 13, color: "var(--text)", lineHeight: 1.5 }}>{row.after}</span>
              </div>
            </div>
          ))}
        </div>
      </section>

      <div className="land-sep" />

      {/* ── AGENTS ── */}
      <AgentsSection />

      <div className="land-sep" />

      {/* ── SECURITY ── */}
      <section id="seguridad" className="grid-bg" style={{ scrollMarginTop: 72, padding: "100px 24px", maxWidth: 960, margin: "0 auto" }}>
        <div style={{ textAlign: "center", marginBottom: 48 }}>
          <p style={{ fontSize: 11, color: "var(--text3)", letterSpacing: "0.1em", textTransform: "uppercase", marginBottom: 14, fontWeight: 500 }}>
            Tu privacidad primero
          </p>
          <h2 style={{
            fontSize: "clamp(32px, 4vw, 52px)", fontWeight: 500,
            color: "var(--text)", lineHeight: 1.15, margin: 0,
            letterSpacing: "-0.02em",
          }}>
            Construido con seguridad<br />como prioridad
          </h2>
          <div style={{ display: "flex", justifyContent: "center", marginTop: 36 }}>
            <IllustrationSecurity />
          </div>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: 16 }}>
          {SECURITY_CARDS.map((card, i) => (
            <ScrollReveal key={i} delay={i * 90}>
              <div className="card-hover-line" style={{
                background: "var(--bg2)", border: "1px solid var(--border)",
                borderRadius: 16, padding: "26px 22px",
              }}>
                <div style={{ color: "var(--accent2)", marginBottom: 16, opacity: 0.85 }}>{card.icon}</div>
                <h3 style={{ fontSize: 14, fontWeight: 600, color: "var(--text)", marginBottom: 8, letterSpacing: "-0.01em" }}>
                  {card.title}
                </h3>
                <p style={{ fontSize: 13, color: "var(--text2)", lineHeight: 1.7, margin: 0 }}>
                  {card.desc}
                </p>
              </div>
            </ScrollReveal>
          ))}
        </div>
      </section>

      <div className="land-sep" />

      {/* ── PRECIOS ── */}
      <section id="precios" className="grid-bg" style={{ scrollMarginTop: 72, padding: "100px 24px", maxWidth: 960, margin: "0 auto" }}>
        <div style={{ textAlign: "center", marginBottom: 48 }}>
          <p style={{ fontSize: 11, color: "var(--text3)", letterSpacing: "0.1em", textTransform: "uppercase", marginBottom: 14, fontWeight: 500 }}>
            Precios
          </p>
          <h2 style={{
            fontSize: "clamp(32px, 4vw, 52px)", fontWeight: 500,
            color: "var(--text)", lineHeight: 1.15, margin: 0,
            letterSpacing: "-0.02em",
          }}>
            Empieza gratis,{" "}
            crece cuando lo necesites
          </h2>
        </div>

        <PricingSection />
      </section>

      <div className="land-sep" />

      {/* ── PRÓXIMAMENTE ── */}
      <ComingSoon />

      <div className="land-sep" />

      {/* ── FAQ ── */}
      <div id="faq" style={{ scrollMarginTop: 72 }}>
        <FAQ />
      </div>

      {/* ── FINAL CTA ── */}
      <section style={{
        textAlign: "center", padding: "100px 24px 120px",
        position: "relative", overflow: "hidden",
        background: "#1E40AF",
      }}>
        <div aria-hidden style={{
          position: "absolute", inset: 0, pointerEvents: "none",
          background: "radial-gradient(ellipse 80% 50% at 50% 100%, rgba(255,255,255,0.08) 0%, transparent 70%)",
        }} />
        <div style={{ position: "relative", zIndex: 1 }}>
          <div style={{
            display: "inline-flex", width: 72, height: 72,
            background: "var(--accent)", borderRadius: 20,
            alignItems: "center", justifyContent: "center",
            marginBottom: 32,
            boxShadow: "0 0 80px rgba(255,255,255,0.2), 0 0 160px rgba(255,255,255,0.1)",
          }}>
            <svg width="32" height="32" viewBox="0 0 16 16" fill="none" stroke="#FFFFFF" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="1,11 4,6 7,9 11,3 15,5"/>
            </svg>
          </div>

          <h2 style={{
            fontSize: "clamp(40px, 5vw, 64px)", fontWeight: 500,
            color: "#FFFFFF", lineHeight: 1.1,
            marginBottom: 16, letterSpacing: "-0.03em",
            maxWidth: 700, margin: "0 auto 16px",
          }}>
            Tu contador personal,<br />siempre disponible
          </h2>
          <p style={{
            fontSize: 16, color: "rgba(255,255,255,0.55)", lineHeight: 1.7,
            maxWidth: 500, margin: "0 auto 40px",
          }}>
            Conecta tus cuentas de BBVA, Amex, Nu y 5 bancos más en menos de 2 minutos.
          </p>

          <Link href="/chat" style={{ textDecoration: "none" }}>
            <button style={{
              background: "#fff", color: "#1E40AF",
              border: "none", borderRadius: 8, cursor: "pointer",
              padding: "14px 32px", fontSize: 16, fontWeight: 500,
              fontFamily: "inherit",
              boxShadow: "0 0 32px rgba(255,255,255,0.08)",
            }}>
              Empieza gratis
            </button>
          </Link>

          {/* Social proof */}
          <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 12, marginTop: 28 }}>
            <div style={{ display: "flex" }}>
              {(["#b8f566","#66c4f5","#f5c166","#f56666","#c466f5"] as const).map((c, i) => (
                <div key={i} style={{
                  width: 32, height: 32, borderRadius: "50%",
                  background: `linear-gradient(135deg, ${c}33, ${c}88)`,
                  border: "2px solid rgba(255,255,255,0.3)",
                  marginLeft: i === 0 ? 0 : -10,
                  display: "flex", alignItems: "center", justifyContent: "center",
                  fontSize: 11, fontWeight: 600, color: c,
                }}>
                  {["AL","MR","KG","PE","JL"][i]}
                </div>
              ))}
            </div>
            <span style={{ fontSize: 13, color: "rgba(255,255,255,0.45)" }}>
              Únete a <strong style={{ color: "#FFFFFF" }}>+2,400</strong> usuarios en México
            </span>
          </div>
        </div>
      </section>

      {/* ── FOOTER ── */}
      <footer style={{ borderTop: "1px solid rgba(255,255,255,0.1)", background: "#0F172A" }}>
        <div className="land-footer-grid" style={{
          maxWidth: 960, margin: "0 auto",
          display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(170px, 1fr))",
          gap: "48px 32px", padding: "64px 32px 48px",
        }}>
          {/* Brand */}
          <div>
            <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 16 }}>
              <div style={{ width: 28, height: 28, background: "var(--accent)", borderRadius: 8, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                <svg width="12" height="12" viewBox="0 0 16 16" fill="none" stroke="#FFFFFF" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="1,11 4,6 7,9 11,3 15,5"/>
                </svg>
              </div>
              <span style={{ fontSize: 18, lineHeight: 1, fontWeight: 500, letterSpacing: "-0.02em", color: "#fff" }}>Neto</span>
            </div>
            <p style={{ fontSize: 13, color: "rgba(255,255,255,0.6)", lineHeight: 1.7, marginBottom: 16, maxWidth: 200 }}>
              Tu contador personal con IA. Control financiero en lenguaje natural.
            </p>
            <p style={{ fontSize: 12, color: "rgba(255,255,255,0.4)", margin: 0 }}>Hecho en Monterrey 🇲🇽</p>
          </div>

          {/* Producto */}
          <div>
            <p style={{ fontSize: 11, color: "rgba(255,255,255,0.4)", letterSpacing: "0.1em", textTransform: "uppercase", marginBottom: 20, margin: "0 0 20px" }}>Producto</p>
            {[
              { label: "Cómo funciona", href: "#como-funciona" },
              { label: "Precios",        href: "#precios" },
              { label: "Seguridad",      href: "#seguridad" },
              { label: "FAQ",            href: "#faq" },
            ].map(item => (
              <a key={item.href} href={item.href} className="footer-link">{item.label}</a>
            ))}
          </div>

          {/* Legal */}
          <div>
            <p style={{ fontSize: 11, color: "rgba(255,255,255,0.4)", letterSpacing: "0.1em", textTransform: "uppercase", marginBottom: 20, margin: "0 0 20px" }}>Legal</p>
            <a href="/privacidad" className="footer-link">Privacidad</a>
            <a href="/terminos"   className="footer-link">Términos de uso</a>
          </div>

          {/* Contacto */}
          <div>
            <p style={{ fontSize: 11, color: "rgba(255,255,255,0.4)", letterSpacing: "0.1em", textTransform: "uppercase", marginBottom: 20, margin: "0 0 20px" }}>Contacto</p>
            <a href="mailto:hola@useneto.com.mx" className="footer-link">hola@useneto.com.mx</a>
            <a href="https://x.com/useneto" className="footer-link" target="_blank" rel="noopener noreferrer">@useneto</a>
          </div>
        </div>

        {/* Copyright */}
        <div style={{
          borderTop: "1px solid rgba(255,255,255,0.1)",
          padding: "20px 32px",
          display: "flex", alignItems: "center", justifyContent: "space-between",
          flexWrap: "wrap", gap: 12,
        }}>
          <span style={{ fontSize: 12, color: "rgba(255,255,255,0.4)" }}>© 2026 Neto · Todos los derechos reservados</span>
          <span style={{ fontSize: 12, color: "rgba(255,255,255,0.4)" }}>México 🇲🇽</span>
        </div>
      </footer>

    </div>
  );
}
