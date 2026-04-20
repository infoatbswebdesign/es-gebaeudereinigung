"use client";

import { BTN_PRIMARY, BTN_SECONDARY } from "@/app/components/buttonStyles";
import { useConsentStore } from "@/lib/consent-store";

type Props = {
  /** Adresse als Suchbegriff für Google Maps Embed (z. B. "Musterstr. 1, 73728 Esslingen"). */
  address: string;
  /** Anzeigetext der Adresse im Placeholder. Default: address. */
  displayAddress?: string;
  /** Klassen für den äußeren Wrapper (Placeholder vor Consent). */
  className?: string;
  /** Klassen für das iframe, wenn Consent erteilt wurde. */
  iframeClassName?: string;
  /** Default-Zoom (1–20). */
  zoom?: number;
};

/**
 * Gate-Komponente für Google Maps:
 *
 * - Vor Consent (externalMedia !== true): rein lokaler Placeholder. KEIN Request an Google.
 *   Zusätzlich: sichtbarer Link "In Google Maps öffnen" als harter Fallback (öffnet erst
 *   nach Klick durch den Nutzer im neuen Tab, kein automatisches Tracking der Website).
 *
 * - Nach Consent (externalMedia === true): iframe mit Maps-Embed.
 *   Wenn ein API-Key gesetzt ist, wird die offizielle Maps-Embed-API genutzt, ansonsten
 *   die klassische `maps?q=…&output=embed`-URL (kein Key erforderlich).
 *
 * DSGVO-Hinweise:
 * - referrerPolicy="no-referrer" verhindert, dass Google die aufrufende URL mitgeteilt bekommt.
 * - loading="lazy" lädt die Karte erst beim Scrollen in den Viewport.
 * - title und aria-Label für Screenreader.
 */
export default function GoogleMapGate({
  address,
  displayAddress,
  className,
  iframeClassName,
  zoom = 15,
}: Props) {
  const externalMedia = useConsentStore((s) => s.externalMedia);
  const openModal = useConsentStore((s) => s.openModal);

  const effectiveDisplay = displayAddress ?? address;
  const externalMapsUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
    address,
  )}`;

  if (!externalMedia) {
    return (
      <div
        role="region"
        aria-label="Standortkarte (deaktiviert)"
        className={
          className ??
          "rounded-lg border border-neutral-300 bg-neutral-50 p-6 text-center"
        }
      >
        <h3 className="text-base font-semibold text-neutral-900">
          Standortkarte
        </h3>
        <p className="mx-auto mt-2 max-w-md text-sm leading-relaxed text-neutral-700">
          Zum Anzeigen der interaktiven Karte ist eine Verbindung zu Google
          erforderlich. Dabei werden Ihre IP-Adresse und weitere Daten an Google
          in den USA übertragen.
        </p>
        <div className="mt-4 flex flex-wrap items-center justify-center gap-x-6 gap-y-3">
          <button type="button" onClick={openModal} className={BTN_PRIMARY}>
            Karte aktivieren
          </button>
          <a
            href={externalMapsUrl}
            target="_blank"
            rel="noopener noreferrer"
            className={BTN_SECONDARY}
          >
            In Google Maps öffnen
            <span aria-hidden>→</span>
          </a>
        </div>
        <p className="mt-4 text-sm text-neutral-700">
          Adresse: <span className="font-medium">{effectiveDisplay}</span>
        </p>
      </div>
    );
  }

  const apiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_KEY;
  const src = apiKey
    ? `https://www.google.com/maps/embed/v1/place?key=${apiKey}&q=${encodeURIComponent(
        address,
      )}&zoom=${zoom}`
    : `https://www.google.com/maps?q=${encodeURIComponent(address)}&z=${zoom}&output=embed`;

  return (
    <iframe
      title={`Standort ${effectiveDisplay} auf Google Maps`}
      aria-label={`Interaktive Google-Maps-Karte für ${effectiveDisplay}`}
      src={src}
      className={
        iframeClassName ??
        className ??
        "h-[420px] w-full rounded-lg border-0"
      }
      loading="lazy"
      referrerPolicy="no-referrer"
      allowFullScreen
    />
  );
}
