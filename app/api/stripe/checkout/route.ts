import { auth } from "@/auth";
import { getStripe, STRIPE_PRICE_ID, TRIAL_DAYS } from "@/lib/stripe";

/**
 * Crea una sesión de Stripe Checkout en modo suscripción con:
 *  - trial de TRIAL_DAYS días (2 meses gratis)
 *  - tarjeta OBLIGATORIA desde el inicio (payment_method_collection: "always")
 *  - cobro automático al terminar el trial (inicio del mes 3)
 *
 * Devuelve { url } para redirigir al usuario al checkout hospedado por Stripe.
 */
export async function POST(req: Request) {
  const stripe = getStripe();
  if (!stripe || !STRIPE_PRICE_ID) {
    return Response.json(
      {
        error: "stripe_not_configured",
        mensaje: "El cobro aún no está configurado. Vuelve pronto.",
      },
      { status: 503 }
    );
  }

  const session = await auth();
  const origin = req.headers.get("origin") ?? new URL(req.url).origin;

  try {
    const checkout = await stripe.checkout.sessions.create({
      mode: "subscription",
      payment_method_types: ["card"],
      line_items: [{ price: STRIPE_PRICE_ID, quantity: 1 }],
      // Exige tarjeta aunque el periodo de prueba sea gratis.
      payment_method_collection: "always",
      subscription_data: {
        trial_period_days: TRIAL_DAYS,
        // Si por alguna razón no quedara método de pago al terminar el trial,
        // se cancela en vez de generar una factura impagable.
        trial_settings: { end_behavior: { missing_payment_method: "cancel" } },
      },
      customer_email: session?.user?.email ?? undefined,
      allow_promotion_codes: true,
      success_url: `${origin}/bienvenida?checkout=success`,
      cancel_url: `${origin}/bienvenida?checkout=cancel`,
    });

    return Response.json({ url: checkout.url });
  } catch (e) {
    console.error("Stripe checkout error:", e);
    return Response.json(
      { error: "checkout_failed", mensaje: "No se pudo iniciar el checkout. Intenta de nuevo." },
      { status: 500 }
    );
  }
}
