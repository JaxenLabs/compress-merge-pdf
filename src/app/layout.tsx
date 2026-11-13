import type { Metadata, Viewport } from "next";
import { Inter, Space_Grotesk } from "next/font/google";
import type { ReactNode } from "react";
import { SiteFooter } from "@/components/SiteFooter";
import { SiteHeader } from "@/components/SiteHeader";
import { JaxScanSideCard } from "@/components/JaxScanPromo";
import { StickyAppBanner } from "@/components/StickyAppBanner";
import { SITE_URL, site } from "@/content/site";
import "./globals.css";

// Fonts are downloaded at build time and served from this site (no request to Google from visitors).
const inter = Inter({ subsets: ["latin"], variable: "--font-inter", display: "swap" });
const grotesk = Space_Grotesk({ subsets: ["latin"], variable: "--font-grotesk", display: "swap" });

/**
 * <head> tags: title, description, keywords, canonical URL, share cards and
 * search-engine settings. Icons and the share image are found automatically
 * by Next.js from the files in this folder (icon1.png, apple-icon.png,
 * opengraph-image.png).
 */
export const metadata: Metadata = {
  // The domain only: Next.js adds the basePath to icon and share-image URLs itself.
  metadataBase: new URL(site.origin),
  title: site.title,
  description: site.description,
  keywords: [...site.keywords],
  applicationName: site.name,
  authors: [{ name: site.publisher.name, url: site.publisher.url }],
  creator: site.publisher.name,
  publisher: site.publisher.name,
  category: "Utilities",
  alternates: { canonical: SITE_URL },
  robots: { index: true, follow: true, googleBot: { index: true, follow: true, "max-image-preview": "large", "max-snippet": -1 } },
  openGraph: {
    type: "website",
    siteName: site.brandName,
    locale: "en_US",
    url: SITE_URL,
    title: site.title,
    description: site.description,
  },
  twitter: { card: "summary_large_image", title: site.title, description: site.description },
  formatDetection: { email: false, telephone: false, address: false },
};

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: dark)", color: "#05080d" },
    { media: "(prefers-color-scheme: light)", color: "#f4f8f7" },
  ],
  colorScheme: "dark light",
  viewportFit: "cover",
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en" className={`${inter.variable} ${grotesk.variable}`}>
      <body className="relative flex min-h-dvh flex-col overflow-x-clip font-sans">
        <a
          href="#main"
          className="sr-only focus:not-sr-only focus:fixed focus:top-3 focus:left-3 focus:z-[60] focus:rounded-xl focus:bg-accent focus:px-4 focus:py-2 focus:font-semibold focus:text-bg"
        >
          Skip to content
        </a>
        <div className="aurora" aria-hidden />
        <SiteHeader />
        <main id="main" className="flex-1">
          {children}
        </main>
        <SiteFooter />
        {/* Room for the sticky JaxScan bar on phones and tablets */}
        <div className="h-20 lg:hidden" aria-hidden />
        <JaxScanSideCard />
        <StickyAppBanner />
      </body>
    </html>
  );
}
