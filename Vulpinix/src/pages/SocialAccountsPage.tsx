import { useState, useEffect } from "react";
import { useNavigate } from "react-router";
import { motion, AnimatePresence } from "framer-motion";
import {
  Instagram, Facebook, Twitter, Linkedin, Youtube,
  CheckCircle2, Link2, Unlink, ExternalLink,
  AlertCircle, Sparkles, Users, TrendingUp, RefreshCw, Zap
} from "lucide-react";
import { toast } from "sonner";
import { DashboardSidebar } from "../components/DashboardSidebar";
import { DashboardTopBar } from "../components/DashboardTopBar";

export const SOCIAL_PLATFORMS = [
  { id:"instagram", name:"Instagram",  icon:<Instagram size={22}/>, color:"#E1306C", gradient:"linear-gradient(135deg,#f09433,#e6683c,#dc2743,#cc2366,#bc1888)", description:"Photos, reels & stories" },
  { id:"facebook",  name:"Facebook",   icon:<Facebook  size={22}/>, color:"#1877F2", gradient:"linear-gradient(135deg,#1877F2,#0d5fc9)",                             description:"Posts, pages & groups" },
  { id:"twitter",   name:"X / Twitter",icon:<Twitter   size={22}/>, color:"#1DA1F2", gradient:"linear-gradient(135deg,#1DA1F2,#0c85d0)",                             description:"Tweets & threads" },
  { id:"linkedin",  name:"LinkedIn",   icon:<Linkedin  size={22}/>, color:"#0A66C2", gradient:"linear-gradient(135deg,#0A66C2,#084d93)",                             description:"Professional network" },
  { id:"youtube",   name:"YouTube",    icon:<Youtube   size={22}/>, color:"#FF0000", gradient:"linear-gradient(135deg,#FF0000,#cc0000)",                             description:"Videos & shorts" },
  {
    id:"tiktok", name:"TikTok",
    icon:<span style={{fontWeight:900,fontSize:16,lineHeight:1,color:"#fff"}}>TK</span>,
    color:"#69C9D0", gradient:"linear-gradient(135deg,#010101,#69C9D0,#EE1D52)",
    description:"Short-form videos"
  },
  {
    id:"pinterest", name:"Pinterest",
    icon:<svg width={22} height={22} viewBox="0 0 24 24" fill="currentColor"><path d="M12.017 0C5.396 0 .029 5.367.029 11.987c0 5.079 3.158 9.417 7.618 11.162-.105-.949-.199-2.403.041-3.439.219-.937 1.406-5.965 1.406-5.965s-.359-.719-.359-1.782c0-1.668.967-2.914 2.171-2.914 1.023 0 1.518.769 1.518 1.69 0 1.029-.655 2.568-.994 3.995-.283 1.194.599 2.169 1.777 2.169 2.133 0 3.772-2.249 3.772-5.495 0-2.873-2.064-4.882-5.012-4.882-3.414 0-5.418 2.561-5.418 5.207 0 1.031.397 2.138.893 2.738a.36.36 0 0 1 .083.345l-.333 1.36c-.053.22-.174.267-.402.161-1.499-.698-2.436-2.889-2.436-4.649 0-3.785 2.75-7.262 7.929-7.262 4.163 0 7.398 2.967 7.398 6.931 0 4.136-2.607 7.464-6.227 7.464-1.216 0-2.359-.631-2.75-1.378l-.748 2.853c-.271 1.043-1.002 2.35-1.492 3.146C10.58 23.812 11.773 24 13.01 24c6.607 0 11.985-5.365 11.985-11.987C24.995 5.39 18.592.026 11.985.026L12.017 0z"/></svg>,
    color:"#E60023", gradient:"linear-gradient(135deg,#E60023,#b50016)",
    description:"Pins & boards"
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
  .vxsa-inner{max-width:1000px;margin:0 auto;position:relative;z-index:1;}

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

  .vxsa-grid{display:grid;grid-template-columns:repeat(2,1fr);gap:18px;}
  .vxsa-card{border-radius:22px;padding:24px 26px;background:rgba(255,255,255,0.025);border:1px solid rgba(255,255,255,0.07);transition:all 0.25s;position:relative;overflow:hidden;}
  .vxsa-card.connected{border-color:rgba(34,197,94,0.25);}
  .vxsa-card:hover{border-color:rgba(255,255,255,0.14);transform:translateY(-3px);}
  .vxsa-card.connected:hover{border-color:rgba(34,197,94,0.4);}
  .vxsa-card-accent{position:absolute;top:0;left:0;right:0;height:3px;}

  .vxsa-plat-hd{display:flex;align-items:center;gap:14px;margin-bottom:16px;}
  .vxsa-plat-ic{width:48px;height:48px;border-radius:14px;display:flex;align-items:center;justify-content:center;color:#fff;flex-shrink:0;box-shadow:0 6px 16px rgba(0,0,0,0.3);}
  .vxsa-plat-name{font-size:16px;font-weight:800;color:#e2e8f0;margin-bottom:2px;}
  .vxsa-plat-desc{font-size:12px;color:#475569;}

  .vxsa-badge-connected{display:inline-flex;align-items:center;gap:6px;font-size:11px;font-weight:700;color:#22c55e;background:rgba(34,197,94,0.10);border:1px solid rgba(34,197,94,0.2);padding:4px 11px;border-radius:20px;margin-bottom:14px;}
  .vxsa-badge-disconnected{display:inline-flex;align-items:center;gap:6px;font-size:11px;font-weight:700;color:#475569;background:rgba(255,255,255,0.03);border:1px solid rgba(255,255,255,0.08);padding:4px 11px;border-radius:20px;margin-bottom:14px;}

  .vxsa-btn-connect{width:100%;padding:11px 14px;border-radius:13px;border:none;font-size:13px;font-weight:700;cursor:pointer;display:flex;align-items:center;justify-content:center;gap:8px;transition:all 0.2s;font-family:'Inter',sans-serif;}
  .vxsa-btn-connect.off{background:rgba(167,139,250,0.08);border:1px solid rgba(167,139,250,0.2);color:#a78bfa;}
  .vxsa-btn-connect.off:hover{background:rgba(167,139,250,0.16);border-color:rgba(167,139,250,0.4);}
  .vxsa-btn-connect.on{background:rgba(34,197,94,0.08);border:1px solid rgba(34,197,94,0.2);color:#22c55e;}
  .vxsa-btn-connect.on:hover{background:rgba(239,68,68,0.08);border-color:rgba(239,68,68,0.25);color:#ef4444;}
  .vxsa-btn-connect.on:hover .disconnect-text::before{content:"Disconnect ";display:inline;}
  .vxsa-btn-connect.on:hover .connect-text{display:none;}

  .vxsa-btn-pri{display:inline-flex;align-items:center;gap:8px;padding:12px 24px;border-radius:14px;background:linear-gradient(135deg,#a78bfa,#38bdf8);border:none;color:#fff;font-weight:700;font-size:14px;cursor:pointer;box-shadow:0 6px 20px rgba(167,139,250,0.28);transition:all 0.2s;font-family:'Inter',sans-serif;}
  .vxsa-btn-pri:hover{transform:translateY(-2px);box-shadow:0 10px 28px rgba(167,139,250,0.4);}
  .vxsa-btn-ghost{display:inline-flex;align-items:center;gap:8px;padding:11px 20px;border-radius:13px;background:rgba(255,255,255,0.04);border:1px solid rgba(255,255,255,0.09);color:#64748b;font-weight:700;font-size:14px;cursor:pointer;transition:all 0.2s;font-family:'Inter',sans-serif;}
  .vxsa-btn-ghost:hover{background:rgba(255,255,255,0.08);color:#94a3b8;}

  .vxsa-cta-row{display:flex;gap:12px;justify-content:center;flex-wrap:wrap;margin-top:32px;padding:28px;border-radius:22px;background:linear-gradient(135deg,rgba(167,139,250,0.06),rgba(56,189,248,0.04));border:1px solid rgba(167,139,250,0.14);}

  @media(max-width:768px){.vxsa-grid{grid-template-columns:1fr;}.vxsa-stats{grid-template-columns:1fr 1fr;}}
  @media(max-width:640px){.vxsa-scroll{padding:20px 16px 80px;}.vxsa-hero{padding:24px 20px;}}
`;

export function getLinkedAccounts():string[]{try{return JSON.parse(localStorage.getItem("linkedSocialAccounts")||"[]");}catch{return [];}}
export function setLinkedAccounts(ids:string[]){localStorage.setItem("linkedSocialAccounts",JSON.stringify(ids));}

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
        const ids=["facebook","instagram","twitter","linkedin","youtube","tiktok","pinterest"];
        ids.forEach(id=>{if(data.socialStatus[id])next.push(id);});
        setLinked(next);setLinkedAccounts(next);
        const h:Record<string,string>={};
        Object.entries(data.socialStatus.handles||{}).forEach(([k,v])=>{if(v)h[k]=v as string;});
        setHandles(h);localStorage.setItem("socialHandles",JSON.stringify(h));
      }
    }catch{
      const saved=getLinkedAccounts();
      setLinked(saved);
      try{setHandles(JSON.parse(localStorage.getItem("socialHandles")||"{}"));}catch{}
    }finally{setLoading(false);}
  };

  useEffect(()=>{
    if(localStorage.getItem("isAuthenticated")!=="true"){navigate("/auth",{replace:true});return;}
    const u=JSON.parse(localStorage.getItem("userInfo")||"{}");
    if(u.name)setUserName(u.name.split(" ")[0]);
    const params=new URLSearchParams(window.location.search);
    const success=params.get("success");
    const platform=params.get("platform");
    const error=params.get("error");
    if(success==="true"||error){
      if(error==="missing_credentials"){
        const pName=platform?platform.charAt(0).toUpperCase()+platform.slice(1):"This platform";
        toast.error(`${pName} API credentials not configured. Add them to the backend .env file.`);
      }else if(error){toast.error(`Connection failed: ${error}`);}
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
          const next=linked.filter(id=>id!==platformId);
          setLinked(next);setLinkedAccounts(next);
          const h={...handles};delete h[platformId];
          setHandles(h);localStorage.setItem("socialHandles",JSON.stringify(h));
          toast.success(`${platformId} disconnected`);
        }else toast.error("Disconnect failed");
      }catch{toast.error("Disconnect failed");}
    }else{
      window.location.href=`http://localhost:5000/api/social/auth/${platformId}?userId=${userId}`;
    }
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

            {/* Hero */}
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

            {/* Warning banner */}
            <AnimatePresence>
              {linked.length===0&&(
                <motion.div initial={{opacity:0,height:0}} animate={{opacity:1,height:"auto"}} exit={{opacity:0,height:0}} style={{overflow:"hidden",marginBottom:22}}>
                  <div className="vxsa-banner">
                    <AlertCircle size={20} color="#eab308" style={{flexShrink:0}}/>
                    <div>
                      <div style={{fontWeight:700,fontSize:14,color:"#e2e8f0",marginBottom:2}}>No accounts linked yet</div>
                      <div style={{fontSize:13,color:"#475569"}}>Connect at least one social account to create posts and publish campaigns.</div>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* KPI stats */}
            <div className="vxsa-stats">
              {[
                {icon:<Users size={17}/>,ic_bg:"rgba(167,139,250,0.12)",ic_col:"#a78bfa",val:linked.length,col:"#a78bfa",lbl:"Accounts Linked"},
                {icon:<Link2 size={17}/>,ic_bg:"rgba(56,189,248,0.12)",ic_col:"#38bdf8",val:SOCIAL_PLATFORMS.length-linked.length,col:"#38bdf8",lbl:"Available to Connect"},
                {icon:<TrendingUp size={17}/>,ic_bg:linked.length>0?"rgba(34,197,94,0.12)":"rgba(239,68,68,0.12)",ic_col:linked.length>0?"#22c55e":"#ef4444",val:linked.length>0?"Ready":"Locked",col:linked.length>0?"#22c55e":"#ef4444",lbl:"Campaign Status"},
              ].map((s,i)=>(
                <motion.div key={i} initial={{opacity:0,y:20}} animate={{opacity:1,y:0}} transition={{delay:0.08+i*0.07}} className="vxsa-stat">
                  <div className="vxsa-stat-ic" style={{background:s.ic_bg,color:s.ic_col}}>{s.icon}</div>
                  <div className="vxsa-stat-val" style={{color:s.col}}>{s.val}</div>
                  <div className="vxsa-stat-lbl">{s.lbl}</div>
                </motion.div>
              ))}
            </div>

            {/* Platform cards grid */}
            <div className="vxsa-grid">
              {SOCIAL_PLATFORMS.map((p,i)=>{
                const isLinked=linked.includes(p.id);
                return(
                  <motion.div
                    key={p.id}
                    initial={{opacity:0,y:24}}
                    animate={{opacity:1,y:0}}
                    transition={{delay:0.12+i*0.05}}
                    className={`vxsa-card ${isLinked?"connected":""}`}
                  >
                    <div className="vxsa-card-accent" style={{background:p.gradient}}/>
                    <div className="vxsa-plat-hd">
                      <div className="vxsa-plat-ic" style={{background:p.gradient}}>{p.icon}</div>
                      <div style={{flex:1}}>
                        <div className="vxsa-plat-name">{p.name}</div>
                        <div className="vxsa-plat-desc">{p.description}</div>
                      </div>
                      {isLinked&&<CheckCircle2 size={20} color="#22c55e"/>}
                    </div>

                    {isLinked?(
                      <div className="vxsa-badge-connected">
                        <CheckCircle2 size={11}/> Connected{handles[p.id]?` · ${handles[p.id]}`:""}
                      </div>
                    ):(
                      <div className="vxsa-badge-disconnected">
                        <span style={{width:6,height:6,borderRadius:"50%",background:"#334155",display:"inline-block"}}/> Not connected
                      </div>
                    )}

                    <button
                      className={`vxsa-btn-connect ${isLinked?"on":"off"}`}
                      onClick={()=>handleToggle(p.id)}
                    >
                      {isLinked?(
                        <><Unlink size={13}/> Disconnect</>
                      ):(
                        <><ExternalLink size={13}/> Connect {p.name}</>
                      )}
                    </button>
                  </motion.div>
                );
              })}
            </div>

            {/* CTA row when connected */}
            <AnimatePresence>
              {linked.length>0&&(
                <motion.div initial={{opacity:0,y:16}} animate={{opacity:1,y:0}} exit={{opacity:0}} transition={{delay:0.3}} className="vxsa-cta-row">
                  <div style={{width:"100%",textAlign:"center",marginBottom:16}}>
                    <div style={{fontSize:14,color:"#64748b",display:"flex",alignItems:"center",justifyContent:"center",gap:7}}>
                      <Sparkles size={14} color="#a78bfa"/>
                      <span><strong style={{color:"#c4b5fd"}}>{linked.length}</strong> account{linked.length>1?"s":""} connected — you're ready to publish!</span>
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
