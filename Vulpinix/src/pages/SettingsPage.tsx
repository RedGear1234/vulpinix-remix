import { useState, useEffect } from "react";
import { useNavigate } from "react-router";
import { motion, AnimatePresence } from "framer-motion";
import {
  Settings, User, Bell, Shield, Palette, Trash2,
  Sun, Moon, Monitor, Eye, EyeOff, Save, ChevronRight,
  Mail, Phone, Lock, AlertTriangle, Check, Smartphone,
  Volume2, VolumeX, Globe, Zap, LogOut, X
} from "lucide-react";
import { toast } from "sonner";
import { DashboardSidebar } from "../components/DashboardSidebar";
import { DashboardTopBar } from "../components/DashboardTopBar";

const S = `
  @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800;900&display=swap');
  .vxst-shell{display:flex;height:100vh;background:#070b12;overflow:hidden;font-family:'Inter',sans-serif;}
  .vxst-main{flex:1;display:flex;flex-direction:column;overflow:hidden;}
  .vxst-scroll{flex:1;overflow-y:auto;overflow-x:hidden;padding:32px 36px 100px;}
  .vxst-scroll::-webkit-scrollbar{width:6px;}
  .vxst-scroll::-webkit-scrollbar-thumb{background:rgba(255,255,255,0.08);border-radius:3px;}
  .vxst-orb1{position:fixed;pointer-events:none;border-radius:50%;z-index:0;width:600px;height:600px;top:-160px;right:-120px;background:radial-gradient(circle,rgba(167,139,250,0.09) 0%,transparent 70%);}
  .vxst-orb2{position:fixed;pointer-events:none;border-radius:50%;z-index:0;width:500px;height:500px;bottom:-150px;left:-60px;background:radial-gradient(circle,rgba(56,189,248,0.06) 0%,transparent 70%);}
  .vxst-inner{max-width:900px;margin:0 auto;position:relative;z-index:1;}

  .vxst-hero{border-radius:28px;padding:36px 44px;margin-bottom:28px;background:linear-gradient(135deg,#0f1628 0%,#111827 60%,#0c1220 100%);border:1px solid rgba(167,139,250,0.14);display:flex;align-items:center;justify-content:space-between;gap:24px;flex-wrap:wrap;position:relative;overflow:hidden;}
  .vxst-hero-line{position:absolute;top:0;left:0;right:0;height:2px;background:linear-gradient(90deg,#a78bfa,#38bdf8,#a78bfa);background-size:200%;animation:vxst-shimmer 3s ease infinite;}
  @keyframes vxst-shimmer{0%,100%{background-position:0%}50%{background-position:100%}}
  .vxst-hero-title{font-size:28px;font-weight:900;letter-spacing:-0.025em;color:#f1f5f9;margin-bottom:6px;}
  .vxst-hero-title span{background:linear-gradient(135deg,#c4b5fd,#67e8f9);-webkit-background-clip:text;-webkit-text-fill-color:transparent;}
  .vxst-hero-sub{color:#64748b;font-size:14px;}

  .vxst-tabs{display:flex;gap:6px;margin-bottom:28px;flex-wrap:wrap;}
  .vxst-tab{display:flex;align-items:center;gap:7px;padding:9px 18px;border-radius:14px;font-size:13px;font-weight:700;cursor:pointer;transition:all 0.2s;border:1px solid rgba(255,255,255,0.07);background:rgba(255,255,255,0.02);color:#475569;font-family:'Inter',sans-serif;}
  .vxst-tab:hover{background:rgba(255,255,255,0.06);color:#94a3b8;}
  .vxst-tab.active{background:rgba(167,139,250,0.10);border-color:rgba(167,139,250,0.25);color:#c4b5fd;}

  .vxst-card{border-radius:22px;padding:28px 30px;margin-bottom:18px;background:rgba(255,255,255,0.025);border:1px solid rgba(255,255,255,0.07);}
  .vxst-card:last-child{margin-bottom:0;}
  .vxst-card-hd{display:flex;align-items:center;justify-content:space-between;margin-bottom:24px;padding-bottom:18px;border-bottom:1px solid rgba(255,255,255,0.06);}
  .vxst-card-hd-l{display:flex;align-items:center;gap:12px;}
  .vxst-card-ic{width:38px;height:38px;border-radius:12px;display:flex;align-items:center;justify-content:center;flex-shrink:0;}
  .vxst-card-title{font-size:16px;font-weight:800;color:#e2e8f0;}
  .vxst-card-sub{font-size:12px;color:#475569;margin-top:2px;}

  .vxst-row{display:flex;align-items:center;justify-content:space-between;padding:14px 0;border-bottom:1px solid rgba(255,255,255,0.04);gap:16px;}
  .vxst-row:last-child{border-bottom:none;padding-bottom:0;}
  .vxst-row:first-child{padding-top:0;}
  .vxst-row-l{flex:1;min-width:0;}
  .vxst-row-title{font-size:14px;font-weight:700;color:#cbd5e1;margin-bottom:3px;}
  .vxst-row-sub{font-size:12px;color:#475569;line-height:1.5;}

  .vxst-toggle{position:relative;width:44px;height:24px;flex-shrink:0;cursor:pointer;}
  .vxst-toggle input{opacity:0;width:0;height:0;position:absolute;}
  .vxst-slider{position:absolute;inset:0;border-radius:24px;background:rgba(255,255,255,0.08);border:1px solid rgba(255,255,255,0.1);transition:all 0.25s;cursor:pointer;}
  .vxst-slider::before{content:'';position:absolute;width:16px;height:16px;border-radius:50%;background:#475569;bottom:3px;left:3px;transition:all 0.25s;}
  .vxst-toggle input:checked + .vxst-slider{background:rgba(167,139,250,0.3);border-color:rgba(167,139,250,0.5);}
  .vxst-toggle input:checked + .vxst-slider::before{transform:translateX(20px);background:#a78bfa;box-shadow:0 0 8px rgba(167,139,250,0.5);}

  .vxst-input{width:100%;padding:11px 14px;border-radius:13px;background:rgba(255,255,255,0.03);border:1px solid rgba(255,255,255,0.08);color:#e2e8f0;font-size:14px;outline:none;font-family:'Inter',sans-serif;transition:border-color 0.2s;box-sizing:border-box;}
  .vxst-input:focus{border-color:rgba(167,139,250,0.4);}
  .vxst-input::placeholder{color:#1e293b;}
  .vxst-lbl{display:block;font-size:11px;font-weight:700;color:#334155;text-transform:uppercase;letter-spacing:0.07em;margin-bottom:6px;}

  .vxst-pass-wrap{position:relative;}
  .vxst-pass-eye{position:absolute;right:12px;top:50%;transform:translateY(-50%);cursor:pointer;color:#334155;background:none;border:none;display:flex;align-items:center;}
  .vxst-pass-eye:hover{color:#64748b;}

  .vxst-theme-btns{display:flex;gap:10px;}
  .vxst-theme-btn{flex:1;padding:14px 12px;border-radius:14px;cursor:pointer;border:1px solid rgba(255,255,255,0.07);background:rgba(255,255,255,0.02);display:flex;flex-direction:column;align-items:center;gap:8px;transition:all 0.2s;color:#475569;font-size:12px;font-weight:700;font-family:'Inter',sans-serif;}
  .vxst-theme-btn:hover{background:rgba(255,255,255,0.05);color:#94a3b8;}
  .vxst-theme-btn.sel{background:rgba(167,139,250,0.08);border-color:rgba(167,139,250,0.3);color:#c4b5fd;}
  .vxst-theme-ic{width:36px;height:36px;border-radius:11px;display:flex;align-items:center;justify-content:center;}

  .vxst-accent-row{display:flex;gap:10px;flex-wrap:wrap;}
  .vxst-accent{width:36px;height:36px;border-radius:11px;cursor:pointer;transition:all 0.2s;border:2px solid transparent;}
  .vxst-accent:hover{transform:scale(1.1);}
  .vxst-accent.sel{border-color:#fff;box-shadow:0 0 12px rgba(255,255,255,0.2);transform:scale(1.1);}

  .vxst-select{width:100%;padding:11px 14px;border-radius:13px;background:rgba(255,255,255,0.03);border:1px solid rgba(255,255,255,0.08);color:#e2e8f0;font-size:14px;outline:none;font-family:'Inter',sans-serif;cursor:pointer;appearance:none;background-image:url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 24 24' fill='none' stroke='%23475569' stroke-width='2'%3E%3Cpolyline points='6 9 12 15 18 9'%3E%3C/polyline%3E%3C/svg%3E");background-repeat:no-repeat;background-position:right 14px center;padding-right:40px;}
  .vxst-select:focus{border-color:rgba(167,139,250,0.4);}
  .vxst-select option{background:#0f172a;}

  .vxst-btn-pri{display:inline-flex;align-items:center;gap:8px;padding:11px 24px;border-radius:13px;background:linear-gradient(135deg,#a78bfa,#38bdf8);border:none;color:#fff;font-weight:700;font-size:14px;cursor:pointer;box-shadow:0 6px 18px rgba(167,139,250,0.28);transition:all 0.2s;font-family:'Inter',sans-serif;}
  .vxst-btn-pri:hover{transform:translateY(-1px);box-shadow:0 10px 26px rgba(167,139,250,0.4);}
  .vxst-btn-ghost{display:inline-flex;align-items:center;gap:8px;padding:10px 20px;border-radius:12px;background:rgba(255,255,255,0.04);border:1px solid rgba(255,255,255,0.09);color:#64748b;font-weight:700;font-size:13px;cursor:pointer;transition:all 0.2s;font-family:'Inter',sans-serif;}
  .vxst-btn-ghost:hover{background:rgba(255,255,255,0.08);color:#94a3b8;}
  .vxst-btn-danger{display:inline-flex;align-items:center;gap:8px;padding:11px 24px;border-radius:13px;background:rgba(239,68,68,0.10);border:1px solid rgba(239,68,68,0.2);color:#ef4444;font-weight:700;font-size:14px;cursor:pointer;transition:all 0.2s;font-family:'Inter',sans-serif;}
  .vxst-btn-danger:hover{background:rgba(239,68,68,0.18);border-color:rgba(239,68,68,0.35);}

  .vxst-danger-card{border-radius:22px;padding:28px 30px;margin-bottom:18px;background:rgba(239,68,68,0.03);border:1px solid rgba(239,68,68,0.12);}
  .vxst-overlay{position:fixed;inset:0;background:rgba(0,0,0,0.82);backdrop-filter:blur(12px);display:flex;align-items:center;justify-content:center;z-index:200;padding:24px;}
  .vxst-modal{background:linear-gradient(135deg,#0f1628,#111827);border:1px solid rgba(239,68,68,0.3);border-radius:24px;padding:40px;max-width:440px;width:100%;box-shadow:0 24px 60px rgba(0,0,0,0.6);}
  .vxst-plan-badge{display:inline-flex;align-items:center;gap:6px;padding:5px 13px;border-radius:20px;background:linear-gradient(135deg,rgba(167,139,250,0.15),rgba(56,189,248,0.1));border:1px solid rgba(167,139,250,0.25);font-size:11px;font-weight:700;color:#c4b5fd;}
  .vxst-save-row{display:flex;align-items:center;justify-content:flex-end;gap:10px;margin-top:20px;padding-top:20px;border-top:1px solid rgba(255,255,255,0.06);}

  @media(max-width:640px){.vxst-scroll{padding:20px 16px 80px;}.vxst-hero{padding:24px 20px;}.vxst-hero-title{font-size:22px;}.vxst-theme-btns{flex-direction:column;}}
`;

