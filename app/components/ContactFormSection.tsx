"use client";

import Link from "next/link";
import { FormEvent, useEffect, useMemo, useRef, useState } from "react";
import {
  CONTACT_ADDRESS_LINES,
  CONTACT_EMAIL,
  CONTACT_PHONE_DISPLAY,
  CONTACT_PHONE_TEL,
} from "@/app/contact";

type ServiceType = "Reinigungsservice" | "Winterdienst" | "Gebäudeservice" | "";
type Step = 1 | 2 | 3;
type ErrorMap = Partial<Record<FieldName, string>>;

type FormDataState = {
  service: ServiceType;
  postalCode: string;
  city: string;
  federalState: string;
  company: string;
  contactName: string;
  email: string;
  phone: string;
  description: string;
  wantsCallback: boolean;
  callbackWindow: string;
  callbackDays: string[];
  callbackFrom: string;
  callbackTo: string;
  desiredStartDate: string;
  cleaningObjectType: string;
  cleaningArea: string;
  cleaningFrequency: string;
  cleaningHygiene: string[];
  winterAreas: string[];
  winterWindow: string;
  winterOnCall: boolean;
  buildingModules: string[];
  privacyConsent: boolean;
  hpWebsite: string;
};

type FieldName =
  | "service"
  | "postalCode"
  | "company"
  | "contactName"
  | "email"
  | "phone"
  | "description"
  | "callbackWindow"
  | "privacyConsent";

const MAX_DESCRIPTION_LENGTH = 1500;
const MIN_DESCRIPTION_LENGTH = 30;
const DEFAULT_FORM_DATA: FormDataState = {
  service: "",
  postalCode: "",
  city: "",
  federalState: "",
  company: "",
  contactName: "",
  email: "",
  phone: "",
  description: "",
  wantsCallback: false,
  callbackWindow: "",
  callbackDays: [],
  callbackFrom: "",
  callbackTo: "",
  desiredStartDate: "",
  cleaningObjectType: "",
  cleaningArea: "",
  cleaningFrequency: "",
  cleaningHygiene: [],
  winterAreas: [],
  winterWindow: "",
  winterOnCall: false,
  buildingModules: [],
  privacyConsent: false,
  hpWebsite: "",
};
/** Einheitliche Höhe (h-10), Ecken (rounded-lg), Rand – Inputs & Trigger-Buttons im Kontaktformular */
const CONTACT_FIELD_CONTROL_CLASS =
  "box-border h-11 w-full min-w-0 rounded-lg border border-slate-200 bg-white px-3 text-lg text-slate-900 outline-none transition placeholder:text-slate-500 focus:border-slate-200 focus:ring-0 focus-visible:outline-none disabled:cursor-not-allowed disabled:bg-slate-100";

const CONTACT_SELECT_BASE_CLASS =
  "contact-form-select box-border h-11 w-full min-w-0 appearance-none rounded-lg border border-slate-200 bg-white px-3 pr-9 text-lg text-slate-900 outline-none transition focus:border-slate-200 focus:ring-0 focus-visible:outline-none disabled:cursor-not-allowed disabled:bg-slate-100";

const CONTACT_STEP2_SELECT_FIELD_CLASS =
  "mt-1.5 contact-form-select box-border h-11 w-full min-w-0 appearance-none rounded-lg border border-slate-200 bg-white px-3 pr-9 text-lg text-slate-900 outline-none transition disabled:cursor-not-allowed disabled:bg-slate-100";

const CONTACT_TEXTAREA_FIELD_CLASS =
  "mt-1.5 max-h-[min(28vh,9rem)] min-h-18 w-full resize-none rounded-lg border border-slate-200 bg-white px-3 py-2 text-lg text-slate-900 outline-none transition placeholder:text-sm focus:border-slate-200 focus:ring-0 focus-visible:outline-none disabled:cursor-not-allowed disabled:bg-slate-100 lg:max-h-none lg:min-h-0";

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
  "service",
  "postalCode",
  "company",
  "contactName",
  "email",
  "phone",
  "description",
  "callbackWindow",
  "privacyConsent",
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
  const value = data[field];
  switch (field) {
    case "service":
      return data.service ? "" : "Bitte wählen Sie eine Leistung aus.";
    case "postalCode":
      return data.postalCode.trim() && data.city.trim() ? "" : "Bitte geben Sie PLZ und Ort an.";
    case "company":
      return data.company.trim().length >= 2 ? "" : "Bitte geben Sie den Unternehmensnamen an.";
    case "contactName":
      return data.contactName.trim().length >= 2 ? "": "Bitte geben Sie Ihren Namen an.";
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
    case "description":
      return "";
    case "callbackWindow":
      if (!data.wantsCallback) return "";
      return data.callbackWindow.trim().length > 0 ? "" : "Bitte geben Sie einen bevorzugten Zeitraum an.";
    case "privacyConsent":
      return data.privacyConsent ? "" : "Bitte stimmen Sie der Verarbeitung Ihrer Angaben zu.";
    default:
      return "";
  }
}

function getVisibleFields(step: Step, data: FormDataState): FieldName[] {
  if (step === 1) return ["service", "postalCode"];
  if (step === 2) return [];
  return FIELD_ORDER.filter(
    (field) =>
      !["service", "postalCode", "city"].includes(field) &&
      (field !== "callbackWindow" || data.wantsCallback),
  );
}

function getEmailTypoHint(email: string): string {
  const parts = email.toLowerCase().trim().split("@");
  if (parts.length !== 2) return "";
  const candidate = DOMAIN_TYPOS[parts[1]];
  return candidate ? `Meinen Sie ${parts[0]}@${candidate}?` : "";
}

function PhoneIcon() {
  return (
    <svg className="h-5 w-5 shrink-0 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden>
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V21a2 2 0 01-2 2h-2C7.82 23 2 17.18 2 10V5z" />
    </svg>
  );
}

function Label({ htmlFor, text, required = false, optional = false }: { htmlFor: string; text: string; required?: boolean; optional?: boolean }) {
  return (
    <label htmlFor={htmlFor} className="block text-base font-semibold text-white">
      {text} {required && <span aria-hidden>*</span>} {optional && <span className="font-normal text-white/85">(optional)</span>}
    </label>
  );
}

