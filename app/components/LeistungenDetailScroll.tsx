"use client";

import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Image from "next/image";
import { useMemo, useRef, useState } from "react";

type LeistungItem = {
  id: string;
  title: string;
  intro: string;
  points: readonly string[];
  iconBg: string;
  iconPath: string;
  imageSrc: string;
  imageAlt: string;
};

type LeistungenDetailScrollProps = {
  items: readonly LeistungItem[];
};

export default function LeistungenDetailScroll({
  items,
}: LeistungenDetailScrollProps) {
  gsap.registerPlugin(ScrollTrigger);

  const firstItemId = items[0]?.id ?? "";
  const [activeId, setActiveId] = useState(firstItemId);
  const sectionRef = useRef<HTMLDivElement | null>(null);
  const rightViewportRef = useRef<HTMLDivElement | null>(null);
  const rightTrackRef = useRef<HTMLDivElement | null>(null);
  const panelRefs = useRef<(HTMLElement | null)[]>([]);
  const imageRefs = useRef<(HTMLDivElement | null)[]>([]);

  const activeItem = useMemo(
    () => items.find((item) => item.id === activeId) ?? items[0],
    [activeId, items],
  );

  const setActiveItemByIndex = (index: number) => {
    const nextItem = items[index];
    if (!nextItem) return;

    setActiveId(nextItem.id);
    imageRefs.current.forEach((image, imageIndex) => {
      if (!image) return;
      gsap.to(image, {
        opacity: imageIndex === index ? 1 : 0,
        duration: 0.4,
        ease: "power2.out",
        overwrite: "auto",
      });
    });
  };

  useGSAP(
    () => {
      if (!items.length) return;

      const section = sectionRef.current;
      const rightViewport = rightViewportRef.current;
      const rightTrack = rightTrackRef.current;

      if (!section || !rightViewport || !rightTrack) return;

      gsap.set(imageRefs.current, { opacity: 0 });
      if (imageRefs.current[0]) {
        gsap.set(imageRefs.current[0], { opacity: 1 });
      }

      const mm = gsap.matchMedia();

      const createPinnedAnimation = (scrubValue: number) => {
        setActiveItemByIndex(0);
        gsap.set(rightTrack, { y: 0 });

        const pinnedSection = section.closest("section") as HTMLElement | null;
        const triggerTarget = pinnedSection ?? section;

        const maxScrollDistance = Math.max(
          0,
          rightTrack.scrollHeight - rightViewport.clientHeight,
        );

        if (maxScrollDistance <= 0) return;

        const rightTrackTween = gsap.to(rightTrack, {
          y: -maxScrollDistance,
          ease: "none",
        });

        ScrollTrigger.create({
          trigger: triggerTarget,
          start: "top top",
          end: `+=${maxScrollDistance}`,
          scrub: scrubValue,
          pin: triggerTarget,
          invalidateOnRefresh: true,
          anticipatePin: 1,
          animation: rightTrackTween,
          onUpdate: (self) => {
            const maxIndex = items.length - 1;
            if (maxIndex < 1) return;

            const nextIndex = Math.min(
              maxIndex,
              Math.max(0, Math.round(self.progress * maxIndex)),
            );
            setActiveItemByIndex(nextIndex);
          },
        });
      };

      mm.add("(min-width: 1024px) and (hover: hover) and (pointer: fine)", () => {
        createPinnedAnimation(0.5);
      });

      return () => {
        mm.revert();
      };
    },
    { dependencies: [items, firstItemId], scope: sectionRef },
  );

  if (!items.length) return null;

  return (
    <div
      ref={sectionRef}
      className="grid gap-5 lg:h-[calc(100vh-14rem)] lg:grid-cols-12 lg:items-center lg:gap-10"
    >
      <div className="hidden lg:col-span-5 lg:block">
        <div className="relative h-[42svh] overflow-hidden rounded-3xl bg-slate-900 shadow-xl shadow-slate-300/40 sm:h-[44svh] lg:h-[calc(100vh-16rem)]">
          {items.map((item, index) => (
            <div
              key={item.id}
              ref={(element) => {
                imageRefs.current[index] = element;
              }}
              className="absolute inset-0 opacity-0"
            >
              <Image
                src={item.imageSrc}
                alt={item.imageAlt}
                fill
                sizes="(max-width: 1024px) 100vw, 40vw"
                className="object-cover"
                priority={item.id === firstItemId}
              />
              <div className="absolute inset-0 bg-linear-to-t from-slate-900/75 via-slate-900/20 to-transparent" />
            </div>
          ))}

          {activeItem ? (
            <div className="absolute inset-x-0 bottom-0 p-6 text-white">
              <div
                className={`inline-flex h-11 w-11 items-center justify-center rounded-xl text-white ${activeItem.iconBg}`}
              >
                <svg
                  className="size-6"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  aria-hidden
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d={activeItem.iconPath}
                  />
                </svg>
              </div>
              <p className="mt-4 text-2xl font-bold leading-tight">
                {activeItem.title}
              </p>
            </div>
          ) : null}
        </div>
      </div>

      <div className="min-w-0 lg:col-span-7">
        <div className="snap-carousel -mx-6 mt-2 mb-2 flex gap-6 overflow-x-auto px-6 pt-2 pb-4 snap-x snap-mandatory overscroll-x-contain [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:h-0 [&::-webkit-scrollbar]:w-0 lg:hidden">
          {items.map((item) => (
            <article
              key={`${item.id}-mobile`}
              id={`${item.id}-mobile`}
              className="w-[280px] shrink-0 snap-center"
            >
              <div className="relative h-[240px] overflow-hidden rounded-2xl bg-slate-900">
                <Image
                  src={item.imageSrc}
                  alt={item.imageAlt}
                  fill
                  sizes="280px"
                  className="object-cover"
                />
              </div>

              <div className="mt-5 min-w-0">
                <h3 className="text-2xl font-bold leading-tight text-slate-900">
                  {item.title}
                </h3>
                <p className="mt-3 text-lg leading-relaxed text-slate-700">
                  {item.intro}
                </p>
                <ul className="mt-4 list-disc space-y-2 pl-5 text-base leading-relaxed text-slate-700">
                  {item.points.map((point) => (
                    <li key={`${item.id}-${point}`}>{point}</li>
                  ))}
                </ul>
              </div>
            </article>
          ))}
        </div>

        <div
          ref={rightViewportRef}
          className="hidden h-auto overflow-visible lg:block lg:h-[calc(100vh-16rem)] lg:overflow-hidden"
        >
          <div ref={rightTrackRef} className="flex flex-col gap-6 md:gap-8">
          {items.map((item, index) => {
            return (
              <article
                key={item.id}
                id={item.id}
                data-leistung-id={item.id}
                data-leistung-index={index}
                ref={(element) => {
                  panelRefs.current[index] = element;
                }}
                className="scroll-mt-28 min-h-0 p-1 md:p-2 lg:min-h-[calc(100vh-16rem)]"
              >
                <div className="min-w-0 flex-1">
                  <p className="text-lg leading-relaxed text-slate-700 md:text-xl">
                    {item.intro}
                  </p>
                  <ul className="mt-5 list-disc space-y-2 pl-5 text-base leading-relaxed text-slate-700 md:text-lg">
                    {item.points.map((point) => (
                      <li key={point}>{point}</li>
                    ))}
                  </ul>
                </div>
              </article>
            );
          })}
          </div>
        </div>
      </div>
    </div>
  );
}
