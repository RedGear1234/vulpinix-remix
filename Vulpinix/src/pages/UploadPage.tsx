import { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router";
import { toast } from "sonner";
import { motion } from "framer-motion";
import { Lock, Share2 } from "lucide-react";
import { getLinkedAccounts } from "./SocialAccountsPage";

const UPLOAD_STYLES = `
  .vxup-page  { background: var(--vx-bg-primary); min-height: 100vh; position: relative; z-index: 1; font-family: var(--inter,'Inter',sans-serif); }
  .vxup-inner { position: relative; z-index: 10; max-width: 1280px; margin: 0 auto; padding: 60px 24px 100px; }
  .vxup-heading { margin-bottom: 60px; }
  .vxup-cols  { display: grid; grid-template-columns: repeat(auto-fit, minmax(400px, 1fr)); gap: 40px; }
  .vxup-col   { display: flex; flex-direction: column; gap: 24px; }
  .vxup-card  { background: var(--vx-bg-card); border: 1px solid var(--vx-border); border-radius: 24px; padding: 32px; box-shadow: var(--vx-shadow-card); }
  .vxup-sched { display: flex; gap: 16px; margin-bottom: 24px; align-items: center; }
  .vxup-acts  { display: flex; gap: 16px; }
  .vxup-stats { display: flex; align-items: center; justify-content: space-around; background: var(--vx-bg-input); border: 1px solid var(--vx-border); border-radius: 20px; padding: 20px; }

  /* ── Tablet (768–1024px) ── */
  @media (min-width: 768px) and (max-width: 1024px) {
    .vxup-cols { grid-template-columns: 1fr; gap: 28px; }
    .vxup-card { padding: 24px; }
  }

  /* ── Mobile + Tablet (≤ 767px) ── */
  @media (max-width: 767px) {
    .vxup-inner   { padding: 72px 16px 80px; }
    .vxup-heading { margin-bottom: 36px; }
    .vxup-cols    { grid-template-columns: 1fr !important; gap: 20px; }
    .vxup-card    { padding: 20px 16px; border-radius: 20px; }
    .vxup-sched   { flex-wrap: wrap; gap: 12px; }
    .vxup-acts    { flex-direction: column; }
    .vxup-stats   { padding: 14px; gap: 8px; }
  }

  /* ── XS — Small phones (≤ 480px) ── */
  @media (max-width: 480px) {
    .vxup-inner   { padding: 80px 12px 72px; }
    .vxup-heading { margin-bottom: 24px; }
    .vxup-card    { padding: 16px 14px; border-radius: 16px; }
    .vxup-sched   { flex-direction: column; }
    .vxup-stats   { padding: 12px 10px; }
  }
`;

interface UploadedFile {
  file: File;
  preview?: string;
}

interface AIAnalysis {
  caption: string;
  hashtags: string[];
  platforms: string[];
}

interface Platform {
  id: string;
  name: string;
  enabled: boolean;
  recommendedTime: string;
  color: string;
  symbol: string;
}

const ALLOWED_IMAGE_TYPES = ['image/jpeg','image/jpg','image/png','image/gif','image/webp','image/heic','image/heif'];
const ALLOWED_VIDEO_TYPES = ['video/mp4','video/quicktime','video/x-msvideo','video/webm','video/x-matroska','video/x-flv','video/x-ms-wmv'];
const ALLOWED_FILE_TYPES  = [...ALLOWED_IMAGE_TYPES, ...ALLOWED_VIDEO_TYPES];
const ALLOWED_EXTENSIONS  = '.jpg,.jpeg,.png,.gif,.webp,.heic,.heif,.mp4,.mov,.avi,.webm,.mkv,.flv,.wmv';

export default function UploadPage() {
  const navigate = useNavigate();
  const [dragActive, setDragActive]     = useState(false);
  const [uploadedFile, setUploadedFile] = useState<UploadedFile | null>(null);

  const [progress, setProgress]         = useState(0);
  const [generatingCaption, setGeneratingCaption] = useState(false);
  const [scheduleDate, setScheduleDate] = useState("");
  const [scheduleTime, setScheduleTime] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Auth guard
  useEffect(() => {
    const userInfoStr = localStorage.getItem("userInfo");
    const isAuthenticated = localStorage.getItem("isAuthenticated");
    if (!userInfoStr || isAuthenticated !== "true") {
      navigate("/auth", { replace: true });
    } else {
      try {
        const u = JSON.parse(userInfoStr);
        if (!u.onboardingCompleted) {
          navigate("/onboarding", { replace: true });
        }
      } catch (e) {
        console.error("Auth guard error:", e);
      }
    }
  }, [navigate]);

  const [linkedAccounts, setLinkedAccounts] = useState<string[]>([]);
  useEffect(() => {
    setLinkedAccounts(getLinkedAccounts());
  }, []);

  const [aiAnalysis, setAiAnalysis] = useState<AIAnalysis>({
    caption: "",
    hashtags: [],
    platforms: ["Instagram", "LinkedIn", "Facebook", "Pinterest"],
  });

  const [platforms, setPlatforms] = useState<Platform[]>([
    { id: "instagram", name: "Instagram", enabled: true,  recommendedTime: "6:00 PM", color: "linear-gradient(135deg,#833ab4,#fd1d1d,#fcb045)", symbol: "IG" },
    { id: "facebook",  name: "Facebook",  enabled: true,  recommendedTime: "1:00 PM", color: "#1877f2",                                             symbol: "FB" },
    { id: "youtube",   name: "YouTube",   enabled: false, recommendedTime: "3:00 PM", color: "#ff0000",                                             symbol: "YT" },
    { id: "linkedin",  name: "LinkedIn",  enabled: true,  recommendedTime: "8:00 AM", color: "#0077b5",                                             symbol: "in" },
    { id: "twitter",   name: "X",         enabled: false, recommendedTime: "12:00 PM",color: "#1d9bf0",                                             symbol: "𝕏"  },
    { id: "pinterest", name: "Pinterest", enabled: false, recommendedTime: "2:00 PM", color: "#e60023",                                             symbol: "P"  },
  ]);

  // ── Reach counter ─────────────────────────────────────────────────────────
  const [reachNum, setReachNum] = useState(0);
  const estimatedReach = platforms.filter(p => p.enabled).length * 2500;
  useEffect(() => {
    let current = 0;
    const timer = setInterval(() => {
      current += Math.ceil(estimatedReach / 60);
      if (current >= estimatedReach) { current = estimatedReach; clearInterval(timer); }
      setReachNum(current);
    }, 30);
    return () => clearInterval(timer);
  }, [estimatedReach]);

  // ── Scroll progress bar ───────────────────────────────────────────────────
  useEffect(() => {
    const handleScroll = () => {
      const el = document.getElementById("vx-upload-progress");
      if (!el) return;
      const s = document.documentElement;
      if (s.scrollHeight - s.clientHeight > 0)
        el.style.width = `${(s.scrollTop / (s.scrollHeight - s.clientHeight)) * 100}%`;
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // ── File handling ─────────────────────────────────────────────────────────
  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault(); e.stopPropagation();
    setDragActive(e.type === "dragenter" || e.type === "dragover");
  };
  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault(); e.stopPropagation(); setDragActive(false);
    if (e.dataTransfer.files?.[0]) handleFile(e.dataTransfer.files[0]);
  };
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();
    if (e.target.files?.[0]) handleFile(e.target.files[0]);
    e.target.value = "";
  };
  const handleFile = (file: File) => {
    const isYoutubeEnabled = platforms.find(p => p.id === "youtube")?.enabled;
    const currentAllowedTypes = isYoutubeEnabled ? ALLOWED_FILE_TYPES : ALLOWED_IMAGE_TYPES;
    if (!currentAllowedTypes.includes(file.type.toLowerCase())) { 
      toast.error(isYoutubeEnabled ? "Invalid file type" : "Invalid file type. Please select YouTube to upload videos."); 
      return; 
    }
    const preview = URL.createObjectURL(file);
    setUploadedFile({ file, preview });
    startAnalysis();
    // Persist as base64 for admin preview
    const reader = new FileReader();
    reader.onload = (ev) => {
      const base64 = ev.target?.result as string;
      if (base64) {
        try { localStorage.setItem("adPreviewImage", base64); }
        catch { console.warn("Could not save preview to localStorage (file too large)."); }
      }
    };
    reader.readAsDataURL(file);
  };

  const startAnalysis = () => {
    setProgress(0);
    const interval = setInterval(() => {
      setProgress(prev => {
        if (prev >= 100) { clearInterval(interval); return 100; }
        return prev + 10;
      });
    }, 200);
  };

  const removeFile = () => {
    setUploadedFile(null);
    setProgress(0);
  };

  // ── AI Caption ────────────────────────────────────────────────────────────
  const generateWithAI = async () => {
    if (!uploadedFile) { toast.error("Upload a file first"); return; }
    setGeneratingCaption(true);
    toast.info("Generating captions…");
    try {
      await new Promise(r => setTimeout(r, 2000));
      setAiAnalysis({
        caption: "Elevate your marketing game with AI-powered solutions! 🌟 Transform your strategy. 🚀",
        hashtags: ["#DigitalMarketing", "#AIAutomation", "#VulpinixAI"],
        platforms: platforms.filter(p => p.enabled).map(p => p.name),
      });
      toast.success("AI captions generated!");
    } catch { toast.error("Failed to generate AI captions."); }
    setGeneratingCaption(false);
  };

  const togglePlatform = (id: string) => {
    setPlatforms(platforms.map(p => p.id === id ? { ...p, enabled: !p.enabled } : p));
    
    // If user is disabling YouTube, check if a video is currently uploaded and remove it
    if (id === "youtube") {
      const isDisabling = platforms.find(p => p.id === "youtube")?.enabled === true;
      if (isDisabling && uploadedFile?.file.type.startsWith("video/")) {
        setUploadedFile(null);
        setProgress(0);
        toast.info("Video removed because YouTube was deselected.");
      }
    }
  };

  // ── Launch ────────────────────────────────────────────────────────────────
  const handleLaunch = () => {
    if (!uploadedFile) { toast.error("Please upload a file first"); return; }
    localStorage.setItem("adCreativeData", JSON.stringify({
      caption:   aiAnalysis.caption,
      hashtags:  aiAnalysis.hashtags,
      platforms: platforms.filter(p => p.enabled).map(p => p.name),
    }));
    navigate("/create-ad");
  };


  const isImage = uploadedFile?.file.type.startsWith("image/");

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.5, ease: "easeInOut" }}
      className="vxup-page"
    >
      <style dangerouslySetInnerHTML={{ __html: UPLOAD_STYLES }} />
      <div className="vxup-inner">
        
        {/* Back Button */}
        <button
          onClick={() => navigate("/")}
          style={{
            display: "inline-flex", alignItems: "center", gap: 8, background: "none", border: "none",
            color: "var(--vx-text-muted)", fontSize: 14, fontWeight: 600, cursor: "pointer",
            marginBottom: 40, transition: "color 0.2s"
          }}
          onMouseEnter={e => e.currentTarget.style.color = "var(--vx-text-primary)"}
          onMouseLeave={e => e.currentTarget.style.color = "var(--vx-text-muted)"}
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M19 12H5M12 5l-7 7 7 7"/></svg>
          Back to Dashboard
        </button>

        <div className="vx-reveal vxup-heading" style={{ textAlign: "left" }}>
          <h1 style={{ fontSize: "clamp(2rem, 4vw, 3rem)", fontWeight: 800, color: "var(--vx-text-primary)", marginBottom: 12, letterSpacing: "-0.02em" }}>
            Upload & Publish Content
          </h1>
          <p style={{ fontSize: "1.1rem", color: "var(--vx-text-secondary)", maxWidth: 600, lineHeight: 1.6 }}>
            AI-powered distribution across all your connected platforms.
          </p>
        </div>

        {linkedAccounts.length === 0 ? (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} style={{ textAlign: "center", padding: "80px 40px", background: "var(--vx-bg-card)", border: "1px solid var(--vx-border)", borderRadius: 24, maxWidth: 600, margin: "0 auto" }}>
            <div style={{ width: 72, height: 72, borderRadius: 20, background: "rgba(234,179,8,0.1)", border: "1px solid rgba(234,179,8,0.2)", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 24px" }}>
              <Lock size={32} color="#eab308" />
            </div>
            <div style={{ fontSize: 22, fontWeight: 800, marginBottom: 12, color: "var(--vx-text-primary)" }}>No Social Accounts Linked</div>
            <div style={{ color: "var(--vx-text-muted)", fontSize: 15, margin: "0 auto 32px", lineHeight: 1.6 }}>
              You need to connect at least one social media account before you can upload and publish campaigns.
            </div>
            <button
              onClick={() => navigate("/social")}
              style={{ padding: "14px 28px", background: "linear-gradient(135deg,#a78bfa,#38bdf8)", border: "none", borderRadius: 14, color: "#fff", fontWeight: 700, fontSize: 15, cursor: "pointer", display: "inline-flex", alignItems: "center", gap: 10 }}
            >
              <Share2 size={16} /> Connect Social Accounts
            </button>
          </motion.div>
        ) : (
          <>
            {/* Two Column Grid */}
            <div className="vxup-cols">
          {/* LEFT: MEDIA STUDIO */}
          <div className="vxup-col">
            <div className="vxup-card">
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 24 }}>
                <h3 style={{ fontSize: 18, fontWeight: 700, color: "var(--vx-text-primary)" }}>Media</h3>
                <span style={{ padding: "4px 12px", borderRadius: 20, background: "rgba(6, 214, 199, 0.1)", border: "1px solid rgba(6, 214, 199, 0.2)", color: "#06d6c7", fontSize: 11, fontWeight: 700 }}>AI Ready</span>
              </div>
              
              {uploadedFile ? (
                <div style={{ position: "relative", width: "100%", borderRadius: 16, overflow: "hidden", border: "1px solid var(--vx-border)" }}>
                  {isImage
                    ? <img src={uploadedFile.preview} alt="preview" style={{ width: "100%", maxHeight: 340, objectFit: "cover", display: "block" }} />
                    : <video src={uploadedFile.preview} style={{ width: "100%", maxHeight: 340, objectFit: "cover", display: "block" }} muted loop autoPlay playsInline />
                  }
                  <div style={{ position: "absolute", bottom: 0, left: 0, right: 0, padding: "16px", background: "linear-gradient(transparent, var(--vx-bg-primary))", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                    <span style={{ padding: "4px 12px", borderRadius: 20, background: "var(--vx-bg-input)", border: "1px solid var(--vx-border)", fontSize: 11, fontWeight: 600, color: "var(--vx-text-primary)" }}>
                      {isImage ? "Image" : "Video"} · {(uploadedFile.file.size / 1024 / 1024).toFixed(1)} MB
                    </span>
                    <button onClick={removeFile} style={{ padding: "6px 12px", borderRadius: 12, background: "rgba(239, 68, 68, 0.1)", border: "1px solid rgba(239, 68, 68, 0.2)", color: "#ef4444", fontSize: 12, fontWeight: 600, cursor: "pointer" }}>Remove</button>
                  </div>
                  {progress < 100 && (
                    <div style={{ position: "absolute", bottom: 0, left: 0, right: 0, height: 4, background: "var(--vx-bg-input)" }}>
                      <div style={{ height: "100%", background: "linear-gradient(90deg, #a78bfa, #38bdf8)", width: `${progress}%`, transition: "width 0.3s" }} />
                    </div>
                  )}
                </div>
              ) : (
                <div
                  onDragEnter={handleDrag} onDragLeave={handleDrag} onDragOver={handleDrag} onDrop={handleDrop} onClick={() => fileInputRef.current?.click()}
                  style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 16, padding: "60px 24px", border: `2px dashed ${dragActive ? "#a78bfa" : "var(--vx-border-focus)"}`, borderRadius: 16, background: dragActive ? "rgba(167, 139, 250, 0.05)" : "var(--vx-bg-input)", cursor: "pointer", transition: "all 0.3s ease", textAlign: "center", boxShadow: dragActive ? "0 0 20px rgba(167, 139, 250, 0.15)" : "none" }}
                >
                  <div style={{ width: 64, height: 64, borderRadius: "50%", background: "var(--vx-bg-card)", border: "1px solid var(--vx-border)", display: "flex", alignItems: "center", justifyContent: "center", color: "var(--vx-text-primary)" }}>
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4"/><polyline points="17 8 12 3 7 8"/><line x1="12" y1="3" x2="12" y2="15"/></svg>
                  </div>
                  <div>
                    <div style={{ fontSize: 16, fontWeight: 700, color: "var(--vx-text-primary)", marginBottom: 4 }}>
                      {platforms.find(p => p.id === "youtube")?.enabled ? "Drop your photos or videos here" : "Drop your photos here"}
                    </div>
                    <div style={{ fontSize: 13, color: "var(--vx-text-muted)" }}>
                      {platforms.find(p => p.id === "youtube")?.enabled ? "PNG, JPG, GIF, MP4 up to 50MB" : "PNG, JPG, GIF up to 50MB"}
                    </div>
                  </div>
                </div>
              )}
              <input ref={fileInputRef} type="file" style={{ display: "none" }} onChange={handleChange} accept={platforms.find(p => p.id === "youtube")?.enabled ? ALLOWED_EXTENSIONS : '.jpg,.jpeg,.png,.gif,.webp,.heic,.heif'} />
            </div>

            {/* Stats Strip */}
            <div className="vxup-stats">
              <div style={{ textAlign: "center" }}>
                <div style={{ fontSize: 24, fontWeight: 800, color: "#06d6c7", lineHeight: 1 }}>{reachNum.toLocaleString()}</div>
                <div style={{ fontSize: 11, fontWeight: 600, color: "var(--vx-text-muted)", marginTop: 6, textTransform: "uppercase", letterSpacing: "0.05em" }}>Est. Reach</div>
              </div>
              <div style={{ width: 1, height: 40, background: "var(--vx-border)" }} />
              <div style={{ textAlign: "center" }}>
                <div style={{ fontSize: 24, fontWeight: 800, color: "var(--vx-text-primary)", lineHeight: 1 }}>94<span style={{ fontSize: 14, color: "var(--vx-text-muted)" }}>/100</span></div>
                <div style={{ fontSize: 11, fontWeight: 600, color: "var(--vx-text-muted)", marginTop: 6, textTransform: "uppercase", letterSpacing: "0.05em" }}>AI Score</div>
              </div>
            </div>
          </div>

          {/* RIGHT: WORKFLOW CARDS */}
          <div className="vxup-col">
            
            {/* AI Caption */}
            <div className="vxup-card">
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 20 }}>
                <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                  <div style={{ width: 36, height: 36, borderRadius: 10, background: "rgba(167, 139, 250, 0.15)", border: "1px solid rgba(167, 139, 250, 0.3)", display: "flex", alignItems: "center", justifyContent: "center", color: "#a78bfa" }}>
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/></svg>
                  </div>
                  <div>
                    <h3 style={{ fontSize: 16, fontWeight: 700, color: "var(--vx-text-primary)" }}>AI Caption</h3>
                    <div style={{ fontSize: 12, color: "var(--vx-text-muted)", marginTop: 2 }}>Generate engaging copy automatically</div>
                  </div>
                </div>
                <button
                  onClick={generateWithAI} disabled={generatingCaption || !uploadedFile}
                  style={{ padding: "8px 16px", borderRadius: 12, background: "linear-gradient(135deg, #a78bfa, #38bdf8)", color: "#fff", fontSize: 13, fontWeight: 700, border: "none", cursor: (generatingCaption || !uploadedFile) ? "not-allowed" : "pointer", opacity: (generatingCaption || !uploadedFile) ? 0.5 : 1, transition: "transform 0.2s" }}
                  onMouseEnter={e => e.currentTarget.style.transform = "translateY(-1px)"}
                  onMouseLeave={e => e.currentTarget.style.transform = "translateY(0)"}
                >
                  {generatingCaption ? "Generating..." : "✦ Generate"}
                </button>
              </div>
              <textarea
                style={{ width: "100%", padding: "16px", borderRadius: 16, background: "var(--vx-bg-input)", border: "1px solid var(--vx-border)", color: "var(--vx-text-primary)", fontSize: 14, resize: "none", minHeight: 100, marginBottom: 16, fontFamily: "inherit" }}
                placeholder="Your AI-generated caption will appear here..."
                value={aiAnalysis.caption}
                onChange={e => setAiAnalysis({ ...aiAnalysis, caption: e.target.value })}
              />
              <div style={{ display: "flex", alignItems: "center", gap: 12, background: "var(--vx-bg-input)", border: "1px solid var(--vx-border)", borderRadius: 16, padding: "12px 16px" }}>
                <span style={{ color: "var(--vx-text-muted)", fontWeight: 700 }}>#</span>
                <input
                  style={{ flex: 1, background: "transparent", border: "none", outline: "none", color: "var(--vx-text-primary)", fontSize: 13 }}
                  placeholder="Add hashtags (space separated)"
                  value={aiAnalysis.hashtags.join(" ")}
                  onChange={e => setAiAnalysis({ ...aiAnalysis, hashtags: e.target.value.split(" ").filter(v => v) })}
                />
              </div>
            </div>

            {/* Distribution */}
            <div className="vxup-card">
              <div style={{ marginBottom: 20, display: "flex", alignItems: "center", gap: 12 }}>
                <div style={{ width: 36, height: 36, borderRadius: 10, background: "rgba(56, 189, 248, 0.15)", border: "1px solid rgba(56, 189, 248, 0.3)", display: "flex", alignItems: "center", justifyContent: "center", color: "#38bdf8" }}>
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="18" cy="5" r="3"/><circle cx="6" cy="12" r="3"/><circle cx="18" cy="19" r="3"/><line x1="8.59" y1="13.51" x2="15.42" y2="17.49"/><line x1="15.41" y1="6.51" x2="8.59" y2="10.49"/></svg>
                </div>
                <div>
                  <h3 style={{ fontSize: 16, fontWeight: 700, color: "var(--vx-text-primary)" }}>Distribution</h3>
                  <div style={{ fontSize: 12, color: "var(--vx-text-muted)", marginTop: 2 }}>Select platforms to publish</div>
                </div>
              </div>
              <div style={{ display: "flex", flexWrap: "wrap", gap: 12 }}>
                {platforms.filter(p => linkedAccounts.includes(p.id)).map(plat => (
                  <button
                    key={plat.id}
                    onClick={() => togglePlatform(plat.id)}
                    style={{ display: "flex", alignItems: "center", gap: 8, padding: "10px 16px", borderRadius: 16, background: plat.enabled ? "var(--vx-bg-card-hover)" : "var(--vx-bg-input)", border: plat.enabled ? `1px solid ${typeof plat.color === "string" && plat.color.startsWith("linear") ? "#a855f7" : plat.color}` : "1px solid var(--vx-border)", color: plat.enabled ? "var(--vx-text-primary)" : "var(--vx-text-muted)", fontSize: 13, fontWeight: 600, cursor: "pointer", transition: "all 0.2s" }}
                  >
                    <span style={{ width: 8, height: 8, borderRadius: "50%", background: plat.enabled ? (typeof plat.color === "string" && plat.color.startsWith("linear") ? "linear-gradient(135deg, #a78bfa, #f472b6)" : plat.color) : "transparent", border: plat.enabled ? "none" : "1px solid var(--vx-border)" }} />
                    {plat.name}
                  </button>
                ))}
              </div>
            </div>

            {/* Schedule & Launch */}
            <div className="vxup-card">
              <div className="vxup-sched">
                <div style={{ width: 36, height: 36, borderRadius: 10, background: "rgba(244, 114, 182, 0.15)", border: "1px solid rgba(244, 114, 182, 0.3)", display: "flex", alignItems: "center", justifyContent: "center", color: "#f472b6", flexShrink: 0 }}>
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>
                </div>
                <div style={{ flex: 1 }}>
                  <label style={{ display: "block", fontSize: 11, fontWeight: 700, color: "var(--vx-text-muted)", textTransform: "uppercase", marginBottom: 8 }}>Date</label>
                  <input type="date" value={scheduleDate} onChange={e => setScheduleDate(e.target.value)} style={{ width: "100%", padding: "12px 16px", borderRadius: 12, background: "var(--vx-bg-input)", border: "1px solid var(--vx-border)", color: "var(--vx-text-primary)", fontSize: 14 }} />
                </div>
                <div style={{ flex: 1 }}>
                  <label style={{ display: "block", fontSize: 11, fontWeight: 700, color: "var(--vx-text-muted)", textTransform: "uppercase", marginBottom: 8 }}>Time</label>
                  <input type="time" value={scheduleTime} onChange={e => setScheduleTime(e.target.value)} style={{ width: "100%", padding: "12px 16px", borderRadius: 12, background: "var(--vx-bg-input)", border: "1px solid var(--vx-border)", color: "var(--vx-text-primary)", fontSize: 14 }} />
                </div>
              </div>
              <div className="vxup-acts">
                <button style={{ flex: 1, padding: "14px", borderRadius: 16, background: "var(--vx-bg-input)", border: "1px solid var(--vx-border)", color: "var(--vx-text-primary)", fontSize: 14, fontWeight: 700, cursor: "pointer", transition: "background 0.2s" }} onMouseEnter={e => e.currentTarget.style.background = "var(--vx-bg-card-hover)"} onMouseLeave={e => e.currentTarget.style.background = "var(--vx-bg-input)"}>Schedule</button>
                <button onClick={handleLaunch} style={{ flex: 2, padding: "14px", borderRadius: 16, background: "linear-gradient(135deg, #a78bfa, #38bdf8)", color: "#fff", fontSize: 14, fontWeight: 700, border: "none", cursor: "pointer", transition: "transform 0.2s" }} onMouseEnter={e => e.currentTarget.style.transform = "translateY(-1px)"} onMouseLeave={e => e.currentTarget.style.transform = "translateY(0)"}>Publish Now</button>
              </div>
            </div>
            
          </div>
          </div>
          </>
        )}
      </div>
    </motion.div>
  );
}
