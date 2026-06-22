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
import { DashboardTopBar } from "../components/DashboardTopBar";
import { getLinkedAccounts } from "./SocialAccountsPage";

const PLATFORMS = [
  { id: "instagram", label: "Instagram", icon: <Instagram size={16} />, color: "#E1306C" },
  { id: "facebook",  label: "Facebook",  icon: <Facebook  size={16} />, color: "#1877F2" },
  { id: "twitter",   label: "X / Twitter", icon: <Twitter size={16} />, color: "#1DA1F2" },
  { id: "linkedin",  label: "LinkedIn",  icon: <Linkedin  size={16} />, color: "#0A66C2" },
  { id: "youtube",   label: "YouTube",   icon: <Youtube   size={16} />, color: "#FF0000" },
  { id: "pinterest", label: "Pinterest", icon: (
    <svg width={16} height={16} viewBox="0 0 24 24" fill="currentColor">
      <path d="M12.017 0C5.396 0 .029 5.367.029 11.987c0 5.079 3.158 9.417 7.618 11.162-.105-.949-.199-2.403.041-3.439.219-.937 1.406-5.965 1.406-5.965s-.359-.719-.359-1.782c0-1.668.967-2.914 2.171-2.914 1.023 0 1.518.769 1.518 1.69 0 1.029-.655 2.568-.994 3.995-.283 1.194.599 2.169 1.777 2.169 2.133 0 3.772-2.249 3.772-5.495 0-2.873-2.064-4.882-5.012-4.882-3.414 0-5.418 2.561-5.418 5.207 0 1.031.397 2.138.893 2.738a.36.36 0 0 1 .083.345l-.333 1.36c-.053.22-.174.267-.402.161-1.499-.698-2.436-2.889-2.436-4.649 0-3.785 2.75-7.262 7.929-7.262 4.163 0 7.398 2.967 7.398 6.931 0 4.136-2.607 7.464-6.227 7.464-1.216 0-2.359-.631-2.75-1.378l-.748 2.853c-.271 1.043-1.002 2.35-1.492 3.146 1.124.347 2.317.535 3.554.535 6.607 0 11.985-5.365 11.985-11.987C23.97 5.39 18.592.026 11.985.026L12.017 0z"/>
    </svg>
  ), color: "#BD081C" },
];

const PRIVACY_OPTIONS = [
  { id: "public",    label: "Public",       icon: <Globe  size={14} /> },
  { id: "followers", label: "Followers only", icon: <Users  size={14} /> },
  { id: "private",   label: "Only me",      icon: <Lock   size={14} /> },
];

