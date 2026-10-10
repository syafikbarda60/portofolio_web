"use client";

import React from "react";
import Image from "next/image";
import { motion } from "motion/react";
import { ArrowRight } from "@phosphor-icons/react";
import Magnet from "@/components/reactbits/Magnet";
import { useReducedMotion } from "@/lib/useReducedMotion";

// Square source (1080x1080), so both crops need an explicit object-position
// to keep the subject in frame rather than centring on the background.
const HERO_IMAGE = "/syafik.jpg";
const EASE = [0.22, 1, 0.36, 1] as const;

export function HeroSection() {
  const reduceMotion = useReducedMotion();

  // The name rises out of a clipped line; the rest follows in reading order.
  const rise = (delay: number) =>
    reduceMotion
      ? {}
      : {
          initial: { opacity: 0, y: 16 },
          animate: { opacity: 1, y: 0 },
          transition: { duration: 0.7, delay, ease: EASE },
        };

  return (
    <section className="relative flex min-h-[100dvh] items-center overflow-hidden">
      {/* Mobile and tablet: the photograph takes the top band and dissolves
          into the background, so the copy below it never sits on a face. */}
      <div className="absolute inset-x-0 top-0 h-[56svh] lg:hidden">
        <Image
          src={HERO_IMAGE}
          alt="Syafik Barda"
          fill
          priority
          sizes="100vw"
          className="photo object-[100%_center] object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-bg/25 via-bg/45 to-bg" />
      </div>

      {/* Desktop: the photograph bleeds off the right edge. */}
      <motion.div
        className="absolute right-0 top-0 hidden h-full w-[44vw] lg:block"
        {...(reduceMotion
          ? {}
          : {
              initial: { opacity: 0, scale: 1.04 },
              animate: { opacity: 1, scale: 1 },
              transition: { duration: 1.2, ease: EASE },
            })}
      >
        <Image
          src={HERO_IMAGE}
          alt="Syafik Barda"
          fill
          priority
          sizes="44vw"
          className="photo object-[85%_center] object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-bg via-bg/25 to-transparent" />
      </motion.div>

      <div className="relative z-10 mx-auto w-full max-w-[1400px] px-4 pb-16 pt-[calc(52svh+1rem)] sm:px-6 lg:px-10 lg:pt-24">
        <div className="max-w-[40rem]">
          <motion.p {...rise(0)} className="text-sm text-fg-2">
            Computer Engineering, Diponegoro University
          </motion.p>

          <h1 className="type-display mt-5 text-[clamp(3rem,8vw,6.25rem)] text-fg">
            {["Syafik", "Barda"].map((word, i) => (
              <span key={word} className="block overflow-hidden pb-[0.06em]">
                <motion.span
                  className="block"
                  {...(reduceMotion
                    ? {}
                    : {
                        initial: { y: "105%" },
                        animate: { y: 0 },
                        transition: { duration: 0.9, delay: 0.1 + i * 0.08, ease: EASE },
                      })}
                >
                  {word}
                </motion.span>
              </span>
            ))}
          </h1>

          <motion.p {...rise(0.35)} className="type-lead mt-7">
            I build web platforms, backend services, and the firmware that feeds
            them data from the field.
          </motion.p>

          <motion.div {...rise(0.45)} className="mt-10 flex flex-wrap items-center gap-3">
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
                className="pill inline-flex items-center border border-line-strong px-7 py-4 text-sm font-medium text-fg transition-colors duration-300 hover:border-accent hover:text-accent-text"
              >
                Get in touch
              </motion.a>
            </Magnet>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
