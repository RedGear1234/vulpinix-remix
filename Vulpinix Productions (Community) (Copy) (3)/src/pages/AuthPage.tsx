import { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router";
import { motion, AnimatePresence } from "motion/react";
import {
  User,
  Mail,
  Phone,
  Building2,
  MapPin,
  Globe,
  Lock,
  Instagram,
  Facebook,
  Youtube,
  Twitter,
  Linkedin,
  ArrowRight,
  Sparkles,
  Shield,
  Check,
  CheckCircle2
} from "lucide-react";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import { toast } from "sonner@2.0.3";
import { useGoogleAuthSimple } from "../hooks/useGoogleAuthSimple";

type AuthMode = "login" | "signup";

export default function AuthPage() {
  const navigate = useNavigate();
  const [authMode, setAuthMode] = useState<AuthMode>("login");
  
  // Login State
  const [loginEmail, setLoginEmail] = useState("");
  const [loginPassword, setLoginPassword] = useState("");

  // Signup State
  const [signupData, setSignupData] = useState({
    name: "",
    email: "",
    password: "",
    phone: "",
    company: "",
    location: "",
    website: ""
  });

  // Social Media Links State
  const [socialLinks, setSocialLinks] = useState({
    instagram: "",
    facebook: "",
    youtube: "",
    twitter: "",
    linkedin: ""
  });

  const [isLoading, setIsLoading] = useState(false);

  // Define callbacks before using the hook
  const handleGoogleSuccess = useCallback((googleUser: any) => {
    // Show success notification with verified badge
    toast.success(
      <div className="flex items-center gap-2">
        <CheckCircle2 className="w-5 h-5 text-green-400" />
        <div>
          <p className="font-semibold">Welcome, {googleUser.name}! 🎉</p>
          <p className="text-xs text-gray-400 flex items-center gap-1 mt-1">
            <Shield className="w-3 h-3" />
            Email verified by Google: {googleUser.email}
          </p>
        </div>
      </div>,
      {
        description: "Successfully authenticated with Google",
        duration: 5000,
      }
    );

    // Save real user data from Google to localStorage
    const userData = {
      name: googleUser.name,
      email: googleUser.email,
      phone: "",
      company: "",
      location: "",
      website: "",
      picture: googleUser.picture,
      emailVerified: googleUser.email_verified,
      authProvider: "google",
      googleId: googleUser.sub
    };

    localStorage.setItem("isAuthenticated", "true");
    localStorage.setItem("authProvider", "google");
    localStorage.setItem("userInfo", JSON.stringify(userData));
    localStorage.setItem("socialLinks", JSON.stringify({
      instagram: "",
      facebook: "",
      youtube: "",
      twitter: "",
      linkedin: ""
    }));

    // Navigate to upload page
    setTimeout(() => {
      navigate("/upload");
    }, 1000);
  }, [navigate]);

  const handleGoogleError = useCallback((error: string) => {
    toast.error("Google Sign-In Failed", {
      description: error,
    });
  }, []);

  // Now use the Google auth hook
  const { isGoogleLoaded, initializeGoogle } = useGoogleAuthSimple();

  // Initialize Google Sign-In when component mounts and library is loaded
  useEffect(() => {
    if (isGoogleLoaded) {
      // Initialize Google button
      initializeGoogle(
        "google-signin-button",
        handleGoogleSuccess,
        handleGoogleError
      );
    }
  }, [isGoogleLoaded, initializeGoogle, handleGoogleSuccess, handleGoogleError]);

  const handleAppleLogin = () => {
    setIsLoading(true);
    // Simulate Apple OAuth
    setTimeout(() => {
      setIsLoading(false);
      localStorage.setItem("isAuthenticated", "true");
      localStorage.setItem("authProvider", "apple");
      toast.success("Welcome back!", {
        description: "Successfully logged in with Apple",
      });
      navigate("/upload");
    }, 1500);
  };

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!loginEmail || !loginPassword) {
      toast.error("Please fill all fields");
      return;
    }

    setIsLoading(true);
    // Simulate login
    setTimeout(() => {
      setIsLoading(false);
      localStorage.setItem("isAuthenticated", "true");
      localStorage.setItem("userEmail", loginEmail);
      toast.success("Welcome back!", {
        description: "Successfully logged in to your account",
      });
      navigate("/upload");
    }, 1500);
  };

  const handleSignup = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!signupData.name || !signupData.email || !signupData.password) {
      toast.error("Please fill all required fields");
      return;
    }

    setIsLoading(true);
    // Simulate signup and save data
    setTimeout(() => {
      setIsLoading(false);
      localStorage.setItem("isAuthenticated", "true");
      localStorage.setItem("userInfo", JSON.stringify(signupData));
      localStorage.setItem("socialLinks", JSON.stringify(socialLinks));
      toast.success("Account Created Successfully! 🎉", {
        description: "Welcome to VULPINIX AI 1.0",
      });
      navigate("/upload");
    }, 1500);
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5 }}
      className="min-h-screen bg-gradient-to-b from-[#0a0e27] via-[#0f1235] to-black flex items-center justify-center px-4 py-8"
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
            <pattern id="circuit-auth" x="0" y="0" width="100" height="100" patternUnits="userSpaceOnUse">
              <circle cx="50" cy="50" r="2" fill="#00ffff" />
              <line x1="50" y1="50" x2="100" y2="50" stroke="#00ffff" strokeWidth="0.5" />
              <line x1="50" y1="50" x2="50" y2="0" stroke="#00ffff" strokeWidth="0.5" />
              <circle cx="0" cy="50" r="2" fill="#a855f7" />
              <circle cx="50" cy="0" r="2" fill="#3b82f6" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#circuit-auth)" />
        </svg>
      </div>

      {/* Auth Container */}
      <div className="relative z-10 w-full max-w-6xl">
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="text-center mb-8"
        >
          <div className="flex items-center justify-center gap-3 mb-4">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-r from-purple-600 to-cyan-600 flex items-center justify-center shadow-lg shadow-cyan-500/50">
              <Sparkles className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-4xl sm:text-5xl text-white bg-gradient-to-r from-purple-400 via-cyan-400 to-blue-400 bg-clip-text text-transparent">
              VULPINIX AI 1.0
            </h1>
          </div>
          <p className="text-xl text-gray-400">
            {authMode === "login" ? "Welcome back! Login to continue" : "Create your account to get started"}
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* LEFT - Auth Form */}
          <motion.div
            initial={{ x: -20, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="p-8 rounded-2xl bg-gradient-to-br from-gray-900/90 via-purple-900/20 to-cyan-900/20 border-2 border-purple-500/30 backdrop-blur-sm shadow-2xl shadow-purple-500/20"
          >
            {/* Auth Mode Toggle */}
            <div className="flex gap-2 mb-8 p-1 rounded-xl bg-gray-900/50 border border-purple-500/20">
              <button
                onClick={() => setAuthMode("login")}
                className={`flex-1 py-3 rounded-lg transition-all ${
                  authMode === "login"
                    ? "bg-gradient-to-r from-purple-600 to-cyan-600 text-white shadow-lg shadow-cyan-500/30"
                    : "text-gray-400 hover:text-white"
                }`}
              >
                Login
              </button>
              <button
                onClick={() => setAuthMode("signup")}
                className={`flex-1 py-3 rounded-lg transition-all ${
                  authMode === "signup"
                    ? "bg-gradient-to-r from-purple-600 to-cyan-600 text-white shadow-lg shadow-cyan-500/30"
                    : "text-gray-400 hover:text-white"
                }`}
              >
                Sign Up
              </button>
            </div>

            <AnimatePresence mode="wait">
              {authMode === "login" ? (
                <motion.form
                  key="login"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                  onSubmit={handleLogin}
                  className="space-y-6"
                >
                  <div>
                    <Label className="text-gray-300 flex items-center gap-2 mb-2">
                      <Mail className="w-4 h-4 text-cyan-400" />
                      Email Address
                    </Label>
                    <Input
                      type="email"
                      placeholder="your.email@example.com"
                      value={loginEmail}
                      onChange={(e) => setLoginEmail(e.target.value)}
                      className="bg-gray-900/50 border-purple-500/30 text-white focus:border-cyan-400/50"
                    />
                  </div>

                  <div>
                    <Label className="text-gray-300 flex items-center gap-2 mb-2">
                      <Lock className="w-4 h-4 text-purple-400" />
                      Password
                    </Label>
                    <Input
                      type="password"
                      placeholder="••••••••"
                      value={loginPassword}
                      onChange={(e) => setLoginPassword(e.target.value)}
                      className="bg-gray-900/50 border-purple-500/30 text-white focus:border-cyan-400/50"
                    />
                  </div>

                  <Button
                    type="submit"
                    disabled={isLoading}
                    className="w-full py-6 bg-gradient-to-r from-purple-600 via-cyan-600 to-blue-600 hover:from-purple-700 hover:via-cyan-700 hover:to-blue-700 text-white rounded-xl shadow-lg shadow-cyan-500/50 hover:shadow-cyan-500/70 transition-all duration-300 hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
                  >
                    {isLoading ? (
                      <div className="flex items-center gap-2">
                        <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                        Logging in...
                      </div>
                    ) : (
                      <>
                        Login to Continue
                        <ArrowRight className="w-5 h-5 ml-2" />
                      </>
                    )}
                  </Button>
                </motion.form>
              ) : (
                <motion.form
                  key="signup"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  onSubmit={handleSignup}
                  className="space-y-4 max-h-[600px] overflow-y-auto pr-2 custom-scrollbar"
                >
                  <h3 className="text-lg text-white font-semibold mb-4 flex items-center gap-2">
                    <User className="w-5 h-5 text-cyan-400" />
                    Personal Information
                  </h3>

                  <div>
                    <Label className="text-gray-300 text-sm">Full Name *</Label>
                    <Input
                      placeholder="John Doe"
                      value={signupData.name}
                      onChange={(e) => setSignupData({ ...signupData, name: e.target.value })}
                      className="mt-1 bg-gray-900/50 border-purple-500/30 text-white focus:border-cyan-400/50"
                    />
                  </div>

                  <div>
                    <Label className="text-gray-300 text-sm">Email Address *</Label>
                    <Input
                      type="email"
                      placeholder="your.email@example.com"
                      value={signupData.email}
                      onChange={(e) => setSignupData({ ...signupData, email: e.target.value })}
                      className="mt-1 bg-gray-900/50 border-purple-500/30 text-white focus:border-cyan-400/50"
                    />
                  </div>

                  <div>
                    <Label className="text-gray-300 text-sm">Password *</Label>
                    <Input
                      type="password"
                      placeholder="••••••••"
                      value={signupData.password}
                      onChange={(e) => setSignupData({ ...signupData, password: e.target.value })}
                      className="mt-1 bg-gray-900/50 border-purple-500/30 text-white focus:border-cyan-400/50"
                    />
                  </div>

                  <div>
                    <Label className="text-gray-300 text-sm">Phone Number</Label>
                    <Input
                      placeholder="+91 98765 43210"
                      value={signupData.phone}
                      onChange={(e) => setSignupData({ ...signupData, phone: e.target.value })}
                      className="mt-1 bg-gray-900/50 border-purple-500/30 text-white focus:border-cyan-400/50"
                    />
                  </div>

                  <div>
                    <Label className="text-gray-300 text-sm">Company Name</Label>
                    <Input
                      placeholder="Your Company"
                      value={signupData.company}
                      onChange={(e) => setSignupData({ ...signupData, company: e.target.value })}
                      className="mt-1 bg-gray-900/50 border-purple-500/30 text-white focus:border-cyan-400/50"
                    />
                  </div>

                  <div>
                    <Label className="text-gray-300 text-sm">Location</Label>
                    <Input
                      placeholder="Mumbai, India"
                      value={signupData.location}
                      onChange={(e) => setSignupData({ ...signupData, location: e.target.value })}
                      className="mt-1 bg-gray-900/50 border-purple-500/30 text-white focus:border-cyan-400/50"
                    />
                  </div>

                  <div>
                    <Label className="text-gray-300 text-sm">Website</Label>
                    <Input
                      placeholder="www.yourwebsite.com"
                      value={signupData.website}
                      onChange={(e) => setSignupData({ ...signupData, website: e.target.value })}
                      className="mt-1 bg-gray-900/50 border-purple-500/30 text-white focus:border-cyan-400/50"
                    />
                  </div>

                  <div className="pt-4 border-t border-gray-700/50">
                    <h3 className="text-lg text-white font-semibold mb-4 flex items-center gap-2">
                      <Globe className="w-5 h-5 text-purple-400" />
                      Social Media Links (Optional)
                    </h3>

                    <div className="space-y-3">
                      <div>
                        <Label className="text-gray-300 text-sm flex items-center gap-2">
                          <Instagram className="w-4 h-4 text-pink-400" />
                          Instagram
                        </Label>
                        <Input
                          placeholder="https://instagram.com/username"
                          value={socialLinks.instagram}
                          onChange={(e) => setSocialLinks({ ...socialLinks, instagram: e.target.value })}
                          className="mt-1 bg-gray-900/50 border-purple-500/30 text-white focus:border-cyan-400/50"
                        />
                      </div>

                      <div>
                        <Label className="text-gray-300 text-sm flex items-center gap-2">
                          <Facebook className="w-4 h-4 text-blue-400" />
                          Facebook
                        </Label>
                        <Input
                          placeholder="https://facebook.com/username"
                          value={socialLinks.facebook}
                          onChange={(e) => setSocialLinks({ ...socialLinks, facebook: e.target.value })}
                          className="mt-1 bg-gray-900/50 border-purple-500/30 text-white focus:border-cyan-400/50"
                        />
                      </div>

                      <div>
                        <Label className="text-gray-300 text-sm flex items-center gap-2">
                          <Youtube className="w-4 h-4 text-red-400" />
                          YouTube
                        </Label>
                        <Input
                          placeholder="https://youtube.com/@username"
                          value={socialLinks.youtube}
                          onChange={(e) => setSocialLinks({ ...socialLinks, youtube: e.target.value })}
                          className="mt-1 bg-gray-900/50 border-purple-500/30 text-white focus:border-cyan-400/50"
                        />
                      </div>

                      <div>
                        <Label className="text-gray-300 text-sm flex items-center gap-2">
                          <Twitter className="w-4 h-4 text-sky-400" />
                          Twitter
                        </Label>
                        <Input
                          placeholder="https://twitter.com/username"
                          value={socialLinks.twitter}
                          onChange={(e) => setSocialLinks({ ...socialLinks, twitter: e.target.value })}
                          className="mt-1 bg-gray-900/50 border-purple-500/30 text-white focus:border-cyan-400/50"
                        />
                      </div>

                      <div>
                        <Label className="text-gray-300 text-sm flex items-center gap-2">
                          <Linkedin className="w-4 h-4 text-blue-500" />
                          LinkedIn
                        </Label>
                        <Input
                          placeholder="https://linkedin.com/in/username"
                          value={socialLinks.linkedin}
                          onChange={(e) => setSocialLinks({ ...socialLinks, linkedin: e.target.value })}
                          className="mt-1 bg-gray-900/50 border-purple-500/30 text-white focus:border-cyan-400/50"
                        />
                      </div>
                    </div>
                  </div>

                  <Button
                    type="submit"
                    disabled={isLoading}
                    className="w-full py-6 bg-gradient-to-r from-purple-600 via-cyan-600 to-blue-600 hover:from-purple-700 hover:via-cyan-700 hover:to-blue-700 text-white rounded-xl shadow-lg shadow-cyan-500/50 hover:shadow-cyan-500/70 transition-all duration-300 hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
                  >
                    {isLoading ? (
                      <div className="flex items-center gap-2">
                        <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                        Creating Account...
                      </div>
                    ) : (
                      <>
                        Create Account
                        <ArrowRight className="w-5 h-5 ml-2" />
                      </>
                    )}
                  </Button>
                </motion.form>
              )}
            </AnimatePresence>
          </motion.div>

          {/* RIGHT - Social Login & Features */}
          <motion.div
            initial={{ x: 20, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="space-y-6"
          >
            {/* Social Login Options */}
            <div className="p-8 rounded-2xl bg-gradient-to-br from-gray-900/90 via-cyan-900/20 to-purple-900/20 border-2 border-cyan-500/30 backdrop-blur-sm shadow-2xl shadow-cyan-500/20">
              <h3 className="text-xl text-white font-semibold mb-6">Quick Sign In</h3>
              
              <div className="space-y-4">
                {/* Google Sign-In Button - Will be rendered by Google */}
                <div 
                  id="google-signin-button"
                  className="w-full flex justify-center items-center [&>div]:mx-auto"
                  style={{ minHeight: '44px' }}
                />

                <Button
                  onClick={handleAppleLogin}
                  disabled={isLoading}
                  variant="outline"
                  className="w-full py-6 border-2 border-gray-700/50 bg-gray-900/50 hover:bg-gray-800/50 text-white rounded-xl transition-all hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
                >
                  <svg className="w-6 h-6 mr-3" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M17.05 20.28c-.98.95-2.05.8-3.08.35-1.09-.46-2.09-.48-3.24 0-1.44.62-2.2.44-3.06-.35C2.79 15.25 3.51 7.59 9.05 7.31c1.35.07 2.29.74 3.08.8 1.18-.24 2.31-.93 3.57-.84 1.51.12 2.65.72 3.4 1.8-3.12 1.87-2.38 5.98.48 7.13-.57 1.5-1.31 2.99-2.54 4.09l.01-.01zM12.03 7.25c-.15-2.23 1.66-4.07 3.74-4.25.29 2.58-2.34 4.5-3.74 4.25z" />
                  </svg>
                  Continue with Apple
                </Button>
              </div>

              <div className="relative my-6">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-gray-700/50"></div>
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="px-4 bg-gray-900/50 text-gray-400">or continue with email</span>
                </div>
              </div>

              <p className="text-center text-xs text-gray-400">
                By continuing, you agree to our Terms of Service and Privacy Policy
              </p>
            </div>

            {/* Features */}
            <div className="p-8 rounded-2xl bg-gradient-to-br from-gray-900/90 via-purple-900/20 to-blue-900/20 border-2 border-purple-500/30 backdrop-blur-sm shadow-2xl shadow-purple-500/20">
              <h3 className="text-xl text-white font-semibold mb-6 flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-cyan-400" />
                Why Choose VULPINIX AI?
              </h3>
              
              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 rounded-full bg-gradient-to-r from-purple-600 to-cyan-600 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <Check className="w-4 h-4 text-white" />
                  </div>
                  <div>
                    <h4 className="text-white font-semibold mb-1">AI-Powered Automation</h4>
                    <p className="text-sm text-gray-400">
                      Let AI analyze and optimize your campaigns automatically
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 rounded-full bg-gradient-to-r from-cyan-600 to-blue-600 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <Check className="w-4 h-4 text-white" />
                  </div>
                  <div>
                    <h4 className="text-white font-semibold mb-1">Multi-Platform Support</h4>
                    <p className="text-sm text-gray-400">
                      Advertise on Instagram, Facebook, YouTube, and more
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 rounded-full bg-gradient-to-r from-blue-600 to-purple-600 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <Check className="w-4 h-4 text-white" />
                  </div>
                  <div>
                    <h4 className="text-white font-semibold mb-1">Real-Time Analytics</h4>
                    <p className="text-sm text-gray-400">
                      Track performance with detailed insights and metrics
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 rounded-full bg-gradient-to-r from-purple-600 to-pink-600 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <Shield className="w-4 h-4 text-white" />
                  </div>
                  <div>
                    <h4 className="text-white font-semibold mb-1">Secure & Encrypted</h4>
                    <p className="text-sm text-gray-400">
                      Your data is protected with enterprise-grade security
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Back to Home Link */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
          className="text-center mt-8"
        >
          <button
            onClick={() => navigate("/")}
            className="text-gray-400 hover:text-cyan-400 transition-colors"
          >
            ← Back to Home
          </button>
        </motion.div>
      </div>

      <style>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 6px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: rgba(31, 41, 55, 0.5);
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: linear-gradient(to bottom, #a855f7, #06b6d4);
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: linear-gradient(to bottom, #9333ea, #0891b2);
        }

        /* Custom Google Button Styling */
        #google-signin-button {
          display: flex !important;
          justify-content: center !important;
          align-items: center !important;
        }

        #google-signin-button > div {
          display: flex !important;
          justify-content: center !important;
          margin: 0 auto !important;
        }
        
        #google-signin-button iframe {
          display: block !important;
          margin: 0 auto !important;
          height: 48px !important;
        }

        #google-signin-button button {
          border-radius: 12px !important;
          transition: all 0.3s ease !important;
        }

        #google-signin-button button:hover {
          transform: scale(1.02);
          box-shadow: 0 8px 16px rgba(6, 182, 212, 0.3) !important;
        }
      `}</style>
    </motion.div>
  );
}