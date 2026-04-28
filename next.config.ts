import path from "node:path";
import type { NextConfig } from "next";

/**
 * Kanonischer Host (Punycode/ACE-Form der IDN `es-gebäudeservice.de`).
 * MUSS identisch zu `SITE_URL` aus `lib/seo.ts` sein – wird hier hart
 * dupliziert, weil `next.config.ts` zur Build-Zeit ohne TS-Pfad-Aliasse
 * evaluiert wird.
 */
const CANONICAL_HOST = "xn--es-gebudeservice-mwb.de";

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
  /**
   * Host-Kanonisierung für Google: jede Variante der Domain wird per
   * 308 (Permanent Redirect) auf den Punycode-Host ohne `www` gelenkt.
   * Damit verschwinden in der Search Console die Statuswerte
   *   – „Seite mit Weiterleitung"  und
   *   – „Alternative Seite mit richtigem kanonischen Tag"
   * an Stellen, wo sie nur durch fehlende Host-Konsolidierung entstehen.
   *
   * Voraussetzung: alle hier genannten Hostnamen sind beim Hoster (Vercel,
   * IONOS Cloud, Plesk, Apache, …) auf diese Next.js-Instanz gemappt.
   */
  async redirects() {
    return [
      // www.<punycode> → apex (Punycode)
      {
        source: "/:path*",
        has: [{ type: "host", value: `www.${CANONICAL_HOST}` }],
        destination: `https://${CANONICAL_HOST}/:path*`,
        permanent: true,
      },
    ];
  },
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
