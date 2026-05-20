import { API_BASE } from "../config/api";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router";
import { motion, AnimatePresence } from "framer-motion";
import {
  User, Phone, MapPin, Building2, Edit2, Save, X, Clock,
  CheckCircle2, TrendingUp, Eye, MousePointer, DollarSign, Calendar,
  Instagram, Facebook, Youtube, Linkedin, Twitter, Globe,
  Link as LinkIcon, Sparkles, AlertCircle, BarChart3, History,
  Camera, RefreshCw, ArrowRight, Zap
} from "lucide-react";
import { toast } from "sonner";
import { DashboardSidebar } from "../components/DashboardSidebar";
import { DashboardTopBar } from "../components/DashboardTopBar";

const S = `
  @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800;900&display=swap');
  .vxp-shell{display:flex;height:100vh;background:#070b12;overflow:hidden;font-family:'Inter',sans-serif;}
  .vxp-main{flex:1;display:flex;flex-direction:column;overflow:hidden;}
  .vxp-scroll{flex:1;overflow-y:auto;overflow-x:hidden;padding:32px 36px 100px;}
  .vxp-scroll::-webkit-scrollbar{width:6px;}
  .vxp-scroll::-webkit-scrollbar-thumb{background:rgba(255,255,255,0.08);border-radius:3px;}
  .vxp-orb1{position:fixed;pointer-events:none;border-radius:50%;z-index:0;width:600px;height:600px;top:-160px;right:-120px;background:radial-gradient(circle,rgba(167,139,250,0.09) 0%,transparent 70%);}
  .vxp-orb2{position:fixed;pointer-events:none;border-radius:50%;z-index:0;width:500px;height:500px;bottom:-150px;left:-60px;background:radial-gradient(circle,rgba(56,189,248,0.06) 0%,transparent 70%);}
  .vxp-inner{max-width:1200px;margin:0 auto;position:relative;z-index:1;}
  .vxp-hero{border-radius:28px;padding:36px 44px;margin-bottom:28px;background:linear-gradient(135deg,#0f1628 0%,#111827 60%,#0c1220 100%);border:1px solid rgba(167,139,250,0.14);display:flex;align-items:center;gap:28px;flex-wrap:wrap;position:relative;overflow:hidden;}
  .vxp-hero-line{position:absolute;top:0;left:0;right:0;height:2px;background:linear-gradient(90deg,#a78bfa,#38bdf8,#a78bfa);background-size:200%;animation:vxp-shimmer 3s ease infinite;}
  @keyframes vxp-shimmer{0%,100%{background-position:0%}50%{background-position:100%}}
  .vxp-avatar-wrap{position:relative;flex-shrink:0;}
  .vxp-avatar{width:96px;height:96px;border-radius:28px;background:linear-gradient(135deg,#a78bfa,#38bdf8);display:flex;align-items:center;justify-content:center;font-size:30px;font-weight:900;color:#fff;overflow:hidden;border:3px solid rgba(167,139,250,0.25);box-shadow:0 0 32px rgba(167,139,250,0.2);}
  .vxp-avatar img{width:100%;height:100%;object-fit:cover;}
  .vxp-avatar-cam{position:absolute;bottom:-6px;right:-6px;width:30px;height:30px;border-radius:9px;background:linear-gradient(135deg,#a78bfa,#38bdf8);display:flex;align-items:center;justify-content:center;cursor:pointer;border:2px solid #070b12;color:#fff;}
  .vxp-hero-name{font-size:26px;font-weight:900;letter-spacing:-0.02em;color:#f1f5f9;margin-bottom:4px;}
  .vxp-hero-email{font-size:14px;color:#475569;}
  .vxp-hero-badge{display:flex;align-items:center;gap:6px;margin-top:12px;}
  .vxp-badge{padding:4px 12px;border-radius:20px;font-size:11px;font-weight:700;display:flex;align-items:center;gap:5px;}
  .vxp-badge-green{background:rgba(34,197,94,0.10);border:1px solid rgba(34,197,94,0.2);color:#22c55e;}
  .vxp-badge-purple{background:rgba(167,139,250,0.10);border:1px solid rgba(167,139,250,0.2);color:#a78bfa;}
  .vxp-grid{display:grid;grid-template-columns:1fr 1fr;gap:22px;align-items:start;}
  .vxp-card{border-radius:22px;padding:26px 28px;margin-bottom:18px;background:rgba(255,255,255,0.025);border:1px solid rgba(255,255,255,0.07);}
  .vxp-card:last-child{margin-bottom:0;}
  .vxp-card-hd{display:flex;align-items:center;justify-content:space-between;margin-bottom:22px;}
  .vxp-card-hd-l{display:flex;align-items:center;gap:10px;}
  .vxp-card-ic{width:34px;height:34px;border-radius:10px;display:flex;align-items:center;justify-content:center;flex-shrink:0;}
  .vxp-card-title{font-size:15px;font-weight:800;color:#e2e8f0;}
  .vxp-card-sub{font-size:12px;color:#475569;margin-top:1px;}
  .vxp-edit-btn{display:flex;align-items:center;gap:5px;padding:7px 14px;border-radius:12px;background:rgba(255,255,255,0.04);border:1px solid rgba(255,255,255,0.09);color:#94a3b8;font-size:12px;font-weight:700;cursor:pointer;transition:all 0.2s;font-family:'Inter',sans-serif;}
  .vxp-save-btn{display:flex;align-items:center;gap:5px;padding:7px 16px;border-radius:12px;background:linear-gradient(135deg,#a78bfa,#38bdf8);border:none;color:#fff;font-size:12px;font-weight:700;cursor:pointer;font-family:'Inter',sans-serif;}
  .vxp-cancel-btn{width:32px;height:32px;border-radius:10px;background:rgba(255,255,255,0.04);border:1px solid rgba(255,255,255,0.09);display:flex;align-items:center;justify-content:center;cursor:pointer;color:#64748b;}
  .vxp-info-row{display:flex;align-items:center;gap:14px;padding:12px 14px;border-radius:13px;background:rgba(255,255,255,0.02);border:1px solid rgba(255,255,255,0.06);margin-bottom:9px;}
  .vxp-info-row:last-child{margin-bottom:0;}
  .vxp-info-ic{width:30px;height:30px;border-radius:9px;display:flex;align-items:center;justify-content:center;background:rgba(255,255,255,0.04);color:#475569;flex-shrink:0;}
  .vxp-info-label{font-size:10px;font-weight:700;color:#334155;text-transform:uppercase;letter-spacing:0.07em;margin-bottom:2px;}
  .vxp-info-val{font-size:13px;color:#94a3b8;font-weight:600;}
  .vxp-lbl{display:block;font-size:11px;font-weight:700;color:#334155;text-transform:uppercase;letter-spacing:0.07em;margin-bottom:6px;}
  .vxp-input{width:100%;padding:10px 14px;border-radius:12px;background:rgba(255,255,255,0.02);border:1px solid rgba(255,255,255,0.08);color:#e2e8f0;font-size:14px;outline:none;font-family:'Inter',sans-serif;transition:border-color 0.2s;box-sizing:border-box;margin-bottom:14px;}
  .vxp-input:focus{border-color:rgba(167,139,250,0.4);}
  .vxp-social-row{display:flex;align-items:center;gap:12px;padding:12px 14px;border-radius:13px;background:rgba(255,255,255,0.02);border:1px solid rgba(255,255,255,0.06);margin-bottom:9px;}
  .vxp-social-row:last-child{margin-bottom:0;}
  .vxp-social-ic{width:32px;height:32px;border-radius:10px;display:flex;align-items:center;justify-content:center;flex-shrink:0;}
  .vxp-social-lbl{font-size:10px;font-weight:700;color:#334155;text-transform:uppercase;letter-spacing:0.07em;}
  .vxp-social-url{font-size:13px;font-weight:500;text-decoration:none;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;}
  .vxp-campaign{padding:20px;border-radius:16px;margin-bottom:12px;background:rgba(255,255,255,0.02);border:1px solid rgba(255,255,255,0.06);transition:all 0.2s;}
  .vxp-campaign:hover{border-color:rgba(255,255,255,0.12);}
  .vxp-campaign:last-child{margin-bottom:0;}
  .vxp-stats4{display:grid;grid-template-columns:repeat(4,1fr);gap:10px;padding:14px;border-radius:13px;background:rgba(255,255,255,0.02);border:1px solid rgba(255,255,255,0.06);margin-top:14px;}
  .vxp-cta{border-radius:22px;padding:26px 28px;margin-bottom:18px;background:linear-gradient(135deg,rgba(167,139,250,0.12),rgba(56,189,248,0.08));border:1px solid rgba(167,139,250,0.2);cursor:pointer;display:flex;align-items:center;gap:18px;transition:all 0.25s;}
  .vxp-cta:hover{border-color:rgba(167,139,250,0.4);transform:translateY(-2px);box-shadow:0 12px 32px rgba(167,139,250,0.15);}
  .vxp-cta-ic{width:48px;height:48px;border-radius:16px;background:linear-gradient(135deg,#a78bfa,#38bdf8);display:flex;align-items:center;justify-content:center;color:#fff;flex-shrink:0;box-shadow:0 6px 16px rgba(167,139,250,0.35);}
  .vxp-cta-title{font-size:16px;font-weight:800;color:#e2e8f0;margin-bottom:2px;}
  .vxp-cta-sub{font-size:13px;color:#64748b;}
  .vxp-sync-btn{display:flex;align-items:center;gap:5px;padding:6px 12px;border-radius:10px;background:rgba(255,255,255,0.03);border:1px solid rgba(255,255,255,0.08);color:#64748b;font-size:11px;font-weight:700;cursor:pointer;font-family:'Inter',sans-serif;}
  .vxp-empty{text-align:center;padding:40px 20px;color:#334155;}
  @media(max-width:1024px){.vxp-grid{grid-template-columns:1fr;}}
  @media(max-width:640px){.vxp-scroll{padding:20px 16px 80px;}.vxp-hero{padding:24px 20px;}}
`;

