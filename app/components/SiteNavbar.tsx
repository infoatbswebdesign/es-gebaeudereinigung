"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import ScrollSmoother from "gsap/ScrollSmoother";
import { useGSAP } from "@gsap/react";
import { CONTACT_EMAIL, CONTACT_PHONE_DISPLAY, CONTACT_PHONE_TEL } from "@/app/contact";
import { useSmootherReady } from "../context/SmootherContext";
import { acquireViewportLock, releaseViewportLock } from "../viewportLock";
import { logoWhite } from "@/app/assets/images";

gsap.registerPlugin(useGSAP, ScrollTrigger);

/* ─── Konstanten ──────────────────────────────────────────── */

const SOLID_BG_MIN_PX = 400;
const SOLID_BG_VH_RATIO = 0.72;
// Show/Hide darf früher zuschlagen als der Background-Wechsel,
// damit die Navbar beim Scrollen schneller verschwindet.
const NAV_HIDE_MIN_PX = 220;
const NAV_HIDE_VH_RATIO = 0.42;
const DELTA_MIN = 4;

const LOGO_WHITE_SRC = logoWhite;
const NAV_HIDE_DURATION = 0.3;
const NAV_HIDE_EASE = "power2.in";
const NAV_SHOW_DURATION = 0.55;
const NAV_SHOW_EASE = "power3.out";
const NAV_VISIBILITY_STORAGE_KEY = "siteNavbarVisible";
const INSTAGRAM_URL = "https://www.instagram.com/es_reinigungsservice/";

/** Flache Navbar-Zeile (Hamburger); Logo wird per absolute top/height „reingezogen“. */
const LOGO_H_END_PX = 40;
const LOGO_TOP_END_PX = 8;
const MENU_TOP_END_PX = 2;
const LOGO_START_TOP_PX = 32;
const LOGO_START_TOP_MD_PX = 40;
const LOGO_START_HEIGHT_PX = 76;
const LOGO_START_HEIGHT_MD_PX = 88;
const MENU_START_TOP_PX = 38;
const MENU_START_TOP_MD_PX = 46;

/* ─── Helpers ─────────────────────────────────────────────── */

function isDesktop(): boolean {
  return typeof window !== "undefined" && window.matchMedia("(min-width: 768px)").matches;
}

function currentScrollY(smoother?: ScrollSmoother | null): number {
  if (smoother) return smoother.scrollTop();
  if (typeof window === "undefined") return 0;
  return window.scrollY || window.pageYOffset || 0;
}

function logoScrollEndPx(): number {
  if (typeof window === "undefined") return 340;
  return Math.min(400, Math.round(window.innerHeight * 0.42));
}

function menuButtonOpenFixedYPx(): number {
  const md = isDesktop();
  return (md ? MENU_START_TOP_MD_PX : MENU_START_TOP_PX) - MENU_TOP_END_PX;
}

function solidBackgroundScrollThreshold(): number {
  if (typeof window === "undefined") return SOLID_BG_MIN_PX;
  return Math.max(SOLID_BG_MIN_PX, Math.round(window.innerHeight * SOLID_BG_VH_RATIO));
}

function navHideScrollThreshold(): number {
  if (typeof window === "undefined") return NAV_HIDE_MIN_PX;
  return Math.max(NAV_HIDE_MIN_PX, Math.round(window.innerHeight * NAV_HIDE_VH_RATIO));
}

function isViewportLockActive(): boolean {
  if (typeof document === "undefined") return false;
  return Number(document.documentElement.dataset.viewportLockCount ?? "0") > 0;
}

/** Am Dokumentende (Mobile Bounce / Anschnitt): kein Navbar-„Show“ per Delta triggern. */
function isNearDocumentBottom(scrollY: number): boolean {
  if (typeof window === "undefined") return false;
  const doc = document.documentElement;
  const maxScroll = Math.max(0, doc.scrollHeight - window.innerHeight);
  return scrollY >= maxScroll - 40;
}

