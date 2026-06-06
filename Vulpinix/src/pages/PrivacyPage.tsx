import { motion } from "framer-motion";
import { useNavigate } from "react-router";
import { ArrowLeft, Shield, CheckCircle2 } from "lucide-react";
import { Button } from "../components/ui/button";
import { Footer } from "../components/Footer";

export default function PrivacyPage() {
  const navigate = useNavigate();

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5 }}
      style={{ background: "var(--vx-bg-primary)", minHeight: "100vh", position: "relative", zIndex: 1, fontFamily: "var(--inter, 'Inter', sans-serif)" }}
    >
      {/* Content */}
      <div style={{ position: "relative", zIndex: 10, maxWidth: 1000, margin: "0 auto", padding: "60px 24px 100px" }}>
        
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

        <div className="vx-reveal" style={{ textAlign: "center", marginBottom: 80 }}>
          <div style={{ display: "inline-flex", alignItems: "center", justifyContent: "center", width: 64, height: 64, borderRadius: 20, background: "var(--vx-bg-card)", border: "1px solid var(--vx-border)", marginBottom: 24, boxShadow: "var(--vx-shadow-card)" }}>
            <Shield size={28} style={{ color: "var(--vx-text-primary)" }} />
          </div>
          <h1 className="vx-heading" style={{ fontSize: "clamp(2.5rem, 5vw, 4rem)", fontWeight: 800, color: "var(--vx-text-primary)", marginBottom: 16, letterSpacing: "-0.03em" }}>
            Privacy <span style={{ color: "var(--vx-text-secondary)" }}>Policy</span>
          </h1>
          <p style={{ fontSize: "1.1rem", color: "var(--vx-text-secondary)", maxWidth: 600, margin: "0 auto", lineHeight: 1.6 }}>
            Transparency about how we collect, use, and protect your data.
          </p>
          <p style={{ color: "var(--vx-text-muted)", marginTop: 16, fontSize: 14 }}>Last updated: February 13, 2026</p>
        </div>

        {/* Content Card */}
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2 }}
          style={{ 
            background: "var(--vx-bg-card)", 
            border: "1px solid var(--vx-border)", 
            borderRadius: 32, 
            padding: "48px",
            boxShadow: "var(--vx-shadow-card)",
            backdropFilter: "blur(12px)"
          }}
        >
          <div style={{ color: "var(--vx-text-secondary)", fontSize: "1.05rem", lineHeight: 1.8 }}>
            
            <section style={{ marginBottom: 48 }}>
              <h2 style={{ fontSize: 24, fontWeight: 800, color: "var(--vx-text-primary)", marginBottom: 20, display: "flex", alignItems: "center", gap: 12 }}>
                <CheckCircle2 size={22} style={{ color: "#a78bfa" }} />
                1. Introduction
              </h2>
              <p>
                At VULPINIX AI, we take your privacy seriously. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you use our AI-powered digital marketing automation service.
              </p>
            </section>

            <section style={{ marginBottom: 48 }}>
              <h2 style={{ fontSize: 24, fontWeight: 800, color: "var(--vx-text-primary)", marginBottom: 20, display: "flex", alignItems: "center", gap: 12 }}>
                <CheckCircle2 size={22} style={{ color: "#a78bfa" }} />
                2. Information We Collect
              </h2>
              <p style={{ marginBottom: 16 }}>
                We collect information that you provide directly to us, including:
              </p>
              <ul style={{ listStyle: "none", padding: 0 }}>
                <li style={{ marginBottom: 12, paddingLeft: 24, position: "relative" }}>
                  <span style={{ position: "absolute", left: 0, top: 12, width: 6, height: 6, borderRadius: "50%", background: "#a78bfa" }}></span>
                  <strong>Personal Information:</strong> Name, email address, phone number, and location.
                </li>
                <li style={{ marginBottom: 12, paddingLeft: 24, position: "relative" }}>
                  <span style={{ position: "absolute", left: 0, top: 12, width: 6, height: 6, borderRadius: "50%", background: "#a78bfa" }}></span>
                  <strong>Campaign Data:</strong> Marketing content, images, videos, and targeting preferences.
                </li>
                <li style={{ marginBottom: 12, paddingLeft: 24, position: "relative" }}>
                  <span style={{ position: "absolute", left: 0, top: 12, width: 6, height: 6, borderRadius: "50%", background: "#a78bfa" }}></span>
                  <strong>Usage Data:</strong> Analytics, performance metrics, and interaction data.
                </li>
              </ul>
            </section>

            <section style={{ marginBottom: 48 }}>
              <h2 style={{ fontSize: 24, fontWeight: 800, color: "var(--vx-text-primary)", marginBottom: 20, display: "flex", alignItems: "center", gap: 12 }}>
                <CheckCircle2 size={22} style={{ color: "#a78bfa" }} />
                3. How We Use Your Information
              </h2>
              <p>
                We use the information we collect to provide, maintain, and improve our AI-powered services. This includes processing transactions, analyzing campaign performance, and communicating platform updates or security notices. We implement strict security measures to protect AI-processed data and ensure it remains confidential.
              </p>
            </section>

            <section style={{ marginBottom: 48 }}>
              <h2 style={{ fontSize: 24, fontWeight: 800, color: "var(--vx-text-primary)", marginBottom: 20, display: "flex", alignItems: "center", gap: 12 }}>
                <CheckCircle2 size={22} style={{ color: "#a78bfa" }} />
                4. Data Security
              </h2>
              <p>
                We implement industry-standard security measures including encryption of data in transit and at rest, secure authentication controls, and regular security audits. While we strive to protect your data, no method of transmission over the internet is 100% secure.
              </p>
            </section>

            <section>
              <h2 style={{ fontSize: 24, fontWeight: 800, color: "var(--vx-text-primary)", marginBottom: 20, display: "flex", alignItems: "center", gap: 12 }}>
                <CheckCircle2 size={22} style={{ color: "#a78bfa" }} />
                Data Protection Office
              </h2>
              <p style={{ marginBottom: 20 }}>
                If you have questions about your data or wish to exercise your privacy rights, please contact our Data Protection Officer:
              </p>
              <div style={{ padding: "24px", borderRadius: 16, background: "var(--vx-bg-input)", border: "1px solid var(--vx-border)" }}>
                <p style={{ color: "var(--vx-text-primary)", fontWeight: 600, marginBottom: 4 }}>Email: connect@vulpinixproductions.com</p>
                <p style={{ color: "var(--vx-text-muted)", fontSize: 14 }}>Response guaranteed within 24 hours.</p>
              </div>
            </section>

          </div>
        </motion.div>

        {/* Action Buttons */}
        <div style={{ marginTop: 40, display: "flex", gap: 16, flexWrap: "wrap" }}>
          <Button
            onClick={() => navigate("/terms")}
            variant="outline"
            style={{ 
              flex: 1, height: 56, borderRadius: 16, border: "1px solid var(--vx-border)",
              background: "var(--vx-bg-card)", color: "var(--vx-text-primary)", fontWeight: 600
            }}
          >
            Terms & Conditions
          </Button>
          <Button
            onClick={() => navigate("/cookies")}
            variant="outline"
            style={{ 
              flex: 1, height: 56, borderRadius: 16, border: "1px solid var(--vx-border)",
              background: "var(--vx-bg-card)", color: "var(--vx-text-primary)", fontWeight: 600
            }}
          >
            Cookie Policy
          </Button>
        </div>

      </div>
      
      <Footer />
    </motion.div>
  );
}
