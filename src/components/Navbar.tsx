"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { useAuth } from "@/context/AuthContext";
import { useTheme } from "./ThemeProvider";
import { motion, AnimatePresence } from "framer-motion";
import {
  Sun,
  Moon,
  Menu,
  X,
  Compass,
  Bookmark,
  User,
  LogOut,
  LayoutDashboard,
  ShieldAlert,
  BarChart3,
  Scale,
  Search,
  ChevronDown,
} from "lucide-react";

export default function Navbar() {
  const pathname = usePathname();
  const router = useRouter();
  const { user, logout } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const [isOpen, setIsOpen] = useState(false);
  const [showUserDropdown, setShowUserDropdown] = useState(false);

  const isActive = (path: string) => pathname === path;

  // Handle Ctrl+K shortcut to focus/redirect to Search
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === "k") {
        e.preventDefault();
        router.push("/colleges");
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [router]);

  const guestLinks = [
    { label: "Colleges", href: "/colleges", icon: Compass },
    { label: "Compare", href: "/compare", icon: Scale },
    { label: "KEAM Predictor", href: "/predictor", icon: BarChart3 },
    { label: "AI Assistant", href: "/assistant", icon: User },
  ];

  const userLinks = [
    { label: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
    { label: "Saved List", href: "/saved", icon: Bookmark },
    { label: "Profile", href: "/profile", icon: User },
  ];

  return (
    <nav className="sticky top-0 z-50 bg-white/70 dark:bg-slate-950/70 backdrop-blur-md border-b border-slate-200/80 dark:border-slate-900 transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center space-x-6">
            {/* Logo */}
            <Link href="/" className="flex items-center space-x-2.5 group">
              <div className="w-9 h-9 bg-primary/10 rounded-xl flex items-center justify-center border border-primary/20 group-hover:scale-105 transition-transform">
                <Compass className="w-5 h-5 text-primary" />
              </div>
              <span className="text-lg font-black tracking-tight text-slate-900 dark:text-white">
                College<span className="text-primary font-medium">Discovery</span>
              </span>
            </Link>

            {/* Desktop Navigation Links */}
            <div className="hidden md:flex items-center space-x-1">
              {guestLinks.map((link) => {
                const Icon = link.icon;
                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    className={`inline-flex items-center px-3.5 py-2 rounded-xl text-xs font-semibold uppercase tracking-wider transition-all duration-200 ${
                      isActive(link.href)
                        ? "text-primary bg-primary/5 dark:bg-primary/10"
                        : "text-slate-600 dark:text-slate-450 hover:text-primary dark:hover:text-primary hover:bg-slate-50 dark:hover:bg-slate-900/50"
                    }`}
                  >
                    <Icon className="w-3.5 h-3.5 mr-2 opacity-80" />
                    {link.label}
                  </Link>
                );
              })}

              {user &&
                userLinks.slice(0, 2).map((link) => {
                  const Icon = link.icon;
                  return (
                    <Link
                      key={link.href}
                      href={link.href}
                      className={`inline-flex items-center px-3.5 py-2 rounded-xl text-xs font-semibold uppercase tracking-wider transition-all duration-200 ${
                        isActive(link.href)
                          ? "text-primary bg-primary/5 dark:bg-primary/10"
                          : "text-slate-600 dark:text-slate-450 hover:text-primary dark:hover:text-primary hover:bg-slate-50 dark:hover:bg-slate-900/50"
                      }`}
                    >
                      <Icon className="w-3.5 h-3.5 mr-2 opacity-80" />
                      {link.label}
                    </Link>
                  );
                })}

              {user?.role === "ADMIN" && (
                <Link
                  href="/admin"
                  className={`inline-flex items-center px-3.5 py-2 rounded-xl text-xs font-semibold uppercase tracking-wider transition-all duration-200 ${
                    isActive("/admin")
                      ? "text-accent-red bg-accent-red/5 dark:bg-accent-red/10"
                      : "text-slate-600 dark:text-slate-450 hover:text-accent-red hover:bg-slate-50 dark:hover:bg-slate-900/50"
                  }`}
                >
                  <ShieldAlert className="w-3.5 h-3.5 mr-2 opacity-80" />
                  Admin
                </Link>
              )}
            </div>
          </div>

          {/* Right actions */}
          <div className="hidden md:flex items-center space-x-4">
            
            {/* Search Shortcut Hint */}
            <Link
              href="/colleges"
              className="flex items-center space-x-2 px-3 py-1.5 bg-slate-100 dark:bg-slate-900 hover:bg-slate-200 dark:hover:bg-slate-800 text-slate-450 hover:text-slate-700 dark:hover:text-slate-300 border border-slate-200 dark:border-slate-850 rounded-xl text-xs transition-all duration-200"
            >
              <Search className="w-3.5 h-3.5" />
              <span>Search...</span>
              <kbd className="bg-white dark:bg-slate-950 px-1.5 py-0.5 rounded text-[10px] border border-slate-200 dark:border-slate-850 text-slate-400 font-mono">⌘K</kbd>
            </Link>

            {/* Dark Mode Toggle */}
            <button
              onClick={toggleTheme}
              className="p-2 rounded-xl text-slate-550 hover:text-primary dark:text-slate-400 dark:hover:text-primary hover:bg-slate-100 dark:hover:bg-slate-900 transition-colors"
              aria-label="Toggle theme"
            >
              {theme === "dark" ? <Sun className="w-4.5 h-4.5" /> : <Moon className="w-4.5 h-4.5" />}
            </button>

            {/* Auth section */}
            {user ? (
              <div className="relative">
                <button
                  onClick={() => setShowUserDropdown(!showUserDropdown)}
                  className="flex items-center space-x-2.5 px-3 py-1.5 hover:bg-slate-100 dark:hover:bg-slate-900 rounded-xl transition-colors text-left"
                >
                  <div className="w-7 h-7 bg-primary/10 text-primary border border-primary/20 rounded-lg flex items-center justify-center font-bold text-xs uppercase">
                    {user.name.slice(0, 2)}
                  </div>
                  <span className="text-xs font-bold text-slate-700 dark:text-slate-350 flex items-center">
                    {user.name.split(" ")[0]}
                    <ChevronDown className="w-3 h-3 ml-1 text-slate-400" />
                  </span>
                </button>

                {/* Dropdown Menu */}
                <AnimatePresence>
                  {showUserDropdown && (
                    <>
                      {/* Overlay backdrop to close */}
                      <div
                        className="fixed inset-0 z-10"
                        onClick={() => setShowUserDropdown(false)}
                      />
                      <motion.div
                        initial={{ opacity: 0, y: 8, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 8, scale: 0.95 }}
                        className="absolute right-0 mt-2.5 w-48 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-850 rounded-xl shadow-lg py-1.5 z-20 overflow-hidden divide-y divide-slate-100 dark:divide-slate-850"
                      >
                        <div className="px-4 py-2 text-xs">
                          <p className="text-slate-450 font-medium">Logged in as</p>
                          <p className="font-bold text-slate-800 dark:text-slate-250 truncate">{user.email}</p>
                        </div>
                        <div className="py-1">
                          <Link
                            href="/dashboard"
                            onClick={() => setShowUserDropdown(false)}
                            className="flex items-center px-4 py-2 text-xs font-semibold text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800"
                          >
                            <LayoutDashboard className="w-3.5 h-3.5 mr-2 text-slate-400" />
                            Dashboard
                          </Link>
                          <Link
                            href="/profile"
                            onClick={() => setShowUserDropdown(false)}
                            className="flex items-center px-4 py-2 text-xs font-semibold text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800"
                          >
                            <User className="w-3.5 h-3.5 mr-2 text-slate-400" />
                            Settings
                          </Link>
                        </div>
                        <div className="py-1">
                          <button
                            onClick={() => {
                              setShowUserDropdown(false);
                              logout();
                            }}
                            className="flex w-full items-center px-4 py-2 text-xs font-bold text-accent-red hover:bg-accent-red/5"
                          >
                            <LogOut className="w-3.5 h-3.5 mr-2" />
                            Logout
                          </button>
                        </div>
                      </motion.div>
                    </>
                  )}
                </AnimatePresence>
              </div>
            ) : (
              <div className="flex items-center space-x-2">
                <Link
                  href="/login"
                  className="px-3.5 py-2 text-xs font-bold text-slate-700 dark:text-slate-300 hover:text-primary transition-colors uppercase tracking-wider"
                >
                  Sign in
                </Link>
                <Link
                  href="/signup"
                  className="px-4 py-2 text-xs font-bold rounded-xl text-white bg-primary hover:bg-primary-hover shadow-sm transition-all uppercase tracking-wider"
                >
                  Sign up
                </Link>
              </div>
            )}
          </div>

          {/* Mobile menu trigger */}
          <div className="flex items-center space-x-2 md:hidden">
            <button
              onClick={toggleTheme}
              className="p-2 rounded-xl text-slate-550 hover:text-primary dark:text-slate-400 dark:hover:text-primary hover:bg-slate-100 dark:hover:bg-slate-900 transition-colors"
            >
              {theme === "dark" ? <Sun className="w-4.5 h-4.5" /> : <Moon className="w-4.5 h-4.5" />}
            </button>
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="p-2 rounded-xl text-slate-550 hover:text-primary dark:text-slate-400 dark:hover:text-primary hover:bg-slate-100 dark:hover:bg-slate-900 transition-colors"
              aria-label="Main menu"
            >
              {isOpen ? <X className="w-5.5 h-5.5" /> : <Menu className="w-5.5 h-5.5" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Overlays with Framer Motion */}
      <AnimatePresence>
        {isOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsOpen(false)}
              className="fixed inset-0 z-40 bg-black/30 backdrop-blur-sm md:hidden"
            />
            
            {/* Drawer */}
            <motion.div
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", bounce: 0, duration: 0.3 }}
              className="fixed right-0 top-0 bottom-0 z-50 w-72 bg-white dark:bg-slate-950 border-l border-slate-200 dark:border-slate-900 shadow-2xl p-6 flex flex-col md:hidden"
            >
              <div className="flex items-center justify-between pb-6 border-b border-slate-100 dark:border-slate-900">
                <span className="font-black text-slate-900 dark:text-white tracking-tight">Navigation</span>
                <button
                  onClick={() => setIsOpen(false)}
                  className="p-1 rounded-lg text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-900"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="flex-grow py-6 space-y-2 overflow-y-auto">
                {guestLinks.map((link) => {
                  const Icon = link.icon;
                  return (
                    <Link
                      key={link.href}
                      href={link.href}
                      onClick={() => setIsOpen(false)}
                      className={`flex items-center px-4 py-3 rounded-xl text-sm font-semibold transition-all ${
                        isActive(link.href)
                          ? "text-primary bg-primary/5 dark:bg-primary/10"
                          : "text-slate-600 dark:text-slate-350 hover:text-primary hover:bg-slate-50 dark:hover:bg-slate-900"
                      }`}
                    >
                      <Icon className="w-4 h-4 mr-3.5 text-slate-450" />
                      {link.label}
                    </Link>
                  );
                })}

                {user && (
                  <>
                    <div className="border-t border-slate-100 dark:border-slate-900 my-4" />
                    {userLinks.map((link) => {
                      const Icon = link.icon;
                      return (
                        <Link
                          key={link.href}
                          href={link.href}
                          onClick={() => setIsOpen(false)}
                          className={`flex items-center px-4 py-3 rounded-xl text-sm font-semibold transition-all ${
                            isActive(link.href)
                              ? "text-primary bg-primary/5 dark:bg-primary/10"
                              : "text-slate-600 dark:text-slate-350 hover:text-primary hover:bg-slate-50 dark:hover:bg-slate-900"
                          }`}
                        >
                          <Icon className="w-4 h-4 mr-3.5 text-slate-450" />
                          {link.label}
                        </Link>
                      );
                    })}
                  </>
                )}

                {user?.role === "ADMIN" && (
                  <Link
                    href="/admin"
                    onClick={() => setIsOpen(false)}
                    className={`flex items-center px-4 py-3 rounded-xl text-sm font-semibold transition-all ${
                      isActive("/admin")
                        ? "text-accent-red bg-accent-red/5 dark:bg-accent-red/10"
                        : "text-slate-600 dark:text-slate-350 hover:text-accent-red hover:bg-slate-50 dark:hover:bg-slate-900"
                    }`}
                  >
                    <ShieldAlert className="w-4 h-4 mr-3.5 text-accent-red opacity-80" />
                    Admin panel
                  </Link>
                )}
              </div>

              <div className="border-t border-slate-100 dark:border-slate-900 pt-6">
                {user ? (
                  <div className="space-y-4">
                    <div className="flex items-center space-x-3 px-3">
                      <div className="w-8 h-8 bg-primary/10 text-primary border border-primary/20 rounded-lg flex items-center justify-center font-bold text-xs uppercase">
                        {user.name.slice(0, 2)}
                      </div>
                      <div className="min-w-0">
                        <p className="font-bold text-sm text-slate-800 dark:text-slate-200 truncate">{user.name}</p>
                        <p className="text-[10px] text-slate-400 truncate">{user.email}</p>
                      </div>
                    </div>
                    <button
                      onClick={() => {
                        setIsOpen(false);
                        logout();
                      }}
                      className="flex w-full items-center justify-center px-4 py-2.5 rounded-xl text-sm font-bold text-accent-red bg-accent-red/5 hover:bg-accent-red/10 transition-colors"
                    >
                      <LogOut className="w-4 h-4 mr-2" />
                      Logout
                    </button>
                  </div>
                ) : (
                  <div className="grid grid-cols-2 gap-3">
                    <Link
                      href="/login"
                      onClick={() => setIsOpen(false)}
                      className="flex items-center justify-center px-4 py-2.5 border border-slate-200 dark:border-slate-850 text-sm font-bold rounded-xl text-slate-700 dark:text-slate-300"
                    >
                      Sign In
                    </Link>
                    <Link
                      href="/signup"
                      onClick={() => setIsOpen(false)}
                      className="flex items-center justify-center px-4 py-2.5 text-sm font-bold rounded-xl text-white bg-primary hover:bg-primary-hover"
                    >
                      Sign Up
                    </Link>
                  </div>
                )}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </nav>
  );
}
