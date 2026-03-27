import Image from "next/image";
import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Über uns | ES Gebäudereinigung",
  description:
    "ES-Gebäudeservice: Professionelle Gebäudereinigung im Großraum Stuttgart und Esslingen – Qualität, Sorgfalt und Zuverlässigkeit.",
  openGraph: {
    title: "Über uns | ES Gebäudereinigung",
    description:
      "Professionelle Gebäudereinigung im Großraum Stuttgart und Esslingen.",
    type: "website",
  },
};

const WERTE = [
  {
    title: "Qualität & Sorgfalt",
    text: "Wir arbeiten gründlich und mit Blick fürs Detail – damit Ihr Objekt den Eindruck macht, den Sie sich wünschen.",
  },
  {
    title: "Zuverlässigkeit",
    text: "Termine und Absprachen halten wir ein. Sie können sich darauf verlassen, dass die Reinigung wie geplant erfolgt.",
  },
  {
    title: "Nähe zum Kunden",
    text: "Kurze Wege, klare Kommunikation und flexible Lösungen – abgestimmt auf Ihren Betrieb und Ihre Anforderungen.",
  },
];

export default function UeberUnsPage() {
  return (
    <main>
      <section
        className="bg-[#7596AE] px-6 pt-40 pb-14 md:px-12 md:pt-28 md:pb-20"
        aria-labelledby="ueber-uns-page-heading"
      >
        <div className="mx-auto max-w-7xl">
          <h1
            id="ueber-uns-page-heading"
            className="text-3xl font-bold leading-tight text-white md:text-4xl lg:text-5xl"
          >
            Über uns
          </h1>
        </div>
      </section>

      <section
        className="bg-white px-6 py-12 md:px-12 md:py-16"
        aria-labelledby="ueber-uns-einleitung"
      >
        <div className="mx-auto max-w-7xl">
          <h2 id="ueber-uns-einleitung" className="sr-only">
            Unser Anspruch
          </h2>
          <div className="grid gap-10 lg:grid-cols-[minmax(0,1.15fr)_minmax(0,0.85fr)] lg:gap-14">
            <div>
              <p className="max-w-3xl text-2xl font-bold leading-snug text-slate-900 md:text-3xl lg:text-4xl">
                Herzlich willkommen bei{" "}
                <span className="text-[#7596AE]">ES-Gebäudeservice</span>. Als
                zuverlässiger Partner für professionelle Gebäudereinigung stehen
                wir für Qualität, Sorgfalt und Kundenzufriedenheit.
              </p>
              <div className="mt-6 max-w-2xl space-y-4 text-base leading-relaxed text-slate-700 md:text-lg">
                <p>
                  Im{" "}
                  <span className="font-medium text-sky-700">
                    Großraum Stuttgart, Esslingen und Umgebung
                  </span>{" "}
                  betreuen wir Büros, Praxen und gewerbliche Objekte – von der
                  regelmäßigen Unterhaltsreinigung bis zu individuell
                  abgestimmten Leistungen.
                </p>
                <p>
                  Unser Ziel ist es, Ihnen Arbeit abzunehmen und gleichzeitig
                  ein gepflegtes Umfeld für Mitarbeitende, Kundinnen und Kunden
                  zu schaffen. Dabei legen wir Wert auf transparente Abläufe und
                  eine Zusammenarbeit auf Augenhöhe.
                </p>
              </div>
            </div>

            <div className="relative mx-auto w-full max-w-[540px] pt-3 pb-16 sm:pt-5 sm:pb-20 lg:mx-0 lg:pt-2">
              <div className="relative aspect-4/3 w-[85%] overflow-hidden rounded-3xl shadow-[0_22px_52px_-28px_rgba(15,23,42,0.45)] ring-1 ring-slate-900/5">
                <Image
                  src="/stadt-esslingen.jpg"
                  alt="Esslingen am Neckar – unser Einsatzgebiet"
                  fill
                  className="object-cover"
                  sizes="(max-width: 640px) 82vw, (max-width: 1024px) 56vw, 34vw"
                />
              </div>
              <div className="absolute right-0 bottom-0 w-[62%] overflow-hidden rounded-3xl shadow-[0_26px_50px_-32px_rgba(15,23,42,0.55)] sm:w-[58%]">
                <div className="relative aspect-4/5 w-full">
                  <Image
                    src="/gebaeudeservice-es-gebaeudeservice.jpg"
                    alt="Gebäudeservice und professionelle Reinigung"
                    fill
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
          <div className="mt-10 grid gap-6 md:mt-14 md:grid-cols-3">
            {WERTE.map((item) => (
              <article
                key={item.title}
                className="flex flex-col rounded-2xl bg-white p-6 shadow-lg shadow-slate-200/60 md:p-8"
              >
                <h3 className="text-xl font-bold text-slate-900">
                  {item.title}
                </h3>
                <p className="mt-3 text-sm leading-relaxed text-slate-600 md:text-base">
                  {item.text}
                </p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section
        className="bg-white px-6 py-12 md:px-12 md:py-16"
        aria-labelledby="nächste-schritte-heading"
      >
        <div className="mx-auto max-w-7xl">
          <h2
            id="nächste-schritte-heading"
            className="text-2xl font-bold text-slate-900 md:text-3xl"
          >
            Gemeinsam starten
          </h2>
          <p className="mt-4 max-w-2xl text-base leading-relaxed text-slate-700 md:text-lg">
            Sie möchten Ihre Reinigung professionalisieren oder ein neues Objekt
            an uns übergeben? Wir beraten Sie gern unverbindlich und erstellen ein
            Angebot, das zu Ihrem Bedarf passt.
          </p>
          <div className="mt-8 flex flex-wrap gap-4">
            <Link
              href="/kontakt"
              className="inline-flex items-center justify-center rounded-xl bg-[#7596AE] px-5 py-3 text-sm font-semibold text-white transition-opacity hover:opacity-90 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#7596AE] focus-visible:ring-offset-2"
            >
              Kontakt aufnehmen
            </Link>
            <Link
              href="/leistungen"
              className="inline-flex items-center justify-center rounded-xl border-2 border-slate-200 bg-white px-5 py-3 text-sm font-semibold text-slate-900 transition-colors hover:border-slate-300 focus:outline-none focus-visible:ring-2 focus-visible:ring-slate-400 focus-visible:ring-offset-2"
            >
              Leistungen ansehen
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
