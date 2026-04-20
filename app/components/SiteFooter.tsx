import Image from "next/image";
import Link from "next/link";
import ContactFormSection from "./ContactFormSection";
import PrivacySettingsLink from "./PrivacySettingsLink";
import {
  CONTACT_ADDRESS_LINES,
  CONTACT_EMAIL,
  CONTACT_PHONE_DISPLAY,
  CONTACT_PHONE_TEL,
} from "@/app/contact";
import { gebaeudeservice, logoEsGebaeudeservice } from "@/app/assets/images";

const INSTAGRAM_URL = "https://www.instagram.com/";

const FOOTER_NAV_ITEMS = [
  { href: "/", label: "Startseite" },
  { href: "/leistungen", label: "Leistungen" },
  { href: "/ueber-uns", label: "Über uns" },
  { href: "/kontakt", label: "Kontakt" },
] as const;

export function FooterContactPanel() {
  return (
    <div
      className="bg-cover bg-center bg-no-repeat"
      style={{
        backgroundImage: `linear-gradient(rgba(117, 150, 174, 0.9), rgba(117, 150, 174, 0.9)), url('${gebaeudeservice.src}')`,
      }}
    >
      <ContactFormSection />
    </div>
  );
}

export function FooterLegalPanel() {
  const year = new Date().getFullYear();

  return (
    <div className="bg-white text-neutral-800">
      <div className="mx-auto w-full max-w-7xl px-6 pb-10 pt-16 md:px-12 md:pt-20 md:pb-12">
        {/* Hauptbereich: links Brand, rechts Navigation */}
        <div className="grid grid-cols-1 gap-12 md:grid-cols-12 md:gap-10">
          {/* Brand-Block */}
          <div className="md:col-span-7">
            <Link
              href="/"
              aria-label="Zur Startseite"
              className="inline-flex items-center"
            >
              <Image
                src={logoEsGebaeudeservice}
                alt="ES Gebäudeservice"
                priority={false}
                sizes="(max-width: 768px) 56px, 64px"
                className="block h-14 w-auto object-contain object-left md:h-16"
                draggable={false}
              />
            </Link>

            <p className="mt-6 max-w-md text-base leading-relaxed text-neutral-600">
              Professionelle Gebäudereinigung für Büros, Praxen und Gewerbe, zuverlässig, gründlich und fair in Esslingen und Umgebung.
            </p>

            {/* Social Icons */}
            <div className="mt-8 flex items-center gap-3">
              <a
                href={INSTAGRAM_URL}
                target="_blank"
                rel="noreferrer"
                aria-label="Instagram"
                className="inline-flex size-10 items-center justify-center rounded-full bg-neutral-100 text-neutral-700 transition-colors hover:bg-neutral-200 hover:text-neutral-900"
              >
                <svg viewBox="0 0 24 24" aria-hidden className="size-5" fill="none">
                  <rect x="3.25" y="3.25" width="17.5" height="17.5" rx="5.25" stroke="currentColor" strokeWidth="1.8" />
                  <circle cx="12" cy="12" r="4.1" stroke="currentColor" strokeWidth="1.8" />
                  <circle cx="17.35" cy="6.65" r="1.2" fill="currentColor" />
                </svg>
              </a>
              <a
                href={`mailto:${CONTACT_EMAIL}`}
                aria-label="E-Mail schreiben"
                className="inline-flex size-10 items-center justify-center rounded-full bg-neutral-100 text-neutral-700 transition-colors hover:bg-neutral-200 hover:text-neutral-900"
              >
                <svg viewBox="0 0 24 24" aria-hidden className="size-5" fill="none">
                  <rect x="3.2" y="5.5" width="17.6" height="13" rx="2.2" stroke="currentColor" strokeWidth="1.7" />
                  <path d="M4.5 7l7.5 6 7.5-6" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </a>
              <a
                href={`tel:${CONTACT_PHONE_TEL}`}
                aria-label="Telefon anrufen"
                className="inline-flex size-10 items-center justify-center rounded-full bg-neutral-100 text-neutral-700 transition-colors hover:bg-neutral-200 hover:text-neutral-900"
              >
                <svg viewBox="0 0 24 24" aria-hidden className="size-5" fill="none">
                  <rect x="7.2" y="2.6" width="9.6" height="18.8" rx="2.3" stroke="currentColor" strokeWidth="1.7" />
                  <circle cx="12" cy="17.7" r="0.9" fill="currentColor" />
                  <path d="M10.3 5.6h3.4" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" />
                </svg>
              </a>
            </div>
          </div>

          {/* Navigation + Kontakt */}
          <div className="md:col-span-5">
            <div className="grid grid-cols-2 gap-8 sm:gap-12">
              <div>
                <h3 className="text-sm font-semibold uppercase tracking-wider text-neutral-500">
                  Navigation
                </h3>
                <ul className="mt-5 space-y-3 text-base">
                  {FOOTER_NAV_ITEMS.map((item) => (
                    <li key={item.href}>
                      <Link
                        href={item.href}
                        className="text-neutral-700 transition-colors hover:text-[#7596AE]"
                      >
                        {item.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>

              <div>
                <h3 className="text-sm font-semibold uppercase tracking-wider text-neutral-500">
                  Kontakt
                </h3>
                <ul className="mt-5 space-y-3 text-base text-neutral-700">
                  <li>
                    <a
                      href={`tel:${CONTACT_PHONE_TEL}`}
                      className="transition-colors hover:text-[#7596AE]"
                    >
                      {CONTACT_PHONE_DISPLAY}
                    </a>
                  </li>
                  <li>
                    <a
                      href={`mailto:${CONTACT_EMAIL}`}
                      className="wrap-break-word transition-colors hover:text-[#7596AE]"
                    >
                      {CONTACT_EMAIL}
                    </a>
                  </li>
                  <li className="pt-1 text-neutral-600">
                    {CONTACT_ADDRESS_LINES.map((line) => (
                      <span key={line} className="block leading-snug">
                        {line}
                      </span>
                    ))}
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>

        {/* Trennlinie + Copyright */}
        <div className="mt-14 border-t border-neutral-200 pt-6 md:mt-16">
          <div className="flex flex-col items-center justify-between gap-3 text-sm text-neutral-500 sm:flex-row">
            <p>© {year} ES-Gebäudeservice. Alle Rechte vorbehalten.</p>
            <div className="flex flex-wrap items-center justify-center gap-x-6 gap-y-1">
              <Link href="/impressum" className="transition-colors hover:text-neutral-800">
                Impressum
              </Link>
              <Link href="/datenschutz" className="transition-colors hover:text-neutral-800">
                Datenschutz- und Cookie-Richtlinie
              </Link>
              <PrivacySettingsLink className="transition-colors hover:text-neutral-800 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#7596AE]/50">
                Datenschutz- und Cookie-Einstellung
              </PrivacySettingsLink>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function SiteFooter() {
  return (
    <footer>
      <FooterContactPanel />
      <FooterLegalPanel />
    </footer>
  );
}
