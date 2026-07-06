"use client";

import { useEffect, useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import SearchBar from "@/components/SearchBar";
import Filters from "@/components/Filters";
import CollegeCard from "@/components/CollegeCard";
import { ListingSkeleton } from "@/components/SkeletonLoading";
import { HelpCircle, ChevronLeft, ChevronRight, Compass } from "lucide-react";
import toast from "react-hot-toast";

interface FilterState {
  district: string;
  type: string;
  autonomous: string;
  hostel: string;
  transport: string;
  maxFees: string;
  minPlacement: string;
  branch: string;
}

function CollegesContent() {
  const router = useRouter();
  const searchParams = useSearchParams();

  // Load URL queries into initial state
  const [query, setQuery] = useState(searchParams.get("query") || "");
  const [filters, setFilters] = useState<FilterState>({
    district: searchParams.get("district") || "",
    type: searchParams.get("type") || "",
    autonomous: searchParams.get("autonomous") || "",
    hostel: searchParams.get("hostel") || "",
    transport: searchParams.get("transport") || "",
    maxFees: searchParams.get("maxFees") || "",
    minPlacement: searchParams.get("minPlacement") || "",
    branch: searchParams.get("branch") || "",
  });

  const [page, setPage] = useState(parseInt(searchParams.get("page") || "1", 10));
  const [colleges, setColleges] = useState<any[]>([]);
  const [totalPages, setTotalPages] = useState(1);
  const [totalColleges, setTotalColleges] = useState(0);
  const [loading, setLoading] = useState(true);

  // Sync state to URL and fetch
  const fetchColleges = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (query) params.set("query", query);
      if (page > 1) params.set("page", page.toString());

      Object.entries(filters).forEach(([key, val]) => {
        if (val) params.set(key, val);
      });

      // Update URL query parameters silently
      router.replace(`/colleges?${params.toString()}`);

      const res = await fetch(`/api/colleges?${params.toString()}`);
      if (res.ok) {
        const data = await res.json();
        setColleges(data.colleges);
        setTotalPages(data.totalPages);
        setTotalColleges(data.total);
      } else {
        toast.error("Failed to fetch college list");
      }
    } catch (error) {
      toast.error("An error occurred loading list");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchColleges();
  }, [query, filters, page]);

  const handleSearch = (q: string) => {
    setQuery(q);
    setPage(1); // Reset page on new query
  };

  const handleFilterChange = (nextFilters: FilterState) => {
    setFilters(nextFilters);
    setPage(1); // Reset page on filter change
  };

  const handleClearFilters = () => {
    setFilters({
      district: "",
      type: "",
      autonomous: "",
      hostel: "",
      transport: "",
      maxFees: "",
      minPlacement: "",
      branch: "",
    });
    setQuery("");
    setPage(1);
    toast.success("All filters cleared!");
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-10">
      
      {/* Header Description */}
      <div className="space-y-2">
        <h1 className="text-3xl font-extrabold text-slate-850 dark:text-white flex items-center">
          <Compass className="w-7 h-7 mr-2.5 text-primary" />
          Campus Directory
        </h1>
        <p className="text-slate-500 dark:text-slate-400 text-sm">
          Browse through {totalColleges || "Kerala's"} leading engineering institutions. Apply filters to narrow options matching your preferences.
        </p>
      </div>

      {/* Grid: Left Filters vs Right Search & List */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8 items-start">
        
        {/* Left Column: Filters (1 Column) */}
        <div className="lg:col-span-1">
          <Filters
            filters={filters}
            onChange={handleFilterChange}
            onClear={handleClearFilters}
          />
        </div>

        {/* Right Column: Search & Results (3 Columns) */}
        <div className="lg:col-span-3 space-y-6">
          
          {/* Search bar */}
          <SearchBar
            onSearch={handleSearch}
            placeholder="Search colleges by name, branch, type, or city..."
            initialValue={query}
          />

          {/* College Results Deck */}
          {loading ? (
            <ListingSkeleton />
          ) : colleges.length > 0 ? (
            <div className="space-y-10 animate-in fade-in duration-300">
              
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
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

              {/* Premium Pagination */}
              {totalPages > 1 && (
                <div className="flex justify-between items-center border-t border-slate-200/80 dark:border-slate-900 pt-6">
                  <button
                    onClick={() => setPage((p) => Math.max(p - 1, 1))}
                    disabled={page === 1}
                    className="px-4 py-2 border border-slate-200 dark:border-slate-850 bg-white dark:bg-slate-900 rounded-xl text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-350 disabled:opacity-40 hover:bg-slate-50 dark:hover:bg-slate-850 flex items-center transition-colors cursor-pointer select-none"
                  >
                    <ChevronLeft className="w-4 h-4 mr-1.5" />
                    Previous
                  </button>
                  <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">
                    Page {page} of {totalPages}
                  </span>
                  <button
                    onClick={() => setPage((p) => Math.min(p + 1, totalPages))}
                    disabled={page === totalPages}
                    className="px-4 py-2 border border-slate-200 dark:border-slate-850 bg-white dark:bg-slate-900 rounded-xl text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-350 disabled:opacity-40 hover:bg-slate-50 dark:hover:bg-slate-850 flex items-center transition-colors cursor-pointer select-none"
                  >
                    Next
                    <ChevronRight className="w-4 h-4 ml-1.5" />
                  </button>
                </div>
              )}

            </div>
          ) : (
            /* Illustrated Empty State */
            <div className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-900 p-16 rounded-3xl text-center space-y-5 shadow-sm flex flex-col items-center justify-center min-h-[400px]">
              <div className="w-16 h-16 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-400">
                <HelpCircle className="w-8 h-8" />
              </div>
              <div className="space-y-1.5">
                <h3 className="font-extrabold text-lg text-slate-800 dark:text-slate-200">No Colleges Found</h3>
                <p className="text-slate-450 dark:text-slate-400 text-xs max-w-sm mx-auto leading-relaxed font-medium">
                  We couldn't find any institutions matching your search criteria. Try modifying your filters or clearing search text.
                </p>
              </div>
              <button
                onClick={handleClearFilters}
                className="px-5 py-2.5 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-750 text-slate-750 dark:text-slate-300 text-xs font-bold uppercase tracking-wider rounded-xl transition-all cursor-pointer"
              >
                Clear All Filter Params
              </button>
            </div>
          )}

        </div>

      </div>

    </div>
  );
}

export default function CollegesPage() {
  return (
    <Suspense fallback={
      <div className="max-w-7xl mx-auto px-4 py-16">
        <ListingSkeleton />
      </div>
    }>
      <CollegesContent />
    </Suspense>
  );
}
