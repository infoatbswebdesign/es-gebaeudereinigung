const BENEFITS = [
  {
    id: 1,
    title: "Festes Team statt Subunternehmer",
    description:
      "Dauerhaft dasselbe festangestellte Reinigungsteam für Ihr Objekt in Esslingen und Stuttgart.",
    iconBg: "bg-slate-800",
    iconPath: "M17 20h5v-2a4 4 0 00-3-3.87M9 20H4v-2a4 4 0 013-3.87m6-5.13a4 4 0 11-8 0 4 4 0 018 0zm6 0a4 4 0 11-8 0 4 4 0 018 0z",
  },
  {
    id: 2,
    title: "Persönlicher Ansprechpartner",
    description:
      "Direkter Draht zum festen Objektleiter. Kurze Wege, schnelle Antworten, verbindliche Zusagen.",
    iconBg: "bg-indigo-700",
    iconPath: "M3 10h2l3.5 11H20l-1.5-6H7M16 6a4 4 0 10-8 0 4 4 0 008 0z",
  },
  {
    id: 3,
    title: "Schnell vor Ort in der Region",
    description:
      "Bei Sonderreinigung, Glasbruch oder Wasserschaden sind wir in Esslingen und Stuttgart oft am selben Tag da.",
    iconBg: "bg-sky-700",
    iconPath: "M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z",
  },
  {
    id: 4,
    title: "Geprüft und versichert",
    description:
      "Festangestellte, geschulte Reinigungskräfte mit Betriebshaftpflicht und DSGVO konformen Abläufen.",
    iconBg: "bg-emerald-700",
    iconPath: "M12 3l8 4v5c0 5-3.5 8.5-8 9-4.5-.5-8-4-8-9V7l8-4z M9 12l2 2 4-4",
  },
];

const BENEFITS_JSON_LD = {
  "@context": "https://schema.org",
  "@type": "ItemList",
  name: "Ihre Vorteile mit ES Gebäudeservice aus Esslingen",
  description:
    "Diese Leistungen machen ES Gebäudeservice zum bevorzugten Partner für Gebäudereinigung in Esslingen, Stuttgart und der Region Neckar.",
  itemListElement: BENEFITS.map((benefit, index) => ({
    "@type": "ListItem",
    position: index + 1,
    name: benefit.title,
    description: benefit.description,
  })),
};

export default function BenefitsSection() {
  return (
    <section
      className="bg-[#F1F0EC] pt-20 pb-16 pl-6 pr-6 md:pt-28 md:pb-24 md:px-12"
      aria-labelledby="benefits-heading"
    >
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(BENEFITS_JSON_LD) }}
      />
      <div className="mx-auto max-w-7xl">
        <h2
          id="benefits-heading"
          className="mx-auto max-w-3xl text-center text-2xl font-bold leading-tight text-slate-900 md:text-3xl lg:text-4xl"
        >
          Ihre Vorteile mit der Gebäudereinigung ES Gebäudeservice in Esslingen und Stuttgart
        </h2>

        {/* Cards: Desktop 4 Spalten, Mobile horizontal Snap-Scroll – wie CardsSection */}
        <div className="snap-carousel mt-12 mb-10 flex gap-4 overflow-x-auto pb-4 pt-2 snap-x snap-mandatory -mx-6 px-6 [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:h-0 [&::-webkit-scrollbar]:w-0 md:mx-0 md:px-0 md:mt-16 md:mb-14 md:grid md:grid-cols-4 md:gap-5 md:overflow-visible md:pb-0 md:snap-none">
          {BENEFITS.map((benefit) => (
            <article
              key={benefit.id}
              className="flex w-[260px] shrink-0 snap-center flex-col rounded-xl bg-white p-4 shadow-md shadow-slate-200/50 md:w-full md:rounded-2xl md:p-5"
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
