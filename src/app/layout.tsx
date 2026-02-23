import type { Metadata } from "next";
import { Bricolage_Grotesque, JetBrains_Mono } from "next/font/google";
import "./globals.css";
import { Toaster } from "sonner";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import Providers from "./providers";

const bricolage = Bricolage_Grotesque({
  subsets: ["latin"],
  variable: "--font-sans",
  display: "swap",
});

const jetbrains = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
  display: "swap",
});

export const metadata: Metadata = {
  title: "CareerLens AI — Algorithmic Resume Intelligence",
  description:
    "Analyze your resume against ATS algorithms in real-time. Uncover blind spots, compute benchmark scores, and fix your application before submission.",
  keywords: [
    "resume",
    "AI",
    "ATS analysis",
    "neo brutulism",
    "career engineering",
  ],
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html
      lang="en"
      className="dark"
      style={{ colorScheme: "dark" }}
      suppressHydrationWarning
    >
      <body
        className={`${bricolage.variable} ${jetbrains.variable} font-sans noise-overlay antialiased bg-[#050505] text-[#F3F3F3]`}
        suppressHydrationWarning
      >
        <Providers>
          <Navbar />
          {children}
          <Footer />
        </Providers>
        <Toaster
          toastOptions={{
            duration: 4000,
            className:
              "brutalist-card !bg-black !text-white !border-white/20 !rounded-none",
          }}
          position="bottom-right"
        />
      </body>
    </html>
  );
}
