"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { useTheme } from "./ThemeProvider";
import { Sun, Moon, Menu, X, Compass, Bookmark, User, LogOut, LayoutDashboard, ShieldAlert, BarChart3, Scale } from "lucide-react";

export default function Navbar() {
  const pathname = usePathname();
  const { user, logout } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const [isOpen, setIsOpen] = useState(false);

  const isActive = (path: string) => pathname === path;

  // Guest nav links
  const guestLinks = [
    { label: "Find Colleges", href: "/colleges", icon: Compass },
    { label: "Compare", href: "/compare", icon: Scale },
    { label: "KEAM Predictor", href: "/predictor", icon: BarChart3 },
    { label: "AI Assistant", href: "/assistant", icon: User },
  ];

  // User nav links
  const userLinks = [
    { label: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
    { label: "Saved", href: "/saved", icon: Bookmark },
    { label: "Profile", href: "/profile", icon: User },
  ];

  return (
    <nav className="sticky top-0 z-50 bg-white/80 dark:bg-slate-900/80 backdrop-blur-md border-b border-slate-200 dark:border-slate-800 shadow-sm transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            {/* Logo */}
            <Link href="/" className="flex items-center space-x-2">
              <span className="text-xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent dark:from-blue-400 dark:to-indigo-400">
                College Discovery
              </span>
            </Link>

            {/* Desktop Navigation Links */}
            <div className="hidden md:ml-8 md:flex md:space-x-4">
              {guestLinks.map((link) => {
                const Icon = link.icon;
                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    className={`inline-flex items-center px-3 py-2 rounded-md text-sm font-medium transition-all duration-200 ${
                      isActive(link.href)
                        ? "text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-950/50"
                        : "text-slate-600 dark:text-slate-300 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-slate-50 dark:hover:bg-slate-800"
                    }`}
                  >
                    <Icon className="w-4 h-4 mr-1.5" />
                    {link.label}
                  </Link>
                );
              })}

              {user &&
                userLinks.map((link) => {
                  const Icon = link.icon;
                  return (
                    <Link
                      key={link.href}
                      href={link.href}
                      className={`inline-flex items-center px-3 py-2 rounded-md text-sm font-medium transition-all duration-200 ${
                        isActive(link.href)
                          ? "text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-950/50"
                          : "text-slate-600 dark:text-slate-300 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-slate-50 dark:hover:bg-slate-800"
                      }`}
                    >
                      <Icon className="w-4 h-4 mr-1.5" />
                      {link.label}
                    </Link>
                  );
                })}

              {user?.role === "ADMIN" && (
                <Link
                  href="/admin"
                  className={`inline-flex items-center px-3 py-2 rounded-md text-sm font-medium transition-all duration-200 ${
                    isActive("/admin")
                      ? "text-rose-600 dark:text-rose-400 bg-rose-50 dark:bg-rose-950/50"
                      : "text-slate-600 dark:text-slate-300 hover:text-rose-600 dark:hover:text-rose-400 hover:bg-slate-50 dark:hover:bg-slate-800"
                  }`}
                >
                  <ShieldAlert className="w-4 h-4 mr-1.5" />
                  Admin Panel
                </Link>
              )}
            </div>
          </div>

          {/* Right actions */}
          <div className="hidden md:flex items-center space-x-3">
            {/* Dark Mode Toggle */}
            <button
              onClick={toggleTheme}
              className="p-2 rounded-lg text-slate-500 hover:text-blue-600 dark:text-slate-400 dark:hover:text-blue-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors duration-200"
              aria-label="Toggle theme"
            >
              {theme === "dark" ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
            </button>

            {user ? (
              <div className="flex items-center space-x-3">
                <span className="text-sm font-medium text-slate-700 dark:text-slate-300">
                  {user.name.split(" ")[0]}
                </span>
                <button
                  onClick={logout}
                  className="inline-flex items-center px-3.5 py-1.5 border border-slate-200 dark:border-slate-700 text-sm font-medium rounded-lg text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-all duration-200"
                >
                  <LogOut className="w-4 h-4 mr-1.5 text-slate-500" />
                  Logout
                </button>
              </div>
            ) : (
              <div className="flex items-center space-x-2">
                <Link
                  href="/login"
                  className="px-3.5 py-1.5 text-sm font-medium text-slate-700 dark:text-slate-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
                >
                  Sign in
                </Link>
                <Link
                  href="/signup"
                  className="px-4 py-1.5 text-sm font-medium rounded-lg text-white bg-blue-600 hover:bg-blue-700 shadow-md shadow-blue-500/20 dark:shadow-none transition-all duration-200"
                >
                  Sign up
                </Link>
              </div>
            )}
          </div>

          {/* Mobile hamburger menu */}
          <div className="flex items-center space-x-2 md:hidden">
            <button
              onClick={toggleTheme}
              className="p-2 rounded-lg text-slate-500 hover:text-blue-600 dark:text-slate-400 dark:hover:text-blue-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            >
              {theme === "dark" ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
            </button>

            <button
              onClick={() => setIsOpen(!isOpen)}
              className="p-2 rounded-lg text-slate-500 hover:text-blue-600 dark:text-slate-400 dark:hover:text-blue-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
              aria-label="Main menu"
            >
              {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <div className="md:hidden bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 px-4 pt-2 pb-4 space-y-1 shadow-inner">
          {guestLinks.map((link) => {
            const Icon = link.icon;
            return (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setIsOpen(false)}
                className={`flex items-center px-3 py-2.5 rounded-md text-base font-medium transition-all ${
                  isActive(link.href)
                    ? "text-blue-600 bg-blue-50 dark:text-blue-400 dark:bg-blue-950/40"
                    : "text-slate-700 dark:text-slate-300 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-slate-50 dark:hover:bg-slate-800"
                }`}
              >
                <Icon className="w-5 h-5 mr-3 text-slate-400" />
                {link.label}
              </Link>
            );
          })}

          {user &&
            userLinks.map((link) => {
              const Icon = link.icon;
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setIsOpen(false)}
                  className={`flex items-center px-3 py-2.5 rounded-md text-base font-medium transition-all ${
                    isActive(link.href)
                      ? "text-blue-600 bg-blue-50 dark:text-blue-400 dark:bg-blue-950/40"
                      : "text-slate-700 dark:text-slate-300 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-slate-50 dark:hover:bg-slate-800"
                  }`}
                >
                  <Icon className="w-5 h-5 mr-3 text-slate-400" />
                  {link.label}
                </Link>
              );
            })}

          {user?.role === "ADMIN" && (
            <Link
              href="/admin"
              onClick={() => setIsOpen(false)}
              className={`flex items-center px-3 py-2.5 rounded-md text-base font-medium transition-all ${
                isActive("/admin")
                  ? "text-rose-600 bg-rose-50 dark:text-rose-400 dark:bg-rose-950/40"
                  : "text-slate-700 dark:text-slate-300 hover:text-rose-600 dark:hover:text-rose-400 hover:bg-slate-50 dark:hover:bg-slate-800"
              }`}
            >
              <ShieldAlert className="w-5 h-5 mr-3 text-rose-500" />
              Admin Panel
            </Link>
          )}

          <div className="border-t border-slate-200 dark:border-slate-800 pt-3 mt-3">
            {user ? (
              <div className="space-y-1">
                <div className="px-3 py-1.5 text-sm font-semibold text-slate-500">
                  Signed in as: <span className="text-slate-800 dark:text-slate-200">{user.name}</span>
                </div>
                <button
                  onClick={() => {
                    setIsOpen(false);
                    logout();
                  }}
                  className="flex w-full items-center px-3 py-2.5 rounded-md text-base font-medium text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/30 transition-all"
                >
                  <LogOut className="w-5 h-5 mr-3" />
                  Sign out
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-2 gap-2 p-2">
                <Link
                  href="/login"
                  onClick={() => setIsOpen(false)}
                  className="flex items-center justify-center px-4 py-2 border border-slate-200 dark:border-slate-700 text-base font-medium rounded-lg text-slate-700 dark:text-slate-300"
                >
                  Sign In
                </Link>
                <Link
                  href="/signup"
                  onClick={() => setIsOpen(false)}
                  className="flex items-center justify-center px-4 py-2 text-base font-medium rounded-lg text-white bg-blue-600"
                >
                  Sign Up
                </Link>
              </div>
            )}
          </div>
        </div>
      )}
    </nav>
  );
}
