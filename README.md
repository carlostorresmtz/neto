# Neto

**Tu asistente financiero personal con IA, para México.**

Neto lee tus correos bancarios (Gmail) y responde en español cualquier pregunta sobre tu dinero: gastos por categoría, suscripciones, deuda de tarjetas, deducibles de ISR y más. Sin hojas de cálculo, sin apps extra. Acceso de **solo lectura** — Neto nunca escribe, borra ni mueve dinero.

🌐 **En producción:** [useneto.com.mx](https://www.useneto.com.mx)

---

## Stack tecnológico

| Capa | Tecnología |
|------|-----------|
| Framework | [Next.js 14](https://nextjs.org/) (App Router) |
| Lenguaje | TypeScript |
| Auth | [NextAuth v5](https://authjs.dev/) (Google OAuth) |
| IA | [Claude](https://www.anthropic.com/) (Anthropic) vía [Vercel AI SDK](https://sdk.vercel.ai/) |
| Datos | Gmail API (solo lectura) |
| Estilos | Tailwind CSS + CSS variables (tema claro/oscuro) |
| Deploy | [Vercel](https://vercel.com/) |

---

## Correr el proyecto localmente

### 1. Clonar el repo

```bash
git clone <url-del-repo>
cd neto
```

### 2. Instalar dependencias

```bash
npm install
```

### 3. Variables de entorno

Crea un archivo `.env.local` en la raíz con las siguientes variables:

```
# Anthropic (Claude)
ANTHROPIC_API_KEY=

# Google OAuth (Gmail) — obtenidas en Google Cloud Console
GOOGLE_CLIENT_ID=
GOOGLE_CLIENT_SECRET=

# NextAuth
NEXTAUTH_SECRET=        # genera uno con: openssl rand -base64 32
NEXTAUTH_URL=http://localhost:3000

# Stripe (prueba gratis de 2 meses + cobro automático al mes 3)
STRIPE_SECRET_KEY=      # sk_test_... (pruebas) o sk_live_... (producción)
STRIPE_PRICE_ID=        # price_... del plan recurrente creado en Stripe
STRIPE_WEBHOOK_SECRET=  # whsec_... del endpoint /api/stripe/webhook
STRIPE_TRIAL_DAYS=60    # opcional, días de prueba (60 ≈ 2 meses)
```

> **Cobro / prueba gratis:** el flujo usa **Stripe Checkout** en modo suscripción
> con un trial de `STRIPE_TRIAL_DAYS` (60 = ~2 meses) y `payment_method_collection: always`,
> así Stripe pide la tarjeta al inicio pero no cobra hasta el mes 3. Para activarlo:
> 1. Crea un producto con un **precio recurrente** en Stripe y copia su `price_...`.
> 2. Crea un **webhook** apuntando a `/api/stripe/webhook` y copia el `whsec_...`.
> 3. Pega las llaves en `.env.local` (y en las env vars de Vercel).
> Sin estas llaves, la app corre normal y el paso de tarjeta del onboarding queda inactivo.

> El proyecto de Google Cloud debe tener habilitada la **Gmail API** y el scope
> `https://www.googleapis.com/auth/gmail.readonly` en la pantalla de consentimiento OAuth.

### 4. Levantar el servidor de desarrollo

```bash
npm run dev
```

Abre [http://localhost:3000](http://localhost:3000).

### Scripts disponibles

```bash
npm run dev     # servidor de desarrollo
npm run build   # build de producción
npm run start   # servir el build de producción
npm run lint    # linter
```

---

## Estructura de carpetas

```
app/
  (app)/            Área autenticada de la app (sidebar + topbar vía AppShell)
    chat/           Contador personal — chat con Claude
    agentes/        Agentes financieros (alertas, cierre, comparador, etc.)
    analisis/       Análisis financiero con gráficas
    alertas/        Alertas en vivo
    gastos/         Mis gastos
    suscripciones/  Suscripciones detectadas
    cuentas/        Vistas por banco (BBVA, Amex, Nu…)
    conexiones/     Conectar/desconectar Gmail
    configuracion/  Perfil, plan, preferencias y privacidad
    bienvenida/     Onboarding de 3 pasos para usuarios nuevos
  api/
    chat/           Endpoint de chat (streaming con Claude)
    agentes/        Endpoints de cada agente
    analisis/       Datos para la página de análisis
    gmail/          Lectura de correos bancarios (solo lectura)
    auth/           Rutas de NextAuth
    waitlist/       Lista de espera
  page.tsx          Landing page pública
  globals.css       Estilos globales + temas claro/oscuro

components/
  landing/          Secciones e ilustraciones de la landing
  layout/           AppShell (sidebar, topbar, navegación)
  chat/             Componentes del chat
  ui/               Componentes reutilizables

lib/
  data.ts           Datos financieros de ejemplo (modo demo)
  rateLimit.ts      Rate limiter en memoria (ver nota más abajo)
  types.ts          Tipos compartidos

auth.ts             Configuración de NextAuth
types/              Tipos globales (next-auth, etc.)
data/               JSON estático (waitlist)
```

---

## Agentes disponibles

Los agentes viven en `app/(app)/agentes` y consumen los endpoints de `app/api/agentes`. Cada uno analiza tus datos (correos reales o datos de ejemplo) con Claude:

| Agente | Qué hace |
|--------|----------|
| **AlertasAgent** | Detecta situaciones urgentes: vencimientos, cargos no reconocidos, suscripciones por renovar. |
| **CierreAgent** | Genera tu resumen financiero mensual con categorías, KPIs y recomendaciones. |
| **ComparadorAgent** | Analiza tus patrones de gasto y calcula qué tarjeta de crédito mexicana te da más cashback. |
| **DeduciblesAgent** | Detecta gastos deducibles de ISR y arma el reporte fiscal para tu contador. |
| **FraudeAgent** | Detecta cargos duplicados, montos inusuales y patrones sospechosos. |

---

## Flujo de trabajo con Git (colaboradores)

- **No trabajes directo sobre `main`** — esa rama es producción y se despliega automáticamente.
- Crea tu trabajo en una rama `feature/<nombre>` (o sobre `develop` si existe).
- Abre un **Pull Request hacia `develop`** para revisión.
- Una vez aprobado y validado en `develop`, se integra a `main` para liberar a producción.

```bash
git checkout -b feature/mi-cambio
# ...trabaja...
git push origin feature/mi-cambio
# Abre el PR hacia develop
```

---

## Notas

- **Rate limiting:** `lib/rateLimit.ts` es un limiter **en memoria** (20 mensajes/hora en chat, 10/hora por agente). Funciona para un solo proceso, pero en producción serverless debe migrarse a **Redis / Upstash** para ser confiable entre instancias. Hay un `TODO` en el archivo.
- **Privacidad:** Neto nunca almacena tus correos; solo extrae montos y comercios necesarios para responder. El acceso a Gmail es de solo lectura y revocable en cualquier momento.

---

Hecho en Monterrey, México 🇲🇽
