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

Eres DepositosAgent. Analiza los correos bancarios y detecta TODOS los ingresos: depósitos en efectivo, transferencias recibidas (SPEI), devoluciones y nóminas. Ignora los cargos y compras.

Palabras clave de ingresos en correos bancarios mexicanos: 'recibiste', 'abono', 'depósito', 'transferencia recibida', 'SPEI recibido', 'te depositaron', 'devolución'.

Responde con este JSON exacto:
{
  "ingresos": [{ "fecha": "string", "monto": 0, "origen": "string", "tipo": "transferencia", "banco": "string" }],
  "totalIngresos": 0,
  "ingresoMasReciente": { "monto": 0, "origen": "string", "fecha": "string" },
  "resumen": "string"
}

Reglas:
- "tipo" debe ser exactamente uno de: "transferencia", "efectivo", "nomina", "devolucion".
- "origen" = quién envió el dinero o la descripción del depósito (si no aparece, usa "No especificado").
- "totalIngresos" = suma de todos los montos detectados.
- "ingresoMasReciente" = el ingreso con la fecha más reciente. Si no hay ingresos, usa null.
- Si no detectas ningún ingreso, devuelve "ingresos": [], "totalIngresos": 0, "ingresoMasReciente": null.
- Todos los montos en MXN (pesos mexicanos).`;

export async function POST(req: Request) {
  const session = await auth();
  const limited = agentRateLimit(session?.user?.email ?? "anon", "depositos");
  if (limited) return limited;

  const body = await req.json().catch(() => ({}));
  const { gmailContext } = body as { gmailContext?: GmailMessage[] };

  let dataContext: string;

  if (gmailContext && Array.isArray(gmailContext) && gmailContext.length > 0) {
    const emails = gmailContext.slice(0, 40);
    const emailList = emails
      .map((m, i) => `${i + 1}. De: ${m.from}\n   Asunto: ${m.subject}\n   Fecha: ${m.date}\n   Detalle: ${(m.snippet ?? "").substring(0, 150)}`)
      .join("\n\n");
    dataContext = `Analiza estos ${emails.length} correos bancarios reales y detecta TODOS los ingresos (depósitos, transferencias recibidas, devoluciones, nóminas):\n\n${emailList}`;
  } else {
    const mayo = transactions.mayo ?? [];
    const ingresos = mayo.filter(t => t.amount > 0);
    dataContext = `${FINANCIAL_CONTEXT}\n\nINGRESOS MAYO 2025:\n${ingresos.map(t => `- ${t.date}: ${t.name} +$${t.amount} (${t.cat}) [${t.account.toUpperCase()}]`).join("\n")}`;
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
      mensaje: "No se pudo analizar la respuesta",
      ingresos: [],
      totalIngresos: 0,
      ingresoMasReciente: null,
      resumen: "Error temporal. Intenta de nuevo.",
    });
  }
  return Response.json(parsed);
}
