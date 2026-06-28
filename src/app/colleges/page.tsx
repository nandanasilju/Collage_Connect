"use client";

import { useEffect, useState, useRef, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import SearchBar from "@/components/SearchBar";
import Filters from "@/components/Filters";
import CollegeCard from "@/components/CollegeCard";
import { ListingSkeleton } from "@/components/SkeletonLoading";
import { LayoutGrid, AlertCircle } from "lucide-react";

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

const initialFilters: FilterState = {
  district: "",
  type: "",
  autonomous: "",
  hostel: "",
  transport: "",
  maxFees: "",
  minPlacement: "",
  branch: "",
};

function CollegesDirectoryContent() {
  const searchParams = useSearchParams();
  const router = useRouter();

  // Search parameters extraction
  const initialSearch = searchParams.get("search") || "";
  const initialBranchParam = searchParams.get("branch") || "";

  // State Management
  const [search, setSearch] = useState(initialSearch);
  const [filters, setFilters] = useState<FilterState>({
    ...initialFilters,
    branch: initialBranchParam || initialFilters.branch,
  });
  const [sortBy, setSortBy] = useState("rating");
  const [sortOrder, setSortOrder] = useState("desc");
  const [page, setPage] = useState(1);
  const [limit] = useState(6);

  const [colleges, setColleges] = useState<any[]>([]);
  const [total, setTotal] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(true);

  // Sync search state from URL query
  useEffect(() => {
    const s = searchParams.get("search") || "";
    setSearch(s);
  }, [searchParams]);

  // Load Colleges on parameter changes
  useEffect(() => {
    const fetchColleges = async () => {
      setLoading(true);
      try {
        const queryParams = new URLSearchParams();
        queryParams.set("page", page.toString());
        queryParams.set("limit", limit.toString());
        queryParams.set("sortBy", sortBy);
        queryParams.set("sortOrder", sortOrder);
        
        if (search) queryParams.set("search", search);
        if (filters.district) queryParams.set("district", filters.district);
        if (filters.type) queryParams.set("type", filters.type);
        if (filters.autonomous) queryParams.set("autonomous", filters.autonomous);
        if (filters.hostel) queryParams.set("hostel", filters.hostel);
        if (filters.transport) queryParams.set("transport", filters.transport);
        if (filters.maxFees) queryParams.set("maxFees", filters.maxFees);
        if (filters.minPlacement) queryParams.set("minPlacement", filters.minPlacement);
        if (filters.branch) queryParams.set("branch", filters.branch);

        const res = await fetch(`/api/colleges?${queryParams.toString()}`);
        if (res.ok) {
          const data = await res.json();
          setColleges(data.colleges);
          setTotal(data.total);
          setTotalPages(data.pages);
        }
      } catch (err) {
        console.error("Failed to load colleges:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchColleges();
  }, [search, filters, sortBy, sortOrder, page, limit]);

  const handleSearch = (query: string) => {
    setSearch(query);
    setPage(1);
    // Update URL query parameter
    const params = new URLSearchParams(window.location.search);
    if (query) {
      params.set("search", query);
    } else {
      params.delete("search");
    }
    router.push(`/colleges?${params.toString()}`);
  };

  const handleFiltersChange = (newFilters: FilterState) => {
    setFilters(newFilters);
    setPage(1);
  };

  const clearFilters = () => {
    setFilters(initialFilters);
    setSearch("");
    setPage(1);
    router.push("/colleges");
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Top Banner Header */}
      <div className="space-y-2">
        <h1 className="text-3xl font-extrabold text-slate-800 dark:text-slate-100 flex items-center">
          <LayoutGrid className="w-7 h-7 mr-2.5 text-blue-500" />
          Engineering Colleges Directory
        </h1>
        <p className="text-slate-500 dark:text-slate-400 text-sm">
          Browse through {total} engineering colleges in Kerala with detailed course intakes and fee breakdowns.
        </p>
      </div>

      {/* Main Grid: Search & Filters Header */}
      <div className="w-full">
        <SearchBar onSearch={handleSearch} initialValue={search} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8 items-start">
        {/* Left Side: Filter Options Sidebar */}
        <div className="lg:col-span-1">
          <Filters filters={filters} onChange={handleFiltersChange} onClear={clearFilters} />
        </div>

        {/* Right Side: Colleges Listing Area */}
        <div className="lg:col-span-3 space-y-6">
          {/* Controls Summary & Sorts */}
          <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 px-5 py-3 rounded-2xl text-sm transition-colors">
            <span className="font-semibold text-slate-500">
              Found {total} {total === 1 ? "college" : "colleges"}
            </span>

            <div className="flex items-center space-x-3">
              <span className="text-slate-450 dark:text-slate-400 font-medium">Sort by:</span>
              <select
                value={sortBy}
                onChange={(e) => {
                  setSortBy(e.target.value);
                  setPage(1);
                }}
                className="px-3 py-1.5 border border-slate-250 dark:border-slate-850 bg-slate-50 dark:bg-slate-800 rounded-xl focus:outline-none focus:ring-1 focus:ring-blue-500 text-slate-700 dark:text-slate-200 text-xs font-semibold"
              >
                <option value="rating">Academic Rating</option>
                <option value="placement">Placement %</option>
                <option value="fees">Fees (Low to High)</option>
                <option value="highestPackage">Highest CTC</option>
                <option value="name">Alphabetical</option>
              </select>

              <select
                value={sortOrder}
                onChange={(e) => {
                  setSortOrder(e.target.value);
                  setPage(1);
                }}
                className="px-3 py-1.5 border border-slate-250 dark:border-slate-850 bg-slate-50 dark:bg-slate-800 rounded-xl focus:outline-none focus:ring-1 focus:ring-blue-500 text-slate-700 dark:text-slate-200 text-xs font-semibold"
              >
                <option value="desc">Descending</option>
                <option value="asc">Ascending</option>
              </select>
            </div>
          </div>

          {/* Cards Panel */}
          {loading ? (
            <ListingSkeleton />
          ) : colleges.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
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
          ) : (
            /* Empty State */
            <div className="bg-white dark:bg-slate-900 border border-slate-205 dark:border-slate-850 p-12 rounded-2xl text-center space-y-4 shadow-sm flex flex-col items-center">
              <AlertCircle className="w-12 h-12 text-slate-400" />
              <div className="space-y-1">
                <h3 className="font-extrabold text-lg text-slate-850 dark:text-slate-100">No Colleges Match Your Filters</h3>
                <p className="text-slate-500 dark:text-slate-400 text-sm max-w-sm">
                  We couldn't find any engineering colleges matching those constraints. Try resetting filters or searching with a different term.
                </p>
              </div>
              <button
                onClick={clearFilters}
                className="px-5 py-2 text-sm font-semibold rounded-xl text-white bg-blue-600 hover:bg-blue-700 shadow-md shadow-blue-500/10 active:scale-95 transition-all"
              >
                Clear All Filters
              </button>
            </div>
          )}

          {/* Pagination Controls */}
          {totalPages > 1 && (
            <div className="flex justify-center items-center space-x-3 pt-6">
              <button
                onClick={() => setPage((p) => Math.max(p - 1, 1))}
                disabled={page === 1}
                className="px-4 py-2 border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-sm rounded-xl text-slate-650 dark:text-slate-350 hover:bg-slate-50 dark:hover:bg-slate-850 disabled:opacity-50 transition-colors"
              >
                Previous
              </button>
              <span className="text-sm font-semibold text-slate-500">
                Page {page} of {totalPages}
              </span>
              <button
                onClick={() => setPage((p) => Math.min(p + 1, totalPages))}
                disabled={page === totalPages}
                className="px-4 py-2 border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-sm rounded-xl text-slate-650 dark:text-slate-350 hover:bg-slate-50 dark:hover:bg-slate-850 disabled:opacity-50 transition-colors"
              >
                Next
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default function CollegesDirectory() {
  return (
    <Suspense fallback={<div className="max-w-7xl mx-auto px-4 py-8"><ListingSkeleton /></div>}>
      <CollegesDirectoryContent />
    </Suspense>
  );
}
