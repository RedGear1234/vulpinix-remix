import { useState, useRef, useEffect } from "react";
import { useNavigate, useLocation } from "react-router";
import {
  Bell, Settings, Search, X, LayoutDashboard, Upload, User,
  BarChart3, Share2, Zap, Target, ChevronRight,
  CheckCircle2, AlertCircle, Info, Sparkles,
  Check, Trash2, BellOff, HelpCircle,
} from "lucide-react";

// ─── Styles ──────────────────────────────────────────────────────────────────
const TB = `
  @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap');
  .vxtb-wrap{height:64px;display:flex;align-items:center;justify-content:space-between;padding:0 28px;border-bottom:1px solid rgba(255,255,255,0.06);background:rgba(7,11,18,0.88);backdrop-filter:blur(16px);flex-shrink:0;z-index:50;font-family:'Inter',sans-serif;position:relative;}

  /* ── Search ── */
  .vxtb-search-wrap{position:relative;width:300px;}
  .vxtb-search-box{display:flex;align-items:center;gap:9px;background:rgba(255,255,255,0.03);border:1px solid rgba(255,255,255,0.08);border-radius:13px;padding:8px 14px;transition:all 0.2s;cursor:text;}
  .vxtb-search-box.focused{border-color:rgba(167,139,250,0.4);background:rgba(167,139,250,0.04);box-shadow:0 0 0 3px rgba(167,139,250,0.08);}
  .vxtb-search-input{background:none;border:none;outline:none;color:#e2e8f0;font-size:13px;width:100%;font-family:'Inter',sans-serif;}
  .vxtb-search-input::placeholder{color:#334155;}
  .vxtb-search-kbd{padding:2px 7px;border-radius:6px;background:rgba(255,255,255,0.04);border:1px solid rgba(255,255,255,0.08);font-size:10px;font-weight:700;color:#334155;white-space:nowrap;flex-shrink:0;}
  .vxtb-clear{background:none;border:none;cursor:pointer;color:#334155;display:flex;align-items:center;padding:0;transition:color 0.2s;}
  .vxtb-clear:hover{color:#94a3b8;}

  /* search dropdown */
  .vxtb-dropdown{position:absolute;top:calc(100% + 8px);left:0;right:0;background:rgba(13,17,28,0.98);border:1px solid rgba(255,255,255,0.10);border-radius:18px;overflow:hidden;box-shadow:0 24px 60px rgba(0,0,0,0.6),0 0 0 1px rgba(255,255,255,0.04);z-index:100;backdrop-filter:blur(20px);}
  .vxtb-dd-section{padding:10px 8px 4px;}
  .vxtb-dd-label{font-size:10px;font-weight:700;color:#334155;text-transform:uppercase;letter-spacing:0.08em;padding:0 8px;margin-bottom:4px;}
  .vxtb-dd-item{display:flex;align-items:center;gap:11px;padding:10px 10px;border-radius:12px;cursor:pointer;transition:all 0.15s;}
  .vxtb-dd-item:hover,.vxtb-dd-item.highlighted{background:rgba(255,255,255,0.05);}
  .vxtb-dd-item.highlighted{background:rgba(167,139,250,0.08);}
  .vxtb-dd-ic{width:32px;height:32px;border-radius:10px;display:flex;align-items:center;justify-content:center;flex-shrink:0;}
  .vxtb-dd-name{font-size:13px;font-weight:600;color:#e2e8f0;flex:1;}
  .vxtb-dd-sub{font-size:11px;color:#475569;margin-top:1px;}
  .vxtb-dd-tag{font-size:10px;font-weight:700;padding:2px 8px;border-radius:20px;flex-shrink:0;}
  .vxtb-divider{height:1px;background:rgba(255,255,255,0.05);margin:4px 8px;}
  .vxtb-dd-empty{padding:28px 16px;text-align:center;color:#334155;font-size:13px;}

  /* ── Right icon buttons ── */
  .vxtb-icon-btn{width:36px;height:36px;border-radius:11px;background:rgba(255,255,255,0.03);border:1px solid rgba(255,255,255,0.07);display:flex;align-items:center;justify-content:center;cursor:pointer;color:#475569;transition:all 0.2s;position:relative;}
  .vxtb-icon-btn:hover{background:rgba(255,255,255,0.07);color:#94a3b8;border-color:rgba(255,255,255,0.12);}
  .vxtb-icon-btn.active{background:rgba(167,139,250,0.10);border-color:rgba(167,139,250,0.3);color:#a78bfa;}
  .vxtb-badge{position:absolute;top:-4px;right:-4px;min-width:17px;height:17px;border-radius:9px;background:linear-gradient(135deg,#a78bfa,#38bdf8);font-size:9px;font-weight:800;color:#fff;display:flex;align-items:center;justify-content:center;padding:0 4px;border:2px solid #070b12;line-height:1;}
  .vxtb-avatar{width:36px;height:36px;border-radius:11px;background:linear-gradient(135deg,#a78bfa,#38bdf8);display:flex;align-items:center;justify-content:center;font-size:13px;font-weight:800;color:#fff;cursor:pointer;box-shadow:0 4px 12px rgba(167,139,250,0.25);transition:all 0.2s;border:2px solid transparent;}
  .vxtb-avatar:hover{transform:translateY(-1px);box-shadow:0 6px 18px rgba(167,139,250,0.38);border-color:rgba(167,139,250,0.4);}

  /* ── Notification panel ── */
  .vxtb-notif-panel{position:absolute;top:calc(100% + 8px);right:0;width:380px;background:rgba(11,15,25,0.98);border:1px solid rgba(255,255,255,0.10);border-radius:20px;overflow:hidden;box-shadow:0 24px 60px rgba(0,0,0,0.7),0 0 0 1px rgba(255,255,255,0.04);z-index:100;backdrop-filter:blur(24px);}
  .vxtb-notif-hd{display:flex;align-items:center;justify-content:space-between;padding:16px 18px 12px;border-bottom:1px solid rgba(255,255,255,0.06);}
  .vxtb-notif-hd-title{font-size:15px;font-weight:800;color:#e2e8f0;display:flex;align-items:center;gap:8px;}
  .vxtb-notif-hd-badge{padding:2px 9px;border-radius:20px;background:rgba(167,139,250,0.12);border:1px solid rgba(167,139,250,0.2);font-size:11px;font-weight:700;color:#a78bfa;}
  .vxtb-notif-actions{display:flex;gap:6px;}
  .vxtb-notif-action-btn{display:flex;align-items:center;gap:4px;padding:5px 10px;border-radius:9px;background:rgba(255,255,255,0.03);border:1px solid rgba(255,255,255,0.07);font-size:11px;font-weight:700;color:#475569;cursor:pointer;transition:all 0.18s;font-family:'Inter',sans-serif;}
  .vxtb-notif-action-btn:hover{background:rgba(255,255,255,0.07);color:#94a3b8;}
  .vxtb-notif-list{max-height:380px;overflow-y:auto;}
  .vxtb-notif-list::-webkit-scrollbar{width:4px;}
  .vxtb-notif-list::-webkit-scrollbar-thumb{background:rgba(255,255,255,0.07);border-radius:2px;}
  .vxtb-notif-item{display:flex;align-items:flex-start;gap:12px;padding:13px 16px;cursor:pointer;transition:all 0.15s;border-bottom:1px solid rgba(255,255,255,0.04);position:relative;}
  .vxtb-notif-item:last-child{border-bottom:none;}
  .vxtb-notif-item:hover{background:rgba(255,255,255,0.03);}
  .vxtb-notif-item.unread{background:rgba(167,139,250,0.04);}
  .vxtb-notif-item.unread:hover{background:rgba(167,139,250,0.07);}
  .vxtb-notif-unread-dot{position:absolute;top:16px;right:14px;width:6px;height:6px;border-radius:50%;background:linear-gradient(135deg,#a78bfa,#38bdf8);box-shadow:0 0 6px rgba(167,139,250,0.6);}
  .vxtb-notif-ic{width:36px;height:36px;border-radius:11px;display:flex;align-items:center;justify-content:center;flex-shrink:0;margin-top:1px;}
  .vxtb-notif-title{font-size:13px;font-weight:700;color:#e2e8f0;margin-bottom:3px;padding-right:16px;}
  .vxtb-notif-body{font-size:12px;color:#475569;line-height:1.5;margin-bottom:4px;}
  .vxtb-notif-time{font-size:11px;color:#1e293b;font-weight:600;}
  .vxtb-notif-footer{padding:10px 16px;border-top:1px solid rgba(255,255,255,0.06);text-align:center;}
  .vxtb-notif-empty{padding:44px 20px;text-align:center;}
`;

