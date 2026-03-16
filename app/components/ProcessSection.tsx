"use client";

import Image from "next/image";
import Link from "next/link";
import { useRef, useState, useEffect } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";

gsap.registerPlugin(useGSAP);

const SECTION_BG = "#ffffff";

const PROCESS_IMAGES = [
  "/putzfrau-vereinbart-termin-es-gebeaudeservice.jpg",
  "/putzfrau-liest-angebot-durch-es-gebaeudeservice.jpg",
  "/putzfrau-hat-job-erledigt-es-gebaeudeservice.jpg",
] as const;

const STEPS = [
  {
    id: 1,
    number: "01",
    title: "Termin vereinbaren",
    description:
      "Sie kontaktieren uns – wir besprechen Ihre Wünsche und vereinbaren einen unverbindlichen Besichtigungstermin vor Ort.",
    readMoreHref: "/kontakt",
  },
  {
    id: 2,
    number: "02",
    title: "Individuelles Angebot",
    description:
      "Nach der Begehung erstellen wir Ihnen ein maßgeschneidertes, transparentes Angebot – ganz ohne versteckte Kosten.",
    readMoreHref: "/leistungen",
  },
  {
    id: 3,
    number: "03",
    title: "Reinigung erledigt!",
    description:
      "Unser Team kommt pünktlich zum Einsatz und sorgt für gründliche Sauberkeit – zuverlässig, effizient und diskret.",
    readMoreHref: "/leistungen",
  },
] as const;

