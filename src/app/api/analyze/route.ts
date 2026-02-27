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
  let tempFilePath: string | null = null;

  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
      return NextResponse.json(
        { error: "Please login to analyze your resume" },
        { status: 401 },
      );
    }

    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
    });
    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    const isWhitelisted = ADMIN_EMAILS.includes(session.user.email);
    const effectiveTier = isWhitelisted ? "pro" : user.tier;

    const limit = TIER_LIMITS[effectiveTier] ?? 2;
    if (user.analysisCount >= limit) {
      return NextResponse.json(
        {
          error:
            "You have reached your monthly analysis limit. Please upgrade to continue.",
          tier: user.tier,
          upgradeRequired: true,
        },
        { status: 403 },
      );
    }

    const formData = await request.formData();
    const resumeFile = formData.get("resume") as File | null;
    const jdText = formData.get("jd_text") as string | null;

    if (!resumeFile) {
      return NextResponse.json(
        { error: "Resume PDF file is required" },
        { status: 400 },
      );
    }
    if (!jdText || jdText.trim().length < 50) {
      return NextResponse.json(
        {
          error:
            "Please paste the complete job description (at least 50 characters)",
        },
        { status: 400 },
      );
    }
    if (!resumeFile.name.toLowerCase().endsWith(".pdf")) {
      return NextResponse.json(
        {
          error:
            "Only PDF files are accepted. Please convert your resume to PDF first.",
        },
        { status: 400 },
      );
    }
    if (resumeFile.size > 10 * 1024 * 1024) {
      return NextResponse.json(
        { error: "File too large. Maximum file size is 10MB." },
        { status: 400 },
      );
    }

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

    const mlServiceUrl = process.env.ML_SERVICE_URL || "http://localhost:8000";

    const mlResponse = await axios.post(
      `${mlServiceUrl}/api/v1/analyze`,
      mlFormData,
      {
        headers: mlFormData.getHeaders(),
        timeout: 60000,
        maxContentLength: Infinity,
        maxBodyLength: Infinity,
      },
    );

    const mlResult = mlResponse.data;

    const savedAnalysis = await prisma.analysis.create({
      data: {
        userId: user.id,
        finalScore: mlResult.final_score,
        readinessLabel: mlResult.readiness_label,
        matchedCount: mlResult.matched_skills?.length || 0,
        missingCount: mlResult.missing_skills?.length || 0,
        totalCount: mlResult.jd_skills?.length || 0,
        resumeSkills: mlResult.resume_skills,
        jdSkills: mlResult.jd_skills,
        matchedSkills: mlResult.matched_skills,
        missingSkills: mlResult.missing_skills,
        explanations: mlResult.explanations,
        courses: mlResult.courses,
        metadata: mlResult.metadata,
        resumeText: null,
        jdText: jdText.trim(),
        jobTitle:
          jdText.trim().split("\n")[0]?.substring(0, 100) ?? "Unknown Role",
      },
    });

    await prisma.user.update({
      where: { id: user.id },
      data: { analysisCount: { increment: 1 } },
    });

    return NextResponse.json({
      ...mlResult,
      analysis_id: savedAnalysis.id,
    });
  } catch (error: any) {
    console.error("Analysis route error:", error);

    if (error.code === "ECONNREFUSED") {
      return NextResponse.json(
        {
          error:
            "AI service is currently unavailable. Please try again in a moment.",
        },
        { status: 503 },
      );
    }

    if (axios.isAxiosError(error) && error.response) {
      return NextResponse.json(
        {
          error:
            error.response.data?.detail ||
            "AI processing failed. Please try again.",
        },
        { status: 500 },
      );
    }

    return NextResponse.json(
      { error: `Analysis failed: ${error.message || String(error)}` },
      { status: 500 },
    );
  } finally {
    if (tempFilePath) {
      try {
        await unlink(tempFilePath);
      } catch {}
    }
  }
}
