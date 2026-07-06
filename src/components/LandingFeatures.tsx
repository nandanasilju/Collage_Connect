"use client";

import { motion } from "framer-motion";
import { Search, Scale, Sparkles, BarChart3, LayoutDashboard, Bookmark } from "lucide-react";

export default function LandingFeatures() {
  const features = [
    {
      title: "Smart Search",
      desc: "Instant search suggestions, quick location chips, and range sliders to filter tuition fees.",
      icon: Search,
      color: "text-primary border-primary/20 bg-primary/5",
    },
    {
      title: "College Comparison",
      desc: "Compare up to four engineering colleges side-by-side highlighting average packages and ratings.",
      icon: Scale,
      color: "text-accent-green border-accent-green/20 bg-accent-green/5",
    },
    {
      title: "AI Recommendation",
      desc: "Contextual matching engine recommending colleges based on your budget, district, and target branch.",
      icon: Sparkles,
      color: "text-accent-purple border-accent-purple/20 bg-accent-purple/5",
    },
    {
      title: "Rank Predictor",
      desc: "Wizard form matching your KEAM Entrance rank against historical closing cutoff trends.",
      icon: BarChart3,
      color: "text-accent-yellow border-accent-yellow/20 bg-accent-yellow/5",
    },
    {
      title: "Student Dashboard",
      desc: "Vercel-like console with saved choices, prediction histories, charts, and activity streams.",
      icon: LayoutDashboard,
      color: "text-indigo-500 border-indigo-500/20 bg-indigo-500/5",
    },
    {
      title: "Bookmarks Organizer",
      desc: "Save colleges with a single click and organize them into comparisons or details.",
      icon: Bookmark,
      color: "text-accent-red border-accent-red/20 bg-accent-red/5",
    },
  ];

  return (
    <section className="py-16 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
      <div className="text-center space-y-2 max-w-2xl mx-auto">
        <h2 className="text-3xl font-extrabold tracking-tight text-slate-850 dark:text-white">
          Engineered for Smart Discovery
        </h2>
        <p className="text-sm text-slate-500 dark:text-slate-400">
          Everything you need to navigate college admissions in one unified, high-performance platform.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {features.map((f, idx) => {
          const Icon = f.icon;
          return (
            <motion.div
              key={idx}
              whileHover={{ y: -6, borderColor: "rgba(37, 99, 235, 0.4)" }}
              transition={{ type: "spring", stiffness: 300, damping: 20 }}
              className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-850 p-6 rounded-2xl shadow-sm hover:shadow-md transition-all flex flex-col justify-between h-full space-y-4"
            >
              <div className="space-y-4">
                <div className={`w-10 h-10 rounded-lg flex items-center justify-center border ${f.color}`}>
                  <Icon className="w-5 h-5" />
                </div>
                <h3 className="text-base font-bold text-slate-850 dark:text-white">{f.title}</h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed font-medium">
                  {f.desc}
                </p>
              </div>
            </motion.div>
          );
        })}
      </div>
    </section>
  );
}
