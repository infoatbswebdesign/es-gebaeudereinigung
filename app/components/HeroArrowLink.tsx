"use client";

import Link from "next/link";
import { useRef } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";

gsap.registerPlugin(useGSAP);

export default function HeroArrowLink() {
  const containerRef = useRef<HTMLAnchorElement>(null);
  const arrowRef = useRef<HTMLSpanElement>(null);

  useGSAP({ scope: containerRef });

  const handleMouseEnter = () => {
    if (!arrowRef.current) return;
    if (!window.matchMedia("(hover: hover)").matches) return;

    gsap.killTweensOf(arrowRef.current);
    const tl = gsap.timeline();
    tl.to(arrowRef.current, {
      x: 18,
      duration: 0.45,
      ease: "sine.inOut",
    }).to(arrowRef.current, {
      x: 0,
      duration: 0.5,
      ease: "sine.inOut",
    });
  };

  const handleMouseLeave = () => {
    if (!arrowRef.current) return;
    gsap.killTweensOf(arrowRef.current);
    gsap.to(arrowRef.current, { x: 0, duration: 0.35, ease: "sine.inOut" });
  };

  return (
    <Link
      ref={containerRef}
      href="/leistungen"
      className="mt-2 inline-flex items-center text-white focus:outline-none focus:ring-2 focus:ring-white/50 focus:ring-offset-2 focus:ring-offset-[#7596AE] md:rounded md:px-2 md:py-1 md:-mx-2 md:-my-1"
      aria-label="Mehr erfahren"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <span
        ref={arrowRef}
        className="icon inline-flex items-center will-change-transform"
        aria-hidden
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 92 61"
          className="icon-svg ml-1 h-[1em] w-auto"
          fill="currentColor"
          aria-hidden
        >
          <path
            fillRule="evenodd"
            clipRule="evenodd"
            d="M74.325 24.076C67.135 18.666 60.134 9.854 58.827 0h8.648c.075.448.188.943.33 1.468.279 1.03.691 2.244 1.232 3.57a45.979 45.979 0 0 0 4.818 8.826C77.908 19.654 83.981 25.276 92 26.182v8.748c-8.26.95-14.318 6.544-18.297 12.317a43.894 43.894 0 0 0-4.657 8.767c-.76 1.946-1.266 3.7-1.47 4.986l-8.75-.018c1.306-9.853 8.308-18.644 15.499-24.056l2.64-1.987H0v-8.876h76.965l-2.64-1.987Z"
          />
        </svg>
      </span>
    </Link>
  );
}
