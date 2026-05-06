import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Send, Mail, User, MessageSquare } from "lucide-react";

export function ContactSection() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: ""
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    const userInfo = localStorage.getItem("userInfo");
    const isAuthenticated = localStorage.getItem("isAuthenticated") === "true";
    setIsLoggedIn(!!userInfo || isAuthenticated);
  }, []);

  // If user is logged in, don't show the contact form
  if (isLoggedIn) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.email || !formData.message) return;

    setIsSubmitting(true);
    // Simulate API call
    setTimeout(() => {
      setIsSubmitting(false);
      setSubmitted(true);
      setFormData({ name: "", email: "", subject: "", message: "" });
      setTimeout(() => setSubmitted(false), 5000);
    }, 1500);
  };

  return (
    <section id="contact" style={{ padding: "100px 24px", position: "relative", overflow: "hidden" }}>
      <div style={{ maxWidth: 1280, margin: "0 auto", position: "relative", zIndex: 1 }}>
        
        <div style={{ 
          display: "grid", 
          gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))", 
          gap: 60,
          alignItems: "center"
        }}>
          {/* Left Side: Content */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <div style={{ color: "var(--vx-text-muted)", fontSize: 12, fontWeight: 700, letterSpacing: "0.15em", textTransform: "uppercase", marginBottom: 12 }}>
              Get In Touch
            </div>
            <h2 style={{ fontSize: "clamp(2rem, 4vw, 3rem)", fontWeight: 800, color: "var(--vx-text-primary)", lineHeight: 1.1, marginBottom: 24, letterSpacing: "-0.02em" }}>
              Have Questions? <br />
              <span style={{ color: "var(--vx-text-secondary)" }}>Let's Talk.</span>
            </h2>
            <p style={{ fontSize: "1.1rem", color: "var(--vx-text-secondary)", lineHeight: 1.7, marginBottom: 40, maxWidth: 480 }}>
              Whether you're curious about features, pricing, or even press, we're here to answer any questions you may have.
            </p>

            <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
                <div style={{ width: 44, height: 44, borderRadius: 12, background: "var(--vx-bg-input)", border: "1px solid var(--vx-border)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                  <Mail size={20} color="#38bdf8" />
                </div>
                <div>
                  <div style={{ fontSize: 13, color: "var(--vx-text-muted)", fontWeight: 600 }}>Email Us</div>
                  <div style={{ color: "var(--vx-text-primary)", fontWeight: 700 }}>support@vulpinix.ai</div>
                </div>
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
                <div style={{ width: 44, height: 44, borderRadius: 12, background: "var(--vx-bg-input)", border: "1px solid var(--vx-border)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                  <MessageSquare size={20} color="#a78bfa" />
                </div>
                <div>
                  <div style={{ fontSize: 13, color: "var(--vx-text-muted)", fontWeight: 600 }}>Live Chat</div>
                  <div style={{ color: "var(--vx-text-primary)", fontWeight: 700 }}>Available 24/7</div>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Right Side: Form */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            style={{
              background: "var(--vx-bg-card)",
              border: "1px solid var(--vx-border)",
              borderRadius: 32,
              padding: "40px",
              boxShadow: "0 30px 60px rgba(0,0,0,0.2)",
              position: "relative",
              overflow: "hidden"
            }}
          >
            {submitted ? (
              <motion.div 
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                style={{ textAlign: "center", padding: "40px 0" }}
              >
                <div style={{ width: 64, height: 64, borderRadius: "50%", background: "#4ade8020", color: "#4ade80", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 24px" }}>
                  <Send size={32} />
                </div>
                <h3 style={{ color: "var(--vx-text-primary)", fontSize: 24, fontWeight: 800, marginBottom: 12 }}>Message Sent!</h3>
                <p style={{ color: "var(--vx-text-secondary)", lineHeight: 1.6 }}>We've received your inquiry and will get back to you shortly.</p>
              </motion.div>
            ) : (
              <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: 20 }}>
                <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                  <label style={{ fontSize: 13, fontWeight: 700, color: "var(--vx-text-primary)", marginLeft: 4 }}>Full Name</label>
                  <div style={{ position: "relative" }}>
                    <User size={16} style={{ position: "absolute", left: 16, top: "50%", transform: "translateY(-50%)", color: "var(--vx-text-muted)" }} />
                    <input 
                      type="text"
                      required
                      placeholder="John Doe"
                      value={formData.name}
                      onChange={e => setFormData({...formData, name: e.target.value})}
                      style={{ width: "100%", padding: "14px 14px 14px 44px", borderRadius: 12, background: "var(--vx-bg-input)", border: "1px solid var(--vx-border)", color: "var(--vx-text-primary)", outline: "none", transition: "border-color 0.2s" }}
                    />
                  </div>
                </div>

                <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                  <label style={{ fontSize: 13, fontWeight: 700, color: "var(--vx-text-primary)", marginLeft: 4 }}>Email Address</label>
                  <div style={{ position: "relative" }}>
                    <Mail size={16} style={{ position: "absolute", left: 16, top: "50%", transform: "translateY(-50%)", color: "var(--vx-text-muted)" }} />
                    <input 
                      type="email"
                      required
                      placeholder="john@example.com"
                      value={formData.email}
                      onChange={e => setFormData({...formData, email: e.target.value})}
                      style={{ width: "100%", padding: "14px 14px 14px 44px", borderRadius: 12, background: "var(--vx-bg-input)", border: "1px solid var(--vx-border)", color: "var(--vx-text-primary)", outline: "none", transition: "border-color 0.2s" }}
                    />
                  </div>
                </div>

                <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                  <label style={{ fontSize: 13, fontWeight: 700, color: "var(--vx-text-primary)", marginLeft: 4 }}>Message</label>
                  <textarea 
                    required
                    rows={4}
                    placeholder="How can we help you?"
                    value={formData.message}
                    onChange={e => setFormData({...formData, message: e.target.value})}
                    style={{ width: "100%", padding: "14px", borderRadius: 12, background: "var(--vx-bg-input)", border: "1px solid var(--vx-border)", color: "var(--vx-text-primary)", outline: "none", transition: "border-color 0.2s", resize: "none" }}
                  />
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  style={{
                    marginTop: 10,
                    padding: "16px",
                    borderRadius: 12,
                    background: "var(--vx-text-primary)",
                    color: "var(--vx-bg-primary)",
                    fontWeight: 800,
                    fontSize: 15,
                    border: "none",
                    cursor: "pointer",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    gap: 10,
                    transition: "all 0.2s ease"
                  }}
                  onMouseEnter={e => e.currentTarget.style.opacity = "0.9"}
                  onMouseLeave={e => e.currentTarget.style.opacity = "1"}
                >
                  {isSubmitting ? "Sending..." : "Send Message"}
                  {!isSubmitting && <Send size={16} />}
                </button>
              </form>
            )}
          </motion.div>
        </div>
      </div>

      {/* Bg glow */}
      <div style={{ position: "absolute", bottom: "-10%", right: "-5%", width: "40%", height: "40%", background: "radial-gradient(circle, rgba(56,189,248,0.05) 0%, transparent 70%)", pointerEvents: "none" }} />
    </section>
  );
}
