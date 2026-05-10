import { useRef, useState, useCallback } from "react";
import { ChevronRight } from "lucide-react";

interface PlatformFlipSliderProps {
  onFlip: (flipped: boolean) => void;
  flipped: boolean;
}

export function PlatformFlipSlider({ onFlip, flipped }: PlatformFlipSliderProps) {
  const [drag, setDrag] = useState(0);
  const [dragging, setDragging] = useState(false);
  const trackRef = useRef<HTMLDivElement>(null);
  const THUMB = 32;

  const trackWidth = useCallback(() => {
    return (trackRef.current?.offsetWidth ?? 320) - THUMB;
  }, []);

  const start = useCallback((clientX: number) => {
    setDragging(true);
    const rect = trackRef.current?.getBoundingClientRect();
    if (!rect) return;
    const pos = Math.max(0, Math.min(clientX - rect.left - THUMB / 2, trackWidth()));
    setDrag(pos);
  }, [trackWidth]);

  const move = useCallback((clientX: number) => {
    if (!dragging) return;
    const rect = trackRef.current?.getBoundingClientRect();
    if (!rect) return;
    const pos = Math.max(0, Math.min(clientX - rect.left - THUMB / 2, trackWidth()));
    setDrag(pos);
    const pct = pos / trackWidth();
    if (pct > 0.78 && !flipped) { onFlip(true); setDrag(trackWidth()); }
  }, [dragging, trackWidth, flipped, onFlip]);

  const end = useCallback(() => {
    setDragging(false);
    if (trackWidth() > 0 && drag / trackWidth() < 0.78) setDrag(0);
  }, [drag, trackWidth]);

  const pct = trackWidth() > 0 ? drag / trackWidth() : 0;
  const label = flipped ? "Analytics Live ✦" : pct > 0.4 ? "Slide..." : "Slide for analytics";

  return (
    <div style={{ marginTop: 10, width: "100%" }}>
      <style>{`
        @keyframes sliderPulse {
          0%,100%{box-shadow:0 0 0 0 rgba(74,222,128,0.4)}
          50%{box-shadow:0 0 0 6px rgba(74,222,128,0)}
        }
        @keyframes arrowBounce {
          0%,100%{transform:translateX(0)}
          50%{transform:translateX(2px)}
        }
        .vx-slider-thumb {
          animation: ${!dragging && !flipped ? "sliderPulse 2s infinite" : "none"};
          cursor: grab;
        }
        .vx-slider-thumb:active { cursor: grabbing; }
        .vx-arrow-icon {
          animation: ${!dragging && !flipped ? "arrowBounce 1s infinite" : "none"};
        }
        
        @media (max-width: 480px) {
          #analytics-flip-slider { height: 28px !important; }
          .vx-slider-thumb { width: 24px !important; height: 24px !important; }
          .vx-slider-label { font-size: 8px !important; }
        }
        @media (min-width: 1024px) {
          #analytics-flip-slider { height: 40px !important; }
          .vx-slider-thumb { width: 36px !important; height: 36px !important; }
          .vx-slider-label { font-size: 11px !important; }
        }
      `}</style>

      <div
        ref={trackRef}
        id="analytics-flip-slider"
        style={{
          position: "relative",
          height: 32,
          borderRadius: 999,
          background: "linear-gradient(135deg,rgba(10,15,28,0.95),rgba(20,28,50,0.9))",
          border: "1px solid rgba(111, 74, 222, 0.25)",
          backdropFilter: "blur(12px)",
          userSelect: "none",
          overflow: "hidden",
          boxShadow: "inset 0 1px 3px rgba(0,0,0,0.5), 0 4px 10px rgba(0,0,0,0.3)",
        }}
        onMouseDown={e => start(e.clientX)}
        onMouseMove={e => move(e.clientX)}
        onMouseUp={end}
        onMouseLeave={end}
        onTouchStart={e => start(e.touches[0].clientX)}
        onTouchMove={e => { e.preventDefault(); move(e.touches[0].clientX); }}
        onTouchEnd={end}
      >
        {/* Fill track */}
        <div style={{
          position: "absolute",
          left: 0, top: 0, bottom: 0,
          width: drag + THUMB,
          background: "linear-gradient(90deg,rgba(74,222,128,0.15),rgba(56,189,248,0.1))",
          transition: dragging ? "none" : "width 0.25s cubic-bezier(0.2,0,0,1)",
          borderRadius: 999,
        }} />

        {/* Shimmer light */}
        <div style={{
          position: "absolute", inset: 0, borderRadius: 999,
          background: "linear-gradient(90deg,transparent 0%,rgba(255,255,255,0.04) 50%,transparent 100%)",
          pointerEvents: "none",
        }} />

        {/* Label */}
        <div 
          className="vx-slider-label"
          style={{
            position: "absolute", inset: 0,
            display: "flex", alignItems: "center", justifyContent: "center",
            fontSize: 10, fontWeight: 700, letterSpacing: "0.04em",
            color: flipped ? "#ffffff" : `rgba(255,255,255,${0.25 + pct * 0.5})`,
            pointerEvents: "none",
            transition: "color 0.2s ease",
          }}>{label}</div>

        {/* Thumb */}
        <div
          className="vx-slider-thumb"
          style={{
            position: "absolute",
            top: "50%",
            transform: "translateY(-50%)",
            left: drag + 2,
            width: THUMB - 4, height: THUMB - 4,
            borderRadius: 999,
            background: flipped
              ? "rgba(85, 0, 255, 0.2)"
              : "rgba(255, 255, 255, 0.08)",
            border: flipped 
              ? "1px solid rgba(85, 0, 255, 0.4)" 
              : "1px solid rgba(255, 255, 255, 0.2)",
            backdropFilter: "blur(4px)",
            display: "flex", alignItems: "center", justifyContent: "center",
            transition: dragging ? "none" : "left 0.25s cubic-bezier(0.2,0,0,1), background 0.2s ease, border 0.2s ease",
            boxShadow: flipped 
              ? "0 4px 12px rgba(85, 0, 255, 0.3)" 
              : "0 4px 12px rgba(0, 0, 0, 0.2)",
            zIndex: 2,
          }}
        >
          <span className="vx-arrow-icon">
            {flipped
              ? <span style={{ fontSize: 12, color: "#fff" }}>✓</span>
              : <ChevronRight size={12} style={{ color: "#fff", strokeWidth: 3 }} />
            }
          </span>
        </div>
      </div>

      {/* Reset button when flipped */}
      {flipped && (
        <button
          onClick={() => { onFlip(false); setDrag(0); }}
          style={{
            marginTop: 8, width: "100%", padding: "8px",
            background: "transparent", border: "1px solid rgba(74,222,128,0.2)",
            borderRadius: 12, color: "rgba(74, 222, 128, 0.7)", fontSize: 12,
            fontWeight: 600, cursor: "pointer", letterSpacing: "0.05em",
            transition: "all 0.2s ease",
          }}
          onMouseEnter={e => { (e.currentTarget as HTMLElement).style.background = "rgba(74,222,128,0.08)"; }}
          onMouseLeave={e => { (e.currentTarget as HTMLElement).style.background = "transparent"; }}
        >
          ↩ Flip back
        </button>
      )}
    </div>
  );
}
