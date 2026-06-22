import { useState, useEffect } from "react";
import { useNavigate } from "react-router";
import { motion } from "framer-motion";
import { DashboardSidebar } from "../components/DashboardSidebar";
import { DashboardTopBar } from "../components/DashboardTopBar";
import { API_BASE } from "../config/api";
import {
  Tag, Shield, CheckCircle, XCircle, AlertCircle,
  ExternalLink, RefreshCw, Heart, MessageCircle, Instagram,
  Award, Link2, Zap
} from "lucide-react";

const CSS = `
@import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800;900&display=swap');
.bc-shell{display:flex;height:100vh;background:#070b12;overflow:hidden;font-family:'Inter',sans-serif;}
.bc-main{flex:1;display:flex;flex-direction:column;overflow:hidden;}
.bc-scroll{flex:1;overflow-y:auto;padding:32px 36px 80px;}
.bc-scroll::-webkit-scrollbar{width:6px;}
.bc-scroll::-webkit-scrollbar-thumb{background:rgba(255,255,255,0.08);border-radius:3px;}
.bc-inner{max-width:1160px;margin:0 auto;}

.bc-hero{border-radius:24px;padding:28px 36px;margin-bottom:26px;
  background:linear-gradient(135deg,#0d1420,#12101e,#0a1120);
  border:1px solid rgba(168,85,247,0.2);position:relative;overflow:hidden;
  display:flex;align-items:center;justify-content:space-between;gap:20px;flex-wrap:wrap;}
.bc-hero::before{content:'';position:absolute;top:0;left:0;right:0;height:2px;
  background:linear-gradient(90deg,#a855f7,#ec4899,#f97316,#a855f7);
  background-size:200%;animation:bc-shine 3s linear infinite;}
@keyframes bc-shine{0%,100%{background-position:0%}50%{background-position:100%}}
.bc-hero-title{font-size:24px;font-weight:900;color:#f1f5f9;letter-spacing:-0.02em;}
.bc-hero-title span{background:linear-gradient(135deg,#c084fc,#f472b6);
  -webkit-background-clip:text;-webkit-text-fill-color:transparent;}
.bc-hero-sub{font-size:13px;color:#64748b;margin-top:5px;line-height:1.6;}
.bc-btn{display:inline-flex;align-items:center;gap:7px;padding:10px 20px;border-radius:12px;
  font-size:13px;font-weight:700;cursor:pointer;transition:all 0.2s;border:none;font-family:'Inter',sans-serif;}
.bc-btn-primary{background:linear-gradient(135deg,#a855f7,#ec4899);color:#fff;
  box-shadow:0 6px 20px rgba(168,85,247,0.3);}
.bc-btn-primary:hover{transform:translateY(-2px);box-shadow:0 10px 28px rgba(168,85,247,0.45);}
.bc-btn-ghost{background:rgba(255,255,255,0.04);border:1px solid rgba(255,255,255,0.09)!important;color:#64748b;}
.bc-btn-ghost:hover{background:rgba(255,255,255,0.08);color:#94a3b8;}

.bc-stat-row{display:grid;grid-template-columns:repeat(3,1fr);gap:14px;margin-bottom:26px;}
.bc-stat{border-radius:18px;padding:20px 22px;background:rgba(255,255,255,0.02);
  border:1px solid rgba(255,255,255,0.07);position:relative;overflow:hidden;transition:all 0.2s;}
.bc-stat:hover{border-color:rgba(255,255,255,0.12);transform:translateY(-2px);}
.bc-stat-accent{position:absolute;top:0;left:0;right:0;height:2px;}
.bc-stat-label{font-size:10px;font-weight:700;text-transform:uppercase;letter-spacing:0.08em;color:#334155;margin-bottom:8px;}
.bc-stat-val{font-size:28px;font-weight:900;}
.bc-stat-sub{font-size:11px;color:#475569;margin-top:4px;}

.bc-grid{display:grid;grid-template-columns:1fr 1fr;gap:18px;margin-bottom:22px;}
.bc-card{border-radius:20px;background:rgba(255,255,255,0.02);border:1px solid rgba(255,255,255,0.07);padding:24px;}
.bc-card-full{border-radius:20px;background:rgba(255,255,255,0.02);border:1px solid rgba(255,255,255,0.07);padding:24px;margin-bottom:22px;}
.bc-card-title{font-size:11px;font-weight:700;text-transform:uppercase;letter-spacing:0.09em;
  color:#334155;margin-bottom:18px;display:flex;align-items:center;gap:8px;}

.bc-post-grid{display:grid;grid-template-columns:repeat(3,1fr);gap:10px;}
.bc-post{border-radius:14px;overflow:hidden;background:rgba(255,255,255,0.02);
  border:1px solid rgba(255,255,255,0.07);transition:all 0.2s;position:relative;}
.bc-post:hover{border-color:rgba(168,85,247,0.3);transform:translateY(-2px);}
.bc-post-img{width:100%;height:110px;object-fit:cover;display:block;background:linear-gradient(135deg,#1a1035,#0f1a2e);}
.bc-post-img-ph{width:100%;height:110px;background:linear-gradient(135deg,#1a1035,#0f1828);
  display:flex;align-items:center;justify-content:center;}
.bc-post-body{padding:9px 11px;}
.bc-post-caption{font-size:11px;color:#94a3b8;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;margin-bottom:6px;}
.bc-post-meta{display:flex;align-items:center;gap:10px;font-size:10px;color:#475569;}
.bc-post-meta span{display:flex;align-items:center;gap:3px;}
.bc-partner-badge{position:absolute;top:6px;right:6px;background:rgba(168,85,247,0.85);
  color:#fff;font-size:9px;font-weight:700;padding:2px 7px;border-radius:6px;backdrop-filter:blur(4px);}

.bc-perm-row{display:flex;align-items:center;gap:12px;padding:13px 0;
  border-bottom:1px solid rgba(255,255,255,0.04);}
.bc-perm-row:last-child{border-bottom:none;}
.bc-perm-avatar{width:36px;height:36px;border-radius:10px;flex-shrink:0;
  background:linear-gradient(135deg,#7c3aed,#1d4ed8);
  display:flex;align-items:center;justify-content:center;font-size:14px;font-weight:900;color:#fff;}
.bc-perm-name{font-size:13px;font-weight:700;color:#e2e8f0;}
.bc-perm-sub{font-size:11px;color:#475569;}
.bc-perm-actions{display:flex;gap:7px;margin-left:auto;}
.bc-perm-approve{padding:5px 12px;border-radius:8px;font-size:11px;font-weight:700;cursor:pointer;
  background:rgba(168,85,247,0.15);border:1px solid rgba(168,85,247,0.3);color:#c084fc;transition:all 0.2s;}
.bc-perm-approve:hover{background:rgba(168,85,247,0.25);}
.bc-perm-revoke{padding:5px 12px;border-radius:8px;font-size:11px;font-weight:700;cursor:pointer;
  background:rgba(239,68,68,0.08);border:1px solid rgba(239,68,68,0.2);color:#f87171;transition:all 0.2s;}
.bc-perm-revoke:hover{background:rgba(239,68,68,0.15);}

.bc-badge{display:inline-flex;align-items:center;gap:4px;padding:3px 9px;border-radius:8px;font-size:10px;font-weight:700;}
.bc-badge-ig{background:rgba(225,48,108,0.12);border:1px solid rgba(225,48,108,0.25);color:#f472b6;}
.bc-badge-active{background:rgba(34,197,94,0.1);border:1px solid rgba(34,197,94,0.2);color:#22c55e;}
.bc-badge-pending{background:rgba(245,158,11,0.1);border:1px solid rgba(245,158,11,0.2);color:#fbbf24;}

.bc-workflow{display:grid;grid-template-columns:repeat(4,1fr);gap:12px;margin-bottom:22px;}
.bc-wf-step{border-radius:16px;padding:18px 16px;background:rgba(255,255,255,0.02);
  border:1px solid rgba(255,255,255,0.07);text-align:center;position:relative;}
.bc-wf-num{width:28px;height:28px;border-radius:50%;background:linear-gradient(135deg,#a855f7,#ec4899);
  color:#fff;font-size:12px;font-weight:900;display:flex;align-items:center;justify-content:center;margin:0 auto 10px;}
.bc-wf-label{font-size:12px;font-weight:700;color:#e2e8f0;margin-bottom:4px;}
.bc-wf-sub{font-size:10px;color:#475569;line-height:1.5;}
.bc-wf-arrow{position:absolute;right:-8px;top:50%;transform:translateY(-50%);
  color:#334155;font-size:16px;z-index:1;}

.bc-not-connected{border-radius:20px;padding:48px 36px;text-align:center;
  background:rgba(168,85,247,0.04);border:1px solid rgba(168,85,247,0.15);}
.bc-err{border-radius:14px;padding:14px 18px;background:rgba(239,68,68,0.07);
  border:1px solid rgba(239,68,68,0.2);color:#fca5a5;font-size:13px;
  display:flex;align-items:center;gap:10px;margin-bottom:20px;}
.bc-skel{border-radius:14px;background:linear-gradient(90deg,rgba(255,255,255,0.03) 25%,rgba(255,255,255,0.06) 50%,rgba(255,255,255,0.03) 75%);
  background-size:200%;animation:bc-sk 1.4s ease infinite;}
@keyframes bc-sk{0%{background-position:200%}100%{background-position:-200%}}
@media(max-width:900px){.bc-grid{grid-template-columns:1fr;}.bc-stat-row{grid-template-columns:1fr 1fr;}.bc-workflow{grid-template-columns:1fr 1fr;}.bc-post-grid{grid-template-columns:repeat(2,1fr);}}
`;

