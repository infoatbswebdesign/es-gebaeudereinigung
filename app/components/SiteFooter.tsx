"use client";

import Link from "next/link";
import ContactFormSection from "./ContactFormSection";

export default function SiteFooter() {
  return (
    <footer>
      <div
        className="bg-cover bg-center bg-no-repeat"
        style={{
          backgroundImage:
            "linear-gradient(rgba(117, 150, 174, 0.9), rgba(117, 150, 174, 0.9)), url('/es-gebaeudereinigung-hero-section-first-frame.jpg')",
        }}
      >
        <div className="max-lg:min-h-[118dvh]">
          <ContactFormSection />
        </div>
      </div>
      <div className="border-t border-white/25 bg-[#7596AE] px-6 py-6 md:px-12">
        <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-3 text-sm text-white/90 sm:flex-row">
          <p>© {new Date().getFullYear()} ES Gebäudereinigung – Alle Rechte vorbehalten.</p>
          <div className="flex flex-wrap items-center justify-center gap-x-6 gap-y-1">
            <Link href="/impressum" className="hover:text-white">
              Impressum
            </Link>
            <Link href="/datenschutz" className="hover:text-white">
              Datenschutz
            </Link>
            <Link href="/cookie-richtlinie" className="hover:text-white">
              Cookie-Richtlinie
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
