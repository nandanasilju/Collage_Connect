"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { User, Settings, Mail, Lock, Sparkles, Loader2, DollarSign, Map, GraduationCap } from "lucide-react";
import toast from "react-hot-toast";

const BRANCHES = [
  "Computer Science & Engineering",
  "Electronics & Communication Engineering",
  "Electrical & Electronics Engineering",
  "Mechanical Engineering",
  "Civil Engineering",
  "Chemical Engineering",
];

const DISTRICTS = ["Trivandrum", "Kollam", "Ernakulam", "Thrissur", "Palakkad"];

export default function ProfilePage() {
  const router = useRouter();
  const { user, loading: authLoading, refreshUser } = useAuth();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [preferredBranch, setPreferredBranch] = useState("");
  const [preferredLocation, setPreferredLocation] = useState("");
  const [budget, setBudget] = useState("");
  
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (authLoading) return;
    if (!user) {
      router.push("/login");
      return;
    }

    setName(user.name);
    setEmail(user.email);
    setPreferredBranch(user.preferredBranch || "");
    setPreferredLocation(user.preferredLocation || "");
    setBudget(user.budget ? user.budget.toString() : "");
  }, [user, authLoading, router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !email) {
      toast.error("Name and email are required fields");
      return;
    }

    setLoading(true);
    try {
      const res = await fetch("/api/profile", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name,
          email,
          password: password || undefined,
          preferredBranch: preferredBranch || null,
          preferredLocation: preferredLocation || null,
          budget: budget ? parseFloat(budget) : null,
        }),
      });

      const data = await res.json();
      if (res.ok) {
        await refreshUser();
        setPassword("");
        toast.success("Profile preferences updated successfully!");
      } else {
        toast.error(data.error || "Failed to update profile");
      }
    } catch (err) {
      toast.error("An error occurred");
    } finally {
      setLoading(false);
    }
  };

  if (authLoading) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-16 flex justify-center items-center">
        <Loader2 className="w-10 h-10 text-blue-500 animate-spin" />
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Header */}
      <div className="space-y-1">
        <h1 className="text-3xl font-extrabold text-slate-850 dark:text-slate-100 flex items-center">
          <Settings className="w-7 h-7 mr-2.5 text-blue-500" />
          Profile Settings
        </h1>
        <p className="text-slate-500 dark:text-slate-400 text-sm">
          Manage your personal details, engineering branch preferences, and budget restrictions.
        </p>
      </div>

      {/* Form Card Grid */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-8 rounded-3xl shadow-sm transition-colors duration-300">
        <form onSubmit={handleSubmit} className="space-y-6">
          
          <h3 className="font-bold text-slate-800 dark:text-slate-100 text-base border-b border-slate-100 dark:border-slate-800 pb-3">
            Account Information
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Full Name */}
            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center">
                <User className="w-3.5 h-3.5 mr-1.5 text-blue-500" />
                Full Name
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="John Doe"
                className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 text-slate-900 dark:text-slate-100 placeholder-slate-400 transition-all font-semibold"
              />
            </div>

            {/* Email Address */}
            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center">
                <Mail className="w-3.5 h-3.5 mr-1.5 text-blue-500" />
                Email Address
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="john@example.com"
                className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 text-slate-900 dark:text-slate-100 placeholder-slate-400 transition-all font-semibold"
              />
            </div>

            {/* Change Password */}
            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center">
                <Lock className="w-3.5 h-3.5 mr-1.5 text-blue-500" />
                Change Password (optional)
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Leave blank to keep current"
                className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 text-slate-900 dark:text-slate-100 placeholder-slate-400 transition-all font-semibold"
              />
            </div>
          </div>

          <h3 className="font-bold text-slate-800 dark:text-slate-100 text-base border-b border-slate-100 dark:border-slate-800 pb-3 pt-4">
            AI Discovery Preferences
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            
            {/* Preferred Branch */}
            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center">
                <GraduationCap className="w-3.5 h-3.5 mr-1.5 text-blue-500" />
                Target engineering Branch
              </label>
              <select
                value={preferredBranch}
                onChange={(e) => setPreferredBranch(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 text-slate-700 dark:text-slate-255 transition-all font-semibold"
              >
                <option value="">Any Branch</option>
                {BRANCHES.map((b) => (
                  <option key={b} value={b}>
                    {b}
                  </option>
                ))}
              </select>
            </div>

            {/* Preferred Location */}
            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center">
                <Map className="w-3.5 h-3.5 mr-1.5 text-blue-500" />
                Preferred Location (District)
              </label>
              <select
                value={preferredLocation}
                onChange={(e) => setPreferredLocation(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 text-slate-700 dark:text-slate-255 transition-all font-semibold"
              >
                <option value="">Any Location</option>
                {DISTRICTS.map((d) => (
                  <option key={d} value={d}>
                    {d}
                  </option>
                ))}
              </select>
            </div>

            {/* budget */}
            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center">
                <DollarSign className="w-3.5 h-3.5 mr-1.5 text-blue-500" />
                Annual Tuition Budget
              </label>
              <input
                type="text"
                value={budget}
                onChange={(e) => setBudget(e.target.value.replace(/\D/g, ""))}
                placeholder="e.g. 85000"
                className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 text-slate-900 dark:text-slate-100 placeholder-slate-400 transition-all font-semibold"
              />
            </div>

          </div>

          <div className="pt-4 border-t border-slate-100 dark:border-slate-800 flex justify-end">
            <button
              type="submit"
              disabled={loading}
              className="px-6 py-3 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white font-bold rounded-xl shadow-md shadow-blue-500/10 active:scale-95 transition-all flex items-center"
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Saving Changes...
                </>
              ) : (
                "Save Preferences"
              )}
            </button>
          </div>

        </form>
      </div>

    </div>
  );
}
