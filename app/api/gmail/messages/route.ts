import { auth } from "@/auth";

// Broad subject keywords covering any bank notification language
const SUBJECT_QUERY =
  "subject:(cargo OR compra OR pago OR transaccion OR transacción OR movimiento OR " +
  "estado OR cuenta OR tarjeta OR débito OR debito OR credito OR crédito OR " +
  "deposito OR depósito OR retiro OR transferencia OR notificacion OR notificación OR " +
  "BBVA OR Nu OR Amex OR Santander OR Banamex OR HSBC OR Banorte OR Scotiabank OR Inbursa)";

// Broad from-domain matching — partial domain names Gmail understands
const FROM_QUERY =
  "from:(bbva.com OR nu.com.mx OR americanexpress.com OR banamex.com OR " +
  "citibanamex.com OR hsbc.com.mx OR santander.com.mx OR banorte.com OR " +
  "scotiabank.com.mx OR inbursa.com OR bancomer.com OR citi.com)";

const BANK_QUERY = `(${SUBJECT_QUERY}) OR (${FROM_QUERY})`;

export interface GmailMessage {
  id: string;
  subject: string;
  from: string;
  date: string;
  snippet: string;
}

function getHeader(headers: { name: string; value: string }[], name: string): string {
  return headers.find(h => h.name.toLowerCase() === name.toLowerCase())?.value ?? "";
}

export async function GET() {
  const session = await auth();

  if (!session?.accessToken) {
    return Response.json({ error: "no_token" }, { status: 401 });
  }

  const token = session.accessToken;

  try {
    console.log("[gmail] query:", BANK_QUERY.substring(0, 120) + "…");
    const listRes = await fetch(
      `https://gmail.googleapis.com/gmail/v1/users/me/messages?maxResults=100&q=${encodeURIComponent(BANK_QUERY)}`,
      { headers: { Authorization: `Bearer ${token}` } }
    );

    if (!listRes.ok) {
      let errorBody: { error?: { message?: string; status?: string } } = {};
      try { errorBody = await listRes.json(); } catch { /* ignore */ }

      console.error(`[gmail] status=${listRes.status}`, JSON.stringify(errorBody));

      if (listRes.status === 401) {
        return Response.json({ error: "token_expired" }, { status: 401 });
      }
      if (listRes.status === 403) {
        const msg = errorBody?.error?.message ?? "";
        // Scope missing or access denied
        if (msg.includes("insufficient") || msg.includes("scope") || msg.includes("ACCESS_TOKEN_SCOPE_INSUFFICIENT")) {
          return Response.json({ error: "scope_missing" }, { status: 403 });
        }
        // Gmail API not enabled in Google Cloud Console
        if (msg.includes("accessNotConfigured") || msg.includes("API has not been used") || msg.includes("disabled")) {
          return Response.json({ error: "api_disabled", detail: msg }, { status: 403 });
        }
        return Response.json({ error: "forbidden", detail: msg }, { status: 403 });
      }

      return Response.json({ error: "gmail_error", status: listRes.status }, { status: listRes.status });
    }

    const listData = await listRes.json();
    const messageIds: string[] = (listData.messages ?? []).map((m: { id: string }) => m.id);

    console.log("[gmail] query results:", messageIds.length, "message IDs found");

    if (messageIds.length === 0) {
      return Response.json({ messages: [], total: 0 });
    }

    const details = await Promise.allSettled(
      messageIds.slice(0, 100).map(async (id) => {
        const res = await fetch(
          `https://gmail.googleapis.com/gmail/v1/users/me/messages/${id}?format=metadata&metadataHeaders=Subject&metadataHeaders=From&metadataHeaders=Date`,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        if (!res.ok) return null;
        return res.json();
      })
    );

    const messages: GmailMessage[] = details
      .filter((r): r is PromiseFulfilledResult<NonNullable<unknown>> => r.status === "fulfilled" && r.value !== null)
      .map(r => {
        const msg = r.value as { id: string; snippet: string; payload: { headers: { name: string; value: string }[] } };
        const headers = msg.payload?.headers ?? [];
        return {
          id: msg.id,
          subject: getHeader(headers, "Subject"),
          from: getHeader(headers, "From"),
          date: getHeader(headers, "Date"),
          snippet: msg.snippet ?? "",
        };
      });

    console.log("[gmail] parsed messages:", messages.length, messages[0] ?? "none");
    return Response.json({ messages, total: messages.length });
  } catch (err) {
    console.error("[gmail] unexpected error:", err);
    return Response.json({ error: "connection_error" }, { status: 500 });
  }
}
