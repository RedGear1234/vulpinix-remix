import { Instagram, Facebook, Linkedin, Twitter, Mail, MapPin, Send, ArrowRight } from "lucide-react";
import { useNavigate } from "react-router";
import { useState } from "react";

/* ─────────────────────────────────────────────────────────────────────────────
   FOOTER — Animated Professional Footer for Vulpinix AI
   All animations are pure CSS @keyframes injected via a <style> tag.
───────────────────────────────────────────────────────────────────────────── */

const FOOTER_STYLES = `
  @import url('https://fonts.googleapis.com/css2?family=Syne:wght@400;600;700;800&family=DM+Sans:wght@300;400;500;600&display=swap');

  /* ── Keyframes ── */
  @keyframes footerFloat {
    0%, 100% { transform: translateY(0px) scale(1); }
    50%       { transform: translateY(-28px) scale(1.04); }
  }
  @keyframes footerFloat2 {
    0%, 100% { transform: translateY(0px) scale(1); }
    50%       { transform: translateY(22px) scale(0.97); }
  }
  @keyframes footerShimmer {
    0%   { background-position: -200% center; }
    100% { background-position:  200% center; }
  }
  @keyframes footerFadeUp {
    from { opacity: 0; transform: translateY(32px); }
    to   { opacity: 1; transform: translateY(0); }
  }
  @keyframes footerLogoGradient {
    0%   { background-position: 0% 50%;   }
    50%  { background-position: 100% 50%; }
    100% { background-position: 0% 50%;   }
  }
  @keyframes footerHeartbeat {
    0%, 100% { transform: scale(1);    }
    20%       { transform: scale(1.25); }
    40%       { transform: scale(1);    }
    60%       { transform: scale(1.15); }
  }

  /* ── Footer root ── */
  .vx-footer {
    position: relative;
    background: #080b14;
    overflow: hidden;
    font-family: 'DM Sans', ui-sans-serif, system-ui, sans-serif;
    margin-top: 0;
  }

  /* ── Top gradient border with shimmer ── */
  .vx-footer__border {
    position: relative;
    height: 1px;
    background: linear-gradient(90deg, transparent, #6333ff, #06d6c7, transparent);
    background-size: 200% auto;
    animation: footerShimmer 3.5s linear infinite;
  }

  /* ── Radial glow background ── */
  .vx-footer__bg-glow {
    position: absolute;
    inset: 0;
    background: radial-gradient(ellipse 80% 40% at 50% 0%, rgba(99,51,255,0.12) 0%, transparent 60%);
    pointer-events: none;
    z-index: 0;
  }

  /* ── Grid dot pattern ── */
  .vx-footer__grid {
    position: absolute;
    inset: 0;
    pointer-events: none;
    z-index: 0;
    background-image:
      linear-gradient(rgba(139,92,246,0.04) 1px, transparent 1px),
      linear-gradient(90deg, rgba(139,92,246,0.04) 1px, transparent 1px);
    background-size: 60px 60px;
  }

  /* ── Floating orbs ── */
  .vx-footer__orb {
    position: absolute;
    border-radius: 50%;
    pointer-events: none;
    z-index: 0;
    filter: blur(80px);
  }
  .vx-footer__orb--a {
    width: 340px; height: 340px;
    top: -60px; left: 10%;
    background: radial-gradient(circle, rgba(99,51,255,0.18) 0%, transparent 70%);
    animation: footerFloat 9s ease-in-out infinite;
  }
  .vx-footer__orb--b {
    width: 280px; height: 280px;
    bottom: 20px; right: 8%;
    background: radial-gradient(circle, rgba(6,214,199,0.14) 0%, transparent 70%);
    animation: footerFloat2 10s ease-in-out infinite;
  }

  /* ── Main container ── */
  .vx-footer__inner {
    position: relative;
    z-index: 1;
    max-width: 1280px;
    margin: 0 auto;
    padding: 64px 32px 0;
  }

  /* ── 4-column grid ── */
  .vx-footer__grid-cols {
    display: grid;
    grid-template-columns: 1.6fr 1fr 1fr 1.4fr;
    gap: 48px;
    margin-bottom: 56px;
  }
  @media (max-width: 1024px) {
    .vx-footer__grid-cols { grid-template-columns: 1fr 1fr; gap: 40px; }
  }
  @media (max-width: 640px) {
    .vx-footer__grid-cols { grid-template-columns: 1fr; text-align: center; }
    .vx-footer__social-row { justify-content: center !important; }
    .vx-footer__newsletter-form { flex-direction: column; }
    .vx-footer__newsletter-btn { width: 100%; justify-content: center; }
    .vx-footer__bottom-inner { flex-direction: column; gap: 12px; text-align: center; }
  }

  /* ── Column fade-up animations ── */
  .vx-footer__col {
    animation: footerFadeUp 0.7s ease both;
  }
  .vx-footer__col:nth-child(1) { animation-delay: 0s;    }
  .vx-footer__col:nth-child(2) { animation-delay: 0.1s;  }
  .vx-footer__col:nth-child(3) { animation-delay: 0.2s;  }
  .vx-footer__col:nth-child(4) { animation-delay: 0.3s;  }

  /* ── Brand logo text ── */
  .vx-footer__logo-text {
    font-family: 'Syne', sans-serif;
    font-weight: 800;
    font-size: 26px;
    letter-spacing: -0.02em;
    background: linear-gradient(270deg, #a78bfa, #06d6c7, #fff, #a78bfa);
    background-size: 300% 300%;
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
    animation: footerLogoGradient 4s ease infinite;
    display: inline-block;
    margin-bottom: 14px;
  }

  /* ── Logo icon badge ── */
  .vx-footer__logo-icon {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    width: 36px; height: 36px;
    border-radius: 10px;
    background: linear-gradient(135deg, #6333ff, #06d6c7);
    box-shadow: 0 0 18px rgba(99,51,255,0.45);
    margin-right: 10px;
    vertical-align: middle;
    font-weight: 900;
    font-size: 16px;
    color: #fff;
    flex-shrink: 0;
  }

  /* ── Tagline ── */
  .vx-footer__tagline {
    color: rgba(180,180,220,0.6);
    font-size: 14px;
    line-height: 1.7;
    max-width: 280px;
    margin-bottom: 24px;
  }

  /* ── Social icons row ── */
  .vx-footer__social-row {
    display: flex;
    gap: 10px;
    flex-wrap: wrap;
  }
  .vx-footer__social-btn {
    width: 38px; height: 38px;
    border-radius: 10px;
    border: 1px solid rgba(255,255,255,0.1);
    background: rgba(255,255,255,0.04);
    backdrop-filter: blur(8px);
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    transition: all 0.2s ease;
    color: rgba(180,180,220,0.6);
    text-decoration: none;
  }
  .vx-footer__social-btn:hover {
    border-color: rgba(99,51,255,0.6);
    box-shadow: 0 0 16px rgba(99,51,255,0.5);
    color: #fff;
    transform: scale(1.1) translateY(-2px);
    background: rgba(99,51,255,0.12);
  }

  /* ── Section headings ── */
  .vx-footer__heading {
    font-family: 'Syne', sans-serif;
    font-weight: 600;
    font-size: 14px;
    color: #fff;
    letter-spacing: 0.08em;
    text-transform: uppercase;
    margin-bottom: 20px;
    display: flex;
    align-items: center;
    gap: 8px;
  }
  .vx-footer__heading-dot {
    width: 5px; height: 5px;
    border-radius: 50%;
    background: linear-gradient(135deg, #6333ff, #06d6c7);
    box-shadow: 0 0 8px rgba(99,51,255,0.6);
    flex-shrink: 0;
  }

  /* ── Nav links ── */
  .vx-footer__links {
    list-style: none;
    padding: 0; margin: 0;
    display: flex;
    flex-direction: column;
    gap: 10px;
  }
  .vx-footer__link-btn {
    background: none;
    border: none;
    padding: 0;
    cursor: pointer;
    font-family: 'DM Sans', sans-serif;
    font-size: 14px;
    color: rgba(180,180,220,0.55);
    transition: color 0.2s ease;
    display: inline-flex;
    align-items: center;
    gap: 6px;
    position: relative;
    text-align: left;
  }
  .vx-footer__link-btn::after {
    content: '';
    position: absolute;
    bottom: -2px; left: 0;
    width: 100%; height: 1px;
    background: linear-gradient(90deg, #6333ff, #06d6c7);
    transform: scaleX(0);
    transform-origin: left;
    transition: transform 0.25s ease;
  }
  .vx-footer__link-btn:hover {
    color: #e2e8f0;
  }
  .vx-footer__link-btn:hover::after {
    transform: scaleX(1);
  }
  .vx-footer__link-arrow {
    opacity: 0;
    transform: translateX(-4px);
    transition: all 0.2s ease;
    font-size: 12px;
    color: #06d6c7;
  }
  .vx-footer__link-btn:hover .vx-footer__link-arrow {
    opacity: 1;
    transform: translateX(0);
  }

  /* ── Newsletter ── */
  .vx-footer__newsletter-sub {
    font-size: 13px;
    color: rgba(180,180,220,0.5);
    line-height: 1.6;
    margin-bottom: 16px;
  }
  .vx-footer__newsletter-form {
    display: flex;
    gap: 8px;
    margin-bottom: 20px;
  }
  .vx-footer__newsletter-input {
    flex: 1;
    background: rgba(255,255,255,0.05);
    border: 1px solid rgba(99,51,255,0.25);
    border-radius: 10px;
    padding: 10px 14px;
    font-family: 'DM Sans', sans-serif;
    font-size: 13px;
    color: #e2e8f0;
    outline: none;
    backdrop-filter: blur(8px);
    transition: border-color 0.2s ease, box-shadow 0.2s ease;
    min-width: 0;
  }
  .vx-footer__newsletter-input::placeholder {
    color: rgba(180,180,220,0.35);
  }
  .vx-footer__newsletter-input:focus {
    border-color: rgba(99,51,255,0.6);
    box-shadow: 0 0 12px rgba(99,51,255,0.2);
  }
  .vx-footer__newsletter-btn {
    flex-shrink: 0;
    display: inline-flex;
    align-items: center;
    gap: 6px;
    padding: 10px 16px;
    background: linear-gradient(135deg, #6333ff, #06d6c7);
    background-size: 200% 200%;
    border: none;
    border-radius: 10px;
    color: #fff;
    font-family: 'DM Sans', sans-serif;
    font-weight: 600;
    font-size: 13px;
    cursor: pointer;
    transition: all 0.2s ease;
    white-space: nowrap;
  }
  .vx-footer__newsletter-btn:hover {
    background-position: right center;
    transform: translateY(-2px);
    box-shadow: 0 8px 24px rgba(99,51,255,0.4);
  }

  /* ── Contact info ── */
  .vx-footer__contact-item {
    display: flex;
    align-items: center;
    gap: 8px;
    font-size: 13px;
    color: rgba(180,180,220,0.5);
    margin-top: 8px;
    text-decoration: none;
    transition: color 0.2s;
  }
  .vx-footer__contact-item:hover { color: rgba(180,180,220,0.9); }
  .vx-footer__contact-icon {
    color: #6333ff;
    flex-shrink: 0;
  }

  /* ── Divider ── */
  .vx-footer__divider {
    height: 1px;
    background: rgba(255,255,255,0.06);
    margin: 0 0 0;
  }

  /* ── Bottom bar ── */
  .vx-footer__bottom {
    padding: 20px 32px;
    max-width: 1280px;
    margin: 0 auto;
  }
  .vx-footer__bottom-inner {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 16px;
    flex-wrap: wrap;
  }
  .vx-footer__bottom-copy {
    font-family: 'DM Sans', sans-serif;
    font-size: 13px;
    color: rgba(180,180,220,0.35);
  }
  .vx-footer__bottom-links {
    display: flex;
    align-items: center;
    gap: 4px;
    flex-wrap: wrap;
    justify-content: center;
  }
  .vx-footer__bottom-link {
    font-family: 'DM Sans', sans-serif;
    font-size: 12px;
    color: rgba(180,180,220,0.35);
    background: none;
    border: none;
    cursor: pointer;
    padding: 2px 6px;
    transition: color 0.2s;
    text-decoration: none;
  }
  .vx-footer__bottom-link:hover { color: rgba(180,180,220,0.8); }
  .vx-footer__bottom-sep {
    color: rgba(180,180,220,0.2);
    font-size: 12px;
  }
  .vx-footer__bottom-location {
    font-family: 'DM Sans', sans-serif;
    font-size: 13px;
    color: rgba(180,180,220,0.35);
    display: flex;
    align-items: center;
    gap: 5px;
  }
  .vx-footer__heart {
    display: inline-block;
    color: #f87171;
    animation: footerHeartbeat 2.5s ease-in-out infinite;
  }
`;

