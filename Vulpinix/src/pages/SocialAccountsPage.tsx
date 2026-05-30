import { API_BASE } from "../config/api";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router";
import { motion, AnimatePresence } from "framer-motion";
import {
  CheckCircle2, Link2, Unlink, ExternalLink,
  Sparkles, Users, TrendingUp, RefreshCw, Zap, Shield,
  ArrowRight, BarChart3, Eye,
  Calendar, Clock, ChevronRight
} from "lucide-react";
import { toast } from "sonner";
import { DashboardSidebar } from "../components/DashboardSidebar";
import { DashboardTopBar } from "../components/DashboardTopBar";

export const SOCIAL_PLATFORMS = [
  { id:"instagram",name:"Instagram",color:"#E1306C",gradient:"linear-gradient(135deg,#f09433,#e6683c,#dc2743,#cc2366,#bc1888)",description:"Photos, reels & stories",audience:"1B+ users",
    icon:(s=24)=><svg width={s} height={s} viewBox="0 0 24 24" fill="currentColor"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/></svg> },
  { id:"facebook",name:"Facebook",color:"#1877F2",gradient:"linear-gradient(135deg,#1877F2,#0d5fc9)",description:"Posts, pages & groups",audience:"3B+ users",
    icon:(s=24)=><svg width={s} height={s} viewBox="0 0 24 24" fill="currentColor"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/></svg> },
  { id:"twitter",name:"X / Twitter",color:"#1DA1F2",gradient:"linear-gradient(135deg,#1DA1F2,#0c85d0)",description:"Tweets & threads",audience:"556M users",
    icon:(s=24)=><svg width={s} height={s} viewBox="0 0 24 24" fill="currentColor"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.744l7.737-8.835L1.254 2.25H8.08l4.254 5.622L18.244 2.25zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg> },
  { id:"linkedin",name:"LinkedIn",color:"#0A66C2",gradient:"linear-gradient(135deg,#0A66C2,#084d93)",description:"Professional network",audience:"900M users",
    icon:(s=24)=><svg width={s} height={s} viewBox="0 0 24 24" fill="currentColor"><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/></svg> },
  { id:"youtube",name:"YouTube",color:"#FF0000",gradient:"linear-gradient(135deg,#FF0000,#cc0000)",description:"Videos & shorts",audience:"2.7B users",
    icon:(s=24)=><svg width={s} height={s} viewBox="0 0 24 24" fill="currentColor"><path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/></svg> },
  { id:"reddit",name:"Reddit",color:"#FF4500",gradient:"linear-gradient(135deg,#FF4500,#FF6534)",description:"Posts, communities & AMAs",audience:"1.5B+ users",
    icon:(s=24)=><svg width={s} height={s} viewBox="0 0 24 24" fill="currentColor"><path d="M12 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0zm5.01 4.744c.688 0 1.25.561 1.25 1.249a1.25 1.25 0 0 1-2.498.056l-2.597-.547-.8 3.747c1.824.07 3.48.632 4.674 1.488.308-.309.73-.491 1.207-.491.968 0 1.754.786 1.754 1.754 0 .716-.435 1.333-1.01 1.614a3.111 3.111 0 0 1 .042.52c0 2.694-3.13 4.87-7.004 4.87-3.874 0-7.004-2.176-7.004-4.87 0-.183.015-.366.043-.534A1.748 1.748 0 0 1 4.028 12c0-.968.786-1.754 1.754-1.754.463 0 .898.196 1.207.49 1.207-.883 2.878-1.43 4.744-1.487l.885-4.182a.342.342 0 0 1 .14-.197.35.35 0 0 1 .238-.042l2.906.617a1.214 1.214 0 0 1 1.108-.701zM9.25 12C8.561 12 8 12.562 8 13.25c0 .687.561 1.248 1.25 1.248.687 0 1.248-.561 1.248-1.249 0-.688-.561-1.249-1.249-1.249zm5.5 0c-.687 0-1.248.561-1.248 1.25 0 .687.561 1.248 1.249 1.248.688 0 1.249-.561 1.249-1.249 0-.687-.562-1.249-1.25-1.249zm-5.466 3.99a.327.327 0 0 0-.231.094.33.33 0 0 0 0 .463c.842.842 2.484.913 2.961.913.477 0 2.105-.056 2.961-.913a.361.361 0 0 0 .029-.463.33.33 0 0 0-.464 0c-.547.533-1.684.73-2.512.73-.828 0-1.979-.196-2.512-.73a.326.326 0 0 0-.232-.095z"/></svg> },
  { id:"pinterest",name:"Pinterest",color:"#E60023",gradient:"linear-gradient(135deg,#E60023,#b50016)",description:"Pins & boards",audience:"465M users",
    icon:(s=24)=><svg width={s} height={s} viewBox="0 0 24 24" fill="currentColor"><path d="M12.017 0C5.396 0 .029 5.367.029 11.987c0 5.079 3.158 9.417 7.618 11.162-.105-.949-.199-2.403.041-3.439.219-.937 1.406-5.965 1.406-5.965s-.359-.719-.359-1.782c0-1.668.967-2.914 2.171-2.914 1.023 0 1.518.769 1.518 1.69 0 1.029-.655 2.568-.994 3.995-.283 1.194.599 2.169 1.777 2.169 2.133 0 3.772-2.249 3.772-5.495 0-2.873-2.064-4.882-5.012-4.882-3.414 0-5.418 2.561-5.418 5.207 0 1.031.397 2.138.893 2.738a.36.36 0 0 1 .083.345l-.333 1.36c-.053.22-.174.267-.402.161-1.499-.698-2.436-2.889-2.436-4.649 0-3.785 2.75-7.262 7.929-7.262 4.163 0 7.398 2.967 7.398 6.931 0 4.136-2.607 7.464-6.227 7.464-1.216 0-2.359-.631-2.75-1.378l-.748 2.853c-.271 1.043-1.002 2.35-1.492 3.146C10.58 23.812 11.773 24 13.01 24c6.607 0 11.985-5.365 11.985-11.987C24.995 5.39 18.592.026 11.985.026L12.017 0z"/></svg> },
];

