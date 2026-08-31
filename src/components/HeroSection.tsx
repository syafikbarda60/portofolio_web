"use client";

import React from "react";
import Image from "next/image";
import Magnet from "@/components/reactbits/Magnet";
import { Reveal } from "@/components/ui/Reveal";
import { ArrowRight } from "@phosphor-icons/react";

// Square source (1080x1080), so both crops need an explicit object-position
// to keep the subject in frame rather than centring on the background.
const HERO_IMAGE = "/syafik.jpg";

export function HeroSection() {
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
      <div className="absolute right-0 top-0 hidden h-full w-[44vw] lg:block">
        <Image
          src={HERO_IMAGE}
          alt="Syafik Barda"
          fill
          priority
          sizes="44vw"
          className="photo object-[85%_center] object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-bg via-bg/25 to-transparent" />
      </div>

      <div className="relative z-10 mx-auto w-full max-w-[1400px] px-4 pb-16 pt-[calc(52svh+1rem)] sm:px-6 lg:px-10 lg:pt-24">
        <div className="max-w-[46rem] lg:max-w-[38rem] xl:max-w-[44rem]">
          <Reveal distance={56} duration={1} ease="power3.out">
            <h1 className="type-display text-[clamp(3.4rem,10vw,7.5rem)] text-fg">
              Hi, I'm 
              <br />
              Syafik Barda
            </h1>
          </Reveal>

          <Reveal distance={28} duration={0.8} ease="power3.out" delay={0.12}>
            <p className="type-lead mt-8">
              I build things that live between hardware and the web — full-stack platforms, backend systems, and IoT telemetry.
            </p>
          </Reveal>

          <Reveal distance={28} duration={0.8} ease="power3.out" delay={0.22}>
            <div className="mt-11 flex flex-wrap items-center gap-3">
              <Magnet padding={70} magnetStrength={5}>
                <a
                  href="#projects"
                  className="pill group inline-flex cursor-pointer items-center gap-2.5 bg-fg px-7 py-4 text-sm font-medium text-bg transition-colors duration-300 hover:bg-accent hover:text-accent-ink"
                >
                  View work
                  <ArrowRight
                    size={16}
                    weight="bold"
                    className="transition-transform duration-300 group-hover:translate-x-1"
                  />
                </a>
              </Magnet>

              <Magnet padding={70} magnetStrength={5}>
                <a
                  href="#contact"
                  className="pill inline-flex cursor-pointer items-center border border-line-strong px-7 py-4 text-sm font-medium text-fg transition-colors duration-300 hover:border-accent hover:text-accent-text"
                >
                  Get in touch
                </a>
              </Magnet>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
