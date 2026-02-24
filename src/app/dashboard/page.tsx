"use client";

import { useRef, useEffect, useState } from "react";
import { motion, useInView } from "framer-motion";
import Link from "next/link";
import { ArrowUpRight, BarChart2, Target, ExternalLink } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

/* ─── Mock Data ─── */
const jobData = {
  title: "Senior Product Designer",
  location: "San Francisco, CA • Remote Friendly",
  salary: "$160k – $210k",
  matchScore: 78,
};

const skillsData = [
  { name: "Figma", has: true, score: 95 },
  { name: "User Research", has: true, score: 88 },
  { name: "Design Systems", has: true, score: 82 },
  { name: "Advanced Prototyping", has: false, score: 40 },
  { name: "SQL for Data Analysis", has: false, score: 20 },
  { name: "Team Leadership", has: false, score: 35 },
];

const shapFactors = [
  { name: "Figma expertise", impact: 18, positive: true },
  { name: "Portfolio quality", impact: 14, positive: true },
  { name: "Years of experience", impact: 12, positive: true },
  { name: "Case study depth", impact: 8, positive: true },
  { name: "Missing SQL skills", impact: -9, positive: false },
  { name: "No leadership exp", impact: -7, positive: false },
  { name: "Location mismatch", impact: -5, positive: false },
];

const courses = [
  {
    title: "Advanced Prototyping",
    subtitle: "Master Framer to close your skills gap.",
    platform: "Interaction Design Foundation",
    level: "Mid",
    icon: "01",
    urgent: true,
  },
  {
    title: "SQL for Data Analysis",
    subtitle: "Essential for product data interpretation.",
    platform: "Mode Analytics",
    level: "Beg",
    icon: "02",
    urgent: true,
  },
  {
    title: "Team Leadership 101",
    subtitle: "Demonstrate management capability.",
    platform: "LinkedIn Learning",
    level: "Beg",
    icon: "03",
    urgent: false,
  },
];

/* ─── Score Brutalist Display ─── */
function ScoreDisplay({ score }: { score: number }) {
  const [displayed, setDisplayed] = useState(0);

  useEffect(() => {
    let start = 0;
    const step = Math.ceil(score / 30);
    const interval = setInterval(() => {
      start += step;
      if (start >= score) {
        setDisplayed(score);
        clearInterval(interval);
      } else setDisplayed(start);
    }, 30);
    return () => clearInterval(interval);
  }, [score]);

  return (
    <div className="brutalist-card p-8 flex flex-col justify-between">
      <div className="flex justify-between items-start mb-8">
        <span className="font-mono text-xs font-bold uppercase tracking-widest py-1 px-2 border border-white dark:border-black text-white dark:text-black transition-colors">
          Analysis
        </span>
        <div className="w-3 h-3 bg-white dark:bg-black rounded-full animate-pulse transition-colors" />
      </div>
      <div>
        <div className="display-title text-7xl md:text-[120px] leading-[0.8] tracking-tighter mb-2">
          {displayed}
        </div>
        <div className="flex items-center gap-4">
          <div className="font-mono text-xs font-bold uppercase w-16">
            Global Match
          </div>
          <div className="h-px bg-white dark:bg-black flex-1 transition-colors" />
          <div className="font-mono text-xs font-bold uppercase">PCT_78</div>
        </div>
      </div>
      <div className="mt-8 border-t border-white/30 dark:border-black pt-4 grid grid-cols-2 gap-4 transition-colors">
        <div>
          <div className="font-mono text-[10px] uppercase text-white/80 dark:text-black/60 mb-1 transition-colors">
            ATS Parsable
          </div>
          <div className="font-bold text-xl uppercase">94%</div>
        </div>
        <div>
          <div className="font-mono text-[10px] uppercase text-white/80 dark:text-black/60 mb-1 transition-colors">
            Ranking
          </div>
          <div className="font-bold text-xl uppercase">TOP 12%</div>
        </div>
      </div>
    </div>
  );
}

