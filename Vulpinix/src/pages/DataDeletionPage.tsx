import { motion } from "framer-motion";
import { useNavigate } from "react-router";
import {
  ArrowLeft,
  Trash2,
  CheckCircle2,
  AlertTriangle,
  UserX,
  Database,
  Mail,
  Clock,
  ShieldOff,
  FileWarning,
} from "lucide-react";
import { Button } from "../components/ui/button";
import { Footer } from "../components/Footer";

const steps = [
  {
    number: "01",
    icon: <Mail size={22} style={{ color: "#f87171" }} />,
    title: "Send a Deletion Request",
    description:
      "Email us at connect@vulpinixproductions.com with the subject line \"Data Deletion Request\". Include the email address tied to your Vulpinix account so we can verify ownership.",
  },
  {
    number: "02",
    icon: <ShieldOff size={22} style={{ color: "#f87171" }} />,
    title: "Identity Verification",
    description:
      "Our team will send a one-time confirmation email to your registered address within 24 hours. You must click the confirmation link to authorise the deletion.",
  },
  {
    number: "03",
    icon: <Database size={22} style={{ color: "#f87171" }} />,
    title: "Data Purge Initiated",
    description:
      "Once confirmed, we will permanently delete your account, profile, campaign history, generated content, connected social accounts, and all stored analytics within 30 days.",
  },
  {
    number: "04",
    icon: <Clock size={22} style={{ color: "#f87171" }} />,
    title: "Deletion Confirmation",
    description:
      "You will receive a final email confirming that all your personal data has been permanently erased from our active systems and backups.",
  },
];

const dataTypes = [
  { label: "Account & Profile Information", sub: "Name, email, profile photo, bio" },
  { label: "Campaign & Ad Data", sub: "All AI-generated content, images, videos, captions" },
  { label: "Connected Social Accounts", sub: "OAuth tokens for Instagram, Facebook, TikTok, etc." },
  { label: "Analytics & Performance Data", sub: "Impressions, clicks, engagement metrics" },
  { label: "Billing & Payment Records", sub: "Transaction history and subscription details" },
  { label: "AI Usage History", sub: "Prompts, generated outputs, and feedback logs" },
];

