import { motion } from "motion/react";
import { useNavigate } from "react-router";
import { ArrowLeft, Shield, CheckCircle2 } from "lucide-react";
import { Button } from "../components/ui/button";

export default function PrivacyPage() {
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
            <pattern id="circuit-privacy" x="0" y="0" width="100" height="100" patternUnits="userSpaceOnUse">
              <circle cx="50" cy="50" r="2" fill="#00ffff" />
              <line x1="50" y1="50" x2="100" y2="50" stroke="#00ffff" strokeWidth="0.5" />
              <line x1="50" y1="50" x2="50" y2="0" stroke="#00ffff" strokeWidth="0.5" />
              <circle cx="0" cy="50" r="2" fill="#a855f7" />
              <circle cx="50" cy="0" r="2" fill="#3b82f6" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#circuit-privacy)" />
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
                <Shield className="w-8 h-8 text-white" />
              </div>
              <div>
                <h1 className="text-4xl sm:text-5xl text-white bg-gradient-to-r from-purple-400 via-cyan-400 to-blue-400 bg-clip-text text-transparent">
                  Privacy Policy
                </h1>
                <p className="text-gray-400 mt-2">Last updated: February 13, 2026</p>
              </div>
            </div>
          </motion.div>

          {/* Privacy Content */}
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
                  Introduction
                </h2>
                <p className="text-gray-300 leading-relaxed">
                  At VULPINIX AI 1.0, we take your privacy seriously. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you use our AI-powered digital marketing automation service. Please read this privacy policy carefully.
                </p>
              </section>

              <section className="mb-8">
                <h2 className="text-2xl text-white mb-4 flex items-center gap-2">
                  <CheckCircle2 className="w-6 h-6 text-purple-400" />
                  Information We Collect
                </h2>
                <p className="text-gray-300 leading-relaxed mb-4">
                  We collect information that you provide directly to us, including:
                </p>
                <ul className="list-disc list-inside text-gray-300 space-y-2 ml-4">
                  <li><strong className="text-white">Personal Information:</strong> Name, email address, phone number, company name, location</li>
                  <li><strong className="text-white">Account Credentials:</strong> Username, password, and authentication data</li>
                  <li><strong className="text-white">Social Media Links:</strong> Instagram, Facebook, YouTube, Twitter, LinkedIn profiles</li>
                  <li><strong className="text-white">Payment Information:</strong> Billing details, payment methods (processed securely by third parties)</li>
                  <li><strong className="text-white">Campaign Data:</strong> Marketing content, images, videos, ad copy, and targeting preferences</li>
                  <li><strong className="text-white">Usage Data:</strong> Analytics, performance metrics, and interaction data</li>
                </ul>
              </section>

              <section className="mb-8">
                <h2 className="text-2xl text-white mb-4 flex items-center gap-2">
                  <CheckCircle2 className="w-6 h-6 text-cyan-400" />
                  How We Use Your Information
                </h2>
                <p className="text-gray-300 leading-relaxed mb-4">
                  We use the information we collect for the following purposes:
                </p>
                <ul className="list-disc list-inside text-gray-300 space-y-2 ml-4">
                  <li>To provide, maintain, and improve our AI-powered services</li>
                  <li>To process your transactions and manage your campaigns</li>
                  <li>To analyze content and optimize ad performance using AI</li>
                  <li>To communicate with you about updates, features, and support</li>
                  <li>To personalize your experience and provide recommendations</li>
                  <li>To detect, prevent, and address technical issues or fraud</li>
                  <li>To comply with legal obligations and enforce our Terms</li>
                </ul>
              </section>

              <section className="mb-8">
                <h2 className="text-2xl text-white mb-4 flex items-center gap-2">
                  <CheckCircle2 className="w-6 h-6 text-purple-400" />
                  AI and Data Processing
                </h2>
                <p className="text-gray-300 leading-relaxed mb-4">
                  Our AI systems process your data to provide intelligent recommendations:
                </p>
                <ul className="list-disc list-inside text-gray-300 space-y-2 ml-4">
                  <li>Content uploaded is analyzed by AI for optimization suggestions</li>
                  <li>Campaign performance data is used to improve AI algorithms</li>
                  <li>Your data may be aggregated and anonymized for training purposes</li>
                  <li>We implement strict security measures to protect AI-processed data</li>
                  <li>You can opt-out of AI analysis features at any time</li>
                </ul>
              </section>

              <section className="mb-8">
                <h2 className="text-2xl text-white mb-4 flex items-center gap-2">
                  <CheckCircle2 className="w-6 h-6 text-cyan-400" />
                  Information Sharing and Disclosure
                </h2>
                <p className="text-gray-300 leading-relaxed mb-4">
                  We may share your information in the following situations:
                </p>
                <ul className="list-disc list-inside text-gray-300 space-y-2 ml-4">
                  <li><strong className="text-white">Third-Party Platforms:</strong> With social media platforms (Instagram, Facebook, YouTube, etc.) to publish your campaigns</li>
                  <li><strong className="text-white">Service Providers:</strong> With trusted partners who assist in operating our service (payment processors, hosting providers)</li>
                  <li><strong className="text-white">Legal Requirements:</strong> When required by law or to protect our rights and safety</li>
                  <li><strong className="text-white">Business Transfers:</strong> In connection with a merger, acquisition, or sale of assets</li>
                  <li><strong className="text-white">With Your Consent:</strong> When you explicitly authorize us to share specific information</li>
                </ul>
                <p className="text-gray-300 leading-relaxed mt-4">
                  We <strong className="text-white">DO NOT</strong> sell your personal information to third parties.
                </p>
              </section>

              <section className="mb-8">
                <h2 className="text-2xl text-white mb-4 flex items-center gap-2">
                  <CheckCircle2 className="w-6 h-6 text-purple-400" />
                  Data Security
                </h2>
                <p className="text-gray-300 leading-relaxed mb-4">
                  We implement industry-standard security measures to protect your data:
                </p>
                <ul className="list-disc list-inside text-gray-300 space-y-2 ml-4">
                  <li>Encryption of data in transit and at rest</li>
                  <li>Secure authentication and access controls</li>
                  <li>Regular security audits and vulnerability assessments</li>
                  <li>Secure payment processing through PCI-compliant providers</li>
                  <li>Employee training on data protection and privacy</li>
                </ul>
                <p className="text-gray-300 leading-relaxed mt-4">
                  However, no method of transmission over the Internet is 100% secure. While we strive to protect your data, we cannot guarantee absolute security.
                </p>
              </section>

              <section className="mb-8">
                <h2 className="text-2xl text-white mb-4 flex items-center gap-2">
                  <CheckCircle2 className="w-6 h-6 text-cyan-400" />
                  Your Privacy Rights
                </h2>
                <p className="text-gray-300 leading-relaxed mb-4">
                  You have the following rights regarding your personal data:
                </p>
                <ul className="list-disc list-inside text-gray-300 space-y-2 ml-4">
                  <li><strong className="text-white">Access:</strong> Request a copy of your personal data</li>
                  <li><strong className="text-white">Correction:</strong> Update or correct inaccurate information</li>
                  <li><strong className="text-white">Deletion:</strong> Request deletion of your personal data</li>
                  <li><strong className="text-white">Portability:</strong> Receive your data in a portable format</li>
                  <li><strong className="text-white">Opt-Out:</strong> Unsubscribe from marketing communications</li>
                  <li><strong className="text-white">Restriction:</strong> Request limitation of data processing</li>
                </ul>
                <p className="text-gray-300 leading-relaxed mt-4">
                  To exercise these rights, please contact us at privacy@vulpinix.ai
                </p>
              </section>

              <section className="mb-8">
                <h2 className="text-2xl text-white mb-4 flex items-center gap-2">
                  <CheckCircle2 className="w-6 h-6 text-purple-400" />
                  Cookies and Tracking
                </h2>
                <p className="text-gray-300 leading-relaxed mb-4">
                  We use cookies and similar tracking technologies to:
                </p>
                <ul className="list-disc list-inside text-gray-300 space-y-2 ml-4">
                  <li>Maintain your session and preferences</li>
                  <li>Analyze usage patterns and improve our service</li>
                  <li>Provide personalized content and recommendations</li>
                  <li>Track campaign performance and analytics</li>
                </ul>
                <p className="text-gray-300 leading-relaxed mt-4">
                  You can control cookies through your browser settings, but this may affect functionality.
                </p>
              </section>

              <section className="mb-8">
                <h2 className="text-2xl text-white mb-4 flex items-center gap-2">
                  <CheckCircle2 className="w-6 h-6 text-cyan-400" />
                  Data Retention
                </h2>
                <p className="text-gray-300 leading-relaxed">
                  We retain your personal information for as long as necessary to provide our services and fulfill the purposes outlined in this Privacy Policy. When you delete your account, we will delete or anonymize your personal data within 30 days, except where we are required to retain it for legal or regulatory purposes.
                </p>
              </section>

              <section className="mb-8">
                <h2 className="text-2xl text-white mb-4 flex items-center gap-2">
                  <CheckCircle2 className="w-6 h-6 text-purple-400" />
                  Children's Privacy
                </h2>
                <p className="text-gray-300 leading-relaxed">
                  Our Service is not intended for users under the age of 18. We do not knowingly collect personal information from children. If you become aware that a child has provided us with personal data, please contact us immediately, and we will take steps to delete such information.
                </p>
              </section>

              <section className="mb-8">
                <h2 className="text-2xl text-white mb-4 flex items-center gap-2">
                  <CheckCircle2 className="w-6 h-6 text-cyan-400" />
                  International Data Transfers
                </h2>
                <p className="text-gray-300 leading-relaxed">
                  Your information may be transferred to and maintained on servers located outside of your country. We ensure appropriate safeguards are in place to protect your data in accordance with this Privacy Policy and applicable laws.
                </p>
              </section>

              <section className="mb-8">
                <h2 className="text-2xl text-white mb-4 flex items-center gap-2">
                  <CheckCircle2 className="w-6 h-6 text-purple-400" />
                  Changes to This Privacy Policy
                </h2>
                <p className="text-gray-300 leading-relaxed">
                  We may update our Privacy Policy from time to time. We will notify you of any changes by posting the new Privacy Policy on this page and updating the "Last updated" date. You are advised to review this Privacy Policy periodically for any changes.
                </p>
              </section>

              <section className="mb-8">
                <h2 className="text-2xl text-white mb-4 flex items-center gap-2">
                  <CheckCircle2 className="w-6 h-6 text-cyan-400" />
                  Contact Us
                </h2>
                <p className="text-gray-300 leading-relaxed mb-4">
                  If you have any questions about this Privacy Policy, please contact us:
                </p>
                <div className="p-4 rounded-xl bg-gray-900/50 border border-purple-500/20">
                  <p className="text-cyan-400">Email: privacy@vulpinix.ai</p>
                  <p className="text-cyan-400">Support: support@vulpinix.ai</p>
                  <p className="text-cyan-400">Data Protection Officer: dpo@vulpinix.ai</p>
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
              onClick={() => navigate("/terms")}
              variant="outline"
              className="flex-1 py-6 border-2 border-purple-500/50 bg-purple-500/10 hover:bg-purple-500/20 text-purple-300 rounded-xl transition-all hover:scale-105"
            >
              View Terms & Conditions
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
