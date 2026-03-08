"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import {
  ArrowUpRight,
  TrendingUp,
  Clock,
  BarChart3,
  Trash2,
  Loader2,
} from "lucide-react";
import { toast } from "sonner";

/* ─── Types ─── */
interface Analysis {
  id: string;
  finalScore: number;
  readinessLabel: string;
  matchedCount: number;
  missingCount: number;
  totalCount: number;
  jobTitle: string;
  createdAt: string;
}

/* ─── Score Ring (small version for cards) ─── */
function MiniScoreRing({ score, size = 48 }: { score: number; size?: number }) {
  const strokeW = 3;
  const r = (size - strokeW * 2) / 2;
  const circ = 2 * Math.PI * r;
  const offset = circ - (Math.max(0, Math.min(score, 100)) / 100) * circ;

  const color =
    score >= 80
      ? "#34d399" // emerald-400
      : score >= 60
        ? "#fbbf24" // amber-400
        : "#f87171"; // red-400

  return (
    <div className="relative shrink-0" style={{ width: size, height: size }}>
      <svg width={size} height={size} className="-rotate-90">
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
          stroke={color}
          strokeWidth={strokeW}
          strokeLinecap="round"
          strokeDasharray={circ}
          initial={{ strokeDashoffset: circ }}
          animate={{ strokeDashoffset: offset }}
          transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}
        />
      </svg>
      <div className="absolute inset-0 flex items-center justify-center">
        <span className="text-xs font-bold tabular-nums" style={{ color }}>
          {score}%
        </span>
      </div>
    </div>
  );
}

/* ─── Analysis Card ─── */
function AnalysisCard({
  analysis,
  index,
  onDelete,
}: {
  analysis: Analysis;
  index: number;
  onDelete: (id: string) => Promise<void>;
}) {
  const router = useRouter();
  const [isDeleting, setIsDeleting] = useState(false);
  const date = new Date(analysis.createdAt);
  const timeAgo = getTimeAgo(date);

  const handleDelete = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    if (confirm("Are you sure you want to delete this analysis?")) {
      setIsDeleting(true);
      await onDelete(analysis.id);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.95 }}
      transition={{
        duration: 0.4,
        delay: index * 0.05,
        ease: [0.22, 1, 0.36, 1],
      }}
    >
      <Link href={`/results/${analysis.id}`} className="block">
        <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl p-5 group hover:bg-white/10 hover:border-white/20 transition-all cursor-pointer relative overflow-hidden shadow-lg hover:shadow-2xl">
          <div className="absolute top-4 right-4 z-10">
            <button
              onClick={handleDelete}
              disabled={isDeleting}
              className="p-2 rounded-full hover:bg-red-500/20 text-zinc-500 hover:text-red-400 transition-colors"
              title="Delete Analysis"
            >
              {isDeleting ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <Trash2 className="w-4 h-4" />
              )}
            </button>
          </div>

          <div className="flex items-start gap-4 pr-10">
            {/* Score Ring */}
            <MiniScoreRing score={Math.round(analysis.finalScore || 0)} />

            {/* Details */}
            <div className="flex-1 min-w-0">
              <h3 className="text-sm font-semibold truncate mb-1 text-zinc-100 group-hover:text-white transition-colors">
                {analysis.jobTitle || "Target Role Analysis"}
              </h3>
              <div className="flex items-center gap-3 text-xs text-zinc-500 font-light">
                <span className="flex items-center gap-1">
                  <Clock className="w-3 h-3 shrink-0" />
                  {timeAgo}
                </span>
                <span className="flex items-center gap-1 font-medium text-zinc-400">
                  <TrendingUp className="w-3 h-3 shrink-0" />
                  Grade {analysis.readinessLabel || "C"}
                </span>
              </div>
            </div>
          </div>

          {/* Stats Bar */}
          <div className="mt-5 pt-4 flex items-center gap-5 border-t border-white/5">
            <div className="flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full shrink-0 bg-emerald-400 shadow-[0_0_8px_rgba(52,211,153,0.5)]" />
              <span className="text-xs font-light text-zinc-400">
                <strong className="font-medium text-emerald-400">
                  {analysis.matchedCount || 0}
                </strong>{" "}
                matched
              </span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full shrink-0 bg-red-400 shadow-[0_0_8px_rgba(248,113,113,0.5)]" />
              <span className="text-xs font-light text-zinc-400">
                <strong className="font-medium text-red-400">
                  {analysis.missingCount || 0}
                </strong>{" "}
                missing
              </span>
            </div>
            <div className="flex items-center gap-1.5 ml-auto">
              <span className="text-xs font-light text-zinc-500 flex items-center gap-1">
                View Report{" "}
                <ArrowUpRight className="w-3 h-3 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
              </span>
            </div>
          </div>
        </div>
      </Link>
    </motion.div>
  );
}

/* ─── Time Ago ─── */
function getTimeAgo(date: Date): string {
  if (isNaN(date.getTime())) return "Recently";
  const now = new Date();
  const diff = now.getTime() - date.getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return "Just now";
  if (mins < 60) return `${mins}m ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs}h ago`;
  const days = Math.floor(hrs / 24);
  if (days < 7) return `${days}d ago`;
  return date.toLocaleDateString("en-US", { month: "short", day: "numeric" });
}

