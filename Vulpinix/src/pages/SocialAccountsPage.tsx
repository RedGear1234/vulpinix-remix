import { useState, useEffect } from "react";
import { useNavigate } from "react-router";
import { motion } from "framer-motion";
import {
  Instagram, Facebook, Twitter, Linkedin, Youtube,
  CheckCircle2, Link2, Unlink, ArrowLeft, ExternalLink,
  AlertCircle, Sparkles, Users, TrendingUp
} from "lucide-react";
import { DashboardSidebar } from "../components/DashboardSidebar";

export const SOCIAL_PLATFORMS = [
  {
    id: "instagram",
    name: "Instagram",
    icon: <Instagram size={22} />,
    color: "#E1306C",
    gradient: "linear-gradient(135deg, #f09433, #e6683c, #dc2743, #cc2366, #bc1888)",
    handle: "@your_handle",
    description: "Photos, reels & stories",
  },
  {
    id: "facebook",
    name: "Facebook",
    icon: <Facebook size={22} />,
    color: "#1877F2",
    gradient: "linear-gradient(135deg, #1877F2, #0d5fc9)",
    handle: "Your Page",
    description: "Posts, pages & groups",
  },
  {
    id: "twitter",
    name: "X / Twitter",
    icon: <Twitter size={22} />,
    color: "#1DA1F2",
    gradient: "linear-gradient(135deg, #1DA1F2, #0c85d0)",
    handle: "@your_handle",
    description: "Tweets & threads",
  },
  {
    id: "linkedin",
    name: "LinkedIn",
    icon: <Linkedin size={22} />,
    color: "#0A66C2",
    gradient: "linear-gradient(135deg, #0A66C2, #084d93)",
    handle: "Your Profile",
    description: "Professional network",
  },
  {
    id: "youtube",
    name: "YouTube",
    icon: <Youtube size={22} />,
    color: "#FF0000",
    gradient: "linear-gradient(135deg, #FF0000, #cc0000)",
    handle: "Your Channel",
    description: "Videos & shorts",
  },
  {
    id: "tiktok",
    name: "TikTok",
    icon: <span style={{ fontWeight: 900, fontSize: 18, lineHeight: 1 }}>TK</span>,
    color: "#69C9D0",
    gradient: "linear-gradient(135deg, #69C9D0, #EE1D52)",
    handle: "@your_handle",
    description: "Short-form videos",
  },
  {
    id: "pinterest",
    name: "Pinterest",
    icon: (
      <svg width={22} height={22} viewBox="0 0 24 24" fill="currentColor">
        <path d="M12.017 0C5.396 0 .029 5.367.029 11.987c0 5.079 3.158 9.417 7.618 11.162-.105-.949-.199-2.403.041-3.439.219-.937 1.406-5.965 1.406-5.965s-.359-.719-.359-1.782c0-1.668.967-2.914 2.171-2.914 1.023 0 1.518.769 1.518 1.69 0 1.029-.655 2.568-.994 3.995-.283 1.194.599 2.169 1.777 2.169 2.133 0 3.772-2.249 3.772-5.495 0-2.873-2.064-4.882-5.012-4.882-3.414 0-5.418 2.561-5.418 5.207 0 1.031.397 2.138.893 2.738a.36.36 0 0 1 .083.345l-.333 1.36c-.053.22-.174.267-.402.161-1.499-.698-2.436-2.889-2.436-4.649 0-3.785 2.75-7.262 7.929-7.262 4.163 0 7.398 2.967 7.398 6.931 0 4.136-2.607 7.464-6.227 7.464-1.216 0-2.359-.631-2.75-1.378l-.748 2.853c-.271 1.043-1.002 2.35-1.492 3.146 1.124.347 2.317.535 3.554.535 6.607 0 11.985-5.365 11.985-11.987C23.97 5.39 18.592.026 11.985.026L12.017 0z"/>
      </svg>
    ),
    color: "#E60023",
    gradient: "linear-gradient(135deg, #E60023, #b50016)",
    handle: "Your Profile",
    description: "Pins & boards",
  },
];

