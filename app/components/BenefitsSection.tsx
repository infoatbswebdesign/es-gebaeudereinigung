const BENEFITS = [
  {
    id: 1,
    title: "Zuverlässigkeit",
    description:
      "Pünktlich, termingerecht und mit konstanter Qualität – Sie können sich auf uns verlassen.",
    iconBg: "bg-slate-800",
    iconPath: "M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z",
  },
  {
    id: 2,
    title: "Transparenz",
    description:
      "Klare Angebote ohne versteckte Kosten. Sie wissen von Anfang an, was Sie erwartet.",
    iconBg: "bg-indigo-700",
    iconPath: "M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z",
  },
  {
    id: 3,
    title: "Flexibilität",
    description:
      "Reinigung nach Ihrem Rhythmus – ob täglich, wöchentlich oder nach Bedarf.",
    iconBg: "bg-sky-700",
    iconPath: "M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z",
  },
  {
    id: 4,
    title: "Erfahrung",
    description:
      "Langjährige Praxis in gewerblicher Reinigung – für Büros, Praxen und Objekte.",
    iconBg: "bg-emerald-700",
    iconPath: "M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4",
  },
];

export default function BenefitsSection() {
  return (
    <section
      className="bg-[#F1F0EC] pt-20 pb-16 pl-6 pr-6 md:pt-28 md:pb-24 md:px-12"
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
        <div className="snap-carousel mt-12 mb-10 flex gap-4 overflow-x-auto pb-4 pt-2 snap-x snap-mandatory -mx-6 px-6 [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:h-0 [&::-webkit-scrollbar]:w-0 md:mx-0 md:px-0 md:mt-16 md:mb-14 md:grid md:grid-cols-4 md:gap-5 md:overflow-visible md:pb-0 md:snap-none">
          {BENEFITS.map((benefit) => (
            <article
              key={benefit.id}
              className="flex w-[240px] shrink-0 snap-center flex-col rounded-xl bg-white p-4 shadow-md shadow-slate-200/50 md:w-full md:rounded-2xl md:p-5"
            >
              <div
                className={`mb-3 flex h-8 w-8 items-center justify-center rounded-lg text-white md:mb-3.5 md:h-9 md:w-9 md:rounded-xl ${benefit.iconBg}`}
              >
                <svg className="size-4 md:size-[18px]" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden>
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={benefit.iconPath} />
                </svg>
              </div>
              <h3 className="text-base font-bold text-slate-900 md:text-lg">{benefit.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-slate-600 md:mt-2.5">
                {benefit.description}
              </p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
