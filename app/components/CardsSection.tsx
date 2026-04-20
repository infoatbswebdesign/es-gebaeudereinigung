"use client";

import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import Image, { type StaticImageData } from "next/image";
import Link from "next/link";
import ScrollToContactButton, {
  scrollToContactForm,
} from "@/app/components/ScrollToContactButton";
import { BTN_PRIMARY, BTN_SECONDARY } from "@/app/components/buttonStyles";
import { acquireViewportLock, releaseViewportLock } from "../viewportLock";
import {
  reinigungsservice,
  winterdienst,
} from "@/app/assets/images";

const CARD1_IMAGE = reinigungsservice;
const PRAXIS_BUERO_IMAGE = reinigungsservice;
const WINTERDIENST_IMAGE = winterdienst;
const MODAL_OPEN_MS = 520;
const MODAL_CLOSE_MS = 380;
const MODAL_EASING = "cubic-bezier(0.32, 0.72, 0, 1)";

type ServiceModalContent = {
  id: "praxis-buero" | "winterdienst";
  title: string;
  imageSrc: StaticImageData;
  imageAlt: string;
  description: string;
  highlights: string[];
};

const SERVICE_MODAL_CONTENT: ServiceModalContent[] = [
  {
    id: "praxis-buero",
    title: "Praxis & Büroreinigung",
    imageSrc: PRAXIS_BUERO_IMAGE,
    imageAlt: "Hygienische Reinigung in einer Praxis in Esslingen",
    description:
      "Arztpraxen, Zahnpraxen und Büros in Esslingen und Umgebung reinigen wir nach strengen Hygienestandards. Diskret, zuverlässig und auf Wunsch außerhalb Ihrer Sprech- und Geschäftszeiten.",
    highlights: [
      "Hygienereinigung nach Praxis- und Berufsstandards",
      "Reinigung vor, während oder nach Ihren Sprech- und Bürozeiten",
      "Feste, geprüfte Teams mit Verschwiegenheit und kurzen Wegen in Esslingen",
    ],
  },
  {
    id: "winterdienst",
    title: "Winterdienst",
    imageSrc: WINTERDIENST_IMAGE,
    imageAlt: "Winterdienst räumt Gehweg in Esslingen",
    description:
      "Räum- und Streudienst bei Schnee und Eis für Objekte in Esslingen und Umgebung. Wir halten Gehwege, Zufahrten und Eingänge zuverlässig frei, dokumentieren jeden Einsatz und reagieren auch in kritischen Zeitfenstern schnell.",
    highlights: [
      "Räum- und Streudienst für Gehwege, Zufahrten und Eingangsbereiche",
      "Wetterorientierte Einsatzplanung mit kurzen Reaktionszeiten in Esslingen",
      "Einsatzdokumentation auf Wunsch für Versicherungs und Haftungsnachweise",
    ],
  },
];