export default function DataDeletionPage() {
  const navigate = useNavigate();

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5 }}
      style={{
        background: "var(--vx-bg-primary)",
        minHeight: "100vh",
        position: "relative",
        zIndex: 1,
        fontFamily: "var(--inter, 'Inter', sans-serif)",
      }}
    >
      <div
        style={{
          position: "relative",
          zIndex: 10,
          maxWidth: 1000,
          margin: "0 auto",
          padding: "60px 24px 100px",
        }}
      >
        {/* Back Button */}
        <button
          onClick={() => navigate("/")}
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: 8,
            background: "none",
            border: "none",
            color: "var(--vx-text-muted)",
            fontSize: 14,
            fontWeight: 600,
            cursor: "pointer",
            marginBottom: 60,
            transition: "color 0.2s",
          }}
          onMouseEnter={(e) => (e.currentTarget.style.color = "var(--vx-text-primary)")}
          onMouseLeave={(e) => (e.currentTarget.style.color = "var(--vx-text-muted)")}
        >
          <ArrowLeft size={16} />
          Back to Home
        </button>

        {/* Hero */}
        <div className="vx-reveal" style={{ textAlign: "center", marginBottom: 80 }}>
          <div
            style={{
              display: "inline-flex",
              alignItems: "center",
              justifyContent: "center",
              width: 64,
              height: 64,
              borderRadius: 20,
              background: "var(--vx-bg-card)",
              border: "1px solid var(--vx-border)",
              marginBottom: 24,
              boxShadow: "var(--vx-shadow-card)",
            }}
          >
            <Trash2 size={28} style={{ color: "#f87171" }} />
          </div>
          <h1
            className="vx-heading"
            style={{
              fontSize: "clamp(2.5rem, 5vw, 4rem)",
              fontWeight: 800,
              color: "var(--vx-text-primary)",
              marginBottom: 16,
              letterSpacing: "-0.03em",
            }}
          >
            Data{" "}
            <span style={{ color: "var(--vx-text-secondary)" }}>Deletion</span>
          </h1>
          <p
            style={{
              fontSize: "1.1rem",
              color: "var(--vx-text-secondary)",
              maxWidth: 600,
              margin: "0 auto",
              lineHeight: 1.6,
            }}
          >
            Your data belongs to you. Learn how to permanently erase your
            information from Vulpinix — no questions asked.
          </p>
          <p style={{ color: "var(--vx-text-muted)", marginTop: 16, fontSize: 14 }}>
            Last updated: June 6, 2026
          </p>
        </div>

        {/* Warning Banner */}
        <motion.div
          initial={{ y: 16, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.15 }}
          style={{
            display: "flex",
            gap: 16,
            alignItems: "flex-start",
            background: "rgba(248, 113, 113, 0.08)",
            border: "1px solid rgba(248, 113, 113, 0.3)",
            borderRadius: 20,
            padding: "24px 28px",
            marginBottom: 40,
          }}
        >
          <AlertTriangle
            size={22}
            style={{ color: "#f87171", flexShrink: 0, marginTop: 2 }}
          />
          <div>
            <p
              style={{
                color: "#f87171",
                fontWeight: 700,
                fontSize: 15,
                marginBottom: 6,
              }}
            >
              This action is permanent and irreversible.
            </p>
            <p
              style={{
                color: "var(--vx-text-secondary)",
                fontSize: 14,
                lineHeight: 1.6,
                margin: 0,
              }}
            >
              Once your data is deleted, it cannot be recovered. All campaigns,
              AI-generated content, connected accounts, and analytics will be
              permanently erased. We recommend exporting any data you wish to
              keep before submitting a request.
            </p>
          </div>
        </motion.div>

        {/* Step-by-Step Process */}
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
            backdropFilter: "blur(12px)",
            marginBottom: 32,
          }}
        >
          <h2
            style={{
              fontSize: 24,
              fontWeight: 800,
              color: "var(--vx-text-primary)",
              marginBottom: 8,
              display: "flex",
              alignItems: "center",
              gap: 12,
            }}
          >
            <CheckCircle2 size={22} style={{ color: "#a78bfa" }} />
            How to Delete Your Data
          </h2>
          <p
            style={{
              color: "var(--vx-text-muted)",
              fontSize: 14,
              marginBottom: 40,
            }}
          >
            Follow these four steps to permanently remove your account and all
            associated data.
          </p>

          <div
            style={{
              display: "grid",
              gap: 20,
              gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
            }}
          >
            {steps.map((step, i) => (
              <motion.div
                key={step.number}
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.25 + i * 0.08 }}
                style={{
                  background: "var(--vx-bg-input)",
                  border: "1px solid var(--vx-border)",
                  borderRadius: 20,
                  padding: "28px 24px",
                  position: "relative",
                  overflow: "hidden",
                }}
              >
                {/* Step number watermark */}
                <span
                  style={{
                    position: "absolute",
                    top: 12,
                    right: 16,
                    fontSize: 48,
                    fontWeight: 900,
                    color: "rgba(248,113,113,0.07)",
                    lineHeight: 1,
                    userSelect: "none",
                    letterSpacing: "-2px",
                  }}
                >
                  {step.number}
                </span>

                <div
                  style={{
                    display: "inline-flex",
                    alignItems: "center",
                    justifyContent: "center",
                    width: 44,
                    height: 44,
                    borderRadius: 14,
                    background: "rgba(248,113,113,0.1)",
                    border: "1px solid rgba(248,113,113,0.2)",
                    marginBottom: 16,
                  }}
                >
                  {step.icon}
                </div>
                <h3
                  style={{
                    fontSize: 16,
                    fontWeight: 700,
                    color: "var(--vx-text-primary)",
                    marginBottom: 10,
                  }}
                >
                  {step.title}
                </h3>
                <p
                  style={{
                    fontSize: 14,
                    color: "var(--vx-text-secondary)",
                    lineHeight: 1.7,
                    margin: 0,
                  }}
                >
                  {step.description}
                </p>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* What Gets Deleted */}
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.35 }}
          style={{
            background: "var(--vx-bg-card)",
            border: "1px solid var(--vx-border)",
            borderRadius: 32,
            padding: "48px",
            boxShadow: "var(--vx-shadow-card)",
            backdropFilter: "blur(12px)",
            marginBottom: 32,
          }}
        >
          <h2
            style={{
              fontSize: 24,
              fontWeight: 800,
              color: "var(--vx-text-primary)",
              marginBottom: 8,
              display: "flex",
              alignItems: "center",
              gap: 12,
            }}
          >
            <FileWarning size={22} style={{ color: "#a78bfa" }} />
            What Gets Permanently Deleted
          </h2>
          <p
            style={{
              color: "var(--vx-text-muted)",
              fontSize: 14,
              marginBottom: 32,
            }}
          >
            Upon a confirmed deletion request, the following data categories
            will be permanently erased from our systems and backups within 30
            days.
          </p>

          <div
            style={{
              display: "grid",
              gap: 12,
              gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
            }}
          >
            {dataTypes.map((item, i) => (
              <motion.div
                key={item.label}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.4 + i * 0.06 }}
                style={{
                  display: "flex",
                  alignItems: "flex-start",
                  gap: 14,
                  padding: "18px 20px",
                  background: "var(--vx-bg-input)",
                  border: "1px solid var(--vx-border)",
                  borderRadius: 16,
                }}
              >
                <div
                  style={{
                    width: 8,
                    height: 8,
                    borderRadius: "50%",
                    background: "#f87171",
                    flexShrink: 0,
                    marginTop: 6,
                  }}
                />
                <div>
                  <p
                    style={{
                      fontSize: 14,
                      fontWeight: 700,
                      color: "var(--vx-text-primary)",
                      marginBottom: 2,
                    }}
                  >
                    {item.label}
                  </p>
                  <p
                    style={{
                      fontSize: 13,
                      color: "var(--vx-text-muted)",
                      margin: 0,
                    }}
                  >
                    {item.sub}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Additional Info */}
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.45 }}
          style={{
            background: "var(--vx-bg-card)",
            border: "1px solid var(--vx-border)",
            borderRadius: 32,
            padding: "48px",
            boxShadow: "var(--vx-shadow-card)",
            backdropFilter: "blur(12px)",
            marginBottom: 32,
            color: "var(--vx-text-secondary)",
            fontSize: "1.05rem",
            lineHeight: 1.8,
          }}
        >
          <section style={{ marginBottom: 40 }}>
            <h2
              style={{
                fontSize: 24,
                fontWeight: 800,
                color: "var(--vx-text-primary)",
                marginBottom: 16,
                display: "flex",
                alignItems: "center",
                gap: 12,
              }}
            >
              <CheckCircle2 size={22} style={{ color: "#a78bfa" }} />
              Retention Exceptions
            </h2>
            <p style={{ marginBottom: 12 }}>
              Certain data may be retained beyond the 30-day window where
              required by law or for legitimate business purposes:
            </p>
            <ul style={{ listStyle: "none", padding: 0 }}>
              {[
                "Financial transaction records required for tax compliance (typically 7 years)",
                "Fraud prevention and security logs required by applicable regulations",
                "Anonymised, aggregated analytics data that cannot identify you",
              ].map((item) => (
                <li
                  key={item}
                  style={{
                    marginBottom: 12,
                    paddingLeft: 24,
                    position: "relative",
                  }}
                >
                  <span
                    style={{
                      position: "absolute",
                      left: 0,
                      top: 12,
                      width: 6,
                      height: 6,
                      borderRadius: "50%",
                      background: "#a78bfa",
                    }}
                  />
                  {item}
                </li>
              ))}
            </ul>
          </section>

          <section style={{ marginBottom: 40 }}>
            <h2
              style={{
                fontSize: 24,
                fontWeight: 800,
                color: "var(--vx-text-primary)",
                marginBottom: 16,
                display: "flex",
                alignItems: "center",
                gap: 12,
              }}
            >
              <CheckCircle2 size={22} style={{ color: "#a78bfa" }} />
              Your Rights
            </h2>
            <p>
              Under GDPR, CCPA, and other applicable privacy regulations, you
              have the right to access, correct, port, restrict, and erase the
              personal data we hold about you. Submitting a Data Deletion
              Request exercises your right to erasure ("right to be forgotten").
              You may also contact our Data Protection Officer for any other
              data-related rights at{" "}
              <a
                href="mailto:connect@vulpinixproductions.com"
                style={{ color: "#a78bfa", fontWeight: 600 }}
              >
                connect@vulpinixproductions.com
              </a>
              .
            </p>
          </section>

          <section>
            <h2
              style={{
                fontSize: 24,
                fontWeight: 800,
                color: "var(--vx-text-primary)",
                marginBottom: 16,
                display: "flex",
                alignItems: "center",
                gap: 12,
              }}
            >
              <UserX size={22} style={{ color: "#a78bfa" }} />
              Contact Us
            </h2>
            <p style={{ marginBottom: 20 }}>
              To submit a deletion request or for any questions regarding your
              data, reach out to our Data Protection team:
            </p>
            <div
              style={{
                padding: "24px",
                borderRadius: 16,
                background: "var(--vx-bg-input)",
                border: "1px solid var(--vx-border)",
              }}
            >
              <p
                style={{
                  color: "var(--vx-text-primary)",
                  fontWeight: 600,
                  marginBottom: 4,
                }}
              >
                Email: connect@vulpinixproductions.com
              </p>
              <p style={{ color: "var(--vx-text-muted)", fontSize: 14, marginBottom: 4 }}>
                Subject line: <strong>Data Deletion Request</strong>
              </p>
              <p style={{ color: "var(--vx-text-muted)", fontSize: 14, margin: 0 }}>
                Response guaranteed within 24 hours. Deletion completed within 30 days.
              </p>
            </div>
          </section>
        </motion.div>

        {/* Action Buttons */}
        <div
          style={{
            marginTop: 40,
            display: "flex",
            gap: 16,
            flexWrap: "wrap",
          }}
        >
          <Button
            onClick={() => navigate("/privacy")}
            variant="outline"
            style={{
              flex: 1,
              height: 56,
              borderRadius: 16,
              border: "1px solid var(--vx-border)",
              background: "var(--vx-bg-card)",
              color: "var(--vx-text-primary)",
              fontWeight: 600,
            }}
          >
            Privacy Policy
          </Button>
          <Button
            onClick={() =>
              (window.location.href =
                "mailto:connect@vulpinixproductions.com?subject=Data%20Deletion%20Request")
            }
            style={{
              flex: 1,
              height: 56,
              borderRadius: 16,
              border: "none",
              background: "#f87171",
              color: "#fff",
              fontWeight: 700,
            }}
          >
            Submit Deletion Request
          </Button>
        </div>
      </div>

      <Footer />
    </motion.div>
  );
}
