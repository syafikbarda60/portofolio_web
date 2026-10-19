"use client";

import React, { useRef, useState } from "react";
import { AnimatePresence, LayoutGroup, motion, useMotionValueEvent, useScroll } from "motion/react";
import { useLenis } from "lenis/react";
import { ChapterTitle } from "@/components/ui/SectionHeading";
import { Reveal } from "@/components/ui/Reveal";
import { StoryMark, type StoryShape } from "@/components/three/StoryField";
import { SKILL_CATEGORIES, type SkillCategory } from "@/data/portfolioData";
import { useReducedMotion } from "@/lib/useReducedMotion";

const TITLE = "Skills";
const LEAD = "Levels are judged against project work I have shipped, not courses taken.";

// One story shape per category, in data order: a browser for the web, drums
// for data, a radio mast for the field work, a branch graph for practice.
const SHAPES: StoryShape[] = ["browser", "database", "signal", "branch"];
const LABELS = ["Web", "Backend", "IoT & ML", "Practice"];
// Rest point of each shape within the pinned scroll, and the boundaries
// halfway between them where the copy changes over.
const REST = [0.08, 0.36, 0.64, 0.92];
const EDGES = [0.22, 0.5, 0.78];

function CategoryCopy({ category }: { category: SkillCategory }) {
  return (
    <>
      <h3 className="type-title text-[clamp(1.5rem,2.4vw,2.2rem)] text-fg">{category.title}</h3>
      <ul className="mt-6 grid gap-4 sm:gap-5">
        {category.items.map((item) => (
          <li key={item.name} className="border-t border-line pt-3 sm:pt-4">
            <div className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1">
              <span className="text-[15px] font-medium text-fg">{item.name}</span>
              <span className="type-data">{item.level}</span>
            </div>
            <p className="mt-1.5 hidden max-w-md text-[13px] leading-relaxed text-fg-2 sm:block">
              {item.description}
            </p>
          </li>
        ))}
      </ul>
    </>
  );
}

export function SkillsSection() {
  const reduceMotion = useReducedMotion();
  const section = useRef<HTMLElement>(null);
  const lenis = useLenis();
  const [active, setActive] = useState(0);

  const { scrollYProgress } = useScroll({ target: section, offset: ["start start", "end end"] });
  useMotionValueEvent(scrollYProgress, "change", (p) => {
    const i = EDGES.filter((e) => p >= e).length;
    setActive((a) => (a === i ? a : i));
  });

  const jump = (i: number) => {
    const el = section.current;
    if (!el) return;
    const top = el.getBoundingClientRect().top + window.scrollY;
    const y = top + (el.offsetHeight - window.innerHeight) * REST[i];
    if (lenis) lenis.scrollTo(y, { duration: 1.2 });
    else window.scrollTo({ top: y, behavior: "smooth" });
  };

  if (reduceMotion) {
    return (
      <section id="skills" className="relative py-24 sm:py-36">
        <div className="mx-auto max-w-[1400px] px-4 sm:px-6 lg:px-10">
          <ChapterTitle>{TITLE}</ChapterTitle>
          <p className="type-lead mb-14 mt-6">{LEAD}</p>
          <div className="grid grid-cols-1 gap-x-16 gap-y-16 md:grid-cols-2">
            {SKILL_CATEGORIES.map((c) => (
              <Reveal key={c.title}>
                <CategoryCopy category={c} />
              </Reveal>
            ))}
          </div>
        </div>
      </section>
    );
  }

  return (
    <section ref={section} id="skills" className="relative h-[360vh]">
      {SHAPES.map((shape, i) => (
        <StoryMark key={shape} shape={shape} at={`calc(${REST[i]} * (100% - 100vh) + 50vh)`} />
      ))}

      <div className="sticky top-0 flex h-[100dvh] flex-col overflow-hidden pt-[88px]">
        <div className="mx-auto w-full max-w-[1400px] px-4 sm:px-6 lg:px-10">
          <ChapterTitle>{TITLE}</ChapterTitle>
        </div>

        <div className="mx-auto grid min-h-0 w-full max-w-[1400px] flex-1 grid-cols-1 grid-rows-[minmax(0,1fr)_auto] px-4 pb-8 sm:px-6 lg:grid-cols-12 lg:grid-rows-1 lg:items-center lg:px-10 lg:pb-12">
          {/* Stage for the story field's shape. */}
          <div className="relative min-h-[30dvh] lg:col-span-8 lg:h-full">
            <div
              aria-hidden
              className="absolute bottom-[8%] left-1/2 h-[16%] w-[62%] -translate-x-1/2 rounded-[50%] bg-[radial-gradient(closest-side,var(--accent-wash),transparent)] blur-md"
            />
          </div>

          <div className="lg:col-span-4">
            <LayoutGroup id="skill-tabs">
              <div role="tablist" aria-label="Skill areas" className="mb-6 flex flex-wrap gap-1.5">
                {LABELS.map((label, i) => {
                  const on = active === i;
                  return (
                    <button
                      key={label}
                      role="tab"
                      aria-selected={on}
                      onClick={() => jump(i)}
                      className={`pill relative inline-flex min-h-11 cursor-pointer items-center px-4 text-[13px] font-medium transition-colors duration-300 ${
                        on ? "text-accent-ink" : "border border-line text-fg-2 hover:border-line-strong hover:text-fg"
                      }`}
                    >
                      {on && (
                        <motion.span
                          layoutId="skill-tab"
                          className="pill absolute inset-0 bg-accent"
                          transition={{ type: "spring", stiffness: 400, damping: 36 }}
                        />
                      )}
                      <span className="relative">{label}</span>
                    </button>
                  );
                })}
              </div>
            </LayoutGroup>

            <div className="relative min-h-[17rem] sm:min-h-[22rem]" aria-live="polite">
              <AnimatePresence mode="wait" initial={false}>
                <motion.div
                  key={active}
                  initial={{ opacity: 0, y: 18 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -12 }}
                  transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
                >
                  <CategoryCopy category={SKILL_CATEGORIES[active]} />
                </motion.div>
              </AnimatePresence>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
