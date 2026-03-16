import Link from "next/link";

const HERO_VIDEO_SRC = "/es-gebaeudereinigung-hero-section-video.mp4";

/**
 * Hero-Variante 2: Full-Width mit Video-Hintergrund und zentriertem Overlay.
 * Server Component, gleiche Next.js-Best-Practices wie Hero.tsx (Video: autoPlay, muted, loop, playsInline).
 */
export default function HeroV2() {
  return (
    <section
      className="relative flex min-h-screen w-full flex-col"
      aria-label="Hero-Bereich (Variante 2)"
    >
      {/* Vollflächiges Hintergrund-Video */}
      <div className="absolute inset-0 overflow-hidden">
        <video
          aria-hidden
          autoPlay
          className="absolute inset-0 h-full w-full object-cover"
          loop
          muted
          playsInline
          preload="metadata"
          src={HERO_VIDEO_SRC}
        >
          <source src={HERO_VIDEO_SRC} type="video/mp4" />
          Ihr Browser unterstützt die Wiedergabe des Videos nicht.
        </video>
        {/* Overlay für Lesbarkeit */}
        <div
          className="absolute inset-0 bg-[#7596AE]/25"
          aria-hidden
        />
        <div
          className="absolute inset-0 bg-stone-800/35"
          aria-hidden
        />
      </div>

      {/* Inhalt darüber: zentriert */}
      <div className="relative z-10 flex min-h-screen flex-col px-6 py-8 md:px-12 md:py-10">
        {/* Kopfzeile: Logo links, Menü rechts */}
        <header className="flex w-full items-center justify-between">
          <Link
            href="/"
            aria-label="Zur Startseite"
            className="rounded text-xl font-bold tracking-tight text-white focus:outline-none focus:ring-2 focus:ring-white/50 focus:ring-offset-2 focus:ring-offset-transparent md:text-2xl"
          >
            ES
          </Link>
          <button
            type="button"
            className="flex size-10 items-center justify-center text-white/90 transition hover:text-white focus:outline-none focus:ring-2 focus:ring-white/50 focus:ring-offset-2 focus:ring-offset-transparent"
            aria-label="Menü öffnen"
          >
            <svg
              className="size-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              aria-hidden
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 6h16M4 12h16M4 18h16"
              />
            </svg>
          </button>
        </header>

        {/* Zentrierter Hauptinhalt */}
        <div className="flex flex-1 flex-col items-center justify-center text-center">
          <p className="mb-4 max-w-md text-sm text-white/90 md:text-base">
            Wir sorgen für Sauberkeit. Sie für den Erfolg.
          </p>
          <h1 className="max-w-3xl text-3xl font-bold leading-tight text-white sm:text-4xl md:text-5xl lg:text-6xl">
            Perfektion in jedem Quadratmeter.
          </h1>
          <div className="mt-8 flex flex-col items-center gap-4 sm:flex-row sm:gap-6">
            <Link
              href="/kontakt"
              className="inline-flex items-center justify-center rounded-full bg-white px-6 py-3.5 text-base font-semibold text-slate-900 transition hover:bg-white/90 focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-transparent"
            >
              Angebot anfragen
            </Link>
            <Link
              href="/leistungen"
              className="inline-flex items-center gap-1 text-white underline decoration-white/70 underline-offset-2 hover:decoration-white"
            >
              Mehr erfahren
              <span aria-hidden>→</span>
            </Link>
          </div>
        </div>

        {/* Link zur anderen Hero-Variante (Vergleich) */}
        <p className="absolute bottom-6 left-1/2 -translate-x-1/2 text-center text-xs text-white/70">
          <Link
            href="/"
            className="underline decoration-white/50 underline-offset-2 hover:decoration-white hover:text-white"
          >
            ← Zur Hauptseite (Hero Variante 1)
          </Link>
        </p>
      </div>
    </section>
  );
}
