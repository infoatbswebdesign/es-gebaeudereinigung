"use client";

import { useConsentStore } from "@/lib/consent-store";

type Props = {
  className?: string;
  children?: React.ReactNode;
};

/**
 * Footer-Link, der das Consent-Modal jederzeit erneut oeffnet (Widerrufspfad).
 * Pflicht: muss auf jeder Seite sichtbar und genauso einfach erreichbar sein
 * wie die ursspruengliche Einwilligung.
 */
export default function PrivacySettingsLink({ className, children }: Props) {
  const openModal = useConsentStore((s) => s.openModal);
  return (
    <button
      type="button"
      onClick={openModal}
      className={
        className ??
        "transition-colors hover:text-neutral-800 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#7596AE]/50"
      }
    >
      {children ?? "Datenschutzeinstellungen"}
    </button>
  );
}
