"use client";

import { useState } from "react";
import { Filter, RotateCcw, X, Map, Shield, DollarSign, Award, Home, Truck, GraduationCap } from "lucide-react";

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
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center pb-4 border-b border-slate-100 dark:border-slate-800">
        <h3 className="font-bold text-slate-800 dark:text-slate-100 flex items-center">
          <Filter className="w-4 h-4 mr-2 text-blue-500" />
          Filter Settings
        </h3>
        <button
          onClick={onClear}
          className="flex items-center text-xs font-semibold text-slate-400 hover:text-blue-600 transition-colors"
        >
          <RotateCcw className="w-3.5 h-3.5 mr-1" />
          Reset All
        </button>
      </div>

      {/* Branch */}
      <div className="space-y-2">
        <label className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center">
          <GraduationCap className="w-3.5 h-3.5 mr-1.5 text-blue-500" />
          Engineering Branch
        </label>
        <select
          value={filters.branch}
          onChange={(e) => handleSelectChange("branch", e.target.value)}
          className="w-full px-3 py-2 text-sm border border-slate-200 dark:border-slate-800 rounded-xl bg-white dark:bg-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all text-slate-700 dark:text-slate-200"
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
        <label className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center">
          <Map className="w-3.5 h-3.5 mr-1.5 text-blue-500" />
          District Location
        </label>
        <select
          value={filters.district}
          onChange={(e) => handleSelectChange("district", e.target.value)}
          className="w-full px-3 py-2 text-sm border border-slate-200 dark:border-slate-800 rounded-xl bg-white dark:bg-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all text-slate-700 dark:text-slate-200"
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
        <label className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center">
          <DollarSign className="w-3.5 h-3.5 mr-1.5 text-blue-500" />
          Max Fees (Annual)
        </label>
        <select
          value={filters.maxFees}
          onChange={(e) => handleSelectChange("maxFees", e.target.value)}
          className="w-full px-3 py-2 text-sm border border-slate-200 dark:border-slate-800 rounded-xl bg-white dark:bg-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all text-slate-700 dark:text-slate-200"
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
        <label className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center">
          <Shield className="w-3.5 h-3.5 mr-1.5 text-blue-500" />
          College Type
        </label>
        <select
          value={filters.type}
          onChange={(e) => handleSelectChange("type", e.target.value)}
          className="w-full px-3 py-2 text-sm border border-slate-200 dark:border-slate-800 rounded-xl bg-white dark:bg-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all text-slate-700 dark:text-slate-200"
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
        <label className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center">
          <Award className="w-3.5 h-3.5 mr-1.5 text-blue-500" />
          Minimum Placements
        </label>
        <select
          value={filters.minPlacement}
          onChange={(e) => handleSelectChange("minPlacement", e.target.value)}
          className="w-full px-3 py-2 text-sm border border-slate-200 dark:border-slate-800 rounded-xl bg-white dark:bg-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all text-slate-700 dark:text-slate-200"
        >
          <option value="">Any Placement %</option>
          <option value="80">80% and above</option>
          <option value="85">85% and above</option>
          <option value="90">90% and above</option>
          <option value="95">95% and above</option>
        </select>
      </div>

      {/* Features (Autonomous, Hostel, Transport) */}
      <div className="space-y-3 pt-2">
        <label className="text-xs font-bold text-slate-400 uppercase tracking-wider block mb-1">
          Infrastructure Features
        </label>

        {/* Autonomous */}
        <label className="flex items-center space-x-3 text-sm text-slate-600 dark:text-slate-300 cursor-pointer">
          <input
            type="checkbox"
            checked={filters.autonomous === "true"}
            onChange={(e) =>
              handleSelectChange("autonomous", e.target.checked ? "true" : "")
            }
            className="w-4 h-4 rounded border-slate-300 dark:border-slate-700 text-blue-600 focus:ring-blue-500 focus:ring-2 bg-white dark:bg-slate-900"
          />
          <span className="flex items-center">
            <Award className="w-4 h-4 mr-1 text-slate-400" /> Autonomous College
          </span>
        </label>

        {/* Hostel */}
        <label className="flex items-center space-x-3 text-sm text-slate-600 dark:text-slate-300 cursor-pointer">
          <input
            type="checkbox"
            checked={filters.hostel === "true"}
            onChange={(e) =>
              handleSelectChange("hostel", e.target.checked ? "true" : "")
            }
            className="w-4 h-4 rounded border-slate-300 dark:border-slate-700 text-blue-600 focus:ring-blue-500 focus:ring-2 bg-white dark:bg-slate-900"
          />
          <span className="flex items-center">
            <Home className="w-4 h-4 mr-1 text-slate-400" /> In-Campus Hostel
          </span>
        </label>

        {/* Transport */}
        <label className="flex items-center space-x-3 text-sm text-slate-600 dark:text-slate-300 cursor-pointer">
          <input
            type="checkbox"
            checked={filters.transport === "true"}
            onChange={(e) =>
              handleSelectChange("transport", e.target.checked ? "true" : "")
            }
            className="w-4 h-4 rounded border-slate-300 dark:border-slate-700 text-blue-600 focus:ring-blue-500 focus:ring-2 bg-white dark:bg-slate-900"
          />
          <span className="flex items-center">
            <Truck className="w-4 h-4 mr-1 text-slate-400" /> College Transport
          </span>
        </label>
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop Filters (Sidebar) */}
      <div className="hidden lg:block bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-sm">
        <FilterPanel />
      </div>

      {/* Mobile Filters Toggle Button */}
      <div className="lg:hidden w-full flex justify-end">
        <button
          onClick={() => setShowMobileFilters(true)}
          className="flex items-center px-4 py-2 border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 hover:bg-slate-50 rounded-xl text-sm font-semibold text-slate-700 dark:text-slate-300 transition-colors"
        >
          <Filter className="w-4 h-4 mr-2" />
          Filter Settings
        </button>
      </div>

      {/* Mobile Filter Drawer Overlay */}
      {showMobileFilters && (
        <div className="fixed inset-0 z-50 flex justify-end bg-slate-900/40 backdrop-blur-sm lg:hidden">
          <div className="w-full max-w-xs bg-white dark:bg-slate-950 h-full p-6 shadow-xl overflow-y-auto animate-in slide-in-from-right duration-250 flex flex-col justify-between">
            <div>
              <div className="flex justify-end mb-4">
                <button
                  onClick={() => setShowMobileFilters(false)}
                  className="p-1 rounded-lg border border-slate-200 dark:border-slate-800 text-slate-400 hover:text-slate-600"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
              <FilterPanel />
            </div>
            <button
              onClick={() => setShowMobileFilters(false)}
              className="mt-6 w-full py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl"
            >
              Apply Filters
            </button>
          </div>
        </div>
      )}
    </>
  );
}