/* ─── Skill Bar ─── */
function SkillBar({
  name,
  score,
  has,
}: {
  name: string;
  score: number;
  has: boolean;
}) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true });
  return (
    <div
      ref={ref}
      className="space-y-2 border-b-2 border-gray-100 dark:border-b dark:border-[#222] pb-4 transition-colors"
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <span
            className={`font-mono font-black dark:font-bold text-xs uppercase transition-colors ${has ? "text-gray-900 dark:text-white" : "text-[#FF2A00] dark:text-[#FF2A00]"}`}
          >
            {name}
          </span>
          {!has && (
            <span className="px-1.5 py-0.5 border border-[#FF2A00] text-[#FF2A00] text-[9px] uppercase font-mono bg-[#FF2A00]/5 dark:bg-[#FF2A00]/10 font-bold dark:font-normal">
              GAP DETECTED
            </span>
          )}
        </div>
        <span className="font-mono text-xs font-bold text-gray-400 dark:text-[#888] transition-colors">
          {score}%
        </span>
      </div>
      <div className="h-4 bg-gray-200 dark:bg-black border border-transparent dark:border-[#222] w-full transition-colors">
        <motion.div
          className={`h-full border-r-2 dark:border-r border-transparent ${has ? "bg-[#0047FF] dark:bg-[#0047FF] dark:border-[#fff]" : "bg-[#FF2A00] dark:bg-[#FF2A00] dark:border-[#000]"} transition-colors`}
          initial={{ width: 0 }}
          animate={inView ? { width: `${score}%` } : {}}
          transition={{ duration: 0.8, ease: "easeOut" }}
        />
      </div>
    </div>
  );
}

