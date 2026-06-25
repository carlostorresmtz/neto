import Stripe from "stripe";

/**
 * Cliente de Stripe inicializado de forma perezosa.
 *
 * Devuelve `null` si no hay STRIPE_SECRET_KEY en el entorno, de modo que la
 * app compila y corre sin llaves: el flujo de cobro simplemente queda inactivo
 * hasta que conectes las credenciales (sin tocar código).
 *
 * TODO(producción): cuando exista una base de datos de usuarios, persistir el
 * customerId y el subscriptionId de Stripe para poder bloquear el acceso si la
 * suscripción no está activa. Hoy Stripe es la única fuente de verdad.
 */
let cached: Stripe | null = null;

export function getStripe(): Stripe | null {
  const key = process.env.STRIPE_SECRET_KEY;
  if (!key) return null;
  if (!cached) cached = new Stripe(key);
  return cached;
}

/** ID del precio recurrente (price_...) creado en el dashboard de Stripe. */
export const STRIPE_PRICE_ID = process.env.STRIPE_PRICE_ID ?? "";

/** Días de prueba gratis antes del primer cobro. 2 meses ≈ 60 días. */
export const TRIAL_DAYS = Number(process.env.STRIPE_TRIAL_DAYS ?? "60");
