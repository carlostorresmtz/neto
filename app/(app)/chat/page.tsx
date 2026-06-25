"use client";

import { useChat } from "ai/react";
import { useRef, useEffect, useState } from "react";
import { useSession, signIn } from "next-auth/react";
import Link from "next/link";
import type { GmailMessage } from "@/app/api/gmail/messages/route";

// ── KPI stats data ──
const STATS = [
  { val: "$42,380", label: "Saldo total",       color: "var(--accent)"  },
  { val: "$18,640", label: "Deuda tarjetas",     color: "var(--danger)"  },
  { val: "$23,450", label: "Gastado este mes",   color: "var(--text)"    },
  { val: "$1,094",  label: "Suscripciones/mes",  color: "var(--text)"    },
];

// ── Suggestion cards for empty state ──
const S = { fill: "none", stroke: "var(--accent)", strokeWidth: 1.5, strokeLinecap: "round" as const, strokeLinejoin: "round" as const };
const SUGGESTION_CARDS = [
  {
    icon: <svg width="24" height="24" viewBox="0 0 24 24" {...S}><path d="M18 20V10M12 20V4M6 20v-6"/></svg>,
    title: "Gastos por categoría",
    subtitle: "¿En qué gasté más en mayo?",
    q: "¿En qué categoría gasté más este mes?",
  },
  {
    icon: <svg width="24" height="24" viewBox="0 0 24 24" {...S}><rect x="1" y="4" width="22" height="16" rx="2"/><line x1="1" y1="10" x2="23" y2="10"/></svg>,
    title: "Análisis de deuda",
    subtitle: "Intereses y cómo liquidar",
    q: "¿Cuánto pago de intereses al año?",
  },
  {
    icon: <svg width="24" height="24" viewBox="0 0 24 24" {...S}><polyline points="23 4 23 10 17 10"/><polyline points="1 20 1 14 7 14"/><path d="M3.51 9a9 9 0 0 1 14.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0 0 20.49 15"/></svg>,
    title: "Mis suscripciones",
    subtitle: "¿Cuáles puedo cancelar?",
    q: "¿Cuáles son mis suscripciones?",
  },
  {
    icon: <svg width="24" height="24" viewBox="0 0 24 24" {...S}><circle cx="12" cy="12" r="10"/><circle cx="12" cy="12" r="6"/><circle cx="12" cy="12" r="2"/></svg>,
    title: "Vs presupuesto",
    subtitle: "¿Cómo voy este mes?",
    q: "¿Cómo voy vs mi presupuesto?",
  },
];

function now() {
  return new Date().toLocaleTimeString("es-MX", { hour: "2-digit", minute: "2-digit" });
}

const BANNER_DANGER: React.CSSProperties = {
  display: "flex", alignItems: "center", gap: 8,
  padding: "8px 16px",
  background: "rgba(220,38,38,0.06)", borderBottom: "1px solid rgba(220,38,38,0.15)",
  fontSize: 11, color: "var(--danger)", flexShrink: 0,
};

const WarnIcon = () => (
  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" style={{ flexShrink: 0 }}>
    <circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/>
  </svg>
);

function GmailErrorBanner({ errorCode }: { errorCode: string }) {
  const reconnectBtn = (
    <button
      onClick={() => signIn("google", { callbackUrl: "/chat" })}
      style={{
        marginLeft: 6, padding: "1px 8px", fontSize: 11, fontWeight: 500,
        background: "var(--danger)", color: "#fff", border: "none",
        borderRadius: 4, cursor: "pointer", fontFamily: "inherit",
      }}
    >
      Reconectar
    </button>
  );

  if (errorCode === "scope_missing") {
    return (
      <div style={BANNER_DANGER}>
        <WarnIcon />
        Tu sesión no tiene permiso para leer correos. Reconecta tu Gmail para dar acceso.
        {reconnectBtn}
      </div>
    );
  }
  if (errorCode === "token_expired" || errorCode === "no_token") {
    return (
      <div style={BANNER_DANGER}>
        <WarnIcon />
        Sesión expirada — vuelve a conectar tu Gmail.
        {reconnectBtn}
      </div>
    );
  }
  if (errorCode === "api_disabled") {
    return (
      <div style={BANNER_DANGER}>
        <WarnIcon />
        Gmail API no habilitada en Google Cloud Console. Actívala en el proyecto de OAuth.
      </div>
    );
  }
  // generic fallback
  return (
    <div style={BANNER_DANGER}>
      <WarnIcon />
      No se pudo acceder a Gmail ({errorCode}). Intenta reconectar.
      {reconnectBtn}
    </div>
  );
}

