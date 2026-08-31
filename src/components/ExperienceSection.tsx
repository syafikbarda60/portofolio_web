"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Reveal } from "@/components/ui/Reveal";
import { EXPERIENCES } from "@/data/portfolioData";

const TABS = ["Industry", "Leadership"] as const;
type Tab = (typeof TABS)[number];

const typeFor = (tab: Tab) =>
  tab === "Industry" ? "Work Experience" : "Organizational Leadership";

export function ExperienceSection() {
  const [activeTab, setActiveTab] = useState<Tab>("Industry");
  const list = EXPERIENCES.filter((exp) => exp.type === typeFor(activeTab));

  return (
    <section id="experience" className="relative py-24 sm:py-36">
      <div className="mx-auto max-w-[1400px] px-4 sm:px-6 lg:px-10">
        <SectionHeading
          title="Where the lessons came from"
          lead="Software delivery, IT infrastructure operations, and student association governance. The work that taught me how systems and people actually fail."
          action={
            <div
              role="tablist"
              aria-label="Experience type"
              className="flex items-center gap-2"
            >
              {TABS.map((tab) => {
                const isActive = activeTab === tab;
                return (
                  <button
                    key={tab}
                    role="tab"
                    aria-selected={isActive}
                    onClick={() => setActiveTab(tab)}
                    className={`pill relative inline-flex min-h-11 min-w-[7rem] cursor-pointer items-center justify-center px-5 text-[13px] font-medium transition-colors duration-300 ${
                      isActive
                        ? "text-accent-ink"
                        : "border border-line text-fg-2 hover:border-line-strong hover:text-fg"
                    }`}
                  >
                    {isActive && (
                      <motion.span
                        layoutId="experience-tab-pill"
                        className="pill absolute inset-0 bg-accent"
                        transition={{ type: "spring", stiffness: 400, damping: 36 }}
                      />
                    )}
                    <span className="relative z-10">{tab}</span>
                  </button>
                );
              })}
            </div>
          }
        />

        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
          >
            {list.map((exp, index) => (
              <Reveal
                key={`${exp.company}-${index}`}
                distance={36}
                duration={0.8}
                ease="power3.out"
                delay={index * 0.06}
              >
                <article className="grid grid-cols-1 gap-8 border-t border-line py-12 lg:grid-cols-12 lg:gap-12">
                  <div className="lg:col-span-3">
                    <p className="type-data">{exp.period}</p>
                    <p className="mt-3 text-sm text-fg-3">{exp.location}</p>
                  </div>

                  <div className="lg:col-span-6">
                    <h3 className="type-title text-[clamp(1.4rem,2.4vw,2rem)] text-fg">
                      {exp.role}
                    </h3>
                    <p className="mt-2 text-sm font-medium text-fg-2">{exp.company}</p>
                    <p className="mt-6 max-w-xl text-sm leading-relaxed text-fg-2">
                      {exp.summary}
                    </p>

                    <ul className="mt-8 grid gap-5">
                      {exp.achievements.map((item, i) => (
                        <li key={i} className="flex gap-5 text-sm leading-relaxed text-fg-2">
                          <span className="type-data shrink-0 pt-0.5">
                            {String(i + 1).padStart(2, "0")}
                          </span>
                          <span className="max-w-xl">{item}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="lg:col-span-3">
                    <div className="flex flex-wrap gap-1.5">
                      {exp.skills.map((skill) => (
                        <span
                          key={skill}
                          className="pill border border-line px-3 py-1.5 font-mono text-[11px] text-fg-3"
                        >
                          {skill}
                        </span>
                      ))}
                    </div>
                  </div>
                </article>
              </Reveal>
            ))}
          </motion.div>
        </AnimatePresence>
      </div>
    </section>
  );
}
