import Link from "next/link";
import { ArrowUpRight, Twitter, Github, Linkedin, Heart } from "lucide-react";

export function Footer() {
  return (
    <footer className="bg-gray-100 dark:bg-black border-t border-gray-200 dark:border-[#222] py-16 transition-colors duration-500">
      <div className="w-full max-w-[1400px] mx-auto px-4 md:px-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 md:gap-8 border-b-2 border-gray-200 dark:border-[#222] pb-16 mb-16 transition-colors">
          <div className="md:col-span-1">
            <Link
              href="/"
              className="font-mono text-xl font-black text-gray-900 dark:text-white uppercase tracking-tighter hover:text-[#0047FF] dark:hover:text-[#D6FF00] transition-colors focus-ring inline-block mb-4"
            >
              CareerLens.AI
            </Link>
            <p className="font-mono text-sm text-gray-500 dark:text-[#888] mb-6 max-w-xs font-bold dark:font-normal transition-colors">
              Advanced semantic intelligence for career positioning.
            </p>
            <div className="flex gap-4">
              <a
                href="#"
                className="w-10 h-10 border-2 border-gray-200 dark:border-[#222] flex items-center justify-center text-gray-600 dark:text-white hover:text-white dark:hover:text-black hover:bg-[#0047FF] dark:hover:bg-[#D6FF00] hover:border-[#0047FF] dark:hover:border-transparent transition-colors focus-ring"
              >
                <Twitter className="w-4 h-4" />
              </a>
              <a
                href="#"
                className="w-10 h-10 border-2 border-gray-200 dark:border-[#222] flex items-center justify-center text-gray-600 dark:text-white hover:text-white dark:hover:text-black hover:bg-[#0047FF] dark:hover:bg-[#D6FF00] hover:border-[#0047FF] dark:hover:border-transparent transition-colors focus-ring"
              >
                <Github className="w-4 h-4" />
              </a>
              <a
                href="#"
                className="w-10 h-10 border-2 border-gray-200 dark:border-[#222] flex items-center justify-center text-gray-600 dark:text-white hover:text-white dark:hover:text-black hover:bg-[#0047FF] dark:hover:bg-[#D6FF00] hover:border-[#0047FF] dark:hover:border-transparent transition-colors focus-ring"
              >
                <Linkedin className="w-4 h-4" />
              </a>
            </div>
          </div>

          <div className="md:col-span-1 border-gray-200 dark:border-[#222] transition-colors">
            <h4 className="font-mono text-xs font-black dark:font-bold text-gray-900 dark:text-white uppercase tracking-widest mb-6 transition-colors">
              Platform
            </h4>
            <ul className="space-y-4">
              <li>
                <Link
                  href="/upload"
                  className="font-mono text-sm text-gray-500 dark:text-[#888] font-bold dark:font-normal hover:text-[#0047FF] dark:hover:text-[#D6FF00] transition-colors focus-ring"
                >
                  Analysis Engine
                </Link>
              </li>
              <li>
                <Link
                  href="/pricing"
                  className="font-mono text-sm text-gray-500 dark:text-[#888] font-bold dark:font-normal hover:text-[#0047FF] dark:hover:text-[#D6FF00] transition-colors focus-ring"
                >
                  Pricing
                </Link>
              </li>
              <li>
                <Link
                  href="#"
                  className="font-mono text-sm text-gray-500 dark:text-[#888] font-bold dark:font-normal hover:text-[#0047FF] dark:hover:text-[#D6FF00] transition-colors focus-ring"
                >
                  Enterprise API
                </Link>
              </li>
            </ul>
          </div>

          <div className="md:col-span-1 border-gray-200 dark:border-[#222] transition-colors">
            <h4 className="font-mono text-xs font-black dark:font-bold text-gray-900 dark:text-white uppercase tracking-widest mb-6 transition-colors">
              Resources
            </h4>
            <ul className="space-y-4">
              <li>
                <Link
                  href="#"
                  className="font-mono text-sm text-gray-500 dark:text-[#888] font-bold dark:font-normal hover:text-[#0047FF] dark:hover:text-[#D6FF00] transition-colors focus-ring"
                >
                  Documentation
                </Link>
              </li>
              <li>
                <Link
                  href="#"
                  className="font-mono text-sm text-gray-500 dark:text-[#888] font-bold dark:font-normal hover:text-[#0047FF] dark:hover:text-[#D6FF00] transition-colors focus-ring"
                >
                  Case Studies
                </Link>
              </li>
              <li>
                <Link
                  href="#"
                  className="font-mono text-sm text-gray-500 dark:text-[#888] font-bold dark:font-normal hover:text-[#0047FF] dark:hover:text-[#D6FF00] transition-colors focus-ring"
                >
                  Data Privacy
                </Link>
              </li>
            </ul>
          </div>

          <div className="md:col-span-1">
            <div className="p-6 border-2 border-gray-200 dark:border-[#222] bg-white dark:bg-[#050505] transition-colors">
              <h4 className="font-mono text-xs font-black dark:font-bold text-gray-900 dark:text-white uppercase tracking-widest mb-4 transition-colors">
                System Status
              </h4>
              <div className="flex items-center gap-3">
                <div className="w-2.5 h-2.5 rounded-full bg-[#0047FF] dark:bg-[#D6FF00] animate-pulse transition-colors" />
                <span className="font-mono text-xs text-[#0047FF] dark:text-[#D6FF00] font-bold dark:font-normal transition-colors">
                  ALL SYSTEMS NOMINAL
                </span>
              </div>
            </div>
          </div>
        </div>

        <div className="flex flex-col md:flex-row justify-between items-center gap-6">
          <p className="font-mono text-xs font-bold dark:font-normal text-gray-500 dark:text-[#666] uppercase transition-colors">
            &copy; {new Date().getFullYear()} CareerLens.AI.
          </p>
          <div className="flex items-center gap-4 font-mono text-xs font-bold dark:font-normal text-gray-500 dark:text-[#666] uppercase transition-colors">
            <Link
              href="/"
              className="hover:text-gray-900 dark:hover:text-white transition-colors focus-ring"
            >
              Privacy Policy
            </Link>
            <Link
              href="/"
              className="hover:text-gray-900 dark:hover:text-white transition-colors focus-ring"
            >
              Terms of Service
            </Link>
            <span className="flex items-center gap-2 ml-4">
              Made with <Heart className="w-3 h-3 text-[#FF2A00]" /> in India
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
}
