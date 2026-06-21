import { useState, useEffect } from "react";
import { useNavigate } from "react-router";
import { motion, AnimatePresence } from "framer-motion";
import { DashboardSidebar } from "../components/DashboardSidebar";
import { DashboardTopBar } from "../components/DashboardTopBar";
import { API_BASE } from "../config/api";
import {
  DollarSign, TrendingUp, Eye, MousePointer, Target,
  RefreshCw, ExternalLink, AlertCircle, CheckCircle2,
  BarChart3, Zap, ArrowUpRight, Activity
} from "lucide-react";

const S = `
  @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800;900&display=swap');
  .ads-shell{display:flex;height:100vh;background:#070b12;overflow:hidden;font-family:'Inter',sans-serif;}
  .ads-main{flex:1;display:flex;flex-direction:column;overflow:hidden;}
  .ads-scroll{flex:1;overflow-y:auto;padding:32px 36px 80px;}
  .ads-scroll::-webkit-scrollbar{width:6px;}
  .ads-scroll::-webkit-scrollbar-thumb{background:rgba(255,255,255,0.08);border-radius:3px;}
  .ads-inner{max-width:1200px;margin:0 auto;position:relative;}

  .ads-hero{border-radius:24px;padding:28px 36px;margin-bottom:24px;
    background:linear-gradient(135deg,#0d1420,#111827,#0a1628);
    border:1px solid rgba(59,130,246,0.18);position:relative;overflow:hidden;
    display:flex;align-items:center;justify-content:space-between;gap:20px;flex-wrap:wrap;}
  .ads-hero-line{position:absolute;top:0;left:0;right:0;height:2px;
    background:linear-gradient(90deg,#3b82f6,#8b5cf6,#06b6d4,#3b82f6);
    background-size:200%;animation:ads-shimmer 3s ease infinite;}
  @keyframes ads-shimmer{0%,100%{background-position:0%}50%{background-position:100%}}
  .ads-hero-title{font-size:24px;font-weight:900;color:#f1f5f9;letter-spacing:-0.02em;}
  .ads-hero-title span{background:linear-gradient(135deg,#60a5fa,#a78bfa);
    -webkit-background-clip:text;-webkit-text-fill-color:transparent;}
  .ads-hero-sub{font-size:13px;color:#64748b;margin-top:4px;}
  .ads-platform-tabs{display:flex;gap:8px;margin-bottom:24px;}
  .ads-tab{padding:8px 18px;border-radius:10px;font-size:13px;font-weight:700;cursor:pointer;
    transition:all 0.2s;border:1px solid rgba(255,255,255,0.08);color:#475569;background:rgba(255,255,255,0.03);}
  .ads-tab.active-fb{background:rgba(24,119,242,0.15);border-color:rgba(24,119,242,0.3);color:#60a5fa;}
  .ads-tab.active-ig{background:rgba(225,48,108,0.12);border-color:rgba(225,48,108,0.3);color:#f472b6;}
  .ads-tab.active-all{background:rgba(139,92,246,0.12);border-color:rgba(139,92,246,0.3);color:#c4b5fd;}
  .ads-tab:hover:not(.active-fb):not(.active-ig):not(.active-all){background:rgba(255,255,255,0.06);color:#94a3b8;}

  .ads-kpi-grid{display:grid;grid-template-columns:repeat(4,1fr);gap:14px;margin-bottom:24px;}
  .ads-kpi{border-radius:18px;padding:20px;background:rgba(255,255,255,0.02);
    border:1px solid rgba(255,255,255,0.07);transition:all 0.2s;position:relative;overflow:hidden;}
  .ads-kpi:hover{border-color:rgba(255,255,255,0.12);transform:translateY(-2px);}
  .ads-kpi-accent{position:absolute;top:0;left:0;right:0;height:2px;border-radius:18px 18px 0 0;}
  .ads-kpi-label{font-size:10px;font-weight:700;text-transform:uppercase;letter-spacing:0.08em;color:#334155;margin-bottom:10px;}
  .ads-kpi-val{font-size:26px;font-weight:900;line-height:1;margin-bottom:6px;}
  .ads-kpi-sub{font-size:11px;color:#475569;display:flex;align-items:center;gap:4px;}

  .ads-grid-2{display:grid;grid-template-columns:1fr 1fr;gap:18px;margin-bottom:24px;}
  .ads-card{border-radius:20px;background:rgba(255,255,255,0.02);border:1px solid rgba(255,255,255,0.07);padding:24px;}
  .ads-card-title{font-size:12px;font-weight:700;text-transform:uppercase;letter-spacing:0.08em;
    color:#334155;margin-bottom:18px;display:flex;align-items:center;gap:7px;}
  .ads-camp-row{display:flex;align-items:center;gap:12px;padding:12px 0;
    border-bottom:1px solid rgba(255,255,255,0.04);}
  .ads-camp-row:last-child{border-bottom:none;}
  .ads-status-dot{width:7px;height:7px;border-radius:50%;flex-shrink:0;}
  .ads-camp-name{font-size:13px;font-weight:600;color:#e2e8f0;flex:1;
    white-space:nowrap;overflow:hidden;text-overflow:ellipsis;}
  .ads-camp-meta{font-size:11px;color:#475569;}
  .ads-camp-spend{font-size:13px;font-weight:700;color:#22c55e;white-space:nowrap;}
  .ads-badge{display:inline-flex;align-items:center;gap:4px;padding:3px 9px;border-radius:8px;
    font-size:10px;font-weight:700;}
  .ads-badge-active{background:rgba(34,197,94,0.12);color:#22c55e;border:1px solid rgba(34,197,94,0.2);}
  .ads-badge-paused{background:rgba(245,158,11,0.1);color:#fbbf24;border:1px solid rgba(245,158,11,0.2);}
  .ads-badge-archived{background:rgba(100,116,139,0.1);color:#64748b;border:1px solid rgba(100,116,139,0.2);}

  .ads-ad-grid{display:grid;grid-template-columns:repeat(2,1fr);gap:10px;}
  .ads-ad-card{border-radius:14px;background:rgba(255,255,255,0.02);border:1px solid rgba(255,255,255,0.06);
    overflow:hidden;transition:all 0.2s;}
  .ads-ad-card:hover{border-color:rgba(255,255,255,0.11);transform:translateY(-1px);}
  .ads-ad-thumb{width:100%;height:90px;object-fit:cover;background:linear-gradient(135deg,#1e2433,#0f172a);}
  .ads-ad-thumb-placeholder{width:100%;height:90px;background:linear-gradient(135deg,#1a2035,#0f1a2e);
    display:flex;align-items:center;justify-content:center;}
  .ads-ad-body{padding:10px 12px;}
  .ads-ad-name{font-size:12px;font-weight:700;color:#e2e8f0;margin-bottom:4px;
    white-space:nowrap;overflow:hidden;text-overflow:ellipsis;}
  .ads-ad-stats{display:flex;gap:10px;}
  .ads-ad-stat{font-size:10px;color:#64748b;}
  .ads-ad-stat span{color:#94a3b8;font-weight:600;}

  .ads-empty{text-align:center;padding:60px 32px;}
  .ads-empty-icon{width:72px;height:72px;border-radius:20px;background:rgba(59,130,246,0.08);
    border:1px solid rgba(59,130,246,0.15);display:flex;align-items:center;justify-content:center;
    margin:0 auto 20px;color:#3b82f6;}
  .ads-btn{display:inline-flex;align-items:center;gap:7px;padding:10px 20px;border-radius:12px;
    font-size:13px;font-weight:700;cursor:pointer;transition:all 0.2s;border:none;font-family:'Inter',sans-serif;}
  .ads-btn-primary{background:linear-gradient(135deg,#3b82f6,#8b5cf6);color:#fff;
    box-shadow:0 6px 18px rgba(59,130,246,0.28);}
  .ads-btn-primary:hover{transform:translateY(-2px);box-shadow:0 10px 24px rgba(59,130,246,0.4);}
  .ads-btn-ghost{background:rgba(255,255,255,0.04);border:1px solid rgba(255,255,255,0.09)!important;
    color:#64748b;}
  .ads-btn-ghost:hover{background:rgba(255,255,255,0.08);color:#94a3b8;}

  .ads-no-account{border-radius:20px;padding:36px;text-align:center;
    background:rgba(59,130,246,0.04);border:1px solid rgba(59,130,246,0.12);margin-bottom:24px;}
  .ads-err{border-radius:14px;padding:16px 20px;background:rgba(239,68,68,0.08);
    border:1px solid rgba(239,68,68,0.2);color:#fca5a5;font-size:13px;
    display:flex;align-items:center;gap:10px;margin-bottom:20px;}
  .ads-skeleton{border-radius:12px;background:linear-gradient(90deg,rgba(255,255,255,0.03) 25%,rgba(255,255,255,0.06) 50%,rgba(255,255,255,0.03) 75%);
    background-size:200%;animation:ads-skel 1.5s ease infinite;}
  @keyframes ads-skel{0%{background-position:200%}100%{background-position:-200%}}
  @media(max-width:900px){.ads-kpi-grid{grid-template-columns:repeat(2,1fr);}.ads-grid-2{grid-template-columns:1fr;}}

  /* ── Demo FB Ad ──────────────────────────────────────── */
  .demo-section{margin-bottom:28px;}
  .demo-section-label{font-size:10px;font-weight:700;letter-spacing:0.1em;text-transform:uppercase;
    color:#334155;margin-bottom:12px;display:flex;align-items:center;gap:8px;}
  .demo-section-label::after{content:'';flex:1;height:1px;background:rgba(255,255,255,0.05);}
  .demo-fb-wrap{display:grid;grid-template-columns:340px 1fr;gap:20px;align-items:start;}
  .demo-fb-card{border-radius:16px;overflow:hidden;
    background:#18191a;border:1px solid rgba(255,255,255,0.09);
    box-shadow:0 8px 32px rgba(0,0,0,0.5);}
  .demo-fb-header{display:flex;align-items:center;gap:10px;padding:12px 14px 0;}
  .demo-fb-avatar{width:38px;height:38px;border-radius:50%;flex-shrink:0;
    background:linear-gradient(135deg,#7c3aed,#2563eb);
    display:flex;align-items:center;justify-content:center;font-size:15px;font-weight:900;color:#fff;}
  .demo-fb-name{font-size:13px;font-weight:700;color:#e4e6ea;line-height:1.2;}
  .demo-fb-sponsored{font-size:11px;color:#8a8d91;display:flex;align-items:center;gap:3px;}
  .demo-fb-dots{margin-left:auto;color:#8a8d91;font-size:18px;cursor:pointer;padding:0 4px;
    border-radius:50%;transition:background 0.15s;}
  .demo-fb-dots:hover{background:rgba(255,255,255,0.07);}
  .demo-fb-copy{padding:10px 14px 8px;font-size:13px;color:#e4e6ea;line-height:1.55;
    white-space:pre-wrap;}
  .demo-fb-img{width:100%;display:block;object-fit:cover;max-height:220px;}
  .demo-fb-cta-bar{display:flex;align-items:center;justify-content:space-between;
    padding:10px 14px;background:#242526;}
  .demo-fb-cta-info{}
  .demo-fb-cta-url{font-size:10px;color:#8a8d91;text-transform:uppercase;letter-spacing:0.04em;}
  .demo-fb-cta-headline{font-size:13px;font-weight:700;color:#e4e6ea;margin:1px 0;}
  .demo-fb-cta-desc{font-size:11px;color:#8a8d91;}
  .demo-fb-cta-btn{padding:7px 14px;border-radius:7px;background:#e4e6ea;color:#050505;
    font-size:13px;font-weight:700;border:none;cursor:pointer;white-space:nowrap;
    transition:background 0.15s;flex-shrink:0;}
  .demo-fb-cta-btn:hover{background:#fff;}
  .demo-fb-actions{display:flex;border-top:1px solid rgba(255,255,255,0.07);}
  .demo-fb-action{flex:1;display:flex;align-items:center;justify-content:center;gap:6px;
    padding:9px 0;font-size:13px;font-weight:600;color:#8a8d91;cursor:pointer;
    transition:background 0.15s;border-radius:4px;}
  .demo-fb-action:hover{background:rgba(255,255,255,0.06);color:#e4e6ea;}
  .demo-fb-reactions{display:flex;align-items:center;gap:6px;padding:6px 14px;
    border-top:1px solid rgba(255,255,255,0.05);}
  .demo-fb-react-icons{display:flex;}
  .demo-fb-react-icons span{width:18px;height:18px;border-radius:50%;display:inline-flex;
    align-items:center;justify-content:center;font-size:11px;margin-left:-4px;
    border:1px solid #18191a;}
  .demo-fb-react-count{font-size:12px;color:#8a8d91;}
  .demo-metrics{display:flex;flex-direction:column;gap:12px;}
  .demo-metric-card{border-radius:14px;padding:18px 20px;
    background:rgba(255,255,255,0.02);border:1px solid rgba(255,255,255,0.07);
    display:flex;align-items:center;gap:16px;transition:all 0.2s;}
  .demo-metric-card:hover{border-color:rgba(255,255,255,0.12);transform:translateX(2px);}
  .demo-metric-icon{width:42px;height:42px;border-radius:12px;flex-shrink:0;
    display:flex;align-items:center;justify-content:center;}
  .demo-metric-label{font-size:11px;font-weight:700;text-transform:uppercase;
    letter-spacing:0.07em;color:#475569;}
  .demo-metric-val{font-size:22px;font-weight:900;line-height:1.1;}
  .demo-metric-sub{font-size:11px;color:#475569;margin-top:2px;}
  .demo-chip{display:inline-flex;align-items:center;gap:5px;padding:3px 10px;
    border-radius:20px;font-size:10px;font-weight:700;background:rgba(24,119,242,0.12);
    border:1px solid rgba(24,119,242,0.25);color:#60a5fa;margin-left:auto;}
`;

