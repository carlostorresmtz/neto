"use client";

import { useEffect, useState } from "react";

interface ToastProps {
  open: boolean;
  message: string;
  onClose: () => void;
  /** Milisegundos visible antes de desvanecerse. */
  duration?: number;
}

/**
 * Toast minimalista, esquina inferior derecha, en azul de marca.
 * Entra con slide-up y sale con fade-out. Se autocierra tras `duration`.
 *
 * Controlado por el padre vía `open`; al terminar la animación de salida
 * llama a `onClose` para que el padre lo retire del árbol.
 */
export default function Toast({ open, message, onClose, duration = 4000 }: ToastProps) {
  const [leaving, setLeaving] = useState(false);

  useEffect(() => {
    if (!open) {
      setLeaving(false);
      return;
    }
    setLeaving(false);
    const t = setTimeout(() => setLeaving(true), duration);
    return () => clearTimeout(t);
  }, [open, duration]);

  if (!open) return null;

  return (
    <>
      <style>{`
        @keyframes netoToastIn  { from { transform: translateY(20px); opacity: 0; } to { transform: translateY(0); opacity: 1; } }
        @keyframes netoToastOut { from { transform: translateY(0); opacity: 1; } to { transform: translateY(8px);  opacity: 0; } }
      `}</style>
      <div
        role="status"
        aria-live="polite"
        onAnimationEnd={() => { if (leaving) onClose(); }}
        style={{
          position: "fixed", right: 20, bottom: 20, zIndex: 1100,
          maxWidth: "calc(100vw - 40px)",
          display: "flex", alignItems: "center", gap: 10,
          background: "var(--accent)", color: "#FFFFFF",
          padding: "12px 16px", borderRadius: 10,
          boxShadow: "0 8px 24px rgba(30,64,175,0.30)",
          fontSize: 13, fontWeight: 500, lineHeight: 1.3,
          animation: `${leaving ? "netoToastOut" : "netoToastIn"} 280ms ease forwards`,
        }}
      >
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#FFFFFF" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0 }}>
          <polyline points="20 6 9 17 4 12" />
        </svg>
        <span>{message}</span>
      </div>
    </>
  );
}
