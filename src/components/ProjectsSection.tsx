"use client";

import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { motion, AnimatePresence, LayoutGroup } from "motion/react";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { PROJECTS } from "@/data/portfolioData";
import { useReducedMotion } from "@/lib/useReducedMotion";
import FlowingMenu from "@/components/reactbits/FlowingMenu";
import { ArrowUpRight } from "@phosphor-icons/react";

import { getProjectCover } from "@/lib/projectMedia";

const CATEGORIES = ["All", "Full-Stack Web", "IoT & Hardware", "Mobile & AI"] as const;
type CategoryType = (typeof CATEGORIES)[number];

export function ProjectsSection() {
  const [activeCategory, setActiveCategory] = useState<CategoryType>("All");
  const reduceMotion = useReducedMotion();

  const filtered = PROJECTS.filter(
    (p) => activeCategory === "All" || p.category === activeCategory
  );

  return (
    <section id="projects" className="relative py-24 sm:py-36">
      <div className="mx-auto max-w-[1400px] px-4 sm:px-6 lg:px-10">
        <SectionHeading
          title="Things I have built and shipped"
          lead="Web platforms, real-time proctoring, field telemetry, and machine-learning models. Each one taken past the prototype stage."
          action={
            <LayoutGroup id="work-filter">
              <div
                role="tablist"
                aria-label="Filter projects by category"
                className="flex flex-wrap items-center gap-1.5"
              >
                {CATEGORIES.map((cat) => {
                  const isActive = activeCategory === cat;
                  return (
                    <button
                      key={cat}
                      role="tab"
                      aria-selected={isActive}
                      onClick={() => setActiveCategory(cat)}
                      className={`pill relative inline-flex min-h-11 min-w-[6rem] cursor-pointer items-center justify-center px-5 text-[13px] font-medium transition-colors duration-300 ${
                        isActive
                          ? "text-accent-ink"
                          : "border border-line text-fg-2 hover:border-line-strong hover:text-fg"
                      }`}
                    >
                      {isActive && (
                        <motion.span
                          layoutId="work-filter-pill"
                          className="pill absolute inset-0 bg-accent"
                          transition={{ type: "spring", stiffness: 400, damping: 36 }}
                        />
                      )}
                      <span className="relative z-10">{cat}</span>
                    </button>
                  );
                })}
              </div>
            </LayoutGroup>
          }
        />

        {!reduceMotion && (
          <div
            className="hidden border-t border-line lg:block"
            style={{ height: `${filtered.length * 7.5}rem` }}
          >
            <FlowingMenu
              items={filtered.map((p) => ({
                link: `/work/${p.id}`,
                text: p.title,
                image: getProjectCover(p.id, 600, 400),
              }))}
              speed={22}
              bgColor="transparent"
              textColor="var(--fg)"
              marqueeBgColor="var(--accent)"
              marqueeTextColor="var(--accent-ink)"
              borderColor="var(--line)"
            />
          </div>
        )}

        <div className={`border-t border-line ${reduceMotion ? "" : "lg:hidden"}`}>
          <AnimatePresence mode="popLayout" initial={false}>
            {filtered.map((project, i) => (
              <motion.div
                layout
                key={project.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.32, ease: [0.16, 1, 0.3, 1] }}
              >
                <Link
                  href={`/work/${project.id}`}
                  aria-label={`Read about ${project.title}`}
                  className="group relative block w-full border-b border-line py-7 text-left transition-colors duration-500 hover:border-line-strong sm:py-9"
                >
                  <span className="absolute inset-x-0 bottom-[-1px] h-px origin-left scale-x-0 bg-accent transition-transform duration-700 ease-out group-hover:scale-x-100" />

                  <div className="flex items-start gap-5 lg:items-center lg:gap-12">
                    {/* Mobile carries its own thumbnail: no hover to rely on. */}
                    <div className="relative aspect-[4/3] w-24 shrink-0 overflow-hidden bg-surface sm:w-32">
                      <Image
                        src={getProjectCover(project.id, 400, 300)}
                        alt=""
                        fill
                        sizes="128px"
                        className="photo object-cover"
                      />
                    </div>

                    <div className="min-w-0 flex-1">
                      <h3 className="type-title text-[clamp(1.5rem,4vw,3rem)] text-fg transition-colors duration-300 group-hover:text-accent-text">
                        {project.title}
                      </h3>
                      <p className="mt-2 text-sm text-fg-2 lg:mt-3">
                        {project.subtitle}
                      </p>
                    </div>

                    <div className="hidden shrink-0 items-baseline gap-10 lg:flex">
                      <span className="type-data w-36">{project.category}</span>
                      <span className="type-data w-28">{project.year}</span>
                      <ArrowUpRight
                        size={22}
                        weight="light"
                        className="text-fg-3 transition-all duration-300 group-hover:translate-x-1 group-hover:-translate-y-1 group-hover:text-accent-text"
                      />
                    </div>
                  </div>
                </Link>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      </div>

    </section>
  );
}
