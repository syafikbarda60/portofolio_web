"use client";

import React from "react";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Reveal } from "@/components/ui/Reveal";
import { SKILL_CATEGORIES } from "@/data/portfolioData";

export function SkillsSection() {
  return (
    <section id="skills" className="relative py-24 sm:py-36">
      <div className="mx-auto max-w-[1400px] px-4 sm:px-6 lg:px-10">
        <SectionHeading
          title="Skills"
          lead="Levels are judged against project work I have shipped, not courses taken."
        />

        <div className="grid grid-cols-1 gap-x-16 gap-y-20 md:grid-cols-2">
          {SKILL_CATEGORIES.map((category, catIdx) => (
            <Reveal
              key={category.title}
              distance={36}
              delay={(catIdx % 2) * 0.08}
            >
              <div>
                <h3 className="type-title border-b border-line pb-5 text-[clamp(1.2rem,1.8vw,1.5rem)] text-fg">
                  {category.title}
                </h3>

                <div className="mt-8 grid gap-9">
                  {category.items.map((item) => (
                    <div key={item.name}>
                      <div className="flex flex-wrap items-center justify-between gap-x-6 gap-y-2">
                        <span className="text-[15px] font-medium text-fg">
                          {item.name}
                        </span>
                        <span className="type-data">{item.level}</span>
                      </div>
                      <p className="mt-2 max-w-md text-[13px] leading-relaxed text-fg-2">
                        {item.description}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
