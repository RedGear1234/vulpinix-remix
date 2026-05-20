import { API_BASE } from "../config/api";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router";
import { motion, AnimatePresence } from "framer-motion";
import {
  BarChart3, TrendingUp, Clock, XCircle, Bell, X, Calendar,
  Instagram, Facebook, Youtube, Linkedin, Twitter, Globe, Plus,
  Eye, MousePointer, DollarSign, Zap, CheckCircle2, AlertCircle,
  RefreshCw, ArrowRight, Activity, Target
} from "lucide-react";
import { toast } from "sonner";
import { DashboardSidebar } from "../components/DashboardSidebar";
import { DashboardTopBar } from "../components/DashboardTopBar";

type CampaignStatus="pending"|"in_review"|"approved"|"rejected"|"running"|"completed"|"published";
interface Campaign{id:string;businessName:string;name:string;platforms:string[];budget:string;dateSubmitted:string;status:CampaignStatus;rejectionReason?:string;analytics?:{impressions:number;reach:number;clicks:number;ctr:number;conversions:number;adSpend:number;roas:number;};}
interface Notif{id:string;type:string;message:string;timestamp:string;dismissed:boolean;}

const S=`
  @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800;900&display=swap');
  .vxan-shell{display:flex;height:100vh;background:#070b12;overflow:hidden;font-family:'Inter',sans-serif;}
  .vxan-main{flex:1;display:flex;flex-direction:column;overflow:hidden;}
  .vxan-scroll{flex:1;overflow-y:auto;overflow-x:hidden;padding:32px 36px 100px;}
  .vxan-scroll::-webkit-scrollbar{width:6px;}
  .vxan-scroll::-webkit-scrollbar-thumb{background:rgba(255,255,255,0.08);border-radius:3px;}
  .vxan-orb1{position:fixed;pointer-events:none;border-radius:50%;z-index:0;width:600px;height:600px;top:-160px;right:-120px;background:radial-gradient(circle,rgba(167,139,250,0.09) 0%,transparent 70%);}
  .vxan-orb2{position:fixed;pointer-events:none;border-radius:50%;z-index:0;width:500px;height:500px;bottom:-150px;left:-60px;background:radial-gradient(circle,rgba(56,189,248,0.06) 0%,transparent 70%);}
  .vxan-inner{max-width:1200px;margin:0 auto;position:relative;z-index:1;}
  .vxan-hero{border-radius:28px;padding:36px 44px;margin-bottom:28px;background:linear-gradient(135deg,#0f1628 0%,#111827 60%,#0c1220 100%);border:1px solid rgba(167,139,250,0.14);display:flex;align-items:center;justify-content:space-between;gap:24px;flex-wrap:wrap;position:relative;overflow:hidden;}
  .vxan-hero-line{position:absolute;top:0;left:0;right:0;height:2px;background:linear-gradient(90deg,#a78bfa,#38bdf8,#a78bfa);background-size:200%;animation:vxan-shimmer 3s ease infinite;}
  @keyframes vxan-shimmer{0%,100%{background-position:0%}50%{background-position:100%}}
  .vxan-hero-title{font-size:28px;font-weight:900;letter-spacing:-0.025em;color:#f1f5f9;margin-bottom:6px;}
  .vxan-hero-title span{background:linear-gradient(135deg,#c4b5fd,#67e8f9);-webkit-background-clip:text;-webkit-text-fill-color:transparent;}
  .vxan-hero-sub{color:#64748b;font-size:14px;}
  .vxan-notif{border-radius:16px;padding:14px 18px;background:rgba(234,179,8,0.07);border:1px solid rgba(234,179,8,0.2);display:flex;align-items:center;gap:14px;margin-bottom:16px;}
  .vxan-kpis{display:grid;grid-template-columns:repeat(4,1fr);gap:18px;margin-bottom:28px;}
  .vxan-kpi{border-radius:22px;padding:22px 24px;background:rgba(255,255,255,0.025);border:1px solid rgba(255,255,255,0.07);transition:all 0.2s;}
  .vxan-kpi:hover{border-color:rgba(255,255,255,0.14);transform:translateY(-2px);}
  .vxan-kpi-ic{width:38px;height:38px;border-radius:12px;display:flex;align-items:center;justify-content:center;margin-bottom:16px;}
  .vxan-kpi-val{font-size:28px;font-weight:900;line-height:1;margin-bottom:5px;}
  .vxan-kpi-lbl{font-size:11px;font-weight:700;color:#334155;text-transform:uppercase;letter-spacing:0.07em;}
  .vxan-campaign{border-radius:22px;padding:28px 32px;margin-bottom:18px;background:rgba(255,255,255,0.025);border:1px solid rgba(255,255,255,0.07);transition:all 0.25s;}
  .vxan-campaign:last-child{margin-bottom:0;}
  .vxan-plat-ic{width:34px;height:34px;border-radius:10px;background:rgba(255,255,255,0.04);border:1px solid rgba(255,255,255,0.08);display:flex;align-items:center;justify-content:center;color:#475569;}
  .vxan-stats{display:grid;grid-template-columns:repeat(auto-fit,minmax(110px,1fr));gap:16px;padding:20px;border-radius:16px;background:rgba(255,255,255,0.02);border:1px solid rgba(255,255,255,0.06);margin-top:20px;}
  .vxan-stat-lbl{font-size:10px;font-weight:700;color:#334155;text-transform:uppercase;letter-spacing:0.07em;margin-bottom:5px;display:flex;align-items:center;gap:5px;}
  .vxan-stat-val{font-size:20px;font-weight:800;color:#e2e8f0;}
  .vxan-status{padding:5px 13px;border-radius:20px;font-size:11px;font-weight:700;display:flex;align-items:center;gap:5px;}
  .vxan-reject{margin-top:20px;padding:18px 20px;background:rgba(239,68,68,0.05);border:1px solid rgba(239,68,68,0.15);border-radius:14px;}
  .vxan-empty{text-align:center;padding:80px 24px;background:rgba(255,255,255,0.015);border-radius:28px;border:2px dashed rgba(255,255,255,0.06);}
  .vxan-btn-pri{display:inline-flex;align-items:center;gap:8px;padding:12px 22px;border-radius:14px;background:linear-gradient(135deg,#a78bfa,#38bdf8);border:none;color:#fff;font-weight:700;font-size:14px;cursor:pointer;box-shadow:0 6px 20px rgba(167,139,250,0.28);transition:all 0.2s;font-family:'Inter',sans-serif;}
  .vxan-btn-pri:hover{transform:translateY(-2px);}
  .vxan-btn-ghost{display:inline-flex;align-items:center;gap:7px;padding:10px 18px;border-radius:13px;background:rgba(255,255,255,0.04);border:1px solid rgba(255,255,255,0.09);color:#64748b;font-weight:700;font-size:13px;cursor:pointer;transition:all 0.2s;font-family:'Inter',sans-serif;}
  .vxan-btn-ghost:hover{background:rgba(255,255,255,0.08);color:#94a3b8;}
  @media(max-width:1100px){.vxan-kpis{grid-template-columns:repeat(2,1fr);}}
  @media(max-width:640px){.vxan-scroll{padding:20px 16px 80px;}.vxan-hero{padding:24px 20px;}.vxan-campaign{padding:20px;}}
`;

