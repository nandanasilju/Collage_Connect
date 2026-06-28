import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { getAuthUser } from "@/lib/auth";

// GET /api/saved - Get all saved colleges for logged-in user
export async function GET() {
  try {
    const user = await getAuthUser();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const saved = await prisma.savedCollege.findMany({
      where: { userId: user.userId },
      include: {
        college: {
          include: {
            courses: true,
            facilities: true,
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    return NextResponse.json(saved);
  } catch (error: any) {
    console.error("Fetch saved colleges error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

// POST /api/saved - Save a college
export async function POST(request: Request) {
  try {
    const user = await getAuthUser();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { collegeId } = await request.json();
    if (!collegeId) {
      return NextResponse.json(
        { error: "College ID is required" },
        { status: 400 }
      );
    }

    // Check if college exists
    const college = await prisma.college.findUnique({
      where: { id: collegeId },
    });

    if (!college) {
      return NextResponse.json(
        { error: "College not found" },
        { status: 404 }
      );
    }

    // Create saved relation (unique constraint handles duplicates)
    try {
      const saved = await prisma.savedCollege.create({
        data: {
          userId: user.userId,
          collegeId: collegeId,
        },
        include: {
          college: true,
        },
      });
      return NextResponse.json(saved, { status: 201 });
    } catch (dbErr: any) {
      // Prisma unique constraint error code is P2002
      if (dbErr.code === "P2002") {
        return NextResponse.json(
          { error: "College already saved" },
          { status: 409 }
        );
      }
      throw dbErr;
    }
  } catch (error: any) {
    console.error("Save college error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

// DELETE /api/saved - Remove a saved college
export async function DELETE(request: Request) {
  try {
    const user = await getAuthUser();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const collegeId = searchParams.get("collegeId");

    if (!collegeId) {
      return NextResponse.json(
        { error: "College ID is required" },
        { status: 400 }
      );
    }

    // Delete relation
    await prisma.savedCollege.deleteMany({
      where: {
        userId: user.userId,
        collegeId: collegeId,
      },
    });

    return NextResponse.json({ message: "College removed from saved list" });
  } catch (error: any) {
    console.error("Remove saved college error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
