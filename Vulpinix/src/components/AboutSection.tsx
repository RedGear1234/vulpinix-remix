import { Sparkles, Share2, BarChart3, Zap, Globe, Target, Image } from "lucide-react";
import { useState, useRef } from "react";

export function AboutSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const [activeFeature, setActiveFeature] = useState(0);

  const features = [
    {
      icon: Sparkles,
      title: "AI-Powered Captions",
      description: "Harness advanced neural networks to craft high-conversion captions that resonate with your specific audience segments.",
      color: "#a78bfa",
      glow: "rgba(139,92,246,0.3)"
    },
    {
      icon: Share2,
      title: "Multi-Platform Sync",
      description: "Scale your reach effortlessly. Publish and manage your presence across Instagram, Facebook, LinkedIn, and more from one bridge.",
      color: "#38bdf8",
      glow: "rgba(6,182,212,0.3)"
    },
    {
      icon: BarChart3,
      title: "Predictive Analytics",
      description: "Go beyond basic tracking. Get AI-driven insights that predict engagement trends and suggest the optimal time to publish.",
      color: "#818cf8",
      glow: "rgba(129,140,248,0.3)"
    }
  ];

  return (
    <section
      id="about"
      ref={sectionRef}
      style={{ position: "relative", padding: "clamp(40px, 8vw, 60px) 16px 100px", overflow: "hidden", background: "transparent" }}
    >
      <style>{`
        @keyframes vx-tab-fade {
          0% { opacity: 0; transform: translateY(12px); filter: blur(4px); }
          100% { opacity: 1; transform: translateY(0); filter: blur(0); }
        }
        @keyframes term-fade {
          0% { opacity: 0; transform: translateY(4px); }
          100% { opacity: 1; transform: translateY(0); }
        }
        @keyframes float-bg {
          0%, 100% { transform: rotate(6deg) scale(0.95) translateY(0); }
          50% { transform: rotate(6deg) scale(0.95) translateY(-12px); }
        }
        @keyframes float-fg {
          0%, 100% { transform: translateY(15px); }
          50% { transform: translateY(5px); }
        }
        @keyframes bar-grow {
          0% { transform: scaleY(0); }
          100% { transform: scaleY(1); }
        }
        
        @media (max-width: 768px) {
          .vx-dashboard-body { flex-direction: column !important; }
          .vx-dashboard-sidebar { border-right: none !important; border-bottom: 1px solid var(--vx-border) !important; flex: none !important; width: 100% !important; }
          .vx-dashboard-main { flex: none !important; width: 100% !important; min-height: 400px !important; }
          .vx-feature-card { padding: 12px !important; }
        }

        @media (max-width: 480px) {
          .vx-mockup-container { padding: 4px !important; }
          .vx-reveal h2 { font-size: 1.75rem !important; }
        }
      `}</style>
      <div style={{ maxWidth: 1280, margin: "0 auto", position: "relative", zIndex: 1 }}>
        
        {/* ── Centered Header Block ── */}
        <div className="vx-reveal" style={{ textAlign: "center", maxWidth: 680, margin: "0 auto 60px" }}>
          {/* Minimal Pill Tag */}
          <div style={{ display: "inline-flex", alignItems: "center", gap: 8, padding: "4px 14px", borderRadius: 999, background: "var(--vx-bg-card)", border: "1px solid var(--vx-border)", marginBottom: 24, boxShadow: "var(--vx-shadow-card)" }}>
            <div style={{ width: 6, height: 6, borderRadius: "50%", background: "var(--vx-text-primary)" }} />
            <span style={{ color: "var(--vx-text-primary)", fontSize: 12, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.1em" }}>System Architecture</span>
          </div>

          <h2 style={{ fontSize: "clamp(2rem, 3.5vw, 2.75rem)", fontWeight: 800, color: "var(--vx-text-primary)", lineHeight: 1.15, marginBottom: 20, letterSpacing: "-0.03em" }}>
            What is <span style={{ color: "var(--vx-text-secondary)" }}>Vulpinix 1.0?</span>
          </h2>

          <p style={{ fontSize: "clamp(1rem, 1.5vw, 1.1rem)", color: "var(--vx-text-secondary)", lineHeight: 1.7 }}>
            Vulpinix AI is your intelligent marketing co-pilot. Built for the modern digital landscape, it completely automates the bridge between raw content creation and strategic publishing.
          </p>
        </div>

        {/* ── Dashboard Interface Mockup ── */}
        <div className="vx-reveal vx-mockup-container" style={{ background: "var(--vx-bg-primary)", border: "1px solid var(--vx-border)", borderRadius: 24, padding: 6, boxShadow: "0 24px 64px rgba(0,0,0,0.15)", marginTop: 20 }}>
          <div style={{ background: "var(--vx-bg-card)", border: "1px solid var(--vx-border)", borderRadius: 16, overflow: "hidden", display: "flex", flexDirection: "column", minHeight: 460 }}>
            
            {/* Window Header */}
            <div style={{ height: 48, borderBottom: "1px solid var(--vx-border)", display: "flex", alignItems: "center", padding: "0 20px", gap: 8, background: "var(--vx-bg-input)" }}>
              <div style={{ width: 12, height: 12, borderRadius: "50%", background: "var(--vx-border)" }} />
              <div style={{ width: 12, height: 12, borderRadius: "50%", background: "var(--vx-border)" }} />
              <div style={{ width: 12, height: 12, borderRadius: "50%", background: "var(--vx-border)" }} />
              
              <div style={{ marginLeft: "auto", display: "flex", alignItems: "center", gap: 8, padding: "4px 12px", background: "var(--vx-bg-primary)", borderRadius: 999, border: "1px solid var(--vx-border)", fontSize: 11, fontWeight: 700, color: "var(--vx-text-muted)" }}>
                <Zap size={12} style={{ color: "#38bdf8" }} />
                <span className="hidden sm:inline">AI ENGINE ACTIVE</span>
              </div>
            </div>

            {/* Window Body - App Layout */}
            <div className="vx-dashboard-body" style={{ display: "flex", flex: 1, flexDirection: "row", flexWrap: "wrap" }}>
                {/* Left Sidebar - Features List */}
               <div className="vx-dashboard-sidebar" style={{ flex: "1 1 320px", borderRight: "1px solid var(--vx-border)", padding: "clamp(16px, 3vw, 24px)", display: "flex", flexDirection: "column", gap: 16, background: "var(--vx-bg-primary)" }}>
                 {features.map((feature, i) => (
                   <div 
                     key={i} 
                     className="vx-feature-card"
                     onClick={() => setActiveFeature(i)}
                     style={{ 
                       padding: 20, 
                       border: i === activeFeature ? `1px solid ${feature.color}60` : "1px solid var(--vx-border)", 
                       borderRadius: 16, 
                       background: i === activeFeature ? `linear-gradient(135deg, ${feature.color}10, transparent)` : "var(--vx-bg-card)",
                       transition: "all 0.2s ease",
                       cursor: "pointer"
                     }}
                   >
                     <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 8 }}>
                       <div style={{ width: 32, height: 32, borderRadius: 8, background: i === activeFeature ? feature.color : "var(--vx-bg-input)", display: "flex", alignItems: "center", justifyContent: "center", transition: "all 0.2s ease" }}>
                         <feature.icon size={16} color={i === activeFeature ? "#fff" : "var(--vx-text-secondary)"} />
                       </div>
                       <span style={{ fontWeight: 800, fontSize: "clamp(0.9rem, 2vw, 1rem)", color: i === activeFeature ? "var(--vx-text-primary)" : "var(--vx-text-secondary)", transition: "all 0.2s ease" }}>
                         {feature.title}
                       </span>
                     </div>
                     <p style={{ fontSize: "0.85rem", color: "var(--vx-text-secondary)", lineHeight: 1.6, margin: 0 }}>
                       {feature.description}
                     </p>
                   </div>
                 ))}
               </div>

               {/* Right Main Area - Visual Output */}
               <div className="vx-dashboard-main" style={{ flex: "2 1 400px", padding: "clamp(16px, 4vw, 24px)", display: "flex", background: "var(--vx-bg-card)", minHeight: 340 }}>
                  <div style={{ flex: 1, width: "100%", minHeight: 320, borderRadius: 20, display: "flex", alignItems: "center", justifyContent: "center", position: "relative" }}>
                     
                     <div key={activeFeature} style={{ width: "100%", height: "100%", display: "flex", alignItems: "center", justifyContent: "center", animation: "vx-tab-fade 0.5s cubic-bezier(0.16, 1, 0.3, 1) forwards" }}>
                       
                       {/* TAB 0: AI Captions (Social Media + AI Mockup) */}
                       {activeFeature === 0 && (
                          <div style={{ width: "100%", maxWidth: 340, background: "var(--vx-bg-card)", borderRadius: 24, border: "1px solid var(--vx-border)", display: "flex", flexDirection: "column", overflow: "hidden", boxShadow: "var(--vx-shadow-card)" }}>
                             {/* Header */}
                             <div style={{ padding: "16px 20px", borderBottom: "1px solid var(--vx-border)", display: "flex", alignItems: "center", gap: 12, background: "var(--vx-bg-primary)" }}>
                               <div style={{ width: 36, height: 36, borderRadius: "50%", background: "linear-gradient(135deg, #a78bfa, #38bdf8)", display: "flex", alignItems: "center", justifyContent: "center", boxShadow: "0 4px 12px rgba(139,92,246,0.3)" }}>
                                 <Sparkles size={18} color="#fff" />
                               </div>
                               <div>
                                 <div style={{ fontWeight: 800, fontSize: 14, color: "var(--vx-text-primary)", letterSpacing: "-0.01em" }}>New Campaign</div>
                                 <div style={{ fontSize: 12, color: "var(--vx-text-muted)", fontWeight: 500 }}>Instagram & LinkedIn</div>
                               </div>
                             </div>
                             
                             {/* Body */}
                             <div style={{ padding: 20, display: "flex", flexDirection: "column", gap: 16 }}>
                               {/* Image Placeholder */}
                               <div style={{ width: "100%", height: 140, borderRadius: 12, background: "var(--vx-bg-input)", border: "1px dashed var(--vx-border-focus)", display: "flex", alignItems: "center", justifyContent: "center", position: "relative", overflow: "hidden" }}>
                                 <div style={{ position: "absolute", top: 0, left: 0, width: "100%", height: "100%", background: "linear-gradient(45deg, rgba(167,139,250,0.1), rgba(56,189,248,0.1))" }} />
                                 <Image size={28} style={{ color: "var(--vx-text-muted)", zIndex: 1 }} />
                               </div>
                               
                               {/* AI Caption Generation area */}
                               <div style={{ position: "relative", marginTop: 4 }}>
                                 <div style={{ padding: "16px 14px", background: "var(--vx-bg-primary)", borderRadius: 12, border: "1px solid var(--vx-border)", minHeight: 90, fontSize: 13, color: "var(--vx-text-primary)", lineHeight: 1.6, position: "relative" }}>
                                   {/* Scanning line animation overlay */}
                                   <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: 2, background: "linear-gradient(90deg, transparent, #a78bfa, transparent)", opacity: 0, animation: "vx-tab-fade 2s ease infinite" }} />
                                   
                                   <div style={{ opacity: 0, animation: "term-fade 0.5s ease 0.4s forwards" }}>
                                     "Automate your growth with intelligent social deployment. 🚀 Let AI handle the heavy lifting while you focus on strategy. <span style={{ color: "#38bdf8", fontWeight: 600 }}>#AI #Marketing</span>"
                                   </div>
                                 </div>
                                 
                                 {/* Floating AI badge */}
                                 <div style={{ position: "absolute", top: -14, right: -10, background: "linear-gradient(135deg, #8b5cf6, #38bdf8)", padding: "4px 12px", borderRadius: 999, display: "flex", alignItems: "center", gap: 4, boxShadow: "0 8px 16px rgba(139,92,246,0.3)", animation: "float-bg 4s ease-in-out infinite" }}>
                                   <Sparkles size={12} color="#fff" />
                                   <span style={{ fontSize: 10, fontWeight: 800, color: "#fff", letterSpacing: "0.05em", textTransform: "uppercase" }}>AI Magic</span>
                                 </div>
                               </div>
                               
                               {/* Action Bar */}
                               <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginTop: 4 }}>
                                 <div style={{ display: "flex", gap: 8 }}>
                                   <div style={{ width: 28, height: 28, borderRadius: "50%", background: "var(--vx-bg-input)", border: "1px solid var(--vx-border)", display: "flex", alignItems: "center", justifyContent: "center" }}><Sparkles size={12} color="#a78bfa" /></div>
                                   <div style={{ width: 28, height: 28, borderRadius: "50%", background: "var(--vx-bg-input)", border: "1px solid var(--vx-border)", display: "flex", alignItems: "center", justifyContent: "center" }}><Target size={12} color="#38bdf8" /></div>
                                 </div>
                                 <div style={{ background: "var(--vx-text-primary)", color: "var(--vx-bg-primary)", padding: "8px 18px", borderRadius: 10, fontSize: 12, fontWeight: 800 }}>
                                   Schedule Post
                                 </div>
                               </div>
                             </div>
                          </div>
                       )}

                       {/* TAB 1: Multi-Platform Sync (Layered Mockups) */}
                       {activeFeature === 1 && (
                         <div style={{ transform: "scale(0.85)", display: "flex", alignItems: "center", justifyContent: "center", position: "relative", width: "100%", height: "100%" }}>
                           {/* Background floating card */}
                           <div style={{ position: "absolute", top: 10, right: -10, width: 320, background: "var(--vx-bg-primary)", border: "1px solid var(--vx-border)", borderRadius: 16, padding: 20, boxShadow: "var(--vx-shadow-card)", zIndex: 1, animation: "float-bg 6s ease-in-out infinite" }}>
                             <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 16 }}>
                               <div style={{ width: 40, height: 40, borderRadius: 10, background: "#38bdf8", display: "flex", alignItems: "center", justifyContent: "center" }}>
                                 <Globe size={20} color="#fff" />
                               </div>
                               <div>
                                 <div style={{ fontWeight: 800, fontSize: 14, color: "var(--vx-text-primary)" }}>Vulpinix Network</div>
                                 <div style={{ fontSize: 12, color: "var(--vx-text-muted)" }}>Just deployed • 🌐</div>
                               </div>
                             </div>
                             <div style={{ height: 60, borderRadius: 8, background: "var(--vx-bg-input)", marginBottom: 16 }} />
                             <div style={{ height: 16, width: "85%", borderRadius: 6, background: "var(--vx-bg-input)", marginBottom: 10 }} />
                             <div style={{ height: 16, width: "60%", borderRadius: 6, background: "var(--vx-bg-input)" }} />
                           </div>

                           {/* Foreground floating card */}
                           <div style={{ width: "100%", maxWidth: 320, background: "var(--vx-bg-card)", borderRadius: 24, border: "1px solid var(--vx-border)", display: "flex", flexDirection: "column", overflow: "hidden", boxShadow: "0 30px 60px rgba(0,0,0,0.25)", zIndex: 2, marginRight: "clamp(20px, 10vw, 60px)", animation: "float-fg 7s ease-in-out infinite 1s" }}>
                              <div style={{ padding: "16px 20px", display: "flex", alignItems: "center", gap: 12, borderBottom: "1px solid var(--vx-border)" }}>
                                 <div style={{ width: 36, height: 36, borderRadius: "50%", background: "linear-gradient(45deg, #f09433, #e6683c, #dc2743, #cc2366, #bc1888)", padding: 2 }}>
                                   <div style={{ width: "100%", height: "100%", background: "var(--vx-bg-card)", borderRadius: "50%", border: "2px solid var(--vx-bg-card)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                                     <Sparkles size={14} color="var(--vx-text-primary)" />
                                   </div>
                                 </div>
                                 <div style={{ fontWeight: 700, fontSize: 13, color: "var(--vx-text-primary)" }}>vulpinix_ai</div>
                                 <div style={{ marginLeft: "auto" }}><MoreHorizontal size={18} color="var(--vx-text-muted)" /></div>
                              </div>
                              <div style={{ width: "100%", height: 220, background: "linear-gradient(135deg, #a78bfa20, #38bdf820)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                                 <div style={{ width: 64, height: 64, borderRadius: "50%", background: "var(--vx-bg-card)", display: "flex", alignItems: "center", justifyContent: "center", boxShadow: "0 10px 20px rgba(0,0,0,0.1)" }}>
                                   <Image size={24} color="#a78bfa" />
                                 </div>
                              </div>
                              <div style={{ padding: "14px 20px 8px", display: "flex", gap: 16 }}>
                                 <Heart size={22} color="#ef4444" fill="#ef4444" style={{ animation: "term-fade 0.3s ease 0.5s backwards" }} />
                                 <MessageCircle size={22} color="var(--vx-text-primary)" style={{ animation: "term-fade 0.3s ease 0.6s backwards" }} />
                                 <Send size={22} color="var(--vx-text-primary)" style={{ animation: "term-fade 0.3s ease 0.7s backwards" }} />
                              </div>
                              <div style={{ padding: "0 20px 20px", fontSize: 13, color: "var(--vx-text-primary)", lineHeight: 1.5 }}>
                                 <span style={{ fontWeight: 800, marginRight: 6 }}>vulpinix_ai</span>
                                 Automate your growth with intelligent social deployment. 🚀 <span style={{ color: "#38bdf8" }}>#AI #Marketing</span>
                              </div>
                           </div>
                         </div>
                       )}

                       {/* TAB 2: Predictive Analytics (Bar Chart Mockup) */}
                       {activeFeature === 2 && (
                          <div style={{ width: "100%", maxWidth: 360, background: "var(--vx-bg-primary)", borderRadius: 20, border: "1px solid var(--vx-border)", padding: "clamp(16px, 5vw, 32px)", boxShadow: "0 24px 48px rgba(0,0,0,0.15)", display: "flex", flexDirection: "column" }}>
                             <div style={{ fontSize: 12, fontWeight: 800, color: "var(--vx-text-muted)", marginBottom: 24, letterSpacing: "0.1em", display: "flex", alignItems: "center", gap: 8 }}>
                               <BarChart3 size={16} style={{ color: "#818cf8" }} />
                               ENGAGEMENT FORECAST
                             </div>
                             <div style={{ display: "flex", alignItems: "flex-end", gap: 12, marginBottom: 40 }}>
                               <div style={{ fontSize: "clamp(2.5rem, 6vw, 3.5rem)", fontWeight: 800, color: "var(--vx-text-primary)", lineHeight: 1 }}>2.4<span style={{ fontSize: "1.5rem" }}>k</span></div>
                               <div style={{ padding: "4px 8px", background: "rgba(34, 197, 94, 0.1)", color: "#22c55e", borderRadius: 6, fontWeight: 700, fontSize: 13, marginBottom: 6 }}>+14.2%</div>
                             </div>
                             {/* Bar Chart with animated growing bars */}
                             <div style={{ display: "flex", alignItems: "flex-end", gap: "clamp(6px, 2vw, 12px)", height: 120 }}>
                               <div style={{ flex: 1, height: "40%", background: "var(--vx-bg-input)", borderRadius: "6px 6px 0 0", transformOrigin: "bottom", animation: "bar-grow 0.6s cubic-bezier(0.16, 1, 0.3, 1) both" }} />
                               <div style={{ flex: 1, height: "60%", background: "var(--vx-bg-input)", borderRadius: "6px 6px 0 0", transformOrigin: "bottom", animation: "bar-grow 0.6s cubic-bezier(0.16, 1, 0.3, 1) 0.1s both" }} />
                               <div style={{ flex: 1, height: "45%", background: "var(--vx-bg-input)", borderRadius: "6px 6px 0 0", transformOrigin: "bottom", animation: "bar-grow 0.6s cubic-bezier(0.16, 1, 0.3, 1) 0.2s both" }} />
                               <div style={{ flex: 1, height: "100%", background: "linear-gradient(to top, #818cf8, #a78bfa)", borderRadius: "6px 6px 0 0", position: "relative", transformOrigin: "bottom", animation: "bar-grow 0.6s cubic-bezier(0.16, 1, 0.3, 1) 0.3s both" }}>
                                 <div style={{ position: "absolute", top: -30, left: "50%", transform: "translateX(-50%)", background: "var(--vx-text-primary)", color: "var(--vx-bg-primary)", fontSize: 11, fontWeight: 700, padding: "4px 8px", borderRadius: 4, opacity: 0, animation: "term-fade 0.4s ease 0.9s forwards" }}>NOW</div>
                               </div>
                               <div style={{ flex: 1, height: "85%", background: "var(--vx-bg-input)", borderRadius: "6px 6px 0 0", transformOrigin: "bottom", animation: "bar-grow 0.6s cubic-bezier(0.16, 1, 0.3, 1) 0.4s both" }} />
                             </div>
                          </div>
                       )}
                     </div>

                  </div>
               </div>

            </div>
          </div>
        </div>

      </div>
    </section>
  );
}
