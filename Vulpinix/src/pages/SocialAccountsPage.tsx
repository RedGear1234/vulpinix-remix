import { useState, useEffect } from "react";
import { useNavigate } from "react-router";
import { motion, AnimatePresence } from "framer-motion";
import {
  Instagram, Facebook, Twitter, Linkedin, Youtube,
  CheckCircle2, Link2, Unlink, ExternalLink,
  AlertCircle, Sparkles, Users, TrendingUp, RefreshCw, Zap, Shield
} from "lucide-react";
import { toast } from "sonner";
import { DashboardSidebar } from "../components/DashboardSidebar";
import { DashboardTopBar } from "../components/DashboardTopBar";

export const SOCIAL_PLATFORMS = [
  { id:"instagram", name:"Instagram",  icon:<Instagram size={24}/>, color:"#E1306C", gradient:"linear-gradient(135deg,#f09433,#e6683c,#dc2743,#cc2366,#bc1888)", description:"Photos, reels & stories",  audience:"1B+ users" },
  { id:"facebook",  name:"Facebook",   icon:<Facebook  size={24}/>, color:"#1877F2", gradient:"linear-gradient(135deg,#1877F2,#0d5fc9)",                             description:"Posts, pages & groups",  audience:"3B+ users" },
  { id:"twitter",   name:"X / Twitter",icon:<Twitter   size={24}/>, color:"#1DA1F2", gradient:"linear-gradient(135deg,#1DA1F2,#0c85d0)",                             description:"Tweets & threads",      audience:"556M users" },
  { id:"linkedin",  name:"LinkedIn",   icon:<Linkedin  size={24}/>, color:"#0A66C2", gradient:"linear-gradient(135deg,#0A66C2,#084d93)",                             description:"Professional network",  audience:"900M users" },
  { id:"youtube",   name:"YouTube",    icon:<Youtube   size={24}/>, color:"#FF0000", gradient:"linear-gradient(135deg,#FF0000,#cc0000)",                             description:"Videos & shorts",       audience:"2.7B users" },
  {
    id:"reddit", name:"Reddit",
    icon:<svg width={24} height={24} viewBox="0 0 24 24" fill="currentColor"><path d="M12 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0zm5.01 4.744c.688 0 1.25.561 1.25 1.249a1.25 1.25 0 0 1-2.498.056l-2.597-.547-.8 3.747c1.824.07 3.48.632 4.674 1.488.308-.309.73-.491 1.207-.491.968 0 1.754.786 1.754 1.754 0 .716-.435 1.333-1.01 1.614a3.111 3.111 0 0 1 .042.52c0 2.694-3.13 4.87-7.004 4.87-3.874 0-7.004-2.176-7.004-4.87 0-.183.015-.366.043-.534A1.748 1.748 0 0 1 4.028 12c0-.968.786-1.754 1.754-1.754.463 0 .898.196 1.207.49 1.207-.883 2.878-1.43 4.744-1.487l.885-4.182a.342.342 0 0 1 .14-.197.35.35 0 0 1 .238-.042l2.906.617a1.214 1.214 0 0 1 1.108-.701zM9.25 12C8.561 12 8 12.562 8 13.25c0 .687.561 1.248 1.25 1.248.687 0 1.248-.561 1.248-1.249 0-.688-.561-1.249-1.249-1.249zm5.5 0c-.687 0-1.248.561-1.248 1.25 0 .687.561 1.248 1.249 1.248.688 0 1.249-.561 1.249-1.249 0-.687-.562-1.249-1.25-1.249zm-5.466 3.99a.327.327 0 0 0-.231.094.33.33 0 0 0 0 .463c.842.842 2.484.913 2.961.913.477 0 2.105-.056 2.961-.913a.361.361 0 0 0 .029-.463.33.33 0 0 0-.464 0c-.547.533-1.684.73-2.512.73-.828 0-1.979-.196-2.512-.73a.326.326 0 0 0-.232-.095z"/></svg>,
    color:"#FF4500", gradient:"linear-gradient(135deg,#FF4500,#FF6534)",
    description:"Posts, communities & AMAs", audience:"1.5B+ users"
  },
  {
    id:"pinterest", name:"Pinterest",
    icon:<svg width={24} height={24} viewBox="0 0 24 24" fill="currentColor"><path d="M12.017 0C5.396 0 .029 5.367.029 11.987c0 5.079 3.158 9.417 7.618 11.162-.105-.949-.199-2.403.041-3.439.219-.937 1.406-5.965 1.406-5.965s-.359-.719-.359-1.782c0-1.668.967-2.914 2.171-2.914 1.023 0 1.518.769 1.518 1.69 0 1.029-.655 2.568-.994 3.995-.283 1.194.599 2.169 1.777 2.169 2.133 0 3.772-2.249 3.772-5.495 0-2.873-2.064-4.882-5.012-4.882-3.414 0-5.418 2.561-5.418 5.207 0 1.031.397 2.138.893 2.738a.36.36 0 0 1 .083.345l-.333 1.36c-.053.22-.174.267-.402.161-1.499-.698-2.436-2.889-2.436-4.649 0-3.785 2.75-7.262 7.929-7.262 4.163 0 7.398 2.967 7.398 6.931 0 4.136-2.607 7.464-6.227 7.464-1.216 0-2.359-.631-2.75-1.378l-.748 2.853c-.271 1.043-1.002 2.35-1.492 3.146C10.58 23.812 11.773 24 13.01 24c6.607 0 11.985-5.365 11.985-11.987C24.995 5.39 18.592.026 11.985.026L12.017 0z"/></svg>,
    color:"#E60023", gradient:"linear-gradient(135deg,#E60023,#b50016)",
    description:"Pins & boards", audience:"465M users"
  },
];

