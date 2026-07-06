"use client";

import { useState } from "react";
import { Filter, RotateCcw, X, Map, Shield, DollarSign, Award, Home, Truck, GraduationCap } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

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

interface FiltersProps {
  filters: FilterState;
  onChange: (filters: FilterState) => void;
  onClear: () => void;
}

const DISTRICTS = ["Trivandrum", "Kollam", "Ernakulam", "Thrissur", "Palakkad"];
const TYPES = ["Government", "Government-Aided", "Private"];
const BRANCHES = [
  "Computer Science & Engineering",
  "Electronics & Communication Engineering",
  "Electrical & Electronics Engineering",
  "Mechanical Engineering",
  "Civil Engineering",
  "Chemical Engineering",
];

export default function Filters({ filters, onChange, onClear }: FiltersProps) {
  const [showMobileFilters, setShowMobileFilters] = useState(false);

  const handleSelectChange = (key: keyof FilterState, value: string) => {
    onChange({ ...filters, [key]: value });
  };

  const FilterPanel = () => (
    <div className="space-y-6 text-xs font-semibold">
      {/* Header */}
      <div className="flex justify-between items-center pb-4 border-b border-slate-100 dark:border-slate-850">
        <h3 className="font-extrabold text-sm text-slate-800 dark:text-white flex items-center">
          <Filter className="w-4 h-4 mr-2 text-primary" />
          Filter Settings
        </h3>
        <button
          onClick={onClear}
          className="flex items-center text-[10px] font-bold text-slate-400 hover:text-primary transition-colors cursor-pointer uppercase tracking-wider"
        >
          <RotateCcw className="w-3 h-3 mr-1" />
          Clear All
        </button>
      </div>

      {/* Branch */}
      <div className="space-y-2">
        <label className="text-[10px] font-bold text-slate-450 uppercase tracking-widest flex items-center">
          <GraduationCap className="w-3.5 h-3.5 mr-1.5 text-primary opacity-80" />
          Engineering Branch
        </label>
        <select
          value={filters.branch}
          onChange={(e) => handleSelectChange("branch", e.target.value)}
          className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-850 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary transition-all text-slate-700 dark:text-slate-250 cursor-pointer"
        >
          <option value="">All Branches</option>
          {BRANCHES.map((b) => (
            <option key={b} value={b}>
              {b}
            </option>
          ))}
        </select>
      </div>

      {/* District */}
      <div className="space-y-2">
        <label className="text-[10px] font-bold text-slate-455 uppercase tracking-widest flex items-center">
          <Map className="w-3.5 h-3.5 mr-1.5 text-primary opacity-80" />
          District Location
        </label>
        <select
          value={filters.district}
          onChange={(e) => handleSelectChange("district", e.target.value)}
          className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-850 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary transition-all text-slate-700 dark:text-slate-250 cursor-pointer"
        >
          <option value="">All Districts</option>
          {DISTRICTS.map((d) => (
            <option key={d} value={d}>
              {d}
            </option>
          ))}
        </select>
      </div>

      {/* Fees range */}
      <div className="space-y-2">
        <label className="text-[10px] font-bold text-slate-455 uppercase tracking-widest flex items-center">
          <DollarSign className="w-3.5 h-3.5 mr-1.5 text-primary opacity-80" />
          Max Fees (Annual)
        </label>
        <select
          value={filters.maxFees}
          onChange={(e) => handleSelectChange("maxFees", e.target.value)}
          className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-850 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary transition-all text-slate-700 dark:text-slate-250 cursor-pointer"
        >
          <option value="">Any Fees</option>
          <option value="20000">Under ₹20,000</option>
          <option value="40000">Under ₹40,000</option>
          <option value="80000">Under ₹80,000</option>
          <option value="100000">Under ₹1,00,000</option>
          <option value="150000">Under ₹1,50,000</option>
        </select>
      </div>

      {/* College Type */}
      <div className="space-y-2">
        <label className="text-[10px] font-bold text-slate-455 uppercase tracking-widest flex items-center">
          <Shield className="w-3.5 h-3.5 mr-1.5 text-primary opacity-80" />
          College Type
        </label>
        <select
          value={filters.type}
          onChange={(e) => handleSelectChange("type", e.target.value)}
          className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-855 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary transition-all text-slate-700 dark:text-slate-250 cursor-pointer"
        >
          <option value="">All Types</option>
          {TYPES.map((t) => (
            <option key={t} value={t}>
              {t}
            </option>
          ))}
        </select>
      </div>

      {/* Placements */}
      <div className="space-y-2">
        <label className="text-[10px] font-bold text-slate-455 uppercase tracking-widest flex items-center">
          <Award className="w-3.5 h-3.5 mr-1.5 text-primary opacity-80" />
          Minimum Placements
        </label>
        <select
          value={filters.minPlacement}
          onChange={(e) => handleSelectChange("minPlacement", e.target.value)}
          className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-855 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary transition-all text-slate-700 dark:text-slate-250 cursor-pointer"
        >
          <option value="">Any Placement %</option>
          <option value="80">80% and above</option>
          <option value="85">85% and above</option>
          <option value="90">90% and above</option>
          <option value="95">95% and above</option>
        </select>
      </div>

      {/* Infrastructure features */}
      <div className="space-y-3 pt-2">
        <label className="text-[10px] font-bold text-slate-450 uppercase tracking-widest block mb-1">
          Campus Features
        </label>

        {/* Autonomous */}
        <label className="flex items-center space-x-3 text-xs text-slate-600 dark:text-slate-350 cursor-pointer select-none">
          <input
            type="checkbox"
            checked={filters.autonomous === "true"}
            onChange={(e) =>
              handleSelectChange("autonomous", e.target.checked ? "true" : "")
            }
            className="w-4 h-4 rounded border-slate-250 dark:border-slate-800 text-primary focus:ring-primary"
          />
          <span className="flex items-center">
            <Award className="w-4 h-4 mr-1.5 text-slate-400" /> Autonomous Campus
          </span>
        </label>

        {/* Hostel */}
        <label className="flex items-center space-x-3 text-xs text-slate-600 dark:text-slate-350 cursor-pointer select-none">
          <input
            type="checkbox"
            checked={filters.hostel === "true"}
            onChange={(e) =>
              handleSelectChange("hostel", e.target.checked ? "true" : "")
            }
            className="w-4 h-4 rounded border-slate-250 dark:border-slate-800 text-primary focus:ring-primary"
          />
          <span className="flex items-center">
            <Home className="w-4 h-4 mr-1.5 text-slate-400" /> In-Campus Hostel
          </span>
        </label>

        {/* Transport */}
        <label className="flex items-center space-x-3 text-xs text-slate-600 dark:text-slate-350 cursor-pointer select-none">
          <input
            type="checkbox"
            checked={filters.transport === "true"}
            onChange={(e) =>
              handleSelectChange("transport", e.target.checked ? "true" : "")
            }
            className="w-4 h-4 rounded border-slate-250 dark:border-slate-800 text-primary focus:ring-primary"
          />
          <span className="flex items-center">
            <Truck className="w-4 h-4 mr-1.5 text-slate-400" /> Bus Transportation
          </span>
        </label>
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop Filters (Sidebar) */}
      <div className="hidden lg:block bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-900 rounded-2xl p-6 shadow-sm">
        <FilterPanel />
      </div>

      {/* Mobile Filters Trigger */}
      <div className="lg:hidden w-full flex justify-end">
        <button
          onClick={() => setShowMobileFilters(true)}
          className="flex items-center px-4 py-2 border border-slate-200 dark:border-slate-850 bg-white dark:bg-slate-900 hover:bg-slate-50 dark:hover:bg-slate-850 rounded-xl text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 transition-colors"
        >
          <Filter className="w-4 h-4 mr-2 text-primary" />
          Filter Settings
        </button>
      </div>

      {/* Mobile Filters Drawer Overlay */}
      <AnimatePresence>
        {showMobileFilters && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowMobileFilters(false)}
              className="fixed inset-0 z-40 bg-black/30 backdrop-blur-sm lg:hidden"
            />

            {/* Drawer */}
            <motion.div
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", bounce: 0, duration: 0.3 }}
              className="fixed right-0 top-0 bottom-0 z-50 w-72 bg-white dark:bg-slate-950 border-l border-slate-200 dark:border-slate-900 shadow-2xl p-6 flex flex-col justify-between lg:hidden"
            >
              <div className="flex-grow overflow-y-auto">
                <div className="flex justify-end pb-4 border-b border-slate-100 dark:border-slate-900 mb-6">
                  <button
                    onClick={() => setShowMobileFilters(false)}
                    className="p-1 rounded-lg border border-slate-200 dark:border-slate-850 text-slate-400 hover:text-slate-650 hover:bg-slate-50 dark:hover:bg-slate-900"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>
                <FilterPanel />
              </div>
              <button
                onClick={() => setShowMobileFilters(false)}
                className="mt-6 w-full py-2.5 bg-primary hover:bg-primary-hover text-white text-xs font-bold uppercase tracking-widest rounded-xl transition-colors cursor-pointer"
              >
                Apply Filters
              </button>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
