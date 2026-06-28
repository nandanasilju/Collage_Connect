"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import CollegeCard from "@/components/CollegeCard";
import { DashboardSkeleton } from "@/components/SkeletonLoading";
import {
  Bookmark,
  MessageSquare,
  History,
  Sparkles,
  User,
  Settings,
  Trash2,
  ExternalLink,
  MapPin,
  ChevronRight,
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
        // 1. Fetch Profile & Stats
        const profileRes = await fetch("/api/profile");
        if (profileRes.ok) {
          const data = await profileRes.json();
          setProfileData(data);
        }

        // 2. Fetch Saved Colleges
        const savedRes = await fetch("/api/saved");
        if (savedRes.ok) {
          const data = await savedRes.json();
          setSavedColleges(data);
        }

        // 3. Fetch History List
        const historyRes = await fetch("/api/history");
        if (historyRes.ok) {
          const data = await historyRes.json();
          setHistoryList(data);
        }
      } catch (err) {
        toast.error("Error loading dashboard data");
      } finally {
        setLoading(false);
      }
    };

    loadDashboardData();
  }, [user, authLoading, router]);

  // Load AI Recommendations in background
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
          console.error("Failed to load AI recommendations:", err);
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
        toast.success("History cleared successfully!");
      } else {
        toast.error("Failed to clear history");
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

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-10">
      
      {/* 1. Header welcome */}
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-extrabold text-slate-850 dark:text-slate-100">
            Welcome, {profile.name}!
          </h1>
          <p className="text-slate-500 dark:text-slate-400 text-sm">
            Here's a look at your saved choices, application odds, and AI advisors.
          </p>
        </div>
        <Link
          href="/profile"
          className="self-start sm:self-center inline-flex items-center px-4 py-2 border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 rounded-xl text-sm font-semibold text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-850 transition-colors"
        >
          <Settings className="w-4 h-4 mr-2" />
          Edit Preferences
        </Link>
      </div>

      {/* 2. Stats Grid Card Section */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        
        {/* Saved Colleges */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-6 rounded-2xl shadow-sm flex items-center space-x-4 transition-colors">
          <div className="p-3 bg-blue-50 dark:bg-blue-950/30 text-blue-500 rounded-xl">
            <Bookmark className="w-6 h-6" />
          </div>
          <div>
            <p className="text-3xl font-black text-slate-800 dark:text-slate-100">{stats.savedCount}</p>
            <p className="text-xs text-slate-400 font-bold uppercase tracking-wider mt-0.5">Saved Colleges</p>
          </div>
        </div>

        {/* Written Reviews */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-6 rounded-2xl shadow-sm flex items-center space-x-4 transition-colors">
          <div className="p-3 bg-indigo-50 dark:bg-indigo-950/30 text-indigo-500 rounded-xl">
            <MessageSquare className="w-6 h-6" />
          </div>
          <div>
            <p className="text-3xl font-black text-slate-800 dark:text-slate-100">{stats.reviewsCount}</p>
            <p className="text-xs text-slate-400 font-bold uppercase tracking-wider mt-0.5">Reviews Submitted</p>
          </div>
        </div>

        {/* Recently Viewed */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-6 rounded-2xl shadow-sm flex items-center space-x-4 transition-colors">
          <div className="p-3 bg-emerald-50 dark:bg-emerald-950/30 text-emerald-500 rounded-xl">
            <History className="w-6 h-6" />
          </div>
          <div>
            <p className="text-3xl font-black text-slate-800 dark:text-slate-100">{stats.historyCount}</p>
            <p className="text-xs text-slate-400 font-bold uppercase tracking-wider mt-0.5">History Items</p>
          </div>
        </div>

      </div>

      {/* 3. AI Recommendation section (Personalised) */}
      <section className="bg-gradient-to-br from-indigo-50 to-blue-50 dark:from-indigo-950/20 dark:to-blue-950/20 border border-indigo-100 dark:border-indigo-900/30 p-6 rounded-3xl space-y-6 shadow-sm">
        
        {/* Recommendation explanation header */}
        <div className="space-y-2">
          <h2 className="text-xl font-bold text-slate-800 dark:text-slate-100 flex items-center">
            <Sparkles className="w-5 h-5 mr-2 text-indigo-500" />
            AI Personalized Recommendations
          </h2>
          {aiLoading ? (
            <div className="h-4 bg-slate-200 dark:bg-slate-800/40 rounded w-1/2 animate-pulse" />
          ) : (
            <p className="text-sm text-slate-600 dark:text-slate-350 leading-relaxed max-w-4xl whitespace-pre-line">
              {aiExplanation}
            </p>
          )}
        </div>

        {/* College matching cards */}
        {aiLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 animate-pulse">
            {Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="bg-white/50 dark:bg-slate-900/50 border h-72 rounded-2xl" />
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

      {/* 4. Subgrid: Saved Colleges vs Recently Viewed History */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Left Side: Saved Colleges (2 columns) */}
        <div className="lg:col-span-2 space-y-6">
          <div className="flex justify-between items-center border-b border-slate-200 dark:border-slate-800 pb-3">
            <h2 className="text-xl font-bold text-slate-850 dark:text-slate-100 flex items-center">
              <Bookmark className="w-5 h-5 mr-2 text-blue-500" />
              Saved Colleges ({savedColleges.length})
            </h2>
            <Link href="/colleges" className="text-xs font-bold text-blue-600 dark:text-blue-400 hover:underline">
              Browse More
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
            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-8 rounded-2xl text-center text-sm text-slate-400 italic">
              Your bookmarks list is empty. Click save on any college card to add them here!
            </div>
          )}
        </div>

        {/* Right Side: Recently Viewed & Preferences (1 column) */}
        <div className="space-y-8">
          
          {/* History */}
          <div className="space-y-4">
            <div className="flex justify-between items-center border-b border-slate-200 dark:border-slate-800 pb-3">
              <h2 className="text-xl font-bold text-slate-850 dark:text-slate-100 flex items-center">
                <History className="w-5 h-5 mr-2 text-emerald-500" />
                Recently Viewed
              </h2>
              {historyList.length > 0 && (
                <button
                  onClick={handleClearHistory}
                  className="text-xs font-bold text-rose-500 hover:underline"
                >
                  Clear History
                </button>
              )}
            </div>

            {historyList.length > 0 ? (
              <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl overflow-hidden divide-y divide-slate-100 dark:divide-slate-800 shadow-sm transition-colors">
                {historyList.map((h) => (
                  <Link
                    key={h.id}
                    href={`/colleges/${h.college.id}`}
                    className="block p-4 hover:bg-slate-50 dark:hover:bg-slate-850 transition-colors"
                  >
                    <div className="flex items-center space-x-3">
                      <div className="w-12 h-12 rounded-lg overflow-hidden flex-shrink-0 shadow-inner">
                        <img src={h.college.image} alt={h.college.name} className="w-full h-full object-cover" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h4 className="font-bold text-sm text-slate-800 dark:text-slate-100 truncate">
                          {h.college.name}
                        </h4>
                        <div className="flex items-center text-[10px] text-slate-400 mt-1 font-semibold">
                          <MapPin className="w-3 h-3 text-blue-500 mr-0.5" />
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
              <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-6 rounded-2xl text-center text-xs text-slate-400 italic">
                No recent views logged yet.
              </div>
            )}
          </div>

          {/* User Preferences Summary */}
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-6 rounded-2xl shadow-sm space-y-4 transition-colors">
            <h3 className="font-bold text-slate-800 dark:text-slate-100 text-sm border-b border-slate-100 dark:border-slate-850 pb-2">
              Matching Preferences
            </h3>
            <div className="space-y-3 text-xs">
              <div>
                <p className="text-slate-450 font-bold uppercase tracking-wide">Target Branch</p>
                <p className="font-bold text-slate-800 dark:text-slate-200 text-sm mt-0.5">
                  {profile.preferredBranch || "Not specified"}
                </p>
              </div>
              <div>
                <p className="text-slate-450 font-bold uppercase tracking-wide">Preferred City/District</p>
                <p className="font-bold text-slate-800 dark:text-slate-200 text-sm mt-0.5">
                  {profile.preferredLocation || "Not specified"}
                </p>
              </div>
              <div>
                <p className="text-slate-450 font-bold uppercase tracking-wide">Max Annual Budget</p>
                <p className="font-bold text-slate-800 dark:text-slate-200 text-sm mt-0.5">
                  {profile.budget ? `₹${profile.budget.toLocaleString()}/year` : "Not specified"}
                </p>
              </div>
            </div>
            <Link
              href="/profile"
              className="w-full py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-350 text-xs font-bold rounded-xl flex items-center justify-center hover:bg-slate-100 dark:hover:bg-slate-750 transition-colors"
            >
              Update Preferences
            </Link>
          </div>

        </div>

      </div>

    </div>
  );
}
