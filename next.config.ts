import path from "node:path";
import type { NextConfig } from "next";

/**
 * Kanonischer Host (Doku):
 *   Punycode  : xn--es-gebudeservice-0nb.de
 *   IDN/Unicode: es-gebäudeservice.de
 *
 * Die kanonische URL fuer Sitemap, Canonical, JSON-LD steht in
 * `lib/seo.ts` (`SITE_URL`). Apex ↔ www-Redirect erfolgt auf Edge-Ebene
 * im Vercel-Dashboard (siehe Kommentar weiter unten), nicht hier.
 */

const nextConfig: NextConfig = {
  // Fingerprint-Reduktion: kein "x-powered-by: Next.js"-Header ausliefern.
  poweredByHeader: false,
  // Saubere URLs: ".../leistungen/" → ".../leistungen" (Standard seit Next.js 16
  // explizit gesetzt, um Mixed-Case/Canonical-Issues zu vermeiden).
  trailingSlash: false,
  // Dev: Zugriff auf /_next/* von anderen LAN-/Tailscale-Hosts erlauben.
  allowedDevOrigins: ["141.47.46.72", "192.168.2.40", "100.94.22.174"],
  // Turbopack-Root explizit setzen, damit Monorepo-Heuristiken den Workspace
  // nicht falsch raten (Next.js 16 gibt sonst gelegentlich einen Panik-Exit
  // beim Warm-Start aus).
  turbopack: {
    root: path.resolve(__dirname),
  },
  images: {
    // Moderne Bildformate priorisieren; Next.js 16 liefert per Fallback
    // automatisch JPEG/PNG für Browser ohne AVIF/WebP-Support.
    formats: ["image/avif", "image/webp"],
    remotePatterns: [
      {
        protocol: "https",
        hostname: "images.unsplash.com",
        pathname: "/**",
      },
    ],
  },
  // Anmerkung zu Host-Kanonisierung:
  // Apex ↔ www-Redirect wird bewusst NICHT auf Application-Ebene gemacht,
  // sondern auf Edge-Ebene direkt im Vercel-Domain-Routing
  // (Project → Settings → Domains → www-Variante → 308 Permanent Redirect).
  // Doppelte Redirects auf zwei Layern hatten zuvor zu einer Schleife
  // zwischen Vercel (apex → www) und Next.js (www → apex) gefuehrt –
  // mit dem Resultat ERR_TOO_MANY_REDIRECTS.
  /**
   * Sicherheits-/SEO-Header. `X-Robots-Tag: index,follow` wirkt zusätzlich
   * zum Meta-Robots-Tag und stellt sicher, dass Bilder/JSON-Routen ohne
   * eigenes <head> ebenfalls indexierbar sind.
   */
  async headers() {
    return [
      {
        source: "/:path*",
        headers: [
          {
            key: "X-Robots-Tag",
            value: "index, follow, max-image-preview:large",
          },
          { key: "X-Content-Type-Options", value: "nosniff" },
          { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
        ],
      },
    ];
  },
};

export default nextConfig;
