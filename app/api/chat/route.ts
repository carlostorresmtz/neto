import { anthropic } from "@ai-sdk/anthropic";
import { streamText, formatStreamPart } from "ai";
import { FINANCIAL_CONTEXT } from "@/lib/data";
import { auth } from "@/auth";
import { checkRateLimit } from "@/lib/rateLimit";

// Plan free: 20 mensajes por hora.
const CHAT_LIMIT = 20;
const HOUR_MS = 60 * 60 * 1000;

/**
 * Respuesta demo. Se devuelve cuando no hay ANTHROPIC_API_KEY (p. ej. en
 * desarrollo local) o si la llamada al modelo falla, para que el chat corra sin
 * llaves en vez de tronar con 500 — misma filosofía que lib/stripe.ts.
 *
 * Emite el protocolo data-stream de la AI SDK (mismas partes y headers que
 * `toDataStreamResponse()`) para que `useChat` lo renderice como un mensaje del
 * asistente, con efecto de escritura token por token.
 */
const DEMO_REPLY =
  "Con tus datos de ejemplo, este mes llevas $23,450 gastados. Tus categorías principales son Restaurantes ($6,800), Supermercado ($5,200) y Servicios ($3,100). Tu mayor deuda es la tarjeta Nu ($18,640): si abonas $3,000 al mes la liquidas en unos 7 meses. ¿Quieres que desglose alguna categoría o tus suscripciones?";

function demoChatResponse(): Response {
  const tokens = DEMO_REPLY.match(/\S+\s*/g) ?? [DEMO_REPLY];
  const encoder = new TextEncoder();
  const stream = new ReadableStream<Uint8Array>({
    async start(controller) {
      for (const token of tokens) {
        controller.enqueue(encoder.encode(formatStreamPart("text", token)));
        await new Promise(r => setTimeout(r, 18));
      }
      controller.enqueue(
        encoder.encode(formatStreamPart("finish_message", {
          finishReason: "stop",
          usage: { promptTokens: 0, completionTokens: 0 },
        }))
      );
      controller.close();
    },
  });
  return new Response(stream, {
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
      "X-Vercel-AI-Data-Stream": "v1",
    },
  });
}

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

  // Sin llave de Anthropic no podemos llamar al modelo: devolvemos un mensaje
  // demo en el mismo formato de stream (esto desbloquea el desarrollo local).
  if (!process.env.ANTHROPIC_API_KEY) {
    return demoChatResponse();
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

  try {
    const result = await streamText({
      model: anthropic("claude-sonnet-4-6"),
      system: systemPrompt,
      messages,
      maxTokens: 1024,
    });

    return result.toDataStreamResponse();
  } catch (e) {
    console.error("chat error:", e);
    return demoChatResponse();
  }
}
