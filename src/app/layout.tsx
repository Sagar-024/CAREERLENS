import type { Metadata } from "next";
import { JetBrains_Mono, Playfair_Display } from "next/font/google";
import "./globals.css";
import { Toaster } from "sonner";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import Providers from "./providers";
import { ThemeProvider } from "@/components/theme-provider";

const jetbrains = JetBrains_Mono({
  subsets: ["latin"],
  weight: ["300", "400", "500"],
  variable: "--font-mono",
  display: "swap",
});

const playfair = Playfair_Display({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800", "900"],
  style: ["normal", "italic"],
  variable: "--font-serif",
  display: "swap",
});

export const metadata: Metadata = {
  title:
    "CareerLens AI — Know exactly why your resume isn't getting interviews",
  description:
    "Paste a job description, upload your resume. Our AI shows your ATS readiness score, skill gaps, and personalized recommendations in 30 seconds.",
  keywords: [
    "resume",
    "AI",
    "ATS analysis",
    "career",
    "job search",
    "skills gap",
  ],
  openGraph: {
    title: "CareerLens AI — Know your resume score in 30 seconds",
    description:
      "See your exact ATS readiness score and skill gaps against any job description.",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "CareerLens AI",
    description:
      "Analyze your resume against any job description in 30 seconds.",
  },
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        {/* Satoshi font from FontShare */}
        <link
          href="https://api.fontshare.com/v2/css?f[]=satoshi@400,500,700,900&display=swap"
          rel="stylesheet"
        />
        {/* Playfair Display for editorial headlines */}
        <link
          href="https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400..900;1,400..900&display=swap"
          rel="stylesheet"
        />
      </head>
      <body
        className={`${jetbrains.variable} ${playfair.variable} font-sans antialiased`}
        suppressHydrationWarning
      >
        <ThemeProvider
          attribute="class"
          defaultTheme="dark"
          disableTransitionOnChange
        >
          <Providers>
            <Navbar />
            <div className="h-28" aria-hidden="true" />
            {children}
            <Footer />
          </Providers>
          <Toaster
            toastOptions={{
              duration: 4000,
              classNames: {
                toast:
                  "!bg-[#111113] !border-[#1c1c1f] !text-[#fafaf9] !rounded-xl !text-sm",
                success: "!border-[#7fb685]/40",
                error: "!border-[#e05c4d]/40",
              },
            }}
            position="bottom-right"
          />
        </ThemeProvider>
      </body>
    </html>
  );
}