function getPlatformIcon(platform:string){
  switch(platform.toLowerCase()){case"instagram":return<Instagram size={14}/>;case"facebook":return<Facebook size={14}/>;case"youtube":return<Youtube size={14}/>;case"linkedin":return<Linkedin size={14}/>;case"twitter":case"x":return<Twitter size={14}/>;default:return<Globe size={14}/>;}
}

function getStatusStyle(status:CampaignStatus):React.CSSProperties{
  const m:Record<string,[string,string,string]>={
    pending:["rgba(234,179,8,.10)","rgba(234,179,8,.25)","#eab308"],
    in_review:["rgba(234,179,8,.10)","rgba(234,179,8,.25)","#eab308"],
    approved:["rgba(34,197,94,.10)","rgba(34,197,94,.25)","#22c55e"],
    running:["rgba(34,197,94,.10)","rgba(34,197,94,.25)","#22c55e"],
    published:["rgba(34,197,94,.10)","rgba(34,197,94,.25)","#22c55e"],
    completed:["rgba(56,189,248,.10)","rgba(56,189,248,.25)","#38bdf8"],
    rejected:["rgba(239,68,68,.10)","rgba(239,68,68,.25)","#ef4444"],
  };
  const[bg,border,color]=m[status]??m.pending;
  return{background:bg,border:`1px solid ${border}`,color};
}

