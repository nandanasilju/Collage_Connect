"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import {
  ShieldAlert,
  Loader2,
  Plus,
  Trash2,
  Edit2,
  Check,
  X,
  GraduationCap,
  MessageSquare,
  Users,
  Compass,
  AlertTriangle,
  Star,
} from "lucide-react";
import toast from "react-hot-toast";

type Tab = "overview" | "colleges" | "reviews" | "users";

export default function AdminDashboard() {
  const router = useRouter();
  const { user, loading: authLoading } = useAuth();

  const [activeTab, setActiveTab] = useState<Tab>("overview");
  const [colleges, setColleges] = useState<any[]>([]);
  const [reviews, setReviews] = useState<any[]>([]);
  const [users, setUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // College Form State
  const [editingCollegeId, setEditingCollegeId] = useState<string | null>(null);
  const [name, setName] = useState("");
  const [location, setLocation] = useState("");
  const [district, setDistrict] = useState("Ernakulam");
  const [state, setState] = useState("Kerala");
  const [type, setType] = useState("Government");
  const [autonomous, setAutonomous] = useState(false);
  const [description, setDescription] = useState("");
  const [fees, setFees] = useState("");
  const [placementPercentage, setPlacementPercentage] = useState("");
  const [highestPackage, setHighestPackage] = useState("");
  const [averagePackage, setAveragePackage] = useState("");
  const [hostel, setHostel] = useState(false);
  const [transport, setTransport] = useState(false);
  const [website, setWebsite] = useState("");
  const [image, setImage] = useState("");
  const [latitude, setLatitude] = useState("");
  const [longitude, setLongitude] = useState("");
  const [nearbyBusStand, setNearbyBusStand] = useState("");
  const [nearbyRailway, setNearbyRailway] = useState("");
  const [nearbyAirport, setNearbyAirport] = useState("");
  
  // Parsed fields inputs
  const [coursesInput, setCoursesInput] = useState("");
  const [facilitiesInput, setFacilitiesInput] = useState("");

  const [submittingCollege, setSubmittingCollege] = useState(false);

  useEffect(() => {
    if (authLoading) return;
    if (!user || user.role !== "ADMIN") {
      toast.error("Access denied. Admin authorization required.");
      router.push("/dashboard");
      return;
    }

    const loadAdminData = async () => {
      try {
        // Fetch all colleges
        const colRes = await fetch("/api/colleges?limit=100");
        if (colRes.ok) {
          const data = await colRes.json();
          setColleges(data.colleges);
        }

        // Fetch all reviews for moderation
        const revRes = await fetch("/api/reviews");
        if (revRes.ok) {
          const data = await revRes.json();
          setReviews(data);
        }

        // Fetch all users list
        const usrRes = await fetch("/api/admin/users");
        if (usrRes.ok) {
          const data = await usrRes.json();
          setUsers(data);
        }
      } catch (err) {
        toast.error("Failed to fetch administrative lists");
      } finally {
        setLoading(false);
      }
    };

    loadAdminData();
  }, [user, authLoading, router]);

  const handleCreateOrUpdateCollege = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!name || !location || !description || !fees) {
      toast.error("Please fill in all required college details");
      return;
    }

    setSubmittingCollege(true);

    // Format courses and facilities from comma separated text
    const parsedCourses = coursesInput
      .split(",")
      .map((c) => c.trim())
      .filter((c) => c.length > 0)
      .map((cName) => ({
        name: cName,
        duration: "4 Years",
        intake: 60,
      }));

    const parsedFacilities = facilitiesInput
      .split(",")
      .map((f) => f.trim())
      .filter((f) => f.length > 0);

    const payload = {
      name,
      location,
      district,
      state,
      type,
      autonomous,
      description,
      fees: parseFloat(fees),
      placementPercentage: parseFloat(placementPercentage || "0"),
      highestPackage: parseFloat(highestPackage || "0"),
      averagePackage: parseFloat(averagePackage || "0"),
      hostel,
      transport,
      website: website || "https://google.com",
      image: image || undefined,
      latitude: parseFloat(latitude || "10.0"),
      longitude: parseFloat(longitude || "76.0"),
      nearbyBusStand,
      nearbyRailway,
      nearbyAirport,
      courses: parsedCourses,
      facilities: parsedFacilities,
    };

    try {
      if (editingCollegeId) {
        // Edit Mode
        const res = await fetch(`/api/colleges/${editingCollegeId}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });

        if (res.ok) {
          const updated = await res.json();
          setColleges((prev) =>
            prev.map((c) => (c.id === editingCollegeId ? updated : c))
          );
          setEditingCollegeId(null);
          toast.success("College details updated successfully!");
          resetForm();
        } else {
          toast.error("Failed to update college details");
        }
      } else {
        // Add Mode
        const res = await fetch("/api/colleges", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });

        if (res.ok) {
          const created = await res.json();
          setColleges((prev) => [created, ...prev]);
          toast.success("New college created successfully!");
          resetForm();
        } else {
          toast.error("Failed to create college profile");
        }
      }
    } catch (err) {
      toast.error("Failed to submit college profile");
    } finally {
      setSubmittingCollege(false);
    }
  };

  const resetForm = () => {
    setEditingCollegeId(null);
    setName("");
    setLocation("");
    setDistrict("Ernakulam");
    setType("Government");
    setAutonomous(false);
    setDescription("");
    setFees("");
    setPlacementPercentage("");
    setHighestPackage("");
    setAveragePackage("");
    setHostel(false);
    setTransport(false);
    setWebsite("");
    setImage("");
    setLatitude("");
    setLongitude("");
    setNearbyBusStand("");
    setNearbyRailway("");
    setNearbyAirport("");
    setCoursesInput("");
    setFacilitiesInput("");
  };

  const handleStartEdit = (c: any) => {
    setEditingCollegeId(c.id);
    setName(c.name);
    setLocation(c.location);
    setDistrict(c.district);
    setType(c.type);
    setAutonomous(c.autonomous);
    setDescription(c.description);
    setFees(c.fees.toString());
    setPlacementPercentage(c.placementPercentage.toString());
    setHighestPackage(c.highestPackage.toString());
    setAveragePackage(c.averagePackage.toString());
    setHostel(c.hostel);
    setTransport(c.transport);
    setWebsite(c.website);
    setImage(c.image);
    setLatitude(c.latitude.toString());
    setLongitude(c.longitude.toString());
    setNearbyBusStand(c.nearbyBusStand || "");
    setNearbyRailway(c.nearbyRailway || "");
    setNearbyAirport(c.nearbyAirport || "");
    setCoursesInput(c.courses.map((course: any) => course.name).join(", "));
    setFacilitiesInput(c.facilities.map((fac: any) => fac.name).join(", "));

    // Scroll to form
    document.getElementById("college-form-container")?.scrollIntoView({ behavior: "smooth" });
  };

  const handleDeleteCollege = async (id: string) => {
    if (!confirm("Are you sure you want to delete this college? This will delete all saved associations, reviews, and images!")) return;

    try {
      const res = await fetch(`/api/colleges/${id}`, { method: "DELETE" });
      if (res.ok) {
        setColleges((prev) => prev.filter((c) => c.id !== id));
        toast.success("College deleted successfully");
      } else {
        toast.error("Failed to delete college profile");
      }
    } catch (err) {
      toast.error("Failed to delete college profile");
    }
  };

  const handleToggleReviewApproval = async (reviewId: string, currentApproved: boolean) => {
    try {
      const nextApproved = !currentApproved;
      const res = await fetch("/api/reviews", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ reviewId, approved: nextApproved }),
      });

      if (res.ok) {
        setReviews((prev) =>
          prev.map((r) => (r.id === reviewId ? { ...r, approved: nextApproved } : r))
        );
        toast.success(nextApproved ? "Review approved!" : "Review disapproved!");
      } else {
        toast.error("Failed to toggle review approval status");
      }
    } catch (err) {
      toast.error("Failed to moderate review");
    }
  };

  const handleDeleteReview = async (reviewId: string) => {
    if (!confirm("Are you sure you want to delete this review?")) return;

    try {
      const res = await fetch(`/api/reviews?reviewId=${reviewId}`, { method: "DELETE" });
      if (res.ok) {
        setReviews((prev) => prev.filter((r) => r.id !== reviewId));
        toast.success("Review deleted successfully");
      } else {
        toast.error("Failed to delete review");
      }
    } catch (err) {
      toast.error("Failed to delete review");
    }
  };

  if (authLoading || loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-16 flex flex-col items-center justify-center space-y-4">
        <Loader2 className="w-12 h-12 text-blue-500 animate-spin" />
        <p className="font-semibold text-slate-450">Loading administrative dashboards...</p>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      
      {/* Header Banner */}
      <div className="space-y-2">
        <h1 className="text-3xl font-extrabold text-slate-850 dark:text-slate-100 flex items-center">
          <ShieldAlert className="w-7.5 h-7.5 mr-2.5 text-rose-500" />
          System Administration
        </h1>
        <p className="text-slate-500 dark:text-slate-400 text-sm">
          Manage database records, review admissions listings, and moderate student review boards.
        </p>
      </div>

      {/* Admin Tab buttons */}
      <div className="flex border-b border-slate-200 dark:border-slate-850 gap-4 overflow-x-auto">
        {(["overview", "colleges", "reviews", "users"] as Tab[]).map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`py-3 px-1 border-b-2 font-bold text-sm uppercase tracking-wider transition-all whitespace-nowrap ${
              activeTab === tab
                ? "border-blue-600 text-blue-600 dark:border-blue-400 dark:text-blue-400"
                : "border-transparent text-slate-450 hover:text-slate-700"
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Tab Contents */}
      <div className="space-y-8 animate-in fade-in duration-200">
        
        {/* Tab 1: Overview */}
        {activeTab === "overview" && (
          <div className="space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              
              <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-6 rounded-2xl flex items-center space-x-4">
                <div className="p-3 bg-blue-50 dark:bg-blue-950/30 text-blue-500 rounded-xl">
                  <Compass className="w-6 h-6" />
                </div>
                <div>
                  <p className="text-3xl font-black text-slate-800 dark:text-slate-100">{colleges.length}</p>
                  <p className="text-xs text-slate-400 font-bold uppercase tracking-wider">Total Colleges</p>
                </div>
              </div>

              <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-6 rounded-2xl flex items-center space-x-4">
                <div className="p-3 bg-indigo-50 dark:bg-indigo-950/30 text-indigo-500 rounded-xl">
                  <MessageSquare className="w-6 h-6" />
                </div>
                <div>
                  <p className="text-3xl font-black text-slate-800 dark:text-slate-100">{reviews.length}</p>
                  <p className="text-xs text-slate-400 font-bold uppercase tracking-wider">Total Reviews</p>
                </div>
              </div>

              <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-6 rounded-2xl flex items-center space-x-4">
                <div className="p-3 bg-rose-50 dark:bg-rose-950/30 text-rose-500 rounded-xl">
                  <Users className="w-6 h-6" />
                </div>
                <div>
                  <p className="text-3xl font-black text-slate-800 dark:text-slate-100">{users.length}</p>
                  <p className="text-xs text-slate-400 font-bold uppercase tracking-wider">Total Accounts</p>
                </div>
              </div>

            </div>

            {/* Quick action info */}
            <div className="bg-slate-100 dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 text-sm text-slate-600 dark:text-slate-350">
              <h3 className="font-bold mb-2 flex items-center text-slate-800 dark:text-slate-200">
                <AlertTriangle className="w-4 h-4 mr-2 text-rose-500" />
                Administrative Guidelines
              </h3>
              <p className="leading-relaxed">
                As an administrator, you have complete control over college lists and student reviews. Any deletion is immediate and cascades across the database (associated courses, hostel stats, and reviews will be removed). Be cautious when deleting active colleges.
              </p>
            </div>
          </div>
        )}

        {/* Tab 2: Manage Colleges */}
        {activeTab === "colleges" && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
            
            {/* Form Column (1 column) */}
            <div
              id="college-form-container"
              className="lg:col-span-1 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-6 rounded-2xl shadow-sm space-y-4 scroll-mt-20 transition-colors"
            >
              <h3 className="font-bold text-slate-800 dark:text-slate-100 text-sm border-b border-slate-150 dark:border-slate-800 pb-2">
                {editingCollegeId ? "Edit College Profile" : "Add New College Profile"}
              </h3>

              <form onSubmit={handleCreateOrUpdateCollege} className="space-y-4 text-xs font-semibold">
                
                {/* Name */}
                <div className="space-y-1">
                  <label className="text-slate-400 uppercase tracking-wide">College Name *</label>
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="e.g. Govt Engineering College"
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none text-slate-800 dark:text-white"
                  />
                </div>

                {/* Location & District */}
                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <label className="text-slate-400 uppercase tracking-wide">City/Location *</label>
                    <input
                      type="text"
                      value={location}
                      onChange={(e) => setLocation(e.target.value)}
                      placeholder="e.g. Sreekaryam"
                      className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none text-slate-800 dark:text-white"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-slate-400 uppercase tracking-wide">District *</label>
                    <select
                      value={district}
                      onChange={(e) => setDistrict(e.target.value)}
                      className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none text-slate-800 dark:text-white"
                    >
                      {["Trivandrum", "Kollam", "Ernakulam", "Thrissur", "Palakkad"].map((d) => (
                        <option key={d} value={d}>{d}</option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* Fees & Type */}
                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <label className="text-slate-400 uppercase tracking-wide">Annual Fees (INR) *</label>
                    <input
                      type="text"
                      value={fees}
                      onChange={(e) => setFees(e.target.value.replace(/\D/g, ""))}
                      placeholder="e.g. 35000"
                      className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none text-slate-800 dark:text-white"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-slate-400 uppercase tracking-wide">Type *</label>
                    <select
                      value={type}
                      onChange={(e) => setType(e.target.value)}
                      className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none text-slate-800 dark:text-white"
                    >
                      <option value="Government">Government</option>
                      <option value="Government-Aided">Government-Aided</option>
                      <option value="Private">Private</option>
                    </select>
                  </div>
                </div>

                {/* Placements & Avg Package */}
                <div className="grid grid-cols-3 gap-2">
                  <div className="space-y-1">
                    <label className="text-slate-450 uppercase tracking-wider">Placements %</label>
                    <input
                      type="text"
                      value={placementPercentage}
                      onChange={(e) => setPlacementPercentage(e.target.value)}
                      placeholder="e.g. 90"
                      className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none text-slate-800 dark:text-white"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-slate-455 uppercase tracking-wider">Avg LPA</label>
                    <input
                      type="text"
                      value={averagePackage}
                      onChange={(e) => setAveragePackage(e.target.value)}
                      placeholder="e.g. 5.5"
                      className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none text-slate-800 dark:text-white"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-slate-455 uppercase tracking-wider">Highest LPA</label>
                    <input
                      type="text"
                      value={highestPackage}
                      onChange={(e) => setHighestPackage(e.target.value)}
                      placeholder="e.g. 18"
                      className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none text-slate-800 dark:text-white"
                    />
                  </div>
                </div>

                {/* Description */}
                <div className="space-y-1">
                  <label className="text-slate-400 uppercase tracking-wide">Description *</label>
                  <textarea
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="Provide description of college achievements..."
                    rows={3}
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none text-slate-850 dark:text-white resize-none"
                  />
                </div>

                {/* Coordinates */}
                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <label className="text-slate-400 uppercase tracking-wide">Latitude</label>
                    <input
                      type="text"
                      value={latitude}
                      onChange={(e) => setLatitude(e.target.value)}
                      placeholder="e.g. 8.5444"
                      className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none text-slate-800 dark:text-white"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-slate-400 uppercase tracking-wide">Longitude</label>
                    <input
                      type="text"
                      value={longitude}
                      onChange={(e) => setLongitude(e.target.value)}
                      placeholder="e.g. 76.9054"
                      className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none text-slate-800 dark:text-white"
                    />
                  </div>
                </div>

                {/* Transport Hubs */}
                <div className="space-y-1">
                  <label className="text-slate-400 uppercase tracking-wide">Nearby Transport Stations</label>
                  <div className="space-y-2">
                    <input
                      type="text"
                      value={nearbyBusStand}
                      onChange={(e) => setNearbyBusStand(e.target.value)}
                      placeholder="Bus: e.g. Sreekaryam Bus Stand (1km)"
                      className="w-full px-3 py-1.5 bg-slate-50 dark:bg-slate-800 border rounded-lg text-slate-800 dark:text-white text-xs"
                    />
                    <input
                      type="text"
                      value={nearbyRailway}
                      onChange={(e) => setNearbyRailway(e.target.value)}
                      placeholder="Railway: e.g. Trivandrum Central (10km)"
                      className="w-full px-3 py-1.5 bg-slate-50 dark:bg-slate-800 border rounded-lg text-slate-800 dark:text-white text-xs"
                    />
                    <input
                      type="text"
                      value={nearbyAirport}
                      onChange={(e) => setNearbyAirport(e.target.value)}
                      placeholder="Airport: e.g. Trivandrum Intl (12km)"
                      className="w-full px-3 py-1.5 bg-slate-50 dark:bg-slate-800 border rounded-lg text-slate-800 dark:text-white text-xs"
                    />
                  </div>
                </div>

                {/* Comma Sep Lists */}
                <div className="space-y-2">
                  <div className="space-y-1">
                    <label className="text-slate-400 uppercase tracking-wide">Branches Offered (Comma-separated)</label>
                    <input
                      type="text"
                      value={coursesInput}
                      onChange={(e) => setCoursesInput(e.target.value)}
                      placeholder="e.g. Computer Science & Engineering, Mechanical Engineering"
                      className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border rounded-lg text-slate-800 dark:text-white"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-slate-400 uppercase tracking-wide">Facilities Offered (Comma-separated)</label>
                    <input
                      type="text"
                      value={facilitiesInput}
                      onChange={(e) => setFacilitiesInput(e.target.value)}
                      placeholder="e.g. Library, Wifi, Research Labs, Gym"
                      className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border rounded-lg text-slate-800 dark:text-white"
                    />
                  </div>
                </div>

                {/* Extra Metadata Inputs */}
                <div className="space-y-2">
                  <div className="space-y-1">
                    <label className="text-slate-400 uppercase tracking-wide">College Website</label>
                    <input
                      type="text"
                      value={website}
                      onChange={(e) => setWebsite(e.target.value)}
                      placeholder="e.g. https://www.cet.ac.in"
                      className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border rounded-lg text-slate-850 dark:text-white"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-slate-400 uppercase tracking-wide">Campus Photo URL</label>
                    <input
                      type="text"
                      value={image}
                      onChange={(e) => setImage(e.target.value)}
                      placeholder="Paste online image link here..."
                      className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border rounded-lg text-slate-850 dark:text-white"
                    />
                  </div>
                </div>

                {/* Checkboxes */}
                <div className="flex flex-wrap gap-4 py-2">
                  <label className="flex items-center space-x-2 text-slate-700 dark:text-slate-350 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={autonomous}
                      onChange={(e) => setAutonomous(e.target.checked)}
                      className="w-4 h-4 rounded text-blue-600"
                    />
                    <span>Autonomous</span>
                  </label>
                  <label className="flex items-center space-x-2 text-slate-700 dark:text-slate-350 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={hostel}
                      onChange={(e) => setHostel(e.target.checked)}
                      className="w-4 h-4 rounded text-blue-600"
                    />
                    <span>Hostel Available</span>
                  </label>
                  <label className="flex items-center space-x-2 text-slate-700 dark:text-slate-350 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={transport}
                      onChange={(e) => setTransport(e.target.checked)}
                      className="w-4 h-4 rounded text-blue-600"
                    />
                    <span>Transport Available</span>
                  </label>
                </div>

                {/* Submission */}
                <div className="flex gap-2 pt-2">
                  <button
                    type="submit"
                    disabled={submittingCollege}
                    className="flex-1 py-2.5 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-450 text-white font-bold rounded-xl active:scale-95 transition-all flex items-center justify-center text-xs"
                  >
                    {submittingCollege ? (
                      <>
                        <Loader2 className="w-4 h-4 mr-1 animate-spin" />
                        Submitting...
                      </>
                    ) : editingCollegeId ? (
                      "Save College Details"
                    ) : (
                      "Create College Profile"
                    )}
                  </button>
                  {editingCollegeId && (
                    <button
                      type="button"
                      onClick={resetForm}
                      className="px-4 py-2.5 border border-slate-200 dark:border-slate-800 text-slate-500 rounded-xl hover:bg-slate-100"
                    >
                      Cancel
                    </button>
                  )}
                </div>

              </form>
            </div>

            {/* List Column (2 Columns) */}
            <div className="lg:col-span-2 space-y-4">
              <h3 className="font-bold text-slate-800 dark:text-slate-100 text-lg border-b border-slate-200 dark:border-slate-800 pb-3">
                Registered College Profiles ({colleges.length})
              </h3>

              <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl overflow-hidden shadow-sm transition-colors duration-300">
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-sm">
                    <thead className="bg-slate-50 dark:bg-slate-800 border-b border-slate-200 dark:border-slate-800 text-xs font-bold text-slate-500 uppercase tracking-wider">
                      <tr>
                        <th className="px-6 py-3">College</th>
                        <th className="px-6 py-3">District</th>
                        <th className="px-6 py-3">Type</th>
                        <th className="px-6 py-3">Fees</th>
                        <th className="px-6 py-3 text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-150 dark:divide-slate-855 text-slate-700 dark:text-slate-300">
                      {colleges.map((c) => (
                        <tr key={c.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/40">
                          <td className="px-6 py-4 font-bold max-w-[200px] truncate">{c.name}</td>
                          <td className="px-6 py-4">{c.district}</td>
                          <td className="px-6 py-4 text-xs font-semibold">{c.type}</td>
                          <td className="px-6 py-4">₹{c.fees.toLocaleString()}/yr</td>
                          <td className="px-6 py-4 text-right flex items-center justify-end space-x-2.5">
                            <button
                              onClick={() => handleStartEdit(c)}
                              className="p-1.5 text-blue-500 hover:bg-blue-50 dark:hover:bg-blue-950/30 rounded-lg transition-colors"
                              title="Edit college"
                            >
                              <Edit2 className="w-4.5 h-4.5" />
                            </button>
                            <button
                              onClick={() => handleDeleteCollege(c.id)}
                              className="p-1.5 text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950/30 rounded-lg transition-colors"
                              title="Delete college"
                            >
                              <Trash2 className="w-4.5 h-4.5" />
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>

          </div>
        )}

        {/* Tab 3: Moderate Reviews */}
        {activeTab === "reviews" && (
          <div className="space-y-4">
            <h3 className="font-bold text-slate-800 dark:text-slate-100 text-lg border-b border-slate-200 dark:border-slate-800 pb-3">
              Review Moderation Center ({reviews.length})
            </h3>

            {reviews.length > 0 ? (
              <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl overflow-hidden shadow-sm transition-colors duration-300">
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-sm">
                    <thead className="bg-slate-50 dark:bg-slate-800 border-b border-slate-200 dark:border-slate-800 text-xs font-bold text-slate-500 uppercase tracking-wider">
                      <tr>
                        <th className="px-6 py-3">College</th>
                        <th className="px-6 py-3">User</th>
                        <th className="px-6 py-3">Rating</th>
                        <th className="px-6 py-3 max-w-sm">Comment</th>
                        <th className="px-6 py-3">Status</th>
                        <th className="px-6 py-3 text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-150 dark:divide-slate-855 text-slate-750 dark:text-slate-350">
                      {reviews.map((r) => (
                        <tr key={r.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/20">
                          <td className="px-6 py-4 font-bold max-w-[150px] truncate">{r.college.name}</td>
                          <td className="px-6 py-4">
                            <p className="font-semibold">{r.user.name}</p>
                            <p className="text-[10px] text-slate-400">{r.user.email}</p>
                          </td>
                          <td className="px-6 py-4">
                            <div className="flex items-center text-amber-500">
                              <Star className="w-3.5 h-3.5 fill-current" />
                              <span className="ml-1 font-bold">{r.rating}</span>
                            </div>
                          </td>
                          <td className="px-6 py-4 max-w-sm truncate" title={r.comment}>
                            {r.comment}
                          </td>
                          <td className="px-6 py-4">
                            <span
                              className={`text-[10px] font-extrabold uppercase px-2 py-0.5 rounded border ${
                                r.approved
                                  ? "bg-emerald-50 text-emerald-600 border-emerald-100 dark:bg-emerald-950/20"
                                  : "bg-amber-50 text-amber-600 border-amber-100 dark:bg-amber-950/20"
                              }`}
                            >
                              {r.approved ? "Approved" : "Pending"}
                            </span>
                          </td>
                          <td className="px-6 py-4 text-right flex items-center justify-end space-x-2">
                            <button
                              onClick={() => handleToggleReviewApproval(r.id, r.approved)}
                              className={`p-1.5 rounded-lg border transition-colors ${
                                r.approved
                                  ? "border-amber-200 text-amber-500 hover:bg-amber-50 dark:border-amber-900/30"
                                  : "border-emerald-250 text-emerald-600 hover:bg-emerald-50 dark:border-emerald-900/30"
                              }`}
                              title={r.approved ? "Disapprove Review" : "Approve Review"}
                            >
                              {r.approved ? <X className="w-4 h-4" /> : <Check className="w-4 h-4" />}
                            </button>
                            <button
                              onClick={() => handleDeleteReview(r.id)}
                              className="p-1.5 border border-slate-200 dark:border-slate-800 text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950/20 rounded-lg transition-colors"
                              title="Delete Review"
                            >
                              <Trash2 className="w-4.5 h-4.5" />
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            ) : (
              <p className="text-sm text-slate-450 italic text-center py-10 bg-white dark:bg-slate-900 border rounded-2xl">
                No reviews have been written in the platform yet.
              </p>
            )}
          </div>
        )}

        {/* Tab 4: Manage Users */}
        {activeTab === "users" && (
          <div className="space-y-4">
            <h3 className="font-bold text-slate-800 dark:text-slate-100 text-lg border-b border-slate-200 dark:border-slate-800 pb-3">
              User Profiles Directory ({users.length})
            </h3>

            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl overflow-hidden shadow-sm transition-colors duration-300">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-sm">
                  <thead className="bg-slate-50 dark:bg-slate-800 border-b border-slate-200 dark:border-slate-800 text-xs font-bold text-slate-500 uppercase tracking-wider">
                    <tr>
                      <th className="px-6 py-3">Name</th>
                      <th className="px-6 py-3">Email Address</th>
                      <th className="px-6 py-3">Role</th>
                      <th className="px-6 py-3">Target Branch</th>
                      <th className="px-6 py-3">Max Budget</th>
                      <th className="px-6 py-3">Joined Date</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-150 dark:divide-slate-855 text-slate-700 dark:text-slate-350">
                    {users.map((u) => (
                      <tr key={u.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/20">
                        <td className="px-6 py-4 font-bold">{u.name}</td>
                        <td className="px-6 py-4">{u.email}</td>
                        <td className="px-6 py-4">
                          <span
                            className={`text-[9px] font-black uppercase tracking-wider px-2 py-0.5 rounded border ${
                              u.role === "ADMIN"
                                ? "bg-rose-50 text-rose-600 border-rose-100 dark:bg-rose-950/20"
                                : "bg-blue-50 text-blue-600 border-blue-100 dark:bg-blue-950/20"
                            }`}
                          >
                            {u.role}
                          </span>
                        </td>
                        <td className="px-6 py-4 max-w-[150px] truncate">
                          {u.preferredBranch || "Any"}
                        </td>
                        <td className="px-6 py-4 font-bold">
                          {u.budget ? `₹${u.budget.toLocaleString()}/yr` : "Any"}
                        </td>
                        <td className="px-6 py-4 text-xs text-slate-400 font-medium">
                          {new Date(u.createdAt).toLocaleDateString()}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

      </div>

    </div>
  );
}
