"use client";

import { useState } from "react";
import { BarChart3, HelpCircle, Sparkles, Loader2, Award, ChevronLeft, ChevronRight, RotateCcw } from "lucide-react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
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
  const [step, setStep] = useState(1); // 1: Entrance params, 2: Preferences, 3: Results

  const [rank, setRank] = useState("");
  const [category, setCategory] = useState("General");
  const [gender, setGender] = useState("Male");
  const [budget, setBudget] = useState("150000");
  const [district, setDistrict] = useState("");
  const [branch, setBranch] = useState("Computer Science & Engineering");

  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState<any>(null);

  const handleNextStep = () => {
    if (step === 1) {
      if (!rank || isNaN(parseInt(rank, 10)) || parseInt(rank, 10) <= 0) {
        toast.error("Please enter a valid KEAM entrance rank");
        return;
      }
      setStep(2);
    }
  };

  const handlePredict = async (e: React.FormEvent) => {
    e.preventDefault();

    setLoading(true);
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
        setStep(3);
        toast.success("Admissions odds computed successfully!");
      } else {
        toast.error("Failed to compile predictions");
      }
    } catch (err) {
      toast.error("An error occurred");
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    setRank("");
    setCategory("General");
    setGender("Male");
    setBudget("150000");
    setDistrict("");
    setBranch("Computer Science & Engineering");
    setResults(null);
    setStep(1);
  };

  const ResultColumn = ({ title, colleges, badgeColor, description }: { title: string; colleges: any[]; badgeColor: string; description: string }) => (
    <div className="bg-white dark:bg-slate-900 border border-slate-205 dark:border-slate-850 p-5 rounded-2xl space-y-4 shadow-sm flex flex-col justify-between h-full">
      <div className="space-y-4">
        <div className="flex justify-between items-center pb-2 border-b border-slate-100 dark:border-slate-850">
          <h3 className="font-extrabold text-slate-850 dark:text-white text-sm flex items-center">
            <span className={`w-2.5 h-2.5 rounded-full mr-2 ${badgeColor}`} />
            {title} ({colleges.length})
          </h3>
        </div>
        <p className="text-[10px] text-slate-400 font-bold leading-normal">{description}</p>
        
        {colleges.length > 0 ? (
          <div className="space-y-3 pt-2">
            {colleges.map((c) => (
              <Link
                key={c.id}
                href={`/colleges/${c.id}`}
                className="block bg-slate-50 dark:bg-slate-850/50 p-4 rounded-xl border border-slate-200/50 dark:border-slate-800 hover:border-primary dark:hover:border-primary transition-all"
              >
                <div className="flex justify-between items-start gap-2 text-xs font-semibold">
                  <div className="space-y-1">
                    <h4 className="font-bold text-slate-800 dark:text-white line-clamp-1">{c.name}</h4>
                    <p className="text-[9px] text-slate-400 font-bold">{c.district} • ₹{c.fees.toLocaleString()}/yr</p>
                  </div>
                  <div className="text-right flex-shrink-0">
                    <p className="text-[9px] font-bold text-slate-400 uppercase">Cutoff</p>
                    <p className="font-extrabold text-slate-700 dark:text-slate-300">#{c.estimatedCutoff.toLocaleString()}</p>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        ) : (
          <p className="text-xs text-slate-450 italic text-center py-8">No matching options</p>
        )}
      </div>
    </div>
  );

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-10">
      
      {/* Header */}
      <div className="space-y-2">
        <h1 className="text-3xl font-extrabold text-slate-850 dark:text-white flex items-center">
          <BarChart3 className="w-7 h-7 mr-2.5 text-primary" />
          KEAM Rank Predictor
        </h1>
        <p className="text-slate-500 dark:text-slate-400 text-sm font-medium">
          Leverage historical cutoff closing lists to map your engineering college allocation odds in Kerala.
        </p>
      </div>

      {/* Progress Wizard Steps Header */}
      <div className="max-w-md mx-auto flex items-center justify-between pb-8">
        {[
          { num: 1, label: "Entrance Parameters" },
          { num: 2, label: "Target Preferences" },
          { num: 3, label: "Odds Results" },
        ].map((s, idx) => (
          <div key={s.num} className="flex items-center flex-1 last:flex-none">
            <div className="flex flex-col items-center space-y-1">
              <div
                className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold transition-colors ${
                  step === s.num
                    ? "bg-primary text-white"
                    : step > s.num
                    ? "bg-accent-green text-white"
                    : "bg-slate-200 dark:bg-slate-850 text-slate-400"
                }`}
              >
                {s.num}
              </div>
              <span className="text-[9px] font-bold uppercase tracking-wider text-slate-400">{s.label}</span>
            </div>
            {idx < 2 && (
              <div
                className={`flex-grow h-0.5 mx-4 ${
                  step > s.num ? "bg-accent-green" : "bg-slate-200 dark:bg-slate-850"
                }`}
              />
            )}
          </div>
        ))}
      </div>

      {/* Slide transitions Container */}
      <div className="max-w-3xl mx-auto">
        <AnimatePresence mode="wait">
          {step === 1 && (
            <motion.div
              key="step1"
              initial={{ opacity: 0, x: -15 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 15 }}
              className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-850 p-6 rounded-3xl shadow-sm space-y-6"
            >
              <h3 className="font-bold text-slate-850 dark:text-white text-sm uppercase tracking-wider border-b border-slate-100 dark:border-slate-855 pb-2">
                Entrance parameters
              </h3>

              <div className="space-y-6 text-xs font-semibold">
                
                {/* KEAM Rank */}
                <div className="space-y-2">
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">KEAM State Rank</label>
                  <input
                    type="text"
                    value={rank}
                    onChange={(e) => setRank(e.target.value.replace(/\D/g, ""))}
                    placeholder="e.g. 2500"
                    className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-slate-850 border border-slate-200 dark:border-slate-800 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary text-slate-900 dark:text-white"
                  />
                </div>

                {/* Category & Gender */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Reserve Category</label>
                    <select
                      value={category}
                      onChange={(e) => setCategory(e.target.value)}
                      className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-slate-850 border border-slate-200 dark:border-slate-800 rounded-xl text-slate-700 dark:text-slate-250 cursor-pointer"
                    >
                      {CATEGORIES.map((cat) => (
                        <option key={cat} value={cat}>
                          {cat}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Gender Profile</label>
                    <select
                      value={gender}
                      onChange={(e) => setGender(e.target.value)}
                      className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-slate-850 border border-slate-200 dark:border-slate-800 rounded-xl text-slate-700 dark:text-slate-250 cursor-pointer"
                    >
                      <option value="Male">Male</option>
                      <option value="Female">Female</option>
                    </select>
                  </div>
                </div>

              </div>

              <div className="flex justify-end pt-4 border-t border-slate-100 dark:border-slate-850">
                <button
                  type="button"
                  onClick={handleNextStep}
                  className="px-5 py-2.5 bg-primary hover:bg-primary-hover text-white font-bold text-xs uppercase tracking-widest rounded-xl flex items-center cursor-pointer active:scale-95 transition-all"
                >
                  Continue
                  <ChevronRight className="w-4 h-4 ml-1.5" />
                </button>
              </div>
            </motion.div>
          )}

          {step === 2 && (
            <motion.div
              key="step2"
              initial={{ opacity: 0, x: -15 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 15 }}
              className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-850 p-6 rounded-3xl shadow-sm space-y-6"
            >
              <h3 className="font-bold text-slate-850 dark:text-white text-sm uppercase tracking-wider border-b border-slate-100 dark:border-slate-855 pb-2">
                Target Preferences
              </h3>

              <form onSubmit={handlePredict} className="space-y-6 text-xs font-semibold">
                
                {/* Branch */}
                <div className="space-y-2">
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Engineering Branch</label>
                  <select
                    value={branch}
                    onChange={(e) => setBranch(e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-slate-855 border border-slate-200 dark:border-slate-800 rounded-xl text-slate-700 dark:text-slate-250 cursor-pointer"
                  >
                    {BRANCHES.map((b) => (
                      <option key={b} value={b}>
                        {b}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Budget & Location */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Tuition Budget Limit</label>
                    <select
                      value={budget}
                      onChange={(e) => setBudget(e.target.value)}
                      className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-slate-855 border border-slate-200 dark:border-slate-800 rounded-xl text-slate-700 dark:text-slate-250 cursor-pointer"
                    >
                      <option value="40000">Under ₹40,000 (Govt)</option>
                      <option value="90000">Under ₹90,000 (Self-financing)</option>
                      <option value="150000">Under ₹1,50,000 (All Options)</option>
                      <option value="300000">Any budget</option>
                    </select>
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Preferred District</label>
                    <select
                      value={district}
                      onChange={(e) => setDistrict(e.target.value)}
                      className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-slate-855 border border-slate-200 dark:border-slate-800 rounded-xl text-slate-700 dark:text-slate-250 cursor-pointer"
                    >
                      <option value="">Any District</option>
                      {DISTRICTS.map((d) => (
                        <option key={d} value={d}>
                          {d}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* Wizard actions */}
                <div className="flex justify-between pt-4 border-t border-slate-100 dark:border-slate-850">
                  <button
                    type="button"
                    onClick={() => setStep(1)}
                    className="px-4 py-2.5 border border-slate-200 dark:border-slate-850 rounded-xl text-slate-550 dark:text-slate-350 text-xs font-bold uppercase tracking-wider flex items-center hover:bg-slate-50 dark:hover:bg-slate-850 cursor-pointer"
                  >
                    <ChevronLeft className="w-4 h-4 mr-1.5" />
                    Back
                  </button>
                  <button
                    type="submit"
                    disabled={loading}
                    className="px-5 py-2.5 bg-primary hover:bg-primary-hover disabled:bg-primary/50 text-white font-bold text-xs uppercase tracking-widest rounded-xl flex items-center justify-center active:scale-95 transition-all cursor-pointer"
                  >
                    {loading ? (
                      <>
                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                        Generating...
                      </>
                    ) : (
                      "Predict Odds"
                    )}
                  </button>
                </div>

              </form>
            </motion.div>
          )}

          {step === 3 && results && (
            <motion.div
              key="step3"
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.98 }}
              className="space-y-8"
            >
              {/* Reset trigger */}
              <div className="flex justify-end">
                <button
                  onClick={handleReset}
                  className="px-4 py-2 border border-slate-200 dark:border-slate-850 bg-white dark:bg-slate-900 rounded-xl text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-350 hover:bg-slate-50 dark:hover:bg-slate-850 transition-colors flex items-center cursor-pointer"
                >
                  <RotateCcw className="w-3.5 h-3.5 mr-1.5 text-slate-450" />
                  Start Over
                </button>
              </div>

              {/* Strategy advice block */}
              <div className="bg-gradient-to-br from-indigo-50 to-blue-50 dark:from-indigo-950/20 dark:to-blue-950/20 border border-indigo-100 dark:border-indigo-900/30 p-6 rounded-3xl space-y-3.5 shadow-sm">
                <h3 className="font-extrabold text-slate-800 dark:text-white flex items-center text-xs uppercase tracking-wider">
                  <Sparkles className="w-5 h-5 mr-2 text-accent-purple animate-pulse" />
                  AI Admission Strategy Analysis
                </h3>
                <p className="text-xs text-slate-600 dark:text-slate-350 leading-relaxed whitespace-pre-line font-semibold">
                  {results.explanation}
                </p>
              </div>

              {/* Grid result columns */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <ResultColumn
                  title="Dream Fit"
                  colleges={results.results.dream}
                  badgeColor="bg-accent-yellow"
                  description="Closing ranks are slightly below your rank. Challenging but possible through trial allotments."
                />
                <ResultColumn
                  title="Target Fit"
                  colleges={results.results.moderate}
                  badgeColor="bg-primary"
                  description="Your rank matches closing cutoff ranges. High odds of allotment in primary rounds."
                />
                <ResultColumn
                  title="Safety Fit"
                  colleges={results.results.safe}
                  badgeColor="bg-accent-green"
                  description="Closing ranks are much higher than your rank. Extremely high likelihood of allotment."
                />
              </div>

            </motion.div>
          )}
        </AnimatePresence>
      </div>

    </div>
  );
}
