"use client";

import { useRef, useState } from "react";
import Link from "next/link";
import {
  AnimatePresence,
  LayoutGroup,
  motion,
  useMotionValueEvent,
  useScroll,
  useTransform,
} from "motion/react";
import { StoryMark, type StoryShape } from "@/components/three/StoryField";
import { useLenis } from "lenis/react";
import { ChapterTitle } from "@/components/ui/SectionHeading";
import { Reveal } from "@/components/ui/Reveal";
import { useReducedMotion } from "@/lib/useReducedMotion";


type Domain = {
  label: string;
  title: string;
  body: string;
  tools: string;
  projects: { id: string; name: string }[];
};

// Copy and project lists come from the project data; nothing here is new.
const DOMAINS: Domain[] = [
  {
    label: "Software",
    title: "Full-stack and backend",
    body: "Web platforms on Next.js, React, Express, and Laravel: auth, real-time channels, REST contracts, and relational schemas that other people keep running.",
    tools: "Next.js, TypeScript, Laravel, Express, MySQL, PostgreSQL",
    projects: [
      { id: "creation-exam", name: "CREATION 2026 Exam" },
      { id: "drift", name: "Drift" },
      { id: "sitiga", name: "SITIGA" },
      { id: "whs-portal", name: "WHS Maritime" },
    ],
  },
  {
    label: "IoT",
    title: "Sensors and firmware",
    body: "Microcontroller nodes for rice fields: soil NPK, microclimate, and pest telemetry, running on solar and reporting to dashboards I build on top.",
    tools: "ESP32, C++, Raspberry Pi, NPK probes, Laravel APIs",
    projects: [
      { id: "swadaya-panen", name: "Swadaya Panen" },
      { id: "npk-monitoring", name: "NPK Soil Analyzer" },
    ],
  },
  {
    label: "Machine learning",
    title: "Models in the field",
    body: "A convolutional neural network trained on MLX90640 thermal captures to separate rat activity from background heat at night, feeding the repeller nodes.",
    tools: "Python, CNN, thermal vision",
    projects: [{ id: "rat-pest-detection", name: "Thermal Rat Pest Detection" }],
  },
];

const TITLE = "What I work on";

// Scroll progress through the pinned section -> morph value. Each shape holds
// for a stretch so it can be read, then travels to the next.
const STOPS = [0, 0.22, 0.4, 0.6, 0.78, 1];
const MORPH = [0, 0, 1, 1, 2, 2];
// Where in the section each shape sits at rest, for the tabs to jump to.
const REST = [0.1, 0.5, 0.9];
const SHAPES: StoryShape[] = ["code", "chip", "net"];

function DomainCopy({ domain }: { domain: Domain }) {
  return (
    <>
      <h3 className="type-title text-[clamp(1.6rem,2.6vw,2.4rem)] text-fg">{domain.title}</h3>
      <p className="mt-4 max-w-[46ch] text-sm leading-relaxed text-fg-2 sm:text-[15px]">
        {domain.body}
      </p>
      <p className="type-data mt-5 text-fg-2">{domain.tools}</p>
      <ul className="mt-6 flex flex-wrap gap-x-5 gap-y-2">
        {domain.projects.map((p) => (
          <li key={p.id}>
            <Link
              href={`/work/${p.id}`}
              className="text-sm text-fg underline decoration-line-strong underline-offset-4 transition-colors hover:text-accent-text hover:decoration-accent"
            >
              {p.name}
            </Link>
          </li>
        ))}
      </ul>
    </>
  );
}

export function Capabilities() {
  const reduceMotion = useReducedMotion();
  const section = useRef<HTMLElement>(null);
  const lenis = useLenis();
  const [active, setActive] = useState(0);

  const { scrollYProgress } = useScroll({ target: section, offset: ["start start", "end end"] });
  const target = useTransform(scrollYProgress, STOPS, MORPH);
  useMotionValueEvent(target, "change", (v) => setActive(Math.round(v)));

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
      <section id="focus" className="relative py-24 sm:py-36">
        <div className="mx-auto max-w-[1400px] px-4 sm:px-6 lg:px-10">
          <ChapterTitle className="mb-14 sm:mb-20">{TITLE}</ChapterTitle>
          <div className="grid gap-16">
            {DOMAINS.map((d) => (
              <Reveal key={d.label}>
                <p className="type-data mb-3">{d.label}</p>
                <DomainCopy domain={d} />
              </Reveal>
            ))}
          </div>
        </div>
      </section>
    );
  }

  return (
    <section ref={section} id="focus" className="relative h-[340vh]">
      {/* The story field takes each shape as its rest point reaches mid-screen. */}
      {SHAPES.map((shape, i) => (
        <StoryMark key={shape} shape={shape} at={`calc(${REST[i]} * (100% - 100vh) + 50vh)`} />
      ))}
      <div className="sticky top-0 flex h-[100dvh] flex-col overflow-hidden pt-[88px]">
        <div className="mx-auto w-full max-w-[1400px] px-4 sm:px-6 lg:px-10">
          <ChapterTitle>{TITLE}</ChapterTitle>
        </div>

        <div className="mx-auto grid min-h-0 w-full max-w-[1400px] flex-1 grid-cols-1 grid-rows-[minmax(0,1fr)_auto] px-4 pb-8 sm:px-6 lg:grid-cols-12 lg:grid-rows-1 lg:items-center lg:px-10 lg:pb-12">
          {/* Stage for the story field's shape (it lives behind the page). */}
          <div className="relative min-h-[40dvh] lg:col-span-8 lg:h-full">
            {/* A faint pool of light under the object grounds it in space. */}
            <div
              aria-hidden
              className="absolute bottom-[8%] left-1/2 h-[16%] w-[62%] -translate-x-1/2 rounded-[50%] bg-[radial-gradient(closest-side,var(--accent-wash),transparent)] blur-md"
            />

          </div>

          <div className="lg:col-span-4">
            <LayoutGroup id="domain-tabs">
              <div role="tablist" aria-label="Areas of work" className="mb-6 flex flex-wrap gap-1.5 lg:mb-8">
                {DOMAINS.map((d, i) => {
                  const on = active === i;
                  return (
                    <button
                      key={d.label}
                      role="tab"
                      aria-selected={on}
                      onClick={() => jump(i)}
                      className={`pill relative inline-flex min-h-11 cursor-pointer items-center px-4 text-[13px] font-medium transition-colors duration-300 ${
                        on ? "text-accent-ink" : "border border-line text-fg-2 hover:border-line-strong hover:text-fg"
                      }`}
                    >
                      {on && (
                        <motion.span
                          layoutId="domain-tab"
                          className="pill absolute inset-0 bg-accent"
                          transition={{ type: "spring", stiffness: 400, damping: 36 }}
                        />
                      )}
                      <span className="relative">{d.label}</span>
                    </button>
                  );
                })}
              </div>
            </LayoutGroup>

            <div className="relative min-h-[15rem] sm:min-h-[16rem]" aria-live="polite">
              <AnimatePresence mode="wait" initial={false}>
                <motion.div
                  key={active}
                  initial={{ opacity: 0, y: 18 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -12 }}
                  transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
                >
                  <DomainCopy domain={DOMAINS[active]} />
                </motion.div>
              </AnimatePresence>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
