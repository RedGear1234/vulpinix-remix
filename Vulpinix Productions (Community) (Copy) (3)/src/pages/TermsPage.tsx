import { motion } from "motion/react";
import { useNavigate } from "react-router";
import { ArrowLeft, FileText, CheckCircle2 } from "lucide-react";
import { Button } from "../components/ui/button";

export default function TermsPage() {
  const navigate = useNavigate();

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
            <pattern id="circuit-terms" x="0" y="0" width="100" height="100" patternUnits="userSpaceOnUse">
              <circle cx="50" cy="50" r="2" fill="#00ffff" />
              <line x1="50" y1="50" x2="100" y2="50" stroke="#00ffff" strokeWidth="0.5" />
              <line x1="50" y1="50" x2="50" y2="0" stroke="#00ffff" strokeWidth="0.5" />
              <circle cx="0" cy="50" r="2" fill="#a855f7" />
              <circle cx="50" cy="0" r="2" fill="#3b82f6" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#circuit-terms)" />
        </svg>
      </div>

      {/* Content */}
      <div className="relative z-10 min-h-screen px-4 sm:px-6 lg:px-8 py-12">
        <div className="max-w-4xl mx-auto">
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
            className="mb-12"
          >
            <div className="flex items-center gap-4 mb-4">
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-r from-purple-600 to-cyan-600 flex items-center justify-center shadow-lg shadow-cyan-500/50">
                <FileText className="w-8 h-8 text-white" />
              </div>
              <div>
                <h1 className="text-4xl sm:text-5xl text-white bg-gradient-to-r from-purple-400 via-cyan-400 to-blue-400 bg-clip-text text-transparent">
                  Terms & Conditions
                </h1>
                <p className="text-gray-400 mt-2">Last updated: February 13, 2026</p>
              </div>
            </div>
          </motion.div>

          {/* Terms Content */}
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="p-8 rounded-2xl bg-gradient-to-br from-gray-900/90 via-purple-900/20 to-cyan-900/20 border-2 border-purple-500/30 backdrop-blur-sm shadow-2xl shadow-purple-500/20"
          >
            <div className="prose prose-invert max-w-none">
              <section className="mb-8">
                <h2 className="text-2xl text-white mb-4 flex items-center gap-2">
                  <CheckCircle2 className="w-6 h-6 text-cyan-400" />
                  1. Acceptance of Terms
                </h2>
                <p className="text-gray-300 leading-relaxed">
                  By accessing and using VULPINIX AI 1.0 ("the Service"), you accept and agree to be bound by the terms and provision of this agreement. If you do not agree to abide by the above, please do not use this service.
                </p>
              </section>

              <section className="mb-8">
                <h2 className="text-2xl text-white mb-4 flex items-center gap-2">
                  <CheckCircle2 className="w-6 h-6 text-purple-400" />
                  2. Use of Service
                </h2>
                <p className="text-gray-300 leading-relaxed mb-4">
                  VULPINIX AI 1.0 provides AI-powered digital marketing automation services. You agree to use the Service only for lawful purposes and in accordance with these Terms.
                </p>
                <ul className="list-disc list-inside text-gray-300 space-y-2 ml-4">
                  <li>You must be at least 18 years old to use this Service</li>
                  <li>You are responsible for maintaining the confidentiality of your account</li>
                  <li>You agree not to use the Service for any illegal or unauthorized purpose</li>
                  <li>You will not transmit any malicious code or harmful content</li>
                </ul>
              </section>

              <section className="mb-8">
                <h2 className="text-2xl text-white mb-4 flex items-center gap-2">
                  <CheckCircle2 className="w-6 h-6 text-cyan-400" />
                  3. AI-Generated Content
                </h2>
                <p className="text-gray-300 leading-relaxed mb-4">
                  Our Service uses artificial intelligence to analyze and optimize your marketing campaigns. You acknowledge that:
                </p>
                <ul className="list-disc list-inside text-gray-300 space-y-2 ml-4">
                  <li>AI-generated recommendations are suggestions and not guarantees</li>
                  <li>You retain full responsibility for all published content</li>
                  <li>You should review and approve all AI-generated content before publishing</li>
                  <li>VULPINIX AI is not liable for the performance of AI-optimized campaigns</li>
                </ul>
              </section>

              <section className="mb-8">
                <h2 className="text-2xl text-white mb-4 flex items-center gap-2">
                  <CheckCircle2 className="w-6 h-6 text-purple-400" />
                  4. Payment and Billing
                </h2>
                <p className="text-gray-300 leading-relaxed mb-4">
                  By using our paid services, you agree to the following:
                </p>
                <ul className="list-disc list-inside text-gray-300 space-y-2 ml-4">
                  <li>All fees are non-refundable unless otherwise stated</li>
                  <li>You authorize us to charge your payment method for all fees</li>
                  <li>Campaign budgets are estimates and actual costs may vary</li>
                  <li>Payment processing is handled securely through third-party providers</li>
                </ul>
              </section>

              <section className="mb-8">
                <h2 className="text-2xl text-white mb-4 flex items-center gap-2">
                  <CheckCircle2 className="w-6 h-6 text-cyan-400" />
                  5. Intellectual Property
                </h2>
                <p className="text-gray-300 leading-relaxed">
                  The Service and its original content, features, and functionality are owned by Vulpinix Productions and are protected by international copyright, trademark, patent, trade secret, and other intellectual property laws. You retain ownership of content you upload, but grant us a license to use it for providing the Service.
                </p>
              </section>

              <section className="mb-8">
                <h2 className="text-2xl text-white mb-4 flex items-center gap-2">
                  <CheckCircle2 className="w-6 h-6 text-purple-400" />
                  6. Third-Party Platforms
                </h2>
                <p className="text-gray-300 leading-relaxed mb-4">
                  Our Service integrates with third-party platforms (Instagram, Facebook, YouTube, etc.):
                </p>
                <ul className="list-disc list-inside text-gray-300 space-y-2 ml-4">
                  <li>You must comply with each platform's terms of service</li>
                  <li>We are not responsible for changes to third-party platform policies</li>
                  <li>Platform availability and features may change without notice</li>
                  <li>You authorize us to access your accounts on these platforms</li>
                </ul>
              </section>

              <section className="mb-8">
                <h2 className="text-2xl text-white mb-4 flex items-center gap-2">
                  <CheckCircle2 className="w-6 h-6 text-cyan-400" />
                  7. Limitation of Liability
                </h2>
                <p className="text-gray-300 leading-relaxed">
                  In no event shall VULPINIX AI, nor its directors, employees, partners, agents, suppliers, or affiliates, be liable for any indirect, incidental, special, consequential or punitive damages, including loss of profits, data, use, goodwill, or other intangible losses, resulting from your access to or use of or inability to access or use the Service.
                </p>
              </section>

              <section className="mb-8">
                <h2 className="text-2xl text-white mb-4 flex items-center gap-2">
                  <CheckCircle2 className="w-6 h-6 text-purple-400" />
                  8. Data and Privacy
                </h2>
                <p className="text-gray-300 leading-relaxed">
                  Your use of the Service is also governed by our Privacy Policy. We collect, use, and protect your data as described in our Privacy Policy. By using the Service, you consent to our data practices.
                </p>
              </section>

              <section className="mb-8">
                <h2 className="text-2xl text-white mb-4 flex items-center gap-2">
                  <CheckCircle2 className="w-6 h-6 text-cyan-400" />
                  9. Termination
                </h2>
                <p className="text-gray-300 leading-relaxed">
                  We may terminate or suspend your account and bar access to the Service immediately, without prior notice or liability, under our sole discretion, for any reason whatsoever, including without limitation if you breach the Terms. Upon termination, your right to use the Service will immediately cease.
                </p>
              </section>

              <section className="mb-8">
                <h2 className="text-2xl text-white mb-4 flex items-center gap-2">
                  <CheckCircle2 className="w-6 h-6 text-purple-400" />
                  10. Changes to Terms
                </h2>
                <p className="text-gray-300 leading-relaxed">
                  We reserve the right to modify or replace these Terms at any time. We will provide notice of any significant changes by posting the new Terms on this page and updating the "Last updated" date. Your continued use of the Service after any changes constitutes acceptance of the new Terms.
                </p>
              </section>

              <section className="mb-8">
                <h2 className="text-2xl text-white mb-4 flex items-center gap-2">
                  <CheckCircle2 className="w-6 h-6 text-cyan-400" />
                  11. Contact Information
                </h2>
                <p className="text-gray-300 leading-relaxed">
                  If you have any questions about these Terms, please contact us at:
                </p>
                <div className="mt-4 p-4 rounded-xl bg-gray-900/50 border border-purple-500/20">
                  <p className="text-cyan-400">Email: legal@vulpinix.ai</p>
                  <p className="text-cyan-400">Support: support@vulpinix.ai</p>
                </div>
              </section>
            </div>
          </motion.div>

          {/* Action Buttons */}
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="mt-8 flex flex-col sm:flex-row gap-4"
          >
            <Button
              onClick={() => navigate("/privacy")}
              variant="outline"
              className="flex-1 py-6 border-2 border-purple-500/50 bg-purple-500/10 hover:bg-purple-500/20 text-purple-300 rounded-xl transition-all hover:scale-105"
            >
              View Privacy Policy
            </Button>
            <Button
              onClick={() => navigate("/contact")}
              className="flex-1 py-6 bg-gradient-to-r from-purple-600 to-cyan-600 hover:from-purple-700 hover:to-cyan-700 text-white rounded-xl shadow-lg shadow-cyan-500/50 hover:shadow-cyan-500/70 transition-all hover:scale-105"
            >
              Contact Us
            </Button>
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
