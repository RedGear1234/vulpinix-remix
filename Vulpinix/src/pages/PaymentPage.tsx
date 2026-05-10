import { API_BASE } from "../config/api";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router";
import { motion, AnimatePresence } from "framer-motion";
import { 
  ArrowLeft, 
  CreditCard, 
  Smartphone, 
  Wallet, 
  ShieldCheck, 
  Clock, 
  DollarSign, 
  Target, 
  Zap, 
  ChevronRight, 
  Sparkles,
  Lock,
  CheckCircle2,
  AlertCircle
} from "lucide-react";
import { toast } from "sonner";
import PaymentSuccessModal from "../components/PaymentSuccessModal";
import { VulpinixLogo } from "../components/VulpinixLogo";

type PaymentMethod = "upi" | "card" | "wallet" | null;

export default function PaymentPage() {
  const navigate = useNavigate();
  const [selectedMethod, setSelectedMethod] = useState<PaymentMethod>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);

  // OTP state
  const [showOtpInput, setShowOtpInput] = useState(false);
  const [otp, setOtp] = useState("");
  const [generatedOtp, setGeneratedOtp] = useState("");
  const [isOtpVerified, setIsOtpVerified] = useState(false);
  const [isSendingOtp, setIsSendingOtp] = useState(false);

  // Card payment state
  const [cardNumber, setCardNumber] = useState("");
  const [cardName, setCardName] = useState("");
  const [expiryDate, setExpiryDate] = useState("");
  const [cvv, setCvv] = useState("");

  // UPI state
  const [upiId, setUpiId] = useState("");

  // Load Campaign data
  const [campaignData, setCampaignData] = useState({
    name: "Summer Sale Campaign",
    objective: "Brand Awareness",
    platforms: ["Instagram", "Facebook", "YouTube"],
    budgetType: "Daily",
    budget: "₹5,000",
    totalAmount: "₹35,000",
    duration: "7 Days",
    estimatedReach: "180K+"
  });

  useEffect(() => {
    const savedCampaign = localStorage.getItem("campaignData");
    if (savedCampaign) {
      try {
        setCampaignData(JSON.parse(savedCampaign));
      } catch {}
    }
  }, []);

  const handleSendOtp = () => {
    if (!selectedMethod) {
      toast.error("Please select a payment method");
      return;
    }
    setIsSendingOtp(true);
    const newOtp = Math.floor(100000 + Math.random() * 900000).toString();
    setTimeout(() => {
      setGeneratedOtp(newOtp);
      setShowOtpInput(true);
      setIsSendingOtp(false);
      toast.success("Security Code Sent", {
        description: `For demo, use code: ${newOtp}`,
        duration: 8000,
      });
    }, 1500);
  };

  const handleVerifyOtp = () => {
    if (otp === generatedOtp) {
      setIsOtpVerified(true);
      toast.success("Identity Verified");
    } else {
      toast.error("Invalid Code");
    }
  };

  const handlePayment = async () => {
    setIsProcessing(true);
    
    try {
      const userInfo = JSON.parse(localStorage.getItem("userInfo") || "{}");
      const authToken = localStorage.getItem("authToken");
      const adCreative = JSON.parse(localStorage.getItem("adCreativeData") || "{}");
      const savedAdImage = localStorage.getItem("adPreviewImage") || "";

      // Construct payload for backend
      const payload = {
        userId: userInfo.email,
        userName: userInfo.name,
        userEmail: userInfo.email,
        businessName: userInfo.company || userInfo.name || "My Business",
        campaignName: campaignData.name,
        objective: campaignData.objective,
        budget: campaignData.budget,
        budgetType: campaignData.budgetType,
        platforms: campaignData.platforms,
        duration: campaignData.duration,
        estimatedReach: campaignData.estimatedReach,
        adCaption: adCreative.caption || "",
        adImage: savedAdImage, // This is base64
        payment: {
          amount: campaignData.totalAmount,
          method: selectedMethod,
          paymentId: `PAY-${Date.now()}`,
          transactionId: `TXN-${Math.random().toString(36).substring(2, 10).toUpperCase()}`
        }
      };

      const response = await fetch("${API_BASE}/api/campaign/create", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${authToken}`
        },
        body: JSON.stringify(payload)
      });

      const data = await response.json();

      if (data.success) {
        setIsProcessing(false);
        setShowSuccessModal(true);
        
        // Also keep a local copy for immediate feedback if needed, 
        // though dashboard should now fetch from API
        const newCampaign = {
          id: data.campaign.id,
          ...payload,
          status: "pending",
          dateSubmitted: new Date().toISOString().split("T")[0],
          analytics: { impressions: 0, reach: 0, clicks: 0, ctr: 0, conversions: 0, adSpend: 0, roas: 0 }
        };

        const existingRaw = localStorage.getItem("userCampaigns");
        let campaigns = existingRaw ? JSON.parse(existingRaw) : [];
        if (!Array.isArray(campaigns)) campaigns = [];
        campaigns.unshift(newCampaign);
        localStorage.setItem("userCampaigns", JSON.stringify(campaigns));
        
        // Clear draft state
        localStorage.removeItem("campaignData");
        localStorage.removeItem("adCreativeData");
        localStorage.removeItem("uploadData");
        localStorage.removeItem("adPreviewImage");
      } else {
        toast.error(data.message || "Failed to create campaign on server.");
        setIsProcessing(false);
      }
    } catch (error) {
      console.error("Payment error:", error);
      toast.error("Server connection failed. Please try again.");
      setIsProcessing(false);
    }
  };

  const paymentMethods = [
    { 
      id: "upi", 
      name: "UPI / Apps", 
      icon: Smartphone, 
      brands: [
        { name: "GPay", src: "https://upload.wikimedia.org/wikipedia/commons/f/f2/Google_Pay_Logo.svg", w: 32 },
        { name: "PhonePe", src: "https://upload.wikimedia.org/wikipedia/commons/7/71/PhonePe_Logo.svg", w: 20 },
        { name: "Paytm", src: "https://upload.wikimedia.org/wikipedia/commons/2/24/Paytm_Logo_%28standalone%29.svg", w: 34 },
        { name: "UPI", src: "https://upload.wikimedia.org/wikipedia/commons/e/e1/UPI-Logo-vector.svg", w: 28 }
      ]
    },
    { 
      id: "card", 
      name: "Credit / Debit", 
      icon: CreditCard, 
      brands: [
        { name: "Visa", src: "https://cdn.simpleicons.org/visa/1A1F71", w: 28 },
        { name: "Mastercard", src: "https://upload.wikimedia.org/wikipedia/commons/2/2a/Mastercard-logo.svg", w: 22 },
        { name: "RuPay", src: "https://upload.wikimedia.org/wikipedia/commons/c/cb/Rupay-Logo.png", w: 32 }
      ]
    },
    { 
      id: "wallet", 
      name: "Wallets", 
      icon: Wallet, 
      soon: true,
      brands: [
        { name: "Paytm", src: "https://upload.wikimedia.org/wikipedia/commons/2/24/Paytm_Logo_%28standalone%29.svg", w: 34 },
        { name: "PayPal", src: "https://cdn.simpleicons.org/paypal/00457C", w: 22 }
      ]
    },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      style={{
        background: "var(--vx-bg-primary)",
        minHeight: "100vh",
        padding: "100px 24px 120px",
        color: "var(--vx-text-primary)"
      }}
    >
      <PaymentSuccessModal
        isOpen={showSuccessModal}
        onConfirm={() => navigate("/dashboard/campaigns")}
      />

      <div style={{ maxWidth: 820, margin: "0 auto" }}>
        
        {/* Header */}
        <div style={{ marginBottom: 60 }}>
          <button 
            onClick={() => navigate("/ad-preview")}
            style={{ display: "flex", alignItems: "center", gap: 8, background: "none", border: "none", color: "var(--vx-text-muted)", cursor: "pointer", fontSize: 14, fontWeight: 600, marginBottom: 20, padding: 0 }}
            onMouseEnter={e => e.currentTarget.style.color = "var(--vx-text-primary)"}
            onMouseLeave={e => e.currentTarget.style.color = "var(--vx-text-muted)"}
          >
            <ArrowLeft size={16} /> Back to Preview
          </button>
          
          <h1 style={{ fontSize: "clamp(2rem, 5vw, 2.8rem)", fontWeight: 800, letterSpacing: "-0.04em", margin: 0 }}>
            Secure <span style={{ background: "linear-gradient(135deg, #a78bfa, #38bdf8)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>Checkout</span>
          </h1>
          <p style={{ color: "var(--vx-text-secondary)", fontSize: 16, marginTop: 12 }}>Finalize your investment and launch your AI campaign.</p>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "1fr", gap: 32 }}>
          
          {/* Order Summary */}
          <div style={{ background: "var(--vx-bg-card)", border: "1px solid var(--vx-border)", borderRadius: 24, padding: "32px" }}>
            <h3 style={{ fontSize: 18, fontWeight: 800, marginBottom: 24 }}>Campaign Summary</h3>
            
            <div style={{ display: "flex", flexWrap: "wrap", gap: 16, marginBottom: 32 }}>
              <div style={{ flex: 1, minWidth: 150, background: "var(--vx-bg-input)", padding: "16px", borderRadius: 16, border: "1px solid var(--vx-border)" }}>
                <div style={{ fontSize: 11, fontWeight: 800, color: "var(--vx-text-muted)", textTransform: "uppercase", marginBottom: 4 }}>Budget</div>
                <div style={{ fontSize: 18, fontWeight: 700 }}>{campaignData.budget}</div>
              </div>
              <div style={{ flex: 1, minWidth: 150, background: "var(--vx-bg-input)", padding: "16px", borderRadius: 16, border: "1px solid var(--vx-border)" }}>
                <div style={{ fontSize: 11, fontWeight: 800, color: "var(--vx-text-muted)", textTransform: "uppercase", marginBottom: 4 }}>Duration</div>
                <div style={{ fontSize: 18, fontWeight: 700 }}>{campaignData.duration}</div>
              </div>
            </div>

            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "24px", background: "rgba(167, 139, 250, 0.05)", borderRadius: 20, border: "1px solid rgba(167, 139, 250, 0.2)" }}>
              <div>
                <div style={{ fontSize: 14, fontWeight: 600, color: "var(--vx-text-secondary)" }}>Total Investment</div>
                <div style={{ fontSize: 11, color: "var(--vx-text-muted)", marginTop: 2 }}>All inclusive platform & ad spend</div>
              </div>
              <div style={{ fontSize: 32, fontWeight: 800, color: "var(--vx-text-primary)", letterSpacing: "-0.04em" }}>{campaignData.totalAmount}</div>
            </div>
          </div>

          {/* Payment Methods */}
          <div style={{ background: "var(--vx-bg-card)", border: "1px solid var(--vx-border)", borderRadius: 24, padding: "32px" }}>
            <h3 style={{ fontSize: 18, fontWeight: 800, marginBottom: 24 }}>Payment Method</h3>
            
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: 16, marginBottom: 32 }}>
              {paymentMethods.map(method => (
                <button
                  key={method.id}
                  disabled={method.soon}
                  onClick={() => setSelectedMethod(method.id as PaymentMethod)}
                  style={{ 
                    position: "relative", padding: "20px", borderRadius: 20, border: "1px solid", 
                    borderColor: selectedMethod === method.id ? "var(--vx-text-primary)" : "var(--vx-border)",
                    background: selectedMethod === method.id ? "rgba(255,255,255,0.05)" : "var(--vx-bg-input)",
                    textAlign: "left", cursor: method.soon ? "not-allowed" : "pointer", transition: "0.2s",
                    opacity: method.soon ? 0.5 : 1,
                    display: "flex", flexDirection: "column", justifyContent: "space-between"
                  }}
                >
                  {method.soon && <span style={{ position: "absolute", top: 12, right: 12, fontSize: 8, fontWeight: 900, background: "var(--vx-border)", padding: "2px 6px", borderRadius: 4, textTransform: "uppercase" }}>Soon</span>}
                  <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 20 }}>
                    <div style={{ width: 40, height: 40, borderRadius: 10, background: "var(--vx-bg-primary)", display: "flex", alignItems: "center", justifyContent: "center", color: selectedMethod === method.id ? "var(--vx-text-primary)" : "var(--vx-text-muted)" }}>
                      <method.icon size={20} />
                    </div>
                    <div style={{ fontSize: 15, fontWeight: 700, color: "var(--vx-text-primary)" }}>{method.name}</div>
                  </div>
                  
                  {/* Brand Icons Row */}
                  <div style={{ display: "flex", gap: 8, flexWrap: "wrap", alignItems: "center" }}>
                    {method.brands.map(brand => (
                      <div 
                        key={brand.name} 
                        title={brand.name}
                        style={{ 
                          display: "flex", alignItems: "center", justifyContent: "center", 
                          width: 44, height: 26, background: "#fff", border: "1px solid var(--vx-border)", 
                          borderRadius: 6, overflow: "hidden" 
                        }}
                      >
                        <img src={brand.src} alt={brand.name} style={{ width: brand.w, objectFit: "contain" }} />
                      </div>
                    ))}
                  </div>
                </button>
              ))}
            </div>

            {/* Conditional Inputs */}
            <AnimatePresence mode="wait">
              {selectedMethod === "upi" && (
                <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                  <label style={{ fontSize: 12, fontWeight: 800, textTransform: "uppercase", color: "var(--vx-text-muted)" }}>UPI Address</label>
                  <input 
                    type="text" value={upiId} onChange={e => setUpiId(e.target.value)}
                    placeholder="username@okbank"
                    style={{ background: "var(--vx-bg-input)", border: "1px solid var(--vx-border)", borderRadius: 12, padding: "14px 18px", color: "var(--vx-text-primary)", fontWeight: 600, outline: "none" }}
                  />
                </motion.div>
              )}
              {selectedMethod === "card" && (
                <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} style={{ display: "flex", flexDirection: "column", gap: 20 }}>
                  <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                    <label style={{ fontSize: 12, fontWeight: 800, textTransform: "uppercase", color: "var(--vx-text-muted)" }}>Card Details</label>
                    <input 
                      type="text" placeholder="0000 0000 0000 0000"
                      style={{ background: "var(--vx-bg-input)", border: "1px solid var(--vx-border)", borderRadius: 12, padding: "14px 18px", color: "var(--vx-text-primary)", fontWeight: 600, outline: "none" }}
                    />
                  </div>
                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
                    <input type="text" placeholder="MM / YY" style={{ background: "var(--vx-bg-input)", border: "1px solid var(--vx-border)", borderRadius: 12, padding: "14px 18px", color: "var(--vx-text-primary)", fontWeight: 600, outline: "none" }} />
                    <input type="password" placeholder="CVV" style={{ background: "var(--vx-bg-input)", border: "1px solid var(--vx-border)", borderRadius: 12, padding: "14px 18px", color: "var(--vx-text-primary)", fontWeight: 600, outline: "none" }} />
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Verification Step */}
          {selectedMethod && !isOtpVerified && (
            <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} style={{ background: "var(--vx-bg-card)", border: "1px solid var(--vx-border)", borderRadius: 24, padding: "32px", textAlign: "center" }}>
              {!showOtpInput ? (
                <div>
                  <h3 style={{ fontSize: 18, fontWeight: 800, marginBottom: 12 }}>Verification Required</h3>
                  <p style={{ color: "var(--vx-text-muted)", fontSize: 14, marginBottom: 24 }}>We'll send a 6-digit code to your registered mobile for security.</p>
                  <button 
                    onClick={handleSendOtp} disabled={isSendingOtp}
                    style={{ padding: "14px 32px", borderRadius: 12, background: "var(--vx-text-primary)", color: "var(--vx-bg-primary)", border: "none", fontWeight: 700, cursor: "pointer" }}
                  >
                    {isSendingOtp ? "Sending..." : "Send Verification Code"}
                  </button>
                </div>
              ) : (
                <div>
                  <h3 style={{ fontSize: 18, fontWeight: 800, marginBottom: 12 }}>Enter Verification Code</h3>
                  <div style={{ display: "flex", justifyContent: "center", gap: 12, marginBottom: 24 }}>
                    <input 
                      type="text" maxLength={6} value={otp} onChange={e => setOtp(e.target.value)}
                      placeholder="000000"
                      style={{ width: "100%", maxWidth: 200, textAlign: "center", fontSize: 24, fontWeight: 800, letterSpacing: 8, background: "var(--vx-bg-input)", border: "1px solid var(--vx-border)", borderRadius: 12, padding: "12px", color: "#38bdf8", outline: "none" }}
                    />
                  </div>
                  <button 
                    onClick={handleVerifyOtp}
                    style={{ padding: "14px 32px", borderRadius: 12, background: "var(--vx-text-primary)", color: "var(--vx-bg-primary)", border: "none", fontWeight: 700, cursor: "pointer" }}
                  >
                    Verify & Continue
                  </button>
                </div>
              )}
            </motion.div>
          )}

          {/* Opaque Verified Message */}
          {isOtpVerified && (
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} style={{ background: "rgba(16, 185, 129, 0.1)", border: "1px solid rgba(16, 185, 129, 0.2)", borderRadius: 20, padding: "20px", display: "flex", alignItems: "center", gap: 16 }}>
              <CheckCircle2 size={24} style={{ color: "#10b981" }} />
              <div>
                <div style={{ fontSize: 14, fontWeight: 700, color: "#10b981" }}>Identity Verified</div>
                <div style={{ fontSize: 12, color: "rgba(16, 185, 129, 0.8)" }}>You are now ready to launch your campaign.</div>
              </div>
            </motion.div>
          )}

          {/* Value Banner */}
          <div style={{ background: "linear-gradient(135deg, rgba(167, 139, 250, 0.1), rgba(56, 189, 248, 0.1))", borderRadius: 24, padding: "32px", border: "1px solid rgba(255,255,255,0.05)", display: "flex", alignItems: "center", gap: 32 }}>
            <div style={{ width: 64, height: 64, borderRadius: 20, background: "rgba(255,255,255,0.05)", display: "flex", alignItems: "center", justifyContent: "center", color: "#38bdf8", flexShrink: 0 }}>
              <Sparkles size={32} />
            </div>
            <div>
              <h4 style={{ fontSize: 16, fontWeight: 800, marginBottom: 4 }}>Vulpinix AI Edge</h4>
              <p style={{ fontSize: 13, color: "var(--vx-text-secondary)", lineHeight: 1.5, margin: 0 }}>By launching today, you're saving estimated <b>₹45,000</b> in traditional agency fees and <b>14 days</b> of manual work.</p>
            </div>
          </div>

          {/* Action Footer */}
          <div style={{ display: "flex", flexDirection: "column", gap: 20, marginTop: 20, textAlign: "center" }}>
            <button 
              onClick={handlePayment}
              disabled={!isOtpVerified || isProcessing}
              style={{ width: "100%", padding: "20px", borderRadius: 20, background: "var(--vx-text-primary)", color: "var(--vx-bg-primary)", border: "none", fontWeight: 800, fontSize: 18, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", gap: 12, opacity: (!isOtpVerified || isProcessing) ? 0.5 : 1, transition: "0.2s" }}
            >
              {isProcessing ? "Launching Campaign..." : "Pay & Launch Now"} <Zap size={20} fill="currentColor" />
            </button>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 8, color: "var(--vx-text-muted)", fontSize: 12, fontWeight: 600 }}>
              <Lock size={14} /> 256-bit SSL Encrypted Payment Gateway
            </div>
          </div>

        </div>

        <footer style={{ marginTop: 80, textAlign: "center", borderTop: "1px solid var(--vx-border)", paddingTop: 40, opacity: 0.5 }}>
          <VulpinixLogo size="sm" />
          <p style={{ color: "var(--vx-text-muted)", fontSize: 11, marginTop: 16, letterSpacing: "0.05em", fontWeight: 700 }}>
            SECURE CHECKOUT — PLATFORM v1.0.4
          </p>
        </footer>
      </div>
    </motion.div>
  );
}
