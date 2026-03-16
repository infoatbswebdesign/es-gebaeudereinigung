import Image from "next/image";
import Link from "next/link";

const SECTION_BG = "#F1F0EC";

const CARD1_IMAGE = "/putzfrau-hebt-putzmittel-es-gebaeudeservice.jpg";

export default function CardsSection() {
  return (
    <section
      className="pt-20 pb-16 pl-6 pr-6 md:pt-28 md:pb-24 md:px-12"
      style={{ backgroundColor: SECTION_BG }}
      aria-labelledby="cards-heading"
    >
      <div className="mx-auto max-w-7xl">
        <h2
          id="cards-heading"
          className="mx-auto max-w-2xl text-center text-2xl font-bold leading-tight text-slate-900 md:text-3xl lg:text-4xl"
        >
          Unsere Leistungen
        </h2>

        {/* Cards: Desktop 4 Spalten, Mobile horizontal Snap-Scroll */}
        <div className="mt-12 mb-10 flex gap-6 overflow-x-auto pb-4 pt-2 snap-x snap-mandatory -mx-6 px-6 md:mx-0 md:px-0 md:mt-16 md:mb-14 md:grid md:grid-cols-4 md:overflow-visible md:pb-0 md:snap-none">
          {/* Card 1: Portrait mit Hintergrundbild + Overlay + Content – feste Höhe gegen Layout-Shift */}
          <article className="relative h-[420px] w-[280px] shrink-0 snap-center overflow-hidden rounded-2xl md:h-[480px] md:w-full">
            <div className="absolute inset-0">
              <Image
                src={CARD1_IMAGE}
                alt="Reinigungsservice: Putzmittel im Einsatz"
                fill
                className="object-cover"
                sizes="(max-width: 768px) 280px, 25vw"
              />
              <div className="absolute inset-0 bg-slate-900/60" aria-hidden />
            </div>
            <div className="relative flex h-full flex-col justify-between p-6 text-white">
              <div className="rounded-xl bg-[#7596AE] p-2.5 w-10 h-10 flex items-center justify-center">
                <svg className="size-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden>
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
                </svg>
              </div>
              <div>
                <p className="text-lg font-semibold leading-snug md:text-xl">
                  Die erste Anlaufstelle für Ihre gewerbliche Reinigung.
                </p>
                <Link
                  href="/kontakt"
                  className="mt-4 inline-block rounded-xl bg-[#7596AE] px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-[#7596AE] focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2 focus:ring-offset-slate-900/20"
                >
                  Jetzt anfragen
                </Link>
              </div>
            </div>
          </article>

          {/* Card 2: Weiß, Icon, Titel, Text, Link */}
          <article className="flex min-h-[420px] w-[280px] shrink-0 snap-center flex-col rounded-2xl bg-white p-6 shadow-lg shadow-slate-200/60 md:min-h-[480px] md:w-full">
            <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-xl bg-slate-800 text-white">
              <svg className="size-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden>
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
              </svg>
            </div>
            <h3 className="text-xl font-bold text-slate-900">Reinigungsservice</h3>
            <p className="mt-3 flex-1 text-sm leading-relaxed text-slate-600">
              Professionelle Reinigung für Ihr Objekt – regelmäßig, zuverlässig und an Ihre Anforderungen angepasst.
            </p>
            <Link
              href="/leistungen#reinigung"
              className="mt-4 font-medium text-slate-900 underline decoration-slate-300 underline-offset-2 hover:decoration-slate-900"
            >
              Mehr erfahren
              <span aria-hidden> →</span>
            </Link>
          </article>

          {/* Card 3 */}
          <article className="flex min-h-[420px] w-[280px] shrink-0 snap-center flex-col rounded-2xl bg-white p-6 shadow-lg shadow-slate-200/60 md:min-h-[480px] md:w-full">
            <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-700 text-white">
              <svg className="size-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden>
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h3 className="text-xl font-bold text-slate-900">Winterdienst</h3>
            <p className="mt-3 flex-1 text-sm leading-relaxed text-slate-600">
              Räum- und Streudienst bei Schnee und Eis – damit Ihre Wege und Zugänge sicher und nutzbar bleiben.
            </p>
            <Link
              href="/leistungen#winterdienst"
              className="mt-4 font-medium text-slate-900 underline decoration-slate-300 underline-offset-2 hover:decoration-slate-900"
            >
              Mehr erfahren
              <span aria-hidden> →</span>
            </Link>
          </article>

          {/* Card 4 */}
          <article className="flex min-h-[420px] w-[280px] shrink-0 snap-center flex-col rounded-2xl bg-white p-6 shadow-lg shadow-slate-200/60 md:min-h-[480px] md:w-full">
            <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-xl bg-sky-700 text-white">
              <svg className="size-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden>
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
              </svg>
            </div>
            <h3 className="text-xl font-bold text-slate-900">Gebäudeservice</h3>
            <p className="mt-3 flex-1 text-sm leading-relaxed text-slate-600">
              Rundum-Service für Ihr Gebäude: von der Reinigung bis zum Winterdienst – eine Anlaufstelle für Ihr Objekt.
            </p>
            <Link
              href="/leistungen#gebaeudeservice"
              className="mt-4 font-medium text-slate-900 underline decoration-slate-300 underline-offset-2 hover:decoration-slate-900"
            >
              Mehr erfahren
              <span aria-hidden> →</span>
            </Link>
          </article>
        </div>
      </div>
    </section>
  );
}
