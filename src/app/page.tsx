import Link from "next/link";
import prisma from "@/lib/prisma";
import CollegeCard from "@/components/CollegeCard";
import LandingHero from "@/components/LandingHero";
import LandingStats from "@/components/LandingStats";
import LandingFeatures from "@/components/LandingFeatures";
import {
  FeesBarChart,
  PlacementsBarChart,
  TypePieChart,
  DistrictBarChart,
  RatingLineChart,
} from "@/components/Charts";
import { ArrowRight, BarChart3, Star, Quote, ArrowUpRight } from "lucide-react";

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

  // Calculate metrics for stats graphs
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

  const govtPrivateMap: Record<string, number> = {};
  allColleges.forEach((c) => {
    const groupName = c.type.includes("Gov") ? "Govt / Aided" : "Private";
    govtPrivateMap[groupName] = (govtPrivateMap[groupName] || 0) + 1;
  });
  const typePieData = Object.keys(govtPrivateMap).map((name) => ({
    name,
    value: govtPrivateMap[name],
  }));

  const districtMap: Record<string, number> = {};
  allColleges.forEach((c) => {
    districtMap[c.district] = (districtMap[c.district] || 0) + 1;
  });
  const districtData = Object.keys(districtMap).map((district) => ({
    district,
    count: districtMap[district],
  }));

  const placementsData = allColleges
    .slice(0, 5)
    .map((c) => ({
      name: c.name.split(",")[0].replace("Government ", "Govt "),
      placementPercentage: c.placementPercentage,
      averagePackage: c.averagePackage,
    }));

  const ratingsData = allColleges
    .slice(0, 6)
    .map((c) => ({
      name: c.name.split(",")[0].replace("Government ", "Govt "),
      rating: c.rating,
    }));

  return (
    <div className="space-y-20 pb-20">
      
      {/* 1. Interactive Animated Hero Banner */}
      <LandingHero />

      {/* 2. Platform Statistics Summary Cards */}
      <LandingStats stats={{ collegesCount: allColleges.length }} />

      {/* 3. Core SaaS Capabilities Section */}
      <LandingFeatures />

      {/* 4. Featured Colleges Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
        <div className="flex flex-col sm:flex-row justify-between sm:items-end gap-4 border-b border-slate-200/80 dark:border-slate-900 pb-5">
          <div className="space-y-2 text-center sm:text-left">
            <h2 className="text-2xl font-black text-slate-850 dark:text-white">Featured Top Campuses</h2>
            <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">Explore high-ranking institutions based on academic records, locations, and facilities.</p>
          </div>
          <Link
            href="/colleges"
            className="self-center sm:self-end inline-flex items-center text-xs font-bold text-primary hover:text-primary-hover tracking-wider uppercase"
          >
            Browse all colleges
            <ArrowRight className="w-4 h-4 ml-1.5" />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {colleges.map((c) => (
            <CollegeCard
              key={c.id}
              id={c.id}
              name={c.name}
              image={c.image}
              rating={c.rating}
              fees={c.fees}
              placementPercentage={c.placementPercentage}
              aiScore={c.aiScore}
              district={c.district}
              type={c.type}
            />
          ))}
        </div>
      </section>

      {/* 5. Platform Data Analytics Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        <div className="text-center space-y-2 max-w-2xl mx-auto">
          <div className="inline-flex items-center space-x-2 bg-primary/10 border border-primary/20 px-3 py-1 rounded-full text-[10px] font-bold text-primary tracking-wider uppercase">
            <BarChart3 className="w-3.5 h-3.5" />
            <span>Interactive Insights</span>
          </div>
          <h2 className="text-2xl font-black text-slate-850 dark:text-white">Data-Driven Campus Insights</h2>
          <p className="text-sm text-slate-500 dark:text-slate-400 font-medium">
            Analyze distributions across engineering branches, locations, types, and fee caps to make informed choices.
          </p>
        </div>

        {/* Charts Grids */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          
          {/* Average Annual Fees */}
          <div className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-850 p-6 rounded-2xl shadow-sm transition-colors">
            <h3 className="text-sm font-bold text-slate-800 dark:text-slate-200 mb-6 uppercase tracking-wider">Average Annual Fees (INR)</h3>
            <FeesBarChart data={avgFeesData} />
          </div>

          {/* Placement and Salary */}
          <div className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-850 p-6 rounded-2xl shadow-sm transition-colors">
            <h3 className="text-sm font-bold text-slate-800 dark:text-slate-200 mb-6 uppercase tracking-wider">Placements & Salary Packages</h3>
            <PlacementsBarChart data={placementsData} />
          </div>

          {/* District Wise Count */}
          <div className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-850 p-6 rounded-2xl shadow-sm transition-colors">
            <h3 className="text-sm font-bold text-slate-800 dark:text-slate-200 mb-6 uppercase tracking-wider">Colleges by District</h3>
            <DistrictBarChart data={districtData} />
          </div>

          {/* Rating Line */}
          <div className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-850 p-6 rounded-2xl shadow-sm transition-colors">
            <h3 className="text-sm font-bold text-slate-800 dark:text-slate-200 mb-6 uppercase tracking-wider">Top rated academic ratings</h3>
            <RatingLineChart data={ratingsData} />
          </div>

        </div>

        {/* Govt vs Private Counts Card */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-850 p-6 rounded-2xl shadow-sm transition-colors max-w-xl mx-auto">
          <h3 className="text-sm font-bold text-slate-800 dark:text-slate-200 mb-6 uppercase tracking-wider text-center">Institution Type Share</h3>
          <div className="flex justify-center">
            <TypePieChart data={typePieData} />
          </div>
        </div>

      </section>

      {/* 6. Premium Student Reviews Section */}
      <section className="bg-slate-100/40 dark:bg-slate-900/30 border-y border-slate-200/60 dark:border-slate-900 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
          
          <div className="text-center space-y-2 max-w-2xl mx-auto">
            <h2 className="text-2xl font-black text-slate-850 dark:text-white">Student Testimonials</h2>
            <p className="text-sm text-slate-500 dark:text-slate-400 font-medium">Read about the firsthand campus experiences of engineering students across Kerala.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            
            {/* Testimonial 1 */}
            <div className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-850 p-6 rounded-2xl shadow-sm transition-colors space-y-5">
              <Quote className="w-8 h-8 text-primary/25" />
              <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed font-medium">
                "Finding hostel accommodations and evaluating cutoff ranks was extremely stressful. College Discovery gave me accurate placement information and the exact predicted safe colleges in Thrissur."
              </p>
              <div className="flex items-center space-x-3 pt-2">
                <div className="w-8 h-8 rounded-lg bg-primary/10 text-primary flex items-center justify-center font-bold text-xs uppercase">AM</div>
                <div>
                  <p className="text-xs font-bold text-slate-800 dark:text-slate-200">Abhijith M.</p>
                  <p className="text-[10px] text-slate-400">CET Trivandrum, CSE</p>
                </div>
              </div>
            </div>

            {/* Testimonial 2 */}
            <div className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-850 p-6 rounded-2xl shadow-sm transition-colors space-y-5">
              <Quote className="w-8 h-8 text-primary/25" />
              <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed font-medium">
                "The chatbot admissions assistant guided me through all colleges offering robotics and automation. I could filter options matching my exact parent tuition cap instantly."
              </p>
              <div className="flex items-center space-x-3 pt-2">
                <div className="w-8 h-8 rounded-lg bg-accent-green/10 text-accent-green flex items-center justify-center font-bold text-xs uppercase">SR</div>
                <div>
                  <p className="text-xs font-bold text-slate-800 dark:text-slate-200">Sruthi Rajan</p>
                  <p className="text-[10px] text-slate-400">MEC Ernakulam, ECE</p>
                </div>
              </div>
            </div>

            {/* Testimonial 3 */}
            <div className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-850 p-6 rounded-2xl shadow-sm transition-colors space-y-5">
              <Quote className="w-8 h-8 text-primary/25" />
              <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed font-medium">
                "Using the comparison matrix to evaluate placement stats and autonomous certifications side-by-side helped me settle on MACE Kothamangalam. Highly recommend this dashboard!"
              </p>
              <div className="flex items-center space-x-3 pt-2">
                <div className="w-8 h-8 rounded-lg bg-accent-purple/10 text-accent-purple flex items-center justify-center font-bold text-xs uppercase">JK</div>
                <div>
                  <p className="text-xs font-bold text-slate-800 dark:text-slate-200">Jithin Krishnan</p>
                  <p className="text-[10px] text-slate-400">MACE, Mechanical</p>
                </div>
              </div>
            </div>

          </div>

        </div>
      </section>

      {/* 7. Quick FAQs Section */}
      <section className="max-w-4xl mx-auto px-4 py-6 space-y-8">
        <h2 className="text-2xl font-black text-slate-850 dark:text-white text-center">Frequently Asked Questions</h2>
        <div className="space-y-4">
          
          <div className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-850 p-6 rounded-2xl shadow-sm transition-colors">
            <h4 className="font-bold text-slate-850 dark:text-white text-sm">How accurate are the KEAM predictor results?</h4>
            <p className="text-xs text-slate-500 dark:text-slate-405 leading-relaxed mt-2 font-medium">
              Chancing predictions are evaluated against historical allotment trends released by the Commissioner for Entrance Examinations (CEE), Kerala. Actual cutoffs fluctuate based on candidate pool branches and seat counts.
            </p>
          </div>

          <div className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-850 p-6 rounded-2xl shadow-sm transition-colors">
            <h4 className="font-bold text-slate-850 dark:text-white text-sm">Are the reviews moderated?</h4>
            <p className="text-xs text-slate-500 dark:text-slate-405 leading-relaxed mt-2 font-medium">
              Yes. All reviews submitted by students go through administrative moderation checks in the Admin Dashboard before appearing publicly on institutional profile listings.
            </p>
          </div>

        </div>
      </section>

    </div>
  );
}
