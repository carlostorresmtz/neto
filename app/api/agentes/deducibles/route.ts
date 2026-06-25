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

Eres DeduciblesAgent, un experto en deducciones fiscales del ISR para personas físicas en México. Analiza los gastos e identifica cuáles son deducibles según la Ley del ISR 2025.

Gastos deducibles para personas físicas en México:
- Honorarios médicos, dentales, hospitalarios y de nutriólogos (con CFDI)
- Primas de seguros de gastos médicos
- Intereses reales de créditos hipotecarios (casa habitación)
- Donativos a instituciones autorizadas
- Aportaciones complementarias al SAR/AFORE
- Colegiaturas (hasta $24,500/hijo) y transporte escolar obligatorio

NO son deducibles: restaurantes, gasolina, supermercado, ropa, entretenimiento, streaming.

Responde con este JSON exacto:
{
  "totalDeducible": 0,
  "gastosDeducibles": [{ "fecha": "string", "monto": 0, "comercio": "string", "categoria": "string", "esDeducible": true, "requiereFactura": true, "nota": "string" }],
  "isrEstimado": 0,
  "recomendaciones": ["string"],
  "resumen": "string"
}
"isrEstimado" es el ahorro fiscal estimado (tasa marginal ISR 30%). Solo incluye gastos relevantes.`;

export async function POST(req: Request) {
  const session = await auth();
  const limited = agentRateLimit(session?.user?.email ?? "anon", "deducibles");
  if (limited) return limited;

  const body = await req.json().catch(() => ({}));
  const { gmailContext } = body as { gmailContext?: GmailMessage[] };

  let dataContext: string;

  if (gmailContext && Array.isArray(gmailContext) && gmailContext.length > 0) {
    const emails = gmailContext.slice(0, 30);
    const emailList = emails
      .map((m, i) => `${i + 1}. De: ${m.from}\n   Asunto: ${m.subject}\n   Fecha: ${m.date}\n   Detalle: ${(m.snippet ?? "").substring(0, 150)}`)
      .join("\n\n");
    dataContext = `Analiza estos ${emails.length} correos bancarios e identifica gastos potencialmente deducibles para ISR en México:\n\n${emailList}`;
  } else {
    const mayo = transactions.mayo ?? [];
    const gastos = mayo.filter(t => t.amount < 0);
    dataContext = `${FINANCIAL_CONTEXT}\n\nGASTOS MAYO 2025:\n${gastos.map(t => `- ${t.date}: ${t.name} $${Math.abs(t.amount)} (${t.cat})`).join("\n")}`;
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