const S = `
  .vxsa-shell { display: flex; height: 100vh; background: var(--vx-bg-primary); overflow: hidden; }
  .vxsa-page  { flex: 1; overflow-y: auto; padding: 40px 32px 100px; font-family: 'Inter', sans-serif; color: var(--vx-text-primary); position: relative; }
  .vxsa-inner { max-width: 960px; margin: 0 auto; position: relative; z-index: 10; }
  .vxsa-orb1  { position: fixed; top:-10%; right:-5%; width:500px; height:500px; background:radial-gradient(circle,rgba(167,139,250,0.1) 0%,transparent 70%); border-radius:50%; pointer-events:none; }
  .vxsa-orb2  { position: fixed; bottom:-15%; left:-8%; width:600px; height:600px; background:radial-gradient(circle,rgba(56,189,248,0.07) 0%,transparent 70%); border-radius:50%; pointer-events:none; }

  .vxsa-back  { display:flex; align-items:center; gap:8px; color:var(--vx-text-muted); font-size:14px; font-weight:600; cursor:pointer; margin-bottom:32px; transition:color 0.2s; width:fit-content; }
  .vxsa-back:hover { color:var(--vx-text-primary); }
  .vxsa-heading { font-size:28px; font-weight:900; letter-spacing:-0.02em; margin-bottom:6px; }
  .vxsa-heading span { background:linear-gradient(135deg,#a78bfa,#38bdf8); -webkit-background-clip:text; -webkit-text-fill-color:transparent; }
  .vxsa-sub   { color:var(--vx-text-muted); font-size:15px; margin-bottom:36px; }

  .vxsa-banner { background:linear-gradient(135deg,rgba(167,139,250,0.08),rgba(56,189,248,0.06)); border:1px solid rgba(167,139,250,0.2); border-radius:20px; padding:20px 24px; display:flex; align-items:center; gap:16px; margin-bottom:32px; position:relative; overflow:hidden; }
  .vxsa-banner::before { content:''; position:absolute; top:0; left:0; right:0; height:2px; background:linear-gradient(90deg,#a78bfa,#38bdf8); }

  .vxsa-stats { display:grid; grid-template-columns:repeat(3,1fr); gap:16px; margin-bottom:32px; }
  .vxsa-stat  { background:var(--vx-bg-card); border:1px solid var(--vx-border); border-radius:18px; padding:20px 24px; }
  .vxsa-stat-val { font-size:28px; font-weight:800; margin-bottom:4px; }
  .vxsa-stat-lbl { font-size:12px; color:var(--vx-text-muted); font-weight:600; text-transform:uppercase; letter-spacing:0.06em; }

  .vxsa-grid { display:grid; grid-template-columns:repeat(2,1fr); gap:20px; }

  .vxsa-card { background:var(--vx-bg-card); border:1px solid var(--vx-border); border-radius:22px; padding:24px; transition:border-color 0.25s,transform 0.25s; position:relative; overflow:hidden; }
  .vxsa-card.connected { border-color:rgba(34,197,94,0.3); }
  .vxsa-card:hover { transform:translateY(-3px); }
  .vxsa-card-accent { position:absolute; top:0; left:0; right:0; height:3px; border-radius:22px 22px 0 0; }

  .vxsa-platform-header { display:flex; align-items:center; gap:14px; margin-bottom:18px; }
  .vxsa-platform-icon { width:48px; height:48px; border-radius:14px; display:flex; align-items:center; justify-content:center; color:#fff; flex-shrink:0; }
  .vxsa-platform-name { font-size:17px; font-weight:800; margin-bottom:2px; }
  .vxsa-platform-desc { font-size:13px; color:var(--vx-text-muted); }

  .vxsa-handle-input { width:100%; padding:10px 14px; background:rgba(255,255,255,0.03); border:1px solid var(--vx-border); border-radius:10px; color:var(--vx-text-primary); font-size:14px; outline:none; font-family:'Inter',sans-serif; margin-bottom:12px; box-sizing:border-box; transition:border-color 0.2s; }
  .vxsa-handle-input:focus { border-color:rgba(167,139,250,0.4); }
  .vxsa-handle-input::placeholder { color:var(--vx-text-muted); }

  .vxsa-connect-btn { width:100%; padding:10px 14px; border-radius:10px; border:none; font-size:13px; font-weight:700; cursor:pointer; display:flex; align-items:center; justify-content:center; gap:8px; transition:all 0.2s; }
  .vxsa-connect-btn.unconnected { background:rgba(167,139,250,0.1); border:1px solid rgba(167,139,250,0.25); color:#a78bfa; }
  .vxsa-connect-btn.unconnected:hover { background:rgba(167,139,250,0.18); }
  .vxsa-connect-btn.connected { background:rgba(34,197,94,0.1); border:1px solid rgba(34,197,94,0.25); color:#22c55e; }
  .vxsa-connect-btn.connected:hover { background:rgba(239,68,68,0.1); border-color:rgba(239,68,68,0.25); color:#ef4444; }
  .vxsa-connect-btn.connecting { opacity:0.7; cursor:wait; }

  .vxsa-connected-badge { display:inline-flex; align-items:center; gap:6px; font-size:12px; font-weight:700; color:#22c55e; background:rgba(34,197,94,0.1); border:1px solid rgba(34,197,94,0.2); padding:4px 10px; border-radius:20px; margin-bottom:10px; }

  .vxsa-modal-overlay { position:fixed; inset:0; background:rgba(0,0,0,0.8); backdrop-filter:blur(8px); z-index:100; display:flex; align-items:center; justify-content:center; padding:20px; }
  .vxsa-oauth-modal { background:#fff; border-radius:24px; width:100%; max-width:440px; overflow:hidden; color:#000; font-family:'Inter',sans-serif; position:relative; box-shadow:0 24px 48px rgba(0,0,0,0.5); }
  .vxsa-oauth-header { background:var(--oauth-bg); color:#fff; padding:24px 32px; text-align:center; position:relative; }
  .vxsa-oauth-close { position:absolute; top:20px; right:20px; width:32px; height:32px; background:rgba(255,255,255,0.2); border-radius:50%; display:flex; align-items:center; justify-content:center; cursor:pointer; transition:background 0.2s; color:#fff; border:none; }
  .vxsa-oauth-close:hover { background:rgba(255,255,255,0.3); }
  .vxsa-oauth-body { padding:40px 32px; }
  .vxsa-oauth-input { width:100%; padding:14px 16px; border:1px solid #e5e7eb; border-radius:12px; font-size:15px; margin-bottom:16px; outline:none; transition:border-color 0.2s; font-family:inherit; }
  .vxsa-oauth-input:focus { border-color:var(--oauth-color); box-shadow:0 0 0 4px var(--oauth-shadow); }
  .vxsa-oauth-btn { width:100%; padding:16px; border:none; border-radius:12px; background:var(--oauth-bg); color:#fff; font-size:16px; font-weight:700; cursor:pointer; transition:opacity 0.2s,transform 0.1s; display:flex; justify-content:center; align-items:center; }
  .vxsa-oauth-btn:hover:not(:disabled) { opacity:0.9; transform:translateY(-1px); }
  .vxsa-oauth-btn:disabled { opacity:0.6; cursor:not-allowed; }
  .vxsa-oauth-disclaimer { font-size:12px; color:#6b7280; text-align:center; margin-top:24px; line-height:1.5; }

  @media (max-width:768px) { .vxsa-grid { grid-template-columns:1fr; } .vxsa-stats { grid-template-columns:repeat(2,1fr); } }
`;

