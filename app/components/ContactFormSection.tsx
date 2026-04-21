"use client";

import Image, { type StaticImageData } from "next/image";
import Link from "next/link";
import {
  FormEvent,
  startTransition,
  useActionState,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import {
  CONTACT_ADDRESS_LINES,
  CONTACT_EMAIL,
  CONTACT_PHONE_DISPLAY,
  CONTACT_PHONE_TEL,
} from "@/app/contact";
import { sendContact } from "@/app/actions/send-contact";
import { BTN_PRIMARY_SUBMIT } from "@/app/components/buttonStyles";
import type { ContactState } from "@/lib/contact-schema";
import { useToastStore } from "@/lib/toast-store";
import {
  baugrobreinigung,
  entruempelung,
  gebaeudeservice,
  glasreinigung,
  gruenanlageflaechen,
  grundreinigung,
  kehrwochen,
  reinigungsservice,
  unterhaltsreinigung,
  winterdienst,
} from "@/app/assets/images";

const INITIAL_ACTION_STATE: ContactState = { ok: false };

type ErrorMap = Partial<Record<FieldName, string>>;

type FormDataState = {
  services: string[];
  postalCode: string;
  city: string;
  federalState: string;
  company: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  description: string;
  privacyConsent: boolean;
  hpWebsite: string;
};

type FieldName =
  | "services"
  | "postalCode"
  | "firstName"
  | "lastName"
  | "email"
  | "phone"
  | "description"
  | "privacyConsent";

const MAX_DESCRIPTION_LENGTH = 1500;
const MIN_DESCRIPTION_LENGTH = 10;

const DEFAULT_FORM_DATA: FormDataState = {
  services: [],
  postalCode: "",
  city: "",
  federalState: "",
  company: "",
  firstName: "",
  lastName: "",
  email: "",
  phone: "",
  description: "",
  privacyConsent: false,
  hpWebsite: "",
};

/**
 * Einheitliche Hoehe (h-10), Ecken (rounded-lg), Rand – Inputs im Kontaktformular.
 *
 * Wichtig: `text-base md:text-sm` (= 16px Mobile / 14px Desktop).
 * iOS Safari + iOS Chrome zoomen beim Fokus automatisch in jedes Input,
 * dessen effektive `font-size` < 16px ist. Mit 16px auf Mobile wird genau
 * dieser ungewollte Zoom verhindert, ohne das User-Pinch-Zoom global zu
 * deaktivieren (das waere ein A11y-Antipattern). Auf md+ schalten wir
 * wieder auf das kompaktere 14px-Layout um.
 */
const CONTACT_FIELD_CONTROL_CLASS =
  "box-border h-10 w-full min-w-0 rounded-lg border border-slate-200 bg-white px-3 text-base text-slate-900 outline-none transition placeholder:text-slate-500 focus:border-slate-200 focus:ring-0 focus-visible:outline-none disabled:cursor-not-allowed disabled:bg-slate-100 md:text-sm";

const CONTACT_SELECT_BASE_CLASS =
  "contact-form-select box-border h-10 w-full min-w-0 appearance-none rounded-lg border border-slate-200 bg-white px-3 pr-9 text-base text-slate-900 outline-none transition focus:border-slate-200 focus:ring-0 focus-visible:outline-none disabled:cursor-not-allowed disabled:bg-slate-100 md:text-sm";

const CONTACT_TEXTAREA_FIELD_CLASS =
  "mt-1 min-h-14 w-full resize-none rounded-lg border border-slate-200 bg-white px-3 py-2 text-base text-slate-900 outline-none transition placeholder:text-slate-500 focus:border-slate-200 focus:ring-0 focus-visible:outline-none disabled:cursor-not-allowed disabled:bg-slate-100 md:min-h-16 md:text-sm";

type OpenPlzLocality = {
  name: string;
  postalCode: string;
  federalState?: { name?: string };
};

const DOMAIN_TYPOS: Record<string, string> = {
  "gmial.com": "gmail.com",
  "gmil.com": "gmail.com",
  "gmai.com": "gmail.com",
  "hotnail.com": "hotmail.com",
  "outlok.com": "outlook.com",
};

const FIELD_ORDER: FieldName[] = [
  "firstName",
  "lastName",
  "email",
  "phone",
  "postalCode",
  "services",
  "description",
  "privacyConsent",
];

/**
 * Alle 10 Leistungen mit zugeordnetem Bild.
 * Die Bilder sind die aktuell vorhandenen Assets aus /public –
 * fuer einzelne Eintraege koennten spaeter passendere Motive ergaenzt werden.
 *
 * `value` ist der technische Wert, der an den Server geht (Zod-Enum in
 * lib/contact-schema.ts) und in der Email landet. NIE veraendern.
 * `label` enthaelt weiche Trennstriche (U+00AD) an den Kompositum-Fugen.
 * Diese Zeichen sind unsichtbar, solange das Wort in die Zeile passt – muss
 * der Browser doch umbrechen, trennt er garantiert an der deutschen
 * Morphem-Grenze (z. B. "Hausmeister-service" statt "Hausmeisterse-rvice").
 */
const SERVICE_OPTIONS: Array<{
  value: string;
  label: string;
  image: StaticImageData;
}> = [
  { value: "Kehrwochen", label: "Kehr\u00ADwochen", image: kehrwochen },
  {
    value: "Hausmeisterservice",
    label: "Hausmeister\u00ADservice",
    image: gebaeudeservice,
  },
  { value: "Winterdienst", label: "Winter\u00ADdienst", image: winterdienst },
  {
    value: "Unterhaltsreinigung",
    label: "Unterhalts\u00ADreinigung",
    image: unterhaltsreinigung,
  },
  {
    value: "Praxis- & Büroreinigung",
    label: "Praxis- & Büro\u00ADreinigung",
    image: reinigungsservice,
  },
  {
    value: "Grundreinigung",
    label: "Grund\u00ADreinigung",
    image: grundreinigung,
  },
  {
    value: "Glasreinigung",
    label: "Glas\u00ADreinigung",
    image: glasreinigung,
  },
  {
    value: "Baugrobreinigung",
    label: "Bau\u00ADgrob\u00ADreinigung",
    image: baugrobreinigung,
  },
  {
    value: "Grünanlagenflächen",
    label: "Grün\u00ADanlagen\u00ADflächen",
    image: gruenanlageflaechen,
  },
  {
    value: "Entrümpelung",
    label: "Ent\u00ADrümpelung",
    image: entruempelung,
  },
];

function clsx(...classes: Array<string | false | undefined>) {
  return classes.filter(Boolean).join(" ");
}

function pushAnalyticsEvent(name: string, params: Record<string, string | number | boolean>) {
  if (typeof window === "undefined") return;
  (window as Window & { dataLayer?: Array<Record<string, unknown>> }).dataLayer = (
    window as Window & { dataLayer?: Array<Record<string, unknown>> }
  ).dataLayer || [];
  (window as Window & { dataLayer?: Array<Record<string, unknown>> }).dataLayer?.push({
    event: name,
    ...params,
  });
}

function validateField(data: FormDataState, field: FieldName): string {
  switch (field) {
    case "services":
      return data.services.length > 0
        ? ""
        : "Bitte wählen Sie mindestens eine Leistung aus.";
    case "postalCode":
      return data.postalCode.trim() && data.city.trim()
        ? ""
        : "Bitte geben Sie PLZ und Ort an.";
    case "firstName":
      return data.firstName.trim().length >= 2
        ? ""
        : "Bitte geben Sie Ihren Vornamen an.";
    case "lastName":
      return data.lastName.trim().length >= 2
        ? ""
        : "Bitte geben Sie Ihren Nachnamen an.";
    case "email": {
      const email = data.email.trim();
      const isValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
      return isValid
        ? ""
        : "Bitte geben Sie eine gültige E-Mail-Adresse an (z. B. name@unternehmen.de).";
    }
    case "phone":
      if (!data.phone.trim()) return "";
      return /^[+()\-.\s0-9]{6,25}$/.test(data.phone.trim())
        ? ""
        : "Bitte geben Sie eine gültige Telefonnummer an.";
    case "description": {
      const value = data.description.trim();
      if (value.length === 0) {
        return "Bitte beschreiben Sie kurz das Objekt (z. B. Treppenhaus mit 4 Stockwerken).";
      }
      if (value.length < MIN_DESCRIPTION_LENGTH) {
        return `Bitte beschreiben Sie das Objekt mit mindestens ${MIN_DESCRIPTION_LENGTH} Zeichen.`;
      }
      return "";
    }
    case "privacyConsent":
      return data.privacyConsent ? "" : "Bitte stimmen Sie der Verarbeitung Ihrer Angaben zu.";
    default:
      return "";
  }
}

function getEmailTypoHint(email: string): string {
  const parts = email.toLowerCase().trim().split("@");
  if (parts.length !== 2) return "";
  const candidate = DOMAIN_TYPOS[parts[1]];
  return candidate ? `Meinen Sie ${parts[0]}@${candidate}?` : "";
}

function Label({
  htmlFor,
  text,
  required = false,
  optional = false,
}: {
  htmlFor: string;
  text: string;
  required?: boolean;
  optional?: boolean;
}) {
  return (
    <label htmlFor={htmlFor} className="block text-sm font-semibold text-white">
      {text} {required && <span aria-hidden>*</span>}
      {optional && <span className="font-normal text-white/80">(opt.)</span>}
    </label>
  );
}

/**
 * Reservierter, hoehengleicher Slot direkt unter Eingabefeldern.
 *
 * - `min-h-[1.125rem]` haelt den Platz frei, auch wenn keine Meldung
 *   vorliegt → kein Layout-Shift, wenn Errors / Hints erscheinen.
 * - Meldungen werden als Pille gerendert (`bg-red-600` / `bg-amber-500`),
 *   damit sie auf dem semitransparenten Glas-Hintergrund sofort lesbar
 *   sind (vorher war `text-red-100` quasi unsichtbar).
 */
function FieldMessage({
  id,
  message,
  hint,
}: {
  id?: string;
  message?: string;
  hint?: string;
}) {
  return (
    <div className="mt-1 flex min-h-4 flex-wrap gap-x-2 gap-y-0.5">
      {hint ? (
        <span className="inline-flex max-w-full items-center rounded-sm bg-amber-500/95 px-1.5 py-0.5 text-[11px] font-semibold leading-none text-white shadow-sm shadow-black/20">
          {hint}
        </span>
      ) : null}
      {message ? (
        <span
          id={id}
          role="alert"
          className="inline-flex max-w-full items-center rounded-sm bg-red-600/95 px-1.5 py-0.5 text-[11px] font-semibold leading-none text-white shadow-sm shadow-black/20"
        >
          {message}
        </span>
      ) : null}
    </div>
  );
}

/** Roter Border + leichter Ring fuer Inputs mit Validierungsfehler. */
function fieldClass(hasError?: boolean) {
  return clsx(
    "mt-1",
    CONTACT_FIELD_CONTROL_CLASS,
    hasError && "border-red-500 ring-1 ring-red-500/40 focus:border-red-500",
  );
}

/**
 * Sidebar nur fuer Desktop (lg+) neben dem Formular.
 *
 * Ziel: emotional abholen, Hemmschwelle senken, Vertrauen aufbauen.
 * Keine reine Info-Liste mehr, sondern eine geschlossene Erzaehlung
 * (Versprechen → Beweise → Prozess → Direktkontakt).
 *
 * Aufbau (oben → unten):
 * 1. Promise-Hero: konkretes Antwort-Versprechen ("24h").
 * 2. Trust-Liste mit Check-Icons – fokussiert auf Nutzen statt Features.
 * 3. Mini-Prozess (3 Schritte) – nimmt Unsicherheit ("Was passiert danach?").
 * 4. Direktkontakt-Karte – fuer Nutzer, die lieber telefonieren.
 *
 * Hoehe: gesamte Sidebar passt in die verfuegbare Restspalte (lg-Layout
 * teilt 1.25fr / 1fr). Wir vermeiden Overflow ueber `overflow-hidden`
 * am Wrapper + kompakte Paddings.
 */
function ContactSidebar() {
  const TRUST_POINTS = [
    "Kostenloses, transparentes Angebot",
    "Persönliche Besichtigung vor Ort",
    "Feste Teams – keine Subunternehmer",
    "Über 200 betreute Objekte in der Region",
  ];

  const PROCESS_STEPS = [
    { title: "Anfrage senden", text: "In 2 Minuten ausgefüllt." },
    { title: "Wir besichtigen", text: "Termin nach Ihrem Kalender." },
    { title: "Faires Angebot", text: "Schriftlich und unverbindlich." },
  ];

  return (
    <aside className="flex min-h-0 flex-1 flex-col gap-3 text-white">
      <div className="flex min-h-0 flex-1 flex-col gap-4 overflow-hidden rounded-2xl bg-white/15 p-5 backdrop-blur-xl ring-1 ring-white/15">
        <div>
          <span className="inline-flex items-center gap-1.5 rounded-full bg-white/20 px-2.5 py-1 text-[11px] font-semibold uppercase tracking-wider text-white">
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-300" aria-hidden />
            Kurze Antwortzeit
          </span>
          <h3 className="mt-3 text-xl font-bold leading-tight">
            Persönlich. Unverbindlich. Aus Esslingen.
          </h3>
          <p className="mt-1.5 text-sm leading-relaxed text-white/85">
            Schreiben Sie uns Ihr Anliegen – wir melden uns mit einem
            transparenten Angebot zurück. Kein Außendienst, keine Vertrags&shy;tricks.
          </p>
        </div>

        <div className="h-px w-full bg-white/15" aria-hidden />

        <div>
          <p className="text-xs font-semibold uppercase tracking-wider text-white/70">
            Was Sie bekommen
          </p>
          <ul className="mt-2 space-y-1.5 text-sm leading-snug text-white/95">
            {TRUST_POINTS.map((point) => (
              <li key={point} className="flex items-start gap-2">
                <svg
                  className="mt-0.5 h-4 w-4 shrink-0 text-emerald-300"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                  aria-hidden
                >
                  <path
                    fillRule="evenodd"
                    d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 111.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                    clipRule="evenodd"
                  />
                </svg>
                <span>{point}</span>
              </li>
            ))}
          </ul>
        </div>

        <div className="h-px w-full bg-white/15" aria-hidden />

        <div>
          <p className="text-xs font-semibold uppercase tracking-wider text-white/70">
            So geht es weiter
          </p>
          <ol className="mt-2 space-y-2">
            {PROCESS_STEPS.map((step, index) => (
              <li key={step.title} className="flex items-start gap-3">
                <span
                  aria-hidden
                  className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-white text-xs font-bold text-[#2A4961]"
                >
                  {index + 1}
                </span>
                <div className="min-w-0">
                  <p className="text-sm font-semibold leading-tight text-white">
                    {step.title}
                  </p>
                  <p className="text-xs leading-snug text-white/75">
                    {step.text}
                  </p>
                </div>
              </li>
            ))}
          </ol>
        </div>
      </div>

      <div className="rounded-2xl bg-white/15 p-4 text-white backdrop-blur-xl ring-1 ring-white/15">
        <p className="text-xs font-semibold uppercase tracking-wider text-white/70">
          Lieber direkt sprechen?
        </p>
        <div className="mt-2 grid grid-cols-1 gap-1.5 text-sm">
          <a
            href={`tel:${CONTACT_PHONE_TEL}`}
            onClick={() => pushAnalyticsEvent("call_click", {})}
            className="group inline-flex items-center gap-2 font-semibold text-white underline-offset-4 hover:underline"
          >
            <svg
              className="h-4 w-4 text-white/80 transition-colors group-hover:text-white"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth={2}
              aria-hidden
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M3 5a2 2 0 012-2h2.28a1 1 0 01.95.68l1.5 4.5a1 1 0 01-.5 1.21l-1.86.93a11 11 0 005.4 5.4l.93-1.86a1 1 0 011.21-.5l4.5 1.5a1 1 0 01.68.95V19a2 2 0 01-2 2h-1C9.72 21 3 14.28 3 6V5z"
              />
            </svg>
            {CONTACT_PHONE_DISPLAY}
          </a>
          <a
            href={`mailto:${CONTACT_EMAIL}`}
            className="group inline-flex items-center gap-2 break-all text-white/95 underline-offset-4 hover:underline"
          >
            <svg
              className="h-4 w-4 shrink-0 text-white/80 transition-colors group-hover:text-white"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth={2}
              aria-hidden
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M3 7a2 2 0 012-2h14a2 2 0 012 2v10a2 2 0 01-2 2H5a2 2 0 01-2-2V7zm0 0l9 6 9-6"
              />
            </svg>
            {CONTACT_EMAIL}
          </a>
        </div>
        <p className="mt-3 text-[11px] leading-snug text-white/65">
          {CONTACT_ADDRESS_LINES[0]} · Hauptstr. 111, 73730 Esslingen
        </p>
      </div>
    </aside>
  );
}

export default function ContactFormSection() {
  const [data, setData] = useState<FormDataState>(DEFAULT_FORM_DATA);
  const [errors, setErrors] = useState<ErrorMap>({});
  const [actionState, runAction, isPending] = useActionState(sendContact, INITIAL_ACTION_STATE);
  const [isSuccess, setIsSuccess] = useState(false);
  const [ticketId, setTicketId] = useState("");
  const [started, setStarted] = useState(false);
  const lastHandledActionRef = useRef<ContactState | null>(null);
  const [isPostalLookupLoading, setIsPostalLookupLoading] = useState(false);
  const [postalLookupError, setPostalLookupError] = useState("");
  const [cityFieldMode, setCityFieldMode] = useState<"text" | "readonly" | "select">("text");
  const [cityOptions, setCityOptions] = useState<OpenPlzLocality[]>([]);
  const [citySearchOptions, setCitySearchOptions] = useState<OpenPlzLocality[]>([]);
  const [isCitySearchLoading, setIsCitySearchLoading] = useState(false);
  const showToast = useToastStore((state) => state.show);
  const clearToasts = useToastStore((state) => state.clear);
  const successHeadingRef = useRef<HTMLHeadingElement | null>(null);
  const citySearchDebounceRef = useRef<number | null>(null);

  const showErrorToast = (message: string) => {
    showToast(message, { variant: "error" });
  };

  useEffect(() => {
    pushAnalyticsEvent("form_view", { form_type: "single_step" });
  }, []);

  useEffect(() => {
    if (isSuccess) {
      successHeadingRef.current?.focus();
    }
  }, [isSuccess]);

  useEffect(() => {
    if (actionState === INITIAL_ACTION_STATE) return;
    if (lastHandledActionRef.current === actionState) return;
    lastHandledActionRef.current = actionState;

    if (actionState.ok) {
      setErrors({});
      clearToasts();
      setTicketId(actionState.ticketId ?? `ES-${Date.now().toString().slice(-7)}`);
      setIsSuccess(true);
      pushAnalyticsEvent("form_submit_success", {
        form_type: "single_step",
        services_count: data.services.length,
      });
      return;
    }

    let serverErrorCount = 0;
    if (actionState.errors) {
      const serverErrors: ErrorMap = {};
      const e = actionState.errors;
      if (e.firstName?.[0]) serverErrors.firstName = e.firstName[0];
      if (e.lastName?.[0]) serverErrors.lastName = e.lastName[0];
      if (e.email?.[0]) serverErrors.email = e.email[0];
      if (e.phone?.[0]) serverErrors.phone = e.phone[0];
      if (e.postalCode?.[0] || e.city?.[0]) {
        serverErrors.postalCode = e.postalCode?.[0] ?? e.city?.[0] ?? "Bitte PLZ und Ort prüfen.";
      }
      if (e.services?.[0]) serverErrors.services = e.services[0];
      if (e.description?.[0]) serverErrors.description = e.description[0];
      if (e.privacyConsent?.[0]) serverErrors.privacyConsent = e.privacyConsent[0];
      setErrors(serverErrors);
      serverErrorCount = Object.keys(serverErrors).length;
    }

    if (actionState.message && !actionState.ok) {
      showErrorToast(actionState.message);
    } else if (serverErrorCount > 0) {
      showErrorToast(
        `Bitte prüfen Sie die markierten Felder (${serverErrorCount}).`,
      );
    }
    pushAnalyticsEvent("form_submit_fail", { form_type: "single_step" });
  }, [actionState, data.services.length]);

  useEffect(() => {
    const postalCodeDigits = data.postalCode.replace(/\D/g, "");
    if (postalCodeDigits !== data.postalCode) {
      setData((prev) => ({ ...prev, postalCode: postalCodeDigits }));
      return;
    }

    if (postalCodeDigits.length !== 5) {
      setCityFieldMode("text");
      setCityOptions([]);
      setPostalLookupError("");
      return;
    }

    const controller = new AbortController();
    async function lookupByPostalCode() {
      setIsPostalLookupLoading(true);
      setPostalLookupError("");
      try {
        const response = await fetch(
          `https://openplzapi.org/de/Localities?postalCode=${encodeURIComponent(postalCodeDigits)}`,
          { signal: controller.signal },
        );
        if (!response.ok) {
          throw new Error(`HTTP ${response.status}`);
        }

        const result = (await response.json()) as OpenPlzLocality[];
        if (result.length === 0) {
          setCityFieldMode("text");
          setCityOptions([]);
          setPostalLookupError("PLZ nicht gefunden.");
          return;
        }

        setPostalLookupError("");
        if (result.length === 1) {
          const only = result[0];
          setCityFieldMode("readonly");
          setCityOptions(result);
          setData((prev) => ({
            ...prev,
            city: only.name,
            federalState: only.federalState?.name || "",
          }));
          return;
        }

        setCityFieldMode("select");
        setCityOptions(result);
        setData((prev) => ({
          ...prev,
          city: "",
          federalState: "",
        }));
      } catch {
        setCityFieldMode("text");
        setCityOptions([]);
      } finally {
        setIsPostalLookupLoading(false);
      }
    }

    void lookupByPostalCode();
    return () => controller.abort();
  }, [data.postalCode]);

  useEffect(() => {
    if (cityFieldMode !== "text") {
      setCitySearchOptions([]);
      return;
    }

    if (data.postalCode.length === 5) {
      setCitySearchOptions([]);
      return;
    }

    const query = data.city.trim();
    if (query.length < 2) {
      setCitySearchOptions([]);
      return;
    }

    if (citySearchDebounceRef.current) {
      window.clearTimeout(citySearchDebounceRef.current);
    }

    citySearchDebounceRef.current = window.setTimeout(() => {
      const controller = new AbortController();
      async function lookupByCityName() {
        setIsCitySearchLoading(true);
        try {
          const response = await fetch(
            `https://openplzapi.org/de/Localities?name=${encodeURIComponent(`^${query}`)}&page=1&pageSize=10`,
            { signal: controller.signal },
          );
          if (!response.ok) {
            throw new Error(`HTTP ${response.status}`);
          }
          const result = (await response.json()) as OpenPlzLocality[];
          setCitySearchOptions(result);
        } catch {
          setCitySearchOptions([]);
        } finally {
          setIsCitySearchLoading(false);
        }
      }
      void lookupByCityName();
    }, 300);

    return () => {
      if (citySearchDebounceRef.current) {
        window.clearTimeout(citySearchDebounceRef.current);
      }
    };
  }, [data.city, cityFieldMode]);

  const emailTypoHint = useMemo(() => getEmailTypoHint(data.email), [data.email]);
  const remainingChars = MAX_DESCRIPTION_LENGTH - data.description.length;

  function updateField<K extends keyof FormDataState>(field: K, value: FormDataState[K]) {
    if (!started) {
      setStarted(true);
      pushAnalyticsEvent("form_start", { form_type: "single_step" });
    }
    setData((prev) => {
      const next = { ...prev, [field]: value };

      setErrors((currentErrors) => {
        const updatedErrors = { ...currentErrors };
        const revalidate = (name: FieldName) => {
          if (!updatedErrors[name]) return;
          const message = validateField(next, name);
          if (!message) {
            delete updatedErrors[name];
          }
        };

        if (field === "postalCode" || field === "city") {
          revalidate("postalCode");
        } else if (field === "firstName") {
          revalidate("firstName");
        } else if (field === "lastName") {
          revalidate("lastName");
        } else if (field === "email") {
          revalidate("email");
        } else if (field === "phone") {
          revalidate("phone");
        } else if (field === "description") {
          revalidate("description");
        } else if (field === "privacyConsent") {
          revalidate("privacyConsent");
        } else if (field === "services") {
          revalidate("services");
        }

        return updatedErrors;
      });

      return next;
    });
  }

  function validateAndStore(field: FieldName): string {
    const message = validateField(data, field);
    setErrors((prev) => ({ ...prev, [field]: message || undefined }));
    if (message) {
      pushAnalyticsEvent("field_error", { field_name: field });
    }
    return message;
  }

  function toggleService(value: string) {
    const next = data.services.includes(value)
      ? data.services.filter((item) => item !== value)
      : [...data.services, value];
    updateField("services", next);
  }

  function validateAllFields(): ErrorMap {
    const nextErrors: ErrorMap = {};
    for (const field of FIELD_ORDER) {
      const message = validateField(data, field);
      if (message) nextErrors[field] = message;
    }
    return nextErrors;
  }

  function buildFormData(): FormData {
    const fd = new FormData();
    fd.set("firstName", data.firstName.trim());
    fd.set("lastName", data.lastName.trim());
    if (data.company.trim()) fd.set("company", data.company.trim());
    fd.set("email", data.email.trim());
    if (data.phone.trim()) fd.set("phone", data.phone.trim());
    fd.set("postalCode", data.postalCode.trim());
    fd.set("city", data.city.trim());
    if (data.federalState.trim()) fd.set("federalState", data.federalState.trim());
    for (const service of data.services) fd.append("services", service);
    fd.set("description", data.description.trim());
    fd.set("privacyConsent", data.privacyConsent ? "on" : "");
    fd.set("website", data.hpWebsite);
    return fd;
  }

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    pushAnalyticsEvent("form_submit_attempt", { form_type: "single_step" });

    const nextErrors = validateAllFields();
    setErrors(nextErrors);
    const errorCount = Object.keys(nextErrors).length;
    if (errorCount > 0) {
      showErrorToast(`Bitte prüfen Sie die markierten Felder (${errorCount}).`);
      const firstField = FIELD_ORDER.find((field) => nextErrors[field]);
      if (firstField) {
        const target = document.getElementById(`contact-${firstField}`);
        target?.scrollIntoView({ behavior: "smooth", block: "center" });
      }
      return;
    }

    const formData = buildFormData();
    startTransition(() => {
      runAction(formData);
    });
  }

  const submitLabel = "Angebot anfordern";

  return (
    <section
      id="kontaktformular"
      className="contact-form-section relative flex h-svh flex-col overflow-hidden px-4 py-3 md:px-10 md:py-6 lg:px-14 lg:py-7"
      aria-labelledby="contact-heading"
    >
      <div className="mx-auto flex min-h-0 w-full max-w-7xl flex-1 flex-col">
        <div className="flex shrink-0 flex-col gap-0.5 md:flex-row md:items-end md:justify-between md:gap-6">
          <div>
            <h2
              id="contact-heading"
              className="text-base font-bold leading-tight text-white md:text-xl lg:text-2xl"
            >
              Angebot anfordern
            </h2>
          </div>
          <p className="hidden text-xs text-white/75 md:block">* Pflichtfeld</p>
        </div>

        <div className="mt-2 grid min-h-0 flex-1 gap-3 md:mt-4 md:gap-4 lg:grid-cols-[minmax(0,1.25fr)_minmax(0,1fr)] lg:gap-5">
          <div className="flex min-h-0 min-w-0 flex-col overflow-hidden rounded-2xl bg-white/15 p-3 backdrop-blur-xl md:p-4 lg:p-5">
            {isSuccess ? (
              <div className="rounded-xl border border-emerald-200 bg-emerald-50 p-5 text-emerald-900">
                <h3 ref={successHeadingRef} tabIndex={-1} className="text-xl font-bold">
                  Danke – Ihre Anfrage ist eingegangen.
                </h3>
                <p className="mt-2 text-sm">
                  Wir melden uns schnellstmöglich bei Ihnen. Ihre Referenznummer: {ticketId}
                </p>
                <p className="mt-2 text-sm">
                  Für dringende Fälle:{" "}
                  <a
                    href={`tel:${CONTACT_PHONE_TEL}`}
                    className="font-semibold underline"
                    onClick={() => pushAnalyticsEvent("call_click", {})}
                  >
                    {CONTACT_PHONE_DISPLAY}
                  </a>
                </p>
              </div>
            ) : (
              <form
                method="post"
                noValidate
                onSubmit={handleSubmit}
                className="flex min-h-0 flex-1 flex-col [&_button]:cursor-pointer [&_input]:cursor-pointer [&_select]:cursor-pointer [&_textarea]:cursor-pointer [&_button:disabled]:cursor-not-allowed [&_input:disabled]:cursor-not-allowed [&_select:disabled]:cursor-not-allowed [&_textarea:disabled]:cursor-not-allowed"
              >
                {/*
                  Content-Area:
                  - KEIN vertikaler Scroll – das Formular soll niemals 100svh
                    uebersteigen. Erreicht durch reservierte Fehlerslots
                    (FieldMessage) + kompakte Paddings → kein Layout-Shift,
                    wenn Errors erscheinen, und nichts wird abgeschnitten.
                  - `overflow-x-hidden` blockt nur die ungewollte x-Scrollbar
                    durch das `-mx-4`-Bleed der Service-Carousel.
                */}
                <div className="flex min-h-0 min-w-0 flex-1 flex-col space-y-1.5 overflow-x-hidden md:space-y-3">
                  <div className="grid shrink-0 grid-cols-2 gap-x-2.5 gap-y-1 md:gap-x-3 md:gap-y-2">
                    <div>
                      <Label htmlFor="contact-firstName" text="Vorname" required />
                      <input
                        id="contact-firstName"
                        name="firstName"
                        autoComplete="given-name"
                        value={data.firstName}
                        onChange={(e) => updateField("firstName", e.target.value)}
                        onBlur={() => validateAndStore("firstName")}
                        aria-invalid={Boolean(errors.firstName)}
                        className={fieldClass(Boolean(errors.firstName))}
                      />
                      <FieldMessage message={errors.firstName} />
                    </div>

                    <div>
                      <Label htmlFor="contact-lastName" text="Nachname" required />
                      <input
                        id="contact-lastName"
                        name="lastName"
                        autoComplete="family-name"
                        value={data.lastName}
                        onChange={(e) => updateField("lastName", e.target.value)}
                        onBlur={() => validateAndStore("lastName")}
                        aria-invalid={Boolean(errors.lastName)}
                        className={fieldClass(Boolean(errors.lastName))}
                      />
                      <FieldMessage message={errors.lastName} />
                    </div>

                    <div>
                      <Label htmlFor="contact-email" text="E-Mail" required />
                      <input
                        id="contact-email"
                        name="email"
                        type="email"
                        autoComplete="email"
                        value={data.email}
                        onChange={(e) => updateField("email", e.target.value)}
                        onBlur={() => validateAndStore("email")}
                        aria-invalid={Boolean(errors.email)}
                        className={fieldClass(Boolean(errors.email))}
                      />
                      <FieldMessage hint={emailTypoHint} message={errors.email} />
                    </div>

                    <div>
                      <Label htmlFor="contact-phone" text="Telefon" optional />
                      <input
                        id="contact-phone"
                        type="tel"
                        name="phone"
                        autoComplete="tel"
                        inputMode="tel"
                        value={data.phone}
                        onChange={(e) => updateField("phone", e.target.value)}
                        onBlur={() => validateAndStore("phone")}
                        aria-invalid={Boolean(errors.phone)}
                        className={fieldClass(Boolean(errors.phone))}
                      />
                      <FieldMessage message={errors.phone} />
                    </div>

                    <div className="col-span-2">
                      <Label htmlFor="contact-company" text="Unternehmen" optional />
                      <input
                        id="contact-company"
                        name="company"
                        autoComplete="organization"
                        value={data.company}
                        onChange={(e) => updateField("company", e.target.value)}
                        className={clsx("mt-1", CONTACT_FIELD_CONTROL_CLASS)}
                      />
                    </div>
                  </div>

                  <div className="shrink-0">
                    <Label htmlFor="contact-postalCode" text="Objektstandort" required />
                    <div className="mt-1 grid min-w-0 grid-cols-[minmax(0,6.5rem)_minmax(0,1fr)] gap-2.5">
                      <div className="relative min-w-0 max-w-full">
                        <input
                          id="contact-postalCode"
                          name="postalCode"
                          autoComplete="postal-code"
                          inputMode="numeric"
                          maxLength={5}
                          placeholder="PLZ"
                          value={data.postalCode}
                          onChange={(e) => updateField("postalCode", e.target.value)}
                          onFocus={() => {
                            setCityFieldMode((prev) => (prev === "readonly" ? "text" : prev));
                          }}
                          onBlur={() => validateAndStore("postalCode")}
                          aria-invalid={Boolean(errors.postalCode)}
                          className={clsx(
                            CONTACT_FIELD_CONTROL_CLASS,
                            "pr-9",
                            errors.postalCode &&
                              "border-red-500 ring-1 ring-red-500/40 focus:border-red-500",
                          )}
                        />
                        {isPostalLookupLoading && (
                          <span
                            className="absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 animate-spin rounded-full border-2 border-slate-400 border-t-transparent"
                            aria-hidden
                          />
                        )}
                      </div>
                      <div className="relative min-w-0 w-full max-w-[min(100%,18rem)]">
                        {cityFieldMode === "select" ? (
                          <select
                            id="contact-city"
                            name="city"
                            autoComplete="address-level2"
                            value={data.city}
                            onChange={(e) => {
                              const selected = cityOptions.find(
                                (option) => option.name === e.target.value,
                              );
                              updateField("city", e.target.value);
                              updateField("federalState", selected?.federalState?.name || "");
                            }}
                            onBlur={() => validateAndStore("postalCode")}
                            disabled={isPostalLookupLoading}
                            className={CONTACT_SELECT_BASE_CLASS}
                          >
                            <option value="">Ort wählen</option>
                            {cityOptions.map((option) => (
                              <option
                                key={`${option.postalCode}-${option.name}`}
                                value={option.name}
                              >
                                {option.name}
                              </option>
                            ))}
                          </select>
                        ) : (
                          <input
                            id="contact-city"
                            name="city"
                            autoComplete="address-level2"
                            placeholder="Ort"
                            value={data.city}
                            onChange={(e) => updateField("city", e.target.value)}
                            onBlur={() => validateAndStore("postalCode")}
                            readOnly={cityFieldMode === "readonly"}
                            disabled={isPostalLookupLoading}
                            className={clsx(
                              CONTACT_FIELD_CONTROL_CLASS,
                              cityFieldMode === "readonly" && "bg-slate-100 text-slate-600",
                            )}
                          />
                        )}

                        {cityFieldMode === "text" &&
                          data.city.trim().length >= 2 &&
                          citySearchOptions.length > 0 && (
                            <div className="absolute top-full z-20 mt-1 w-full rounded-lg border border-slate-200 bg-white p-1 shadow-lg">
                              {citySearchOptions.map((option) => (
                                <button
                                  key={`${option.postalCode}-${option.name}-search`}
                                  type="button"
                                  onClick={() => {
                                    updateField("postalCode", option.postalCode);
                                    updateField("city", option.name);
                                    updateField(
                                      "federalState",
                                      option.federalState?.name || "",
                                    );
                                    setCitySearchOptions([]);
                                  }}
                                  className="block w-full rounded-md px-2 py-1.5 text-left text-xs text-slate-700 hover:bg-slate-100"
                                >
                                  {option.name}
                                </button>
                              ))}
                            </div>
                          )}
                      </div>
                    </div>
                    <FieldMessage hint={postalLookupError} message={errors.postalCode} />
                  </div>

                  <fieldset className="flex min-w-0 flex-col md:min-h-0 md:flex-1">
                    <legend
                      id="contact-services"
                      className="mb-1 block shrink-0 text-xs font-semibold text-white md:mb-1.5"
                    >
                      <span className="text-sm md:text-base">
                        Welche Leistungen benötigen Sie?
                      </span>{" "}
                      <span aria-hidden>*</span>
                      <span className="ml-1.5 text-xs font-normal text-white/75">
                        (Mehrfachauswahl)
                      </span>
                    </legend>
                    {/*
                      Mobile (< md): horizontaler Snap-Carousel.
                      - `snap-start` + `scroll-pl-4` snappt jede Card linksbuendig
                        am Container-Padding → erste Card ist nicht zentriert,
                        rechts bleibt Platz fuer eine deutlich sichtbare
                        Vorschau auf die naechste Card.
                      - Tile-Groesse `w-[40vw] max-w-[140px]` skaliert mit
                        Viewport: 2 Tiles voll + ~1/3 der dritten als Peek.
                      - `aspect-square` → Tiles bleiben quadratisch, egal welche
                        Breite.
                      md+: weiterhin 5x2 Grid, Tiles fuellen Restplatz fluide.
                    */}
                    <div className="snap-carousel -mx-4 flex snap-x snap-mandatory gap-2 overflow-x-auto overscroll-x-contain scroll-pl-4 px-4 pb-1 pt-0.5 transform-gpu will-change-transform backface-hidden [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:h-0 [&::-webkit-scrollbar]:w-0 md:mx-0 md:grid md:min-h-0 md:flex-1 md:auto-rows-fr md:snap-none md:grid-cols-5 md:grid-rows-2 md:gap-2 md:overflow-visible md:overscroll-auto md:px-0 md:pb-0 md:pt-0 lg:gap-2.5">
                      {SERVICE_OPTIONS.map((option) => {
                        const isSelected = data.services.includes(option.value);
                        return (
                          <button
                            key={option.value}
                            id={`contact-service-${option.value}`}
                            type="button"
                            role="checkbox"
                            aria-checked={isSelected}
                            onClick={() => toggleService(option.value)}
                            onBlur={() => validateAndStore("services")}
                            className="group relative block aspect-square w-[clamp(88px,28vw,112px)] shrink-0 cursor-pointer snap-start rounded-lg outline-none transform-[translateZ(0)] backface-hidden focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-[#2A4961] md:aspect-auto md:h-full md:w-auto md:min-h-0 lg:rounded-xl"
                          >
                            <span
                              className={clsx(
                                "relative block h-full w-full overflow-hidden rounded-lg border-2 transition lg:rounded-xl",
                                isSelected
                                  ? "border-white"
                                  : "border-white/40 group-hover:border-white/80",
                              )}
                            >
                              <Image
                                src={option.image}
                                alt=""
                                fill
                                placeholder="blur"
                                sizes="(max-width: 767px) clamp(88px, 28vw, 112px), 140px"
                                className={clsx(
                                  "object-cover transition duration-200",
                                  isSelected
                                    ? "scale-105"
                                    : "opacity-90 group-hover:scale-105 group-hover:opacity-100",
                                )}
                              />
                              {/* Dunklerer, hoeherer Verlauf – Label wird auch
                                  ueber hellen Bildbereichen klar lesbar */}
                              <span
                                aria-hidden
                                className="pointer-events-none absolute inset-x-0 bottom-0 h-3/4 bg-linear-to-t from-black/90 via-black/55 to-transparent"
                              />
                              <span
                                lang="de"
                                className="pointer-events-none absolute inset-x-1.5 bottom-1.5 text-center text-[11px] font-semibold leading-tight text-white hyphens-manual wrap-break-word md:inset-x-1.5 md:bottom-1.5 md:text-[11px] lg:text-xs"
                                style={{ textShadow: "0 1px 2px rgba(0,0,0,0.55)" }}
                              >
                                {option.label}
                              </span>
                              {isSelected && (
                                <span
                                  aria-hidden
                                  className="absolute right-2 top-2 flex h-6 w-6 items-center justify-center rounded-full bg-white text-[#2A4961] ring-1 ring-black/10"
                                >
                                  <svg
                                    className="h-3.5 w-3.5"
                                    viewBox="0 0 20 20"
                                    fill="currentColor"
                                  >
                                    <path
                                      fillRule="evenodd"
                                      d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 111.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                                      clipRule="evenodd"
                                    />
                                  </svg>
                                </span>
                              )}
                            </span>
                          </button>
                        );
                      })}
                    </div>
                    <FieldMessage message={errors.services} />
                  </fieldset>

                  <div className="shrink-0">
                    <Label
                      htmlFor="contact-description"
                      text="Kurze Objektbeschreibung"
                      required
                    />
                    <textarea
                      id="contact-description"
                      name="description"
                      rows={2}
                      maxLength={MAX_DESCRIPTION_LENGTH}
                      placeholder="z. B. Treppenhaus 4 Stockwerke, ca. 120 m², 1× pro Woche"
                      value={data.description}
                      onChange={(e) => updateField("description", e.target.value)}
                      onBlur={() => validateAndStore("description")}
                      aria-invalid={Boolean(errors.description)}
                      className={clsx(
                        CONTACT_TEXTAREA_FIELD_CLASS,
                        errors.description &&
                          "border-red-500 ring-1 ring-red-500/40 focus:border-red-500",
                      )}
                    />
                    <FieldMessage
                      id="contact-description-error"
                      hint={remainingChars <= 100 ? `Noch ${remainingChars} Zeichen` : undefined}
                      message={errors.description}
                    />
                  </div>
                </div>

                <div className="mt-1.5 shrink-0 space-y-1.5 border-t border-white/15 pt-1.5 md:mt-2.5 md:space-y-2 md:pt-2.5">
                  <label className="flex items-start gap-2 text-xs leading-snug text-white/95">
                    <input
                      id="contact-privacyConsent"
                      type="checkbox"
                      checked={data.privacyConsent}
                      onChange={(e) => updateField("privacyConsent", e.target.checked)}
                      className="mt-0.5"
                    />
                    <span>
                      Ich stimme zu, dass meine Angaben zur Bearbeitung meiner Anfrage
                      verarbeitet werden (siehe{" "}
                      <Link href="/datenschutz" className="underline underline-offset-2">
                        Datenschutz
                      </Link>
                      ).
                    </span>
                  </label>
                  <FieldMessage message={errors.privacyConsent} />

                  <input
                    type="text"
                    name="website"
                    autoComplete="off"
                    tabIndex={-1}
                    value={data.hpWebsite}
                    onChange={(e) => updateField("hpWebsite", e.target.value)}
                    className="hidden"
                    aria-hidden="true"
                  />
                  <input type="hidden" name="federalState" value={data.federalState} />

                  <div className="flex flex-wrap items-center gap-3">
                    <button
                      type="submit"
                      disabled={isPending}
                      className={BTN_PRIMARY_SUBMIT}
                    >
                      {isPending && (
                        <span
                          className="h-4 w-4 animate-spin rounded-full border-2 border-[#2A4961] border-t-transparent"
                          aria-hidden
                        />
                      )}
                      {isPending ? "Wird gesendet..." : submitLabel}
                    </button>
                  </div>
                </div>
              </form>
            )}
          </div>

          <div className="hidden min-h-0 lg:flex">
            <ContactSidebar />
          </div>
        </div>
      </div>
    </section>
  );
}