export default function CampaignsDashboardPage(){
  const navigate=useNavigate();
  const[campaigns,setCampaigns]=useState<Campaign[]>([]);
  const[notifications,setNotifications]=useState<Notif[]>([]);
  const[loading,setLoading]=useState(false);

  useEffect(()=>{
    if(localStorage.getItem("isAuthenticated")!=="true"){navigate("/auth",{replace:true});return;}
    loadCampaigns();
    const raw=localStorage.getItem("adminNotifications");
    if(raw){try{setNotifications(JSON.parse(raw).filter((n:Notif)=>!n.dismissed));}catch{}}
  },[navigate]);

  const loadCampaigns=async()=>{
    setLoading(true);
    const token=localStorage.getItem("authToken");
    if(!token){const raw=localStorage.getItem("userCampaigns");if(raw){try{setCampaigns(JSON.parse(raw));}catch{}}setLoading(false);return;}
    try{
      const res=await fetch(`${API_BASE}/api/campaign/my-campaigns`,{headers:{Authorization:`Bearer ${token}`}});
      const data=await res.json();
      if(data.success&&data.campaigns)setCampaigns(data.campaigns);
    }catch{const raw=localStorage.getItem("userCampaigns");if(raw){try{setCampaigns(JSON.parse(raw));}catch{}}}
    finally{setLoading(false);}
  };

  const dismissNotif=(id:string)=>{
    const raw=localStorage.getItem("adminNotifications");
    if(!raw)return;
    try{const all:Notif[]=JSON.parse(raw);localStorage.setItem("adminNotifications",JSON.stringify(all.map(n=>n.id===id?{...n,dismissed:true}:n)));setNotifications(p=>p.filter(n=>n.id!==id));}catch{}
  };

  const totalImpr=campaigns.reduce((a,c)=>a+(c.analytics?.impressions||0),0);
  const totalSpend=campaigns.reduce((a,c)=>a+(c.analytics?.adSpend||0),0);
  const active=campaigns.filter(c=>["running","published","approved"].includes(c.status)).length;
  const inReview=campaigns.filter(c=>["pending","in_review"].includes(c.status)).length;
  const userInfo=JSON.parse(localStorage.getItem("userInfo")||"{}");
  const userName=userInfo.name?.split(" ")[0]||"User";
  const userInitial=userName[0]?.toUpperCase()||"U";
  const FV={initial:{opacity:0,y:20},animate:{opacity:1,y:0}};

  return(
    <div className="vxan-shell">
      <style dangerouslySetInnerHTML={{__html:S}}/>
      <DashboardSidebar userName={userName} userInitial={userInitial}/>
      <div className="vxan-main">
        <DashboardTopBar userName={userName} userInitial={userInitial}/>
        <div className="vxan-scroll">
          <div className="vxan-orb1"/><div className="vxan-orb2"/>
          <div className="vxan-inner">
            <motion.div {...FV} transition={{duration:0.45}} className="vxan-hero">
              <div className="vxan-hero-line"/>
              <div><div className="vxan-hero-title">Campaign <span>Analytics</span></div><div className="vxan-hero-sub">Track performance, reach and ROI across all your campaigns.</div></div>
              <div style={{display:"flex",gap:10}}>
                <button className="vxan-btn-ghost" onClick={loadCampaigns}>
                  <motion.span animate={loading?{rotate:360}:{rotate:0}} transition={{duration:1,repeat:loading?Infinity:0,ease:"linear"}} style={{display:"flex",alignItems:"center"}}><RefreshCw size={13}/></motion.span>
                  {loading?"Syncing…":"Refresh"}
                </button>
                <button className="vxan-btn-pri" onClick={()=>navigate("/upload")}><Plus size={15}/> New Campaign</button>
              </div>
            </motion.div>

            <AnimatePresence>
              {notifications.map(n=>(
                <motion.div key={n.id} initial={{opacity:0,height:0}} animate={{opacity:1,height:"auto"}} exit={{opacity:0,height:0}}>
                  <div className="vxan-notif"><Bell size={18} color="#eab308" style={{flexShrink:0}}/><div style={{flex:1,fontSize:13,color:"#94a3b8"}}>{n.message}</div><button onClick={()=>dismissNotif(n.id)} style={{background:"none",border:"none",color:"#475569",cursor:"pointer"}}><X size={16}/></button></div>
                </motion.div>
              ))}
            </AnimatePresence>

            <div className="vxan-kpis">
              {[
                {icon:<Activity size={18}/>,bg:"rgba(34,197,94,.12)",col:"#22c55e",val:active,lbl:"Active Campaigns"},
                {icon:<Clock size={18}/>,bg:"rgba(234,179,8,.12)",col:"#eab308",val:inReview,lbl:"In Review"},
                {icon:<Eye size={18}/>,bg:"rgba(167,139,250,.12)",col:"#a78bfa",val:totalImpr.toLocaleString(),lbl:"Total Impressions"},
                {icon:<Target size={18}/>,bg:"rgba(56,189,248,.12)",col:"#38bdf8",val:`?${totalSpend.toLocaleString()}`,lbl:"Total Spent"},
              ].map((k,i)=>(
                <motion.div key={i} initial={{opacity:0,y:20}} animate={{opacity:1,y:0}} transition={{delay:0.08+i*0.07}} className="vxan-kpi">
                  <div className="vxan-kpi-ic" style={{background:k.bg,color:k.col}}>{k.icon}</div>
                  <div className="vxan-kpi-val" style={{color:k.col}}>{k.val}</div>
                  <div className="vxan-kpi-lbl">{k.lbl}</div>
                </motion.div>
              ))}
            </div>

            {campaigns.length===0?(
              <motion.div {...FV} transition={{delay:0.2}} className="vxan-empty">
                <BarChart3 size={52} style={{margin:"0 auto 20px",opacity:0.15}}/>
                <div style={{fontSize:20,fontWeight:800,color:"#e2e8f0",marginBottom:8}}>No Campaigns Yet</div>
                <div style={{color:"#475569",fontSize:14,marginBottom:28}}>Start your first AI-powered campaign and see analytics here.</div>
                <button className="vxan-btn-pri" onClick={()=>navigate("/upload")}><Zap size={14}/> Upload & Launch</button>
              </motion.div>
            ):campaigns.map((c,i)=>(
              <motion.div key={c.id} initial={{opacity:0,y:24}} animate={{opacity:1,y:0}} transition={{delay:0.12+i*0.06}} className="vxan-campaign">
                <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",marginBottom:20,flexWrap:"wrap",gap:14}}>
                  <div>
                    <div style={{display:"flex",alignItems:"center",gap:12,marginBottom:8}}>
                      <div style={{fontSize:19,fontWeight:800,color:"#e2e8f0"}}>{c.name}</div>
                      <span className="vxan-status" style={getStatusStyle(c.status)}>
                        {["running","approved","published"].includes(c.status)?<CheckCircle2 size={11}/>:["pending","in_review"].includes(c.status)?<Clock size={11}/>:c.status==="rejected"?<XCircle size={11}/>:<BarChart3 size={11}/>}
                        {c.status.replace("_"," ")}
                      </span>
                    </div>
                    <div style={{fontSize:13,color:"#475569",display:"flex",alignItems:"center",gap:16}}>
                      <span style={{display:"flex",alignItems:"center",gap:5}}><Calendar size={12}/> {new Date(c.dateSubmitted).toLocaleDateString()}</span>
                      <span style={{display:"flex",alignItems:"center",gap:5}}><BarChart3 size={12}/> ID: {c.id.slice(-8)}</span>
                    </div>
                  </div>
                  <div style={{display:"flex",gap:10,alignItems:"center",flexWrap:"wrap"}}>
                    <div style={{display:"flex",gap:8}}>{c.platforms.map(p=><div key={p} className="vxan-plat-ic">{getPlatformIcon(p)}</div>)}</div>
                    <button className="vxan-btn-ghost" onClick={()=>navigate(`/analytics/${c.id}`)}>Full Report <ArrowRight size={13}/></button>
                  </div>
                </div>
                <div style={{fontSize:12,fontWeight:700,color:"#334155",textTransform:"uppercase",letterSpacing:"0.07em",marginBottom:6}}>Budget <span style={{fontSize:16,fontWeight:800,color:"#06d6c7",textTransform:"none",letterSpacing:"normal",marginLeft:8}}>{c.budget}</span></div>
                <div className="vxan-stats">
                  {[
                    {icon:<TrendingUp size={11} color="#a78bfa"/>,lbl:"Impressions",val:c.analytics?.impressions?.toLocaleString()||"—"},
                    {icon:<Eye size={11} color="#38bdf8"/>,lbl:"Reach",val:c.analytics?.reach?.toLocaleString()||"—"},
                    {icon:<MousePointer size={11} color="#06d6c7"/>,lbl:"Clicks",val:c.analytics?.clicks?.toLocaleString()||"—"},
                    {icon:<Activity size={11} color="#f472b6"/>,lbl:"CTR",val:c.analytics?.ctr?`${c.analytics.ctr}%`:"—"},
                    {icon:<Target size={11} color="#fb923c"/>,lbl:"Conversions",val:c.analytics?.conversions?.toLocaleString()||"—"},
                    {icon:<DollarSign size={11} color="#22c55e"/>,lbl:"Ad Spend",val:c.analytics?.adSpend?`?${c.analytics.adSpend.toLocaleString()}`:"—"},
                    {icon:<Zap size={11} color="#fbbf24"/>,lbl:"ROAS",val:c.analytics?.roas?`${c.analytics.roas}x`:"—"},
                  ].map((s,j)=>(
                    <div key={j}><div className="vxan-stat-lbl">{s.icon} {s.lbl}</div><div className="vxan-stat-val">{s.val}</div></div>
                  ))}
                </div>
                {c.status==="rejected"&&(
                  <div className="vxan-reject">
                    <div style={{display:"flex",alignItems:"center",gap:10,marginBottom:10,color:"#ef4444",fontWeight:800,fontSize:14}}><XCircle size={16}/> Rejection Notice</div>
                    <p style={{fontSize:13,color:"#94a3b8",lineHeight:1.6,marginBottom:14}}>{c.rejectionReason||"Campaign does not meet current guidelines. Please review and resubmit."}</p>
                    <button onClick={()=>{toast.info("Resubmit flow starting…");setTimeout(()=>navigate("/upload"),1000);}} style={{display:"inline-flex",alignItems:"center",gap:6,padding:"9px 20px",borderRadius:12,background:"rgba(239,68,68,0.15)",border:"1px solid rgba(239,68,68,0.3)",color:"#ef4444",fontSize:13,fontWeight:700,cursor:"pointer",fontFamily:"'Inter',sans-serif"}}><AlertCircle size={13}/> Review & Resubmit</button>
                  </div>
                )}
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
