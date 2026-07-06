"use client";

import Link from "next/link";
import { useState } from "react";
import { Bookmark, BookmarkCheck, Star, IndianRupee, Briefcase, Sparkles, MapPin } from "lucide-react";
import toast from "react-hot-toast";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";

interface CollegeCardProps {
  id: string;
  name: string;
  image: string;
  rating: number;
  fees: number;
  placementPercentage: number;
  aiScore: number;
  district: string;
  type: string;
  isSavedInit?: boolean;
  onRemoveFromSaved?: (id: string) => void;
}

export default function CollegeCard({
  id,
  name,
  image,
  rating,
  fees,
  placementPercentage,
  aiScore,
  district,
  type,
  isSavedInit = false,
  onRemoveFromSaved,
}: CollegeCardProps) {
  const { user } = useAuth();
  const router = useRouter();
  const [isSaved, setIsSaved] = useState(isSavedInit);
  const [saving, setSaving] = useState(false);

  const toggleSave = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    if (!user) {
      toast.error("Please login to save colleges!");
      router.push("/login");
      return;
    }

    setSaving(true);
    try {
      if (isSaved) {
        const res = await fetch(`/api/saved?collegeId=${id}`, { method: "DELETE" });
        if (res.ok) {
          setIsSaved(false);
          toast.success("College removed from saved list!");
          if (onRemoveFromSaved) onRemoveFromSaved(id);
        } else {
          toast.error("Failed to unsave college");
        }
      } else {
        const res = await fetch("/api/saved", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ collegeId: id }),
        });
        if (res.ok) {
          setIsSaved(true);
          toast.success("College saved to dashboard!");
        } else {
          const data = await res.json();
          toast.error(data.error || "Failed to save college");
        }
      }
    } catch (error) {
      toast.error("Failed to update saved status");
    } finally {
      setSaving(false);
    }
  };

  return (
    <motion.div
      whileHover={{ y: -6, scale: 1.01 }}
      transition={{ type: "spring", stiffness: 300, damping: 20 }}
      className="h-full"
    >
      <Link
        href={`/colleges/${id}`}
        className="group block h-full bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-850 rounded-2xl overflow-hidden shadow-sm hover:shadow-lg transition-all duration-300 flex flex-col relative"
      >
        {/* Banner Image / Highlights */}
        <div className="relative h-48 w-full overflow-hidden flex-shrink-0">
          <img
            src={image || "https://images.unsplash.com/photo-1562774053-701939374585?auto=format&fit=crop&q=80&w=800"}
            alt={name}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-900/70 via-slate-900/20 to-transparent" />

          {/* Type tag & Bookmark action */}
          <div className="absolute top-4 left-4 right-4 flex justify-between items-center z-10">
            <span className="bg-white/90 dark:bg-slate-950/80 text-slate-800 dark:text-slate-200 text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-lg backdrop-blur border border-slate-200/30 dark:border-slate-800 shadow-sm">
              {type}
            </span>
            <button
              onClick={toggleSave}
              disabled={saving}
              className="p-2 rounded-xl bg-white/90 hover:bg-white dark:bg-slate-950/80 dark:hover:bg-slate-900 text-slate-700 dark:text-slate-350 hover:text-accent-red dark:hover:text-accent-red backdrop-blur border border-slate-200/30 dark:border-slate-800 shadow-sm transition-all active:scale-95 cursor-pointer"
              title={isSaved ? "Remove from Saved" : "Save College"}
            >
              {isSaved ? (
                <BookmarkCheck className="w-4 h-4 text-accent-red fill-current" />
              ) : (
                <Bookmark className="w-4 h-4" />
              )}
            </button>
          </div>

          {/* Location Badge */}
          <div className="absolute bottom-4 left-4 flex items-center space-x-1.5 text-white z-10">
            <div className="w-5 h-5 rounded-md bg-white/20 backdrop-blur flex items-center justify-center">
              <MapPin className="w-3 h-3 text-white" />
            </div>
            <span className="text-xs font-bold tracking-tight text-white/90">{district}, Kerala</span>
          </div>
        </div>

        {/* Card Body */}
        <div className="p-5 flex-grow flex flex-col justify-between space-y-4">
          <div className="space-y-2">
            
            {/* Top row metrics */}
            <div className="flex justify-between items-center text-xs">
              <div className="flex items-center space-x-1.5 text-accent-yellow">
                <Star className="w-4 h-4 fill-current" />
                <span className="font-extrabold text-slate-800 dark:text-slate-200">{rating.toFixed(1)}</span>
                <span className="text-slate-400 font-medium">/ 5.0</span>
              </div>
              <div className="flex items-center space-x-1.5 text-accent-purple font-bold bg-accent-purple/5 px-2.5 py-1 rounded-lg border border-accent-purple/10">
                <Sparkles className="w-3 h-3" />
                <span>Fit Score: {aiScore}</span>
              </div>
            </div>

            {/* College Name */}
            <h3 className="font-bold text-base text-slate-800 dark:text-slate-100 group-hover:text-primary dark:group-hover:text-primary leading-snug line-clamp-2 transition-colors">
              {name}
            </h3>
          </div>

          {/* Features specs grids */}
          <div className="grid grid-cols-2 gap-4 py-3.5 border-t border-slate-100 dark:border-slate-900 text-xs">
            
            {/* Fees */}
            <div className="flex items-center space-x-2 text-slate-650 dark:text-slate-400">
              <div className="w-7 h-7 bg-primary/10 text-primary border border-primary/20 rounded-lg flex items-center justify-center">
                <IndianRupee className="w-3.5 h-3.5" />
              </div>
              <div>
                <p className="text-[9px] uppercase tracking-wider text-slate-400 font-bold leading-none">Annual Fees</p>
                <p className="font-extrabold text-slate-700 dark:text-slate-200 mt-1">
                  ₹{fees >= 100000 ? `${(fees / 100000).toFixed(2)}L` : `${(fees / 1000).toFixed(0)}k`}
                </p>
              </div>
            </div>

            {/* Placements */}
            <div className="flex items-center space-x-2 text-slate-650 dark:text-slate-400">
              <div className="w-7 h-7 bg-accent-green/10 text-accent-green border border-accent-green/20 rounded-lg flex items-center justify-center">
                <Briefcase className="w-3.5 h-3.5" />
              </div>
              <div>
                <p className="text-[9px] uppercase tracking-wider text-slate-400 font-bold leading-none">Placements</p>
                <p className="font-extrabold text-slate-700 dark:text-slate-200 mt-1">{placementPercentage}%</p>
              </div>
            </div>

          </div>

          {/* Explore action */}
          <div className="pt-1.5 border-t border-slate-100 dark:border-slate-900 flex justify-between items-center text-[10px] text-primary dark:text-primary font-bold uppercase tracking-widest group-hover:translate-x-1 transition-transform">
            <span>Explore Campus</span>
            <span>→</span>
          </div>

        </div>
      </Link>
    </motion.div>
  );
}
