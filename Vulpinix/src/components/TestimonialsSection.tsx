import { Star, Quote } from "lucide-react";
import { motion } from "framer-motion";

export function TestimonialsSection() {
  const testimonials = [
    {
      name: "Sarah Jenkins",
      role: "Marketing Director @ Nexa",
      content: "Working with Vulpinix changed our entire social strategy. The AI captions are scarily accurate and save us hours of brainstorming every single week.",
      avatar: "SJ",
      color: "#a78bfa",
      rating: 5
    },
    {
      name: "Michael Ross",
      role: "Founder @ Bloom Digital",
      content: "The automated workflow saved us 20+ hours a week. It's a game changer for agencies looking to scale without increasing headcount.",
      avatar: "MR",
      color: "#38bdf8",
      rating: 5
    },
    {
      name: "David Kovic",
      role: "CTO @ Stealth AI",
      content: "Cleanest UI I've seen in the SaaS space. The integration between AI generation and multi-platform publishing is seamless and intuitive.",
      avatar: "DK",
      color: "#4ade80",
      rating: 5
    }
  ];

  return (
    <section id="testimonials" style={{ padding: "100px 24px", position: "relative", overflow: "hidden" }}>
      <div style={{ maxWidth: 1280, margin: "0 auto", position: "relative", zIndex: 1 }}>
        
        {/* Heading */}
        <div style={{ textAlign: "center", marginBottom: 60 }}>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <div style={{ color: "var(--vx-text-muted)", fontSize: 12, fontWeight: 700, letterSpacing: "0.15em", textTransform: "uppercase", marginBottom: 12 }}>
              Social Proof
            </div>
            <h2 style={{ fontSize: "clamp(2rem, 4vw, 3rem)", fontWeight: 800, color: "var(--vx-text-primary)", lineHeight: 1.1, marginBottom: 20, letterSpacing: "-0.02em" }}>
              Trusted by <span style={{ color: "var(--vx-text-secondary)" }}>Growth Leaders</span>
            </h2>
            <p style={{ fontSize: "1.1rem", color: "var(--vx-text-secondary)", lineHeight: 1.7, maxWidth: 600, margin: "0 auto" }}>
              Join hundreds of marketers who have automated their social presence with Vulpinix.
            </p>
          </motion.div>
        </div>

        {/* Testimonials Grid */}
        <div style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))",
          gap: 30,
        }}>
          {testimonials.map((t, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.1 }}
              style={{
                background: "var(--vx-bg-card)",
                border: "1px solid var(--vx-border)",
                borderRadius: 24,
                padding: "40px",
                position: "relative",
                display: "flex",
                flexDirection: "column",
                transition: "all 0.3s ease",
              }}
              onMouseEnter={e => {
                const el = e.currentTarget as HTMLElement;
                el.style.transform = "translateY(-8px)";
                el.style.borderColor = t.color + "80";
                el.style.boxShadow = `0 20px 40px ${t.color}15`;
              }}
              onMouseLeave={e => {
                const el = e.currentTarget as HTMLElement;
                el.style.transform = "translateY(0)";
                el.style.borderColor = "var(--vx-border)";
                el.style.boxShadow = "none";
              }}
            >
              {/* Quote Icon */}
              <div style={{ position: "absolute", top: 30, right: 30, opacity: 0.1 }}>
                <Quote size={40} color={t.color} />
              </div>

              {/* Stars */}
              <div style={{ display: "flex", gap: 4, marginBottom: 24 }}>
                {[...Array(t.rating)].map((_, si) => (
                  <Star key={si} size={16} fill={t.color} color={t.color} />
                ))}
              </div>

              {/* Content */}
              <p style={{
                fontSize: "1.05rem",
                color: "var(--vx-text-primary)",
                lineHeight: 1.6,
                marginBottom: 32,
                fontStyle: "italic",
                flex: 1
              }}>
                "{t.content}"
              </p>

              {/* Author */}
              <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
                <div style={{
                  width: 48,
                  height: 48,
                  borderRadius: "50%",
                  background: `linear-gradient(135deg, ${t.color}, #4f46e5)`,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: 14,
                  fontWeight: 800,
                  color: "#fff",
                  boxShadow: `0 8px 16px ${t.color}30`
                }}>
                  {t.avatar}
                </div>
                <div>
                  <div style={{ fontWeight: 800, color: "var(--vx-text-primary)", fontSize: 15 }}>{t.name}</div>
                  <div style={{ fontSize: 13, color: "var(--vx-text-muted)", fontWeight: 500 }}>{t.role}</div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Decorative background element */}
      <div style={{
        position: "absolute",
        top: "50%",
        left: "50%",
        transform: "translate(-50%, -50%)",
        width: "100%",
        height: "100%",
        background: "radial-gradient(circle at 50% 50%, rgba(139,92,246,0.03) 0%, transparent 70%)",
        pointerEvents: "none",
        zIndex: 0
      }} />
    </section>
  );
}
