"use client";

import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";

gsap.registerPlugin(useGSAP);

/** Muss zur Section in `HeroV2.tsx` passen (Ref-Ziel / Events) */
const HERO_SECTION_ID = "hero-v2";

/** ScrollSmoother-Wrapper (s. `SmoothScrollShell.tsx`) */
const SMOOTH_WRAPPER_ID = "smooth-wrapper";

/** Follower nur mit „echter“ Maus – entspricht u. a. ScrollSmoother-Desktop-Logik */
const MQ_FOLLOWER =
  "(min-width: 768px) and (hover: hover) and (pointer: fine)";

const GAP_RIGHT = 22;
const NUDGE_DOWN = 5;

function pointerInHero(hero: HTMLElement, x: number, y: number): boolean {
  const r = hero.getBoundingClientRect();
  return x >= r.left && x <= r.right && y >= r.top && y <= r.bottom;
}

export default function HeroV2ScrollExploreHint() {
  const heroRef = useRef<HTMLElement | null>(null);
  const wrapRef = useRef<HTMLDivElement>(null);
  const moveRef = useRef<HTMLDivElement>(null);
  const lastPointerRef = useRef({ x: -1, y: -1 });
  const [mounted, setMounted] = useState(false);
  const [useFollower, setUseFollower] = useState(false);
  const [reducedMotion, setReducedMotion] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia(MQ_FOLLOWER);
    const id = requestAnimationFrame(() => {
      setUseFollower(mq.matches);
      setMounted(true);
    });
    const onChange = () => setUseFollower(mq.matches);
    mq.addEventListener("change", onChange);
    return () => {
      cancelAnimationFrame(id);
      mq.removeEventListener("change", onChange);
    };
  }, []);

  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    const apply = () => setReducedMotion(mq.matches);
    apply();
    mq.addEventListener("change", apply);
    return () => mq.removeEventListener("change", apply);
  }, []);

  useGSAP(
    () => {
      if (!mounted || !useFollower) return;

      const wrap = wrapRef.current;
      const move = moveRef.current;
      const hero = document.getElementById(HERO_SECTION_ID);
      heroRef.current = hero;
      if (!wrap || !move || !hero) return;

      gsap.set(wrap, { opacity: 0 });

      const xTo = gsap.quickTo(move, "x", { duration: 0.38, ease: "power3.out" });
      const yTo = gsap.quickTo(move, "y", { duration: 0.38, ease: "power3.out" });

      let enteredHero = false;

      const hideFollower = () => {
        gsap.to(wrap, {
          opacity: 0,
          duration: 0.18,
          ease: "power2.out",
          overwrite: "auto",
        });
      };

      const syncFromPointer = (immediate: boolean) => {
        const { x, y } = lastPointerRef.current;
        if (x < 0 || y < 0) return;

        if (!enteredHero) {
          hideFollower();
          return;
        }

        if (!pointerInHero(hero, x, y)) {
          enteredHero = false;
          hideFollower();
          return;
        }

        if (reducedMotion) {
          gsap.to(wrap, {
            opacity: 1,
            duration: 0.18,
            ease: "power2.out",
            overwrite: "auto",
          });
          return;
        }

        gsap.to(wrap, {
          opacity: 1,
          duration: 0.22,
          ease: "power2.out",
          overwrite: "auto",
        });

        const h = move.offsetHeight || 1;
        const w = move.offsetWidth || 1;
        const pad = 6;
        const yCentered = y - h / 2 + NUDGE_DOWN;
        const yClamped = gsap.utils.clamp(
          pad,
          window.innerHeight - h - pad,
          yCentered,
        );
        const xRightOfCursor = x + GAP_RIGHT;
        const xClamped = gsap.utils.clamp(
          pad,
          window.innerWidth - w - pad,
          xRightOfCursor,
        );

        if (immediate) {
          gsap.set(move, { x: xClamped, y: yClamped });
          xTo.tween.invalidate();
          yTo.tween.invalidate();
        } else {
          xTo(xClamped);
          yTo(yClamped);
        }
      };

      const onHeroEnter = (e: MouseEvent) => {
        enteredHero = true;
        lastPointerRef.current = { x: e.clientX, y: e.clientY };
        syncFromPointer(true);
      };

      const onHeroLeave = () => {
        enteredHero = false;
        hideFollower();
      };

      const onPointerMove = (e: PointerEvent) => {
        lastPointerRef.current = { x: e.clientX, y: e.clientY };
        syncFromPointer(false);
      };

      const onScrollOrResize = () => {
        syncFromPointer(true);
      };

      hero.addEventListener("mouseenter", onHeroEnter);
      hero.addEventListener("mouseleave", onHeroLeave);
      window.addEventListener("pointermove", onPointerMove, { passive: true });
      window.addEventListener("scroll", onScrollOrResize, {
        passive: true,
        capture: true,
      });
      window.addEventListener("resize", onScrollOrResize, { passive: true });

      const smoothWrapper = document.getElementById(SMOOTH_WRAPPER_ID);
      smoothWrapper?.addEventListener("scroll", onScrollOrResize, {
        passive: true,
      });

      return () => {
        hero.removeEventListener("mouseenter", onHeroEnter);
        hero.removeEventListener("mouseleave", onHeroLeave);
        window.removeEventListener("pointermove", onPointerMove);
        window.removeEventListener("scroll", onScrollOrResize, true);
        window.removeEventListener("resize", onScrollOrResize);
        smoothWrapper?.removeEventListener("scroll", onScrollOrResize);
        heroRef.current = null;
      };
    },
    { dependencies: [reducedMotion, mounted, useFollower], revertOnUpdate: true },
  );

  const inner = (
    <div
      key={reducedMotion ? "rm" : "full"}
      ref={wrapRef}
      className={
        reducedMotion
          ? "hero-v2-scroll-explore hero-v2-scroll-explore--follower pointer-events-none fixed bottom-8 left-1/2 z-40 -translate-x-1/2 md:bottom-10"
          : "hero-v2-scroll-explore hero-v2-scroll-explore--follower pointer-events-none fixed left-0 top-0 z-40"
      }
      aria-hidden
    >
      <div
        ref={moveRef}
        className={reducedMotion ? "" : "will-change-transform"}
      >
        <span className="hero-v2-scroll-explore__text block whitespace-nowrap text-[0.65rem] font-semibold tracking-[0.28em] uppercase">
          Scroll to explore
        </span>
      </div>
    </div>
  );

  if (!mounted || !useFollower) return null;

  return createPortal(inner, document.body);
}
