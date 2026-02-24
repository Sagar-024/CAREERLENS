"use client";

import { useRef, useEffect, useState } from "react";
import { motion, useInView } from "framer-motion";
import Link from "next/link";
import { ArrowUpRight, ArrowRight, BarChart2, Target, ExternalLink } from "lucide-react";
import { useSession, signOut } from "next-auth/react";
import { useRouter } from "next/navigation";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { getSkillsForRole } from "@/lib/skillsData";

/* ─── Mock Data ─── */
const jobData = {
  title: "Senior Product Designer",
  location: "San Francisco, CA • Remote Friendly",
  salary: "$160k – $210k",
  matchScore: 78,
};

const defaultSkills = [
  { name: "Figma", has: true, score: 95 },
  { name: "User Research", has: true, score: 88 },
  { name: "Design Systems", has: true, score: 82 },
  { name: "Advanced Prototyping", has: false, score: 40 },
  { name: "SQL for Data Analysis", has: false, score: 20 },
  { name: "Team Leadership", has: false, score: 35 },
];

const frontendSkills = [
  { name: "React / Next.js / Vue", has: true, score: 95 },
  { name: "Tailwind / CSS Mastery", has: true, score: 92 },
  { name: "TypeScript / JS ES6+", has: true, score: 88 },
  { name: "State Mgmt (Redux/Zustand)", has: false, score: 40 },
  { name: "Unit Testing (Jest/RTL)", has: false, score: 35 },
  { name: "Performance Optimization", has: false, score: 25 },
];

const backendSkills = [
  { name: "Node.js / Express / Go", has: true, score: 94 },
  { name: "DB Design (SQL/NoSQL)", has: true, score: 90 },
  { name: "REST / GraphQL APIs", has: true, score: 86 },
  { name: "Microservices Architect", has: false, score: 45 },
  { name: "Auth (JWT/OAuth2)", has: false, score: 40 },
  { name: "Message Queues (RabbitMQ)", has: false, score: 20 },
];

const fullStackSkills = [
  { name: "Full Cycle Dev (Front/Back)", has: true, score: 92 },
  { name: "Deployment / CI/CD", has: true, score: 85 },
  { name: "Database Integration", has: true, score: 80 },
  { name: "System Design (Scalability)", has: false, score: 40 },
  { name: "Containerization (Docker)", has: false, score: 35 },
  { name: "Cloud Native Design", has: false, score: 20 },
];

const dataAnalystSkills = [
  { name: "SQL (PostgreSQL/BigQuery)", has: true, score: 95 },
  { name: "Python (Pandas/NumPy)", has: true, score: 88 },
  { name: "Tableau / PowerBI", has: true, score: 82 },
  { name: "Statistical Modeling", has: false, score: 40 },
  { name: "A/B Testing Frameworks", has: false, score: 35 },
  { name: "Machine Learning Basics", has: false, score: 20 },
];

const aiSkills = [
  { name: "PyTorch / TensorFlow", has: true, score: 94 },
  { name: "LLM Fine-tuning", has: true, score: 86 },
  { name: "Mathematical Foundations", has: true, score: 90 },
  { name: "MLOps / Pipeline Design", has: false, score: 45 },
  { name: "GPU Optimization", has: false, score: 30 },
  { name: "AI Ethics Frameworks", has: false, score: 25 },
];

const cloudSkills = [
  { name: "AWS / Azure / GCP", has: true, score: 92 },
  { name: "Terraform / IaC", has: true, score: 88 },
  { name: "Kubernetes / Docker", has: true, score: 85 },
  { name: "CI/CD Pipeline Design", has: false, score: 40 },
  { name: "Cost Optimization", has: false, score: 35 },
  { name: "Site Reliability (SRE)", has: false, score: 20 },
];

const securitySkills = [
  { name: "Pentesting / Burp Suite", has: true, score: 96 },
  { name: "Network Security / SIEM", has: true, score: 90 },
  { name: "OWASP Top 10", has: true, score: 92 },
  { name: "Incident Response", has: false, score: 45 },
  { name: "Cloud Security Audit", has: false, score: 30 },
  { name: "Forensics Analysis", has: false, score: 20 },
];

