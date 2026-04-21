import { z } from "zod";

const SERVICE_OPTIONS = [
  "Kehrwochen",
  "Hausmeisterservice",
  "Winterdienst",
  "Unterhaltsreinigung",
  "Praxis- & Büroreinigung",
  "Grundreinigung",
  "Glasreinigung",
  "Baugrobreinigung",
  "Grünanlagenflächen",
  "Entrümpelung",
] as const;

export const CONTACT_SERVICE_OPTIONS = SERVICE_OPTIONS;

/**
 * Optionale Strings: akzeptiert undefined, null, leeren String oder Whitespace
 * und liefert immer undefined oder einen getrimmten String. Damit blockiert
 * Zod nicht, wenn das Feld im FormData komplett fehlt oder leer ist.
 */
const optionalTrimmedString = (max = 200) =>
  z.preprocess((value) => {
    if (value === undefined || value === null) return undefined;
    if (typeof value !== "string") return undefined;
    const trimmed = value.trim();
    return trimmed.length > 0 ? trimmed : undefined;
  }, z.string().max(max).optional());

const optionalPhone = z.preprocess(
  (value) => {
    if (value === undefined || value === null) return undefined;
    if (typeof value !== "string") return undefined;
    const trimmed = value.trim();
    return trimmed.length > 0 ? trimmed : undefined;
  },
  z
    .string()
    .max(30, "Telefonnummer ist zu lang.")
    .regex(/^[+()\-.\s0-9]{6,25}$/u, "Bitte geben Sie eine gültige Telefonnummer an.")
    .optional(),
);

const honeypot = z.preprocess(
  (value) => (value === undefined || value === null ? "" : value),
  z.string().max(0, "Spam erkannt"),
);

export const contactSchema = z
  .object({
    firstName: z
      .string({ message: "Bitte geben Sie Ihren Vornamen an." })
      .trim()
      .min(2, "Bitte geben Sie Ihren Vornamen an.")
      .max(80, "Vorname ist zu lang."),
    lastName: z
      .string({ message: "Bitte geben Sie Ihren Nachnamen an." })
      .trim()
      .min(2, "Bitte geben Sie Ihren Nachnamen an.")
      .max(80, "Nachname ist zu lang."),
    company: optionalTrimmedString(120),
    email: z
      .string({ message: "Bitte geben Sie eine gültige E-Mail-Adresse an." })
      .trim()
      .toLowerCase()
      .email("Bitte geben Sie eine gültige E-Mail-Adresse an."),
    phone: optionalPhone,
    postalCode: z
      .string({ message: "Bitte geben Sie die Postleitzahl an." })
      .trim()
      .regex(/^\d{5}$/u, "Bitte geben Sie eine gültige 5-stellige Postleitzahl an."),
    city: z
      .string({ message: "Bitte geben Sie den Ort an." })
      .trim()
      .min(1, "Bitte geben Sie den Ort an.")
      .max(120),
    federalState: optionalTrimmedString(120),
    services: z.preprocess(
      (value) => {
        if (Array.isArray(value)) return value;
        if (typeof value === "string" && value.length > 0) return [value];
        return [];
      },
      z
        .array(z.enum(SERVICE_OPTIONS, { message: "Unbekannte Leistung." }))
        .min(1, "Bitte wählen Sie mindestens eine Leistung aus."),
    ),
    description: z
      .string({ message: "Bitte beschreiben Sie kurz das Objekt." })
      .trim()
      .min(10, "Bitte beschreiben Sie das Objekt mit mindestens 10 Zeichen.")
      .max(1500, "Bitte kürzen Sie die Beschreibung auf 1500 Zeichen."),
    privacyConsent: z.preprocess(
      (value) => value === true || value === "on" || value === "true",
      z.literal(true, { message: "Bitte stimmen Sie der Verarbeitung Ihrer Angaben zu." }),
    ),
    // Honeypot: muss leer bleiben
    website: honeypot,
  })
  .strip();

export type ContactInput = z.infer<typeof contactSchema>;

export type ContactFieldErrors = Partial<Record<keyof ContactInput, string[]>>;

export type ContactState = {
  ok: boolean;
  message?: string;
  ticketId?: string;
  errors?: ContactFieldErrors;
  /** Echo der Felder, damit das Formular nach Server-Validation nichts verliert. */
  values?: {
    firstName?: string;
    lastName?: string;
    company?: string;
    email?: string;
    phone?: string;
    postalCode?: string;
    city?: string;
    federalState?: string;
    services?: string[];
    description?: string;
    privacyConsent?: boolean;
  };
};
