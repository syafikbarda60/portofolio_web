"use client";

import React, { useRef } from "react";
import dynamic from "next/dynamic";
import { useScroll } from "motion/react";
import { StoryMark } from "@/components/three/StoryField";
import { Reveal } from "@/components/ui/Reveal";
import { Figure } from "@/components/ui/Figure";
import { EXPERIENCES, type ProjectItem } from "@/data/portfolioData";

const FieldTerrain = dynamic(
  () => import("@/components/three/FieldTerrain").then((m) => m.FieldTerrain),
  { ssr: false }
);

export function Approach({ projects }: { projects: ProjectItem[] }) {
  const statement = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({ target: statement, offset: ["start end", "end start"] });

  // Counted from the data, so the figures stay true as projects are added.
  const FIGURES = [
    { to: projects.length, label: "Projects built across web, IoT, and ML" },
    {
      to: new Set(projects.flatMap((p) => p.techStack)).size,
      label: "Languages, frameworks, and tools used across them",
    },
    {
      to: new Set(projects.map((p) => p.category)).size,
      label: "Domains: full-stack web, IoT and hardware, mobile and AI",
    },
    {
      to: EXPERIENCES.filter((e) => e.type === "Work Experience").length,
      label: "Industry roles in web development and IT operations",
    },
  ];

  return (
    <>
      {/* The field the statement (at the end of the work corridor) talks
          about, in its own band, then the figures. */}
      <section ref={statement} aria-label="In the field" className="relative overflow-hidden">
        <div className="relative h-[48vh] sm:h-[60vh]">
          <FieldTerrain progress={scrollYProgress} />
          <StoryMark shape="ground" stage />
        </div>
      </section>

      <section aria-label="In numbers" className="relative pb-24 sm:pb-36">
        <div className="mx-auto max-w-[1400px] px-4 sm:px-6 lg:px-10">
          <Reveal distance={36}>
            <dl className="grid grid-cols-1 gap-px border-t border-line bg-line sm:grid-cols-2 lg:grid-cols-4">
              {FIGURES.map((figure) => (
                <div key={figure.label} className="bg-bg px-1 pt-8 sm:px-7">
                  <dd className="type-display text-[clamp(3rem,5vw,4.5rem)] tabular-nums text-fg">
                    <Figure to={figure.to} duration={1.7} className="inline" />
                  </dd>
                  <dt className="mt-4 max-w-[24ch] pb-8 text-[13px] leading-relaxed text-fg-2">
                    {figure.label}
                  </dt>
                </div>
              ))}
            </dl>
          </Reveal>
        </div>
      </section>
    </>
  );
}
