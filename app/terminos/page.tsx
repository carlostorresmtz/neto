import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Términos de Uso — Neto",
  description: "Condiciones de uso del servicio Neto conforme a la legislación mexicana.",
};

function Logo() {
  return (
    <Link href="/" style={{ display: "inline-flex", alignItems: "center", gap: 10, textDecoration: "none" }}>
      <div style={{
        width: 32, height: 32, borderRadius: 9, background: "var(--accent)",
        display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0,
      }}>
        <svg width="14" height="14" viewBox="0 0 16 16" fill="none" stroke="#0d0f0e" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round">
          <polyline points="1,11 4,6 7,9 11,3 15,5" />
        </svg>
      </div>
      <span style={{
        fontFamily: "var(--font-geist-sans), sans-serif",
        fontSize: 20, color: "var(--text)", lineHeight: 1,
      }}>Neto</span>
    </Link>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section style={{ marginBottom: 44 }}>
      <h2 style={{
        fontFamily: "var(--font-geist-sans), sans-serif",
        fontSize: 22, fontWeight: 400, color: "var(--text)",
        margin: "0 0 14px", lineHeight: 1.3,
      }}>{title}</h2>
      <div style={{ color: "var(--text2)", fontSize: 15, lineHeight: 1.8 }}>
        {children}
      </div>
    </section>
  );
}

