import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { getCollegeSummary } from "@/lib/gemini";

// GET /api/colleges/[id]/summary - Asynchronously generate AI summary of a college
export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    const college = await prisma.college.findUnique({
      where: { id },
    });

    if (!college) {
      return NextResponse.json({ error: "College not found" }, { status: 404 });
    }

    const summary = await getCollegeSummary(college);

    return NextResponse.json({ summary });
  } catch (error: any) {
    console.error("AI summary endpoint error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
