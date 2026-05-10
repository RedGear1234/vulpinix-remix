import { API_BASE } from "../config/api";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router";
import { motion } from "framer-motion";
import {
  User, Mail, Phone, MapPin, Building2, Edit2, Save, X, Clock,
  CheckCircle2, TrendingUp, Eye, MousePointer, DollarSign, Calendar,
  Instagram, Facebook, Youtube, Linkedin, Twitter, Globe,
  Link as LinkIcon, Sparkles, AlertCircle, BarChart3, History, Camera, RefreshCw
} from "lucide-react";
import { toast } from "sonner";

const PROFILE_STYLES = `
  .vxp-page    { background: var(--vx-bg-primary); min-height: 100vh; position: relative; z-index: 1; font-family: var(--inter,'Inter',sans-serif); }
  .vxp-inner   { position: relative; z-index: 10; max-width: 1280px; margin: 0 auto; padding: 60px 24px 100px; }
  .vxp-header  { display: flex; align-items: center; gap: 24px; margin-bottom: 40px; flex-wrap: wrap; }
  .vxp-grid    { display: grid; grid-template-columns: repeat(auto-fit, minmax(350px, 1fr)); gap: 32px; align-items: start; }
  .vxp-card    { background: var(--vx-bg-card); border: 1px solid var(--vx-border); border-radius: 24px; padding: 32px; box-shadow: var(--vx-shadow-card); }
  .vxp-stats4  { display: grid; grid-template-columns: repeat(4, 1fr); gap: 12px; background: var(--vx-bg-card); border: 1px solid var(--vx-border); border-radius: 12px; padding: 16px; }

  /* ── Tablet (768–1024px) ── */
  @media (min-width: 768px) and (max-width: 1024px) {
    .vxp-grid  { grid-template-columns: 1fr; }
    .vxp-inner { padding: 60px 20px 80px; }
  }

  /* ── Mobile + Tablet (≤ 767px) ── */
  @media (max-width: 767px) {
    .vxp-inner  { padding: 72px 16px 80px; }
    .vxp-grid   { grid-template-columns: 1fr !important; gap: 20px; }
    .vxp-header { gap: 16px; margin-bottom: 28px; }
    .vxp-card   { padding: 22px 18px; border-radius: 20px; }
    .vxp-stats4 { grid-template-columns: repeat(2, 1fr) !important; gap: 10px; }
  }

  /* ── XS — Small phones (≤ 480px) ── */
  @media (max-width: 480px) {
    .vxp-inner  { padding: 80px 12px 72px; }
    .vxp-header { flex-direction: row; align-items: center; gap: 12px; }
    .vxp-card   { padding: 18px 14px; border-radius: 16px; }
    .vxp-stats4 { grid-template-columns: repeat(2, 1fr) !important; gap: 8px; padding: 12px; }
  }
`;

interface UserInfo {
  name: string;
  email: string;
  phone: string;
  company: string;
  location: string;
  website: string;
  picture?: string;
}

interface SocialLinks {
  instagram: string;
  facebook: string;
  youtube: string;
  twitter: string;
  linkedin: string;
}

interface Ad {
  id: string;
  name: string;
  platforms: string[];
  budget: string;
  status: "review" | "active" | "completed" | "paused" | "rejected";
  createdAt: string;
  reach?: string;
  clicks?: string;
  impressions?: string;
  spent?: string;
}

