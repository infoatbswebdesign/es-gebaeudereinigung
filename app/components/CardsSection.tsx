"use client";

import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import Image from "next/image";
import Link from "next/link";
import ScrollToContactButton, {
  scrollToContactForm,
} from "@/app/components/ScrollToContactButton";
import { acquireViewportLock, releaseViewportLock } from "../viewportLock";

const CARD1_IMAGE = "/reinigungsservice-es-gebaeudeservice.jpg";
const REINIGUNG_IMAGE = "/reinigungsservice-es-gebaeudeservice.jpg";
const WINTERDIENST_IMAGE = "/winterdienst-es-gebaeudeservice.jpg";
const GEBAEUDESERVICE_IMAGE = "/gebaeudeservice-es-gebaeudeservice.jpg";
const MODAL_ANIMATION_MS = 520;

type ServiceModalContent = {
  id: "reinigung" | "winterdienst" | "gebaeudeservice";
  title: string;
  imageSrc: string;
  imageAlt: string;
  description: string;
  highlights: string[];
};

const SERVICE_MODAL_CONTENT: ServiceModalContent[] = [
  {
    id: "reinigung",
    title: "Reinigungsservice",
    imageSrc: REINIGUNG_IMAGE,
    imageAlt: "Mitarbeiterin im Reinigungsservice bei der Planung",
    description:
      "Wir erstellen einen klaren Reinigungsplan, der exakt zu Ihrem Objekt passt und dauerhaft für einen professionellen Eindruck sorgt.",
    highlights: [
      "Unterhalts-, Büro- und Treppenhausreinigung nach festen Intervallen",
      "Flexible Einsätze am Morgen, tagsüber oder nach Geschäftsschluss",
      "Feste Ansprechpartner, dokumentierte Abläufe und transparente Qualitätssicherung",
    ],
  },
  {
    id: "winterdienst",
    title: "Winterdienst",
    imageSrc: WINTERDIENST_IMAGE,
    imageAlt: "Abgeschlossener Serviceeinsatz für sichere Wege",
    description:
      "Bei Schnee und Eis kümmern wir uns zuverlässig um die Sicherheit Ihrer Außenflächen - vorausschauend, schnell und ordentlich dokumentiert.",
    highlights: [
      "Räum- und Streudienst für Gehwege, Zufahrten und Eingangsbereiche",
      "Wetterorientierte Einsatzplanung mit kurzen Reaktionszeiten",
      "Regelmäßige Kontrollfahrten in kritischen Zeitfenstern",
    ],
  },
  {
    id: "gebaeudeservice",
    title: "Gebäudeservice",
    imageSrc: GEBAEUDESERVICE_IMAGE,
    imageAlt: "Persönliche Abstimmung für einen ganzheitlichen Gebäudeservice",
    description:
      "Sie erhalten alle Dienstleistungen aus einer Hand - zentral koordiniert, effizient umgesetzt und auf die Anforderungen Ihrer Immobilie abgestimmt.",
    highlights: [
      "Kombination aus Reinigung, Pflege und saisonalen Services",
      "Weniger Abstimmungsaufwand durch gebündelte Organisation",
      "Skalierbare Leistungen für einzelne Objekte oder größere Portfolios",
    ],
  },
];

