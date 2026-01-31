import type { Metadata } from "next";
import { Unbounded, League_Spartan, Inter } from "next/font/google";
import "./globals.css";
import { NavBar } from "@/components/layout/NavBar";

// Using Unbounded as an "Act Duel"-like alternative (Geometric/Extended/Modern)
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

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-sans",
  display: "swap",
});

export const metadata: Metadata = {
  title: "What's Up NUST",
  description: "Campus intelligence platform for NUST students",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${unbounded.variable} ${leagueSpartan.variable} ${inter.variable}`}
    >
      <body className="min-h-screen bg-cream text-foreground antialiased relative selection:bg-nust-orange selection:text-white">
        <NavBar />
        <main className="pt-24">{children}</main>
      </body>
    </html>
  );
}
