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
  MapPin,
  Globe,
  Settings,
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
        const colRes = await fetch("/api/colleges?limit=100");
        if (colRes.ok) {
          const data = await colRes.json();
          setColleges(data.colleges);
        }

        const revRes = await fetch("/api/reviews");
        if (revRes.ok) {
          const data = await revRes.json();
          setReviews(data);
        }

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
      <div className="max-w-7xl mx-auto px-4 py-20 flex flex-col items-center justify-center space-y-4">
        <Loader2 className="w-12 h-12 text-primary animate-spin" />
        <p className="font-semibold text-slate-450">Loading administrative panels...</p>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      
      {/* Banner */}
      <div className="space-y-2">
        <h1 className="text-3xl font-extrabold text-slate-850 dark:text-white flex items-center">
          <ShieldAlert className="w-7.5 h-7.5 mr-2.5 text-accent-red" />
          System Administration
        </h1>
        <p className="text-slate-500 dark:text-slate-400 text-sm font-medium">
          Manage database records, review admissions listings, and moderate review boards.
        </p>
      </div>

      {/* Tabs list */}
      <div className="flex border-b border-slate-200 dark:border-slate-850 gap-4 overflow-x-auto no-scrollbar">
        {(["overview", "colleges", "reviews", "users"] as Tab[]).map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`py-3 px-1 border-b-2 font-bold text-xs uppercase tracking-wider transition-all whitespace-nowrap cursor-pointer ${
              activeTab === tab
                ? "border-primary text-primary"
                : "border-transparent text-slate-450 hover:text-slate-700"
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Contents */}
      <div className="space-y-8">
        
        {/* Overview Tab */}
        {activeTab === "overview" && (
          <div className="space-y-8 animate-in fade-in duration-200">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              
              <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-900 p-6 rounded-2xl flex items-center space-x-4">
                <div className="p-3 bg-primary/10 text-primary border border-primary/20 rounded-xl">
                  <Compass className="w-6 h-6" />
                </div>
                <div>
                  <p className="text-2xl font-black text-slate-800 dark:text-white leading-none">{colleges.length}</p>
                  <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider mt-1.5">Registered Colleges</p>
                </div>
              </div>

              <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-900 p-6 rounded-2xl flex items-center space-x-4">
                <div className="p-3 bg-accent-purple/10 text-accent-purple border border-accent-purple/20 rounded-xl">
                  <MessageSquare className="w-6 h-6" />
                </div>
                <div>
                  <p className="text-2xl font-black text-slate-800 dark:text-white leading-none">{reviews.length}</p>
                  <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider mt-1.5">Total Reviews</p>
                </div>
              </div>

              <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-900 p-6 rounded-2xl flex items-center space-x-4">
                <div className="p-3 bg-accent-green/10 text-accent-green border border-accent-green/20 rounded-xl">
                  <Users className="w-6 h-6" />
                </div>
                <div>
                  <p className="text-2xl font-black text-slate-800 dark:text-white leading-none">{users.length}</p>
                  <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider mt-1.5">User Accounts</p>
                </div>
              </div>

            </div>

            <div className="bg-slate-50 dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-855 text-xs font-semibold text-slate-550 dark:text-slate-350">
              <h3 className="font-extrabold mb-2.5 flex items-center text-slate-850 dark:text-white uppercase tracking-wider">
                <AlertTriangle className="w-4.5 h-4.5 mr-2 text-accent-red" />
                Administrative Scope
              </h3>
              <p className="leading-relaxed">
                As an administrator, you have complete control over college lists and student reviews. Any deletion is immediate and cascades across the database (associated courses, hostel stats, and reviews will be removed). Be cautious when deleting active colleges.
              </p>
            </div>
          </div>
        )}

        {/* Manage Colleges Tab */}
        {activeTab === "colleges" && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start animate-in fade-in duration-200">
            
            {/* Left form (1 column) */}
            <div
              id="college-form-container"
              className="lg:col-span-1 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-900 p-6 rounded-3xl shadow-sm space-y-4 scroll-mt-20 text-xs font-semibold"
            >
              <h3 className="font-bold text-slate-850 dark:text-white text-xs uppercase tracking-wider border-b border-slate-100 dark:border-slate-850 pb-2 flex items-center">
                <Settings className="w-4.5 h-4.5 mr-1.5 text-primary" />
                {editingCollegeId ? "Edit Profile" : "Create Profile"}
              </h3>

              <form onSubmit={handleCreateOrUpdateCollege} className="space-y-4 font-semibold">
                {/* Name */}
                <div className="space-y-1.5">
                  <label className="text-[10px] text-slate-400 uppercase tracking-widest">College Name *</label>
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Govt Engineering College"
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-850 border border-slate-200 dark:border-slate-800 rounded-xl focus:ring-2 focus:ring-primary text-slate-800 dark:text-slate-200 focus:outline-none"
                  />
                </div>

                {/* Location & District */}
                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1.5">
                    <label className="text-[10px] text-slate-400 uppercase tracking-widest">City *</label>
                    <input
                      type="text"
                      value={location}
                      onChange={(e) => setLocation(e.target.value)}
                      placeholder="e.g. Sreekaryam"
                      className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-850 border border-slate-200 dark:border-slate-800 rounded-xl focus:ring-2 focus:ring-primary text-slate-800 dark:text-slate-200 focus:outline-none"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-[10px] text-slate-400 uppercase tracking-widest">District *</label>
                    <select
                      value={district}
                      onChange={(e) => setDistrict(e.target.value)}
                      className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-850 border border-slate-200 dark:border-slate-800 rounded-xl text-slate-700 dark:text-slate-250 cursor-pointer"
                    >
                      {["Trivandrum", "Kollam", "Ernakulam", "Thrissur", "Palakkad"].map((d) => (
                        <option key={d} value={d}>{d}</option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* Fees & Type */}
                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1.5">
                    <label className="text-[10px] text-slate-400 uppercase tracking-widest">Annual Fees *</label>
                    <input
                      type="text"
                      value={fees}
                      onChange={(e) => setFees(e.target.value.replace(/\D/g, ""))}
                      placeholder="e.g. 35000"
                      className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-855 border border-slate-200 dark:border-slate-800 rounded-xl focus:ring-2 focus:ring-primary text-slate-800 dark:text-slate-200 focus:outline-none"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-[10px] text-slate-400 uppercase tracking-widest">Type *</label>
                    <select
                      value={type}
                      onChange={(e) => setType(e.target.value)}
                      className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-855 border border-slate-200 dark:border-slate-800 rounded-xl text-slate-700 dark:text-slate-250 cursor-pointer"
                    >
                      <option value="Government">Government</option>
                      <option value="Government-Aided">Government-Aided</option>
                      <option value="Private">Private</option>
                    </select>
                  </div>
                </div>

                {/* Placements metrics */}
                <div className="grid grid-cols-3 gap-2">
                  <div className="space-y-1.5">
                    <label className="text-[9px] text-slate-450 uppercase tracking-wider">Placement %</label>
                    <input
                      type="text"
                      value={placementPercentage}
                      onChange={(e) => setPlacementPercentage(e.target.value)}
                      placeholder="90"
                      className="w-full px-2 py-1.5 bg-slate-50 dark:bg-slate-855 border rounded-lg focus:ring-2 focus:ring-primary text-slate-800 dark:text-slate-200 focus:outline-none"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-[9px] text-slate-455 uppercase tracking-wider">Avg LPA</label>
                    <input
                      type="text"
                      value={averagePackage}
                      onChange={(e) => setAveragePackage(e.target.value)}
                      placeholder="5.5"
                      className="w-full px-2 py-1.5 bg-slate-50 dark:bg-slate-855 border rounded-lg focus:ring-2 focus:ring-primary text-slate-800 dark:text-slate-200 focus:outline-none"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-[9px] text-slate-455 uppercase tracking-wider">Highest LPA</label>
                    <input
                      type="text"
                      value={highestPackage}
                      onChange={(e) => setHighestPackage(e.target.value)}
                      placeholder="18"
                      className="w-full px-2 py-1.5 bg-slate-50 dark:bg-slate-855 border rounded-lg focus:ring-2 focus:ring-primary text-slate-800 dark:text-slate-200 focus:outline-none"
                    />
                  </div>
                </div>

                {/* Coordinates */}
                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1.5">
                    <label className="text-[10px] text-slate-400 uppercase tracking-widest">Latitude</label>
                    <input
                      type="text"
                      value={latitude}
                      onChange={(e) => setLatitude(e.target.value)}
                      placeholder="8.5444"
                      className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-855 border border-slate-200 dark:border-slate-800 rounded-xl text-slate-800 dark:text-slate-200"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-[10px] text-slate-400 uppercase tracking-widest">Longitude</label>
                    <input
                      type="text"
                      value={longitude}
                      onChange={(e) => setLongitude(e.target.value)}
                      placeholder="76.9054"
                      className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-855 border border-slate-200 dark:border-slate-800 rounded-xl text-slate-800 dark:text-slate-200"
                    />
                  </div>
                </div>

                {/* Description */}
                <div className="space-y-1.5">
                  <label className="text-[10px] text-slate-400 uppercase tracking-widest">Description *</label>
                  <textarea
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="Provide details about campus highlights..."
                    rows={3}
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-855 border border-slate-200 dark:border-slate-800 rounded-xl text-slate-850 dark:text-slate-200 focus:ring-2 focus:ring-primary focus:outline-none resize-none"
                  />
                </div>

                {/* Website & Photo */}
                <div className="space-y-2">
                  <input
                    type="text"
                    value={website}
                    onChange={(e) => setWebsite(e.target.value)}
                    placeholder="Website: https://www.cet.ac.in"
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-855 border border-slate-200 dark:border-slate-800 rounded-xl text-xs text-slate-800 dark:text-slate-200"
                  />
                  <input
                    type="text"
                    value={image}
                    onChange={(e) => setImage(e.target.value)}
                    placeholder="Campus Photo URL..."
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-855 border border-slate-200 dark:border-slate-800 rounded-xl text-xs text-slate-800 dark:text-slate-200"
                  />
                </div>

                {/* Infrastructure checklist */}
                <div className="flex flex-wrap gap-4 py-1.5 text-slate-700 dark:text-slate-350">
                  <label className="flex items-center space-x-2 cursor-pointer select-none">
                    <input
                      type="checkbox"
                      checked={autonomous}
                      onChange={(e) => setAutonomous(e.target.checked)}
                      className="w-4 h-4 rounded border-slate-300 text-primary"
                    />
                    <span>Autonomous</span>
                  </label>
                  <label className="flex items-center space-x-2 cursor-pointer select-none">
                    <input
                      type="checkbox"
                      checked={hostel}
                      onChange={(e) => setHostel(e.target.checked)}
                      className="w-4 h-4 rounded border-slate-300 text-primary"
                    />
                    <span>Hostel</span>
                  </label>
                  <label className="flex items-center space-x-2 cursor-pointer select-none">
                    <input
                      type="checkbox"
                      checked={transport}
                      onChange={(e) => setTransport(e.target.checked)}
                      className="w-4 h-4 rounded border-slate-300 text-primary"
                    />
                    <span>Transport</span>
                  </label>
                </div>

                {/* Submits */}
                <div className="flex gap-2.5 pt-2">
                  <button
                    type="submit"
                    disabled={submittingCollege}
                    className="flex-grow py-2.5 bg-primary hover:bg-primary-hover disabled:bg-primary/50 text-white font-bold rounded-xl active:scale-95 transition-all text-xs uppercase tracking-widest cursor-pointer"
                  >
                    {submittingCollege ? "Submitting..." : editingCollegeId ? "Save Profile" : "Create Profile"}
                  </button>
                  {editingCollegeId && (
                    <button
                      type="button"
                      onClick={resetForm}
                      className="px-4 py-2.5 border border-slate-200 dark:border-slate-800 text-slate-500 hover:bg-slate-50 rounded-xl cursor-pointer"
                    >
                      Cancel
                    </button>
                  )}
                </div>

              </form>
            </div>

            {/* Right list (2 columns) */}
            <div className="lg:col-span-2 space-y-4">
              <h3 className="font-bold text-slate-855 dark:text-white text-base border-b border-slate-200 dark:border-slate-900 pb-3">
                Campuses Directory ({colleges.length})
              </h3>

              <div className="border border-slate-200 dark:border-slate-900 rounded-2xl overflow-hidden bg-white dark:bg-slate-900 shadow-sm transition-colors duration-300">
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs font-semibold">
                    <thead className="bg-slate-50 dark:bg-slate-850/50 border-b border-slate-200 dark:border-slate-855 text-[10px] font-bold text-slate-500 uppercase tracking-widest">
                      <tr>
                        <th className="px-6 py-3">College Name</th>
                        <th className="px-6 py-3">District</th>
                        <th className="px-6 py-3">Type</th>
                        <th className="px-6 py-3">Annual Fees</th>
                        <th className="px-6 py-3 text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-150 dark:divide-slate-855 text-slate-700 dark:text-slate-350">
                      {colleges.map((c) => (
                        <tr key={c.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-850/10">
                          <td className="px-6 py-4 font-bold max-w-[200px] truncate">{c.name}</td>
                          <td className="px-6 py-4">{c.district}</td>
                          <td className="px-6 py-4">{c.type}</td>
                          <td className="px-6 py-4">₹{c.fees.toLocaleString()}/yr</td>
                          <td className="px-6 py-4 text-right flex items-center justify-end space-x-2">
                            <button
                              onClick={() => handleStartEdit(c)}
                              className="p-1.5 text-primary hover:bg-primary/5 rounded-lg transition-colors cursor-pointer"
                              title="Edit college"
                            >
                              <Edit2 className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => handleDeleteCollege(c.id)}
                              className="p-1.5 text-accent-red hover:bg-accent-red/5 rounded-lg transition-colors cursor-pointer"
                              title="Delete college"
                            >
                              <Trash2 className="w-4 h-4" />
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

        {/* Moderate Reviews Tab */}
        {activeTab === "reviews" && (
          <div className="space-y-4 animate-in fade-in duration-200">
            <h3 className="font-bold text-slate-855 dark:text-white text-base border-b border-slate-205 dark:border-slate-850 pb-3">
              Submitted Review Board ({reviews.length})
            </h3>

            {reviews.length > 0 ? (
              <div className="border border-slate-200/80 dark:border-slate-900 rounded-2xl overflow-hidden bg-white dark:bg-slate-900 shadow-sm transition-colors duration-300">
                <div className="overflow-x-auto animate-in fade-in">
                  <table className="w-full text-left text-xs font-semibold">
                    <thead className="bg-slate-50 dark:bg-slate-850/50 border-b border-slate-200 dark:border-slate-855 text-[10px] font-bold text-slate-500 uppercase tracking-widest">
                      <tr>
                        <th className="px-6 py-3">College</th>
                        <th className="px-6 py-3">User</th>
                        <th className="px-6 py-3">Rating</th>
                        <th className="px-6 py-3 max-w-sm">Comment</th>
                        <th className="px-6 py-3">Status</th>
                        <th className="px-6 py-3 text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-150 dark:divide-slate-855 text-slate-700 dark:text-slate-350">
                      {reviews.map((r) => (
                        <tr key={r.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-850/10">
                          <td className="px-6 py-4 font-bold max-w-[150px] truncate">{r.college.name}</td>
                          <td className="px-6 py-4">
                            <p className="font-bold">{r.user.name}</p>
                            <p className="text-[10px] text-slate-400 font-medium">{r.user.email}</p>
                          </td>
                          <td className="px-6 py-4">
                            <div className="flex items-center text-accent-yellow">
                              <Star className="w-3.5 h-3.5 fill-current" />
                              <span className="ml-1 font-extrabold text-slate-800 dark:text-slate-200">{r.rating}</span>
                            </div>
                          </td>
                          <td className="px-6 py-4 max-w-sm truncate" title={r.comment}>
                            {r.comment}
                          </td>
                          <td className="px-6 py-4">
                            <span
                              className={`text-[9px] font-black uppercase px-2 py-0.5 rounded border ${
                                r.approved
                                  ? "bg-accent-green/10 text-accent-green border-accent-green/20"
                                  : "bg-accent-yellow/10 text-accent-yellow border-accent-yellow/20"
                              }`}
                            >
                              {r.approved ? "Approved" : "Pending"}
                            </span>
                          </td>
                          <td className="px-6 py-4 text-right flex items-center justify-end space-x-2">
                            <button
                              onClick={() => handleToggleReviewApproval(r.id, r.approved)}
                              className={`p-1.5 rounded-lg border transition-colors cursor-pointer ${
                                r.approved
                                  ? "border-accent-yellow/30 text-accent-yellow hover:bg-accent-yellow/5"
                                  : "border-accent-green/30 text-accent-green hover:bg-accent-green/5"
                              }`}
                              title={r.approved ? "Disapprove review" : "Approve review"}
                            >
                              {r.approved ? <X className="w-4 h-4" /> : <Check className="w-4 h-4" />}
                            </button>
                            <button
                              onClick={() => handleDeleteReview(r.id)}
                              className="p-1.5 border border-slate-200 dark:border-slate-800 text-accent-red hover:bg-accent-red/5 rounded-lg transition-colors cursor-pointer"
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
              <div className="bg-white dark:bg-slate-900 border p-12 text-center rounded-2xl text-slate-400 italic text-xs font-semibold">
                No submitted student reviews found.
              </div>
            )}
          </div>
        )}

        {/* Registered Users Tab */}
        {activeTab === "users" && (
          <div className="space-y-4 animate-in fade-in duration-200">
            <h3 className="font-bold text-slate-855 dark:text-white text-base border-b border-slate-205 dark:border-slate-850 pb-3">
              User Profiles Directory ({users.length})
            </h3>

            <div className="border border-slate-200 dark:border-slate-900 rounded-2xl overflow-hidden bg-white dark:bg-slate-900 shadow-sm transition-colors duration-300">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs font-semibold">
                  <thead className="bg-slate-50 dark:bg-slate-850/50 border-b border-slate-200 dark:border-slate-855 text-[10px] font-bold text-slate-500 uppercase tracking-widest">
                    <tr>
                      <th className="px-6 py-3">Account Name</th>
                      <th className="px-6 py-3">Email Address</th>
                      <th className="px-6 py-3">Role</th>
                      <th className="px-6 py-3">Target Branch</th>
                      <th className="px-6 py-3">Max Budget</th>
                      <th className="px-6 py-3">Joined Date</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-150 dark:divide-slate-855 text-slate-750 dark:text-slate-350">
                    {users.map((u) => (
                      <tr key={u.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-850/10">
                        <td className="px-6 py-4 font-bold">{u.name}</td>
                        <td className="px-6 py-4">{u.email}</td>
                        <td className="px-6 py-4">
                          <span
                            className={`text-[9px] font-black uppercase tracking-wider px-2 py-0.5 rounded border ${
                              u.role === "ADMIN"
                                ? "bg-accent-red/10 text-accent-red border-accent-red/20"
                                : "bg-primary/10 text-primary border-primary/20"
                            }`}
                          >
                            {u.role}
                          </span>
                        </td>
                        <td className="px-6 py-4 truncate max-w-[150px]">{u.preferredBranch || "Any"}</td>
                        <td className="px-6 py-4 font-bold">
                          {u.budget ? `₹${u.budget.toLocaleString()}/yr` : "Any"}
                        </td>
                        <td className="px-6 py-4 text-slate-400 font-medium">
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
