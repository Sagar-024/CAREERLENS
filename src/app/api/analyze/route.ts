// app/api/analyze/route.ts
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import { writeFile, unlink } from "fs/promises";
import { join } from "path";
import { randomUUID } from "crypto";
import axios from "axios";
import FormData from "form-data";
import { createReadStream } from "fs";
import { tmpdir } from "os";

const prisma = new PrismaClient();

const TIER_LIMITS: Record<string, number> = {
  free: 2,
  starter: 20,
  pro: Infinity,
};

const ADMIN_EMAILS = [
  "bishta2323@gmail.com",
  "sagarkharal024@gmail.com",
];

export async function POST(request: NextRequest) {
  console.log("🛑 TRIPWIRE 1: API Route Reached!");
  
  let tempFilePath: string | null = null;

  try {
    console.log("🛑 TRIPWIRE 2: Entering Try Block!");

    // 1. AUTHENTICATION & BILLING (Unchanged - You nailed this)
    const session = await getServerSession(authOptions);
    console.log("🛑 TRIPWIRE 3: Session checked!", session?.user?.email);
    if (!session?.user?.email) return NextResponse.json({ error: "Please login" }, { status: 401 });

    const user = await prisma.user.findUnique({ where: { email: session.user.email } });
    if (!user) return NextResponse.json({ error: "User not found" }, { status: 404 });

    const isWhitelisted = ADMIN_EMAILS.includes(session.user.email);
    const effectiveTier = isWhitelisted ? "pro" : user.tier;
    const limit = TIER_LIMITS[effectiveTier] ?? 2;

    if (user.analysisCount >= limit) {
      return NextResponse.json({ error: "Limit reached. Upgrade required.", upgradeRequired: true }, { status: 403 });
    }

    // 2. VALIDATION (Unchanged)
    const formData = await request.formData();
    const resumeFile = formData.get("resume") as File | null;
    const jdText = formData.get("jd_text") as string | null;

    if (!resumeFile || !jdText || jdText.trim().length < 50) {
      return NextResponse.json({ error: "Invalid Input." }, { status: 400 });
    }

    // =========================================================================
    // 3. THE STATE MACHINE (The Elite Move)
    // We create the PENDING record instantly. Now we have an ID to track.
    // =========================================================================
    const savedAnalysis = await prisma.analysis.create({
      data: {
        userId: user.id,
        jdText: jdText.trim(),
        jobTitle: jdText.trim().split("\n")[0]?.substring(0, 100) ?? "Unknown Role",
        status: "PENDING", // Enforce the Enum
      },
    });

    // Write file to temp directory
    const fileId = randomUUID();
    tempFilePath = join(tmpdir(), `resume_${fileId}.pdf`);
    const bytes = await resumeFile.arrayBuffer();
    await writeFile(tempFilePath, Buffer.from(bytes));

    const mlFormData = new FormData();
    mlFormData.append("resume", createReadStream(tempFilePath), {
      filename: "resume.pdf",
      contentType: "application/pdf",
    });
    mlFormData.append("jd_text", jdText.trim());
    mlFormData.append("user_id", user.id);
    mlFormData.append("job_id", savedAnalysis.id); // Passing the ID to Python!

    // =========================================================================
    // 4. THE HANDOFF
    // Python's FastAPI will accept this and instantly return a 202 status.
    // It will do the heavy ML math in the background.
    // =========================================================================
    const mlServiceUrl = process.env.ML_SERVICE_URL || "http://localhost:8000";
    
    // Notice: We don't need a 60000ms timeout anymore, because Python replies instantly!
    await axios.post(`${mlServiceUrl}/api/v1/analyze`, mlFormData, {
      headers: mlFormData.getHeaders(),
    });

    // Deduct the credit
    await prisma.user.update({
      where: { id: user.id },
      data: { analysisCount: { increment: 1 } },
    });

    // =========================================================================
    // 5. INSTANT RETURN
    // We hand the job ID back to the React UI immediately so it can show a loading screen.
    // =========================================================================
    return NextResponse.json({
      success: true,
      analysis_id: savedAnalysis.id,
      status: "PENDING",
      message: "AI Engine has started analyzing your resume."
    });

  } catch (error: any) {
    console.error("Analysis route error:", error);
    // If it fails, we should ideally mark the job as FAILED in the DB if it was created
    return NextResponse.json({ error: "Analysis failed to start." }, { status: 500 });
    
  } finally {
    if (tempFilePath) {
      try { await unlink(tempFilePath); } catch {}
    }
  }
}