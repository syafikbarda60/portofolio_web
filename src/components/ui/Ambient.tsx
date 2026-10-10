"use client";

import React from "react";
import Noise from "@/components/reactbits/Noise";

/**
 * Page ground: a faint structural grid plus film grain.
 *
 * Fixed and pointer-events-none so the grain never repaints inside a
 * scrolling container, which is what kills frame rate on mobile.
 */
export function Ambient() {
  return (
    <div className="pointer-events-none fixed inset-0 z-0 overflow-hidden">
      <div className="absolute inset-0 bg-bg" />

      <div
        className="absolute inset-0 opacity-60"
        style={{
          backgroundImage: `linear-gradient(to right, var(--line) 1px, transparent 1px),
                            linear-gradient(to bottom, var(--line) 1px, transparent 1px)`,
          backgroundSize: "clamp(64px, 8vw, 120px) clamp(64px, 8vw, 120px)",
          maskImage:
            "radial-gradient(ellipse 80% 55% at 50% 0%, #000 10%, transparent 75%)",
          WebkitMaskImage:
            "radial-gradient(ellipse 80% 55% at 50% 0%, #000 10%, transparent 75%)",
        }}
      />

      {/* Static grain, no blend mode: either one alone forces a full-viewport
          repaint on every scrolled frame. */}
      <div className="absolute inset-0 opacity-40">
        <Noise patternRefreshInterval={0} patternAlpha={10} />
      </div>
    </div>
  );
}
