import { anthropic } from "@ai-sdk/anthropic";
import { generateText } from "ai";

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

Eres un analista financiero. Analiza los correos bancarios e infiere datos numéricos de gastos del usuario.

Responde con este JSON exacto:
{
  "gastosPorCategoria": [{ "categoria": "string", "monto": 0, "porcentaje": 0, "color": "string" }],
  "gastosPorMes": [{ "mes": "string", "total": 0 }],
  "totalMesActual": 0,
  "promedioMensual": 0,
  "variacionVsMesAnterior": 0,
  "tendencia": "subiendo",
  "topComercio": { "nombre": "string", "monto": 0, "visitas": 0 }
}

Reglas:
- "gastosPorCategoria": máximo 6 categorías. "color" debe ser un valor CSS hex como "#ef4444", "#f59e0b", "#3b82f6", "#10b981", "#8b5cf6", "#f97316"
- "gastosPorMes": últimos 3-5 meses que puedas inferir de los correos. "mes" = "May", "Abr", etc.
- "variacionVsMesAnterior": número, positivo si gasté más, negativo si menos
- "tendencia": "subiendo", "bajando" o "estable"
- Todos los montos en MXN (pesos mexicanos)`;

export async function POST(req: Request) {
  const body = await req.json().catch(() => ({}));
  const { gmailContext } = body as { gmailContext?: GmailMessage[] };

  let dataContext: string;

  if (gmailContext && Array.isArray(gmailContext) && gmailContext.length > 0) {
    const emails = gmailContext.slice(0, 30);
    const emailList = emails
      .map((m, i) => `${i + 1}. De: ${m.from}\n   Asunto: ${m.subject}\n   Fecha: ${m.date}\n   Detalle: ${(m.snippet ?? "").substring(0, 150)}`)
      .join("\n\n");
    dataContext = `Analiza estos ${emails.length} correos bancarios e infiere patrones de gasto del usuario:\n\n${emailList}`;
  } else {
    dataContext = "No hay correos disponibles. Genera datos financieros de ejemplo para un usuario mexicano típico con gastos en restaurantes, supermercado, gasolina y entretenimiento. Usa montos realistas en pesos mexicanos.";
  }

  const { text } = await generateText({
    model: anthropic("claude-sonnet-4-6"),
    system: SYSTEM_PROMPT,
    messages: [{ role: "user", content: dataContext }],
    maxTokens: 2000,
  });

  const parsed = extractJSON(text);
  if (!parsed) {
    return Response.json({
      error: true,
      gastosPorCategoria: [],
      gastosPorMes: [],
      totalMesActual: 0,
      promedioMensual: 0,
      variacionVsMesAnterior: 0,
      tendencia: "estable",
      topComercio: null,
    });
  }
  return Response.json(parsed);
}
