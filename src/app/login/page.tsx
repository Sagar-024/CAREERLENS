"use client";

import { signIn } from "next-auth/react";
import { ArrowRight, Hexagon } from "lucide-react";
import Link from "next/link";
import { useState } from "react";

export default function LoginPage() {
  const [isLoading, setIsLoading] = useState(false);

  const handleGoogleSignIn = async () => {
    setIsLoading(true);
    await signIn("google", { callbackUrl: "/upload" });
  };

  return (
    <div className="min-h-screen w-full flex bg-[#fafafa] dark:bg-[#050505] transition-colors duration-500">
      {/* Left Panel - Branding (Hidden on mobile) */}
      <div className="hidden lg:flex w-1/2 bg-gray-100 dark:bg-black border-r border-gray-200 dark:border-[#222] flex-col justify-between p-12 relative overflow-hidden transition-colors">
        {/* Subtle Background Pattern / Noise */}
        <div className="absolute inset-0 opacity-[0.03] dark:opacity-[0.06] bg-[linear-gradient(#000_1px,transparent_1px),linear-gradient(90deg,#000_1px,transparent_1px)] dark:bg-[linear-gradient(#fff_1px,transparent_1px),linear-gradient(90deg,#fff_1px,transparent_1px)] bg-[size:48px_48px] pointer-events-none" />
        <div className="noise-overlay" />

        {/* Top Logo */}
        <div className="relative z-10">
          <Link
            href="/"
            className="font-mono text-2xl font-black text-gray-900 dark:text-white uppercase tracking-tighter hover:text-[#0047FF] dark:hover:text-[#D6FF00] transition-colors"
          >
            CareerLens
            <span className="text-[#0047FF] dark:text-[#D6FF00]">.AI</span>
          </Link>
        </div>

        {/* Center Quote / Value Prop */}
        <div className="relative z-10 max-w-lg">
          <div className="w-12 h-12 bg-gray-200 dark:bg-[#111] flex items-center justify-center mb-8 border border-gray-300 dark:border-[#333]">
            <Hexagon className="w-6 h-6 text-gray-900 dark:text-white" />
          </div>
          <h2 className="display-title text-5xl text-gray-900 dark:text-white mb-6 leading-[1.1] transition-colors">
            OPTIMIZE YOUR <br />
            CAREER{" "}
            <span className="text-[#0047FF] dark:text-[#D6FF00]">
              TRAJECTORY.
            </span>
          </h2>
          <p className="font-mono text-sm text-gray-600 dark:text-[#888] uppercase leading-relaxed font-bold dark:font-normal transition-colors">
            Join thousands of professionals using algorithmic intelligence to
            bypass ATS filters, benchmark their skills, and secure tier-1
            positions.
          </p>
        </div>

        {/* Bottom Social Proof */}
        <div className="relative z-10 flex items-center gap-4 border-t border-gray-200 dark:border-[#222] pt-8 transition-colors">
          <div className="flex -space-x-3">
            {[1, 2, 3, 4].map((i) => (
              <div
                key={i}
                className="w-10 h-10 rounded-full border-2 border-gray-100 dark:border-black bg-gray-300 dark:bg-[#222] flex items-center justify-center overflow-hidden"
              >
                <img
                  src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${i + 15}`}
                  alt="User"
                  className="w-full h-full object-cover"
                />
              </div>
            ))}
          </div>
          <div className="font-mono text-xs text-gray-500 dark:text-[#666] uppercase font-bold dark:font-normal">
            <span className="text-gray-900 dark:text-white font-black dark:font-bold">
              10,000+
            </span>{" "}
            Data-Driven Users
          </div>
        </div>
      </div>

      {/* Right Panel - Auth Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-6 sm:p-12 relative transition-colors">
        {/* Mobile Logo (Only visible on small screens) */}
        <div className="absolute top-8 left-8 lg:hidden">
          <Link
            href="/"
            className="font-mono text-xl font-black text-gray-900 dark:text-white uppercase tracking-tighter"
          >
            CareerLens
            <span className="text-[#0047FF] dark:text-[#D6FF00]">.AI</span>
          </Link>
        </div>

        <div className="w-full max-w-sm space-y-8">
          <div className="space-y-3">
            <h1 className="font-sans text-3xl font-black text-gray-900 dark:text-white tracking-tight transition-colors">
              Get Started
            </h1>
            <p className="text-gray-500 dark:text-[#888] text-sm font-medium transition-colors">
              Log in or create an account to access the intelligence engine.
            </p>
          </div>

          <div className="space-y-4">
            <button
              onClick={handleGoogleSignIn}
              disabled={isLoading}
              className="relative w-full flex items-center justify-center gap-3 bg-white dark:bg-[#0a0a0a] text-gray-900 dark:text-white border border-gray-300 dark:border-[#333] px-4 py-3.5 font-medium hover:bg-gray-50 dark:hover:bg-[#111] hover:border-gray-400 dark:hover:border-[#555] focus:outline-none focus:ring-2 focus:ring-[#0047FF] dark:focus:ring-[#D6FF00] focus:ring-offset-2 dark:focus:ring-offset-black transition-all disabled:opacity-70 disabled:cursor-not-allowed group shadow-sm active:scale-[0.98]"
            >
              {isLoading ? (
                <div className="w-5 h-5 border-2 border-gray-300 dark:border-[#333] border-t-gray-900 dark:border-t-white rounded-full animate-spin" />
              ) : (
                <>
                  <svg
                    className="w-5 h-5"
                    viewBox="0 0 24 24"
                    fill="currentColor"
                  >
                    <path
                      d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                      fill="#4285F4"
                    />
                    <path
                      d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                      fill="#34A853"
                    />
                    <path
                      d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                      fill="#FBBC05"
                    />
                    <path
                      d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                      fill="#EA4335"
                    />
                  </svg>
                  <span>Continue with Google</span>
                  <ArrowRight className="w-4 h-4 ml-2 opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all absolute right-4" />
                </>
              )}
            </button>

            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t border-gray-200 dark:border-[#222]" />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-[#fafafa] dark:bg-[#050505] px-2 text-gray-500 dark:text-[#666] font-mono font-bold dark:font-normal">
                  Or
                </span>
              </div>
            </div>

            <button
              onClick={() => {
                alert(
                  "Enterprise SSO and Email Magic Links requires an upgraded organization plan. Please continue with Google for personal accounts.",
                );
              }}
              className="w-full flex items-center justify-center gap-3 bg-transparent text-gray-500 dark:text-[#888] border border-gray-200 dark:border-[#222] px-4 py-3.5 font-medium hover:text-gray-900 dark:hover:text-white hover:border-gray-300 dark:hover:border-[#444] shadow-sm transition-colors"
            >
              Continue with Email
            </button>
          </div>

          <p className="text-center text-xs text-gray-500 dark:text-[#666] max-w-xs mx-auto mt-12 transition-colors">
            By clicking continue, you agree to our{" "}
            <Link
              href="/"
              className="underline hover:text-gray-900 dark:hover:text-white transition-colors"
            >
              Terms of Service
            </Link>{" "}
            and{" "}
            <Link
              href="/"
              className="underline hover:text-gray-900 dark:hover:text-white transition-colors"
            >
              Privacy Policy
            </Link>
            .
          </p>
        </div>
      </div>
    </div>
  );
}
