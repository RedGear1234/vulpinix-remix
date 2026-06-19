import { API_BASE } from "../config/api";
import { useState, useRef } from "react";
import { useNavigate } from "react-router";
import { motion, AnimatePresence } from "framer-motion";
import {
  Hash, Search, Heart, MessageCircle, TrendingUp, Eye,
  Instagram, ExternalLink, RefreshCw, AlertCircle,
  BarChart3, Flame, Clock, ArrowLeft, Sparkles
} from "lucide-react";
import { DashboardSidebar } from "../components/DashboardSidebar";
import { DashboardTopBar } from "../components/DashboardTopBar";

const S = `
  @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800;900&display=swap');
  .vxht-shell{display:flex;height:100vh;background:#070b12;overflow:hidden;font-family:'Inter',sans-serif;}
  .vxht-main{flex:1;display:flex;flex-direction:column;overflow:hidden;}
  .vxht-scroll{flex:1;overflow-y:auto;overflow-x:hidden;padding:32px 36px 100px;}
  .vxht-scroll::-webkit-scrollbar{width:6px;}
  .vxht-scroll::-webkit-scrollbar-thumb{background:rgba(255,255,255,0.08);border-radius:3px;}
  .vxht-inner{max-width:1200px;margin:0 auto;position:relative;z-index:1;}

  /* Orbs */
  .vxht-orb{position:fixed;pointer-events:none;border-radius:50%;z-index:0;}
  .vxht-orb1{width:700px;height:700px;top:-200px;right:-150px;background:radial-gradient(circle,rgba(167,139,250,0.08) 0%,transparent 70%);}
  .vxht-orb2{width:500px;height:500px;bottom:-200px;left:-80px;background:radial-gradient(circle,rgba(6,214,199,0.06) 0%,transparent 70%);}

  /* Hero */
  .vxht-hero{border-radius:28px;padding:36px 44px;margin-bottom:28px;background:linear-gradient(135deg,#0c1020 0%,#101828 60%,#0a0e1a 100%);border:1px solid rgba(167,139,250,0.14);position:relative;overflow:hidden;}
  .vxht-hero-line{position:absolute;top:0;left:0;right:0;height:2px;background:linear-gradient(90deg,#a78bfa,#06d6c7,#a78bfa);background-size:200%;animation:vxht-shimmer 3s ease infinite;}
  @keyframes vxht-shimmer{0%,100%{background-position:0%}50%{background-position:100%}}
  .vxht-hero-title{font-size:28px;font-weight:900;letter-spacing:-0.025em;color:#f1f5f9;margin-bottom:6px;}
  .vxht-hero-title span{background:linear-gradient(135deg,#c4b5fd,#06d6c7);-webkit-background-clip:text;-webkit-text-fill-color:transparent;}
  .vxht-hero-sub{color:#64748b;font-size:14px;}

  /* Search bar */
  .vxht-search-wrap{margin-bottom:28px;}
  .vxht-search-bar{display:flex;gap:12px;align-items:center;background:rgba(255,255,255,0.03);border:1px solid rgba(167,139,250,0.2);border-radius:18px;padding:6px 6px 6px 20px;transition:border-color 0.2s;}
  .vxht-search-bar:focus-within{border-color:rgba(167,139,250,0.5);box-shadow:0 0 0 3px rgba(167,139,250,0.1);}
  .vxht-search-input{flex:1;background:transparent;border:none;outline:none;color:#f1f5f9;font-size:15px;font-weight:500;font-family:'Inter',sans-serif;}
  .vxht-search-input::placeholder{color:#334155;}
  .vxht-search-btn{display:flex;align-items:center;gap:8px;padding:11px 22px;border-radius:13px;background:linear-gradient(135deg,#a78bfa,#7c3aed);border:none;color:#fff;font-weight:700;font-size:14px;cursor:pointer;transition:all 0.2s;font-family:'Inter',sans-serif;flex-shrink:0;}
  .vxht-search-btn:hover{transform:translateY(-1px);box-shadow:0 6px 20px rgba(124,58,237,0.4);}
  .vxht-search-btn:disabled{opacity:0.5;cursor:not-allowed;transform:none;box-shadow:none;}

  /* Quick tags */
  .vxht-chips{display:flex;gap:8px;flex-wrap:wrap;margin-top:12px;}
  .vxht-chip{padding:5px 14px;border-radius:20px;background:rgba(255,255,255,0.04);border:1px solid rgba(255,255,255,0.07);color:#64748b;font-size:12px;font-weight:600;cursor:pointer;transition:all 0.18s;}
  .vxht-chip:hover{background:rgba(167,139,250,0.1);border-color:rgba(167,139,250,0.3);color:#c4b5fd;}

  /* Stats grid */
  .vxht-stats{display:grid;grid-template-columns:repeat(4,1fr);gap:14px;margin-bottom:24px;}
  .vxht-stat{border-radius:18px;padding:20px 18px;background:rgba(255,255,255,0.025);border:1px solid rgba(255,255,255,0.07);transition:all 0.2s;}
  .vxht-stat:hover{border-color:rgba(167,139,250,0.2);transform:translateY(-2px);}
  .vxht-stat-ic{width:36px;height:36px;border-radius:10px;display:flex;align-items:center;justify-content:center;margin-bottom:12px;}
  .vxht-stat-val{font-size:24px;font-weight:900;line-height:1;margin-bottom:4px;}
  .vxht-stat-lbl{font-size:10px;font-weight:700;color:#475569;text-transform:uppercase;letter-spacing:0.07em;}

  /* Section tabs */
  .vxht-tabs{display:flex;gap:8px;margin-bottom:20px;}
  .vxht-tab{display:flex;align-items:center;gap:6px;padding:8px 18px;border-radius:12px;background:rgba(255,255,255,0.03);border:1px solid rgba(255,255,255,0.07);color:#64748b;font-size:13px;font-weight:700;cursor:pointer;transition:all 0.18s;}
  .vxht-tab:hover{background:rgba(255,255,255,0.06);color:#94a3b8;}
  .vxht-tab.active{background:rgba(167,139,250,0.14);border-color:rgba(167,139,250,0.3);color:#c4b5fd;}

  /* Posts grid */
  .vxht-posts{display:grid;grid-template-columns:repeat(4,1fr);gap:14px;}
  .vxht-post{border-radius:16px;overflow:hidden;background:rgba(255,255,255,0.02);border:1px solid rgba(255,255,255,0.06);transition:all 0.2s;cursor:pointer;}
  .vxht-post:hover{border-color:rgba(167,139,250,0.3);transform:translateY(-3px);box-shadow:0 8px 24px rgba(0,0,0,0.3);}
  .vxht-post-thumb{width:100%;aspect-ratio:1;background:linear-gradient(135deg,#0f1628,#1a0a24);display:flex;align-items:center;justify-content:center;position:relative;overflow:hidden;}
  .vxht-post-thumb img{width:100%;height:100%;object-fit:cover;}
  .vxht-post-overlay{position:absolute;inset:0;background:linear-gradient(to top,rgba(0,0,0,0.7) 0%,transparent 50%);}
  .vxht-post-stats{position:absolute;bottom:8px;left:8px;right:8px;display:flex;gap:10px;}
  .vxht-post-stat{display:flex;align-items:center;gap:4px;font-size:12px;font-weight:700;color:#fff;text-shadow:0 1px 4px rgba(0,0,0,0.6);}
  .vxht-post-body{padding:10px 12px;}
  .vxht-post-caption{font-size:11px;color:#64748b;line-height:1.4;margin-bottom:8px;display:-webkit-box;-webkit-line-clamp:2;-webkit-box-orient:vertical;overflow:hidden;}
  .vxht-post-meta{display:flex;justify-content:space-between;align-items:center;}
  .vxht-post-date{font-size:10px;color:#334155;}
  .vxht-post-type{font-size:9px;font-weight:800;padding:2px 8px;border-radius:6px;text-transform:uppercase;letter-spacing:0.06em;}
  .type-top{background:rgba(251,146,60,0.15);color:#fb923c;border:1px solid rgba(251,146,60,0.25);}
  .type-recent{background:rgba(6,214,199,0.12);color:#06d6c7;border:1px solid rgba(6,214,199,0.2);}

  /* Empty / notice states */
  .vxht-notice{border-radius:20px;padding:52px 32px;background:rgba(167,139,250,0.04);border:1px dashed rgba(167,139,250,0.15);text-align:center;margin-bottom:20px;}
  .vxht-error{border-radius:20px;padding:40px 32px;background:rgba(239,68,68,0.04);border:1px dashed rgba(239,68,68,0.2);text-align:center;margin-bottom:20px;}

  /* Back btn */
  .vxht-btn{display:inline-flex;align-items:center;gap:7px;padding:9px 18px;border-radius:12px;background:rgba(255,255,255,0.04);border:1px solid rgba(255,255,255,0.09);color:#64748b;font-weight:700;font-size:13px;cursor:pointer;transition:all 0.2s;font-family:'Inter',sans-serif;}
  .vxht-btn:hover{background:rgba(255,255,255,0.08);color:#94a3b8;}

  @media(max-width:1100px){.vxht-stats{grid-template-columns:repeat(2,1fr);}.vxht-posts{grid-template-columns:repeat(3,1fr);}}
  @media(max-width:640px){.vxht-scroll{padding:20px 16px 80px;}.vxht-posts{grid-template-columns:repeat(2,1fr);}.vxht-stats{grid-template-columns:repeat(2,1fr);}}
`;

