import { NextResponse } from "next/server";
import { getComparisonInsights } from "@/lib/gemini";

// POST /api/compare/insights - Generate AI comparison insights for up to 4 colleges
export async function POST(request: Request) {
  try {
    const { colleges } = await request.json();

    if (!colleges || !Array.isArray(colleges) || colleges.length === 0) {
      return NextResponse.json(
        { error: "A non-empty colleges array is required" },
        { status: 400 }
      );
    }

    const insights = await getComparisonInsights(colleges);

    return NextResponse.json({ insights });
  } catch (error: any) {
    console.error("AI comparison insights endpoint error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
