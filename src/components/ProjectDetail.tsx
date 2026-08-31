"use client";

import React from "react";
import Link from "next/link";
import { ArrowLeft, ArrowUpRight, ArrowRight } from "@phosphor-icons/react";
import { Reveal } from "@/components/ui/Reveal";
import { useReducedMotion } from "@/lib/useReducedMotion";
import { useMediaQuery } from "@/lib/useMediaQuery";
import SplitText from "@/components/reactbits/SplitText";
import AccordionGallery from "@/components/reactbits/AccordionGallery";
import ScrollReveal from "@/components/reactbits/ScrollReveal";
import Magnet from "@/components/reactbits/Magnet";
import type { ProjectItem } from "@/data/portfolioData";
import { getProjectGallery } from "@/lib/projectMedia";

function Meta({ label, value }: { label: string; value: string }) {
  return (
    <div className="border-t border-line pt-5">
      <dt className="type-data">{label}</dt>
      <dd className="mt-2 text-sm text-fg">{value}</dd>
    </div>
  );
}

export function ProjectDetail({
  project,
  prev,
  next,
}: {
  project: ProjectItem;
  prev: ProjectItem;
  next: ProjectItem;
}) {
  const reduceMotion = useReducedMotion();
  const canHover = useMediaQuery("(hover: hover) and (pointer: fine)");
  // AccordionGallery flips to a column under 520px through CSS alone, but its
  // media sizing stays in horizontal mode, so the images end up narrower than
  // the panels. Its own vertical orientation gets both right.
  const narrow = useMediaQuery("(max-width: 520px)");

  return (
    <article className="relative pb-24 pt-32 sm:pb-36 sm:pt-40">
      <div className="mx-auto max-w-[1400px] px-4 sm:px-6 lg:px-10">
        <Reveal distance={24} duration={0.7} ease="power3.out">
          <Link
            href="/#projects"
            className="type-data inline-flex min-h-11 items-center gap-2 text-fg-2 transition-colors hover:text-accent-text"
          >
            <ArrowLeft size={14} weight="bold" />
            All work
          </Link>
        </Reveal>

        <header className="mt-10">
          {reduceMotion ? (
            <h1 className="type-display text-[clamp(2.6rem,7vw,5.5rem)] text-fg">
              {project.title}
            </h1>
          ) : (
            <SplitText
              text={project.title}
              tag="h1"
              splitType="chars"
              delay={22}
              duration={0.9}
              ease="power3.out"
              from={{ opacity: 0, y: 60 }}
              to={{ opacity: 1, y: 0 }}
              className="type-display text-[clamp(2.6rem,7vw,5.5rem)] text-fg"
            />
          )}

          <Reveal distance={26} duration={0.8} ease="power3.out" delay={0.1}>
            <p className="type-lead mt-6 max-w-2xl">{project.subtitle}</p>
          </Reveal>
        </header>

        {/* Gallery. Hover expands on pointer devices; touch has no hover, so
            it falls back to tap-to-expand. */}
        <Reveal distance={40} duration={0.95} ease="power3.out" delay={0.16}>
          <div className="mt-14">
            <AccordionGallery
              items={getProjectGallery(project)}
              defaultIndex={(project.shots?.length ?? 4) < 3 ? 0 : 1}
              expandRatio={0.52}
              trigger={canHover ? "hover" : "click"}
              orientation={narrow ? "vertical" : "horizontal"}
              height={narrow ? 380 : 520}
              gap={8}
              radius={0}
              tilt={6}
              /* Previously: The page rule is that every photograph is desaturated... 
                 Changed per user request to display colored images. */
              grayscale={false}
              className=""
              accentColor="var(--accent)"
              overlayColor="var(--bg)"
              textColor="var(--fg)"
            />
          </div>
        </Reveal>

        <div className="mt-16 grid grid-cols-1 gap-12 lg:grid-cols-12 lg:gap-16">
          {/* Facts rail */}
          <Reveal
            distance={32}
            duration={0.85}
            ease="power3.out"
            className="lg:col-span-4"
          >
            <dl className="grid gap-6 sm:grid-cols-2 lg:sticky lg:top-28 lg:grid-cols-1">
              <Meta label="Category" value={project.category} />
              <Meta label="Year" value={project.year} />
              <Meta label="Status" value={project.status} />
            </dl>
          </Reveal>

          {/* Body */}
          <div className="lg:col-span-8">
            {reduceMotion ? (
              <p className="type-title text-[clamp(1.3rem,2.4vw,2rem)] leading-[1.3] text-fg">
                {project.description}
              </p>
            ) : (
              <ScrollReveal
                as="div"
                baseOpacity={0.12}
                baseRotation={1.2}
                blurStrength={3.5}
                rotationEnd="bottom 72%"
                wordAnimationEnd="bottom 68%"
                containerClassName="!my-0"
                textClassName="!type-title !text-[clamp(1.3rem,2.4vw,2rem)] !leading-[1.3] !text-fg"
              >
                {project.description}
              </ScrollReveal>
            )}

            <Reveal distance={32} duration={0.85} ease="power3.out">
              <section className="mt-20">
                <h2 className="type-data border-b border-line pb-5">
                  What it took
                </h2>
                <ol className="mt-8 grid gap-8">
                  {project.highlights.map((item, i) => (
                    <li key={item} className="flex gap-6">
                      <span className="type-data shrink-0 pt-1 text-accent-text">
                        {String(i + 1).padStart(2, "0")}
                      </span>
                      <p className="max-w-2xl text-[15px] leading-relaxed text-fg-2">
                        {item}
                      </p>
                    </li>
                  ))}
                </ol>
              </section>
            </Reveal>

            <Reveal distance={32} duration={0.85} ease="power3.out">
              <section className="mt-20">
                <h2 className="type-data border-b border-line pb-5">Stack</h2>
                <ul className="mt-8 flex flex-wrap gap-2">
                  {project.techStack.map((tech) => (
                    <li
                      key={tech}
                      className="pill border border-line px-4 py-2 font-mono text-[12px] text-fg-2"
                    >
                      {tech}
                    </li>
                  ))}
                </ul>
              </section>
            </Reveal>

            {(project.liveUrl || project.githubUrl) && (
              <Reveal distance={28} duration={0.8} ease="power3.out">
                <div className="mt-16 flex flex-wrap gap-3">
                  {project.liveUrl && (
                    <Magnet padding={70} magnetStrength={5} disabled={reduceMotion}>
                      <a
                        href={project.liveUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="pill group inline-flex min-h-11 items-center gap-2.5 bg-fg px-7 text-sm font-medium text-bg transition-colors hover:bg-accent hover:text-accent-ink"
                      >
                        Visit live site
                        <ArrowUpRight size={16} weight="bold" />
                      </a>
                    </Magnet>
                  )}
                  {project.githubUrl && (
                    <Magnet padding={70} magnetStrength={5} disabled={reduceMotion}>
                      <a
                        href={project.githubUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="pill inline-flex min-h-11 items-center gap-2.5 border border-line-strong px-7 text-sm font-medium text-fg transition-colors hover:border-accent hover:text-accent-text"
                      >
                        Source code
                        <ArrowUpRight size={16} weight="bold" />
                      </a>
                    </Magnet>
                  )}
                </div>
              </Reveal>
            )}
          </div>
        </div>

        {/* Prev / next */}
        <nav
          aria-label="More projects"
          className="mt-28 grid grid-cols-1 gap-px border-t border-line bg-line sm:mt-36 sm:grid-cols-2"
        >
          <Link
            href={`/work/${prev.id}`}
            className="group flex flex-col justify-between gap-8 bg-bg px-1 py-10 sm:px-7"
          >
            <span className="type-data inline-flex items-center gap-2 text-fg-3 transition-colors group-hover:text-accent-text">
              <ArrowLeft size={14} weight="bold" />
              Previous
            </span>
            <span className="type-title text-[clamp(1.3rem,2.6vw,2.1rem)] text-fg transition-colors group-hover:text-accent-text">
              {prev.title}
            </span>
          </Link>

          <Link
            href={`/work/${next.id}`}
            className="group flex flex-col justify-between gap-8 bg-bg px-1 py-10 sm:items-end sm:px-7 sm:text-right"
          >
            <span className="type-data inline-flex items-center gap-2 text-fg-3 transition-colors group-hover:text-accent-text">
              Next
              <ArrowRight size={14} weight="bold" />
            </span>
            <span className="type-title text-[clamp(1.3rem,2.6vw,2.1rem)] text-fg transition-colors group-hover:text-accent-text">
              {next.title}
            </span>
          </Link>
        </nav>
      </div>
    </article>
  );
}
