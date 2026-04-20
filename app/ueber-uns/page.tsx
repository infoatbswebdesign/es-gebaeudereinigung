import Image from "next/image";
import Link from "next/link";
import type { Metadata } from "next";
import { gebaeudeservice, stadtEsslingen } from "@/app/assets/images";
import ScrollToContactButton from "@/app/components/ScrollToContactButton";
import { BTN_PRIMARY, BTN_SECONDARY } from "@/app/components/buttonStyles";
import {
  CONTACT_ADDRESS_LINES,
  CONTACT_EMAIL,
  CONTACT_PHONE_DISPLAY,
  CONTACT_PHONE_TEL,
} from "@/app/contact";
import {
  BUSINESS_ADDRESS,
  DEFAULT_KEYWORDS,
  EINSATZGEBIETE,
  SITE_NAME,
  breadcrumbJsonLd,
  buildPageMetadata,
  contentPageJsonLd,
  faqJsonLd,
  organizationJsonLd,
} from "@/lib/seo";

const PAGE_PATH = "/ueber-uns";
const PAGE_TITLE = `Über uns: Gebäudereinigung Esslingen & Stuttgart | ${SITE_NAME}`;
const PAGE_DESCRIPTION =
  "ES-Gebäudeservice aus Esslingen am Neckar: inhabergeführte Gebäudereinigung für Büros, Praxen und Gewerbe im Großraum Stuttgart, Esslingen und Umgebung.";

export const metadata: Metadata = buildPageMetadata({
  title: PAGE_TITLE,
  description: PAGE_DESCRIPTION,
  path: PAGE_PATH,
  keywords: DEFAULT_KEYWORDS,
});

const WERTE = [
  {
    title: "Feste Teams",
    text: "Dauerhaft dieselben Reinigungskräfte, keine Subunternehmer.",
  },
  {
    title: "Persönlich vor Ort",
    text: "Ein fester Ansprechpartner für Ihr Objekt in Esslingen und Stuttgart.",
  },
  {
    title: "Geprüft & versichert",
    text: "Festangestellt, geschult, haftpflichtversichert, DSGVO-konform.",
  },
  {
    title: "Transparent",
    text: "Klares Leistungsverzeichnis, nachvollziehbares Angebot, dokumentierte Qualität.",
  },
];

const FAKTEN = [
  { value: "Esslingen", label: "Standort am Neckar" },
  { value: "Stuttgart", label: "Einsatzgebiet" },
  { value: "Feste Teams", label: "Keine Subunternehmer" },
  { value: "Inhabergeführt", label: "Persönlich" },
];

const FAQ = [
  {
    question: "Wo ist Ihr Sitz?",
    answer:
      "Hauptstr. 111, 73730 Esslingen am Neckar. Von hier betreuen wir Esslingen, Stuttgart und die gesamte Umgebung.",
  },
  {
    question: "In welchen Städten sind Sie aktiv?",
    answer:
      "Im Großraum Stuttgart und im Landkreis Esslingen, u. a. Ostfildern, Filderstadt, Leinfelden-Echterdingen, Plochingen, Wendlingen, Kirchheim, Nürtingen, Denkendorf, Neuhausen, Köngen, Wernau, Fellbach und Waiblingen.",
  },
  {
    question: "Welche Objekte reinigen Sie?",
    answer:
      "Büros, Arzt- und Zahnarztpraxen, Kanzleien, Autohäuser, Ladengeschäfte, Produktionsstätten sowie Treppenhäuser und Gemeinschaftsflächen.",
  },
  {
    question: "Arbeiten Sie mit Subunternehmern?",
    answer:
      "Nein. Festangestellte, geschulte Teams mit persönlichem Objektleiter.",
  },
  {
    question: "Wie schnell sind Sie vor Ort?",
    answer:
      "In Esslingen, Stuttgart und Umgebung in der Regel sehr kurzfristig, bei Sonderreinigungen werktags oft am selben Tag.",
  },
];

