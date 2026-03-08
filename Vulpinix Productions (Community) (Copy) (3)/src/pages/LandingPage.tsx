import { motion } from "framer-motion";
import { HeroSection } from "../components/HeroSection";
import { AboutSection } from "../components/AboutSection";
import { WorkflowSection } from "../components/WorkflowSection";
import { AnalyticsSection } from "../components/AnalyticsSection";
import { PricingSection } from "../components/PricingSection";
import { Footer } from "../components/Footer";

export default function LandingPage() {
  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.5, ease: "easeInOut" }}
      className="min-h-screen bg-gradient-to-b from-[#0a0e27] via-[#0f1235] to-black"
    >
      <HeroSection />
      <AboutSection />
      <WorkflowSection />
      <AnalyticsSection />
      <PricingSection />
      <Footer />
    </motion.div>
  );
}