const S = `
  @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800;900&display=swap');
  .vxsa-shell{display:flex;height:100vh;background:#070b12;overflow:hidden;font-family:'Inter',sans-serif;}
  .vxsa-main{flex:1;display:flex;flex-direction:column;overflow:hidden;}
  .vxsa-scroll{flex:1;overflow-y:auto;overflow-x:hidden;padding:32px 36px 80px;}
  .vxsa-scroll::-webkit-scrollbar{width:6px;}
  .vxsa-scroll::-webkit-scrollbar-thumb{background:rgba(255,255,255,0.08);border-radius:3px;}
  .vxsa-orb1{position:fixed;pointer-events:none;border-radius:50%;z-index:0;width:600px;height:600px;top:-160px;right:-120px;background:radial-gradient(circle,rgba(167,139,250,0.08) 0%,transparent 70%);}
  .vxsa-orb2{position:fixed;pointer-events:none;border-radius:50%;z-index:0;width:500px;height:500px;bottom:-150px;left:-60px;background:radial-gradient(circle,rgba(56,189,248,0.06) 0%,transparent 70%);}
  .vxsa-inner{max-width:1200px;margin:0 auto;position:relative;z-index:1;}
  .vxsa-hero{border-radius:26px;padding:30px 40px;margin-bottom:24px;background:linear-gradient(135deg,#0f1628,#111827,#0c1220);border:1px solid rgba(167,139,250,0.14);display:flex;align-items:center;justify-content:space-between;gap:20px;flex-wrap:wrap;position:relative;overflow:hidden;}
  .vxsa-hero-line{position:absolute;top:0;left:0;right:0;height:2px;background:linear-gradient(90deg,#a78bfa,#38bdf8,#a78bfa);background-size:200%;animation:shimmer 3s ease infinite;}
  @keyframes shimmer{0%,100%{background-position:0%}50%{background-position:100%}}
  .vxsa-hero-title{font-size:26px;font-weight:900;letter-spacing:-0.025em;color:#f1f5f9;margin-bottom:5px;}
  .vxsa-hero-title span{background:linear-gradient(135deg,#c4b5fd,#67e8f9);-webkit-background-clip:text;-webkit-text-fill-color:transparent;}
  .vxsa-hero-sub{color:#64748b;font-size:14px;}
  .vxsa-split{display:grid;grid-template-columns:276px 1fr;gap:20px;min-height:540px;}
  .vxsa-sidebar{border-radius:22px;background:rgba(255,255,255,0.02);border:1px solid rgba(255,255,255,0.07);overflow:hidden;display:flex;flex-direction:column;}
  .vxsa-sidebar-hd{padding:18px 20px;border-bottom:1px solid rgba(255,255,255,0.06);font-size:11px;font-weight:700;color:#334155;text-transform:uppercase;letter-spacing:0.08em;}
  .vxsa-sidebar-list{flex:1;overflow-y:auto;padding:8px;}
  .vxsa-sidebar-list::-webkit-scrollbar{width:4px;}
  .vxsa-sidebar-list::-webkit-scrollbar-thumb{background:rgba(255,255,255,0.06);border-radius:2px;}
  .vxsa-plat-row{display:flex;align-items:center;gap:12px;padding:11px 13px;border-radius:14px;cursor:pointer;transition:all 0.2s;border:1px solid transparent;margin-bottom:3px;}
  .vxsa-plat-row:hover{background:rgba(255,255,255,0.04);}
  .vxsa-plat-row.active{background:rgba(255,255,255,0.05);}
  .vxsa-plat-row-ic{width:40px;height:40px;border-radius:12px;display:flex;align-items:center;justify-content:center;color:#fff;flex-shrink:0;}
  .vxsa-plat-row-name{font-size:14px;font-weight:700;color:#e2e8f0;flex:1;}
  .vxsa-plat-row-sub{font-size:11px;color:#475569;margin-top:1px;}
  .vxsa-dot-on{width:8px;height:8px;border-radius:50%;background:#22c55e;flex-shrink:0;box-shadow:0 0 6px rgba(34,197,94,0.5);}
  .vxsa-dot-off{width:8px;height:8px;border-radius:50%;background:rgba(255,255,255,0.1);flex-shrink:0;}
  .vxsa-chevron{color:#334155;transition:all 0.2s;}
  .vxsa-plat-row.active .vxsa-chevron{color:#a78bfa;transform:translateX(2px);}
  .vxsa-sidebar-footer{padding:14px 18px;border-top:1px solid rgba(255,255,255,0.06);}
  .vxsa-panel{border-radius:22px;background:rgba(255,255,255,0.02);border:1px solid rgba(255,255,255,0.07);overflow:hidden;display:flex;flex-direction:column;}
  .vxsa-panel-hero{position:relative;padding:30px 32px 26px;overflow:hidden;}
  .vxsa-panel-hero-bg{position:absolute;inset:0;opacity:0.10;}
  .vxsa-panel-hero-orb{position:absolute;top:-70px;right:-70px;width:220px;height:220px;border-radius:50%;opacity:0.25;}
  .vxsa-panel-hero-content{position:relative;z-index:1;display:flex;align-items:center;gap:20px;flex-wrap:wrap;}
  .vxsa-panel-hero-ic{width:70px;height:70px;border-radius:22px;display:flex;align-items:center;justify-content:center;color:#fff;flex-shrink:0;}
  .vxsa-panel-hero-name{font-size:22px;font-weight:900;color:#f1f5f9;margin-bottom:3px;}
  .vxsa-panel-hero-desc{font-size:13px;color:#94a3b8;margin-bottom:8px;}
  .vxsa-chip-on{display:inline-flex;align-items:center;gap:5px;padding:4px 12px;border-radius:20px;font-size:11px;font-weight:700;color:#22c55e;background:rgba(34,197,94,0.12);border:1px solid rgba(34,197,94,0.25);}
  .vxsa-chip-off{display:inline-flex;align-items:center;gap:5px;padding:4px 12px;border-radius:20px;font-size:11px;font-weight:700;color:#475569;background:rgba(255,255,255,0.04);border:1px solid rgba(255,255,255,0.09);}
  .vxsa-panel-btn-row{display:flex;gap:10px;margin-left:auto;flex-wrap:wrap;}
  .vxsa-btn-connect{display:inline-flex;align-items:center;gap:7px;padding:10px 20px;border-radius:13px;font-size:13px;font-weight:700;cursor:pointer;transition:all 0.22s;font-family:'Inter',sans-serif;border:none;}
  .vxsa-btn-connect.off{background:linear-gradient(135deg,#a78bfa,#38bdf8);color:#fff;box-shadow:0 6px 18px rgba(167,139,250,0.28);}
  .vxsa-btn-connect.off:hover{transform:translateY(-2px);box-shadow:0 10px 24px rgba(167,139,250,0.4);}
  .vxsa-btn-connect.on{background:rgba(239,68,68,0.08);border:1px solid rgba(239,68,68,0.22)!important;color:#ef4444;}
  .vxsa-btn-connect.on:hover{background:rgba(239,68,68,0.14);}
  .vxsa-btn-ext{display:inline-flex;align-items:center;gap:6px;padding:10px 15px;border-radius:13px;font-size:13px;font-weight:700;cursor:pointer;transition:all 0.2s;font-family:'Inter',sans-serif;background:rgba(255,255,255,0.04);border:1px solid rgba(255,255,255,0.09);color:#64748b;}
  .vxsa-btn-ext:hover{background:rgba(255,255,255,0.08);color:#94a3b8;}
  .vxsa-panel-body{flex:1;overflow-y:auto;padding:22px 30px 30px;}
  .vxsa-panel-body::-webkit-scrollbar{width:5px;}
  .vxsa-panel-body::-webkit-scrollbar-thumb{background:rgba(255,255,255,0.07);border-radius:2px;}
  .vxsa-section-title{font-size:11px;font-weight:700;color:#334155;text-transform:uppercase;letter-spacing:0.08em;margin-bottom:14px;display:flex;align-items:center;gap:7px;}
  .vxsa-divider{height:1px;background:rgba(255,255,255,0.05);margin:22px 0;}
  .vxsa-stats{display:grid;grid-template-columns:repeat(4,1fr);gap:13px;margin-bottom:0;}
  .vxsa-stat{padding:16px 18px;border-radius:15px;background:rgba(255,255,255,0.02);border:1px solid rgba(255,255,255,0.06);transition:all 0.2s;}
  .vxsa-stat:hover{border-color:rgba(255,255,255,0.11);transform:translateY(-2px);}
  .vxsa-stat-ic{width:30px;height:30px;border-radius:9px;display:flex;align-items:center;justify-content:center;margin-bottom:10px;}
  .vxsa-stat-val{font-size:20px;font-weight:900;line-height:1;margin-bottom:4px;}
  .vxsa-stat-lbl{font-size:10px;font-weight:700;color:#334155;text-transform:uppercase;letter-spacing:0.07em;}
  .vxsa-post-grid{display:grid;grid-template-columns:repeat(3,1fr);gap:11px;}
  .vxsa-post{border-radius:14px;overflow:hidden;aspect-ratio:1;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:7px;cursor:pointer;transition:all 0.2s;position:relative;}
  .vxsa-post:hover{transform:scale(1.03);}
  .vxsa-post-type{font-size:10px;font-weight:700;color:#475569;text-transform:uppercase;letter-spacing:0.05em;}
  .vxsa-post-stat{font-size:11px;font-weight:700;color:#94a3b8;display:flex;align-items:center;gap:3px;}
  .vxsa-handle{display:inline-flex;align-items:center;gap:8px;padding:7px 13px;border-radius:10px;background:rgba(255,255,255,0.04);border:1px solid rgba(255,255,255,0.09);font-size:13px;font-weight:700;color:#94a3b8;margin-bottom:18px;}
  .vxsa-empty{text-align:center;padding:52px 32px;flex:1;display:flex;flex-direction:column;align-items:center;justify-content:center;}
  .vxsa-empty-ic{width:72px;height:72px;border-radius:22px;display:flex;align-items:center;justify-content:center;margin:0 auto 20px;}
  .vxsa-btn-pri{display:inline-flex;align-items:center;gap:8px;padding:11px 22px;border-radius:13px;background:linear-gradient(135deg,#a78bfa,#38bdf8);border:none;color:#fff;font-weight:700;font-size:13px;cursor:pointer;box-shadow:0 6px 20px rgba(167,139,250,0.28);transition:all 0.2s;font-family:'Inter',sans-serif;}
  .vxsa-btn-pri:hover{transform:translateY(-2px);box-shadow:0 10px 28px rgba(167,139,250,0.4);}
  .vxsa-btn-ghost{display:inline-flex;align-items:center;gap:8px;padding:10px 18px;border-radius:12px;background:rgba(255,255,255,0.04);border:1px solid rgba(255,255,255,0.09);color:#64748b;font-weight:700;font-size:13px;cursor:pointer;transition:all 0.2s;font-family:'Inter',sans-serif;}
  .vxsa-btn-ghost:hover{background:rgba(255,255,255,0.08);color:#94a3b8;}
  @media(max-width:1000px){.vxsa-split{grid-template-columns:230px 1fr;}.vxsa-stats{grid-template-columns:repeat(2,1fr);}}
  @media(max-width:760px){.vxsa-split{grid-template-columns:1fr;}.vxsa-scroll{padding:20px 16px 80px;}}
`;

