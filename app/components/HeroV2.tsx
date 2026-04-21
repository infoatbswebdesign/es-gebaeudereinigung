import Link from "next/link";
import Image from "next/image";
import HeroV2VideoController from "@/app/components/HeroV2VideoController";
import HeroV2ScrollExploreHint from "@/app/components/HeroV2ScrollExploreHint";
import HeroV2TrustRow from "@/app/components/HeroV2TrustRow";
import ScrollToContactButton from "@/app/components/ScrollToContactButton";
import { BTN_PRIMARY_INVERSE, BTN_SECONDARY_LIGHT } from "@/app/components/buttonStyles";
import { heroPosterFirstFrame } from "@/app/assets/images";

const HERO_VIDEO_MP4_SRC = "/es-gebaeudereinigung-hero-section-video.mp4";
const HERO_POSTER_SRC = heroPosterFirstFrame;
// Natives Poster-Attribut des <video>-Elements: derselbe Frame 0, aber als
// direkter Pfad (Video-Pipeline rendert ihn, nicht die Next/Image-CSS-Pipeline).
// Dadurch liegt der sichtbare Hero-Hintergrund bereits beim ersten Paint im
// Video-Element, und der Wechsel zum Video-Stream passiert intern im Browser
// ohne Overlay-Ghosting zwischen zwei Rendering-Pipelines.
const HERO_VIDEO_POSTER_SRC = "/es-gebaeudereinigung-hero-section-first-frame.jpg";

/**
 * Server Hero-Markup; minimale Browser-Video-Logik in HeroV2VideoController.
 */
export default function HeroV2() {
  return (
    <section
      id="hero-v2"
      className="relative flex min-h-[96svh] w-full flex-col md:min-h-screen"
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
          fetchPriority="high"
          placeholder="blur"
          aria-hidden
          className="absolute inset-0 z-0 h-full w-full object-cover"
        />
        <HeroV2VideoController
          sectionId="hero-v2"
          videoId="hero-v2-video"
          readyClassName="hero-v2-video--ready"
          reducedMotionClassName="hero-v2--reduced-motion"
        />
        {/* Kein CSS-Fade zwischen Poster (<Image>) und Video: auf grossen
            Retina-Viewports rendern <img> und <video> denselben Frame sub-
            pixelweise leicht unterschiedlich, was bei einem Fade als Flicker
            sichtbar wurde. Das Video bekommt stattdessen sein natives
            poster-Attribut und ist von Beginn an voll opak. Der Browser
            rendert Poster und Video-Stream dadurch mit derselben Video-
            Pipeline und wechselt intern ohne sichtbare Ueberlagerung.
            Next/Image liegt weiter darunter und dient als Fallback
            (prefers-reduced-motion / Video-Ladephase). */}
        <video
          id="hero-v2-video"
          aria-hidden
          poster={HERO_VIDEO_POSTER_SRC}
          className="absolute inset-0 z-10 h-full w-full object-cover"
          loop
          muted
          playsInline
          preload="none"
        >
          <source src={HERO_VIDEO_MP4_SRC} type="video/mp4" />
          Ihr Browser unterstützt die Wiedergabe des Videos nicht.
        </video>
        {/* Overlay für Lesbarkeit */}
        <div className="hero-v2-overlay absolute inset-0 z-20" aria-hidden />
      </div>

      {/* Inhalt darüber: zentriert (Kopfzeile: fixe SiteNavbar außerhalb von #smooth-content) */}
      <div className="relative z-30 flex min-h-[96svh] flex-col px-6 py-8 md:min-h-screen md:px-12 md:py-10">
        {/* Zentrierter Hauptinhalt */}
        <div className="flex flex-1 flex-col items-center justify-center pt-10 text-center md:pt-14">
          <p className="mb-4 max-w-md text-sm text-white/90 md:text-base">
            Wir sorgen für Sauberkeit. Sie für den Erfolg.
          </p>
          <h1 className="max-w-3xl text-3xl font-bold leading-tight text-white sm:text-4xl md:text-5xl lg:text-6xl">
            Perfektion in jedem Quadratmeter.
          </h1>
          <div className="mt-8 flex flex-col items-center gap-4 sm:flex-row sm:gap-6">
            <ScrollToContactButton className={BTN_PRIMARY_INVERSE}>
              Angebot anfragen
            </ScrollToContactButton>
            <Link href="/ueber-uns" className={BTN_SECONDARY_LIGHT}>
              Mehr erfahren
            </Link>
          </div>
        </div>

        <div className="pointer-events-none absolute inset-x-0 bottom-6 z-35 px-6 md:bottom-10 md:px-12">
          <div className="pointer-events-auto w-full">
            <HeroV2TrustRow />
          </div>
        </div>

        <HeroV2ScrollExploreHint />
      </div>
    </section>
  );
}
