export default function UeberUnsSection() {
  return (
    <section
      id="ueber-uns"
      className="bg-white py-12 px-6 md:py-16 md:px-12"
      aria-labelledby="ueber-uns-heading"
    >
      <div className="flex flex-col gap-10 md:flex-row md:items-center md:justify-between md:gap-12">
        <h2 id="ueber-uns-heading" className="sr-only">
          Über uns
        </h2>
        {/* Linke Spalte: Willkommen + Werte, großer fetter Absatz */}
        <p className="max-w-5xl text-2xl font-bold leading-snug text-slate-900 md:text-3xl lg:text-4xl">
          Herzlich willkommen bei{" "}
          <span className="text-[#7596AE]">ES-Gebäudeservice</span>. Als
          zuverlässiger Partner für professionelle Gebäudereinigung stehen wir für
          Qualität, Sorgfalt und Kundenzufriedenheit.
        </p>
        {/* Rechte Spalte: Region + Leistungsversprechen */}
        <div className="flex max-w-md flex-col gap-6">
          <p className="text-base leading-relaxed text-slate-700 md:text-lg">
            Im{" "}
            <span className="font-medium text-sky-700">
              Großraum Stuttgart, Esslingen und Umgebung
            </span>{" "}
            bieten wir unseren Auftraggebern zuverlässige und professionelle
            Reinigungslösungen – flexibel, gründlich und termingerecht. Wir freuen
            uns darauf, Sie zu unterstützen.
          </p>
        </div>
      </div>
    </section>
  );
}
