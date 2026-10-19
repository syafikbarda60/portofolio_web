"use client";

import { useEffect, useRef, useState } from "react";
import { AnimatePresence, animate, motion, useMotionValue, useTransform } from "motion/react";
import { useLenis } from "lenis/react";
import { intro, LEAVE_MS, splashFrame, SPLASH_LABELS, SPLASH_STEP_MS, useIntroPhase } from "@/lib/intro";

/** Long enough to see the whole cycle once: software, hardware, ML. */
const MIN_MS = SPLASH_STEP_MS * 2.5;
/** Never hold a reader longer than this, whatever is still loading. */
const MAX_MS = 6500;
const EASE = [0.22, 1, 0.36, 1] as const;

/**
 * The loading screen. The 3D itself is the story field (it rises above this
 * backdrop while the intro plays and cycles the splash shapes); this draws
 * the backdrop, the name, the label for the shape on screen, and progress.
 *
 * Progress is real: web fonts, the page's images (the window load event),
 * and the 3D engine being up. When all three are in and the cycle has played
 * once, the cloud bursts into dust and this backdrop lifts off the hero.
 */
export function Splash() {
  const phase = useIntroPhase();
  const lenis = useLenis();
  const [label, setLabel] = useState(0);
  const progress = useMotionValue(0);
  const pct = useTransform(progress, (v) => `${Math.round(v * 100)}%`);
  const leaving = useRef(false);
  const skip = useRef<() => void>(() => {});

  // Freeze scrolling while the splash is up.
  useEffect(() => {
    if (phase === "done") {
      lenis?.start();
      return;
    }
    lenis?.stop();
  }, [phase, lenis]);

  useEffect(() => {
    if (intro.phase !== "playing") return;
    intro.start();
    window.scrollTo(0, 0);

    let cancelled = false;
    let done = 0;
    const STEPS = 3;
    const step = () => {
      if (cancelled) return;
      done += 1;
      animate(progress, done / STEPS, { duration: 0.6, ease: EASE });
      if (done === STEPS) tryLeave();
    };

    const leave = () => {
      if (leaving.current || cancelled) return;
      leaving.current = true;
      animate(progress, 1, { duration: 0.25 });
      intro.leave();
      window.setTimeout(() => intro.finish(), LEAVE_MS);
    };
    const tryLeave = () => {
      const wait = MIN_MS - (performance.now() - intro.t0);
      if (wait <= 0) leave();
      else window.setTimeout(leave, wait);
    };

    // 1. Fonts.
    (document.fonts?.ready ?? Promise.resolve()).then(step, step);
    // 2. Images and everything else on the page.
    if (document.readyState === "complete") step();
    else window.addEventListener("load", step, { once: true });
    // 3. The 3D engine (or the news that there is none).
    let cloudCounted = false;
    const countCloud = () => {
      if (cloudCounted || !intro.cloudReady) return;
      cloudCounted = true;
      step();
    };
    const unsub = intro.subscribe(countCloud);
    countCloud();

    const cap = window.setTimeout(leave, MAX_MS);
    const tick = window.setInterval(() => setLabel(splashFrame(performance.now()).label), 100);
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") leave();
    };
    window.addEventListener("keydown", onKey);
    skip.current = leave;

    return () => {
      cancelled = true;
      unsub();
      window.clearTimeout(cap);
      window.clearInterval(tick);
      window.removeEventListener("load", step);
      window.removeEventListener("keydown", onKey);
    };
  }, [progress]);

  if (phase === "done") return null;
  const lifting = phase === "leaving";

  return (
    <>
      {/* Backdrop, under the story field's canvas (z 95). */}
      <motion.div
        aria-hidden
        className="splash fixed inset-0 z-[90] bg-bg"
        initial={false}
        animate={{ opacity: lifting ? 0 : 1 }}
        transition={{ duration: 0.9, delay: lifting ? 0.3 : 0, ease: EASE }}
      />

      {/* Copy and controls, above the canvas. */}
      <div
        role="status"
        aria-live="polite"
        aria-label="Loading the portfolio"
        className="splash pointer-events-none fixed inset-0 z-[96]"
      >
        {/* The name sits exactly where the navbar logo is, so it stays put
            as the splash lifts and the page appears around it. */}
        <div className="mx-auto flex h-[72px] max-w-[1400px] items-center px-4 sm:px-6 lg:px-10">
          <span className="type-title text-lg text-fg">Syafik Barda</span>
        </div>

        <motion.div
          className="absolute inset-x-0 bottom-0"
          initial={false}
          animate={{ opacity: lifting ? 0 : 1, y: lifting ? 16 : 0 }}
          transition={{ duration: 0.45, ease: EASE }}
        >
          <div className="mx-auto flex max-w-[1400px] flex-col gap-4 px-4 pb-8 sm:flex-row sm:items-end sm:justify-between sm:gap-6 sm:px-6 sm:pb-10 lg:px-10">
            <div className="min-w-0">
              <div className="relative h-[1.15em] w-full overflow-hidden sm:w-[17ch] text-[clamp(1.6rem,4vw,3rem)]">
                <AnimatePresence mode="popLayout" initial={false}>
                  <motion.span
                    key={label}
                    className="type-title absolute left-0 top-0 whitespace-nowrap text-fg"
                    initial={{ y: "100%" }}
                    animate={{ y: 0 }}
                    exit={{ y: "-100%" }}
                    transition={{ duration: 0.55, ease: EASE }}
                  >
                    {SPLASH_LABELS[label]}
                  </motion.span>
                </AnimatePresence>
              </div>
            </div>

            <div className="flex shrink-0 items-center gap-4">
              <motion.span className="type-data tabular-nums text-fg-2">{pct}</motion.span>
              <button
                type="button"
                onClick={() => skip.current()}
                className="pill pointer-events-auto inline-flex min-h-11 cursor-pointer items-center border border-line px-4 text-[13px] text-fg-2 transition-colors hover:border-line-strong hover:text-fg"
              >
                Skip
              </button>
            </div>
          </div>

          {/* Progress along the bottom edge. */}
          <motion.div
            aria-hidden
            className="h-px origin-left bg-accent"
            style={{ scaleX: progress }}
          />
        </motion.div>
      </div>
    </>
  );
}