const S = `
  @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800;900&display=swap');
  .vxcp-shell{display:flex;height:100vh;background:#070b12;overflow:hidden;font-family:'Inter',sans-serif;}
  .vxcp-main{flex:1;display:flex;flex-direction:column;overflow:hidden;}
  .vxcp-scroll{flex:1;overflow-y:auto;overflow-x:hidden;padding:32px 36px 80px;}
  .vxcp-scroll::-webkit-scrollbar{width:6px;}
  .vxcp-scroll::-webkit-scrollbar-thumb{background:rgba(255,255,255,0.08);border-radius:3px;}
  .vxcp-orb1{position:fixed;pointer-events:none;border-radius:50%;z-index:0;width:600px;height:600px;top:-160px;right:-120px;background:radial-gradient(circle,rgba(167,139,250,0.08) 0%,transparent 70%);}
  .vxcp-orb2{position:fixed;pointer-events:none;border-radius:50%;z-index:0;width:500px;height:500px;bottom:-150px;left:-60px;background:radial-gradient(circle,rgba(56,189,248,0.06) 0%,transparent 70%);}
  .vxcp-inner{max-width:1100px;margin:0 auto;position:relative;z-index:1;}
  
  .vxcp-hero{border-radius:26px;padding:30px 40px;margin-bottom:24px;background:linear-gradient(135deg,#0f1628,#111827,#0c1220);border:1px solid rgba(167,139,250,0.14);display:flex;align-items:center;justify-content:space-between;gap:20px;flex-wrap:wrap;position:relative;overflow:hidden;}
  .vxcp-hero-line{position:absolute;top:0;left:0;right:0;height:2px;background:linear-gradient(90deg,#a78bfa,#38bdf8,#a78bfa);background-size:200%;animation:shimmer 3s ease infinite;}
  @keyframes shimmer{0%,100%{background-position:0%}50%{background-position:100%}}
  .vxcp-hero-title{font-size:26px;font-weight:900;letter-spacing:-0.025em;color:#f1f5f9;margin-bottom:5px;}
  .vxcp-hero-title span{background:linear-gradient(135deg,#c4b5fd,#67e8f9);-webkit-background-clip:text;-webkit-text-fill-color:transparent;}
  .vxcp-hero-sub{color:#64748b;font-size:14px;}

  .vxcp-back-btn{display:inline-flex;align-items:center;gap:8px;padding:10px 18px;border-radius:12px;background:rgba(255,255,255,0.04);border:1px solid rgba(255,255,255,0.09);color:#64748b;font-weight:700;font-size:13px;cursor:pointer;transition:all 0.2s;}
  .vxcp-back-btn:hover{background:rgba(255,255,255,0.08);color:#94a3b8;}

  .vxcp-grid{display:grid;grid-template-columns:1fr 340px;gap:24px;}
  @media(max-width:900px){.vxcp-grid{grid-template-columns:1fr;}}

  .vxcp-card{background:rgba(255,255,255,0.02);border:1px solid rgba(255,255,255,0.07);border-radius:24px;padding:28px;margin-bottom:20px;}
  .vxcp-card-title{font-size:13px;font-weight:700;text-transform:uppercase;letter-spacing:0.06em;color:#94a3b8;margin-bottom:16px;display:flex;align-items:center;gap:8px;}

  .vxcp-platform-grid{display:flex;flex-wrap:wrap;gap:10px;}
  .vxcp-platform-btn{display:flex;align-items:center;gap:8px;padding:10px 16px;border-radius:12px;border:1px solid rgba(255,255,255,0.09);background:rgba(255,255,255,0.03);font-size:13px;font-weight:600;cursor:pointer;transition:all 0.2s;color:#94a3b8;}
  .vxcp-platform-btn.selected{background:rgba(167,139,250,0.1);border-color:rgba(167,139,250,0.35);color:#f1f5f9;}
  .vxcp-platform-btn:hover:not(.selected){background:rgba(255,255,255,0.06);color:#f1f5f9;}

  .vxcp-textarea{width:100%;min-height:180px;background:rgba(255,255,255,0.02);border:1px solid rgba(255,255,255,0.07);border-radius:16px;padding:16px;font-size:15px;color:#f1f5f9;resize:vertical;font-family:'Inter',sans-serif;line-height:1.6;outline:none;transition:border-color 0.2s;box-sizing:border-box;}
  .vxcp-textarea:focus{border-color:rgba(167,139,250,0.4);background:rgba(255,255,255,0.04);}
  .vxcp-textarea::placeholder{color:#475569;}

  .vxcp-toolbar{display:flex;gap:8px;margin-top:12px;}
  .vxcp-tool-btn{width:36px;height:36px;border-radius:10px;border:1px solid rgba(255,255,255,0.07);background:rgba(255,255,255,0.03);display:flex;align-items:center;justify-content:center;cursor:pointer;color:#94a3b8;transition:all 0.2s;}
  .vxcp-tool-btn:hover{background:rgba(167,139,250,0.1);border-color:rgba(167,139,250,0.3);color:#a78bfa;}

  .vxcp-char-count{font-size:12px;color:#64748b;text-align:right;margin-top:8px;}
  .vxcp-char-count.warn{color:#eab308;}
  .vxcp-char-count.danger{color:#ef4444;}

  .vxcp-media-drop{border:2px dashed rgba(255,255,255,0.1);border-radius:16px;padding:40px 20px;text-align:center;cursor:pointer;transition:all 0.2s;background:rgba(255,255,255,0.01);}
  .vxcp-media-drop:hover{border-color:rgba(167,139,250,0.4);background:rgba(167,139,250,0.04);}
  .vxcp-media-thumb{position:relative;border-radius:12px;overflow:hidden;aspect-ratio:1;background:rgba(255,255,255,0.03);display:flex;align-items:center;justify-content:center;}
  .vxcp-media-remove{position:absolute;top:6px;right:6px;width:22px;height:22px;background:rgba(0,0,0,0.7);border-radius:50%;display:flex;align-items:center;justify-content:center;cursor:pointer;color:#fff;backdrop-filter:blur(4px);}

  .vxcp-privacy-btn{display:flex;align-items:center;gap:8px;padding:12px 16px;border-radius:12px;border:1px solid rgba(255,255,255,0.09);background:rgba(255,255,255,0.03);font-size:13px;font-weight:600;cursor:pointer;width:100%;transition:all 0.2s;color:#f1f5f9;}
  .vxcp-privacy-btn:hover{background:rgba(255,255,255,0.06);}
  .vxcp-privacy-menu{border-radius:12px;border:1px solid rgba(255,255,255,0.09);background:#0f1628;overflow:hidden;margin-top:8px;}
  .vxcp-privacy-opt{display:flex;align-items:center;gap:10px;padding:12px 16px;font-size:13px;font-weight:500;cursor:pointer;transition:background 0.15s;color:#94a3b8;}
  .vxcp-privacy-opt:hover{background:rgba(255,255,255,0.04);color:#f1f5f9;}
  .vxcp-privacy-opt.active{color:#a78bfa;background:rgba(167,139,250,0.08);}

  .vxcp-schedule-row{display:flex;gap:10px;}
  .vxcp-schedule-input{flex:1;padding:12px 16px;background:rgba(255,255,255,0.015);border:1px solid rgba(255,255,255,0.07);border-radius:14px;color:#f1f5f9;font-size:14px;outline:none;font-family:'Inter',sans-serif;transition:all 0.25s;}
  .vxcp-schedule-input:hover{background:rgba(255,255,255,0.035);border-color:rgba(255,255,255,0.12);}
  .vxcp-schedule-input:focus{border-color:rgba(167,139,250,0.45);background:rgba(255,255,255,0.04);box-shadow:0 0 0 1px rgba(167,139,250,0.25);}
  .vxcp-schedule-input::-webkit-calendar-picker-indicator{filter:invert(0.95);opacity:0.85;cursor:pointer;transition:all 0.2s;}
  .vxcp-schedule-input::-webkit-calendar-picker-indicator:hover{opacity:1;filter:invert(1);}

  .vxcp-btn-primary{width:100%;padding:14px;border-radius:14px;background:linear-gradient(135deg,#a78bfa,#38bdf8);border:none;color:#fff;font-weight:700;font-size:15px;cursor:pointer;display:flex;align-items:center;justify-content:center;gap:10px;box-shadow:0 8px 24px rgba(167,139,250,0.25);transition:transform 0.2s,box-shadow 0.2s;margin-bottom:12px;}
  .vxcp-btn-primary:hover:not(:disabled){transform:translateY(-2px);box-shadow:0 12px 32px rgba(167,139,250,0.35);}
  .vxcp-btn-primary:disabled{opacity:0.5;cursor:not-allowed;}
  .vxcp-btn-secondary{width:100%;padding:12px;border-radius:14px;border:1px solid rgba(255,255,255,0.09);background:rgba(255,255,255,0.03);color:#f1f5f9;font-weight:600;font-size:14px;cursor:pointer;display:flex;align-items:center;justify-content:center;gap:8px;transition:background 0.2s;}
  .vxcp-btn-secondary:hover{background:rgba(255,255,255,0.08);}

  .vxcp-ai-btn{width:100%;padding:12px 14px;border-radius:12px;border:1px solid rgba(167,139,250,0.25);background:rgba(167,139,250,0.07);color:#a78bfa;font-weight:600;font-size:13px;cursor:pointer;display:flex;align-items:center;justify-content:center;gap:8px;transition:all 0.2s;margin-bottom:20px;}
  .vxcp-ai-btn:hover{background:rgba(167,139,250,0.14);}

  .vxcp-success{position:fixed;inset:0;background:rgba(0,0,0,0.8);backdrop-filter:blur(10px);display:flex;align-items:center;justify-content:center;z-index:200;}
  .vxcp-success-card{background:#0f1628;border:1px solid rgba(34,197,94,0.3);border-radius:24px;padding:48px 40px;text-align:center;max-width:400px;}
  .vxcp-type-tabs{display:flex;gap:0;margin-bottom:24px;background:rgba(255,255,255,0.03);border:1px solid rgba(255,255,255,0.08);border-radius:16px;padding:5px;width:fit-content;}
  .vxcp-type-tab{padding:9px 22px;border-radius:12px;font-size:13px;font-weight:700;cursor:pointer;transition:all 0.2s;color:#475569;display:flex;align-items:center;gap:7px;}
  .vxcp-type-tab.active-post{background:linear-gradient(135deg,#a78bfa,#38bdf8);color:#fff;box-shadow:0 4px 14px rgba(167,139,250,0.3);}
  .vxcp-type-tab.active-video{background:linear-gradient(135deg,#1877F2,#0a52c4);color:#fff;box-shadow:0 4px 16px rgba(24,119,242,0.35);}
  .vxcp-type-tab:hover:not(.active-post):not(.active-video){background:rgba(255,255,255,0.05);color:#94a3b8;}
  .vxcp-fb-badge{display:inline-flex;align-items:center;gap:5px;padding:2px 8px;border-radius:8px;background:rgba(24,119,242,0.15);border:1px solid rgba(24,119,242,0.3);color:#60a5fa;font-size:10px;font-weight:700;}
  .vxcp-video-drop{border:2px dashed rgba(24,119,242,0.3);border-radius:18px;padding:48px 24px;text-align:center;cursor:pointer;transition:all 0.25s;background:rgba(24,119,242,0.03);position:relative;overflow:hidden;}
  .vxcp-video-drop:hover{border-color:rgba(24,119,242,0.6);background:rgba(24,119,242,0.07);}
  .vxcp-video-preview{border-radius:14px;overflow:hidden;background:#000;position:relative;margin-bottom:14px;}
  .vxcp-video-preview video{width:100%;max-height:280px;display:block;object-fit:contain;background:#000;}
  .vxcp-video-preview-remove{position:absolute;top:10px;right:10px;background:rgba(0,0,0,0.7);border:1px solid rgba(255,255,255,0.15);color:#fff;border-radius:8px;padding:5px 10px;font-size:11px;font-weight:700;cursor:pointer;backdrop-filter:blur(4px);display:flex;align-items:center;gap:5px;transition:background 0.15s;}
  .vxcp-video-preview-remove:hover{background:rgba(239,68,68,0.7);}
  .vxcp-field-label{font-size:11px;font-weight:700;text-transform:uppercase;letter-spacing:0.07em;color:#334155;margin-bottom:8px;display:flex;align-items:center;gap:6px;}
  .vxcp-field-label .req{color:#ef4444;}
  .vxcp-input{width:100%;padding:12px 16px;background:rgba(255,255,255,0.03);border:1px solid rgba(255,255,255,0.08);border-radius:12px;color:#f1f5f9;font-size:14px;font-family:'Inter',sans-serif;outline:none;box-sizing:border-box;transition:border-color 0.2s;}
  .vxcp-input:focus{border-color:rgba(24,119,242,0.5);}
  .vxcp-input::placeholder{color:#475569;}
  .vxcp-input-area{width:100%;min-height:100px;padding:12px 16px;background:rgba(255,255,255,0.03);border:1px solid rgba(255,255,255,0.08);border-radius:12px;color:#f1f5f9;font-size:14px;font-family:'Inter',sans-serif;outline:none;box-sizing:border-box;resize:vertical;line-height:1.6;transition:border-color 0.2s;}
  .vxcp-input-area:focus{border-color:rgba(24,119,242,0.5);}
  .vxcp-input-area::placeholder{color:#475569;}
  .vxcp-page-select{width:100%;padding:12px 16px;background:rgba(255,255,255,0.03);border:1px solid rgba(255,255,255,0.08);border-radius:12px;color:#f1f5f9;font-size:14px;font-family:'Inter',sans-serif;outline:none;box-sizing:border-box;appearance:none;cursor:pointer;transition:border-color 0.2s;}
  .vxcp-page-select:focus{border-color:rgba(24,119,242,0.5);}
  .vxcp-btn-fb{width:100%;padding:14px;border-radius:14px;background:linear-gradient(135deg,#1877F2,#0a52c4);border:none;color:#fff;font-weight:700;font-size:15px;cursor:pointer;display:flex;align-items:center;justify-content:center;gap:10px;box-shadow:0 8px 24px rgba(24,119,242,0.35);transition:transform 0.2s,box-shadow 0.2s;margin-bottom:12px;}
  .vxcp-btn-fb:hover:not(:disabled){transform:translateY(-2px);box-shadow:0 12px 32px rgba(24,119,242,0.5);}
  .vxcp-btn-fb:disabled{opacity:0.5;cursor:not-allowed;}
  .vxcp-video-success{border-radius:24px;padding:48px 36px;background:rgba(24,119,242,0.05);border:1px solid rgba(24,119,242,0.18);text-align:center;}
`;

