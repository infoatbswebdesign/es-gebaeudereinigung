import Link from "next/link";
import type { Metadata } from "next";
import GoogleMapGate from "@/app/components/GoogleMapGate";
import { BTN_PRIMARY, BTN_SECONDARY } from "@/app/components/buttonStyles";
import {
  CONTACT_ADDRESS_LINES,
  CONTACT_EMAIL,
  CONTACT_PHONE_DISPLAY,
  CONTACT_PHONE_TEL,
} from "@/app/contact";
import {
  BUSINESS_ADDRESS,
  EINSATZGEBIETE,
  SITE_NAME,
  breadcrumbJsonLd,
  buildPageMetadata,
  contentPageJsonLd,
  faqJsonLd,
  organizationJsonLd,
} from "@/lib/seo";

const PAGE_PATH = "/kontakt";
const PAGE_TITLE = `Kontakt: Gebäudereinigung Esslingen & Stuttgart | ${SITE_NAME}`;
const PAGE_DESCRIPTION =
  "Kontakt zu ES-Gebäudeservice in Esslingen am Neckar. Telefon, E-Mail, Adresse und Standort für Ihre Anfrage zur Gebäudereinigung im Großraum Stuttgart.";

export const metadata: Metadata = buildPageMetadata({
  title: PAGE_TITLE,
  description: PAGE_DESCRIPTION,
  path: PAGE_PATH,
  keywords: [
    "Kontakt Gebäudereinigung Esslingen",
    "Kontakt Gebäudeservice Esslingen",
    "Reinigungsfirma Esslingen Kontakt",
    "Gebäudereinigung Stuttgart Angebot",
    "Telefon Gebäudereinigung Esslingen",
    "ES-Gebäudeservice Kontakt",
    "ES-Gebäudeservice Adresse",
  ],
});

const FAQ = [
  {
    question: "Wie erreiche ich ES-Gebäudeservice am schnellsten?",
    answer: `Am schnellsten telefonisch unter ${CONTACT_PHONE_DISPLAY} oder per E-Mail an ${CONTACT_EMAIL}.`,
  },
  {
    question: "Wo ist Ihr Sitz?",
    answer: `${BUSINESS_ADDRESS.streetAddress}, ${BUSINESS_ADDRESS.postalCode} ${BUSINESS_ADDRESS.addressLocality}. Von hier betreuen wir Esslingen, Stuttgart und die gesamte Umgebung.`,
  },
  {
    question: "Wie erhalte ich ein Angebot?",
    answer:
      "Kurze Anfrage per Telefon oder E-Mail genügt. Wir besichtigen Ihr Objekt und erstellen ein transparentes, unverbindliches Angebot.",
  },
];

