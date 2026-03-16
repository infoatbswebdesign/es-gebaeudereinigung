import type { Metadata } from "next";
import BenefitsSection from "../components/BenefitsSection";
import CardsSection from "../components/CardsSection";
import ContactFormSection from "../components/ContactFormSection";
import HeroV2 from "../components/HeroV2";
import ProcessSection from "../components/ProcessSection";
import ReviewSection from "../components/ReviewSection";
import UeberUnsSection from "../components/UeberUnsSection";

export const metadata: Metadata = {
  title: "Hero Variante 2 | ES Gebäudereinigung",
  description:
    "Zweite Hero-Variante im Vergleich: Full-Width mit Video-Hintergrund.",
};

export default function HeroV2Page() {
  return (
    <main>
      <HeroV2 />
      <UeberUnsSection />
      <CardsSection />
      <ProcessSection />
      <BenefitsSection />
      <ReviewSection />
      <ContactFormSection />
    </main>
  );
}
