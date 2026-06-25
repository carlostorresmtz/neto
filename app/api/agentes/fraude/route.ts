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

Eres FraudeAgent. Analiza los datos financieros y detecta patrones sospechosos que puedan indicar fraude.

Busca activamente:
- Cargos duplicados (mismo comercio, monto similar, fechas cercanas en 24h)
- Cargos en horarios inusuales (madrugada 1am-6am hora México)
- Montos atípicamente altos vs el patrón del usuario
- Comercios desconocidos o con nombres genéricos sospechosos
- Múltiples cargos pequeños consecutivos (posible card skimming)

Responde con este JSON exacto:
{
  "alertasFraude": [{ "tipo": "string", "fecha": "string", "monto": 0, "comercio": "string", "banco": "string", "nivelRiesgo": "alto", "recomendacion": "string" }],
  "totalAlertas": 0,
  "resumen": "string"
}
"nivelRiesgo" debe ser exactamente "alto", "medio" o "bajo" en minúsculas. Si no hay fraude, devuelve alertasFraude vacío y totalAlertas: 0.`;

export async function POST(req: Request) {
  const session = await auth();
  const limited = agentRateLimit(session?.user?.email ?? "anon", "fraude");
  if (limited) return limited;

  const body = await req.json().catch(() => ({}));
  const { gmailContext } = body as { gmailContext?: GmailMessage[] };

  let dataContext: string;

  if (gmailContext && Array.isArray(gmailContext) && gmailContext.length > 0) {
    const emails = gmailContext.slice(0, 30);
    const emailList = emails
      .map((m, i) => `${i + 1}. De: ${m.from}\n   Asunto: ${m.subject}\n   Fecha: ${m.date}\n   Detalle: ${(m.snippet ?? "").substring(0, 150)}`)
      .join("\n\n");
    dataContext = `Analiza estos ${emails.length} correos bancarios reales en busca de fraude o actividad sospechosa:\n\n${emailList}`;
  } else {
    const mayo = transactions.mayo ?? [];
    const gastos = mayo.filter(t => t.amount < 0);
    dataContext = `${FINANCIAL_CONTEXT}\n\nTRANSACCIONES MAYO 2025:\n${gastos.map(t => `- ${t.date}: ${t.name} $${Math.abs(t.amount)} (${t.cat}) [${t.account.toUpperCase()}]`).join("\n")}`;
  }

  const { text } = await generateText({
    model: anthropic("claude-sonnet-4-6"),
    system: SYSTEM_PROMPT,
    messages: [{ role: "user", content: dataContext }],
    maxTokens: 2000,
  });

  const parsed = extractJSON(text);
  if (!parsed) {
    return Response.json({ error: true, mensaje: "No se pudo analizar la respuesta", alertasFraude: [], totalAlertas: 0, resumen: "Error temporal. Intenta de nuevo." });
  }
  return Response.json(parsed);
}
