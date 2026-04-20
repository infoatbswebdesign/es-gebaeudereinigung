"use client";

import Link from "next/link";
import { useEffect, useId, useRef, useState } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { useConsentStore } from "@/lib/consent-store";
import { acquireViewportLock, releaseViewportLock } from "../viewportLock";

gsap.registerPlugin(useGSAP);

/**
 * Rechtskonformes Consent-Modal (DSGVO + TDDDG).
 *
 * - <dialog>-Element mit showModal(): natives Top-Layer + Focus-Trap.
 * - Kein X-Button, Escape unterbunden, kein Backdrop-Klick zum Schliessen.
 * - Drei optisch gleichwertige Aktionsbuttons (Pflicht nach DSK-Leitfaden).
 * - Initial-Fokus auf dem Titel, nicht auf einem Button.
 * - Body/ScrollSmoother via acquireViewportLock pausiert.
 * - Open/Close via GSAP animiert (Panel fade+scale, Backdrop-Blur via CSS).
 */
export default function ConsentModal() {
  const isOpen = useConsentStore((s) => s.isModalOpen);
  const currentExternalMedia = useConsentStore((s) => s.externalMedia);
  const acceptAll = useConsentStore((s) => s.acceptAll);
  const rejectAll = useConsentStore((s) => s.rejectAll);
  const saveSelection = useConsentStore((s) => s.saveSelection);

  const dialogRef = useRef<HTMLDialogElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);
  const previouslyFocusedRef = useRef<HTMLElement | null>(null);
  const lockedRef = useRef(false);

  const titleId = useId();
  const descriptionId = useId();
  const radioGroupName = useId();

  const [localExternalMedia, setLocalExternalMedia] = useState<boolean>(
    currentExternalMedia,
  );
  const [showDetailsNecessary, setShowDetailsNecessary] = useState(false);
  const [showDetailsMaps, setShowDetailsMaps] = useState(false);

  // Escape-Taste dauerhaft unterbinden – Schliessen nur ueber die drei Buttons.
  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;
    const handleCancel = (event: Event) => event.preventDefault();
    dialog.addEventListener("cancel", handleCancel);
    return () => dialog.removeEventListener("cancel", handleCancel);
  }, []);

  // Beim Unmount sicher entsperren, falls das Modal in aktivem Zustand unmountet wird.
  useEffect(() => {
    return () => {
      if (lockedRef.current) {
        releaseViewportLock();
        lockedRef.current = false;
      }
    };
  }, []);

  // Lifecycle des <dialog> via useGSAP (showModal/close, Viewport-Lock, Fokus).
  // Die Box selbst bekommt keine Panel-Animation – nur der ::backdrop-Blur
  // via CSS fuehlt sich wie beim Nav-Menue an.
  useGSAP(
    () => {
      const dialog = dialogRef.current;
      if (!dialog) return;

      if (isOpen) {
        setLocalExternalMedia(currentExternalMedia);

        if (!dialog.open) {
          previouslyFocusedRef.current =
            (document.activeElement as HTMLElement | null) ?? null;
          try {
            dialog.showModal();
          } catch {
            dialog.show();
          }

          if (!lockedRef.current) {
            acquireViewportLock();
            lockedRef.current = true;
          }

          // Fokus bewusst auf den Titel, nicht auf einen Button.
          requestAnimationFrame(() => titleRef.current?.focus());
        }
        return;
      }

      if (!dialog.open) return;

      dialog.close();
      if (lockedRef.current) {
        releaseViewportLock();
        lockedRef.current = false;
      }
      const previous = previouslyFocusedRef.current;
      if (previous && typeof previous.focus === "function") {
        previous.focus();
      }
    },
    { scope: dialogRef, dependencies: [isOpen, currentExternalMedia] },
  );

  const handleSaveSelection = () => {
    saveSelection({ externalMedia: localExternalMedia });
  };

  return (
    <dialog
      ref={dialogRef}
      aria-labelledby={titleId}
      aria-describedby={descriptionId}
      aria-modal="true"
      className="consent-dialog m-auto max-h-[calc(100dvh-1.5rem)] w-[calc(100%-1.5rem)] max-w-[640px] overflow-hidden rounded-2xl border border-neutral-200 bg-white p-0 text-neutral-900 shadow-[0_20px_60px_-20px_rgba(15,23,42,0.35)] backdrop:bg-black/40 backdrop:backdrop-blur-md sm:w-full sm:max-h-[88vh]"
    >
      <div className="flex max-h-[calc(100dvh-1.5rem)] flex-col sm:max-h-[88vh]">
        <header className="px-7 pt-8 pb-5 sm:px-10 sm:pt-10">
          <h2
            id={titleId}
            ref={titleRef}
            tabIndex={-1}
            className="text-[26px] leading-[1.2] font-semibold tracking-tight text-neutral-900 outline-none sm:text-[30px]"
          >
            Datenschutz- und Cookie-Einstellungen
          </h2>
        </header>

        <div className="flex-1 overflow-y-auto px-7 sm:px-10">
          <div className="space-y-5 text-[15px] leading-[1.65] text-neutral-600">
            <p id={descriptionId}>
              Wir verwenden auf dieser Website ausschließlich technisch
              notwendige Speichertechnologien sowie – nach Ihrer Einwilligung –
              die Einbindung von Google Maps zur Anzeige unseres Standorts.
              Andere Cookies oder Tracking-Technologien setzen wir nicht ein.
              Sie können Ihre Einstellungen jederzeit unten im Footer unter
              „Datenschutz- und Cookie-Einstellung" ändern.
            </p>
            <p>
              Weitere Informationen finden Sie in unserer{" "}
              <Link
                href="/datenschutz"
                className="font-medium text-[#2A4961] underline underline-offset-[3px] hover:no-underline"
              >
                Datenschutz- und Cookie-Richtlinie
              </Link>
              .
            </p>
          </div>

          {/* Kategorie 1: Technisch notwendig */}
          <section className="mt-8 border-t border-neutral-200 pt-7">
            <div className="flex items-baseline justify-between gap-4">
              <h3 className="text-[17px] font-semibold tracking-tight text-neutral-900">
                Zwingend erforderlich{" "}
                <span className="font-normal text-neutral-500">
                  (immer aktiv)
                </span>
              </h3>
            </div>
            <p className="mt-2 text-[14.5px] leading-[1.65] text-neutral-600">
              Diese Technologien sind erforderlich, damit die Website
              grundlegend funktioniert, und werden insbesondere genutzt, um
              Ihre Datenschutz-Einstellungen zu speichern und zu respektieren.
            </p>
            <button
              type="button"
              onClick={() => setShowDetailsNecessary((v) => !v)}
              className="mt-3 text-sm font-medium text-[#2A4961] underline underline-offset-[3px] hover:no-underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#7596AE]/50"
              aria-expanded={showDetailsNecessary}
            >
              {showDetailsNecessary ? "Details ausblenden" : "Details anzeigen"}
            </button>
            {showDetailsNecessary && (
              <dl className="mt-4 space-y-3 text-[14px] leading-relaxed">
                <div>
                  <dt className="font-medium text-neutral-900">Zweck</dt>
                  <dd className="text-neutral-600">
                    Speicherung Ihrer Datenschutz-Einstellungen.
                  </dd>
                </div>
                <div>
                  <dt className="font-medium text-neutral-900">Speicher</dt>
                  <dd className="text-neutral-600">
                    LocalStorage unter dem Schlüssel{" "}
                    <code className="rounded bg-neutral-100 px-1 py-0.5 text-[12.5px]">
                      es-gebaeudeservice-consent
                    </code>
                    .
                  </dd>
                </div>
                <div>
                  <dt className="font-medium text-neutral-900">Speicherdauer</dt>
                  <dd className="text-neutral-600">
                    Bis zum Widerruf oder manuellen Löschen durch Sie.
                  </dd>
                </div>
                <div>
                  <dt className="font-medium text-neutral-900">
                    Rechtsgrundlage
                  </dt>
                  <dd className="text-neutral-600">
                    § 25 Abs. 2 Nr. 2 TDDDG (technisch unbedingt erforderlich);
                    Art. 6 Abs. 1 lit. f DSGVO.
                  </dd>
                </div>
              </dl>
            )}
          </section>

          {/* Kategorie 2: Externe Medien – Google Maps */}
          <section className="mt-7 border-t border-neutral-200 pt-7 pb-8">
            <h3 className="text-[17px] font-semibold tracking-tight text-neutral-900">
              Externe Medien – Google Maps
            </h3>
            <p className="mt-2 text-[14.5px] leading-[1.65] text-neutral-600">
              Ermöglicht die Anzeige einer interaktiven Karte zur Darstellung
              unseres Standorts. Beim Laden der Karte werden Daten an Google
              übertragen, u.&nbsp;a. Ihre IP-Adresse.
            </p>

            <fieldset className="mt-5">
              <legend className="sr-only">
                Einwilligung zur Einbindung von Google Maps
              </legend>
              <div className="flex flex-wrap gap-x-7 gap-y-3">
                <label className="inline-flex min-h-[44px] cursor-pointer items-center gap-2.5 text-[15px] text-neutral-800">
                  <input
                    type="radio"
                    name={radioGroupName}
                    value="accept"
                    checked={localExternalMedia === true}
                    onChange={() => setLocalExternalMedia(true)}
                    className="size-4 accent-[#7596AE]"
                  />
                  <span>Akzeptieren</span>
                </label>
                <label className="inline-flex min-h-[44px] cursor-pointer items-center gap-2.5 text-[15px] text-neutral-800">
                  <input
                    type="radio"
                    name={radioGroupName}
                    value="reject"
                    checked={localExternalMedia === false}
                    onChange={() => setLocalExternalMedia(false)}
                    className="size-4 accent-[#7596AE]"
                  />
                  <span>Ablehnen</span>
                </label>
              </div>
            </fieldset>

            <button
              type="button"
              onClick={() => setShowDetailsMaps((v) => !v)}
              className="mt-4 text-sm font-medium text-[#2A4961] underline underline-offset-[3px] hover:no-underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#7596AE]/50"
              aria-expanded={showDetailsMaps}
            >
              {showDetailsMaps ? "Details ausblenden" : "Details anzeigen"}
            </button>
            {showDetailsMaps && (
              <dl className="mt-4 space-y-3 text-[14px] leading-relaxed">
                <div>
                  <dt className="font-medium text-neutral-900">Anbieter</dt>
                  <dd className="text-neutral-600">
                    Google Ireland Ltd., Irland; ggf. Google LLC, USA.
                  </dd>
                </div>
                <div>
                  <dt className="font-medium text-neutral-900">
                    Verarbeitete Daten
                  </dt>
                  <dd className="text-neutral-600">
                    IP-Adresse, Browser-/Geräteinformationen, Referrer,
                    aufgerufene Seite, Karten- und Standortparameter, ggf.
                    bestehende Google-Cookies.
                  </dd>
                </div>
                <div>
                  <dt className="font-medium text-neutral-900">
                    Drittlandtransfer
                  </dt>
                  <dd className="text-neutral-600">
                    USA auf Grundlage des EU-U.S. Data Privacy Framework; ggf.
                    ergänzend Standardvertragsklauseln.
                  </dd>
                </div>
                <div>
                  <dt className="font-medium text-neutral-900">
                    Speicherdauer Ihrer Einwilligung
                  </dt>
                  <dd className="text-neutral-600">
                    6 Monate oder bis zum Widerruf. Weitere Speicherung bei
                    Google nach deren Datenschutzerklärung.
                  </dd>
                </div>
                <div>
                  <dt className="font-medium text-neutral-900">
                    Rechtsgrundlage
                  </dt>
                  <dd className="text-neutral-600">
                    § 25 Abs. 1 TDDDG; Art. 6 Abs. 1 lit. a DSGVO.
                  </dd>
                </div>
                <div>
                  <dt className="font-medium text-neutral-900">
                    Datenschutzerklärung des Anbieters
                  </dt>
                  <dd>
                    <a
                      href="https://policies.google.com/privacy"
                      target="_blank"
                      rel="noreferrer"
                      className="font-medium text-[#2A4961] underline underline-offset-[3px] hover:no-underline"
                    >
                      policies.google.com/privacy
                    </a>
                  </dd>
                </div>
              </dl>
            )}
          </section>
        </div>

        <footer className="border-t border-neutral-200 px-7 py-6 sm:px-10 sm:py-7">
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
            <button
              type="button"
              onClick={rejectAll}
              className="inline-flex min-h-[44px] items-center justify-center rounded-full bg-[#7596AE] px-5 py-2 text-[14px] font-semibold text-white transition-colors hover:bg-[#5e7e96] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#7596AE]/50 focus-visible:ring-offset-2"
            >
              Alle ablehnen
            </button>
            <button
              type="button"
              onClick={handleSaveSelection}
              className="inline-flex min-h-[44px] items-center justify-center rounded-full bg-[#7596AE] px-5 py-2 text-[14px] font-semibold text-white transition-colors hover:bg-[#5e7e96] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#7596AE]/50 focus-visible:ring-offset-2"
            >
              Auswahl speichern
            </button>
            <button
              type="button"
              onClick={acceptAll}
              className="inline-flex min-h-[44px] items-center justify-center rounded-full bg-[#7596AE] px-5 py-2 text-[14px] font-semibold text-white transition-colors hover:bg-[#5e7e96] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#7596AE]/50 focus-visible:ring-offset-2"
            >
              Alle akzeptieren
            </button>
          </div>
          <p className="mt-4 text-center text-[12px] text-neutral-500">
            Einwilligung jederzeit widerrufbar.
          </p>
        </footer>
      </div>
    </dialog>
  );
}
