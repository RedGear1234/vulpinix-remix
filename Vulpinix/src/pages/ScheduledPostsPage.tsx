import { useState, useEffect } from "react";
import { useNavigate } from "react-router";
import { motion, AnimatePresence } from "framer-motion";
import {
  Calendar as CalendarIcon, Clock, ChevronLeft, ChevronRight,
  Trash2, Edit3, X, Sparkles, Plus, Search, RefreshCw, Layers
} from "lucide-react";
import { DashboardSidebar } from "../components/DashboardSidebar";
import { DashboardTopBar } from "../components/DashboardTopBar";
import { API_BASE } from "../config/api";
import { toast } from "sonner";

interface Campaign {
  id: string;
  name: string;
  platforms: string[];
  budget: string;
  status: string;
  scheduledAt?: string;
  dateSubmitted?: string;
  adImage?: string;
}

const getPlatformIcon = (platform: string) => {
  const p = platform.toLowerCase();
  if (p.includes("instagram")) return "📸";
  if (p.includes("facebook")) return "🔵";
  if (p.includes("twitter") || p.includes("x")) return "𝕏";
  if (p.includes("linkedin")) return "💼";
  if (p.includes("youtube")) return "📺";
  return "🔗";
};

const getPlatformColor = (platform: string) => {
  const p = platform.toLowerCase();
  if (p.includes("instagram")) return "#f472b6";
  if (p.includes("facebook")) return "#38bdf8";
  if (p.includes("twitter") || p.includes("x")) return "#e2e8f0";
  if (p.includes("linkedin")) return "#60a5fa";
  if (p.includes("youtube")) return "#ef4444";
  return "#a78bfa";
};

