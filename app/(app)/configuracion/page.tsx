"use client";

import { useEffect, useState } from "react";
import { useSession, signIn, signOut } from "next-auth/react";
import Link from "next/link";
import GoogleIcon from "@/components/ui/GoogleIcon";

/* ── Card de sección ── */
function Section({ title, desc, children }: { title: string; desc?: string; children: React.ReactNode }) {
  return (
    <div style={{
      background: "var(--card)", border: "1px solid var(--border)",
      borderRadius: 14, padding: "20px 22px",
    }}>
      <div style={{ fontSize: 15, fontWeight: 600, color: "var(--text)", marginBottom: desc ? 2 : 14 }}>
        {title}
      </div>
      {desc && <div style={{ fontSize: 12, color: "var(--text3)", marginBottom: 16 }}>{desc}</div>}
      {children}
    </div>
  );
}

function Row({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div style={{
      display: "flex", alignItems: "center", justifyContent: "space-between",
      gap: 16, padding: "10px 0", borderTop: "1px solid var(--border)",
    }}>
      <span style={{ fontSize: 13, color: "var(--text2)" }}>{label}</span>
      {children}
    </div>
  );
}

export default function ConfiguracionPage() {
  const { data: session, status } = useSession();
  const connected = status === "authenticated" && !!session?.user;

  const [theme, setTheme] = useState<"dark" | "light">("light");
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  // Mantiene el toggle en sync con la misma lógica de AppShell.
  useEffect(() => {
    const saved = localStorage.getItem("neto-theme");
    setTheme(saved === "dark" ? "dark" : "light");
  }, []);

  function toggleTheme() {
    setTheme(prev => {
      const next = prev === "dark" ? "light" : "dark";
      localStorage.setItem("neto-theme", next);
      document.documentElement.classList.toggle("dark", next === "dark");
      return next;
    });
  }

  return (
    <div className="page">
      <div style={{ fontFamily: "var(--font-geist-sans), sans-serif", fontSize: 21, marginBottom: 3 }}>
        Configuración
      </div>
      <div style={{ fontSize: 12, color: "var(--text2)", marginBottom: 20 }}>
        Gestiona tu cuenta, conexiones y preferencias.
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: 14, maxWidth: 640 }}>

        {/* ── PERFIL ── */}
        <Section title="Perfil">
          <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
            <div style={{
              width: 52, height: 52, borderRadius: "50%", overflow: "hidden", flexShrink: 0,
              background: "var(--bg3)", border: "1px solid var(--border2)",
              display: "flex", alignItems: "center", justifyContent: "center",
              fontSize: 16, color: "var(--text2)", fontWeight: 500,
            }}>
              {connected && session.user?.image ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={session.user.image} alt="" width={52} height={52} style={{ objectFit: "cover" }} />
              ) : (
                connected && session.user?.name
                  ? session.user.name.split(" ").map(w => w[0]).slice(0, 2).join("").toUpperCase()
                  : "?"
              )}
            </div>
            <div style={{ minWidth: 0 }}>
              <div style={{ fontSize: 15, fontWeight: 500, color: "var(--text)" }}>
                {connected ? (session.user?.name ?? "Usuario") : "Invitado"}
              </div>
              <div style={{ fontSize: 13, color: "var(--text3)", overflow: "hidden", textOverflow: "ellipsis" }}>
                {connected ? session.user?.email : "No has iniciado sesión"}
              </div>
            </div>
          </div>
        </Section>

        {/* ── CUENTAS CONECTADAS ── */}
        <Section title="Cuentas conectadas" desc="Fuentes de datos que Neto puede leer (solo lectura).">
          <div style={{
            display: "flex", alignItems: "center", justifyContent: "space-between",
            gap: 12, flexWrap: "wrap",
          }}>
            <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
              <div className="conn-service-icon gmail" style={{ width: 36, height: 36, fontSize: 16 }}>✉</div>
              <div>
                <div style={{ fontSize: 14, fontWeight: 500, color: "var(--text)" }}>Gmail</div>
                {connected ? (
                  <span style={{
                    display: "inline-flex", alignItems: "center", gap: 5,
                    fontSize: 11, color: "#16a34a", marginTop: 1,
                  }}>
                    <span style={{ width: 6, height: 6, borderRadius: "50%", background: "#16a34a" }} />
                    Conectado
                  </span>
                ) : (
                  <div style={{ fontSize: 12, color: "var(--text3)" }}>No conectado</div>
                )}
              </div>
            </div>
            {connected ? (
              <button
                onClick={() => signOut({ callbackUrl: "/configuracion" })}
                style={{
                  fontSize: 13, fontWeight: 500, padding: "7px 14px", borderRadius: 8,
                  border: "1px solid rgba(220,38,38,0.4)", background: "transparent",
                  color: "var(--danger)", cursor: "pointer", fontFamily: "inherit",
                }}
              >
                Desconectar
              </button>
            ) : (
              <button className="btn-google" onClick={() => signIn("google", { callbackUrl: "/configuracion" })}>
                <GoogleIcon />
                Conectar Gmail
              </button>
            )}
          </div>
        </Section>

        {/* ── PLAN ── */}
        <Section title="Plan">
          <div style={{
            display: "flex", alignItems: "center", justifyContent: "space-between",
            gap: 12, flexWrap: "wrap",
          }}>
            <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
              <span style={{
                fontSize: 11, fontWeight: 700, letterSpacing: "0.06em", textTransform: "uppercase",
                color: "var(--text2)", background: "var(--bg3)", border: "1px solid var(--border)",
                borderRadius: 6, padding: "3px 10px",
              }}>
                Free
              </span>
              <span style={{ fontSize: 13, color: "var(--text3)" }}>
                20 mensajes/hora · agentes limitados
              </span>
            </div>
            <Link href="/#precios" style={{ textDecoration: "none" }}>
              <button className="land-btn-primary" style={{ padding: "8px 16px", fontSize: 13 }}>
                Ver planes Pro / Business
              </button>
            </Link>
          </div>
        </Section>

        {/* ── PREFERENCIAS ── */}
        <Section title="Preferencias">
          <Row label="Tema">
            <button
              onClick={toggleTheme}
              style={{
                display: "inline-flex", alignItems: "center", gap: 7,
                fontSize: 13, padding: "6px 12px", borderRadius: 8,
                border: "1px solid var(--border)", background: "var(--bg3)",
                color: "var(--text2)", cursor: "pointer", fontFamily: "inherit",
              }}
            >
              {theme === "dark" ? (
                <>
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <circle cx="12" cy="12" r="5" /><line x1="12" y1="1" x2="12" y2="3" /><line x1="12" y1="21" x2="12" y2="23" />
                    <line x1="4.22" y1="4.22" x2="5.64" y2="5.64" /><line x1="18.36" y1="18.36" x2="19.78" y2="19.78" />
                    <line x1="1" y1="12" x2="3" y2="12" /><line x1="21" y1="12" x2="23" y2="12" />
                    <line x1="4.22" y1="19.78" x2="5.64" y2="18.36" /><line x1="18.36" y1="5.64" x2="19.78" y2="4.22" />
                  </svg>
                  Oscuro
                </>
              ) : (
                <>
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
                  </svg>
                  Claro
                </>
              )}
            </button>
          </Row>
          <Row label="Idioma">
            <span style={{ fontSize: 13, color: "var(--text3)" }}>Español 🇲🇽</span>
          </Row>
        </Section>

        {/* ── PRIVACIDAD ── */}
        <Section title="Privacidad">
          <div style={{ display: "flex", flexDirection: "column" }}>
            <Row label="Política de privacidad">
              <Link href="/privacidad" style={{ fontSize: 13, color: "var(--accent2)", textDecoration: "none" }}>
                Ver →
              </Link>
            </Row>
            <Row label="Términos de uso">
              <Link href="/terminos" style={{ fontSize: 13, color: "var(--accent2)", textDecoration: "none" }}>
                Ver →
              </Link>
            </Row>
            <Row label="Eliminar mi cuenta">
              <button
                onClick={() => setShowDeleteModal(true)}
                style={{
                  fontSize: 13, fontWeight: 500, padding: "6px 12px", borderRadius: 8,
                  border: "1px solid rgba(220,38,38,0.4)", background: "transparent",
                  color: "var(--danger)", cursor: "pointer", fontFamily: "inherit",
                }}
              >
                Eliminar
              </button>
            </Row>
          </div>
        </Section>
      </div>

      {/* ── Modal de confirmación de eliminación ── */}
      {showDeleteModal && (
        <div
          onClick={() => setShowDeleteModal(false)}
          style={{
            position: "fixed", inset: 0, zIndex: 100,
            background: "rgba(0,0,0,0.6)", backdropFilter: "blur(4px)",
            display: "flex", alignItems: "center", justifyContent: "center", padding: 20,
          }}
        >
          <div
            onClick={e => e.stopPropagation()}
            style={{
              background: "var(--card)", border: "1px solid var(--border)", borderRadius: 16,
              padding: "26px 24px", maxWidth: 420, width: "100%",
              boxShadow: "0 8px 40px rgba(0,0,0,0.25)",
            }}
          >
            <div style={{
              width: 44, height: 44, borderRadius: "50%", marginBottom: 16,
              background: "rgba(220,38,38,0.1)", border: "1px solid rgba(220,38,38,0.25)",
              display: "flex", alignItems: "center", justifyContent: "center",
            }}>
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="var(--danger)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" />
                <line x1="12" y1="9" x2="12" y2="13" /><line x1="12" y1="17" x2="12.01" y2="17" />
              </svg>
            </div>
            <h2 style={{ fontSize: 18, fontWeight: 600, color: "var(--text)", margin: "0 0 8px" }}>
              ¿Eliminar tu cuenta?
            </h2>
            <p style={{ fontSize: 13, color: "var(--text2)", lineHeight: 1.6, margin: "0 0 20px" }}>
              Esta acción es permanente. Se borrará tu sesión y se revocará el acceso a Gmail.
              Esta función aún no está disponible — pronto podrás eliminar tu cuenta desde aquí.
            </p>
            {/* TODO: implementar eliminación real de cuenta (revocar tokens OAuth,
                borrar datos del usuario y cerrar sesión) cuando exista backend de usuarios. */}
            <div style={{ display: "flex", gap: 10, justifyContent: "flex-end" }}>
              <button
                onClick={() => setShowDeleteModal(false)}
                style={{
                  fontSize: 13, fontWeight: 500, padding: "8px 16px", borderRadius: 8,
                  border: "1px solid var(--border)", background: "var(--bg3)",
                  color: "var(--text2)", cursor: "pointer", fontFamily: "inherit",
                }}
              >
                Cancelar
              </button>
              <button
                disabled
                style={{
                  fontSize: 13, fontWeight: 500, padding: "8px 16px", borderRadius: 8,
                  border: "none", background: "var(--danger)", color: "#fff",
                  cursor: "not-allowed", opacity: 0.5, fontFamily: "inherit",
                }}
              >
                Eliminar cuenta
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
