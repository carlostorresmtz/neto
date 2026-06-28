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

/**
 * Datos de ejemplo. Se devuelven cuando no hay ANTHROPIC_API_KEY (p. ej. en
 * desarrollo local) o si la llamada al modelo falla, para que la app corra sin
 * llaves en vez de responder 500 — misma filosofía que lib/stripe.ts.
 */
const DEMO_DATA = {
  gastosPorCategoria: [
    { categoria: "Restaurantes",    monto: 6800, porcentaje: 29, color: "#f97316" },
    { categoria: "Supermercado",    monto: 5200, porcentaje: 22, color: "#10b981" },
    { categoria: "Servicios",       monto: 3100, porcentaje: 13, color: "#ef4444" },
    { categoria: "Gasolina",        monto: 3400, porcentaje: 14, color: "#3b82f6" },
    { categoria: "Entretenimiento", monto: 2600, porcentaje: 11, color: "#8b5cf6" },
    { categoria: "Otros",           monto: 2500, porcentaje: 11, color: "#f59e0b" },
  ],
  gastosPorMes: [
    { mes: "Feb", total: 21400 },
    { mes: "Mar", total: 19800 },
    { mes: "Abr", total: 22600 },
    { mes: "May", total: 20900 },
    { mes: "Jun", total: 23600 },
  ],
  totalMesActual: 23600,
  promedioMensual: 21660,
  variacionVsMesAnterior: 12.9,
  tendencia: "subiendo",
  topComercio: { nombre: "Oxxo", monto: 2840, visitas: 23 },
};

export async function POST(req: Request) {
  const body = await req.json().catch(() => ({}));
  const { gmailContext } = body as { gmailContext?: GmailMessage[] };

  // Sin llave de Anthropic no podemos llamar al modelo: devolvemos demo en vez
  // de tronar con 500 (esto desbloquea el desarrollo local).
  if (!process.env.ANTHROPIC_API_KEY) {
    return Response.json(DEMO_DATA);
  }

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

  try {
    const { text } = await generateText({
      model: anthropic("claude-sonnet-4-6"),
      system: SYSTEM_PROMPT,
      messages: [{ role: "user", content: dataContext }],
      maxTokens: 2000,
    });

    const parsed = extractJSON(text);
    // Si el modelo no devolvió JSON parseable, caemos a datos de ejemplo.
    return Response.json(parsed ?? DEMO_DATA);
  } catch (e) {
    console.error("analisis/data error:", e);
    return Response.json(DEMO_DATA);
  }
}
