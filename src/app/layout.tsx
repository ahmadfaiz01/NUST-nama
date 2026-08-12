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
  title: "NUST Nama | Campus Events & Live Vibes",
  description:
    "Discover events, feel the crowd vibe, and coordinate with friends at NUST. Your campus intelligence platform.",
  keywords: [
    "NUST",
    "NUSTnama",
    "events",
    "campus",
    "students",
    "Pakistan",
    "university",
    "social",
  ],
  authors: [{ name: "NUST Nama Team" }],
  creator: "NUST Nama",
  // No `icons` here on purpose: it would override the file convention. The tab
  // icon comes from src/app/icon.png and src/app/apple-icon.png, both the
  // wordmark, so the logo is the single source and cannot drift again.
  // src/app/favicon.ico used to sit alongside them holding Next's stock black
  // triangle, and being an app-directory file it won every request for
  // /favicon.ico regardless of what public/ or this block said.
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://nustnama.life",
    siteName: "NUST Nama",
    title: "NUST Nama | Campus Events & Live Vibes",
    description:
      "Discover events, feel the crowd vibe, and coordinate with friends at NUST.",
    images: [{ url: "/images/hero_aerial_1.jpg", alt: "NUST Nama" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "NUST Nama",
    description: "Your campus intelligence platform",
  },
  manifest: "/site.webmanifest",
};

export const viewport: Viewport = {
  themeColor: "#004B87",
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
};

import { PostHogProvider } from "@/components/providers/PostHogProvider";

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
