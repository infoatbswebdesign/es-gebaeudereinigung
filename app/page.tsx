import type { Metadata } from "next";
import BenefitsSection from "./components/BenefitsSection";
import CardsSection from "./components/CardsSection";
import HeroV2 from "./components/HeroV2";
import HeroV2StickyScrollTransition from "./components/HeroV2StickyScrollTransition";
import ProcessJsonLd from "./components/ProcessJsonLd";
import ProcessSection from "./components/ProcessSection";
import ReviewSection from "./components/ReviewSection";
import { FooterContactPanel, FooterLegalPanel } from "./components/SiteFooter";
import UeberUnsSection from "./components/UeberUnsSection";
import {
  SITE_DESCRIPTION,
  SITE_NAME,
  breadcrumbJsonLd,
  buildPageMetadata,
  organizationJsonLd,
  websiteJsonLd,
} from "@/lib/seo";

const HOME_TITLE = `${SITE_NAME} | Gebäudereinigung Esslingen & Stuttgart`;

export const metadata: Metadata = buildPageMetadata({
  title: HOME_TITLE,
  description: SITE_DESCRIPTION,
  path: "/",
});

export default function Home() {
  const organizationLd = organizationJsonLd();
  const websiteLd = websiteJsonLd();
  const breadcrumbLd = breadcrumbJsonLd([
    { name: "Startseite", path: "/" },
  ]);

  return (
    <main>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbLd) }}
      />
      <ProcessJsonLd />
      <HeroV2StickyScrollTransition
        hero={<HeroV2 />}
        nextSection={
          <>
            <UeberUnsSection />
            <CardsSection />
            <ProcessSection />
            <BenefitsSection />
            <ReviewSection />
            <FooterContactPanel />
            <FooterLegalPanel />
          </>
        }
      />
    </main>
  );
}
