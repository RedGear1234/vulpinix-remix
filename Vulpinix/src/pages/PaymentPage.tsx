import { useState, useEffect } from "react";
import { useNavigate } from "react-router";
import { motion } from "motion/react";
import {
  ArrowLeft,
  CreditCard,
  Smartphone,
  Building2,
  Wallet,
  Lock,
  CheckCircle2,
  Shield,
  MapPin,
  Users,
  Globe,
  Languages,
  TrendingUp,
  Sparkles,
  ChevronDown,
  Info,
  AlertCircle
} from "lucide-react";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import { toast } from "sonner@2.0.3";

type PaymentMethod = "upi" | "card" | "wallet" | null;

export default function PaymentPage() {
  const navigate = useNavigate();
  const [selectedMethod, setSelectedMethod] = useState<PaymentMethod>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  
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

  // Get user phone from localStorage
  const savedUserInfo = localStorage.getItem("userInfo");
  const userPhone = savedUserInfo ? JSON.parse(savedUserInfo).phone : "+91 98765 43210";

  // Load Campaign data from localStorage
  const [campaignData, setCampaignData] = useState({
    name: "Summer Sale Campaign",
    platforms: ["Instagram", "Facebook", "YouTube"],
    budgetType: "Daily",
    budget: "₹5,000",
    totalAmount: "₹35,000",
    locations: ["Mumbai", "Delhi"],
    audience: ["Business", "Tech"],
    languages: ["English", "Hindi"],
    estimatedReach: "125,000 - 180,000",
    duration: "7 Days"
  });

  useEffect(() => {
    const savedCampaign = localStorage.getItem("campaignData");
    if (savedCampaign) {
      setCampaignData(JSON.parse(savedCampaign));
    }
  }, []);

  // Validation functions
  const validateCardNumber = (number: string): boolean => {
    const cleaned = number.replace(/\s/g, "");
    if (cleaned.length !== 16) {
      toast.error("Card number must be 16 digits");
      return false;
    }
    if (!/^\d+$/.test(cleaned)) {
      toast.error("Card number must contain only digits");
      return false;
    }
    return true;
  };

  const validateExpiryDate = (expiry: string): boolean => {
    if (!/^\d{2}\/\d{2}$/.test(expiry)) {
      toast.error("Expiry date must be in MM/YY format");
      return false;
    }
    const [month, year] = expiry.split("/").map(Number);
    if (month < 1 || month > 12) {
      toast.error("Invalid month in expiry date");
      return false;
    }
    const currentYear = new Date().getFullYear() % 100;
    const currentMonth = new Date().getMonth() + 1;
    if (year < currentYear || (year === currentYear && month < currentMonth)) {
      toast.error("Card has expired");
      return false;
    }
    return true;
  };

  const validateCVV = (cvvValue: string): boolean => {
    if (cvvValue.length < 3 || cvvValue.length > 4) {
      toast.error("CVV must be 3 or 4 digits");
      return false;
    }
    if (!/^\d+$/.test(cvvValue)) {
      toast.error("CVV must contain only digits");
      return false;
    }
    return true;
  };

  const validateCardName = (name: string): boolean => {
    if (name.trim().length < 3) {
      toast.error("Please enter valid cardholder name");
      return false;
    }
    if (!/^[a-zA-Z\s]+$/.test(name)) {
      toast.error("Cardholder name must contain only letters");
      return false;
    }
    return true;
  };

  const validateUPI = (upi: string): boolean => {
    const upiRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9]+$/;
    if (!upiRegex.test(upi)) {
      toast.error("Please enter valid UPI ID (e.g., name@bank)");
      return false;
    }
    return true;
  };

  const handleSendOtp = () => {
    if (!selectedMethod) {
      toast.error("Please select a payment method");
      return;
    }

    // Validate based on payment method
    let isValid = false;
    if (selectedMethod === "card") {
      if (!cardNumber || !cardName || !expiryDate || !cvv) {
        toast.error("Please fill all card details");
        return;
      }
      isValid = validateCardNumber(cardNumber) && 
                validateCardName(cardName) && 
                validateExpiryDate(expiryDate) && 
                validateCVV(cvv);
    } else if (selectedMethod === "upi") {
      if (!upiId) {
        toast.error("Please enter UPI ID");
        return;
      }
      isValid = validateUPI(upiId);
    } else if (selectedMethod === "wallet") {
      isValid = true;
    }

    if (!isValid) {
      return;
    }

    // Generate and send OTP
    setIsSendingOtp(true);
    const newOtp = Math.floor(100000 + Math.random() * 900000).toString();
    
    setTimeout(() => {
      setGeneratedOtp(newOtp);
      setShowOtpInput(true);
      setIsSendingOtp(false);
      toast.success("OTP Sent Successfully!", {
        description: `OTP sent to ${userPhone}. For demo, use: ${newOtp}`,
        duration: 10000,
      });
    }, 1500);
  };

  const handleVerifyOtp = () => {
    if (!otp) {
      toast.error("Please enter OTP");
      return;
    }
    if (otp.length !== 6) {
      toast.error("OTP must be 6 digits");
      return;
    }
    if (otp !== generatedOtp) {
      toast.error("Invalid OTP. Please try again.");
      return;
    }

    setIsOtpVerified(true);
    toast.success("OTP Verified Successfully!", {
      description: "You can now proceed with the payment.",
    });
  };

  const handlePayment = async () => {
    if (!isOtpVerified) {
      toast.error("Please verify OTP first");
      return;
    }

    setIsProcessing(true);
    
    // Simulate payment processing
    setTimeout(() => {
      setIsProcessing(false);
      
      // Save campaign to localStorage as "in review"
      const newCampaign = {
        id: Date.now().toString(),
        name: campaignData.name,
        platforms: campaignData.platforms,
        budget: campaignData.budget,
        status: "review",
        createdAt: new Date().toISOString().split('T')[0],
        paymentMethod: selectedMethod,
      };

      // Get existing campaigns
      const existingCampaigns = localStorage.getItem("userCampaigns");
      const campaigns = existingCampaigns ? JSON.parse(existingCampaigns) : { inReview: [], history: [] };
      
      // Add to in-review campaigns
      campaigns.inReview.push(newCampaign);
      
      // Save back to localStorage
      localStorage.setItem("userCampaigns", JSON.stringify(campaigns));
      
      toast.success("Congratulations! Payment Successful 🎉", {
        description: "Your payment has been done successfully and your ad is in review. Please wait for 12 hours for approval.",
        duration: 6000,
      });
      
      // Navigate to profile to see the campaign
      setTimeout(() => {
        navigate('/profile');
      }, 2000);
    }, 2000);
  };

  const formatCardNumber = (value: string) => {
    const v = value.replace(/\s+/g, "").replace(/[^0-9]/gi, "");
    const matches = v.match(/\d{4,16}/g);
    const match = (matches && matches[0]) || "";
    const parts = [];

    for (let i = 0, len = match.length; i < len; i += 4) {
      parts.push(match.substring(i, i + 4));
    }

    if (parts.length) {
      return parts.join(" ");
    } else {
      return value;
    }
  };

  const formatExpiryDate = (value: string) => {
    const v = value.replace(/\s+/g, "").replace(/[^0-9]/gi, "");
    if (v.length >= 2) {
      return v.slice(0, 2) + "/" + v.slice(2, 4);
    }
    return v;
  };

  return (
    <motion.div
      initial={{ opacity: 0, x: 100 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -100 }}
      transition={{ duration: 0.5, ease: "easeInOut" }}
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
            <pattern id="circuit-payment" x="0" y="0" width="100" height="100" patternUnits="userSpaceOnUse">
              <circle cx="50" cy="50" r="2" fill="#00ffff" />
              <line x1="50" y1="50" x2="100" y2="50" stroke="#00ffff" strokeWidth="0.5" />
              <line x1="50" y1="50" x2="50" y2="0" stroke="#00ffff" strokeWidth="0.5" />
              <circle cx="0" cy="50" r="2" fill="#a855f7" />
              <circle cx="50" cy="0" r="2" fill="#3b82f6" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#circuit-payment)" />
        </svg>
      </div>

      {/* Content */}
      <div className="relative z-10 min-h-screen px-4 sm:px-6 lg:px-8 py-8">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="mb-8">
            <Button
              variant="ghost"
              onClick={() => navigate("/ad-preview")}
              className="text-cyan-400 hover:text-cyan-300 hover:bg-cyan-500/10 mb-4"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Campaign Preview
            </Button>

            <h1 className="text-4xl sm:text-5xl text-white mb-2 bg-gradient-to-r from-purple-400 via-cyan-400 to-blue-400 bg-clip-text text-transparent">
              Complete Your Campaign Payment
            </h1>
            <p className="text-xl text-gray-400">
              Secure payment to activate your AI-powered ad campaign
            </p>
          </div>

          {/* Two Column Layout */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* LEFT COLUMN - Campaign Summary */}
            <div className="lg:col-span-1">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="sticky top-8 p-6 rounded-2xl bg-gradient-to-br from-gray-900/90 via-purple-900/20 to-cyan-900/20 border-2 border-purple-500/30 backdrop-blur-sm shadow-2xl shadow-purple-500/20"
              >
                <div className="flex items-center gap-2 mb-6">
                  <Sparkles className="w-6 h-6 text-cyan-400" />
                  <h3 className="text-xl text-white font-semibold">Campaign Summary</h3>
                </div>

                <div className="space-y-4">
                  {/* Campaign Name */}
                  <div className="p-4 rounded-xl bg-gray-900/50 border border-purple-500/20">
                    <p className="text-xs text-gray-400 mb-1">Campaign Name</p>
                    <p className="text-white font-semibold">{campaignData.name}</p>
                  </div>

                  {/* Selected Platforms */}
                  <div className="p-4 rounded-xl bg-gray-900/50 border border-cyan-500/20">
                    <p className="text-xs text-gray-400 mb-2">Selected Platforms</p>
                    <div className="flex flex-wrap gap-2">
                      {campaignData.platforms.map((platform) => (
                        <span
                          key={platform}
                          className="px-3 py-1 rounded-full bg-gradient-to-r from-purple-600 to-cyan-600 text-white text-xs"
                        >
                          {platform}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Campaign Budget */}
                  <div className="p-4 rounded-xl bg-gray-900/50 border border-purple-500/20">
                    <p className="text-xs text-gray-400 mb-1">
                      Campaign Budget ({campaignData.budgetType})
                    </p>
                    <p className="text-2xl text-white font-bold">{campaignData.budget}</p>
                  </div>

                  {/* Duration */}
                  <div className="p-4 rounded-xl bg-gray-900/50 border border-cyan-500/20">
                    <p className="text-xs text-gray-400 mb-1">Campaign Duration</p>
                    <p className="text-white font-semibold">{campaignData.duration}</p>
                  </div>

                  {/* Target Locations */}
                  <div className="p-4 rounded-xl bg-gray-900/50 border border-purple-500/20">
                    <p className="text-xs text-gray-400 mb-2 flex items-center gap-1">
                      <MapPin className="w-3 h-3" />
                      Target Location
                    </p>
                    <div className="flex flex-wrap gap-2">
                      {campaignData.locations.map((location) => (
                        <span
                          key={location}
                          className="px-3 py-1 rounded-full bg-purple-500/20 text-purple-300 text-xs"
                        >
                          {location}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Audience Category */}
                  <div className="p-4 rounded-xl bg-gray-900/50 border border-cyan-500/20">
                    <p className="text-xs text-gray-400 mb-2 flex items-center gap-1">
                      <Users className="w-3 h-3" />
                      Audience Category
                    </p>
                    <div className="flex flex-wrap gap-2">
                      {campaignData.audience.map((aud) => (
                        <span
                          key={aud}
                          className="px-3 py-1 rounded-full bg-cyan-500/20 text-cyan-300 text-xs"
                        >
                          {aud}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Selected Languages */}
                  <div className="p-4 rounded-xl bg-gray-900/50 border border-purple-500/20">
                    <p className="text-xs text-gray-400 mb-2 flex items-center gap-1">
                      <Languages className="w-3 h-3" />
                      Selected Languages
                    </p>
                    <div className="flex flex-wrap gap-2">
                      {campaignData.languages.map((lang) => (
                        <span
                          key={lang}
                          className="px-3 py-1 rounded-full bg-purple-500/20 text-purple-300 text-xs"
                        >
                          {lang}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Estimated Reach */}
                  <div className="p-4 rounded-xl bg-gradient-to-br from-purple-500/20 to-cyan-500/20 border border-cyan-400/50">
                    <p className="text-xs text-gray-400 mb-2 flex items-center gap-1">
                      <TrendingUp className="w-3 h-3" />
                      Estimated Reach
                    </p>
                    <p className="text-lg text-cyan-400 font-bold">{campaignData.estimatedReach}</p>
                  </div>

                  {/* Status Badge */}
                  <div className="p-4 rounded-xl bg-gradient-to-r from-green-500/20 to-emerald-500/20 border-2 border-green-400/50 shadow-lg shadow-green-500/30">
                    <div className="flex items-center justify-center gap-2">
                      <CheckCircle2 className="w-5 h-5 text-green-400 animate-pulse" />
                      <span className="text-green-400 font-semibold">Ready to Launch</span>
                    </div>
                  </div>
                </div>
              </motion.div>
            </div>

            {/* RIGHT COLUMN - Payment Methods */}
            <div className="lg:col-span-2 space-y-6">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
              >
                <h2 className="text-2xl text-white mb-6 flex items-center gap-2">
                  <CreditCard className="w-6 h-6 text-cyan-400" />
                  Choose Your Payment Method
                </h2>

                {/* Payment Method Cards */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                  {/* UPI Payment */}
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => setSelectedMethod("upi")}
                    className={`p-6 rounded-2xl border-2 transition-all text-left ${
                      selectedMethod === "upi"
                        ? "bg-gradient-to-br from-purple-500/20 to-cyan-500/20 border-cyan-400/50 shadow-lg shadow-cyan-500/30"
                        : "bg-gray-900/50 border-purple-500/30 hover:border-purple-400/50"
                    }`}
                  >
                    <div className="flex items-center gap-3 mb-3">
                      <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${
                        selectedMethod === "upi"
                          ? "bg-gradient-to-r from-purple-600 to-cyan-600"
                          : "bg-gray-800"
                      }`}>
                        <Smartphone className="w-6 h-6 text-white" />
                      </div>
                      <div>
                        <h3 className="text-white font-semibold">UPI Payments</h3>
                        <p className="text-xs text-gray-400">Instant UPI payment</p>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <div className="px-2 py-1 rounded bg-gray-800/50 text-xs text-gray-300">GPay</div>
                      <div className="px-2 py-1 rounded bg-gray-800/50 text-xs text-gray-300">PhonePe</div>
                      <div className="px-2 py-1 rounded bg-gray-800/50 text-xs text-gray-300">Paytm</div>
                      <div className="px-2 py-1 rounded bg-gray-800/50 text-xs text-gray-300">BHIM</div>
                    </div>
                  </motion.button>

                  {/* Card Payment */}
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => setSelectedMethod("card")}
                    className={`p-6 rounded-2xl border-2 transition-all text-left ${
                      selectedMethod === "card"
                        ? "bg-gradient-to-br from-purple-500/20 to-cyan-500/20 border-cyan-400/50 shadow-lg shadow-cyan-500/30"
                        : "bg-gray-900/50 border-purple-500/30 hover:border-purple-400/50"
                    }`}
                  >
                    <div className="flex items-center gap-3 mb-3">
                      <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${
                        selectedMethod === "card"
                          ? "bg-gradient-to-r from-purple-600 to-cyan-600"
                          : "bg-gray-800"
                      }`}>
                        <CreditCard className="w-6 h-6 text-white" />
                      </div>
                      <div>
                        <h3 className="text-white font-semibold">Card Payments</h3>
                        <p className="text-xs text-gray-400">Credit / Debit Card</p>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <div className="px-2 py-1 rounded bg-gray-800/50 text-xs text-gray-300">Visa</div>
                      <div className="px-2 py-1 rounded bg-gray-800/50 text-xs text-gray-300">MasterCard</div>
                      <div className="px-2 py-1 rounded bg-gray-800/50 text-xs text-gray-300">RuPay</div>
                    </div>
                  </motion.button>

                  {/* Wallets */}
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => setSelectedMethod("wallet")}
                    className={`p-6 rounded-2xl border-2 transition-all text-left relative overflow-hidden ${
                      selectedMethod === "wallet"
                        ? "bg-gradient-to-br from-purple-500/20 to-cyan-500/20 border-cyan-400/50 shadow-lg shadow-cyan-500/30"
                        : "bg-gray-900/50 border-purple-500/30 hover:border-purple-400/50"
                    }`}
                  >
                    <div className="absolute top-2 right-2 px-2 py-1 rounded-full bg-yellow-500/20 border border-yellow-400/50">
                      <span className="text-xs text-yellow-400">Coming Soon</span>
                    </div>
                    <div className="flex items-center gap-3 mb-3">
                      <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${
                        selectedMethod === "wallet"
                          ? "bg-gradient-to-r from-purple-600 to-cyan-600"
                          : "bg-gray-800"
                      }`}>
                        <Wallet className="w-6 h-6 text-white" />
                      </div>
                      <div>
                        <h3 className="text-white font-semibold">Digital Wallets</h3>
                        <p className="text-xs text-gray-400">Quick wallet payments</p>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <div className="px-2 py-1 rounded bg-gray-800/50 text-xs text-gray-300">Paytm</div>
                      <div className="px-2 py-1 rounded bg-gray-800/50 text-xs text-gray-300">PhonePe</div>
                    </div>
                  </motion.button>
                </div>

                {/* Payment Details Form */}
                {selectedMethod && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    className="p-6 rounded-2xl bg-gradient-to-br from-gray-900/90 via-purple-900/20 to-cyan-900/20 border-2 border-purple-500/30 backdrop-blur-sm"
                  >
                    {selectedMethod === "upi" && (
                      <div className="space-y-4">
                        <h3 className="text-lg text-white font-semibold mb-4">Enter UPI Details</h3>
                        <div>
                          <Label htmlFor="upi" className="text-gray-300">UPI ID</Label>
                          <Input
                            id="upi"
                            placeholder="yourname@upi"
                            value={upiId}
                            onChange={(e) => setUpiId(e.target.value)}
                            className="mt-2 bg-gray-900/50 border-purple-500/30 text-white focus:border-cyan-400/50"
                          />
                        </div>
                        <div className="flex items-start gap-2 p-3 rounded-lg bg-cyan-500/10 border border-cyan-400/30">
                          <Info className="w-4 h-4 text-cyan-400 flex-shrink-0 mt-0.5" />
                          <p className="text-xs text-gray-300">
                            You will be redirected to your UPI app to complete the payment
                          </p>
                        </div>
                      </div>
                    )}

                    {selectedMethod === "card" && (
                      <div className="space-y-4">
                        <h3 className="text-lg text-white font-semibold mb-4">Enter Card Details</h3>
                        <div>
                          <Label htmlFor="cardNumber" className="text-gray-300">Card Number</Label>
                          <Input
                            id="cardNumber"
                            placeholder="1234 5678 9012 3456"
                            value={cardNumber}
                            onChange={(e) => setCardNumber(formatCardNumber(e.target.value))}
                            maxLength={19}
                            className="mt-2 bg-gray-900/50 border-purple-500/30 text-white focus:border-cyan-400/50"
                          />
                        </div>
                        <div>
                          <Label htmlFor="cardName" className="text-gray-300">Cardholder Name</Label>
                          <Input
                            id="cardName"
                            placeholder="John Doe"
                            value={cardName}
                            onChange={(e) => setCardName(e.target.value.toUpperCase())}
                            className="mt-2 bg-gray-900/50 border-purple-500/30 text-white focus:border-cyan-400/50"
                          />
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <Label htmlFor="expiry" className="text-gray-300">Expiry Date</Label>
                            <Input
                              id="expiry"
                              placeholder="MM/YY"
                              value={expiryDate}
                              onChange={(e) => setExpiryDate(formatExpiryDate(e.target.value))}
                              maxLength={5}
                              className="mt-2 bg-gray-900/50 border-purple-500/30 text-white focus:border-cyan-400/50"
                            />
                          </div>
                          <div>
                            <Label htmlFor="cvv" className="text-gray-300">CVV</Label>
                            <Input
                              id="cvv"
                              placeholder="123"
                              type="password"
                              value={cvv}
                              onChange={(e) => setCvv(e.target.value.replace(/\D/g, ""))}
                              maxLength={3}
                              className="mt-2 bg-gray-900/50 border-purple-500/30 text-white focus:border-cyan-400/50"
                            />
                          </div>
                        </div>
                      </div>
                    )}

                    {selectedMethod === "wallet" && (
                      <div className="space-y-4">
                        <div className="flex items-center justify-center py-8">
                          <div className="text-center">
                            <Wallet className="w-16 h-16 text-gray-500 mx-auto mb-4" />
                            <p className="text-gray-400">Wallet payments coming soon!</p>
                            <p className="text-sm text-gray-500 mt-2">Please select another payment method</p>
                          </div>
                        </div>
                      </div>
                    )}
                  </motion.div>
                )}

                {/* Security & Trust */}
                <div className="mt-6 p-4 rounded-2xl bg-gradient-to-r from-green-500/10 to-emerald-500/10 border-2 border-green-400/30 backdrop-blur-sm">
                  <div className="flex items-center gap-3 mb-2">
                    <div className="w-10 h-10 rounded-full bg-green-500/20 flex items-center justify-center shadow-lg shadow-green-500/30">
                      <Lock className="w-5 h-5 text-green-400" />
                    </div>
                    <div>
                      <h4 className="text-white font-semibold flex items-center gap-2">
                        100% Secure & Encrypted Payments
                        <Shield className="w-4 h-4 text-green-400" />
                      </h4>
                      <p className="text-xs text-gray-400">Powered by trusted payment gateway</p>
                    </div>
                  </div>
                </div>

                {/* OTP Verification Section */}
                {selectedMethod && selectedMethod !== "wallet" && (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mt-6 p-6 rounded-2xl bg-gradient-to-br from-gray-900/90 via-orange-900/10 to-yellow-900/10 border-2 border-orange-500/30 backdrop-blur-sm"
                  >
                    <div className="flex items-center gap-2 mb-4">
                      <Smartphone className="w-5 h-5 text-orange-400" />
                      <h3 className="text-lg text-white font-semibold">
                        {selectedMethod === "upi" ? "UPI Verification" : "Mobile Verification"}
                      </h3>
                    </div>

                    {!showOtpInput ? (
                      <div className="space-y-4">
                        <div className="flex items-start gap-2 p-3 rounded-lg bg-orange-500/10 border border-orange-400/30">
                          <Info className="w-4 h-4 text-orange-400 flex-shrink-0 mt-0.5" />
                          <p className="text-sm text-gray-300">
                            {selectedMethod === "upi" ? (
                              <>
                                For security, we'll send an OTP to your UPI linked number: <span className="text-orange-400 font-semibold">{upiId || "your-upi@bank"}</span>
                              </>
                            ) : (
                              <>
                                For security, we'll send an OTP to your registered mobile number: <span className="text-orange-400 font-semibold">{userPhone}</span>
                              </>
                            )}
                          </p>
                        </div>
                        <Button
                          onClick={handleSendOtp}
                          disabled={isSendingOtp}
                          className="w-full bg-gradient-to-r from-orange-600 to-yellow-600 hover:from-orange-700 hover:to-yellow-700 text-white rounded-xl shadow-lg shadow-orange-500/50 transition-all hover:scale-105 disabled:opacity-50"
                        >
                          {isSendingOtp ? (
                            <div className="flex items-center gap-2">
                              <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                              Sending OTP...
                            </div>
                          ) : (
                            <>
                              <Smartphone className="w-5 h-5 mr-2" />
                              {selectedMethod === "upi" 
                                ? `Send OTP to ${upiId || "UPI"}` 
                                : `Send OTP to ${userPhone}`
                              }
                            </>
                          )}
                        </Button>
                      </div>
                    ) : (
                      <div className="space-y-4">
                        {!isOtpVerified ? (
                          <>
                            <div className="flex items-start gap-2 p-3 rounded-lg bg-cyan-500/10 border border-cyan-400/30">
                              <CheckCircle2 className="w-4 h-4 text-cyan-400 flex-shrink-0 mt-0.5" />
                              <p className="text-sm text-gray-300">
                                {selectedMethod === "upi" ? (
                                  <>
                                    OTP sent successfully to UPI linked number for <span className="text-cyan-400 font-semibold">{upiId}</span>
                                  </>
                                ) : (
                                  <>
                                    OTP sent successfully to <span className="text-cyan-400 font-semibold">{userPhone}</span>
                                  </>
                                )}
                              </p>
                            </div>
                            <div>
                              <Label htmlFor="otp" className="text-gray-300">Enter 6-Digit OTP</Label>
                              <Input
                                id="otp"
                                placeholder="000000"
                                value={otp}
                                onChange={(e) => setOtp(e.target.value.replace(/\D/g, ""))}
                                maxLength={6}
                                className="mt-2 bg-gray-900/50 border-purple-500/30 text-white text-center text-2xl tracking-widest focus:border-cyan-400/50"
                              />
                            </div>
                            <div className="flex gap-3">
                              <Button
                                onClick={handleVerifyOtp}
                                className="flex-1 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white rounded-xl shadow-lg shadow-green-500/50 transition-all hover:scale-105"
                              >
                                <CheckCircle2 className="w-5 h-5 mr-2" />
                                Verify OTP
                              </Button>
                              <Button
                                onClick={handleSendOtp}
                                variant="outline"
                                className="border-orange-500/50 text-orange-400 hover:bg-orange-500/10 rounded-xl"
                              >
                                Resend OTP
                              </Button>
                            </div>
                          </>
                        ) : (
                          <div className="p-4 rounded-xl bg-gradient-to-r from-green-500/20 to-emerald-500/20 border-2 border-green-400/50">
                            <div className="flex items-center gap-3">
                              <div className="w-10 h-10 rounded-full bg-green-500/30 flex items-center justify-center">
                                <CheckCircle2 className="w-6 h-6 text-green-400 animate-pulse" />
                              </div>
                              <div>
                                <p className="text-white font-semibold">OTP Verified Successfully!</p>
                                <p className="text-sm text-gray-300">You can now proceed with the payment</p>
                              </div>
                            </div>
                          </div>
                        )}
                      </div>
                    )}
                  </motion.div>
                )}

                {/* Total Amount Summary */}
                <div className="mt-6 p-6 rounded-2xl bg-gradient-to-br from-purple-500/10 to-cyan-500/10 border-2 border-purple-500/30 backdrop-blur-sm">
                  <div className="flex justify-between items-center mb-4">
                    <span className="text-gray-400">Campaign Budget</span>
                    <span className="text-white font-semibold">{campaignData.budget}</span>
                  </div>
                  <div className="flex justify-between items-center mb-4">
                    <span className="text-gray-400">Duration</span>
                    <span className="text-white font-semibold">{campaignData.duration}</span>
                  </div>
                  <div className="border-t border-gray-700/50 pt-4 mt-4">
                    <div className="flex justify-between items-center">
                      <span className="text-xl text-white font-semibold">Total Amount</span>
                      <span className="text-3xl text-transparent bg-gradient-to-r from-purple-400 to-cyan-400 bg-clip-text font-bold">
                        {campaignData.totalAmount}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Call to Action */}
                <Button
                  onClick={handlePayment}
                  disabled={!selectedMethod || selectedMethod === "wallet" || isProcessing}
                  size="lg"
                  className="w-full mt-6 px-12 py-6 bg-gradient-to-r from-purple-600 via-cyan-600 to-blue-600 hover:from-purple-700 hover:via-cyan-700 hover:to-blue-700 text-white rounded-xl shadow-lg shadow-cyan-500/50 hover:shadow-cyan-500/70 transition-all duration-300 hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
                >
                  {isProcessing ? (
                    <div className="flex items-center gap-2">
                      <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                      Processing Payment...
                    </div>
                  ) : (
                    <>
                      <Lock className="w-5 h-5 mr-2" />
                      Pay & Launch Campaign
                    </>
                  )}
                </Button>

                {/* Footer Note */}
                <p className="text-center text-sm text-gray-400 mt-4">
                  Your campaign will go live immediately after successful payment.
                </p>
              </motion.div>
            </div>
          </div>
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