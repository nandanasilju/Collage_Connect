import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { getAuthUser } from "@/lib/auth";

// GET /api/colleges - Fetch colleges with search, filters, sorting, and pagination
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);

    // Pagination
    const page = parseInt(searchParams.get("page") || "1", 10);
    const limit = parseInt(searchParams.get("limit") || "10", 10);
    const skip = (page - 1) * limit;

    // Filters
    const search = searchParams.get("search") || "";
    const district = searchParams.get("district") || "";
    const type = searchParams.get("type") || "";
    const autonomous = searchParams.get("autonomous");
    const hostel = searchParams.get("hostel");
    const transport = searchParams.get("transport");
    const maxFees = searchParams.get("maxFees");
    const minPlacement = searchParams.get("minPlacement");
    const branch = searchParams.get("branch") || "";

    // Sorting
    const sortBy = searchParams.get("sortBy") || "rating";
    const sortOrder = searchParams.get("sortOrder") || "desc";

    // Build query conditions
    const where: any = {};

    if (search) {
      where.OR = [
        { name: { contains: search } },
        { location: { contains: search } },
        { description: { contains: search } },
      ];
    }

    if (district) {
      where.district = district;
    }

    if (type) {
      where.type = type;
    }

    if (autonomous !== null && autonomous !== undefined && autonomous !== "") {
      where.autonomous = autonomous === "true";
    }

    if (hostel !== null && hostel !== undefined && hostel !== "") {
      where.hostel = hostel === "true";
    }

    if (transport !== null && transport !== undefined && transport !== "") {
      where.transport = transport === "true";
    }

    if (maxFees) {
      where.fees = { lte: parseFloat(maxFees) };
    }

    if (minPlacement) {
      where.placementPercentage = { gte: parseFloat(minPlacement) };
    }

    if (branch) {
      where.courses = {
        some: {
          name: { contains: branch },
        },
      };
    }

    // Build orderBy
    let orderBy: any = {};
    if (sortBy === "fees") {
      orderBy = { fees: sortOrder };
    } else if (sortBy === "placement") {
      orderBy = { placementPercentage: sortOrder };
    } else if (sortBy === "name") {
      orderBy = { name: sortOrder };
    } else if (sortBy === "highestPackage") {
      orderBy = { highestPackage: sortOrder };
    } else {
      // Default to rating
      orderBy = { rating: sortOrder };
    }

    // Fetch matching colleges and count
    const [colleges, total] = await prisma.$transaction([
      prisma.college.findMany({
        where,
        orderBy,
        skip,
        take: limit,
        include: {
          courses: true,
          facilities: true,
          images: true,
        },
      }),
      prisma.college.count({ where }),
    ]);

    return NextResponse.json({
      colleges,
      total,
      page,
      pages: Math.ceil(total / limit),
    });
  } catch (error: any) {
    console.error("Fetch colleges error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

// POST /api/colleges - Create a new college (Admin only)
export async function POST(request: Request) {
  try {
    const user = await getAuthUser();
    if (!user || user.role !== "ADMIN") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
    }

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
      courses, // array of { name, duration, intake }
      facilities, // array of strings
      images, // array of strings
    } = body;

    if (!name || !location || !district || !state || !type || !description || fees === undefined) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    const aiScore = parseFloat(((placementPercentage * 0.4) + (averagePackage * 5) + (highestPackage * 0.2)).toFixed(1)) || 75.0;

    const college = await prisma.college.create({
      data: {
        name,
        location,
        district,
        state,
        type,
        autonomous: !!autonomous,
        description,
        fees: parseFloat(fees),
        rating: 4.0, // Default rating for new colleges
        placementPercentage: parseFloat(placementPercentage || 0),
        highestPackage: parseFloat(highestPackage || 0),
        averagePackage: parseFloat(averagePackage || 0),
        hostel: !!hostel,
        transport: !!transport,
        website,
        image: image || "https://images.unsplash.com/photo-1562774053-701939374585?auto=format&fit=crop&q=80&w=800",
        latitude: parseFloat(latitude || 10.0),
        longitude: parseFloat(longitude || 76.0),
        nearbyBusStand,
        nearbyRailway,
        nearbyAirport,
        aiScore: aiScore,
        courses: {
          create: courses && courses.length > 0 ? courses : [],
        },
        facilities: {
          create: facilities && facilities.length > 0 ? facilities.map((name: string) => ({ name })) : [],
        },
        images: {
          create: images && images.length > 0 ? images.map((url: string) => ({ url })) : [],
        },
      },
      include: {
        courses: true,
        facilities: true,
        images: true,
      },
    });

    return NextResponse.json(college, { status: 201 });
  } catch (error: any) {
    console.error("Create college error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
