import { API_BASE } from "../config/api";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router";
import { motion } from "framer-motion";
import {
  TrendingUp, BarChart3, Plus, Activity,
  Zap, Instagram, Facebook, Youtube, Twitter, Linkedin,
  Globe, Bell, ArrowRight, Sparkles, Target, Eye,
  MousePointer, DollarSign, CheckCircle2, XCircle
} from "lucide-react";
import { DashboardSidebar } from "../components/DashboardSidebar";

const S = `
  .vxd-shell { display: flex; height: 100vh; background: var(--vx-bg-primary); overflow: hidden; }
  .vxd-page { flex: 1; overflow-y: auto; color: var(--vx-text-primary); font-family: 'Inter', sans-serif; padding: 48px 32px 100px; position: relative; overflow-x: hidden; }
  .vxd-inner { max-width: 1280px; margin: 0 auto; position: relative; z-index: 10; }
  .vxd-orb1 { position: fixed; top: -15%; right: -8%; width: 600px; height: 600px; background: radial-gradient(circle, rgba(167,139,250,0.12) 0%, transparent 70%); border-radius: 50%; pointer-events: none; }
  .vxd-orb2 { position: fixed; bottom: -20%; left: -10%; width: 700px; height: 700px; background: radial-gradient(circle, rgba(56,189,248,0.09) 0%, transparent 70%); border-radius: 50%; pointer-events: none; }
  .vxd-header { display: flex; align-items: flex-start; justify-content: space-between; flex-wrap: wrap; gap: 24px; margin-bottom: 56px; }
  .vxd-header-actions { display: flex; gap: 12px; flex-wrap: wrap; }
  .vxd-btn-ghost { padding: 11px 22px; border-radius: 14px; background: rgba(255,255,255,0.04); border: 1px solid rgba(255,255,255,0.09); color: var(--vx-text-primary); font-weight: 700; font-size: 14px; cursor: pointer; display: flex; align-items: center; gap: 8px; transition: all 0.2s; }
  .vxd-btn-ghost:hover { background: rgba(255,255,255,0.08); }
  .vxd-btn-primary { padding: 11px 22px; border-radius: 14px; background: linear-gradient(135deg, #a78bfa, #38bdf8); border: none; color: #fff; font-weight: 700; font-size: 14px; cursor: pointer; display: flex; align-items: center; gap: 8px; box-shadow: 0 8px 24px rgba(167,139,250,0.25); transition: transform 0.2s, box-shadow 0.2s; }
  .vxd-btn-primary:hover { transform: translateY(-2px); box-shadow: 0 12px 32px rgba(167,139,250,0.35); }
  .vxd-greeting { font-size: 34px; font-weight: 900; letter-spacing: -0.03em; margin-bottom: 6px; }
  .vxd-greeting span { background: linear-gradient(135deg, #a78bfa 30%, #38bdf8); -webkit-background-clip: text; -webkit-text-fill-color: transparent; }
  .vxd-sub { color: var(--vx-text-muted); font-size: 16px; }
  .vxd-kpi-grid { display: grid; grid-template-columns: repeat(4, 1fr); gap: 20px; margin-bottom: 28px; }
  .vxd-kpi { background: var(--vx-bg-card); border: 1px solid var(--vx-border); border-radius: 24px; padding: 28px; position: relative; overflow: hidden; transition: transform 0.25s, border-color 0.25s; }
  .vxd-kpi:hover { transform: translateY(-4px); border-color: rgba(167,139,250,0.3); }
  .vxd-kpi-accent { position: absolute; top: 0; left: 0; right: 0; height: 3px; border-radius: 24px 24px 0 0; }
  .vxd-kpi-icon { width: 40px; height: 40px; border-radius: 12px; display: flex; align-items: center; justify-content: center; margin-bottom: 20px; }
  .vxd-kpi-label { font-size: 11px; font-weight: 700; color: var(--vx-text-muted); text-transform: uppercase; letter-spacing: 0.07em; margin-bottom: 8px; }
  .vxd-kpi-val { font-size: 36px; font-weight: 800; line-height: 1; margin-bottom: 10px; }
  .vxd-kpi-badge { display: inline-flex; align-items: center; gap: 4px; font-size: 12px; font-weight: 700; padding: 3px 10px; border-radius: 20px; }
  .vxd-bento { display: grid; grid-template-columns: 2fr 1fr; gap: 24px; margin-bottom: 28px; }
  .vxd-card { background: var(--vx-bg-card); border: 1px solid var(--vx-border); border-radius: 24px; padding: 28px; }
  .vxd-card-title { font-size: 17px; font-weight: 800; margin-bottom: 20px; display: flex; align-items: center; justify-content: space-between; gap: 8px; }
  .vxd-card-title-left { display: flex; align-items: center; gap: 10px; }
  .vxd-card-icon { width: 32px; height: 32px; border-radius: 10px; display: flex; align-items: center; justify-content: center; }
  .vxd-view-all { font-size: 13px; font-weight: 700; color: #a78bfa; display: flex; align-items: center; gap: 4px; cursor: pointer; background: none; border: none; }
  .vxd-campaign-row { display: flex; align-items: center; justify-content: space-between; padding: 14px 16px; border-radius: 16px; background: rgba(255,255,255,0.02); border: 1px solid rgba(255,255,255,0.04); margin-bottom: 10px; transition: background 0.2s; cursor: pointer; }
  .vxd-campaign-row:hover { background: rgba(255,255,255,0.05); }
  .vxd-campaign-row:last-child { margin-bottom: 0; }
  .vxd-platform-chip { display: inline-flex; align-items: center; gap: 4px; padding: 3px 9px; border-radius: 20px; background: rgba(255,255,255,0.05); border: 1px solid rgba(255,255,255,0.08); font-size: 11px; color: var(--vx-text-muted); margin-right: 4px; }
  .vxd-status-pill { padding: 4px 12px; border-radius: 20px; font-size: 11px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.04em; }
  .vxd-empty { text-align: center; padding: 40px 20px; color: var(--vx-text-muted); font-size: 14px; }
  .vxd-action-grid { display: grid; grid-template-columns: 1fr; gap: 10px; }
  .vxd-action-item { display: flex; align-items: center; justify-content: space-between; padding: 14px 16px; border-radius: 16px; background: rgba(255,255,255,0.02); border: 1px solid rgba(255,255,255,0.04); cursor: pointer; font-size: 14px; font-weight: 600; transition: all 0.2s; }
  .vxd-action-item:hover { background: rgba(167,139,250,0.07); border-color: rgba(167,139,250,0.2); }
  .vxd-notif-row { display: flex; gap: 12px; margin-bottom: 16px; }
  .vxd-notif-dot { width: 8px; height: 8px; border-radius: 50%; margin-top: 5px; flex-shrink: 0; }
  .vxd-banner { background: linear-gradient(135deg, rgba(167,139,250,0.08), rgba(56,189,248,0.06)); border: 1px solid rgba(167,139,250,0.18); border-radius: 20px; padding: 24px 32px; display: flex; align-items: center; justify-content: space-between; flex-wrap: wrap; gap: 20px; margin-bottom: 28px; position: relative; overflow: hidden; }
  .vxd-banner::before { content: ''; position: absolute; top: 0; left: 0; right: 0; height: 2px; background: linear-gradient(90deg, #a78bfa, #38bdf8); }
  @media (max-width: 1100px) { .vxd-kpi-grid { grid-template-columns: repeat(2, 1fr); } .vxd-bento { grid-template-columns: 1fr; } }
  @media (max-width: 640px) { .vxd-kpi-grid { grid-template-columns: 1fr; } .vxd-greeting { font-size: 26px; } .vxd-page { padding: 72px 16px 80px; } }
`;

