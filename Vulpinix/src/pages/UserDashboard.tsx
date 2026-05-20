import { API_BASE } from "../config/api";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router";
import { motion } from "framer-motion";
import {
  TrendingUp, BarChart3, Plus, Activity, PenSquare, Share2,
  Zap, Instagram, Facebook, Youtube, Twitter, Linkedin,
  Globe, Bell, ArrowRight, Sparkles, Target, Eye,
  MousePointer, DollarSign, CheckCircle2, XCircle,
  Clock, Settings
} from "lucide-react";
import { DashboardSidebar } from "../components/DashboardSidebar";
import { DashboardTopBar } from "../components/DashboardTopBar";

const S = `
  @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800;900&display=swap');
  .vxd-shell{display:flex;height:100vh;background:#070b12;overflow:hidden;font-family:'Inter',sans-serif;}
  .vxd-main{flex:1;display:flex;flex-direction:column;overflow:hidden;}
  .vxd-scroll{flex:1;overflow-y:auto;overflow-x:hidden;padding:32px 36px 100px;}
  .vxd-scroll::-webkit-scrollbar{width:6px;}
  .vxd-scroll::-webkit-scrollbar-thumb{background:rgba(255,255,255,0.08);border-radius:3px;}
  .vxd-orb1{position:fixed;pointer-events:none;border-radius:50%;z-index:0;width:700px;height:700px;top:-200px;right:-150px;background:radial-gradient(circle,rgba(167,139,250,0.08) 0%,transparent 70%);}
  .vxd-orb2{position:fixed;pointer-events:none;border-radius:50%;z-index:0;width:600px;height:600px;bottom:-200px;left:-100px;background:radial-gradient(circle,rgba(56,189,248,0.06) 0%,transparent 70%);}
  .vxd-inner{max-width:1240px;margin:0 auto;position:relative;z-index:1;}

  /* Hero greeting */
  .vxd-hero{display:flex;align-items:center;justify-content:space-between;flex-wrap:wrap;gap:20px;margin-bottom:32px;}
  .vxd-greeting{font-size:32px;font-weight:900;letter-spacing:-0.03em;color:#f1f5f9;margin-bottom:5px;}
  .vxd-greeting span{background:linear-gradient(135deg,#a78bfa 30%,#38bdf8);-webkit-background-clip:text;-webkit-text-fill-color:transparent;}
  .vxd-sub{color:#475569;font-size:15px;}
  .vxd-hero-btns{display:flex;gap:10px;flex-wrap:wrap;}

  /* Buttons */
  .vxd-btn-pri{display:inline-flex;align-items:center;gap:8px;padding:11px 22px;border-radius:14px;background:linear-gradient(135deg,#a78bfa,#38bdf8);border:none;color:#fff;font-weight:700;font-size:14px;cursor:pointer;box-shadow:0 6px 20px rgba(167,139,250,0.28);transition:all 0.2s;font-family:'Inter',sans-serif;}
  .vxd-btn-pri:hover{transform:translateY(-2px);box-shadow:0 10px 28px rgba(167,139,250,0.4);}
  .vxd-btn-ghost{display:inline-flex;align-items:center;gap:8px;padding:10px 20px;border-radius:13px;background:rgba(255,255,255,0.04);border:1px solid rgba(255,255,255,0.09);color:#64748b;font-weight:700;font-size:14px;cursor:pointer;transition:all 0.2s;font-family:'Inter',sans-serif;}
  .vxd-btn-ghost:hover{background:rgba(255,255,255,0.08);color:#94a3b8;}

  /* AI Banner */
  .vxd-banner{border-radius:26px;padding:24px 32px;margin-bottom:28px;background:linear-gradient(135deg,rgba(167,139,250,0.10),rgba(56,189,248,0.07));border:1px solid rgba(167,139,250,0.18);display:flex;align-items:center;justify-content:space-between;flex-wrap:wrap;gap:20px;position:relative;overflow:hidden;}
  .vxd-banner-line{position:absolute;top:0;left:0;right:0;height:2px;background:linear-gradient(90deg,#a78bfa,#38bdf8,#a78bfa);background-size:200%;animation:vxd-shimmer 3s ease infinite;}
  @keyframes vxd-shimmer{0%,100%{background-position:0%}50%{background-position:100%}}
  .vxd-banner-ic{width:52px;height:52px;border-radius:16px;background:linear-gradient(135deg,#a78bfa,#38bdf8);display:flex;align-items:center;justify-content:center;flex-shrink:0;box-shadow:0 8px 24px rgba(167,139,250,0.35);}

  /* KPI row */
  .vxd-kpi-grid{display:grid;grid-template-columns:repeat(4,1fr);gap:18px;margin-bottom:28px;}
  .vxd-kpi{border-radius:22px;padding:24px 26px;background:rgba(255,255,255,0.025);border:1px solid rgba(255,255,255,0.07);position:relative;overflow:hidden;transition:all 0.25s;cursor:default;}
  .vxd-kpi:hover{transform:translateY(-4px);border-color:rgba(255,255,255,0.14);box-shadow:0 16px 40px rgba(0,0,0,0.3);}
  .vxd-kpi-strip{position:absolute;top:0;left:0;right:0;height:3px;}
  .vxd-kpi-ic{width:40px;height:40px;border-radius:12px;display:flex;align-items:center;justify-content:center;margin-bottom:18px;}
  .vxd-kpi-lbl{font-size:11px;font-weight:700;color:#334155;text-transform:uppercase;letter-spacing:0.07em;margin-bottom:8px;}
  .vxd-kpi-val{font-size:34px;font-weight:900;line-height:1;margin-bottom:6px;}
  .vxd-kpi-trend{font-size:11px;font-weight:700;display:inline-flex;align-items:center;gap:3px;padding:3px 8px;border-radius:20px;}

  /* Bento layout */
  .vxd-bento{display:grid;grid-template-columns:1.6fr 1fr;gap:22px;margin-bottom:28px;}
  .vxd-col-right{display:flex;flex-direction:column;gap:20px;}

  /* Cards */
  .vxd-card{border-radius:22px;padding:26px 28px;background:rgba(255,255,255,0.025);border:1px solid rgba(255,255,255,0.07);}
  .vxd-card-hd{display:flex;align-items:center;justify-content:space-between;margin-bottom:22px;}
  .vxd-card-hd-l{display:flex;align-items:center;gap:10px;}
  .vxd-card-ic{width:34px;height:34px;border-radius:10px;display:flex;align-items:center;justify-content:center;}
  .vxd-card-title{font-size:15px;font-weight:800;color:#e2e8f0;}
  .vxd-view-all{display:flex;align-items:center;gap:4px;font-size:12px;font-weight:700;color:#a78bfa;cursor:pointer;background:none;border:none;font-family:'Inter',sans-serif;transition:gap 0.2s;}
  .vxd-view-all:hover{gap:8px;}

  /* Campaign rows */
  .vxd-campaign-row{display:flex;align-items:center;justify-content:space-between;padding:13px 16px;border-radius:16px;background:rgba(255,255,255,0.02);border:1px solid rgba(255,255,255,0.05);margin-bottom:10px;cursor:pointer;transition:all 0.2s;}
  .vxd-campaign-row:hover{background:rgba(255,255,255,0.05);border-color:rgba(255,255,255,0.10);transform:translateX(3px);}
  .vxd-campaign-row:last-child{margin-bottom:0;}
  .vxd-platform-chip{display:inline-flex;align-items:center;gap:4px;padding:3px 8px;border-radius:20px;background:rgba(255,255,255,0.04);border:1px solid rgba(255,255,255,0.07);font-size:11px;color:#475569;margin-right:4px;}
  .vxd-status-pill{padding:4px 11px;border-radius:20px;font-size:11px;font-weight:700;white-space:nowrap;}

  /* Quick action items */
  .vxd-action-item{display:flex;align-items:center;justify-content:space-between;padding:13px 16px;border-radius:15px;background:rgba(255,255,255,0.02);border:1px solid rgba(255,255,255,0.05);cursor:pointer;font-size:14px;font-weight:600;color:#94a3b8;transition:all 0.2s;margin-bottom:9px;}
  .vxd-action-item:last-child{margin-bottom:0;}
  .vxd-action-item:hover{background:rgba(167,139,250,0.06);border-color:rgba(167,139,250,0.18);color:#e2e8f0;transform:translateX(3px);}
  .vxd-action-item-l{display:flex;align-items:center;gap:10px;}
  .vxd-action-ic{width:32px;height:32px;border-radius:10px;display:flex;align-items:center;justify-content:center;flex-shrink:0;}

  /* Activity feed */
  .vxd-activity{display:flex;gap:12px;padding:12px 0;border-bottom:1px solid rgba(255,255,255,0.04);}
  .vxd-activity:last-child{border-bottom:none;padding-bottom:0;}
  .vxd-activity:first-child{padding-top:0;}
  .vxd-activity-dot{width:8px;height:8px;border-radius:50%;margin-top:6px;flex-shrink:0;}

  /* Status overview bottom */
  .vxd-status-grid{display:grid;grid-template-columns:repeat(4,1fr);gap:16px;}
  .vxd-status-block{padding:20px 22px;border-radius:18px;transition:all 0.2s;}
  .vxd-status-block:hover{transform:translateY(-2px);}

  /* Empty state */
  .vxd-empty{text-align:center;padding:44px 20px;color:#334155;}

  @media(max-width:1100px){.vxd-kpi-grid{grid-template-columns:repeat(2,1fr);}.vxd-bento{grid-template-columns:1fr;}.vxd-status-grid{grid-template-columns:repeat(2,1fr);}}
  @media(max-width:640px){.vxd-scroll{padding:20px 16px 80px;}.vxd-greeting{font-size:24px;}.vxd-kpi-grid{grid-template-columns:1fr 1fr;}.vxd-status-grid{grid-template-columns:1fr 1fr;}}
`;

