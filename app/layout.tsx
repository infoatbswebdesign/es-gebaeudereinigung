import type { Metadata, Viewport } from "next";
import { Suspense } from "react";
import { Geist_Mono, Manrope } from "next/font/google";
import ConsentInitializer from "./components/ConsentInitializer";
import ConsentModal from "./components/ConsentModal";
import LayoutFooter from "./components/LayoutFooter";
import SiteFooter from "./components/SiteFooter";
import SmoothScrollShell from "./components/SmoothScrollShell";
import ToastStack from "./components/Toast";
import { SmootherProvider } from "./context/SmootherContext";
import { SITE_DESCRIPTION, SITE_NAME, SITE_URL } from "@/lib/seo";
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
  metadataBase: new URL(SITE_URL),
  title: {
    default: `${SITE_NAME} | Gebäudereinigung Esslingen & Stuttgart`,
    template: `%s | ${SITE_NAME}`,
  },
  description: SITE_DESCRIPTION,
  applicationName: SITE_NAME,
  keywords: [
    "Gebäudereinigung Esslingen",
    "Gebäudereinigung Stuttgart",
    "Gebäudeservice Esslingen",
    "Reinigungsfirma Esslingen",
    "Büroreinigung Esslingen",
    "Büroreinigung Stuttgart",
    "Praxisreinigung Esslingen",
    "Unterhaltsreinigung Esslingen",
    "Glasreinigung Esslingen",
    "Grundreinigung Esslingen",
    "Baugrobreinigung Stuttgart",
    "Winterdienst Esslingen",
    "Hausmeisterservice Esslingen",
    "ES-Gebäudeservice",
  ],
  authors: [{ name: SITE_NAME, url: SITE_URL }],
  creator: SITE_NAME,
  publisher: SITE_NAME,
  category: "Gebäudereinigung",
  formatDetection: {
    telephone: true,
    email: true,
    address: true,
  },
  alternates: {
    canonical: "/",
    languages: {
      "de-DE": "/",
      "x-default": "/",
    },
  },
  robots: {
    index: true,
    follow: true,
    nocache: false,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
      "max-video-preview": -1,
    },
  },
  openGraph: {
    type: "website",
    locale: "de_DE",
    url: SITE_URL,
    siteName: SITE_NAME,
    title: `${SITE_NAME} | Gebäudereinigung Esslingen & Stuttgart`,
    description: SITE_DESCRIPTION,
  },
  twitter: {
    card: "summary_large_image",
    title: `${SITE_NAME} | Gebäudereinigung Esslingen & Stuttgart`,
    description: SITE_DESCRIPTION,
  },
  manifest: "/manifest.webmanifest",
  appleWebApp: {
    capable: true,
    title: SITE_NAME,
    statusBarStyle: "black-translucent",
  },
  other: {
    "geo.region": "DE-BW",
    "geo.placename": "Esslingen am Neckar",
    "geo.position": "48.7394;9.3089",
    ICBM: "48.7394, 9.3089",
  },
};

export const viewport: Viewport = {
  themeColor: "#7596AE",
  width: "device-width",
  initialScale: 1,
  colorScheme: "light",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="de" suppressHydrationWarning>
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `(function(){try{var p='smoothScrollY:';var k=p+location.pathname+location.search+location.hash;var y=Number(sessionStorage.getItem(k)||'0');if(!Number.isFinite(y)||y<=0)return;document.documentElement.style.setProperty('--ss-initial-y',String(y));document.documentElement.classList.add('ss-preinit');}catch(e){}})();`,
          }}
        />
        {process.env.NODE_ENV !== "production" ? (
          <script
            dangerouslySetInnerHTML={{
              __html: `(function(){try{var ATTR='data-cursor-ref';function strip(root){if(!root||!root.querySelectorAll)return;if(root.hasAttribute&&root.hasAttribute(ATTR))root.removeAttribute(ATTR);var n=root.querySelectorAll('['+ATTR+']');for(var i=0;i<n.length;i++)n[i].removeAttribute(ATTR);}strip(document.documentElement);var mo=new MutationObserver(function(muts){for(var i=0;i<muts.length;i++){var m=muts[i];if(m.type==='attributes'&&m.attributeName===ATTR&&m.target&&m.target.hasAttribute&&m.target.hasAttribute(ATTR)){m.target.removeAttribute(ATTR);}else if(m.type==='childList'){m.addedNodes&&m.addedNodes.forEach(function(node){if(node.nodeType===1)strip(node);});}}});mo.observe(document.documentElement,{attributes:true,attributeFilter:[ATTR],subtree:true,childList:true});function stop(){try{mo.disconnect();}catch(e){}}if(document.readyState==='complete'){setTimeout(stop,1500);}else{window.addEventListener('load',function(){setTimeout(stop,1500);},{once:true});}}catch(e){}})();`,
            }}
          />
        ) : null}
      </head>
      <body
        className={`${geistMono.variable} ${manrope.variable} ${manrope.className} antialiased`}
      >
        <SmootherProvider>
          <Suspense fallback={null}>
            <SmoothScrollShell>
              {children}
              <LayoutFooter>
                <SiteFooter />
              </LayoutFooter>
            </SmoothScrollShell>
          </Suspense>
        </SmootherProvider>
        <ConsentInitializer />
        <ConsentModal />
        <ToastStack />
      </body>
    </html>
  );
}
