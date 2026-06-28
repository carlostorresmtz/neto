"use client";

import { useCallback, useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import type { CuentasData } from "@/lib/cuentas";

interface GmailMessage { from: string; subject: string; date: string; snippet?: string; }

export type CuentasLoadState = "loading" | "done" | "error";

/**
 * Carga el estado de cuenta: lee los correos reales de Gmail (si hay sesión) y
 * los manda al endpoint que los estructura. Si no hay Gmail / llave / la API
 * falla, el endpoint responde demo. `isDemo` refleja el origen real de la
 * respuesta (`origen`), no solo si había sesión.
 */
export function useCuentasData() {
  const { data: session } = useSession();
  const [state, setState] = useState<CuentasLoadState>("loading");
  const [data, setData] = useState<CuentasData | null>(null);
  const [isDemo, setIsDemo] = useState(false);

  const load = useCallback(async () => {
    setState("loading");

    let gmailMessages: GmailMessage[] | null = null;
    if (session?.accessToken) {
      try {
        const r = await fetch("/api/gmail/messages");
        if (r.ok) {
          const d = await r.json();
          if (d?.messages?.length) gmailMessages = d.messages;
        }
      } catch {}
    }

    try {
      const r = await fetch("/api/cuentas/data", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(gmailMessages ? { gmailContext: gmailMessages } : {}),
      });
      if (!r.ok) throw new Error();
      const d: CuentasData = await r.json();
      setData(d);
      setIsDemo(d.origen === "demo");
      setState("done");
    } catch {
      setState("error");
    }
  }, [session?.accessToken]);

  useEffect(() => { load(); }, [load]);

  return { state, data, isDemo, reload: load };
}