/* ─── Stats Summary ─── */
function StatsSummary({ analyses }: { analyses: Analysis[] }) {
  const avgScore =
    analyses.length > 0
      ? Math.round(
          analyses.reduce((sum, a) => sum + (a.finalScore || 0), 0) /
            analyses.length,
        )
      : 0;
  const bestScore =
    analyses.length > 0
      ? Math.round(Math.max(...analyses.map((a) => a.finalScore || 0)))
      : 0;
  const totalAnalyses = analyses.length;

  const stats = [
    {
      label: "Total Parses",
      value: totalAnalyses.toString(),
      color: "text-zinc-100",
    },
    { label: "Avg Readiness", value: `${avgScore}%`, color: "text-blue-400" },
    { label: "Top Score", value: `${bestScore}%`, color: "text-emerald-400" },
  ];

  return (
    <div className="grid grid-cols-3 gap-4 mb-10">
      {stats.map((s, idx) => (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: idx * 0.1 }}
          key={s.label}
          className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl p-5 text-center shadow-lg"
        >
          <div
            className={`text-3xl font-light tracking-tight tabular-nums mb-1 ${s.color}`}
          >
            {s.value}
          </div>
          <div className="text-[10px] font-medium uppercase tracking-widest text-zinc-500">
            {s.label}
          </div>
        </motion.div>
      ))}
    </div>
  );
}

/* ─── Empty State ─── */
function EmptyState() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="flex flex-col items-center justify-center py-20 text-center"
    >
      <div className="w-20 h-20 rounded-3xl bg-white/5 border border-white/10 flex items-center justify-center mb-6 shadow-2xl">
        <BarChart3 className="w-8 h-8 text-zinc-400" />
      </div>
      <h2 className="text-2xl font-medium tracking-tight text-white mb-2">
        No intelligence reports
      </h2>
      <p className="text-sm max-w-sm mb-10 text-zinc-400 font-light text-balance">
        Run your first analysis to see semantic matching reports and SHAP impact
        metrics.
      </p>
      <Link
        href="/upload"
        className="flex items-center gap-2 px-8 py-4 bg-zinc-100 text-zinc-900 rounded-full font-medium hover:bg-white transition-all shadow-[0_0_30px_rgba(255,255,255,0.1)] hover:shadow-[0_0_40px_rgba(255,255,255,0.2)] active:scale-95"
      >
        Run AI Engine
        <ArrowUpRight className="w-4 h-4" />
      </Link>
    </motion.div>
  );
}

/* ─── PAGE ─── */
export default function DashboardPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [analyses, setAnalyses] = useState<Analysis[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchAnalyses = () => {
    fetch("/api/history", { cache: "no-store" })
      .then((res) => {
        if (!res.ok) throw new Error("Failed to fetch");
        return res.json();
      })
      .then((data) => {
        setAnalyses(data.analyses || []);
        setLoading(false);
      })
      .catch(() => {
        setLoading(false);
      });
  };

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/login");
      return;
    }
    if (status === "authenticated") {
      fetchAnalyses();
    }
  }, [status, router]);

  const handleDelete = async (id: string) => {
    try {
      const res = await fetch(`/api/analyze/${id}`, {
        method: "DELETE",
      });
      if (!res.ok) throw new Error("Failed to delete");

      toast.success("Analysis deleted");
      // Instantly remove from UI
      setAnalyses((prev) => prev.filter((a) => a.id !== id));
      router.refresh();
    } catch (err: any) {
      toast.error(err.message || "Failed to delete analysis");
    }
  };

  if (status === "loading" || loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-zinc-900 via-[#0a0a0a] to-black flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="w-10 h-10 border-2 border-white/10 border-t-white/60 rounded-full animate-spin" />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-zinc-900 via-[#0a0a0a] to-black pt-12 pb-24 px-4 sm:px-6 selection:bg-white/20">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="mb-10 flex flex-col md:flex-row md:items-end justify-between gap-6"
        >
          <div>
            <h1 className="text-3xl md:text-4xl font-medium tracking-tight text-white mb-2">
              Command Center
            </h1>
            <p className="text-zinc-400 font-light">
              {session?.user?.name
                ? `Welcome back, ${session.user.name.split(" ")[0]}. Here is your intelligence history.`
                : "Your intelligence history overview."}
            </p>
          </div>

          <Link
            href="/upload"
            className="flex items-center justify-center gap-2 px-6 py-3 bg-white/5 border border-white/10 hover:bg-white/10 text-zinc-100 rounded-full font-medium transition-colors text-sm"
          >
            New Analysis Engine
            <ArrowUpRight className="w-4 h-4 text-zinc-400" />
          </Link>
        </motion.div>

        {analyses.length === 0 ? (
          <EmptyState />
        ) : (
          <>
            <StatsSummary analyses={analyses} />

            <div className="mb-6">
              <h2 className="text-xl font-medium text-white tracking-tight">
                Intelligence Ledger
              </h2>
            </div>

            <div className="space-y-4">
              <AnimatePresence>
                {analyses.map((analysis, i) => (
                  <AnalysisCard
                    key={analysis.id}
                    analysis={analysis}
                    index={i}
                    onDelete={handleDelete}
                  />
                ))}
              </AnimatePresence>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
