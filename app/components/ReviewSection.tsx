"use client";

import Image from "next/image";
import { useRef, useState } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { DrawSVGPlugin } from "gsap/DrawSVGPlugin";

const AUTOPLAY_MS = 4000;

const TESTIMONIALS = [
  {
    id: 0,
    name: "Maria Schmidt",
    title: "Büroleitung, Stuttgart",
    text: "Seit Jahren setzen wir auf ES-Gebäudeservice. Pünktlich, gründlich und unkompliziert – genau das, was wir für unsere Büros brauchen.",
    avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=128&h=128&fit=crop&crop=face",
  },
  {
    id: 1,
    name: "Thomas Weber",
    title: "Facility Manager, Esslingen",
    text: "Transparente Angebote und zuverlässige Ausführung. Die Reinigung passt sich unseren Öffnungszeiten an – keine Störung im Betrieb.",
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=128&h=128&fit=crop&crop=face",
  },
  {
    id: 2,
    name: "Lisa Hoffmann",
    title: "Praxismanagement, Ludwigsburg",
    text: "Hygiene und Diskretion sind uns wichtig. ES-Gebäudeservice erfüllt beides und arbeitet termingerecht. Sehr empfehlenswert.",
    avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=128&h=128&fit=crop&crop=face",
  },
];

/* Abgerundetes Rechteck als Path (x,y = 2, size = 76, r = 12) – pathLength=1 für stabile Animation */
const RECT_PATH =
  "M 14 2 L 66 2 Q 78 2 78 14 L 78 66 Q 78 78 66 78 L 14 78 Q 2 78 2 66 L 2 14 Q 2 2 14 2 Z";

gsap.registerPlugin(useGSAP, DrawSVGPlugin);

function AvatarLoadFrame({
  pathRef,
}: {
  pathRef: (node: SVGPathElement | null) => void;
}) {
  return (
    <svg
      className="pointer-events-none absolute inset-0 h-full w-full"
      width={80}
      height={80}
      viewBox="0 0 80 80"
      aria-hidden
    >
      <path
        d={RECT_PATH}
        fill="none"
        stroke="rgba(30,58,95,0.25)"
        strokeWidth={4}
      />
      <path
        ref={pathRef}
        d={RECT_PATH}
        fill="none"
        stroke="#1e3a5f"
        strokeWidth={4}
        strokeLinecap="round"
        strokeLinejoin="round"
        className="review-avatar-progress"
      />
    </svg>
  );
}

export default function ReviewSection() {
  const sectionRef = useRef<HTMLElement | null>(null);
  const loadFrameRefs = useRef<(SVGPathElement | null)[]>([]);
  const [activeIndex, setActiveIndex] = useState(0);
  const [cycleKey, setCycleKey] = useState(0);
  const testimonial = TESTIMONIALS[activeIndex];

  const { contextSafe } = useGSAP({ scope: sectionRef });

  const handleReviewerSelect = contextSafe((index: number) => {
    setActiveIndex(index);
    // Erzwingt Neustart des aktiven Progress-Rings, auch bei Klick auf denselben Avatar.
    setCycleKey((key) => key + 1);
  });

  useGSAP(
    () => {
      const advanceToNext = contextSafe(() => {
        setActiveIndex((i) => (i + 1) % TESTIMONIALS.length);
      });

      loadFrameRefs.current.forEach((path, index) => {
        if (!path) return;
        const length = path.getTotalLength();

        gsap.set(path, {
          drawSVG: "0% 0%",
          strokeDasharray: length,
          strokeDashoffset: length,
          opacity: index === activeIndex ? 1 : 0,
        });
      });

      const activePath = loadFrameRefs.current[activeIndex];
      if (!activePath) return;

      const timeline = gsap.timeline({
        defaults: { ease: "none" },
        onComplete: advanceToNext,
      });

      timeline.to(activePath, {
        drawSVG: "0% 100%",
        strokeDashoffset: 0,
        duration: AUTOPLAY_MS / 1000,
      });

      return () => timeline.kill();
    },
    { scope: sectionRef, dependencies: [activeIndex, cycleKey], revertOnUpdate: true }
  );

  return (
    <section
      ref={sectionRef}
      className="bg-white pt-20 pb-16 pl-6 pr-6 md:pt-24 md:pb-44 md:px-12"
      aria-labelledby="review-heading"
    >
      <div className="mx-auto max-w-6xl">
        <h2
          id="review-heading"
          className="text-center text-2xl font-bold leading-tight text-slate-900 md:text-3xl lg:text-4xl"
        >
          Was unsere Kunden sagen
        </h2>

        <div className="mt-12 flex flex-col gap-10 md:mt-16 md:flex-row md:items-center md:justify-start md:gap-8">
          {/* Desktop: Avatars links neben der Review-Box; Mobil: zentriert */}
          <div
            className="flex flex-row items-center justify-center gap-6 md:justify-start md:gap-8 md:shrink-0"
            role="tablist"
            aria-label="Rezensenten"
          >
            {TESTIMONIALS.map((t, index) => (
              <button
                key={t.id}
                type="button"
                role="tab"
                aria-selected={index === activeIndex}
                aria-label={`Feedback von ${t.name} anzeigen`}
                onClick={() => handleReviewerSelect(index)}
                className="relative h-20 w-20 shrink-0 rounded-2xl outline-none focus-visible:ring-2 focus-visible:ring-slate-800 focus-visible:ring-offset-2 focus-visible:ring-offset-white"
              >
                {/* Bild zentriert, Rahmen außen herum */}
                <span className="absolute inset-0 flex items-center justify-center">
                  <span className="relative h-[72px] w-[72px] overflow-hidden rounded-lg">
                    <Image
                      src={t.avatar}
                      alt=""
                      width={72}
                      height={72}
                      className="h-full w-full object-cover"
                    />
                  </span>
                </span>
                <AvatarLoadFrame
                  pathRef={(node) => {
                    loadFrameRefs.current[index] = node;
                  }}
                />
              </button>
            ))}
          </div>

          {/* Testimonial-Card: Desktop breiter (flex-1), feste Höhe mobil gegen Layout-Shift */}
          <div
            role="tabpanel"
            id={`review-panel-${activeIndex}`}
            aria-live="polite"
            aria-label={`Aktuelles Feedback von ${testimonial.name}`}
            className="h-[280px] min-h-[280px] w-full flex-1 rounded-2xl bg-[#F1F0EC] px-6 py-6 md:h-auto md:min-h-0 md:min-w-0 md:px-8 md:py-8"
          >
            <div className="flex h-full flex-col">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className="text-lg font-bold text-slate-900">{testimonial.name}</p>
                  <p className="mt-0.5 text-sm text-slate-600">{testimonial.title}</p>
                </div>
                <div className="flex items-center gap-1 text-slate-700" aria-hidden>
                  <span className="text-2xl">😇</span>
                  <span className="text-3xl font-serif leading-none">„</span>
                </div>
              </div>
              <p className="mt-4 flex-1 text-slate-900 leading-relaxed">{testimonial.text}</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