const SOCIAL_META: Record<string, {color:string;icon:React.ReactNode}> = {
  instagram:{color:"#E1306C",icon:<Instagram size={14}/>},
  facebook:{color:"#1877F2",icon:<Facebook size={14}/>},
  youtube:{color:"#FF0000",icon:<Youtube size={14}/>},
  twitter:{color:"#1DA1F2",icon:<Twitter size={14}/>},
  linkedin:{color:"#0A66C2",icon:<Linkedin size={14}/>},
};

interface Ad{id:string;name:string;platforms:string[];budget:string;status:"review"|"active"|"completed"|"paused"|"rejected";createdAt:string;reach?:string;clicks?:string;impressions?:string;spent?:string;}

function getPlatformIcon(p:string){return SOCIAL_META[p.toLowerCase()]?.icon??<Globe size={14}/>;}

function StatusBadge({status}:{status:Ad["status"]}){
  const m:Record<string,[string,string]>={review:["rgba(234,179,8,.10)","#eab308"],active:["rgba(34,197,94,.10)","#22c55e"],completed:["rgba(56,189,248,.10)","#38bdf8"],paused:["rgba(148,163,184,.10)","#94a3b8"],rejected:["rgba(239,68,68,.10)","#ef4444"]};
  const [bg,c]=m[status]??m.paused;
  const lbl={review:"In Review",active:"Active",completed:"Completed",paused:"Paused",rejected:"Rejected"}[status];
  return <span style={{padding:"4px 12px",borderRadius:20,background:bg,color:c,fontSize:11,fontWeight:700,display:"flex",alignItems:"center",gap:4}}>{lbl}</span>;
}