export default function TerminosPage() {
  return (
    <div style={{ background: "var(--bg)", minHeight: "100vh", color: "var(--text)" }}>
      {/* Header */}
      <header style={{
        borderBottom: "1px solid var(--border)",
        padding: "18px 32px",
        display: "flex", alignItems: "center",
      }}>
        <Logo />
      </header>

      {/* Content */}
      <main style={{ maxWidth: 700, margin: "0 auto", padding: "64px 32px 96px" }}>
        {/* Title */}
        <div style={{ marginBottom: 48 }}>
          <p style={{
            fontSize: 11, color: "var(--text3)", letterSpacing: "0.1em",
            textTransform: "uppercase", marginBottom: 12,
          }}>
            Última actualización: junio de 2026
          </p>
          <h1 style={{
            fontFamily: "var(--font-geist-sans), sans-serif",
            fontSize: "clamp(32px, 5vw, 48px)", fontWeight: 400,
            color: "var(--text)", lineHeight: 1.15, margin: "0 0 18px",
          }}>
            Términos de Uso
          </h1>
          <p style={{ fontSize: 16, color: "var(--text2)", lineHeight: 1.8, margin: 0, maxWidth: 580 }}>
            Al acceder o usar Neto aceptas estos Términos de Uso. Si no estás de acuerdo con alguno de los puntos,
            te pedimos no utilizar el servicio.
          </p>
        </div>

        <div style={{ borderTop: "1px solid var(--border)", marginBottom: 44 }} />

        <Section title="1. Descripción del servicio">
          <p>
            Neto es un asistente financiero personal que analiza tus correos electrónicos bancarios para generar
            resúmenes, estadísticas y recomendaciones sobre tus finanzas personales. El servicio opera únicamente
            en modo de <strong style={{ color: "var(--text)", fontWeight: 500 }}>lectura</strong>: nunca realiza
            transacciones, transferencias ni modificaciones en tus cuentas bancarias.
          </p>
        </Section>

        <Section title="2. Elegibilidad">
          <p>
            Para usar Neto debes ser mayor de 18 años, residir en México y tener capacidad legal para celebrar
            contratos conforme al{" "}
            <strong style={{ color: "var(--text)", fontWeight: 500 }}>Código Civil Federal</strong>.
            Al registrarte declaras que cumples con estos requisitos.
          </p>
        </Section>

        <Section title="3. Tu cuenta">
          <p style={{ marginBottom: 14 }}>Eres responsable de:</p>
          <ul style={{ margin: 0, paddingLeft: 22, display: "flex", flexDirection: "column", gap: 8 }}>
            <li>Mantener la confidencialidad de tus credenciales de acceso.</li>
            <li>Toda actividad que ocurra bajo tu cuenta.</li>
            <li>Notificarnos de inmediato ante cualquier acceso no autorizado.</li>
          </ul>
          <p style={{ marginTop: 14 }}>
            Neto no será responsable por daños derivados del incumplimiento de estas obligaciones.
          </p>
        </Section>

        <Section title="4. Uso aceptable">
          <p style={{ marginBottom: 14 }}>
            Al usar Neto te comprometes a no:
          </p>
          <ul style={{ margin: 0, paddingLeft: 22, display: "flex", flexDirection: "column", gap: 8 }}>
            <li>Usar el servicio para fines ilegales o contrarios a la legislación mexicana.</li>
            <li>Intentar acceder a cuentas de terceros sin su autorización expresa.</li>
            <li>Realizar ingeniería inversa, descompilar o copiar el software de Neto.</li>
            <li>Sobrecargar deliberadamente los servidores o infraestructura del servicio.</li>
            <li>Proporcionar información falsa al registrarte o al usar el servicio.</li>
          </ul>
        </Section>

        <Section title="5. Permisos de acceso a Gmail">
          <p>
            Al conectar tu cuenta de Gmail autorizas a Neto a leer correos de remitentes bancarios específicos
            para identificar transacciones. Esta autorización puede revocarse en cualquier momento desde la
            configuración de tu cuenta de Google. Neto no lee, almacena ni procesa correos que no sean
            notificaciones financieras de bancos o instituciones de crédito.
          </p>
        </Section>

        <Section title="6. Propiedad intelectual">
          <p>
            Todos los derechos de propiedad intelectual sobre el software, diseño, logotipos, texto y contenido
            de Neto son propiedad exclusiva de sus creadores. Se te otorga una licencia limitada, no exclusiva e
            intransferible para usar el servicio conforme a estos Términos. No se ceden derechos de propiedad
            intelectual al usuario.
          </p>
        </Section>

        <Section title="7. Disponibilidad del servicio">
          <p>
            Nos esforzamos por mantener Neto disponible de forma continua, pero no garantizamos disponibilidad
            ininterrumpida. Podemos realizar mantenimientos programados o no programados. No seremos responsables
            por pérdidas derivadas de interrupciones del servicio fuera de nuestro control.
          </p>
        </Section>

        <Section title="8. Limitación de responsabilidad">
          <p style={{ marginBottom: 14 }}>
            El servicio se proporciona <strong style={{ color: "var(--text)", fontWeight: 500 }}>"tal cual"</strong>.
            En la medida permitida por la legislación mexicana aplicable, Neto no será responsable por:
          </p>
          <ul style={{ margin: 0, paddingLeft: 22, display: "flex", flexDirection: "column", gap: 8 }}>
            <li>Decisiones financieras tomadas con base en la información proporcionada por el asistente.</li>
            <li>Inexactitudes en la interpretación de correos bancarios.</li>
            <li>Daños indirectos, incidentales o consecuentes.</li>
            <li>Interrupciones o errores derivados de terceros (bancos, Google, etc.).</li>
          </ul>
          <p style={{ marginTop: 14 }}>
            La información de Neto es orientativa y no constituye asesoría financiera profesional.
          </p>
        </Section>

        <Section title="9. Precios y pagos">
          <p>
            Neto ofrece un plan gratuito permanente. Los planes de pago (Pro y Business) se cobran mensualmente
            mediante los métodos disponibles en la plataforma. Los precios están expresados en pesos mexicanos (MXN)
            e incluyen IVA cuando aplique. Puedes cancelar tu suscripción en cualquier momento; no se realizan
            reembolsos por períodos ya cobrados salvo lo dispuesto por la{" "}
            <strong style={{ color: "var(--text)", fontWeight: 500 }}>
              Ley Federal de Protección al Consumidor (LFPC)
            </strong>.
          </p>
        </Section>

        <Section title="10. Cancelación de cuenta">
          <p>
            Puedes cancelar tu cuenta en cualquier momento desde la configuración. Nos reservamos el derecho de
            suspender o cancelar cuentas que violen estos Términos, previa notificación cuando sea razonablemente
            posible. Ante cancelación, tus datos serán eliminados conforme a nuestro{" "}
            <Link href="/privacidad" style={{ color: "var(--accent2)", textDecoration: "none" }}>
              Aviso de Privacidad
            </Link>.
          </p>
        </Section>

        <Section title="11. Modificaciones a los términos">
          <p>
            Podemos actualizar estos Términos para reflejar cambios en el servicio o en la legislación aplicable.
            Si los cambios son sustanciales, te notificaremos con al menos 10 días de anticipación. El uso continuado
            del servicio tras la notificación implica la aceptación de los nuevos Términos.
          </p>
        </Section>

        <Section title="12. Ley aplicable y jurisdicción">
          <p>
            Estos Términos se rigen por las leyes de los{" "}
            <strong style={{ color: "var(--text)", fontWeight: 500 }}>Estados Unidos Mexicanos</strong>, incluyendo
            el Código Civil Federal, la Ley Federal de Protección al Consumidor y demás legislación aplicable.
            Para cualquier controversia derivada del uso del servicio, las partes se someten expresamente a la
            jurisdicción de los tribunales competentes de la Ciudad de México, renunciando a cualquier otro fuero
            que pudiera corresponderles.
          </p>
        </Section>

        <Section title="13. Contacto">
          <p>
            Para dudas sobre estos Términos de Uso, escríbenos a{" "}
            <a href="mailto:legal@useneto.com.mx" style={{ color: "var(--accent2)", textDecoration: "none" }}>
              legal@useneto.com.mx
            </a>.
          </p>
        </Section>

        <div style={{ borderTop: "1px solid var(--border)", paddingTop: 32, marginTop: 8 }}>
          <Link href="/" style={{
            display: "inline-flex", alignItems: "center", gap: 8,
            color: "var(--text3)", textDecoration: "none", fontSize: 14,
          }}>
            ← Volver al inicio
          </Link>
        </div>
      </main>

      {/* Footer */}
      <footer style={{
        borderTop: "1px solid var(--border)",
        padding: "24px 32px",
        display: "flex", alignItems: "center", justifyContent: "space-between",
        flexWrap: "wrap", gap: 12,
      }}>
        <span style={{ fontSize: 13, color: "var(--text3)" }}>
          © 2026 Neto · Todos los derechos reservados
        </span>
        <div style={{ display: "flex", gap: 20 }}>
          <Link href="/privacidad" style={{ fontSize: 13, color: "var(--text3)", textDecoration: "none" }}>Privacidad</Link>
          <Link href="/terminos" style={{ fontSize: 13, color: "var(--text3)", textDecoration: "none" }}>Términos</Link>
        </div>
      </footer>
    </div>
  );
}
