import { getStripe } from "@/lib/stripe";

/**
 * Webhook de Stripe. Verifica la firma y reacciona a los eventos del ciclo de
 * vida de la suscripción (trial → primer cobro al mes 3 → fallos / cancelación).
 *
 * Necesita el cuerpo CRUDO de la request para validar la firma, por eso usamos
 * req.text() (no req.json()).
 *
 * Configura el endpoint en el dashboard de Stripe apuntando a:
 *   https://www.useneto.com.mx/api/stripe/webhook
 * y guarda el signing secret en STRIPE_WEBHOOK_SECRET.
 */
export async function POST(req: Request) {
  const stripe = getStripe();
  const whSecret = process.env.STRIPE_WEBHOOK_SECRET;
  if (!stripe || !whSecret) {
    return Response.json({ error: "stripe_not_configured" }, { status: 503 });
  }

  const sig = req.headers.get("stripe-signature");
  if (!sig) return new Response("Missing stripe-signature header", { status: 400 });

  const body = await req.text();

  let event;
  try {
    event = stripe.webhooks.constructEvent(body, sig, whSecret);
  } catch (e) {
    console.error("Stripe webhook signature verification failed:", e);
    return new Response("Invalid signature", { status: 400 });
  }

  // TODO(persistencia): cuando exista DB de usuarios, en cada caso guardar el
  // estado de la suscripción (customerId, subscriptionId, status, current_period_end)
  // para poder bloquear/permitir el acceso a la app.
  switch (event.type) {
    case "checkout.session.completed":
      // El usuario agregó su tarjeta y arrancó el trial de 2 meses.
      break;
    case "customer.subscription.trial_will_end":
      // Stripe avisa ~3 días antes de que termine el trial. Ideal para
      // recordarle al usuario que el primer cobro está por ocurrir.
      break;
    case "invoice.payment_succeeded":
      // Primer cobro exitoso al iniciar el mes 3 (o renovaciones).
      break;
    case "invoice.payment_failed":
      // Tarjeta rechazada al terminar el trial. Notificar / degradar a free.
      break;
    case "customer.subscription.deleted":
      // Suscripción cancelada.
      break;
    default:
      break;
  }

  return Response.json({ received: true });
}
