"use client";

import type { ReactNode } from "react";
import { useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";

gsap.registerPlugin(ScrollTrigger, useGSAP);

type Props = {
  hero: ReactNode;
  nextSection: ReactNode;
};

export default function HeroV2StickyScrollTransition({ hero, nextSection }: Props) {
  const rootRef = useRef<HTMLElement>(null);
  const heroRef = useRef<HTMLDivElement>(null);
  const nextSectionRef = useRef<HTMLDivElement>(null);
  const darkOverlayRef = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const rootEl = rootRef.current;
      const heroEl = heroRef.current;
      const nextEl = nextSectionRef.current;
      const darkOverlayEl = darkOverlayRef.current;
      if (!rootEl || !heroEl || !nextEl || !darkOverlayEl) return;

      const mm = gsap.matchMedia();

      /**
       * WICHTIG: gsap.matchMedia ruft den Callback nur auf, wenn mindestens
       * eine Query matched. Daher MUSS auch eine explizite Mobile-Query dabei
       * sein – sonst wird die Animation auf Mobile nie eingerichtet.
       */
      mm.add(
        {
          isDesktop: "(min-width: 1024px) and (hover: hover) and (pointer: fine)",
          isMobile: "(max-width: 1023px), (hover: none), (pointer: coarse)",
          reduceMotion: "(prefers-reduced-motion: reduce)",
        },
        (context) => {
          const { isDesktop, reduceMotion } = context.conditions as {
            isDesktop: boolean;
            isMobile: boolean;
            reduceMotion: boolean;
          };

          gsap.set(nextEl, { clearProps: "transform" });
          gsap.set(darkOverlayEl, { opacity: 0 });

          if (reduceMotion) return;

          /**
           * Best Practice Overlap:
           * - Strecke = exakt aktuelle heroHeight (Funktion → reagiert auf iOS
           *   Safari Adressleisten-Wechsel und Resize).
           * - Desktop: GSAP-Pin (ScrollSmoother-kompatibel), pinSpacing:false → kein Leerraum.
           * - Mobile: kein Pin, Hero per CSS sticky → natuerliches Overlap der Section.
           * - scrub: true auf beiden Devices → identisches 1:1 Gefuehl.
           * - Overlay 0 → 0.55 mit power2.out, peak bei ~55% der Strecke.
           */
          return gsap.timeline({
            scrollTrigger: {
              trigger: rootEl,
              start: "top top",
              end: () => `+=${heroEl.offsetHeight || window.innerHeight}`,
              scrub: true,
              pin: isDesktop ? heroEl : false,
              pinSpacing: false,
              invalidateOnRefresh: true,
              anticipatePin: isDesktop ? 1 : 0,
            },
          }).to(
            darkOverlayEl,
            { opacity: 0.55, ease: "power2.out", duration: 0.55 },
            0,
          );
        },
      );

      ScrollTrigger.refresh();

      return () => {
        mm.revert();
      };
    },
    { scope: rootRef, revertOnUpdate: true },
  );

  return (
    <section ref={rootRef} className="hero-v2-overlap-panels">
      <div ref={heroRef} className="hero-v2-overlap-panels__hero">
        {hero}
        <div
          ref={darkOverlayRef}
          className="hero-v2-overlap-panels__hero-dark-overlay"
          aria-hidden
        />
      </div>
      <div ref={nextSectionRef} className="hero-v2-overlap-panels__next">
        {nextSection}
      </div>
    </section>
  );
}
