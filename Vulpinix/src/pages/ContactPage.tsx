import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router";
import { ArrowLeft, Mail, Phone, MapPin, Send, MessageSquare, Clock, CheckCircle2 } from "lucide-react";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import { Textarea } from "../components/ui/textarea";
import { toast } from "sonner";
import { Footer } from "../components/Footer";

export default function ContactPage() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: ""
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.name || !formData.email || !formData.message) {
      toast.error("Please fill all required fields");
      return;
    }

    setIsSubmitting(true);
    
    // Simulate form submission
    setTimeout(() => {
      setIsSubmitting(false);
      toast.success("Message Sent Successfully!", {
        description: "We'll get back to you within 24 hours.",
      });
      setFormData({ name: "", email: "", subject: "", message: "" });
    }, 1500);
  };

  const contactMethods = [
    {
      icon: <Mail size={24} />,
      title: "Email Us",
      value: "support@vulpinix.ai",
      sub: "General & Technical Support",
      color: "#a78bfa"
    },
    {
      icon: <Phone size={24} />,
      title: "Call Us",
      value: "+91 123 456 7890",
      sub: "Mon-Fri, 9AM-6PM IST",
      color: "#818cf8"
    },
    {
      icon: <MapPin size={24} />,
      title: "Visit Us",
      value: "Mumbai, India",
      sub: "123 Tech Park, Mahape",
      color: "#60a5fa"
    }
  ];

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5 }}
      style={{ background: "var(--vx-bg-primary)", minHeight: "100vh", position: "relative", zIndex: 1, fontFamily: "var(--inter, 'Inter', sans-serif)" }}
    >
      <div style={{ position: "relative", zIndex: 10, maxWidth: 1200, margin: "0 auto", padding: "60px 24px 100px" }}>
        
        {/* Header / Back Button */}
        <button
          onClick={() => navigate("/")}
          style={{
            display: "inline-flex", alignItems: "center", gap: 8, background: "none", border: "none",
            color: "var(--vx-text-muted)", fontSize: 14, fontWeight: 600, cursor: "pointer",
            marginBottom: 60, transition: "color 0.2s"
          }}
          onMouseEnter={e => e.currentTarget.style.color = "var(--vx-text-primary)"}
          onMouseLeave={e => e.currentTarget.style.color = "var(--vx-text-muted)"}
        >
          <ArrowLeft size={16} />
          Back to Home
        </button>

        <div style={{ textAlign: "center", marginBottom: 80 }}>
          <h1 className="vx-heading" style={{ fontSize: "clamp(2.5rem, 5vw, 4rem)", fontWeight: 800, color: "var(--vx-text-primary)", marginBottom: 16, letterSpacing: "-0.03em" }}>
            Get in <span style={{ color: "var(--vx-text-secondary)" }}>Touch</span>
          </h1>
          <p style={{ fontSize: "1.1rem", color: "var(--vx-text-secondary)", maxWidth: 600, margin: "0 auto", lineHeight: 1.6 }}>
            Have questions about Vulpinix? Our team is here to help you scale your digital presence.
          </p>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: 32 }}>
          
          {/* Left: Contact Info */}
          <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
            {contactMethods.map((method, idx) => (
              <motion.div
                key={method.title}
                initial={{ x: -20, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ delay: 0.1 * idx }}
                style={{
                  background: "var(--vx-bg-card)",
                  border: "1px solid var(--vx-border)",
                  borderRadius: 24,
                  padding: "32px",
                  display: "flex",
                  gap: 20,
                  backdropFilter: "blur(8px)",
                  boxShadow: "var(--vx-shadow-card)"
                }}
              >
                <div style={{ width: 56, height: 56, borderRadius: 16, background: `${method.color}15`, color: method.color, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                  {method.icon}
                </div>
                <div>
                  <h3 style={{ fontSize: 14, fontWeight: 700, color: "var(--vx-text-muted)", textTransform: "uppercase", letterSpacing: "0.05em", marginBottom: 4 }}>{method.title}</h3>
                  <p style={{ fontSize: 18, fontWeight: 700, color: "var(--vx-text-primary)", marginBottom: 4 }}>{method.value}</p>
                  <p style={{ fontSize: 14, color: "var(--vx-text-secondary)" }}>{method.sub}</p>
                </div>
              </motion.div>
            ))}
            
            <motion.div
              initial={{ x: -20, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ delay: 0.3 }}
              style={{
                background: "var(--vx-bg-card)",
                border: "1px solid var(--vx-border)",
                borderRadius: 24,
                padding: "32px",
                backdropFilter: "blur(8px)",
                boxShadow: "var(--vx-shadow-card)"
              }}
            >
              <h3 style={{ fontSize: 18, fontWeight: 800, color: "var(--vx-text-primary)", marginBottom: 16 }}>Response Guarantee</h3>
              <div style={{ display: "flex", alignItems: "center", gap: 12, color: "var(--vx-text-secondary)", fontSize: 15 }}>
                <Clock size={20} style={{ color: "#10b981" }} />
                <span>We typically respond within 24 hours.</span>
              </div>
            </motion.div>
          </div>

          {/* Right: Form */}
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.4 }}
            style={{
              background: "var(--vx-bg-card)",
              border: "1px solid var(--vx-border)",
              borderRadius: 32,
              padding: "48px",
              backdropFilter: "blur(12px)",
              boxShadow: "var(--vx-shadow-card)"
            }}
          >
            <h2 style={{ fontSize: 24, fontWeight: 800, color: "var(--vx-text-primary)", marginBottom: 32 }}>Send a Message</h2>
            
            <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: 24 }}>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20 }}>
                <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                  <Label style={{ fontSize: 13, fontWeight: 600, color: "var(--vx-text-secondary)", marginLeft: 4 }}>Name</Label>
                  <Input
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="John Doe"
                    style={{ background: "var(--vx-bg-input)", border: "1px solid var(--vx-border)", borderRadius: 12, height: 50, color: "white" }}
                  />
                </div>
                <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                  <Label style={{ fontSize: 13, fontWeight: 600, color: "var(--vx-text-secondary)", marginLeft: 4 }}>Email</Label>
                  <Input
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    placeholder="john@example.com"
                    style={{ background: "var(--vx-bg-input)", border: "1px solid var(--vx-border)", borderRadius: 12, height: 50, color: "white" }}
                  />
                </div>
              </div>

              <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                <Label style={{ fontSize: 13, fontWeight: 600, color: "var(--vx-text-secondary)", marginLeft: 4 }}>Subject</Label>
                <Input
                  value={formData.subject}
                  onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                  placeholder="How can we help?"
                  style={{ background: "var(--vx-bg-input)", border: "1px solid var(--vx-border)", borderRadius: 12, height: 50, color: "white" }}
                />
              </div>

              <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                <Label style={{ fontSize: 13, fontWeight: 600, color: "var(--vx-text-secondary)", marginLeft: 4 }}>Message</Label>
                <Textarea
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  placeholder="Your message here..."
                  style={{ background: "var(--vx-bg-input)", border: "1px solid var(--vx-border)", borderRadius: 12, minHeight: 150, color: "white", resize: "none" }}
                />
              </div>

              <Button
                type="submit"
                disabled={isSubmitting}
                style={{
                  height: 56, borderRadius: 16, border: "none",
                  background: "var(--vx-text-primary)", color: "var(--vx-bg-primary)",
                  fontWeight: 700, fontSize: 16, marginTop: 8,
                  display: "flex", alignItems: "center", justifyContent: "center", gap: 10,
                  transition: "all 0.2s ease"
                }}
              >
                {isSubmitting ? "Sending..." : <>Send Message <Send size={18} /></>}
              </Button>
            </form>
          </motion.div>

        </div>

        {/* FAQ Section */}
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          whileInView={{ y: 0, opacity: 1 }}
          viewport={{ once: true }}
          style={{ marginTop: 100, padding: "48px", background: "var(--vx-bg-card)", border: "1px solid var(--vx-border)", borderRadius: 32, boxShadow: "var(--vx-shadow-card)" }}
        >
          <h2 style={{ fontSize: 28, fontWeight: 800, color: "var(--vx-text-primary)", marginBottom: 40, textAlign: "center" }}>Quick Answers</h2>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: 40 }}>
            {[
              { q: "How do I start?", a: "Create an account, upload your asset, and let our AI generate your first campaign in seconds." },
              { q: "Supported platforms?", a: "We support Instagram, Facebook, YouTube, LinkedIn, and Twitter for all campaign types." },
              { q: "Pricing plans?", a: "We offer monthly and annual subscriptions tailored for creators and businesses of all sizes." },
              { q: "Data security?", a: "Your data is encrypted using enterprise-grade protocols. We never share your assets without permission." }
            ].map(faq => (
              <div key={faq.q}>
                <h4 style={{ color: "var(--vx-text-primary)", fontWeight: 700, marginBottom: 12, display: "flex", alignItems: "center", gap: 10 }}>
                  <CheckCircle2 size={18} style={{ color: "#a78bfa" }} /> {faq.q}
                </h4>
                <p style={{ color: "var(--vx-text-secondary)", fontSize: 15, lineHeight: 1.6 }}>{faq.a}</p>
              </div>
            ))}
          </div>
        </motion.div>

      </div>
      <Footer />
    </motion.div>
  );
}
