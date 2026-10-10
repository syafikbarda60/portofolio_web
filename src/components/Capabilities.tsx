"use client";

import { useLayoutEffect, useRef, useState } from "react";
import Image from "next/image";
import {
  motion,
  useScroll,
  useSpring,
  useTransform,
  type MotionValue,
} from "motion/react";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Reveal } from "@/components/ui/Reveal";
import { useReducedMotion } from "@/lib/useReducedMotion";

// Real captures under /public/work/<id>/, the same source the project pages use.
const IMG_STACK = "/work/drift/01.jpg";
const IMG_HARDWARE = "/work/swadaya-panen/01.jpg";
const IMG_LEAD = "/work/himaskom-profile/01.jpg";

type Panel = {
  title: string;
  body: string;
  meta: string;
  image?: string;
};

const PANELS: Panel[] = [
  {
    title: "Full-stack and backend",
    body: "High-throughput apps on Next.js, React, Node, and Laravel. Secure auth, WebSocket channels, versioned REST contracts, and normalised relational schemas.",
    meta: "Next.js, TypeScript, Laravel, MySQL",
    image: IMG_STACK,
  },
  {
    title: "Sensors, firmware, and models",
    body: "Microcontroller firmware for agricultural telemetry, thermal imaging CNNs for pest detection, and search-and-rescue robotics research at URDC Andromeda.",
    meta: "Swadaya Panen, NPK Analyzer, Rat Detection",
    image: IMG_HARDWARE,
  },
  {
    title: "Leading a student association",
    body: "Chief of the Organisational Management and Development Unit at HIMASKOM UNDIP for the 2025/26 term. Structural reform, KPI frameworks, and mentoring division leads through a full cycle.",
    meta: "Chief, OM&D Unit, HIMASKOM",
    image: IMG_LEAD,
  },
];

const TITLE = "What I work on";
const LEAD = "Three areas where the work has run in front of real users or out in the field.";

function PanelCard({ panel }: { panel: Panel }) {
  return (
    <article className="relative flex h-full flex-col justify-end overflow-hidden border border-line bg-surface p-7 sm:p-10">
      {panel.image && (
        <>
          <Image
            src={panel.image}
            alt=""
            fill
            sizes="(max-width: 768px) 88vw, 62vw"
            className="photo object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-bg via-bg/80 to-bg/20" />
        </>
      )}
      <div className="relative">
        <h3 className="type-title text-[clamp(1.6rem,3vw,2.6rem)] text-fg">{panel.title}</h3>
        <p className="mt-4 max-w-lg text-sm leading-relaxed text-fg-2 sm:text-[15px]">
          {panel.body}
        </p>
        <p className="type-data mt-6 text-fg-2">{panel.meta}</p>
      </div>
    </article>
  );
}

/**
 * One card on the horizontal track. Its 3D pose comes from how far its centre
 * sits from the viewport centre: cards turn away as they leave and face the
 * reader in the middle, and their copy rises in as they arrive.
 */
function TrackCard({
  panel,
  x,
  viewport,
}: {
  panel: Panel;
  x: MotionValue<number>;
  viewport: number;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const centre = useRef(0);

  useLayoutEffect(() => {
    const el = ref.current;
    if (!el) return;
    centre.current = el.offsetLeft + el.offsetWidth / 2;
  }, [viewport]);

  // -1 = one viewport to the left of centre, 0 = centred, 1 = one to the right.
  const d = useTransform(x, (v) =>
    viewport ? (centre.current + v - viewport / 2) / viewport : 1
  );
  const rotateY = useTransform(d, [-1, 0, 1], [32, 0, -32]);
  const scale = useTransform(d, [-1, 0, 1], [0.84, 1, 0.84]);
  const z = useTransform(d, [-1, 0, 1], [-220, 0, -220]);
  const opacity = useTransform(d, [-1.1, -0.6, 0, 0.6, 1.1], [0, 0.55, 1, 0.55, 0]);
  const contentOpacity = useTransform(d, [0.45, 0.1], [0, 1]);
  const contentY = useTransform(d, [0.45, 0.1], [36, 0]);

  return (
    <motion.div
      ref={ref}
      style={{ rotateY, scale, z, opacity }}
      className="h-[min(68dvh,40rem)] w-[86vw] shrink-0 md:w-[62vw] lg:w-[min(58vw,62rem)]"
    >
      <motion.div style={{ opacity: contentOpacity, y: contentY }} className="h-full">
        <PanelCard panel={panel} />
      </motion.div>
    </motion.div>
  );
}

export function Capabilities() {
  const reduceMotion = useReducedMotion();
  const section = useRef<HTMLElement>(null);
  const track = useRef<HTMLDivElement>(null);
  const [size, setSize] = useState({ distance: 0, viewport: 0, height: 0 });

  // The section is as tall as the horizontal travel, so one pixel scrolled
  // down moves the track one pixel sideways.
  useLayoutEffect(() => {
    if (reduceMotion) return;
    const measure = () => {
      const t = track.current;
      if (!t) return;
      // Travel until the last card sits in the middle of the viewport.
      const last = t.lastElementChild as HTMLElement | null;
      const end = last ? last.offsetLeft + last.offsetWidth / 2 : t.scrollWidth;
      const distance = Math.max(0, end - window.innerWidth / 2);
      setSize({ distance, viewport: window.innerWidth, height: window.innerHeight });
    };
    measure();
    const ro = new ResizeObserver(measure);
    if (track.current) ro.observe(track.current);
    window.addEventListener("resize", measure);
    return () => {
      ro.disconnect();
      window.removeEventListener("resize", measure);
    };
  }, [reduceMotion]);

  const { scrollYProgress } = useScroll({
    target: section,
    offset: ["start start", "end end"],
  });
  // A light spring on top of Lenis keeps the 3D turn from tracking every
  // wheel tick one-to-one.
  const progress = useSpring(scrollYProgress, { stiffness: 140, damping: 30, mass: 0.4 });
  const x = useTransform(progress, (p) => -p * size.distance);

  if (reduceMotion) {
    return (
      <section id="focus" className="relative py-24 sm:py-36">
        <div className="mx-auto max-w-[1400px] px-4 sm:px-6 lg:px-10">
          <SectionHeading title={TITLE} lead={LEAD} />
          <div className="grid gap-4">
            {PANELS.map((panel) => (
              <Reveal key={panel.title} className="h-[26rem]">
                <PanelCard panel={panel} />
              </Reveal>
            ))}
          </div>
        </div>
      </section>
    );
  }

  return (
    <section
      ref={section}
      id="focus"
      className="relative"
      style={{ height: size.height ? size.distance + size.height : "300vh" }}
    >
      <div className="sticky top-0 flex h-[100dvh] flex-col justify-center overflow-hidden [perspective:1400px]">
        <motion.div
          ref={track}
          style={{ x }}
          className="flex items-center gap-[4vw] pl-4 [transform-style:preserve-3d] sm:pl-6 lg:pl-10"
        >
          {/* Intro sits flat on the track and slides away first. */}
          <div className="w-[80vw] shrink-0 md:w-[34vw]">
            <h2 className="type-section max-w-[12ch] text-fg">{TITLE}</h2>
            <p className="type-lead mt-6">{LEAD}</p>
          </div>

          {PANELS.map((panel) => (
            <TrackCard key={panel.title} panel={panel} x={x} viewport={size.viewport} />
          ))}
        </motion.div>
      </div>
    </section>
  );
}
