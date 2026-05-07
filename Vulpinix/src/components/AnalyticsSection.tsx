import { useState } from "react";
import { motion } from "framer-motion";
import { TrendingUp, Heart, MessageCircle, BarChart2, Eye } from "lucide-react";
import { SiInstagram, SiFacebook, SiYoutube, SiTiktok } from "react-icons/si";
import { FaLinkedin } from "react-icons/fa";
import { Area, AreaChart, ResponsiveContainer, Tooltip, XAxis, YAxis, CartesianGrid } from "recharts";
import { PlatformFlipSlider } from "./PlatformFlipSlider";

export function AnalyticsSection() {
  const [flipped, setFlipped] = useState(false);

  const platforms = [
    {
      name: "Instagram", icon: SiInstagram, barColor: "#a78bfa",
      likes: 8.4, likesSuffix: "M", comments: 1.2, commentsSuffix: "M", growth: "+14.5%",
      reach: "24.1M", impressions: "38.5M",
      chart: [1200,1800,1400,2200,2800,3100,4200,3800,5100,6200],
    },
    {
      name: "Facebook", icon: SiFacebook, barColor: "#38bdf8",
      likes: 3.2, likesSuffix: "M", comments: 890, commentsSuffix: "K", growth: "+8.2%",
      reach: "12.4M", impressions: "19.2M",
      chart: [800,900,750,1100,1300,1200,1600,1900,2100,2400],
    },
    {
      name: "LinkedIn", icon: FaLinkedin, barColor: "#4ade80",
      likes: 540, likesSuffix: "K", comments: 120, commentsSuffix: "K", growth: "+22.4%",
      reach: "3.8M", impressions: "5.9M",
      chart: [200,280,310,260,400,520,480,610,720,880],
    },
    {
      name: "YouTube", icon: SiYoutube, barColor: "#ef4444",
      likes: 12.5, likesSuffix: "M", comments: 2.1, commentsSuffix: "M", growth: "+31.2%",
      reach: "45.8M", impressions: "82.3M",
      chart: [3000, 4200, 3800, 5500, 7200, 8100, 9400, 11200, 13500, 15800],
    },
    
  ];

  const stats = [
    { icon: TrendingUp, label: "Total Engagement", value: "82%",   delta: "↑ 12% this week", iconColor: "#a78bfa" },
    { icon: Heart,      label: "Total Likes",      value: "12.1M", delta: "↑ 8% this week",  iconColor: "#22d3ee" },
    { icon: MessageCircle, label: "Total Comments", value: "2.2M", delta: "↑ 15% this week", iconColor: "#60a5fa" },
    
  ];

  const chartData = [
    { name: "Jan", engagement: 4000 },
    { name: "Feb", engagement: 5200 },
    { name: "Mar", engagement: 4800 },
    { name: "Apr", engagement: 6900 },
    { name: "May", engagement: 8100 },
    { name: "Jun", engagement: 9500 },
    { name: "Jul", engagement: 12400 },
  ];

  return (
    <section style={{ padding: "clamp(60px, 8vw, 100px) 16px", position: "relative" }}>
      <style>{`
        @keyframes sparkline-grow { 0%{transform:scaleY(0);opacity:0} 100%{transform:scaleY(1);opacity:1} }
        
        .vx-bento-wide { grid-column: 1 / -1; }
        
        @media (min-width: 1024px) { 
          .vx-bento-wide { grid-column: span 2 !important; }
          .vx-main-grid { grid-template-columns: 1fr 2fr !important; }
        }
        
        @media (max-width: 768px) {
          .vx-card-scene { height: 120px !important; }
          .vx-stat-card { height: 120px !important; }
        }

        @media (max-width: 480px) {
          .vx-reveal h2 { font-size: 1.5rem !important; }
          .vx-reveal p { font-size: 15px !important; }
          .vx-bento-wide { padding: 20px !important; }
        }

        .vx-card-scene { perspective: 1200px; }
        .vx-card-inner {
          position: relative;
          width: 100%; height: 100%;
          transition: transform 0.7s cubic-bezier(0.4,0,0.2,1);
          transform-style: preserve-3d;
        }
        .vx-card-inner.flipped { transform: rotateY(180deg); }
        .vx-card-front, .vx-card-back {
          position: absolute; inset: 0;
          backface-visibility: hidden;
          -webkit-backface-visibility: hidden;
          border-radius: 24px;
          overflow: hidden;
        }
        .vx-card-back { transform: rotateY(180deg); }
        .vx-spark-bar {
          display: inline-block;
          width: 6px;
          border-radius: 3px 3px 0 0;
          background: currentColor;
          transition: height 0.6s ease;
          vertical-align: bottom;
        }
      `}</style>

      <div style={{ maxWidth: 1200, margin: "0 auto" }}>
        {/* Heading */}
        <div className="vx-reveal" style={{ textAlign: "center", marginBottom: "clamp(30px, 5vw, 60px)" }}>
          <div style={{ color: "var(--vx-text-muted)", fontSize: 13, fontWeight: 800, letterSpacing: "0.2em", textTransform: "uppercase", marginBottom: 16 }}>
            Command Center
          </div>
          <h2 style={{ fontSize: "clamp(1.8rem,4vw,2.8rem)", fontWeight: 800, color: "var(--vx-text-primary)", lineHeight: 1.15, letterSpacing: "-0.02em", marginBottom: 16 }}>
            Smart Analytics Dashboard
          </h2>
          <p style={{ color: "var(--vx-text-secondary)", fontSize: "clamp(15px, 2vw, 18px)", maxWidth: 600, margin: "0 auto", lineHeight: 1.6 }}>
            Track your performance, audience growth, and engagement metrics in real-time across all your connected social platforms.
          </p>
        </div>

        {/* Main Chart */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(min(100%, 340px),1fr))", gap: 24, marginBottom: 24 }}>
          <div className="vx-reveal vx-bento-wide" style={{ background: "var(--vx-bg-card)", border: "1px solid var(--vx-border)", borderRadius: 24, padding: "clamp(20px, 4vw, 36px)", boxShadow: "0 24px 50px rgba(0,0,0,0.2)", display: "flex", flexDirection: "column" }}>
            <div style={{ marginBottom: 32, display: "flex", justifyContent: "space-between", alignItems: "flex-start", flexWrap: "wrap", gap: 16 }}>
              <div>
                <h3 style={{ color: "var(--vx-text-primary)", fontSize: 22, fontWeight: 800, marginBottom: 6 }}>Audience Growth</h3>
                <p style={{ color: "var(--vx-text-muted)", fontSize: 15, fontWeight: 500 }}>Total engagement across all managed platforms</p>
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: 8, background: "var(--vx-bg-input)", padding: "8px 16px", borderRadius: 12, border: "1px solid var(--vx-border)" }}>
                <BarChart2 size={16} style={{ color: "#38bdf8" }} />
                <span style={{ fontSize: 14, color: "var(--vx-text-secondary)", fontWeight: 600 }}>Last 7 Months</span>
              </div>
            </div>
            <div style={{ flex: 1, minHeight: 320, width: "100%" }}>
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <defs>
                    <linearGradient id="colorEngagement" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#38bdf8" stopOpacity={0.4}/>
                      <stop offset="95%" stopColor="#38bdf8" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="var(--vx-border)" vertical={false} />
                  <XAxis dataKey="name" stroke="var(--vx-text-muted)" fontSize={13} tickLine={false} axisLine={false} dy={10} />
                  <YAxis stroke="var(--vx-text-muted)" fontSize={13} tickLine={false} axisLine={false} tickFormatter={v => `${v/1000}k`} />
                  <Tooltip contentStyle={{ background: "rgba(15,23,42,0.9)", backdropFilter: "blur(12px)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 16, boxShadow: "0 20px 40px rgba(0,0,0,0.5)", padding: "12px 20px" }} itemStyle={{ color: "#fff", fontWeight: 700, fontSize: 16 }} labelStyle={{ color: "rgba(255,255,255,0.6)", marginBottom: 4, fontSize: 13, fontWeight: 600, textTransform: "uppercase" }} />
                  <Area type="monotone" dataKey="engagement" stroke="#38bdf8" strokeWidth={4} fillOpacity={1} fill="url(#colorEngagement)" activeDot={{ r: 6, fill: "#fff", stroke: "#38bdf8", strokeWidth: 3 }} />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        {/* Stats & Platforms Paired Layout */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(min(100%, 300px), 1fr))", gap: "clamp(16px, 3vw, 24px)" }}>
          {stats.map((s, i) => {
            const p = platforms[i];
            const frequencyData = p ? p.chart.map((v, idx) => ({ x: idx, y: v })) : [];
            
            return (
              <div key={i} style={{ display: "contents" }}>
                {/* Stat Card */}
                <div
                  className={`vx-reveal vx-delay-${i+1} vx-stat-card`}
                  style={{ background: "var(--vx-bg-card)", border: "1px solid var(--vx-border)", borderRadius: 20, padding: "clamp(16px, 4vw, 24px) clamp(20px, 4vw, 28px)", display: "flex", alignItems: "center", justifyContent: "space-between", transition: "all 0.3s ease", position: "relative", overflow: "hidden", height: 140, gridColumn: p ? "auto" : "1 / -1" }}
                  onMouseEnter={e => { const el = e.currentTarget as HTMLElement; el.style.transform="translateY(-4px)"; el.style.borderColor=`${s.iconColor}50`; el.style.boxShadow=`0 12px 24px ${s.iconColor}15`; }}
                  onMouseLeave={e => { const el = e.currentTarget as HTMLElement; el.style.transform="translateY(0)"; el.style.borderColor="var(--vx-border)"; el.style.boxShadow="none"; }}
                >
                  <div style={{ position: "absolute", inset: 0, background: `linear-gradient(135deg,${s.iconColor}10,transparent)`, opacity: 0.5, pointerEvents: "none" }} />
                  <div>
                    <div style={{ color: "var(--vx-text-muted)", fontSize: 11, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.05em", marginBottom: 4 }}>{s.label}</div>
                    <div style={{ fontSize: "clamp(24px, 5vw, 32px)", fontWeight: 800, color: "var(--vx-text-primary)", lineHeight: 1, marginBottom: 4 }}>{s.value}</div>
                    <div style={{ color: s.iconColor, fontSize: 13, fontWeight: 600 }}>{s.delta}</div>
                  </div>
                  <div style={{ width: 48, height: 48, borderRadius: 14, background: `${s.iconColor}15`, border: `1px solid ${s.iconColor}30`, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                    <s.icon size={22} style={{ color: s.iconColor }} />
                  </div>
                </div>

                {/* Platform Card (if exists) */}
                {p && (
                  <div className={`vx-reveal vx-delay-${i+2} vx-card-scene`} style={{ height: 140 }}>
                    <div className={`vx-card-inner${flipped ? " flipped" : ""}`}>
                      {/* FRONT */}
                      <div className="vx-card-front" style={{ background: "var(--vx-bg-card)", border: "1px solid var(--vx-border)", padding: "16px 20px", borderRadius: 20, boxShadow: "var(--vx-shadow-card)", display: "flex", alignItems: "center", gap: 16 }}>
                        <div style={{ width: 44, height: 44, borderRadius: 12, display: "flex", alignItems: "center", justifyContent: "center", background: "var(--vx-bg-input)", border: "1px solid var(--vx-border)", color: p.barColor, flexShrink: 0 }}>
                          <p.icon size={20} />
                        </div>
                        <div style={{ flex: 1 }}>
                          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 4 }}>
                            <h4 style={{ color: "var(--vx-text-primary)", fontSize: 16, fontWeight: 800 }}>{p.name}</h4>
                            <div style={{ color: "#10b981", fontSize: 12, fontWeight: 800, display: "flex", alignItems: "center", gap: 2 }}>
                              <TrendingUp size={12} /> {p.growth}
                            </div>
                          </div>
                          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}>
                            <div style={{ color: "var(--vx-text-primary)", fontSize: 14, fontWeight: 700 }}>{p.likes}{p.likesSuffix} <span style={{ fontSize: 9, color: "var(--vx-text-muted)", textTransform: "uppercase" }}>Likes</span></div>
                            <div style={{ color: "var(--vx-text-primary)", fontSize: 14, fontWeight: 700 }}>{p.comments}{p.commentsSuffix} <span style={{ fontSize: 9, color: "var(--vx-text-muted)", textTransform: "uppercase" }}>Comm.</span></div>
                          </div>
                        </div>
                      </div>

                      {/* BACK */}
                      <div className="vx-card-back" style={{ background: `linear-gradient(135deg,rgba(10,15,28,0.98),rgba(15,23,42,0.98))`, border: `1px solid ${p.barColor}40`, padding: "12px 16px", borderRadius: 20, display: "flex", alignItems: "center", gap: 12, boxShadow: `0 0 40px ${p.barColor}10` }}>
                        <div style={{ flex: 1, height: "100%", position: "relative" }}>
                          <ResponsiveContainer width="100%" height="100%">
                            <AreaChart data={frequencyData} margin={{ top: 2, right: 0, left: 0, bottom: 2 }}>
                              <defs>
                                <linearGradient id={`gradient-${i}`} x1="0" y1="0" x2="0" y2="1">
                                  <stop offset="5%" stopColor={p.barColor} stopOpacity={0.4}/>
                                  <stop offset="95%" stopColor={p.barColor} stopOpacity={0}/>
                                </linearGradient>
                              </defs>
                              <Area type="monotone" dataKey="y" stroke={p.barColor} strokeWidth={2} fillOpacity={1} fill={`url(#gradient-${i})`} isAnimationActive={flipped} />
                            </AreaChart>
                          </ResponsiveContainer>
                        </div>
                        <div style={{ width: "clamp(80px, 15vw, 100px)", flexShrink: 0 }}>
                          <div style={{ marginBottom: 8 }}>
                            <div style={{ color: "var(--vx-text-muted)", fontSize: 8, fontWeight: 800, textTransform: "uppercase" }}>Reach</div>
                            <div style={{ color: "var(--vx-text-primary)", fontSize: "clamp(12px, 3vw, 14px)", fontWeight: 800 }}>{p.reach}</div>
                          </div>
                          <div>
                            <div style={{ color: "var(--vx-text-muted)", fontSize: 8, fontWeight: 800, textTransform: "uppercase" }}>Impr.</div>
                            <div style={{ color: "var(--vx-text-primary)", fontSize: "clamp(12px, 3vw, 14px)", fontWeight: 800 }}>{p.impressions}</div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Slider at the bottom spanning full width */}
        <div style={{ width: "100%", maxWidth: 400, margin: "clamp(30px, 6vw, 50px) auto 0" }}>
          <PlatformFlipSlider flipped={flipped} onFlip={setFlipped} />
        </div>
      </div>
    </section>
  );
}
