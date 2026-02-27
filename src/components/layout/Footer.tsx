"use client";

import Link from "next/link";

export function Footer() {
  const year = new Date().getFullYear();

  const cols = [
    {
      title: "Product",
      links: [
        { label: "Analyze Resume", href: "/upload" },
        { label: "Dashboard", href: "/dashboard" },
        { label: "Pricing", href: "/#pricing" },
      ],
    },
    {
      title: "Resources",
      links: [
        { label: "How It Works", href: "/#how-it-works" },
        { label: "Features", href: "/#features" },
        { label: "Privacy Policy", href: "#" },
      ],
    },
    {
      title: "Company",
      links: [
        { label: "About", href: "#" },
        { label: "Contact", href: "#" },
        { label: "Terms", href: "#" },
      ],
    },
  ];

  return (
    <footer
      className="border-t py-16"
      style={{ background: "var(--bg)", borderColor: "var(--border)" }}
    >
      <div className="max-w-5xl mx-auto px-6 md:px-10">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-10 mb-14">
          {/* Brand */}
          <div className="col-span-2 md:col-span-1">
            <Link
              href="/"
              className="flex items-center gap-2.5 mb-4 focus-ring rounded-lg w-fit"
            >
              <div
                className="w-7 h-7 rounded-lg flex items-center justify-center text-xs font-bold shrink-0"
                style={{ background: "var(--accent)", color: "#09090b" }}
              >
                CL
              </div>
              <span
                className="font-bold text-[15px] tracking-tight"
                style={{ color: "var(--text)" }}
              >
                CareerLens
              </span>
            </Link>
            <p
              className="text-sm leading-relaxed"
              style={{ color: "var(--text-muted)" }}
            >
              AI-powered resume analysis. Know exactly what to fix.
            </p>
          </div>

          {cols.map((col) => (
            <div key={col.title}>
              <h4 className="section-label mb-4">{col.title}</h4>
              <ul className="space-y-2.5">
                {col.links.map((link) => (
                  <li key={link.label}>
                    <Link
                      href={link.href}
                      className="text-sm transition-colors focus-ring rounded"
                      style={{ color: "var(--text-muted)" }}
                      onMouseEnter={(e) =>
                        (e.currentTarget.style.color = "var(--text)")
                      }
                      onMouseLeave={(e) =>
                        (e.currentTarget.style.color = "var(--text-muted)")
                      }
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="divider mb-6" />
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="text-xs" style={{ color: "var(--text-muted)" }}>
            &copy; {year} CareerLens AI. All rights reserved.
          </p>
          <p className="text-xs" style={{ color: "var(--text-muted)" }}>
            Made with care in India
          </p>
        </div>
      </div>
    </footer>
  );
}
