import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { getAuthUser } from "@/lib/auth";

// Helper function to update a college's average rating
async function updateCollegeRating(collegeId: string) {
  try {
    const reviews = await prisma.review.findMany({
      where: { collegeId, approved: true },
      select: { rating: true },
    });

    const average =
      reviews.length > 0
        ? parseFloat(
            (reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length).toFixed(1)
          )
        : 0.0;

    await prisma.college.update({
      where: { id: collegeId },
      data: { rating: average },
    });
  } catch (err) {
    console.error("Failed to update college average rating:", err);
  }
}

// GET /api/reviews - Get all reviews (Admin only, for moderation dashboard)
export async function GET() {
  try {
    const user = await getAuthUser();
    if (!user || user.role !== "ADMIN") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
    }

    const reviews = await prisma.review.findMany({
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
            profileImage: true,
          },
        },
        college: {
          select: {
            id: true,
            name: true,
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    return NextResponse.json(reviews);
  } catch (error: any) {
    console.error("Fetch reviews error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

// POST /api/reviews - Submit a review
export async function POST(request: Request) {
  try {
    const user = await getAuthUser();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { rating, comment, collegeId } = await request.json();

    if (!collegeId || !rating || !comment) {
      return NextResponse.json(
        { error: "Missing required review fields" },
        { status: 400 }
      );
    }

    const numericRating = parseInt(rating, 10);
    if (numericRating < 1 || numericRating > 5) {
      return NextResponse.json(
        { error: "Rating must be between 1 and 5" },
        { status: 400 }
      );
    }

    // Submit review (default approved=true for this app so reviews show up immediately, but admins can moderate them)
    const review = await prisma.review.create({
      data: {
        rating: numericRating,
        comment,
        collegeId,
        userId: user.userId,
        approved: true,
      },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            profileImage: true,
          },
        },
      },
    });

    // Update college average rating
    await updateCollegeRating(collegeId);

    return NextResponse.json(review, { status: 201 });
  } catch (error: any) {
    console.error("Submit review error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

// PATCH /api/reviews - Toggle approval status (Admin only)
export async function PATCH(request: Request) {
  try {
    const user = await getAuthUser();
    if (!user || user.role !== "ADMIN") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
    }

    const { reviewId, approved } = await request.json();
    if (!reviewId) {
      return NextResponse.json({ error: "Review ID is required" }, { status: 400 });
    }

    const review = await prisma.review.update({
      where: { id: reviewId },
      data: { approved: !!approved },
    });

    // Update rating since approval status changed
    await updateCollegeRating(review.collegeId);

    return NextResponse.json(review);
  } catch (error: any) {
    console.error("Moderate review error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

// DELETE /api/reviews - Delete a review
export async function DELETE(request: Request) {
  try {
    const user = await getAuthUser();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const reviewId = searchParams.get("reviewId");

    if (!reviewId) {
      return NextResponse.json(
        { error: "Review ID is required" },
        { status: 400 }
      );
    }

    // Find the review to check ownership
    const review = await prisma.review.findUnique({
      where: { id: reviewId },
    });

    if (!review) {
      return NextResponse.json({ error: "Review not found" }, { status: 404 });
    }

    // Allow if user is admin OR author of the review
    if (user.role !== "ADMIN" && review.userId !== user.userId) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    await prisma.review.delete({
      where: { id: reviewId },
    });

    // Update college average rating
    await updateCollegeRating(review.collegeId);

    return NextResponse.json({ message: "Review deleted successfully" });
  } catch (error: any) {
    console.error("Delete review error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