interface Campaign {
  id: string; name: string; platforms: string[]; budget: string; status: string;
  analytics?: { impressions: number; reach: number; clicks: number; adSpend: number; };
}

function getPlatformIcon(p: string) {
  const s = p.toLowerCase();
  const props = { size: 12 };
  if (s.includes("instagram")) return <Instagram {...props} />;
  if (s.includes("facebook")) return <Facebook {...props} />;
  if (s.includes("youtube")) return <Youtube {...props} />;
  if (s.includes("twitter") || s.includes("x")) return <Twitter {...props} />;
  if (s.includes("linkedin")) return <Linkedin {...props} />;
  return <Globe {...props} />;
}

function getStatusStyle(status: string): { bg: string; color: string } {
  switch (status) {
    case "running": case "approved": case "active": return { bg: "rgba(34,197,94,0.1)", color: "#22c55e" };
    case "pending": case "in_review": case "review": return { bg: "rgba(234,179,8,0.1)", color: "#eab308" };
    case "completed": return { bg: "rgba(56,189,248,0.1)", color: "#38bdf8" };
    case "rejected": return { bg: "rgba(239,68,68,0.1)", color: "#ef4444" };
    default: return { bg: "rgba(148,163,184,0.1)", color: "#94a3b8" };
  }
}

