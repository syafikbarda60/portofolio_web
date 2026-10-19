"use client";

import { useSyncExternalStore } from "react";

/**
 * The loading intro, shared by the splash, the story field, and the hero.
 *
 *   playing  splash is up; the story field cycles through the splash shapes
 *   leaving  the cloud bursts into dust while the splash lifts; the hero
 *            starts its entrance
 *   done     normal page
 *
 * The inline script in the root layout marks the document `data-intro="done"`
 * before first paint when the intro should not play (already seen this
 * session, reduced motion, or the visit did not start on the home page), so
 * the splash never flashes in those cases.
 */
export type IntroPhase = "playing" | "leaving" | "done";

/** One morph step of the splash cycle, and how long the exit takes. */
export const SPLASH_STEP_MS = 1150;
export const LEAVE_MS = 1300;
export const SPLASH_SHAPES = ["code", "chip", "net"] as const;
export const SPLASH_LABELS = ["Software", "Hardware", "Machine learning"];

export const INTRO_KEY = "intro-seen";

const listeners = new Set<() => void>();
const state = {
  phase: (typeof document !== "undefined" && document.documentElement.dataset.intro === "done"
    ? "done"
    : "playing") as IntroPhase,
  t0: 0,
  leaveAt: 0,
  cloudReady: false,
};
const emit = () => listeners.forEach((l) => l());

export const intro = {
  get phase() {
    return state.phase;
  },
  get t0() {
    return state.t0;
  },
  get leaveAt() {
    return state.leaveAt;
  },
  get cloudReady() {
    return state.cloudReady;
  },
  start() {
    if (!state.t0) state.t0 = performance.now();
  },
  setCloudReady() {
    state.cloudReady = true;
    // Restart the cycle from its first shape now that the cloud can show it,
    // so a slow 3D start never skips "Software".
    if (state.phase === "playing") state.t0 = performance.now();
    emit();
  },
  leave() {
    if (state.phase !== "playing") return;
    state.leaveAt = performance.now();
    state.phase = "leaving";
    emit();
  },
  finish() {
    state.phase = "done";
    document.documentElement.dataset.intro = "done";
    try {
      sessionStorage.setItem(INTRO_KEY, "1");
    } catch {
      // Storage blocked: the intro may play again next load, nothing breaks.
    }
    emit();
  },
  subscribe(fn: () => void) {
    listeners.add(fn);
    return () => listeners.delete(fn);
  },
};

/** Which splash shape is showing at time `now`, and how far into the morph. */
export function splashFrame(now: number) {
  const k = Math.max(0, now - state.t0) / SPLASH_STEP_MS;
  const i = Math.floor(k);
  const f = k - i;
  // Hold the shape for the first 55% of the step, then morph to the next.
  const t = Math.min(1, Math.max(0, (f - 0.55) / 0.45));
  const mix = t * t * (3 - 2 * t);
  const n = SPLASH_SHAPES.length;
  return { from: i % n, to: (i + 1) % n, mix, label: Math.floor(k + 0.225) % n };
}

export function useIntroPhase(): IntroPhase {
  return useSyncExternalStore(
    intro.subscribe,
    () => state.phase,
    // The server renders the splash; the inline script hides it when skipped.
    () => "playing"
  );
}
