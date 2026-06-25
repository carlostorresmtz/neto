import Link from "next/link";
import MetricsCounter from "@/components/landing/MetricsCounter";
import ProcessingSteps from "@/components/landing/ProcessingSteps";
import FAQ from "@/components/landing/FAQ";
import ComingSoon from "@/components/landing/ComingSoon";
import Reveal from "@/components/landing/Reveal";
import SectionHeading from "@/components/landing/SectionHeading";
import HeaderLogo from "@/components/landing/HeaderLogo";
import PricingSection from "@/components/landing/PricingSection";
import IllustrationPainPoint1 from "@/components/landing/illustrations/IllustrationPainPoint1";
import IllustrationPainPoint2 from "@/components/landing/illustrations/IllustrationPainPoint2";
import IllustrationPainPoint3 from "@/components/landing/illustrations/IllustrationPainPoint3";
import IllustrationPainPoint4 from "@/components/landing/illustrations/IllustrationPainPoint4";
import IllustrationFlow from "@/components/landing/illustrations/IllustrationFlow";
import IllustrationSecurity from "@/components/landing/illustrations/IllustrationSecurity";
import IllustrationHero from "@/components/landing/illustrations/IllustrationHero";
import AgentsSection from "@/components/landing/AgentsSection";
import WordReveal from "@/components/landing/WordReveal";
import ScrollIndicator from "@/components/landing/ScrollIndicator";
import TypingBadge from "@/components/landing/TypingBadge";
import ScrollProgress from "@/components/landing/ScrollProgress";

const BANKS = ["BBVA", "Santander", "Nu", "Amex", "Banamex", "HSBC", "Scotiabank", "Inbursa"];

const PAIN_POINTS = [
  {
    title: "Revisas estados de cuenta a mano",
    desc: "Abres 3 apps bancarias, exportas PDFs y copias números a una hoja. Tarde o temprano algo falla.",
  },
  {
    title: "Tardas horas en entender tus gastos",
    desc: "¿Cuánto gasté en comida? ¿Qué tarjeta liquido primero? Preguntas simples que cuestan una tarde entera.",
  },
  {
    title: "Las sorpresas llegan al corte",
    desc: "Cargos olvidados, suscripciones que no usas, movimientos raros. Te enteras cuando ya es tarde.",
  },
  {
    title: "Los intereses crecen sin que lo notes",
    desc: "La deuda y los intereses se acumulan mes con mes, y nadie te avisa hasta que el saldo ya pesa.",
  },
];

