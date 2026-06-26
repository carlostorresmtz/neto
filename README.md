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

## OAuth para desarrollo local — colaboradores (EN PROGRESO)

Guía para que un colaborador pueda **iniciar sesión con Google desde su localhost**
(ej. `http://localhost:3001`) sin tocar las credenciales de producción.

**Decisión tomada:** Opción **A** — crear un **cliente OAuth NUEVO dedicado a
desarrollo**, en el **mismo proyecto de GCP** que producción. El colaborador recibe
el ID + secret de *ese* cliente, nunca el de producción. El cliente de prod **no se
toca**. El consent screen (scope + test users) se comparte a nivel proyecto, así que
se reutiliza.

> Alternativa descartada (B): reutilizar el cliente de prod y compartir su secret →
> riesgo de fuga del secret de producción. No se hizo.

**Contexto verificado:**
- `auth.ts` usa `GOOGLE_CLIENT_ID` / `GOOGLE_CLIENT_SECRET`, scope
  `openid email profile https://www.googleapis.com/auth/gmail.readonly`.
- Callback de NextAuth: `/api/auth/callback/google`.
- Credenciales de prod viven en Vercel (Production/Preview/Development), cifradas.
- `gcloud` NO está instalado → todo se hace en la consola web de Google Cloud.

### Pasos en Google Cloud Console (cuenta dueña del proyecto, NO la del colaborador)

**1. Proyecto correcto** — https://console.cloud.google.com/apis/credentials →
seleccionar el proyecto de Neto (donde aparece el cliente de prod "Neto Web"). No
editar ese cliente.

**2. Consent screen (Testing)** — https://console.cloud.google.com/auth/audience
- Confirmar modo **Testing**.
- Agregar **`panislouis@gmail.com`** como **usuario de prueba (test user)**.
- Confirmar que el scope **`https://www.googleapis.com/auth/gmail.readonly`** esté declarado.

**3. Crear cliente OAuth nuevo** (APIs y servicios → Credenciales → "+ Crear
credenciales" → "ID de cliente de OAuth"):
- Tipo: **Aplicación web**. Nombre sugerido: `Neto Dev (localhost)`.
- **URIs de redirección autorizadas:**
  - `http://localhost:3001/api/auth/callback/google`
  - `http://localhost:3000/api/auth/callback/google`
- **Orígenes de JavaScript autorizados:**
  - `http://localhost:3001`
  - `http://localhost:3000`

**4. Gmail API habilitada** — https://console.cloud.google.com/apis/library/gmail.googleapis.com
→ debe estar **Habilitada** en el proyecto.

**5. Entregar credenciales del cliente DEV al colaborador** (por canal seguro:
gestor de contraseñas / 1Password / mensaje cifrado — **NUNCA** en git ni en chat):
- `GOOGLE_CLIENT_ID` (del cliente dev)
- `GOOGLE_CLIENT_SECRET` (del cliente dev)

El colaborador los pone en **su** `.env.local` junto con:
```
NEXTAUTH_URL=http://localhost:3001
NEXTAUTH_SECRET=<genera uno: openssl rand -base64 32>
GOOGLE_CLIENT_ID=<dev>
GOOGLE_CLIENT_SECRET=<dev>
```
> ⚠️ El `Client ID`/`Secret` del cliente dev se ven SOLO en el modal de Google Cloud
> al crearlo (no se pueden recuperar por CLI). Cópialos en ese momento.

### Estado / dónde nos quedamos
- [x] Decisión A tomada; recon hecho (auth.ts, Vercel env, gcloud ausente).
- [ ] Paso 1: confirmar proyecto correcto.
- [ ] Paso 2: test user `panislouis@gmail.com` + scope gmail.readonly.
- [ ] Paso 3: crear cliente "Neto Dev (localhost)" con redirects/orígenes.
- [ ] Paso 4: confirmar Gmail API habilitada.
- [ ] Paso 5: compartir ID+secret dev por canal seguro.

---

## Licencia

Propietario — Neto. Todos los derechos reservados.
