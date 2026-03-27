import BenefitsSection from "./components/BenefitsSection";
import CardsSection from "./components/CardsSection";
import HeroV2 from "./components/HeroV2";
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
      <HeroV2 />
      <UeberUnsSection />
      <CardsSection />
      <ProcessSection />
      <BenefitsSection />
      <ReviewSection />
    </main>
  );
}
