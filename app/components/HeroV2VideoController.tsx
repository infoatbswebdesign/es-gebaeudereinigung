"use client";

import { useEffect } from "react";

type Props = {
  sectionId: string;
  videoId: string;
  readyClassName: string;
  reducedMotionClassName: string;
};

/**
 * Steuert das Hero-Video so, dass es zuverlaessig abspielt, ohne die LCP zu
 * blockieren. Das Poster-Bild wird per Next/Image mit `priority` + hoher
 * fetchpriority geladen und bleibt das LCP-Element. Das Video selbst laeuft
 * mit `preload="none"` und wird erst im naechsten idle-Slot (oder nach einem
 * kurzen Fallback-Timer) aktiv geladen. Sobald der Browser `canplay` meldet
 * oder `readyState >= 2` direkt erreicht (HTTP-Cache-Treffer / BFCache-
 * Restore), startet Play und das Fade-in wird ausgeloest – es gibt KEINE
 * kuenstliche Wartezeit. Der Poster ist damit genau so lange sichtbar, wie
 * das Video tatsaechlich zum Buffern braucht: bei gecachten Besuchen nur
 * Millisekunden, beim Erstbesuch entsprechend laenger.
 *
 * Die frueheren Probleme "Video spielt nach Reload oder Navigation nicht ab"
 * kamen daher, dass `autoPlay` + `canplay`-Event-Listener-Race-Conditions
 * hatten: wenn der Listener erst nach dem Event angehaengt wurde, blieb das
 * Video stumm stehen. Diese Implementierung prueft `readyState` jedesmal
 * direkt, retryed bei Bedarf, und beruecksichtigt bfcache (pageshow) sowie
 * Tab-Sichtbarkeit.
 */
