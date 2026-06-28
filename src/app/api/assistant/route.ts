import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { getAssistantResponse } from "@/lib/gemini";

// POST /api/assistant - Chatbot interaction endpoint
export async function POST(request: Request) {
  try {
    const { message, history } = await request.json();

    if (!message) {
      return NextResponse.json(
        { error: "Message is required" },
        { status: 400 }
      );
    }

    // Fetch all colleges to feed context to the chatbot
    const colleges = await prisma.college.findMany({
      select: {
        name: true,
        location: true,
        district: true,
        fees: true,
        rating: true,
        placementPercentage: true,
        averagePackage: true,
        type: true,
        autonomous: true,
        hostel: true,
      },
    });

    const chatHistory = history || [];

    const aiResponse = await getAssistantResponse(message, chatHistory, colleges);

    return NextResponse.json({ response: aiResponse });
  } catch (error: any) {
    console.error("AI assistant endpoint error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
