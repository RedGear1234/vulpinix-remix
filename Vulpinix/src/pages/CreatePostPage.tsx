import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router";
import { API_BASE } from "../config/api";
import { motion } from "framer-motion";
import {
  Instagram, Facebook, Twitter, Linkedin, Youtube,
  Image as ImageIcon, Video, Smile, Hash, AtSign,
  Globe, Lock, Users, ChevronDown, Send, ArrowLeft,
  X, Sparkles, Clock, CheckCircle2, Share2
} from "lucide-react";
import { DashboardSidebar } from "../components/DashboardSidebar";
import { getLinkedAccounts } from "./SocialAccountsPage";

const PLATFORMS = [
  { id: "instagram", label: "Instagram", icon: <Instagram size={16} />, color: "#E1306C" },
  { id: "facebook",  label: "Facebook",  icon: <Facebook  size={16} />, color: "#1877F2" },
  { id: "twitter",   label: "X / Twitter", icon: <Twitter size={16} />, color: "#1DA1F2" },
  { id: "linkedin",  label: "LinkedIn",  icon: <Linkedin  size={16} />, color: "#0A66C2" },
  { id: "youtube",   label: "YouTube",   icon: <Youtube   size={16} />, color: "#FF0000" },
];

const PRIVACY_OPTIONS = [
  { id: "public",    label: "Public",       icon: <Globe  size={14} /> },
  { id: "followers", label: "Followers only", icon: <Users  size={14} /> },
  { id: "private",   label: "Only me",      icon: <Lock   size={14} /> },
];

