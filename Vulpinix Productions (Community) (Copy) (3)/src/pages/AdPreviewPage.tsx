import { useState, useEffect } from "react";
import { useNavigate } from "react-router";
import { motion } from "motion/react";
import {
  ArrowLeft,
  Sparkles, 
  Edit2,
  Play,
  Instagram,
  Facebook,
  Youtube,
  ChevronDown,
  Target,
  DollarSign,
  Globe,
  Users,
  Languages,
  AlertCircle,
  TrendingUp,
  Eye,
  MousePointer,
  Zap,
  Save,
  CheckCircle2,
  Smartphone,
  Monitor,
  Tablet,
  MapPin,
  CreditCard
} from "lucide-react";
import { Button } from "../components/ui/button";
import { Slider } from "../components/ui/slider";
import { toast } from "sonner@2.0.3";

type Platform = "instagram-feed" | "instagram-story" | "facebook-feed" | "youtube";
type Gender = "all" | "male" | "female" | "custom";

interface DeviceOption {
  id: string;
  name: string;
  icon: any;
  selected: boolean;
}

interface InterestOption {
  id: string;
  name: string;
  icon: string;
  selected: boolean;
}

export default function AdPreviewPage() {
  const navigate = useNavigate();
  
  // Platform Selection
  const [selectedPlatform, setSelectedPlatform] = useState<Platform>("instagram-feed");
  
  // Load preview image from localStorage
  const [previewImage, setPreviewImage] = useState<string | null>(null);

  useEffect(() => {
    const savedImage = localStorage.getItem("adPreviewImage");
    if (savedImage) {
      setPreviewImage(savedImage);
    }
  }, []);
  
  // Load Ad Creative Data (caption, hashtags) from localStorage
  const [adCreative, setAdCreative] = useState({
    caption: "Discover the future of digital marketing with AI-powered automation. Transform your content strategy today! 🚀",
    hashtags: ["#DigitalMarketing", "#AIAutomation", "#VulpinixAI", "#MarketingTech", "#FutureOfWork"],
    cta: "Learn More"
  });

  useEffect(() => {
    const savedCreative = localStorage.getItem("adCreativeData");
    if (savedCreative) {
      const data = JSON.parse(savedCreative);
      setAdCreative({
        caption: data.caption || adCreative.caption,
        hashtags: data.hashtags || adCreative.hashtags,
        cta: "Learn More"
      });
    }
  }, []);
  
  // Load Campaign Data from localStorage
  const [campaignData, setCampaignData] = useState({
    name: "Summer Sale Campaign",
    objective: "Brand Awareness",
    platforms: ["Instagram", "Facebook", "YouTube"],
    budgetType: "Daily",
    budget: "₹5,000",
    locations: ["Mumbai", "Delhi"],
    audience: ["Business", "Tech"],
    languages: ["English", "Hindi"]
  });

  useEffect(() => {
    const savedCampaign = localStorage.getItem("campaignData");
    if (savedCampaign) {
      setCampaignData(JSON.parse(savedCampaign));
    }
  }, []);
  
  // Advanced Targeting
  const [ageRange, setAgeRange] = useState([18, 45]);
  const [gender, setGender] = useState<Gender>("all");
  
  const [interests, setInterests] = useState<InterestOption[]>([
    { id: "gaming", name: "Gaming", icon: "🎮", selected: false },
    { id: "travel", name: "Travel", icon: "✈️", selected: true },
    { id: "startups", name: "Startups", icon: "🚀", selected: true },
    { id: "technology", name: "Technology", icon: "💻", selected: true },
    { id: "shopping", name: "Shopping", icon: "🛍️", selected: false },
  ]);

  const [devices, setDevices] = useState<DeviceOption[]>([
    { id: "mobile", name: "Mobile", icon: Smartphone, selected: true },
    { id: "desktop", name: "Desktop", icon: Monitor, selected: true },
    { id: "tablet", name: "Tablet", icon: Tablet, selected: false },
  ]);

  const toggleInterest = (id: string) => {
    setInterests(interests.map(i => i.id === id ? { ...i, selected: !i.selected } : i));
  };

  const toggleDevice = (id: string) => {
    setDevices(devices.map(d => d.id === id ? { ...d, selected: !d.selected } : d));
  };

  // AI Predictions
  const aiPredictions = {
    estimatedReach: "125,000 - 180,000",
    clickThroughRate: "3.2% - 4.8%",
    costPerClick: "₹12 - ₹18",
    performanceScore: "High"
  };

  // Warnings
  const warnings = [
    { id: 1, message: "Consider increasing budget for maximum reach in selected locations", severity: "info" }
  ];

  const handleLaunchCampaign = () => {
    toast.success("Campaign Launched Successfully!", {
      description: "Your ad campaign is now live and reaching your target audience.",
    });
  };

  const handleSaveDraft = () => {
    toast.success("Campaign Saved as Draft", {
      description: "You can continue editing anytime from your dashboard.",
    });
  };

  const handleProceedToPayment = () => {
    // Navigate to payment page - you can create this later
    toast.success("Proceeding to Payment", {
      description: "Redirecting to secure payment gateway...",
    });
    navigate('/payment');
  };

  const renderAdPreview = () => {
    switch (selectedPlatform) {
      case "instagram-feed":
        return (
          <div className="bg-gray-900/80 rounded-2xl overflow-hidden border-2 border-purple-500/30">
            {/* Instagram Header */}
            <div className="flex items-center gap-3 p-4 border-b border-gray-700/50">
              <div className="w-10 h-10 rounded-full bg-gradient-to-r from-purple-600 to-cyan-600"></div>
              <div>
                <p className="text-white font-semibold">vulpinix.ai</p>
                <p className="text-xs text-gray-400">Sponsored</p>
              </div>
            </div>
            {/* Image */}
            <div className="aspect-square bg-gradient-to-br from-purple-600 via-cyan-600 to-blue-600 flex items-center justify-center overflow-hidden">
              {previewImage ? (
                <img src={previewImage} alt="Ad Preview" className="w-full h-full object-cover" />
              ) : (
                <div className="text-center text-white p-8">
                  <Sparkles className="w-16 h-16 mx-auto mb-4" />
                  <h3 className="text-2xl font-bold mb-2">Your Ad Image</h3>
                  <p className="text-sm opacity-80">Upload content to see preview</p>
                </div>
              )}
            </div>
            {/* Engagement Bar */}
            <div className="p-4 space-y-3 border-b border-gray-700/50">
              <div className="flex gap-4 text-white">
                <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                  <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
                <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                  <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
                <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                  <path d="M22 2L11 13M22 2l-7 20-4-9-9-4 20-7z" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </div>
              <p className="text-white text-sm">
                <span className="font-semibold">vulpinix.ai</span> {adCreative.caption}
              </p>
              <p className="text-cyan-400 text-sm">{adCreative.hashtags.join(" ")}</p>
            </div>
            {/* CTA Button */}
            <div className="p-4">
              <button className="w-full py-2 bg-gradient-to-r from-purple-600 to-cyan-600 text-white rounded-lg font-semibold">
                {adCreative.cta}
              </button>
            </div>
          </div>
        );

      case "instagram-story":
        return (
          <div className="aspect-[9/16] max-h-[600px] bg-gray-900/80 rounded-3xl overflow-hidden border-2 border-purple-500/30">
            <div className="h-full bg-gradient-to-br from-purple-600 via-cyan-600 to-blue-600 flex flex-col justify-between p-6">
              {/* Story Header */}
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-white/20 backdrop-blur-sm"></div>
                <p className="text-white font-semibold">vulpinix.ai</p>
              </div>
              {/* Story Content */}
              <div className="text-center text-white">
                <Sparkles className="w-16 h-16 mx-auto mb-4" />
                <h3 className="text-2xl font-bold mb-2">Story Ad</h3>
                <p className="text-sm opacity-90">{adCreative.caption.substring(0, 80)}...</p>
              </div>
              {/* Story CTA */}
              <button className="w-full py-3 bg-white/90 text-gray-900 rounded-full font-semibold">
                {adCreative.cta}
              </button>
            </div>
          </div>
        );

      case "facebook-feed":
        return (
          <div className="bg-gray-900/80 rounded-2xl overflow-hidden border-2 border-cyan-500/30">
            {/* Facebook Header */}
            <div className="flex items-center justify-between p-4 border-b border-gray-700/50">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-gradient-to-r from-purple-600 to-cyan-600"></div>
                <div>
                  <p className="text-white font-semibold">Vulpinix AI</p>
                  <p className="text-xs text-gray-400">Sponsored · 🌍</p>
                </div>
              </div>
            </div>
            {/* Post Text */}
            <div className="p-4 border-b border-gray-700/50">
              <p className="text-white text-sm mb-2">{adCreative.caption}</p>
              <p className="text-cyan-400 text-sm">{adCreative.hashtags.join(" ")}</p>
            </div>
            {/* Image */}
            <div className="aspect-video bg-gradient-to-br from-purple-600 via-cyan-600 to-blue-600 flex items-center justify-center overflow-hidden">
              {previewImage ? (
                <img src={previewImage} alt="Ad Preview" className="w-full h-full object-cover" />
              ) : (
                <div className="text-center text-white p-8">
                  <Sparkles className="w-16 h-16 mx-auto mb-4" />
                  <h3 className="text-2xl font-bold mb-2">Your Ad Image</h3>
                  <p className="text-sm opacity-80">Upload content to see preview</p>
                </div>
              )}
            </div>
            {/* Engagement */}
            <div className="p-4 border-b border-gray-700/50">
              <div className="flex justify-between text-sm text-gray-400 mb-3">
                <span>👍 ❤️ 234</span>
                <span>45 Comments · 12 Shares</span>
              </div>
              <button className="w-full py-2 bg-gradient-to-r from-purple-600 to-cyan-600 text-white rounded-lg font-semibold">
                {adCreative.cta}
              </button>
            </div>
          </div>
        );

      case "youtube":
        return (
          <div className="bg-gray-900/80 rounded-2xl overflow-hidden border-2 border-purple-500/30">
            {/* Video Thumbnail */}
            <div className="aspect-video bg-gradient-to-br from-purple-600 via-cyan-600 to-blue-600 flex items-center justify-center relative overflow-hidden">
              {previewImage ? (
                <>
                  <img src={previewImage} alt="Ad Preview" className="w-full h-full object-cover" />
                  <div className="absolute inset-0 flex items-center justify-center bg-black/20">
                    <Play className="w-20 h-20 text-white bg-black/50 rounded-full p-4" />
                  </div>
                </>
              ) : (
                <div className="text-center text-white p-8">
                  <Play className="w-20 h-20 mx-auto mb-4 bg-black/30 rounded-full p-4" />
                  <h3 className="text-2xl font-bold mb-2">Video Ad Preview</h3>
                </div>
              )}
              <div className="absolute bottom-4 right-4 px-2 py-1 bg-black/80 rounded text-white text-xs">
                0:15
              </div>
            </div>
            {/* Video Info */}
            <div className="p-4">
              <div className="flex gap-3">
                <div className="w-10 h-10 rounded-full bg-gradient-to-r from-purple-600 to-cyan-600 flex-shrink-0"></div>
                <div className="flex-1">
                  <p className="text-white font-semibold mb-1">
                    {adCreative.caption.substring(0, 60)}...
                  </p>
                  <p className="text-xs text-gray-400 mb-3">vulpinix.ai · Ad · 1.2K views</p>
                  <button className="px-6 py-2 bg-gradient-to-r from-purple-600 to-cyan-600 text-white rounded-full text-sm font-semibold">
                    {adCreative.cta}
                  </button>
                </div>
              </div>
            </div>
          </div>
        );
    }
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
            <pattern id="circuit-preview" x="0" y="0" width="100" height="100" patternUnits="userSpaceOnUse">
              <circle cx="50" cy="50" r="2" fill="#00ffff" />
              <line x1="50" y1="50" x2="100" y2="50" stroke="#00ffff" strokeWidth="0.5" />
              <line x1="50" y1="50" x2="50" y2="0" stroke="#00ffff" strokeWidth="0.5" />
              <circle cx="0" cy="50" r="2" fill="#a855f7" />
              <circle cx="50" cy="0" r="2" fill="#3b82f6" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#circuit-preview)" />
        </svg>
      </div>

      {/* Content */}
      <div className="relative z-10 min-h-screen px-4 sm:px-6 lg:px-8 py-8">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="mb-8">
            <Button
              variant="ghost"
              onClick={() => navigate("/create-ad")}
              className="text-cyan-400 hover:text-cyan-300 hover:bg-cyan-500/10 mb-4"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Campaign Setup
            </Button>

            <h1 className="text-4xl sm:text-5xl text-white mb-2 bg-gradient-to-r from-purple-400 via-cyan-400 to-blue-400 bg-clip-text text-transparent">
              Ad Preview & Final Targeting
            </h1>
            <p className="text-xl text-gray-400">
              Review your campaign details before launching.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Left Column - Ad Creative Preview */}
            <div className="lg:col-span-2 space-y-8">
              {/* SECTION 1 - Ad Creative Preview */}
              <div className="p-8 rounded-2xl bg-gradient-to-br from-purple-500/10 via-transparent to-cyan-500/10 border-2 border-purple-500/30 backdrop-blur-sm shadow-2xl shadow-purple-500/20">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-2xl text-white flex items-center gap-2">
                    <Eye className="w-6 h-6 text-purple-400" />
                    Ad Creative Preview
                  </h3>
                  <Button
                    variant="outline"
                    onClick={() => navigate("/upload")}
                    className="border-purple-500/50 text-purple-400 hover:bg-purple-500/10"
                  >
                    <Edit2 className="w-4 h-4 mr-2" />
                    Edit Creative
                  </Button>
                </div>

                {/* Platform Selector */}
                <div className="mb-6">
                  <label className="block text-sm text-gray-400 mb-2">Select Platform Preview</label>
                  <div className="relative">
                    <select
                      value={selectedPlatform}
                      onChange={(e) => setSelectedPlatform(e.target.value as Platform)}
                      className="w-full px-4 py-3 rounded-xl bg-gray-900/50 border-2 border-purple-500/30 text-white focus:border-cyan-400/50 focus:outline-none appearance-none cursor-pointer"
                    >
                      <option value="instagram-feed">Instagram Feed</option>
                      <option value="instagram-story">Instagram Story</option>
                      <option value="facebook-feed">Facebook Feed</option>
                      <option value="youtube">YouTube</option>
                    </select>
                    <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none" />
                  </div>
                </div>

                {/* Preview Container */}
                <div className="flex justify-center">
                  {renderAdPreview()}
                </div>
              </div>

              {/* SECTION 3 - Advanced Audience Targeting */}
              <div className="p-8 rounded-2xl bg-gradient-to-br from-cyan-500/10 via-transparent to-purple-500/10 border-2 border-cyan-500/30 backdrop-blur-sm shadow-2xl shadow-cyan-500/20">
                <h3 className="text-2xl text-white mb-6 flex items-center gap-2">
                  <Target className="w-6 h-6 text-cyan-400" />
                  Refine Your Audience
                </h3>

                <div className="space-y-6">
                  {/* Age Range Slider */}
                  <div>
                    <label className="block text-sm text-gray-400 mb-3">
                      Age Range: {ageRange[0]} - {ageRange[1]}
                    </label>
                    <Slider
                      value={ageRange}
                      onValueChange={setAgeRange}
                      min={13}
                      max={65}
                      step={1}
                      className="w-full"
                    />
                    <div className="flex justify-between text-xs text-gray-500 mt-2">
                      <span>13</span>
                      <span>65+</span>
                    </div>
                  </div>

                  {/* Gender Selection */}
                  <div>
                    <label className="block text-sm text-gray-400 mb-3">Gender</label>
                    <div className="grid grid-cols-4 gap-3">
                      {(["all", "male", "female", "custom"] as Gender[]).map((g) => (
                        <button
                          key={g}
                          onClick={() => setGender(g)}
                          className={`px-4 py-3 rounded-xl border-2 transition-all capitalize ${
                            gender === g
                              ? "bg-gradient-to-r from-purple-600 to-cyan-600 border-cyan-400/50 text-white shadow-lg shadow-cyan-500/30"
                              : "bg-gray-900/50 border-gray-700/30 text-gray-400 hover:border-purple-500/30"
                          }`}
                        >
                          {g}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Interest Expansion */}
                  <div>
                    <label className="block text-sm text-gray-400 mb-3">Interest Expansion (Optional)</label>
                    <div className="flex flex-wrap gap-3">
                      {interests.map((interest) => (
                        <button
                          key={interest.id}
                          onClick={() => toggleInterest(interest.id)}
                          className={`px-4 py-2 rounded-full border-2 transition-all flex items-center gap-2 ${
                            interest.selected
                              ? "bg-gradient-to-r from-purple-600 to-cyan-600 border-cyan-400/50 text-white shadow-lg shadow-cyan-500/30"
                              : "bg-gray-900/50 border-gray-700/30 text-gray-400 hover:border-purple-500/30"
                          }`}
                        >
                          <span>{interest.icon}</span>
                          <span>{interest.name}</span>
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Device Targeting */}
                  <div>
                    <label className="block text-sm text-gray-400 mb-3">Device Targeting (Optional)</label>
                    <div className="grid grid-cols-3 gap-3">
                      {devices.map((device) => (
                        <button
                          key={device.id}
                          onClick={() => toggleDevice(device.id)}
                          className={`p-4 rounded-xl border-2 transition-all ${
                            device.selected
                              ? "bg-gradient-to-br from-purple-500/20 to-cyan-500/20 border-cyan-400/50 shadow-lg shadow-cyan-500/20"
                              : "bg-gray-900/50 border-gray-700/30 hover:border-purple-500/30"
                          }`}
                        >
                          <device.icon className={`w-6 h-6 mx-auto mb-2 ${device.selected ? "text-cyan-400" : "text-gray-400"}`} />
                          <p className={`text-sm ${device.selected ? "text-white" : "text-gray-400"}`}>
                            {device.name}
                          </p>
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              {/* SECTION 4 - AI Performance Prediction */}
              <div className="p-8 rounded-2xl bg-gradient-to-br from-purple-500/20 via-cyan-500/20 to-blue-500/20 border-2 border-cyan-400/50 backdrop-blur-sm shadow-2xl shadow-cyan-500/30">
                <div className="flex items-center gap-2 mb-6">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-r from-purple-600 to-cyan-600 flex items-center justify-center shadow-lg shadow-cyan-500/50 animate-pulse">
                    <Sparkles className="w-5 h-5 text-white" />
                  </div>
                  <h3 className="text-2xl text-white">AI Performance Prediction</h3>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
                  <div className="p-5 rounded-xl bg-gray-900/50 border border-purple-500/30">
                    <div className="flex items-center gap-2 mb-2">
                      <Users className="w-4 h-4 text-purple-400" />
                      <p className="text-sm text-gray-400">Estimated Reach</p>
                    </div>
                    <p className="text-2xl text-white font-bold">{aiPredictions.estimatedReach}</p>
                  </div>

                  <div className="p-5 rounded-xl bg-gray-900/50 border border-cyan-500/30">
                    <div className="flex items-center gap-2 mb-2">
                      <MousePointer className="w-4 h-4 text-cyan-400" />
                      <p className="text-sm text-gray-400">Estimated Click-Through Rate</p>
                    </div>
                    <p className="text-2xl text-cyan-400 font-bold">{aiPredictions.clickThroughRate}</p>
                  </div>

                  <div className="p-5 rounded-xl bg-gray-900/50 border border-purple-500/30">
                    <div className="flex items-center gap-2 mb-2">
                      <DollarSign className="w-4 h-4 text-purple-400" />
                      <p className="text-sm text-gray-400">Estimated Cost Per Click</p>
                    </div>
                    <p className="text-2xl text-white font-bold">{aiPredictions.costPerClick}</p>
                  </div>

                  <div className="p-5 rounded-xl bg-gradient-to-br from-green-500/20 to-emerald-500/20 border border-green-400/50">
                    <div className="flex items-center gap-2 mb-2">
                      <TrendingUp className="w-4 h-4 text-green-400" />
                      <p className="text-sm text-gray-400">Performance Score</p>
                    </div>
                    <p className="text-2xl text-green-400 font-bold flex items-center gap-2">
                      {aiPredictions.performanceScore}
                      <CheckCircle2 className="w-6 h-6" />
                    </p>
                  </div>
                </div>

                <p className="text-xs text-gray-400 flex items-center gap-2 p-3 rounded-lg bg-gray-900/30">
                  <AlertCircle className="w-4 h-4 text-cyan-400 flex-shrink-0" />
                  Predictions are AI-based estimates and may vary based on market conditions and competition.
                </p>
              </div>

              {/* SECTION 5 - Warnings & Validation */}
              {warnings.length > 0 && (
                <div className="space-y-3">
                  {warnings.map((warning) => (
                    <div
                      key={warning.id}
                      className="p-4 rounded-xl bg-cyan-500/10 border-2 border-cyan-400/30 backdrop-blur-sm flex items-start gap-3"
                    >
                      <AlertCircle className="w-5 h-5 text-cyan-400 flex-shrink-0 mt-0.5" />
                      <div>
                        <p className="text-sm text-gray-300">{warning.message}</p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Right Column - Campaign Summary Panel */}
            <div className="lg:col-span-1">
              <div className="sticky top-8 p-6 rounded-2xl bg-gradient-to-br from-gray-900/90 via-purple-900/20 to-cyan-900/20 border-2 border-purple-500/30 backdrop-blur-sm shadow-2xl shadow-purple-500/20">
                <h3 className="text-xl text-white mb-6 font-semibold">Campaign Summary</h3>

                <div className="space-y-4">
                  {/* Campaign Name */}
                  <div className="p-4 rounded-xl bg-gray-900/50 border border-purple-500/20">
                    <div className="flex items-center justify-between mb-1">
                      <p className="text-xs text-gray-400">Campaign Name</p>
                      <button 
                        onClick={() => navigate("/create-ad")}
                        className="text-cyan-400 hover:text-cyan-300"
                      >
                        <Edit2 className="w-3 h-3" />
                      </button>
                    </div>
                    <p className="text-white font-semibold">{campaignData.name}</p>
                  </div>

                  {/* Campaign Objective */}
                  <div className="p-4 rounded-xl bg-gray-900/50 border border-purple-500/20">
                    <div className="flex items-center justify-between mb-1">
                      <p className="text-xs text-gray-400">Campaign Objective</p>
                      <button 
                        onClick={() => navigate("/create-ad")}
                        className="text-cyan-400 hover:text-cyan-300"
                      >
                        <Edit2 className="w-3 h-3" />
                      </button>
                    </div>
                    <p className="text-white font-semibold">{campaignData.objective}</p>
                  </div>

                  {/* Platforms Selected */}
                  <div className="p-4 rounded-xl bg-gray-900/50 border border-purple-500/20">
                    <div className="flex items-center justify-between mb-2">
                      <p className="text-xs text-gray-400">Platforms Selected</p>
                      <button 
                        onClick={() => navigate("/upload")}
                        className="text-cyan-400 hover:text-cyan-300"
                      >
                        <Edit2 className="w-3 h-3" />
                      </button>
                    </div>
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

                  {/* Budget */}
                  <div className="p-4 rounded-xl bg-gray-900/50 border border-cyan-500/20">
                    <div className="flex items-center justify-between mb-1">
                      <p className="text-xs text-gray-400">Budget ({campaignData.budgetType})</p>
                      <button 
                        onClick={() => navigate("/create-ad")}
                        className="text-cyan-400 hover:text-cyan-300"
                      >
                        <Edit2 className="w-3 h-3" />
                      </button>
                    </div>
                    <p className="text-2xl text-white font-bold">{campaignData.budget}</p>
                  </div>

                  {/* Locations */}
                  <div className="p-4 rounded-xl bg-gray-900/50 border border-purple-500/20">
                    <div className="flex items-center justify-between mb-2">
                      <p className="text-xs text-gray-400">Locations Targeted</p>
                      <button 
                        onClick={() => navigate("/create-ad")}
                        className="text-cyan-400 hover:text-cyan-300"
                      >
                        <Edit2 className="w-3 h-3" />
                      </button>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {campaignData.locations.map((location) => (
                        <span
                          key={location}
                          className="px-3 py-1 rounded-full bg-purple-500/20 text-purple-300 text-xs flex items-center gap-1"
                        >
                          <MapPin className="w-3 h-3" />
                          {location}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Audience */}
                  <div className="p-4 rounded-xl bg-gray-900/50 border border-cyan-500/20">
                    <div className="flex items-center justify-between mb-2">
                      <p className="text-xs text-gray-400">Audience Category</p>
                      <button 
                        onClick={() => navigate("/create-ad")}
                        className="text-cyan-400 hover:text-cyan-300"
                      >
                        <Edit2 className="w-3 h-3" />
                      </button>
                    </div>
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

                  {/* Languages */}
                  <div className="p-4 rounded-xl bg-gray-900/50 border border-purple-500/20">
                    <div className="flex items-center justify-between mb-2">
                      <p className="text-xs text-gray-400">Languages Selected</p>
                      <button 
                        onClick={() => navigate("/create-ad")}
                        className="text-cyan-400 hover:text-cyan-300"
                      >
                        <Edit2 className="w-3 h-3" />
                      </button>
                    </div>
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
                </div>
              </div>
            </div>
          </div>

          {/* SECTION 6 - Action Buttons */}
          <div className="mt-12 flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Button
              onClick={() => navigate("/create-ad")}
              variant="outline"
              size="lg"
              className="px-10 py-6 rounded-xl border-2 border-purple-500/50 text-purple-400 hover:bg-purple-500/10 hover:border-purple-400/70 transition-all"
            >
              <ArrowLeft className="w-5 h-5 mr-2" />
              Back to Edit Campaign
            </Button>

            <Button
              onClick={handleSaveDraft}
              variant="outline"
              size="lg"
              className="px-10 py-6 rounded-xl border-2 border-cyan-500/50 text-cyan-400 hover:bg-cyan-500/10 hover:border-cyan-400/70 transition-all"
            >
              <Save className="w-5 h-5 mr-2" />
              Save as Draft
            </Button>

            <Button
              onClick={handleProceedToPayment}
              size="lg"
              className="px-12 py-6 bg-gradient-to-r from-purple-600 via-cyan-600 to-blue-600 hover:from-purple-700 hover:via-cyan-700 hover:to-blue-700 text-white rounded-xl shadow-lg shadow-cyan-500/50 hover:shadow-cyan-500/70 transition-all duration-300 hover:scale-105"
            >
              <CreditCard className="w-5 h-5 mr-2" />
              Proceed to Payment
            </Button>
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