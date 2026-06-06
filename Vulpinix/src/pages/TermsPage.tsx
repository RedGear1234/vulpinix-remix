import { motion } from "framer-motion";
import { useNavigate } from "react-router";
import { ArrowLeft, FileText, CheckCircle2 } from "lucide-react";
import { Button } from "../components/ui/button";
import { Footer } from "../components/Footer";

export default function TermsPage() {
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
            <FileText size={28} style={{ color: "var(--vx-text-primary)" }} />
          </div>
          <h1 className="vx-heading" style={{ fontSize: "clamp(2.5rem, 5vw, 4rem)", fontWeight: 800, color: "var(--vx-text-primary)", marginBottom: 16, letterSpacing: "-0.03em" }}>
            Terms & <span style={{ color: "var(--vx-text-secondary)" }}>Conditions</span>
          </h1>
          <p style={{ fontSize: "1.1rem", color: "var(--vx-text-secondary)", maxWidth: 600, margin: "0 auto", lineHeight: 1.6 }}>
            Please review our rules and guidelines for using the Vulpinix platform.
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
                1. Acceptance of Terms
              </h2>
              <p>
                By accessing and using VULPINIX AI ("the Service"), you accept and agree to be bound by the terms and provision of this agreement. If you do not agree to abide by the above, please do not use this service.
              </p>
            </section>

            <section style={{ marginBottom: 48 }}>
              <h2 style={{ fontSize: 24, fontWeight: 800, color: "var(--vx-text-primary)", marginBottom: 20, display: "flex", alignItems: "center", gap: 12 }}>
                <CheckCircle2 size={22} style={{ color: "#a78bfa" }} />
                2. Use of Service
              </h2>
              <p style={{ marginBottom: 16 }}>
                VULPINIX AI provides AI-powered digital marketing automation services. You agree to use the Service only for lawful purposes and in accordance with these Terms.
              </p>
              <ul style={{ listStyle: "none", padding: 0 }}>
                <li style={{ marginBottom: 12, paddingLeft: 24, position: "relative" }}>
                  <span style={{ position: "absolute", left: 0, top: 12, width: 6, height: 6, borderRadius: "50%", background: "#a78bfa" }}></span>
                  You must be at least 18 years old to use this Service.
                </li>
                <li style={{ marginBottom: 12, paddingLeft: 24, position: "relative" }}>
                  <span style={{ position: "absolute", left: 0, top: 12, width: 6, height: 6, borderRadius: "50%", background: "#a78bfa" }}></span>
                  You are responsible for maintaining the confidentiality of your account.
                </li>
                <li style={{ marginBottom: 12, paddingLeft: 24, position: "relative" }}>
                  <span style={{ position: "absolute", left: 0, top: 12, width: 6, height: 6, borderRadius: "50%", background: "#a78bfa" }}></span>
                  You agree not to use the Service for any illegal or unauthorized purpose.
                </li>
              </ul>
            </section>

            <section style={{ marginBottom: 48 }}>
              <h2 style={{ fontSize: 24, fontWeight: 800, color: "var(--vx-text-primary)", marginBottom: 20, display: "flex", alignItems: "center", gap: 12 }}>
                <CheckCircle2 size={22} style={{ color: "#a78bfa" }} />
                3. AI-Generated Content
              </h2>
              <p style={{ marginBottom: 16 }}>
                Our Service uses artificial intelligence to analyze and optimize your marketing campaigns. You acknowledge that:
              </p>
              <ul style={{ listStyle: "none", padding: 0 }}>
                <li style={{ marginBottom: 12, paddingLeft: 24, position: "relative" }}>
                  <span style={{ position: "absolute", left: 0, top: 12, width: 6, height: 6, borderRadius: "50%", background: "#a78bfa" }}></span>
                  AI-generated recommendations are suggestions and not guarantees.
                </li>
                <li style={{ marginBottom: 12, paddingLeft: 24, position: "relative" }}>
                  <span style={{ position: "absolute", left: 0, top: 12, width: 6, height: 6, borderRadius: "50%", background: "#a78bfa" }}></span>
                  You retain full responsibility for all published content.
                </li>
              </ul>
            </section>

            <section style={{ marginBottom: 48 }}>
              <h2 style={{ fontSize: 24, fontWeight: 800, color: "var(--vx-text-primary)", marginBottom: 20, display: "flex", alignItems: "center", gap: 12 }}>
                <CheckCircle2 size={22} style={{ color: "#a78bfa" }} />
                4. Payment and Billing
              </h2>
              <p>
                All fees are non-refundable unless otherwise stated. You authorize us to charge your payment method for all fees associated with your account. Campaign budgets are estimates and actual costs may vary based on platform performance.
              </p>
            </section>

            <section style={{ marginBottom: 48 }}>
              <h2 style={{ fontSize: 24, fontWeight: 800, color: "var(--vx-text-primary)", marginBottom: 20, display: "flex", alignItems: "center", gap: 12 }}>
                <CheckCircle2 size={22} style={{ color: "#a78bfa" }} />
                5. Intellectual Property
              </h2>
              <p>
                The Service and its original content are owned by Vulpinix Productions. You retain ownership of content you upload, but grant us a license to use it for providing the Service.
              </p>
            </section>

            <section>
              <h2 style={{ fontSize: 24, fontWeight: 800, color: "var(--vx-text-primary)", marginBottom: 20, display: "flex", alignItems: "center", gap: 12 }}>
                <CheckCircle2 size={22} style={{ color: "#a78bfa" }} />
                Contact Legal
              </h2>
              <p style={{ marginBottom: 20 }}>
                For legal inquiries or clarifications regarding these terms, please contact:
              </p>
              <div style={{ padding: "24px", borderRadius: 16, background: "var(--vx-bg-input)", border: "1px solid var(--vx-border)" }}>
                <p style={{ color: "var(--vx-text-primary)", fontWeight: 600, marginBottom: 4 }}>Email: connect@vulpinixproductions.com</p>
                <p style={{ color: "var(--vx-text-muted)", fontSize: 14 }}>Legal Response Team</p>
              </div>
            </section>

          </div>
        </motion.div>

        {/* Action Buttons */}
        <div style={{ marginTop: 40, display: "flex", gap: 16, flexWrap: "wrap" }}>
          <Button
            onClick={() => navigate("/privacy")}
            variant="outline"
            style={{ 
              flex: 1, height: 56, borderRadius: 16, border: "1px solid var(--vx-border)",
              background: "var(--vx-bg-card)", color: "var(--vx-text-primary)", fontWeight: 600
            }}
          >
            Privacy Policy
          </Button>
          <Button
            onClick={() => navigate("/contact")}
            style={{ 
              flex: 1, height: 56, borderRadius: 16, border: "none",
              background: "var(--vx-text-primary)", color: "var(--vx-bg-primary)", fontWeight: 700
            }}
          >
            Contact Support
          </Button>
        </div>

      </div>
      
      <Footer />
    </motion.div>
  );
}
