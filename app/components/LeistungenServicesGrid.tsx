"use client";

import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import Image, { type StaticImageData } from "next/image";
import { scrollToContactForm } from "@/app/components/ScrollToContactButton";
import { BTN_PRIMARY } from "@/app/components/buttonStyles";
import { acquireViewportLock, releaseViewportLock } from "../viewportLock";
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

const MODAL_OPEN_MS = 520;
const MODAL_CLOSE_MS = 380;
const MODAL_EASING = "cubic-bezier(0.32, 0.72, 0, 1)";

type ServiceId =
  | "kehrwochen"
  | "hausmeisterservice"
  | "winterdienst"
  | "unterhaltsreinigung"
  | "praxis-buero-reinigung"
  | "grundreinigung"
  | "glasreinigung"
  | "baugrobreinigung"
  | "gruenanlagenflaechen"
  | "entruempelung";

type ServiceContent = {
  id: ServiceId;
  title: string;
  shortTitle: string;
  imageSrc: StaticImageData;
  imageAlt: string;
  iconPath: string;
  teaser: string;
  description: string;
  highlights: string[];
};

const SERVICES: ServiceContent[] = [
  {
    id: "kehrwochen",
    title: "Kehrwochen",
    shortTitle: "Kehrwochen",
    imageSrc: kehrwochen,
    imageAlt: "Treppenhausreinigung im Rahmen der Kehrwoche",
    iconPath:
      "M3 21h18M5 21V8l7-4 7 4v13M9 21v-6h6v6",
    teaser:
      "Die zuverlässige Übernahme Ihrer Kehrwoche – damit Treppenhaus und Eingang jederzeit sauber sind.",
    description:
      "Wir übernehmen die gesetzlich vorgeschriebene Kehrwoche zuverlässig für Eigentümer, Mieter und Hausverwaltungen – wöchentlich, sauber dokumentiert und mit festen Ansprechpartnern.",
    highlights: [
      "Treppenhaus-, Eingangs- und Gehwegreinigung im wöchentlichen Turnus",
      "Übernahme für Hauseigentümer, Mieter und Hausverwaltungen",
      "Saubere Dokumentation der Einsätze für Ihre Unterlagen",
    ],
  },
  {
    id: "hausmeisterservice",
    title: "Hausmeisterservice",
    shortTitle: "Hausmeister",
    imageSrc: gebaeudeservice,
    imageAlt: "Hausmeister bei Kontrollgang am Objekt",
    iconPath:
      "M11 4a4 4 0 100 8 4 4 0 000-8zm0 10c-3.3 0-6 1.79-6 4v2h8m6-3l2-2-4-4-2 2m4 4l-4-4",
    teaser:
      "Persönlicher Hausmeisterservice mit festen Ansprechpartnern – kleine und große Aufgaben rund um Ihr Objekt.",
    description:
      "Sie erhalten einen festen Ansprechpartner, der sich um die alltäglichen Aufgaben rund um Ihr Gebäude kümmert – von Kontrollgängen über kleine Reparaturen bis hin zur Koordination externer Dienstleister.",
    highlights: [
      "Regelmäßige Kontrollgänge und kleinere Reparaturen",
      "Pflege von Außenanlagen, Müllplatz und Gemeinschaftsflächen",
      "Koordination externer Handwerker und Dienstleister",
    ],
  },
  {
    id: "winterdienst",
    title: "Winterdienst",
    shortTitle: "Winterdienst",
    imageSrc: winterdienst,
    imageAlt: "Winterdienst räumt Gehweg",
    iconPath: "M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z",
    teaser:
      "Räum- und Streudienst bei Schnee und Eis – damit Ihre Wege und Zugänge sicher und nutzbar bleiben.",
    description:
      "Bei Schnee und Eis sorgen wir vorausschauend dafür, dass Wege, Zufahrten und Eingangsbereiche sicher begehbar bleiben – mit kurzen Reaktionszeiten und sauber dokumentierten Einsätzen.",
    highlights: [
      "Wetterorientierte Einsatzplanung mit kurzen Reaktionszeiten",
      "Räumen und Streuen für Gehwege, Zufahrten und Eingänge",
      "Einsatzdokumentation auf Wunsch für Versicherungsnachweise",
    ],
  },
  {
    id: "unterhaltsreinigung",
    title: "Unterhaltsreinigung",
    shortTitle: "Unterhaltsreinigung",
    imageSrc: unterhaltsreinigung,
    imageAlt: "Mitarbeiterin nach abgeschlossener Reinigung",
    iconPath:
      "M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4",
    teaser:
      "Tägliche oder wöchentliche Reinigung im fest vereinbarten Intervall – konstante Sauberkeit für Büro, Praxis und Gewerbe.",
    description:
      "Mit festen Teams, klaren Reinigungsplänen und dokumentierten Qualitätskontrollen halten wir Ihre Räume dauerhaft auf einem konstant hohen Niveau – täglich, wöchentlich oder im individuellen Intervall.",
    highlights: [
      "Boden-, Sanitär- und Oberflächenreinigung nach festem Plan",
      "Auffüllen von Verbrauchsmaterialien (Seife, Papier, etc.)",
      "Feste Teams mit dokumentierten Qualitätskontrollen",
    ],
  },
  {
    id: "praxis-buero-reinigung",
    title: "Praxis- & Büroreinigung",
    shortTitle: "Praxis & Büro",
    imageSrc: reinigungsservice,
    imageAlt: "Hygienische Reinigung sensibler Bereiche",
    iconPath:
      "M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414A1 1 0 0119 9.414V19a2 2 0 01-2 2z",
    teaser:
      "Hygienische, diskrete Reinigung speziell für Praxen und Büros – abgestimmt auf Ihre Sprech- und Geschäftszeiten.",
    description:
      "Für Arzt- und Zahnpraxen sowie Büros reinigen wir nach strengen Hygienestandards – diskret, zuverlässig und auf Wunsch außerhalb Ihrer Sprech- und Geschäftszeiten.",
    highlights: [
      "Hygiene nach Praxis- und Berufsstandards",
      "Reinigung außerhalb der Sprech- und Bürozeiten möglich",
      "Diskrete, geprüfte Mitarbeiter mit Verschwiegenheit",
    ],
  },
  {
    id: "grundreinigung",
    title: "Grundreinigung",
    shortTitle: "Grundreinigung",
    imageSrc: grundreinigung,
    imageAlt: "Planung einer Grundreinigung",
    iconPath:
      "M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z",
    teaser:
      "Intensive Tiefenreinigung für einen kompletten Frischeeffekt – nach Bauarbeiten, vor Mieterwechsel oder als Großputz.",
    description:
      "Mit professionellem Equipment bringen wir Ihr Objekt grundlegend auf Hochglanz – ideal nach Bauphasen, vor einem Mieterwechsel oder als jährliche Komplettpflege.",
    highlights: [
      "Maschinelle Boden- und Belagsreinigung",
      "Entfernung hartnäckiger Verschmutzungen und Rückstände",
      "Rundumpflege inklusive Möbel-, Glas- und Sanitärflächen",
    ],
  },
  {
    id: "glasreinigung",
    title: "Glasreinigung",
    shortTitle: "Glasreinigung",
    imageSrc: glasreinigung,
    imageAlt: "Vorbereitung der Glasreinigung",
    iconPath:
      "M4 6h16M4 6v12a2 2 0 002 2h12a2 2 0 002-2V6M4 6l2-2h12l2 2M12 6v14",
    teaser:
      "Streifenfreie Reinigung von Fenstern, Glasfassaden und Trennwänden – innen wie außen.",
    description:
      "Wir sorgen für einen klaren Durchblick: vom Bürofenster über große Schaufensterfronten bis zur Glasfassade – inklusive Rahmen und schwer erreichbarer Bereiche.",
    highlights: [
      "Fenster- und Rahmenreinigung in allen Etagen",
      "Glasfassaden, Wintergärten und Schaufenster",
      "Fachgerechtes Equipment auch für schwer erreichbare Bereiche",
    ],
  },
  {
    id: "baugrobreinigung",
    title: "Baugrobreinigung",
    shortTitle: "Baugrob",
    imageSrc: baugrobreinigung,
    imageAlt: "Reinigung nach Bauarbeiten",
    iconPath:
      "M11 5.882V19.24a1.76 1.76 0 01-3.417.592l-2.147-6.15M18 13a3 3 0 100-6M5.436 13.683A4.001 4.001 0 017 6h1.832c4.1 0 7.625-1.234 9.168-3v14c-1.543-1.766-5.067-3-9.168-3H7a3.988 3.988 0 01-1.564-.317z",
    teaser:
      "Erstreinigung nach Bauarbeiten oder Renovierungen – bezugsfertig übergeben.",
    description:
      "Nach der Bauphase entfernen wir Bauschutt, Staub und Materialreste, reinigen alle Oberflächen und übergeben Ihr Objekt in einem sauberen, bezugsfertigen Zustand.",
    highlights: [
      "Entfernung von Bauschutt, Klebern und Schutzfolien",
      "Reinigung sämtlicher Oberflächen, Böden und Sanitärbereiche",
      "Übergabe in einem sauberen, bezugsfertigen Zustand",
    ],
  },
  {
    id: "gruenanlagenflaechen",
    title: "Grünanlagenflächen",
    shortTitle: "Grünanlagen",
    imageSrc: gruenanlageflaechen,
    imageAlt: "Pflege von Außenanlagen",
    iconPath:
      "M5 13l4 4L19 7",
    teaser:
      "Pflege von Außenanlagen rund ums Jahr – damit Vorgärten und Grünflächen einladend wirken.",
    description:
      "Vorgärten, Beete und Grünflächen pflegen wir kontinuierlich nach Saisonkalender – damit Ihr Objekt zu jeder Jahreszeit gepflegt und einladend wirkt.",
    highlights: [
      "Rasenpflege, Heckenschnitt und Beetpflege",
      "Laubentfernung und saisonale Grünschnittarbeiten",
      "Wiederkehrende Pflege nach Saisonkalender",
    ],
  },
  {
    id: "entruempelung",
    title: "Entrümpelung",
    shortTitle: "Entrümpelung",
    imageSrc: entruempelung,
    imageAlt: "Entrümpelung und Entsorgung",
    iconPath:
      "M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16",
    teaser:
      "Schnelle und ordnungsgemäße Entrümpelung – inklusive fachgerechter Entsorgung.",
    description:
      "Ob Wohnung, Keller, Dachboden oder Gewerbeobjekt: Wir entrümpeln zügig, entsorgen fachgerecht und übergeben den Raum besenrein.",
    highlights: [
      "Entrümpelung von Wohnungen, Häusern und Gewerbeobjekten",
      "Fachgerechte Entsorgung und Verwertung",
      "Besenreine Übergabe an Eigentümer oder Verwaltung",
    ],
  },
];

