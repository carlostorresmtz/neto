import { anthropic } from "@ai-sdk/anthropic";
import { generateText } from "ai";
import { transactions, FINANCIAL_CONTEXT } from "@/lib/data";
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

Eres ComparadorAgent, un experto en tarjetas de crédito mexicanas. Analiza los patrones de gasto del usuario y determina qué tarjeta le conviene más.

Tarjetas disponibles en México 2025:
- BBVA Azul: 0.5% cashback general, sin anualidad
- Amex Gold México: 2% en restaurantes, 1% en otros, anualidad $2,499
- Nu Mastercard: hasta 3.5% cashback en categorías activas, sin anualidad
- Santander LikeU: 0.5% en todo, sin anualidad
- HSBC Zero: 0% anualidad, 2% en compras internacionales
- Banorte Más: 1% cashback general, anualidad $1,000

Responde con este JSON exacto:
{
  "gastoMensual": 0,
  "topCategorias": [{ "categoria": "string", "monto": 0 }],
  "tarjetaActual": "string",
  "recomendacion": { "tarjeta": "string", "cashbackPotencial": 0, "ahorroAnual": 0, "razon": "string" },
  "comparativa": [{ "tarjeta": "string", "cashbackMensual": 0, "color": "string" }],
  "resumen": "string"
}
"cashbackPotencial" es el cashback mensual en MXN. "comparativa" incluye las 4 mejores opciones ordenadas de mayor a menor.`;

export async function POST(req: Request) {
  const session = await auth();
  const limited = agentRateLimit(session?.user?.email ?? "anon", "comparador");
  if (limited) return limited;

  const body = await req.json().catch(() => ({}));
  const { gmailContext } = body as { gmailContext?: GmailMessage[] };

  let dataContext: string;

  if (gmailContext && Array.isArray(gmailContext) && gmailContext.length > 0) {
    const emails = gmailContext.slice(0, 30);
    const emailList = emails
      .map((m, i) => `${i + 1}. De: ${m.from}\n   Asunto: ${m.subject}\n   Fecha: ${m.date}\n   Detalle: ${(m.snippet ?? "").substring(0, 150)}`)
      .join("\n\n");
    dataContext = `Analiza estos ${emails.length} correos bancarios reales y determina qué tarjeta de crédito mexicana le conviene más al usuario:\n\n${emailList}`;
  } else {
    const mayo = transactions.mayo ?? [];
    const gastos = mayo.filter(t => t.amount < 0);
    dataContext = `${FINANCIAL_CONTEXT}\n\nTRANSACCIONES MAYO 2025:\n${gastos.map(t => `- ${t.date}: ${t.name} $${Math.abs(t.amount)} (${t.cat})`).join("\n")}`;
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