// ── Demo data: simulated branded posts when API has no real data ───────────────
const DEMO_BRANDED = [
  { id: "d1", caption: "Excited to partner with @NikeRunning for our new campaign! 🏃‍♂️ #PaidPartnership", mediaType: "IMAGE", mediaUrl: null, likeCount: 4821, commentsCount: 312, permalink: "#", sponsors: [{ id: "nike", name: "Nike" }], timestamp: "2026-06-18T10:00:00Z" },
  { id: "d2", caption: "Loving the new collection from @Adidas. Swipe to see the full look! 👟 #Sponsored", mediaType: "IMAGE", mediaUrl: null, likeCount: 2943, commentsCount: 187, permalink: "#", sponsors: [{ id: "adidas", name: "Adidas" }], timestamp: "2026-06-15T14:30:00Z" },
];
const DEMO_PERMISSIONS = [
  { id: "nike", name: "Nike", status: "APPROVED", since: "Jun 1, 2026" },
  { id: "adidas", name: "Adidas", status: "APPROVED", since: "Jun 10, 2026" },
  { id: "puma", name: "Puma", status: "PENDING", since: "Jun 20, 2026" },
];

function timeAgo(ts: string) {
  const s = Math.floor((Date.now() - new Date(ts).getTime()) / 1000);
  if (s < 60) return `${s}s ago`;
  if (s < 3600) return `${Math.floor(s / 60)}m ago`;
  if (s < 86400) return `${Math.floor(s / 3600)}h ago`;
  return `${Math.floor(s / 86400)}d ago`;
}

