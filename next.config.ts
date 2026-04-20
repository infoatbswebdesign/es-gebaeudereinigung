import path from "node:path";
import type { NextConfig } from "next";

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
};

export default nextConfig;
