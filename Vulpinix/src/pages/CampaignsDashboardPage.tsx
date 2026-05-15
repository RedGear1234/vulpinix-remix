import { API_BASE } from "../config/api";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router";
import { motion, AnimatePresence } from "framer-motion";
import {
  ArrowLeft,
  Clock,
  XCircle,
  BarChart3,
  Bell,
  X,
  Calendar,
  Instagram,
  Facebook,
  Youtube,
  Linkedin,
  Twitter,
  Globe,
  TrendingUp,
  Plus
} from "lucide-react";
import { toast } from "sonner";
import { VulpinixLogo } from "../components/VulpinixLogo";

type CampaignStatus = "pending" | "in_review" | "approved" | "rejected" | "running" | "completed" | "published";

interface Campaign {
  id: string;
  businessName: string;
  name: string;
  platforms: string[];
  budget: string;
  budgetType?: string;
  duration?: string;
  dateSubmitted: string;
  status: CampaignStatus;
  rejectionReason?: string;
  analytics?: {
    impressions: number;
    reach: number;
    clicks: number;
    ctr: number;
    conversions: number;
    adSpend: number;
    roas: number;
  };
}

interface AdminNotification {
  id: string;
  type: string;
  message: string;
  timestamp: string;
  dismissed: boolean;
}

