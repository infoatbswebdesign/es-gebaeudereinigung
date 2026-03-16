import Link from "next/link";

const SECTION_BG = "#F1F0EC";

const BENEFITS = [
  {
    id: 1,
    title: "Zuverlässigkeit",
    description:
      "Pünktlich, termingerecht und mit konstanter Qualität – Sie können sich auf uns verlassen.",
    href: "/leistungen",
    iconBg: "bg-slate-800",
    iconPath: "M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z",
  },
  {
    id: 2,
    title: "Transparenz",
    description:
      "Klare Angebote ohne versteckte Kosten. Sie wissen von Anfang an, was Sie erwartet.",
    href: "/leistungen",
    iconBg: "bg-indigo-700",
    iconPath: "M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z",
  },
  {
    id: 3,
    title: "Flexibilität",
    description:
      "Reinigung nach Ihrem Rhythmus – ob täglich, wöchentlich oder nach Bedarf.",
    href: "/leistungen",
    iconBg: "bg-sky-700",
    iconPath: "M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z",
  },
  {
    id: 4,
    title: "Erfahrung",
    description:
      "Langjährige Praxis in gewerblicher Reinigung – für Büros, Praxen und Objekte.",
    href: "/leistungen",
    iconBg: "bg-emerald-700",
    iconPath: "M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4",
  },
];

export default function BenefitsSection() {
  return (
    <section
      className="pt-20 pb-16 pl-6 pr-6 md:pt-28 md:pb-24 md:px-12"
      style={{ backgroundColor: SECTION_BG }}
      aria-labelledby="benefits-heading"
    >
      <div className="mx-auto max-w-7xl">
        <h2
          id="benefits-heading"
          className="mx-auto max-w-2xl text-center text-2xl font-bold leading-tight text-slate-900 md:text-3xl lg:text-4xl"
        >
          Ihre Vorteile
        </h2>

        {/* Cards: Desktop 4 Spalten, Mobile horizontal Snap-Scroll – wie CardsSection */}
        <div className="mt-12 mb-10 flex gap-6 overflow-x-auto pb-4 pt-2 snap-x snap-mandatory -mx-6 px-6 md:mx-0 md:px-0 md:mt-16 md:mb-14 md:grid md:grid-cols-4 md:overflow-visible md:pb-0 md:snap-none">
          {BENEFITS.map((benefit) => (
            <article
              key={benefit.id}
              className="flex min-h-[420px] w-[280px] shrink-0 snap-center flex-col rounded-2xl bg-white p-6 shadow-lg shadow-slate-200/60 md:min-h-[480px] md:w-full"
            >
              <div
                className={`mb-4 flex h-10 w-10 items-center justify-center rounded-xl text-white ${benefit.iconBg}`}
              >
                <svg className="size-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden>
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={benefit.iconPath} />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-slate-900">{benefit.title}</h3>
              <p className="mt-3 flex-1 text-sm leading-relaxed text-slate-600">
                {benefit.description}
              </p>
              <Link
                href={benefit.href}
                className="mt-4 font-medium text-slate-900 underline decoration-slate-300 underline-offset-2 hover:decoration-slate-900"
              >
                Mehr erfahren
                <span aria-hidden> →</span>
              </Link>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
