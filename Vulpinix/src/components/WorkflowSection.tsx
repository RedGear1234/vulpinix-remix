import { Upload, Sparkles, Users, LineChart, ChevronRight } from "lucide-react";

export function WorkflowSection() {
  const steps = [
    {
      number: "01",
      icon: Upload,
      title: "Upload Content",
      description: "Upload your media files, images, or videos. We handle all formats effortlessly.",
      color: "#a78bfa",
    },
    {
      number: "02",
      icon: Sparkles,
      title: "AI Generates Captions",
      description: "Our AI crafts high-engagement, platform-optimized captions tailored to your audience.",
      color: "#38bdf8",
    },
    {
      number: "03",
      icon: Users,
      title: "Team Reviews & Publishes",
      description: "Your dedicated Vulpinix team reviews, schedules, and publishes across all platforms.",
      color: "#4ade80",
    },
    {
      number: "04",
      icon: LineChart,
      title: "Get Analytics Reports",
      description: "Receive detailed performance reports with actionable insights to grow your reach.",
      color: "#fb923c",
    },
  ];

  return (
    <section id="workflow" style={{ padding: "80px 24px", position: "relative", overflow: "hidden" }}>
      {/* Background glow removed */}

      <div style={{ maxWidth: 1280, margin: "0 auto", position: "relative", zIndex: 1 }}>

        {/* Heading */}
        <div className="vx-reveal" style={{ textAlign: "center", marginBottom: 52 }}>
          <div style={{ color: "var(--vx-text-muted)", fontSize: 12, fontWeight: 700, letterSpacing: "0.15em", textTransform: "uppercase", marginBottom: 12 }}>
            Workflow
          </div>
          <h2 style={{ fontSize: "clamp(1.8rem,4vw,2.8rem)", fontWeight: 800, color: "var(--vx-text-primary)", lineHeight: 1.15, margin: 0 }}>
            How It Works
          </h2>
          <p style={{ color: "var(--vx-text-secondary)", fontSize: "1rem", marginTop: 14, maxWidth: 480, margin: "14px auto 0" }}>
            From content upload to live post — your entire workflow, automated.
          </p>
        </div>

        {/* Steps grid */}
        <div style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))",
          gap: 0,
          alignItems: "stretch",
          position: "relative",
        }}>
          {steps.map((step, index) => (
            <div key={index} style={{ display: "flex", alignItems: "stretch", position: "relative" }}>
              {/* Card */}
              <div
                className={`vx-reveal vx-delay-${index + 1}`}
                style={{
                  flex: 1,
                  background: "var(--vx-bg-card)",
                  border: "1px solid var(--vx-border)",
                  backdropFilter: "blur(20px)",
                  borderRadius: 24,
                  padding: "40px 32px",
                  transition: "all 0.3s ease",
                  textAlign: "center",
                  margin: "0 10px",
                  position: "relative",
                  overflow: "hidden"
                }}
                onMouseEnter={e => {
                  const el = e.currentTarget as HTMLElement;
                  el.style.transform = "translateY(-4px)";
                  el.style.borderColor = "var(--vx-border-hover)";
                  el.style.boxShadow = "var(--vx-shadow-card)";
                }}
                onMouseLeave={e => {
                  const el = e.currentTarget as HTMLElement;
                  el.style.transform = "translateY(0)";
                  el.style.borderColor = "var(--vx-border)";
                  el.style.boxShadow = "none";
                }}
              >
                {/* Step number badge */}
                <div style={{
                  display: "inline-block",
                  width: 28,
                  height: 28,
                  borderRadius: 8,
                  background: "var(--vx-bg-input)",
                  border: "1px solid var(--vx-border)",
                  color: "var(--vx-text-muted)",
                  fontSize: 11,
                  fontWeight: 800,
                  lineHeight: "26px",
                  textAlign: "center",
                  marginBottom: 18,
                }}>
                  {step.number}
                </div>

                {/* Icon */}
                <div style={{
                  width: 48,
                  height: 48,
                  borderRadius: 12,
                  background: "var(--vx-bg-input)",
                  border: "1px solid var(--vx-border)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  margin: "0 auto 16px",
                }}>
                  <step.icon size={22} style={{ color: step.color }} />
                </div>

                <h4 style={{ color: "var(--vx-text-primary)", fontSize: 16, fontWeight: 700, marginBottom: 8, lineHeight: 1.3 }}>
                  {step.title}
                </h4>
                <p style={{ color: "var(--vx-text-secondary)", fontSize: 13, lineHeight: 1.65, margin: 0 }}>
                  {step.description}
                </p>
              </div>

              {/* Arrow between cards */}
              {index < steps.length - 1 && (
                <div style={{
                  position: "absolute",
                  right: -4,
                  top: "50%",
                  transform: "translateY(-50%)",
                  zIndex: 10,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}>
                  <ChevronRight size={18} style={{ color: "var(--vx-text-muted)" }} />
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