const S = `
  .vxcp-shell { display: flex; height: 100vh; background: var(--vx-bg-primary); overflow: hidden; }
  .vxcp-page  { flex: 1; overflow-y: auto; padding: 40px 32px 100px; font-family: 'Inter', sans-serif; color: var(--vx-text-primary); position: relative; }
  .vxcp-inner { max-width: 900px; margin: 0 auto; position: relative; z-index: 10; }
  .vxcp-orb1  { position: fixed; top: -10%; right: -5%; width: 500px; height: 500px; background: radial-gradient(circle, rgba(167,139,250,0.1) 0%, transparent 70%); border-radius: 50%; pointer-events: none; }
  .vxcp-orb2  { position: fixed; bottom: -15%; left: -8%; width: 600px; height: 600px; background: radial-gradient(circle, rgba(56,189,248,0.07) 0%, transparent 70%); border-radius: 50%; pointer-events: none; }

  .vxcp-back  { display: flex; align-items: center; gap: 8px; color: var(--vx-text-muted); font-size: 14px; font-weight: 600; cursor: pointer; margin-bottom: 32px; transition: color 0.2s; width: fit-content; }
  .vxcp-back:hover { color: var(--vx-text-primary); }

  .vxcp-heading { font-size: 28px; font-weight: 900; letter-spacing: -0.02em; margin-bottom: 6px; }
  .vxcp-heading span { background: linear-gradient(135deg, #a78bfa, #38bdf8); -webkit-background-clip: text; -webkit-text-fill-color: transparent; }
  .vxcp-sub   { color: var(--vx-text-muted); font-size: 15px; margin-bottom: 36px; }

  .vxcp-grid  { display: grid; grid-template-columns: 1fr 340px; gap: 24px; }

  .vxcp-card  { background: var(--vx-bg-card); border: 1px solid var(--vx-border); border-radius: 24px; padding: 28px; margin-bottom: 20px; }
  .vxcp-card-title { font-size: 13px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.06em; color: var(--vx-text-muted); margin-bottom: 16px; display: flex; align-items: center; gap: 8px; }

  .vxcp-platform-grid { display: flex; flex-wrap: wrap; gap: 10px; }
  .vxcp-platform-btn  { display: flex; align-items: center; gap: 8px; padding: 8px 14px; border-radius: 10px; border: 1px solid var(--vx-border); background: rgba(255,255,255,0.02); font-size: 13px; font-weight: 600; cursor: pointer; transition: all 0.2s; color: var(--vx-text-muted); }
  .vxcp-platform-btn.selected { background: rgba(167,139,250,0.1); border-color: rgba(167,139,250,0.35); color: var(--vx-text-primary); }
  .vxcp-platform-btn:hover { background: rgba(255,255,255,0.05); color: var(--vx-text-primary); }

  .vxcp-textarea { width: 100%; min-height: 180px; background: rgba(255,255,255,0.02); border: 1px solid var(--vx-border); border-radius: 16px; padding: 16px; font-size: 15px; color: var(--vx-text-primary); resize: vertical; font-family: 'Inter', sans-serif; line-height: 1.6; outline: none; transition: border-color 0.2s; box-sizing: border-box; }
  .vxcp-textarea:focus { border-color: rgba(167,139,250,0.4); }
  .vxcp-textarea::placeholder { color: var(--vx-text-muted); }

  .vxcp-toolbar { display: flex; gap: 8px; margin-top: 12px; }
  .vxcp-tool-btn { width: 36px; height: 36px; border-radius: 10px; border: 1px solid var(--vx-border); background: rgba(255,255,255,0.02); display: flex; align-items: center; justify-content: center; cursor: pointer; color: var(--vx-text-muted); transition: all 0.2s; }
  .vxcp-tool-btn:hover { background: rgba(167,139,250,0.1); border-color: rgba(167,139,250,0.3); color: #a78bfa; }

  .vxcp-char-count { font-size: 12px; color: var(--vx-text-muted); text-align: right; margin-top: 8px; }
  .vxcp-char-count.warn { color: #eab308; }
  .vxcp-char-count.danger { color: #ef4444; }

  .vxcp-media-drop { border: 2px dashed rgba(255,255,255,0.1); border-radius: 16px; padding: 40px 20px; text-align: center; cursor: pointer; transition: all 0.2s; }
  .vxcp-media-drop:hover { border-color: rgba(167,139,250,0.4); background: rgba(167,139,250,0.04); }
  .vxcp-media-thumb { position: relative; border-radius: 12px; overflow: hidden; aspect-ratio: 1; background: rgba(255,255,255,0.03); display: flex; align-items: center; justify-content: center; }
  .vxcp-media-remove { position: absolute; top: 6px; right: 6px; width: 22px; height: 22px; background: rgba(0,0,0,0.7); border-radius: 50%; display: flex; align-items: center; justify-content: center; cursor: pointer; color: #fff; }

  .vxcp-privacy-btn { display: flex; align-items: center; gap: 8px; padding: 10px 14px; border-radius: 10px; border: 1px solid var(--vx-border); background: rgba(255,255,255,0.02); font-size: 13px; font-weight: 600; cursor: pointer; width: 100%; transition: all 0.2s; color: var(--vx-text-primary); }
  .vxcp-privacy-btn:hover { background: rgba(255,255,255,0.05); }
  .vxcp-privacy-menu { border-radius: 12px; border: 1px solid var(--vx-border); background: var(--vx-bg-card); overflow: hidden; margin-top: 6px; }
  .vxcp-privacy-opt  { display: flex; align-items: center; gap: 10px; padding: 10px 14px; font-size: 13px; font-weight: 500; cursor: pointer; transition: background 0.15s; color: var(--vx-text-primary); }
  .vxcp-privacy-opt:hover { background: rgba(255,255,255,0.04); }
  .vxcp-privacy-opt.active { color: #a78bfa; background: rgba(167,139,250,0.08); }

  .vxcp-schedule-row { display: flex; gap: 10px; }
  .vxcp-schedule-input { flex: 1; padding: 10px 14px; background: rgba(255,255,255,0.02); border: 1px solid var(--vx-border); border-radius: 10px; color: var(--vx-text-primary); font-size: 13px; outline: none; font-family: 'Inter', sans-serif; }
  .vxcp-schedule-input:focus { border-color: rgba(167,139,250,0.4); }

  .vxcp-btn-primary { width: 100%; padding: 14px; border-radius: 14px; background: linear-gradient(135deg, #a78bfa, #38bdf8); border: none; color: #fff; font-weight: 700; font-size: 15px; cursor: pointer; display: flex; align-items: center; justify-content: center; gap: 10px; box-shadow: 0 8px 24px rgba(167,139,250,0.25); transition: transform 0.2s, box-shadow 0.2s; margin-bottom: 12px; }
  .vxcp-btn-primary:hover:not(:disabled) { transform: translateY(-2px); box-shadow: 0 12px 32px rgba(167,139,250,0.35); }
  .vxcp-btn-primary:disabled { opacity: 0.5; cursor: not-allowed; }
  .vxcp-btn-secondary { width: 100%; padding: 12px; border-radius: 14px; border: 1px solid var(--vx-border); background: rgba(255,255,255,0.03); color: var(--vx-text-primary); font-weight: 600; font-size: 14px; cursor: pointer; display: flex; align-items: center; justify-content: center; gap: 8px; transition: background 0.2s; }
  .vxcp-btn-secondary:hover { background: rgba(255,255,255,0.07); }

  .vxcp-ai-btn { width: 100%; padding: 10px 14px; border-radius: 10px; border: 1px solid rgba(167,139,250,0.25); background: rgba(167,139,250,0.07); color: #a78bfa; font-weight: 600; font-size: 13px; cursor: pointer; display: flex; align-items: center; justify-content: center; gap: 8px; transition: all 0.2s; margin-bottom: 20px; }
  .vxcp-ai-btn:hover { background: rgba(167,139,250,0.14); }

  .vxcp-success { position: fixed; inset: 0; background: rgba(0,0,0,0.8); backdrop-filter: blur(10px); display: flex; align-items: center; justify-content: center; z-index: 200; }
  .vxcp-success-card { background: var(--vx-bg-card); border: 1px solid rgba(34,197,94,0.3); border-radius: 24px; padding: 48px 40px; text-align: center; max-width: 400px; }

  @media (max-width: 900px) { .vxcp-grid { grid-template-columns: 1fr; } }
`;

