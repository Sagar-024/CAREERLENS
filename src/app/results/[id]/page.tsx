import { PrismaClient } from "@prisma/client";
import { notFound, redirect } from "next/navigation";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import ScoreRing from "@/components/ui/ScoreRing";
import SBERTRadarChart from "@/components/ui/SBERTRadarChart";
import SHAPInsightDeck from "@/components/ui/SHAPInsightDeck";
import CourseRecommendations from "@/components/ui/CourseRecommendations";

const prisma = new PrismaClient();

export const dynamic = "force-dynamic";
export const revalidate = 0;

export default async function ResultsPage({
  params,
}: {
  params: { id: string };
}) {
  const session = await getServerSession(authOptions);

  if (!session?.user?.email) {
    redirect("/login");
  }

  const { id } = await params;

  const data = await prisma.analysis.findUnique({
    where: { id },
  });

  if (!data) {
    notFound();
  }

  if (data.status === "FAILED") {
    return (
      <div className="min-h-screen bg-gradient-to-br from-zinc-900 via-[#0a0a0a] to-black text-zinc-100 flex items-center justify-center p-6">
        <div className="bg-white/5 backdrop-blur-2xl border border-red-500/20 rounded-[2.5rem] p-10 max-w-md text-center shadow-2xl">
          <h2 className="text-3xl font-medium text-red-400 mb-3 tracking-tight">
            Analysis Failed
          </h2>
          <p className="text-zinc-500 text-sm mb-8 font-light text-balance">
            The AI engine was unable to extract SBERT embeddings from this
            document or the job description.
          </p>
          <Link
            href="/upload"
            className="px-8 py-3 bg-white/5 border border-white/10 hover:bg-white/10 rounded-full transition-colors text-sm font-medium"
          >
            Return to Upload
          </Link>
        </div>
      </div>
    );
  }

  if (data.status !== "COMPLETED") {
    // Elegant fallback skeleton if page is loaded while processing
    return (
      <div className="min-h-screen bg-gradient-to-br from-zinc-900 via-[#0a0a0a] to-black text-zinc-100 flex items-center justify-center p-6">
        <div className="flex flex-col items-center gap-6">
          <div className="w-12 h-12 rounded-full border-2 border-white/10 border-t-white/60 animate-spin"></div>
          <p className="text-zinc-400 font-light tracking-wide">
            Retrieving Insights...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-zinc-900 via-[#0a0a0a] to-black text-zinc-100 pt-10 pb-24 px-4 sm:px-6 md:px-8 selection:bg-white/20">
      <div className="max-w-6xl mx-auto space-y-8">
        {/* Navigation & Header */}
        <div className="flex items-center justify-between mb-2">
          <Link
            href="/dashboard"
            className="flex items-center gap-2 text-zinc-500 hover:text-white transition-colors text-sm group"
          >
            <div className="p-2 rounded-full bg-white/5 group-hover:bg-white/10 transition-colors border border-transparent group-hover:border-white/10">
              <ArrowLeft className="w-4 h-4" />
            </div>
            <span className="font-light">Dashboard</span>
          </Link>
          <div className="px-4 py-1.5 bg-white/5 border border-white/10 rounded-full text-[10px] text-zinc-400 font-mono tracking-widest uppercase flex items-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
            SBERT Pipeline Active
          </div>
        </div>

        {/* Top Grid: Score & Radar */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Score Card */}
          <div className="lg:col-span-1 bg-white/5 backdrop-blur-3xl border border-white/10 rounded-[2.5rem] p-10 flex flex-col items-center justify-center shadow-2xl relative overflow-hidden group">
            <div className="absolute inset-0 bg-gradient-to-b from-white/[0.04] to-transparent pointer-events-none"></div>

            <h2 className="text-xl font-medium tracking-tight text-white mb-10 z-10 w-full text-center">
              Readiness Match
            </h2>

            <div className="z-10 mb-10">
              <ScoreRing
                score={data.finalScore ?? 0}
                grade={data.readinessLabel ?? "C"}
              />
            </div>

            <div className="w-full flex justify-between items-center px-4 pt-8 border-t border-white/10 z-10">
              <div className="flex flex-col items-start">
                <span className="text-emerald-400 font-medium text-2xl">
                  {data.matchedCount ?? 0}
                </span>
                <span className="text-zinc-500 text-[10px] uppercase tracking-widest mt-1">
                  Matched
                </span>
              </div>
              <div className="h-10 w-px bg-white/10"></div>
              <div className="flex flex-col items-end">
                <span className="text-red-400 font-medium text-2xl">
                  {data.missingCount ?? 0}
                </span>
                <span className="text-zinc-500 text-[10px] uppercase tracking-widest mt-1">
                  Missing
                </span>
              </div>
            </div>
          </div>

          {/* Radar Chart Card */}
          <div className="lg:col-span-2 bg-white/5 backdrop-blur-3xl border border-white/10 rounded-[2.5rem] p-8 md:p-10 shadow-2xl relative flex flex-col">
            <div className="flex flex-col md:flex-row md:items-start justify-between mb-2">
              <div>
                <h3 className="text-xl font-medium text-white tracking-tight">
                  Semantic Radar
                </h3>
                <p className="text-zinc-400 text-sm font-light mt-2 max-w-sm text-balance">
                  Ontological mapping of your extracted competencies against the
                  desired job description.
                </p>
              </div>
              <div className="mt-4 md:mt-0 flex gap-4 text-xs font-light text-zinc-500">
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-[rgba(56,189,248,0.4)] border border-[rgba(56,189,248,0.8)]"></span>
                  Your Match
                </div>
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full border border-white/20"></span>
                  Target Model
                </div>
              </div>
            </div>
            <div className="flex-1 w-full relative mt-4">
              <SBERTRadarChart
                matched={(data.matchedSkills as string[]) || []}
                missing={(data.missingSkills as string[]) || []}
              />
            </div>
          </div>
        </div>

        {/* SHAP Explainability Deck */}
        <div className="bg-white/5 backdrop-blur-3xl border border-white/10 rounded-[2.5rem] p-8 md:p-10 shadow-2xl relative overflow-hidden">
          <div className="absolute top-0 right-0 p-8 opacity-20 pointer-events-none">
            <svg
              width="120"
              height="120"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1"
              className="text-zinc-500"
            >
              <circle cx="12" cy="12" r="10"></circle>
              <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"></path>
              <path d="M2 12h20"></path>
            </svg>
          </div>

          <div className="mb-8 max-w-xl relative tracking-tight">
            <h3 className="text-xl font-medium text-white">
              Additive Explanations (SHAP)
            </h3>
            <p className="text-zinc-400 text-sm font-light mt-2">
              Visualizing the exact quantitative feature-importance weights
              assigned by the local decision tree that positively or negatively
              impacted your final score.
            </p>
          </div>

          <div className="relative">
            <SHAPInsightDeck
              explanations={(data.explanations as Record<string, number>) || {}}
            />
          </div>
        </div>

        {/* Course Intelligence row */}
        <div className="pt-4">
          <div className="mb-6 px-4 tracking-tight">
            <h3 className="text-xl font-medium text-white">Gap Intelligence</h3>
            <p className="text-zinc-400 text-sm font-light mt-1">
              Algorithmically recommended pathways to acquire your missing
              top-weighted skills.
            </p>
          </div>

          <CourseRecommendations courses={(data.courses as any[]) || []} />
        </div>
      </div>
    </div>
  );
}
