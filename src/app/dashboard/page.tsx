"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import {
  ArrowUpRight,
  FileText,
  TrendingUp,
  Clock,
  BarChart3,
} from "lucide-react";

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
  const offset = circ - (score / 100) * circ;

  const color =
    score >= 80
      ? "var(--positive)"
      : score >= 60
        ? "var(--accent)"
        : "var(--negative)";

  return (
    <div className="relative shrink-0" style={{ width: size, height: size }}>
      <svg width={size} height={size} className="-rotate-90">
        <circle
          cx={size / 2}
          cy={size / 2}
          r={r}
          fill="none"
          stroke="var(--border)"
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
}: {
  analysis: Analysis;
  index: number;
}) {
  const date = new Date(analysis.createdAt);
  const timeAgo = getTimeAgo(date);
  const color =
    analysis.finalScore >= 80
      ? "var(--positive)"
      : analysis.finalScore >= 60
        ? "var(--accent)"
        : "var(--negative)";

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{
        duration: 0.4,
        delay: index * 0.05,
        ease: [0.22, 1, 0.36, 1],
      }}
    >
      <Link
        href={`/results/${analysis.id}`}
        className="block focus-ring rounded-2xl"
      >
        <div className="card p-5 group cursor-pointer">
          <div className="flex items-start gap-4">
            {/* Score Ring */}
            <MiniScoreRing score={Math.round(analysis.finalScore)} />

            {/* Details */}
            <div className="flex-1 min-w-0">
              <h3
                className="text-sm font-semibold truncate mb-1 group-hover:text-[var(--accent)] transition-colors"
                style={{ color: "var(--text)" }}
              >
                {analysis.jobTitle || "Untitled Analysis"}
              </h3>
              <div
                className="flex items-center gap-3 text-xs"
                style={{ color: "var(--text-muted)" }}
              >
                <span className="flex items-center gap-1">
                  <Clock className="w-3 h-3 shrink-0" />
                  {timeAgo}
                </span>
                <span className="flex items-center gap-1">
                  <TrendingUp className="w-3 h-3 shrink-0" />
                  {analysis.readinessLabel}
                </span>
              </div>
            </div>

            {/* Arrow */}
            <ArrowUpRight
              className="w-4 h-4 shrink-0 opacity-0 group-hover:opacity-100 transition-opacity mt-1"
              style={{ color: "var(--text-muted)" }}
            />
          </div>

          {/* Stats Bar */}
          <div
            className="mt-4 pt-4 flex items-center gap-4"
            style={{ borderTop: "1px solid var(--border)" }}
          >
            <div className="flex items-center gap-1.5">
              <span
                className="w-1.5 h-1.5 rounded-full shrink-0"
                style={{ background: "var(--positive)" }}
              />
              <span
                className="text-xs tabular-nums"
                style={{ color: "var(--text-body)" }}
              >
                {analysis.matchedCount} matched
              </span>
            </div>
            <div className="flex items-center gap-1.5">
              <span
                className="w-1.5 h-1.5 rounded-full shrink-0"
                style={{ background: "var(--negative)" }}
              />
              <span
                className="text-xs tabular-nums"
                style={{ color: "var(--text-body)" }}
              >
                {analysis.missingCount} missing
              </span>
            </div>
            <div className="flex items-center gap-1.5 ml-auto">
              <span className="text-xs" style={{ color: "var(--text-muted)" }}>
                {analysis.totalCount} total skills
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
          analyses.reduce((sum, a) => sum + a.finalScore, 0) / analyses.length,
        )
      : 0;
  const bestScore =
    analyses.length > 0
      ? Math.round(Math.max(...analyses.map((a) => a.finalScore)))
      : 0;
  const totalAnalyses = analyses.length;

  const stats = [
    {
      label: "Total Scans",
      value: totalAnalyses.toString(),
      color: "var(--text)",
    },
    { label: "Average Score", value: `${avgScore}%`, color: "var(--accent)" },
    { label: "Best Score", value: `${bestScore}%`, color: "var(--positive)" },
  ];

  return (
    <div className="grid grid-cols-3 gap-3 mb-8">
      {stats.map((s) => (
        <div key={s.label} className="card p-4 text-center">
          <div
            className="text-2xl font-bold tabular-nums mb-0.5"
            style={{ color: s.color }}
          >
            {s.value}
          </div>
          <div
            className="text-[10px] font-semibold uppercase tracking-wider"
            style={{ color: "var(--text-muted)" }}
          >
            {s.label}
          </div>
        </div>
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
      <div
        className="w-16 h-16 rounded-2xl flex items-center justify-center mb-6"
        style={{
          background: "var(--accent-dim)",
          border: "1px solid rgba(232,169,70,0.2)",
        }}
      >
        <BarChart3 className="w-7 h-7" style={{ color: "var(--accent)" }} />
      </div>
      <h2 className="text-xl font-bold mb-2" style={{ color: "var(--text)" }}>
        No analyses yet
      </h2>
      <p
        className="text-sm max-w-xs mb-8"
        style={{ color: "var(--text-body)" }}
      >
        Upload your resume and paste a job description to get your first
        readiness score.
      </p>
      <Link href="/upload" className="btn-primary focus-ring">
        Analyze your resume
        <ArrowUpRight className="w-4 h-4 shrink-0" />
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

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/login");
      return;
    }
    if (status === "authenticated") {
      fetch("/api/history")
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
    }
  }, [status, router]);

  if (status === "loading" || loading) {
    return (
      <div
        className="min-h-screen flex items-center justify-center"
        style={{ background: "var(--bg)" }}
      >
        <div className="flex items-center gap-3">
          <div
            className="w-5 h-5 rounded-full border-2 border-t-transparent animate-spin"
            style={{
              borderColor: "var(--accent)",
              borderTopColor: "transparent",
            }}
          />
          <span
            className="text-sm font-medium"
            style={{ color: "var(--text-muted)" }}
          >
            Loading dashboard…
          </span>
        </div>
      </div>
    );
  }

  return (
    <div
      className="min-h-screen pt-8 pb-16 px-4 sm:px-6"
      style={{ background: "var(--bg)" }}
    >
      <div className="max-w-3xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="mb-8"
        >
          <div className="flex items-center justify-between mb-1">
            <h1
              className="text-2xl font-bold tracking-tight"
              style={{ color: "var(--text)" }}
            >
              Dashboard
            </h1>
            <Link href="/upload" className="btn-primary text-xs focus-ring">
              New Analysis
              <ArrowUpRight className="w-3.5 h-3.5 shrink-0" />
            </Link>
          </div>
          <p className="text-sm" style={{ color: "var(--text-muted)" }}>
            {session?.user?.name
              ? `Welcome back, ${session.user.name.split(" ")[0]}`
              : "Your analysis history"}
          </p>
        </motion.div>

        {analyses.length === 0 ? (
          <EmptyState />
        ) : (
          <>
            {/* Stats */}
            <StatsSummary analyses={analyses} />

            {/* Analysis List */}
            <div className="mb-4">
              <p className="section-label mb-4">Recent analyses</p>
            </div>
            <div className="space-y-3">
              {analyses.map((analysis, i) => (
                <AnalysisCard key={analysis.id} analysis={analysis} index={i} />
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
}
