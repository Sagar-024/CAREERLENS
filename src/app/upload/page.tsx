"use client";

import { useState, useRef, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useRouter } from "next/navigation";
import {
  Upload,
  FileText,
  CheckCircle2,
  AlertCircle,
  ArrowUpRight,
  X,
  Sparkles,
} from "lucide-react";
import { toast } from "sonner";
import { useSession } from "next-auth/react";
import LoginModal from "@/components/ui/LoginModal";

type UploadState =
  | "idle"
  | "dragging"
  | "uploading"
  | "analyzing"
  | "done"
  | "error";

const ADMIN_EMAILS = ["bishta2323@gmail.com", "sagarkharal024@gmail.com"];

const TERMINAL_LINES = [
  "Initializing analysis engine…",
  "Parsing resume content…",
  "Running SBERT semantic encoder…",
  "Extracting skill vectors…",
  "Matching against job description…",
  "Computing SHAP feature importance…",
  "Building recommendations…",
];

export default function UploadPage() {
  const { data: session, status } = useSession();
  const [state, setState] = useState<UploadState>("idle");
  const [errorMsg, setErrorMsg] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [jd, setJd] = useState("");
  const [progress, setProgress] = useState(0);
  const [termLines, setTermLines] = useState<string[]>([]);
  const [loginOpen, setLoginOpen] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const router = useRouter();

  const email = session?.user?.email ?? "";
  const isAdmin = ADMIN_EMAILS.includes(email);
  const tier = isAdmin ? "pro" : ((session?.user as any)?.tier ?? "free");
  const analysisCount = (session?.user as any)?.analysisCount ?? 0;
  const scansLeft = isAdmin ? Infinity : Math.max(0, 2 - analysisCount);

  const handleFile = useCallback((f: File) => {
    const name = f.name.toLowerCase();
    const valid =
      f.type === "application/pdf" ||
      name.endsWith(".pdf") ||
      name.endsWith(".docx") ||
      f.type ===
        "application/vnd.openxmlformats-officedocument.wordprocessingml.document";
    if (!valid) {
      toast.error("Only PDF or DOCX files are supported.");
      return;
    }
    setFile(f);
    setErrorMsg("");
    setState("idle");
  }, []);

  const startAnalysis = useCallback(async () => {
    if (!file) {
      toast.error("Please select a resume file first.");
      return;
    }
    if (status === "unauthenticated") {
      setLoginOpen(true);
      return;
    }
    if (!jd.trim() || jd.trim().length < 10) {
      toast.error("Please enter a more complete job description.");
      return;
    }
    if (!isAdmin && tier === "free" && analysisCount >= 2) {
      toast.error("Free limit reached. Upgrade to Pro for unlimited scans.");
      router.push("/#pricing");
      return;
    }

    setState("analyzing");
    setProgress(0);
    setTermLines([]);

    (async () => {
      for (const line of TERMINAL_LINES) {
        await new Promise((r) => setTimeout(r, 400 + Math.random() * 200));
        setTermLines((prev) => [...prev, line]);
      }
    })();

    const tick = setInterval(() => {
      setProgress((p) => (p < 85 ? p + (Math.random() * 10 + 3) : p));
    }, 700);

    try {
      const form = new FormData();
      form.append("resume", file);
      form.append("jd_text", jd.trim());
      const res = await fetch("/api/analyze", { method: "POST", body: form });
      const data = await res.json();

      clearInterval(tick);
      setProgress(100);

      if (!res.ok) {
        if (data.upgradeRequired) {
          toast.error(data.error);
          router.push("/#pricing");
          return;
        }
        throw new Error(data.error || "Analysis failed");
      }

      await new Promise((r) => setTimeout(r, 600));
      setState("done");
      toast.success("Analysis complete — redirecting to results…");
      await new Promise((r) => setTimeout(r, 1000));
      router.push(`/results/${data.analysis_id}`);
    } catch (err: any) {
      clearInterval(tick);
      const msg = err.message || "Something went wrong.";
      toast.error(msg);
      setErrorMsg(msg);
      setState("error");
    }
  }, [file, jd, status, isAdmin, tier, analysisCount, router]);

  const isRunning = state === "uploading" || state === "analyzing";

  return (
    <div
      className="min-h-screen flex items-center justify-center px-4 sm:px-6 pt-4 pb-24"
      style={{ background: "var(--bg)" }}
    >
      <div className="w-full max-w-5xl mx-auto flex flex-col lg:flex-row gap-14 lg:gap-20 lg:items-start">
        {/* ── Left: Info ── */}
        <div className="lg:w-[360px] shrink-0">
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
          >
            <span className="badge mb-5">AI Resume Analysis</span>

            <h1
              className="text-3xl md:text-4xl font-bold tracking-tight leading-tight mb-4"
              style={{ color: "var(--text)" }}
            >
              Upload your resume.{" "}
              <span style={{ color: "var(--accent)" }}>Know your score.</span>
            </h1>

            <p
              className="text-[15px] leading-relaxed mb-10"
              style={{ color: "var(--text-body)" }}
            >
              Paste a job description and upload your resume. Our SBERT engine
              returns your readiness score in about 30 seconds.
            </p>

            <div className="space-y-5 mb-8">
              {[
                {
                  label: "Private & secure",
                  sub: "Files deleted immediately after analysis",
                },
                {
                  label: "~30 second results",
                  sub: "SBERT semantic matching engine",
                },
                {
                  label: "Actionable insights",
                  sub: "Skills gaps + course recommendations",
                },
              ].map((item) => (
                <div key={item.label} className="flex gap-3.5">
                  <div
                    className="w-1.5 h-1.5 rounded-full mt-2 shrink-0"
                    style={{ background: "var(--accent)" }}
                  />
                  <div>
                    <div
                      className="text-sm font-medium"
                      style={{ color: "var(--text)" }}
                    >
                      {item.label}
                    </div>
                    <div
                      className="text-xs mt-0.5"
                      style={{ color: "var(--text-muted)" }}
                    >
                      {item.sub}
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {status === "authenticated" && (
              <div
                className="flex items-center gap-2.5 p-3 rounded-xl"
                style={{
                  background: "var(--bg-card)",
                  border: "1px solid var(--border)",
                }}
              >
                {isAdmin ? (
                  <>
                    <Sparkles
                      className="w-3.5 h-3.5 shrink-0"
                      style={{ color: "var(--accent)" }}
                    />
                    <span
                      className="text-sm"
                      style={{ color: "var(--text-body)" }}
                    >
                      <strong style={{ color: "var(--text)" }}>Pro</strong> —
                      Unlimited analyses
                    </span>
                  </>
                ) : (
                  <>
                    <div
                      className="w-2 h-2 rounded-full shrink-0"
                      style={{
                        background:
                          scansLeft > 0 ? "var(--positive)" : "var(--negative)",
                      }}
                    />
                    <span
                      className="text-sm"
                      style={{ color: "var(--text-body)" }}
                    >
                      {scansLeft > 0
                        ? `Free · ${scansLeft} scan${scansLeft === 1 ? "" : "s"} remaining`
                        : "Free limit reached"}
                    </span>
                  </>
                )}
              </div>
            )}
          </motion.div>
        </div>

        {/* ── Right: Form Card ── */}
        <div className="flex-1">
          <AnimatePresence mode="wait">
            {(state === "idle" ||
              state === "dragging" ||
              state === "error") && (
              <motion.div
                key="form"
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
                className="glass-card overflow-hidden"
              >
                {/* Step 1 */}
                <div
                  className="p-6 border-b"
                  style={{ borderColor: "var(--border)" }}
                >
                  <div className="flex items-center gap-2.5 mb-4">
                    <div
                      className="w-6 h-6 rounded-md flex items-center justify-center text-[11px] font-bold"
                      style={{
                        background: "var(--accent-dim)",
                        color: "var(--accent)",
                      }}
                    >
                      1
                    </div>
                    <h2
                      className="text-sm font-semibold"
                      style={{ color: "var(--text)" }}
                    >
                      Job description
                    </h2>
                  </div>
                  <textarea
                    rows={4}
                    value={jd}
                    onChange={(e) => setJd(e.target.value)}
                    placeholder="Paste the full job listing or describe the role…"
                    className="w-full rounded-xl px-4 py-3 text-sm resize-none focus:outline-none transition-colors"
                    style={{
                      background: "var(--bg-elevated)",
                      border: "1px solid var(--border)",
                      color: "var(--text)",
                    }}
                    onFocus={(e) =>
                      (e.currentTarget.style.borderColor = "var(--accent)")
                    }
                    onBlur={(e) =>
                      (e.currentTarget.style.borderColor = "var(--border)")
                    }
                    autoComplete="off"
                  />
                </div>

                {/* Step 2 */}
                <div
                  className="p-6 border-b"
                  style={{ borderColor: "var(--border)" }}
                >
                  <div className="flex items-center gap-2.5 mb-4">
                    <div
                      className="w-6 h-6 rounded-md flex items-center justify-center text-[11px] font-bold"
                      style={{
                        background: "var(--accent-dim)",
                        color: "var(--accent)",
                      }}
                    >
                      2
                    </div>
                    <h2
                      className="text-sm font-semibold"
                      style={{ color: "var(--text)" }}
                    >
                      Upload resume
                    </h2>
                    <span
                      className="text-xs ml-auto"
                      style={{ color: "var(--text-muted)" }}
                    >
                      PDF or DOCX
                    </span>
                  </div>

                  {!file ? (
                    <div
                      className="border-2 border-dashed rounded-xl p-8 text-center cursor-pointer transition-all duration-150"
                      style={{
                        borderColor:
                          state === "dragging"
                            ? "var(--accent)"
                            : "var(--border)",
                        background:
                          state === "dragging"
                            ? "var(--accent-dim)"
                            : "transparent",
                      }}
                      onClick={() => inputRef.current?.click()}
                      onDragOver={(e) => {
                        e.preventDefault();
                        setState("dragging");
                      }}
                      onDragLeave={() => setState("idle")}
                      onDrop={(e) => {
                        e.preventDefault();
                        setState("idle");
                        const f = e.dataTransfer.files[0];
                        if (f) handleFile(f);
                      }}
                    >
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
                      <Upload
                        className="w-7 h-7 mx-auto mb-3"
                        style={{ color: "var(--text-muted)" }}
                      />
                      <p
                        className="text-sm font-medium"
                        style={{ color: "var(--text-body)" }}
                      >
                        {state === "dragging"
                          ? "Drop it here"
                          : "Drag & drop your resume"}
                      </p>
                      <p
                        className="text-xs mt-1"
                        style={{ color: "var(--text-muted)" }}
                      >
                        or click to browse
                      </p>
                    </div>
                  ) : (
                    <div
                      className="flex items-center gap-3 p-4 rounded-xl"
                      style={{
                        background: "var(--accent-dim)",
                        border: "1px solid rgba(232,169,70,0.2)",
                      }}
                    >
                      <div
                        className="w-10 h-10 rounded-lg flex items-center justify-center shrink-0"
                        style={{
                          background: "var(--accent)",
                          color: "#09090b",
                        }}
                      >
                        <FileText className="w-5 h-5" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p
                          className="text-sm font-medium truncate"
                          style={{ color: "var(--text)" }}
                        >
                          {file.name}
                        </p>
                        <p
                          className="text-xs mt-0.5"
                          style={{ color: "var(--text-muted)" }}
                        >
                          {(file.size / 1024).toFixed(0)} KB · Ready
                        </p>
                      </div>
                      <button
                        onClick={() => {
                          setFile(null);
                          setState("idle");
                          if (inputRef.current) inputRef.current.value = "";
                        }}
                        className="p-1.5 rounded-lg transition-colors focus-ring shrink-0"
                        style={{ color: "var(--text-muted)" }}
                        onMouseEnter={(e) => {
                          e.currentTarget.style.color = "var(--text)";
                          e.currentTarget.style.background =
                            "var(--bg-elevated)";
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.color = "var(--text-muted)";
                          e.currentTarget.style.background = "transparent";
                        }}
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  )}
                </div>

                {/* Error */}
                {state === "error" && (
                  <div className="px-6 pt-5">
                    <div
                      className="flex items-start gap-2.5 p-3.5 rounded-xl"
                      style={{
                        background: "var(--negative-dim)",
                        border: "1px solid rgba(224,92,77,0.2)",
                      }}
                    >
                      <AlertCircle
                        className="w-4 h-4 shrink-0 mt-0.5"
                        style={{ color: "var(--negative)" }}
                      />
                      <p
                        className="text-sm"
                        style={{ color: "var(--negative)" }}
                      >
                        {errorMsg || "Something went wrong. Please try again."}
                      </p>
                    </div>
                  </div>
                )}

                {/* Submit */}
                <div className="p-6">
                  <button
                    onClick={startAnalysis}
                    disabled={isRunning}
                    className="btn-primary w-full focus-ring disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Analyze Resume
                    <ArrowUpRight className="w-4 h-4 shrink-0" />
                  </button>
                  <p
                    className="text-xs text-center mt-3"
                    style={{ color: "var(--text-muted)" }}
                  >
                    Your file is deleted immediately after analysis
                  </p>
                </div>
              </motion.div>
            )}

            {/* Analyzing / Done */}
            {(state === "analyzing" || state === "done") && (
              <motion.div
                key="analyzing"
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                className="glass-card overflow-hidden relative"
              >
                {/* Terminal header */}
                <div
                  className="flex items-center gap-1.5 px-5 py-3 border-b"
                  style={{
                    background: "var(--bg-elevated)",
                    borderColor: "var(--border)",
                  }}
                >
                  {["#ff5f57", "#febc2e", "#28c840"].map((c, i) => (
                    <div
                      key={i}
                      className="w-2.5 h-2.5 rounded-full"
                      style={{ background: c }}
                    />
                  ))}
                  <span
                    className="ml-3 text-xs font-mono"
                    style={{ color: "var(--text-muted)" }}
                  >
                    careerlens ~ analyzing
                  </span>
                </div>

                {/* Progress */}
                <div
                  className="px-5 py-4 border-b"
                  style={{ borderColor: "var(--border)" }}
                >
                  <div className="flex justify-between items-center mb-2">
                    <span
                      className="text-xs"
                      style={{ color: "var(--text-muted)" }}
                    >
                      Progress
                    </span>
                    <span
                      className="text-xs font-mono tabular-nums"
                      style={{ color: "var(--accent)" }}
                    >
                      {Math.round(Math.min(progress, 100))}%
                    </span>
                  </div>
                  <div
                    className="w-full h-1 rounded-full overflow-hidden"
                    style={{ background: "var(--bg-elevated)" }}
                  >
                    <motion.div
                      className="h-1 rounded-full"
                      style={{ background: "var(--accent)" }}
                      animate={{ width: `${Math.min(progress, 100)}%` }}
                      transition={{ duration: 0.4 }}
                    />
                  </div>
                </div>

                {/* Terminal lines */}
                <div className="p-5 min-h-[200px] font-mono text-xs space-y-1.5">
                  {termLines.map((line, i) => (
                    <motion.div
                      key={i}
                      initial={{ opacity: 0, x: -4 }}
                      animate={{ opacity: 1, x: 0 }}
                      className="flex items-center gap-2"
                      style={{ color: "var(--text-body)" }}
                    >
                      <span
                        style={{ color: "var(--accent)" }}
                        className="shrink-0"
                      >
                        $
                      </span>
                      {line}
                    </motion.div>
                  ))}
                  {state !== "done" && (
                    <div
                      className="flex items-center gap-2"
                      style={{ color: "var(--text-muted)" }}
                    >
                      <span style={{ color: "var(--accent)" }}>$</span>
                      <span className="animate-pulse">_</span>
                    </div>
                  )}
                </div>

                {/* Done overlay */}
                <AnimatePresence>
                  {state === "done" && (
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="absolute inset-0 flex flex-col items-center justify-center gap-3 rounded-2xl"
                      style={{ background: "rgba(9,9,11,0.95)" }}
                    >
                      <CheckCircle2
                        className="w-12 h-12"
                        style={{ color: "var(--accent)" }}
                      />
                      <div className="text-center">
                        <p
                          className="font-medium"
                          style={{ color: "var(--text)" }}
                        >
                          Analysis complete
                        </p>
                        <p
                          className="text-sm mt-1"
                          style={{ color: "var(--text-body)" }}
                        >
                          Redirecting to your results…
                        </p>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      <LoginModal isOpen={loginOpen} onClose={() => setLoginOpen(false)} />
    </div>
  );
}
