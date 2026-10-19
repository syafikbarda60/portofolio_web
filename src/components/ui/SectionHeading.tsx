"use client";

import React from "react";
import { motion } from "motion/react";
import { Reveal } from "@/components/ui/Reveal";
import { useReducedMotion } from "@/lib/useReducedMotion";
import { cn } from "@/lib/utils";

/**
 * A chapter opener: the section's name at poster scale, rising out of a
 * clipped line the first time it scrolls into view. Every section on the
 * page opens with one, which is what gives the page its chaptered rhythm.
 */
export function ChapterTitle({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  const reduceMotion = useReducedMotion();
  // The trigger sits on the heading, not the line inside it: the line starts
  // translated out of the clipped box, so it never "intersects" by itself.
  return (
    <motion.h2
      className={cn("type-chapter overflow-hidden pb-[0.08em] text-fg", className)}
      initial={reduceMotion ? false : "hidden"}
      whileInView="shown"
      viewport={{ once: true, amount: 0.5 }}
    >
      <motion.span
        className="block"
        variants={{ hidden: { y: "105%" }, shown: { y: 0 } }}
        transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
      >
        {children}
      </motion.span>
    </motion.h2>
  );
}

interface SectionHeadingProps {
  title: React.ReactNode;
  lead?: string;
  /**
   * Interactive controls only (filters, tabs). Never a floating explainer
   * paragraph, which is what makes a section header read as templated.
   */
  action?: React.ReactNode;
  className?: string;
}

export function SectionHeading({ title, lead, action, className }: SectionHeadingProps) {
  return (
    <div className={cn("mb-14 sm:mb-20", className)}>
      <ChapterTitle>{title}</ChapterTitle>
      {(lead || action) && (
        <Reveal distance={20} delay={0.15}>
          {lead && <p className="type-lead mt-6">{lead}</p>}
          {action && <div className="mt-9">{action}</div>}
        </Reveal>
      )}
    </div>
  );
}

/** Emphasis inside a headline. Same family, accent colour, never a second font. */
export function Em({ children }: { children: React.ReactNode }) {
  return <span className="text-accent-text">{children}</span>;
}
