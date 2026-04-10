import { Button } from "./ui/button";
import { Play, Instagram, Facebook, Linkedin, Twitter, Menu, X, Sparkles, Zap, BarChart2, ArrowRight, Star } from "lucide-react";
import { useNavigate } from "react-router";
import { useState, useEffect } from "react";

export function HeroSection() {
  const navigate = useNavigate();
  const [userInfo, setUserInfo] = useState<any>(null);
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const savedUserInfo = localStorage.getItem("userInfo");
    if (savedUserInfo) {
      try { setUserInfo(JSON.parse(savedUserInfo)); } catch {}
    }
    const onScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const handleGetStarted = () => {
    navigate(localStorage.getItem("userInfo") ? "/upload" : "/signup");
  };

  const getUserInitials = () => {
    if (!userInfo?.name) return "U";
    const parts = userInfo.name.split(" ");
    return parts.length >= 2
      ? `${parts[0][0]}${parts[1][0]}`.toUpperCase()
      : userInfo.name[0].toUpperCase();
  };

  const navLinks = [
    { label: "About",        href: "#about" },
    { label: "How It Works", href: "#workflow" },
    { label: "Pricing",      href: "#pricing" },
    { label: "Blogs",        href: "/blogs" },
  ];

  const stats = [
    { value: "500+",  label: "Marketers" },
    { value: "30",    label: "Countries" },
    { value: "10M+",  label: "Posts" },
    { value: "98%",   label: "Satisfaction" },
  ];

  return (
    <section className="relative min-h-screen flex flex-col overflow-hidden" style={{ background: "linear-gradient(135deg, #05071a 0%, #0d0f2e 40%, #0a1628 70%, #05071a 100%)" }}>

      {/* ══════════ NAVBAR ══════════ */}
      <nav style={{
        position: "fixed",
        top: 0, left: 0, right: 0,
        zIndex: 50,
        transition: "all 0.3s ease",
        background: scrolled
          ? "rgba(5,7,26,0.95)"
          : "rgba(5,7,26,0.7)",
        backdropFilter: "blur(20px)",
        WebkitBackdropFilter: "blur(20px)",
        borderBottom: scrolled ? "1px solid rgba(139,92,246,0.2)" : "1px solid rgba(255,255,255,0.04)",
        boxShadow: scrolled ? "0 8px 32px rgba(0,0,0,0.4)" : "none",
      }}>
        <div style={{ maxWidth: 1280, margin: "0 auto", padding: "0 24px", display: "flex", alignItems: "center", justifyContent: "space-between", height: 64 }}>

          {/* Logo */}
          <button onClick={() => navigate("/")} style={{ display: "flex", alignItems: "center", gap: 10, background: "none", border: "none", cursor: "pointer" }}>
            <div style={{
              width: 34, height: 34,
              borderRadius: 10,
              background: "linear-gradient(135deg, #8b5cf6, #06b6d4)",
              display: "flex", alignItems: "center", justifyContent: "center",
              boxShadow: "0 0 20px rgba(139,92,246,0.5)",
            }}>
              <span style={{ color: "#fff", fontWeight: 900, fontSize: 15 }}>V</span>
            </div>
            <span style={{
              fontSize: 17, fontWeight: 700,
              background: "linear-gradient(90deg, #c4b5fd, #67e8f9)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              letterSpacing: "0.02em",
            }}>Vulpinix AI</span>
          </button>

          {/* Desktop Nav Links */}
          <div style={{ display: "flex", alignItems: "center", gap: 4 }} className="md:flex hidden">
            {navLinks.map((link) => (
              <a key={link.label} href={link.href} style={{
                padding: "8px 16px",
                fontSize: 14, fontWeight: 500,
                color: "rgba(209,213,219,0.9)",
                textDecoration: "none",
                borderRadius: 8,
                transition: "all 0.2s",
              }}
                onMouseEnter={e => { (e.currentTarget as HTMLElement).style.color = "#fff"; (e.currentTarget as HTMLElement).style.background = "rgba(255,255,255,0.06)"; }}
                onMouseLeave={e => { (e.currentTarget as HTMLElement).style.color = "rgba(209,213,219,0.9)"; (e.currentTarget as HTMLElement).style.background = "transparent"; }}
              >{link.label}</a>
            ))}
          </div>

          {/* Right: Avatar + CTA + Hamburger */}
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <button onClick={() => navigate("/profile")} style={{ display: "none", background: "none", border: "none", cursor: "pointer" }} className="sm:block">
              <div style={{
                width: 34, height: 34, borderRadius: "50%",
                overflow: "hidden",
                border: "2px solid rgba(139,92,246,0.6)",
                background: "linear-gradient(135deg, #7c3aed, #0891b2)",
                display: "flex", alignItems: "center", justifyContent: "center",
                color: "#fff", fontWeight: 700, fontSize: 13,
              }}>
                {userInfo?.picture
                  ? <img src={userInfo.picture} alt={userInfo.name} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                  : getUserInitials()
                }
              </div>
            </button>

            <Button onClick={handleGetStarted} style={{
              background: "linear-gradient(135deg, #7c3aed, #0891b2)",
              border: "none",
              color: "#fff",
              padding: "8px 20px",
              borderRadius: 10,
              fontWeight: 600,
              fontSize: 14,
              cursor: "pointer",
              boxShadow: "0 0 20px rgba(139,92,246,0.35)",
              transition: "all 0.2s",
            }}>
              Get Started
            </Button>

            {/* Hamburger */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              style={{ display: "none", background: "none", border: "none", cursor: "pointer", color: "#9ca3af", padding: 6 }}
              className="md:hidden block"
            >
              {mobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div style={{
            borderTop: "1px solid rgba(255,255,255,0.06)",
            background: "rgba(5,7,26,0.98)",
            backdropFilter: "blur(20px)",
            padding: "12px 24px 16px",
          }}>
            {navLinks.map((link) => (
              <a key={link.label} href={link.href} onClick={() => setMobileMenuOpen(false)} style={{
                display: "block", padding: "10px 12px",
                fontSize: 14, color: "#d1d5db",
                textDecoration: "none", borderRadius: 8,
                marginBottom: 2,
              }}>{link.label}</a>
            ))}
          </div>
        )}
      </nav>

      {/* ══════════ BACKGROUND EFFECTS ══════════ */}
      {/* Large glowing orbs */}
      <div style={{ position: "absolute", inset: 0, overflow: "hidden", pointerEvents: "none" }}>
        <div style={{ position: "absolute", top: "15%", left: "5%",  width: 500, height: 500, borderRadius: "50%", background: "radial-gradient(circle, rgba(124,58,237,0.18) 0%, transparent 70%)", filter: "blur(40px)", animation: "pulse 3s ease-in-out infinite" }} />
        <div style={{ position: "absolute", top: "30%", right: "5%", width: 600, height: 600, borderRadius: "50%", background: "radial-gradient(circle, rgba(6,182,212,0.14) 0%, transparent 70%)",  filter: "blur(40px)", animation: "pulse 4s ease-in-out infinite", animationDelay: "1s" }} />
        <div style={{ position: "absolute", bottom: "10%", left: "40%", width: 400, height: 400, borderRadius: "50%", background: "radial-gradient(circle, rgba(59,130,246,0.12) 0%, transparent 70%)", filter: "blur(40px)", animation: "pulse 5s ease-in-out infinite", animationDelay: "2s" }} />
      </div>

      {/* Grid lines */}
      <div style={{
        position: "absolute", inset: 0, pointerEvents: "none",
        backgroundImage: "linear-gradient(rgba(139,92,246,0.04) 1px, transparent 1px), linear-gradient(90deg, rgba(139,92,246,0.04) 1px, transparent 1px)",
        backgroundSize: "60px 60px",
      }} />

      {/* ══════════ MAIN CONTENT ══════════ */}
      <div style={{
        position: "relative", zIndex: 10,
        flex: 1, display: "flex", alignItems: "center",
        padding: "80px 24px 40px",
        maxWidth: 1280, margin: "0 auto", width: "100%",
        gap: 60,
      }}>

        {/* ── LEFT: Text content ── */}
        <div style={{ flex: 1, minWidth: 0 }}>

          {/* Badge */}
          <div style={{
            display: "inline-flex", alignItems: "center", gap: 8,
            padding: "6px 14px",
            borderRadius: 999,
            border: "1px solid rgba(139,92,246,0.4)",
            background: "rgba(139,92,246,0.08)",
            backdropFilter: "blur(8px)",
            marginBottom: 28,
          }}>
            <Sparkles size={13} style={{ color: "#a78bfa" }} />
            <span style={{ color: "#c4b5fd", fontSize: 13, fontWeight: 500 }}>Introducing Vulpinix AI 1.0</span>
            <div style={{ width: 6, height: 6, borderRadius: "50%", background: "#4ade80", boxShadow: "0 0 6px #4ade80", animation: "pulse 2s infinite" }} />
          </div>

          {/* Headline */}
          <h1 style={{ fontSize: "clamp(2rem, 5vw, 3.8rem)", fontWeight: 800, color: "#fff", lineHeight: 1.1, marginBottom: 24, letterSpacing: "-0.02em" }}>
            Automate Your<br />
            <span style={{
              background: "linear-gradient(135deg, #a78bfa 0%, #38bdf8 50%, #818cf8 100%)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
            }}>Digital Marketing</span>
            <br />
            with AI Power
          </h1>

          {/* Subheadline */}
          <p style={{ fontSize: "clamp(1rem, 2vw, 1.15rem)", color: "rgba(156,163,175,0.9)", lineHeight: 1.7, marginBottom: 36, maxWidth: 480 }}>
            Upload your content, let our AI craft captions, schedule posts, and deliver deep analytics — all from one seamless platform.
          </p>

          {/* CTA Buttons */}
          <div style={{ display: "flex", gap: 14, flexWrap: "wrap", marginBottom: 48 }}>
            <button onClick={handleGetStarted} style={{
              padding: "14px 28px",
              background: "linear-gradient(135deg, #7c3aed, #0891b2)",
              border: "none",
              borderRadius: 12,
              color: "#fff",
              fontWeight: 700,
              fontSize: 15,
              cursor: "pointer",
              display: "flex", alignItems: "center", gap: 8,
              boxShadow: "0 0 30px rgba(124,58,237,0.5), 0 4px 20px rgba(0,0,0,0.3)",
              transition: "all 0.25s",
            }}
              onMouseEnter={e => { (e.currentTarget as HTMLElement).style.transform = "translateY(-2px)"; (e.currentTarget as HTMLElement).style.boxShadow = "0 0 40px rgba(124,58,237,0.7), 0 8px 24px rgba(0,0,0,0.3)"; }}
              onMouseLeave={e => { (e.currentTarget as HTMLElement).style.transform = "translateY(0)"; (e.currentTarget as HTMLElement).style.boxShadow = "0 0 30px rgba(124,58,237,0.5), 0 4px 20px rgba(0,0,0,0.3)"; }}
            >
              <Zap size={16} />
              Get Started Free
              <ArrowRight size={16} />
            </button>

            <button style={{
              padding: "14px 24px",
              background: "rgba(255,255,255,0.05)",
              border: "1px solid rgba(255,255,255,0.12)",
              borderRadius: 12,
              color: "#e5e7eb",
              fontWeight: 600,
              fontSize: 15,
              cursor: "pointer",
              display: "flex", alignItems: "center", gap: 8,
              backdropFilter: "blur(8px)",
              transition: "all 0.25s",
            }}
              onMouseEnter={e => { (e.currentTarget as HTMLElement).style.borderColor = "rgba(139,92,246,0.5)"; (e.currentTarget as HTMLElement).style.background = "rgba(139,92,246,0.08)"; }}
              onMouseLeave={e => { (e.currentTarget as HTMLElement).style.borderColor = "rgba(255,255,255,0.12)"; (e.currentTarget as HTMLElement).style.background = "rgba(255,255,255,0.05)"; }}
            >
              <div style={{
                width: 28, height: 28, borderRadius: "50%",
                background: "linear-gradient(135deg, #7c3aed, #0891b2)",
                display: "flex", alignItems: "center", justifyContent: "center",
              }}>
                <Play size={11} style={{ color: "#fff", marginLeft: 2 }} fill="#fff" />
              </div>
              Watch Demo
            </button>
          </div>

          {/* Stats row */}
          <div style={{ display: "flex", gap: 28, flexWrap: "wrap" }}>
            {stats.map((s) => (
              <div key={s.label} style={{ textAlign: "center" }}>
                <div style={{ fontSize: "1.4rem", fontWeight: 800, color: "#fff", lineHeight: 1 }}>{s.value}</div>
                <div style={{ fontSize: 12, color: "#6b7280", marginTop: 2 }}>{s.label}</div>
              </div>
            ))}
          </div>
        </div>

        {/* ── RIGHT: Floating product card mockup ── */}
        <div className="hidden md:flex" style={{ flex: "0 0 420px", position: "relative", height: 480, alignItems: "center", justifyContent: "center" }}>

          {/* Glow behind card */}
          <div style={{
            position: "absolute", inset: "-20px",
            background: "radial-gradient(ellipse at center, rgba(124,58,237,0.25) 0%, rgba(6,182,212,0.15) 50%, transparent 70%)",
            filter: "blur(30px)",
          }} />

          {/* Main card */}
          <div style={{
            position: "relative", zIndex: 2,
            width: "100%",
            background: "rgba(13,15,46,0.8)",
            border: "1px solid rgba(139,92,246,0.3)",
            borderRadius: 24,
            padding: 24,
            backdropFilter: "blur(24px)",
            boxShadow: "0 32px 64px rgba(0,0,0,0.4), inset 0 1px 0 rgba(255,255,255,0.06)",
            animation: "float 6s ease-in-out infinite",
          }}>
            {/* Card header */}
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 20 }}>
              <div>
                <div style={{ color: "#fff", fontWeight: 700, fontSize: 15 }}>Performance Dashboard</div>
                <div style={{ color: "#6b7280", fontSize: 12, marginTop: 2 }}>Last 7 days</div>
              </div>
              <div style={{
                padding: "4px 10px",
                background: "rgba(74,222,128,0.12)",
                border: "1px solid rgba(74,222,128,0.3)",
                borderRadius: 999,
                color: "#4ade80",
                fontSize: 12, fontWeight: 600,
              }}>↑ 32% this week</div>
            </div>

            {/* Mini metric cards */}
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10, marginBottom: 20 }}>
              {[
                { label: "Total Reach",    value: "124K",  color: "#a78bfa", icon: "📊" },
                { label: "Engagement",     value: "8.4%",  color: "#38bdf8", icon: "⚡" },
                { label: "Posts Scheduled",value: "12",    color: "#4ade80", icon: "📅" },
                { label: "New Followers",  value: "+890",  color: "#fb923c", icon: "👥" },
              ].map((m) => (
                <div key={m.label} style={{
                  background: "rgba(255,255,255,0.04)",
                  border: "1px solid rgba(255,255,255,0.06)",
                  borderRadius: 12,
                  padding: "12px 14px",
                }}>
                  <div style={{ fontSize: 18, marginBottom: 4 }}>{m.icon}</div>
                  <div style={{ color: m.color, fontWeight: 700, fontSize: 18 }}>{m.value}</div>
                  <div style={{ color: "#6b7280", fontSize: 11, marginTop: 2 }}>{m.label}</div>
                </div>
              ))}
            </div>

            {/* Platform bars */}
            <div style={{ marginBottom: 16 }}>
              <div style={{ color: "#9ca3af", fontSize: 12, marginBottom: 10 }}>Platform Performance</div>
              {[
                { name: "Instagram", pct: 78, color: "#a78bfa" },
                { name: "Facebook",  pct: 54, color: "#38bdf8" },
                { name: "LinkedIn",  pct: 42, color: "#4ade80" },
              ].map((p) => (
                <div key={p.name} style={{ marginBottom: 10 }}>
                  <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 4 }}>
                    <span style={{ color: "#d1d5db", fontSize: 12 }}>{p.name}</span>
                    <span style={{ color: p.color, fontSize: 12, fontWeight: 600 }}>{p.pct}%</span>
                  </div>
                  <div style={{ height: 5, background: "rgba(255,255,255,0.06)", borderRadius: 999 }}>
                    <div style={{ height: "100%", width: `${p.pct}%`, background: `linear-gradient(90deg, ${p.color}, rgba(6,182,212,0.7))`, borderRadius: 999 }} />
                  </div>
                </div>
              ))}
            </div>

            {/* AI caption badge */}
            <div style={{
              display: "flex", alignItems: "center", gap: 8,
              padding: "10px 14px",
              background: "rgba(124,58,237,0.12)",
              border: "1px solid rgba(124,58,237,0.25)",
              borderRadius: 12,
            }}>
              <Sparkles size={14} style={{ color: "#a78bfa" }} />
              <span style={{ color: "#c4b5fd", fontSize: 12, fontWeight: 500 }}>AI generated 3 captions ready to publish</span>
            </div>
          </div>

          {/* Floating mini badges */}
          <div style={{
            position: "absolute", top: 20, left: -30, zIndex: 5,
            background: "rgba(13,15,46,0.9)",
            border: "1px solid rgba(74,222,128,0.4)",
            borderRadius: 12,
            padding: "8px 14px",
            backdropFilter: "blur(12px)",
            display: "flex", alignItems: "center", gap: 6,
            animation: "float 4s ease-in-out infinite",
            animationDelay: "1s",
            boxShadow: "0 8px 24px rgba(0,0,0,0.3)",
          }}>
            <Star size={12} style={{ color: "#fbbf24" }} fill="#fbbf24" />
            <span style={{ color: "#e5e7eb", fontSize: 12, fontWeight: 600 }}>4.9 / 5.0 Rating</span>
          </div>

          <div style={{
            position: "absolute", bottom: 30, right: -25, zIndex: 5,
            background: "rgba(13,15,46,0.9)",
            border: "1px solid rgba(139,92,246,0.4)",
            borderRadius: 12,
            padding: "8px 14px",
            backdropFilter: "blur(12px)",
            display: "flex", alignItems: "center", gap: 6,
            animation: "float 5s ease-in-out infinite",
            animationDelay: "0.5s",
            boxShadow: "0 8px 24px rgba(0,0,0,0.3)",
          }}>
            <BarChart2 size={12} style={{ color: "#38bdf8" }} />
            <span style={{ color: "#e5e7eb", fontSize: 12, fontWeight: 600 }}>Live Analytics</span>
          </div>

          {/* Floating social icons */}
          <div style={{ position: "absolute", left: -60, top: "35%", display: "flex", flexDirection: "column", gap: 12, zIndex: 5 }} className="hidden xl:flex">
            {[
              { Icon: Instagram, color: "rgba(168,85,247,0.6)", bg: "rgba(168,85,247,0.1)", delay: "0s" },
              { Icon: Facebook,  color: "rgba(59,130,246,0.6)",  bg: "rgba(59,130,246,0.1)",  delay: "0.8s" },
              { Icon: Linkedin,  color: "rgba(6,182,212,0.6)",   bg: "rgba(6,182,212,0.1)",   delay: "1.6s" },
              { Icon: Twitter,   color: "rgba(168,85,247,0.6)", bg: "rgba(168,85,247,0.1)", delay: "2.4s" },
            ].map(({ Icon, color, bg, delay }, i) => (
              <div key={i} style={{
                width: 40, height: 40,
                borderRadius: 12,
                border: `1.5px solid ${color}`,
                background: bg,
                backdropFilter: "blur(8px)",
                display: "flex", alignItems: "center", justifyContent: "center",
                animation: "float 3.5s ease-in-out infinite",
                animationDelay: delay,
              }}>
                <Icon size={18} style={{ color }} />
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ══════════ BOTTOM GRADIENT FADE ══════════ */}
      <div style={{
        position: "absolute", bottom: 0, left: 0, right: 0,
        height: 120,
        background: "linear-gradient(to bottom, transparent, rgba(5,7,26,0.8))",
        pointerEvents: "none", zIndex: 5,
      }} />
    </section>
  );
}