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
    <div
      className="brutalist-card p-8 flex flex-col justify-between"
      style={{ backgroundColor: "#D6FF00", borderColor: "#000", color: "#000" }}
    >
      <div className="flex justify-between items-start mb-8">
        <span className="font-mono text-xs font-bold uppercase tracking-widest py-1 px-2 border border-black text-black">
          Analysis
        </span>
        <div className="w-3 h-3 bg-black rounded-full animate-pulse" />
      </div>
      <div>
        <div className="display-title text-7xl md:text-[120px] leading-[0.8] tracking-tighter mb-2">
          {displayed}
        </div>
        <div className="flex items-center gap-4">
          <div className="font-mono text-xs font-bold uppercase w-16">
            Global Match
          </div>
          <div className="h-px bg-black flex-1" />
          <div className="font-mono text-xs font-bold uppercase">PCT_78</div>
        </div>
      </div>
      <div className="mt-8 border-t border-black pt-4 grid grid-cols-2 gap-4">
        <div>
          <div className="font-mono text-[10px] uppercase text-black/60 mb-1">
            ATS Parsable
          </div>
          <div className="font-bold text-xl uppercase">94%</div>
        </div>
        <div>
          <div className="font-mono text-[10px] uppercase text-black/60 mb-1">
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
    <div ref={ref} className="space-y-2 border-b border-[#222] pb-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <span
            className={`font-mono font-bold text-xs uppercase ${has ? "text-white" : "text-[#FF2A00]"}`}
          >
            {name}
          </span>
          {!has && (
            <span className="px-1.5 py-0.5 border border-[#FF2A00] text-[#FF2A00] text-[9px] uppercase font-mono bg-[#FF2A00]/10">
              GAP DETECTED
            </span>
          )}
        </div>
        <span className="font-mono text-xs font-bold text-[#888]">
          {score}%
        </span>
      </div>
      <div className="h-4 bg-black border border-[#222] w-full">
        <motion.div
          className={`h-full border-r ${has ? "bg-[#0047FF] border-[#fff]" : "bg-[#FF2A00] border-[#000]"}`}
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
      <div className="flex font-mono text-[10px] text-[#666] uppercase border-b border-[#222] pb-2 mb-4">
        <div className="w-1/3">VECTOR</div>
        <div className="w-2/3 flex">
          <div className="w-1/2 text-right pr-2">NEGATIVE</div>
          <div className="w-1/2 pl-2 border-l border-[#222]">POSITIVE</div>
        </div>
      </div>
      {shapFactors.map((factor, i) => (
        <div key={factor.name} className="flex items-center group">
          <span className="w-1/3 font-mono text-xs truncate pr-4 text-white group-hover:text-[#D6FF00] transition-colors">
            {factor.name}
          </span>
          <div className="w-2/3 flex items-center h-8">
            {factor.positive ? (
              <>
                <div className="w-1/2 h-full border-r border-[#222]" />
                <div className="w-1/2 flex items-center h-full">
                  <motion.div
                    className="h-full bg-[#D6FF00]"
                    initial={{ width: 0 }}
                    animate={
                      inView
                        ? { width: `${(factor.impact / maxVal) * 100}%` }
                        : {}
                    }
                    transition={{ duration: 0.5, delay: i * 0.05 }}
                  />
                  <span className="font-mono text-[10px] font-bold text-[#D6FF00] ml-2">
                    +{factor.impact}
                  </span>
                </div>
              </>
            ) : (
              <>
                <div className="w-1/2 flex justify-end items-center h-full border-r border-[#222]">
                  <span className="font-mono text-[10px] font-bold text-[#FF2A00] mr-2">
                    {factor.impact}
                  </span>
                  <motion.div
                    className="h-full bg-[#FF2A00]"
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
    <div className="min-h-screen structural-bg pt-20 md:pt-24 pb-16 md:pb-20">
      <div className="w-full max-w-[1400px] mx-auto px-4 md:px-6">
        {/* Top Meta Bar */}
        <motion.div
          initial="hidden"
          animate="visible"
          variants={fadeUp}
          className="flex flex-col md:flex-row justify-between items-start md:items-end border-b-2 border-[#222] pb-6 mb-8 gap-6"
        >
          <div>
            <div className="flex items-center gap-3 mb-4">
              <span className="font-mono text-xs font-bold px-2 py-1 bg-white text-black uppercase">
                Live Report
              </span>
              <span className="font-mono text-xs text-[#888] uppercase">
                Welcome, {session?.user?.name || "Agent"}
              </span>
            </div>
            <h1 className="display-title text-3xl md:text-4xl text-white uppercase mb-2 leading-none">
              {jobData.title}
            </h1>
            <div className="font-mono text-xs text-[#888] uppercase flex flex-col md:flex-row items-start md:items-center gap-2 md:gap-4">
              <span>[{jobData.location}]</span>
              <span className="text-[#0047FF]">[{jobData.salary}]</span>
            </div>
          </div>
          <div className="flex items-center gap-4 w-full md:w-auto">
            <Link
              href="/upload"
              className="font-mono text-xs font-bold uppercase text-white hover:text-[#0047FF] transition-colors focus-ring h-12 flex items-center px-6 border border-[#222] bg-black"
            >
              [ RESCAN ]
            </Link>
            <button
              onClick={() => signOut({ callbackUrl: "/login" })}
              className="brutalist-button h-12 px-6 flex-1 md:flex-none"
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
              className="brutalist-card p-6 bg-[#050505]"
            >
              <div className="flex items-center gap-2 mb-6 border-b border-[#222] pb-4">
                <Target className="w-5 h-5 text-white" />
                <h3 className="font-bold uppercase text-white tracking-widest text-lg">
                  Quick Vectors
                </h3>
              </div>
              <p className="font-mono text-xs text-[#888] mb-6 uppercase">
                Inject following terms to gain{" "}
                <span className="text-[#D6FF00]">PCT_8</span> ranking increase.
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
                    className="font-mono text-[10px] uppercase font-bold px-2 py-1 bg-[#222] text-white hover:bg-[#D6FF00] hover:text-black transition-colors cursor-pointer border border-[#333]"
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
                className="w-full brutalist-card bg-[#050505] p-0 overflow-hidden"
              >
                <TabsList className="bg-black border-b border-[#222] w-full flex flex-col sm:grid sm:grid-cols-3 p-0 rounded-none h-auto">
                  <TabsTrigger
                    value="skills"
                    className="rounded-none border-r border-[#222] py-4 font-mono text-xs font-bold uppercase data-[state=active]:bg-[#0047FF] data-[state=active]:text-white"
                  >
                    <BarChart2 className="w-4 h-4 mr-2" /> Matrix
                  </TabsTrigger>
                  <TabsTrigger
                    value="shap"
                    className="rounded-none border-r border-[#222] py-4 font-mono text-xs font-bold uppercase data-[state=active]:bg-[#0047FF] data-[state=active]:text-white"
                  >
                    <Target className="w-4 h-4 mr-2" /> SHAP
                  </TabsTrigger>
                  <TabsTrigger
                    value="courses"
                    className="rounded-none py-4 font-mono text-xs font-bold uppercase data-[state=active]:bg-[#0047FF] data-[state=active]:text-white"
                  >
                    <ArrowUpRight className="w-4 h-4 mr-2" /> Modules
                  </TabsTrigger>
                </TabsList>

                {/* MATRIX CONTENT */}
                <TabsContent
                  value="skills"
                  className="p-6 md:p-8 m-0 focus-ring"
                >
                  <h3 className="display-title text-3xl text-white mb-2 uppercase">
                    Skill Matrix
                  </h3>
                  <p className="font-mono text-xs text-[#888] mb-8 uppercase">
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
                  <h3 className="display-title text-3xl text-white mb-2 uppercase">
                    Influence Impact
                  </h3>
                  <p className="font-mono text-xs text-[#888] mb-8 uppercase">
                    Feature importance mapped via SHAP values.
                  </p>
                  <ShapChart />
                </TabsContent>

                {/* COURSES CONTENT */}
                <TabsContent
                  value="courses"
                  className="p-6 md:p-8 m-0 focus-ring"
                >
                  <h3 className="display-title text-3xl text-white mb-2 uppercase">
                    Training Modules
                  </h3>
                  <p className="font-mono text-xs text-[#888] mb-8 uppercase">
                    Execute to patch identified semantic gaps.
                  </p>
                  <div className="grid grid-cols-1 gap-4">
                    {courses.map((c) => (
                      <div
                        key={c.title}
                        className="p-4 border border-[#222] bg-[#0A0A0A] hover:bg-[#111] transition-colors flex flex-col sm:flex-row items-start sm:items-center justify-between group gap-4 sm:gap-0"
                      >
                        <div className="flex items-center gap-4 sm:gap-6">
                          <span className="font-mono text-2xl font-black text-[#333] group-hover:text-[#666] transition-colors">
                            {c.icon}
                          </span>
                          <div>
                            <div className="flex items-center gap-3">
                              <div className="font-bold text-white uppercase text-lg">
                                {c.title}
                              </div>
                              {c.urgent && (
                                <span className="px-2 py-0 border border-[#FF2A00] text-[#FF2A00] bg-[#FF2A00]/10 font-mono text-[9px] uppercase">
                                  URGENT
                                </span>
                              )}
                            </div>
                            <div className="font-mono text-xs text-[#888] uppercase mt-1 flex gap-3">
                              <span className="text-[#0047FF]">
                                {c.platform}
                              </span>
                              <span>Lvl: {c.level}</span>
                            </div>
                          </div>
                        </div>
                        <a
                          href="#"
                          className="w-12 h-12 flex items-center justify-center border border-[#222] bg-black hover:bg-[#D6FF00] hover:text-black transition-colors focus-ring shrink-0"
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
