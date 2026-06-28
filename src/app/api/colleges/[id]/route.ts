import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { getAuthUser } from "@/lib/auth";

// GET /api/colleges/[id] - Fetch single college with courses, facilities, images, and reviews
export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> } // In Next.js 15, params is a Promise!
) {
  try {
    const { id } = await params;

    const college = await prisma.college.findUnique({
      where: { id },
      include: {
        courses: true,
        facilities: true,
        images: true,
        reviews: {
          where: { approved: true },
          include: {
            user: {
              select: {
                id: true,
                name: true,
                profileImage: true,
              },
            },
            likes: true,
          },
          orderBy: {
            createdAt: "desc",
          },
        },
      },
    });

    if (!college) {
      return NextResponse.json({ error: "College not found" }, { status: 404 });
    }

    // Track recently viewed history if user is logged in
    const user = await getAuthUser();
    if (user) {
      try {
        await prisma.recentlyViewed.upsert({
          where: {
            userId_collegeId: {
              userId: user.userId,
              collegeId: id,
            },
          },
          update: {
            viewedAt: new Date(),
          },
          create: {
            userId: user.userId,
            collegeId: id,
          },
        });
      } catch (historyErr) {
        console.error("Failed to update recently viewed history:", historyErr);
        // Do not fail the request if history logging fails
      }
    }

    return NextResponse.json(college);
  } catch (error: any) {
    console.error("Fetch college by ID error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

// PUT /api/colleges/[id] - Update college details (Admin only)
export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const user = await getAuthUser();
    if (!user || user.role !== "ADMIN") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
    }

    const { id } = await params;
    const body = await request.json();
    const {
      name,
      location,
      district,
      state,
      type,
      autonomous,
      description,
      fees,
      placementPercentage,
      highestPackage,
      averagePackage,
      hostel,
      transport,
      website,
      image,
      latitude,
      longitude,
      nearbyBusStand,
      nearbyRailway,
      nearbyAirport,
      courses, // array of { id, name, duration, intake }
      facilities, // array of { id, name }
    } = body;

    // Calculate AI Score if numbers are edited
    let aiScoreObj: any = {};
    if (placementPercentage !== undefined && averagePackage !== undefined && highestPackage !== undefined) {
      const score = parseFloat(((placementPercentage * 0.4) + (averagePackage * 5) + (highestPackage * 0.2)).toFixed(1));
      aiScoreObj = { aiScore: score };
    }

    // Basic fields update
    await prisma.college.update({
      where: { id },
      data: {
        name,
        location,
        district,
        state,
        type,
        autonomous: autonomous !== undefined ? !!autonomous : undefined,
        description,
        fees: fees !== undefined ? parseFloat(fees) : undefined,
        placementPercentage: placementPercentage !== undefined ? parseFloat(placementPercentage) : undefined,
        highestPackage: highestPackage !== undefined ? parseFloat(highestPackage) : undefined,
        averagePackage: averagePackage !== undefined ? parseFloat(averagePackage) : undefined,
        hostel: hostel !== undefined ? !!hostel : undefined,
        transport: transport !== undefined ? !!transport : undefined,
        website,
        image,
        latitude: latitude !== undefined ? parseFloat(latitude) : undefined,
        longitude: longitude !== undefined ? parseFloat(longitude) : undefined,
        nearbyBusStand,
        nearbyRailway,
        nearbyAirport,
        ...aiScoreObj,
      },
    });

    // Update courses if provided (Sync technique: delete old, write new)
    if (courses) {
      await prisma.course.deleteMany({ where: { collegeId: id } });
      if (courses.length > 0) {
        await prisma.course.createMany({
          data: courses.map((c: any) => ({
            name: c.name,
            duration: c.duration || "4 Years",
            intake: parseInt(c.intake || 60, 10),
            collegeId: id,
          })),
        });
      }
    }

    // Update facilities if provided
    if (facilities) {
      await prisma.facility.deleteMany({ where: { collegeId: id } });
      if (facilities.length > 0) {
        await prisma.facility.createMany({
          data: facilities.map((facName: string) => ({
            name: facName,
            collegeId: id,
          })),
        });
      }
    }

    const updatedCollege = await prisma.college.findUnique({
      where: { id },
      include: {
        courses: true,
        facilities: true,
        images: true,
      },
    });

    return NextResponse.json(updatedCollege);
  } catch (error: any) {
    console.error("Update college error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

// DELETE /api/colleges/[id] - Delete college (Admin only)
export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const user = await getAuthUser();
    if (!user || user.role !== "ADMIN") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
    }

    const { id } = await params;

    // Delete college (dependent relationships set to cascade delete in schema.prisma)
    await prisma.college.delete({
      where: { id },
    });

    return NextResponse.json({ message: "College deleted successfully" });
  } catch (error: any) {
    console.error("Delete college error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