function TrustBlock() {
  return (
    <aside className="rounded-xl bg-white/15 p-4 text-white backdrop-blur-xl">
      <h4 className="text-base font-semibold">Darum vertrauen uns Unternehmen</h4>
      <ul className="mt-3 space-y-2 text-sm text-white/90">
        <li>Antwort innerhalb von 1 Werktag</li>
        <li>Über 200 betreute Objekte</li>
        <li>Professionelle Teams für Reinigung, Winterdienst und Gebäudeservice</li>
      </ul>
    </aside>
  );
}

const WEEKDAY_LABELS = ["Mo", "Di", "Mi", "Do", "Fr", "Sa", "So"];
const MONTH_LABELS = [
  "Januar",
  "Februar",
  "März",
  "April",
  "Mai",
  "Juni",
  "Juli",
  "August",
  "September",
  "Oktober",
  "November",
  "Dezember",
];
const SERVICE_OPTIONS: Array<{ value: Exclude<ServiceType, "">; image: string }> = [
  {
    value: "Reinigungsservice",
    image: "/reinigungsservice-es-gebaeudeservice.jpg",
  },
  {
    value: "Winterdienst",
    image: "/winterdienst-es-gebaeudeservice.jpg",
  },
  {
    value: "Gebäudeservice",
    image: "/gebaeudeservice-es-gebaeudeservice.jpg",
  },
];
const CLEANING_HYGIENE_OPTIONS: Array<{ value: string; image: string }> = [
  { value: "Standard", image: "/reinigungsservice-es-gebaeudeservice.jpg" },
  { value: "Lebensmittel", image: "/lebensmittelbranche-reinigung-es-gebaeudeservice.jpeg" },
  { value: "Medizin", image: "/reinigungsservice-es-gebaeudeservice.jpg" },
  { value: "Reinraum", image: "/reinigungsservice-es-gebaeudeservice.jpg" },
];
const WINTER_AREA_OPTIONS: Array<{ value: string; image: string }> = [
  { value: "Gehwege", image: "/winterdienst-gehweg-es-gebaeudeservice.jpeg" },
  { value: "Zufahrten", image: "/winterdienst-es-gebaeudeservice.jpg" },
  { value: "Parkflächen", image: "/winterdienst-es-gebaeudeservice.jpg" },
  { value: "Dachflächen", image: "/winterdienst-es-gebaeudeservice.jpg" },
];
const BUILDING_MODULE_OPTIONS: Array<{ value: string; image: string }> = [
  { value: "Hausmeister", image: "/gebaeudeservice-es-gebaeudeservice.jpg" },
  { value: "Kleinreparaturen", image: "/gebaeudeservice-es-gebaeudeservice.jpg" },
  { value: "Grünpflege", image: "/gebaeudeservice-es-gebaeudeservice.jpg" },
  { value: "Sonstiges", image: "/gebaeudeservice-es-gebaeudeservice.jpg" },
];
const CALLBACK_WEEKDAYS = ["Mo", "Di", "Mi", "Do", "Fr", "Sa"];

function toIsoDate(date: Date): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

function parseIsoDate(value: string): Date | null {
  if (!value) return null;
  const [yearStr, monthStr, dayStr] = value.split("-");
  const year = Number(yearStr);
  const month = Number(monthStr);
  const day = Number(dayStr);
  if (!year || !month || !day) return null;
  return new Date(year, month - 1, day);
}

function ModernDatePicker({
  id,
  value,
  onChange,
}: {
  id: string;
  value: string;
  onChange: (nextValue: string) => void;
}) {
  const selectedDate = parseIsoDate(value);
  const [isOpen, setIsOpen] = useState(false);
  const [useNativeDateInput, setUseNativeDateInput] = useState(false);
  const [visibleMonth, setVisibleMonth] = useState<Date>(
    selectedDate ? new Date(selectedDate.getFullYear(), selectedDate.getMonth(), 1) : new Date(new Date().getFullYear(), new Date().getMonth(), 1),
  );
  const wrapperRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (typeof window === "undefined") return;
    setUseNativeDateInput(window.matchMedia("(hover: none), (pointer: coarse)").matches);
  }, []);

  useEffect(() => {
    if (selectedDate) {
      setVisibleMonth(new Date(selectedDate.getFullYear(), selectedDate.getMonth(), 1));
    }
  }, [value]);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (!wrapperRef.current) return;
      if (!wrapperRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isOpen]);

  const year = visibleMonth.getFullYear();
  const monthIndex = visibleMonth.getMonth();
  const monthStart = new Date(year, monthIndex, 1);
  const firstWeekday = (monthStart.getDay() + 6) % 7;
  const gridStart = new Date(year, monthIndex, 1 - firstWeekday);
  const dayCells = Array.from({ length: 42 }, (_, index) => {
    const date = new Date(gridStart);
    date.setDate(gridStart.getDate() + index);
    return {
      iso: toIsoDate(date),
      day: date.getDate(),
      isCurrentMonth: date.getMonth() === monthIndex,
      month: date.getMonth(),
      year: date.getFullYear(),
    };
  });

  const selectedIso = selectedDate ? toIsoDate(selectedDate) : "";

  if (useNativeDateInput) {
    return (
      <div className="relative w-full max-w-[min(100%,calc(17ch+2.75rem))]">
        <input
          id={id}
          type="date"
          value={value}
          onChange={(event) => onChange(event.target.value)}
          className={clsx(
            CONTACT_FIELD_CONTROL_CLASS,
            "contact-form-date-input scheme-light block",
            !value && "text-transparent caret-transparent",
          )}
        />
        {!value && (
          <span
            className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-sm leading-none text-slate-500"
            aria-hidden
          >
            Datum auswählen
          </span>
        )}
      </div>
    );
  }

  return (
    <div ref={wrapperRef} className="relative w-full max-w-[min(100%,calc(17ch+4.25rem))]">
      <button
        type="button"
        onClick={() => setIsOpen((prev) => !prev)}
        className={clsx(
          CONTACT_FIELD_CONTROL_CLASS,
          "text-sm! flex w-full min-w-0 cursor-pointer items-center justify-between gap-1 text-left",
        )}
        aria-haspopup="dialog"
        aria-expanded={isOpen}
      >
        <span className={clsx(!selectedDate && "text-slate-500")}>
          {selectedDate
            ? `${String(selectedDate.getDate()).padStart(2, "0")}.${String(selectedDate.getMonth() + 1).padStart(2, "0")}.${selectedDate.getFullYear()}`
            : "Datum auswählen"}
        </span>
        <span aria-hidden>📅</span>
      </button>

      {isOpen && (
        <div
          role="dialog"
          aria-label="Datum auswählen"
          className="absolute bottom-full left-0 z-30 mb-2 w-[320px] max-w-[calc(100vw-3rem)] rounded-xl border border-slate-200 bg-white p-3 text-slate-900 shadow-xl"
        >
          <div className="mb-3 flex items-center justify-between">
            <button
              type="button"
              onClick={() => setVisibleMonth(new Date(year, monthIndex - 1, 1))}
              className="cursor-pointer rounded-full p-2 text-slate-600 transition hover:bg-slate-100"
              aria-label="Vorheriger Monat"
            >
              ←
            </button>
            <p className="text-base font-semibold text-[#2A4961]">
              {MONTH_LABELS[monthIndex]} {year}
            </p>
            <button
              type="button"
              onClick={() => setVisibleMonth(new Date(year, monthIndex + 1, 1))}
              className="cursor-pointer rounded-full p-2 text-slate-600 transition hover:bg-slate-100"
              aria-label="Nächster Monat"
            >
              →
            </button>
          </div>

          <div className="grid grid-cols-7 gap-1.5 text-center text-xs font-semibold text-slate-500">
            {WEEKDAY_LABELS.map((day) => (
              <span key={day}>{day}</span>
            ))}
          </div>

          <div className="mt-1.5 grid grid-cols-7 gap-1.5">
            {dayCells.map((cell) => {
              const isSelected = cell.iso === selectedIso;
              const isToday = cell.iso === toIsoDate(new Date());
              return (
                <button
                  key={cell.iso}
                  type="button"
                  onClick={() => {
                    onChange(cell.iso);
                    setIsOpen(false);
                  }}
                  className={clsx(
                    "h-9 w-9 cursor-pointer rounded-full text-sm font-semibold transition",
                    isSelected
                      ? "bg-[#7596AE] text-white shadow-md"
                      : cell.isCurrentMonth
                        ? "text-slate-700 hover:bg-slate-100"
                        : "text-slate-400 hover:bg-slate-100",
                    isToday && !isSelected && "ring-2 ring-[#7596AE]/60",
                  )}
                  aria-pressed={isSelected}
                  aria-label={`Datum ${cell.day}.${cell.month + 1}.${cell.year} auswählen`}
                >
                  {cell.day}
                </button>
              );
            })}
          </div>
        </div>
      )}

      <input id={id} type="hidden" value={value} readOnly />
    </div>
  );
}

