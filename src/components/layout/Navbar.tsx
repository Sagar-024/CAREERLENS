"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useSession } from "next-auth/react";
import { useTheme } from "next-themes";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X, ArrowUpRight, Sun, Moon } from "lucide-react";

export function Navbar() {
  const { theme, setTheme } = useTheme();
  const { data: session, status } = useSession();
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    setMounted(true);
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-colors duration-300 font-mono text-sm uppercase ${
        scrolled
          ? "bg-white/95 dark:bg-black/95 backdrop-blur-md border-b-[1px] border-gray-200 dark:border-[#222]"
          : "bg-transparent"
      }`}
    >
      <nav className="w-full px-4 md:px-6 h-16 flex items-center justify-between mx-auto max-w-[1400px]">
        {/* LOGO */}
        <Link
          href="/"
          className="flex items-center gap-2 group focus-ring p-1"
          aria-label="CareerLens AI Home"
        >
          <div className="w-6 h-6 bg-[#0047FF] dark:bg-[#D6FF00] font-sans font-black text-white dark:text-black text-xs flex items-center justify-center -rotate-6 group-hover:rotate-0 transition-transform">
            CL
          </div>
          <span className="font-sans font-black dark:font-bold text-lg tracking-tight text-gray-900 dark:text-white group-hover:text-[#0047FF] dark:group-hover:text-[#D6FF00] transition-colors">
            CAREERLENS
          </span>
        </Link>

        {/* DESKTOP NAV */}
        <div className="hidden md:flex items-center gap-8">
          {[
            { href: "/", label: "Home" },
            { href: "/upload", label: "Analyze" },
            { href: "/dashboard", label: "Dashboard" },
            { href: "/#pricing", label: "Pricing" },
          ].map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={`relative py-1 group focus-ring transition-colors tracking-tight font-bold dark:font-medium ${
                pathname === link.href
                  ? "text-[#0047FF] dark:text-[#D6FF00]"
                  : "text-gray-500 hover:text-gray-900 dark:text-[#888] dark:hover:text-white"
              }`}
            >
              {link.label}
              <span
                className={`absolute left-0 bottom-0 h-[1px] bg-[#0047FF] dark:bg-[#D6FF00] transition-all duration-300 ${
                  pathname === link.href ? "w-full" : "w-0 group-hover:w-full"
                }`}
              />
            </Link>
          ))}
        </div>

        {/* CTA SECTION */}
        <div className="hidden md:flex items-center gap-6">
          {/* THEME TOGGLE */}
          <button
            onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
            className="p-2 text-gray-500 hover:text-gray-900 dark:text-[#888] dark:hover:text-white transition-colors focus-ring"
            aria-label="Toggle theme"
          >
            {mounted &&
              (theme === "dark" ? (
                <Sun className="w-5 h-5" />
              ) : (
                <Moon className="w-5 h-5" />
              ))}
          </button>

          {!mounted || status === "loading" ? (
            <div className="w-16 h-4 bg-gray-200 dark:bg-[#222] animate-pulse" />
          ) : status === "authenticated" ? (
            <Link
              href="/dashboard"
              className="text-gray-500 hover:text-[#0047FF] dark:text-[#888] dark:hover:text-[#D6FF00] transition-colors focus-ring p-1 max-w-[160px] truncate font-bold dark:font-normal"
            >
              [ {session?.user?.name?.split(" ")[0]?.toUpperCase() || "PROFILE"}{" "}
              ]
            </Link>
          ) : (
            <Link
              href="/login"
              className="text-gray-500 hover:text-gray-900 dark:text-[#888] dark:hover:text-white transition-colors focus-ring p-1 font-bold dark:font-normal"
            >
              [ LOG IN ]
            </Link>
          )}
          <Link
            href="/upload"
            className="relative px-6 py-2 bg-[#0047FF] text-white font-sans font-bold flex items-center gap-2 overflow-hidden group focus-ring border border-[transparent] hover:border-white transition-colors"
          >
            <span className="relative z-10 group-hover:-translate-y-[120%] transition-transform duration-300">
              UPLOAD RESUME
            </span>
            <span className="absolute inset-0 z-10 flex items-center justify-center translate-y-[120%] group-hover:translate-y-0 transition-transform duration-300 bg-black dark:bg-[#D6FF00] text-white dark:text-black gap-2">
              START SCAN <ArrowUpRight className="w-4 h-4" />
            </span>
            {/* Hard shadow embedded natively */}
            <div className="absolute inset-0 shadow-[4px_4px_0_#000] dark:shadow-[4px_4px_0_#fff] pointer-events-none group-hover:shadow-[0_0_0_#000] dark:group-hover:shadow-[0_0_0_#fff] transition-shadow duration-300" />
          </Link>
        </div>

        {/* MOBILE TOGGLE */}
        <button
          className="md:hidden p-2 text-gray-500 hover:text-gray-900 dark:text-[#888] dark:hover:text-white focus-ring transition-colors"
          onClick={() => setMobileOpen(!mobileOpen)}
          aria-expanded={mobileOpen}
          aria-label={mobileOpen ? "Close menu" : "Open menu"}
        >
          {mobileOpen ? (
            <X className="w-6 h-6" />
          ) : (
            <Menu className="w-6 h-6" />
          )}
        </button>
      </nav>

      {/* MOBILE MENU */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ height: 0 }}
            animate={{ height: "auto" }}
            exit={{ height: 0 }}
            className="md:hidden border-t-[1px] border-gray-200 dark:border-[#222] bg-white dark:bg-black overflow-hidden"
          >
            <div className="flex flex-col px-4 py-6 gap-6">
              {[
                { href: "/", label: "Home" },
                { href: "/upload", label: "Analyze" },
                { href: "/dashboard", label: "Dashboard" },
                { href: "/#pricing", label: "Pricing" },
              ].map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setMobileOpen(false)}
                  className={`text-lg font-black dark:font-bold focus-ring ${
                    pathname === link.href
                      ? "text-[#0047FF] dark:text-[#D6FF00]"
                      : "text-gray-900 dark:text-white"
                  }`}
                >
                  {link.label}
                </Link>
              ))}

              <div className="flex items-center justify-between py-2 text-gray-900 dark:text-white font-bold">
                <span>Theme</span>
                <button
                  onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
                  className="p-2 border border-gray-200 dark:border-[#333] rounded-md focus-ring"
                >
                  {mounted &&
                    (theme === "dark" ? (
                      <Sun className="w-5 h-5 text-[#D6FF00]" />
                    ) : (
                      <Moon className="w-5 h-5 text-[#0047FF]" />
                    ))}
                </button>
              </div>

              <div className="w-full h-[1px] bg-gray-200 dark:bg-[#222] my-2" />

              <Link
                href="/upload"
                onClick={() => setMobileOpen(false)}
                className="w-full py-4 bg-[#0047FF] dark:bg-[#D6FF00] text-white dark:text-black font-black dark:font-bold text-center border-[1px] border-transparent hover:border-gray-900 dark:hover:border-white transition-colors focus-ring flex justify-center items-center gap-2"
              >
                UPLOAD RESUME <ArrowUpRight className="w-4 h-4" />
              </Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
