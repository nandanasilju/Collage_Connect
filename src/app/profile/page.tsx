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
      <div className="max-w-4xl mx-auto px-4 py-20 flex justify-center items-center">
        <Loader2 className="w-10 h-10 text-primary animate-spin" />
      </div>
    );
  }

  // Calculate completeness
  let completeness = 0;
  if (name) completeness += 20;
  if (email) completeness += 20;
  if (preferredBranch) completeness += 20;
  if (preferredLocation) completeness += 20;
  if (budget) completeness += 20;

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Header */}
      <div className="space-y-1">
        <h1 className="text-3xl font-extrabold text-slate-850 dark:text-white flex items-center">
          <Settings className="w-7 h-7 mr-2.5 text-primary" />
          Settings Profile
        </h1>
        <p className="text-slate-500 dark:text-slate-400 text-sm">
          Update account details, entrance branches, and parent tuition budgets.
        </p>
      </div>

      {/* Grid: Form and Completeness Info */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-start">
        
        {/* Left Form (8 Columns) */}
        <div className="md:col-span-8 bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-900 p-6 rounded-3xl shadow-sm transition-colors duration-300">
          <form onSubmit={handleSubmit} className="space-y-6">
            
            <h3 className="font-bold text-slate-850 dark:text-white text-sm border-b border-slate-100 dark:border-slate-850 pb-3 uppercase tracking-wider">
              Account details
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 text-xs font-semibold">
              {/* Full Name */}
              <div className="space-y-2">
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest flex items-center">
                  <User className="w-3.5 h-3.5 mr-1.5 text-primary" />
                  Full Name
                </label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="John Doe"
                  className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-slate-850 border border-slate-200 dark:border-slate-800 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary text-slate-900 dark:text-white"
                />
              </div>

              {/* Email Address */}
              <div className="space-y-2">
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest flex items-center">
                  <Mail className="w-3.5 h-3.5 mr-1.5 text-primary" />
                  Email Address
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="john@example.com"
                  className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-slate-850 border border-slate-200 dark:border-slate-800 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary text-slate-900 dark:text-white"
                />
              </div>

              {/* Password */}
              <div className="space-y-2">
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest flex items-center">
                  <Lock className="w-3.5 h-3.5 mr-1.5 text-primary" />
                  Password (Optional)
                </label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Leave blank to keep current"
                  className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-slate-850 border border-slate-200 dark:border-slate-800 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary text-slate-900 dark:text-white"
                />
              </div>
            </div>

            <h3 className="font-bold text-slate-850 dark:text-white text-sm border-b border-slate-100 dark:border-slate-855 pb-3 pt-4 uppercase tracking-wider">
              AI Matching Preferences
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 text-xs font-semibold">
              {/* Branch */}
              <div className="space-y-2">
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest flex items-center">
                  <GraduationCap className="w-3.5 h-3.5 mr-1.5 text-primary" />
                  Target Branch
                </label>
                <select
                  value={preferredBranch}
                  onChange={(e) => setPreferredBranch(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-slate-850 border border-slate-200 dark:border-slate-800 rounded-xl text-slate-700 dark:text-slate-250 cursor-pointer"
                >
                  <option value="">Any Branch</option>
                  {BRANCHES.map((b) => (
                    <option key={b} value={b}>
                      {b}
                    </option>
                  ))}
                </select>
              </div>

              {/* Location */}
              <div className="space-y-2">
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest flex items-center">
                  <Map className="w-3.5 h-3.5 mr-1.5 text-primary" />
                  Preferred Location
                </label>
                <select
                  value={preferredLocation}
                  onChange={(e) => setPreferredLocation(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-slate-850 border border-slate-200 dark:border-slate-800 rounded-xl text-slate-700 dark:text-slate-250 cursor-pointer"
                >
                  <option value="">Any Location</option>
                  {DISTRICTS.map((d) => (
                    <option key={d} value={d}>
                      {d}
                    </option>
                  ))}
                </select>
              </div>

              {/* Budget */}
              <div className="space-y-2">
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest flex items-center">
                  <DollarSign className="w-3.5 h-3.5 mr-1.5 text-primary" />
                  Annual Budget
                </label>
                <input
                  type="text"
                  value={budget}
                  onChange={(e) => setBudget(e.target.value.replace(/\D/g, ""))}
                  placeholder="e.g. 85000"
                  className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-slate-855 border border-slate-200 dark:border-slate-800 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary text-slate-900 dark:text-white"
                />
              </div>
            </div>

            <div className="pt-6 border-t border-slate-100 dark:border-slate-850 flex justify-end">
              <button
                type="submit"
                disabled={loading}
                className="px-6 py-3 bg-primary hover:bg-primary-hover disabled:bg-primary/50 text-white font-bold text-xs uppercase tracking-widest rounded-xl shadow-sm active:scale-95 transition-all flex items-center justify-center cursor-pointer"
              >
                {loading ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Saving...
                  </>
                ) : (
                  "Save Preferences"
                )}
              </button>
            </div>

          </form>
        </div>

        {/* Right Info Widget (4 Columns) */}
        <div className="md:col-span-4 space-y-6">
          <div className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-900 p-6 rounded-3xl shadow-sm text-xs font-semibold space-y-4">
            <h4 className="font-extrabold text-slate-850 dark:text-white text-xs uppercase tracking-wider">
              Profile Strength
            </h4>
            
            <div className="flex justify-between items-center text-[10px] font-bold text-slate-400 uppercase tracking-widest">
              <span>Completeness</span>
              <span className="text-primary font-black">{completeness}%</span>
            </div>
            
            <div className="w-full h-2.5 bg-slate-100 dark:bg-slate-850 rounded-full overflow-hidden">
              <div className="h-full bg-primary rounded-full transition-all duration-350" style={{ width: `${completeness}%` }} />
            </div>

            <p className="text-slate-500 leading-relaxed font-medium">
              A complete profile feeds the recommendation algorithms, allowing you to discover institutions that match your target district location and branch requirements.
            </p>
          </div>
        </div>

      </div>

    </div>
  );
}