const TIME_SLOTS = Array.from({ length: 24 }, (_, index) => {
  const hour = 7 + Math.floor(index / 2);
  const minute = index % 2 === 0 ? "00" : "30";
  return `${String(hour).padStart(2, "0")}:${minute}`;
});

function ModernTimePicker({
  id,
  value,
  disabled,
  onChange,
}: {
  id: string;
  value: string;
  disabled?: boolean;
  onChange: (nextValue: string) => void;
}) {
  const [isOpen, setIsOpen] = useState(false);
  const wrapperRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (!wrapperRef.current) return;
      if (!wrapperRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isOpen]);

  return (
    <div ref={wrapperRef} className="relative mt-1.5">
      <button
        id={id}
        type="button"
        disabled={disabled}
        onClick={() => setIsOpen((prev) => !prev)}
        className={clsx(
          CONTACT_FIELD_CONTROL_CLASS,
          "flex cursor-pointer items-center justify-between text-left disabled:cursor-not-allowed disabled:bg-slate-100",
        )}
        aria-haspopup="dialog"
        aria-expanded={isOpen}
      >
        <span className={clsx("text-base", !value && "text-slate-500")}>
          {value || "Uhrzeit wählen"}
        </span>
        <span aria-hidden>🕒</span>
      </button>

      {isOpen && (
        <div
          role="dialog"
          aria-label="Uhrzeit wählen"
          className="absolute bottom-full left-0 z-30 mb-2 w-[320px] max-w-[calc(100vw-3rem)] rounded-xl border border-slate-200 bg-white p-3 text-slate-900 shadow-xl"
        >
          <p className="mb-2 text-sm font-semibold text-[#2A4961]">Bevorzugte Uhrzeit</p>
          <div className="grid max-h-56 grid-cols-4 gap-1.5 overflow-y-auto pr-1">
            {TIME_SLOTS.map((slot) => (
              <button
                key={slot}
                type="button"
                onClick={() => {
                  onChange(slot);
                  setIsOpen(false);
                }}
                className={clsx(
                  "rounded-md px-2 py-1.5 text-sm font-medium transition",
                  value === slot
                    ? "bg-[#7596AE] text-white"
                    : "bg-slate-100 text-slate-700 hover:bg-slate-200",
                )}
              >
                {slot}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

function buildCallbackWindow(days: string[], from: string, to: string): string {
  if (days.length === 0 || !from || !to) return "";
  return `${days.join(", ")} ${from}–${to}`;
}

export default function ContactFormSection() {
  const [step, setStep] = useState<Step>(1);
  const [data, setData] = useState<FormDataState>(DEFAULT_FORM_DATA);
  const [errors, setErrors] = useState<ErrorMap>({});
  const [showSummary, setShowSummary] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [submitError, setSubmitError] = useState("");
  const [ticketId, setTicketId] = useState("");
  const [started, setStarted] = useState(false);
  const [announceMessage, setAnnounceMessage] = useState("");
  const [isPostalLookupLoading, setIsPostalLookupLoading] = useState(false);
  const [postalLookupError, setPostalLookupError] = useState("");
  const [cityFieldMode, setCityFieldMode] = useState<"text" | "readonly" | "select">("text");
  const [cityOptions, setCityOptions] = useState<OpenPlzLocality[]>([]);
  const [citySearchOptions, setCitySearchOptions] = useState<OpenPlzLocality[]>([]);
  const [isCitySearchLoading, setIsCitySearchLoading] = useState(false);
  const summaryRef = useRef<HTMLDivElement | null>(null);
  const successHeadingRef = useRef<HTMLHeadingElement | null>(null);
  const stepHeadingRef = useRef<HTMLHeadingElement | null>(null);
  const citySearchDebounceRef = useRef<number | null>(null);
  const didMountRef = useRef(false);

  useEffect(() => {
    pushAnalyticsEvent("form_view", { form_type: "multi" });
  }, []);

  useEffect(() => {
    pushAnalyticsEvent("step_view", { step });
    setAnnounceMessage(`Schritt ${step} von 3.`);

    // Beim initialen Seitenladen keinen Fokus erzwingen, damit die Seite nicht
    // automatisch zum Formular springt. Fokus nur bei echten Schrittwechseln.
    if (!didMountRef.current) {
      didMountRef.current = true;
      return;
    }

    stepHeadingRef.current?.focus({ preventScroll: true });
  }, [step]);

  useEffect(() => {
    if (showSummary && summaryRef.current) {
      summaryRef.current.focus();
    }
  }, [showSummary]);

  useEffect(() => {
    if (isSuccess) {
      successHeadingRef.current?.focus();
      setAnnounceMessage("Ihre Anfrage wurde erfolgreich gesendet.");
    }
  }, [isSuccess]);

  useEffect(() => {
    if (!data.wantsCallback) {
      if (data.callbackWindow || data.callbackDays.length > 0 || data.callbackFrom || data.callbackTo) {
        setData((prev) => ({
          ...prev,
          callbackWindow: "",
          callbackDays: [],
          callbackFrom: "",
          callbackTo: "",
        }));
      }
      return;
    }

    const nextWindow = buildCallbackWindow(data.callbackDays, data.callbackFrom, data.callbackTo);
    if (nextWindow !== data.callbackWindow) {
      setData((prev) => ({ ...prev, callbackWindow: nextWindow }));
    }
  }, [data.wantsCallback, data.callbackDays, data.callbackFrom, data.callbackTo, data.callbackWindow]);

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
        // Progressive enhancement: bei API-Fehler normales manuelles Textfeld erlauben.
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
  const isScopeStep2Visible = step === 2;

  function updateField<K extends keyof FormDataState>(field: K, value: FormDataState[K]) {
    if (!started) {
      setStarted(true);
      pushAnalyticsEvent("form_start", { form_type: "multi" });
    }
    setData((prev) => {
      const next = { ...prev, [field]: value };

      // Live-Fehlerzustand: vorhandene Fehlermeldungen sofort entfernen, sobald Feld wieder gültig ist.
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
        } else if (field === "company") {
          revalidate("company");
        } else if (field === "contactName") {
          revalidate("contactName");
        } else if (field === "email") {
          revalidate("email");
        } else if (field === "phone") {
          revalidate("phone");
        } else if (field === "description") {
          revalidate("description");
        } else if (
          field === "wantsCallback" ||
          field === "callbackWindow" ||
          field === "callbackDays" ||
          field === "callbackFrom" ||
          field === "callbackTo"
        ) {
          revalidate("callbackWindow");
        } else if (field === "privacyConsent") {
          revalidate("privacyConsent");
        } else if (field === "service") {
          revalidate("service");
        }

        return updatedErrors;
      });

      return next;
    });
    if (field === "wantsCallback" && value === true) {
      pushAnalyticsEvent("callback_toggle", {});
    }
  }

  function validateAndStore(field: FieldName): string {
    const message = validateField(data, field);
    setErrors((prev) => ({ ...prev, [field]: message || undefined }));
    if (message) {
      pushAnalyticsEvent("field_error", { field_name: field });
    }
    return message;
  }

  function validateVisibleFields(): ErrorMap {
    const visible = getVisibleFields(step, data);
    const nextErrors: ErrorMap = {};
    for (const field of visible) {
      const message = validateField(data, field);
      if (message) nextErrors[field] = message;
    }
    return nextErrors;
  }

  function handleStepNext() {
    if (step === 1) {
      const stepErrors: ErrorMap = {};
      for (const field of ["service", "postalCode"] as FieldName[]) {
        const msg = validateField(data, field);
        if (msg) stepErrors[field] = msg;
      }
      setErrors((prev) => ({ ...prev, ...stepErrors }));
      if (Object.keys(stepErrors).length > 0) {
        setShowSummary(true);
        return;
      }
    }
    if (step === 2) {
      pushAnalyticsEvent("step_complete", { step: 2 });
    }
    if (step < 3) {
      if (step === 1) pushAnalyticsEvent("step_complete", { step: 1 });
      setStep((prev) => (prev + 1) as Step);
      setShowSummary(false);
    }
  }

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    pushAnalyticsEvent("form_submit_attempt", { form_type: "multi" });

    const nextErrors = validateVisibleFields();
    setErrors((prev) => ({ ...prev, ...nextErrors }));
    if (Object.keys(nextErrors).length > 0) {
      setShowSummary(true);
      return;
    }

    setShowSummary(false);
    setSubmitError("");
    setIsSubmitting(true);

    if (data.hpWebsite.trim()) {
      setTimeout(() => {
        setIsSubmitting(false);
        pushAnalyticsEvent("form_submit_success", {
          form_type: "multi",
          service_type: data.service || "unknown",
        });
        setTicketId(`ES-${Date.now().toString().slice(-7)}`);
        setIsSuccess(true);
      }, 400);
      return;
    }

    setTimeout(() => {
      const success = true;
      if (success) {
        setIsSubmitting(false);
        setTicketId(`ES-${Date.now().toString().slice(-7)}`);
        setIsSuccess(true);
        pushAnalyticsEvent("form_submit_success", {
          form_type: "multi",
          service_type: data.service || "unknown",
        });
      } else {
        setIsSubmitting(false);
        setSubmitError("Beim Senden ist ein Fehler aufgetreten. Bitte versuchen Sie es erneut.");
        pushAnalyticsEvent("form_submit_fail", { error_class: "submit_error" });
      }
    }, 900);
  }

  function errorSummaryItems() {
    const currentFields = getVisibleFields(step, data);
    return currentFields
      .map((field) => ({ field, message: errors[field] }))
      .filter((item): item is { field: FieldName; message: string } => Boolean(item.message));
  }

  const summaryItems = errorSummaryItems();
  const submitLabel =
    data.service === "Winterdienst" ? "Winterdienst anfragen" : "Angebot anfordern";

  return (
    <section
      id="kontaktformular"
      className="contact-form-section relative px-6 py-12 md:px-10 lg:px-16 max-lg:sticky max-lg:top-0 max-lg:z-10 max-lg:py-6"
      aria-labelledby="contact-heading"
    >
      <div className="mx-auto w-full max-w-7xl">
        <h2 id="contact-heading" className="text-2xl font-bold text-white md:text-3xl max-lg:text-xl">
          Angebot anfordern
        </h2>
        <p className="mt-2 text-base text-white/90 md:mt-3 md:text-lg max-lg:mt-1.5 max-lg:text-sm">
          Dieses Formular ist ausschließlich für Gewerbekunden. Für Privatanfragen wenden Sie sich bitte an den{" "}
          <Link href="/kontakt" className="underline decoration-white/60 underline-offset-2">
            Kontakt
          </Link>
          .
        </p>

        <div className="mt-6 grid gap-6 lg:mt-8 lg:grid-cols-[minmax(0,2fr)_minmax(0,1fr)]">
          <div
            className={clsx(
              "flex flex-col overflow-hidden rounded-2xl bg-white/15 p-4 backdrop-blur-xl md:p-8",
              !isSuccess && "lg:h-[min(42rem,calc(100vh-14rem))] lg:shrink-0",
            )}
          >
            {isSuccess ? (
              <div className="rounded-xl border border-emerald-200 bg-emerald-50 p-5 text-emerald-900">
                <h3 ref={successHeadingRef} tabIndex={-1} className="text-xl font-bold">
                  Danke – Ihre Anfrage ist eingegangen.
                </h3>
                <p className="mt-2 text-sm">
                  Wir melden uns in der Regel innerhalb von 1 Werktag bei Ihnen. Ihre Referenznummer: {ticketId}
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
                action="/kontakt-anfrage"
                noValidate
                onSubmit={handleSubmit}
                className="flex min-h-0 flex-1 flex-col space-y-5 max-lg:min-h-0 max-lg:space-y-0 [&_button]:cursor-pointer [&_input]:cursor-pointer [&_select]:cursor-pointer [&_textarea]:cursor-pointer [&_button:disabled]:cursor-not-allowed [&_input:disabled]:cursor-not-allowed [&_select:disabled]:cursor-not-allowed [&_textarea:disabled]:cursor-not-allowed"
              >
                <div className="sr-only" aria-live="polite">{announceMessage}</div>

                <div className="flex min-h-0 flex-1 flex-col max-lg:gap-3">
                  <div className="shrink-0 space-y-2 max-lg:space-y-1.5">
                    <p className="text-base text-white/85">* Pflichtfeld</p>
                    <h3 ref={stepHeadingRef} tabIndex={-1} className="text-xl font-semibold text-white">
                      Schritt {step} von 3
                    </h3>
                    <div className="h-2 overflow-hidden rounded-full bg-white/25 max-lg:h-1.5">
                      <div
                        className="h-full rounded-full bg-white transition-all"
                        style={{ width: `${(step / 3) * 100}%` }}
                        aria-hidden
                      />
                    </div>
                  </div>

                  <div className="min-h-0 flex-1 space-y-4 overflow-visible pr-0.5 max-lg:space-y-3 lg:pr-0">
                {showSummary && summaryItems.length > 0 && (
                  <div
                    ref={summaryRef}
                    tabIndex={-1}
                    role="alert"
                    aria-live="assertive"
                    className="rounded-lg border border-red-200 bg-red-50 p-4 text-red-900"
                  >
                    <p className="font-semibold">
                      Bitte prüfen Sie die markierten Felder. Es gibt noch {summaryItems.length} Eingabefehler.
                    </p>
                    <ul className="mt-2 list-disc pl-5">
                      {summaryItems.map((item) => (
                        <li key={item.field}>
                          <button
                            type="button"
                            className="underline"
                            onClick={() => {
                              document.getElementById(`contact-${item.field}`)?.focus();
                            }}
                          >
                            {item.message}
                          </button>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                <div className={clsx(step !== 1 && "hidden")}>
                  <p id="contact-service" className="mb-2 block text-base font-semibold text-white">
                    Welche Leistung benötigen Sie? <span aria-hidden>*</span>
                  </p>
                  <div className="grid grid-cols-3 gap-1.5 sm:gap-2">
                    {SERVICE_OPTIONS.map((option) => (
                      <label
                        key={option.value}
                        className="w-full cursor-pointer"
                      >
                        <input
                          id={`contact-service-${option.value}`}
                          className="sr-only"
                          type="radio"
                          name="service"
                          value={option.value}
                          checked={data.service === option.value}
                          onChange={(e) => updateField("service", e.target.value as ServiceType)}
                          onBlur={() => validateAndStore("service")}
                        />
                        <div
                          className={clsx(
                            "h-17 w-full overflow-hidden rounded-lg border transition sm:h-28 md:h-32 sm:rounded-xl",
                            data.service === option.value
                              ? "border-2 border-white"
                              : "border-white/40",
                          )}
                        >
                          <img
                            src={option.image}
                            alt={option.value}
                            className="h-full w-full object-cover"
                          />
                        </div>
                        <div className="px-0.5 pt-1 text-center text-white sm:px-1 sm:pt-0.5">
                          <span className="text-xs font-normal leading-tight sm:text-lg">{option.value}</span>
                        </div>
                      </label>
                    ))}
                  </div>
                  {errors.service && <p className="mt-1 text-sm text-red-100">{errors.service}</p>}
                </div>

                <div className={clsx(step !== 1 && "hidden")}>
                  <Label htmlFor="contact-postalCode" text="Objektstandort" required />
                  <div className="mt-1.5 grid min-w-0 grid-cols-[minmax(0,7.25rem)_minmax(0,1fr)] gap-2 sm:gap-3">
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
                        className={clsx(CONTACT_FIELD_CONTROL_CLASS, "pr-10")}
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
                            const selected = cityOptions.find((option) => option.name === e.target.value);
                            updateField("city", e.target.value);
                            updateField("federalState", selected?.federalState?.name || "");
                          }}
                          onBlur={() => validateAndStore("postalCode")}
                          disabled={isPostalLookupLoading}
                          className={CONTACT_SELECT_BASE_CLASS}
                        >
                          <option value="">Ort wählen</option>
                          {cityOptions.map((option) => (
                            <option key={`${option.postalCode}-${option.name}`} value={option.name}>
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

                      {cityFieldMode === "text" && data.city.trim().length >= 2 && citySearchOptions.length > 0 && (
                        <div className="absolute top-full z-20 mt-1 w-full rounded-lg border border-slate-200 bg-white p-1 shadow-lg">
                          {citySearchOptions.map((option) => (
                            <button
                              key={`${option.postalCode}-${option.name}-search`}
                              type="button"
                              onClick={() => {
                                updateField("postalCode", option.postalCode);
                                updateField("city", option.name);
                                updateField("federalState", option.federalState?.name || "");
                                setCitySearchOptions([]);
                              }}
                              className="block w-full rounded-md px-2 py-2 text-left text-sm text-slate-700 hover:bg-slate-100"
                            >
                              {option.name}
                            </button>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                  <p className="mt-1 text-sm text-white/85">Bitte PLZ und Ort des zu betreuenden Objekts angeben.</p>
                  {postalLookupError && <p className="mt-1 text-sm text-amber-100">{postalLookupError}</p>}
                  {isCitySearchLoading && cityFieldMode === "text" && (
                    <p className="mt-1 text-xs text-white/75">Ort wird gesucht...</p>
                  )}
                  {errors.postalCode && (
                    <p className="mt-1 text-sm text-red-100">{errors.postalCode}</p>
                  )}
                </div>

                {step === 1 && (
                  <>
                    <div>
                      <Label htmlFor="contact-desiredStartDate" text="Gewünschter Leistungsbeginn" optional />
                      <div className="mt-1.5 grid min-w-0 gap-3 sm:grid-cols-2">
                        <div className="min-w-0 justify-self-start">
                          <ModernDatePicker
                            id="contact-desiredStartDate"
                            value={data.desiredStartDate}
                            onChange={(nextDate) => updateField("desiredStartDate", nextDate)}
                          />
                        </div>
                        <div className="hidden min-w-0 sm:block" aria-hidden="true" />
                      </div>
                    </div>
                  </>
                )}

                <div className={clsx(!isScopeStep2Visible && "hidden")} aria-hidden={!isScopeStep2Visible}>
                  {data.service === "Reinigungsservice" && (
                    <div className="grid gap-4 sm:grid-cols-2">
                      <div>
                        <Label htmlFor="contact-cleaningObjectType" text="Objektart" optional />
                        <select
                          id="contact-cleaningObjectType"
                          disabled={!isScopeStep2Visible || data.service !== "Reinigungsservice"}
                          value={data.cleaningObjectType}
                          onChange={(e) => updateField("cleaningObjectType", e.target.value)}
                          className={CONTACT_STEP2_SELECT_FIELD_CLASS}
                        >
                          <option value="">Bitte wählen</option>
                          <option>Büro</option>
                          <option>Produktion</option>
                          <option>Healthcare</option>
                          <option>Sonstiges</option>
                        </select>
                      </div>
                      <div>
                        <Label htmlFor="contact-cleaningArea" text="Grobe Fläche (m²)" optional />
                        <select
                          id="contact-cleaningArea"
                          disabled={!isScopeStep2Visible || data.service !== "Reinigungsservice"}
                          value={data.cleaningArea}
                          onChange={(e) => updateField("cleaningArea", e.target.value)}
                          className={CONTACT_STEP2_SELECT_FIELD_CLASS}
                        >
                          <option value="">Bitte wählen</option>
                          <option>&lt; 500 m²</option>
                          <option>500–2.000 m²</option>
                          <option>2.000–5.000 m²</option>
                          <option>&gt; 5.000 m²</option>
                        </select>
                      </div>
                      <div>
                        <Label htmlFor="contact-cleaningFrequency" text="Reinigungsfrequenz" optional />
                        <select
                          id="contact-cleaningFrequency"
                          disabled={!isScopeStep2Visible || data.service !== "Reinigungsservice"}
                          value={data.cleaningFrequency}
                          onChange={(e) => updateField("cleaningFrequency", e.target.value)}
                          className={CONTACT_STEP2_SELECT_FIELD_CLASS}
                        >
                          <option value="">Bitte wählen</option>
                          <option>Täglich</option>
                          <option>3×/Woche</option>
                          <option>1×/Woche</option>
                          <option>Nach Bedarf</option>
                        </select>
                      </div>
                      <fieldset>
                        <legend className="text-base font-semibold text-white">Hygieneanforderungen (optional)</legend>
                        <div className="mt-2 grid grid-cols-2 gap-1.5 sm:gap-2 sm:grid-cols-4">
                          {CLEANING_HYGIENE_OPTIONS.map((item) => (
                            <label
                              key={item.value}
                              className="w-full cursor-pointer"
                            >
                              <input
                                type="checkbox"
                                disabled={!isScopeStep2Visible || data.service !== "Reinigungsservice"}
                                checked={data.cleaningHygiene.includes(item.value)}
                                onChange={(e) => {
                                  const next = e.target.checked
                                    ? [...data.cleaningHygiene, item.value]
                                    : data.cleaningHygiene.filter((value) => value !== item.value);
                                  updateField("cleaningHygiene", next);
                                }}
                                className="sr-only"
                              />
                              <div
                                className={clsx(
                                  "h-17 w-full overflow-hidden rounded-lg border transition sm:h-28 md:h-32 sm:rounded-xl",
                                  data.cleaningHygiene.includes(item.value)
                                    ? "border-2 border-white"
                                    : "border-white/40",
                                )}
                              >
                                <img src={item.image} alt={item.value} className="h-full w-full object-cover" />
                              </div>
                              <div className="px-0.5 pt-1 text-center text-white sm:px-1 sm:pt-0.5">
                                <span className="text-sm leading-tight sm:text-lg">{item.value}</span>
                              </div>
                            </label>
                          ))}
                        </div>
                      </fieldset>
                    </div>
                  )}
                  {data.service === "Winterdienst" && (
                    <div className="grid gap-4 sm:grid-cols-2">
                      <fieldset>
                        <legend className="text-base font-semibold text-white">Flächenarten (optional)</legend>
                        <div className="mt-2 grid grid-cols-2 gap-1.5 sm:gap-2 sm:grid-cols-4">
                          {WINTER_AREA_OPTIONS.map((item) => (
                            <label
                              key={item.value}
                              className="w-full cursor-pointer"
                            >
                              <input
                                type="checkbox"
                                disabled={!isScopeStep2Visible || data.service !== "Winterdienst"}
                                checked={data.winterAreas.includes(item.value)}
                                onChange={(e) => {
                                  const next = e.target.checked
                                    ? [...data.winterAreas, item.value]
                                    : data.winterAreas.filter((value) => value !== item.value);
                                  updateField("winterAreas", next);
                                }}
                                className="sr-only"
                              />
                              <div
                                className={clsx(
                                  "h-17 w-full overflow-hidden rounded-lg border transition sm:h-28 md:h-32 sm:rounded-xl",
                                  data.winterAreas.includes(item.value)
                                    ? "border-2 border-white"
                                    : "border-white/40",
                                )}
                              >
                                <img src={item.image} alt={item.value} className="h-full w-full object-cover" />
                              </div>
                              <div className="px-0.5 pt-1 text-center text-white sm:px-1 sm:pt-0.5">
                                <span className="text-sm font-semibold leading-tight sm:text-lg">{item.value}</span>
                              </div>
                            </label>
                          ))}
                        </div>
                      </fieldset>
                      <div>
                        <Label htmlFor="contact-winterWindow" text="Einsatzfenster" optional />
                        <select
                          id="contact-winterWindow"
                          disabled={!isScopeStep2Visible || data.service !== "Winterdienst"}
                          value={data.winterWindow}
                          onChange={(e) => updateField("winterWindow", e.target.value)}
                          className={CONTACT_STEP2_SELECT_FIELD_CLASS}
                        >
                          <option value="">Bitte wählen</option>
                          <option>vor 6 Uhr</option>
                          <option>6–8 Uhr</option>
                          <option>flexibel</option>
                        </select>
                      </div>
                      <div>
                        <p className="text-base font-semibold text-white">Bereitschaftsdienst (optional)</p>
                        <label className="mt-1.5 flex items-center gap-2 text-sm text-white">
                          <input
                            type="checkbox"
                            disabled={!isScopeStep2Visible || data.service !== "Winterdienst"}
                            checked={data.winterOnCall}
                            onChange={(e) => updateField("winterOnCall", e.target.checked)}
                          />
                          Ja
                        </label>
                      </div>
                    </div>
                  )}
                  {data.service === "Gebäudeservice" && (
                    <div className="grid gap-4 sm:grid-cols-2">
                      <fieldset>
                        <legend className="text-base font-semibold text-white">Leistungsbausteine (optional)</legend>
                        <div className="mt-2 grid grid-cols-2 gap-1.5 sm:gap-2 sm:grid-cols-4">
                          {BUILDING_MODULE_OPTIONS.map((item) => (
                            <label
                              key={item.value}
                              className="w-full cursor-pointer"
                            >
                              <input
                                type="checkbox"
                                disabled={!isScopeStep2Visible || data.service !== "Gebäudeservice"}
                                checked={data.buildingModules.includes(item.value)}
                                onChange={(e) => {
                                  const next = e.target.checked
                                    ? [...data.buildingModules, item.value]
                                    : data.buildingModules.filter((value) => value !== item.value);
                                  updateField("buildingModules", next);
                                }}
                                className="sr-only"
                              />
                              <div
                                className={clsx(
                                  "h-17 w-full overflow-hidden rounded-lg border transition sm:h-28 md:h-32 sm:rounded-xl",
                                  data.buildingModules.includes(item.value)
                                    ? "border-2 border-white"
                                    : "border-white/40",
                                )}
                              >
                                <img src={item.image} alt={item.value} className="h-full w-full object-cover" />
                              </div>
                              <div className="px-0.5 pt-1 text-center text-white sm:px-1 sm:pt-0.5">
                                <span className="text-sm font-semibold leading-tight sm:text-lg">{item.value}</span>
                              </div>
                            </label>
                          ))}
                        </div>
                      </fieldset>
                    </div>
                  )}
                </div>

                <div className={clsx(step !== 3 && "hidden")}>
                  <div>
                    <Label htmlFor="contact-company" text="Unternehmen" required />
                    <input
                      id="contact-company"
                      name="company"
                      autoComplete="organization"
                      value={data.company}
                      onChange={(e) => updateField("company", e.target.value)}
                      onBlur={() => validateAndStore("company")}
                      className={clsx("mt-1.5", CONTACT_FIELD_CONTROL_CLASS)}
                    />
                    {errors.company && <p id="contact-company-error" className="mt-1 text-sm text-red-100">Fehler: {errors.company}</p>}
                  </div>

                  <div>
                    <Label htmlFor="contact-contactName" text="Ansprechpartner:in" required />
                    <input
                      id="contact-contactName"
                      name="contactName"
                      autoComplete="name"
                      value={data.contactName}
                      onChange={(e) => updateField("contactName", e.target.value)}
                      onBlur={() => validateAndStore("contactName")}
                      className={clsx("mt-1.5", CONTACT_FIELD_CONTROL_CLASS)}
                    />
                    {errors.contactName && <p id="contact-contactName-error" className="mt-1 text-sm text-red-100">Fehler: {errors.contactName}</p>}
                  </div>

                  <div>
                    <Label htmlFor="contact-email" text="E-Mail-Adresse" required />
                    <input
                      id="contact-email"
                      name="email"
                      type="email"
                      autoComplete="email"
                      value={data.email}
                      onChange={(e) => updateField("email", e.target.value)}
                      onBlur={() => validateAndStore("email")}
                      className={clsx("mt-1.5", CONTACT_FIELD_CONTROL_CLASS)}
                    />
                    {emailTypoHint && <p id="contact-email-hint" className="mt-1 text-sm text-amber-100">{emailTypoHint}</p>}
                    {errors.email && <p id="contact-email-error" className="mt-1 text-sm text-red-100">Fehler: {errors.email}</p>}
                  </div>

                  <div>
                    <Label htmlFor="contact-phone" text="Telefonnummer" optional />
                    <input
                      id="contact-phone"
                      type="tel"
                      name="phone"
                      autoComplete="tel"
                      inputMode="tel"
                      value={data.phone}
                      onChange={(e) => updateField("phone", e.target.value)}
                      onBlur={() => validateAndStore("phone")}
                      className={clsx("mt-1.5", CONTACT_FIELD_CONTROL_CLASS)}
                    />
                  </div>

                  <div>
                    <Label htmlFor="contact-description" text="Beschreibung Ihrer Anfrage" optional />
                    <textarea
                      id="contact-description"
                      name="description"
                      rows={5}
                      maxLength={MAX_DESCRIPTION_LENGTH}
                      placeholder="Welche Leistungen benötigen Sie? (z. B. Unterhaltsreinigung 3×/Woche, Winterdienst für Parkplatz)"
                      value={data.description}
                      onChange={(e) => updateField("description", e.target.value)}
                      onBlur={() => validateAndStore("description")}
                      className={CONTACT_TEXTAREA_FIELD_CLASS}
                    />
                    {remainingChars <= 100 && (
                      <p className="mt-1 text-sm text-white/85" aria-live="polite">
                        Verbleibende Zeichen: {remainingChars}
                      </p>
                    )}
                    {errors.description && <p id="contact-description-error" className="mt-1 text-sm text-red-100">Fehler: {errors.description}</p>}
                  </div>

                  <div className="mt-2">
                    <label className="flex items-center gap-2 text-base font-semibold text-white">
                      <input
                        type="checkbox"
                        checked={data.wantsCallback}
                        onChange={(e) => updateField("wantsCallback", e.target.checked)}
                      />
                      Ich wünsche einen Rückruf <span className="font-normal text-white/85">(optional)</span>
                    </label>
                  </div>

                  <div className={clsx(!data.wantsCallback && "hidden")} aria-hidden={!data.wantsCallback}>
                    <Label htmlFor="contact-callbackWindow" text="Bevorzugter Zeitraum" />
                    <div className="mt-1.5 space-y-4">
                      <div>
                        <p className="text-sm font-semibold text-white/90">Wochentage</p>
                        <div className="mt-1.5 flex flex-wrap gap-2">
                          {CALLBACK_WEEKDAYS.map((day) => {
                            const isSelected = data.callbackDays.includes(day);
                            return (
                              <button
                                key={day}
                                type="button"
                                onClick={() => {
                                  const next = isSelected
                                    ? data.callbackDays.filter((item) => item !== day)
                                    : [...data.callbackDays, day];
                                  updateField("callbackDays", next);
                                  validateAndStore("callbackWindow");
                                }}
                                className={clsx(
                                  "min-w-10 rounded-lg border px-3 py-2 text-base font-semibold transition",
                                  isSelected
                                    ? "border-white bg-white text-[#2A4961]"
                                    : "border-white/50 text-white hover:bg-white/10",
                                )}
                              >
                                {day}
                              </button>
                            );
                          })}
                        </div>
                      </div>

                      <div className="grid max-w-[360px] grid-cols-2 gap-3">
                        <div className="w-full">
                          <p className="mb-1 text-sm font-semibold text-white/90">Von</p>
                          <ModernTimePicker
                            id="contact-callbackFrom"
                            disabled={!data.wantsCallback}
                            value={data.callbackFrom}
                            onChange={(nextTime) => {
                              updateField("callbackFrom", nextTime);
                              validateAndStore("callbackWindow");
                            }}
                          />
                        </div>
                        <div className="w-full">
                          <p className="mb-1 text-sm font-semibold text-white/90">Bis</p>
                          <ModernTimePicker
                            id="contact-callbackTo"
                            disabled={!data.wantsCallback}
                            value={data.callbackTo}
                            onChange={(nextTime) => {
                              updateField("callbackTo", nextTime);
                              validateAndStore("callbackWindow");
                            }}
                          />
                        </div>
                      </div>
                    </div>
                    {errors.callbackWindow && <p className="mt-1 text-sm text-red-100">Fehler: {errors.callbackWindow}</p>}
                  </div>
                </div>

                {step === 3 && (
                  <>
                    <div>
                      <label className="flex items-start gap-2 text-base text-white/90">
                        <input
                          id="contact-privacyConsent"
                          type="checkbox"
                          checked={data.privacyConsent}
                          onChange={(e) => updateField("privacyConsent", e.target.checked)}
                          className="mt-1"
                        />
                        <span>
                          Ich stimme zu, dass meine Angaben zur Bearbeitung meiner Anfrage verarbeitet werden. Details
                          finde ich in der{" "}
                          <Link href="/datenschutz" className="underline underline-offset-2">
                            Datenschutzerklärung
                          </Link>
                          .
                        </span>
                      </label>
                      {errors.privacyConsent && (
                        <p id="contact-privacyConsent-error" className="mt-1 text-sm text-red-100">
                          Fehler: {errors.privacyConsent}
                        </p>
                      )}
                    </div>

                    {submitError && (
                      <p role="alert" className="rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-900">
                        {submitError}
                      </p>
                    )}
                  </>
                )}
                  </div>
                </div>

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

                <div className="mt-6 flex shrink-0 flex-wrap gap-3 border-t border-white/10 pt-4 max-lg:mt-3 max-lg:pt-3 lg:mt-8 lg:border-0 lg:pt-0">
                  {step > 1 && (
                    <button
                      type="button"
                      className="cursor-pointer border-white/60 text-base font-semibold text-white underline underline-offset-2"
                      onClick={() => setStep((prev) => (prev - 1) as Step)}
                    >
                      Zurück
                    </button>
                  )}
                  {step < 3 && (
                    <button
                      type="button"
                      className="flex cursor-pointer items-center justify-center gap-2 rounded-full bg-white px-4 py-3 text-base font-bold text-[#2A4961]"
                      onClick={handleStepNext}
                    >
                      Weiter →
                    </button>
                  )}
                  {step === 3 && (
                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="flex cursor-pointer items-center justify-center gap-2 rounded-full bg-white px-4 py-3 text-base font-bold text-[#2A4961] disabled:cursor-not-allowed disabled:opacity-70"
                    >
                      {isSubmitting && (
                        <span
                          className="h-4 w-4 animate-spin rounded-full border-2 border-[#2A4961] border-t-transparent"
                          aria-hidden
                        />
                      )}
                      {isSubmitting ? "Wird gesendet..." : submitLabel}
                    </button>
                  )}
                </div>
              </form>
            )}
          </div>

          <div className="hidden lg:block">
            <TrustBlock />
            <div className="mt-5 rounded-xl bg-white/15 p-4 text-sm text-white backdrop-blur-xl">
              <p className="font-semibold">Direkter Kontakt</p>
              <a
                href={`tel:${CONTACT_PHONE_TEL}`}
                className="mt-2 block underline"
                onClick={() => pushAnalyticsEvent("call_click", {})}
              >
                {CONTACT_PHONE_DISPLAY}
              </a>
              <a href={`mailto:${CONTACT_EMAIL}`} className="mt-1 block underline">
                {CONTACT_EMAIL}
              </a>
            </div>
            <div className="mt-5 rounded-xl bg-white/15 p-4 text-sm text-white backdrop-blur-xl">
              <p className="font-semibold">Adresse</p>
              <address className="mt-2 not-italic text-white/95">
                {CONTACT_ADDRESS_LINES.map((line) => (
                  <span key={line} className="block">
                    {line}
                  </span>
                ))}
              </address>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