const QUICK_TAGS = ["travel", "fitness", "food", "fashion", "photography", "nature", "motivation", "beauty", "art", "tech"];

function fmt(n: number) {
  if (n >= 1_000_000) return (n / 1_000_000).toFixed(1) + "M";
  if (n >= 1_000) return (n / 1_000).toFixed(1) + "K";
  return String(n);
}

interface HashtagPost {
  id: string; caption: string; mediaType: string; mediaUrl: string | null;
  permalink: string | null; timestamp: string | null;
  likes: number; comments: number; postType: "top" | "recent";
}

interface HashtagData {
  hashtag: string; hashtagId: string;
  stats: { totalPosts: number; topPostsCount: number; recentPostsCount: number; totalLikes: number; totalComments: number; avgLikes: number; avgComments: number; };
  posts: HashtagPost[];
}

export default function HashtagTrackingPage() {
  const navigate = useNavigate();
  const [tag, setTag] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [data, setData] = useState<HashtagData | null>(null);
  const [activeTab, setActiveTab] = useState<"all" | "top" | "recent">("all");
  const inputRef = useRef<HTMLInputElement>(null);

  const userInfo = JSON.parse(localStorage.getItem("userInfo") || "{}");
  const userName = userInfo.name?.split(" ")[0] || "User";
  const userInitial = userName[0]?.toUpperCase() || "U";

  const search = async (searchTag?: string) => {
    const q = (searchTag ?? tag).replace(/^#/, "").trim();
    if (!q) return;
    const token = localStorage.getItem("authToken");
    if (!token) { setError("Not authenticated"); return; }
    setLoading(true);
    setError("");
    setData(null);
    try {
      const r = await fetch(`${API_BASE}/api/social/instagram/hashtag?tag=${encodeURIComponent(q)}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      const d = await r.json();
      if (d.success) {
        setData(d);
        setActiveTab("all");
      } else {
        setError(d.details || d.error || "Failed to load hashtag data");
      }
    } catch {
      setError("Network error. Please check your connection.");
    } finally {
      setLoading(false);
    }
  };

  const handleQuickTag = (t: string) => {
    setTag(t);
    search(t);
  };

  const filteredPosts = data?.posts.filter(p => {
    if (activeTab === "all") return true;
    return p.postType === activeTab;
  }) ?? [];

  const FV = { initial: { opacity: 0, y: 20 }, animate: { opacity: 1, y: 0 } };

  return (
    <div className="vxht-shell">
      <style dangerouslySetInnerHTML={{ __html: S }} />
      <DashboardSidebar userName={userName} userInitial={userInitial} />
      <div className="vxht-main">
        <DashboardTopBar userName={userName} userInitial={userInitial} />
        <div className="vxht-scroll">
          <div className="vxht-orb vxht-orb1" />
          <div className="vxht-orb vxht-orb2" />
          <div className="vxht-inner">

            {/* Hero */}
            <motion.div {...FV} transition={{ duration: 0.4 }} className="vxht-hero">
              <div className="vxht-hero-line" />
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: 16 }}>
                <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
                  <div style={{ width: 52, height: 52, borderRadius: 16, background: "linear-gradient(135deg,#a78bfa,#06d6c7)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                    <Hash size={26} color="#fff" />
                  </div>
                  <div>
                    <div className="vxht-hero-title">Hashtag <span>Tracking</span></div>
                    <div className="vxht-hero-sub">Search public posts and performance metrics for any hashtag</div>
                  </div>
                </div>
                <button className="vxht-btn" onClick={() => navigate("/dashboard/campaigns")}>
                  <ArrowLeft size={13} /> Analytics
                </button>
              </div>
            </motion.div>

            {/* Search */}
            <motion.div {...FV} transition={{ delay: 0.1 }} className="vxht-search-wrap">
              <div className="vxht-search-bar">
                <Hash size={16} color="#4a5568" style={{ flexShrink: 0 }} />
                <input
                  ref={inputRef}
                  className="vxht-search-input"
                  placeholder="Enter a hashtag (e.g. travel, fitness, fashion)"
                  value={tag}
                  onChange={e => setTag(e.target.value.replace(/^#/, ""))}
                  onKeyDown={e => e.key === "Enter" && search()}
                />
                <button className="vxht-search-btn" onClick={() => search()} disabled={loading || !tag.trim()}>
                  {loading
                    ? <><motion.span animate={{ rotate: 360 }} transition={{ duration: 1, repeat: Infinity, ease: "linear" }} style={{ display: "flex" }}><RefreshCw size={14} /></motion.span> Searching…</>
                    : <><Search size={14} /> Search</>
                  }
                </button>
              </div>
              <div className="vxht-chips">
                {QUICK_TAGS.map(t => (
                  <button key={t} className="vxht-chip" onClick={() => handleQuickTag(t)}>#{t}</button>
                ))}
              </div>
            </motion.div>

            {/* Empty state */}
            {!loading && !error && !data && (
              <motion.div {...FV} transition={{ delay: 0.2 }} className="vxht-notice">
                <Sparkles size={44} style={{ margin: "0 auto 16px", opacity: 0.2 }} />
                <div style={{ fontSize: 18, fontWeight: 800, color: "#e2e8f0", marginBottom: 8 }}>Search a Hashtag</div>
                <div style={{ color: "#475569", fontSize: 14 }}>
                  Enter any hashtag above or click a quick-tag to see top & recent public posts with engagement metrics.
                </div>
              </motion.div>
            )}

            {/* Error state */}
            {!loading && error && (
              <motion.div {...FV} className="vxht-error">
                <AlertCircle size={36} style={{ margin: "0 auto 14px", color: "#f87171", opacity: 0.8 }} />
                <div style={{ fontSize: 17, fontWeight: 800, color: "#f1f5f9", marginBottom: 8 }}>
                  {error.includes("NOT_CONNECTED") ? "Instagram Not Connected" : "Could Not Load Results"}
                </div>
                <div style={{ color: "#64748b", fontSize: 13, maxWidth: 480, margin: "0 auto 20px" }}>{error}</div>
                {error.includes("NOT_CONNECTED") && (
                  <button className="vxht-btn" style={{ margin: "0 auto" }} onClick={() => navigate("/social")}>
                    Connect Instagram →
                  </button>
                )}
              </motion.div>
            )}

            {/* Results */}
            <AnimatePresence>
              {data && !loading && (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>

                  {/* Hashtag header */}
                  <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 20 }}>
                    <div style={{ width: 44, height: 44, borderRadius: 12, background: "linear-gradient(135deg,rgba(167,139,250,0.2),rgba(6,214,199,0.2))", border: "1px solid rgba(167,139,250,0.3)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                      <Hash size={20} color="#a78bfa" />
                    </div>
                    <div>
                      <div style={{ fontSize: 22, fontWeight: 900, color: "#f1f5f9" }}>#{data.hashtag}</div>
                      <div style={{ fontSize: 12, color: "#475569" }}>ID: {data.hashtagId}</div>
                    </div>
                  </div>

                  {/* Stats */}
                  <motion.div {...FV} transition={{ delay: 0.05 }} className="vxht-stats">
                    {[
                      { icon: <BarChart3 size={17} />, bg: "rgba(167,139,250,.12)", col: "#a78bfa", val: fmt(data.stats.totalPosts), lbl: "Total Posts Found" },
                      { icon: <Flame size={17} />, bg: "rgba(251,146,60,.12)", col: "#fb923c", val: fmt(data.stats.topPostsCount), lbl: "Top Posts" },
                      { icon: <Heart size={17} />, bg: "rgba(225,48,108,.12)", col: "#E1306C", val: fmt(data.stats.avgLikes), lbl: "Avg Likes / Post" },
                      { icon: <MessageCircle size={17} />, bg: "rgba(131,58,180,.12)", col: "#833AB4", val: fmt(data.stats.avgComments), lbl: "Avg Comments / Post" },
                    ].map((s, i) => (
                      <motion.div key={i} initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.05 + i * 0.06 }} className="vxht-stat">
                        <div className="vxht-stat-ic" style={{ background: s.bg, color: s.col }}>{s.icon}</div>
                        <div className="vxht-stat-val" style={{ color: s.col }}>{s.val}</div>
                        <div className="vxht-stat-lbl">{s.lbl}</div>
                      </motion.div>
                    ))}
                  </motion.div>

                  {/* Tabs */}
                  <div className="vxht-tabs">
                    {([["all", "All Posts", <TrendingUp size={13} />], ["top", "Top Posts", <Flame size={13} />], ["recent", "Recent Posts", <Clock size={13} />]] as const).map(([id, label, icon]) => (
                      <button key={id} className={`vxht-tab ${activeTab === id ? "active" : ""}`} onClick={() => setActiveTab(id as any)}>
                        {icon} {label}
                        <span style={{ marginLeft: 4, fontSize: 11, opacity: 0.6 }}>
                          ({id === "all" ? data.stats.totalPosts : id === "top" ? data.stats.topPostsCount : data.stats.recentPostsCount})
                        </span>
                      </button>
                    ))}
                  </div>

                  {/* Posts grid */}
                  {filteredPosts.length === 0 ? (
                    <div className="vxht-notice">
                      <Eye size={40} style={{ margin: "0 auto 16px", opacity: 0.15 }} />
                      <div style={{ fontSize: 16, fontWeight: 700, color: "#e2e8f0" }}>No posts in this category</div>
                    </div>
                  ) : (
                    <div className="vxht-posts">
                      {filteredPosts.map((post, i) => (
                        <motion.div
                          key={post.id}
                          initial={{ opacity: 0, scale: 0.96 }}
                          animate={{ opacity: 1, scale: 1 }}
                          transition={{ delay: 0.03 * i }}
                          className="vxht-post"
                          onClick={() => post.permalink && window.open(post.permalink, "_blank")}
                        >
                          <div className="vxht-post-thumb">
                            {post.mediaUrl
                              ? <img src={post.mediaUrl} alt={`Post ${i + 1}`} onError={e => { (e.target as HTMLImageElement).style.display = "none"; }} />
                              : <Instagram size={32} color="#a78bfa" style={{ opacity: 0.3 }} />
                            }
                            <div className="vxht-post-overlay" />
                            <div className="vxht-post-stats">
                              <span className="vxht-post-stat"><Heart size={11} color="#E1306C" /> {fmt(post.likes)}</span>
                              <span className="vxht-post-stat"><MessageCircle size={11} color="#833AB4" /> {fmt(post.comments)}</span>
                            </div>
                          </div>
                          <div className="vxht-post-body">
                            {post.caption && <div className="vxht-post-caption">{post.caption}</div>}
                            <div className="vxht-post-meta">
                              <div className="vxht-post-date">
                                {post.timestamp ? new Date(post.timestamp).toLocaleDateString("en-US", { month: "short", day: "numeric" }) : "—"}
                              </div>
                              <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                                <span className={`vxht-post-type ${post.postType === "top" ? "type-top" : "type-recent"}`}>
                                  {post.postType === "top" ? "Top" : "Recent"}
                                </span>
                                {post.permalink && <ExternalLink size={10} color="#334155" />}
                              </div>
                            </div>
                          </div>
                        </motion.div>
                      ))}
                    </div>
                  )}

                  {/* Campaign analysis note */}
                  <motion.div {...FV} transition={{ delay: 0.3 }} style={{ marginTop: 24, padding: "16px 20px", borderRadius: 16, background: "rgba(6,214,199,0.05)", border: "1px solid rgba(6,214,199,0.15)" }}>
                    <div style={{ display: "flex", alignItems: "flex-start", gap: 12 }}>
                      <TrendingUp size={16} color="#06d6c7" style={{ marginTop: 2, flexShrink: 0 }} />
                      <div>
                        <div style={{ fontSize: 13, fontWeight: 800, color: "#06d6c7", marginBottom: 4 }}>Campaign Insights</div>
                        <div style={{ fontSize: 12, color: "#64748b", lineHeight: 1.6 }}>
                          #{data.hashtag} has <strong style={{ color: "#94a3b8" }}>{fmt(data.stats.avgLikes)} avg likes</strong> and <strong style={{ color: "#94a3b8" }}>{fmt(data.stats.avgComments)} avg comments</strong> per post.
                          {data.stats.avgLikes > 500
                            ? " This hashtag shows strong engagement — ideal for campaign targeting."
                            : " Consider pairing with higher-volume hashtags for better campaign reach."}
                        </div>
                      </div>
                    </div>
                  </motion.div>

                </motion.div>
              )}
            </AnimatePresence>

          </div>
        </div>
      </div>
    </div>
  );
}
