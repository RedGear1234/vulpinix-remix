import { useState } from "react";
import { useNavigate, useLocation } from "react-router";
import {
  LayoutDashboard, BarChart3, Upload, User,
  LogOut, Share2, Settings, Calendar,
  MessageSquare, Sparkles, PenSquare, ChevronRight,
  Building2, Briefcase, Mic2, Bot, Crown, CreditCard, Code2, Bell, Instagram, Hash, Inbox
} from "lucide-react";
import { VulpinixLogo } from "./VulpinixLogo";

const SB = `
  @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap');

  .vxsb-root {
    display: flex;
    flex-direction: column;
    width: 270px;
    height: 100vh;
    flex-shrink: 0;
    background: #0a0f1e;
    border-right: 1px solid rgba(255,255,255,0.06);
    font-family: 'Inter', sans-serif;
    position: relative;
    z-index: 50;
    overflow: hidden;
  }

  /* Subtle top accent */
  .vxsb-root::after {
    content: '';
    position: absolute;
    top: 0; left: 0; right: 0; height: 1px;
    background: linear-gradient(90deg, transparent 0%, rgba(167,139,250,0.5) 50%, transparent 100%);
  }

  /* ── Logo area ───────────────────────────────────────── */
  .vxsb-header {
    padding: 24px 20px 20px;
    border-bottom: 1px solid rgba(255,255,255,0.05);
    flex-shrink: 0;
  }

  /* ── Scrollable nav ──────────────────────────────────── */
  .vxsb-body {
    flex: 1;
    overflow-y: auto;
    overflow-x: hidden;
    padding: 16px 14px;
    display: flex;
    flex-direction: column;
    gap: 0;
  }
  .vxsb-body::-webkit-scrollbar { width: 0px; }

  /* ── Section group ───────────────────────────────────── */
  .vxsb-group {
    margin-bottom: 24px;
  }
  .vxsb-group-label {
    font-size: 10px;
    font-weight: 700;
    letter-spacing: 0.12em;
    text-transform: uppercase;
    color: #2d3748;
    padding: 0 12px;
    margin-bottom: 6px;
    line-height: 2;
  }

  /* ── Nav item ────────────────────────────────────────── */
  .vxsb-link {
    display: flex;
    align-items: center;
    gap: 13px;
    padding: 11px 13px;
    border-radius: 13px;
    cursor: pointer;
    transition: all 0.18s ease;
    border: 1px solid transparent;
    margin-bottom: 2px;
    position: relative;
    color: #4a5568;
    text-decoration: none;
  }
  .vxsb-link:last-child { margin-bottom: 0; }

  .vxsb-link:hover {
    color: #a0aec0;
    background: rgba(255,255,255,0.04);
  }

  .vxsb-link.is-active {
    color: #e9d5ff;
    background: rgba(139,92,246,0.14);
    border-color: rgba(139,92,246,0.2);
  }

  /* Active left stripe */
  .vxsb-link.is-active::before {
    content: '';
    position: absolute;
    left: -1px;
    top: 22%;
    bottom: 22%;
    width: 3px;
    border-radius: 0 3px 3px 0;
    background: linear-gradient(180deg, #a78bfa, #60a5fa);
  }

  .vxsb-link-icon {
    width: 36px;
    height: 36px;
    border-radius: 10px;
    display: flex;
    align-items: center;
    justify-content: center;
    flex-shrink: 0;
    background: rgba(255,255,255,0.04);
    color: #475569;
    transition: all 0.18s;
  }
  .vxsb-link:hover .vxsb-link-icon {
    background: rgba(255,255,255,0.07);
    color: #94a3b8;
  }
  .vxsb-link.is-active .vxsb-link-icon {
    background: rgba(139,92,246,0.2);
    color: #c4b5fd;
  }

  .vxsb-link-text {
    font-size: 14px;
    font-weight: 500;
    line-height: 1;
    flex: 1;
  }

  .vxsb-link-arrow {
    opacity: 0;
    transition: opacity 0.15s, transform 0.15s;
    color: #4a5568;
  }
  .vxsb-link:hover .vxsb-link-arrow {
    opacity: 1;
    transform: translateX(2px);
  }
  .vxsb-link.is-active .vxsb-link-arrow {
    opacity: 0;
  }

  /* ── AI special item ─────────────────────────────────── */
  .vxsb-link-ai {
    color: #92400e;
    background: rgba(251,191,36,0.05);
    border-color: rgba(251,191,36,0.1);
  }
  .vxsb-link-ai:hover {
    color: #fde68a;
    background: rgba(251,191,36,0.1);
    border-color: rgba(251,191,36,0.2);
  }
  .vxsb-link-ai .vxsb-link-icon {
    background: rgba(251,191,36,0.1);
    color: #fbbf24;
  }
  .vxsb-link-ai:hover .vxsb-link-icon {
    background: rgba(251,191,36,0.18);
    color: #fde68a;
  }
  .vxsb-link-ai.is-active {
    color: #fde68a;
    background: rgba(251,191,36,0.14);
    border-color: rgba(251,191,36,0.3);
  }
  .vxsb-link-ai.is-active .vxsb-link-icon {
    background: rgba(251,191,36,0.22);
    color: #fde68a;
  }
  .vxsb-link-ai.is-active::before {
    background: linear-gradient(180deg, #fbbf24, #f97316);
  }

  /* ── Analytics sub-items ─────────────────────────────── */
  .vxsb-sub-nav {
    margin: 2px 0 4px 14px;
    border-left: 1px solid rgba(167,139,250,0.15);
    padding-left: 10px;
    overflow: hidden;
    transition: max-height 0.25s ease, opacity 0.2s ease;
  }
  .vxsb-sub-nav.collapsed { max-height: 0; opacity: 0; pointer-events: none; }
  .vxsb-sub-nav.expanded  { max-height: 200px; opacity: 1; }
  .vxsb-sub-link {
    display: flex;
    align-items: center;
    gap: 9px;
    padding: 7px 10px;
    border-radius: 10px;
    cursor: pointer;
    transition: all 0.18s;
    border: 1px solid transparent;
    margin-bottom: 2px;
    color: #4a5568;
    font-size: 13px;
    font-weight: 500;
  }
  .vxsb-sub-link:hover { color: #a0aec0; background: rgba(255,255,255,0.04); }
  .vxsb-sub-link.is-active {
    color: #e1a0c4;
    background: rgba(225,48,108,0.10);
    border-color: rgba(225,48,108,0.2);
  }
  .vxsb-sub-link-ic {
    width: 26px; height: 26px;
    border-radius: 8px;
    display: flex; align-items: center; justify-content: center;
    flex-shrink: 0;
    background: rgba(255,255,255,0.04);
    color: #475569;
    transition: all 0.18s;
  }
  .vxsb-sub-link:hover .vxsb-sub-link-ic { background: rgba(255,255,255,0.07); color: #94a3b8; }
  .vxsb-sub-link.is-active .vxsb-sub-link-ic { background: rgba(225,48,108,0.15); color: #f472b6; }

  /* ── Divider ─────────────────────────────────────────── */
  .vxsb-divider {
    height: 1px;
    background: rgba(255,255,255,0.04);
    margin: 4px 0 20px;
  }

  /* ── Settings Sub-Sidebar ───────────────────────────────── */
  .vxsb-sub {
    width: 210px;
    height: 100vh;
    flex-shrink: 0;
    background: #080c18;
    border-right: 1px solid rgba(255,255,255,0.05);
    display: flex;
    flex-direction: column;
    overflow: hidden;
    animation: vxsb-sub-slide 0.22s cubic-bezier(0.16,1,0.3,1);
  }
  @keyframes vxsb-sub-slide {
    from { opacity: 0; transform: translateX(-14px); }
    to   { opacity: 1; transform: translateX(0); }
  }
  .vxsb-sub-hd {
    padding: 22px 16px 14px;
    border-bottom: 1px solid rgba(255,255,255,0.05);
    flex-shrink: 0;
  }
  .vxsb-sub-title {
    font-size: 10px;
    font-weight: 700;
    letter-spacing: 0.12em;
    text-transform: uppercase;
    color: #2d3748;
  }
  .vxsb-sub-body {
    flex: 1;
    overflow-y: auto;
    overflow-x: hidden;
    padding: 12px 10px;
  }
  .vxsb-sub-body::-webkit-scrollbar { width: 0; }
  .vxsb-sub-item {
    display: flex;
    align-items: center;
    gap: 10px;
    padding: 9px 11px;
    border-radius: 11px;
    cursor: pointer;
    transition: all 0.18s;
    border: 1px solid transparent;
    margin-bottom: 2px;
    color: #4a5568;
    font-size: 13px;
    font-weight: 500;
    position: relative;
  }
  .vxsb-sub-item:hover {
    color: #a0aec0;
    background: rgba(255,255,255,0.04);
  }
  .vxsb-sub-item.is-active {
    color: #e9d5ff;
    background: rgba(139,92,246,0.12);
    border-color: rgba(139,92,246,0.18);
  }
  .vxsb-sub-item.is-active::before {
    content: '';
    position: absolute;
    left: -1px;
    top: 22%; bottom: 22%;
    width: 3px;
    border-radius: 0 3px 3px 0;
    background: linear-gradient(180deg, #a78bfa, #60a5fa);
  }
  .vxsb-sub-icon {
    width: 28px; height: 28px;
    border-radius: 8px;
    display: flex; align-items: center; justify-content: center;
    flex-shrink: 0;
    background: rgba(255,255,255,0.03);
    color: #374151;
    transition: all 0.18s;
  }
  .vxsb-sub-item:hover .vxsb-sub-icon {
    background: rgba(255,255,255,0.06);
    color: #6b7280;
  }
  .vxsb-sub-item.is-active .vxsb-sub-icon {
    background: rgba(139,92,246,0.18);
    color: #c4b5fd;
  }
  .vxsb-sub-sep {
    height: 1px;
    background: rgba(255,255,255,0.04);
    margin: 6px 4px;
  }

  /* ── Footer ──────────────────────────────────────────── */
  .vxsb-footer {
    padding: 14px 14px 18px;
    border-top: 1px solid rgba(255,255,255,0.05);
    flex-shrink: 0;
  }

  /* User card */
  .vxsb-user {
    display: flex;
    align-items: center;
    gap: 12px;
    padding: 12px 13px;
    border-radius: 14px;
    background: rgba(255,255,255,0.03);
    border: 1px solid rgba(255,255,255,0.06);
    cursor: pointer;
    transition: all 0.2s;
    margin-bottom: 8px;
  }
  .vxsb-user:hover {
    background: rgba(255,255,255,0.06);
    border-color: rgba(255,255,255,0.1);
  }
  .vxsb-avatar {
    width: 38px;
    height: 38px;
    border-radius: 11px;
    background: linear-gradient(135deg, #7c3aed, #2563eb);
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 15px;
    font-weight: 800;
    color: #fff;
    flex-shrink: 0;
    box-shadow: 0 4px 12px rgba(124,58,237,0.3);
  }
  .vxsb-user-meta { flex: 1; overflow: hidden; }
  .vxsb-user-name {
    font-size: 13.5px;
    font-weight: 700;
    color: #e2e8f0;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }
  .vxsb-user-plan {
    font-size: 11px;
    color: #7c3aed;
    font-weight: 600;
    margin-top: 1px;
  }

  /* Sign out */
  .vxsb-signout {
    display: flex;
    align-items: center;
    gap: 12px;
    padding: 10px 13px;
    border-radius: 11px;
    cursor: pointer;
    color: #374151;
    font-size: 13.5px;
    font-weight: 500;
    transition: all 0.18s;
    border: 1px solid transparent;
  }
  .vxsb-signout:hover {
    color: #f87171;
    background: rgba(239,68,68,0.07);
    border-color: rgba(239,68,68,0.15);
  }
  .vxsb-signout-icon {
    width: 32px; height: 32px;
    border-radius: 8px;
    background: rgba(255,255,255,0.03);
    display: flex; align-items: center; justify-content: center;
    flex-shrink: 0;
    color: #4b5563;
    transition: all 0.18s;
  }
  .vxsb-signout:hover .vxsb-signout-icon {
    background: rgba(239,68,68,0.1);
    color: #f87171;
  }
`;