export default function ProfilePage() {
  const navigate = useNavigate();
  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const [isEditingSocial, setIsEditingSocial] = useState(false);
  const [profilePicture, setProfilePicture] = useState<string | null>(null);

  // Load saved user data from localStorage
  const savedUserInfo = localStorage.getItem("userInfo");
  const savedSocialLinks = localStorage.getItem("socialLinks");
  const savedCampaigns = localStorage.getItem("userCampaigns");

  // User Info State
  const [userInfo, setUserInfo] = useState<UserInfo>(() => {
    if (savedUserInfo) {
      const parsed = JSON.parse(savedUserInfo);
      setProfilePicture(parsed.picture || null);
      return parsed;
    }
    return { name: "", email: "", phone: "", company: "", location: "", website: "", picture: "" };
  });

  // Social Media Links State
  const [socialLinks, setSocialLinks] = useState<SocialLinks>(
    savedSocialLinks ? JSON.parse(savedSocialLinks) : {
      instagram: "", facebook: "", youtube: "", twitter: "", linkedin: ""
    }
  );

  // Campaigns State
  const [adsInReview, setAdsInReview] = useState<Ad[]>([]);
  const [previousAds, setPreviousAds] = useState<Ad[]>([]);
  const [isLoadingCampaigns, setIsLoadingCampaigns] = useState(false);

  // Fetch campaigns from backend
  const fetchCampaigns = async () => {
    const authToken = localStorage.getItem("authToken");
    if (!authToken) return;

    setIsLoadingCampaigns(true);
    try {
      const response = await fetch("${API_BASE}/api/campaign/my-campaigns", {
        headers: { "Authorization": `Bearer ${authToken}` }
      });
      const data = await response.json();
      
      if (data.success && data.campaigns) {
        console.log("Fetched campaigns:", data.campaigns);
        toast.info(`Synced ${data.campaigns.length} campaigns from cloud.`);
        
        const normalized = data.campaigns.map((c: any) => ({
          id: c.id,
          name: c.name,
          platforms: c.platforms,
          budget: c.budget,
          status: c.status === "pending" || c.status === "in_review" ? "review" : 
                  c.status === "approved" || c.status === "running" ? "active" : 
                  c.status === "completed" ? "completed" : 
                  c.status === "rejected" ? "rejected" : "paused",
          createdAt: c.dateSubmitted,
          reach: c.analytics?.reach?.toLocaleString() || "0",
          clicks: c.analytics?.clicks?.toLocaleString() || "0",
          impressions: c.analytics?.impressions?.toLocaleString() || "0",
          spent: `₹${c.analytics?.adSpend?.toLocaleString() || "0"}`
        }));

        setAdsInReview(normalized.filter((a: any) => a.status === "review"));
        setPreviousAds(normalized.filter((a: any) => a.status !== "review"));
      } else {
        console.log("API response success but no campaigns or failure:", data);
      }
    } catch (err) {
      console.error("Failed to fetch campaigns:", err);
      // Fallback to localStorage if API fails
      const saved = localStorage.getItem("userCampaigns");
      if (saved) {
        const parsed = JSON.parse(saved);
        setAdsInReview(parsed.inReview || []);
        setPreviousAds(parsed.history || []);
      }
    } finally {
      setIsLoadingCampaigns(false);
    }
  };

  useEffect(() => {
    fetchCampaigns();
  }, []);

  // Temporary states for editing
  const [tempUserInfo, setTempUserInfo] = useState<UserInfo>(userInfo);
  const [tempSocialLinks, setTempSocialLinks] = useState<SocialLinks>(socialLinks);

  const handleSaveProfile = () => {
    setUserInfo(tempUserInfo);
    localStorage.setItem("userInfo", JSON.stringify(tempUserInfo));
    setIsEditingProfile(false);
    toast.success("Profile Updated Successfully!");
  };

  const handleCancelProfile = () => {
    setTempUserInfo(userInfo);
    setIsEditingProfile(false);
  };

  const handleSaveSocial = () => {
    setSocialLinks(tempSocialLinks);
    localStorage.setItem("socialLinks", JSON.stringify(tempSocialLinks));
    setIsEditingSocial(false);
    toast.success("Social Links Updated!");
  };

  const handleCancelSocial = () => {
    setTempSocialLinks(socialLinks);
    setIsEditingSocial(false);
  };

  const handleCreateCampaign = () => {
    const isAuthenticated = localStorage.getItem("isAuthenticated");
    if (!isAuthenticated || isAuthenticated !== "true") {
      toast.error("Authentication Required");
      navigate("/auth");
      return;
    }
    if (!userInfo.name || !userInfo.email) {
      toast.error("Profile Incomplete");
      setIsEditingProfile(true);
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }
    navigate("/upload");
  };

  const getStatusBadge = (status: Ad["status"]) => {
    switch (status) {
      case "review": return <span style={{ padding: "4px 12px", borderRadius: 20, background: "rgba(234, 179, 8, 0.1)", border: "1px solid rgba(234, 179, 8, 0.2)", color: "#eab308", fontSize: 11, fontWeight: 700, display: "flex", alignItems: "center", gap: 4 }}><Clock size={12} /> In Review</span>;
      case "active": return <span style={{ padding: "4px 12px", borderRadius: 20, background: "rgba(34, 197, 94, 0.1)", border: "1px solid rgba(34, 197, 94, 0.2)", color: "#22c55e", fontSize: 11, fontWeight: 700, display: "flex", alignItems: "center", gap: 4 }}><CheckCircle2 size={12} /> Active</span>;
      case "completed": return <span style={{ padding: "4px 12px", borderRadius: 20, background: "rgba(56, 189, 248, 0.1)", border: "1px solid rgba(56, 189, 248, 0.2)", color: "#38bdf8", fontSize: 11, fontWeight: 700, display: "flex", alignItems: "center", gap: 4 }}><CheckCircle2 size={12} /> Completed</span>;
      case "paused": return <span style={{ padding: "4px 12px", borderRadius: 20, background: "rgba(156, 163, 175, 0.1)", border: "1px solid rgba(156, 163, 175, 0.2)", color: "#9ca3af", fontSize: 11, fontWeight: 700, display: "flex", alignItems: "center", gap: 4 }}><AlertCircle size={12} /> Paused</span>;
      case "rejected": return <span style={{ padding: "4px 12px", borderRadius: 20, background: "rgba(239, 68, 68, 0.1)", border: "1px solid rgba(239, 68, 68, 0.2)", color: "#ef4444", fontSize: 11, fontWeight: 700, display: "flex", alignItems: "center", gap: 4 }}><X size={12} /> Rejected</span>;
    }
  };

  const getPlatformIcon = (platform: string) => {
    switch (platform.toLowerCase()) {
      case "instagram": return <Instagram size={14} />;
      case "facebook": return <Facebook size={14} />;
      case "youtube": return <Youtube size={14} />;
      case "twitter": return <Twitter size={14} />;
      case "linkedin": return <Linkedin size={14} />;
      default: return <Globe size={14} />;
    }
  };

  const handleProfilePictureUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        toast.error("Image too large");
        return;
      }
      const reader = new FileReader();
      reader.onloadend = () => {
        const imageData = reader.result as string;
        setProfilePicture(imageData);
        const updatedUserInfo = { ...userInfo, picture: imageData };
        setUserInfo(updatedUserInfo);
        setTempUserInfo(updatedUserInfo);
        localStorage.setItem("userInfo", JSON.stringify(updatedUserInfo));
        toast.success("Profile Picture Updated!");
      };
      reader.readAsDataURL(file);
    }
  };

  const getUserInitials = () => {
    if (!userInfo?.name) return "U";
    const names = userInfo.name.split(" ");
    if (names.length >= 2) return `${names[0][0]}${names[1][0]}`.toUpperCase();
    return userInfo.name[0].toUpperCase();
  };

  const inputStyle = { width: "100%", padding: "12px 16px", borderRadius: 12, background: "var(--vx-bg-input)", border: "1px solid var(--vx-border)", color: "var(--vx-text-primary)", fontSize: 14, outline: "none", marginTop: 8 };
  const labelStyle = { display: "block", fontSize: 11, fontWeight: 700, color: "var(--vx-text-muted)", textTransform: "uppercase", letterSpacing: "0.05em" } as const;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.5, ease: "easeInOut" }}
      className="vxp-page"
    >
      <style dangerouslySetInnerHTML={{ __html: PROFILE_STYLES }} />
      <div className="vxp-inner">
        
        {/* Back Button */}
        <button
          onClick={() => navigate("/")}
          style={{ display: "inline-flex", alignItems: "center", gap: 8, background: "none", border: "none", color: "var(--vx-text-muted)", fontSize: 14, fontWeight: 600, cursor: "pointer", marginBottom: 40, transition: "color 0.2s" }}
          onMouseEnter={e => e.currentTarget.style.color = "var(--vx-text-primary)"}
          onMouseLeave={e => e.currentTarget.style.color = "var(--vx-text-muted)"}
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M19 12H5M12 5l-7 7 7 7"/></svg>
          Back to Dashboard
        </button>

        {/* Profile Header */}
        <div className="vxp-header">
          <div style={{ position: "relative" }}>
            <div style={{ width: 100, height: 100, borderRadius: "50%", background: "var(--vx-bg-card)", border: "2px solid var(--vx-border)", overflow: "hidden", display: "flex", alignItems: "center", justifyContent: "center" }}>
              {profilePicture ? (
                <img src={profilePicture} alt="Profile" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
              ) : (
                <div style={{ fontSize: 32, fontWeight: 800, color: "var(--vx-text-primary)" }}>{getUserInitials()}</div>
              )}
            </div>
            <label htmlFor="profile-upload" style={{ position: "absolute", bottom: 0, right: 0, width: 32, height: 32, borderRadius: "50%", background: "linear-gradient(135deg, #a78bfa, #38bdf8)", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", color: "#fff", boxShadow: "0 4px 12px rgba(0,0,0,0.3)", border: "2px solid var(--vx-bg-primary)" }}>
              <Camera size={14} />
            </label>
            <input id="profile-upload" type="file" accept="image/*" onChange={handleProfilePictureUpload} style={{ display: "none" }} />
          </div>
          <div>
            <h1 style={{ fontSize: "clamp(2rem, 4vw, 2.5rem)", fontWeight: 800, color: "var(--vx-text-primary)", marginBottom: 8, letterSpacing: "-0.02em" }}>My Profile</h1>
            <p style={{ fontSize: 16, color: "var(--vx-text-secondary)" }}>Manage your account and active campaigns.</p>
          </div>
        </div>

        {/* Grid Layout */}
        <div className="vxp-grid">
          
          {/* LEFT COLUMN */}
          <div style={{ display: "flex", flexDirection: "column", gap: 32 }}>
            
            {/* Personal Info */}
            <div className="vxp-card">
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 24 }}>
                <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                  <div style={{ width: 36, height: 36, borderRadius: 10, background: "rgba(167, 139, 250, 0.15)", border: "1px solid rgba(167, 139, 250, 0.3)", display: "flex", alignItems: "center", justifyContent: "center", color: "#a78bfa" }}>
                    <User size={18} />
                  </div>
                  <h3 style={{ fontSize: 16, fontWeight: 700, color: "var(--vx-text-primary)" }}>Personal Information</h3>
                </div>
                {!isEditingProfile ? (
                  <button onClick={() => setIsEditingProfile(true)} style={{ display: "flex", alignItems: "center", gap: 6, background: "var(--vx-bg-input)", border: "1px solid var(--vx-border)", color: "var(--vx-text-primary)", padding: "6px 12px", borderRadius: 12, fontSize: 12, fontWeight: 600, cursor: "pointer" }}><Edit2 size={12} /> Edit</button>
                ) : (
                  <div style={{ display: "flex", gap: 8 }}>
                    <button onClick={handleCancelProfile} style={{ display: "flex", alignItems: "center", justifyContent: "center", width: 32, height: 32, background: "var(--vx-bg-input)", border: "1px solid var(--vx-border)", color: "var(--vx-text-primary)", borderRadius: 12, cursor: "pointer" }}><X size={14} /></button>
                    <button onClick={handleSaveProfile} style={{ display: "flex", alignItems: "center", gap: 6, background: "var(--vx-text-primary)", color: "var(--vx-bg-primary)", padding: "6px 16px", borderRadius: 12, fontSize: 13, fontWeight: 700, border: "none", cursor: "pointer" }}><Save size={14} /> Save</button>
                  </div>
                )}
              </div>

              <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
                {isEditingProfile ? (
                  <>
                    <div><label style={labelStyle}>Full Name</label><input style={inputStyle} value={tempUserInfo.name} onChange={e => setTempUserInfo({...tempUserInfo, name: e.target.value})} /></div>
                    <div><label style={labelStyle}>Email</label><input style={inputStyle} value={tempUserInfo.email} onChange={e => setTempUserInfo({...tempUserInfo, email: e.target.value})} /></div>
                    <div><label style={labelStyle}>Phone</label><input style={inputStyle} value={tempUserInfo.phone} onChange={e => setTempUserInfo({...tempUserInfo, phone: e.target.value})} /></div>
                    <div><label style={labelStyle}>Company</label><input style={inputStyle} value={tempUserInfo.company} onChange={e => setTempUserInfo({...tempUserInfo, company: e.target.value})} /></div>
                    <div><label style={labelStyle}>Location</label><input style={inputStyle} value={tempUserInfo.location} onChange={e => setTempUserInfo({...tempUserInfo, location: e.target.value})} /></div>
                    <div><label style={labelStyle}>Website</label><input style={inputStyle} value={tempUserInfo.website} onChange={e => setTempUserInfo({...tempUserInfo, website: e.target.value})} /></div>
                  </>
                ) : (
                  <>
                    {[
                      { icon: <User size={16}/>, label: "Name", val: userInfo.name },
                      { icon: <Mail size={16}/>, label: "Email", val: userInfo.email },
                      { icon: <Phone size={16}/>, label: "Phone", val: userInfo.phone },
                      { icon: <Building2 size={16}/>, label: "Company", val: userInfo.company },
                      { icon: <MapPin size={16}/>, label: "Location", val: userInfo.location },
                      { icon: <Globe size={16}/>, label: "Website", val: userInfo.website }
                    ].map((item, i) => (
                      <div key={i} style={{ display: "flex", alignItems: "center", gap: 16, padding: "12px 16px", background: "var(--vx-bg-input)", border: "1px solid var(--vx-border)", borderRadius: 16 }}>
                        <div style={{ color: "var(--vx-text-muted)" }}>{item.icon}</div>
                        <div>
                          <div style={{ fontSize: 11, fontWeight: 700, color: "var(--vx-text-muted)", textTransform: "uppercase", marginBottom: 2 }}>{item.label}</div>
                          <div style={{ fontSize: 14, color: "var(--vx-text-primary)", fontWeight: 500 }}>{item.val || "Not set"}</div>
                        </div>
                      </div>
                    ))}
                  </>
                )}
              </div>
            </div>

            {/* Social Links */}
            <div className="vxp-card">
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 24 }}>
                <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                  <div style={{ width: 36, height: 36, borderRadius: 10, background: "rgba(56, 189, 248, 0.15)", border: "1px solid rgba(56, 189, 248, 0.3)", display: "flex", alignItems: "center", justifyContent: "center", color: "#38bdf8" }}>
                    <LinkIcon size={18} />
                  </div>
                  <h3 style={{ fontSize: 16, fontWeight: 700, color: "var(--vx-text-primary)" }}>Social Links</h3>
                </div>
                {!isEditingSocial ? (
                  <button onClick={() => setIsEditingSocial(true)} style={{ display: "flex", alignItems: "center", gap: 6, background: "var(--vx-bg-input)", border: "1px solid var(--vx-border)", color: "var(--vx-text-primary)", padding: "6px 12px", borderRadius: 12, fontSize: 12, fontWeight: 600, cursor: "pointer" }}><Edit2 size={12} /> Edit</button>
                ) : (
                  <div style={{ display: "flex", gap: 8 }}>
                    <button onClick={handleCancelSocial} style={{ display: "flex", alignItems: "center", justifyContent: "center", width: 32, height: 32, background: "var(--vx-bg-input)", border: "1px solid var(--vx-border)", color: "var(--vx-text-primary)", borderRadius: 12, cursor: "pointer" }}><X size={14} /></button>
                    <button onClick={handleSaveSocial} style={{ display: "flex", alignItems: "center", gap: 6, background: "var(--vx-text-primary)", color: "var(--vx-bg-primary)", padding: "6px 16px", borderRadius: 12, fontSize: 13, fontWeight: 700, border: "none", cursor: "pointer" }}><Save size={14} /> Save</button>
                  </div>
                )}
              </div>

              <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
                {isEditingSocial ? (
                  <>
                    <div><label style={labelStyle}>Instagram</label><input style={inputStyle} value={tempSocialLinks.instagram} onChange={e => setTempSocialLinks({...tempSocialLinks, instagram: e.target.value})} placeholder="https://instagram.com/..." /></div>
                    <div><label style={labelStyle}>Facebook</label><input style={inputStyle} value={tempSocialLinks.facebook} onChange={e => setTempSocialLinks({...tempSocialLinks, facebook: e.target.value})} placeholder="https://facebook.com/..." /></div>
                    <div><label style={labelStyle}>YouTube</label><input style={inputStyle} value={tempSocialLinks.youtube} onChange={e => setTempSocialLinks({...tempSocialLinks, youtube: e.target.value})} placeholder="https://youtube.com/..." /></div>
                    <div><label style={labelStyle}>Twitter</label><input style={inputStyle} value={tempSocialLinks.twitter} onChange={e => setTempSocialLinks({...tempSocialLinks, twitter: e.target.value})} placeholder="https://twitter.com/..." /></div>
                    <div><label style={labelStyle}>LinkedIn</label><input style={inputStyle} value={tempSocialLinks.linkedin} onChange={e => setTempSocialLinks({...tempSocialLinks, linkedin: e.target.value})} placeholder="https://linkedin.com/in/..." /></div>
                  </>
                ) : (
                  <>
                    {Object.entries(socialLinks).map(([key, val]) => {
                      if (!val) return null;
                      return (
                        <div key={key} style={{ display: "flex", alignItems: "center", gap: 16, padding: "12px 16px", background: "var(--vx-bg-input)", border: "1px solid var(--vx-border)", borderRadius: 16 }}>
                          <div style={{ color: "var(--vx-text-muted)" }}>{getPlatformIcon(key)}</div>
                          <div style={{ overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", flex: 1 }}>
                            <div style={{ fontSize: 11, fontWeight: 700, color: "var(--vx-text-muted)", textTransform: "uppercase", marginBottom: 2 }}>{key}</div>
                            <a href={val} target="_blank" rel="noreferrer" style={{ fontSize: 14, color: "var(--vx-text-primary)", fontWeight: 500, textDecoration: "none" }}>{val}</a>
                          </div>
                        </div>
                      );
                    })}
                    {Object.values(socialLinks).every(v => !v) && (
                      <div style={{ textAlign: "center", padding: "32px 0", color: "var(--vx-text-muted)", fontSize: 14 }}>No social links added yet.</div>
                    )}
                  </>
                )}
              </div>
            </div>
          </div>

          {/* RIGHT COLUMN */}
          <div style={{ display: "flex", flexDirection: "column", gap: 32 }}>
            
            {/* Quick Action */}
            <button
              onClick={handleCreateCampaign}
              style={{ width: "100%", padding: "24px", borderRadius: 24, background: "linear-gradient(135deg, #a78bfa, #38bdf8)", color: "#fff", border: "none", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", gap: 12, fontSize: 16, fontWeight: 700, transition: "transform 0.2s", boxShadow: "0 10px 30px rgba(167, 139, 250, 0.3)" }}
              onMouseEnter={e => e.currentTarget.style.transform = "translateY(-2px)"}
              onMouseLeave={e => e.currentTarget.style.transform = "translateY(0)"}
            >
              <Sparkles size={20} /> Create New Campaign
            </button>

            {/* Ads in Review */}
            <div className="vxp-card">
              <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 24 }}>
                <div style={{ width: 36, height: 36, borderRadius: 10, background: "rgba(234, 179, 8, 0.15)", border: "1px solid rgba(234, 179, 8, 0.3)", display: "flex", alignItems: "center", justifyContent: "center", color: "#eab308" }}>
                  <Clock size={18} />
                </div>
                <h3 style={{ fontSize: 16, fontWeight: 700, color: "var(--vx-text-primary)", flex: 1 }}>Ads in Review</h3>
                <button 
                  onClick={fetchCampaigns} 
                  disabled={isLoadingCampaigns}
                  style={{ 
                    display: "flex", alignItems: "center", gap: 6, background: "var(--vx-bg-input)", 
                    border: "1px solid var(--vx-border)", color: "var(--vx-text-primary)", 
                    padding: "6px 12px", borderRadius: 12, fontSize: 12, fontWeight: 600, cursor: "pointer" 
                  }}
                >
                  <motion.div
                    animate={isLoadingCampaigns ? { rotate: 360 } : { rotate: 0 }}
                    transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                    style={{ display: "flex", alignItems: "center", justifyContent: "center" }}
                  >
                    <RefreshCw size={12} />
                  </motion.div>
                  {isLoadingCampaigns ? "Syncing..." : "Sync Now"}
                </button>
                <span style={{ padding: "4px 12px", borderRadius: 20, background: "var(--vx-bg-input)", border: "1px solid var(--vx-border)", color: "var(--vx-text-primary)", fontSize: 12, fontWeight: 700 }}>{adsInReview.length}</span>
              </div>
              
              {adsInReview.length === 0 ? (
                <div style={{ textAlign: "center", padding: "40px 0", color: "var(--vx-text-muted)" }}>
                  <Clock size={40} style={{ margin: "0 auto 16px", opacity: 0.5 }} />
                  <div style={{ fontSize: 14 }}>No ads currently in review</div>
                </div>
              ) : (
                <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
                  {adsInReview.map(ad => (
                    <div key={ad.id} style={{ background: "var(--vx-bg-input)", border: "1px solid var(--vx-border)", borderRadius: 16, padding: 20 }}>
                      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 16 }}>
                        <div>
                          <div style={{ fontSize: 15, fontWeight: 700, color: "var(--vx-text-primary)", marginBottom: 4 }}>{ad.name}</div>
                          <div style={{ fontSize: 12, color: "var(--vx-text-muted)", display: "flex", alignItems: "center", gap: 4 }}><Calendar size={12}/> {new Date(ad.createdAt).toLocaleDateString()}</div>
                        </div>
                        {getStatusBadge(ad.status)}
                      </div>
                      <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginBottom: 16 }}>
                        {ad.platforms.map(p => (
                          <span key={p} style={{ padding: "4px 10px", borderRadius: 20, background: "var(--vx-bg-card)", border: "1px solid var(--vx-border)", fontSize: 11, fontWeight: 600, color: "var(--vx-text-primary)", display: "flex", alignItems: "center", gap: 4 }}>
                            {getPlatformIcon(p)} {p}
                          </span>
                        ))}
                      </div>
                      <div style={{ borderTop: "1px solid var(--vx-border)", paddingTop: 16, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                        <div style={{ fontSize: 14, fontWeight: 700, color: "var(--vx-text-primary)", display: "flex", alignItems: "center", gap: 4 }}><DollarSign size={14} color="#06d6c7"/> {ad.budget}</div>
                        <div style={{ fontSize: 12, fontWeight: 600, color: "#eab308", display: "flex", alignItems: "center", gap: 4 }}><AlertCircle size={12}/> Waiting for approval</div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Campaign History */}
            <div className="vxp-card">
              <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 24 }}>
                <div style={{ width: 36, height: 36, borderRadius: 10, background: "rgba(56, 189, 248, 0.15)", border: "1px solid rgba(56, 189, 248, 0.3)", display: "flex", alignItems: "center", justifyContent: "center", color: "#38bdf8" }}>
                  <History size={18} />
                </div>
                <h3 style={{ fontSize: 16, fontWeight: 700, color: "var(--vx-text-primary)", flex: 1 }}>Campaign History</h3>
                <button 
                  onClick={fetchCampaigns} 
                  disabled={isLoadingCampaigns}
                  style={{ 
                    display: "flex", alignItems: "center", gap: 6, background: "var(--vx-bg-input)", 
                    border: "1px solid var(--vx-border)", color: "var(--vx-text-primary)", 
                    padding: "6px 12px", borderRadius: 12, fontSize: 12, fontWeight: 600, cursor: "pointer" 
                  }}
                >
                  <motion.div
                    animate={isLoadingCampaigns ? { rotate: 360 } : { rotate: 0 }}
                    transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                    style={{ display: "flex", alignItems: "center", justifyContent: "center" }}
                  >
                    <RefreshCw size={12} />
                  </motion.div>
                  {isLoadingCampaigns ? "Syncing..." : "Sync Now"}
                </button>
                <span style={{ padding: "4px 12px", borderRadius: 20, background: "var(--vx-bg-input)", border: "1px solid var(--vx-border)", color: "var(--vx-text-primary)", fontSize: 12, fontWeight: 700 }}>{previousAds.length}</span>
              </div>
              
              {previousAds.length === 0 ? (
                <div style={{ textAlign: "center", padding: "40px 0", color: "var(--vx-text-muted)" }}>
                  <BarChart3 size={40} style={{ margin: "0 auto 16px", opacity: 0.5 }} />
                  <div style={{ fontSize: 14 }}>No campaign history yet</div>
                </div>
              ) : (
                <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
                  {previousAds.map(ad => (
                    <div key={ad.id} style={{ background: "var(--vx-bg-input)", border: "1px solid var(--vx-border)", borderRadius: 16, padding: 20 }}>
                      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 16 }}>
                        <div>
                          <div style={{ fontSize: 15, fontWeight: 700, color: "var(--vx-text-primary)", marginBottom: 4 }}>{ad.name}</div>
                          <div style={{ fontSize: 12, color: "var(--vx-text-muted)", display: "flex", alignItems: "center", gap: 4 }}><Calendar size={12}/> {new Date(ad.createdAt).toLocaleDateString()}</div>
                        </div>
                        {getStatusBadge(ad.status)}
                      </div>
                      <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginBottom: 16 }}>
                        {ad.platforms.map(p => (
                          <span key={p} style={{ padding: "4px 10px", borderRadius: 20, background: "var(--vx-bg-card)", border: "1px solid var(--vx-border)", fontSize: 11, fontWeight: 600, color: "var(--vx-text-primary)", display: "flex", alignItems: "center", gap: 4 }}>
                            {getPlatformIcon(p)} {p}
                          </span>
                        ))}
                      </div>
                      
                      {/* Stats Grid */}
                      <div className="vxp-stats4">
                        <div>
                          <div style={{ fontSize: 10, fontWeight: 700, color: "var(--vx-text-muted)", textTransform: "uppercase", marginBottom: 4, display: "flex", alignItems: "center", gap: 4 }}><Eye size={10} color="#a78bfa"/> Reach</div>
                          <div style={{ fontSize: 13, fontWeight: 600, color: "var(--vx-text-primary)" }}>{ad.reach}</div>
                        </div>
                        <div>
                          <div style={{ fontSize: 10, fontWeight: 700, color: "var(--vx-text-muted)", textTransform: "uppercase", marginBottom: 4, display: "flex", alignItems: "center", gap: 4 }}><MousePointer size={10} color="#06d6c7"/> Clicks</div>
                          <div style={{ fontSize: 13, fontWeight: 600, color: "var(--vx-text-primary)" }}>{ad.clicks}</div>
                        </div>
                        <div>
                          <div style={{ fontSize: 10, fontWeight: 700, color: "var(--vx-text-muted)", textTransform: "uppercase", marginBottom: 4, display: "flex", alignItems: "center", gap: 4 }}><TrendingUp size={10} color="#38bdf8"/> Impr.</div>
                          <div style={{ fontSize: 13, fontWeight: 600, color: "var(--vx-text-primary)" }}>{ad.impressions}</div>
                        </div>
                        <div>
                          <div style={{ fontSize: 10, fontWeight: 700, color: "var(--vx-text-muted)", textTransform: "uppercase", marginBottom: 4, display: "flex", alignItems: "center", gap: 4 }}><DollarSign size={10} color="#22c55e"/> Spent</div>
                          <div style={{ fontSize: 13, fontWeight: 600, color: "var(--vx-text-primary)" }}>{ad.spent}</div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

          </div>
        </div>
      </div>
    </motion.div>
  );
}
