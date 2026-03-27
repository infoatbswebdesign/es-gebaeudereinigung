"use client";

import { useEffect } from "react";

type Props = {
  sectionId: string;
  videoId: string;
  readyClassName: string;
  reducedMotionClassName: string;
};

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

    const markReady = () => {
      video.classList.add(readyClassName);
    };

    const attemptPlay = () => {
      const playPromise = video.play();
      if (playPromise && typeof playPromise.then === "function") {
        playPromise.then(markReady).catch(() => {});
      }
    };

    const syncMotionMode = () => {
      if (isReducedMotion()) {
        section.classList.add(reducedMotionClassName);
        video.pause();
        return;
      }

      section.classList.remove(reducedMotionClassName);
      attemptPlay();
    };

    const onVisibilityChange = () => {
      if (document.visibilityState === "visible" && !isReducedMotion()) {
        attemptPlay();
      }
    };

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting && entry.intersectionRatio > 0 && !isReducedMotion()) {
            attemptPlay();
          }
        }
      },
      { threshold: [0, 0.05, 0.2] },
    );
    observer.observe(section);

    const onReducedMotionChange = () => {
      syncMotionMode();
    };

    video.addEventListener("loadeddata", markReady);
    video.addEventListener("canplay", markReady);
    video.addEventListener("play", markReady);
    document.addEventListener("visibilitychange", onVisibilityChange);
    reducedMotionQuery.addEventListener("change", onReducedMotionChange);

    syncMotionMode();

    return () => {
      observer.disconnect();
      video.removeEventListener("loadeddata", markReady);
      video.removeEventListener("canplay", markReady);
      video.removeEventListener("play", markReady);
      document.removeEventListener("visibilitychange", onVisibilityChange);
      reducedMotionQuery.removeEventListener("change", onReducedMotionChange);
    };
  }, [readyClassName, reducedMotionClassName, sectionId, videoId]);

  return null;
}