export default function LeistungenServicesGrid() {
  const [activeModal, setActiveModal] = useState<ServiceContent | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [portalReady, setPortalReady] = useState(false);
  const closeTimerRef = useRef<number | null>(null);
  const openRafRef = useRef<number | null>(null);

  useEffect(() => {
    setPortalReady(true);
  }, []);

  useEffect(() => {
    if (!isModalOpen || typeof window === "undefined") return undefined;

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setIsModalOpen(false);
      }
    };

    window.addEventListener("keydown", onKeyDown);
    return () => {
      window.removeEventListener("keydown", onKeyDown);
    };
  }, [isModalOpen]);

  useEffect(() => {
    return () => {
      if (closeTimerRef.current !== null) {
        window.clearTimeout(closeTimerRef.current);
      }
      if (openRafRef.current !== null) {
        window.cancelAnimationFrame(openRafRef.current);
      }
    };
  }, []);

  useEffect(() => {
    if (!activeModal || typeof window === "undefined") return undefined;

    acquireViewportLock();
    return () => {
      releaseViewportLock();
    };
  }, [activeModal]);

  const openModal = (id: ServiceId) => {
    const entry = SERVICES.find((item) => item.id === id) ?? null;
    if (!entry) return;

    if (closeTimerRef.current !== null) {
      window.clearTimeout(closeTimerRef.current);
      closeTimerRef.current = null;
    }
    if (openRafRef.current !== null) {
      window.cancelAnimationFrame(openRafRef.current);
      openRafRef.current = null;
    }

    setActiveModal(entry);
    openRafRef.current = window.requestAnimationFrame(() => {
      setIsModalOpen(true);
      openRafRef.current = null;
    });
  };

  const closeModal = () => {
    if (openRafRef.current !== null) {
      window.cancelAnimationFrame(openRafRef.current);
      openRafRef.current = null;
    }
    if (closeTimerRef.current !== null) {
      window.clearTimeout(closeTimerRef.current);
      closeTimerRef.current = null;
    }

    setIsModalOpen(false);
    closeTimerRef.current = window.setTimeout(() => {
      setActiveModal(null);
      closeTimerRef.current = null;
    }, MODAL_CLOSE_MS);
  };

  return (
    <>
      <div className="snap-carousel mt-2 flex transform-gpu gap-6 overflow-x-auto pb-4 pt-2 snap-x snap-mandatory -mx-6 px-6 [scrollbar-width:none] [-ms-overflow-style:none] will-change-transform backface-hidden [&::-webkit-scrollbar]:h-0 [&::-webkit-scrollbar]:w-0 md:mx-0 md:px-0 md:grid md:grid-cols-2 md:gap-6 md:overflow-visible md:pb-0 md:snap-none lg:grid-cols-4">
        {SERVICES.map((service) => (
          <button
            key={service.id}
            type="button"
            onClick={() => openModal(service.id)}
            aria-label={`${service.title} – Details anzeigen`}
            className="group relative h-[420px] w-[280px] shrink-0 snap-center overflow-hidden rounded-2xl text-left transform-[translateZ(0)] backface-hidden cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-slate-900/20 md:h-[440px] md:w-full lg:h-[460px]"
          >
            <div className="absolute inset-0">
              <Image
                src={service.imageSrc}
                alt={service.imageAlt}
                fill
                placeholder="blur"
                className="object-cover transition-transform duration-1600 ease-[cubic-bezier(0.19,1,0.22,1)] group-hover:scale-[1.05]"
                sizes="(max-width: 768px) 280px, (max-width: 1024px) 50vw, 25vw"
              />
              <div className="absolute inset-0 bg-slate-900/60" aria-hidden />
            </div>
            <div className="relative flex h-full flex-col justify-between p-6 text-white">
              <div className="rounded-xl bg-[#7596AE] p-2.5 w-10 h-10 flex items-center justify-center">
                <svg
                  className="size-5 text-white"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  aria-hidden
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d={service.iconPath}
                  />
                </svg>
              </div>
              <div>
                <h3 className="text-xl font-bold leading-tight md:text-2xl">
                  {service.title}
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-white/85 md:text-base">
                  {service.teaser}
                </p>
                <span className="mt-4 inline-block w-fit text-sm font-semibold text-white underline decoration-white/70 underline-offset-4 transition group-hover:decoration-white md:text-base">
                  Mehr erfahren
                  <span aria-hidden> →</span>
                </span>
              </div>
            </div>
          </button>
        ))}
      </div>

      {portalReady &&
        createPortal(
          <div
            className={`fixed inset-0 z-1600 ${
              isModalOpen ? "pointer-events-auto" : "pointer-events-none"
            }`}
            aria-hidden={!isModalOpen}
          >
            <button
              type="button"
              aria-label="Popup schließen"
              onClick={closeModal}
              style={{
                transitionDuration: `${
                  isModalOpen ? MODAL_OPEN_MS : MODAL_CLOSE_MS
                }ms`,
                transitionTimingFunction: MODAL_EASING,
              }}
              className={`absolute inset-0 bg-slate-900/35 backdrop-blur-md will-change-[opacity] transition-opacity ${
                isModalOpen ? "opacity-100" : "opacity-0"
              }`}
            />

            <div className="pointer-events-none absolute inset-0 flex items-center justify-center p-4 md:p-6">
              <div
                role="dialog"
                aria-modal={isModalOpen}
                aria-label={
                  activeModal ? `${activeModal.title} Details` : "Service Details"
                }
                style={{
                  transitionDuration: `${
                    isModalOpen ? MODAL_OPEN_MS : MODAL_CLOSE_MS
                  }ms`,
                  transitionTimingFunction: MODAL_EASING,
                  transformOrigin: "center",
                }}
                className={`pointer-events-auto relative max-h-[calc(100svh-2rem)] w-full max-w-[960px] overflow-hidden rounded-3xl bg-white/85 shadow-[0_24px_80px_rgba(15,23,42,0.3)] will-change-[opacity,transform] transition-[opacity,transform] ${
                  isModalOpen
                    ? "scale-100 opacity-100"
                    : "scale-[0.96] opacity-0"
                }`}
              >
                {activeModal && (
                  <div className="grid max-h-[calc(100svh-4rem)] grid-cols-1 overflow-hidden md:grid-cols-[minmax(300px,38%)_1fr]">
                    <div className="relative h-44 md:h-full md:min-h-[560px]">
                      <Image
                        src={activeModal.imageSrc}
                        alt={activeModal.imageAlt}
                        fill
                        placeholder="blur"
                        className="object-cover"
                        sizes="(max-width: 768px) 100vw, 360px"
                      />
                      <div
                        className="absolute inset-0 bg-linear-to-tr from-slate-900/40 via-slate-900/5 to-transparent"
                        aria-hidden
                      />
                    </div>

                    <div className="relative flex h-full min-h-0 flex-col p-6 md:p-10">
                      <button
                        type="button"
                        aria-label="Popup schließen"
                        onClick={closeModal}
                        className="absolute right-4 top-4 inline-flex h-9 w-9 items-center justify-center rounded-full border border-slate-300/70 bg-white/80 text-slate-700 transition hover:bg-slate-100"
                      >
                        <svg
                          className="size-4"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          aria-hidden
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M6 18L18 6M6 6l12 12"
                          />
                        </svg>
                      </button>

                      <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#7596AE]">
                        Leistungsdetails
                      </p>
                      <h3 className="mt-2 pr-10 text-2xl font-bold text-slate-900 md:text-3xl">
                        {activeModal.title}
                      </h3>
                      <p className="mt-4 text-sm leading-relaxed text-slate-700 md:text-base">
                        {activeModal.description}
                      </p>

                      <ul className="mt-6 space-y-2.5 md:space-y-3">
                        {activeModal.highlights.map((item) => (
                          <li
                            key={item}
                            className="flex items-start gap-3 text-sm leading-relaxed text-slate-700 md:text-base"
                          >
                            <span
                              className="mt-2 h-2 w-2 shrink-0 rounded-full bg-[#7596AE]"
                              aria-hidden
                            />
                            <span>{item}</span>
                          </li>
                        ))}
                      </ul>

                      <div className="mt-auto flex flex-wrap gap-3 pt-6">
                        <button
                          type="button"
                          onClick={() => {
                            closeModal();
                            window.setTimeout(() => {
                              scrollToContactForm();
                            }, MODAL_CLOSE_MS);
                          }}
                          className={BTN_PRIMARY}
                        >
                          Jetzt anfragen
                        </button>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>,
          document.body,
        )}
    </>
  );
}