export function getLinkedAccounts():string[]{try{return JSON.parse(localStorage.getItem("linkedSocialAccounts")||"[]");}catch{return[];}}
function setLinkedAccountsStore(ids:string[]){localStorage.setItem("linkedSocialAccounts",JSON.stringify(ids));}
function hexRgba(hex:string,a:number){const r=parseInt(hex.slice(1,3),16),g=parseInt(hex.slice(3,5),16),b=parseInt(hex.slice(5,7),16);return `rgba(${r},${g},${b},${a})`;}

function fmtN(n:number){if(n>=1_000_000)return(n/1_000_000).toFixed(1)+"M";if(n>=1_000)return(n/1_000).toFixed(1)+"K";return String(n);}

export default function SocialAccountsPage(){
  const navigate=useNavigate();
  const [userName,setUserName]=useState("User");
  const [linked,setLinked]=useState<string[]>([]);
  const [handles,setHandles]=useState<Record<string,string>>({});
  const [loading,setLoading]=useState(false);
  const [selected,setSelected]=useState(SOCIAL_PLATFORMS[0].id);
  // Real per-platform data from campaigns
  const [platformStats,setPlatformStats]=useState<Record<string,{reach:number;impressions:number;clicks:number;campaigns:number;ctr:string}>>({});
  const [platformCampaigns,setPlatformCampaigns]=useState<Record<string,any[]>>({});

  const fetchStatus=async()=>{
    setLoading(true);
    try{
      const u=JSON.parse(localStorage.getItem("userInfo")||"{}");
      const userId=u.id||u._id||u.email||"";
      const res=await fetch(`${API_BASE}/api/social/status?userId=${userId}`);
      const data=await res.json();
      if(data.success){
        const next:string[]=[];
        SOCIAL_PLATFORMS.forEach(p=>{if(data.socialStatus[p.id])next.push(p.id);});
        setLinked(next);setLinkedAccountsStore(next);
        const h:Record<string,string>={};
        Object.entries(data.socialStatus.handles||{}).forEach(([k,v])=>{if(v)h[k]=v as string;});
        setHandles(h);localStorage.setItem("socialHandles",JSON.stringify(h));
      }
    }catch{
      setLinked(getLinkedAccounts());
      try{setHandles(JSON.parse(localStorage.getItem("socialHandles")||"{}"));}catch{}
    }finally{setLoading(false);}
    // Load real campaign analytics per platform
    const token=localStorage.getItem("authToken");
    if(token){
      try{
        const r=await fetch(`${API_BASE}/api/campaign/analytics/summary`,{headers:{Authorization:`Bearer ${token}`}});
        const d=await r.json();
        if(d.success&&d.summary){
          const statsMap:Record<string,{reach:number;impressions:number;clicks:number;campaigns:number;ctr:string}>= {};
          (d.summary.platformBreakdown||[]).forEach((pb:any)=>{
            statsMap[pb.name.toLowerCase()]={
              reach:0,impressions:0,clicks:0,campaigns:pb.count,ctr:"0%"
            };
          });
          // Aggregate per-platform from recentActivity
          const campMap:Record<string,any[]>={};
          (d.summary.recentActivity||[]).forEach((c:any)=>{
            (c.platforms||[]).forEach((p:string)=>{
              const key=p.toLowerCase();
              if(!campMap[key])campMap[key]=[];
              campMap[key].push(c);
              if(!statsMap[key])statsMap[key]={reach:0,impressions:0,clicks:0,campaigns:0,ctr:"0%"};
              statsMap[key].reach+=(c.analytics?.reach||0);
              statsMap[key].impressions+=(c.analytics?.impressions||0);
              statsMap[key].clicks+=(c.analytics?.clicks||0);
              statsMap[key].campaigns++;
            });
          });
          Object.keys(statsMap).forEach(k=>{
            const s=statsMap[k];
            s.ctr=s.impressions>0?((s.clicks/s.impressions)*100).toFixed(2)+"%":"0%";
          });
          setPlatformStats(statsMap);
          setPlatformCampaigns(campMap);
        }
      }catch(e){console.error("Platform analytics load failed",e);}
    }
  };

  useEffect(()=>{
    if(localStorage.getItem("isAuthenticated")!=="true"){navigate("/auth",{replace:true});return;}
    const u=JSON.parse(localStorage.getItem("userInfo")||"{}");
    if(u.name)setUserName(u.name.split(" ")[0]);
    const params=new URLSearchParams(window.location.search);
    const er=params.get("error");
    if(er==="missing_credentials")toast.error("Platform credentials not configured");
    else if(er)toast.error(`Connection failed: ${er}`);
    if(params.get("success")==="true"||er)window.history.replaceState({},document.title,window.location.pathname);
    fetchStatus();
  },[navigate]);

  const handleToggle=async(platformId:string)=>{
    const u=JSON.parse(localStorage.getItem("userInfo")||"{}");
    const userId=u.id||u._id||u.email||"";
    if(linked.includes(platformId)){
      try{
        const res=await fetch(`${API_BASE}/api/social/${platformId}?userId=${userId}`,{method:"DELETE"});
        const data=await res.json();
        if(data.success){
          const next=linked.filter(id=>id!==platformId);
          setLinked(next);setLinkedAccountsStore(next);
          const h={...handles};delete h[platformId];
          setHandles(h);localStorage.setItem("socialHandles",JSON.stringify(h));
          toast.success(`${platformId} disconnected`);
        }else toast.error("Disconnect failed");
      }catch{toast.error("Could not disconnect");}
    }else{
      window.location.href=`${API_BASE}/api/social/auth/${platformId}?userId=${userId}`;
    }
  };

  const platform=SOCIAL_PLATFORMS.find(p=>p.id===selected)!;
  const isLinked=linked.includes(selected);
  const realStats=platformStats[selected];
  const realCampaigns=platformCampaigns[selected]||[];
  const userInitial=userName[0]?.toUpperCase()||"U";

  return(
    <div className="vxsa-shell">
      <style dangerouslySetInnerHTML={{__html:S}}/>
      <DashboardSidebar userName={userName} userInitial={userInitial}/>
      <div className="vxsa-main">
        <DashboardTopBar userName={userName} userInitial={userInitial}/>
        <div className="vxsa-scroll">
          <div className="vxsa-orb1"/><div className="vxsa-orb2"/>
          <div className="vxsa-inner">
            <motion.div initial={{opacity:0,y:-16}} animate={{opacity:1,y:0}} transition={{duration:0.45}} className="vxsa-hero">
              <div className="vxsa-hero-line"/>
              <div>
                <div className="vxsa-hero-title">Social <span>Accounts</span></div>
                <div className="vxsa-hero-sub">Connect your platforms and track performance from one place.</div>
              </div>
              <div style={{display:"flex",gap:10}}>
                <button className="vxsa-btn-ghost" onClick={fetchStatus} style={{padding:"10px 16px",fontSize:13}}>
                  <motion.span animate={loading?{rotate:360}:{rotate:0}} transition={{duration:1,repeat:loading?Infinity:0,ease:"linear"}} style={{display:"flex",alignItems:"center"}}><RefreshCw size={13}/></motion.span>
                  {loading?"Syncing…":"Refresh"}
                </button>
                <button className="vxsa-btn-pri" style={{padding:"10px 18px",fontSize:13}} onClick={()=>navigate("/upload")}><Zap size={13}/> Launch Campaign</button>
              </div>
            </motion.div>

            <div className="vxsa-split">
              {/* LEFT SIDEBAR */}
              <motion.div initial={{opacity:0,x:-20}} animate={{opacity:1,x:0}} transition={{delay:0.1}} className="vxsa-sidebar">
                <div className="vxsa-sidebar-hd">Platforms · <span style={{color:"#22c55e"}}>{linked.length}</span> connected</div>
                <div className="vxsa-sidebar-list">
                  {SOCIAL_PLATFORMS.map((p,i)=>{
                    const on=linked.includes(p.id);
                    const isActive=selected===p.id;
                    return(
                      <motion.div key={p.id} initial={{opacity:0,x:-12}} animate={{opacity:1,x:0}} transition={{delay:0.12+i*0.05}}
                        className={`vxsa-plat-row ${isActive?"active":""}`}
                        style={isActive?{borderColor:hexRgba(p.color,0.3),background:hexRgba(p.color,0.06)}:{}}
                        onClick={()=>setSelected(p.id)}
                      >
                        <div className="vxsa-plat-row-ic" style={{background:p.gradient}}>{p.icon(18)}</div>
                        <div style={{flex:1,minWidth:0}}>
                          <div className="vxsa-plat-row-name" style={isActive?{color:p.color}:{}}>{p.name}</div>
                          <div className="vxsa-plat-row-sub">{on?"Connected":"Not linked"}</div>
                        </div>
                        <div className={on?"vxsa-dot-on":"vxsa-dot-off"}/>
                        <ChevronRight size={14} className="vxsa-chevron"/>
                      </motion.div>
                    );
                  })}
                </div>
                <div className="vxsa-sidebar-footer">
                  <div style={{fontSize:11,color:"#334155",textAlign:"center"}}>
                    {linked.length} of {SOCIAL_PLATFORMS.length} platforms connected
                  </div>
                </div>
              </motion.div>

              {/* RIGHT PANEL */}
              <AnimatePresence mode="wait">
                <motion.div key={selected} initial={{opacity:0,x:20,scale:0.98}} animate={{opacity:1,x:0,scale:1}} exit={{opacity:0,x:-10,scale:0.98}} transition={{duration:0.28}} className="vxsa-panel">
                  <div className="vxsa-panel-hero">
                    <div className="vxsa-panel-hero-bg" style={{background:platform.gradient}}/>
                    <div className="vxsa-panel-hero-orb" style={{background:platform.gradient}}/>
                    <div className="vxsa-panel-hero-content">
                      <div className="vxsa-panel-hero-ic" style={{background:platform.gradient,boxShadow:`0 12px 32px ${hexRgba(platform.color,0.4)}`}}>{platform.icon(30)}</div>
                      <div style={{flex:1}}>
                        <div className="vxsa-panel-hero-name">{platform.name}</div>
                        <div className="vxsa-panel-hero-desc">{platform.description} · {platform.audience}</div>
                        <div className={isLinked?"vxsa-chip-on":"vxsa-chip-off"}>
                          {isLinked?<><CheckCircle2 size={11}/> Connected</>:<><Shield size={11}/> Not linked</>}
                        </div>
                      </div>
                      <div className="vxsa-panel-btn-row">
                        {isLinked&&<button className="vxsa-btn-ext" onClick={()=>window.open(`https://${platform.id}.com`,"_blank")}><ExternalLink size={13}/> Open</button>}
                        <button className={`vxsa-btn-connect ${isLinked?"on":"off"}`} onClick={()=>handleToggle(platform.id)}>
                          {isLinked?<><Unlink size={13}/> Disconnect</>:<><Link2 size={13}/> Connect {platform.name}</>}
                        </button>
                      </div>
                    </div>
                  </div>

                  <div className="vxsa-panel-body">
                    {isLinked?(
                      <>
                        {handles[selected]&&(
                          <div className="vxsa-handle">
                            <div style={{width:20,height:20,borderRadius:6,background:platform.gradient,display:"flex",alignItems:"center",justifyContent:"center",color:"#fff"}}>{platform.icon(11)}</div>
                            @{handles[selected]}
                          </div>
                        )}
                        <div className="vxsa-section-title"><BarChart3 size={12}/> Campaign Performance on {platform.name}</div>
                        <div className="vxsa-stats" style={{marginBottom:22}}>
                          {[
                            {icon:<Eye size={14}/>,bg:hexRgba(platform.color,0.12),col:platform.color,val:realStats?fmtN(realStats.impressions):"0",lbl:"Impressions"},
                            {icon:<Users size={14}/>,bg:"rgba(167,139,250,0.12)",col:"#a78bfa",val:realStats?fmtN(realStats.reach):"0",lbl:"Reach"},
                            {icon:<TrendingUp size={14}/>,bg:"rgba(34,197,94,0.12)",col:"#22c55e",val:realStats?realStats.ctr:"0%",lbl:"CTR"},
                            {icon:<Calendar size={14}/>,bg:"rgba(56,189,248,0.12)",col:"#38bdf8",val:realStats?String(realStats.campaigns):"0",lbl:"Campaigns"},
                          ].map((s,i)=>(
                            <div key={i} className="vxsa-stat">
                              <div className="vxsa-stat-ic" style={{background:s.bg,color:s.col}}>{s.icon}</div>
                              <div className="vxsa-stat-val" style={{color:s.col}}>{s.val}</div>
                              <div className="vxsa-stat-lbl">{s.lbl}</div>
                            </div>
                          ))}
                        </div>
                        {(!realStats||realStats.impressions===0)&&(
                          <div style={{fontSize:12,color:"#475569",textAlign:"center",padding:"6px 0 16px",lineHeight:1.6}}>
                            No campaign analytics yet for {platform.name}. Launch a campaign to see real data.
                          </div>
                        )}
                        <div className="vxsa-divider"/>
                        <div className="vxsa-section-title"><Clock size={12}/> Published Campaigns on {platform.name}</div>
                        {realCampaigns.length===0?(
                          <div style={{fontSize:13,color:"#334155",textAlign:"center",padding:"18px 0"}}>
                            No campaigns published to {platform.name} yet.
                          </div>
                        ):(
                          <div className="vxsa-post-grid">
                            {realCampaigns.slice(0,6).map((c:any,i:number)=>(
                              <motion.div key={i} initial={{opacity:0,scale:0.9}} animate={{opacity:1,scale:1}} transition={{delay:i*0.06}} className="vxsa-post"
                                style={{background:`linear-gradient(135deg,${hexRgba(platform.color,0.08)},rgba(255,255,255,0.02))`,border:`1px solid ${hexRgba(platform.color,0.13)}`,padding:"12px 8px"}}>
                                <div style={{width:34,height:34,borderRadius:10,background:platform.gradient,display:"flex",alignItems:"center",justifyContent:"center",color:"#fff"}}>{platform.icon(15)}</div>
                                <div className="vxsa-post-type" style={{maxWidth:"90%",overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap",textAlign:"center"}}>{c.name}</div>
                                <div style={{display:"flex",gap:8}}>
                                  <span className="vxsa-post-stat"><Eye size={9}/> {fmtN(c.analytics?.impressions||0)}</span>
                                  <span className="vxsa-post-stat"><TrendingUp size={9}/> {fmtN(c.analytics?.clicks||0)}</span>
                                </div>
                              </motion.div>
                            ))}
                          </div>
                        )}
                        <div className="vxsa-divider"/>
                        <div style={{display:"flex",gap:12,justifyContent:"center"}}>
                          <button className="vxsa-btn-pri" onClick={()=>navigate("/create-post")}><Sparkles size={13}/> Create Post for {platform.name}</button>
                          <button className="vxsa-btn-ghost" onClick={()=>navigate("/upload")}><ArrowRight size={13}/> Launch Campaign</button>
                        </div>
                      </>
                    ):(
                      <div className="vxsa-empty">
                        <div className="vxsa-empty-ic" style={{background:hexRgba(platform.color,0.08),border:`1px solid ${hexRgba(platform.color,0.18)}`}}>{platform.icon(30)}</div>
                        <div style={{fontSize:18,fontWeight:900,color:"#e2e8f0",marginBottom:8}}>{platform.name} not connected</div>
                        <div style={{fontSize:14,color:"#475569",lineHeight:1.7,maxWidth:340,marginBottom:26}}>Connect your {platform.name} account to start publishing posts and tracking analytics.</div>
                        <button className="vxsa-btn-pri" onClick={()=>handleToggle(platform.id)}><Link2 size={13}/> Connect {platform.name}</button>
                        <div style={{marginTop:14,fontSize:12,color:"#334155"}}>{platform.audience} · {platform.description}</div>
                      </div>
                    )}
                  </div>
                </motion.div>
              </AnimatePresence>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