export default function CreatePostPage() {
  const navigate = useNavigate();
  const fileRef = useRef<HTMLInputElement>(null);
  const videoRef = useRef<HTMLInputElement>(null);
  const [userName, setUserName] = useState("there");
  const [postType, setPostType] = useState<"post" | "video">("post");
  // ── Video Post state ────────────────────────────────────────────────────────
  const [videoFile, setVideoFile] = useState<string | null>(null);
  const [videoFileName, setVideoFileName] = useState("");
  const [videoTitle, setVideoTitle] = useState("");
  const [videoDesc, setVideoDesc] = useState("");
  const [fbPage, setFbPage] = useState("");
  const [videoPosting, setVideoPosting] = useState(false);
  const [videoPosted, setVideoPosted] = useState(false);
  const [videoPostId, setVideoPostId] = useState("");
  // ── Regular post state ──────────────────────────────────────────────────────
  const [caption, setCaption] = useState("");
  const [selectedPlatforms, setSelectedPlatforms] = useState<string[]>([]);
  const [privacy, setPrivacy] = useState("public");
  const [showPrivacyMenu, setShowPrivacyMenu] = useState(false);
  const [mediaFiles, setMediaFiles] = useState<string[]>([]);
  const [scheduleDate, setScheduleDate] = useState("");
  const [scheduleTime, setScheduleTime] = useState("");
  const [posting, setPosting] = useState(false);
  const [posted, setPosted] = useState(false);
  const [publishResults, setPublishResults] = useState<Record<string, { status: string; error?: string; id?: string }>>({});

  const [linkedAccounts, setLinkedAccounts] = useState<string[]>([]);


  const todayStr = new Date().toLocaleDateString("en-CA");
  const now = new Date();
  const currentMinTime = `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;
  const minTime = scheduleDate === todayStr ? currentMinTime : undefined;

  const handleDateChange = (val: string) => {
    const today = new Date().toLocaleDateString("en-CA");
    if (val && val < today) {
      alert("Cannot select a date in the past");
      setScheduleDate(today);
    } else {
      setScheduleDate(val);
    }
  };

  const handleTimeChange = (val: string) => {
    const today = new Date().toLocaleDateString("en-CA");
    if (scheduleDate === today && val) {
      const now = new Date();
      const currentMinTime = `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;
      if (val < currentMinTime) {
        alert("Cannot select a time in the past");
        setScheduleTime(currentMinTime);
        return;
      }
    }
    setScheduleTime(val);
  };

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
    // Don't auto-select any platform â€” let the user explicitly choose where to post
    setSelectedPlatforms([]);
    if (accounts.includes("facebook")) setFbPage("My Facebook Page");
  }, [navigate]);

  const handleVideoFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (!file.type.startsWith("video/")) { alert("Please select a video file."); return; }
    if (file.size > 200 * 1024 * 1024) { alert("Video must be under 200MB."); return; }
    setVideoFileName(file.name);
    const reader = new FileReader();
    reader.onload = ev => { if (ev.target?.result) setVideoFile(ev.target.result as string); };
    reader.readAsDataURL(file);
    e.target.value = "";
  };

  const handleVideoPublish = async () => {
    if (!videoFile || !videoTitle.trim() || !fbPage) return;
    setVideoPosting(true);
    try {
      const token = localStorage.getItem("authToken");
      const u = JSON.parse(localStorage.getItem("userInfo") || "{}");
      const res = await fetch(`${API_BASE}/api/campaign/create`, {
        method: "POST",
        headers: { "Content-Type": "application/json", ...(token ? { Authorization: `Bearer ${token}` } : {}) },
        body: JSON.stringify({
          userId: u.email, userName: u.name, userEmail: u.email,
          campaignName: videoTitle.substring(0, 60), budget: "0",
          platforms: ["facebook"], adCaption: videoDesc || videoTitle,
          adVideo: videoFile, videoTitle, videoDescription: videoDesc, fbPageName: fbPage,
        })
      });
      const data = await res.json();
      if (data.publishResults?.facebook?.id) setVideoPostId(data.publishResults.facebook.id);
    } catch (err) { console.error("Video publish error:", err); }
    setVideoPosting(false);
    setVideoPosted(true);
  };

  const togglePlatform = (id: string) => {

    setSelectedPlatforms(prev => {
      const next = prev.includes(id) ? prev.filter(p => p !== id) : [...prev, id];
      // If YouTube was deselected, clear any existing videos
      if (!next.includes("youtube")) {
        setMediaFiles(files => files.filter(f => !f.startsWith("data:video")));
      }
      return next;
    });
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    const isYoutubeSelected = selectedPlatforms.includes("youtube");

    files.forEach(file => {
      // Strictly prevent video uploads if YouTube is not selected
      if (file.type.startsWith("video/") && !isYoutubeSelected) {
        alert("Videos are only allowed when YouTube is selected as a platform.");
        return;
      }

      const reader = new FileReader();
      reader.onload = ev => {
        if (ev.target?.result) setMediaFiles(prev => [...prev, ev.target!.result as string]);
      };
      reader.readAsDataURL(file);
    });
    
    // Clear input so the same file can be selected again if needed
    e.target.value = "";
  };

  const handlePost = async () => {
    if (!caption.trim() || selectedPlatforms.length === 0) return;
    setPosting(true);
    
    try {
      if (scheduleDate) {
        const now = new Date();
        const scheduledDateTime = new Date(`${scheduleDate}T${scheduleTime || "00:00"}:00`);
        if (scheduledDateTime <= now) {
          alert("Schedule date and time must be in the future.");
          setPosting(false);
          return;
        }
      }

      let userEmail = "";
      let userNameFull = "";
      try {
        const u = JSON.parse(localStorage.getItem("userInfo") || "{}");
        if (u.email) userEmail = u.email;
        if (u.name) userNameFull = u.name;
      } catch {}

      const authToken = localStorage.getItem("authToken");

      const scheduledAt = scheduleDate 
        ? new Date(`${scheduleDate}T${scheduleTime || "00:00"}:00`).toISOString()
        : null;

      console.log("ðŸš€ SENDING CAMPAIGN:", {
        platforms: selectedPlatforms,
        caption: caption.substring(0, 20) + "...",
        scheduledAt
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
          adImage: mediaFiles.find(f => f.startsWith("data:image")) || "", // Pass base64 image
          adVideo: mediaFiles.find(f => f.startsWith("data:video")) || "", // Pass base64 video
          scheduledAt
        })
      });

      const data = await response.json();
      if (data.success) {
        // Store the auth token so the dashboard can fetch this campaign
        if (data.token && !authToken) {
          localStorage.setItem("authToken", data.token);
        }
        if (data.publishResults) {
          setPublishResults(data.publishResults);
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
        <div className="vxcp-main">
          <DashboardTopBar userName={userName} userInitial={userName[0]?.toUpperCase() || "U"} />
          <div className="vxcp-scroll">
            <div className="vxcp-orb1" /><div className="vxcp-orb2" />
            <div className="vxcp-inner">

              <div className="vxcp-hero">
                <div className="vxcp-hero-line"/>
                <div>
                  <div className="vxcp-hero-title">Create a <span>Post</span></div>
                  <div className="vxcp-hero-sub">Share a single post directly from your account, {userName}.</div>
                </div>
                <div className="vxcp-back-btn" onClick={() => navigate("/dashboard")}>
                  <ArrowLeft size={16} /> Back
                </div>
              </div>

              {/* ── Post Type Tabs ── */}
              <div className="vxcp-type-tabs">
                <div id="tab-post" className={`vxcp-type-tab ${postType === "post" ? "active-post" : ""}`} onClick={() => setPostType("post")}>
                  <ImageIcon size={14} /> Post
                </div>
                <div id="tab-video-post" className={`vxcp-type-tab ${postType === "video" ? "active-video" : ""}`} onClick={() => setPostType("video")}>
                  <Video size={14} /> Video Post
                  <span className="vxcp-fb-badge"><Facebook size={9} /> Facebook</span>
                </div>
              </div>

              {/* ══════════ VIDEO POST FLOW ══════════ */}
              {postType === "video" && (
                <motion.div initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.28 }}>
                  {!videoPosted ? (
                    <div className="vxcp-grid">
                      <div>
                        {/* Upload */}
                        <motion.div className="vxcp-card" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.05 }}>
                          <div className="vxcp-card-title"><Video size={14} /> Upload Video File</div>
                          <input ref={videoRef} type="file" accept="video/*" style={{ display: "none" }} onChange={handleVideoFileChange} />
                          {!videoFile ? (
                            <div className="vxcp-video-drop" onClick={() => videoRef.current?.click()}>
                              <Video size={44} color="#1877F2" style={{ margin: "0 auto 16px", opacity: 0.7 }} />
                              <div style={{ fontSize: 16, fontWeight: 800, color: "#e2e8f0", marginBottom: 6 }}>Click to upload a video</div>
                              <div style={{ fontSize: 12, color: "#475569" }}>MP4, MOV, AVI · Max 200MB</div>
                              <div style={{ marginTop: 16, display: "inline-flex", alignItems: "center", gap: 6, padding: "7px 16px", borderRadius: 10, background: "rgba(24,119,242,0.12)", border: "1px solid rgba(24,119,242,0.25)", color: "#60a5fa", fontSize: 12, fontWeight: 700 }}>
                                <Facebook size={12} /> Publish to Facebook Page
                              </div>
                            </div>
                          ) : (
                            <div>
                              <div className="vxcp-video-preview">
                                <video src={videoFile} controls style={{ width: "100%", maxHeight: 280, objectFit: "contain", background: "#000" }} />
                                <button className="vxcp-video-preview-remove" onClick={() => { setVideoFile(null); setVideoFileName(""); }}>
                                  <X size={11} /> Remove
                                </button>
                              </div>
                              <div style={{ fontSize: 12, color: "#475569", textAlign: "center" }}>📹 {videoFileName}</div>
                            </div>
                          )}
                        </motion.div>

                        {/* Video Details */}
                        <motion.div className="vxcp-card" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.1 }}>
                          <div className="vxcp-card-title">Video Details</div>
                          <div style={{ marginBottom: 16 }}>
                            <div className="vxcp-field-label">Title <span className="req">*</span></div>
                            <input id="video-title" className="vxcp-input" placeholder="Enter a title for your video…" value={videoTitle} onChange={e => setVideoTitle(e.target.value)} maxLength={255} />
                            <div style={{ fontSize: 11, color: "#334155", textAlign: "right", marginTop: 4 }}>{videoTitle.length}/255</div>
                          </div>
                          <div>
                            <div className="vxcp-field-label">Description</div>
                            <textarea id="video-description" className="vxcp-input-area" placeholder="Describe your video — this becomes the Facebook post caption…" value={videoDesc} onChange={e => setVideoDesc(e.target.value)} maxLength={5000} />
                          </div>
                        </motion.div>
                      </div>

                      {/* RIGHT: FB Page + Publish */}
                      <div>
                        <motion.div className="vxcp-card" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.12 }}>
                          <div className="vxcp-card-title"><Facebook size={13} /> Facebook Page</div>
                          {linkedAccounts.includes("facebook") ? (
                            <div>
                              <div className="vxcp-field-label">Select Page <span className="req">*</span></div>
                              <div style={{ position: "relative" }}>
                                <select id="fb-page-select" className="vxcp-page-select" value={fbPage} onChange={e => setFbPage(e.target.value)}>
                                  <option value="">— Select a Facebook Page —</option>
                                  <option value="My Facebook Page">My Facebook Page (connected)</option>
                                </select>
                                <ChevronDown size={14} style={{ position: "absolute", right: 14, top: "50%", transform: "translateY(-50%)", color: "#475569", pointerEvents: "none" }} />
                              </div>
                              {fbPage && (
                                <div style={{ marginTop: 10, padding: "8px 12px", borderRadius: 10, background: "rgba(24,119,242,0.08)", border: "1px solid rgba(24,119,242,0.18)", display: "flex", alignItems: "center", gap: 8, fontSize: 12 }}>
                                  <CheckCircle2 size={13} color="#22c55e" />
                                  <span style={{ color: "#22c55e", fontWeight: 700 }}>Page selected:</span>
                                  <span style={{ color: "#94a3b8" }}>{fbPage}</span>
                                </div>
                              )}
                            </div>
                          ) : (
                            <div style={{ textAlign: "center", padding: "20px 0" }}>
                              <div style={{ fontSize: 13, color: "#475569", marginBottom: 12 }}>No Facebook account connected.</div>
                              <button className="vxcp-btn-primary" style={{ width: "auto", padding: "10px 20px", fontSize: 13 }} onClick={() => navigate("/social")}>
                                <Facebook size={14} /> Connect Facebook
                              </button>
                            </div>
                          )}
                        </motion.div>

                        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.18 }}>
                          <button
                            id="publish-video-btn"
                            className="vxcp-btn-fb"
                            onClick={handleVideoPublish}
                            disabled={videoPosting || !videoFile || !videoTitle.trim() || !fbPage}
                          >
                            {videoPosting
                              ? <><span style={{ width: 16, height: 16, border: "2px solid rgba(255,255,255,0.4)", borderTopColor: "#fff", borderRadius: "50%", animation: "spin 0.7s linear infinite", display: "inline-block" }} /> Publishing…</>
                              : <><Facebook size={16} /> Publish Video to Facebook</>
                            }
                          </button>
                          <button className="vxcp-btn-secondary" onClick={() => navigate("/dashboard")}>Cancel</button>
                        </motion.div>
                      </div>
                    </div>
                  ) : (
                    <motion.div className="vxcp-video-success" initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}>
                      <CheckCircle2 size={52} color="#22c55e" style={{ margin: "0 auto 16px", display: "block" }} />
                      <div style={{ fontSize: 22, fontWeight: 800, color: "#f1f5f9", marginBottom: 8 }}>Video Published! 🎉</div>
                      <div style={{ fontSize: 13, color: "#64748b", marginBottom: 24, lineHeight: 1.8 }}>
                        Your video <strong style={{ color: "#e2e8f0" }}>"{videoTitle}"</strong> has been successfully published<br />
                        and now appears on your Facebook Page: <strong style={{ color: "#60a5fa" }}>{fbPage}</strong>
                      </div>
                      {videoPostId && <div style={{ fontSize: 11, color: "#334155", marginBottom: 20 }}>Post ID: {videoPostId}</div>}
                      <div style={{ display: "flex", gap: 12, justifyContent: "center", flexWrap: "wrap" }}>
                        <button className="vxcp-btn-fb" style={{ width: "auto", padding: "11px 24px", fontSize: 13 }} onClick={() => window.open("https://www.facebook.com", "_blank")}>
                          <Facebook size={14} /> View on Facebook
                        </button>
                        <button className="vxcp-btn-secondary" style={{ width: "auto", padding: "11px 24px", fontSize: 13 }} onClick={() => { setVideoPosted(false); setVideoFile(null); setVideoTitle(""); setVideoDesc(""); }}>
                          Post Another Video
                        </button>
                      </div>
                    </motion.div>
                  )}
                </motion.div>
              )}

              {/* ══════════ REGULAR POST FLOW ══════════ */}
              {postType === "post" && linkedAccounts.length === 0 ? (

                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} style={{ textAlign: "center", padding: "80px 40px", background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.07)", borderRadius: 24 }}>
                  <div style={{ width: 72, height: 72, borderRadius: 20, background: "rgba(234,179,8,0.1)", border: "1px solid rgba(234,179,8,0.2)", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 24px" }}>
                    <Lock size={32} color="#eab308" />
                  </div>
                  <div style={{ fontSize: 22, fontWeight: 800, marginBottom: 12, color: "#f1f5f9" }}>No Social Accounts Linked</div>
                  <div style={{ color: "#94a3b8", fontSize: 15, maxWidth: 420, margin: "0 auto 32px", lineHeight: 1.6 }}>
                    You need to connect at least one social media account before you can create and publish posts.
                  </div>
                  <button
                    onClick={() => navigate("/social")}
                    className="vxcp-btn-primary" style={{ width: "auto", display: "inline-flex" }}
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
                            {selectedPlatforms.includes(p.id) && <span style={{ fontSize: 10, color: p.color, marginLeft: 2 }}>o"</span>}
                          </button>
                        ))}
                      </div>
                      {selectedPlatforms.length === 0 && (
                        <div style={{ marginTop: 12, fontSize: 12, color: "#eab308", display: "flex", alignItems: "center", gap: 6 }}>
                          s,? Select at least one platform to publish to.
                        </div>
                      )}
                    </motion.div>

                    {/* Caption */}
                    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }} className="vxcp-card">
                      <div className="vxcp-card-title">Caption</div>
                      <textarea
                        className="vxcp-textarea"
                        placeholder="What's on your mind? Write your post caption here?"
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
                      <input ref={fileRef} type="file" accept={selectedPlatforms.includes("youtube") ? "image/*,video/*" : "image/*"} multiple style={{ display: "none" }} onChange={handleFileChange} />
                      {mediaFiles.length === 0 ? (
                        <div className="vxcp-media-drop" onClick={() => fileRef.current?.click()}>
                          <ImageIcon size={32} style={{ margin: "0 auto 12px", opacity: 0.25 }} color="#94a3b8" />
                          <div style={{ fontSize: 14, fontWeight: 600, marginBottom: 4, color: "#f1f5f9" }}>
                            {selectedPlatforms.includes("youtube") ? "Click to upload photos or videos" : "Click to upload photos"}
                          </div>
                          <div style={{ fontSize: 12, color: "#64748b" }}>
                            {selectedPlatforms.includes("youtube") ? "PNG, JPG, GIF, MP4 up to 50MB" : "PNG, JPG, GIF up to 50MB"}
                          </div>
                        </div>
                      ) : (
                        <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 10 }}>
                          {mediaFiles.map((src, i) => (
                            <div key={i} className="vxcp-media-thumb">
                              {src.startsWith("data:video") ? (
                                <video src={src} muted controls style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                              ) : (
                                <img src={src} alt="" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                              )}
                              <div className="vxcp-media-remove" onClick={() => setMediaFiles(f => f.filter((_, j) => j !== i))}>
                                <X size={12} />
                              </div>
                            </div>
                          ))}
                          <div className="vxcp-media-thumb" style={{ cursor: "pointer" }} onClick={() => fileRef.current?.click()}>
                            <ImageIcon size={24} style={{ opacity: 0.25 }} color="#94a3b8" />
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
                          "dYs? Excited to share something new today! Stay tuned for what's coming. #Innovation #Launch",
                          "o\" Every great achievement starts with a single step. What's yours today? #Motivation #Growth",
                          "dY' The best time to start was yesterday. The second best time is now. #Entrepreneurship",
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
                    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.22 }} className="vxcp-card" style={{borderLeft: "4px solid #a78bfa", background: "rgba(255,255,255,0.035)", boxShadow: "0 10px 30px rgba(0,0,0,0.15)"}}>
                      <div className="vxcp-card-title"><Clock size={14} /> Schedule (optional)</div>
                      <div className="vxcp-schedule-row">
                        <input type="date" className="vxcp-schedule-input" min={todayStr} value={scheduleDate} onChange={e => handleDateChange(e.target.value)} />
                        <input type="time" className="vxcp-schedule-input" min={minTime} value={scheduleTime} onChange={e => handleTimeChange(e.target.value)} />
                      </div>
                      {scheduleDate && (
                        <div style={{
                          fontSize: "13px",
                          color: "#a78bfa",
                          marginTop: "12px",
                          display: "flex",
                          alignItems: "center",
                          gap: "8px",
                          background: "rgba(167,139,250,0.06)",
                          padding: "10px 14px",
                          borderRadius: "12px",
                          border: "1px dashed rgba(167,139,250,0.22)"
                        }}>
                          <Clock size={14} style={{ color: "#a78bfa" }} />
                          <span>Scheduled for: <strong style={{ color: "#f1f5f9" }}>{scheduleDate}</strong> at <strong style={{ color: "#f1f5f9" }}>{scheduleTime || "00:00"}</strong></span>
                        </div>
                      )}
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
                          <><span style={{ width: 16, height: 16, border: "2px solid rgba(255,255,255,0.4)", borderTopColor: "#fff", borderRadius: "50%", animation: "spin 0.7s linear infinite", display: "inline-block" }} /> Posting?</>
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
        </div>

        {/* Success overlay */}
        {posted && (
          <div className="vxcp-success" onClick={() => { setPosted(false); navigate("/dashboard"); }}>
            <motion.div 
              initial={{ scale: 0.9, opacity: 0 }} 
              animate={{ scale: 1, opacity: 1 }} 
              className="vxcp-success-card"
              onClick={e => e.stopPropagation()}
              style={{ maxWidth: 440, width: "100%", boxSizing: "border-box" }}
            >
              <CheckCircle2 size={56} color="#22c55e" style={{ margin: "0 auto 20px" }} />
              <div style={{ fontSize: 22, fontWeight: 800, marginBottom: 8, color: "#f1f5f9" }}>{scheduleDate ? "Post Scheduled!" : "Post Processed! 🎉"}</div>
              <div style={{ color: "#94a3b8", fontSize: 14, marginBottom: 24 }}>
                {scheduleDate ? `Your post has been successfully scheduled for ${scheduleDate} at ${scheduleTime || "00:00"}.` : "Your post has been submitted and processed."}
              </div>

              {/* Publish Results Panel */}
              {publishResults && Object.keys(publishResults).length > 0 && (
                <div style={{
                  marginBottom: "24px",
                  padding: "16px",
                  background: "rgba(255, 255, 255, 0.02)",
                  border: "1px solid rgba(255,255,255,0.07)",
                  borderRadius: "16px",
                  textAlign: "left"
                }}>
                  <div style={{ fontSize: "11px", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.05em", color: "#64748b", marginBottom: "12px" }}>
                    Instant Publishing Status
                  </div>
                  <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                    {Object.entries(publishResults).map(([platform, res]) => (
                      <div key={platform} style={{ display: "flex", flexDirection: "column", gap: 4 }}>
                        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                          <span style={{ fontSize: "13px", fontWeight: 600, textTransform: "capitalize", color: "#f1f5f9" }}>
                            {platform}
                          </span>
                          {res.status === "success" ? (
                            <span style={{ fontSize: "11px", fontWeight: 700, color: "#10b981", display: "flex", alignItems: "center", gap: 4 }}>
                              o" Success
                            </span>
                          ) : (
                            <span style={{ fontSize: "11px", fontWeight: 700, color: "#ef4444", display: "flex", alignItems: "center", gap: 4 }}>
                              o- Failed
                            </span>
                          )}
                        </div>
                        {res.status !== "success" && res.error && (
                          <div style={{ fontSize: "11px", color: "rgba(239, 68, 68, 0.85)", lineHeight: 1.4, paddingLeft: "8px", borderLeft: "2px solid #ef4444" }}>
                            {res.error}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              <button 
                onClick={() => { setPosted(false); navigate("/dashboard"); }}
                style={{
                  width: "100%",
                  padding: "14px",
                  borderRadius: "12px",
                  background: "#f1f5f9",
                  color: "#0f1628",
                  border: "none",
                  fontWeight: 700,
                  fontSize: "14px",
                  cursor: "pointer",
                  transition: "background 0.2s"
                }}
              >
                Go to Dashboard
              </button>
            </motion.div>
          </div>
        )}
      </div>
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </>
  );
}