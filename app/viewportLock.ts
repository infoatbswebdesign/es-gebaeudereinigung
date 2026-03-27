"use client";

import ScrollSmoother from "gsap/ScrollSmoother";
import { ScrollTrigger } from "gsap/ScrollTrigger";

const LOCK_COUNT_KEY = "viewportLockCount";
const SMOOTHER_LOCK_KEY = "viewportLockSmoother";
const LOCK_MODE_KEY = "viewportLockMode";

function getDocEl(): HTMLElement {
  return document.documentElement;
}

export function acquireViewportLock(): void {
  if (typeof window === "undefined") return;

  const docEl = getDocEl();
  const body = document.body;
  const count = Number(docEl.dataset[LOCK_COUNT_KEY] ?? "0");
  const smoother = ScrollSmoother.get();
  const lockY = Math.round(smoother ? smoother.scrollTop() : window.scrollY);
  const lockMode = smoother ? "smoother" : "native";

  if (count === 0) {
    docEl.style.setProperty("--viewport-lock-restore-y", `${lockY}`);
    docEl.style.setProperty("--viewport-lock-scroll-y", `${lockY}px`);
    docEl.classList.add("viewport-lock");
    body.classList.add("viewport-lock");
    docEl.dataset[LOCK_MODE_KEY] = lockMode;
    if (lockMode === "smoother") {
      body.classList.add("viewport-lock-smoother");
    }
  }

  if (smoother && docEl.dataset[SMOOTHER_LOCK_KEY] !== "true") {
    smoother.paused(true);
    docEl.dataset[SMOOTHER_LOCK_KEY] = "true";
  }

  docEl.dataset[LOCK_COUNT_KEY] = String(count + 1);
}

export function releaseViewportLock(): void {
  if (typeof window === "undefined") return;

  const docEl = getDocEl();
  const body = document.body;
  const count = Number(docEl.dataset[LOCK_COUNT_KEY] ?? "0");
  const next = Math.max(0, count - 1);

  if (next > 0) {
    docEl.dataset[LOCK_COUNT_KEY] = String(next);
    return;
  }

  const restoreY = Number.parseFloat(docEl.style.getPropertyValue("--viewport-lock-restore-y") || "0");
  const smootherWasLocked = docEl.dataset[SMOOTHER_LOCK_KEY] === "true";
  const lockMode = docEl.dataset[LOCK_MODE_KEY] ?? "native";

  delete docEl.dataset[LOCK_COUNT_KEY];
  delete docEl.dataset[SMOOTHER_LOCK_KEY];
  delete docEl.dataset[LOCK_MODE_KEY];
  docEl.classList.remove("viewport-lock");
  body.classList.remove("viewport-lock");
  body.classList.remove("viewport-lock-smoother");
  docEl.style.removeProperty("--viewport-lock-scroll-y");
  docEl.style.removeProperty("--viewport-lock-restore-y");

  const smoother = ScrollSmoother.get();
  if (smootherWasLocked && smoother) {
    smoother.paused(false);
    if (lockMode === "native") {
      smoother.scrollTo(restoreY, false);
      ScrollTrigger.update();
    }
    return;
  }

  if (lockMode === "native") {
    const previousScrollBehavior = docEl.style.scrollBehavior;
    docEl.style.scrollBehavior = "auto";
    window.scrollTo(0, restoreY);
    requestAnimationFrame(() => {
      docEl.style.scrollBehavior = previousScrollBehavior;
    });
  }
}
