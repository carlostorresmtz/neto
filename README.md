# Neto

**Asistente de finanzas personales con IA para México.**

Neto lee tus correos bancarios en Gmail (modo solo lectura) y responde en lenguaje natural cualquier pregunta sobre tu dinero. Sin hojas de cálculo, sin apps extra, sin compartir contraseñas. Cero cambio de comportamiento del usuario.

🔗 **Producción:** [useneto.com.mx](https://useneto.com.mx)

---

## ¿Qué hace?

- Conecta tu Gmail vía OAuth (solo lectura) y detecta correos de los principales bancos de México: BBVA, Nu, Amex, Banamex, Santander, HSBC, Banorte, Scotiabank, Inbursa y Citibanamex.
- Te deja preguntarle a un chat con IA sobre tus finanzas en español natural.
- Incluye 6 agentes especializados que analizan tus movimientos automáticamente.

---

## Stack técnico

| Capa | Tecnología |
|------|------------|
| Framework | Next.js 14 (App Router) |
| Auth | NextAuth v5 + Google Provider |
| IA | Claude API (claude-sonnet-4-6) |
| Estilos | Tailwind CSS |
| Hosting | Vercel |
| Datos bancarios | Gmail API (scope gmail.readonly) |

**Diseño:** tema azul/blanco corporativo estilo minimalista/futurista (tipografía grande, badges con borde, ilustraciones SVG de líneas finas animadas con stroke-dashoffset, count-up en métricas, scroll reveal, barra de progreso de scroll).

---

## Arquitectura

### Autenticación y Gmail
- Gmail OAuth vía NextAuth v5 + Google Provider.
- Scopes: openid email profile gmail.readonly.
- OAuth client "Neto Web" publicado en Google Cloud Console.
- La query de Gmail busca por keywords en el subject + dominios parciales de bancos (límite 50–100 correos).

### Los 6 agentes
Cada agente vive en app/api/agentes/{nombre}/route.ts, recibe un slice de 30–40 correos como gmailContext, usa un system prompt que fuerza salida en JSON válido, un helper extractJSON con 4 estrategias, max_tokens: 2000, y devuelve JSON de error estructurado en vez de HTTP 500. La UI parsea el JSON en cards por severidad (nunca JSON crudo).

| Agente | Función |
|--------|---------|
| AlertasAgent | Alertas URGENTE / IMPORTANTE / INFORMATIVO |
| CierreAgent | Resumen mensual |
| ComparadorAgent | Compara tarjetas de crédito MX por cashback |
| DeduciblesAgent | Detecta gastos deducibles SAT/ISR |
| FraudeAgent | Detecta patrones sospechosos |
| DepositosAgent | Detecta depósitos en efectivo / transferencias / SPEI / nómina |

El **Agente Personalizado** es CTA del tier Business.

### Páginas (en app/(app)/)
chat · estados · gastos · analisis · suscripciones · alertas (auto-ejecuta AlertasAgent) · agentes · presupuesto · conexiones · configuracion · bienvenida (onboarding de 3 pasos) · cuentas/{bbva,amex,nu}

### Rate limiting
lib/rateLimit.ts — chat 20/hora, agentes 10/hora (en memoria; pendiente migrar a Upstash/Redis).

---

## Planes

| Plan | Precio |
|------|--------|
| Free | $0 |
| Pro | $149 MXN/mes |
| Business | $499 MXN/mes |

---

## Desarrollo local

```bash
# Instalar dependencias
npm install

# Correr en local
npm run dev
# → http://localhost:3000
```

### Variables de entorno

Crea un archivo .env.local con:

```
ANTHROPIC_API_KEY=
GOOGLE_CLIENT_ID=
GOOGLE_CLIENT_SECRET=
NEXTAUTH_SECRET=
NEXTAUTH_URL=http://localhost:3000
```

> ⚠️ Nunca subas credenciales al repositorio ni las compartas en texto plano.

---

## Deploy

El deploy es **manual** (decisión propia, no hay auto-deploy desde GitHub):

```bash
npm run build      # build limpio
vercel --prod      # deploy a producción
```

Las variables de entorno están configuradas en Vercel para los 3 entornos (production, preview, development).

---

## Flujo de Git

- **main** — rama protegida (requiere PR + 1 approval, sin force push). Nunca se commitea directo.
- **develop** — rama de trabajo y colaboradores.

```bash
git add .
git commit -m "mensaje"
git push origin develop
```

---

## Roadmap

1. Verificación de Google OAuth (quitar la advertencia de "app no verificada").
2. Persistencia real con Supabase (hoy todo vive en localStorage).
3. Integración con /estados y /cuentas/{bbva,amex,nu} con Gmail real (hoy usan datos hardcodeados).
4. Soporte multi-correo (Outlook / Yahoo).
5. Crear el correo hola@useneto.com.mx.
6. Notificaciones nativas al celular (WhatsApp / SMS vía Twilio).
7. Migrar rate limiting a Upstash/Redis.
8. Stripe para cobros (solo cuando el negocio ya esté operando — no es prioridad).

---

## Licencia

Propietario — Neto. Todos los derechos reservados.
