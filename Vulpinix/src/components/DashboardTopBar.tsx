import { useState, useRef, useEffect, useCallback } from "react";
import { useNavigate } from "react-router";
import { Bell, Settings, Search, X, LayoutDashboard, Upload, User, BarChart3, Share2, Zap, Target, ChevronRight } from "lucide-react";

const TB = `
  @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap');
  .vxtb-wrap{height:64px;display:flex;align-items:center;justify-content:space-between;padding:0 28px;border-bottom:1px solid rgba(255,255,255,0.06);background:rgba(7,11,18,0.85);backdrop-filter:blur(16px);flex-shrink:0;z-index:20;font-family:'Inter',sans-serif;position:relative;}

  /* Search */
  .vxtb-search-wrap{position:relative;width:300px;}
  .vxtb-search-box{display:flex;align-items:center;gap:9px;background:rgba(255,255,255,0.03);border:1px solid rgba(255,255,255,0.08);border-radius:13px;padding:8px 14px;transition:all 0.2s;cursor:text;}
  .vxtb-search-box.focused{border-color:rgba(167,139,250,0.4);background:rgba(167,139,250,0.04);box-shadow:0 0 0 3px rgba(167,139,250,0.08);}
  .vxtb-search-input{background:none;border:none;outline:none;color:#e2e8f0;font-size:13px;width:100%;font-family:'Inter',sans-serif;}
  .vxtb-search-input::placeholder{color:#334155;}
  .vxtb-search-kbd{padding:2px 7px;border-radius:6px;background:rgba(255,255,255,0.04);border:1px solid rgba(255,255,255,0.08);font-size:10px;font-weight:700;color:#334155;white-space:nowrap;flex-shrink:0;}
  .vxtb-clear{background:none;border:none;cursor:pointer;color:#334155;display:flex;align-items:center;padding:0;transition:color 0.2s;}
  .vxtb-clear:hover{color:#94a3b8;}

  /* Dropdown */
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

  /* Right icons */
  .vxtb-icon-btn{width:36px;height:36px;border-radius:11px;background:rgba(255,255,255,0.03);border:1px solid rgba(255,255,255,0.07);display:flex;align-items:center;justify-content:center;cursor:pointer;color:#475569;transition:all 0.2s;position:relative;}
  .vxtb-icon-btn:hover{background:rgba(255,255,255,0.07);color:#94a3b8;border-color:rgba(255,255,255,0.12);}
  .vxtb-notif-dot{position:absolute;top:7px;right:7px;width:6px;height:6px;border-radius:50%;background:#a78bfa;box-shadow:0 0 6px rgba(167,139,250,0.6);}
  .vxtb-avatar{width:36px;height:36px;border-radius:11px;background:linear-gradient(135deg,#a78bfa,#38bdf8);display:flex;align-items:center;justify-content:center;font-size:13px;font-weight:800;color:#fff;cursor:pointer;box-shadow:0 4px 12px rgba(167,139,250,0.25);transition:all 0.2s;border:2px solid transparent;}
  .vxtb-avatar:hover{transform:translateY(-1px);box-shadow:0 6px 18px rgba(167,139,250,0.38);border-color:rgba(167,139,250,0.4);}
`;

interface SearchResult {
  id: string;
  name: string;
  sub: string;
  icon: React.ReactNode;
  iconBg: string;
  iconColor: string;
  tag?: string;
  tagBg?: string;
  tagColor?: string;
  path: string;
  category: string;
}

