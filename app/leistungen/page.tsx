import Link from "next/link";
import type { Metadata } from "next";
import LeistungenServicesGrid from "../components/LeistungenServicesGrid";
import ScrollToContactButton from "@/app/components/ScrollToContactButton";
import { BTN_PRIMARY, BTN_SECONDARY } from "@/app/components/buttonStyles";
import {
  CONTACT_PHONE_DISPLAY,
  CONTACT_PHONE_TEL,
} from "@/app/contact";
import {
  EINSATZGEBIETE,
  SITE_NAME,
  SITE_URL,
  absoluteUrl,
  breadcrumbJsonLd,
  buildPageMetadata,
  contentPageJsonLd,
  faqJsonLd,
  organizationJsonLd,
} from "@/lib/seo";

const PAGE_PATH = "/leistungen";
const PAGE_URL = absoluteUrl(PAGE_PATH);
const PAGE_TITLE = `Leistungen: Gebäudereinigung Esslingen & Stuttgart | ${SITE_NAME}`;
const PAGE_DESCRIPTION =
  "Unterhaltsreinigung, Büro- & Praxisreinigung, Glas-, Grund- und Baugrobreinigung, Winterdienst, Hausmeisterservice und Entrümpelung im Großraum Stuttgart und Esslingen.";

const SERVICES_SEO = [
  {
    slug: "unterhaltsreinigung",
    name: "Unterhaltsreinigung",
    description:
      "Tägliche oder wöchentliche Unterhaltsreinigung für Büros, Praxen und Gewerbe in Esslingen und Stuttgart.",
  },
  {
    slug: "praxis-buero-reinigung",
    name: "Praxis- & Büroreinigung",
    description:
      "Hygienische Praxis- und Büroreinigung in Esslingen und Stuttgart, auch außerhalb der Sprech- und Geschäftszeiten.",
  },
  {
    slug: "glasreinigung",
    name: "Glasreinigung",
    description:
      "Streifenfreie Glas- und Fensterreinigung für Gewerbe- und Geschäftsgebäude im Großraum Stuttgart.",
  },
  {
    slug: "grundreinigung",
    name: "Grundreinigung",
    description:
      "Intensive Grund- und Tiefenreinigung in Esslingen, Stuttgart und Umgebung, z. B. nach Bauphasen oder vor Mieterwechsel.",
  },
  {
    slug: "baugrobreinigung",
    name: "Baugrobreinigung",
    description:
      "Erstreinigung nach Bauarbeiten und Renovierungen, inkl. bezugsfertiger Übergabe.",
  },
  {
    slug: "winterdienst",
    name: "Winterdienst",
    description:
      "Räum- und Streudienst in Esslingen, Stuttgart und Umgebung – sichere Wege und Zufahrten bei Schnee und Eis.",
  },
  {
    slug: "kehrwochen",
    name: "Kehrwochen",
    description:
      "Zuverlässige Übernahme der Kehrwoche für Eigentümer, Mieter und Hausverwaltungen.",
  },
  {
    slug: "hausmeisterservice",
    name: "Hausmeisterservice",
    description:
      "Persönlicher Hausmeisterservice für Gewerbe- und Wohnobjekte mit festem Ansprechpartner.",
  },
  {
    slug: "gruenanlagenflaechen",
    name: "Grünanlagenflächen",
    description:
      "Pflege von Grünflächen, Vorgärten und Außenanlagen nach Saisonkalender.",
  },
  {
    slug: "entruempelung",
    name: "Entrümpelung",
    description:
      "Entrümpelung von Wohnungen, Kellern und Gewerbeobjekten inklusive fachgerechter Entsorgung.",
  },
];

export const metadata: Metadata = buildPageMetadata({
  title: PAGE_TITLE,
  description: PAGE_DESCRIPTION,
  path: PAGE_PATH,
  keywords: [
    "Gebäudereinigung Esslingen",
    "Gebäudereinigung Stuttgart",
    "Unterhaltsreinigung Esslingen",
    "Büroreinigung Esslingen",
    "Büroreinigung Stuttgart",
    "Praxisreinigung Esslingen",
    "Glasreinigung Esslingen",
    "Grundreinigung Esslingen",
    "Baugrobreinigung Stuttgart",
    "Winterdienst Esslingen",
    "Hausmeisterservice Esslingen",
    "Entrümpelung Esslingen",
    "Kehrwoche Esslingen",
    "Grünflächenpflege Esslingen",
    "ES-Gebäudeservice",
  ],
});