export default function CardsSection() {
  const [activeModal, setActiveModal] = useState<ServiceModalContent | null>(
    null,
  );
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
    }, MODAL_CLOSE_MS);
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
                  placeholder="blur"
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
                    Ihre erste Anlaufstelle für gewerbliche Gebäudereinigung in Esslingen und Umgebung.
                  </p>
                  <ScrollToContactButton className={`mt-4 ${BTN_PRIMARY}`}>
                    Jetzt anfragen
                  </ScrollToContactButton>
                </div>
              </div>
            </article>

            {/* Card 2: Praxis & Büroreinigung */}
            <article className="flex min-h-[420px] w-[280px] shrink-0 snap-center flex-col rounded-2xl bg-white p-6 shadow-lg shadow-slate-200/60 transform-[translateZ(0)] backface-hidden md:min-h-[480px] md:w-full">
              <button
                type="button"
                onClick={() => openModal("praxis-buero")}
                className="flex min-h-0 flex-1 flex-col text-left outline-none focus-visible:ring-2 focus-visible:ring-[#7596AE]/40 focus-visible:ring-offset-2 rounded-xl"
              >
                <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-xl bg-slate-800 text-white">
                  <svg className="size-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden>
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414A1 1 0 0119 9.414V19a2 2 0 01-2 2z" />
                  </svg>
                </div>
                <h3 className="text-xl font-bold text-slate-900">Praxis & Büroreinigung</h3>
                <p className="mt-3 flex-1 text-sm leading-relaxed text-slate-600">
                  Hygienische Praxisreinigung und Büroreinigung in Esslingen. Diskret, zuverlässig und auf Wunsch außerhalb Ihrer Sprech- und Geschäftszeiten.
                </p>
                <span className="sr-only">Details im Dialog anzeigen</span>
              </button>
              <Link href="/leistungen" className={`mt-4 w-fit ${BTN_SECONDARY}`}>
                Alle Leistungen entdecken
                <span aria-hidden>→</span>
              </Link>
            </article>

            {/* Card 3: Winterdienst */}
            <article className="flex min-h-[420px] w-[280px] shrink-0 snap-center flex-col rounded-2xl bg-white p-6 shadow-lg shadow-slate-200/60 transform-[translateZ(0)] backface-hidden md:min-h-[480px] md:w-full">
              <button
                type="button"
                onClick={() => openModal("winterdienst")}
                className="flex min-h-0 flex-1 flex-col text-left outline-none focus-visible:ring-2 focus-visible:ring-[#7596AE]/40 focus-visible:ring-offset-2 rounded-xl"
              >
                <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-700 text-white">
                  <svg className="size-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden>
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <h3 className="text-xl font-bold text-slate-900">Winterdienst</h3>
                <p className="mt-3 flex-1 text-sm leading-relaxed text-slate-600">
                  Räum- und Streudienst in Esslingen bei Schnee und Eis. Wir halten Ihre Gehwege, Zufahrten und Eingänge zuverlässig frei.
                </p>
                <span className="sr-only">Details im Dialog anzeigen</span>
              </button>
              <Link href="/leistungen" className={`mt-4 w-fit ${BTN_SECONDARY}`}>
                Alle Leistungen entdecken
                <span aria-hidden>→</span>
              </Link>
            </article>

            {/* Card 4: Mehr Services */}
            <article className="flex min-h-[420px] w-[280px] shrink-0 snap-center flex-col rounded-2xl bg-white p-6 shadow-lg shadow-slate-200/60 transform-[translateZ(0)] backface-hidden md:min-h-[480px] md:w-full">
              <Link
                href="/leistungen"
                className="flex min-h-0 flex-1 flex-col text-left outline-none focus-visible:ring-2 focus-visible:ring-[#7596AE]/40 focus-visible:ring-offset-2 rounded-xl"
              >
                <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-xl bg-sky-700 text-white">
                  <svg className="size-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden>
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
                  </svg>
                </div>
                <h3 className="text-xl font-bold text-slate-900">Mehr Services</h3>
                <p className="mt-3 flex-1 text-sm leading-relaxed text-slate-600">
                  Glasreinigung, Grundreinigung, Hausmeisterservice, Baugrobreinigung und weitere Leistungen für Ihre Immobilie in Esslingen und Umgebung.
                </p>
                <span className="sr-only">Alle Leistungen anzeigen</span>
              </Link>
              <Link href="/leistungen" className={`mt-4 w-fit ${BTN_SECONDARY}`}>
                Alle Leistungen entdecken
                <span aria-hidden>→</span>
              </Link>
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

            <div
              className="pointer-events-none absolute inset-0 flex items-center justify-center p-4 md:p-6"
            >
            <div
              role="dialog"
              aria-modal={isModalOpen}
              aria-label={activeModal ? `${activeModal.title} Details` : "Service Details"}
              style={{
                transitionDuration: `${
                  isModalOpen ? MODAL_OPEN_MS : MODAL_CLOSE_MS
                }ms`,
                transitionTimingFunction: MODAL_EASING,
                transformOrigin: "center",
              }}
              className={`pointer-events-auto relative max-h-[calc(100svh-2rem)] w-full max-w-[960px] overflow-hidden rounded-3xl bg-white/85 shadow-[0_24px_80px_rgba(15,23,42,0.3)] will-change-[opacity,transform] transition-[opacity,transform] ${
                isModalOpen ? "scale-100 opacity-100" : "scale-[0.96] opacity-0"
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

                    <div className="mt-auto pt-6 flex flex-wrap items-center gap-x-6 gap-y-3">
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
                      <Link
                        href="/leistungen"
                        onClick={closeModal}
                        className={BTN_SECONDARY}
                      >
                        Alle Leistungen entdecken
                      </Link>
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
