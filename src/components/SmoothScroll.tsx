"use client";

import { useEffect, useRef } from "react";
import { ReactLenis, type LenisRef } from "lenis/react";
import { usePathname } from "next/navigation";
import { useReducedMotion } from "motion/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

/**
 * Lenis smooth scroll, driven by the GSAP ticker.
 *
 * autoRaf is off on purpose: React Bits' scroll components (ScrollReveal,
 * ScrollFloat, AnimatedContent) run on ScrollTrigger. Two independent RAF
 * loops make those animations lag a frame behind the scroll position, so
 * Lenis is stepped from gsap.ticker and ScrollTrigger.update() is fired on
 * every Lenis scroll event instead.
 */
export function SmoothScroll({ children }: { children: React.ReactNode }) {
  const lenisRef = useRef<LenisRef>(null);
  const reduceMotion = useReducedMotion();
  const pathname = usePathname();

  // Lenis owns the scroll position, so it survives a route change and the new
  // page would open part-way down. Jump to the top unless the URL names an
  // anchor, in which case let the browser resolve it.
  useEffect(() => {
    if (window.location.hash) return;
    lenisRef.current?.lenis?.scrollTo(0, { immediate: true });
  }, [pathname]);

  useEffect(() => {
    if (reduceMotion) return;

    const update = (time: number) => lenisRef.current?.lenis?.raf(time * 1000);
    gsap.ticker.add(update);
    gsap.ticker.lagSmoothing(0);

    const lenis = lenisRef.current?.lenis;
    lenis?.on("scroll", ScrollTrigger.update);

    return () => {
      gsap.ticker.remove(update);
      lenis?.off("scroll", ScrollTrigger.update);
    };
  }, [reduceMotion]);

  // Not just "skip the animation": Lenis takes over the scroll container, so
  // mounting it without a running rAF loop would freeze the page outright.
  if (reduceMotion) return <>{children}</>;

  return (
    <ReactLenis
      root
      ref={lenisRef}
      options={{
        autoRaf: false,
        lerp: 0.085,
        wheelMultiplier: 0.9,
        touchMultiplier: 1.4,
        syncTouch: false,
        // Lenis intercepts in-page #links so nav anchors ease instead of jumping.
        anchors: { offset: -96, duration: 1.4 },
      }}
    >
      {children}
    </ReactLenis>
  );
}
