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

export async function POST(req: Request) {
  const session = await auth();
  const limited = agentRateLimit(session?.user?.email ?? "anon", "alertas");
  if (limited) return limited;

  const body = await req.json().catch(() => ({}));
  const { gmailContext } = body as { gmailContext?: GmailMessage[] };

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

  const { text } = await generateText({
    model: anthropic("claude-sonnet-4-6"),
    system: SYSTEM_PROMPT,
    messages: [{ role: "user", content: dataContext }],
    maxTokens: 2000,
  });

  const parsed = extractJSON(text);
  if (!parsed) {
    return Response.json({ error: true, mensaje: "No se pudo analizar la respuesta", alertas: [], resumen: "Error temporal. Intenta de nuevo." });
  }
  return Response.json(parsed);
}