export default function CampaignsDashboardPage() {
  const navigate = useNavigate();
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);
  const [notifications, setNotifications] = useState<AdminNotification[]>([]);

  useEffect(() => {
    const userInfoStr = localStorage.getItem("userInfo");
    const isAuthenticated = localStorage.getItem("isAuthenticated");
    if (!userInfoStr || isAuthenticated !== "true") {
      navigate("/auth", { replace: true });
    } else {
      try {
        const u = JSON.parse(userInfoStr);
        if (!u.onboardingCompleted) {
          navigate("/onboarding", { replace: true });
        }
      } catch (e) {
        console.error("Auth guard error:", e);
      }
    }
    loadCampaigns();
    loadNotifications();
  }, [navigate]);

  const loadCampaigns = async () => {
    const authToken = localStorage.getItem("authToken");
    if (!authToken) {
      const raw = localStorage.getItem("userCampaigns");
      if (raw) {
        try {
          const parsed = JSON.parse(raw);
          setCampaigns(Array.isArray(parsed) ? parsed : []);
        } catch {}
      }
      return;
    }

    try {
      const response = await fetch(`${API_BASE}/api/campaign/my-campaigns`, {
        headers: { "Authorization": `Bearer ${authToken}` }
      });
      const data = await response.json();
      if (data.success && data.campaigns) {
        setCampaigns(data.campaigns);
      }
    } catch (err) {
      console.error("Failed to load campaigns from API", err);
      const raw = localStorage.getItem("userCampaigns");
      if (raw) {
        try {
          const parsed = JSON.parse(raw);
          setCampaigns(Array.isArray(parsed) ? parsed : []);
        } catch {}
      }
    }
  };

  const loadNotifications = () => {
    const raw = localStorage.getItem("adminNotifications");
    if (!raw) return;
    try {
      const all: AdminNotification[] = JSON.parse(raw);
      setNotifications(all.filter((n) => !n.dismissed));
    } catch {}
  };

  const dismissNotification = (id: string) => {
    const raw = localStorage.getItem("adminNotifications");
    if (!raw) return;
    try {
      const all: AdminNotification[] = JSON.parse(raw);
      const updated = all.map((n) => (n.id === id ? { ...n, dismissed: true } : n));
      localStorage.setItem("adminNotifications", JSON.stringify(updated));
      setNotifications((prev) => prev.filter((n) => n.id !== id));
    } catch {}
  };

  const handleResubmit = () => {
    toast.info("Resubmit flow starting...", {
      description: "Redirecting you to upload your content again.",
    });
    setTimeout(() => navigate("/upload"), 1200);
  };

  const getPlatformIcon = (platform: string) => {
    const props = { size: 14 };
    switch (platform.toLowerCase()) {
      case "instagram": return <Instagram {...props} />;
      case "facebook": return <Facebook {...props} />;
      case "youtube": return <Youtube {...props} />;
      case "linkedin": return <Linkedin {...props} />;
      case "twitter":
      case "x": return <Twitter {...props} />;
      default: return <Globe {...props} />;
    }
  };

  const getStatusColor = (status: CampaignStatus) => {
    switch (status) {
      case "pending":
      case "in_review": return "#eab308";
      case "approved":
      case "running":
      case "published": return "#22c55e";
      case "completed": return "#38bdf8";
      case "rejected": return "#ef4444";
      default: return "#94a3b8";
    }
  };

  return (
    <div style={{ minHeight: "100vh", background: "#080b14", color: "#fff", padding: "40px 24px" }}>
      <div style={{ maxWidth: 1200, margin: "0 auto" }}>
        
        {/* Header */}
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 48 }}>
          <div>
            <VulpinixLogo size="md" style={{ marginBottom: 16 }} />
            <h1 style={{ fontSize: 32, fontWeight: 800, letterSpacing: "-0.02em" }}>Campaign Management</h1>
            <p style={{ color: "#94a3b8" }}>Monitor and manage your AI-powered advertising campaigns.</p>
          </div>
          <button 
            onClick={() => navigate("/upload")}
            style={{ padding: "12px 24px", borderRadius: 16, background: "linear-gradient(135deg, #a78bfa, #38bdf8)", color: "#fff", border: "none", fontWeight: 700, cursor: "pointer", display: "flex", alignItems: "center", gap: 8, boxShadow: "0 10px 20px rgba(167, 139, 250, 0.2)" }}
          >
            <Plus size={20} /> Create Campaign
          </button>
        </div>

        {/* Notifications */}
        <AnimatePresence>
          {notifications.map(n => (
            <motion.div 
              key={n.id}
              initial={{ opacity: 0, height: 0, marginBottom: 0 }}
              animate={{ opacity: 1, height: "auto", marginBottom: 16 }}
              exit={{ opacity: 0, height: 0, marginBottom: 0 }}
              style={{ overflow: "hidden" }}
            >
              <div style={{ background: "rgba(234, 179, 8, 0.1)", border: "1px solid rgba(234, 179, 8, 0.2)", borderRadius: 16, padding: "16px 20px", display: "flex", alignItems: "center", gap: 16 }}>
                <Bell size={20} style={{ color: "#eab308" }} />
                <div style={{ flex: 1, fontSize: 14 }}>{n.message}</div>
                <button onClick={() => dismissNotification(n.id)} style={{ background: "none", border: "none", color: "#94a3b8", cursor: "pointer" }}><X size={18} /></button>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>

        {/* Stats Summary */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))", gap: 24, marginBottom: 48 }}>
          {[
            { label: "Active Campaigns", val: campaigns.filter(c => c.status === "running" || c.status === "published").length, icon: <TrendingUp size={20} />, color: "#22c55e" },
            { label: "In Review", val: campaigns.filter(c => c.status === "pending" || c.status === "in_review").length, icon: <Clock size={20} />, color: "#eab308" },
            { label: "Total Spent", val: `₹${campaigns.reduce((acc, c) => acc + (c.analytics?.adSpend || 0), 0).toLocaleString()}`, icon: <BarChart3 size={20} />, color: "#38bdf8" },
          ].map((stat, i) => (
            <div key={i} style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: 24, padding: 24 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 12, color: "#94a3b8", fontSize: 13, fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.05em", marginBottom: 12 }}>
                <div style={{ color: stat.color }}>{stat.icon}</div>
                {stat.label}
              </div>
              <div style={{ fontSize: 28, fontWeight: 800 }}>{stat.val}</div>
            </div>
          ))}
        </div>

        {/* Campaign List */}
        <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
          {campaigns.length === 0 ? (
            <div style={{ textAlign: "center", padding: "80px 24px", background: "rgba(255,255,255,0.02)", borderRadius: 32, border: "2px dashed rgba(255,255,255,0.05)" }}>
              <BarChart3 size={48} style={{ margin: "0 auto 24px", opacity: 0.2 }} />
              <h2 style={{ fontSize: 20, fontWeight: 700, marginBottom: 8 }}>No Campaigns Found</h2>
              <p style={{ color: "#94a3b8", marginBottom: 24 }}>Start your first AI-powered campaign to see it here.</p>
              <button onClick={() => navigate("/upload")} style={{ padding: "12px 32px", borderRadius: 16, background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)", color: "#fff", fontWeight: 700, cursor: "pointer" }}>Upload Content</button>
            </div>
          ) : (
            campaigns.map(c => (
              <div key={c.id} style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: 24, padding: 32, transition: "all 0.3s" }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 24, flexWrap: "wrap", gap: 16 }}>
                  <div>
                    <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 8 }}>
                      <h3 style={{ fontSize: 20, fontWeight: 800 }}>{c.name}</h3>
                      <span style={{ padding: "4px 12px", borderRadius: 20, background: `${getStatusColor(c.status)}15`, border: `1px solid ${getStatusColor(c.status)}30`, color: getStatusColor(c.status), fontSize: 11, fontWeight: 700, textTransform: "uppercase" }}>{c.status.replace("_", " ")}</span>
                    </div>
                    <div style={{ color: "#94a3b8", fontSize: 14, display: "flex", alignItems: "center", gap: 16 }}>
                      <div style={{ display: "flex", alignItems: "center", gap: 6 }}><Calendar size={14} /> {new Date(c.dateSubmitted).toLocaleDateString()}</div>
                      <div style={{ display: "flex", alignItems: "center", gap: 6 }}><BarChart3 size={14} /> ID: {c.id.slice(-8)}</div>
                    </div>
                  </div>
                  <div style={{ display: "flex", gap: 8 }}>
                    {c.platforms.map(p => (
                      <div key={p} style={{ width: 36, height: 36, borderRadius: 10, background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)", display: "flex", alignItems: "center", justifyContent: "center", color: "#94a3b8" }}>
                        {getPlatformIcon(p)}
                      </div>
                    ))}
                  </div>
                </div>

                <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))", gap: 24, borderTop: "1px solid rgba(255,255,255,0.05)", paddingTop: 24 }}>
                  <div>
                    <div style={{ fontSize: 11, fontWeight: 700, color: "#4b5563", textTransform: "uppercase", marginBottom: 8 }}>Budget</div>
                    <div style={{ fontSize: 18, fontWeight: 700 }}>{c.budget}</div>
                  </div>
                  <div>
                    <div style={{ fontSize: 11, fontWeight: 700, color: "#4b5563", textTransform: "uppercase", marginBottom: 8 }}>Impressions</div>
                    <div style={{ fontSize: 18, fontWeight: 700 }}>{c.analytics?.impressions?.toLocaleString() || "—"}</div>
                  </div>
                  <div>
                    <div style={{ fontSize: 11, fontWeight: 700, color: "#4b5563", textTransform: "uppercase", marginBottom: 8 }}>Reach</div>
                    <div style={{ fontSize: 18, fontWeight: 700 }}>{c.analytics?.reach?.toLocaleString() || "—"}</div>
                  </div>
                  <div>
                    <div style={{ fontSize: 11, fontWeight: 700, color: "#4b5563", textTransform: "uppercase", marginBottom: 8 }}>CTR</div>
                    <div style={{ fontSize: 18, fontWeight: 700, color: "#06d6c7" }}>{c.analytics?.ctr ? `${c.analytics.ctr}%` : "—"}</div>
                  </div>
                  <div style={{ display: "flex", alignItems: "center", justifyContent: "flex-end" }}>
                    <button 
                      onClick={() => navigate(`/analytics/${c.id}`)}
                      style={{ padding: "10px 20px", borderRadius: 12, background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)", color: "#fff", fontSize: 13, fontWeight: 700, cursor: "pointer", display: "flex", alignItems: "center", gap: 8 }}
                    >
                      View Full Report <ArrowLeft size={14} style={{ transform: "rotate(180deg)" }} />
                    </button>
                  </div>
                </div>

                {c.status === "rejected" && (
                  <div style={{ marginTop: 24, padding: 20, background: "rgba(239, 68, 68, 0.05)", border: "1px solid rgba(239, 68, 68, 0.1)", borderRadius: 16 }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 12, color: "#ef4444", fontWeight: 700 }}>
                      <XCircle size={18} /> Rejection Notice
                    </div>
                    <p style={{ fontSize: 14, color: "#94a3b8", lineHeight: 1.6, marginBottom: 16 }}>{c.rejectionReason || "Your campaign does not meet our current advertising guidelines. Please review and resubmit."}</p>
                    <button onClick={handleResubmit} style={{ padding: "8px 20px", borderRadius: 10, background: "#ef4444", color: "#fff", border: "none", fontSize: 13, fontWeight: 700, cursor: "pointer" }}>Review & Resubmit</button>
                  </div>
                )}
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
