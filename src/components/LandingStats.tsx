"use client";

import { motion } from "framer-motion";
import { Compass, Users, Sparkles, Star } from "lucide-react";

export default function LandingStats({ stats }: { stats: { collegesCount: number } }) {
  const items = [
    {
      label: "Total Colleges Listed",
      value: stats.collegesCount.toString(),
      icon: Compass,
      color: "text-primary bg-primary/10 border-primary/20",
    },
    {
      label: "Active Student Queries",
      value: "14,200+",
      icon: Users,
      color: "text-accent-green bg-accent-green/10 border-accent-green/20",
    },
    {
      label: "AI Advice Generated",
      value: "28,500+",
      icon: Sparkles,
      color: "text-accent-purple bg-accent-purple/10 border-accent-purple/20",
    },
    {
      label: "Average Student Rating",
      value: "4.8 / 5.0",
      icon: Star,
      color: "text-accent-yellow bg-accent-yellow/10 border-accent-yellow/20",
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
      {items.map((item, idx) => {
        const Icon = item.icon;
        return (
          <motion.div
            key={idx}
            whileHover={{ y: -6 }}
            transition={{ type: "spring", stiffness: 300, damping: 20 }}
            className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-850 p-6 rounded-2xl shadow-sm hover:shadow-md transition-all flex items-center space-x-4"
          >
            <div className={`w-12 h-12 rounded-xl flex items-center justify-center border ${item.color}`}>
              <Icon className="w-5.5 h-5.5" />
            </div>
            <div>
              <p className="text-2xl font-black text-slate-850 dark:text-white leading-none">{item.value}</p>
              <p className="text-xs text-slate-450 dark:text-slate-400 font-bold uppercase tracking-wider mt-1.5">{item.label}</p>
            </div>
          </motion.div>
        );
      })}
    </div>
  );
}
