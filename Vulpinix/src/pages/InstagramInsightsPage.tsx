import { API_BASE } from "../config/api";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router";
import { motion } from "framer-motion";
import { ArrowLeft, Heart, MessageCircle, Eye, Bookmark, Play, TrendingUp, Instagram, ExternalLink, RefreshCw, AlertCircle } from "lucide-react";
import { DashboardSidebar } from "../components/DashboardSidebar";
import { DashboardTopBar } from "../components/DashboardTopBar";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area } from "recharts";

const S = `
  @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800;900&display=swap');
  .igp-shell{display:flex;height:100vh;background:#070b12;overflow:hidden;font-family:'Inter',sans-serif;}
  .igp-main{flex:1;display:flex;flex-direction:column;overflow:hidden;}
  .igp-scroll{flex:1;overflow-y:auto;padding:32px 36px 100px;}
  .igp-scroll::-webkit-scrollbar{width:6px;}
  .igp-scroll::-webkit-scrollbar-thumb{background:rgba(255,255,255,0.08);border-radius:3px;}
  .igp-inner{max-width:1200px;margin:0 auto;position:relative;z-index:1;}
  .igp-orb{position:fixed;pointer-events:none;border-radius:50%;z-index:0;}
  .igp-orb1{width:600px;height:600px;top:-160px;right:-120px;background:radial-gradient(circle,rgba(225,48,108,0.10) 0%,transparent 70%);}
  .igp-orb2{width:500px;height:500px;bottom:-150px;left:-60px;background:radial-gradient(circle,rgba(167,139,250,0.07) 0%,transparent 70%);}
  .igp-hero{border-radius:28px;padding:32px 40px;margin-bottom:28px;background:linear-gradient(135deg,#1a0a14 0%,#110818 60%,#0d0b12 100%);border:1px solid rgba(225,48,108,0.18);display:flex;align-items:center;justify-content:space-between;gap:20px;flex-wrap:wrap;position:relative;overflow:hidden;}
  .igp-hero-line{position:absolute;top:0;left:0;right:0;height:2px;background:linear-gradient(90deg,#E1306C,#833AB4,#FCAF45,#E1306C);background-size:300%;animation:igp-shimmer 4s linear infinite;}
  @keyframes igp-shimmer{0%{background-position:0%}100%{background-position:300%}}
  .igp-kpis{display:grid;grid-template-columns:repeat(6,1fr);gap:14px;margin-bottom:24px;}
  .igp-kpi{border-radius:18px;padding:18px 16px;background:rgba(255,255,255,0.025);border:1px solid rgba(255,255,255,0.07);transition:all 0.2s;}
  .igp-kpi:hover{border-color:rgba(225,48,108,0.25);transform:translateY(-3px);}
  .igp-kpi-ic{width:34px;height:34px;border-radius:10px;display:flex;align-items:center;justify-content:center;margin-bottom:12px;}
  .igp-kpi-val{font-size:22px;font-weight:900;line-height:1;margin-bottom:4px;}
  .igp-kpi-lbl{font-size:10px;font-weight:700;color:#475569;text-transform:uppercase;letter-spacing:0.07em;}
  .igp-card{border-radius:22px;padding:26px 28px;margin-bottom:20px;background:rgba(255,255,255,0.025);border:1px solid rgba(255,255,255,0.07);}
  .igp-card-title{font-size:13px;font-weight:800;color:#475569;text-transform:uppercase;letter-spacing:0.07em;margin-bottom:20px;display:flex;align-items:center;gap:8px;}
  .igp-grid{display:grid;grid-template-columns:1fr 1fr;gap:18px;margin-bottom:20px;}
  .igp-posts{display:grid;grid-template-columns:repeat(3,1fr);gap:16px;}
  .igp-post{border-radius:16px;overflow:hidden;background:rgba(255,255,255,0.02);border:1px solid rgba(255,255,255,0.07);transition:all 0.2s;cursor:pointer;}
  .igp-post:hover{border-color:rgba(225,48,108,0.3);transform:translateY(-3px);}
  .igp-post-thumb{width:100%;aspect-ratio:1;background:#0f1628;display:flex;align-items:center;justify-content:center;position:relative;overflow:hidden;}
  .igp-post-thumb img{width:100%;height:100%;object-fit:cover;}
  .igp-post-body{padding:12px;}
  .igp-post-stat{display:flex;align-items:center;gap:5px;font-size:12px;font-weight:600;color:#94a3b8;}
  .igp-profile{display:flex;align-items:center;gap:16px;padding:16px 20px;background:rgba(225,48,108,0.05);border-radius:16px;border:1px solid rgba(225,48,108,0.12);margin-bottom:20px;}
  .igp-profile-pic{width:56px;height:56px;border-radius:50%;border:2px solid rgba(225,48,108,0.4);object-fit:cover;background:#1a0a14;display:flex;align-items:center;justify-content:center;}
  .igp-btn{display:inline-flex;align-items:center;gap:7px;padding:9px 18px;border-radius:12px;background:rgba(255,255,255,0.04);border:1px solid rgba(255,255,255,0.09);color:#94a3b8;font-weight:700;font-size:13px;cursor:pointer;transition:all 0.2s;font-family:'Inter',sans-serif;}
  .igp-btn:hover{background:rgba(255,255,255,0.08);color:#e2e8f0;}
  .igp-badge{display:inline-flex;align-items:center;gap:4px;padding:4px 10px;border-radius:8px;background:linear-gradient(135deg,rgba(225,48,108,0.15),rgba(131,58,180,0.15));border:1px solid rgba(225,48,108,0.25);color:#f472b6;font-size:11px;font-weight:700;}
  .igp-notice{border-radius:16px;padding:32px;background:rgba(225,48,108,0.05);border:1px dashed rgba(225,48,108,0.2);text-align:center;margin-bottom:20px;}
  @media(max-width:1100px){.igp-kpis{grid-template-columns:repeat(3,1fr);}.igp-posts{grid-template-columns:repeat(2,1fr);}.igp-grid{grid-template-columns:1fr;}}
  @media(max-width:640px){.igp-scroll{padding:20px 16px 80px;}.igp-kpis{grid-template-columns:repeat(2,1fr);}.igp-posts{grid-template-columns:1fr;}}
`;