export default function CreatePostPage() {
  const navigate = useNavigate();
  const fileRef = useRef<HTMLInputElement>(null);
  const [userName, setUserName] = useState("there");
  const [caption, setCaption] = useState("");
  const [selectedPlatforms, setSelectedPlatforms] = useState<string[]>([]);
  const [privacy, setPrivacy] = useState("public");
  const [showPrivacyMenu, setShowPrivacyMenu] = useState(false);
  const [mediaFiles, setMediaFiles] = useState<string[]>([]);
  const [scheduleDate, setScheduleDate] = useState("");
  const [scheduleTime, setScheduleTime] = useState("");
  const [posting, setPosting] = useState(false);
  const [posted, setPosted] = useState(false);

  const [linkedAccounts, setLinkedAccounts] = useState<string[]>([]);

  useEffect(() => {
    if (localStorage.getItem("isAuthenticated") !== "true") {
      navigate("/auth", { replace: true }); return;
    }
    try {
      const u = JSON.parse(localStorage.getItem("userInfo") || "{}");
      if (u.name) setUserName(u.name.split(" ")[0]);
    } catch {}
    const accounts = getLinkedAccounts();
    setLinkedAccounts(accounts);
    // Don't auto-select any platform — let the user explicitly choose where to post
    setSelectedPlatforms([]);
  }, [navigate]);

  const togglePlatform = (id: string) => {
    setSelectedPlatforms(prev =>
      prev.includes(id) ? prev.filter(p => p !== id) : [...prev, id]
    );
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    files.forEach(file => {
      const reader = new FileReader();
      reader.onload = ev => {
        if (ev.target?.result) setMediaFiles(prev => [...prev, ev.target!.result as string]);
      };
      reader.readAsDataURL(file);
    });
  };

  const handlePost = async () => {
    if (!caption.trim() || selectedPlatforms.length === 0) return;
    setPosting(true);
    
    try {
      let userEmail = "";
      let userNameFull = "";
      try {
        const u = JSON.parse(localStorage.getItem("userInfo") || "{}");
        if (u.email) userEmail = u.email;
        if (u.name) userNameFull = u.name;
      } catch {}

      const authToken = localStorage.getItem("authToken");

      console.log("🚀 SENDING CAMPAIGN:", {
        platforms: selectedPlatforms,
        caption: caption.substring(0, 20) + "..."
      });

      const response = await fetch(`${API_BASE}/api/campaign/create`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...(authToken ? { "Authorization": `Bearer ${authToken}` } : {})
        },
        body: JSON.stringify({
          userId: userEmail,                                // Match dashboard query key
          userName: userNameFull,
          userEmail: userEmail,
          campaignName: caption.substring(0, 40) || "Post", // Required by backend
          budget: "0",                                      // Required by backend
          platforms: selectedPlatforms,
          adCaption: caption,
          adImage: mediaFiles.length > 0 ? mediaFiles[0] : "", // Pass base64 image
        })
      });

      const data = await response.json();
      if (data.success) {
        // Store the auth token so the dashboard can fetch this campaign
        if (data.token && !authToken) {
          localStorage.setItem("authToken", data.token);
        }
      } else {
        console.error("Failed to post:", data.message);
      }
    } catch (err) {
      console.error("Error creating post:", err);
    }

    setPosting(false);
    setPosted(true);
  };

  const charLimit = 2200;
  const charCount = caption.length;
  const charClass = charCount > charLimit ? "danger" : charCount > charLimit * 0.9 ? "warn" : "";

  const selectedPrivacy = PRIVACY_OPTIONS.find(p => p.id === privacy)!;

  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: S }} />
      <div className="vxcp-shell">
        <DashboardSidebar userName={userName} userInitial={userName[0]?.toUpperCase() || "U"} />
        <div className="vxcp-page">
          <div className="vxcp-orb1" /><div className="vxcp-orb2" />
          <div className="vxcp-inner">

            <div className="vxcp-back" onClick={() => navigate("/dashboard")}>
              <ArrowLeft size={16} /> Back to Dashboard
            </div>

            <motion.div initial={{ opacity: 0, y: -16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}>
              <div className="vxcp-heading">Create a <span>Post</span></div>
              <div className="vxcp-sub">Share a single post directly from your account, {userName}.</div>
            </motion.div>

            {linkedAccounts.length === 0 ? (
              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} style={{ textAlign: "center", padding: "80px 40px", background: "var(--vx-bg-card)", border: "1px solid var(--vx-border)", borderRadius: 24 }}>
                <div style={{ width: 72, height: 72, borderRadius: 20, background: "rgba(234,179,8,0.1)", border: "1px solid rgba(234,179,8,0.2)", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 24px" }}>
                  <Lock size={32} color="#eab308" />
                </div>
                <div style={{ fontSize: 22, fontWeight: 800, marginBottom: 12 }}>No Social Accounts Linked</div>
                <div style={{ color: "var(--vx-text-muted)", fontSize: 15, maxWidth: 420, margin: "0 auto 32px", lineHeight: 1.6 }}>
                  You need to connect at least one social media account before you can create and publish posts.
                </div>
                <button
                  onClick={() => navigate("/social")}
                  style={{ padding: "14px 28px", background: "linear-gradient(135deg,#a78bfa,#38bdf8)", border: "none", borderRadius: 14, color: "#fff", fontWeight: 700, fontSize: 15, cursor: "pointer", display: "inline-flex", alignItems: "center", gap: 10 }}
                >
                  <Share2 size={16} /> Connect Social Accounts
                </button>
              </motion.div>
            ) : (
              <div className="vxcp-grid">
                <div>
                {/* Platform selector */}
                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="vxcp-card">
                  <div className="vxcp-card-title">Post to <span style={{color:"#22c55e",fontSize:11}}> ({linkedAccounts.length} connected)</span></div>
                  <div className="vxcp-platform-grid">
                    {PLATFORMS.filter(p => linkedAccounts.includes(p.id)).map(p => (
                      <button
                        key={p.id}
                        className={`vxcp-platform-btn ${selectedPlatforms.includes(p.id) ? "selected" : ""}`}
                        onClick={() => togglePlatform(p.id)}
                      >
                        <span style={{ color: selectedPlatforms.includes(p.id) ? p.color : "inherit" }}>{p.icon}</span>
                        {p.label}
                        {selectedPlatforms.includes(p.id) && <span style={{ fontSize: 10, color: p.color, marginLeft: 2 }}>✓</span>}
                      </button>
                    ))}
                  </div>
                  {selectedPlatforms.length === 0 && (
                    <div style={{ marginTop: 12, fontSize: 12, color: "#eab308", display: "flex", alignItems: "center", gap: 6 }}>
                      ⚠️ Select at least one platform to publish to.
                    </div>
                  )}
                </motion.div>

                {/* Caption */}
                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }} className="vxcp-card">
                  <div className="vxcp-card-title">Caption</div>
                  <textarea
                    className="vxcp-textarea"
                    placeholder="What's on your mind? Write your post caption here…"
                    value={caption}
                    onChange={e => setCaption(e.target.value)}
                    maxLength={charLimit + 100}
                  />
                  <div className="vxcp-toolbar">
                    <div className="vxcp-tool-btn" onClick={() => fileRef.current?.click()} title="Add media">
                      <ImageIcon size={16} />
                    </div>
                    <div className="vxcp-tool-btn" onClick={() => fileRef.current?.click()} title="Add video">
                      <Video size={16} />
                    </div>
                    <div className="vxcp-tool-btn" title="Add emoji"><Smile size={16} /></div>
                    <div className="vxcp-tool-btn" title="Add hashtag" onClick={() => setCaption(c => c + " #")}><Hash size={16} /></div>
                    <div className="vxcp-tool-btn" title="Mention someone" onClick={() => setCaption(c => c + " @")}><AtSign size={16} /></div>
                  </div>
                  <div className={`vxcp-char-count ${charClass}`}>{charCount} / {charLimit}</div>
                </motion.div>

                {/* Media */}
                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="vxcp-card">
                  <div className="vxcp-card-title"><ImageIcon size={14} /> Media</div>
                  <input ref={fileRef} type="file" accept="image/*,video/*" multiple style={{ display: "none" }} onChange={handleFileChange} />
                  {mediaFiles.length === 0 ? (
                    <div className="vxcp-media-drop" onClick={() => fileRef.current?.click()}>
                      <ImageIcon size={32} style={{ margin: "0 auto 12px", opacity: 0.25 }} />
                      <div style={{ fontSize: 14, fontWeight: 600, marginBottom: 4 }}>Click to upload photos or videos</div>
                      <div style={{ fontSize: 12, color: "var(--vx-text-muted)" }}>PNG, JPG, GIF, MP4 up to 50MB</div>
                    </div>
                  ) : (
                    <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 10 }}>
                      {mediaFiles.map((src, i) => (
                        <div key={i} className="vxcp-media-thumb">
                          <img src={src} alt="" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                          <div className="vxcp-media-remove" onClick={() => setMediaFiles(f => f.filter((_, j) => j !== i))}>
                            <X size={12} />
                          </div>
                        </div>
                      ))}
                      <div className="vxcp-media-thumb" style={{ cursor: "pointer" }} onClick={() => fileRef.current?.click()}>
                        <ImageIcon size={24} style={{ opacity: 0.25 }} />
                      </div>
                    </div>
                  )}
                </motion.div>
              </div>

              {/* RIGHT: Settings & Post */}
              <div>
                {/* AI Assist */}
                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.12 }}>
                  <button className="vxcp-ai-btn" onClick={() => {
                    const suggestions = [
                      "🚀 Excited to share something new today! Stay tuned for what's coming. #Innovation #Launch",
                      "✨ Every great achievement starts with a single step. What's yours today? #Motivation #Growth",
                      "💡 The best time to start was yesterday. The second best time is now. #Entrepreneurship",
                    ];
                    setCaption(suggestions[Math.floor(Math.random() * suggestions.length)]);
                  }}>
                    <Sparkles size={15} /> Generate Caption with AI
                  </button>
                </motion.div>

                {/* Privacy */}
                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.18 }} className="vxcp-card">
                  <div className="vxcp-card-title">Audience</div>
                  <div style={{ position: "relative" }}>
                    <button className="vxcp-privacy-btn" onClick={() => setShowPrivacyMenu(m => !m)}>
                      {selectedPrivacy.icon}
                      {selectedPrivacy.label}
                      <ChevronDown size={14} style={{ marginLeft: "auto", opacity: 0.5 }} />
                    </button>
                    {showPrivacyMenu && (
                      <div className="vxcp-privacy-menu">
                        {PRIVACY_OPTIONS.map(opt => (
                          <div key={opt.id} className={`vxcp-privacy-opt ${privacy === opt.id ? "active" : ""}`} onClick={() => { setPrivacy(opt.id); setShowPrivacyMenu(false); }}>
                            {opt.icon} {opt.label}
                            {privacy === opt.id && <CheckCircle2 size={14} style={{ marginLeft: "auto" }} />}
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </motion.div>

                {/* Schedule */}
                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.22 }} className="vxcp-card">
                  <div className="vxcp-card-title"><Clock size={14} /> Schedule (optional)</div>
                  <div className="vxcp-schedule-row">
                    <input type="date" className="vxcp-schedule-input" value={scheduleDate} onChange={e => setScheduleDate(e.target.value)} />
                    <input type="time" className="vxcp-schedule-input" value={scheduleTime} onChange={e => setScheduleTime(e.target.value)} />
                  </div>
                  {scheduleDate && <div style={{ fontSize: 12, color: "var(--vx-text-muted)", marginTop: 10 }}>Will post on {scheduleDate} at {scheduleTime || "00:00"}</div>}
                </motion.div>

                {/* Publish buttons */}
                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.26 }}>
                  <button
                    className="vxcp-btn-primary"
                    onClick={handlePost}
                    disabled={posting || !caption.trim() || selectedPlatforms.length === 0}
                    title={selectedPlatforms.length === 0 ? "Select at least one platform" : ""}
                  >
                    {posting ? (
                      <><span style={{ width: 16, height: 16, border: "2px solid rgba(255,255,255,0.4)", borderTopColor: "#fff", borderRadius: "50%", animation: "spin 0.7s linear infinite", display: "inline-block" }} /> Posting…</>
                    ) : (
                      <><Send size={16} /> {scheduleDate ? "Schedule Post" : "Publish Now"}</>
                    )}
                  </button>
                  <button className="vxcp-btn-secondary" onClick={() => navigate("/dashboard")}>
                    Cancel
                  </button>
                </motion.div>
              </div>
            </div>
            )}
          </div>
        </div>

        {/* Success overlay */}
        {posted && (
          <div className="vxcp-success" onClick={() => { setPosted(false); navigate("/dashboard"); }}>
            <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="vxcp-success-card">
              <CheckCircle2 size={56} color="#22c55e" style={{ margin: "0 auto 20px" }} />
              <div style={{ fontSize: 22, fontWeight: 800, marginBottom: 8 }}>Post Published! 🎉</div>
              <div style={{ color: "var(--vx-text-muted)", fontSize: 14, marginBottom: 24 }}>
                Your post has been published to {selectedPlatforms.length} platform{selectedPlatforms.length > 1 ? "s" : ""}.
              </div>
              <div style={{ fontSize: 13, color: "var(--vx-text-muted)" }}>Tap anywhere to go back to Dashboard</div>
            </motion.div>
          </div>
        )}
      </div>
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </>
  );
}
