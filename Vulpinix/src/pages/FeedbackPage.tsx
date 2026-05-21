import { useState } from "react";
import { useNavigate } from "react-router";
import { motion, AnimatePresence } from "framer-motion";
import {
  Star, MessageSquare, Send, CheckCircle2,
  Smile, Frown, Meh, Zap, Bug, Lightbulb, Heart
} from "lucide-react";
import { DashboardSidebar } from "../components/DashboardSidebar";
import { DashboardTopBar } from "../components/DashboardTopBar";

const S = `
  @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800;900&display=swap');
  .vxfb-shell { display: flex; height: 100vh; background: #070b12; overflow: hidden; font-family: 'Inter', sans-serif; }
  .vxfb-main { flex: 1; display: flex; flex-direction: column; overflow: hidden; }
  .vxfb-scroll { flex: 1; overflow-y: auto; overflow-x: hidden; padding: 36px 40px 100px; }
  .vxfb-scroll::-webkit-scrollbar { width: 6px; }
  .vxfb-scroll::-webkit-scrollbar-thumb { background: rgba(255,255,255,0.08); border-radius: 3px; }
  .vxfb-orb1 { position: fixed; pointer-events: none; border-radius: 50%; z-index: 0; width: 600px; height: 600px; top: -180px; right: -100px; background: radial-gradient(circle, rgba(167,139,250,0.09) 0%, transparent 70%); }
  .vxfb-orb2 { position: fixed; pointer-events: none; border-radius: 50%; z-index: 0; width: 500px; height: 500px; bottom: -180px; left: -80px; background: radial-gradient(circle, rgba(244,114,182,0.06) 0%, transparent 70%); }
  .vxfb-inner { max-width: 780px; margin: 0 auto; position: relative; z-index: 1; }

  /* Hero */
  .vxfb-hero { margin-bottom: 36px; }
  .vxfb-hero-badge { display: inline-flex; align-items: center; gap: 6px; padding: 5px 14px; border-radius: 20px; background: rgba(167,139,250,0.1); border: 1px solid rgba(167,139,250,0.2); font-size: 11px; font-weight: 700; color: #a78bfa; margin-bottom: 16px; }
  .vxfb-hero-title { font-size: 34px; font-weight: 900; color: #f1f5f9; letter-spacing: -0.03em; margin-bottom: 8px; }
  .vxfb-hero-title span { background: linear-gradient(135deg, #a78bfa, #f472b6); -webkit-background-clip: text; -webkit-text-fill-color: transparent; }
  .vxfb-hero-sub { font-size: 15px; color: #64748b; }

  /* Card */
  .vxfb-card { background: rgba(255,255,255,0.025); border: 1px solid rgba(255,255,255,0.07); border-radius: 26px; padding: 36px; margin-bottom: 22px; }
  .vxfb-section-title { font-size: 13px; font-weight: 800; color: #94a3b8; text-transform: uppercase; letter-spacing: 0.07em; margin-bottom: 18px; display: flex; align-items: center; gap: 8px; }

  /* Stars */
  .vxfb-stars { display: flex; gap: 10px; }
  .vxfb-star-btn { width: 52px; height: 52px; border-radius: 16px; border: 1px solid rgba(255,255,255,0.08); background: rgba(255,255,255,0.03); display: flex; align-items: center; justify-content: center; cursor: pointer; transition: all 0.2s; }
  .vxfb-star-btn:hover, .vxfb-star-btn.filled { border-color: rgba(251,191,36,0.35); background: rgba(251,191,36,0.1); transform: scale(1.1); }
  .vxfb-star-btn.filled svg { color: #fbbf24; }
  .vxfb-star-label { font-size: 13px; color: #64748b; margin-top: 12px; min-height: 20px; }

  /* Mood */
  .vxfb-mood-row { display: flex; gap: 12px; flex-wrap: wrap; }
  .vxfb-mood-btn { display: flex; flex-direction: column; align-items: center; gap: 8px; padding: 16px 20px; border-radius: 18px; border: 1px solid rgba(255,255,255,0.07); background: rgba(255,255,255,0.02); cursor: pointer; transition: all 0.22s; color: #64748b; font-size: 12px; font-weight: 700; min-width: 88px; }
  .vxfb-mood-btn:hover { background: rgba(255,255,255,0.05); color: #e2e8f0; transform: translateY(-2px); }
  .vxfb-mood-btn.selected { border-color: rgba(167,139,250,0.35); background: rgba(167,139,250,0.08); color: #a78bfa; }

  /* Category chips */
  .vxfb-chips { display: flex; flex-wrap: wrap; gap: 10px; }
  .vxfb-chip { display: inline-flex; align-items: center; gap: 6px; padding: 8px 16px; border-radius: 12px; border: 1px solid rgba(255,255,255,0.08); background: rgba(255,255,255,0.02); font-size: 13px; font-weight: 600; color: #94a3b8; cursor: pointer; transition: all 0.2s; }
  .vxfb-chip:hover { border-color: rgba(167,139,250,0.25); background: rgba(167,139,250,0.06); color: #c4b5fd; }
  .vxfb-chip.selected { border-color: rgba(167,139,250,0.4); background: rgba(167,139,250,0.12); color: #a78bfa; }

  /* Textarea */
  .vxfb-textarea { width: 100%; min-height: 140px; background: rgba(255,255,255,0.025); border: 1px solid rgba(255,255,255,0.08); border-radius: 16px; padding: 16px 18px; color: #f1f5f9; font-size: 14px; font-family: 'Inter', sans-serif; outline: none; resize: vertical; transition: border-color 0.2s; line-height: 1.6; box-sizing: border-box; }
  .vxfb-textarea:focus { border-color: rgba(167,139,250,0.4); }
  .vxfb-textarea::placeholder { color: #475569; }
  .vxfb-char-count { font-size: 11px; color: #475569; text-align: right; margin-top: 6px; }

  /* Email input */
  .vxfb-input { width: 100%; padding: 13px 16px; background: rgba(255,255,255,0.025); border: 1px solid rgba(255,255,255,0.08); border-radius: 14px; color: #f1f5f9; font-size: 14px; font-family: 'Inter', sans-serif; outline: none; transition: border-color 0.2s; box-sizing: border-box; }
  .vxfb-input:focus { border-color: rgba(167,139,250,0.4); }
  .vxfb-input::placeholder { color: #475569; }
  .vxfb-lbl { display: block; font-size: 11px; font-weight: 700; color: #64748b; text-transform: uppercase; letter-spacing: 0.07em; margin-bottom: 8px; }

  /* Buttons */
  .vxfb-btn-pri { display: inline-flex; align-items: center; gap: 9px; padding: 14px 28px; border-radius: 15px; background: linear-gradient(135deg, #a78bfa, #f472b6); border: none; color: #fff; font-weight: 800; font-size: 14px; cursor: pointer; box-shadow: 0 8px 24px rgba(167,139,250,0.3); transition: all 0.22s; font-family: 'Inter', sans-serif; }
  .vxfb-btn-pri:hover { transform: translateY(-2px); box-shadow: 0 14px 32px rgba(167,139,250,0.42); }
  .vxfb-btn-pri:disabled { opacity: 0.5; cursor: not-allowed; transform: none; }

  /* Success */
  .vxfb-success { text-align: center; padding: 60px 40px; }
  .vxfb-success-ic { width: 80px; height: 80px; border-radius: 24px; background: linear-gradient(135deg, rgba(34,197,94,0.15), rgba(167,139,250,0.15)); border: 1px solid rgba(34,197,94,0.25); display: flex; align-items: center; justify-content: center; margin: 0 auto 24px; }
`;