export function Footer() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [subscribed, setSubscribed] = useState(false);

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (email.trim()) {
      setSubscribed(true);
      setEmail("");
      setTimeout(() => setSubscribed(false), 3000);
    }
  };

  const productLinks = [
    { label: "How it Works", path: "/#workflow" },
    { label: "Pricing", path: "/#pricing" },
    { label: "Campaign Dashboard", path: "/campaigns" },
    { label: "Analytics", path: "/analytics" },
    { label: "Ad Platforms", path: "/upload" },
  ];

  const companyLinks = [
    { label: "About Vulpinix", path: "/#about" },
    { label: "Blog", path: "/blogs" },
    { label: "Contact Us", path: "/contact" },
    { label: "Terms & Conditions", path: "/terms" },
    { label: "Privacy Policy", path: "/privacy" },
  ];

  const socialLinks = [
    { icon: Instagram, aria: "Instagram", href: "#" },
    { icon: Facebook, aria: "Facebook", href: "#" },
    { icon: Twitter, aria: "Twitter/X", href: "#" },
    { icon: Linkedin, aria: "LinkedIn", href: "#" },
  ];

  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: FOOTER_STYLES }} />
      <footer className="vx-footer">
        {/* ── Top shimmer border ── */}
        <div className="vx-footer__border" />

        {/* ── Background layers ── */}
        <div className="vx-footer__bg-glow" />
        <div className="vx-footer__grid" />
        <div className="vx-footer__orb vx-footer__orb--a" />
        <div className="vx-footer__orb vx-footer__orb--b" />

        {/* ── Main content ── */}
        <div className="vx-footer__inner">
          <div className="vx-footer__grid-cols">

            {/* ── Column 1: Brand ── */}
            <div className="vx-footer__col">
              {/* Logo */}
              <div style={{ display: "flex", alignItems: "center", marginBottom: 14 }}>
                <span className="vx-footer__logo-icon">V</span>
                <span className="vx-footer__logo-text">Vulpinix AI</span>
              </div>

              {/* Tagline */}
              <p className="vx-footer__tagline">
                AI-powered marketing for the next generation of brands. Smarter campaigns, deeper insights, zero guesswork.
              </p>

              {/* Social icons */}
              <div className="vx-footer__social-row">
                {socialLinks.map(({ icon: Icon, aria, href }) => (
                  <a
                    key={aria}
                    href={href}
                    aria-label={aria}
                    className="vx-footer__social-btn"
                  >
                    <Icon size={16} />
                  </a>
                ))}
              </div>
            </div>

            {/* ── Column 2: Product ── */}
            <div className="vx-footer__col">
              <div className="vx-footer__heading">
                <span className="vx-footer__heading-dot" />
                Product
              </div>
              <ul className="vx-footer__links">
                {productLinks.map((link) => (
                  <li key={link.label}>
                    <button
                      className="vx-footer__link-btn"
                      onClick={() => navigate(link.path)}
                    >
                      <ArrowRight size={11} className="vx-footer__link-arrow" />
                      {link.label}
                    </button>
                  </li>
                ))}
              </ul>
            </div>

            {/* ── Column 3: Company ── */}
            <div className="vx-footer__col">
              <div className="vx-footer__heading">
                <span className="vx-footer__heading-dot" />
                Company
              </div>
              <ul className="vx-footer__links">
                {companyLinks.map((link) => (
                  <li key={link.label}>
                    <button
                      className="vx-footer__link-btn"
                      onClick={() => navigate(link.path)}
                    >
                      <ArrowRight size={11} className="vx-footer__link-arrow" />
                      {link.label}
                    </button>
                  </li>
                ))}
              </ul>
            </div>

            {/* ── Column 4: Newsletter + Contact ── */}
            <div className="vx-footer__col">
              <div className="vx-footer__heading">
                <span className="vx-footer__heading-dot" />
                Stay Updated
              </div>
              <p className="vx-footer__newsletter-sub">
                Get campaign tips and platform updates delivered to your inbox.
              </p>

              {/* Newsletter form */}
              <form className="vx-footer__newsletter-form" onSubmit={handleSubscribe}>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="your@email.com"
                  className="vx-footer__newsletter-input"
                  required
                  aria-label="Email address"
                />
                <button type="submit" className="vx-footer__newsletter-btn" aria-label="Subscribe">
                  {subscribed ? "✓ Done!" : (
                    <>
                      <Send size={13} />
                      Subscribe
                    </>
                  )}
                </button>
              </form>

              {/* Contact info */}
              <a href="mailto:hello@vulpinix.ai" className="vx-footer__contact-item">
                <Mail size={14} className="vx-footer__contact-icon" />
                vulpinixproductions@gmail.com
              </a>
              <div className="vx-footer__contact-item">
                <MapPin size={14} className="vx-footer__contact-icon" />
                Pune, India
              </div>
            </div>

          </div>{/* end grid-cols */}
        </div>{/* end inner */}

        {/* ── Divider ── */}
        <div className="vx-footer__divider" />

        {/* ── Bottom bar ── */}
        <div className="vx-footer__bottom">
          <div className="vx-footer__bottom-inner">

            {/* Left: copyright */}
            <p className="vx-footer__bottom-copy">
              © {new Date().getFullYear()} Vulpinix Productions. All rights reserved.
            </p>

            {/* Center: policy links */}
            <div className="vx-footer__bottom-links">
              <button className="vx-footer__bottom-link" onClick={() => navigate("/privacy")}>
                Privacy Policy
              </button>
              <span className="vx-footer__bottom-sep">·</span>
              <button className="vx-footer__bottom-link" onClick={() => navigate("/terms")}>
                Terms of Service
              </button>
              <span className="vx-footer__bottom-sep">·</span>
              <button className="vx-footer__bottom-link" onClick={() => navigate("/contact")}>
                Cookie Policy
              </button>
            </div>

            {/* Right: location */}
            <div className="vx-footer__bottom-location">
              <span className="vx-footer__heart"></span>
              Pune, India
            </div>

          </div>
        </div>

      </footer>
    </>
  );
}