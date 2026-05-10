import { useNavigate } from "react-router";
import { CSSProperties } from "react";

interface VulpinixLogoProps {
  size?: "sm" | "md" | "lg";
  onClick?: () => void;
  style?: CSSProperties;
  showText?: boolean;
  className?: string;
}

/**
 * Reusable Vulpinix AI logo — SVG fox mark + gradient wordmark.
 * Sizes: sm (28px icon), md (36px icon, default), lg (44px icon)
 */
export function VulpinixLogo({
  size = "md",
  onClick,
  style,
  showText = true,
  className,
}: VulpinixLogoProps) {
  const navigate = useNavigate();
  const iconSize = size === "sm" ? 28 : size === "lg" ? 44 : 36;
  const fontSize = size === "sm" ? 15 : size === "lg" ? 21 : 17;

  const handleClick = () => {
    if (onClick) onClick();
    else navigate("/");
  };

  return (
    <button
      onClick={handleClick}
      className={className}
      style={{
        display: "flex",
        alignItems: "center",
        gap: size === "sm" ? 7 : 10,
        background: "none",
        border: "none",
        cursor: "pointer",
        padding: 0,
        ...style,
      }}
      aria-label="Vulpinix AI - Home"
    >
      {/* SVG Logo Mark - Minimalist Fox/V */}
      <svg
        width={iconSize}
        height={iconSize}
        viewBox="0 0 100 100"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        style={{ flexShrink: 0, color: "var(--vx-text-primary)" }}
      >
        {/* Left Ear/Side */}
        <polygon points="15,20 45,85 55,60 35,20" fill="currentColor" />
        {/* Right Ear/Side */}
        <polygon points="85,20 55,85 45,60 65,20" fill="currentColor" />
        {/* Center Face/Nose */}
        <polygon points="40,25 60,25 50,50" fill="currentColor" opacity="0.5" />
      </svg>

      {/* Wordmark */}
      {showText && (
        <span
          style={{
            fontSize,
            fontWeight: 800,
            letterSpacing: "-0.04em",
            fontFamily: "'Inter', sans-serif",
            color: "var(--vx-text-primary)",
            userSelect: "none",
          }}
        >
          Vulpinix <span style={{ color: "var(--vx-text-secondary)", fontWeight: 500 }}>AI</span>
        </span>
      )}
    </button>
  );
}

