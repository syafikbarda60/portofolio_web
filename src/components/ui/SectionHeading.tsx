"use client";

import React from "react";
import { Reveal } from "@/components/ui/Reveal";
import { cn } from "@/lib/utils";

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

export function SectionHeading({
  title,
  lead,
  action,
  className,
}: SectionHeadingProps) {
  return (
    <Reveal distance={36} duration={0.85} ease="power3.out" threshold={0.15}>
      <div className={cn("mb-14 sm:mb-20", className)}>
        <h2 className="type-section max-w-[16ch] text-fg">{title}</h2>
        {lead && <p className="type-lead mt-6">{lead}</p>}
        {action && <div className="mt-9">{action}</div>}
      </div>
    </Reveal>
  );
}

/** Emphasis inside a headline. Same family, accent colour, never a second font. */
export function Em({ children }: { children: React.ReactNode }) {
  return <span className="text-accent-text">{children}</span>;
}
