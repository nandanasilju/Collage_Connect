import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import prisma from "@/lib/prisma";
import { getAuthUser } from "@/lib/auth";

// GET /api/profile - Fetch profile info and dashboard summary statistics
export async function GET() {
  try {
    const user = await getAuthUser();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const userData = await prisma.user.findUnique({
      where: { id: user.userId },
      select: {
        id: true,
        name: true,
        email: true,
        profileImage: true,
        preferredBranch: true,
        preferredLocation: true,
        budget: true,
        role: true,
        createdAt: true,
      },
    });

    if (!userData) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // Gather dashboard statistics
    const savedCount = await prisma.savedCollege.count({
      where: { userId: user.userId },
    });

    const reviewsCount = await prisma.review.count({
      where: { userId: user.userId },
    });

    const historyCount = await prisma.recentlyViewed.count({
      where: { userId: user.userId },
    });

    return NextResponse.json({
      profile: userData,
      stats: {
        savedCount,
        reviewsCount,
        historyCount,
      },
    });
  } catch (error: any) {
    console.error("Fetch profile error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

// PUT /api/profile - Update profile details
export async function PUT(request: Request) {
  try {
    const user = await getAuthUser();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const { name, email, password, preferredBranch, preferredLocation, budget } = body;

    // Check if email is already taken by another user
    if (email) {
      const existingUser = await prisma.user.findUnique({
        where: { email },
      });
      if (existingUser && existingUser.id !== user.userId) {
        return NextResponse.json(
          { error: "Email is already taken by another account" },
          { status: 400 }
        );
      }
    }

    const updateData: any = {};
    if (name) updateData.name = name;
    if (email) updateData.email = email;
    if (preferredBranch !== undefined) updateData.preferredBranch = preferredBranch;
    if (preferredLocation !== undefined) updateData.preferredLocation = preferredLocation;
    if (budget !== undefined) updateData.budget = budget ? parseFloat(budget) : null;

    if (password) {
      if (password.length < 6) {
        return NextResponse.json(
          { error: "Password must be at least 6 characters long" },
          { status: 400 }
        );
      }
      updateData.password = await bcrypt.hash(password, 10);
    }

    const updatedUser = await prisma.user.update({
      where: { id: user.userId },
      data: updateData,
      select: {
        id: true,
        name: true,
        email: true,
        profileImage: true,
        preferredBranch: true,
        preferredLocation: true,
        budget: true,
        role: true,
      },
    });

    return NextResponse.json({
      message: "Profile updated successfully",
      user: updatedUser,
    });
  } catch (error: any) {
    console.error("Update profile error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