export default function KontaktPage() {
  const addressQuery = CONTACT_ADDRESS_LINES.join(", ");

  const organizationLd = organizationJsonLd();
  const contactPageLd = contentPageJsonLd({
    type: "ContactPage",
    path: PAGE_PATH,
    name: "Kontakt zu ES-Gebäudeservice",
    description:
      "Kontaktmöglichkeiten zu ES-Gebäudeservice in Esslingen am Neckar: Telefon, E-Mail, Adresse und Standort.",
  });
  const breadcrumbLd = breadcrumbJsonLd([
    { name: "Startseite", path: "/" },
    { name: "Kontakt", path: PAGE_PATH },
  ]);
  const faqLd = faqJsonLd(FAQ);

  return (
    <main>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(contactPageLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqLd) }}
      />

      <section
        className="bg-[#7596AE] px-6 pt-40 pb-14 md:px-12 md:pt-28 md:pb-20"
        aria-labelledby="kontakt-page-heading"
      >
        <div className="mx-auto max-w-7xl">
          <nav
            aria-label="Brotkrumen-Navigation"
            className="mb-6 text-sm text-white/80"
          >
            <ol className="flex flex-wrap items-center gap-2">
              <li>
                <Link
                  href="/"
                  className="underline decoration-white/40 underline-offset-4 hover:text-white"
                >
                  Startseite
                </Link>
              </li>
              <li aria-hidden className="text-white/50">
                /
              </li>
              <li aria-current="page" className="text-white">
                Kontakt
              </li>
            </ol>
          </nav>
          <h1
            id="kontakt-page-heading"
            className="text-3xl font-bold leading-tight text-white md:text-4xl lg:text-5xl"
          >
            Kontakt zu ES-Gebäudeservice.
          </h1>
          <p className="mt-4 max-w-2xl text-lg leading-relaxed text-white/90 md:text-xl">
            Anruf oder E-Mail genügt. Wir melden uns zeitnah zurück.
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
                <article className="rounded-2xl bg-white p-6 shadow-lg shadow-slate-200/60">
                  <h2 className="text-sm font-semibold uppercase tracking-wide text-slate-500">
                    Telefon
                  </h2>
                  <a
                    href={`tel:${CONTACT_PHONE_TEL}`}
                    className="mt-2 inline-block text-sm font-semibold text-slate-900 transition-colors hover:text-sky-800 md:text-base"
                  >
                    {CONTACT_PHONE_DISPLAY}
                  </a>
                </article>

                <article className="rounded-2xl bg-white p-6 shadow-lg shadow-slate-200/60">
                  <h2 className="text-sm font-semibold uppercase tracking-wide text-slate-500">
                    E-Mail
                  </h2>
                  <a
                    href={`mailto:${CONTACT_EMAIL}`}
                    className="mt-2 inline-block break-all text-sm font-semibold text-slate-900 transition-colors hover:text-sky-800 md:text-[15px]"
                  >
                    {CONTACT_EMAIL}
                  </a>
                </article>
              </div>

              <article className="mt-4 rounded-2xl bg-white p-6 shadow-lg shadow-slate-200/60">
                <h2 className="text-sm font-semibold uppercase tracking-wide text-slate-500">
                  Adresse
                </h2>
                <address className="mt-2 not-italic text-base leading-relaxed text-slate-700 md:text-lg">
                  <span className="block font-semibold text-slate-900">
                    {CONTACT_ADDRESS_LINES[0]}
                  </span>
                  <span className="block">{BUSINESS_ADDRESS.streetAddress}</span>
                  <span className="block">
                    {BUSINESS_ADDRESS.postalCode} {BUSINESS_ADDRESS.addressLocality}
                  </span>
                </address>
                <a
                  href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(addressQuery)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`mt-4 ${BTN_SECONDARY}`}
                >
                  Route planen
                  <span aria-hidden>→</span>
                </a>
              </article>

              <div className="mt-6 flex flex-wrap items-center gap-x-6 gap-y-3">
                <a href={`tel:${CONTACT_PHONE_TEL}`} className={BTN_PRIMARY}>
                  Jetzt anrufen
                </a>
                <a href={`mailto:${CONTACT_EMAIL}`} className={BTN_SECONDARY}>
                  E-Mail schreiben
                </a>
              </div>
            </div>

            <div className="overflow-hidden rounded-2xl">
              <GoogleMapGate
                address={addressQuery}
                displayAddress={`${BUSINESS_ADDRESS.streetAddress}, ${BUSINESS_ADDRESS.postalCode} ${BUSINESS_ADDRESS.addressLocality}`}
                className="relative flex aspect-4/3 flex-col items-center justify-center rounded-2xl bg-slate-50 p-6 text-center"
                iframeClassName="aspect-4/3 w-full rounded-2xl border-0"
              />
            </div>
          </div>
        </div>
      </section>

      <section
        className="bg-[#F1F0EC] px-6 py-12 md:px-12 md:py-16"
        aria-labelledby="einsatzgebiet-heading"
      >
        <div className="mx-auto max-w-7xl">
          <div className="grid gap-10 lg:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)] lg:gap-14">
            <div>
              <h2
                id="einsatzgebiet-heading"
                className="text-2xl font-bold leading-tight text-slate-900 md:text-3xl lg:text-4xl"
              >
                Einsatzgebiet
              </h2>
              <p className="mt-4 text-base leading-relaxed text-slate-700 md:text-lg">
                Schnell im Einsatz in{" "}
                <strong className="font-semibold text-slate-900">
                  Stuttgart
                </strong>
                , im{" "}
                <strong className="font-semibold text-slate-900">
                  Landkreis Esslingen
                </strong>{" "}
                und auf der Filderebene.
              </p>
            </div>

            <div>
              <h3 className="sr-only">
                Städte und Gemeinden im Einsatzgebiet
              </h3>
              <ul className="flex flex-wrap gap-2">
                {EINSATZGEBIETE.map((ort) => (
                  <li
                    key={ort}
                    className="rounded-full bg-slate-100 px-3 py-1.5 text-sm font-medium text-slate-700 ring-1 ring-slate-200/80"
                  >
                    {ort}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      <section
        className="bg-white px-6 py-12 md:px-12 md:py-16 md:pb-20"
        aria-labelledby="kontakt-faq-heading"
      >
        <div className="mx-auto max-w-4xl">
          <h2
            id="kontakt-faq-heading"
            className="text-2xl font-bold leading-tight text-slate-900 md:text-3xl lg:text-4xl"
          >
            Häufige Fragen
          </h2>
          <div className="mt-8 divide-y divide-slate-200 overflow-hidden rounded-2xl bg-white shadow-lg shadow-slate-200/60">
            {FAQ.map((entry) => (
              <details key={entry.question} className="group open:bg-slate-50">
                <summary className="flex cursor-pointer items-start justify-between gap-4 px-6 py-5 text-base font-semibold text-slate-900 md:text-lg">
                  <span>{entry.question}</span>
                  <span
                    aria-hidden
                    className="mt-1 inline-block text-slate-400 transition-transform group-open:rotate-45"
                  >
                    +
                  </span>
                </summary>
                <div className="px-6 pb-6 text-sm leading-relaxed text-slate-700 md:text-base">
                  {entry.answer}
                </div>
              </details>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}
