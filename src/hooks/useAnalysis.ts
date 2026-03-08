// hooks/useAnalysis.ts
import { useState } from "react";

// The exact states our UI can be in
export type UIStatus = "IDLE" | "STARTING" | "POLLING" | "COMPLETED" | "FAILED";

export const useAnalysis = () => {
  const [status, setStatus] = useState<UIStatus>("IDLE");
  const [result, setResult] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);

  const startAnalysis = async (resumeFile: File, jdText: string) => {
    setStatus("STARTING");
    setError(null);
    setResult(null); // 🛑 Nuke the old data from memory!

    const formData = new FormData();
    formData.append("resume", resumeFile);
    formData.append("jd_text", jdText);

    try {
      // 1. Fire the initial trigger to Next.js
      const res = await fetch("/api/analyze", {
        method: "POST",
        body: formData,
      });
      
      const data = await res.json();
      
      if (!res.ok) {
        throw new Error(data.error || "Failed to start analysis");
      }

      // 2. We got the Job ID! Switch to POLLING mode.
      setStatus("POLLING");
      pollStatus(data.analysis_id);

    } catch (err: any) {
      setError(err.message);
      setStatus("FAILED");
    }
  };

  const pollStatus = (jobId: string) => {
    // 3. The Heartbeat: Check the database every 3 seconds
    const interval = setInterval(async () => {
      try {
        const res = await fetch(`/api/analyze/${jobId}`);
        const data = await res.json();

        // 4. The State Machine dictates what we do next
        if (data.status === "COMPLETED") {
          clearInterval(interval);      // Stop polling
          setResult(data);              // Save the massive ML JSON payload
          setStatus("COMPLETED");       // Tell the UI to render the Radar Charts
        } else if (data.status === "FAILED") {
          clearInterval(interval);
          setError("AI Engine failed to process this document.");
          setStatus("FAILED");
        }
        // If status is still PENDING or PROCESSING, the interval just runs again in 3s.

      } catch (err) {
        console.error("Polling error", err);
      }
    }, 3000); 
  };

  return { startAnalysis, status, result, error, setStatus };
};
