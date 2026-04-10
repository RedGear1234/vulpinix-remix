import { useState } from "react";
import { useNavigate } from "react-router";
import { motion } from "motion/react";
import {
  ArrowLeft,
  User,
  Mail,
  Phone,
  MapPin,
  Building2,
  Edit2,
  Save,
  X,
  Clock,
  CheckCircle2,
  TrendingUp,
  Eye,
  MousePointer,
  DollarSign,
  Calendar,
  Instagram,
  Facebook,
  Youtube,
  Linkedin,
  Twitter,
  Globe,
  Link as LinkIcon,
  Sparkles,
  AlertCircle,
  BarChart3,
  History,
  LogOut,
  Camera,
  Upload
} from "lucide-react";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import { toast } from "sonner@2.0.3";

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
  status: "review" | "active" | "completed" | "paused";
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
    return {
      name: "",
      email: "",
      phone: "",
      company: "",
      location: "",
      website: "",
      picture: ""
    };
  });

  // Social Media Links State
  const [socialLinks, setSocialLinks] = useState<SocialLinks>(
    savedSocialLinks ? JSON.parse(savedSocialLinks) : {
      instagram: "",
      facebook: "",
      youtube: "",
      twitter: "",
      linkedin: ""
    }
  );

  // Load campaigns from localStorage
  const campaigns = savedCampaigns ? JSON.parse(savedCampaigns) : { inReview: [], history: [] };
  const adsInReview: Ad[] = campaigns.inReview || [];
  const previousAds: Ad[] = campaigns.history || [];

  // Temporary states for editing
  const [tempUserInfo, setTempUserInfo] = useState<UserInfo>(userInfo);
  const [tempSocialLinks, setTempSocialLinks] = useState<SocialLinks>(socialLinks);

  const handleSaveProfile = () => {
    setUserInfo(tempUserInfo);
    localStorage.setItem("userInfo", JSON.stringify(tempUserInfo));
    setIsEditingProfile(false);
    toast.success("Profile Updated Successfully!", {
      description: "Your personal information has been saved.",
    });
  };

  const handleCancelProfile = () => {
    setTempUserInfo(userInfo);
    setIsEditingProfile(false);
  };

  const handleSaveSocial = () => {
    setSocialLinks(tempSocialLinks);
    localStorage.setItem("socialLinks", JSON.stringify(tempSocialLinks));
    setIsEditingSocial(false);
    toast.success("Social Links Updated!", {
      description: "Your social media links have been saved.",
    });
  };

  const handleCancelSocial = () => {
    setTempSocialLinks(socialLinks);
    setIsEditingSocial(false);
  };

  // Validation for Create New Campaign
  const handleCreateCampaign = () => {
    // Check if user is authenticated
    const isAuthenticated = localStorage.getItem("isAuthenticated");
    
    if (!isAuthenticated || isAuthenticated !== "true") {
      toast.error("Authentication Required", {
        description: "Please login with Google, Apple, or fill in your details to continue.",
        duration: 4000,
      });
      navigate("/auth");
      return;
    }

    // Check if user has filled basic information
    if (!userInfo.name || !userInfo.email) {
      toast.error("Profile Incomplete", {
        description: "Please complete your profile (Name and Email required) before creating a campaign.",
        duration: 4000,
      });
      setIsEditingProfile(true);
      // Scroll to profile section
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }

    // All validation passed, proceed to upload page
    navigate("/upload");
  };

  const getStatusBadge = (status: Ad["status"]) => {
    switch (status) {
      case "review":
        return (
          <span className="px-3 py-1 rounded-full bg-yellow-500/20 border border-yellow-400/50 text-yellow-400 text-xs flex items-center gap-1">
            <Clock className="w-3 h-3" />
            In Review
          </span>
        );
      case "active":
        return (
          <span className="px-3 py-1 rounded-full bg-green-500/20 border border-green-400/50 text-green-400 text-xs flex items-center gap-1">
            <CheckCircle2 className="w-3 h-3" />
            Active
          </span>
        );
      case "completed":
        return (
          <span className="px-3 py-1 rounded-full bg-blue-500/20 border border-blue-400/50 text-blue-400 text-xs flex items-center gap-1">
            <CheckCircle2 className="w-3 h-3" />
            Completed
          </span>
        );
      case "paused":
        return (
          <span className="px-3 py-1 rounded-full bg-gray-500/20 border border-gray-400/50 text-gray-400 text-xs flex items-center gap-1">
            <AlertCircle className="w-3 h-3" />
            Paused
          </span>
        );
    }
  };

  const getPlatformIcon = (platform: string) => {
    switch (platform.toLowerCase()) {
      case "instagram":
        return <Instagram className="w-4 h-4" />;
      case "facebook":
        return <Facebook className="w-4 h-4" />;
      case "youtube":
        return <Youtube className="w-4 h-4" />;
      case "twitter":
        return <Twitter className="w-4 h-4" />;
      case "linkedin":
        return <Linkedin className="w-4 h-4" />;
      default:
        return <Globe className="w-4 h-4" />;
    }
  };

  // Handle profile picture upload
  const handleProfilePictureUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) { // 5MB limit
        toast.error("Image too large", {
          description: "Please select an image under 5MB",
        });
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
        toast.success("Profile Picture Updated!", {
          description: "Your profile picture has been changed successfully.",
        });
      };
      reader.readAsDataURL(file);
    }
  };

  // Get user initials for fallback
  const getUserInitials = () => {
    if (!userInfo?.name) return "U";
    const names = userInfo.name.split(" ");
    if (names.length >= 2) {
      return `${names[0][0]}${names[1][0]}`.toUpperCase();
    }
    return userInfo.name[0].toUpperCase();
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
            <pattern id="circuit-profile" x="0" y="0" width="100" height="100" patternUnits="userSpaceOnUse">
              <circle cx="50" cy="50" r="2" fill="#00ffff" />
              <line x1="50" y1="50" x2="100" y2="50" stroke="#00ffff" strokeWidth="0.5" />
              <line x1="50" y1="50" x2="50" y2="0" stroke="#00ffff" strokeWidth="0.5" />
              <circle cx="0" cy="50" r="2" fill="#a855f7" />
              <circle cx="50" cy="0" r="2" fill="#3b82f6" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#circuit-profile)" />
        </svg>
      </div>

      {/* Content */}
      <div className="relative z-10 min-h-screen px-4 sm:px-6 lg:px-8 py-8">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="mb-8">
            <Button
              variant="ghost"
              onClick={() => navigate("/")}
              className="text-cyan-400 hover:text-cyan-300 hover:bg-cyan-500/10 mb-4"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Home
            </Button>

            <div className="flex items-center gap-6 mb-2">
              {/* Profile Picture with Upload */}
              <div className="relative group">
                <div className="w-24 h-24 rounded-full overflow-hidden border-4 border-purple-500/50 bg-gradient-to-br from-purple-600 to-cyan-600 shadow-lg shadow-cyan-500/50 group-hover:border-cyan-400 transition-all duration-300">
                  {profilePicture ? (
                    <img 
                      src={profilePicture} 
                      alt={userInfo.name || "Profile"} 
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-white font-bold text-3xl">
                      {getUserInitials()}
                    </div>
                  )}
                </div>
                <label 
                  htmlFor="profile-picture-upload"
                  className="absolute bottom-0 right-0 w-10 h-10 rounded-full bg-gradient-to-r from-purple-600 to-cyan-600 hover:from-purple-700 hover:to-cyan-700 flex items-center justify-center cursor-pointer shadow-lg shadow-purple-500/50 hover:shadow-cyan-500/70 transition-all duration-300 hover:scale-110 border-2 border-gray-900"
                >
                  <Camera className="w-5 h-5 text-white" />
                </label>
                <input
                  id="profile-picture-upload"
                  type="file"
                  accept="image/*"
                  onChange={handleProfilePictureUpload}
                  className="hidden"
                />
              </div>
              
              <div>
                <h1 className="text-4xl sm:text-5xl text-white bg-gradient-to-r from-purple-400 via-cyan-400 to-blue-400 bg-clip-text text-transparent">
                  My Profile
                </h1>
                <p className="text-xl text-gray-400">
                  Manage your account and campaigns
                </p>
              </div>
            </div>
          </div>

          {/* Main Content Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* LEFT COLUMN - Personal Info & Social Links */}
            <div className="lg:col-span-1 space-y-6">
              {/* Personal Information Card */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="p-6 rounded-2xl bg-gradient-to-br from-gray-900/90 via-purple-900/20 to-cyan-900/20 border-2 border-purple-500/30 backdrop-blur-sm shadow-2xl shadow-purple-500/20"
              >
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-xl text-white font-semibold flex items-center gap-2">
                    <User className="w-5 h-5 text-cyan-400" />
                    Personal Information
                  </h3>
                  {!isEditingProfile ? (
                    <Button
                      onClick={() => setIsEditingProfile(true)}
                      variant="ghost"
                      size="sm"
                      className="text-cyan-400 hover:text-cyan-300 hover:bg-cyan-500/10"
                    >
                      <Edit2 className="w-4 h-4 mr-1" />
                      Edit
                    </Button>
                  ) : (
                    <div className="flex gap-2">
                      <Button
                        onClick={handleSaveProfile}
                        size="sm"
                        className="bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white"
                      >
                        <Save className="w-4 h-4 mr-1" />
                        Save
                      </Button>
                      <Button
                        onClick={handleCancelProfile}
                        variant="ghost"
                        size="sm"
                        className="text-gray-400 hover:text-gray-300"
                      >
                        <X className="w-4 h-4" />
                      </Button>
                    </div>
                  )}
                </div>

                <div className="space-y-4">
                  {isEditingProfile ? (
                    <>
                      <div>
                        <Label className="text-gray-300 text-sm">Full Name</Label>
                        <Input
                          value={tempUserInfo.name}
                          onChange={(e) => setTempUserInfo({ ...tempUserInfo, name: e.target.value })}
                          className="mt-2 bg-gray-900/50 border-purple-500/30 text-white focus:border-cyan-400/50"
                        />
                      </div>
                      <div>
                        <Label className="text-gray-300 text-sm">Email</Label>
                        <Input
                          value={tempUserInfo.email}
                          onChange={(e) => setTempUserInfo({ ...tempUserInfo, email: e.target.value })}
                          className="mt-2 bg-gray-900/50 border-purple-500/30 text-white focus:border-cyan-400/50"
                        />
                      </div>
                      <div>
                        <Label className="text-gray-300 text-sm">Phone</Label>
                        <Input
                          value={tempUserInfo.phone}
                          onChange={(e) => setTempUserInfo({ ...tempUserInfo, phone: e.target.value })}
                          className="mt-2 bg-gray-900/50 border-purple-500/30 text-white focus:border-cyan-400/50"
                        />
                      </div>
                      <div>
                        <Label className="text-gray-300 text-sm">Company</Label>
                        <Input
                          value={tempUserInfo.company}
                          onChange={(e) => setTempUserInfo({ ...tempUserInfo, company: e.target.value })}
                          className="mt-2 bg-gray-900/50 border-purple-500/30 text-white focus:border-cyan-400/50"
                        />
                      </div>
                      <div>
                        <Label className="text-gray-300 text-sm">Location</Label>
                        <Input
                          value={tempUserInfo.location}
                          onChange={(e) => setTempUserInfo({ ...tempUserInfo, location: e.target.value })}
                          className="mt-2 bg-gray-900/50 border-purple-500/30 text-white focus:border-cyan-400/50"
                        />
                      </div>
                      <div>
                        <Label className="text-gray-300 text-sm">Website</Label>
                        <Input
                          value={tempUserInfo.website}
                          onChange={(e) => setTempUserInfo({ ...tempUserInfo, website: e.target.value })}
                          className="mt-2 bg-gray-900/50 border-purple-500/30 text-white focus:border-cyan-400/50"
                        />
                      </div>
                    </>
                  ) : (
                    <>
                      <div className="flex items-center gap-3 p-3 rounded-xl bg-gray-900/50 border border-purple-500/20">
                        <User className="w-5 h-5 text-purple-400" />
                        <div>
                          <p className="text-xs text-gray-400">Name</p>
                          <p className="text-white">{userInfo.name || "Not set"}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-3 p-3 rounded-xl bg-gray-900/50 border border-cyan-500/20">
                        <Mail className="w-5 h-5 text-cyan-400" />
                        <div>
                          <p className="text-xs text-gray-400">Email</p>
                          <p className="text-white text-sm">{userInfo.email || "Not set"}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-3 p-3 rounded-xl bg-gray-900/50 border border-purple-500/20">
                        <Phone className="w-5 h-5 text-purple-400" />
                        <div>
                          <p className="text-xs text-gray-400">Phone</p>
                          <p className="text-white">{userInfo.phone || "Not set"}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-3 p-3 rounded-xl bg-gray-900/50 border border-cyan-500/20">
                        <Building2 className="w-5 h-5 text-cyan-400" />
                        <div>
                          <p className="text-xs text-gray-400">Company</p>
                          <p className="text-white">{userInfo.company || "Not set"}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-3 p-3 rounded-xl bg-gray-900/50 border border-purple-500/20">
                        <MapPin className="w-5 h-5 text-purple-400" />
                        <div>
                          <p className="text-xs text-gray-400">Location</p>
                          <p className="text-white">{userInfo.location || "Not set"}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-3 p-3 rounded-xl bg-gray-900/50 border border-cyan-500/20">
                        <Globe className="w-5 h-5 text-cyan-400" />
                        <div>
                          <p className="text-xs text-gray-400">Website</p>
                          <p className="text-white text-sm">{userInfo.website || "Not set"}</p>
                        </div>
                      </div>
                    </>
                  )}
                </div>
              </motion.div>

              {/* Social Media Links Card */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="p-6 rounded-2xl bg-gradient-to-br from-gray-900/90 via-cyan-900/20 to-purple-900/20 border-2 border-cyan-500/30 backdrop-blur-sm shadow-2xl shadow-cyan-500/20"
              >
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-xl text-white font-semibold flex items-center gap-2">
                    <LinkIcon className="w-5 h-5 text-purple-400" />
                    Social Media Links
                  </h3>
                  {!isEditingSocial ? (
                    <Button
                      onClick={() => setIsEditingSocial(true)}
                      variant="ghost"
                      size="sm"
                      className="text-purple-400 hover:text-purple-300 hover:bg-purple-500/10"
                    >
                      <Edit2 className="w-4 h-4 mr-1" />
                      Edit
                    </Button>
                  ) : (
                    <div className="flex gap-2">
                      <Button
                        onClick={handleSaveSocial}
                        size="sm"
                        className="bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white"
                      >
                        <Save className="w-4 h-4 mr-1" />
                        Save
                      </Button>
                      <Button
                        onClick={handleCancelSocial}
                        variant="ghost"
                        size="sm"
                        className="text-gray-400 hover:text-gray-300"
                      >
                        <X className="w-4 h-4" />
                      </Button>
                    </div>
                  )}
                </div>

                <div className="space-y-4">
                  {isEditingSocial ? (
                    <>
                      <div>
                        <Label className="text-gray-300 text-sm flex items-center gap-2">
                          <Instagram className="w-4 h-4 text-pink-400" />
                          Instagram
                        </Label>
                        <Input
                          value={tempSocialLinks.instagram}
                          onChange={(e) => setTempSocialLinks({ ...tempSocialLinks, instagram: e.target.value })}
                          className="mt-2 bg-gray-900/50 border-purple-500/30 text-white focus:border-cyan-400/50"
                          placeholder="https://instagram.com/username"
                        />
                      </div>
                      <div>
                        <Label className="text-gray-300 text-sm flex items-center gap-2">
                          <Facebook className="w-4 h-4 text-blue-400" />
                          Facebook
                        </Label>
                        <Input
                          value={tempSocialLinks.facebook}
                          onChange={(e) => setTempSocialLinks({ ...tempSocialLinks, facebook: e.target.value })}
                          className="mt-2 bg-gray-900/50 border-purple-500/30 text-white focus:border-cyan-400/50"
                          placeholder="https://facebook.com/username"
                        />
                      </div>
                      <div>
                        <Label className="text-gray-300 text-sm flex items-center gap-2">
                          <Youtube className="w-4 h-4 text-red-400" />
                          YouTube
                        </Label>
                        <Input
                          value={tempSocialLinks.youtube}
                          onChange={(e) => setTempSocialLinks({ ...tempSocialLinks, youtube: e.target.value })}
                          className="mt-2 bg-gray-900/50 border-purple-500/30 text-white focus:border-cyan-400/50"
                          placeholder="https://youtube.com/@username"
                        />
                      </div>
                      <div>
                        <Label className="text-gray-300 text-sm flex items-center gap-2">
                          <Twitter className="w-4 h-4 text-sky-400" />
                          Twitter
                        </Label>
                        <Input
                          value={tempSocialLinks.twitter}
                          onChange={(e) => setTempSocialLinks({ ...tempSocialLinks, twitter: e.target.value })}
                          className="mt-2 bg-gray-900/50 border-purple-500/30 text-white focus:border-cyan-400/50"
                          placeholder="https://twitter.com/username"
                        />
                      </div>
                      <div>
                        <Label className="text-gray-300 text-sm flex items-center gap-2">
                          <Linkedin className="w-4 h-4 text-blue-500" />
                          LinkedIn
                        </Label>
                        <Input
                          value={tempSocialLinks.linkedin}
                          onChange={(e) => setTempSocialLinks({ ...tempSocialLinks, linkedin: e.target.value })}
                          className="mt-2 bg-gray-900/50 border-purple-500/30 text-white focus:border-cyan-400/50"
                          placeholder="https://linkedin.com/in/username"
                        />
                      </div>
                    </>
                  ) : (
                    <>
                      {!socialLinks.instagram && !socialLinks.facebook && !socialLinks.youtube && !socialLinks.twitter && !socialLinks.linkedin ? (
                        <div className="text-center py-8">
                          <LinkIcon className="w-12 h-12 text-gray-500 mx-auto mb-3" />
                          <p className="text-gray-400 mb-2">No social links added yet</p>
                          <p className="text-gray-500 text-sm">Click Edit to add your social media profiles</p>
                        </div>
                      ) : (
                        <>
                          {socialLinks.instagram && (
                            <a
                              href={socialLinks.instagram}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="flex items-center gap-3 p-3 rounded-xl bg-gray-900/50 border border-purple-500/20 hover:border-pink-400/50 transition-all group"
                            >
                              <Instagram className="w-5 h-5 text-pink-400" />
                              <div className="flex-1">
                                <p className="text-xs text-gray-400">Instagram</p>
                                <p className="text-white text-sm group-hover:text-pink-400 transition-colors">{socialLinks.instagram}</p>
                              </div>
                            </a>
                          )}
                          {socialLinks.facebook && (
                            <a
                              href={socialLinks.facebook}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="flex items-center gap-3 p-3 rounded-xl bg-gray-900/50 border border-cyan-500/20 hover:border-blue-400/50 transition-all group"
                            >
                              <Facebook className="w-5 h-5 text-blue-400" />
                              <div className="flex-1">
                                <p className="text-xs text-gray-400">Facebook</p>
                                <p className="text-white text-sm group-hover:text-blue-400 transition-colors">{socialLinks.facebook}</p>
                              </div>
                            </a>
                          )}
                          {socialLinks.youtube && (
                            <a
                              href={socialLinks.youtube}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="flex items-center gap-3 p-3 rounded-xl bg-gray-900/50 border border-purple-500/20 hover:border-red-400/50 transition-all group"
                            >
                              <Youtube className="w-5 h-5 text-red-400" />
                              <div className="flex-1">
                                <p className="text-xs text-gray-400">YouTube</p>
                                <p className="text-white text-sm group-hover:text-red-400 transition-colors">{socialLinks.youtube}</p>
                              </div>
                            </a>
                          )}
                          {socialLinks.twitter && (
                            <a
                              href={socialLinks.twitter}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="flex items-center gap-3 p-3 rounded-xl bg-gray-900/50 border border-cyan-500/20 hover:border-sky-400/50 transition-all group"
                            >
                              <Twitter className="w-5 h-5 text-sky-400" />
                              <div className="flex-1">
                                <p className="text-xs text-gray-400">Twitter</p>
                                <p className="text-white text-sm group-hover:text-sky-400 transition-colors">{socialLinks.twitter}</p>
                              </div>
                            </a>
                          )}
                          {socialLinks.linkedin && (
                            <a
                              href={socialLinks.linkedin}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="flex items-center gap-3 p-3 rounded-xl bg-gray-900/50 border border-purple-500/20 hover:border-blue-500/50 transition-all group"
                            >
                              <Linkedin className="w-5 h-5 text-blue-500" />
                              <div className="flex-1">
                                <p className="text-xs text-gray-400">LinkedIn</p>
                                <p className="text-white text-sm group-hover:text-blue-500 transition-colors">{socialLinks.linkedin}</p>
                              </div>
                            </a>
                          )}
                        </>
                      )}
                    </>
                  )}
                </div>
              </motion.div>
            </div>

            {/* RIGHT COLUMN - Ads & History */}
            <div className="lg:col-span-2 space-y-6">
              {/* Ads in Review */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                className="p-6 rounded-2xl bg-gradient-to-br from-gray-900/90 via-yellow-900/10 to-orange-900/10 border-2 border-yellow-500/30 backdrop-blur-sm shadow-2xl shadow-yellow-500/20"
              >
                <div className="flex items-center gap-2 mb-6">
                  <Clock className="w-6 h-6 text-yellow-400" />
                  <h3 className="text-2xl text-white font-semibold">Ads in Review</h3>
                  <span className="px-3 py-1 rounded-full bg-yellow-500/20 text-yellow-400 text-sm">
                    {adsInReview.length}
                  </span>
                </div>

                {adsInReview.length === 0 ? (
                  <div className="text-center py-12">
                    <Clock className="w-16 h-16 text-gray-500 mx-auto mb-4" />
                    <p className="text-gray-400">No ads currently in review</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {adsInReview.map((ad) => (
                      <div
                        key={ad.id}
                        className="p-5 rounded-xl bg-gray-900/50 border border-yellow-500/20 hover:border-yellow-400/50 transition-all"
                      >
                        <div className="flex items-start justify-between mb-3">
                          <div>
                            <h4 className="text-white font-semibold mb-1">{ad.name}</h4>
                            <div className="flex items-center gap-2 text-sm text-gray-400">
                              <Calendar className="w-4 h-4" />
                              Created: {new Date(ad.createdAt).toLocaleDateString()}
                            </div>
                          </div>
                          {getStatusBadge(ad.status)}
                        </div>
                        <div className="flex flex-wrap gap-2 mb-3">
                          {ad.platforms.map((platform) => (
                            <span
                              key={platform}
                              className="px-3 py-1 rounded-full bg-gradient-to-r from-purple-600 to-cyan-600 text-white text-xs flex items-center gap-1"
                            >
                              {getPlatformIcon(platform)}
                              {platform}
                            </span>
                          ))}
                        </div>
                        <div className="flex items-center justify-between pt-3 border-t border-gray-700/50">
                          <div className="flex items-center gap-2">
                            <DollarSign className="w-4 h-4 text-cyan-400" />
                            <span className="text-white font-semibold">{ad.budget}</span>
                          </div>
                          <div className="flex items-center gap-2 text-sm text-yellow-400">
                            <AlertCircle className="w-4 h-4" />
                            Waiting for approval (12hrs)
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </motion.div>

              {/* Previous Ads / History */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
                className="p-6 rounded-2xl bg-gradient-to-br from-gray-900/90 via-blue-900/10 to-purple-900/10 border-2 border-blue-500/30 backdrop-blur-sm shadow-2xl shadow-blue-500/20"
              >
                <div className="flex items-center gap-2 mb-6">
                  <History className="w-6 h-6 text-blue-400" />
                  <h3 className="text-2xl text-white font-semibold">Campaign History</h3>
                  <span className="px-3 py-1 rounded-full bg-blue-500/20 text-blue-400 text-sm">
                    {previousAds.length}
                  </span>
                </div>

                {previousAds.length === 0 ? (
                  <div className="text-center py-12">
                    <BarChart3 className="w-16 h-16 text-gray-500 mx-auto mb-4" />
                    <p className="text-gray-400">No campaign history yet</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {previousAds.map((ad) => (
                      <div
                        key={ad.id}
                        className="p-5 rounded-xl bg-gray-900/50 border border-blue-500/20 hover:border-blue-400/50 transition-all"
                      >
                        <div className="flex items-start justify-between mb-3">
                          <div>
                            <h4 className="text-white font-semibold mb-1">{ad.name}</h4>
                            <div className="flex items-center gap-2 text-sm text-gray-400">
                              <Calendar className="w-4 h-4" />
                              {new Date(ad.createdAt).toLocaleDateString()}
                            </div>
                          </div>
                          {getStatusBadge(ad.status)}
                        </div>
                        <div className="flex flex-wrap gap-2 mb-4">
                          {ad.platforms.map((platform) => (
                            <span
                              key={platform}
                              className="px-3 py-1 rounded-full bg-gradient-to-r from-purple-600 to-cyan-600 text-white text-xs flex items-center gap-1"
                            >
                              {getPlatformIcon(platform)}
                              {platform}
                            </span>
                          ))}
                        </div>

                        {/* Performance Metrics */}
                        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 p-4 rounded-lg bg-gray-900/70 border border-gray-700/30">
                          <div>
                            <div className="flex items-center gap-1 mb-1">
                              <Eye className="w-3 h-3 text-purple-400" />
                              <p className="text-xs text-gray-400">Reach</p>
                            </div>
                            <p className="text-white font-semibold text-sm">{ad.reach}</p>
                          </div>
                          <div>
                            <div className="flex items-center gap-1 mb-1">
                              <MousePointer className="w-3 h-3 text-cyan-400" />
                              <p className="text-xs text-gray-400">Clicks</p>
                            </div>
                            <p className="text-white font-semibold text-sm">{ad.clicks}</p>
                          </div>
                          <div>
                            <div className="flex items-center gap-1 mb-1">
                              <TrendingUp className="w-3 h-3 text-blue-400" />
                              <p className="text-xs text-gray-400">Impressions</p>
                            </div>
                            <p className="text-white font-semibold text-sm">{ad.impressions}</p>
                          </div>
                          <div>
                            <div className="flex items-center gap-1 mb-1">
                              <DollarSign className="w-3 h-3 text-green-400" />
                              <p className="text-xs text-gray-400">Spent</p>
                            </div>
                            <p className="text-white font-semibold text-sm">{ad.spent}</p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </motion.div>

              {/* Quick Action Button */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6 }}
              >
                <Button
                  onClick={handleCreateCampaign}
                  size="lg"
                  className="w-full px-12 py-6 bg-gradient-to-r from-purple-600 via-cyan-600 to-blue-600 hover:from-purple-700 hover:via-cyan-700 hover:to-blue-700 text-white rounded-xl shadow-lg shadow-cyan-500/50 hover:shadow-cyan-500/70 transition-all duration-300 hover:scale-105"
                >
                  <Sparkles className="w-5 h-5 mr-2" />
                  Create New Campaign
                </Button>
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