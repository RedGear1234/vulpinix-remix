import { Instagram, Facebook, Linkedin, Twitter } from "lucide-react";
import { useNavigate } from "react-router";

export function Footer() {
  const navigate = useNavigate();

  return (
    <footer className="py-12 px-4 sm:px-6 lg:px-8 border-t border-gray-800/50 relative">
      <div className="max-w-6xl mx-auto">
        <div className="flex flex-col items-center gap-6">
          {/* Logo/Brand */}
          <div className="text-center">
            <div className="text-2xl bg-gradient-to-r from-purple-400 to-cyan-400 bg-clip-text text-transparent mb-2">
              Vulpinix AI 1.0
            </div>
            <p className="text-gray-400">
              Vulpinix Productions — Empowering Digital Growth
            </p>
          </div>

          {/* Footer Links */}
          <div className="flex flex-wrap justify-center gap-6 text-sm">
            <button
              onClick={() => navigate("/terms")}
              className="text-gray-400 hover:text-cyan-400 transition-colors"
            >
              Terms & Conditions
            </button>
            <button
              onClick={() => navigate("/privacy")}
              className="text-gray-400 hover:text-cyan-400 transition-colors"
            >
              Privacy Policy
            </button>
            <button
              onClick={() => navigate("/contact")}
              className="text-gray-400 hover:text-cyan-400 transition-colors"
            >
              Contact Us
            </button>
            <button
              onClick={() => navigate("/blogs")}
              className="text-gray-400 hover:text-cyan-400 transition-colors"
            >
              Blogs
            </button>
          </div>

          {/* Social Icons */}
          <div className="flex gap-4">
            <a 
              href="#" 
              className="w-10 h-10 rounded-lg border border-gray-700 bg-gray-800/50 hover:bg-gray-700/50 flex items-center justify-center transition-all duration-300 hover:border-purple-500/50 hover:scale-110"
              aria-label="Instagram"
            >
              <Instagram className="w-5 h-5 text-gray-400 hover:text-purple-400" />
            </a>
            <a 
              href="#" 
              className="w-10 h-10 rounded-lg border border-gray-700 bg-gray-800/50 hover:bg-gray-700/50 flex items-center justify-center transition-all duration-300 hover:border-cyan-500/50 hover:scale-110"
              aria-label="Facebook"
            >
              <Facebook className="w-5 h-5 text-gray-400 hover:text-cyan-400" />
            </a>
            <a 
              href="#" 
              className="w-10 h-10 rounded-lg border border-gray-700 bg-gray-800/50 hover:bg-gray-700/50 flex items-center justify-center transition-all duration-300 hover:border-blue-500/50 hover:scale-110"
              aria-label="LinkedIn"
            >
              <Linkedin className="w-5 h-5 text-gray-400 hover:text-blue-400" />
            </a>
            <a 
              href="#" 
              className="w-10 h-10 rounded-lg border border-gray-700 bg-gray-800/50 hover:bg-gray-700/50 flex items-center justify-center transition-all duration-300 hover:border-cyan-500/50 hover:scale-110"
              aria-label="Twitter"
            >
              <Twitter className="w-5 h-5 text-gray-400 hover:text-cyan-400" />
            </a>
          </div>

          {/* Disclaimer */}
          <div className="text-center">
            <p className="text-red-400/80 text-sm border border-red-500/30 bg-red-500/10 px-4 py-2 rounded-lg backdrop-blur-sm">
              ⚠️ Do not share this document with anyone.
            </p>
          </div>

          {/* Copyright */}
          <div className="text-gray-500 text-sm">
            © 2025 Vulpinix Productions. All rights reserved.
          </div>
        </div>
      </div>
    </footer>
  );
}