export default function CardsSection() {
  const [activeModal, setActiveModal] = useState<ServiceModalContent | null>(null);
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

  const openModal = (id: ServiceModalContent["id"]) => {
    const entry = SERVICE_MODAL_CONTENT.find((item) => item.id === id) ?? null;
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
    }, MODAL_ANIMATION_MS);
  };

  return (
    <>
      <section
        className="relative z-0 bg-[#F1F0EC] pt-20 pb-16 pl-6 pr-6 transform-[translateZ(0)] backface-hidden md:pt-28 md:pb-24 md:px-12"
        aria-labelledby="cards-heading"
      >
        <div className="mx-auto max-w-7xl">
          <h2
            id="cards-heading"
            className="mx-auto max-w-2xl text-center text-2xl font-bold leading-tight text-slate-900 md:text-3xl lg:text-4xl"
          >
            Unsere Leistungen
          </h2>
          <div className="scroll-none not-odd:odd:pl-6"></div>

          {/* Cards: Desktop 4 Spalten, Mobile horizontal Snap-Scroll */}
          <div className="snap-carousel mt-12 mb-10 flex transform-gpu gap-6 overflow-x-auto pb-4 pt-2 snap-x snap-mandatory -mx-6 px-6 [scrollbar-width:none] [-ms-overflow-style:none] will-change-transform backface-hidden [&::-webkit-scrollbar]:h-0 [&::-webkit-scrollbar]:w-0 md:mx-0 md:px-0 md:mt-16 md:mb-14 md:grid md:grid-cols-4 md:overflow-visible md:pb-0 md:snap-none">
            {/* Card 1: Portrait mit Hintergrundbild + Overlay + Content – feste Höhe gegen Layout-Shift */}
            <article className="relative h-[420px] w-[280px] shrink-0 snap-center overflow-hidden rounded-2xl transform-[translateZ(0)] backface-hidden md:h-[480px] md:w-full">
              <div className="absolute inset-0">
                <Image
                  src={CARD1_IMAGE}
                  alt="Reinigungsservice: Putzmittel im Einsatz"
                  fill
                  className="object-cover"
                  sizes="(max-width: 768px) 280px, 25vw"
                />
                <div className="absolute inset-0 bg-slate-900/60" aria-hidden />
              </div>
              <div className="relative flex h-full flex-col justify-between p-6 text-white">
                <div className="rounded-xl bg-[#7596AE] p-2.5 w-10 h-10 flex items-center justify-center">
                  <svg className="size-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden>
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
                  </svg>
                </div>
                <div>
                  <p className="text-lg font-semibold leading-snug md:text-xl">
                    Die erste Anlaufstelle für Ihre gewerbliche Reinigung.
                  </p>
                  <ScrollToContactButton className="mt-4 inline-block rounded-full bg-[#7596AE] px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-[#7596AE] focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2 focus:ring-offset-slate-900/20">
                    Jetzt anfragen
                  </ScrollToContactButton>
                </div>
              </div>
            </article>

            {/* Card 2: Weiß, Icon, Titel, Text, Link */}
            <article className="flex min-h-[420px] w-[280px] shrink-0 snap-center flex-col rounded-2xl bg-white p-6 shadow-lg shadow-slate-200/60 transform-[translateZ(0)] backface-hidden md:min-h-[480px] md:w-full">
              <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-xl bg-slate-800 text-white">
                <svg className="size-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden>
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-slate-900">Reinigungsservice</h3>
              <p className="mt-3 flex-1 text-sm leading-relaxed text-slate-600">
                Professionelle Reinigung für Ihr Objekt – regelmäßig, zuverlässig und an Ihre Anforderungen angepasst.
              </p>
              <button
                type="button"
                onClick={() => openModal("reinigung")}
                className="mt-4 w-fit font-medium text-slate-900 underline decoration-slate-300 underline-offset-2 transition hover:decoration-slate-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#7596AE]/40 rounded-sm"
              >
                Mehr erfahren
                <span aria-hidden> →</span>
              </button>
            </article>

            {/* Card 3 */}
            <article className="flex min-h-[420px] w-[280px] shrink-0 snap-center flex-col rounded-2xl bg-white p-6 shadow-lg shadow-slate-200/60 transform-[translateZ(0)] backface-hidden md:min-h-[480px] md:w-full">
              <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-700 text-white">
                <svg className="size-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden>
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-slate-900">Winterdienst</h3>
              <p className="mt-3 flex-1 text-sm leading-relaxed text-slate-600">
                Räum- und Streudienst bei Schnee und Eis – damit Ihre Wege und Zugänge sicher und nutzbar bleiben.
              </p>
              <button
                type="button"
                onClick={() => openModal("winterdienst")}
                className="mt-4 w-fit font-medium text-slate-900 underline decoration-slate-300 underline-offset-2 transition hover:decoration-slate-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#7596AE]/40 rounded-sm"
              >
                Mehr erfahren
                <span aria-hidden> →</span>
              </button>
            </article>

            {/* Card 4 */}
            <article className="flex min-h-[420px] w-[280px] shrink-0 snap-center flex-col rounded-2xl bg-white p-6 shadow-lg shadow-slate-200/60 transform-[translateZ(0)] backface-hidden md:min-h-[480px] md:w-full">
              <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-xl bg-sky-700 text-white">
                <svg className="size-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden>
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-slate-900">Gebäudeservice</h3>
              <p className="mt-3 flex-1 text-sm leading-relaxed text-slate-600">
                Rundum-Service für Ihr Gebäude: von der Reinigung bis zum Winterdienst – eine Anlaufstelle für Ihr Objekt.
              </p>
              <button
                type="button"
                onClick={() => openModal("gebaeudeservice")}
                className="mt-4 w-fit font-medium text-slate-900 underline decoration-slate-300 underline-offset-2 transition hover:decoration-slate-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#7596AE]/40 rounded-sm"
              >
                Mehr erfahren
                <span aria-hidden> →</span>
              </button>
            </article>
          </div>
        </div>
      </section>

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
              className={`absolute inset-0 bg-slate-900/35 backdrop-blur-md will-change-[opacity] transition-opacity duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] ${
                isModalOpen ? "opacity-100" : "opacity-0"
              }`}
            />

            <div
              className="absolute inset-0 flex items-center justify-center p-4 md:p-6"
            >
            <div
              role="dialog"
              aria-modal={isModalOpen}
              aria-label={activeModal ? `${activeModal.title} Details` : "Service Details"}
              className={`relative max-h-[calc(100dvh-2rem)] w-full max-w-[960px] overflow-hidden rounded-3xl bg-white/85 shadow-[0_24px_80px_rgba(15,23,42,0.3)] will-change-transform transition-[opacity,transform] duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] ${
                isModalOpen ? "translate-y-0 scale-100 opacity-100" : "translate-y-6 scale-[0.96] opacity-0"
              }`}
            >
              {activeModal && (
                <div className="grid max-h-[calc(100dvh-4rem)] grid-cols-1 overflow-hidden md:grid-cols-[minmax(300px,38%)_1fr]">
                  <div className="relative h-44 md:h-full md:min-h-[560px]">
                    <Image
                      src={activeModal.imageSrc}
                      alt={activeModal.imageAlt}
                      fill
                      className="object-cover"
                      sizes="(max-width: 768px) 100vw, 360px"
                    />
                    <div className="absolute inset-0 bg-linear-to-tr from-slate-900/40 via-slate-900/5 to-transparent" aria-hidden />
                  </div>

                  <div className="relative flex h-full min-h-0 flex-col p-6 md:p-10">
                    <button
                      type="button"
                      aria-label="Popup schließen"
                      onClick={closeModal}
                      className="absolute right-4 top-4 inline-flex h-9 w-9 items-center justify-center rounded-full border border-slate-300/70 bg-white/80 text-slate-700 transition hover:bg-slate-100"
                    >
                      <svg className="size-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" aria-hidden>
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>

                    <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#7596AE]">Leistungsdetails</p>
                    <h3 className="mt-2 pr-10 text-2xl font-bold text-slate-900 md:text-3xl">{activeModal.title}</h3>
                    <p className="mt-4 text-sm leading-relaxed text-slate-700 md:text-base">{activeModal.description}</p>

                    <ul className="mt-6 space-y-2.5 md:space-y-3">
                      {activeModal.highlights.map((item) => (
                        <li key={item} className="flex items-start gap-3 text-sm leading-relaxed text-slate-700 md:text-base">
                          <span className="mt-2 h-2 w-2 shrink-0 rounded-full bg-[#7596AE]" aria-hidden />
                          <span>{item}</span>
                        </li>
                      ))}
                    </ul>

                    <div className="mt-auto pt-6 flex flex-wrap gap-3">
                      <Link
                        href={`/leistungen#${activeModal.id}`}
                        onClick={closeModal}
                        className="inline-flex items-center rounded-full bg-[#7596AE] px-5 py-2.5 text-sm font-semibold text-white transition hover:brightness-95"
                      >
                        Zur Leistung
                      </Link>
                      <button
                        type="button"
                        onClick={() => {
                          closeModal();
                          window.setTimeout(() => {
                            scrollToContactForm();
                          }, MODAL_ANIMATION_MS);
                        }}
                        className="inline-flex items-center rounded-full border border-slate-300 bg-white px-5 py-2.5 text-sm font-semibold text-slate-800 transition hover:bg-slate-50"
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
          document.body
        )}
    </>
  );
}
