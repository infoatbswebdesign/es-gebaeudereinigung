"use client";

import Image from "next/image";
import { useEffect, useState } from "react";

const SECTION_BG = "#ffffff";
const REVIEW_BOX_BG = "#F1F0EC";
const AUTOPLAY_MS = 3000;

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

function AvatarLoadFrame({ active }: { active: boolean }) {
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
        stroke="rgba(0,0,0,0.15)"
        strokeWidth={3}
      />
      {active && (
        <path
          d={RECT_PATH}
          fill="none"
          stroke="#1e3a5f"
          strokeWidth={3}
          strokeLinecap="round"
          strokeLinejoin="round"
          pathLength={1}
          strokeDasharray={1}
          strokeDashoffset={1}
          style={{
            animation: `review-rect-fill ${AUTOPLAY_MS}ms linear forwards`,
          }}
        />
      )}
    </svg>
  );
}

export default function ReviewSection() {
  const [activeIndex, setActiveIndex] = useState(0);
  const testimonial = TESTIMONIALS[activeIndex];

  useEffect(() => {
    const t = setInterval(() => {
      setActiveIndex((i) => (i + 1) % TESTIMONIALS.length);
    }, AUTOPLAY_MS);
    return () => clearInterval(t);
  }, []);

  return (
    <section
      className="pt-20 pb-16 pl-6 pr-6 md:pt-24 md:pb-44 md:px-12"
      style={{ backgroundColor: SECTION_BG }}
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
                onClick={() => setActiveIndex(index)}
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
                <AvatarLoadFrame active={index === activeIndex} />
              </button>
            ))}
          </div>

          {/* Testimonial-Card: Desktop breiter (flex-1), feste Höhe mobil gegen Layout-Shift */}
          <div
            role="tabpanel"
            id={`review-panel-${activeIndex}`}
            aria-live="polite"
            aria-label={`Aktuelles Feedback von ${testimonial.name}`}
            className="h-[280px] min-h-[280px] w-full flex-1 rounded-2xl px-6 py-6 shadow-xl md:h-auto md:min-h-0 md:min-w-0 md:px-8 md:py-8"
            style={{ backgroundColor: REVIEW_BOX_BG }}
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