/**
 * Logo-Morph ueber `scale` statt `height`: der intrinsische `h-[40px]`-Slot
 * bleibt stabil, wir skalieren ihn nur fuer die visuelle Groesse. Das vermeidet
 * Layout-Thrashing (Forced Reflow), weil sich die intrinsische Groesse nicht
 * aendert – transformationen laufen ausschliesslich auf dem Compositor.
 * Das Logo ist quadratisch; `scale` skaliert X und Y uniform.
 */
function applyMorphLayout(
  logoEl: HTMLElement,
  menuEl: HTMLElement,
  progress: number
): void {
  const p = gsap.utils.clamp(0, 1, progress);
  const inv = 1 - p;
  const md = isDesktop();

  const logoHeightStart = md ? LOGO_START_HEIGHT_MD_PX : LOGO_START_HEIGHT_PX;
  const logoHeight = LOGO_H_END_PX + (logoHeightStart - LOGO_H_END_PX) * inv;
  const logoScale = logoHeight / LOGO_H_END_PX;
  const logoYStart = (md ? LOGO_START_TOP_MD_PX : LOGO_START_TOP_PX) - LOGO_TOP_END_PX;
  const menuYStart = (md ? MENU_START_TOP_MD_PX : MENU_START_TOP_PX) - MENU_TOP_END_PX;

  gsap.set(logoEl, {
    y: logoYStart * inv,
    scaleX: logoScale,
    scaleY: logoScale,
    transformOrigin: "left top",
  });
  gsap.set(menuEl, { y: menuYStart * inv });
}

/* ─── Component ───────────────────────────────────────────── */

