import type { Metadata } from "next";
import { Geist_Mono, Manrope } from "next/font/google";
import "./globals.css";

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const manrope = Manrope({
  variable: "--font-manrope",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

export const metadata: Metadata = {
  title: "ES Gebäudereinigung | Professionelle Reinigung",
  description:
    "Professionelle Gebäudereinigung für Büros, Praxen und Gewerbe. Zuverlässig, gründlich, fair.",
  openGraph: {
    title: "ES Gebäudereinigung | Professionelle Reinigung",
    description:
      "Professionelle Gebäudereinigung für Büros, Praxen und Gewerbe.",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "ES Gebäudereinigung | Professionelle Reinigung",
    description: "Professionelle Gebäudereinigung für Büros, Praxen und Gewerbe.",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="de">
      <body
        className={`${geistMono.variable} ${manrope.variable} ${manrope.className} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
