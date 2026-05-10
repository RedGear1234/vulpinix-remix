import { Check } from "lucide-react";
import { useNavigate } from "react-router";

export function PricingSection() {
  const navigate = useNavigate();

  const handleGetStarted = () => {
    const isAuthenticated = !!localStorage.getItem("userInfo") || localStorage.getItem("isAuthenticated") === "true";
    if (isAuthenticated) {
      navigate("/upload");
    } else {
      const isReturning = !!localStorage.getItem("userEmail") || !!localStorage.getItem("returningUser");
      navigate(isReturning ? "/login" : "/signup");
    }
  };

  const plans = [
    {
      name: "Basic",
      price: "$49",
      period: "/month",
      features: ["Up to 10 posts per month", "AI-powered captions", "2 social platforms", "Basic analytics", "Email support"],
      popular: false,
      color: "#a78bfa"
    },
    {
      name: "Pro",
      price: "$99",
      period: "/month",
      features: ["Up to 50 posts per month", "AI-powered captions", "All social platforms", "Advanced analytics", "Priority support", "Team collaboration"],
      popular: true,
      color: "#38bdf8"
    },
    {
      name: "Enterprise",
      price: "$299",
      period: "/month",
      features: ["Unlimited posts", "AI-powered captions", "All social platforms", "Real-time analytics", "24/7 dedicated support", "Team collaboration", "Custom integrations", "White-label options"],
      popular: false,
      color: "#fb923c"
    },
  ];

  return (
    <section id="pricing" style={{ padding: "80px 24px", position: "relative", overflow: "hidden" }}>

      {/* Bg glow removed */}

      <div style={{ maxWidth: 1280, margin: "0 auto", position: "relative", zIndex: 1 }}>
        {/* Heading */}
        <div className="vx-reveal" style={{ textAlign: "center", marginBottom: 50 }}>
          <div style={{ color: "var(--vx-text-muted)", fontSize: 12, fontWeight: 700, letterSpacing: "0.15em", textTransform: "uppercase", marginBottom: 14 }}>Pricing</div>
          <h2
            className="vx-heading"
            style={{ fontSize: "clamp(2rem,4vw,3rem)", fontWeight: 800, color: "var(--vx-text-primary)", display: "inline-block" }}
          >
            Choose Your Plan
          </h2>
          <p style={{ color: "var(--vx-text-secondary)", fontSize: 18, maxWidth: 600, margin: "0 auto", lineHeight: 1.6 }}>
            Choose the perfect plan to grow and manage your social media with ease.
          </p>
        </div>

        {/* Cards */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: 24, alignItems: "center" }}>
          {plans.map((plan, index) => {
            const isPopular = plan.popular;

            if (isPopular) {
              return (
                <div
                  key={index}
                  className={`vx-reveal vx-delay-${index + 1}`}
                  style={{
                    position: "relative",
                    background: "var(--vx-bg-card)",
                    border: `1px solid ${plan.color}50`,
                    borderRadius: 24,
                    display: "flex",
                    flexDirection: "column",
                    transition: "all 0.4s cubic-bezier(0.16, 1, 0.3, 1)",
                    boxShadow: `0 24px 80px ${plan.color}25`,
                    overflow: "hidden",
                    transform: "scale(1.05)",
                    zIndex: 10
                  }}
                  onMouseEnter={e => {
                    const el = e.currentTarget as HTMLElement;
                    el.style.transform = "scale(1.08) translateY(-6px)";
                    el.style.boxShadow = `0 32px 90px ${plan.color}35`;
                  }}
                  onMouseLeave={e => {
                    const el = e.currentTarget as HTMLElement;
                    el.style.transform = "scale(1.05) translateY(0)";
                    el.style.boxShadow = `0 24px 80px ${plan.color}25`;
                  }}
                >
                  {/* Top Split Header */}
                  <div style={{ background: `linear-gradient(135deg, ${plan.color}, #4f46e5)`, padding: "48px 32px 40px", position: "relative" }}>
                     <div style={{ position: "absolute", top: 16, right: 16, background: "rgba(0,0,0,0.25)", backdropFilter: "blur(12px)", color: "#fff", padding: "6px 14px", borderRadius: 999, fontSize: 11, fontWeight: 800, letterSpacing: "0.05em", textTransform: "uppercase", border: "1px solid rgba(255,255,255,0.2)" }}>
                       ✦ Most Popular
                     </div>
                     <h3 style={{ color: "#fff", fontSize: 26, fontWeight: 800, marginBottom: 8, letterSpacing: "-0.02em" }}>{plan.name}</h3>
                     <div style={{ display: "flex", alignItems: "baseline", gap: 6 }}>
                       <span style={{ fontSize: 56, fontWeight: 900, color: "#fff", lineHeight: 1 }}>{plan.price}</span>
                       <span style={{ color: "rgba(255,255,255,0.8)", fontSize: 15, fontWeight: 600 }}>{plan.period}</span>
                     </div>
                  </div>
                  
                  {/* Bottom Features */}
                  <div style={{ padding: "36px 32px", display: "flex", flexDirection: "column", flex: 1, background: "var(--vx-bg-card)" }}>
                     <ul style={{ listStyle: "none", padding: 0, margin: "0 0 40px", flex: 1, display: "flex", flexDirection: "column", gap: 18 }}>
                       {plan.features.map((feature, fi) => (
                         <li key={fi} style={{ display: "flex", alignItems: "center", gap: 14 }}>
                           <div style={{ width: 24, height: 24, borderRadius: "50%", background: `linear-gradient(135deg, ${plan.color}20, ${plan.color}40)`, border: `1px solid ${plan.color}50`, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                             <Check size={14} style={{ color: plan.color }} />
                           </div>
                           <span style={{ color: "var(--vx-text-primary)", fontSize: 15, fontWeight: 600 }}>{feature}</span>
                         </li>
                       ))}
                     </ul>
                     <button
                        onClick={handleGetStarted}
                        style={{
                          width: "100%", padding: "16px", borderRadius: 16, border: "none", cursor: "pointer", fontWeight: 800, fontSize: 16, color: "#fff",
                          background: `linear-gradient(90deg, ${plan.color}, #4f46e5)`, transition: "all 0.3s ease", boxShadow: `0 8px 24px ${plan.color}40`
                        }}
                        onMouseEnter={e => { e.currentTarget.style.transform = "translateY(-2px)"; e.currentTarget.style.boxShadow = `0 12px 32px ${plan.color}60`; }}
                        onMouseLeave={e => { e.currentTarget.style.transform = "translateY(0)"; e.currentTarget.style.boxShadow = `0 8px 24px ${plan.color}40`; }}
                      >
                        Get Started
                      </button>
                  </div>
                </div>
              );
            }

            // Minimal non-popular style
            return (
              <div
                key={index}
                className={`vx-reveal vx-delay-${index + 1}`}
                style={{
                  position: "relative",
                  background: "var(--vx-bg-card)",
                  border: "1px solid var(--vx-border)",
                  borderRadius: 24,
                  padding: "40px 32px",
                  display: "flex",
                  flexDirection: "column",
                  transition: "all 0.4s cubic-bezier(0.16, 1, 0.3, 1)",
                  opacity: 0.85
                }}
                onMouseEnter={e => {
                  const el = e.currentTarget as HTMLElement;
                  el.style.transform = "translateY(-6px)";
                  el.style.borderColor = plan.color;
                  el.style.opacity = "1";
                  el.style.boxShadow = `0 16px 40px ${plan.color}15`;
                }}
                onMouseLeave={e => {
                  const el = e.currentTarget as HTMLElement;
                  el.style.transform = "translateY(0)";
                  el.style.borderColor = "var(--vx-border)";
                  el.style.opacity = "0.85";
                  el.style.boxShadow = "none";
                }}
              >
                {/* Glowing tier dot indicator */}
                <div style={{ width: 14, height: 14, borderRadius: "50%", background: plan.color, boxShadow: `0 0 16px ${plan.color}`, marginBottom: 28 }} />

                <div style={{ marginBottom: 36 }}>
                  <h3 style={{ color: "var(--vx-text-primary)", fontSize: 22, fontWeight: 700, marginBottom: 8, letterSpacing: "-0.01em" }}>{plan.name}</h3>
                  <div style={{ display: "flex", alignItems: "baseline", gap: 6 }}>
                    <span style={{ fontSize: 46, fontWeight: 800, color: "var(--vx-text-primary)", lineHeight: 1 }}>{plan.price}</span>
                    <span style={{ color: "var(--vx-text-muted)", fontSize: 14, fontWeight: 500 }}>{plan.period}</span>
                  </div>
                </div>

                <ul style={{ listStyle: "none", padding: 0, margin: "0 0 40px", flex: 1, display: "flex", flexDirection: "column", gap: 16 }}>
                  {plan.features.map((feature, fi) => (
                    <li key={fi} style={{ display: "flex", alignItems: "flex-start", gap: 12 }}>
                      <Check size={16} style={{ color: "var(--vx-text-muted)", marginTop: 2, flexShrink: 0 }} />
                      <span style={{ color: "var(--vx-text-secondary)", fontSize: 14, lineHeight: 1.5 }}>{feature}</span>
                    </li>
                  ))}
                </ul>

                <button
                  onClick={handleGetStarted}
                  style={{
                    marginTop: "auto", width: "100%", padding: "14px", borderRadius: 14,
                    border: "1px solid var(--vx-border)", cursor: "pointer", fontWeight: 700, fontSize: 15,
                    color: "var(--vx-text-primary)", background: "transparent", transition: "all 0.3s ease"
                  }}
                  onMouseEnter={e => { e.currentTarget.style.background = `linear-gradient(90deg, ${plan.color}15, transparent)`; e.currentTarget.style.borderColor = plan.color; }}
                  onMouseLeave={e => { e.currentTarget.style.background = "transparent"; e.currentTarget.style.borderColor = "var(--vx-border)"; }}
                >
                  Get Started
                </button>
              </div>
            );
          })}
        </div>
      </div>

    </section>
  );
}