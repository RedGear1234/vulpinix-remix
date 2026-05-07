import { useState, useEffect, useRef } from "react";
import Lottie from "lottie-react";
import mapAnimation from "../Watch_demo/map.json";
import { useNavigate } from "react-router";
import { motion, AnimatePresence } from "framer-motion";
import { 
  ArrowLeft, 
  Target, 
  DollarSign, 
  MapPin, 
  Users, 
  Languages, 
  Zap, 
  TrendingUp, 
  ChevronRight, 
  Sparkles,
  Globe,
  Plus,
  X,
  ChevronDown,
  Check
} from "lucide-react";
import { toast } from "sonner";

interface AudienceOption {
  id: string;
  name: string;
  icon: string;
  selected: boolean;
}

export default function CreateAdPage() {
  const navigate = useNavigate();
  
  // Campaign Details
  const [campaignName, setCampaignName] = useState("");
  const [campaignObjective, setCampaignObjective] = useState("brand-awareness");
  const [isObjDropdownOpen, setIsObjDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  
  // Budget Configuration
  const [budgetType, setBudgetType] = useState<"daily" | "campaign">("daily");
  const [budget, setBudget] = useState(5000);
  const [currency, setCurrency] = useState("₹");
  const [campaignDuration, setCampaignDuration] = useState(7);
  
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
  ]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsObjDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const toggleAudience = (id: string) => {
    setAudiences(audiences.map(a => a.id === id ? { ...a, selected: !a.selected } : a));
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

  const estimatedReachBase = Math.floor(budget * 2.5 * (budgetType === "campaign" ? 0.1 : 1));
  const selectedAudiences = audiences.filter(a => a.selected);
  const selectedLanguages = languages.filter(l => l.selected);

  const objectives = [
    { value: "brand-awareness", label: "Brand Awareness", desc: "Reach maximum people" },
    { value: "traffic", label: "Traffic", desc: "Get more website visits" },
    { value: "engagement", label: "Engagement", desc: "More likes & comments" },
    { value: "leads", label: "Leads", desc: "Find interested customers" },
    { value: "sales", label: "Sales", desc: "Drive direct conversions" },
  ];

  const currentObjective = objectives.find(o => o.value === campaignObjective) || objectives[0];

  const handleContinueToPreview = () => {
    if (!campaignName) {
      toast.error("Please enter a campaign name");
      return;
    }
    
    const totalAmount = budgetType === "daily" ? budget * campaignDuration : budget;
    const savedCreative = localStorage.getItem("adCreativeData");
    let platforms = ["Instagram", "Facebook", "YouTube"];
    if (savedCreative) {
      try {
        const creativeData = JSON.parse(savedCreative);
        platforms = creativeData.platforms || platforms;
      } catch {}
    }
    
    const campaignData = {
      name: campaignName,
      objective: currentObjective.label,
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

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      style={{
        background: "var(--vx-bg-primary)",
        minHeight: "100vh",
        padding: "100px 24px 120px",
        color: "var(--vx-text-primary)",
        position: "relative",
        overflow: "hidden"
      }}
    >
      {/* Background Decor */}
      <div style={{ position: "absolute", top: "10%", left: "-10%", width: "40vw", height: "40vw", background: "radial-gradient(circle, rgba(167, 139, 250, 0.05) 0%, transparent 70%)", pointerEvents: "none" }} />
      <div style={{ position: "absolute", bottom: "10%", right: "-10%", width: "40vw", height: "40vw", background: "radial-gradient(circle, rgba(56, 189, 248, 0.05) 0%, transparent 70%)", pointerEvents: "none" }} />

      <div style={{ maxWidth: 820, margin: "0 auto", position: "relative", zIndex: 1 }}>
        
        {/* Header Section */}
        <div style={{ marginBottom: 60 }}>
          <button 
            onClick={() => navigate("/upload")}
            style={{ display: "flex", alignItems: "center", gap: 8, background: "none", border: "none", color: "var(--vx-text-muted)", cursor: "pointer", fontSize: 14, fontWeight: 600, marginBottom: 20, padding: 0 }}
            onMouseEnter={e => e.currentTarget.style.color = "var(--vx-text-primary)"}
            onMouseLeave={e => e.currentTarget.style.color = "var(--vx-text-muted)"}
          >
            <ArrowLeft size={16} /> Back to Content
          </button>

          <div style={{ display: "inline-flex", alignItems: "center", gap: 8, padding: "6px 14px", borderRadius: 99, background: "linear-gradient(135deg, rgba(167, 139, 250, 0.15), rgba(56, 189, 248, 0.15))", border: "1px solid rgba(167, 139, 250, 0.3)", fontSize: 11, fontWeight: 800, textTransform: "uppercase", letterSpacing: "0.1em", color: "#a78bfa", marginBottom: 20, marginTop: 12 }}>
            <Sparkles size={12} fill="currentColor" /> Smart Automation Engine
          </div>
          <h1 style={{ fontSize: "clamp(2rem, 5vw, 2.8rem)", fontWeight: 800, letterSpacing: "-0.04em", margin: 0, lineHeight: 1, paddingTop: 20 }}>
            Configure Your <span style={{ background: "linear-gradient(135deg, #a78bfa, #38bdf8)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>Campaign</span>
          </h1>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "1fr", gap: 32 }}>
          
          {/* Step 1: Specs */}
          <div style={{ background: "var(--vx-bg-card)", border: "1px solid var(--vx-border)", borderRadius: 24, padding: "32px", position: "relative" }}>
            <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: 1, background: "linear-gradient(90deg, transparent, var(--vx-border), transparent)" }} />
            
            <div style={{ display: "flex", gap: 24, alignItems: "flex-start", marginBottom: 32 }}>
              <div style={{ width: 48, height: 48, borderRadius: 16, background: "var(--vx-bg-input)", border: "1px solid var(--vx-border)", display: "flex", alignItems: "center", justifyContent: "center", color: "var(--vx-text-primary)", flexShrink: 0 }}>
                <Target size={24} />
              </div>
              <div style={{ flex: 1 }}>
                <h3 style={{ fontSize: 20, fontWeight: 800, marginBottom: 4 }}>Campaign Specs</h3>
                <p style={{ color: "var(--vx-text-muted)", fontSize: 14 }}>Name your campaign and choose your primary objective.</p>
              </div>
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: 24 }}>
              <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                <label style={{ fontSize: 12, fontWeight: 800, textTransform: "uppercase", letterSpacing: "0.05em", color: "var(--vx-text-muted)" }}>Campaign Name</label>
                <input 
                  type="text" 
                  value={campaignName}
                  onChange={e => setCampaignName(e.target.value)}
                  placeholder="e.g. Summer Collection Launch"
                  style={{ background: "var(--vx-bg-input)", border: "1px solid var(--vx-border)", borderRadius: 12, padding: "14px 18px", color: "var(--vx-text-primary)", fontSize: 15, fontWeight: 500, outline: "none" }}
                />
              </div>

              {/* Custom Objective Dropdown */}
              <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                <label style={{ fontSize: 12, fontWeight: 800, textTransform: "uppercase", letterSpacing: "0.05em", color: "var(--vx-text-muted)" }}>Campaign Objective</label>
                <div ref={dropdownRef} style={{ position: "relative" }}>
                  <div 
                    onClick={() => setIsObjDropdownOpen(!isObjDropdownOpen)}
                    style={{ 
                      background: "var(--vx-bg-input)", border: "1px solid var(--vx-border)", borderRadius: 12, padding: "14px 18px", 
                      color: "var(--vx-text-primary)", fontSize: 15, fontWeight: 600, display: "flex", justifyContent: "space-between", alignItems: "center", cursor: "pointer" 
                    }}
                  >
                    <span>{currentObjective.label}</span>
                    <ChevronDown size={18} style={{ transform: isObjDropdownOpen ? "rotate(180deg)" : "rotate(0)", transition: "0.3s" }} />
                  </div>
                  
                  <AnimatePresence>
                    {isObjDropdownOpen && (
                      <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 10 }}
                        style={{ 
                          position: "absolute", top: "100%", left: 0, right: 0, marginTop: 8, background: "#0c0d18", 
                          border: "1px solid var(--vx-border)", borderRadius: 16, overflow: "hidden", zIndex: 100, boxShadow: "0 20px 40px rgba(0,0,0,0.6)" 
                        }}
                      >
                        {objectives.map(o => (
                          <div 
                            key={o.value} 
                            onClick={() => { setCampaignObjective(o.value); setIsObjDropdownOpen(false); }}
                            style={{ 
                              padding: "14px 18px", cursor: "pointer", transition: "0.2s", 
                              background: campaignObjective === o.value ? "rgba(255,255,255,0.05)" : "transparent",
                              display: "flex", justifyContent: "space-between", alignItems: "center"
                            }}
                            onMouseEnter={e => e.currentTarget.style.background = "rgba(255,255,255,0.08)"}
                            onMouseLeave={e => e.currentTarget.style.background = campaignObjective === o.value ? "rgba(255,255,255,0.05)" : "transparent"}
                          >
                            <div>
                              <div style={{ fontSize: 14, fontWeight: 700, color: "var(--vx-text-primary)" }}>{o.label}</div>
                              <div style={{ fontSize: 11, color: "var(--vx-text-muted)" }}>{o.desc}</div>
                            </div>
                            {campaignObjective === o.value && <Check size={16} style={{ color: "#38bdf8" }} />}
                          </div>
                        ))}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </div>
            </div>
          </div>

          {/* Step 2: Budget */}
          <div style={{ background: "var(--vx-bg-card)", border: "1px solid var(--vx-border)", borderRadius: 24, padding: "32px" }}>
            <div style={{ display: "flex", gap: 24, alignItems: "flex-start", marginBottom: 32 }}>
              <div style={{ width: 48, height: 48, borderRadius: 16, background: "var(--vx-bg-input)", border: "1px solid var(--vx-border)", display: "flex", alignItems: "center", justifyContent: "center", color: "var(--vx-text-primary)", flexShrink: 0 }}>
                <DollarSign size={24} />
              </div>
              <div style={{ flex: 1 }}>
                <h3 style={{ fontSize: 20, fontWeight: 800, marginBottom: 4 }}>Budget & Schedule</h3>
                <p style={{ color: "var(--vx-text-muted)", fontSize: 14 }}>Allocate your spend and define the campaign duration.</p>
              </div>
            </div>

            <div style={{ background: "var(--vx-bg-input)", borderRadius: 24, padding: "32px", border: "1px solid var(--vx-border)", marginBottom: 24 }}>
              <div style={{ display: "flex", justifyContent: "center", gap: 12, marginBottom: 32 }}>
                <button onClick={() => setBudgetType("daily")} style={{ padding: "10px 20px", borderRadius: 12, border: "1px solid var(--vx-border)", background: budgetType === "daily" ? "var(--vx-text-primary)" : "transparent", color: budgetType === "daily" ? "var(--vx-bg-primary)" : "var(--vx-text-muted)", fontWeight: 700, fontSize: 13, cursor: "pointer", transition: "0.2s" }}>Daily Budget</button>
                <button onClick={() => setBudgetType("campaign")} style={{ padding: "10px 20px", borderRadius: 12, border: "1px solid var(--vx-border)", background: budgetType === "campaign" ? "var(--vx-text-primary)" : "transparent", color: budgetType === "campaign" ? "var(--vx-bg-primary)" : "var(--vx-text-muted)", fontWeight: 700, fontSize: 13, cursor: "pointer", transition: "0.2s" }}>Total Budget</button>
              </div>

              <div style={{ textAlign: "center", marginBottom: 32 }}>
                <div style={{ fontSize: 48, fontWeight: 800, color: "var(--vx-text-primary)", letterSpacing: "-0.04em" }}>{currency}{budget.toLocaleString()}</div>
                <div style={{ fontSize: 12, fontWeight: 700, color: "var(--vx-text-muted)", textTransform: "uppercase", letterSpacing: "0.1em", marginTop: 4 }}>{budgetType === "daily" ? "Estimated Daily Spend" : "Total Campaign Budget"}</div>
              </div>

              <input 
                type="range" min="500" max="100000" step="500" value={budget}
                onChange={e => setBudget(Number(e.target.value))}
                style={{ width: "100%", height: 6, borderRadius: 3, background: "var(--vx-border)", appearance: "none", outline: "none", cursor: "pointer" }}
              />
            </div>

            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", background: "var(--vx-bg-input)", padding: "16px 24px", borderRadius: 16, border: "1px solid var(--vx-border)" }}>
              <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                <span style={{ fontSize: 14, fontWeight: 800, color: "var(--vx-text-primary)" }}>Duration</span>
                <span style={{ fontSize: 14, fontWeight: 600, color: "var(--vx-text-muted)" }}>{campaignDuration} Days</span>
              </div>
              <input 
                type="range" min="1" max="60" value={campaignDuration}
                onChange={e => setCampaignDuration(Number(e.target.value))}
                style={{ width: "200px" }}
              />
            </div>
          </div>

          {/* Step 3: Audience & Location */}
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: 32 }}>
            
            {/* Left column: Location + Language */}
            <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
            {/* Location Targeting Card */}
            <div style={{ background: "var(--vx-bg-card)", border: "1px solid var(--vx-border)", borderRadius: 32, padding: "32px", position: "relative", overflow: "hidden" }}>

              <style>{`
                @keyframes vx-pin-pulse {
                  0%, 100% { transform: scale(1); opacity: 0.7; }
                  50% { transform: scale(1.8); opacity: 0; }
                }
                @keyframes vx-pin-drop {
                  0% { transform: translateY(-16px); opacity: 0; }
                  60% { transform: translateY(4px); opacity: 1; }
                  80% { transform: translateY(-2px); }
                  100% { transform: translateY(0); }
                }
                .vx-map-pin { animation: vx-pin-drop 0.5s cubic-bezier(0.16,1,0.3,1) both; }
                .vx-map-pin-ring { animation: vx-pin-pulse 1.8s ease-in-out infinite; }
              `}</style>

              <div style={{ display: "flex", gap: 16, alignItems: "center", marginBottom: 20 }}>
                <MapPin size={22} style={{ color: "#a78bfa" }} />
                <h3 style={{ fontSize: 18, fontWeight: 800 }}>Location Targeting</h3>
              </div>

              {/* Toggle Buttons */}
              <div style={{ display: "flex", gap: 8, marginBottom: 20 }}>
                {(["worldwide", "india", "custom"] as const).map(type => (
                  <button key={type} onClick={() => setLocationType(type)} style={{ flex: 1, padding: "10px", borderRadius: 10, border: `1px solid ${locationType === type ? "#a78bfa" : "var(--vx-border)"}`, background: locationType === type ? "rgba(167,139,250,0.15)" : "var(--vx-bg-input)", color: locationType === type ? "#a78bfa" : "var(--vx-text-muted)", fontWeight: 700, fontSize: 12, cursor: "pointer", transition: "all 0.2s", textTransform: "capitalize" }}>
                    {type === "worldwide" ? "🌍 World" : type === "india" ? "🇮🇳 India" : "📍 Custom"}
                  </button>
                ))}
              </div>

              {/* ── LOTTIE MAP ── */}
              <div style={{ borderRadius: 16, overflow: "hidden", border: "1px solid rgba(56,189,248,0.2)", background: "#080c18", marginBottom: 16, position: "relative" }}>
                <Lottie
                  animationData={mapAnimation}
                  loop
                  autoplay
                  style={{ width: "100%", display: "block" }}
                />
              </div>

              {/* Custom location input */}
              {locationType === "custom" && (
                <div>
                  <div style={{ display: "flex", gap: 8, marginBottom: 10 }}>
                    <input
                      type="text"
                      placeholder="Type a city and press Enter…"
                      value={locationSearch}
                      onChange={e => setLocationSearch(e.target.value)}
                      onKeyDown={e => e.key === 'Enter' && addLocation(locationSearch)}
                      style={{ flex: 1, background: "var(--vx-bg-input)", border: "1px solid var(--vx-border)", borderRadius: 10, padding: "10px 14px", color: "var(--vx-text-primary)", fontSize: 13, outline: "none" }}
                    />
                    <button onClick={() => addLocation(locationSearch)} style={{ padding: "10px 16px", borderRadius: 10, background: "#a78bfa", color: "#fff", border: "none", fontWeight: 700, fontSize: 13, cursor: "pointer" }}>
                      <Plus size={16} />
                    </button>
                  </div>
                  <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
                    {customLocations.map((loc, i) => {
                      const colors = ["#a78bfa","#38bdf8","#4ade80","#fb923c","#f472b6"];
                      const c = colors[i % colors.length];
                      return (
                        <div key={loc} style={{ display: "flex", alignItems: "center", gap: 6, padding: "5px 12px", borderRadius: 8, background: `${c}15`, border: `1px solid ${c}40`, fontSize: 12, fontWeight: 700, color: c }}>
                          📍 {loc}
                          <X size={13} style={{ cursor: "pointer", opacity: 0.7 }} onClick={() => removeLocation(loc)} />
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              {locationType !== "custom" && (
                <div style={{ color: "var(--vx-text-muted)", fontSize: 13, fontWeight: 600, display: "flex", alignItems: "center", gap: 8 }}>
                  <Globe size={14} />
                  Targeting {locationType === "worldwide" ? "all global regions" : "India — all states & territories"}
                </div>
              )}
            </div>

              {/* Language Preferences */}
              <div style={{ background: "var(--vx-bg-card)", border: "1px solid var(--vx-border)", borderRadius: 24, padding: "28px" }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 18 }}>
                  <div style={{ display: "flex", gap: 12, alignItems: "center" }}>
                    <Languages size={20} style={{ color: "#38bdf8" }} />
                    <h3 style={{ fontSize: 17, fontWeight: 800 }}>Ad Languages</h3>
                  </div>
                  <div style={{ fontSize: 11, color: "var(--vx-text-muted)", fontWeight: 600 }}>
                    {languages.filter(l => l.selected).length}/{languages.length} active
                  </div>
                </div>
                <div style={{ display: "flex", flexWrap: "wrap", gap: 8, marginBottom: 14 }}>
                  {languages.map(lang => (
                    <button
                      key={lang.id}
                      onClick={() => setLanguages(languages.map(l => l.id === lang.id ? { ...l, selected: !l.selected } : l))}
                      style={{
                        padding: "9px 20px", borderRadius: 99, cursor: "pointer",
                        border: `1px solid ${lang.selected ? "rgba(56,189,248,0.6)" : "var(--vx-border)"}`,
                        background: lang.selected ? "rgba(56,189,248,0.12)" : "var(--vx-bg-input)",
                        color: lang.selected ? "#38bdf8" : "var(--vx-text-muted)",
                        fontSize: 13, fontWeight: 700, transition: "all 0.2s",
                        boxShadow: lang.selected ? "0 0 10px rgba(56,189,248,0.18)" : "none",
                      }}
                    >
                      {lang.selected && <span style={{ marginRight: 5, fontSize: 10 }}>✓</span>}
                      {lang.name}
                    </button>
                  ))}
                </div>
                <p style={{ fontSize: 11, color: "var(--vx-text-muted)", lineHeight: 1.7, margin: 0 }}>
                  Ads will be served in selected languages based on viewer preferences and regional settings.
                </p>
              </div>
            </div>

            {/* Audience */}
            <div style={{ background: "var(--vx-bg-card)", border: "1px solid var(--vx-border)", borderRadius: 24, padding: "32px" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
                <div style={{ display: "flex", gap: 12, alignItems: "center" }}>
                  <Users size={22} style={{ color: "#a78bfa" }} />
                  <h3 style={{ fontSize: 18, fontWeight: 800 }}>Target Audience</h3>
                </div>
                {audiences.filter(a => a.selected).length > 0 && (
                  <div style={{ padding: "4px 12px", borderRadius: 99, background: "rgba(167,139,250,0.15)", border: "1px solid rgba(167,139,250,0.3)", fontSize: 11, fontWeight: 800, color: "#a78bfa", letterSpacing: "0.05em" }}>
                    {audiences.filter(a => a.selected).length} SELECTED
                  </div>
                )}
              </div>

              <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                {(() => {
                  const palette: Record<string, {color: string; bg: string; border: string}> = {
                    gaming:        { color: "#a78bfa", bg: "rgba(167,139,250,0.12)", border: "rgba(167,139,250,0.5)" },
                    travel:        { color: "#38bdf8", bg: "rgba(56,189,248,0.12)",  border: "rgba(56,189,248,0.5)"  },
                    business:      { color: "#4ade80", bg: "rgba(74,222,128,0.12)",  border: "rgba(74,222,128,0.5)"  },
                    shopping:      { color: "#fb923c", bg: "rgba(251,146,60,0.12)",  border: "rgba(251,146,60,0.5)"  },
                    students:      { color: "#f472b6", bg: "rgba(244,114,182,0.12)", border: "rgba(244,114,182,0.5)" },
                    fitness:       { color: "#34d399", bg: "rgba(52,211,153,0.12)",  border: "rgba(52,211,153,0.5)"  },
                    entertainment: { color: "#fbbf24", bg: "rgba(251,191,36,0.12)",  border: "rgba(251,191,36,0.5)"  },
                    tech:          { color: "#60a5fa", bg: "rgba(96,165,250,0.12)",  border: "rgba(96,165,250,0.5)"  },
                  };
                  const descriptions: Record<string, string> = {
                    gaming: "Gamers & esports fans",
                    travel: "Frequent travellers",
                    business: "Entrepreneurs & professionals",
                    shopping: "Online shoppers",
                    students: "College & school students",
                    fitness: "Health & gym enthusiasts",
                    entertainment: "Music, movies & content",
                    tech: "Early adopters & techies",
                  };
                  return audiences.map(aud => {
                    const p = palette[aud.id] ?? { color: "#a78bfa", bg: "rgba(167,139,250,0.12)", border: "rgba(167,139,250,0.4)" };
                    return (
                      <button
                        key={aud.id}
                        onClick={() => toggleAudience(aud.id)}
                        style={{
                          display: "flex", alignItems: "center", gap: 14,
                          padding: "12px 16px", borderRadius: 14, cursor: "pointer",
                          border: `1px solid ${aud.selected ? p.border : "var(--vx-border)"}`,
                          background: aud.selected ? p.bg : "var(--vx-bg-input)",
                          transition: "all 0.2s ease",
                          boxShadow: aud.selected ? `0 0 12px ${p.color}22` : "none",
                          textAlign: "left", width: "100%",
                        }}
                      >
                        {/* Icon pill */}
                        <div style={{
                          width: 38, height: 38, borderRadius: 12, flexShrink: 0,
                          background: aud.selected ? `${p.color}25` : "var(--vx-bg-card)",
                          border: `1px solid ${aud.selected ? p.border : "var(--vx-border)"}`,
                          display: "flex", alignItems: "center", justifyContent: "center",
                          fontSize: 18, transition: "all 0.2s",
                        }}>
                          {aud.icon}
                        </div>
                        {/* Text */}
                        <div style={{ flex: 1 }}>
                          <div style={{ fontSize: 13, fontWeight: 800, color: aud.selected ? p.color : "var(--vx-text-primary)", marginBottom: 1 }}>
                            {aud.name}
                          </div>
                          <div style={{ fontSize: 11, color: "var(--vx-text-muted)", fontWeight: 500 }}>
                            {descriptions[aud.id]}
                          </div>
                        </div>
                        {/* Check indicator */}
                        <div style={{
                          width: 20, height: 20, borderRadius: "50%", flexShrink: 0,
                          background: aud.selected ? p.color : "transparent",
                          border: `1.5px solid ${aud.selected ? p.color : "var(--vx-border)"}`,
                          display: "flex", alignItems: "center", justifyContent: "center",
                          transition: "all 0.2s",
                        }}>
                          {aud.selected && (
                            <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
                              <path d="M2 5l2.5 2.5L8 3" stroke="#000" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                            </svg>
                          )}
                        </div>
                      </button>
                    );
                  });
                })()}
              </div>
            </div>


          </div>

          {/* Action Footer */}
          <div style={{ background: "var(--vx-bg-card)", border: "1px solid var(--vx-border)", borderRadius: 32, padding: "40px", display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 32 }}>
            <div style={{ display: "flex", gap: 24, alignItems: "center" }}>
              <div style={{ width: 64, height: 64, borderRadius: 20, background: "rgba(167, 139, 250, 0.1)", border: "1px solid rgba(167, 139, 250, 0.2)", display: "flex", alignItems: "center", justifyContent: "center", color: "#a78bfa" }}>
                <Sparkles size={32} />
              </div>
              <div>
                <h4 style={{ fontSize: 18, fontWeight: 800, marginBottom: 4 }}>Daily Estimated Reach</h4>
                <div style={{ fontSize: 28, fontWeight: 800, color: "var(--vx-text-primary)" }}>
                  {estimatedReachBase.toLocaleString()} <span style={{ fontSize: 14, color: "var(--vx-text-muted)", fontWeight: 600 }}>People</span>
                </div>
              </div>
            </div>
            
            <button 
              onClick={handleContinueToPreview}
              style={{ padding: "18px 40px", borderRadius: 16, background: "var(--vx-text-primary)", color: "var(--vx-bg-primary)", border: "none", fontWeight: 800, fontSize: 16, cursor: "pointer", display: "flex", alignItems: "center", gap: 12, transition: "transform 0.2s" }}
              onMouseEnter={e => e.currentTarget.style.transform = "scale(1.02)"}
              onMouseLeave={e => e.currentTarget.style.transform = "scale(1)"}
            >
              Continue to Preview <ChevronRight size={20} />
            </button>
          </div>

        </div>

      </div>
    </motion.div>
  );
}
