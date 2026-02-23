"use client";

import { useState, useRef, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useRouter } from "next/navigation";
import {
  Upload,
  FileText,
  CheckCircle2,
  AlertCircle,
  ArrowRight,
  Shield,
  Clock,
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
  { id: 1, label: "INIT PARSER MODULE", icon: "[01]" },
  { id: 2, label: "NLP SEMANTIC INDEX", icon: "[02]" },
  { id: 3, label: "ATS SCORING ENGINE", icon: "[03]" },
  { id: 4, label: "BENCHMARK DB SYNC", icon: "[04]" },
  { id: 5, label: "GENERATE INSIGHTS", icon: "[05]" },
];

const terminalLines = [
  "> careerlens_core v3.2 boot",
  "> [SYS] awaiting io stream...",
  "> [NLP] loading model weights (4.2GB)...",
  "> [ATS] engine initialized.",
  "> [NET] semantic indexer ready.",
  "> waiting for transmission...",
];

export default function UploadPage() {
  const [state, setState] = useState<UploadState>("idle");
  const [file, setFile] = useState<File | null>(null);
  const [currentStep, setCurrentStep] = useState(0);
  const [terminalOutput, setTerminalOutput] = useState<string[]>([]);
  const [progress, setProgress] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);
  const router = useRouter();

  const startTerminal = useCallback(async () => {
    setTerminalOutput([]);
    for (let i = 0; i < terminalLines.length; i++) {
      await new Promise((r) => setTimeout(r, 300 + Math.random() * 200));
      setTerminalOutput((prev) => [...prev, terminalLines[i]]);
    }
  }, []);

  const simulateAnalysis = useCallback(async () => {
    setState("analyzing");
    await startTerminal();

    for (let i = 0; i < analysisSteps.length; i++) {
      await new Promise((r) => setTimeout(r, 600 + Math.random() * 400));
      setCurrentStep(i + 1);
      setProgress(Math.round(((i + 1) / analysisSteps.length) * 100));
    }

    await new Promise((r) => setTimeout(r, 500));
    setState("done");
    toast.success("SYSLOG: Analysis complete. Rerouting.");
    await new Promise((r) => setTimeout(r, 1200));
    router.push("/dashboard");
  }, [router, startTerminal]);

  const handleFile = useCallback(
    async (f: File) => {
      if (!f) return;
      const valid = f.type === "application/pdf" || f.name.endsWith(".docx");
      if (!valid) {
        toast.error("ERR_INVALID_FORMAT: Require PDF/DOCX");
        setState("error");
        return;
      }
      setFile(f);
      setState("uploading");
      await new Promise((r) => setTimeout(r, 1000));
      simulateAnalysis();
    },
    [simulateAnalysis],
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

  return (
    <div className="min-h-screen structural-bg flex flex-col items-center justify-center px-4 md:px-6 py-16 pt-24 md:py-24 md:pt-32 relative">
      <div className="w-full max-w-[1400px] flex flex-col lg:flex-row gap-8 lg:gap-24 relative z-10 mx-auto items-center">
        {/* Left Side (Header & Info) */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
          className="lg:w-1/2"
        >
          <div className="font-mono text-xs text-[#0047FF] font-bold uppercase mb-4 tracking-widest inline-flex border border-[#0047FF] px-2 py-1 bg-[#0047FF]/10">
            [ DATA INGESTION ]
          </div>
          <h1 className="display-title text-4xl sm:text-5xl md:text-7xl mb-6 text-white text-balance uppercase leading-none">
            UPLOAD <br />
            <span
              className="text-transparent"
              style={{ WebkitTextStroke: "2px #0047FF" }}
            >
              PAYLOAD.
            </span>
          </h1>
          <p className="text-lg text-[#888] mb-12 max-w-md font-medium">
            Transmit PDF or DOCX format for immediate algorithmic vectorization.
            Initial parsing cycle executes in ~30s.
          </p>

          <div className="space-y-6 max-w-sm">
            {[
              {
                label: "SECURE TUNNEL",
                desc: "256-bit AES encryption active",
                icon: Shield,
              },
              {
                label: "DATA RETENTION",
                desc: "Zero-day retention policy",
                icon: CheckCircle2,
              },
              {
                label: "EXECUTION TIME",
                desc: "Sub-30 second processing",
                icon: Clock,
              },
            ].map((Feature) => (
              <div
                key={Feature.label}
                className="flex gap-4 p-4 border border-[#222] bg-[#050505]"
              >
                <Feature.icon className="w-5 h-5 text-[#D6FF00] shrink-0" />
                <div>
                  <div className="font-bold text-sm uppercase text-white mb-1">
                    {Feature.label}
                  </div>
                  <div className="font-mono text-xs text-[#666] uppercase">
                    {Feature.desc}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Right Side (Uploader / Terminal) */}
        <div className="lg:w-1/2 w-full max-w-xl">
          <AnimatePresence mode="wait">
            {(state === "idle" ||
              state === "dragging" ||
              state === "error") && (
              <motion.div
                key="dropzone"
                initial={{ opacity: 0, scale: 0.98 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.98 }}
                className={`brutalist-card p-6 md:p-12 text-center cursor-pointer transition-colors relative overflow-hidden h-[400px] flex flex-col items-center justify-center ${
                  state === "dragging"
                    ? "bg-[#0047FF]/5 border-[#0047FF]"
                    : "bg-[#050505]"
                }`}
                onDrop={onDrop}
                onDragOver={(e) => {
                  e.preventDefault();
                  setState("dragging");
                }}
                onDragLeave={() => setState("idle")}
                onClick={() => inputRef.current?.click()}
              >
                <div className="scan-line-acid opacity-20" />
                <input
                  ref={inputRef}
                  type="file"
                  accept=".pdf,.docx"
                  className="hidden"
                  onChange={(e) => {
                    const f = e.target.files?.[0];
                    if (f) handleFile(f);
                  }}
                />

                <motion.div
                  animate={state === "dragging" ? { y: -5 } : { y: 0 }}
                  className="mb-8"
                >
                  <div className="w-20 h-20 bg-[#D6FF00] flex items-center justify-center mx-auto border border-black shadow-[4px_4px_0_#fff]">
                    <Upload className="w-8 h-8 text-black" />
                  </div>
                </motion.div>

                <h2 className="text-2xl font-bold uppercase text-white mb-3 tracking-tight">
                  {state === "dragging"
                    ? "RELEASE PAYLOAD"
                    : "DRAG RESUME HERE"}
                </h2>
                <div className="font-mono text-xs text-[#666] uppercase">
                  OR BROWSE SYSTEM DIRECTORY
                </div>

                {state === "error" && (
                  <div className="mt-6 flex items-center justify-center gap-2 p-2 bg-[#FF2A00]/10 border border-[#FF2A00] text-[#FF2A00] font-mono text-xs uppercase w-full">
                    <AlertCircle className="w-4 h-4 shrink-0" />
                    INVALID FORMAT. ABORT.
                  </div>
                )}

                <div className="mt-8 border-t border-[#222] w-full pt-4">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleFile(
                        new File(["demo"], "sys_demo_resume.pdf", {
                          type: "application/pdf",
                        }),
                      );
                    }}
                    className="text-[#0047FF] hover:text-[#D6FF00] font-mono text-xs uppercase tracking-widest flex items-center justify-center gap-2 mx-auto transition-colors"
                  >
                    [ EXECUTE DEMO FILE ] <ArrowRight className="w-3 h-3" />
                  </button>
                </div>
              </motion.div>
            )}

            {state === "uploading" && (
              <motion.div
                key="uploading"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="brutalist-card p-6 md:p-12 text-center h-[400px] flex flex-col items-center justify-center bg-[#050505]"
              >
                <div className="w-20 h-20 bg-[#0047FF] flex items-center justify-center mx-auto border border-black shadow-[4px_4px_0_#fff] mb-6 animate-pulse">
                  <FileText className="w-8 h-8 text-white" />
                </div>
                <h2 className="text-xl font-bold uppercase text-white mb-2">
                  TRANSMITTING...
                </h2>
                <div className="font-mono text-xs text-[#888]">
                  {file?.name}
                </div>
              </motion.div>
            )}

            {(state === "analyzing" || state === "done") && (
              <motion.div
                key="analyzing"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="brutalist-card p-0 overflow-hidden bg-[#050505] h-[450px] flex flex-col"
              >
                {/* Terminal Header */}
                <div className="border-b border-[#222] bg-black px-4 py-2 flex items-center justify-between">
                  <span className="font-mono text-xs font-bold text-[#D6FF00] uppercase tracking-widest">
                    {" "}
                    careerlens_tty1{" "}
                  </span>
                  <div className="flex gap-1.5">
                    <div className="w-2 h-2 bg-[#FF2A00]" />
                    <div className="w-2 h-2 bg-[#D6FF00]" />
                    <div className="w-2 h-2 bg-[#0047FF]" />
                  </div>
                </div>

                {/* Progress Visualizer */}
                <div className="p-6 border-b border-[#222] bg-[#0A0A0A] shrink-0">
                  <div className="flex justify-between items-end mb-2">
                    <div className="font-mono text-xs text-[#888] uppercase tracking-wider">
                      SYSTEM LOAD
                    </div>
                    <div className="font-mono text-xl font-bold text-[#D6FF00] leading-none">
                      {progress}%
                    </div>
                  </div>
                  <div className="w-full h-2 bg-black border border-[#222]">
                    <motion.div
                      className="h-full bg-[#D6FF00]"
                      initial={{ width: 0 }}
                      animate={{ width: `${progress}%` }}
                      transition={{ duration: 0.2 }}
                    />
                  </div>
                </div>

                {/* Log Output */}
                <div className="flex-1 p-6 font-mono text-[10px] sm:text-xs text-[#0047FF] space-y-2 overflow-y-auto relative bg-black">
                  <div className="scan-line-acid opacity-30" />
                  {terminalOutput.map((line, i) => (
                    <motion.div
                      key={i}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                    >
                      {line}
                    </motion.div>
                  ))}

                  {analysisSteps.map((step, i) => {
                    const done = currentStep > i;
                    const active = currentStep === i && state !== "done";
                    if (currentStep < i && state !== "done") return null;
                    return (
                      <motion.div
                        key={step.id}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className={`flex items-center gap-3 mt-4 ${done ? "text-[#666]" : active ? "text-[#D6FF00]" : ""}`}
                      >
                        <span className="shrink-0">{step.icon}</span>
                        <span className="uppercase">{step.label}</span>
                        {active && <span className="animate-pulse">_</span>}
                        {done && (
                          <span className="text-[#D6FF00] ml-auto">OK</span>
                        )}
                      </motion.div>
                    );
                  })}

                  {state !== "done" && (
                    <span className="inline-block w-2 h-4 bg-[#D6FF00] animate-pulse mt-2" />
                  )}
                </div>

                {/* Done Overlay */}
                <AnimatePresence>
                  {state === "done" && (
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="absolute inset-0 bg-[#D6FF00] flex flex-col items-center justify-center z-10 p-8 text-center"
                    >
                      <h2 className="display-title text-3xl md:text-4xl text-black uppercase leading-none mb-4">
                        ANALYSIS
                        <br />
                        COMPLETE.
                      </h2>
                      <div className="font-mono text-xs text-black uppercase tracking-widest bg-black/10 px-4 py-2 border border-black">
                        REROUTING TO DASHBOARD...
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
