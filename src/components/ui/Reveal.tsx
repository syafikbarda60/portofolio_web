"use client";

import React from "react";
import { motion } from "motion/react";
import { useReducedMotion } from "@/lib/useReducedMotion";

/**
 * Fade-and-rise on first entry into the viewport. One easing for the whole
 * site, so every section arrives the same way.
 */
export function Reveal({
  children,
  className,
  distance = 24,
  delay = 0,
}: {
  children: React.ReactNode;
  className?: string;
  distance?: number;
  delay?: number;
}) {
  const reduceMotion = useReducedMotion();

  if (reduceMotion) return <div className={className}>{children}</div>;

  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, y: distance }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.2 }}
      transition={{ duration: 0.7, delay, ease: [0.22, 1, 0.36, 1] }}
    >
      {children}
    </motion.div>
  );
}
