import type { Metadata } from "next";
import LeistungenDetailScroll from "../components/LeistungenDetailScroll";

export const metadata: Metadata = {
  title: "Unsere Leistungen | ES Gebäudereinigung",
  description:
    "Reinigungsservice, Winterdienst und Gebäudeservice im Großraum Stuttgart und Esslingen – professionell, zuverlässig und auf Ihr Objekt abgestimmt.",
  openGraph: {
    title: "Unsere Leistungen | ES Gebäudereinigung",
    description:
      "Reinigungsservice, Winterdienst und Gebäudeservice für Büros, Praxen und Gewerbe.",
    type: "website",
  },
};

const LEISTUNGEN = [
  {
    id: "reinigung",
    title: "Reinigungsservice",
    intro:
      "Professionelle Reinigung für Ihr Objekt – regelmäßig, zuverlässig und genau nach Ihrem Bedarf. Ob Büro, Praxis oder gewerbliche Flächen: Wir sorgen für ein gepflegtes Umfeld.",
    points: [
      "Unterhalts- und Grundreinigung nach individuellem Plan",
      "Hygiene in Sanitärbereichen, Küchen und Gemeinschaftsflächen",
      "Flexible Intervalle: täglich, wöchentlich oder nach Absprache",
      "Klare Absprachen zu Umfang, Zeiten und Ansprechpartnern",
    ],
    iconBg: "bg-slate-800",
    iconPath:
      "M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4",
    imageSrc: "/reinigungsservice-es-gebaeudeservice.jpg",
    imageAlt: "Mitarbeiterin bei professioneller Gebäudereinigung",
  },
  {
    id: "winterdienst",
    title: "Winterdienst",
    intro:
      "Räum- und Streudienst bei Schnee und Eis – damit Wege, Zugänge und Parkflächen sicher nutzbar bleiben und Haftungsrisiken reduziert werden.",
    points: [
      "Einsatz nach Witterung und vereinbarten Auslösekriterien",
      "Gehwege, Eingänge und betreute Außenbereiche",
      "Dokumentation auf Wunsch für Nachweise gegenüber Versicherungen",
      "Abstimmung mit Ihrem Objekt- oder Facility-Management",
    ],
    iconBg: "bg-indigo-700",
    iconPath:
      "M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z",
    imageSrc: "/winterdienst-es-gebaeudeservice.jpg",
    imageAlt: "Erledigte Objektpflege und laufender Serviceeinsatz",
  },
  {
    id: "gebaeudeservice",
    title: "Gebäudeservice",
    intro:
      "Rundum-Betreuung aus einer Hand: Reinigung und Winterdienst kombiniert – eine Anlaufstelle, weniger Schnittstellen, durchgängige Qualität für Ihr Gebäude.",
    points: [
      "Ein Vertragspartner für Reinigung und saisonale Dienste",
      "Abgestimmte Abläufe und feste Ansprechpartner vor Ort",
      "Skalierbar bei neuen Standorten oder geänderten Flächen",
      "Transparente Leistungsbeschreibung und faire Konditionen",
    ],
    iconBg: "bg-sky-700",
    iconPath:
      "M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4",
    imageSrc: "/gebaeudeservice-es-gebaeudeservice.jpg",
    imageAlt: "Beratung und Leistungsplanung fuer den Gebaeudeservice",
  },
] as const;

export default function LeistungenPage() {
  return (
    <main>
      <section
        className="bg-[#7596AE] px-6 pt-40 pb-14 md:px-12 md:pt-28 md:pb-20"
        aria-labelledby="leistungen-page-heading"
      >
        <div className="mx-auto max-w-7xl">
          <h1
            id="leistungen-page-heading"
            className="text-3xl font-bold leading-tight text-white md:text-4xl lg:text-5xl"
          >
            Unsere Leistungen
          </h1>
          <p className="mt-4 max-w-2xl text-lg leading-relaxed text-white/90 md:text-xl">
            Alles, was Ihr Objekt braucht – von der regelmäßigen Reinigung bis
            zum Winterdienst. Im{" "}
            <span className="font-medium text-white">
              Großraum Stuttgart, Esslingen und Umgebung
            </span>{" "}
            sind wir für Sie da.
          </p>
        </div>
      </section>

      <section
        className="bg-[#F1F0EC] px-6 py-12 md:px-12 md:py-16 md:pb-24 lg:py-0"
        aria-label="Leistungen im Detail"
      >
        <div className="mx-auto max-w-7xl lg:flex lg:min-h-screen lg:flex-col lg:justify-center">
          <LeistungenDetailScroll items={LEISTUNGEN} />
        </div>
      </section>

    </main>
  );
}
