import { useNavigate } from "react-router";
import { motion } from "framer-motion";
import { ArrowLeft, Home } from "lucide-react";
import { VulpinixLogo } from "../components/VulpinixLogo";

export default function NotFoundPage() {
  const navigate = useNavigate();

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      style={{
        background: "var(--vx-bg-primary)",
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        padding: "40px 24px",
        color: "var(--vx-text-primary)",
        position: "relative",
        overflow: "hidden"
      }}
    >
      {/* Decorative background orbs */}
      <div style={{ position: "absolute", top: "20%", left: "50%", transform: "translate(-50%, -50%)", width: "60vw", height: "60vw", background: "radial-gradient(circle, rgba(167, 139, 250, 0.08) 0%, transparent 60%)", pointerEvents: "none" }} />
      <div style={{ position: "absolute", top: "70%", left: "50%", transform: "translate(-50%, -50%)", width: "40vw", height: "40vw", background: "radial-gradient(circle, rgba(56, 189, 248, 0.05) 0%, transparent 60%)", pointerEvents: "none" }} />

      <div style={{ position: "relative", zIndex: 10, textAlign: "center", maxWidth: 600 }}>
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.6 }}
          style={{ marginBottom: 40, display: "flex", justifyContent: "center" }}
        >
          <VulpinixLogo size="lg" />
        </motion.div>

        <motion.h1
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          style={{
            fontSize: "clamp(6rem, 15vw, 12rem)",
            fontWeight: 900,
            lineHeight: 1,
            margin: 0,
            background: "linear-gradient(135deg, #fff 0%, #a78bfa 50%, #38bdf8 100%)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            letterSpacing: "-0.05em",
            textShadow: "0 20px 40px rgba(167, 139, 250, 0.2)"
          }}
        >
          404
        </motion.h1>

        <motion.h2
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          style={{
            fontSize: "clamp(1.5rem, 4vw, 2.5rem)",
            fontWeight: 800,
            margin: "24px 0 16px",
            letterSpacing: "-0.02em"
          }}
        >
          Signal Lost in Deep Space
        </motion.h2>

        <motion.p
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          style={{
            fontSize: "clamp(1rem, 2vw, 1.1rem)",
            color: "var(--vx-text-secondary)",
            lineHeight: 1.6,
            marginBottom: 48,
            maxWidth: 480,
            margin: "0 auto 48px"
          }}
        >
          The page you are looking for has drifted off our radar. It might have been moved, deleted, or perhaps it never existed in this dimension.
        </motion.p>

        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          style={{ display: "flex", flexWrap: "wrap", justifyContent: "center", gap: 16 }}
        >
          <button
            onClick={() => navigate(-1)}
            style={{
              padding: "16px 28px",
              borderRadius: 16,
              background: "rgba(255, 255, 255, 0.05)",
              border: "1px solid var(--vx-border)",
              color: "var(--vx-text-primary)",
              fontSize: 14,
              fontWeight: 700,
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              gap: 8,
              transition: "0.2s"
            }}
            onMouseEnter={e => {
              e.currentTarget.style.background = "rgba(255, 255, 255, 0.1)";
            }}
            onMouseLeave={e => {
              e.currentTarget.style.background = "rgba(255, 255, 255, 0.05)";
            }}
          >
            <ArrowLeft size={18} /> Go Back
          </button>

          <button
            onClick={() => navigate("/")}
            style={{
              padding: "16px 32px",
              borderRadius: 16,
              background: "var(--vx-text-primary)",
              color: "var(--vx-bg-primary)",
              border: "none",
              fontSize: 14,
              fontWeight: 800,
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              gap: 8,
              boxShadow: "0 10px 25px rgba(255,255,255,0.1)",
              transition: "0.2s"
            }}
            onMouseEnter={e => {
              e.currentTarget.style.transform = "translateY(-2px)";
              e.currentTarget.style.boxShadow = "0 15px 35px rgba(255,255,255,0.2)";
            }}
            onMouseLeave={e => {
              e.currentTarget.style.transform = "translateY(0)";
              e.currentTarget.style.boxShadow = "0 10px 25px rgba(255,255,255,0.1)";
            }}
          >
            <Home size={18} /> Return Home
          </button>
        </motion.div>
      </div>
    </motion.div>
  );
}
