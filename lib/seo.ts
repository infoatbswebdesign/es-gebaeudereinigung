/**
 * Zentrale SEO-Konstanten und Helfer.
 *
 * Alle Seiten/Komponenten sollten `SITE_URL`, `absoluteUrl()` und die
 * JSON-LD-Helfer ausschliesslich von hier beziehen, damit Canonical-URLs,
 * Sitemap, Robots, Manifest, OpenGraph und strukturierte Daten konsistent
 * bleiben.
 */

import type { Metadata } from "next";
import {
  CONTACT_EMAIL,
  CONTACT_PHONE_TEL,
} from "@/app/contact";

/**
 * Produktions-URL der Website (kanonisch in Punycode/ASCII).
 *
 * Hintergrund: Die echte Domain ist die IDN `es-gebäudeservice.de`. Damit
 * Sitemap, robots.txt, Canonical-Tags, OpenGraph, JSON-LD, RSS, Sharing-
 * Buttons und HTTP-Header in **jedem** Tooling identisch aussehen, wird
 * hier ausschliesslich die ACE-/Punycode-Form verwendet (RFC 3987 → 3986).
 * Browser zeigen dem Nutzer trotzdem die schoene Umlaut-Form an.
 *
 * NIEMALS direkt mit Umlauten konkatenieren – sonst entstehen IRIs, die
 * mancher Crawler/Linter als „nicht kanonisch" wertet.
 *
 * Verifiziert via `new URL("https://es-gebäudeservice.de").hostname` und
 * deckungsgleich mit der Punycode-Anzeige im GoDaddy-Domain-Dashboard.
 */
export const SITE_URL = "https://xn--es-gebudeservice-0nb.de";

/**
 * Menschlich lesbare Form (Unicode/IDN). Wird in JSON-LD als `sameAs`
 * referenziert und kann optional in UI-Texten angezeigt werden – aber NIE
 * in technischen URL-Feldern (canonical, sitemap, robots, OG).
 */
export const SITE_URL_DISPLAY = "https://es-gebäudeservice.de";

/** Name der Marke. */
export const SITE_NAME = "ES-Gebäudeservice";
export const SITE_ALTERNATE_NAME = [
  "ES Gebäudereinigung",
  "ES Gebäudeservice Esslingen",
  "ES-Gebäudeservice Esslingen",
];

/** Standard-Description (Startseite / Fallback). */
export const SITE_DESCRIPTION =
  "Inhabergeführte Gebäudereinigung aus Esslingen am Neckar. Unterhalts-, Büro-, Praxis-, Glas-, Grund- und Baugrobreinigung, Winterdienst und Hausmeisterservice im Großraum Stuttgart.";

export const DEFAULT_OG_IMAGE = {
  url: "/stadt-esslingen.jpg",
  width: 1200,
  height: 900,
  alt: "ES-Gebäudeservice – Gebäudereinigung in Esslingen und Stuttgart",
};

/** Standort- und Geodaten für LocalBusiness-JSON-LD. */
export const BUSINESS_ADDRESS = {
  streetAddress: "Hauptstr. 111",
  postalCode: "73730",
  addressLocality: "Esslingen am Neckar",
  addressRegion: "Baden-Württemberg",
  addressCountry: "DE",
} as const;

export const BUSINESS_GEO = {
  latitude: 48.7394,
  longitude: 9.3089,
} as const;

/** Einsatzgebiete für areaServed in strukturierten Daten. */
export const EINSATZGEBIETE = [
  "Esslingen am Neckar",
  "Stuttgart",
  "Ostfildern",
  "Filderstadt",
  "Leinfelden-Echterdingen",
  "Plochingen",
  "Wendlingen am Neckar",
  "Kirchheim unter Teck",
  "Nürtingen",
  "Denkendorf",
  "Neuhausen auf den Fildern",
  "Köngen",
  "Wernau",
  "Reichenbach an der Fils",
  "Deizisau",
  "Altbach",
  "Fellbach",
  "Waiblingen",
] as const;

/** Standard-Branchenschlagworte (pro Seite frei erweiterbar). */
export const DEFAULT_KEYWORDS = [
  "Gebäudereinigung Esslingen",
  "Gebäudereinigung Stuttgart",
  "Gebäudeservice Esslingen",
  "Reinigungsfirma Esslingen",
  "Büroreinigung Esslingen",
  "Büroreinigung Stuttgart",
  "Praxisreinigung Esslingen",
  "Unterhaltsreinigung Esslingen",
  "Glasreinigung Esslingen",
  "Grundreinigung Esslingen",
  "Baugrobreinigung Stuttgart",
  "Winterdienst Esslingen",
  "Hausmeisterservice Esslingen",
  "ES-Gebäudeservice",
] as const;

/**
 * Build-Time-Guard: stellt sicher, dass `SITE_URL` ASCII-only ist
 * (Punycode statt Unicode). Schlaegt frueh fehl, wenn jemand die
 * Konstante versehentlich auf `https://es-gebäudeservice.de` zurueck-
 * stellt – das wuerde Sitemap, Canonical und JSON-LD inkonsistent
 * machen und Google schickt dann „Seite mit Weiterleitung"-Warnungen.
 */
if (process.env.NODE_ENV !== "production") {
  // eslint-disable-next-line no-control-regex
  if (/[^\u0000-\u007f]/.test(SITE_URL)) {
    throw new Error(
      `[seo] SITE_URL muss ASCII/Punycode sein, ist aber: ${SITE_URL}. ` +
        "Verwende https://xn--es-gebudeservice-0nb.de.",
    );
  }
}