function fmtN(n: number) {
  if (n >= 1_000_000) return (n / 1_000_000).toFixed(1) + "M";
  if (n >= 1_000) return (n / 1_000).toFixed(1) + "K";
  return String(n);
}

function StatusBadge({ status }: { status: string }) {
  const cls = status === "ACTIVE" ? "ads-badge-active" : status === "PAUSED" ? "ads-badge-paused" : "ads-badge-archived";
  return <span className={`ads-badge ${cls}`}>{status}</span>;
}

function DemoFacebookAd() {
  const metrics = [
    { label: "Impressions", val: "2.4M",  sub: "Unique accounts reached",  color: "#60a5fa", bg: "rgba(59,130,246,0.12)",  icon: "👁️" },
    { label: "Clicks",      val: "18.5K", sub: "Link clicks to website",   color: "#a78bfa", bg: "rgba(139,92,246,0.12)", icon: "🖱️" },
    { label: "CTR",         val: "3.2%",  sub: "Click-through rate",       color: "#34d399", bg: "rgba(16,185,129,0.12)", icon: "📈" },
    { label: "Spend",       val: "$124",  sub: "Total amount spent",       color: "#fb923c", bg: "rgba(249,115,22,0.12)", icon: "💰" },
    { label: "Conversions",val: "312",   sub: "Actions completed",        color: "#f472b6", bg: "rgba(236,72,153,0.12)", icon: "🎯" },
    { label: "CPC",        val: "$0.67", sub: "Cost per click",           color: "#38bdf8", bg: "rgba(14,165,233,0.12)", icon: "⚡" },
  ];
  return (
    <motion.div className="demo-section" initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
      <div className="demo-section-label">
        <span style={{ fontSize: 14 }}>📘</span> Facebook Ad Preview
        <span className="demo-chip">Sample Campaign · Active</span>
      </div>
      <div className="demo-fb-wrap">
        {/* Facebook Ad Card */}
        <div className="demo-fb-card">
          {/* Header */}
          <div className="demo-fb-header">
            <div className="demo-fb-avatar">V</div>
            <div>
              <div className="demo-fb-name">Vulpinix</div>
              <div className="demo-fb-sponsored">
                <span>Sponsored</span>
                <span>·</span>
                <svg width="10" height="10" viewBox="0 0 24 24" fill="#8a8d91"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 14.5v-9l6 4.5-6 4.5z"/></svg>
              </div>
            </div>
            <div className="demo-fb-dots">···</div>
          </div>
          {/* Body copy */}
          <div className="demo-fb-copy">{`🚀 Scale your brand with AI-powered social media tools.

Schedule posts, analyze performance, and grow across every platform — all in one place.`}</div>
          {/* Ad Image */}
          <img src="/facebook_demo_ad.png" alt="Vulpinix Ad Creative" className="demo-fb-img" />
          {/* CTA bar */}
          <div className="demo-fb-cta-bar">
            <div className="demo-fb-cta-info">
              <div className="demo-fb-cta-url">vulpinix.com</div>
              <div className="demo-fb-cta-headline">Grow Your Brand with AI</div>
              <div className="demo-fb-cta-desc">AI-powered social media management</div>
            </div>
            <button className="demo-fb-cta-btn">Learn More</button>
          </div>
          {/* Reactions row */}
          <div className="demo-fb-reactions">
            <div className="demo-fb-react-icons">
              <span style={{ background: "#1877F2" }}>👍</span>
              <span style={{ background: "#E1306C" }}>❤️</span>
              <span style={{ background: "#F7B928" }}>😮</span>
            </div>
            <span className="demo-fb-react-count">2.1K · 312 comments · 84 shares</span>
          </div>
          {/* Action buttons */}
          <div className="demo-fb-actions">
            {[["👍","Like"],["💬","Comment"],["↗","Share"]].map(([ic, lb]) => (
              <div key={lb} className="demo-fb-action"><span>{ic}</span><span>{lb}</span></div>
            ))}
          </div>
        </div>
        {/* Metrics */}
        <div className="demo-metrics">
          {metrics.map((m, i) => (
            <motion.div key={m.label} className="demo-metric-card"
              initial={{ opacity: 0, x: 12 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.1 + i * 0.06 }}>
              <div className="demo-metric-icon" style={{ background: m.bg }}>
                <span style={{ fontSize: 18 }}>{m.icon}</span>
              </div>
              <div>
                <div className="demo-metric-label">{m.label}</div>
                <div className="demo-metric-val" style={{ color: m.color }}>{m.val}</div>
                <div className="demo-metric-sub">{m.sub}</div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </motion.div>
  );
}

type Tab = "all" | "facebook" | "instagram";

export default function AdsDashboardPage() {
  const navigate = useNavigate();
  const [userName, setUserName] = useState("User");
  const [tab, setTab] = useState<Tab>("all");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [data, setData] = useState<any>(null);

  const userInitial = userName[0]?.toUpperCase() || "U";

  const fetchAds = async () => {
    setLoading(true);
    setError("");
    try {
      const token = localStorage.getItem("authToken");
      if (!token) { navigate("/auth"); return; }
      const res = await fetch(`${API_BASE}/api/ads/meta`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      const json = await res.json();
      if (!res.ok) {
        if (json.error === "NOT_CONNECTED") {
          setError("connect");
        } else {
          setError(json.details || json.error || "Failed to load ads data");
        }
        return;
      }
      setData(json);
    } catch (e: any) {
      setError(e.message || "Network error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (localStorage.getItem("isAuthenticated") !== "true") { navigate("/auth"); return; }
    const u = JSON.parse(localStorage.getItem("userInfo") || "{}");
    if (u.name) setUserName(u.name.split(" ")[0]);
    fetchAds();
  }, []);

  const summary = data?.summary;
  const campaigns: any[] = data?.campaigns || [];
  const topAds: any[] = data?.topAds || [];

  const KPIs = summary ? [
    { label: "Total Spend", val: `$${summary.spend}`, sub: summary.currency, icon: <DollarSign size={16} />, color: "#22c55e", accent: "#22c55e" },
    { label: "Impressions", val: fmtN(summary.impressions), sub: "Last 30 days", icon: <Eye size={16} />, color: "#60a5fa", accent: "#3b82f6" },
    { label: "Clicks", val: fmtN(summary.clicks), sub: `CTR: ${summary.ctr}%`, icon: <MousePointer size={16} />, color: "#a78bfa", accent: "#8b5cf6" },
    { label: "Reach", val: fmtN(summary.reach), sub: `CPM: $${summary.cpm}`, icon: <Activity size={16} />, color: "#f472b6", accent: "#ec4899" },
    { label: "CPC", val: `$${summary.cpc}`, sub: "Cost per click", icon: <TrendingUp size={16} />, color: "#fb923c", accent: "#f97316" },
    { label: "Conversions", val: fmtN(summary.conversions), sub: "Tracked actions", icon: <Target size={16} />, color: "#34d399", accent: "#10b981" },
    { label: "Active Campaigns", val: String(summary.activeCampaigns), sub: `of ${summary.totalCampaigns} total`, icon: <BarChart3 size={16} />, color: "#38bdf8", accent: "#0ea5e9" },
    { label: "Ad Accounts", val: String(data?.adAccounts?.length || 1), sub: "Connected", icon: <Zap size={16} />, color: "#c084fc", accent: "#a855f7" },
  ] : [];

  return (
    <div className="ads-shell">
      <style dangerouslySetInnerHTML={{ __html: S }} />
      <DashboardSidebar userName={userName} userInitial={userInitial} />
      <div className="ads-main">
        <DashboardTopBar userName={userName} userInitial={userInitial} />
        <div className="ads-scroll">
          <div className="ads-inner">

            {/* Hero */}
            <motion.div initial={{ opacity: 0, y: -14 }} animate={{ opacity: 1, y: 0 }} className="ads-hero">
              <div className="ads-hero-line" />
              <div>
                <div className="ads-hero-title">Ads <span>Dashboard</span></div>
                <div className="ads-hero-sub">Facebook & Instagram paid ad performance · Meta Marketing API</div>
              </div>
              <div style={{ display: "flex", gap: 10 }}>
                <button className="ads-btn ads-btn-ghost" onClick={fetchAds} style={{ border: "1px solid rgba(255,255,255,0.09)" }}>
                  <motion.span animate={loading ? { rotate: 360 } : { rotate: 0 }} transition={{ duration: 1, repeat: loading ? Infinity : 0, ease: "linear" }} style={{ display: "flex" }}>
                    <RefreshCw size={13} />
                  </motion.span>
                  {loading ? "Loading…" : "Refresh"}
                </button>
                <button className="ads-btn ads-btn-primary" onClick={() => window.open("https://www.facebook.com/adsmanager", "_blank")}>
                  <ExternalLink size={13} /> Ads Manager
                </button>
              </div>
            </motion.div>

            {/* Platform tabs */}
            <div className="ads-platform-tabs">
              {([["all","All Platforms","active-all"],["facebook","Facebook Ads","active-fb"],["instagram","Instagram Ads","active-ig"]] as [Tab,string,string][]).map(([id,label,cls]) => (
                <button key={id} className={`ads-tab ${tab === id ? cls : ""}`} onClick={() => setTab(id)}>{label}</button>
              ))}
            </div>

            {/* Always-visible Demo Facebook Ad */}
            {!loading && <DemoFacebookAd />}

            {/* Error / Connect state */}
            {error === "connect" && (
              <div className="ads-no-account">
                <div className="ads-empty-icon"><DollarSign size={28} /></div>
                <div style={{ fontSize: 18, fontWeight: 800, color: "#e2e8f0", marginBottom: 8 }}>No Ad Account Connected</div>
                <div style={{ fontSize: 13, color: "#475569", maxWidth: 400, margin: "0 auto 24px", lineHeight: 1.7 }}>
                  Connect your Facebook account and authorize an Ad Account to view paid campaign metrics — impressions, spend, CPC, conversions and more.
                </div>
                <button className="ads-btn ads-btn-primary" onClick={() => navigate("/social")}>Connect Facebook Account</button>
              </div>
            )}
            {error && error !== "connect" && (
              <div className="ads-err"><AlertCircle size={16} />{error}</div>
            )}

            {/* Skeleton loader */}
            {loading && (
              <>
                <div className="ads-kpi-grid" style={{ marginBottom: 24 }}>
                  {Array.from({ length: 8 }).map((_, i) => (
                    <div key={i} className="ads-skeleton" style={{ height: 110, borderRadius: 18 }} />
                  ))}
                </div>
                <div className="ads-grid-2">
                  <div className="ads-skeleton" style={{ height: 320, borderRadius: 20 }} />
                  <div className="ads-skeleton" style={{ height: 320, borderRadius: 20 }} />
                </div>
              </>
            )}

            {/* No ad account but connected */}
            {!loading && data && !data.hasAdAccount && (
              <div className="ads-no-account">
                <div className="ads-empty-icon"><BarChart3 size={28} /></div>
                <div style={{ fontSize: 18, fontWeight: 800, color: "#e2e8f0", marginBottom: 8 }}>No Ad Account Found</div>
                <div style={{ fontSize: 13, color: "#475569", maxWidth: 380, margin: "0 auto 24px", lineHeight: 1.7 }}>
                  Your Facebook account is connected but no Ad Account was found. Create a Facebook Ads account to start running and tracking paid campaigns.
                </div>
                <button className="ads-btn ads-btn-primary" onClick={() => window.open("https://www.facebook.com/business/help/910137316041095", "_blank")}>
                  Create Ad Account <ExternalLink size={12} />
                </button>
              </div>
            )}

            {/* Main content */}
            {!loading && data?.hasAdAccount && summary && (
              <AnimatePresence>
                <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.35 }}>

                  {/* Account chip */}
                  {data.adAccounts?.[0] && (
                    <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 20 }}>
                      <div style={{ display: "inline-flex", alignItems: "center", gap: 8, padding: "6px 14px", borderRadius: 10, background: "rgba(34,197,94,0.08)", border: "1px solid rgba(34,197,94,0.18)", fontSize: 12, fontWeight: 700 }}>
                        <CheckCircle2 size={12} color="#22c55e" />
                        <span style={{ color: "#22c55e" }}>{data.adAccounts[0].name}</span>
                        <span style={{ color: "#475569" }}>· {data.adAccounts[0].currency} · ${data.adAccounts[0].amountSpent} all-time spend</span>
                      </div>
                    </div>
                  )}

                  {/* KPI Grid */}
                  <div className="ads-kpi-grid" style={{ gridTemplateColumns: "repeat(4,1fr)" }}>
                    {KPIs.map((k, i) => (
                      <motion.div key={k.label} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }} className="ads-kpi">
                        <div className="ads-kpi-accent" style={{ background: `linear-gradient(90deg,${k.accent},transparent)` }} />
                        <div className="ads-kpi-label">{k.label}</div>
                        <div className="ads-kpi-val" style={{ color: k.color }}>{k.val}</div>
                        <div className="ads-kpi-sub" style={{ color: "#475569" }}>{React.createElement(k.icon.type as any, { size: 10, color: k.color })}<span>{k.sub}</span></div>
                      </motion.div>
                    ))}
                  </div>

                  {/* Campaigns + Top Ads */}
                  <div className="ads-grid-2">
                    {/* Campaigns */}
                    <div className="ads-card">
                      <div className="ads-card-title"><BarChart3 size={12} /> Campaigns</div>
                      {campaigns.length === 0 ? (
                        <div style={{ textAlign: "center", padding: "24px 0", color: "#334155", fontSize: 13 }}>No campaigns found.</div>
                      ) : campaigns.map((c, i) => (
                        <motion.div key={c.id} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: i * 0.05 }} className="ads-camp-row">
                          <div className="ads-status-dot" style={{ background: c.status === "ACTIVE" ? "#22c55e" : c.status === "PAUSED" ? "#fbbf24" : "#475569", boxShadow: c.status === "ACTIVE" ? "0 0 6px rgba(34,197,94,0.5)" : "none" }} />
                          <div style={{ flex: 1, minWidth: 0 }}>
                            <div className="ads-camp-name">{c.name}</div>
                            <div className="ads-camp-meta">{fmtN(c.impressions)} impr · {fmtN(c.clicks)} clicks · {c.ctr}% CTR</div>
                          </div>
                          <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-end", gap: 4 }}>
                            <div className="ads-camp-spend">${c.spend}</div>
                            <StatusBadge status={c.status} />
                          </div>
                        </motion.div>
                      ))}
                    </div>

                    {/* Top Ads */}
                    <div className="ads-card">
                      <div className="ads-card-title"><Zap size={12} /> Top Ads</div>
                      {topAds.length === 0 ? (
                        <div style={{ textAlign: "center", padding: "24px 0", color: "#334155", fontSize: 13 }}>No ads found.</div>
                      ) : (
                        <div className="ads-ad-grid">
                          {topAds.slice(0, 6).map((ad, i) => (
                            <motion.div key={ad.id} initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: i * 0.06 }} className="ads-ad-card">
                              {ad.thumbnailUrl
                                ? <img src={ad.thumbnailUrl} alt={ad.name} className="ads-ad-thumb" />
                                : <div className="ads-ad-thumb-placeholder"><Eye size={20} color="#1e3a5f" /></div>
                              }
                              <div className="ads-ad-body">
                                <div className="ads-ad-name">{ad.headline || ad.name}</div>
                                <div className="ads-ad-stats">
                                  <span className="ads-ad-stat"><span>{fmtN(ad.impressions)}</span> impr</span>
                                  <span className="ads-ad-stat"><span>{ad.ctr}%</span> CTR</span>
                                  <span className="ads-ad-stat"><span>${ad.spend}</span></span>
                                </div>
                              </div>
                            </motion.div>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Platform breakdown note */}
                  <div style={{ display: "flex", gap: 14, marginTop: 4 }}>
                    {[
                      { color: "#1877F2", label: "Facebook Ads", icon: "📘" },
                      { color: "#E1306C", label: "Instagram Ads", icon: "📸" },
                    ].map(p => (
                      <div key={p.label} style={{ flex: 1, borderRadius: 16, padding: "18px 20px", background: "rgba(255,255,255,0.02)", border: `1px solid rgba(255,255,255,0.07)`, display: "flex", alignItems: "center", gap: 12 }}>
                        <div style={{ fontSize: 22 }}>{p.icon}</div>
                        <div>
                          <div style={{ fontSize: 13, fontWeight: 700, color: "#e2e8f0" }}>{p.label}</div>
                          <div style={{ fontSize: 11, color: "#475569", marginTop: 2 }}>Powered by Meta Marketing API · Last 30 days</div>
                        </div>
                        <div style={{ marginLeft: "auto" }}>
                          <button className="ads-btn ads-btn-ghost" style={{ border: "1px solid rgba(255,255,255,0.08)", fontSize: 12, padding: "7px 13px" }} onClick={() => window.open("https://www.facebook.com/adsmanager", "_blank")}>
                            <ArrowUpRight size={11} /> Open
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>

                </motion.div>
              </AnimatePresence>
            )}

          </div>
        </div>
      </div>
    </div>
  );
}

import React from "react";
