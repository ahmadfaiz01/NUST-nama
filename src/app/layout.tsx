
import type { Metadata, Viewport } from "next";
import { Unbounded, League_Spartan } from "next/font/google";
import "./globals.css";
import { NavBar } from "@/components/layout/NavBar";

const unbounded = Unbounded({
  subsets: ["latin"],
  variable: "--font-heading",
  display: "swap",
});

const leagueSpartan = League_Spartan({
  subsets: ["latin"],
  variable: "--font-display",
  display: "swap",
});

export const metadata: Metadata = {
  title: "What's Up NUST",
  description: "Real-time campus intelligence platform for NUST students",
};

export const viewport: Viewport = {
  initialScale: 1,
  width: "device-width",
  themeColor: "#004B87",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${unbounded.variable} ${leagueSpartan.variable}`}
    >
      <body className="min-h-screen bg-cream text-foreground antialiased relative selection:bg-nust-orange selection:text-white font-display">
        <NavBar />
        <main className="pt-24">{children}</main>
      </body>
    </html>
  );
}
