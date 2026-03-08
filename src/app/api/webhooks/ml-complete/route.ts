// app/api/webhooks/ml-complete/route.ts
import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

// The 0.000000001% Security Move: 
// We need a secret password so random hackers can't send fake data to this URL.
const WEBHOOK_SECRET = process.env.ML_WEBHOOK_SECRET || "super-secret-dev-key";

export async function POST(request: NextRequest) {
  try {
    // 1. THE BOUNCER (Security Check)
    // Python must send this exact secret key in the headers.
    const authHeader = request.headers.get("x-webhook-secret");
    if (authHeader !== WEBHOOK_SECRET) {
      console.warn("Unauthorized webhook attempt blocked.");
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // 2. RECEIVE THE PAYLOAD
    const body = await request.json();
    const { job_id, status, data, error_message } = body;

    if (!job_id) {
      return NextResponse.json({ error: "Missing job_id" }, { status: 400 });
    }

    // 3. HANDLE GRACEFUL FAILURES
    // If Python crashed or couldn't read the PDF, it tells us here.
    if (status === "FAILED") {
      await prisma.analysis.update({
        where: { id: job_id },
        data: { status: "FAILED" },
      });
      // Optional: Refund the user's credit here since the AI failed
      return NextResponse.json({ success: true, message: "Job marked as failed." });
    }

    // =========================================================================
    // 4. THE STATE MACHINE COMPLETION (Injecting the 70 lines)
    // =========================================================================
    // Python succeeded! We dump the massive JSON payload into PostgreSQL
    // and officially change the status to COMPLETED.
    await prisma.analysis.update({
      where: { id: job_id },
      data: {
        status: "COMPLETED",
        
        // The Top-Level Metrics
        finalScore: data.final_score,
        readinessLabel: data.readiness_label,
        matchedCount: data.matched_skills?.length || 0,
        missingCount: data.missing_skills?.length || 0,
        totalCount: data.jd_skills?.length || 0,
        
        // The Heavy JSONB Data for your UI Radar Charts & Tables
        resumeSkills: data.resume_skills,
        jdSkills: data.jd_skills,
        matchedSkills: data.matched_skills,
        missingSkills: data.missing_skills,
        explanations: data.explanations,
        courses: data.courses,
        metadata: data.metadata,
        
        // If Python generates the PDF link in Stage 6, save it here
        pdfReportUrl: data.pdf_report_url || null, 
      },
    });

    console.log(`[WEBHOOK] Successfully completed analysis for Job ID: ${job_id}`);

    // 5. HANG UP THE PHONE
    return NextResponse.json({ success: true, message: "Database updated successfully." });

  } catch (error) {
    console.error("Webhook processing error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
