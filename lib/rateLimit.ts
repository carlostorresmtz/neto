/**
 * Rate limiter simple en memoria.
 *
 * TODO(producción): este rate limiter vive en memoria del proceso, por lo que
 * NO funciona de forma confiable en entornos serverless (cada instancia/lambda
 * tiene su propio Map) ni sobrevive a reinicios. Antes de escalar a usuarios
 * reales, migrar a un store distribuido como Upstash Redis (@upstash/ratelimit)
 * o Redis con un sliding window. La firma de checkRateLimit se mantiene estable
 * para que el cambio sea transparente para los callers.
 */

interface RateEntry {
  count: number;
  resetAt: number; // epoch ms en que se reinicia la ventana
}

const store = new Map<string, RateEntry>();

// Limpieza periódica de entradas expiradas para que el Map no crezca sin límite.
let lastSweep = 0;
function sweep(now: number) {
  // Barremos como máximo una vez por minuto para no recorrer el Map en cada request.
  if (now - lastSweep < 60_000) return;
  lastSweep = now;
  store.forEach((entry, key) => {
    if (entry.resetAt <= now) store.delete(key);
  });
}

export interface RateLimitResult {
  allowed: boolean;
  remaining: number;
  resetAt: number; // epoch ms
}

/**
 * Verifica y consume una unidad del límite para `userId`.
 *
 * @param userId  Identificador del usuario (ej. email de la sesión).
 * @param limit   Número máximo de requests permitidos dentro de la ventana.
 * @param windowMs Tamaño de la ventana en milisegundos.
 */
export function checkRateLimit(
  userId: string,
  limit: number,
  windowMs: number
): RateLimitResult {
  const now = Date.now();
  sweep(now);

  const key = userId || "anon";
  const entry = store.get(key);

  // Sin entrada o ventana ya expirada → arrancamos una ventana nueva.
  if (!entry || entry.resetAt <= now) {
    const resetAt = now + windowMs;
    store.set(key, { count: 1, resetAt });
    return { allowed: true, remaining: limit - 1, resetAt };
  }

  // Dentro de la ventana actual.
  if (entry.count >= limit) {
    return { allowed: false, remaining: 0, resetAt: entry.resetAt };
  }

  entry.count += 1;
  return { allowed: true, remaining: limit - entry.count, resetAt: entry.resetAt };
}

/**
 * Helper para endpoints de agentes. Verifica el límite (más estricto: 10/hora
 * por defecto) y, si se excede, devuelve una Response 429 lista para retornar.
 * Si hay cupo, devuelve null y el caller continúa normal.
 */
export function agentRateLimit(
  userId: string,
  agentName: string,
  limit = 10,
  windowMs = 60 * 60 * 1000
): Response | null {
  const rate = checkRateLimit(`agente:${agentName}:${userId}`, limit, windowMs);
  if (rate.allowed) return null;
  return Response.json(
    {
      error: "rate_limit",
      mensaje: "Has alcanzado el límite de ejecuciones de agentes. Espera un momento o mejora tu plan.",
      resetAt: rate.resetAt,
    },
    { status: 429 }
  );
}