const STYLE = `
  .vxsch-shell { display: flex; height: 100vh; background: #070b14; color: #f1f5f9; font-family: 'Inter', sans-serif; overflow: hidden; }
  .vxsch-main { flex: 1; display: flex; flex-direction: column; height: 100vh; overflow: hidden; position: relative; }
  .vxsch-scroll { flex: 1; overflow-y: auto; padding: 28px 32px 80px; position: relative; z-index: 10; box-sizing: border-box; }
  .vxsch-orb1 { position: fixed; top: -10%; right: -10%; width: 45vw; height: 45vw; background: radial-gradient(circle, rgba(167,139,250,0.06) 0%, transparent 70%); pointer-events: none; z-index: 1; }
  .vxsch-orb2 { position: fixed; bottom: -10%; left: -10%; width: 45vw; height: 45vw; background: radial-gradient(circle, rgba(244,114,182,0.05) 0%, transparent 70%); pointer-events: none; z-index: 1; }

  /* Header controls */
  .vxsch-controls { display: flex; align-items: center; justify-content: space-between; margin-bottom: 24px; flex-wrap: wrap; gap: 16px; }
  .vxsch-view-toggles { display: flex; background: rgba(255,255,255,0.02); border: 1px solid rgba(255,255,255,0.08); padding: 4px; border-radius: 12px; }
  .vxsch-view-btn { padding: 8px 16px; border-radius: 9px; font-size: 13px; font-weight: 700; cursor: pointer; border: none; background: transparent; color: #94a3b8; transition: all 0.22s; display: flex; align-items: center; gap: 8px; }
  .vxsch-view-btn.active { background: rgba(167,139,250,0.12); color: #a78bfa; border: 1px solid rgba(167,139,250,0.18); }
  .vxsch-view-btn:hover:not(.active) { color: #f1f5f9; background: rgba(255,255,255,0.03); }

  /* Calendar Widget */
  .vxsch-cal-container { background: rgba(255,255,255,0.02); border: 1px solid rgba(255,255,255,0.06); border-radius: 20px; backdrop-filter: blur(12px); box-shadow: 0 20px 40px rgba(0,0,0,0.3); overflow: hidden; }
  .vxsch-cal-header { display: flex; align-items: center; justify-content: space-between; padding: 20px 24px; border-bottom: 1px solid rgba(255,255,255,0.06); background: rgba(255,255,255,0.01); }
  .vxsch-month-title { font-size: 18px; font-weight: 800; color: #f1f5f9; letter-spacing: -0.02em; }
  .vxsch-month-nav { display: flex; gap: 8px; }
  .vxsch-nav-btn { width: 34px; height: 34px; border-radius: 10px; border: 1px solid rgba(255,255,255,0.08); background: rgba(255,255,255,0.03); color: #94a3b8; display: flex; align-items: center; justify-content: center; cursor: pointer; transition: all 0.2s; }
  .vxsch-nav-btn:hover { background: rgba(255,255,255,0.07); color: #f1f5f9; border-color: rgba(255,255,255,0.14); }

  /* Calendar Grid */
  .vxsch-cal-grid { display: grid; grid-template-columns: repeat(7, 1fr); }
  .vxsch-day-label { padding: 12px 8px; text-align: center; font-size: 11px; font-weight: 700; color: #475569; text-transform: uppercase; letter-spacing: 0.08em; border-bottom: 1px solid rgba(255,255,255,0.05); }
  
  .vxsch-day-cell { min-height: 110px; padding: 8px; border-bottom: 1px solid rgba(255,255,255,0.04); border-right: 1px solid rgba(255,255,255,0.04); cursor: pointer; transition: all 0.2s; display: flex; flex-direction: column; justify-content: space-between; position: relative; }
  .vxsch-day-cell:nth-child(7n) { border-right: none; }
  .vxsch-day-cell:hover { background: rgba(167,139,250,0.02); }
  .vxsch-day-cell.prev-next { opacity: 0.25; background: rgba(0,0,0,0.15); cursor: default; pointer-events: none; }
  .vxsch-day-cell.today { background: rgba(167,139,250,0.04); }
  .vxsch-day-cell.today::before { content: ''; position: absolute; top: 0; left: 0; right: 0; height: 3px; background: #a78bfa; }
  .vxsch-day-number { font-size: 13px; font-weight: 700; color: #64748b; margin-bottom: 6px; align-self: flex-end; }
  .vxsch-day-cell.today .vxsch-day-number { color: #a78bfa; }

  /* Cell post items */
  .vxsch-cell-posts { display: flex; flex-direction: column; gap: 4px; flex: 1; overflow: hidden; }
  .vxsch-cell-post { padding: 4px 6px; border-radius: 6px; font-size: 10px; font-weight: 600; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; display: flex; align-items: center; gap: 4px; border: 1px solid rgba(255,255,255,0.03); max-width: 100%; }
  .vxsch-cell-more { font-size: 9px; font-weight: 700; color: #a78bfa; margin-top: 2px; padding-left: 4px; }

  /* Chronological list layout */
  .vxsch-list-container { display: flex; flex-direction: column; gap: 16px; }
  .vxsch-list-filters { display: flex; gap: 12px; margin-bottom: 8px; flex-wrap: wrap; }
  .vxsch-filter-input-wrap { display: flex; align-items: center; background: rgba(255,255,255,0.02); border: 1px solid rgba(255,255,255,0.08); border-radius: 12px; padding: 0 14px; flex: 1; min-width: 240px; }
  .vxsch-filter-input { background: transparent; border: none; outline: none; padding: 10px 0; color: #f1f5f9; font-size: 13px; font-family: inherit; width: 100%; }
  .vxsch-filter-select { background: rgba(255,255,255,0.02); border: 1px solid rgba(255,255,255,0.08); border-radius: 12px; padding: 10px 14px; color: #94a3b8; font-size: 13px; font-family: inherit; outline: none; cursor: pointer; min-width: 160px; transition: border-color 0.2s; }
  .vxsch-filter-select:focus { border-color: rgba(167,139,250,0.4); }

  /* Queue card list */
  .vxsch-q-card { display: flex; align-items: center; justify-content: space-between; padding: 18px 24px; background: rgba(255,255,255,0.02); border: 1px solid rgba(255,255,255,0.06); border-radius: 18px; transition: all 0.22s; gap: 16px; }
  .vxsch-q-card:hover { border-color: rgba(255,255,255,0.12); background: rgba(255,255,255,0.03); transform: translateY(-1px); }
  .vxsch-q-info { display: flex; align-items: center; gap: 16px; flex: 1; min-width: 0; }
  .vxsch-q-media { width: 52px; height: 52px; border-radius: 10px; background: rgba(255,255,255,0.03); border: 1px solid rgba(255,255,255,0.08); overflow: hidden; display: flex; align-items: center; justify-content: center; flex-shrink: 0; }
  .vxsch-q-media img { width: 100%; height: 100%; object-fit: cover; }
  .vxsch-q-details { min-width: 0; flex: 1; }
  .vxsch-q-title { font-size: 15px; font-weight: 700; color: #f1f5f9; margin-bottom: 4px; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
  .vxsch-q-meta { display: flex; align-items: center; gap: 12px; font-size: 12px; color: #64748b; flex-wrap: wrap; }
  .vxsch-q-time-pill { display: flex; align-items: center; gap: 5px; color: #a78bfa; background: rgba(167,139,250,0.08); padding: 3px 8px; border-radius: 6px; font-weight: 600; }
  .vxsch-q-platform-row { display: flex; gap: 4px; }
  .vxsch-q-platform-pill { font-size: 11px; padding: 2px 6px; border-radius: 4px; font-weight: 700; border: 1px solid rgba(255,255,255,0.03); }

  .vxsch-q-actions { display: flex; align-items: center; gap: 8px; }
  .vxsch-q-btn { width: 36px; height: 36px; border-radius: 10px; border: 1px solid rgba(255,255,255,0.08); background: rgba(255,255,255,0.03); display: flex; align-items: center; justify-content: center; cursor: pointer; transition: all 0.2s; color: #64748b; }
  .vxsch-q-btn:hover { color: #f1f5f9; background: rgba(255,255,255,0.07); border-color: rgba(255,255,255,0.15); }
  .vxsch-q-btn.danger:hover { color: #ef4444; background: rgba(239,68,68,0.1); border-color: rgba(239,68,68,0.2); }

  /* Empty state */
  .vxsch-empty { text-align: center; padding: 80px 24px; background: rgba(255,255,255,0.015); border: 1px dashed rgba(255,255,255,0.08); border-radius: 20px; max-width: 500px; margin: 40px auto; }
  .vxsch-empty-icon { width: 64px; height: 64px; border-radius: 18px; background: rgba(167,139,250,0.08); border: 1px solid rgba(167,139,250,0.18); display: flex; align-items: center; justify-content: center; margin: 0 auto 20px; color: #a78bfa; }
  
  /* Modals */
  .vxsch-modal-overlay { position: fixed; top: 0; left: 0; right: 0; bottom: 0; background: rgba(7,11,20,0.85); backdrop-filter: blur(12px); display: flex; align-items: center; justify-content: center; z-index: 100; padding: 20px; }
  .vxsch-modal-content { background: #0b111e; border: 1px solid rgba(255,255,255,0.08); border-radius: 24px; padding: 28px; width: 100%; max-width: 480px; box-shadow: 0 30px 60px rgba(0,0,0,0.4); position: relative; }
  .vxsch-modal-close { position: absolute; top: 20px; right: 20px; color: #64748b; cursor: pointer; transition: color 0.15s; }
  .vxsch-modal-close:hover { color: #f1f5f9; }
  .vxsch-modal-title { font-size: 18px; font-weight: 800; color: #f1f5f9; margin-bottom: 20px; display: flex; align-items: center; gap: 8px; }

  /* Reschedule panel */
  .vxsch-resched-panel { border-top: 1px solid rgba(255,255,255,0.08); padding-top: 20px; margin-top: 20px; }
  .vxsch-input-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 12px; margin-bottom: 16px; }
  .vxsch-lbl { display: block; font-size: 11px; font-weight: 700; color: #94a3b8; text-transform: uppercase; letter-spacing: 0.08em; margin-bottom: 6px; }
  .vxsch-input { width: 100%; padding: 11px 14px; background: rgba(255,255,255,0.03); border: 1px solid rgba(255,255,255,0.08); border-radius: 12px; color: #f1f5f9; font-size: 14px; outline: none; transition: border-color 0.2s; box-sizing: border-box; }
  .vxsch-input:focus { border-color: rgba(167,139,250,0.45); }
  .vxsch-input::-webkit-calendar-picker-indicator { filter: invert(0.95); opacity: 0.85; cursor: pointer; }

  /* Detail Items */
  .vxsch-det-list { display: flex; flex-direction: column; gap: 14px; max-height: 280px; overflow-y: auto; padding-right: 4px; }
  .vxsch-det-item { padding: 12px; background: rgba(255,255,255,0.02); border: 1px solid rgba(255,255,255,0.06); border-radius: 12px; display: flex; justify-content: space-between; align-items: center; gap: 12px; }

  /* Buttons */
  .vxsch-btn-pri { display: inline-flex; align-items: center; justify-content: center; gap: 8px; padding: 12px 20px; border-radius: 12px; background: linear-gradient(135deg, #a78bfa, #38bdf8); border: none; color: #fff; font-weight: 700; font-size: 13px; cursor: pointer; box-shadow: 0 4px 14px rgba(167,139,250,0.25); transition: all 0.2s; }
  .vxsch-btn-pri:hover { transform: translateY(-1px); box-shadow: 0 8px 20px rgba(167,139,250,0.35); }
  .vxsch-btn-ghost { display: inline-flex; align-items: center; justify-content: center; gap: 8px; padding: 11px 18px; border-radius: 12px; background: rgba(255,255,255,0.03); border: 1px solid rgba(255,255,255,0.08); color: #94a3b8; font-weight: 700; font-size: 13px; cursor: pointer; transition: all 0.2s; }
  .vxsch-btn-ghost:hover { background: rgba(255,255,255,0.07); color: #f1f5f9; }

  @media (max-width: 768px) {
    .vxsch-cal-grid { grid-template-columns: repeat(7, 1fr); }
    .vxsch-day-cell { min-height: 80px; padding: 4px; }
    .vxsch-day-number { font-size: 11px; }
    .vxsch-cell-posts { display: none; } /* Hide names on mobile to keep it clean */
    .vxsch-q-card { flex-direction: column; align-items: flex-start; }
    .vxsch-q-actions { width: 100%; justify-content: flex-end; margin-top: 10px; }
  }
`;

