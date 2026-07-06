"use client";

import Link from "next/link";
import { GraduationCap, Mail } from "lucide-react";

export default function Footer() {
  return (
    <footer className="bg-slate-50 dark:bg-slate-950 border-t border-slate-200/80 dark:border-slate-900 transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 lg:gap-12">
          
          {/* Logo & Description (4 Columns) */}
          <div className="md:col-span-4 space-y-4">
            <div className="flex items-center space-x-2.5">
              <div className="w-8 h-8 bg-primary/10 rounded-lg flex items-center justify-center border border-primary/20">
                <GraduationCap className="h-4.5 w-4.5 text-primary" />
              </div>
              <span className="font-extrabold text-sm tracking-tight text-slate-800 dark:text-white">
                College<span className="text-primary font-medium">Discovery</span>
              </span>
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-450 leading-relaxed max-w-sm">
              Helping students discover, compare, and receive intelligent AI recommendations for engineering colleges in Kerala. Find your dream campus today.
            </p>
            <div className="flex space-x-2.5 pt-2">
              <a
                href="#"
                className="w-8 h-8 rounded-lg bg-slate-100 dark:bg-slate-900 hover:bg-primary/10 hover:text-primary border border-slate-250/50 dark:border-slate-850 flex items-center justify-center text-slate-500 transition-all"
                aria-label="GitHub"
              >
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path fillRule="evenodd" d="M12 2C6.477 2 2 6.477 2 12c0 4.42 2.865 8.166 6.839 9.489.5.092.682-.217.682-.482 0-.237-.008-.866-.013-1.7-2.782.603-3.369-1.34-3.369-1.34-.454-1.156-1.11-1.464-1.11-1.464-.908-.62.069-.608.069-.608 1.003.07 1.531 1.03 1.531 1.03.892 1.529 2.341 1.087 2.91.831.092-.646.35-1.086.636-1.336-2.22-.253-4.555-1.11-4.555-4.943 0-1.091.39-1.984 1.029-2.683-.103-.253-.446-1.27.098-2.647 0 0 .84-.269 2.75 1.025A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.294 2.747-1.025 2.747-1.025.546 1.377.203 2.394.1 2.647.64.699 1.028 1.592 1.028 2.683 0 3.842-2.339 4.687-4.566 4.935.359.309.678.919.678 1.852 0 1.336-.012 2.415-.012 2.743 0 .267.18.578.688.48C19.137 20.162 22 16.418 22 12c0-5.523-4.477-10-10-10z" clipRule="evenodd" />
                </svg>
              </a>
              <a
                href="#"
                className="w-8 h-8 rounded-lg bg-slate-100 dark:bg-slate-900 hover:bg-primary/10 hover:text-primary border border-slate-250/50 dark:border-slate-850 flex items-center justify-center text-slate-500 transition-all"
                aria-label="LinkedIn"
              >
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path fillRule="evenodd" d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.779-1.75-1.75s.784-1.75 1.75-1.75 1.75.779 1.75 1.75-.784 1.75-1.75 1.75zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" clipRule="evenodd" />
                </svg>
              </a>
              <a
                href="#"
                className="w-8 h-8 rounded-lg bg-slate-100 dark:bg-slate-900 hover:bg-primary/10 hover:text-primary border border-slate-250/50 dark:border-slate-850 flex items-center justify-center text-slate-500 transition-all"
                aria-label="Twitter"
              >
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z" />
                </svg>
              </a>
            </div>
          </div>

          {/* Column 2: Platform Links (2 Columns) */}
          <div className="md:col-span-2 space-y-3.5">
            <h3 className="text-xs font-bold text-slate-800 dark:text-slate-200 uppercase tracking-widest">
              Platform
            </h3>
            <ul className="space-y-2">
              <li>
                <Link
                  href="/colleges"
                  className="text-xs text-slate-500 dark:text-slate-450 hover:text-primary dark:hover:text-primary transition-colors font-medium"
                >
                  Browse Colleges
                </Link>
              </li>
              <li>
                <Link
                  href="/compare"
                  className="text-xs text-slate-500 dark:text-slate-450 hover:text-primary dark:hover:text-primary transition-colors font-medium"
                >
                  College Match Matrix
                </Link>
              </li>
              <li>
                <Link
                  href="/predictor"
                  className="text-xs text-slate-500 dark:text-slate-450 hover:text-primary dark:hover:text-primary transition-colors font-medium"
                >
                  KEAM Predictor
                </Link>
              </li>
              <li>
                <Link
                  href="/assistant"
                  className="text-xs text-slate-500 dark:text-slate-450 hover:text-primary dark:hover:text-primary transition-colors font-medium"
                >
                  AI Admissions Chat
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 3: Resources Links (2 Columns) */}
          <div className="md:col-span-2 space-y-3.5">
            <h3 className="text-xs font-bold text-slate-800 dark:text-slate-200 uppercase tracking-widest">
              Resources
            </h3>
            <ul className="space-y-2">
              <li>
                <a
                  href="https://cee.kerala.gov.in"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-xs text-slate-500 dark:text-slate-450 hover:text-primary transition-colors font-medium"
                >
                  CEE Kerala Portal
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="text-xs text-slate-500 dark:text-slate-450 hover:text-primary transition-colors font-medium"
                >
                  F.A.Q.s
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="text-xs text-slate-500 dark:text-slate-450 hover:text-primary transition-colors font-medium"
                >
                  Privacy Policy
                </a>
              </li>
            </ul>
          </div>

          {/* Column 4: Newsletter Subscription (4 Columns) */}
          <div className="md:col-span-4 space-y-3.5">
            <h3 className="text-xs font-bold text-slate-800 dark:text-slate-200 uppercase tracking-widest">
              Stay Updated
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-450 leading-relaxed">
              Subscribe to get immediate notifications on KEAM allotments, cutoff ranks, and admissions notifications.
            </p>
            <form onSubmit={(e) => e.preventDefault()} className="flex space-x-2">
              <input
                type="email"
                placeholder="Enter your email"
                className="flex-grow px-3 py-2 text-xs border border-slate-200 dark:border-slate-850 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-200 font-semibold"
                required
              />
              <button
                type="submit"
                className="px-4 py-2 text-xs font-bold rounded-xl text-white bg-primary hover:bg-primary-hover active:scale-95 transition-all shadow-sm flex items-center uppercase tracking-wider"
              >
                Join
              </button>
            </form>
          </div>

        </div>

        {/* Copyright and Metadata */}
        <div className="border-t border-slate-200/60 dark:border-slate-900 mt-10 pt-6 flex flex-col sm:flex-row justify-between items-center gap-4 text-[11px] text-slate-400 font-medium">
          <p>© {new Date().getFullYear()} College Discovery. All rights reserved.</p>
          <div className="flex space-x-4">
            <a href="#" className="hover:text-primary transition-colors">Terms of Service</a>
            <span>•</span>
            <a href="#" className="hover:text-primary transition-colors">Cookie Settings</a>
          </div>
        </div>
      </div>
    </footer>
  );
}