const PAIN_ILLUSTRATIONS = [
  <IllustrationPainPoint1 key="1" />,
  <IllustrationPainPoint2 key="2" />,
  <IllustrationPainPoint3 key="3" />,
  <IllustrationPainPoint4 key="4" />,
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
        <HeaderLogo />

        <nav className="land-nav">
          <a href="#como-funciona" className="land-nav-link">Cómo funciona</a>
          <a href="#seguridad"     className="land-nav-link">Seguridad</a>
          <a href="#precios"       className="land-nav-link">Precios</a>
          <a href="#faq"           className="land-nav-link">FAQ</a>
        </nav>

        <Link href="/chat" style={{ textDecoration: "none" }}>
          <button className="land-btn-primary" style={{ padding: "9px 18px", fontSize: 14 }}>
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
          display: "inline-flex", alignItems: "center", gap: 8,
          border: "1px solid var(--border2)",
          borderRadius: 100, padding: "5px 14px", marginBottom: 22,
        }}>
          <span className="live-dot" style={{ width: 6, height: 6, borderRadius: "50%", display: "block", flexShrink: 0 }} />
          <span style={{ fontSize: 11, color: "var(--text2)", letterSpacing: "0.14em", textTransform: "uppercase", fontWeight: 600 }}>
            <TypingBadge text="Asistente financiero personal" />
          </span>
        </div>

        <h1 className="land-fade-2" style={{
          fontSize: "clamp(46px, 6.4vw, 80px)",
          fontWeight: 600, lineHeight: 1.05,
          letterSpacing: "-0.035em",
          maxWidth: 800, margin: "0 auto 26px",
        }}>
          <span style={{ display: "block", color: "var(--text)" }}>Tus finanzas,</span>
          <span className="land-accent-reveal" style={{ color: "var(--headline-muted)", display: "block" }}>
            en piloto automático
          </span>
        </h1>

        <div style={{
          height: 2, width: 0, background: "var(--accent)", borderRadius: 2,
          margin: "0 auto 26px", animation: "heroLineGrow 1.2s ease-out 0.5s both",
          maxWidth: 64,
        }} />

        <WordReveal
          text="Neto lee tus correos bancarios y responde en español cualquier pregunta sobre tu dinero. Sin hojas de cálculo, sin apps extra."
          style={{ fontSize: 17, color: "var(--text2)", lineHeight: 1.7, maxWidth: 520, margin: "0 auto 44px" }}
        />

        <div className="land-fade-4" style={{ display: "flex", gap: 12, justifyContent: "center", flexWrap: "wrap", marginBottom: 18 }}>
          <Link href="/chat" style={{ textDecoration: "none" }}>
            <button className="land-btn-primary" style={{ padding: "10px 22px", fontSize: 14 }}>
              Empieza gratis
            </button>
          </Link>
          <a href="#como-funciona" className="land-btn-secondary" style={{ padding: "10px 22px", fontSize: 14 }}>
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
              <span key={i} className="bank-name">{bank}</span>
            ))}
          </div>
        </div>
      </section>

      {/* ── CREDIBILITY ── */}
      <section style={{ padding: "0 24px 72px", textAlign: "center" }}>
        <p style={{ fontSize: 12, color: "var(--text3)", marginBottom: 20 }}>
          Construido en Monterrey, México
        </p>
        <div style={{ display: "flex", flexWrap: "wrap", gap: 10, justifyContent: "center" }}>
          {[
            "Solo lectura",
            "Tus datos nunca se comparten",
            "Conexión segura con Gmail",
          ].map(badge => (
            <div key={badge} style={{
              background: "transparent", border: "1px solid var(--hairline)",
              borderRadius: 100, padding: "7px 18px",
              fontSize: 13, color: "var(--text3)",
            }}>
              {badge}
            </div>
          ))}
        </div>
      </section>

      <div className="land-sep" />

      {/* ── PAIN POINTS ── */}
      <section style={{ padding: "100px 24px", maxWidth: 1080, margin: "0 auto" }}>
        <div style={{ marginBottom: 64 }}>
          <SectionHeading
            badge="Tu realidad hoy"
            line1="Administrar tu dinero no debería"
            line2="ser un trabajo de medio tiempo"
            maxWidth={760}
          />
        </div>

        <div className="land-cols land-cols--4">
          {PAIN_POINTS.map((p, i) => (
            <Reveal key={i} delay={i * 90} className="land-col">
              <div className="illus-card" style={{ height: 116, marginBottom: 24 }}>
                {PAIN_ILLUSTRATIONS[i]}
              </div>
              <h3 style={{ fontSize: 15, fontWeight: 600, color: "var(--text)", marginBottom: 10, lineHeight: 1.4 }}>
                {p.title}
              </h3>
              <p style={{ fontSize: 13, color: "var(--text2)", lineHeight: 1.7, margin: 0 }}>
                {p.desc}
              </p>
            </Reveal>
          ))}
        </div>
      </section>

      <div className="land-sep" />

      {/* ── PROCESSING STEPS ── */}
      <div id="como-funciona" style={{ scrollMarginTop: 72 }}>
        <div style={{ display: "flex", justifyContent: "center", padding: "64px 24px 0" }}>
          <Reveal className="illus-card" style={{ width: "100%", maxWidth: 520, padding: "28px 24px" }}>
            <IllustrationFlow />
          </Reveal>
        </div>
        <ProcessingSteps />
      </div>

      <div className="land-sep" />

      {/* ── BEFORE / AFTER ── */}
      <section style={{ padding: "100px 24px", maxWidth: 800, margin: "0 auto" }}>
        <div style={{ marginBottom: 56 }}>
          <SectionHeading
            badge="La diferencia"
            line1="Tu dinero, antes"
            line2="y después de Neto"
          />
        </div>

        <Reveal style={{ borderRadius: 16, overflow: "hidden", border: "1px solid #E2E8F0" }}>
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
        </Reveal>
      </section>

      <div className="land-sep" />

      {/* ── AGENTS ── */}
      <AgentsSection />

      <div className="land-sep" />

      {/* ── SECURITY ── */}
      <section id="seguridad" className="grid-bg" style={{ scrollMarginTop: 72, padding: "100px 24px", maxWidth: 960, margin: "0 auto" }}>
        <div style={{ marginBottom: 40 }}>
          <SectionHeading
            badge="Tu privacidad primero"
            line1="Construido con seguridad"
            line2="como prioridad"
          />
        </div>

        <div style={{ display: "flex", justifyContent: "center", marginBottom: 48 }}>
          <Reveal className="illus-card" style={{ padding: "24px 28px" }}>
            <IllustrationSecurity />
          </Reveal>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: 16 }}>
          {SECURITY_CARDS.map((card, i) => (
            <Reveal key={i} delay={i * 80} style={{ height: "100%" }}>
              <div className="card-hover-line card-lift" style={{
                background: "var(--card)", border: "1px solid var(--border)",
                borderRadius: 16, padding: "26px 22px", height: "100%",
              }}>
                <div style={{ color: "var(--accent)", marginBottom: 16, opacity: 0.9 }}>{card.icon}</div>
                <h3 style={{ fontSize: 14, fontWeight: 600, color: "var(--text)", marginBottom: 8, letterSpacing: "-0.01em" }}>
                  {card.title}
                </h3>
                <p style={{ fontSize: 13, color: "var(--text2)", lineHeight: 1.7, margin: 0 }}>
                  {card.desc}
                </p>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      <div className="land-sep" />

      {/* ── PRECIOS ── */}
      <section id="precios" className="grid-bg" style={{ scrollMarginTop: 72, padding: "100px 24px", maxWidth: 960, margin: "0 auto" }}>
        <div style={{ marginBottom: 48 }}>
          <SectionHeading
            badge="Precios"
            line1="Empieza gratis,"
            line2="crece cuando lo necesites"
          />
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
            fontSize: 16, color: "rgba(255,255,255,0.7)", lineHeight: 1.7,
            maxWidth: 500, margin: "0 auto 40px",
          }}>
            Conecta tus cuentas de BBVA, Amex, Nu y 5 bancos más en menos de 2 minutos.
          </p>

          <Link href="/chat" style={{ textDecoration: "none" }}>
            <button className="land-btn-white" style={{ padding: "14px 32px", fontSize: 16 }}>
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
            <span style={{ fontSize: 13, color: "rgba(255,255,255,0.6)" }}>
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