const S = `
  @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800;900&display=swap');
  .vxsa-shell{display:flex;height:100vh;background:#070b12;overflow:hidden;font-family:'Inter',sans-serif;}
  .vxsa-main{flex:1;display:flex;flex-direction:column;overflow:hidden;}
  .vxsa-scroll{flex:1;overflow-y:auto;overflow-x:hidden;padding:32px 36px 100px;}
  .vxsa-scroll::-webkit-scrollbar{width:6px;}
  .vxsa-scroll::-webkit-scrollbar-thumb{background:rgba(255,255,255,0.08);border-radius:3px;}
  .vxsa-orb1{position:fixed;pointer-events:none;border-radius:50%;z-index:0;width:600px;height:600px;top:-160px;right:-120px;background:radial-gradient(circle,rgba(167,139,250,0.09) 0%,transparent 70%);}
  .vxsa-orb2{position:fixed;pointer-events:none;border-radius:50%;z-index:0;width:500px;height:500px;bottom:-150px;left:-60px;background:radial-gradient(circle,rgba(56,189,248,0.06) 0%,transparent 70%);}
  .vxsa-inner{max-width:1040px;margin:0 auto;position:relative;z-index:1;}
  .vxsa-hero{border-radius:28px;padding:36px 44px;margin-bottom:28px;background:linear-gradient(135deg,#0f1628 0%,#111827 60%,#0c1220 100%);border:1px solid rgba(167,139,250,0.14);display:flex;align-items:center;justify-content:space-between;gap:24px;flex-wrap:wrap;position:relative;overflow:hidden;}
  .vxsa-hero-line{position:absolute;top:0;left:0;right:0;height:2px;background:linear-gradient(90deg,#a78bfa,#38bdf8,#a78bfa);background-size:200%;animation:vxsa-shimmer 3s ease infinite;}
  @keyframes vxsa-shimmer{0%,100%{background-position:0%}50%{background-position:100%}}
  .vxsa-hero-title{font-size:28px;font-weight:900;letter-spacing:-0.025em;color:#f1f5f9;margin-bottom:6px;}
  .vxsa-hero-title span{background:linear-gradient(135deg,#c4b5fd,#67e8f9);-webkit-background-clip:text;-webkit-text-fill-color:transparent;}
  .vxsa-hero-sub{color:#64748b;font-size:14px;}
  .vxsa-stats{display:grid;grid-template-columns:repeat(3,1fr);gap:18px;margin-bottom:28px;}
  .vxsa-stat{border-radius:22px;padding:22px 24px;background:rgba(255,255,255,0.025);border:1px solid rgba(255,255,255,0.07);transition:all 0.2s;}
  .vxsa-stat:hover{border-color:rgba(255,255,255,0.12);transform:translateY(-2px);}
  .vxsa-stat-ic{width:36px;height:36px;border-radius:11px;display:flex;align-items:center;justify-content:center;margin-bottom:14px;}
  .vxsa-stat-val{font-size:28px;font-weight:900;line-height:1;margin-bottom:5px;}
  .vxsa-stat-lbl{font-size:11px;font-weight:700;color:#334155;text-transform:uppercase;letter-spacing:0.07em;}
  .vxsa-banner{border-radius:18px;padding:16px 20px;background:rgba(234,179,8,0.07);border:1px solid rgba(234,179,8,0.2);display:flex;align-items:center;gap:14px;margin-bottom:24px;}
  .vxsa-grid{display:grid;grid-template-columns:repeat(2,1fr);gap:20px;}

  /* ── Card ── */
  .vxsa-card{border-radius:24px;padding:0;background:rgba(15,18,30,0.7);border:1px solid rgba(255,255,255,0.07);transition:all 0.3s cubic-bezier(0.4,0,0.2,1);position:relative;overflow:hidden;}
  .vxsa-card:hover{border-color:var(--cc20);transform:translateY(-5px);box-shadow:0 24px 52px rgba(0,0,0,0.45),0 0 0 1px var(--cc20),inset 0 0 80px var(--cc04);}
  .vxsa-card.connected{border-color:var(--cc25);box-shadow:0 0 0 1px var(--cc15),0 12px 32px rgba(0,0,0,0.35);}
  .vxsa-card.connected:hover{border-color:var(--cc45);box-shadow:0 24px 52px rgba(0,0,0,0.45),0 0 0 1px var(--cc40),inset 0 0 80px var(--cc06);}

  .vxsa-card-strip{height:5px;width:100%;}
  .vxsa-card-body{padding:22px 24px 24px;position:relative;}
  .vxsa-card-orb{position:absolute;top:-50px;right:-50px;width:140px;height:140px;border-radius:50%;background:var(--cc05);pointer-events:none;transition:transform 0.4s,opacity 0.4s;opacity:0.7;}
  .vxsa-card:hover .vxsa-card-orb{transform:scale(1.5);opacity:1;}

  .vxsa-card-top-row{display:flex;align-items:flex-start;justify-content:space-between;margin-bottom:20px;position:relative;z-index:1;}
  .vxsa-card-icon{width:58px;height:58px;border-radius:18px;display:flex;align-items:center;justify-content:center;color:#fff;flex-shrink:0;transition:transform 0.25s,box-shadow 0.25s;box-shadow:0 8px 24px var(--cc30);}
  .vxsa-card:hover .vxsa-card-icon{transform:scale(1.1) translateY(-3px);box-shadow:0 14px 36px var(--cc45);}

  .vxsa-chip-on{padding:5px 12px;border-radius:20px;font-size:11px;font-weight:700;color:#22c55e;background:rgba(34,197,94,0.12);border:1px solid rgba(34,197,94,0.28);display:flex;align-items:center;gap:5px;}
  .vxsa-chip-off{padding:5px 12px;border-radius:20px;font-size:11px;font-weight:700;color:#334155;background:rgba(255,255,255,0.03);border:1px solid rgba(255,255,255,0.08);display:flex;align-items:center;gap:5px;}

  .vxsa-card-name{font-size:18px;font-weight:900;color:#f1f5f9;margin-bottom:3px;position:relative;z-index:1;}
  .vxsa-card-desc{font-size:12px;color:#475569;margin-bottom:8px;position:relative;z-index:1;}
  .vxsa-card-audience{font-size:11px;font-weight:700;color:var(--cc-txt);display:inline-flex;align-items:center;gap:5px;padding:4px 10px;border-radius:20px;background:var(--cc08);border:1px solid var(--cc15);margin-bottom:18px;position:relative;z-index:1;}
  .vxsa-card-handle{font-size:12px;font-weight:700;color:var(--cc-txt);background:var(--cc08);border:1px solid var(--cc15);padding:7px 13px;border-radius:10px;margin-bottom:14px;display:inline-flex;align-items:center;gap:6px;position:relative;z-index:1;}

  .vxsa-card-btn{width:100%;padding:12px 16px;border-radius:14px;font-size:13px;font-weight:700;cursor:pointer;display:flex;align-items:center;justify-content:center;gap:8px;transition:all 0.22s;font-family:'Inter',sans-serif;position:relative;z-index:1;}
  .vxsa-card-btn.off{background:var(--cc08);border:1px solid var(--cc20);color:var(--cc-txt);}
  .vxsa-card-btn.off:hover{background:var(--cc16);border-color:var(--cc40);transform:translateY(-1px);box-shadow:0 6px 18px var(--cc20);}
  .vxsa-card-btn.on{background:rgba(34,197,94,0.08);border:1px solid rgba(34,197,94,0.22);color:#22c55e;}
  .vxsa-card-btn.on:hover{background:rgba(239,68,68,0.10);border-color:rgba(239,68,68,0.3);color:#ef4444;transform:translateY(-1px);}

  .vxsa-btn-pri{display:inline-flex;align-items:center;gap:8px;padding:12px 24px;border-radius:14px;background:linear-gradient(135deg,#a78bfa,#38bdf8);border:none;color:#fff;font-weight:700;font-size:14px;cursor:pointer;box-shadow:0 6px 20px rgba(167,139,250,0.28);transition:all 0.2s;font-family:'Inter',sans-serif;}
  .vxsa-btn-pri:hover{transform:translateY(-2px);box-shadow:0 10px 28px rgba(167,139,250,0.4);}
  .vxsa-btn-ghost{display:inline-flex;align-items:center;gap:8px;padding:11px 20px;border-radius:13px;background:rgba(255,255,255,0.04);border:1px solid rgba(255,255,255,0.09);color:#64748b;font-weight:700;font-size:14px;cursor:pointer;transition:all 0.2s;font-family:'Inter',sans-serif;}
  .vxsa-btn-ghost:hover{background:rgba(255,255,255,0.08);color:#94a3b8;}
  .vxsa-cta-row{display:flex;gap:12px;justify-content:center;flex-wrap:wrap;margin-top:32px;padding:28px;border-radius:22px;background:linear-gradient(135deg,rgba(167,139,250,0.06),rgba(56,189,248,0.04));border:1px solid rgba(167,139,250,0.14);}
  @media(max-width:900px){.vxsa-grid{grid-template-columns:1fr;}.vxsa-stats{grid-template-columns:1fr 1fr;}}
  @media(max-width:640px){.vxsa-scroll{padding:20px 16px 80px;}.vxsa-hero{padding:24px 20px;}}
`;