const FAQ = [
  {
    question: "Welche Leistungen bietet ES-Gebäudeservice an?",
    answer:
      "Unterhaltsreinigung, Büro- und Praxisreinigung, Glasreinigung, Grundreinigung, Baugrobreinigung, Winterdienst, Kehrwoche, Hausmeisterservice, Grünflächenpflege und Entrümpelung.",
  },
  {
    question: "In welchem Gebiet sind Sie tätig?",
    answer:
      "Im Großraum Stuttgart und im Landkreis Esslingen, u. a. Ostfildern, Filderstadt, Leinfelden-Echterdingen, Plochingen, Wendlingen, Kirchheim, Nürtingen, Denkendorf, Neuhausen, Köngen, Wernau, Fellbach und Waiblingen.",
  },
  {
    question: "Gibt es feste Reinigungsintervalle?",
    answer:
      "Ja. Wir reinigen täglich, wöchentlich oder im individuell vereinbarten Turnus, passend zu Ihren Öffnungs- und Geschäftszeiten.",
  },
  {
    question: "Wie bekomme ich ein Angebot?",
    answer:
      "Sie stellen eine kurze Anfrage, wir besichtigen Ihr Objekt und erstellen ein transparentes, unverbindliches Angebot.",
  },
];

export default function LeistungenPage() {
  const organizationLd = organizationJsonLd();
  const breadcrumbLd = breadcrumbJsonLd([
    { name: "Startseite", path: "/" },
    { name: "Leistungen", path: PAGE_PATH },
  ]);
  const faqLd = faqJsonLd(FAQ);

  const collectionPageLd = {
    ...contentPageJsonLd({
      type: "CollectionPage",
      path: PAGE_PATH,
      name: "Leistungen von ES-Gebäudeservice",
      description:
        "Übersicht aller Reinigungs- und Gebäudeservice-Leistungen von ES-Gebäudeservice im Großraum Stuttgart und Esslingen.",
    }),
    mainEntity: {
      "@type": "ItemList",
      itemListOrder: "https://schema.org/ItemListOrderAscending",
      numberOfItems: SERVICES_SEO.length,
      itemListElement: SERVICES_SEO.map((service, index) => ({
        "@type": "ListItem",
        position: index + 1,
        item: {
          "@type": "Service",
          name: service.name,
          description: service.description,
          serviceType: service.name,
          url: `${PAGE_URL}#${service.slug}`,
          provider: {
            "@id": `${SITE_URL}#organization`,
          },
          areaServed: EINSATZGEBIETE.map((name) => ({
            "@type": "City",
            name,
          })),
        },
      })),
    },
  };

  return (
    <main>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(collectionPageLd) }}
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
        aria-labelledby="leistungen-page-heading"
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
                Leistungen
              </li>
            </ol>
          </nav>
          <h1
            id="leistungen-page-heading"
            className="text-3xl font-bold leading-tight text-white md:text-4xl lg:text-5xl"
          >
            Leistungen: Gebäudereinigung in Esslingen und Stuttgart.
          </h1>
          <p className="mt-4 max-w-2xl text-lg leading-relaxed text-white/90 md:text-xl">
            Von der{" "}
            <strong className="font-semibold text-white">
              Unterhaltsreinigung
            </strong>{" "}
            bis zum{" "}
            <strong className="font-semibold text-white">Winterdienst</strong> –
            im Großraum Stuttgart, Esslingen und Umgebung.
          </p>
        </div>
      </section>

      <section
        className="bg-[#F1F0EC] px-6 py-12 md:px-12 md:py-16 md:pb-24"
        aria-label="Leistungen im Überblick"
      >
        <div className="mx-auto max-w-7xl">
          <LeistungenServicesGrid />
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
                  Angebot anfragen
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
        aria-labelledby="leistungen-faq-heading"
      >
        <div className="mx-auto max-w-4xl">
          <h2
            id="leistungen-faq-heading"
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
