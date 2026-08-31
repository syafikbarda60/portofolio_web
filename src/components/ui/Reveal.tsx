"use client";

import React, { useEffect, useState } from "react";
import AnimatedContent from "@/components/reactbits/AnimatedContent";

type RevealProps = React.ComponentProps<typeof AnimatedContent>;

const QUERY = "(prefers-reduced-motion: reduce)";

/**
 * Scroll reveal that actually honours prefers-reduced-motion.
 *
 * React Bits' AnimatedContent runs on GSAP, which ignores the CSS
 * reduced-motion rules in globals.css - and its wrapper starts out
 * `visibility: hidden`, so skipping the animation has to mean not rendering
 * it at all, or the content never appears.
 *
 * matchMedia is read in an effect rather than via motion's useReducedMotion:
 * that hook snapshots a module-level singleton on first render, which was
 * returning stale values across chunk boundaries here.
 */
export function Reveal({ children, className, ...props }: RevealProps) {
  const [reduceMotion, setReduceMotion] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia(QUERY);
    setReduceMotion(mq.matches);
    const onChange = (e: MediaQueryListEvent) => setReduceMotion(e.matches);
    mq.addEventListener("change", onChange);
    return () => mq.removeEventListener("change", onChange);
  }, []);

  if (reduceMotion) {
    return <div className={className}>{children}</div>;
  }

  return (
    <AnimatedContent className={className} {...props}>
      {children}
    </AnimatedContent>
  );
}