interface Campaign {
  id:string; name:string; platforms:string[]; budget:string; status:string;
  analytics?:{impressions:number;reach:number;clicks:number;adSpend:number;};
}

function getPlatformIcon(p:string){
  const s=p.toLowerCase();const pr={size:12};
  if(s.includes("instagram"))return <Instagram {...pr}/>;
  if(s.includes("facebook"))return <Facebook {...pr}/>;
  if(s.includes("youtube"))return <Youtube {...pr}/>;
  if(s.includes("twitter")||s.includes("x "))return <Twitter {...pr}/>;
  if(s.includes("linkedin"))return <Linkedin {...pr}/>;
  return <Globe {...pr}/>;
}

function statusStyle(s:string):{bg:string;col:string;label:string}{
  switch(s){
    case "running":case "approved":case "active":case "published":return{bg:"rgba(34,197,94,0.10)",col:"#22c55e",label:"Active"};
    case "pending":case "in_review":case "review":return{bg:"rgba(234,179,8,0.10)",col:"#eab308",label:"In Review"};
    case "completed":return{bg:"rgba(56,189,248,0.10)",col:"#38bdf8",label:"Completed"};
    case "rejected":return{bg:"rgba(239,68,68,0.10)",col:"#ef4444",label:"Rejected"};
    default:return{bg:"rgba(148,163,184,0.10)",col:"#94a3b8",label:s};
  }
}

