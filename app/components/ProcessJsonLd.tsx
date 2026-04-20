import { BUSINESS_ADDRESS, SITE_NAME, SITE_URL, absoluteUrl } from "@/lib/seo";

/**
 * Server Component: rendert die HowTo-Structured-Data fuer den
 * Prozessabschnitt auf der Startseite. Durch die Auslagerung aus der
 * animierten (Client-)ProcessSection landet das JSON-LD-Markup nicht mehr
 * im Client-Bundle, sondern wird nur serverseitig in den HTML-Stream
 * geschrieben.
 */
export default function ProcessJsonLd() {
  const howToJsonLd = {
    "@context": "https://schema.org",
    "@type": "HowTo",
    name: "In drei Schritten zur professionellen Gebäudereinigung in Esslingen und Stuttgart",
    description:
      `So beauftragen Sie ${SITE_NAME} für Ihre Unterhaltsreinigung, Glasreinigung oder Grundreinigung in Esslingen, Stuttgart und der gesamten Region Neckar.`,
    totalTime: "P3D",
    step: [
      {
        "@type": "HowToStep",
        position: 1,
        name: "Kostenloser Besichtigungstermin vor Ort",
        text: "Sie kontaktieren uns telefonisch oder per Kontaktformular. Wir besprechen Ihre Wünsche und vereinbaren einen unverbindlichen Besichtigungstermin für Ihre Gebäudereinigung in Esslingen, Stuttgart oder der Region.",
        url: absoluteUrl("/kontakt"),
      },
      {
        "@type": "HowToStep",
        position: 2,
        name: "Individuelles Reinigungsangebot",
        text: "Nach der Begehung vor Ort erstellen wir Ihnen ein maßgeschneidertes, transparentes Angebot für Ihre Unterhaltsreinigung, Glasreinigung oder Grundreinigung. Fair kalkuliert und ganz ohne versteckte Kosten.",
        url: absoluteUrl("/leistungen"),
      },
      {
        "@type": "HowToStep",
        position: 3,
        name: "Zuverlässige Reinigung vor Ort",
        text: "Unser eingespieltes Reinigungsteam kommt pünktlich zum Einsatz in Esslingen, Stuttgart und Umgebung. Wir sorgen für gründliche Sauberkeit in Büros, Praxen und Gewerbeobjekten.",
        url: absoluteUrl("/leistungen"),
      },
    ],
    provider: {
      "@type": "LocalBusiness",
      "@id": `${SITE_URL}#organization`,
      name: SITE_NAME,
      address: {
        "@type": "PostalAddress",
        streetAddress: BUSINESS_ADDRESS.streetAddress,
        postalCode: BUSINESS_ADDRESS.postalCode,
        addressLocality: BUSINESS_ADDRESS.addressLocality,
        addressRegion: BUSINESS_ADDRESS.addressRegion,
        addressCountry: BUSINESS_ADDRESS.addressCountry,
      },
      areaServed: ["Esslingen am Neckar", "Stuttgart", "Region Neckar"],
    },
  } as const;

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(howToJsonLd) }}
    />
  );
}
