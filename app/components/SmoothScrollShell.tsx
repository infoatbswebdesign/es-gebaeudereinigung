"use client";

import { useEffect, useRef } from "react";
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
          // sofortiger Jump ohne Animation, damit Reload exakt an letzter Position startet
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

        /* Navbar erst nach Initialisierung freigeben */
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

  useEffect(() => {
    const smoother = smootherRef.current;
    if (!smoother) return;

    const nextKey = buildScrollKey();
    if (nextKey === activeScrollKeyRef.current) return;

    // Vor dem Routentausch alte Route-Position sichern.
    try {
      if (activeScrollKeyRef.current) {
        sessionStorage.setItem(activeScrollKeyRef.current, String(smoother.scrollTop()));
      }
    } catch {}

    activeScrollKeyRef.current = nextKey;
    smoother.scrollTo(0, false);
    ScrollTrigger.update();
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
