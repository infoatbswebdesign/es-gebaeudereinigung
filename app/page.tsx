import Link from "next/link";
import BenefitsSection from "./components/BenefitsSection";
import CardsSection from "./components/CardsSection";
import ContactFormSection from "./components/ContactFormSection";
import Hero from "./components/Hero";
import ProcessSection from "./components/ProcessSection";
import ReviewSection from "./components/ReviewSection";
import UeberUnsSection from "./components/UeberUnsSection";

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "LocalBusiness",
  name: "ES Gebäudereinigung",
  description:
    "Professionelle Gebäudereinigung für Büros, Praxen und Gewerbe. Zuverlässig, gründlich, fair.",
  url: "https://es-gebaeudereinigung.example.com",
};

export default function Home() {
  return (
    <main>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <Hero />
      <UeberUnsSection />
      <CardsSection />
      <ProcessSection />
      <BenefitsSection />
      <ReviewSection />
      <ContactFormSection />
      <p className="fixed bottom-4 left-1/2 z-20 -translate-x-1/2 text-center text-xs text-slate-600">
        <Link
          href="/hero-v2"
          className="underline decoration-slate-400 underline-offset-2 hover:decoration-slate-600 hover:text-slate-800"
        >
          Vergleich: Hero-Variante 2 ansehen →
        </Link>
      </p>
    </main>
  );
}
