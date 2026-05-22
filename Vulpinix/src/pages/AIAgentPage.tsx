import { useState, useEffect } from "react";
import { useNavigate } from "react-router";
import { DashboardSidebar } from "../components/DashboardSidebar";
import { DashboardTopBar } from "../components/DashboardTopBar";
import { VulpinixAIAgent } from "../components/VulpinixAIAgent";
import { motion } from "framer-motion";
import { Sparkles, Zap } from "lucide-react";

function VulpinixIcon({ size = 24, color = '#fff' }: { size?: number; color?: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
      <polygon points="15,20 45,85 55,60 35,20" fill={color} />
      <polygon points="85,20 55,85 45,60 65,20" fill={color} />
      <polygon points="40,25 60,25 50,50" fill={color} opacity="0.5" />
    </svg>
  );
}


const S = `
  @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800;900&display=swap');

  .vxai-shell {
    display: flex;
    height: 100vh;
    background: #070b14;
    overflow: hidden;
    font-family: 'Inter', sans-serif;
  }
  .vxai-main {
    flex: 1;
    display: flex;
    flex-direction: column;
    overflow: hidden;
    position: relative;
  }

  .vxai-orb1 {
    position: fixed; pointer-events: none;
    width: 600px; height: 600px; border-radius: 50%;
    top: -200px; right: -100px;
    background: radial-gradient(circle, rgba(124,58,237,0.1) 0%, transparent 70%);
    z-index: 0;
  }
  .vxai-orb2 {
    position: fixed; pointer-events: none;
    width: 500px; height: 500px; border-radius: 50%;
    bottom: -150px; left: 200px;
    background: radial-gradient(circle, rgba(56,189,248,0.06) 0%, transparent 70%);
    z-index: 0;
  }

  .vxai-content {
    flex: 1;
    display: flex;
    flex-direction: column;
    overflow: hidden;
    padding: 18px 28px 20px;
    position: relative;
    z-index: 1;
    gap: 14px;
  }

  /* ── Page header ───────────────────────────────── */
  .vxai-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    flex-wrap: wrap;
    gap: 12px;
    flex-shrink: 0;
  }
  .vxai-header-left {
    display: flex;
    align-items: center;
    gap: 12px;
  }
  .vxai-header-icon {
    width: 38px; height: 38px;
    border-radius: 11px;
    // background: linear-gradient(135deg, #7c3aed, #2563eb);
    background-color: #2e6bed;
    display: flex; align-items: center; justify-content: center;
    box-shadow: 0 4px 14px rgba(124,58,237,0.3);
    flex-shrink: 0;
  }
  .vxai-header-title {
    font-size: 18px; font-weight: 800; color: #f1f5f9;
    letter-spacing: -0.02em; margin-bottom: 2px;
  }
  .vxai-header-sub {
    font-size: 12px; color: #64748b;
    display: flex; align-items: center; gap: 5px;
  }
  .vxai-status-dot {
    width: 6px; height: 6px; border-radius: 50%;
    background: #22c55e;
    box-shadow: 0 0 6px #22c55e;
    animation: vxai-pulse 2s ease-in-out infinite;
  }
  @keyframes vxai-pulse {
    0%,100% { opacity: 1; transform: scale(1); }
    50% { opacity: 0.6; transform: scale(1.3); }
  }

  /* Stat pills */
  .vxai-pills {
    display: flex; align-items: center; gap: 6px; flex-wrap: wrap;
  }
  .vxai-pill {
    display: inline-flex; align-items: center; gap: 5px;
    padding: 5px 11px; border-radius: 20px;
    font-size: 11px; font-weight: 600;
    background: rgba(255,255,255,0.04);
    border: 1px solid rgba(255,255,255,0.08);
    color: #94a3b8;
  }
  .vxai-pill.purple {
    background: rgba(124,58,237,0.1);
    border-color: rgba(124,58,237,0.2);
    color: #a78bfa;
  }

  /* ── Chat container ────────────────────────────── */
  .vxai-chat-wrap {
    flex: 1;
    background: rgba(255,255,255,0.02);
    border: 1px solid rgba(255,255,255,0.07);
    border-radius: 22px;
    overflow: hidden;
    display: flex;
    flex-direction: column;
    box-shadow: 0 0 0 1px rgba(124,58,237,0.08) inset,
                0 20px 50px rgba(0,0,0,0.35);
    min-height: 0;
  }
`;

export default function AIAgentPage() {
  const navigate = useNavigate();
  const [userName, setUserName] = useState("there");

  useEffect(() => {
    if (localStorage.getItem("isAuthenticated") !== "true") {
      navigate("/auth", { replace: true });
      return;
    }
    try {
      const u = JSON.parse(localStorage.getItem("userInfo") || "{}");
      if (u.name) setUserName(u.name.split(" ")[0]);
    } catch {}
  }, [navigate]);

  const userInitial = userName[0]?.toUpperCase() || "U";

  return (
    <div className="vxai-shell">
      <style dangerouslySetInnerHTML={{ __html: S }} />
      <div className="vxai-orb1" />
      <div className="vxai-orb2" />

      <DashboardSidebar userName={userName} userInitial={userInitial} />

      <div className="vxai-main">
        <DashboardTopBar userName={userName} userInitial={userInitial} />

        <div className="vxai-content">

          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: -14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.35 }}
            className="vxai-header"
          >
            <div className="vxai-header-left">
              <div className="vxai-header-icon">
                <VulpinixIcon size={20} color="#fff" />
              </div>
              <div className="flex flex-col">
                <div className="vxai-header-title">Vulpinix AI Agent</div>
                <div className="vxai-header-sub">
                  <span className="vxai-status-dot" />
                  Online · Marketing Intelligence 
                </div>
              </div>
            </div>

            <div className="vxai-pills">
              <span className="vxai-pill purple">
                <Sparkles size={12} /> AI-Powered
              </span>
              <span className="vxai-pill">
                <Zap size={12} /> Gemini 1.5 Flash
              </span>
              <span className="vxai-pill">
                Image Generation
              </span>
            </div>
          </motion.div>

          {/* Chat window */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.45, delay: 0.1 }}
            className="vxai-chat-wrap"
          >
            <VulpinixAIAgent userInitial={userInitial} />
          </motion.div>

        </div>
      </div>
    </div>
  );
}
