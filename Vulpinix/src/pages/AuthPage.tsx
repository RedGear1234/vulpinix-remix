import { useState, useEffect } from "react";
import { API_BASE } from "../config/api";
import { useNavigate, useLocation } from "react-router";
import { CheckCircle2 } from "lucide-react";
import { toast } from "sonner";
import { GoogleLogin } from "@react-oauth/google";
import { VulpinixLogo } from "../components/VulpinixLogo";

type AuthMode = "login" | "signup";

const GoogleIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24">
    <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
    <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
    <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z"/>
    <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
  </svg>
);

const AppleIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
    <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.8-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z"/>
  </svg>
);

export default function AuthPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const [authMode, setAuthMode] = useState<AuthMode>(location.pathname.includes("signup") ? "signup" : "login");
  const [showLoginPwd, setShowLoginPwd] = useState(false);
  const [showSignupPwd, setShowSignupPwd] = useState(false);
  const [loginEmail, setLoginEmail] = useState("");
  const [loginPassword, setLoginPassword] = useState("");
  const [signupData, setSignupData] = useState({ firstName: "", lastName: "", email: "", password: "" });
  const [termsChecked, setTermsChecked] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [pwdScore, setPwdScore] = useState(0);
  const [pwdHint, setPwdHint] = useState("Use 8+ characters, numbers & symbols");

  useEffect(() => { if (location.pathname.includes("signup")) setAuthMode("signup"); else if (location.pathname.includes("login")) setAuthMode("login"); }, [location.pathname]);
  useEffect(() => { localStorage.setItem("returningUser", "true"); }, []);
  useEffect(() => { const u = localStorage.getItem("userInfo"), a = localStorage.getItem("isAuthenticated"); if (u || a === "true") navigate("/upload", { replace: true }); }, [navigate]);

  const handleGoogleSuccess = async (credentialResponse: any) => {
    setIsLoading(true);
    try {
      const res = await fetch(`${API_BASE}/api/users/google`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ credential: credentialResponse.credential }),
      });
      const data = await res.json();
      
      if (!res.ok) {
        toast.error(data.message || "Google Sign-In Failed");
        setIsLoading(false);
        return;
      }

      localStorage.setItem("authToken", data.token);
      localStorage.setItem("userInfo", JSON.stringify(data.user));
      localStorage.setItem("isAuthenticated", "true");
      localStorage.setItem("authProvider", "google");
      localStorage.setItem("socialLinks", JSON.stringify({ instagram: "", facebook: "", youtube: "", twitter: "", linkedin: "" }));
      
      toast.success(
        <div className="flex items-center gap-2">
          <CheckCircle2 className="w-5 h-5 text-green-400" />
          <div>
            <p className="font-semibold">Welcome, {data.user.name}!</p>
            <p className="text-xs text-gray-400 mt-0.5">Signed in via Google</p>
          </div>
        </div>, 
        { duration: 5000 }
      );

      setTimeout(() => navigate("/upload"), 1000);
    } catch (err) {
      console.error("Google login error:", err);
      toast.error("Could not reach server. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleError = () => { 
    toast.error("Google Sign-In Failed", { description: "An error occurred during Google authentication." }); 
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!loginEmail || !loginPassword) { toast.error("Please fill all fields"); return; }
    setIsLoading(true);
    try {
      const res = await fetch("${API_BASE}/api/users/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: loginEmail, password: loginPassword }),
      });
      const data = await res.json();
      if (!res.ok) { toast.error(data.message || "Login failed"); setIsLoading(false); return; }
      localStorage.setItem("isAuthenticated", "true");
      localStorage.setItem("authToken", data.token);
      localStorage.setItem("userEmail", data.user.email);
      localStorage.setItem("userInfo", JSON.stringify(data.user));
      localStorage.setItem("socialLinks", JSON.stringify({ instagram: "", facebook: "", youtube: "", twitter: "", linkedin: "" }));
      toast.success("Welcome back!", { description: "Successfully logged in." });
      navigate("/upload");
    } catch {
      toast.error("Could not reach server. Please try again.");
      setIsLoading(false);
    }
  };

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!signupData.firstName || !signupData.email || !signupData.password) { toast.error("Please fill required fields"); return; }
    if (!termsChecked) { toast.error("Please accept the Terms of Service"); return; }
    setIsLoading(true);
    try {
      const res = await fetch("${API_BASE}/api/users/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(signupData),
      });
      const data = await res.json();
      if (!res.ok) { toast.error(data.message || "Signup failed"); setIsLoading(false); return; }
      localStorage.setItem("isAuthenticated", "true");
      localStorage.setItem("authToken", data.token);
      localStorage.setItem("userInfo", JSON.stringify(data.user));
      localStorage.setItem("socialLinks", JSON.stringify({ instagram: "", facebook: "", youtube: "", twitter: "", linkedin: "" }));
      toast.success("Account Created! 🎉", { description: "Welcome to VULPINIX AI" });
      navigate("/upload");
    } catch {
      toast.error("Could not reach server. Please try again.");
      setIsLoading(false);
    }
  };

  const checkPasswordStrength = (v: string) => {
    let sc = 0;
    if (v.length >= 8) sc++; if (/[A-Z]/.test(v)) sc++; if (/[0-9]/.test(v)) sc++; if (/[^A-Za-z0-9]/.test(v)) sc++;
    setPwdScore(sc);
    const hints = ["Too short", "Weak — add uppercase", "Medium — add numbers", "Strong ✓"];
    setPwdHint(v ? hints[Math.max(0, sc - 1)] : "Use 8+ characters, numbers & symbols");
  };

  const getBarColor = (i: number) => {
    if (!signupData.password || i >= pwdScore) return "rgba(255,255,255,0.08)";
    if (pwdScore <= 1) return "#ef4444"; if (pwdScore === 2) return "#f59e0b"; return "#10b981";
  };

  const sw = (mode: AuthMode) => { setAuthMode(mode); navigate(mode === "login" ? "/login" : "/signup", { replace: true }); };

  return (
    <>
      <style>{`
        /* Inter loaded globally via index.html */

        .auth-root {
          min-height: 100vh;
          background: #07080f;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 20px;
          font-family: 'Inter', sans-serif;
          position: relative;
          overflow: hidden;
        }

        /* Gradient blobs */
        .auth-blob {
          position: fixed;
          border-radius: 50%;
          filter: blur(80px);
          pointer-events: none;
          animation: blobFloat 20s ease-in-out infinite;
        }
        .auth-blob-1 { width: 600px; height: 600px; background: radial-gradient(circle, rgba(109,40,217,0.35) 0%, transparent 70%); top: -150px; left: -150px; }
        .auth-blob-2 { width: 500px; height: 500px; background: radial-gradient(circle, rgba(6,182,212,0.2) 0%, transparent 70%); bottom: -100px; right: -100px; animation-delay: -10s; animation-direction: reverse; }
        @keyframes blobFloat { 0%,100%{transform:translate(0,0) scale(1)} 50%{transform:translate(30px,40px) scale(1.05)} }

        /* Main card */
        .auth-card {
          position: relative;
          z-index: 10;
          width: 100%;
          max-width: 440px;
          background: rgba(255,255,255,0.03);
          border: 1px solid rgba(255,255,255,0.08);
          border-radius: 24px;
          padding: 40px 36px;
          box-shadow: 0 0 0 1px rgba(255,255,255,0.03) inset, 0 40px 80px rgba(0,0,0,0.5);
        }
        .auth-card::before {
          content: '';
          position: absolute;
          top: 0; left: 0; right: 0; height: 1px;
          background: linear-gradient(90deg, transparent, rgba(139,92,246,0.5), rgba(6,182,212,0.4), transparent);
          border-radius: 24px 24px 0 0;
        }

        /* Logo */
        .auth-logo { display: flex; align-items: center; justify-content: center; gap: 10px; margin-bottom: 32px; cursor: pointer; text-decoration: none; }
        .auth-logo-icon {
          width: 40px; height: 40px; border-radius: 12px;
          background: linear-gradient(135deg, #7c3aed, #06b6d4);
          display: flex; align-items: center; justify-content: center;
          font-family: 'Inter', sans-serif; font-weight: 800; font-size: 17px; color: #fff;
          box-shadow: 0 0 20px rgba(124,58,237,0.5);
        }
        .auth-logo-text { font-family: 'Inter', sans-serif; font-size: 19px; font-weight: 800; color: #fff; letter-spacing: -0.02em; }
        .auth-logo-text em { font-style: normal; background: linear-gradient(135deg, #a78bfa, #22d3ee); -webkit-background-clip: text; -webkit-text-fill-color: transparent; background-clip: text; }

        /* Tabs */
        .auth-tabs { display: flex; background: rgba(255,255,255,0.04); border: 1px solid rgba(255,255,255,0.07); border-radius: 12px; padding: 3px; margin-bottom: 28px; gap: 3px; }
        .auth-tab {
          flex: 1; padding: 10px 8px; border-radius: 9px; border: none; background: none;
          font-family: 'Inter', sans-serif; font-size: 13px; font-weight: 600; color: rgba(255,255,255,0.35);
          cursor: pointer; transition: all 0.25s; letter-spacing: 0.01em;
        }
        .auth-tab.active { background: rgba(124,58,237,0.9); color: #fff; box-shadow: 0 2px 16px rgba(124,58,237,0.4); }

        /* Heading */
        .auth-heading { font-family: 'Inter', sans-serif; font-size: 24px; font-weight: 800; color: #fff; margin-bottom: 4px; letter-spacing: -0.025em; }
        .auth-subheading { font-size: 13px; color: rgba(160,160,190,0.65); margin-bottom: 24px; line-height: 1.5; }

        /* Social buttons */
        .auth-socials { display: flex; gap: 8px; margin-bottom: 20px; }
        .auth-soc-btn {
          flex: 1; display: flex; align-items: center; justify-content: center; gap: 8px;
          padding: 11px 14px; border-radius: 10px; border: 1px solid rgba(255,255,255,0.1);
          background: rgba(255,255,255,0.04); color: rgba(255,255,255,0.85);
          font-family: 'Inter', sans-serif; font-size: 13px; font-weight: 500;
          cursor: pointer; transition: all 0.2s;
        }
        .auth-soc-btn:hover { background: rgba(255,255,255,0.09); border-color: rgba(255,255,255,0.18); transform: translateY(-1px); }

        /* Divider */
        .auth-divider { display: flex; align-items: center; gap: 10px; margin-bottom: 18px; }
        .auth-divider-line { flex: 1; height: 1px; background: rgba(255,255,255,0.07); }
        .auth-divider-text { font-size: 11px; color: rgba(140,140,170,0.5); text-transform: uppercase; letter-spacing: 0.06em; }

        /* Fields */
        .auth-field { margin-bottom: 14px; }
        .auth-label { display: block; font-size: 11px; font-weight: 600; color: rgba(180,180,210,0.7); margin-bottom: 6px; text-transform: uppercase; letter-spacing: 0.07em; }
        .auth-input-wrap { position: relative; }
        .auth-input {
          width: 100%; background: rgba(255,255,255,0.05); border: 1px solid rgba(255,255,255,0.09);
          border-radius: 10px; padding: 12px 40px 12px 14px; font-size: 14px; color: #fff;
          font-family: 'Inter', sans-serif; outline: none; transition: all 0.2s;
        }
        .auth-input::placeholder { color: rgba(120,120,160,0.4); }
        .auth-input:focus { background: rgba(124,58,237,0.08); border-color: rgba(124,58,237,0.5); box-shadow: 0 0 0 3px rgba(124,58,237,0.1); }
        .auth-input-icon { position: absolute; right: 12px; top: 50%; transform: translateY(-50%); color: rgba(130,130,170,0.5); background: none; border: none; cursor: pointer; font-size: 14px; padding: 0; transition: color 0.2s; }
        .auth-input-icon:hover { color: #a78bfa; }
        .auth-two-col { display: grid; grid-template-columns: 1fr 1fr; gap: 10px; }

        /* Password strength */
        .pwd-bars { display: flex; gap: 4px; margin-top: 6px; }
        .pwd-bar { flex: 1; height: 2px; border-radius: 10px; transition: background 0.3s; }
        .pwd-hint { font-size: 11px; margin-top: 4px; color: rgba(140,140,170,0.6); transition: color 0.3s; }

        /* Forgot */
        .auth-forgot { text-align: right; margin: -6px 0 16px; }
        .auth-forgot-btn { font-size: 12px; color: #a78bfa; background: none; border: none; cursor: pointer; font-family: 'Inter', sans-serif; font-weight: 500; transition: color 0.2s; }
        .auth-forgot-btn:hover { color: #22d3ee; }

        /* Terms */
        .auth-terms { display: flex; align-items: flex-start; gap: 10px; margin-bottom: 16px; }
        .auth-checkbox { width: 17px; height: 17px; border-radius: 5px; border: 1.5px solid rgba(124,58,237,0.4); background: rgba(124,58,237,0.07); flex-shrink: 0; cursor: pointer; display: flex; align-items: center; justify-content: center; margin-top: 1px; font-size: 10px; color: transparent; transition: all 0.2s; }
        .auth-checkbox.checked { background: linear-gradient(135deg, #7c3aed, #06b6d4); border-color: transparent; color: #fff; }
        .auth-terms-text { font-size: 12px; color: rgba(160,160,190,0.65); line-height: 1.55; }
        .auth-terms-text a { color: #a78bfa; text-decoration: underline; }

        /* Submit button */
        .auth-submit {
          width: 100%; padding: 14px; border: none; border-radius: 12px;
          background: linear-gradient(135deg, #7c3aed 0%, #6d28d9 100%);
          font-family: 'Inter', sans-serif; font-size: 14px; font-weight: 700; color: #fff;
          cursor: pointer; transition: all 0.25s; display: flex; align-items: center; justify-content: center; gap: 8px;
          margin-bottom: 16px; letter-spacing: 0.02em; position: relative; overflow: hidden;
        }
        .auth-submit::after { content: ''; position: absolute; inset: 0; background: linear-gradient(135deg, transparent, rgba(255,255,255,0.1), transparent); transform: translateX(-100%); transition: transform 0.5s; }
        .auth-submit:hover::after { transform: translateX(100%); }
        .auth-submit:hover { box-shadow: 0 8px 30px rgba(124,58,237,0.5); transform: translateY(-1px); }
        .auth-submit:active { transform: scale(0.98); }
        .auth-submit:disabled { opacity: 0.5; cursor: not-allowed; transform: none; box-shadow: none; }
        .auth-submit-arrow { transition: transform 0.2s; }
        .auth-submit:hover .auth-submit-arrow { transform: translateX(4px); }

        /* Switch */
        .auth-switch { text-align: center; font-size: 13px; color: rgba(150,150,180,0.55); font-family: 'Inter', sans-serif; }
        .auth-switch span { color: #a78bfa; cursor: pointer; font-weight: 600; transition: color 0.2s; }
        .auth-switch span:hover { color: #22d3ee; }

        /* Secure badge */
        .auth-secure { display: flex; align-items: center; justify-content: center; gap: 6px; margin-top: 18px; font-size: 11px; color: rgba(120,120,150,0.4); }
        .auth-secure-dot { width: 5px; height: 5px; border-radius: 50%; background: #10b981; flex-shrink: 0; animation: secPulse 2s infinite; }
        @keyframes secPulse { 0%,100%{opacity:1} 50%{opacity:0.3} }

        /* Spinner */
        .auth-spinner { width: 18px; height: 18px; border: 2px solid rgba(255,255,255,0.25); border-top-color: #fff; border-radius: 50%; animation: spin 0.7s linear infinite; }
        @keyframes spin { to { transform: rotate(360deg); } }

        @media (max-width: 480px) { .auth-card { padding: 28px 20px; } .auth-socials { flex-direction: column; } }

        .google-btn-container { position: relative; flex: 1; height: 44px; overflow: hidden; border-radius: 10px; border: 1px solid rgba(255,255,255,0.1); background: rgba(255,255,255,0.04); transition: all 0.2s; }
        .google-btn-container:hover { background: rgba(255,255,255,0.09); border-color: rgba(255,255,255,0.18); transform: translateY(-1px); }
        .google-login-wrapper { position: absolute; inset: 0; opacity: 0; cursor: pointer; }
        .google-login-wrapper iframe { width: 100% !important; height: 100% !important; cursor: pointer !important; }
      `}</style>

      <div className="auth-blob auth-blob-1" />
      <div className="auth-blob auth-blob-2" />

      <div className="auth-root">
        <div className="auth-card">

          <VulpinixLogo size="md" style={{ justifyContent: "center", marginBottom: 32 }} />

          {/* Tabs */}
          <div className="auth-tabs">
            <button className={`auth-tab${authMode === "login" ? " active" : ""}`} onClick={() => sw("login")}>Sign In</button>
            <button className={`auth-tab${authMode === "signup" ? " active" : ""}`} onClick={() => sw("signup")}>Create Account</button>
          </div>

          {/* LOGIN */}
          {authMode === "login" && (
            <form onSubmit={handleLogin}>
              <div className="auth-heading">Welcome back 👋</div>
              <div className="auth-subheading">Sign in to continue to Vulpinix AI</div>

              <div className="auth-socials">
                <div className="google-btn-container">
                  <button type="button" className="auth-soc-btn" style={{ width: "100%", height: "100%", border: "none", background: "none" }}>
                    <GoogleIcon /> Google
                  </button>
                  <div className="google-login-wrapper">
                    <GoogleLogin 
                      onSuccess={handleGoogleSuccess} 
                      onError={handleGoogleError}
                      useOneTap
                      theme="filled_black"
                      shape="rectangular"
                      size="large"
                      width="400"
                    />
                  </div>
                </div>
                <button type="button" className="auth-soc-btn" style={{ flex: 1 }}>
                  <AppleIcon /> Apple
                </button>
              </div>

              <div className="auth-divider">
                <div className="auth-divider-line" />
                <div className="auth-divider-text">or</div>
                <div className="auth-divider-line" />
              </div>

              <div className="auth-field">
                <label className="auth-label">Email</label>
                <div className="auth-input-wrap">
                  <input className="auth-input" type="email" placeholder="you@example.com" value={loginEmail} onChange={e => setLoginEmail(e.target.value)} autoComplete="email" />
                  <span className="auth-input-icon">✉</span>
                </div>
              </div>

              <div className="auth-field">
                <label className="auth-label">Password</label>
                <div className="auth-input-wrap">
                  <input className="auth-input" type={showLoginPwd ? "text" : "password"} placeholder="Enter your password" value={loginPassword} onChange={e => setLoginPassword(e.target.value)} autoComplete="current-password" />
                  <button type="button" className="auth-input-icon" onClick={() => setShowLoginPwd(!showLoginPwd)}>{showLoginPwd ? "🙈" : "👁"}</button>
                </div>
              </div>

              <div className="auth-forgot">
                <button type="button" className="auth-forgot-btn">Forgot password?</button>
              </div>

              <button type="submit" className="auth-submit" disabled={isLoading}>
                {isLoading ? <div className="auth-spinner" /> : <>Sign In <span className="auth-submit-arrow">→</span></>}
              </button>

              <div className="auth-switch">
                No account? <span onClick={() => sw("signup")}>Create one free →</span>
              </div>
            </form>
          )}

          {/* SIGNUP */}
          {authMode === "signup" && (
            <form onSubmit={handleSignup}>
              <div className="auth-heading">Create Account ✦</div>
              <div className="auth-subheading">Join 500+ marketers — free to start</div>

              <div className="auth-socials">
                <div className="google-btn-container">
                  <button type="button" className="auth-soc-btn" style={{ width: "100%", height: "100%", border: "none", background: "none" }}>
                    <GoogleIcon /> Google
                  </button>
                  <div className="google-login-wrapper">
                    <GoogleLogin 
                      onSuccess={handleGoogleSuccess} 
                      onError={handleGoogleError}
                      useOneTap
                      theme="filled_black"
                      shape="rectangular"
                      size="large"
                      width="400"
                    />
                  </div>
                </div>
                <button type="button" className="auth-soc-btn" style={{ flex: 1 }}>
                  <AppleIcon /> Apple
                </button>
              </div>

              <div className="auth-divider">
                <div className="auth-divider-line" />
                <div className="auth-divider-text">or</div>
                <div className="auth-divider-line" />
              </div>

              <div className="auth-two-col">
                <div className="auth-field">
                  <label className="auth-label">First Name</label>
                  <input className="auth-input" type="text" placeholder="First" value={signupData.firstName} onChange={e => setSignupData({ ...signupData, firstName: e.target.value })} />
                </div>
                <div className="auth-field">
                  <label className="auth-label">Last Name</label>
                  <input className="auth-input" type="text" placeholder="Last" value={signupData.lastName} onChange={e => setSignupData({ ...signupData, lastName: e.target.value })} />
                </div>
              </div>

              <div className="auth-field">
                <label className="auth-label">Email</label>
                <div className="auth-input-wrap">
                  <input className="auth-input" type="email" placeholder="you@example.com" value={signupData.email} onChange={e => setSignupData({ ...signupData, email: e.target.value })} autoComplete="email" />
                  <span className="auth-input-icon">✉</span>
                </div>
              </div>

              <div className="auth-field">
                <label className="auth-label">Password</label>
                <div className="auth-input-wrap">
                  <input className="auth-input" type={showSignupPwd ? "text" : "password"} placeholder="Create a strong password" value={signupData.password}
                    onChange={e => { setSignupData({ ...signupData, password: e.target.value }); checkPasswordStrength(e.target.value); }} />
                  <button type="button" className="auth-input-icon" onClick={() => setShowSignupPwd(!showSignupPwd)}>{showSignupPwd ? "🙈" : "👁"}</button>
                </div>
                <div className="pwd-bars">
                  {[0, 1, 2, 3].map(i => <div key={i} className="pwd-bar" style={{ background: getBarColor(i) }} />)}
                </div>
                <div className="pwd-hint" style={{ color: pwdScore >= 3 ? "#10b981" : pwdScore === 2 ? "#f59e0b" : pwdScore === 1 ? "#ef4444" : undefined }}>{pwdHint}</div>
              </div>

              <div className="auth-terms">
                <div className={`auth-checkbox${termsChecked ? " checked" : ""}`} onClick={() => setTermsChecked(!termsChecked)}>
                  {termsChecked ? "✓" : ""}
                </div>
                <div className="auth-terms-text">I agree to the <a href="/terms">Terms of Service</a> and <a href="/privacy">Privacy Policy</a></div>
              </div>

              <button type="submit" className="auth-submit" disabled={isLoading}>
                {isLoading ? <div className="auth-spinner" /> : <>Create Free Account <span className="auth-submit-arrow">→</span></>}
              </button>

              <div className="auth-switch">
                Have an account? <span onClick={() => sw("login")}>Sign in →</span>
              </div>
            </form>
          )}

          <div className="auth-secure">
            <div className="auth-secure-dot" />
            256-bit SSL encrypted · Always safe
          </div>

        </div>
      </div>
    </>
  );
}