const PAGES: SearchResult[] = [
  { id:"dashboard",  name:"Dashboard",          sub:"Overview & campaign stats",       icon:<LayoutDashboard size={15}/>, iconBg:"rgba(167,139,250,0.12)", iconColor:"#a78bfa", tag:"Page", tagBg:"rgba(167,139,250,0.1)", tagColor:"#a78bfa", path:"/dashboard",            category:"Pages" },
  { id:"upload",     name:"Upload Campaign",    sub:"Create a new ad campaign",        icon:<Upload size={15}/>,          iconBg:"rgba(56,189,248,0.12)",  iconColor:"#38bdf8", tag:"Page", tagBg:"rgba(56,189,248,0.1)",  tagColor:"#38bdf8", path:"/upload",               category:"Pages" },
  { id:"profile",    name:"My Profile",         sub:"View and edit your profile",      icon:<User size={15}/>,            iconBg:"rgba(34,197,94,0.12)",   iconColor:"#22c55e", tag:"Page", tagBg:"rgba(34,197,94,0.1)",   tagColor:"#22c55e", path:"/profile",              category:"Pages" },
  { id:"campaigns",  name:"My Campaigns",       sub:"Analytics and campaign history",  icon:<BarChart3 size={15}/>,       iconBg:"rgba(251,191,36,0.12)",  iconColor:"#fbbf24", tag:"Page", tagBg:"rgba(251,191,36,0.1)",  tagColor:"#fbbf24", path:"/dashboard/campaigns",  category:"Pages" },
  { id:"social",     name:"Social Accounts",    sub:"Connect & manage platforms",      icon:<Share2 size={15}/>,          iconBg:"rgba(244,114,182,0.12)", iconColor:"#f472b6", tag:"Page", tagBg:"rgba(244,114,182,0.1)", tagColor:"#f472b6", path:"/social",               category:"Pages" },
  { id:"createpost", name:"Create Post",        sub:"Publish content to platforms",    icon:<Zap size={15}/>,             iconBg:"rgba(167,139,250,0.12)", iconColor:"#a78bfa", tag:"Page", tagBg:"rgba(167,139,250,0.1)", tagColor:"#a78bfa", path:"/create-post",          category:"Pages" },
  { id:"settings",   name:"Settings",           sub:"Account, notifications & privacy",icon:<Settings size={15}/>,        iconBg:"rgba(148,163,184,0.12)", iconColor:"#94a3b8", tag:"Page", tagBg:"rgba(148,163,184,0.1)", tagColor:"#94a3b8", path:"/settings",             category:"Pages" },
];

interface Props { userName: string; userInitial: string; }

