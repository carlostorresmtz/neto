import { anthropic } from "@ai-sdk/anthropic";
import { streamText } from "ai";
import { FINANCIAL_CONTEXT } from "@/lib/data";
import { auth } from "@/auth";
import { checkRateLimit } from "@/lib/rateLimit";

// Plan free: 20 mensajes por hora.
const CHAT_LIMIT = 20;
const HOUR_MS = 60 * 60 * 1000;

export async function POST(req: Request) {
  const session = await auth();
  const userId = session?.user?.email ?? "anon";

  const rate = checkRateLimit(`chat:${userId}`, CHAT_LIMIT, HOUR_MS);
  if (!rate.allowed) {
    return Response.json(
      {
        error: "rate_limit",
        mensaje: "Has alcanzado el límite de mensajes. Espera un momento o mejora tu plan.",
        resetAt: rate.resetAt,
      },
      { status: 429 }
    );
  }

  const body = await req.json();
  const { messages, gmailContext } = body;

  let systemPrompt: string;

  if (gmailContext && Array.isArray(gmailContext) && gmailContext.length > 0) {
    const emailList = gmailContext
      .map((m: { subject: string; from: string; date: string; snippet: string }, i: number) =>
        `${i + 1}. De: ${m.from}\n   Asunto: ${m.subject}\n   Fecha: ${m.date}\n   Detalle: ${m.snippet?.substring(0, 200) ?? ""}`
      )
      .join("\n\n");

    systemPrompt = `Eres Neto, asistente financiero personal para México.
Tienes acceso a los siguientes correos bancarios reales del usuario:

${emailList}

Responde SOLO basándote en estos correos reales, no inventes datos.
Si el usuario pregunta sobre gastos, montos o movimientos, extráelos de los correos anteriores.

Distingue siempre entre dos tipos de movimientos:
- CARGOS (dinero que sale): compras, pagos, retiros.
- ABONOS/INGRESOS (dinero que entra): depósitos en efectivo, transferencias recibidas, devoluciones, nóminas.

Cuando el usuario pregunte sobre dinero que recibió, depósitos, transferencias entrantes o quién le envió dinero, identifica en los correos los ABONOS (no los cargos). Palabras clave de ingresos en correos bancarios mexicanos: 'recibiste', 'abono', 'depósito', 'transferencia recibida', 'SPEI recibido', 'te depositaron', 'devolución'. Para cada ingreso menciona: monto, fecha, quién lo envió (si aparece), y el banco.

Usa pesos mexicanos ($). Sé conciso y directo. Responde en español.`;
  } else {
    systemPrompt = `Eres Neto, asistente financiero personal para México.
Responde en español. Usa pesos mexicanos ($). Sé conciso y directo.
No uses markdown excesivo.

${FINANCIAL_CONTEXT}`;
  }

  const result = await streamText({
    model: anthropic("claude-sonnet-4-6"),
    system: systemPrompt,
    messages,
    maxTokens: 1024,
  });

  return result.toDataStreamResponse();
}
