"use server";

import { headers } from "next/headers";
import {
  contactSchema,
  type ContactFieldErrors,
  type ContactInput,
  type ContactState,
} from "@/lib/contact-schema";
import { sendMailViaGraph } from "@/lib/graph-mailer";

// Hinweis: In-Memory-Limiter funktioniert je Serverless-Instanz isoliert.
// Fuer harte Garantien Upstash Redis / Vercel KV verwenden.
const hits = new Map<string, { count: number; reset: number }>();

function rateLimit(key: string, max = 5, windowMs = 60_000): boolean {
  const now = Date.now();
  const entry = hits.get(key);
  if (!entry || entry.reset < now) {
    hits.set(key, { count: 1, reset: now + windowMs });
    return true;
  }
  if (entry.count >= max) return false;
  entry.count++;
  return true;
}

const HTML_ESCAPE_MAP: Record<string, string> = {
  "&": "&amp;",
  "<": "&lt;",
  ">": "&gt;",
  '"': "&quot;",
  "'": "&#39;",
};

function escapeHtml(value: string): string {
  return value.replace(/[&<>"']/g, (char) => HTML_ESCAPE_MAP[char] ?? char);
}

function nl2br(value: string): string {
  return escapeHtml(value).replace(/\r?\n/g, "<br />");
}

function buildTicketId(): string {
  return `ES-${Date.now().toString().slice(-7)}`;
}

function buildEmailHtml(data: ContactInput, ticketId: string, meta: { ip: string; userAgent: string }): string {
  const fullName = `${data.firstName} ${data.lastName}`.trim();
  const rows: Array<[string, string]> = [
    ["Referenznummer", ticketId],
    ["Name", fullName],
    ["Unternehmen", data.company ?? "—"],
    ["E-Mail", data.email],
    ["Telefon", data.phone ?? "—"],
    ["Standort", `${data.postalCode} ${data.city}${data.federalState ? `, ${data.federalState}` : ""}`],
    ["Leistungen", data.services.join(", ")],
  ];

  const tableRows = rows
    .map(
      ([label, value]) => `
        <tr>
          <td style="padding:6px 12px 6px 0;color:#475569;vertical-align:top;width:160px;font-size:13px;">${escapeHtml(label)}</td>
          <td style="padding:6px 0;color:#0f172a;font-size:14px;">${escapeHtml(value)}</td>
        </tr>`,
    )
    .join("");

  return `<!DOCTYPE html>
<html lang="de">
  <body style="margin:0;padding:0;background:#f1f5f9;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif;">
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:#f1f5f9;padding:24px 0;">
      <tr>
        <td align="center">
          <table role="presentation" width="600" cellpadding="0" cellspacing="0" style="background:#ffffff;border-radius:12px;overflow:hidden;border:1px solid #e2e8f0;">
            <tr>
              <td style="background:#2A4961;padding:20px 24px;color:#ffffff;">
                <div style="font-size:12px;letter-spacing:.08em;text-transform:uppercase;opacity:.85;">ES Gebäudeservice</div>
                <div style="font-size:20px;font-weight:700;margin-top:4px;">Neue Kontaktanfrage</div>
              </td>
            </tr>
            <tr>
              <td style="padding:24px;">
                <table role="presentation" width="100%" cellpadding="0" cellspacing="0">
                  ${tableRows}
                </table>
                <h3 style="margin:24px 0 8px;font-size:14px;color:#475569;text-transform:uppercase;letter-spacing:.06em;">Nachricht</h3>
                <div style="padding:14px 16px;background:#f8fafc;border:1px solid #e2e8f0;border-radius:8px;font-size:14px;line-height:1.55;color:#0f172a;">${nl2br(data.description)}</div>
              </td>
            </tr>
            <tr>
              <td style="padding:16px 24px 24px;border-top:1px solid #e2e8f0;color:#64748b;font-size:11px;line-height:1.55;">
                <strong>Metadaten</strong><br />
                IP: ${escapeHtml(meta.ip)}<br />
                User-Agent: ${escapeHtml(meta.userAgent)}<br />
                Eingegangen: ${escapeHtml(new Date().toISOString())}
              </td>
            </tr>
          </table>
        </td>
      </tr>
    </table>
  </body>
</html>`;
}

function flattenErrors(error: import("zod").ZodError<ContactInput>): ContactFieldErrors {
  const flat = error.flatten().fieldErrors as Record<string, string[] | undefined>;
  const result: ContactFieldErrors = {};
  for (const [key, value] of Object.entries(flat)) {
    if (value && value.length > 0) {
      result[key as keyof ContactInput] = value;
    }
  }
  return result;
}

function pickValuesForEcho(formData: FormData): ContactState["values"] {
  return {
    firstName: String(formData.get("firstName") ?? ""),
    lastName: String(formData.get("lastName") ?? ""),
    company: String(formData.get("company") ?? ""),
    email: String(formData.get("email") ?? ""),
    phone: String(formData.get("phone") ?? ""),
    postalCode: String(formData.get("postalCode") ?? ""),
    city: String(formData.get("city") ?? ""),
    federalState: String(formData.get("federalState") ?? ""),
    services: formData.getAll("services").map(String),
    description: String(formData.get("description") ?? ""),
    privacyConsent: formData.get("privacyConsent") === "on" || formData.get("privacyConsent") === "true",
  };
}

export async function sendContact(_prev: ContactState, formData: FormData): Promise<ContactState> {
  const headerList = await headers();
  const ip = (headerList.get("x-forwarded-for") ?? "").split(",")[0]?.trim() || "unknown";
  const userAgent = headerList.get("user-agent") ?? "unknown";

  if (!rateLimit(ip)) {
    return {
      ok: false,
      message: "Zu viele Anfragen. Bitte versuchen Sie es in einer Minute erneut.",
    };
  }

  const raw = {
    firstName: formData.get("firstName"),
    lastName: formData.get("lastName"),
    company: formData.get("company"),
    email: formData.get("email"),
    phone: formData.get("phone"),
    postalCode: formData.get("postalCode"),
    city: formData.get("city"),
    federalState: formData.get("federalState"),
    services: formData.getAll("services"),
    description: formData.get("description"),
    privacyConsent: formData.get("privacyConsent"),
    website: formData.get("website") ?? "",
  };

  const parsed = contactSchema.safeParse(raw);
  if (!parsed.success) {
    return {
      ok: false,
      errors: flattenErrors(parsed.error),
      values: pickValuesForEcho(formData),
      message: "Bitte korrigieren Sie die markierten Felder.",
    };
  }

  // Honeypot getriggert: leise erfolgreich antworten, NICHT senden.
  if (parsed.data.website) {
    return { ok: true, ticketId: buildTicketId(), message: "Danke für Ihre Anfrage." };
  }

  const ticketId = buildTicketId();

  try {
    const fullName = `${parsed.data.firstName} ${parsed.data.lastName}`.trim();
    await sendMailViaGraph({
      subject: `[${ticketId}] Neue Kontaktanfrage von ${fullName}`,
      replyTo: parsed.data.email,
      html: buildEmailHtml(parsed.data, ticketId, { ip, userAgent }),
    });

    return {
      ok: true,
      ticketId,
      message: "Vielen Dank — Ihre Anfrage ist bei uns eingegangen.",
    };
  } catch (error) {
    console.error("[send-contact] Graph sendMail error", error);
    return {
      ok: false,
      values: pickValuesForEcho(formData),
      message:
        "Versand fehlgeschlagen. Bitte versuchen Sie es später erneut oder rufen Sie uns an.",
    };
  }
}
