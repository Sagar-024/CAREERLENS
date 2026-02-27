"use client";

import { useRef, useState } from "react";
import { motion, useInView, Variants } from "framer-motion";
import Link from "next/link";
import { ArrowUpRight, Check, ChevronRight } from "lucide-react";
import LoginModal from "@/components/ui/LoginModal";

/* ── Animation Variants ── */
const fadeUp: Variants = {
  hidden: { opacity: 0, y: 24 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] },
  },
};
const stagger = {
  visible: { transition: { staggerChildren: 0.1, delayChildren: 0.1 } },
};

function Reveal({
  children,
  className = "",
  delay = 0,
}: {
  children: React.ReactNode;
  className?: string;
  delay?: number;
}) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-60px" });
  return (
    <motion.div
      ref={ref}
      variants={stagger}
      initial="hidden"
      animate={inView ? "visible" : "hidden"}
      className={className}
      style={{ transitionDelay: `${delay}ms` }}
    >
      {children}
    </motion.div>
  );
}

/* ── Radial Score Ring SVG ── */
function ScoreRing({ score, size = 80 }: { score: number; size?: number }) {
  const strokeW = 3.5;
  const r = (size - strokeW * 2) / 2;
  const circ = 2 * Math.PI * r;
  const offset = circ - (score / 100) * circ;
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
          stroke="var(--accent)"
          strokeWidth={strokeW}
          strokeLinecap="round"
          strokeDasharray={circ}
          initial={{ strokeDashoffset: circ }}
          animate={{ strokeDashoffset: offset }}
          transition={{ duration: 1.4, ease: [0.22, 1, 0.36, 1], delay: 0.5 }}
        />
      </svg>
      <div className="absolute inset-0 flex items-center justify-center">
        <span
          className="text-base font-bold tabular-nums"
          style={{ color: "var(--text)" }}
        >
          {score}%
        </span>
      </div>
    </div>
  );
}

