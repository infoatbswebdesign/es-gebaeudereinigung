import "isomorphic-fetch";
import { ConfidentialClientApplication, type AuthenticationResult } from "@azure/msal-node";
import { Client } from "@microsoft/microsoft-graph-client";

let cachedMsal: ConfidentialClientApplication | null = null;
let cachedToken: { value: string; expiresOn: number } | null = null;

function getMsal(): ConfidentialClientApplication {
  if (cachedMsal) return cachedMsal;

  const tenantId = process.env.AZURE_TENANT_ID;
  const clientId = process.env.AZURE_CLIENT_ID;
  const clientSecret = process.env.AZURE_CLIENT_SECRET;

  if (!tenantId || !clientId || !clientSecret) {
    throw new Error(
      "Microsoft Graph Konfiguration fehlt: AZURE_TENANT_ID / AZURE_CLIENT_ID / AZURE_CLIENT_SECRET muessen gesetzt sein.",
    );
  }

  cachedMsal = new ConfidentialClientApplication({
    auth: {
      clientId,
      authority: `https://login.microsoftonline.com/${tenantId}`,
      clientSecret,
    },
  });

  return cachedMsal;
}

async function getAccessToken(): Promise<string> {
  // 60s Sicherheitsfenster, damit ein Token nicht waehrend des Requests expired
  if (cachedToken && cachedToken.expiresOn - 60_000 > Date.now()) {
    return cachedToken.value;
  }

  const result: AuthenticationResult | null = await getMsal().acquireTokenByClientCredential({
    scopes: ["https://graph.microsoft.com/.default"],
  });

  if (!result?.accessToken) {
    throw new Error("Microsoft Graph Token konnte nicht bezogen werden.");
  }

  cachedToken = {
    value: result.accessToken,
    expiresOn: result.expiresOn ? result.expiresOn.getTime() : Date.now() + 50 * 60_000,
  };

  return cachedToken.value;
}

function getGraphClient(token: string): Client {
  return Client.init({
    authProvider: (done) => done(null, token),
  });
}

type Recipient = string | string[];

type MailInput = {
  subject: string;
  html: string;
  text?: string;
  to?: Recipient;
  replyTo?: string;
};

function toRecipientList(value: Recipient | undefined): { emailAddress: { address: string } }[] {
  if (!value) return [];
  const list = Array.isArray(value) ? value : [value];
  return list
    .map((address) => address.trim())
    .filter(Boolean)
    .map((address) => ({ emailAddress: { address } }));
}

export async function sendMailViaGraph({ subject, html, text, to, replyTo }: MailInput): Promise<void> {
  const sender = process.env.GRAPH_SENDER_MAILBOX;
  const fallbackRecipient = process.env.CONTACT_RECIPIENT;

  if (!sender) {
    throw new Error("GRAPH_SENDER_MAILBOX ist nicht gesetzt.");
  }

  const recipients = toRecipientList(to ?? fallbackRecipient);
  if (recipients.length === 0) {
    throw new Error("Kein Empfaenger angegeben (CONTACT_RECIPIENT fehlt).");
  }

  const token = await getAccessToken();
  const client = getGraphClient(token);

  await client.api(`/users/${encodeURIComponent(sender)}/sendMail`).post({
    message: {
      subject,
      body: { contentType: "HTML", content: html },
      toRecipients: recipients,
      replyTo: replyTo ? [{ emailAddress: { address: replyTo } }] : undefined,
      // Plain-Text-Alternative ueber internetMessageHeaders ist nicht direkt
      // moeglich; HTML enthaelt bereits semantische Auszeichnung.
      ...(text
        ? {
            internetMessageHeaders: [
              { name: "X-Mailer", value: "ES-Gebaeudeservice-Kontaktformular" },
            ],
          }
        : {}),
    },
    saveToSentItems: true,
  });
}
