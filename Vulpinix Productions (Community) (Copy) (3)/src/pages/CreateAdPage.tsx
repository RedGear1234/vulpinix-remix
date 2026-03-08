import { useState } from "react";
import { useNavigate } from "react-router";
import { motion } from "motion/react";
import {
  ArrowLeft,
  Sparkles,
  Target,
  DollarSign,
  Globe,
  MapPin,
  Users,
  Languages,
  TrendingUp,
  Zap,
  ChevronDown,
  Search,
  X,
  Lightbulb,
  Instagram,
  Youtube
} from "lucide-react";
import { Button } from "../components/ui/button";
import { Switch } from "../components/ui/switch";

interface AudienceOption {
  id: string;
  name: string;
  icon: string;
  selected: boolean;
}

interface LocationOption {
  id: string;
  name: string;
  type: "worldwide" | "country" | "custom";
}

export default function CreateAdPage() {
  const navigate = useNavigate();
  
  // Campaign Details
  const [campaignName, setCampaignName] = useState("");
  const [campaignObjective, setCampaignObjective] = useState("brand-awareness");
  
  // Budget Configuration
  const [budgetType, setBudgetType] = useState<"daily" | "campaign">("daily");
  const [budget, setBudget] = useState(5000);
  const [currency, setCurrency] = useState("₹");
  const [campaignDuration, setCampaignDuration] = useState(7); // Campaign duration in days
  
  // Location Targeting
  const [locationType, setLocationType] = useState<"worldwide" | "india" | "custom">("india");
  const [customLocations, setCustomLocations] = useState<string[]>(["Mumbai", "Delhi"]);
  const [locationSearch, setLocationSearch] = useState("");
  
  // Audience Selection
  const [audiences, setAudiences] = useState<AudienceOption[]>([
    { id: "gaming", name: "Gaming", icon: "🎮", selected: false },
    { id: "travel", name: "Travel", icon: "✈️", selected: false },
    { id: "business", name: "Business", icon: "💼", selected: true },
    { id: "shopping", name: "Shopping", icon: "🛍️", selected: false },
    { id: "students", name: "Students", icon: "🎓", selected: false },
    { id: "fitness", name: "Fitness", icon: "🏋️", selected: false },
    { id: "entertainment", name: "Entertainment", icon: "🎵", selected: false },
    { id: "tech", name: "Tech", icon: "📱", selected: true },
  ]);
  
  // Language Preferences
  const [languages, setLanguages] = useState([
    { id: "en", name: "English", selected: true },
    { id: "hi", name: "Hindi", selected: true },
    { id: "mr", name: "Marathi", selected: false },
    { id: "ta", name: "Tamil", selected: false },
    { id: "te", name: "Telugu", selected: false },
    { id: "es", name: "Spanish", selected: false },
    { id: "fr", name: "French", selected: false },
  ]);

  const toggleAudience = (id: string) => {
    setAudiences(audiences.map(a => a.id === id ? { ...a, selected: !a.selected } : a));
  };

  const toggleLanguage = (id: string) => {
    setLanguages(languages.map(l => l.id === id ? { ...l, selected: !l.selected } : l));
  };

  const removeLocation = (location: string) => {
    setCustomLocations(customLocations.filter(l => l !== location));
  };

  const addLocation = (location: string) => {
    if (location && !customLocations.includes(location)) {
      setCustomLocations([...customLocations, location]);
      setLocationSearch("");
    }
  };

  const estimatedReach = Math.floor(budget * 2.5 * (budgetType === "campaign" ? 0.1 : 1));
  const selectedAudiences = audiences.filter(a => a.selected);
  const selectedLanguages = languages.filter(l => l.selected);

  const handleContinueToPreview = () => {
    // Calculate total amount based on budget type
    const totalAmount = budgetType === "daily" 
      ? budget * campaignDuration 
      : budget;
    
    // Get platform data from localStorage (saved from upload page)
    const savedCreative = localStorage.getItem("adCreativeData");
    let platforms = ["Instagram", "Facebook", "YouTube"]; // Default
    if (savedCreative) {
      const creativeData = JSON.parse(savedCreative);
      platforms = creativeData.platforms || platforms;
    }
    
    // Save campaign data to localStorage
    const campaignData = {
      name: campaignName || "Summer Sale Campaign",
      objective: campaignObjective === "brand-awareness" ? "Brand Awareness" : 
                 campaignObjective === "conversions" ? "Conversions" : 
                 campaignObjective === "traffic" ? "Traffic" : "Brand Awareness",
      platforms: platforms,
      budgetType: budgetType === "daily" ? "Daily" : "Campaign",
      budget: `${currency}${budget.toLocaleString()}`,
      totalAmount: `${currency}${totalAmount.toLocaleString()}`,
      duration: `${campaignDuration} Days`,
      locations: locationType === "worldwide" ? ["Worldwide"] : 
                 locationType === "india" ? ["India"] : 
                 customLocations,
      audience: selectedAudiences.map(a => a.name),
      languages: selectedLanguages.map(l => l.name)
    };
    
    localStorage.setItem("campaignData", JSON.stringify(campaignData));
    navigate("/ad-preview");
  };

  const objectives = [
    { value: "brand-awareness", label: "Brand Awareness" },
    { value: "traffic", label: "Traffic" },
    { value: "engagement", label: "Engagement" },
    { value: "leads", label: "Leads" },
    { value: "sales", label: "Sales / Conversions" },
  ];

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
            <pattern id="circuit-ad" x="0" y="0" width="100" height="100" patternUnits="userSpaceOnUse">
              <circle cx="50" cy="50" r="2" fill="#00ffff" />
              <line x1="50" y1="50" x2="100" y2="50" stroke="#00ffff" strokeWidth="0.5" />
              <line x1="50" y1="50" x2="50" y2="0" stroke="#00ffff" strokeWidth="0.5" />
              <circle cx="0" cy="50" r="2" fill="#a855f7" />
              <circle cx="50" cy="0" r="2" fill="#3b82f6" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#circuit-ad)" />
        </svg>
      </div>

      {/* Content */}
      <div className="relative z-10 min-h-screen px-4 sm:px-6 lg:px-8 py-8">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="mb-8">
            <Button
              variant="ghost"
              onClick={() => navigate("/upload")}
              className="text-cyan-400 hover:text-cyan-300 hover:bg-cyan-500/10 mb-4"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Upload
            </Button>

            <h1 className="text-4xl sm:text-5xl text-white mb-2 bg-gradient-to-r from-purple-400 via-cyan-400 to-blue-400 bg-clip-text text-transparent">
              Create Ad Campaign
            </h1>
            <p className="text-xl text-gray-400">
              Define your campaign goals, audience, and budget with AI precision.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Main Content Area */}
            <div className="lg:col-span-2 space-y-8">
              {/* SECTION 1 - Campaign Details */}
              <div className="p-8 rounded-2xl bg-gradient-to-br from-purple-500/10 via-transparent to-cyan-500/10 border-2 border-purple-500/30 backdrop-blur-sm shadow-2xl shadow-purple-500/20">
                <h3 className="text-2xl text-white mb-6 flex items-center gap-2">
                  <Target className="w-6 h-6 text-purple-400" />
                  Campaign Details
                </h3>

                <div className="space-y-6">
                  {/* Campaign Name */}
                  <div>
                    <label className="block text-sm text-gray-400 mb-2">Campaign Name</label>
                    <input
                      type="text"
                      value={campaignName}
                      onChange={(e) => setCampaignName(e.target.value)}
                      placeholder="Eg: Summer Sale Campaign"
                      className="w-full px-4 py-3 rounded-xl bg-gray-900/50 border-2 border-purple-500/30 text-white placeholder-gray-500 focus:border-cyan-400/50 focus:outline-none focus:shadow-lg focus:shadow-cyan-500/20 transition-all"
                    />
                  </div>

                  {/* Campaign Objective */}
                  <div>
                    <label className="block text-sm text-gray-400 mb-2">Campaign Objective</label>
                    <div className="relative">
                      <select
                        value={campaignObjective}
                        onChange={(e) => setCampaignObjective(e.target.value)}
                        className="w-full px-4 py-3 rounded-xl bg-gray-900/50 border-2 border-purple-500/30 text-white focus:border-cyan-400/50 focus:outline-none focus:shadow-lg focus:shadow-cyan-500/20 transition-all appearance-none cursor-pointer"
                      >
                        {objectives.map(obj => (
                          <option key={obj.value} value={obj.value}>{obj.label}</option>
                        ))}
                      </select>
                      <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none" />
                    </div>
                  </div>
                </div>
              </div>

              {/* SECTION 2 - Budget Configuration */}
              <div className="p-8 rounded-2xl bg-gradient-to-br from-cyan-500/10 via-transparent to-purple-500/10 border-2 border-cyan-500/30 backdrop-blur-sm shadow-2xl shadow-cyan-500/20">
                <h3 className="text-2xl text-white mb-6 flex items-center gap-2">
                  <DollarSign className="w-6 h-6 text-cyan-400" />
                  Budget Configuration
                </h3>

                <div className="space-y-6">
                  {/* Budget Type Toggle */}
                  <div className="flex items-center justify-between p-4 rounded-xl bg-purple-500/10 border border-purple-500/30">
                    <div className="flex items-center gap-4">
                      <span className={`text-sm ${budgetType === "daily" ? "text-white font-semibold" : "text-gray-400"}`}>
                        Daily Budget
                      </span>
                      <Switch
                        checked={budgetType === "campaign"}
                        onCheckedChange={(checked) => setBudgetType(checked ? "campaign" : "daily")}
                      />
                      <span className={`text-sm ${budgetType === "campaign" ? "text-white font-semibold" : "text-gray-400"}`}>
                        Campaign Budget
                      </span>
                    </div>
                  </div>

                  {/* Currency Selector */}
                  <div>
                    <label className="block text-sm text-gray-400 mb-2">Currency</label>
                    <div className="flex gap-2">
                      <button
                        onClick={() => setCurrency("₹")}
                        className={`px-6 py-2 rounded-xl border-2 transition-all ${
                          currency === "₹"
                            ? "bg-gradient-to-r from-purple-600 to-cyan-600 border-cyan-400/50 text-white shadow-lg shadow-cyan-500/30"
                            : "bg-gray-900/50 border-gray-700/30 text-gray-400 hover:border-purple-500/30"
                        }`}
                      >
                        ₹ INR
                      </button>
                      <button
                        onClick={() => setCurrency("$")}
                        className={`px-6 py-2 rounded-xl border-2 transition-all ${
                          currency === "$"
                            ? "bg-gradient-to-r from-purple-600 to-cyan-600 border-cyan-400/50 text-white shadow-lg shadow-cyan-500/30"
                            : "bg-gray-900/50 border-gray-700/30 text-gray-400 hover:border-purple-500/30"
                        }`}
                      >
                        $ USD
                      </button>
                    </div>
                  </div>

                  {/* Budget Display */}
                  <div className="text-center py-6">
                    <div className="text-6xl font-bold text-white mb-2 bg-gradient-to-r from-purple-400 via-cyan-400 to-blue-400 bg-clip-text text-transparent">
                      {currency}{budget.toLocaleString()}
                    </div>
                    <p className="text-sm text-gray-400">
                      {budgetType === "daily" ? "per day" : "total campaign budget"}
                    </p>
                  </div>

                  {/* Budget Slider */}
                  <div>
                    <input
                      type="range"
                      min="100"
                      max="500000"
                      step="100"
                      value={budget}
                      onChange={(e) => setBudget(Number(e.target.value))}
                      className="w-full h-3 bg-gray-800 rounded-full appearance-none cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-6 [&::-webkit-slider-thumb]:h-6 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-gradient-to-r [&::-webkit-slider-thumb]:from-purple-600 [&::-webkit-slider-thumb]:to-cyan-600 [&::-webkit-slider-thumb]:shadow-lg [&::-webkit-slider-thumb]:shadow-cyan-500/50 [&::-webkit-slider-thumb]:cursor-pointer"
                    />
                    <div className="flex justify-between text-xs text-gray-500 mt-2">
                      <span>{currency}100</span>
                      <span>{currency}5,00,000</span>
                    </div>
                  </div>

                  {/* Campaign Duration */}
                  <div>
                    <label className="block text-sm text-gray-400 mb-3">Campaign Duration: {campaignDuration} Days</label>
                    <input
                      type="range"
                      min="1"
                      max="90"
                      step="1"
                      value={campaignDuration}
                      onChange={(e) => setCampaignDuration(Number(e.target.value))}
                      className="w-full h-3 bg-gray-800 rounded-full appearance-none cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-6 [&::-webkit-slider-thumb]:h-6 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-gradient-to-r [&::-webkit-slider-thumb]:from-cyan-600 [&::-webkit-slider-thumb]:to-blue-600 [&::-webkit-slider-thumb]:shadow-lg [&::-webkit-slider-thumb]:shadow-cyan-500/50 [&::-webkit-slider-thumb]:cursor-pointer"
                    />
                    <div className="flex justify-between text-xs text-gray-500 mt-2">
                      <span>1 Day</span>
                      <span>90 Days</span>
                    </div>
                    <p className="text-xs text-gray-400 mt-2 flex items-center gap-1">
                      <Sparkles className="w-3 h-3 text-cyan-400" />
                      {budgetType === "daily" 
                        ? `Total spend: ${currency}${(budget * campaignDuration).toLocaleString()}`
                        : `Daily spend: ${currency}${Math.floor(budget / campaignDuration).toLocaleString()}`}
                    </p>
                  </div>

                  {/* AI Reach Estimator */}
                  <div className="p-6 rounded-xl bg-gradient-to-r from-purple-500/20 to-cyan-500/20 border-2 border-cyan-400/50 backdrop-blur-sm">
                    <div className="flex items-center gap-2 mb-4">
                      <div className="w-8 h-8 rounded-full bg-gradient-to-r from-purple-600 to-cyan-600 flex items-center justify-center shadow-lg shadow-cyan-500/50 animate-pulse">
                        <Sparkles className="w-4 h-4 text-white" />
                      </div>
                      <h4 className="text-white font-semibold">AI Reach Estimator</h4>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div className="p-4 rounded-lg bg-gray-900/50 border border-purple-500/30">
                        <p className="text-sm text-gray-400 mb-1">Estimated Reach</p>
                        <p className="text-2xl text-white font-bold">{estimatedReach.toLocaleString()}</p>
                      </div>
                      <div className="p-4 rounded-lg bg-gray-900/50 border border-cyan-500/30">
                        <p className="text-sm text-gray-400 mb-1">Engagement Level</p>
                        <p className="text-2xl text-cyan-400 font-bold">High</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* SECTION 3 - Location Targeting */}
              <div className="p-8 rounded-2xl bg-gradient-to-br from-purple-500/10 via-transparent to-blue-500/10 border-2 border-purple-500/30 backdrop-blur-sm shadow-2xl shadow-purple-500/20">
                <h3 className="text-2xl text-white mb-6 flex items-center gap-2">
                  <Globe className="w-6 h-6 text-purple-400" />
                  Target Locations
                </h3>

                <div className="space-y-4">
                  {/* Location Type Options */}
                  <div className="grid grid-cols-3 gap-3">
                    <button
                      onClick={() => setLocationType("worldwide")}
                      className={`p-4 rounded-xl border-2 transition-all ${
                        locationType === "worldwide"
                          ? "bg-gradient-to-br from-purple-500/20 to-cyan-500/20 border-cyan-400/50 shadow-lg shadow-cyan-500/20"
                          : "bg-gray-900/50 border-gray-700/30 hover:border-purple-500/30"
                      }`}
                    >
                      <Globe className="w-6 h-6 text-cyan-400 mx-auto mb-2" />
                      <p className="text-white text-sm">Worldwide</p>
                    </button>

                    <button
                      onClick={() => setLocationType("india")}
                      className={`p-4 rounded-xl border-2 transition-all ${
                        locationType === "india"
                          ? "bg-gradient-to-br from-purple-500/20 to-cyan-500/20 border-cyan-400/50 shadow-lg shadow-cyan-500/20"
                          : "bg-gray-900/50 border-gray-700/30 hover:border-purple-500/30"
                      }`}
                    >
                      <span className="text-3xl mb-2 block">🇮🇳</span>
                      <p className="text-white text-sm">All India</p>
                    </button>

                    <button
                      onClick={() => setLocationType("custom")}
                      className={`p-4 rounded-xl border-2 transition-all ${
                        locationType === "custom"
                          ? "bg-gradient-to-br from-purple-500/20 to-cyan-500/20 border-cyan-400/50 shadow-lg shadow-cyan-500/20"
                          : "bg-gray-900/50 border-gray-700/30 hover:border-purple-500/30"
                      }`}
                    >
                      <MapPin className="w-6 h-6 text-purple-400 mx-auto mb-2" />
                      <p className="text-white text-sm">Custom</p>
                    </button>
                  </div>

                  {/* Custom Location Search */}
                  {locationType === "custom" && (
                    <div className="space-y-4">
                      <div className="relative">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                        <input
                          type="text"
                          value={locationSearch}
                          onChange={(e) => setLocationSearch(e.target.value)}
                          onKeyPress={(e) => e.key === "Enter" && addLocation(locationSearch)}
                          placeholder="Search city, area, or pin code"
                          className="w-full pl-12 pr-4 py-3 rounded-xl bg-gray-900/50 border-2 border-purple-500/30 text-white placeholder-gray-500 focus:border-cyan-400/50 focus:outline-none transition-all"
                        />
                      </div>

                      {/* Location Tags */}
                      <div className="flex flex-wrap gap-2">
                        {customLocations.map((location) => (
                          <div
                            key={location}
                            className="flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-purple-600 to-cyan-600 text-white shadow-lg"
                          >
                            <MapPin className="w-4 h-4" />
                            <span>{location}</span>
                            <button
                              onClick={() => removeLocation(location)}
                              className="hover:bg-white/20 rounded-full p-1 transition-all"
                            >
                              <X className="w-3 h-3" />
                            </button>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* SECTION 4 - Audience Selection */}
              <div className="p-8 rounded-2xl bg-gradient-to-br from-cyan-500/10 via-transparent to-purple-500/10 border-2 border-cyan-500/30 backdrop-blur-sm shadow-2xl shadow-cyan-500/20">
                <h3 className="text-2xl text-white mb-6 flex items-center gap-2">
                  <Users className="w-6 h-6 text-cyan-400" />
                  Select Target Audience
                </h3>

                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
                  {audiences.map((audience) => (
                    <button
                      key={audience.id}
                      onClick={() => toggleAudience(audience.id)}
                      className={`p-4 rounded-xl border-2 transition-all ${
                        audience.selected
                          ? "bg-gradient-to-br from-purple-500/20 to-cyan-500/20 border-cyan-400/50 shadow-lg shadow-cyan-500/20 scale-105"
                          : "bg-gray-900/50 border-gray-700/30 hover:border-purple-500/30 hover:scale-105"
                      }`}
                    >
                      <span className="text-4xl mb-2 block">{audience.icon}</span>
                      <p className="text-white text-sm font-medium">{audience.name}</p>
                    </button>
                  ))}
                </div>

                <button className="w-full mt-4 p-4 rounded-xl border-2 border-dashed border-purple-500/50 bg-purple-500/5 text-purple-400 hover:bg-purple-500/10 hover:border-purple-400/70 transition-all">
                  + Custom Audience
                </button>
              </div>

              {/* SECTION 5 - Language Preferences */}
              <div className="p-8 rounded-2xl bg-gradient-to-br from-purple-500/10 via-transparent to-cyan-500/10 border-2 border-purple-500/30 backdrop-blur-sm shadow-2xl shadow-purple-500/20">
                <h3 className="text-2xl text-white mb-6 flex items-center gap-2">
                  <Languages className="w-6 h-6 text-purple-400" />
                  Ad Language
                </h3>

                <div className="flex flex-wrap gap-3 mb-4">
                  {languages.map((lang) => (
                    <button
                      key={lang.id}
                      onClick={() => toggleLanguage(lang.id)}
                      className={`px-6 py-3 rounded-full border-2 transition-all ${
                        lang.selected
                          ? "bg-gradient-to-r from-purple-600 to-cyan-600 border-cyan-400/50 text-white shadow-lg shadow-cyan-500/30"
                          : "bg-gray-900/50 border-gray-700/30 text-gray-400 hover:border-purple-500/30"
                      }`}
                    >
                      {lang.name}
                    </button>
                  ))}
                </div>

                <p className="text-sm text-gray-400 flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-cyan-400" />
                  AI will generate captions and ad creatives in selected languages.
                </p>
              </div>
            </div>

            {/* SECTION 6 - AI Recommendation Panel */}
            <div className="lg:col-span-1">
              <div className="sticky top-8 p-6 rounded-2xl bg-gradient-to-br from-gray-900/80 via-purple-900/20 to-cyan-900/20 border-2 border-purple-500/30 backdrop-blur-sm shadow-2xl shadow-purple-500/20">
                <div className="flex items-center gap-2 mb-6">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-r from-purple-600 to-cyan-600 flex items-center justify-center shadow-lg shadow-cyan-500/50 animate-pulse">
                    <Lightbulb className="w-5 h-5 text-white" />
                  </div>
                  <h3 className="text-xl text-white font-semibold">AI Campaign Insights</h3>
                </div>

                <div className="space-y-4">
                  {/* Insight 1 */}
                  <div className="p-4 rounded-xl bg-purple-500/10 border border-purple-500/30 backdrop-blur-sm">
                    <div className="flex items-start gap-3">
                      <Target className="w-5 h-5 text-purple-400 mt-1 flex-shrink-0" />
                      <div>
                        <p className="text-sm text-gray-300">
                          {selectedAudiences.length > 0 
                            ? `${selectedAudiences[0].name} audience performs best at ${currency}${budgetType === "daily" ? Math.floor(budget * 0.16) : Math.floor(budget * 0.016)}/day`
                            : "Select audience to see performance insights"}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Insight 2 */}
                  <div className="p-4 rounded-xl bg-cyan-500/10 border border-cyan-500/30 backdrop-blur-sm">
                    <div className="flex items-start gap-3">
                      <div className="flex gap-1 mt-1">
                        <Instagram className="w-4 h-4 text-cyan-400" />
                        <Youtube className="w-4 h-4 text-cyan-400" />
                      </div>
                      <div>
                        <p className="text-sm text-gray-300">
                          Instagram + YouTube recommended for {selectedAudiences.length > 0 ? selectedAudiences.map(a => a.name).join(" & ") : "your audience"}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Insight 3 */}
                  <div className="p-4 rounded-xl bg-blue-500/10 border border-blue-500/30 backdrop-blur-sm">
                    <div className="flex items-start gap-3">
                      <TrendingUp className="w-5 h-5 text-blue-400 mt-1 flex-shrink-0" />
                      <div>
                        <p className="text-sm text-gray-300">
                          {selectedLanguages.length > 1 
                            ? `${selectedLanguages.map(l => l.name).join(" & ")} increase CTR by ${selectedLanguages.length * 11}%`
                            : "Add more languages to increase reach"}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Campaign Summary */}
                  <div className="mt-6 p-4 rounded-xl bg-gradient-to-r from-purple-500/20 to-cyan-500/20 border-2 border-cyan-400/50">
                    <h4 className="text-white font-semibold mb-3">Campaign Summary</h4>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-gray-400">Audiences:</span>
                        <span className="text-white">{selectedAudiences.length}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-400">Languages:</span>
                        <span className="text-white">{selectedLanguages.length}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-400">Estimated Reach:</span>
                        <span className="text-cyan-400 font-semibold">{estimatedReach.toLocaleString()}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* SECTION 7 - Navigation Buttons */}
          <div className="mt-12 flex flex-col sm:flex-row gap-4 justify-center">
            <Button
              onClick={() => navigate("/upload")}
              variant="outline"
              size="lg"
              className="px-12 py-6 rounded-xl border-2 border-purple-500/50 text-purple-400 hover:bg-purple-500/10 hover:border-purple-400/70 transition-all"
            >
              <ArrowLeft className="w-5 h-5 mr-2" />
              Back
            </Button>

            <Button
              size="lg"
              onClick={handleContinueToPreview}
              className="px-12 py-6 bg-gradient-to-r from-purple-600 via-cyan-600 to-blue-600 hover:from-purple-700 hover:via-cyan-700 hover:to-blue-700 text-white rounded-xl shadow-lg shadow-cyan-500/50 hover:shadow-cyan-500/70 transition-all duration-300 hover:scale-105"
            >
              Continue to Ad Preview
              <Zap className="w-5 h-5 ml-2" />
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