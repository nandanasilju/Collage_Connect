import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { getAuthUser } from "@/lib/auth";

// GET /api/history - Retrieve recently viewed colleges for the authenticated user
export async function GET() {
  try {
    const user = await getAuthUser();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const history = await prisma.recentlyViewed.findMany({
      where: { userId: user.userId },
      include: {
        college: {
          include: {
            courses: true,
          },
        },
      },
      orderBy: {
        viewedAt: "desc",
      },
      take: 6, // Show last 6 viewed colleges
    });

    return NextResponse.json(history);
  } catch (error: any) {
    console.error("Fetch history error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

// DELETE /api/history - Clear recently viewed history
export async function DELETE() {
  try {
    const user = await getAuthUser();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await prisma.recentlyViewed.deleteMany({
      where: { userId: user.userId },
    });

    return NextResponse.json({ message: "History cleared successfully" });
  } catch (error: any) {
    console.error("Clear history error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
