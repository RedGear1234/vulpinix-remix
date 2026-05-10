import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowUp } from "lucide-react";

export const BackToTop = () => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const toggleVisibility = () => {
      if (window.scrollY > 400) {
        setIsVisible(true);
      } else {
        setIsVisible(false);
      }
    };

    window.addEventListener("scroll", toggleVisibility);
    return () => window.removeEventListener("scroll", toggleVisibility);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.button
          initial={{ opacity: 0, y: 30, rotate: -45 }}
          animate={{ opacity: 1, y: 0, rotate: 0 }}
          exit={{ opacity: 0, y: 30, rotate: 45 }}
          onClick={scrollToTop}
          className="back-to-top-btn"
          style={{
            position: "fixed",
            bottom: "40px",
            right: "40px",
            zIndex: 9999,
            width: "56px",
            height: "56px",
            borderRadius: "18px",
            background: "rgba(167, 139, 250, 0.15)",
            backdropFilter: "blur(16px)",
            border: "1px solid rgba(167, 139, 250, 0.3)",
            color: "#fff",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            cursor: "pointer",
            boxShadow: "0 20px 40px rgba(0,0,0,0.4), inset 0 0 0 1px rgba(255,255,255,0.1)",
          }}
          whileHover={{ 
            scale: 1.1, 
            background: "rgba(167, 139, 250, 0.3)",
            border: "1px solid rgba(167, 139, 250, 0.5)",
            boxShadow: "0 25px 50px rgba(139, 92, 246, 0.4)"
          }}
          whileTap={{ scale: 0.9 }}
          title="Back to Top"
        >
          <ArrowUp size={24} strokeWidth={2.5} />
          
          {/* Subtle Glow Effect */}
          <div style={{
            position: "absolute",
            inset: "-2px",
            borderRadius: "20px",
            background: "linear-gradient(45deg, #a78bfa, #7c3aed)",
            opacity: 0,
            zIndex: -1,
            transition: "opacity 0.3s ease",
          }} className="hover-glow" />
          
          <style>{`
            .back-to-top-btn:hover .hover-glow {
              opacity: 0.2;
            }
          `}</style>
        </motion.button>
      )}
    </AnimatePresence>
  );
};