/** Konkatenation einer relativen Pfad-URL mit `SITE_URL`. */
export function absoluteUrl(path: string = "/"): string {
  if (!path.startsWith("/")) return `${SITE_URL}/${path}`;
  return `${SITE_URL}${path}`;
}

/**
 * Zentrale Organization/LocalBusiness/CleaningService JSON-LD.
 * Über `@id` referenzierbar aus anderen Entitäten (z. B. Service.provider).
 */
export function organizationJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": ["Organization", "LocalBusiness", "CleaningService"],
    "@id": `${SITE_URL}#organization`,
    name: SITE_NAME,
    alternateName: SITE_ALTERNATE_NAME,
    description: SITE_DESCRIPTION,
    url: SITE_URL,
    logo: absoluteUrl("/logo-es-gebaeudeservice.png"),
    image: absoluteUrl(DEFAULT_OG_IMAGE.url),
    telephone: CONTACT_PHONE_TEL,
    email: CONTACT_EMAIL,
    priceRange: "€€",
    address: {
      "@type": "PostalAddress",
      ...BUSINESS_ADDRESS,
    },
    geo: {
      "@type": "GeoCoordinates",
      ...BUSINESS_GEO,
    },
    areaServed: EINSATZGEBIETE.map((name) => ({
      "@type": "City",
      name,
    })),
    serviceArea: {
      "@type": "GeoCircle",
      geoMidpoint: {
        "@type": "GeoCoordinates",
        ...BUSINESS_GEO,
      },
      geoRadius: 35000,
    },
    contactPoint: [
      {
        "@type": "ContactPoint",
        telephone: CONTACT_PHONE_TEL,
        email: CONTACT_EMAIL,
        contactType: "customer service",
        areaServed: "DE",
        availableLanguage: ["de"],
      },
    ],
    knowsAbout: [
      "Unterhaltsreinigung",
      "Büroreinigung",
      "Praxisreinigung",
      "Glasreinigung",
      "Grundreinigung",
      "Baugrobreinigung",
      "Winterdienst",
      "Hausmeisterservice",
      "Gewerbereinigung",
    ],
    sameAs: [
      // Unicode-/IDN-Form der eigenen Domain. Hilft Google, kanonische
      // Punycode-URL und „schoene" Umlaut-URL als ein und dieselbe
      // Entitaet zu verstehen – wichtig zur Abgrenzung von der
      // gleichnamigen Hamburger Firma „ES Gebäude-Service GmbH".
      SITE_URL_DISPLAY,
    ],
    slogan: "Professionelle Gebäudereinigung aus Esslingen.",
    foundingLocation: {
      "@type": "Place",
      name: "Esslingen am Neckar",
    },
  } as const;
}

/** WebSite-Entität (kann SearchAction enthalten, hier ohne interne Suche). */
export function websiteJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "@id": `${SITE_URL}#website`,
    url: SITE_URL,
    name: SITE_NAME,
    inLanguage: "de-DE",
    publisher: {
      "@id": `${SITE_URL}#organization`,
    },
  } as const;
}

/** BreadcrumbList-JSON-LD-Builder. */
export function breadcrumbJsonLd(
  crumbs: Array<{ name: string; path: string }>,
) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: crumbs.map((c, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: c.name,
      item: absoluteUrl(c.path),
    })),
  } as const;
}

/** FAQPage-JSON-LD-Builder. */
export function faqJsonLd(entries: Array<{ question: string; answer: string }>) {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: entries.map((entry) => ({
      "@type": "Question",
      name: entry.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: entry.answer,
      },
    })),
  } as const;
}

type ContentPageLdInput = {
  type: "AboutPage" | "ContactPage" | "CollectionPage" | "WebPage";
  path: string;
  name: string;
  description: string;
  primaryImagePath?: string;
};

/** Generische ContentPage/WebPage-JSON-LD (about/contact/collection). */
export function contentPageJsonLd({
  type,
  path,
  name,
  description,
  primaryImagePath,
}: ContentPageLdInput) {
  const pageUrl = absoluteUrl(path);
  return {
    "@context": "https://schema.org",
    "@type": type,
    "@id": `${pageUrl}#${type.toLowerCase()}`,
    url: pageUrl,
    name,
    description,
    inLanguage: "de-DE",
    isPartOf: {
      "@type": "WebSite",
      name: SITE_NAME,
      url: SITE_URL,
    },
    about: {
      "@id": `${SITE_URL}#organization`,
    },
    mainEntity: {
      "@id": `${SITE_URL}#organization`,
    },
    ...(primaryImagePath
      ? {
          primaryImageOfPage: {
            "@type": "ImageObject",
            url: absoluteUrl(primaryImagePath),
          },
        }
      : {}),
  } as const;
}

type PageMetadataInput = {
  title: string;
  description: string;
  path: string;
  keywords?: readonly string[];
  ogType?: "website" | "article";
};

/**
 * Erzeugt eine konsistente `Metadata`-Struktur fuer Unterseiten.
 * `metadataBase`, `applicationName`, `authors`, `creator`, `publisher`,
 * `formatDetection`, `category` und die globalen `robots` werden bereits
 * im Root-Layout definiert und muessen hier NICHT wiederholt werden.
 */
export function buildPageMetadata({
  title,
  description,
  path,
  keywords,
  ogType = "website",
}: PageMetadataInput): Metadata {
  return {
    title: { absolute: title },
    description,
    ...(keywords && keywords.length > 0
      ? { keywords: Array.from(keywords) }
      : {}),
    alternates: {
      canonical: path,
      languages: {
        "de-DE": path,
      },
    },
    openGraph: {
      type: ogType,
      locale: "de_DE",
      url: absoluteUrl(path),
      siteName: SITE_NAME,
      title,
      description,
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
    },
  };
}
