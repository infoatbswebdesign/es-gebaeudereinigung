"use client";

import { useEffect } from "react";
import Link from "next/link";
import { BTN_PRIMARY, BTN_SECONDARY } from "@/app/components/buttonStyles";
import { CONTACT_PHONE_DISPLAY, CONTACT_PHONE_TEL } from "@/app/contact";

type ErrorProps = {
  error: Error & { digest?: string };
  reset: () => void;
};

export default function ErrorBoundary({ error, reset }: ErrorProps) {
  useEffect(() => {
    // Best-Effort-Logging; Sentry/Logflare etc. würden hier andocken.
    console.error("[app/error]", error);
  }, [error]);

  return (
    <main>
      <section
        className="bg-[#7596AE] px-6 pt-40 pb-14 md:px-12 md:pt-28 md:pb-20"
        aria-labelledby="error-heading"
      >
        <div className="mx-auto max-w-7xl">
          <p className="text-sm font-semibold uppercase tracking-[0.18em] text-white/80">
            Unerwarteter Fehler
          </p>
          <h1
            id="error-heading"
            className="mt-3 text-3xl font-bold leading-tight text-white md:text-4xl lg:text-5xl"
          >
            Da ist etwas schiefgelaufen.
          </h1>
          <p className="mt-4 max-w-2xl text-lg leading-relaxed text-white/90 md:text-xl">
            Entschuldigung, beim Laden dieser Seite ist ein Fehler aufgetreten.
            Bitte versuchen Sie es erneut oder rufen Sie uns kurz an.
          </p>
          {error?.digest ? (
            <p className="mt-4 text-xs text-white/70">
              Fehler-ID: <code className="font-mono">{error.digest}</code>
            </p>
          ) : null}
        </div>
      </section>

      <section
        className="bg-white px-6 py-12 md:px-12 md:py-16 md:pb-24"
        aria-label="Weiterführende Aktionen"
      >
        <div className="mx-auto max-w-3xl">
          <div className="flex flex-wrap items-center gap-x-6 gap-y-3">
            <button
              type="button"
              onClick={() => reset()}
              className={BTN_PRIMARY}
            >
              Seite neu laden
            </button>
            <Link href="/" className={BTN_SECONDARY}>
              Zur Startseite
              <span aria-hidden>→</span>
            </Link>
            <a href={`tel:${CONTACT_PHONE_TEL}`} className={BTN_SECONDARY}>
              {CONTACT_PHONE_DISPLAY}
            </a>
          </div>
        </div>
      </section>
    </main>
  );
}
