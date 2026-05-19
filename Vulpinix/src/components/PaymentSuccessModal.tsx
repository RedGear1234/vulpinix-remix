import { motion, AnimatePresence } from "framer-motion";
import { CheckCircle2, Bell, Clock, Mail, ChevronRight, Zap } from "lucide-react";

interface PaymentSuccessModalProps {
  isOpen: boolean;
  onConfirm: () => void;
  publishResults?: Record<string, { status: string; error?: string; id?: string }>;
}

export default function PaymentSuccessModal({ isOpen, onConfirm, publishResults }: PaymentSuccessModalProps) {
  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            style={{
              position: "fixed",
              inset: 0,
              background: "rgba(4, 6, 15, 0.8)",
              backdropFilter: "blur(12px)",
              zIndex: 999
            }}
          />

          {/* Modal Container */}
          <div style={{
            position: "fixed",
            inset: 0,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            padding: "20px",
            zIndex: 1000,
            pointerEvents: "none"
          }}>
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 10 }}
              style={{
                width: "100%",
                maxWidth: "480px",
                background: "#0c0d18",
                border: "1px solid var(--vx-border)",
                borderRadius: "32px",
                padding: "48px 32px 32px",
                position: "relative",
                overflow: "hidden",
                pointerEvents: "auto",
                boxShadow: "0 40px 100px rgba(0,0,0,0.6)"
              }}
            >
              {/* Top Accent Bar */}
              <div style={{
                position: "absolute",
                top: 0,
                left: 0,
                right: 0,
                height: "1px",
                background: "linear-gradient(90deg, transparent, #38bdf8, #a78bfa, transparent)"
              }} />

              {/* Decorative Glow */}
              <div style={{
                position: "absolute",
                top: "-100px",
                left: "50%",
                transform: "translateX(-50%)",
                width: "200px",
                height: "200px",
                background: "radial-gradient(circle, rgba(56, 189, 248, 0.15) 0%, transparent 70%)",
                pointerEvents: "none"
              }} />

              {/* Success Icon */}
              <div style={{
                width: "72px",
                height: "72px",
                borderRadius: "24px",
                background: "rgba(16, 185, 129, 0.1)",
                border: "1px solid rgba(16, 185, 129, 0.2)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                color: "#10b981",
                margin: "0 auto 24px"
              }}>
                <CheckCircle2 size={32} />
              </div>

              {/* Text Content */}
              <div style={{ textAlign: "center", marginBottom: 32 }}>
                <h2 style={{ fontSize: "24px", fontWeight: 800, color: "var(--vx-text-primary)", margin: "0 0 12px", letterSpacing: "-0.02em" }}>
                  Submission Received
                </h2>
                <p style={{ fontSize: "15px", color: "var(--vx-text-secondary)", lineHeight: 1.6, margin: 0 }}>
                  Your campaign content has been successfully submitted and processed.
                </p>
              </div>

              {/* Publish Results Panel */}
              {publishResults && Object.keys(publishResults).length > 0 && (
                <div style={{
                  marginBottom: "28px",
                  padding: "20px",
                  background: "rgba(255, 255, 255, 0.02)",
                  border: "1px solid var(--vx-border)",
                  borderRadius: "20px",
                  textAlign: "left"
                }}>
                  <div style={{ fontSize: "11px", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.05em", color: "var(--vx-text-muted)", marginBottom: "12px" }}>
                    Instant Publishing Status
                  </div>
                  <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                    {Object.entries(publishResults).map(([platform, res]) => (
                      <div key={platform} style={{ display: "flex", flexDirection: "column", gap: 4 }}>
                        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                          <span style={{ fontSize: "13px", fontWeight: 600, textTransform: "capitalize", color: "var(--vx-text-primary)" }}>
                            {platform}
                          </span>
                          {res.status === "success" ? (
                            <span style={{ fontSize: "11px", fontWeight: 700, color: "#10b981", display: "flex", alignItems: "center", gap: 4 }}>
                              ● Published
                            </span>
                          ) : (
                            <span style={{ fontSize: "11px", fontWeight: 700, color: "#ef4444", display: "flex", alignItems: "center", gap: 4 }}>
                              ● Failed
                            </span>
                          )}
                        </div>
                        {res.status !== "success" && res.error && (
                          <div style={{ fontSize: "11px", color: "rgba(239, 68, 68, 0.85)", lineHeight: 1.4, paddingLeft: "8px", borderLeft: "2px solid #ef4444", whiteSpace: "pre-line" }}>
                            {res.error}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Step Indicators (Bento Style) */}
              <div style={{ display: "flex", flexDirection: "column", gap: 12, marginBottom: 40 }}>
                {[
                  { icon: Clock, text: "Approved within 12 hours", color: "#a78bfa" },
                  { icon: Bell, text: "Live platform notifications", color: "#38bdf8" },
                  { icon: Mail, text: "Detailed email report", color: "#10b981" }
                ].map((item, idx) => (
                  <div key={idx} style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 16,
                    padding: "16px",
                    background: "var(--vx-bg-input)",
                    border: "1px solid var(--vx-border)",
                    borderRadius: "16px"
                  }}>
                    <div style={{ color: item.color }}>
                      <item.icon size={18} />
                    </div>
                    <span style={{ fontSize: "14px", fontWeight: 600, color: "var(--vx-text-primary)" }}>{item.text}</span>
                  </div>
                ))}
              </div>

              {/* Action Button */}
              <button
                onClick={onConfirm}
                style={{
                  width: "100%",
                  padding: "18px",
                  borderRadius: "16px",
                  background: "var(--vx-text-primary)",
                  color: "var(--vx-bg-primary)",
                  border: "none",
                  fontWeight: 800,
                  fontSize: "16px",
                  cursor: "pointer",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: 10,
                  transition: "transform 0.2s"
                }}
                onMouseEnter={(e) => (e.currentTarget.style.transform = "scale(1.02)")}
                onMouseLeave={(e) => (e.currentTarget.style.transform = "scale(1)")}
              >
                Go to Dashboard <ChevronRight size={18} />
              </button>

              <p style={{ textAlign: "center", fontSize: "11px", fontWeight: 700, color: "var(--vx-text-muted)", marginTop: 20, textTransform: "uppercase", letterSpacing: "0.05em" }}>
                <Zap size={10} style={{ display: "inline", marginRight: 4, fill: "currentColor" }} /> Powered by Vulpinix AI
              </p>
            </motion.div>
          </div>
        </>
      )}
    </AnimatePresence>
  );
}
