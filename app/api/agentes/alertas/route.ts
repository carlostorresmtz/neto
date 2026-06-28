import { anthropic } from "@ai-sdk/anthropic";
import { generateText } from "ai";
import { transactions, subscriptions, FINANCIAL_CONTEXT } from "@/lib/data";
import { auth } from "@/auth";
import { agentRateLimit } from "@/lib/rateLimit";

interface GmailMessage {
  from: string; subject: string; date: string; snippet?: string;
}

function extractJSON(text: string): Record<string, unknown> | null {
  try { return JSON.parse(text) as Record<string, unknown>; } catch {}
  const fence = text.match(/```(?:json)?\s*\n?([\s\S]*?)\n?```/);
  if (fence) { try { return JSON.parse(fence[1].trim()) as Record<string, unknown>; } catch {} }
  const obj = text.match(/\{[\s\S]*\}/);
  if (obj) { try { return JSON.parse(obj[0]) as Record<string, unknown>; } catch {} }
  const first = text.indexOf("{"); const last = text.lastIndexOf("}");
  if (first !== -1 && last > first) { try { return JSON.parse(text.substring(first, last + 1)) as Record<string, unknown>; } catch {} }
  return null;
}

const SYSTEM_PROMPT = `IMPORTANTE: Responde ÚNICAMENTE con un objeto JSON válido. Sin texto adicional, sin markdown, sin explicaciones. Solo el JSON.

Eres AlertasAgent, un agente financiero especializado en detectar situaciones que requieren atención inmediata. Analiza los datos del usuario y genera alertas en estas categorías: URGENTE (vencimientos próximos, deuda alta, cargos no reconocidos), IMPORTANTE (suscripciones por renovar, gastos inusuales, límite de crédito cercano), INFORMATIVO (resumen semanal, comparativa de gastos, logros de ahorro).

Responde con este JSON exacto:
{ "alertas": [{ "tipo": "URGENTE", "titulo": "string", "mensaje": "string (máximo 2 oraciones)", "accion": "string o null", "monto": 0, "fecha": "string o null" }], "resumen": "string" }

Máximo 6 alertas ordenadas por urgencia. tipo debe ser exactamente "URGENTE", "IMPORTANTE" o "INFORMATIVO".`;

/**
 * Alertas de ejemplo. Se devuelven cuando no hay ANTHROPIC_API_KEY (p. ej. en
 * desarrollo local) o si la llamada al modelo falla, para que la app corra sin
 * llaves en vez de responder 500 — misma filosofía que lib/stripe.ts.
 */
const DEMO_ALERTAS = {
  resumen: "Detecté 4 situaciones que requieren tu atención esta semana.",
  alertas: [
    { tipo: "URGENTE", titulo: "Pago de tarjeta Nu próximo", mensaje: "Tu pago para no generar intereses vence en 3 días. Debes al menos $1,850.", accion: "Programa el pago hoy", monto: 1850, fecha: "Vence 30 jun" },
    { tipo: "IMPORTANTE", titulo: "Suscripciones por renovar", mensaje: "HBO Max y Spotify se renuevan esta semana por $448 en total.", accion: "Revisa si las sigues usando", monto: 448, fecha: "1-3 jul" },
    { tipo: "IMPORTANTE", titulo: "Gasto inusual en restaurantes", mensaje: "Llevas $6,800 en restaurantes este mes, 38% más que tu promedio.", accion: null, monto: 6800, fecha: null },
    { tipo: "INFORMATIVO", titulo: "Vas bien en supermercado", mensaje: "Gastaste 12% menos que el mes pasado en súper. ¡Sigue así!", accion: null, monto: 5200, fecha: null },
  ],
};

export async function POST(req: Request) {
  const session = await auth();
  const limited = agentRateLimit(session?.user?.email ?? "anon", "alertas");
  if (limited) return limited;

  const body = await req.json().catch(() => ({}));
  const { gmailContext } = body as { gmailContext?: GmailMessage[] };

  // Sin llave de Anthropic no podemos llamar al modelo: devolvemos demo en vez
  // de tronar con 500 (esto desbloquea el desarrollo local).
  if (!process.env.ANTHROPIC_API_KEY) {
    return Response.json(DEMO_ALERTAS);
  }

  let dataContext: string;

  if (gmailContext && Array.isArray(gmailContext) && gmailContext.length > 0) {
    const emails = gmailContext.slice(0, 30);
    const emailList = emails
      .map((m, i) => `${i + 1}. De: ${m.from}\n   Asunto: ${m.subject}\n   Fecha: ${m.date}\n   Detalle: ${(m.snippet ?? "").substring(0, 150)}`)
      .join("\n\n");
    dataContext = `Analiza estos ${emails.length} correos bancarios reales del usuario y genera alertas financieras prioritarias:\n\n${emailList}`;
  } else {
    const mayo = transactions.mayo ?? [];
    const gastos = mayo.filter(t => t.amount < 0);
    const subs = subscriptions.map(s => `${s.name}: $${s.amount}/mes`).join("\n");
    dataContext = `${FINANCIAL_CONTEXT}\n\nTRANSACCIONES MAYO 2025 (${gastos.length} gastos):\n${gastos.map(t => `- ${t.date}: ${t.name} -$${Math.abs(t.amount)} (${t.cat})`).join("\n")}\n\nSUSCRIPCIONES:\n${subs}`;
  }

  try {
    const { text } = await generateText({
      model: anthropic("claude-sonnet-4-6"),
      system: SYSTEM_PROMPT,
      messages: [{ role: "user", content: dataContext }],
      maxTokens: 2000,
    });

    const parsed = extractJSON(text);
    // Si el modelo no devolvió JSON parseable, caemos a alertas de ejemplo.
    return Response.json(parsed ?? DEMO_ALERTAS);
  } catch (e) {
    console.error("agentes/alertas error:", e);
    return Response.json(DEMO_ALERTAS);
  }
}
