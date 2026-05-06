import { motion } from "framer-motion";
import { useNavigate } from "react-router";
import { ArrowLeft, Cookie, CheckCircle2 } from "lucide-react";
import { Button } from "../components/ui/button";
import { Footer } from "../components/Footer";

export default function CookiePage() {
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
            <Cookie size={28} style={{ color: "var(--vx-text-primary)" }} />
          </div>
          <h1 className="vx-heading" style={{ fontSize: "clamp(2.5rem, 5vw, 4rem)", fontWeight: 800, color: "var(--vx-text-primary)", marginBottom: 16, letterSpacing: "-0.03em" }}>
            Cookie <span style={{ color: "var(--vx-text-secondary)" }}>Policy</span>
          </h1>
          <p style={{ fontSize: "1.1rem", color: "var(--vx-text-secondary)", maxWidth: 600, margin: "0 auto", lineHeight: 1.6 }}>
            Transparency about how we use cookies to improve your experience on Vulpinix.
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
                What are Cookies?
              </h2>
              <p>
                Cookies are small text files that are stored on your device (computer, tablet, or mobile) when you visit a website. They are widely used to make websites work more efficiently and provide information to the owners of the site.
              </p>
            </section>

            <section style={{ marginBottom: 48 }}>
              <h2 style={{ fontSize: 24, fontWeight: 800, color: "var(--vx-text-primary)", marginBottom: 20, display: "flex", alignItems: "center", gap: 12 }}>
                <CheckCircle2 size={22} style={{ color: "#a78bfa" }} />
                How We Use Cookies
              </h2>
              <p style={{ marginBottom: 16 }}>
                We use cookies for several reasons, including:
              </p>
              <ul style={{ listStyle: "none", padding: 0 }}>
                <li style={{ marginBottom: 12, paddingLeft: 24, position: "relative" }}>
                  <span style={{ position: "absolute", left: 0, top: 12, width: 6, height: 6, borderRadius: "50%", background: "#a78bfa" }}></span>
                  <strong>Essential Cookies:</strong> These are necessary for the website to function and cannot be switched off. They are usually only set in response to actions made by you, such as logging in or filling in forms.
                </li>
                <li style={{ marginBottom: 12, paddingLeft: 24, position: "relative" }}>
                  <span style={{ position: "absolute", left: 0, top: 12, width: 6, height: 6, borderRadius: "50%", background: "#a78bfa" }}></span>
                  <strong>Performance Cookies:</strong> These allow us to count visits and traffic sources so we can measure and improve the performance of our site. They help us know which pages are the most and least popular.
                </li>
                <li style={{ marginBottom: 12, paddingLeft: 24, position: "relative" }}>
                  <span style={{ position: "absolute", left: 0, top: 12, width: 6, height: 6, borderRadius: "50%", background: "#a78bfa" }}></span>
                  <strong>Functional Cookies:</strong> These enable the website to provide enhanced functionality and personalization. They may be set by us or by third-party providers whose services we have added to our pages.
                </li>
                <li style={{ marginBottom: 12, paddingLeft: 24, position: "relative" }}>
                  <span style={{ position: "absolute", left: 0, top: 12, width: 6, height: 6, borderRadius: "50%", background: "#a78bfa" }}></span>
                  <strong>Targeting Cookies:</strong> These may be set through our site by our advertising partners. They may be used by those companies to build a profile of your interests and show you relevant adverts on other sites.
                </li>
              </ul>
            </section>

            <section style={{ marginBottom: 48 }}>
              <h2 style={{ fontSize: 24, fontWeight: 800, color: "var(--vx-text-primary)", marginBottom: 20, display: "flex", alignItems: "center", gap: 12 }}>
                <CheckCircle2 size={22} style={{ color: "#a78bfa" }} />
                Your Choices
              </h2>
              <p style={{ marginBottom: 16 }}>
                You have the right to decide whether to accept or reject cookies. You can set or amend your web browser controls to accept or refuse cookies. If you choose to reject cookies, you may still use our website though your access to some functionality and areas of our website may be restricted.
              </p>
              <p>
                To learn more about how to manage cookies on your browser, please visit the help pages of your specific browser (Chrome, Safari, Firefox, etc.).
              </p>
            </section>

            <section>
              <h2 style={{ fontSize: 24, fontWeight: 800, color: "var(--vx-text-primary)", marginBottom: 20, display: "flex", alignItems: "center", gap: 12 }}>
                <CheckCircle2 size={22} style={{ color: "#a78bfa" }} />
                Contact Us
              </h2>
              <p style={{ marginBottom: 20 }}>
                If you have any questions about our use of cookies or other technologies, please email us at:
              </p>
              <div style={{ padding: "24px", borderRadius: 16, background: "var(--vx-bg-input)", border: "1px solid var(--vx-border)" }}>
                <p style={{ color: "var(--vx-text-primary)", fontWeight: 600, marginBottom: 4 }}>Email: privacy@vulpinix.ai</p>
                <p style={{ color: "var(--vx-text-muted)", fontSize: 14 }}>We typically respond within 24-48 hours.</p>
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
            onClick={() => navigate("/terms")}
            variant="outline"
            style={{ 
              flex: 1, height: 56, borderRadius: 16, border: "1px solid var(--vx-border)",
              background: "var(--vx-bg-card)", color: "var(--vx-text-primary)", fontWeight: 600
            }}
          >
            Terms & Conditions
          </Button>
        </div>

      </div>
      
      <Footer />
    </motion.div>
  );
}