export default function ProfilePage(){
  const navigate=useNavigate();
  const [isEditingProfile,setIsEditingProfile]=useState(false);
  const [isEditingSocial,setIsEditingSocial]=useState(false);
  const [profilePicture,setProfilePicture]=useState<string|null>(null);
  const [adsInReview,setAdsInReview]=useState<Ad[]>([]);
  const [previousAds,setPreviousAds]=useState<Ad[]>([]);
  const [isLoadingCampaigns,setIsLoadingCampaigns]=useState(false);
  const [userInfo,setUserInfo]=useState(()=>{try{return JSON.parse(localStorage.getItem("userInfo")||"{}");}catch{return {};}});
  const [socialLinks,setSocialLinks]=useState<any>(()=>{try{return JSON.parse(localStorage.getItem("socialLinks")||"{}");}catch{return {};}});
  const [tempUserInfo,setTempUserInfo]=useState<any>(userInfo);
  const [tempSocialLinks,setTempSocial]=useState<any>(socialLinks);

  const fetchCampaigns=async()=>{
    const token=localStorage.getItem("authToken");
    if(!token)return;
    setIsLoadingCampaigns(true);
    try{
      const res=await fetch(`${API_BASE}/api/campaign/my-campaigns`,{headers:{Authorization:`Bearer ${token}`}});
      const data=await res.json();
      if(data.success&&data.campaigns){
        const norm:Ad[]=data.campaigns.map((c:any)=>({
          id:c.id,name:c.name,platforms:c.platforms,budget:c.budget,
          status:c.status==="pending"||c.status==="in_review"?"review":c.status==="approved"||c.status==="running"?"active":c.status==="completed"?"completed":c.status==="rejected"?"rejected":"paused",
          createdAt:c.dateSubmitted,
          reach:c.analytics?.reach?.toLocaleString()||"0",clicks:c.analytics?.clicks?.toLocaleString()||"0",
          impressions:c.analytics?.impressions?.toLocaleString()||"0",spent:`?${c.analytics?.adSpend?.toLocaleString()||"0"}`,
        }));
        setAdsInReview(norm.filter(a=>a.status==="review"));
        setPreviousAds(norm.filter(a=>a.status!=="review"));
      }
    }catch{}finally{setIsLoadingCampaigns(false);}
  };

  useEffect(()=>{
    if(localStorage.getItem("isAuthenticated")!=="true"){navigate("/auth",{replace:true});return;}
    const info=localStorage.getItem("userInfo");
    if(info){const p=JSON.parse(info);setProfilePicture(p.picture||null);}
    fetchCampaigns();
  },[navigate]);

  const saveProfile=()=>{setUserInfo(tempUserInfo);localStorage.setItem("userInfo",JSON.stringify(tempUserInfo));setIsEditingProfile(false);toast.success("Profile updated!");};
  const saveSocial=()=>{setSocialLinks(tempSocialLinks);localStorage.setItem("socialLinks",JSON.stringify(tempSocialLinks));setIsEditingSocial(false);toast.success("Social links saved!");};

  const handlePictureUpload=(e:React.ChangeEvent<HTMLInputElement>)=>{
    const f=e.target.files?.[0];if(!f)return;
    if(f.size>5*1024*1024){toast.error("Max 5MB");return;}
    const r=new FileReader();
    r.onload=ev=>{const b=ev.target?.result as string;setProfilePicture(b);const u={...userInfo,picture:b};setUserInfo(u);localStorage.setItem("userInfo",JSON.stringify(u));};
    r.readAsDataURL(f);
  };

  const initials=userInfo.name?userInfo.name.split(" ").map((n:string)=>n[0]).join("").toUpperCase().slice(0,2):"VX";
  const FV={initial:{opacity:0,y:20},animate:{opacity:1,y:0}};

  return(
    <div className="vxp-shell">
      <style dangerouslySetInnerHTML={{__html:S}}/>
      <DashboardSidebar userName={userInfo.name?.split(" ")[0]||"User"} userInitial={initials[0]||"U"}/>
      <div className="vxp-main">
        <DashboardTopBar userName={userInfo.name?.split(" ")[0]||"User"} userInitial={initials[0]||"U"}/>
        <div className="vxp-scroll">
          <div className="vxp-orb1"/><div className="vxp-orb2"/>
          <div className="vxp-inner">
            <motion.div {...FV} transition={{duration:0.45}} className="vxp-hero">
              <div className="vxp-hero-line"/>
              <div className="vxp-avatar-wrap">
                <div className="vxp-avatar">{profilePicture?<img src={profilePicture} alt="P"/>:initials}</div>
                <label className="vxp-avatar-cam"><Camera size={14}/><input type="file" hidden accept="image/*" onChange={handlePictureUpload}/></label>
              </div>
              <div style={{flex:1}}>
                <div className="vxp-hero-name">{userInfo.name||"Your Name"}</div>
                <div className="vxp-hero-email">{userInfo.email||"your@email.com"}</div>
                <div className="vxp-hero-badge">
                  <div className="vxp-badge vxp-badge-green"><div style={{width:6,height:6,borderRadius:"50%",background:"#22c55e"}}/> Active</div>
                  <div className="vxp-badge vxp-badge-purple"><Sparkles size={10}/> AI Enabled</div>
                </div>
              </div>
              <div style={{display:"flex",flexDirection:"column",gap:10}}>
                <button onClick={()=>navigate("/upload")} style={{display:"flex",alignItems:"center",gap:8,padding:"11px 20px",borderRadius:14,background:"linear-gradient(135deg,#a78bfa,#38bdf8)",border:"none",color:"#fff",fontWeight:700,fontSize:14,cursor:"pointer",fontFamily:"'Inter',sans-serif",boxShadow:"0 6px 18px rgba(167,139,250,0.3)"}}><Zap size={14}/> New Campaign</button>
                <button onClick={()=>navigate("/dashboard/campaigns")} style={{display:"flex",alignItems:"center",gap:8,padding:"11px 20px",borderRadius:14,background:"rgba(255,255,255,0.04)",border:"1px solid rgba(255,255,255,0.1)",color:"#94a3b8",fontWeight:700,fontSize:14,cursor:"pointer",fontFamily:"'Inter',sans-serif"}}><BarChart3 size={14}/> Analytics</button>
              </div>
            </motion.div>

            <div className="vxp-grid">
              <div>
                <motion.div {...FV} transition={{delay:0.1}} className="vxp-card">
                  <div className="vxp-card-hd">
                    <div className="vxp-card-hd-l">
                      <div className="vxp-card-ic" style={{background:"rgba(167,139,250,0.12)",color:"#a78bfa"}}><Building2 size={16}/></div>
                      <div><div className="vxp-card-title">Business Details</div><div className="vxp-card-sub">Personal and company info</div></div>
                    </div>
                    {!isEditingProfile?<button className="vxp-edit-btn" onClick={()=>{setTempUserInfo(userInfo);setIsEditingProfile(true);}}><Edit2 size={12}/> Edit</button>:(
                      <div style={{display:"flex",gap:8}}>
                        <button className="vxp-cancel-btn" onClick={()=>setIsEditingProfile(false)}><X size={13}/></button>
                        <button className="vxp-save-btn" onClick={saveProfile}><Save size={12}/> Save</button>
                      </div>
                    )}
                  </div>
                  <AnimatePresence mode="wait">
                    {isEditingProfile?(
                      <motion.div key="edit" initial={{opacity:0}} animate={{opacity:1}} exit={{opacity:0}}>
                        {[{lbl:"Full Name",k:"name",ph:"Your name"},{lbl:"Company",k:"company",ph:"Company"},{lbl:"Phone",k:"phone",ph:"+91..."},{lbl:"Location",k:"location",ph:"City"},{lbl:"Website",k:"website",ph:"https://"}].map(f=>(
                          <div key={f.k}><label className="vxp-lbl">{f.lbl}</label><input className="vxp-input" placeholder={f.ph} value={tempUserInfo[f.k]||""} onChange={e=>setTempUserInfo({...tempUserInfo,[f.k]:e.target.value})}/></div>
                        ))}
                      </motion.div>
                    ):(
                      <motion.div key="view" initial={{opacity:0}} animate={{opacity:1}} exit={{opacity:0}}>
                        {[{icon:<User size={14}/>,lbl:"Full Name",val:userInfo.name},{icon:<Building2 size={14}/>,lbl:"Company",val:userInfo.company},{icon:<Phone size={14}/>,lbl:"Phone",val:userInfo.phone},{icon:<MapPin size={14}/>,lbl:"Location",val:userInfo.location},{icon:<Globe size={14}/>,lbl:"Website",val:userInfo.website}].map((r,i)=>(
                          <div key={i} className="vxp-info-row">
                            <div className="vxp-info-ic">{r.icon}</div>
                            <div><div className="vxp-info-label">{r.lbl}</div><div className="vxp-info-val">{r.val||<span style={{color:"#1e293b",fontStyle:"italic"}}>Not set</span>}</div></div>
                          </div>
                        ))}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.div>

                <motion.div {...FV} transition={{delay:0.16}} className="vxp-card">
                  <div className="vxp-card-hd">
                    <div className="vxp-card-hd-l">
                      <div className="vxp-card-ic" style={{background:"rgba(56,189,248,0.12)",color:"#38bdf8"}}><LinkIcon size={16}/></div>
                      <div><div className="vxp-card-title">Social Links</div><div className="vxp-card-sub">Your social profile URLs</div></div>
                    </div>
                    {!isEditingSocial?<button className="vxp-edit-btn" onClick={()=>{setTempSocial(socialLinks);setIsEditingSocial(true);}}><Edit2 size={12}/> Edit</button>:(
                      <div style={{display:"flex",gap:8}}>
                        <button className="vxp-cancel-btn" onClick={()=>setIsEditingSocial(false)}><X size={13}/></button>
                        <button className="vxp-save-btn" onClick={saveSocial}><Save size={12}/> Save</button>
                      </div>
                    )}
                  </div>
                  <AnimatePresence mode="wait">
                    {isEditingSocial?(
                      <motion.div key="edit" initial={{opacity:0}} animate={{opacity:1}} exit={{opacity:0}}>
                        {(["instagram","facebook","youtube","twitter","linkedin"] as const).map(k=>(
                          <div key={k}><label className="vxp-lbl">{k}</label><input className="vxp-input" placeholder={`https://${k}.com/...`} value={tempSocialLinks[k]||""} onChange={e=>setTempSocial({...tempSocialLinks,[k]:e.target.value})}/></div>
                        ))}
                      </motion.div>
                    ):(
                      <motion.div key="view" initial={{opacity:0}} animate={{opacity:1}} exit={{opacity:0}}>
                        {Object.entries(socialLinks).map(([k,v])=>{
                          if(!v)return null;
                          const meta=SOCIAL_META[k];
                          return(
                            <div key={k} className="vxp-social-row">
                              <div className="vxp-social-ic" style={{background:(meta?.color||"#475569")+"18",color:meta?.color||"#475569"}}>{meta?.icon??<Globe size={14}/>}</div>
                              <div style={{flex:1,minWidth:0}}><div className="vxp-social-lbl">{k}</div><a href={v as string} target="_blank" rel="noreferrer" className="vxp-social-url" style={{color:meta?.color||"#94a3b8"}}>{v as string}</a></div>
                            </div>
                          );
                        })}
                        {Object.values(socialLinks).every(v=>!v)&&<div className="vxp-empty"><Globe size={32} style={{margin:"0 auto 10px",opacity:0.2}}/><div>No links added yet.</div></div>}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.div>
              </div>

              <div>
                <motion.div {...FV} transition={{delay:0.1}} className="vxp-cta" onClick={()=>navigate("/upload")}>
                  <div className="vxp-cta-ic"><Sparkles size={22}/></div>
                  <div style={{flex:1}}><div className="vxp-cta-title">Launch a New Campaign</div><div className="vxp-cta-sub">Upload content & let AI do the rest</div></div>
                  <ArrowRight size={18} color="#a78bfa"/>
                </motion.div>

                <motion.div {...FV} transition={{delay:0.18}} className="vxp-card">
                  <div className="vxp-card-hd">
                    <div className="vxp-card-hd-l">
                      <div className="vxp-card-ic" style={{background:"rgba(234,179,8,0.12)",color:"#eab308"}}><Clock size={16}/></div>
                      <div><div className="vxp-card-title">In Review <span style={{background:"rgba(234,179,8,0.15)",border:"1px solid rgba(234,179,8,0.25)",color:"#eab308",borderRadius:20,fontSize:11,fontWeight:700,padding:"2px 9px",marginLeft:6}}>{adsInReview.length}</span></div><div className="vxp-card-sub">Awaiting approval</div></div>
                    </div>
                    <button className="vxp-sync-btn" onClick={fetchCampaigns}>
                      <motion.span animate={isLoadingCampaigns?{rotate:360}:{rotate:0}} transition={{duration:1,repeat:Infinity,ease:"linear"}} style={{display:"flex"}}><RefreshCw size={11}/></motion.span>
                      {isLoadingCampaigns?"Syncing…":"Sync"}
                    </button>
                  </div>
                  {adsInReview.length===0?<div className="vxp-empty"><Clock size={32} style={{margin:"0 auto 10px",opacity:0.15}}/><div style={{fontSize:13}}>No ads in review</div></div>:
                  adsInReview.map(ad=>(
                    <div key={ad.id} className="vxp-campaign">
                      <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",marginBottom:10}}>
                        <div><div style={{fontSize:14,fontWeight:700,color:"#e2e8f0",marginBottom:3}}>{ad.name}</div><div style={{fontSize:11,color:"#334155",display:"flex",alignItems:"center",gap:4}}><Calendar size={10}/> {new Date(ad.createdAt).toLocaleDateString()}</div></div>
                        <StatusBadge status={ad.status}/>
                      </div>
                      <div style={{display:"flex",gap:6,flexWrap:"wrap"}}>{ad.platforms.map(p=><span key={p} style={{padding:"3px 9px",borderRadius:20,background:"rgba(255,255,255,0.03)",border:"1px solid rgba(255,255,255,0.07)",fontSize:11,fontWeight:600,color:"#475569",display:"flex",alignItems:"center",gap:4}}>{getPlatformIcon(p)} {p}</span>)}</div>
                      <div style={{marginTop:12,paddingTop:12,borderTop:"1px solid rgba(255,255,255,0.06)",display:"flex",alignItems:"center",justifyContent:"space-between"}}><div style={{fontSize:13,fontWeight:700,color:"#06d6c7",display:"flex",alignItems:"center",gap:4}}><DollarSign size={13}/> {ad.budget}</div><div style={{fontSize:11,color:"#eab308",fontWeight:700,display:"flex",alignItems:"center",gap:4}}><AlertCircle size={11}/> Awaiting approval</div></div>
                    </div>
                  ))}
                </motion.div>

                <motion.div {...FV} transition={{delay:0.24}} className="vxp-card">
                  <div className="vxp-card-hd">
                    <div className="vxp-card-hd-l">
                      <div className="vxp-card-ic" style={{background:"rgba(56,189,248,0.12)",color:"#38bdf8"}}><History size={16}/></div>
                      <div><div className="vxp-card-title">Campaign History <span style={{background:"rgba(56,189,248,0.12)",border:"1px solid rgba(56,189,248,0.22)",color:"#38bdf8",borderRadius:20,fontSize:11,fontWeight:700,padding:"2px 9px",marginLeft:6}}>{previousAds.length}</span></div><div className="vxp-card-sub">Past campaigns and analytics</div></div>
                    </div>
                  </div>
                  {previousAds.length===0?<div className="vxp-empty"><BarChart3 size={32} style={{margin:"0 auto 10px",opacity:0.15}}/><div style={{fontSize:13}}>No history yet</div></div>:
                  previousAds.map(ad=>(
                    <div key={ad.id} className="vxp-campaign">
                      <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",marginBottom:10}}>
                        <div><div style={{fontSize:14,fontWeight:700,color:"#e2e8f0",marginBottom:3}}>{ad.name}</div><div style={{fontSize:11,color:"#334155",display:"flex",alignItems:"center",gap:4}}><Calendar size={10}/> {new Date(ad.createdAt).toLocaleDateString()}</div></div>
                        <StatusBadge status={ad.status}/>
                      </div>
                      <div style={{display:"flex",gap:6,flexWrap:"wrap",marginBottom:4}}>{ad.platforms.map(p=><span key={p} style={{padding:"3px 9px",borderRadius:20,background:"rgba(255,255,255,0.03)",border:"1px solid rgba(255,255,255,0.07)",fontSize:11,fontWeight:600,color:"#475569",display:"flex",alignItems:"center",gap:4}}>{getPlatformIcon(p)} {p}</span>)}</div>
                      <div className="vxp-stats4">
                        {[{icon:<Eye size={10} color="#a78bfa"/>,lbl:"Reach",val:ad.reach},{icon:<MousePointer size={10} color="#06d6c7"/>,lbl:"Clicks",val:ad.clicks},{icon:<TrendingUp size={10} color="#38bdf8"/>,lbl:"Impr.",val:ad.impressions},{icon:<DollarSign size={10} color="#22c55e"/>,lbl:"Spent",val:ad.spent}].map((s,i)=>(
                          <div key={i}><div style={{fontSize:10,fontWeight:700,color:"#334155",textTransform:"uppercase",marginBottom:4,display:"flex",alignItems:"center",gap:4}}>{s.icon} {s.lbl}</div><div style={{fontSize:13,fontWeight:700,color:"#94a3b8"}}>{s.val}</div></div>
                        ))}
                      </div>
                    </div>
                  ))}
                </motion.div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
