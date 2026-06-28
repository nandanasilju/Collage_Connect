import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { GoogleGenerativeAI } from "@google/generative-ai";

const API_KEY = process.env.GEMINI_API_KEY || "";
const hasApiKey = !!API_KEY;

// POST /api/predict - Predict college admission chances based on rank & preferences
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { rank, category, gender, budget, district, branch } = body;

    if (rank === undefined || rank === null) {
      return NextResponse.json(
        { error: "KEAM Rank is required" },
        { status: 400 }
      );
    }

    const studentRank = parseInt(rank, 10);
    const maxBudget = budget ? parseFloat(budget) : 200000;
    const selectedBranch = branch || "Computer Science & Engineering";

    // 1. Fetch colleges
    const colleges = await prisma.college.findMany({
      include: {
        courses: true,
      },
    });

    const dreamColleges: any[] = [];
    const moderateColleges: any[] = [];
    const safeColleges: any[] = [];

    // 2. Predict chances for each college
    for (const college of colleges) {
      // Apply budget filter
      if (college.fees > maxBudget) continue;

      // Apply district filter if selected
      if (district && college.district.toLowerCase() !== district.toLowerCase()) continue;

      // Check if college offers the branch
      const offersBranch = college.courses.some((c) =>
        c.name.toLowerCase().includes(selectedBranch.toLowerCase())
      );
      if (!offersBranch) continue;

      // Calculate realistic cutoff rank
      // Base cutoff based on college rating
      let baseCutoff = Math.pow(5.1 - college.rating, 2.4) * 16000 + 400;

      // Branch adjustments (CSE is hardest/lowest cutoff, Mechanical/Civil are easier/higher cutoffs)
      const branchLower = selectedBranch.toLowerCase();
      let branchMultiplier = 1.0;
      if (branchLower.includes("electronics") && branchLower.includes("communication")) {
        branchMultiplier = 1.6;
      } else if (branchLower.includes("electrical")) {
        branchMultiplier = 2.2;
      } else if (branchLower.includes("mechanical")) {
        branchMultiplier = 2.8;
      } else if (branchLower.includes("civil")) {
        branchMultiplier = 3.2;
      } else if (branchLower.includes("artificial") || branchLower.includes("ai")) {
        branchMultiplier = 1.2;
      }

      // Category adjustments
      let categoryMultiplier = 1.0;
      if (category === "OBC") {
        categoryMultiplier = 1.25;
      } else if (category === "SC") {
        categoryMultiplier = 2.8;
      } else if (category === "ST") {
        categoryMultiplier = 3.8;
      }

      // Gender adjustments
      const genderMultiplier = gender === "Female" ? 1.05 : 1.0;

      // Final estimated cutoff rank for this college and branch
      const estimatedCutoff = Math.round(baseCutoff * branchMultiplier * categoryMultiplier * genderMultiplier);

      // Categorize match
      const ratio = studentRank / estimatedCutoff;

      const collegeData = {
        id: college.id,
        name: college.name,
        district: college.district,
        fees: college.fees,
        rating: college.rating,
        placementPercentage: college.placementPercentage,
        averagePackage: college.averagePackage,
        image: college.image,
        estimatedCutoff,
      };

      if (ratio < 0.9) {
        // Safe: cutoff is much higher than student rank (e.g. cutoff is 5000, student rank is 2500, ratio is 0.5)
        safeColleges.push(collegeData);
      } else if (ratio >= 0.9 && ratio <= 1.3) {
        // Moderate: cutoff is close to student rank
        moderateColleges.push(collegeData);
      } else if (ratio > 1.3 && ratio <= 2.2) {
        // Dream: cutoff is lower than student rank (e.g. cutoff is 1500, student rank is 2500, ratio is 1.67)
        dreamColleges.push(collegeData);
      }
    }

    // Sort outputs by academic rating
    const sorter = (a: any, b: any) => b.rating - a.rating;
    dreamColleges.sort(sorter);
    moderateColleges.sort(sorter);
    safeColleges.sort(sorter);

    // 3. Generate AI summary advice
    let explanation = "";
    if (hasApiKey) {
      try {
        const genAI = new GoogleGenerativeAI(API_KEY);
        const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
        const prompt = `A student with KEAM Rank ${studentRank} under reservation category "${category || "General"}" (${gender}) wants to get into "${selectedBranch}".
        Our predictor determined:
        - Dream Colleges: ${dreamColleges.slice(0, 2).map((c) => c.name).join(", ") || "None"}
        - Moderate Colleges: ${moderateColleges.slice(0, 2).map((c) => c.name).join(", ") || "None"}
        - Safe Colleges: ${safeColleges.slice(0, 2).map((c) => c.name).join(", ") || "None"}
        
        Write a 3-sentence admissions advice for this student, outlining their strategic choices during the option registration phase.`;

        const result = await model.generateContent(prompt);
        explanation = result.response.text();
      } catch (geminiErr) {
        console.error("Gemini predictor advice error:", geminiErr);
      }
    }

    if (!explanation) {
      const topDream = dreamColleges[0]?.name;
      const topMod = moderateColleges[0]?.name;
      const topSafe = safeColleges[0]?.name;

      explanation = `With a KEAM rank of **${studentRank.toLocaleString()}**, you have a strong chance of securing admission. 
      We recommend listing **${topMod || "Moderate options"}** as your primary choices in the option entry portal. 
      You should also list **${topDream || "Dream options"}** first in case of rank sliding, and keep **${topSafe || "Safe options"}** as reliable backups at the bottom.`;
    }

    return NextResponse.json({
      rank: studentRank,
      category,
      gender,
      branch: selectedBranch,
      results: {
        dream: dreamColleges,
        moderate: moderateColleges,
        safe: safeColleges,
      },
      explanation,
    });
  } catch (error: any) {
    console.error("Predict admission chances error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
