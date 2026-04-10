import { useState, useEffect } from "react";
import { useNavigate } from "react-router";
import { motion, AnimatePresence } from "motion/react";
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
} from "lucide-react";
import { Button } from "../components/ui/button";
import { toast } from "sonner@2.0.3";

type CampaignStatus = "pending" | "in_review" | "approved" | "rejected";

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
  // Legacy fields
  createdAt?: string;
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

  const loadCampaigns = () => {
    const raw = localStorage.getItem("userCampaigns");
    if (!raw) return;
    const parsed = JSON.parse(raw);

    // Handle both flat array and legacy { inReview, history } format
    if (Array.isArray(parsed)) {
      setCampaigns(parsed);
    } else {
      const legacy: Campaign[] = [
        ...(parsed.inReview || []).map((c: Record<string, unknown>) => ({
          ...c,
          businessName: (c.businessName as string) || (c.name as string) || "My Business",
          dateSubmitted: (c.createdAt as string) || new Date().toISOString().split("T")[0],
          status: "in_review" as CampaignStatus,
        })),
        ...(parsed.history || []).map((c: Record<string, unknown>) => ({
          ...c,
          businessName: (c.businessName as string) || (c.name as string) || "My Business",
          dateSubmitted: (c.createdAt as string) || new Date().toISOString().split("T")[0],
          status: c.status === "active" ? "approved" : (c.status as CampaignStatus),
        })),
      ];
      setCampaigns(legacy);
    }
  };

  const loadNotifications = () => {
    const raw = localStorage.getItem("adminNotifications");
    if (!raw) return;
    const all: AdminNotification[] = JSON.parse(raw);
    setNotifications(all.filter((n) => !n.dismissed));
  };

  const dismissNotification = (id: string) => {
    const raw = localStorage.getItem("adminNotifications");
    if (!raw) return;
    const all: AdminNotification[] = JSON.parse(raw);
    const updated = all.map((n) => (n.id === id ? { ...n, dismissed: true } : n));
    localStorage.setItem("adminNotifications", JSON.stringify(updated));
    setNotifications((prev) => prev.filter((n) => n.id !== id));
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
    switch (platform.toLowerCase()) {
      case "instagram": return <Instagram className="w-3.5 h-3.5" />;
      case "facebook": return <Facebook className="w-3.5 h-3.5" />;
      case "youtube": return <Youtube className="w-3.5 h-3.5" />;
      case "twitter": return <Twitter className="w-3.5 h-3.5" />;
      case "linkedin": return <Linkedin className="w-3.5 h-3.5" />;
      default: return <Globe className="w-3.5 h-3.5" />;
    }
  };

  const getStatusConfig = (status: CampaignStatus) => {
    switch (status) {
      case "pending":
        return {
          badge: (
            <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-yellow-500/15 border border-yellow-400/40 text-yellow-400 text-xs font-semibold">
              <Clock className="w-3.5 h-3.5" />
              Pending
            </span>
          ),
          message: "Submitted, waiting for review",
          messageColor: "text-yellow-400/80",
          cardBorder: "border-yellow-500/20 hover:border-yellow-400/40",
          cardAccent: "from-yellow-900/5",
        };
      case "in_review":
        return {
          badge: (
            <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-blue-500/15 border border-blue-400/40 text-blue-400 text-xs font-semibold">
              <AlertCircle className="w-3.5 h-3.5 animate-pulse" />
              In Review
            </span>
          ),
          message: "Our team is reviewing your content",
          messageColor: "text-blue-400/80",
          cardBorder: "border-blue-500/20 hover:border-blue-400/40",
          cardAccent: "from-blue-900/5",
        };
      case "approved":
        return {
          badge: (
            <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-green-500/15 border border-green-400/40 text-green-400 text-xs font-semibold">
              <CheckCircle2 className="w-3.5 h-3.5" />
              Approved
            </span>
          ),
          message: "Your ads are live! 🚀",
          messageColor: "text-green-400/80",
          cardBorder: "border-green-500/20 hover:border-green-400/40",
          cardAccent: "from-green-900/5",
        };
      case "rejected":
        return {
          badge: (
            <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-red-500/15 border border-red-400/40 text-red-400 text-xs font-semibold">
              <XCircle className="w-3.5 h-3.5" />
              Rejected
            </span>
          ),
          message: "Review the reason below",
          messageColor: "text-red-400/80",
          cardBorder: "border-red-500/20 hover:border-red-400/40",
          cardAccent: "from-red-900/5",
        };
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, x: 100 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -100 }}
      transition={{ duration: 0.5, ease: "easeInOut" }}
      className="min-h-screen bg-gradient-to-b from-[#0a0e27] via-[#0f1235] to-black"
    >
      {/* Background orbs */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 right-1/4 w-96 h-96 bg-purple-600/15 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-1/3 left-1/4 w-80 h-80 bg-cyan-600/15 rounded-full blur-3xl animate-pulse delay-1000" />
      </div>

      {/* Circuit pattern */}
      <div className="absolute inset-0 opacity-5 pointer-events-none">
        <svg className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <pattern id="circuit-campaigns" x="0" y="0" width="100" height="100" patternUnits="userSpaceOnUse">
              <circle cx="50" cy="50" r="2" fill="#00ffff" />
              <line x1="50" y1="50" x2="100" y2="50" stroke="#00ffff" strokeWidth="0.5" />
              <line x1="50" y1="50" x2="50" y2="0" stroke="#00ffff" strokeWidth="0.5" />
              <circle cx="0" cy="50" r="2" fill="#a855f7" />
              <circle cx="50" cy="0" r="2" fill="#3b82f6" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#circuit-campaigns)" />
        </svg>
      </div>

      <div className="relative z-10 min-h-screen px-4 sm:px-6 lg:px-8 py-8">
        <div className="max-w-5xl mx-auto">

          {/* Header */}
          <div className="mb-8">
            <Button
              variant="ghost"
              onClick={() => navigate("/")}
              className="text-cyan-400 hover:text-cyan-300 hover:bg-cyan-500/10 mb-4"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Home
            </Button>

            <div className="flex items-center gap-3 mb-2">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-purple-600 to-cyan-600 flex items-center justify-center shadow-lg shadow-purple-500/40">
                <BarChart3 className="w-5 h-5 text-white" />
              </div>
              <div>
                <h1 className="text-4xl sm:text-5xl font-bold bg-gradient-to-r from-purple-400 via-cyan-400 to-blue-400 bg-clip-text text-transparent">
                  My Campaigns
                </h1>
                <p className="text-gray-400 text-sm mt-0.5">
                  Track the status of all your ad campaigns
                </p>
              </div>
            </div>
          </div>

          {/* Admin Notification Banners */}
          <AnimatePresence>
            {notifications.map((notif) => (
              <motion.div
                key={notif.id}
                initial={{ opacity: 0, y: -16, height: 0 }}
                animate={{ opacity: 1, y: 0, height: "auto" }}
                exit={{ opacity: 0, y: -10, height: 0 }}
                transition={{ duration: 0.35 }}
                className="mb-4"
              >
                <div className="flex items-start gap-3 px-5 py-4 rounded-2xl bg-gradient-to-r from-purple-500/15 via-cyan-500/10 to-blue-500/15 border border-cyan-400/30 backdrop-blur-sm shadow-lg shadow-cyan-500/10">
                  <div className="w-8 h-8 rounded-lg bg-cyan-500/20 flex items-center justify-center flex-shrink-0">
                    <Bell className="w-4 h-4 text-cyan-400" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm text-gray-200 leading-relaxed">{notif.message}</p>
                    <p className="text-xs text-gray-500 mt-1">
                      {new Date(notif.timestamp).toLocaleString()}
                    </p>
                  </div>
                  <button
                    onClick={() => dismissNotification(notif.id)}
                    className="w-7 h-7 rounded-lg hover:bg-white/10 flex items-center justify-center transition-colors flex-shrink-0"
                    aria-label="Dismiss notification"
                  >
                    <X className="w-4 h-4 text-gray-400 hover:text-white" />
                  </button>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>

          {/* Stats Summary Row */}
          {campaigns.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.15 }}
              className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8"
            >
              {[
                { label: "Total", count: campaigns.length, color: "text-white", bg: "from-purple-500/15 border-purple-500/25" },
                { label: "Pending", count: campaigns.filter(c => c.status === "pending").length, color: "text-yellow-400", bg: "from-yellow-500/15 border-yellow-500/25" },
                { label: "Approved", count: campaigns.filter(c => c.status === "approved").length, color: "text-green-400", bg: "from-green-500/15 border-green-500/25" },
                { label: "Rejected", count: campaigns.filter(c => c.status === "rejected").length, color: "text-red-400", bg: "from-red-500/15 border-red-500/25" },
              ].map((stat) => (
                <div
                  key={stat.label}
                  className={`p-4 rounded-2xl bg-gradient-to-br ${stat.bg} border backdrop-blur-sm text-center`}
                >
                  <p className={`text-2xl font-bold ${stat.color}`}>{stat.count}</p>
                  <p className="text-xs text-gray-400 mt-1">{stat.label}</p>
                </div>
              ))}
            </motion.div>
          )}

          {/* Campaigns List */}
          {campaigns.length === 0 ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center py-24"
            >
              <div className="w-20 h-20 rounded-full bg-gradient-to-br from-purple-600/20 to-cyan-600/20 border border-purple-500/30 flex items-center justify-center mx-auto mb-5">
                <BarChart3 className="w-10 h-10 text-gray-500" />
              </div>
              <h3 className="text-xl font-semibold text-gray-300 mb-2">No campaigns yet</h3>
              <p className="text-gray-500 mb-6">Create your first campaign to get started</p>
              <Button
                onClick={() => navigate("/upload")}
                className="bg-gradient-to-r from-purple-600 to-cyan-600 hover:from-purple-700 hover:to-cyan-700 text-white rounded-xl shadow-lg shadow-cyan-500/30"
              >
                <Sparkles className="w-4 h-4 mr-2" />
                Create Campaign
              </Button>
            </motion.div>
          ) : (
            <div className="space-y-5">
              {campaigns.map((campaign, index) => {
                const config = getStatusConfig(campaign.status);
                const isRejectionExpanded = expandedRejections.has(campaign.id);
                const dateStr = campaign.dateSubmitted || campaign.createdAt || "";

                return (
                  <motion.div
                    key={campaign.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.07 }}
                    className={`rounded-2xl bg-gradient-to-br ${config.cardAccent} to-gray-900/60 border ${config.cardBorder} backdrop-blur-sm shadow-xl transition-all duration-300 overflow-hidden`}
                  >
                    <div className="p-6">
                      {/* Top row: name + badge */}
                      <div className="flex flex-wrap items-start justify-between gap-3 mb-4">
                        <div className="flex items-center gap-3 min-w-0">
                          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-purple-600/30 to-cyan-600/30 border border-purple-500/30 flex items-center justify-center flex-shrink-0">
                            <Building2 className="w-5 h-5 text-purple-400" />
                          </div>
                          <div className="min-w-0">
                            <h3 className="text-white font-bold text-lg leading-tight truncate">
                              {campaign.businessName}
                            </h3>
                            <p className="text-gray-400 text-sm truncate">{campaign.name}</p>
                          </div>
                        </div>
                        <div className="flex flex-col items-end gap-1.5">
                          {config.badge}
                          <p className={`text-xs ${config.messageColor}`}>{config.message}</p>
                        </div>
                      </div>

                      {/* Meta row */}
                      <div className="flex flex-wrap gap-3 mb-4">
                        {/* Platforms */}
                        <div className="flex flex-wrap gap-1.5">
                          {campaign.platforms.map((p) => (
                            <span
                              key={p}
                              className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-gradient-to-r from-purple-600/40 to-cyan-600/40 text-white text-xs border border-purple-500/30"
                            >
                              {getPlatformIcon(p)}
                              {p}
                            </span>
                          ))}
                        </div>
                      </div>

                      {/* Info grid */}
                      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                        <div className="flex items-center gap-2 text-sm">
                          <DollarSign className="w-4 h-4 text-cyan-400 flex-shrink-0" />
                          <div>
                            <p className="text-gray-500 text-xs">Budget</p>
                            <p className="text-white font-semibold">{campaign.budget}</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-2 text-sm">
                          <Calendar className="w-4 h-4 text-purple-400 flex-shrink-0" />
                          <div>
                            <p className="text-gray-500 text-xs">Submitted</p>
                            <p className="text-white font-semibold">
                              {dateStr ? new Date(dateStr).toLocaleDateString() : "—"}
                            </p>
                          </div>
                        </div>
                        {campaign.duration && (
                          <div className="flex items-center gap-2 text-sm">
                            <TrendingUp className="w-4 h-4 text-blue-400 flex-shrink-0" />
                            <div>
                              <p className="text-gray-500 text-xs">Duration</p>
                              <p className="text-white font-semibold">{campaign.duration}</p>
                            </div>
                          </div>
                        )}
                      </div>

                      {/* Approved — View Analytics button */}
                      {campaign.status === "approved" && (
                        <motion.div
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: "auto" }}
                          className="mt-5 pt-4 border-t border-green-500/20"
                        >
                          <Button
                            id={`view-analytics-${campaign.id}`}
                            onClick={() => navigate(`/dashboard/campaigns/${campaign.id}/analytics`)}
                            className="w-full bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white rounded-xl shadow-lg shadow-green-500/30 hover:shadow-green-500/50 transition-all"
                          >
                            <BarChart3 className="w-4 h-4 mr-2" />
                            View Analytics
                          </Button>
                        </motion.div>
                      )}

                      {/* Rejected — expandable reason + resubmit */}
                      {campaign.status === "rejected" && (
                        <motion.div
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          className="mt-5 pt-4 border-t border-red-500/20 space-y-3"
                        >
                          <button
                            onClick={() => toggleRejectionExpand(campaign.id)}
                            className="flex items-center gap-2 text-red-400 hover:text-red-300 text-sm font-medium transition-colors w-full"
                          >
                            {isRejectionExpanded ? (
                              <ChevronUp className="w-4 h-4" />
                            ) : (
                              <ChevronDown className="w-4 h-4" />
                            )}
                            See rejection reason
                          </button>

                          <AnimatePresence>
                            {isRejectionExpanded && (
                              <motion.div
                                initial={{ opacity: 0, height: 0 }}
                                animate={{ opacity: 1, height: "auto" }}
                                exit={{ opacity: 0, height: 0 }}
                                transition={{ duration: 0.25 }}
                              >
                                <div className="p-4 rounded-xl bg-red-500/10 border border-red-400/25 text-sm text-gray-300 mb-3">
                                  {campaign.rejectionReason || "Your content did not meet our advertising guidelines. Please review the content policy and resubmit with appropriate material."}
                                </div>
                              </motion.div>
                            )}
                          </AnimatePresence>

                          <Button
                            onClick={() => handleResubmit(campaign)}
                            variant="outline"
                            className="w-full border-red-500/40 text-red-400 hover:bg-red-500/10 hover:text-red-300 rounded-xl transition-all"
                          >
                            <RefreshCw className="w-4 h-4 mr-2" />
                            Resubmit Campaign
                          </Button>
                        </motion.div>
                      )}
                    </div>
                  </motion.div>
                );
              })}
            </div>
          )}

          {/* Create New Campaign CTA */}
          {campaigns.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="mt-10"
            >
              <Button
                onClick={() => navigate("/upload")}
                size="lg"
                className="w-full py-6 bg-gradient-to-r from-purple-600 via-cyan-600 to-blue-600 hover:from-purple-700 hover:via-cyan-700 hover:to-blue-700 text-white rounded-xl shadow-lg shadow-cyan-500/40 hover:shadow-cyan-500/60 transition-all duration-300 hover:scale-[1.02]"
              >
                <Sparkles className="w-5 h-5 mr-2" />
                Create New Campaign
              </Button>
            </motion.div>
          )}
        </div>
      </div>

      {/* Footer */}
      <footer className="relative z-10 border-t border-purple-500/20 bg-gray-900/50 backdrop-blur-sm py-8 px-4 mt-16">
        <div className="max-w-5xl mx-auto text-center">
          <p className="text-gray-400">
            <span className="bg-gradient-to-r from-purple-400 via-cyan-400 to-blue-400 bg-clip-text text-transparent font-semibold">
              VULPINIX AI 1.0
            </span>
            {" "}— Automate Your Digital World
          </p>
        </div>
      </footer>
    </motion.div>
  );
}
