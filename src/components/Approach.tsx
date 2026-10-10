"use client";

import React from "react";
import ScrollReveal from "@/components/reactbits/ScrollReveal";
import { Reveal } from "@/components/ui/Reveal";
import { Figure } from "@/components/ui/Figure";
import { useReducedMotion } from "@/lib/useReducedMotion";
import { EXPERIENCES, type ProjectItem } from "@/data/portfolioData";

const STATEMENT =
  "Most of what I build leaves the laptop. Sensors in a rice field, an exam that watches every webcam and logs every tab switch, a CMS that someone else maintains after I hand it over. I build for how it runs after the demo, not just for the demo.";

// Sized as the section's only element: it is read like a poster, so it is
// allowed to be the largest type on the page after the hero name.
const STATEMENT_CLASS =
  "type-title text-[clamp(2.1rem,5.2vw,4.75rem)] leading-[1.08] tracking-[-0.02em] text-fg";


export function Approach({ projects }: { projects: ProjectItem[] }) {
  const reduceMotion = useReducedMotion();

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
      <section
        id="about"
        className="relative flex min-h-[100dvh] items-center py-24 sm:py-32"
      >
        <div className="mx-auto w-full max-w-[1400px] px-4 sm:px-6 lg:px-10">
          <div className="max-w-[64rem]">
            {reduceMotion ? (
              <p className={STATEMENT_CLASS}>{STATEMENT}</p>
            ) : (
              /* Scrubbed word reveal: the copy is the section, so the motion
                 paces the reading rather than decorating it. */
              <ScrollReveal
                baseOpacity={0.08}
                baseRotation={1.5}
                blurStrength={5}
                rotationEnd="bottom 70%"
                wordAnimationEnd="bottom 60%"
                containerClassName="!my-0"
                textClassName="!type-title !text-[clamp(2.1rem,5.2vw,4.75rem)] !leading-[1.08] !tracking-[-0.02em] !text-fg"
              >
                {STATEMENT}
              </ScrollReveal>
            )}
          </div>
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
