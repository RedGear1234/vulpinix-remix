import { motion } from "framer-motion";
import { HeroSection } from "../components/HeroSection";
import { AboutSection } from "../components/AboutSection";
import { WorkflowSection } from "../components/WorkflowSection";
import { AnalyticsSection } from "../components/AnalyticsSection";
import { IntegrationsSection } from "../components/IntegrationsSection";
import { PricingSection } from "../components/PricingSection";
import { TestimonialsSection } from "../components/TestimonialsSection";
import { ContactSection } from "../components/ContactSection";
import { Footer } from "../components/Footer";

export default function LandingPage() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.5, ease: "easeInOut" }}
      style={{ background: "var(--vx-bg-primary)", minHeight: "100vh", position: "relative", zIndex: 1 }}
    >
      <HeroSection />
      <AboutSection />
      <IntegrationsSection />
      <WorkflowSection />
      <AnalyticsSection />
      <TestimonialsSection />
      <PricingSection />
      <ContactSection />
      <Footer />
    </motion.div>
  );
}