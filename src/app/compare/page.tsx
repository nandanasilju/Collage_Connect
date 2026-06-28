"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Scale, Plus, Trash2, Sparkles, Loader2, Search, ArrowLeft, Star } from "lucide-react";
import toast from "react-hot-toast";

export default function ComparePage() {
  const [compareIds, setCompareIds] = useState<string[]>([]);
  const [allColleges, setAllColleges] = useState<any[]>([]);
  const [comparedColleges, setComparedColleges] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  
  // AI Insights
  const [insights, setInsights] = useState("");
  const [insightsLoading, setInsightsLoading] = useState(false);

  // Search autocomplete state
  const [searchQuery, setSearchQuery] = useState("");
  const [showDropdown, setShowDropdown] = useState(false);

  useEffect(() => {
    // Load IDs from localStorage
    const stored = JSON.parse(localStorage.getItem("compare_ids") || "[]");
    setCompareIds(stored);

    const fetchColleges = async () => {
      try {
        const res = await fetch("/api/colleges?limit=100");
        if (res.ok) {
          const data = await res.json();
          setAllColleges(data.colleges);
        }
      } catch (err) {
        toast.error("Failed to load college list");
      } finally {
        setLoading(false);
      }
    };

    fetchColleges();
  }, []);

  // Filter compared colleges whenever compareIds or allColleges changes
  useEffect(() => {
    if (allColleges.length > 0) {
      const filtered = allColleges.filter((c) => compareIds.includes(c.id));
      setComparedColleges(filtered);
    }
  }, [compareIds, allColleges]);

  // Load AI Insights whenever comparedColleges list changes
  useEffect(() => {
    if (comparedColleges.length > 0) {
      const fetchAIInsights = async () => {
        setInsightsLoading(true);
        setInsights("");
        try {
          const res = await fetch("/api/compare/insights", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ colleges: comparedColleges }),
          });
          if (res.ok) {
            const data = await res.json();
            setInsights(data.insights);
          } else {
            setInsights("Failed to load AI Insights comparison.");
          }
        } catch (err) {
          setInsights("Failed to load AI Insights comparison.");
        } finally {
          setInsightsLoading(false);
        }
      };

      fetchAIInsights();
    } else {
      setInsights("");
    }
  }, [comparedColleges]);

  const handleRemoveCollege = (id: string) => {
    const nextIds = compareIds.filter((cid) => cid !== id);
    setCompareIds(nextIds);
    localStorage.setItem("compare_ids", JSON.stringify(nextIds));
    toast.success("College removed from comparison");
  };

  const handleAddCollege = (id: string) => {
    if (compareIds.includes(id)) {
      toast.error("College already added to comparison!");
      return;
    }
    if (compareIds.length >= 4) {
      toast.error("You can compare a maximum of 4 colleges!");
      return;
    }

    const nextIds = [...compareIds, id];
    setCompareIds(nextIds);
    localStorage.setItem("compare_ids", JSON.stringify(nextIds));
    setSearchQuery("");
    setShowDropdown(false);
    toast.success("College added to comparison!");
  };

  const clearComparison = () => {
    setCompareIds([]);
    localStorage.setItem("compare_ids", "[]");
    toast.success("Comparison cleared");
  };

  // Autocomplete filtered candidates
  const candidates = allColleges.filter(
    (c) =>
      !compareIds.includes(c.id) &&
      c.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-16 flex flex-col items-center justify-center space-y-4">
        <Loader2 className="w-12 h-12 text-blue-500 animate-spin" />
        <p className="font-semibold text-slate-400">Loading comparison details...</p>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
        <div className="space-y-1">
          <Link href="/colleges" className="inline-flex items-center text-xs font-bold text-slate-400 hover:text-blue-500 mb-2">
            <ArrowLeft className="w-3.5 h-3.5 mr-1" /> Back to Directory
          </Link>
          <h1 className="text-3xl font-extrabold text-slate-800 dark:text-slate-100 flex items-center">
            <Scale className="w-7 h-7 mr-2.5 text-blue-500" />
            Compare Colleges
          </h1>
          <p className="text-slate-500 dark:text-slate-400 text-sm">
            Compare tuition rates, placements, ratings, and features for up to 4 engineering colleges side-by-side.
          </p>
        </div>
        {comparedColleges.length > 0 && (
          <button
            onClick={clearComparison}
            className="self-start sm:self-center px-4 py-2 border border-slate-200 dark:border-slate-800 text-xs font-bold text-rose-500 bg-white dark:bg-slate-900 rounded-xl hover:bg-rose-50 dark:hover:bg-rose-950/20 active:scale-95 transition-all"
          >
            Clear Comparison
          </button>
        )}
      </div>

      {/* Selector input drawer (if slots left) */}
      {comparedColleges.length < 4 && (
        <div className="relative max-w-lg">
          <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">
            Add College to Compare ({comparedColleges.length}/4)
          </label>
          <div className="relative flex items-center">
            <Search className="absolute left-3.5 w-5 h-5 text-slate-450" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setShowDropdown(true);
              }}
              onFocus={() => setShowDropdown(true)}
              placeholder="Type college name to add..."
              className="w-full pl-11 pr-4 py-2.5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl shadow-sm text-sm text-slate-900 dark:text-slate-150 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
            />
          </div>

          {/* Autocomplete Dropdown */}
          {showDropdown && searchQuery && (
            <div className="absolute left-0 right-0 mt-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-850 rounded-xl shadow-xl z-20 max-h-60 overflow-y-auto divide-y divide-slate-100 dark:divide-slate-800">
              {candidates.length > 0 ? (
                candidates.map((c) => (
                  <button
                    key={c.id}
                    onClick={() => handleAddCollege(c.id)}
                    className="w-full text-left px-4 py-3 hover:bg-slate-50 dark:hover:bg-slate-800 text-sm font-semibold text-slate-750 dark:text-slate-350 transition-colors flex items-center justify-between"
                  >
                    <span>{c.name}</span>
                    <Plus className="w-4 h-4 text-blue-500" />
                  </button>
                ))
              ) : (
                <div className="px-4 py-3 text-sm text-slate-400 italic">No matching colleges found</div>
              )}
            </div>
          )}
        </div>
      )}

      {/* Grid Comparison Table */}
      {comparedColleges.length > 0 ? (
        <div className="space-y-8">
          
          {/* Side-by-Side Table Grid */}
          <div className="border border-slate-200 dark:border-slate-800 rounded-2xl overflow-hidden shadow-sm bg-white dark:bg-slate-900 overflow-x-auto transition-colors duration-300">
            <table className="w-full min-w-[700px] border-collapse text-sm">
              <thead>
                <tr className="bg-slate-50 dark:bg-slate-850 border-b border-slate-200 dark:border-slate-800">
                  <th className="px-6 py-4 font-bold text-slate-550 dark:text-slate-400 w-1/5">Details</th>
                  {comparedColleges.map((c) => (
                    <th key={c.id} className="px-6 py-4 text-left w-1/5 relative group">
                      <div className="space-y-3">
                        <div className="h-28 rounded-xl overflow-hidden relative shadow-inner">
                          <img src={c.image} alt={c.name} className="w-full h-full object-cover" />
                        </div>
                        <h4 className="font-extrabold text-slate-800 dark:text-slate-100 leading-tight line-clamp-2 min-h-[2.5rem]">
                          {c.name}
                        </h4>
                        <div className="flex justify-between items-center pt-2">
                          <Link href={`/colleges/${c.id}`} className="text-xs font-bold text-blue-600 dark:text-blue-400 hover:underline">
                            View details
                          </Link>
                          <button
                            onClick={() => handleRemoveCollege(c.id)}
                            className="p-1.5 rounded-lg border border-slate-200 dark:border-slate-850 text-slate-400 hover:text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950/20 transition-all"
                            title="Remove college"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                    </th>
                  ))}
                  {/* Empty Slot Fillers */}
                  {Array.from({ length: 4 - comparedColleges.length }).map((_, i) => (
                    <th key={i} className="px-6 py-4 text-center text-slate-350 dark:text-slate-700 bg-slate-50/50 dark:bg-slate-950/10 border-l border-slate-100 dark:border-slate-800/40">
                      <div className="flex flex-col items-center justify-center py-10 space-y-2">
                        <Scale className="w-8 h-8 text-slate-300 dark:text-slate-700" />
                        <p className="text-xs font-bold uppercase tracking-wider text-slate-400">Empty Slot</p>
                      </div>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-150 dark:divide-slate-850 text-slate-700 dark:text-slate-300 font-medium">
                {/* AI Score */}
                <tr className="bg-indigo-50/30 dark:bg-indigo-950/10 font-bold">
                  <td className="px-6 py-4 text-slate-450 flex items-center">
                    <Sparkles className="w-4 h-4 mr-2 text-indigo-500" />
                    AI Platform Score
                  </td>
                  {comparedColleges.map((c) => (
                    <td key={c.id} className="px-6 py-4 text-indigo-600 dark:text-indigo-400 text-lg font-black">
                      {c.aiScore}
                    </td>
                  ))}
                  {Array.from({ length: 4 - comparedColleges.length }).map((_, i) => (
                    <td key={i} className="px-6 py-4 bg-slate-50/20 dark:bg-slate-950/5 border-l border-slate-100 dark:border-slate-800/20" />
                  ))}
                </tr>

                {/* Rating */}
                <tr>
                  <td className="px-6 py-4 text-slate-450">Academic Rating</td>
                  {comparedColleges.map((c) => (
                    <td key={c.id} className="px-6 py-4">
                      <div className="flex items-center space-x-1">
                        <Star className="w-4 h-4 text-amber-500 fill-current" />
                        <span className="font-extrabold text-slate-800 dark:text-slate-100">{c.rating}</span>
                        <span className="text-slate-400 text-xs">/ 5</span>
                      </div>
                    </td>
                  ))}
                  {Array.from({ length: 4 - comparedColleges.length }).map((_, i) => (
                    <td key={i} className="px-6 py-4 bg-slate-50/20 dark:bg-slate-950/5 border-l border-slate-100 dark:border-slate-800/20" />
                  ))}
                </tr>

                {/* Fees */}
                <tr>
                  <td className="px-6 py-4 text-slate-450">Annual Fees</td>
                  {comparedColleges.map((c) => (
                    <td key={c.id} className="px-6 py-4 text-slate-800 dark:text-slate-100 font-extrabold">
                      ₹{c.fees.toLocaleString()}
                    </td>
                  ))}
                  {Array.from({ length: 4 - comparedColleges.length }).map((_, i) => (
                    <td key={i} className="px-6 py-4 bg-slate-50/20 dark:bg-slate-950/5 border-l border-slate-100 dark:border-slate-800/20" />
                  ))}
                </tr>

                {/* Placement % */}
                <tr>
                  <td className="px-6 py-4 text-slate-450">Placement Rate</td>
                  {comparedColleges.map((c) => (
                    <td key={c.id} className="px-6 py-4 font-bold text-emerald-600">
                      {c.placementPercentage}%
                    </td>
                  ))}
                  {Array.from({ length: 4 - comparedColleges.length }).map((_, i) => (
                    <td key={i} className="px-6 py-4 bg-slate-50/20 dark:bg-slate-950/5 border-l border-slate-100 dark:border-slate-800/20" />
                  ))}
                </tr>

                {/* Average Package */}
                <tr>
                  <td className="px-6 py-4 text-slate-450">Average Package</td>
                  {comparedColleges.map((c) => (
                    <td key={c.id} className="px-6 py-4 text-slate-800 dark:text-slate-100">
                      {c.averagePackage} LPA
                    </td>
                  ))}
                  {Array.from({ length: 4 - comparedColleges.length }).map((_, i) => (
                    <td key={i} className="px-6 py-4 bg-slate-50/20 dark:bg-slate-950/5 border-l border-slate-100 dark:border-slate-800/20" />
                  ))}
                </tr>

                {/* Highest Package */}
                <tr>
                  <td className="px-6 py-4 text-slate-450">Highest Package</td>
                  {comparedColleges.map((c) => (
                    <td key={c.id} className="px-6 py-4 text-slate-800 dark:text-slate-100">
                      {c.highestPackage} LPA
                    </td>
                  ))}
                  {Array.from({ length: 4 - comparedColleges.length }).map((_, i) => (
                    <td key={i} className="px-6 py-4 bg-slate-50/20 dark:bg-slate-950/5 border-l border-slate-100 dark:border-slate-800/20" />
                  ))}
                </tr>

                {/* College Type */}
                <tr>
                  <td className="px-6 py-4 text-slate-450">Institution Type</td>
                  {comparedColleges.map((c) => (
                    <td key={c.id} className="px-6 py-4">
                      {c.type}
                    </td>
                  ))}
                  {Array.from({ length: 4 - comparedColleges.length }).map((_, i) => (
                    <td key={i} className="px-6 py-4 bg-slate-50/20 dark:bg-slate-950/5 border-l border-slate-100 dark:border-slate-800/20" />
                  ))}
                </tr>

                {/* Autonomous */}
                <tr>
                  <td className="px-6 py-4 text-slate-450">Autonomous</td>
                  {comparedColleges.map((c) => (
                    <td key={c.id} className="px-6 py-4">
                      {c.autonomous ? "Yes" : "No"}
                    </td>
                  ))}
                  {Array.from({ length: 4 - comparedColleges.length }).map((_, i) => (
                    <td key={i} className="px-6 py-4 bg-slate-50/20 dark:bg-slate-950/5 border-l border-slate-100 dark:border-slate-800/20" />
                  ))}
                </tr>

                {/* Hostel */}
                <tr>
                  <td className="px-6 py-4 text-slate-450">In-Campus Hostel</td>
                  {comparedColleges.map((c) => (
                    <td key={c.id} className="px-6 py-4">
                      {c.hostel ? "Yes" : "No"}
                    </td>
                  ))}
                  {Array.from({ length: 4 - comparedColleges.length }).map((_, i) => (
                    <td key={i} className="px-6 py-4 bg-slate-50/20 dark:bg-slate-950/5 border-l border-slate-100 dark:border-slate-800/20" />
                  ))}
                </tr>

                {/* Transport */}
                <tr>
                  <td className="px-6 py-4 text-slate-450">College Transport</td>
                  {comparedColleges.map((c) => (
                    <td key={c.id} className="px-6 py-4">
                      {c.transport ? "Yes" : "No"}
                    </td>
                  ))}
                  {Array.from({ length: 4 - comparedColleges.length }).map((_, i) => (
                    <td key={i} className="px-6 py-4 bg-slate-50/20 dark:bg-slate-950/5 border-l border-slate-100 dark:border-slate-800/20" />
                  ))}
                </tr>

                {/* District */}
                <tr>
                  <td className="px-6 py-4 text-slate-450">District Location</td>
                  {comparedColleges.map((c) => (
                    <td key={c.id} className="px-6 py-4">
                      {c.district}
                    </td>
                  ))}
                  {Array.from({ length: 4 - comparedColleges.length }).map((_, i) => (
                    <td key={i} className="px-6 py-4 bg-slate-50/20 dark:bg-slate-950/5 border-l border-slate-100 dark:border-slate-800/20" />
                  ))}
                </tr>
              </tbody>
            </table>
          </div>

          {/* AI Insights Comparison Box */}
          <div className="bg-gradient-to-br from-indigo-50 to-blue-50 dark:from-indigo-950/20 dark:to-blue-950/20 border border-indigo-100 dark:border-indigo-900/30 p-6 rounded-2xl space-y-4 shadow-sm">
            <h3 className="font-bold text-slate-800 dark:text-slate-100 flex items-center text-lg">
              <Sparkles className="w-5 h-5 mr-2 text-indigo-500 animate-pulse" />
              AI Comparison Insights
            </h3>
            {insightsLoading ? (
              <div className="flex items-center space-x-2 text-sm text-slate-400">
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>AI is compiling ROI comparisons and placements metrics...</span>
              </div>
            ) : (
              <div className="prose prose-slate dark:prose-invert text-slate-650 dark:text-slate-350 text-sm leading-relaxed whitespace-pre-line">
                {insights}
              </div>
            )}
          </div>

        </div>
      ) : (
        /* Empty Compare Selection */
        <div className="bg-white dark:bg-slate-900 border border-slate-205 dark:border-slate-850 p-12 rounded-2xl text-center space-y-4 shadow-sm flex flex-col items-center">
          <Scale className="w-12 h-12 text-slate-400" />
          <div className="space-y-1">
            <h3 className="font-extrabold text-lg text-slate-850 dark:text-slate-100">Your Comparison is Empty</h3>
            <p className="text-slate-500 dark:text-slate-400 text-sm max-w-sm">
              Use the search bar above or browse our college catalog to select up to four engineering colleges to compare side-by-side.
            </p>
          </div>
          <Link
            href="/colleges"
            className="px-5 py-2 text-sm font-semibold rounded-xl text-white bg-blue-600 hover:bg-blue-700 shadow-md shadow-blue-500/10 active:scale-95 transition-all"
          >
            Browse Colleges
          </Link>
        </div>
      )}
    </div>
  );
}
