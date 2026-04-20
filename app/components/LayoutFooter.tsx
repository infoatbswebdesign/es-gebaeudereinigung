"use client";

import { usePathname } from "next/navigation";

type Props = {
  children: React.ReactNode;
};

/**
 * Rendert den vom Server uebergebenen Footer fuer alle Seiten ausser der
 * Startseite. Dank children-Pattern (siehe Next.js 16 Docs,
 * "Interleaving Server and Client Components") bleibt der gesamte Footer-
 * Baum Server-gerendert und landet nicht im Client-Bundle.
 */
export default function LayoutFooter({ children }: Props) {
  const pathname = usePathname();

  if (pathname === "/") {
    return null;
  }

  return <>{children}</>;
}
