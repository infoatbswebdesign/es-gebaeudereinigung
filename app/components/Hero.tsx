import Link from "next/link";
import HeroArrowLink from "./HeroArrowLink";

const HERO_VIDEO_SRC = "/es-gebaeudereinigung-hero-section-video.mp4";

const BurgerIcon = () => (
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
);

export default function Hero() {
  return (
    <section
      className="relative grid h-screen w-full grid-cols-1 grid-rows-[1fr_auto] md:min-h-screen md:grid-rows-1 md:grid-cols-2"
      aria-label="Hero-Bereich"
    >
      {/* Mobil: Logo links oben + Burger rechts oben auf dem Video */}
      <header className="absolute left-0 right-0 top-0 z-10 flex items-center justify-between px-6 py-5 md:hidden">
        <Link
          href="/"
          aria-label="Zur Startseite"
          className="rounded text-xl font-bold tracking-tight text-white focus:outline-none focus:ring-2 focus:ring-white/50 focus:ring-offset-2 focus:ring-offset-transparent"
        >
          ES
        </Link>
        <button
          type="button"
          className="flex size-10 items-center justify-center text-white/90 transition hover:text-white focus:outline-none focus:ring-2 focus:ring-white/50 focus:ring-offset-2 focus:ring-offset-slate-900/30"
          aria-label="Menü öffnen"
        >
          <BurgerIcon />
        </button>
      </header>

      {/* Rechte Hälfte Desktop / Obere Hälfte Mobil: Video (zuerst auf Mobil, teilt sich 100vh mit Content) */}
      <div className="relative order-1 min-h-0 w-full overflow-hidden md:order-2 md:h-screen">
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
        <div
          className="absolute inset-0 bg-[#7596AE]/15"
          aria-hidden
        />
      </div>

      {/* Linke Hälfte Desktop / Untere Hälfte Mobil: Farbbereich + Content (Mobil kompakt) */}
      <div className="relative order-2 flex min-h-0 flex-col bg-[#7596AE] px-6 py-6 md:order-1 md:min-h-screen md:px-12 md:py-10">
        {/* Burger: nur Desktop, oben links im Farbbereich */}
        <div className="absolute left-6 top-8 hidden md:block md:left-12 md:top-10">
          <button
            type="button"
            className="flex size-10 items-center justify-center text-white/90 transition hover:text-white focus:outline-none focus:ring-2 focus:ring-white/50 focus:ring-offset-2 focus:ring-offset-[#7596AE]"
            aria-label="Menü öffnen"
          >
            <BurgerIcon />
          </button>
        </div>
        {/* Ein gemeinsamer Container: beide Blöcke links auf gleichem Bund */}
        <div className="flex flex-1 flex-col md:mt-28">
          <div className="mx-auto w-full max-w-lg flex-1 flex flex-col text-left">
            {/* Headline + CTA: Mobil unter Untertitel, Desktop unten (Reihenfolge per order) */}
            <div className="order-2 pb-8 pt-10 md:mt-auto md:pb-28 md:pt-16">
              <h1 className="text-4xl font-bold leading-tight text-white md:text-7xl">
                Perfektion in jedem Quadratmeter.
              </h1>
              <p className="mt-6">
                <Link
                  href="/kontakt"
                  className="inline-flex items-center justify-center rounded-full border-2 border-white bg-transparent px-6 py-3.5 text-base font-semibold text-white transition hover:bg-white hover:text-[#7596AE] focus:outline-none focus:ring-2 focus:ring-white/50 focus:ring-offset-2 focus:ring-offset-[#7596AE]"
                >
                  Angebot anfragen
                </Link>
              </p>
            </div>

            {/* Untertitel: oben (Mobil + Desktop), Pfeil-Link nur Icon (Desktop: GSAP-Hover) */}
            <p className="order-1 text-base leading-relaxed text-white/95 md:text-xl">
              Wir sorgen für Sauberkeit. Sie für den Erfolg.
              <HeroArrowLink />
            </p>
          </div>
        </div>

        {/* Logo: unten links (nur Desktop, da Mobil im Header oben) */}
        <div className="absolute bottom-6 left-6 hidden md:block md:bottom-10 md:left-12">
          <Link
            href="/"
            aria-label="Zur Startseite"
            className="block rounded focus:outline-none focus:ring-2 focus:ring-white/50 focus:ring-offset-2 focus:ring-offset-[#7596AE]"
          >
            <span className="text-xl font-bold tracking-tight text-white md:text-2xl">
              ES
            </span>
          </Link>
        </div>
      </div>
    </section>
  );
}
