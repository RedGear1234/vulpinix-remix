import { API_BASE } from "../config/api";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router";
import { motion } from "framer-motion";
import {
  TrendingUp, ArrowLeft, RefreshCw, AlertCircle, Heart, Eye,
  MessageCircle, ExternalLink, MessageSquare,
  Facebook, Instagram, Share2
} from "lucide-react";
import { DashboardSidebar } from "../components/DashboardSidebar";
import { DashboardTopBar } from "../components/DashboardTopBar";
import { AreaChart, Area, ResponsiveContainer, CartesianGrid, XAxis, YAxis, Tooltip, BarChart, Bar } from "recharts";

const S = `
  @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800;900&display=swap');
  .igp-shell{display:flex;height:100vh;background:#070b12;overflow:hidden;font-family:'Inter',sans-serif;}
  .igp-main{flex:1;display:flex;flex-direction:column;overflow:hidden;}
  .igp-scroll{flex:1;overflow-y:auto;overflow-x:hidden;padding:32px 36px 100px;}
  .igp-scroll::-webkit-scrollbar{width:6px;}
  .igp-scroll::-webkit-scrollbar-thumb{background:rgba(255,255,255,0.08);border-radius:3px;}
  .igp-orb{position:fixed;pointer-events:none;border-radius:50%;z-index:0;}
  .igp-orb1{width:600px;height:600px;top:-150px;right:-100px;background:radial-gradient(circle,rgba(225,48,108,0.06) 0%,transparent 70%);}
  .igp-orb2{width:500px;height:500px;bottom:-150px;left:-50px;background:radial-gradient(circle,rgba(56,189,248,0.04) 0%,transparent 70%);}
  .igp-inner{max-width:1300px;margin:0 auto;position:relative;z-index:1;}

  /* Hero */
  .igp-hero{display:flex;justify-content:space-between;align-items:center;flex-wrap:wrap;gap:20px;padding:26px 30px;border-radius:24px;background:rgba(255,255,255,0.02);border:1px solid rgba(255,255,255,0.05);margin-bottom:28px;position:relative;overflow:hidden;}
  .igp-hero-line{position:absolute;top:0;left:0;right:0;height:2px;background:linear-gradient(90deg,#E1306C,#38bdf8,#833AB4);background-size:200%;}
  .igp-btn{display:inline-flex;align-items:center;gap:8px;padding:9px 18px;border-radius:12px;background:rgba(255,255,255,0.04);border:1px solid rgba(255,255,255,0.08);color:#e2e8f0;font-weight:700;font-size:13px;cursor:pointer;transition:all 0.2s;font-family:'Inter',sans-serif;}
  .igp-btn:hover:not(:disabled){background:rgba(255,255,255,0.08);color:#f8fafc;transform:translateY(-1px);}

  /* Platform Selector Segmented Control */
  .igp-tabs{display:flex;gap:6px;background:rgba(0,0,0,0.2);padding:6px;border-radius:16px;border:1px solid rgba(255,255,255,0.05);margin-bottom:28px;width:fit-content;}
  .igp-tab{display:inline-flex;align-items:center;gap:8px;padding:10px 20px;border-radius:12px;border:none;background:transparent;color:#94a3b8;font-size:14px;font-weight:700;cursor:pointer;transition:all 0.25s;}
  .igp-tab:hover{color:#f1f5f9;background:rgba(255,255,255,0.03);}
  .igp-tab.active-facebook{background:#1877F2;color:#fff;box-shadow:0 4px 15px rgba(24,119,242,0.3);}
  .igp-tab.active-instagram{background:linear-gradient(135deg,#E1306C,#833AB4);color:#fff;box-shadow:0 4px 15px rgba(225,48,108,0.3);}

  /* Profile header card */
  .igp-profile{display:flex;align-items:center;gap:24px;padding:24px 28px;border-radius:22px;background:rgba(255,255,255,0.015);border:1px solid rgba(255,255,255,0.05);margin-bottom:28px;}
  .igp-profile-pic{width:68px;height:68px;border-radius:20px;object-fit:cover;border:2px solid rgba(255,255,255,0.1);display:flex;align-items:center;justify-content:center;background:rgba(255,255,255,0.03);}
  .igp-badge{display:inline-flex;align-items:center;gap:5px;padding:4px 10px;border-radius:20px;font-size:11px;font-weight:700;background:rgba(255,255,255,0.04);border:1px solid rgba(255,255,255,0.08);color:#94a3b8;}

  /* KPIs */
  .igp-kpis{display:grid;grid-template-columns:repeat(4,1fr);gap:18px;margin-bottom:28px;}
  .igp-kpi{padding:20px 22px;border-radius:20px;background:rgba(255,255,255,0.025);border:1px solid rgba(255,255,255,0.07);position:relative;overflow:hidden;}
  .igp-kpi-ic{width:36px;height:36px;border-radius:10px;display:flex;align-items:center;justify-content:center;margin-bottom:12px;}
  .igp-kpi-val{font-size:26px;font-weight:900;line-height:1;margin-bottom:4px;}
  .igp-kpi-lbl{font-size:11px;font-weight:700;color:#64748b;text-transform:uppercase;letter-spacing:0.05em;}

  /* Bento grid */
  .igp-grid{display:grid;grid-template-columns:1fr 1fr;gap:22px;margin-bottom:28px;}
  .igp-card{padding:26px;border-radius:22px;background:rgba(255,255,255,0.025);border:1px solid rgba(255,255,255,0.07);margin-bottom:28px;}
  .igp-card-title{font-size:15px;font-weight:800;color:#f1f5f9;margin-bottom:20px;display:flex;align-items:center;gap:8px;}

  /* Connect social account notice banner */
  .igp-notice{text-align:center;padding:60px 40px;border-radius:22px;background:rgba(255,255,255,0.02);border:1px dashed rgba(255,255,255,0.12);max-width:600px;margin:40px auto;}

  /* Posts Grid */
  .igp-posts{display:grid;grid-template-columns:repeat(3,1fr);gap:18px;}
  .igp-post{border-radius:18px;overflow:hidden;background:rgba(255,255,255,0.015);border:1px solid rgba(255,255,255,0.06);cursor:pointer;transition:all 0.25s;}
  .igp-post:hover{transform:translateY(-4px);border-color:rgba(255,255,255,0.12);box-shadow:0 12px 30px rgba(0,0,0,0.4);}
  .igp-post-thumb{aspect-ratio:16/10;position:relative;overflow:hidden;background:#0d121f;display:flex;align-items:center;justify-content:center;}
  .igp-post-thumb img{width:100%;height:100%;object-fit:cover;}
  .igp-post-stat{display:inline-flex;align-items:center;gap:4px;font-size:11px;font-weight:800;color:#fff;background:rgba(0,0,0,0.65);padding:3px 8px;border-radius:20px;backdrop-filter:blur(4px);}
  .igp-post-body{padding:16px;}

  /* Comments Drawer */
  .ig-comments-drawer{position:fixed;top:0;right:0;width:420px;height:100vh;background:rgba(13,17,23,0.96);backdrop-filter:blur(20px);border-left:1px solid rgba(255,255,255,0.08);z-index:100;box-shadow:-10px 0 35px rgba(0,0,0,0.6);display:flex;flex-direction:column;font-family:'Inter',sans-serif;}
  .ig-comments-header{padding:20px;border-bottom:1px solid rgba(255,255,255,0.08);display:flex;justify-content:space-between;align-items:center;}
  .ig-comments-list{flex:1;overflow-y:auto;padding:20px;display:flex;flex-direction:column;gap:14px;}
  .ig-comment-item{display:flex;flex-direction:column;gap:5px;padding:12px;background:rgba(255,255,255,0.02);border-radius:12px;border:1px solid rgba(255,255,255,0.04);}
  .ig-comment-meta{display:flex;justify-content:space-between;align-items:center;font-size:11px;color:#64748b;}
  .ig-comment-user{font-weight:700;color:#e2e8f0;}
  .ig-comment-text{font-size:13px;color:#94a3b8;line-height:1.4;}
  .ig-comment-reply{margin-left:16px;padding-left:12px;border-left:2px solid rgba(56,189,248,0.2);display:flex;flex-direction:column;gap:4px;margin-top:8px;}
  .ig-comments-input-area{padding:16px 20px;border-top:1px solid rgba(255,255,255,0.08);background:rgba(15,22,36,0.5);display:flex;flex-direction:column;gap:10px;}
  .ig-comments-input-row{display:flex;gap:10px;}
  .ig-comments-input{flex:1;background:rgba(0,0,0,0.25);border:1px solid rgba(255,255,255,0.1);border-radius:10px;padding:8px 12px;color:#f1f5f9;font-size:13px;font-family:inherit;}
  .ig-comments-input:focus{outline:none;border-color:rgba(56,189,248,0.5);}
  .ig-comments-send{background:#1877F2;color:#fff;border:none;border-radius:10px;padding:8px 16px;font-weight:700;font-size:13px;cursor:pointer;transition:all 0.2s;}
  .ig-comments-send.ig-ig{background:#E1306C;}
  .ig-comments-send:hover:not(:disabled){opacity:0.9;transform:translateY(-1px);}
  .ig-comments-replying-to{font-size:11px;color:#38bdf8;display:flex;justify-content:space-between;align-items:center;}
  .ig-comment-reply-btn{font-size:11px;color:#38bdf8;background:none;border:none;cursor:pointer;padding:0;font-weight:600;}
  .ig-comment-reply-btn:hover{text-decoration:underline;}
  .ig-comments-backdrop{position:fixed;inset:0;background:rgba(0,0,0,0.5);z-index:99;}

  @media(max-width:1000px){
    .igp-kpis{grid-template-columns:repeat(2,1fr);}
    .igp-grid{grid-template-columns:1fr;}
    .igp-posts{grid-template-columns:repeat(2,1fr);}
  }
  @media(max-width:600px){
    .igp-kpis{grid-template-columns:1fr;}
    .igp-posts{grid-template-columns:1fr;}
    .igp-scroll{padding:20px 16px 80px;}
  }
`;

