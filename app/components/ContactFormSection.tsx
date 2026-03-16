"use client";

import Link from "next/link";
import { useState } from "react";

const MAX_MESSAGE_LENGTH = 250;

function PhoneIcon() {
  return (
    <svg className="h-5 w-5 shrink-0 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden>
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V21a2 2 0 01-2 2h-2C7.82 23 2 17.18 2 10V5z" />
    </svg>
  );
}

function LocationIcon() {
  return (
    <svg className="h-5 w-5 shrink-0 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden>
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
    </svg>
  );
}

function ClockIcon() {
  return (
    <svg className="h-5 w-5 shrink-0 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden>
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
  );
}

export default function ContactFormSection() {
  const [message, setMessage] = useState("");

  return (
    <section
      className="flex flex-col"
      style={{ backgroundColor: "#7596AE" }}
      aria-labelledby="contact-heading"
    >
      <div className="flex flex-col md:flex-row">
        {/* Linke Spalte: Kontaktdaten */}
        <div className="px-6 py-12 md:w-[45%] md:px-12 md:py-16 lg:px-16">
        <h2
          id="contact-heading"
          className="text-2xl font-bold leading-tight text-white md:text-3xl lg:text-4xl"
        >
          Gemeinsam für Ihr sauberes Objekt!
        </h2>

        <div className="mt-10 space-y-8">
          <div className="flex gap-4">
            <PhoneIcon />
            <div>
              <p className="font-semibold text-white">Rufen Sie uns an</p>
              <p className="mt-1 text-white/90">+49 (711) 123 456 7</p>
              <p className="text-white/90">+49 (711) 987 654 3</p>
            </div>
          </div>
          <div className="flex gap-4">
            <LocationIcon />
            <div>
              <p className="font-semibold text-white">Standort</p>
              <p className="mt-1 text-white/90">
                4140 Parker Rd.
                <br />
                Stuttgart, 70563
              </p>
            </div>
          </div>
          <div className="flex gap-4">
            <ClockIcon />
            <div>
              <p className="font-semibold text-white">Öffnungszeiten</p>
              <p className="mt-1 text-white/90">Montag – Freitag</p>
              <p className="text-white/90">9–17 Uhr</p>
            </div>
          </div>
        </div>
        </div>

        {/* Rechte Spalte: Formular */}
        <div className="px-6 py-12 md:w-[55%] md:px-12 md:py-16 lg:px-16">
        <h3 className="text-xl font-bold text-white md:text-2xl">
          Kontakt aufnehmen
        </h3>

        <form
          className="mt-8 space-y-5"
          onSubmit={(e) => e.preventDefault()}
          noValidate
        >
          <div className="grid gap-5 sm:grid-cols-2">
            <div>
              <label htmlFor="contact-name" className="block text-sm font-medium text-white">
                Ihr Name <span className="text-white/80">*</span>
              </label>
              <input
                id="contact-name"
                type="text"
                placeholder="Name eingeben"
                className="mt-1.5 w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-slate-900 placeholder-slate-400 focus:border-slate-400 focus:outline-none focus:ring-2 focus:ring-slate-200"
                required
              />
            </div>
            <div>
              <label htmlFor="contact-email" className="block text-sm font-medium text-white">
                Ihre E-Mail <span className="text-white/80">*</span>
              </label>
              <input
                id="contact-email"
                type="email"
                placeholder="E-Mail eingeben"
                className="mt-1.5 w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-slate-900 placeholder-slate-400 focus:border-slate-400 focus:outline-none focus:ring-2 focus:ring-slate-200"
                required
              />
            </div>
          </div>

          <div className="grid gap-5 sm:grid-cols-2">
            <div>
              <label htmlFor="contact-company" className="block text-sm font-medium text-white">
                Ihre Firma
              </label>
              <input
                id="contact-company"
                type="text"
                placeholder="Firmenname"
                className="mt-1.5 w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-slate-900 placeholder-slate-400 focus:border-slate-400 focus:outline-none focus:ring-2 focus:ring-slate-200"
              />
            </div>
            <div>
              <label htmlFor="contact-budget" className="block text-sm font-medium text-white">
                Gewünschter Zeitraum
              </label>
              <input
                id="contact-budget"
                type="text"
                placeholder="z. B. ab sofort, monatlich"
                className="mt-1.5 w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-slate-900 placeholder-slate-400 focus:border-slate-400 focus:outline-none focus:ring-2 focus:ring-slate-200"
              />
            </div>
          </div>

          <div>
            <label htmlFor="contact-message" className="block text-sm font-medium text-white">
              Nachricht
            </label>
            <div className="relative mt-1.5">
              <textarea
                id="contact-message"
                placeholder="Schreiben Sie uns..."
                rows={4}
                maxLength={MAX_MESSAGE_LENGTH}
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                className="w-full resize-none rounded-xl border border-slate-200 bg-white px-4 py-3 text-slate-900 placeholder-slate-400 focus:border-slate-400 focus:outline-none focus:ring-2 focus:ring-slate-200"
              />
              <span
                className="absolute bottom-3 right-3 text-xs text-white/80"
                aria-live="polite"
              >
                {message.length}/{MAX_MESSAGE_LENGTH}
              </span>
            </div>
          </div>

          <div className="flex justify-end">
            <button
              type="submit"
              className="rounded-xl bg-white px-6 py-3 font-semibold text-[#7596AE] transition hover:bg-white/90 focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-[#7596AE]"
            >
              Senden
            </button>
          </div>
        </form>
        </div>
      </div>

      {/* Footer über die volle Breite */}
      <footer className="w-full border-t border-slate-200 bg-white px-6 py-6 md:px-12">
        <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-4 text-sm text-slate-600 sm:flex-row">
          <p>© {new Date().getFullYear()} ES Gebäudereinigung – Alle Rechte vorbehalten.</p>
          <div className="flex flex-wrap items-center justify-center gap-x-6 gap-y-1">
            <Link href="/impressum" className="hover:text-slate-900">
              Impressum
            </Link>
            <Link href="/datenschutz" className="hover:text-slate-900">
              Datenschutz
            </Link>
            <Link href="/cookie-richtlinie" className="hover:text-slate-900">
              Cookie-Richtlinie
            </Link>
          </div>
          <div className="flex items-center gap-4" aria-label="Social Media">
            <a href="#" className="text-slate-500 hover:text-slate-800" aria-label="Facebook">
              <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" /></svg>
            </a>
            <a href="#" className="text-slate-500 hover:text-slate-800" aria-label="X">
              <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" /></svg>
            </a>
            <a href="#" className="text-slate-500 hover:text-slate-800" aria-label="Instagram">
              <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.265.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.058 1.645-.07 4.849-.07zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" /></svg>
            </a>
            <a href="#" className="text-slate-500 hover:text-slate-800" aria-label="Website">
              <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9" /></svg>
            </a>
          </div>
        </div>
      </footer>
    </section>
  );
}
