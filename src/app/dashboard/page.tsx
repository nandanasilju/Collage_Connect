"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import CollegeCard from "@/components/CollegeCard";
import { DashboardSkeleton } from "@/components/SkeletonLoading";
import { motion } from "framer-motion";
import {
  Bookmark,
  MessageSquare,
  History,
  Sparkles,
  User,
  Settings,
  Trash2,
  MapPin,
  ChevronRight,
  Info,
  TrendingUp,
} from "lucide-react";
import toast from "react-hot-toast";

export default function UserDashboard() {
  const router = useRouter();
  const { user, loading: authLoading } = useAuth();

  const [profileData, setProfileData] = useState<any>(null);
  const [savedColleges, setSavedColleges] = useState<any[]>([]);
  const [historyList, setHistoryList] = useState<any[]>([]);
  const [recommendations, setRecommendations] = useState<any[]>([]);
  const [aiExplanation, setAiExplanation] = useState("");

  const [loading, setLoading] = useState(true);
  const [aiLoading, setAiLoading] = useState(true);

  useEffect(() => {
    if (authLoading) return;
    if (!user) {
      router.push("/login");
      return;
    }

    const loadDashboardData = async () => {
      try {
        const profileRes = await fetch("/api/profile");
        if (profileRes.ok) {
          const data = await profileRes.json();
          setProfileData(data);
        }

        const savedRes = await fetch("/api/saved");
        if (savedRes.ok) {
          const data = await savedRes.json();
          setSavedColleges(data);
        }

        const historyRes = await fetch("/api/history");
        if (historyRes.ok) {
          const data = await historyRes.json();
          setHistoryList(data);
        }
      } catch (err) {
        toast.error("Error loading dashboard metrics");
      } finally {
        setLoading(false);
      }
    };

    loadDashboardData();
  }, [user, authLoading, router]);

  // Fetch recommendations
  useEffect(() => {
    if (!loading && user) {
      const fetchAIRecommendations = async () => {
        try {
          const res = await fetch("/api/recommend", { method: "POST" });
          if (res.ok) {
            const data = await res.json();
            setRecommendations(data.recommendations);
            setAiExplanation(data.explanation);
          }
        } catch (err) {
          console.error("AI recommendations fetch error:", err);
        } finally {
          setAiLoading(false);
        }
      };

      fetchAIRecommendations();
    }
  }, [loading, user]);

  const handleClearHistory = async () => {
    try {
      const res = await fetch("/api/history", { method: "DELETE" });
      if (res.ok) {
        setHistoryList([]);
        if (profileData) {
          setProfileData((prev: any) => ({
            ...prev,
            stats: { ...prev.stats, historyCount: 0 },
          }));
        }
        toast.success("Recently viewed history cleared!");
      } else {
        toast.error("Failed to clear history logs");
      }
    } catch (error) {
      toast.error("An error occurred");
    }
  };

  const handleUnsaveCollege = (id: string) => {
    setSavedColleges((prev) => prev.filter((item) => item.collegeId !== id));
    if (profileData) {
      setProfileData((prev: any) => ({
        ...prev,
        stats: {
          ...prev.stats,
          savedCount: Math.max(prev.stats.savedCount - 1, 0),
        },
      }));
    }
  };

  if (authLoading || loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-8">
        <DashboardSkeleton />
      </div>
    );
  }

  const { stats, profile } = profileData || {
    stats: { savedCount: 0, reviewsCount: 0, historyCount: 0 },
    profile: {},
  };

  // Evaluate profile completeness score (max 3 points)
  let completenessScore = 0;
  if (profile.preferredBranch) completenessScore += 33.3;
  if (profile.preferredLocation) completenessScore += 33.3;
  if (profile.budget) completenessScore += 33.4;
  const totalCompleteness = Math.round(completenessScore);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-10">
      
      {/* 1. Welcome banner */}
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
        <div className="space-y-1">
          <h1 className="text-3xl font-extrabold text-slate-850 dark:text-white">
            Welcome, {profile.name}!
          </h1>
          <p className="text-slate-500 dark:text-slate-400 text-xs font-semibold uppercase tracking-wider">
            Active Student Dashboard
          </p>
        </div>
        <Link
          href="/profile"
          className="self-start sm:self-center inline-flex items-center px-4 py-2 border border-slate-200 dark:border-slate-850 bg-white dark:bg-slate-900 rounded-xl text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-350 hover:bg-slate-50 dark:hover:bg-slate-850 transition-colors cursor-pointer select-none"
        >
          <Settings className="w-4 h-4 mr-2" />
          Edit Preferences
        </Link>
      </div>

      {/* 2. Top Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        
        {/* Metric 1 */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-900 p-6 rounded-2xl shadow-sm flex items-center space-x-4">
          <div className="p-3 bg-primary/10 text-primary border border-primary/20 rounded-xl">
            <Bookmark className="w-5.5 h-5.5" />
          </div>
          <div>
            <p className="text-2xl font-black text-slate-850 dark:text-white leading-none">{stats.savedCount}</p>
            <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider mt-1.5">Saved Colleges</p>
          </div>
        </div>

        {/* Metric 2 */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-900 p-6 rounded-2xl shadow-sm flex items-center space-x-4">
          <div className="p-3 bg-accent-purple/10 text-accent-purple border border-accent-purple/20 rounded-xl">
            <MessageSquare className="w-5.5 h-5.5" />
          </div>
          <div>
            <p className="text-2xl font-black text-slate-850 dark:text-white leading-none">{stats.reviewsCount}</p>
            <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider mt-1.5">Written Reviews</p>
          </div>
        </div>

        {/* Metric 3 */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-900 p-6 rounded-2xl shadow-sm flex items-center space-x-4">
          <div className="p-3 bg-accent-green/10 text-accent-green border border-accent-green/20 rounded-xl">
            <History className="w-5.5 h-5.5" />
          </div>
          <div>
            <p className="text-2xl font-black text-slate-850 dark:text-white leading-none">{stats.historyCount}</p>
            <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider mt-1.5">View History</p>
          </div>
        </div>

        {/* Profile completeness card */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-900 p-5 rounded-2xl shadow-sm flex flex-col justify-between space-y-2">
          <div className="flex justify-between items-center text-[10px] font-bold text-slate-400 uppercase tracking-wider">
            <span>AI Preference Fit</span>
            <span className="text-primary font-black">{totalCompleteness}%</span>
          </div>
          <div className="w-full h-2 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
            <div className="h-full bg-primary rounded-full transition-all duration-500" style={{ width: `${totalCompleteness}%` }} />
          </div>
          <p className="text-[9px] font-medium text-slate-400">
            {totalCompleteness < 100
              ? "Complete preferred branch and location settings to optimize matching."
              : "Preferences fully configured. Optimal AI recommendations active."}
          </p>
        </div>

      </div>

      {/* 3. AI Personalized Recommendations Banners */}
      <section className="bg-gradient-to-br from-indigo-50 to-blue-50 dark:from-indigo-950/20 dark:to-blue-950/20 border border-indigo-100 dark:border-indigo-900/30 p-6 rounded-3xl space-y-6 shadow-sm">
        <div className="space-y-2">
          <h2 className="text-lg font-bold text-slate-800 dark:text-white flex items-center uppercase tracking-wider">
            <Sparkles className="w-5 h-5 mr-2 text-accent-purple animate-pulse" />
            AI Recommended Campuses
          </h2>
          {aiLoading ? (
            <div className="h-4 bg-slate-200 dark:bg-slate-800/40 rounded w-1/2 animate-pulse" />
          ) : (
            <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed font-semibold max-w-4xl whitespace-pre-line">
              {aiExplanation}
            </p>
          )}
        </div>

        {aiLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="bg-white/50 dark:bg-slate-900/50 border h-72 rounded-2xl animate-pulse" />
            ))}
          </div>
        ) : (
          recommendations.length > 0 && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {recommendations.map((c) => (
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
          )
        )}
      </section>

      {/* 4. Sub Grid: Saved list vs Viewed list */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Saved List (2 columns) */}
        <div className="lg:col-span-2 space-y-6">
          <div className="flex justify-between items-center border-b border-slate-205 dark:border-slate-850 pb-3">
            <h2 className="text-sm font-bold text-slate-800 dark:text-white uppercase tracking-wider flex items-center">
              <Bookmark className="w-4.5 h-4.5 mr-2 text-primary" />
              Bookmarked Campuses ({savedColleges.length})
            </h2>
            <Link href="/colleges" className="text-[10px] font-bold text-primary uppercase tracking-widest hover:underline">
              Explore More
            </Link>
          </div>

          {savedColleges.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              {savedColleges.map((s) => (
                <CollegeCard
                  key={s.id}
                  id={s.college.id}
                  name={s.college.name}
                  image={s.college.image}
                  rating={s.college.rating}
                  fees={s.college.fees}
                  placementPercentage={s.college.placementPercentage}
                  aiScore={s.college.aiScore}
                  district={s.college.district}
                  type={s.college.type}
                  isSavedInit={true}
                  onRemoveFromSaved={handleUnsaveCollege}
                />
              ))}
            </div>
          ) : (
            <div className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-900 p-8 rounded-2xl text-center text-xs text-slate-400 italic">
              Your bookmarks tray is empty. Add colleges from cards to view matches.
            </div>
          )}
        </div>

        {/* Right Side: History logs & Preferences (1 column) */}
        <div className="space-y-8">
          
          {/* History */}
          <div className="space-y-4">
            <div className="flex justify-between items-center border-b border-slate-205 dark:border-slate-850 pb-3">
              <h2 className="text-sm font-bold text-slate-800 dark:text-white uppercase tracking-wider flex items-center">
                <History className="w-4.5 h-4.5 mr-2 text-accent-green" />
                Recently Visited
              </h2>
              {historyList.length > 0 && (
                <button
                  onClick={handleClearHistory}
                  className="text-[10px] font-bold text-accent-red uppercase tracking-wider hover:underline cursor-pointer"
                >
                  Clear logs
                </button>
              )}
            </div>

            {historyList.length > 0 ? (
              <div className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-900 rounded-2xl overflow-hidden divide-y divide-slate-100 dark:divide-slate-850 shadow-sm transition-colors duration-350">
                {historyList.map((h) => (
                  <Link
                    key={h.id}
                    href={`/colleges/${h.college.id}`}
                    className="block p-4 hover:bg-slate-50 dark:hover:bg-slate-850 transition-colors"
                  >
                    <div className="flex items-center space-x-3.5">
                      <div className="w-10 h-10 rounded-lg overflow-hidden flex-shrink-0 shadow-inner">
                        <img src={h.college.image} alt={h.college.name} className="w-full h-full object-cover" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h4 className="font-bold text-xs text-slate-800 dark:text-white truncate">
                          {h.college.name}
                        </h4>
                        <div className="flex items-center text-[9px] text-slate-400 mt-1 font-semibold">
                          <MapPin className="w-3 h-3 text-primary mr-0.5" />
                          <span>{h.college.district}</span>
                          <span className="mx-1.5">•</span>
                          <span>{new Date(h.viewedAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                        </div>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            ) : (
              <div className="bg-white dark:bg-slate-900 border border-slate-205 dark:border-slate-900 p-6 rounded-2xl text-center text-xs text-slate-400 italic">
                No recent page visits recorded.
              </div>
            )}
          </div>

          {/* Preferences */}
          <div className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-900 p-6 rounded-2xl shadow-sm space-y-4 transition-colors">
            <h3 className="font-bold text-slate-800 dark:text-white text-xs uppercase tracking-wider border-b border-slate-100 dark:border-slate-850 pb-2">
              Discovery Scope
            </h3>
            <div className="space-y-4.5 text-xs font-semibold">
              <div>
                <p className="text-slate-450 uppercase tracking-widest text-[9px]">Target Branch</p>
                <p className="font-bold text-slate-850 dark:text-slate-200 mt-0.5">
                  {profile.preferredBranch || "Any branch"}
                </p>
              </div>
              <div>
                <p className="text-slate-455 uppercase tracking-widest text-[9px]">Preferred District</p>
                <p className="font-bold text-slate-850 dark:text-slate-200 mt-0.5">
                  {profile.preferredLocation || "Any district"}
                </p>
              </div>
              <div>
                <p className="text-slate-455 uppercase tracking-widest text-[9px]">Tuition Budget Limit</p>
                <p className="font-bold text-slate-850 dark:text-slate-200 mt-0.5">
                  {profile.budget ? `₹${profile.budget.toLocaleString()} / year` : "Not restricted"}
                </p>
              </div>
            </div>
            <Link
              href="/profile"
              className="w-full py-2 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-850 text-slate-700 dark:text-slate-350 text-[10px] font-bold uppercase tracking-wider rounded-xl flex items-center justify-center hover:bg-slate-100 dark:hover:bg-slate-850 transition-colors"
            >
              Update Preferences
            </Link>
          </div>

        </div>

      </div>

    </div>
  );
}