// ─── Search data ─────────────────────────────────────────────────────────────
interface SearchResult {
  id: string; name: string; sub: string; icon: React.ReactNode;
  iconBg: string; iconColor: string; tag?: string; tagBg?: string; tagColor?: string;
  path: string; category: string;
}

const PAGES: SearchResult[] = [
  { id:"dashboard",  name:"Dashboard",        sub:"Overview & campaign stats",        icon:<LayoutDashboard size={15}/>, iconBg:"rgba(167,139,250,0.12)", iconColor:"#a78bfa", tag:"Page", tagBg:"rgba(167,139,250,0.1)", tagColor:"#a78bfa", path:"/dashboard",           category:"Pages" },
  { id:"upload",     name:"Upload Campaign",  sub:"Create a new ad campaign",         icon:<Upload size={15}/>,          iconBg:"rgba(56,189,248,0.12)",  iconColor:"#38bdf8", tag:"Page", tagBg:"rgba(56,189,248,0.1)",  tagColor:"#38bdf8", path:"/upload",              category:"Pages" },
  { id:"profile",    name:"My Profile",       sub:"View and edit your profile",       icon:<User size={15}/>,            iconBg:"rgba(34,197,94,0.12)",   iconColor:"#22c55e", tag:"Page", tagBg:"rgba(34,197,94,0.1)",   tagColor:"#22c55e", path:"/profile",             category:"Pages" },
  { id:"campaigns",  name:"My Campaigns",     sub:"Analytics and campaign history",   icon:<BarChart3 size={15}/>,       iconBg:"rgba(251,191,36,0.12)",  iconColor:"#fbbf24", tag:"Page", tagBg:"rgba(251,191,36,0.1)",  tagColor:"#fbbf24", path:"/dashboard/campaigns", category:"Pages" },
  { id:"social",     name:"Social Accounts",  sub:"Connect & manage platforms",       icon:<Share2 size={15}/>,          iconBg:"rgba(244,114,182,0.12)", iconColor:"#f472b6", tag:"Page", tagBg:"rgba(244,114,182,0.1)", tagColor:"#f472b6", path:"/social",              category:"Pages" },
  { id:"createpost", name:"Create Post",      sub:"Publish content to platforms",     icon:<Zap size={15}/>,             iconBg:"rgba(167,139,250,0.12)", iconColor:"#a78bfa", tag:"Page", tagBg:"rgba(167,139,250,0.1)", tagColor:"#a78bfa", path:"/create-post",         category:"Pages" },
  { id:"settings",   name:"Settings",         sub:"Account, notifications & privacy", icon:<Settings size={15}/>,        iconBg:"rgba(148,163,184,0.12)", iconColor:"#94a3b8", tag:"Page", tagBg:"rgba(148,163,184,0.1)", tagColor:"#94a3b8", path:"/settings",            category:"Pages" },
];

