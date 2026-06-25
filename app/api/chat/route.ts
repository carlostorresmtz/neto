import { anthropic } from "@ai-sdk/anthropic";
import { streamText } from "ai";
import { FINANCIAL_CONTEXT } from "@/lib/data";

export async function POST(req: Request) {
  const body = await req.json();
  const { messages, gmailContext } = body;

  console.log("gmailContext length:", gmailContext?.length);
  console.log("gmailContext[0]:", JSON.stringify(gmailContext?.[0])?.substring(0, 150));

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