function fmt(n: number) {
  if (n >= 1_000_000) return (n / 1_000_000).toFixed(1) + "M";
  if (n >= 1_000) return (n / 1_000).toFixed(1) + "K";
  return String(n);
}

interface IGPost {
  id: string; caption: string; mediaType: string; mediaUrl: string | null;
  permalink: string; timestamp: string; likes: number; comments: number;
  videoViews: number; saved: number; reach: number; impressions: number; engagement: number;
}

interface IGData {
  account: { username: string; name: string; profilePictureUrl: string; biography: string; followersCount: number; followsCount: number; mediaCount: number; };
  accountInsights: Record<string, any>;
  totals: { totalLikes: number; totalComments: number; totalVideoViews: number; totalSaved: number; totalReach: number; totalImpressions: number; };
  engagementRate: string;
  posts: IGPost[];
}

export default function InstagramInsightsPage() {
  const navigate = useNavigate();
  const [data, setData] = useState<IGData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [refreshing, setRefreshing] = useState(false);

  const userInfo = JSON.parse(localStorage.getItem("userInfo") || "{}");
  const userName = userInfo.name?.split(" ")[0] || "User";
  const userInitial = userName[0]?.toUpperCase() || "U";

  const load = async (isRefresh = false) => {
    const token = localStorage.getItem("authToken");
    if (!token) { setError("Not authenticated"); setLoading(false); return; }
    if (isRefresh) setRefreshing(true); else setLoading(true);
    try {
      const r = await fetch(`${API_BASE}/api/social/instagram/insights`, { headers: { Authorization: `Bearer ${token}` } });
      const d = await r.json();
      if (d.success) { setData(d); setError(""); }
      else setError(d.error || "Failed to load Instagram insights");
    } catch (e) { setError("Network error. Check your connection."); }
    finally { setLoading(false); setRefreshing(false); }
  };

  useEffect(() => { load(); }, []);

  const FV = { initial: { opacity: 0, y: 20 }, animate: { opacity: 1, y: 0 } };

  const kpis = data ? [
    { icon: <Heart size={15} />, bg: "rgba(225,48,108,.12)", col: "#E1306C", val: fmt(data.totals.totalLikes), lbl: "Total Likes" },
    { icon: <MessageCircle size={15} />, bg: "rgba(131,58,180,.12)", col: "#833AB4", val: fmt(data.totals.totalComments), lbl: "Comments" },
    { icon: <Eye size={15} />, bg: "rgba(252,175,69,.12)", col: "#FCAF45", val: fmt(data.totals.totalReach), lbl: "Reach" },
    { icon: <Play size={15} />, bg: "rgba(56,189,248,.12)", col: "#38bdf8", val: fmt(data.totals.totalVideoViews), lbl: "Video Views" },
    { icon: <Bookmark size={15} />, bg: "rgba(167,139,250,.12)", col: "#a78bfa", val: fmt(data.totals.totalSaved), lbl: "Saves" },
    { icon: <TrendingUp size={15} />, bg: "rgba(34,197,94,.12)", col: "#22c55e", val: `${data.engagementRate}%`, lbl: "Eng. Rate" },
  ] : [];

  const postBarData = data?.posts.slice(0, 8).map((p, i) => ({
    name: `Post ${i + 1}`, Likes: p.likes, Comments: p.comments, Saves: p.saved, Reach: p.reach,
  })) || [];

  const reachSeries = data?.accountInsights?.reach_series || [];

  return (
    <div className="igp-shell">
      <style dangerouslySetInnerHTML={{ __html: S }} />
      <DashboardSidebar userName={userName} userInitial={userInitial} />
      <div className="igp-main">
        <DashboardTopBar userName={userName} userInitial={userInitial} />
        <div className="igp-scroll">
          <div className="igp-orb igp-orb1" /><div className="igp-orb igp-orb2" />
          <div className="igp-inner">

            {/* Hero */}
            <motion.div {...FV} transition={{ duration: 0.4 }} className="igp-hero">
              <div className="igp-hero-line" />
              <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
                <div style={{ width: 48, height: 48, borderRadius: 14, background: "linear-gradient(135deg,#E1306C,#833AB4,#FCAF45)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                  <Instagram size={24} color="#fff" />
                </div>
                <div>
                  <div style={{ fontSize: 24, fontWeight: 900, color: "#f1f5f9" }}>Instagram <span style={{ background: "linear-gradient(135deg,#E1306C,#FCAF45)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>Insights</span></div>
                  <div style={{ color: "#64748b", fontSize: 13 }}>Post & account analytics from Instagram Graph API</div>
                </div>
              </div>
              <div style={{ display: "flex", gap: 10 }}>
                <button className="igp-btn" onClick={() => load(true)} disabled={refreshing}>
                  <motion.span animate={refreshing ? { rotate: 360 } : {}} transition={{ duration: 1, repeat: Infinity, ease: "linear" }} style={{ display: "flex" }}><RefreshCw size={13} /></motion.span>
                  {refreshing ? "Refreshing…" : "Refresh"}
                </button>
                <button className="igp-btn" onClick={() => navigate("/dashboard")}>
                  <ArrowLeft size={13} /> Dashboard
                </button>
              </div>
            </motion.div>

            {loading && (
              <div style={{ display: "flex", justifyContent: "center", padding: "80px 0" }}>
                <div style={{ width: 44, height: 44, border: "4px solid rgba(225,48,108,0.2)", borderTopColor: "#E1306C", borderRadius: "50%", animation: "igp-spin 0.8s linear infinite" }} />
                <style>{`@keyframes igp-spin{to{transform:rotate(360deg)}}`}</style>
              </div>
            )}

            {!loading && error && (
              <div className="igp-notice">
                <AlertCircle size={40} style={{ margin: "0 auto 16px", color: "#E1306C", opacity: 0.6 }} />
                <div style={{ fontSize: 18, fontWeight: 800, color: "#f1f5f9", marginBottom: 8 }}>
                  {error.includes("NOT_CONNECTED") ? "Instagram Not Connected" : "Could Not Load Insights"}
                </div>
                <div style={{ color: "#64748b", fontSize: 14, marginBottom: 24, maxWidth: 480, margin: "0 auto 24px" }}>{error}</div>
                {error.includes("NOT_CONNECTED") && (
                  <button className="igp-btn" style={{ margin: "0 auto" }} onClick={() => navigate("/social")}>
                    Connect Instagram →
                  </button>
                )}
              </div>
            )}

            {!loading && data && (
              <>
                {/* Profile Card */}
                <motion.div {...FV} transition={{ delay: 0.1 }} className="igp-profile">
                  {data.account.profilePictureUrl
                    ? <img src={data.account.profilePictureUrl} alt="profile" className="igp-profile-pic" />
                    : <div className="igp-profile-pic"><Instagram size={24} color="#E1306C" /></div>
                  }
                  <div style={{ flex: 1 }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 4, flexWrap: "wrap" }}>
                      <div style={{ fontSize: 18, fontWeight: 800, color: "#f1f5f9" }}>{data.account.name || data.account.username}</div>
                      <span className="igp-badge"><Instagram size={10} /> @{data.account.username}</span>
                    </div>
                    <div style={{ color: "#64748b", fontSize: 13, marginBottom: 10 }}>{data.account.biography || "No bio"}</div>
                    <div style={{ display: "flex", gap: 24 }}>
                      {[{ val: fmt(data.account.followersCount), lbl: "Followers" }, { val: fmt(data.account.followsCount), lbl: "Following" }, { val: fmt(data.account.mediaCount), lbl: "Posts" }].map(s => (
                        <div key={s.lbl}>
                          <div style={{ fontSize: 17, fontWeight: 800, color: "#f1f5f9" }}>{s.val}</div>
                          <div style={{ fontSize: 11, color: "#64748b", fontWeight: 700, textTransform: "uppercase" }}>{s.lbl}</div>
                        </div>
                      ))}
                    </div>
                  </div>
                </motion.div>

                {/* KPIs */}
                <motion.div {...FV} transition={{ delay: 0.15 }} className="igp-kpis">
                  {kpis.map((k, i) => (
                    <motion.div key={i} initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 + i * 0.05 }} className="igp-kpi">
                      <div className="igp-kpi-ic" style={{ background: k.bg, color: k.col }}>{k.icon}</div>
                      <div className="igp-kpi-val" style={{ color: k.col }}>{k.val}</div>
                      <div className="igp-kpi-lbl">{k.lbl}</div>
                    </motion.div>
                  ))}
                </motion.div>

                {/* Charts */}
                <div className="igp-grid">
                  {/* Per-post engagement bar chart */}
                  <motion.div {...FV} transition={{ delay: 0.25 }} className="igp-card" style={{ marginBottom: 0 }}>
                    <div className="igp-card-title"><Heart size={14} color="#E1306C" /> Per-Post Engagement</div>
                    <div style={{ height: 220 }}>
                      <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={postBarData} margin={{ top: 5, right: 5, left: -25, bottom: 0 }}>
                          <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" vertical={false} />
                          <XAxis dataKey="name" stroke="#334155" fontSize={10} tickLine={false} axisLine={false} />
                          <YAxis stroke="#334155" fontSize={10} tickLine={false} axisLine={false} tickFormatter={fmt} />
                          <Tooltip contentStyle={{ background: "#0f172a", border: "1px solid rgba(255,255,255,0.08)", borderRadius: 10, fontSize: 12, color: "#e2e8f0" }} />
                          <Bar dataKey="Likes" fill="#E1306C" radius={[4, 4, 0, 0]} />
                          <Bar dataKey="Comments" fill="#833AB4" radius={[4, 4, 0, 0]} />
                          <Bar dataKey="Saves" fill="#a78bfa" radius={[4, 4, 0, 0]} />
                        </BarChart>
                      </ResponsiveContainer>
                    </div>
                  </motion.div>

                  {/* Reach over time */}
                  <motion.div {...FV} transition={{ delay: 0.3 }} className="igp-card" style={{ marginBottom: 0 }}>
                    <div className="igp-card-title"><Eye size={14} color="#FCAF45" /> Reach (Last 28 Days)</div>
                    <div style={{ height: 220 }}>
                      <ResponsiveContainer width="100%" height="100%">
                        <AreaChart data={reachSeries.length ? reachSeries : [{ date: "No data", value: 0 }]} margin={{ top: 5, right: 5, left: -25, bottom: 0 }}>
                          <defs>
                            <linearGradient id="igReach" x1="0" y1="0" x2="0" y2="1">
                              <stop offset="5%" stopColor="#FCAF45" stopOpacity={0.3} />
                              <stop offset="95%" stopColor="#FCAF45" stopOpacity={0} />
                            </linearGradient>
                          </defs>
                          <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" vertical={false} />
                          <XAxis dataKey="date" stroke="#334155" fontSize={10} tickLine={false} axisLine={false} />
                          <YAxis stroke="#334155" fontSize={10} tickLine={false} axisLine={false} tickFormatter={fmt} />
                          <Tooltip contentStyle={{ background: "#0f172a", border: "1px solid rgba(255,255,255,0.08)", borderRadius: 10, fontSize: 12, color: "#e2e8f0" }} />
                          <Area type="monotone" dataKey="value" stroke="#FCAF45" strokeWidth={2} fill="url(#igReach)" />
                        </AreaChart>
                      </ResponsiveContainer>
                    </div>
                  </motion.div>
                </div>

                {/* Posts Grid */}
                <motion.div {...FV} transition={{ delay: 0.38 }} className="igp-card">
                  <div className="igp-card-title"><Instagram size={14} color="#E1306C" /> Recent Posts — Detailed Insights</div>
                  {data.posts.length === 0 ? (
                    <div style={{ textAlign: "center", padding: "40px 0", color: "#64748b" }}>No posts found on this account.</div>
                  ) : (
                    <div className="igp-posts">
                      {data.posts.map((post, i) => (
                        <motion.div key={post.id} initial={{ opacity: 0, scale: 0.96 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.04 * i }} className="igp-post" onClick={() => post.permalink && window.open(post.permalink, "_blank")}>
                          <div className="igp-post-thumb">
                            {post.mediaUrl
                              ? <img src={post.mediaUrl} alt={`Post ${i + 1}`} onError={e => { (e.target as HTMLImageElement).style.display = "none"; }} />
                              : <Instagram size={32} color="#E1306C" style={{ opacity: 0.3 }} />
                            }
                            {(post.mediaType === "VIDEO" || post.mediaType === "REELS") && (
                              <div style={{ position: "absolute", top: 8, right: 8, background: "rgba(0,0,0,0.6)", borderRadius: 6, padding: "2px 6px", fontSize: 10, color: "#fff", fontWeight: 700 }}>
                                {post.mediaType === "REELS" ? "REEL" : "VIDEO"}
                              </div>
                            )}
                            <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to top, rgba(0,0,0,0.7) 0%, transparent 50%)" }} />
                            <div style={{ position: "absolute", bottom: 8, left: 8, right: 8, display: "flex", gap: 10 }}>
                              <span className="igp-post-stat"><Heart size={11} color="#E1306C" /> {fmt(post.likes)}</span>
                              <span className="igp-post-stat"><MessageCircle size={11} color="#833AB4" /> {fmt(post.comments)}</span>
                              {post.videoViews > 0 && <span className="igp-post-stat"><Play size={11} color="#38bdf8" /> {fmt(post.videoViews)}</span>}
                            </div>
                          </div>
                          <div className="igp-post-body">
                            {post.caption && <div style={{ fontSize: 11, color: "#94a3b8", marginBottom: 8, lineHeight: 1.4 }}>{post.caption}</div>}
                            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 6 }}>
                              {[
                                { icon: <Eye size={10} />, val: fmt(post.reach), col: "#FCAF45", lbl: "Reach" },
                                { icon: <Bookmark size={10} />, val: fmt(post.saved), col: "#a78bfa", lbl: "Saves" },
                                { icon: <Eye size={10} />, val: fmt(post.impressions), col: "#38bdf8", lbl: "Impr." },
                              ].map(s => (
                                <div key={s.lbl} style={{ textAlign: "center", padding: "6px 4px", background: "rgba(255,255,255,0.03)", borderRadius: 8 }}>
                                  <div style={{ color: s.col, display: "flex", justifyContent: "center", marginBottom: 2 }}>{s.icon}</div>
                                  <div style={{ fontSize: 12, fontWeight: 800, color: "#e2e8f0" }}>{s.val}</div>
                                  <div style={{ fontSize: 9, color: "#475569", fontWeight: 700, textTransform: "uppercase" }}>{s.lbl}</div>
                                </div>
                              ))}
                            </div>
                            <div style={{ marginTop: 8, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                              <div style={{ fontSize: 10, color: "#475569" }}>{new Date(post.timestamp).toLocaleDateString("en-US", { month: "short", day: "numeric" })}</div>
                              {post.permalink && <ExternalLink size={11} color="#64748b" />}
                            </div>
                          </div>
                        </motion.div>
                      ))}
                    </div>
                  )}
                </motion.div>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
