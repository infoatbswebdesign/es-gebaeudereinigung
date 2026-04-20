/**
 * Zentrale statische Bild-Imports.
 *
 * Warum statisch importieren?
 * - Next.js `Image` bekommt dadurch width/height/blurDataURL zur Build-Zeit
 *   und kann `placeholder="blur"` automatisch rendern.
 * - Kein Layout-Shift beim Laden, weil die Intrinsic-Dimensions bekannt sind.
 *
 * Alle Dateien liegen weiterhin physisch unter `/public`, werden aber nicht
 * per URL-String, sondern per Modul-Import eingebunden.
 */

import arztPraxisKunde from "@/public/arzt-praxis-es-gebaeudeservice-kunde.jpg";
import baugrobreinigung from "@/public/baugrobreinigung-es-gebaeudeservice.jpg";
import entruempelung from "@/public/entruempelung-es-gebaeudeservice.jpg";
import heroPosterFirstFrame from "@/public/es-gebaeudereinigung-hero-section-first-frame.jpg";
import gebaeudeservice from "@/public/gebaeudeservice-es-gebaeudeservice.jpg";
import geschaeftsfuehrerBauKunde from "@/public/geschaeftsfuehrer-bauunternehmen-es-gebaeudeservice-kunde.jpg";
import geschaeftsfuehrerKosmetikKunde from "@/public/geschaeftsfuehrer-kosmetikfirma-es-gebaeudeservice-kunde.jpg";
import glasreinigung from "@/public/glasreinigung-es-gebaeudeservice.jpg";
import gruenanlageflaechen from "@/public/gruenanlageflaechen-es-gebaeudeservice.jpg";
import grundreinigung from "@/public/grundreinigung-es-gebaeudeservice.jpg";
import kehrwochen from "@/public/kehrwochen-es-gebaeudeservice.jpg";
import lebensmittelbrancheReinigung from "@/public/lebensmittelbranche-reinigung-es-gebaeudeservice.jpeg";
import logoEsGebaeudeservice from "@/public/logo-es-gebaeudeservice.png";
import logoWhite from "@/public/logo-es-gebaeudeservice-white.png";
import putzfrauJobErledigt from "@/public/putzfrau-hat-job-erledigt-es-gebaeudeservice.jpg";
import putzfrauLiestAngebot from "@/public/putzfrau-liest-angebot-durch-es-gebaeudeservice.jpg";
import putzfrauVereinbartTermin from "@/public/putzfrau-vereinbart-termin-es-gebeaudeservice.jpg";
import reinigungsservice from "@/public/reinigungsservice-es-gebaeudeservice.jpg";
import stadtEsslingen from "@/public/stadt-esslingen.jpg";
import unterhaltsreinigung from "@/public/unterhaltsreinigung-es-gebaeudeservice.jpg";
import winterdienst from "@/public/winterdienst-es-gebaeudeservice.jpg";
import winterdienstGehweg from "@/public/winterdienst-gehweg-es-gebaeudeservice.jpeg";

export {
  arztPraxisKunde,
  baugrobreinigung,
  entruempelung,
  heroPosterFirstFrame,
  gebaeudeservice,
  geschaeftsfuehrerBauKunde,
  geschaeftsfuehrerKosmetikKunde,
  glasreinigung,
  gruenanlageflaechen,
  grundreinigung,
  kehrwochen,
  lebensmittelbrancheReinigung,
  logoEsGebaeudeservice,
  logoWhite,
  putzfrauJobErledigt,
  putzfrauLiestAngebot,
  putzfrauVereinbartTermin,
  reinigungsservice,
  stadtEsslingen,
  unterhaltsreinigung,
  winterdienst,
  winterdienstGehweg,
};
