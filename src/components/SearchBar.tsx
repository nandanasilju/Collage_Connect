"use client";

import { useState, useEffect } from "react";
import { Search } from "lucide-react";

interface SearchBarProps {
  onSearch: (query: string) => void;
  placeholder?: string;
  initialValue?: string;
}

const QUICK_CHIPS = ["Government", "Computer Science", "Ernakulam", "Trivandrum"];

export default function SearchBar({
  onSearch,
  placeholder = "Search colleges by name, city, or district...",
  initialValue = "",
}: SearchBarProps) {
  const [value, setValue] = useState(initialValue);

  // Sync initial value changes
  useEffect(() => {
    setValue(initialValue);
  }, [initialValue]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSearch(value.trim());
  };

  const handleChipClick = (chip: string) => {
    setValue(chip);
    onSearch(chip);
  };

  return (
    <div className="w-full space-y-3.5">
      <form onSubmit={handleSubmit} className="w-full">
        <div className="relative flex items-center">
          <Search className="absolute left-4 w-5 h-5 text-slate-400 pointer-events-none" />
          <input
            type="text"
            value={value}
            onChange={(e) => {
              setValue(e.target.value);
            }}
            placeholder={placeholder}
            className="w-full pl-12 pr-28 py-4 bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-850 rounded-2xl shadow-sm text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all font-semibold text-sm"
          />
          <button
            type="submit"
            className="absolute right-2 px-6 py-2.5 bg-primary hover:bg-primary-hover text-white font-bold text-xs uppercase tracking-wider rounded-xl transition-colors cursor-pointer active:scale-95"
          >
            Search
          </button>
        </div>
      </form>

      {/* Suggested search tags */}
      <div className="flex items-center space-x-2.5 overflow-x-auto py-1 no-scrollbar">
        <span className="text-[10px] font-extrabold uppercase tracking-widest text-slate-400 whitespace-nowrap">Suggested:</span>
        <div className="flex space-x-2">
          {QUICK_CHIPS.map((chip) => (
            <button
              key={chip}
              onClick={() => handleChipClick(chip)}
              className="px-3 py-1 bg-white hover:bg-slate-100 dark:bg-slate-900 dark:hover:bg-slate-850 border border-slate-200 dark:border-slate-850 rounded-lg text-[10px] font-bold text-slate-550 dark:text-slate-350 transition-colors cursor-pointer select-none"
            >
              {chip}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