export function DashboardTopBar({ userName, userInitial }: Props) {
  const navigate = useNavigate();
  const [query, setQuery] = useState("");
  const [focused, setFocused] = useState(false);
  const [highlighted, setHighlighted] = useState(-1);
  const [campaigns, setCampaigns] = useState<SearchResult[]>([]);
  const inputRef = useRef<HTMLInputElement>(null);
  const wrapRef  = useRef<HTMLDivElement>(null);

  // Load campaigns from localStorage for search
  useEffect(() => {
    try {
      const raw = localStorage.getItem("userCampaigns");
      if (raw) {
        const list = JSON.parse(raw);
        const results: SearchResult[] = list.slice(0, 20).map((c: any) => ({
          id: c.id || c._id,
          name: c.name || "Untitled Campaign",
          sub: `${c.status || "draft"} · ${c.budget || ""}`,
          icon: <Target size={15} />,
          iconBg: "rgba(56,189,248,0.12)",
          iconColor: "#38bdf8",
          tag: c.status || "draft",
          tagBg: "rgba(56,189,248,0.08)",
          tagColor: "#38bdf8",
          path: "/dashboard/campaigns",
          category: "Campaigns",
        }));
        setCampaigns(results);
      }
    } catch {}
  }, []);

  // Keyboard shortcut: Cmd/Ctrl + K
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        inputRef.current?.focus();
        setFocused(true);
      }
      if (e.key === "Escape") {
        setQuery("");
        setFocused(false);
        inputRef.current?.blur();
      }
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, []);

  // Click outside to close
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (wrapRef.current && !wrapRef.current.contains(e.target as Node)) {
        setFocused(false);
        setHighlighted(-1);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const allResults = [...PAGES, ...campaigns];

  const filtered: SearchResult[] = query.trim().length === 0
    ? []
    : allResults.filter(r =>
        r.name.toLowerCase().includes(query.toLowerCase()) ||
        r.sub.toLowerCase().includes(query.toLowerCase()) ||
        r.category.toLowerCase().includes(query.toLowerCase())
      );

  const defaultResults = PAGES.slice(0, 5);
  const showResults = focused && query.trim().length > 0 ? filtered : focused ? defaultResults : [];
  const grouped = showResults.reduce<Record<string, SearchResult[]>>((acc, r) => {
    acc[r.category] = acc[r.category] || [];
    acc[r.category].push(r);
    return acc;
  }, {});

  const flatList = Object.values(grouped).flat();

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (!flatList.length) return;
    if (e.key === "ArrowDown") { e.preventDefault(); setHighlighted(h => Math.min(h + 1, flatList.length - 1)); }
    if (e.key === "ArrowUp")   { e.preventDefault(); setHighlighted(h => Math.max(h - 1, 0)); }
    if (e.key === "Enter" && highlighted >= 0) { navigate(flatList[highlighted].path); close(); }
  };

  const close = () => { setQuery(""); setFocused(false); setHighlighted(-1); };
  const go = (path: string) => { navigate(path); close(); };

  const showDropdown = focused && showResults.length > 0;

  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: TB }} />
      <div className="vxtb-wrap">

        {/* Search */}
        <div className="vxtb-search-wrap" ref={wrapRef}>
          <div className={`vxtb-search-box ${focused ? "focused" : ""}`} onClick={() => inputRef.current?.focus()}>
            <Search size={14} color={focused ? "#a78bfa" : "#334155"} style={{ flexShrink: 0 }} />
            <input
              ref={inputRef}
              className="vxtb-search-input"
              placeholder="Search pages, campaigns…"
              value={query}
              onChange={e => { setQuery(e.target.value); setHighlighted(-1); }}
              onFocus={() => setFocused(true)}
              onKeyDown={handleKeyDown}
            />
            {query ? (
              <button className="vxtb-clear" onClick={() => { setQuery(""); inputRef.current?.focus(); }}>
                <X size={13} />
              </button>
            ) : (
              <span className="vxtb-search-kbd">⌘K</span>
            )}
          </div>

          {/* Dropdown */}
          {showDropdown && (
            <div className="vxtb-dropdown">
              {query.trim().length > 0 && filtered.length === 0 ? (
                <div className="vxtb-dd-empty">
                  No results for <strong style={{ color: "#94a3b8" }}>"{query}"</strong>
                </div>
              ) : (
                Object.entries(grouped).map(([cat, items], gi) => {
                  let flatOffset = 0;
                  Object.entries(grouped).slice(0, gi).forEach(([, prev]) => { flatOffset += prev.length; });
                  return (
                    <div key={cat} className="vxtb-dd-section">
                      <div className="vxtb-dd-label">{cat}</div>
                      {items.map((item, ii) => {
                        const idx = flatOffset + ii;
                        return (
                          <div key={item.id} className={`vxtb-dd-item ${highlighted === idx ? "highlighted" : ""}`}
                            onMouseEnter={() => setHighlighted(idx)}
                            onClick={() => go(item.path)}
                          >
                            <div className="vxtb-dd-ic" style={{ background: item.iconBg, color: item.iconColor }}>
                              {item.icon}
                            </div>
                            <div style={{ flex: 1, minWidth: 0 }}>
                              <div className="vxtb-dd-name">{item.name}</div>
                              <div className="vxtb-dd-sub">{item.sub}</div>
                            </div>
                            {item.tag && (
                              <span className="vxtb-dd-tag" style={{ background: item.tagBg, color: item.tagColor }}>
                                {item.tag}
                              </span>
                            )}
                            <ChevronRight size={12} color="#334155" />
                          </div>
                        );
                      })}
                      {gi < Object.keys(grouped).length - 1 && <div className="vxtb-divider" />}
                    </div>
                  );
                })
              )}
              {!query.trim() && (
                <div style={{ padding: "8px 16px 12px", fontSize: 11, color: "#1e293b", display: "flex", gap: 12, justifyContent: "center" }}>
                  <span>↑↓ navigate</span><span>↵ open</span><span>Esc close</span>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Right icons */}
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <button className="vxtb-icon-btn" onClick={() => navigate("/settings")} title="Settings">
            <Settings size={15} />
          </button>
          <button className="vxtb-icon-btn" title="Notifications">
            <Bell size={15} />
            <span className="vxtb-notif-dot" />
          </button>
          <div className="vxtb-avatar" onClick={() => navigate("/profile")} title={userName}>
            {userInitial}
          </div>
        </div>
      </div>
    </>
  );
}
