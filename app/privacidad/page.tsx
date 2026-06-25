import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Aviso de Privacidad — Neto",
  description: "Cómo Neto recopila, usa y protege tus datos personales conforme a la LFPDPPP.",
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

export default function PrivacidadPage() {
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
            Aviso de Privacidad
          </h1>
          <p style={{ fontSize: 16, color: "var(--text2)", lineHeight: 1.8, margin: 0, maxWidth: 580 }}>
            En Neto nos comprometemos a proteger tu información personal conforme a la{" "}
            <strong style={{ color: "var(--text)", fontWeight: 500 }}>
              Ley Federal de Protección de Datos Personales en Posesión de los Particulares (LFPDPPP)
            </strong>{" "}
            y su reglamento.
          </p>
        </div>

        <div style={{ borderTop: "1px solid var(--border)", marginBottom: 44 }} />

        <Section title="1. Responsable del tratamiento">
          <p>
            <strong style={{ color: "var(--text)", fontWeight: 500 }}>Neto</strong> es responsable del tratamiento de tus datos personales.
            Puedes contactarnos en cualquier momento a través del correo{" "}
            <a href="mailto:privacidad@useneto.com.mx" style={{ color: "var(--accent2)", textDecoration: "none" }}>
              privacidad@useneto.com.mx
            </a>.
          </p>
        </Section>

        <Section title="2. Datos personales que recabamos">
          <p style={{ marginBottom: 14 }}>Recabamos los siguientes datos personales:</p>
          <ul style={{ margin: 0, paddingLeft: 22, display: "flex", flexDirection: "column", gap: 8 }}>
            <li><strong style={{ color: "var(--text)", fontWeight: 500 }}>Correo electrónico</strong> — para identificarte y enviarte el servicio.</li>
            <li><strong style={{ color: "var(--text)", fontWeight: 500 }}>Contenido de correos bancarios</strong> — asunto, remitente, cuerpo del mensaje de notificaciones financieras que nos autorizas a leer.</li>
            <li><strong style={{ color: "var(--text)", fontWeight: 500 }}>Datos financieros derivados</strong> — montos, comercios, categorías, fechas — extraídos automáticamente de tus correos.</li>
            <li><strong style={{ color: "var(--text)", fontWeight: 500 }}>Datos de uso</strong> — preguntas realizadas al asistente, funciones utilizadas, fecha y hora de acceso.</li>
          </ul>
          <p style={{ marginTop: 14 }}>
            No recabamos contraseñas bancarias, números de tarjeta completos ni accedemos directamente a tu banca en línea.
            Neto es un servicio de <strong style={{ color: "var(--text)", fontWeight: 500 }}>solo lectura</strong>.
          </p>
        </Section>

        <Section title="3. Finalidades del tratamiento">
          <p style={{ marginBottom: 14 }}>Tus datos son utilizados para:</p>
          <ul style={{ margin: 0, paddingLeft: 22, display: "flex", flexDirection: "column", gap: 8 }}>
            <li>Proveer el servicio de análisis financiero personal.</li>
            <li>Generar resúmenes, categorías y visualizaciones de tus transacciones.</li>
            <li>Responder a tus consultas mediante el asistente conversacional.</li>
            <li>Enviarte alertas y notificaciones que hayas configurado.</li>
            <li>Mejorar la precisión y funcionalidad del servicio.</li>
          </ul>
          <p style={{ marginTop: 14 }}>
            <strong style={{ color: "var(--text)", fontWeight: 500 }}>Finalidades secundarias</strong> (puedes oponerte en cualquier momento):{" "}
            enviarte comunicaciones sobre nuevas funciones y actualizaciones del producto.
          </p>
        </Section>

        <Section title="4. Tus derechos ARCO">
          <p style={{ marginBottom: 14 }}>
            Tienes derecho a <strong style={{ color: "var(--text)", fontWeight: 500 }}>Acceder, Rectificar, Cancelar y Oponerte</strong> al
            tratamiento de tus datos personales (derechos ARCO). Para ejercerlos:
          </p>
          <ol style={{ margin: 0, paddingLeft: 22, display: "flex", flexDirection: "column", gap: 8 }}>
            <li>Envía un correo a <a href="mailto:privacidad@useneto.com.mx" style={{ color: "var(--accent2)", textDecoration: "none" }}>privacidad@useneto.com.mx</a> con el asunto "Ejercicio de Derechos ARCO".</li>
            <li>Indica tu nombre completo y correo registrado en Neto.</li>
            <li>Describe el derecho que deseas ejercer y los datos a los que se refiere.</li>
            <li>Adjunta una copia de tu identificación oficial.</li>
          </ol>
          <p style={{ marginTop: 14 }}>
            Responderemos tu solicitud en un plazo máximo de <strong style={{ color: "var(--text)", fontWeight: 500 }}>20 días hábiles</strong>{" "}
            contados desde su recepción.
          </p>
        </Section>

        <Section title="5. Transferencias de datos">
          <p>
            Neto no vende, arrienda ni transfiere tus datos personales a terceros con fines comerciales.
            Podemos compartir información con proveedores de tecnología estrictamente necesarios para operar el servicio
            (infraestructura de cómputo, procesamiento de lenguaje natural), bajo acuerdos de confidencialidad y únicamente
            para las finalidades descritas en este aviso.
          </p>
        </Section>

        <Section title="6. Seguridad">
          <p>
            Implementamos medidas técnicas, administrativas y físicas para proteger tus datos: cifrado en tránsito (TLS),
            cifrado en reposo, acceso restringido por rol y auditorías periódicas. Sin embargo, ningún sistema es
            completamente infalible; en caso de una brecha de seguridad que afecte tus derechos, te notificaremos
            conforme a lo previsto por la LFPDPPP.
          </p>
        </Section>

        <Section title="7. Conservación de datos">
          <p>
            Conservamos tus datos mientras mantengas una cuenta activa en Neto. Al cancelar tu cuenta puedes solicitar
            la eliminación de tu información; la realizaremos en un plazo máximo de 30 días, salvo que la ley nos
            obligue a conservarla por un período mayor.
          </p>
        </Section>

        <Section title="8. Cookies y tecnologías de rastreo">
          <p>
            Neto utiliza cookies propias estrictamente necesarias para mantener tu sesión activa y preferencias de usuario.
            No utilizamos cookies de seguimiento de terceros con fines publicitarios.
          </p>
        </Section>

        <Section title="9. Cambios a este aviso">
          <p>
            Podemos actualizar este Aviso de Privacidad cuando sea necesario. Si los cambios son sustanciales, te
            notificaremos por correo electrónico con al menos 10 días de anticipación. La versión vigente siempre
            estará disponible en{" "}
            <Link href="/privacidad" style={{ color: "var(--accent2)", textDecoration: "none" }}>
              useneto.com.mx/privacidad
            </Link>.
          </p>
        </Section>

        <Section title="10. Contacto">
          <p>
            Para cualquier duda sobre el tratamiento de tus datos personales, escríbenos a{" "}
            <a href="mailto:privacidad@useneto.com.mx" style={{ color: "var(--accent2)", textDecoration: "none" }}>
              privacidad@useneto.com.mx
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
