"use client";

import React from "react";
import ScrollReveal from "@/components/reactbits/ScrollReveal";
import { Reveal } from "@/components/ui/Reveal";
import { Figure } from "@/components/ui/Figure";
import { useReducedMotion } from "@/lib/useReducedMotion";

const STATEMENT =
  "Good engineering is invisible. I care about the seams nobody sees: the query that stays fast at scale, the sensor that keeps reporting after the rain, the interface a stranger understands without being told.";

const STATEMENT_CLASS =
  "type-title text-[clamp(1.6rem,3.4vw,2.9rem)] leading-[1.22] text-fg";

const FIGURES = [
  { to: 8, suffix: "", label: "Projects shipped across web, IoT, and ML" },
  { to: 26, suffix: "", label: "Languages, frameworks, and tools used in delivery" },
  { to: 3, suffix: "", label: "Domains covered: full-stack, hardware, machine learning" },
  { to: 2, suffix: "+", label: "Industry roles in web development and IT operations" },
];

export function Approach() {
  const reduceMotion = useReducedMotion();

  return (
    <section id="about" className="relative py-24 sm:py-36">
      <div className="mx-auto max-w-[1400px] px-4 sm:px-6 lg:px-10">
        <div className="max-w-4xl">
          {reduceMotion ? (
            <p className={STATEMENT_CLASS}>{STATEMENT}</p>
          ) : (
            /* Scrubbed word reveal: the copy is the section, so the motion
               paces the reading rather than decorating it. */
            <ScrollReveal
              baseOpacity={0.1}
              baseRotation={1.5}
              blurStrength={4}
              rotationEnd="bottom 68%"
              wordAnimationEnd="bottom 64%"
              containerClassName="!my-0"
              textClassName="!type-title !text-[clamp(1.6rem,3.4vw,2.9rem)] !leading-[1.22] !text-fg"
            >
              {STATEMENT}
            </ScrollReveal>
          )}
        </div>

        <Reveal distance={36} duration={0.85} ease="power3.out">
          <dl className="mt-20 grid grid-cols-1 gap-px border-t border-line bg-line sm:mt-28 sm:grid-cols-2 lg:grid-cols-4">
            {FIGURES.map((figure) => (
              <div key={figure.label} className="bg-bg px-1 pt-8 sm:px-7">
                <dd className="type-display text-[clamp(3rem,5vw,4.5rem)] tabular-nums text-fg">
                  <Figure to={figure.to} duration={1.7} className="inline" />
                  <span className="text-fg-3">{figure.suffix}</span>
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
  );
}
