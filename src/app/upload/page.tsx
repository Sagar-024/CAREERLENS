"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useRouter } from "next/navigation";
import {
  Upload,
  FileText,
  CheckCircle2,
  AlertCircle,
  X,
  ArrowUpRight,
} from "lucide-react";
import { toast } from "sonner";
import { useSession } from "next-auth/react";
import LoginModal from "@/components/ui/LoginModal";
import { useAnalysis } from "@/hooks/useAnalysis";

export default function UploadPage() {
  const router = useRouter();
  const { data: session, status: authStatus } = useSession();
  const {
    startAnalysis,
    status: analysisStatus,
    result,
    error,
    setStatus,
  } = useAnalysis();

  const [file, setFile] = useState<File | null>(null);
  const [jd, setJd] = useState("");
  const [isHovering, setIsHovering] = useState(false);
  const [loginOpen, setLoginOpen] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  // Auto-redirect when analysis is complete
  useEffect(() => {
    if (analysisStatus === "COMPLETED" && result) {
      const id = result.id || result.analysis_id;
      if (id) {
        toast.success("Analysis complete. Redirecting...");
        setTimeout(() => {
          router.push(`/results/${id}`);
        }, 1500);
      }
    }
  }, [analysisStatus, result, router]);

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
  }, []);

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsHovering(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFile(e.dataTransfer.files[0]);
    }
  };

  const handleAnalyze = () => {
    if (!file) {
      toast.error("Please drop your resume first.");
      return;
    }
    if (!jd.trim() || jd.trim().length < 10) {
      toast.error("Please provide a job description.");
      return;
    }
    if (authStatus === "unauthenticated") {
      setLoginOpen(true);
      return;
    }

    startAnalysis(file, jd);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-zinc-900 via-[#0a0a0a] to-black flex flex-col items-center justify-center p-4 selection:bg-white/20">
      <div className="w-full max-w-2xl mx-auto flex flex-col pt-12">
        <div className="text-center mb-10">
          <motion.h1
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-4xl md:text-5xl font-medium tracking-tight text-zinc-100 mb-4"
          >
            Analysis Engine
          </motion.h1>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.1 }}
            className="text-zinc-400 text-lg md:text-xl font-light"
          >
            Upload your resume and the target role description.
          </motion.p>
        </div>

        <AnimatePresence mode="wait">
          {/* POLLING STATE */}
          {analysisStatus === "POLLING" ||
          analysisStatus === "STARTING" ||
          (analysisStatus === "COMPLETED" && result) ? (
            <motion.div
              key="polling"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="flex flex-col items-center justify-center py-24 space-y-8 bg-white/5 backdrop-blur-2xl border border-white/10 rounded-[2rem] shadow-2xl"
            >
              {analysisStatus === "COMPLETED" ? (
                <CheckCircle2 className="w-16 h-16 text-emerald-400 animate-in zoom-in duration-500" />
              ) : (
                <div className="relative flex items-center justify-center w-20 h-20">
                  <div className="absolute inset-0 rounded-full border border-white/10 blur-[2px]"></div>
                  <div className="absolute inset-0 rounded-full border-t border-white/60 animate-spin transition-all duration-1000 ease-in-out"></div>
                  <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-white/20 to-white/5 shadow-[0_0_20px_rgba(255,255,255,0.1)]"></div>
                </div>
              )}

              <div className="text-center space-y-2">
                <h3 className="text-xl font-medium text-zinc-100">
                  {analysisStatus === "STARTING" && "Initializing Engine..."}
                  {analysisStatus === "POLLING" &&
                    "Extracting semantic embeddings..."}
                  {analysisStatus === "COMPLETED" && "Analysis Complete"}
                </h3>
                <p className="text-sm text-zinc-400 max-w-xs mx-auto text-balance">
                  {analysisStatus === "POLLING"
                    ? "Our SBERT transformer is matching your skills against the job description."
                    : "Preparing your results interface..."}
                </p>
              </div>
            </motion.div>
          ) : (
            /* IDLE / ERROR FORMS */
            <motion.div
              key="form"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="bg-white/5 backdrop-blur-2xl border border-white/10 rounded-[2rem] shadow-2xl overflow-hidden p-6 md:p-10"
            >
              <div className="space-y-8">
                {/* Error Banner */}
                {analysisStatus === "FAILED" && (
                  <div className="flex items-center gap-3 p-4 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400">
                    <AlertCircle className="w-5 h-5 shrink-0" />
                    <p className="text-sm font-medium">
                      {error ||
                        "The AI Engine failed to process this document."}
                    </p>
                    <button
                      onClick={() => setStatus("IDLE")}
                      className="ml-auto hover:text-red-300"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                )}

                {/* Role Description input */}
                <div>
                  <h2 className="text-zinc-100 font-medium mb-3 ml-1 flex items-center gap-2">
                    <span className="flex items-center justify-center w-5 h-5 rounded-full bg-white/10 text-xs text-white">
                      1
                    </span>
                    Target Role
                  </h2>
                  <textarea
                    value={jd}
                    onChange={(e) => setJd(e.target.value)}
                    placeholder="Paste the full job description here..."
                    className="w-full h-32 bg-black/20 border border-white/10 rounded-2xl p-4 text-zinc-100 placeholder:text-zinc-600 focus:outline-none focus:ring-1 focus:ring-white/30 transition-all resize-none font-light"
                  />
                </div>

                {/* File Dropzone */}
                <div>
                  <h2 className="text-zinc-100 font-medium mb-3 ml-1 flex items-center gap-2">
                    <span className="flex items-center justify-center w-5 h-5 rounded-full bg-white/10 text-xs text-white">
                      2
                    </span>
                    Your Resume
                  </h2>

                  {!file ? (
                    <div
                      onDragOver={(e) => {
                        e.preventDefault();
                        setIsHovering(true);
                      }}
                      onDragLeave={() => setIsHovering(false)}
                      onDrop={handleDrop}
                      onClick={() => inputRef.current?.click()}
                      className={`relative overflow-hidden cursor-pointer w-full rounded-2xl border ${isHovering ? "border-white/40 bg-white/10" : "border-white/10 border-dashed bg-black/20 hover:bg-white/5"} transition-all duration-300 flex flex-col items-center justify-center py-12 px-6 group`}
                    >
                      <input
                        type="file"
                        accept=".pdf,.docx"
                        ref={inputRef}
                        className="hidden"
                        onChange={(e) =>
                          e.target.files?.[0] && handleFile(e.target.files[0])
                        }
                      />
                      <div className="p-4 rounded-full bg-white/5 group-hover:bg-white/10 transition-colors mb-4 border border-white/5">
                        <Upload className="w-6 h-6 text-zinc-400 group-hover:text-zinc-200 transition-colors" />
                      </div>
                      <p className="text-zinc-300 font-medium mb-1">
                        Upload exactly what you'll submit
                      </p>
                      <p className="text-zinc-500 font-light text-sm">
                        PDF or DOCX max 10MB
                      </p>
                    </div>
                  ) : (
                    <div className="flex items-center justify-between p-4 rounded-2xl bg-white/5 border border-white/10 group">
                      <div className="flex items-center gap-4 min-w-0">
                        <div className="p-3 rounded-xl bg-black/40 border border-white/5 text-zinc-300">
                          <FileText className="w-5 h-5" />
                        </div>
                        <div className="min-w-0">
                          <p className="text-zinc-200 font-medium truncate text-sm">
                            {file.name}
                          </p>
                          <p className="text-zinc-500 font-light text-xs mt-0.5">
                            {(file.size / 1024).toFixed(0)} KB
                          </p>
                        </div>
                      </div>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setFile(null);
                          if (inputRef.current) inputRef.current.value = "";
                        }}
                        className="p-2 rounded-full hover:bg-white/10 text-zinc-500 hover:text-white transition-colors"
                      >
                        <X className="w-5 h-5" />
                      </button>
                    </div>
                  )}
                </div>

                <div className="pt-4">
                  <button
                    onClick={handleAnalyze}
                    className="w-full relative flex items-center justify-center gap-2 bg-zinc-100 hover:bg-white text-zinc-900 font-medium rounded-2xl py-4 transition-all duration-300 overflow-hidden shadow-[0_0_40px_rgba(255,255,255,0.1)] hover:shadow-[0_0_60px_rgba(255,255,255,0.2)] active:scale-[0.98]"
                  >
                    <span>Analyze Match</span>
                    <ArrowUpRight className="w-4 h-4 opacity-70" />
                  </button>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <LoginModal isOpen={loginOpen} onClose={() => setLoginOpen(false)} />
    </div>
  );
}