/* ─── SHAP Chart ─── */
function ShapChart() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true });
  const maxVal = Math.max(...shapFactors.map((f) => Math.abs(f.impact)));

  return (
    <div ref={ref} className="space-y-1 mt-6">
      <div className="flex font-mono text-[10px] text-gray-500 dark:text-[#666] font-bold dark:font-normal uppercase border-b-2 border-gray-100 dark:border-b dark:border-[#222] pb-2 mb-4 transition-colors">
        <div className="w-1/3">VECTOR</div>
        <div className="w-2/3 flex">
          <div className="w-1/2 text-right pr-2">NEGATIVE</div>
          <div className="w-1/2 pl-2 border-l-2 border-gray-100 dark:border-l dark:border-[#222] transition-colors">
            POSITIVE
          </div>
        </div>
      </div>
      {shapFactors.map((factor, i) => (
        <div key={factor.name} className="flex items-center group">
          <span className="w-1/3 font-mono text-xs font-black dark:font-normal truncate pr-4 text-gray-900 dark:text-white group-hover:text-[#0047FF] dark:group-hover:text-[#D6FF00] transition-colors">
            {factor.name}
          </span>
          <div className="w-2/3 flex items-center h-8">
            {factor.positive ? (
              <>
                <div className="w-1/2 h-full border-r-2 border-gray-100 dark:border-r dark:border-[#222] transition-colors" />
                <div className="w-1/2 flex items-center h-full">
                  <motion.div
                    className="h-full bg-[#0047FF] dark:bg-[#D6FF00] transition-colors"
                    initial={{ width: 0 }}
                    animate={
                      inView
                        ? { width: `${(factor.impact / maxVal) * 100}%` }
                        : {}
                    }
                    transition={{ duration: 0.5, delay: i * 0.05 }}
                  />
                  <span className="font-mono text-[10px] font-bold text-[#0047FF] dark:text-[#D6FF00] ml-2 transition-colors">
                    +{factor.impact}
                  </span>
                </div>
              </>
            ) : (
              <>
                <div className="w-1/2 flex justify-end items-center h-full border-r-2 border-gray-100 dark:border-r dark:border-[#222] transition-colors">
                  <span className="font-mono text-[10px] font-bold text-[#FF2A00] mr-2">
                    {factor.impact}
                  </span>
                  <motion.div
                    className="h-full bg-[#FF2A00] transition-colors"
                    initial={{ width: 0 }}
                    animate={
                      inView
                        ? {
                            width: `${(Math.abs(factor.impact) / maxVal) * 100}%`,
                          }
                        : {}
                    }
                    transition={{ duration: 0.5, delay: i * 0.05 }}
                  />
                </div>
                <div className="w-1/2 h-full" />
              </>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}

import { useSession, signOut } from "next-auth/react";
import { useRouter } from "next/navigation";

/* ─── PAGE ─── */
export default function DashboardPage() {
  const { data: session, status } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/login");
    }
  }, [status, router]);

  const fadeUp: import("framer-motion").Variants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.4 } },
  };

  if (status === "loading") {
    return (
      <div className="min-h-screen structural-bg pt-20 flex items-center justify-center">
        <p className="font-mono text-[#888] uppercase animate-pulse">
          Loading Identity...
        </p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#fafafa] dark:bg-[#050505] pt-20 md:pt-24 pb-16 md:pb-20 transition-colors duration-500">
      <div className="w-full max-w-[1400px] mx-auto px-4 md:px-6">
        {/* Top Meta Bar */}
        <motion.div
          initial="hidden"
          animate="visible"
          variants={fadeUp}
          className="flex flex-col md:flex-row justify-between items-start md:items-end border-b-2 border-gray-200 dark:border-[#222] pb-6 mb-8 gap-6 transition-colors"
        >
          <div>
            <div className="flex items-center gap-3 mb-4">
              <span className="font-mono text-xs font-bold px-2 py-1 bg-gray-900 text-white dark:bg-white dark:text-black uppercase transition-colors">
                Live Report
              </span>
              <span className="font-mono text-xs text-gray-500 dark:text-[#888] uppercase transition-colors font-bold dark:font-normal">
                Welcome, {session?.user?.name || "Agent"}
              </span>
            </div>
            <h1 className="display-title text-3xl md:text-4xl text-gray-900 dark:text-white uppercase mb-2 leading-none transition-colors">
              {jobData.title}
            </h1>
            <div className="font-mono text-xs text-gray-500 dark:text-[#888] font-bold dark:font-normal uppercase flex flex-col md:flex-row items-start md:items-center gap-2 md:gap-4 transition-colors">
              <span>[{jobData.location}]</span>
              <span className="text-[#0047FF] dark:text-[#0047FF]">
                [{jobData.salary}]
              </span>
            </div>
          </div>
          <div className="flex items-center gap-4 w-full md:w-auto">
            <Link
              href="/upload"
              className="font-mono text-xs font-bold uppercase text-gray-900 border-gray-300 dark:text-white hover:text-white hover:bg-[#0047FF] dark:hover:text-[#0047FF] dark:hover:bg-transparent transition-colors focus-ring h-12 flex items-center px-6 border dark:border-[#222] bg-white dark:bg-black"
            >
              [ RESCAN ]
            </Link>
            <button
              onClick={() => signOut({ callbackUrl: "/login" })}
              className="px-6 py-0 h-12 flex-1 md:flex-none flex items-center justify-center font-bold uppercase text-white bg-[#0047FF] dark:bg-[#FF2A00] hover:-translate-y-1 hover:shadow-xl shadow-[4px_4px_0_rgba(0,0,0,0.1)] dark:shadow-[4px_4px_0_#fff] transition-all focus-ring"
            >
              SIGN OUT
            </button>
          </div>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Left Column */}
          <div className="lg:col-span-4 flex flex-col gap-8">
            <motion.div initial="hidden" animate="visible" variants={fadeUp}>
              <ScoreDisplay score={jobData.matchScore} />
            </motion.div>

            <motion.div
              initial="hidden"
              animate="visible"
              variants={fadeUp}
              className="brutalist-card p-6"
            >
              <div className="flex items-center gap-2 mb-6 border-b-2 border-gray-100 dark:border-b dark:border-[#222] pb-4 transition-colors">
                <Target className="w-5 h-5 text-gray-900 dark:text-white transition-colors" />
                <h3 className="font-black dark:font-bold uppercase text-gray-900 dark:text-white tracking-widest text-lg transition-colors">
                  Quick Vectors
                </h3>
              </div>
              <p className="font-mono text-xs text-gray-500 dark:text-[#888] font-bold dark:font-normal mb-6 uppercase transition-colors">
                Inject following terms to gain{" "}
                <span className="text-[#0047FF] dark:text-[#D6FF00] transition-colors">
                  PCT_8
                </span>{" "}
                ranking increase.
              </p>
              <div className="flex flex-wrap gap-2">
                {[
                  "Leadership",
                  "Agile",
                  "OKRs",
                  "Stakeholder Mgmt",
                  "A/B Testing",
                  "SQL",
                ].map((kw) => (
                  <span
                    key={kw}
                    className="font-mono text-[10px] uppercase font-bold px-2 py-1 bg-gray-100 dark:bg-[#222] text-gray-700 dark:text-white hover:bg-[#0047FF] dark:hover:bg-[#D6FF00] hover:text-white dark:hover:text-black transition-colors cursor-pointer border border-gray-200 dark:border-[#333]"
                  >
                    + {kw}
                  </span>
                ))}
              </div>
            </motion.div>
          </div>

          {/* Right Column / Tabs */}
          <div className="lg:col-span-8">
            <motion.div initial="hidden" animate="visible" variants={fadeUp}>
              <Tabs
                defaultValue="skills"
                className="w-full brutalist-card p-0 overflow-hidden"
              >
                <TabsList className="bg-gray-100 dark:bg-black border-b-2 border-gray-200 dark:border-b dark:border-[#222] w-full flex flex-col sm:grid sm:grid-cols-3 p-0 rounded-none h-auto transition-colors">
                  <TabsTrigger
                    value="skills"
                    className="rounded-none border-b sm:border-b-0 sm:border-r border-gray-200 dark:border-[#222] py-4 font-mono text-xs font-black dark:font-bold text-gray-600 dark:text-gray-400 uppercase data-[state=active]:bg-[#0047FF] data-[state=active]:text-white transition-colors"
                  >
                    <BarChart2 className="w-4 h-4 mr-2" /> Matrix
                  </TabsTrigger>
                  <TabsTrigger
                    value="shap"
                    className="rounded-none border-b sm:border-b-0 sm:border-r border-gray-200 dark:border-[#222] py-4 font-mono text-xs font-black dark:font-bold text-gray-600 dark:text-gray-400 uppercase data-[state=active]:bg-[#0047FF] data-[state=active]:text-white transition-colors"
                  >
                    <Target className="w-4 h-4 mr-2" /> SHAP
                  </TabsTrigger>
                  <TabsTrigger
                    value="courses"
                    className="rounded-none py-4 font-mono text-xs font-black dark:font-bold text-gray-600 dark:text-gray-400 uppercase data-[state=active]:bg-[#0047FF] data-[state=active]:text-white transition-colors"
                  >
                    <ArrowUpRight className="w-4 h-4 mr-2" /> Modules
                  </TabsTrigger>
                </TabsList>

                {/* MATRIX CONTENT */}
                <TabsContent
                  value="skills"
                  className="p-6 md:p-8 m-0 focus-ring"
                >
                  <h3 className="display-title text-3xl text-gray-900 dark:text-white mb-2 uppercase transition-colors">
                    Skill Matrix
                  </h3>
                  <p className="font-mono text-xs text-gray-500 dark:text-[#888] font-bold dark:font-normal mb-8 uppercase transition-colors">
                    3 Gaps identified. Remediation recommended.
                  </p>
                  <div className="space-y-6">
                    {skillsData.map((skill) => (
                      <SkillBar key={skill.name} {...skill} />
                    ))}
                  </div>
                </TabsContent>

                {/* SHAP CONTENT */}
                <TabsContent value="shap" className="p-6 md:p-8 m-0 focus-ring">
                  <h3 className="display-title text-3xl text-gray-900 dark:text-white mb-2 uppercase transition-colors">
                    Influence Impact
                  </h3>
                  <p className="font-mono text-xs text-gray-500 dark:text-[#888] font-bold dark:font-normal mb-8 uppercase transition-colors">
                    Feature importance mapped via SHAP values.
                  </p>
                  <ShapChart />
                </TabsContent>

                {/* COURSES CONTENT */}
                <TabsContent
                  value="courses"
                  className="p-6 md:p-8 m-0 focus-ring"
                >
                  <h3 className="display-title text-3xl text-gray-900 dark:text-white mb-2 uppercase transition-colors">
                    Training Modules
                  </h3>
                  <p className="font-mono text-xs text-gray-500 dark:text-[#888] font-bold dark:font-normal mb-8 uppercase transition-colors">
                    Execute to patch identified semantic gaps.
                  </p>
                  <div className="grid grid-cols-1 gap-4">
                    {courses.map((c) => (
                      <div
                        key={c.title}
                        className="p-4 border-2 border-gray-100 dark:border-transparent dark:border-[#222] bg-gray-50 dark:bg-[#0A0A0A] hover:bg-gray-100 dark:hover:bg-[#111] transition-colors flex flex-col sm:flex-row items-start sm:items-center justify-between group gap-4 sm:gap-0"
                      >
                        <div className="flex items-center gap-4 sm:gap-6">
                          <span className="font-mono text-2xl font-black text-gray-300 dark:text-[#333] group-hover:text-gray-400 dark:group-hover:text-[#666] transition-colors">
                            {c.icon}
                          </span>
                          <div>
                            <div className="flex items-center gap-3">
                              <div className="font-black dark:font-bold text-gray-900 dark:text-white uppercase text-lg transition-colors">
                                {c.title}
                              </div>
                              {c.urgent && (
                                <span className="px-2 py-0 border border-[#FF2A00] text-[#FF2A00] bg-[#FF2A00]/10 font-mono text-[9px] uppercase font-bold dark:font-normal">
                                  URGENT
                                </span>
                              )}
                            </div>
                            <div className="font-mono text-xs text-gray-500 dark:text-[#888] uppercase mt-1 flex gap-3 font-bold dark:font-normal transition-colors">
                              <span className="text-[#0047FF]">
                                {c.platform}
                              </span>
                              <span>Lvl: {c.level}</span>
                            </div>
                          </div>
                        </div>
                        <a
                          href="#"
                          className="w-12 h-12 flex items-center justify-center border-2 border-gray-200 dark:border-[#222] bg-white dark:bg-black hover:bg-[#0047FF] dark:hover:bg-[#D6FF00] hover:border-transparent text-gray-600 dark:text-white hover:text-white dark:hover:text-black transition-colors focus-ring shrink-0"
                        >
                          <ExternalLink className="w-5 h-5" />
                        </a>
                      </div>
                    ))}
                  </div>
                </TabsContent>
              </Tabs>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
}