/* ── HERO ── */
function Hero() {
  const [loginOpen, setLoginOpen] = useState(false);
  return (
    <>
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden pb-24 ">
        {/* Ambient background glow */}
        <div
          className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[400px] rounded-full blur-[120px] pointer-events-none"
          style={{
            background:
              "radial-gradient(ellipse, rgba(232,169,70,0.07) 0%, transparent 70%)",
          }}
        />

        <div className="relative z-10 max-w-5xl mx-auto px-6 md:px-10 w-full">
          <Reveal className="flex flex-col lg:flex-row items-center gap-16 lg:gap-20">
            {/* Left — Copy */}
            <div className="flex-1 max-w-xl">
              <motion.div variants={fadeUp}>
                <span className="badge mb-6">
                  <span
                    className="w-1.5 h-1.5 rounded-full shrink-0 animate-pulse"
                    style={{ background: "var(--accent)" }}
                  />
                  Powered by SBERT + SHAP
                </span>
              </motion.div>

              <motion.h1
                variants={fadeUp}
                className="font-display-serif text-4xl sm:text-5xl md:text-[4rem] font-medium leading-[1.05] tracking-tight mb-8 text-balance"
                style={{ color: "var(--text)" }}
              >
                Know exactly{" "}
                <span className="italic" style={{ color: "var(--accent)" }}>
                  why
                </span>{" "}
                your resume isn&apos;t landing interviews.
              </motion.h1>

              <motion.p
                variants={fadeUp}
                className="text-base md:text-lg leading-relaxed mb-8 max-w-md text-pretty"
                style={{ color: "var(--text-body)" }}
              >
                Upload your resume against any job description. Get your exact
                readiness score, skills gaps, and what to fix — in 30 seconds.
              </motion.p>

              <motion.div
                variants={fadeUp}
                className="flex flex-wrap items-center gap-3 mb-8"
              >
                <button
                  onClick={() => setLoginOpen(true)}
                  className="btn-primary focus-ring"
                >
                  Analyze my resume
                  <ArrowUpRight className="w-4 h-4 shrink-0" />
                </button>
                <Link href="/#how-it-works" className="btn-ghost focus-ring">
                  How it works
                </Link>
              </motion.div>

              <motion.div
                variants={fadeUp}
                className="flex flex-wrap items-center gap-5"
              >
                {["Free to start", "Results in ~30s", "No credit card"].map(
                  (t) => (
                    <span
                      key={t}
                      className="flex items-center gap-1.5 text-xs font-medium"
                      style={{ color: "var(--text-muted)" }}
                    >
                      <div
                        className="w-1 h-1 rounded-full shrink-0"
                        style={{ background: "var(--accent)" }}
                      />
                      {t}
                    </span>
                  ),
                )}
              </motion.div>
            </div>

            {/* Right — Score Preview Card */}
            <motion.div
              variants={fadeUp}
              className="w-full max-w-[360px] shrink-0"
            >
              <div className="glass-card glow-amber p-7">
                {/* Score header */}
                <div className="flex items-start gap-5 mb-7">
                  <ScoreRing score={87} size={80} />
                  <div className="pt-2">
                    <p
                      className="text-[11px] font-semibold uppercase tracking-wider mb-1"
                      style={{ color: "var(--accent)" }}
                    >
                      Analysis Preview
                    </p>
                    <p
                      className="text-base font-bold leading-snug"
                      style={{ color: "var(--text)" }}
                    >
                      Full Stack Developer
                    </p>
                    <p
                      className="text-xs mt-1"
                      style={{ color: "var(--text-muted)" }}
                    >
                      Stripe · Senior Level
                    </p>
                  </div>
                </div>

                {/* Divider */}
                <div className="divider mb-5" />

                {/* Stats Row */}
                <div className="grid grid-cols-3 gap-3 mb-5">
                  {[
                    {
                      label: "Matched",
                      val: "12",
                      color: "var(--positive)",
                      bg: "var(--positive-dim)",
                    },
                    {
                      label: "Missing",
                      val: "5",
                      color: "var(--negative)",
                      bg: "var(--negative-dim)",
                    },
                    {
                      label: "Total in JD",
                      val: "17",
                      color: "var(--text-body)",
                      bg: "var(--bg-elevated)",
                    },
                  ].map((s) => (
                    <div
                      key={s.label}
                      className="text-center p-3 rounded-xl border"
                      style={{ background: s.bg, borderColor: "var(--border)" }}
                    >
                      <div
                        className="text-xl font-bold tabular-nums leading-none mb-1"
                        style={{ color: s.color }}
                      >
                        {s.val}
                      </div>
                      <div
                        className="text-[10px] font-medium uppercase tracking-wider"
                        style={{ color: "var(--text-muted)" }}
                      >
                        {s.label}
                      </div>
                    </div>
                  ))}
                </div>

                {/* Skill Tags */}
                <p
                  className="text-[10px] font-semibold uppercase tracking-wider mb-2.5"
                  style={{ color: "var(--text-muted)" }}
                >
                  Skills breakdown
                </p>
                <div className="flex flex-wrap gap-2">
                  {["React", "TypeScript", "Node.js", "PostgreSQL"].map((s) => (
                    <span
                      key={s}
                      className="inline-flex items-center gap-1 px-2.5 py-1 text-[11px] font-medium rounded-lg"
                      style={{
                        background: "var(--positive-dim)",
                        color: "var(--positive)",
                        border: "1px solid rgba(127,182,133,0.15)",
                      }}
                    >
                      <span
                        className="w-1 h-1 rounded-full shrink-0"
                        style={{ background: "var(--positive)" }}
                      />
                      {s}
                    </span>
                  ))}
                  {["Kubernetes", "GraphQL"].map((s) => (
                    <span
                      key={s}
                      className="inline-flex items-center gap-1 px-2.5 py-1 text-[11px] font-medium rounded-lg"
                      style={{
                        background: "var(--negative-dim)",
                        color: "var(--negative)",
                        border: "1px solid rgba(224,92,77,0.15)",
                      }}
                    >
                      <span
                        className="w-1 h-1 rounded-full shrink-0"
                        style={{ background: "var(--negative)" }}
                      />
                      {s}
                    </span>
                  ))}
                </div>
              </div>
            </motion.div>
          </Reveal>
        </div>
      </section>
      <LoginModal isOpen={loginOpen} onClose={() => setLoginOpen(false)} />
    </>
  );
}