const STAR_LABELS = ["", "Poor", "Fair", "Good", "Great", "Excellent!"];

const CATEGORIES = [
  { label: "Bug Report",   icon: <Bug size={14} /> },
  { label: "Feature Idea", icon: <Lightbulb size={14} /> },
  { label: "Performance",  icon: <Zap size={14} /> },
  { label: "UI / Design",  icon: <Heart size={14} /> },
  { label: "General",      icon: <MessageSquare size={14} /> },
];

const MOODS = [
  { label: "Unhappy",   icon: <Frown size={24} />,   value: "unhappy" },
  { label: "Neutral",   icon: <Meh size={24} />,     value: "neutral" },
  { label: "Happy",     icon: <Smile size={24} />,   value: "happy" },
];

export default function FeedbackPage() {
  const navigate = useNavigate();

  const [userName]    = useState(() => {
    try { const u = JSON.parse(localStorage.getItem("userInfo") || "{}"); return u.name?.split(" ")[0] || "User"; } catch { return "User"; }
  });
  const [userInitial] = useState(() => userName[0]?.toUpperCase() || "U");

  const [rating,    setRating]    = useState(0);
  const [hovered,   setHovered]   = useState(0);
  const [mood,      setMood]      = useState("");
  const [category,  setCategory]  = useState("");
  const [message,   setMessage]   = useState("");
  const [email,     setEmail]     = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [loading,   setLoading]   = useState(false);

  const MAX = 500;
  const activeRating = hovered || rating;

  const handleSubmit = async () => {
    if (!rating || !message.trim()) return;
    setLoading(true);
    // Simulate a slight delay (replace with real API call if backend has /api/feedback)
    await new Promise(r => setTimeout(r, 900));
    setLoading(false);
    setSubmitted(true);
  };

  return (
    <div className="vxfb-shell">
      <style dangerouslySetInnerHTML={{ __html: S }} />
      <DashboardSidebar userName={userName} userInitial={userInitial} />
      <div className="vxfb-main">
        <DashboardTopBar userName={userName} userInitial={userInitial} />
        <div className="vxfb-scroll">
          <div className="vxfb-orb1" /><div className="vxfb-orb2" />
          <div className="vxfb-inner">

            {/* Hero */}
            <motion.div initial={{ opacity: 0, y: -14 }} animate={{ opacity: 1, y: 0 }} className="vxfb-hero">
              <div className="vxfb-hero-badge"><MessageSquare size={11} /> Feedback</div>
              <div className="vxfb-hero-title">Share Your <span>Experience</span></div>
              <div className="vxfb-hero-sub">Your input shapes the future of Vulpinix — every word counts.</div>
            </motion.div>

            <AnimatePresence mode="wait">
              {submitted ? (
                <motion.div
                  key="success"
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="vxfb-card"
                >
                  <div className="vxfb-success">
                    <div className="vxfb-success-ic"><CheckCircle2 size={36} color="#22c55e" /></div>
                    <div style={{ fontSize: 22, fontWeight: 900, color: "#f1f5f9", marginBottom: 10 }}>Thank you, {userName}!</div>
                    <div style={{ fontSize: 14, color: "#64748b", lineHeight: 1.7, maxWidth: 420, margin: "0 auto 28px" }}>
                      Your feedback has been received. We read every submission and use it to make Vulpinix better for everyone.
                    </div>
                    <div style={{ display: "flex", gap: 12, justifyContent: "center", flexWrap: "wrap" }}>
                      <button className="vxfb-btn-pri" onClick={() => navigate("/dashboard")}>Back to Dashboard</button>
                      <button
                        style={{ display: "inline-flex", alignItems: "center", gap: 8, padding: "13px 24px", borderRadius: 14, background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.09)", color: "#e2e8f0", fontWeight: 700, fontSize: 14, cursor: "pointer", fontFamily: "Inter, sans-serif" }}
                        onClick={() => { setSubmitted(false); setRating(0); setMood(""); setCategory(""); setMessage(""); setEmail(""); }}
                      >
                        Submit Another
                      </button>
                    </div>
                  </div>
                </motion.div>
              ) : (
                <motion.div key="form" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>

                  {/* Star Rating */}
                  <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.05 }} className="vxfb-card">
                    <div className="vxfb-section-title"><Star size={14} /> Overall Rating</div>
                    <div className="vxfb-stars">
                      {[1, 2, 3, 4, 5].map(n => (
                        <button
                          key={n}
                          id={`star-${n}`}
                          className={`vxfb-star-btn ${activeRating >= n ? "filled" : ""}`}
                          onMouseEnter={() => setHovered(n)}
                          onMouseLeave={() => setHovered(0)}
                          onClick={() => setRating(n)}
                        >
                          <Star size={22} fill={activeRating >= n ? "#fbbf24" : "none"} color={activeRating >= n ? "#fbbf24" : "#475569"} />
                        </button>
                      ))}
                    </div>
                    <div className="vxfb-star-label">
                      {activeRating > 0 ? STAR_LABELS[activeRating] : "Click to rate your experience"}
                    </div>
                  </motion.div>

                  {/* Mood */}
                  <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.10 }} className="vxfb-card">
                    <div className="vxfb-section-title"><Smile size={14} /> How are you feeling?</div>
                    <div className="vxfb-mood-row">
                      {MOODS.map(m => (
                        <button
                          key={m.value}
                          id={`mood-${m.value}`}
                          className={`vxfb-mood-btn ${mood === m.value ? "selected" : ""}`}
                          onClick={() => setMood(m.value)}
                        >
                          {m.icon}
                          {m.label}
                        </button>
                      ))}
                    </div>
                  </motion.div>

                  {/* Category */}
                  <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }} className="vxfb-card">
                    <div className="vxfb-section-title"><Lightbulb size={14} /> Feedback Category</div>
                    <div className="vxfb-chips">
                      {CATEGORIES.map(c => (
                        <button
                          key={c.label}
                          id={`cat-${c.label.toLowerCase().replace(/\s+/g, "-")}`}
                          className={`vxfb-chip ${category === c.label ? "selected" : ""}`}
                          onClick={() => setCategory(c.label)}
                        >
                          {c.icon} {c.label}
                        </button>
                      ))}
                    </div>
                  </motion.div>

                  {/* Message */}
                  <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.20 }} className="vxfb-card">
                    <div className="vxfb-section-title"><MessageSquare size={14} /> Your Message <span style={{ color: "#ef4444", marginLeft: 2 }}>*</span></div>
                    <textarea
                      id="feedback-message"
                      className="vxfb-textarea"
                      placeholder="Tell us what's on your mind — what's working well, what could be better, or any ideas you'd love to see..."
                      value={message}
                      maxLength={MAX}
                      onChange={e => setMessage(e.target.value)}
                    />
                    <div className="vxfb-char-count">{message.length}/{MAX}</div>
                  </motion.div>

                  {/* Email (optional) */}
                  <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.25 }} className="vxfb-card">
                    <label className="vxfb-lbl" htmlFor="feedback-email">Email for follow-up (optional)</label>
                    <input
                      id="feedback-email"
                      type="email"
                      className="vxfb-input"
                      placeholder="your@email.com"
                      value={email}
                      onChange={e => setEmail(e.target.value)}
                    />
                  </motion.div>

                  {/* Submit */}
                  <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.30 }} style={{ display: "flex", justifyContent: "flex-end", gap: 12 }}>
                    <button
                      style={{ display: "inline-flex", alignItems: "center", gap: 8, padding: "13px 24px", borderRadius: 14, background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.09)", color: "#94a3b8", fontWeight: 700, fontSize: 14, cursor: "pointer", fontFamily: "Inter, sans-serif", transition: "all 0.2s" }}
                      onClick={() => navigate(-1)}
                    >
                      Cancel
                    </button>
                    <button
                      className="vxfb-btn-pri"
                      id="submit-feedback"
                      disabled={!rating || !message.trim() || loading}
                      onClick={handleSubmit}
                    >
                      {loading
                        ? <><motion.span animate={{ rotate: 360 }} transition={{ duration: 1, repeat: Infinity, ease: "linear" }} style={{ display: "flex" }}><Send size={15} /></motion.span> Sending…</>
                        : <><Send size={15} /> Submit Feedback</>
                      }
                    </button>
                  </motion.div>

                </motion.div>
              )}
            </AnimatePresence>

          </div>
        </div>
      </div>
    </div>
  );
}
