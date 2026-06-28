import Link from "next/link";
import prisma from "@/lib/prisma";
import CollegeCard from "@/components/CollegeCard";
import {
  FeesBarChart,
  PlacementsBarChart,
  TypePieChart,
  DistrictBarChart,
  RatingLineChart,
} from "@/components/Charts";
import {
  GraduationCap,
  Search,
  Scale,
  BarChart3,
  Bot,
  Layers,
  ArrowRight,
  TrendingUp,
  MapPin,
  Trophy,
  Sparkles,
} from "lucide-react";
import SearchRedirector from "@/components/SearchRedirector"; // Simple client redirect component

export const revalidate = 0; // Disable server caching for dynamic statistics

export default async function LandingPage() {
  // Fetch featured top-rated colleges
  const colleges = await prisma.college.findMany({
    take: 3,
    orderBy: { rating: "desc" },
    include: { courses: true, facilities: true },
  });

  // Fetch all colleges to calculate metrics
  const allColleges = await prisma.college.findMany({
    select: {
      type: true,
      fees: true,
      district: true,
      name: true,
      placementPercentage: true,
      averagePackage: true,
      rating: true,
    },
  });

  // 1. Avg fees by type
  const typeFeesMap: Record<string, { sum: number; count: number }> = {};
  allColleges.forEach((c) => {
    typeFeesMap[c.type] = typeFeesMap[c.type] || { sum: 0, count: 0 };
    typeFeesMap[c.type].sum += c.fees;
    typeFeesMap[c.type].count++;
  });
  const avgFeesData = Object.keys(typeFeesMap).map((type) => ({
    type,
    avgFees: Math.round(typeFeesMap[type].sum / typeFeesMap[type].count),
  }));

  // 2. Govt vs Private counts
  const govtPrivateMap: Record<string, number> = {};
  allColleges.forEach((c) => {
    const groupName = c.type.includes("Gov") ? "Govt / Aided" : "Private";
    govtPrivateMap[groupName] = (govtPrivateMap[groupName] || 0) + 1;
  });
  const typePieData = Object.keys(govtPrivateMap).map((name) => ({
    name,
    value: govtPrivateMap[name],
  }));

  // 3. District-wise distribution
  const districtMap: Record<string, number> = {};
  allColleges.forEach((c) => {
    districtMap[c.district] = (districtMap[c.district] || 0) + 1;
  });
  const districtData = Object.keys(districtMap).map((district) => ({
    district,
    count: districtMap[district],
  }));

  // 4. Placements (Top 5)
  const placementsData = allColleges
    .slice(0, 5)
    .map((c) => ({
      name: c.name.split(",")[0].replace("Government ", "Govt "),
      placementPercentage: c.placementPercentage,
      averagePackage: c.averagePackage,
    }));

  // 5. Ratings (Top 6)
  const ratingsData = allColleges
    .slice(0, 6)
    .map((c) => ({
      name: c.name.split(",")[0].replace("Government ", "Govt "),
      rating: c.rating,
    }));

  return (
    <div className="space-y-16 pb-20">
      
      {/* 1. Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-blue-600 via-indigo-600 to-violet-700 text-white py-20 px-4 sm:px-6 lg:px-8 shadow-inner">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-white/10 via-transparent to-transparent pointer-events-none" />
        <div className="max-w-5xl mx-auto text-center space-y-8 relative z-10">
          
          <div className="inline-flex items-center space-x-2 bg-white/10 hover:bg-white/15 px-4 py-1.5 rounded-full text-sm font-semibold border border-white/10 transition-colors">
            <Sparkles className="w-4.5 h-4.5 text-amber-300 animate-spin" />
            <span>AI-Powered Admissions Assistance for Kerala</span>
          </div>

          <h1 className="text-4xl sm:text-6xl font-extrabold tracking-tight leading-none">
            Find the Perfect <span className="underline decoration-wavy decoration-amber-300">Engineering</span> College
          </h1>
          <p className="max-w-2xl mx-auto text-base sm:text-xl text-blue-100 font-medium">
            Search, compare, analyze placement figures, and receive smart AI recommendations to accelerate your academic career in Kerala.
          </p>

          {/* Landing Search Bar */}
          <div className="max-w-2xl mx-auto">
            <SearchRedirector />
          </div>

          {/* Quick CTA Actions */}
          <div className="flex flex-wrap justify-center gap-4 text-sm font-semibold">
            <Link
              href="/predictor"
              className="px-6 py-3 rounded-xl bg-amber-400 hover:bg-amber-500 text-slate-900 shadow-lg shadow-amber-500/20 active:scale-95 transition-all"
            >
              Predict Admission by Rank
            </Link>
            <Link
              href="/compare"
              className="px-6 py-3 rounded-xl bg-white/10 hover:bg-white/15 border border-white/20 hover:border-white/30 text-white backdrop-blur active:scale-95 transition-all"
            >
              Compare Colleges
            </Link>
          </div>
        </div>
      </section>

      {/* 2. Stats Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-8 rounded-3xl shadow-sm transition-colors">
          <div className="text-center space-y-1">
            <GraduationCap className="w-8 h-8 text-blue-500 mx-auto" />
            <p className="text-3xl font-extrabold text-slate-800 dark:text-slate-100">{allColleges.length}+</p>
            <p className="text-xs text-slate-400 font-bold uppercase tracking-wider">Colleges Indexed</p>
          </div>
          <div className="text-center space-y-1 border-l border-slate-100 dark:border-slate-800">
            <TrendingUp className="w-8 h-8 text-indigo-500 mx-auto" />
            <p className="text-3xl font-extrabold text-slate-800 dark:text-slate-100">98%</p>
            <p className="text-xs text-slate-400 font-bold uppercase tracking-wider">Top Placement Rate</p>
          </div>
          <div className="text-center space-y-1 border-l border-slate-100 dark:border-slate-800">
            <Trophy className="w-8 h-8 text-emerald-500 mx-auto" />
            <p className="text-3xl font-extrabold text-slate-800 dark:text-slate-100">45 LPA</p>
            <p className="text-xs text-slate-400 font-bold uppercase tracking-wider">Highest CTC</p>
          </div>
          <div className="text-center space-y-1 border-l border-slate-100 dark:border-slate-800">
            <Bot className="w-8 h-8 text-violet-500 mx-auto" />
            <p className="text-3xl font-extrabold text-slate-800 dark:text-slate-100">24/7</p>
            <p className="text-xs text-slate-400 font-bold uppercase tracking-wider">AI Support</p>
          </div>
        </div>
      </section>

      {/* 3. Core Features Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        <div className="text-center space-y-2">
          <h2 className="text-3xl font-extrabold text-slate-800 dark:text-slate-100">Smart Features</h2>
          <p className="text-slate-500 dark:text-slate-400 max-w-xl mx-auto text-sm">
            Discover resources, comparison insights, and tools specifically designed for KEAM aspirants.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-6 rounded-2xl space-y-3 hover:shadow-md transition-shadow">
            <Search className="w-10 h-10 text-blue-500 bg-blue-50 dark:bg-blue-950/30 p-2.5 rounded-xl" />
            <h3 className="font-bold text-lg text-slate-800 dark:text-slate-100">Advanced Listing</h3>
            <p className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed">
              Filter by annual tuition budget, district, autonomous status, hostel availability, and transport routes.
            </p>
          </div>
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-6 rounded-2xl space-y-3 hover:shadow-md transition-shadow">
            <Scale className="w-10 h-10 text-indigo-500 bg-indigo-50 dark:bg-indigo-950/30 p-2.5 rounded-xl" />
            <h3 className="font-bold text-lg text-slate-800 dark:text-slate-100">Multi-College Compare</h3>
            <p className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed">
              Select up to four colleges side-by-side to review average packages, academic facilities, and AI assessment scores.
            </p>
          </div>
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-6 rounded-2xl space-y-3 hover:shadow-md transition-shadow">
            <BarChart3 className="w-10 h-10 text-emerald-500 bg-emerald-50 dark:bg-emerald-950/30 p-2.5 rounded-xl" />
            <h3 className="font-bold text-lg text-slate-800 dark:text-slate-100">KEAM Predictor</h3>
            <p className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed">
              Estimate your admission probability and get Dream, Target, and Safety colleges based on your rank.
            </p>
          </div>
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-6 rounded-2xl space-y-3 hover:shadow-md transition-shadow">
            <Bot className="w-10 h-10 text-violet-500 bg-violet-50 dark:bg-violet-950/30 p-2.5 rounded-xl" />
            <h3 className="font-bold text-lg text-slate-800 dark:text-slate-100">AI Chat Consultant</h3>
            <p className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed">
              Receive guidance on engineering paths, roadmap suggestions, and immediate answers regarding fee details.
            </p>
          </div>
        </div>
      </section>

      {/* 4. Featured Colleges Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        <div className="flex justify-between items-end border-b border-slate-200 dark:border-slate-800 pb-4">
          <div className="space-y-1">
            <h2 className="text-3xl font-extrabold text-slate-800 dark:text-slate-100">Featured Colleges</h2>
            <p className="text-slate-500 dark:text-slate-400 text-sm">
              Discover top-rated engineering institutions offering world-class programs.
            </p>
          </div>
          <Link
            href="/colleges"
            className="flex items-center text-sm font-bold text-blue-600 dark:text-blue-400 hover:underline"
          >
            Explore all <ArrowRight className="w-4 h-4 ml-1" />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {colleges.map((college) => (
            <CollegeCard
              key={college.id}
              id={college.id}
              name={college.name}
              image={college.image}
              rating={college.rating}
              fees={college.fees}
              placementPercentage={college.placementPercentage}
              aiScore={college.aiScore}
              district={college.district}
              type={college.type}
            />
          ))}
        </div>
      </section>

      {/* 5. Analytics Dashboard Charts Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        <div className="text-center space-y-2">
          <h2 className="text-3xl font-extrabold text-slate-800 dark:text-slate-100">Platform Analytics</h2>
          <p className="text-slate-500 dark:text-slate-400 max-w-xl mx-auto text-sm">
            Explore overall comparisons of tuition structures, placement rates, and regional allocation ratios.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          
          {/* Average Fees by Type */}
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-6 rounded-2xl shadow-sm space-y-4">
            <h3 className="font-bold text-slate-800 dark:text-slate-100 text-sm">Average Annual Fees (INR)</h3>
            <FeesBarChart data={avgFeesData} />
          </div>

          {/* Placement Distribution */}
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-6 rounded-2xl shadow-sm space-y-4">
            <h3 className="font-bold text-slate-800 dark:text-slate-100 text-sm">Placement vs Avg Packages (LPA)</h3>
            <PlacementsBarChart data={placementsData} />
          </div>

          {/* District Wise Distribution */}
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-6 rounded-2xl shadow-sm space-y-4">
            <h3 className="font-bold text-slate-800 dark:text-slate-100 text-sm">College Count by District</h3>
            <DistrictBarChart data={districtData} />
          </div>

          {/* Govt vs Private Allocation */}
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-6 rounded-2xl shadow-sm space-y-4">
            <h3 className="font-bold text-slate-800 dark:text-slate-100 text-sm">Administrative Allocation</h3>
            <TypePieChart data={typePieData} />
          </div>

        </div>
      </section>

      {/* 6. Testimonials Section */}
      <section className="bg-slate-100 dark:bg-slate-900/50 py-16 transition-colors duration-300">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
          <div className="text-center space-y-2">
            <h2 className="text-3xl font-extrabold text-slate-800 dark:text-slate-100">Student Testimonials</h2>
            <p className="text-slate-500 dark:text-slate-400 text-sm">
              Read how College Discovery is helping thousands of students make informed educational decisions.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-100 dark:border-slate-850 shadow-sm space-y-4">
              <p className="text-sm text-slate-500 dark:text-slate-400 italic">
                "The KEAM Predictor is extremely accurate! It gave me Government Model Engineering College as a moderate match, and I got allotment there in the first round!"
              </p>
              <div>
                <p className="font-bold text-sm text-slate-800 dark:text-slate-200">Rohit S. Nair</p>
                <p className="text-xs text-slate-400">B.Tech CSE Student</p>
              </div>
            </div>
            <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-100 dark:border-slate-850 shadow-sm space-y-4">
              <p className="text-sm text-slate-500 dark:text-slate-400 italic">
                "I was confused between CET and MEC for placements. The Comparison Tool side-by-side table along with the AI ROI analysis gave me clear directions."
              </p>
              <div>
                <p className="font-bold text-sm text-slate-800 dark:text-slate-200">Aditi Krishna</p>
                <p className="text-xs text-slate-400">Admitted B.Tech 2026</p>
              </div>
            </div>
            <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-100 dark:border-slate-850 shadow-sm space-y-4">
              <p className="text-sm text-slate-500 dark:text-slate-400 italic">
                "I asked the chatbot for autonomous colleges in Kochi with fee constraints. The answer was prompt, exact, and helped me finalize my application registry."
              </p>
              <div>
                <p className="font-bold text-sm text-slate-800 dark:text-slate-200">Midhun Paul</p>
                <p className="text-xs text-slate-400">KEAM Rank: 4200</p>
              </div>
            </div>
          </div>
        </div>
      </section>

    </div>
  );
}
