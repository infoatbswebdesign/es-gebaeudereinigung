export default function UeberUnsSection() {
  return (
    <section
      id="ueber-uns"
      className="bg-white py-12 px-6 md:py-16 md:px-12"
      aria-labelledby="ueber-uns-heading"
    >
      <div className="flex flex-col gap-10 md:flex-row md:items-center md:justify-between md:gap-12">
        <h2 id="ueber-uns-heading" className="sr-only">
          Gebäudereinigung in Esslingen, Stuttgart und Umgebung
        </h2>
        {/* Linke Spalte: SEO-starker Leitsatz mit Keyword, Stadt und Spezialisierung */}
        <p className="max-w-5xl text-2xl font-bold leading-snug text-slate-900 md:text-3xl lg:text-4xl">
          <span className="text-[#7596AE]">Gebäudereinigung in Esslingen,
          Stuttgart und Umgebung,</span> spezialisiert auf Büros, Praxen
          und Gewerbeobjekte.
        </p>
        {/* Rechte Spalte: kurzer Absatz */}
        <div className="max-w-md">
          <p className="text-base leading-relaxed text-slate-700 md:text-lg">
            Vom Standort in{" "}
            <span className="font-medium text-sky-700">
              Esslingen am Neckar
            </span>{" "}
            betreuen wir Ihr Objekt von der Unterhaltsreinigung bis zum
            Winterdienst, mit festen Teams und persönlichem Ansprechpartner.
          </p>
        </div>
      </div>
    </section>
  );
}
