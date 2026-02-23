"use client";

import { useRef } from "react";
import { motion, useInView, Variants } from "framer-motion";
import Link from "next/link";
import { ArrowRight, Check, TrendingUp, Cpu, Server, Lock } from "lucide-react";

/* ─── Animation Variants ─── */
const fadeUp: Variants = {
  hidden: { opacity: 0, y: 40 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] },
  },
};
const stagger = {
  visible: { transition: { staggerChildren: 0.1 } },
};

function AnimatedSection({
  children,
  className = "",
}: {
  children: React.ReactNode;
  className?: string;
}) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-100px" });
  return (
    <motion.div
      ref={ref}
      variants={stagger}
      initial="hidden"
      animate={inView ? "visible" : "hidden"}
      className={className}
    >
      {children}
    </motion.div>
  );
}

/* ─── HERO ─── */
function Hero() {
  return (
    <section className="relative min-h-[90vh] flex flex-col items-center justify-center overflow-hidden structural-bg pt-20 md:pt-24 border-b border-[#222]">
      <div className="w-full max-w-[1400px] mx-auto px-4 md:px-6 py-12 md:py-20 flex flex-col lg:flex-row items-center gap-12 z-10">
        {/* Left Copy */}
        <AnimatedSection className="flex-1 max-w-2xl">
          <motion.div
            variants={fadeUp}
            className="mb-8 font-mono text-xs uppercase tracking-widest text-[#D6FF00] flex items-center gap-3"
          >
            <span className="w-2 h-2 bg-[#D6FF00] animate-pulse rounded-none" />
            Resume Intelligence Engine v3.0
          </motion.div>
          <motion.h1
            variants={fadeUp}
            className="display-title text-5xl md:text-7xl lg:text-8xl mb-6 text-balance text-white"
          >
            KNOW YOUR <br />
            <span
              className="text-transparent"
              style={{ WebkitTextStroke: "2px #D6FF00" }}
            >
              ALGORITHMIC
            </span>{" "}
            <br />
            RANKING.
          </motion.h1>
          <motion.p
            variants={fadeUp}
            className="text-xl text-[#888] mb-10 leading-relaxed text-balance font-medium"
          >
            Analyze your resume against precise ATS algorithms in real-time.
            Uncover blind spots, compute benchmark scores, and fix your
            application before submission.
          </motion.p>
          <motion.div
            variants={fadeUp}
            className="flex flex-col sm:flex-row gap-4"
          >
            <Link
              href="/upload"
              className="brutalist-button px-8 py-5 text-lg inline-flex items-center justify-center gap-3 w-full sm:w-auto focus-ring"
            >
              INITIALIZE SCAN <ArrowRight className="w-6 h-6" />
            </Link>
            <Link
              href="/dashboard"
              className="px-8 py-5 text-lg font-bold uppercase text-white border border-[#222] bg-black hover:bg-[#111] transition-colors inline-flex items-center justify-center w-full sm:w-auto focus-ring"
            >
              VIEW LIVE DEMO
            </Link>
          </motion.div>
          <motion.div
            variants={fadeUp}
            className="mt-8 font-mono text-xs text-[#666] uppercase flex items-center gap-4"
          >
            <span>[ SOC2 TYPE II COMPLIANT ]</span>
            <span>[ 0-DAY RETENTION ]</span>
          </motion.div>
        </AnimatedSection>

        {/* Right Asset - Brutalist Card */}
        <AnimatedSection className="flex-1 w-full max-w-lg">
          <motion.div
            variants={fadeUp}
            className="brutalist-card p-0 overflow-hidden relative group"
          >
            <div className="border-b border-[#222] bg-[#0047FF] px-4 py-2 flex items-center justify-between">
              <span className="font-mono text-xs font-bold text-white uppercase tracking-widest">
                Analysis Matrix
              </span>
              <div className="flex gap-1.5">
                <div className="w-3 h-3 bg-black" />
                <div className="w-3 h-3 bg-[#D6FF00]" />
              </div>
            </div>
            <div className="p-8 bg-black">
              <div className="flex justify-between items-end mb-8 border-b border-[#222] pb-4">
                <div>
                  <h3 className="text-2xl font-bold uppercase text-white mb-1">
                    Sr. Product Designer
                  </h3>
                  <p className="font-mono text-[#888] text-xs uppercase">
                    Target: Tech Tier 1
                  </p>
                </div>
                <div className="text-right">
                  <div className="display-title text-5xl sm:text-6xl text-[#D6FF00] leading-none mb-1">
                    94
                  </div>
                  <div className="font-mono text-[10px] uppercase text-[#666] tracking-widest">
                    SCORE
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <p className="font-mono text-xs text-[#0047FF] font-bold uppercase mb-2">
                  Critical Vectors
                </p>
                {[
                  {
                    icon: "01",
                    label: "Impact Metrics",
                    desc: "Sufficiently quantified",
                    color: "#D6FF00",
                  },
                  {
                    icon: "02",
                    label: "Semantic Density",
                    desc: "Top 4% bracket",
                    color: "#D6FF00",
                  },
                  {
                    icon: "03",
                    label: "Missing Signals",
                    desc: "No leadership keywords",
                    color: "#FF2A00",
                  },
                ].map((item) => (
                  <div
                    key={item.label}
                    className="flex items-start gap-4 p-4 border border-[#222] bg-[#050505] group-hover:border-[#333] transition-colors"
                  >
                    <span
                      className="font-mono text-xs font-bold"
                      style={{ color: item.color }}
                    >
                      {item.icon}
                    </span>
                    <div>
                      <div className="text-sm font-bold uppercase text-white mb-1">
                        {item.label}
                      </div>
                      <div className="font-mono text-[#888] text-xs uppercase">
                        {item.desc}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        </AnimatedSection>
      </div>
    </section>
  );
}

/* ─── METRICS MARQUEE ─── */
const companies = [
  "META",
  "STRIPE",
  "ALPHABET",
  "MICROSOFT",
  "SHOPIFY",
  "NETFLIX",
  "AIRBNB",
  "UBER",
];
function TrustedBy() {
  return (
    <section className="border-b border-[#222] bg-[#050505] py-6 flex items-center overflow-hidden">
      <div className="px-6 font-mono text-[10px] text-[#666] uppercase tracking-widest border-r border-[#222] flex-shrink-0 whitespace-nowrap bg-[#050505] relative z-10 h-full flex items-center mr-6">
        Analyzed against algorithms at
      </div>
      <div className="relative overflow-hidden w-full flex items-center">
        <div className="marquee-track flex gap-12 items-center">
          {[...companies, ...companies].map((c, i) => (
            <span
              key={i}
              className="font-bold text-xl uppercase tracking-tighter text-[#444] cursor-default px-4"
            >
              {c}
            </span>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ─── FEATURES ─── */
const features = [
  {
    icon: Cpu,
    title: "Algorithmic Precision",
    description:
      "Decode hidden semantic requirements exactly as Applicant Tracking Systems read them.",
    stat: "2.3X MATCH RATE",
    color: "#D6FF00",
  },
  {
    icon: Server,
    title: "Data Benchmarking",
    description:
      "Evaluate your profile symmetrically against fifty-thousand successful data points.",
    stat: "50K+ DB SIZE",
    color: "#0047FF",
  },
  {
    icon: TrendingUp,
    title: "Instant Optimization",
    description:
      "Adopt impact-driven phrasing generated by language models trained strictly on top-tier resumes.",
    stat: "+18 POINTS AVG",
    color: "#FF2A00",
  },
];

function Features() {
  return (
    <section
      id="features"
      className="py-20 md:py-32 w-full max-w-[1400px] mx-auto px-4 md:px-6 border-b border-[#222]"
    >
      <AnimatedSection className="mb-12 md:mb-20 max-w-3xl">
        <h2 className="display-title text-4xl md:text-6xl lg:text-7xl mb-6 text-white text-balance">
          ELIMINATE THE <br />
          <span className="text-[#0047FF]">BLIND SPOTS.</span>
        </h2>
        <p className="text-xl text-[#888] font-medium leading-relaxed text-balance">
          Recruiting algorithms do not care about your narrative. They care
          about structure, keyword densities, and quantifiable impact. We
          measure all three.
        </p>
      </AnimatedSection>

      <AnimatedSection className="grid grid-cols-1 md:grid-cols-3 gap-0 border border-[#222] bg-[#050505]">
        {features.map((feat, index) => {
          const Icon = feat.icon;
          return (
            <motion.div
              key={feat.title}
              variants={fadeUp}
              className={`p-10 border-b md:border-b-0 ${index !== 2 ? "md:border-r border-[#222]" : ""} hover:bg-[#0a0a0a] transition-colors relative group overflow-hidden`}
            >
              <div
                className="absolute top-0 left-0 w-full h-1 bg-[#222] group-hover:h-2 transition-all"
                style={{ backgroundColor: feat.color }}
              />
              <div className="mb-6 flex items-center justify-between">
                <Icon className="w-8 h-8 text-white group-hover:scale-110 transition-transform" />
                <span className="font-mono text-xs font-bold px-3 py-1 bg-[#111] text-[#888] border border-[#222]">
                  {feat.stat}
                </span>
              </div>
              <h3 className="text-2xl font-bold uppercase text-white mb-4">
                {feat.title}
              </h3>
              <p className="text-[#888] text-sm leading-relaxed font-medium">
                {feat.description}
              </p>
            </motion.div>
          );
        })}
      </AnimatedSection>
    </section>
  );
}

/* ─── HOW IT WORKS ─── */
const steps = [
  {
    num: "01",
    title: "Ingest Payload",
    desc: "Upload PDF or DOCX formats for immediate vectorization.",
  },
  {
    num: "02",
    title: "Execute Analysis",
    desc: "Calculate ATS compliance, structure, and semantic density.",
  },
  {
    num: "03",
    title: "Compile Insights",
    desc: "Target specific data gaps and generate algorithmic corrections.",
  },
  {
    num: "04",
    title: "Deploy Update",
    desc: "Export optimized payload and deploy application with ranking confidence.",
  },
];

function HowItWorks() {
  return (
    <section className="py-20 md:py-32 w-full max-w-[1400px] mx-auto px-4 md:px-6 border-b border-[#222]">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 md:gap-16">
        <AnimatedSection className="lg:col-span-4">
          <h2 className="display-title text-3xl md:text-4xl mb-6 text-white text-balance">
            PIPELINE <br />
            <span className="text-[#D6FF00]">EXECUTION.</span>
          </h2>
          <p className="text-lg text-[#888] font-medium leading-relaxed">
            Four structural steps to completely re-engineer your application
            process.
          </p>
        </AnimatedSection>

        <AnimatedSection className="lg:col-span-8 grid grid-cols-1 sm:grid-cols-2 gap-8">
          {steps.map((step) => (
            <motion.div
              key={step.num}
              variants={fadeUp}
              className="brutalist-card p-6 md:p-8 bg-[#050505]"
            >
              <div className="font-mono text-3xl font-black text-[#222] mb-4">
                {step.num}
              </div>
              <h3 className="font-bold uppercase text-white mb-4 text-xl">
                {step.title}
              </h3>
              <p className="text-sm text-[#888] font-medium leading-relaxed">
                {step.desc}
              </p>
            </motion.div>
          ))}
        </AnimatedSection>
      </div>
    </section>
  );
}

/* ─── TESTIMONIALS ─── */
const testimonials = [
  {
    name: "Priya Sharma",
    role: "SWE @ Google",
    text: "“Detected zero-density keywords in my engineering section instantly. Tripled interview conversion rate in 7 days.”",
  },
  {
    name: "Marcus Johnson",
    role: "PM @ Meta",
    text: "“The benchmarking metric justified a top-band salary negotiation. Raw data outperforms storytelling.”",
  },
  {
    name: "Aisha Patel",
    role: "UX @ Airbnb",
    text: "“Semantic rebuilding translated vague bullet points into direct impact coordinates. Essential tooling.”",
  },
];

function Testimonials() {
  return (
    <section className="py-20 md:py-32 bg-[#D6FF00] border-b border-[#222]">
      <div className="w-full max-w-[1400px] mx-auto px-4 md:px-6">
        <AnimatedSection className="mb-12 md:mb-16">
          <h2 className="display-title text-4xl md:text-6xl text-black">
            DATA <br /> CONFIRMATION.
          </h2>
        </AnimatedSection>
        <AnimatedSection className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {testimonials.map((t) => (
            <motion.div
              key={t.name}
              variants={fadeUp}
              className="brutalist-card p-8 bg-[#050505] relative hover:-translate-y-2 transition-transform"
            >
              <p className="text-[#F3F3F3] text-lg font-medium leading-relaxed mb-10 text-balance">
                {t.text}
              </p>
              <div className="flex items-center gap-4 mt-auto border-t border-[#222] pt-6">
                <div className="font-mono font-bold text-[#D6FF00] text-sm uppercase">
                  {t.name}
                </div>
                <div className="w-1 h-1 bg-[#222]" />
                <div className="font-mono text-[#666] text-xs uppercase">
                  {t.role}
                </div>
              </div>
            </motion.div>
          ))}
        </AnimatedSection>
      </div>
    </section>
  );
}

/* ─── PRICING ─── */
const plans = [
  {
    name: "Trial",
    price: "$0",
    metric: "MONTH",
    desc: "Bootstrap phase.",
    features: ["3 Analyses", "Baseline Score", "PDF Export"],
    cta: "INITIALIZE",
    href: "/upload",
    primary: false,
  },
  {
    name: "Pro",
    price: "$19",
    metric: "MONTH",
    desc: "Active cycle.",
    features: [
      "Unlimited Pipeline",
      "Benchmarking",
      "Neural Rephrasing",
      "SHAP Matrix",
    ],
    cta: "UPGRADE",
    href: "/upload",
    primary: true,
  },
];

function Pricing() {
  return (
    <section
      id="pricing"
      className="py-20 md:py-32 structural-bg border-b border-[#222]"
    >
      <div className="w-full max-w-[1400px] mx-auto px-4 md:px-6">
        <AnimatedSection className="mb-12 md:mb-16 text-center">
          <h2 className="display-title text-4xl md:text-5xl text-white mb-6 text-balance">
            ACCESS TIERS.
          </h2>
          <p className="text-[#888] font-mono text-sm uppercase max-w-md mx-auto">
            Select operational parameter limits. Modify dynamically.
          </p>
        </AnimatedSection>

        <AnimatedSection className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
          {plans.map((plan) => (
            <motion.div
              key={plan.name}
              variants={fadeUp}
              className={`brutalist-card flex flex-col p-0 overflow-hidden ${plan.primary ? "border-[#0047FF]" : ""}`}
            >
              <div
                className={`p-4 border-b border-[#222] flex justify-between items-center ${plan.primary ? "bg-[#0047FF]" : "bg-[#111]"}`}
              >
                <h3 className="font-bold uppercase text-white text-lg">
                  {plan.name}
                </h3>
                <span className="font-mono text-[10px] text-white/70 uppercase">
                  {plan.desc}
                </span>
              </div>
              <div className="p-8 flex-1 bg-[#050505] flex flex-col">
                <div className="flex items-baseline gap-2 mb-8">
                  <span className="display-title text-5xl text-white">
                    {plan.price}
                  </span>
                  <span className="font-mono text-xs text-[#666] uppercase">
                    / {plan.metric}
                  </span>
                </div>
                <ul className="space-y-4 flex-1 mb-8 border-t border-[#222] pt-8">
                  {plan.features.map((f) => (
                    <li
                      key={f}
                      className="flex items-center gap-4 text-sm font-medium text-[#ccc] uppercase font-mono"
                    >
                      <div
                        className={`w-1.5 h-1.5 ${plan.primary ? "bg-[#D6FF00]" : "bg-[#444]"}`}
                      />
                      {f}
                    </li>
                  ))}
                </ul>
                <Link
                  href={plan.href}
                  className={`py-4 px-6 font-bold uppercase text-center w-full focus-ring border ${
                    plan.primary
                      ? "bg-[#D6FF00] text-black border-transparent hover:bg-[#b0cc00]"
                      : "bg-transparent text-white border-[#333] hover:bg-[#111]"
                  } transition-colors`}
                >
                  {plan.cta}
                </Link>
              </div>
            </motion.div>
          ))}
        </AnimatedSection>
      </div>
    </section>
  );
}

/* ─── CTA BANNER ─── */
const terminalContainer: Variants = {
  hidden: { opacity: 0, scale: 0.95, filter: "blur(10px)", y: 40 },
  visible: {
    opacity: 1,
    scale: 1,
    filter: "blur(0px)",
    y: 0,
    transition: {
      duration: 0.8,
      ease: [0.22, 1, 0.36, 1],
      staggerChildren: 0.15,
    },
  },
};

const terminalItem: Variants = {
  hidden: { opacity: 0, y: 20, filter: "blur(5px)" },
  visible: {
    opacity: 1,
    y: 0,
    filter: "blur(0px)",
    transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] },
  },
};

function CTABanner() {
  return (
    <section className="py-20 md:py-32 bg-black border-b border-[#222]">
      <div className="w-full max-w-[1400px] mx-auto px-4 md:px-6 text-center">
        <AnimatedSection>
          <motion.div
            variants={terminalContainer}
            className="brutalist-card p-8 md:p-12 lg:p-24 bg-[#050505] border-[#D6FF00] shadow-[8px_8px_0_#D6FF00] relative overflow-hidden"
          >
            <div className="scan-line-acid opacity-30" />
            <motion.h2
              variants={terminalItem}
              className="display-title text-4xl md:text-5xl lg:text-7xl text-white mb-6 text-balance relative z-10"
            >
              SYSTEM TERMINAL <br />{" "}
              <span className="text-[#D6FF00]">AWAITING INPUT.</span>
            </motion.h2>
            <motion.p
              variants={terminalItem}
              className="text-[#888] text-lg lg:text-xl font-medium mb-12 max-w-xl mx-auto text-balance relative z-10"
            >
              Transmit resume data for immediate analysis. First parsing cycle
              is free.
            </motion.p>
            <motion.div variants={terminalItem}>
              <Link
                href="/upload"
                className="brutalist-button px-12 py-6 text-xl inline-flex items-center justify-center gap-4 focus-ring w-full sm:w-auto relative z-10 group"
              >
                EXECUTE{" "}
                <span className="font-mono text-sm opacity-50 bg-black/20 px-2 py-0.5 rounded group-hover:opacity-100 transition-opacity">
                  Enter ↵
                </span>
              </Link>
            </motion.div>
          </motion.div>
        </AnimatedSection>
      </div>
    </section>
  );
}

export default function LandingPage() {
  return (
    <main>
      <Hero />
      <TrustedBy />
      <Features />
      <HowItWorks />
      <Testimonials />
      <Pricing />
      <CTABanner />
    </main>
  );
}
