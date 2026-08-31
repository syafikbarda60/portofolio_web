"use client";

import { useEffect, useState } from "react";

const QUERY = "(prefers-reduced-motion: reduce)";

/**
 * Read the OS reduced-motion setting.
 *
 * Deliberately not motion's `useReducedMotion`: that hook snapshots a
 * module-level singleton on first render, and it was returning stale values
 * across chunk boundaries here - some components saw `true` while others in
 * the same page render saw `false`.
 *
 * Starts `false` so the server render and the first client render agree, then
 * corrects after mount.
 */
export function useReducedMotion(): boolean {
  const [reduceMotion, setReduceMotion] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia(QUERY);
    setReduceMotion(mq.matches);
    const onChange = (e: MediaQueryListEvent) => setReduceMotion(e.matches);
    mq.addEventListener("change", onChange);
    return () => mq.removeEventListener("change", onChange);
  }, []);

  return reduceMotion;
}
