/**
 * Zentrale Button-Stile fuer das gesamte Frontend.
 *
 * Hoehen-Raster (FEST, kein Layout-Shift):
 * - Primaer + Sekundaer Standard: `h-12` (48px) → identisch hoch, auch
 *   nebeneinander in derselben Zeile.
 * - Compact-Variante (nur Kontaktformular, 100svh-Constraint): `h-10` (40px).
 *
 * Wichtig
 * - KEIN responsives `text-sm md:text-base`: das wuerde die Pixelhoehe
 *   beim Breakpoint kippen. Wir fixieren `text-base` ueberall.
 * - `whitespace-nowrap` verhindert, dass Labels umbrechen und so die Hoehe
 *   sprengen.
 * - Hover/Active aendern nur Farbe (transition-colors), nicht Padding/Border
 *   → kein CLS.
 *
 * Ausnahme (NICHT diese Stile verwenden):
 * - Consent-Modal (`ConsentModal.tsx`) – hat bewusst eigene, gleichgewichtete
 *   Buttons (DSGVO-Leitfaden).
 */

const PRIMARY_BASE =
  "inline-flex h-12 items-center justify-center whitespace-nowrap rounded-full px-6 text-base font-semibold leading-none transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2";

/** Primaer-Button auf hellem/Standard-Hintergrund (Brand-Blau). */
export const BTN_PRIMARY = `${PRIMARY_BASE} bg-[#7596AE] text-white hover:bg-[#5e7e96] focus-visible:ring-[#7596AE]/50`;

/** Primaer-Button ueber Bild/Video-Hintergrund (weiss, dunkler Text). */
export const BTN_PRIMARY_INVERSE = `${PRIMARY_BASE} bg-white text-slate-900 hover:bg-white/90 focus-visible:ring-white focus-visible:ring-offset-transparent`;

/**
 * Submit-Variante fuer Formulare (z. B. Kontaktformular).
 * Identische Hoehe (h-12) und Optik wie BTN_PRIMARY_INVERSE, plus
 * disabled-State fuer den Pending-Zustand.
 */
export const BTN_PRIMARY_SUBMIT = `${PRIMARY_BASE} gap-2 bg-white text-[#2A4961] hover:bg-white/90 disabled:cursor-not-allowed disabled:opacity-70 focus-visible:ring-white focus-visible:ring-offset-transparent`;

const SECONDARY_BASE =
  "inline-flex h-12 items-center gap-1 whitespace-nowrap text-base font-semibold underline underline-offset-4 transition-colors focus:outline-none focus-visible:rounded-sm focus-visible:ring-2 focus-visible:ring-offset-2";

/** Sekundaer-Button: reiner Text mit Unterstreichung, dunkler Text. */
export const BTN_SECONDARY = `${SECONDARY_BASE} text-slate-900 decoration-slate-400 hover:decoration-slate-900 focus-visible:ring-[#7596AE]/50`;

/** Sekundaer-Button: reiner Text mit Unterstreichung, helle Schrift (ueber Bild). */
export const BTN_SECONDARY_LIGHT = `${SECONDARY_BASE} text-white decoration-white/70 hover:decoration-white focus-visible:ring-white focus-visible:ring-offset-transparent`;
