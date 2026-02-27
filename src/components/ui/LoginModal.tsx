"use client";

import { signIn } from "next-auth/react";
import { useState } from "react";

interface LoginModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function LoginModal({ isOpen, onClose }: LoginModalProps) {
  const [loading, setLoading] = useState(false);

  if (!isOpen) return null;

  const handleGoogleSignIn = async () => {
    setLoading(true);
    await signIn("google", { callbackUrl: "/upload" });
  };

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center"
      style={{ backgroundColor: "rgba(0,0,0,0.8)" }}
      onClick={onClose}
    >
      <div
        className="bg-gray-900 border border-gray-700 rounded-2xl p-8 max-w-md w-full mx-4"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-bold text-white">
            Start analyzing for free
          </h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-white text-2xl"
          >
            ×
          </button>
        </div>

        <p className="text-gray-400 mb-6">
          Sign in with Google — no credit card needed
        </p>

        <button
          onClick={handleGoogleSignIn}
          disabled={loading}
          className="w-full bg-white text-gray-900 font-semibold py-3 px-6 rounded-xl hover:bg-gray-100 transition flex items-center justify-center gap-3"
        >
          {loading ? "Signing in..." : "Continue with Google"}
        </button>

        <p className="text-gray-500 text-sm mt-4 text-center">
          Free plan — 2 analyses per month
        </p>
      </div>
    </div>
  );
}
