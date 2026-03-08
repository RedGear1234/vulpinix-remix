import { useState } from "react";
import { motion } from "motion/react";
import { useNavigate } from "react-router";
import { ArrowLeft, Mail, Phone, MapPin, Send, MessageSquare, Clock } from "lucide-react";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import { Textarea } from "../components/ui/textarea";
import { toast } from "sonner@2.0.3";

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

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5 }}
      className="min-h-screen bg-gradient-to-b from-[#0a0e27] via-[#0f1235] to-black"
    >
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 right-1/4 w-96 h-96 bg-purple-600/20 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-1/4 left-1/4 w-96 h-96 bg-cyan-600/20 rounded-full blur-3xl animate-pulse delay-1000"></div>
      </div>

      {/* AI Circuit Pattern */}
      <div className="absolute inset-0 opacity-5 pointer-events-none">
        <svg className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <pattern id="circuit-contact" x="0" y="0" width="100" height="100" patternUnits="userSpaceOnUse">
              <circle cx="50" cy="50" r="2" fill="#00ffff" />
              <line x1="50" y1="50" x2="100" y2="50" stroke="#00ffff" strokeWidth="0.5" />
              <line x1="50" y1="50" x2="50" y2="0" stroke="#00ffff" strokeWidth="0.5" />
              <circle cx="0" cy="50" r="2" fill="#a855f7" />
              <circle cx="50" cy="0" r="2" fill="#3b82f6" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#circuit-contact)" />
        </svg>
      </div>

      {/* Content */}
      <div className="relative z-10 min-h-screen px-4 sm:px-6 lg:px-8 py-12">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <Button
            variant="ghost"
            onClick={() => navigate("/")}
            className="text-cyan-400 hover:text-cyan-300 hover:bg-cyan-500/10 mb-8"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Home
          </Button>

          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="mb-12 text-center"
          >
            <div className="flex items-center justify-center gap-4 mb-4">
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-r from-purple-600 to-cyan-600 flex items-center justify-center shadow-lg shadow-cyan-500/50">
                <MessageSquare className="w-8 h-8 text-white" />
              </div>
            </div>
            <h1 className="text-4xl sm:text-5xl text-white bg-gradient-to-r from-purple-400 via-cyan-400 to-blue-400 bg-clip-text text-transparent mb-4">
              Contact Us
            </h1>
            <p className="text-xl text-gray-400 max-w-2xl mx-auto">
              Have questions? We'd love to hear from you. Send us a message and we'll respond as soon as possible.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Contact Form */}
            <motion.div
              initial={{ x: -20, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ delay: 0.3 }}
              className="lg:col-span-2 p-8 rounded-2xl bg-gradient-to-br from-gray-900/90 via-purple-900/20 to-cyan-900/20 border-2 border-purple-500/30 backdrop-blur-sm shadow-2xl shadow-purple-500/20"
            >
              <h2 className="text-2xl text-white mb-6 flex items-center gap-2">
                <Send className="w-6 h-6 text-cyan-400" />
                Send us a Message
              </h2>

              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <div>
                    <Label className="text-gray-300 mb-2">Your Name *</Label>
                    <Input
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      placeholder="John Doe"
                      className="bg-gray-900/50 border-purple-500/30 text-white focus:border-cyan-400/50"
                    />
                  </div>

                  <div>
                    <Label className="text-gray-300 mb-2">Email Address *</Label>
                    <Input
                      type="email"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      placeholder="john@example.com"
                      className="bg-gray-900/50 border-purple-500/30 text-white focus:border-cyan-400/50"
                    />
                  </div>
                </div>

                <div>
                  <Label className="text-gray-300 mb-2">Subject</Label>
                  <Input
                    value={formData.subject}
                    onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                    placeholder="How can we help you?"
                    className="bg-gray-900/50 border-purple-500/30 text-white focus:border-cyan-400/50"
                  />
                </div>

                <div>
                  <Label className="text-gray-300 mb-2">Message *</Label>
                  <Textarea
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    placeholder="Tell us more about your inquiry..."
                    rows={6}
                    className="bg-gray-900/50 border-purple-500/30 text-white focus:border-cyan-400/50 resize-none"
                  />
                </div>

                <Button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full py-6 bg-gradient-to-r from-purple-600 via-cyan-600 to-blue-600 hover:from-purple-700 hover:via-cyan-700 hover:to-blue-700 text-white rounded-xl shadow-lg shadow-cyan-500/50 hover:shadow-cyan-500/70 transition-all duration-300 hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
                >
                  {isSubmitting ? (
                    <div className="flex items-center gap-2">
                      <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                      Sending...
                    </div>
                  ) : (
                    <>
                      <Send className="w-5 h-5 mr-2" />
                      Send Message
                    </>
                  )}
                </Button>
              </form>
            </motion.div>

            {/* Contact Information */}
            <motion.div
              initial={{ x: 20, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ delay: 0.4 }}
              className="space-y-6"
            >
              {/* Email */}
              <div className="p-6 rounded-2xl bg-gradient-to-br from-gray-900/90 via-cyan-900/20 to-purple-900/20 border-2 border-cyan-500/30 backdrop-blur-sm shadow-2xl shadow-cyan-500/20">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-r from-cyan-600 to-blue-600 flex items-center justify-center flex-shrink-0">
                    <Mail className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h3 className="text-white font-semibold mb-2">Email Us</h3>
                    <p className="text-gray-400 text-sm mb-2">For general inquiries</p>
                    <a href="mailto:support@vulpinix.ai" className="text-cyan-400 hover:text-cyan-300 transition-colors">
                      support@vulpinix.ai
                    </a>
                  </div>
                </div>
              </div>

              {/* Phone */}
              <div className="p-6 rounded-2xl bg-gradient-to-br from-gray-900/90 via-purple-900/20 to-pink-900/20 border-2 border-purple-500/30 backdrop-blur-sm shadow-2xl shadow-purple-500/20">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-r from-purple-600 to-pink-600 flex items-center justify-center flex-shrink-0">
                    <Phone className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h3 className="text-white font-semibold mb-2">Call Us</h3>
                    <p className="text-gray-400 text-sm mb-2">Mon-Fri, 9AM-6PM IST</p>
                    <a href="tel:+911234567890" className="text-purple-400 hover:text-purple-300 transition-colors">
                      +91 123 456 7890
                    </a>
                  </div>
                </div>
              </div>

              {/* Office */}
              <div className="p-6 rounded-2xl bg-gradient-to-br from-gray-900/90 via-blue-900/20 to-cyan-900/20 border-2 border-blue-500/30 backdrop-blur-sm shadow-2xl shadow-blue-500/20">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-r from-blue-600 to-cyan-600 flex items-center justify-center flex-shrink-0">
                    <MapPin className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h3 className="text-white font-semibold mb-2">Visit Us</h3>
                    <p className="text-gray-400 text-sm">
                      123 Tech Park<br />
                      Mumbai, Maharashtra 400001<br />
                      India
                    </p>
                  </div>
                </div>
              </div>

              {/* Response Time */}
              <div className="p-6 rounded-2xl bg-gradient-to-br from-gray-900/90 via-green-900/20 to-emerald-900/20 border-2 border-green-500/30 backdrop-blur-sm shadow-2xl shadow-green-500/20">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-r from-green-600 to-emerald-600 flex items-center justify-center flex-shrink-0">
                    <Clock className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h3 className="text-white font-semibold mb-2">Response Time</h3>
                    <p className="text-gray-400 text-sm">
                      We typically respond within<br />
                      <span className="text-green-400 font-semibold">24 hours</span> on business days
                    </p>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>

          {/* FAQ Section */}
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="mt-12 p-8 rounded-2xl bg-gradient-to-br from-gray-900/90 via-purple-900/20 to-blue-900/20 border-2 border-purple-500/30 backdrop-blur-sm shadow-2xl shadow-purple-500/20"
          >
            <h2 className="text-2xl text-white mb-6">Frequently Asked Questions</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h3 className="text-white font-semibold mb-2">How do I get started?</h3>
                <p className="text-gray-400 text-sm">
                  Simply click "Get Started" on our homepage, create an account, and start uploading your content for AI-powered optimization.
                </p>
              </div>
              <div>
                <h3 className="text-white font-semibold mb-2">What platforms do you support?</h3>
                <p className="text-gray-400 text-sm">
                  We support Instagram, Facebook, YouTube, Twitter, and LinkedIn for campaign distribution and analytics.
                </p>
              </div>
              <div>
                <h3 className="text-white font-semibold mb-2">Is there a free trial?</h3>
                <p className="text-gray-400 text-sm">
                  Yes! We offer a 14-day free trial with full access to all features. No credit card required.
                </p>
              </div>
              <div>
                <h3 className="text-white font-semibold mb-2">How secure is my data?</h3>
                <p className="text-gray-400 text-sm">
                  We use enterprise-grade encryption and security measures to protect your data. View our Privacy Policy for details.
                </p>
              </div>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Footer */}
      <footer className="relative z-10 border-t border-purple-500/20 bg-gray-900/50 backdrop-blur-sm py-8 px-4 mt-16">
        <div className="max-w-7xl mx-auto text-center">
          <p className="text-gray-400">
            <span className="bg-gradient-to-r from-purple-400 via-cyan-400 to-blue-400 bg-clip-text text-transparent font-semibold">
              VULPINIX AI 1.0
            </span>
            {" "}— Automate Your Digital World
          </p>
        </div>
      </footer>
    </motion.div>
  );
}
