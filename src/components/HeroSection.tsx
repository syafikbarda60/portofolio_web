"use client";

import React from "react";
import Image from "next/image";
import { motion, useScroll, useSpring, useTransform } from "motion/react";
import { ArrowRight } from "@phosphor-icons/react";
import Magnet from "@/components/reactbits/Magnet";
import { useReducedMotion } from "@/lib/useReducedMotion";
import { StoryMark } from "@/components/three/StoryField";
import { useIntroPhase } from "@/lib/intro";

// Square source (1080x1080). His face sits at roughly 63% across and 46% down,
// so the crop keeps it in the upper right of the frame at every aspect.
const HERO_IMAGE = "/syafik.jpg";
const EASE = [0.22, 1, 0.36, 1] as const;

export function HeroSection() {
  const reduceMotion = useReducedMotion();
  // The entrance waits for the loading intro to start lifting.
  const go = useIntroPhase() !== "playing";

  // The photograph drifts slower than the page and the copy lifts away, so
  // leaving the hero feels like turning past a cover rather than a cut.
  const { scrollY } = useScroll();
  const photoY = useTransform(scrollY, [0, 900], [0, 90]);
  const copyY = useTransform(scrollY, [0, 900], [0, -60]);
  // A function, not a range: Motion would otherwise hand this opacity to the
  // browser's ScrollTimeline, which has misread offsets on this page.
  const copyOpacity = useTransform(scrollY, (y) => Math.max(0, 1 - y / 500));

  // Pointer depth: the photograph shifts against the cursor and the copy with
  // it, so the cover reads as two planes at different distances.
  const px = useSpring(0, { stiffness: 60, damping: 18 });
  const py = useSpring(0, { stiffness: 60, damping: 18 });
  const tiltY = useTransform(px, (v) => v * 10);
  const tiltX = useTransform(py, (v) => v * -7);
  const copyPX = useTransform(px, (v) => v * 8);
  const onPointerMove = (e: React.PointerEvent) => {
    if (reduceMotion || e.pointerType !== "mouse") return;
    px.set(e.clientX / window.innerWidth - 0.5);
    py.set(e.clientY / window.innerHeight - 0.5);
  };

  const rise = (delay: number) =>
    reduceMotion
      ? {}
      : {
          initial: { opacity: 0, y: 16 },
          animate: go ? { opacity: 1, y: 0 } : { opacity: 0, y: 16 },
          transition: { duration: 0.7, delay, ease: EASE },
        };

  return (
    <section
      onPointerMove={onPointerMove}
      onPointerLeave={() => {
        px.set(0);
        py.set(0);
      }}
      className="relative flex min-h-[100dvh] items-end overflow-hidden"
    >
      {/* The story starts unseen behind the cover. */}
      <StoryMark shape="dust" />
      {/* The portrait sits in a frame no larger than the 1080px source, so
          it stays sharp; the frame tilts toward the cursor in 3D instead of
          the photo being zoomed or panned (which upscaled it and blurred it). */}
      <div className="absolute inset-x-4 top-[84px] h-[44svh] sm:inset-x-6 lg:inset-x-auto lg:right-10 lg:top-1/2 lg:h-[min(76vh,46rem)] lg:w-[min(36vw,37rem)] lg:-translate-y-1/2 [perspective:1400px]">
        <motion.div
          className="relative h-full w-full overflow-hidden border border-line-strong"
          style={reduceMotion ? undefined : { rotateY: tiltY, rotateX: tiltX, y: photoY }}
          {...(reduceMotion
            ? {}
            : {
                // Scale only up to 1, so the photo is never upscaled.
                initial: { opacity: 0, scale: 0.94 },
                animate: go ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.94 },
                transition: { duration: 1.1, ease: EASE },
              })}
        >
          <Image
            src={HERO_IMAGE}
            alt="Syafik Barda"
            fill
            priority
            quality={90}
            sizes="(max-width: 1024px) 100vw, 37rem"
            className="photo object-cover object-[63%_45%]"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-bg/60 via-transparent to-transparent lg:hidden" />
        </motion.div>
      </div>

      <motion.div
        className="relative z-10 mx-auto w-full max-w-[1400px] px-4 pb-12 pt-[calc(44svh+108px)] sm:px-6 lg:px-10 lg:pb-16 lg:pt-0"
        style={reduceMotion ? undefined : { y: copyY, x: copyPX, opacity: copyOpacity }}
      >
        <div className="grid max-w-[40rem] grid-cols-1 gap-8 lg:max-w-[46%]">
          <div>
            <motion.p {...rise(0.1)} className="text-sm text-fg-2">
              Computer Engineering, Diponegoro University
            </motion.p>
            <h1 className="type-display mt-4 text-[clamp(3.4rem,10vw,8.75rem)] text-fg">
              {["Syafik", "Barda"].map((word, i) => (
                <span key={word} className="block overflow-hidden pb-[0.06em]">
                  <motion.span
                    className="block"
                    {...(reduceMotion
                      ? {}
                      : {
                          initial: { y: "105%" },
                          animate: { y: go ? 0 : "105%" },
                          transition: { duration: 0.95, delay: 0.2 + i * 0.09, ease: EASE },
                        })}
                  >
                    {word}
                  </motion.span>
                </span>
              ))}
            </h1>
          </div>

          <div className="lg:max-w-[30rem]">
            <motion.p {...rise(0.45)} className="type-lead">
              I build web platforms, backend services, and the firmware that feeds
              them data from the field.
            </motion.p>

            <motion.div {...rise(0.55)} className="mt-8 flex flex-wrap items-center gap-3">
              <Magnet padding={70} magnetStrength={5} disabled={reduceMotion}>
                <motion.a
                  href="#projects"
                  whileTap={{ scale: 0.97 }}
                  className="pill group inline-flex items-center gap-2.5 bg-fg px-7 py-4 text-sm font-medium text-bg transition-colors duration-300 hover:bg-accent hover:text-accent-ink"
                >
                  View work
                  <ArrowRight
                    size={16}
                    weight="bold"
                    className="transition-transform duration-300 group-hover:translate-x-1"
                  />
                </motion.a>
              </Magnet>

              <Magnet padding={70} magnetStrength={5} disabled={reduceMotion}>
                <motion.a
                  href="#contact"
                  whileTap={{ scale: 0.97 }}
                  className="pill inline-flex items-center border border-line-strong bg-bg/40 px-7 py-4 text-sm font-medium text-fg backdrop-blur-sm transition-colors duration-300 hover:border-accent hover:text-accent-text"
                >
                  Get in touch
                </motion.a>
              </Magnet>
            </motion.div>
          </div>
        </div>
      </motion.div>
    </section>
  );
}