// ─── Notification types ───────────────────────────────────────────────────────
type NotifType = "success" | "info" | "warning" | "ai";

interface Notification {
  id: string; type: NotifType; title: string; body: string;
  time: string; read: boolean; path?: string;
}

const ICON_MAP: Record<NotifType, { icon: React.ReactNode; bg: string; color: string }> = {
  success: { icon: <CheckCircle2 size={16}/>, bg: "rgba(34,197,94,0.12)",   color: "#22c55e" },
  info:    { icon: <Info size={16}/>,         bg: "rgba(56,189,248,0.12)",  color: "#38bdf8" },
  warning: { icon: <AlertCircle size={16}/>,  bg: "rgba(234,179,8,0.12)",   color: "#eab308" },
  ai:      { icon: <Sparkles size={16}/>,     bg: "rgba(167,139,250,0.12)", color: "#a78bfa" },
};

const SEED_NOTIFICATIONS: Notification[] = [
  { id:"n1", type:"ai",      title:"AI Engine Ready",              body:"Your media has been processed. Click to generate captions and launch a campaign.",           time:"Just now",    read:false, path:"/upload" },
  { id:"n2", type:"success", title:"Campaign Approved & Live",     body:"Your Instagram + Facebook campaign is now running. Check real-time analytics.",              time:"2 hrs ago",   read:false, path:"/dashboard/campaigns" },
  { id:"n3", type:"info",    title:"New Analytics Report",         body:"Your weekly performance report is ready. Impressions up 18% compared to last week.",         time:"Yesterday",   read:false, path:"/dashboard/campaigns" },
  { id:"n4", type:"warning", title:"Campaign Review Pending",      body:"Your YouTube campaign has been in review for 48 hours. Our team will respond shortly.",      time:"2 days ago",  read:true,  path:"/dashboard/campaigns" },
  { id:"n5", type:"success", title:"LinkedIn Connected",           body:"Your LinkedIn account was successfully linked. You can now publish posts directly.",          time:"3 days ago",  read:true,  path:"/social" },
  { id:"n6", type:"ai",      title:"AI Caption Generated",         body:"5 caption variants are ready for your latest upload. Pick the best performing one.",          time:"4 days ago",  read:true,  path:"/upload" },
  { id:"n7", type:"info",    title:"Budget 80% Spent",             body:"Your Summer Sale campaign has used 80% of its ₹5,000 budget. Consider increasing it.",       time:"5 days ago",  read:true,  path:"/dashboard/campaigns" },
];

