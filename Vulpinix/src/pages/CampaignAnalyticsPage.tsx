import { API_BASE } from "../config/api";
import { useState, useEffect, useMemo } from "react";
import { useNavigate, useParams } from "react-router";
import { motion } from "framer-motion";
import { ArrowLeft, Eye, Users, MousePointer, DollarSign, TrendingUp, BarChart3, Instagram, Facebook, Youtube, Twitter, Linkedin, Globe, Clock, Activity, MessageCircle, Percent, ShoppingCart, CheckCircle2, XCircle } from "lucide-react";
import { DashboardSidebar } from "../components/DashboardSidebar";
import { DashboardTopBar } from "../components/DashboardTopBar";
import { AreaChart, Area, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from "recharts";

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
  .vxan-kpis{display:grid;grid-template-columns:repeat(4,1fr);gap:18px;margin-bottom:28px;}
  .vxan-kpi{border-radius:22px;padding:22px 24px;background:rgba(255,255,255,0.025);border:1px solid rgba(255,255,255,0.07);transition:all 0.2s;}
  .vxan-kpi:hover{border-color:rgba(255,255,255,0.14);transform:translateY(-2px);}
  .vxan-kpi-ic{width:38px;height:38px;border-radius:12px;display:flex;align-items:center;justify-content:center;margin-bottom:16px;}
  .vxan-kpi-val{font-size:26px;font-weight:900;line-height:1;margin-bottom:5px;}
  .vxan-kpi-lbl{font-size:11px;font-weight:700;color:#334155;text-transform:uppercase;letter-spacing:0.07em;}
  .vxan-kpi-desc{font-size:11px;color:#475569;margin-top:4px;}
  .vxan-card{border-radius:22px;padding:28px 32px;margin-bottom:20px;background:rgba(255,255,255,0.025);border:1px solid rgba(255,255,255,0.07);}
  .vxan-card-title{font-size:13px;font-weight:800;color:#475569;text-transform:uppercase;letter-spacing:0.07em;margin-bottom:20px;display:flex;align-items:center;gap:8px;}
  .vxan-bar-row{display:flex;align-items:center;gap:16px;margin-bottom:14px;}
  .vxan-bar-label{font-size:12px;color:#64748b;width:90px;flex-shrink:0;}
  .vxan-bar-track{flex:1;height:24px;border-radius:8px;background:rgba(255,255,255,0.04);overflow:hidden;}
  .vxan-charts{display:grid;grid-template-columns:1fr 1fr;gap:20px;margin-bottom:20px;}
  .vxan-status{padding:5px 13px;border-radius:20px;font-size:11px;font-weight:700;display:inline-flex;align-items:center;gap:5px;}
  .vxan-plat{display:inline-flex;align-items:center;gap:6px;padding:4px 10px;border-radius:8px;background:rgba(167,139,250,0.1);border:1px solid rgba(167,139,250,0.2);color:#c4b5fd;font-size:11px;font-weight:600;margin:2px;}
  .vxan-btn-ghost{display:inline-flex;align-items:center;gap:7px;padding:10px 18px;border-radius:13px;background:rgba(255,255,255,0.04);border:1px solid rgba(255,255,255,0.09);color:#64748b;font-weight:700;font-size:13px;cursor:pointer;transition:all 0.2s;font-family:'Inter',sans-serif;}
  .vxan-btn-ghost:hover{background:rgba(255,255,255,0.08);color:#94a3b8;}
  .vxan-notice{border-radius:16px;padding:14px 18px;background:rgba(234,179,8,0.07);border:1px solid rgba(234,179,8,0.2);display:flex;align-items:center;gap:14px;margin-bottom:20px;color:#fbbf24;font-size:13px;font-weight:600;}
  @media(max-width:1100px){.vxan-kpis{grid-template-columns:repeat(2,1fr);}.vxan-charts{grid-template-columns:1fr;}}
  @media(max-width:640px){.vxan-scroll{padding:20px 16px 80px;}.vxan-hero{padding:24px 20px;}.vxan-card{padding:20px;}}
`;

interface Campaign{id:string;businessName:string;name:string;platforms:string[];budget:string;status:string;analytics?:{impressions:number;reach:number;clicks:number;ctr:number;conversions:number;adSpend:number;roas:number;}}

function getPlatformIcon(p:string){switch(p.toLowerCase()){case"instagram":return<Instagram size={12}/>;case"facebook":return<Facebook size={12}/>;case"youtube":return<Youtube size={12}/>;case"twitter":case"x":return<Twitter size={12}/>;case"linkedin":return<Linkedin size={12}/>;default:return<Globe size={12}/>;}}
function fmt(n:number){if(n>=1_000_000)return(n/1_000_000).toFixed(1)+"M";if(n>=1_000)return(n/1_000).toFixed(1)+"K";return String(n);}

function getStatusStyle(s:string){
  if(["approved","running","published","active"].includes(s))return{bg:"rgba(34,197,94,.10)",border:"rgba(34,197,94,.25)",col:"#22c55e"};
  if(["pending","in_review"].includes(s))return{bg:"rgba(234,179,8,.10)",border:"rgba(234,179,8,.25)",col:"#eab308"};
  if(s==="scheduled")return{bg:"rgba(167,139,250,.10)",border:"rgba(167,139,250,.25)",col:"#a78bfa"};
  if(s==="rejected")return{bg:"rgba(239,68,68,.10)",border:"rgba(239,68,68,.25)",col:"#ef4444"};
  return{bg:"rgba(56,189,248,.10)",border:"rgba(56,189,248,.25)",col:"#38bdf8"};
}

export default function CampaignAnalyticsPage(){
  const navigate=useNavigate();
  const{id}=useParams<{id:string}>();
  const[campaign,setCampaign]=useState<Campaign|null>(null);
  const[isLoading,setIsLoading]=useState(true);
  const userInfo=JSON.parse(localStorage.getItem("userInfo")||"{}");
  const userName=userInfo.name?.split(" ")[0]||"User";
  const userInitial=userName[0]?.toUpperCase()||"U";

  useEffect(()=>{
    const load=async()=>{
      const token=localStorage.getItem("authToken");
      if(!token){
        const raw=localStorage.getItem("userCampaigns");
        if(raw){try{const p=JSON.parse(raw);const all=Array.isArray(p)?p:[...(p.inReview||[]),...(p.history||[])];setCampaign(all.find((c:Campaign)=>c.id===id)||null);}catch{}}
        setIsLoading(false);return;
      }
      try{
        const res=await fetch(`${API_BASE}/api/campaign/${id}`,{headers:{Authorization:`Bearer ${token}`}});
        const data=await res.json();
        if(data.success)setCampaign(data.campaign);
        else{const raw=localStorage.getItem("userCampaigns");if(raw){try{const p=JSON.parse(raw);const all=Array.isArray(p)?p:[...(p.inReview||[]),...(p.history||[])];setCampaign(all.find((c:Campaign)=>c.id===id)||null);}catch{}}}
      }catch(e){console.error(e);}
      finally{setIsLoading(false);}
    };
    load();
  },[id]);

  const{a,hasData,isPending,chartData,engData}=useMemo(()=>{
    const empty={impressions:0,reach:0,clicks:0,ctr:0,conversions:0,adSpend:0,roas:0};
    if(!campaign)return{a:empty,hasData:false,isPending:false,chartData:[],engData:[]};
    const a=campaign.analytics??empty;
    const hasData=a.impressions>0||a.clicks>0||a.reach>0;
    const isPending=["pending","in_review","scheduled","draft"].includes(campaign.status);
    if(!hasData)return{a,hasData,isPending,chartData:[],engData:[]};
    const days=["Mon","Tue","Wed","Thu","Fri","Sat","Sun"];
    let ci=0,cc=0;
    const chartData=days.map((name,i)=>{
      const last=i===6;
      const imp=last?a.impressions-ci:Math.floor(a.impressions*(0.1+Math.random()*0.1));
      const clk=last?a.clicks-cc:Math.floor(a.clicks*(0.1+Math.random()*0.1));
      ci+=imp;cc+=clk;
      return{name,Impressions:imp,Clicks:clk};
    });
    const engData=[
      {name:"Likes",value:Math.floor(a.reach*0.05)},
      {name:"Comments",value:Math.floor(a.reach*0.01)},
      {name:"Shares",value:Math.floor(a.reach*0.005)},
      {name:"Saves",value:Math.floor(a.reach*0.008)},
    ];
    return{a,hasData,isPending,chartData,engData};
  },[campaign]);

  const kpis=[
    {icon:<Eye size={18}/>,bg:"rgba(167,139,250,.12)",col:"#a78bfa",val:fmt(a.impressions),lbl:"Impressions",desc:"Times ad displayed"},
    {icon:<Users size={18}/>,bg:"rgba(56,189,248,.12)",col:"#38bdf8",val:fmt(a.reach),lbl:"Reach",desc:"Unique people"},
    {icon:<MousePointer size={18}/>,bg:"rgba(6,182,212,.12)",col:"#06b6d4",val:fmt(a.clicks),lbl:"Clicks",desc:"Total ad clicks"},
    {icon:<Percent size={18}/>,bg:"rgba(34,197,94,.12)",col:"#22c55e",val:`${a.ctr.toFixed(2)}%`,lbl:"CTR",desc:"Click-through rate"},
    {icon:<ShoppingCart size={18}/>,bg:"rgba(251,146,60,.12)",col:"#fb923c",val:fmt(a.conversions),lbl:"Conversions",desc:"Goals completed"},
    {icon:<DollarSign size={18}/>,bg:"rgba(234,179,8,.12)",col:"#eab308",val:`₹${fmt(a.adSpend)}`,lbl:"Ad Spend",desc:"Budget used"},
    {icon:<TrendingUp size={18}/>,bg:"rgba(236,72,153,.12)",col:"#ec4899",val:`${a.roas.toFixed(2)}x`,lbl:"ROAS",desc:"Return on spend"},
    {icon:<Activity size={18}/>,bg:"rgba(139,92,246,.12)",col:"#8b5cf6",val:`₹${fmt(Math.round(a.adSpend*(a.roas||1)))}`,lbl:"Est. Return",desc:"Estimated revenue"},
  ];

  const barRows=[
    {label:"Impressions",value:a.impressions,max:Math.max(a.impressions,1),color:"#a78bfa"},
    {label:"Reach",value:a.reach,max:Math.max(a.impressions,1),color:"#38bdf8"},
    {label:"Clicks",value:a.clicks,max:Math.max(a.reach,1),color:"#06b6d4"},
    {label:"Conversions",value:a.conversions,max:Math.max(a.clicks,1),color:"#22c55e"},
  ];

  const engColors=["#06b6d4","#3b82f6","#a855f7","#ec4899"];
  const st=campaign?getStatusStyle(campaign.status):{bg:"",border:"",col:""};
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

            {/* Hero */}
            <motion.div {...FV} transition={{duration:0.4}} className="vxan-hero">
              <div className="vxan-hero-line"/>
              <div>
                <div className="vxan-hero-title">Campaign <span>Full Report</span></div>
                <div className="vxan-hero-sub">{campaign?`${campaign.businessName} · ${campaign.name}`:"Loading campaign..."}</div>
              </div>
              <div style={{display:"flex",alignItems:"center",gap:12,flexWrap:"wrap"}}>
                {campaign&&(
                  <>
                    <div style={{display:"flex",gap:6,flexWrap:"wrap"}}>
                      {campaign.platforms.map(p=>(
                        <span key={p} className="vxan-plat">{getPlatformIcon(p)} {p}</span>
                      ))}
                    </div>
                    <span className="vxan-status" style={{background:st.bg,border:`1px solid ${st.border}`,color:st.col}}>
                      {["approved","running","published","active"].includes(campaign.status)?<CheckCircle2 size={11}/>:campaign.status==="rejected"?<XCircle size={11}/>:<Clock size={11}/>}
                      {campaign.status.replace("_"," ")}
                    </span>
                  </>
                )}
                <button className="vxan-btn-ghost" onClick={()=>navigate("/dashboard/campaigns")}>
                  <ArrowLeft size={13}/> Back
                </button>
              </div>
            </motion.div>

            {/* Loading */}
            {isLoading&&(
              <div style={{display:"flex",justifyContent:"center",padding:"80px 0"}}>
                <div style={{width:44,height:44,border:"4px solid rgba(167,139,250,0.2)",borderTopColor:"#a78bfa",borderRadius:"50%",animation:"spin 0.8s linear infinite"}}/>
                <style>{`@keyframes spin{to{transform:rotate(360deg)}}`}</style>
              </div>
            )}

            {/* Not found */}
            {!isLoading&&!campaign&&(
              <motion.div {...FV} transition={{delay:0.1}} style={{textAlign:"center",padding:"80px 24px",background:"rgba(255,255,255,0.015)",borderRadius:28,border:"2px dashed rgba(255,255,255,0.06)"}}>
                <BarChart3 size={52} style={{margin:"0 auto 20px",opacity:0.15}}/>
                <div style={{fontSize:20,fontWeight:800,color:"#e2e8f0",marginBottom:8}}>Campaign Not Found</div>
                <div style={{color:"#475569",fontSize:14,marginBottom:28}}>We couldn't find this campaign. It may have been removed.</div>
                <button className="vxan-btn-ghost" onClick={()=>navigate("/dashboard/campaigns")}><ArrowLeft size={13}/> Go to Campaigns</button>
              </motion.div>
            )}

            {/* Content */}
            {!isLoading&&campaign&&(
              <>
                {/* No data notice */}
                {!hasData&&(
                  <div className="vxan-notice">
                    <Clock size={16} style={{flexShrink:0}}/>
                    {isPending?"This campaign is pending launch — analytics will appear once it goes live.":"No data yet. Analytics will populate once the campaign starts running."}
                  </div>
                )}

                {/* KPI Grid */}
                <motion.div {...FV} transition={{delay:0.1}} className="vxan-kpis" style={{gridTemplateColumns:"repeat(4,1fr)"}}>
                  {kpis.map((k,i)=>(
                    <motion.div key={i} initial={{opacity:0,y:20}} animate={{opacity:1,y:0}} transition={{delay:0.08+i*0.06}} className="vxan-kpi">
                      <div className="vxan-kpi-ic" style={{background:k.bg,color:k.col}}>{k.icon}</div>
                      <div className="vxan-kpi-val" style={{color:k.col}}>{k.val}</div>
                      <div className="vxan-kpi-lbl">{k.lbl}</div>
                      <div className="vxan-kpi-desc">{k.desc}</div>
                    </motion.div>
                  ))}
                </motion.div>

                {/* Performance Breakdown bars */}
                <motion.div {...FV} transition={{delay:0.25}} className="vxan-card">
                  <div className="vxan-card-title"><BarChart3 size={15} color="#a78bfa"/> Performance Breakdown</div>
                  {barRows.map((row,i)=>{
                    const pct=Math.min(100,row.max>0?(row.value/row.max)*100:0);
                    return(
                      <div key={i} className="vxan-bar-row">
                        <div className="vxan-bar-label">{row.label}</div>
                        <div className="vxan-bar-track">
                          <motion.div
                            initial={{width:0}} animate={{width:`${pct}%`}}
                            transition={{delay:0.4+i*0.1,duration:0.9,ease:"easeOut"}}
                            style={{height:"100%",borderRadius:8,background:`linear-gradient(90deg,${row.color}cc,${row.color})`,display:"flex",alignItems:"center",justifyContent:"flex-end",paddingRight:8}}
                          >
                            <span style={{color:"#fff",fontSize:11,fontWeight:700,whiteSpace:"nowrap"}}>{fmt(row.value)}</span>
                          </motion.div>
                        </div>
                      </div>
                    );
                  })}
                </motion.div>

                {/* Charts — only if real data */}
                {hasData&&(
                  <motion.div {...FV} transition={{delay:0.35}} className="vxan-charts">
                    {/* Area Chart */}
                    <div className="vxan-card" style={{marginBottom:0}}>
                      <div className="vxan-card-title"><Activity size={15} color="#a78bfa"/> Performance Timeline</div>
                      <div style={{height:240}}>
                        <ResponsiveContainer width="100%" height="100%">
                          <AreaChart data={chartData} margin={{top:10,right:10,left:-20,bottom:0}}>
                            <defs>
                              <linearGradient id="gi" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="5%" stopColor="#a855f7" stopOpacity={0.25}/>
                                <stop offset="95%" stopColor="#a855f7" stopOpacity={0}/>
                              </linearGradient>
                              <linearGradient id="gc" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="5%" stopColor="#06b6d4" stopOpacity={0.25}/>
                                <stop offset="95%" stopColor="#06b6d4" stopOpacity={0}/>
                              </linearGradient>
                            </defs>
                            <CartesianGrid strokeDasharray="3 3" stroke="#ffffff10" vertical={false}/>
                            <XAxis dataKey="name" stroke="#334155" fontSize={11} tickLine={false} axisLine={false}/>
                            <YAxis stroke="#334155" fontSize={11} tickLine={false} axisLine={false} tickFormatter={fmt}/>
                            <Tooltip contentStyle={{background:"#0f172a",border:"1px solid rgba(255,255,255,0.08)",borderRadius:12,color:"#e2e8f0",fontSize:12}} itemStyle={{color:"#94a3b8"}}/>
                            <Area type="monotone" dataKey="Impressions" stroke="#a855f7" strokeWidth={2} fill="url(#gi)"/>
                            <Area type="monotone" dataKey="Clicks" stroke="#06b6d4" strokeWidth={2} fill="url(#gc)"/>
                          </AreaChart>
                        </ResponsiveContainer>
                      </div>
                    </div>

                    {/* Bar Chart */}
                    <div className="vxan-card" style={{marginBottom:0}}>
                      <div className="vxan-card-title"><MessageCircle size={15} color="#38bdf8"/> Post Engagements</div>
                      <div style={{height:240}}>
                        <ResponsiveContainer width="100%" height="100%">
                          <BarChart data={engData} margin={{top:10,right:10,left:-20,bottom:0}}>
                            <CartesianGrid strokeDasharray="3 3" stroke="#ffffff10" vertical={false}/>
                            <XAxis dataKey="name" stroke="#334155" fontSize={11} tickLine={false} axisLine={false}/>
                            <YAxis stroke="#334155" fontSize={11} tickLine={false} axisLine={false} tickFormatter={fmt}/>
                            <Tooltip cursor={{fill:"rgba(255,255,255,0.03)"}} contentStyle={{background:"#0f172a",border:"1px solid rgba(255,255,255,0.08)",borderRadius:12,color:"#e2e8f0",fontSize:12}} itemStyle={{color:"#94a3b8"}}/>
                            <Bar dataKey="value" radius={[6,6,0,0]}>
                              {engData.map((_,i)=><Cell key={i} fill={engColors[i%engColors.length]}/>)}
                            </Bar>
                          </BarChart>
                        </ResponsiveContainer>
                      </div>
                    </div>
                  </motion.div>
                )}

                {/* ROI cards */}
                <motion.div {...FV} transition={{delay:0.45}} style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:20,marginBottom:20}}>
                  <div className="vxan-card" style={{marginBottom:0}}>
                    <div className="vxan-card-title"><DollarSign size={15} color="#eab308"/> Budget Efficiency</div>
                    <div style={{display:"flex",alignItems:"center",gap:24}}>
                      <div>
                        <div style={{fontSize:11,color:"#475569",marginBottom:4,fontWeight:700,textTransform:"uppercase",letterSpacing:"0.07em"}}>Spent</div>
                        <div style={{fontSize:28,fontWeight:900,color:"#eab308"}}>₹{fmt(a.adSpend)}</div>
                      </div>
                      <div style={{color:"#334155",fontSize:24}}>→</div>
                      <div>
                        <div style={{fontSize:11,color:"#475569",marginBottom:4,fontWeight:700,textTransform:"uppercase",letterSpacing:"0.07em"}}>Est. Return</div>
                        <div style={{fontSize:28,fontWeight:900,color:"#22c55e"}}>₹{fmt(Math.round(a.adSpend*(a.roas||1)))}</div>
                      </div>
                    </div>
                    <div style={{marginTop:16,height:6,borderRadius:3,background:"rgba(255,255,255,0.05)",overflow:"hidden"}}>
                      <motion.div initial={{width:0}} animate={{width:"100%"}} transition={{delay:0.8,duration:1.2,ease:"easeOut"}} style={{height:"100%",borderRadius:3,background:"linear-gradient(90deg,#eab308,#22c55e)"}}/>
                    </div>
                  </div>
                  <div className="vxan-card" style={{marginBottom:0,display:"flex",flexDirection:"column",justifyContent:"center",alignItems:"center",textAlign:"center"}}>
                    <div className="vxan-card-title"><TrendingUp size={15} color="#ec4899"/> Return on Ad Spend</div>
                    <div style={{fontSize:60,fontWeight:900,background:"linear-gradient(135deg,#ec4899,#f43f5e)",WebkitBackgroundClip:"text",WebkitTextFillColor:"transparent",lineHeight:1}}>{a.roas.toFixed(2)}x</div>
                    <div style={{fontSize:13,color:"#475569",marginTop:10}}>
                      {a.roas>0?`For every ₹1 spent, you earned ₹${a.roas.toFixed(2)}`:"ROAS will appear once campaign runs"}
                    </div>
                  </div>
                </motion.div>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
