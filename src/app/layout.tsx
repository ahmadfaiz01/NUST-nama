import type { Metadata, Viewport } from "next";
import { Bebas_Neue, Space_Grotesk, Inter } from "next/font/google";
import "./globals.css";
import { NavBar } from "@/components/layout/NavBar";
import { Footer } from "@/components/layout/Footer";
import { ChatBubble } from "@/components/chat/ChatBubble";

// Typography Setup - Pretty Patty Inspired
const bebasNeue = Bebas_Neue({
  variable: "--font-heading",
  subsets: ["latin"],
  weight: "400",
  display: "swap",
});

const spaceGrotesk = Space_Grotesk({
  variable: "--font-display",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  display: "swap",
});

const inter = Inter({
  variable: "--font-sans",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL("https://nustnama.life"),
  title: {
    default: "NUST Nama | Campus Events, Guides & Live Vibes",
    template: "%s | NUST Nama",
  },
  description:
    "Discover events, campus guides, orientation schedules, rules, and live activity at NUST H-12 Islamabad. Your official student campus intelligence platform.",
  keywords: [
    "NUST",
    "NUST Islamabad",
    "NUST H-12",
    "NUST Orientation 2026",
    "NUST events",
    "NUST campus guide",
    "NUST attendance policy",
    "NUST GPA grading",
    "NUST cafes",
    "NUST hostels",
    "NUSTnama",
    "Pakistan university",
  ],
  authors: [{ name: "NUST Nama Team" }],
  creator: "NUST Nama",
  publisher: "NUST Nama",
  alternates: {
    canonical: "https://nustnama.life",
  },
  other: {
    "geo.region": "PK-IS",
    "geo.placename": "Islamabad, NUST H-12 Campus, Pakistan",
    "geo.position": "33.6428;72.9905",
    "ICBM": "33.6428, 72.9905",
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://nustnama.life",
    siteName: "NUST Nama",
    title: "NUST Nama | Campus Events, Guides & Live Vibes",
    description:
      "Discover events, feel the crowd vibe, read verified student guides, and coordinate with friends at NUST H-12.",
    images: [{ url: "/images/hero_aerial_1.jpg", width: 1200, height: 630, alt: "NUST Nama Campus" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "NUST Nama",
    description: "Your campus intelligence platform for NUST H-12 Islamabad",
    images: ["/images/hero_aerial_1.jpg"],
  },
  manifest: "/site.webmanifest",
};

export const viewport: Viewport = {
  themeColor: "#1B3A6B",
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
};

import { PostHogProvider } from "@/components/providers/PostHogProvider";

const rootSchema = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "CollegeOrUniversity",
      "@id": "https://nustnama.life/#organization",
      "name": "NUST Nama",
      "url": "https://nustnama.life",
      "logo": "https://nustnama.life/icon.png",
      "description": "Student campus intelligence platform for National University of Sciences and Technology (NUST) H-12 Islamabad.",
      "address": {
        "@type": "PostalAddress",
        "streetAddress": "NUST H-12 Campus, Scholar Avenue",
        "addressLocality": "Islamabad",
        "postalCode": "44000",
        "addressCountry": "PK"
      },
      "geo": {
        "@type": "GeoCoordinates",
        "latitude": 33.6428,
        "longitude": 72.9905
      }
    },
    {
      "@type": "WebSite",
      "@id": "https://nustnama.life/#website",
      "url": "https://nustnama.life",
      "name": "NUST Nama",
      "publisher": { "@id": "https://nustnama.life/#organization" }
    }
  ]
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${bebasNeue.variable} ${spaceGrotesk.variable} ${inter.variable}`}
    >
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(rootSchema) }}
        />
      </head>
      <body className="min-h-screen bg-cream text-foreground antialiased relative selection:bg-nust-orange selection:text-white">
        <PostHogProvider>
          <NavBar />
          <main className="pt-24">{children}</main>
          <Footer />
          <ChatBubble />
        </PostHogProvider>
      </body>
    </html>
  );
}
