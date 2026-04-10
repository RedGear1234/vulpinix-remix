import { motion, AnimatePresence } from "motion/react";
import { CheckCircle2, Bell, Clock, Mail } from "lucide-react";
import { Button } from "./ui/button";

interface PaymentSuccessModalProps {
  isOpen: boolean;
  onConfirm: () => void;
}

export default function PaymentSuccessModal({ isOpen, onConfirm }: PaymentSuccessModalProps) {
  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 z-50 bg-black/70 backdrop-blur-md"
          />

          {/* Modal */}
          <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.75, y: 40 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.85, y: 20 }}
              transition={{ type: "spring", stiffness: 300, damping: 25 }}
              className="relative w-full max-w-md rounded-3xl overflow-hidden"
              style={{
                background: "linear-gradient(135deg, #0f1235 0%, #1a1040 50%, #0a1628 100%)",
                boxShadow: "0 0 80px rgba(139, 92, 246, 0.4), 0 0 40px rgba(6, 182, 212, 0.2), inset 0 1px 0 rgba(255,255,255,0.1)",
              }}
            >
              {/* Animated top glow bar */}
              <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-purple-500 via-cyan-400 to-blue-500" />

              {/* Background orbs */}
              <div className="absolute top-0 right-0 w-48 h-48 bg-purple-600/20 rounded-full blur-3xl pointer-events-none" />
              <div className="absolute bottom-0 left-0 w-48 h-48 bg-cyan-600/15 rounded-full blur-3xl pointer-events-none" />

              {/* Content */}
              <div className="relative p-8 text-center">
                {/* Success icon with ring animation */}
                <div className="relative mx-auto mb-6 w-24 h-24">
                  {/* Pulsing rings */}
                  <div className="absolute inset-0 rounded-full bg-green-500/20 animate-ping" />
                  <div className="absolute inset-2 rounded-full bg-green-500/20 animate-ping" style={{ animationDelay: "0.3s" }} />
                  {/* Icon circle */}
                  <div className="relative w-24 h-24 rounded-full bg-gradient-to-br from-green-500/30 to-emerald-600/30 border-2 border-green-400/60 flex items-center justify-center shadow-lg shadow-green-500/40">
                    <CheckCircle2 className="w-12 h-12 text-green-400" />
                  </div>
                </div>

                {/* Title */}
                <h2 className="text-2xl font-bold text-white mb-2 leading-tight">
                  Your content has been{" "}
                  <span className="bg-gradient-to-r from-purple-400 via-cyan-400 to-blue-400 bg-clip-text text-transparent">
                    submitted for review!
                  </span>
                </h2>

                {/* Divider */}
                <div className="mx-auto my-5 w-16 h-px bg-gradient-to-r from-transparent via-purple-500/60 to-transparent" />

                {/* Info cards */}
                <div className="space-y-3 mb-7 text-left">
                  {/* Review time */}
                  <div className="flex items-start gap-3 p-3 rounded-xl bg-purple-500/10 border border-purple-500/20">
                    <div className="w-8 h-8 rounded-lg bg-purple-500/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                      <Clock className="w-4 h-4 text-purple-400" />
                    </div>
                    <p className="text-sm text-gray-300 leading-relaxed">
                      Our team will review your ad within{" "}
                      <span className="text-purple-300 font-semibold">12 hours.</span>
                    </p>
                  </div>

                  {/* Notification */}
                  <div className="flex items-start gap-3 p-3 rounded-xl bg-cyan-500/10 border border-cyan-500/20">
                    <div className="w-8 h-8 rounded-lg bg-cyan-500/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                      <Bell className="w-4 h-4 text-cyan-400" />
                    </div>
                    <p className="text-sm text-gray-300 leading-relaxed">
                      You'll receive a notification{" "}
                      <span className="text-cyan-300 font-semibold">here</span>
                    </p>
                  </div>

                  {/* Email */}
                  <div className="flex items-start gap-3 p-3 rounded-xl bg-blue-500/10 border border-blue-500/20">
                    <div className="w-8 h-8 rounded-lg bg-blue-500/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                      <Mail className="w-4 h-4 text-blue-400" />
                    </div>
                    <p className="text-sm text-gray-300 leading-relaxed">
                      ...and{" "}
                      <span className="text-blue-300 font-semibold">on email</span>{" "}
                      once approved.
                    </p>
                  </div>
                </div>

                {/* OK Button */}
                <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}>
                  <Button
                    id="payment-success-ok"
                    onClick={onConfirm}
                    size="lg"
                    className="w-full py-5 bg-gradient-to-r from-purple-600 via-cyan-600 to-blue-600 hover:from-purple-700 hover:via-cyan-700 hover:to-blue-700 text-white font-semibold rounded-xl shadow-lg shadow-cyan-500/40 hover:shadow-cyan-500/60 transition-all duration-200 text-base"
                  >
                    OK, Got It!
                  </Button>
                </motion.div>

                <p className="text-xs text-gray-500 mt-3">
                  You'll be taken to your campaign dashboard
                </p>
              </div>
            </motion.div>
          </div>
        </>
      )}
    </AnimatePresence>
  );
}
