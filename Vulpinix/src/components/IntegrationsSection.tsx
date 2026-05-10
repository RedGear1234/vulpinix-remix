import { motion, AnimatePresence } from "framer-motion";
import { Instagram, Twitter, Globe, Info } from "lucide-react";
import { VulpinixLogo } from "./VulpinixLogo";
import { useState, useRef } from "react";

const integrations = [
  { id: "instagram", name: "Instagram", icon: <Instagram size={28} />, color: "#E4405F", delay: 0, details: "Automate your visual growth. Generate viral reels, schedule stories, and use AI to craft the perfect bio-link strategy." },
  { id: "facebook",  name: "Facebook",  icon: <svg width="28" height="28" viewBox="0 0 24 24" fill="currentColor"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/></svg>, color: "#1877F2", delay: 0.2, details: "Master your communities. Manage multiple pages and groups with AI-optimized posting times and engagement tracking." },
  { id: "linkedin",  name: "LinkedIn",  icon: <svg width="28" height="28" viewBox="0 0 24 24" fill="currentColor"><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0z"/></svg>, color: "#0A66C2", delay: 0.4, details: "Build professional authority. Automate thought-leadership posts, long-form articles, and B2B networking content." },
  { id: "twitter",   name: "Twitter/X", icon: <Twitter size={28} />, color: "#1DA1F2", delay: 0.1, details: "Rule the real-time web. Generate viral threads, optimized hooks, and schedule tweets for peak global engagement." },
  { id: "youtube",   name: "YouTube",   icon: <svg width="28" height="28" viewBox="0 0 24 24" fill="currentColor"><path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/></svg>, color: "#FF0000", delay: 0.3, details: "Scale your video reach. Automate video descriptions, SEO tags, and cross-platform promotion for every upload." },
  { id: "wordpress", name: "WordPress", icon: <Globe size={28} />, color: "#21759B", delay: 0.5, details: "Sync your content ecosystem. Automatically turn your social posts into blog updates and keep your website alive." },
  { id: "reddit",    name: "Reddit",    icon: <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor"><path d="M12 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0zm5.01 4.744c.688 0 1.25.561 1.25 1.249a1.25 1.25 0 0 1-2.498.056l-2.597-.547-.8 3.747c1.824.07 3.48.632 4.674 1.488.308-.309.73-.491 1.207-.491.968 0 1.754.786 1.754 1.754 0 .716-.435 1.333-1.056 1.597.04.21.06.427.06.646 0 2.311-2.701 4.196-6.033 4.196-3.332 0-6.033-1.885-6.033-4.196 0-.219.021-.436.06-.646-.621-.264-1.056-.881-1.056-1.597 0-.968.786-1.754 1.754-1.754.463 0 .875.18 1.179.466 1.171-.838 2.83-1.393 4.64-1.479l.734-3.412 2.52.535c.047-.03.096-.056.146-.082zm-4.486 9.49c-.638 0-1.159.521-1.159 1.159s.521 1.159 1.159 1.159c.638 0 1.159-.521 1.159-1.159s-.521-1.159-1.159-1.159zm-3.178 0c-.638 0-1.159.521-1.159 1.159s.521 1.159 1.159 1.159c.638 0 1.159-.521 1.159-1.159s-.521-1.159-1.159-1.159z"/></svg>, color: "#FF4500", comingSoon: true, delay: 0.6, details: "Coming Soon: Strategic community engagement and trend-aware subreddit automation for viral reach." },
  { id: "pinterest", name: "Pinterest", icon: <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor"><path d="M12.017 0C5.396 0 .029 5.367.029 11.987c0 5.079 3.158 9.417 7.618 11.162-.105-.949-.199-2.403.041-3.439.219-.937 1.406-5.965 1.406-5.965s-.359-.719-.359-1.782c0-1.668.967-2.914 2.171-2.914 1.023 0 1.518.769 1.518 1.69 0 1.029-.655 2.568-.994 3.995-.283 1.194.599 2.169 1.777 2.169 2.133 0 3.772-2.249 3.772-5.495 0-2.873-2.064-4.882-5.012-4.882-3.414 0-5.418 2.561-5.418 5.207 0 1.031.397 2.138.893 2.738a.36.36 0 0 1 .083.345l-.333 1.36c-.053.22-.174.267-.402.161-1.499-.698-2.436-2.889-2.436-4.649 0-3.785 2.75-7.262 7.929-7.262 4.163 0 7.398 2.967 7.398 6.931 0 4.136-2.607 7.464-6.227 7.464-1.216 0-2.359-.631-2.75-1.378l-.748 2.853c-.271 1.043-1.002 2.35-1.492 3.146 1.124.347 2.317.535 3.554.535 6.607 0 11.985-5.365 11.985-11.987C23.97 5.39 18.592.026 11.985.026L12.017 0z"/></svg>, color: "#BD081C", comingSoon: true, delay: 0.7, details: "Coming Soon: Visual discovery automation. Effortlessly schedule pins and optimize your visual content for search." },
];

const INTEG_STYLES = `
  .vxi-section { padding: 120px 24px; background: transparent; position: relative; overflow: hidden; }
  .vxi-inner   { max-width: 1280px; margin: 0 auto; position: relative; }

  /* orbit — visible on desktop, hidden on mobile */
  .vxi-orbit-wrap {
    position: relative; height: 600px;
    display: flex; align-items: center; justify-content: center;
  }

  /* mobile grid — hidden on desktop */
  .vxi-grid-wrap { display: none; }

  .vxi-info-box { height: 140px; margin-top: 40px; display: flex; justify-content: center; }

  /* ── TABLET + MOBILE (≤ 767px) ── */
  @media (max-width: 767px) {
    .vxi-section { padding: 72px 20px; }
    .vxi-orbit-wrap { display: none !important; }

    .vxi-grid-wrap {
      display: grid;
      grid-template-columns: repeat(4, 1fr);
      gap: 12px;
      margin-top: 8px;
    }

    .vxi-hub-card {
      grid-column: 1 / -1;
      display: flex; align-items: center; gap: 16px;
      background: var(--vx-bg-card);
      border: 1px solid var(--vx-border);
      border-radius: 20px; padding: 18px 20px;
      margin-bottom: 4px;
    }

    .vxi-grid-item {
      display: flex; flex-direction: column;
      align-items: center; gap: 6px;
      background: var(--vx-bg-card);
      border: 1px solid var(--vx-border);
      border-radius: 14px; padding: 14px 6px;
      cursor: pointer; transition: all 0.25s ease;
      position: relative;
    }
    .vxi-grid-item--selected {
      border-color: var(--item-color, #a78bfa);
      background: var(--vx-bg-card-hover);
    }
    .vxi-grid-item__name {
      font-size: 9px; font-weight: 700;
      color: var(--vx-text-muted); text-align: center;
      white-space: nowrap; overflow: hidden; text-overflow: ellipsis; width: 100%;
    }
    .vxi-grid-item--selected .vxi-grid-item__name { color: var(--vx-text-primary); }
    .vxi-info-box { height: auto; min-height: 80px; margin-top: 20px; }
  }

  @media (max-width: 480px) {
    .vxi-section { padding: 60px 16px; }
    .vxi-grid-wrap { gap: 8px; }
    .vxi-grid-item { padding: 12px 4px; border-radius: 12px; }
  }
`;

export function IntegrationsSection() {
  const [selected, setSelected] = useState<typeof integrations[0] | null>(null);
  const infoRef = useRef<HTMLDivElement>(null);

  const handleSelect = (item: typeof integrations[0]) => {
    if (selected?.id === item.id) { setSelected(null); return; }
    setSelected(item);
    setTimeout(() => infoRef.current?.scrollIntoView({ behavior: "smooth", block: "center" }), 100);
  };

  return (
    <section id="integrations" className="vxi-section">
      <style dangerouslySetInnerHTML={{ __html: INTEG_STYLES }} />
      <div className="vxi-inner">

        {/* Header */}
        <div style={{ textAlign: "center", marginBottom: 60, position: "relative", zIndex: 10 }}>
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.6 }}>
            <div style={{ color: "var(--vx-text-muted)", fontSize: 12, fontWeight: 700, letterSpacing: "0.15em", textTransform: "uppercase", marginBottom: 12 }}>How it's done</div>
            <h2 style={{ fontSize: "clamp(1.8rem, 4vw, 2.8rem)", fontWeight: 800, color: "var(--vx-text-primary)", marginBottom: 20, letterSpacing: "-0.02em" }}>
              One Hub, Every Platform
            </h2>
            <p style={{ fontSize: "clamp(14px, 2vw, 18px)", color: "var(--vx-text-secondary)", maxWidth: 600, margin: "0 auto", lineHeight: 1.6 }}>
              Click any platform to see how Vulpinix streamlines your presence.
            </p>
          </motion.div>
        </div>

        {/* ── DESKTOP: Orbit Layout ── */}
        <div className="vxi-orbit-wrap">
          <motion.div style={{ position: "relative", zIndex: 5, width: 140, height: 140, borderRadius: "50%", background: "var(--vx-bg-card)", border: "1px solid var(--vx-border)", display: "flex", alignItems: "center", justifyContent: "center", boxShadow: selected ? `0 0 50px ${selected.color}30` : "0 0 50px rgba(167,139,250,0.2)", transition: "box-shadow 0.4s ease" }}>
            <AnimatePresence mode="wait">
              {selected ? (
                <motion.div key={selected.id} initial={{ opacity: 0, scale: 0.5 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.5 }} style={{ color: selected.color }}>{selected.icon}</motion.div>
              ) : (
                <motion.div key="logo" initial={{ opacity: 0 }} animate={{ opacity: 1 }}><VulpinixLogo size="lg" showText={false} /></motion.div>
              )}
            </AnimatePresence>
            <motion.div animate={{ scale: [1, 1.2, 1], opacity: [0.3, 0.1, 0.3] }} transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }} style={{ position: "absolute", width: "100%", height: "100%", borderRadius: "50%", border: `2px solid ${selected ? selected.color : "#a78bfa"}`, zIndex: -1, transition: "border-color 0.4s ease" }} />
          </motion.div>

          {integrations.map((item, i) => {
            const angles = [0, 45, 90, 135, 180, 225, 270, 315];
            const angle = angles[i] * (Math.PI / 180);
            const radius = 220 + (i % 2 === 0 ? 40 : 0);
            const x = Math.cos(angle) * radius;
            const y = Math.sin(angle) * radius;
            const isSelected = selected?.id === item.id;
            return (
              <motion.div key={item.name} initial={{ opacity: 0, x: 0, y: 0 }} whileInView={{ opacity: 1, x, y }} viewport={{ once: true }} transition={{ duration: 0.8, delay: item.delay, type: "spring" }} style={{ position: "absolute", zIndex: 4, display: "flex", flexDirection: "column", alignItems: "center", gap: 8 }}>
                <motion.div style={{ position: "absolute", top: "50%", left: "50%", width: radius, height: 1, background: `linear-gradient(90deg, transparent, ${item.color})`, transformOrigin: "left", transform: `translate(0,-50%) rotate(${angles[i] + 180}deg)`, zIndex: -1, opacity: isSelected ? 0.3 : 0.05, transition: "opacity 0.4s ease" }} />
                <motion.div onClick={() => handleSelect(item)} style={{ width: 70, height: 70, borderRadius: "50%", background: "var(--vx-bg-card)", border: isSelected ? `2px solid ${item.color}` : `1px solid ${item.color}40`, display: "flex", alignItems: "center", justifyContent: "center", color: item.color, boxShadow: isSelected ? `0 0 30px ${item.color}40` : `0 10px 30px ${item.color}15`, cursor: "pointer", position: "relative", transition: "all 0.3s ease" }} whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.95 }}>
                  {item.icon}
                  {item.comingSoon && <div style={{ position: "absolute", top: -12, right: -12, background: "var(--vx-bg-input)", border: "1px solid var(--vx-border)", borderRadius: 12, padding: "2px 8px", fontSize: 8, fontWeight: 800, color: "var(--vx-text-muted)", textTransform: "uppercase" }}>Soon</div>}
                </motion.div>
                <span style={{ fontSize: 13, fontWeight: 700, color: isSelected ? "var(--vx-text-primary)" : "var(--vx-text-muted)", whiteSpace: "nowrap", transition: "color 0.3s ease" }}>{item.name}</span>
              </motion.div>
            );
          })}
        </div>

        {/* ── MOBILE: Icon Grid ── */}
        <div className="vxi-grid-wrap">
          {/* Central hub */}
          <div className="vxi-hub-card">
            <div style={{ width: 52, height: 52, borderRadius: "50%", background: "var(--vx-bg-input)", border: "1px solid var(--vx-border)", display: "flex", alignItems: "center", justifyContent: "center", boxShadow: selected ? `0 0 20px ${selected.color}40` : "0 0 20px rgba(167,139,250,0.2)", transition: "box-shadow 0.3s ease", flexShrink: 0 }}>
              <AnimatePresence mode="wait">
                {selected ? (
                  <motion.div key={selected.id} initial={{ opacity: 0, scale: 0.5 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0 }} style={{ color: selected.color }}>{selected.icon}</motion.div>
                ) : (
                  <motion.div key="logo" initial={{ opacity: 0 }} animate={{ opacity: 1 }}><VulpinixLogo size="sm" showText={false} /></motion.div>
                )}
              </AnimatePresence>
            </div>
            <div>
              <div style={{ fontSize: 15, fontWeight: 800, color: "var(--vx-text-primary)" }}>Vulpinix Hub</div>
              <div style={{ fontSize: 12, color: "var(--vx-text-muted)" }}>Tap a platform below</div>
            </div>
          </div>

          {integrations.map((item) => {
            const isSelected = selected?.id === item.id;
            return (
              <motion.div
                key={item.id}
                className={`vxi-grid-item${isSelected ? " vxi-grid-item--selected" : ""}`}
                style={{ "--item-color": item.color } as React.CSSProperties}
                onClick={() => handleSelect(item)}
                whileTap={{ scale: 0.93 }}
              >
                <div style={{ color: item.color }}>{item.icon}</div>
                <span className="vxi-grid-item__name">{item.name}</span>
                {item.comingSoon && <span style={{ fontSize: 7, fontWeight: 800, color: "var(--vx-text-muted)", background: "var(--vx-bg-input)", border: "1px solid var(--vx-border)", borderRadius: 5, padding: "1px 4px", position: "absolute", top: 6, right: 6 }}>SOON</span>}
              </motion.div>
            );
          })}
        </div>

        {/* Info Box */}
        <div ref={infoRef} className="vxi-info-box">
          <AnimatePresence mode="wait">
            {selected ? (
              <motion.div key={selected.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} style={{ maxWidth: 500, width: "100%", textAlign: "center", background: "rgba(167,139,250,0.05)", border: "1px solid var(--vx-border)", borderRadius: 20, padding: "24px 28px", backdropFilter: "blur(8px)" }}>
                <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 12, marginBottom: 8 }}>
                  <div style={{ color: selected.color }}>{selected.icon}</div>
                  <h4 style={{ fontSize: "clamp(15px, 2vw, 18px)", fontWeight: 800, color: "var(--vx-text-primary)" }}>{selected.name} Automation</h4>
                </div>
                <p style={{ fontSize: "clamp(13px, 1.5vw, 15px)", color: "var(--vx-text-secondary)", lineHeight: 1.6 }}>{selected.details}</p>
              </motion.div>
            ) : (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} style={{ color: "var(--vx-text-muted)", fontSize: 15, fontStyle: "italic", display: "flex", alignItems: "center", gap: 8 }}>
                <Info size={18} /> Select a platform to see how it works
              </motion.div>
            )}
          </AnimatePresence>
        </div>

      </div>
    </section>
  );
}
