import { motion } from "framer-motion";
import { TrendingUp, Heart, MessageCircle, BarChart2, Eye } from "lucide-react";
import { SiInstagram, SiFacebook, SiYoutube } from "react-icons/si";
import { FaLinkedin } from "react-icons/fa";
import { Area, AreaChart, ResponsiveContainer, Tooltip, XAxis, YAxis, CartesianGrid } from "recharts";

export function AnalyticsSection() {
  const platforms = [
    { name: "Instagram", icon: SiInstagram, barColor: "#a78bfa", likes: 8.4, likesSuffix: "M", comments: 1.2, commentsSuffix: "M", growth: "+14.5%" },
    { name: "Facebook",  icon: SiFacebook,  barColor: "#38bdf8", likes: 3.2, likesSuffix: "M", comments: 890, commentsSuffix: "K", growth: "+8.2%" },
    { name: "LinkedIn",  icon: FaLinkedin,  barColor: "#4ade80", likes: 540, likesSuffix: "K", comments: 120, commentsSuffix: "K", growth: "+22.4%" },
    { name: "YouTube",   icon: SiYoutube,   barColor: "#ef4444", likes: 12.5, likesSuffix: "M", comments: 2.1, commentsSuffix: "M", growth: "+31.2%" },
  ];

  const stats = [
    { icon: TrendingUp,    label: "Total Engagement", value: "82%",   delta: "↑ 12% this week", iconColor: "#a78bfa" },
    { icon: Heart,         label: "Total Likes",      value: "12.1M", delta: "↑ 8% this week",  iconColor: "#22d3ee" },
    { icon: MessageCircle, label: "Total Comments",   value: "2.2M",  delta: "↑ 15% this week", iconColor: "#60a5fa" },
    { icon: Eye,           label: "Total Reach",      value: "45.8M", delta: "↑ 24% this week", iconColor: "#4ade80" },
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
    <section style={{ padding: "100px 24px", position: "relative" }}>
      <style>{`
        @keyframes sparkline-grow {
          0% { transform: scaleY(0); opacity: 0; }
          100% { transform: scaleY(1); opacity: 1; }
        }
        @media (min-width: 1024px) {
          .vx-bento-wide { grid-column: span 2 !important; }
        }
      `}</style>

      <div style={{ maxWidth: 1200, margin: "0 auto" }}>
        {/* Heading */}
        <div className="vx-reveal" style={{ textAlign: "center", marginBottom: 60 }}>
          <div style={{ color: "var(--vx-text-muted)", fontSize: 13, fontWeight: 800, letterSpacing: "0.2em", textTransform: "uppercase", marginBottom: 16 }}>
            Command Center
          </div>
          <h2 style={{ fontSize: "clamp(1.8rem,4vw,2.8rem)", fontWeight: 800, color: "var(--vx-text-primary)", lineHeight: 1.15, letterSpacing: "-0.02em", marginBottom: 16 }}>
            Smart Analytics Dashboard
          </h2>
          <p style={{ color: "var(--vx-text-secondary)", fontSize: 18, maxWidth: 600, margin: "0 auto", lineHeight: 1.6 }}>
            Track your performance, audience growth, and engagement metrics in real-time across all your connected social platforms.
          </p>
        </div>

        {/* Top Bento Grid */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(340px, 1fr))", gap: 24, marginBottom: 24 }}>
          
          {/* Main Chart Card (Spans 2 columns on large screens) */}
          <div 
            className="vx-reveal vx-bento-wide"
            style={{ 
              gridColumn: "1 / -1", 
              background: "var(--vx-bg-card)", 
              border: "1px solid var(--vx-border)", 
              borderRadius: 24, 
              padding: "36px", 
              boxShadow: "0 24px 50px rgba(0,0,0,0.2)",
              display: "flex", 
              flexDirection: "column" 
            }}
          >
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
                  <YAxis stroke="var(--vx-text-muted)" fontSize={13} tickLine={false} axisLine={false} tickFormatter={(value) => `${value / 1000}k`} />
                  <Tooltip 
                    contentStyle={{ background: "rgba(15, 23, 42, 0.9)", backdropFilter: "blur(12px)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 16, boxShadow: "0 20px 40px rgba(0,0,0,0.5)", padding: "12px 20px" }} 
                    itemStyle={{ color: "#fff", fontWeight: 700, fontSize: 16 }}
                    labelStyle={{ color: "rgba(255,255,255,0.6)", marginBottom: 4, fontSize: 13, fontWeight: 600, textTransform: "uppercase" }}
                  />
                  <Area type="monotone" dataKey="engagement" stroke="#38bdf8" strokeWidth={4} fillOpacity={1} fill="url(#colorEngagement)" activeDot={{ r: 6, fill: "#fff", stroke: "#38bdf8", strokeWidth: 3 }} />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        {/* Stats & Platforms Grid */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: 24 }}>
          
          {/* Quick Stats Column */}
          <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
            {stats.map((s, i) => (
              <div
                key={s.label}
                className={`vx-reveal vx-delay-${i + 1}`}
                style={{ 
                  background: "var(--vx-bg-card)", 
                  border: "1px solid var(--vx-border)", 
                  borderRadius: 20, 
                  padding: "28px 32px", 
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  transition: "all 0.3s ease",
                  position: "relative",
                  overflow: "hidden"
                }}
                onMouseEnter={e => {
                  const el = e.currentTarget as HTMLElement;
                  el.style.transform = "translateY(-4px)";
                  el.style.borderColor = `${s.iconColor}50`;
                  el.style.boxShadow = `0 16px 32px ${s.iconColor}15`;
                }}
                onMouseLeave={e => {
                  const el = e.currentTarget as HTMLElement;
                  el.style.transform = "translateY(0)";
                  el.style.borderColor = "var(--vx-border)";
                  el.style.boxShadow = "none";
                }}
              >
                {/* Subtle gradient wash */}
                <div style={{ position: "absolute", inset: 0, background: `linear-gradient(135deg, ${s.iconColor}10, transparent)`, opacity: 0.5, pointerEvents: "none" }} />
                
                <div>
                  <div style={{ color: "var(--vx-text-muted)", fontSize: 13, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.05em", marginBottom: 8 }}>{s.label}</div>
                  <div style={{ fontSize: 38, fontWeight: 800, color: "var(--vx-text-primary)", lineHeight: 1, marginBottom: 8 }}>{s.value}</div>
                  <div style={{ color: s.iconColor, fontSize: 14, fontWeight: 600 }}>{s.delta}</div>
                </div>
                
                <div style={{ width: 64, height: 64, borderRadius: 18, background: `${s.iconColor}15`, border: `1px solid ${s.iconColor}30`, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                  <s.icon size={28} style={{ color: s.iconColor }} />
                </div>
              </div>
            ))}
          </div>

          {/* Platforms Grid (Takes up remaining columns) */}
          <div className="vx-bento-wide" style={{ gridColumn: "1 / -1", display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: 24 }}>
            {platforms.map((platform, index) => (
              <div
                key={index}
                className={`vx-reveal vx-delay-${index + 2}`}
                style={{ 
                  background: "var(--vx-bg-card)", 
                  border: "1px solid var(--vx-border)", 
                  borderRadius: 24, 
                  padding: "32px", 
                  transition: "all 0.4s cubic-bezier(0.4, 0, 0.2, 1)", 
                  display: "flex", 
                  flexDirection: "column",
                  position: "relative",
                  overflow: "hidden",
                  boxShadow: "var(--vx-shadow-card)"
                }}
                onMouseEnter={e => {
                  const el = e.currentTarget as HTMLElement;
                  el.style.borderColor = platform.barColor;
                  el.style.transform = "translateY(-6px)";
                  el.style.boxShadow = `0 20px 40px ${platform.barColor}15`;
                }}
                onMouseLeave={e => {
                  const el = e.currentTarget as HTMLElement;
                  el.style.borderColor = "var(--vx-border)";
                  el.style.transform = "translateY(0)";
                  el.style.boxShadow = "var(--vx-shadow-card)";
                }}
              >
                {/* Brand Accent Light */}
                <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: 4, background: `linear-gradient(90deg, ${platform.barColor}, transparent)` }} />
                <div style={{ position: "absolute", top: -20, right: -20, width: 100, height: 100, background: `radial-gradient(circle, ${platform.barColor}15 0%, transparent 70%)`, pointerEvents: "none" }} />

                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 32 }}>
                  <div style={{ width: 56, height: 56, borderRadius: 16, display: "flex", alignItems: "center", justifyContent: "center", background: "var(--vx-bg-input)", border: "1px solid var(--vx-border)", color: platform.barColor, boxShadow: `0 8px 16px ${platform.barColor}10` }}>
                    <platform.icon size={28} />
                  </div>
                  <div style={{ textAlign: "right" }}>
                    <div style={{ color: "var(--vx-text-muted)", fontSize: 11, fontWeight: 800, textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: 4 }}>Growth</div>
                    <div style={{ color: "#10b981", fontSize: 18, fontWeight: 800, display: "flex", alignItems: "center", gap: 4 }}>
                      <TrendingUp size={16} /> {platform.growth}
                    </div>
                  </div>
                </div>

                <div style={{ marginBottom: 32 }}>
                  <h4 style={{ color: "var(--vx-text-primary)", fontSize: 24, fontWeight: 800, marginBottom: 4 }}>{platform.name}</h4>
                  <p style={{ color: "var(--vx-text-muted)", fontSize: 14, fontWeight: 500 }}>Performance Snapshot</p>
                </div>

                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
                  <div style={{ padding: "16px 20px", borderRadius: 20, background: "var(--vx-bg-input)", border: "1px solid var(--vx-border)" }}>
                    <div style={{ color: "var(--vx-text-muted)", fontSize: 10, fontWeight: 800, textTransform: "uppercase", letterSpacing: "0.05em", marginBottom: 6 }}>Likes</div>
                    <div style={{ color: "var(--vx-text-primary)", fontSize: 22, fontWeight: 800 }}>
                      {platform.likes}{platform.likesSuffix}
                    </div>
                  </div>
                  <div style={{ padding: "16px 20px", borderRadius: 20, background: "var(--vx-bg-input)", border: "1px solid var(--vx-border)" }}>
                    <div style={{ color: "var(--vx-text-muted)", fontSize: 10, fontWeight: 800, textTransform: "uppercase", letterSpacing: "0.05em", marginBottom: 6 }}>Comments</div>
                    <div style={{ color: "var(--vx-text-primary)", fontSize: 22, fontWeight: 800 }}>
                      {platform.comments}{platform.commentsSuffix}
                    </div>
                  </div>
                </div>

                {/* Mini Visualization */}
                <div style={{ marginTop: 24, height: 4, width: "100%", background: "var(--vx-bg-input)", borderRadius: 2, overflow: "hidden" }}>
                  <motion.div 
                    initial={{ width: 0 }}
                    whileInView={{ width: "70%" }}
                    transition={{ duration: 1, delay: 0.5 }}
                    style={{ height: "100%", background: platform.barColor, borderRadius: 2 }}
                  />
                </div>
              </div>
            ))}
          </div>

        </div>
      </div>
    </section>
  );
}
