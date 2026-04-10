import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { useNavigate } from "react-router";
import {
  ShieldAlert,
  CheckCircle2,
  XCircle,
  Clock,
  AlertCircle,
  Building2,
  Calendar,
  DollarSign,
  LogOut,
  Search,
  MessageSquareX,
  Lock,
  User,
  Eye,
  EyeOff,
  ArrowRight,
  TrendingUp,
  Instagram,
  Facebook,
  Youtube,
  Linkedin,
  Twitter,
  Globe,
  ChevronDown,
  ChevronUp
} from "lucide-react";
import { Button } from "../../components/ui/button";
import { toast } from "sonner";

type CampaignStatus = "pending" | "in_review" | "approved" | "rejected";

interface Campaign {
  id: string;
  businessName: string;
  userName?: string;
  userEmail?: string;
  adImage?: string;
  name: string;
  platforms: string[];
  budget: string;
  duration?: string;
  dateSubmitted: string;
  status: CampaignStatus;
  rejectionReason?: string;
  analytics?: Record<string, any>;
  createdAt?: string;
}

export default function AdminDashboard() {
  const navigate = useNavigate();
  
  // Authentication State
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(() => {
    return sessionStorage.getItem("adminAuthenticated") === "true";
  });
  const [adminId, setAdminId] = useState("");
  const [adminPassword, setAdminPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoggingIn, setIsLoggingIn] = useState(false);

  // Dashboard State
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);
  const [filter, setFilter] = useState<CampaignStatus | "all">("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [expandedDetails, setExpandedDetails] = useState<Set<string>>(new Set());
  
  // Modal state for rejection
  const [rejectModalOpen, setRejectModalOpen] = useState(false);
  const [rejectReason, setRejectReason] = useState("");
  const [selectedCampaignId, setSelectedCampaignId] = useState<string | null>(null);

  useEffect(() => {
    if (isAuthenticated) {
      loadCampaigns();
    }
  }, [isAuthenticated]);

  const loadCampaigns = () => {
    const raw = localStorage.getItem("userCampaigns");
    if (!raw) return;
    try {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed)) {
        setCampaigns(parsed);
      } else {
        const legacy: Campaign[] = [
          ...(parsed.inReview || []).map((c: any) => ({
            ...c,
            businessName: c.businessName || c.name || "Unknown",
            dateSubmitted: c.createdAt || new Date().toISOString(),
            status: "in_review" as CampaignStatus,
          })),
          ...(parsed.history || []).map((c: any) => ({
            ...c,
            businessName: c.businessName || c.name || "Unknown",
            dateSubmitted: c.createdAt || new Date().toISOString(),
            status: c.status === "active" ? "approved" : c.status,
          })),
        ];
        setCampaigns(legacy);
        localStorage.setItem("userCampaigns", JSON.stringify(legacy));
      }
    } catch (e) {
      console.error("Error parsing campaigns", e);
    }
  };

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (!adminId || !adminPassword) {
      toast.error("Please enter both ID and password");
      return;
    }
    
    setIsLoggingIn(true);
    setTimeout(() => {
      if (adminId === "admin" && adminPassword === "admin") {
        sessionStorage.setItem("adminAuthenticated", "true");
        setIsAuthenticated(true);
        toast.success("Welcome, Admin");
      } else {
        toast.error("Invalid credentials", { description: "Try ID: admin, Password: admin" });
      }
      setIsLoggingIn(false);
    }, 1200);
  };

  const handleLogout = () => {
    sessionStorage.removeItem("adminAuthenticated");
    setIsAuthenticated(false);
    toast.info("Logged out safely");
    navigate("/");
  };

  const addNotification = (type: string, message: string) => {
    const raw = localStorage.getItem("adminNotifications") || "[]";
    const notifications = JSON.parse(raw);
    notifications.unshift({
      id: crypto.randomUUID(),
      type,
      message,
      timestamp: new Date().toISOString(),
      dismissed: false
    });
    localStorage.setItem("adminNotifications", JSON.stringify(notifications));
  };

  const updateCampaignStatus = (id: string, newStatus: CampaignStatus, reason?: string) => {
    const updated = campaigns.map(camp => {
      if (camp.id !== id) return camp;
      
      const newCampaign = { ...camp, status: newStatus };
      if (reason) {
        newCampaign.rejectionReason = reason;
      }
      
      if (newStatus === "approved" && !newCampaign.analytics) {
        newCampaign.analytics = {
          impressions: Math.floor(Math.random() * 50000) + 10000,
          reach: Math.floor(Math.random() * 30000) + 5000,
          clicks: Math.floor(Math.random() * 3000) + 500,
          ctr: (Math.random() * (4.5 - 1.2) + 1.2).toFixed(2),
          conversions: Math.floor(Math.random() * 200) + 20,
          adSpend: Math.floor(Math.random() * Number(camp.budget?.replace(/\D/g, "") || 1000)) * 0.8,
          roas: (Math.random() * (5.5 - 1.5) + 1.5).toFixed(2),
        };
      }
      return newCampaign;
    });

    setCampaigns(updated);
    localStorage.setItem("userCampaigns", JSON.stringify(updated));

    const campaignName = updated.find(c => c.id === id)?.name || "A campaign";
    let message = "";
    if (newStatus === "approved") {
      message = `Your campaign "${campaignName}" has been approved and is now active!`;
      toast.success("Campaign approved");
    } else if (newStatus === "rejected") {
      message = `Your campaign "${campaignName}" was rejected.`;
      toast.error("Campaign rejected");
    } else if (newStatus === "in_review") {
      message = `Your campaign "${campaignName}" is currently under review by our team.`;
      toast.info("Moved to In Review");
    }

    if (message && newStatus !== "pending") {
      addNotification(`campaign_${newStatus}`, message);
    }
  };

  const handleApprove = (id: string) => updateCampaignStatus(id, "approved");
  const handleSetInReview = (id: string) => updateCampaignStatus(id, "in_review");

  const openRejectModal = (id: string) => {
    setSelectedCampaignId(id);
    setRejectReason("");
    setRejectModalOpen(true);
  };

  const confirmReject = () => {
    if (!selectedCampaignId) return;
    if (!rejectReason.trim()) {
      toast.error("Reason is required");
      return;
    }
    updateCampaignStatus(selectedCampaignId, "rejected", rejectReason);
    setRejectModalOpen(false);
    setSelectedCampaignId(null);
  };

  const toggleDetailsExpand = (id: string) => {
    setExpandedDetails((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const getPlatformIcon = (platform: string) => {
    switch (platform.toLowerCase()) {
      case "instagram": return <Instagram className="w-3 h-3" />;
      case "facebook": return <Facebook className="w-3 h-3" />;
      case "youtube": return <Youtube className="w-3 h-3" />;
      case "twitter": return <Twitter className="w-3 h-3" />;
      case "linkedin": return <Linkedin className="w-3 h-3" />;
      default: return <Globe className="w-3 h-3" />;
    }
  };

  const filteredCampaigns = campaigns.filter(c => {
    const matchesFilter = filter === "all" || c.status === filter;
    const matchesSearch = c.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          c.businessName.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  const getStatusConfig = (status: CampaignStatus) => {
    switch (status) {
      case "pending":
        return {
          icon: <Clock className="w-3.5 h-3.5" />,
          color: "text-yellow-400",
          bg: "bg-yellow-500/15 border-yellow-400/40",
          cardAccent: "from-yellow-900/10 to-transparent",
          cardBorder: "border-yellow-500/30",
        };
      case "in_review":
        return {
          icon: <AlertCircle className="w-3.5 h-3.5" />,
          color: "text-blue-400",
          bg: "bg-blue-500/15 border-blue-400/40",
          cardAccent: "from-blue-900/10 to-transparent",
          cardBorder: "border-blue-500/30",
        };
      case "approved":
        return {
          icon: <CheckCircle2 className="w-3.5 h-3.5" />,
          color: "text-green-400",
          bg: "bg-green-500/15 border-green-400/40",
          cardAccent: "from-green-900/10 to-transparent",
          cardBorder: "border-green-500/30",
        };
      case "rejected":
        return {
          icon: <XCircle className="w-3.5 h-3.5" />,
          color: "text-red-400",
          bg: "bg-red-500/15 border-red-400/40",
          cardAccent: "from-red-900/10 to-transparent",
          cardBorder: "border-red-500/30",
        };
    }
  };

  // --- RENDERING LOGIN SCREEN ---
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-[#05071a] flex items-center justify-center p-4 relative overflow-hidden" style={{ background: "linear-gradient(135deg, #05071a 0%, #0a0e2c 50%, #060918 100%)" }}>
        {/* Glow effects */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-indigo-600/20 rounded-full blur-[120px] pointer-events-none" />
        <div className="absolute bottom-0 right-0 w-[400px] h-[400px] bg-cyan-600/10 rounded-full blur-[100px] pointer-events-none" />
        
        {/* Circuit Pattern */}
        <div className="absolute inset-0 opacity-[0.03] pointer-events-none">
          <svg className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <pattern id="circuit" x="0" y="0" width="100" height="100" patternUnits="userSpaceOnUse">
                <circle cx="50" cy="50" r="2" fill="#fff" />
                <line x1="50" y1="50" x2="100" y2="50" stroke="#fff" strokeWidth="0.5" />
                <line x1="50" y1="50" x2="50" y2="0" stroke="#fff" strokeWidth="0.5" />
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#circuit)" />
          </svg>
        </div>

        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="w-full max-w-md relative z-10"
        >
          <div className="bg-white/[0.04] backdrop-blur-2xl border border-white/[0.08] shadow-[0_8px_32px_0_rgba(0,0,0,0.36)] rounded-3xl p-8 lg:p-10 relative overflow-hidden">
            {/* Inner top highlight */}
            <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-indigo-500/50 to-transparent" />
            
            <motion.div 
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.2, duration: 0.5 }}
              className="w-16 h-16 bg-gradient-to-br from-indigo-500 via-purple-600 to-cyan-500 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-[0_0_40px_rgba(99,102,241,0.4)]"
            >
              <ShieldAlert className="w-8 h-8 text-white" />
            </motion.div>
            
            <div className="text-center mb-8">
              <h2 className="text-3xl font-bold text-white mb-2 tracking-tight bg-gradient-to-r from-white to-gray-400 bg-clip-text text-transparent">Administrator</h2>
              <p className="text-gray-400 text-sm">Sign in to review and manage campaigns.</p>
            </div>

            <form onSubmit={handleLogin} className="space-y-5">
              <div className="space-y-2">
                <label className="block text-[11px] font-semibold uppercase tracking-widest text-gray-500 ml-1">Admin ID</label>
                <div className="relative group">
                  <User className="w-4 h-4 text-gray-500 absolute left-4 top-1/2 -translate-y-1/2 group-focus-within:text-indigo-400 transition-colors z-10" />
                  <input
                    type="text"
                    value={adminId}
                    onChange={(e) => setAdminId(e.target.value)}
                    placeholder="e.g. admin"
                    className="w-full h-12 bg-black/20 border border-white/10 rounded-xl pl-11 pr-4 text-[15px] text-white placeholder-gray-600 outline-none focus:border-indigo-500/50 focus:bg-black/40 focus:ring-4 focus:ring-indigo-500/10 transition-all font-light"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex justify-between items-center ml-1">
                  <label className="block text-[11px] font-semibold uppercase tracking-widest text-gray-500">Password</label>
                </div>
                <div className="relative group">
                  <Lock className="w-4 h-4 text-gray-500 absolute left-4 top-1/2 -translate-y-1/2 group-focus-within:text-indigo-400 transition-colors z-10" />
                  <input
                    type={showPassword ? "text" : "password"}
                    value={adminPassword}
                    onChange={(e) => setAdminPassword(e.target.value)}
                    placeholder="Enter your secure password"
                    className="w-full h-12 bg-black/20 border border-white/10 rounded-xl pl-11 pr-11 text-[15px] text-white placeholder-gray-600 outline-none focus:border-indigo-500/50 focus:bg-black/40 focus:ring-4 focus:ring-indigo-500/10 transition-all font-light"
                  />
                  <button 
                    type="button" 
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-300 transition-colors z-10"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <button
                type="submit"
                disabled={isLoggingIn}
                className="w-full h-12 mt-8 rounded-xl bg-gradient-to-r from-indigo-500 via-purple-600 to-cyan-600 hover:from-indigo-400 hover:via-purple-500 hover:to-cyan-500 text-white font-semibold flex items-center justify-center gap-2 group transition-all duration-300 shadow-[0_0_30px_rgba(99,102,241,0.3)] hover:shadow-[0_0_40px_rgba(99,102,241,0.5)] hover:-translate-y-0.5 disabled:opacity-70 disabled:hover:translate-y-0 disabled:hover:shadow-none"
              >
                {isLoggingIn ? (
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                ) : (
                  <>
                    Sign In to Portal
                    <ArrowRight className="w-4 h-4 group-hover:translate-x-1.5 transition-transform" />
                  </>
                )}
              </button>
            </form>
            
            <button onClick={() => navigate("/")} className="w-full mt-6 text-xs font-medium text-gray-500 hover:text-white transition-colors text-center">
              ← Return to Main Website
            </button>
          </div>
        </motion.div>
      </div>
    );
  }

  // --- RENDERING ADMIN DASHBOARD ---
  return (
    <div className="min-h-screen bg-[#0a0e27] text-white selection:bg-indigo-500/30 overflow-x-hidden relative">
      
      {/* Dynamic Background */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <div className="absolute top-1/4 right-1/4 w-[500px] h-[500px] bg-purple-600/10 rounded-full blur-[120px] animate-pulse" />
        <div className="absolute bottom-1/3 left-1/4 w-[400px] h-[400px] bg-cyan-600/10 rounded-full blur-[100px] animate-pulse delay-1000" />
        <div className="absolute inset-0 opacity-[0.03]">
          <svg className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <pattern id="circuit-admin" x="0" y="0" width="100" height="100" patternUnits="userSpaceOnUse">
                <circle cx="50" cy="50" r="2" fill="#fff" />
                <line x1="50" y1="50" x2="100" y2="50" stroke="#fff" strokeWidth="0.5" />
                <line x1="50" y1="50" x2="50" y2="0" stroke="#fff" strokeWidth="0.5" />
                <circle cx="0" cy="50" r="2" fill="#a855f7" />
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#circuit-admin)" />
          </svg>
        </div>
      </div>
      
      {/* Top Navbar */}
      <header className="sticky top-0 z-40 bg-black/40 backdrop-blur-xl border-b border-white/10 px-6 h-16 flex items-center justify-between shadow-lg">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-indigo-500 to-cyan-500 flex items-center justify-center shadow-[0_0_20px_rgba(99,102,241,0.3)]">
            <ShieldAlert className="w-4.5 h-4.5 text-white" />
          </div>
          <span className="font-bold tracking-tight text-xl bg-gradient-to-r from-white via-indigo-200 to-gray-400 bg-clip-text text-transparent">
            Admin Portal
          </span>
        </div>
        
        <div className="flex items-center gap-5">
          <div className="relative group hidden md:block">
            <Search className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2 group-focus-within:text-cyan-400 transition-colors" />
            <input 
              type="text" 
              placeholder="Search campaigns..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9 pr-4 py-1.5 w-64 bg-white/5 border border-white/10 rounded-full text-sm outline-none focus:border-cyan-500/50 focus:bg-white/10 focus:ring-2 focus:ring-cyan-500/10 transition-all font-light"
            />
          </div>
          <div className="h-6 w-px bg-white/10 hidden md:block"></div>
          <Button 
            variant="ghost" 
            onClick={handleLogout}
            className="text-gray-400 hover:text-white hover:bg-white/10 gap-2 rounded-full px-4"
          >
            <LogOut className="w-4 h-4 text-red-400" />
            <span className="hidden sm:inline">Logout</span>
          </Button>
        </div>
      </header>

      <main className="max-w-7xl mx-auto p-6 lg:p-8 relative z-10 min-h-screen">
        
        {/* Header Section */}
        <div className="mb-10 mt-4 flex flex-col md:flex-row gap-4 items-start md:items-end justify-between">
          <div>
            <h1 className="text-4xl font-bold text-white tracking-tight mb-2">
              Campaign Queue
            </h1>
            <p className="text-gray-400 text-[15px]">
              Review user content and determine approval status securely.
            </p>
          </div>
        </div>

        {/* Stats Row */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="grid grid-cols-2 md:grid-cols-5 gap-4 lg:gap-6 mb-10"
        >
          {[
            { label: "Total", count: campaigns.length, color: "text-white", border: "border-white/10", glow: "group-hover:shadow-[0_0_20px_rgba(255,255,255,0.05)]" },
            { label: "Pending", count: campaigns.filter(c => c.status === "pending").length, color: "text-yellow-400", border: "border-yellow-500/20", glow: "group-hover:shadow-[0_0_25px_rgba(234,179,8,0.15)]" },
            { label: "In Review", count: campaigns.filter(c => c.status === "in_review").length, color: "text-blue-400", border: "border-blue-500/20", glow: "group-hover:shadow-[0_0_25px_rgba(59,130,246,0.15)]" },
            { label: "Approved", count: campaigns.filter(c => c.status === "approved").length, color: "text-green-400", border: "border-green-500/20", glow: "group-hover:shadow-[0_0_25px_rgba(34,197,94,0.15)]" },
            { label: "Rejected", count: campaigns.filter(c => c.status === "rejected").length, color: "text-red-400", border: "border-red-500/20", glow: "group-hover:shadow-[0_0_25px_rgba(239,68,68,0.15)]" },
          ].map((stat, i) => (
            <div 
              key={i} 
              className={`group bg-gradient-to-br from-white/[0.05] to-transparent border ${stat.border} rounded-2xl p-5 flex flex-col justify-center backdrop-blur-sm transition-all duration-300 hover:-translate-y-1 hover:bg-white/[0.08] ${stat.glow}`}
            >
              <span className="text-xs text-gray-400 uppercase tracking-widest font-semibold mb-1.5">{stat.label}</span>
              <span className={`text-4xl font-bold ${stat.color} tracking-tight`}>{stat.count}</span>
            </div>
          ))}
        </motion.div>

        {/* Filters */}
        <div className="flex items-center gap-3 overflow-x-auto pb-6 scrollbar-hide">
          <span className="text-xs font-semibold text-gray-500 uppercase tracking-widest mr-2 shrink-0">Filter By</span>
          {(["all", "pending", "in_review", "approved", "rejected"] as const).map((f) => {
            const isActive = filter === f;
            return (
              <button
                key={f}
                onClick={() => setFilter(f)}
                className={`px-5 py-2 rounded-full text-[13px] font-semibold transition-all capitalize shrink-0 flex items-center justify-center ${
                  isActive 
                    ? "bg-gradient-to-r from-indigo-500 to-cyan-500 text-white shadow-[0_0_15px_rgba(99,102,241,0.3)] border-transparent" 
                    : "bg-white/[0.03] text-gray-400 hover:bg-white/10 hover:text-white border border-white/10"
                }`}
              >
                {f.replace("_", " ")}
              </button>
            )
          })}
        </div>

        {/* Campaigns List */}
        <div className="space-y-4">
          <AnimatePresence>
            {filteredCampaigns.length === 0 ? (
              <motion.div 
                initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0 }}
                className="text-center py-24 bg-white/[0.02] border border-white/5 rounded-3xl backdrop-blur-sm"
              >
                <div className="w-20 h-20 bg-white/5 border border-white/10 rounded-2xl flex items-center justify-center mx-auto mb-5">
                  <ShieldAlert className="w-8 h-8 text-gray-500" />
                </div>
                <h3 className="text-xl text-gray-300 font-semibold mb-2 tracking-tight">No campaigns found</h3>
                <p className="text-gray-500 text-sm">Waiting for users to submit new content.</p>
              </motion.div>
            ) : (
              filteredCampaigns.map((campaign, index) => {
                const config = getStatusConfig(campaign.status);
                const isExpanded = expandedDetails.has(campaign.id);
                
                return (
                  <motion.div
                    key={campaign.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    transition={{ delay: index * 0.05 }}
                    className={`bg-gradient-to-br ${config.cardAccent} bg-white/[0.02] border ${config.cardBorder} hover:border-opacity-60 rounded-3xl overflow-hidden backdrop-blur-md transition-all duration-300 group`}
                  >
                    <div className="p-6 md:p-8 flex flex-col xl:flex-row gap-8">
                      {/* Left: Info */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-4 mb-4">
                          <span className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full border text-xs font-bold uppercase tracking-wider ${config.color} ${config.bg}`}>
                            {config.icon}
                            {campaign.status.replace("_", " ")}
                          </span>
                          <span className="text-gray-500 text-sm flex items-center gap-1.5 font-medium">
                            <Clock className="w-4 h-4" />
                            {new Date(campaign.dateSubmitted || campaign.createdAt || "").toLocaleDateString()}
                          </span>
                        </div>
                        
                        <div className="flex items-center gap-4 mb-2">
                          <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-indigo-500/20 to-purple-500/20 border border-indigo-500/20 flex items-center justify-center shrink-0">
                            <Building2 className="w-6 h-6 text-indigo-400" />
                          </div>
                          <div className="min-w-0">
                            <h3 className="text-2xl font-bold text-white truncate leading-tight tracking-tight shadow-sm">
                              {campaign.name}
                            </h3>
                            <p className="text-gray-400 font-medium truncate">{campaign.businessName}</p>
                          </div>
                        </div>

                        {/* Collapsible Content Focus */}
                        <div className="mt-6 border-t border-white/5 pt-5">
                           <button 
                             onClick={() => toggleDetailsExpand(campaign.id)}
                             className="flex items-center gap-2 text-cyan-400 hover:text-cyan-300 text-sm font-semibold transition-colors w-max group/btn"
                           >
                             {isExpanded ? <ChevronUp className="w-4 h-4 group-hover/btn:-translate-y-0.5 transition-transform"/> : <ChevronDown className="w-4 h-4 group-hover/btn:translate-y-0.5 transition-transform"/>}
                             {isExpanded ? "Hide Details" : "View Campaign Content"}
                           </button>
                           
                           <AnimatePresence>
                             {isExpanded && (
                               <motion.div
                                 initial={{ opacity: 0, height: 0 }}
                                 animate={{ opacity: 1, height: "auto" }}
                                 exit={{ opacity: 0, height: 0 }}
                                 className="mt-4 overflow-hidden"
                               >
                                 <div className="p-5 bg-black/40 border border-white/5 rounded-2xl flex flex-col md:flex-row gap-6">
                                    <div className="md:w-1/3 shrink-0">
                                      {campaign.adImage ? (
                                        <div className="aspect-square rounded-xl overflow-hidden border border-white/10 bg-black/50 shadow-inner">
                                            <img src={campaign.adImage} className="w-full h-full object-cover" alt="Ad Preview" />
                                        </div>
                                      ) : (
                                        <div className="aspect-square rounded-xl flex items-center justify-center border border-white/10 bg-black/50">
                                          <p className="text-gray-500 text-xs font-semibold uppercase tracking-widest">No Media Attached</p>
                                        </div>
                                      )}
                                    </div>
                                    <div className="md:w-2/3 flex flex-col justify-center py-2">
                                      <div className="mb-4">
                                        <h4 className="text-gray-400 text-xs font-bold uppercase tracking-widest mb-3">Submitter Profile</h4>
                                        <div className="space-y-1.5 bg-white/[0.02] p-3 rounded-xl border border-white/5">
                                          <p className="text-sm text-gray-400">Name: <span className="text-white font-medium ml-2">{campaign.userName || "Unknown User"}</span></p>
                                          <p className="text-sm text-gray-400">Email: <span className="text-cyan-400 font-medium ml-2">{campaign.userEmail || "No Email Provided"}</span></p>
                                        </div>
                                      </div>
                                      
                                      <div className="mt-auto">
                                        <p className="text-sm text-gray-300 leading-relaxed italic border-l-2 border-indigo-500/50 pl-4 py-1">
                                          "This campaign aims to maximize engagement and reach target demographics utilizing the provided media assets."
                                        </p>
                                      </div>
                                    </div>
                                 </div>
                               </motion.div>
                             )}
                           </AnimatePresence>
                        </div>

                        {/* Meta Tags */}
                        <div className="flex flex-wrap gap-4 mt-6">
                          <div className="flex items-center gap-2 px-3 py-1.5 bg-white/5 rounded-lg border border-white/10">
                            <DollarSign className="w-4 h-4 text-emerald-400" />
                            <span className="font-semibold text-gray-200 text-sm">{campaign.budget}</span>
                          </div>
                          {campaign.duration && (
                            <div className="flex items-center gap-2 px-3 py-1.5 bg-white/5 rounded-lg border border-white/10">
                              <TrendingUp className="w-4 h-4 text-purple-400" />
                              <span className="font-semibold text-gray-200 text-sm">{campaign.duration}</span>
                            </div>
                          )}
                          <div className="flex items-center gap-2 px-3 py-1.5 bg-white/5 rounded-lg border border-white/10">
                            <span className="text-gray-400 text-xs font-semibold mr-1">TGT:</span>
                            <div className="flex gap-2">
                              {campaign.platforms.map(p => (
                                <span key={p} className="text-gray-300" title={p}>
                                  {getPlatformIcon(p)}
                                </span>
                              ))}
                            </div>
                          </div>
                        </div>

                        {campaign.rejectionReason && campaign.status === "rejected" && (
                          <div className="mt-5 p-4 bg-red-500/10 border border-red-500/30 rounded-2xl relative overflow-hidden">
                            <div className="absolute top-0 left-0 w-1 h-full bg-red-500"></div>
                            <strong className="text-red-400 block mb-1.5 text-sm uppercase tracking-widest font-bold">Rejection Reason:</strong>
                            <p className="text-sm text-red-100/80 leading-relaxed">{campaign.rejectionReason}</p>
                          </div>
                        )}
                      </div>

                      {/* Right: Actions */}
                      <div className="flex flex-col gap-3 shrink-0 xl:w-56 pt-4 border-t border-white/5 xl:border-t-0 xl:pt-0 xl:pl-8 xl:border-l">
                        {(campaign.status === "pending" || campaign.status === "rejected") && (
                          <Button
                            onClick={() => handleSetInReview(campaign.id)}
                            className="w-full h-12 bg-blue-500/10 hover:bg-blue-500/20 text-blue-400 border border-blue-500/30 rounded-xl font-semibold transition-all hover:shadow-[0_0_15px_rgba(59,130,246,0.2)]"
                            variant="outline"
                          >
                            <AlertCircle className="w-4 h-4 mr-2" />
                            To 'In Review'
                          </Button>
                        )}
                        
                        <Button
                          onClick={() => handleApprove(campaign.id)}
                          disabled={campaign.status === "approved"}
                          className="w-full h-12 bg-gradient-to-r from-emerald-500 to-green-600 hover:from-emerald-400 hover:to-green-500 text-white shadow-[0_0_20px_rgba(16,185,129,0.3)] hover:shadow-[0_0_30px_rgba(16,185,129,0.5)] rounded-xl font-bold disabled:opacity-50 disabled:shadow-none transition-all hover:-translate-y-0.5 border-none"
                        >
                          <CheckCircle2 className="w-5 h-5 mr-2" />
                          Approve
                        </Button>
                        
                        <Button
                          onClick={() => openRejectModal(campaign.id)}
                          disabled={campaign.status === "rejected"}
                          variant="destructive"
                          className="w-full h-12 bg-red-500/10 hover:bg-red-500/20 text-red-500 border border-red-500/30 hover:border-red-500/50 rounded-xl font-semibold transition-all hover:shadow-[0_0_15px_rgba(239,68,68,0.2)]"
                        >
                          <XCircle className="w-4 h-4 mr-2" />
                          Reject
                        </Button>
                      </div>
                    </div>
                  </motion.div>
                );
              })
            )}
          </AnimatePresence>
        </div>
      </main>

      {/* Reject Modal */}
      <AnimatePresence>
        {rejectModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }} 
              animate={{ opacity: 1 }} 
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-black/80 backdrop-blur-sm"
              onClick={() => setRejectModalOpen(false)}
            />
            <motion.div 
              initial={{ opacity: 0, scale: 0.9, y: 20 }} 
              animate={{ opacity: 1, scale: 1, y: 0 }} 
              exit={{ opacity: 0, scale: 0.95, y: -20 }}
              transition={{ type: "spring", stiffness: 300, damping: 25 }}
              className="relative w-full max-w-lg bg-[#0e122b] border border-red-500/30 shadow-[0_0_50px_rgba(239,68,68,0.15)] rounded-3xl overflow-hidden"
            >
              {/* Modal Top Accent */}
              <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-red-600 via-rose-500 to-red-600"></div>

              <div className="p-8">
                <div className="w-14 h-14 bg-red-500/10 border border-red-500/20 rounded-2xl flex items-center justify-center mb-6">
                   <MessageSquareX className="w-7 h-7 text-red-400" />
                </div>
                
                <h2 className="text-2xl font-bold text-white mb-2">Reject Campaign</h2>
                <p className="text-sm text-gray-400 mb-6 leading-relaxed">
                  Please provide a clear reason for rejecting this campaign. The user will see this feedback directly in their dashboard.
                </p>
                
                <textarea
                  value={rejectReason}
                  onChange={(e) => setRejectReason(e.target.value)}
                  placeholder="e.g., The provided creative violates our content policy regarding..."
                  className="w-full h-36 bg-black/40 border border-white/10 rounded-2xl p-4 text-[15px] text-gray-200 placeholder-gray-600 focus:outline-none focus:border-red-500/50 focus:ring-4 focus:ring-red-500/10 resize-none transition-all"
                />
                
                <div className="flex flex-col-reverse sm:flex-row items-center gap-3 mt-8">
                  <Button 
                    variant="ghost" 
                    onClick={() => setRejectModalOpen(false)} 
                    className="w-full sm:w-auto h-12 px-6 rounded-xl text-gray-400 hover:text-white hover:bg-white/5 font-semibold"
                  >
                    Cancel
                  </Button>
                  <Button 
                    onClick={confirmReject} 
                    variant="destructive" 
                    className="w-full sm:w-auto h-12 px-6 rounded-xl bg-red-500 hover:bg-red-600 text-white font-bold shadow-[0_0_20px_rgba(239,68,68,0.3)] ml-auto"
                  >
                    Confirm Rejection
                  </Button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </div>
  );
}
