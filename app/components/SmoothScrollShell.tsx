"use client";

import { useLayoutEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import ScrollSmoother from "gsap/ScrollSmoother";
import { useGSAP } from "@gsap/react";
import { usePathname, useSearchParams } from "next/navigation";
import { useMarkSmootherReady } from "../context/SmootherContext";
import SiteNavbar from "./SiteNavbar";

gsap.registerPlugin(ScrollTrigger, ScrollSmoother, useGSAP);

type Props = {
  children: React.ReactNode;
};

const SCROLL_STORAGE_PREFIX = "smoothScrollY:";
const SMOOTHER_DESKTOP_MEDIA =
  "(min-width: 1024px) and (hover: hover) and (pointer: fine)";
const SMOOTHER_FALLBACK_MEDIA =
  "(max-width: 1023px), (hover: none), (pointer: coarse)";

/**
 * ScrollSmoother-Wrapper: Inhalt in #smooth-content; fixierte Elemente (Navbar) außerhalb.
 *
 * Next.js-Best-Practice fuer Route-Transitions:
 * - <Link> committed alte + neue Page synchron in einem React-Commit; es gibt
 *   keinen sichtbaren "leeren" Frame. Daher KEIN visibility-Hack mehr.
 * - Da der ScrollSmoother den Scroll per Transform auf #smooth-content simuliert
 *   und `window.scrollY` aus Sicht des Browsers immer 0 ist, uebernimmt Next.js
 *   das Top-Scrolling bei Navigation NICHT automatisch. Wir muessen den
 *   Smoother synchron (vor Paint) auf 0 zuruecksetzen -> useLayoutEffect auf
 *   den pathname.
 */
export default function SmoothScrollShell({ children }: Props) {
  const rootRef = useRef<HTMLDivElement>(null);
  const markReady = useMarkSmootherReady();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const smootherRef = useRef<ScrollSmoother | null>(null);
  const activeScrollKeyRef = useRef<string>("");

  const buildScrollKey = () =>
    `${SCROLL_STORAGE_PREFIX}${window.location.pathname}${window.location.search}`;

  /**
   * Hart-Reset der Scroll-Position ohne sichtbare Animation.
   * Das Ziel und die interpolierte "current"-Position des Smoothers werden
   * gemeinsam auf 0 gesetzt, damit der naechste Paint die neue Seite bereits
   * am Anfang zeigt (kein kurzes "Nachfedern").
   */
  const snapToTop = () => {
    if (typeof window === "undefined") return;
    const smoother = smootherRef.current;

    if (smoother) {
      const prevSmooth = smoother.smooth();
      smoother.smooth(0);
      smoother.scrollTop(0);
      // Content-Transform hart setzen, falls der Smoother-Tick noch nicht
      // gelaufen ist.
      gsap.set("#smooth-content", { y: 0, force3D: true });
      window.scrollTo(0, 0);
      smoother.smooth(prevSmooth || 1);
      ScrollTrigger.update();
      return;
    }

    // Mobile / kein Smoother: nativer Scroll. scroll-behavior ist global auf
    // "auto" gesetzt, daher springt scrollTo synchron.
    const docEl = document.documentElement;
    const previousBehavior = docEl.style.scrollBehavior;
    docEl.style.scrollBehavior = "auto";
    window.scrollTo(0, 0);
    docEl.style.scrollBehavior = previousBehavior;
  };

  useGSAP(
    () => {
      if ("scrollRestoration" in history) {
        history.scrollRestoration = "manual";
      }

      const mm = gsap.matchMedia();

      mm.add(SMOOTHER_DESKTOP_MEDIA, () => {
        const smoother = ScrollSmoother.create({
          wrapper: "#smooth-wrapper",
          content: "#smooth-content",
          smooth: 1,
          effects: true,
          smoothTouch: 0.1,
          ease: "expo.out",
        });
        smootherRef.current = smoother;

        const initialKey = buildScrollKey();
        activeScrollKeyRef.current = initialKey;
        const savedY = Number(sessionStorage.getItem(initialKey) || "0");
        if (Number.isFinite(savedY) && savedY > 0) {
          smoother.scrollTo(savedY, false);
          ScrollTrigger.update();
        }

        const persistScroll = () => {
          try {
            if (!activeScrollKeyRef.current) return;
            sessionStorage.setItem(
              activeScrollKeyRef.current,
              String(smoother.scrollTop()),
            );
          } catch {}
        };

        const saveTrigger = ScrollTrigger.create({
          start: 0,
          end: "max",
          onUpdate: persistScroll,
        });

        window.addEventListener("pagehide", persistScroll);
        window.addEventListener("beforeunload", persistScroll);

        let raf1 = 0;
        raf1 = requestAnimationFrame(() => {
          document.documentElement.classList.remove("ss-preinit");
          document.documentElement.style.removeProperty("--ss-initial-y");
          markReady();
        });

        return () => {
          cancelAnimationFrame(raf1);
          persistScroll();
          saveTrigger.kill();
          window.removeEventListener("pagehide", persistScroll);
          window.removeEventListener("beforeunload", persistScroll);
          smootherRef.current = null;
          smoother.kill();
        };
      });

      mm.add(SMOOTHER_FALLBACK_MEDIA, () => {
        const key = buildScrollKey();
        activeScrollKeyRef.current = key;
        document.documentElement.classList.remove("ss-preinit");
        document.documentElement.style.removeProperty("--ss-initial-y");
        markReady();
      });

      return () => {
        mm.revert();
        if ("scrollRestoration" in history) {
          history.scrollRestoration = "manual";
        }
        document.documentElement.classList.remove("ss-preinit");
        document.documentElement.style.removeProperty("--ss-initial-y");
      };
    },
    { scope: rootRef }
  );

  /**
   * Scroll-Reset bei Routen-Wechsel.
   *
   * useLayoutEffect feuert synchron VOR dem naechsten Paint. React hat die
   * neue Page bereits gemountet (der alte Baum ist weg, der neue da). Wir
   * setzen Smoother und nativen Scroll auf 0 – der anschliessende Paint zeigt
   * die neue Seite direkt am Anfang, ohne "Rueckscroll-Blitz".
   *
   * WICHTIG: Keine visibility-Hacks, kein globaler Click-Handler. Der React-
   * Commit ist atomar – dazwischen ist nie ein "leerer Frame" sichtbar.
   */
  useLayoutEffect(() => {
    if (typeof window === "undefined") return;

    const nextKey = buildScrollKey();
    const isSameRoute = nextKey === activeScrollKeyRef.current;
    activeScrollKeyRef.current = nextKey;

    // Initialer Mount oder identische Route (z. B. nur searchParams-Init):
    // nichts tun, sonst reiss-zurueck beim ersten Render.
    if (isSameRoute) return;

    // Hash-Links (/seite#anker) selbst steuern lassen – Browser / Next.js
    // kuemmern sich um den scrollIntoView auf das Ziel-Id.
    if (window.location.hash) return;

    snapToTop();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pathname, searchParams]);

  return (
    <div ref={rootRef}>
      <div id="smooth-wrapper">
        <div id="smooth-content" className="smooth-content--ready">
          {children}
        </div>
      </div>
      <SiteNavbar />
    </div>
  );
}