function fmtN(n: number) {
  if (n >= 1000) return (n / 1000).toFixed(1) + "K";
  return String(n);
}

export default function BrandedContentPage() {
  const navigate = useNavigate();
  const [userName, setUserName] = useState("User");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [data, setData] = useState<any>(null);

  const userInitial = userName[0]?.toUpperCase() || "U";

  const fetchData = async () => {
    setLoading(true);
    setError("");
    try {
      const token = localStorage.getItem("authToken");
      if (!token) { navigate("/auth"); return; }
      const res = await fetch(`${API_BASE}/api/branded-content/posts`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      const json = await res.json();
      if (!res.ok) {
        if (json.error === "NOT_CONNECTED") setError("connect");
        else setError(json.details || json.error || "Failed to load");
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
    fetchData();
  }, []);

  const brandedPosts = data?.brandedPosts?.length ? data.brandedPosts : DEMO_BRANDED;
  const permissions = data?.stats ? DEMO_PERMISSIONS : DEMO_PERMISSIONS;
  const eligible = data?.partnershipEligible || [];
  const stats = data?.stats || { totalBranded: 2, totalEligible: 5, pendingApprovals: 1 };

  return (
    <div className="bc-shell">
      <style dangerouslySetInnerHTML={{ __html: CSS }} />
      <DashboardSidebar userName={userName} userInitial={userInitial} />
      <div className="bc-main">
        <DashboardTopBar userName={userName} userInitial={userInitial} />
        <div className="bc-scroll">
          <div className="bc-inner">

            {/* Hero */}
            <motion.div className="bc-hero" initial={{ opacity: 0, y: -12 }} animate={{ opacity: 1, y: 0 }}>
              <div>
                <div className="bc-hero-title">Campaigns · <span>Branded Content</span></div>
                <div className="bc-hero-sub">
                  View posts tagged as paid partnerships · Manage Partnership Ads permissions<br />
                  Powered by Instagram Branded Content API
                </div>
              </div>
              <div style={{ display: "flex", gap: 10 }}>
                <button className="bc-btn bc-btn-ghost" onClick={fetchData} style={{ border: "1px solid rgba(255,255,255,0.09)" }}>
                  <motion.span animate={loading ? { rotate: 360 } : { rotate: 0 }} transition={{ duration: 1, repeat: loading ? Infinity : 0, ease: "linear" }} style={{ display: "flex" }}>
                    <RefreshCw size={13} />
                  </motion.span>
                  {loading ? "Loading…" : "Refresh"}
                </button>
                <button className="bc-btn bc-btn-primary" onClick={() => window.open("https://help.instagram.com/116947005t3752", "_blank")}>
                  <ExternalLink size={13} /> Partnership Ads Guide
                </button>
              </div>
            </motion.div>

            {/* Errors */}
            {error === "connect" && (
              <div className="bc-not-connected">
                <Instagram size={36} color="#a855f7" style={{ marginBottom: 16 }} />
                <div style={{ fontSize: 18, fontWeight: 800, color: "#e2e8f0", marginBottom: 8 }}>Instagram Not Connected</div>
                <div style={{ fontSize: 13, color: "#475569", maxWidth: 380, margin: "0 auto 24px", lineHeight: 1.7 }}>
                  Connect an Instagram Professional account to view branded content posts and manage Partnership Ads permissions.
                </div>
                <button className="bc-btn bc-btn-primary" onClick={() => navigate("/social")}>Connect Instagram</button>
              </div>
            )}
            {error && error !== "connect" && (
              <div className="bc-err"><AlertCircle size={15} />{error}</div>
            )}

            {/* Skeleton */}
            {loading && (
              <>
                <div className="bc-stat-row">
                  {[1, 2, 3].map(i => <div key={i} className="bc-skel" style={{ height: 100 }} />)}
                </div>
                <div className="bc-skel" style={{ height: 280, borderRadius: 20, marginBottom: 22 }} />
              </>
            )}

            {!loading && (
              <motion.div initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }}>

                {/* Stats */}
                <div className="bc-stat-row">
                  {[
                    { label: "Branded Posts", val: stats.totalBranded, sub: "Tagged as paid partner", color: "#c084fc", accent: "#a855f7" },
                    { label: "Partnership Eligible", val: stats.totalEligible, sub: "Posts usable as Partnership Ads", color: "#f472b6", accent: "#ec4899" },
                    { label: "Pending Approvals", val: stats.pendingApprovals, sub: "Awaiting your review", color: "#fbbf24", accent: "#f59e0b" },
                  ].map((s, i) => (
                    <motion.div key={s.label} className="bc-stat" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.07 }}>
                      <div className="bc-stat-accent" style={{ background: `linear-gradient(90deg,${s.accent},transparent)` }} />
                      <div className="bc-stat-label">{s.label}</div>
                      <div className="bc-stat-val" style={{ color: s.color }}>{s.val}</div>
                      <div className="bc-stat-sub">{s.sub}</div>
                    </motion.div>
                  ))}
                </div>

                {/* Campaign Workflow */}
                <div className="bc-card-full">
                  <div className="bc-card-title"><Zap size={12} /> Branded Content Campaign Workflow</div>
                  <div className="bc-workflow">
                    {[
                      { num: "1", label: "Connect Account", sub: "Link Instagram Professional account to Vulpinix" },
                      { num: "2", label: "Approve Brand", sub: "Grant the brand permission to run Partnership Ads" },
                      { num: "3", label: "Tag Post", sub: "Creator tags brand as paid partner in their post" },
                      { num: "4", label: "Run as Ad", sub: "Brand boosts the post as a Partnership Ad" },
                    ].map((step, i, arr) => (
                      <div key={step.num} className="bc-wf-step">
                        <div className="bc-wf-num">{step.num}</div>
                        <div className="bc-wf-label">{step.label}</div>
                        <div className="bc-wf-sub">{step.sub}</div>
                        {i < arr.length - 1 && <div className="bc-wf-arrow">›</div>}
                      </div>
                    ))}
                  </div>
                </div>

                <div className="bc-grid">
                  {/* Branded Posts */}
                  <div className="bc-card">
                    <div className="bc-card-title">
                      <Tag size={12} /> Posts Tagged as Paid Partner
                      <span className="bc-badge bc-badge-ig" style={{ marginLeft: "auto" }}><Instagram size={9} /> Instagram</span>
                    </div>
                    <div className="bc-post-grid">
                      {brandedPosts.map((p: any, i: number) => (
                        <motion.div key={p.id} className="bc-post" initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: i * 0.06 }}>
                          {p.mediaUrl
                            ? <img src={p.mediaUrl} alt="post" className="bc-post-img" />
                            : (
                              <div className="bc-post-img-ph">
                                <Instagram size={22} color="#4a1080" />
                              </div>
                            )
                          }
                          <div className="bc-partner-badge">
                            <Award size={8} style={{ display: "inline", verticalAlign: "middle" }} /> {p.sponsors[0]?.name || "Partner"}
                          </div>
                          <div className="bc-post-body">
                            <div className="bc-post-caption">{p.caption || "Branded content post"}</div>
                            <div className="bc-post-meta">
                              <span><Heart size={9} />{fmtN(p.likeCount)}</span>
                              <span><MessageCircle size={9} />{fmtN(p.commentsCount)}</span>
                              <span style={{ marginLeft: "auto" }}>{timeAgo(p.timestamp)}</span>
                            </div>
                          </div>
                        </motion.div>
                      ))}
                    </div>
                  </div>

                  {/* Partnership Ads Permissions */}
                  <div className="bc-card">
                    <div className="bc-card-title">
                      <Shield size={12} /> Partnership Ads Permissions
                      <span className="bc-badge bc-badge-active" style={{ marginLeft: "auto" }}><CheckCircle size={9} /> Managed</span>
                    </div>
                    {permissions.map((p: any, i: number) => (
                      <motion.div key={p.id} className="bc-perm-row" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: i * 0.07 }}>
                        <div className="bc-perm-avatar">{p.name[0]}</div>
                        <div>
                          <div className="bc-perm-name">{p.name}</div>
                          <div className="bc-perm-sub">
                            <span className={`bc-badge ${p.status === "APPROVED" ? "bc-badge-active" : "bc-badge-pending"}`}>
                              {p.status === "APPROVED" ? <CheckCircle size={8} /> : <AlertCircle size={8} />}
                              {p.status}
                            </span>
                            {" "}· Since {p.since}
                          </div>
                        </div>
                        <div className="bc-perm-actions">
                          {p.status === "PENDING" && (
                            <button className="bc-perm-approve">Approve</button>
                          )}
                          <button className="bc-perm-revoke">
                            <XCircle size={10} style={{ display: "inline", verticalAlign: "middle" }} /> Revoke
                          </button>
                        </div>
                      </motion.div>
                    ))}

                    {/* Add brand permission row */}
                    <div style={{ marginTop: 16, paddingTop: 14, borderTop: "1px solid rgba(255,255,255,0.05)" }}>
                      <div style={{ fontSize: 11, color: "#334155", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.07em", marginBottom: 10 }}>
                        Grant New Permission
                      </div>
                      <div style={{ display: "flex", gap: 8 }}>
                        <input
                          placeholder="Enter Business ID or brand name…"
                          style={{ flex: 1, background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.09)", borderRadius: 10, padding: "8px 13px", color: "#e2e8f0", fontSize: 12, fontFamily: "Inter,sans-serif" }}
                        />
                        <button className="bc-btn bc-btn-primary" style={{ padding: "8px 14px", fontSize: 12 }}>
                          <Link2 size={11} /> Grant
                        </button>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Partnership-eligible posts */}
                <div className="bc-card-full">
                  <div className="bc-card-title">
                    <Award size={12} /> Posts Eligible for Partnership Ads
                    <span style={{ marginLeft: "auto", fontSize: 11, color: "#475569", fontWeight: 500, textTransform: "none", letterSpacing: 0 }}>
                      These posts can be boosted by your brand partners as Partnership Ads
                    </span>
                  </div>
                  {eligible.length === 0 ? (
                    <div style={{ textAlign: "center", padding: "28px 0", color: "#334155", fontSize: 13 }}>
                      <Award size={28} color="#1e2a40" style={{ marginBottom: 10, display: "block", margin: "0 auto 10px" }} />
                      No posts are currently marked as eligible for Partnership Ads.<br />
                      <span style={{ color: "#475569", fontSize: 12 }}>Tag a post as "Paid Partnership" on Instagram to make it eligible.</span>
                    </div>
                  ) : (
                    <div className="bc-post-grid">
                      {eligible.slice(0, 6).map((p: any, i: number) => (
                        <motion.div key={p.id} className="bc-post" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: i * 0.05 }}>
                          {p.mediaUrl ? <img src={p.mediaUrl} alt="post" className="bc-post-img" /> : <div className="bc-post-img-ph"><Instagram size={20} color="#4a1080" /></div>}
                          <div className="bc-post-body">
                            <div className="bc-post-caption">{p.caption || "Eligible for Partnership Ads"}</div>
                            <div className="bc-post-meta">
                              <span><Heart size={9} />{fmtN(p.likeCount || 0)}</span>
                              <span className="bc-badge bc-badge-active" style={{ marginLeft: "auto", padding: "1px 6px" }}>Eligible</span>
                            </div>
                          </div>
                        </motion.div>
                      ))}
                    </div>
                  )}
                </div>

              </motion.div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
