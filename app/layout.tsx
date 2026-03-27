import type { Metadata, Viewport } from "next";
import { Geist_Mono, Manrope } from "next/font/google";
import SmoothScrollShell from "./components/SmoothScrollShell";
import SiteFooter from "./components/SiteFooter";
import { SmootherProvider } from "./context/SmootherContext";
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

export const viewport: Viewport = {
  themeColor: "#7596AE",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="de" suppressHydrationWarning>
      <head>
        <meta name="theme-color" content="#7596AE" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
        <script
          dangerouslySetInnerHTML={{
            __html: `(function(){try{var p='smoothScrollY:';var k=p+location.pathname+location.search+location.hash;var y=Number(sessionStorage.getItem(k)||'0');if(!Number.isFinite(y)||y<=0)return;document.documentElement.style.setProperty('--ss-initial-y',String(y));document.documentElement.classList.add('ss-preinit');}catch(e){}})();`,
          }}
        />
      </head>
      <body
        className={`${geistMono.variable} ${manrope.variable} ${manrope.className} antialiased`}
      >
        <SmootherProvider>
          <SmoothScrollShell>
            {children}
            <SiteFooter />
          </SmoothScrollShell>
        </SmootherProvider>
      </body>
    </html>
  );
}
