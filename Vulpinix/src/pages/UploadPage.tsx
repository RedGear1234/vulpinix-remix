import { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router";
import { toast } from "sonner";
import { motion, AnimatePresence } from "framer-motion";
import {
  Lock, Share2, Upload, Sparkles, Zap, Calendar, Clock,
  X, CheckCircle2, Instagram, Facebook, Youtube, Twitter,
  Linkedin, Globe, TrendingUp, ImageIcon, Video, ArrowRight, Eye
} from "lucide-react";
import { getLinkedAccounts } from "./SocialAccountsPage";
import { DashboardSidebar } from "../components/DashboardSidebar";
import { DashboardTopBar } from "../components/DashboardTopBar";
import { generateCaptionWithGemini } from "../utils/geminiHelper";

const S = `
  @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800;900&display=swap');
  .vxup-shell{display:flex;height:100vh;background:#070b12;overflow:hidden;font-family:'Inter',sans-serif;}
  .vxup-main{flex:1;display:flex;flex-direction:column;overflow:hidden;}
  .vxup-scroll{flex:1;overflow-y:auto;overflow-x:hidden;padding:32px 36px 100px;}
  .vxup-scroll::-webkit-scrollbar{width:6px;}
  .vxup-scroll::-webkit-scrollbar-thumb{background:rgba(255,255,255,0.08);border-radius:3px;}
  .vxup-orb1{position:fixed;pointer-events:none;border-radius:50%;z-index:0;width:700px;height:700px;top:-200px;right:-150px;background:radial-gradient(circle,rgba(167,139,250,0.08) 0%,transparent 70%);}
  .vxup-orb2{position:fixed;pointer-events:none;border-radius:50%;z-index:0;width:600px;height:600px;bottom:-200px;left:-100px;background:radial-gradient(circle,rgba(56,189,248,0.06) 0%,transparent 70%);}
  .vxup-inner{max-width:1200px;margin:0 auto;position:relative;z-index:1;}

  /* Hero */
  .vxup-hero{border-radius:28px;padding:36px 44px;margin-bottom:28px;background:linear-gradient(135deg,#0f1628 0%,#111827 60%,#0c1220 100%);border:1px solid rgba(167,139,250,0.14);display:flex;align-items:center;justify-content:space-between;gap:24px;flex-wrap:wrap;position:relative;overflow:hidden;}
  .vxup-hero-line{position:absolute;top:0;left:0;right:0;height:2px;background:linear-gradient(90deg,#a78bfa,#38bdf8,#a78bfa);background-size:200%;animation:vxup-shimmer 3s ease infinite;}
  @keyframes vxup-shimmer{0%,100%{background-position:0%}50%{background-position:100%}}
  .vxup-hero-title{font-size:28px;font-weight:900;letter-spacing:-0.025em;color:#f1f5f9;margin-bottom:6px;}
  .vxup-hero-title span{background:linear-gradient(135deg,#c4b5fd,#67e8f9);-webkit-background-clip:text;-webkit-text-fill-color:transparent;}
  .vxup-hero-sub{color:#64748b;font-size:14px;}
  .vxup-hero-badge{display:inline-flex;align-items:center;gap:6px;padding:5px 13px;border-radius:20px;background:rgba(34,197,94,0.10);border:1px solid rgba(34,197,94,0.2);font-size:11px;font-weight:700;color:#22c55e;margin-top:10px;}

  /* Grid */
  .vxup-grid{display:grid;grid-template-columns:1.1fr 0.9fr;gap:22px;align-items:start;}
  .vxup-left{display:flex;flex-direction:column;gap:20px;}
  .vxup-right{display:flex;flex-direction:column;gap:20px;}

  /* Cards */
  .vxup-card{border-radius:22px;padding:26px 28px;background:rgba(255,255,255,0.025);border:1px solid rgba(255,255,255,0.07);}
  .vxup-card-hd{display:flex;align-items:center;justify-content:space-between;margin-bottom:22px;}
  .vxup-card-hd-l{display:flex;align-items:center;gap:12px;}
  .vxup-card-ic{width:38px;height:38px;border-radius:12px;display:flex;align-items:center;justify-content:center;flex-shrink:0;}
  .vxup-card-title{font-size:15px;font-weight:800;color:#e2e8f0;}
  .vxup-card-sub{font-size:12px;color:#475569;margin-top:2px;}

  /* Drop zone */
  .vxup-drop{display:flex;flex-direction:column;align-items:center;justify-content:center;gap:14px;padding:52px 24px;border:2px dashed rgba(255,255,255,0.1);border-radius:18px;background:rgba(255,255,255,0.015);cursor:pointer;transition:all 0.3s;text-align:center;}
  .vxup-drop:hover,.vxup-drop.active{border-color:rgba(167,139,250,0.5);background:rgba(167,139,250,0.04);box-shadow:0 0 24px rgba(167,139,250,0.08);}
  .vxup-drop-ic{width:64px;height:64px;border-radius:20px;background:rgba(167,139,250,0.10);border:1px solid rgba(167,139,250,0.2);display:flex;align-items:center;justify-content:center;color:#a78bfa;transition:transform 0.3s;}
  .vxup-drop:hover .vxup-drop-ic{transform:translateY(-4px);}
  .vxup-drop-title{font-size:16px;font-weight:700;color:#e2e8f0;margin-bottom:4px;}
  .vxup-drop-sub{font-size:13px;color:#334155;}

  /* Preview */
  .vxup-preview{position:relative;border-radius:18px;overflow:hidden;border:1px solid rgba(255,255,255,0.08);}
  .vxup-preview-overlay{position:absolute;bottom:0;left:0;right:0;padding:16px 18px;background:linear-gradient(transparent,rgba(7,11,18,0.9));display:flex;align-items:center;justify-content:space-between;}
  .vxup-preview-badge{padding:4px 12px;border-radius:20px;background:rgba(0,0,0,0.6);border:1px solid rgba(255,255,255,0.12);font-size:11px;font-weight:700;color:#e2e8f0;display:flex;align-items:center;gap:5px;}
  .vxup-preview-bar{position:absolute;bottom:0;left:0;right:0;height:3px;background:rgba(255,255,255,0.06);}
  .vxup-preview-fill{height:100%;background:linear-gradient(90deg,#a78bfa,#38bdf8);transition:width 0.3s;}

  /* Stats strip */
  .vxup-stats{display:grid;grid-template-columns:1fr 1fr;gap:14px;}
  .vxup-stat{padding:18px 20px;border-radius:16px;background:rgba(255,255,255,0.02);border:1px solid rgba(255,255,255,0.06);}
  .vxup-stat-val{font-size:26px;font-weight:900;line-height:1;margin-bottom:4px;}
  .vxup-stat-lbl{font-size:10px;font-weight:700;color:#334155;text-transform:uppercase;letter-spacing:0.07em;}

  /* Textarea & inputs */
  .vxup-textarea{width:100%;padding:14px 16px;border-radius:14px;background:rgba(255,255,255,0.02);border:1px solid rgba(255,255,255,0.08);color:#e2e8f0;font-size:14px;resize:none;min-height:100px;font-family:'Inter',sans-serif;outline:none;transition:border-color 0.2s;box-sizing:border-box;}
  .vxup-textarea:focus{border-color:rgba(167,139,250,0.4);}
  .vxup-textarea::placeholder{color:#1e293b;}
  .vxup-hashtag-row{display:flex;align-items:center;gap:10px;padding:11px 16px;border-radius:13px;background:rgba(255,255,255,0.02);border:1px solid rgba(255,255,255,0.08);margin-top:12px;}
  .vxup-hashtag-input{flex:1;background:transparent;border:none;outline:none;color:#e2e8f0;font-size:13px;font-family:'Inter',sans-serif;}
  .vxup-hashtag-input::placeholder{color:#1e293b;}

  /* Platform chips */
  .vxup-plat-grid{display:flex;flex-wrap:wrap;gap:10px;}
  .vxup-plat-btn{display:flex;align-items:center;gap:8px;padding:10px 16px;border-radius:14px;font-size:13px;font-weight:700;cursor:pointer;transition:all 0.22s;border:1px solid rgba(255,255,255,0.08);background:rgba(255,255,255,0.02);color:#475569;font-family:'Inter',sans-serif;}
  .vxup-plat-btn.on{background:rgba(255,255,255,0.05);color:#e2e8f0;}
  .vxup-plat-btn:hover{border-color:rgba(255,255,255,0.16);background:rgba(255,255,255,0.04);}
  .vxup-plat-dot{width:8px;height:8px;border-radius:50%;}

  /* Schedule inputs */
  .vxup-date-grid{display:grid;grid-template-columns:1fr 1fr;gap:14px;margin-bottom:20px;}
  .vxup-lbl{display:flex;align-items:center;gap:5px;font-size:11px;font-weight:700;color:#94a3b8;text-transform:uppercase;letter-spacing:0.07em;margin-bottom:7px;}
  .vxup-input{width:100%;padding:12px 16px;border-radius:14px;background:rgba(255,255,255,0.015);border:1px solid rgba(255,255,255,0.07);color:#e2e8f0;font-size:14px;outline:none;font-family:'Inter',sans-serif;transition:all 0.25s;box-sizing:border-box;}
  .vxup-input:hover{background:rgba(255,255,255,0.035);border-color:rgba(255,255,255,0.12);}
  .vxup-input:focus{background:rgba(255,255,255,0.04);border-color:rgba(167,139,250,0.45);box-shadow:0 0 0 1px rgba(167,139,250,0.25);}
  input[type="date"]::-webkit-calendar-picker-indicator,input[type="time"]::-webkit-calendar-picker-indicator{filter:invert(0.95);opacity:0.85;cursor:pointer;transition:all 0.2s;}
  input[type="date"]::-webkit-calendar-picker-indicator:hover,input[type="time"]::-webkit-calendar-picker-indicator:hover{opacity:1;filter:invert(1);}

  /* Buttons */
  .vxup-btn-pri{display:inline-flex;align-items:center;justify-content:center;gap:8px;padding:13px 22px;border-radius:14px;background:linear-gradient(135deg,#a78bfa,#38bdf8);border:none;color:#fff;font-weight:700;font-size:14px;cursor:pointer;box-shadow:0 6px 20px rgba(167,139,250,0.28);transition:all 0.2s;font-family:'Inter',sans-serif;width:100%;}
  .vxup-btn-pri:hover{transform:translateY(-2px);box-shadow:0 10px 28px rgba(167,139,250,0.4);}
  .vxup-btn-pri:disabled{opacity:0.45;cursor:not-allowed;transform:none;}
  .vxup-btn-ghost{display:inline-flex;align-items:center;justify-content:center;gap:8px;padding:12px 20px;border-radius:14px;background:rgba(255,255,255,0.03);border:1px solid rgba(255,255,255,0.09);color:#64748b;font-weight:700;font-size:14px;cursor:pointer;transition:all 0.2s;font-family:'Inter',sans-serif;width:100%;}
  .vxup-btn-ghost:hover{background:rgba(255,255,255,0.07);color:#94a3b8;}
  .vxup-btn-sm{display:inline-flex;align-items:center;gap:6px;padding:8px 16px;border-radius:11px;background:linear-gradient(135deg,#a78bfa,#38bdf8);border:none;color:#fff;font-weight:700;font-size:12px;cursor:pointer;font-family:'Inter',sans-serif;transition:all 0.2s;}
  .vxup-btn-sm:disabled{opacity:0.45;cursor:not-allowed;}
  .vxup-btn-sm:hover:not(:disabled){transform:translateY(-1px);}
  .vxup-btn-danger{display:inline-flex;align-items:center;gap:5px;padding:6px 13px;border-radius:10px;background:rgba(239,68,68,0.08);border:1px solid rgba(239,68,68,0.2);color:#ef4444;font-size:12px;font-weight:700;cursor:pointer;font-family:'Inter',sans-serif;}

  /* No accounts locked state */
  .vxup-locked{text-align:center;padding:80px 40px;border-radius:24px;background:rgba(255,255,255,0.018);border:1px solid rgba(255,255,255,0.07);max-width:560px;margin:0 auto;}
  .vxup-locked-ic{width:72px;height:72px;border-radius:22px;background:rgba(234,179,8,0.08);border:1px solid rgba(234,179,8,0.18);display:flex;align-items:center;justify-content:center;margin:0 auto 22px;}

  @media(max-width:1000px){.vxup-grid{grid-template-columns:1fr;}}
  @media(max-width:640px){.vxup-scroll{padding:20px 16px 80px;}.vxup-hero{padding:24px 20px;}.vxup-stats{grid-template-columns:1fr 1fr;}.vxup-date-grid{grid-template-columns:1fr;}}
`;

const ALLOWED_IMAGE_TYPES = ["image/jpeg","image/jpg","image/png","image/gif","image/webp","image/heic","image/heif"];
const ALLOWED_VIDEO_TYPES = ["video/mp4","video/quicktime","video/x-msvideo","video/webm","video/x-matroska","video/x-flv","video/x-ms-wmv"];
const ALLOWED_FILE_TYPES  = [...ALLOWED_IMAGE_TYPES, ...ALLOWED_VIDEO_TYPES];

interface UploadedFile { file: File; preview?: string; }
interface AIAnalysis { caption: string; hashtags: string[]; }
interface Platform { id:string; name:string; enabled:boolean; color:string; gradient:string; icon:React.ReactNode; }

const PLATFORMS: Platform[] = [
  { id:"instagram", name:"Instagram", enabled:true,  color:"#E1306C", gradient:"linear-gradient(135deg,#f09433,#e6683c,#dc2743,#cc2366,#bc1888)", icon:<Instagram size={14}/> },
  { id:"facebook",  name:"Facebook",  enabled:true,  color:"#1877F2", gradient:"linear-gradient(135deg,#1877F2,#0d5fc9)",                            icon:<Facebook  size={14}/> },
  { id:"twitter",   name:"X / Twitter",enabled:false,color:"#1DA1F2", gradient:"linear-gradient(135deg,#1DA1F2,#0c85d0)",                            icon:<Twitter   size={14}/> },
  { id:"linkedin",  name:"LinkedIn",  enabled:true,  color:"#0A66C2", gradient:"linear-gradient(135deg,#0A66C2,#084d93)",                            icon:<Linkedin  size={14}/> },
  { id:"youtube",   name:"YouTube",   enabled:false, color:"#FF0000", gradient:"linear-gradient(135deg,#FF0000,#cc0000)",                            icon:<Youtube   size={14}/> },
  { id:"pinterest", name:"Pinterest", enabled:false, color:"#E60023", gradient:"linear-gradient(135deg,#E60023,#b50016)",                            icon:<Globe     size={14}/> },
];

function hexRgba(hex:string,a:number){const r=parseInt(hex.slice(1,3),16),g=parseInt(hex.slice(3,5),16),b=parseInt(hex.slice(5,7),16);return `rgba(${r},${g},${b},${a})`;}

export default function UploadPage() {
  const navigate = useNavigate();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [dragActive, setDragActive] = useState(false);
  const [uploadedFile, setUploadedFile] = useState<UploadedFile|null>(null);
  const [progress, setProgress] = useState(0);
  const [generatingCaption, setGeneratingCaption] = useState(false);
  const [scheduleDate, setScheduleDate] = useState("");
  const [scheduleTime, setScheduleTime] = useState("");
  const [linkedAccounts, setLinkedAccounts] = useState<string[]>([]);
  const [userName, setUserName] = useState("User");
  const [platforms, setPlatforms] = useState<Platform[]>(PLATFORMS);
  const [aiAnalysis, setAiAnalysis] = useState<AIAnalysis>({ caption:"", hashtags:[] });
  const [reachNum, setReachNum] = useState(0);

  const todayStr = new Date().toLocaleDateString("en-CA");
  const now = new Date();
  const currentMinTime = `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;
  const minTime = scheduleDate === todayStr ? currentMinTime : undefined;

  useEffect(()=>{
    if(localStorage.getItem("isAuthenticated")!=="true"){navigate("/auth",{replace:true});return;}
    try{
      const u=JSON.parse(localStorage.getItem("userInfo")||"{}");
      if(u.name)setUserName(u.name.split(" ")[0]);
      if(!u.onboardingCompleted){navigate("/onboarding",{replace:true});return;}
    }catch{}
    setLinkedAccounts(getLinkedAccounts());
  },[navigate]);

  const estimatedReach = platforms.filter(p=>p.enabled&&linkedAccounts.includes(p.id)).length * 2500;
  useEffect(()=>{
    let cur=0;
    const t=setInterval(()=>{cur+=Math.ceil(estimatedReach/60);if(cur>=estimatedReach){cur=estimatedReach;clearInterval(t);}setReachNum(cur);},30);
    return()=>clearInterval(t);
  },[estimatedReach]);

  const handleDrag=(e:React.DragEvent)=>{e.preventDefault();e.stopPropagation();setDragActive(e.type==="dragenter"||e.type==="dragover");};
  const handleDrop=(e:React.DragEvent)=>{e.preventDefault();e.stopPropagation();setDragActive(false);if(e.dataTransfer.files?.[0])handleFile(e.dataTransfer.files[0]);};
  const handleChange=(e:React.ChangeEvent<HTMLInputElement>)=>{e.preventDefault();if(e.target.files?.[0])handleFile(e.target.files[0]);e.target.value="";};

  const handleFile=(file:File)=>{
    const ytOn=platforms.find(p=>p.id==="youtube")?.enabled;
    const allowed=ytOn?ALLOWED_FILE_TYPES:ALLOWED_IMAGE_TYPES;
    if(!allowed.includes(file.type.toLowerCase())){toast.error(ytOn?"Invalid file type":"Enable YouTube to upload videos.");return;}
    const preview=URL.createObjectURL(file);
    setUploadedFile({file,preview});
    setProgress(0);
    const iv=setInterval(()=>setProgress(p=>{if(p>=100){clearInterval(iv);return 100;}return p+10;}),200);
    const reader=new FileReader();
    reader.onload=ev=>{try{localStorage.setItem("adPreviewImage",ev.target?.result as string);}catch{}};
    reader.readAsDataURL(file);
  };

  const removeFile=()=>{setUploadedFile(null);setProgress(0);};

  const generateWithAI = async () => {
    if (!uploadedFile) { toast.error("Upload a file first"); return; }
    setGeneratingCaption(true);
    toast.info("Analysing your media with Gemini AI…");
    try {
      // Get the user's own API key from Settings (used only as a fallback
      // when the backend GEMINI_API_KEY env var is not configured)
      let clientApiKey: string | undefined;
      try {
        const localSettings = JSON.parse(localStorage.getItem("vxSettings") || "{}");
        clientApiKey = localSettings.geminiApiKey || import.meta.env.VITE_GEMINI_API_KEY;
      } catch { /* ignore */ }

      const result = await generateCaptionWithGemini(uploadedFile.file, clientApiKey);
      setAiAnalysis({ caption: result.caption, hashtags: result.hashtags });
      toast.success("AI captions generated!");
    } catch (err: any) {
      console.error("Gemini caption generation error:", err);
      // Surface a helpful message depending on the failure reason
      if (err.message?.includes("No Gemini API key")) {
        toast.warning("No Gemini API key configured. Add your key in Settings → AI Configuration, or set GEMINI_API_KEY in the backend .env");
      } else {
        toast.error(`AI generation failed: ${err.message || "Unknown error"}`);
      }
      // Keep any previously generated captions; don't overwrite with a generic fallback
    } finally {
      setGeneratingCaption(false);
    }
  };


  const togglePlatform=(id:string)=>{
    if(id==="youtube"){
      const isOn=platforms.find(p=>p.id==="youtube")?.enabled;
      if(isOn&&uploadedFile?.file.type.startsWith("video/")){setUploadedFile(null);setProgress(0);toast.info("Video removed — YouTube deselected.");}
    }
    setPlatforms(platforms.map(p=>p.id===id?{...p,enabled:!p.enabled}:p));
  };

  const handleLaunch=()=>{
    if(!uploadedFile){toast.error("Please upload a file first");return;}
    localStorage.setItem("adCreativeData",JSON.stringify({
      caption:aiAnalysis.caption,
      hashtags:aiAnalysis.hashtags,
      platforms:platforms.filter(p=>p.enabled).map(p=>p.name),
      scheduleDate: "",
      scheduleTime: ""
    }));
    navigate("/create-ad");
  };

  const handleDateChange = (val: string) => {
    const today = new Date().toLocaleDateString("en-CA");
    if (val && val < today) {
      toast.error("Cannot select a date in the past");
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
        toast.error("Cannot select a time in the past");
        setScheduleTime(currentMinTime);
        return;
      }
    }
    setScheduleTime(val);
  };

  const handleScheduleCampaign=()=>{
    if(!uploadedFile){toast.error("Please upload a file first");return;}
    if(!scheduleDate){toast.error("Please select a date to schedule");return;}
    const now = new Date();
    const scheduledDateTime = new Date(`${scheduleDate}T${scheduleTime || "00:00"}:00`);
    if(scheduledDateTime <= now){toast.error("Schedule date and time must be in the future");return;}
    localStorage.setItem("adCreativeData",JSON.stringify({
      caption:aiAnalysis.caption,
      hashtags:aiAnalysis.hashtags,
      platforms:platforms.filter(p=>p.enabled).map(p=>p.name),
      scheduleDate,
      scheduleTime: scheduleTime || "00:00"
    }));
    toast.success(`Campaign scheduled for ${scheduleDate} at ${scheduleTime || "00:00"}. Proceeding to targeting...`);
    navigate("/create-ad");
  };

  const isImage=uploadedFile?.file.type.startsWith("image/");
  const userInitial=userName[0]?.toUpperCase()||"U";
  const activePlatforms=platforms.filter(p=>p.enabled&&linkedAccounts.includes(p.id));

  return (
    <div className="vxup-shell">
      <style dangerouslySetInnerHTML={{__html:S}}/>
      <DashboardSidebar userName={userName} userInitial={userInitial}/>
      <div className="vxup-main">
        <DashboardTopBar userName={userName} userInitial={userInitial}/>
        <div className="vxup-scroll">
          <div className="vxup-orb1"/><div className="vxup-orb2"/>
          <div className="vxup-inner">

            {/* Hero */}
            <motion.div initial={{opacity:0,y:-16}} animate={{opacity:1,y:0}} transition={{duration:0.45}} className="vxup-hero">
              <div className="vxup-hero-line"/>
              <div>
                <div className="vxup-hero-title">Upload & <span>Publish Content</span></div>
                <div className="vxup-hero-sub">AI-powered multi-platform distribution in seconds.</div>
                <div className="vxup-hero-badge"><Sparkles size={11}/> Vulpinix AI Engine Ready</div>
              </div>
              <div style={{display:"flex",gap:10}}>
                <button className="vxup-btn-ghost" style={{width:"auto",padding:"10px 18px"}} onClick={()=>navigate("/social")}><Share2 size={14}/> Manage Accounts</button>
                <button className="vxup-btn-pri" style={{width:"auto",padding:"10px 18px"}} onClick={()=>navigate("/create-post")}><Zap size={14}/> Quick Post</button>
              </div>
            </motion.div>

            {linkedAccounts.length===0?(
              <motion.div initial={{opacity:0,y:20}} animate={{opacity:1,y:0}} className="vxup-locked">
                <div className="vxup-locked-ic"><Lock size={30} color="#eab308"/></div>
                <div style={{fontSize:21,fontWeight:900,color:"#e2e8f0",marginBottom:10}}>No Social Accounts Linked</div>
                <div style={{fontSize:14,color:"#475569",lineHeight:1.7,marginBottom:28}}>Connect at least one social platform before uploading campaigns.</div>
                <button className="vxup-btn-pri" style={{maxWidth:280,margin:"0 auto"}} onClick={()=>navigate("/social")}><Share2 size={14}/> Connect Social Accounts</button>
              </motion.div>
            ):(
              <div className="vxup-grid">
                {/* ── LEFT COLUMN ── */}
                <div className="vxup-left">

                  {/* Media Upload */}
                  <motion.div initial={{opacity:0,y:24}} animate={{opacity:1,y:0}} transition={{delay:0.1}} className="vxup-card">
                    <div className="vxup-card-hd">
                      <div className="vxup-card-hd-l">
                        <div className="vxup-card-ic" style={{background:"rgba(167,139,250,0.12)",color:"#a78bfa"}}><ImageIcon size={17}/></div>
                        <div>
                          <div className="vxup-card-title">Media Studio</div>
                          <div className="vxup-card-sub">Upload your photo or video</div>
                        </div>
                      </div>
                      <span style={{padding:"4px 12px",borderRadius:20,background:"rgba(34,197,94,0.10)",border:"1px solid rgba(34,197,94,0.2)",color:"#22c55e",fontSize:11,fontWeight:700}}>AI Ready</span>
                    </div>

                    <AnimatePresence mode="wait">
                      {uploadedFile?(
                        <motion.div key="preview" initial={{opacity:0,scale:0.97}} animate={{opacity:1,scale:1}} exit={{opacity:0}} className="vxup-preview">
                          {isImage
                            ?<img src={uploadedFile.preview} alt="preview" style={{width:"100%",maxHeight:320,objectFit:"cover",display:"block"}}/>
                            :<video src={uploadedFile.preview} style={{width:"100%",maxHeight:320,objectFit:"cover",display:"block"}} muted loop autoPlay playsInline/>
                          }
                          <div className="vxup-preview-overlay">
                            <div className="vxup-preview-badge">
                              {isImage?<ImageIcon size={11}/>:<Video size={11}/>}
                              {isImage?"Image":"Video"} · {(uploadedFile.file.size/1024/1024).toFixed(1)} MB
                            </div>
                            <button className="vxup-btn-danger" onClick={removeFile}><X size={12}/> Remove</button>
                          </div>
                          {progress<100&&(
                            <div className="vxup-preview-bar">
                              <div className="vxup-preview-fill" style={{width:`${progress}%`}}/>
                            </div>
                          )}
                        </motion.div>
                      ):(
                        <motion.div
                          key="drop" initial={{opacity:0}} animate={{opacity:1}} exit={{opacity:0}}
                          className={`vxup-drop ${dragActive?"active":""}`}
                          onDragEnter={handleDrag} onDragLeave={handleDrag} onDragOver={handleDrag} onDrop={handleDrop}
                          onClick={()=>fileInputRef.current?.click()}
                        >
                          <div className="vxup-drop-ic"><Upload size={26}/></div>
                          <div>
                            <div className="vxup-drop-title">
                              {platforms.find(p=>p.id==="youtube")?.enabled?"Drop photos or videos here":"Drop photos here"}
                            </div>
                            <div className="vxup-drop-sub">
                              {platforms.find(p=>p.id==="youtube")?.enabled?"PNG, JPG, GIF, MP4, MOV up to 50MB":"PNG, JPG, GIF, WEBP up to 50MB"}
                            </div>
                          </div>
                          <span style={{fontSize:12,color:"#334155",padding:"6px 16px",borderRadius:20,border:"1px solid rgba(255,255,255,0.08)",background:"rgba(255,255,255,0.03)"}}>Browse Files</span>
                        </motion.div>
                      )}
                    </AnimatePresence>
                    <input ref={fileInputRef} type="file" style={{display:"none"}} onChange={handleChange}
                      accept={platforms.find(p=>p.id==="youtube")?.enabled?".jpg,.jpeg,.png,.gif,.webp,.heic,.heif,.mp4,.mov,.avi,.webm,.mkv,.flv,.wmv":".jpg,.jpeg,.png,.gif,.webp,.heic,.heif"}/>
                  </motion.div>

                  {/* Stats row */}
                  <motion.div initial={{opacity:0,y:24}} animate={{opacity:1,y:0}} transition={{delay:0.16}} className="vxup-stats">
                    <div className="vxup-stat">
                      <div className="vxup-stat-ic" style={{marginBottom:10}}><Eye size={15} color="#a78bfa"/></div>
                      <div className="vxup-stat-val" style={{color:"#a78bfa"}}>{reachNum.toLocaleString()}</div>
                      <div className="vxup-stat-lbl">Estimated Reach</div>
                    </div>
                    <div className="vxup-stat">
                      <div className="vxup-stat-ic" style={{marginBottom:10}}><TrendingUp size={15} color="#38bdf8"/></div>
                      <div className="vxup-stat-val" style={{color:"#38bdf8"}}>{activePlatforms.length}</div>
                      <div className="vxup-stat-lbl">Active Platforms</div>
                    </div>
                  </motion.div>

                </div>

                {/* ── RIGHT COLUMN ── */}
                <div className="vxup-right">

                  {/* AI Caption */}
                  <motion.div initial={{opacity:0,y:24}} animate={{opacity:1,y:0}} transition={{delay:0.18}} className="vxup-card">
                    <div className="vxup-card-hd">
                      <div className="vxup-card-hd-l">
                        <div className="vxup-card-ic" style={{background:"rgba(167,139,250,0.12)",color:"#a78bfa"}}><Sparkles size={17}/></div>
                        <div>
                          <div className="vxup-card-title">AI Caption</div>
                          <div className="vxup-card-sub">Auto-generate engaging copy</div>
                        </div>
                      </div>
                      <button className="vxup-btn-sm" onClick={generateWithAI} disabled={generatingCaption||!uploadedFile}>
                        {generatingCaption?<><motion.span animate={{rotate:360}} transition={{duration:1,repeat:Infinity,ease:"linear"}} style={{display:"flex"}}><Zap size={12}/></motion.span> Generating…</>:<><Sparkles size={12}/> Generate</>}
                      </button>
                    </div>
                    <textarea
                      className="vxup-textarea"
                      placeholder="AI caption will appear here… or write your own."
                      value={aiAnalysis.caption}
                      onChange={e=>setAiAnalysis({...aiAnalysis,caption:e.target.value})}
                      rows={4}
                    />
                    <div className="vxup-hashtag-row">
                      <span style={{color:"#475569",fontWeight:800,fontSize:15}}>#</span>
                      <input
                        className="vxup-hashtag-input"
                        placeholder="Add hashtags (space separated)"
                        value={aiAnalysis.hashtags.join(" ")}
                        onChange={e=>setAiAnalysis({...aiAnalysis,hashtags:e.target.value.split(" ").filter(v=>v)})}
                      />
                    </div>
                  </motion.div>

                  {/* Distribution */}
                  <motion.div initial={{opacity:0,y:24}} animate={{opacity:1,y:0}} transition={{delay:0.24}} className="vxup-card">
                    <div className="vxup-card-hd">
                      <div className="vxup-card-hd-l">
                        <div className="vxup-card-ic" style={{background:"rgba(56,189,248,0.12)",color:"#38bdf8"}}><Share2 size={17}/></div>
                        <div>
                          <div className="vxup-card-title">Distribution</div>
                          <div className="vxup-card-sub">Select platforms to publish</div>
                        </div>
                      </div>
                    </div>
                    <div className="vxup-plat-grid">
                      {platforms.filter(p=>linkedAccounts.includes(p.id)).map(plat=>{
                        const isOn=plat.enabled;
                        return(
                          <button
                            key={plat.id}
                            className={`vxup-plat-btn ${isOn?"on":""}`}
                            style={isOn?{borderColor:hexRgba(plat.color,0.4),background:hexRgba(plat.color,0.08),color:plat.color}:{}}
                            onClick={()=>togglePlatform(plat.id)}
                          >
                            <div className="vxup-plat-dot" style={{background:isOn?plat.color:"rgba(255,255,255,0.1)"}}/>
                            {plat.icon}
                            {plat.name}
                            {isOn&&<CheckCircle2 size={12} style={{marginLeft:2}}/>}
                          </button>
                        );
                      })}
                    </div>
                    {linkedAccounts.length===0&&(
                      <div style={{marginTop:14,padding:"12px 16px",borderRadius:13,background:"rgba(234,179,8,0.07)",border:"1px solid rgba(234,179,8,0.18)",fontSize:13,color:"#eab308"}}>
                        No linked accounts found. <span style={{cursor:"pointer",textDecoration:"underline"}} onClick={()=>navigate("/social")}>Connect now →</span>
                      </div>
                    )}
                  </motion.div>

                  {/* Schedule & Launch */}
                  <motion.div initial={{opacity:0,y:24}} animate={{opacity:1,y:0}} transition={{delay:0.30}} className="vxup-card" style={{borderLeft: "4px solid #f472b6", background: "rgba(255,255,255,0.035)", boxShadow: "0 10px 30px rgba(0,0,0,0.15)"}}>
                    <div className="vxup-card-hd">
                      <div className="vxup-card-hd-l">
                        <div className="vxup-card-ic" style={{background:"rgba(244,114,182,0.12)",color:"#f472b6"}}><Calendar size={17}/></div>
                        <div>
                          <div className="vxup-card-title">Schedule</div>
                          <div className="vxup-card-sub">Post now or set a future time</div>
                        </div>
                      </div>
                    </div>
                    <div className="vxup-date-grid">
                      <div>
                        <label className="vxup-lbl"><Calendar size={10} style={{display:"inline",marginRight:4}}/>Date</label>
                        <input type="date" className="vxup-input" min={todayStr} value={scheduleDate} onChange={e=>handleDateChange(e.target.value)}/>
                      </div>
                      <div>
                        <label className="vxup-lbl"><Clock size={10} style={{display:"inline",marginRight:4}}/>Time</label>
                        <input type="time" className="vxup-input" min={minTime} value={scheduleTime} onChange={e=>handleTimeChange(e.target.value)}/>
                      </div>
                    </div>
                    {scheduleDate && (
                      <div style={{
                        fontSize: "13px",
                        color: "#f472b6",
                        marginTop: "-8px",
                        marginBottom: "20px",
                        display: "flex",
                        alignItems: "center",
                        gap: "8px",
                        background: "rgba(244,114,182,0.06)",
                        padding: "12px 16px",
                        borderRadius: "12px",
                        border: "1px dashed rgba(244,114,182,0.22)"
                      }}>
                        <Clock size={14} style={{ color: "#f472b6" }} />
                        <span>Scheduled for: <strong style={{ color: "#f1f5f9" }}>{scheduleDate}</strong> at <strong style={{ color: "#f1f5f9" }}>{scheduleTime || "00:00"}</strong></span>
                      </div>
                    )}
                    <div style={{display:"flex",gap:12}}>
                      <button className="vxup-btn-ghost" onClick={handleScheduleCampaign}><Clock size={14}/> Schedule</button>
                      <button className="vxup-btn-pri" onClick={handleLaunch}><Zap size={14}/> Publish Now <ArrowRight size={14}/></button>
                    </div>
                  </motion.div>

                </div>
              </div>
            )}

          </div>
        </div>
      </div>
    </div>
  );
}
