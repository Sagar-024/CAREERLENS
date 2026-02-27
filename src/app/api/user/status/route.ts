import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const TIER_LIMITS: Record<string, number> = {
  free: 2,
  starter: 20,
  pro: Infinity,
};

export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
      select: { id: true, tier: true, analysisCount: true, resetDate: true },
    });

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    const now = new Date();
    const daysSinceReset =
      (now.getTime() - new Date(user.resetDate).getTime()) /
      (1000 * 60 * 60 * 24);
    if (daysSinceReset > 30) {
      await prisma.user.update({
        where: { id: user.id },
        data: { analysisCount: 0, resetDate: now },
      });
      user.analysisCount = 0;
    }

    const limit = TIER_LIMITS[user.tier] ?? 2;
    const canAnalyze = user.analysisCount < limit;
    const remaining =
      limit === Infinity ? 9999 : Math.max(0, limit - user.analysisCount);

    return NextResponse.json({
      tier: user.tier,
      analysisCount: user.analysisCount,
      canAnalyze,
      remainingAnalyses: remaining,
      limit: limit === Infinity ? "unlimited" : limit,
    });
  } catch (error) {
    console.error("User status error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}
