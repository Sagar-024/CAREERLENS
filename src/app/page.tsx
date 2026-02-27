"use client";

import { useRef, useState, useEffect } from "react";
import { motion, useInView, Variants } from "framer-motion";
import Link from "next/link";
import { ArrowRight, Check, TrendingUp, Cpu, Server, Lock } from "lucide-react";
import LoginModal from "@/components/ui/LoginModal";

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
    <section className="relative min-h-[90vh] flex flex-col items-center justify-center overflow-hidden bg-[#fafafa] dark:bg-[#050505] pt-20 md:pt-24 border-b border-gray-200 dark:border-[#222] transition-colors duration-500">
      <div className="absolute inset-0 opacity-[0.03] dark:opacity-[0.06] bg-[linear-gradient(#000_1px,transparent_1px),linear-gradient(90deg,#000_1px,transparent_1px)] dark:bg-[linear-gradient(#fff_1px,transparent_1px),linear-gradient(90deg,#fff_1px,transparent_1px)] bg-[size:48px_48px] pointer-events-none" />
      <div className="w-full max-w-[1400px] mx-auto px-4 md:px-6 py-12 md:py-20 flex flex-col lg:flex-row items-center gap-12 z-10">
        {/* Left Copy */}
        <AnimatedSection className="flex-1 max-w-2xl">
          <motion.div
            variants={fadeUp}
            className="mb-8 font-mono text-xs uppercase tracking-widest text-[#0047FF] dark:text-[#D6FF00] flex items-center gap-3 font-bold"
          >
            <span className="w-2 h-2 bg-[#0047FF] dark:bg-[#D6FF00] animate-pulse rounded-none" />
            AI-Powered Resume Intelligence
          </motion.div>
          <motion.h1
            variants={fadeUp}
            className="display-title text-4xl md:text-5xl lg:text-6xl mb-6 text-balance text-gray-900 dark:text-white font-extrabold tracking-tight leading-none"
          >
            KNOW EXACTLY WHY YOU KEEP GETTING <br />
            <span
              className="text-transparent"
              style={{ WebkitTextStroke: "2px currentColor" }}
              // Webkit text stroke requires setting the stroke color.
              // Using inline style specifically targeting dark mode overrides via CSS variables or standard Tailwind classes
            >
              <span className="text-gray-900 dark:text-[#D6FF00] webkit-text-stroke-magic">
                REJECTED.
              </span>
            </span>
          </motion.h1>
          <motion.p
            variants={fadeUp}
            className="text-xl text-gray-600 dark:text-[#888] mb-10 leading-relaxed text-balance font-medium"
          >
            Paste any job description. Upload your resume. Get your exact
            readiness score in 60 seconds.
          </motion.p>
          <motion.div
            variants={fadeUp}
            className="flex flex-col sm:flex-row gap-4 items-center"
          >
            <button
              onClick={() =>
                document.dispatchEvent(new CustomEvent("open-login-modal"))
              }
              className="px-8 py-5 text-lg inline-flex items-center justify-center gap-3 w-full sm:w-auto focus-ring bg-[#0047FF] dark:bg-[#D6FF00] text-white dark:text-black font-bold uppercase transition-transform hover:-translate-y-1 hover:shadow-xl shadow-[4px_4px_0_rgba(0,0,0,0.1)] dark:shadow-[4px_4px_0_#fff]"
            >
              GET MY SCORE FREE <ArrowRight className="w-6 h-6" />
            </button>
            <button
              onClick={() => {
                document
                  .getElementById("features")
                  ?.scrollIntoView({ behavior: "smooth" });
              }}
              className="px-8 py-5 text-lg font-bold uppercase text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors inline-flex items-center justify-center w-full sm:w-auto"
            >
              See how it works →
            </button>
          </motion.div>
          <motion.div
            variants={fadeUp}
            className="mt-8 font-mono text-xs text-gray-400 dark:text-[#666] uppercase flex items-center gap-4 font-bold dark:font-normal"
          >
            <span>[ SBERT SEMANTIC MATCHING ]</span>
            <span>[ SHAP EXPLAINABILITY ]</span>
          </motion.div>
        </AnimatedSection>

        {/* Right Asset - Brutalist Card */}
        <AnimatedSection className="flex-1 w-full max-w-lg">
          <motion.div
            variants={fadeUp}
            className="border-2 border-gray-200 dark:border-[#222] bg-white dark:bg-black shadow-[8px_8px_0_rgba(0,0,0,0.05)] dark:shadow-[8px_8px_0_rgba(255,255,255,0.05)] p-0 overflow-hidden relative group"
          >
            <div className="border-b-2 border-gray-200 dark:border-[#222] bg-[#0047FF] px-4 py-2 flex items-center justify-between">
              <span className="font-mono text-xs font-bold text-white uppercase tracking-widest">
                Analysis Matrix
              </span>
              <div className="flex gap-1.5">
                <div className="w-3 h-3 bg-black/50 dark:bg-black" />
                <div className="w-3 h-3 bg-[#D6FF00]" />
              </div>
            </div>
            <div className="p-8 bg-white dark:bg-black">
              <div className="flex justify-between items-end mb-8 border-b-2 border-gray-100 dark:border-[#222] pb-4">
                <div>
                  <h3 className="text-2xl font-black dark:font-bold uppercase text-gray-900 dark:text-white mb-1">
                    Sr. Product Designer
                  </h3>
                  <p className="font-mono text-gray-500 dark:text-[#888] text-xs uppercase font-bold dark:font-normal">
                    Target: Tech Tier 1
                  </p>
                </div>
                <div className="text-right">
                  <div className="display-title text-5xl sm:text-6xl text-[#0047FF] dark:text-[#D6FF00] leading-none mb-1 tabular-nums">
                    94
                  </div>
                  <div className="font-mono text-[10px] uppercase text-gray-400 dark:text-[#666] tracking-widest font-bold dark:font-normal">
                    SCORE
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <p className="font-mono text-xs text-[#0047FF] font-black dark:font-bold uppercase mb-2">
                  Critical Vectors
                </p>
                {[
                  {
                    icon: "01",
                    label: "Impact Metrics",
                    desc: "Sufficiently quantified",
                    color: "#0047FF",
                    darkColor: "#D6FF00",
                  },
                  {
                    icon: "02",
                    label: "Semantic Density",
                    desc: "Top 4% bracket",
                    color: "#0047FF",
                    darkColor: "#D6FF00",
                  },
                  {
                    icon: "03",
                    label: "Missing Signals",
                    desc: "No leadership keywords",
                    color: "#FF2A00",
                    darkColor: "#FF2A00",
                  },
                ].map((item) => (
                  <div
                    key={item.label}
                    className="flex items-start gap-4 p-4 border border-gray-100 dark:border-[#222] bg-gray-50 dark:bg-[#050505] group-hover:border-gray-200 dark:group-hover:border-[#333] transition-colors"
                  >
                    <span className="font-mono text-xs font-black dark:font-bold">
                      <span className="dark:hidden text-[#0047FF]">
                        {item.icon}
                      </span>
                      <span
                        className="hidden dark:inline"
                        style={{ color: item.darkColor }}
                      >
                        {item.icon}
                      </span>
                    </span>
                    <div>
                      <div className="text-sm font-bold uppercase text-gray-900 dark:text-white mb-1">
                        {item.label}
                      </div>
                      <div className="font-mono text-gray-500 dark:text-[#888] text-xs uppercase font-bold dark:font-normal">
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

      {/* Dynamic text stroke CSS based on theme */}
      <style
        dangerouslySetInnerHTML={{
          __html: `
        .webkit-text-stroke-magic {
          -webkit-text-stroke: 2px transparent;
        }
        .light .webkit-text-stroke-magic {
          -webkit-text-stroke: 2px #000;
          color: transparent;
        }
        .dark .webkit-text-stroke-magic {
          -webkit-text-stroke: 2px #D6FF00;
          color: transparent;
        }
      `,
        }}
      />
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
    <section className="border-b border-gray-200 dark:border-[#222] bg-white dark:bg-[#050505] py-6 flex items-center overflow-hidden transition-colors duration-500">
      <div className="px-6 font-mono text-[10px] text-gray-400 dark:text-[#666] uppercase tracking-widest border-r border-gray-200 dark:border-[#222] flex-shrink-0 whitespace-nowrap bg-white dark:bg-[#050505] relative z-10 h-full flex items-center mr-6 font-bold dark:font-normal transition-colors duration-500">
        Analyzed against algorithms at
      </div>
      <div className="relative overflow-hidden w-full flex items-center">
        <div className="marquee-track flex gap-12 items-center">
          {[...companies, ...companies].map((c, i) => (
            <span
              key={i}
              className="font-bold text-xl uppercase tracking-tighter text-gray-300 dark:text-[#444] cursor-default px-4 transition-colors"
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
    title: "Semantic Skill Matching",
    description:
      "SBERT (all-mpnet-base-v2) encodes your resume and the JD into vectors. 'ML' and 'Machine Learning' match. 'JS' and 'JavaScript' match. Keyword-based systems miss these entirely.",
    stat: "~85% ACCURACY",
    lightColor: "#0047FF",
    darkColor: "#D6FF00",
  },
  {
    icon: Server,
    title: "Dynamic JD Input",
    description:
      "Paste any job description — from Naukri, LinkedIn, or anywhere. Our NLP engine extracts required skills from that specific JD dynamically, not from a fixed pre-built dataset.",
    stat: "ANY JD, ANY ROLE",
    lightColor: "#000000",
    darkColor: "#0047FF",
  },
  {
    icon: TrendingUp,
    title: "SHAP Explainability",
    description:
      "Every score is explained. Your Python skills contributed +15%. Missing AWS reduced your score by -20%. Not just a number — the full reasoning behind it.",
    stat: "FULL EXPLAINABILITY",
    lightColor: "#FF2A00",
    darkColor: "#FF2A00",
  },
];

function Features() {
  return (
    <section
      id="features"
      className="py-20 md:py-32 w-full max-w-[1400px] mx-auto px-4 md:px-6 border-b border-gray-200 dark:border-[#222] transition-colors duration-500"
    >
      <AnimatedSection className="mb-12 md:mb-20 max-w-3xl">
        <h2 className="display-title text-4xl md:text-6xl lg:text-7xl mb-6 text-gray-900 dark:text-white text-balance transition-colors">
          WHAT EXISTING <br />
          <span className="text-[#0047FF]">SYSTEMS MISS.</span>
        </h2>
        <p className="text-xl text-gray-600 dark:text-[#888] font-medium leading-relaxed text-balance transition-colors">
          Current systems show only a ranked list of jobs without telling you
          WHY you are or are not a good fit. They use keyword matching that
          fails to understand meaning. We fix all of that.
        </p>
      </AnimatedSection>

      <AnimatedSection className="grid grid-cols-1 md:grid-cols-3 gap-0 border border-gray-200 dark:border-[#222] bg-white dark:bg-[#050505] transition-colors shadow-sm dark:shadow-none">
        {features.map((feat, index) => {
          const Icon = feat.icon;
          return (
            <motion.div
              key={feat.title}
              variants={fadeUp}
              className={`p-10 border-b border-gray-200 dark:border-[#222] md:border-b-0 ${index !== 2 ? "md:border-r" : ""} hover:bg-gray-50 dark:hover:bg-[#0a0a0a] transition-colors relative group overflow-hidden`}
            >
              {/* Uses dynamic inline styles to render the bar with the correct theme color */}
              <div
                className="absolute top-0 left-0 w-full h-1 bg-gray-200 dark:bg-[#222] group-hover:h-2 transition-all dark:hidden"
                style={{ backgroundColor: feat.lightColor }}
              />
              <div
                className="absolute top-0 left-0 w-full h-1 bg-gray-200 dark:bg-[#222] group-hover:h-2 transition-all hidden dark:block"
                style={{ backgroundColor: feat.darkColor }}
              />
              <div className="mb-6 flex items-center justify-between">
                <Icon className="w-8 h-8 text-gray-900 dark:text-white group-hover:scale-110 transition-transform" />
                <span className="font-mono text-xs font-black dark:font-bold px-3 py-1 bg-gray-100 dark:bg-[#111] text-gray-500 dark:text-[#888] border border-gray-200 dark:border-[#222] transition-colors">
                  {feat.stat}
                </span>
              </div>
              <h3 className="text-2xl font-black dark:font-bold uppercase text-gray-900 dark:text-white mb-4 transition-colors">
                {feat.title}
              </h3>
              <p className="text-gray-600 dark:text-[#888] text-sm leading-relaxed font-medium transition-colors">
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
    title: "Upload Resume",
    desc: "Upload your resume PDF. spaCy NER extracts a list of your skills automatically.",
  },
  {
    num: "02",
    title: "Paste Job Description",
    desc: "Paste the job description from any platform. Our NLP engine extracts the required skills from that specific JD.",
  },
  {
    num: "03",
    title: "SBERT Semantic Match",
    desc: "SBERT encodes both skill lists into vectors. Cosine similarity computes your exact match percentage.",
  },
  {
    num: "04",
    title: "Get Your Full Report",
    desc: "See your readiness score, every missing skill, personalized course recommendations, and SHAP explanations.",
  },
];

function HowItWorks() {
  return (
    <section className="py-20 md:py-32 w-full max-w-[1400px] mx-auto px-4 md:px-6 border-b border-gray-200 dark:border-[#222] transition-colors duration-500">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 md:gap-16">
        <AnimatedSection className="lg:col-span-4">
          <h2 className="display-title text-3xl md:text-4xl mb-6 text-gray-900 dark:text-white text-balance transition-colors">
            HOW IT <br />
            <span className="text-[#0047FF] dark:text-[#D6FF00]">WORKS.</span>
          </h2>
          <p className="text-lg text-gray-600 dark:text-[#888] font-medium leading-relaxed transition-colors">
            Four steps from resume to full readiness report.
          </p>
        </AnimatedSection>

        <AnimatedSection className="lg:col-span-8 grid grid-cols-1 sm:grid-cols-2 gap-8">
          {steps.map((step) => (
            <motion.div
              key={step.num}
              variants={fadeUp}
              className="brutalist-card p-6 md:p-8 relative hover:-translate-y-2 transition-transform"
            >
              <div className="font-mono text-3xl font-black text-gray-300 dark:text-[#222] mb-4 transition-colors">
                {step.num}
              </div>
              <h3 className="font-black dark:font-bold uppercase text-gray-900 dark:text-white mb-4 text-xl transition-colors">
                {step.title}
              </h3>
              <p className="text-sm text-gray-600 dark:text-[#888] font-medium leading-relaxed transition-colors">
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
    name: "Priya S.",
    role: "Final Year CSE",
    text: "“I pasted a data engineer JD and found out I was missing AWS and Docker. The course recommendations were exactly what I needed. Got the job within 6 weeks.”",
  },
  {
    name: "Rahul M.",
    role: "Job Seeker",
    text: "“The readiness score told me I was 62% ready for the role. When I added the missing skills to my resume, it jumped to 84%. I actually understood why.”",
  },
  {
    name: "Aisha K.",
    role: "B.Tech Graduate",
    text: "“I had 'ML' on my resume and the JD said 'Machine Learning'. Old systems would have missed that. This one matched it correctly and that changed my score.”",
  },
];

function Testimonials() {
  return (
    <section className="py-20 md:py-32 bg-[#0047FF] dark:bg-[#D6FF00] border-b border-[#000] dark:border-[#222] transition-colors duration-500">
      <div className="w-full max-w-[1400px] mx-auto px-4 md:px-6">
        <AnimatedSection className="mb-12 md:mb-16">
          <h2 className="display-title text-4xl md:text-6xl text-white dark:text-black transition-colors">
            DATA <br /> CONFIRMATION.
          </h2>
        </AnimatedSection>
        <AnimatedSection className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {testimonials.map((t) => (
            <motion.div
              key={t.name}
              variants={fadeUp}
              className="brutalist-card p-8 relative hover:-translate-y-2 transition-transform"
            >
              <p className="text-gray-900 dark:text-[#F3F3F3] text-lg font-medium leading-relaxed mb-10 text-balance transition-colors">
                {t.text}
              </p>
              <div className="flex items-center gap-4 mt-auto border-t border-gray-200 dark:border-[#222] pt-6 transition-colors">
                <div className="font-mono font-bold text-[#0047FF] dark:text-[#D6FF00] text-sm uppercase transition-colors">
                  {t.name}
                </div>
                <div className="w-1 h-1 bg-gray-300 dark:bg-[#222] transition-colors" />
                <div className="font-mono text-gray-400 dark:text-[#666] text-xs uppercase font-bold dark:font-normal transition-colors">
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
    name: "Free",
    price: "$0",
    metric: "MONTH",
    desc: "Get started.",
    features: ["5 Analyses", "Readiness Score", "Missing Skills Report"],
    cta: "START FREE",
    href: "/upload",
    primary: false,
  },
  {
    name: "Pro",
    price: "$9",
    metric: "MONTH",
    desc: "Full access.",
    features: [
      "Unlimited Analyses",
      "SBERT Semantic Matching",
      "Course Recommendations",
      "SHAP Score Explanation",
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
      className="py-20 md:py-32 bg-[#fafafa] dark:bg-[#050505] border-b border-gray-200 dark:border-[#222] transition-colors duration-500 relative"
    >
      <div className="absolute inset-0 opacity-[0.03] dark:opacity-[0.06] bg-[linear-gradient(#000_1px,transparent_1px),linear-gradient(90deg,#000_1px,transparent_1px)] dark:bg-[linear-gradient(#fff_1px,transparent_1px),linear-gradient(90deg,#fff_1px,transparent_1px)] bg-[size:48px_48px] pointer-events-none" />
      <div className="w-full max-w-[1400px] mx-auto px-4 md:px-6 relative z-10">
        <AnimatedSection className="mb-12 md:mb-16 text-center">
          <h2 className="display-title text-4xl md:text-5xl text-gray-900 dark:text-white mb-6 text-balance transition-colors">
            PRICING.
          </h2>
          <p className="text-gray-500 dark:text-[#888] font-mono text-sm uppercase max-w-md mx-auto font-bold dark:font-normal transition-colors">
            Free plan to get started. Upgrade for unlimited scans.
          </p>
        </AnimatedSection>

        <AnimatedSection className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
          {plans.map((plan) => (
            <motion.div
              key={plan.name}
              variants={fadeUp}
              className={`brutalist-card flex flex-col p-0 overflow-hidden ${plan.primary ? "border-[#0047FF] dark:border-[#0047FF]" : ""}`}
            >
              <div
                className={`p-4 border-b-2 border-gray-200 dark:border-b dark:border-[#222] flex justify-between items-center ${plan.primary ? "bg-[#0047FF] dark:bg-[#0047FF]" : "bg-gray-100 dark:bg-[#111]"} transition-colors`}
              >
                <h3
                  className={`font-black dark:font-bold uppercase text-lg ${plan.primary ? "text-white" : "text-gray-900 dark:text-white"}`}
                >
                  {plan.name}
                </h3>
                <span
                  className={`font-mono text-[10px] uppercase ${plan.primary ? "text-white/70" : "text-gray-500 dark:text-white/70"} font-bold dark:font-normal`}
                >
                  {plan.desc}
                </span>
              </div>
              <div className="p-8 flex-1 bg-white dark:bg-[#050505] flex flex-col transition-colors">
                <div className="flex items-baseline gap-2 mb-8">
                  <span className="display-title text-5xl text-gray-900 dark:text-white transition-colors">
                    {plan.price}
                  </span>
                  <span className="font-mono text-xs text-gray-400 dark:text-[#666] uppercase font-bold dark:font-normal transition-colors">
                    / {plan.metric}
                  </span>
                </div>
                <ul className="space-y-4 flex-1 mb-8 border-t-2 border-gray-100 dark:border-t dark:border-[#222] pt-8 transition-colors">
                  {plan.features.map((f) => (
                    <li
                      key={f}
                      className="flex items-center gap-4 text-sm font-bold dark:font-medium text-gray-600 dark:text-[#ccc] uppercase font-mono transition-colors"
                    >
                      <div
                        className={`w-1.5 h-1.5 ${plan.primary ? "bg-[#0047FF] dark:bg-[#D6FF00]" : "bg-gray-400 dark:bg-[#444]"} transition-colors`}
                      />
                      {f}
                    </li>
                  ))}
                </ul>
                <Link
                  href={plan.href}
                  className={`py-4 px-6 font-bold uppercase text-center w-full focus-ring border-2 transition-colors ${
                    plan.primary
                      ? "bg-[#0047FF] dark:bg-[#D6FF00] text-white dark:text-black border-transparent hover:bg-blue-700 dark:hover:bg-[#b0cc00]"
                      : "bg-white dark:bg-transparent text-gray-900 dark:text-white border-gray-200 dark:border-[#333] hover:bg-gray-50 dark:hover:bg-[#111]"
                  }`}
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
    <section className="py-20 md:py-32 bg-gray-50 dark:bg-black border-b border-gray-200 dark:border-[#222] transition-colors duration-500">
      <div className="w-full max-w-[1400px] mx-auto px-4 md:px-6 text-center">
        <AnimatedSection>
          <motion.div
            variants={terminalContainer}
            className="brutalist-card p-8 md:p-12 lg:p-24 relative overflow-hidden"
          >
            <div className="scan-line-acid opacity-10 dark:opacity-30" />
            <motion.h2
              variants={terminalItem}
              className="display-title text-4xl md:text-5xl lg:text-7xl text-gray-900 dark:text-white mb-6 text-balance relative z-10 transition-colors"
            >
              PASTE YOUR JD. <br />{" "}
              <span className="text-[#0047FF] dark:text-[#D6FF00] transition-colors">
                GET YOUR SCORE.
              </span>
            </motion.h2>
            <motion.p
              variants={terminalItem}
              className="text-gray-600 dark:text-[#888] text-lg lg:text-xl font-medium mb-12 max-w-xl mx-auto text-balance relative z-10 transition-colors"
            >
              Upload your resume, paste the job description, and know exactly
              how ready you are — which skills are missing and which courses
              close the gap.
            </motion.p>
            <motion.div variants={terminalItem}>
              <button
                onClick={() =>
                  document.dispatchEvent(new CustomEvent("open-login-modal"))
                }
                className="px-12 py-6 text-xl inline-flex items-center justify-center gap-4 focus-ring w-full sm:w-auto relative z-10 group bg-[#0047FF] dark:bg-[#D6FF00] text-white dark:text-black font-black dark:font-bold border-2 border-transparent uppercase transition-transform hover:-translate-y-1 hover:shadow-xl shadow-[4px_4px_0_rgba(0,0,0,0.1)] dark:shadow-[4px_4px_0_#fff]"
              >
                GET MY SCORE FREE{" "}
                <span className="font-mono text-sm opacity-50 bg-black/20 px-2 py-0.5 rounded group-hover:opacity-100 transition-opacity">
                  Enter ↵
                </span>
              </button>
            </motion.div>
          </motion.div>
        </AnimatedSection>
      </div>
    </section>
  );
}

export default function LandingPage() {
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);

  // Expose opening the modal from anywhere via an event
  useEffect(() => {
    const handleOpen = () => setIsLoginModalOpen(true);
    document.addEventListener("open-login-modal", handleOpen);
    return () => document.removeEventListener("open-login-modal", handleOpen);
  }, []);

  return (
    <main className="bg-white dark:bg-black transition-colors duration-500">
      <Hero />
      <TrustedBy />
      <Features />
      <HowItWorks />
      <Testimonials />
      <Pricing />
      <CTABanner />

      <LoginModal
        isOpen={isLoginModalOpen}
        onClose={() => setIsLoginModalOpen(false)}
      />
    </main>
  );
}
