"use client";

import { signIn } from "next-auth/react";
import { LogIn } from "lucide-react";

export default function LoginPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-[#fafafa] dark:bg-[#000] p-4 transition-colors duration-500">
      <div className="w-full max-w-md brutalist-card p-12">
        <div className="flex justify-center mb-8">
          <div className="w-16 h-16 bg-[#0047FF] dark:bg-[#D6FF00] border-2 border-[#0047FF] dark:border-transparent flex items-center justify-center rotate-3 hover:rotate-6 transition-transform shadow-[4px_4px_0_rgba(0,0,0,0.1)] dark:shadow-none">
            <LogIn className="w-8 h-8 text-white dark:text-black" />
          </div>
        </div>

        <div className="text-center space-y-4 mb-10">
          <h1 className="display-title text-3xl text-gray-900 dark:text-white transition-colors">
            SYSTEM AUTH
          </h1>
          <p className="font-mono text-sm text-gray-500 dark:text-[#888] uppercase font-bold dark:font-normal transition-colors">
            Identify yourself to continue.
          </p>
        </div>

        <button
          onClick={() => signIn("google", { callbackUrl: "/upload" })}
          className="w-full flex justify-center py-4 px-4 border-2 border-gray-200 dark:border-[#222] bg-white dark:bg-black font-bold uppercase text-gray-900 dark:text-white hover:bg-[#0047FF] dark:hover:bg-[#FF2A00] hover:text-white dark:hover:text-black hover:border-transparent focus-ring transition-colors"
        >
          [ AUTHENTICATE VIA GOOGLE ]
        </button>
      </div>
    </div>
  );
}
