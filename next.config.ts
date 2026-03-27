import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Dev: Zugriff auf /_next/* von anderen LAN-Hosts erlauben
  allowedDevOrigins: ["141.47.46.72", "192.168.2.40"],
  images: {
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
