import type { Metadata } from "next";
import BenefitsSection from "../components/BenefitsSection";
import CardsSection from "../components/CardsSection";
import Hero from "../components/Hero";
import ProcessSection from "../components/ProcessSection";
import ReviewSection from "../components/ReviewSection";
import UeberUnsSection from "../components/UeberUnsSection";

export const metadata: Metadata = {
  title: "Hero Variante 1 | ES Gebäudereinigung",
  description:
    "Klassische Hero-Variante im Vergleich: geteiltes Layout mit Video-Panel.",
};

export default function HeroV1Page() {
  return (
    <main>
      <Hero />
      <UeberUnsSection />
      <CardsSection />
      <ProcessSection />
      <BenefitsSection />
      <ReviewSection />
    </main>
  );
}