const MAIN_NAV = [
  { label: "Dashboard",       icon: <LayoutDashboard size={18} />, path: "/dashboard" },
  { label: "Upload Campaign", icon: <Upload size={18} />,          path: "/upload" },
  { label: "Create Post",     icon: <PenSquare size={18} />,       path: "/create-post" },
  { label: "Scheduled Posts", icon: <Calendar size={18} />,        path: "/dashboard/scheduled" },
  { label: "My Analytics",   icon: <BarChart3 size={18} />,        path: "/dashboard/campaigns" },
  { label: "Social Accounts", icon: <Share2 size={18} />,          path: "/social" },
  { label: "My Profile",      icon: <User size={18} />,            path: "/profile" },
  { label: "Settings",        icon: <Settings size={18} />,        path: "/settings" },
];

const ANALYTICS_SUB = [
  { label: "Engagement Dashboard", icon: <MessageSquare size={13} />, path: "/dashboard/engagement" },
  { label: "Instagram Insights", icon: <Instagram size={13} />, path: "/dashboard/instagram" },
  { label: "Hashtag Tracking", icon: <Hash size={13} />, path: "/dashboard/hashtags" },
  { label: "Inbox", icon: <Inbox size={13} />, path: "/dashboard/community" },
];

const SETTINGS_NAV = [
  { label: "Profile",        icon: <User size={14} />,        path: "/settings/profile" },
  { label: "Workspace",      icon: <Building2 size={14} />,   path: "/settings/workspace" },
  { label: "Brand Kit",      icon: <Briefcase size={14} />,   path: "/settings/brand-kit" },
  { label: "Brand Persona",  icon: <Mic2 size={14} />,        path: "/settings/brand-persona" },
  { label: "AI Profile",     icon: <Bot size={14} />,         path: "/settings/ai-profile" },
  null,
  { label: "Notifications",  icon: <Bell size={14} />,        path: "/settings/notifications" },
  { label: "Subscription",   icon: <Crown size={14} />,       path: "/settings/subscription" },
  { label: "Billing",        icon: <CreditCard size={14} />,  path: "/settings/billing" },
  null,
  { label: "API",            icon: <Code2 size={14} />,       path: "/settings/api" },
];

