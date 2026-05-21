import { useState } from "react";
import { useNavigate, useLocation } from "react-router";
import {
  LayoutDashboard, BarChart3, Upload, User,
  ChevronLeft, ChevronRight, LogOut,
  Sparkles, Share2, Settings, Calendar
} from "lucide-react";
import { VulpinixLogo } from "./VulpinixLogo";

const SB = `
  .vxsb-wrap {
    display: flex;
    flex-direction: column;
    height: 100vh;
    background: rgba(8,11,20,0.95);
    border-right: 1px solid rgba(255,255,255,0.06);
    backdrop-filter: blur(20px);
    transition: width 0.3s cubic-bezier(0.4,0,0.2,1);
    overflow: hidden;
    flex-shrink: 0;
    position: relative;
    z-index: 50;
  }
  .vxsb-wrap.expanded { width: 240px; }
  .vxsb-wrap.collapsed { width: 72px; }

  .vxsb-top {
    padding: 20px 16px;
    border-bottom: 1px solid rgba(255,255,255,0.05);
    display: flex;
    align-items: center;
    justify-content: space-between;
    min-height: 72px;
  }

  .vxsb-toggle {
    width: 28px; height: 28px;
    border-radius: 8px;
    border: 1px solid rgba(255,255,255,0.1);
    background: rgba(255,255,255,0.04);
    display: flex; align-items: center; justify-content: center;
    cursor: pointer;
    color: #94a3b8;
    flex-shrink: 0;
    transition: background 0.2s;
  }
  .vxsb-toggle:hover { background: rgba(167,139,250,0.15); color: #a78bfa; }

  .vxsb-nav { flex: 1; padding: 16px 12px; display: flex; flex-direction: column; gap: 4px; overflow-y: auto; }

  .vxsb-section-label {
    font-size: 10px; font-weight: 700; text-transform: uppercase;
    letter-spacing: 0.08em; color: #475569;
    padding: 0 10px; margin: 12px 0 6px;
    white-space: nowrap; overflow: hidden;
    transition: opacity 0.2s;
  }
  .collapsed .vxsb-section-label { opacity: 0; }

  .vxsb-item {
    display: flex; align-items: center; gap: 12px;
    padding: 10px 12px; border-radius: 12px;
    color: #94a3b8; font-size: 14px; font-weight: 500;
    cursor: pointer; transition: all 0.2s;
    white-space: nowrap; overflow: hidden;
    border: 1px solid transparent;
  }
  .vxsb-item:hover { color: #fff; background: rgba(255,255,255,0.04); }
  .vxsb-item.active {
    color: #a78bfa;
    background: rgba(167,139,250,0.1);
    border-color: rgba(167,139,250,0.2);
  }
  .vxsb-item-icon { flex-shrink: 0; }
  .vxsb-item-label { transition: opacity 0.2s, width 0.3s; }
  .collapsed .vxsb-item-label { opacity: 0; width: 0; }

  .vxsb-bottom {
    padding: 16px 12px;
    border-top: 1px solid rgba(255,255,255,0.05);
    display: flex; flex-direction: column; gap: 4px;
  }

  .vxsb-user {
    display: flex; align-items: center; gap: 10px;
    padding: 10px 12px; border-radius: 12px;
    cursor: pointer; transition: background 0.2s;
    overflow: hidden;
  }
  .vxsb-user:hover { background: rgba(255,255,255,0.04); }
  .vxsb-avatar {
    width: 32px; height: 32px; border-radius: 10px; flex-shrink: 0;
    background: linear-gradient(135deg, #a78bfa, #38bdf8);
    display: flex; align-items: center; justify-content: center;
    font-weight: 800; font-size: 13px; color: #fff;
  }
  .vxsb-user-info { overflow: hidden; }
  .vxsb-user-name { font-size: 13px; font-weight: 700; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
  .vxsb-user-role { font-size: 11px; color: #64748b; }
  .collapsed .vxsb-user-info { display: none; }

  .vxsb-ai-badge {
    margin: 12px;
    padding: 12px;
    border-radius: 14px;
    background: linear-gradient(135deg, rgba(167,139,250,0.1), rgba(56,189,248,0.08));
    border: 1px solid rgba(167,139,250,0.2);
    cursor: pointer;
    transition: opacity 0.3s;
    overflow: hidden;
  }
  .collapsed .vxsb-ai-badge { opacity: 0; pointer-events: none; }
  .vxsb-ai-badge-title { font-size: 12px; font-weight: 700; margin-bottom: 4px; display: flex; align-items: center; gap: 6px; }
  .vxsb-ai-badge-sub { font-size: 11px; color: #94a3b8; line-height: 1.4; }
`;

const NAV_ITEMS = [
  { label: "Dashboard",       icon: <LayoutDashboard size={18} />, path: "/dashboard" },
  { label: "Upload Campaign", icon: <Upload size={18} />,          path: "/upload" },
  { label: "Scheduled Posts", icon: <Calendar size={18} />,        path: "/dashboard/scheduled" },
  { label: "My Profile",      icon: <User size={18} />,            path: "/profile" },
  { label: "My Analytics",    icon: <BarChart3 size={18} />,       path: "/dashboard/campaigns" },
  { label: "Social Accounts", icon: <Share2 size={18} />,          path: "/social" },
  { label: "Settings",        icon: <Settings size={18} />,        path: "/settings" },
];

interface Props {
  userName?: string;
  userInitial?: string;
}

export function DashboardSidebar({ userName = "User", userInitial = "U" }: Props) {
  const navigate = useNavigate();
  const location = useLocation();
  const [expanded, setExpanded] = useState(true);

  const cls = expanded ? "expanded" : "collapsed";

  const handleLogout = () => {
    localStorage.clear();
    navigate("/auth");
  };

  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: SB }} />
      <div className={`vxsb-wrap ${cls}`}>
        {/* Top */}
        <div className="vxsb-top">
          {expanded && <VulpinixLogo size="sm" showText={true} />}
          <button className="vxsb-toggle" onClick={() => setExpanded(e => !e)}>
            {expanded ? <ChevronLeft size={14} /> : <ChevronRight size={14} />}
          </button>
        </div>

        {/* AI Badge */}
        <div className="vxsb-ai-badge" onClick={() => navigate("/upload")}>
          <div className="vxsb-ai-badge-title">
            <Sparkles size={13} color="#a78bfa" /> Vulpinix AI Ready
          </div>
          <div className="vxsb-ai-badge-sub">Launch your next AI-powered campaign now.</div>
        </div>

        {/* Nav */}
        <div className="vxsb-nav">
          <div className="vxsb-section-label">Navigation</div>
          {NAV_ITEMS.map(item => (
            <div
              key={item.path + item.label}
              className={`vxsb-item ${location.pathname === item.path ? "active" : ""}`}
              onClick={() => navigate(item.path)}
            >
              <span className="vxsb-item-icon">{item.icon}</span>
              <span className="vxsb-item-label">{item.label}</span>
            </div>
          ))}
        </div>

        {/* Bottom user area */}
        <div className="vxsb-bottom">
          <div className="vxsb-item" onClick={handleLogout} style={{ color: "#ef4444" }}>
            <span className="vxsb-item-icon"><LogOut size={18} /></span>
            <span className="vxsb-item-label">Sign Out</span>
          </div>
          <div className="vxsb-user" onClick={() => navigate("/profile")}>
            <div className="vxsb-avatar">{userInitial}</div>
            <div className="vxsb-user-info">
              <div className="vxsb-user-name">{userName}</div>
              <div className="vxsb-user-role">Free Plan</div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