export default function ProcessSection() {
  const [activeIndex, setActiveIndex] = useState(0);
  const circleRefs = useRef<(HTMLDivElement | null)[]>([]);
  const mobileCardRefs = useRef<(HTMLElement | null)[]>([]);
  const scrollRef = useRef<HTMLDivElement>(null);
  const sectionRef = useRef<HTMLElement>(null);
  const isDesktop = useRef(true);

  const { contextSafe } = useGSAP({ scope: sectionRef });

  const greyOutNonActive = contextSafe((active: number) => {
    circleRefs.current.forEach((el, i) => {
      if (!el) return;
      const isActive = i === active;
      gsap.to(el, {
        opacity: isActive ? 1 : 0.45,
        filter: isActive ? "grayscale(0)" : "grayscale(1)",
        duration: 0.35,
        ease: "power2.out",
      });
    });
  });

  const greyOutMobileCards = contextSafe((active: number) => {
    mobileCardRefs.current.forEach((el, i) => {
      if (!el) return;
      const isActive = i === active;
      gsap.to(el, {
        opacity: isActive ? 1 : 0.45,
        filter: isActive ? "grayscale(0)" : "grayscale(1)",
        duration: 0.35,
        ease: "power2.out",
      });
    });
  });

  const setAllActive = contextSafe(() => {
    circleRefs.current.forEach((el) => {
      if (!el) return;
      gsap.to(el, {
        opacity: 1,
        filter: "grayscale(0)",
        duration: 0.3,
        ease: "power2.out",
      });
    });
    mobileCardRefs.current.forEach((el) => {
      if (!el) return;
      gsap.to(el, { opacity: 1, filter: "grayscale(0)", duration: 0.3, ease: "power2.out" });
    });
  });

  useEffect(() => {
    const mq = window.matchMedia("(min-width: 768px)");
    isDesktop.current = mq.matches;
    const handler = () => {
      isDesktop.current = mq.matches;
      if (mq.matches) setAllActive();
    };
    mq.addEventListener("change", handler);
    return () => mq.removeEventListener("change", handler);
  }, [setAllActive]);

  const mobileRatiosRef = useRef<number[]>([0, 0, 0]);

  useEffect(() => {
    if (!scrollRef.current || isDesktop.current) return;
    const container = scrollRef.current;
    const cards = container.querySelectorAll("[data-process-card]");
    if (!cards.length) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (isDesktop.current) return;
        entries.forEach((entry) => {
          const index = Number(entry.target.getAttribute("data-step-index"));
          if (Number.isNaN(index)) return;
          mobileRatiosRef.current[index] = entry.intersectionRatio;
        });
        const ratios = mobileRatiosRef.current;
        const maxIndex = ratios.reduce((best, r, i) => (r > ratios[best] ? i : best), 0);
        setActiveIndex(maxIndex);
        greyOutMobileCards(maxIndex);
      },
      { root: scrollRef.current, rootMargin: "0px", threshold: [0, 0.25, 0.5, 0.75, 1] }
    );

    cards.forEach((card) => observer.observe(card));
    const t = setTimeout(() => greyOutMobileCards(0), 100);
    return () => {
      clearTimeout(t);
      observer.disconnect();
    };
  }, [greyOutMobileCards]);

  const handleMouseEnter = (index: number) => {
    if (!isDesktop.current) return;
    setActiveIndex(index);
    greyOutNonActive(index);
  };

  const handleMouseLeave = () => {
    if (!isDesktop.current) return;
    setAllActive();
  };

  return (
    <section
      ref={sectionRef}
      className="relative py-16 px-6 md:py-24 md:px-12"
      style={{ background: SECTION_BG }}
      aria-labelledby="process-heading"
    >
      <div className="mx-auto max-w-6xl">
        {/* Desktop: Titel links, Intro rechts – Space-between wie ÜberUnsSection */}
        <div className="hidden flex-col gap-10 md:flex md:flex-row md:items-center md:justify-between md:gap-12">
          <h2
            id="process-heading"
            className="max-w-2xl text-2xl font-bold leading-snug tracking-tight text-slate-900 md:text-3xl lg:text-4xl"
          >
            Unser Vorgehen
          </h2>
          <p className="max-w-md text-base leading-relaxed text-slate-600 md:text-lg">
            In drei klaren Schritten zum Reinigungsauftrag: von der ersten
            Kontaktaufnahme bis zur zuverlässigen Ausführung – transparent und
            unkompliziert.
          </p>
        </div>

        {/* Desktop: Mitte – Treppenstufen (Zickzack) mittig, mit Bild pro Schritt */}
        <div className="relative mt-12 hidden md:mt-16 md:flex md:justify-center md:gap-8 lg:gap-12">
          {STEPS.map((step, index) => (
            <div
              key={step.id}
              className="flex flex-col items-center"
              style={{
                marginTop: index === 0 ? 0 : index === 1 ? "3.5rem" : "7rem",
              }}
            >
              <div
                ref={(el) => {
                  circleRefs.current[index] = el;
                }}
                className="flex flex-col items-center cursor-pointer transition-transform hover:scale-[1.02]"
                onMouseEnter={() => handleMouseEnter(index)}
                onMouseLeave={handleMouseLeave}
                role="button"
                tabIndex={0}
                onKeyDown={(e) => {
                  if (e.key === "Enter" || e.key === " ") {
                    e.preventDefault();
                    setActiveIndex(index);
                    greyOutNonActive(index);
                  }
                }}
                aria-label={`Schritt ${step.number}: ${step.title}`}
              >
                {/* Nummer im Kreis */}
                <span
                  className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full text-base font-semibold transition-colors lg:h-16 lg:w-16 lg:text-lg"
                  style={{
                    backgroundColor:
                      activeIndex === index ? "#334155" : "transparent",
                    color: activeIndex === index ? "#fff" : "#94a3b8",
                    border:
                      activeIndex === index
                        ? "2px solid #fff"
                        : "2px solid #cbd5e1",
                  }}
                >
                  {step.number}
                </span>
                {/* Bild darunter – next/image mit width/height (Platz reserviert, kein Layout-Shift) */}
                <div
                  className="relative mt-4 overflow-hidden rounded-lg border-2 border-dashed border-slate-300 bg-slate-100"
                  style={{ width: 160, height: 128 }}
                >
                  <Image
                    src={PROCESS_IMAGES[index]}
                    alt=""
                    width={160}
                    height={128}
                    sizes="160px"
                    className="object-cover"
                    style={{ width: "100%", height: "100%", objectFit: "cover", transition: "none" }}
                  />
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Desktop: Beschreibung unten links, feste Position – Schrift wie ÜberUns */}
        <div className="mt-10 hidden md:mt-12 md:block md:max-w-xl">
          <h3 className="text-2xl font-bold leading-snug text-slate-900 md:text-3xl">
            {STEPS[activeIndex].title}
          </h3>
          <p className="mt-3 text-base leading-relaxed text-slate-600 md:text-lg">
            {STEPS[activeIndex].description}
          </p>
          <Link
            href={STEPS[activeIndex].readMoreHref}
            className="mt-4 inline-block text-base text-slate-600 underline decoration-slate-400 underline-offset-2 hover:text-slate-900 hover:decoration-slate-600 md:text-lg"
          >
            Mehr erfahren
          </Link>
        </div>

        {/* Mobil: Titel + Intro + horizontale Snap-Scroll-Cards – Schrift wie ÜberUns */}
        <div className="mt-10 md:mt-0 md:hidden">
          <h2 className="text-2xl font-bold leading-snug tracking-tight text-slate-900">
            Unser Vorgehen
          </h2>
          <p className="mt-3 text-base leading-relaxed text-slate-600">
            In drei klaren Schritten zum Reinigungsauftrag: von der ersten
            Kontaktaufnahme bis zur zuverlässigen Ausführung – transparent und
            unkompliziert.
          </p>
          <div
            ref={scrollRef}
            className="mt-4 flex gap-6 overflow-x-auto pb-4 pt-2 snap-x snap-mandatory -mx-6 px-6 md:mx-0 md:px-0"
          >
            {STEPS.map((step, index) => (
              <article
                key={step.id}
                ref={(el) => {
                  mobileCardRefs.current[index] = el;
                }}
                data-process-card
                data-step-index={index}
                className="flex w-[280px] shrink-0 snap-center flex-col p-5"
              >
                {/* Prozessschritt-Nummer oben links */}
                <div className="flex justify-start">
                  <span className="flex h-10 w-10 items-center justify-center rounded-full border-2 border-slate-300 bg-transparent text-sm font-semibold text-slate-600">
                    {step.number}
                  </span>
                </div>
                {/* Bild vom Prozess – next/image mit width/height (Platz reserviert, kein Layout-Shift) */}
                <div
                  className="relative my-4 mx-auto overflow-hidden rounded-xl bg-slate-100"
                  style={{ width: 200, height: 150 }}
                >
                  <Image
                    src={PROCESS_IMAGES[index]}
                    alt=""
                    width={200}
                    height={150}
                    sizes="200px"
                    className="object-cover"
                    style={{ width: "100%", height: "100%", objectFit: "cover", transition: "none" }}
                  />
                </div>
                {/* Beschreibung darunter – Schriftgrößen wie ÜberUns */}
                <h3 className="text-xl font-bold leading-snug text-slate-900 md:text-2xl">
                  {step.title}
                </h3>
                <p className="mt-2 text-base leading-relaxed text-slate-600">
                  {step.description}
                </p>
                <Link
                  href={step.readMoreHref}
                  className="mt-3 inline-block text-base text-slate-600 underline decoration-slate-400 underline-offset-2 hover:text-slate-900"
                >
                  Mehr erfahren
                </Link>
              </article>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}