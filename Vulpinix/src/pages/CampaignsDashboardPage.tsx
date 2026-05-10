import { API_BASE } from "../config/api";
import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router";
import { motion, AnimatePresence } from "framer-motion";
import {
  ArrowLeft,
  Clock,
  CheckCircle2,
  AlertCircle,
  XCircle,
  BarChart3,
  Bell,
  X,
  ChevronDown,
  ChevronUp,
  RefreshCw,
  Calendar,
  DollarSign,
  Instagram,
  Facebook,
  Youtube,
  Linkedin,
  Twitter,
  Globe,
  Sparkles,
  TrendingUp,
  Building2,
  Plus
} from "lucide-react";
import { toast } from "sonner";
import { VulpinixLogo } from "../components/VulpinixLogo";

type CampaignStatus = "pending" | "in_review" | "approved" | "rejected" | "running" | "completed";

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
  const [expandedRejections, setExpandedRejections] = useState<Set<string>>(new Set());

  useEffect(() => {
    loadCampaigns();
    loadNotifications();
  }, []);

  const loadCampaigns = async () => {
    const authToken = localStorage.getItem("authToken");
    if (!authToken) {
      // Legacy fallback
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
      const response = await fetch("${API_BASE}/api/campaign/my-campaigns", {
        headers: { "Authorization": `Bearer ${authToken}` }
      });
      const data = await response.json();
      
      if (data.success && data.campaigns) {
        setCampaigns(data.campaigns);
      }
    } catch (err) {
      console.error("Failed to load campaigns from API", err);
      // Fallback
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

  const toggleRejectionExpand = (id: string) => {
    setExpandedRejections((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const handleResubmit = (campaign: Campaign) => {
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
      case "twitter": return <Twitter {...props} />;
      case "linkedin": return <Linkedin {...props} />;
      default: return <Globe {...props} />;
    }
  };

  const getStatusStyle = (status: CampaignStatus) => {
    switch (status) {
      case "pending":   return { color: "#fbbf24", icon: Clock, label: "Pending" };
      case "in_review": return { color: "#38bdf8", icon: RefreshCw, label: "In Review" };
      case "approved":  return { color: "#10b981", icon: CheckCircle2, label: "Live" };
      case "running":   return { color: "#10b981", icon: TrendingUp, label: "Running" };
      case "completed": return { color: "#38bdf8", icon: CheckCircle2, label: "Completed" };
      case "rejected":  return { color: "#f43f5e", icon: XCircle, label: "Action Needed" };
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      style={{
        background: "var(--vx-bg-primary)",
        minHeight: "100vh",
        padding: "100px 24px 60px",
        color: "var(--vx-text-primary)"
      }}
    >
      <div style={{ maxWidth: 1000, margin: "0 auto" }}>
        
        {/* Top Header */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", marginBottom: 40, flexWrap: "wrap", gap: 20 }}>
          <div>
            <button 
              onClick={() => navigate("/")}
              style={{ display: "flex", alignItems: "center", gap: 8, background: "none", border: "none", color: "var(--vx-text-muted)", cursor: "pointer", fontSize: 14, fontWeight: 600, marginBottom: 12, padding: 0 }}
              onMouseEnter={e => e.currentTarget.style.color = "var(--vx-text-primary)"}
              onMouseLeave={e => e.currentTarget.style.color = "var(--vx-text-muted)"}
            >
              <ArrowLeft size={16} /> Back to Dashboard
            </button>
            <h1 style={{ fontSize: "clamp(2rem, 5vw, 2.5rem)", fontWeight: 800, letterSpacing: "-0.02em", margin: 0 }}>
              My <span style={{ background: "linear-gradient(135deg, #a78bfa, #38bdf8)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>Campaigns</span>
            </h1>
            <p style={{ color: "var(--vx-text-secondary)", fontSize: 16, marginTop: 8 }}>Track your active promotions and ad performance</p>
          </div>
          
          <button
            onClick={() => navigate("/upload")}
            style={{ 
              padding: "12px 24px", borderRadius: 12, background: "var(--vx-text-primary)", color: "var(--vx-bg-primary)", 
              border: "none", fontWeight: 700, cursor: "pointer", display: "flex", alignItems: "center", gap: 10, transition: "transform 0.2s" 
            }}
            onMouseEnter={e => e.currentTarget.style.transform = "translateY(-2px)"}
            onMouseLeave={e => e.currentTarget.style.transform = "translateY(0)"}
          >
            <Plus size={18} /> New Campaign
          </button>
        </div>

        {/* Notifications */}
        <AnimatePresence>
          {notifications.map((notif) => (
            <motion.div
              key={notif.id}
              initial={{ opacity: 0, height: 0, marginBottom: 0 }}
              animate={{ opacity: 1, height: "auto", marginBottom: 20 }}
              exit={{ opacity: 0, height: 0, marginBottom: 0 }}
              style={{ 
                background: "rgba(56, 189, 248, 0.05)", 
                border: "1px solid rgba(56, 189, 248, 0.2)", 
                borderRadius: 16, 
                padding: "16px 20px", 
                display: "flex", 
                alignItems: "center", 
                gap: 16,
                overflow: "hidden"
              }}
            >
              <div style={{ width: 40, height: 40, borderRadius: 10, background: "rgba(56, 189, 248, 0.1)", display: "flex", alignItems: "center", justifyContent: "center", color: "#38bdf8", flexShrink: 0 }}>
                <Bell size={20} />
              </div>
              <div style={{ flex: 1 }}>
                <p style={{ margin: 0, fontSize: 14, fontWeight: 500, color: "var(--vx-text-primary)" }}>{notif.message}</p>
                <p style={{ margin: "2px 0 0", fontSize: 11, color: "var(--vx-text-muted)" }}>{new Date(notif.timestamp).toLocaleString()}</p>
              </div>
              <button onClick={() => dismissNotification(notif.id)} style={{ background: "none", border: "none", color: "var(--vx-text-muted)", cursor: "pointer", padding: 4 }}>
                <X size={18} />
              </button>
            </motion.div>
          ))}
        </AnimatePresence>

        {/* Stats Row */}
        {campaigns.length > 0 && (
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(140px, 1fr))", gap: 16, marginBottom: 40 }}>
            {[
              { label: "Total", count: campaigns.length, color: "#a78bfa" },
              { label: "Live", count: campaigns.filter(c => c.status === "approved").length, color: "#10b981" },
              { label: "Review", count: campaigns.filter(c => c.status === "in_review" || c.status === "pending").length, color: "#38bdf8" },
              { label: "Action", count: campaigns.filter(c => c.status === "rejected").length, color: "#f43f5e" },
            ].map((s) => (
              <div key={s.label} style={{ background: "var(--vx-bg-card)", border: "1px solid var(--vx-border)", borderRadius: 16, padding: "20px", textAlign: "center" }}>
                <div style={{ fontSize: 28, fontWeight: 800, color: "var(--vx-text-primary)" }}>{s.count}</div>
                <div style={{ fontSize: 12, fontWeight: 700, color: "var(--vx-text-muted)", textTransform: "uppercase", letterSpacing: "0.05em", marginTop: 4 }}>{s.label}</div>
              </div>
            ))}
          </div>
        )}

        {/* Campaign List */}
        {campaigns.length === 0 ? (
          <div style={{ textAlign: "center", padding: "80px 20px", background: "var(--vx-bg-card)", border: "1px solid var(--vx-border)", borderRadius: 24 }}>
            <div style={{ width: 80, height: 80, borderRadius: "50%", background: "var(--vx-bg-input)", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 24px", color: "var(--vx-text-muted)" }}>
              <BarChart3 size={32} />
            </div>
            <h3 style={{ fontSize: 20, fontWeight: 700, marginBottom: 8 }}>No active campaigns</h3>
            <p style={{ color: "var(--vx-text-muted)", marginBottom: 32 }}>Ready to grow? Create your first campaign in minutes.</p>
            <button
              onClick={() => navigate("/upload")}
              style={{ padding: "14px 32px", borderRadius: 12, background: "var(--vx-text-primary)", color: "var(--vx-bg-primary)", border: "none", fontWeight: 700, cursor: "pointer" }}
            >
              Get Started Now
            </button>
          </div>
        ) : (
          <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
            {campaigns.map((campaign, idx) => {
              const status = getStatusStyle(campaign.status);
              const isExpanded = expandedRejections.has(campaign.id);
              
              return (
                <motion.div
                  key={campaign.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: idx * 0.05 }}
                  style={{
                    background: "var(--vx-bg-card)",
                    border: "1px solid var(--vx-border)",
                    borderRadius: 24,
                    padding: "24px",
                    display: "flex",
                    flexDirection: "column",
                    gap: 20,
                    transition: "border-color 0.2s",
                    position: "relative",
                    overflow: "hidden"
                  }}
                  onMouseEnter={e => e.currentTarget.style.borderColor = "var(--vx-border-hover)"}
                  onMouseLeave={e => e.currentTarget.style.borderColor = "var(--vx-border)"}
                >
                  {/* Status Indicator Bar */}
                  <div style={{ position: "absolute", top: 0, left: 0, width: 4, height: "100%", background: status.color }} />

                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", flexWrap: "wrap", gap: 16 }}>
                    <div style={{ display: "flex", gap: 16 }}>
                      <div style={{ width: 50, height: 50, borderRadius: 12, background: "var(--vx-bg-input)", border: "1px solid var(--vx-border)", display: "flex", alignItems: "center", justifyContent: "center", color: status.color }}>
                        <status.icon size={24} />
                      </div>
                      <div>
                        <h3 style={{ fontSize: 18, fontWeight: 800, margin: 0 }}>{campaign.businessName}</h3>
                        <p style={{ fontSize: 13, color: "var(--vx-text-muted)", margin: "4px 0 0" }}>{campaign.name}</p>
                      </div>
                    </div>

                    <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                      <div style={{ textAlign: "right" }}>
                        <div style={{ fontSize: 10, fontWeight: 800, textTransform: "uppercase", color: "var(--vx-text-muted)", letterSpacing: "0.05em", marginBottom: 2 }}>Status</div>
                        <div style={{ fontSize: 13, fontWeight: 700, color: status.color }}>{status.label}</div>
                      </div>
                      <div style={{ width: 1, height: 30, background: "var(--vx-border)" }} />
                      <div style={{ textAlign: "right" }}>
                        <div style={{ fontSize: 10, fontWeight: 800, textTransform: "uppercase", color: "var(--vx-text-muted)", letterSpacing: "0.05em", marginBottom: 2 }}>Budget</div>
                        <div style={{ fontSize: 13, fontWeight: 700 }}>{campaign.budget}</div>
                      </div>
                    </div>
                  </div>

                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 16, borderTop: "1px solid var(--vx-border)", paddingTop: 20 }}>
                    <div style={{ display: "flex", gap: 8 }}>
                      {campaign.platforms.map(p => (
                        <div key={p} style={{ padding: "6px 12px", borderRadius: 8, background: "var(--vx-bg-input)", border: "1px solid var(--vx-border)", display: "flex", alignItems: "center", gap: 6, fontSize: 12, fontWeight: 600 }}>
                          {getPlatformIcon(p)}
                          <span style={{ textTransform: "capitalize" }}>{p}</span>
                        </div>
                      ))}
                    </div>

                    <div style={{ display: "flex", gap: 12 }}>
                      {campaign.status === "approved" && (
                        <button
                          onClick={() => navigate(`/dashboard/campaigns/${campaign.id}/analytics`)}
                          style={{ padding: "8px 16px", borderRadius: 10, background: "#10b98115", color: "#10b981", border: "1px solid #10b98130", fontSize: 13, fontWeight: 700, cursor: "pointer", display: "flex", alignItems: "center", gap: 8 }}
                          onMouseEnter={e => e.currentTarget.style.background = "#10b98125"}
                          onMouseLeave={e => e.currentTarget.style.background = "#10b98115"}
                        >
                          <BarChart3 size={16} /> View Performance
                        </button>
                      )}
                      
                      {campaign.status === "rejected" && (
                        <button
                          onClick={() => handleResubmit(campaign)}
                          style={{ padding: "8px 16px", borderRadius: 10, background: "#f43f5e15", color: "#f43f5e", border: "1px solid #f43f5e30", fontSize: 13, fontWeight: 700, cursor: "pointer", display: "flex", alignItems: "center", gap: 8 }}
                          onMouseEnter={e => e.currentTarget.style.background = "#f43f5e25"}
                          onMouseLeave={e => e.currentTarget.style.background = "#f43f5e15"}
                        >
                          <RefreshCw size={16} /> Resubmit Content
                        </button>
                      )}

                      <div style={{ display: "flex", alignItems: "center", gap: 6, color: "var(--vx-text-muted)", fontSize: 12, fontWeight: 500 }}>
                        <Calendar size={14} />
                        {new Date(campaign.dateSubmitted).toLocaleDateString()}
                      </div>
                    </div>
                  </div>

                  {campaign.status === "rejected" && (
                    <div style={{ marginTop: -4 }}>
                      <button 
                        onClick={() => toggleRejectionExpand(campaign.id)}
                        style={{ background: "none", border: "none", color: "#f43f5e", fontSize: 12, fontWeight: 700, cursor: "pointer", display: "flex", alignItems: "center", gap: 4, padding: 0 }}
                      >
                        {isExpanded ? <ChevronUp size={14} /> : <ChevronDown size={14} />} 
                        {isExpanded ? "Hide Details" : "Why was this rejected?"}
                      </button>
                      <AnimatePresence>
                        {isExpanded && (
                          <motion.div
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: "auto" }}
                            exit={{ opacity: 0, height: 0 }}
                            style={{ overflow: "hidden" }}
                          >
                            <div style={{ marginTop: 12, padding: 16, borderRadius: 12, background: "rgba(244,63,94,0.05)", border: "1px solid rgba(244,63,94,0.1)", fontSize: 13, color: "var(--vx-text-secondary)", lineHeight: 1.5 }}>
                              {campaign.rejectionReason || "Your content does not meet our current advertising guidelines. Please review the material and resubmit."}
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                  )}
                </motion.div>
              );
            })}
          </div>
        )}

        <footer style={{ marginTop: 80, textAlign: "center", borderTop: "1px solid var(--vx-border)", paddingTop: 40 }}>
          <VulpinixLogo size="sm" />
          <p style={{ color: "var(--vx-text-muted)", fontSize: 12, marginTop: 16, letterSpacing: "0.05em", fontWeight: 600 }}>
            VULPINIX PLATFORM 1.0 — SECURE AD MANAGEMENT
          </p>
        </footer>
      </div>
    </motion.div>
  );
}

