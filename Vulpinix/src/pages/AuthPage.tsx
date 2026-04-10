import { useState, useEffect, useCallback } from "react";
import { useNavigate, useLocation } from "react-router";
import { motion, AnimatePresence } from "motion/react";
import {
  User, Mail, Globe, Lock, Instagram, Facebook, Youtube, Twitter, Linkedin,
  ArrowRight, Sparkles, Shield, CheckCircle2, Building2, Eye, EyeOff, Zap, BarChart3
} from "lucide-react";
import { toast } from "sonner";
import { useGoogleAuthSimple } from "../hooks/useGoogleAuthSimple";

type AuthMode = "login" | "signup";

export default function AuthPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const [authMode, setAuthMode] = useState<AuthMode>(
    location.pathname.includes("signup") ? "signup" : "login"
  );

  useEffect(() => {
    if (location.pathname.includes("signup")) {
      setAuthMode("signup");
    } else if (location.pathname.includes("login")) {
      setAuthMode("login");
    }
  }, [location.pathname]);
  const [showPassword, setShowPassword] = useState(false);
  const [loginEmail, setLoginEmail] = useState("");
  const [loginPassword, setLoginPassword] = useState("");
  const [signupData, setSignupData] = useState({ name: "", email: "", password: "", company: "", website: "" });
  const [socialLinks, setSocialLinks] = useState({ instagram: "", facebook: "", youtube: "", twitter: "", linkedin: "" });
  const [isLoading, setIsLoading] = useState(false);

  // If already authenticated, skip the auth page and go straight to upload
  useEffect(() => {
    const userInfo = localStorage.getItem("userInfo");
    const isAuthenticated = localStorage.getItem("isAuthenticated");
    if (userInfo || isAuthenticated === "true") {
      navigate("/upload", { replace: true });
    }
  }, [navigate]);

  const handleGoogleSuccess = useCallback((googleUser: any) => {
    toast.success(
      <div className="flex items-center gap-2">
        <CheckCircle2 className="w-5 h-5 text-green-400" />
        <div>
          <p className="font-semibold">Welcome, {googleUser.name}!</p>
          <p className="text-xs text-gray-400 mt-0.5">Signed in via Google · {googleUser.email}</p>
        </div>
      </div>,
      { duration: 5000 }
    );
    const userData = {
      name: googleUser.name, email: googleUser.email, picture: googleUser.picture,
      emailVerified: googleUser.email_verified, authProvider: "google", googleId: googleUser.sub
    };
    localStorage.setItem("isAuthenticated", "true");
    localStorage.setItem("authProvider", "google");
    localStorage.setItem("userInfo", JSON.stringify(userData));
    localStorage.setItem("socialLinks", JSON.stringify({ instagram: "", facebook: "", youtube: "", twitter: "", linkedin: "" }));
    setTimeout(() => navigate("/upload"), 1000);
  }, [navigate]);

  const handleGoogleError = useCallback((error: string) => {
    toast.error("Google Sign-In Failed", { description: error });
  }, []);

  const { isGoogleLoaded, initializeGoogle } = useGoogleAuthSimple();

  useEffect(() => {
    if (isGoogleLoaded) {
      initializeGoogle("google-signin-button", handleGoogleSuccess, handleGoogleError);
    }
  }, [isGoogleLoaded, initializeGoogle, handleGoogleSuccess, handleGoogleError]);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (!loginEmail || !loginPassword) { toast.error("Please fill all fields"); return; }
    setIsLoading(true);
    setTimeout(() => {
      localStorage.setItem("isAuthenticated", "true");
      localStorage.setItem("userEmail", loginEmail);
      toast.success("Welcome back!", { description: "Successfully logged in." });
      navigate("/upload");
    }, 1500);
  };

  const handleSignup = (e: React.FormEvent) => {
    e.preventDefault();
    if (!signupData.name || !signupData.email || !signupData.password) { toast.error("Please fill required fields"); return; }
    setIsLoading(true);
    setTimeout(() => {
      localStorage.setItem("isAuthenticated", "true");
      localStorage.setItem("userInfo", JSON.stringify(signupData));
      localStorage.setItem("socialLinks", JSON.stringify(socialLinks));
      toast.success("Account Created! 🎉", { description: "Welcome to VULPINIX AI" });
      navigate("/upload");
    }, 1500);
  };

  const featureItems = [
    { icon: Zap, color: "text-cyan-400", bg: "bg-cyan-500/10 border-cyan-500/20", title: "AI-Powered Automation", desc: "Let our AI handle targeting, creatives, and bid strategies automatically." },
    { icon: BarChart3, color: "text-purple-400", bg: "bg-purple-500/10 border-purple-500/20", title: "Unified Dashboard", desc: "All your campaigns across every platform, in one powerful interface." },
    { icon: Shield, color: "text-blue-400", bg: "bg-blue-500/10 border-blue-500/20", title: "Enterprise Security", desc: "Bank-grade encryption protects your data and client information." },
  ];

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="min-h-screen flex overflow-hidden"
      style={{ background: "linear-gradient(135deg, #05071a 0%, #0a0e2c 50%, #060918 100%)" }}
    >
      {/* ── LEFT PANEL ── */}
      <div className="flex-1 lg:flex-none lg:w-[46%] flex flex-col h-screen overflow-y-auto">
        <div className="mx-auto w-full max-w-[440px] flex flex-col flex-1 px-8 py-10">

          {/* Logo */}
          <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="mb-10">
            <button onClick={() => navigate("/")} className="flex items-center gap-2.5 group w-fit">
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-tr from-cyan-400 to-violet-500 rounded-lg blur opacity-40 group-hover:opacity-70 transition-opacity duration-500" />
                <div className="relative w-9 h-9 bg-black/80 rounded-lg border border-white/10 flex items-center justify-center">
                  <Sparkles className="w-4 h-4 text-white" />
                </div>
              </div>
              <span className="text-white font-bold text-lg tracking-wide">Vulpinix <span className="text-cyan-400">AI</span></span>
            </button>
          </motion.div>

          {/* Heading */}
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }} className="mb-8">
            <h2 className="text-2xl font-bold text-white tracking-tight">
              {authMode === "login" ? "Sign in to your account" : "Create your account"}
            </h2>
            <p className="text-sm text-gray-500 mt-1.5">
              {authMode === "login" ? "Don't have an account? " : "Already have an account? "}
              <button onClick={() => navigate(authMode === "login" ? "/signup" : "/login")} className="text-cyan-400 hover:text-cyan-300 font-medium transition-colors">
                {authMode === "login" ? "Sign up for free" : "Sign in"}
              </button>
            </p>
          </motion.div>

          {/* Google OAuth Button */}
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="mb-6">
            <div className="relative h-11 bg-white rounded-xl overflow-hidden flex items-center justify-center hover:bg-gray-50 transition-colors hover:shadow-[0_0_20px_rgba(255,255,255,0.1)] cursor-pointer">
              {/* Fallback native button */}
              <div className="absolute inset-0 flex items-center justify-center gap-2.5 pointer-events-none">
                {!isGoogleLoaded ? (
                  <div className="w-4 h-4 border-2 border-gray-200 border-t-gray-500 rounded-full animate-spin" />
                ) : (
                  <>
                    <svg className="w-[18px] h-[18px]" viewBox="0 0 24 24">
                      <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                      <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                      <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
                      <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
                    </svg>
                    <span className="text-[13px] font-semibold text-gray-700">Continue with Google</span>
                  </>
                )}
              </div>
              {/* Google's rendered iframe sits on top */}
              <div id="google-signin-button" className="absolute inset-0 z-10 opacity-0 hover:opacity-100 transition-opacity" />
            </div>
          </motion.div>

          {/* Divider */}
          <div className="flex items-center gap-3 mb-6">
            <div className="flex-1 h-px bg-white/10" />
            <span className="text-[11px] font-semibold uppercase tracking-widest text-gray-600">or</span>
            <div className="flex-1 h-px bg-white/10" />
          </div>

          {/* Form */}
          <AnimatePresence mode="popLayout">
            {authMode === "login" ? (
              <motion.form
                key="login"
                initial={{ opacity: 0, x: -16 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 16 }}
                transition={{ duration: 0.25 }}
                onSubmit={handleLogin}
                className="space-y-4"
              >
                <Field label="Email Address" icon={<Mail className="w-4 h-4" />}>
                  <input
                    type="email" placeholder="you@example.com" value={loginEmail}
                    onChange={e => setLoginEmail(e.target.value)}
                    className="auth-input pl-10"
                    autoComplete="email"
                  />
                </Field>

                <Field label="Password" icon={<Lock className="w-4 h-4" />} rightAction={
                  <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-300 transition-colors">
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                }>
                  <input
                    type={showPassword ? "text" : "password"} placeholder="••••••••" value={loginPassword}
                    onChange={e => setLoginPassword(e.target.value)}
                    className="auth-input pl-10 pr-10"
                    autoComplete="current-password"
                  />
                </Field>

                <div className="flex items-center justify-between pt-1">
                  <label className="flex items-center gap-2 cursor-pointer group">
                    <div className="w-4 h-4 rounded border border-white/20 bg-white/5 group-hover:border-cyan-500/50 transition-colors flex items-center justify-center">
                    </div>
                    <span className="text-xs text-gray-500">Remember me</span>
                  </label>
                  <a href="#" className="text-xs text-gray-500 hover:text-cyan-400 transition-colors">Forgot password?</a>
                </div>

                <button
                  type="submit" disabled={isLoading}
                  className="w-full h-11 mt-2 rounded-xl font-semibold text-sm bg-white text-black hover:bg-gray-100 transition-all disabled:opacity-60 flex items-center justify-center gap-2 group shadow-[0_0_24px_rgba(255,255,255,0.08)]"
                >
                  {isLoading ? <div className="w-4 h-4 border-2 border-black/20 border-t-black rounded-full animate-spin" /> : <>Sign In <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" /></>}
                </button>
              </motion.form>
            ) : (
              <motion.form
                key="signup"
                initial={{ opacity: 0, x: 16 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -16 }}
                transition={{ duration: 0.25 }}
                onSubmit={handleSignup}
                className="space-y-4"
              >
                <div className="grid grid-cols-2 gap-4">
                  <div className="col-span-2">
                    <Field label="Full Name" icon={<User className="w-4 h-4" />}>
                      <input placeholder="John Doe" value={signupData.name} onChange={e => setSignupData({ ...signupData, name: e.target.value })} className="auth-input pl-10" />
                    </Field>
                  </div>
                  <div className="col-span-2">
                    <Field label="Email Address" icon={<Mail className="w-4 h-4" />}>
                      <input type="email" placeholder="you@example.com" value={signupData.email} onChange={e => setSignupData({ ...signupData, email: e.target.value })} className="auth-input pl-10" />
                    </Field>
                  </div>
                  <div className="col-span-2">
                    <Field label="Password" icon={<Lock className="w-4 h-4" />} rightAction={
                      <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-300 transition-colors">
                        {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                    }>
                      <input type={showPassword ? "text" : "password"} placeholder="Min. 8 characters" value={signupData.password} onChange={e => setSignupData({ ...signupData, password: e.target.value })} className="auth-input pl-10 pr-10" />
                    </Field>
                  </div>
                  <div>
                    <Field label="Company" icon={<Building2 className="w-4 h-4" />}>
                      <input placeholder="Your Company" value={signupData.company} onChange={e => setSignupData({ ...signupData, company: e.target.value })} className="auth-input pl-10" />
                    </Field>
                  </div>
                  <div>
                    <Field label="Website" icon={<Globe className="w-4 h-4" />}>
                      <input placeholder="yourwebsite.com" value={signupData.website} onChange={e => setSignupData({ ...signupData, website: e.target.value })} className="auth-input pl-10" />
                    </Field>
                  </div>
                </div>

                <details className="group mt-2">
                  <summary className="text-xs text-gray-500 hover:text-gray-300 cursor-pointer font-medium select-none list-none flex items-center gap-1.5 transition-colors">
                    <span className="border border-white/10 rounded px-1.5 py-0.5 group-open:border-white/20">+ Add social links <span className="text-gray-600">(optional)</span></span>
                  </summary>
                  <div className="mt-3 grid grid-cols-2 gap-3">
                    {[
                      { icon: Instagram, key: 'instagram', ph: 'Instagram URL', focus: 'focus:border-pink-500/50' },
                      { icon: Facebook, key: 'facebook', ph: 'Facebook URL', focus: 'focus:border-blue-500/50' },
                      { icon: Youtube, key: 'youtube', ph: 'YouTube URL', focus: 'focus:border-red-500/50' },
                      { icon: Twitter, key: 'twitter', ph: 'Twitter / X URL', focus: 'focus:border-sky-500/50' },
                      { icon: Linkedin, key: 'linkedin', ph: 'LinkedIn URL', focus: 'focus:border-blue-400/50' },
                    ].map(({ icon: Icon, key, ph, focus }) => (
                      <div key={key} className="relative group/field">
                        <Icon className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-gray-600 group-focus-within/field:text-white/50 transition-colors" />
                        <input
                          placeholder={ph}
                          value={socialLinks[key as keyof typeof socialLinks]}
                          onChange={e => setSocialLinks({ ...socialLinks, [key]: e.target.value })}
                          className={`auth-input auth-input-sm pl-9 ${focus}`}
                        />
                      </div>
                    ))}
                  </div>
                </details>

                <button
                  type="submit" disabled={isLoading}
                  className="w-full h-11 mt-2 rounded-xl font-semibold text-sm bg-white text-black hover:bg-gray-100 transition-all disabled:opacity-60 flex items-center justify-center gap-2 group shadow-[0_0_24px_rgba(255,255,255,0.08)]"
                >
                  {isLoading ? <div className="w-4 h-4 border-2 border-black/20 border-t-black rounded-full animate-spin" /> : <>Create Account <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" /></>}
                </button>
              </motion.form>
            )}
          </AnimatePresence>

          <p className="mt-auto pt-8 text-[11px] text-gray-600 text-center">
            By continuing you agree to our{" "}
            <a href="/terms" className="hover:text-gray-400 transition-colors underline">Terms</a> and{" "}
            <a href="/privacy" className="hover:text-gray-400 transition-colors underline">Privacy Policy</a>.
          </p>
        </div>
      </div>

      {/* ── RIGHT PANEL ── */}
      <div className="hidden lg:flex flex-1 relative overflow-hidden items-center justify-center p-10 xl:p-16">
        {/* Ambient glow */}
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-violet-600/10 rounded-full blur-[120px] pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-cyan-600/10 rounded-full blur-[120px] pointer-events-none" />
        {/* Grid */}
        <div className="absolute inset-0 opacity-[0.025]" style={{ backgroundImage: 'radial-gradient(circle, #ffffff 1px, transparent 1px)', backgroundSize: '44px 44px' }} />

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.6 }}
          className="relative z-10 max-w-[480px] w-full"
        >
          <h3 className="text-4xl xl:text-[42px] font-bold text-white leading-tight tracking-tight mb-5">
            Scale your business <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-violet-500">with AI</span>.
          </h3>
          <p className="text-gray-400 text-[15px] leading-relaxed mb-10">
            Join thousands of agencies and brands using Vulpinix to automate campaigns, drive ROI, and win back time.
          </p>

          <div className="space-y-3">
            {featureItems.map((item, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.45 + i * 0.08 }}
                className={`flex items-start gap-4 p-4 rounded-2xl bg-white/[0.02] border border-white/[0.05] hover:bg-white/[0.04] hover:border-white/10 transition-all duration-300 cursor-default`}
              >
                <div className={`mt-0.5 w-10 h-10 rounded-xl border flex items-center justify-center flex-shrink-0 ${item.bg}`}>
                  <item.icon className={`w-4.5 h-4.5 ${item.color}`} size={18} />
                </div>
                <div>
                  <p className="text-white font-semibold text-sm mb-0.5">{item.title}</p>
                  <p className="text-gray-500 text-[13px] leading-snug">{item.desc}</p>
                </div>
              </motion.div>
            ))}
          </div>

          {/* Testimonial */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.75 }}
            className="mt-8 p-5 rounded-2xl bg-white/[0.02] border border-white/[0.06] relative overflow-hidden"
          >
            <div className="absolute -top-10 -right-10 w-28 h-28 bg-violet-500/15 rounded-full blur-3xl pointer-events-none" />
            <p className="text-gray-300 text-sm leading-relaxed italic">
              "Vulpinix replaced our entire ops team for campaign management. The AI is genuinely smarter than our old manual process — 4x ROI in 3 months."
            </p>
            <div className="flex items-center gap-3 mt-4">
              <div className="w-9 h-9 rounded-full bg-gradient-to-tr from-cyan-400 to-violet-500 p-px flex-shrink-0">
                <div className="w-full h-full rounded-full bg-[#0d1030] flex items-center justify-center">
                  <User className="w-4 h-4 text-gray-300" />
                </div>
              </div>
              <div>
                <p className="text-white text-xs font-semibold">Sarah Williams</p>
                <p className="text-gray-600 text-[11px]">Head of Growth · NexPeak Agency</p>
              </div>
            </div>
          </motion.div>
        </motion.div>
      </div>

      <style>{`
        .auth-input {
          width: 100%;
          height: 44px;
          background: rgba(255,255,255,0.04);
          border: 1px solid rgba(255,255,255,0.1);
          border-radius: 12px;
          color: white;
          font-size: 14px;
          padding-right: 14px;
          transition: all 0.2s;
          outline: none;
          font-weight: 300;
        }
        .auth-input::placeholder { color: rgba(255,255,255,0.2); }
        .auth-input:focus {
          background: rgba(255,255,255,0.06);
          border-color: rgba(255,255,255,0.2);
          box-shadow: 0 0 0 3px rgba(99,179,237,0.08);
        }
        .auth-input-sm { height: 38px; font-size: 13px; border-radius: 10px; }

        #google-signin-button {
          display: flex !important;
          justify-content: center !important;
          align-items: center !important;
          width: 100% !important;
          height: 100% !important;
        }
        #google-signin-button iframe {
          margin: 0 auto !important;
        }
      `}</style>
    </motion.div>
  );
}

// Helper component for form fields
function Field({
  label, icon, children, rightAction
}: { label: string; icon: React.ReactNode; children: React.ReactNode; rightAction?: React.ReactNode }) {
  return (
    <div className="space-y-1.5">
      <label className="block text-[11px] font-semibold uppercase tracking-widest text-gray-500 ml-0.5">{label}</label>
      <div className="relative group/input">
        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-600 group-focus-within/input:text-gray-400 transition-colors">
          {icon}
        </span>
        {children}
        {rightAction}
      </div>
    </div>
  );
}