// app/api/analyze/[id]/route.ts
import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

const prisma = new PrismaClient();

export async function GET(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    // Security: Make sure they are logged in before checking job status
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;

    const job = await prisma.analysis.findUnique({
      where: { id },
    });

    if (!job) {
      return NextResponse.json({ error: "Job not found" }, { status: 404 });
    }

    // Return the exact row. If status is COMPLETED, this will contain all the ML data!
    return NextResponse.json(job);

  } catch (error) {
    console.error("🚨 Polling Error inside GET route:", error); // <-- Add this tripwire
    return NextResponse.json({ error: "Failed to fetch status" }, { status: 500 });
  }
}

export async function DELETE(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;

    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
    });

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    await prisma.analysis.delete({
      where: {
        id,
        userId: user.id, // Only delete if the user owns this analysis
      },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("🚨 Error deleting analysis:", error);
    return NextResponse.json({ error: "Failed to delete analysis" }, { status: 500 });
  }
}
