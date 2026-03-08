"use client";

import { motion } from "framer-motion";

export default function ScoreRing({
  score,
  grade,
}: {
  score: number;
  grade: string;
}) {
  const strokeW = 6;
  const size = 200;
  const r = (size - strokeW * 2) / 2;
  const circ = 2 * Math.PI * r;
  const offset = circ - (Math.max(0, Math.min(score, 100)) / 100) * circ;

  const getColor = () => {
    if (grade.startsWith("A") || score >= 80) return "text-emerald-400";
    if (grade.startsWith("B") || score >= 60) return "text-amber-400";
    return "text-red-400";
  };

  const getGlow = () => {
    if (grade.startsWith("A") || score >= 80)
      return "shadow-[0_0_80px_rgba(16,185,129,0.15)]";
    if (grade.startsWith("B") || score >= 60)
      return "shadow-[0_0_80px_rgba(251,191,36,0.15)]";
    return "shadow-[0_0_80px_rgba(248,113,113,0.15)]";
  };

  const colorClass = getColor();
  const glowClass = getGlow();

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.8, ease: "easeOut" }}
      className={`relative flex items-center justify-center w-[200px] h-[200px] rounded-full bg-black/40 ${glowClass} border border-white/5 backdrop-blur-xl shadow-inner`}
    >
      <svg width={size} height={size} className="-rotate-90 absolute inset-0">
        <circle
          cx={size / 2}
          cy={size / 2}
          r={r}
          fill="none"
          stroke="rgba(255,255,255,0.05)"
          strokeWidth={strokeW}
        />
        <motion.circle
          cx={size / 2}
          cy={size / 2}
          r={r}
          fill="none"
          stroke="currentColor"
          className={colorClass}
          strokeWidth={strokeW}
          strokeLinecap="round"
          strokeDasharray={circ}
          initial={{ strokeDashoffset: circ }}
          animate={{ strokeDashoffset: offset }}
          transition={{ duration: 1.5, ease: [0.22, 1, 0.36, 1], delay: 0.2 }}
        />
      </svg>
      <div className="flex flex-col items-center justify-center">
        <span className={`text-6xl font-light tracking-tight ${colorClass}`}>
          {score}
        </span>
        <span className="text-xs font-medium text-zinc-500 uppercase tracking-widest mt-1">
          Grade {grade}
        </span>
      </div>
    </motion.div>
  );
}
