"use client";

import { motion, useTransform, type MotionValue } from "motion/react";

/**
 * The story at the end of the work corridor, in beats. Every line is drawn
 * from the portfolio's own data: roles, projects, and what they did.
 */
export const BEATS: { lead: string; body: string }[] = [
  {
    lead: "Most of what I build leaves the laptop.",
    body: "Sensor nodes standing in rice fields. An exam platform that watches every webcam and logs every tab switch. A CMS that a communications team uses to publish its own news and reports. The work only counts once it runs somewhere I am not.",
  },
  {
    lead: "It started with cables, not code.",
    body: "Before university I kept a factory's network up at PT SidoAgung Farm: chasing slow links, rolling out new nodes, diagnosing hardware for the people on the floor. That is where I learned that systems break in the field, not in the demo.",
  },
  {
    lead: "So I build the whole path.",
    body: "Firmware on an ESP32, the API that receives its readings, the dashboard that makes sense of them. When rats move through a paddy at night, the node trips its ultrasonic repellers and the dashboard ranks the hot spots. When a student leaves the exam tab, the proctor sees it live.",
  },
  {
    lead: "And I build it to outlast the handover.",
    body: "Clear contracts between services, schemas that stay readable, tools other people can run. The same goes for people: as chief of HIMASKOM's organizational development unit, I founded a division that evaluates member performance and helps it grow.",
  },
  {
    lead: "Next, I want to do it with your team.",
    body: "I study Computer Engineering at Diponegoro University and I am open to internships, remote or on site. If what you build has to hold up in front of real users, real sensors, or both, I would like to be part of it.",
  },
];

/** The whole story as one string, for screen readers. */
export const STORY_TEXT = BEATS.map((b) => `${b.lead} ${b.body}`).join(" ");

// Sizes follow the screen's height as well as its width, so every beat fits
// the pinned stage, short laptop screens included.
export const LEAD_CLASS =
  "type-title text-[clamp(2.6rem,min(7.2vw,10vh),7rem)] leading-[1.02] tracking-[-0.025em] text-fg";
export const BODY_CLASS =
  "type-title text-[clamp(1.45rem,min(3.4vw,5vh),3.1rem)] leading-[1.22] tracking-[-0.01em] text-fg";

const ramp = (a: number, b: number, v: number) => Math.min(1, Math.max(0, (v - a) / (b - a)));

function Word({ word, start, end, progress }: { word: string; start: number; end: number; progress: MotionValue<number> }) {
  const opacity = useTransform(progress, (v) => ramp(start, end, v));
  const filter = useTransform(progress, (v) => `blur(${((1 - ramp(start, end, v)) * 6).toFixed(2)}px)`);
  const y = useTransform(progress, (v) => (1 - ramp(start, end, v)) * 10);
  return (
    <motion.span className="inline-block" style={{ opacity, filter, y }}>
      {word}
    </motion.span>
  );
}

/**
 * One beat on its stretch [s0, s1] of the story's progress: the lead line
 * arrives (the first one is there from the start), the body clears in word
 * by word, and the beat lifts away to make room for the next one.
 */
function Beat({
  beat,
  index,
  count,
  progress,
}: {
  beat: { lead: string; body: string };
  index: number;
  count: number;
  progress: MotionValue<number>;
}) {
  const s0 = index / count;
  const s1 = (index + 1) / count;
  const at = (f: number) => s0 + (s1 - s0) * f;
  const first = index === 0;
  const last = index === count - 1;

  const enter = (v: number) => (first ? 1 : ramp(at(0), at(0.12), v));
  const leave = (v: number) => (last ? 0 : ramp(at(0.86), at(1), v));
  const opacity = useTransform(progress, (v) => enter(v) * (1 - leave(v)));
  const y = useTransform(progress, (v) => (1 - enter(v)) * 40 - leave(v) * 60);

  const words = beat.body.split(" ");
  const bodyStart = at(first ? 0.04 : 0.14);
  const bodyEnd = at(0.74);
  const step = (bodyEnd - bodyStart) / words.length;

  return (
    <motion.div className="[grid-area:1/1]" style={{ opacity, y }} aria-hidden>
      <p className={LEAD_CLASS}>{beat.lead}</p>
      <p className={`${BODY_CLASS} mt-[min(2.5rem,4vh)] max-w-[60rem]`}>
        {words.map((w, i) => (
          <span key={i}>
            <Word word={w} start={bodyStart + i * step} end={bodyStart + i * step + step * 5} progress={progress} />
            {i < words.length - 1 ? " " : ""}
          </span>
        ))}
      </p>
    </motion.div>
  );
}

/**
 * The story, beat by beat, as `progress` goes 0 to 1. All beats share one
 * grid cell so the stage keeps the height of the tallest. Driven by a motion
 * value rather than its own scroll trigger, so it works inside a pinned stage.
 */
export function StatementReveal({ progress }: { progress: MotionValue<number> }) {
  return (
    <div className="grid">
      <p className="sr-only">{STORY_TEXT}</p>
      {BEATS.map((beat, i) => (
        <Beat key={i} beat={beat} index={i} count={BEATS.length} progress={progress} />
      ))}
    </div>
  );
}

/** The same story, static, for reduced motion. */
export function StatementStatic() {
  return (
    <div className="grid gap-16">
      {BEATS.map((beat, i) => (
        <div key={i}>
          <p className={LEAD_CLASS}>{beat.lead}</p>
          <p className={`${BODY_CLASS} mt-6 max-w-[60rem]`}>{beat.body}</p>
        </div>
      ))}
    </div>
  );
}
