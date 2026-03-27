import Link from "next/link";
import Image from "next/image";
import HeroV2VideoController from "@/app/components/HeroV2VideoController";
import ScrollToContactButton from "@/app/components/ScrollToContactButton";

const HERO_VIDEO_MP4_SRC = "/es-gebaeudereinigung-hero-section-video.mp4";
const HERO_POSTER_SRC = "/es-gebaeudereinigung-hero-section-first-frame.jpg";

/**
 * Server Hero-Markup; minimale Browser-Video-Logik in HeroV2VideoController.
 */
export default function HeroV2() {
  return (
    <section
      id="hero-v2"
      className="relative flex min-h-screen w-full flex-col"
      aria-label="Hero-Bereich (Variante 2)"
    >
      {/* Vollflächiges Hintergrund-Video */}
      <div className="absolute inset-0 overflow-hidden">
        <Image
          src={HERO_POSTER_SRC}
          alt=""
          fill
          sizes="100vw"
          priority
          aria-hidden
          className="absolute inset-0 z-0 h-full w-full object-cover"
        />
        <HeroV2VideoController
          sectionId="hero-v2"
          videoId="hero-v2-video"
          readyClassName="hero-v2-video--ready"
          reducedMotionClassName="hero-v2--reduced-motion"
        />
        <video
          id="hero-v2-video"
          aria-hidden
          autoPlay
          className="absolute inset-0 z-10 h-full w-full object-cover opacity-0 transition-opacity duration-700"
          loop
          muted
          poster={HERO_POSTER_SRC}
          playsInline
          preload="metadata"
        >
          <source src={HERO_VIDEO_MP4_SRC} type="video/mp4" />
          Ihr Browser unterstützt die Wiedergabe des Videos nicht.
        </video>
        {/* Overlay für Lesbarkeit */}
        <div className="hero-v2-overlay absolute inset-0 z-20" aria-hidden />
      </div>

      {/* Inhalt darüber: zentriert (Kopfzeile: fixe SiteNavbar außerhalb von #smooth-content) */}
      <div className="relative z-30 flex min-h-screen flex-col px-6 py-8 md:px-12 md:py-10">
        {/* Zentrierter Hauptinhalt */}
        <div className="flex flex-1 flex-col items-center justify-center pt-10 text-center md:pt-14">
          <p className="mb-4 max-w-md text-sm text-white/90 md:text-base">
            Wir sorgen für Sauberkeit. Sie für den Erfolg.
          </p>
          <h1 className="max-w-3xl text-3xl font-bold leading-tight text-white sm:text-4xl md:text-5xl lg:text-6xl">
            Perfektion in jedem Quadratmeter.
          </h1>
          <div className="mt-8 flex flex-col items-center gap-4 sm:flex-row sm:gap-6">
            <ScrollToContactButton className="inline-flex items-center justify-center rounded-full bg-white px-6 py-3.5 text-base font-semibold text-slate-900 transition hover:bg-white/90 focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-transparent">
              Angebot anfragen
            </ScrollToContactButton>
            <Link
              href="/ueber-uns"
              className="inline-flex items-center gap-1 text-white underline decoration-white/70 underline-offset-2 hover:decoration-white"
            >
              Mehr erfahren
            </Link>
          </div>
        </div>

        <Link
          href="#ueber-uns"
          className="hero-v2-scroll-indicator group mx-auto mb-4 inline-flex flex-col items-center gap-2 text-white/90 hover:text-white focus:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-transparent md:mb-6"
          aria-label="Zum nächsten Abschnitt scrollen"
        >
          <span className="text-xs font-semibold tracking-[0.22em] uppercase">
            Scroll
          </span>
          <span
            className="flex h-10 w-6 items-start justify-center rounded-full border border-white/70 p-1"
            aria-hidden
          >
            <span className="hero-v2-scroll-indicator-dot h-2 w-2 rounded-full bg-white" />
          </span>
        </Link>
      </div>
    </section>
  );
}
