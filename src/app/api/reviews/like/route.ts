import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { getAuthUser } from "@/lib/auth";

// POST /api/reviews/like - Toggle like on a review
export async function POST(request: Request) {
  try {
    const user = await getAuthUser();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { reviewId } = await request.json();

    if (!reviewId) {
      return NextResponse.json(
        { error: "Review ID is required" },
        { status: 400 }
      );
    }

    // Check if review exists
    const review = await prisma.review.findUnique({
      where: { id: reviewId },
    });

    if (!review) {
      return NextResponse.json({ error: "Review not found" }, { status: 404 });
    }

    // Check if user already liked it
    const existingLike = await prisma.reviewLike.findUnique({
      where: {
        userId_reviewId: {
          userId: user.userId,
          reviewId: reviewId,
        },
      },
    });

    if (existingLike) {
      // Unlike
      await prisma.reviewLike.delete({
        where: {
          userId_reviewId: {
            userId: user.userId,
            reviewId: reviewId,
          },
        },
      });
      return NextResponse.json({ liked: false, message: "Review unliked" });
    } else {
      // Like
      await prisma.reviewLike.create({
        data: {
          userId: user.userId,
          reviewId: reviewId,
        },
      });
      return NextResponse.json({ liked: true, message: "Review liked" });
    }
  } catch (error: any) {
    console.error("Toggle review like error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