export default function HeroV2VideoController({
  sectionId,
  videoId,
  readyClassName,
  reducedMotionClassName,
}: Props) {
  useEffect(() => {
    const section = document.getElementById(sectionId);
    const video = document.getElementById(videoId) as HTMLVideoElement | null;
    if (!section || !video) return;

    const reducedMotionQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    const isReducedMotion = () => reducedMotionQuery.matches;

    let cancelled = false;
    let loadRequested = false;

    const markReady = () => {
      if (cancelled) return;
      video.classList.add(readyClassName);
    };

    const ensureLoaded = () => {
      if (loadRequested) return;
      loadRequested = true;
      try {
        // Mit `preload="none"` startet der Browser keinen eigenen Fetch.
        // `.load()` waehlt aus den <source>-Kindern das passende Format und
        // beginnt mit dem Herunterladen. Bei einem HTTP-Cache-Treffer kommt
        // die Antwort in Millisekunden und `canplay` feuert sofort.
        video.load();
      } catch {
        // ignorieren: load() kann nach detach werfen.
      }
    };

    const attemptPlay = () => {
      if (cancelled || isReducedMotion()) return;
      // Wiederholte play()-Aufrufe auf laufendem Video sind no-ops.
      if (!video.paused && !video.ended && video.readyState >= 2) {
        markReady();
        return;
      }
      ensureLoaded();
      const playPromise = video.play();
      if (playPromise && typeof playPromise.then === "function") {
        playPromise.then(markReady).catch(() => {
          // Browser hat play() abgelehnt (z. B. weil noch kein Frame geladen
          // ist). Der naechste `canplay`-Listener startet es erneut.
        });
      } else {
        markReady();
      }
    };

    // Browser hat ggf. bereits ausreichend Daten, bevor wir die Listener
    // registrieren konnten (typisch nach BFCache-Restore oder schnellem Cache-
    // Hit). Direkt pruefen und Play sofort anstossen.
    const syncFromReadyState = () => {
      if (cancelled) return;
      // HAVE_CURRENT_DATA = 2
      if (video.readyState >= 2) {
        markReady();
        attemptPlay();
      }
    };

    const syncMotionMode = () => {
      if (isReducedMotion()) {
        section.classList.add(reducedMotionClassName);
        try {
          video.pause();
        } catch {}
        return;
      }
      section.classList.remove(reducedMotionClassName);
      ensureLoaded();
      attemptPlay();
    };

    // Event-Listener fuer alle Lade-/Play-Signale: jedes Signal triggert
    // markReady + (falls moeglich) play. Damit sind wir robust gegen jede
    // Reihenfolge in der der Browser diese Events feuert.
    const onLoadable = () => {
      syncFromReadyState();
    };
    const onPlaying = () => {
      markReady();
    };

    video.addEventListener("loadedmetadata", onLoadable);
    video.addEventListener("loadeddata", onLoadable);
    video.addEventListener("canplay", onLoadable);
    video.addEventListener("canplaythrough", onLoadable);
    video.addEventListener("playing", onPlaying);
    video.addEventListener("play", onPlaying);

    // Tab-Sichtbarkeit wechselt (Tab im Hintergrund -> Vordergrund): Browser
    // pausieren das Video manchmal; wir starten es wieder.
    const onVisibilityChange = () => {
      if (document.visibilityState === "visible") {
        syncFromReadyState();
        attemptPlay();
      }
    };
    document.addEventListener("visibilitychange", onVisibilityChange);

    // BFCache-Restore (Browser-Back/Forward): `pageshow` mit persisted=true.
    // Safari/Firefox stellen das Video dabei pausiert her.
    const onPageShow = (event: PageTransitionEvent) => {
      if (event.persisted) {
        syncFromReadyState();
        attemptPlay();
      }
    };
    window.addEventListener("pageshow", onPageShow);

    // Wenn das Video unerwartet pausiert (iOS low-power mode o.ae.), einmal
    // versuchen neu zu starten, sofern der User Motion nicht ausgeschaltet hat.
    const onPause = () => {
      if (!isReducedMotion() && document.visibilityState === "visible") {
        attemptPlay();
      }
    };
    video.addEventListener("pause", onPause);

    const onReducedMotionChange = () => {
      syncMotionMode();
    };
    reducedMotionQuery.addEventListener("change", onReducedMotionChange);

    // IntersectionObserver: wenn Hero nicht mehr sichtbar, Ressourcen schonen;
    // bei Rueckkehr wieder starten.
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting && entry.intersectionRatio > 0) {
            if (!isReducedMotion()) {
              ensureLoaded();
              attemptPlay();
            }
          }
        }
      },
      { threshold: [0, 0.05, 0.2] },
    );
    observer.observe(section);

    // Initialer Kick-off: im naechsten Idle-Slot Source setzen + Play
    // anstossen. So konkurriert der Video-Fetch nicht mit dem Poster-Image
    // um die erste Bandbreiten-Phase, und der Controller startet das Video
    // sobald der Browser Kapazitaet hat. Bei einem HTTP-Cache-Treffer ist
    // `canplay` im naechsten Tick da und das Fade laeuft praktisch sofort.
    type RIC = (cb: IdleRequestCallback, opts?: IdleRequestOptions) => number;
    const ric =
      typeof window !== "undefined" &&
      typeof (window as unknown as { requestIdleCallback?: RIC }).requestIdleCallback ===
        "function"
        ? ((window as unknown as { requestIdleCallback: RIC }).requestIdleCallback)
        : null;
    let idleHandle: number | null = null;
    let fallbackTimer: number | null = null;

    const kickOff = () => {
      if (cancelled) return;
      syncMotionMode();
      // Falls der Browser vor dem Mount schon Daten hatte (BFCache / Cache).
      syncFromReadyState();
    };

    if (ric) {
      idleHandle = ric(kickOff, { timeout: 400 });
    } else {
      fallbackTimer = window.setTimeout(kickOff, 100);
    }

    return () => {
      cancelled = true;
      if (idleHandle != null && typeof window !== "undefined") {
        const ci = (window as unknown as {
          cancelIdleCallback?: (handle: number) => void;
        }).cancelIdleCallback;
        if (typeof ci === "function") ci(idleHandle);
      }
      if (fallbackTimer != null) {
        clearTimeout(fallbackTimer);
      }
      observer.disconnect();
      video.removeEventListener("loadedmetadata", onLoadable);
      video.removeEventListener("loadeddata", onLoadable);
      video.removeEventListener("canplay", onLoadable);
      video.removeEventListener("canplaythrough", onLoadable);
      video.removeEventListener("playing", onPlaying);
      video.removeEventListener("play", onPlaying);
      video.removeEventListener("pause", onPause);
      document.removeEventListener("visibilitychange", onVisibilityChange);
      window.removeEventListener("pageshow", onPageShow);
      reducedMotionQuery.removeEventListener("change", onReducedMotionChange);
    };
  }, [readyClassName, reducedMotionClassName, sectionId, videoId]);

  return null;
}
