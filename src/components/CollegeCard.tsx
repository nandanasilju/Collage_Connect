"use client";

import Link from "next/link";
import { useState } from "react";
import { Bookmark, BookmarkCheck, Star, IndianRupee, Briefcase, ShieldAlert, Sparkles, MapPin } from "lucide-react";
import toast from "react-hot-toast";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";

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
  onRemoveFromSaved?: (id: string) => void; // Optional callback for updating dashboard list
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
    <Link href={`/colleges/${id}`} className="group block">
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl overflow-hidden shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 flex flex-col h-full relative">
        
        {/* Badges / Top Stats */}
        <div className="relative h-48 w-full overflow-hidden">
          <img
            src={image || "https://images.unsplash.com/photo-1562774053-701939374585?auto=format&fit=crop&q=80&w=800"}
            alt={name}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-900/60 to-transparent" />
          
          {/* Top Row Badges */}
          <div className="absolute top-3 left-3 right-3 flex justify-between items-center">
            <span className="bg-white/95 dark:bg-slate-950/90 text-slate-800 dark:text-slate-100 text-xs font-semibold px-2.5 py-1 rounded-md backdrop-blur shadow-sm">
              {type}
            </span>
            <button
              onClick={toggleSave}
              disabled={saving}
              className="p-2 rounded-lg bg-white/95 hover:bg-white dark:bg-slate-950/95 dark:hover:bg-slate-900 text-slate-700 dark:text-slate-300 hover:text-blue-600 dark:hover:text-blue-400 backdrop-blur shadow-sm transition-all active:scale-95"
              title={isSaved ? "Remove from Saved" : "Save College"}
            >
              {isSaved ? (
                <BookmarkCheck className="w-5 h-5 text-blue-600 dark:text-blue-400 fill-current animate-pulse" />
              ) : (
                <Bookmark className="w-5 h-5" />
              )}
            </button>
          </div>

          {/* Bottom Overlay Label */}
          <div className="absolute bottom-3 left-3 flex items-center space-x-1.5 text-white">
            <MapPin className="w-4 h-4 text-blue-400" />
            <span className="text-xs font-medium">{district}, Kerala</span>
          </div>
        </div>

        {/* Card Body */}
        <div className="p-5 flex-grow flex flex-col justify-between">
          <div className="space-y-2">
            
            {/* Rating / Score Row */}
            <div className="flex justify-between items-center text-sm">
              <div className="flex items-center space-x-1 text-amber-500">
                <Star className="w-4 h-4 fill-current" />
                <span className="font-bold text-slate-800 dark:text-slate-200">{rating}</span>
                <span className="text-slate-400 text-xs">/ 5</span>
              </div>
              <div className="flex items-center space-x-1 text-indigo-600 dark:text-indigo-400 font-semibold bg-indigo-50 dark:bg-indigo-950/50 px-2 py-0.5 rounded text-xs border border-indigo-100 dark:border-indigo-900/30">
                <Sparkles className="w-3 h-3 text-indigo-500" />
                <span>AI Score: {aiScore}</span>
              </div>
            </div>

            {/* Title */}
            <h3 className="font-bold text-lg text-slate-800 dark:text-slate-100 group-hover:text-blue-600 dark:group-hover:text-blue-400 line-clamp-1 transition-colors">
              {name}
            </h3>
          </div>

          {/* Grid Stats */}
          <div className="grid grid-cols-2 gap-4 py-4 border-t border-slate-100 dark:border-slate-800 mt-4 text-sm">
            <div className="flex items-center space-x-2 text-slate-600 dark:text-slate-400">
              <IndianRupee className="w-4.5 h-4.5 text-blue-500 flex-shrink-0" />
              <div>
                <p className="text-[10px] uppercase tracking-wider text-slate-400 font-semibold leading-none">Fees</p>
                <p className="font-bold text-slate-700 dark:text-slate-200 mt-0.5">
                  ₹{fees >= 1000 ? `${(fees / 1000).toFixed(0)}k` : fees}/yr
                </p>
              </div>
            </div>
            <div className="flex items-center space-x-2 text-slate-600 dark:text-slate-400">
              <Briefcase className="w-4.5 h-4.5 text-blue-500 flex-shrink-0" />
              <div>
                <p className="text-[10px] uppercase tracking-wider text-slate-400 font-semibold leading-none">Placements</p>
                <p className="font-bold text-slate-700 dark:text-slate-200 mt-0.5">{placementPercentage}%</p>
              </div>
            </div>
          </div>

          {/* Footer Action */}
          <div className="pt-2 flex justify-between items-center text-xs text-blue-600 dark:text-blue-400 font-semibold group-hover:translate-x-1.5 transition-transform duration-300">
            <span>View details & reviews</span>
            <span>→</span>
          </div>

        </div>

      </div>
    </Link>
  );
}
