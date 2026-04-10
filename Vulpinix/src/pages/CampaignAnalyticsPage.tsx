import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router";
import { motion } from "motion/react";
import {
  ArrowLeft,
  Eye,
  Users,
  MousePointer,
  Percent,
  ShoppingCart,
  DollarSign,
  TrendingUp,
  BarChart3,
  Sparkles,
  Instagram,
  Facebook,
  Youtube,
  Twitter,
  Linkedin,
  Globe,
} from "lucide-react";
import { Button } from "../components/ui/button";

interface Campaign {
  id: string;
  businessName: string;
  name: string;
  platforms: string[];
  budget: string;
  dateSubmitted?: string;
  status: string;
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

// Default demo analytics when real data is zero / not set
const DEMO_ANALYTICS = {
  impressions: 124500,
  reach: 98200,
  clicks: 3120,
  ctr: 2.51,
  conversions: 412,
  adSpend: 5000,
  roas: 3.82,
};

const getPlatformIcon = (platform: string) => {
  switch (platform.toLowerCase()) {
    case "instagram": return <Instagram className="w-4 h-4" />;
    case "facebook": return <Facebook className="w-4 h-4" />;
    case "youtube": return <Youtube className="w-4 h-4" />;
    case "twitter": return <Twitter className="w-4 h-4" />;
    case "linkedin": return <Linkedin className="w-4 h-4" />;
    default: return <Globe className="w-4 h-4" />;
  }
};

const formatNumber = (n: number) => {
  if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(1)}M`;
  if (n >= 1_000) return `${(n / 1_000).toFixed(1)}K`;
  return n.toString();
};

export default function CampaignAnalyticsPage() {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const [campaign, setCampaign] = useState<Campaign | null>(null);

  useEffect(() => {
    const raw = localStorage.getItem("userCampaigns");
    if (!raw) return;
    const parsed = JSON.parse(raw);

    let found: Campaign | null = null;

    if (Array.isArray(parsed)) {
      found = parsed.find((c: Campaign) => c.id === id) || null;
    } else {
      // Legacy format
      const all = [...(parsed.inReview || []), ...(parsed.history || [])];
      found = all.find((c: Campaign) => c.id === id) || null;
    }

    setCampaign(found);
  }, [id]);

  if (!campaign) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-[#0a0e27] via-[#0f1235] to-black flex items-center justify-center">
        <div className="text-center">
          <BarChart3 className="w-16 h-16 text-gray-500 mx-auto mb-4" />
          <p className="text-gray-400 text-xl mb-6">Campaign not found</p>
          <Button
            onClick={() => navigate("/dashboard/campaigns")}
            className="bg-gradient-to-r from-purple-600 to-cyan-600 text-white rounded-xl"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Campaigns
          </Button>
        </div>
      </div>
    );
  }

  // Use stored analytics if real values exist, otherwise fall back to demo data
  const raw = campaign.analytics;
  const analytics =
    raw && raw.impressions > 0
      ? raw
      : DEMO_ANALYTICS;

  const stats = [
    {
      id: "impressions",
      label: "Impressions",
      value: formatNumber(analytics.impressions),
      rawValue: analytics.impressions,
      icon: <Eye className="w-6 h-6" />,
      color: "from-purple-600 to-violet-600",
      glow: "shadow-purple-500/40",
      border: "border-purple-500/30",
      bg: "from-purple-500/10",
      description: "Total times your ad was displayed",
      max: analytics.impressions,
    },
    {
      id: "reach",
      label: "Reach",
      value: formatNumber(analytics.reach),
      rawValue: analytics.reach,
      icon: <Users className="w-6 h-6" />,
      color: "from-cyan-600 to-sky-600",
      glow: "shadow-cyan-500/40",
      border: "border-cyan-500/30",
      bg: "from-cyan-500/10",
      description: "Unique people who saw your ad",
      max: analytics.impressions,
    },
    {
      id: "clicks",
      label: "Clicks",
      value: formatNumber(analytics.clicks),
      rawValue: analytics.clicks,
      icon: <MousePointer className="w-6 h-6" />,
      color: "from-blue-600 to-indigo-600",
      glow: "shadow-blue-500/40",
      border: "border-blue-500/30",
      bg: "from-blue-500/10",
      description: "Total clicks on your ad",
      max: analytics.reach,
    },
    {
      id: "ctr",
      label: "CTR",
      value: `${analytics.ctr.toFixed(2)}%`,
      rawValue: analytics.ctr,
      icon: <Percent className="w-6 h-6" />,
      color: "from-teal-600 to-green-600",
      glow: "shadow-teal-500/40",
      border: "border-teal-500/30",
      bg: "from-teal-500/10",
      description: "Click-through rate",
      max: 10,
    },
    {
      id: "conversions",
      label: "Conversions",
      value: formatNumber(analytics.conversions),
      rawValue: analytics.conversions,
      icon: <ShoppingCart className="w-6 h-6" />,
      color: "from-emerald-600 to-green-600",
      glow: "shadow-emerald-500/40",
      border: "border-emerald-500/30",
      bg: "from-emerald-500/10",
      description: "Desired actions completed",
      max: analytics.clicks,
    },
    {
      id: "adSpend",
      label: "Ad Spend",
      value: `₹${formatNumber(analytics.adSpend)}`,
      rawValue: analytics.adSpend,
      icon: <DollarSign className="w-6 h-6" />,
      color: "from-orange-600 to-amber-600",
      glow: "shadow-orange-500/40",
      border: "border-orange-500/30",
      bg: "from-orange-500/10",
      description: "Total budget spent",
      max: analytics.adSpend,
    },
    {
      id: "roas",
      label: "ROAS",
      value: `${analytics.roas.toFixed(2)}x`,
      rawValue: analytics.roas,
      icon: <TrendingUp className="w-6 h-6" />,
      color: "from-pink-600 to-rose-600",
      glow: "shadow-pink-500/40",
      border: "border-pink-500/30",
      bg: "from-pink-500/10",
      description: "Return on ad spend",
      max: 10,
    },
  ];

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
        <div className="absolute bottom-1/3 left-1/5 w-80 h-80 bg-cyan-600/15 rounded-full blur-3xl animate-pulse delay-1000" />
        <div className="absolute top-3/4 right-1/3 w-64 h-64 bg-pink-600/10 rounded-full blur-3xl animate-pulse delay-500" />
      </div>

      {/* Circuit pattern */}
      <div className="absolute inset-0 opacity-5 pointer-events-none">
        <svg className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <pattern id="circuit-analytics" x="0" y="0" width="100" height="100" patternUnits="userSpaceOnUse">
              <circle cx="50" cy="50" r="2" fill="#00ffff" />
              <line x1="50" y1="50" x2="100" y2="50" stroke="#00ffff" strokeWidth="0.5" />
              <line x1="50" y1="50" x2="50" y2="0" stroke="#00ffff" strokeWidth="0.5" />
              <circle cx="0" cy="50" r="2" fill="#a855f7" />
              <circle cx="50" cy="0" r="2" fill="#3b82f6" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#circuit-analytics)" />
        </svg>
      </div>

      <div className="relative z-10 min-h-screen px-4 sm:px-6 lg:px-8 py-8">
        <div className="max-w-6xl mx-auto">

          {/* Header */}
          <div className="mb-8">
            <Button
              variant="ghost"
              onClick={() => navigate("/dashboard/campaigns")}
              className="text-cyan-400 hover:text-cyan-300 hover:bg-cyan-500/10 mb-4"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Campaigns
            </Button>

            <div className="flex flex-wrap items-start justify-between gap-4">
              <div>
                <h1 className="text-3xl sm:text-4xl font-bold bg-gradient-to-r from-purple-400 via-cyan-400 to-blue-400 bg-clip-text text-transparent">
                  Campaign Analytics
                </h1>
                <p className="text-gray-300 mt-1 text-lg font-medium">{campaign.businessName}</p>
                <p className="text-gray-500 text-sm">{campaign.name}</p>
              </div>

              <div className="flex flex-col items-end gap-2">
                <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-green-500/15 border border-green-400/40 text-green-400 text-xs font-semibold">
                  <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
                  Live Campaign
                </span>
                {/* Platforms */}
                <div className="flex gap-1.5">
                  {campaign.platforms.map((p) => (
                    <span
                      key={p}
                      className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-purple-500/20 border border-purple-500/30 text-purple-300 text-xs"
                    >
                      {getPlatformIcon(p)}
                      {p}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Stats Grid — 7 metrics */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5 mb-10">
            {stats.map((stat, index) => {
              const pct = Math.min(100, stat.max > 0 ? (stat.rawValue / stat.max) * 100 : 0);

              return (
                <motion.div
                  key={stat.id}
                  initial={{ opacity: 0, y: 24 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.08 * index, type: "spring", stiffness: 200, damping: 20 }}
                  className={`relative rounded-2xl bg-gradient-to-br ${stat.bg} to-gray-900/60 border ${stat.border} backdrop-blur-sm shadow-xl ${stat.glow} p-6 overflow-hidden group hover:scale-[1.02] transition-transform duration-300`}
                >
                  {/* Glow orb */}
                  <div className={`absolute -top-6 -right-6 w-24 h-24 rounded-full bg-gradient-to-br ${stat.color} opacity-15 blur-2xl group-hover:opacity-25 transition-opacity`} />

                  {/* Icon */}
                  <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${stat.color} flex items-center justify-center text-white shadow-lg ${stat.glow} mb-4`}>
                    {stat.icon}
                  </div>

                  {/* Value */}
                  <p className="text-3xl font-bold text-white mb-1">{stat.value}</p>
                  <p className="text-sm font-semibold text-gray-300 mb-1">{stat.label}</p>
                  <p className="text-xs text-gray-500 mb-4">{stat.description}</p>

                  {/* Progress bar */}
                  <div className="h-1.5 rounded-full bg-white/10 overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${pct}%` }}
                      transition={{ delay: 0.3 + 0.05 * index, duration: 1, ease: "easeOut" }}
                      className={`h-full rounded-full bg-gradient-to-r ${stat.color}`}
                    />
                  </div>
                </motion.div>
              );
            })}
          </div>

          {/* Performance Overview bar chart */}
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            className="rounded-2xl bg-gradient-to-br from-gray-900/90 via-purple-900/20 to-cyan-900/10 border border-purple-500/25 backdrop-blur-sm shadow-2xl p-6 mb-8"
          >
            <div className="flex items-center gap-2 mb-6">
              <BarChart3 className="w-5 h-5 text-cyan-400" />
              <h2 className="text-white font-semibold text-lg">Performance Breakdown</h2>
            </div>

            <div className="space-y-4">
              {[
                { label: "Impressions", value: analytics.impressions, max: analytics.impressions, color: "from-purple-600 to-violet-500", display: formatNumber(analytics.impressions) },
                { label: "Reach", value: analytics.reach, max: analytics.impressions, color: "from-cyan-600 to-sky-500", display: formatNumber(analytics.reach) },
                { label: "Clicks", value: analytics.clicks, max: analytics.reach, color: "from-blue-600 to-indigo-500", display: formatNumber(analytics.clicks) },
                { label: "Conversions", value: analytics.conversions, max: analytics.clicks, color: "from-emerald-600 to-green-500", display: formatNumber(analytics.conversions) },
              ].map((item, i) => {
                const barPct = Math.min(100, item.max > 0 ? (item.value / item.max) * 100 : 0);
                return (
                  <div key={item.label} className="flex items-center gap-4">
                    <p className="text-gray-400 text-sm w-28 flex-shrink-0">{item.label}</p>
                    <div className="flex-1 h-7 rounded-lg bg-white/5 overflow-hidden">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${barPct}%` }}
                        transition={{ delay: 0.7 + i * 0.1, duration: 0.9, ease: "easeOut" }}
                        className={`h-full rounded-lg bg-gradient-to-r ${item.color} flex items-center justify-end pr-2`}
                      >
                        <span className="text-white text-xs font-semibold whitespace-nowrap">
                          {item.display}
                        </span>
                      </motion.div>
                    </div>
                  </div>
                );
              })}
            </div>
          </motion.div>

          {/* ROI Highlight */}
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.75 }}
            className="grid grid-cols-1 sm:grid-cols-2 gap-5 mb-8"
          >
            {/* Ad Spend vs Return */}
            <div className="rounded-2xl bg-gradient-to-br from-orange-500/10 to-amber-500/5 border border-orange-500/25 p-6">
              <div className="flex items-center gap-2 mb-3">
                <DollarSign className="w-5 h-5 text-orange-400" />
                <h3 className="text-white font-semibold">Budget Efficiency</h3>
              </div>
              <div className="flex items-end gap-4">
                <div>
                  <p className="text-xs text-gray-500 mb-0.5">Spent</p>
                  <p className="text-2xl font-bold text-orange-400">₹{formatNumber(analytics.adSpend)}</p>
                </div>
                <div className="pb-1 text-gray-600 text-xl">→</div>
                <div>
                  <p className="text-xs text-gray-500 mb-0.5">Estimated Return</p>
                  <p className="text-2xl font-bold text-emerald-400">
                    ₹{formatNumber(Math.round(analytics.adSpend * analytics.roas))}
                  </p>
                </div>
              </div>
              <div className="mt-4 h-2 rounded-full bg-white/10 overflow-hidden">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: "100%" }}
                  transition={{ delay: 1, duration: 1.2, ease: "easeOut" }}
                  className="h-full rounded-full bg-gradient-to-r from-orange-500 to-emerald-500"
                />
              </div>
            </div>

            {/* ROAS highlight */}
            <div className="rounded-2xl bg-gradient-to-br from-pink-500/10 to-rose-500/5 border border-pink-500/25 p-6 flex flex-col justify-between">
              <div className="flex items-center gap-2 mb-3">
                <TrendingUp className="w-5 h-5 text-pink-400" />
                <h3 className="text-white font-semibold">Return on Ad Spend</h3>
              </div>
              <div className="text-center">
                <p className="text-6xl font-black bg-gradient-to-r from-pink-400 to-rose-400 bg-clip-text text-transparent">
                  {analytics.roas.toFixed(2)}x
                </p>
                <p className="text-gray-400 text-sm mt-2">
                  For every ₹1 spent, you earned ₹{analytics.roas.toFixed(2)}
                </p>
              </div>
            </div>
          </motion.div>

          {/* Back CTA */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.9 }}
            className="flex justify-center"
          >
            <Button
              onClick={() => navigate("/dashboard/campaigns")}
              variant="outline"
              className="border-purple-500/40 text-purple-400 hover:bg-purple-500/10 hover:text-purple-300 rounded-xl px-8 py-3"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to All Campaigns
            </Button>
          </motion.div>
        </div>
      </div>

      {/* Footer */}
      <footer className="relative z-10 border-t border-purple-500/20 bg-gray-900/50 backdrop-blur-sm py-8 px-4 mt-16">
        <div className="max-w-6xl mx-auto text-center">
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