function fmt(n:number){
  if(n>=1_000_000)return(n/1_000_000).toFixed(1)+"M";
  if(n>=1_000)return(n/1_000).toFixed(1)+"K";
  return String(n);
}

export default function UserDashboard(){
  const navigate=useNavigate();
  const [userName,setUserName]=useState("there");
  const [campaigns,setCampaigns]=useState<Campaign[]>([]);
  const [stats,setStats]=useState({active:0,impressions:0,clicks:0,spent:0});

  useEffect(()=>{
    if(localStorage.getItem("isAuthenticated")!=="true"){navigate("/auth",{replace:true});return;}
    try{
      const u=JSON.parse(localStorage.getItem("userInfo")||"{}");
      if(u.name)setUserName(u.name.split(" ")[0]);
      if(u.onboardingCompleted===false){navigate("/onboarding",{replace:true});return;}
    }catch{}
    loadData();
  },[navigate]);

  const loadData=async()=>{
    const token=localStorage.getItem("authToken");
    let list:Campaign[]=[];
    if(token){
      try{
        const r=await fetch(`${API_BASE}/api/campaign/my-campaigns`,{headers:{Authorization:`Bearer ${token}`}});
        const d=await r.json();
        if(d.success&&d.campaigns)list=d.campaigns;
      }catch{}
    }
    if(!list.length){try{const raw=localStorage.getItem("userCampaigns");if(raw)list=JSON.parse(raw);}catch{}}
    if(!Array.isArray(list))list=[];
    let active=0,impressions=0,clicks=0,spent=0;
    list.forEach(c=>{
      if(["running","approved","active","published"].includes(c.status))active++;
      impressions+=c.analytics?.impressions||0;
      clicks+=c.analytics?.clicks||0;
      spent+=c.analytics?.adSpend||0;
    });
    setStats({active,impressions,clicks,spent});
    setCampaigns(list.slice(0,5));
  };

  const hour=new Date().getHours();
  const greeting=hour<12?"Good morning":hour<17?"Good afternoon":"Good evening";
  const userInitial=userName[0]?.toUpperCase()||"U";

  const kpis=[
    {label:"Active Campaigns",val:stats.active,icon:<Activity size={18}/>,ibg:"rgba(34,197,94,0.12)",icol:"#22c55e",strip:"linear-gradient(90deg,#22c55e,transparent)",trend:"+2",tpos:true},
    {label:"Total Impressions",val:fmt(stats.impressions),icon:<Eye size={18}/>,ibg:"rgba(167,139,250,0.12)",icol:"#a78bfa",strip:"linear-gradient(90deg,#a78bfa,transparent)",trend:"↑ 12%",tpos:true},
    {label:"Total Clicks",val:fmt(stats.clicks),icon:<MousePointer size={18}/>,ibg:"rgba(56,189,248,0.12)",icol:"#38bdf8",strip:"linear-gradient(90deg,#38bdf8,transparent)",trend:"↑ 8%",tpos:true},
    {label:"Ad Spend",val:`₹${fmt(stats.spent)}`,icon:<DollarSign size={18}/>,ibg:"rgba(251,191,36,0.12)",icol:"#fbbf24",strip:"linear-gradient(90deg,#fbbf24,transparent)",trend:"On budget",tpos:true},
  ];

  const quickActions=[
    {label:"Create Post",icon:<PenSquare size={16}/>,ibg:"rgba(167,139,250,0.12)",icol:"#a78bfa",path:"/create-post"},
    {label:"Upload Campaign",icon:<Plus size={16}/>,ibg:"rgba(56,189,248,0.12)",icol:"#38bdf8",path:"/upload"},
    {label:"Social Accounts",icon:<Share2 size={16}/>,ibg:"rgba(34,197,94,0.12)",icol:"#22c55e",path:"/social"},
    {label:"View Analytics",icon:<TrendingUp size={16}/>,ibg:"rgba(251,191,36,0.12)",icol:"#fbbf24",path:"/dashboard/campaigns"},
    {label:"Settings",icon:<Settings size={16}/>,ibg:"rgba(148,163,184,0.12)",icol:"#94a3b8",path:"/settings"},
  ];

  const activity=[
    {dot:"#a78bfa",text:"AI optimisation complete",sub:"2 hours ago",icon:<CheckCircle2 size={13} color="#22c55e"/>},
    {dot:"#38bdf8",text:"New analytics report ready",sub:"Yesterday",icon:<BarChart3 size={13} color="#38bdf8"/>},
    {dot:"#22c55e",text:"Campaign approved & live",sub:"2 days ago",icon:<CheckCircle2 size={13} color="#22c55e"/>},
    {dot:"#ef4444",text:"Review feedback received",sub:"3 days ago",icon:<XCircle size={13} color="#ef4444"/>},
  ];

  const statusBreakdown=[
    {label:"Running",count:campaigns.filter(c=>["running","approved","active","published"].includes(c.status)).length,col:"#22c55e"},
    {label:"In Review",count:campaigns.filter(c=>["pending","in_review","review"].includes(c.status)).length,col:"#eab308"},
    {label:"Completed",count:campaigns.filter(c=>c.status==="completed").length,col:"#38bdf8"},
    {label:"Rejected",count:campaigns.filter(c=>c.status==="rejected").length,col:"#ef4444"},
  ];

  return(
    <div className="vxd-shell">
      <style dangerouslySetInnerHTML={{__html:S}}/>
      <DashboardSidebar userName={userName} userInitial={userInitial}/>
      <div className="vxd-main">
        <DashboardTopBar userName={userName} userInitial={userInitial}/>
        <div className="vxd-scroll">
          <div className="vxd-orb1"/><div className="vxd-orb2"/>
          <div className="vxd-inner">

            {/* Greeting */}
            <motion.div initial={{opacity:0,y:-16}} animate={{opacity:1,y:0}} transition={{duration:0.45}} className="vxd-hero">
              <div>
                <div className="vxd-greeting">{greeting}, <span>{userName}!</span></div>
                <div className="vxd-sub">Here's your campaign command centre — everything in one place.</div>
              </div>
              <div className="vxd-hero-btns">
                <button className="vxd-btn-ghost" onClick={()=>navigate("/create-post")}><PenSquare size={15}/> Create Post</button>
                <button className="vxd-btn-pri" onClick={()=>navigate("/upload")}><Plus size={15}/> New Campaign</button>
              </div>
            </motion.div>

            {/* AI Banner */}
            <motion.div initial={{opacity:0,y:16}} animate={{opacity:1,y:0}} transition={{delay:0.08}} className="vxd-banner">
              <div className="vxd-banner-line"/>
              <div style={{display:"flex",alignItems:"center",gap:18}}>
                <div className="vxd-banner-ic"><Sparkles size={24} color="#fff"/></div>
                <div>
                  <div style={{fontWeight:800,fontSize:16,color:"#f1f5f9",marginBottom:4}}>Vulpinix AI Engine is ready</div>
                  <div style={{color:"#64748b",fontSize:14}}>Upload media and let our AI generate your perfect campaign in seconds.</div>
                </div>
              </div>
              <button className="vxd-btn-pri" onClick={()=>navigate("/upload")}>Launch Campaign <ArrowRight size={15}/></button>
            </motion.div>

            {/* KPI grid */}
            <div className="vxd-kpi-grid">
              {kpis.map((k,i)=>(
                <motion.div key={k.label} initial={{opacity:0,y:24}} animate={{opacity:1,y:0}} transition={{delay:0.12+i*0.07}} className="vxd-kpi">
                  <div className="vxd-kpi-strip" style={{background:k.strip}}/>
                  <div className="vxd-kpi-ic" style={{background:k.ibg,color:k.icol}}>{k.icon}</div>
                  <div className="vxd-kpi-lbl">{k.label}</div>
                  <div className="vxd-kpi-val" style={{color:k.icol}}>{k.val}</div>
                  <div className="vxd-kpi-trend" style={{background:k.ibg,color:k.icol}}>{k.trend}</div>
                </motion.div>
              ))}
            </div>

            {/* Bento */}
            <div className="vxd-bento">
              {/* Recent Campaigns */}
              <motion.div initial={{opacity:0,y:24}} animate={{opacity:1,y:0}} transition={{delay:0.32}} className="vxd-card">
                <div className="vxd-card-hd">
                  <div className="vxd-card-hd-l">
                    <div className="vxd-card-ic" style={{background:"rgba(167,139,250,0.12)",color:"#a78bfa"}}><Target size={16}/></div>
                    <div className="vxd-card-title">Recent Campaigns</div>
                  </div>
                  <button className="vxd-view-all" onClick={()=>navigate("/dashboard/campaigns")}>View All <ArrowRight size={13}/></button>
                </div>
                {campaigns.length===0?(
                  <div className="vxd-empty">
                    <BarChart3 size={40} style={{margin:"0 auto 14px",opacity:0.15}}/>
                    <div style={{fontSize:15,fontWeight:600,color:"#334155",marginBottom:6}}>No campaigns yet</div>
                    <div style={{fontSize:13,color:"#1e293b",marginBottom:20}}>Launch your first AI-powered campaign now.</div>
                    <button className="vxd-btn-pri" onClick={()=>navigate("/upload")} style={{margin:"0 auto"}}><Plus size={14}/> Create Campaign</button>
                  </div>
                ):campaigns.map(c=>{
                  const st=statusStyle(c.status);
                  return(
                    <div key={c.id} className="vxd-campaign-row" onClick={()=>navigate("/dashboard/campaigns")}>
                      <div style={{flex:1,minWidth:0}}>
                        <div style={{fontWeight:700,fontSize:14,color:"#e2e8f0",marginBottom:6,whiteSpace:"nowrap",overflow:"hidden",textOverflow:"ellipsis"}}>{c.name}</div>
                        <div style={{display:"flex",flexWrap:"wrap",gap:4}}>
                          {c.platforms.slice(0,3).map(p=><span key={p} className="vxd-platform-chip">{getPlatformIcon(p)} {p}</span>)}
                        </div>
                      </div>
                      <div style={{display:"flex",alignItems:"center",gap:14,flexShrink:0,marginLeft:12}}>
                        <div style={{textAlign:"right"}}>
                          <div style={{fontSize:13,fontWeight:700,color:"#e2e8f0"}}>{c.budget}</div>
                          <div style={{fontSize:11,color:"#334155"}}>Budget</div>
                        </div>
                        <span className="vxd-status-pill" style={{background:st.bg,color:st.col}}>{st.label}</span>
                      </div>
                    </div>
                  );
                })}
              </motion.div>

              {/* Right column */}
              <div className="vxd-col-right">
                {/* Quick Actions */}
                <motion.div initial={{opacity:0,y:24}} animate={{opacity:1,y:0}} transition={{delay:0.38}} className="vxd-card">
                  <div className="vxd-card-hd">
                    <div className="vxd-card-hd-l">
                      <div className="vxd-card-ic" style={{background:"rgba(56,189,248,0.12)",color:"#38bdf8"}}><Zap size={16}/></div>
                      <div className="vxd-card-title">Quick Actions</div>
                    </div>
                  </div>
                  {quickActions.map(a=>(
                    <div key={a.label} className="vxd-action-item" onClick={()=>navigate(a.path)}>
                      <div className="vxd-action-item-l">
                        <div className="vxd-action-ic" style={{background:a.ibg,color:a.icol}}>{a.icon}</div>
                        {a.label}
                      </div>
                      <ArrowRight size={14} color="#334155"/>
                    </div>
                  ))}
                </motion.div>

                {/* Activity */}
                <motion.div initial={{opacity:0,y:24}} animate={{opacity:1,y:0}} transition={{delay:0.44}} className="vxd-card">
                  <div className="vxd-card-hd">
                    <div className="vxd-card-hd-l">
                      <div className="vxd-card-ic" style={{background:"rgba(234,179,8,0.12)",color:"#eab308"}}><Bell size={16}/></div>
                      <div className="vxd-card-title">Recent Activity</div>
                    </div>
                  </div>
                  {activity.map((a,i)=>(
                    <div key={i} className="vxd-activity">
                      <div className="vxd-activity-dot" style={{background:a.dot}}/>
                      <div style={{flex:1}}>
                        <div style={{fontSize:13,fontWeight:600,color:"#cbd5e1",marginBottom:2}}>{a.text}</div>
                        <div style={{fontSize:11,color:"#334155",display:"flex",alignItems:"center",gap:4}}><Clock size={10}/> {a.sub}</div>
                      </div>
                      {a.icon}
                    </div>
                  ))}
                </motion.div>
              </div>
            </div>

            {/* Status overview */}
            <motion.div initial={{opacity:0,y:24}} animate={{opacity:1,y:0}} transition={{delay:0.52}} className="vxd-card">
              <div className="vxd-card-hd">
                <div className="vxd-card-hd-l">
                  <div className="vxd-card-ic" style={{background:"rgba(167,139,250,0.12)",color:"#a78bfa"}}><TrendingUp size={16}/></div>
                  <div className="vxd-card-title">Campaign Status Overview</div>
                </div>
                <button className="vxd-view-all" onClick={()=>navigate("/dashboard/campaigns")}>Full Analytics <ArrowRight size={13}/></button>
              </div>
              <div className="vxd-status-grid">
                {statusBreakdown.map(s=>(
                  <div key={s.label} className="vxd-status-block" style={{background:`${s.col}08`,border:`1px solid ${s.col}20`}}>
                    <div style={{fontSize:11,fontWeight:700,color:"#334155",textTransform:"uppercase",letterSpacing:"0.07em",marginBottom:12}}>{s.label}</div>
                    <div style={{fontSize:36,fontWeight:900,color:s.col,lineHeight:1,marginBottom:6}}>{s.count}</div>
                    <div style={{fontSize:11,color:s.col,opacity:0.7}}>campaign{s.count!==1?"s":""}</div>
                  </div>
                ))}
              </div>
            </motion.div>

          </div>
        </div>
      </div>
    </div>
  );
}