export default function ChatPage() {
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { data: session } = useSession();
  const [gmailMessages, setGmailMessages] = useState<GmailMessage[] | null>(null);
  const [gmailError, setGmailError] = useState<string | null>(null);

  // Keep a ref so the submit handler always has the latest gmailMessages value
  const gmailRef = useRef<typeof gmailMessages>(null);
  useEffect(() => { gmailRef.current = gmailMessages; }, [gmailMessages]);

  const { messages, input, handleInputChange, handleSubmit: _handleSubmit, isLoading, setInput } =
    useChat({ api: "/api/chat" });

  // Wrap submit to inject gmailContext from the latest ref value
  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    console.log('[chat] gmailMessages being sent:', gmailRef.current?.length, gmailRef.current?.[0]);
    _handleSubmit(e, {
      body: gmailRef.current && gmailRef.current.length > 0
        ? { gmailContext: gmailRef.current }
        : undefined,
    });
  }

  // Fetch Gmail messages when session with accessToken is available
  useEffect(() => {
    if (!session?.accessToken) return;
    fetch("/api/gmail/messages")
      .then(r => r.json())
      .then(data => {
        if (data.error) {
          setGmailError(data.error);
        } else {
          setGmailMessages(data.messages ?? []);
        }
      })
      .catch(() => setGmailError("Error al cargar correos"));
  }, [session?.accessToken]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isLoading]);

  function askQuestion(q: string) {
    setInput(q);
    setTimeout(() => {
      const form = document.getElementById("chat-form") as HTMLFormElement;
      form?.requestSubmit();
    }, 0);
  }

  return (
    <div style={{ display: "flex", flexDirection: "column", flex: 1, overflow: "hidden" }}>

      {/* ── Stats Bar ── */}
      <div className="stats-bar">
        {STATS.map(s => (
          <div key={s.label} className="stat-block">
            <div style={{ fontSize: 16, fontWeight: 500, color: s.color, marginBottom: 3, letterSpacing: "-0.01em" }}>
              {s.val}
            </div>
            <div style={{ fontSize: 10, color: "var(--text3)", letterSpacing: "0.01em" }}>{s.label}</div>
          </div>
        ))}
      </div>

      {/* ── Connection Banner ── */}
      {gmailMessages !== null ? (
        <div style={{
          display: "flex", alignItems: "center", gap: 8,
          padding: "8px 16px",
          background: "rgba(30,64,175,0.06)", borderBottom: "1px solid rgba(30,64,175,0.15)",
          fontSize: 11, color: "var(--accent2)", flexShrink: 0,
        }}>
          <span style={{ width: 6, height: 6, borderRadius: "50%", background: "var(--accent)", display: "block", flexShrink: 0 }} />
          Gmail conectado — {gmailMessages.length} correos bancarios encontrados
        </div>
      ) : gmailError ? (
        <GmailErrorBanner errorCode={gmailError} />
      ) : (
        <div style={{
          display: "flex", alignItems: "center", gap: 8,
          padding: "8px 16px",
          background: "var(--bg3)", borderBottom: "1px solid var(--border)",
          fontSize: 11, color: "var(--text3)", flexShrink: 0,
        }}>
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/>
          </svg>
          Datos de ejemplo —{" "}
          <Link href="/conexiones" style={{ color: "var(--accent2)", textDecoration: "none" }}>
            conecta Gmail para ver los tuyos
          </Link>
        </div>
      )}

      {/* ── Messages / Empty state ── */}
      <div style={{ flex: 1, overflow: "hidden", display: "flex", flexDirection: "column" }}>
        {messages.length === 0 ? (
          /* ── Empty state centered ── */
          <div className="dot-grid" style={{
            flex: 1, overflowY: "auto",
            display: "flex", flexDirection: "column",
            alignItems: "center", justifyContent: "center",
            padding: "40px 24px", textAlign: "center",
            backgroundColor: "var(--bg)",
          }}>
            {/* Logo */}
            <div style={{
              width: 48, height: 48,
              background: "var(--accent)",
              borderRadius: 14,
              display: "flex", alignItems: "center", justifyContent: "center",
              marginBottom: 20,
              boxShadow: "0 0 32px rgba(30,64,175,0.12)",
            }}>
              <svg width="22" height="22" viewBox="0 0 16 16" fill="none" stroke="#FFFFFF" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="1,11 4,6 7,9 11,3 15,5"/>
              </svg>
            </div>

            <h2 style={{ fontSize: 24, fontWeight: 400, color: "var(--text)", marginBottom: 8, letterSpacing: "-0.02em" }}>
              ¿En qué te ayudo hoy?
            </h2>
            <p style={{ fontSize: 13, color: "var(--text2)", marginBottom: 32, maxWidth: 360, lineHeight: 1.7 }}>
              {gmailMessages !== null
                ? `Tengo acceso a ${gmailMessages.length} correos bancarios reales. Pregúntame lo que necesites.`
                : "Tengo acceso a datos de ejemplo. Conecta Gmail para usar tus movimientos reales."}
            </p>

            {/* Suggestion cards 2×2 */}
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, width: "100%", maxWidth: 460 }}>
              {SUGGESTION_CARDS.map((c, i) => (
                <button
                  key={c.q}
                  onClick={() => askQuestion(c.q)}
                  style={{
                    background: "#F8FAFC",
                    border: "1px solid #E2E8F0",
                    borderRadius: 10,
                    padding: "20px",
                    textAlign: "left",
                    cursor: "pointer",
                    transition: "border-color 0.2s, background 0.2s",
                    fontFamily: "inherit",
                    animation: `cardFadeUp 0.4s ease ${i * 0.07}s both`,
                  }}
                  onMouseEnter={e => {
                    e.currentTarget.style.borderColor = "#1E40AF";
                    e.currentTarget.style.background   = "#EFF6FF";
                  }}
                  onMouseLeave={e => {
                    e.currentTarget.style.borderColor = "#E2E8F0";
                    e.currentTarget.style.background   = "#F8FAFC";
                  }}
                >
                  <div style={{ marginBottom: 12, lineHeight: 1 }}>{c.icon}</div>
                  <div style={{ fontSize: 14, fontWeight: 500, color: "var(--text)", marginBottom: 4 }}>{c.title}</div>
                  <div style={{ fontSize: 12, color: "var(--text3)", lineHeight: 1.5 }}>{c.subtitle}</div>
                </button>
              ))}
            </div>
          </div>
        ) : (
          /* ── Message list ── */
          <div className="messages">
            {messages.map(m => (
              <div key={m.id} className={`msg ${m.role === "user" ? "user" : ""}`}>
                <div className={`msg-avatar ${m.role === "user" ? "user" : "ai"}`}>
                  {m.role === "user" ? "CT" : "N"}
                </div>
                <div className="msg-content">
                  <div className={`bubble ${m.role === "user" ? "user" : "ai"}`}>
                    {m.role === "assistant" && (
                      <div className="source-tag">
                        <span className="stdot" style={{ background: gmailMessages !== null ? "#16A34A" : "#94A3B8" }} />
                        {gmailMessages !== null ? `Gmail · ${gmailMessages.length} correos` : "Datos de ejemplo"}
                      </div>
                    )}
                    <p style={{ whiteSpace: "pre-wrap" }}>{m.content}</p>
                  </div>
                  <div className="msg-time">{now()}</div>
                </div>
              </div>
            ))}

            {isLoading && (
              <div className="msg">
                <div className="msg-avatar ai">N</div>
                <div className="msg-content">
                  <div className="bubble ai">
                    <div className="typing"><span /><span /><span /></div>
                  </div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>
        )}
      </div>

      {/* ── Input ── */}
      <div className="input-area">
        <form id="chat-form" onSubmit={handleSubmit}>
          <div className="input-box">
            <input
              value={input}
              onChange={handleInputChange}
              placeholder="Pregúntale a Neto sobre tus finanzas…"
              disabled={isLoading}
            />
            <button type="submit" className="send-btn" disabled={isLoading || !input.trim()}>
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#FFFFFF" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <line x1="22" y1="2" x2="11" y2="13"/><polygon points="22 2 15 22 11 13 2 9 22 2"/>
              </svg>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
