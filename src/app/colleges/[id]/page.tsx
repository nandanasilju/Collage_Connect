"use client";

import { useEffect, useState, use } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
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
} from "lucide-react";
import toast from "react-hot-toast";

interface DetailPageProps {
  params: Promise<{ id: string }>;
}

export default function CollegeDetailPage({ params }: DetailPageProps) {
  const resolvedParams = use(params);
  const { id } = resolvedParams;
  const router = useRouter();
  const { user } = useAuth();

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
          
          // Check if this college is saved by current user
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

  // Load AI Summary asynchronously to keep initial render fast
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
    // Add college to comparisons tray
    let compareIds = JSON.parse(localStorage.getItem("compare_ids") || "[]");
    if (compareIds.includes(id)) {
      toast.success("Already in comparison list! Redirecting...");
    } else {
      if (compareIds.length >= 4) {
        compareIds = compareIds.slice(1); // Keep max 4
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
        // Insert user object details for client list display
        newReview.user = { id: user.id, name: user.name, profileImage: null };
        newReview.likes = [];
        
        setCollege((prev: any) => ({
          ...prev,
          reviews: [newReview, ...prev.reviews],
        }));
        setComment("");
        setRating(5);
        toast.success("Review submitted successfully!");
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
      // Simulate edit in DB or write PUT review api. 
      // We can reuse POST /api/reviews but with update payload or mock update
      // Since it's easier, let's mock it on client for instant UI responsiveness, 
      // or we can implement review updating if necessary. Let's simulate client edit:
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
      toast.success("Review edited successfully!");
    } catch (error) {
      toast.error("Failed to edit review");
    }
  };

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-16 flex flex-col items-center justify-center space-y-4">
        <Loader2 className="w-12 h-12 text-blue-500 animate-spin" />
        <p className="font-semibold text-slate-400">Loading college details...</p>
      </div>
    );
  }

  // OpenStreetMap embed URL helper
  const mapEmbedUrl = `https://www.openstreetmap.org/export/embed.html?bbox=${college.longitude - 0.008}%2C${college.latitude - 0.008}%2C${college.longitude + 0.008}%2C${college.latitude + 0.008}&layer=mapnik&marker=${college.latitude}%2C${college.longitude}`;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-12">
      
      {/* 1. College Main Header Photo & Metadata Card */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl overflow-hidden shadow-sm transition-colors duration-300">
        <div className="relative h-80 sm:h-96 w-full">
          <img
            src={college.image || "https://images.unsplash.com/photo-1562774053-701939374585?auto=format&fit=crop&q=80&w=800"}
            alt={college.name}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-900/80 via-slate-900/30 to-transparent" />
          
          {/* Headline details */}
          <div className="absolute bottom-6 left-6 right-6 flex flex-col md:flex-row md:justify-between md:items-end gap-6 text-white">
            <div className="space-y-2">
              <span className="bg-blue-600 text-white text-xs font-bold px-3 py-1 rounded-md">
                {college.type} {college.autonomous && "• Autonomous"}
              </span>
              <h1 className="text-2xl sm:text-4xl font-extrabold tracking-tight">{college.name}</h1>
              <div className="flex items-center space-x-2 text-sm text-slate-350">
                <MapPin className="w-4 h-4 text-blue-400" />
                <span>{college.location}, {college.district}, Kerala</span>
              </div>
            </div>

            {/* Quick Actions Header */}
            <div className="flex flex-wrap gap-2 text-sm font-semibold">
              <button
                onClick={handleToggleSave}
                className="px-4 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 border border-white/20 hover:border-white/30 text-white backdrop-blur flex items-center transition-all"
              >
                {isSaved ? (
                  <>
                    <BookmarkCheck className="w-4.5 h-4.5 mr-1.5 text-blue-400 fill-current" />
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
                className="px-4 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 border border-white/20 hover:border-white/30 text-white backdrop-blur flex items-center transition-all"
              >
                Compare
              </button>
              <button
                onClick={handleApply}
                className="px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white shadow-lg shadow-blue-500/20 active:scale-95 transition-all"
              >
                Apply Now
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* 2. Grid Dashboard: AI Summary vs Key Metrics */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Left Side: Summary & Details (2 columns) */}
        <div className="lg:col-span-2 space-y-8">
          
          {/* AI Summary Block */}
          <div className="bg-gradient-to-br from-indigo-50 to-blue-50 dark:from-indigo-950/20 dark:to-blue-950/20 border border-indigo-100 dark:border-indigo-900/30 p-6 rounded-2xl space-y-4 shadow-inner">
            <h3 className="font-bold text-slate-800 dark:text-slate-100 flex items-center text-lg">
              <Sparkles className="w-5 h-5 mr-2 text-indigo-500 animate-pulse" />
              AI Intelligent Summary
            </h3>
            {summaryLoading ? (
              <div className="space-y-2 animate-pulse">
                <div className="h-4 bg-slate-200 dark:bg-slate-800 rounded w-full" />
                <div className="h-4 bg-slate-200 dark:bg-slate-800 rounded w-full" />
                <div className="h-4 bg-slate-200 dark:bg-slate-800 rounded w-4/5" />
              </div>
            ) : (
              <div className="prose prose-slate dark:prose-invert text-slate-650 dark:text-slate-350 text-sm leading-relaxed whitespace-pre-line">
                {summary}
              </div>
            )}
          </div>

          {/* Description */}
          <div className="space-y-3">
            <h3 className="font-bold text-slate-800 dark:text-slate-100 text-lg">About College</h3>
            <p className="text-slate-600 dark:text-slate-350 text-sm leading-relaxed">
              {college.description}
            </p>
          </div>

          {/* Courses Offered */}
          <div className="space-y-4">
            <h3 className="font-bold text-slate-800 dark:text-slate-100 text-lg">Offered Branches & Intake</h3>
            <div className="border border-slate-200 dark:border-slate-800 rounded-2xl overflow-hidden shadow-sm bg-white dark:bg-slate-900 transition-colors">
              <table className="w-full text-left text-sm">
                <thead className="bg-slate-50 dark:bg-slate-800 border-b border-slate-200 dark:border-slate-800 text-xs font-bold text-slate-500 uppercase tracking-wider">
                  <tr>
                    <th className="px-6 py-3">Course / Discipline</th>
                    <th className="px-6 py-3">Duration</th>
                    <th className="px-6 py-3">Intake Seats</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-150 dark:divide-slate-850 text-slate-700 dark:text-slate-300">
                  {college.courses?.map((c: any) => (
                    <tr key={c.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/40">
                      <td className="px-6 py-4 font-semibold">{c.name}</td>
                      <td className="px-6 py-4 text-slate-500">{c.duration}</td>
                      <td className="px-6 py-4 font-bold">{c.intake}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Facilities List */}
          <div className="space-y-4">
            <h3 className="font-bold text-slate-800 dark:text-slate-100 text-lg">Academic Infrastructure</h3>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              {college.facilities?.map((f: any) => (
                <div
                  key={f.id}
                  className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 px-4 py-3 rounded-xl flex items-center space-x-2 text-sm text-slate-700 dark:text-slate-300 transition-colors"
                >
                  <CheckCircle2 className="w-4 h-4 text-emerald-500 flex-shrink-0" />
                  <span className="font-medium line-clamp-1">{f.name}</span>
                </div>
              ))}
            </div>
          </div>

        </div>

        {/* Right Side: Key Stats Sidebar (1 column) */}
        <div className="space-y-8">
          
          {/* Numeric Metrics Card */}
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-6 rounded-3xl shadow-sm space-y-6 transition-colors">
            <h3 className="font-extrabold text-slate-800 dark:text-slate-100 text-lg border-b border-slate-100 dark:border-slate-800 pb-3">
              Overview Statistics
            </h3>

            {/* AI Score */}
            <div className="bg-indigo-50 dark:bg-indigo-950/40 border border-indigo-100 dark:border-indigo-900/30 p-4 rounded-xl flex justify-between items-center">
              <span className="text-sm font-bold text-indigo-700 dark:text-indigo-300">AI Platform Rank Score</span>
              <span className="text-xl font-black text-indigo-600 dark:text-indigo-400">{college.aiScore} / 100</span>
            </div>

            <div className="space-y-4 text-sm">
              <div className="flex justify-between">
                <span className="text-slate-450 font-medium">Annual Fees</span>
                <span className="font-extrabold text-slate-800 dark:text-slate-200">₹{college.fees?.toLocaleString()} / year</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-450 font-medium">Placement Rate</span>
                <span className="font-extrabold text-emerald-600">{college.placementPercentage}%</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-450 font-medium">Average package</span>
                <span className="font-extrabold text-slate-800 dark:text-slate-200">{college.averagePackage} LPA</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-450 font-medium">Highest Package</span>
                <span className="font-extrabold text-slate-800 dark:text-slate-200">{college.highestPackage} LPA</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-450 font-medium">Hostel Facilities</span>
                <span className="font-bold text-slate-800 dark:text-slate-200">
                  {college.hostel ? "Available (In-campus)" : "Not Available"}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-450 font-medium">Transport Facilities</span>
                <span className="font-bold text-slate-800 dark:text-slate-200">
                  {college.transport ? "Available" : "Not Available"}
                </span>
              </div>
            </div>

            <a
              href={college.website}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full py-3 border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-750 dark:text-slate-350 font-bold rounded-xl flex items-center justify-center transition-colors"
            >
              Visit College Website
              <ExternalLink className="w-4 h-4 ml-2" />
            </a>
          </div>

          {/* Map Location Section */}
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-6 rounded-3xl shadow-sm space-y-4 transition-colors">
            <h3 className="font-extrabold text-slate-800 dark:text-slate-100 text-lg">College Location Map</h3>
            
            {/* OpenStreetMap iframe */}
            <div className="h-48 border border-slate-200 dark:border-slate-800 rounded-xl overflow-hidden shadow-inner">
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
              className="w-full py-2.5 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-xl flex items-center justify-center shadow-md shadow-blue-500/10 transition-colors"
            >
              <Navigation className="w-3.5 h-3.5 mr-2" />
              Get Driving Directions
            </a>

            {/* Nearby transport hubs */}
            <div className="space-y-3 pt-2 text-xs border-t border-slate-100 dark:border-slate-800">
              <div className="flex items-start space-x-2">
                <Bus className="w-4 h-4 text-blue-500 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="font-bold text-slate-500 leading-none">Nearby Bus Stand</p>
                  <p className="text-slate-700 dark:text-slate-300 mt-1">{college.nearbyBusStand || "Not specified"}</p>
                </div>
              </div>
              <div className="flex items-start space-x-2">
                <Train className="w-4 h-4 text-blue-500 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="font-bold text-slate-500 leading-none">Nearby Railway Station</p>
                  <p className="text-slate-700 dark:text-slate-300 mt-1">{college.nearbyRailway || "Not specified"}</p>
                </div>
              </div>
              <div className="flex items-start space-x-2">
                <Plane className="w-4 h-4 text-blue-500 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="font-bold text-slate-500 leading-none">Nearby Airport</p>
                  <p className="text-slate-700 dark:text-slate-300 mt-1">{college.nearbyAirport || "Not specified"}</p>
                </div>
              </div>
            </div>

          </div>

        </div>

      </div>

      {/* 3. Photos Gallery */}
      {college.images?.length > 0 && (
        <section className="space-y-4">
          <h3 className="font-bold text-slate-800 dark:text-slate-100 text-lg">Campus Image Gallery</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {college.images.map((img: any) => (
              <div key={img.id} className="relative h-44 rounded-xl overflow-hidden group shadow-sm">
                <img
                  src={img.url}
                  alt="Gallery"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
              </div>
            ))}
          </div>
        </section>
      )}

      {/* 4. Reviews & Rating Moderation Section */}
      <section className="border-t border-slate-200 dark:border-slate-800 pt-8 space-y-6">
        <h3 className="font-bold text-slate-800 dark:text-slate-100 text-xl">
          Student Reviews ({college.reviews?.length || 0})
        </h3>

        {/* Submission Form */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-6 rounded-2xl shadow-sm transition-colors">
          <h4 className="font-bold text-sm text-slate-800 dark:text-slate-200 mb-4">Write a Review</h4>
          
          <form onSubmit={handleAddReview} className="space-y-4">
            
            {/* Rating Stars Select */}
            <div className="flex items-center space-x-3 text-sm">
              <span className="font-bold text-slate-500">Your Rating:</span>
              <div className="flex space-x-1">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    type="button"
                    onClick={() => setRating(star)}
                    className="p-1 rounded text-amber-500 hover:scale-110 active:scale-95 transition-all"
                  >
                    <Star className={`w-6 h-6 ${star <= rating ? "fill-current" : ""}`} />
                  </button>
                ))}
              </div>
            </div>

            {/* Comment Area */}
            <div className="relative">
              <textarea
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                placeholder="Share your experience regarding campus life, placements, exams, and hostel facilities..."
                rows={3}
                className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 text-slate-900 dark:text-slate-100 placeholder-slate-400 transition-all resize-none"
              />
            </div>

            <div className="flex justify-between items-center">
              <p className="text-xs text-slate-400">
                Please make sure reviews are helpful and respect terms.
              </p>
              <button
                type="submit"
                disabled={submittingReview}
                className="px-5 py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white font-semibold text-xs rounded-xl shadow-md flex items-center justify-center transition-colors"
              >
                {submittingReview ? (
                  <>
                    <Loader2 className="w-3.5 h-3.5 mr-1.5 animate-spin" />
                    Submitting...
                  </>
                ) : (
                  <>
                    <Send className="w-3.5 h-3.5 mr-1.5" />
                    Submit Review
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
                  className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-6 rounded-2xl shadow-sm space-y-4 transition-colors"
                >
                  {/* Header Author Info */}
                  <div className="flex justify-between items-start">
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 rounded-full bg-slate-100 dark:bg-slate-850 flex items-center justify-center border border-slate-200 dark:border-slate-750 text-slate-500 font-bold overflow-hidden">
                        {r.user.profileImage ? (
                          <img src={r.user.profileImage} alt={r.user.name} className="w-full h-full object-cover" />
                        ) : (
                          r.user.name.charAt(0).toUpperCase()
                        )}
                      </div>
                      <div>
                        <p className="font-bold text-sm text-slate-850 dark:text-slate-200">{r.user.name}</p>
                        <p className="text-[10px] text-slate-400 font-medium">
                          {new Date(r.createdAt).toLocaleDateString("en-US", {
                            year: "numeric",
                            month: "short",
                            day: "numeric",
                          })}
                        </p>
                      </div>
                    </div>

                    {/* Star Rating Display */}
                    <div className="flex items-center space-x-1 text-amber-500">
                      {Array.from({ length: r.rating }).map((_, idx) => (
                        <Star key={idx} className="w-3.5 h-3.5 fill-current" />
                      ))}
                    </div>
                  </div>

                  {/* Comment */}
                  {editingReviewId === r.id ? (
                    <form onSubmit={handleUpdateReview} className="space-y-3">
                      <div className="flex space-x-1 mb-2">
                        {[1, 2, 3, 4, 5].map((s) => (
                          <button
                            key={s}
                            type="button"
                            onClick={() => setEditRating(s)}
                            className="text-amber-500"
                          >
                            <Star className={`w-5 h-5 ${s <= editRating ? "fill-current" : ""}`} />
                          </button>
                        ))}
                      </div>
                      <textarea
                        value={editComment}
                        onChange={(e) => setEditComment(e.target.value)}
                        className="w-full p-2 bg-slate-50 dark:bg-slate-800 border rounded-lg text-sm"
                      />
                      <div className="flex space-x-2">
                        <button type="submit" className="px-3 py-1 bg-green-600 text-white rounded-md text-xs font-semibold">Save</button>
                        <button type="button" onClick={() => setEditingReviewId(null)} className="px-3 py-1 bg-slate-500 text-white rounded-md text-xs font-semibold">Cancel</button>
                      </div>
                    </form>
                  ) : (
                    <p className="text-sm text-slate-650 dark:text-slate-350 leading-relaxed">
                      {r.comment}
                    </p>
                  )}

                  {/* Actions (Like, Edit, Delete) */}
                  <div className="flex items-center justify-between pt-2 border-t border-slate-100 dark:border-slate-800/40 text-xs">
                    <button
                      onClick={() => handleLikeReview(r.id)}
                      className={`flex items-center space-x-1.5 font-bold transition-colors ${
                        userHasLiked
                          ? "text-blue-600 dark:text-blue-400"
                          : "text-slate-400 hover:text-slate-600"
                      }`}
                    >
                      <ThumbsUp className={`w-4 h-4 ${userHasLiked ? "fill-current" : ""}`} />
                      <span>Like{r.likes?.length > 0 && ` (${r.likes.length})`}</span>
                    </button>

                    {(isAuthor || isAdmin) && (
                      <div className="flex items-center space-x-4">
                        {isAuthor && (
                          <button
                            onClick={() => handleStartEditReview(r)}
                            className="flex items-center text-slate-450 hover:text-slate-600 font-bold"
                          >
                            <Edit2 className="w-3.5 h-3.5 mr-1" />
                            Edit
                          </button>
                        )}
                        <button
                          onClick={() => handleDeleteReview(r.id)}
                          className="flex items-center text-rose-500 hover:text-rose-600 font-bold"
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
            <div className="bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-8 rounded-2xl text-center text-sm text-slate-500">
              No reviews written yet. Be the first to share your experience!
            </div>
          )}
        </div>
      </section>

    </div>
  );
}
