import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { getAuthUser } from "@/lib/auth";
import { GoogleGenerativeAI } from "@google/generative-ai";

const API_KEY = process.env.GEMINI_API_KEY || "";
const hasApiKey = !!API_KEY;

// POST /api/recommend - Retrieve AI recommendations based on user preferences
export async function POST() {
  try {
    const authUser = await getAuthUser();

    // Default query parameters for guest user
    let preferredBranch = "";
    let preferredLocation = "";
    let budget = 150000;
    let userName = "Student";

    if (authUser) {
      const dbUser = await prisma.user.findUnique({
        where: { id: authUser.userId },
      });
      if (dbUser) {
        preferredBranch = dbUser.preferredBranch || "";
        preferredLocation = dbUser.preferredLocation || "";
        budget = dbUser.budget || 150000;
        userName = dbUser.name;
      }
    }

    // Find all colleges
    const allColleges = await prisma.college.findMany({
      include: {
        courses: true,
        facilities: true,
      },
      orderBy: {
        aiScore: "desc",
      },
    });

    // Score colleges based on preferences
    const scoredColleges = allColleges.map((college) => {
      let score = college.aiScore;

      // Location match (+15 points)
      if (
        preferredLocation &&
        college.district.toLowerCase() === preferredLocation.toLowerCase()
      ) {
        score += 15;
      }

      // Budget match (+20 points if fees <= budget)
      if (college.fees <= budget) {
        score += 20;
      } else {
        // Penalty for going over budget
        score -= (college.fees - budget) / 5000;
      }

      // Branch match (+25 points if branch offered)
      if (preferredBranch) {
        const offersBranch = college.courses.some((c) =>
          c.name.toLowerCase().includes(preferredBranch.toLowerCase())
        );
        if (offersBranch) {
          score += 25;
        }
      }

      return { college, matchScore: parseFloat(score.toFixed(1)) };
    });

    // Sort by match score
    scoredColleges.sort((a, b) => b.matchScore - a.matchScore);

    const recommended = scoredColleges.slice(0, 3).map((item) => ({
      ...item.college,
      matchScore: item.matchScore,
    }));

    // Generate custom text explanation
    let explanation = "";
    if (recommended.length > 0) {
      if (hasApiKey) {
        try {
          const genAI = new GoogleGenerativeAI(API_KEY);
          const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
          const prompt = `You are an expert academic advisor. Write a friendly, 3-sentence recommendation statement for a student named ${userName}.
          They prefer the branch "${preferredBranch || "Any Engineering"}", location "${preferredLocation || "Any district in Kerala"}", and have a budget of ₹${budget.toLocaleString()}/year.
          The recommended colleges are:
          ${recommended.map((c) => `- ${c.name} (Fees: ₹${c.fees}/yr, District: ${c.district})`).join("\n")}
          
          Briefly explain why these colleges are excellent fits for their budget, branch, and location. Keep it to 3 sentences max.`;
          
          const result = await model.generateContent(prompt);
          explanation = result.response.text();
        } catch (geminiErr) {
          console.error("Gemini recommendation text error:", geminiErr);
        }
      }

      if (!explanation) {
        explanation = `Hi ${userName}! Based on your interest in **${preferredBranch || "Engineering"}**, a location preference of **${preferredLocation || "Kerala"}**, and a budget of **₹${budget.toLocaleString()}/year**, we highly recommend **${recommended[0]?.name}** as your top match. It offers excellent value and strong branch alignment, followed closely by **${recommended[1]?.name || "other top-tier colleges"}** which provide highly competitive placement percentages.`;
      }
    } else {
      explanation = "No specific colleges matched your preferences yet. Try updating your profile settings with preferred branches and budget.";
    }

    return NextResponse.json({
      userName,
      preferences: {
        preferredBranch,
        preferredLocation,
        budget,
      },
      recommendations: recommended,
      explanation,
    });
  } catch (error: any) {
    console.error("AI recommendations error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
