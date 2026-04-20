import Image from "next/image";
import {
  arztPraxisKunde,
  geschaeftsfuehrerBauKunde,
  geschaeftsfuehrerKosmetikKunde,
} from "@/app/assets/images";

const AVATAR_SRC = [
  arztPraxisKunde,
  geschaeftsfuehrerKosmetikKunde,
  geschaeftsfuehrerBauKunde,
] as const;

const AVATAR_Z = ["z-[1]", "z-[2]", "z-[3]"] as const;

function StarIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="currentColor"
      aria-hidden
    >
      <path d="M12 2.5l2.8 6.4 6.9.6-5.2 4.5 1.6 6.8L12 17.9 5.9 20.8l1.6-6.8-5.2-4.5 6.9-.6L12 2.5z" />
    </svg>
  );
}

/**
 * Unten im Hero, volle Breite: links Einzugsgebiet, rechts Bewertungs-Optik (statisch, kein Google-Abruf).
 * Mobil: kompakte weiße Karte wie Desktop — zwei Avatare, Sterne, 4,8, „500+ Bewertungen“.
 */
export default function HeroV2TrustRow() {
  return (
    <div className="flex w-full min-w-0 flex-nowrap items-end justify-between gap-x-3 sm:gap-x-6 md:gap-x-10">
      {/* Links: Einzugsgebiet */}
      <div className="flex min-w-0 shrink items-start gap-1.5 text-left text-white sm:max-w-54 md:max-w-xs md:gap-3">
        <span className="mt-0.5 shrink-0 text-white/90" aria-hidden>
          <svg
            viewBox="0 0 24 24"
            className="h-5 w-5 md:h-6 md:w-6"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.75"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M12 21s-6-4.35-6-10a6 6 0 1 1 12 0c0 5.65-6 10-6 10Z" />
            <circle cx="12" cy="11" r="2.25" fill="currentColor" stroke="none" />
          </svg>
        </span>
        <div className="min-w-0">
          <p className="text-[0.65rem] font-semibold uppercase tracking-wide text-white/70 md:text-xs">
            Einzugsgebiet
          </p>
          <p className="mt-0.5 text-xs font-semibold leading-snug text-white sm:text-sm md:text-base md:leading-snug lg:text-lg">
            Esslingen +30&nbsp;km Umkreis
          </p>
          <p className="mt-1 hidden text-sm text-white/80 md:block">
            Reinigung dort, wo Sie uns brauchen.
          </p>
        </div>
      </div>

      {/* Rechts: Bewertungen — mobil: weiße Karte, kompakt */}
      <div className="shrink-0">
        <div
          className="inline-flex min-w-0 items-center gap-2 rounded-xl bg-white/95 px-2 py-2 text-left shadow-md shadow-black/10 ring-1 ring-black/5 backdrop-blur-sm sm:hidden"
          aria-label="Bewertungsvorschau (statisch, kein Google-Abruf)"
        >
          <div className="flex shrink-0 -space-x-2" aria-hidden>
            {AVATAR_SRC.slice(0, 2).map((src, i) => (
              <span
                key={src.src}
                className={`relative inline-block h-8 w-8 overflow-hidden rounded-full ring-2 ring-white ${AVATAR_Z[i]}`}
              >
                <Image
                  src={src}
                  alt=""
                  width={32}
                  height={32}
                  className="h-full w-full object-cover"
                  sizes="32px"
                />
              </span>
            ))}
          </div>
          <div className="flex min-w-0 flex-col gap-px">
            <div className="flex flex-wrap items-center gap-1">
              <div className="flex shrink-0 items-center gap-px text-[#E67E5D]">
                {Array.from({ length: 5 }).map((_, idx) => (
                  <StarIcon key={idx} className="h-3 w-3" />
                ))}
              </div>
              <span className="text-sm font-bold leading-none text-neutral-900 tabular-nums">
                4,9
              </span>
            </div>
            <p className="text-[0.625rem] leading-tight text-[#717171]">
              100+{" "}
              <span className="font-medium text-neutral-900 underline decoration-neutral-900/40 underline-offset-2">
                Bewertungen
              </span>
            </p>
          </div>
        </div>

        <div
          className="hidden min-w-0 items-center gap-2 rounded-xl bg-white/95 px-2 py-2 text-left shadow-md shadow-black/10 ring-1 ring-black/5 backdrop-blur-sm sm:inline-flex sm:gap-3 sm:rounded-2xl sm:px-3.5 sm:py-2.5 md:gap-3 md:px-4 md:py-3 md:shadow-lg md:shadow-black/15"
          aria-label="Bewertungsvorschau (statisch, kein Google-Abruf)"
        >
          <div className="flex shrink-0 -space-x-2 md:-space-x-2.5" aria-hidden>
            {AVATAR_SRC.map((src, i) => (
              <span
                key={src.src}
                className={`relative inline-block h-9 w-9 overflow-hidden rounded-full ring-2 ring-white md:h-10 md:w-10 ${AVATAR_Z[i]}`}
              >
                <Image
                  src={src}
                  alt=""
                  width={40}
                  height={40}
                  className="h-full w-full object-cover"
                  sizes="40px"
                />
              </span>
            ))}
          </div>

          <div className="flex min-w-0 flex-col gap-0.5">
            <div className="flex flex-wrap items-center gap-1.5">
              <div
                className="flex shrink-0 items-center gap-0.5 text-[#E67E5D]"
                aria-hidden
              >
                {Array.from({ length: 5 }).map((_, idx) => (
                  <StarIcon
                    key={idx}
                    className="h-3.5 w-3.5 md:h-4.5 md:w-4.5"
                  />
                ))}
              </div>
              <span className="text-base font-bold leading-none text-neutral-900 tabular-nums md:text-lg">
                4,9
              </span>
            </div>
            <p className="text-xs leading-tight text-[#717171] md:text-[0.8125rem]">
              aus 100+{" "}
              <span className="font-medium text-neutral-900 underline decoration-neutral-900/40 underline-offset-2">
                Bewertungen
              </span>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