const managementSkills = [
  { name: "Agile / Scrum / Kanban", has: true, score: 95 },
  { name: "Product Strategy / Roadmap", has: true, score: 88 },
  { name: "Stakeholder Management", has: true, score: 92 },
  { name: "Budgeting & Forecasting", has: false, score: 40 },
  { name: "Risk Assessment", has: false, score: 35 },
  { name: "Technical Feasibility", has: false, score: 30 },
];

const defaultShapFactors = [
  { name: "Figma expertise", impact: 18, positive: true },
  { name: "Portfolio quality", impact: 14, positive: true },
  { name: "Years of experience", impact: 12, positive: true },
  { name: "Case study depth", impact: 8, positive: true },
  { name: "Missing SQL skills", impact: -9, positive: false },
  { name: "No leadership exp", impact: -7, positive: false },
  { name: "Location mismatch", impact: -5, positive: false },
];

const frontendShapFactors = [
  { name: "UI Fidelity precision", impact: 18, positive: true },
  { name: "Component Reusability", impact: 14, positive: true },
  { name: "Mobile Responsiveness", impact: 12, positive: true },
  { name: "Missing State Mgmt", impact: -15, positive: false },
  { name: "Testing coverage gaps", impact: -10, positive: false },
];

const backendShapFactors = [
  { name: "API Throughput logic", impact: 20, positive: true },
  { name: "Database Query speed", impact: 16, positive: true },
  { name: "Secure Auth patterns", impact: 14, positive: true },
  { name: "No Microservices exp", impact: -18, positive: false },
  { name: "Auth implementation gaps", impact: -12, positive: false },
];

const fullStackShapFactors = [
  { name: "End-to-End ownership", impact: 18, positive: true },
  { name: "System integration depth", impact: 14, positive: true },
  { name: "Adaptability cross-stack", impact: 12, positive: true },
  { name: "Missing Scalability exp", impact: -15, positive: false },
  { name: "Deployment bottlenecks", impact: -10, positive: false },
];

const dataAnalystShapFactors = [
  { name: "Complex Query Optimization", impact: 18, positive: true },
  { name: "Data Visualization depth", impact: 14, positive: true },
  { name: "Python script efficiency", impact: 12, positive: true },
  { name: "Mathematical background", impact: 10, positive: true },
  { name: "Missing ML experience", impact: -15, positive: false },
  { name: "Statistical gaps", impact: -10, positive: false },
  { name: "No A/B testing exp", impact: -7, positive: false },
];

const aiShapFactors = [
  { name: "Neural Network Architecture", impact: 20, positive: true },
  { name: "NLP / Transformers exp", impact: 16, positive: true },
  { name: "Model Quantization skills", impact: 12, positive: true },
  { name: "Deep Calculus foundations", impact: 10, positive: true },
  { name: "Missing MLOps knowledge", impact: -14, positive: false },
  { name: "Inference latency issues", impact: -9, positive: false },
  { name: "No GPU scaling exp", impact: -6, positive: false },
];

const cloudShapFactors = [
  { name: "IaC implementation depth", impact: 18, positive: true },
  { name: "Kubernetes cluster mgmt", impact: 15, positive: true },
  { name: "High availability design", impact: 12, positive: true },
  { name: "Multi-cloud experience", impact: 10, positive: true },
  { name: "Missing SRE foundation", impact: -12, positive: false },
  { name: "Security config gaps", impact: -10, positive: false },
  { name: "No cost control exp", impact: -7, positive: false },
];

const securityShapFactors = [
  { name: "Exploit identification speed", impact: 22, positive: true },
  { name: "Security audit precision", impact: 18, positive: true },
  { name: "Firewalls / VPN expertise", impact: 14, positive: true },
  { name: "Zero trust architecture", impact: 10, positive: true },
  { name: "Internal threat blindspot", impact: -15, positive: false },
  { name: "Missing compliance exp", impact: -12, positive: false },
  { name: "Legacy system risks", impact: -8, positive: false },
];

const managementShapFactors = [
  { name: "Roadmap execution speed", impact: 19, positive: true },
  { name: "User story precision", impact: 15, positive: true },
  { name: "Backlog prioritization", impact: 12, positive: true },
  { name: "Burn Rate management", impact: 10, positive: true },
  { name: "Missing technical depth", impact: -14, positive: false },
  { name: "Communication overhead", impact: -10, positive: false },
  { name: "No scaling experience", impact: -7, positive: false },
];

