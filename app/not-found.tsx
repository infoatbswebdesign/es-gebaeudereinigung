import Link from "next/link";
import type { Metadata } from "next";
import { BTN_PRIMARY, BTN_SECONDARY } from "@/app/components/buttonStyles";
import { SITE_NAME } from "@/lib/seo";

export const metadata: Metadata = {
  title: { absolute: `Seite nicht gefunden | ${SITE_NAME}` },
  description:
    "Die aufgerufene Seite existiert nicht oder wurde verschoben. Kehren Sie zur Startseite zurück oder besuchen Sie unsere Leistungsübersicht.",
  robots: {
    index: false,
    follow: false,
  },
};

export default function NotFound() {
  return (
    <main>
      <section
        className="bg-[#7596AE] px-6 pt-40 pb-14 md:px-12 md:pt-28 md:pb-20"
        aria-labelledby="not-found-heading"
      >
        <div className="mx-auto max-w-7xl">
          <p className="text-sm font-semibold uppercase tracking-[0.18em] text-white/80">
            Fehler 404
          </p>
          <h1
            id="not-found-heading"
            className="mt-3 text-3xl font-bold leading-tight text-white md:text-4xl lg:text-5xl"
          >
            Seite nicht gefunden.
          </h1>
          <p className="mt-4 max-w-2xl text-lg leading-relaxed text-white/90 md:text-xl">
            Die Seite, die Sie aufrufen wollten, existiert nicht oder wurde
            verschoben.
          </p>
        </div>
      </section>

      <section
        className="bg-white px-6 py-12 md:px-12 md:py-16 md:pb-24"
        aria-label="Weiterführende Navigation"
      >
        <div className="mx-auto max-w-3xl">
          <h2 className="text-xl font-bold text-slate-900 md:text-2xl">
            Was möchten Sie als Nächstes tun?
          </h2>
          <p className="mt-4 text-base leading-relaxed text-slate-700 md:text-lg">
            Starten Sie auf der Startseite neu oder sehen Sie sich unsere
            Leistungen an.
          </p>
          <div className="mt-8 flex flex-wrap items-center gap-x-6 gap-y-3">
            <Link href="/" className={BTN_PRIMARY}>
              Zur Startseite
            </Link>
            <Link href="/leistungen" className={BTN_SECONDARY}>
              Leistungen ansehen
              <span aria-hidden>→</span>
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