export default function ScheduledPostsPage() {
  const navigate = useNavigate();
  const [userName, setUserName] = useState("User");
  const [userInitial, setUserInitial] = useState("U");
  const [loading, setLoading] = useState(true);
  const [viewMode, setViewMode] = useState<"calendar" | "list">("calendar");

  const [campaigns, setCampaigns] = useState<Campaign[]>([]);
  const [currentDate, setCurrentDate] = useState(new Date());

  // Filter States
  const [searchQuery, setSearchQuery] = useState("");
  const [platformFilter, setPlatformFilter] = useState("all");

  // Modals
  const [selectedDay, setSelectedDay] = useState<number | null>(null);
  const [selectedCampaign, setSelectedCampaign] = useState<Campaign | null>(null);
  const [isRescheduling, setIsRescheduling] = useState(false);
  const [newDate, setNewDate] = useState("");
  const [newTime, setNewTime] = useState("");

  const todayStr = new Date().toLocaleDateString("en-CA");

  useEffect(() => {
    if (localStorage.getItem("isAuthenticated") !== "true") {
      navigate("/auth", { replace: true });
      return;
    }
    try {
      const u = JSON.parse(localStorage.getItem("userInfo") || "{}");
      if (u.name) {
        setUserName(u.name.split(" ")[0]);
        setUserInitial(u.name[0]?.toUpperCase() || "U");
      }
    } catch {}
    loadCampaigns();
  }, [navigate]);

  const loadCampaigns = async () => {
    setLoading(true);
    const token = localStorage.getItem("authToken");
    let list: Campaign[] = [];
    if (token) {
      try {
        const r = await fetch(`${API_BASE}/api/campaign/my-campaigns`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        const d = await r.json();
        if (d.success && d.campaigns) {
          list = d.campaigns;
        }
      } catch (err) {
        console.error(err);
      }
    }
    // Filter scheduled campaigns
    const scheduled = list.filter(c => c.status === "scheduled" || c.scheduledAt);
    setCampaigns(scheduled);
    setLoading(false);
  };

  const handleDeleteCampaign = async (id: string) => {
    if (!window.confirm("Are you sure you want to cancel/delete this scheduled post?")) return;
    const token = localStorage.getItem("authToken");
    if (!token) return;

    try {
      const res = await fetch(`${API_BASE}/api/campaign/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` }
      });
      const data = await res.json();
      if (data.success) {
        toast.success("Scheduled post cancelled successfully.");
        // Reload
        setCampaigns(prev => prev.filter(c => c.id !== id));
        setSelectedDay(null);
        setSelectedCampaign(null);
      } else {
        toast.error(data.message || "Failed to cancel post.");
      }
    } catch (err) {
      console.error(err);
      toast.error("Error connecting to server.");
    }
  };

  const handleRescheduleSubmit = async () => {
    if (!selectedCampaign) return;
    if (!newDate) {
      toast.error("Please pick a date.");
      return;
    }

    const scheduledAtStr = `${newDate}T${newTime || "00:00"}:00`;
    const selectedDateTime = new Date(scheduledAtStr);
    const now = new Date();
    if (selectedDateTime <= now) {
      toast.error("Reschedule date and time must be in the future.");
      return;
    }

    const token = localStorage.getItem("authToken");
    if (!token) return;

    try {
      const res = await fetch(`${API_BASE}/api/campaign/${selectedCampaign.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ scheduledAt: scheduledAtStr })
      });
      const data = await res.json();
      if (data.success) {
        toast.success(`Post rescheduled successfully to ${newDate} at ${newTime || "00:00"}.`);
        setIsRescheduling(false);
        setSelectedCampaign(null);
        setSelectedDay(null);
        loadCampaigns();
      } else {
        toast.error(data.message || "Failed to reschedule campaign.");
      }
    } catch (err) {
      console.error(err);
      toast.error("Error communicating with server.");
    }
  };

  const openReschedulePanel = (campaign: Campaign) => {
    setSelectedCampaign(campaign);
    if (campaign.scheduledAt) {
      const dateObj = new Date(campaign.scheduledAt);
      setNewDate(dateObj.toLocaleDateString("en-CA"));
      setNewTime(
        `${String(dateObj.getHours()).padStart(2, "0")}:${String(dateObj.getMinutes()).padStart(2, "0")}`
      );
    } else {
      setNewDate("");
      setNewTime("");
    }
    setIsRescheduling(true);
  };

  // Calendar Logic
  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();

  const firstDayIndex = new Date(year, month, 1).getDay();
  const totalDays = new Date(year, month + 1, 0).getDate();
  const prevMonthTotalDays = new Date(year, month, 0).getDate();

  const handlePrevMonth = () => {
    setCurrentDate(new Date(year, month - 1, 1));
  };
  const handleNextMonth = () => {
    setCurrentDate(new Date(year, month + 1, 1));
  };

  const getCampaignsForDate = (day: number, isCurrentMonth: boolean) => {
    if (!isCurrentMonth) return [];
    const dateStr = `${year}-${String(month + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
    return campaigns.filter(c => {
      if (!c.scheduledAt) return false;
      const cDateStr = new Date(c.scheduledAt).toLocaleDateString("en-CA");
      return cDateStr === dateStr;
    });
  };

  // Render Calendar Grid Cells
  const calendarCells = [];
  // Prev month overflow cells
  for (let i = firstDayIndex - 1; i >= 0; i--) {
    const day = prevMonthTotalDays - i;
    calendarCells.push({ day, currentMonth: false, key: `prev-${day}` });
  }
  // Current month cells
  for (let i = 1; i <= totalDays; i++) {
    calendarCells.push({ day: i, currentMonth: true, key: `curr-${i}` });
  }
  // Next month overflow cells
  const remaining = 42 - calendarCells.length;
  for (let i = 1; i <= remaining; i++) {
    calendarCells.push({ day: i, currentMonth: false, key: `next-${i}` });
  }

  // Filtered campaigns for List View
  const filteredCampaigns = campaigns.filter(c => {
    const matchesSearch = c.name?.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesPlatform =
      platformFilter === "all" ||
      c.platforms?.some(p => p.toLowerCase().includes(platformFilter));
    return matchesSearch && matchesPlatform;
  });

  const monthNames = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
  ];

  return (
    <div className="vxsch-shell">
      <style dangerouslySetInnerHTML={{ __html: STYLE }} />
      <DashboardSidebar userName={userName} userInitial={userInitial} />

      <div className="vxsch-main">
        <DashboardTopBar userName={userName} userInitial={userInitial} />

        <div className="vxsch-scroll">
          <div className="vxsch-orb1" />
          <div className="vxsch-orb2" />

          {/* Hero Banner */}
          <motion.div
            initial={{ opacity: 0, y: -12 }}
            animate={{ opacity: 1, y: 0 }}
            className="vxup-hero"
            style={{ marginBottom: 30 }}
          >
            <div className="vxup-hero-line" style={{ background: "linear-gradient(90deg, #a78bfa, #f472b6)" }} />
            <div>
              <div className="vxup-hero-title">Scheduled <span>Queue & Calendar</span></div>
              <div className="vxup-hero-sub">Monitor and reschedule upcoming posts across all channels.</div>
              <div className="vxup-hero-badge"><Sparkles size={11} /> Live Scheduling Engine</div>
            </div>
            <button className="vxup-btn-pri" style={{ width: "auto", padding: "10px 18px" }} onClick={() => navigate("/create-post")}>
              <Plus size={14} /> Schedule New Post
            </button>
          </motion.div>

          {/* View Toggles & Search Controls */}
          <div className="vxsch-controls">
            <div className="vxsch-view-toggles">
              <button
                className={`vxsch-view-btn ${viewMode === "calendar" ? "active" : ""}`}
                onClick={() => setViewMode("calendar")}
              >
                <CalendarIcon size={14} /> Calendar View
              </button>
              <button
                className={`vxsch-view-btn ${viewMode === "list" ? "active" : ""}`}
                onClick={() => setViewMode("list")}
              >
                <Layers size={14} /> Queue List
              </button>
            </div>

            {viewMode === "list" && (
              <div className="vxsch-list-filters">
                <div className="vxsch-filter-input-wrap">
                  <Search size={14} color="#475569" style={{ marginRight: 8 }} />
                  <input
                    type="text"
                    placeholder="Search posts..."
                    className="vxsch-filter-input"
                    value={searchQuery}
                    onChange={e => setSearchQuery(e.target.value)}
                  />
                </div>
                <select
                  className="vxsch-filter-select"
                  value={platformFilter}
                  onChange={e => setPlatformFilter(e.target.value)}
                >
                  <option value="all">All Platforms</option>
                  <option value="instagram">Instagram</option>
                  <option value="facebook">Facebook</option>
                  <option value="twitter">X / Twitter</option>
                  <option value="linkedin">LinkedIn</option>
                  <option value="youtube">YouTube</option>
                </select>
              </div>
            )}
          </div>

          {loading ? (
            <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", minHeight: 300, gap: 12 }}>
              <RefreshCw size={24} className="animate-spin" style={{ color: "#a78bfa" }} />
              <div style={{ fontSize: 14, color: "#64748b" }}>Loading scheduled queue...</div>
            </div>
          ) : campaigns.length === 0 ? (
            <div className="vxsch-empty">
              <div className="vxsch-empty-icon"><CalendarIcon size={26} /></div>
              <h3 style={{ fontSize: 18, fontWeight: 800, marginBottom: 8 }}>No Scheduled Posts</h3>
              <p style={{ fontSize: 13, color: "#64748b", lineHeight: 1.6, marginBottom: 24 }}>
                You don't have any posts or campaigns currently queued up. Get started by publishing or scheduling a creative post.
              </p>
              <button className="vxsch-btn-pri" onClick={() => navigate("/create-post")}>
                Create Scheduled Post
              </button>
            </div>
          ) : viewMode === "calendar" ? (
            /* ── CALENDAR VIEW ── */
            <motion.div
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              className="vxsch-cal-container"
            >
              <div className="vxsch-cal-header">
                <div className="vxsch-month-title">
                  {monthNames[month]} {year}
                </div>
                <div className="vxsch-month-nav">
                  <button className="vxsch-nav-btn" onClick={handlePrevMonth}><ChevronLeft size={16} /></button>
                  <button className="vxsch-nav-btn" onClick={handleNextMonth}><ChevronRight size={16} /></button>
                </div>
              </div>

              <div className="vxsch-cal-grid">
                {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map(day => (
                  <div key={day} className="vxsch-day-label">{day}</div>
                ))}

                {calendarCells.map(cell => {
                  const dayCampaigns = getCampaignsForDate(cell.day, cell.currentMonth);
                  const isToday =
                    cell.currentMonth &&
                    cell.day === new Date().getDate() &&
                    month === new Date().getMonth() &&
                    year === new Date().getFullYear();

                  return (
                    <div
                      key={cell.key}
                      className={`vxsch-day-cell ${!cell.currentMonth ? "prev-next" : ""} ${isToday ? "today" : ""}`}
                      onClick={() => {
                        if (cell.currentMonth && dayCampaigns.length > 0) {
                          setSelectedDay(cell.day);
                        }
                      }}
                    >
                      <div className="vxsch-day-number">{cell.day}</div>
                      {cell.currentMonth && dayCampaigns.length > 0 && (
                        <div className="vxsch-cell-posts">
                          {dayCampaigns.slice(0, 2).map(c => (
                            <div
                              key={c.id}
                              className="vxsch-cell-post"
                              style={{
                                background: `rgba(255,255,255,0.02)`,
                                color: getPlatformColor(c.platforms?.[0] || ""),
                                borderColor: `${getPlatformColor(c.platforms?.[0] || "")}20`
                              }}
                            >
                              <span>{getPlatformIcon(c.platforms?.[0] || "")}</span>
                              <span style={{ textOverflow: "ellipsis", overflow: "hidden" }}>{c.name}</span>
                            </div>
                          ))}
                          {dayCampaigns.length > 2 && (
                            <div className="vxsch-cell-more">+{dayCampaigns.length - 2} more</div>
                          )}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </motion.div>
          ) : (
            /* ── CHRONOLOGICAL QUEUE LIST ── */
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="vxsch-list-container"
            >
              {filteredCampaigns.length === 0 ? (
                <div style={{ textAlign: "center", padding: "60px 20px", color: "#64748b" }}>
                  No posts match your filters.
                </div>
              ) : (
                filteredCampaigns.map(c => {
                  const scheduleDateObj = c.scheduledAt ? new Date(c.scheduledAt) : null;
                  const timeFormatted = scheduleDateObj
                    ? scheduleDateObj.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
                    : "";
                  const dateFormatted = scheduleDateObj
                    ? scheduleDateObj.toLocaleDateString([], { month: "short", day: "numeric", year: "numeric" })
                    : "";

                  return (
                    <div key={c.id} className="vxsch-q-card">
                      <div className="vxsch-q-info">
                        <div className="vxsch-q-media">
                          {c.adImage ? (
                            <img src={c.adImage} alt="Creative" />
                          ) : (
                            <CalendarIcon size={20} color="#a78bfa" style={{ opacity: 0.6 }} />
                          )}
                        </div>
                        <div className="vxsch-q-details">
                          <h4 className="vxsch-q-title">{c.name}</h4>
                          <div className="vxsch-q-meta">
                            <span className="vxsch-q-time-pill">
                              <Clock size={12} /> {dateFormatted} at {timeFormatted}
                            </span>
                            <span>Budget: {c.budget}</span>
                            <div className="vxsch-q-platform-row">
                              {c.platforms?.map(p => (
                                <span
                                  key={p}
                                  className="vxsch-q-platform-pill"
                                  style={{
                                    background: `rgba(255,255,255,0.02)`,
                                    color: getPlatformColor(p),
                                    borderColor: `${getPlatformColor(p)}20`
                                  }}
                                >
                                  {getPlatformIcon(p)} {p}
                                </span>
                              ))}
                            </div>
                          </div>
                        </div>
                      </div>

                      <div className="vxsch-q-actions">
                        <button
                          className="vxsch-q-btn"
                          title="Reschedule"
                          onClick={() => openReschedulePanel(c)}
                        >
                          <Edit3 size={14} />
                        </button>
                        <button
                          className="vxsch-q-btn danger"
                          title="Cancel Schedule"
                          onClick={() => handleDeleteCampaign(c.id)}
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>
                    </div>
                  );
                })
              )}
            </motion.div>
          )}

          {/* ── MODAL: DAY DETAIL VIEW ── */}
          <AnimatePresence>
            {selectedDay !== null && (
              <div className="vxsch-modal-overlay" onClick={() => setSelectedDay(null)}>
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  className="vxsch-modal-content"
                  onClick={e => e.stopPropagation()}
                >
                  <X className="vxsch-modal-close" size={18} onClick={() => setSelectedDay(null)} />
                  <h3 className="vxsch-modal-title">
                    <CalendarIcon size={18} color="#a78bfa" />
                    Scheduled on {monthNames[month]} {selectedDay}, {year}
                  </h3>

                  <div className="vxsch-det-list">
                    {getCampaignsForDate(selectedDay, true).map(c => {
                      const timeStr = c.scheduledAt
                        ? new Date(c.scheduledAt).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
                        : "00:00";

                      return (
                        <div key={c.id} className="vxsch-det-item">
                          <div style={{ minWidth: 0, flex: 1 }}>
                            <div style={{ fontWeight: 700, fontSize: 14, color: "#f1f5f9", textOverflow: "ellipsis", overflow: "hidden", whiteSpace: "nowrap" }}>
                              {c.name}
                            </div>
                            <div style={{ display: "flex", gap: 8, alignItems: "center", fontSize: 11, color: "#a78bfa", marginTop: 4 }}>
                              <Clock size={11} /> {timeStr}
                            </div>
                          </div>
                          <div style={{ display: "flex", gap: 6 }}>
                            <button
                              className="vxsch-q-btn"
                              onClick={() => {
                                setSelectedDay(null);
                                openReschedulePanel(c);
                              }}
                            >
                              <Edit3 size={13} />
                            </button>
                            <button
                              className="vxsch-q-btn danger"
                              onClick={() => handleDeleteCampaign(c.id)}
                            >
                              <Trash2 size={13} />
                            </button>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </motion.div>
              </div>
            )}
          </AnimatePresence>

          {/* ── MODAL: RESCHEDULE PANEL ── */}
          <AnimatePresence>
            {isRescheduling && selectedCampaign && (
              <div className="vxsch-modal-overlay" onClick={() => setIsRescheduling(false)}>
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  className="vxsch-modal-content"
                  onClick={e => e.stopPropagation()}
                >
                  <X className="vxsch-modal-close" size={18} onClick={() => setIsRescheduling(false)} />
                  <h3 className="vxsch-modal-title">
                    <Clock size={18} color="#a78bfa" />
                    Reschedule Post
                  </h3>
                  <p style={{ fontSize: 13, color: "#64748b", marginBottom: 20 }}>
                    Update the target date and time for <strong>{selectedCampaign.name}</strong>.
                  </p>

                  <div className="vxsch-input-grid">
                    <div>
                      <label className="vxsch-lbl">Date</label>
                      <input
                        type="date"
                        min={todayStr}
                        className="vxsch-input"
                        value={newDate}
                        onChange={e => {
                          const val = e.target.value;
                          if (val && val < todayStr) {
                            toast.error("Cannot select a date in the past");
                            setNewDate(todayStr);
                          } else {
                            setNewDate(val);
                          }
                        }}
                      />
                    </div>
                    <div>
                      <label className="vxsch-lbl">Time</label>
                      <input
                        type="time"
                        className="vxsch-input"
                        value={newTime}
                        onChange={e => {
                          const val = e.target.value;
                          if (newDate === todayStr && val) {
                            const currentMinTime = `${String(new Date().getHours()).padStart(2, '0')}:${String(new Date().getMinutes()).padStart(2, '0')}`;
                            if (val < currentMinTime) {
                              toast.error("Cannot select a time in the past");
                              setNewTime(currentMinTime);
                              return;
                            }
                          }
                          setNewTime(val);
                        }}
                      />
                    </div>
                  </div>

                  <div style={{ display: "flex", gap: 12, justifyContent: "flex-end", marginTop: 24 }}>
                    <button className="vxsch-btn-ghost" onClick={() => setIsRescheduling(false)}>
                      Cancel
                    </button>
                    <button className="vxsch-btn-pri" onClick={handleRescheduleSubmit}>
                      Save Schedule
                    </button>
                  </div>
                </motion.div>
              </div>
            )}
          </AnimatePresence>

        </div>
      </div>
    </div>
  );
}