export function getLinkedAccounts(): string[] {
  try { return JSON.parse(localStorage.getItem("linkedSocialAccounts") || "[]"); } catch { return []; }
}
export function setLinkedAccounts(ids: string[]) {
  localStorage.setItem("linkedSocialAccounts", JSON.stringify(ids));
}

export default function SocialAccountsPage() {
  const navigate = useNavigate();
  const [userName, setUserName] = useState("there");
  const [linked, setLinked] = useState<string[]>([]);
  const [handles, setHandles] = useState<Record<string, string>>({});

  useEffect(() => {
    if (localStorage.getItem("isAuthenticated") !== "true") { navigate("/auth", { replace: true }); return; }
    const u = JSON.parse(localStorage.getItem("userInfo") || "{}");
    if (u.name) setUserName(u.name.split(" ")[0]);
    const userId = u.id || u._id || u.email || "";

    const fetchStatus = async () => {
      try {
        const res = await fetch(`http://localhost:5000/api/social/status?userId=${userId}`);
        const data = await res.json();
        if (data.success) {
          const nextLinked: string[] = [];
          if (data.socialStatus.facebook) nextLinked.push("facebook");
          if (data.socialStatus.instagram) nextLinked.push("instagram");
          if (data.socialStatus.twitter) nextLinked.push("twitter");
          if (data.socialStatus.linkedin) nextLinked.push("linkedin");
          if (data.socialStatus.youtube) nextLinked.push("youtube");
          if (data.socialStatus.pinterest) nextLinked.push("pinterest");
          
          setLinked(nextLinked);
          setLinkedAccounts(nextLinked);
          
          const nextHandles: Record<string, string> = {};
          if (data.socialStatus.handles.facebook) nextHandles.facebook = data.socialStatus.handles.facebook;
          if (data.socialStatus.handles.instagram) nextHandles.instagram = data.socialStatus.handles.instagram;
          if (data.socialStatus.handles.twitter) nextHandles.twitter = data.socialStatus.handles.twitter;
          if (data.socialStatus.handles.youtube) nextHandles.youtube = data.socialStatus.handles.youtube;
          if (data.socialStatus.handles.linkedin) nextHandles.linkedin = data.socialStatus.handles.linkedin;
          if (data.socialStatus.handles.pinterest) nextHandles.pinterest = data.socialStatus.handles.pinterest;
          
          setHandles(nextHandles);
          localStorage.setItem("socialHandles", JSON.stringify(nextHandles));
        }
      } catch (err) {
        console.error("Error fetching social status:", err);
      }
    };

    // Check for OAuth callback params
    const params = new URLSearchParams(window.location.search);
    const success = params.get("success");
    const platform = params.get("platform");
    const error = params.get("error");
    
    if (success === "true" || error) {
      if (error === "missing_credentials") {
        const pName = platform ? platform.charAt(0).toUpperCase() + platform.slice(1) : "This platform";
        alert(`⚠️ ${pName} is not configured yet.\n\nThe backend is missing API credentials for ${pName}.\nPlease add your ${pName} Client ID and Secret to the backend .env file and restart the server.`);
      } else if (error) {
        alert(`Connection failed: ${error}`);
      }
      window.history.replaceState({}, document.title, window.location.pathname);
      fetchStatus();
    } else {
      fetchStatus();
    }
  }, [navigate]);

  const handleToggle = async (platformId: string) => {
    const u = JSON.parse(localStorage.getItem("userInfo") || "{}");
    const userId = u.id || u._id || u.email || "";

    if (linked.includes(platformId)) {
      // Disconnect via API
      try {
        const res = await fetch(`http://localhost:5000/api/social/${platformId}?userId=${userId}`, {
          method: "DELETE"
        });
        const data = await res.json();
        if (data.success) {
          const next = linked.filter(id => id !== platformId);
          setLinked(next); 
          setLinkedAccounts(next);
          const nextHandles = { ...handles };
          delete nextHandles[platformId];
          setHandles(nextHandles);
          localStorage.setItem("socialHandles", JSON.stringify(nextHandles));
        }
      } catch (err) {
        console.error("Disconnect error:", err);
      }
    } else {
      // Connect - Redirect to the backend which will redirect to the platform's OAuth page
      window.location.href = `http://localhost:5000/api/social/auth/${platformId}?userId=${userId}`;
    }
  };



  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: S }} />
      <div className="vxsa-shell">
        <DashboardSidebar userName={userName} userInitial={userName[0]?.toUpperCase() || "U"} />
        <div className="vxsa-page">
          <div className="vxsa-orb1" /><div className="vxsa-orb2" />
          <div className="vxsa-inner">

            <div className="vxsa-back" onClick={() => navigate("/dashboard")}>
              <ArrowLeft size={16} /> Back to Dashboard
            </div>

            <motion.div initial={{ opacity: 0, y: -16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}>
              <div className="vxsa-heading">Social <span>Accounts</span></div>
              <div className="vxsa-sub">Link your social profiles to enable posting and campaign publishing, {userName}.</div>
            </motion.div>

            {linked.length === 0 && (
              <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="vxsa-banner">
                <AlertCircle size={24} color="#eab308" style={{ flexShrink: 0 }} />
                <div>
                  <div style={{ fontWeight: 700, fontSize: 15, marginBottom: 2 }}>No accounts linked yet</div>
                  <div style={{ fontSize: 13, color: "var(--vx-text-muted)" }}>
                    You must connect at least one social account before you can create posts or upload campaigns.
                  </div>
                </div>
              </motion.div>
            )}

            <div className="vxsa-stats">
              <div className="vxsa-stat">
                <div className="vxsa-stat-val" style={{ color: "#a78bfa" }}>{linked.length}</div>
                <div className="vxsa-stat-lbl"><Users size={12} style={{ display:"inline",marginRight:4 }} />Accounts Linked</div>
              </div>
              <div className="vxsa-stat">
                <div className="vxsa-stat-val" style={{ color: "#38bdf8" }}>{SOCIAL_PLATFORMS.length - linked.length}</div>
                <div className="vxsa-stat-lbl"><Link2 size={12} style={{ display:"inline",marginRight:4 }} />Available to Connect</div>
              </div>
              <div className="vxsa-stat">
                <div className="vxsa-stat-val" style={{ color: linked.length > 0 ? "#22c55e" : "#ef4444" }}>
                  {linked.length > 0 ? "Ready" : "Locked"}
                </div>
                <div className="vxsa-stat-lbl"><TrendingUp size={12} style={{ display:"inline",marginRight:4 }} />Campaign Status</div>
              </div>
            </div>

            <div className="vxsa-grid">
              {SOCIAL_PLATFORMS.map((p, i) => {
                const isLinked = linked.includes(p.id);
                return (
                  <motion.div
                    key={p.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 + i * 0.06 }}
                    className={`vxsa-card ${isLinked ? "connected" : ""}`}
                  >
                    <div className="vxsa-card-accent" style={{ background: p.gradient }} />
                    <div className="vxsa-platform-header">
                      <div className="vxsa-platform-icon" style={{ background: p.gradient }}>{p.icon}</div>
                      <div>
                        <div className="vxsa-platform-name">{p.name}</div>
                        <div className="vxsa-platform-desc">{p.description}</div>
                      </div>
                      {isLinked && (
                        <div style={{ marginLeft: "auto" }}>
                          <CheckCircle2 size={20} color="#22c55e" />
                        </div>
                      )}
                    </div>

                    {isLinked && (
                      <div className="vxsa-connected-badge">
                        <CheckCircle2 size={12} /> Connected · {handles[p.id] || p.handle}
                      </div>
                    )}

                    {!isLinked && (
                      <div className="vxsa-platform-desc" style={{ marginBottom: 12, marginTop: -4 }}>
                        Not connected
                      </div>
                    )}

                    <button
                      className={`vxsa-connect-btn ${isLinked ? "connected" : "unconnected"}`}
                      onClick={() => handleToggle(p.id)}
                    >
                      {isLinked ? (
                        <><Unlink size={14} /> Disconnect</>
                      ) : (
                        <><ExternalLink size={14} /> Connect {p.name}</>
                      )}
                    </button>
                  </motion.div>
                );
              })}
            </div>

            {linked.length > 0 && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5 }} style={{ marginTop: 32, textAlign: "center" }}>
                <div style={{ fontSize: 14, color: "var(--vx-text-muted)", marginBottom: 16 }}>
                  <Sparkles size={14} style={{ display: "inline", marginRight: 6 }} />
                  {linked.length} account{linked.length > 1 ? "s" : ""} connected — you're ready to create and publish!
                </div>
                <div style={{ display: "flex", gap: 12, justifyContent: "center" }}>
                  <button onClick={() => navigate("/create-post")} style={{ padding: "12px 24px", background: "linear-gradient(135deg,#a78bfa,#38bdf8)", border: "none", borderRadius: 14, color: "#fff", fontWeight: 700, fontSize: 14, cursor: "pointer" }}>
                    Create a Post
                  </button>
                  <button onClick={() => navigate("/upload")} style={{ padding: "12px 24px", background: "rgba(255,255,255,0.04)", border: "1px solid var(--vx-border)", borderRadius: 14, color: "var(--vx-text-primary)", fontWeight: 700, fontSize: 14, cursor: "pointer" }}>
                    Upload Campaign
                  </button>
                </div>
              </motion.div>
            )}
          </div>
        </div>
      </div>
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </>
  );
}
