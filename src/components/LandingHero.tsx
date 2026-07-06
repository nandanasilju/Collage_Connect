"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { Sparkles, ArrowRight, Bot, Compass, GraduationCap, TrendingUp, Trophy } from "lucide-react";

export default function LandingHero() {
  return (
    <section className="relative overflow-hidden pt-20 pb-16 lg:pt-28 lg:pb-24 bg-gradient-to-b from-primary/5 via-transparent to-transparent">
      
      {/* Decorative Blur Background Blobs */}
      <div className="absolute top-0 left-1/4 -translate-x-1/2 w-80 h-80 bg-primary/10 rounded-full blur-3xl -z-10" />
      <div className="absolute top-1/3 right-1/4 translate-x-1/2 w-96 h-96 bg-secondary/10 rounded-full blur-3xl -z-10" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
          
          {/* Left: Text Contents */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="lg:col-span-6 space-y-6 text-center lg:text-left"
          >
            {/* AI Capsule Tag */}
            <div className="inline-flex items-center space-x-2 bg-accent-purple/10 border border-accent-purple/20 px-3.5 py-1.5 rounded-full text-xs font-bold text-accent-purple tracking-wider uppercase">
              <Sparkles className="w-3.5 h-3.5 animate-pulse" />
              <span>AI-Powered Admissions Assistance</span>
            </div>

            {/* Giant Title */}
            <h1 className="text-4xl sm:text-5xl lg:text-6.5xl font-black tracking-tight leading-[1.1] text-slate-900 dark:text-white">
              Find Your Perfect <br />
              <span className="bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                Engineering
              </span>{" "}
              Campus
            </h1>

            {/* Subtext */}
            <p className="text-base sm:text-lg text-slate-500 dark:text-slate-400 max-w-xl mx-auto lg:mx-0 leading-relaxed">
              Search, compare, analyze, and receive smart AI insights for top engineering colleges in Kerala based on budget, placements, and KEAM ranks.
            </p>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4 pt-2">
              <Link
                href="/colleges"
                className="w-full sm:w-auto px-7 py-3.5 bg-primary hover:bg-primary-hover text-white text-xs font-bold rounded-xl shadow-lg shadow-primary/20 hover:shadow-primary/30 hover:scale-[1.02] active:scale-98 transition-all flex items-center justify-center uppercase tracking-widest"
              >
                <Compass className="w-4 h-4 mr-2" />
                Explore Colleges
              </Link>
              <Link
                href="/assistant"
                className="w-full sm:w-auto px-7 py-3.5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-850 text-slate-700 dark:text-slate-350 text-xs font-bold rounded-xl hover:scale-[1.02] active:scale-98 transition-all flex items-center justify-center uppercase tracking-widest"
              >
                <Bot className="w-4 h-4 mr-2 text-accent-purple" />
                Talk to AI
              </Link>
            </div>
          </motion.div>

          {/* Right: Graphic Dashboard Simulator & Floating elements */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="lg:col-span-6 relative flex justify-center"
          >
            {/* Visual Glassmorphic Container representing a dashboard */}
            <div className="w-full max-w-[480px] aspect-[4/3] rounded-3xl bg-white/40 dark:bg-slate-900/40 backdrop-blur-xl border border-slate-200/50 dark:border-slate-850 p-6 shadow-2xl relative overflow-hidden flex flex-col justify-between">
              
              {/* Fake UI dots */}
              <div className="flex space-x-1.5 pb-4 border-b border-slate-200/40 dark:border-slate-800/40">
                <div className="w-2.5 h-2.5 rounded-full bg-slate-350 dark:bg-slate-750" />
                <div className="w-2.5 h-2.5 rounded-full bg-slate-350 dark:bg-slate-750" />
                <div className="w-2.5 h-2.5 rounded-full bg-slate-350 dark:bg-slate-750" />
              </div>

              {/* Graphic background curves */}
              <div className="flex-grow flex items-center justify-center">
                <svg className="w-full h-32 text-primary/10 dark:text-primary/5" viewBox="0 0 100 30" preserveAspectRatio="none">
                  <path d="M0,25 C20,10 40,30 60,15 C80,0 90,15 100,5 L100,30 L0,30 Z" fill="currentColor" />
                </svg>
              </div>

              <div className="pt-4 border-t border-slate-200/40 dark:border-slate-800/40 flex justify-between text-[10px] font-bold text-slate-400">
                <span>CET TRIVANDRUM</span>
                <span>95% MATCH</span>
              </div>
            </div>

            {/* Floating Card 1: Placements */}
            <motion.div
              animate={{ y: [0, -8, 0] }}
              transition={{ repeat: Infinity, duration: 4, ease: "easeInOut" }}
              className="absolute -top-6 left-6 sm:left-12 bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-850 rounded-2xl p-4 shadow-xl flex items-center space-x-3.5 z-10"
            >
              <div className="w-10 h-10 bg-accent-green/10 text-accent-green rounded-xl flex items-center justify-center">
                <TrendingUp className="w-5 h-5" />
              </div>
              <div>
                <p className="text-xs font-bold text-slate-400">Highest Salary</p>
                <p className="text-base font-extrabold text-slate-850 dark:text-white">45.5 LPA</p>
              </div>
            </motion.div>

            {/* Floating Card 2: AI Roadmap */}
            <motion.div
              animate={{ y: [0, 8, 0] }}
              transition={{ repeat: Infinity, duration: 4.5, ease: "easeInOut" }}
              className="absolute -bottom-4 right-4 sm:right-12 bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-850 rounded-2xl p-4 shadow-xl flex items-center space-x-3.5 z-10"
            >
              <div className="w-10 h-10 bg-accent-purple/10 text-accent-purple rounded-xl flex items-center justify-center">
                <Bot className="w-5 h-5" />
              </div>
              <div>
                <p className="text-xs font-bold text-slate-450">AI Matching</p>
                <p className="text-sm font-extrabold text-slate-800 dark:text-white">Dream fit found</p>
              </div>
            </motion.div>

            {/* Floating Card 3: Admission Odds */}
            <motion.div
              animate={{ x: [0, 6, 0] }}
              transition={{ repeat: Infinity, duration: 5, ease: "easeInOut" }}
              className="absolute top-1/3 -right-6 bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-850 rounded-2xl p-3.5 shadow-xl flex items-center space-x-3 z-10"
            >
              <div className="w-8 h-8 bg-accent-yellow/10 text-accent-yellow rounded-lg flex items-center justify-center">
                <Trophy className="w-4 h-4" />
              </div>
              <span className="text-xs font-bold text-slate-700 dark:text-slate-350">#1 Top Rated</span>
            </motion.div>

          </motion.div>

        </div>
      </div>
    </section>
  );
}