function fmt(n: number) {
  if (n >= 1_000_000) return (n / 1_000_000).toFixed(1) + "M";
  if (n >= 1_000) return (n / 1_000).toFixed(1) + "K";
  return String(n);
}

const card = (delay: number, children: React.ReactNode, className = "vxd-card") => (
  <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ delay, duration: 0.5, ease: "easeOut" }} className={className}>
    {children}
  </motion.div>
);

export default function UserDashboard() {
  const navigate = useNavigate();
  const [userName, setUserName] = useState("there");
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);
  const [stats, setStats] = useState({ active: 0, impressions: 0, clicks: 0, spent: 0 });

  useEffect(() => {
    if (localStorage.getItem("isAuthenticated") !== "true") { navigate("/auth", { replace: true }); return; }
    try {
      const u = JSON.parse(localStorage.getItem("userInfo") || "{}");
      if (u.name) setUserName(u.name.split(" ")[0]);
      if (u.onboardingCompleted === false) { navigate("/onboarding", { replace: true }); return; }
    } catch {}
    loadData();
  }, [navigate]);

  const loadData = async () => {
    const token = localStorage.getItem("authToken");
    let list: Campaign[] = [];
    if (token) {
      try {
        const r = await fetch(`${API_BASE}/api/campaign/my-campaigns`, { headers: { Authorization: `Bearer ${token}` } });
        const d = await r.json();
        if (d.success && d.campaigns) list = d.campaigns;
      } catch {}
    }
    if (!list.length) {
      try { const raw = localStorage.getItem("userCampaigns"); if (raw) list = JSON.parse(raw); } catch {}
    }
    if (!Array.isArray(list)) list = [];
    let active = 0, impressions = 0, clicks = 0, spent = 0;
    list.forEach(c => {
      if (["running", "approved", "active"].includes(c.status)) active++;
      impressions += c.analytics?.impressions || 0;
      clicks += c.analytics?.clicks || 0;
      spent += c.analytics?.adSpend || 0;
    });
    setStats({ active, impressions, clicks, spent });
    setCampaigns(list.slice(0, 4));
  };

  const hour = new Date().getHours();
  const greeting = hour < 12 ? "Good morning" : hour < 17 ? "Good afternoon" : "Good evening";

  const kpis = [
    { label: "Active Campaigns", val: stats.active, icon: <Activity size={18} />, iconBg: "rgba(34,197,94,0.12)", iconColor: "#22c55e", accent: "#22c55e", badge: null },
    { label: "Total Impressions", val: fmt(stats.impressions), icon: <Eye size={18} />, iconBg: "rgba(167,139,250,0.12)", iconColor: "#a78bfa", accent: "#a78bfa", badge: null },
    { label: "Total Clicks", val: fmt(stats.clicks), icon: <MousePointer size={18} />, iconBg: "rgba(56,189,248,0.12)", iconColor: "#38bdf8", accent: "#38bdf8", badge: null },
    { label: "Total Ad Spend", val: `₹${fmt(stats.spent)}`, icon: <DollarSign size={18} />, iconBg: "rgba(251,191,36,0.12)", iconColor: "#fbbf24", accent: "#fbbf24", badge: null },
  ];

  return (
    <div className="vxd-shell">
      <style dangerouslySetInnerHTML={{ __html: S }} />
      <DashboardSidebar userName={userName} userInitial={userName[0]?.toUpperCase() || "U"} />
      <div className="vxd-page">
        <div className="vxd-orb1" /><div className="vxd-orb2" />
        <div className="vxd-inner">

          {/* Header */}
          <motion.div initial={{ opacity: 0, y: -16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }} className="vxd-header">
            <div>
              <div className="vxd-greeting">{greeting}, <span>{userName}!</span></div>
              <div className="vxd-sub">Here's your campaign command centre — everything in one place.</div>
            </div>
            <div className="vxd-header-actions">
              <button className="vxd-btn-primary" onClick={() => navigate("/upload")}><Plus size={16} /> New Campaign</button>
            </div>
          </motion.div>

          {/* Promo Banner */}
          <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="vxd-banner">
            <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
              <div style={{ width: 48, height: 48, borderRadius: 14, background: "linear-gradient(135deg,#a78bfa,#38bdf8)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                <Sparkles size={22} color="#fff" />
              </div>
              <div>
                <div style={{ fontWeight: 800, fontSize: 16, marginBottom: 4 }}>Vulpinix AI Engine is ready</div>
                <div style={{ color: "var(--vx-text-muted)", fontSize: 14 }}>Upload media and let our AI generate your perfect campaign in seconds.</div>
              </div>
            </div>
            <button className="vxd-btn-primary" onClick={() => navigate("/upload")}>Launch Campaign <ArrowRight size={16} /></button>
          </motion.div>

          {/* KPI Grid */}
          <div className="vxd-kpi-grid">
            {kpis.map((k, i) => (
              <motion.div key={k.label} initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 + i * 0.07 }} className="vxd-kpi">
                <div className="vxd-kpi-accent" style={{ background: `linear-gradient(90deg, ${k.accent}, transparent)` }} />
                <div className="vxd-kpi-icon" style={{ background: k.iconBg, color: k.iconColor }}>{k.icon}</div>
                <div className="vxd-kpi-label">{k.label}</div>
                <div className="vxd-kpi-val">{k.val}</div>
              </motion.div>
            ))}
          </div>

          {/* Bento: Campaigns + Quick Actions */}
          <div className="vxd-bento">
            {/* Recent Campaigns */}
            {card(0.35, <>
              <div className="vxd-card-title">
                <div className="vxd-card-title-left">
                  <div className="vxd-card-icon" style={{ background: "rgba(167,139,250,0.12)", color: "#a78bfa" }}><Target size={16} /></div>
                  Recent Campaigns
                </div>
                <button className="vxd-view-all" onClick={() => navigate("/dashboard/campaigns")}>View All <ArrowRight size={14} /></button>
              </div>
              {campaigns.length === 0 ? (
                <div className="vxd-empty">
                  <BarChart3 size={36} style={{ margin: "0 auto 12px", opacity: 0.2 }} />
                  <div>No campaigns yet. Launch your first one!</div>
                  <button className="vxd-btn-primary" style={{ margin: "16px auto 0", justifyContent: "center" }} onClick={() => navigate("/upload")}><Plus size={14} /> Create Campaign</button>
                </div>
              ) : campaigns.map(c => {
                const st = getStatusStyle(c.status);
                return (
                  <div key={c.id} className="vxd-campaign-row" onClick={() => navigate("/dashboard/campaigns")}>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ fontWeight: 700, fontSize: 15, marginBottom: 6, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{c.name}</div>
                      <div style={{ display: "flex", flexWrap: "wrap", gap: 4 }}>
                        {c.platforms.slice(0, 3).map(p => <span key={p} className="vxd-platform-chip">{getPlatformIcon(p)} {p}</span>)}
                      </div>
                    </div>
                    <div style={{ display: "flex", alignItems: "center", gap: 16, flexShrink: 0, marginLeft: 12 }}>
                      <div style={{ textAlign: "right" }}>
                        <div style={{ fontSize: 13, fontWeight: 700 }}>{c.budget}</div>
                        <div style={{ fontSize: 11, color: "var(--vx-text-muted)" }}>Budget</div>
                      </div>
                      <span className="vxd-status-pill" style={{ background: st.bg, color: st.color }}>{c.status.replace("_", " ")}</span>
                    </div>
                  </div>
                );
              })}
            </>)}

            {/* Right Column */}
            <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
              {/* Quick Actions */}
              {card(0.4, <>
                <div className="vxd-card-title">
                  <div className="vxd-card-title-left">
                    <div className="vxd-card-icon" style={{ background: "rgba(56,189,248,0.12)", color: "#38bdf8" }}><Zap size={16} /></div>
                    Quick Actions
                  </div>
                </div>
                <div className="vxd-action-grid">
                  {[
                    { label: "Upload Media", icon: <Plus size={16} color="#a78bfa" />, path: "/upload" },
                    { label: "View Analytics", icon: <TrendingUp size={16} color="#38bdf8" />, path: "/dashboard/campaigns" },
                    { label: "Manage Profile", icon: <Activity size={16} color="#22c55e" />, path: "/profile" },
                    { label: "Billing & Plans", icon: <DollarSign size={16} color="#fbbf24" />, path: "/payment" },
                  ].map(a => (
                    <div key={a.label} className="vxd-action-item" onClick={() => navigate(a.path)}>
                      <div style={{ display: "flex", alignItems: "center", gap: 10 }}>{a.icon}{a.label}</div>
                      <ArrowRight size={14} color="var(--vx-text-muted)" />
                    </div>
                  ))}
                </div>
              </>)}

              {/* Activity Feed */}
              {card(0.45, <>
                <div className="vxd-card-title">
                  <div className="vxd-card-title-left">
                    <div className="vxd-card-icon" style={{ background: "rgba(234,179,8,0.12)", color: "#eab308" }}><Bell size={16} /></div>
                    Activity
                  </div>
                </div>
                {[
                  { dot: "#a78bfa", text: "AI optimisation complete", sub: "2 hours ago", icon: <CheckCircle2 size={14} color="#22c55e" /> },
                  { dot: "#38bdf8", text: "New analytics report ready", sub: "Yesterday", icon: <BarChart3 size={14} color="#38bdf8" /> },
                  { dot: "#22c55e", text: "Campaign approved & live", sub: "2 days ago", icon: <CheckCircle2 size={14} color="#22c55e" /> },
                  { dot: "#ef4444", text: "Review feedback received", sub: "3 days ago", icon: <XCircle size={14} color="#ef4444" /> },
                ].map((n, i) => (
                  <div key={i} className="vxd-notif-row">
                    <div className="vxd-notif-dot" style={{ background: n.dot }} />
                    <div>
                      <div style={{ fontSize: 14, fontWeight: 600, marginBottom: 2 }}>{n.text}</div>
                      <div style={{ fontSize: 12, color: "var(--vx-text-muted)" }}>{n.sub}</div>
                    </div>
                  </div>
                ))}
              </>)}
            </div>
          </div>

          {/* Stats Summary Row */}
          <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.55 }} className="vxd-card">
            <div className="vxd-card-title">
              <div className="vxd-card-title-left">
                <div className="vxd-card-icon" style={{ background: "rgba(167,139,250,0.12)", color: "#a78bfa" }}><TrendingUp size={16} /></div>
                Campaign Status Overview
              </div>
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))", gap: 20 }}>
              {[
                { label: "Running", count: campaigns.filter(c => ["running", "approved", "active"].includes(c.status)).length, color: "#22c55e" },
                { label: "In Review", count: campaigns.filter(c => ["pending", "in_review", "review"].includes(c.status)).length, color: "#eab308" },
                { label: "Completed", count: campaigns.filter(c => c.status === "completed").length, color: "#38bdf8" },
                { label: "Rejected", count: campaigns.filter(c => c.status === "rejected").length, color: "#ef4444" },
              ].map(s => (
                <div key={s.label} style={{ padding: "20px 24px", borderRadius: 18, background: `${s.color}08`, border: `1px solid ${s.color}20` }}>
                  <div style={{ fontSize: 11, fontWeight: 700, color: "var(--vx-text-muted)", textTransform: "uppercase", letterSpacing: "0.07em", marginBottom: 10 }}>{s.label}</div>
                  <div style={{ fontSize: 32, fontWeight: 800, color: s.color }}>{s.count}</div>
                </div>
              ))}
            </div>
          </motion.div>

        </div>
      </div>
    </div>
  );
}
