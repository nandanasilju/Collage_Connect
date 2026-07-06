"use client";

import { useEffect, useState, use } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { motion, AnimatePresence } from "framer-motion";
import {
  Star,
  Sparkles,
  IndianRupee,
  Briefcase,
  ExternalLink,
  MapPin,
  CheckCircle2,
  Trash2,
  Edit2,
  ThumbsUp,
  Bookmark,
  BookmarkCheck,
  Send,
  Loader2,
  Bus,
  Train,
  Plane,
  Navigation,
  Check,
  Info,
  Layers,
  Map,
  MessageSquare,
} from "lucide-react";
import toast from "react-hot-toast";

interface DetailPageProps {
  params: Promise<{ id: string }>;
}

type Tab = "overview" | "courses" | "map" | "reviews";

export default function CollegeDetailPage({ params }: DetailPageProps) {
  const resolvedParams = use(params);
  const { id } = resolvedParams;
  const router = useRouter();
  const { user } = useAuth();

  const [activeTab, setActiveTab] = useState<Tab>("overview");
  const [college, setCollege] = useState<any>(null);
  const [summary, setSummary] = useState("");
  const [loading, setLoading] = useState(true);
  const [summaryLoading, setSummaryLoading] = useState(true);
  const [isSaved, setIsSaved] = useState(false);

  // Review states
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState("");
  const [submittingReview, setSubmittingReview] = useState(false);
  const [editingReviewId, setEditingReviewId] = useState<string | null>(null);
  const [editComment, setEditComment] = useState("");
  const [editRating, setEditRating] = useState(5);

  useEffect(() => {
    const fetchCollegeDetails = async () => {
      try {
        const res = await fetch(`/api/colleges/${id}`);
        if (res.ok) {
          const data = await res.json();
          setCollege(data);
          
          if (user) {
            const savedRes = await fetch("/api/saved");
            if (savedRes.ok) {
              const savedList = await savedRes.json();
              setIsSaved(savedList.some((s: any) => s.collegeId === id));
            }
          }
        } else {
          toast.error("College not found");
          router.push("/colleges");
        }
      } catch (err) {
        toast.error("Failed to load details");
      } finally {
        setLoading(false);
      }
    };

    fetchCollegeDetails();
  }, [id, user, router]);

  // Load AI Summary
  useEffect(() => {
    if (!loading && college) {
      const fetchSummary = async () => {
        try {
          const res = await fetch(`/api/colleges/${id}/summary`);
          if (res.ok) {
            const data = await res.json();
            setSummary(data.summary);
          }
        } catch (err) {
          console.error("Failed to fetch AI summary:", err);
        } finally {
          setSummaryLoading(false);
        }
      };
      fetchSummary();
    }
  }, [loading, college, id]);

  const handleToggleSave = async () => {
    if (!user) {
      toast.error("Please login to save colleges!");
      router.push("/login");
      return;
    }

    try {
      if (isSaved) {
        const res = await fetch(`/api/saved?collegeId=${id}`, { method: "DELETE" });
        if (res.ok) {
          setIsSaved(false);
          toast.success("College removed from saved list!");
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
        }
      }
    } catch (error) {
      toast.error("Failed to update saved status");
    }
  };

  const handleApply = () => {
    toast.success(`Application portal opened for ${college.name}! (Simulated)`);
  };

  const handleCompare = () => {
    let compareIds = JSON.parse(localStorage.getItem("compare_ids") || "[]");
    if (compareIds.includes(id)) {
      toast.success("Already in comparison list! Redirecting...");
    } else {
      if (compareIds.length >= 4) {
        compareIds = compareIds.slice(1);
      }
      compareIds.push(id);
      localStorage.setItem("compare_ids", JSON.stringify(compareIds));
      toast.success("Added to comparison! Redirecting to Compare Page...");
    }
    router.push("/compare");
  };

  const handleAddReview = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) {
      toast.error("Please login to submit reviews!");
      router.push("/login");
      return;
    }

    if (!comment.trim()) {
      toast.error("Review comment cannot be empty");
      return;
    }

    setSubmittingReview(true);
    try {
      const res = await fetch("/api/reviews", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ rating, comment, collegeId: id }),
      });

      if (res.ok) {
        const newReview = await res.json();
        newReview.user = { id: user.id, name: user.name, profileImage: null };
        newReview.likes = [];
        
        setCollege((prev: any) => ({
          ...prev,
          reviews: [newReview, ...prev.reviews],
        }));
        setComment("");
        setRating(5);
        toast.success("Review submitted! Approved reviews appear publicly.");
      } else {
        const data = await res.json();
        toast.error(data.error || "Failed to submit review");
      }
    } catch (error) {
      toast.error("An error occurred");
    } finally {
      setSubmittingReview(false);
    }
  };

  const handleDeleteReview = async (reviewId: string) => {
    if (!confirm("Are you sure you want to delete this review?")) return;

    try {
      const res = await fetch(`/api/reviews?reviewId=${reviewId}`, { method: "DELETE" });
      if (res.ok) {
        setCollege((prev: any) => ({
          ...prev,
          reviews: prev.reviews.filter((r: any) => r.id !== reviewId),
        }));
        toast.success("Review deleted successfully");
      } else {
        toast.error("Failed to delete review");
      }
    } catch (error) {
      toast.error("An error occurred");
    }
  };

  const handleLikeReview = async (reviewId: string) => {
    if (!user) {
      toast.error("Please login to like reviews!");
      return;
    }

    try {
      const res = await fetch("/api/reviews/like", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ reviewId }),
      });

      if (res.ok) {
        const data = await res.json();
        setCollege((prev: any) => {
          const updatedReviews = prev.reviews.map((r: any) => {
            if (r.id === reviewId) {
              const updatedLikes = data.liked
                ? [...r.likes, { userId: user.id, reviewId }]
                : r.likes.filter((like: any) => like.userId !== user.id);
              return { ...r, likes: updatedLikes };
            }
            return r;
          });
          return { ...prev, reviews: updatedReviews };
        });
      }
    } catch (error) {
      console.error("Like toggle failed:", error);
    }
  };

  const handleStartEditReview = (r: any) => {
    setEditingReviewId(r.id);
    setEditComment(r.comment);
    setEditRating(r.rating);
  };

  const handleUpdateReview = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editComment.trim()) return;

    try {
      setCollege((prev: any) => {
        const updatedReviews = prev.reviews.map((r: any) => {
          if (r.id === editingReviewId) {
            return { ...r, comment: editComment, rating: editRating };
          }
          return r;
        });
        return { ...prev, reviews: updatedReviews };
      });
      setEditingReviewId(null);
      toast.success("Review updated successfully!");
    } catch (error) {
      toast.error("Failed to edit review");
    }
  };

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-20 flex flex-col items-center justify-center space-y-4">
        <Loader2 className="w-12 h-12 text-primary animate-spin" />
        <p className="font-semibold text-slate-450">Retrieving campus profile details...</p>
      </div>
    );
  }

  const mapEmbedUrl = `https://www.openstreetmap.org/export/embed.html?bbox=${college.longitude - 0.008}%2C${college.latitude - 0.008}%2C${college.longitude + 0.008}%2C${college.latitude + 0.008}&layer=mapnik&marker=${college.latitude}%2C${college.longitude}`;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      
      {/* 1. Header Hero Banner */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-900 rounded-3xl overflow-hidden shadow-sm relative transition-colors duration-300">
        <div className="relative h-80 sm:h-96 w-full">
          <img
            src={college.image || "https://images.unsplash.com/photo-1562774053-701939374585?auto=format&fit=crop&q=80&w=800"}
            alt={college.name}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/20 to-transparent" />
          
          <div className="absolute bottom-6 left-6 right-6 flex flex-col md:flex-row md:justify-between md:items-end gap-6 text-white">
            <div className="space-y-2">
              <span className="bg-primary text-white text-[10px] font-bold uppercase tracking-wider px-3 py-1.5 rounded-lg border border-primary/20">
                {college.type} {college.autonomous && "• Autonomous"}
              </span>
              <h1 className="text-2xl sm:text-4.5xl font-black tracking-tight">{college.name}</h1>
              <div className="flex items-center space-x-2 text-xs text-slate-300 font-medium">
                <MapPin className="w-4 h-4 text-primary" />
                <span>{college.location}, {college.district}, Kerala</span>
              </div>
            </div>

            <div className="flex flex-wrap gap-2 text-xs font-bold uppercase tracking-wider">
              <button
                onClick={handleToggleSave}
                className="px-4 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 border border-white/20 text-white backdrop-blur flex items-center transition-all cursor-pointer"
              >
                {isSaved ? (
                  <>
                    <BookmarkCheck className="w-4.5 h-4.5 mr-1.5 text-accent-red fill-current" />
                    Saved
                  </>
                ) : (
                  <>
                    <Bookmark className="w-4.5 h-4.5 mr-1.5" />
                    Save
                  </>
                )}
              </button>
              <button
                onClick={handleCompare}
                className="px-4 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 border border-white/20 text-white backdrop-blur flex items-center transition-all cursor-pointer"
              >
                Compare
              </button>
              <button
                onClick={handleApply}
                className="px-5 py-2.5 rounded-xl bg-primary hover:bg-primary-hover text-white shadow-lg shadow-primary/20 active:scale-95 transition-all cursor-pointer"
              >
                Apply Now
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* 2. Custom Tabs Navigation */}
      <div className="flex border-b border-slate-200 dark:border-slate-850 gap-4 overflow-x-auto no-scrollbar">
        {[
          { key: "overview", label: "Overview", icon: Info },
          { key: "courses", label: "Academics", icon: Layers },
          { key: "map", label: "Facilities & Map", icon: Map },
          { key: "reviews", label: "Student Reviews", icon: MessageSquare },
        ].map((tab) => {
          const Icon = tab.icon;
          return (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key as Tab)}
              className={`py-3 px-1 border-b-2 font-bold text-xs uppercase tracking-wider flex items-center transition-all whitespace-nowrap cursor-pointer ${
                activeTab === tab.key
                  ? "border-primary text-primary"
                  : "border-transparent text-slate-450 hover:text-slate-700"
              }`}
            >
              <Icon className="w-4 h-4 mr-2" />
              {tab.label}
            </button>
          );
        })}
      </div>

      {/* 3. Dynamic Tab Sections */}
      <AnimatePresence mode="wait">
        <motion.div
          key={activeTab}
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -15 }}
          transition={{ duration: 0.25 }}
        >
          {/* TAB 1: OVERVIEW */}
          {activeTab === "overview" && (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
              {/* Left Side: Summary & Description */}
              <div className="lg:col-span-2 space-y-8">
                
                {/* AI Summary Block */}
                <div className="bg-gradient-to-br from-indigo-50 to-blue-50 dark:from-indigo-950/20 dark:to-blue-950/20 border border-indigo-100 dark:border-indigo-900/30 p-6 rounded-3xl space-y-4 shadow-sm relative overflow-hidden">
                  <div className="absolute top-0 right-0 w-24 h-24 bg-primary/10 rounded-full blur-2xl -z-10" />
                  <h3 className="font-extrabold text-slate-800 dark:text-white flex items-center text-sm uppercase tracking-wider">
                    <Sparkles className="w-5 h-5 mr-2 text-accent-purple animate-pulse" />
                    AI Institutional Profile
                  </h3>
                  {summaryLoading ? (
                    <div className="space-y-2.5 animate-pulse pt-2">
                      <div className="h-4 bg-slate-200 dark:bg-slate-850 rounded w-full" />
                      <div className="h-4 bg-slate-200 dark:bg-slate-850 rounded w-full" />
                      <div className="h-4 bg-slate-200 dark:bg-slate-850 rounded w-4/5" />
                    </div>
                  ) : (
                    <p className="text-slate-650 dark:text-slate-350 text-xs leading-relaxed whitespace-pre-line font-medium">
                      {summary}
                    </p>
                  )}
                </div>

                {/* About College */}
                <div className="space-y-3">
                  <h3 className="font-bold text-slate-800 dark:text-white text-base">About College</h3>
                  <p className="text-slate-600 dark:text-slate-400 text-xs leading-relaxed font-medium">
                    {college.description}
                  </p>
                </div>

                {/* Image Gallery */}
                {college.images?.length > 0 && (
                  <div className="space-y-4">
                    <h3 className="font-bold text-slate-800 dark:text-white text-base">Campus Gallery</h3>
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                      {college.images.map((img: any) => (
                        <div key={img.id} className="relative h-32 rounded-2xl overflow-hidden shadow-sm group">
                          <img
                            src={img.url}
                            alt="Gallery"
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                          />
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Right Side: Metrics Sidebar */}
              <div className="space-y-6">
                <div className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-900 p-6 rounded-3xl shadow-sm space-y-6">
                  <h3 className="font-extrabold text-slate-800 dark:text-white text-sm border-b border-slate-100 dark:border-slate-850 pb-3">
                    Quick Facts
                  </h3>

                  {/* AI score badge */}
                  <div className="bg-primary/5 border border-primary/10 p-4 rounded-xl flex justify-between items-center text-xs">
                    <span className="font-bold text-primary">AI Recommendation Rank</span>
                    <span className="font-black text-primary text-sm">{college.aiScore} / 100</span>
                  </div>

                  <div className="space-y-4 text-xs font-semibold text-slate-600 dark:text-slate-400">
                    <div className="flex justify-between">
                      <span className="text-slate-450 uppercase tracking-wide">Tuition Fees</span>
                      <span className="font-extrabold text-slate-800 dark:text-white">₹{college.fees?.toLocaleString()} / yr</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-450 uppercase tracking-wide">Placement %</span>
                      <span className="font-extrabold text-accent-green">{college.placementPercentage}%</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-450 uppercase tracking-wide">Avg Package</span>
                      <span className="font-extrabold text-slate-800 dark:text-white">{college.averagePackage} LPA</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-450 uppercase tracking-wide">Highest Package</span>
                      <span className="font-extrabold text-slate-800 dark:text-white">{college.highestPackage} LPA</span>
                    </div>
                  </div>

                  <a
                    href={college.website}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full py-2.5 border border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-850 text-slate-700 dark:text-slate-350 text-xs font-bold rounded-xl flex items-center justify-center transition-colors cursor-pointer"
                  >
                    Official Website
                    <ExternalLink className="w-3.5 h-3.5 ml-2" />
                  </a>
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: COURSES */}
          {activeTab === "courses" && (
            <div className="space-y-6">
              <h3 className="font-bold text-slate-855 dark:text-white text-base">Academic Offerings</h3>
              <div className="border border-slate-200/80 dark:border-slate-900 rounded-2xl overflow-hidden bg-white dark:bg-slate-900 shadow-sm transition-colors">
                <table className="w-full text-left text-xs font-semibold">
                  <thead className="bg-slate-50 dark:bg-slate-850 border-b border-slate-200/85 dark:border-slate-855 text-[10px] font-bold text-slate-500 uppercase tracking-wider">
                    <tr>
                      <th className="px-6 py-3">Discipline / Branch Name</th>
                      <th className="px-6 py-3">Duration</th>
                      <th className="px-6 py-3">Annual Intake Seats</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-150 dark:divide-slate-855 text-slate-700 dark:text-slate-300">
                    {college.courses?.map((c: any) => (
                      <tr key={c.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/40">
                        <td className="px-6 py-4 font-bold">{c.name}</td>
                        <td className="px-6 py-4 text-slate-450">{c.duration}</td>
                        <td className="px-6 py-4 font-extrabold">{c.intake} seats</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* TAB 3: INFRASTRUCTURE & MAP */}
          {activeTab === "map" && (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
              
              {/* Facilities check */}
              <div className="lg:col-span-2 space-y-6">
                <div className="space-y-4">
                  <h3 className="font-bold text-slate-800 dark:text-white text-base">Facilities Checklist</h3>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                    {college.facilities?.map((f: any) => (
                      <div
                        key={f.id}
                        className="bg-white dark:bg-slate-900 border border-slate-200/85 dark:border-slate-855 px-4 py-3 rounded-2xl flex items-center space-x-2.5 text-xs text-slate-700 dark:text-slate-300 shadow-sm"
                      >
                        <Check className="w-4 h-4 text-accent-green" />
                        <span className="font-bold">{f.name}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 pt-2">
                  <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-855 shadow-sm text-xs font-semibold space-y-2">
                    <p className="text-slate-450 uppercase tracking-wider">Hostel Accommodations</p>
                    <p className="text-sm font-bold text-slate-800 dark:text-white">
                      {college.hostel ? "Hostel Facilities Available (Separate boys & girls)" : "No campus hostels"}
                    </p>
                  </div>
                  <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-855 shadow-sm text-xs font-semibold space-y-2">
                    <p className="text-slate-450 uppercase tracking-wider">Bus Transportation</p>
                    <p className="text-sm font-bold text-slate-800 dark:text-white">
                      {college.transport ? "Campus Transportation Active" : "No official college bus lines"}
                    </p>
                  </div>
                </div>
              </div>

              {/* Map Column */}
              <div className="space-y-6">
                <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-900 p-6 rounded-3xl shadow-sm space-y-4">
                  <h3 className="font-extrabold text-slate-850 dark:text-white text-sm">Location Coordinates</h3>
                  
                  {/* Map box */}
                  <div className="h-44 rounded-2xl overflow-hidden shadow-inner border dark:border-slate-850">
                    <iframe
                      title="College Location Map"
                      src={mapEmbedUrl}
                      className="w-full h-full border-0"
                    />
                  </div>

                  <a
                    href={`https://www.google.com/maps/dir/?api=1&destination=${college.latitude},${college.longitude}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full py-2.5 bg-primary hover:bg-primary-hover text-white text-xs font-bold rounded-xl flex items-center justify-center shadow-md shadow-primary/10 transition-colors cursor-pointer uppercase tracking-wider"
                  >
                    <Navigation className="w-3.5 h-3.5 mr-2" />
                    Driving Directions
                  </a>

                  {/* Transport Hubs */}
                  <div className="space-y-4 pt-4 border-t border-slate-100 dark:border-slate-850 text-xs font-semibold">
                    <div className="flex items-start space-x-2">
                      <Bus className="w-4 h-4 text-primary flex-shrink-0 mt-0.5" />
                      <div>
                        <p className="text-[10px] text-slate-400 uppercase tracking-wider">Bus Terminal</p>
                        <p className="text-slate-700 dark:text-slate-350 mt-0.5">{college.nearbyBusStand || "Not specified"}</p>
                      </div>
                    </div>
                    <div className="flex items-start space-x-2">
                      <Train className="w-4 h-4 text-primary flex-shrink-0 mt-0.5" />
                      <div>
                        <p className="text-[10px] text-slate-400 uppercase tracking-wider">Railway Station</p>
                        <p className="text-slate-700 dark:text-slate-350 mt-0.5">{college.nearbyRailway || "Not specified"}</p>
                      </div>
                    </div>
                    <div className="flex items-start space-x-2">
                      <Plane className="w-4 h-4 text-primary flex-shrink-0 mt-0.5" />
                      <div>
                        <p className="text-[10px] text-slate-400 uppercase tracking-wider">Airport Hub</p>
                        <p className="text-slate-700 dark:text-slate-350 mt-0.5">{college.nearbyAirport || "Not specified"}</p>
                      </div>
                    </div>
                  </div>

                </div>
              </div>

            </div>
          )}

          {/* TAB 4: REVIEWS */}
          {activeTab === "reviews" && (
            <section className="space-y-6">
              <h3 className="font-bold text-slate-850 dark:text-white text-base">
                Student Review Board ({college.reviews?.length || 0})
              </h3>

              {/* Review submit form */}
              <div className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-900 p-6 rounded-3xl shadow-sm">
                <h4 className="font-bold text-xs uppercase tracking-wider text-slate-400 mb-4">Post a Review</h4>
                
                <form onSubmit={handleAddReview} className="space-y-4">
                  <div className="flex items-center space-x-3 text-xs font-semibold">
                    <span className="text-slate-450">Review Rating:</span>
                    <div className="flex space-x-0.5">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <button
                          key={star}
                          type="button"
                          onClick={() => setRating(star)}
                          className="p-1 rounded text-accent-yellow hover:scale-110 active:scale-95 transition-all cursor-pointer"
                        >
                          <Star className={`w-5 h-5 ${star <= rating ? "fill-current" : ""}`} />
                        </button>
                      ))}
                    </div>
                  </div>

                  <textarea
                    value={comment}
                    onChange={(e) => setComment(e.target.value)}
                    placeholder="Describe placement scopes, exams, hostels, library, and campus transport network..."
                    rows={3}
                    className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-850 border border-slate-205 dark:border-slate-800 rounded-2xl text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-primary text-slate-900 dark:text-white placeholder-slate-400 transition-all resize-none"
                  />

                  <div className="flex justify-between items-center">
                    <p className="text-[10px] text-slate-400 font-semibold uppercase tracking-wider">
                      Requires admin review before publishing.
                    </p>
                    <button
                      type="submit"
                      disabled={submittingReview}
                      className="px-5 py-2.5 bg-primary hover:bg-primary-hover disabled:bg-primary/50 text-white font-bold text-xs uppercase tracking-widest rounded-xl shadow-sm flex items-center justify-center transition-colors cursor-pointer"
                    >
                      {submittingReview ? (
                        <>
                          <Loader2 className="w-3.5 h-3.5 mr-1.5 animate-spin" />
                          Publishing...
                        </>
                      ) : (
                        <>
                          <Send className="w-3.5 h-3.5 mr-1.5" />
                          Publish Review
                        </>
                      )}
                    </button>
                  </div>
                </form>
              </div>

              {/* Reviews List */}
              <div className="space-y-4">
                {college.reviews?.length > 0 ? (
                  college.reviews.map((r: any) => {
                    const userHasLiked = r.likes?.some((l: any) => l.userId === user?.id);
                    const isAuthor = user?.id === r.userId;
                    const isAdmin = user?.role === "ADMIN";

                    return (
                      <div
                        key={r.id}
                        className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-900 p-6 rounded-2xl shadow-sm space-y-4 text-xs font-semibold text-slate-650 dark:text-slate-350 transition-colors"
                      >
                        {/* Header Details */}
                        <div className="flex justify-between items-start">
                          <div className="flex items-center space-x-3">
                            <div className="w-9 h-9 rounded-xl bg-slate-100 dark:bg-slate-850 flex items-center justify-center font-extrabold text-xs text-slate-500 uppercase border dark:border-slate-800">
                              {r.user.name.slice(0, 2)}
                            </div>
                            <div>
                              <p className="font-bold text-slate-800 dark:text-white">{r.user.name}</p>
                              <p className="text-[10px] text-slate-400">
                                {new Date(r.createdAt).toLocaleDateString()}
                              </p>
                            </div>
                          </div>

                          {/* Ratings Display */}
                          <div className="flex items-center space-x-0.5 text-accent-yellow">
                            {Array.from({ length: r.rating }).map((_, idx) => (
                              <Star key={idx} className="w-3.5 h-3.5 fill-current" />
                            ))}
                          </div>
                        </div>

                        {/* Comment view */}
                        {editingReviewId === r.id ? (
                          <form onSubmit={handleUpdateReview} className="space-y-3">
                            <div className="flex space-x-1 mb-2">
                              {[1, 2, 3, 4, 5].map((s) => (
                                <button
                                  key={s}
                                  type="button"
                                  onClick={() => setEditRating(s)}
                                  className="text-accent-yellow cursor-pointer"
                                >
                                  <Star className={`w-5 h-5 ${s <= editRating ? "fill-current" : ""}`} />
                                </button>
                              ))}
                            </div>
                            <textarea
                              value={editComment}
                              onChange={(e) => setEditComment(e.target.value)}
                              className="w-full p-3 bg-slate-50 dark:bg-slate-850 border rounded-xl text-xs"
                            />
                            <div className="flex space-x-2">
                              <button type="submit" className="px-3.5 py-1.5 bg-accent-green hover:bg-emerald-600 text-white rounded-lg cursor-pointer">Save</button>
                              <button type="button" onClick={() => setEditingReviewId(null)} className="px-3.5 py-1.5 bg-slate-400 hover:bg-slate-500 text-white rounded-lg cursor-pointer">Cancel</button>
                            </div>
                          </form>
                        ) : (
                          <p className="text-xs text-slate-600 dark:text-slate-350 leading-relaxed font-medium">
                            {r.comment}
                          </p>
                        )}

                        {/* Actions block */}
                        <div className="flex items-center justify-between pt-2 border-t border-slate-100 dark:border-slate-850">
                          <button
                            onClick={() => handleLikeReview(r.id)}
                            className={`flex items-center space-x-1.5 font-bold transition-colors cursor-pointer uppercase text-[10px] tracking-wider ${
                              userHasLiked
                                ? "text-primary"
                                : "text-slate-400 hover:text-slate-600"
                            }`}
                          >
                            <ThumbsUp className={`w-3.5 h-3.5 ${userHasLiked ? "fill-current" : ""}`} />
                            <span>Like{r.likes?.length > 0 && ` (${r.likes.length})`}</span>
                          </button>

                          {(isAuthor || isAdmin) && (
                            <div className="flex items-center space-x-4 uppercase text-[10px] tracking-wider">
                              {isAuthor && (
                                <button
                                  onClick={() => handleStartEditReview(r)}
                                  className="flex items-center text-slate-400 hover:text-slate-650 cursor-pointer"
                                >
                                  <Edit2 className="w-3.5 h-3.5 mr-1" />
                                  Edit
                                </button>
                              )}
                              <button
                                onClick={() => handleDeleteReview(r.id)}
                                className="flex items-center text-accent-red hover:text-rose-600 cursor-pointer"
                              >
                                <Trash2 className="w-3.5 h-3.5 mr-1" />
                                Delete
                              </button>
                            </div>
                          )}
                        </div>
                      </div>
                    );
                  })
                ) : (
                  <div className="bg-white dark:bg-slate-900 border border-slate-205 dark:border-slate-850 p-8 rounded-2xl text-center text-xs text-slate-400 italic">
                    No reviews written yet. Be the first to share your campus experience!
                  </div>
                )}
              </div>
            </section>
          )}
        </motion.div>
      </AnimatePresence>

    </div>
  );
}