export function getLinkedAccounts():string[]{try{return JSON.parse(localStorage.getItem("linkedSocialAccounts")||"[]");}catch{return [];}}
export function setLinkedAccounts(ids:string[]){localStorage.setItem("linkedSocialAccounts",JSON.stringify(ids));}

function hexRgba(hex:string,a:number){const r=parseInt(hex.slice(1,3),16),g=parseInt(hex.slice(3,5),16),b=parseInt(hex.slice(5,7),16);return `rgba(${r},${g},${b},${a})`;}

export default function SocialAccountsPage(){
  const navigate=useNavigate();
  const [userName,setUserName]=useState("User");
  const [linked,setLinked]=useState<string[]>([]);
  const [handles,setHandles]=useState<Record<string,string>>({});
  const [loading,setLoading]=useState(false);

  const fetchStatus=async()=>{
    setLoading(true);
    try{
      const u=JSON.parse(localStorage.getItem("userInfo")||"{}");
      const userId=u.id||u._id||u.email||"";
      const res=await fetch(`http://localhost:5000/api/social/status?userId=${userId}`);
      const data=await res.json();
      if(data.success){
        const next:string[]=[];
        ["facebook","instagram","twitter","linkedin","youtube","reddit","pinterest"].forEach(id=>{if(data.socialStatus[id])next.push(id);});
        setLinked(next);setLinkedAccounts(next);
        const h:Record<string,string>={};
        Object.entries(data.socialStatus.handles||{}).forEach(([k,v])=>{if(v)h[k]=v as string;});
        setHandles(h);localStorage.setItem("socialHandles",JSON.stringify(h));
      }
    }catch{
      setLinked(getLinkedAccounts());
      try{setHandles(JSON.parse(localStorage.getItem("socialHandles")||"{}"));}catch{}
    }finally{setLoading(false);}
  };

  useEffect(()=>{
    if(localStorage.getItem("isAuthenticated")!=="true"){navigate("/auth",{replace:true});return;}
    const u=JSON.parse(localStorage.getItem("userInfo")||"{}");
    if(u.name)setUserName(u.name.split(" ")[0]);
    const params=new URLSearchParams(window.location.search);
    const s=params.get("success"),pl=params.get("platform"),er=params.get("error");
    if(s==="true"||er){
      if(er==="missing_credentials"){const n=pl?pl.charAt(0).toUpperCase()+pl.slice(1):"Platform";toast.error(`${n} credentials not configured in .env`);}
      else if(er){toast.error(`Connection failed: ${er}`);}
      window.history.replaceState({},document.title,window.location.pathname);
    }
    fetchStatus();
  },[navigate]);

  const handleToggle=async(platformId:string)=>{
    const u=JSON.parse(localStorage.getItem("userInfo")||"{}");
    const userId=u.id||u._id||u.email||"";
    if(linked.includes(platformId)){
      try{
        const res=await fetch(`http://localhost:5000/api/social/${platformId}?userId=${userId}`,{method:"DELETE"});
        const data=await res.json();
        if(data.success){
          const next=linked.filter(id=>id!==platformId);setLinked(next);setLinkedAccounts(next);
          const h={...handles};delete h[platformId];setHandles(h);localStorage.setItem("socialHandles",JSON.stringify(h));
          toast.success(`${platformId} disconnected`);
        }else toast.error("Disconnect failed");
      }catch{toast.error("Could not disconnect");}
    }else{window.location.href=`http://localhost:5000/api/social/auth/${platformId}?userId=${userId}`;}
  };

  const userInitial=userName[0]?.toUpperCase()||"U";
  const FV={initial:{opacity:0,y:20},animate:{opacity:1,y:0}};

  return(
    <div className="vxsa-shell">
      <style dangerouslySetInnerHTML={{__html:S}}/>
      <DashboardSidebar userName={userName} userInitial={userInitial}/>
      <div className="vxsa-main">
        <DashboardTopBar userName={userName} userInitial={userInitial}/>
        <div className="vxsa-scroll">
          <div className="vxsa-orb1"/><div className="vxsa-orb2"/>
          <div className="vxsa-inner">
            <motion.div {...FV} transition={{duration:0.45}} className="vxsa-hero">
              <div className="vxsa-hero-line"/>
              <div>
                <div className="vxsa-hero-title">Social <span>Accounts</span></div>
                <div className="vxsa-hero-sub">Connect your profiles to enable posting and campaign publishing.</div>
              </div>
              <div style={{display:"flex",gap:10}}>
                <button className="vxsa-btn-ghost" onClick={fetchStatus}>
                  <motion.span animate={loading?{rotate:360}:{rotate:0}} transition={{duration:1,repeat:loading?Infinity:0,ease:"linear"}} style={{display:"flex",alignItems:"center"}}><RefreshCw size={13}/></motion.span>
                  {loading?"Syncing…":"Refresh"}
                </button>
                <button className="vxsa-btn-pri" onClick={()=>navigate("/create-post")}><Zap size={14}/> Create Post</button>
              </div>
            </motion.div>

            <AnimatePresence>
              {linked.length===0&&(
                <motion.div initial={{opacity:0,height:0}} animate={{opacity:1,height:"auto"}} exit={{opacity:0,height:0}} style={{overflow:"hidden",marginBottom:22}}>
                  <div className="vxsa-banner">
                    <AlertCircle size={20} color="#eab308" style={{flexShrink:0}}/>
                    <div>
                      <div style={{fontWeight:700,fontSize:14,color:"#e2e8f0",marginBottom:2}}>No accounts linked yet</div>
                      <div style={{fontSize:13,color:"#475569"}}>Connect at least one platform to create posts and launch campaigns.</div>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            <div className="vxsa-stats">
              {[
                {icon:<Users size={17}/>,bg:"rgba(167,139,250,0.12)",col:"#a78bfa",val:linked.length,lbl:"Accounts Linked"},
                {icon:<Link2 size={17}/>,bg:"rgba(56,189,248,0.12)",col:"#38bdf8",val:SOCIAL_PLATFORMS.length-linked.length,lbl:"Available to Connect"},
                {icon:<TrendingUp size={17}/>,bg:linked.length>0?"rgba(34,197,94,0.12)":"rgba(239,68,68,0.12)",col:linked.length>0?"#22c55e":"#ef4444",val:linked.length>0?"Ready":"Locked",lbl:"Campaign Status"},
              ].map((s,i)=>(
                <motion.div key={i} initial={{opacity:0,y:20}} animate={{opacity:1,y:0}} transition={{delay:0.08+i*0.07}} className="vxsa-stat">
                  <div className="vxsa-stat-ic" style={{background:s.bg,color:s.col}}>{s.icon}</div>
                  <div className="vxsa-stat-val" style={{color:s.col}}>{s.val}</div>
                  <div className="vxsa-stat-lbl">{s.lbl}</div>
                </motion.div>
              ))}
            </div>

            <div className="vxsa-grid">
              {SOCIAL_PLATFORMS.map((p,i)=>{
                const isLinked=linked.includes(p.id);
                const vars={
                  "--cc04":hexRgba(p.color,0.04),"--cc05":hexRgba(p.color,0.05),
                  "--cc06":hexRgba(p.color,0.06),"--cc08":hexRgba(p.color,0.08),
                  "--cc15":hexRgba(p.color,0.15),"--cc16":hexRgba(p.color,0.16),
                  "--cc20":hexRgba(p.color,0.20),"--cc25":hexRgba(p.color,0.25),
                  "--cc30":hexRgba(p.color,0.30),"--cc40":hexRgba(p.color,0.40),
                  "--cc45":hexRgba(p.color,0.45),"--cc-txt":p.color,
                } as React.CSSProperties;
                return(
                  <motion.div
                    key={p.id}
                    initial={{opacity:0,y:28}}
                    animate={{opacity:1,y:0}}
                    transition={{delay:0.1+i*0.055,type:"spring",stiffness:260,damping:22}}
                    className={`vxsa-card ${isLinked?"connected":""}`}
                    style={vars}
                  >
                    <div className="vxsa-card-strip" style={{background:p.gradient}}/>
                    <div className="vxsa-card-body">
                      <div className="vxsa-card-orb"/>
                      <div className="vxsa-card-top-row">
                        <div className="vxsa-card-icon" style={{background:p.gradient}}>{p.icon}</div>
                        {isLinked
                          ?<div className="vxsa-chip-on"><CheckCircle2 size={11}/> Connected</div>
                          :<div className="vxsa-chip-off"><Shield size={11}/> Not linked</div>
                        }
                      </div>
                      <div className="vxsa-card-name">{p.name}</div>
                      <div className="vxsa-card-desc">{p.description}</div>
                      <div className="vxsa-card-audience"><Users size={10}/> {p.audience}</div>
                      {isLinked&&handles[p.id]&&(
                        <div className="vxsa-card-handle">@ {handles[p.id]}</div>
                      )}
                      <button className={`vxsa-card-btn ${isLinked?"on":"off"}`} onClick={()=>handleToggle(p.id)}>
                        {isLinked?<><Unlink size={13}/> Disconnect</>:<><ExternalLink size={13}/> Connect {p.name}</>}
                      </button>
                    </div>
                  </motion.div>
                );
              })}
            </div>

            <AnimatePresence>
              {linked.length>0&&(
                <motion.div initial={{opacity:0,y:16}} animate={{opacity:1,y:0}} exit={{opacity:0}} transition={{delay:0.3}} className="vxsa-cta-row">
                  <div style={{width:"100%",textAlign:"center",marginBottom:16}}>
                    <div style={{fontSize:14,color:"#64748b",display:"flex",alignItems:"center",justifyContent:"center",gap:7}}>
                      <Sparkles size={14} color="#a78bfa"/>
                      <span><strong style={{color:"#c4b5fd"}}>{linked.length}</strong> account{linked.length>1?"s":""} connected — ready to publish!</span>
                    </div>
                  </div>
                  <button className="vxsa-btn-pri" onClick={()=>navigate("/create-post")}><Zap size={14}/> Create a Post</button>
                  <button className="vxsa-btn-ghost" onClick={()=>navigate("/upload")}>Upload Campaign</button>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </div>
  );
}
