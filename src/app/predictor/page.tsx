"use client";

import { useState } from "react";
import { BarChart3, HelpCircle, Sparkles, Loader2, Award, ShieldAlert, CheckCircle2 } from "lucide-react";
import Link from "next/link";
import toast from "react-hot-toast";

const DISTRICTS = ["Trivandrum", "Kollam", "Ernakulam", "Thrissur", "Palakkad"];
const CATEGORIES = ["General", "OBC", "SC", "ST"];
const BRANCHES = [
  "Computer Science & Engineering",
  "Electronics & Communication Engineering",
  "Electrical & Electronics Engineering",
  "Mechanical Engineering",
  "Civil Engineering",
  "Chemical Engineering",
];

export default function PredictorPage() {
  const [rank, setRank] = useState("");
  const [category, setCategory] = useState("General");
  const [gender, setGender] = useState("Male");
  const [budget, setBudget] = useState("150000");
  const [district, setDistrict] = useState("");
  const [branch, setBranch] = useState("Computer Science & Engineering");

  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState<any>(null);

  const handlePredict = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!rank || isNaN(parseInt(rank, 10))) {
      toast.error("Please enter a valid numeric KEAM Rank");
      return;
    }

    setLoading(true);
    setResults(null);

    try {
      const res = await fetch("/api/predict", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          rank: parseInt(rank, 10),
          category,
          gender,
          budget: parseFloat(budget),
          district,
          branch,
        }),
      });

      if (res.ok) {
        const data = await res.json();
        setResults(data);
        toast.success("Prediction generated successfully!");
      } else {
        toast.error("Failed to calculate predictions");
      }
    } catch (err) {
      toast.error("An error occurred");
    } finally {
      setLoading(false);
    }
  };

  const ResultColumn = ({ title, colleges, badgeColor, description }: { title: string; colleges: any[]; badgeColor: string; description: string }) => (
    <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-6 rounded-2xl space-y-4 shadow-sm transition-colors">
      <div className="flex justify-between items-center pb-2 border-b border-slate-100 dark:border-slate-800">
        <h3 className="font-bold text-slate-850 dark:text-slate-150 text-lg flex items-center">
          <span className={`w-3 h-3 rounded-full mr-2 ${badgeColor}`} />
          {title} ({colleges.length})
        </h3>
      </div>
      <p className="text-xs text-slate-400 font-medium">{description}</p>
      
      {colleges.length > 0 ? (
        <div className="space-y-3 pt-2">
          {colleges.map((c) => (
            <Link
              key={c.id}
              href={`/colleges/${c.id}`}
              className="block bg-slate-50 dark:bg-slate-800/40 p-4 rounded-xl border border-slate-150 dark:border-slate-800 hover:border-blue-400 dark:hover:border-blue-500 transition-colors"
            >
              <div className="flex justify-between items-start gap-2">
                <div className="space-y-1">
                  <h4 className="font-bold text-sm text-slate-800 dark:text-slate-200 line-clamp-1">{c.name}</h4>
                  <p className="text-[10px] text-slate-400 font-medium">{c.district} • Fees: ₹{c.fees.toLocaleString()}/yr</p>
                </div>
                <div className="text-right flex-shrink-0">
                  <p className="text-[10px] font-bold text-slate-400 uppercase leading-none">Est. Cutoff</p>
                  <p className="text-xs font-black text-slate-700 dark:text-slate-350 mt-1">#{c.estimatedCutoff.toLocaleString()}</p>
                </div>
              </div>
            </Link>
          ))}
        </div>
      ) : (
        <p className="text-xs text-slate-400 italic text-center py-6">No colleges in this category for these parameters</p>
      )}
    </div>
  );

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-10">
      
      {/* Header */}
      <div className="space-y-2">
        <h1 className="text-3xl font-extrabold text-slate-850 dark:text-slate-100 flex items-center">
          <BarChart3 className="w-7 h-7 mr-2.5 text-blue-500" />
          KEAM Admission Predictor
        </h1>
        <p className="text-slate-500 dark:text-slate-400 text-sm">
          Enter your entrance rank and preference configuration to evaluate your odds for top engineering schools.
        </p>
      </div>

      {/* Grid: Form Inputs vs Prediction Output */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
        
        {/* Left column: Input Form (1 Column) */}
        <div className="lg:col-span-1 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-6 rounded-2xl shadow-sm space-y-4 transition-colors">
          <h3 className="font-bold text-slate-800 dark:text-slate-100 text-sm border-b border-slate-150 dark:border-slate-800 pb-2">
            Entrance Parameters
          </h3>

          <form onSubmit={handlePredict} className="space-y-4">
            
            {/* Rank */}
            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">KEAM State Rank</label>
              <input
                type="text"
                value={rank}
                onChange={(e) => setRank(e.target.value.replace(/\D/g, ""))}
                placeholder="e.g. 2500"
                className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 text-slate-900 dark:text-slate-150 placeholder-slate-400 transition-all font-semibold"
              />
            </div>

            {/* Branch */}
            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">Preferred Branch</label>
              <select
                value={branch}
                onChange={(e) => setBranch(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 text-slate-700 dark:text-slate-250 transition-all font-semibold"
              >
                {BRANCHES.map((b) => (
                  <option key={b} value={b}>
                    {b}
                  </option>
                ))}
              </select>
            </div>

            {/* Category */}
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">Category</label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 text-slate-700 dark:text-slate-250 transition-all font-semibold"
                >
                  {CATEGORIES.map((cat) => (
                    <option key={cat} value={cat}>
                      {cat}
                    </option>
                  ))}
                </select>
              </div>

              {/* Gender */}
              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">Gender</label>
                <select
                  value={gender}
                  onChange={(e) => setGender(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 text-slate-700 dark:text-slate-250 transition-all font-semibold"
                >
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                </select>
              </div>
            </div>

            {/* Budget */}
            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">Max Annual Fees</label>
              <select
                value={budget}
                onChange={(e) => setBudget(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 text-slate-700 dark:text-slate-250 transition-all font-semibold"
              >
                <option value="40000">Under ₹40,000 (Govt/Aided)</option>
                <option value="90000">Under ₹90,000 (Self-financing)</option>
                <option value="150000">Under ₹1,50,000 (All Options)</option>
                <option value="300000">Any budget</option>
              </select>
            </div>

            {/* District */}
            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">Preferred District</label>
              <select
                value={district}
                onChange={(e) => setDistrict(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 text-slate-700 dark:text-slate-250 transition-all font-semibold"
              >
                <option value="">Any District</option>
                {DISTRICTS.map((d) => (
                  <option key={d} value={d}>
                    {d}
                  </option>
                ))}
              </select>
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white font-bold rounded-xl shadow-md shadow-blue-500/10 active:scale-95 transition-all flex items-center justify-center pt-2"
            >
              {loading ? (
                <>
                  <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                  Analyzing cutoffs...
                </>
              ) : (
                "Predict Chances"
              )}
            </button>

          </form>
        </div>

        {/* Right Columns: Result Columns (2 Columns) */}
        <div className="lg:col-span-2 space-y-8">
          
          {results ? (
            <div className="space-y-8 animate-in fade-in duration-300">
              
              {/* Strategic Advice */}
              <div className="bg-gradient-to-br from-indigo-50 to-blue-50 dark:from-indigo-950/20 dark:to-blue-950/20 border border-indigo-100 dark:border-indigo-900/30 p-6 rounded-2xl space-y-3 shadow-inner">
                <h3 className="font-bold text-slate-800 dark:text-slate-100 flex items-center text-sm">
                  <Sparkles className="w-5 h-5 mr-2 text-indigo-500" />
                  AI Admission Strategy Analysis
                </h3>
                <p className="text-sm text-slate-650 dark:text-slate-350 leading-relaxed whitespace-pre-line">
                  {results.explanation}
                </p>
              </div>

              {/* Three Lists */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                
                {/* Dream Colleges */}
                <ResultColumn
                  title="Dream"
                  colleges={results.results.dream}
                  badgeColor="bg-amber-400"
                  description="Closing ranks are slightly below your rank. Admission is highly competitive but possible through trial rounds."
                />

                {/* Moderate Colleges */}
                <ResultColumn
                  title="Target"
                  colleges={results.results.moderate}
                  badgeColor="bg-blue-500"
                  description="Your rank matches closing ranges. Great chance of allotment during primary allotment rounds."
                />

                {/* Safe Colleges */}
                <ResultColumn
                  title="Safety"
                  colleges={results.results.safe}
                  badgeColor="bg-emerald-500"
                  description="Closing ranks are much higher than your rank. Extremely high likelihood of allocation; perfect backup choices."
                />

              </div>

            </div>
          ) : (
            /* Idle Placeholder */
            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-16 rounded-3xl text-center space-y-4 shadow-sm flex flex-col items-center justify-center min-h-[400px]">
              <HelpCircle className="w-16 h-16 text-slate-300 dark:text-slate-700 animate-pulse" />
              <div className="space-y-1">
                <h3 className="font-extrabold text-lg text-slate-700 dark:text-slate-200">Awaiting Prediction Inputs</h3>
                <p className="text-slate-400 dark:text-slate-400 text-sm max-w-sm">
                  Fill in your entrance rank, reserve parameters, and budget filters on the left and submit to evaluate your possibilities.
                </p>
              </div>
            </div>
          )}

        </div>

      </div>

    </div>
  );
}