interface IGPost {
  id: string; caption: string; mediaType: string; mediaUrl: string | null;
  permalink: string; timestamp: string; likes: number; comments: number;
  shares: number; videoViews: number; saved: number; reach: number; impressions: number;
  totalInteractions: number; engagement: number;
}

interface InsightsData {
  account: {
    username: string; name: string; profilePictureUrl: string; biography: string;
    followersCount: number; followsCount: number; mediaCount: number;
  };
  totals: {
    totalLikes: number; totalComments: number; totalShares: number;
    totalVideoViews: number; totalSaved: number; totalReach: number;
    totalImpressions: number; totalInteractions: number;
  };
  engagementRate: string;
  posts: IGPost[];
}

const FV = { initial: { opacity: 0, y: 16 }, animate: { opacity: 1, y: 0 } };

export default function EngagementDashboardPage() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<"facebook" | "instagram">("facebook");
  
  // Data for Facebook and Instagram separately
  const [fbData, setFbData] = useState<InsightsData | null>(null);
  const [igData, setIgData] = useState<InsightsData | null>(null);

  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState("");

  // Comments and Moderation State
  const [selectedPost, setSelectedPost] = useState<IGPost | null>(null);
  const [comments, setComments] = useState<any[]>([]);
  const [commentsLoading, setCommentsLoading] = useState(false);
  const [commentsError, setCommentsError] = useState("");
  const [newCommentText, setNewCommentText] = useState("");
  const [replyingTo, setReplyingTo] = useState<{ id: string; username: string } | null>(null);
  const [postingComment, setPostingComment] = useState(false);

  useEffect(() => {
    if (localStorage.getItem("isAuthenticated") !== "true") {
      navigate("/auth", { replace: true });
      return;
    }
    load(false);
  }, [activeTab]);

  const load = async (isRefresh = false) => {
    const token = localStorage.getItem("authToken");
    if (!token) return;

    if (isRefresh) setRefreshing(true);
    else setLoading(true);
    setError("");

    try {
      const endpoint = activeTab === "facebook" 
        ? `${API_BASE}/api/social/facebook/posts` 
        : `${API_BASE}/api/social/instagram/insights`;

      const r = await fetch(endpoint, {
        headers: { Authorization: `Bearer ${token}` }
      });
      const d = await r.json();

      if (r.status === 400 && (d.error === "NOT_CONNECTED" || d.error?.includes("not connected") || d.details?.includes("not connected"))) {
        if (activeTab === "facebook") setFbData(null);
        else setIgData(null);
        setError("NOT_CONNECTED");
      } else if (r.status === 401) {
        // Token expired — clear auth and redirect to login
        localStorage.removeItem("authToken");
        localStorage.removeItem("isAuthenticated");
        navigate("/auth", { replace: true });
        return;
      } else if (!r.ok) {
        throw new Error(d.details || d.error || d.message || "Request failed");
      } else if (d.success) {
        if (activeTab === "facebook") setFbData(d);
        else setIgData(d);
      } else {
        throw new Error(d.error || "Unknown error");
      }
    } catch (e: any) {
      console.error(`Error loading ${activeTab} data`, e);
      setError(e.message || "Network error. Failed to retrieve data.");
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const fetchComments = async (postId: string) => {
    const token = localStorage.getItem("authToken");
    if (!token) return;
    setCommentsLoading(true);
    setCommentsError("");
    try {
      const endpoint = activeTab === "facebook"
        ? `${API_BASE}/api/social/facebook/comments/${postId}`
        : `${API_BASE}/api/social/instagram/comments/${postId}`;

      const r = await fetch(endpoint, {
        headers: { Authorization: `Bearer ${token}` }
      });
      const d = await r.json();
      if (d.success) {
        setComments(d.comments || []);
      } else {
        setCommentsError(d.details || d.error || "Failed to load comments");
      }
    } catch (e) {
      console.error("Error loading comments", e);
      setCommentsError("Network error. Could not connect to API.");
    } finally {
      setCommentsLoading(false);
    }
  };

  const handlePostComment = async () => {
    if (!newCommentText.trim() || !selectedPost) return;
    const token = localStorage.getItem("authToken");
    if (!token) return;

    setPostingComment(true);
    const targetId = replyingTo ? replyingTo.id : selectedPost.id;
    const isReply = !!replyingTo;

    try {
      const endpoint = activeTab === "facebook"
        ? `${API_BASE}/api/social/facebook/comments/${targetId}`
        : `${API_BASE}/api/social/instagram/comments/${targetId}`;

      const r = await fetch(endpoint, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ message: newCommentText, isReply })
      });
      const d = await r.json();
      if (d.success) {
        setNewCommentText("");
        setReplyingTo(null);
        // Reload comments list
        fetchComments(selectedPost.id);
      } else {
        alert(d.details || d.error || "Failed to post comment");
      }
    } catch (e) {
      console.error("Error posting comment", e);
      alert("Network error. Could not post comment.");
    } finally {
      setPostingComment(false);
    }
  };

  const currentData = activeTab === "facebook" ? fbData : igData;
  const userName = localStorage.getItem("userInfo") ? JSON.parse(localStorage.getItem("userInfo")!).name : "there";
  const userInitial = userName[0]?.toUpperCase() || "U";

  // Recharts details
  const postBarData = currentData?.posts.map((p, i) => ({
    name: `Post ${i + 1}`,
    Likes: p.likes,
    Comments: p.comments,
    Shares: p.shares || 0
  })) || [];

  const reachSeries = currentData?.posts.slice().reverse().map((p) => ({
    date: new Date(p.timestamp).toLocaleDateString("en-US", { month: "short", day: "numeric" }),
    value: p.reach || 0
  })) || [];

  const kpis = currentData ? [
    { icon: <Heart size={15} />, bg: "rgba(239,68,68,.12)", col: "#ef4444", val: currentData.totals.totalLikes, lbl: "Likes" },
    { icon: <MessageCircle size={15} />, bg: "rgba(56,189,248,.12)", col: "#38bdf8", val: currentData.totals.totalComments, lbl: "Comments" },
    { icon: <Share2 size={15} />, bg: "rgba(34,197,94,.12)", col: "#22c55e", val: currentData.totals.totalShares, lbl: "Shares" },
    { icon: <TrendingUp size={15} />, bg: "rgba(167,139,250,.12)", col: "#a78bfa", val: currentData.engagementRate + "%", lbl: "Engagement" }
  ] : [];

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
              <div className="igp-hero-line" style={activeTab === "facebook" ? { background: "#1877F2" } : {}} />
              <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
                <div style={{
                  width: 48,
                  height: 48,
                  borderRadius: 14,
                  background: activeTab === "facebook" ? "#1877F2" : "linear-gradient(135deg,#E1306C,#833AB4,#FCAF45)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center"
                }}>
                  {activeTab === "facebook" ? <Facebook size={24} color="#fff" /> : <Instagram size={24} color="#fff" />}
                </div>
                <div>
                  <div style={{ fontSize: 24, fontWeight: 900, color: "#f1f5f9" }}>
                    Engagement <span style={{
                      background: activeTab === "facebook" ? "#1877F2" : "linear-gradient(135deg,#E1306C,#FCAF45)",
                      WebkitBackgroundClip: "text",
                      WebkitTextFillColor: "transparent"
                    }}>Dashboard</span>
                  </div>
                  <div style={{ color: "#64748b", fontSize: 13 }}>Monitor, moderate, and reply to posts and comments in real-time</div>
                </div>
              </div>
              <div style={{ display: "flex", gap: 10 }}>
                <button className="igp-btn" onClick={() => load(true)} disabled={refreshing || loading}>
                  <motion.span animate={refreshing ? { rotate: 360 } : {}} transition={{ duration: 1, repeat: Infinity, ease: "linear" }} style={{ display: "flex" }}><RefreshCw size={13} /></motion.span>
                  {refreshing ? "Refreshing…" : "Refresh"}
                </button>
                <button className="igp-btn" onClick={() => navigate("/dashboard")}>
                  <ArrowLeft size={13} /> Dashboard
                </button>
              </div>
            </motion.div>

            {/* Platform Tab Selector */}
            <div className="igp-tabs">
              <button 
                onClick={() => setActiveTab("facebook")} 
                className={`igp-tab ${activeTab === "facebook" ? "active-facebook" : ""}`}
              >
                <Facebook size={16} /> Facebook Page
              </button>
              <button 
                onClick={() => setActiveTab("instagram")} 
                className={`igp-tab ${activeTab === "instagram" ? "active-instagram" : ""}`}
              >
                <Instagram size={16} /> Instagram Account
              </button>
            </div>

            {loading && (
              <div style={{ display: "flex", justifyContent: "center", padding: "80px 0" }}>
                <div style={{
                  width: 44,
                  height: 44,
                  border: `4px solid ${activeTab === "facebook" ? "rgba(24,119,242,0.2)" : "rgba(225,48,108,0.2)"}`,
                  borderTopColor: activeTab === "facebook" ? "#1877F2" : "#E1306C",
                  borderRadius: "50%",
                  animation: "igp-spin 0.8s linear infinite"
                }} />
                <style>{`@keyframes igp-spin{to{transform:rotate(360deg)}}`}</style>
              </div>
            )}

            {!loading && error && (
              <div className="igp-notice">
                <AlertCircle size={40} style={{ margin: "0 auto 16px", color: activeTab === "facebook" ? "#1877F2" : "#E1306C", opacity: 0.6 }} />
                <div style={{ fontSize: 18, fontWeight: 800, color: "#f1f5f9", marginBottom: 8 }}>
                  {error === "NOT_CONNECTED" ? `${activeTab === "facebook" ? "Facebook Page" : "Instagram"} Not Connected` : "Could Not Load Interactions"}
                </div>
                <div style={{ color: "#64748b", fontSize: 14, marginBottom: 24, maxWidth: 480, margin: "0 auto 24px" }}>
                  {error === "NOT_CONNECTED" 
                    ? `Please connect your ${activeTab === "facebook" ? "Facebook Page" : "Instagram Business account"} in Social settings to moderate interactions.`
                    : error}
                </div>
                {error === "NOT_CONNECTED" && (
                  <button className="igp-btn" style={{ margin: "0 auto", borderColor: activeTab === "facebook" ? "#1877F2" : "#E1306C" }} onClick={() => navigate("/social")}>
                    Connect {activeTab === "facebook" ? "Facebook Page" : "Instagram"} →
                  </button>
                )}
              </div>
            )}

            {!loading && currentData && (
              <>
                {/* Profile Header */}
                <motion.div {...FV} transition={{ delay: 0.1 }} className="igp-profile">
                  {currentData.account.profilePictureUrl ? (
                    <img src={currentData.account.profilePictureUrl} alt="profile" className="igp-profile-pic" />
                  ) : (
                    <div className="igp-profile-pic">
                      {activeTab === "facebook" ? <Facebook size={24} color="#1877F2" /> : <Instagram size={24} color="#E1306C" />}
                    </div>
                  )}
                  <div style={{ flex: 1 }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 4, flexWrap: "wrap" }}>
                      <div style={{ fontSize: 18, fontWeight: 800, color: "#f1f5f9" }}>{currentData.account.name || currentData.account.username}</div>
                      <span className="igp-badge">
                        {activeTab === "facebook" ? <Facebook size={10} color="#1877F2" /> : <Instagram size={10} color="#E1306C" />}
                        @{currentData.account.username}
                      </span>
                    </div>
                    <div style={{ color: "#64748b", fontSize: 13, marginBottom: 10 }}>{currentData.account.biography || `Connected ${activeTab} channel`}</div>
                    <div style={{ display: "flex", gap: 24 }}>
                      {[{ val: currentData.account.followersCount, lbl: "Followers" }, { val: currentData.account.mediaCount, lbl: "Posts" }].map(s => (
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
                  <motion.div {...FV} transition={{ delay: 0.25 }} className="igp-card" style={{ marginBottom: 0 }}>
                    <div className="igp-card-title"><MessageSquare size={14} color={activeTab === "facebook" ? "#1877F2" : "#E1306C"} /> Per-Post Interactions</div>
                    <div style={{ height: 220 }}>
                      <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={postBarData} margin={{ top: 5, right: 5, left: -25, bottom: 0 }}>
                          <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" vertical={false} />
                          <XAxis dataKey="name" stroke="#334155" fontSize={10} tickLine={false} axisLine={false} />
                          <YAxis stroke="#334155" fontSize={10} tickLine={false} axisLine={false} />
                          <Tooltip contentStyle={{ background: "#0f172a", border: "1px solid rgba(255,255,255,0.08)", borderRadius: 10, fontSize: 12, color: "#e2e8f0" }} />
                          <Bar dataKey="Likes" fill={activeTab === "facebook" ? "#1877F2" : "#E1306C"} radius={[4, 4, 0, 0]} />
                          <Bar dataKey="Comments" fill={activeTab === "facebook" ? "#38bdf8" : "#833AB4"} radius={[4, 4, 0, 0]} />
                          <Bar dataKey="Shares" fill="#22c55e" radius={[4, 4, 0, 0]} />
                        </BarChart>
                      </ResponsiveContainer>
                    </div>
                  </motion.div>

                  <motion.div {...FV} transition={{ delay: 0.3 }} className="igp-card" style={{ marginBottom: 0 }}>
                    <div className="igp-card-title"><Eye size={14} color="#a78bfa" /> Reach Over Time</div>
                    <div style={{ height: 220 }}>
                      <ResponsiveContainer width="100%" height="100%">
                        <AreaChart data={reachSeries.length ? reachSeries : [{ date: "No data", value: 0 }]} margin={{ top: 5, right: 5, left: -25, bottom: 0 }}>
                          <defs>
                            <linearGradient id="igReach2" x1="0" y1="0" x2="0" y2="1">
                              <stop offset="5%" stopColor="#a78bfa" stopOpacity={0.3} />
                              <stop offset="95%" stopColor="#a78bfa" stopOpacity={0} />
                            </linearGradient>
                          </defs>
                          <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" vertical={false} />
                          <XAxis dataKey="date" stroke="#334155" fontSize={10} tickLine={false} axisLine={false} />
                          <YAxis stroke="#334155" fontSize={10} tickLine={false} axisLine={false} />
                          <Tooltip contentStyle={{ background: "#0f172a", border: "1px solid rgba(255,255,255,0.08)", borderRadius: 10, fontSize: 12, color: "#e2e8f0" }} />
                          <Area type="monotone" dataKey="value" stroke="#a78bfa" strokeWidth={2} fill="url(#igReach2)" />
                        </AreaChart>
                      </ResponsiveContainer>
                    </div>
                  </motion.div>
                </div>

                {/* Posts List */}
                <motion.div {...FV} transition={{ delay: 0.38 }} className="igp-card">
                  <div className="igp-card-title">
                    <MessageCircle size={14} color={activeTab === "facebook" ? "#1877F2" : "#E1306C"} /> Recent Posts & Moderation
                  </div>
                  {currentData.posts.length === 0 ? (
                    <div style={{ textAlign: "center", padding: "40px 0", color: "#64748b" }}>No posts found on this account.</div>
                  ) : (
                    <div className="igp-posts">
                      {currentData.posts.map((post, i) => (
                        <motion.div 
                          key={post.id}
                          initial={{ opacity: 0, scale: 0.96 }}
                          animate={{ opacity: 1, scale: 1 }}
                          transition={{ delay: 0.04 * i }}
                          className="igp-post"
                          onClick={() => { setSelectedPost(post); fetchComments(post.id); }}
                        >
                          <div className="igp-post-thumb">
                            {post.mediaUrl ? (
                              <img src={post.mediaUrl} alt={`Post ${i + 1}`} onError={e => { (e.target as HTMLImageElement).style.display = "none"; }} />
                            ) : (
                              <div style={{ padding: 20, textAlign: "center", color: "#475569" }}>
                                {activeTab === "facebook" ? <Facebook size={32} color="#1877F2" style={{ opacity: 0.3, margin: "0 auto 8px" }} /> : <Instagram size={32} color="#E1306C" style={{ opacity: 0.3, margin: "0 auto 8px" }} />}
                                <div style={{ fontSize: 11, fontWeight: 600 }}>Text Post</div>
                              </div>
                            )}
                            <div style={{ position: "absolute", bottom: 8, left: 8, right: 8, display: "flex", gap: 10 }}>
                              <span className="igp-post-stat"><Heart size={11} color="#ef4444" /> {post.likes}</span>
                              <span className="igp-post-stat"><MessageCircle size={11} color="#38bdf8" /> {post.comments}</span>
                            </div>
                          </div>
                          <div className="igp-post-body">
                            <div style={{ fontSize: 12, color: "#e2e8f0", height: 50, overflow: "hidden", textOverflow: "ellipsis", display: "-webkit-box", WebkitLineClamp: 3, WebkitBoxOrient: "vertical", marginBottom: 12, lineHeight: 1.4 }}>
                              {post.caption || <span style={{ color: "#475569", fontStyle: "italic" }}>No text content</span>}
                            </div>
                            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                              <div style={{ fontSize: 11, color: "#64748b" }}>{new Date(post.timestamp).toLocaleDateString("en-US", { month: "short", day: "numeric" })}</div>
                              {post.permalink && (
                                <button 
                                  style={{ background: "none", border: "none", cursor: "pointer", display: "flex" }} 
                                  onClick={(e) => { e.stopPropagation(); window.open(post.permalink, "_blank"); }}
                                >
                                  <ExternalLink size={12} color="#475569" />
                                </button>
                              )}
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

      {/* Side Moderation Drawer */}
      {selectedPost && (
        <>
          <div className="ig-comments-backdrop" onClick={() => { setSelectedPost(null); setComments([]); setReplyingTo(null); }} />
          <motion.div 
            initial={{ x: "100%" }} 
            animate={{ x: 0 }} 
            transition={{ type: "spring", damping: 25, stiffness: 200 }}
            className="ig-comments-drawer"
          >
            <div className="ig-comments-header">
              <div>
                <div style={{ fontSize: 15, fontWeight: 800, color: "#f1f5f9" }}>Audience Moderation</div>
                <div style={{ fontSize: 11, color: "#64748b" }}>Channel: {activeTab === "facebook" ? "Facebook Page" : "Instagram"}</div>
              </div>
              <button 
                className="igp-btn" 
                style={{ padding: "6px 12px" }} 
                onClick={() => { setSelectedPost(null); setComments([]); setReplyingTo(null); }}
              >
                Close
              </button>
            </div>

            <div className="ig-comments-list">
              {commentsLoading ? (
                <div style={{ display: "flex", justifyContent: "center", padding: "40px 0" }}>
                  <div style={{ width: 24, height: 24, border: `2px solid ${activeTab === "facebook" ? "rgba(24,119,242,0.2)" : "rgba(225,48,108,0.2)"}`, borderTopColor: activeTab === "facebook" ? "#1877F2" : "#E1306C", borderRadius: "50%", animation: "igp-spin 0.8s linear infinite" }} />
                </div>
              ) : commentsError ? (
                <div style={{ textAlign: "center", padding: "30px 20px" }}>
                  <AlertCircle size={32} style={{ margin: "0 auto 10px", color: activeTab === "facebook" ? "#1877F2" : "#E1306C", opacity: 0.8 }} />
                  <div style={{ fontSize: 14, fontWeight: 700, marginBottom: 6, color: "#f1f5f9" }}>Failed to Load Comments</div>
                  <div style={{ fontSize: 11, color: "#94a3b8", lineHeight: 1.4, marginBottom: 16 }}>{commentsError}</div>
                  <button 
                    className="igp-btn" 
                    style={{ fontSize: 11, padding: "8px 16px", background: activeTab === "facebook" ? "#1877F2" : "#E1306C", color: "#fff", border: "none" }}
                    onClick={() => navigate("/social")}
                  >
                    Go to Social Settings
                  </button>
                </div>
              ) : comments.length === 0 ? (
                <div style={{ textAlign: "center", padding: "40px 0", color: "#64748b", fontSize: 13 }}>No comments found on this post.</div>
              ) : (
                comments.map((comment) => (
                  <div key={comment.id} className="ig-comment-item">
                    <div className="ig-comment-meta">
                      <span className="ig-comment-user">@{comment.username || "user"}</span>
                      <span>{new Date(comment.timestamp).toLocaleDateString("en-US", { month: "short", day: "numeric" })}</span>
                    </div>
                    <div className="ig-comment-text">{comment.text}</div>
                    <div style={{ marginTop: 6, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                      <span style={{ fontSize: 10, color: "#64748b" }}>💖 {comment.like_count || 0} likes</span>
                      <button 
                        className="ig-comment-reply-btn" 
                        onClick={() => setReplyingTo({ id: comment.id, username: comment.username })}
                        style={{ color: activeTab === "facebook" ? "#38bdf8" : "#e1306c" }}
                      >
                        Reply
                      </button>
                    </div>

                    {/* Replies */}
                    {comment.replies?.data && comment.replies.data.map((reply: any) => (
                      <div key={reply.id} className="ig-comment-reply" style={activeTab === "facebook" ? { borderLeftColor: "rgba(56,189,248,0.2)" } : { borderLeftColor: "rgba(225,48,108,0.2)" }}>
                        <div className="ig-comment-meta">
                          <span className="ig-comment-user" style={{ color: activeTab === "facebook" ? "#38bdf8" : "#a78bfa" }}>@{reply.username || "user"}</span>
                          <span>{new Date(reply.timestamp).toLocaleDateString("en-US", { month: "short", day: "numeric" })}</span>
                        </div>
                        <div className="ig-comment-text" style={{ fontSize: 12 }}>{reply.text}</div>
                      </div>
                    ))}
                  </div>
                ))
              )}
            </div>

            <div className="ig-comments-input-area">
              {replyingTo && (
                <div className="ig-comments-replying-to" style={{ color: activeTab === "facebook" ? "#38bdf8" : "#a78bfa" }}>
                  <span>Replying to <strong>@{replyingTo.username}</strong></span>
                  <button 
                    style={{ background: "none", border: "none", color: "#ef4444", cursor: "pointer", fontSize: 10, fontWeight: 700 }} 
                    onClick={() => setReplyingTo(null)}
                  >
                    Cancel
                  </button>
                </div>
              )}
              <div className="ig-comments-input-row">
                <input 
                  type="text" 
                  placeholder={replyingTo ? "Write a reply..." : "Write a comment..."} 
                  value={newCommentText}
                  onChange={(e) => setNewCommentText(e.target.value)}
                  className="ig-comments-input"
                  onKeyDown={(e) => { if (e.key === "Enter" && newCommentText.trim()) handlePostComment(); }}
                />
                <button 
                  onClick={handlePostComment} 
                  disabled={postingComment || !newCommentText.trim()}
                  className={`ig-comments-send ${activeTab === "instagram" ? "ig-ig" : ""}`}
                >
                  {postingComment ? "..." : "Send"}
                </button>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </div>
  );
}