export default function SiteNavbar() {
  const pathname = usePathname();
  const shellRef = useRef<HTMLDivElement>(null);
  const logoLinkRef = useRef<HTMLAnchorElement>(null);
  const menuButtonRef = useRef<HTMLButtonElement>(null);
  const menuOpenRef = useRef(false);
  const visibleRef = useRef(true);
  const lastYRef = useRef(0);

  /* Bug-Fix: window.scrollY ist mit ScrollSmooothers fixed-Wrapper
     immer 0 → useState-Initializer nicht damit füttern. */
  const [solidNavBg, setSolidNavBg] = useState(false);
  const [navReady, setNavReady] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [menuPeek, setMenuPeek] = useState(false);
  const smootherReady = useSmootherReady();

  // Markiert, dass das Menue wegen Navigation (Link-Klick) geschlossen wird.
  // In dem Fall darf der Viewport-Lock die alte Scroll-Position NICHT mehr
  // restaurieren – die Zielseite wird ohnehin nach oben gescrollt.
  const closingForNavigationRef = useRef(false);

  useEffect(() => {
    if (!menuOpen || typeof window === "undefined") return undefined;
    acquireViewportLock();

    return () => {
      const skipScrollRestore = closingForNavigationRef.current;
      closingForNavigationRef.current = false;
      releaseViewportLock({ skipScrollRestore });
    };
  }, [menuOpen]);

  useGSAP(
    () => {
      // Nur useGSAP für Scroll-/Animationseffekte.
      if (!smootherReady) return;

    menuOpenRef.current = menuOpen;

    const shell = shellRef.current;
    const menuButton = menuButtonRef.current;
    const smoother = ScrollSmoother.get();
    if (smoother) {
      smoother.paused(menuOpen);
    }

    if (!shell) return;

    // Im geöffneten Menü bleibt der Close-Button immer an der initialen Hamburger-Position.
    if (menuOpen && menuButton) {
      gsap.set(menuButton, { y: menuButtonOpenFixedYPx() });
    }

    // Menü darf die Navbar nie "wegparken": beim Open/Close immer sichtbar halten.
    shell.classList.add("nav-shell--ready");
    setNavReady(true);
    visibleRef.current = true;
    sessionStorage.setItem(NAV_VISIBILITY_STORAGE_KEY, "true");
    gsap.killTweensOf(shell);
    gsap.set(shell, { autoAlpha: 1 });
    gsap.to(shell, {
      yPercent: 0,
      duration: menuOpen ? 0 : 0.25,
      ease: NAV_SHOW_EASE,
      overwrite: true,
    });

    if (!menuOpen) {
      // Delta-Berechnung nach Menü-Schließen neu synchronisieren.
      const yCurrent = currentScrollY(smoother);
      lastYRef.current = yCurrent;

      // Beim Schließen sofort zurück in die korrekte Navbar-Morphposition.
      const logoLink = logoLinkRef.current;
      if (logoLink && menuButton) {
        applyMorphLayout(
          logoLink,
          menuButton,
          gsap.utils.clamp(0, 1, yCurrent / logoScrollEndPx())
        );
      }
      ScrollTrigger.update();
    }
    },
    { scope: shellRef, dependencies: [menuOpen, smootherReady] }
  );

  const toggleMenu = () => {
    const next = !menuOpenRef.current;
    menuOpenRef.current = next;
    setMenuOpen(next);
  };

  const closeMenu = () => {
    menuOpenRef.current = false;
    setMenuOpen(false);
    setMenuPeek(false);
  };

  const navItems = [
    { href: "/", label: "Startseite" },
    { href: "/leistungen", label: "Leistungen" },
    { href: "/ueber-uns", label: "Über uns" },
    { href: "/kontakt", label: "Kontakt" },
  ] as const;

  const isActivePath = (href: string): boolean => {
    if (!pathname) return false;
    if (href === "/") return pathname === "/";
    return pathname === href || pathname.startsWith(`${href}/`);
  };

  useGSAP(
    () => {
      if (!smootherReady) return;

      const shell = shellRef.current;
      const logoLink = logoLinkRef.current;
      const menuButton = menuButtonRef.current;
      if (!shell || !logoLink || !menuButton) return;
      const smoother = ScrollSmoother.get();

      if (!smoother) {
        // Mobile/Touch ohne ScrollSmoother: native Scroll + rAF-throttled Morph/Visibility.
        shell.classList.add("nav-shell--ready");
        setNavReady(true);
        const y0 = currentScrollY();
        const bgThreshold0 = solidBackgroundScrollThreshold();
        const hideThreshold0 = navHideScrollThreshold();
        const storedVisible = sessionStorage.getItem(NAV_VISIBILITY_STORAGE_KEY);
        const startVisible = y0 < hideThreshold0 ? true : storedVisible !== "false";

        gsap.set(shell, { yPercent: startVisible ? 0 : -100, autoAlpha: 1 });
        visibleRef.current = startVisible;
        setSolidNavBg(y0 >= bgThreshold0);
        applyMorphLayout(logoLink, menuButton, gsap.utils.clamp(0, 1, y0 / logoScrollEndPx()));
        lastYRef.current = y0;

        const setVisible = (show: boolean) => {
          if (visibleRef.current === show) return;
          visibleRef.current = show;
          sessionStorage.setItem(NAV_VISIBILITY_STORAGE_KEY, show ? "true" : "false");
          gsap.to(shell, {
            yPercent: show ? 0 : -100,
            duration: show ? 0.4 : 0.25,
            ease: show ? NAV_SHOW_EASE : NAV_HIDE_EASE,
            overwrite: true,
          });
        };

        let rafId = 0;
        const onNativeScroll = () => {
          if (rafId) return;
          rafId = requestAnimationFrame(() => {
            if (!menuOpenRef.current && isViewportLockActive()) {
              rafId = 0;
              return;
            }

            const yCurrent = currentScrollY();
            const delta = yCurrent - lastYRef.current;

            if (menuOpenRef.current) {
              setVisible(true);
              gsap.set(menuButton, { y: menuButtonOpenFixedYPx() });
              lastYRef.current = yCurrent;
              rafId = 0;
              return;
            }

            const bgThreshold = solidBackgroundScrollThreshold();
            const hideThreshold = navHideScrollThreshold();
            const hasSolidBg = yCurrent >= bgThreshold;
            setSolidNavBg((prev) => (prev === hasSolidBg ? prev : hasSolidBg));

            applyMorphLayout(
              logoLink,
              menuButton,
              gsap.utils.clamp(0, 1, yCurrent / logoScrollEndPx())
            );

            if (yCurrent < hideThreshold) {
              setVisible(true);
              lastYRef.current = yCurrent;
              rafId = 0;
              return;
            }

            if (isNearDocumentBottom(yCurrent)) {
              lastYRef.current = yCurrent;
              rafId = 0;
              return;
            }

            if (Math.abs(delta) >= DELTA_MIN) {
              setVisible(delta < 0);
              lastYRef.current = yCurrent;
            }

            rafId = 0;
          });
        };

        onNativeScroll();
        window.addEventListener("scroll", onNativeScroll, { passive: true });
        window.addEventListener("resize", onNativeScroll, { passive: true });

        return () => {
          if (rafId) cancelAnimationFrame(rafId);
          window.removeEventListener("scroll", onNativeScroll);
          window.removeEventListener("resize", onNativeScroll);
          shell.classList.remove("nav-shell--ready");
          setNavReady(false);
        };
      }

      const y0 = currentScrollY(smoother);
      const bgThreshold0 = solidBackgroundScrollThreshold();
      const hideThreshold0 = navHideScrollThreshold();
      const storedVisible = sessionStorage.getItem(NAV_VISIBILITY_STORAGE_KEY);
      const startVisible = y0 < hideThreshold0 ? true : storedVisible !== "false";
      const initialLogoProgress = gsap.utils.clamp(0, 1, y0 / logoScrollEndPx());

      gsap.set(shell, { yPercent: startVisible ? 0 : -100 });
      visibleRef.current = startVisible;
      setSolidNavBg(y0 >= bgThreshold0);
      applyMorphLayout(logoLink, menuButton, initialLogoProgress);

      /* Forced Reflow: Browser verarbeitet transforms vor visibility-Wechsel */
      void shell.offsetHeight;

      shell.classList.add("nav-shell--ready");
      setNavReady(true);

      /* ── Show/Hide Logik ──────────────────────────────────── */
      const setVisible = (show: boolean) => {
        if (visibleRef.current === show) return;
        visibleRef.current = show;
        sessionStorage.setItem(NAV_VISIBILITY_STORAGE_KEY, show ? "true" : "false");
        gsap.to(shell, {
          yPercent: show ? 0 : -100,
          duration: show ? NAV_SHOW_DURATION : NAV_HIDE_DURATION,
          ease: show ? NAV_SHOW_EASE : NAV_HIDE_EASE,
          overwrite: true,
        });
      };

      const onScroll = () => {
        if (!menuOpenRef.current && isViewportLockActive()) {
          return;
        }

        const yCurrent = currentScrollY(smoother);
        const delta = yCurrent - lastYRef.current;

        if (menuOpenRef.current) {
          setVisible(true);
          lastYRef.current = yCurrent;
          return;
        }

        const bgThreshold = solidBackgroundScrollThreshold();
        const hideThreshold = navHideScrollThreshold();
        setSolidNavBg(yCurrent >= bgThreshold);

        if (yCurrent < hideThreshold) {
          setVisible(true);
          lastYRef.current = yCurrent;
          return;
        }

        if (Math.abs(delta) < DELTA_MIN) return;

        setVisible(delta < 0);
        lastYRef.current = yCurrent;
      };

      lastYRef.current = y0;

      /* ── ScrollTrigger: Show/Hide + Background ────────────
         ScrollTrigger statt window.scroll — ScrollSmoother-aware. */
      const navScrollTrigger = ScrollTrigger.create({
        start: 0,
        end: "max",
        onUpdate: onScroll,
      });

      /* ── ScrollTrigger: Logo-Morph ────────────────────────── */
      const logoScrollTrigger = ScrollTrigger.create({
        start: 0,
        end: () => logoScrollEndPx(),
        invalidateOnRefresh: true,
        onUpdate: (self) => {
          if (menuOpenRef.current) {
            gsap.set(menuButton, { y: menuButtonOpenFixedYPx() });
            return;
          }
          applyMorphLayout(logoLink, menuButton, self.progress);
        },
      });

      /* ── Resize-Handler ───────────────────────────────────── */
      const onResize = () => {
        const y = currentScrollY(smoother);
        setSolidNavBg(y >= solidBackgroundScrollThreshold());
        if (menuOpenRef.current) {
          gsap.set(menuButton, { y: menuButtonOpenFixedYPx() });
          const logoProgress = gsap.utils.clamp(0, 1, y / logoScrollEndPx());
          const p = gsap.utils.clamp(0, 1, logoProgress);
          const inv = 1 - p;
          const md = isDesktop();
          const logoHeightStart = md ? LOGO_START_HEIGHT_MD_PX : LOGO_START_HEIGHT_PX;
          const logoHeight = LOGO_H_END_PX + (logoHeightStart - LOGO_H_END_PX) * inv;
          const logoScale = logoHeight / LOGO_H_END_PX;
          const logoYStart = (md ? LOGO_START_TOP_MD_PX : LOGO_START_TOP_PX) - LOGO_TOP_END_PX;
          gsap.set(logoLink, {
            y: logoYStart * inv,
            scaleX: logoScale,
            scaleY: logoScale,
            transformOrigin: "left top",
          });
        } else {
          applyMorphLayout(logoLink, menuButton, gsap.utils.clamp(0, 1, y / logoScrollEndPx()));
        }
        ScrollTrigger.refresh();
      };
      window.addEventListener("resize", onResize, { passive: true });

      /* Initiale Auswertung */
      onScroll();

      return () => {
        shell.classList.remove("nav-shell--ready");
        setNavReady(false);
        navScrollTrigger.kill();
        logoScrollTrigger.kill();
        window.removeEventListener("resize", onResize);
      };
    },
    { scope: shellRef, dependencies: [smootherReady] }
  );

  /* ── Markup ─────────────────────────────────────────────── */

  return (
    <>
      <div
        ref={shellRef}
        className={`nav-shell pointer-events-none fixed inset-x-0 top-0 overflow-visible ${
          menuOpen ? "z-1100" : "z-100"
        } will-change-transform`}
      >
        {/* Navbar-Hintergrund — Transition erst nach navReady (verhindert Flash) */}
        <div
          className={`pointer-events-none absolute inset-x-0 top-0 h-[52px] transition-[background-color,backdrop-filter] ${
            navReady ? "duration-300" : "duration-0"
          } ${
            solidNavBg && !menuOpen
              ? "bg-[#7596AE]/88 backdrop-blur-md"
              : "bg-transparent"
          }`}
          aria-hidden
        />

        <div className="relative z-10 h-[52px] w-full px-6 md:px-12" />

        {/* Logo */}
        <Link
          ref={logoLinkRef}
          href="/"
          aria-label="Zur Startseite"
          className={`${menuOpen ? "pointer-events-none" : "pointer-events-auto"} absolute left-6 top-[8px] z-20 inline-flex h-[40px] items-center overflow-visible rounded transition-[filter] duration-300 focus:outline-none focus:ring-2 focus:ring-white/50 focus:ring-offset-2 md:left-12 ${
            menuOpen ? "blur-sm" : "blur-0"
          } ${
            solidNavBg || menuOpen
              ? "focus:ring-offset-[#7596AE]"
              : "focus:ring-offset-transparent"
          } w-max`}
        >
          <Image
            src={LOGO_WHITE_SRC}
            alt="ES Gebäudereinigung"
            priority
            fetchPriority="high"
            sizes="176px"
            className="block h-full w-auto max-w-[min(85vw,390px)] object-contain object-left"
            draggable={false}
          />
        </Link>

        {/* Hamburger / X */}
        <button
          ref={menuButtonRef}
          type="button"
          onClick={toggleMenu}
          onMouseEnter={() => {
            if (pathname === "/" && isDesktop() && !menuOpenRef.current) setMenuPeek(true);
          }}
          onMouseLeave={() => {
            if (!menuOpenRef.current) setMenuPeek(false);
          }}
          className={`pointer-events-auto absolute right-6 z-30 flex size-12 cursor-pointer items-center justify-center rounded transition-colors duration-200 ease-out hover:text-white focus:outline-none focus:ring-2 focus:ring-white/50 focus:ring-offset-2 md:right-12 ${
            solidNavBg || menuOpen
              ? "text-white/90 focus:ring-offset-[#7596AE]"
              : "text-white/90 focus:ring-offset-transparent"
          } top-[2px]`}
          aria-expanded={menuOpen}
          aria-controls="site-menu-panel"
          aria-label={menuOpen ? "Menü schließen" : "Menü öffnen"}
        >
          <span
            className="relative block size-8 shrink-0 md:size-9 [--hamburger-off:calc(2rem*3/24)] md:[--hamburger-off:calc(2.25rem*3/24)]"
            aria-hidden
          >
            <span
              className={`absolute inset-0 flex items-center justify-center origin-center transition-transform duration-420 ease-[cubic-bezier(0.22,1,0.36,1)] motion-reduce:transition-none ${
                menuOpen
                  ? "translate-y-0 rotate-45"
                  : "translate-y-[calc(-1*var(--hamburger-off))] rotate-0"
              }`}
            >
              <span className="h-[calc(2rem*2.25/24)] w-[calc(14/24*100%)] rounded-full bg-current md:h-[calc(2.25rem*2.25/24)]" />
            </span>
            <span
              className={`absolute inset-0 flex items-center justify-center origin-center transition-transform duration-420 ease-[cubic-bezier(0.22,1,0.36,1)] motion-reduce:transition-none ${
                menuOpen ? "translate-y-0 -rotate-45" : "translate-y-(--hamburger-off) rotate-0"
              }`}
            >
              <span className="h-[calc(2rem*2.25/24)] w-[calc(14/24*100%)] rounded-full bg-current md:h-[calc(2.25rem*2.25/24)]" />
            </span>
          </span>
        </button>
      </div>

      {/* Backdrop + Panel außerhalb der transformierten Shell */}
      <div
        className={`fixed inset-0 z-1000 h-svh ${
          menuOpen ? "pointer-events-auto" : "pointer-events-none"
        }`}
        aria-hidden={!menuOpen}
      >
        <button
          type="button"
          aria-label="Menü schließen"
          onClick={closeMenu}
          className={`absolute inset-0 bg-black/20 transition-opacity duration-680 ease-[cubic-bezier(0.16,1,0.3,1)] motion-reduce:transition-none ${
            menuOpen ? "opacity-100 backdrop-blur-sm" : "opacity-0 backdrop-blur-0"
          }`}
        />

        {/* role="dialog" auf <div>, weil <aside> nach "ARIA in HTML" keine
            dialog-Rolle zulaesst (Lighthouse/axe melden das sonst). */}
        <div
          id="site-menu-panel"
          role="dialog"
          aria-modal={menuOpen}
          className={`absolute right-0 top-0 h-svh min-h-svh max-h-svh w-full overflow-y-auto bg-[#7596AE] text-white transition-transform duration-680 ease-[cubic-bezier(0.16,1,0.3,1)] will-change-transform motion-reduce:transition-none motion-reduce:duration-0 md:w-[min(460px,36vw)] ${
            menuOpen
              ? "translate-x-0"
              : pathname === "/" && menuPeek
                ? "translate-x-[calc(100%-38px)]"
                : "translate-x-full"
          }`}
        >
          <div className="flex min-h-svh w-full flex-col px-10 pb-10 pt-0 md:px-14 md:pb-12">
            <div className="mt-[38px] flex h-12 items-center pr-20 text-left md:mt-[46px] md:h-12 md:pr-24">
              <p className="max-w-[14ch] text-xl leading-[1.05] font-extrabold tracking-tight md:text-2xl">
                ES-Gebäudeservice
              </p>
            </div>

            <nav className="mt-20 flex-1" aria-label="Hauptmenü">
              <ul className="w-full max-w-[420px] space-y-11 text-left text-2xl leading-tight font-normal md:space-y-12 md:text-3xl">
                {navItems.map((item) => {
                  const isActive = isActivePath(item.href);
                  return (
                    <li key={item.href}>
                      <Link
                        href={item.href}
                        scroll
                        onClick={() => {
                          // Viewport-Lock soll beim Menu-Close NICHT die
                          // alte Position auf der Quellseite wiederherstellen.
                          closingForNavigationRef.current = true;
                          closeMenu();
                          // Smoother-Scroll-Reset passiert ohnehin ueber den
                          // useLayoutEffect im SmoothScrollShell bei pathname-
                          // Change – zusaetzlich hier kein Bedarf.
                        }}
                        aria-current={isActive ? "page" : undefined}
                        className={`group flex w-full items-center justify-between gap-3 ${
                          isActive ? "font-bold" : "font-normal"
                        }`}
                      >
                        <span>{item.label}</span>
                        {!isActive && (
                          <span
                            aria-hidden
                            className="inline-flex w-10 shrink-0 justify-end translate-x-[-8px] opacity-0 transition-all duration-200 group-hover:translate-x-0 group-hover:opacity-100"
                          >
                            <svg viewBox="0 0 24 24" className="h-8 w-8" fill="none">
                              <path d="M5 12h13" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
                              <path d="M13 7l5 5-5 5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
                            </svg>
                          </span>
                        )}
                      </Link>
                    </li>
                  );
                })}
              </ul>
            </nav>

            <div className="mt-10 flex items-end justify-between gap-6">
              <div className="flex flex-col gap-3">
                <a
                  href={`tel:${CONTACT_PHONE_TEL}`}
                  className="inline-flex items-center gap-2 text-lg leading-tight font-semibold text-white transition-opacity hover:opacity-80"
                >
                  <svg viewBox="0 0 24 24" aria-hidden className="h-5 w-5 shrink-0" fill="none">
                    <rect x="7.2" y="2.6" width="9.6" height="18.8" rx="2.3" stroke="currentColor" strokeWidth="1.7" />
                    <circle cx="12" cy="17.7" r="0.9" fill="currentColor" />
                    <path d="M10.3 5.6h3.4" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" />
                  </svg>
                  <span>{CONTACT_PHONE_DISPLAY}</span>
                </a>

                <a
                  href={`mailto:${CONTACT_EMAIL}`}
                  className="inline-flex items-center gap-2 text-lg leading-tight font-semibold text-white transition-opacity hover:opacity-80"
                >
                  <svg viewBox="0 0 24 24" aria-hidden className="h-5 w-5 shrink-0" fill="none">
                    <rect x="3.2" y="5.5" width="17.6" height="13" rx="2.2" stroke="currentColor" strokeWidth="1.7" />
                    <path d="M4.5 7l7.5 6 7.5-6" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                  <span>{CONTACT_EMAIL}</span>
                </a>
              </div>

              <a
                href={INSTAGRAM_URL}
                target="_blank"
                rel="noreferrer"
                aria-label="Instagram"
                className="inline-flex size-10 items-center justify-center rounded-full text-white/95 transition-opacity hover:opacity-80"
              >
                <svg
                  viewBox="0 0 24 24"
                  aria-hidden
                  className="size-8"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <rect x="3.25" y="3.25" width="17.5" height="17.5" rx="5.25" stroke="currentColor" strokeWidth="1.8" />
                  <circle cx="12" cy="12" r="4.1" stroke="currentColor" strokeWidth="1.8" />
                  <circle cx="17.35" cy="6.65" r="1.2" fill="currentColor" />
                </svg>
              </a>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}