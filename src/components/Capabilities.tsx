"use client";

import React from "react";
import Image from "next/image";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Reveal } from "@/components/ui/Reveal";

const IMG_STACK = "/projects/drift.png";
const IMG_HARDWARE = "/projects/swadaya-panen.png";

function Tag({ children }: { children: React.ReactNode }) {
  return (
    <span className="pill border border-line-strong px-3 py-1.5 font-mono text-[11px] text-fg-2">
      {children}
    </span>
  );
}

export function Capabilities() {
  return (
    <section id="focus" className="relative py-24 sm:py-36">
      <div className="mx-auto max-w-[1400px] px-4 sm:px-6 lg:px-10">
        <SectionHeading
          title="What I actually do"
          lead="Three areas where I have shipped real work, not coursework. Everything below has run in front of users or in the field."
        />

        <div className="grid grid-cols-1 gap-4 lg:grid-cols-12">
          {/* Full-stack: photographic ground */}
          <Reveal distance={44} duration={0.9} ease="power3.out" className="lg:col-span-7">
            <article className="relative flex h-full min-h-[26rem] flex-col justify-end overflow-hidden p-8 sm:p-10">
              <Image
                src={IMG_STACK}
                alt=""
                fill
                sizes="(max-width: 1024px) 100vw, 58vw"
                className="photo object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-bg via-bg/85 to-bg/40" />
              <div className="relative">
                <h3 className="type-title text-[clamp(1.5rem,2.4vw,2.1rem)] text-fg">
                  Full-stack and backend
                </h3>
                <p className="mt-4 max-w-md text-sm leading-relaxed text-fg-2">
                  High-throughput apps on Next.js, React, Node, and Laravel. Secure
                  auth, WebSocket channels, versioned REST contracts, and normalised
                  relational schemas.
                </p>
                <div className="mt-7 flex flex-wrap gap-1.5">
                  <Tag>Next.js</Tag>
                  <Tag>TypeScript</Tag>
                  <Tag>Laravel</Tag>
                  <Tag>MySQL</Tag>
                </div>
              </div>
            </article>
          </Reveal>

          {/* Governance: tinted ground, no photograph */}
          <Reveal
            distance={44}
            duration={0.9}
            delay={0.08}
            ease="power3.out"
            className="lg:col-span-5"
          >
            <article
              className="flex h-full min-h-[26rem] flex-col justify-between border border-line p-8 sm:p-10"
              style={{
                background:
                  "linear-gradient(155deg, var(--accent-wash), transparent 62%), var(--surface)",
              }}
            >
              <div>
                <h3 className="type-title text-[clamp(1.5rem,2.4vw,2.1rem)] text-fg">
                  Running the room
                </h3>
                <p className="mt-4 text-sm leading-relaxed text-fg-2">
                  Chief of the Organisational Management and Development Unit at
                  HIMASKOM UNDIP. Structural reform, KPI frameworks, and mentoring
                  division leads through a full cycle.
                </p>
              </div>
              <p className="mt-8 border-t border-line pt-6 text-sm text-fg-2">
                <span className="text-fg">Chief, OM&amp;D Unit</span>
                <br />
                HIMASKOM, Diponegoro University
              </p>
            </article>
          </Reveal>

          {/* Hardware: wide split, image on the right */}
          <Reveal
            distance={44}
            duration={0.9}
            delay={0.12}
            ease="power3.out"
            className="lg:col-span-12"
          >
            <article className="grid min-h-[22rem] grid-cols-1 border border-line lg:grid-cols-2">
              <div className="flex flex-col justify-center p-8 sm:p-12">
                <h3 className="type-title text-[clamp(1.5rem,2.4vw,2.1rem)] text-fg">
                  Sensors, firmware, and models
                </h3>
                <p className="mt-4 max-w-lg text-sm leading-relaxed text-fg-2">
                  Microcontroller firmware for agricultural telemetry, thermal imaging
                  CNNs for pest detection, and search-and-rescue robotics research at
                  URDC Andromeda.
                </p>
                <div className="mt-8 grid grid-cols-1 gap-6 sm:grid-cols-3">
                  {[
                    { k: "Swadaya Panen", v: "Field telemetry" },
                    { k: "NPK Analyzer", v: "Soil nutrients" },
                    { k: "Rat Detection", v: "Thermal vision" },
                  ].map((cell) => (
                    <div key={cell.k} className="border-t border-line pt-4">
                      <span className="block text-sm text-fg">{cell.k}</span>
                      <span className="mt-1 block text-[13px] text-fg-3">{cell.v}</span>
                    </div>
                  ))}
                </div>
              </div>
              <div className="relative min-h-[16rem] lg:min-h-full">
                <Image
                  src={IMG_HARDWARE}
                  alt=""
                  fill
                  sizes="(max-width: 1024px) 100vw, 50vw"
                  className="photo object-cover"
                />
              </div>
            </article>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
