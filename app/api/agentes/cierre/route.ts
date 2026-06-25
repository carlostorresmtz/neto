import { anthropic } from "@ai-sdk/anthropic";
import { generateText } from "ai";
import { transactions, subscriptions, FINANCIAL_CONTEXT } from "@/lib/data";

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

Eres CierreAgent, un agente financiero que genera resúmenes mensuales claros y accionables.

Responde con este JSON exacto:
{
  "periodo": "Mayo 2025",
  "total_gastos": 0,
  "total_ingresos": 0,
  "ahorro_neto": 0,
  "top_categorias": [{ "nombre": "string", "monto": 0, "variacion": 0, "emoji": "string" }],
  "vs_mes_anterior": { "gastos_anterior": 0, "diferencia": 0, "porcentaje": 0 },
  "suscripciones": { "total_mensual": 0, "total_anual": 0, "cantidad": 0 },
  "destacado": "string",
  "recomendacion": "string",
  "resumen": "string"
}
"variacion" es el % de cambio vs mes anterior (positivo = aumentó). "destacado" es el dato más relevante en 1 oración. "recomendacion" es una acción específica en 1 oración.`;

export async function POST(req: Request) {
  const body = await req.json().catch(() => ({}));
  const { gmailContext } = body as { gmailContext?: GmailMessage[] };

  let dataContext: string;

  if (gmailContext && Array.isArray(gmailContext) && gmailContext.length > 0) {
    const emails = gmailContext.slice(0, 30);
    const emailList = emails
      .map((m, i) => `${i + 1}. De: ${m.from}\n   Asunto: ${m.subject}\n   Fecha: ${m.date}\n   Detalle: ${(m.snippet ?? "").substring(0, 150)}`)
      .join("\n\n");
    dataContext = `Genera un resumen mensual de cierre basado en estos ${emails.length} correos bancarios reales. Infiere gastos, ingresos y categorías:\n\n${emailList}`;
  } else {
    const mayo = transactions.mayo ?? [];
    const abril = transactions.abril ?? [];
    dataContext = `${FINANCIAL_CONTEXT}\n\nTRANSACCIONES MAYO 2025:\n${mayo.map(t => `${t.date}: ${t.name} ${t.amount > 0 ? "+" : ""}$${t.amount} (${t.cat})`).join("\n")}\n\nTRANSACCIONES ABRIL 2025:\n${abril.map(t => `${t.date}: ${t.name} ${t.amount > 0 ? "+" : ""}$${t.amount} (${t.cat})`).join("\n")}\n\nSUSCRIPCIONES:\n${subscriptions.map(s => `${s.name}: $${s.amount}/mes`).join("\n")}`;
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
