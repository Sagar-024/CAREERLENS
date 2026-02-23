import Link from "next/link";
import { ArrowUpRight } from "lucide-react";

export function Footer() {
  return (
    <footer className="border-t-[1px] border-[#222] bg-black font-mono overflow-hidden">
      <div className="w-full mx-auto max-w-[1400px] px-4 md:px-6 py-12 md:py-20 flex flex-col md:flex-row justify-between items-start gap-12">
        {/* BIG LOGO MARK */}
        <div className="space-y-6 max-w-sm">
          <div className="font-sans font-black text-4xl leading-none text-white tracking-tighter hover:text-[#D6FF00] transition-colors cursor-default">
            CAREERLENS
            <br />
            <span
              className="text-transparent"
              style={{ WebkitTextStroke: "1px #D6FF00" }}
            >
              INTELLIGENCE
            </span>
          </div>
          <p className="text-[#888] text-sm leading-relaxed font-sans">
            Algorithmically decode your resume. Optimize for ATS tracking
            systems. Secure your next big role.
          </p>
        </div>

        {/* BRUTALIST GRID LINKS */}
        <div className="grid grid-cols-2 md:grid-cols-3 gap-8 md:gap-16">
          <div className="flex flex-col gap-3">
            <span className="text-[#D6FF00] text-xs font-bold mb-2">
              [ PRODUCT ]
            </span>
            {["Upload", "Dashboard", "Pricing", "Changelog"].map((l) => (
              <Link
                key={l}
                href="/"
                className="text-white hover:text-[#0047FF] text-sm uppercase focus-ring inline-block w-fit transition-colors"
              >
                {l}
              </Link>
            ))}
          </div>
          <div className="flex flex-col gap-3">
            <span className="text-[#0047FF] text-xs font-bold mb-2">
              [ COMPANY ]
            </span>
            {["About", "Team", "Blog", "Careers"].map((l) => (
              <Link
                key={l}
                href="/"
                className="text-white hover:text-[#D6FF00] text-sm uppercase focus-ring inline-block w-fit transition-colors"
              >
                {l}
              </Link>
            ))}
          </div>
          <div className="flex flex-col gap-3 col-span-2 md:col-span-1">
            <span className="text-[#F3F3F3] text-xs font-bold mb-2">
              [ SOCIALS ]
            </span>
            {["X.com", "LinkedIn", "GitHub"].map((l) => (
              <a
                key={l}
                href="#"
                className="text-[#888] hover:text-white text-sm uppercase focus-ring inline-flex items-center gap-1 w-fit transition-colors group"
              >
                {l}
                <ArrowUpRight className="w-3 h-3 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
              </a>
            ))}
          </div>
        </div>
      </div>

      {/* CONTINUOUS MARQUEE BAR */}
      <div className="w-full border-t-[1px] border-b-[1px] border-[#222] bg-[#0a0a0a] py-3 overflow-hidden flex whitespace-nowrap text-[#D6FF00] text-xs font-bold tracking-widest gap-8">
        <div className="marquee-track flex gap-8 whitespace-nowrap items-center">
          {Array(8)
            .fill("SYSTEMATIC ANALYSIS • ALGORITHMIC EDGE •")
            .map((tx, i) => (
              <span key={i}>{tx}</span>
            ))}
        </div>
      </div>

      <div className="w-full mx-auto max-w-[1400px] px-4 md:px-6 py-6 flex flex-col md:flex-row items-center justify-between text-xs text-[#666] uppercase tracking-wider text-center md:text-left">
        <span>
          © {new Date().getFullYear()} CareerLens. Base level intelligence.
        </span>
        <div className="flex gap-4 mt-4 md:mt-0">
          <Link
            href="/"
            className="hover:text-white focus-ring transition-colors"
          >
            Privacy Policy
          </Link>
          <Link
            href="/"
            className="hover:text-white focus-ring transition-colors"
          >
            Terms of Service
          </Link>
        </div>
      </div>
    </footer>
  );
}
