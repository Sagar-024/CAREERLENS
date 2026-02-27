"use client";

import { useEffect, useState, use } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import {
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Label,
} from "recharts";
import { ArrowLeft, BookOpen, AlertCircle, CheckCircle } from "lucide-react";

export default function ResultsPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const unwrappedParams = use(params);
  const { data: session, status } = useSession();
  const router = useRouter();
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/login");
      return;
    }

    if (status === "authenticated") {
      fetch(`/api/analysis/${unwrappedParams.id}`)
        .then((res) => {
          if (!res.ok) throw new Error("Failed to fetch analysis");
          return res.json();
        })
        .then((data) => {
          setData(data);
          setLoading(false);
          // Trigger confetti if score > 80
          if (data.finalScore >= 80) {
            import("canvas-confetti").then((confetti) => {
              confetti.default({
                particleCount: 100,
                spread: 70,
                origin: { y: 0.6 },
              });
            });
          }
        })
        .catch((err) => {
          toast.error("Could not load analysis results");
          router.push("/dashboard");
        });
    }
  }, [unwrappedParams.id, status, router]);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#fafafa] dark:bg-[#050505] flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-[#0047FF] border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  const scoreData = [
    { name: "Score", value: data.finalScore },
    { name: "Remaining", value: 100 - data.finalScore },
  ];

  const chartData = Object.entries(data.explanations || {})
    .map(([name, value]) => ({
      name: name.length > 15 ? name.substring(0, 15) + "..." : name,
      full_name: name,
      value: typeof value === "number" ? Number(value.toFixed(1)) : 0,
    }))
    .sort((a, b) => b.value - a.value)
    .slice(0, 5);

  return (
    <div className="min-h-screen bg-[#fafafa] dark:bg-[#080808] pt-8 pb-16 px-4 md:px-6">
      <div className="max-w-6xl mx-auto space-y-8">
        <button
          onClick={() => router.push("/dashboard")}
          className="flex items-center gap-2 text-gray-500 hover:text-gray-900 dark:hover:text-white transition-colors text-sm font-semibold uppercase tracking-wider"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Dashboard
        </button>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Score Card */}
          <div className="brutalist-card p-8 lg:col-span-2 flex flex-col items-center justify-center text-center">
            <h2 className="text-2xl font-black uppercase text-gray-900 dark:text-white mb-2">
              Overall Readiness
            </h2>
            <p className="text-gray-500 mb-8 max-w-md">
              Based on SBERT semantic analysis of your resume against the
              provided job description.
            </p>

            <div className="h-64 w-full max-w-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={scoreData}
                    cx="50%"
                    cy="50%"
                    innerRadius={80}
                    outerRadius={100}
                    startAngle={90}
                    endAngle={-270}
                    dataKey="value"
                    stroke="none"
                  >
                    <Cell
                      fill={
                        data.finalScore >= 80
                          ? "#0047FF"
                          : data.finalScore >= 50
                            ? "#FFBD00"
                            : "#FF2A00"
                      }
                    />
                    <Cell fill="#E5E7EB" className="dark:fill-[#222]" />
                    <Label
                      value={`${Math.round(data.finalScore)}%`}
                      position="center"
                      className="text-5xl font-black fill-current dark:fill-white text-[#0047FF]"
                      style={{ fontSize: "3rem", fontWeight: 900 }}
                    />
                  </Pie>
                </PieChart>
              </ResponsiveContainer>
            </div>

            <div className="mt-8 flex gap-8">
              <div className="text-center">
                <div className="text-3xl font-black text-gray-900 dark:text-white tabular-nums">
                  {data.matchedCount}
                </div>
                <div className="text-xs uppercase font-bold text-gray-500">
                  Skills Matched
                </div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-black text-[#FF2A00] tabular-nums">
                  {data.missingCount}
                </div>
                <div className="text-xs uppercase font-bold text-gray-500">
                  Skills Missing
                </div>
              </div>
            </div>
          </div>

          {/* SHAP Chart */}
          <div className="brutalist-card p-6 flex flex-col">
            <h3 className="text-lg font-black uppercase text-gray-900 dark:text-white mb-2">
              Impact Factors (SHAP)
            </h3>
            <p className="text-sm text-gray-500 mb-6">
              Skills positively or negatively affecting your score the most.
            </p>
            <div className="flex-1 min-h-[250px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={chartData}
                  layout="vertical"
                  margin={{ left: 0, right: 0 }}
                >
                  <XAxis type="number" hide />
                  <YAxis
                    dataKey="name"
                    type="category"
                    width={100}
                    tick={{ fontSize: 12, className: "dark:fill-gray-400" }}
                    axisLine={false}
                    tickLine={false}
                  />
                  <Tooltip
                    cursor={{ fill: "transparent" }}
                    content={({ active, payload }) => {
                      if (active && payload && payload.length) {
                        return (
                          <div className="bg-gray-900 border border-gray-700 p-2 text-white text-xs">
                            <span className="font-bold">
                              {payload[0].payload.full_name}
                            </span>
                            : {payload[0].value > 0 ? "+" : ""}
                            {payload[0].value}%
                          </div>
                        );
                      }
                      return null;
                    }}
                  />
                  <Bar dataKey="value" radius={[0, 4, 4, 0]}>
                    {chartData.map((entry, index) => (
                      <Cell
                        key={`cell-${index}`}
                        fill={entry.value > 0 ? "#0047FF" : "#FF2A00"}
                      />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        {/* Detailed Insights */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="brutalist-card p-6 border-t-4 border-t-green-500">
            <div className="flex items-center gap-3 mb-6">
              <CheckCircle className="text-green-500 w-6 h-6" />
              <h3 className="text-xl font-black uppercase text-gray-900 dark:text-white">
                Matched Skills
              </h3>
            </div>
            <div className="flex flex-wrap gap-2">
              {(data.matchedSkills || []).map((skill: string) => (
                <span
                  key={skill}
                  className="px-3 py-1 bg-green-50 dark:bg-green-500/10 text-green-700 dark:text-green-400 text-sm font-semibold rounded-full border border-green-200 dark:border-green-500/20"
                >
                  {skill}
                </span>
              ))}
              {(!data.matchedSkills || data.matchedSkills.length === 0) && (
                <p className="text-gray-500 italic">No skills matched.</p>
              )}
            </div>
          </div>

          <div className="brutalist-card p-6 border-t-4 border-t-[#FF2A00]">
            <div className="flex items-center gap-3 mb-6">
              <AlertCircle className="text-[#FF2A00] w-6 h-6" />
              <h3 className="text-xl font-black uppercase text-gray-900 dark:text-white">
                Missing Skills
              </h3>
            </div>
            <div className="flex flex-wrap gap-2">
              {(data.missingSkills || []).map((skill: string) => (
                <span
                  key={skill}
                  className="px-3 py-1 bg-red-50 dark:bg-red-500/10 text-red-700 dark:text-red-400 text-sm font-semibold rounded-full border border-red-200 dark:border-red-500/20"
                >
                  {skill}
                </span>
              ))}
              {(!data.missingSkills || data.missingSkills.length === 0) && (
                <p className="text-gray-500 italic">
                  All required skills found!
                </p>
              )}
            </div>
          </div>
        </div>

        {/* Course Recommendations */}
        {data.courses && data.courses.length > 0 && (
          <div className="brutalist-card p-8 bg-[#0047FF] dark:bg-[#D6FF00] border-black dark:border-[#222]">
            <div className="flex items-center gap-3 mb-8">
              <BookOpen className="text-white dark:text-black w-8 h-8" />
              <h3 className="text-2xl font-black uppercase text-white dark:text-black">
                Recommended Courses to Close the Gap
              </h3>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {data.courses.map((course: any, idx: number) => (
                <a
                  key={idx}
                  href={course.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="bg-white dark:bg-black p-5 border-2 border-transparent hover:border-black dark:hover:border-white transition-colors group relative overflow-hidden"
                >
                  <div className="flex justify-between items-start mb-2">
                    <h4 className="font-bold text-gray-900 dark:text-white group-hover:text-[#0047FF] dark:group-hover:text-[#D6FF00] transition-colors pr-8">
                      {course.title}
                    </h4>
                    <span className="font-mono text-xs font-bold uppercase bg-gray-100 dark:bg-[#222] px-2 py-1 flex-shrink-0">
                      {course.platform}
                    </span>
                  </div>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    Targets:{" "}
                    <span className="font-semibold text-gray-900 dark:text-white">
                      {course.skill}
                    </span>
                  </p>
                </a>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
