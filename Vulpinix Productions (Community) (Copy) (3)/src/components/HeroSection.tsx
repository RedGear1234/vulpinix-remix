import { Button } from "./ui/button";
import { Play, Instagram, Facebook, Linkedin, Twitter, User } from "lucide-react";
import { useNavigate } from "react-router";
import { useState, useEffect } from "react";

export function HeroSection() {
  const navigate = useNavigate();
  const [userInfo, setUserInfo] = useState<any>(null);
  
  useEffect(() => {
    // Load user info from localStorage
    const savedUserInfo = localStorage.getItem("userInfo");
    if (savedUserInfo) {
      try {
        setUserInfo(JSON.parse(savedUserInfo));
      } catch (e) {
        console.error("Error parsing user info:", e);
      }
    }
  }, []);
  
  const handleGetStarted = () => {
    // Check if user is already logged in
    const savedUserInfo = localStorage.getItem("userInfo");
    
    if (savedUserInfo) {
      // User is logged in, go directly to upload page
      navigate("/upload");
    } else {
      // New user, go to auth page
      navigate("/auth");
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
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden px-4 sm:px-6 lg:px-8">
      {/* Profile Button - Top Right */}
      <div className="absolute top-8 right-8 z-20">
        <button
          onClick={() => navigate("/profile")}
          className="group relative"
          title="My Profile"
        >
          <div className="w-12 h-12 rounded-full overflow-hidden border-2 border-purple-500/50 bg-gradient-to-br from-purple-600 to-cyan-600 hover:border-cyan-400 transition-all duration-300 hover:scale-110 shadow-lg shadow-purple-500/30 hover:shadow-cyan-500/50">
            {userInfo?.picture ? (
              <img 
                src={userInfo.picture} 
                alt={userInfo.name || "User"} 
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-white font-bold text-lg">
                {getUserInitials()}
              </div>
            )}
          </div>
        </button>
      </div>

      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-1/4 right-1/4 w-96 h-96 bg-purple-600/20 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-1/4 left-1/4 w-96 h-96 bg-cyan-600/20 rounded-full blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 left-1/2 w-96 h-96 bg-blue-600/20 rounded-full blur-3xl animate-pulse delay-500"></div>
      </div>

      {/* AI Circuit Pattern */}
      <div className="absolute inset-0 opacity-10">
        <svg className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <pattern id="circuit" x="0" y="0" width="100" height="100" patternUnits="userSpaceOnUse">
              <circle cx="50" cy="50" r="2" fill="#00ffff" />
              <line x1="50" y1="50" x2="100" y2="50" stroke="#00ffff" strokeWidth="0.5" />
              <line x1="50" y1="50" x2="50" y2="0" stroke="#00ffff" strokeWidth="0.5" />
              <circle cx="0" cy="50" r="2" fill="#a855f7" />
              <circle cx="50" cy="0" r="2" fill="#3b82f6" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#circuit)" />
        </svg>
      </div>

      {/* Social Media Icons Floating */}
      <div className="absolute right-10 top-1/4 space-y-6 hidden lg:block">
        <div className="w-16 h-16 rounded-2xl border-2 border-cyan-500/50 bg-cyan-500/10 backdrop-blur-sm flex items-center justify-center animate-float">
          <Instagram className="w-8 h-8 text-cyan-400" />
        </div>
        <div className="w-16 h-16 rounded-2xl border-2 border-purple-500/50 bg-purple-500/10 backdrop-blur-sm flex items-center justify-center animate-float-delayed">
          <Facebook className="w-8 h-8 text-purple-400" />
        </div>
        <div className="w-16 h-16 rounded-2xl border-2 border-blue-500/50 bg-blue-500/10 backdrop-blur-sm flex items-center justify-center animate-float">
          <Linkedin className="w-8 h-8 text-blue-400" />
        </div>
        <div className="w-16 h-16 rounded-2xl border-2 border-cyan-500/50 bg-cyan-500/10 backdrop-blur-sm flex items-center justify-center animate-float-delayed">
          <Twitter className="w-8 h-8 text-cyan-400" />
        </div>
      </div>

      {/* Content */}
      <div className="relative z-10 max-w-5xl mx-auto text-center">
        <div className="mb-8 inline-block px-4 py-2 rounded-full border border-purple-500/30 bg-purple-500/10 backdrop-blur-sm">
          <span className="text-purple-300">Introducing Vulpinix AI 1.0</span>
        </div>
        
        <h1 className="text-5xl sm:text-6xl lg:text-7xl text-white mb-6 tracking-tight">
          Automate Your Digital Marketing with{" "}
          <span className="bg-gradient-to-r from-purple-400 via-cyan-400 to-blue-400 bg-clip-text text-transparent">
            Vulpinix AI 1.0
          </span>
        </h1>
        
        <p className="text-xl sm:text-2xl text-gray-300 mb-12 max-w-3xl mx-auto">
          Upload, Analyze, and Advertise — All powered by AI.
        </p>
        
        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
          <Button 
            size="lg" 
            onClick={handleGetStarted}
            className="bg-gradient-to-r from-purple-600 to-cyan-600 hover:from-purple-700 hover:to-cyan-700 text-white px-8 py-6 rounded-xl shadow-lg shadow-purple-500/50 hover:shadow-purple-500/70 transition-all duration-300 hover:scale-105"
          >
            Get Started
          </Button>
          
          <Button 
            size="lg" 
            variant="outline" 
            className="border-2 border-cyan-500/50 bg-cyan-500/10 hover:bg-cyan-500/20 text-cyan-300 px-8 py-6 rounded-xl backdrop-blur-sm transition-all duration-300 hover:scale-105"
          >
            <Play className="w-5 h-5 mr-2" />
            Watch Demo
          </Button>
        </div>
      </div>
    </section>
  );
}