const defaultCourses = [
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

const fullStackCourses = [
  {
    title: "Docker & Kubernetes path",
    subtitle: "Infrastructure for modern developers.",
    platform: "Frontend Masters",
    level: "Adv",
    icon: "01",
    urgent: true,
  },
  {
    title: "System Design Interview",
    subtitle: "Master architectural patterns.",
    platform: "Educative",
    level: "Mid",
    icon: "02",
    urgent: true,
  },
  {
    title: "Testing React with Jest",
    subtitle: "Ensure product stability.",
    platform: "Testing JavaScript",
    level: "Mid",
    icon: "03",
    urgent: false,
  },
];

const dataAnalystCourses = [
  {
    title: "Applied Machine Learning",
    subtitle: "Close the ML gap for seniority.",
    platform: "Coursera / Stanford",
    level: "Adv",
    icon: "01",
    urgent: true,
  },
  {
    title: "A/B Testing Mastery",
    subtitle: "Essential for growth analytics.",
    platform: "CXL Institute",
    level: "Mid",
    icon: "02",
    urgent: true,
  },
  {
    title: "Advanced Statistics",
    subtitle: "Deepen your analytical foundation.",
    platform: "edX",
    level: "Mid",
    icon: "03",
    urgent: false,
  },
];

const aiCourses = [
  {
    title: "MLOps Specialization",
    subtitle: "Scale your models to production.",
    platform: "DeepLearning.AI",
    level: "Adv",
    icon: "01",
    urgent: true,
  },
  {
    title: "Generative AI Fundamentals",
    subtitle: "Master LLMs and GANs.",
    platform: "Weights & Biases",
    level: "Mid",
    icon: "02",
    urgent: true,
  },
  {
    title: "GPU Programming in C++",
    subtitle: "Optimize for inference hardware.",
    platform: "NVIDIA Institute",
    level: "Adv",
    icon: "03",
    urgent: false,
  },
];

const cloudCourses = [
  {
    title: "Cert. Kubernetes Admin",
    subtitle: "Professional cluster management.",
    platform: "Linux Foundation",
    level: "Adv",
    icon: "01",
    urgent: true,
  },
  {
    title: "AWS Solutions Architect",
    subtitle: "Design scalable cloud systems.",
    platform: "A Cloud Guru",
    level: "Mid",
    icon: "02",
    urgent: true,
  },
  {
    title: "Terraform Best Practices",
    subtitle: "Master Infra as Code.",
    platform: "HashiCorp University",
    level: "Mid",
    icon: "03",
    urgent: false,
  },
];

const securityCourses = [
  {
    title: "Offensive Security (OSCP)",
    subtitle: "Elite level penetration testing.",
    platform: "OffSec",
    level: "Adv",
    icon: "01",
    urgent: true,
  },
  {
    title: "AWS Cloud Security",
    subtitle: "Secure your cloud perimeter.",
    platform: "Sans Institute",
    level: "Mid",
    icon: "02",
    urgent: true,
  },
  {
    title: "Forensics & Response",
    subtitle: "Identify post-breach vectors.",
    platform: "Cybrary",
    level: "Mid",
    icon: "03",
    urgent: false,
  },
];

const managementCourses = [
  {
    title: "Product Strategy",
    subtitle: "Master market fit and growth.",
    platform: "Reforge",
    level: "Adv",
    icon: "01",
    urgent: true,
  },
  {
    title: "Scrum Master Certification",
    subtitle: "Elite level agile orchestration.",
    platform: "Scrum.org",
    level: "Mid",
    icon: "02",
    urgent: true,
  },
  {
    title: "Advanced Negotiation",
    subtitle: "Manage difficult stakeholders.",
    platform: "Harvard Business School",
    level: "Mid",
    icon: "03",
    urgent: false,
  },
];

/* ─── Score Brutalist Display ─── */
function ScoreDisplay({ score, isQualified }: { score: number; isQualified: boolean }) {
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
            Qualification
          </div>
          <div className={`font-bold text-xl uppercase ${isQualified ? "text-black" : "text-[#FF2A00]"}`}>
            {isQualified ? "[ MATCHED ]" : "[ GAP FOUND ]"}
          </div>
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
function ShapChart({ factors }: { factors: typeof defaultShapFactors }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true });
  const maxVal = Math.max(...factors.map((f) => Math.abs(f.impact)));

  return (
    <div ref={ref} className="space-y-1 mt-6">
      <div className="flex font-mono text-[10px] text-[#666] uppercase border-b border-[#222] pb-2 mb-4">
        <div className="w-1/3">VECTOR</div>
        <div className="w-2/3 flex">
          <div className="w-1/2 text-right pr-2">NEGATIVE</div>
          <div className="w-1/2 pl-2 border-l border-[#222]">POSITIVE</div>
        </div>
      </div>
      {factors.map((factor, i) => (
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

/* ─── PAGE ─── */
export default function DashboardPage() {
  const { data: session, status } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/login");
    }
  }, [status, router]);

  const [jobState, setJobState] = useState<{
    title: string;
    location: string;
    salary: string;
    matchScore: number;
    isQualified: boolean;
    loading: boolean;
  }>({
    title: jobData.title,
    location: jobData.location,
    salary: jobData.salary,
    matchScore: jobData.matchScore,
    isQualified: true,
    loading: true,
  });

  const [activeSkills, setActiveSkills] = useState(defaultSkills);
  const [activeShap, setActiveShap] = useState(defaultShapFactors);
  const [activeCourses, setActiveCourses] = useState(defaultCourses);

  useEffect(() => {
    const savedData = localStorage.getItem("careerlens_job_data");
    if (savedData) {
      try {
        const parsed = JSON.parse(savedData);
        // Safety: only take first line and limit length to keep UI clean
        let title = (parsed.title || "Untitled Position").split('\n')[0].trim();

        // If it looks like a sentence (more than 4 words), aggressively truncate
        const words = title.split(/\s+/);
        if (words.length > 4) {
          title = words.slice(0, 3).join(" ") + "...";
        }

        if (title.length > 40) title = title.substring(0, 37) + "...";

        const lowTitle = title.toLowerCase();

        const isFullStack = lowTitle.includes("full stack");
        const isFrontend = lowTitle.includes("frontend") || lowTitle.includes("front end");
        const isBackend = lowTitle.includes("backend") || lowTitle.includes("back end");

        const isDataAnalyst =
          lowTitle.includes("data analyst") ||
          lowTitle.includes("business analyst") ||
          lowTitle.includes("analytics");

        const isAI =
          lowTitle.includes("ai ") ||
          lowTitle.includes("machine learning") ||
          lowTitle.includes("nlp") ||
          lowTitle.includes("neural") ||
          lowTitle.includes("prompt engineer");

        const isCloud =
          lowTitle.includes("cloud") ||
          lowTitle.includes("devops") ||
          lowTitle.includes("sre") ||
          lowTitle.includes("platform") ||
          lowTitle.includes("aws") ||
          lowTitle.includes("azure");

        const isSecurity =
          lowTitle.includes("security") ||
          lowTitle.includes("cyber") ||
          lowTitle.includes("hacker") ||
          lowTitle.includes("penetration");

        const isManagement =
          lowTitle.includes("manager") ||
          lowTitle.includes("product owner") ||
          lowTitle.includes("scrum") ||
          lowTitle.includes("lead") ||
          lowTitle.includes("consultant");

        // Initialize active sets based on role
        let skills = getSkillsForRole(title);
        let shap = defaultShapFactors;
        if (isFullStack) shap = fullStackShapFactors;
        else if (isFrontend) shap = frontendShapFactors;
        else if (isBackend) shap = backendShapFactors;
        else if (isDataAnalyst) shap = dataAnalystShapFactors;
        else if (isAI) shap = aiShapFactors;
        else if (isCloud) shap = cloudShapFactors;
        else if (isSecurity) shap = securityShapFactors;
        else if (isManagement) shap = managementShapFactors;

        let courses = defaultCourses;
        let salary = "$160k – $210k"; // Default salary

        // Qualification Check: Search for degree keywords in description
        const description = (parsed.description || "").toUpperCase();
        const hasQualification =
          description.includes("B.TECH") ||
          description.includes("BCA") ||
          description.includes("MCA") ||
          description.includes("B.SC") ||
          description.includes("BACHELOR") ||
          description.includes("DEGREE");

        if (isFullStack) {
          courses = fullStackCourses;
          salary = "$140k – $190k";
        } else if (isFrontend) {
          courses = fullStackCourses;
          salary = "$130k – $180k";
        } else if (isBackend) {
          courses = fullStackCourses;
          salary = "$135k – $185k";
        } else if (isDataAnalyst) {
          courses = dataAnalystCourses;
          salary = "$120k – $165k";
        } else if (isAI) {
          courses = aiCourses;
          salary = "$150k – $220k";
        } else if (isCloud) {
          courses = cloudCourses;
          salary = "$135k – $185k";
        } else if (isSecurity) {
          courses = securityCourses;
          salary = "$130k – $180k";
        } else if (isManagement) {
          courses = managementCourses;
          salary = "$150k – $200k";
        }

        // DYNAMIC SCORING LOGIC: (Skills Present / Total Skills) * 100
        const totalSkills = skills.length;
        const presentSkills = skills.filter(s => s.has).length;
        const calculatedScore = Math.round((presentSkills / totalSkills) * 100);

        setJobState({
          title: title,
          location: "Parsed from Payload",
          salary: salary,
          matchScore: calculatedScore,
          isQualified: hasQualification, // Link the check to state
          loading: false,
        });

        setActiveSkills(skills);
        setActiveShap(shap);
        setActiveCourses(courses);
      } catch (e) {
        console.error("Failed to parse job data", e);
        setJobState((prev) => ({ ...prev, loading: false }));
      }
    } else {
      setJobState((prev) => ({ ...prev, title: "", loading: false }));
    }
  }, []);

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

  if (jobState.loading) {
    return (
      <div className="min-h-screen structural-bg flex items-center justify-center">
        <div className="font-mono text-[#D6FF00] animate-pulse uppercase tracking-widest">
          [ DECRYPTING_REPORT... ]
        </div>
      </div>
    );
  }

  if (!jobState.title) {
    return (
      <div className="min-h-screen structural-bg flex flex-col items-center justify-center p-6 text-center">
        <motion.div
          initial="hidden"
          animate="visible"
          variants={fadeUp}
          className="max-w-md brutalist-card p-12 bg-black border-[#222]"
        >
          <div className="w-16 h-16 bg-[#222] flex items-center justify-center mx-auto mb-8 border border-[#333]">
            <BarChart2 className="w-8 h-8 text-[#888]" />
          </div>
          <h2 className="display-title text-3xl text-white uppercase mb-4">
            REPORT_EMPTY
          </h2>
          <p className="font-mono text-xs text-[#888] uppercase mb-10 leading-relaxed">
            No vectorized payload detected in local cache. Transmit job
            description and resume to generate diagnostic report.
          </p>
          <Link
            href="/upload"
            className="brutalist-button inline-flex items-center gap-2 px-8 h-12"
          >
            INITIALIZE UPLOAD <ArrowRight className="w-4 h-4" />
          </Link>
        </motion.div>
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
                ID: 0x8F9B2A
              </span>
            </div>
            <h1 className="display-title text-3xl md:text-4xl text-white uppercase mb-2 leading-none">
              {jobState.title}
            </h1>
            <div className="font-mono text-xs text-[#888] uppercase flex flex-col md:flex-row items-start md:items-center gap-2 md:gap-4">
              <span>[{jobState.location}]</span>
              <span className="text-[#0047FF]">[{jobState.salary}]</span>
            </div>
          </div>
          <div className="flex items-center gap-4 w-full md:w-auto">
            <Link
              href="/upload"
              className="font-mono text-xs font-bold uppercase text-white hover:text-[#0047FF] transition-colors focus-ring h-12 flex items-center px-6 border border-[#222] bg-black"
            >
              [ RESCAN ]
            </Link>
            <button className="brutalist-button h-12 px-6 flex-1 md:flex-none">
              DEPLOY AGENT
            </button>
          </div>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Left Column */}
          <div className="lg:col-span-4 flex flex-col gap-8">
            <motion.div initial="hidden" animate="visible" variants={fadeUp}>
              <ScoreDisplay score={jobState.matchScore} isQualified={jobState.isQualified} />
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
                    {activeSkills.map((skill) => (
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
                  <ShapChart factors={activeShap} />
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
                    {activeCourses.map((c) => (
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
