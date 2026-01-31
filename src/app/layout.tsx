import type { Metadata, Viewport } from "next";
import { Bebas_Neue, Space_Grotesk, Inter } from "next/font/google";
import "./globals.css";
import { NavBar } from "@/components/layout/NavBar";
import { Footer } from "@/components/layout/Footer";

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
  title: "What's Up NUST | Campus Events & Live Vibes",
  description:
    "Discover events, feel the crowd vibe, and coordinate with friends at NUST. Your campus intelligence platform.",
  keywords: [
    "NUST",
    "events",
    "campus",
    "students",
    "Pakistan",
    "university",
    "social",
  ],
  authors: [{ name: "What's Up NUST Team" }],
  creator: "What's Up NUST",
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://whatsupnust.vercel.app",
    siteName: "What's Up NUST",
    title: "What's Up NUST | Campus Events & Live Vibes",
    description:
      "Discover events, feel the crowd vibe, and coordinate with friends at NUST.",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "What's Up NUST",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "What's Up NUST",
    description: "Your campus intelligence platform",
  },
  manifest: "/manifest.json",
};

export const viewport: Viewport = {
  themeColor: "#004B87",
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
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
      <body className="min-h-screen bg-cream text-foreground antialiased relative selection:bg-nust-orange selection:text-white">
        <NavBar />
        <main className="pt-24">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