interface Props {
  userName?: string;
  userInitial?: string;
}

export function DashboardSidebar({ userName = "User", userInitial = "U" }: Props) {
  const navigate = useNavigate();
  const location = useLocation();
  const [analyticsOpen, setAnalyticsOpen] = useState(
    location.pathname.startsWith("/dashboard/campaigns") ||
    location.pathname.startsWith("/dashboard/instagram") ||
    location.pathname.startsWith("/dashboard/engagement") ||
    location.pathname.startsWith("/dashboard/hashtags") ||
    location.pathname.startsWith("/dashboard/community")
  );

  const isActive = (path: string) => location.pathname === path;
  const isSettings = location.pathname.startsWith("/settings");
  const isSettingsActive = (path: string) => location.pathname === path ||
    (path === "/settings/profile" && location.pathname === "/settings");

  const handleLogout = () => {
    localStorage.clear();
    navigate("/auth");
  };

  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: SB }} />
      <div className="vxsb-root">

        {/* Logo */}
        <div className="vxsb-header">
          <VulpinixLogo size="sm" showText={true} />
        </div>

        {/* Nav body */}
        <div className="vxsb-body">

          {/* Main navigation */}
          <div className="vxsb-group">
            <div className="vxsb-group-label">Main Menu</div>
            {MAIN_NAV.map(item => {
              const isAnalytics = item.path === "/dashboard/campaigns";
              return (
                <div key={item.path}>
                  <div
                    className={`vxsb-link ${isActive(item.path) ? "is-active" : ""}`}
                    onClick={() => {
                      if (isAnalytics) setAnalyticsOpen(o => !o);
                      navigate(item.path);
                    }}
                  >
                    <div className="vxsb-link-icon">{item.icon}</div>
                    <span className="vxsb-link-text">{item.label}</span>
                    {isAnalytics
                      ? <ChevronRight size={14} className="vxsb-link-arrow" style={{ transition: "transform 0.2s", transform: analyticsOpen ? "rotate(90deg)" : "rotate(0deg)", opacity: 1 }} />
                      : <ChevronRight size={14} className="vxsb-link-arrow" />
                    }
                  </div>
                  {isAnalytics && (
                    <div className={`vxsb-sub-nav ${analyticsOpen ? "expanded" : "collapsed"}`}>
                      {ANALYTICS_SUB.map(sub => (
                        <div
                          key={sub.path}
                          className={`vxsb-sub-link ${isActive(sub.path) ? "is-active" : ""}`}
                          onClick={() => navigate(sub.path)}
                        >
                          <div className="vxsb-sub-link-ic">{sub.icon}</div>
                          {sub.label}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          <div className="vxsb-divider" />

          {/* Intelligence */}
          <div className="vxsb-group">
            <div className="vxsb-group-label">Intelligence</div>
            <div
              className={`vxsb-link vxsb-link-ai ${isActive("/dashboard/ai") ? "is-active" : ""}`}
              onClick={() => navigate("/dashboard/ai")}
            >
              <div className="vxsb-link-icon"><Sparkles size={18} /></div>
              <span className="vxsb-link-text">Vulpinix AI</span>
              <ChevronRight size={14} className="vxsb-link-arrow" />
            </div>
          </div>

          <div className="vxsb-divider" />

          {/* Support */}
          <div className="vxsb-group">
            <div className="vxsb-group-label">Support</div>
            <div
              className={`vxsb-link ${isActive("/feedback") ? "is-active" : ""}`}
              onClick={() => navigate("/feedback")}
            >
              <div className="vxsb-link-icon"><MessageSquare size={18} /></div>
              <span className="vxsb-link-text">Feedback</span>
              <ChevronRight size={14} className="vxsb-link-arrow" />
            </div>
          </div>

        </div>

        {/* Footer */}
        <div className="vxsb-footer">
          <div className="vxsb-user" onClick={() => navigate("/profile")}>
            <div className="vxsb-avatar">{userInitial}</div>
            <div className="vxsb-user-meta">
              <div className="vxsb-user-name">{userName}</div>
              <div className="vxsb-user-plan">✦ Free Plan</div>
            </div>
            <ChevronRight size={14} style={{ color: "#374151", flexShrink: 0 }} />
          </div>
          <div className="vxsb-signout" onClick={handleLogout}>
            <div className="vxsb-signout-icon"><LogOut size={15} /></div>
            Sign Out
          </div>
        </div>

      </div>

      {/* Settings Sub-Sidebar */}
      {isSettings && (
        <div className="vxsb-sub">
          <div className="vxsb-sub-hd">
            <div className="vxsb-sub-title">Settings</div>
          </div>
          <div className="vxsb-sub-body">
            {SETTINGS_NAV.map((item, i) => {
              if (!item) return <div key={`sep-${i}`} className="vxsb-sub-sep" />;
              return (
                <div
                  key={item.path}
                  className={`vxsb-sub-item ${isSettingsActive(item.path) ? "is-active" : ""}`}
                  onClick={() => navigate(item.path)}
                >
                  <div className="vxsb-sub-icon">{item.icon}</div>
                  {item.label}
                </div>
              );
            })}
          </div>
        </div>
      )}
    </>
  );
}
