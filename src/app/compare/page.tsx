"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Scale, Plus, Trash2, Sparkles, Loader2, Search, ArrowLeft, Star, IndianRupee, Briefcase, Award } from "lucide-react";
import toast from "react-hot-toast";

export default function ComparePage() {
  const [compareIds, setCompareIds] = useState<string[]>([]);
  const [colleges, setColleges] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // Search autocomplete state
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [searching, setSearching] = useState(false);

  // AI comparison insight state
  const [aiInsight, setAiInsight] = useState("");
  const [aiLoading, setAiLoading] = useState(false);

  useEffect(() => {
    const ids = JSON.parse(localStorage.getItem("compare_ids") || "[]");
    setCompareIds(ids);
  }, []);

  const loadCompareColleges = async (ids: string[]) => {
    if (ids.length === 0) {
      setColleges([]);
      setLoading(false);
      setAiInsight("");
      return;
    }

    setLoading(true);
    try {
      const fetched = [];
      for (const id of ids) {
        const res = await fetch(`/api/colleges/${id}`);
        if (res.ok) {
          const data = await res.json();
          fetched.push(data);
        }
      }
      setColleges(fetched);
      
      // Load AI Insights
      loadAIInsights(fetched);
    } catch (err) {
      toast.error("Failed to load compared colleges");
    } finally {
      setLoading(false);
    }
  };

  const loadAIInsights = async (list: any[]) => {
    if (list.length < 2) {
      setAiInsight("");
      return;
    }
    setAiLoading(true);
    try {
      const res = await fetch("/api/compare/insights", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ collegeIds: list.map((c) => c.id) }),
      });
      if (res.ok) {
        const data = await res.json();
        setAiInsight(data.insight);
      }
    } catch (err) {
      console.error("AI Insight failed:", err);
    } finally {
      setAiLoading(false);
    }
  };

  useEffect(() => {
    if (compareIds.length > 0) {
      loadCompareColleges(compareIds);
    } else {
      setColleges([]);
      setLoading(false);
    }
  }, [compareIds]);

  // Handle autocomplete search
  useEffect(() => {
    if (searchQuery.trim().length < 2) {
      setSearchResults([]);
      return;
    }

    const timer = setTimeout(async () => {
      setSearching(true);
      try {
        const res = await fetch(`/api/colleges?query=${searchQuery}&limit=5`);
        if (res.ok) {
          const data = await res.json();
          // Filter out already added colleges
          setSearchResults(
            data.colleges.filter((c: any) => !compareIds.includes(c.id))
          );
        }
      } catch (err) {
        console.error(err);
      } finally {
        setSearching(false);
      }
    }, 300);

    return () => clearTimeout(timer);
  }, [searchQuery, compareIds]);

  const handleAddCollege = (id: string) => {
    if (compareIds.length >= 4) {
      toast.error("You can compare up to 4 colleges at a time");
      return;
    }
    const nextIds = [...compareIds, id];
    setCompareIds(nextIds);
    localStorage.setItem("compare_ids", JSON.stringify(nextIds));
    setSearchQuery("");
    setSearchResults([]);
    toast.success("College added to comparison tray!");
  };

  const handleRemoveCollege = (id: string) => {
    const nextIds = compareIds.filter((cid) => cid !== id);
    setCompareIds(nextIds);
    localStorage.setItem("compare_ids", JSON.stringify(nextIds));
    toast.success("College removed from comparison");
  };

  const handleClearAll = () => {
    setCompareIds([]);
    localStorage.setItem("compare_ids", "[]");
    setColleges([]);
    setAiInsight("");
    toast.success("Comparison list cleared");
  };

  // Find row highlights leaders
  const lowestFee = colleges.length > 0 ? Math.min(...colleges.map((c) => c.fees)) : 0;
  const highestPlacement = colleges.length > 0 ? Math.max(...colleges.map((c) => c.placementPercentage)) : 0;
  const highestAiScore = colleges.length > 0 ? Math.max(...colleges.map((c) => c.aiScore)) : 0;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-10">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
        <div className="space-y-1">
          <h1 className="text-3xl font-extrabold text-slate-850 dark:text-white flex items-center">
            <Scale className="w-7 h-7 mr-2.5 text-primary" />
            Comparison Matrix
          </h1>
          <p className="text-slate-500 dark:text-slate-400 text-sm">
            Evaluate placement distributions, tuition rates, and AI scores side-by-side.
          </p>
        </div>
        {colleges.length > 0 && (
          <button
            onClick={handleClearAll}
            className="self-start sm:self-center px-4 py-2 border border-slate-205 dark:border-slate-850 bg-white dark:bg-slate-900 rounded-xl text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-350 hover:bg-slate-50 dark:hover:bg-slate-850 transition-colors cursor-pointer select-none"
          >
            Clear Matrix
          </button>
        )}
      </div>

      {/* Grid: Search Autocomplete vs Results Table */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Search addition tray (3 columns) */}
        <div className="lg:col-span-3 bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-900 p-6 rounded-3xl shadow-sm space-y-4">
          <h3 className="font-bold text-slate-855 dark:text-white text-xs uppercase tracking-wider">
            Add to comparison
          </h3>

          <div className="relative text-xs font-semibold">
            <Search className="absolute left-3.5 top-3 w-4 h-4 text-slate-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Type college name..."
              className="w-full pl-9 pr-4 py-2.5 bg-slate-50 dark:bg-slate-850 border border-slate-200 dark:border-slate-800 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary text-slate-800 dark:text-slate-250 font-semibold"
            />

            {/* Autocomplete drawer */}
            {searchResults.length > 0 && (
              <div className="absolute left-0 right-0 mt-2.5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-850 rounded-xl shadow-lg py-1.5 z-20 divide-y divide-slate-100 dark:divide-slate-850 overflow-hidden max-h-56 overflow-y-auto">
                {searchResults.map((c) => (
                  <button
                    key={c.id}
                    onClick={() => handleAddCollege(c.id)}
                    className="w-full text-left px-4 py-2.5 hover:bg-slate-50 dark:hover:bg-slate-850 text-xs font-bold text-slate-800 dark:text-slate-200 flex justify-between items-center"
                  >
                    <span className="truncate pr-2">{c.name}</span>
                    <Plus className="w-3.5 h-3.5 text-primary flex-shrink-0" />
                  </button>
                ))}
              </div>
            )}

            {searchQuery && searchResults.length === 0 && !searching && (
              <div className="absolute left-0 right-0 mt-2 p-3 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-850 rounded-xl text-center text-slate-450 italic text-[11px]">
                No matching results
              </div>
            )}
          </div>

          <p className="text-[10px] text-slate-400 font-bold leading-normal">
            You can add up to four campuses for simultaneous analysis.
          </p>
        </div>

        {/* Comparison grid tables (9 columns) */}
        <div className="lg:col-span-9 space-y-8">
          
          {loading ? (
            <div className="bg-white dark:bg-slate-900 p-16 border rounded-3xl flex flex-col items-center justify-center space-y-4">
              <Loader2 className="w-10 h-10 text-primary animate-spin" />
              <p className="font-semibold text-slate-450 text-xs">Compiling comparison parameters...</p>
            </div>
          ) : colleges.length > 0 ? (
            <div className="space-y-8 animate-in fade-in duration-300">
              
              {/* AI comparison insights block */}
              {colleges.length >= 2 && (
                <div className="bg-gradient-to-br from-indigo-50 to-blue-50 dark:from-indigo-950/20 dark:to-blue-950/20 border border-indigo-100 dark:border-indigo-900/30 p-6 rounded-3xl space-y-3 shadow-sm">
                  <h3 className="font-extrabold text-slate-800 dark:text-white flex items-center text-xs uppercase tracking-wider">
                    <Sparkles className="w-5 h-5 mr-2 text-accent-purple animate-pulse" />
                    AI Side-by-Side Comparison Analysis
                  </h3>
                  {aiLoading ? (
                    <div className="space-y-2 animate-pulse pt-2">
                      <div className="h-4 bg-slate-200 dark:bg-slate-850 rounded w-full" />
                      <div className="h-4 bg-slate-200 dark:bg-slate-850 rounded w-3/4" />
                    </div>
                  ) : (
                    <p className="text-xs text-slate-650 dark:text-slate-350 leading-relaxed whitespace-pre-line font-semibold">
                      {aiInsight}
                    </p>
                  )}
                </div>
              )}

              {/* Table Matrix */}
              <div className="border border-slate-200/80 dark:border-slate-900 rounded-3xl overflow-hidden bg-white dark:bg-slate-900 shadow-sm transition-colors duration-300">
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs font-semibold">
                    
                    {/* Header: Collage Cards */}
                    <thead className="bg-slate-50 dark:bg-slate-850/50 border-b border-slate-250/60 dark:border-slate-855">
                      <tr>
                        <th className="px-6 py-4 w-44 font-bold text-slate-450 uppercase tracking-widest">Parameter</th>
                        {colleges.map((c) => (
                          <th key={c.id} className="px-6 py-4 min-w-[200px] relative">
                            <div className="space-y-2">
                              <h4 className="font-extrabold text-slate-850 dark:text-white text-sm line-clamp-1">{c.name}</h4>
                              <p className="text-[10px] text-slate-400 font-bold">{c.location}, {c.district}</p>
                              
                              {/* Remove action */}
                              <button
                                onClick={() => handleRemoveCollege(c.id)}
                                className="absolute top-2 right-2 p-1.5 hover:bg-slate-200 dark:hover:bg-slate-800 text-slate-400 hover:text-accent-red rounded-lg transition-colors cursor-pointer"
                                title="Remove college"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          </th>
                        ))}
                      </tr>
                    </thead>

                    {/* Body Row comparisons */}
                    <tbody className="divide-y divide-slate-150 dark:divide-slate-855 text-slate-750 dark:text-slate-300">
                      
                      {/* Fees */}
                      <tr className="hover:bg-slate-50/50 dark:hover:bg-slate-850/10">
                        <td className="px-6 py-4 font-bold text-slate-500 uppercase tracking-wide">Annual Fees</td>
                        {colleges.map((c) => {
                          const isLeader = c.fees === lowestFee;
                          return (
                            <td key={c.id} className="px-6 py-4">
                              <div className="flex items-center space-x-1.5">
                                <IndianRupee className="w-3.5 h-3.5 text-slate-400" />
                                <span className={`font-extrabold ${isLeader ? "text-accent-green" : ""}`}>
                                  ₹{c.fees.toLocaleString()}
                                </span>
                                {isLeader && (
                                  <span className="text-[9px] font-black text-accent-green uppercase bg-accent-green/10 px-1.5 py-0.5 rounded border border-accent-green/20">Lowest</span>
                                )}
                              </div>
                            </td>
                          );
                        })}
                      </tr>

                      {/* Placement Rate */}
                      <tr className="hover:bg-slate-50/50 dark:hover:bg-slate-850/10">
                        <td className="px-6 py-4 font-bold text-slate-500 uppercase tracking-wide">Placements</td>
                        {colleges.map((c) => {
                          const isLeader = c.placementPercentage === highestPlacement;
                          return (
                            <td key={c.id} className="px-6 py-4">
                              <div className="flex items-center space-x-1.5">
                                <Briefcase className="w-3.5 h-3.5 text-slate-400" />
                                <span className={`font-extrabold ${isLeader ? "text-indigo-600 dark:text-indigo-400" : ""}`}>
                                  {c.placementPercentage}%
                                </span>
                                {isLeader && (
                                  <span className="text-[9px] font-black text-indigo-600 dark:text-indigo-400 uppercase bg-indigo-50 dark:bg-indigo-950/20 px-1.5 py-0.5 rounded border border-indigo-150/40">Highest</span>
                                )}
                              </div>
                            </td>
                          );
                        })}
                      </tr>

                      {/* AI score */}
                      <tr className="hover:bg-slate-50/50 dark:hover:bg-slate-850/10">
                        <td className="px-6 py-4 font-bold text-slate-500 uppercase tracking-wide">AI Fit Score</td>
                        {colleges.map((c) => {
                          const isLeader = c.aiScore === highestAiScore;
                          return (
                            <td key={c.id} className="px-6 py-4">
                              <div className="flex items-center space-x-1.5">
                                <Sparkles className="w-3.5 h-3.5 text-accent-purple" />
                                <span className={`font-extrabold ${isLeader ? "text-accent-purple" : ""}`}>
                                  {c.aiScore} / 100
                                </span>
                                {isLeader && (
                                  <span className="text-[9px] font-black text-accent-purple uppercase bg-accent-purple/10 px-1.5 py-0.5 rounded border border-accent-purple/20">Optimal</span>
                                )}
                              </div>
                            </td>
                          );
                        })}
                      </tr>

                      {/* Ratings */}
                      <tr className="hover:bg-slate-50/50 dark:hover:bg-slate-850/10">
                        <td className="px-6 py-4 font-bold text-slate-500 uppercase tracking-wide">Rating</td>
                        {colleges.map((c) => (
                          <td key={c.id} className="px-6 py-4">
                            <div className="flex items-center space-x-1">
                              <Star className="w-4 h-4 text-accent-yellow fill-current" />
                              <span className="font-extrabold text-slate-800 dark:text-slate-100">{c.rating}</span>
                              <span className="text-slate-400 text-[10px]">/ 5</span>
                            </div>
                          </td>
                        ))}
                      </tr>

                      {/* Infrastructure */}
                      <tr className="hover:bg-slate-50/50 dark:hover:bg-slate-850/10">
                        <td className="px-6 py-4 font-bold text-slate-500 uppercase tracking-wide">Hostel</td>
                        {colleges.map((c) => (
                          <td key={c.id} className="px-6 py-4 font-bold">
                            {c.hostel ? "Yes (In-campus)" : "No"}
                          </td>
                        ))}
                      </tr>

                      <tr className="hover:bg-slate-50/50 dark:hover:bg-slate-850/10">
                        <td className="px-6 py-4 font-bold text-slate-500 uppercase tracking-wide">Transport</td>
                        {colleges.map((c) => (
                          <td key={c.id} className="px-6 py-4 font-bold">
                            {c.transport ? "Yes" : "No"}
                          </td>
                        ))}
                      </tr>

                      {/* Detail navigation redirects */}
                      <tr className="hover:bg-slate-50/50 dark:hover:bg-slate-850/10">
                        <td className="px-6 py-4 font-bold text-slate-500 uppercase tracking-wide">Profile</td>
                        {colleges.map((c) => (
                          <td key={c.id} className="px-6 py-4">
                            <Link
                              href={`/colleges/${c.id}`}
                              className="inline-flex items-center text-[10px] font-extrabold text-primary hover:underline uppercase tracking-wider"
                            >
                              Explore Campus
                              <ArrowLeft className="w-3 h-3 ml-1.5 rotate-180" />
                            </Link>
                          </td>
                        ))}
                      </tr>

                    </tbody>
                  </table>
                </div>
              </div>

            </div>
          ) : (
            /* Idle Placeholder */
            <div className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-900 p-16 rounded-3xl text-center space-y-4 shadow-sm flex flex-col items-center justify-center min-h-[400px]">
              <Scale className="w-16 h-16 text-slate-350 dark:text-slate-750 animate-pulse" />
              <div className="space-y-1.5">
                <h3 className="font-extrabold text-lg text-slate-800 dark:text-slate-200">Comparison Matrix Empty</h3>
                <p className="text-slate-450 dark:text-slate-400 text-xs max-w-sm mx-auto leading-relaxed font-medium">
                  Add engineering colleges from the search on the left side of this panel to compare specifications side-by-side.
                </p>
              </div>
            </div>
          )}

        </div>

      </div>

    </div>
  );
}
