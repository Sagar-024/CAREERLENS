"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useSession } from "next-auth/react";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X, ArrowUpRight } from "lucide-react";

export function Navbar() {
  const { data: session, status } = useSession();
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 16);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const navLinks = [
    { href: "/", label: "Home" },
    { href: "/upload", label: "Analyze" },
    { href: "/dashboard", label: "Dashboard" },
    { href: "/#pricing", label: "Pricing" },
  ];

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled ? "backdrop-blur-xl border-b" : ""
      }`}
      style={{
        background: scrolled ? "rgba(9, 9, 11, 0.85)" : "transparent",
        borderColor: scrolled ? "var(--border)" : "transparent",
      }}
    >
      <nav className="max-w-6xl mx-auto px-6 md:px-10 h-16 flex items-center justify-between">
        {/* Logo */}
        <Link
          href="/"
          className="flex items-center gap-2.5 focus-ring rounded-lg"
          aria-label="CareerLens AI Home"
        >
          <div
            className="w-8 h-8 rounded-lg flex items-center justify-center text-xs font-bold shrink-0"
            style={{ background: "var(--accent)", color: "#09090b" }}
          >
            CL
          </div>
          <span
            className="font-bold text-base tracking-tight"
            style={{ color: "var(--text)" }}
          >
            CareerLens
          </span>
        </Link>

        {/* Desktop Nav */}
        <div className="hidden md:flex items-center gap-0.5">
          {navLinks.map((link) => {
            const active = pathname === link.href;
            return (
              <Link
                key={link.href}
                href={link.href}
                className="relative px-3.5 py-2 rounded-lg text-[13px] font-medium transition-colors focus-ring"
                style={{
                  color: active ? "var(--text)" : "var(--text-muted)",
                }}
              >
                {link.label}
                {active && (
                  <motion.div
                    layoutId="nav-active"
                    className="absolute inset-0 rounded-lg -z-10"
                    style={{ background: "var(--bg-elevated)" }}
                    transition={{ type: "spring", stiffness: 300, damping: 30 }}
                  />
                )}
              </Link>
            );
          })}
        </div>

        {/* Right Side */}
        <div className="hidden md:flex items-center gap-4">
          {status === "authenticated" ? (
            <Link
              href="/dashboard"
              className="text-[13px] font-medium transition-colors focus-ring px-2 py-1 rounded-lg"
              style={{ color: "var(--text-muted)" }}
              onMouseEnter={(e) =>
                (e.currentTarget.style.color = "var(--text)")
              }
              onMouseLeave={(e) =>
                (e.currentTarget.style.color = "var(--text-muted)")
              }
            >
              {session?.user?.name?.split(" ")[0] || "Account"}
            </Link>
          ) : (
            <Link
              href="/login"
              className="text-[13px] font-medium transition-colors focus-ring px-2 py-1 rounded-lg"
              style={{ color: "var(--text-muted)" }}
              onMouseEnter={(e) =>
                (e.currentTarget.style.color = "var(--text)")
              }
              onMouseLeave={(e) =>
                (e.currentTarget.style.color = "var(--text-muted)")
              }
            >
              Sign in
            </Link>
          )}

          <Link href="/upload" className="btn-primary focus-ring">
            Analyze Resume
            <ArrowUpRight className="w-3.5 h-3.5 shrink-0" />
          </Link>
        </div>

        {/* Mobile Toggle */}
        <button
          className="md:hidden p-2 rounded-lg transition-colors focus-ring"
          style={{ color: "var(--text-muted)" }}
          onClick={() => setMobileOpen(!mobileOpen)}
          aria-expanded={mobileOpen}
          aria-label={mobileOpen ? "Close menu" : "Open menu"}
          onMouseEnter={(e) => {
            e.currentTarget.style.color = "var(--text)";
            e.currentTarget.style.background = "var(--bg-elevated)";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.color = "var(--text-muted)";
            e.currentTarget.style.background = "transparent";
          }}
        >
          {mobileOpen ? (
            <X className="w-5 h-5" />
          ) : (
            <Menu className="w-5 h-5" />
          )}
        </button>
      </nav>

      {/* Mobile Menu */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.2, ease: [0.22, 1, 0.36, 1] }}
            className="md:hidden overflow-hidden border-t"
            style={{
              background: "var(--bg-card)",
              borderColor: "var(--border)",
              boxShadow: "0 16px 48px rgba(0,0,0,0.5)",
            }}
          >
            <div className="flex flex-col px-6 py-5 gap-1">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setMobileOpen(false)}
                  className="px-3 py-3 rounded-lg text-sm font-medium transition-colors focus-ring"
                  style={{
                    color:
                      pathname === link.href
                        ? "var(--text)"
                        : "var(--text-muted)",
                    background:
                      pathname === link.href
                        ? "var(--bg-elevated)"
                        : "transparent",
                  }}
                >
                  {link.label}
                </Link>
              ))}
              <div className="divider my-3" />
              <Link
                href="/upload"
                onClick={() => setMobileOpen(false)}
                className="btn-primary w-full focus-ring"
              >
                Analyze Resume
                <ArrowUpRight className="w-3.5 h-3.5 shrink-0" />
              </Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