/* ── HOW IT WORKS ── */
function HowItWorks() {
  const steps = [
    {
      num: "01",
      title: "Upload your resume",
      desc: "Drop your PDF or DOCX. We extract and parse every detail instantly.",
    },
    {
      num: "02",
      title: "Paste the job description",
      desc: "Copy the full job listing or just a title — our AI handles both.",
    },
    {
      num: "03",
      title: "Get your readiness score",
      desc: "SBERT semantic matching gives you a pinpoint score with actionable gaps.",
    },
  ];

  return (
    <section
      id="how-it-works"
      className="py-24 md:py-32 border-t"
      style={{ borderColor: "var(--border)" }}
    >
      <div className="max-w-5xl mx-auto px-6 md:px-10">
        <motion.p
          initial={{ opacity: 0, y: 10, filter: "blur(8px)" }}
          whileInView={{ opacity: 1, y: 0, filter: "blur(0px)" }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{ duration: 0.35 }}
          className="section-label text-center mb-3"
        >
          How It Works
        </motion.p>
        <motion.h2
          initial={{ opacity: 0, y: 10, filter: "blur(8px)" }}
          whileInView={{ opacity: 1, y: 0, filter: "blur(0px)" }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{ duration: 0.35, delay: 0.05 }}
          className="font-display-serif text-3xl md:text-4xl font-bold text-center mb-16 tracking-tight"
          style={{ color: "var(--text)" }}
        >
          Three steps. Thirty seconds.
        </motion.h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {steps.map((s, i) => (
            <motion.div
              key={s.num}
              initial={{ opacity: 0, y: 12, filter: "blur(8px)" }}
              whileInView={{ opacity: 1, y: 0, filter: "blur(0px)" }}
              viewport={{ once: true, margin: "-40px" }}
              transition={{ duration: 0.35, delay: i * 0.1 }}
              className="card group p-7 cursor-default"
            >
              <div
                className="text-3xl font-bold mb-5 tabular-nums"
                style={{ color: "var(--accent)" }}
              >
                {s.num}
              </div>
              <h3
                className="text-[15px] font-semibold mb-2"
                style={{ color: "var(--text)" }}
              >
                {s.title}
              </h3>
              <p
                className="text-sm leading-relaxed"
                style={{ color: "var(--text-body)" }}
              >
                {s.desc}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ── FEATURES ── */
function Features() {
  const features = [
    {
      title: "SBERT Semantic Matching",
      desc: "Understand meaning, not just keywords. Synonyms and related technologies matched automatically.",
    },
    {
      title: "SHAP Explainability",
      desc: "See exactly which skills boost or hurt your score, ranked by their impact on your readiness.",
    },
    {
      title: "Course Recommendations",
      desc: "For every gap skill, we surface the best free and paid courses to close it quickly.",
    },
    {
      title: "Private & Secure",
      desc: "Your resume is parsed in memory and deleted instantly. We never store personal documents.",
    },
  ];

  return (
    <section
      id="features"
      className="py-24 md:py-32 border-t"
      style={{ borderColor: "var(--border)" }}
    >
      <div className="max-w-5xl mx-auto px-6 md:px-10">
        <motion.p
          initial={{ opacity: 0, y: 10, filter: "blur(8px)" }}
          whileInView={{ opacity: 1, y: 0, filter: "blur(0px)" }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{ duration: 0.35 }}
          className="section-label text-center mb-3"
        >
          Features
        </motion.p>
        <motion.h2
          initial={{ opacity: 0, y: 10, filter: "blur(8px)" }}
          whileInView={{ opacity: 1, y: 0, filter: "blur(0px)" }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{ duration: 0.35, delay: 0.05 }}
          className="font-display-serif text-3xl md:text-4xl font-bold text-center mb-16 tracking-tight max-w-lg mx-auto"
          style={{ color: "var(--text)" }}
        >
          Built for serious job seekers.
        </motion.h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {features.map((f, i) => (
            <motion.div
              key={f.title}
              initial={{ opacity: 0, y: 12, filter: "blur(8px)" }}
              whileInView={{ opacity: 1, y: 0, filter: "blur(0px)" }}
              viewport={{ once: true, margin: "-40px" }}
              transition={{ duration: 0.35, delay: i * 0.1 }}
              className="card p-7 cursor-default"
            >
              <div
                className="w-9 h-9 rounded-lg flex items-center justify-center mb-4 text-sm font-bold"
                style={{
                  background: "var(--accent-dim)",
                  color: "var(--accent)",
                  border: "1px solid rgba(232,169,70,0.15)",
                }}
              >
                {String(i + 1).padStart(2, "0")}
              </div>
              <h3
                className="text-[15px] font-semibold mb-2"
                style={{ color: "var(--text)" }}
              >
                {f.title}
              </h3>
              <p
                className="text-sm leading-relaxed"
                style={{ color: "var(--text-body)" }}
              >
                {f.desc}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ── PRICING ── */
function Pricing() {
  const tiers = [
    {
      name: "Free",
      price: "$0",
      period: "forever",
      desc: "Perfect to get started.",
      features: [
        "2 resume analyses",
        "Overall readiness score",
        "Skills gap report",
      ],
      cta: "Get started free",
      href: "/upload",
      highlight: false,
    },
    {
      name: "Pro",
      price: "$9",
      period: "/ month",
      desc: "For active job seekers.",
      features: [
        "Unlimited analyses",
        "Full SHAP explanations",
        "Course recommendations",
        "Dashboard history",
        "Priority processing",
      ],
      cta: "Upgrade to Pro",
      href: "/upload",
      highlight: true,
    },
  ];
  return (
    <section
      id="pricing"
      className="py-24 md:py-32 border-t"
      style={{ borderColor: "var(--border)" }}
    >
      <div className="max-w-4xl mx-auto px-6 md:px-10">
        <motion.p
          initial={{ opacity: 0, y: 10, filter: "blur(8px)" }}
          whileInView={{ opacity: 1, y: 0, filter: "blur(0px)" }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{ duration: 0.35 }}
          className="section-label text-center mb-3"
        >
          Pricing
        </motion.p>
        <motion.h2
          initial={{ opacity: 0, y: 10, filter: "blur(8px)" }}
          whileInView={{ opacity: 1, y: 0, filter: "blur(0px)" }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{ duration: 0.35, delay: 0.05 }}
          className="font-display-serif text-3xl md:text-4xl font-bold text-center mb-16 tracking-tight"
          style={{ color: "var(--text)" }}
        >
          Simple, honest pricing.
        </motion.h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {tiers.map((t, i) => (
            <motion.div
              key={t.name}
              initial={{ opacity: 0, y: 12, filter: "blur(8px)" }}
              whileInView={{ opacity: 1, y: 0, filter: "blur(0px)" }}
              viewport={{ once: true, margin: "-40px" }}
              transition={{ duration: 0.35, delay: i * 0.1 }}
              className="flex flex-col p-7 rounded-2xl border"
              style={{
                background: "var(--bg-card)",
                borderColor: t.highlight ? "var(--accent)" : "var(--border)",
                boxShadow: t.highlight
                  ? "0 0 0 1px var(--accent), 0 8px 40px rgba(232,169,70,0.08)"
                  : "none",
              }}
            >
              {t.highlight && (
                <span className="badge w-fit mb-5">Most popular</span>
              )}
              <h3
                className="text-lg font-semibold mb-1"
                style={{ color: "var(--text)" }}
              >
                {t.name}
              </h3>
              <div className="flex items-end gap-1 mb-1">
                <span
                  className="text-4xl font-bold tabular-nums"
                  style={{ color: "var(--text)" }}
                >
                  {t.price}
                </span>
                <span
                  className="text-sm mb-1 ml-0.5"
                  style={{ color: "var(--text-muted)" }}
                >
                  {t.period}
                </span>
              </div>
              <p className="text-sm mb-6" style={{ color: "var(--text-body)" }}>
                {t.desc}
              </p>
              <div className="divider mb-6" />
              <ul className="space-y-3 mb-8 flex-1">
                {t.features.map((f) => (
                  <li
                    key={f}
                    className="flex items-center gap-2.5 text-sm"
                    style={{ color: "var(--text-body)" }}
                  >
                    <Check
                      className="w-4 h-4 shrink-0"
                      style={{ color: "var(--accent)" }}
                    />
                    {f}
                  </li>
                ))}
              </ul>
              <Link
                href={t.href}
                className={`${t.highlight ? "btn-primary" : "btn-ghost"} w-full focus-ring`}
              >
                {t.cta}
                <ChevronRight className="w-4 h-4 shrink-0" />
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ── CTA BANNER ── */
function CtaBanner() {
  const [loginOpen, setLoginOpen] = useState(false);
  return (
    <>
      <section
        className="py-24 md:py-32 border-t relative overflow-hidden"
        style={{ borderColor: "var(--border)" }}
      >
        {/* Ambient glow */}
        <div
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[300px] rounded-full blur-[100px] pointer-events-none"
          style={{
            background:
              "radial-gradient(ellipse, rgba(232,169,70,0.06) 0%, transparent 70%)",
          }}
        />
        <div className="relative z-10 max-w-2xl mx-auto px-6 md:px-10 text-center">
          <motion.h2
            initial={{ opacity: 0, y: 10, filter: "blur(8px)" }}
            whileInView={{ opacity: 1, y: 0, filter: "blur(0px)" }}
            viewport={{ once: true, margin: "-60px" }}
            transition={{ duration: 0.35 }}
            className="font-display-serif text-3xl md:text-5xl font-bold mb-5 tracking-tight text-balance"
            style={{ color: "var(--text)", lineHeight: 1.1 }}
          >
            Ready to stop guessing?
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 10, filter: "blur(8px)" }}
            whileInView={{ opacity: 1, y: 0, filter: "blur(0px)" }}
            viewport={{ once: true, margin: "-60px" }}
            transition={{ duration: 0.35, delay: 0.05 }}
            className="text-base md:text-lg mb-8"
            style={{ color: "var(--text-body)" }}
          >
            Join thousands of job seekers who know exactly what to improve.
          </motion.p>
          <motion.div
            initial={{ opacity: 0, y: 10, filter: "blur(8px)" }}
            whileInView={{ opacity: 1, y: 0, filter: "blur(0px)" }}
            viewport={{ once: true, margin: "-60px" }}
            transition={{ duration: 0.35, delay: 0.1 }}
          >
            <button
              onClick={() => setLoginOpen(true)}
              className="btn-primary focus-ring"
            >
              Analyze my resume — it&apos;s free
              <ArrowUpRight className="w-4 h-4 shrink-0" />
            </button>
          </motion.div>
        </div>
      </section>
      <LoginModal isOpen={loginOpen} onClose={() => setLoginOpen(false)} />
    </>
  );
}

/* ── PAGE ── */
export default function HomePage() {
  return (
    <main>
      <Hero />
      <HowItWorks />
      <Features />
      <Pricing />
      <CtaBanner />
    </main>
  );
}
