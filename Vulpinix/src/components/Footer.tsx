import { Instagram, Facebook, Linkedin, Twitter } from "lucide-react";
import { useNavigate } from "react-router";

export function Footer() {
  const navigate = useNavigate();

  return (
    <footer className="relative py-16 px-4 sm:px-6 lg:px-8 border-t border-white/10 overflow-hidden bg-black/20 backdrop-blur-sm mt-12">
      {/* Background gradients for subtle glow */}
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-purple-500/10 rounded-full blur-[100px] -z-10 translate-y-[-50%] pointer-events-none" />
      <div className="absolute top-0 right-1/4 w-96 h-96 bg-cyan-500/10 rounded-full blur-[100px] -z-10 translate-y-[-50%] pointer-events-none" />

      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-12">
          {/* Brand Info */}
          <div className="space-y-4 lg:col-span-2">
            <h3 className="text-3xl font-bold bg-gradient-to-r from-purple-400 via-cyan-400 to-purple-400 bg-[length:200%_auto] animate-gradient bg-clip-text text-transparent inline-block">
              Vulpinix AI 1.0
            </h3>
            <p className="text-gray-400 max-w-md leading-relaxed">
              Empowering digital growth through advanced artificial intelligence and innovative web solutions. Designing the future of intelligent experiences.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-white font-semibold mb-6 flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 shadow-[0_0_10px_rgba(34,211,238,0.5)]" />
              Quick Links
            </h4>
            <ul className="space-y-4">
              {[
                { label: "Terms & Conditions", path: "/terms" },
                { label: "Privacy Policy", path: "/privacy" },
                { label: "Contact Us", path: "/contact" },
                { label: "Blogs", path: "/blogs" },
              ].map((link) => (
                <li key={link.label}>
                  <button
                    onClick={() => navigate(link.path)}
                    className="text-gray-400 hover:text-cyan-400 hover:translate-x-1 transition-all duration-300 text-sm flex items-center gap-2 group"
                  >
                    <span className="opacity-0 group-hover:opacity-100 transition-opacity duration-300 text-cyan-500">›</span>
                    {link.label}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Connect */}
          <div>
            <h4 className="text-white font-semibold mb-6 flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-purple-400 shadow-[0_0_10px_rgba(192,132,252,0.5)]" />
              Connect
            </h4>
            <div className="flex flex-wrap gap-4">
              {[
                { icon: Instagram, color: "hover:text-pink-500", border: "hover:border-pink-500/50", aria: "Instagram" },
                { icon: Facebook, color: "hover:text-blue-500", border: "hover:border-blue-500/50", aria: "Facebook" },
                { icon: Linkedin, color: "hover:text-blue-400", border: "hover:border-blue-400/50", aria: "LinkedIn" },
                { icon: Twitter, color: "hover:text-sky-400", border: "hover:border-sky-400/50", aria: "Twitter" },
              ].map((social, idx) => (
                <a
                  key={idx}
                  href="#"
                  aria-label={social.aria}
                  className={`w-10 h-10 rounded-xl border border-white/10 bg-white/5 flex items-center justify-center transition-all duration-300 hover:scale-110 hover:-translate-y-1 ${social.border} group`}
                >
                  <social.icon className={`w-5 h-5 text-gray-400 transition-colors duration-300 ${social.color}`} />
                </a>
              ))}
            </div>
          </div>
        </div>

        {/* Divider */}
        <div className="w-full h-px bg-gradient-to-r from-transparent via-white/10 to-transparent mb-8" />

        {/* Copyright */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-4 text-sm text-gray-500">
          <p>© {new Date().getFullYear()} Vulpinix Productions. All rights reserved.</p>
          <p className="flex items-center gap-2">
            Designed with <span className="text-red-500 animate-pulse">❤</span> for the future
          </p>
        </div>
      </div>
    </footer>
  );
}