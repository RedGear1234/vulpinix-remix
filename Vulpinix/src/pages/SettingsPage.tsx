import { useState, useEffect } from "react";
import { API_BASE } from "../config/api";
import { useNavigate, useParams } from "react-router";
import { motion, AnimatePresence } from "framer-motion";
import {
  Settings, User, Bell, Shield, Palette, Trash2,
  Sun, Moon, Monitor, Eye, EyeOff, Save, ChevronRight,
  Mail, Phone, Lock, AlertTriangle, Check, Smartphone,
  Globe, Zap, LogOut, X, Building2, Users, Upload, CheckCircle2, CreditCard, Bot, Sparkles, Type, MessageSquare, Target, ChevronDown,
  Code2, Key, Copy, Plus, RefreshCw, ExternalLink
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

  .vxst-code-block{background:#040711;border:1px solid rgba(255,255,255,0.06);border-radius:14px;padding:16px 20px;font-family:'Courier New',Courier,monospace;font-size:13px;color:#cbd5e1;overflow-x:auto;position:relative;}
  .vxst-doc-tab{padding:6px 12px;font-size:12px;font-weight:700;color:#475569;cursor:pointer;border-radius:8px;border:1px solid transparent;transition:all 0.2s;user-select:none;}
  .vxst-doc-tab:hover{color:#94a3b8;background:rgba(255,255,255,0.03);}
  .vxst-doc-tab.active{background:rgba(167,139,250,0.1);color:#c4b5fd;border-color:rgba(167,139,250,0.15);}
  .vxst-doc-tabs{display:flex;gap:6px;}

  @media(max-width:640px){.vxst-scroll{padding:20px 16px 80px;}.vxst-hero{padding:24px 20px;}.vxst-hero-title{font-size:22px;}.vxst-theme-btns{flex-direction:column;}}
`;

// Using Sub-Sidebar instead of top tabs

const ACCENTS = ["#a78bfa","#38bdf8","#22c55e","#f472b6","#fb923c","#eab308","#e11d48","#06b6d4"];

function Toggle({ checked, onChange }: { checked: boolean; onChange: (v: boolean) => void }) {
  return (
    <label className="vxst-toggle">
      <input type="checkbox" checked={checked} onChange={e => onChange(e.target.checked)} />
      <span className="vxst-slider" />
    </label>
  );
}

function CustomSelect({ options, value, onChange, style }: any) {
  const [open, setOpen] = useState(false);
  const selectedOption = options.find((o: any) => o.value === value) || options[0];
  
  return (
    <div style={{position: "relative", ...style}}>
      <div 
        className="vxst-input" 
        style={{display: "flex", alignItems: "center", justifyContent: "space-between", cursor: "pointer", userSelect: "none"}}
        onClick={() => setOpen(!open)}
      >
        <span>{selectedOption?.label}</span>
        <ChevronDown size={14} style={{color: "#64748b", transform: open ? "rotate(180deg)" : "none", transition: "0.2s"}}/>
      </div>
      <AnimatePresence>
        {open && (
          <>
            <div style={{position:"fixed",inset:0,zIndex:99}} onClick={()=>setOpen(false)}/>
            <motion.div
              initial={{opacity:0,y:4,scale:0.98}}
              animate={{opacity:1,y:0,scale:1}}
              exit={{opacity:0,y:4,scale:0.98}}
              transition={{duration:0.15}}
              style={{
                position:"absolute", top:"calc(100% + 6px)", left:0, right:0, zIndex:100,
                background:"#0f172a", border:"1px solid rgba(255,255,255,0.1)", borderRadius:12,
                padding:6, boxShadow:"0 12px 32px rgba(0,0,0,0.4)", display:"flex", flexDirection:"column", gap:2,
                maxHeight: 250, overflowY: "auto"
              }}
            >
              {options.map((o: any) => (
                <div 
                  key={o.value}
                  onClick={() => { onChange(o.value); setOpen(false); }}
                  style={{
                    padding: "8px 12px", borderRadius: 8, cursor: "pointer", fontSize: 13, userSelect: "none",
                    background: o.value === value ? "rgba(167,139,250,0.15)" : "transparent",
                    color: o.value === value ? "#d8b4fe" : "#cbd5e1",
                    transition: "all 0.1s"
                  }}
                  onMouseEnter={e => e.currentTarget.style.background = o.value === value ? "rgba(167,139,250,0.15)" : "rgba(255,255,255,0.05)"}
                  onMouseLeave={e => e.currentTarget.style.background = o.value === value ? "rgba(167,139,250,0.15)" : "transparent"}
                >
                  {o.label}
                </div>
              ))}
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  )
}

export default function SettingsPage() {
  const navigate = useNavigate();
  const { tab = "profile" } = useParams();
  
  // Map sub-sidebar paths to internal sections
  const getActiveSection = () => {
    if (tab === "profile") return "account";
    if (tab === "notifications") return "notifications";
    return tab;
  };
  
  const activeTab = getActiveSection();
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [showInviteModal, setShowInviteModal] = useState(false);
  const [inviteName, setInviteName] = useState("");
  const [inviteEmail, setInviteEmail] = useState("");
  const [inviteRole, setInviteRole] = useState("Editor");
  const [teamMembers, setTeamMembers] = useState<{name: string, email: string, role: string, initial: string}[]>(() => {
    try {
      const s = JSON.parse(localStorage.getItem("vxSettings") || "{}");
      if (s.teamMembers && Array.isArray(s.teamMembers)) {
        return s.teamMembers;
      }
    } catch {}
    return [
      { name: "Sarah Jenkins", email: "sarah@example.com", role: "Editor", initial: "S" },
      { name: "Mike Ross", email: "mike@example.com", role: "Viewer", initial: "M" }
    ];
  });
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

  const [workspaceName, setWorkspaceName] = useState("My Workspace");
  const [workspaceSlug, setWorkspaceSlug] = useState("my-workspace");
  const [workspaceWebsite, setWorkspaceWebsite] = useState("https://");
  const [workspaceIndustry, setWorkspaceIndustry] = useState("agency");
  const [workspaceLogo, setWorkspaceLogo] = useState<string | null>(null);
  const [workspaceTimezone, setWorkspaceTimezone] = useState("America/New_York");
  const [workspaceCurrency, setWorkspaceCurrency] = useState("USD");

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

  // Brand Kit
  const [brandPrimary, setBrandPrimary] = useState("#A78BFA");
  const [brandSecondary, setBrandSecondary] = useState("#38BDF8");
  const [brandTypography, setBrandTypography] = useState("inter");

  // AI Profile
  const [aiCreativity, setAiCreativity] = useState("balanced");
  const [aiModel, setAiModel] = useState("gpt4o");
  const [aiImageGen, setAiImageGen] = useState("midjourney");
  const [aiAutoCaption, setAiAutoCaption] = useState(true);
  const [aiMultiLang, setAiMultiLang] = useState(false);
  const [geminiApiKey, setGeminiApiKey] = useState("");
  const [showGeminiKey, setShowGeminiKey] = useState(false);

  // Brand Persona
  const [brandTone, setBrandTone] = useState("friendly");
  const [brandMission, setBrandMission] = useState("Vulpinix is an advanced AI-powered social media management tool designed to help brands automate their workflow with cutting-edge creativity.");
  const [brandAudience, setBrandAudience] = useState("Marketing Professionals, Agency Owners, Social Media Managers");
  const [brandPainPoints, setBrandPainPoints] = useState("Lack of time for social media consistency, creative burnout, poor analytics tracking.");

  // API Keys & Webhooks Settings state
  const [apiKeys, setApiKeys] = useState<{ id: string; name: string; key: string; createdAt: string; lastUsed: string }[]>([]);
  const [newKeyName, setNewKeyName] = useState("");
  const [newlyCreatedKey, setNewlyCreatedKey] = useState<string | null>(null);
  const [visibleKeys, setVisibleKeys] = useState<{ [key: string]: boolean }>({});

  const [webhookUrl, setWebhookUrl] = useState("");
  const [webhookSecret, setWebhookSecret] = useState("");
  const [webhookEvents, setWebhookEvents] = useState<string[]>([]);
  const [webhookSaved, setWebhookSaved] = useState(false);
  const [docLanguage, setDocLanguage] = useState<"curl" | "js" | "python">("curl");

  useEffect(() => {
    if (localStorage.getItem("isAuthenticated") !== "true") { navigate("/auth",{replace:true}); return; }

    const fetchUserData = async () => {
      try {
        const token = localStorage.getItem("authToken");
        if (!token) return;

        // Fetch Profile
        try {
          const profileRes = await fetch(`${API_BASE}/api/users/profile`, {
            headers: { "Authorization": `Bearer ${token}` }
          });
          if (profileRes.ok) {
            const pData = await profileRes.json();
            if (pData.success && pData.user) {
              const u = pData.user;
              localStorage.setItem("userInfo", JSON.stringify(u));
              setName(u.name||""); setEmail(u.email||""); setPhone(u.phone||"");
              setCompany(u.company||""); setWebsite(u.website||"");
            }
          }
        } catch (err) {
          console.error("Failed to fetch profile", err);
        }

        // Fetch Settings
        const res = await fetch(`${API_BASE}/api/users/settings`, {
          headers: { "Authorization": `Bearer ${token}` }
        });
        if (res.ok) {
          const data = await res.json();
          if (data.success && data.settings) {
            const s = data.settings;
            // Merge with local storage
            const localS = JSON.parse(localStorage.getItem("vxSettings")||"{}");
            const mergedS = { ...localS, ...s };
            localStorage.setItem("vxSettings", JSON.stringify(mergedS));

            if (mergedS.workspaceName) setWorkspaceName(mergedS.workspaceName);
            if (mergedS.workspaceSlug) setWorkspaceSlug(mergedS.workspaceSlug);
            if (mergedS.workspaceWebsite) setWorkspaceWebsite(mergedS.workspaceWebsite);
            if (mergedS.workspaceIndustry) setWorkspaceIndustry(mergedS.workspaceIndustry);
            if (mergedS.workspaceLogo) setWorkspaceLogo(mergedS.workspaceLogo);
            if (mergedS.workspaceTimezone) setWorkspaceTimezone(mergedS.workspaceTimezone);
            if (mergedS.workspaceCurrency) setWorkspaceCurrency(mergedS.workspaceCurrency);
            
            if (mergedS.theme)      setTheme(mergedS.theme);
            if (mergedS.accent)     setAccent(mergedS.accent);
            if (mergedS.language)   setLanguage(mergedS.language);
            if (mergedS.timezone)   setTimezone(mergedS.timezone);
            if (mergedS.compactMode  !== undefined) setCompactMode(mergedS.compactMode);
            if (mergedS.animations   !== undefined) setAnimations(mergedS.animations);
            if (mergedS.soundFx      !== undefined) setSoundFx(mergedS.soundFx);
            if (mergedS.notifEmail   !== undefined) setNotifEmail(mergedS.notifEmail);
            if (mergedS.notifPush    !== undefined) setNotifPush(mergedS.notifPush);
            if (mergedS.notifSMS     !== undefined) setNotifSMS(mergedS.notifSMS);
            if (mergedS.notifCampaign!== undefined) setNotifCampaign(mergedS.notifCampaign);
            if (mergedS.notifAnalytics!==undefined) setNotifAnalytics(mergedS.notifAnalytics);
            if (mergedS.notifBilling !== undefined) setNotifBilling(mergedS.notifBilling);
            if (mergedS.notifUpdates !== undefined) setNotifUpdates(mergedS.notifUpdates);
            if (mergedS.notifMarketing!==undefined) setNotifMarketing(mergedS.notifMarketing);
            if (mergedS.profileVisible    !==undefined) setProfileVisible(mergedS.profileVisible);
            if (mergedS.analyticsTracking !==undefined) setAnalyticsTracking(mergedS.analyticsTracking);
            if (mergedS.activityStatus    !==undefined) setActivityStatus(mergedS.activityStatus);
            if (mergedS.twoFactor         !==undefined) setTwoFactor(mergedS.twoFactor);
            if (mergedS.sessionAlerts     !==undefined) setSessionAlerts(mergedS.sessionAlerts);

            if (mergedS.brandPrimary) setBrandPrimary(mergedS.brandPrimary);
            if (mergedS.brandSecondary) setBrandSecondary(mergedS.brandSecondary);
            if (mergedS.brandTypography) setBrandTypography(mergedS.brandTypography);
            if (mergedS.aiCreativity) setAiCreativity(mergedS.aiCreativity);
            if (mergedS.aiModel) setAiModel(mergedS.aiModel);
            if (mergedS.aiImageGen) setAiImageGen(mergedS.aiImageGen);
            if (mergedS.aiAutoCaption !== undefined) setAiAutoCaption(mergedS.aiAutoCaption);
            if (mergedS.aiMultiLang !== undefined) setAiMultiLang(mergedS.aiMultiLang);
            if (mergedS.geminiApiKey) setGeminiApiKey(mergedS.geminiApiKey);
            if (mergedS.brandTone) setBrandTone(mergedS.brandTone);
            if (mergedS.brandMission) setBrandMission(mergedS.brandMission);
            if (mergedS.brandAudience) setBrandAudience(mergedS.brandAudience);
            if (mergedS.brandPainPoints) setBrandPainPoints(mergedS.brandPainPoints);
            if (mergedS.teamMembers) setTeamMembers(mergedS.teamMembers);

            // API & Webhook loading
            if (mergedS.apiKeys) setApiKeys(mergedS.apiKeys);
            if (mergedS.webhookUrl) setWebhookUrl(mergedS.webhookUrl);
            if (mergedS.webhookSecret) {
              setWebhookSecret(mergedS.webhookSecret);
            } else {
              const sec = "whsec_" + Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
              setWebhookSecret(sec);
            }
            if (mergedS.webhookEvents) setWebhookEvents(mergedS.webhookEvents);
          }
        }
      } catch (err) {
        console.error("Failed to sync settings from DB", err);
      }
    };
    fetchUserData();

    // Fallback to local user info if fetch fails or is pending
    try {
      if (!name) {
        const u = JSON.parse(localStorage.getItem("userInfo")||"{}");
        setName(u.name||""); setEmail(u.email||""); setPhone(u.phone||"");
        setCompany(u.company||""); setWebsite(u.website||"");
      }
    } catch {}
  }, [navigate]);

  const handleSave = async () => {
    const sObj = {
      theme, accent, language, timezone, compactMode, animations, soundFx,
      notifEmail, notifPush, notifSMS, notifCampaign, notifAnalytics, notifBilling, notifUpdates, notifMarketing,
      profileVisible, analyticsTracking, activityStatus, twoFactor, sessionAlerts,
      workspaceName, workspaceSlug, workspaceWebsite, workspaceIndustry, workspaceLogo,
      workspaceTimezone, workspaceCurrency,
      brandPrimary, brandSecondary, brandTypography,
      aiCreativity, aiModel, aiImageGen, aiAutoCaption, aiMultiLang,
      geminiApiKey,
      brandTone, brandMission, brandAudience, brandPainPoints,
      apiKeys, webhookUrl, webhookSecret, webhookEvents, teamMembers
    };

    const u = JSON.parse(localStorage.getItem("userInfo")||"{}");
    localStorage.setItem("userInfo", JSON.stringify({...u, name, email, phone, company, website}));
    localStorage.setItem("vxSettings", JSON.stringify(sObj));

    try {
      const token = localStorage.getItem("authToken");
      if (token) {
        // Sync profile changes
        fetch(`${API_BASE}/api/users/profile`, {
          method: "PATCH",
          headers: { "Content-Type": "application/json", "Authorization": `Bearer ${token}` },
          body: JSON.stringify({ phone, company, website })
        });
        
        // Sync settings
        await fetch(`${API_BASE}/api/users/settings`, {
          method: "PATCH",
          headers: { "Content-Type": "application/json", "Authorization": `Bearer ${token}` },
          body: JSON.stringify({ settings: sObj })
        });
      }
    } catch (err) {
      console.error("Failed to sync settings", err);
    }

    setSaved(true); toast.success("Settings saved!"); setTimeout(()=>setSaved(false), 2500);
  };

  const handleSettingToggle = async (setter: React.Dispatch<React.SetStateAction<boolean>>, key: string, value: boolean, label: string) => {
    setter(value);
    const s = JSON.parse(localStorage.getItem("vxSettings")||"{}");
    s[key] = value;
    localStorage.setItem("vxSettings", JSON.stringify(s));
    
    try {
      const token = localStorage.getItem("authToken");
      if (token) {
        await fetch(`${API_BASE}/api/users/settings`, {
          method: "PATCH",
          headers: { "Content-Type": "application/json", "Authorization": `Bearer ${token}` },
          body: JSON.stringify({ settings: { [key]: value } })
        });
      }
    } catch (err) {}

    toast.success(`${label} updated`);
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

  const handleInviteMember = () => {
    if (!inviteName.trim()) {
      toast.error("Please enter a name");
      return;
    }
    if (!inviteEmail.trim() || !inviteEmail.includes("@")) {
      toast.error("Please enter a valid email address");
      return;
    }
    
    const newMember = {
      name: inviteName.trim(),
      email: inviteEmail.trim(),
      role: inviteRole,
      initial: inviteName.trim().charAt(0).toUpperCase() || "M"
    };

    const updatedMembers = [...teamMembers, newMember];
    setTeamMembers(updatedMembers);
    
    // Save to settings
    const s = JSON.parse(localStorage.getItem("vxSettings") || "{}");
    s.teamMembers = updatedMembers;
    localStorage.setItem("vxSettings", JSON.stringify(s));

    // Try to sync with server
    try {
      const tokenLocal = localStorage.getItem("authToken");
      if (tokenLocal) {
        fetch(`${API_BASE}/api/users/settings`, {
          method: "PATCH",
          headers: { "Content-Type": "application/json", "Authorization": `Bearer ${tokenLocal}` },
          body: JSON.stringify({ settings: { teamMembers: updatedMembers } })
        });
      }
    } catch (err) {
      console.error(err);
    }

    // Reset inputs
    setInviteName("");
    setInviteEmail("");
    setInviteRole("Editor");
    setShowInviteModal(false);
    
    toast.success(`${newMember.name} has been invited successfully!`);
  };

  const handleRemoveMember = (indexToRemove: number) => {
    const updatedMembers = teamMembers.filter((_, idx) => idx !== indexToRemove);
    setTeamMembers(updatedMembers);

    const s = JSON.parse(localStorage.getItem("vxSettings") || "{}");
    s.teamMembers = updatedMembers;
    localStorage.setItem("vxSettings", JSON.stringify(s));

    try {
      const tokenLocal = localStorage.getItem("authToken");
      if (tokenLocal) {
        fetch(`${API_BASE}/api/users/settings`, {
          method: "PATCH",
          headers: { "Content-Type": "application/json", "Authorization": `Bearer ${tokenLocal}` },
          body: JSON.stringify({ settings: { teamMembers: updatedMembers } })
        });
      }
    } catch (err) {}
    toast.success("Team member removed successfully.");
  };

  const generateWebhookSecret = () => {
    const chars = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
    let res = "whsec_";
    for (let i = 0; i < 24; i++) {
      res += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return res;
  };

  const generateApiKeyToken = () => {
    const chars = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
    let res = "vx_live_";
    for (let i = 0; i < 32; i++) {
      res += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return res;
  };

  const handleGenerateKey = async () => {
    if (!newKeyName.trim()) {
      toast.error("Please enter a key name");
      return;
    }
    const token = generateApiKeyToken();
    const newKey = {
      id: "key_" + Math.random().toString(36).substring(2, 9),
      name: newKeyName.trim(),
      key: token,
      createdAt: new Date().toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }),
      lastUsed: "Never"
    };

    const updatedKeys = [...apiKeys, newKey];
    setApiKeys(updatedKeys);
    setNewlyCreatedKey(token);
    setNewKeyName("");
    
    // Save to settings
    const s = JSON.parse(localStorage.getItem("vxSettings") || "{}");
    s.apiKeys = updatedKeys;
    localStorage.setItem("vxSettings", JSON.stringify(s));
    
    try {
      const tokenLocal = localStorage.getItem("authToken");
      if (tokenLocal) {
        await fetch(`${API_BASE}/api/users/settings`, {
          method: "PATCH",
          headers: { "Content-Type": "application/json", "Authorization": `Bearer ${tokenLocal}` },
          body: JSON.stringify({ settings: { apiKeys: updatedKeys } })
        });
      }
    } catch (err) {
      console.error(err);
    }
    toast.success("API Key generated successfully!");
  };

  const handleRevokeKey = async (id: string) => {
    const updatedKeys = apiKeys.filter(k => k.id !== id);
    setApiKeys(updatedKeys);
    
    const s = JSON.parse(localStorage.getItem("vxSettings") || "{}");
    s.apiKeys = updatedKeys;
    localStorage.setItem("vxSettings", JSON.stringify(s));
    
    try {
      const tokenLocal = localStorage.getItem("authToken");
      if (tokenLocal) {
        await fetch(`${API_BASE}/api/users/settings`, {
          method: "PATCH",
          headers: { "Content-Type": "application/json", "Authorization": `Bearer ${tokenLocal}` },
          body: JSON.stringify({ settings: { apiKeys: updatedKeys } })
        });
      }
    } catch (err) {
      console.error(err);
    }
    toast.success("API Key revoked successfully.");
  };

  const handleSaveWebhook = async () => {
    const s = JSON.parse(localStorage.getItem("vxSettings") || "{}");
    s.webhookUrl = webhookUrl;
    s.webhookSecret = webhookSecret || generateWebhookSecret();
    s.webhookEvents = webhookEvents;
    localStorage.setItem("vxSettings", JSON.stringify(s));
    
    try {
      const tokenLocal = localStorage.getItem("authToken");
      if (tokenLocal) {
        await fetch(`${API_BASE}/api/users/settings`, {
          method: "PATCH",
          headers: { "Content-Type": "application/json", "Authorization": `Bearer ${tokenLocal}` },
          body: JSON.stringify({
            settings: {
              webhookUrl,
              webhookSecret: s.webhookSecret,
              webhookEvents
            }
          } as any)
        });
      }
      setWebhookSecret(s.webhookSecret);
      setWebhookSaved(true);
      toast.success("Webhook configuration saved!");
      setTimeout(() => setWebhookSaved(false), 2500);
    } catch (err) {
      console.error(err);
      toast.error("Failed to save webhook settings.");
    }
  };

  const handleRotateWebhookSecret = async () => {
    const newSecret = generateWebhookSecret();
    setWebhookSecret(newSecret);
    
    const s = JSON.parse(localStorage.getItem("vxSettings") || "{}");
    s.webhookSecret = newSecret;
    localStorage.setItem("vxSettings", JSON.stringify(s));
    
    try {
      const tokenLocal = localStorage.getItem("authToken");
      if (tokenLocal) {
        await fetch(`${API_BASE}/api/users/settings`, {
          method: "PATCH",
          headers: { "Content-Type": "application/json", "Authorization": `Bearer ${tokenLocal}` },
          body: JSON.stringify({ settings: { webhookSecret: newSecret } })
        });
      }
      toast.success("Webhook signing secret rotated!");
    } catch (err) {
      console.error(err);
    }
  };

  const toggleKeyVisibility = (keyId: string) => {
    setVisibleKeys(prev => ({ ...prev, [keyId]: !prev[keyId] }));
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
                <div className="vxst-hero-title">
                  {activeTab === "notifications" ? "Notifications" :
                   activeTab === "workspace" ? "Workspace" :
                   activeTab === "subscription" ? "Subscription":
                   activeTab === "billing" ? "Billing" :
                   activeTab === "ai-profile" ? "AI Profile" :
                   activeTab === "brand-kit" ? "Brand Kit" :
                   activeTab === "brand-persona" ? "Brand Persona" :
                   activeTab === "danger" ? "Danger Zone" :
                   activeTab === "api" ? "API & Webhooks" : "Profile"}
                  {activeTab !== "subscription" && activeTab !== "billing" && activeTab !== "brand-kit" && activeTab !== "brand-persona" && activeTab !== "api" && <span> Settings</span>}
                </div>
                <div className="vxst-hero-sub">
                  {activeTab === "notifications" ? "Choose how and when you receive updates." :
                   activeTab === "workspace" ? "Manage your workspace identity and core settings." :
                   activeTab === "subscription" ? "Manage your pricing plans and billing cycle." :
                   activeTab === "billing" ? "Manage payment methods and download invoices." :
                   activeTab === "ai-profile" ? "Configure how the Vulpinix AI behaves and generates content." :
                   activeTab === "brand-kit" ? "Manage your visual brand assets, typography, and color palettes." :
                   activeTab === "brand-persona" ? "Define your brand's unique tone of voice and target audience." :
                   activeTab === "danger" ? "Irreversible actions. Proceed with caution." :
                   activeTab === "api" ? "Create API keys, configure webhooks, and integrate your developer apps." : "Manage your personal preferences and security."}
                </div>
              </div>
              <div style={{display:"flex",alignItems:"center",gap:10}}>
                <div className="vxst-plan-badge"><Zap size={11}/> Free Plan</div>
                <button className="vxst-btn-ghost" onClick={()=>navigate("/profile")}><User size={13}/> My Profile</button>
              </div>
            </motion.div>

            {/* Tabs removed in favor of sub-sidebar */}

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
                        {lbl:"Phone",k:"phone",ph:"+91 XXXXX XXXXX",val:phone,set:setPhone,type:"text",gridCol:"1/-1"},
                      ].map(f=>(
                        <div key={f.k} style={{gridColumn:f.gridCol}}>
                          <label className="vxst-lbl">{f.lbl}</label>
                          <input className="vxst-input" type={f.type} placeholder={f.ph} value={f.val} onChange={e=>f.set(e.target.value)}/>
                        </div>
                      ))}
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
                      {icon:<Mail size={15}/>,title:"Email Notifications",sub:"Receive updates via email",val:notifEmail,set:(v:boolean)=>handleSettingToggle(setNotifEmail,"notifEmail",v,"Email preferences")},
                      {icon:<Smartphone size={15}/>,title:"Push Notifications",sub:"Browser push alerts",val:notifPush,set:(v:boolean)=>handleSettingToggle(setNotifPush,"notifPush",v,"Push preferences")},
                      {icon:<Phone size={15}/>,title:"SMS Notifications",sub:"Text message alerts (charges may apply)",val:notifSMS,set:(v:boolean)=>handleSettingToggle(setNotifSMS,"notifSMS",v,"SMS preferences")},
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
                      {title:"Campaign Updates",sub:"When your campaign status changes",val:notifCampaign,set:(v:boolean)=>handleSettingToggle(setNotifCampaign,"notifCampaign",v,"Campaign alerts")},
                      {title:"Analytics Reports",sub:"Weekly performance summaries and milestones",val:notifAnalytics,set:(v:boolean)=>handleSettingToggle(setNotifAnalytics,"notifAnalytics",v,"Analytics reports")},
                      {title:"Billing & Payments",sub:"Invoices, payment confirmations and plan changes",val:notifBilling,set:(v:boolean)=>handleSettingToggle(setNotifBilling,"notifBilling",v,"Billing alerts")},
                      {title:"Product Updates",sub:"New features, improvements and announcements",val:notifUpdates,set:(v:boolean)=>handleSettingToggle(setNotifUpdates,"notifUpdates",v,"Product updates")},
                      {title:"Marketing & Promotions",sub:"Special offers and promotional campaigns",val:notifMarketing,set:(v:boolean)=>handleSettingToggle(setNotifMarketing,"notifMarketing",v,"Marketing emails")},
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
                        <CustomSelect style={{width:"100%"}} value={language} onChange={(v: string) => setLanguage(v)} options={[
                          {value:"en", label:"English"},
                          {value:"hi", label:"Hindi"},
                          {value:"es", label:"Spanish"},
                          {value:"fr", label:"French"},
                          {value:"de", label:"German"},
                          {value:"ja", label:"Japanese"},
                          {value:"zh", label:"Chinese"}
                        ]} />
                      </div>
                      <div>
                        <label className="vxst-lbl">Timezone</label>
                        <CustomSelect style={{width:"100%"}} value={timezone} onChange={(v: string) => setTimezone(v)} options={[
                          {value:"Asia/Kolkata", label:"India (IST)"},
                          {value:"America/New_York", label:"New York (EST)"},
                          {value:"America/Los_Angeles", label:"Los Angeles (PST)"},
                          {value:"Europe/London", label:"London (GMT)"},
                          {value:"Europe/Paris", label:"Paris (CET)"},
                          {value:"Asia/Tokyo", label:"Tokyo (JST)"},
                          {value:"Asia/Dubai", label:"Dubai (GST)"},
                          {value:"Australia/Sydney", label:"Sydney (AEST)"}
                        ]} />
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

              {/* ── WORKSPACE ── */}
              {activeTab === "workspace" && (
                <motion.div key="workspace" initial={{opacity:0,y:12}} animate={{opacity:1,y:0}} exit={{opacity:0,y:-8}} transition={{duration:0.25}}>
                  <div className="vxst-card">
                    <div className="vxst-card-hd">
                      <div className="vxst-card-hd-l">
                        <div className="vxst-card-ic" style={{background:"rgba(167,139,250,0.12)",color:"#a78bfa"}}><Building2 size={17}/></div>
                        <div><div className="vxst-card-title">Workspace Details</div><div className="vxst-card-sub">Manage your workspace identity and core settings</div></div>
                      </div>
                    </div>
                    
                    <div style={{display:"flex",gap:24,marginBottom:24,flexWrap:"wrap"}}>
                      <div style={{display:"flex",flexDirection:"column",gap:12,alignItems:"center"}}>
                        <div style={{width:80,height:80,borderRadius:18,background:"linear-gradient(135deg, rgba(167,139,250,0.15), rgba(56,189,248,0.1))",border:"1px dashed rgba(167,139,250,0.4)",display:"flex",alignItems:"center",justifyContent:"center",color:"#a78bfa",overflow:"hidden"}}>
                          {workspaceLogo ? <img src={workspaceLogo} alt="Workspace Logo" style={{width:"100%",height:"100%",objectFit:"cover"}}/> : <Building2 size={32}/>}
                        </div>
                        <label className="vxst-btn-ghost" style={{padding:"6px 12px",fontSize:12,cursor:"pointer"}}>
                          <input type="file" accept="image/*" style={{display:"none"}} onChange={(e) => { 
                            const file = e.target.files?.[0];
                            if (file) {
                              const reader = new FileReader();
                              reader.onload = (event) => {
                                if (event.target?.result) {
                                  setWorkspaceLogo(event.target.result as string);
                                  toast.success("Logo updated successfully!"); 
                                }
                              };
                              reader.readAsDataURL(file);
                            }
                          }} />
                          <Upload size={13}/> Upload Logo
                        </label>
                      </div>
                      <div style={{flex:1,minWidth:200,display:"flex",flexDirection:"column",gap:14}}>
                        <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:14}}>
                          <div>
                            <label className="vxst-lbl">Workspace Name</label>
                            <input className="vxst-input" value={workspaceName} onChange={e=>setWorkspaceName(e.target.value)} placeholder="e.g. Acme Corp"/>
                          </div>
                          <div>
                            <label className="vxst-lbl">Workspace Slug</label>
                            <div style={{display:"flex",alignItems:"center",background:"rgba(255,255,255,0.02)",border:"1px solid rgba(255,255,255,0.08)",borderRadius:13,overflow:"hidden"}}>
                              <div style={{padding:"0 12px",fontSize:13,color:"#64748b",background:"rgba(255,255,255,0.04)",borderRight:"1px solid rgba(255,255,255,0.05)",height:"100%",display:"flex",alignItems:"center"}}>vulpinix.com/</div>
                              <input className="vxst-input" style={{border:"none",borderRadius:0,background:"transparent"}} value={workspaceSlug} onChange={e=>setWorkspaceSlug(e.target.value)} placeholder="my-workspace"/>
                            </div>
                          </div>
                        </div>
                        <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:14}}>
                          <div>
                            <label className="vxst-lbl">Website URL</label>
                            <input className="vxst-input" value={workspaceWebsite} onChange={e=>setWorkspaceWebsite(e.target.value)} placeholder="https://yourwebsite.com"/>
                          </div>
                          <div>
                            <label className="vxst-lbl">Industry</label>
                        <CustomSelect style={{width:"100%"}} value={workspaceIndustry} onChange={(v: string) => setWorkspaceIndustry(v)} options={[
                          {value:"agency", label:"Marketing Agency"},
                          {value:"ecommerce", label:"E-Commerce"},
                          {value:"saas", label:"SaaS / Technology"},
                          {value:"creator", label:"Creator / Influencer"},
                          {value:"local", label:"Local Business"},
                          {value:"other", label:"Other"}
                        ]} />
                      </div>
                    </div>
                    <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:14}}>
                      <div>
                        <label className="vxst-lbl">Default Timezone</label>
                        <CustomSelect style={{width:"100%"}} value={workspaceTimezone} onChange={(v: string) => setWorkspaceTimezone(v)} options={[
                          {value:"America/New_York", label:"New York (EST)"},
                          {value:"America/Los_Angeles", label:"Los Angeles (PST)"},
                          {value:"Europe/London", label:"London (GMT)"},
                          {value:"Europe/Paris", label:"Paris (CET)"},
                          {value:"Asia/Kolkata", label:"India (IST)"},
                          {value:"Asia/Tokyo", label:"Tokyo (JST)"},
                          {value:"Australia/Sydney", label:"Sydney (AEST)"}
                        ]} />
                      </div>
                      <div>
                        <label className="vxst-lbl">Default Currency</label>
                        <CustomSelect style={{width:"100%"}} value={workspaceCurrency} onChange={(v: string) => setWorkspaceCurrency(v)} options={[
                          {value:"USD", label:"USD ($)"},
                          {value:"EUR", label:"EUR (€)"},
                          {value:"GBP", label:"GBP (£)"},
                          {value:"INR", label:"INR (₹)"},
                          {value:"AUD", label:"AUD (A$)"},
                          {value:"CAD", label:"CAD (C$)"}
                        ]} />
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="vxst-save-row">
                      <button className="vxst-btn-pri" onClick={handleSave}>{saved?<><Check size={14}/>Saved!</>:<><Save size={14}/>Save Changes</>}</button>
                    </div>
                  </div>

                  <div className="vxst-card">
                    <div className="vxst-card-hd">
                      <div className="vxst-card-hd-l">
                        <div className="vxst-card-ic" style={{background:"rgba(56,189,248,0.12)",color:"#38bdf8"}}><Users size={17}/></div>
                        <div><div className="vxst-card-title">Team Members</div><div className="vxst-card-sub">Manage who has access to this workspace</div></div>
                      </div>
                      <button className="vxst-btn-ghost" onClick={() => setShowInviteModal(true)}><User size={14}/> Invite Member</button>
                    </div>
                    
                    <div style={{display:"flex",flexDirection:"column",gap:12}}>
                      {[
                        {name:userName,email:email||"user@example.com",role:"Owner",initial:userInitial},
                        ...teamMembers
                      ].map((member, i) => (
                        <div key={i} className="vxst-row" style={{padding:"10px 0",borderBottom: i === teamMembers.length ? "none" : undefined}}>
                          <div style={{display:"flex",alignItems:"center",gap:12,flex:1}}>
                            <div style={{width:36,height:36,borderRadius:10,background:"rgba(167,139,250,0.15)",color:"#c4b5fd",display:"flex",alignItems:"center",justifyContent:"center",fontWeight:700}}>{member.initial}</div>
                            <div className="vxst-row-l">
                              <div className="vxst-row-title">{member.name} {i === 0 && <span style={{fontSize:10,background:"rgba(167,139,250,0.2)",color:"#d8b4fe",padding:"2px 6px",borderRadius:4,marginLeft:6}}>You</span>}</div>
                              <div className="vxst-row-sub">{member.email}</div>
                            </div>
                          </div>
                          <div style={{display:"flex", alignItems:"center", gap:8}}>
                            <div style={{fontSize:13,fontWeight:600,color:"#64748b",background:"rgba(255,255,255,0.04)",padding:"4px 10px",borderRadius:8}}>{member.role}</div>
                            {i > 0 && (
                              <button 
                                className="vxst-btn-ghost" 
                                style={{padding:"6px 8px", background:"rgba(239,68,68,0.05)", border:"1px solid rgba(239,68,68,0.1)", color:"#ef4444", borderRadius:8}}
                                onClick={() => handleRemoveMember(i - 1)}
                                title="Remove team member"
                              >
                                <Trash2 size={12}/>
                              </button>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="vxst-danger-card">
                    <div className="vxst-card-hd">
                      <div className="vxst-card-hd-l">
                        <div className="vxst-card-ic" style={{background:"rgba(239,68,68,0.12)",color:"#ef4444"}}><AlertTriangle size={17}/></div>
                        <div><div className="vxst-card-title" style={{color:"#ef4444"}}>Workspace Danger Zone</div><div className="vxst-card-sub">Irreversible actions for this workspace.</div></div>
                      </div>
                    </div>
                    
                    <div style={{padding:"20px",borderRadius:16,background:"rgba(239,68,68,0.06)",border:"1px solid rgba(239,68,68,0.18)"}}>
                      <div style={{display:"flex",alignItems:"flex-start",justifyContent:"space-between",gap:16,flexWrap:"wrap"}}>
                        <div>
                          <div style={{fontSize:15,fontWeight:800,color:"#ef4444",marginBottom:5}}>Delete Workspace</div>
                          <div style={{fontSize:13,color:"#64748b",lineHeight:1.6,maxWidth:380}}>Permanently delete this workspace, all its campaigns, analytics data, and connected accounts. <strong style={{color:"#94a3b8"}}>This cannot be undone.</strong></div>
                        </div>
                        <button className="vxst-btn-danger" onClick={()=>toast.info("Delete Workspace confirmation coming soon")}><Trash2 size={14}/> Delete Workspace</button>
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}

              {/* ── SUBSCRIPTION ── */}
              {activeTab === "subscription" && (
                <motion.div key="subscription" initial={{opacity:0,y:12}} animate={{opacity:1,y:0}} exit={{opacity:0,y:-8}} transition={{duration:0.25}}>
                  <div className="vxst-card" style={{border:"none",background:"transparent",padding:0,boxShadow:"none"}}>
                    <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit, minmax(280px, 1fr))",gap:24}}>
                      
                      {/* FREE PLAN */}
                      <div style={{background:"rgba(255,255,255,0.02)",border:"1px solid rgba(255,255,255,0.08)",borderRadius:24,padding:32,display:"flex",flexDirection:"column",position:"relative",overflow:"hidden"}}>
                        <div style={{fontSize:18,fontWeight:700,color:"#e2e8f0",marginBottom:12}}>Starter</div>
                        <div style={{display:"flex",alignItems:"baseline",gap:4,marginBottom:24}}>
                          <span style={{fontSize:42,fontWeight:800,color:"#fff"}}>$0</span>
                          <span style={{color:"#64748b",fontWeight:500}}>/ month</span>
                        </div>
                        <div style={{fontSize:14,color:"#94a3b8",marginBottom:32,lineHeight:1.5}}>Essential tools for individuals just getting started.</div>
                        <div style={{display:"flex",flexDirection:"column",gap:16,flex:1,marginBottom:32}}>
                          {["3 Active Campaigns","Basic Analytics","Community Support","1 Connected Account"].map((f,i)=>(
                            <div key={i} style={{display:"flex",alignItems:"center",gap:12,fontSize:14,color:"#cbd5e1"}}>
                              <CheckCircle2 size={16} color="#64748b"/> {f}
                            </div>
                          ))}
                        </div>
                        <button className="vxst-btn-ghost" style={{width:"100%",padding:14,justifyContent:"center",border:"1px solid rgba(255,255,255,0.1)"}} disabled>Current Plan</button>
                      </div>

                      {/* PRO PLAN */}
                      <div style={{background:"linear-gradient(180deg, rgba(167,139,250,0.1) 0%, rgba(167,139,250,0.02) 100%)",border:"1px solid rgba(167,139,250,0.3)",borderRadius:24,padding:32,display:"flex",flexDirection:"column",position:"relative",overflow:"hidden",boxShadow:"0 12px 32px rgba(167,139,250,0.08)"}}>
                        <div style={{position:"absolute",top:0,left:0,right:0,height:4,background:"linear-gradient(90deg, #a78bfa, #38bdf8)"}}/>
                        <div style={{position:"absolute",top:24,right:24,background:"rgba(167,139,250,0.2)",color:"#d8b4fe",fontSize:11,fontWeight:800,padding:"4px 10px",borderRadius:20,textTransform:"uppercase",letterSpacing:1}}>Most Popular</div>
                        
                        <div style={{fontSize:18,fontWeight:700,color:"#a78bfa",marginBottom:12}}>Professional</div>
                        <div style={{display:"flex",alignItems:"baseline",gap:4,marginBottom:24}}>
                          <span style={{fontSize:42,fontWeight:800,color:"#fff"}}>$29</span>
                          <span style={{color:"#64748b",fontWeight:500}}>/ month</span>
                        </div>
                        <div style={{fontSize:14,color:"#94a3b8",marginBottom:32,lineHeight:1.5}}>Advanced analytics & AI tools for growing brands.</div>
                        <div style={{display:"flex",flexDirection:"column",gap:16,flex:1,marginBottom:32}}>
                          {["Unlimited Campaigns","Advanced AI Generation","Premium Analytics","Priority 24/7 Support","Custom Branding"].map((f,i)=>(
                            <div key={i} style={{display:"flex",alignItems:"center",gap:12,fontSize:14,color:"#e2e8f0"}}>
                              <CheckCircle2 size={16} color="#a78bfa"/> {f}
                            </div>
                          ))}
                        </div>
                        <button className="vxst-btn-pri" style={{width:"100%",padding:14,justifyContent:"center"}} onClick={()=>toast.info("Upgrade flow coming soon")}><Zap size={15}/> Upgrade to Pro</button>
                      </div>

                      {/* AGENCY PLAN */}
                      <div style={{background:"rgba(255,255,255,0.02)",border:"1px solid rgba(255,255,255,0.08)",borderRadius:24,padding:32,display:"flex",flexDirection:"column",position:"relative",overflow:"hidden"}}>
                        <div style={{fontSize:18,fontWeight:700,color:"#e2e8f0",marginBottom:12}}>Agency</div>
                        <div style={{display:"flex",alignItems:"baseline",gap:4,marginBottom:24}}>
                          <span style={{fontSize:42,fontWeight:800,color:"#fff"}}>$99</span>
                          <span style={{color:"#64748b",fontWeight:500}}>/ month</span>
                        </div>
                        <div style={{fontSize:14,color:"#94a3b8",marginBottom:32,lineHeight:1.5}}>Maximum power and custom solutions for large teams.</div>
                        <div style={{display:"flex",flexDirection:"column",gap:16,flex:1,marginBottom:32}}>
                          {["Everything in Professional","Multiple Workspaces","White-label Reports","Dedicated Success Manager","Custom API Access"].map((f,i)=>(
                            <div key={i} style={{display:"flex",alignItems:"center",gap:12,fontSize:14,color:"#cbd5e1"}}>
                              <CheckCircle2 size={16} color="#38bdf8"/> {f}
                            </div>
                          ))}
                        </div>
                        <button className="vxst-btn-ghost" style={{width:"100%",padding:14,justifyContent:"center",border:"1px solid rgba(255,255,255,0.1)"}} onClick={()=>toast.info("Contact sales coming soon")}>Contact Sales</button>
                      </div>

                    </div>
                  </div>
                </motion.div>
              )}

              {/* ── BILLING ── */}
              {activeTab === "billing" && (
                <motion.div key="billing" initial={{opacity:0,y:12}} animate={{opacity:1,y:0}} exit={{opacity:0,y:-8}} transition={{duration:0.25}}>
                  <div className="vxst-card">
                    <div className="vxst-card-hd">
                      <div className="vxst-card-hd-l">
                        <div className="vxst-card-ic" style={{background:"rgba(167,139,250,0.12)",color:"#a78bfa"}}><CreditCard size={17}/></div>
                        <div><div className="vxst-card-title">Payment Methods</div><div className="vxst-card-sub">Securely manage your saved credit cards</div></div>
                      </div>
                      <button className="vxst-btn-pri" onClick={()=>toast.info("Add payment method coming soon!")}><CreditCard size={14}/> Add Method</button>
                    </div>
                    
                    <div style={{display:"flex",flexDirection:"column",gap:12}}>
                      <div className="vxst-row" style={{padding:"14px",border:"1px solid rgba(167,139,250,0.3)",background:"rgba(167,139,250,0.05)",borderRadius:12}}>
                        <div style={{display:"flex",alignItems:"center",gap:16,flex:1}}>
                          <div style={{width:48,height:32,borderRadius:6,background:"#fff",display:"flex",alignItems:"center",justifyContent:"center",color:"#1e293b",fontWeight:800,fontSize:14,boxShadow:"0 2px 5px rgba(0,0,0,0.1)"}}>VISA</div>
                          <div className="vxst-row-l">
                            <div className="vxst-row-title">Visa ending in 4242 <span style={{marginLeft:8,fontSize:10,background:"rgba(167,139,250,0.2)",color:"#d8b4fe",padding:"2px 8px",borderRadius:4,textTransform:"uppercase",fontWeight:800}}>Default</span></div>
                            <div className="vxst-row-sub">Expires 12/2028</div>
                          </div>
                        </div>
                        <button className="vxst-btn-ghost" style={{color:"#ef4444"}} onClick={()=>toast.error("Cannot remove default payment method.")}><Trash2 size={14}/> Remove</button>
                      </div>
                    </div>
                  </div>

                  <div className="vxst-card">
                    <div className="vxst-card-hd">
                      <div className="vxst-card-hd-l">
                        <div className="vxst-card-ic" style={{background:"rgba(56,189,248,0.12)",color:"#38bdf8"}}><CheckCircle2 size={17}/></div>
                        <div><div className="vxst-card-title">Billing History</div><div className="vxst-card-sub">Download past invoices and receipts</div></div>
                      </div>
                    </div>
                    
                    <div style={{display:"flex",flexDirection:"column"}}>
                      <div style={{display:"grid",gridTemplateColumns:"1fr 1fr 1fr auto",gap:16,padding:"0 16px 12px",fontSize:12,fontWeight:700,color:"#64748b",borderBottom:"1px solid rgba(255,255,255,0.05)",textTransform:"uppercase",letterSpacing:0.5}}>
                        <div>Date</div>
                        <div>Amount</div>
                        <div>Status</div>
                        <div>Invoice</div>
                      </div>
                      {[
                        {date:"Oct 01, 2026",amount:"$29.00",status:"Paid"},
                        {date:"Sep 01, 2026",amount:"$29.00",status:"Paid"},
                        {date:"Aug 01, 2026",amount:"$29.00",status:"Paid"}
                      ].map((inv, i) => (
                        <div key={i} style={{display:"grid",gridTemplateColumns:"1fr 1fr 1fr auto",gap:16,padding:"16px",alignItems:"center",borderBottom: i===2 ? "none" : "1px solid rgba(255,255,255,0.03)"}}>
                          <div style={{fontSize:14,color:"#e2e8f0",fontWeight:500}}>{inv.date}</div>
                          <div style={{fontSize:14,color:"#cbd5e1"}}>{inv.amount}</div>
                          <div><span style={{fontSize:12,background:"rgba(34,197,94,0.15)",color:"#4ade80",padding:"4px 10px",borderRadius:20,fontWeight:700}}>{inv.status}</span></div>
                          <button className="vxst-btn-ghost" style={{padding:"6px 12px",fontSize:12}} onClick={()=>toast.success("Downloading invoice...")}>Download</button>
                        </div>
                      ))}
                    </div>
                  </div>
                </motion.div>
              )}

              {/* ── AI PROFILE ── */}
              {activeTab === "ai-profile" && (
                <motion.div key="ai-profile" initial={{opacity:0,y:12}} animate={{opacity:1,y:0}} exit={{opacity:0,y:-8}} transition={{duration:0.25}}>
                  <div className="vxst-card">
                    <div className="vxst-card-hd">
                      <div className="vxst-card-hd-l">
                        <div className="vxst-card-ic" style={{background:"rgba(251,191,36,0.12)",color:"#fbbf24"}}><Bot size={17}/></div>
                        <div><div className="vxst-card-title">AI Engine Settings</div><div className="vxst-card-sub">Fine-tune the Vulpinix agent to match your brand's voice</div></div>
                      </div>
                    </div>
                    
                    <div style={{display:"flex",flexDirection:"column",gap:24}}>
                      <div className="vxst-row">
                        <div className="vxst-row-l">
                          <div className="vxst-row-title">Creativity Level</div>
                          <div className="vxst-row-sub">How wild and creative should the AI be when generating posts?</div>
                        </div>
                        <CustomSelect style={{width:200}} value={aiCreativity} onChange={setAiCreativity} options={[
                          {value:"strict", label:"Strict & Professional"},
                          {value:"balanced", label:"Balanced"},
                          {value:"creative", label:"Highly Creative"},
                          {value:"wild", label:"Wild & Out of the Box"}
                        ]} />
                      </div>

                      <div className="vxst-row">
                        <div className="vxst-row-l">
                          <div className="vxst-row-title">Default Generation Model</div>
                          <div className="vxst-row-sub">Select the core LLM used for text generation.</div>
                        </div>
                        <CustomSelect style={{width:200}} value={aiModel} onChange={setAiModel} options={[
                          {value:"gpt4o", label:"GPT-4o (Recommended)"},
                          {value:"claude", label:"Claude 3.5 Sonnet"},
                          {value:"gemini", label:"Gemini 1.5 Pro"}
                        ]} />
                      </div>

                      <div className="vxst-row">
                        <div className="vxst-row-l">
                          <div className="vxst-row-title">Image Generator</div>
                          <div className="vxst-row-sub">Select the model used for creating graphics.</div>
                        </div>
                        <CustomSelect style={{width:200}} value={aiImageGen} onChange={setAiImageGen} options={[
                          {value:"midjourney", label:"Midjourney v6 (High Quality)"},
                          {value:"dalle3", label:"DALL-E 3 (Fast)"}
                        ]} />
                      </div>
                      
                      <div className="vxst-row" style={{borderBottom:"none",paddingBottom:0}}>
                        <div style={{display:"flex",alignItems:"center",gap:12,flex:1}}>
                          <div style={{width:34,height:34,borderRadius:10,background:"rgba(251,191,36,0.08)",border:"1px solid rgba(251,191,36,0.15)",display:"flex",alignItems:"center",justifyContent:"center",color:"#fde68a",flexShrink:0}}><Sparkles size={15}/></div>
                          <div className="vxst-row-l"><div className="vxst-row-title">Auto-Generate Captions</div><div className="vxst-row-sub">Automatically write smart captions when you upload a raw image.</div></div>
                        </div>
                        <Toggle checked={aiAutoCaption} onChange={(v)=>handleSettingToggle(setAiAutoCaption, "aiAutoCaption", v, "Auto-caption")}/>
                      </div>
                      <div className="vxst-row" style={{borderBottom:"none",paddingBottom:0,paddingTop:0}}>
                        <div style={{display:"flex",alignItems:"center",gap:12,flex:1}}>
                          <div style={{width:34,height:34,borderRadius:10,background:"rgba(56,189,248,0.08)",border:"1px solid rgba(56,189,248,0.15)",display:"flex",alignItems:"center",justifyContent:"center",color:"#bae6fd",flexShrink:0}}><Globe size={15}/></div>
                          <div className="vxst-row-l"><div className="vxst-row-title">Multi-Language Support</div><div className="vxst-row-sub">Allow AI to output translated variants for international audiences.</div></div>
                        </div>
                        <Toggle checked={aiMultiLang} onChange={(v)=>handleSettingToggle(setAiMultiLang, "aiMultiLang", v, "Multi-language support")}/>
                      </div>
                      
                      <div className="vxst-row" style={{borderBottom:"none",paddingBottom:0,paddingTop:12,flexDirection:"column",alignItems:"stretch",gap:10}}>
                        <div style={{display:"flex",alignItems:"center",gap:12}}>
                          <div style={{width:34,height:34,borderRadius:10,background:"rgba(167,139,250,0.08)",border:"1px solid rgba(167,139,250,0.15)",display:"flex",alignItems:"center",justifyContent:"center",color:"#c4b5fd",flexShrink:0}}><Key size={15}/></div>
                          <div className="vxst-row-l">
                            <div className="vxst-row-title">Gemini 1.5 Flash API Key</div>
                            <div className="vxst-row-sub">Enter your Google AI Studio API key to enable autonomous AI agent campaign execution and report compiling.</div>
                          </div>
                        </div>
                        <div style={{position:"relative",marginTop:6}}>
                          <input 
                            className="vxst-input" 
                            type={showGeminiKey ? "text" : "password"} 
                            placeholder="AIzaSy..." 
                            value={geminiApiKey} 
                            onChange={e => setGeminiApiKey(e.target.value)}
                            style={{paddingRight:40}}
                          />
                          <button 
                            type="button"
                            className="vxst-pass-eye" 
                            onClick={() => setShowGeminiKey(p => !p)}
                            style={{background:"none",border:"none",position:"absolute",right:12,top:"50%",transform:"translateY(-50%)",cursor:"pointer",color:"#475569"}}
                          >
                            {showGeminiKey ? <EyeOff size={14}/> : <Eye size={14}/>}
                          </button>
                        </div>
                        <div style={{fontSize:11,color:"#64748b",lineHeight:1.5}}>
                          Don't have a key? Get one for free from <a href="https://makersuite.google.com/app/apikey" target="_blank" rel="noreferrer" style={{color:"#38bdf8",textDecoration:"underline"}}>Google AI Studio</a>.
                        </div>
                      </div>
                    </div>
                    
                    <div className="vxst-save-row" style={{marginTop:24}}><button className="vxst-btn-pri" onClick={handleSave}>{saved?<><Check size={14}/>Saved!</>:<><Save size={14}/>Save AI Preferences</>}</button></div>
                  </div>
                </motion.div>
              )}

              {/* ── BRAND KIT ── */}
              {activeTab === "brand-kit" && (
                <motion.div key="brand-kit" initial={{opacity:0,y:12}} animate={{opacity:1,y:0}} exit={{opacity:0,y:-8}} transition={{duration:0.25}}>
                  <div className="vxst-card">
                    <div className="vxst-card-hd">
                      <div className="vxst-card-hd-l">
                        <div className="vxst-card-ic" style={{background:"rgba(236,72,153,0.12)",color:"#ec4899"}}><Palette size={17}/></div>
                        <div><div className="vxst-card-title">Brand Colors</div><div className="vxst-card-sub">Define the primary and secondary colors for your campaigns</div></div>
                      </div>
                    </div>
                    
                    <div style={{display:"flex",flexDirection:"column",gap:20}}>
                      <div className="vxst-row" style={{borderBottom:"none",paddingBottom:0}}>
                        <div className="vxst-row-l">
                          <div className="vxst-row-title">Primary Brand Color</div>
                          <div className="vxst-row-sub">Used for main buttons, highlights, and primary actions.</div>
                        </div>
                        <div style={{display:"flex",alignItems:"center",gap:12}}>
                          <label style={{cursor:"pointer", display:"block", position:"relative"}}>
                            <div style={{width:32,height:32,borderRadius:8,background:brandPrimary,border:"1px solid rgba(255,255,255,0.1)",boxShadow:`0 2px 8px ${brandPrimary}4d`}}/>
                            <input type="color" value={brandPrimary} onChange={e=>setBrandPrimary(e.target.value)} style={{opacity:0,position:"absolute",inset:0,width:"100%",height:"100%",cursor:"pointer"}} />
                          </label>
                          <input className="vxst-input" style={{width:100,fontFamily:"monospace"}} value={brandPrimary} onChange={e=>setBrandPrimary(e.target.value)} />
                        </div>
                      </div>

                      <div className="vxst-row" style={{borderBottom:"none",paddingBottom:0,paddingTop:0}}>
                        <div className="vxst-row-l">
                          <div className="vxst-row-title">Secondary / Accent Color</div>
                          <div className="vxst-row-sub">Used for secondary elements and complementary backgrounds.</div>
                        </div>
                        <div style={{display:"flex",alignItems:"center",gap:12}}>
                          <label style={{cursor:"pointer", display:"block", position:"relative"}}>
                            <div style={{width:32,height:32,borderRadius:8,background:brandSecondary,border:"1px solid rgba(255,255,255,0.1)",boxShadow:`0 2px 8px ${brandSecondary}4d`}}/>
                            <input type="color" value={brandSecondary} onChange={e=>setBrandSecondary(e.target.value)} style={{opacity:0,position:"absolute",inset:0,width:"100%",height:"100%",cursor:"pointer"}} />
                          </label>
                          <input className="vxst-input" style={{width:100,fontFamily:"monospace"}} value={brandSecondary} onChange={e=>setBrandSecondary(e.target.value)} />
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="vxst-card">
                    <div className="vxst-card-hd">
                      <div className="vxst-card-hd-l">
                        <div className="vxst-card-ic" style={{background:"rgba(16,185,129,0.12)",color:"#10b981"}}><Type size={17}/></div>
                        <div><div className="vxst-card-title">Typography</div><div className="vxst-card-sub">Choose your brand's official font styles</div></div>
                      </div>
                    </div>
                    <div style={{display:"flex",flexDirection:"column",gap:20}}>
                      <div className="vxst-row" style={{borderBottom:"none",paddingBottom:0}}>
                        <div className="vxst-row-l"><div className="vxst-row-title">Primary Font Family</div></div>
                        <CustomSelect style={{width:200}} value={brandTypography} onChange={setBrandTypography} options={[
                          {value:"inter", label:"Inter (Default)"},
                          {value:"roboto", label:"Roboto"},
                          {value:"poppins", label:"Poppins"},
                          {value:"montserrat", label:"Montserrat"}
                        ]} />
                      </div>
                    </div>
                    <div className="vxst-save-row" style={{marginTop:24}}><button className="vxst-btn-pri" onClick={handleSave}>{saved?<><Check size={14}/>Saved!</>:<><Save size={14}/>Save Brand Kit</>}</button></div>
                  </div>
                </motion.div>
              )}

              {/* ── BRAND PERSONA ── */}
              {activeTab === "brand-persona" && (
                <motion.div key="brand-persona" initial={{opacity:0,y:12}} animate={{opacity:1,y:0}} exit={{opacity:0,y:-8}} transition={{duration:0.25}}>
                  <div className="vxst-card">
                    <div className="vxst-card-hd">
                      <div className="vxst-card-hd-l">
                        <div className="vxst-card-ic" style={{background:"rgba(249,115,22,0.12)",color:"#f97316"}}><MessageSquare size={17}/></div>
                        <div><div className="vxst-card-title">Brand Tone & Voice</div><div className="vxst-card-sub">How your brand sounds to your audience</div></div>
                      </div>
                    </div>
                    
                    <div style={{display:"flex",flexDirection:"column",gap:20}}>
                      <div>
                        <label className="vxst-lbl">Core Brand Tone</label>
                        <CustomSelect value={brandTone} onChange={setBrandTone} options={[
                          {value:"professional", label:"Professional & Corporate"},
                          {value:"friendly", label:"Friendly & Conversational"},
                          {value:"humorous", label:"Humorous & Witty"},
                          {value:"authoritative", label:"Authoritative & Educational"},
                          {value:"luxury", label:"Luxury & Exclusive"}
                        ]} />
                      </div>
                      <div>
                        <label className="vxst-lbl">Brand Mission / Elevator Pitch</label>
                        <textarea className="vxst-input" rows={4} placeholder="Describe what your brand does and its core values. The AI will use this to understand your positioning..." value={brandMission} onChange={e=>setBrandMission(e.target.value)} />
                      </div>
                    </div>
                  </div>

                  <div className="vxst-card">
                    <div className="vxst-card-hd">
                      <div className="vxst-card-hd-l">
                        <div className="vxst-card-ic" style={{background:"rgba(139,92,246,0.12)",color:"#8b5cf6"}}><Target size={17}/></div>
                        <div><div className="vxst-card-title">Target Audience</div><div className="vxst-card-sub">Who is your brand speaking to?</div></div>
                      </div>
                    </div>
                    <div style={{display:"flex",flexDirection:"column",gap:20}}>
                      <div>
                        <label className="vxst-lbl">Primary Audience Demographics</label>
                        <input className="vxst-input" placeholder="e.g., Millennials, Tech Entrepreneurs, Fitness Enthusiasts..." value={brandAudience} onChange={e=>setBrandAudience(e.target.value)} />
                      </div>
                      <div>
                        <label className="vxst-lbl">Audience Pain Points</label>
                        <textarea className="vxst-input" rows={3} placeholder="What problems are you solving for them?" value={brandPainPoints} onChange={e=>setBrandPainPoints(e.target.value)} />
                      </div>
                    </div>
                    <div className="vxst-save-row" style={{marginTop:24}}><button className="vxst-btn-pri" onClick={handleSave}>{saved?<><Check size={14}/>Saved!</>:<><Save size={14}/>Save Persona</>}</button></div>
                  </div>
                </motion.div>
              )}

              {/* ── OTHER SECTIONS (DANGER, API, ETC) ── */}
              {/* ── DANGER ZONE ── */}
              {activeTab === "danger" && (
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

              {/* ── API & WEBHOOKS ── */}
              {activeTab === "api" && (
                <motion.div key="api" initial={{opacity:0,y:12}} animate={{opacity:1,y:0}} exit={{opacity:0,y:-8}} transition={{duration:0.25}}>
                  {/* API Keys Card */}
                  <div className="vxst-card">
                    <div className="vxst-card-hd">
                      <div className="vxst-card-hd-l">
                        <div className="vxst-card-ic" style={{background:"rgba(167,139,250,0.12)",color:"#a78bfa"}}><Key size={17}/></div>
                        <div>
                          <div className="vxst-card-title">API Keys</div>
                          <div className="vxst-card-sub">Authenticate your custom apps and workflows with personal API tokens</div>
                        </div>
                      </div>
                    </div>
                    
                    {/* Inline Generate key form */}
                    <div style={{display:"flex", gap:10, marginBottom:20, flexWrap:"wrap"}}>
                      <input 
                        className="vxst-input" 
                        style={{flex:1, minWidth:200}} 
                        placeholder="e.g. Production Server Key" 
                        value={newKeyName} 
                        onChange={e => setNewKeyName(e.target.value)}
                      />
                      <button className="vxst-btn-pri" onClick={handleGenerateKey}>
                        <Plus size={14}/> Generate Key
                      </button>
                    </div>

                    {/* New Key Display card */}
                    {newlyCreatedKey && (
                      <div style={{
                        background: "rgba(167, 139, 250, 0.08)",
                        border: "1px solid rgba(167, 139, 250, 0.3)",
                        borderRadius: 16,
                        padding: 20,
                        marginBottom: 20,
                        position: "relative"
                      }}>
                        <button 
                          style={{position:"absolute", top:12, right:12, background:"none", border:"none", color:"#64748b", cursor:"pointer"}}
                          onClick={() => setNewlyCreatedKey(null)}
                        >
                          <X size={16}/>
                        </button>
                        <div style={{display:"flex", alignItems:"center", gap:8, color:"#c4b5fd", fontWeight:800, fontSize:14, marginBottom:6}}>
                          <CheckCircle2 size={16}/> Key Generated Successfully!
                        </div>
                        <div style={{fontSize:12, color:"#94a3b8", marginBottom:14, lineHeight:1.5}}>
                          Make sure to copy your personal access token now. You won't be able to see it again!
                        </div>
                        <div style={{display:"flex", alignItems:"center", gap:10, background:"rgba(0,0,0,0.2)", padding:12, borderRadius:10, border:"1px solid rgba(255,255,255,0.05)"}}>
                          <code style={{fontFamily:"monospace", fontSize:13, color:"#e2e8f0", wordBreak:"break-all", flex:1}}>{newlyCreatedKey}</code>
                          <button 
                            className="vxst-btn-ghost" 
                            style={{padding:8, borderRadius:8}}
                            onClick={() => {
                              navigator.clipboard.writeText(newlyCreatedKey);
                              toast.success("API Key copied to clipboard!");
                            }}
                          >
                            <Copy size={14}/>
                          </button>
                        </div>
                      </div>
                    )}

                    {/* Existing Keys List */}
                    <div style={{display:"flex", flexDirection:"column", gap:10}}>
                      {apiKeys.length === 0 ? (
                        <div style={{textAlign:"center", padding:"30px 10px", color:"#475569", fontSize:13}}>
                          No API keys generated yet. Enter a name above to create your first key.
                        </div>
                      ) : (
                        apiKeys.map(key => {
                          const isVisible = visibleKeys[key.id] || false;
                          const displayToken = isVisible ? key.key : `${key.key.substring(0, 12)}••••••••••••••••••••••••••••`;
                          return (
                            <div key={key.id} className="vxst-row" style={{padding:"14px", border:"1px solid rgba(255,255,255,0.04)", background:"rgba(255,255,255,0.01)", borderRadius:14}}>
                              <div style={{display:"flex", flexDirection:"column", gap:4, flex:1, minWidth:0}}>
                                <div style={{fontSize:14, fontWeight:700, color:"#e2e8f0"}}>{key.name}</div>
                                <div style={{display:"flex", alignItems:"center", gap:8, flexWrap:"wrap"}}>
                                  <code style={{fontFamily:"monospace", fontSize:12, color:"#64748b"}}>{displayToken}</code>
                                  <div style={{display:"flex", gap:4}}>
                                    <button 
                                      style={{background:"none", border:"none", color:"#475569", cursor:"pointer", padding:4}}
                                      onClick={() => toggleKeyVisibility(key.id)}
                                      title={isVisible ? "Hide Key" : "Show Key"}
                                    >
                                      {isVisible ? <EyeOff size={13}/> : <Eye size={13}/>}
                                    </button>
                                    <button 
                                      style={{background:"none", border:"none", color:"#475569", cursor:"pointer", padding:4}}
                                      onClick={() => {
                                        navigator.clipboard.writeText(key.key);
                                        toast.success("API Key copied to clipboard!");
                                      }}
                                      title="Copy Key"
                                    >
                                      <Copy size={13}/>
                                    </button>
                                  </div>
                                </div>
                                <div style={{display:"flex", gap:12, fontSize:11, color:"#475569", marginTop:2}}>
                                  <span>Created: {key.createdAt}</span>
                                  <span>Last used: {key.lastUsed}</span>
                                </div>
                              </div>
                              <button 
                                className="vxst-btn-ghost" 
                                style={{color:"#ef4444", padding:"8px 12px", border:"1px solid rgba(239,68,68,0.1)", background:"rgba(239,68,68,0.02)"}}
                                onClick={() => handleRevokeKey(key.id)}
                              >
                                <Trash2 size={13}/> Revoke
                              </button>
                            </div>
                          );
                        })
                      )}
                    </div>
                  </div>

                  {/* Webhooks Section */}
                  <div className="vxst-card">
                    <div className="vxst-card-hd">
                      <div className="vxst-card-hd-l">
                        <div className="vxst-card-ic" style={{background:"rgba(56,189,248,0.12)",color:"#38bdf8"}}><Globe size={17}/></div>
                        <div>
                          <div className="vxst-card-title">Webhook Settings</div>
                          <div className="vxst-card-sub">Receive real-time HTTP payloads whenever campaign actions trigger</div>
                        </div>
                      </div>
                    </div>
                    
                    <div style={{display:"flex", flexDirection:"column", gap:20}}>
                      <div>
                        <label className="vxst-lbl">Endpoint URL</label>
                        <input 
                          className="vxst-input" 
                          placeholder="https://api.yourdomain.com/webhooks" 
                          value={webhookUrl}
                          onChange={e => setWebhookUrl(e.target.value)}
                        />
                      </div>
                      
                      <div>
                        <label className="vxst-lbl">Signing Secret</label>
                        <div style={{display:"flex", gap:10}}>
                          <div style={{flex:1, display:"flex", alignItems:"center", background:"rgba(0,0,0,0.15)", border:"1px solid rgba(255,255,255,0.08)", borderRadius:13, padding:"0 14px", overflow:"hidden"}}>
                            <code style={{fontFamily:"monospace", fontSize:13, color:"#cbd5e1", flex:1, overflow:"hidden", textOverflow:"ellipsis", whiteSpace:"nowrap"}}>
                              {webhookSecret || "whsec_••••••••••••••••••••••••••••"}
                            </code>
                            {webhookSecret && (
                              <button 
                                style={{background:"none", border:"none", color:"#475569", cursor:"pointer", padding:4, marginLeft:8}}
                                onClick={() => {
                                  navigator.clipboard.writeText(webhookSecret);
                                  toast.success("Webhook secret copied!");
                                }}
                              >
                                <Copy size={13}/>
                              </button>
                            )}
                          </div>
                          <button className="vxst-btn-ghost" style={{flexShrink:0}} onClick={handleRotateWebhookSecret}>
                            <RefreshCw size={13}/> Rotate Secret
                          </button>
                        </div>
                        <div style={{fontSize:11, color:"#475569", marginTop:6}}>
                          Use this secret to sign payloads and verify they originate from Vulpinix.
                        </div>
                      </div>
                      
                      <div>
                        <label className="vxst-lbl">Webhook Events</label>
                        <div style={{display:"grid", gridTemplateColumns:"repeat(auto-fit, minmax(220px, 1fr))", gap:12, marginTop:8}}>
                          {[
                            { id: "campaign.created", title: "campaign.created", desc: "When a campaign is created" },
                            { id: "post.published", title: "post.published", desc: "When a post is successfully published" },
                            { id: "post.scheduled", title: "post.scheduled", desc: "When a post is scheduled in queue" },
                            { id: "analytics.sync", title: "analytics.sync", desc: "When campaign metrics are updated" }
                          ].map(ev => {
                            const isChecked = webhookEvents.includes(ev.id);
                            return (
                              <div 
                                key={ev.id} 
                                style={{
                                  display:"flex", 
                                  alignItems:"flex-start", 
                                  gap:10, 
                                  padding:"12px 14px", 
                                  borderRadius:12, 
                                  border:"1px solid rgba(255,255,255,0.05)",
                                  background: isChecked ? "rgba(56,189,248,0.03)" : "rgba(255,255,255,0.005)",
                                  cursor:"pointer",
                                  transition:"all 0.15s"
                                }}
                                onClick={() => {
                                  if (isChecked) {
                                    setWebhookEvents(webhookEvents.filter(id => id !== ev.id));
                                  } else {
                                    setWebhookEvents([...webhookEvents, ev.id]);
                                  }
                                }}
                              >
                                <input 
                                  type="checkbox" 
                                  checked={isChecked}
                                  onChange={() => {}}
                                  style={{ marginTop: 2, accentColor: "#38bdf8" }}
                                />
                                <div style={{display:"flex", flexDirection:"column", gap:2}}>
                                  <span style={{fontSize:13, fontWeight:700, color:"#e2e8f0"}}>{ev.title}</span>
                                  <span style={{fontSize:11, color:"#475569"}}>{ev.desc}</span>
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    </div>
                    
                    <div className="vxst-save-row" style={{marginTop:24}}>
                      <button className="vxst-btn-pri" onClick={handleSaveWebhook}>
                        {webhookSaved ? <><Check size={14}/>Saved!</> : <><Save size={14}/>Save Webhook Settings</>}
                      </button>
                    </div>
                  </div>

                  {/* REST API Documentation Quickstart */}
                  <div className="vxst-card">
                    <div className="vxst-card-hd">
                      <div className="vxst-card-hd-l">
                        <div className="vxst-card-ic" style={{background:"rgba(34,197,94,0.12)",color:"#22c55e"}}><Code2 size={17}/></div>
                        <div>
                          <div className="vxst-card-title">Developer Quickstart</div>
                          <div className="vxst-card-sub">Simple REST API guide to publish posts & query campaigns</div>
                        </div>
                      </div>
                      <a 
                        href="https://docs.vulpinix.com" 
                        target="_blank" 
                        rel="noreferrer" 
                        className="vxst-btn-ghost" 
                        style={{display:"inline-flex", alignItems:"center", gap:6, textDecoration:"none"}}
                      >
                        Docs <ExternalLink size={12}/>
                      </a>
                    </div>
                    
                    <div style={{display:"flex", flexDirection:"column", gap:14}}>
                      <div className="vxst-doc-tabs">
                        {[
                          { id: "curl", label: "cURL" },
                          { id: "js", label: "JavaScript" },
                          { id: "python", label: "Python" }
                        ].map(t => (
                          <div 
                            key={t.id} 
                            className={`vxst-doc-tab ${docLanguage === t.id ? "active" : ""}`}
                            onClick={() => setDocLanguage(t.id as any)}
                          >
                            {t.label}
                          </div>
                        ))}
                      </div>
                      
                      <div className="vxst-code-block" style={{position:"relative"}}>
                        <button 
                          style={{
                            position:"absolute", 
                            top:12, 
                            right:12, 
                            background:"rgba(255,255,255,0.04)", 
                            border:"1px solid rgba(255,255,255,0.06)", 
                            borderRadius:8, 
                            color:"#64748b", 
                            cursor:"pointer",
                            padding:6,
                            display:"flex",
                            alignItems:"center",
                            justifyContent:"center"
                          }}
                          onClick={() => {
                            const code = docLanguage === "curl" 
                              ? `curl -X POST https://api.vulpinix.com/v1/posts \\\n  -H "Authorization: Bearer vx_live_YOUR_API_KEY" \\\n  -H "Content-Type: application/json" \\\n  -d '{\n    "content": "Automating social media with Vulpinix Agent!",\n    "platforms": ["twitter", "linkedin"],\n    "scheduleTime": "2026-05-24T10:00:00Z"\n  }'`
                              : docLanguage === "js"
                              ? `fetch('https://api.vulpinix.com/v1/posts', {\n  method: 'POST',\n  headers: {\n    'Authorization': 'Bearer vx_live_YOUR_API_KEY',\n    'Content-Type': 'application/json'\n  },\n  body: JSON.stringify({\n    content: 'Automating social media with Vulpinix Agent!',\n    platforms: ['twitter', 'linkedin'],\n    scheduleTime: '2026-05-24T10:00:00Z'\n  })\n})\n.then(res => res.json())\n.then(data => console.log(data));`
                              : `import requests\n\nurl = "https://api.vulpinix.com/v1/posts"\nheaders = {\n    "Authorization": "Bearer vx_live_YOUR_API_KEY",\n    "Content-Type": "application/json"\n}\ndata = {\n    "content": "Automating social media with Vulpinix Agent!",\n    "platforms": ["twitter", "linkedin"],\n    "scheduleTime": "2026-05-24T10:00:00Z"\n}\n\nresponse = requests.post(url, headers=headers, json=data)\nprint(response.json())`;
                            navigator.clipboard.writeText(code);
                            toast.success("Code snippet copied!");
                          }}
                        >
                          <Copy size={12}/>
                        </button>
                        <pre style={{margin:0, whiteSpace:"pre-wrap", wordBreak:"break-all", color:"#a78bfa"}}>
                          {docLanguage === "curl" ? (
                            `curl -X POST https://api.vulpinix.com/v1/posts \\
  -H "Authorization: Bearer vx_live_YOUR_API_KEY" \\
  -H "Content-Type: application/json" \\
  -d '{
    "content": "Automating social media with Vulpinix Agent!",
    "platforms": ["twitter", "linkedin"],
    "scheduleTime": "2026-05-24T10:00:00Z"
  }'`
                          ) : docLanguage === "js" ? (
                            `fetch('https://api.vulpinix.com/v1/posts', {
  method: 'POST',
  headers: {
    'Authorization': 'Bearer vx_live_YOUR_API_KEY',
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({
    content: 'Automating social media with Vulpinix Agent!',
    platforms: ['twitter', 'linkedin'],
    scheduleTime: '2026-05-24T10:00:00Z'
  })
})
.then(res => res.json())
.then(data => console.log(data));`
                          ) : (
                            `import requests

url = "https://api.vulpinix.com/v1/posts"
headers = {
    "Authorization": "Bearer vx_live_YOUR_API_KEY",
    "Content-Type": "application/json"
}
data = {
    "content": "Automating social media with Vulpinix Agent!",
    "platforms": ["twitter", "linkedin"],
    "scheduleTime": "2026-05-24T10:00:00Z"
}

response = requests.post(url, headers=headers, json=data)
print(response.json())`
                          )}
                        </pre>
                      </div>
                      
                      <div style={{
                        display:"flex", 
                        alignItems:"center", 
                        justifyContent:"space-between", 
                        padding:"14px 18px", 
                        borderRadius:12, 
                        background:"rgba(255,255,255,0.015)", 
                        border:"1px solid rgba(255,255,255,0.04)"
                      }}>
                        <div style={{display:"flex", alignItems:"center", gap:10}}>
                          <div style={{width:8, height:8, borderRadius:"50%", background:"#22c55e"}}/>
                          <span style={{fontSize:13, fontWeight:600, color:"#cbd5e1"}}>API Rate Limits</span>
                        </div>
                        <span style={{fontSize:12, color:"#64748b"}}>1,000 requests / day (Free tier)</span>
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

      {/* Invite member modal */}
      <AnimatePresence>
        {showInviteModal && (
          <motion.div initial={{opacity:0}} animate={{opacity:1}} exit={{opacity:0}} className="vxst-overlay" onClick={()=>setShowInviteModal(false)}>
            <motion.div 
              initial={{scale:0.88,opacity:0}} 
              animate={{scale:1,opacity:1}} 
              exit={{scale:0.88,opacity:0}} 
              transition={{type:"spring",stiffness:280,damping:22}} 
              className="vxst-modal" 
              style={{border:"1px solid rgba(167, 139, 250, 0.3)", maxWidth: 460}}
              onClick={e=>e.stopPropagation()}
            >
              <div style={{display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:20, borderBottom:"1px solid rgba(255,255,255,0.06)", paddingBottom:12}}>
                <div style={{display:"flex", alignItems:"center", gap:8}}>
                  <div style={{width:32,height:32,borderRadius:10,background:"rgba(167,139,250,0.12)",color:"#a78bfa",display:"flex",alignItems:"center",justifyContent:"center"}}><Users size={16}/></div>
                  <div style={{fontSize:18,fontWeight:900,color:"#e2e8f0"}}>Invite Team Member</div>
                </div>
                <button style={{background:"none", border:"none", color:"#64748b", cursor:"pointer", display:"flex", alignItems:"center"}} onClick={()=>setShowInviteModal(false)}>
                  <X size={18}/>
                </button>
              </div>

              <div style={{display:"flex", flexDirection:"column", gap:16, marginBottom:24}}>
                <div>
                  <label className="vxst-lbl">Full Name</label>
                  <input 
                    className="vxst-input" 
                    placeholder="e.g. John Doe" 
                    value={inviteName} 
                    onChange={e => setInviteName(e.target.value)}
                  />
                </div>
                <div>
                  <label className="vxst-lbl">Email Address</label>
                  <input 
                    className="vxst-input" 
                    type="email"
                    placeholder="e.g. john@company.com" 
                    value={inviteEmail} 
                    onChange={e => setInviteEmail(e.target.value)}
                  />
                </div>
                <div>
                  <label className="vxst-lbl">Workspace Role</label>
                  <CustomSelect 
                    style={{width:"100%"}} 
                    value={inviteRole} 
                    onChange={(v: string) => setInviteRole(v)} 
                    options={[
                      { value: "Editor", label: "Editor (Can edit & publish)" },
                      { value: "Viewer", label: "Viewer (Can only view analytics)" },
                      { value: "Admin", label: "Admin (Full settings access)" }
                    ]} 
                  />
                </div>
              </div>

              <div style={{display:"flex",gap:12,borderTop:"1px solid rgba(255,255,255,0.06)",paddingTop:16}}>
                <button className="vxst-btn-ghost" style={{flex:1,justifyContent:"center"}} onClick={()=>setShowInviteModal(false)}>Cancel</button>
                <button className="vxst-btn-pri" style={{flex:1,justifyContent:"center"}} onClick={handleInviteMember}><Check size={14}/> Send Invitation</button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
