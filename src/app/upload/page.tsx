"use client";

import { useState, useRef, useCallback, useEffect } from "react";
import { motion, AnimatePresence, useAnimation } from "framer-motion";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import {
  Upload,
  FileText,
  CheckCircle2,
  AlertCircle,
  ArrowRight,
  Sparkles,
  Zap,
} from "lucide-react";
import { toast } from "sonner";

type UploadState =
  | "idle"
  | "dragging"
  | "uploading"
  | "analyzing"
  | "done"
  | "error";

const analysisSteps = [
  { id: 1, label: "Parsing resume PDF", sub: "spaCy NER extracting skills..." },
  {
    id: 2,
    label: "Extracting JD skills",
    sub: "NLP scanning job requirements...",
  },
  {
    id: 3,
    label: "SBERT semantic match",
    sub: "Encoding vectors, computing cosine similarity...",
  },
  {
    id: 4,
    label: "Identifying skill gaps",
    sub: "Comparing matched vs required skills...",
  },
  {
    id: 5,
    label: "Generating readiness score",
    sub: "Computing final SHAP-based explainability...",
  },
];

export default function UploadPage() {
  const { data: session, status } = useSession();
  const [state, setState] = useState<UploadState>("idle");
  const [file, setFile] = useState<File | null>(null);
  const [currentStep, setCurrentStep] = useState(0);
  const [progress, setProgress] = useState(0);
  const [jd, setJd] = useState("");
  const [charCount, setCharCount] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);
  const router = useRouter();
  const controls = useAnimation();

  useEffect(() => {
    controls.start({
      opacity: 1,
      y: 0,
      filter: "blur(0px)",
      transition: {
        duration: 0.8,
        ease: [0.22, 1, 0.36, 1],
        staggerChildren: 0.1,
      },
    });
  }, [controls]);

  const simulateAnalysis = useCallback(async () => {
    setState("analyzing");

    for (let i = 0; i < analysisSteps.length; i++) {
      await new Promise((r) => setTimeout(r, 900 + Math.random() * 500));
      setCurrentStep(i + 1);
      setProgress(Math.round(((i + 1) / analysisSteps.length) * 100));
    }

    await new Promise((r) => setTimeout(r, 600));
    setState("done");
    toast.success("Analysis complete. Redirecting to your report.");
    await new Promise((r) => setTimeout(r, 1400));
    router.push("/dashboard");
  }, [router]);

  const handleFile = useCallback(
    async (f: File, isDemo = false) => {
      if (!f) return;

      if (status === "unauthenticated") {
        toast.error("Please log in to analyze your resume.");
        router.push("/login");
        return;
      }

      const plan = (session?.user as any)?.plan || "FREE";
      const usageCount = (session?.user as any)?.usageCount || 0;

      if (plan === "FREE" && usageCount >= 5) {
        toast.error("Free limit reached. Upgrade to Pro for unlimited scans.");
        router.push("/#pricing");
        return;
      }

      if (!isDemo && !jd.trim()) {
        toast.error("Please paste the job description before analyzing.");
        return;
      }

      const valid = f.type === "application/pdf" || f.name.endsWith(".docx");
      if (!valid) {
        toast.error("Only PDF or DOCX files are supported.");
        setState("error");
        return;
      }

      setFile(f);
      setState("uploading");
      await new Promise((r) => setTimeout(r, 900));
      simulateAnalysis();
    },
    [simulateAnalysis, jd, status, session, router],
  );

  const onDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      setState("idle");
      const f = e.dataTransfer.files[0];
      if (f) handleFile(f);
    },
    [handleFile],
  );

  const isIdle = state === "idle" || state === "dragging" || state === "error";

  return (
    <div className="min-h-screen bg-[#fafafa] dark:bg-[#080808] flex flex-col items-center justify-center px-4 py-16 pt-28 md:py-24 md:pt-36 relative overflow-hidden transition-colors duration-500">
      {/* Background grid */}
      <div className="pointer-events-none absolute inset-0 opacity-[0.03] dark:opacity-[0.06] bg-[linear-gradient(#000_1px,transparent_1px),linear-gradient(90deg,#000_1px,transparent_1px)] dark:bg-[linear-gradient(#fff_1px,transparent_1px),linear-gradient(90deg,#fff_1px,transparent_1px)] bg-[size:48px_48px]" />

      {/* Glow orbs */}
      <div className="pointer-events-none absolute top-1/4 left-1/4 w-[500px] h-[500px] rounded-full bg-[#0047FF]/5 dark:bg-[#0047FF]/15 blur-[100px] dark:blur-[140px]" />
      <div className="pointer-events-none absolute bottom-1/4 right-1/4 w-[400px] h-[400px] rounded-full bg-[#0047FF]/5 dark:bg-[#D6FF00]/8 blur-[100px] dark:blur-[120px]" />

      <div className="w-full max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-5 gap-8 lg:gap-16 relative z-10 items-start">
        {/* ─── Left: Copy ─── */}
        <motion.div
          initial={{ opacity: 0, y: 30, filter: "blur(10px)" }}
          animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
          transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
          className="lg:col-span-2 flex flex-col justify-center"
        >
          <div className="mb-5 inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-[#0047FF]/20 dark:border-[#0047FF]/40 bg-[#0047FF]/5 dark:bg-[#0047FF]/10 w-fit">
            <span className="w-1.5 h-1.5 rounded-full bg-[#0047FF] animate-pulse" />
            <span className="font-mono text-[10px] text-[#0047FF] uppercase tracking-widest font-bold">
              Resume Analyzer
            </span>
          </div>

          <h1 className="text-4xl md:text-5xl font-black text-gray-900 dark:text-white mb-5 leading-[1.1] tracking-tight">
            Paste your JD.
            <br />
            <span className="text-[#0047FF] dark:text-[#D6FF00]">
              Know your score.
            </span>
          </h1>

          <p className="text-gray-600 dark:text-[#aaa] text-base leading-relaxed mb-8 max-w-sm">
            Upload your resume and paste the job description. Our system
            extracts skills from both, computes your exact readiness score using
            SBERT semantic AI, and shows you every missing skill with courses to
            close the gap.
          </p>

          {/* Feature pills */}
          <div className="flex flex-col gap-3">
            {[
              {
                icon: Zap,
                text: "SBERT Semantic Matching — 'ML' = 'Machine Learning'",
                lightColor: "#0047FF",
                darkColor: "#D6FF00",
              },
              {
                icon: CheckCircle2,
                text: "Exact % readiness for your specific job",
                lightColor: "#000000",
                darkColor: "#0047FF",
              },
              {
                icon: Sparkles,
                text: "SHAP explainability — see why you scored what you scored",
                lightColor: "#666666",
                darkColor: "#888888",
              },
            ].map(({ icon: Icon, text, lightColor, darkColor }) => (
              <div key={text} className="flex items-start gap-3">
                <div className="w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                  {/* Using standard Tailwind colors for the icon wrapper to handle light/dark smoothly */}
                  <div className="w-full h-full rounded-full flex items-center justify-center bg-gray-100 dark:bg-white/5 border border-gray-200 dark:border-white/10">
                    <Icon className="w-2.5 h-2.5 text-gray-700 dark:text-gray-300" />
                  </div>
                </div>
                <span className="text-gray-700 dark:text-[#bbb] text-sm leading-relaxed font-medium dark:font-normal">
                  {text}
                </span>
              </div>
            ))}
          </div>

          {/* Usage badge */}
          {status === "authenticated" && (
            <div className="mt-8 inline-flex items-center gap-2 px-3 py-2 bg-white dark:bg-[#111] border border-gray-200 dark:border-[#222] rounded-lg shadow-sm dark:shadow-none w-fit">
              <div className="flex gap-1">
                {Array.from({ length: 5 }).map((_, i) => (
                  <div
                    key={i}
                    className={`w-2 h-2 rounded-sm ${i < ((session?.user as any)?.usageCount || 0) ? "bg-[#FF2A00]" : "bg-gray-200 dark:bg-[#333]"}`}
                  />
                ))}
              </div>
              <span className="font-mono text-[10px] text-gray-500 dark:text-[#aaa] uppercase font-bold dark:font-normal">
                {5 - Math.min(5, (session?.user as any)?.usageCount || 0)} free
                scans left
              </span>
            </div>
          )}
        </motion.div>

        {/* ─── Right: Upload Card ─── */}
        <motion.div
          initial={{ opacity: 0, y: 30, filter: "blur(10px)" }}
          animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
          transition={{ duration: 0.8, delay: 0.15, ease: [0.22, 1, 0.36, 1] }}
          className="lg:col-span-3"
        >
          <AnimatePresence mode="wait">
            {isIdle && (
              <motion.div
                key="dropzone"
                initial={{ opacity: 0, scale: 0.98 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.96 }}
                transition={{ duration: 0.4 }}
                className="rounded-2xl border border-gray-200 dark:border-[#2a2a2a] bg-white dark:bg-[#0e0e0e] overflow-hidden shadow-xl dark:shadow-[0_0_60px_rgba(0,0,0,0.6)]"
              >
                {/* Card header */}
                <div className="flex items-center justify-between px-5 py-3 border-b border-gray-100 dark:border-[#2a2a2a] bg-gray-50/50 dark:bg-[#0a0a0a]">
                  <div className="flex items-center gap-2">
                    <div className="w-2.5 h-2.5 rounded-full bg-[#FF2A00] opacity-80 dark:opacity-100" />
                    <div className="w-2.5 h-2.5 rounded-full bg-[#FFBD00] dark:bg-[#D6FF00] opacity-80 dark:opacity-100" />
                    <div className="w-2.5 h-2.5 rounded-full bg-[#0047FF] opacity-80 dark:opacity-100" />
                  </div>
                  <span className="font-mono text-[10px] text-gray-400 dark:text-[#777] uppercase tracking-widest font-bold dark:font-normal">
                    careerlens — analyze
                  </span>
                  <div className="w-16" />
                </div>

                <div className="p-6 space-y-5">
                  {/* JD Textarea */}
                  <div>
                    <label className="flex items-center gap-2 text-xs font-bold dark:font-semibold text-gray-700 dark:text-[#ccc] uppercase tracking-widest mb-2.5">
                      <span className="inline-block w-1.5 h-1.5 rounded-full bg-[#0047FF]" />
                      Job Description
                    </label>
                    <div className="relative">
                      <textarea
                        value={jd}
                        onChange={(e) => {
                          setJd(e.target.value);
                          setCharCount(e.target.value.length);
                        }}
                        placeholder="Paste the full job description from LinkedIn, Naukri, or any platform..."
                        className="w-full bg-gray-50 dark:bg-[#111] border border-gray-200 dark:border-[#444] rounded-xl text-gray-900 dark:text-white text-sm p-4 focus:outline-none focus:border-[#0047FF] focus:ring-1 focus:ring-[#0047FF]/40 resize-none h-36 transition-all placeholder:text-gray-400 dark:placeholder:text-[#777] leading-relaxed"
                      />
                      {charCount > 0 && (
                        <span className="absolute bottom-3 right-3 font-mono text-[10px] text-gray-400 dark:text-[#888]">
                          {charCount} chars
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Divider */}
                  <div className="relative flex items-center gap-3">
                    <div className="flex-1 h-px bg-gray-200 dark:bg-[#3a3a3a]" />
                    <span className="font-mono text-[10px] text-gray-400 dark:text-[#999] uppercase tracking-widest font-bold dark:font-normal">
                      then upload resume
                    </span>
                    <div className="flex-1 h-px bg-gray-200 dark:bg-[#3a3a3a]" />
                  </div>

                  {/* PDF Drop Zone */}
                  <div
                    className={`relative rounded-xl border-2 border-dashed transition-all duration-300 cursor-pointer overflow-hidden group ${
                      state === "dragging"
                        ? "border-[#0047FF] bg-[#0047FF]/5 dark:border-[#D6FF00] dark:bg-[#D6FF00]/10"
                        : file
                          ? "border-[#0047FF] bg-[#0047FF]/5 dark:bg-[#0047FF]/8"
                          : "border-gray-300 dark:border-[#444] hover:border-gray-400 dark:hover:border-[#666] hover:bg-gray-50 dark:hover:bg-[#131313]"
                    }`}
                    onDrop={onDrop}
                    onDragOver={(e) => {
                      e.preventDefault();
                      setState("dragging");
                    }}
                    onDragLeave={() => setState("idle")}
                    onClick={() => inputRef.current?.click()}
                  >
                    <input
                      ref={inputRef}
                      type="file"
                      accept=".pdf,.docx"
                      className="hidden"
                      onChange={(e) => {
                        const f = e.target.files?.[0];
                        if (f) {
                          setFile(f);
                          setState("idle");
                        }
                      }}
                    />

                    <div className="flex flex-col items-center justify-center py-9 px-6 text-center">
                      <AnimatePresence mode="wait">
                        {file ? (
                          <motion.div
                            key="file-ready"
                            initial={{ scale: 0.8, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0.8, opacity: 0 }}
                            className="flex flex-col items-center gap-2"
                          >
                            <div className="w-12 h-12 rounded-full bg-[#0047FF]/10 dark:bg-[#0047FF]/20 border border-[#0047FF]/20 dark:border-[#0047FF]/40 flex items-center justify-center mb-1">
                              <FileText className="w-5 h-5 text-[#0047FF]" />
                            </div>
                            <p className="text-gray-900 dark:text-white font-semibold text-sm truncate max-w-[220px]">
                              {file.name}
                            </p>
                            <p className="text-[#0047FF] text-xs font-mono uppercase tracking-wider font-bold dark:font-normal">
                              Ready to analyze
                            </p>
                          </motion.div>
                        ) : (
                          <motion.div
                            key="drop-prompt"
                            initial={{ scale: 0.8, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0.8, opacity: 0 }}
                            className="flex flex-col items-center gap-3"
                          >
                            <motion.div
                              animate={{
                                y: state === "dragging" ? -6 : [0, -4, 0],
                              }}
                              transition={
                                state === "dragging"
                                  ? { type: "spring", stiffness: 300 }
                                  : {
                                      repeat: Infinity,
                                      duration: 3,
                                      ease: "easeInOut",
                                    }
                              }
                              className="w-12 h-12 rounded-full bg-white dark:bg-[#1a1a1a] border border-gray-200 dark:border-[#3a3a3a] shadow-sm dark:shadow-none flex items-center justify-center group-hover:border-gray-300 dark:group-hover:border-[#555] transition-colors"
                            >
                              <Upload className="w-5 h-5 text-gray-500 dark:text-[#888] group-hover:text-gray-700 dark:group-hover:text-[#ccc] transition-colors" />
                            </motion.div>
                            <div>
                              <p className="text-gray-900 dark:text-white text-sm font-bold dark:font-semibold mb-1">
                                {state === "dragging"
                                  ? "Drop your resume here"
                                  : "Click to upload your resume"}
                              </p>
                              <p className="text-gray-500 dark:text-[#777] text-xs font-mono">
                                PDF or DOCX supported · Drag & drop or click to
                                browse
                              </p>
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                  </div>

                  {state === "error" && (
                    <motion.div
                      initial={{ opacity: 0, y: -8 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="flex items-center gap-2 p-3 rounded-lg bg-[#FF2A00]/10 border border-[#FF2A00]/20 dark:border-[#FF2A00]/30 text-[#FF2A00] text-xs font-mono font-bold dark:font-normal"
                    >
                      <AlertCircle className="w-4 h-4 flex-shrink-0" />
                      Only PDF or DOCX files are supported.
                    </motion.div>
                  )}

                  {/* Analyze Button */}
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      if (file) {
                        handleFile(file);
                      } else {
                        toast.error("Please upload your resume first.");
                      }
                    }}
                    disabled={!file}
                    className={`w-full flex items-center justify-center gap-3 py-4 px-6 rounded-xl font-black dark:font-bold text-sm uppercase tracking-wider transition-all duration-300 ${
                      file
                        ? "bg-black text-white hover:bg-gray-800 hover:shadow-lg dark:bg-[#D6FF00] dark:text-black dark:hover:bg-[#c4eb00] dark:hover:shadow-[0_0_40px_rgba(214,255,0,0.2)]"
                        : "bg-gray-100 dark:bg-[#1a1a1a] text-gray-400 dark:text-[#888] cursor-not-allowed border border-gray-200 dark:border-[#3a3a3a]"
                    }`}
                  >
                    {file ? (
                      <>
                        Analyze My Resume
                        <ArrowRight className="w-4 h-4" />
                      </>
                    ) : (
                      "Upload Resume to Continue"
                    )}
                  </button>

                  <p className="text-center text-gray-500 dark:text-[#888] text-xs font-mono uppercase tracking-wider font-bold dark:font-normal">
                    Free plan —{" "}
                    {5 - Math.min(5, (session?.user as any)?.usageCount || 0)}{" "}
                    scans remaining
                  </p>
                </div>
              </motion.div>
            )}

            {state === "uploading" && (
              <motion.div
                key="uploading"
                initial={{ opacity: 0, scale: 0.97 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.97 }}
                transition={{ duration: 0.4 }}
                className="rounded-2xl border border-gray-200 dark:border-[#2a2a2a] bg-white dark:bg-[#0e0e0e] overflow-hidden shadow-xl dark:shadow-[0_0_60px_rgba(0,0,0,0.6)] flex flex-col items-center justify-center min-h-[460px] gap-6 p-10"
              >
                <motion.div
                  animate={{ scale: [1, 1.08, 1], opacity: [0.8, 1, 0.8] }}
                  transition={{ repeat: Infinity, duration: 1.5 }}
                  className="w-16 h-16 rounded-2xl bg-[#0047FF]/10 dark:bg-[#0047FF]/20 border border-[#0047FF]/20 dark:border-[#0047FF]/40 flex items-center justify-center"
                >
                  <FileText className="w-7 h-7 text-[#0047FF]" />
                </motion.div>
                <div className="text-center">
                  <p className="text-gray-900 dark:text-white font-bold text-lg mb-1">
                    Reading your resume...
                  </p>
                  <p className="text-gray-500 dark:text-[#888] text-sm font-mono">
                    {file?.name}
                  </p>
                </div>
              </motion.div>
            )}

            {(state === "analyzing" || state === "done") && (
              <motion.div
                key="analyzing"
                initial={{ opacity: 0, scale: 0.97 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
                className="rounded-2xl border border-gray-200 dark:border-[#2a2a2a] bg-white dark:bg-[#0e0e0e] overflow-hidden relative shadow-xl dark:shadow-[0_0_60px_rgba(0,0,0,0.6)]"
              >
                {/* Terminal bar */}
                <div className="flex items-center justify-between px-5 py-3 border-b border-gray-200 dark:border-[#2a2a2a] bg-gray-50/50 dark:bg-[#0a0a0a]">
                  <div className="flex items-center gap-2">
                    <div className="w-2.5 h-2.5 rounded-full bg-[#FF2A00]" />
                    <div className="w-2.5 h-2.5 rounded-full bg-[#FFBD00] dark:bg-[#D6FF00]" />
                    <div className="w-2.5 h-2.5 rounded-full bg-[#0047FF]" />
                  </div>
                  <span className="font-mono text-[10px] text-gray-400 dark:text-[#777] uppercase tracking-widest font-bold dark:font-normal">
                    careerlens — analyzing
                  </span>
                  <div className="w-16" />
                </div>

                {/* Progress */}
                <div className="px-6 pt-5 pb-4">
                  <div className="flex justify-between items-center mb-2">
                    <span className="font-mono text-[10px] text-gray-500 dark:text-[#999] uppercase tracking-widest font-bold dark:font-normal">
                      Progress
                    </span>
                    <motion.span
                      key={progress}
                      initial={{ opacity: 0, y: -5 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="font-mono text-sm font-black dark:font-bold text-[#0047FF] dark:text-[#D6FF00]"
                    >
                      {progress}%
                    </motion.span>
                  </div>
                  <div className="h-1.5 w-full bg-gray-100 dark:bg-[#111] rounded-full overflow-hidden">
                    <motion.div
                      className="h-full bg-gradient-to-r from-[#0047FF] to-[#0047FF] dark:to-[#D6FF00] rounded-full"
                      initial={{ width: 0 }}
                      animate={{ width: `${progress}%` }}
                      transition={{ duration: 0.4, ease: "easeOut" }}
                    />
                  </div>
                </div>

                {/* Steps */}
                <div className="px-6 pb-6 space-y-1">
                  {analysisSteps.map((step, i) => {
                    const done = currentStep > i;
                    const active = currentStep === i + 1 && state !== "done";
                    const pending = currentStep <= i && state !== "done";
                    if (pending) return null;
                    return (
                      <motion.div
                        key={step.id}
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.3 }}
                        className={`flex items-start gap-3 p-3 rounded-lg transition-all ${
                          active
                            ? "bg-[#0047FF]/5 dark:bg-[#0047FF]/10 border border-[#0047FF]/10 dark:border-[#0047FF]/20"
                            : "bg-transparent border border-transparent"
                        }`}
                      >
                        <div
                          className={`w-5 h-5 rounded-full flex-shrink-0 flex items-center justify-center mt-0.5 ${
                            done
                              ? "bg-green-50 dark:bg-[#D6FF00]/20 border border-green-200 dark:border-[#D6FF00]/40"
                              : active
                                ? "bg-[#0047FF]/10 dark:bg-[#0047FF]/20 border border-[#0047FF]/30 dark:border-[#0047FF]/60"
                                : "bg-gray-100 dark:bg-[#111] border border-gray-200 dark:border-[#222]"
                          }`}
                        >
                          {done ? (
                            <CheckCircle2 className="w-3 h-3 text-green-600 dark:text-[#D6FF00]" />
                          ) : active ? (
                            <motion.div
                              animate={{ rotate: 360 }}
                              transition={{
                                repeat: Infinity,
                                duration: 1,
                                ease: "linear",
                              }}
                              className="w-2 h-2 border border-[#0047FF] border-t-transparent rounded-full"
                            />
                          ) : null}
                        </div>
                        <div>
                          <p
                            className={`text-sm font-bold dark:font-semibold leading-none mb-0.5 ${
                              done
                                ? "text-gray-500 dark:text-[#777]"
                                : active
                                  ? "text-gray-900 dark:text-white"
                                  : "text-gray-400 dark:text-[#777]"
                            }`}
                          >
                            {step.label}
                          </p>
                          {active && (
                            <motion.p
                              initial={{ opacity: 0 }}
                              animate={{ opacity: 1 }}
                              className="text-[#0047FF] text-xs font-mono font-bold dark:font-normal"
                            >
                              {step.sub}
                            </motion.p>
                          )}
                        </div>
                        {done && (
                          <span className="ml-auto font-mono text-[10px] text-green-600 dark:text-[#D6FF00] uppercase font-bold dark:font-normal">
                            Done
                          </span>
                        )}
                      </motion.div>
                    );
                  })}
                </div>

                {/* Done overlay */}
                <AnimatePresence>
                  {state === "done" && (
                    <motion.div
                      initial={{ opacity: 0, scale: 1.04 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
                      className="absolute inset-0 bg-white dark:bg-[#D6FF00] flex flex-col items-center justify-center z-10 p-10 text-center"
                    >
                      <div className="w-14 h-14 rounded-full bg-green-50 dark:bg-black/10 flex items-center justify-center mb-5">
                        <CheckCircle2 className="w-7 h-7 text-green-500 dark:text-black" />
                      </div>
                      <h2 className="text-3xl font-black text-gray-900 dark:text-black uppercase tracking-tight leading-none mb-2">
                        Analysis Complete.
                      </h2>
                      <p className="text-gray-500 dark:text-black/60 text-sm font-mono uppercase tracking-wider font-bold dark:font-normal">
                        Redirecting to your report...
                      </p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      </div>
    </div>
  );
}