function loadNotifications(): Notification[] {
  try {
    const raw = localStorage.getItem("vxNotifications");
    return raw ? JSON.parse(raw) : SEED_NOTIFICATIONS;
  } catch { return SEED_NOTIFICATIONS; }
}

function saveNotifications(n: Notification[]) {
  localStorage.setItem("vxNotifications", JSON.stringify(n));
}

// ─── Component ────────────────────────────────────────────────────────────────
interface Props { userName: string; userInitial: string; }

export function DashboardTopBar({ userName, userInitial }: Props) {
  const navigate = useNavigate();
  const location = useLocation();

  // Search state
  const [query, setQuery]           = useState("");
  const [focused, setFocused]       = useState(false);
  const [highlighted, setHighlighted] = useState(-1);
  const [campaigns, setCampaigns]   = useState<SearchResult[]>([]);
  const inputRef  = useRef<HTMLInputElement>(null);
  const searchRef = useRef<HTMLDivElement>(null);

  // Notification state
  const [notifs, setNotifs]           = useState<Notification[]>([]);
  const [notifOpen, setNotifOpen]     = useState(false);
  const notifRef = useRef<HTMLDivElement>(null);

  const unread = notifs.filter(n => !n.read).length;

  // ── Init ──────────────────────────────────────────────────────────────────
  useEffect(() => {
    setNotifs(loadNotifications());

    // Load campaigns for search
    try {
      const raw = localStorage.getItem("userCampaigns");
      if (raw) {
        const list = JSON.parse(raw);
        setCampaigns(list.slice(0, 20).map((c: any) => ({
          id: c.id || c._id, name: c.name || "Untitled Campaign",
          sub: `${c.status || "draft"} · ${c.budget || ""}`,
          icon: <Target size={15}/>, iconBg:"rgba(56,189,248,0.12)", iconColor:"#38bdf8",
          tag: c.status || "draft", tagBg:"rgba(56,189,248,0.08)", tagColor:"#38bdf8",
          path:"/dashboard/campaigns", category:"Campaigns",
        })));
      }
    } catch {}
  }, []);

  // ── Keyboard shortcuts ────────────────────────────────────────────────────
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") { e.preventDefault(); inputRef.current?.focus(); setFocused(true); }
      if (e.key === "Escape") { setQuery(""); setFocused(false); inputRef.current?.blur(); setNotifOpen(false); }
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, []);

  // ── Click outside ─────────────────────────────────────────────────────────
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(e.target as Node)) { setFocused(false); setHighlighted(-1); }
      if (notifRef.current  && !notifRef.current.contains(e.target as Node))  { setNotifOpen(false); }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  // ── Search logic ──────────────────────────────────────────────────────────
  const allResults = [...PAGES, ...campaigns];
  const filtered = query.trim()
    ? allResults.filter(r => r.name.toLowerCase().includes(query.toLowerCase()) || r.sub.toLowerCase().includes(query.toLowerCase()) || r.category.toLowerCase().includes(query.toLowerCase()))
    : [];
  const showResults = focused && query.trim() ? filtered : focused ? PAGES.slice(0, 5) : [];
  const grouped = showResults.reduce<Record<string, SearchResult[]>>((acc, r) => { acc[r.category] = acc[r.category] || []; acc[r.category].push(r); return acc; }, {});
  const flatList = Object.values(grouped).flat();

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (!flatList.length) return;
    if (e.key === "ArrowDown") { e.preventDefault(); setHighlighted(h => Math.min(h + 1, flatList.length - 1)); }
    if (e.key === "ArrowUp")   { e.preventDefault(); setHighlighted(h => Math.max(h - 1, 0)); }
    if (e.key === "Enter" && highlighted >= 0) { navigate(flatList[highlighted].path); closeSearch(); }
  };
  const closeSearch = () => { setQuery(""); setFocused(false); setHighlighted(-1); };
  const goSearch = (path: string) => { navigate(path); closeSearch(); };

  // ── Notification actions ──────────────────────────────────────────────────
  const markRead = (id: string) => {
    const next = notifs.map(n => n.id === id ? { ...n, read: true } : n);
    setNotifs(next); saveNotifications(next);
  };
  const markAllRead = () => {
    const next = notifs.map(n => ({ ...n, read: true }));
    setNotifs(next); saveNotifications(next);
  };
  const clearAll = () => { setNotifs([]); saveNotifications([]); };
  const handleNotifClick = (n: Notification) => {
    markRead(n.id);
    if (n.path) navigate(n.path);
    setNotifOpen(false);
  };

  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: TB }} />
      <div className="vxtb-wrap">

        {/* ── Search ── */}
        <div className="vxtb-search-wrap" ref={searchRef}>
          <div className={`vxtb-search-box ${focused ? "focused" : ""}`} onClick={() => inputRef.current?.focus()}>
            <Search size={14} color={focused ? "#a78bfa" : "#334155"} style={{ flexShrink: 0 }} />
            <input ref={inputRef} className="vxtb-search-input" placeholder="Search pages, campaigns…"
              value={query} onChange={e => { setQuery(e.target.value); setHighlighted(-1); }}
              onFocus={() => setFocused(true)} onKeyDown={handleKeyDown}
            />
            {query
              ? <button className="vxtb-clear" onClick={() => { setQuery(""); inputRef.current?.focus(); }}><X size={13}/></button>
              : <span className="vxtb-search-kbd">⌘K</span>
            }
          </div>

          {/* Search dropdown */}
          {focused && showResults.length > 0 && (
            <div className="vxtb-dropdown">
              {query.trim() && filtered.length === 0 ? (
                <div className="vxtb-dd-empty">No results for <strong style={{ color:"#94a3b8" }}>"{query}"</strong></div>
              ) : (
                Object.entries(grouped).map(([cat, items], gi) => {
                  let offset = 0;
                  Object.entries(grouped).slice(0, gi).forEach(([, p]) => { offset += p.length; });
                  return (
                    <div key={cat} className="vxtb-dd-section">
                      <div className="vxtb-dd-label">{cat}</div>
                      {items.map((item, ii) => {
                        const idx = offset + ii;
                        return (
                          <div key={item.id} className={`vxtb-dd-item ${highlighted === idx ? "highlighted" : ""}`}
                            onMouseEnter={() => setHighlighted(idx)} onClick={() => goSearch(item.path)}>
                            <div className="vxtb-dd-ic" style={{ background: item.iconBg, color: item.iconColor }}>{item.icon}</div>
                            <div style={{ flex: 1, minWidth: 0 }}>
                              <div className="vxtb-dd-name">{item.name}</div>
                              <div className="vxtb-dd-sub">{item.sub}</div>
                            </div>
                            {item.tag && <span className="vxtb-dd-tag" style={{ background: item.tagBg, color: item.tagColor }}>{item.tag}</span>}
                            <ChevronRight size={12} color="#334155"/>
                          </div>
                        );
                      })}
                      {gi < Object.keys(grouped).length - 1 && <div className="vxtb-divider"/>}
                    </div>
                  );
                })
              )}
              {!query.trim() && (
                <div style={{ padding:"8px 16px 12px", fontSize:11, color:"#1e293b", display:"flex", gap:14, justifyContent:"center" }}>
                  <span>↑↓ navigate</span><span>↵ open</span><span>Esc close</span>
                </div>
              )}
            </div>
          )}
        </div>

        {/* ── Right icons ── */}
        <div style={{ display:"flex", alignItems:"center", gap:8 }}>

          {/* Support (Dashboard Only) */}
          {location.pathname === "/dashboard" && (
            <button 
              onClick={() => navigate("/contact")} 
              style={{
                display: "flex",
                alignItems: "center",
                gap: "6px",
                padding: "6px 12px",
                background: "rgba(255, 255, 255, 0.05)",
                border: "1px solid rgba(255, 255, 255, 0.1)",
                borderRadius: "8px",
                color: "#e2e8f0",
                fontSize: "13px",
                fontWeight: 600,
                cursor: "pointer",
                transition: "all 0.2s"
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = "rgba(255, 255, 255, 0.1)";
                e.currentTarget.style.borderColor = "rgba(255, 255, 255, 0.2)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = "rgba(255, 255, 255, 0.05)";
                e.currentTarget.style.borderColor = "rgba(255, 255, 255, 0.1)";
              }}
            >
              <HelpCircle size={14}/>
              Support
            </button>
          )}

          {/* Settings */}
          <button className="vxtb-icon-btn" onClick={() => navigate("/settings")} title="Settings">
            <Settings size={15}/>
          </button>

          {/* Notifications */}
          <div style={{ position:"relative" }} ref={notifRef}>
            <button
              className={`vxtb-icon-btn ${notifOpen ? "active" : ""}`}
              onClick={() => setNotifOpen(o => !o)}
              title="Notifications"
            >
              <Bell size={15}/>
              {unread > 0 && <span className="vxtb-badge">{unread > 9 ? "9+" : unread}</span>}
            </button>

            {/* Notification panel */}
            {notifOpen && (
              <div className="vxtb-notif-panel">
                {/* Header */}
                <div className="vxtb-notif-hd">
                  <div className="vxtb-notif-hd-title">
                    <Bell size={15}/>
                    Notifications
                    {unread > 0 && <span className="vxtb-notif-hd-badge">{unread} new</span>}
                  </div>
                  <div className="vxtb-notif-actions">
                    {unread > 0 && (
                      <button className="vxtb-notif-action-btn" onClick={markAllRead}>
                        <Check size={11}/> Mark all read
                      </button>
                    )}
                    {notifs.length > 0 && (
                      <button className="vxtb-notif-action-btn" onClick={clearAll}>
                        <Trash2 size={11}/> Clear all
                      </button>
                    )}
                  </div>
                </div>

                {/* List */}
                <div className="vxtb-notif-list">
                  {notifs.length === 0 ? (
                    <div className="vxtb-notif-empty">
                      <BellOff size={32} style={{ color:"#1e293b", margin:"0 auto 12px", display:"block" }}/>
                      <div style={{ fontSize:14, fontWeight:700, color:"#334155", marginBottom:4 }}>All caught up!</div>
                      <div style={{ fontSize:12, color:"#1e293b" }}>No notifications right now.</div>
                    </div>
                  ) : (
                    notifs.map(n => {
                      const meta = ICON_MAP[n.type];
                      return (
                        <div key={n.id} className={`vxtb-notif-item ${!n.read ? "unread" : ""}`} onClick={() => handleNotifClick(n)}>
                          <div className="vxtb-notif-ic" style={{ background: meta.bg, color: meta.color }}>{meta.icon}</div>
                          <div style={{ flex: 1, minWidth: 0 }}>
                            <div className="vxtb-notif-title">{n.title}</div>
                            <div className="vxtb-notif-body">{n.body}</div>
                            <div className="vxtb-notif-time">{n.time}</div>
                          </div>
                          {!n.read && <span className="vxtb-notif-unread-dot"/>}
                        </div>
                      );
                    })
                  )}
                </div>

                {/* Footer */}
                {notifs.length > 0 && (
                  <div className="vxtb-notif-footer">
                    <button
                      onClick={() => { navigate("/settings"); setNotifOpen(false); }}
                      style={{ fontSize:12, fontWeight:700, color:"#475569", background:"none", border:"none", cursor:"pointer", fontFamily:"'Inter',sans-serif", display:"inline-flex", alignItems:"center", gap:5, transition:"color 0.2s" }}
                      onMouseEnter={e => e.currentTarget.style.color="#a78bfa"}
                      onMouseLeave={e => e.currentTarget.style.color="#475569"}
                    >
                      <Settings size={11}/> Manage notification settings
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Avatar */}
          <div className="vxtb-avatar" onClick={() => navigate("/profile")} title={userName}>
            {userInitial}
          </div>
        </div>
      </div>
    </>
  );
}
