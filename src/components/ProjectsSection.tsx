"use client";

import React, { useRef, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import dynamic from "next/dynamic";
import { useRouter } from "next/navigation";
import { AnimatePresence, motion, useScroll, useTransform } from "motion/react";
import { ArrowUpRight } from "@phosphor-icons/react";
import { ChapterTitle } from "@/components/ui/SectionHeading";
import type { ProjectItem } from "@/data/portfolioData";
import { useReducedMotion } from "@/lib/useReducedMotion";
import { getProjectCover } from "@/lib/projectMedia";
import { BEATS, StatementReveal, StatementStatic } from "@/components/StatementReveal";
import { EXIT_START } from "@/components/three/PassageTunnel";

// three.js loads only when this section mounts on the client.
const PassageTunnel = dynamic(
  () => import("@/components/three/PassageTunnel").then((m) => m.PassageTunnel),
  { ssr: false }
);

const TITLE = "Selected work";
const LEAD = "Web platforms, exam proctoring, field telemetry, and a few machine-learning models.";

const ramp = (a: number, b: number, v: number) => Math.min(1, Math.max(0, (v - a) / (b - a)));

/** Scroll spent travelling past each project, as a share of the viewport. */
const PER_PROJECT_VH = 70;
/** Scroll spent closing in on the exit, where the next section waits. */
const APPROACH_VH = 110;
/** Scroll spent reading the story once it fills the screen: per beat. */
const REVEAL_VH = BEATS.length * 95;



/** Plain list: the reduced-motion layout, and the screen-reader index. */
function ProjectList({ projects }: { projects: ProjectItem[] }) {
  return (
    <ul className="border-t border-line">
      {projects.map((project) => (
        <li key={project.id}>
          <Link
            href={`/work/${project.id}`}
            className="group flex items-center gap-5 border-b border-line py-6 sm:gap-8"
          >
            <span className="relative aspect-[16/10] w-28 shrink-0 overflow-hidden bg-surface sm:w-40">
              <Image src={getProjectCover(project)} alt="" fill sizes="160px" className="object-cover" />
            </span>
            <span className="min-w-0 flex-1">
              <span className="type-title block text-[clamp(1.4rem,3vw,2.4rem)] text-fg group-hover:text-accent-text">
                {project.title}
              </span>
              <span className="mt-1 block text-sm text-fg-2">{project.subtitle}</span>
            </span>
          </Link>
        </li>
      ))}
    </ul>
  );
}

export function ProjectsSection({ projects }: { projects: ProjectItem[] }) {
  const reduceMotion = useReducedMotion();
  const router = useRouter();
  const section = useRef<HTMLElement>(null);
  const [active, setActive] = useState(0);

  // One journey in one pinned section: the corridor, then the exit growing
  // until it is the screen, then the statement read word by word.
  const trip = projects.length * PER_PROJECT_VH;
  const total = trip + APPROACH_VH + REVEAL_VH;
  const tripEnd = trip / total;
  const approachEnd = (trip + APPROACH_VH) / total;

  const { scrollYProgress } = useScroll({ target: section, offset: ["start start", "end end"] });
  // Sliding in, before the pin: the corridor opens out of a centred window.
  const { scrollYProgress: entering } = useScroll({ target: section, offset: ["start end", "start start"] });

  // Function transforms on purpose: a range-mapped opacity here gets handed
  // to the browser's ScrollTimeline by Motion, which misreads this pinned
  // section's offsets and left the title showing through the whole trip.
  const titleOpacity = useTransform(scrollYProgress, (v) => 1 - ramp(0, 0.04, v));
  const titleY = useTransform(scrollYProgress, (v) => -40 * ramp(0, 0.04, v));
  const captionOpacity = useTransform(
    scrollYProgress,
    (v) => ramp(0.025, 0.06, v) * (1 - ramp(tripEnd - 0.03, tripEnd, v))
  );
  const enterClip = useTransform(entering, (e) => {
    const k = 1 - e * e * (3 - 2 * e);
    return `inset(${(k * 22).toFixed(2)}% ${(k * 30).toFixed(2)}%)`;
  });

  // The exit: it grows the way a doorway does as you walk up to it, slowly
  // at first and then all at once (apparent size goes as 1 / distance).
  const approach = useTransform(scrollYProgress, (v) => ramp(tripEnd, approachEnd, v));
  const exitScale = useTransform(approach, (a) => 1 / (1 / EXIT_START - a * (1 / EXIT_START - 1)));
  const exitEdge = useTransform(approach, (a) => 1 - ramp(0.82, 1, a));
  // The exit opens in the end wall as the last station goes by.
  const exitOpacity = useTransform(scrollYProgress, (v) => ramp(tripEnd - 0.025, tripEnd + 0.01, v));
  const tunnelOpacity = useTransform(approach, (a) => 1 - ramp(0.55, 0.98, a));
  const reveal = useTransform(scrollYProgress, (v) => ramp(approachEnd, 1 - (0.12 * REVEAL_VH) / total, v));

  if (reduceMotion) {
    return (
      <section id="projects" className="relative py-24 sm:py-36">
        <div className="mx-auto max-w-[1400px] px-4 sm:px-6 lg:px-10">
          <ChapterTitle>{TITLE}</ChapterTitle>
          <p className="type-lead mb-14 mt-6">{LEAD}</p>
          <ProjectList projects={projects} />
        </div>
        <div id="about" className="mx-auto max-w-[1400px] px-4 pt-24 sm:px-6 sm:pt-36 lg:px-10">
          <StatementStatic />
        </div>
      </section>
    );
  }

  const p = projects[active] ?? projects[0];

  return (
    <section
      ref={section}
      id="projects"
      className="relative"
      style={{ height: `${100 + total}vh` }}
    >
      {/* Full-bleed: on desktop it steps out of the column beside the index
          rail (lg:pl-52 on the page), so nothing frames the corridor. */}
      <div
        data-fullbleed
        className="sticky top-0 h-[100dvh] w-full overflow-hidden lg:-ml-52 lg:w-[calc(100%+13rem)]"
      >
        <motion.div className="absolute inset-0" style={{ clipPath: enterClip, opacity: tunnelOpacity }}>
          <PassageTunnel
            projects={projects}
            section={section}
            tripEnd={tripEnd}
            approachEnd={approachEnd}
            onActive={setActive}
            onOpen={(i) => router.push(`/work/${projects[i].id}`)}
          />
        </motion.div>

        {/* The exit at the far end of the corridor is the next section itself:
            it grows as the camera closes in until it is the whole screen, and
            then the statement reads out word by word as the scroll goes on. */}
        <motion.div
          className="pointer-events-none absolute inset-0 origin-center bg-bg"
          style={{ scale: exitScale, opacity: exitOpacity }}
        >
          <motion.span
            aria-hidden
            className="absolute inset-0 border-2 border-line-strong"
            style={{ opacity: exitEdge }}
          />
          <div className="flex h-full w-full items-center lg:pl-52">
            <div className="mx-auto w-full max-w-[1400px] px-4 sm:px-6 lg:px-10">
              <div className="max-w-[72rem] pt-[72px]">
                <StatementReveal progress={reveal} />
              </div>
            </div>
          </div>
        </motion.div>

        {/* Overlays line up with the page's content column. */}
        <div className="pointer-events-none absolute inset-0 lg:pl-52">
          <motion.div
            style={{ opacity: titleOpacity, y: titleY }}
            className="mx-auto w-full max-w-[1400px] px-4 pt-[104px] sm:px-6 lg:px-10"
          >
            <ChapterTitle>{TITLE}</ChapterTitle>
            <p className="type-lead mt-5">{LEAD}</p>
          </motion.div>

          <motion.div
            style={{ opacity: captionOpacity }}
            className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-bg via-bg/80 to-transparent pt-24 lg:pl-52"
          >
            <div className="mx-auto flex w-full max-w-[1400px] flex-wrap items-end justify-between gap-x-10 gap-y-5 px-4 pb-8 sm:px-6 lg:px-10 lg:pb-10">
              <div className="min-h-[6rem] min-w-0" aria-live="polite">
                <AnimatePresence mode="wait" initial={false}>
                  <motion.div
                    key={p.id}
                    initial={{ opacity: 0, y: 14 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
                  >
                    <p className="type-data">
                      {p.category}, {p.year}
                    </p>
                    <h3 className="type-title mt-2 text-[clamp(1.6rem,3vw,2.75rem)] text-fg">{p.title}</h3>
                    <p className="mt-1 text-sm text-fg-2">{p.subtitle}</p>
                  </motion.div>
                </AnimatePresence>
              </div>

              <Link
                href={`/work/${p.id}`}
                aria-label={`Read the ${p.title} case study`}
                className="pill group pointer-events-auto inline-flex min-h-11 items-center gap-2 bg-fg px-6 text-sm font-medium text-bg transition-colors hover:bg-accent hover:text-accent-ink"
              >
                Read the case study
                <ArrowUpRight
                  size={15}
                  weight="bold"
                  className="transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
                />
              </Link>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Where the reading stage sits in the scroll, for #about links and the
          index rail's active chapter. */}
      <div
        id="about"
        aria-hidden
        className="pointer-events-none absolute inset-x-0"
        style={{ top: `${trip + APPROACH_VH * 0.85}vh`, height: `${REVEAL_VH + 100 - APPROACH_VH * 0.15}vh` }}
      />

      {/* The corridor is a picture to assistive tech; this is the real index. */}
      <nav aria-label="All projects" className="sr-only">
        <ProjectList projects={projects} />
      </nav>
    </section>
  );
}
