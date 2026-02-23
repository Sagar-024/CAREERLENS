"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X, ArrowUpRight } from "lucide-react";

export function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-colors duration-300 font-mono text-sm uppercase ${
        scrolled
          ? "bg-black/95 backdrop-blur-md border-b-[1px] border-[#222]"
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
          <div className="w-6 h-6 bg-[#D6FF00] font-sans font-black text-black text-xs flex items-center justify-center -rotate-6 group-hover:rotate-0 transition-transform">
            CL
          </div>
          <span className="font-sans font-bold text-lg tracking-tight text-white group-hover:text-[#D6FF00] transition-colors">
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
              className={`relative py-1 group focus-ring ${
                pathname === link.href
                  ? "text-[#D6FF00]"
                  : "text-[#888] hover:text-white"
              } transition-colors font-medium tracking-tight`}
            >
              {link.label}
              <span
                className={`absolute left-0 bottom-0 h-[1px] bg-[#D6FF00] transition-all duration-300 ${
                  pathname === link.href ? "w-full" : "w-0 group-hover:w-full"
                }`}
              />
            </Link>
          ))}
        </div>

        {/* CTA SECTION */}
        <div className="hidden md:flex items-center gap-6">
          <Link
            href="/upload"
            className="text-[#888] hover:text-white transition-colors focus-ring p-1"
          >
            [ LOG IN ]
          </Link>
          <Link
            href="/upload"
            className="relative px-6 py-2 bg-[#0047FF] text-white font-sans font-bold flex items-center gap-2 overflow-hidden group focus-ring border border-[transparent] hover:border-white transition-colors"
          >
            <span className="relative z-10 group-hover:-translate-y-[120%] transition-transform duration-300">
              UPLOAD RESUME
            </span>
            <span className="absolute inset-0 z-10 flex items-center justify-center translate-y-[120%] group-hover:translate-y-0 transition-transform duration-300 bg-[#D6FF00] text-black gap-2">
              START SCAN <ArrowUpRight className="w-4 h-4" />
            </span>
            {/* Hard shadow embedded natively */}
            <div className="absolute inset-0 shadow-[4px_4px_0_#fff] pointer-events-none group-hover:shadow-[0_0_0_#fff] transition-shadow duration-300" />
          </Link>
        </div>

        {/* MOBILE TOGGLE */}
        <button
          className="md:hidden p-2 text-[#888] hover:text-white focus-ring transition-colors"
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
            className="md:hidden border-t-[1px] border-[#222] bg-black overflow-hidden"
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
                  className={`text-lg font-bold focus-ring ${
                    pathname === link.href ? "text-[#D6FF00]" : "text-white"
                  }`}
                >
                  {link.label}
                </Link>
              ))}
              <div className="w-full h-[1px] bg-[#222] my-2" />
              <Link
                href="/upload"
                onClick={() => setMobileOpen(false)}
                className="w-full py-4 bg-[#0047FF] text-white font-bold text-center border-[1px] border-transparent hover:border-white transition-colors focus-ring flex justify-center items-center gap-2"
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
