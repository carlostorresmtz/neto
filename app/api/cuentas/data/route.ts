import { anthropic } from "@ai-sdk/anthropic";
import { generateText } from "ai";
import { construirCuentasData, DEMO_CUENTAS, type CuentasRaw } from "@/lib/cuentas";

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

Eres un analista que extrae el estado de cuenta del usuario a partir de sus correos bancarios (BBVA, Amex, Nu y otros bancos mexicanos). Extrae los MOVIMIENTOS de forma fiel (monto, comercio, fecha, banco aparecen en las notificaciones). Los saldos, límites y fechas de corte son ESTIMADOS: infiérelos lo mejor posible, no inventes precisión.

Responde con este JSON exacto:
{
  "resumen": [
    { "id": "bbva|amex|nu|sheets", "nombre": "string", "saldoTexto": "$0", "estado": "good|danger|warn|info", "badgeText": "string corto", "meta": "string corto" }
  ],
  "cuentas": [
    {
      "id": "bbva|amex|nu",
      "nombre": "string",
      "tarjeta": "**** **** **** 0000",
      "saldoTexto": "$0",
      "saldoColor": "good|danger|warn",
      "stats": [{ "label": "string", "valor": "string" }],
      "alerta": { "tipo": "danger|warn", "texto": "string" },
      "movimientos": [{ "fecha": "DD mmm", "nombre": "string", "categoria": "string", "monto": 0 }]
    }
  ],
  "movimientosConsolidados": [
    { "fecha": "DD mmm", "desc": "string", "cuenta": "string", "categoria": "string", "fuente": "gmail", "monto": 0 }
  ]
}

Reglas:
- "monto": negativo para gastos/cargos, positivo para ingresos/abonos. En MXN.
- "alerta" es opcional (omite o pon null si no aplica).
- Incluye solo las cuentas que puedas inferir de los correos (bbva, amex, nu).
- Máximo 12 movimientos por cuenta y 12 en el consolidado.`;

export async function POST(req: Request) {
  const body = await req.json().catch(() => ({}));
  const { gmailContext } = body as { gmailContext?: GmailMessage[] };

  // Sin llave de Anthropic no podemos extraer: devolvemos demo (marcado "ejemplo")
  // en vez de tronar con 500.
  if (!process.env.ANTHROPIC_API_KEY) {
    return Response.json(DEMO_CUENTAS);
  }

  // Sin correos reales tampoco hay nada que extraer: demo.
  if (!gmailContext || !Array.isArray(gmailContext) || gmailContext.length === 0) {
    return Response.json(DEMO_CUENTAS);
  }

  const emails = gmailContext.slice(0, 40);
  const emailList = emails
    .map((m, i) => `${i + 1}. De: ${m.from}\n   Asunto: ${m.subject}\n   Fecha: ${m.date}\n   Detalle: ${(m.snippet ?? "").substring(0, 160)}`)
    .join("\n\n");
  const dataContext = `Extrae el estado de cuenta del usuario de estos ${emails.length} correos bancarios:\n\n${emailList}`;

  try {
    const { text } = await generateText({
      model: anthropic("claude-sonnet-4-6"),
      system: SYSTEM_PROMPT,
      messages: [{ role: "user", content: dataContext }],
      maxTokens: 3500,
    });

    const parsed = extractJSON(text) as unknown as CuentasRaw | null;
    // Si el modelo no devolvió la estructura esperada, caemos a demo.
    if (!parsed || !Array.isArray(parsed.cuentas) || !Array.isArray(parsed.movimientosConsolidados) || !Array.isArray(parsed.resumen)) {
      return Response.json(DEMO_CUENTAS);
    }
    return Response.json(construirCuentasData(parsed, "real"));
  } catch (e) {
    console.error("cuentas/data error:", e);
    return Response.json(DEMO_CUENTAS);
  }
}