const TABS = [
  { id:"account",        label:"Account",        icon:<User          size={14}/> },
  { id:"notifications",  label:"Notifications",  icon:<Bell          size={14}/> },
  { id:"privacy",        label:"Privacy",         icon:<Shield        size={14}/> },
  { id:"appearance",     label:"Appearance",      icon:<Palette       size={14}/> },
  { id:"danger",         label:"Danger Zone",     icon:<AlertTriangle size={14}/> },
];

const ACCENTS = ["#a78bfa","#38bdf8","#22c55e","#f472b6","#fb923c","#eab308","#e11d48","#06b6d4"];

function Toggle({ checked, onChange }: { checked: boolean; onChange: (v: boolean) => void }) {
  return (
    <label className="vxst-toggle">
      <input type="checkbox" checked={checked} onChange={e => onChange(e.target.checked)} />
      <span className="vxst-slider" />
    </label>
  );
}

export default function SettingsPage() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("account");
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [showPass, setShowPass] = useState(false);
  const [saved, setSaved] = useState(false);

  const [name, setName]       = useState("");
  const [email, setEmail]     = useState("");
  const [phone, setPhone]     = useState("");
  const [company, setCompany] = useState("");
  const [website, setWebsite] = useState("");
  const [currentPass, setCurrentPass] = useState("");
  const [newPass, setNewPass]         = useState("");
  const [confirmPass, setConfirmPass] = useState("");

  const [notifEmail,     setNotifEmail]     = useState(true);
  const [notifPush,      setNotifPush]      = useState(true);
  const [notifSMS,       setNotifSMS]       = useState(false);
  const [notifCampaign,  setNotifCampaign]  = useState(true);
  const [notifAnalytics, setNotifAnalytics] = useState(true);
  const [notifBilling,   setNotifBilling]   = useState(true);
  const [notifUpdates,   setNotifUpdates]   = useState(false);
  const [notifMarketing, setNotifMarketing] = useState(false);

  const [profileVisible,    setProfileVisible]    = useState(true);
  const [analyticsTracking, setAnalyticsTracking] = useState(true);
  const [activityStatus,    setActivityStatus]    = useState(true);
  const [twoFactor,         setTwoFactor]         = useState(false);
  const [sessionAlerts,     setSessionAlerts]     = useState(true);

  const [theme,       setTheme]       = useState<"dark"|"light"|"system">("dark");
  const [accent,      setAccent]      = useState("#a78bfa");
  const [language,    setLanguage]    = useState("en");
  const [timezone,    setTimezone]    = useState("Asia/Kolkata");
  const [compactMode, setCompactMode] = useState(false);
  const [animations,  setAnimations]  = useState(true);
  const [soundFx,     setSoundFx]     = useState(false);

  useEffect(() => {
    if (localStorage.getItem("isAuthenticated") !== "true") { navigate("/auth",{replace:true}); return; }
    try {
      const u = JSON.parse(localStorage.getItem("userInfo")||"{}");
      setName(u.name||""); setEmail(u.email||""); setPhone(u.phone||"");
      setCompany(u.company||""); setWebsite(u.website||"");
    } catch {}
    try {
      const s = JSON.parse(localStorage.getItem("vxSettings")||"{}");
      if (s.theme)      setTheme(s.theme);
      if (s.accent)     setAccent(s.accent);
      if (s.language)   setLanguage(s.language);
      if (s.timezone)   setTimezone(s.timezone);
      if (s.compactMode  !== undefined) setCompactMode(s.compactMode);
      if (s.animations   !== undefined) setAnimations(s.animations);
      if (s.soundFx      !== undefined) setSoundFx(s.soundFx);
      if (s.notifEmail   !== undefined) setNotifEmail(s.notifEmail);
      if (s.notifPush    !== undefined) setNotifPush(s.notifPush);
      if (s.notifSMS     !== undefined) setNotifSMS(s.notifSMS);
      if (s.notifCampaign!== undefined) setNotifCampaign(s.notifCampaign);
      if (s.notifAnalytics!==undefined) setNotifAnalytics(s.notifAnalytics);
      if (s.notifBilling !== undefined) setNotifBilling(s.notifBilling);
      if (s.notifUpdates !== undefined) setNotifUpdates(s.notifUpdates);
      if (s.notifMarketing!==undefined) setNotifMarketing(s.notifMarketing);
      if (s.profileVisible    !==undefined) setProfileVisible(s.profileVisible);
      if (s.analyticsTracking !==undefined) setAnalyticsTracking(s.analyticsTracking);
      if (s.activityStatus    !==undefined) setActivityStatus(s.activityStatus);
      if (s.twoFactor         !==undefined) setTwoFactor(s.twoFactor);
      if (s.sessionAlerts     !==undefined) setSessionAlerts(s.sessionAlerts);
    } catch {}
  }, [navigate]);

  const handleSave = () => {
    const u = JSON.parse(localStorage.getItem("userInfo")||"{}");
    localStorage.setItem("userInfo", JSON.stringify({...u, name, email, phone, company, website}));
    localStorage.setItem("vxSettings", JSON.stringify({
      theme, accent, language, timezone, compactMode, animations, soundFx,
      notifEmail, notifPush, notifSMS, notifCampaign, notifAnalytics, notifBilling, notifUpdates, notifMarketing,
      profileVisible, analyticsTracking, activityStatus, twoFactor, sessionAlerts,
    }));
    setSaved(true); toast.success("Settings saved!"); setTimeout(()=>setSaved(false), 2500);
  };

  const handleChangePassword = () => {
    if (!newPass || newPass !== confirmPass) { toast.error("Passwords don't match"); return; }
    if (newPass.length < 8) { toast.error("Password must be at least 8 characters"); return; }
    toast.success("Password updated!"); setCurrentPass(""); setNewPass(""); setConfirmPass("");
  };

  const handleDeleteAccount = () => {
    localStorage.clear(); toast.success("Account deleted. Goodbye!");
    setTimeout(()=>navigate("/"), 1200);
  };

  const userInfo = JSON.parse(localStorage.getItem("userInfo")||"{}");
  const userName = name?.split(" ")[0] || userInfo.name?.split(" ")[0] || "User";
  const userInitial = userName[0]?.toUpperCase()||"U";
  const FV = { initial:{opacity:0,y:16}, animate:{opacity:1,y:0} };

  return (
    <div className="vxst-shell">
      <style dangerouslySetInnerHTML={{ __html: S }}/>
      <DashboardSidebar userName={userName} userInitial={userInitial}/>
      <div className="vxst-main">
        <DashboardTopBar userName={userName} userInitial={userInitial}/>
        <div className="vxst-scroll">
          <div className="vxst-orb1"/><div className="vxst-orb2"/>
          <div className="vxst-inner">

            <motion.div {...FV} transition={{duration:0.45}} className="vxst-hero">
              <div className="vxst-hero-line"/>
              <div>
                <div className="vxst-hero-title">Account <span>Settings</span></div>
                <div className="vxst-hero-sub">Manage your preferences, privacy, notifications and security.</div>
              </div>
              <div style={{display:"flex",alignItems:"center",gap:10}}>
                <div className="vxst-plan-badge"><Zap size={11}/> Free Plan</div>
                <button className="vxst-btn-ghost" onClick={()=>navigate("/profile")}><User size={13}/> My Profile</button>
              </div>
            </motion.div>

            <motion.div {...FV} transition={{delay:0.08}} className="vxst-tabs">
              {TABS.map(t => (
                <button key={t.id} className={`vxst-tab ${activeTab===t.id?"active":""}`} onClick={()=>setActiveTab(t.id)}>
                  {t.icon} {t.label}
                </button>
              ))}
            </motion.div>

            <AnimatePresence mode="wait">

              {/* ── ACCOUNT ── */}
              {activeTab==="account" && (
                <motion.div key="account" initial={{opacity:0,y:12}} animate={{opacity:1,y:0}} exit={{opacity:0,y:-8}} transition={{duration:0.25}}>
                  <div className="vxst-card">
                    <div className="vxst-card-hd">
                      <div className="vxst-card-hd-l">
                        <div className="vxst-card-ic" style={{background:"rgba(167,139,250,0.12)",color:"#a78bfa"}}><User size={17}/></div>
                        <div><div className="vxst-card-title">Personal Information</div><div className="vxst-card-sub">Update your name, email and contact details</div></div>
                      </div>
                    </div>
                    <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:14,marginBottom:14}}>
                      {[
                        {lbl:"Full Name",k:"name",ph:"Your full name",val:name,set:setName,type:"text"},
                        {lbl:"Email Address",k:"email",ph:"your@email.com",val:email,set:setEmail,type:"email"},
                        {lbl:"Phone",k:"phone",ph:"+91 XXXXX XXXXX",val:phone,set:setPhone,type:"text"},
                        {lbl:"Company",k:"company",ph:"Your company",val:company,set:setCompany,type:"text"},
                      ].map(f=>(
                        <div key={f.k}>
                          <label className="vxst-lbl">{f.lbl}</label>
                          <input className="vxst-input" type={f.type} placeholder={f.ph} value={f.val} onChange={e=>f.set(e.target.value)}/>
                        </div>
                      ))}
                      <div style={{gridColumn:"1/-1"}}>
                        <label className="vxst-lbl">Website</label>
                        <input className="vxst-input" placeholder="https://yourwebsite.com" value={website} onChange={e=>setWebsite(e.target.value)}/>
                      </div>
                    </div>
                    <div className="vxst-save-row">
                      <button className="vxst-btn-pri" onClick={handleSave}>{saved?<><Check size={14}/>Saved!</>:<><Save size={14}/>Save Changes</>}</button>
                    </div>
                  </div>

                  <div className="vxst-card">
                    <div className="vxst-card-hd">
                      <div className="vxst-card-hd-l">
                        <div className="vxst-card-ic" style={{background:"rgba(56,189,248,0.12)",color:"#38bdf8"}}><Lock size={17}/></div>
                        <div><div className="vxst-card-title">Change Password</div><div className="vxst-card-sub">Keep your account secure with a strong password</div></div>
                      </div>
                    </div>
                    <div style={{display:"flex",flexDirection:"column",gap:14}}>
                      <div>
                        <label className="vxst-lbl">Current Password</label>
                        <div className="vxst-pass-wrap">
                          <input className="vxst-input" type={showPass?"text":"password"} value={currentPass} onChange={e=>setCurrentPass(e.target.value)} placeholder="Your current password" style={{paddingRight:40}}/>
                          <button className="vxst-pass-eye" onClick={()=>setShowPass(p=>!p)}>{showPass?<EyeOff size={14}/>:<Eye size={14}/>}</button>
                        </div>
                      </div>
                      <div><label className="vxst-lbl">New Password</label><input className="vxst-input" type="password" value={newPass} onChange={e=>setNewPass(e.target.value)} placeholder="Min. 8 characters"/></div>
                      <div><label className="vxst-lbl">Confirm New Password</label><input className="vxst-input" type="password" value={confirmPass} onChange={e=>setConfirmPass(e.target.value)} placeholder="Repeat new password"/></div>
                    </div>
                    <div className="vxst-save-row">
                      <button className="vxst-btn-ghost" onClick={()=>{setCurrentPass("");setNewPass("");setConfirmPass("");}}>Cancel</button>
                      <button className="vxst-btn-pri" onClick={handleChangePassword}><Lock size={14}/> Update Password</button>
                    </div>
                  </div>

                  <div className="vxst-card">
                    <div className="vxst-card-hd">
                      <div className="vxst-card-hd-l">
                        <div className="vxst-card-ic" style={{background:"rgba(251,191,36,0.12)",color:"#fbbf24"}}><Zap size={17}/></div>
                        <div><div className="vxst-card-title">Subscription Plan</div><div className="vxst-card-sub">Manage your current plan and billing</div></div>
                      </div>
                      <div className="vxst-plan-badge"><Zap size={11}/> Free Plan</div>
                    </div>
                    <div style={{padding:"16px 20px",borderRadius:14,background:"rgba(167,139,250,0.06)",border:"1px solid rgba(167,139,250,0.15)",display:"flex",alignItems:"center",justifyContent:"space-between",gap:16,flexWrap:"wrap"}}>
                      <div>
                        <div style={{fontSize:15,fontWeight:800,color:"#e2e8f0",marginBottom:4}}>Upgrade to Pro</div>
                        <div style={{fontSize:13,color:"#475569",lineHeight:1.6}}>Unlock unlimited campaigns, advanced analytics, AI generation & priority support.</div>
                      </div>
                      <button className="vxst-btn-pri" onClick={()=>toast.info("Upgrade flow coming soon!")}><Zap size={14}/> Upgrade Now</button>
                    </div>
                  </div>
                </motion.div>
              )}

              {/* ── NOTIFICATIONS ── */}
              {activeTab==="notifications" && (
                <motion.div key="notif" initial={{opacity:0,y:12}} animate={{opacity:1,y:0}} exit={{opacity:0,y:-8}} transition={{duration:0.25}}>
                  <div className="vxst-card">
                    <div className="vxst-card-hd">
                      <div className="vxst-card-hd-l">
                        <div className="vxst-card-ic" style={{background:"rgba(56,189,248,0.12)",color:"#38bdf8"}}><Bell size={17}/></div>
                        <div><div className="vxst-card-title">Notification Channels</div><div className="vxst-card-sub">Choose how you receive notifications</div></div>
                      </div>
                    </div>
                    {[
                      {icon:<Mail size={15}/>,title:"Email Notifications",sub:"Receive updates via email",val:notifEmail,set:setNotifEmail},
                      {icon:<Smartphone size={15}/>,title:"Push Notifications",sub:"Browser push alerts",val:notifPush,set:setNotifPush},
                      {icon:<Phone size={15}/>,title:"SMS Notifications",sub:"Text message alerts (charges may apply)",val:notifSMS,set:setNotifSMS},
                    ].map((r,i)=>(
                      <div key={i} className="vxst-row">
                        <div style={{display:"flex",alignItems:"center",gap:12,flex:1}}>
                          <div style={{width:34,height:34,borderRadius:10,background:"rgba(255,255,255,0.04)",border:"1px solid rgba(255,255,255,0.07)",display:"flex",alignItems:"center",justifyContent:"center",color:"#475569",flexShrink:0}}>{r.icon}</div>
                          <div className="vxst-row-l"><div className="vxst-row-title">{r.title}</div><div className="vxst-row-sub">{r.sub}</div></div>
                        </div>
                        <Toggle checked={r.val} onChange={r.set}/>
                      </div>
                    ))}
                  </div>
                  <div className="vxst-card">
                    <div className="vxst-card-hd">
                      <div className="vxst-card-hd-l">
                        <div className="vxst-card-ic" style={{background:"rgba(34,197,94,0.12)",color:"#22c55e"}}><Bell size={17}/></div>
                        <div><div className="vxst-card-title">Notification Events</div><div className="vxst-card-sub">Select what you want to be notified about</div></div>
                      </div>
                    </div>
                    {[
                      {title:"Campaign Updates",sub:"When your campaign status changes",val:notifCampaign,set:setNotifCampaign},
                      {title:"Analytics Reports",sub:"Weekly performance summaries and milestones",val:notifAnalytics,set:setNotifAnalytics},
                      {title:"Billing & Payments",sub:"Invoices, payment confirmations and plan changes",val:notifBilling,set:setNotifBilling},
                      {title:"Product Updates",sub:"New features, improvements and announcements",val:notifUpdates,set:setNotifUpdates},
                      {title:"Marketing & Promotions",sub:"Special offers and promotional campaigns",val:notifMarketing,set:setNotifMarketing},
                    ].map((r,i)=>(
                      <div key={i} className="vxst-row">
                        <div className="vxst-row-l"><div className="vxst-row-title">{r.title}</div><div className="vxst-row-sub">{r.sub}</div></div>
                        <Toggle checked={r.val} onChange={r.set}/>
                      </div>
                    ))}
                    <div className="vxst-save-row"><button className="vxst-btn-pri" onClick={handleSave}>{saved?<><Check size={14}/>Saved!</>:<><Save size={14}/>Save Preferences</>}</button></div>
                  </div>
                </motion.div>
              )}

              {/* ── PRIVACY ── */}
              {activeTab==="privacy" && (
                <motion.div key="privacy" initial={{opacity:0,y:12}} animate={{opacity:1,y:0}} exit={{opacity:0,y:-8}} transition={{duration:0.25}}>
                  <div className="vxst-card">
                    <div className="vxst-card-hd">
                      <div className="vxst-card-hd-l">
                        <div className="vxst-card-ic" style={{background:"rgba(56,189,248,0.12)",color:"#38bdf8"}}><Eye size={17}/></div>
                        <div><div className="vxst-card-title">Profile Visibility</div><div className="vxst-card-sub">Control what others can see about you</div></div>
                      </div>
                    </div>
                    {[
                      {title:"Public Profile",sub:"Allow others to see your profile and campaigns",val:profileVisible,set:setProfileVisible},
                      {title:"Analytics Tracking",sub:"Allow Vulpinix to collect usage data to improve your experience",val:analyticsTracking,set:setAnalyticsTracking},
                      {title:"Activity Status",sub:"Show when you were last active on the platform",val:activityStatus,set:setActivityStatus},
                    ].map((r,i)=>(
                      <div key={i} className="vxst-row">
                        <div className="vxst-row-l"><div className="vxst-row-title">{r.title}</div><div className="vxst-row-sub">{r.sub}</div></div>
                        <Toggle checked={r.val} onChange={r.set}/>
                      </div>
                    ))}
                  </div>
                  <div className="vxst-card">
                    <div className="vxst-card-hd">
                      <div className="vxst-card-hd-l">
                        <div className="vxst-card-ic" style={{background:"rgba(167,139,250,0.12)",color:"#a78bfa"}}><Shield size={17}/></div>
                        <div><div className="vxst-card-title">Security</div><div className="vxst-card-sub">Protect your account with additional security layers</div></div>
                      </div>
                    </div>
                    {[
                      {title:"Two-Factor Authentication",sub:"Require a second verification step when logging in",val:twoFactor,set:setTwoFactor},
                      {title:"Login Alerts",sub:"Get notified when a new device signs into your account",val:sessionAlerts,set:setSessionAlerts},
                    ].map((r,i)=>(
                      <div key={i} className="vxst-row">
                        <div className="vxst-row-l"><div className="vxst-row-title">{r.title}</div><div className="vxst-row-sub">{r.sub}</div></div>
                        <Toggle checked={r.val} onChange={r.set}/>
                      </div>
                    ))}
                    <div className="vxst-save-row">
                      <button className="vxst-btn-ghost" onClick={()=>toast.info("Active sessions management coming soon!")}>Manage Sessions</button>
                      <button className="vxst-btn-pri" onClick={handleSave}>{saved?<><Check size={14}/>Saved!</>:<><Save size={14}/>Save Settings</>}</button>
                    </div>
                  </div>
                </motion.div>
              )}

              {/* ── APPEARANCE ── */}
              {activeTab==="appearance" && (
                <motion.div key="appearance" initial={{opacity:0,y:12}} animate={{opacity:1,y:0}} exit={{opacity:0,y:-8}} transition={{duration:0.25}}>
                  <div className="vxst-card">
                    <div className="vxst-card-hd">
                      <div className="vxst-card-hd-l">
                        <div className="vxst-card-ic" style={{background:"rgba(251,191,36,0.12)",color:"#fbbf24"}}><Palette size={17}/></div>
                        <div><div className="vxst-card-title">Theme</div><div className="vxst-card-sub">Choose your preferred colour scheme</div></div>
                      </div>
                    </div>
                    <div className="vxst-theme-btns">
                      {([{id:"dark",label:"Dark",icon:<Moon size={18}/>},{id:"light",label:"Light",icon:<Sun size={18}/>},{id:"system",label:"System",icon:<Monitor size={18}/>}] as const).map(t=>(
                        <button key={t.id} className={`vxst-theme-btn ${theme===t.id?"sel":""}`} onClick={()=>setTheme(t.id)}>
                          <div className="vxst-theme-ic" style={{background:theme===t.id?"rgba(167,139,250,0.15)":"rgba(255,255,255,0.04)",color:theme===t.id?"#a78bfa":"#475569"}}>{t.icon}</div>
                          {t.label}
                          {theme===t.id&&<div style={{width:6,height:6,borderRadius:"50%",background:"#a78bfa"}}/>}
                        </button>
                      ))}
                    </div>
                    <div style={{marginTop:24}}>
                      <div style={{fontSize:12,fontWeight:700,color:"#334155",textTransform:"uppercase",letterSpacing:"0.07em",marginBottom:12}}>Accent Colour</div>
                      <div className="vxst-accent-row">
                        {ACCENTS.map(c=><div key={c} className={`vxst-accent ${accent===c?"sel":""}`} style={{background:c}} onClick={()=>setAccent(c)}/>)}
                      </div>
                    </div>
                  </div>
                  <div className="vxst-card">
                    <div className="vxst-card-hd">
                      <div className="vxst-card-hd-l">
                        <div className="vxst-card-ic" style={{background:"rgba(56,189,248,0.12)",color:"#38bdf8"}}><Globe size={17}/></div>
                        <div><div className="vxst-card-title">Regional</div><div className="vxst-card-sub">Language, timezone and locale settings</div></div>
                      </div>
                    </div>
                    <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:14}}>
                      <div>
                        <label className="vxst-lbl">Language</label>
                        <select className="vxst-select" value={language} onChange={e=>setLanguage(e.target.value)}>
                          <option value="en">English</option>
                          <option value="hi">Hindi</option>
                          <option value="es">Spanish</option>
                          <option value="fr">French</option>
                          <option value="de">German</option>
                          <option value="ja">Japanese</option>
                          <option value="zh">Chinese</option>
                        </select>
                      </div>
                      <div>
                        <label className="vxst-lbl">Timezone</label>
                        <select className="vxst-select" value={timezone} onChange={e=>setTimezone(e.target.value)}>
                          <option value="Asia/Kolkata">India (IST)</option>
                          <option value="America/New_York">New York (EST)</option>
                          <option value="America/Los_Angeles">Los Angeles (PST)</option>
                          <option value="Europe/London">London (GMT)</option>
                          <option value="Europe/Paris">Paris (CET)</option>
                          <option value="Asia/Tokyo">Tokyo (JST)</option>
                          <option value="Asia/Dubai">Dubai (GST)</option>
                          <option value="Australia/Sydney">Sydney (AEST)</option>
                        </select>
                      </div>
                    </div>
                  </div>
                  <div className="vxst-card">
                    <div className="vxst-card-hd">
                      <div className="vxst-card-hd-l">
                        <div className="vxst-card-ic" style={{background:"rgba(34,197,94,0.12)",color:"#22c55e"}}><Settings size={17}/></div>
                        <div><div className="vxst-card-title">Interface</div><div className="vxst-card-sub">Visual and interaction preferences</div></div>
                      </div>
                    </div>
                    {[
                      {title:"Compact Mode",sub:"Reduce spacing for a denser layout",val:compactMode,set:setCompactMode},
                      {title:"Animations",sub:"Enable smooth transitions and micro-animations",val:animations,set:setAnimations},
                      {title:"Sound Effects",sub:"Play subtle sounds on actions and notifications",val:soundFx,set:setSoundFx},
                    ].map((r,i)=>(
                      <div key={i} className="vxst-row">
                        <div className="vxst-row-l"><div className="vxst-row-title">{r.title}</div><div className="vxst-row-sub">{r.sub}</div></div>
                        <Toggle checked={r.val} onChange={r.set}/>
                      </div>
                    ))}
                    <div className="vxst-save-row"><button className="vxst-btn-pri" onClick={handleSave}>{saved?<><Check size={14}/>Saved!</>:<><Save size={14}/>Save Appearance</>}</button></div>
                  </div>
                </motion.div>
              )}

              {/* ── DANGER ── */}
              {activeTab==="danger" && (
                <motion.div key="danger" initial={{opacity:0,y:12}} animate={{opacity:1,y:0}} exit={{opacity:0,y:-8}} transition={{duration:0.25}}>
                  <div className="vxst-danger-card">
                    <div className="vxst-card-hd">
                      <div className="vxst-card-hd-l">
                        <div className="vxst-card-ic" style={{background:"rgba(239,68,68,0.12)",color:"#ef4444"}}><AlertTriangle size={17}/></div>
                        <div><div className="vxst-card-title" style={{color:"#ef4444"}}>Danger Zone</div><div className="vxst-card-sub">These actions are irreversible. Proceed with caution.</div></div>
                      </div>
                    </div>
                    {[
                      {title:"Sign Out of All Devices",sub:"Revoke all active sessions and sign out everywhere.",btn:"Sign Out All",icon:<LogOut size={14}/>,action:()=>{toast.info("All sessions revoked.");setTimeout(()=>{localStorage.clear();navigate("/auth");},1200);}},
                      {title:"Export Your Data",sub:"Download a copy of all your campaigns, analytics and account data.",btn:"Export Data",icon:<ChevronRight size={14}/>,action:()=>toast.info("Data export coming soon!")},
                    ].map((r,i)=>(
                      <div key={i} className="vxst-row">
                        <div className="vxst-row-l"><div className="vxst-row-title">{r.title}</div><div className="vxst-row-sub">{r.sub}</div></div>
                        <button className="vxst-btn-ghost" onClick={r.action}>{r.icon} {r.btn}</button>
                      </div>
                    ))}
                    <div style={{marginTop:20,padding:"20px",borderRadius:16,background:"rgba(239,68,68,0.06)",border:"1px solid rgba(239,68,68,0.18)"}}>
                      <div style={{display:"flex",alignItems:"flex-start",justifyContent:"space-between",gap:16,flexWrap:"wrap"}}>
                        <div>
                          <div style={{fontSize:15,fontWeight:800,color:"#ef4444",marginBottom:5}}>Delete Account</div>
                          <div style={{fontSize:13,color:"#64748b",lineHeight:1.6,maxWidth:380}}>Permanently delete your Vulpinix account, all campaigns, analytics data and connected accounts. <strong style={{color:"#94a3b8"}}>This cannot be undone.</strong></div>
                        </div>
                        <button className="vxst-btn-danger" onClick={()=>setShowDeleteConfirm(true)}><Trash2 size={14}/> Delete Account</button>
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>

      {/* Delete confirmation modal */}
      <AnimatePresence>
        {showDeleteConfirm && (
          <motion.div initial={{opacity:0}} animate={{opacity:1}} exit={{opacity:0}} className="vxst-overlay" onClick={()=>setShowDeleteConfirm(false)}>
            <motion.div initial={{scale:0.88,opacity:0}} animate={{scale:1,opacity:1}} exit={{scale:0.88,opacity:0}} transition={{type:"spring",stiffness:280,damping:22}} className="vxst-modal" onClick={e=>e.stopPropagation()}>
              <div style={{width:60,height:60,borderRadius:18,background:"rgba(239,68,68,0.12)",border:"2px solid rgba(239,68,68,0.3)",display:"flex",alignItems:"center",justifyContent:"center",margin:"0 auto 20px"}}>
                <Trash2 size={28} color="#ef4444"/>
              </div>
              <div style={{fontSize:22,fontWeight:900,color:"#e2e8f0",textAlign:"center",marginBottom:10}}>Delete Account?</div>
              <div style={{fontSize:14,color:"#475569",textAlign:"center",lineHeight:1.7,marginBottom:28}}>This will permanently erase your account, all campaigns and data.<br/><strong style={{color:"#94a3b8"}}>There is no undo.</strong></div>
              <div style={{display:"flex",gap:12}}>
                <button className="vxst-btn-ghost" style={{flex:1,justifyContent:"center"}} onClick={()=>setShowDeleteConfirm(false)}><X size={14}/> Cancel</button>
                <button className="vxst-btn-danger" style={{flex:1,justifyContent:"center"}} onClick={handleDeleteAccount}><Trash2 size={14}/> Yes, Delete</button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