export default function UeberUnsPage() {
  const organizationLd = organizationJsonLd();
  const aboutPageLd = contentPageJsonLd({
    type: "AboutPage",
    path: PAGE_PATH,
    name: "Über ES-Gebäudeservice: Gebäudereinigung aus Esslingen am Neckar",
    description:
      "Inhabergeführte Gebäudereinigung aus Esslingen am Neckar mit festen Teams und persönlichen Ansprechpartnern im Großraum Stuttgart.",
    primaryImagePath: "/stadt-esslingen.jpg",
  });
  const breadcrumbLd = breadcrumbJsonLd([
    { name: "Startseite", path: "/" },
    { name: "Über uns", path: PAGE_PATH },
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
        dangerouslySetInnerHTML={{ __html: JSON.stringify(aboutPageLd) }}
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
        aria-labelledby="ueber-uns-page-heading"
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
                Über uns
              </li>
            </ol>
          </nav>
          <h1
            id="ueber-uns-page-heading"
            className="text-3xl font-bold leading-tight text-white md:text-4xl lg:text-5xl"
          >
            Gebäudereinigung aus Esslingen am Neckar.
          </h1>
          <p className="mt-4 max-w-2xl text-lg leading-relaxed text-white/90 md:text-xl">
            Inhabergeführt, persönlich, fest in der Region. Für Büros, Praxen
            und Gewerbe in{" "}
            <strong className="font-semibold text-white">Stuttgart</strong>,{" "}
            <strong className="font-semibold text-white">Esslingen</strong> und
            Umgebung.
          </p>
        </div>
      </section>

      <section
        className="bg-white px-6 py-12 md:px-12 md:py-16"
        aria-labelledby="ueber-uns-einleitung"
      >
        <div className="mx-auto max-w-7xl">
          <h2 id="ueber-uns-einleitung" className="sr-only">
            Über ES-Gebäudeservice
          </h2>
          <div className="grid gap-10 lg:grid-cols-[minmax(0,1.15fr)_minmax(0,0.85fr)] lg:gap-14">
            <div>
              <p className="max-w-3xl text-2xl font-bold leading-snug text-slate-900 md:text-3xl lg:text-4xl">
                <span className="text-[#7596AE]">ES-Gebäudeservice</span> ist
                Ihr Partner für professionelle Gebäudereinigung im Großraum
                Stuttgart und Esslingen.
              </p>
              <p className="mt-5 max-w-2xl text-base leading-relaxed text-slate-700 md:text-lg">
                Vom Standort{" "}
                <span className="font-medium text-slate-900">
                  {BUSINESS_ADDRESS.streetAddress}, {BUSINESS_ADDRESS.postalCode}{" "}
                  Esslingen
                </span>{" "}
                betreuen wir Büros, Praxen und Gewerbeobjekte: von der{" "}
                <Link
                  href="/leistungen"
                  className="font-medium text-sky-800 underline decoration-sky-300 underline-offset-4 hover:text-sky-900"
                >
                  Unterhalts-, Glas- und Grundreinigung
                </Link>{" "}
                bis zum Winterdienst. Feste Teams, persönlicher Ansprechpartner,
                klare Preise.
              </p>

              <dl className="mt-8 grid grid-cols-2 gap-3 sm:grid-cols-4">
                {FAKTEN.map((fakt) => (
                  <div
                    key={fakt.label}
                    className="rounded-2xl bg-slate-50 p-4 ring-1 ring-slate-200/70"
                  >
                    <dt className="text-xs font-medium text-slate-500">
                      {fakt.label}
                    </dt>
                    <dd className="mt-1 text-base font-bold text-slate-900 md:text-lg">
                      {fakt.value}
                    </dd>
                  </div>
                ))}
              </dl>
            </div>

            <div className="relative mx-auto w-full max-w-[540px] pt-3 pb-16 sm:pt-5 sm:pb-20 lg:mx-0 lg:pt-2">
              <div className="relative aspect-4/3 w-[85%] overflow-hidden rounded-3xl shadow-[0_22px_52px_-28px_rgba(15,23,42,0.45)] ring-1 ring-slate-900/5">
                <Image
                  src={stadtEsslingen}
                  alt="Blick auf Esslingen am Neckar, Standort und Haupteinsatzgebiet von ES-Gebäudeservice"
                  fill
                  placeholder="blur"
                  className="object-cover"
                  sizes="(max-width: 640px) 82vw, (max-width: 1024px) 56vw, 34vw"
                />
              </div>
              <div className="absolute right-0 bottom-0 w-[62%] overflow-hidden rounded-3xl shadow-[0_26px_50px_-32px_rgba(15,23,42,0.55)] sm:w-[58%]">
                <div className="relative aspect-4/5 w-full">
                  <Image
                    src={gebaeudeservice}
                    alt="Professioneller Gebäudeservice von ES-Gebäudeservice im Großraum Stuttgart und Esslingen"
                    fill
                    placeholder="blur"
                    className="object-cover"
                    sizes="(max-width: 640px) 52vw, (max-width: 1024px) 36vw, 21vw"
                  />
                </div>
              </div>
              <div
                aria-hidden
                className="absolute -left-6 top-0 h-20 w-20 rounded-full bg-[#7596AE]/14 blur-2xl sm:-left-8 sm:h-24 sm:w-24"
              />
            </div>
          </div>
        </div>
      </section>

      <section
        className="bg-[#F1F0EC] px-6 py-12 md:px-12 md:py-16 md:pb-20"
        aria-labelledby="werte-heading"
      >
        <div className="mx-auto max-w-7xl">
          <h2
            id="werte-heading"
            className="mx-auto max-w-2xl text-center text-2xl font-bold leading-tight text-slate-900 md:text-3xl lg:text-4xl"
          >
            Was uns ausmacht
          </h2>
          <div className="mt-10 grid gap-4 sm:grid-cols-2 md:mt-12 lg:grid-cols-4">
            {WERTE.map((item) => (
              <article
                key={item.title}
                className="rounded-2xl bg-white p-6 shadow-lg shadow-slate-200/60"
              >
                <h3 className="text-lg font-bold text-slate-900">
                  {item.title}
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-slate-600">
                  {item.text}
                </p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section
        className="bg-white px-6 py-12 md:px-12 md:py-16"
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
              <div className="mt-6 flex flex-wrap items-center gap-x-6 gap-y-3">
                <ScrollToContactButton className={BTN_PRIMARY}>
                  Anfrage stellen
                </ScrollToContactButton>
                <a href={`tel:${CONTACT_PHONE_TEL}`} className={BTN_SECONDARY}>
                  {CONTACT_PHONE_DISPLAY}
                </a>
              </div>
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
        className="bg-[#F1F0EC] px-6 py-12 md:px-12 md:py-16 md:pb-20"
        aria-labelledby="faq-heading"
      >
        <div className="mx-auto max-w-4xl">
          <h2
            id="faq-heading"
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

      <section
        className="bg-white px-6 py-12 md:px-12 md:py-16"
        aria-labelledby="naechste-schritte-heading"
      >
        <div className="mx-auto max-w-7xl">
          <div className="grid gap-8 lg:grid-cols-[minmax(0,1.2fr)_minmax(0,1fr)] lg:items-center">
            <div>
              <h2
                id="naechste-schritte-heading"
                className="text-2xl font-bold leading-tight text-slate-900 md:text-3xl lg:text-4xl"
              >
                Unverbindliches Angebot für Ihr Objekt.
              </h2>
              <p className="mt-4 max-w-xl text-base leading-relaxed text-slate-700 md:text-lg">
                Kurze Nachricht oder Anruf genügt. Wir melden uns zeitnah
                zurück.
              </p>
              <div className="mt-6 flex flex-wrap items-center gap-x-6 gap-y-3">
                <ScrollToContactButton className={BTN_PRIMARY}>
                  Angebot anfragen
                </ScrollToContactButton>
                <Link href="/leistungen" className={BTN_SECONDARY}>
                  Leistungen ansehen
                </Link>
              </div>
            </div>

            <address className="not-italic rounded-2xl bg-white p-6 text-base leading-relaxed text-slate-700 shadow-lg shadow-slate-200/60 md:text-lg">
              <span className="block font-semibold text-slate-900">
                {CONTACT_ADDRESS_LINES[0]}
              </span>
              <span className="block">{BUSINESS_ADDRESS.streetAddress}</span>
              <span className="block">
                {BUSINESS_ADDRESS.postalCode} {BUSINESS_ADDRESS.addressLocality}
              </span>
              <span className="mt-3 block">
                <a
                  href={`tel:${CONTACT_PHONE_TEL}`}
                  className="font-medium text-sky-800 underline decoration-sky-300 underline-offset-4 hover:text-sky-900"
                >
                  {CONTACT_PHONE_DISPLAY}
                </a>
              </span>
              <span className="block">
                <a
                  href={`mailto:${CONTACT_EMAIL}`}
                  className="font-medium text-sky-800 underline decoration-sky-300 underline-offset-4 hover:text-sky-900"
                >
                  {CONTACT_EMAIL}
                </a>
              </span>
            </address>
          </div>
        </div>
      </section>
    </main>
  );
}
