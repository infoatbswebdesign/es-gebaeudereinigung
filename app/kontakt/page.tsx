import type { Metadata } from "next";
import {
  CONTACT_ADDRESS_LINES,
  CONTACT_EMAIL,
  CONTACT_PHONE_DISPLAY,
  CONTACT_PHONE_TEL,
} from "@/app/contact";

export const metadata: Metadata = {
  title: "Kontakt | ES Gebäudereinigung",
  description:
    "Kontaktieren Sie ES Gebäudereinigung im Raum Stuttgart und Esslingen. Hier finden Sie Telefon, E-Mail, Adresse und Standort auf Google Maps.",
  openGraph: {
    title: "Kontakt | ES Gebäudereinigung",
    description:
      "Telefon, E-Mail und Standort von ES Gebäudereinigung im Raum Stuttgart und Esslingen.",
    type: "website",
  },
};

export default function KontaktPage() {
  return (
    <main>
      <section
        className="bg-[#7596AE] px-6 pt-40 pb-14 md:px-12 md:pt-28 md:pb-20"
        aria-labelledby="kontakt-page-heading"
      >
        <div className="mx-auto max-w-7xl">
          <h1
            id="kontakt-page-heading"
            className="text-3xl font-bold leading-tight text-white md:text-4xl lg:text-5xl"
          >
            Kontakt
          </h1>
          <p className="mt-4 max-w-2xl text-base leading-relaxed text-white/95 md:text-lg">
            Für Anfragen rund um Gebäudereinigung, Unterhaltsreinigung und
            individuelle Leistungen sind wir gerne für Sie da. Melden Sie sich
            telefonisch oder per E-Mail - wir antworten schnell und zuverlässig.
          </p>
        </div>
      </section>

      <section
        className="bg-white px-6 py-12 md:px-12 md:py-16"
        aria-label="Kontaktinformationen"
      >
        <div className="mx-auto max-w-7xl">
          <div className="grid gap-8 lg:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)] lg:gap-14">
            <div>
              <div className="grid gap-4 sm:grid-cols-2">
                <article className="rounded-2xl border border-slate-200 bg-white p-6 shadow-lg shadow-slate-200/50">
                  <h3 className="text-lg font-bold text-slate-900">Telefon</h3>
                  <a
                    href={`tel:${CONTACT_PHONE_TEL}`}
                    className="mt-2 inline-block text-base font-medium text-sky-800 underline decoration-sky-300 underline-offset-4 hover:text-sky-900"
                  >
                    {CONTACT_PHONE_DISPLAY}
                  </a>
                </article>

                <article className="rounded-2xl border border-slate-200 bg-white p-6 shadow-lg shadow-slate-200/50">
                  <h3 className="text-lg font-bold text-slate-900">E-Mail</h3>
                  <a
                    href={`mailto:${CONTACT_EMAIL}`}
                    className="mt-2 inline-block text-base font-medium text-sky-800 underline decoration-sky-300 underline-offset-4 hover:text-sky-900"
                  >
                    {CONTACT_EMAIL}
                  </a>
                </article>
              </div>

              <article className="mt-4 rounded-2xl border border-slate-200 bg-[#F8FAFC] p-6">
                <h3 className="text-lg font-bold text-slate-900">Adresse</h3>
                <address className="mt-2 not-italic text-base leading-relaxed text-slate-700">
                  {CONTACT_ADDRESS_LINES.map((line) => (
                    <span key={line} className="block">
                      {line}
                    </span>
                  ))}
                </address>
              </article>
            </div>

            <div className="rounded-3xl border border-slate-200 bg-white p-3 shadow-xl shadow-slate-200/70">
              <div className="relative aspect-4/3 overflow-hidden rounded-2xl">
                <iframe
                  title="Google Maps Standort ES Gebäudereinigung"
                  src={`https://www.google.com/maps?q=${encodeURIComponent(CONTACT_ADDRESS_LINES.join(", "))}&output=embed`}
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  className="h-full w-full border-0"
                />
              </div>
              <p className="px-1 pt-4 text-sm leading-relaxed text-slate-600">
                Unser Einsatzgebiet umfasst Esslingen, Stuttgart und die umliegende
                Region.
              </p>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
